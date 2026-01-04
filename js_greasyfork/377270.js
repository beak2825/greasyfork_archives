// ==UserScript==
// @name         SexVZ free images
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  re-enable image search and download
// @author       fuckingboring
// @match        https://sexvz.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377270/SexVZ%20free%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/377270/SexVZ%20free%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let images = document.getElementsByTagName('img');
    for (let i=0; i<images.length; i++) {
        images[i].oncontextmenu = undefined;
        images[i].style.pointerEvents = '';
    }
})();