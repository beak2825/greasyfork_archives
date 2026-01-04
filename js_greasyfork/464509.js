// ==UserScript==
// @name         Quora make blur images clear
// @namespace    quora-make-blur-images-clear
// @version      1.0
// @description  Remove the filter attribute from images with the q-box class on Quora to make them clearer.
// @author       Your Name
// @match        https://www.quora.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464509/Quora%20make%20blur%20images%20clear.user.js
// @updateURL https://update.greasyfork.org/scripts/464509/Quora%20make%20blur%20images%20clear.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const images = document.querySelectorAll('.q-box img');

    images.forEach(image => {
        if (image.hasAttribute('filter')) {
            image.removeAttribute('filter');
        }
    });
})();
