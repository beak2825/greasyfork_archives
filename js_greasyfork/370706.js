// ==UserScript==
// @name         Video Unhider
// @namespace    https://greasyfork.org/users/154522
// @version      1.0
// @description  Fix the video to be unhidden when ad-blocker deletes the ad that would normally unhide it.
// @author       G-Rex
// @match        http://kissanime.ru/Anime/*
// @match        https://kissanime.ru/Anime/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370706/Video%20Unhider.user.js
// @updateURL https://update.greasyfork.org/scripts/370706/Video%20Unhider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let video = document.querySelector('.video-js');

    video.style.display = null;
})();