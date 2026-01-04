// ==UserScript==
// @name         Jira: Copy Ticket ID Button
// @namespace    http://tampermonkey.net/
// @version      2025-08-03-3
// @description  This script waits 3 seconds, then converts all <a> tags with class .issuekey .issue-link into buttons. When clicked, each button copies its data-issue-key value to the clipboard and briefly shows "Copied!" as feedback.
// @author       Vanakh Chea
// @match        https://lunapark.atlassian.net/jira/dashboards/last-visited
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @run-at       document-idle
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544557/Jira%3A%20Copy%20Ticket%20ID%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/544557/Jira%3A%20Copy%20Ticket%20ID%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
function convertIssueLinksToCopyButtons() {
  document.querySelectorAll('.issuekey .issue-link').forEach(element => {
    // Skip if already converted to button
    if (element.tagName === 'BUTTON') return;

    const button = document.createElement('button');

    // Copy attributes, content, classes and styles
    for (let i = 0; i < element.attributes.length; i++) {
      button.setAttribute(element.attributes[i].name, element.attributes[i].value);
    }
    button.innerHTML = element.innerHTML;
    button.className = element.className;
    button.style.cssText = element.style.cssText;

    // Add click handler
    button.addEventListener('click', (e) => {
      const issueKey = button.getAttribute('data-issue-key');
      if (issueKey) {
        navigator.clipboard.writeText(issueKey)
          .then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => button.textContent = originalText, 1000);
          })
          .catch(err => console.error('Copy failed:', err));
      }
      e.preventDefault();
    });

    element.parentNode.replaceChild(button, element);
  });
}

// Initial execution after 3 seconds
setTimeout(convertIssueLinksToCopyButtons, 3000);

// Re-run when pagination or refresh is clicked
const refreshSelectors = [
  '.pagination a',
  'button[data-testid="dashboard-internal-common.ui.gadget.toolbar.refresh-button"]',
  'button[data-testid="dashboard-internal-common.ui.gadget.toolbar.refresh-button"] *'
];

document.addEventListener('click', (e) => {
  if (e.target.matches(refreshSelectors.join(','))) {
    // Wait 1 second after click to allow content to reload
    setTimeout(convertIssueLinksToCopyButtons, 1000);
  }
});
})();