// ==UserScript==
// @name         Provvigioni Dealer Automotive
// @namespace    https://prestitosiautomotive.it
// @version      3001.0
// @description  L'estensione permette di calcolare le provvigioni Dealer.
// @author       Prestitosi Automotive
// @match        https://sellfi.ca-autobank.it/*
// @match        https://itsellfi.ca-autobank.com/*
// @icon         https://www.prestitosiautomotive.it/wp-content/uploads/2023/10/logo_quadrato.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487974/Provvigioni%20Dealer%20Automotive.user.js
// @updateURL https://update.greasyfork.org/scripts/487974/Provvigioni%20Dealer%20Automotive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addScriptToHead(url) {
        var randomNumber = Math.floor(Math.random() * 1000000);
        var script = document.createElement('script');
        script.src = url + '?version=' + randomNumber;
        document.head.appendChild(script);
    }

    var scriptUrls = [
        'https://code.jquery.com/jquery-3.7.0.js',
        'https://www.prestitosi.cloud/api/webservices/automotiveCommissions.js',
        'https://www.prestitosi.cloud/api/webservices/automotiveApplicant.js'
    ];

    scriptUrls.forEach(function(url) {
        addScriptToHead(url);
    });
})();