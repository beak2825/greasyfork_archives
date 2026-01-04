// ==UserScript==
// @name         auotplay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Eric Wu
// @match        *://lexiangla.com/classes/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413599/auotplay.user.js
// @updateURL https://update.greasyfork.org/scripts/413599/auotplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(() => {
        document.getElementById('video-player_html5_api').muted = true;
        document.getElementById('video-player_html5_api').play();
        document.getElementById('video-player_html5_api').addEventListener("ended", function() {
            document.getElementsByClassName('venom-btn')[0].click();
        });
    }, 2000);
})();