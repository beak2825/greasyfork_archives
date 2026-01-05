// ==UserScript==
// @name                CotG Scripts
// @description         Script to install scripts for CotG
// @author              Darius83
// @include             https://w1.crownofthegods.com/World00.php
// @version             1.0.6
// @grant               none
// @namespace           http://www.darius83.de
// @downloadURL https://update.greasyfork.org/scripts/18007/CotG%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/18007/CotG%20Scripts.meta.js
// ==/UserScript==
 

/*jshint esnext: true */
var scriptEngine;
if (typeof GM_info === "undefined") {
    scriptEngine = "plain Chrome (Or Opera, or scriptish, or Safari, or rarer)";
    // See http://stackoverflow.com/a/2401861/331508 for optional browser sniffing code.
}
else {
    scriptEngine = GM_info.scriptHandler  ||  "Greasemonkey";
}
//console.log(scriptEngine);
// Debug Mode an-/ausschalten
var DEBUG = false;
var NAME = GM_info.script.name;
var VERSION = GM_info.script.version;

var zustand = 1;
function blink() {
	if(zustand==1) {
		document.getElementById('blinkcotg').style.backgroundImage = "url('/images/but1.png')";
		zustand = 2;
	} else {
		document.getElementById('blinkcotg').style.backgroundImage = "url('/images/but2.png')";
		zustand = 1;
	}
}

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

var cookieStatus = false;
var timerAlse = setInterval(SearchForCookie, 30000);
function SearchForCookie() {
	if (getCookie('APIKey') != '') {
		clearInterval(timerAlse);
		cookieStatus = true;
		//var timer = setInterval(UpdateTable, 2000); // Alle 2 Sek Tabelle updaten
	}
}

function checkVersion(name, callback) {
	var transaction = db.transaction(["Scripts"],"readonly");
	var store = transaction.objectStore("Scripts");
	var index = store.index('Name');
    console.log(name);
	var request = index.get(name);
	request.onsuccess = function(e) {
		var result = e.target.result;
		if (result) {
			callback(result['Version']);
		} else {
			callback('0.0.0');
		}
	}
}

var aktiv = null;
// Prüfen, ob das Script in aktueller Version installiert ist
var ajax = null;
var regex1 = /(?:script-author-description..\n\t\t\t\t)(.*)(?:\n)/;
var regex2 = /(?:script-show-version"><span>)(.*)(?:<\/span><\/dd>)/;
ajax = new XMLHttpRequest();
ajax.open("GET","https://greasyfork.org/de/scripts/18007-cotg-scripts",true);
ajax.send(null);
ajax.onreadystatechange = function() {
    if(this.readyState == 4) {
        if(this.status == 200) {
            if (DEBUG) { console.dir(this.responseText); }
            var text = this.responseText.match(regex1);
            var version = this.responseText.match(regex2);
            if (version[1] != VERSION) {
				if(aktiv == null) aktiv = window.setInterval(blink,1500);
            }
        }
    }
};
 

 
// Drag+Drop Variablen
var currentObj = null;
var currentObjX = 0;
var currentObjY = 0;
var startX = 0;
var startY = 0;
var IE = false;
 
// Startbutton für Script erstellen und einbinden
var topPageDiv = document.getElementById('topPageDiv');
var buttonScripts = document.createElement('button');
var buttonScriptsText = document.createTextNode('Scripts');
buttonScripts.setAttribute('id', "blinkcotg");
 
buttonScripts.setAttribute('class', 'tabButton greenb');
 
buttonScripts.appendChild(buttonScriptsText);
topPageDiv.insertBefore(buttonScripts, topPageDiv.children[9]);
 
// Hauptmenu erstellen
var hauptmenu = document.createElement('div');
var titeldiv = document.createElement('div');
var hauptspan = document.createElement('span');
var xButton = document.createElement('button');
var xButtonDiv = document.createElement('div');
var centxButtonDiv = document.createElement('div');
var hauptcontent = document.createElement('div');
var hauptfooter = document.createElement('div');
var footerspan = document.createElement('span');
 
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
hauptmenu.appendChild(hauptfooter);
hauptfooter.setAttribute('id', 'botannouncWindow');
hauptfooter.appendChild(footerspan);
hauptspan.textContent = 'CotG Scripts';
 
// Startbutton Event
buttonScripts.addEventListener("click", function() {
    showInstallMenu();
}, false);
 
// Startbutton Funktion
function showInstallMenu() {
	// Scriptarray anlegen
	if (!cookieStatus) {
		var scriptArray = ['CotG Scripts', 'CotG Notes', 'CotG Raids', 'CotG Alse API'];
	} else {
		var scriptArray = ['CotG Scripts', 'CotG Notes', 'CotG Raids', 'CotG Alse API', 'CotG Alse', 'CotG Incoming Addon Alse'];
	}
    if (DEBUG) { console.log('DEBUG', 'Funktion showInstallMenu aufgerufen'); }
    // Inhalt im Fenster einfügen
    var table = document.createElement('table');
    var regex1 = /(?:script-author-description..\n\t\t\t\t)(.*)(?:\n)/;
    var regex2 = /(?:script-show-version"><span>)(.*)(?:<\/span><\/dd>)/;
    var ajax = null;
    hauptcontent.appendChild(table);
    for (var i = 0; i < scriptArray.length; i++) {
        var row = table.insertRow(i);
        var zelle0 = row.insertCell(0);
        var zelle1 = row.insertCell(1);
        zelle1.setAttribute('id', 'CotGScript'+i);
        var zelle2 = row.insertCell(2);
        zelle0.setAttribute('style', 'width: auto');
        zelle1.setAttribute('style', 'width: auto');
        zelle2.setAttribute('style', 'width: auto');
        var button, buttonText;
        switch (i) {
            case 0: // CotG Scripts
                ajax = null;
                ajax = new XMLHttpRequest();
                ajax.open("GET","https://greasyfork.org/de/scripts/18007-cotg-scripts",true);
                ajax.send(null);
                ajax.onreadystatechange = function() {
                    if(this.readyState == 4) {
                        if(this.status == 200) {
                            if (DEBUG) { console.dir(this.responseText); }
                            var text = this.responseText.match(regex1);
                            var version = this.responseText.match(regex2);
							checkVersion(scriptArray[0],function(version_db) {
								if (version[1] != version_db) {
									if(DEBUG) console.log('DEBUG',version,version_db);
									button = document.createElement('button');
									buttonText = document.createTextNode('Installieren');
									button.appendChild(buttonText);
									button.setAttribute('class', 'tabButton greenb');
									button.addEventListener('click',function() {
										window.location.assign("https://greasyfork.org/scripts/18007-cotg-scripts/code/CotG-Scripts.user.js");
									},false);
									document.getElementById('CotGScript0').parentElement.children[2].appendChild(button);
									if(aktiv == null) aktiv = window.setInterval(blink,1500);
								}
							});
                            document.getElementById('CotGScript0').innerHTML = '<p><h2>'+scriptArray[0]+' Ver.:'+version[1]+'</h2></p><p>'+text[1]+'</p>';
                        }
                    }
                };
                zelle0.innerHTML = '<img src=/images/city/buildings/icons/cottage.png height="64" width="64"></img>';
                break;
            case 1: // CotG Notes
                ajax = null;
                ajax = new XMLHttpRequest();
                ajax.open("GET","https://greasyfork.org/de/scripts/17497-cotg-notes",true);
                ajax.send(null);
                ajax.onreadystatechange = function() {
                    if(this.readyState == 4) {
                        if(this.status == 200) {
                            if (DEBUG) { console.dir(this.responseText); }
                            var text = this.responseText.match(regex1);
                            var version = this.responseText.match(regex2);
							checkVersion(scriptArray[1],function(version_db) {
								if (version[1] != version_db) {
									if(DEBUG) console.log('DEBUG',version,version_db);
									button = document.createElement('button');
									buttonText = document.createTextNode('Installieren');
									button.appendChild(buttonText);
									button.setAttribute('class', 'tabButton greenb');
									button.addEventListener('click',function() {
										window.location.assign("https://greasyfork.org/scripts/17497-cotg-notes/code/CotG-Notes.user.js");
									},false);
									document.getElementById('CotGScript1').parentElement.children[2].appendChild(button);
									if(aktiv == null) aktiv = window.setInterval(blink,1500);
								}
							});
                            document.getElementById('CotGScript1').innerHTML = '<p><h2>'+scriptArray[1]+' Ver.:'+version[1]+'</h2></p><p>'+text[1]+'</p>';
                        }
                    }
                };
                zelle0.innerHTML = '<img src=/images/city/buildings/icons/spost.png height="64" width="64"></img>';
                break;
            case 2: // CotG Raids
                ajax = null;
                ajax = new XMLHttpRequest();
                ajax.open("GET","https://greasyfork.org/de/scripts/17950-cotg-raids",true);
                ajax.send(null);
                ajax.onreadystatechange = function() {
                    if(this.readyState == 4) {
                        if(this.status == 200) {
                            var text = this.responseText.match(regex1);
                            var version = this.responseText.match(regex2);
							checkVersion(scriptArray[2],function(version_db) {
								if (version[1] != version_db) {
									if(DEBUG) console.log('DEBUG',version,version_db);
									button = document.createElement('button');
									buttonText = document.createTextNode('Installieren');
									button.appendChild(buttonText);
									button.setAttribute('class', 'tabButton greenb');
									button.addEventListener('click',function() {
										window.location.assign("https://greasyfork.org/scripts/17950-cotg-raids/code/CotG-Raids.user.js");
									},false);
									document.getElementById('CotGScript2').parentElement.children[2].appendChild(button);
									if(aktiv == null) aktiv = window.setInterval(blink,1500);
								}
							});
                            document.getElementById('CotGScript2').innerHTML = '<p><h2>'+scriptArray[2]+' Ver.:'+version[1]+'</h2></p><p>'+text[1]+'</p>';
                        }
                    }
                };
                zelle0.innerHTML = '<img src=/images/city/buildings/icons/barracks.png height="64" width="64"></img>';
                break;
            case 3: 
				// CotG Alse API
				ajax = null;
                ajax = new XMLHttpRequest();
                ajax.open("GET","https://greasyfork.org/en/scripts/18664-cotg-alse-api",true);
                ajax.send(null);
                ajax.onreadystatechange = function() {
                    if(this.readyState == 4) {
                        if(this.status == 200) {
                            var text = this.responseText.match(regex1);
                            var version = this.responseText.match(regex2);
							checkVersion(scriptArray[3],function(version_db) {
								if (version[1] != version_db) {
									if(DEBUG) console.log('DEBUG',version,version_db);
									button = document.createElement('button');
									buttonText = document.createTextNode('Installieren');
									button.appendChild(buttonText);
									button.setAttribute('class', 'tabButton greenb');
									button.addEventListener('click',function() {
										window.location.assign("https://greasyfork.org/scripts/18664-cotg-alse-api/code/CotG-Alse-API.user.js");
									},false);
									document.getElementById('CotGScript3').parentElement.children[2].appendChild(button);
									if(aktiv == null) aktiv = window.setInterval(blink,1500);
								}
							});
                            document.getElementById('CotGScript3').innerHTML = '<p><h2>'+scriptArray[3]+' Ver.:'+version[1]+'</h2></p><p>'+text[1]+'</p>';
                        }
                    }
                };
                zelle0.innerHTML = '<img src=/images/city/buildings/icons/hideaway.png height="64" width="64"></img>';
                break;
			case 4: // CotG Alse
                ajax = null;
                ajax = new XMLHttpRequest();
                ajax.open("GET","https://greasyfork.org/de/scripts/18127-cotg-alse",true);
                ajax.send(null);
                ajax.onreadystatechange = function() {
                    if(this.readyState == 4) {
                        if(this.status == 200) {
                            var text = this.responseText.match(regex1);
                            var version = this.responseText.match(regex2);
							checkVersion(scriptArray[4],function(version_db) {
								if (version[1] != version_db) {
									if(DEBUG) console.log('DEBUG',version,version_db);
									button = document.createElement('button');
									buttonText = document.createTextNode('Installieren');
									button.appendChild(buttonText);
									button.setAttribute('class', 'tabButton greenb');
									button.addEventListener('click',function() {
										window.location.assign("https://greasyfork.org/scripts/18127-cotg-alse/code/CotG-Alse.user.js");
									},false);
									document.getElementById('CotGScript4').parentElement.children[2].appendChild(button);
									if(aktiv == null) aktiv = window.setInterval(blink,1500);
								}
							});
                            document.getElementById('CotGScript4').innerHTML = '<p><h2>'+scriptArray[4]+' Ver.:'+version[1]+'</h2></p><p>'+text[1]+'</p>';
                        }
                    }
                };
                zelle0.innerHTML = '<img src=/images/city/buildings/icons/stonemason.png height="64" width="64"></img>';
                break;
			case 5: 
				// CotG Incoming Addon Alse
				ajax = null;
                ajax = new XMLHttpRequest();
                ajax.open("GET","https://greasyfork.org/en/scripts/18694-cotg-incoming-addon-alse",true);
                ajax.send(null);
                ajax.onreadystatechange = function() {
                    if(this.readyState == 4) {
                        if(this.status == 200) {
                            var text = this.responseText.match(regex1);
                            var version = this.responseText.match(regex2);
							checkVersion(scriptArray[5],function(version_db) {
								if (version[1] != version_db) {
									if(DEBUG) console.log('DEBUG',version,version_db);
									button = document.createElement('button');
									buttonText = document.createTextNode('Installieren');
									button.appendChild(buttonText);
									button.setAttribute('class', 'tabButton greenb');
									button.addEventListener('click',function() {
										window.location.assign("https://greasyfork.org/scripts/18694-cotg-incoming-addon-alse/code/CotG-Incoming-Addon-Alse.user.js");
									},false);
									document.getElementById('CotGScript5').parentElement.children[2].appendChild(button);
									if(aktiv == null) aktiv = window.setInterval(blink,1500);
								}
							});
                            document.getElementById('CotGScript5').innerHTML = '<p><h2>'+scriptArray[5]+' Ver.:'+version[1]+'</h2></p><p>'+text[1]+'</p>';
                        }
                    }
                };
                zelle0.innerHTML = '<img src=/images/city/buildings/icons/sawmill.png height="64" width="64"></img>';
                break;
            default:
                zelle0.innerHTML = 'Image';
                zelle2.innerHTML = 'Unbekanntes Script';
                break;
        }
    }
    // Fenster anzeigen
    document.getElementsByTagName("div")[0].appendChild(hauptmenu);
}
function closeInstaller() {
	while (hauptcontent.firstChild) {
        hauptcontent.removeChild(hauptcontent.firstChild);
    }
    hauptmenu.parentNode.removeChild(hauptmenu);
    bekannt = false;
}
// Installer beenden
xButton.addEventListener("click", function() {
    closeInstaller();
}, false);
 
// Drag+Drop Funktionen
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
    if (currentObj !== null) {
        currentObj.style.left = (currentObjX - startX) + "px";
        currentObj.style.top = (currentObjY - startY) + "px";
    }
}, false);

showInstallMenu();
closeInstaller();