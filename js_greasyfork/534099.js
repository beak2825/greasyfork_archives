// ==UserScript==
// @name         Modo Teatro Globo Play
// @namespace    https://greasyfork.org/users/425245
// @version      0.1.1
// @description  Adiciona um botão de 'Modo Teatro' para os vídeos, ocultando alguns elementos e ampliando a área do vídeo.
// @match        https://globoplay.globo.com/v/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=globoplay.globo.com/
// @author       raianwz
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534099/Modo%20Teatro%20Globo%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/534099/Modo%20Teatro%20Globo%20Play.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const getElement = selector => document.querySelector(selector);
    let theaterModeActive = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForElement(selector, maxAttempts = 50, interval = 500) {
        let attempt = 0;
        while (attempt < maxAttempts) {
            const el = getElement(selector);
            if (el) return el;
            await sleep(interval);
            attempt++;
        }
        return null;
    }

    function injectCSS() {
        const styleId = 'theater-mode-styles';
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .theater-mode-active .player-area {
                width: 85vw !important;
                height: 100% !important;
            }
            .theater-mode-active .video-area {
                display: flex !important;
                align-items: center !important;
            }
            .theater-mode-active .playlist-area {
                display: none !important;
            }
            .theater-mode-active .header-container {
                display: none !important;
            }
            .theater-mode-active .header__placeholder {
                height: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    async function createTheaterButton() {
        const fullscreenBtn = await waitForElement('button[data-fullscreen]');
        if (!fullscreenBtn) {
            return;
        }
        if (getElement('#theaterModeBtn')) return;
        const theaterBtnHTML = `
            <button id="theaterModeBtn" class="chromecast-button media-control-button media-control-element theater-mode">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="8 8 25 20" style="width: 25px;">
                    <g fill="none" fill-rule="evenodd">
                        <path fill="#FFF" d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z"></path>
                    </g>
                </svg>
                <span class="visually-hidden">Modo Teatro</span>
            </button>
        `;
        fullscreenBtn.insertAdjacentHTML('beforeBegin', theaterBtnHTML);
        const theaterButton = getElement('#theaterModeBtn');
        if (theaterButton) {
            theaterButton.addEventListener("click", toggleTheaterMode);
            fullscreenBtn.addEventListener("click", () => {
                theaterButton.style.display =
                    theaterButton.style.display === "" ? "none" : "";
            });
            console.log('[DEBUG] Botão Modo Teatro criado');
        }
    }
    function toggleTheaterMode() {
        document.body.classList.toggle('theater-mode-active');
        theaterModeActive = document.body.classList.contains('theater-mode-active');
        return theaterModeActive;
    }

    // Inicializa um MutationObserver para detectar alterações na área do player.
    async function initMutationObserver() {
        const playerArea = await waitForElement('div.player-area');
        if (!playerArea) {
            console.warn("[DEBUG] Elemento 'div.player-area' não encontrado.");
            return;
        }

        const observer = new MutationObserver(() => {
            if (!getElement('#theaterModeBtn')) {
                createTheaterButton();
            }
        });
        observer.observe(playerArea, { childList: true, subtree: true });
    }

    async function init() {
        injectCSS();
        await createTheaterButton();
        await initMutationObserver();
    }

    window.addEventListener('load', init);
    if (document.readyState === "complete") init();

})();
