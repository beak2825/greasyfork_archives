// ==UserScript==
// @name         Fiery Warpath QOL
// @namespace    https://greasyfork.org/en/scripts/430131-fiery-warpath-qol
// @version      1.0
// @description  Fiery Warpath wave counter
// @author       Jonathan Zhang
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430131/Fiery%20Warpath%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/430131/Fiery%20Warpath%20QOL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (user.environment_name === "Fiery Warpath") {
        fw();
    }
})();

function fw() {
    const wave_1 = ["desert_warrior_weak", "desert_scout_weak", "desert_archer_weak"];
    const wave_2 = ["desert_warrior", "desert_scout", "desert_archer", "desert_cavalry", "desert_mage"];
    const wave_3 = ["desert_warrior_epic", "desert_scout_epic", "desert_archer_epic", "desert_cavalry_strong", "desert_mage_strong", "desert_artillery"];
    const waves = [wave_1, wave_2, wave_3];
    const wave_morale = [10, 18, 26];
    let wave = parseInt(document.querySelector(".warpathHUD").classList[1][5]);
    if (wave != 4) {
        let sum = 0;
        for (let i = 0; i < waves[wave-1].length; i++) {
            let mouse_count = document.querySelector("." + waves[wave-1][i]).getElementsByClassName("warpathHUD-wave-mouse-population")[0].innerText;
            sum += parseInt(mouse_count);
        }
        let morale_text = "<b>Support Mice Panic Meter</b><br>The Crimson Commander and Caravan Guard will retreat after " + wave_morale[wave-1] + " or fewer mice remain. Currently, " + sum + " mice remain.<div class=\"mousehuntTooltip-arrow\"></div>";
        $("div.warpathHUD-moraleBar div.mousehuntTooltip").html(morale_text);
    }
    return 0;
}

$(document).ajaxComplete(function(event,xhr,options){
    if (user.environment_name == "Fiery Warpath") {
        fw();
    }
});
