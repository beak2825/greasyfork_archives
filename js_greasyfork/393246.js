// ==UserScript==
// @name         Clarin Leer Sin Registrarse
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Permite navegar por Clarin sin tener que registrarse o abrir ventanas de incognito
// @author       PatoÑato
// @match        https://*.clarin.com/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/393246/Clarin%20Leer%20Sin%20Registrarse.user.js
// @updateURL https://update.greasyfork.org/scripts/393246/Clarin%20Leer%20Sin%20Registrarse.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    var $ = window.jQuery;
    $(".mfp-container").remove();
    $(".mfp-wrap").remove();

})();