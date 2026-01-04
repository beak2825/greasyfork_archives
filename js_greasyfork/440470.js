// ==UserScript==
// @name         Steam Auto-Confirm SSA Checkbox
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically click the SSA confirm checkbox
// @author       DarthYoshiBoy
// @match        https://store.steampowered.com/account/registerkey*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440470/Steam%20Auto-Confirm%20SSA%20Checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/440470/Steam%20Auto-Confirm%20SSA%20Checkbox.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    var links = document.querySelectorAll('input[name="accept_ssa"]');
    for (var check = 0; check < links.length; check++) {
        links[check].click();
    }
}, false);