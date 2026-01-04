// ==UserScript==
// @name         Highlight Phrases in DC Cave
// @namespace    odakyu.app/@yourname
// @version      2.2.3
// @description  Highlights matching egg phrases, reloads if no matches, and opens matched links in new tabs
// @author       You
// @match        https://dragcave.net/locations/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535339/Highlight%20Phrases%20in%20DC%20Cave.user.js
// @updateURL https://update.greasyfork.org/scripts/535339/Highlight%20Phrases%20in%20DC%20Cave.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Toggle this to true/false to enable/disable auto-reload
  const autoReloadEnabled = true;

  // List of phrases to highlight
  const highlightWords = [
    'It’s almost like time is distorted around this egg.',
    'Delicate petals envelop this egg.',
    'This egg smells faintly like brine.',
    'Something about this egg seems to lure you in.',
    'This egg gleams with a reddish shine.',
    'This egg is very reflective, almost metallic-looking.',
    'Mana flows like a current through this glassy egg.',
    'This egg is tiny and made out of several pieces of paper folded together.',
    'This egg is much smaller than the others.',
    'This egg is soft and smells uncannily like cheese.'
  ];

  function highlightAndOpen() {
    // Track whether we found any matches
    let foundMatch = false;

    // Select all <span> elements under the egg descriptions
    const spans = document.querySelectorAll('div.eggs span');

    spans.forEach(span => {
      const description = span.textContent;

      // Check for matches
      highlightWords.forEach(phrase => {
        if (description.includes(phrase)) {
          foundMatch = true;

          // Highlight the matching phrase
          span.style.backgroundColor = 'lime';
          span.style.fontWeight = 'bold';

          // Try to find the <a> element inside the same <div> block
          const eggDiv = span.closest('div');
          if (eggDiv) {
            const link = eggDiv.querySelector('a[href]');
            if (link && link.href) {
              // Open the link in a new tab
              window.open(link.href, '_blank');
            }
          }
        }
      });
    });

    // If no matches were found and auto-reload is enabled, reload the page
    if (!foundMatch && autoReloadEnabled) {
      setTimeout(() => {
        location.reload();
      }, 100); // Reload after 0.5 seconds
    }
  }

  // Call the function after the page is idle
  highlightAndOpen();
})();
