// ==UserScript==
// @name          Steam Inventory - Booster to badge shortcut
// @description   Go to badge from inventory.
// @license       Apache-2.0
// @author        iBreakEverything
// @namespace     https://greasyfork.org/users/738914
// @include       *://steamcommunity.com/id/*/inventory/
// @version       1.2
// @icon          https://store.steampowered.com/favicon.ico
// @require       http://code.jquery.com/jquery-3.x-git.min.js
// @downloadURL https://update.greasyfork.org/scripts/421995/Steam%20Inventory%20-%20Booster%20to%20badge%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/421995/Steam%20Inventory%20-%20Booster%20to%20badge%20shortcut.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

(function() {
    $(document).on("click", ".inventory_item_link, .newitem", function() {
        let elem = document.getElementById('iteminfo0_item_owner_actions');
        if (elem.children[0].href.match("OpenBooster")) {
            addButtonToHtmlElement(elem);
        }
        elem = document.getElementById('iteminfo1_item_owner_actions');
        if (elem.children[0].href.match("OpenBooster")) {
            addButtonToHtmlElement(elem);
        }
    });
})();

function addButtonToHtmlElement(elem) {
    let id = elem.children[0].href.split('(')[1].split(',')[0].trim();
    let node = document.createElement("A");
    node.id = "boosterBadgePage";
    node.className = "btn_small btn_grey_white_innerfade";
    node.href = `${document.URL.split('inventory')[0]}/gamecards/${id}/`;
    node.target = "_blank";
    node.rel = "noopener";
    let span = document.createElement("SPAN");
    span.innerText = "Visit Badge Page";
    node.appendChild(span);
    elem.appendChild(node);
}