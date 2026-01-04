// ==UserScript==
// @name         kill newsweek video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mutes and stops autoplay video on newsweek.com
// @author       Ryan Castellucci @ryancdotorg
// @match        http://www.newsweek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34668/kill%20newsweek%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/34668/kill%20newsweek%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var muted = false;
    var t1 = Date.now();

    var tryStop = function() {
        console.log("looking for jwplayer");
        if (typeof jwplayer === 'function') {
            var p = jwplayer('fusion_jwplayer');
            if (typeof p.setMute === 'function') {
                if (!muted) {
                    p.setMute();
                    muted = true;
                }
                var state = jwplayer('fusion_jwplayer').getState();
                if (state === 'playing') {
                    p.stop();
                    return;
                }
            }
        }
        if (Date.now() - t1 < 5000) {
            setTimeout(tryStop, 16);
        }
    };
    tryStop();
})();