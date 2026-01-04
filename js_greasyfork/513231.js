// ==UserScript==
// @name        Remove blur from images
// @namespace   Violentmonkey Scripts
// @match       https://cults3d.com/*
// @grant       none
// @version     1.2
// @author      JinxTheCat
// @description 10/19/2024, 5:24:55 PM
// @downloadURL https://update.greasyfork.org/scripts/513231/Remove%20blur%20from%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/513231/Remove%20blur%20from%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const elements = document.querySelectorAll('div.img--blurred.painting');

    elements.forEach((el) => {
        el.className = 'painting';
    });
})();