// ==UserScript==
// @name         Drawaria Draggable Action Menu Back!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menu de acciones draggable para Drawaria.online, usando el CSS proporcionado por el usuario.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537134/Drawaria%20Draggable%20Action%20Menu%20Back%21.user.js
// @updateURL https://update.greasyfork.org/scripts/537134/Drawaria%20Draggable%20Action%20Menu%20Back%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.sockets) {
        window.sockets = [];
    }

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);
            // console.log('WebSocket instance captured:', this);
        }
        return originalSend.call(this, ...args);
    };

    function sendSocketMessage(messageArray) {
        if (window.sockets && window.sockets.length > 0) {
            const gameSocket = window.sockets[0];
            const messageString = "42" + JSON.stringify(messageArray);
            console.log('Sending message:', messageString);
            gameSocket.send(messageString);
        } else {
            console.error('No WebSocket connection found to send message.');
        }
    }

    // Add Stylesheet - Usando el CSS proporcionado por el usuario
    function addCustomStylesheet() {
        const style = document.createElement('style');
        // ESTILOS CSS PROPORCIONADOS POR EL USUARIO (con mínimas adiciones necesarias)
        style.innerHTML = `
            .action-menu { /* Nombre de clase del CSS del usuario */
                position: absolute;
                top: 226.969px; /* Del CSS del usuario */
                left: 30px; /* Del CSS del usuario */
                display: flex;
                flex-direction: column;
                align-items: center; /* Del CSS del usuario */
                background: linear-gradient(135deg, #8e2de2, #4a00e0); /* Del CSS del usuario */
                border-radius: 10px; /* Del CSS del usuario */
                padding: 20px; /* Del CSS del usuario */
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Del CSS del usuario */
                z-index: 10000; /* Manteniendo un z-index alto */
                animation: fadeIn 0.5s ease-in-out; /* Del CSS del usuario */
            }

.action-button {
    margin: 10px;
    padding: 15px 20px;
    cursor: pointer;
    background: linear-gradient(135deg, #ffd700, #ffb90f); /* Amarillo base */
    color: white;
    border-style: solid;
    border-width: 2px; /* Grosor del borde para que sea visible */
    /* Simulación de borde 3D: claro abajo/izquierda, oscuro arriba/derecha */
    border-color: #A07C0F #FFF2D0 #FFF2D0 #A07C0F; /* arriba, derecha, abajo, izquierda */
    /* Arriba: oscuro, Derecha: claro, Abajo: claro, Izquierda: oscuro */
    /* Ajuste según imagen: Parece más bien un borde claro abajo/izquierda y oscuro arriba/derecha */
    /* border-color: #A07C0F #A07C0F #FFF2D0 #FFF2D0; /* arriba, derecha, abajo, izquierda */
    /* Mejor aún, como lo describiste: blanco abajo/izquierda, oscuro arriba/derecha */
    border-color: #7d600b #7d600b #fff9e6 #fff9e6; /* oscuro arriba y derecha, blanco abajo e izquierda */
    /* Probemos esto que se acerca más a tu descripción "borde blanco por abajo y la izquierda y uno oscuro por arriba y la derecha" */
    /* Para el color oscuro, usaré un tono más oscuro del amarillo del botón, y para el claro, un amarillo muy pálido o blanco hueso. */

    /* Versión final basada en tu descripción: */
    border-top-color: #b8860b;    /* Oscuro arriba */
    border-right-color: #b8860b;  /* Oscuro derecha */
    border-bottom-color: #ffffff; /* Blanco abajo */
    border-left-color: #ffffff;   /* Blanco izquierda */

    border-radius: 5px;
    /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */ /* La sombra puede interferir con el efecto de borde, considera quitarla o reducirla */
    box-shadow: 1px 1px 3px rgba(0,0,0,0.1); /* Sombra más sutil si se mantiene */
    transition: transform 0.2s, box-shadow 0.2s, color 0.2s, border-color 0.2s;
    font-weight: normal; /* Cambiado a normal basado en tu código, pero la maqueta parecía bold */
    text-align: center;
    min-width: 150px;
}


.action-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    color: #333333;
    /* Opcional: Mantener o invertir el efecto de borde en hover */
    /* Podrías querer que el borde se aplane o cambie */
    border-top-color: #a3750a;    /* Un poco más oscuro en hover */
    border-right-color: #a3750a;  /* Un poco más oscuro en hover */
    border-bottom-color: #f0f0f0; /* Un poco menos brillante en hover */
    border-left-color: #f0f0f0;   /* Un poco menos brillante en hover */
}


            .draggable { /* Del CSS del usuario */
                cursor: move;
            }

            @keyframes fadeIn { /* Del CSS del usuario */
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Crear y añadir el menú de acciones al DOM
    function createActionMenu() {
        // Usar los nombres de clase del CSS proporcionado: 'action-menu' y 'draggable'
        const menu = document.createElement('div');
        menu.className = 'action-menu draggable'; // Aplicando clases del CSS del usuario
        menu.id = 'customActionMenu'; // ID único para el menú

        const buttons = [
            { text: 'Report', action: handleReport },
            { text: 'Rules', action: handleRules },
            { text: 'AutoKick', action: handleAutoKick }
        ];

        buttons.forEach(btnInfo => {
            // Usar el nombre de clase del CSS proporcionado: 'action-button'
            const button = document.createElement('button');
            button.className = 'action-button'; // Aplicando clase del CSS del usuario
            button.textContent = btnInfo.text;
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                btnInfo.action();
            });
            menu.appendChild(button);
        });

        document.body.appendChild(menu);
        makeElementDraggable(menu); // La función draggable sigue siendo la misma
    }

    // --- Las funciones handleReport, handleRules, handleAutoKick, makeElementDraggable e init permanecen iguales ---
    // --- (Copiadas de la respuesta anterior para completitud, sin cambios en su lógica interna) ---

function handleReport() {
    console.log('Report action triggered (automatic, no prompt)');
    // Si los reportes se enviaban solos, es posible que:
    // 1. El objetivo fuera implícito (ej. el jugador actual dibujando).
    //    Para esto, necesitaríamos obtener ese nombre de usuario.
    // 2. Se enviaba un placeholder o un nombre vacío.

    // Opción: Enviar el socket con un nombre vacío.
    // ADVERTENCIA: Si el servidor espera un nombre de usuario específico para la acción de tipo 3 (kick),
    // enviar un nombre vacío podría no tener ningún efecto o un efecto inesperado.
    const targetUsernameForAutomaticReport = ""; // Intentar con un nombre vacío

    sendSocketMessage(['clientnotify', -1, 3, [true, targetUsernameForAutomaticReport]]);

    // NOTA: Si este enfoque no funciona (es decir, nadie es kickeado o reportado),
    // significaría que el script original obtenía el nombre del jugador de otra manera
    // (por ejemplo, el jugador que está dibujando actualmente) o usaba un socket diferente
    // para un "reporte general" que no tomaba un nombre.
    //
    // Si recuerdas que el botón "Report" kickeaba al jugador que estaba dibujando,
    // necesitaríamos añadir lógica para encontrar el nombre de ese jugador en la página
    // y usarlo en lugar de "".
}

    function handleRules() {
        console.log('Rules action triggered');
        sendSocketMessage(['clientnotify', -1, 100, [2]]);
        // alert("Rules message sent to chat.");
    }

    function handleAutoKick() {
        console.log('AutoKick action triggered');
        if (window['___BOT'] && typeof window['___BOT'].room.join === 'function') {
            try {
                window['___BOT'].room.join('');
            } catch (error) {
                console.error("Error executing ___BOT.room.join: ", error);
            }
        } else {
            console.warn('___BOT object or room.join method not found.');
        }
    }

    function makeElementDraggable(element) {
        let offsetX, offsetY, isDragging = false;

        element.addEventListener('mousedown', (e) => {
            // Solo iniciar drag si se hace clic directamente en el menú (si tiene clase draggable)
            // o en este caso, si el target es el propio menú, no los botones.
            if (e.target === element) {
                isDragging = true;
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
                element.style.userSelect = 'none';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.userSelect = 'auto';
            }
        });
    }

    function init() {
        addCustomStylesheet();
        setTimeout(createActionMenu, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();