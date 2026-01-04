// ==UserScript==
// @name         B2B in Replays Script
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  shows amount of b2b per minute
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392226/B2B%20in%20Replays%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/392226/B2B%20in%20Replays%20Script.meta.js
// ==/UserScript==

/**************************
   B2B in Replays Script
**************************/

(function() {
    window.addEventListener('load', function(){

if(typeof Game == "undefined" && typeof Replayer != "undefined") {

	var website = "jstris.jezevec10.com"
	var url = window.location.href
	var parts = url.split("/")
	
	Replayer["addStat2"] = function(id,into) {
	    var apmStat = document.createElement("tr");
	    apmStat.innerHTML = '<td class="ter">B2Bpm</td><td class="sval"><span id="'+id+'">0</span></td>'
	    into.appendChild(apmStat);
	}

	if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}
	var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
	
	if(parts[3]=="replay" && parts[2].endsWith(website) && parts.length>4){
	
	    if(parts[4]=="1v1"){
	        Replayer["addStat2"]("countElement1",document.getElementsByTagName("tbody")[0])
	        Replayer["addStat2"]("countElement2",document.getElementsByTagName("tbody")[2])
	    } else {
	        Replayer["addStat2"]("countElementP",document.getElementsByClassName("moreStats")[0])
	    }
	
	   var oldTextBar = View.prototype.updateTextBar.toString();
	   oldTextBar = trim(oldTextBar) + `;var cat2 = this.kppElement.id.slice(-1);eval("countElement"+cat2+"&&(countElement"+cat2+".innerHTML = (this.g.gamedata.B2B/(this.g.clock/60000)).toFixed(2))");`
	   View.prototype.updateTextBar = new Function(oldTextBar);

	}
}

    });
})();