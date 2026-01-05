// ==UserScript==
// @name         Remove Useless Madokami Links
// @namespace    http://blank.org/
// @version      0.1
// @description  Removes the Read links from Madokami's manga pages
// @author       pwNBait
// @match        https://manga.madokami.com/Manga/*/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10047/Remove%20Useless%20Madokami%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/10047/Remove%20Useless%20Madokami%20Links.meta.js
// ==/UserScript==

$(document).ready(function() {
    $("td:nth-child(6)").remove()
});