// ==UserScript==
// @name        Skip Leaving Messages
// @namespace   net.englard.shmuelie
// @version     1.0.0
// @description Skip redirect permission pages.
// @author      Shmuelie
// @match       https://www.youtube.com/redirect*
// @match       https://steamcommunity.com/linkfilter/*
// @grant       none
// @website     https://github.com/shmuelie/user-scripts/blob/main/src/SkipLeavingMessages.user.js
// @supportURL  https://github.com/shmuelie/user-scripts/issues
// @run-at      document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/428596/Skip%20Leaving%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/428596/Skip%20Leaving%20Messages.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var link = document.getElementById("invalid-token-redirect-goto-site-button") ||
               document.getElementById("proceedButton");
    if (link) {
        window.location = link.href;
    }
})();