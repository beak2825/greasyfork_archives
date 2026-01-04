// ==UserScript==
// @name         Woodcutting Interval Fix
// @version      0.2
// @description  Patches rounding error in woodcutting intervals
// @author       MSFNS
// @match        https://*.melvoridle.com/*

// Made for version 0.21
// Will be removed if/when bug is patched
// @namespace https://greasyfork.org/users/805341
// @downloadURL https://update.greasyfork.org/scripts/431881/Woodcutting%20Interval%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/431881/Woodcutting%20Interval%20Fix.meta.js
// ==/UserScript==

function script() {
    // Loading script
    console.log('Woodcutting Interval');
	calculateSkillInterval = function (skillID, baseInterval, action = 0, useCharge = true) {
    let interval = baseInterval;
    let decreasedSkillIntervalPercent = getTotalFromModifierArray("decreasedSkillIntervalPercent", skillID);
    let increasedSkillIntervalPercent = getTotalFromModifierArray("increasedSkillIntervalPercent", skillID);
    let decreasedSkillInterval = getTotalFromModifierArray("decreasedSkillInterval", skillID);
    let increasedSkillInterval = getTotalFromModifierArray("increasedSkillInterval", skillID);
    switch (skillID) {
    case CONSTANTS.skill.Woodcutting:
        if (getMasteryLevel(CONSTANTS.skill.Woodcutting, action) >= 99)
            decreasedSkillInterval += 200;
        break;
    case CONSTANTS.skill.Firemaking:
        if (getMasteryPoolProgress(CONSTANTS.skill.Firemaking) >= masteryCheckpoints[1])
            decreasedSkillIntervalPercent += 10;
        decreasedSkillIntervalPercent += getMasteryLevel(CONSTANTS.skill.Firemaking, action) * 0.1;
        break;
    case CONSTANTS.skill.Cooking:
        if (checkSummoningSynergyActive(9, 17, useCharge, getTimePerActionModifierMastery(CONSTANTS.skill.Cooking, baseInterval, action)))
            decreasedSkillInterval += playerModifiers.summoningSynergy_9_17;
        break;
    case CONSTANTS.skill.Mining:
        if (getMasteryPoolProgress(CONSTANTS.skill.Mining) >= masteryCheckpoints[2])
            decreasedSkillInterval += 200;
        break;
    case CONSTANTS.skill.Smithing:
        if (checkSummoningSynergyActive(9, 17, useCharge, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, baseInterval, action)))
            decreasedSkillInterval += playerModifiers.summoningSynergy_9_17;
        break;
    case CONSTANTS.skill.Thieving:
        if (checkSummoningSynergyActive(5, 11, false, baseInterval) && action === 4)
            increasedSkillIntervalPercent += 50;
        break;
    case CONSTANTS.skill.Fletching:
        if (getMasteryPoolProgress(CONSTANTS.skill.Fletching) >= masteryCheckpoints[3])
            decreasedSkillInterval += 200;
        break;
    case CONSTANTS.skill.Crafting:
        if (getMasteryPoolProgress(CONSTANTS.skill.Crafting) >= masteryCheckpoints[2])
            decreasedSkillInterval += 200;
        break;
    case CONSTANTS.skill.Agility:
        if (getMasteryLevel(CONSTANTS.skill.Agility, action) >= 10)
            decreasedSkillIntervalPercent += 3 * Math.floor(getMasteryLevel(CONSTANTS.skill.Agility, action) / 10);
        break;
    }
    interval = interval * (100 + increasedSkillIntervalPercent - decreasedSkillIntervalPercent) / 100;
    interval -= decreasedSkillInterval;
    interval += increasedSkillInterval;
    if (interval < 250)
        interval = 250;
    return Math.ceil(interval);
}
}

(function () {
    function injectScript(main) {
        const scriptElement = document.createElement('script');
        scriptElement.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
        document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
    }

    function loadScript() {
        if ((window.isLoaded && !window.currentlyCatchingUp)
            || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            injectScript(script);
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
})();