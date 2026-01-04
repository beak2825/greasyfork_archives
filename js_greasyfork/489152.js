// ==UserScript==
// @name         Scritta Animata che Segue il Mouse figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      0.2
// @description  Crea una scritta animata che segue il cursore del mouse.
// @author       figuccio
// @match        *://*/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489152/Scritta%20Animata%20che%20Segue%20il%20Mouse%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/489152/Scritta%20Animata%20che%20Segue%20il%20Mouse%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Creazione dell'elemento di testo
    var textElement = document.createElement('marquee');
    textElement.textContent = 'Testo animato se vuoi cambiare il testo modifica la linea 18';
    textElement.style.position = 'fixed';
    textElement.style.zIndex = '999999999999999999';
    textElement.style.pointerEvents = 'none';
    textElement.style.transition = 'transform 0.1s';
    textElement.style.color = 'green'; // Impostazione del colore del testo
    textElement.style.fontSize = '24px'; // Impostazione della dimensione del testo
    document.body.appendChild(textElement);

    // Funzione per aggiornare la posizione del testo
    function updateTextPosition(event) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        var textWidth = textElement.offsetWidth;
        var textHeight = textElement.offsetHeight;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;

        // Calcolo delle nuove coordinate per il testo
        var newX = mouseX - (textWidth / 2);
        var newY = mouseY - (textHeight / 2);

        // Assicurati che il testo rimanga visibile all'interno della finestra del browser
        if (newX < 0) {
            newX = 0;
        } else if (newX + textWidth > windowWidth) {
            newX = windowWidth - textWidth;
        }
        if (newY < 0) {
            newY = 0;
        } else if (newY + textHeight > windowHeight) {
            newY = windowHeight - textHeight;
        }

        // Imposta la posizione del testo
        textElement.style.transform = 'translate(' + newX + 'px, ' + newY + 'px)';
    }

    // Aggiunta dell'evento mousemove per aggiornare la posizione del testo
    document.addEventListener('mousemove', updateTextPosition);
})();
