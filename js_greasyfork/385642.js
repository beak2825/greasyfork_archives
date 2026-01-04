// ==UserScript==
// @name         Show APM in Replays
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @author       Oki
// @description  Show APM and Attack stats in Jstris replays
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385642/Show%20APM%20in%20Replays.user.js
// @updateURL https://update.greasyfork.org/scripts/385642/Show%20APM%20in%20Replays.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){
/**************************
 APM & Attack in Replays Script
**************************/

var website = "jstris.jezevec10.com"
var url = window.location.href
var parts = url.split("/")
var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}

Replayer["addStat"] = function(id,into) {
    var apmStat = document.createElement("tr");
    apmStat.innerHTML = '<td class="ter">APM</td><td class="sval"><span id="'+id+'">0</span></td>'
    into.appendChild(apmStat);
}


function addAPMelement(){
  console.log(this)

    //if ((this.g.GameStats.shown & 4) != 0) {
    //}

    if(parts[4]=="1v1"){
       var side = this.canvas.id.slice(-1)
       Replayer["addStat"]("apmElement"+side,document.getElementById("statTable"+side))

   } else {
       document.getElementsByClassName("ter")[2].innerHTML = "Attack"
       Replayer["addStat"]("apmElements",document.getElementById("statTable"))
   }
}


if(parts[3]=="replay" && parts[2].endsWith(website) && parts.length>4){

  var onCreate = View.prototype.onCreate.toString();
  onCreate =  trim(onCreate) + trim(addAPMelement.toString())
  View['prototype']["onCreate"] = new Function(onCreate);


  Replayer['prototype']['getAPM'] = function() {
      return ((this['gamedata']['linesSent'] / (this['clock'] / 6000))*10).toFixed(2)
  };


  var oldTextBar = View.prototype.updateTextBar.toString();
  oldTextBar = trim(oldTextBar) + ';var cat = this.canvas.id.slice(-1);eval("apmElement"+cat+"&&(apmElement"+cat+".innerHTML = this.g.getAPM())");'


  View.prototype.updateTextBar = new Function(oldTextBar);
  View.prototype.onCreate = new Function(onCreate)
}



    });
})();