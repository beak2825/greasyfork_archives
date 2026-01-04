// ==UserScript==
// @name         chatgpt Set GPT Feedback Display
// @description  Watch for the “Is this conversation helpful so far?” or “Do you like this personality?” element and set its CSS display property
// @match        https://chatgpt.com/*
// @run-at       document-idle
// @version 0.0.1.20250624100349
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/540062/chatgpt%20Set%20GPT%20Feedback%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/540062/chatgpt%20Set%20GPT%20Feedback%20Display.meta.js
// ==/UserScript==

(function() {
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          let textNode;
          while ((textNode = walker.nextNode())) {
            const text = textNode.textContent.trim();
            if (
              text.includes("Is this conversation helpful so far?") ||
              text.includes("Do you like this personality?")
            ) {
              textNode.parentElement.style.setProperty("display", "unset", "important");
              observer.disconnect();
              return;
            }
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
