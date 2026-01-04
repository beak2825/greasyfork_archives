// ==UserScript==
// @name        Re-Order OCs
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/factions.php*
// @grant       none
// @version     1.3.1
// @author      Terekhov [2992325]
// @description Re-Orders OCs on load, and provides a button to manually do it once you scroll down to refresh them all
// @downloadURL https://update.greasyfork.org/scripts/523265/Re-Order%20OCs.user.js
// @updateURL https://update.greasyfork.org/scripts/523265/Re-Order%20OCs.meta.js
// ==/UserScript==

(function () {
  'use strict';

let reorderButtonExists = false;
function isCrimesTab() {
  return location.href.indexOf("tab=crimes") !== -1;
}

if (isCrimesTab()) {
  setTimeout(() => {
    console.log('Re-ordering OCs (may need to scroll to bottom to load all, then press Re-Order button)');
    reorderOCs();
    addReorderButton();
  }, 2000)
} else {
  removeReorderButton();
}

window.addEventListener('hashchange', (checkUrlChange) => {
  console.log('hashchange!!!!!!!!!!!!!!!');
  console.log(location.href);
    if (isCrimesTab()) {
    setTimeout(() => {
      console.log('hashchange reorderOCs');
      reorderOCs()
      addReorderButton();
    }, 2000);
  } else {
    removeReorderButton();
  }
});

function removeReorderButton() {
  let buttonToRemove = document.getElementById("t__reorderButton");
  if (buttonToRemove) {
    buttonToRemove.remove();
  }
  reorderButtonExists = false;
}

function addReorderButton() {
  if (reorderButtonExists) {
    return;
  }
  // Create the button element
const reorderButton = document.createElement('button');
reorderButton.id = 't__reorderButton';
reorderButton.textContent = 'Re-order';

// Style the button
reorderButton.style.position = 'fixed';
reorderButton.style.bottom = '10px';
reorderButton.style.left = '50%';
reorderButton.style.transform = 'translateY(-50%)';
reorderButton.style.padding = '5px 10px';
reorderButton.style.backgroundColor = '#4CAF50';
reorderButton.style.color = 'white';
reorderButton.style.border = 'none';
reorderButton.style.borderRadius = '5px';
reorderButton.style.cursor = 'pointer';
reorderButton.style.fontSize = '16px';
reorderButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

// Add hover effect
reorderButton.addEventListener('mouseover', () => {
  reorderButton.style.backgroundColor = '#45a049';
});
reorderButton.addEventListener('mouseout', () => {
  reorderButton.style.backgroundColor = '#4CAF50';
});

// Add click event listener
reorderButton.addEventListener('click', reorderOCs);

// Add the button to the document body
document.body.appendChild(reorderButton);
  reorderButtonExists = true;
}

function reorderOCs() {
  // Select all spans with class starting with "levelValue_"
  const spans = document.querySelectorAll('span[class^="levelValue_"]');

  // Function to get the nth parent of an element
  function getNthParent(element, n) {
      let current = element;
      for (let i = 0; i < n; i++) {
          if (current.parentElement) {
              current = current.parentElement;
          } else {
              return null; // In case we reach the top of the DOM before n levels
          }
      }
      return current;
  }

  // Get the 7th level parent elements and convert to array
  const parents = Array.from(spans).map(span => getNthParent(span, 7)).filter(Boolean);

  // Remove duplicates
  const uniqueParents = [...new Set(parents)];

  // Sort the parents (example: sorting by the text content of the levelValue_ span)
  uniqueParents.sort((a, b) => {
      const valueA = a.querySelector('span[class^="levelValue_"]').textContent;
      const valueB = b.querySelector('span[class^="levelValue_"]').textContent;
      return valueB.localeCompare(valueA);
  });

  // Reorder in the DOM
  if (uniqueParents.length > 0) {
      const parentContainer = uniqueParents[0].parentElement;
      uniqueParents.forEach(parent => {
          parentContainer.appendChild(parent);
      });
  }
}
})();