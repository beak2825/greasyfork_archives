// ==UserScript==
// @name         Xuerian filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  xuerian filter awesome
// @author       You
// @match        https://wf.xuerian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xuerian.net
// @require http://code.jquery.com/jquery-latest.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436993/Xuerian%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/436993/Xuerian%20filter.meta.js
// ==/UserScript==



function getAllRelics() {
    var allRelics = [];
    $('.relics.box-container > .relic').each(function() { allRelics.push($(this)[0]) });
    return allRelics;
}

function filterFor(type) {
    const allRelics = getAllRelics();

    for (const relic of allRelics) {
        if (!relic.textContent.includes(type)) {
            relic.style.display = "none";
        } else {
            relic.style.display = "block";
        }
    }
}

$(document).ready(function() {


    $("#nav").append('<div value="Lith" id="Lith" style="margin-left: 500px;">Lith</div>');
    $("#nav").append('<div value="Meso" id="Meso">Meso</div>');
    $("#nav").append('<div value="Neo" id="Neo">Neo</div>');
    $("#nav").append('<div value="Axi" id="Axi">Axi</div>');
    $("#nav").append('<div value="Reset" id="Reset">Reset</div>');


    $("#Lith").click(function(){
        filterFor("Lith");
        $("#Lith")[0].className = "active";
        $("#Meso")[0].className = "";
        $("#Neo")[0].className = "";
        $("#Axi")[0].className = "";
    });
    $("#Meso").click(function(){
        filterFor("Meso");
        $("#Lith")[0].className = "";
        $("#Meso")[0].className = "active";
        $("#Neo")[0].className = "";
        $("#Axi")[0].className = "";
    });
    $("#Neo").click(function(){
        filterFor("Neo");
        $("#Lith")[0].className = "";
        $("#Meso")[0].className = "";
        $("#Neo")[0].className = "active";
        $("#Axi")[0].className = "";
    });
    $("#Axi").click(function(){
        filterFor("Axi");
        $("#Lith")[0].className = "";
        $("#Meso")[0].className = "";
        $("#Neo")[0].className = "";
        $("#Axi")[0].className = "active";
    });
    $("#Reset").click(function(){
        filterFor("");
        $("#Lith")[0].className = "";
        $("#Meso")[0].className = "";
        $("#Neo")[0].className = "";
        $("#Axi")[0].className = "";
    });
});

