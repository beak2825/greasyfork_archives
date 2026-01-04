// ==UserScript==
// @name         YouTube Autoplay Continuer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically clicks Yes when YouTube prompts: "Video paused. Continue watching?""
// @author       You
// @include      https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394388/YouTube%20Autoplay%20Continuer.user.js
// @updateURL https://update.greasyfork.org/scripts/394388/YouTube%20Autoplay%20Continuer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        if (document.URL.search('https://www.youtube.com/watch\\?v=') != -1){
            if (document.getElementsByTagName('iron-overlay-backdrop').length){
                document.getElementById('button').click();
            }

            if (document.getElementsByClassName('ytp-upnext ytp-player-content ytp-suggestion-set ytp-upnext-autoplay-paused').length){
                document.getElementsByClassName('ytp-upnext-autoplay-icon')[0].click()
            }
        }
    }, 1000*60);
})();