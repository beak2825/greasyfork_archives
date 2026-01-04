// ==UserScript==
// @name         NoSABR (Disable Youtube Auto-Dubbing)
// @namespace    http://tampermonkey.net/
// @version      2025-08-29
// @description  Disable this annoying AI voice in youtube
// @author       emlinhax
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547632/NoSABR%20%28Disable%20Youtube%20Auto-Dubbing%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547632/NoSABR%20%28Disable%20Youtube%20Auto-Dubbing%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


    window.ytcfg_set = ytcfg.set
    ytcfg.set = (x) => {
        console.log("Disabling SABR Auto-dubbing...")
        for(var c in x.WEB_PLAYER_CONTEXT_CONFIGS)
        {
            x.WEB_PLAYER_CONTEXT_CONFIGS[c].serializedExperimentFlags = x.WEB_PLAYER_CONTEXT_CONFIGS[c].serializedExperimentFlags.replace(/html5_sabr(.*?)true/g, 'html5_sabr$1false');
            console.log(x.WEB_PLAYER_CONTEXT_CONFIGS[c].serializedExperimentFlags)
        }
        window.ytcfg_set(x)
    }
})();