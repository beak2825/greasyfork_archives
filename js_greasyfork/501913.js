// ==UserScript==
// @name         Subito.it - Rimuovi Venduti
// @namespace    https://www.subito.it/
// @version      2024-07-27
// @description  Rimuove gli oggetti venduti dagli elenchi degli articoli.
// @author       Federico Liva
// @match        https://www.subito.it/annunci-italia/*
// @icon         https://www.subito.it/static/img/favicon-128.png
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501913/Subitoit%20-%20Rimuovi%20Venduti.user.js
// @updateURL https://update.greasyfork.org/scripts/501913/Subitoit%20-%20Rimuovi%20Venduti.meta.js
// ==/UserScript==

/* globals jQuery, $ */

(function() {
    'use strict';

    // https://stackoverflow.com/a/39937614
    var oldXHR = window.XMLHttpRequest;

    function newXHR() {
        var realXHR = new oldXHR();

        realXHR.addEventListener("readystatechange", function() {
            if(realXHR.readyState==4){
                jQuery('.item-sold-badge').parents('.item-card').remove()
            }
        }, false);

        return realXHR;
    }

    window.XMLHttpRequest = newXHR;
})();