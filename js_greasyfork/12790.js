// ==UserScript==
// @name         Proxer-Collapsable-Lists
// @namespace    
// @version      0.7
// @description  Dieses Script bringt die zusammenklappbaren Anime-/Mangalisten aus dem Mobile Client ins Webinterface
// @author       TheExoduser
// @match        *://*.proxer.me/ucp?s=*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/12790/Proxer-Collapsable-Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/12790/Proxer-Collapsable-Lists.meta.js
// ==/UserScript==

$(document).ready(function() {
    var checkTrue = false;

    // Check if correct page
    if (window.location.href.indexOf('anime') > -1 || window.location.href.indexOf('manga') > -1) {
        checkTrue = true;
    }
    if (window.location.href.indexOf('ucp') === -1 || checkTrue === false || window.location.href.indexOf('forum') > -1) {
        return;
    }

    // Move first row to thead
    $("table#box-table-a").each(function(index) {
        var rowFirst = $(this).find("tr:first");

        $(this).find("tr:first").remove();
        $(this).prepend("<thead style=\"cursor:pointer;\">" + $(rowFirst).html() + "</thead>");
    });

    // Add +/- toggle icon to table head
    $("table#box-table-a:eq(1)").find("tr:first").html($("table#box-table-a:eq(1)").find("tr:first").html().replace("</th>","<span style=\"float:right;\">-</span></th>"));
    $("table#box-table-a").not(":eq(1)").each(function(index) {
        $(this).find("tr:first").html($(this).find("tr:first").html().replace("</th>","<span style=\"float:right;\">+</span></th>"));
    });

    // Hide all tbodys exept of the currently watching list
    $("table#box-table-a").not(":eq(1)").find('tbody').toggle();

    // Add events to toggle the tbodys on click
    $("th").click(function() {
        if ($(this).html().indexOf("+") >= 0) {
            $(this).html($(this).html().replace("+", "-"));
        } else {
            $(this).html($(this).html().replace("-", "+"));
        }

        $(this).closest('table').find('tbody').toggle("slow");
    });

    // Echo a loaded message
    console.warn("Proxer-Collapsable-Lists Userscript successfully loaded!");
});