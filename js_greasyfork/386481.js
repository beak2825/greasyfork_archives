// ==UserScript==
// @name         Show lineclear types
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Oki
// @description  Counts and displays all types of lineclears
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386481/Show%20lineclear%20types.user.js
// @updateURL https://update.greasyfork.org/scripts/386481/Show%20lineclear%20types.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){
/**************************
 Show lineclear types Script
**************************/


Game["refreshTable"] = function(object) {
	var old = document.getElementById("gdHolder");
	old&&(old.parentNode.removeChild(old))
	var fgd = '<style>#gdT {border-collapse:collapse;text-align:left}.gd {border:1px solid white;padding:5px}</style><table id="gdT">'

	if(!object)return;
	var gdHold=document.createElement("div");
	gdHold.id="gdHolder";
	gdHold.style.position="absolute"
	gdHold.style.left = (myCanvas.getBoundingClientRect().left - 300) + "px";
	gdHold.style.top = (myCanvas.getBoundingClientRect().top + 50) + "px";
	document.body.appendChild(gdHold);

	var ordered = {};
	Object.keys(object).sort().forEach(function(key) {
	  ordered[key] = object[key];
	});

	var keys = Object.keys(ordered)

	for (var i = 0; i < keys.length; i++) {
		var key=keys[i]
		var add=[key,ordered[key]]
		fgd+=`<tr><td class="gd">${add[0]}</td><td class="gd">${add[1]}</td></tr>`
	}

	gdHolder.innerHTML = fgd+"</table>"
}


var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

window.events = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","CLEAR1","TSPIN_DOUBLE","CLEAR2","TSPIN_TRIPLE","CLEAR3","CLEAR4","PERFECT_CLEAR"]

var rgFunc = Game['prototype']['readyGo'].toString()
rgFunc="gd={};com=-1;Game['refreshTable']();"+trim(rgFunc);
Game['prototype']["readyGo"] = new Function(rgFunc);

var clcFunc = Game['prototype']['checkLineClears'].toString()
events.map((x,i)=>{clcFunc=clcFunc.replace(x+")",x+");gd['"+x+"']=~~gd['"+x+"']+1;oldcom=com;com=this['comboCounter'];if(com<0&&oldcom>=0){gd['combo'+oldcom]=~~gd['combo'+oldcom]+1};Game['refreshTable'](gd);");})
Game['prototype']["checkLineClears"] = new Function(trim(clcFunc));


    });
})();