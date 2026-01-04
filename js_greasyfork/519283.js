// ==UserScript==
// @name         script
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  script copy
// @author       mrekk
// @match        *://*/*
// @grant        none
// @license      @MIT
// @downloadURL https://update.greasyfork.org/scripts/519283/script.user.js
// @updateURL https://update.greasyfork.org/scripts/519283/script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('copy', (event) => {
        const selection = window.getSelection().toString();
        if (selection.includes(':')) { 
            const textAfterColon = selection.split(':').slice(1).join(':').trim(); 
            event.preventDefault(); 
            event.clipboardData.setData('text/plain', textAfterColon); 
        }
    });
})();
