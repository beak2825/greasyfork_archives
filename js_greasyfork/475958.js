// ==UserScript==
// @icon         https://tmohentai.com/favicon-32x32.png
// @name         Modo Cascada en TMOHentai
// @namespace    https://greasyfork.org/es/scripts/475958
// @version      0.2
// @description  Cambia el enlace del botón READ en TMOHentai para activar por default el modo cascada
// @author       Shu2Ouma
// @match        https://tmohentai.com/contents/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475958/Modo%20Cascada%20en%20TMOHentai.user.js
// @updateURL https://update.greasyfork.org/scripts/475958/Modo%20Cascada%20en%20TMOHentai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Busca el elemento <a> con la clase "lanzador"
    var link = document.querySelector('a.lanzador');

    // Verifica si el enlace con la clase "lanzador" contiene "/paginated/1"
    if (link && link.href.includes("/paginated/1")) {
        // Reemplaza "/paginated/1" con "/cascade?image-width=normal-width"
        link.href = link.href.replace("/paginated/1", "/cascade?image-width=normal-width");
    }
})();
