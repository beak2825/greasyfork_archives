// ==UserScript==
// @name         GSC Change4Life Rewards SHOW ODDS
// @namespace    principato
// @version      2020.12.01.1521
// @description  On Green Shield Canada's Change4Life Rewards page: Automatically show the odds of winning the prize per bid.
// @author       pprincipato
// @match        https://gsc-change4life.ca/rewards/
// @grant        none
// @run-at       document-idle
// @supportURL   https://github.com/principato/Userscripts/issue
// @downloadURL https://update.greasyfork.org/scripts/417315/GSC%20Change4Life%20Rewards%20SHOW%20ODDS.user.js
// @updateURL https://update.greasyfork.org/scripts/417315/GSC%20Change4Life%20Rewards%20SHOW%20ODDS.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var rewardElements = document.getElementsByClassName("tab-detail");

	for( var x=0; x< rewardElements.length; x++ ) {
		var rewardElement = rewardElements[x];
		var reward = rewardElement.id.match(/[0-9]+/)[0];
		var parent = rewardElement;
		var num = reward;
		var regexnum = /[0-9]+/g;
		var childDivs = parent.getElementsByClassName('col-lm-3 col-md-6');

		for( var i=0; i< childDivs.length; i++ ) {
			var childDiv0 = childDivs[i].getElementsByClassName('prizes')[0];
			var childDiv1 = childDivs[i].getElementsByClassName('info-1')[0];
			var childButton = childDivs[i].getElementsByClassName('bidding-bar')[0].getElementsByClassName('info-2 iframe-modal')[0];
			var prizes=childDiv0.textContent.match(regexnum)[0];
			var ballots=childDiv1.textContent.match(regexnum).slice(1).join("");
			var value=num;
			var cost=num;
			var odds=(prizes/ballots)
			var oddstext=(odds*100).toFixed(3) + "%";

			childButton.textContent = oddstext;
		}
	}
})();
