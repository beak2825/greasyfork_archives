// ==UserScript==
// @name         GGn G/h calculator
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  adds a gold/h calculator to torrents descriptions
// @author       birculomon
// @match        https://gazellegames.net/torrents.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406422/GGn%20Gh%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/406422/GGn%20Gh%20calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateGold(goldNode, percentage, numberNode = undefined) {
        var updatedValue = (Math.round(goldNode.originalValue * percentage * Math.pow(10,8)) / Math.pow(10,8)).toString();
        goldNode.innerHTML = updatedValue;
        console.log(numberNode);
        if (numberNode !== undefined) {
            console.log(numberNode);
            numberNode.valueAsNumber = percentage * 100;
        }
    }
    var goldNodes = document.querySelectorAll("#gold_amt");
    goldNodes.forEach(function(goldNode) {
        goldNode.originalValue = parseFloat(goldNode.innerHTML.replace(/,/g,''));
        var parent = goldNode.parentNode;
        console.log(goldNode);
        console.log(parent);
        var ref = goldNode.nextElementSibling.nextElementSibling.nextSibling;
        var br = document.createElement("br");
        var button2 = document.createElement("input");
        button2.setAttribute("type", "button");
        button2.setAttribute("value", "2%");
        var button5 = document.createElement("input");
        button5.setAttribute("type", "button");
        button5.setAttribute("value", "5%");
        var button40 = document.createElement("input");
        button40.setAttribute("type", "button");
        button40.setAttribute("value", "40%");
        var buttonR = document.createElement("input");
        buttonR.setAttribute("type", "button");
        buttonR.setAttribute("value", "reset");
        var numberCustom = document.createElement("input");
        numberCustom.setAttribute("type", "number");
        numberCustom.setAttribute("value", "100");
        numberCustom.setAttribute("min", "1");
        numberCustom.setAttribute("max", "100");


        button2.addEventListener("click", function(){updateGold(goldNode, 0.02, numberCustom);});
        button5.addEventListener("click", function(){updateGold(goldNode, 0.05, numberCustom);});
        button40.addEventListener("click", function(){updateGold(goldNode, 0.40, numberCustom);});
        buttonR.addEventListener("click", function(){updateGold(goldNode, 1, numberCustom);});
        numberCustom.addEventListener("change", function(){updateGold(goldNode, numberCustom.valueAsNumber / 100);});

        parent.insertBefore(br, ref);
        parent.insertBefore(button2, ref);
        parent.insertBefore(button5, ref);
        parent.insertBefore(button40, ref);
        parent.insertBefore(buttonR, ref);
        parent.insertBefore(numberCustom, ref);
    });
}
)();