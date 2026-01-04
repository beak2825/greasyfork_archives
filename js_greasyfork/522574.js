// ==UserScript==
// @name         Hide Google AI Overview
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  Hides the Google AI Overview section
// @author       Drewby123
// @match        *://www.google.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522574/Hide%20Google%20AI%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/522574/Hide%20Google%20AI%20Overview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideDiv = () => {
        document.querySelectorAll('div').forEach(div => {
            if (div.classList.contains('bzXtMb') || div.classList.contains('M8OgIe')) {
                div.style.display = 'none';
            }
        });
    };

    document.addEventListener('DOMContentLoaded', hideDiv);
    new MutationObserver(hideDiv).observe(document.body, { childList: true, subtree: true });
})();

