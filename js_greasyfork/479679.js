// ==UserScript==
// @name         GamesGX Downloader
// @version      0.2
// @namespace    GamesGxDownloader
// @description  Skip shortener to gamesgx.net
// @author       GrrAmd2
// @match        https://eco-area.com/*
// @match        http://eco-area.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479679/GamesGX%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/479679/GamesGX%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Obtener la parte de la URL después del dominio
    var entryPoint = window.location.pathname.split('/');

    // Comprobar si la parte después del dominio es "go"
    if (entryPoint[1] === "go") {
        // Hacer clic en el elemento con la clase 'linkprotect' si existe
        var linkProtectElement = document.querySelector('.linkprotect');
        if (linkProtectElement) {
            linkProtectElement.click();
        }
    } else {
        // Obtener el enlace de descarga del elemento con la clase 'botontour'
        var downloadLinkElement = document.querySelector(".botontour a");

        if (downloadLinkElement) {
            var url = downloadLinkElement.href;

            // Abrir la URL en una nueva pestaña
            window.open(url, "_blank");

            // Cerrar la pestaña actual después de un breve retraso (500 milisegundos)
            setTimeout(function() {
                window.close();
            }, 500);
        } else {
            console.error("No se encontró el elemento de enlace de descarga.");
        }
    }
})();
