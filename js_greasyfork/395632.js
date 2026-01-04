// ==UserScript==
// @name          Add bp.tf prices to marketplace
// @description   Whenever you view a marketplace item, it will list the bp.tf price
// @require       http://code.jquery.com/jquery-1.12.4.min.js
// @match         https://marketplace.tf/items/tf2*
// @version       0.0.4
// @namespace     https://greasyfork.org/users/165521
// @downloadURL https://update.greasyfork.org/scripts/395632/Add%20bptf%20prices%20to%20marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/395632/Add%20bptf%20prices%20to%20marketplace.meta.js
// ==/UserScript==

var detailRe = /https:\/\/marketplace\.tf\/items\/tf2\/(.+)/;
var itemSKU = window.location.href.match(detailRe)[0].split(";");

function getPrices(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

var itemType = $("tbody > tr:nth-child(1) > .left-table-align").text().trim();
var craftability = itemSKU.includes("uncraftable") ? "Non-Craftable" : "Craftable";

if (craftability === "Non-Craftable") {
    itemName = itemName.slice(12);
}

if (itemSKU.includes("kt-2")) {
    itemName = itemName.slice(0, 12) + "Killstreak" + itemName.slice(11);
}
if (itemSKU.includes("kt-3")) {
    itemName = itemName.slice(0, 13) + "Killstreak" + itemName.slice(12);
}

var pageUrl = "https://backpack.tf/stats/" + itemType + "/" + itemName + "/" + "Tradable/" + craftability;

getPrices(pageUrl, function (html) {
    var site = $('<output>').append($.parseHTML(html));
    var price = $(".price-boxes > a:nth-child(1) > .text > .value", site).innerText;
    if (price === undefined) {
        price = $(".price-boxes > a:nth-child(1) > .text > .value", site).text().trim();
    }
    if (price[0] == "$") {
        price = "Unlisted";
    }
    var code = $("<tr><td class='left-table-align'>Backpack.tf Price</td><td class='right-table-align'>" + price + "</td></td>");
    code.appendTo(".auction-details > table:nth-child(1) > tbody:nth-child(1)");
});

