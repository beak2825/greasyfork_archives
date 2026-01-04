// ==UserScript==
// @name         auto-localstorage-clearer-and-step-parser
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Clear localstorage so you can use the show work button unlimited times. And lay out the shown work for easy copy paste. I wrote this for personal use so updates may be uncommon.
// @author       pigPen6969 
// @match        https://www.mathpapa.com/algebra-calculator.html
// @match        http://www.mathpapa.com/algebra-calculator.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420761/auto-localstorage-clearer-and-step-parser.user.js
// @updateURL https://update.greasyfork.org/scripts/420761/auto-localstorage-clearer-and-step-parser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var funcc = function(){
     localStorage.clear();
     var allCookies = document.cookie.split(';');

      for (var i = 0; i < allCookies.length; i++) {
         document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
        }
        var f = function(){
            var fm = document.getElementsByTagName("math");
            for (var i in fm){
                if (fm[i].getAttribute != undefined){
                    document.getElementById("solout3").innerHTML +=fm[i].getAttribute("alttext").replaceAll("\\cl", "").replaceAll("green", "").replaceAll("blue", "").replaceAll("{", "").replaceAll("}", "").replaceAll("\\", "").replaceAll(",", "").trim().replaceAll("  ", " ").replaceAll("  ", " ").replaceAll("text", "").replaceAll("'", "") + "<br>";
                }}
        }
         if (document.getElementById("solstepshowlink") != undefined){
             document.getElementById("solstepshowlink").onclick = f;
         }

        var buttonEl = document.createElement("a");
        buttonEl.href = "#";
        buttonEl.onclick = funcc;
        buttonEl.innerHTML = "REVEAL COPY PASTE";


        }
    if (document.getElementById("parse_btn") != undefined){
 document.getElementById("parse_btn").onclick = funcc;
    }


})();