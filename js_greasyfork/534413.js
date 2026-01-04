// ==UserScript==
// @name         CSGOGEM  Anti-ban
// @namespace    http://tampermonkey.net/
// @version      2025-04-25
// @description  hide every logo to prevent ban
// @author       You
// @match        *csgogem.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csgogem.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534413/CSGOGEM%20%20Anti-ban.user.js
// @updateURL https://update.greasyfork.org/scripts/534413/CSGOGEM%20%20Anti-ban.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const list_block = [
        "logo",
        "footer-ctn",
    ]
    const list_block_especial = [
        "v-navigation-drawer__content",
    ]

    function hideElements() {
        list_block.forEach(classe => {
            const elementos = document.querySelectorAll(`[class*="${classe}"]`);
            elementos.forEach(el => {
                el.style.setProperty("filter", "blur(8px)");
            });
        });
    };

    function addBlurHoverEffect() {
    // Adiciona o CSS se ainda não adicionou
    if (!document.getElementById('filter-blur-style')) {
        const style = document.createElement('style');
        style.id = 'filter-blur-style';
        style.textContent = `
            .filter-blur {
                filter: blur(8px);
                transition: filter 0.3s ease;
            }
            .filter-blur:hover {
                filter: blur(0px);
            }
        `;
        document.head.appendChild(style);
    }

    list_block_especial.forEach(partialClass => {
        const elementosSemiBlur = document.querySelectorAll(`[class*="${partialClass}"]`);
        elementosSemiBlur.forEach(el => {
            // Só adiciona a classe se o elemento NÃO estiver sob hover
            if (!el.matches(':hover')) {
                el.classList.add('filter-blur');
            } else {
                console.log("Elemento já está em hover, não aplicando blur agora.");
            }
        });
    });
}


    // Aguarda o carregamento do DOM
    window.addEventListener('DOMContentLoaded', () => {
        hideElements();
        addBlurHoverEffect();

        // Observador para mudanças futuras (opcional)
        const observer = new MutationObserver(() => {
            hideElements();
            addBlurHoverEffect();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();