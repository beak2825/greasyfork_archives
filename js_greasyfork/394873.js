// ==UserScript==
// @name         WebSpotify
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make spotify web player working on mobile device.
// @run-at       document-start
// @author       gvvad
// @include      http*://open.spotify.com/*
// @license      MIT; https://opensource.org/licenses/MIT
// @copyright    2020, gvvad
// @grant        none
// @namespace    https://greasyfork.org/users/100160
// @downloadURL https://update.greasyfork.org/scripts/394873/WebSpotify.user.js
// @updateURL https://update.greasyfork.org/scripts/394873/WebSpotify.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let _scr = {};
    for (const key in window.screen) {
        _scr[key] = window.screen[key];
    }
    Object.setPrototypeOf(_scr, Object.getPrototypeOf(window.screen));

    _scr.width = 1080;
    _scr.height = 1920;

    window.screen = _scr;
})();