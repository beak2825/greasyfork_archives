// ==UserScript==
// @name        Unwanted Job Result Hider - indeed.com
// @namespace   Violentmonkey Scripts
// @match       https://www.indeed.com/*
// @grant       none
// @version     1.0
// @author      primarily from ChatGPT but with manual fixes and modifications
// @description Adds a button to toggle the visibilty of job results that contain keywords defined in the script.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469787/Unwanted%20Job%20Result%20Hider%20-%20indeedcom.user.js
// @updateURL https://update.greasyfork.org/scripts/469787/Unwanted%20Job%20Result%20Hider%20-%20indeedcom.meta.js
// ==/UserScript==

(function() {
  const keywords = ['nanny', 'caregiver', 'driver', 'pizza', 'cashier'];
  // replace any of the above keywords with ones you don't want to see!
  let isHidden = false;

  function hideUnwantedElements() {
    const elements = document.querySelectorAll('.resultWithShelf');
    elements.forEach(element => {
      const text = element.textContent.toLowerCase();
      const shouldHide = keywords.some(keyword => text.includes(keyword));
      element.style.opacity = shouldHide && isHidden ? '0' : '1';
      element.style.pointerEvents = shouldHide && isHidden ? 'none' : 'auto';
    });
  }

  function toggleVisibility() {
    const elements = document.querySelectorAll('.resultWithShelf');
    elements.forEach(element => {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    });
    isHidden = !isHidden;
    hideUnwantedElements();
    updateButtonStyle();
  }

  function updateButtonStyle() {
    const button = document.getElementById('toggleButton');
    if (button) {
      button.style.backgroundColor = isHidden ? '#808080' : '';
      button.style.boxShadow = isHidden ? 'inset 0 2px 2px rgba(0, 0, 0, 0.3)' : '';
    }
  }

  function createToggleButton() {
    const button = document.createElement('button');
    button.textContent = 'Toggle Unwanted';
    button.style.width = '10%';
  button.style.height = '10%';
  button.style.backgroundColor = 'gray';
    button.id = 'toggleButton';
    button.style.position = 'fixed';
    button.style.left = '10px';
    button.style.top = '10px';
    button.style.zIndex = '9999';
    button.addEventListener('click', toggleVisibility);
    document.body.appendChild(button);
    updateButtonStyle();
  }

  document.addEventListener('DOMContentLoaded', () => {
    hideUnwantedElements();
    createToggleButton();
  });
})();