// ==UserScript==
// @name         Drawaria FNAF MOD™
// @namespace    http://tampermonkey.net/
// @version      2024-10-25
// @description  Happy Halloween and Have A Very Fnaf Day :D!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514478/Drawaria%20FNAF%20MOD%E2%84%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/514478/Drawaria%20FNAF%20MOD%E2%84%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let css = `
    /* === FNAF Background Replacement === */
    body {
        background: url('https://steamuserimages-a.akamaihd.net/ugc/932693183051367958/4D95EFE91891F4164EFEDD0415CF03DE2A545E01/?imw=512&imh=288&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true') center fixed repeat !important;
    }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement('style');
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector('head') || document.documentElement).appendChild(styleNode);
    }
})();