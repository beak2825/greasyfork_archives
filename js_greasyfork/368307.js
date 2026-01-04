// ==UserScript==
// @name         Youtube No Flexy Mode
// @namespace    http://tampermonkey.net/
// @version      0.50
// @description  Disable Flexy Mode
// @author       Botan
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/368307/Youtube%20No%20Flexy%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/368307/Youtube%20No%20Flexy%20Mode.meta.js
// ==/UserScript==


// Thanks to AlexT. this fix does not longer use any intervals, it instead uses the Youtube API directly.
(function() {
    'use strict';
    if (window.top != window.self) return;
    console.log('Youtube No Flexy Mode');

    // Disables (if available) the creation of the new flexy dom.
    function disableFlexyFeature() {
        let cfg = (typeof window.ytcfg === "undefined") ? false : window.ytcfg.get("EXPERIMENT_FLAGS");
        if (!cfg || cfg.kevlar_flexy_watch_new_dom === false) return;

        cfg.kevlar_flexy_watch_new_dom = false;
        console.log('Set kevlar_flexy_watch_new_dom to false');

        cfg.kevlar_transparent_player_background = false;
        console.log('Set kevlar_transparent_player_background to false');

        window.ytcfg.set("EXPERIMENT_FLAGS", cfg);
    }

    disableFlexyFeature();
    document.addEventListener("yt-navigate-start", disableFlexyFeature, true);
})();