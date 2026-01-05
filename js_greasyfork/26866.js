// ==UserScript==
// @name         FEXBots Easy Missing List
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://fexbots.com/tools/pgo/*/missing
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26866/FEXBots%20Easy%20Missing%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/26866/FEXBots%20Easy%20Missing%20List.meta.js
// ==/UserScript==


function calculateMissing() {
    var y = [];
    var x = $("#missingList tr td:nth-child(3)");
    x.map(function(e) {
        y.push(x[e].innerHTML);
    });
    console.log("Missing Pokemon: " + y.join(", "));
    $("span.missing").text(y.join(", "));
}

(function() {
    'use strict';

    if($("span.missin2g")[0] === undefined) {
        var missing_span = document.createElement("span");
        missing_span.className = "missing";
        $("#missing > fieldset > div > div > article > div > header > h1").append("<br />").append(missing_span);

        var button = document.createElement("input");
        button.className = "format_missing ";
        button.type = "button";
        button.className += "btn btn-alt btn-mini";
        button.value = "Format Missing";
        $(button).click(calculateMissing);
        $("body > div.container-fluid > div.content-block > div:nth-child(3) > article > div > header > h2").append(" | " ).append(button);
    }
})();