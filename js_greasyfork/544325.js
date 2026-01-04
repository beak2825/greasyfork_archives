// ==UserScript==
// @name         SMLWiki - Jingily Goodman
// @namespace    https://greasyfork.org/en/users/1434767
// @version      1.0
// @description  Adds Jingily Goodman
// @author       BoyOHBoy
// @match        https://smlwiki.com/newhouse/booth/
// @grant        none
// @icon         https://files.boyohboy.xyz/jinglygoodman.webp
// @downloadURL https://update.greasyfork.org/scripts/544325/SMLWiki%20-%20Jingily%20Goodman.user.js
// @updateURL https://update.greasyfork.org/scripts/544325/SMLWiki%20-%20Jingily%20Goodman.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (Math.random() < 0.1) {
        window.addEventListener('load', () => {
            const boothTop = document.getElementById('boothtop');
            if (!boothTop) return;

            const img = document.createElement('img');
            img.src = 'https://files.boyohboy.xyz/jinglygoodman.webp';
            img.style.position = 'absolute';
            img.style.bottom = '150px';
            img.style.right = '0';
            img.style.opacity = '0.5';
            img.style.imageRendering = 'pixelated';
            img.draggable = false;

            boothTop.appendChild(img);
        });
    }
})();
