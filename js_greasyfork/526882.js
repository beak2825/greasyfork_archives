// ==UserScript==
// @name        ChatGPT No Auto-Scroll
// @description removes auto-scroll on chatgpt
// @match       https://chatgpt.com/*
// @version 0.0.1.20250513035702
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/526882/ChatGPT%20No%20Auto-Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/526882/ChatGPT%20No%20Auto-Scroll.meta.js
// ==/UserScript==

// Function to remove min-height and disable auto-scroll
function fixElement(element) {
  element.style.minHeight = 'auto'; // Remove forced min-height
  element.scrollIntoView = () => {}; // Disable auto-scroll
}

// Apply to existing elements
document.querySelectorAll('[data-testid^="conversation-turn-"]').forEach(fixElement);

// Observer for new dynamically added elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1 && node.matches('[data-testid^="conversation-turn-"]')) {
        fixElement(node);
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

console.log("Removed min-height and disabled auto-scroll for all chat elements.");