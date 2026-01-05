// ==UserScript==
// @name                CotG Raids
// @description	        Script to send optimal Troops raiding in CotG
// @author         		Darius83
// @include				https://w1.crownofthegods.com/World00.php
// @version				1.0.5
// @grant 				none
// @namespace http://www.darius83.de
// @downloadURL https://update.greasyfork.org/scripts/17950/CotG%20Raids.user.js
// @updateURL https://update.greasyfork.org/scripts/17950/CotG%20Raids.meta.js
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

// Basisloot der auf jeden Fall in der Höhle ist für Lvl 0 - 10
// var baseLoot = new Array(0, 360, 1040, 4400, 16000, 33600, 57600, 120000, 204800, 304800, 464000); // Backup of Originals

var baseLoot = new Array(0, 360, 1040, 4400, 16000, 33600, 57600, 113664, 192432, 288000, 428122);

// Browserdatenbank anlegen
var idbSupported = false;
var db = null;

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
		}
	};
	openRequest.onerror = function(e) {
		console.dir(e);
	};
}



var btnRaid = document.getElementById('raidDungGo');
btnRaid.addEventListener('click', checkDung, false);

function checkDung(e) {
	// Ein Array mit Level des Dungeon und Fortschritt des Dungeon anlegen
	var infoDung = new Array (document.getElementById('dunglevelregion').innerHTML, document.getElementById('Progress').innerHTML, document.getElementById('dungcoordsregion').innerHTML);
	if (DEBUG) { console.dir(infoDung); };
	
	// 10% Fortschritt addieren und negieren
	infoDung[1] = 100 - (infoDung[1]);
	if ( infoDung[1] < 0 ) { infoDung[1] = 0; };
	if (DEBUG) { console.log('Fortschritt:', infoDung[1]); };
	
	// Maximalen Loot der Höhle bestimmen
	var maxLoot = Math.round (baseLoot[infoDung[0]] + baseLoot[infoDung[0]]*((infoDung[1]*2)/100));
	if (DEBUG) { console.log('MaxLoot:', maxLoot); };
	
	// Benötigte Truppen berechnen
	var tsSorc = Math.round ( maxLoot/5 );
	var tsInf = Math.round ( maxLoot/10 );
	var tsHorse = Math.round ( maxLoot/15 );
	var tsPrae = Math.round ( maxLoot/20 );
	
	// Berechnung der cid
	var coords = infoDung[2].split(':');
	if (DEBUG) { console.dir(coords); };
	var cid = (coords[1]*65536) + (coords[0]*1);
	if (DEBUG) { console.log('cid:', cid); };
	
	
	// ajax-anfrage
	var ajax = null;
	if(window.XMLHttpRequest){ //Google Chrome, Mozilla Firefox, Opera, Safari, IE 7
		ajax = new XMLHttpRequest();
	}
	ajax.open("POST","https://w1.crownofthegods.com/includes/gSt.php",true);
	ajax.setRequestHeader('Content-Encoding', '4cfc804b1e');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	ajax.setRequestHeader('Content-type', 'charset=UTF-8');
	ajax.setRequestHeader('Accept', '*/*');
	ajax.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	ajax.setRequestHeader('Accept-Language', 'de-DE,de');
	ajax.setRequestHeader('Accept-Language', 'q=0.8,en-US');
	ajax.setRequestHeader('Accept-Language', 'q=0.6,en');
	ajax.setRequestHeader('Accept-Language', 'q=0.4');
	ajax.send('cid='+cid);
	
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4 && ajax.status == 200) {
			if (DEBUG) { console.dir(ajax.responseText); };
			var raid1 = ['', 'raidTR5', 'raidTR2', 'raidTR3', 'raidTR8', 'raidTR10', 'raidTR6', 'raidTR11', 'raidTR4', 'raidTR9', 'raidTR15', 'raidTR14', 'raidTR16'];
			var raid2 = ['', 'raidIP5', 'raidIP2', 'raidIP3', 'raidIP8', 'raidIP10', 'raidIP6', 'raidIP11', 'raidIP4', 'raidIP9', 'raidIP15', 'raidIP14', 'raidIP16'];
			for (var i = 1; i <= 12; i++) {
				if (i == 3 || i == 8 || i == 10 || i == 11 || i == 12) {
					var td = document.createElement('td');
					var troop = document.getElementById(raid1[i]).appendChild(td);
					continue;
				};
				var button = document.createElement('button');
				var td = document.createElement('td');
				var troop = document.getElementById(raid1[i]).appendChild(td);
				button.setAttribute('class', 'brownb');
				button.setAttribute('i', i);
				td.appendChild(button);
				if (i == 1 || i == 2 || i == 7) {
					var textButton = document.createTextNode('Opti '+tsInf);
					button.addEventListener('mouseup', function(node) {
						document.getElementById(raid2[node.path[0].getAttribute('i')]).value = tsInf;
					}, false);
				}
				if (i == 4 || i == 5) {
					var textButton = document.createTextNode('Opti '+tsHorse);
					button.addEventListener('mouseup', function(node) {
						document.getElementById(raid2[node.path[0].getAttribute('i')]).value = tsHorse;
					}, false);
				}
				if (i == 6) {
					var textButton = document.createTextNode('Opti '+tsSorc);
					button.addEventListener('mouseup', function(node) {
						document.getElementById(raid2[node.path[0].getAttribute('i')]).value = tsSorc;
					}, false);
				}
				if (i == 9) {
					var textButton = document.createTextNode('Opti '+tsPrae);
					button.addEventListener('mouseup', function(node) {
						document.getElementById(raid2[node.path[0].getAttribute('i')]).value = tsPrae;
					}, false);
				}
				button.appendChild(textButton);
				if (DEBUG) { console.dir(troop); };
			}
		}
	}
}