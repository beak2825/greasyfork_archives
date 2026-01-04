// ==UserScript==
// @name         Mark Scamming Pips
// @namespace    https://torn.report/userscripts/
// @version      0.4
// @description  Mark pips in the Scamming crime. Quick and dirty GPT special.
// @author       Skeletron [318855]
// @match        https://www.torn.com/loader.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506050/Mark%20Scamming%20Pips.user.js
// @updateURL https://update.greasyfork.org/scripts/506050/Mark%20Scamming%20Pips.meta.js
// ==/UserScript==

const addTenthPipMark = true;
const addPipBorder = false;
const addPipNumbers = false; // Only good for desktop.

(function () {
  "use strict";

  function addBeforePersuasionBar(persuasionBar) {
    if (
      !persuasionBar.previousElementSibling ||
      !persuasionBar.previousElementSibling.classList.contains(
        "custom-inserted-div"
      )
    ) {
      const numbersDiv = document.createElement("div");
      numbersDiv.style.fontFamily = "monospace";
      numbersDiv.style.fontSize = "0.795rem";
      numbersDiv.style.position = "absolute";
      numbersDiv.style.bottom = "-11px";
      numbersDiv.textContent =
        "12345678901234567890123456789012345678901234567890";
      numbersDiv.classList.add("custom-inserted-div");

      persuasionBar.parentNode.insertBefore(numbersDiv, persuasionBar);
    }
  }

  // Function to process each persuasion bar
  function processPersuasionBar(persuasionBar) {
    // Add the new div before the persuasion bar
    addPipNumbers && addBeforePersuasionBar(persuasionBar);
    // Get all cells within the persuasion bar, including nested ones
    const cells = persuasionBar.getElementsByClassName("cell___AfwZm");

    // Iterate through the cells and insert "X" in every 10th cell if it hasn't been added yet
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];

      // Apply the border to every cell
      addPipBorder &&
        (cell.style.borderLeft = "1px dotted var(--crimes-subText-color)");

      // Add '|' to every 10th cell
      if (addTenthPipMark && i !== 49 && i % 10 === 9) {
        if (!cell.textContent.includes("|")) {
          cell.textContent += "|";
        }
        cell.style.textAlign = "center"; // Set text alignment only for the cells with '|'
      }
    }
  }

  // Function to handle mutations
  function handleMutations(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Check if any new persuasion bars were added
        const newPersuasionBars = mutation.target.getElementsByClassName(
          "persuasionBar___RnWKh"
        );
        Array.from(newPersuasionBars).forEach(processPersuasionBar);
      }
    }
  }

  const crimesApp = document.querySelector(".crimes-app");
  if (crimesApp) {
    const observer = new MutationObserver(handleMutations);
    observer.observe(crimesApp, { childList: true, subtree: true });
  }
})();
