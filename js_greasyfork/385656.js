// ==UserScript==
// @name         Blocks per B2B Script
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Shows a ratio of Blocks/B2B
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385656/Blocks%20per%20B2B%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385656/Blocks%20per%20B2B%20Script.meta.js
// ==/UserScript==

/**************************
   Blocks per B2B Script
**************************/

var STAT_POS = 990;

(function() {
    window.addEventListener('load', function(){

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}

var readyGoFunc = Game['prototype']["startReadyGo"].toString()
var queueBoxFunc = Game['prototype']['updateQueueBox'].toString()

readyGoFunc = "this['GameStats'].addStat(new StatLine('BPBB', 'B2B', "+STAT_POS+"),true);" + trim(readyGoFunc)
queueBoxFunc = "stat=this['placedBlocks']/this['gamedata']['B2B'];if(this['GameStats'].get('BPBB'))this['GameStats'].get('BPBB').set((stat==Infinity||isNaN(stat))?('∞'):(stat.toFixed(2)));" + trim(queueBoxFunc);

Game['prototype']["startReadyGo"] = new Function(readyGoFunc);
Game['prototype']["updateQueueBox"] = new Function(queueBoxFunc);

    });
})();