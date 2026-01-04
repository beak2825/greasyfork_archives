// ==UserScript==
// @name         T-Waste Script
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  shows what percent of T pieces were wasted (not used in a t-spin)
// @author       Oki, jez
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385648/T-Waste%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385648/T-Waste%20Script.meta.js
// ==/UserScript==

/**************************
     T-Waste Script
**************************/

var STAT_POS = 1000; //sorting priority for the stat position (1000=always last), default stats have order from 0 and increments of 10

(function() {
    window.addEventListener('load', function(){

var spins = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","TSPIN_DOUBLE","TSPIN_TRIPLE"]

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}

Game['bad'] = [0,0]

var queueBoxFunc = Game['prototype']['updateQueueBox'].toString()
var lineClearsFunc = Game['prototype']['checkLineClears'].toString()
var placeBlockFunc = Game['prototype']["placeBlock"].toString()
var readyGoFunc = Game['prototype']["startReadyGo"].toString()

var params2 = getParams(placeBlockFunc)

placeBlockFunc = "if(this['activeBlock'].id==2){Game['bad'][0]++};" + trim(placeBlockFunc)
spins.map(x=>{lineClearsFunc=lineClearsFunc.replace(x+")",x+");Game['bad'][1]++;")})

var append = "setTimeout(x=>{Game['bad'][0]=0;Game['bad'][1]=0},100);this['GameStats'].addStat(new StatLine('TWASTE', '🗑️T', "+STAT_POS+"),true);"
var append2 = "if(this['GameStats'].get('TWASTE'))this['GameStats'].get('TWASTE').set((Game['bad'][0]+Game['bad'][1])?(((Game['bad'][0]-Game['bad'][1])/(Game['bad'][0])).toFixed(2)+' '+(Game['bad'][0]-Game['bad'][1])+'/'+(Game['bad'][0])):(0));"
readyGoFunc = append + trim(readyGoFunc)
queueBoxFunc = append2 + trim(queueBoxFunc)

Game['prototype']["updateQueueBox"] = new Function(queueBoxFunc);
Game['prototype']["placeBlock"] = new Function(...params2, placeBlockFunc);
Game['prototype']["checkLineClears"] = new Function(trim(lineClearsFunc));
Game['prototype']["startReadyGo"] = new Function(readyGoFunc);

})})()