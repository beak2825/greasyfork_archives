// ==UserScript==
// @name         DemirPixel Otomatik Tıklama
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  DemirPixel için otomatik tıklama
// @author       Emir
// @match        https://demirpixel.com.tr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505901/DemirPixel%20Otomatik%20T%C4%B1klama.user.js
// @updateURL https://update.greasyfork.org/scripts/505901/DemirPixel%20Otomatik%20T%C4%B1klama.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        setTimeout(function() {
            var targetElement = document.querySelector('YOUR_COPIED_SELECTOR'); // Buraya doğru seçiciyi koyun
            if (targetElement) {
                targetElement.click();
            }
        }, 5000); // 5 saniye bekle
    });
})();
