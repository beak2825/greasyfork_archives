// ==UserScript==
// @name         Apple Trust and sign out
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  Clicks the "Trust and sign out" button automatically
// @author       Marc PEREZ
// @license      MIT
// @match        https://idmsa.apple.com/appleauth/signout?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apple.com
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @downloadURL https://update.greasyfork.org/scripts/502869/Apple%20Trust%20and%20sign%20out.user.js
// @updateURL https://update.greasyfork.org/scripts/502869/Apple%20Trust%20and%20sign%20out.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

function click(buttons) {
    buttons[0].click();
}

// Find the "Trust and sign out" button and click it
waitForKeyElements("div.button-bar-side:nth-child(1) > button:nth-child(1)", click);