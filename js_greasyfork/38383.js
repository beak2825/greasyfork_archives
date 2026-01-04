// ==UserScript==
// @name         Neopets: SDB Jellyneo Price
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1
// @description  Adds an extra column in the SDB with jellyneo's estimated price.
// @author       You
// @match        http://www.neopets.com/safetydeposit.phtml*
// @match        https://items.jellyneo.net/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/38383/Neopets%3A%20SDB%20Jellyneo%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/38383/Neopets%3A%20SDB%20Jellyneo%20Price.meta.js
// ==/UserScript==

$("table[cellpadding=4]").attr("id", "SDBtable");
$("#SDBtable td[colspan=6]").attr("colspan", "7");

// add another cell to the first blue row
var PriceTD = document.createElement("td");
$("#SDBtable tr:first-child").append(PriceTD);
PriceTD.setAttribute('class', 'contentModuleHeaderAlt');
PriceTD.style["text-align"] = "center";
PriceTD.innerHTML = 'JN Price';

// makes the item name one line
$('.word-wrap-break-word a').css("white-space", "nowrap");

$("#SDBtable tr[bgcolor=#F6F6F6]").each(function(){
    // get .text() but not the text in span
    var itemName = $(this).find('td:nth-child(2) b').contents().filter(function() {
        return this.nodeType == 3;
    }).text();

    var framePrice = document.createElement("td");
    $(this).append(framePrice);
    framePrice.innerHTML = '<div style="overflow:hidden;width:100px;height:25px"><iframe scrolling="no" src="https://items.jellyneo.net/search/?name=' + itemName + '&name_type=3&sort=1&limit=10" style="width: 500px; height: 395px;margin-top: -345px;margin-left: -39px;"></iframe></div>';
});
$("#SDBtable tr[bgcolor=#FFFFFF]").each(function(){
    // get .text() but not the text in span
    var itemName = $(this).find('td:nth-child(2) b').contents().filter(function() {
        return this.nodeType == 3;
    }).text();

    var framePrice = document.createElement("td");
    $(this).append(framePrice);
    framePrice.innerHTML = '<div style="overflow:hidden;width:100px;height:25px"><iframe scrolling="no" src="https://items.jellyneo.net/search/?name=' + itemName + '&name_type=3&sort=1&limit=10" style="width: 500px; height: 395px;margin-top: -345px;margin-left: -39px;"></iframe></div>';
});
$("#SDBtable tr[bgcolor=#DFEAF7]").each(function(){
    // get substring before (
    var itemNameRaw = $(this).find('td:nth-child(2) b').text();
    var itemName = itemNameRaw.substr(0, itemNameRaw.indexOf('('));

    var framePrice = document.createElement("td");
    $(this).append(framePrice);
    framePrice.innerHTML = '<div style="overflow:hidden;width:100px;height:25px"><iframe scrolling="no" src="https://items.jellyneo.net/search/?name=' + itemName + '&name_type=3&sort=1&limit=10" style="width: 500px; height: 395px;margin-top: -345px;margin-left: -39px;"></iframe></div>';
});