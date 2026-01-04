// ==UserScript==
// @name         sound bar
// @namespace    http://soundbar.net/
// @version      0.1
// @description  testing sounding
// @author       You
// @license      MIT
// @match        https://stackoverflow.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461302/sound%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/461302/sound%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var player = document.createElement('audio');
    player.src = 'https://cdn.freesound.org/previews/80/80921_1022651-lq.mp3';
    player.preload = 'auto';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    sleep(1000);
    player.play();
    player.play();
    player.play();
    // Your code here...
})();