// ==UserScript==
// @name        Cleaner Twitter/X sidebar
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/home
// @grant       GM_addStyle
// @version     1.0
// @license MIT
// @author      Claudio C.
// @description 16/09/2023, 16:51:00
// @downloadURL https://update.greasyfork.org/scripts/475435/Cleaner%20TwitterX%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/475435/Cleaner%20TwitterX%20sidebar.meta.js
// ==/UserScript==

(() => {
  GM_addStyle("div:has(> [aria-label='Subscribe to Premium']) { display: none !important; }");
  GM_addStyle("div:has(> [aria-label='Who to follow']) { display: none !important; }");
  GM_addStyle("[data-testid='DMDrawer'] { display: none !important; }");
})();
