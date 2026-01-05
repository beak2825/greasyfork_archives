// ==UserScript==
// @name                CotG Notes
// @name:en             CotG Notes
// @namespace	        http://www.darius83.de
// @description	        Script zum Hinzufügen von Notizen zu einzelnen Spielerstädten in CotG
// @description:en      Script to add notes at all Cities and Castles on the Region-Map of CotG
// @author         	    Darius83
// @include				https://w1.crownofthegods.com/World00.php
// @version				1.1.2
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/17497/CotG%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/17497/CotG%20Notes.meta.js
// ==/UserScript==

/*jshint esnext: true */
/* jshint -W097 */
'use strict';

// Konstanten
var DEBUG = false;
var SCRIPTNAME = GM_info.script.name;
var VERSION = GM_info.script.version;
var START = 30000;
var IE = false;

// Globale Variablen
var APIKey = '';
var buttonCoords = null;
var coordinates = null;
var bekannt = false;
var currentObj = null;
var currentObjX = 0;
var currentObjY = 0;
var startX = 0;
var startY = 0;
var idbSupported = false;
if("indexedDB" in window) {
	idbSupported = true;
}
var db2;
var myID = 0;

// Start des Scripts mit Verzögerung
var timer = setTimeout(StartScript,START);

function StartScript(){
	// Version in DB aktualisieren
	var db;
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
			var request = index.get(SCRIPTNAME);
			request.onsuccess = function(e) {
				var result = e.target.result;
				if (result) {
					var scripts = {
						Name: SCRIPTNAME,
						Version: VERSION,
						id: result['id']
					};
				} else {
					var scripts = {
						Name: SCRIPTNAME,
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
		openRequest.onerror = function(e) {
			console.dir(e);
		};
	}
	// Schauen ob Bot aktiv ist
	APIKey = getCookie('APIKey');
	if (APIKey == '') {
		// Synchro via Bot nicht aktiv
		// Öffne IndexedDB
		var openRequest2 = indexedDB.open("CotGNotes",2);
		openRequest2.onupgradeneeded = function(e) {
			var thisDB2 = e.target.result;
			if(!thisDB2.objectStoreNames.contains("cities")) {
				var objectStore = thisDB2.createObjectStore("cities", { keyPath: "id", autoIncrement:true });
				objectStore.createIndex("coordinates","coordinates", {unique:true});
				objectStore.createIndex("content","content", {unique:false});
				objectStore.createIndex("updated","updated", {unique:false});
				objectStore.createIndex("x","x", {unique:false});
				objectStore.createIndex("y","y", {unique:false})
			}
		}

		openRequest2.onsuccess = function(e) {
			db2 = e.target.result;
		}

		openRequest2.onerror = function(e) {
			console.dir(e);
		}
	} else {
		// Synchro via Bot aktiv
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

function getCity() {
	if (APIKey == '') {
		// Synchro via Bot nicht aktiv
		// Suche Daten lokal
		var Ausdruck = /([0-9]{1,3}):([0-9]{1,3})/g;
		var match = Ausdruck.exec(coordinates);
		coordinates = match[1] + "" + match[2];
		var key = Number(coordinates);
		if(key === "" || isNaN(key)) return;
		var transaction = db2.transaction(["cities"],"readonly");
		var store = transaction.objectStore("cities");
		var index = store.index("coordinates");
		var request = index.get(coordinates);
		request.onsuccess = function(e) {
			var result = e.target.result;
			for (var i = 0; i < auswahlListe.children.length; i++) {
				auswahlListe.children[i].firstElementChild.checked = false;
			}
			document.getElementById('cotgnotestext').value = '';
			if(result) {
				bekannt = true;
				var jsonNotes = JSON.parse(result['content']);
				if (jsonNotes) {
					for (var i = 0; i < jsonNotes.length-1; i++) {
						auswahlListe.children[jsonNotes[i]].firstElementChild.checked = true;
					}
					document.getElementById('cotgnotestext').value = jsonNotes[jsonNotes.length-1];
				}
				footerspan.textContent = result['updated'];
				myID = result['id'];
			} else {
				bekannt = false;
			}   
		}
	} else {
		// Synchro via Bot aktiv
		var Ausdruck = /([0-9]{1,3}):([0-9]{1,3})/g;
		var match = Ausdruck.exec(coordinates);
		coordinates = match[1] + "" + match[2];
		var key = Number(coordinates);
		if(key === "" || isNaN(key)) return;

		var ajax = new XMLHttpRequest();
		var jArray = {
			pos: match[1] + ":" + match[2]
		};
		var jsonStringCoord = JSON.stringify(jArray);
		ajax.open("GET", "https://api.cotg.ovh/notes/get?apikey="+encodeURIComponent(getCookie('APIKey'))+"&data="+encodeURIComponent(jsonStringCoord), true);
		ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		ajax.onreadystatechange = function() {//Call a function when the state changes.
			if(ajax.readyState == 4 && ajax.status == 200) {
				var jsonArray = JSON.parse(ajax.responseText);
				if (jsonArray['result'] == 'success') {
					var jsonNotes = JSON.parse(jsonArray['note']);
					for (var i = 0; i < auswahlListe.children.length-1; i++) {
						auswahlListe.children[i].firstElementChild.checked = false;
					}
					document.getElementById('cotgnotestext').value = '';
					if (jsonNotes) {
						for (var i = 0; i < jsonNotes.length-1; i++) {
							auswahlListe.children[jsonNotes[i]].firstElementChild.checked = true;
						}
						document.getElementById('cotgnotestext').value = jsonNotes[jsonNotes.length-1];
					}
				}
			}
		}
		ajax.send();
	}
}

function addCity() {
	if (APIKey == '') {
		// Synchro via Bot nicht aktiv
		// Speichere Daten lokal
		var transaction = db2.transaction(["cities"],"readwrite");
		var store = transaction.objectStore("cities");
		var Ausdruck = /([0-9]{1,3})([0-9]{1,3})/g;
		var match = Ausdruck.exec(coordinates);
		coordinates = match[1] + "" + match[2];
		var x = match[1];
		var y = match[2];
		var truppenAusgewaehlt = new Array();
		var zaehlerEins = 0;
		for (var i = 0; i < auswahlListe.children.length; i++) {
			if (auswahlListe.children[i].firstElementChild.checked) {
				truppenAusgewaehlt[zaehlerEins] = i;
				zaehlerEins++;
			} else {
			}
		}
		truppenAusgewaehlt.push(document.getElementById('cotgnotestext').value);
		var truppenMarkiert = JSON.stringify(truppenAusgewaehlt);
		if (bekannt) { 
			var cities = {
				coordinates:coordinates,
				x:x,
				y:y,
				content:truppenMarkiert, 
				updated:new Date(),
				id:myID
			}
			var request = store.put(cities);
		} else { 
			var cities = {
				coordinates:coordinates,
				x:x,
				y:y,
				content:truppenMarkiert,
				updated:new Date(),
			}
			var request = store.add(cities);
			//getCity();
		}
		request.onerror = function(e) {
			console.log("Error",e.target.error.name);
			//some type of error handler
		}
		request.onsuccess = function(e) {
		}
	} else {
		// Synchro via Bot aktiv
		var Ausdruck = /([0-9]{1,3})([0-9]{1,3})/g;
		var match = Ausdruck.exec(coordinates);
		coordinates = match[1] + "" + match[2];
		var x = match[1];
		var y = match[2];
		var truppenAusgewaehlt = new Array();
		var zaehlerEins = 0;
		for (var i = 0; i < auswahlListe.children.length; i++) {
			if (auswahlListe.children[i].firstElementChild.checked) {
				truppenAusgewaehlt[zaehlerEins] = i;
				zaehlerEins++;
			} else {
			}
		}
		truppenAusgewaehlt.push(document.getElementById('cotgnotestext').value);
		var truppenMarkiert = JSON.stringify(truppenAusgewaehlt);

		var ajax = new XMLHttpRequest();
		var jArray = {
			pos: match[1] + ":" + match[2],
			note: truppenMarkiert 
		};

		var jsonStringCoord = JSON.stringify(jArray);
		ajax.open("GET", "https://api.cotg.ovh/notes/set?apikey="+encodeURIComponent(getCookie('APIKey'))+"&data="+encodeURIComponent(jsonStringCoord), true);
		ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		ajax.onreadystatechange = function() {
			if(ajax.readyState == 4 && ajax.status == 200) {
				console.log('SAVE', ajax.responseText);
			}
		}
		ajax.send();
	}
}

// HTML Elemente erzeugen
// Startbutton
var myButton = document.createElement('button');
var textButton = document.createTextNode(SCRIPTNAME);
// Hauptfenster
var hauptmenu = document.createElement('div');
var titeldiv = document.createElement('div');
var hauptspan = document.createElement('span');
var xButton = document.createElement('button');
var xButtonDiv = document.createElement('div');
var centxButtonDiv = document.createElement('div');
var hauptcontent = document.createElement('div');
var hauptfooter = document.createElement('div');
var submitButton = document.createElement("button");
var textSubmitButton = document.createTextNode('Save');
var footerspan = document.createElement('span');
var auswahlListe = document.createElement('ul');
var auswahlListenPunkt;
var checkBox1;
var checkboxLabel;

var availableTroops = [
	'Guard', 'Vanquisher', 'Ranger', 'Triari', 'Scout', 'Arbalist', 'Horseman', 'Sorcerer', 'Druid', 'Priestess',
	'Praetor', 'Battering Ram', 'Ballista', 'Scorpion', 'Stinger', 'Galley', 'Warship', 'Ressources', 'Hub'
];
for (var i = 0; i < availableTroops.length; i++) {
	auswahlListenPunkt = document.createElement('li');
	checkBox1 = document.createElement('input');
	checkBox1.type = 'checkbox';
	checkBox1.name = 'Troops';
	checkBox1.value = availableTroops[i];
	checkboxLabel = document.createElement('label');
	checkboxLabel.setAttribute("for", checkBox1);
	checkboxLabel.innerHTML = availableTroops[i];
	auswahlListe.appendChild(auswahlListenPunkt);
	auswahlListenPunkt.appendChild(checkBox1);
	auswahlListenPunkt.appendChild(checkboxLabel);
}
auswahlListenPunkt = document.createElement('li');
var textbox = document.createElement('textarea');
textbox.cols = 60;
textbox.rows = 8;
textbox.setAttribute('id', 'cotgnotestext');
auswahlListe.appendChild(auswahlListenPunkt);
auswahlListenPunkt.appendChild(textbox);

// Aufbau und Attribute des Hauptfensters
hauptmenu.setAttribute('class', 'ui-draggable');
hauptmenu.setAttribute('id', 'announcDiv');
hauptmenu.appendChild(titeldiv);
titeldiv.setAttribute('class', 'popUpBar ui-draggable-handle');
titeldiv.appendChild(hauptspan);
hauptspan.setAttribute('class', 'ppspan');
titeldiv.appendChild(xButton);
xButton.setAttribute('class', 'xbutton greenb');
xButton.setAttribute('id', 'announcXbutton');
xButton.appendChild(xButtonDiv).appendChild(document.createElement('div')).appendChild(centxButtonDiv);
xButtonDiv.setAttribute('id', 'xbuttondiv');
centxButtonDiv.setAttribute('id', 'centxbuttondiv');
hauptmenu.appendChild(hauptcontent);
hauptcontent.style.overflowY = 'auto';
hauptcontent.setAttribute('id', 'announcWindow');
hauptfooter.setAttribute('id', 'botannouncWindow');
hauptfooter.appendChild(footerspan);
submitButton.appendChild(textSubmitButton);
hauptcontent.appendChild(auswahlListe);
hauptcontent.appendChild(submitButton);


// Aufbau und Attribute des Startbuttons
myButton.appendChild(textButton);
myButton.setAttribute('id', 'Testid');
myButton.setAttribute('class', 'regButton greenbuttonGo greenb');
myButton.style.margin = '2% 0 0 2%';

// Speichern wurde geklickt
submitButton.addEventListener("click", function() {
	addCity();
}, false);

// Startbutton wurde geklickt
myButton.addEventListener("click", function()
{
	buttonCoords = document.getElementById('coordstochatGo1');
	coordinates = buttonCoords.getAttribute('data');
	var Ausdruck = /([0-9]{1,3}):([0-9]{1,3})/g;
	var match = Ausdruck.exec(coordinates);
	coordinates = match[1] + ":" + match[2];
	hauptspan.textContent = 'Citynotes at '+coordinates;
	getCity();
	document.getElementsByTagName("div")[0].appendChild(hauptmenu);
}, false);

// Schliessenbutton wurde geklickt
xButton.addEventListener("click", function() {
	hauptmenu.parentNode.removeChild(hauptmenu);
	bekannt = false;
}, false);

// Drag and Drop Ereignisse
titeldiv.addEventListener('mousedown', function(ereignis) {
	currentObj = hauptmenu;
	startX = currentObjX - currentObj.offsetLeft;
	startY = currentObjY - currentObj.offsetTop;
}, false);

document.addEventListener('mouseup', function(ereignis) {
	currentObj = null;
}, false);

document.addEventListener('mousemove', function(ereignis) {
	currentObjX = (IE) ? window.event.clientX : ereignis.pageX; 
	currentObjY = (IE) ? window.event.clientY : ereignis.pageY;
	if (currentObj != null) {
		currentObj.style.left = (currentObjX - startX) + "px";
		currentObj.style.top = (currentObjY - startY) + "px";
	}
}, false);

// Startbutton integrieren
document.getElementById('citySpotAction').appendChild(myButton);