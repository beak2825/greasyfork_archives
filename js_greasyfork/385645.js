// ==UserScript==
// @name         Remaining Players Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows number of remaining players
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385645/Remaining%20Players%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385645/Remaining%20Players%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){


/**************************
 Remaining Players Script
**************************/

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}
if(typeof Game != "undefined"){

var aliveHold=document.createElement("div");
aliveHold.id="aliveHolder";
aliveHold.style.position="absolute"
aliveHold.style.left = (myCanvas.getBoundingClientRect().left - 200) + "px";
aliveHold.style.top = (myCanvas.getBoundingClientRect().top + 400) + "px";
document.body.appendChild(aliveHold);

var f='<div id="lrem"><div id="aliveNum"></div></div><div id="sprintText"><div id="stLrem" style="display: block;">opponents remaining</div></div>'
aliveHolder.innerHTML = f
aliveHolder.style.display='none'

var printAlive = SlotView['prototype']['printSlotPlace'].toString()
var printAliveParams = getParams(printAlive);
printAlive = `aliveHolder.style.display='block';aliveNum.innerHTML=parseInt(this['slot']['gs']['p']['getPlaceColor'](${printAliveParams[0]})['str'])-1;` + trim(printAlive)
SlotView['prototype']['printSlotPlace'] = new Function(...printAliveParams, printAlive);

var readyGoAlive = Game['prototype']['restart'].toString()
readyGoAlive = "if(this['pmode']+this['isPmode'](true)+this['isPmode'](false)==0){aliveHolder.style.display='block';aliveNum.innerHTML='all'};" + trim(readyGoAlive)
Game['prototype']['restart'] = new Function(readyGoAlive);

}

    });
})();
