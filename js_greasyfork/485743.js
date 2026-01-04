// ==UserScript==
// @name         Field Raider Firefox
// @namespace    http://tampermonkey.net/
// @version      1.77
// @description  Bypass field restrictions when pasting data from the clipboard (Ctrl + V and right-click paste)
// @author       Seth@WiiPlaza
// @match        *://*/*
// @icon         https://pbs.twimg.com/media/FR11DSvX0AI1W44.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485743/Field%20Raider%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/485743/Field%20Raider%20Firefox.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const excludeRegex = /https?:\/\/.*?\.(facebook\.com|messenger\.com|google\.com|github\.com|imgur\.com).*/;
  const includeRegex = /https?:\/\/.*/;

  const isRestrictedSite = () => {
    const location = window.location.href;
    return includeRegex.test(location) && !excludeRegex.test(location);
  };

  const pasteText = async (element, text) => {
    element.value = text;
    await simulateKeyPresses(text);
  };

  const simulateKeyPresses = async (text) => {
    for (let i = 0; i < text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20)); // Adjust timing if necessary
      const eventSpace = new KeyboardEvent('keydown', { key: ' ' });
      const eventBackspace = new KeyboardEvent('keydown', { key: 'Backspace' });
      document.dispatchEvent(eventSpace);
      document.dispatchEvent(eventBackspace);
    }
  };

  const allowCopyAndPaste = (e) => {
    e.stopImmediatePropagation();
    return true;
  };

  const triggerPaste = (event) => {
    if (event.ctrlKey && event.key === "v") {
      navigator.clipboard.readText().then(text => {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
          pasteText(activeElement, text);
        }
      });
    }
  };

  const forceEnableCopyPaste = (e) => {
    e.stopImmediatePropagation();
    return true;
  };

  ['paste', 'copy'].forEach(event => {
    document.addEventListener(event, forceEnableCopyPaste, true);
  });

  document.addEventListener('keyup', triggerPaste, false);

  if (isRestrictedSite()) {
    document.addEventListener('copy', allowCopyAndPaste, true);
    document.addEventListener('paste', allowCopyAndPaste, true);
  }
})();
