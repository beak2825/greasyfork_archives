// ==UserScript==
// @name         AWSW better navigation
// @namespace    https://greasyfork.org/ru/users/303426
// @version      1.0.1
// @description  Make img fullsize and add navigations with ← → keys
// @author       Титан
// @match        https://angelswithscalywings.com/comics/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=angelswithscalywings.com
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/src/arrive.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507769/AWSW%20better%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/507769/AWSW%20better%20navigation.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var styles = `
    img {
    width: unset;
    }
`
	var styleSheet = document.createElement("style")
	styleSheet.textContent = styles
	document.head.appendChild(styleSheet)
	console.log("[AWSW BN] AWSW better navigation loded");

	document.arrive("div.comics-navigation", {onceOnly: false, existing: true},function(newElem) {
		console.log("[AWSW BN] comics-navigation arrived");
		addNavHotkeys(newElem);
	}, );

	function addNavHotkeys(comicsNavigation){
		console.log("[AWSW BN] injecting hotkeys of navigation");

		let comicNavChilds = comicsNavigation.children;
		//: buttons in comicsNavigation
		let firstPage = comicNavChilds[0];
		let prevPage = comicNavChilds[1];
		let nextPage = comicNavChilds[2];
		let lastPage = comicNavChilds[3];

		document.addEventListener('keydown', function(event) {
			if (event.key === 'ArrowRight') {
				//: if alt is holding
				if (event.altKey) {
					lastPage.click();
				}
				else {
					nextPage.click();
				}
			}

			if (event.key === 'ArrowLeft') {
				//: if alt is holding
				if (event.altKey) {
					firstPage.click();
				}
				else {
					prevPage.click();
				}
			}
		});
	}

})();