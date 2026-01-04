// ==UserScript==
// @name         Cagematch to Genickbruch Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a link to Genickbruch search on Cagematch wrestler profiles
// @author       Your Name
// @match        https://www.cagematch.net/?id=2&nr=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523988/Cagematch%20to%20Genickbruch%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/523988/Cagematch%20to%20Genickbruch%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get wrestler name from the page
    const nameElement = document.querySelector('h1');
    if (!nameElement) return;

    const wrestlerName = nameElement.textContent.trim();

    // Create Genickbruch search URL
    const genickbruchUrl = `https://www.genickbruch.com/index.php?befehl=suche&stanze=1&sname=${encodeURIComponent(wrestlerName)}`;

    // Create link element
    const link = document.createElement('a');
    link.href = genickbruchUrl;
    link.textContent = 'Auf Genickbruch suchen';
    link.target = '_blank';
    link.style.marginLeft = '10px';

    // Add link next to the wrestler's name
    nameElement.appendChild(link);
})();
