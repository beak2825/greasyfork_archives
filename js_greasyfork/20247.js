// ==UserScript==
// @name         FoodBuyer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       IvanKalyada
// @match        http://cow-keeper-coin.com/food
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20247/FoodBuyer.user.js
// @updateURL https://update.greasyfork.org/scripts/20247/FoodBuyer.meta.js
// ==/UserScript==

if (window.location.href == "http://cow-keeper-coin.com/food") {
    var food = parseFloat(document.getElementsByClassName('input')[0].value);
    var buying = document.getElementsByClassName('btn normal currency bigger')[0];
    if (food > 1) {
        setTimeout(function(){ buying.click(); }, 5000);
    }
    else setTimeout(function(){location.reload()}, 20*60*1000);
}