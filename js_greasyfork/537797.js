// ==UserScript==
// @name        HamsterDefaultEmbed
// @namespace   Violentmonkey Scripts
// @description Defaults dropdown value to "Direct link"
// @match       https://hamster.is/*
// @grant       none
// @license     GPL3
// @version     1.0.2
// @author      vandenium

// @downloadURL https://update.greasyfork.org/scripts/537797/HamsterDefaultEmbed.user.js
// @updateURL https://update.greasyfork.org/scripts/537797/HamsterDefaultEmbed.meta.js
// ==/UserScript==
// Changelog:
// - 1.0.2 - 2025/07/31
//   - add commented options for user configurability
// - 1.0.1 - 2025/07/31
//   - add 50ms delay
// - 1.0.0 - 2025/05/30
//   - Initial release

window.setTimeout(() => {
  const sel = document.querySelector('#uploaded-embed-toggle');
  if (sel) {

    /////////////////////////////////////////////////////////////////////
    // If you want to default to something else, just comment out the ///
    // currently active sel.value below and uncomment the one you want.//
    /////////////////////////////////////////////////////////////////////

    // sel.value = 'viewer-links';
    sel.value = 'direct-links';
    // sel.value = 'thumb-links';
    // sel.value = 'medium-links';
    // sel.value = 'bbcode-embed';
    // sel.value = 'full-bbcode-embed';
    // sel.value = 'medium-bbcode-embed';
    // sel.value = 'thumb-bbcode-embed';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }
}, 50);
