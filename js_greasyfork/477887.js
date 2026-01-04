// ==UserScript==
// @name         Añadir target _blank a enlaces con "/resource/" o a dominios externos
// @namespace    https://moodle.iesmontsia.org
// @license MIT
// @version      1.0
// @description  Añade target="_blank" a enlaces que contienen "/resource/" o a dominios externos en todas las páginas
// @author       Tu Nombre
// @match        https://moodle.iesmontsia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477887/A%C3%B1adir%20target%20_blank%20a%20enlaces%20con%20%22resource%22%20o%20a%20dominios%20externos.user.js
// @updateURL https://update.greasyfork.org/scripts/477887/A%C3%B1adir%20target%20_blank%20a%20enlaces%20con%20%22resource%22%20o%20a%20dominios%20externos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            const enlace = event.target;
            if (enlace.href.includes("/resource/") || enlace.hostname !== window.location.hostname) {
                event.preventDefault();
                window.open(enlace.href, '_blank');
            }
        }
    });
})();