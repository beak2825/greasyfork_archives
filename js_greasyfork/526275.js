// ==UserScript==
// @name         图寻按f全屏
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Press 'F' to toggle fullscreen in Tuxun solo mode.
// @author       You
// @match        https://tuxun.fun/solo/*
// @match        https://tuxun.fun/challenge/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526275/%E5%9B%BE%E5%AF%BB%E6%8C%89f%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/526275/%E5%9B%BE%E5%AF%BB%E6%8C%89f%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'f' || event.key === 'F') {
            event.preventDefault();
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        }
    });
})();
