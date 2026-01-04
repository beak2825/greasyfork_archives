// ==UserScript==
// @name         Bloxd.io Speed Hack, Chat Spam, Auto Clicker, Scaffold, Kill Aura y Menú Avanzado (Móvil) con Botón
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Script con Speed Hack, Chat Spam, Auto Clicker, Scaffold, Kill Aura y Menú Avanzado para Bloxd.io (Móvil) con Botón para abrir menú
// @author       Tú
// @match        https://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522839/Bloxdio%20Speed%20Hack%2C%20Chat%20Spam%2C%20Auto%20Clicker%2C%20Scaffold%2C%20Kill%20Aura%20y%20Men%C3%BA%20Avanzado%20%28M%C3%B3vil%29%20con%20Bot%C3%B3n.user.js
// @updateURL https://update.greasyfork.org/scripts/522839/Bloxdio%20Speed%20Hack%2C%20Chat%20Spam%2C%20Auto%20Clicker%2C%20Scaffold%2C%20Kill%20Aura%20y%20Men%C3%BA%20Avanzado%20%28M%C3%B3vil%29%20con%20Bot%C3%B3n.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables de control
    let speedEnabled = false;
    let chatSpamEnabled = false;
    let autoClickerEnabled = false;
    let scaffoldEnabled = false;
    let killAuraEnabled = false;

    // Crear el menú avanzado (inicialmente oculto)
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.bottom = '80px';
    menu.style.right = '20px';
    menu.style.padding = '15px';
    menu.style.backgroundColor = '#2c3e50';
    menu.style.color = '#ecf0f1';
    menu.style.borderRadius = '10px';
    menu.style.zIndex = '9999';
    menu.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.3)';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.width = '220px';
    menu.style.display = 'none'; // Ocultar el menú al inicio

    // Titulo del menú
    const title = document.createElement('h3');
    title.innerText = 'Menú de Control';
    title.style.textAlign = 'center';
    menu.appendChild(title);

    // Función para crear un checkbox
    function createCheckbox(label, id, onChangeCallback) {
        const div = document.createElement('div');
        div.style.marginBottom = '10px';
        
        const labelElement = document.createElement('label');
        labelElement.innerText = label;
        labelElement.style.fontSize = '14px';
        labelElement.style.marginRight = '10px';
        div.appendChild(labelElement);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.style.marginRight = '10px';

        checkbox.addEventListener('change', () => {
            onChangeCallback(checkbox.checked);
        });

        div.appendChild(checkbox);
        menu.appendChild(div);

        // Si está activado por defecto, marca el checkbox
        if (checkbox.checked) {
            onChangeCallback(true); // Ejecutar la acción correspondiente si está activado
        }
    }

    // Crear los checkboxes para las funciones
    createCheckbox('Speed Hack', 'speedCheckbox', (checked) => {
        speedEnabled = checked;
    });

    createCheckbox('Chat Spam', 'chatSpamCheckbox', (checked) => {
        chatSpamEnabled = checked;
    });

    createCheckbox('Auto Clicker', 'autoClickerCheckbox', (checked) => {
        autoClickerEnabled = checked;
    });

    createCheckbox('Scaffold', 'scaffoldCheckbox', (checked) => {
        scaffoldEnabled = checked;
    });

    createCheckbox('Kill Aura', 'killAuraCheckbox', (checked) => {
        killAuraEnabled = checked;
    });

    // Crear botón de cerrar el menú dentro del menú
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Cerrar Menú';
    closeButton.style.width = '100%';
    closeButton.style.padding = '10px';
    closeButton.style.backgroundColor = '#e74c3c';
    closeButton.style.color = '#fff';
    closeButton.style.fontSize = '16px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.marginTop = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        menu.style.display = 'none'; // Ocultar el menú
    });
    menu.appendChild(closeButton);

    // Agregar el menú al body
    document.body.appendChild(menu);

    // Crear el botón para abrir el menú
    const menuButton = document.createElement('button');
    menuButton.innerText = 'Abrir Menú';
    menuButton.style.position = 'fixed';
    menuButton.style.bottom = '20px';
    menuButton.style.right = '20px';
    menuButton.style.padding = '10px';
    menuButton.style.backgroundColor = '#3498db';
    menuButton.style.color = '#fff';
    menuButton.style.fontSize = '16px';
    menuButton.style.border = 'none';
    menuButton.style.borderRadius = '50%';
    menuButton.style.cursor = 'pointer';
    menuButton.style.zIndex = '9999';
    document.body.appendChild(menuButton);

    // Función para activar/desactivar Speed Hack
    function speedHack() {
        if (speedEnabled) {
            let eventUp = new KeyboardEvent('keydown', { key: "ArrowUp", bubbles: true });
            let eventDown = new KeyboardEvent('keydown', { key: "ArrowDown", bubbles: true });
            let eventLeft = new KeyboardEvent('keydown', { key: "ArrowLeft", bubbles: true });
            let eventRight = new KeyboardEvent('keydown', { key: "ArrowRight", bubbles: true });

            // Mover al jugador rápidamente
            for (let i = 0; i < 10; i++) { // Ajusta el número de repeticiones para la velocidad
                document.dispatchEvent(eventUp);
                document.dispatchEvent(eventDown);
                document.dispatchEvent(eventLeft);
                document.dispatchEvent(eventRight);
            }
        }
    }

    // Función para hacer Spam de Chat (mensaje personalizado)
    function sendChatMessage() {
        if (chatSpamEnabled) {
            let chatMessage = "Zentic Client on top"; // Mensaje de chat personalizado
            let inputField = document.querySelector(".chat-input");  // Asegúrate de que este selector sea correcto
            let sendButton = document.querySelector(".send-chat-button");  // Asegúrate de que este selector sea correcto

            if (inputField && sendButton) {
                inputField.value = chatMessage; // Coloca el mensaje en el campo de texto
                sendButton.click(); // Envia el mensaje
                console.log("Mensaje enviado:", chatMessage);
            } else {
                console.log("No se encontró el campo de chat o el botón de enviar.");
            }
        }
    }

    // Función para hacer clic automáticamente
    function autoClick() {
        if (autoClickerEnabled) {
            let startButton = document.querySelector(".start-button");  // Asegúrate de que este selector sea correcto
            if (startButton) {
                startButton.click(); // Hacer clic en el botón de inicio
                console.log("Clic automático realizado.");
            }
        }
    }

    // Función para activar Scaffold (colocar bloques automáticamente)
    function scaffold() {
        if (scaffoldEnabled) {
            let blockButton = document.querySelector(".block-place-button");  // Asegúrate de que este selector sea correcto
            let numBlocks = 10;  // Número de bloques a colocar

            if (blockButton) {
                for (let i = 0; i < numBlocks; i++) {
                    blockButton.click(); // Coloca un bloque en la ubicación actual
                    console.log(`Bloque ${i + 1} colocado.`);
                }
            } else {
                console.log("No se encontró el botón de colocar bloques.");
            }
        }
    }

    // Función para activar Kill Aura (atacar a enemigos cercanos)
    function killAura() {
        if (killAuraEnabled) {
            let players = document.querySelectorAll('.enemy-player');  // Asegúrate de que este selector sea correcto
            players.forEach(player => {
                let attackButton = player.querySelector('.attack-button');  // Ajusta este selector según el juego
                if (attackButton) {
                    attackButton.click(); // Atacar al jugador
                    console.log("Atacando a enemigo");
                }
            });
        }
    }

    // Ejecutar las funciones a intervalos regulares
    setInterval(() => {
        speedHack();
        sendChatMessage();
        autoClick();
        scaffold();
        killAura();
    }, 100); // Ejecuta cada 100ms

    // Mostrar el menú cuando se hace clic en el botón
    menuButton.addEventListener('click', () => {
        if (menu.style.display === 'none') {
            menu.style.display = 'block'; // Mostrar el menú
        } else {
            menu.style.display = 'none'; // Ocultar el menú
        }
    });
})();