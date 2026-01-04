// ==UserScript==
// @name         Restore elite 0 on viktorlab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prepend option to all select elements matching .dps__phase on viktorlab
// @author       chatGPT
// @match        viktorlab.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472773/Restore%20elite%200%20on%20viktorlab.user.js
// @updateURL https://update.greasyfork.org/scripts/472773/Restore%20elite%200%20on%20viktorlab.meta.js
// ==/UserScript==

// Function to prepend the option to a select element
const prependOptionToSelect = (select) => {
  const newOption = document.createElement('option');
  newOption.value = '0';
  newOption.innerHTML = '<font style="vertical-align: inherit;"><font style="vertical-align: inherit;">精英0</font></font>';

  // Add a class to the custom option
  newOption.classList.add('custom-option');

  select.insertBefore(newOption, select.firstChild);

};

// Observer callback for DOM mutations
const observerCallback = (mutationsList, observer) => {
    console.log(mutationsList)
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      if (mutation.target.matches('.dps__phase')) {
        // Check if the custom option already exists
        const customOptionExists = mutation.target.querySelector('.custom-option');
          if (!customOptionExists) {
            prependOptionToSelect(mutation.target);
          }
      }
    }
  }
};

// Create a MutationObserver instance
const observer = new MutationObserver(observerCallback);

// Start observing changes to the entire document's DOM
observer.observe(document, { childList: true, subtree: true, attributes: false });

// Initial action: Prepend the option to existing .dps__phase elements
document.querySelectorAll('.dps__phase').forEach(prependOptionToSelect);
