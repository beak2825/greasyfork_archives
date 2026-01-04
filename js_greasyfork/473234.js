// ==UserScript==
// @name         Black Chat Background
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Black Chat Backgrund
// @author       Bambi1
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473234/Black%20Chat%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/473234/Black%20Chat%20Background.meta.js
// ==/UserScript==
GM_addStyle(`
    #chat {
        background-color: black !important;
    }
`);