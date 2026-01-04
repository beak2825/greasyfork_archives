// ==UserScript==
// @name         Uncheck Newegg Subscribe
// @copyright    2025 Jonathan Kamens
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2025-02-11
// @description  Uncheck the checked-by-default Newegg subscription checkbox at checkout
// @author       You
// @match        https://secure.newegg.com/shop/checkout*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=newegg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526589/Uncheck%20Newegg%20Subscribe.user.js
// @updateURL https://update.greasyfork.org/scripts/526589/Uncheck%20Newegg%20Subscribe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let label = document.getElementsByClassName("form-checkbox")[0];
    if (! label) return;
    let input = label.getElementsByTagName("input")[0];
    if (! input) return;
    let title = label.getElementsByTagName("span")[0];
    if (! title) return;
    if (! title.innerText.includes("Subscribe")) return;
    input.checked = false;
})();