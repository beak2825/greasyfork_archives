// ==UserScript==
// @name            Choose Easy Slayer Task
// @version         1.0.0
// @license         MIT
// @description     Allows rerolling Slayer tasks for a desired task
// @author          lucidobservor
// @match           https://*.melvoridle.com/*
// @exclude         https://wiki.melvoridle.com*
// @namespace       https://greasyfork.org/users/884123
// @downloadURL https://update.greasyfork.org/scripts/442519/Choose%20Easy%20Slayer%20Task.user.js
// @updateURL https://update.greasyfork.org/scripts/442519/Choose%20Easy%20Slayer%20Task.meta.js
// ==/UserScript==

function EasySlayerChoice() {
    // Set the monster IDs you want to create buttons for. These must be valid targets for Easy Slayer tasks.
    const MONSTER_IDS = [111, 82, 9, 71]

    combatManager.slayerTask.extendContainer.appendChild(document.createElement("br"));

    for (let i = 0; i < MONSTER_IDS.length; i++) {
        combatManager.slayerTask.extendContainer.appendChild(getButton(MONSTER_IDS[i]));
    }

    function getButton(monsterId) {
        let btn = document.createElement("button");
        btn.id = "new-easy-task-btn";
        btn.classList.add(...["btn", "btn-sm", "btn-primary", "m-1"]);
        btn.innerHTML = `<img class="skill-icon-xs mr-1" src="https://cdn.melvor.net/core/v018/${MONSTERS[monsterId].media}">`;
        btn.addEventListener("click", () => setNewEasyTask(monsterId));
        return btn;
    }

    function setNewEasyTask(id) {
        // Check if currently fighting an Easy task. Comment these lines out if you like to live dangerously
        if (combatManager.slayerTask.tier > 0) {
            notifyPlayer(CONSTANTS.skill.Slayer, "You must be fighting an Easy slayer task", "danger");
            return;
        }

        while (combatManager.slayerTask.monster.id != id) { combatManager.slayerTask.selectTask(0,false,false); }
    }
}


// Injecting the script when possible
(() => {
    function loadScript() {
        // Load script after the actual Melvor game has loaded
        if (typeof isLoaded !== typeof undefined && isLoaded) {
            clearInterval(scriptLoader);

            const scriptElem = document.createElement("script");
            scriptElem.textContent = `try {(${EasySlayerChoice})();} catch (e) {console.log(e);}`;
            document.body.appendChild(scriptElem).parentNode.removeChild(scriptElem);
        }
    }

    const scriptLoader = setInterval(loadScript, 250);
})();