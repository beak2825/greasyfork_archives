// ==UserScript==
// @name         Disable Search Plugin for Copilot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable the Search plugin by default
// @author       dani7115
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485836/Disable%20Search%20Plugin%20for%20Copilot.user.js
// @updateURL https://update.greasyfork.org/scripts/485836/Disable%20Search%20Plugin%20for%20Copilot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Obtén el elemento de conmutación del plugin de búsqueda
    var searchSwitch = document.querySelector('.plugin-panel-item[aria-label="Search"] .switch');

    // Desactiva el plugin de búsqueda por defecto
    searchSwitch.checked = false;

    // Puedes agregar más código aquí para realizar acciones adicionales si es necesario

})();
