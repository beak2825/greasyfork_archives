// ==UserScript==
// @name         Optimize work experience at Microsoft
// @namespace    https://www.microsoft.com/
// @version      1.0.2
// @description  Optimize work experience at Microsoft!
// @author       Guosen Wang
// @match        https://ms.portal.azure.com/*
// @match        https://m365pulse.microsoft.com/*
// @match        https://seval.microsoft.com/*
// @match        https://seval-staging.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410941/Optimize%20work%20experience%20at%20Microsoft.user.js
// @updateURL https://update.greasyfork.org/scripts/410941/Optimize%20work%20experience%20at%20Microsoft.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const host = location.host;

  switch (true) {
    case 'ms.portal.azure.com' === host:
      azure();
      break;
    case 'm365pulse.microsoft.com' === host:
      m365pulse();
      break;
    case 'seval.microsoft.com' === host:
    case 'seval-staging.microsoft.com' === host:
      seval();
      break;
  }
})();

/**
 * General DOM handling function
 * @param {Array} targets - Array of targets to process, each object includes:
 *   - selector: CSS selector
 *   - text: text to match (optional)
 *   - action: function to modify the element
 * @param {Object} options - Configuration options:
 *   - timeout: timeout in milliseconds (default 10000, ignored in continuous mode)
 *   - continuousMode: whether to run in continuous monitoring mode (default false)
 */
function handleDOMTargets(targets, options = {}) {
  const { timeout = 10000, continuousMode = false } = options;
  const processed = Array(targets.length).fill(false);
  let observer = null;

  function checkAndProcess() {
    targets.forEach((target, index) => {
      if (!continuousMode && processed[index]) return;

      const element = document.querySelector(target.selector);
      if (!element) return;

      // Check text match if specified
      if (target.text && element.innerText !== target.text) return;

      // Execute action function
      if (target.action) {
        target.action(element);
      }

      if (!continuousMode) {
        processed[index] = true;
      }
    });

    // Disconnect observer if all targets have been processed (only in non-continuous mode)
    if (!continuousMode && processed.every(Boolean) && observer) {
      observer.disconnect();
      observer = null;
      clearTimeout(timeoutId);
    }
  }

  // Run initial check immediately
  checkAndProcess();

  // If there are unprocessed targets or in continuous mode, create an observer
  if (!processed.every(Boolean) || continuousMode) {
    function startObserver() {
      if (!document.body) {
        requestAnimationFrame(startObserver);
        return;
      }

      observer = new MutationObserver(checkAndProcess);
      observer.observe(document.body, { childList: true, subtree: true });

      if (!continuousMode) {
        const timeoutId = setTimeout(() => {
          observer?.disconnect();
          observer = null;
        }, timeout);
      }
    }

    startObserver();
  }
}

/**
 * Function to remove feedback card and "New Version" link from M365 Pulse
 */
function m365pulse() {
  handleDOMTargets([
    {
      selector: 'a.right:nth-child(1)',
      text: 'New Version',
      action: element => element.remove()
    },
    {
      selector: 'div[class^="feedback-"]',
      action: element => element.parentElement?.remove()
    }
  ], { timeout: 10000 });
}

/**
 * Function to optimize Azure portal
 */
function azure() {
  handleDOMTargets([
    {
      selector: '#_weave_e_6',
      action: element => element.remove()
    },
    {
      selector: '#_weave_e_5 > div.fxs-topbar-internal.fxs-internal-full',
      action: element => {
        element.innerText = element.innerText.replace(' (Preview)', '');
      }
    }
  ], { timeout: 5000 });
}

/**
 * Function to modify the side pane close button appearance using continuous monitoring
 */
function seval() {
  handleDOMTargets([
    {
      selector: '[data-testid="side-pane"] [aria-label="Back Button"]',
      action: element => {
        // Apply style transformation
        element.style = 'transform:translateY(1px)';

        // Modify the SVG path
        const pathElement = element.querySelector('svg:nth-child(2) > path');
        if (pathElement) {
          pathElement.setAttribute('d', 'M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z');
        }

        // Add keyboard listener for ESC key when button exists
        if (!element.dataset.escListenerAdded) {
          document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
              element.click();
            }
          });
          element.dataset.escListenerAdded = 'true';
        }
      }
    }
  ], { continuousMode: true }); // No timeout needed for continuous monitoring
}