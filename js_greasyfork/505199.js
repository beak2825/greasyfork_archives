// ==UserScript==
// @name         Remove Spoiler and Hidden Classes
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove spoiler and hidden classes from elements
// @author       bighype
// @include      /^https:\/\/www\.empornium\.(me|sx|is)\/torrents\.php\?id=\d+/
// @license      MIT

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505199/Remove%20Spoiler%20and%20Hidden%20Classes.user.js
// @updateURL https://update.greasyfork.org/scripts/505199/Remove%20Spoiler%20and%20Hidden%20Classes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the elements with the "spoiler" and "hidden" classes
    var elements = document.querySelectorAll('blockquote.spoiler.hidden');

    // Loop through the elements and remove the classes
    elements.forEach(function(element) {
        element.classList.remove('spoiler', 'hidden');

        // Show images within the blockquote and replace data-src with src
        var images = element.querySelectorAll('img.bbcode.scale_image');
        images.forEach(function(img) {
            img.style.display = 'inline-block';
            img.style.visibility = 'visible';
            var dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
                img.setAttribute('src', dataSrc);
                img.removeAttribute('data-src');
            }
        });
    });
})();