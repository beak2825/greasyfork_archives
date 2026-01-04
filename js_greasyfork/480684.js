// ==UserScript==
// @name         Dánsko volejbal
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přesměrování stránky do správné live url
// @author       Michal
// @match        https://resultater.volleyball.dk/tms/Turneringer-og-resultater/Kamp-Information.aspx*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480684/D%C3%A1nsko%20volejbal.user.js
// @updateURL https://update.greasyfork.org/scripts/480684/D%C3%A1nsko%20volejbal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentURL = window.location.href;
    const regex = /KampId=(\d+)/;
    const match = currentURL.match(regex);

    if (match !== null && match.length === 2) {
        const kampId = match[1];
        const newURL = `https://resultater.volleyball.dk/tms/Turneringer-og-resultater/Kamp-Live.aspx?KampID=${kampId}`;
        window.location.href = newURL;
    } else {
        console.log("ID nebylo nalezeno v URL");
    }
})();