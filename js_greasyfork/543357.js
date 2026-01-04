// ==UserScript==
// @name         Always Visible Buttons
// @namespace    always-visible-buttons
// @version      1.0
// @description  Ensure buttons with specific classes or attributes are always visible.
// @author       gpt 4o 
// @match        https://t3.chat/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543357/Always%20Visible%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/543357/Always%20Visible%20Buttons.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Inject global CSS to override hover styles
  const injectGlobalCSS = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Target buttons hidden by hover effects */
      .group .opacity-0 {
        opacity: 1 !important; /* Make buttons fully visible */
        pointer-events: auto !important; /* Ensure buttons are clickable */
      }

      /* Disable hover effects */
      .group:hover .opacity-0 {
        opacity: 1 !important;
      }

      /* Disable transitions for immediate visibility */
      .group .transition-opacity {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Run the function to inject CSS
  injectGlobalCSS();
})();