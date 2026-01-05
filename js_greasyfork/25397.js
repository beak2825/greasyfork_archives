// ==UserScript==
// @name         Code beautiful
// @namespace    https://greasyfork.org/fr/scripts/25397-code-beautiful/
// @version      1.0
// @description  Rend les balises "code" plus belle
// @author       volca780
// @include      https://instant-hack.io/threads/*
// @include      https://instant-hack.io/threads/*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25397/Code%20beautiful.user.js
// @updateURL https://update.greasyfork.org/scripts/25397/Code%20beautiful.meta.js
// ==/UserScript==

$(document).ready(function(){

    var MAINCOL = "#E74C3C";
    var SECNCOL = "#2C3E50";
    var THIRCOL = "#3498DB";

    var MAINREG = /(\[.*\])/g;
    var SECNREG = /(\w*\d*)=/g;
    var THIRREG = /(.*)/g;

    var CODEINI = $("#selectmecode").html();

    var WORDS = CODEINI.match(MAINREG);
    var WORDS2 = CODEINI.match(SECNREG);
    var WORDS3 = CODEINI.match(THIRREG);

    x3 = 0;
    while(WORDS3.length > x3){
        var CODEINI = CODEINI.replace(WORDS3[x3], "<span style='color: " + THIRCOL + "'>" + WORDS3[x3] + "</span>");
        console.log(WORDS3[x3]);
        x3++;
    }

    x2 = 0;
    while(WORDS2.length > x2){
        var CODEINI = CODEINI.replace(WORDS2[x2], "<b><span style='color: " + SECNCOL + "'>" + WORDS2[x2] + "</span></b>");
        x2++;
    }

    x1 = 0;
    while(WORDS.length > x1){
        var CODEINI = CODEINI.replace(WORDS[x1], "<b><span style='color: " + MAINCOL + "'>" + WORDS[x1] + "</span></b>");
        x1++;
    }

    //console.log(CODEINI);
    $("#selectmecode").html(CODEINI);
});