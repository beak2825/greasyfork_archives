// ==UserScript==
// @name         YouTube - Disable rounded watch page side panel
// @version      2023.06.09
// @description  This script disables the rounded watch page side panel in all uses. It is based on the Mid-2021-October 2022 Watch11 Reconstruct script by Magma_Craft which sadly no longer works.
// @author       Alpharetzy
// @license MIT
// @match        https://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/1094802
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468293/YouTube%20-%20Disable%20rounded%20watch%20page%20side%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/468293/YouTube%20-%20Disable%20rounded%20watch%20page%20side%20panel.meta.js
// ==/UserScript==

(function() {
    window['yt'] = window['yt'] || {};
    yt['config_'] = yt.config_ || {};
    yt.config_['EXPERIMENT_FLAGS'] = yt.config_.EXPERIMENT_FLAGS || {};

    var iv = setInterval(function() {
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_modern_panels = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_panel_height_matches_player = false;
    }, 1);

    var to = setTimeout(function() {
        clearInterval(iv);
    }, 1000)
})();