// ==UserScript==
// @name         Perplexity Playground Sonar-pro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Selecciona automáticamente "sonar-pro" en el select de modelo de Perplexity
// @match        https://playground.perplexity.ai/*
// @author YouTubeDrawaria
// @grant none
// @license MIT
// @icon https://playground.perplexity.ai/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/544337/Perplexity%20Playground%20Sonar-pro.user.js
// @updateURL https://update.greasyfork.org/scripts/544337/Perplexity%20Playground%20Sonar-pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Puedes cambiar este selector si cambia el id
    const SELECT_ID = 'lamma-select';
    const DEFAULT_VALUE = 'sonar-pro';

    function setDefaultModel() {
        const select = document.getElementById(SELECT_ID);
        if (select) {
            if (select.value !== DEFAULT_VALUE) {
                select.value = DEFAULT_VALUE;
                // Disparar evento change para que la UI lo registre
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        } else {
            // Si el select aún no existe, intenta de nuevo pronto
            setTimeout(setDefaultModel, 150);
        }
    }

    // Ejecuta una vez el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setDefaultModel);
    } else {
        setDefaultModel();
    }
})();
