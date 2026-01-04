// ==UserScript==
// @name         Mousehunt - Mousoleum Wall Repair
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Repairs wall as long as you have your wall up + you have more than 1 slat
// @author       You
// @match        https://www.mousehuntgame.com/camp.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463667/Mousehunt%20-%20Mousoleum%20Wall%20Repair.user.js
// @updateURL https://update.greasyfork.org/scripts/463667/Mousehunt%20-%20Mousoleum%20Wall%20Repair.meta.js
// ==/UserScript==

(function() {
    const interval = setInterval(function() {
        mousoleum()
    }, 30000); // set checking interval here (in miliseconds, 5000 = 5s)
})();

function mousoleum() {
    var wallHealth = parseInt(user.quests.QuestMousoleum.wall_health)
    var cemetarySlat = parseInt(user.quests.QuestMousoleum.wall_materials)
    if (user.environment_name == "Mousoleum" && cemetarySlat > 1) {
        if (wallHealth == 30) {
            // Do nothing, wall is already at full health
        } else {
            hg.views.HeadsUpDisplayMousoleumView.repairWall(this);
            }
    } else {
        // User is not in the Mousoleum environment, do nothing
    }
}