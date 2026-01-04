// ==UserScript==
// @name         TikTok No Pause on Tab Switch
// @namespace    http://tampermonkey.net/
// @version      2025-02-06
// @description  Prevent TikTok from pausing videos when switching tabs
// @author       You
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526035/TikTok%20No%20Pause%20on%20Tab%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/526035/TikTok%20No%20Pause%20on%20Tab%20Switch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.defineProperty(document, "visibilityState", {
        get: () => "visible"
    });

    Object.defineProperty(document, "hidden", {
        get: () => false
    });

    document.addEventListener("visibilitychange", (event) => {
        event.stopImmediatePropagation();
    }, true);

})();
