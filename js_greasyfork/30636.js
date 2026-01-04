// ==UserScript==
// @name         Subeta Stocking
// @description  This script auto stocks your shops.
// @version      1
// @author       Unknown
// @match        *://subeta.net/user_shops.php/mine/*/quick_stock
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @icon         https://subeta.net/favicon.ico
// @icon64       https://img.subeta.net/items/bottle_apothecary_01.gif
// @namespace https://greasyfork.org/users/133026
// @downloadURL https://update.greasyfork.org/scripts/30636/Subeta%20Stocking.user.js
// @updateURL https://update.greasyfork.org/scripts/30636/Subeta%20Stocking.meta.js
// ==/UserScript==


if ($('div.four.wide.column.left.aligned').length){
    $("button[x-type='shop']").click();

    window.onload = $("input[class='ui button huge green']").click();
} else {
    // Do something if class does not exist
}

