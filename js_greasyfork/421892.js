// ==UserScript==
// @name         Caption Fix
// @namespace    https://statonions.com/
// @version      0.1
// @description  Damn pixel
// @author       Noon
// @match        https://m.youtube.com/watch?*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/421892/Caption%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/421892/Caption%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(
`.caption-window {
	bottom: 15% !important;
}
`);
})();