// ==UserScript==
// @name         CroxyProxy for Gartic.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gartic.io oyununu CroxyProxy üzerinden yönlendirir.
// @author       YourName
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522336/CroxyProxy%20for%20Garticio.user.js
// @updateURL https://update.greasyfork.org/scripts/522336/CroxyProxy%20for%20Garticio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mevcut URL'yi alın
    const currentUrl = window.location.href;

    // CroxyProxy URL'si
    const croxyProxyUrl = 'https://www.croxyproxy.com/';

    // CroxyProxy üzerinden yönlendirme
    const proxyUrl = croxyProxyUrl + '?url=' + encodeURIComponent(currentUrl);
    window.location.href = proxyUrl;
})();