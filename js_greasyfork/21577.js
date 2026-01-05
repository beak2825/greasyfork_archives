// ==UserScript==
// @name        Cpubenckmark.net FIlter
// @namespace   condorianocpubenchmark.net
// @description Adds ability to filter CPU by name, price range and score range on cpubenchmark.net
// @version     0.1
// @author      condoriano
// @include     http://www.cpubenchmark.net/high_end_cpus.html*
// @include     http://www.cpubenchmark.net/mid_range_cpus.html*
// @include     http://www.cpubenchmark.net/midlow_range_cpus.html*
// @include     http://www.cpubenchmark.net/low_end_cpus.html*
// @include     http://www.cpubenchmark.net/common_cpus.html*
// @include     http://www.cpubenchmark.net/overclocked_cpus.html
// @include     http://www.cpubenchmark.net/multi_cpu.html*
// @include     http://www.cpubenchmark.net/singleThread.html
// @include     http://www.cpubenchmark.net/socketType.html
// @include     http://www.cpubenchmark.net/laptop.html
// @include     http://www.cpubenchmark.net/power_performance.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21577/Cpubenckmarknet%20FIlter.user.js
// @updateURL https://update.greasyfork.org/scripts/21577/Cpubenckmarknet%20FIlter.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var i = 0;
	var style = document.createElement('style');
	style.innerHTML = '#filterDiv input[type="number"] { width: 60px; } #filterDiv .filter { display: inline-block; min-width: 33%; margin: 3px 0px; } #filterDiv .full { width: 100%; text-align: center; }';
	document.head.appendChild(style);

	var filterDiv = document.createElement('div');
	filterDiv.id = 'filterDiv';
	filterDiv.style = 'background-color: #FFFF77; width: 700px; margin: 10px auto 30px; border: 1px dashed #FF7777; padding: 6px 12px; font-family: Tahoma; color: #222; font-size: 13px;';
	filterDiv.innerHTML += '<div style="font-size: 18px; font-family: Georgia; padding: 3px 0px; text-align: center; margin-bottom: 8px; background-color: #FFAA33;">Filters</div>\
<form name="tablefilter"><div class="filter full">Name: <select name="namemode"><option value="show">Show</option><option value="hide">Hide</option> </select> <input name="name" type="text" placeholder="Accepts multiple values (separate each with a comma)" style="width: 500px;"></div>\
<div class="filter">Price: <input name="pricemin" type="number" placeholder="min"> to <input name="pricemax" type="number" placeholder="max"></div>\
<div class="filter">Score: <input name="scoremin" type="number" placeholder="min"> to <input name="scoremax" type="number" placeholder="max"></div>\
<div class="filter" style="text-align: right;"><input style="background-color: #7F7; border: 1px solid #080; cursor: pointer;" type="submit" value="Apply Filter"> <input style="background-color: transparent; border: none; box-shadow: none; color: #F00; cursor: pointer;" type="reset" name="reset" value="Reset Filter"></div></form>';
	document.getElementsByClassName('chart')[0].parentElement.parentElement.insertBefore(filterDiv, document.getElementsByClassName('chart')[0].parentElement);

	document.forms.tablefilter.onsubmit = function(e) {
		document.activeElement.blur();
		e.preventDefault();
		var tables = document.querySelectorAll('table.chart'), filterNames = [];
		for(i = 0; i < tables.length; i++) {
			var row = tables[i].tBodies[0].rows;
			for(var j = 1; j < row.length; j++) {
				row[j].style.display = '';
				filterNames = document.forms.tablefilter.elements.name.value.replace(/[ , ]+/g, ',').split(',');
				if(filterNames.length && document.forms.tablefilter.elements.name.value) {
					if(document.forms.tablefilter.elements.namemode.value == 'show') row[j].style.display = 'none';
					else row[j].style.display = '';
					for(var k = 0; k < filterNames.length; k++) {
						if(filterNames[k] === '') continue;
						if(document.forms.tablefilter.elements.namemode.value == 'show') { if(row[j].cells[0].children[0].innerHTML.toLowerCase().indexOf(filterNames[k].toLowerCase()) != -1) row[j].style.display = ''; }
						else { if(row[j].cells[0].children[0].innerHTML.toLowerCase().indexOf(filterNames[k].toLowerCase()) != -1) row[j].style.display = 'none'; }
					}
				}
				var pMin, pMax;
				if(document.forms.tablefilter.elements.pricemin.value && document.forms.tablefilter.elements.pricemax.value) {
					pMin = document.forms.tablefilter.elements.pricemin.value;
					pMax = document.forms.tablefilter.elements.pricemax.value;
					var price = parseFloat(row[j].cells[2].children[0].innerHTML.replace(/[^0-9.]/g, ''));
					if(price < pMin || price > pMax || !price) row[j].style.display = 'none';
				}
				var sMin, sMax;
				if(document.forms.tablefilter.elements.scoremin.value && document.forms.tablefilter.elements.scoremax.value) {
					sMin = document.forms.tablefilter.elements.scoremin.value;
					sMax = document.forms.tablefilter.elements.scoremax.value;
					var score = parseFloat(row[j].cells[1].children[0].textContent.replace(/[^0-9.]/g, ''));
					if(j < 10) console.log(sMin + ', ' + sMax);
					if(score < sMin || score > sMax) row[j].style.display = 'none';
				}
			}
		}
	};

})();
