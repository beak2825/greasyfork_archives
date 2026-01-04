// ==UserScript==
// @name         DexScreener And Meteora Two Buttons Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Добавляет кнопки на DexScreener и Meteora Edge для перехода к gmgn.ai
// @author       @teggyt
// @match        https://dexscreener.com/*
// @match        https://edge.meteora.ag/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525533/DexScreener%20And%20Meteora%20Two%20Buttons%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/525533/DexScreener%20And%20Meteora%20Two%20Buttons%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLES = `
        .custom-button {
            margin-left: 5px;
            padding: 5px 8px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
            text-decoration: none;
            display: inline-block;
        }
        .custom-button.meteora {
            background-color: #4CAF50;
        }
        .custom-button.gmgn {
            background-color: #FF9800;
        }
        .custom-button:hover {
            opacity: 0.8;
        }
        .button-container {
            display: flex;
            align-items: center;
            margin-top: 5px;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = STYLES;
    document.head.appendChild(styleElement);

    function createButton(text, href, className = '') {
        const button = document.createElement('a');
        button.className = `custom-button ${className}`;
        button.textContent = text;
        button.href = href;
        button.target = '_blank';
        return button;
    }

    function handleDexScreener() {
        const explorerLinks = document.querySelectorAll('a.chakra-link.chakra-button[title="Open in block explorer"]');

        explorerLinks.forEach(link => {
            if (link.dataset.buttonsAdded) return;
            link.dataset.buttonsAdded = true;

            const href = link.getAttribute('href');
            if (!href) return;

            const address = href.split('/').pop();
            if (!address) return;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            if (href.includes('/account/')) {
                const meteoraLink = `https://app.meteora.ag/dlmm/${address}`;
                const meteoraButton = createButton('Meteora', meteoraLink, 'meteora');
                buttonContainer.appendChild(meteoraButton);
            } else if (href.includes('/token/')) {
                const gmgnLink = `https://gmgn.ai/sol/token/${address}`;
                const gmgnButton = createButton('GMGN', gmgnLink, 'gmgn');
                buttonContainer.appendChild(gmgnButton);
            }

            if (buttonContainer.children.length > 0) {
                link.parentNode.insertBefore(buttonContainer, link.nextSibling);
            }
        });
    }

    function handleMeteora() {
        // Ищем ссылку на SolScan
        const solscanLinks = document.querySelectorAll('a[href^="https://solscan.io/token/"]');

        solscanLinks.forEach(link => {
            if (link.dataset.buttonsAdded) return;
            link.dataset.buttonsAdded = true;

            const href = link.getAttribute('href');
            const tokenAddress = href.split('/token/')[1];

            if (tokenAddress) {
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';

                const gmgnLink = `https://gmgn.ai/sol/token/${tokenAddress}`;
                const gmgnButton = createButton('GMGN', gmgnLink, 'gmgn');

                buttonContainer.appendChild(gmgnButton);

                // Добавляем после родительского элемента ссылки
                const parentElement = link.parentElement;
                if (parentElement) {
                    parentElement.insertAdjacentElement('afterend', buttonContainer);
                }
            }
        });
    }

    function checkForElements() {
        const MAX_ATTEMPTS = 20;
        let attempts = 0;

        const interval = setInterval(() => {
            if (window.location.hostname === 'dexscreener.com') {
                const links = document.querySelectorAll('a.chakra-link.chakra-button[title="Open in block explorer"]');
                if (links.length > 0) {
                    handleDexScreener();
                    clearInterval(interval);
                }
            } else if (window.location.hostname === 'edge.meteora.ag') {
                const links = document.querySelectorAll('a[href^="https://solscan.io/token/"]');
                if (links.length > 0) {
                    handleMeteora();
                    clearInterval(interval);
                }
            }

            attempts++;
            if (attempts >= MAX_ATTEMPTS) {
                clearInterval(interval);
            }
        }, 500);
    }

    // Запускаем первоначальную проверку
    checkForElements();

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                if (window.location.hostname === 'dexscreener.com') {
                    handleDexScreener();
                } else if (window.location.hostname === 'edge.meteora.ag') {
                    handleMeteora();
                }
            }
        });
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
})();