// ==UserScript==
// @name         Duckface Ziggo AJAX posse
// @namespace    https://nos.nl/
// @version      1.0.0
// @description  No one can touch you now
// @author       eXistenZNL
// @match        https://nos.nl/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ajax.nl
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511202/Duckface%20Ziggo%20AJAX%20posse.user.js
// @updateURL https://update.greasyfork.org/scripts/511202/Duckface%20Ziggo%20AJAX%20posse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('picture > source').forEach(el => el.remove());
    document.querySelectorAll('picture > img').forEach(function(img) {
        img.src = 'https://cdn.nos.nl/image/2024/10/02/1142541/1024x576a.jpg';
        if (Math.random() > 0.5) {
            img.style.transform = 'scaleX(-1)';
        }
    });

})();