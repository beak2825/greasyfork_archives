// ==UserScript==
// @name        Proxer-Userscript-Anker
// @namespace   de.34749.proxer
// @version     0.2.1
// @description Dieses Script fügt der Proxer-Navigation den Reiter "Tools" hinzu, an den Userscripte angedockt werden können
// @author      Blue.Reaper
// @history		0.2.1 alphabetische Sortierung, 'ankerTop' wird nur 1x erzeugt
// ==/UserScript==

//Starte die Funktion "addAnker" beim Laden der Seite
document.addEventListener('DOMContentLoaded', function(event) {
    addAnker();
});

//Fügt den Button "Tools" zu "leftNav" hinzu
var addAnker = function() {
	if (document.getElementById('ankerTop') === null) {
		var ul = document.getElementById("leftNav");
		var li = document.createElement("li");
		li.setAttribute("id","ankerTop");
		li.setAttribute("class","topmenu");
		ul.appendChild(li);
		document.getElementById('ankerTop').innerHTML = '<a href="javascript:;">Tools ▾</a><ul id="anker"></ul>';
	}
};

//############################# Ab hier generische Klassen nicht ändern #############################

/*	Fügt den Button zu "Anker" hinzu und startet die changefunktion beim Seitenaufruf
	1.Parameter --> id des Members in der Menüleiste
	2.Parameter --> Angezeigter Text des Members
	3.Parameter --> Boolean: true -> mit Häckhen/Kreuz | false -> ohne Häckhen/Kreuz
	4.Parameter --> Methode die bei Initialisierung und Änderung der Speichervariable aufgerufen wird (An/Aus)
	5.Parameter --> Name der Speichervariable
	6.Parameter --> Initalwert der Speichervariable
*/
function addAnkerMember(id, name, withTick, changefunktion, memoryName, memoryDefault) {
	var test = setInterval(function () {
	// console.log('anker');
		if (document.getElementById('anker') !== null) {
			var ul = document.getElementById("anker");
			var li = document.createElement("li");
			li.setAttribute("id",id);
			// fügt das Member an der alphabetisch richtigen Stellein
			var i=0;
			// Wenn Zähler kleiner als Listenlänge  und Name des Member größer (alphabetisch danach) als aktueller Listeneintrag, dann gehe weiter
			while(ul.childNodes.length > i && ul.childNodes[i].textContent < name){
				// console.log('Schleife - '+name+' - '+ul.childNodes[i].textContent+' < '+name+' = '+(ul.childNodes[i].textContent < name));
				i++;
			}
			// Setzt Member an richtige Stelle
			ul.insertBefore(li, ul.childNodes[i]);
			// Setzt den html-Inhalt des Members
			if(withTick){
				document.getElementById(id).innerHTML = '<a href="javascript:;">'+name+' <img id="'+id+'_img" src="" width="15" height="15"></a>';
				updateAnkerTick(id, memoryName, memoryDefault);
			}else{
				document.getElementById(id).innerHTML = '<a href="javascript:;">'+name+'</a>';
			}
			document.getElementById(id).addEventListener("click",function () {
				switchAnkerMemory(id, memoryName, memoryDefault, changefunktion);
			});
			changefunktion(false);
			clearInterval(test);
		}
	},100);
};

// Troogelt den Speicherwert (0/1) und ruft die changefunktion auf
function switchAnkerMemory(id, memoryName, memoryDefault, changefunktion) {
	if (GM_getValue(memoryName, memoryDefault) === 0) {
		GM_setValue(memoryName,1);
	} else {
		GM_setValue(memoryName,0);
	}
    changefunktion(true);
    updateAnkerTick(id, memoryName, memoryDefault);
};

// Setzt den Hacken / Kreuz nach das Member
function updateAnkerTick(id, memoryName, memoryDefault) {
    if (GM_getValue(memoryName, memoryDefault) === 0) {
		document.getElementById(id+'_img').src="https://proxer.me/images/misc/kreuz.png";
	} else {
		document.getElementById(id+'_img').src="https://proxer.me/images/misc/haken.png";
	}
};