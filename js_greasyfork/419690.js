// ==UserScript==
// @name         Cooking Pot
// @namespace    http://tampermonkey.net/
// @version      2021.01.05
// @description  Faster recipe testing
// @author       EatWoolooAsMutton
// @match        http://www.neopets.com/island/cookingpot.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419690/Cooking%20Pot.user.js
// @updateURL https://update.greasyfork.org/scripts/419690/Cooking%20Pot.meta.js
// ==/UserScript==

$(`<div id="cooking_results"></div>`).appendTo($(".cookingpot-container"));

$("[value='Mix Items']").on("click", function (event) {

    $("#cooking_results").html("<p>Processing...</p>");

    event.preventDefault();

    // disable this button temporarily
    let thisClassBefore = $(this).attr("class");
    $(this).prop("disabled", true);
    $(this).attr("class", thisClassBefore.replace(/yellow/g, "red"));

    $.ajax({
        type : "POST",
        url : "/island/process_cookingpot.phtml",
        data : {
            "first" : $("[name='first']").val(),
            "second" : $("[name='second']").val(),
            "third" : $("[name='third']").val()
        },
        async : true,
        dataType : "html",
        success : data => {
            let results = ``;
            $($.parseHTML(data)).find(".jhuidah ~ :not('a')").each(function (index, element) {
                results += element.outerHTML;
            });

            $("#cooking_results").html(results);

            // enable button
            let thisClassAfter = $(this).attr("class");
            $(this).prop("disabled", false);
            $(this).attr("class", thisClassAfter.replace(/red/g, "yellow"));
        }
    });
});