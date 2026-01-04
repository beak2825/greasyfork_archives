// ==UserScript==
// @name         Twitch f key full screen
// @version      0.1
// @description  Go full screen on Twitch by clicking the 'f' button.
// @author       Aviem Zur
// @match        https://www.twitch.tv/*
// @namespace https://greasyfork.org/users/14514
// @downloadURL https://update.greasyfork.org/scripts/389602/Twitch%20f%20key%20full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/389602/Twitch%20f%20key%20full%20screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keypress', goFullScreenEventListener);

    function goFullScreenEventListener(e) {
        if (e.code == 'KeyF') {
            document.getElementsByClassName('qa-fullscreen-button')[0].click()
        }
    }
})();