// ==UserScript==
// @name         A岛Roll点
// @namespace    https://adnmb2.com
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://adnmb2.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405996/A%E5%B2%9BRoll%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/405996/A%E5%B2%9BRoll%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("A岛Roll点脚本 Start");
    function seedRandom(seed){
          var r = (seed * 9301 + 49297) % 233280;
          return r / 233280.0;
    }
    var tags = document.getElementsByClassName("h-threads-content");
    for(var i = 0;i<tags.length;i++){
        var tag = tags[i];
        var text = tag.innerHTML;
        var rolls = text.matchAll(/[1-9]D[0-9]+/g);
        var idElement = tag.parentElement.firstElementChild.getElementsByClassName("h-threads-info-id")[0];
        if(!idElement) continue;
        var idText = idElement.innerHTML;
        var idTextA = idText.split(".");
        if(idTextA.length != 2) continue;
        var seed = parseInt(idTextA[1]);
        var randomNumber = seedRandom(seed);
        for(var roll of rolls){
          if(roll){
            var rollText = roll[0];
            var rollTextA = rollText.split("D");
            if(rollTextA.length != 2) continue;
            var rollTime = rollText[0];
            var rollMax = rollTextA[1];
            var result = Math.ceil(rollMax * randomNumber);
            var resultText = `[${rollTime}d${rollMax}=<span style="color:red">${result}</span>]`;
            console.log(rollText,resultText);
            tag.innerHTML = tag.innerHTML.replace(rollText,resultText);
          }
        }
    }
})();