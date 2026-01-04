// ==UserScript==
// @name         REPLACE MINES WITH RYAN
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  REPLACE MNES WITH RYANNN
// @match        https://diceblox.com/mines*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515626/REPLACE%20MINES%20WITH%20RYAN.user.js
// @updateURL https://update.greasyfork.org/scripts/515626/REPLACE%20MINES%20WITH%20RYAN.meta.js
// ==/UserScript==
// @auth        puskevit
// @license MIT
(function() {
    'use strict';

    const newImageUrl = 'https://images-ext-1.discordapp.net/external/G4VaHxrZfOFYAnZzwqUdKyimMtYtL6RZxzjAQjKL34Y/%3Fsize%3D256/https/cdn.discordapp.com/avatars/1143178769591435345/74960d099b059591399e1338d8dd889c.png?format=webp&quality=lossless&width=400&height=400';

    function replaceImages() {
        const images = document.querySelectorAll('img[alt="Tile"].base');
        images.forEach(img => {
            if (img.src !== newImageUrl) {
                img.src = newImageUrl;
                img.srcset = newImageUrl + ' 1x, ' + newImageUrl + ' 2x';
            }
        });
    }

    replaceImages();

    const observer = new MutationObserver(() => replaceImages());
    observer.observe(document.body, { childList: true, subtree: true });
})();
