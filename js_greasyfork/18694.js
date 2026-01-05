// ==UserScript==
// @name                CotG Incoming Addon Alse
// @name:en				CotG Incoming Addon Alse
// @description			Script zum Anzeigen wahrscheinlicher Truppen bei eingehenden Angriffen
// @description:en      Script to show incoming troops in CotG based on calculation
// @author         		Darius83
// @include				https://w1.crownofthegods.com/World00.php
// @version				1.0.1
// @grant 				none
// @namespace http://www.darius83.de
// @downloadURL https://update.greasyfork.org/scripts/18694/CotG%20Incoming%20Addon%20Alse.user.js
// @updateURL https://update.greasyfork.org/scripts/18694/CotG%20Incoming%20Addon%20Alse.meta.js
// ==/UserScript==

var DEBUG = false;
var NAME = GM_info.script.name;
var VERSION = GM_info.script.version;

// Browserdatenbank anlegen
var idbSupported = false;
var db = null;

if("indexedDB" in window) {
	idbSupported = true;
}
if(idbSupported) {
	var openRequest = indexedDB.open("CotGScripts", 1);
	openRequest.onupgradeneeded = function(e) {
		var thisDB = e.target.result;
		if(!thisDB.objectStoreNames.contains("Scripts")) {
			var objectStore = thisDB.createObjectStore("Scripts", { keyPath: "id", autoIncrement:true });
			objectStore.createIndex("Name","Name", {unique:true});
			objectStore.createIndex("Version","Version", {unique:false});
		}
	};

	openRequest.onsuccess = function(e) {
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



var infoPage = document.getElementById('allianceInfoPage'); // Menü "Eingehende Angriffe" suchen

var th = document.createElement('th'); // Tabellenkopfspalte erstellen
th.innerHTML = 'Attack Type'; // Tabellenkopfspalte füllen
//var ajaxArray = new Array();
var ajax = new Array();

function InitializeTable() {
	var tHead = document.getElementById('incomingsAttacksTable').firstElementChild.firstElementChild.firstElementChild; // Tabellenkopf suchen
	var tBody = document.getElementById('incomingsAttacksTable').firstElementChild.children[1]; // Tabellenkörper suchen
	tHead.appendChild(th); // Tabellenkopfspalte einfügen
	for (var i = 0; i < tBody.children.length; i++) { // für jede Tabellenkörperzeile mache ...
		if (!document.getElementById('eAngriff'+i)) { // wenn Element mit ID xyz nicht vorhanden ist
			var td = document.createElement('td'); // erstelle TD Element
			td.setAttribute('id', 'eAngriff'+i); // Setze ID für TD Element
			tBody.children[i].appendChild(td); // TD Element einfügen
		}
	}
}

var timerAlse = setInterval(SearchForCookie, 30000);
function SearchForCookie() {
	if (getCookie('APIKey') != '') {
		clearInterval(timerAlse);
		var timer = setInterval(UpdateTable, 2000); // Alle 2 Sek Tabelle updaten
	}
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function UpdateTable() {
	if (infoPage.style['display'] != 'none' && document.getElementById('incomingstab').style['display'] == 'block') { // wenn Menü "Eingehende Angriffe" nicht unsichtbar ist ...
		if (document.getElementById('incomingsAttacksTable').firstElementChild.children[1].children[0] && !document.getElementById('eAngriff0')) { // Wenn eine Zeile in der Tabelle vorhanden ist und keine Spalte hinzugefügt wurde
			InitializeTable(); // Tabelle initialisieren
		} else { // sonst ...
			var tBody = document.getElementById('incomingsAttacksTable').firstElementChild.children[1]; // Tabellenkörper suchen
			for (var i = 0; i < tBody.children.length; i++) { // für jede Tabellenkörperzeile mache ...
				if (!document.getElementById('eAngriff'+i) || tBody.children[i].children[14].id != 'eAngriff'+i) { // Wenn TD nicht vorhanden ist oder TD nicht mit Zähler übereinstimmt
					InitializeTable(); // neu initialisieren
				} else { // sonst ...
					var td = tBody.children[i].children[14]; // TD zum füllen suchen
					if (td.innerHTML.length == 0){ // Noch kein Eintrag vorhanden
						var attackType = tBody.children[i].children[1].innerHTML; // Angriffstyp
						var attackCoords = tBody.children[i].children[9].firstElementChild.innerHTML; // Angriff kommt von ...
						attackCoords = attackCoords.slice(attackCoords.indexOf('(')+1, attackCoords.length-1);
						var attackedCoords = tBody.children[i].children[4].firstElementChild.firstElementChild.innerHTML; // Angriff geht auf ...
						attackedCoords = attackedCoords.slice(attackedCoords.indexOf('(')+1, attackedCoords.length-1);
						var spotTime = tBody.children[i].children[10].innerHTML; // Angriff gesehen um ...
						var arriveTime = tBody.children[i].children[5].innerHTML; // Angriff kommt an um ...
						var jArray = {
							attackType: attackType,
							attackCoords: attackCoords,
							attackedCoords: attackedCoords,
							spotTime: spotTime,
							arriveTime: arriveTime
						}
						var jsonString = JSON.stringify(jArray);
						console.log(jsonString);
						
						// https://api.cotg.ovh/incommings/get?apikey=xyz123&data=string
						ajax[i] = new XMLHttpRequest();
						ajax[i].open("GET", "https://api.cotg.ovh/incommings/get?apikey="+encodeURIComponent(getCookie('APIKey'))+"&data="+encodeURIComponent(jsonString), true);
						ajax[i].setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						ajax[i].onreadystatechange = (function(_ajax, _td) {
							return function() {
								if(_ajax.readyState == 4 && _ajax.status == 200) { // Der Teil muss noch angepasst werden
									console.debug(_ajax.responseText);
									var jsonArray = JSON.parse(_ajax.responseText);
									console.debug(jsonArray);
									if (jsonArray['result'] == 'success') {
										// Object {attackedCoords: "143:543", result: "success", info: "Scout@0%"}
										console.debug(jsonArray);
										_td.innerHTML = jsonArray['info'];

									}
								}
							}
						})(ajax[i], td);
						ajax[i].send();
						//ajaxArray[i] = ajax[i];
					} else { // Eintrag vorhanden
						
					}
				}
			}
		}
	}
}