// ==UserScript==
// @name        YouTube: Disable VOLUME_STABLE
// @namespace   Userscripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.1.0
// @author      CY Fung
// @description To disable stable volumne (Drc Audio)
// @run-at      document-start
// @unwrap
// @require     https://update.greasyfork.org/scripts/475632/1361351/ytConfigHacks.js
// @inject-into page
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494252/YouTube%3A%20Disable%20VOLUME_STABLE.user.js
// @updateURL https://update.greasyfork.org/scripts/494252/YouTube%3A%20Disable%20VOLUME_STABLE.meta.js
// ==/UserScript==

window._ytConfigHacks.add((config_) => {

    let o = (((config_ || 0).WEB_PLAYER_CONTEXT_CONFIGS || 0).WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH || 0);
    if (typeof o.serializedExperimentFlags === 'string' && o.serializedExperimentFlags.length > 25) {
        o.serializedExperimentFlags = `&${o.serializedExperimentFlags}&`.replace('&html5_show_drc_toggle=true&', '&').slice(1, -1);
    }

});