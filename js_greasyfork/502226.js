// ==UserScript==
// @name         flag random macs
// @namespace    http://tampermonkey.net/
// @version      2024-07-30
// @description  flag randomized mac addresses in unifi network gui
// @author       mschmitt
// @license      MIT 
// @match        https://unifi.ui.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502226/flag%20random%20macs.user.js
// @updateURL https://update.greasyfork.org/scripts/502226/flag%20random%20macs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        const allSpans = document.getElementsByTagName('span');
        for (const span of allSpans) {
            if (span.textContent.match(/^[0-9a-f][26ae](:[0-9a-f]{2}){5}$/)) {
                console.log('marking ' + span.textContent + ' as random');
                span.textContent = '🎲 ' + span.textContent;
            }
        }
    }, 1000);

})();