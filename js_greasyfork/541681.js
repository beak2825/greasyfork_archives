// ==UserScript==
// @name         Moderación básica Drawaria
// @namespace    https://greasyfork.org
// @version      0.1
// @description  Detecta palabras prohibidas y alerta al host
// @match        *://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541681/Moderaci%C3%B3n%20b%C3%A1sica%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/541681/Moderaci%C3%B3n%20b%C3%A1sica%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const palabrasProhibidas = ["mala1", "mala2", "ofensiva"]; // agrega más

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const mensajes = mutation.addedNodes;
            mensajes.forEach((nodo) => {
                if (nodo.nodeType === Node.ELEMENT_NODE) {
                    const texto = nodo.textContent.toLowerCase();
                    for (const palabra of palabrasProhibidas) {
                        if (texto.includes(palabra)) {
                            console.warn("Mensaje ofensivo detectado:", texto);
                            alert(`Jugador dijo algo prohibido: ${texto}`);
                            // Aquí puedes manualmente copiar el nombre y expulsarlo
                        }
                    }
                }
            });
        });
    });

    const chatContainer = document.querySelector(".chat-box") || document.querySelector(".chat");
    if (chatContainer) {
        observer.observe(chatContainer, { childList: true, subtree: true });
    }
})();