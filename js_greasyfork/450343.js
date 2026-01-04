// ==UserScript==
// @name         Таймер написания новости
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Таймер написания новости для сайта rossaprimavera.ru
// @author       Kolontsov Alexander
// @match        https://rossaprimavera.ru/adm/edit/*
// @icon         https://www.google.com/s2/favicons?domain=rossaprimavera.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450343/%D0%A2%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%20%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/450343/%D0%A2%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%20%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';


var parentDiv = document.getElementsByClassName("menu")[0];
parentDiv.innerHTML = parentDiv.innerHTML + "<li><div id='myTimer1'> </div></li>";

parentDiv = document.getElementById("hubs").parentElement
//parentDiv.innerHTML = parentDiv.innerHTML + "<p><div style='background:#3c3232' id='myTimer2'> </div></p>";
parentDiv.insertAdjacentHTML("beforeEnd", "<p><div style='background:#3c3232' id='myTimer2'> </div></p>");


var timer;
var seconds = 0;
var startSeconds = new Date().getTime() / 1000;

function nextSecond()
{
    var curSeconds = new Date().getTime() / 1000;
    seconds = Math.round(curSeconds - startSeconds);

    var str = String(parseInt(seconds/60)).padStart(2,'0') + ":" + String(seconds%60).padStart(2,'0');
    var color;

    if(seconds>30*60)
        color = "#FF7A73";
    else if(seconds>15*60)
        color = "#FFA340";
    else
        color = "#D4FA3E";

	var myTimer1 = document.getElementById("myTimer1");
    myTimer1.innerHTML = "<font color=\"" + color + "\"> <b> " + str + "</b></font>";

	var myTimer2 = document.getElementById("myTimer2");
    myTimer2.innerHTML = "<font color=\"" + color + "\"> <b> " + str + "</b></font>";


    seconds++;
//    console.log (str);
    timer = setTimeout(nextSecond, 1000);
}

nextSecond();




})();