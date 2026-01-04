// ==UserScript==
// @name         Hordes Origins
// @namespace    EngelOfChipo
// @version      0.3
// @description  User Script for the Hordes event : Origins
// @author       EngelOfChipo
// @match        http://www.hordes.fr/*
// @match        http://hordes.fr/#
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @resource    clockfontCSS https://fonts.googleapis.com/css?family=Orbitron
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/390458/Hordes%20Origins.user.js
// @updateURL https://update.greasyfork.org/scripts/390458/Hordes%20Origins.meta.js
// ==/UserScript==

var waitForEl = function(selector, callback) {
  if (jQuery(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

(function() {
    'use strict';
    var newCSS = GM_getResourceText ("clockfontCSS");
    GM_addStyle (newCSS);
    GM_addStyle(`#countdown
{
font-family: 'Orbitron', sans-serif;
    color: #dd4444;
    text-shadow: 0 0 20px rgba(255, 80, 80, 1),  0 0 20px rgba(255, 80, 80, 0);
letter-spacing: 0.05em;
font-size: 2em;
padding: 2em 0;
padding-lefy: -50px;
text-align: left;
    }`);

$(document).ready(function() {
    var countDownDate = new Date("Oct 1, 2019 16:23:43").getTime();
      // crée un nouvel élément div
    var countdownDiv = document.createElement("div");
    countdownDiv.setAttribute("id", "countdown");
    // et lui donne un peu de contenu
    var countdown = document.createTextNode('...');
    // ajoute le nœud texte au nouveau div créé
    countdownDiv.appendChild(countdown);

    waitForEl(".time", function(){
        console.log("FOund");
        var banner = $("#mapInfos");
        console.log(banner);
        banner.append(countdownDiv);
        //timeDiv.parent().insertAfter(countdownDiv, timeDiv);
    });
    //var currentDiv = document.getElementsByClassName("time").item(0);
    //console.log(currentDiv.nextSibling);
    //currentDiv.parentNode.insertBefore(countdownDiv, currentDiv.nextSibling);

    // Update the count down every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        countdownDiv.innerHTML = ("0" + days).slice(-2) + ":" + ("0" + hours).slice(-2) + ":"
            + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            countdownDiv.innerHTML = "EXPIRED";
        }
    }, 1000);
});
})();