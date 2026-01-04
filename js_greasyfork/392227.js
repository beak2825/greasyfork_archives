// ==UserScript==
// @name         Sent lines in Replays Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows amount of sent lines in 1v1 replays
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392227/Sent%20lines%20in%20Replays%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/392227/Sent%20lines%20in%20Replays%20Script.meta.js
// ==/UserScript==

/**************************
Sent lines in Replays Script
**************************/

(function() {
    window.addEventListener('load', function(){

if(typeof Game == "undefined" && typeof Replayer != "undefined") {

	var website = "jstris.jezevec10.com"
	var url = window.location.href
	var parts = url.split("/")
	
	Replayer["addStat3"] = function(id,into) {
	    var apmStat = document.createElement("tr");
	    apmStat.innerHTML = '<td class="ter">Sent</td><td class="sval"><span id="'+id+'">0</span></td>'
	    into.insertBefore(apmStat, into.childNodes[2]);
	}

	if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}
	var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
	
	if(parts[3]=="replay" && parts[2].endsWith(website) && parts.length>4 && parts[4]=="1v1"){

	    Replayer["addStat3"]("countElement2",document.getElementsByTagName("tbody")[0])
	    Replayer["addStat3"]("countElement1",document.getElementsByTagName("tbody")[2])

	   var oldTextBar = View.prototype.updateTextBar.toString();
	   oldTextBar = trim(oldTextBar) + `;var cat2 = this.kppElement.id.slice(-1);eval("countElement"+cat2+"&&(countElement"+cat2+".innerHTML = (this.g.gamedata.linesReceived))");`
	   View.prototype.updateTextBar = new Function(oldTextBar);
	}
}

    });
})();