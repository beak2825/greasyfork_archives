// ==UserScript==
// @name         Chaturbate Hide Chat
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide chat in full screen
// @match        *://*.chaturbate.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540453/Chaturbate%20Hide%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/540453/Chaturbate%20Hide%20Chat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SELECTORS = [
        '.hasDarkBackground > div',
        '.hasDarkBackground',
        '.hasDarkBackground.draggableCanvasChatWindow.draggableCanvasWindow'
    ];

    function ocultarElementos() {
        SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            });
        });
    }

    // Observar cambios dinámicos en la página (por si se agregan después de cargar)
    const observer = new MutationObserver(() => {
        ocultarElementos();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // También ejecutar al principio
    ocultarElementos();
})();
