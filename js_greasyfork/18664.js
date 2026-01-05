// ==UserScript==
// @name         CotG Alse API
// @description         Script to open BotAPI for CotG
// @author              Darius83
// @include             https://w1.crownofthegods.com/World00.php
// @version             1.0.1
// @grant               none
// @namespace           http://www.darius83.de
// @downloadURL https://update.greasyfork.org/scripts/18664/CotG%20Alse%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/18664/CotG%20Alse%20API.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
// Configuration
var DEBUG = false;
var NAME = GM_info.script.name;
var VERSION = GM_info.script.version;

var botName = 'Alse';
var startTime = 15000;
var intervalResponse;
var timer = setTimeout(AskForAKey,startTime);

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


function AskForAKey() {
	var eingabeFeld = document.getElementById('chatMsg');
	var sendButton = document.getElementById('sendChat');
	var clickEvent = new MouseEvent("click", {
		"view": window,
		"bubbles": true,
		"cancelable": false
	});
	var anfrageBot = '/w '+botName+' !LogMeIn';
	eingabeFeld.value = anfrageBot;
	sendButton.dispatchEvent(clickEvent);
	intervalResponse = setInterval(WaitForResponse, 50);
}

function WaitForResponse(){
	var textChat = document.getElementById('worldChat').firstElementChild.firstElementChild;
	for (var i = 0; i < textChat.children.length; i++) {
		if (textChat.children[i].children[1]) {
			var inhaltChat = textChat.children[i];
			if (inhaltChat.children[1].style['color'] == 'rgb(240, 0, 255)') {
				if (inhaltChat.children[1].firstElementChild.getAttribute('data') == botName) {
					//console.log(inhaltChat.children[1].firstElementChild.getAttribute('data'));
					var keySuche = inhaltChat.children[2].innerHTML;
					var stopIndex = keySuche.length;
					var startIndex = keySuche.indexOf('@');
					if (startIndex != -1) {
						// Lese Key aus
						var botKey = keySuche.slice(startIndex+1, stopIndex);
						//console.log(botKey);
						clearInterval(intervalResponse);
						ClearKey();
						// Trage Key in DB ein
						if (DEBUG) { console.log ('DEBUG', botKey); };
						setCookie('APIKey', botKey, 1);
						//console.log(document.cookie);
					}
				}
			}
		}
	}	
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
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

function eraseCookie(cname) {
    setCookie(cname,"",-1);
}

function ClearKey() {
	var chatWindows = [ 'worldChat', 'allianceChat', 'whisperChat', 'officerChat' ];
	var textChat;
	var inhaltChat;
	var keySuche;
	var startIndex;
	for (var j = 0; j < chatWindows.length; j++) {
		textChat = document.getElementById(chatWindows[j]).firstElementChild.firstElementChild;
		//console.log('DEBUG', chatWindows[j]);
		for (var i = 0; i < textChat.children.length; i++) {
			if (textChat.children[i].children[1]) {
				inhaltChat = textChat.children[i];
				if (inhaltChat.children[1].style['color'] == 'rgb(240, 0, 255)') {
					if (inhaltChat.children[1].firstElementChild.getAttribute('data') == botName) {
						keySuche = inhaltChat.children[2].innerHTML;
						startIndex = keySuche.indexOf('@');
						if (startIndex != -1) {
							inhaltChat.children[2].innerHTML = keySuche.slice(0, startIndex);
						}
					}

				}
			}
		}
	}
}

window.onbeforeunload = function(e) {
	eraseCookie('APIKey');
  return 'Goodbye.';
};
 
