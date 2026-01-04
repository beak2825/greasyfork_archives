// ==UserScript==
// @name           Temp Boost Button for Q
// @namespace      pbr/aosp
// @include        https://glb.warriorgeneral.com/game/bonus_tokens.pl?player_id=*
// @copyright      2025, PeeJJK
// @version        1.1.1
// @description    Temp Boost Button Script for Q
// @license        MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/537802/Temp%20Boost%20Button%20for%20Q.user.js
// @updateURL https://update.greasyfork.org/scripts/537802/Temp%20Boost%20Button%20for%20Q.meta.js
// ==/UserScript==
 
var count = 0;
 
var _xmlHttp;
var _xmlHttpQueue = Array();
var _xmlSending = 0;
var _xmlTimeoutTimer;
 
function getXMLHTTP() {
	var A = null;
	try {
		A = new ActiveXObject("Msxml2.XMLHTTP")
	} catch(e) {
	try {
		A = new ActiveXObject("Microsoft.XMLHTTP")
		} catch(oc) {
			A = null;
		}
	}
	if(!A && typeof XMLHttpRequest != "undefined") {
		A = new XMLHttpRequest();
	}
 
	return A;
}
 
function addToXMLqueue(path, mode, flags, timeout, timeout_callback, method) {
	var newObj = new Object();
	newObj.path = path;
	newObj.mode = mode;
	newObj.flags = flags;
	newObj.timeout = timeout;
	newObj.timeoutCallback = timeout_callback;
 
	if (!method) {
		method = 'POST';
	}
 
	newObj.method = method;
 
	_xmlHttpQueue.push(newObj);
}
 
function runXMLqueue() {
	if (_xmlSending == 0) {
		if (_xmlHttpQueue.length > 0) {
			var queueObj = _xmlHttpQueue.shift();
			getData(queueObj.path, queueObj.mode, queueObj.flags, queueObj.timeout, queueObj.timeoutCallback, queueObj.method);
		}
	}
    count++;
    console.log("Temp boost "+count+" completed.");
    document.getElementById('TempBoosts').value = count+" BOOSTS COMPLETED.";
}
 
function getData(path, mode, flags, timeout, callback, method) {
	_xmlHttp = getXMLHTTP();
	if(_xmlHttp){
		_xmlSending = 1;
		//_xmlHttp.open("GET", path + '?mode=' + mode + '&' + flags, true);
		_xmlHttp.open(method, path, true);
		if (timeout) {
			if (_xmlTimeoutTimer) {clearTimeout(_xmlTimeoutTimer);}
			_xmlTimeoutTimer = setTimeout('handleXMLtimeout();' + callback, timeout);
		}
		_xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		_xmlHttp.onreadystatechange=function() {
			if (_xmlHttp.readyState==4) {
				if (_xmlHttp.responseText) {
					eval(_xmlHttp.responseText);
				}
				if (_xmlTimeoutTimer) {clearTimeout(_xmlTimeoutTimer);}
				_xmlSending = 0;
				runXMLqueue();
			}
		}
	}
 
	_xmlHttp.send('mode=' + mode + '&' + flags)
}
 
function generalHTTPSend(path) {
	_xmlHttp = getXMLHTTP();
	if(_xmlHttp){
		_xmlSending = 1;
		_xmlHttp.open("GET", path, true);
		_xmlHttp.onreadystatechange=function() {
			if (_xmlHttp.readyState==4&&_xmlHttp.responseText) {
				eval(_xmlHttp.responseText);
			}
			_xmlSending = 0;
		}
	}
 
	_xmlHttp.send(null)
}
 
function handleXMLtimeout() {
	clearTimeout(_xmlTimeoutTimer);
 
	if (_xmlSending && _xmlHttp) {
		_xmlHttp.abort();
		_xmlSending = 0;
		runXMLqueue();
	}
}
 
function clearXMLqueue() {
	clearTimeout(_xmlTimeoutTimer);
	_xmlHttp.abort();
	_xmlSending = 0;
	_xmlHttpQueue = Array();
}
 
 
/*-----------------------------------------------------------------------------------------------------------------------*/
 
function tempBoosts() {
 
    let count = 0;
 
    let speed = ['4858393','4869947','4869960','4869962','4875629','4875651','4876011','4876623','4876985'];
    let strength = ['4858393','4869962','4875655','4875656','4875659','4875661','4875662','4875668','4876985','4879826'];
    let throwing = ['4879826'];
    let tackling = ['4869947'];
    let catching = ['4869960'];
    let carrying = ['4875629'];
    let agility = ['4875651','4876011','4876623'];
    let blocking = ['4875655','4875656','4875659','4875661','4875662','4875668'];
    let vision = '';
    let kicking = '';
    let punting = '';
    let confidence = '';
 
    for (var a = 0; a < speed.length; a++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+speed[a]+'&att=speed&bonus=5');
    }
    for (var b = 0; b < throwing.length; b++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+throwing[b]+'&att=throwing&bonus=5');
    }
    for (var c = 0; c < strength.length; c++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+strength[c]+'&att=strength&bonus=5');
    }
    for (var d = 0; d < kicking.length; d++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+kicking[d]+'&att=kicking&bonus=5');
    }
    for (var e = 0; e < agility.length; e++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+agility[e]+'&att=agility&bonus=5');
    }
    for (var f = 0; f < confidence.length; f++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+confidence[f]+'&att=confidence&bonus=5');
    }
    for (var g = 0; g < catching.length; g++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+catching[g]+'&att=catching&bonus=5');
    }
    for (var h = 0; h < tackling.length; h++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+tackling[h]+'&att=tackling&bonus=5');
    }
    for (var i = 0; i < blocking.length; i++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+blocking[i]+'&att=blocking&bonus=5');
    }
    for (var j = 0; j < vision.length; j++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+vision[j]+'&att=vision&bonus=5');
    }
    for (var k = 0; k < punting.length; k++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+punting[k]+'&att=punting&bonus=5');
    }
    for (var l = 0; l < carrying.length; l++) {
        addToXMLqueue('/game/bonus_tokens.pl', 'temp_bonus', 'player_id='+carrying[l]+'&att=carrying&bonus=5');
    }
    runXMLqueue();
}
 
// add button to do temp boosts
const newNode1 = document.createElement("div");
newNode1.innerHTML = '<input id="TempBoosts" class="button-1" type="button" value="TEMP BOOSTS" onclick="tempBoosts();" style="float: left; margin: 5px; height: 25px; width: 140px; font-weight: bold; background-color: #0095ff;  border: 1px solid transparent;  border-radius: 3px;  box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;  box-sizing: border-box;  color: #fff;  cursor: pointer;  display: inline-block;  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;  font-size: 13px;  font-weight: 400;  line-height: 1.15385;  margin: 0;  outline: none;  padding: 8px .8em;  position: relative;  text-align: center;  text-decoration: none;  user-select: none;  -webkit-user-select: none;  touch-action: manipulation;  vertical-align: baseline;  white-space: nowrap;" />';
const parentDiv1 = document.getElementById("level_ups").parentNode;
let sp1 = document.getElementById("level_ups");
parentDiv1.insertBefore(newNode1, sp1);
// add event listeners to the button
var el1 = document.getElementById("TempBoosts");
if (el1.addEventListener) {
    el1.addEventListener("click", tempBoosts, false);
} else if (el1.attachEvent) {
    el1.attachEvent('onclick', tempBoosts);
}