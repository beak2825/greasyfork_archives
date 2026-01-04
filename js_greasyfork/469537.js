// ==UserScript==
// @name     Disable Refresh on Scroll
// @description     Disables pull-to-refresh but allows overscroll glow effects.
// @author   junior1q94
// @match    *://*/*
// @version  1.1
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/1113142
// @downloadURL https://update.greasyfork.org/scripts/469537/Disable%20Refresh%20on%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/469537/Disable%20Refresh%20on%20Scroll.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
    html, body {
      /* Disables pull-to-refresh but allows overscroll glow effects. */
      overscroll-behavior-y: contain;
    }
  `);
})();
