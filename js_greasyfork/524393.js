// ==UserScript==
// @name         Erome Image remover
// @namespace    https://www.erome.com/
// @version      1.0
// @description  remove images from erome
// @match        https://www.erome.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/524393/Erome%20Image%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/524393/Erome%20Image%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.pathname.startsWith('/a/')){
        document.querySelectorAll('.media-group:not(:has(.video))').forEach(element => {
            element.style.display = 'none';
        });
    }
    document.querySelectorAll('.album:not(:has(.album-videos))').forEach(element => {
        element.style.display = 'none';
    });
    document.querySelectorAll('.album-title').forEach(element => {
        element.style.maxHeight = 'none';
    });
})();