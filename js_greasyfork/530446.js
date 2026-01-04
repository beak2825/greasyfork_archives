// ==UserScript==
// @name         youtube titel en favicon changer
// @namespace    http://tampermonkey.net/
// @version      2025-03-21
// @description  veranderd youtube naar smartschool favicon
// @author       You
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530446/youtube%20titel%20en%20favicon%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/530446/youtube%20titel%20en%20favicon%20changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // 🔷 Forceer titel aanpassing (blijft continu overschrijven)
    function forceerTitel() {
        document.title = "Smartschool";
        setTimeout(forceerTitel, 1000); // Elke seconde opnieuw zetten
    }
    forceerTitel();

    // 🔷 Forceer favicon aanpassing
    function vervangFavicon() {
        const newFaviconUrl = 'https://smartschool.be/favicon.ico'; // Je kan hier een andere URL gebruiken
        const oldIcons = document.querySelectorAll('link[rel*="icon"]');
        oldIcons.forEach(icon => icon.remove());

        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = newFaviconUrl;
        document.head.appendChild(favicon);
    }
    vervangFavicon();
    setInterval(vervangFavicon, 5000); // Elke 5 seconden vervangen (voor zekerheid)


})();