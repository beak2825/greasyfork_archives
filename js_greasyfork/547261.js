// ==UserScript==
// @name         OvaGames DL Ad Bypasser
// @namespace    http://tampermonkey.net/
// @match        *://ovagames.com/*
// @match        *://www.ovagames.com/*
// @description  This skips the adlinks on the download buttons from Ovagames, giving you the direct link and skipping over Shrinkearn.
// @version      1.0
// @author       Mr Turban
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547261/OvaGames%20DL%20Ad%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/547261/OvaGames%20DL%20Ad%20Bypasser.meta.js
// ==/UserScript==

(() => {
    window.addEventListener('load', () => {
        document.querySelectorAll('.dl-wraps-item a').forEach(link => {
            const url = new URL(link.href).searchParams.get('url');
            if (url) link.href = atob(url);
        });
        const div = document.querySelector('.dl-wraps-item b');
        if (div) div.textContent = 'Download links below should now lead directly to the actual link instead of Shrinkearn.';
    });
})();
