// ==UserScript==
// @name         Reddit Stream Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Agrega un botón en Reddit para abrir Reddit-stream en el credit-bar del post con la URL correcta de Reddit Stream y texto centrado en el botón
// @author       Daniel
// @match        *://www.reddit.com/r/*/comments/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516868/Reddit%20Stream%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/516868/Reddit%20Stream%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStreamButton() {
        // Evita agregar múltiples botones
        if (document.querySelector("#reddit-stream-button")) return;

        // Crea el botón y lo personaliza
        const button = document.createElement("button");
        button.id = "reddit-stream-button";
        button.textContent = "Reddit-Stream";
        button.style.marginLeft = "10px";
        button.style.padding = "4px 8px";
        button.style.backgroundColor = "#FF5700";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "4px";
        button.style.cursor = "pointer";
        button.style.fontSize = "12px";

        // Estilos para centrar el texto
        button.style.display = "flex";
        button.style.justifyContent = "center";
        button.style.alignItems = "center";
        button.style.textAlign = "center";

        // Extrae los elementos 'comments' y el ID del post de la URL
        const pathMatch = window.location.pathname.match(/\/comments\/([a-z0-9]+)/);
        if (pathMatch) {
            const postId = pathMatch[1];
            button.onclick = () => {
                window.open(`https://reddit-stream.com/comments/${postId}/`, "_blank");
            };

            // Encuentra el contenedor de credit-bar para insertar el botón
            const creditBar = document.querySelector('div[slot="credit-bar"]');
            if (creditBar) {
                creditBar.appendChild(button);
            }
        }
    }

    // Observa cambios en la página para agregar el botón si se carga dinámicamente
    const observer = new MutationObserver(addStreamButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Llama a la función para intentar agregar el botón en la carga inicial
    addStreamButton();
})();
