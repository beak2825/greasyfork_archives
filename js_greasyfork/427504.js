// ==UserScript==
// @name         Workaround For Youtube Embed Preview
// @namespace    https://github.com/stu43005
// @version      0.1
// @description  Fix Youtube Embed Preview
// @author       stu43005
// @match        https://www.youtube.com/embed*
// @run-at       document-end
// @grant        none
// @license      BSD-3-Clause https://opensource.org/licenses/BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/427504/Workaround%20For%20Youtube%20Embed%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/427504/Workaround%20For%20Youtube%20Embed%20Preview.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ytcfg = window.ytcfg;
    if (!ytcfg) {
        console.warn("disablePlayability: ytcfg is missing");
        return;
    }
    const configs = ytcfg.get("WEB_PLAYER_CONTEXT_CONFIGS");
    configs.WEB_PLAYER_CONTEXT_CONFIG_ID_EMBEDDED_PLAYER.serializedExperimentFlags = configs.WEB_PLAYER_CONTEXT_CONFIG_ID_EMBEDDED_PLAYER.serializedExperimentFlags.replace(/(?<=embeds_enable_playability_on_web_preview=)true/, "false");
    console.info("disablePlayability: embeds_enable_playability_on_web_preview flag disabled");

})();
