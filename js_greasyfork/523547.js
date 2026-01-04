// ==UserScript==
// @name        New script uol.com.br
// @namespace   Violentmonkey Scripts
// @match       https://www.uol.com.br/*
// @grant       none
// @version     1.0
// @author      -
// @description 1/12/2025, 1:20:24 PM
// @name        pt-BR
// @downloadURL https://update.greasyfork.org/scripts/523547/New%20script%20uolcombr.user.js
// @updateURL https://update.greasyfork.org/scripts/523547/New%20script%20uolcombr.meta.js
// ==/UserScript==

(function waitForButtonAndClick() {
  const observer = new MutationObserver((mutations, obs) => {
    const button = document.querySelector('button[aria-label="Fechar"]');
    if (button) {
      console.log('Button found:', button);
      button.click(); // Click the button
      console.log('Button clicked!');
      obs.disconnect(); // Stop observing once the button is clicked
    }
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true, // Observe direct children
    subtree: true    // Observe all descendants
  });

  console.log('Observer started, waiting for the button...');
})();
