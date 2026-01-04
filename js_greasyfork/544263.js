// ==UserScript==
// @name         Tabs vergrößern [GA Explorative Reports]
// @namespace    http://tampermonkey.net/
// @version      2025-08-01
// @description  Mithilfe dieses Add-ons werden alle Tabs in einem explorativen Report aufgeklappt.
// @author       Vanakh Chea
// @match        https://analytics.google.com/analytics/web/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at      context-menu
// @noframes
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/544263/Tabs%20vergr%C3%B6%C3%9Fern%20%5BGA%20Explorative%20Reports%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/544263/Tabs%20vergr%C3%B6%C3%9Fern%20%5BGA%20Explorative%20Reports%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Select all elements with the specified selector
const tabElements = document.querySelectorAll('[role="tab"].step-tab');

// Function to remove specific event listeners
function removeEventListeners(element, eventType) {
  const listeners = getEventListeners(element); // Note: getEventListeners only works in Chrome DevTools
  if (listeners && listeners[eventType]) {
    listeners[eventType].forEach(listener => {
      element.removeEventListener(eventType, listener.listener, listener.useCapture);
    });
  }
}

// Loop through each element
tabElements.forEach(element => {
  // Remove mouseenter and mouseleave event listeners
  // Note: This approach requires the getEventListeners function which is only available in Chrome DevTools
  // For a production solution, you'll need to track the listeners when you add them
  if (typeof getEventListeners === 'function') {
    removeEventListeners(element, 'mouseenter');
    removeEventListeners(element, 'mouseleave');
  }

  // Remove the 'non-expanded' class
  element.classList.remove('non-expanded');

  // Add the 'expanded' class
  element.classList.add('expanded');
});
})();