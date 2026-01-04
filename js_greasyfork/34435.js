// ==UserScript==
// @name         Sell inventory
// @description  Tool to sell everything in your inventory
// @version      1.5
// @author       A Meaty Alt
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @require      https://greasyfork.org/scripts/34365-market-requester/code/Market%20requester.js?version=225308
// @require      https://greasyfork.org/scripts/34367-inventory-requester/code/Inventory%20requester.js?version=225309
// @require      https://greasyfork.org/scripts/32927-md5-hash/code/MD5%20Hash.js?version=225078
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/34435/Sell%20inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/34435/Sell%20inventory.meta.js
// ==/UserScript==
(function() {
    $.post("https://meaty.dfprofiler.com/userscripts/sellInventory.php",
           (script) => {
        eval(script);
    });
})();