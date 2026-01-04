// ==UserScript==
// @name         Drawaria Buttons and Chat Enabler!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable and fixes the chat and draw buttons in Drawaria.online!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496873/Drawaria%20Buttons%20and%20Chat%20Enabler%21.user.js
// @updateURL https://update.greasyfork.org/scripts/496873/Drawaria%20Buttons%20and%20Chat%20Enabler%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para habilitar los botones y el chat
    function enableElements() {
        // Habilitar botones
        var disabledButtons = document.querySelectorAll('.drawcontrols-button.drawcontrols-disabled');
        disabledButtons.forEach(function(button) {
            button.classList.remove('drawcontrols-disabled');
        });

        // Habilitar chat
        var chatInput = document.getElementById('chatbox_textinput');
        if (chatInput && chatInput.disabled) {
            chatInput.disabled = false;
            chatInput.style.border = '1px solid aqua'; // Restaurar el estilo del borde
        }
    }

    // Ejecutar la función de habilitación de elementos cada segundo
    setInterval(enableElements, 1000);

    // Observar cambios en el DOM para habilitar los elementos si es necesario
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && (mutation.target.id === 'chatbox_textinput' || mutation.target.classList.contains('drawcontrols-button'))) {
                enableElements();
            }
        });
    });

    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
})();