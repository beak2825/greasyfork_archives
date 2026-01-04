// ==UserScript==
// @name         Shortcut keys for tvfplay
// @namespace    https://greasyfork.org/en/users/674736-jatin-sharma
// @version      0.1
// @description  Adds keyboard shortcuts for tvfplay
// @author       Jatin Sharma (jatin.earth+greasyfork@gmail.com)
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @match        https://tvfplay.com/video/*/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408469/Shortcut%20keys%20for%20tvfplay.user.js
// @updateURL https://update.greasyfork.org/scripts/408469/Shortcut%20keys%20for%20tvfplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function registerShortcutKeys() {
        function toggle_fscreen(e) {
            if(e.which == 70) {
                $('.vjs-fullscreen-control').click();
            }
        }
        $(document).keydown(toggle_fscreen);
        console.log('Fullscreen shortcut key "f" registered');
    }

    function waitForElementToDisplay(selector, time, func) {
        if(document.querySelector(selector)!==null) {
            func();
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time, func);
            }, time);
        }
    }
    $(waitForElementToDisplay('.vjs-fullscreen-control', 500, registerShortcutKeys));
})();