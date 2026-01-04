// ==UserScript==
// @name         Suno - Playing Icon Shadows
// @namespace    http://tampermonkey.net/
// @version      2024-12-05
// @description  Add drop shadows to some hard to see icons over albuma arts.
// @author       trus0und
// @license      MIT
// @match        https://suno.com/create
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suno.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519815/Suno%20-%20Playing%20Icon%20Shadows.user.js
// @updateURL https://update.greasyfork.org/scripts/519815/Suno%20-%20Playing%20Icon%20Shadows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS for images with alt="Play", alt="Pause", and div.flex Animation
    const style = document.createElement('style');
    style.innerHTML = `
        img[alt="Play"] {
            filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 1));
        }
        img[alt="Pause"] {
            filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 1));
        }
        div.flex.space-x-1 > * {
            filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 1));
        }
    `;
    document.head.appendChild(style);
})();