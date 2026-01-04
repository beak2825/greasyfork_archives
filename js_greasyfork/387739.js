// ==UserScript==
// @name         Hold Stat Script
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Shows how often hold was used
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387739/Hold%20Stat%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/387739/Hold%20Stat%20Script.meta.js
// ==/UserScript==

/**************************
   Hold Stat Script
**************************/


(function() {
    window.addEventListener('load', function(){

var STAT_POS = 970;

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

if(typeof Game != "undefined"){

var readyGoFunc = Game['prototype']["startReadyGo"].toString()
var holdBlockFunc = GameCore['prototype']['holdBlock'].toString()

readyGoFunc = "holdStat=0;this['GameStats'].addStat(new StatLine('HOLD_FREQ', 'Hold', "+STAT_POS+"),true);" + trim(readyGoFunc)
holdBlockFunc = "if(!this['holdUsedAlready']&&(this['holdEnabled']==undefined||this['holdEnabled'])){holdStat++};if(this['GameStats'].get('HOLD_FREQ'))this['GameStats'].get('HOLD_FREQ').set(holdStat);" + trim(holdBlockFunc);

Game['prototype']["startReadyGo"] = new Function(readyGoFunc);
GameCore['prototype']['holdBlock'] = new Function(holdBlockFunc);

}




var website = "jstris.jezevec10.com"
var url = window.location.href
var parts = url.split("/")

if(typeof Replayer != "undefined"){
    Replayer["addStat"] = function(id,into) {
        var apmStat = document.createElement("tr");
        apmStat.innerHTML = '<td class="ter">Hold</td><td class="sval"><span id="'+id+'">0</span></td>'
        into.appendChild(apmStat);
    }
}

if(parts[3]=="replay" && parts[2].endsWith(website) && parts.length>4){

    var onLoad = ReplayController['prototype']['loadReplay'].toString()
    onLoad = trim(onLoad) + 'for(i=0;i<this["g"].length;i++)GameCore["holdTimestamps"+(this.g.length==1?"P":(i+1))]=this["g"][i]["actions"].filter(x=>x.a==10).map(x=>x.t);'
    ReplayController['prototype']['loadReplay'] = new Function(onLoad);

    if(parts[4]=="1v1"){
        Replayer["addStat"]("holdElement1",document.getElementsByTagName("tbody")[0])
        Replayer["addStat"]("holdElement2",document.getElementsByTagName("tbody")[2])

    } else {
        Replayer["addStat"]("holdElementP",document.getElementsByClassName("moreStats")[0])
    }

   Replayer['prototype']['getHold'] = function(cat) {
    if(stamps=GameCore["holdTimestamps"+cat]){
      for (var i = 0; i < stamps.length; i++) {
        if(stamps[i]>=this['clock']){
          return i
        }
      }
      return stamps.length
    }
    return 0
   };

   var oldTextBar = View.prototype.updateTextBar.toString();
   oldTextBar = trim(oldTextBar) + ';var cat = this.kppElement.id.slice(-1);eval("holdElement"+cat+"&&(holdElement"+cat+".innerHTML = this.g.getHold(cat))");'
   View.prototype.updateTextBar = new Function(oldTextBar);

}

    });
})();