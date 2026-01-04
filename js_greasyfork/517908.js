// ==UserScript==
// @name         MaxLinks Streaming
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converte automaticamente i link MaxLinks in MaxStream e reindirizza alla nuova URL
// @author       Il tuo nome
// @match        https://maxlinks.online/watchfree/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517908/MaxLinks%20Streaming.user.js
// @updateURL https://update.greasyfork.org/scripts/517908/MaxLinks%20Streaming.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ottieni l'URL corrente
    const currentUrl = window.location.href;

    // Estrai le parti necessarie
    const urlParts = currentUrl.split('/');
    if (urlParts.length >= 5) {
        // Identifica gli ID video
        const videoId1 = urlParts[urlParts.length - 3];
        const videoId2 = urlParts[urlParts.length - 2];

        // Costruisci il nuovo link
        const newUrl = `https://maxstream.video/videostreax/${videoId1}/${videoId2}/fromdwpage`;

        // Reindirizza alla nuova URL
        window.location.href = newUrl;
    }
})();
