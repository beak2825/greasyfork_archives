// ==UserScript==
// @name         Disable Grok Auto‑Focus
// @description  Prevent Grok from programmatically moving focus anywhere
// @match        *://grok.com/*
// @run-at       document-start
// @version 0.0.1.20250516075924
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/536183/Disable%20Grok%20Auto%E2%80%91Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/536183/Disable%20Grok%20Auto%E2%80%91Focus.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Override the element focus method so that any programmatic focus() calls do nothing
  const originalElementFocus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function() {
    // no-op: swallow all programmatic focus
  };

  // Also override window.focus in case Grok invokes it
  const originalWindowFocus = window.focus;
  window.focus = function() {
    // no-op
  };

  // If you ever need to restore normal focus behavior, you can do:
  // HTMLElement.prototype.focus = originalElementFocus;
  // window.focus = originalWindowFocus;
})();
