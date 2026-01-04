// ==UserScript==
// @name         Total skills at squad page
// @namespace    http://tampermonkey.net/
// @version      2024-07-09
// @description  ..
// @author       Ngã Ba Ông Tạ Sài Gòn
// @match        https://sokker.org/en/app/squad/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sokker.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545982/Total%20skills%20at%20squad%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/545982/Total%20skills%20at%20squad%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("start script");

    function calculateTotalSkills() {
        // Select all player boxes
        const playerBoxes = document.querySelectorAll('.player-box-skills');
        playerBoxes.forEach(playerBox => {
            let totalSkill = 0;

            // Select all skill items for the current player
            const skillItems = playerBox.querySelectorAll('.skill-list__item');
            // console.log('Skill Item:', skillItems);

            // Iterate through each skill item and sum up the skills
            skillItems.forEach(skillItem => {

                // Find the skill name
                const skillNameElement = skillItem.querySelector('.text-overflow');
                if (!skillNameElement) {
                    return;
                }
                const skillName = skillNameElement.textContent.trim();

                //console.log('Skill Name:', skillName);

                 // Check if skill should be excluded based on skill name
                if (skillName.includes('form') ||
                    skillName.includes('tactical discipline')
                ) {
                    // Skip processing this skill value
                    //console.log('Skip!!!!!!');
                    return;
                }
               // Find the skill value
                const skillValue = skillItem.querySelector('.headline').textContent.trim();
                const skillValueNumber = parseInt(skillValue);

                // Add the skill value to totalSkill
                if (!isNaN(skillValueNumber)) {
                    totalSkill += skillValueNumber;
                }

            });

/*
            // Create a new row element to display the total skill
            const totalRow = document.createElement('div');
            totalRow.classList.add('total-row');

            // Set the content for the total row
            totalRow.innerHTML = `<div><strong>Total Skill: ${totalSkill}</strong></div>`;

            // Append the total row to the player box
            playerBox.appendChild(totalRow);
            */
            // Create a new element for displaying the total skill
            const totalSkillElement = document.createElement('div');
            totalSkillElement.classList.add('total-skill');
            totalSkillElement.textContent = `Total Skill: ${totalSkill}`;
            totalSkillElement.style.fontSize = getComputedStyle(playerBox.querySelector('.headline')).fontSize;
            totalSkillElement.style.fontWeight = 'bold';
            totalSkillElement.style.textDecoration = 'underline';

            // Append the total skill element to the player box
            playerBox.appendChild(totalSkillElement);
        });
        //console.log('Player boxes:', playerBoxes);
    }

    // Wait for the DOM to fully load before executing the script
    //window.addEventListener('load', calculateTotalSkills);
    setTimeout(calculateTotalSkills, 3000);

})();