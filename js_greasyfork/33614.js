// ==UserScript==
// @name         Gazelle_Projectathon
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  try to take over the world!
// @author       You
// @match        https://ehealthsuisse.ihe-europe.net/gazelle/testing/test/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33614/Gazelle_Projectathon.user.js
// @updateURL https://update.greasyfork.org/scripts/33614/Gazelle_Projectathon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //debugger;
   var numbers = "36483,36429,36444,36488,36536,36442,36553,36536";
   var patterns = numbers.split(',');
   var targetId = "";

   var divs = document.getElementsByTagName("a");
   for (var i = 0; i < divs.length; i++) {
        for (var j = 0; j < patterns.length; j++) {
            var index = divs[i].innerText.toLowerCase().indexOf(patterns[j]);
            if (index != -1) {
                //divs[i].style.backgroundColor= "lightgreen";
                //var divElement = divs[i];
                blink(divs[i]);
                break;
            }else{
                var tooltip = divs[i].parentElement.getAttribute("data-tooltip");
                if (tooltip){
                     var indexTooltip = divs[i].parentElement.getAttribute("data-tooltip").toLowerCase().indexOf("partially verified");
                     if (indexTooltip != -1) {
                        divs[i].style.backgroundColor= "#a8d8a8";
                     }
                }

            }
        }
    }
})();

function blink(divElement)
		{
            divElement.style.fontWeight = "bold";
             setInterval(function () {
                    if (divElement.style.backgroundColor != "lightgreen"){
                        divElement.style.backgroundColor = "lightgreen";
                    }else{
                        divElement.style.backgroundColor = "greenyellow";
                    }
                }, 500);
        }