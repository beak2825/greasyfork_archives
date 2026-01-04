// ==UserScript==
// @name         Seedbed Header Disable
// @namespace    https://github.com/dandedrick
// @version      0.2
// @description  Disable header on seedbed.com entries for better screen sharing.
// @author       Dan Dedrick
// @match        https://seedbed.com/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seedbed.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464248/Seedbed%20Header%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/464248/Seedbed%20Header%20Disable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let head = document.querySelectorAll("header");
    head[0].style.display = "none"
})();