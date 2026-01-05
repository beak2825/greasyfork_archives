// ==UserScript==
// @name           EarthEmpiresRecruiter
// @namespace      EarthEmpiresRecruiter
// @description    EarthEmpiresRecruiter created by Jabroni134 from SoL
// @include        http://www.earthempires.com/*/messages
// @match          http://www.earthempires.com/*/messages
// @include        https://www.earthempires.com/*/messages
// @match          https://www.earthempires.com/*/messages
// @version        2.1
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_listValues
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/27229/EarthEmpiresRecruiter.user.js
// @updateURL https://update.greasyfork.org/scripts/27229/EarthEmpiresRecruiter.meta.js
// ==/UserScript==

//==========================================
//Get/Set Functions
//Prefixes server name to settings
//==========================================
function getSetting(key,value){
        if (typeof value == 'number') value+="";
        return GM_getValue(getServer()+"_"+key,value);
}

function setSetting(key,value){
        if (typeof value == 'number') value+="";
        return GM_setValue(getServer()+"_"+key,value);
}

// Simple replacement of getelementbyid with $ to save typing
function $(variable)
{
	if(!variable) return;
	if (document.getElementById(variable)) return document.getElementById(variable);
}

//==========================================
//Returns the server
//==========================================

var _server = null;
function getServer(){
    if(_server === null)
    {
        var regex = /http:\/\/www\.earthempires\.com\/([a-z]+)\/messages/;
        var result = regex.exec(document.referrer);
        if(result === null)
        {
            regex = /http:\/\/www\.earthempires\.com\/([a-z]+)\/messages/;
            result = regex.exec(document.URL);
        }
        if (result !== null)
        {
            _server = result[1];
        }
    }
    return _server;
}


/////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

function submit(t) {
	var cfield = document.getElementsByName('targetnum');
	LastCountryNumber = cfield[0].value;
	var field = document.getElementsByName('messagetext');
	LastMessage = field[0].value;
	setSetting( 'LastCountryNumber', LastCountryNumber );
	setSetting( 'LastMessage', LastMessage);
	return true;
}


var LastCountryNumber = getSetting( 'LastCountryNumber', '');
var LastMessage = getSetting( 'LastMessage', '');

if(LastCountryNumber !== ''){
	var cfield = document.getElementsByName('targetnum');
	cfield[0].value = parseInt(LastCountryNumber)+1;
}

if(LastMessage !== ''){
	var field = document.getElementsByName('messagetext');
	field[0].value = LastMessage;
}

var inputs = document.getElementsByTagName('input');
for (i = 0; i < inputs.length; i++) {
	if (inputs[i].type == 'submit') {
		break;
	}
}

 newDiv = document.createElement("div");
 newDiv.innerHTML = '<button id="submit" value="Send Message">Send Message!!!</button>';
 inputs[i].parentNode.replaceChild(newDiv, inputs[i]);
$("submit").addEventListener("click", function(){submit(this);}, false);