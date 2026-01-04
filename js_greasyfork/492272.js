// ==UserScript==
// @name         agar bar remover
// @namespace    https://tampermonkey.net/
// @version      2024-04-11
// @description  Remove the miniclip bar from our game
// @author       New Jack 🕹️
// @match        https://agar.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agar.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492272/agar%20bar%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/492272/agar%20bar%20remover.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Change --bottom-banner-height to 0px
    document.documentElement.style.setProperty('--bottom-banner-height', '0px');

    // Change the size of the div with id agar-io_970x90
    let targetDiv = document.getElementById('agar-io_970x90');
    if (targetDiv) {
        targetDiv.style.width = '970px';
        targetDiv.style.height = '1px';
    }
})();