// ==UserScript==
// @name         BF - Link Shortener with Is Gd
// @name:pt-BR   BF - Encurtador de Links
// @namespace    https://github.com/BrunoFortunatto
// @version      1.3
// @description  Adds an option to the Tampermonkey menu to shorten links with is.gd, optimized for mobile, with an elegant design.
// @description:pt-BR Adiciona uma opção ao menu do Tampermonkey para encurtar links da página atual usando is.gd, otimizado para dispositivos móveis e com um design moderno e elegante.
// @author       Bruno Fortunato
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      is.gd
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537623/BF%20-%20Link%20Shortener%20with%20Is%20Gd.user.js
// @updateURL https://update.greasyfork.org/scripts/537623/BF%20-%20Link%20Shortener%20with%20Is%20Gd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Garante que o script só seja executado no frame principal (evita duplicação em iframes)
    if (window.top !== window.self) {
        return;
    }

    // Adiciona opção ao menu do Tampermonkey
    GM_registerMenuCommand("🔗 Encurtar Link", showOverlay);

    function showOverlay() {
        // Se já existe um overlay, remove para evitar duplicatas
        const existingOverlay = document.getElementById('isgd-shortener-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        let overlay = document.createElement('div');
        overlay.id = 'isgd-shortener-overlay'; // Adiciona um ID para fácil referência
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7); /* Fundo mais escuro */
            z-index: 2147483647; /* VALOR MÁXIMO POSSÍVEL PARA Z-INDEX */
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0; /* Começa invisível */
            transition: opacity 0.3s ease-in-out; /* Transição de fade-in */
            font-family: 'Segoe UI', 'Roboto', sans-serif; /* Fonte mais moderna */
            backdrop-filter: blur(5px); /* Efeito de desfoque no fundo */
        `;
        // Força o reflow para a transição funcionar
        void overlay.offsetWidth;
        overlay.style.opacity = '1';

        let box = document.createElement('div');
        box.style.cssText = `
            background: #282C34; /* Fundo mais escuro e elegante para a caixa */
            color: #E0E0E0; /* Cor do texto mais suave */
            padding: 30px; /* Mais padding */
            border-radius: 15px; /* Bordas mais arredondadas */
            box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.6); /* Sombra mais pronunciada */
            text-align: center;
            width: 90%;
            max-width: 400px; /* Aumenta um pouco a largura máxima */
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translateY(20px); /* Começa um pouco abaixo */
            opacity: 0; /* Começa invisível */
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; /* Transição para a caixa */
        `;
        // Força o reflow para a transição funcionar
        void box.offsetWidth;
        box.style.opacity = '1';
        box.style.transform = 'translateY(0)';


        let title = document.createElement('h2');
        title.innerText = '🔗 Link Encurtado';
        title.style.cssText = `
            color: #61AFEF; /* Um tom de azul para o título */
            font-size: 24px; /* Tamanho maior para o título */
            margin-bottom: 20px;
            font-weight: 600; /* Mais negrito */
            display: flex;
            align-items: center;
            gap: 10px; /* Espaço entre o ícone e o texto */
        `;
        box.appendChild(title);

        let loadingText = document.createElement('p');
        loadingText.innerText = 'Gerando link curto...';
        loadingText.style.cssText = `
            color: #ABB2BF; /* Cor suave para o texto de carregamento */
            font-size: 16px;
            margin-bottom: 20px;
        `;
        box.appendChild(loadingText);

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://is.gd/create.php?format=simple&url=${encodeURIComponent(window.location.href)}`,
            onload: function(response) {
                loadingText.remove(); // Remove o texto de carregamento

                let shortLink = document.createElement('input');
                shortLink.value = response.responseText;
                shortLink.style.cssText = `
                    width: 100%;
                    padding: 12px 15px; /* Mais padding */
                    margin-bottom: 20px;
                    border: 1px solid #4B5263; /* Borda sutil */
                    border-radius: 8px; /* Bordas mais arredondadas */
                    background: #3B4048; /* Fundo mais escuro para o input */
                    color: #98C379; /* Cor verde para o link */
                    text-align: center;
                    font-size: 17px; /* Tamanho da fonte levemente maior */
                    font-weight: 500;
                    cursor: text;
                    box-sizing: border-box; /* Inclui padding na largura */
                    transition: all 0.2s ease-in-out;
                `;
                shortLink.readOnly = true;
                shortLink.onclick = function() {
                    this.select(); // Seleciona o texto ao clicar
                };
                shortLink.onfocus = function() {
                     this.style.borderColor = '#61AFEF'; /* Borda azul ao focar */
                };
                shortLink.onblur = function() {
                     this.style.borderColor = '#4B5263'; /* Volta à cor original */
                };
                box.appendChild(shortLink);

                let buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    gap: 10px; /* Espaço entre os botões */
                `;
                box.appendChild(buttonContainer);

                let copyButton = document.createElement('button');
                copyButton.innerText = '📋 Copiar Link';
                copyButton.style.cssText = `
                    width: 100%;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    background: #C678DD; /* Roxo para o botão copiar */
                    color: #FFFFFF;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.2s ease-in-out, transform 0.1s ease-in-out;
                `;
                copyButton.onmouseover = () => copyButton.style.background = '#9963B5';
                copyButton.onmouseout = () => copyButton.style.background = '#C678DD';
                copyButton.onmousedown = () => copyButton.style.transform = 'scale(0.98)';
                copyButton.onmouseup = () => copyButton.style.transform = 'scale(1)';

                copyButton.onclick = function() {
                    shortLink.select();
                    document.execCommand('copy');
                    copyButton.innerText = '✅ Copiado!';
                    copyButton.style.background = '#98C379'; // Verde ao copiar
                    setTimeout(() => {
                        copyButton.innerText = '📋 Copiar Link';
                        copyButton.style.background = '#C678DD';
                    }, 2000);
                };
                buttonContainer.appendChild(copyButton);

                let shareButton = document.createElement('button');
                shareButton.innerText = '📤 Compartilhar';
                shareButton.style.cssText = `
                    width: 100%;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    background: #56B6C2; /* Ciano para o botão compartilhar */
                    color: #FFFFFF;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.2s ease-in-out, transform 0.1s ease-in-out;
                `;
                shareButton.onmouseover = () => shareButton.style.background = '#458E97';
                shareButton.onmouseout = () => shareButton.style.background = '#56B6C2';
                shareButton.onmousedown = () => shareButton.style.transform = 'scale(0.98)';
                shareButton.onmouseup = () => shareButton.style.transform = 'scale(1)';

                shareButton.onclick = function() {
                    if (navigator.share) {
                        navigator.share({
                            title: 'Link Encurtado',
                            text: 'Aqui está seu link encurtado:',
                            url: shortLink.value
                        }).catch(error => console.log('Erro ao compartilhar:', error));
                    } else {
                        alert('Compartilhamento não suportado neste navegador. Você pode copiar o link manualmente.');
                    }
                };
                buttonContainer.appendChild(shareButton);

                let closeButton = document.createElement('button');
                closeButton.innerText = '❌ Fechar';
                closeButton.style.cssText = `
                    width: 100%;
                    margin-top: 20px; /* Mais espaço acima do botão fechar */
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    background: #E06C75; /* Vermelho suave para o botão fechar */
                    color: #FFFFFF;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.2s ease-in-out, transform 0.1s ease-in-out;
                `;
                closeButton.onmouseover = () => closeButton.style.background = '#C15C65';
                closeButton.onmouseout = () => closeButton.style.background = '#E06C75';
                closeButton.onmousedown = () => closeButton.style.transform = 'scale(0.98)';
                closeButton.onmouseup = () => closeButton.style.transform = 'scale(1)';

                closeButton.onclick = function() {
                    // Transição de fade-out ao fechar
                    box.style.opacity = '0';
                    box.style.transform = 'translateY(20px)';
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(overlay);
                    }, 300); // Espera a transição terminar antes de remover
                };
                box.appendChild(closeButton);
            }
        });

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Adiciona um listener para fechar o overlay ao clicar fora da caixa
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                // Simula o clique no botão de fechar
                const closeBtn = box.querySelector('button[onclick*="document.body.removeChild(overlay)"]');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        });
    }

})();