// ==UserScript==
// @name     		DGN Widescreen
// @version  		1.0
// @grant    		none
// @namespace		oggvorbis.net/dgnwidescreen
// @description 	Provides the ability to stretch the Disc Golf Network video players across the entire screen, without going into full screen mode.
// @include		https://www.discgolfnetwork.com/*
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/491137/DGN%20Widescreen.user.js
// @updateURL https://update.greasyfork.org/scripts/491137/DGN%20Widescreen.meta.js
// ==/UserScript==

function GM_addStyle(aCss) {
  'use strict';
  let head = document.getElementsByTagName('head')[0];
  if (head) {
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
}


GM_addStyle(`
/* Base styles for the video panel */
div[class^='Layout__player'] {
  transition: all 0.5s ease; /* Smooth transition */
}

/* Styles when expanded */
div[class^='Layout__player'].expanded {
  position: fixed; /* Change to fixed positioning for full screen */
  top: 50% !important; 
  left: 50% !important;
  width: 90vw !important;
  height: calc(88vh - 70px) !important;
  max-width: none;
  max-height: none;
  z-index: 9999;
  transform: translate(-50%, -60%) !important; /* Center the element */
}

.ws-hide-content {
  display: none !important;
}


.ws-flex-container {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  width: 100%; /* Take full width of the parent */
  height: 95%; /* Ensure it fills the vertical space */
  padding: 10px; /* Add padding around the button, adjust as needed */
}

.ws-PlayerUiButton {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  width: 40px; /* Match the SVG width */
  height: 40px; /* Match the SVG height */
  cursor: pointer;
  outline: none;
}

.ws-PlayerUiButton svg {
	fill: rgb(255, 255, 255);
  transition: fill .4s ease-in-out;
}

.ws-PlayerUiButton svg:hover {
	fill: #fe4254;
  filter: drop-shadow(0 0 6px #fff);
}

`);


let playerUiExists = false;
let expanded = false;

const observerCallback = function(mutations) {
  let foundElement = null;

  for (let mutation of mutations) {
    for (let node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        let target = null;
        // Check if the node itself matches the criteria
        if (node.matches("[class^='PlayerUiButtonFullscreen__container']")) {
          target = node;
        }
        // If not, check if any of its descendants match the criteria
        else if (node.querySelector("[class^='PlayerUiButtonFullscreen__container']")) {
          target = node.querySelector("[class^='PlayerUiButtonFullscreen__container']");
        }

        if (target && !playerUiExists) {
          foundElement = target; // Store the found element
          playerUiExists = true; // Update flag to avoid duplicate additions
          break; // Found the target element, no need to continue
        }
      }
    }
    if (foundElement) break; // Break the outer loop if the target is found
  }

  // If a target element was found, add the button before it
  if (foundElement) {
    addButton(foundElement);
  } else {
    // Perform the additional check outside of mutations loop
    const playerUi = document.querySelector("[class^='PlayerUiButtonFullscreen__container']");
    if (playerUi && !playerUiExists) {
      console.log("Player UI found in document");
      addButton(playerUi); // Add button since player UI was found
      playerUiExists = true;
    } else if (!playerUi && playerUiExists) {
      console.log("Player UI removed");
      playerUiExists = false;
    }
  }
};

function addButton(fullscreenElement) {
  // Create the flex container
  const flexContainer = document.createElement('div');
  flexContainer.classList.add('ws-flex-container');
  
  const newButton = document.createElement('button');
  newButton.classList.add('ws-PlayerUiButton');
  newButton.innerHTML = `
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M 29.83 13.619 L 29.83 26.38 L 10.17 26.38 L 10.17 13.619 L 29.83 13.619 Z M 12.628 16.171 L 27.372 16.171 L 27.372 23.828 L 12.628 23.828 L 12.628 16.171 Z" fill-rule="evenodd" transform="matrix(1, 0, 0, 1, -2.220446049250313e-16, -2.220446049250313e-16)"/>
    </svg>
  `;
  newButton.addEventListener('click', toggleExpanded);

  flexContainer.appendChild(newButton);

  fullscreenElement.parentNode.insertBefore(flexContainer, fullscreenElement);
}

function toggleExpanded() {
  const videoPanel = document.querySelector("div[class^='Layout__player']");
  const seeAlso = document.querySelector("main > div[class^='MainLayoutCommon']");
  const footer = document.querySelector("footer");

  if (expanded) {
    // Reset styles
    videoPanel.classList.remove('expanded');
    footer.classList.remove('ws-hide-content');
    seeAlso.classList.remove('ws-hide-content');
    expanded = false;
  } else {
    // Apply styles for expanded state
    videoPanel.classList.add('expanded');
    footer.classList.add('ws-hide-content');
    seeAlso.classList.add('ws-hide-content');
    expanded = true;
  }
}


const observer = new MutationObserver(observerCallback);
const config = { childList: true, subtree: true };

observer.observe(document.body, config);
