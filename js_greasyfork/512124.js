// ==UserScript==
// @name         Anti Scroll Lock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Previne sites de desabilitar o scrolling
// @match        *://*/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/512124/Anti%20Scroll%20Lock.user.js
// @updateURL https://update.greasyfork.org/scripts/512124/Anti%20Scroll%20Lock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableScroll() {
        // Remove estilos que bloqueiam o scrolling
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        // Remove event listeners que possam estar prevenindo o scrolling
        window.onscroll = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;

        // Remove classes que possam estar bloqueando o scroll
        document.body.classList.remove('no-scroll');

        // Sobrescreve o método addEventListener para ignorar certos tipos de eventos
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if(type === 'wheel' || type === 'touchmove' || type === 'scroll') {
                return;
            }
            originalAddEventListener.call(this, type, listener, options);
        };
    }

    // Executa a função imediatamente e a cada 1 segundo
    enableScroll();
    setInterval(enableScroll, 1000);
})();