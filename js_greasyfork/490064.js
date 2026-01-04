// ==UserScript==
// @name         GuessThe.Game - Stream Marathon
// @version      1.0.3
// @description  GuessThe.Game Stream Marathon - It counts the number of games you played and the number of games you lost (+Improved UI)
// @author       Noble
// @match        https://guessthe.game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=guessthe.game
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/490064/GuessTheGame%20-%20Stream%20Marathon.user.js
// @updateURL https://update.greasyfork.org/scripts/490064/GuessTheGame%20-%20Stream%20Marathon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
    }

    addGlobalStyle(`
        p.countdown-label, .footer p:last-of-type, .copy-to-clipboard, .game-info, ._wrapper, .fs-sticky-footer, #pmLink, .bl-a, .socials {
            display:none!important;
        }
        .result > div:nth-of-type(3), .result iframe {
            display: none!important;
        }
        .countdown-to-next-game {
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            font-weight: 800;
            margin: 5px;
        }
        .footer {
            margin-bottom: auto;
        }
    `);

    function exibirJogosJogados() {
        const totalDeJogos = 673;
        let jogosErrados = 0;
        let jogosJogadosSet = new Set();

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes("_gamestate")) {
                const [id,] = key.split('_');
                const gameState = localStorage.getItem(key);

                if (!jogosJogadosSet.has(id)) {
                    jogosJogadosSet.add(id);
                    if (gameState === "lose") {
                        jogosErrados++;
                    }
                }
            }
        }

        const jogosJogados = jogosJogadosSet.size;
        const div = document.createElement('div');
        div.style = 'position: absolute; left: 150px; top: 300px; background-color: #059669; padding: 10px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.2); color: #fff';
        div.innerHTML = `<strong>Games played:</strong> ${jogosJogados} / ${totalDeJogos}<br><strong>Games lost:</strong> ${jogosErrados}`;

        document.body.appendChild(div);
    }

    function updateCountdownText() {
        const countdownElement = document.querySelector('.countdown-to-next-game');
        if (countdownElement) {
            countdownElement.textContent = 'NEXT GAME';
        }
    }

    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) updateCountdownText();
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('DOMContentLoaded', () => {
        exibirJogosJogados();
        observeDOM();
    });


    updateCountdownText();
})();
