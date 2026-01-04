// ==UserScript==
// @name         Wacken Gallery Full Size
// @namespace    https://jpjonte.de
// @version      1.0.0
// @description  Enlarges images and thumbnails in the Wacken Gallery
// @author       Buddy Jonte
// @supportURL   https://github.com/jpjonte/wacken-gallery-userscript
// @match        http://gallery.wacken.com/index.php*
// @match        http://gallery.wacken.com/thumbnails.php*
// @match        http://gallery.wacken.com/displayimage.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wacken.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448436/Wacken%20Gallery%20Full%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/448436/Wacken%20Gallery%20Full%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.querySelectorAll('img.image');

    elements.forEach(function (image) {
        console.log('image', image);
        var url = image.src;

        image.src = url.replace('normal_', '').replace('thumb_', 'normal_');
        image.removeAttribute('width');
        image.removeAttribute('height');
    });
})();
