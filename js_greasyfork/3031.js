// ==UserScript==
// @name        Dotlan+
// @namespace   armeagle.nl
// @include     http://evemaps.dotlan.net/npc/*/stations-ballalalalalalal
// @version     1
// @description Eve Dotlan enhancements
// @downloadURL https://update.greasyfork.org/scripts/3031/Dotlan%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/3031/Dotlan%2B.meta.js
// ==/UserScript==

// @include     http://evemaps.dotlan.net/svg/*
//var systems = document.querySelectorAll('#sysuse > use');
//for (index = 0; index < systems.length; index++) {
//	var system = systems[index];
//	var systemDef = system.getAttribute('id').replace('sys', '#def');
	
//	var systemDef = document.querySelector(systemDef);
//	var systemName = systemDef.querySelector('a > text.ss').textContent;
//	systemUrl = 'http://evemaps.dotlan.net/system/' + systemName;
//	console.log(systemUrl);
//}

stationRowList = document.querySelectorAll('#inner > table.tablelist > tbody > tr');

for (index = 0; index < stationRowList.length; index++) {
	var stationRow = stationRowList[index];
	
	(function() {
	
	var systemTd = stationRow.querySelector('td:nth-child(2)');
	var systemUrl = systemTd.querySelector('a').getAttribute('href').replace(/map\/[^\/]+/, 'system');
		
	var req = new XMLHttpRequest();
	req.onload = function(e) {
		console.log(index, e, req);
		var text = req.responseText.replace(/^(.*\n)*.*<html/i, "<html").replace(/<\/html>(.*\n)*.*$/i, "</html>");
		
		var contain = document.createElement('div');
		contain.innerHTML = text;
		
		if (contain.querySelectorAll('b > span').length > 0) {
			systemTd.appendChild(document.createTextNode(' ** ice **'));
		}
	};
	
	req.open('GET', systemUrl, true);
	req.send();
	})();
}