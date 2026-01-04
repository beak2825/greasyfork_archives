// ==UserScript==
// @name         FFFix-Navigate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Navigate Fix without popup
// @author       Sertalp B. Cay
// @match        https://www.fantasyfootballfix.com/algorithm_predictions/
// @license      MIT
// @grant        none
// @require http://code.jquery.com/jquery-2.2.4.js
// @downloadURL https://update.greasyfork.org/scripts/452816/FFFix-Navigate.user.js
// @updateURL https://update.greasyfork.org/scripts/452816/FFFix-Navigate.meta.js
// ==/UserScript==

(new MutationObserver(check)).observe(document, {childList: true, subtree: true, attributes: true, characterData: true});

function check(changes, observer) {
    var $ = window.jQuery;
    if(document.querySelector('body')) {
        var e = $('#page_content');
        e.attr("id", "x_page_content");
    }
}