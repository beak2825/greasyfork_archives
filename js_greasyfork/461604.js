// ==UserScript==
// @name         Democracy Now: Add playback rate (speed) control to settings (gear)
// @version      0.1.1
// @description  Add playback rate (speed) control to the settings (gear) on democracynow.org
// @author       adgitate
// @match        https://www.democracynow.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=democracynow.org
// @run-at       document-end
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/4252
// @downloadURL https://update.greasyfork.org/scripts/461604/Democracy%20Now%3A%20Add%20playback%20rate%20%28speed%29%20control%20to%20settings%20%28gear%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461604/Democracy%20Now%3A%20Add%20playback%20rate%20%28speed%29%20control%20to%20settings%20%28gear%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
    window.onload = setTimeout(function() {
        let jwplayer2 = window.jwplayer || (unsafeWindow && unsafeWindow.jwplayer);
        if(jwplayer2) {
            jwplayer2().setConfig({"playbackRateControls": true});
        }
    }, 1500);
})();
