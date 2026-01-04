// ==UserScript==
// @name         YouTube to NSFWYouTube Redirector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cambia l'URL di YouTube per NSFWYouTube automaticamente
// @author       Il Tuo Nome
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507090/YouTube%20to%20NSFWYouTube%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/507090/YouTube%20to%20NSFWYouTube%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ottieni l'URL corrente
    let currentURL = window.location.href;

    // Modifica l'URL sostituendo "youtube" con "nsfwyoutube"
    let newURL = currentURL.replace("youtube.com", "nsfwyoutube.com");

    // Reindirizza alla nuova URL
    window.location.href = newURL;
})();
