// ==UserScript==
// @name        Leave my keybinds alone
// @namespace   Violentmonkey Scripts
// @match       http*://*/*
// @grant       none
// @version     1.0
// @author      Skyler Grey <sky@a.starrysky.fyi>
// @description 19/03/2025 18:14:32: stop websites from overriding common browser keybinds
// @license     MIT OR Unlicense OR CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/530467/Leave%20my%20keybinds%20alone.user.js
// @updateURL https://update.greasyfork.org/scripts/530467/Leave%20my%20keybinds%20alone.meta.js
// ==/UserScript==

const criticalShortcuts = [
  { ctrl: true, key: 'r' },
];

function stopPropagationOfCriticalShortcuts(event) {
  for (const shortcut of criticalShortcuts) {
    if (
      event.ctrlKey === shortcut.ctrl
      && event.key === shortcut.key
      && !event.defaultPrevented // we're not too late...
      && event.cancelable // this is a threat...
    ) {
      event.stopImmediatePropagation();
      return;
    }
  }
}

document.body.addEventListener('keydown', stopPropagationOfCriticalShortcuts, { capture: true });