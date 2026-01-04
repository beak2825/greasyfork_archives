// ==UserScript==
// @name         My Choices
// @namespace    https://github.com/iCross
// @version      0.1.1
// @description  Transform default HTML <select> tags into Choices.js dropdowns for an enhanced user experience.
// @icon         https://raw.githubusercontent.com/iCross/my_choices/main/icon.jpg
// @license      MIT
// @author       https://github.com/iCross
// @homepageURL  https://github.com/iCross/my_choices
// @supportURL   https://github.com/iCross/my_choices/issues
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/choices.js@9.0.1/public/assets/scripts/choices.min.js
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @downloadURL https://update.greasyfork.org/scripts/463115/My%20Choices.user.js
// @updateURL https://update.greasyfork.org/scripts/463115/My%20Choices.meta.js
// ==/UserScript==
 
(function () {
  "use strict";
 
  // console.log("Userscript is running.");
  // Add Choices.js CSS to the document
  function addChoicesCSS() {
    const choicesCSSLink = document.createElement("link");
    choicesCSSLink.href =
      "https://cdn.jsdelivr.net/npm/choices.js@9.0.1/public/assets/styles/base.min.css";
    choicesCSSLink.rel = "stylesheet";
    console.log("Adding Choices.js CSS");
    document.head.appendChild(choicesCSSLink);
 
    const customStyle = document.createElement("style");
    customStyle.textContent = `
    .choices__list--dropdown,
    .choices__list[aria-expanded] {
      word-break: break-word;
      width: max-content;
    }
  `;
    document.head.appendChild(customStyle);
  }
 
  // Replace default select menus with Choices.js
  function applyChoices() {
    console.log("Applying Choices.js.");
 
    document.querySelectorAll("select").forEach(function (select) {
      if (!select._choicesInstance) {
        // Create a new Choices instance with the 'itemSelectText' set to an empty string
 
        new Choices(select, {
          itemSelectText: "",
        });
      }
    });
  }
 
  const { register } = VM.shortcut;
 
  register("c-i", () => {
    console.log("You just pressed Shortcut in violetmonkey.");
 
    // Add Choices.js CSS when the keyboard shortcut is pressed
    addChoicesCSS();
 
    // Run once when the script is loaded
    applyChoices();
  });
 
  // Register a menu command to trigger the same function
  GM_registerMenuCommand("Apply Choices.js", () => {
    addChoicesCSS();
    applyChoices();
    console.log("Choices.js applied via menu command.");
  });
})();