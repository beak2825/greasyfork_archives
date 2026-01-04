// ==UserScript==
// @name SDWU - Custom hotkeys for Lobe Theme
// @namespace http://monnef.eu/
// @version 0.1
// @description Press 'x' or 'e' to toggle visibility of the "Extra Networks" panel and 'q' to toggle the "Quick Settings" panel in Stable Diffusion WebUI with Lobe Theme
// @match http://127.0.0.1:7860/*
// @author monnef
// @grant none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/479453/SDWU%20-%20Custom%20hotkeys%20for%20Lobe%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/479453/SDWU%20-%20Custom%20hotkeys%20for%20Lobe%20Theme.meta.js
// ==/UserScript==

const EXTRA_NETWORKS_SELECTOR = '.lucide.lucide-chevron-left';
const QUICK_SETTINGS_SELECTOR = '.lucide.lucide-chevron-right';

const clickOnElement = selector => {
  const element = document.querySelector(selector);
  if (element) {
    element.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  } else {
    console.log(`Element not found for selector: ${selector}`);
  }
};

const handleExtraNetworks = () => clickOnElement(EXTRA_NETWORKS_SELECTOR);
const handleQuickSettings = () => clickOnElement(QUICK_SETTINGS_SELECTOR);

const keyHandlers = {
  'x': handleExtraNetworks,
  'e': handleExtraNetworks,
  'q': handleQuickSettings
};

document.addEventListener('keydown', event => {
  const activeElement = document.activeElement;
  const isFocusedElementInputOrTextarea = activeElement && ['INPUT', 'TEXTAREA'].includes(activeElement.tagName);

  if (isFocusedElementInputOrTextarea) return;

  keyHandlers[event.key]?.();
});