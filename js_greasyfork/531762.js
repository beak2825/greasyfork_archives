// ==UserScript==
// @name         PPM Character Dropdown Sorter
// @version      0.4
// @description  Sorts characters names alphabetically in the character selector dropdown menu.
// @author       Maçã
// @namespace    https://greasyfork.org/users/137685
// @match        https://*.popmundo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531762/PPM%20Character%20Dropdown%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/531762/PPM%20Character%20Dropdown%20Sorter.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // DON'T EDIT ABOVE THIS LINE

  const favoriteCharacterName = ""; // Replace with the character name you want to set as top favorite

  // DON'T EDIT BELOW THIS LINE

  const sortCharacterOptions = () =>
    options.sort((a, b) => {
      // Keep the favorite character at the top, if any
      if (a.innerText === favoriteCharacterName) return -1;
      if (b.innerText === favoriteCharacterName) return 1;

      // Keep the "go to choose character page" option at the bottom
      if (a.value === "0") return 1;
      if (b.value === "0") return -1;

      // Sort the rest of the options alphabetically
      return a.innerText.localeCompare(b.innerText);
    });

  const updateDropdown = () => {
    // Clear the dropdown and re-add sorted options
    dropdownElement.innerHTML = "";
    sortCharacterOptions();
    options.forEach((option) => dropdownElement.appendChild(option));

    // Set the selected option back to the dropdown
    let selectedIndex = options.findIndex(
      (option) => option.value === selectedOption.value
    );
    if (selectedIndex === -1) selectedIndex = 0;
    dropdownElement.selectedIndex = selectedIndex;
  };

  // Get the dropdown options
  const dropdownSelector =
    "select#ctl00_ctl08_ucCharacterBar_ddlCurrentCharacter";
  const dropdownElement = document.querySelector(dropdownSelector);
  if (!dropdownElement) return;
  const options = Array.from(dropdownElement.options);
  if (options.length === 0) return;
  const selectedOption = dropdownElement.options[dropdownElement.selectedIndex];

  updateDropdown();
})();
