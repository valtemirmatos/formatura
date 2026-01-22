document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO CARROSSEL DE PORTFÓLIO ---
    const slider = document.querySelector('.carousel-slider');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    
    // SEUS DADOS AQUI: Verifique se os nomes das suas fotos correspondem a estes.
    // Se suas fotos forem .png ou .jpeg, altere aqui. Ex: 'foto1.png'
    const images = [
        'img/foto1.jpg', 'img/foto2.jpg', 'img/foto3.jpg', 'img/foto4.jpg', 'img/foto5.jpg', 'img/foto6.jpg', 'img/foto7.jpg', 'img/foto8.jpg', 'img/foto9.jpg', 'img/foto10.jpg'
    ];
    let currentIndex = 0;
    let autoSlideInterval;

    function initCarousel() {
    // Limpa o conteúdo para evitar duplicação
    slider.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Cria os slides de imagem com a estrutura correta
    images.forEach(imgSrc => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide'); // Cria a div que envolve a imagem

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = "Foto de formatura em estúdio";

        slide.appendChild(img); // Coloca a imagem dentro da div
        slider.appendChild(slide); // Coloca a div no slider
    });

    // Cria as bolinhas de navegação
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });

    updateCarousel();
    startAutoSlide();
}

    function updateCarousel() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(showNextSlide, 4000); // Muda a cada 4 segundos
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    prevButton.addEventListener('click', () => {
        showPrevSlide();
        resetAutoSlide();
    });

    nextButton.addEventListener('click', () => {
        showNextSlide();
        resetAutoSlide();
    });

    // --- LÓGICA DO FORMULÁRIO PARA WHATSAPP ---
    const orcamentoForm = document.getElementById('orcamento-form');
    orcamentoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // SEUS DADOS AQUI: Substitua pelo seu número de telefone com código do país e DDD
        const seuNumeroWhatsApp = '5511912345678'; 

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;

        const textoWhatsApp = `Olá! Gostaria de um orçamento personalizado.\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n*Detalhes:* ${mensagem}`;
        
        const linkWhatsApp = `https://wa.me/${seuNumeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;
        
        window.open(linkWhatsApp, '_blank');
    });

    // --- LÓGICA DO SISTEMA DE AVALIAÇÃO ---
    const avaliacaoForm = document.getElementById('avaliacao-form');
    const estrelasInput = document.querySelectorAll('.estrelas-input .fa-star');
    const notaInput = document.getElementById('nota-avaliacao');
    const listaAvaliacoes = document.getElementById('lista-avaliacoes');

    // Eventos para o efeito hover das estrelas
    estrelasInput.forEach(estrela => {
        estrela.addEventListener('mouseover', function() {
            resetarEstrelas();
            const valor = this.dataset.value;
            for (let i = 0; i < valor; i++) {
                estrelasInput[i].classList.add('hover');
            }
        });

        estrela.addEventListener('mouseout', resetarEstrelas);

        estrela.addEventListener('click', function() {
            const valor = this.dataset.value;
            notaInput.value = valor;
            resetarEstrelas();
            for (let i = 0; i < valor; i++) {
                estrelasInput[i].classList.add('selecionada');
            }
        });
    });

    function resetarEstrelas() {
        estrelasInput.forEach(estrela => {
            estrela.classList.remove('hover');
        });
    }

    // Carregar avaliações salvas no navegador
    function carregarAvaliacoes() {
        const avaliacoes = JSON.parse(localStorage.getItem('avaliacoesSite') || '[]');
        listaAvaliacoes.innerHTML = '';
        avaliacoes.forEach(avaliacao => {
            adicionarAvaliacaoDOM(avaliacao);
        });
    }

    // Adicionar uma avaliação na tela
    function adicionarAvaliacaoDOM(avaliacao) {
        const card = document.createElement('div');
        card.classList.add('avaliacao-card');

        let estrelasHTML = '';
        for (let i = 0; i < 5; i++) {
            estrelasHTML += `<i class="fa-${i < avaliacao.nota ? 'solid' : 'regular'} fa-star"></i>`;
        }
        
        card.innerHTML = `
            <h4>${avaliacao.nome}</h4>
            <div class="estrelas-display">${estrelasHTML}</div>
            <p>"${avaliacao.comentario}"</p>
        `;
        listaAvaliacoes.appendChild(card);
    }

    // Salvar nova avaliação
    avaliacaoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const novaAvaliacao = {
            nome: document.getElementById('cliente-nome').value,
            nota: parseInt(notaInput.value),
            comentario: document.getElementById('comentario-avaliacao').value
        };

        if (novaAvaliacao.nota === 0) {
            alert('Por favor, selecione uma nota de 1 a 5 estrelas.');
            return;
        }

        // Adiciona a nova avaliação na tela
        adicionarAvaliacaoDOM(novaAvaliacao);

        // Salva no localStorage
        const avaliacoesSalvas = JSON.parse(localStorage.getItem('avaliacoesSite') || '[]');
        avaliacoesSalvas.push(novaAvaliacao);
        localStorage.setItem('avaliacoesSite', JSON.stringify(avaliacoesSalvas));

        // Limpa o formulário
        avaliacaoForm.reset();
        estrelasInput.forEach(estrela => estrela.classList.remove('selecionada'));
    });

    // Iniciar tudo
    initCarousel();
    carregarAvaliacoes();

});

