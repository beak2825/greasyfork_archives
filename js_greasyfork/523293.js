// ==UserScript==
// @name         Checkbox.toys Auto Clicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto clicks checkboxes on checkbox.toys
// @author       You
// @match        https://checkbox.toys/*
// @grant        none
// @license      sigma
// @downloadURL https://update.greasyfork.org/scripts/523293/Checkboxtoys%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/523293/Checkboxtoys%20Auto%20Clicker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const checkboxdiv = document.querySelector(".checkboxes");
  const startButton = document.querySelector(".startButton");
  let canClick = false;

  const buttonObserver = new MutationObserver(() => {
    const buttonText = startButton.innerText;
    canClick = !["START COUNTDOWN", "3", "2", "1"].includes(buttonText);
    if (canClick) {
      checkboxdiv.children[0].click();
    }
    console.log(`Button text changed to: ${buttonText}, canClick: ${canClick}`);
  });

  const checkboxObserver = new MutationObserver(() => {
    console.log(`Checkbox mutation detected, canClick: ${canClick}`);
    if (!canClick) return;
    
    const checkboxes = Array.from(checkboxdiv.children);
    const lastEnabled = checkboxes.reverse().find(checkbox => !checkbox.disabled);
    if (lastEnabled) {
      console.log('Clicking last enabled checkbox');
      lastEnabled.click();
    } else {
      console.log('No enabled checkboxes found');
    }
  });

  console.log('Setting up observers...');

  buttonObserver.observe(startButton, {
    characterData: true,
    childList: true,
    subtree: true
  });

  checkboxObserver.observe(checkboxdiv, {
    childList: true,
    subtree: true,
    attributes: true
  });

  console.log('Observers initialized');
})();
