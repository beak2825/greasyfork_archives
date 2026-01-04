// ==UserScript==
// @name         Remove Anti AdBlock Dialog - fapfapgames.com (Completo)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Remove o modal anti adblock em todo o site fapfapgames.com
// @author       MaliciusPlayer
// @match        https://fapfapgames.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539444/Remove%20Anti%20AdBlock%20Dialog%20-%20fapfapgamescom%20%28Completo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539444/Remove%20Anti%20AdBlock%20Dialog%20-%20fapfapgamescom%20%28Completo%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const blockSelectors = [
        '.dialog-root',
        '.dialog-overlay',
        '#myPluginScript-js'
    ];

    function hideAntiAdblock() {
        for (const selector of blockSelectors) {
            document.querySelectorAll(selector).forEach(el => {
                console.log(`[AntiAdBlock] Removido elemento: ${selector}`);
                el.remove();
            });
        }

        if (document.body) {
            document.body.style.overflow = 'auto';
        }
        if (document.documentElement) {
            document.documentElement.style.overflow = 'auto';
        }
    }

    // Observa toda a árvore DOM por alterações
    const observer = new MutationObserver(() => {
        hideAntiAdblock();
    });

    const startObserver = () => {
        observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true
        });
    };

    // Executa imediatamente após a página carregar o DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            hideAntiAdblock();
            startObserver();
        });
    } else {
        hideAntiAdblock();
        startObserver();
    }

    // Repetição extra por segurança durante 10 segundos
    let count = 0;
    const interval = setInterval(() => {
        hideAntiAdblock();
        count++;
        if (count > 10) {
            clearInterval(interval);
            observer.disconnect();
        }
    }, 1000);
})();
