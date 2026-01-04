// ==UserScript==
// @name         Skyscrapercity Disable Lazyload
// @namespace    http://skyscrapercity.com/
// @version      0.1
// @description  Disables image lazy loading on skyscrapercity.com
// @author       mck
// @match        https://www.skyscrapercity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398941/Skyscrapercity%20Disable%20Lazyload.user.js
// @updateURL https://update.greasyfork.org/scripts/398941/Skyscrapercity%20Disable%20Lazyload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let images = document.querySelectorAll('img.bbImage.lazyload');

    [].forEach.call(images, function(image) {
        image.classList.remove('lazyload');
        image.setAttribute('src', image.getAttribute('data-src'));
    });
})();