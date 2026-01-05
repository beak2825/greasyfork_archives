// ==UserScript==
// @name                CotG Alse
// @namespace	        http://www.darius83.de
// @description	        Dieses Script fügt zusätzliche Button in der Regionsansicht/Leeres Feld ein, um die Siedelbefehle an Alse zu senden
// @author         		Darius83
// @include				https://w1.crownofthegods.com/World00.php
// @version				1.0.2
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/18127/CotG%20Alse.user.js
// @updateURL https://update.greasyfork.org/scripts/18127/CotG%20Alse.meta.js
// ==/UserScript==
 
/*jshint esnext: true */
var scriptEngine;
var myVersion;
if (typeof GM_info === "undefined") {
    scriptEngine = "plain Chrome (Or Opera, or scriptish, or Safari, or rarer)";
    // See http://stackoverflow.com/a/2401861/331508 for optional browser sniffing code.
}
else {
    scriptEngine = GM_info.scriptHandler  ||  "Greasemonkey";
    myVersion = GM_info.script.version;
}

// Debug Mode an-/ausschalten
var DEBUG = false;
var NAME = GM_info.script.name;
var VERSION = GM_info.script.version;

var idbSupported = false;
var db;

var textfeld = document.getElementById('chatMsg');
var sendButton = document.getElementById('sendChat');
var clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
});
var regex = /\d{2,3}:\d{2,3}/;

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

if("indexedDB" in window) {
	idbSupported = true;
}

if(idbSupported) {
	//console.log('idb', 'supported ist true');
	var openRequest = indexedDB.open("CotGScripts", 1);
	openRequest.onupgradeneeded = function(e) {
		//console.log('idb', 'upgraderequest');
		var thisDB = e.target.result;
		if(!thisDB.objectStoreNames.contains("Scripts")) {
			var objectStore = thisDB.createObjectStore("Scripts", { keyPath: "id", autoIncrement:true });
			objectStore.createIndex("Name","Name", {unique:true});
			objectStore.createIndex("Version","Version", {unique:false});
		}
	};

	openRequest.onsuccess = function(e) {
		//console.log('idb', 'successful Request');
		db = e.target.result;
		var transaction = db.transaction(["Scripts"],"readonly");
		var store = transaction.objectStore("Scripts");
		var index = store.index('Name');
		var request = index.get(NAME);
		request.onsuccess = function(e) {
			var result = e.target.result;
			if (result) {
				var scripts = {
					Name: NAME,
					Version: VERSION,
					id: result['id']
				};
			} else {
				var scripts = {
					Name: NAME,
					Version: VERSION
				};
			}
			var transaction = db.transaction(["Scripts"],"readwrite");
			var store = transaction.objectStore("Scripts");
			var request = store.put(scripts);
			request.onerror = function(e) {
				console.log("Error",e.target.error.name);
				//some type of error handler
			};
			request.onsuccess = function(e) {
				if (DEBUG) { console.log('DEBUG','DB-Version geupdatet'); };
			};
			db.close();
		}
	};
}

buttonWhispSettleInfo.addEventListener("click", function()
{
	// /w Alse settle xxx:yyy
	var coords = document.getElementById('emptysInfo').innerHTML.match(regex);
	textfeld.value = '/w Alse settle '+coords;
	sendButton.dispatchEvent(clickEvent);
}, false);

buttonWhispSettle.addEventListener("click", function()
{
	// /w Alse !settle xxx:yyy
	var coords = document.getElementById('emptysInfo').innerHTML.match(regex);
	textfeld.value = '/w Alse !settle '+coords;
	sendButton.dispatchEvent(clickEvent);
}, false);

buttonWhispSettleDel.addEventListener("click", function()
{
	// /w Alse !settle del xxx:yyy
	var coords = document.getElementById('emptysInfo').innerHTML.match(regex);
	textfeld.value = '/w Alse !settle del '+coords;
	sendButton.dispatchEvent(clickEvent);
}, false);

var div1 = document.getElementById('squareemptyspot');
div1.appendChild(buttonWhispSettleInfo);
div1.appendChild(buttonWhispSettle);
div1.appendChild(buttonWhispSettleDel);