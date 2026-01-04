// ==UserScript==
// @name         Hide All Images
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides all images on any website
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540193/Hide%20All%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/540193/Hide%20All%20Images.meta.js
// ==/UserScript==

(function() {
    // Select all <img> elements and hide them
    document.querySelectorAll('img').forEach(img => img.style.display = 'none');
})();