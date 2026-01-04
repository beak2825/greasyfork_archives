// ==UserScript==
// @name        Keyboard shortcuts for Khanacademy
// @namespace   Violentmonkey Scripts
// @match       https://www.khanacademy.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/30/2023, 12:05:04 PM
// @downloadURL https://update.greasyfork.org/scripts/517322/Keyboard%20shortcuts%20for%20Khanacademy.user.js
// @updateURL https://update.greasyfork.org/scripts/517322/Keyboard%20shortcuts%20for%20Khanacademy.meta.js
// ==/UserScript==

const inputObserver = new MutationObserver(function (mutationRecords) {
  mutationRecords.forEach(function(mutation) {
    let input = mutation.target.querySelector('form[name="answerform"] input[type="text"]');
    if (input) {
      // Automatically focus on the text input if found
      input.focus();
      inputObserver.disconnect();
    }
  });
});

document.addEventListener('keydown', function(event) {
  const validKeys = ['1', '2', '3', '4', '5', '6', 'a', 'b', 'c', 'd', 'e', 'f'];

  if (validKeys.includes(event.key)) {
    let choice = event.key;

    // If a letter key is pressed, convert it into the number
    if (!Number(choice)) {
      choice = choice.charCodeAt(0) - 96;
    }

    // Select the corresponding radio button
    let option = document.querySelector('.perseus-radio-option:nth-of-type(' + choice + ') input');
    if (option) {
      option.click();
    }
  }

  // Submit answers
  if (event.key === ' ' || event.key === 'Enter') {
    const footer = document.querySelector('[data-testid="content-library-footer"]');
    if (footer) {
      const button = footer.querySelector('button:last-child,a[role="button"][href]');
      if (button) {
        button.click();
      }
    }
  }
});

document.addEventListener('keyup', function(event) {
  // Auto-focus the input in the text question
  if (event.key === ' ' || event.key === 'Enter') {
    inputObserver.observe(document.body, { childList: true, subtree: true });
  }
});
