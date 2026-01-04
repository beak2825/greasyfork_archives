// ==UserScript==
// @name         Give Currency on Pokeclicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  touch the numbers (1,2,3,4,5,6) on your keyboard(not the numeric keypad) to gain the different Pokeclicker currency.
// @author       AyZz
// @match        https://www.pokeclicker.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokeclicker.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483496/Give%20Currency%20on%20Pokeclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/483496/Give%20Currency%20on%20Pokeclicker.meta.js
// ==/UserScript==

    document.addEventListener('keyup',function(evt){//You can change to the amount you want and/or change the way to activate it to your liking
    if(evt.keyCode==49){
    App.game.wallet.gainFarmPoints(10000)
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==50){
    App.game.wallet.gainQuestPoints(10000)
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==51){
    App.game.wallet.gainDungeonTokens(1000000)
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==52){
    App.game.wallet.gainDiamonds(100)
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==53){
    App.game.wallet.gainMoney(100000000)
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==54){
    App.game.wallet.gainBattlePoints(10000)
}});