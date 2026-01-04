// ==UserScript==
// @name         NuK3R Mod Menu para Moomoo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú personalizado para moomoo.io - NuK3R Mod Menu
// @author       Tu Nombre
// @match        https://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469410/NuK3R%20Mod%20Menu%20para%20Moomoo.user.js
// @updateURL https://update.greasyfork.org/scripts/469410/NuK3R%20Mod%20Menu%20para%20Moomoo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables de control del menú
    var autoGGEnabled = false;

    // Función para enviar el mensaje personalizado al matar a un jugador
    function sendCustomMessage() {
        var chatInput = document.getElementById('chatBox');
        var sendButton = document.getElementById('chatButton');
        var customMessage = 'Auto GG: True';

        if (chatInput && sendButton && autoGGEnabled) {
            chatInput.value = customMessage;
            sendButton.click();
        }
    }

    // Función para enviar el estado de Auto GG por el chat
    function sendAutoGGStatus() {
        var chatInput = document.getElementById('chatBox');
        var sendButton = document.getElementById('chatButton');
        var statusMessage = 'Auto GG: ' + (autoGGEnabled ? 'True' : 'False');

        if (chatInput && sendButton) {
            chatInput.value = statusMessage;
            sendButton.click();
        }
    }

    // Crea el menú
    function createMenu() {
        // Crea el contenedor del menú
        var menuContainer = document.createElement('div');
        menuContainer.id = 'nuk3r-mod-menu';
        menuContainer.style.position = 'absolute';
        menuContainer.style.top = '50px';
        menuContainer.style.left = '50px';
        menuContainer.style.padding = '10px';
        menuContainer.style.background = 'rgba(0, 0, 0, 0.7)';
        menuContainer.style.color = '#fff';
        menuContainer.style.fontFamily = 'Arial, sans-serif';
        menuContainer.style.fontSize = '14px';
        menuContainer.style.zIndex = '9999';

        // Crea el título del menú
        var title = document.createElement('h2');
        title.textContent = 'NuK3R Mod Menu';
        title.style.margin = '0';
        title.style.fontSize = '18px';

        // Crea los botones del menú
        var autoGGButton = document.createElement('button');
        autoGGButton.textContent = 'Auto GG';
        autoGGButton.style.margin = '5px';
        autoGGButton.style.padding = '5px 10px';
        autoGGButton.style.border = 'none';
        autoGGButton.style.background = '#333';
        autoGGButton.style.color = '#fff';

        // Agrega los elementos al contenedor del menú
        menuContainer.appendChild(title);
        menuContainer.appendChild(autoGGButton);

        // Agrega el contenedor del menú al cuerpo del documento
        document.body.appendChild(menuContainer);

        // Función para ocultar o mostrar el menú
        function toggleMenu() {
            if (menuContainer.style.display === 'none') {
                menuContainer.style.display = 'block';
            } else {
                menuContainer.style.display = 'none';
            }
        }

        // Asigna la función toggleMenu al evento de clic en el botón Auto GG
        autoGGButton.addEventListener('click', toggleMenu);

        // Función para cambiar el estado del botón Auto GG y enviar el estado de Auto GG
        function toggleAutoGG() {
            autoGGEnabled = !autoGGEnabled;
            if (autoGGEnabled) {
                autoGGButton.style.background = 'green';
                sendAutoGGStatus();
            } else {
                autoGGButton.style.background = '#333';
                sendAutoGGStatus();
            }
        }

        // Asigna la función toggleAutoGG al evento de clic en el botón Auto GG
        autoGGButton.addEventListener('click', toggleAutoGG);

        // Sobreescribe la función original de moomoo.io para detectar cuando se mata a un jugador
        window.addChatMessage = function(chat, name, message) {
            if (message.includes('killed')) {
                sendCustomMessage();
            }

            // Llama a la función original
            addChatMessage(chat, name, message);
        };
    }

    // Llama a la función para crear el menú cuando la página se haya cargado completamente
    window.addEventListener('load', createMenu);
})();
