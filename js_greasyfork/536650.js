// ==UserScript==
// @name         PenguinMod mobile extension button fixer
// @namespace    https://github.com/pooiod
// @version      1.0
// @description  Fixes the bug that prevents mobile users from tapping extension category buttons.
// @author       pooiod7
// @match        https://studio.penguinmod.com/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=penguinmod.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536650/PenguinMod%20mobile%20extension%20button%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/536650/PenguinMod%20mobile%20extension%20button%20fixer.meta.js
// ==/UserScript==

document.body && setInterval(() => {
  document.querySelectorAll('.scratchCategoryMenuItem.scratchCategoryId-P7BoxPhys, .scratchCategoryItemIcon').forEach(el => {
    if (!el.dataset.tapListenerAdded) {
      el.addEventListener('touchstart', () => {
        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        el.click();
        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      });
      el.dataset.tapListenerAdded = 'true';
    }
  });
}, 1000);