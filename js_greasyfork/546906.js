// ==UserScript==
// @name            Stop Tracking All
// @name:en         Stop Tracking All
// @namespace       https://github.com/ewigl/nexusmods-stop-tracking-all
// @icon            https://www.nexusmods.com/favicon.ico
// @match           https://www.nexusmods.com/mods/trackingcentre*
// @match           https://www.nexusmods.com/*/mods/trackingcentre*
// @grant           unsafeWindow
// @version         1.0.1
// @author          Licht
// @license         MIT
// @description     批量取消关注 Nexusmods 上的模组。
// @description:en  Stop tracking multiple mods at once on Nexus Mods.
// @downloadURL https://update.greasyfork.org/scripts/546906/Stop%20Tracking%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/546906/Stop%20Tracking%20All.meta.js
// ==/UserScript==

unsafeWindow.elStopTrackingAll = () => {
  $(".toggle-track-mod").each((_i, element) => {
    element.click();
  });
};
