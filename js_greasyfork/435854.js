// ==UserScript==
// @name		Melvor Idle - Impending Darkness for Combat Only Characters
// @namespace	http://tampermonkey.net/
// @version		0.1.5
// @description	Allows players to run Impending Darkness when they have level 99 in all combat skills and level 1 in all non-combat skills.
// @author		Xander#8896
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com/*
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/435854/Melvor%20Idle%20-%20Impending%20Darkness%20for%20Combat%20Only%20Characters.user.js
// @updateURL https://update.greasyfork.org/scripts/435854/Melvor%20Idle%20-%20Impending%20Darkness%20for%20Combat%20Only%20Characters.meta.js
// ==/UserScript==


function script() {
    // Make list of all combat skills (including slayer)
    const combatSkillIDs = []
    for (let i = 0; i < combatSkills.length; i++){
        combatSkillIDs.push(Skills[combatSkills[i]])
    }
    combatSkillIDs.push(Skills["Slayer"])

    // Make list of all skills with their corresponding required level, being level 99 for combat skills and level 1 for non combat skills
    const maxCombatLevelRequirement = []
    for (let skillID = 0; skillID < Object.keys(SKILLS).length; skillID++){
        if (combatSkillIDs.includes(skillID)) {
            let skillRequirement = {"skill": skillID}
            skillRequirement["level"] = 99
            maxCombatLevelRequirement.push(skillRequirement)
        }
    }

    // Check that all non combat skills are level 1
    let allLevelOne = true
    for (let skillID = 0; skillID < Object.keys(SKILLS).length; skillID++){
        if (!combatSkillIDs.includes(skillID)) {
            if (skillLevel[skillID] != 1) {
                allLevelOne = false
            }
        }
    }

    // if all non combat skills are level one, set dungeon requirements to having over level 99 in all combat skills
    if (allLevelOne){
        DUNGEONS[Dungeons["Impending_Darkness"]].entryRequirements[0].levels = maxCombatLevelRequirement

        let requirementText = document.getElementById(`combat-Dungeon-${Dungeons["Impending_Darkness"]}-level-req-max`)
        requirementText.innerText = " Requires Level 99 in all Combat Skills and Level 1 in all Non-Combat Skills"

        areaMenus.dungeon.updateRequirements()
    }
}

function loadScript() {
	if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
		clearInterval(scriptLoader);
		const scriptElement = document.createElement('script');
		scriptElement.textContent = `try {(${script})();} catch (e) {console.log(e);}`;
		document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
	}
}
 
const scriptLoader = setInterval(loadScript, 200);