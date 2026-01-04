// ==UserScript==
// @name         Auto Like for Tinder com Fechamento Automático do Modal
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Script para clicar automaticamente no botão de "Like", fechar o modal automaticamente, mover o contador e o botão de pausar juntos, e pausar o script.
// @author       Srmura
// @match        https://tinder.com/app/recs
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519086/Auto%20Like%20for%20Tinder%20com%20Fechamento%20Autom%C3%A1tico%20do%20Modal.user.js
// @updateURL https://update.greasyfork.org/scripts/519086/Auto%20Like%20for%20Tinder%20com%20Fechamento%20Autom%C3%A1tico%20do%20Modal.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Definição inicial dos seletores
    let likeButtonSelector = '#main-content > div.H\\(100\\%\\) > div > div > div > div.Pos\\(r\\).Expand.H\\(--recs-card-height\\)--ml.Maw\\(--recs-card-width\\)--ml.Mt\\(a\\) > div > div > div.Pos\\(a\\).B\\(0\\).Iso\\(i\\).W\\(100\\%\\).Start\\(0\\).End\\(0\\).TranslateY\\(55\\%\\) > div > div:nth-child(4) > button';
    let modalCloseButtonSelector = '#t-1142746548 > div > div > button.c1p6lbu0.D\\(b\\).My\\(20px\\).Mx\\(a\\)';

    // Função para atualizar os seletores
    function updateSelectors() {
        // Aqui você pode atualizar os seletores manualmente se necessário
        console.log('Seletores atualizados:', likeButtonSelector, modalCloseButtonSelector);
    }

    // Configurações do script
    const interval = 500; // Intervalo de 500ms entre verificações
    const maxMissedAttempts = 5; // Número máximo de tentativas consecutivas sem encontrar o botão antes de recarregar a página
    let missedAttempts = 0; // Contador de tentativas consecutivas sem sucesso
    let likesCount = parseInt(localStorage.getItem('likesCount')) || 0; // Recupera o número de likes armazenados ou começa de 0
    let isPaused = false; // Flag para pausar/continuar o script

    // Criação do contêiner para o contador e o botão de pausar
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    document.body.appendChild(container);

    // Criação de um elemento para mostrar o número de likes na página
    const likeCounter = document.createElement('div');
    likeCounter.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    likeCounter.style.color = 'white';
    likeCounter.style.padding = '10px';
    likeCounter.style.borderRadius = '5px';
    likeCounter.style.marginBottom = '10px';
    container.appendChild(likeCounter);

    // Função para atualizar a contagem de likes na página
    function updateLikeCounter() {
        likeCounter.textContent = `Likes feitos: ${likesCount}`;
    }

    // Criação do botão de pausar/continuar
    const pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pausar';
    pauseButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    pauseButton.style.color = 'white';
    pauseButton.style.padding = '10px';
    pauseButton.style.borderRadius = '5px';
    container.appendChild(pauseButton);

    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused; // Alterna entre pausar e continuar
        pauseButton.textContent = isPaused ? 'Continuar' : 'Pausar'; // Altera o texto do botão
    });

    // Função para gerar o seletor do botão de "Like"
    function getLikeButton() {
        return document.querySelector(likeButtonSelector);
    }

    // Função para fechar o modal automaticamente
    function closeModal() {
        const modalButton = document.querySelector(modalCloseButtonSelector);
        if (modalButton) {
            modalButton.click();
            console.log("Modal fechado automaticamente.");
        }
    }

    // Função para executar o "autoLike"
    function autoLike() {
        if (isPaused) return; // Se o script estiver pausado, não faz nada

        // Fecha o modal, se ele estiver aberto
        closeModal();

        const likeButton = getLikeButton();

        if (likeButton) {
            console.log("Botão de Like encontrado.");
            if (likeButton.offsetParent !== null) {
                likeButton.click();
                likesCount++;
                localStorage.setItem('likesCount', likesCount); // Armazena o número de likes
                missedAttempts = 0; // Reseta tentativas consecutivas sem sucesso
                updateLikeCounter(); // Atualiza a contagem na página
                console.log(`Botão de Like clicado com sucesso! Total de likes: ${likesCount}`);
            } else {
                console.log('Botão de Like está invisível. Tentando novamente...');
                missedAttempts++;
            }
        } else {
            console.log('Botão de Like não encontrado. Tentando novamente...');
            missedAttempts++;
        }

        // Verifica se deve recarregar a página
        if (missedAttempts >= maxMissedAttempts) {
            console.log(`Botão não encontrado após ${missedAttempts} tentativas consecutivas. Recarregando a página...`);
            location.reload(); // Recarrega a página
        }
    }

    // Inicia o processo com intervalos
    setInterval(autoLike, interval);

    // Atualiza a contagem inicial
    updateLikeCounter();

    // Função para permitir mover o contêiner (contador + botão de pausar) livremente
    let offsetX = 0, offsetY = 0;

    container.addEventListener('mousedown', (e) => {
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        document.addEventListener('mousemove', moveContainer);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', moveContainer);
        });
    });

    function moveContainer(e) {
        container.style.left = `${e.clientX - offsetX}px`;
        container.style.top = `${e.clientY - offsetY}px`;
    }

    // Criação do botão para atualizar os seletores manualmente
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Atualizar Seletores';
    updateButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    updateButton.style.color = 'white';
    updateButton.style.padding = '10px';
    updateButton.style.borderRadius = '5px';
    updateButton.style.marginTop = '10px';
    container.appendChild(updateButton);

    // Adiciona o evento de clique ao botão de atualizar seletores
    updateButton.addEventListener('click', () => {
        updateSelectors(); // Atualiza os seletores manualmente
        alert('Seletores atualizados!');
    });
})();
