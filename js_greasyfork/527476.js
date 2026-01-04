// ==UserScript==
// @name         Fix Play/Pause
// @namespace    http://tampermonkey.net/
// @version      2025-02-19
// @description  Fixes media controls (rewind, forward, play/pause) on Udemy course pages.
// @author       MajorAmari
// @license      MIT 
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527476/Fix%20PlayPause.user.js
// @updateURL https://update.greasyfork.org/scripts/527476/Fix%20PlayPause.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function rewind() {
        const el = document.querySelector('[data-purpose="rewind-skip-button"]');
        el.click();
    }

    function forward() {
        const el = document.querySelector('[data-purpose="forward-skip-button"]');
        el.click();
    }

    function playOrPause() {
        const el = document.querySelector('[data-purpose="pause-button"], [data-purpose="play-button"]');
        el.click();
    }

    navigator.mediaSession.setActionHandler('previoustrack', rewind);
    navigator.mediaSession.setActionHandler('nexttrack', forward);
    navigator.mediaSession.setActionHandler('play', playOrPause);
    navigator.mediaSession.setActionHandler('pause', playOrPause);
})();