// ==UserScript==
// @name        Claude Up Arrow Edit
// @namespace   Violentmonkey Scripts
// @match       https://claude.ai/*
// @grant       none
// @version     1.0
// @license     Skibidi
// @description Make Up Arrow press the edit button in Claude, similar to Discord
// @downloadURL https://update.greasyfork.org/scripts/531359/Claude%20Up%20Arrow%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/531359/Claude%20Up%20Arrow%20Edit.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Define base selector paths as constants
  const BASE_PATH = "body > div.flex.min-h-screen.w-full > div.min-h-full.w-full.min-w-0.flex-1 > div > div.h-screen.flex.flex-col.overflow-hidden > div > div";
  const MESSAGES_CONTAINER = `${BASE_PATH} > div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1`;
  const INPUT_CONTAINER = `${BASE_PATH} > div.sticky.bottom-0.mx-auto.w-full.pt-6.z-\\[5\\]`;

  document.addEventListener('keydown', (event) => {
    // Check if the pressed key is the up arrow
    if (event.key === 'ArrowUp') {
      // Find the input area and check its focus state
      const inputArea = document.querySelector(`${INPUT_CONTAINER} > fieldset > div.flex.flex-col.bg-bg-000.border-0\\.5.border-border-300.mx-2.md\\:mx-0.items-stretch.transition-all.duration-200.relative.shadow-\\[0_0\\.25rem_1\\.25rem_hsl\\(var\\(--always-black\\)\\/3\\.5\\%\\)\\].focus-within\\:shadow-\\[0_0\\.25rem_1\\.25rem_hsl\\(var\\(--always-black\\)\\/7\\.5\\%\\)\\].hover\\:border-border-200.focus-within\\:border-border-200.cursor-text.z-10.rounded-2xl > div.flex.flex-col.gap-3\\.5.m-3\\.5 > div.relative > div > div`);

      // Check if Prosemirror is focused
      const isProseMirrorFocused = inputArea && inputArea.classList.contains('ProseMirror-focused');

      // Get the paragraph element inside the input area
      const inputParagraph = document.querySelector(`${INPUT_CONTAINER} > fieldset > div.flex.flex-col.bg-bg-000.border-0\\.5.border-border-300.mx-2.md\\:mx-0.items-stretch.transition-all.duration-200.relative.shadow-\\[0_0\\.25rem_1\\.25rem_hsl\\(var\\(--always-black\\)\\/3\\.5\\%\\)\\].focus-within\\:shadow-\\[0_0\\.25rem_1\\.25rem_hsl\\(var\\(--always-black\\)\\/7\\.5\\%\\)\\].hover\\:border-border-200.focus-within\\:border-border-200.cursor-text.z-10.rounded-2xl > div.flex.flex-col.gap-3\\.5.m-3\\.5 > div.relative > div > div > p`);

      // Check if input is empty (could be null, or might have no innerText)
      const isInputEmpty = !inputParagraph || (inputParagraph.innerText.trim() === '');

      // Conditions to trigger edit:
      // 1. Input is not focused OR
      // 2. Input is focused but empty
      if (!isProseMirrorFocused || (isProseMirrorFocused && isInputEmpty)) {
        // Find the edit button for the last message
        // Try both nth-last-child(2) and nth-last-child(4) to handle different states
        let editButton = document.querySelector(`${MESSAGES_CONTAINER} > div:nth-last-child(2) > div > div > div.absolute.bottom-0.-right-1\\.5 > div > div > button`);

        // If not found, try the alternate selector
        if (!editButton) {
          editButton = document.querySelector(`${MESSAGES_CONTAINER} > div:nth-last-child(4) > div > div > div.absolute.bottom-0.-right-1\\.5 > div > div > button`);
        }

        // If the button exists, click it
        if (editButton) {
          editButton.click();
          event.preventDefault(); // Prevent default up arrow behavior

          // Set a small timeout to wait for the textarea to appear
          setTimeout(() => {
            const textarea = document.querySelector(`${MESSAGES_CONTAINER} > form > div > div > div.font-user-message.mr-3.grid.w-full.grid-cols-1.gap-2.py-0\\.5.text-\\[0\\.9375rem\\].leading-6 > div.group.relative > div > textarea`);

            if (textarea) {
              // Move cursor to the end of the text
              textarea.focus();
              textarea.selectionStart = textarea.value.length;
              textarea.selectionEnd = textarea.value.length;
            }
          }, 10); // Small delay to ensure the textarea is available
        }
      }
    }
  });
})();