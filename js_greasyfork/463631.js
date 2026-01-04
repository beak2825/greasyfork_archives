// ==UserScript==
// @name         French Consulate Appointment Checker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Check available appointments on French Consulate website
// @author       You
// @match        https://consulat.gouv.fr/ambassade-de-france-en-irlande/rendez-vous?name=Visas
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463631/French%20Consulate%20Appointment%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/463631/French%20Consulate%20Appointment%20Checker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Create button
  let button = document.createElement('button');
  button.textContent = 'Check Availability';
  button.style.position = 'fixed';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.zIndex = '9999';
  document.body.appendChild(button);

  // Play sound function
  function playSound() {
    var audio = new Audio('https://freesound.org/data/previews/80/80921_1022651-lq.mp3');
    audio.play();
  }

  // Main function
  async function main() {
    // Step 3
    let previousStepBtn = document.querySelector('button[title="Aller à l\'étape précédente, vous êtes actuellement à l\'étape : Créneaux"]');
    if (!previousStepBtn) {
      console.log('无按钮');
      return;
    }

    // Step 4
let cardDiv = document.querySelector('div.card');
    if (cardDiv) {
      let cardText = cardDiv.textContent;
      if (cardText.includes('很遗憾，我们所有的座位都已预留，请稍后再回来查看是否有空位。') || cardText.includes('Malheureusement tous nos créneaux sont réservés, n’hésitez pas à revenir plus tard voir s’il y a des disponibilités.')) {
        // If card div contains "all slots reserved" text, play sound and continue loop
        playSound();
      } else if (cardText.includes('星期') || cardText.includes('Avril')) {
        // If card div doesn't contain "all slots reserved" text but contains target text, stop loop and click on the second last or last btn-custom-slot-hour-only div if present
        let btnCustomSlotHourOnlyDivs = document.querySelectorAll('div.btn-custom-slot-hour-only');
        let numDivs = btnCustomSlotHourOnlyDivs.length;
        if (numDivs > 0) {
          let btnCustomSlotHourOnlyDivToClick = null;
          if (numDivs >= 2) {
            btnCustomSlotHourOnlyDivToClick = btnCustomSlotHourOnlyDivs[numDivs - 2];
          } else {
            btnCustomSlotHourOnlyDivToClick = btnCustomSlotHourOnlyDivs[numDivs - 1];
          }
          btnCustomSlotHourOnlyDivToClick.click();
            //await new Promise(r => setTimeout(r, 100));
let frBtnPrimary = document.querySelector('.fr-btn--primary');
if (frBtnPrimary) {
  frBtnPrimary.click();
} else {
  console.log('未找到具有 class fr-btn--primary 的按钮');
}
          return;
        } else {
          // If no btn-custom-slot-hour-only divs are found, log the message
          console.log('未找到名为btn-custom-slot-hour-only的div');
        }

        // Play sound 3 times
        for (let i = 0; i < 3; i++) {
          playSound();
          await new Promise(r => setTimeout(r, 1000));
        }
        return;
      }
    } else {
      console.log('未找到名为card的div');
    }

    // Step 5
    let leadBtn = document.querySelector('button.lead');
    if (leadBtn) {
      leadBtn.click();
      await new Promise(r => setTimeout(r, 500));
      let acceptBtn = document.querySelector('button.accept');
      if (acceptBtn) {
        acceptBtn.click();
      }
    }

    // Step 6
    setTimeout(main, 1000);
  }

  // Attach event listener
  button.addEventListener('click', main);
})();