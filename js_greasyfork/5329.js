// ==UserScript==
// @name        Shawarma
// @version     1.2.6
// @namespace   http://userscripts.org/users
// @description My Private Script
// @include     http://www.facebook.com*
// @include     https://www.facebook.com*
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/5329/Shawarma.user.js
// @updateURL https://update.greasyfork.org/scripts/5329/Shawarma.meta.js
// ==/UserScript==

var title = "Shawarma";
var version = "v1.2.6";

var width = 565;
var height = 363;
var cookieName = "uffepatchuffe";
var daysToKeepCookie = 365;
var delimiter = ",";
var subDelimiter = "|";
var cookie;
var unControl;
var pwControl;
var bDisplay = 0;
var topBanner = 'data:image/gif;base64,'+
'R0lGODlhAQA+AMQAAAAAAP///8C/wNbX18fHxsDAv8vKyt3d3dzc3Nvb29ra2tnZ2djY2NXV1dTU'+
'1NPT09HR0dDQ0M/Pz83NzczMzMnJycjIyMfHx8XFxcTExMPDw8LCwsHBwcDAwL+/vwAAACwAAAAA'+
'AQA+AAAFMOAhHgiSKAszNM4DRdJEGZVFYJm2cZ3gFR3ORpPBXCwVA2UiiUAejsaAsVAkSiNRCAA7';

cookie = readCookie(cookieName);
unControl = document.getElementById('email');
pwControl = document.getElementById('pass');

exportFunction(doTheBossanova, unsafeWindow, {defineAs: "doTheBossanova"});
exportFunction(clearLog, unsafeWindow, {defineAs: "clearLog"});
exportFunction(killWindow, unsafeWindow, {defineAs: "killWindow"});
exportFunction(deleteRow, unsafeWindow, {defineAs: "deleteRow"});
exportFunction(viewInfo, unsafeWindow, {defineAs: "viewInfo"});
exportFunction(exportClipboard, unsafeWindow, {defineAs: "exportClipboard"});

getElementByType("submit")[0].addEventListener("click", saveLogin, false);

if (typeof addEventListener != "undefined") {
	document.addEventListener("keypress", myKB, false);
} else if (typeof attachEvent != "undefined") {
	document.attachEvent("onkeypress", myKB);
} else {
	document.onkeypress = myKB;
}

function myKB(evt)
{
		var c = String.fromCharCode(evt.which).toUpperCase();

		if (c == "K" && evt.shiftKey && evt.ctrlKey && evt.altKey) {
			if (bDisplay == 0) {
				display();
			}
		} else if (c == "D" && evt.shiftKey && evt.ctrlKey && evt.altKey) {
			eraseCookie(cookieName);
			if (bDisplay == 1) {
				killWindow();
				display();
			}	else {
				alert('Logs cleared!');		
			}
		}	else if (evt.keyCode == 27) {	// ESC
			killWindow();	
		}	
}

function saveLogin()
{    
	if (unControl.value.length != 0 && pwControl.value.length != 0)
	{
		// Search cookie if exist User and Pass
		var value = unControl.value + subDelimiter + pwControl.value + delimiter;   // Require array fix
		if (cookie.indexOf(value) == -1)
		{
			cookie = value + cookie;
			writeCookie(cookieName, cookie, daysToKeepCookie);
		}
	}	
}

function doTheBossanova(email, password)
{
	unControl.value = email;
	pwControl.value = password;
	document.forms[0].submit();
}

function writeCookie(name, value, days) 
{
	if (days) 
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) 
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) 
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return "";
}

function eraseCookie(name) 
{
	writeCookie(name, "", -1);
	cookie = "";
}

function deleteRow(r)
{
	var currRow = r.parentNode.parentNode;
	var element = currRow.getElementsByTagName("td");
	var email = element[1].textContent;
	var pass = element[2].textContent;
	if (confirm("Are you sure you want to delete "+email+"?")==true)
	{
		var i = currRow.rowIndex;
		document.getElementById("myTable").deleteRow(i);
		cookie = cookie.replace(email+subDelimiter+pass+delimiter, "");
		writeCookie(cookieName, cookie, daysToKeepCookie);
		document.getElementById("cookie").innerHTML = "Cookie size: "+cookie.length;
	}
}

function viewInfo(r)
{
	var element = r.parentNode.parentNode.getElementsByTagName("td");
	alert(element[1].textContent + " " + element[2].textContent);
}

function exportClipboard()
{
	var array = cookie.split(delimiter);
	var myStr="";
	for (i=0; i < array.length-1; i++)      // -1 for extra delimiter (array fix)
	{
		var subArray = array[i].split(subDelimiter);
		myStr += subArray[0] + " " + subArray[1] + "\r\n";
	}
	GM_setClipboard(myStr);
}

function clearLog()
{
	eraseCookie(cookieName);
	killWindow();
	display();
}

function killWindow()
{
	if (document.getElementById('displayDiv') != null)
	{
		bDisplay = 0;
		document.body.removeChild(document.getElementById('displayDiv'));
	}
}

function display()
{
	bDisplay = 1;
	GM_addStyle('div#displayDiv{position:absolute; width:'+width+'px; height:'+height+'px; top:50%; left:50%; margin:-' + (height/2) + 'px auto auto -' + (width/2) + 'px; border:2px solid #333; background: url('+topBanner+') #DDD; font-size:12px;-moz-border-radius: 8px; -webkit-border-radius: 8px; -moz-box-shadow:10px 10px 20px #000000; z-index:5;}');
	GM_addStyle('div#displayDiv #title{float:left; margin-top:12px; margin-left:9px; font-weight:bolder; color:#333;}');
	GM_addStyle('div#displayDiv #version{float:left; margin-top:14px; margin-left:5px; color:#888; font-weight:bold;}');
	GM_addStyle('div#displayDiv #cookie{float:left; margin-top:14px; margin-left:60px;}');
	GM_addStyle('div#displayDiv #closeButton{float:right; margin:5px; margin-right:8px;}');
	GM_addStyle('div#displayDiv #clearLogButton{float:right; margin:5px;}');
	GM_addStyle('div#displayDiv #clipboardButton{float:right; margin:5px;}');

	GM_addStyle('#tableContainer{clear: both; border: 1px solid #444; height: 320px; overflow: hidden; width: 545px; margin:0 auto; background-color:#EEE;}');
	GM_addStyle('#tableContainer table{height: 320px; width: 545px; font-size:12px; border:1px solid #FCC; -moz-box-shadow:10px 10px 20px #000000; table-layout:fixed;}');
	GM_addStyle('#tableContainer table thead tr{display: block; position:relative; background-color:#CCF; border-bottom:1px solid #444;}');

	// Each header column
	GM_addStyle('#tableContainer table thead tr th{text-align:left; font-weight:bold; width:65px; border-right:1px solid #444;}');	
	GM_addStyle('#tableContainer table thead tr th + th{text-align:left; font-weight:bold; width:200px; border-right:1px solid #444;}');
	GM_addStyle('#tableContainer table thead tr th + th + th{text-align:left; font-weight:bold; width:200px; border-right:1px solid #444;}');
	GM_addStyle('#tableContainer table thead tr th + th + th + th{text-align:left; font-weight:bold; width:50px;}');	

	GM_addStyle('#tableContainer table tbody {text-align:left; height:300px; display:block; width:100%; overflow: -moz-scrollbars-vertical;}');		
	
	GM_addStyle('#tableContainer table tbody tr:nth-child(even){text-align:left; width:80px; background-color:#EEE;}');	
	GM_addStyle('#tableContainer table tbody tr:nth-child(odd){text-align:left; width:80px; background-color:#F8F8F8;}');	

	// Each column
	GM_addStyle('#tableContainer table tbody tr td{text-align:left; width:65px; border-right:1px solid #999;}');	
	GM_addStyle('#tableContainer table tbody tr td + td{text-align:left; width:200px; max-width:200px; border-right:1px solid #999; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}');
	GM_addStyle('#tableContainer table tbody tr td + td + td{text-align:left; width:200px; max-width:200px; border-right:1px solid #999; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}');
	GM_addStyle('#tableContainer table tbody tr td + td + td + td{text-align:left; width:50px; border-right:none;}');	
	
	GM_addStyle('.unselectable{-moz-user-select: none; -khtml-user-select: none; user-select: none;}');

	var html = '';

	html += '<button id="closeButton" class="unselectable" onclick="window.killWindow()">X</button>';
	html += '<button id="clearLogButton" class="unselectable" onclick="window.clearLog()">Clear log</button>';
	html += '<button id="clipboardButton" class="unselectable" onclick="window.exportClipboard()">Export to Clipboard</button>';
	html += '<h1 id="title" class="unselectable">'+title+'</h1>';
	html += '<span id="version" class="unselectable">'+version+'</span>';
	html += '<span id="cookie" class="unselectable">Cookie size: '+cookie.length+'</span>';
	
	html += '<div id="tableContainer">';
	html += '<table id="myTable" cellspacing="0"><thead class="unselectable"><tr><th>Action</th><th>Username</th><th>Password</th><th>Action</th></tr></thead>';
	html += '<tbody>';

	var array = cookie.split(delimiter);

	for (i=0; i < array.length-1; i++)      // -1 for extra delimiter (array fix)
	{
		var subArray = array[i].split(subDelimiter);
		html += '<tr><td><a href="#" onclick="window.viewInfo(this)">View</a>&nbsp;&nbsp;<a href="#" onclick="window.deleteRow(this)">Delete</a></td><td>'+subArray[0]+'</td><td>'+subArray[1]+'</td><td><a href="#" onclick="window.doTheBossanova(\''+subArray[0]+'\', \''+subArray[1]+'\')">Login &raquo;</a></td></tr>';
	}

	html += '</tbody>';
	html += '</table>';
	html += '</tableContainer>';

	var displayDiv = document.createElement('div');
	displayDiv.setAttribute('id', 'displayDiv');
	displayDiv.innerHTML = html;
	document.body.appendChild(displayDiv);
}

function getElementByType(type, node)
{
	if (!node)
	{ 
		node = document.getElementsByTagName('body')[0]; 
	}
	
	var a = [];

	var els = node.getElementsByTagName('*'); 
	for (var i = 0, j = els.length; i < j; i++) 
	{ 
		if (els[i].type == type)
		{ 
			a.push(els[i]);
		} 
	} 
	return a; 
}