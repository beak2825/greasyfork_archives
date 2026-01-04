// ==UserScript==
// @name         Old Meteoblue Meteograms
// @name:en         Old Meteoblue Meteograms
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Восстанавливает прежний (жёлтый) дизайн метеограмм на сайте meteoblue.com
// @description:en  Restores the previous (yellow) design of meteograms on meteoblue.com
// @author       Ivan771
// @match        https://www.meteoblue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meteoblue.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478937/Old%20Meteoblue%20Meteograms.user.js
// @updateURL https://update.greasyfork.org/scripts/478937/Old%20Meteoblue%20Meteograms.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var images = document.querySelectorAll('img');
    images.forEach(function(image) {
        var currentSrc = image.getAttribute('src');
        if (currentSrc && currentSrc.includes('images/meteogram?')) {
            var newSrc = currentSrc.replace('images/meteogram?', 'visimage/meteogram_web_hd?');
            image.setAttribute('src', newSrc);
        }
    });
})();
