// ==UserScript==
// @name         RYM score to letter grades
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Changes scores to letter grades on artist pages
// @author       jermrellum
// @match        https://rateyourmusic.com/artist/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/415589/RYM%20score%20to%20letter%20grades.user.js
// @updateURL https://update.greasyfork.org/scripts/415589/RYM%20score%20to%20letter%20grades.meta.js
// ==/UserScript==

function convertToLetter(score)
{
    var scoidx = parseInt(score * 5);
    switch(scoidx)
    {
        case 25:
        case 24:
        case 23:
        case 22:
        case 21:
        case 20: return "A+";
        case 19: return "A&nbsp;";
        case 18: return "A-";
        case 17: return "B+";
        case 16: return "B&nbsp;";
        case 15: return "B-";
        case 14: return "C+";
        case 13: return "C&nbsp;";
        case 12: return "C-";
        case 11: return "D+";
        case 10: return "D&nbsp;";
        case 9: return "D-";
        case 8:
        case 7:
        case 6:
        case 5:
        case 4:
        case 3:
        case 2:
        case 1:
        case 0: return "F&nbsp;";
    }
    return "";
}
function getLetterColor(letter)
{
    var l = letter.charAt(0);
    switch(l)
    {
        case "A": return "#2d3";
        case "B": return "#9c0";
        case "C": return "#ec1";
        case "D": return "#f92";
        case "F": return "#f76";
    }
}

function processArr(arr)
{
    for(var i=0; i<arr.length; i++)
    {
        var score = arr[i].innerHTML;
        var letter = convertToLetter(score);
        var color = getLetterColor(letter);
        arr[i].innerHTML = "<span style='font-family:\"Lucida Console\";color: black;background-color: " + color + ";border-radius: 20px;padding: 5px;-webkit-text-fill-color: black;'>" + letter + "</span>";
    }
}

(function() {
    'use strict';

    processArr(document.getElementsByClassName("disco_avg_rating"));
})();