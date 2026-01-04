// ==UserScript==
// @name         Stile App - Remove Naughty Pause Cover (Keybind)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Deletes the "pause-cover" div element on Stile App with keybind
// @author       Jet
// @license      GNU
// @match        https://stileapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512788/Stile%20App%20-%20Remove%20Naughty%20Pause%20Cover%20%28Keybind%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512788/Stile%20App%20-%20Remove%20Naughty%20Pause%20Cover%20%28Keybind%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const pauseCoverSelector = 'div[data-test-label="pause-cover"]';
  let isScriptActive = false;
  const keybind = '`';

  const removePauseCover = () => {
    const pauseCover = document.querySelector(pauseCoverSelector);
    if (pauseCover) {
      pauseCover.remove();
    }
  };

  const toggleScript = () => {
    isScriptActive = !isScriptActive;
    showPrompts(isScriptActive);
    if (isScriptActive) {
      removePauseCover();
      const observer = new MutationObserver(removePauseCover);
      observer.observe(document.body, { childList: true });
    } else {
      observer.disconnect();
    }
  };

  const showPrompts = (isActive) => {
    const currentPrompt = document.createElement('div');
    currentPrompt.textContent = `Current: ${isActive ? 'on' : 'off'}`;
    currentPrompt.style.position = 'fixed';
    currentPrompt.style.bottom = '45px';
    currentPrompt.style.right = '10px';
    currentPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    currentPrompt.style.color = 'white';
    currentPrompt.style.padding = '5px';
    currentPrompt.style.borderRadius = '5px';

    const togglePrompt = document.createElement('div');
    togglePrompt.textContent = `Use [${keybind}] to toggle on/off`;
    togglePrompt.style.position = 'fixed';
    togglePrompt.style.bottom = '10px';
    togglePrompt.style.right = 'calc(10px + ' + currentPrompt.offsetWidth + 'px)';
    togglePrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    togglePrompt.style.color = 'white';
    togglePrompt.style.padding = '5px';
    togglePrompt.style.borderRadius = '5px';

    document.body.appendChild(currentPrompt);
    document.body.appendChild(togglePrompt);

    setTimeout(() => {
      currentPrompt.remove();
      togglePrompt.remove();
    }, 2000); // Prompts lasts 2s
  };

  showPrompts(isScriptActive);

  // Keybind listener
  document.addEventListener('keydown', (event) => {
    if (event.key === keybind) {
      toggleScript();
    }
  });
})();