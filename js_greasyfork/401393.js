// ==UserScript==
// @name         UpgradeRobotics
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       You
// @match        https://*.ogame.gameforge.com/game/index.php?page=ingame&component=facilities*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401393/UpgradeRobotics.user.js
// @updateURL https://update.greasyfork.org/scripts/401393/UpgradeRobotics.meta.js
// ==/UserScript==

(function () {
    if ($(".construction.active .idle").html() != null) {
        var facilityLevel = parseInt($(".roboticsFactory > .level").text(), 10);
        if (facilityLevel < 20)
            setTimeout(function () {
                $(".roboticsFactory button").trigger("click");
            }, Math.random() * 2000);
    }
})();