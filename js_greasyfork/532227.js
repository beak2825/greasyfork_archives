// ==UserScript==
// @name         MWI QoL 技能需求
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  MilkyWayIdle辅助工具。将您的当前技能水平与物品的要求进行对比，并根据您是否达到相应的等级要求，用不同颜色进行高亮显示。添加了中文支持
// @author       GodofTheFallen
// @author       AlexZaw
// @license      MIT License
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @downloadURL https://update.greasyfork.org/scripts/532227/MWI%20QoL%20%E6%8A%80%E8%83%BD%E9%9C%80%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/532227/MWI%20QoL%20%E6%8A%80%E8%83%BD%E9%9C%80%E6%B1%82.meta.js
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
                const requiredSkill = currentStat[2].replace('级','');
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
                    requiredSkill == 'Total' || requiredSkill == '总等级'
                ) {
                    if (requiredSkill == 'Total') {
                        currentLevel = Number(
                            document
                                .querySelector('.Header_totalLevel__8LY3Q')
                                .textContent.split(' ')[2]
                        );
                    } else if (requiredSkill == '总等级'){
                        currentLevel = Number(
                            document
                                .querySelector('.Header_totalLevel__8LY3Q')
                                .textContent.split(' ')[1]
                        );
                    } else {
                        const match = allSkills[i].parentElement.querySelector(
                                '.NavigationBar_level__3C7eR'
                            ).textContent.match(/\d+/);
                        currentLevel = Number(match[0]);
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
