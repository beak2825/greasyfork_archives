// ==UserScript==
// @name        Melvor Idle - Queue End Fight
// @namespace   http://tampermonkey.net/
// @version     0.13
// @description Adds a button to the combat interface to leave combat after defeating the current enemy or dungeon.
// @author      Seil#1780
// @license     MIT
// @match       https://melvoridle.com/*
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com/*
// @exclude     https://*.wiki.melvoridle.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/444262/Melvor%20Idle%20-%20Queue%20End%20Fight.user.js
// @updateURL https://update.greasyfork.org/scripts/444262/Melvor%20Idle%20-%20Queue%20End%20Fight.meta.js
// ==/UserScript==

((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {

    function queueEndFight() {
        var runQueued = false;
        var _oldOnEnemyDeath = combatManager.onEnemyDeath;

        let queueRunButton = '<button type="button" id="queueRunButton" class="btn btn-sm btn-success m-1 w-100">Queue Leave Encounter</button>';

        let combatButtons = document.querySelector("#combat-enemy-options").parentNode;

        combatButtons.children[0].className = "col-4";
        combatButtons.children[1].className = "col-4";
        combatButtons.children[1].insertAdjacentHTML("afterend", '<div class="col-4"></div>');
        combatButtons.children[2].innerHTML += queueRunButton;

        document.getElementById("queueRunButton").addEventListener("click", toggleQueue);

        function toggleQueue() {
            if(runQueued) {
                document.getElementById("queueRunButton").className = "btn btn-sm btn-success m-1 w-100";
                document.getElementById("queueRunButton").textContent = "Queue Leave Encounter";
                runQueued = false;
            } else {
                document.getElementById("queueRunButton").className = "btn btn-sm btn-danger m-1 w-100";
                document.getElementById("queueRunButton").textContent = "Cancel Queued Action";
                runQueued = true;
            }
        }

        combatManager.onEnemyDeath = function onEnemyDeath() {
            var encounterCompleted = false;
            var dungeonCompleted = this.dungeonProgress+1==this.areaData.monsters.length;

            _oldOnEnemyDeath.apply(this);
            if(runQueued) {
                if(this.areaData.type==="Dungeon"&&!dungeonCompleted) {
                    encounterCompleted = false;
                } else {
                    encounterCompleted = true;
                    this.stopCombat();
                    toggleQueue();
                }
            } else {
                if(this.areaData.type==="Dungeon"&&dungeonCompleted&&!autoRestartDungeon) {
                    encounterCompleted = true;
                    this.stopCombat();
                }
            }

            return encounterCompleted;
        }
    }

    function loadScript() {
        if (typeof isLoaded !== typeof undefined && isLoaded) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            queueEndFight();
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
});