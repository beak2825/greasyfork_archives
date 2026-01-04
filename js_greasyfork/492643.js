// ==UserScript==
// @name         Remove destinations from AZair.eu
// @namespace    http://tampermonkey.net/
// @version      2024-04-16
// @description  Removes destinations from AZAir search results
// @author       Rattlyy
// @match        https://www.azair.eu/azfin.php*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azair.eu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492643/Remove%20destinations%20from%20AZaireu.user.js
// @updateURL https://update.greasyfork.org/scripts/492643/Remove%20destinations%20from%20AZaireu.meta.js
// ==/UserScript==

var REMOVE_AIRPORTS = ["FCO", "TIA", "PMO", "GOA", "CTA", "VCE", "BLQ", "PSA", "TRS", "VRN", "MLA", "BGY", "MXP"]
var removed = []
if ([null, undefined, ""].includes(localStorage.getItem("rmAir"))) {
    localStorage.setItem("rmAir", REMOVE_AIRPORTS.join(","))
} else {
    REMOVE_AIRPORTS = localStorage.getItem("rmAir").split(",");
}

$(document).ready(function() {
    $("body > div.header > div.smBar").remove()
    $("body > div.header > div.controls > div").css("right", "10px").prepend('<h5>REMOVE IDS</h5> <input class="txt" id="removeAirportsInput"></input><button class="bt blue small" id="removeAirportsBtn">REFRESH</button>')
    $("#removeAirportsInput").val(localStorage.getItem("rmAir"))
    $("#removeAirportsBtn").click(function () {
        localStorage.setItem("rmAir", $("#removeAirportsInput").val());
        REMOVE_AIRPORTS = localStorage.getItem("rmAir").split(",");
        removed.forEach(function(e) {
            $(e).show();
        });
        remove()
    });

    remove()
});

function remove() {
    $("div.result ").each(function() {
        var item = $(this).find("div.text > p:nth-child(1) > span.to > span")
        var code = $(item).clone().children().remove().end().text();
        if (REMOVE_AIRPORTS.includes(code)) {
            var toRemove = $(item).parent().parent().parent()
            removed.push(toRemove)
            toRemove.hide();
        }
    });
}