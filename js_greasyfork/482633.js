// ==UserScript==
// @name         missav-player
// @namespace    https://missav.*
// @version      v0.1.2
// @description  missav player
// @author       You
// @include        https://missav.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482633/missav-player.user.js
// @updateURL https://update.greasyfork.org/scripts/482633/missav-player.meta.js
// ==/UserScript==


(function () {
    setTimeout(() => {

        if (window.player == null) {
            return;
        }

        const originalPause = window.player.pause;

        window.player.pause = function() {
            if (arguments.callee.caller == null) {
                originalPause.apply(this, arguments);
            }
        };

    }, 1000);
})();
