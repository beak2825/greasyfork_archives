// ==UserScript==
// @name         Drawaria Hide Drawings Controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Oculta el elemento con id="drawcontrols" y dibuje libremente en todo el canvas
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541834/Drawaria%20Hide%20Drawings%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/541834/Drawaria%20Hide%20Drawings%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Espera a que el DOM esté completamente cargado para asegurar que el elemento existe
    window.addEventListener('load', function() {
        var drawControls = document.getElementById('drawcontrols');

        if (drawControls) {
            drawControls.style.display = 'none'; // Oculta el elemento
            // También podrías usar:
             drawControls.remove(); // Para eliminarlo completamente del DOM
             drawControls.style.visibility = 'hidden'; // Para hacerlo invisible pero que siga ocupando espacio
        }
    });
})();