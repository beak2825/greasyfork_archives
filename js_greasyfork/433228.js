// ==UserScript==
// @name         Melvor Thieving Unique Drop Hunter
// @namespace    http://tampermonkey.net/
// @version      0.22.2
// @description  Periodically checks if the NPC you are thieving from has a locked NPC unique drop (DOES NOT WORK OFFLINE YET)
// @author       Chrono
// @match        https://melvoridle.com/
// @icon         https://www.google.com/s2/favicons?domain=melvoridle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433228/Melvor%20Thieving%20Unique%20Drop%20Hunter.user.js
// @updateURL https://update.greasyfork.org/scripts/433228/Melvor%20Thieving%20Unique%20Drop%20Hunter.meta.js
// ==/UserScript==

function HuntThievingUniques(){

    if (game.activeSkill == ActiveSkills.THIEVING)
    {
        console.log("Player is thieving. Unique Hunt active.");

        var time = 0;


        loop1:
        for (const area of Thieving.areas) {
            //console.log(`areaID ${area.id}`);
            loop2:
            for (const npc of area.npcs) {
                //console.log(`area ${area.id} and npc ${npc}`);
                time = game.thieving.getNPCInterval(Thieving.npcs[npc]);
                //console.log(`time = ${time}`);

                var NPCUniqueDropID = Thieving.npcs[npc].uniqueDrop.itemID;
                if (NPCUniqueDropID != -1 && itemStats[NPCUniqueDropID].stats[0] ==0)
                {
                    console.log ( `Locked unique found; start thieving (${area.id},${Thieving.npcs[npc].name})`);
                    time = game.thieving.getNPCInterval(Thieving.npcs[npc]);
                    game.thieving.startThieving(area,Thieving.npcs[npc])
                    break loop1;
                }
            }
        }
        loopend:
        setInterval(HuntThievingUniques,250*time);
    }
    else
    {
        console.log("Player is not thieving. Checking again in 30 minutes");
        setTimeout(HuntThievingUniques,1800000);
    }
}

(function () {
    function loadScript() {
        if ((window.isLoaded && !window.currentlyCatchingUp)
            || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            HuntThievingUniques();
        }
    }
    const scriptLoader = setInterval(loadScript, 200);
})();