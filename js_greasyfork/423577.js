// ==UserScript==
// @name         Stats for Nerds
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Shortcuts for YouTube stats for nerds. Press S to open, press W to close.
// @author       Tony Stark
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423577/Stats%20for%20Nerds.user.js
// @updateURL https://update.greasyfork.org/scripts/423577/Stats%20for%20Nerds.meta.js
// ==/UserScript==
(function() {
    'use strict';

    document.addEventListener("keydown", e => {
        if (e.keyCode === 83) {
            let player = document.querySelector('#movie_player');
            player.dispatchEvent(new CustomEvent('contextmenu'));
            player.click();
            document.querySelector('div.ytp-menuitem:nth-child(7)').click();
        }
    });

    document.addEventListener("keydown", e => {
        let player = document.querySelector('#movie_player');
        player.dispatchEvent(new CustomEvent('contextmenu'));
        player.click();
        if (e.keyCode === 87) {
            document.querySelector('.html5-video-info-panel-close').click();
        }
    });
    // Your code here...
})();