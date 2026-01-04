// ==UserScript==
// @name        Talentely Keyboard Shortcuts
// @namespace   https://github.com/jeryjs
// @icon        https://talentely.com/favicon.ico
// @match       https://lms.talentely.com/test/*
// @grant       none
// @version     2.2
// @author      Jery
// @license     MIT
// @description Add configurable keyboard shortcuts to Talentely
// @downloadURL https://update.greasyfork.org/scripts/542517/Talentely%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/542517/Talentely%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

const talentely = {
  observeTarget: '#question',
  questionIdentifier: () => document.querySelector('.fr-view')?.textContent.trim() || document.querySelector('#question')?.innerText,
  mcq_options: {
    get: () => document.querySelectorAll('#question fieldset > div[aria-label="gender"] > label'),
    keys: [1, 2, 3, 4, 5, 6]
  },
  bottom_controls: {
    get: () => document.querySelectorAll('#question + div button'),
    keys: ['', 'q', '', '', 'e', '']    // q is for 'previous' and e is for 'next'
  }
};

let currentQuestionHash = '';
let setupTimer; // Used for debouncing init calls

// Adds or updates a KBD element for a given target.
const addKbd = (target, key) => {
  if (!target) return;

  let kbd = target.querySelector('.tkbd');
  if (kbd) {
    if (kbd.textContent === key) return; // KBD already exists and is correct
    kbd.remove(); // Remove outdated KBD
  }
  kbd = document.createElement('kbd');
  kbd.textContent = key;
  kbd.className = 'tkbd';
  Object.assign(kbd.style, {
    display: 'inline-block',
    background: '#f0f0f0',
    border: '1px solid #d0d0d0',
    borderRadius: '3px',
    padding: '1px 4px',
    fontFamily: 'sans-serif',
    fontSize: '0.75em',
    color: '#555',
    verticalAlign: 'middle',
    lineHeight: '1',
    marginRight: '5px'
  });

  target.insertBefore(kbd, target.firstChild);
  console.debug(`Talentely Shortcuts: Added KBD '${key}' to`, target);
};

// Removes all KBD elements added by this script.
const clearKbd = () => {
  document.querySelectorAll('.tkbd').forEach(k => k.remove());
  console.debug('Talentely Shortcuts: Cleared all KBDs.');
};

// Sets up KBD elements and assigns data-keys.
const applyKeybindings = () => {
  const mcqOptions = talentely.mcq_options.get();
  if (mcqOptions.length > 0) {
    mcqOptions.forEach((opt, i) => {
      const key = talentely.mcq_options.keys[i];
      if (!key) return;
      addKbd(opt, String(key));
      opt.dataset.k = String(key);
    });
  }

  const bottomControls = talentely.bottom_controls.get();
  if (bottomControls.length > 0) {
    bottomControls.forEach((btn, i) => {
      const key = talentely.bottom_controls.keys[i];
      if (!key) return;
      addKbd(btn, key);
      btn.dataset.k = key;
    });
  }
};

// Main function to initialize/update bindings. Debounced.
const init = () => {
  // Clear any pending setup to debounce multiple mutation events
  clearTimeout(setupTimer);
  setupTimer = setTimeout(() => {
    const newQuestionHash = talentely.questionIdentifier();
    const questionContainer = document.getElementById('question');

    if (questionContainer) {
      if (newQuestionHash !== currentQuestionHash) {
        // clearKbd();
        applyKeybindings();
        currentQuestionHash = newQuestionHash;
      }
    } else {
      // If the question container disappears (e.g., test ends, page transition)
      if (currentQuestionHash) { // Only log and clear if bindings were previously active
        console.log('Talentely Shortcuts: Question container not found. Clearing bindings.');
        clearKbd();
        currentQuestionHash = '';
      } else {
        console.debug('Talentely Shortcuts: Question container not found and no active bindings.');
      }
    }
  }, 150);
};

// Keydown event handler.
const handleKeyDown = e => {
  // Do not activate shortcuts if the code editor or textarea is focused
  if (e.target.matches('.ace_editor, textarea')) return;

  const target = Array.from(document.querySelectorAll('[data-k]')).find(el => {
    const keyCombo = el.dataset.k; // e.g., '1' or 'Alt+1'
    if (!keyCombo) return;
    const isAltKeyCombo = keyCombo.startsWith('Alt+');
    const actualKey = isAltKeyCombo ? keyCombo.split('+')[1] : keyCombo;

    // Check if the pressed key matches and if Alt key state is correct
    return (e.key.toLowerCase() === actualKey.toLowerCase() && (isAltKeyCombo ? e.altKey : !e.altKey && !e.ctrlKey && !e.shiftKey));
  });

  if (target) {
    e.preventDefault();
    target.click();
  }
};

// Observe a specific, stable container for *any* subtree changes.
const observer = new MutationObserver(init);

// Function to start observing once the target element is available
const startObserving = () => {
  const observeTarget = document.querySelector(talentely.observeTarget);
  if (observeTarget) {
    console.log('Talentely Shortcuts: MutationObserver starting on #question.');
    observer.observe(observeTarget, { childList: true, subtree: true });
    init();
  } else {
    console.log('Talentely Shortcuts: #question element not found yet, retrying observer start in 500ms...');
    setTimeout(startObserving, 500);
  }
};

// Start observation after the DOM is fully loaded
startObserving();

// Attach global keydown listener
document.addEventListener('keydown', handleKeyDown);
