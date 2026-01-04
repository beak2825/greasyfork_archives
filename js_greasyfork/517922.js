// ==UserScript==
// @name         Compact Chat
// @namespace    http://tampermonkey.net/
// @version      2024-11-15
// @description  Toggle chat compactfulness
// @author       Realwdpcker on PixelPlace.io
// @match        https://pixelplace.io/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPzgxYoFXDSUZWfvztvgoWkP_slpX8hNloHg&s
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517922/Compact%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/517922/Compact%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const compactToggle = () => {
        const rows = document.querySelectorAll('#container #chat .messages .row');
        rows.forEach(row => {
            row.style.padding = '2px 0px';
        });
    };

    const observer = new MutationObserver(compactToggle);
    const target = document.querySelector('#container');
    if (target) {
        observer.observe(target, { childList: true, subtree: true });
    }
})();