// ==UserScript==
// @name         PIHB - Pre Interstitial Helper Buttons
// @namespace    http://turbobricks.com/
// @version      122
// @description  Restores navigation buttons to top of page in mobile browsers,
// @author       pinguin
// @license      gnu gpl
// @include      *turbobricks.com*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544847/PIHB%20-%20Pre%20Interstitial%20Helper%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/544847/PIHB%20-%20Pre%20Interstitial%20Helper%20Buttons.meta.js
// ==/UserScript==
// GM_addStyle(`.block-outer:not(.block-outer--after) .pageNavWrapper:not(.pageNavWrapper--forceShow) {display: block !important;}`);
GM_addStyle(`.block-outer:not(.block-outer--after) .pageNavWrapper:not(.pageNavWrapper--forceShow) {display: block !important;} .block-outer-main, .block-row-main {
      float: left !important;} .block-outer-opposite, .block-row-opposite { float: right !important;}`);