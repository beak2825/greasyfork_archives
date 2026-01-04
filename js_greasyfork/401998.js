// ==UserScript==
// @name        Dragalia Lost DPS Sim Enhancer
// @namespace   dragaliadpssimenhancer
// @description Script for DL DPS Sim https://mushymato.github.io/dl-sim-vue/
// @include     https://mushymato.github.io/dl-sim-vue/*
// @version     1.1
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/401998/Dragalia%20Lost%20DPS%20Sim%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/401998/Dragalia%20Lost%20DPS%20Sim%20Enhancer.meta.js
// ==/UserScript==

var ele = document.getElementsByClassName('dps-holder');

for (var i = ele.length - 1; i >= 0; i--) {
	totalcolor = ele[i].getElementsByClassName('dps-progress')[0].getElementsByClassName('factor').length
	totaldps= parseInt(ele[i].querySelectorAll( '.full:not(.non-condition-dps) b' )[0].innerHTML)
	for (var i2 = totalcolor - 1; i2 >= 0; i2--) {
ele[i].querySelectorAll('.popper.dps-details')[0].childNodes[i2].innerHTML = ele[i].querySelectorAll('.popper.dps-details')[0].childNodes[i2].innerHTML + ' (' + ((ele[i].querySelectorAll('.popper.dps-details')[0].childNodes[i2].innerText.replace(', ', '').split(":")[1].trim() * 100) / totaldps).toFixed(2) + '%)'
	}
	
}