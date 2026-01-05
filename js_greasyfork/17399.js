// ==UserScript==
// @name         Settings dealy
// @namespace    mobiusevalon.tibbius.com
// @version      0.5
// @description  Showing how easy it is to hide elements based on query
// @author       Mobius Evalon <mobiusevalon@tibbus.com>
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @match        http://www.trueachievements.com/customize.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17399/Settings%20dealy.user.js
// @updateURL https://update.greasyfork.org/scripts/17399/Settings%20dealy.meta.js
// ==/UserScript==

function filter_by_query(q)
{
    $("div#oOptionPanel div.inputform div.innerform").each(function() {
        $(this).children("div.filtered-out, div:not([class]), div[class='']").each(function() {
            if(!q.length || $(this).html().toLowerCase().indexOf(q) > -1) $(this).removeClass("filtered-out").show();
            else $(this).addClass("filtered-out").hide();
        });
        if(!q.length || $(this).children("div").not(".clearboth, .filtered-out").length) $(this).parent().show();
        else $(this).parent().hide();
    });
}

$(document).ready(function() {
    $("div#main h1.pagetitle")
        .css("display","inline-block")
        .after(
        $("<img/>")
        .attr("src","/images/icons/information.png")
        .attr("alt","Quickly find relevant options you're looking for by typing search text in the box, then hitting Enter/Return or clicking the Find button.")
        .attr("title","Quickly find relevant options you're looking for by typing search text in the box, then hitting Enter/Return or clicking the Find button.")
        .css("margin-left","8px"),
        $("<input/>")
        .attr("type","text")
        .attr("id","filter-text")
        .css("margin-left","8px")
        .css("margin-bottom","-2px")
        .keyup(function(e) {if(e.which === 13 || !$(this).val().length) $("#execute-filter").click();}),
        $("<input/>")
        .attr("type","button")
        .attr("value","Find")
        .attr("class","button")
        .attr("id","execute-filter")
        .css("margin-left","8px")
        .click(function() {filter_by_query($("#filter-text").val());})
    );
});