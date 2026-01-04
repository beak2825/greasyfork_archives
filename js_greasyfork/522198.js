// ==UserScript==
// @name         Stop Stealing My Shortcuts
// @namespace    https://github.com/mariczne/stop-stealing-my-shortcuts
// @version      0.1.2
// @description  Prevent websites from hijacking specific keyboard shortcuts, like Chrome Tab Switcher
// @license      MIT
// @author       mariczne
// @match        https://discord.com/*
// @match        https://www.facebook.com
// @match        https://app.slack.com/*
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @supportURL   https://github.com/mariczne/stop-stealing-my-shortcuts/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522198/Stop%20Stealing%20My%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/522198/Stop%20Stealing%20My%20Shortcuts.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // List of shortcuts to prevent from hijacking
  const blockedShortcuts = [
    { key: "a", ctrl: false, shift: true, alt: false, meta: true }, // Cmd+Shift+A
    { key: "a", ctrl: true, shift: true, alt: false, meta: false }, // Ctrl+Shift+A
    // Add other shortcuts as needed
  ];

  window.addEventListener(
    "keydown",
    function (event) {
      if (!event.isTrusted) return; // Ignore events dispatched by this script

      for (const shortcut of blockedShortcuts) {
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          event.ctrlKey === shortcut.ctrl &&
          event.shiftKey === shortcut.shift &&
          event.altKey === shortcut.alt &&
          event.metaKey === shortcut.meta
        ) {
          event.stopImmediatePropagation();

          if (document.activeElement) {
            document.activeElement.blur(); // Remove focus from any element
          }

          const newEvent = new KeyboardEvent("keydown", {
            key: event.key,
            code: event.code,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
            bubbles: true,
            cancelable: true,
          });

          window.setTimeout(() => {
            document.dispatchEvent(newEvent);
          }, 0);

          return;
        }
      }
    },
    true
  );
})();
