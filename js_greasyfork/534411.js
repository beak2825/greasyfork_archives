// ==UserScript==
// @name         CSGOBIG Anti-ban
// @namespace    http://tampermonkey.net/
// @version      2025-04-24
// @description  hide every logo to prevent ban
// @author       Jhonatas Fernandes
// @match        *csgobig.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csgobig.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534411/CSGOBIG%20Anti-ban.user.js
// @updateURL https://update.greasyfork.org/scripts/534411/CSGOBIG%20Anti-ban.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const list_block = [
        "navbar-top__logo",
        "cases__filter-dropdown-chip-icon",
        "case-battle-page__filter-dropdown-chip-icon",
        "case-details__logo-icon",
        "case-drop-item__image-background",
        "case-roulette__image-background",
        "footer__wrapper",
        "bomb-defuse-page__game-footer",
        "upgrader-flow__select-video",
        "upgrader-hexagon__background-image",
    ]
    const list_block_especial = [
        "messages_container",
    ]

    const defusalImage = "https://i.imgur.com/uuCloQo.png"


    function hideElements() {
        list_block.forEach(classe => {
            const elementos = document.querySelectorAll(`.${classe}`);
            elementos.forEach(el => {
                if (el instanceof Element) {
                    // Para funcionar tanto em HTML quanto em SVG
                    el.style.setProperty("filter", "blur(8px)");
                }
            });
        });
        const imagemAlvo = document.querySelector("img[src*='/assets/img/bomb-defuse/bomb.png']");
        if (imagemAlvo) {
            imagemAlvo.src = defusalImage;
        }
    }

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
    window.addEventListener('load', () => {
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