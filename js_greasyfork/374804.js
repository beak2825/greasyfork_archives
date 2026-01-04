// ==UserScript==
// @name         Redacted :: Target Ratio Maximum Bounty Calculator
// @namespace    https://greasyfork.org/en/scripts/374804-redacted-target-ratio-maximum-bounty-calculator
// @version      1.0
// @description  Adds a row to enter a target ratio and calculate the maximum bounty that can be added to the request.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/requests\.php\?action=(new(&groupid=\d+)?|view&id=\d+)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374804/Redacted%20%3A%3A%20Target%20Ratio%20Maximum%20Bounty%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/374804/Redacted%20%3A%3A%20Target%20Ratio%20Maximum%20Bounty%20Calculator.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var vote = /action=new/.test(location.href) ? false : true;
	var upload = document.querySelector('input#current_uploaded').value;
	var download = document.querySelector('input#current_downloaded').value;
	var hook = vote ? document.querySelector('input#amount').parentNode.parentNode.parentNode : document.querySelector('input#amount').parentNode.parentNode;
	var bountyBox = document.querySelector('input#amount_box');
	var previewButton = document.querySelector('tr#voting > td > input[type=button]');
	var targetRatioTR = document.createElement('tr');
	var targetRatioTDL = document.createElement('td');
	targetRatioTDL.classList.add('label');
	targetRatioTDL.innerHTML = 'Target ratio';
	targetRatioTR.appendChild(targetRatioTDL);
	var targetRatioTD = document.createElement('td');
	var targetRatioBox = document.createElement('input');
	targetRatioBox.type = 'text';
	targetRatioBox.id = 'target_ratio';
	targetRatioBox.size = 8;
	targetRatioBox.value = null;
	targetRatioTD.appendChild(targetRatioBox);
	var targetRatioButton = document.createElement('input');
	targetRatioButton.type = 'button';
	targetRatioButton.value = 'Calculate';
	targetRatioTD.appendChild(targetRatioButton);
	targetRatioTR.appendChild(targetRatioTD);
	hook.parentNode.insertBefore(targetRatioTR, hook);
	targetRatioButton.addEventListener('click', function() {
		var targetRatio = targetRatioBox.value, targetBounty;
		if (isNaN(targetRatio) || targetRatio < 0 || targetRatio >= (upload / download)) {
			targetRatioBox.value = null;
			targetBounty = vote ? null : 100;
		} else {
			targetBounty = Math.trunc((upload - (targetRatio * download)) / 1048576);
		}
		document.querySelector('select#unit').selectedIndex = 0;
		bountyBox.value = targetBounty;
		previewButton.click();
	});
})();