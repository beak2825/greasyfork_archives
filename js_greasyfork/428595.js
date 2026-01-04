// ==UserScript==
// @name        Allow Context
// @namespace   net.englard.shmuelie
// @version     1.0.0
// @description Adds support for context menu on OnlyFans and Spotlightr
// @author      Shmuelie
// @match       https://onlyfans.com/*
// @match       https://*.spotlightr.com/*
// @grant       none
// @website     https://github.com/shmuelie/user-scripts/blob/main/src/AllowContext.user.js
// @supportURL  https://github.com/shmuelie/user-scripts/issues
// @run-at      document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/428595/Allow%20Context.user.js
// @updateURL https://update.greasyfork.org/scripts/428595/Allow%20Context.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener("contextmenu", function (e) { e.stopPropagation(); e.stopImmediatePropagation(); });
    document.body.addEventListener("contextmenu", function (e) { e.stopPropagation(); e.stopImmediatePropagation(); return false; }, true);
})();