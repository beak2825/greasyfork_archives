// ==UserScript==
// @name        MH - Marmotte - DLA rebours
// @namespace   MH
// @description Affiche un compte à rebours avant la prochaine DLA
// @include     */MH_Play/Play_action.php
// @include     */MH_Play/Play_menu.php
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     2.3
// @grant       none
// @require     https://greasyfork.org/scripts/24178-mh-h2p-code-mutualis%C3%A9?version=161949&d=.user.js
// @downloadURL https://update.greasyfork.org/scripts/21999/MH%20-%20Marmotte%20-%20DLA%20rebours.user.js
// @updateURL https://update.greasyfork.org/scripts/21999/MH%20-%20Marmotte%20-%20DLA%20rebours.meta.js
// ==/UserScript==

/*
 * Script MZ : Affiche un compte à rebours avant la prochaine DLA
 * Auteur : Bandedrubor (93138)
 * Contributeur : Vapulabehemot (82169)
 */

function isPage(url) {
	return window.location.pathname.indexOf("/mountyhall/" + url) == 0;
}

/* Lancement du script selon la page chargée */
if (isPage("MH_Play/Play_menu.php")) {
	alert('Après activation du "Compte à rebours de DLA" dans les "Options diverses" de "Options" > "Pack Graphique" sous MZ, vous pourrez supprimer ou désactiver ce script "MH - Marmotte - DLA rebours"');
	var mhTitle = window.top.document.title;
	var divInfo = document.evaluate('//div[@class="infoMenu"]',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	var divDLA = document.createElement('span');
	divDLA.setAttribute('style', 'cursor: pointer');
	divInfo.insertBefore(divDLA, document.evaluate('//br',divInfo,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue);
	divInfo.insertBefore(document.createElement('br'), divDLA);
	divInfo = divInfo.innerHTML;

	function displayTime() { 
		var dlaInfo = divInfo.match(/DLA:\s+(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/);
		var dlaDate = new Date(dlaInfo[3], dlaInfo[2]-1, dlaInfo[1], dlaInfo[4], dlaInfo[5], dlaInfo[6]);
		var mhDiff = window.localStorage['rebours_diff_time'];
		var dlaDiff = dlaDate.getTime() - (new Date()).getTime() - mhDiff;
		if (dlaDiff > 0) {
			var dlaTime = new Date(dlaDiff);
			var dlaHours = Math.floor(dlaDiff / 60 / 60 / 1000);
			var dlaMinutes = dlaTime.getUTCMinutes();
			if (dlaMinutes < 10) {
				dlaMinutes = '0' + dlaMinutes;
			}
			var dlaSeconds = dlaTime.getUTCSeconds();
			if (dlaSeconds < 10) {
				dlaSeconds = '0' + dlaSeconds;
			}
			var dlaTimeString = 'DLA dans : ' + dlaHours + ':' + dlaMinutes + ':' + dlaSeconds;
			var dlaTitleString = dlaHours + ':' + dlaMinutes + ':' + dlaSeconds;
		} else if (dlaDiff > -(5 * 60 * 1000)) {
			var dlaTime = new Date(-dlaDiff);
			var dlaMinutes = dlaTime.getUTCMinutes();
			var dlaSeconds = dlaTime.getUTCSeconds();
			if (dlaSeconds < 10) {
				dlaSeconds = '0' + dlaSeconds;
			}
			var dlaTimeString = 'Over-DLA : ' + dlaMinutes + ':' + dlaSeconds;
			var dlaTitleString = dlaMinutes + ':' + dlaSeconds + ' (Over-DLA)';
		} else {
			var dlaTimeString = 'Vous pouvez activer';
			var dlaTitleString = 'Vous pouvez activer';
			window.clearInterval(timer);
		}

		/* Affichage du compte à rebours */
		divDLA.innerHTML = dlaTimeString;
		document.title = dlaTitleString + ' - ' + mhTitle;
		if (window.localStorage['rebours_in_title']) {
			window.top.document.title = dlaTitleString + ' - ' + mhTitle;
		} else {
			window.top.document.title = mhTitle;
		}
	};
	var timer = window.setInterval(displayTime, 500);

	function changeDisplay() {
		window.localStorage['rebours_in_title'] = !window.localStorage['rebours_in_title'];
		displayTime();
	};
	divDLA.addEventListener('click', changeDisplay, true);
} else if (isPage("MH_Play/Play_action.php")) {
	var mhInfo = window.parent.parent.Main.Contenu.$("#hserveur").text().match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/);
	var mhDate = new Date(mhInfo[3], mhInfo[2]-1, mhInfo[1], mhInfo[4], mhInfo[5], mhInfo[6]);
	window.localStorage['rebours_diff_time'] = mhDate.getTime() - (new Date()).getTime();
}