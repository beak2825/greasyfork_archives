// ==UserScript==
// @name         Gewinnrechner
// @namespace    http://tampermonkey.net/
// @version      2024-09-29
// @description  Calculates the return of investment in CSGOEmpire Cases.
// @author       Karlich Vivil
// @match        https://csgoempire.com/cases/open/*
// @icon         data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAACoSURBVChTY8ACGEEAyoaDB4Wq/ydob4iSh/KRwdkM5f9tmh+rNf83ar0uV4OKwsH/Xu1vNepAxscqTRC3Q9tKngcsAwb/a7W/FKv9alL716X+rU39e706UANUTk2E/X+nzlMV1Uesyg8ZFW+yKX+K0ZgfKguVtpTl+j9d73+Pxv9u9R/N6v8nanypA1mEANL87FdzlP83avxv1XharMrGwgyVoAAwMAAA/+g4SkgEhn8AAAAASUVORK5CYII=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510814/Gewinnrechner.user.js
// @updateURL https://update.greasyfork.org/scripts/510814/Gewinnrechner.meta.js
// ==/UserScript==

(function() {
    'use strict';

	let run = function () {
		console.log("start");

		let cost = parseFloat([...document.getElementsByClassName('flex flex-col items-start justify-center gap-md')[0]
								.getElementsByClassName('font-numeric inline-flex items-baseline justify-center text-medium font-bold text-light-1')[0]
								.getElementsByTagName('span')].filter(x=>x.textContent !== '')[0]
							 .textContent.replace(',', '.').replace(' ', ''));
		console.log(cost);

		let prices = [...document.getElementsByClassName('case-items-grid')[0].children]
			.map(x=>parseFloat([...x.getElementsByClassName('font-numeric inline-flex items-baseline justify-center text-medium font-bold text-light-1')[0]
											.getElementsByTagName('span')]
										 .filter(y=>y.textContent !== '')[0]
										 .textContent.replace(',', '.').replace(' ', '')
										)
					);
		let chances = [...document.getElementsByClassName('case-items-grid')[0].children].map(x=>Number(x.getElementsByClassName('size-medium px-xs')[0].textContent.replace(',', '.').replace('%', '').replace(' ', '')))
		console.log(prices);
		console.log(chances);

		let values = [];
		for (let i = 0; i < prices.length; i++) {
  		values[i] = (prices[i] * chances[i]) / 100
		}
		console.log(values);
		let erg = values.reduce((sum, value) => sum + value, 0).toFixed(2);
		let returnOfInvestment = (erg / cost * 100).toFixed(2);
		console.log(erg);
		console.log(returnOfInvestment);

		let titelContainer = document.createElement('div');
		titelContainer.style.fontSize = "large";
		titelContainer.style.fontWeight = 'Bold';

		titelContainer.innerHTML = `${erg} / ${returnOfInvestment}%`

		let target = document.getElementsByClassName('mb-lg flex flex-col-reverse justify-between gap-md sm:flex-row')[0];

		target.insertBefore(titelContainer, target.firstChild.nextSibling);

}

	setTimeout(run, 2500);


})();