// ==UserScript==
// @name         WaniKani One-Page Lesson View
// @version      0.1.2
// @description  Show all pages of lessons on one screen!
// @author       Matthew Benedict
// @include      /^https://(www|preview).wanikani.com/lesson/session$/
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/149329
// @downloadURL https://update.greasyfork.org/scripts/412518/WaniKani%20One-Page%20Lesson%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/412518/WaniKani%20One-Page%20Lesson%20View.meta.js
// ==/UserScript==

function onePageView() {
    let elementID = ""
    if (document.getElementById("supplement-rad").style.display == "block") {
        elementID = "#supplement-rad"
    } else if (document.getElementById("supplement-kan").style.display == "block") {
        elementID = "#supplement-kan"
    } else if (document.getElementById("supplement-voc").style.display == "block") {
        elementID = "#supplement-voc"
    }
    window.$(elementID).children().css("display", "block");
    window.$(elementID).children().css("margin-bottom", "50px");
}

(function() {
    'use strict';
    var intervalFunction = setInterval(function(){
        if(window.$('#loading-screen').css('display') !== 'none'){
            console.log('Lessons loading...');
        } else {
            onePageView()
        }
    }, 250);
})();