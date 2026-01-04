// ==UserScript==
// @name         spotify remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description spotify div remover
// @author       virginonline
// @match        https://open.spotify.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479110/spotify%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/479110/spotify%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function removeElements() {
        while (true) {
            if (await divExist()) {
                var blocks = document.getElementsByClassName("OTfMDdomT5S7B5dbYTT8");

                for (var i = blocks.length - 1; i >= 0; i--) {
                    blocks[i].parentNode.removeChild(blocks[i]);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second
        }
    }

    removeElements();

    async function divExist() {
        var blocks = document.getElementsByClassName("OTfMDdomT5S7B5dbYTT8");
        return blocks.length > 0;
    }
})();
