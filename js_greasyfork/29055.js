// ==UserScript==
// @name                CotG Original Apex
// @description	        This script adds some buttons to send settleorders to our alliancebot
// @author         		Darius83
// @include				https://w*.crownofthegods.com/World00.php
// @version				1.0.5
// @grant none
// @namespace https://greasyfork.org/users/117592
// @downloadURL https://update.greasyfork.org/scripts/29055/CotG%20Original%20Apex.user.js
// @updateURL https://update.greasyfork.org/scripts/29055/CotG%20Original%20Apex.meta.js
// ==/UserScript==
 
/*jshint esnext: true */

(function(){
	// Debug Mode an-/ausschalten
	var DEBUG = false;
	var SCRIPTNAME = GM_info.script.name;
	var VERSION = GM_info.script.version;

	var textfeld = document.getElementById('chatMsg');
	var sendButton = document.getElementById('sendChat');
	var clickEvent = new MouseEvent("click", {
		"view": window,
		"bubbles": true,
		"cancelable": false
	});
	var regex = /\d{1,3}:\d{1,3}/;

	var buttonWhispSettle = document.createElement('button');
	var buttonWhispSettleText = document.createTextNode('!settle xxx:yyy');
	var buttonWhispSettleDel = document.createElement('button');
	var buttonWhispSettleDelText = document.createTextNode('!settle del xxx:yyy');
	var buttonWhispSettleInfo = document.createElement('button');
	var buttonWhispSettleInfoText = document.createTextNode('settle xxx:yyy');

	buttonWhispSettle.appendChild(buttonWhispSettleText);
	buttonWhispSettle.setAttribute('class', 'regButton greenbuttonGo greenb');
	buttonWhispSettle.style.margin = '2% 0 0 2%';
	buttonWhispSettle.style.maxWidth = '30%';

	buttonWhispSettleDel.appendChild(buttonWhispSettleDelText);
	buttonWhispSettleDel.setAttribute('class', 'regButton greenbuttonGo greenb');
	buttonWhispSettleDel.style.margin = '2% 0 0 2%';
	buttonWhispSettleDel.style.maxWidth = '30%';

	buttonWhispSettleInfo.appendChild(buttonWhispSettleInfoText);
	buttonWhispSettleInfo.setAttribute('class', 'regButton greenbuttonGo greenb');
	buttonWhispSettleInfo.style.margin = '2% 0 0 2%';
	buttonWhispSettleInfo.style.maxWidth = '30%';

	if (typeof window.localStorage != "undefined") {
		var cotgScripts = localStorage.getItem("CotG_Scripts");
		if (cotgScripts === null) {
			cotgScripts = new Array();
			cotgScripts[0] = [SCRIPTNAME, VERSION];
			localStorage.setItem("CotG_Scripts", JSON.stringify(cotgScripts));
		} else {
			cotgScripts = JSON.parse(cotgScripts);
			for (var i = 0; i < cotgScripts.length; i++) {
				if (cotgScripts[i][0] === SCRIPTNAME) {
					if (cotgScripts[i][1] === VERSION) {
						break;
					} else {
						cotgScripts[i][1] = VERSION;
						localStorage.setItem("CotG_Scripts", JSON.stringify(cotgScripts));
						break;
					}
				}
				if (i === cotgScripts.length - 1) {
					if (cotgScripts[i][1] != SCRIPTNAME) {
						cotgScripts[i+1] = [SCRIPTNAME, VERSION];
						localStorage.setItem("CotG_Scripts", JSON.stringify(cotgScripts));
					}
				}
			}
		}
	}

	buttonWhispSettleInfo.addEventListener("click", function()
	{
		// /w Father settle xxx:yyy
		var coords = document.getElementById('emptysInfo').innerHTML.match(regex);
		textfeld.value = '/w Father settle '+coords;
		sendButton.dispatchEvent(clickEvent);
	}, false);

	buttonWhispSettle.addEventListener("click", function()
	{
		// /w Father !settle xxx:yyy
		var coords = document.getElementById('emptysInfo').innerHTML.match(regex);
		textfeld.value = '/w Father !settle '+coords;
		sendButton.dispatchEvent(clickEvent);
	}, false);

	buttonWhispSettleDel.addEventListener("click", function()
	{
		// /w Father !settle del xxx:yyy
		var coords = document.getElementById('emptysInfo').innerHTML.match(regex);
		textfeld.value = '/w Father !settle del '+coords;
		sendButton.dispatchEvent(clickEvent);
	}, false);

	var div1 = document.getElementById('squareemptyspot');
	div1.appendChild(buttonWhispSettleInfo);
	div1.appendChild(buttonWhispSettle);
	div1.appendChild(buttonWhispSettleDel);
})();