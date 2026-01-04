// ==UserScript==
// @name        Ruqqus9x helper (unmaintained)
// @namespace   https://ruqqus.com/+RuqqusInThe90s     
// @grant       none
// @match       https://ruqqus.com/*
// @match       https://dev.ruqqus.com/*
// @match       https://linode.ruqqus.com/*
// @match       http://ruqqus.localhost:8000/*
// @version     1.6
// @author      Nemu
// @runAt       document-end
// @description This userscript is no longer maintained due to ruqqus implementing censorship. This userscript helps Ruqqus9x by removing custom guild CSS. By itself, it does nothing useful.
// @downloadURL https://update.greasyfork.org/scripts/430312/Ruqqus9x%20helper%20%28unmaintained%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430312/Ruqqus9x%20helper%20%28unmaintained%29.meta.js
// ==/UserScript==

/*Add Windows 95 startup sound eater egg*/
(function() {
    "use strict";
    var up = 38, down = 40, left = 37, right = 39, A = 65;
    var	sonicCode = [up,down,left,right,A];
    var sonicDetected = [];
    function attachCustomEvent(el, eventName, desiredFunction) {
	    if (el.addEventListener) {
		    el.addEventListener(eventName,desiredFunction,false);
	    } else {
		    el.attachEvent('on' + eventName,desiredFunction);
	    }
    }
    function detachCustomEvent(el, eventName, desiredFunction) {
	    if (el.removeEventListener) {
		    el.removeEventListener(eventName,desiredFunction,false);
	    } else {
		    el.detachEvent('on' + eventName,desiredFunction);
	    }
    }
    function startUpSonic() {
	    detachCustomEvent(document,"keydown",isSonicKey);
	    sonicIsDetected();
    }
    function isSonicKey(e) {
	    var evt = e || window.event;
        var key = evt.keyCode ? evt.keyCode : evt.which;
	    var codeOk = true;
        sonicDetected.push(key);
        if (sonicDetected.length < sonicCode.length) {
		    for (var i = 0, max = sonicDetected.length; i < max ; i++) {
        		if(sonicDetected[i] !== sonicCode[i]) {
	        		codeOk = false;
        		}
        	}
        	if (!codeOk) {
        		sonicDetected = [];
        		sonicDetected.push(key);
        	}
        } else if (sonicDetected.length === sonicCode.length) {
        	for (var j = 0, max = sonicDetected.length; j < max ; j++) {
        		if(sonicDetected[j] !== sonicCode[j]) {
	        		codeOk = false;
        		}
        	}
        	sonicDetected = [];
        	if (codeOk) {
	        	startUpSonic();
        	}
        } else {
	        sonicDetected = [];
        }
    }
    attachCustomEvent(document,"keydown",isSonicKey);
})();
function sonicIsDetected() {
	let sound95 = document.createElement("audio");
  sound95.setAttribute("id", "win95sound");
  sound95.innerHTML = "<source src=https://soundbible.com/mp3/Windows_95_Startup-Microsoft-2077254053.mp3 type=audio/mpeg>";
  sound95.play();
}

/*Add clock to taskbar*/
setInterval(taskbarclock, 1000);
function taskbarclock() {
var calculatedtime = new Date()
  .toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: true})
  .toUpperCase();
  document.getElementsByTagName("body")[0].setAttribute("taskbartime", calculatedtime);
}

/*Should Ruqqus9x attempt to remove customm CSS? (this may prevent conflicts)*/
var removecustomcss = true;
/*Set to "true" to remove custom CSS; "false" to leave it on.*/

var searchbar = document.getElementsByClassName("search")[0].children;
searchbar[0].setAttribute("placeholder", "Type the name of a user, guild, or post, and Ruqqus will open it for you"); /*Ajust search placeholder text to Windows-esque run text*/

if (removecustomcss == true) {
        console.log("Attempting to remove custom CSS...");
        document.getElementById("board-css").remove();
    }
else {console.log("Custom CSS was not removed because the variable \"removecustomcss\" is set to \"" + removecustomcss + "\"")}