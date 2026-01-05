// ==UserScript==
// @name         Steampunk Temptress Tracker
// @version      1.0
// @description  Keep log of steampunk temptress and obtain ratio of catches to misses in GT
// @author       Rani Kheir
// @match        *www.ghost-trappers.com/fb/hunt.php*
// @match        *www.ghost-trappers.com/fb/camp.php*
// @grant        none
// @namespace https://greasyfork.org/users/4271
// @downloadURL https://update.greasyfork.org/scripts/19189/Steampunk%20Temptress%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/19189/Steampunk%20Temptress%20Tracker.meta.js
// ==/UserScript==



(function() {
    'use strict';
    
    // variables for catches and misses
    var catchesSPT, missesSPT;
    
    // check if HTML5 localStorage is supported
    if(typeof Storage !== "undefined") {
        
        // if it is, check if a value does NOT exists for the key-value pair steamPunkCatchCount
        
        if (!localStorage.steamPunkCatchCount) {
            // if it doesn't exist, create them
            localStorage.steamPunkCatchCount = 0;
            localStorage.steamPunkMissCount = 0;
        } else {
            // else grab values and parse into ints
            catchesSPT = parseInt(localStorage.getItem("steamPunkCatchCount"));
            missesSPT = parseInt(localStorage.getItem("steamPunkMissCount"));
        }
    }
    
    if(window.location.href.indexOf("hunt.php") > -1) {
    
    // if first string logtext contains a steampunk
    if (document.getElementsByClassName("logText")[0].innerHTML.match(/Steampunk temptress/)) {
        if (document.getElementsByClassName("logText")[0].innerHTML.match(/You have successfully/)) {
            localStorage.steamPunkCatchCount = catchesSPT + 1;
            catchesSPT = parseInt(localStorage.getItem("steamPunkCatchCount"));
        } else {
            localStorage.steamPunkMissCount = missesSPT + 1;
            missesSPT = parseInt(localStorage.getItem("steamPunkMissCount"));
        }
    }
    
    // if second string logtext contains a steampunk and is friend or auto hunt
    if (document.getElementsByClassName("logText")[1].innerHTML.match(/Steampunk temptress/) && (
    document.getElementsByClassName("logText")[1].innerHTML.match(/Your friend/) ||
    document.getElementsByClassName("logText")[1].innerHTML.match(/Your automatic trap system has/))) {
        if (document.getElementsByClassName("logText")[1].innerHTML.match(/You have successfully/)) {
            localStorage.steamPunkCatchCount = catchesSPT + 1;
            catchesSPT = parseInt(localStorage.getItem("steamPunkCatchCount"));
        } else {
            localStorage.steamPunkMissCount = missesSPT + 1;
            missesSPT = parseInt(localStorage.getItem("steamPunkMissCount"));
        }
    }
    
    }
    
    var para = document.createElement("P");
    var lineBreak = document.createElement("BR");
    var t1 = document.createTextNode("Steampunk Tracker");
    var t2 = document.createTextNode("Catches: " + catchesSPT);
    var t3 = document.createTextNode("Misses: " + missesSPT);
    var ratioSPT = (100.0*catchesSPT/(missesSPT + catchesSPT)).toFixed(2);
    var t4;
    if (isNaN(ratioSPT)) {
        t4 = document.createTextNode("");
    } else {
        t4 = document.createTextNode("Ratio: " + ratioSPT + "%");
    }
    para.appendChild(t1);
    para.appendChild(document.createElement("BR"));
    para.appendChild(t2);
    para.appendChild(document.createElement("BR"));
    para.appendChild(t3);
    para.appendChild(document.createElement("BR"));
    para.appendChild(t4);
    
    para.style.color = "white";
    
    document.getElementsByClassName("rightBanners")[0].appendChild(para);
    
})();