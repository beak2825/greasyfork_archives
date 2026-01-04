// ==UserScript==
// @name         Twitch Auto Refresh and Key ALT+T
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto refresh Twitch and press ALT+T after 10 seconds
// @author       You
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485935/Twitch%20Auto%20Refresh%20and%20Key%20ALT%2BT.user.js
// @updateURL https://update.greasyfork.org/scripts/485935/Twitch%20Auto%20Refresh%20and%20Key%20ALT%2BT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for 10 minutes then refresh the page
    setTimeout(function() {
        location.reload();
    }, 600000);  // 600000 milliseconds = 10 minutes

    // After refresh, wait for 10 seconds then press ALT+T
    window.onload = function() {
        setTimeout(function() {
            var e = new KeyboardEvent('keydown', {
                altKey: true,
                key: 'T',
                code: 'KeyT',
                keyCode: 84,
                which: 84
            });
            document.dispatchEvent(e);
        }, 10000);  // 10000 milliseconds = 10 seconds
    };
})();
