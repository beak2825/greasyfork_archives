// ==UserScript==
// @name         KTH Math assistant
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make result reporting easier for KTH math assistants. Add pass/fail buttons and result counters at the bottom.
// @author       Ludvig Janiuk (janiuk@kth.se ludvig.janiuk@gmail.com)
// @match        http://kthgrumatte.webfactional.com/semres/*/*/edit
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33519/KTH%20Math%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/33519/KTH%20Math%20assistant.meta.js
// ==/UserScript==

function ready(fn) {
    'use strict';
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function buttonScript(opt) {
    return function(e) {
        var select = $(e.target).parent().parent().find("select");
        // Deselect all
        select.find("option").attr("selected", null);
        // Select one
        select.find("option:contains("+opt+")").attr("selected", "selected");
        select.trigger("change");
    };
}

function updateCounters() {
    var table = $("#id_form-2-pnr").parent().parent();
    var passSum = table.find("option:contains('P')").filter("[selected=selected]").length;
    $("#totalPassSum").text("P = " + passSum);
    var failSum = table.find("option:contains('F')").filter("[selected=selected]").length;
    $("#totalFailSum").text("F = " + failSum);
}

function doStuff() {
    'use strict';

    // Disable form

    //$("form").attr("action", "");


    // Actual stuff

    var table = $("#id_form-2-pnr").parent().parent();
    var rows = table.children().slice(1);

    var Pbutton = $("<td><button type=button style='background-color: lightgreen;'>PASS</button></td>");
    Pbutton.find("button").on("click", buttonScript("P"));
    rows.append(Pbutton);

    var Fbutton = $("<td><button type=button style='background-color: lightpink;'>FAIL</button></td>");
    Fbutton.find("button").on("click", buttonScript("F"));
    rows.append(Fbutton);

    var lastRow = $("<tr></tr>");
    lastRow.append("<td />");
    lastRow.append("<td />");
    lastRow.append("<td />");
    lastRow.append("<td />");
    lastRow.append("<td id='totalPassSum'></td>");
    lastRow.append("<td id='totalFailSum'></td>");
    table.append(lastRow);

    updateCounters();
    table.on("change", updateCounters);
}

(function() {
    ready(doStuff);
})();
