// ==UserScript==
// @name        Kick Hotkey Video Control
// @description Userscript that enables pause, forward and backwards movement using the keyboard for kick.
// @version     1
// @grant       none
// @author      elttil(Anton Kling)
// @license     WTFPL
// @include     https://kick.com/*
// @namespace https://greasyfork.org/users/1039232
// @downloadURL https://update.greasyfork.org/scripts/465191/Kick%20Hotkey%20Video%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/465191/Kick%20Hotkey%20Video%20Control.meta.js
// ==/UserScript==

(function() {
    KeyEvent = (typeof KeyEvent === "object") ? KeyEvent : [];
    const LEFT_KEY = KeyEvent.DOM_VK_LEFT || 37;
    const RIGHT_KEY = KeyEvent.DOM_VK_RIGHT || 39;

    window.addEventListener("keydown", keyboardHandler, false);

    function keyboardHandler(zEvent) {
        if (zEvent.altKey || zEvent.ctrlKey || zEvent.shiftKey)
            return;

        // Make sure that the chat is not in focus
        if (document.activeElement.id === "message-input")
            return;

        live_display = document.getElementsByClassName("vjs-live-display");
        if (live_display.length == 0)
            return;

        var is_live = false;
        if (live_display[0].innerText == "LIVE") {
            is_live = true;
        }

        var possible_video = document.getElementsByClassName("vjs-tech");
        if (possible_video.length == 0)
            return;
        if (possible_video[0].nodeName != "VIDEO")
            return;
        video = possible_video[0];

        switch (zEvent.which) {
            case LEFT_KEY:
                if (is_live)
                    return;
                video.currentTime -= 5;
                break;
            case RIGHT_KEY:
                if (is_live)
                    return;
                video.currentTime += 5;
                break;
            case 32:
                if (video.paused)
                    video.play();
                else
                    video.pause();
                break;
            default:
                return;
        }

        zEvent.preventDefault();
        zEvent.stopPropagation();
    }
})();