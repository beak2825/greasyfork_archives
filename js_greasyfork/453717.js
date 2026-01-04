// ==UserScript==
// @name         Pornhub autopause
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pause videos playing in background tabs when a video starts playing in the foreground tab
// @author       Kirill Skliarov
// @match        https://www.pornhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453717/Pornhub%20autopause.user.js
// @updateURL https://update.greasyfork.org/scripts/453717/Pornhub%20autopause.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const video = document.querySelector('.mgp_videoWrapper > video');
    if (video) {
        const channel = new BroadcastChannel('AutoPauseInBackgroundTab');
        video.addEventListener('play', () => channel.postMessage(null));
        channel.addEventListener('message', () => video.pause());
    }
})();