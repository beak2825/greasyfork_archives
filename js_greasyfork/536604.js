// ==UserScript==
// @name         Fix NetAcad wide monitor offset
// @namespace    http://tampermonkey.net/
// @version      2025-05-20
// @description  Fixes the user dashboard offset in Cisco's Net Academy
// @author       David C
// @match        https://www.netacad.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netacad.com
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/536604/Fix%20NetAcad%20wide%20monitor%20offset.user.js
// @updateURL https://update.greasyfork.org/scripts/536604/Fix%20NetAcad%20wide%20monitor%20offset.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Change the values associated with the body
    document.body.style.margin = "0";

    //Change the width of the content div in the middle
    const nuStyle = document.createElement("style");
    nuStyle.innerHTML = `
    .content {
        width: 100vw;
    }
    `;

    document.head.appendChild(nuStyle);
})();