// ==UserScript==
// @name        Pickpocketing Test
// @namespace   https://github.com/HardcoreMuse
// @description A tool used for helping with Pickpocketing
// @author      Arkhimedes [3491087]
// @match       https://www.torn.com/loader.php?sid=crimes*
// @version     Alpha-v1
// @grant       none
// @grant       unsafeWindow
// @icon        https://img.icons8.com/?size=64&id=v1JR7fsYAuq2&format=png
// @run-at      document-start
// @supportURL  https://github.com/HardcoreMuse/picker
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/519500/Pickpocketing%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/519500/Pickpocketing%20Test.meta.js
// ==/UserScript==

let currentCrimeSkill = 0; // Variable to hold the current crime skill level

(function() {
  'use strict';

  const categoryData = {
    "Safe": { color: "#28A745", multiplier: "1x" },
    "Low Risk": { color: "#8BC34A", multiplier: "1.5x" },
    "Moderate Risk": { color: "#FFC107", multiplier: "2x" },
    "High Risk": { color: "#FD7E14", multiplier: "2.5x" },
    "Dangerous": { color: "#DC3545", multiplier: "3x" },
    "Very Dangerous": { color: "#8B0000", multiplier: "3.5x" }
  };

  const markGroups = {
    "Safe": ["Drunk man", "Drunk woman", "Homeless person", "Junkie", "Elderly man", "Elderly woman"],
    "Low Risk": ["Classy lady", "Laborer", "Postal worker", "Young man", "Young woman", "Student"],
    "Moderate Risk": ["Rich kid", "Sex worker", "Thug"],
    "High Risk": ["Jogger", "Businessman", "Businesswoman", "Gang member", "Mobster"],
    "Dangerous": ["Cyclist"],
    "Very Dangerous": ["Police officer"]
  };

  const tierRanges = {
    "Safe": [1, 20],
    "Low Risk": [10, 70],
    "Moderate Risk": [35, 90],
    "High Risk": [65, Infinity],
    "Dangerous": [80, Infinity],
    "Very Dangerous": [95, 100]
  };

  function getCrimeSkillLvl() {
    const progressElement = document.querySelector('.progressFill___zsgNm');

    if (progressElement) {
      const ariaLabel = progressElement.getAttribute('aria-label');
      if (ariaLabel) {
        const numberMatch = ariaLabel.match(/Crime skill:\s*(\d+)/);
        if (numberMatch) {
          currentCrimeSkill = parseInt(numberMatch[1], 10); // Update the global crimeSkill value
          console.log('Updated skill level:', currentCrimeSkill);
        }
      }
    } else {
      console.log('Crime skill progress element not found.');
    }
  }

  function getPlayerTier() {
    for (const [category, [min, max]] of Object.entries(tierRanges)) {
      if (currentCrimeSkill >= min && currentCrimeSkill <= max) {
        return category;
      }
    }
    return null;
  }

  function makeUniqueStarShinyGold() {
    // Select all elements with the class uniqueStar___AbNom
    const uniqueStarElements = document.querySelectorAll('.uniqueStar___AbNom');

    uniqueStarElements.forEach(starElement => {
      // Find the child element with the scalableSheetIcon___eQPgk class
      const iconElement = starElement.querySelector('.scalableSheetIcon___eQPgk');
      if (iconElement) {
        // Ensure the element is relatively positioned for pseudo-elements
        iconElement.style.position = 'relative';

        // Add a glowing effect using a pseudo-element
        iconElement.style.boxShadow = '0 0 2px gold, 0 0 4px gold, 0 0 6px gold';
        iconElement.style.border = '1px solid gold';
        iconElement.style.borderRadius = '50%'; // Optional for a rounded look
      }
    });
  }

  function updateDivColors() {
    const url = window.location.href;
    if (!url.includes("#/pickpocketing")) return;

    const divElements = document.querySelectorAll('.titleAndProps___DdeVu:not(.processed)');
    divElements.forEach(divElement => {
      const divContent = divElement.querySelector('div').textContent.trim();
      const additionalData = divElement.querySelector('button.physicalPropsButton___xWW45');
      if (!additionalData) return;

      const additionalText = additionalData.textContent.trim();
      const text = `${divContent} ${additionalText}`;

      for (const [category, { color, multiplier }] of Object.entries(categoryData)) {
        if (markGroups[category].some(mark => text.includes(mark))) {
          const targetDiv = divElement.querySelector('div');
          targetDiv.style.color = color;
          const frostyBlue = "#54c6ec";
          const normalColor = "#666666";

          if (window.innerWidth > 386) {
            const playerTier = getPlayerTier();
            const tierHighlight = playerTier === category ? ` <span style="color: ${normalColor}; font-weight: bold;">(Current Tier)</span>` : '';
            targetDiv.innerHTML = `${divContent} (${category}) <span style="color: ${frostyBlue}; font-weight: bold;">${multiplier} Skill</span>${tierHighlight}`;
          }

          divElement.classList.add('processed');
          let parentElement = divElement;
          for (let i = 0; i < 3; i++) {
            parentElement = parentElement.parentElement;
          }
          if (!parentElement.classList.contains('processed')) {
            parentElement.style.borderLeft = `3px solid ${color}`;
            parentElement.classList.add('processed');
          }
        }
      }
    });
  }

  setInterval(() => {
    getCrimeSkillLvl();
    updateDivColors();
    makeUniqueStarShinyGold();
  }, 1000);
})();
