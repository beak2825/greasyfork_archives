// ==UserScript==
// @name     Remove Shutterstock Watermark
// @version  1.0
// @description  Remove the Shutterstock watermark from images
// @match    https://www.shutterstock.com/*
// @grant    none
// @namespace https://greasyfork.org/users/248965
// @downloadURL https://update.greasyfork.org/scripts/475256/Remove%20Shutterstock%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/475256/Remove%20Shutterstock%20Watermark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove the watermark
    var watermarkElement = document.querySelector('.watermark');
    if (watermarkElement) {
        watermarkElement.style.display = 'none';
    }
})();
