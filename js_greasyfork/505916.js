// ==UserScript==
// @name         Hide All Images
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide all images on a youtube music
// @author       Otvalsky
// @match        *music.youtube.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505916/Hide%20All%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/505916/Hide%20All%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        image.style.display = 'none';
    });
})();