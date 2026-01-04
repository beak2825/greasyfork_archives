// ==UserScript==
// @name         Youtube AutoSpeed
// @namespace    https://hrry.xyz
// @version      0.1
// @description  automatically change video speed
// @author       bluescorpian
// @match        https://www.youtube.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462214/Youtube%20AutoSpeed.user.js
// @updateURL https://update.greasyfork.org/scripts/462214/Youtube%20AutoSpeed.meta.js
// ==/UserScript==

const DEFAULT_SPEED = 2;

(function() {
    'use strict';

    const video = document.querySelector('.html5-main-video');

    if (video) video.playbackRate = DEFAULT_SPEED;
})();