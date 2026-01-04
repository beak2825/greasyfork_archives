// ==UserScript==
// @name         TC Elim Revenge Status Colors
// @namespace    namespace
// @version      0.1
// @description  description
// @license      MIT
// @author       tos
// @match       *.torn.com/competition.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475410/TC%20Elim%20Revenge%20Status%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/475410/TC%20Elim%20Revenge%20Status%20Colors.meta.js
// ==/UserScript==

GM_addStyle(`
.user-blue-status {
  color: var(--default-blue-color) !important;
}
.user-green-status {
  color: var(--default-green-color) !important;
}
.user-red-status {
  color: var(--default-red-color) !important;
}
`)