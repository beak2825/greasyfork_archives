// ==UserScript==
// @name         Redacted :: Request Bounty Target Calculator
// @namespace    https://greasyfork.org/en/scripts/375385-redacted-request-bounty-target-calculator
// @version      1.1
// @description  Adds panel on request creation/view pages to enter target values for bounty, ratio and buffer; calculates the proper bounty to add to meet each target.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/requests\.php\?action=(new(&groupid=\d+)?|view&id=\d+)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375385/Redacted%20%3A%3A%20Request%20Bounty%20Target%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/375385/Redacted%20%3A%3A%20Request%20Bounty%20Target%20Calculator.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var newRequest = /action=new/.test(location.href) ? true : false;
	if (!newRequest && document.querySelectorAll('input[type="submit"][value="Fill request"]').length == 0) return;
	//stop the script if the request is already filled

	var upload = parseFloat(document.querySelector('input#current_uploaded').value);
	var download = parseFloat(document.querySelector('input#current_downloaded').value);
	var ratio = parseFloat(document.querySelector('li#stats_ratio > span.stat').textContent);
	var reqRatio = parseFloat(document.querySelector('li#stats_required > span.stat').textContent);
	var hook = newRequest ? document.querySelector('input#amount').parentNode.parentNode : document.querySelector('input#amount').parentNode.parentNode.parentNode;
	var bountyBox = document.querySelector('input#amount_box');
	var previewButton = document.querySelector('tr#voting > td > input[type=button]');

	var currentBounty = newRequest ? '0 GB' : document.querySelector('td#formatted_bounty').textContent;
	var currentBountyConversion = {'MB': -1, 'GB': 0, 'TB': 1};
	var currentBountyUnits = currentBounty.split(' ')[1];
	var currentBountyGB = parseFloat(currentBounty.split(' ')[0]) * Math.pow(1024, currentBountyConversion[currentBountyUnits]);
	console.log("currentBountyGB: " + currentBountyGB);

	var requestTargetsTR = document.createElement('tr');
	var requestTargetsTDL = document.createElement('td');
	requestTargetsTDL.classList.add('label');
	requestTargetsTDL.innerHTML = 'Request Targets';
	requestTargetsTR.appendChild(requestTargetsTDL);
	var requestTargetsTD = document.createElement('td');
	requestTargetsTR.appendChild(requestTargetsTD);
	hook.parentNode.insertBefore(requestTargetsTR, hook);

	if (!newRequest) {
		requestTargetsTD.appendChild(document.createElement('b'));
		requestTargetsTD.lastChild.appendChild(document.createTextNode('Target bounty:'));
		requestTargetsTD.appendChild(document.createElement('br'));
		requestTargetsTD.appendChild(document.createElement('br'));
		var targetBountyBox = document.createElement('input');
		targetBountyBox.type = 'text';
		targetBountyBox.id = 'target_bounty';
		targetBountyBox.size = 8;
		targetBountyBox.value = null;
		requestTargetsTD.appendChild(targetBountyBox);
		requestTargetsTD.appendChild(document.createTextNode(' '));
		var targetBountyUnits = document.createElement('select');
		targetBountyUnits.id = 'bounty_unit';
		targetBountyUnits.name = 'unit';
		var targetBountyUnitsGB = document.createElement('option');
		targetBountyUnitsGB.value = 'gb';
		targetBountyUnitsGB.appendChild(document.createTextNode('GB'));
		targetBountyUnits.appendChild(targetBountyUnitsGB);
		var targetBountyUnitsTB = document.createElement('option');
		targetBountyUnitsTB.value = 'tb';
		targetBountyUnitsTB.appendChild(document.createTextNode('TB'));
		targetBountyUnits.appendChild(targetBountyUnitsTB);
		targetBountyUnits.selectedIndex = currentBountyUnits == 'TB' ? 1 : 0;
		requestTargetsTD.appendChild(targetBountyUnits);
		requestTargetsTD.appendChild(document.createTextNode(' '));
		var targetBountyButton = document.createElement('input');
		targetBountyButton.type = 'button';
		targetBountyButton.value = 'Calculate';
		requestTargetsTD.appendChild(targetBountyButton);
		requestTargetsTD.appendChild(document.createElement('br'));
		requestTargetsTD.appendChild(document.createElement('br'));
		targetBountyButton.addEventListener('click', function() {
			var targetBountyNew;
			console.log("targetBounty: " + targetBountyBox.value);
			if (isNaN(targetBountyBox.value) ||
				targetBountyBox.value * Math.pow(1024, targetBountyUnits.selectedIndex) <= currentBountyGB ||
				Math.trunc((targetBountyBox.value * Math.pow(1024, targetBountyUnits.selectedIndex)) - (currentBountyGB * 1024) > upload)
			   ) {
				targetBountyBox.value = null;
				targetBountyNew = null;
			} else {
				targetBountyNew = (targetBountyBox.value * Math.pow(1024, targetBountyUnits.selectedIndex)) - (currentBountyGB);
				console.log("targetBounty after math: " + targetBountyNew);
			}
			document.querySelector('select#unit').selectedIndex = 0;
			bountyBox.value = Math.trunc(targetBountyNew * 1024);
			previewButton.click();
			targetRatioBox.value = null;
			targetBufferBox.value = null;
		});
	}

	requestTargetsTD.appendChild(document.createElement('b'));
	requestTargetsTD.lastChild.appendChild(document.createTextNode('Target ratio:'));
	requestTargetsTD.appendChild(document.createElement('br'));
	requestTargetsTD.appendChild(document.createElement('br'));
	var targetRatioBox = document.createElement('input');
	targetRatioBox.type = 'text';
	targetRatioBox.id = 'target_ratio';
	targetRatioBox.size = 8;
	targetRatioBox.value = null;
	requestTargetsTD.appendChild(targetRatioBox);
	var targetRatioButton = document.createElement('input');
	targetRatioButton.type = 'button';
	targetRatioButton.value = 'Calculate';
	requestTargetsTD.appendChild(document.createTextNode(' '));
	requestTargetsTD.appendChild(targetRatioButton);
	requestTargetsTD.appendChild(document.createElement('br'));
	requestTargetsTD.appendChild(document.createElement('br'));

	targetRatioButton.addEventListener('click', function() {
		var targetRatio = targetRatioBox.value, targetBounty;
		if (isNaN(targetRatio) ||
			targetRatio < 0 ||
			targetRatio >= (upload / download)
		   ) {
			targetRatioBox.value = null;
			targetBounty = newRequest ? 100 : null;
		} else {
			targetBounty = Math.trunc((upload - (targetRatio * download)) / Math.pow(1024, 2));
		}
		document.querySelector('select#unit').selectedIndex = 0;
		bountyBox.value = targetBounty;
		previewButton.click();
		targetBountyBox.value = null;
		targetBufferBox.value = null;
	});

	function updateBuffer() {
		var currentBuffer = (upload / (document.querySelector('select#buffer_ratio').selectedIndex == 0 ? reqRatio : (document.querySelector('select#buffer_ratio').selectedIndex == 1 ? 0.6 : 1))) - download;
		console.log("currentBuffer: " + currentBuffer);
		var currentBufferUnits = ['B', 'KB', 'MB', 'GB', 'TB'];
		var currentBufferPower = Math.trunc(Math.log(currentBuffer) / Math.log(1024));
		console.log("currentBufferPower: " + currentBufferPower);
		var currentBufferUnit = currentBufferUnits[currentBufferPower];
		console.log("currentBufferUnit: " + currentBufferUnit);
		var currentBufferBase = Math.trunc(currentBuffer / Math.pow(1024, currentBufferPower) * 100) / 100;
		console.log("currentBufferBase: " + currentBufferBase);
		try {
			var currentBufferText = document.querySelector('span#current_buffer');
			currentBufferText.textContent = '(Current buffer is ' + currentBufferBase + ' ' + currentBufferUnit;
			currentBufferText.textContent +=
				' for ' + (document.querySelector('select#buffer_ratio').selectedIndex == 0 ?
						   'required ratio ' + reqRatio : 'ratio ' + (document.querySelector('select#buffer_ratio').selectedIndex == 1 ? '0.6' : '1.0')) + ')';
			targetBufferUnits.selectedIndex = currentBufferUnit == 'TB' ? 1 : 0;
		} catch(e) {}
	}

	requestTargetsTD.appendChild(document.createElement('b'));
	requestTargetsTD.lastChild.appendChild(document.createTextNode('Target buffer:'));
	requestTargetsTD.appendChild(document.createElement('br'));
	requestTargetsTD.appendChild(document.createElement('br'));
	var targetBufferBox = document.createElement('input');
	targetBufferBox.type = 'text';
	targetBufferBox.id = 'target_ratio';
	targetBufferBox.size = 8;
	targetBufferBox.value = null;
	requestTargetsTD.appendChild(targetBufferBox);
	requestTargetsTD.appendChild(document.createTextNode(' '));
	var targetBufferUnits = document.createElement('select');
	targetBufferUnits.id = 'buffer_unit';
	targetBufferUnits.name = 'unit';
	var targetBufferUnitsGB = document.createElement('option');
	targetBufferUnitsGB.value = 'gb';
	targetBufferUnitsGB.appendChild(document.createTextNode('GB'));
	targetBufferUnits.appendChild(targetBufferUnitsGB);
	var targetBufferUnitsTB = document.createElement('option');
	targetBufferUnitsTB.value = 'tb';
	targetBufferUnitsTB.appendChild(document.createTextNode('TB'));
	targetBufferUnits.appendChild(targetBufferUnitsTB);
	targetBufferUnits.selectedIndex = currentBountyUnits == 'TB' ? 1 : 0;
	requestTargetsTD.appendChild(targetBufferUnits);
	requestTargetsTD.appendChild(document.createTextNode(' over '));
	var targetBufferRatio = document.createElement('select');
	targetBufferRatio.id = 'buffer_ratio';
	targetBufferRatio.name = 'buffer ratio';
	//targetBufferRatio.onchange = 'updateBuffer();';
	var targetBufferRatioReq = document.createElement('option');
	targetBufferRatioReq.value = 'required';
	targetBufferRatioReq.appendChild(document.createTextNode('Required'));
	targetBufferRatio.appendChild(targetBufferRatioReq);
	var targetBufferRatioPointSix = document.createElement('option');
	targetBufferRatioPointSix.value = '0.6';
	targetBufferRatioPointSix.appendChild(document.createTextNode('0.6'));
	targetBufferRatio.appendChild(targetBufferRatioPointSix);
	var targetBufferRatioOne = document.createElement('option');
	targetBufferRatioOne.value = '1.0';
	targetBufferRatioOne.appendChild(document.createTextNode('1.0'));
	targetBufferRatio.appendChild(targetBufferRatioOne);
	targetBufferRatio.selectedIndex = ratio < 0.6 ? 0 : (ratio >= 1.0 ? 2 : 1);

	requestTargetsTD.appendChild(targetBufferRatio);
	requestTargetsTD.appendChild(document.createTextNode(' ratio '));
	var targetBufferButton = document.createElement('input');
	targetBufferButton.type = 'button';
	targetBufferButton.value = 'Calculate';
	requestTargetsTD.appendChild(document.createTextNode(' '));
	requestTargetsTD.appendChild(targetBufferButton);
	requestTargetsTD.appendChild(document.createElement('br'));
	var targetBufferCurrent = document.createElement('span');
	targetBufferCurrent.id = 'current_buffer';
	requestTargetsTD.appendChild(document.createElement('br'));
	targetBufferCurrent.appendChild(document.createTextNode('hello!'));
	requestTargetsTD.appendChild(targetBufferCurrent);
	targetBufferRatio.addEventListener('change', updateBuffer);

	updateBuffer();

	targetBufferButton.addEventListener('click', function() {
		var targetBuffer = targetBufferBox.value, targetBounty;
		if (isNaN(targetBuffer) ||
			targetBuffer < 0 ||
			targetBuffer > (upload / (document.querySelector('select#buffer_ratio').selectedIndex == 0 ? reqRatio : (document.querySelector('select#buffer_ratio').selectedIndex == 1 ? 0.6 : 1))) - download
		   ) {
			targetBufferBox.value = null;
			targetBounty = newRequest ? 100 : null;
		} else {
			var u = upload;
			var r = (document.querySelector('select#buffer_ratio').selectedIndex == 0 ? reqRatio : (document.querySelector('select#buffer_ratio').selectedIndex == 1 ? 0.6 : 1));
			var d = download;
			var b = (u / r) - d;
			var tb = targetBuffer * (document.querySelector('select#buffer_unit').selectedIndex == 0 ? Math.pow(1024, 3) : Math.pow(1024, 4));
			var tn = (u / r) - d - tb;
			console.log("upload: " + u);
			console.log("download: " + d);
			console.log("ratio: " + r);
			console.log("buffer: " + b);
			console.log("buffer index: " + document.querySelector('select#buffer_unit').selectedIndex);
			console.log("target buffer: " + tb);
			console.log("target bounty: " + tn);
			console.log("Math.trunc(tn / 1024^2): " + Math.trunc(tn / Math.pow(1024, 2)));
			targetBounty = Math.trunc(tn / Math.pow(1024, 2));
		}
		document.querySelector('select#unit').selectedIndex = 0;
		bountyBox.value = targetBounty;
		previewButton.click();
		try { targetBountyBox.value = null; } catch(e) {}
		targetRatioBox.value = null;
	});
})();