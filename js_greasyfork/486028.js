// ==UserScript==
// @name         Twitch Auto Refresh and Key F
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto refresh Twitch and press F after 10 seconds
// @author       You
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486028/Twitch%20Auto%20Refresh%20and%20Key%20F.user.js
// @updateURL https://update.greasyfork.org/scripts/486028/Twitch%20Auto%20Refresh%20and%20Key%20F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for 10 minutes then refresh the page
    setTimeout(function() {
        location.reload();
    }, 600000);  // 600000 milliseconds = 10 minutes

    // After refresh, wait for 10 seconds then press F
    window.onload = function() {
        setTimeout(function() {
            var e = new KeyboardEvent('keydown', {
                key: 'F',
                code: 'KeyF',
                keyCode: 70,
                which: 70
            });
            document.dispatchEvent(e);
        }, 10000);  // 10000 milliseconds = 10 seconds
    };
})();
