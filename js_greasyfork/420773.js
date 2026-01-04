// ==UserScript==
// @name        Freebies by Enzo
// @namespace   Fanslove
// @description Getting bonuses has never been faster
// @match     https://village-facebook.crazypanda.games/*
// @match     https://village-bf.crazypanda.games/*
// @match       *://playhousehold.com/*
// @grant       GM_addStyle
// @version     4.1
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/420773/Freebies%20by%20Enzo.user.js
// @updateURL https://update.greasyfork.org/scripts/420773/Freebies%20by%20Enzo.meta.js
// ==/UserScript==

(function() {
    'use strict';

      // Ottieni il timestamp corrente per forzare il refresh del file
    var timestamp = new Date().getTime();

    // URL del file JavaScript esterno
        var scriptUrl = 'https://wikihousehold.com/zap_pro/script_wh.com.js?v=' + timestamp;
    // URL del file CSS esterno
        var cssUrl = 'https://wikihousehold.com/zap_pro/styles_wh.com.css?v=' + timestamp;

    // Funzione per caricare lo script esterno
    function loadExternalScript(url) {
        var script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        script.async = false; // Garantisce che venga caricato in ordine
        document.head.appendChild(script);
    }

    // Funzione per caricare il CSS esterno
    function loadExternalCSS(url) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    }

    // Carica lo script e il CSS esterni
    loadExternalScript(scriptUrl);
    loadExternalCSS(cssUrl);
})();