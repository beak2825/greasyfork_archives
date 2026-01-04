// ==UserScript==
// @name         pokerpatio iframe blocker
// @namespace    http://tampermonkey.net/
// @version      2024-08-28
// @description  blocks iframe opening, just redirects to lobby
// @author       king
// @match        https://pokerpatio.com/lobbies
// @icon         https://i.ibb.co/7W9DNdD/code-1-512.png
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505614/pokerpatio%20iframe%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/505614/pokerpatio%20iframe%20blocker.meta.js
// ==/UserScript==

/* global createWindowedIframe:writable */
(function() {
    'use strict';

    createWindowedIframe = (d)=>{window.location=d.url};
})();