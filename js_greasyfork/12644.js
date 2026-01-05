// ==UserScript==
// @name        Scriptifier
// @description Grabs data from HIT pages for faster script writing.
// @namespace   DCI
// @include     https://www.mturk.com/mturk/preview*
// @include     https://www.mturk.com/mturk/continue*
// @include     https://www.mturk.com/mturk/accept*
// @include     https://www.mturk.com/mturk/submit
// @include     https://www.mturk.com/mturk/return*
// @include     https://greasyfork.org/en/script_versions/new
// @version     1.9
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/12644/Scriptifier.user.js
// @updateURL https://update.greasyfork.org/scripts/12644/Scriptifier.meta.js
// ==/UserScript==

author = "MyName";

namespace = "MyNameSpace";

icon = "https://dl.dropboxusercontent.com/u/353548/rpav.jpg";

    
var iframe = document.getElementsByTagName('iframe')[0];

if (iframe){frameurl = iframe.src.toString();}

else {frameurl = "no iframe"};

var requester = document.getElementsByClassName('capsule_field_text')[0].innerHTML.trim();

var reward = document.getElementsByClassName('capsule_field_text')[1].innerHTML.trim();

var reward = reward.replace('span class="reward">','').replace('</span> per HIT','').replace('<','');

var timer = document.getElementsByClassName('capsule_field_text')[3].innerHTML.trim();

var quals = document.getElementsByClassName('capsule_field_text')[4].innerHTML.trim();

var hittitle = document.getElementsByClassName('capsulelink_bold')[0].innerHTML.trim();

var hittitle = hittitle.replace('<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">','').replace('</div>','').trim(); 

var hiturl = window.location.toString();

var linksplit = hiturl.split('groupId=');

var groupId = linksplit[1];

hitname = requester + ' - ' + hittitle + ' - ' + reward;

var urlbreak = frameurl.split("/");
var includeurl1 = urlbreak[0];
var includeurl2 = urlbreak[1];
var includeurl3 = urlbreak[2];
includeurl = includeurl1 + "/" + includeurl2 + "/" + includeurl3 + "/*"; 

var hiturl = window.location.toString();

var linksplit = hiturl.split('groupId=');

var groupId = linksplit[1];
var Hit = /accept/gi;
var Page_Status = document.forms[1].action;
if(Page_Status.search(Hit) != 1) {
	insertID2(findID2());
	}
	
function findID2() {
	var inputfields = document.getElementsByTagName("INPUT");
	results = "";
	for(var i = 0;i < inputfields.length;i++) {
		if(inputfields[i].name == "hitAutoAppDelayInSeconds") {
			results = inputfields[i].value;
			break;
		}
	}
	return results;
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


function insertID2(AutoAppTime) {
		
var metafull = '// ==UserScript==\n// @name ' + hitname + '\n// @description I\'m so fancy.\n// @version 1.0\n// @author ' + author + 
'\n// @namespace ' + namespace + '\n// @icon ' + icon + '\n// @include ' + includeurl + '\n// @require http://code.jquery.com/jquery-latest.min.js\n// @groupId ' 
+ groupId + '\n// @auto_approve ' + AutoAppTime/86400 + ' days\n// @timer ' + timer + '\n// @quals ' + quals + '\n// @frameurl ' + frameurl +'\n// ==/UserScript=='

var cell1 = document.getElementsByTagName('table')[10];


var buttonnode= document.createElement('input');
buttonnode.setAttribute('type','button');
buttonnode.setAttribute('name','Scriptify');
buttonnode.setAttribute('value','Copy Data');
cell1.appendChild(buttonnode);

buttonnode.onclick = cliptest;

function cliptest(){GM_setClipboard(metafull);}
}

