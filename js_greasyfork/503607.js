// ==UserScript==
// @name         Aurora Premium
// @namespace    http://tampermonkey.net/
// @version      2024-08-14
// @description  Aurora pero con UI fixes
// @author       You
// @match        https://pomelo.uninorte.edu.co/pls/prod/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503607/Aurora%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/503607/Aurora%20Premium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const auroraPremiumUrl = "https://pastebin.com/raw/YQb9mGGH";

    (async function applyStyles() {
        try {
            const response = await fetch('https://corsproxy.io/?' + encodeURIComponent(auroraPremiumUrl));
            const cssContent = await response.text();
            const styleElement = document.createElement('style');
            styleElement.textContent = cssContent;
            document.head.appendChild(styleElement);
        } catch (error) {
            console.error('Error loading the CSS content:', error);
        }
    })();

})();
