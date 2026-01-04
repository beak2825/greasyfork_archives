// ==UserScript==
// @name        Scriptifier 2
// @version     1.2
// @description creates header
// @namespace   www.redpandanetwork.org
// @match       https://*.mturk.com/mturk/preview*
// @match       https://*.mturk.com/mturk/accept*
// @match       https://*.mturk.com/mturk/continue*
// @match       https://*.mturk.com/mturk/submit*
// @match       https://*.mturk.com/mturk/return*
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/32181/Scriptifier%202.user.js
// @updateURL https://update.greasyfork.org/scripts/32181/Scriptifier%202.meta.js
// ==/UserScript==

author = "DCI";
namespace = "www.redpandanetework.org";
icon = "http://i.imgur.com/ZITD8b1.jpg";
description = "I'm so fancy."

var hittitle = document.getElementsByClassName('capsulelink_bold')[0].innerHTML.split(">")[1].split("<")[0].trim();
var requester = document.getElementsByClassName('capsule_field_text')[0].innerHTML.trim();
var reward = document.getElementsByClassName('capsule_field_text')[1].innerHTML.split(">")[1].split("<")[0].replace("$","").trim();
var timer = document.getElementsByClassName('capsule_field_text')[3].innerHTML.trim();
var quals = document.getElementsByClassName('capsule_field_text')[4].innerHTML.trim();
var AutoAppTime = document.querySelectorAll("input[name='hitAutoAppDelayInSeconds']")[0].value;
var hitname = requester + ' - ' + hittitle + ' - ' + reward;
var identifier = ("&" + requester + hittitle + reward).replace(/\s/g, '');
var groupId = "?";

if (~window.location.toString().indexOf('groupId')){
	groupId = window.location.toString().split("groupId=")[1].split("&")[0];
}

if (document.getElementsByTagName('iframe')[0]){
	if ((document.getElementsByTagName('iframe')[0].src.indexOf("s3.amazonaws.com") != -1) || (document.getElementsByTagName('iframe')[0].src.indexOf("mturkcontent.com") != -1)) {
		document.getElementsByTagName('iframe')[0].src = (document.getElementsByTagName('iframe')[0].src + identifier);
		var frameurl = document.getElementsByTagName('iframe')[0].src.toString();
		var includeurl = frameurl.split("/")[0] + "//" + frameurl.split("/")[1] + frameurl.split("/")[2]  + "/*" + identifier + "*";
	} 
	else {
		var frameurl = document.getElementsByTagName('iframe')[0].src.toString();
		var includeurl = frameurl.split("/")[0] + "//" + frameurl.split("/")[1] + frameurl.split("/")[2]  + "/*";				
	}
} 
else {
  var frameurl = "no iframe";
	var includeurl = "https://www.mturk.com/mturk/*";
}

var domain = frameurl.split("/")[0] + "//" + frameurl.split("/")[1] + frameurl.split("/")[2]  + "/*";

var metafull = 
'// ==UserScript==\n' +
'// @name ' + hitname + '\n' + 
'// @description ' + description + '\n' + 
'// @version 1.0\n// @author ' + author + '\n' + 
'// @namespace ' + namespace + '\n' + 
'// @icon ' + icon + '\n' + 
'// @include ' + includeurl + '\n' +
'// @groupId ' + groupId + '\n' + 
'// @auto_approve ' + AutoAppTime/86400 + ' days\n' +
'// @timer ' + timer + '\n' +
'// @quals ' + quals + '\n' +
'// @frameurl ' + frameurl + '\n' + 
'// @grant GM_setClipboard\n' +
'// @grant GM_openInTab\n' +
'// @grant GM_setValue\n' +
'// @grant GM_getValue\n' +
'// @grant GM_deleteValue\n' +
'// @grant GM_xmlhttpRequest\n' +  
'// @require http://code.jquery.com/jquery-latest.min.js\n' +     
'// ==/UserScript==\n\n' +
'window.focus();';	

var capsule = document.getElementsByTagName('table')[10];
var button = document.createElement('input');
button.setAttribute('type','button');
button.setAttribute('name','Scriptify');
button.setAttribute('value','Copy Data');
capsule.appendChild(button);
button.addEventListener("click", function(e){
	GM_setClipboard(metafull);
});
	






