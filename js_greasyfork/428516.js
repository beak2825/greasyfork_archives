// ==UserScript==
// @name        Get Total Mb - newww.mx
// @namespace   Violentmonkey Scripts
// @match       http*://cliente.newww.mx/sitio/detalle_servicio/*
// @version     1.2
// @author      gogvale
// @description 6/26/2021, 5:52:12 PM
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/428516/Get%20Total%20Mb%20-%20newwwmx.user.js
// @updateURL https://update.greasyfork.org/scripts/428516/Get%20Total%20Mb%20-%20newwwmx.meta.js
// ==/UserScript==

function getTotalMb(){
	let totalMb = [...document.querySelectorAll('#tab-datos tbody td')]
	                .map(e =>  e.textContent)
	                .filter(e=>e.slice(-1)=='b')
	                .map(e=>parseFloat(e.replaceAll(', ','')))
	                .reduce((a,b)=>a+b);
	return Math.round(100*totalMb)/100;
}
function alertTotalMb(){
	alert(`Total: ${getTotalMb()}Mb`);
}

let button = document.createElement("Button");
button.innerHTML = "Calcular Mb";
button.style = "bottom:1em;right:1em;position:absolute;z-index: 9999";
button.className = "btn btn-primary";
button.addEventListener('click',alertTotalMb);
document.body.appendChild(button);