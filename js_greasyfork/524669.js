// ==UserScript==
// @name        [YouTube] Open Shorts on Default Watch
// @author      pootz10
// @namespace   https://www.tampermonkey.net
// @description redirects shorts link to default watch?v=
// @match       https://www.youtube.com/shorts/*
// @exclude     https://www.youtube.com/watch?v=*
// @exclude     https://youtu.be/*
// @version     1.1
// @history     1.1 - added exclude for watch?v= links
// @license     GNU
// @grant       GM_openInTab
// @grant       GM_addStyle
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/524669/%5BYouTube%5D%20Open%20Shorts%20on%20Default%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/524669/%5BYouTube%5D%20Open%20Shorts%20on%20Default%20Watch.meta.js
// ==/UserScript==


// Função para criar o botão
function addWatchButton() {
    const actionsElement = document.querySelector('#actions');
    if (!actionsElement) return; // Sai se o elemento não existir

    // Evita adicionar múltiplos botões
    if (document.querySelector('#custom-watch-button')) return;

    // Cria o botão
    const button = document.createElement('button');
    button.id = 'custom-watch-button';
    button.textContent = 'Watch';

    // Ação ao clicar no botão
    button.addEventListener('click', () => {
        const urlParams = new URL(location.href);
        const videoId = urlParams.pathname.split('/')[2];
        if (videoId) {
            const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
            GM_openInTab(watchUrl, { active: true });
        }
    });

    // Insere o botão no início das ações
    actionsElement.prepend(button);
}

// Observa mudanças no DOM para detectar o carregamento do elemento
const observer = new MutationObserver(() => {
    addWatchButton();
});

observer.observe(document.body, { childList: true, subtree: true });

// Adiciona botão imediatamente caso o elemento já esteja carregado
addWatchButton();

GM_addStyle(`
    #custom-watch-button {
        color: #0f0f0f;
        background: rgba(0, 0, 0, 0.05);
        width: 48px;
        height: 48px;
        padding: 0;
        font-size: 12px;
        font-family: "Roboto", "Arial", sans-serif;
        font-weight: 500;
        line-height: 18px;
        border: none;
        border-radius: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        margin: 0;
        text-transform: none;
    }

    #custom-watch-button:hover {
        background: rgba(0, 0, 0, 0.1); /* Ajuste para hover */
    }
`);