/* global W */
// ==UserScript==
// @name         UR-MP Save CSV
// @namespace    https://greasyfork.org/en/users/19426-bmtg
// @version      0.1
// @description  Adds a CSV export button to UR-MP
// @author       bmtg
// @match        http://*/*
// @include     https://editor-beta.waze.com/*editor/*
// @include     https://www.waze.com/*editor/*
// @exclude     https://www.waze.com/*user/editor/*
// @grant	   none
// @downloadURL https://update.greasyfork.org/scripts/18232/UR-MP%20Save%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/18232/UR-MP%20Save%20CSV.meta.js
// ==/UserScript==
/* jshint -W097 */

(function () {
	'use strict';
	
	function addURMPCSVButton() {
		if ($("#URMPCSVButton").length < 1) {
			var phWLContentHtml = $('<div><input class="btn btn-success btn-xs" id="URMPCSVButton" title="Save a CVS file of the stats data" type="button" value="Save CSV"><br></div>');
			$("#urmp-tabs-os").prepend(phWLContentHtml);
			$("#URMPCSVButton").click(function() {
				genCSV();
			});
		}
	}
	
	
	
	function bootstrapURMPCSV() {
		if ($("#urmp-tabstitle-stat") && $("#urmp-tabs-os") && $("#urmp-tabs-os").length > 0) {
			console.log('CSV: ID detected');
			$("#urmp-tabstitle-stat").click(function() {
				setTimeout(addURMPCSVButton,500);
				console.log('CSV Button added');
		
			});
		} else {
			setTimeout(bootstrapURMPCSV,500);
		}
		
	}
	
	setTimeout(bootstrapURMPCSV,2000);
	
	
	
	
	function genCSV() {
		var data = $('#urmpt-stats')[0].innerHTML;
		data=data.slice(data.indexOf('Per area:'));
		data=data.replace(/Per area\:<br><br><ul><\/ul><li>/,'');
		console.log(data);
		//data = data.replace(/<\/li><\/ol>/g,',');
		
		var parseOL = true;
		var startIX=0, stopIX, assembledString = '', tempString, remainingString = data;
		var findStr = '<li>';
		var wlpstop = 0;
		while (parseOL && wlpstop<20) {
			startIX = remainingString.indexOf('<ol>');
			if (startIX === -1) {
				assembledString = assembledString + remainingString;
				parseOL = false;
			} else {
				assembledString = assembledString + remainingString.substr(0,startIX);
				stopIX = remainingString.indexOf('</ol>');
				tempString = remainingString.substr(startIX,stopIX-startIX+5);
				tempString = tempString.replace(/<\/ol>$/,'');
				var lastIndex = 0;
				var count = 0;
				while (lastIndex !== -1) {
					lastIndex = tempString.indexOf(findStr,lastIndex);
					if (lastIndex !== -1) {
						count ++;
						lastIndex += findStr.length;
					}
				}
				
				
				for (var ii=0; ii<3-count; ii++) {
					tempString = tempString + 'None,';
				}
				assembledString = assembledString + tempString + '</ol>';
				remainingString = remainingString.substr(stopIX+5);
			}
			wlpstop ++;
			
		}
		
		assembledString = assembledString.replace(/\&nbsp;/g,'');
		assembledString = assembledString.replace(/<\/li><\/ol><\/li><li>/g,'|');
		assembledString = assembledString.replace(/<br>/g,',');
		
		
		assembledString = assembledString.replace(/<\/ol>/g,',');
		assembledString = assembledString.replace(/<\/li>/g,',');
		assembledString = assembledString.replace(/<ol>/g,',');
		assembledString = assembledString.replace(/<li>/g,',');
		assembledString = assembledString.replace(/,{2,}/g,',');
		assembledString = assembledString.replace(/,+$/g,'');
		assembledString = assembledString.split('|');
		console.log(assembledString);
		var assembledArray = [], tempSubArray = [];
		
		for (var jj=0; jj<assembledString[0].length; jj++) {
			tempSubArray = [];
			for (var kk=0; kk<assembledString.length; kk++) {
				tempSubArray.push(assembledString[kk].split(',')[jj]);
			}
			assembledArray.push(tempSubArray);
		}
		//assembledArray = transpose(assembledArray);
		
		
		
		
		data = assembledArray;
		var dataString;
		var csvContent = "data:text/csv;charset=utf-8,";
		data.forEach(function(infoArray, index){
		
		   dataString = infoArray.join(",");
		   csvContent += index < data.length ? dataString+ "\n" : dataString;
		
		}); 
		
		var encodedUri = encodeURI(csvContent);
		window.open(encodedUri);
	}




})();
