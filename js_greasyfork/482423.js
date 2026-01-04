// ==UserScript==
// @name         Show me the prompt
// @namespace    http://tampermonkey.net/
// @version      2023-12-20
// @description  Reveals the prompt in v6 ranking
// @match        https://www.midjourney.com/rank-v6*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=midjourney.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482423/Show%20me%20the%20prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/482423/Show%20me%20the%20prompt.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    while (true) {
        await timeout(1000);
        var images = document.querySelectorAll('img');
        images.forEach(function(img) {
            if(img.parentNode.parentNode.childElementCount < 2){
                var altText = img.getAttribute('alt');
                var paragraph = document.createElement('p');
                paragraph.textContent = altText;
                img.parentNode.parentNode.prepend(paragraph);
            }
        });
    }
})();