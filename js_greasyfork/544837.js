// ==UserScript==
// @name         Enable Right Click with Shift
// @namespace    http://xplshn.com.ar
// @description  Let Shift+Right Click bypass any page handler silently
// @version      1.0
// @license      Unlicense
// @encoding     utf-8
// @icon         https://github.com/xplshn.png
// @include      *://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544837/Enable%20Right%20Click%20with%20Shift.user.js
// @updateURL https://update.greasyfork.org/scripts/544837/Enable%20Right%20Click%20with%20Shift.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // This runs before any other contextmenu handlers
    document.addEventListener('contextmenu', function (e) {
        if (e.shiftKey) {
            // Only stop propagation if Shift is held *during* right click
            e.stopImmediatePropagation();
        }
    }, true);
})();
