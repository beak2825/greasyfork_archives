// ==UserScript==
// @name         Attack Separator Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  separates attack into attack from self-created lines and attack from garbage lines
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387067/Attack%20Separator%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/387067/Attack%20Separator%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

/**************************
   Attack Separator Script
**************************/

var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}

if(typeof Game == "undefined"){

    var oldFunc2 = Replayer.prototype.checkLineClears.toString()
    oldFunc2 = "rows0=0;rows1=0;" + trim(oldFunc2)
    
    oldFunc2 = oldFunc2.split("=== 10){for(var ")
    var rowVar = oldFunc2[1].split("=")[1].split(";")[0]
    oldFunc2 = oldFunc2.join('=== 10){eval("rows"+ +(JSON.stringify(this.matrix['+rowVar+']).indexOf(8)<0)+"++");for(var ')
    
    var oldTextBar = View.prototype.updateTextBar.toString()
    oldTextBar = oldTextBar.replace("this.sentElement.innerHTML=this.g.gamedata.lines,","")
    oldTextBar = oldTextBar.replace("this.sentElement.innerHTML=this.g.gamedata.linesSent","")
    
    oldTextBar = trim(oldTextBar)
    
    oldFunc2 = oldFunc2.split("+=")
    var sum = oldFunc2[oldFunc2.length-1].split(";")[0]
    oldFunc2[oldFunc2.length-1] = sum+';distr=[rows1/(rows0+rows1),(rows0/(rows0+rows1))].map(x=>x*('+sum+'));var sentHTML=this.v.sentElement.innerHTML.split("/");if(sentHTML!=0){distr[0]+= +sentHTML[0];distr[1]+= +sentHTML[1]};this.v.sentElement.innerHTML=distr[0].toFixed(2)+" / "+distr[1].toFixed(2);' + oldFunc2[oldFunc2.length-1]
    oldFunc2 = oldFunc2.join`+=`
    
    View.prototype.onReady = function(){this.setupMode(),this.updateQueueBox(),this.redrawHoldBox(),this.clearMainCanvas(),this.sentElement.innerHTML=0}
    View.prototype.updateTextBar = new Function(oldTextBar);
    Replayer.prototype.checkLineClears = new Function(oldFunc2);

} else {

    var oldFunc = Game.prototype.checkLineClears.toString()
    oldFunc = "var rows0=0;var rows1=0;" + trim(oldFunc)
    
    oldFunc = oldFunc.split(")};for(")
    var rowVar = oldFunc[0].split("(")[oldFunc[0].split("(").length-1]
    oldFunc = oldFunc.join(')};eval("rows"+ +(JSON.stringify(this.matrix['+rowVar+']).indexOf(8)<0)+"++");var oldSent=this.gamedata.linesSent;for(')
    var split = oldFunc.split("> 0){this[_")
    var inject = 'var distr=[rows1/(rows0+rows1),(rows0/(rows0+rows1))].map(x=>x*(this.gamedata.linesSent-oldSent));var sentHTML=this.sentElement.innerHTML.split("/");if(sentHTML!=0){distr[0]+= +sentHTML[0];distr[1]+= +sentHTML[1]};this.sentElement.innerHTML=distr[0].toFixed(2)+" / "+distr[1].toFixed(2);'
    
    split[3] = split[3].replace("=","*/")
    split[3] = split[3].replace(")",");"+inject)
    for (var i = 0; i < split.length-1; i++) {
        split[i] += (i==2) ? "> 0){/*this[_" : "> 0){this[_"
    }
    
    oldFunc = split.join``
    Game.prototype.checkLineClears = new Function(oldFunc);
}

    });
})();