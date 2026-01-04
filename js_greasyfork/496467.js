// ==UserScript==
// @name         Discord Button Removed by YoutubeDrawaria
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Instantly hides and removes the Discord button from Drawaria Online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496467/Discord%20Button%20Removed%20by%20YoutubeDrawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/496467/Discord%20Button%20Removed%20by%20YoutubeDrawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para ocultar y eliminar el botón de Discord
    function removeDiscordButton() {
        var discordButton = document.getElementById('discordprombox');
        if (discordButton) {
            // Oculta el botón de Discord
            discordButton.style.display = 'none';
            // Elimina el botón de Discord del DOM
            discordButton.parentNode.removeChild(discordButton);
        }
    }

    // Ejecuta la función inmediatamente después de que se cargue el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeDiscordButton);
    } else {
        removeDiscordButton();
    }
})();