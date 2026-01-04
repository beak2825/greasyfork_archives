// ==UserScript==
// @name         NEGATIVE HIGHLIGHTERRR
// @namespace    http://tishka.xyz
// @version      0.1
// @description  highlights playerrr with negative(positive?) stat
// @author       Tishka
// @match        https://marketing-jet.lux-casino.co/*
// @match        https://marketing-sol.lux-casino.co/*
// @match        https://marketing-rox.lux-casino.co/*
// @match	     https://marketing.lux-casino.co/*
// @match		 https://marketing-fresh.lux-casino.co/*
// @match		 https://marketing-izzi.lux-casino.co/*
// @icon         https://www.google.com/s2/favicons?domain=lux-casino.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440359/NEGATIVE%20HIGHLIGHTERRR.user.js
// @updateURL https://update.greasyfork.org/scripts/440359/NEGATIVE%20HIGHLIGHTERRR.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let stat = document.querySelectorAll(".col.col-potracheno_v_kazino")[1].innerText;
	if(Number(parseInt(stat) < 0))
	{
		// alert("Плюсовой");
		document.getElementById("page_title").innerHTML += ` <b style="color:red;font-size: 200%;">[ПЛЮСОВОЙ] </b>`;
	}
	// Your code here...
})();