// ==UserScript==
// @name         MWI QoL Skill requirement
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Tools for MilkyWayIdle. Compares your current skill level to the item's requirements and highlights them in different colors depending on whether you are leveled up enough
// @author       AlexZaw
// @license      MIT License
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @downloadURL https://update.greasyfork.org/scripts/530719/MWI%20QoL%20Skill%20requirement.user.js
// @updateURL https://update.greasyfork.org/scripts/530719/MWI%20QoL%20Skill%20requirement.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const levelNotEnoughColor = 'red';
    const levelEnoughColor = 'blue';

    const RequiredLevelItemStyle = document.createElement('style');
    RequiredLevelItemStyle.textContent = `
      :where(.ItemTooltipText_itemTooltipText__zFq3A :where(.ItemTooltipText_equipmentDetail__3sIHT, .ItemTooltipText_abilityDetail__3ZiU5)) > div:nth-child(2) {
        color: ${levelEnoughColor};
      }
    `;
    document.head.appendChild(RequiredLevelItemStyle);

    new MutationObserver(waitItemInfoPopup).observe(document.body, {
        childList: true,
    });

    function waitItemInfoPopup(changes, observer) {
        if (document.querySelector('.MuiTooltip-popper')) {
            main();
        }
    }

    function main() {
        const toolTipText = document.querySelector(
            '.ItemTooltipText_itemTooltipText__zFq3A'
        );
        try {
            const detail =
                toolTipText.querySelector(
                    '.ItemTooltipText_equipmentDetail__3sIHT'
                ) ||
                toolTipText.querySelector(
                    '.ItemTooltipText_abilityDetail__3ZiU5'
                );
            const itemRequirementsElems =
                detail.querySelector(':nth-child(2)').children;
            [...itemRequirementsElems].forEach((el) => {
                const currentStat = el.textContent.split(' ');
                const requiredLevel = Number(currentStat[1]);
                const requiredSkill = currentStat[2];
                if (!isLevelEnough(requiredSkill, requiredLevel)) {
                    el.style.color = levelNotEnoughColor;
                    el.textContent = `!!! ${el.textContent} !!!`;
                }
            });
        } catch (error) {
            return false;
        }
    }

    function isLevelEnough(requiredSkill, requiredLevel) {
        try {
            let currentLevel;
            const allSkills = getAllSkillLevels();
            for (let i = 0; i < allSkills.length; i++) {
                if (
                    allSkills[i].textContent == requiredSkill ||
                    requiredSkill == 'Total'
                ) {
                    if (requiredSkill == 'Total') {
                        currentLevel = Number(
                            document
                                .querySelector('.Header_totalLevel__8LY3Q')
                                .textContent.split(' ')[2]
                        );
                    } else {
                        currentLevel = Number(
                            allSkills[i].parentElement.querySelector(
                                '.NavigationBar_level__3C7eR'
                            ).textContent.split('+')[0]
                        );
                    }
                    if (currentLevel >= requiredLevel) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        } catch (error) {
            return false;
        }
    }

    function getAllSkillLevels() {
        return document
            .querySelector('.NavigationBar_navigationLinks__1XSSb')
            .querySelectorAll('.NavigationBar_label__1uH-y');
    }
})();
