// ==UserScript==
// @name         KPP2 Script
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  shows an alternate kpp excluding hold and counting 180 spins as 1 key
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395683/KPP2%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/395683/KPP2%20Script.meta.js
// ==/UserScript==

/**************************
      KPP2 Script      
**************************/

(function() {
    window.addEventListener('load', function(){


count_hold_as_keypress = true
STAT_POS = 990

var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

Game["keypressesMinus"] = 0;

var rotFunc = Game['prototype']['rotateCurrentBlock'].toString()
var holdFunc = GameCore['prototype']['holdBlock'].toString()
var readyGoFunc = Game['prototype']["startReadyGo"].toString()
var kppFunc = GameCore['prototype']['getKPP'].toString()

var rotParams = getParams(rotFunc)

rotFunc = rotFunc.replace("2:","(Game['keypressesMinus']++,2):")
if(!count_hold_as_keypress){
holdFunc = holdFunc.replace("++","++;Game['keypressesMinus']++;")
}
readyGoFunc = "this['GameStats'].addStat(new StatLine('KPPT', 'KPP2', "+STAT_POS+"),true);Game['keypressesMinus']=0;" + trim(readyGoFunc)


function kppAdd() {
    var kpp2 = 0;
    if (this['placedBlocks']) {
        kpp2 = (this['totalKeyPresses'] - Game["keypressesMinus"] + this['placedBlocks']) / this['placedBlocks']

    };
    if(this['GameStats'].get('KPPT'))this['GameStats'].get('KPPT').set(kpp2.toFixed(2));
};


GameCore['prototype']['getKPP'] = new Function(trim(kppAdd.toString()) + trim(kppFunc))
GameCore['prototype']['holdBlock'] = new Function(trim(holdFunc));
Game['prototype']['rotateCurrentBlock'] = new Function(...rotParams, trim(rotFunc));
Game['prototype']["startReadyGo"] = new Function(readyGoFunc);


})})()