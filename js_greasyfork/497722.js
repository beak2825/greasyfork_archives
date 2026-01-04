// ==UserScript==
// @name         mitpod
// @namespace    https://www.twitch.tv/mitpod
// @version      0.1
// @description  Rotates and inverts the video element on the page.
// @author       Your Name
// @match        https://www.twitch.tv/mitpod
// @match        https://www.twitch.tv/lightbaytv
// @match        https://www.twitch.tv/nobkfilmremake
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497722/mitpod.user.js
// @updateURL https://update.greasyfork.org/scripts/497722/mitpod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        (s => {
            s.transform = s.transform ? '' : 'rotate(180deg)';
            s.filter = s.filter ? '' : 'invert(1)';
        })(document.querySelector('video').style);
    }, 900); // 5000 milliseconds = 5 seconds
})();