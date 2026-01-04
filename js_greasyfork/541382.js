// ==UserScript==
// @name         Quizlet Shortcuts Alt/Option+V Paste, Add Card, Alt/Option+C Correct, Scroll, Typing Focus
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Use Alt (Windows) or Option (Mac/iPad) shortcuts for Quizlet: paste Q&A, add card, scroll, mark correct, type focus. iPad keyboard compatible.
// @author       bwhurd + OpenAI
// @match        https://quizlet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541382/Quizlet%20Shortcuts%20AltOption%2BV%20Paste%2C%20Add%20Card%2C%20AltOption%2BC%20Correct%2C%20Scroll%2C%20Typing%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/541382/Quizlet%20Shortcuts%20AltOption%2BV%20Paste%2C%20Add%20Card%2C%20AltOption%2BC%20Correct%2C%20Scroll%2C%20Typing%20Focus.meta.js
// ==/UserScript==

// Determine platform for shortcut handling
function isApplePlatform() {
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ||
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
}

(function() {
    'use strict';

    document.addEventListener('keydown', async function(e) {
        // Standardize modifier detection
        const isMod = isApplePlatform() ? e.altKey : e.altKey; // Option (Mac/iPad), Alt (Windows)
        // Alt/Option+V functionality: Paste and add a card
        if (isMod && (e.key === 'v' || e.key === 'V')) {
            e.preventDefault();
            const activeElement = document.activeElement;
            if (!activeElement || activeElement.getAttribute('contenteditable') !== 'true') {
                alert("Focus must be on a contenteditable field.");
                return;
            }
            const clipboardText = await navigator.clipboard.readText();
            if (!clipboardText) {
                alert("Clipboard is empty.");
                return;
            }
            const parts = clipboardText.split(/\?(.+)/);
            if (parts.length < 2) {
                alert("No question mark found in clipboard text.");
                return;
            }
            const textBefore = parts[0] + '?';
            const textAfter = parts[1].trim();
            activeElement.innerHTML = textBefore;
            const contentEditables = Array.from(document.querySelectorAll('[contenteditable="true"]'));
            const currentIndex = contentEditables.indexOf(activeElement);
            if (currentIndex === -1 || currentIndex + 1 >= contentEditables.length) {
                alert("No next contenteditable field found.");
                return;
            }
            const nextField = contentEditables[currentIndex + 1];
            nextField.focus();
            nextField.innerHTML = textAfter;
            const addCardButton = document.querySelector('button[aria-label="Add a card"]');
            if (addCardButton) {
                addCardButton.click();
            } else {
                alert("Add a card button not found.");
                return;
            }
            setTimeout(() => {
                const updatedContentEditables = Array.from(document.querySelectorAll('[contenteditable="true"]'));
                if (updatedContentEditables.length >= 2) {
                    const secondToLastField = updatedContentEditables[updatedContentEditables.length - 2];
                    secondToLastField.focus();
                } else {
                    alert("Second-to-last contenteditable field not found.");
                }
            }, 500);
        }

        // Alt/Option+Z functionality: Scroll to the bottom
        if (isMod && (e.key === 'z' || e.key === 'Z')) {
            e.preventDefault();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, true);
})();


// type to go to type box
(function(){
  const selector = 'input[aria-label="Type the answer"]';
  window.addEventListener('keydown', function(e){
    const input = document.querySelector(selector);
    if (!input || document.activeElement === input) return;
    if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
      input.focus();
    }
    else if (e.key === 'Backspace' && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      input.focus();
      input.value = input.value.slice(0, -1);
      input.dispatchEvent(new Event('input',{bubbles:true}));
    }
  }, true);
})();


// Alt/Option+C or (on iPad) apostrophe key (') to click "I was correct" -- flashes neon green border for 750ms first
// ==UserScript==
// @name         Quizlet Shortcuts Alt/Option+V Paste, Add Card, Alt/Option+C Correct, Scroll, Typing Focus
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Use Alt (Windows) or Option (Mac/iPad) shortcuts for Quizlet: paste Q&A, add card, scroll, mark correct, type focus. iPad keyboard compatible.
// @author       bwhurd + OpenAI
// @match        https://quizlet.com/*
// @grant        none
// ==/UserScript==

// Determine platform for shortcut handling
function isApplePlatform() {
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ||
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
}

(function() {
    'use strict';

    document.addEventListener('keydown', async function(e) {
        // Standardize modifier detection
        const isMod = isApplePlatform() ? e.altKey : e.altKey; // Option (Mac/iPad), Alt (Windows)
        // Alt/Option+V functionality: Paste and add a card
        if (isMod && (e.key === 'v' || e.key === 'V')) {
            e.preventDefault();
            const activeElement = document.activeElement;
            if (!activeElement || activeElement.getAttribute('contenteditable') !== 'true') {
                alert("Focus must be on a contenteditable field.");
                return;
            }
            const clipboardText = await navigator.clipboard.readText();
            if (!clipboardText) {
                alert("Clipboard is empty.");
                return;
            }
            const parts = clipboardText.split(/\?(.+)/);
            if (parts.length < 2) {
                alert("No question mark found in clipboard text.");
                return;
            }
            const textBefore = parts[0] + '?';
            const textAfter = parts[1].trim();
            activeElement.innerHTML = textBefore;
            const contentEditables = Array.from(document.querySelectorAll('[contenteditable="true"]'));
            const currentIndex = contentEditables.indexOf(activeElement);
            if (currentIndex === -1 || currentIndex + 1 >= contentEditables.length) {
                alert("No next contenteditable field found.");
                return;
            }
            const nextField = contentEditables[currentIndex + 1];
            nextField.focus();
            nextField.innerHTML = textAfter;
            const addCardButton = document.querySelector('button[aria-label="Add a card"]');
            if (addCardButton) {
                addCardButton.click();
            } else {
                alert("Add a card button not found.");
                return;
            }
            setTimeout(() => {
                const updatedContentEditables = Array.from(document.querySelectorAll('[contenteditable="true"]'));
                if (updatedContentEditables.length >= 2) {
                    const secondToLastField = updatedContentEditables[updatedContentEditables.length - 2];
                    secondToLastField.focus();
                } else {
                    alert("Second-to-last contenteditable field not found.");
                }
            }, 500);
        }

        // Alt/Option+Z functionality: Scroll to the bottom
        if (isMod && (e.key === 'z' || e.key === 'Z')) {
            e.preventDefault();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, true);
})();


// type to go to type box
(function(){
  const selector = 'input[aria-label="Type the answer"]';
  window.addEventListener('keydown', function(e){
    const input = document.querySelector(selector);
    if (!input || document.activeElement === input) return;
    if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
      input.focus();
    }
    else if (e.key === 'Backspace' && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      input.focus();
      input.value = input.value.slice(0, -1);
      input.dispatchEvent(new Event('input',{bubbles:true}));
    }
  }, true);
})();


// Alt/Option+C or (on iPad) apostrophe key (') to click "I was correct" -- flashes neon green border for 750ms first
(function() {
    const buttonSelector = 'button.AssemblyLink.AssemblyLink--small.AssemblyLink--primary span';

    // Inject highlight style if not present
    if (!document.getElementById('qz-correct-flash-style')) {
        const style = document.createElement('style');
        style.id = 'qz-correct-flash-style';
        style.textContent = `
          .qz-flash-border {
            box-shadow: 0 0 0 3px #39FF14;
            border: 1px solid #39FF14 !important;
            border-radius: 999px !important;
            padding: 3px 6px !important;
            transition: box-shadow 0.2s, border 0.2s, padding 0.2s;
          }
        `;
        document.head.appendChild(style);
    }

    function handleShortcut(e) {
        const altOrOptionC = e.altKey && (e.key === 'c' || e.key === 'C');
        const apostrophe = !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.key === "'";
        if (altOrOptionC || apostrophe) {
            e.preventDefault();
            e.stopImmediatePropagation();

            const buttonSpan = document.querySelector(buttonSelector);
            if (!buttonSpan) return;
            const button = buttonSpan.closest('button');
            if (!button) return;

            // Add border flash
            buttonSpan.classList.add('qz-flash-border');

            setTimeout(() => {
                buttonSpan.classList.remove('qz-flash-border');
                button.click();
            }, 750);
        }
    }
    document.addEventListener('keydown', handleShortcut, true);
})();