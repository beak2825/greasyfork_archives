// ==UserScript==
// @name         Voetbalpoules.nl auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Voetbalpoules.nl automatisch invullen
// @author       You
// @match        https://www.voetbalpoules.nl/deelnemer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voetbalpoules.nl
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467442/Voetbalpoulesnl%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/467442/Voetbalpoulesnl%20auto.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let startbtn = $(`<li><p style="cursor: pointer;">Vul in</p></li>`).click(function(){
        start()
    });
    $(".tabs.noprint").append(startbtn);

})();

async function start() {
    let doelpunten = $(".doelpunten")

    /*$(".doelpunten").each(function( index ) {
        let first = $(this).children(":first");
        let second = $(this).children(":nth-child(2)");

        $(this).each(function( index ) {

        });
        if ($(first).find("select").find(":selected").text() == "") {
            let highest = -1;
            let topScore = null;
            $(first).find("select option").each(function( index ) {
                let goals = $(this).text().replace( /^\D+/g, '');

                if (goals > highest) {
                    highest = goals
                    topScore = $(this);
                }
            });
            $(first).find("select").val(topScore.val()).change();

        }

    });*/


    $("td>.noprint>.statistieken").click()
    await sleep(1000);
    //let allRows = $(".voorspellingen>tbody>.titel").nextAll(":visible");
    //console.log(allRows);
    //let allInput = $(".voorspellingen>tbody>.titel").nextAll(":visible");

    let allStats = $(".voorspellingen>tbody>.stats .statistieken > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1)");
    $(allStats).click()

    $(".doelpunten select").each(function( index ) {
        let highest = -1;
        let topScore = null;
         console.log($(this))
        $(this).find("option").each(function( index ) {
            console.log($(this))
            let goals = $(this).text().replace( /^\D+/g, '');

            if (goals > highest) {
                highest = goals
                topScore = $(this);
            }
        });
        $(this).val(topScore.val()).change();

    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}