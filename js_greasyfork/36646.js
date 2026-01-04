/*!
// ==UserScript==
// @name           KoC Fast Stats Logger
// @namespace     http://www.gamerswastelands.co.za/clicker
// @include        http://www.kingsofchaos.com/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @grant GM_log
// @description Automatic Creations
// @version 0.0.1.20171223203800
// @downloadURL https://update.greasyfork.org/scripts/36646/KoC%20Fast%20Stats%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/36646/KoC%20Fast%20Stats%20Logger.meta.js
// ==/UserScript==
*/

// Author: Shane Mackenzie

var cver = 1.7;
var gears = "data:image/gif;base64,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" +
"uOeu++689+7776cHAQA7";
var targetsimg = "data:image/gif;base64,R0lGODlhiQAXAPcAAAAAAP///7m5ua+vr6ysrIB3d2s/QEsoKVMuL3peX4hvcGFMTWNPUKyYmca3" +
"uGhaW3FjZGteX5aKi7KlprSqq6CXmKujpL62t83FxrOsrbWur7evsVhUVbm1trSwsbewsrKprK2n" +
"qV5bXLq3uLCtrvDt7snGx8XCw5uWmLWwsrKtr97Z2/37/NTS08/Nzs3LzMG/wL27vK+trvTx87my" +
"t7SutK2qrfXz9fj3+PLx8vHw8fDv8OLh4t7d3tLR0tDP0La1trSztLKxsrCvsLq3u7Gvs/v6/Lu6" +
"vNva3cbFyN/f4uHh48vLzc3Nzq+vsKytr83Oz76/wODi4+bo6La4uNfY2LS1ta+wsLG2tcrNzL2/" +
"vt/i3/z+/Lm7ua+xr/Hy8evs6+fo583OzcPEw8HCwcDBwLq7ura3trW2tbO0s7GysYqLirq9ubW4" +
"tKutqdzd27O0sbm6tq2tquXl49HRz7e3ta+vrfz8++zs6+rq6eHh4MzMy8rKycjIx8DAv76+vby8" +
"u7q6ubW1tLKysbCwr6+rpPHw7+no5+Pi4dnY18/OzcXEw7KxsLCurbOwrygkI4p9fGZXVp6Lin5m" +
"ZVcjI1omJkYfH1wpKWtAP2s/P3JKShQNDWxSUnxfX1NAQIZtbR0YGI12dpF6epeBgaSSkpSGhpOF" +
"hX90dAwLC6aZmaebm3hwcKecnKOZma+lpa2jo6mgoIB5eYqDg87FxbCoqJWPj7myspqUlM3GxpeS" +
"ksjCwqqlpaCbm87JyU1LS7aysq2pqdPPz7+8vL26urCtra+srKGenuTh4ejm5ufl5dbU1Pr5+fj3" +
"9/Lx8eTj4+Pi4uLh4eDf397d3d3c3Nva2tjX19bV1dPS0tHQ0NDPz8fGxr++vra1tbSzs7Cvr6+u" +
"rq2srKyrq6moqKSjo5ybm/7+/vz8/Pv7+/j4+Pb29vPz8+7u7uvr6+np6ejo6Ofn5+Xl5d/f39jY" +
"2M7Ozs3Nzb29vbi4uLe3t7Ozs7KysrCwsK6urq2trTMzMy4uLv///ywAAAAAiQAXAAAI/wARPIgV" +
"r8IxAJJEPFh1qkDDAhAjSpwYq6LFihMzatz4oEDHByBDihxJsuQDgSZTjvQEcgEDkAwKVFsxzRkB" +
"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" +
"TJyxBwpLJyAAOw==";
var linksimg = "data:image/gif;base64,R0lGODlhiQAWAPcAAAAAAP///+Li4ri4t7a5ubW1ta+vr6ysrFwpKYdsbbGnquXi49LHy8G8vrWv" +
"spGOkPf09tnW2NDNz725vOji6N/Z3+bh5u/r77i1uOvo69rY2uzr7Li4vuvr8dnZ3/Dw9Ofn67a2" +
"ubW1uN/f4sLCxb6+wff3+evr7enp68/P0cfHyW5ub/T09fHx8ufn6N/f4NbW16+1teLo6Nnf3+Dl" +
"5cHFxert7ejr69bZ2b7BwY+Rke7w8OHj48LExFtcXLO0tLCxsba5uLCzsq6xsKyvrsDCwbi+uK+0" +
"r9nf2cfMx8rOyujr6OHk4d/i377Bvufp59bZ1ba3tZCRjr6+uOjo4t/f2bq6t7S0sbGxruPj4OLi" +
"39nZ1tbW0+/v7evr6fDw7+7u7bu2tWMzM2Q1NGU1NWM0NGc3N2U2Nm1BQW5CQnBHR3JJSXZNTXhP" +
"T3pRUXtSUnxTU3lRUXNOTnhTU39ZWYFbW4JcXH9aWoNeXodlZYxqaotpaYpra45vb4RoaJFzc5x9" +
"fZF1dZF2dpl9fZZ7e5V6eqKHh5B4eKaLi6CIiJ+Hh5mCgqSMjJeBgaqSkqePj66WlqyUlJmEhJ+O" +
"jrGgoLuqqrmoqLempralpbKkpLCioq2goMCzs6qfn7Knp6GXl66kpNbLy3Vvb9XLy9DGxsW7u9jO" +
"ztbMzM7FxcO7u8/IyM7Hx764uMjCwuji4t/Z2fHs7MTAwL66urm1tbaysvXx8d/b2726ury5ubu4" +
"uPbz8+vo6OLf38fExMK/v3p5eWhnZ2BfX5uamv39/fr6+vn5+ff39/Pz8/Dw8O/v7+zs7Ovr6+rq" +
"6ujo6Obm5uXl5eHh4d/f39vb29nZ2djY2NXV1dPT09LS0tHR0dDQ0M/Pz83NzcrKysnJycfHx8XF" +
"xcLCwsHBwb6+vry8vLu7u7m5uba2trOzs66urq2trY6OjldXV////wAAAAAAAAAAAAAAAAAAAAAA" +
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAiQAWAAAI/wADwKgQ" +
"TQCVDOrAsCA2LIDDhxAjSpxIEeKwixeJaSRmrKMxFiBZtBjZAoyyk8q8eGG2jJnLl8xUelmGUhmY" +
"mzhx1lwmcybNkzd3CBW67NkvHDMKNlsGIECEpAKagdBhxNoNCA0rat1acRjHWi1gLWsmYES0ChGs" +
"Zcu2rS0qAgVmFYhx4ACRungNHDBApC8QIDF+RCFAuHDhKD9+/O3b14CBAgWiYBggThw4cOIMCPsF" +
"o4pSpgGgTGsS9caDAVZZZOXKmrVXYyM73CDb5CyMtWzbJuFQQMTcvXiD73VsAAuWK5EHWFnO3MqA" +
"KAWuGCdOvcCA6+KcXHai+ReUaJ+b4v94VZBCBilTrC1T3br9Vo2wR3ohKyDajC23s0loq8JIXAcx" +
"3AWccHrV5RgQiUVx3YLXIaaYY8E55kABGFiX3WUldIfDNOE55cFn6ohjFVbulTjRa2CJRZZZaKmV" +
"2zZvxfWbXQTuxdhfgQ1mmGEOLsaYY5BJRpllmHUHA3lRgQbFKyMIIMMN6lSVAXsmVunQa7HNJkBt" +
"FeT34m69/VagcMM5ZhxyCjbH3HPRTUcdkAteCA53my3ZYQQcRrXEA6yoR6WVJnoliR+E+kHbWQgg" +
"IMyXvPkWgzpoIEBmmcUdF5mCDDaYGBAQ5mXAhBVSph04GdYJ1VJNRYBkM148UNUyJAL/GihHkCCw" +
"hjWHVpDoLIyGSRcdZUxK3ZmR7cjjpkAwRgSQkU1W2WWZbfZUhzggodQNUnDg52qytoclAnhoyaWX" +
"bW0DpqMHyCFpXXiggQelxKappnPQSYfFm3BiNyqdnK0K2hZIkHaQFKhNyW23rnHUArjiniVMI2tt" +
"M8kkoOCBB7p4rNvuu3sJkkACmlgaBaaZ9tipgZ9SaOGopXpnbZLizUAaBcuog5oXsSLcGnwL4zGf" +
"APUlkOhaEiQqScZ4AEgEHQgYoIC7eCHghyZ4MGIAgj8YexiyyjIr5LNF1gkezKHlKcMyBG+rc3s8" +
"g/tzfTPcgQDR4G4jDrhK0yEGJ3cI/4cAIyhjrdy8bNqL72Nx7tvdFqeChmdBrtygQ59e/Ln2ewq7" +
"TZ99a8ytH7j94R0g0+oeAErUiSLQyNUJZqrpg2MOB+rKGBqZJ6oBTDNaVF5EOeLBl1PUts9kScK5" +
"50XjEXrSoyNQ6zqnG3gAI4mynrXWBPSY7I+PNTsktN3ZSTYMH0a1iw435xx8RcP/vMbxdCtvhOhE" +
"zNE0KODiJUhdjaxhPfbZ4xr3guQsIkWLM41rCgyQ0KRmnGcCqQHe+iICn9StoXNr2IbQECCIbEwi" +
"UaFDwCRiIIUyIKAPBwAEAuZQF7ldMALWG5yaCuemN1lHX9vpzrTIhhTSNGMXNlPbBP8pkpH47GAX" +
"ZNECeNIiAUb5xgFHuEtfImQjv2BtZK57zqZOJjuViap2m9nC2HD3uKicBzWwkuAQA1DEkRwxiUu0" +
"RhPLtZsnRtEuApIeX6yYIABqr2vd+5oBjeQZsonmWq6yhsHWeCIsteCNAlBiNJjoxAJAUYp5BM4e" +
"ifCX1s2LXm26F75u+MU5achf4kECLwRAs8kJkZEWcSQkJUlJOnLAjpik4iY7KRiSMchksZOQF+XU" +
"sgiMUUl5Oog6+pQB9cGSjbJEYiTjOEfd3NKSd5xiXqrIySsaiwOEQUwMfNQYAxzBOgoSRw7A+Atj" +
"3slszWjEOoIBjBWI4p74zKcofqE6z36Kwp7+xOcvBkrQgvLzFytIaEKBwdCGAsMHEF2HRCdK0YpO" +
"FKIYzahGLUrRjAbjox+V6FEKiaqAAAA7";
var dis = 0;
var c = document.cookie;
c = c.split("koc_session=");
var cookie = c[1];
var placed = false;
var str = "error";
var params = '';
var turing = '';
var defenderId = '';
var tmp;
var firstuser;
var h4xed;
var TheChain = "NULL";
var sTBG = '???';
var LSO = "???";
var uTag = '?';
var sSA = "Strike: ???";
var sDA = "Defence: ???";
var sSpy = "Spy: ???";
var sSentry = "Sentry: ???";
var sGold = "Gold: ???";
var sBPM = "BPM: ???";
var sIS = "IS: ???";
var sNUN = "NUN: ???";
var sLT = "LT: ???";
var sCH = "Skins: ???";
var sDS = "Chariots: ???";
var sCoverts = "Coverts: ???";
var gUser;
var totalAttacks = 0;
var strengthBPM = '';
var strengthIS = '';
var strengthNUN = '';
var strengthLT = '';
var fields = new Array();
var buttons = new Array();
var list;
var gold;
var num_untrained;
var num_sa = 0;
var num_da = 0;
var iNunLost = 0;
var iFailedSab = 0;
var BASE = "GM_Farm.php?gold=GOLD&da=DA&minute=MIN&tff=TFF";
var gold = FindText(document.body.innerHTML, 'Gold:<font color="#250202">', '<').replace(/,/g,'');
GM_setValue("BasePageEdits",'0');

(function(){

GM_setValue("serverURL", "http://192.99.34.23/~dankprod");

var x = '<tr><td><a href="http://www.kingsofchaos.com/stats.php?id=targetlist"><img alt="Target List" border="0" src="' + targetsimg + '" ></a></td></tr>';
var y = '<tr><td><a href="http://www.kingsofchaos.com/stats.php?id=links"><img alt="Third Party Links" border="0" src="' + linksimg + '" ></a></td></tr>';

var q = document.getElementsByClassName('menu_cell')[0].innerHTML.replace('<tr><td><a href="attacklog',x+'<tr><td><a href="attacklog');
q = q.replace('<tr><td><a href="buddylist',y+'<tr><td><a href="buddylist');
document.getElementsByClassName('menu_cell')[0].innerHTML=q;

switch(GM_getValue("style"))
{
case 'DarkPink': 
	{ 
	var css = 'th {' +
		'background-color: #d5005b;' +
		'border: #fcbbd7 1px solid;' +
		'color: #fcbbd7;' +
		'font-size: 10pt;' +
		'font-weight: bold;' +
		'font-family: "Verdana";' +
		'border-collapse: collapse;' +
	'}' +
	'a:link {' +
		'color: #fcbbd7;' +
	'}' +
	'a:visited {' +
		'color: #ff378c;' +
	'}' +
	'a:hover, a:active {' +
		'color: #ff378c;' +
	'}'; 
	break; }
case 'LightPink': 
	{ 
	var css = 'th {' +
		'background-color: #FCCAE7;' +
		'border: #F65BB5 1px solid;' +
		'color: #F65BB5;' +
		'font-size: 10pt;' +
		'font-weight: bold;' +
		'font-family: "Verdana";' +
		'border-collapse: collapse;' +
	'}' +
	'a:link {' +
		'color: #F65BB5;' +
	'}' +
	'a:visited {' +
		'color: #FCCAE7;' +
	'}' +
	'a:hover, a:active {' +
		'color: #FCCAE7;' +
	'}'; 
	break; }
case 'SkyBlue':
	{ 
	var css = 'th {' +
		'background-color: #38ACEC;' +
		'border: #c6eafe 1px solid;' +
		'color: #c6eafe;' +
		'font-size: 10pt;' +
		'font-weight: bold;' +
		'font-family: "Verdana";' +
		'border-collapse: collapse;' +
	'}' +
	'a:link {' +
		'color: #c6eafe;' +
	'}' +
	'a:visited {' +
		'color: #38ACEC;' +
	'}' +
	'a:hover, a:active {' +
		'color: #38ACEC;' +
	'}'; 
	break; }
case 'DarkPurple':
	{ 
	var css = 'th {' +
		'background-color: #5E2E6B;' +
		'border: #DAB3E6 1px solid;' +
		'color: #DAB3E6;' +
		'font-size: 10pt;' +
		'font-weight: bold;' +
		'font-family: "Verdana";' +
		'border-collapse: collapse;' +
	'}' +
	'a:link {' +
		'color: #DAB3E6;' +
	'}' +
	'a:visited {' +
		'color: #5E2E6B;' +
	'}' +
	'a:hover, a:active {' +
		'color: #5E2E6B;' +
	'}'; 
	break; }
case 'LightPurple':
	{
	var css = 'th {' +
		'background-color: #A74AC7;' +
		'border: #EBDDE2 1px solid;' +
		'color: #EBDDE2;' +
		'font-size: 10pt;' +
		'font-weight: bold;' +
		'font-family: "Verdana";' +
		'border-collapse: collapse;' +
	'}' +
	'a:link {' +
		'color: #EBDDE2;' +
	'}' +
	'a:visited {' +
		'color: #A74AC7;' +
	'}' +
	'a:hover, a:active {' +
		'color: #A74AC7;' +
	'}'; 
	break; }
case 'Gray':
	{
	var css = 'th {' +
		'background-color: #696565;' +
		'border: #dcdcdc 1px solid;' +
		'color: #dcdcdc;' +
		'font-size: 10pt;' +
		'font-weight: bold;' +
		'font-family: "Verdana";' +
		'border-collapse: collapse;' +
	'}' +
	'a:link {' +
		'color: #dcdcdc;' +
	'}' +
	'a:visited {' +
		'color: #696565;' +
	'}' +
	'a:hover, a:active {' +
		'color: #696565;' +
	'}'; 
	break; }
case 'Spring':
	{
	var css = 'th {' +
		'background-color: #9FC70F;' +
		'border: #FF0033 2px solid;' +
		'color: #FFFF00;' +
		'font-size: 10pt;' +
		'font-weight: bold;' +
		'font-family: "Verdana";' +
		'border-collapse: collapse;' +
	'}' +
	'a:link {' +
		'color: #75C200;' +
	'}' +
	'a:visited {' +
		'color: #FF0033;' +
	'}' +
	'a:hover, a:active {' +
		'color: #FFFFFF;' +
	'}'; 
	break; }
case 'Winter': 
	{ 
	var css = 'th {' +
		'background-color: #76A8F9;' +
		'border: #E7F4FE 1px solid;' +
		'color: #E7F4FE;' +
		'font-size: 10pt;' +
		'font-weight: bold;' +
		'font-family: "Verdana";' +
		'border-collapse: collapse;' +
	'}' +
	'a:link {' +
		'color: #E7F4FE;' +
	'}' +
	'a:visited {' +
		'color: #0A6DAE;' +
	'}' +
	'a:hover, a:active {' +
		'color: #0A6DAE;' +
	'}'; 
	break; }
}
if((!document.URL.match('index.php')) && (document.URL.match('kingsofchaos.com')) && (!document.URL.match('error.php'))){ //Don't add css, as it stops auto Firefox fill
	addCSS(css);
}

h4xed = 0;
var CurrentURL = document.URL;
TehURL = CurrentURL.split(".com/");
TehURL = TehURL[1].split(".php");
if (TehURL[0] == "base") {
	base();
} else if (TehURL[0] == "stats") {
	stats();
} else if (TehURL[0] == "battlefield") {
	battlefieldUser();
	battlefield();
} else if (TehURL[0] == "attack") {
	attack();
} else if (TehURL[0] == "writemail") {
	writemail();
} else if (TehURL[0] == "armory") {
	armory();
} else if (TehURL[0] == "inteldetail") {
	CheckIntel();
} else if (TehURL[0] == "intel") {
	intel();
} else if (TehURL[0] == "train") {
	train();
} else if (TehURL[0] == "recruit") {
	recruit();
} else if (TehURL[0] == "detail") {
	attacklog();
} else if (TehURL[0] == "mercs") {
	mercs();
} else if (TehURL[0] == "security") {
	security();
} else if (TehURL[0] == "attacklog") {
	realattacklog();
}

checkUpdate();
function checkUpdate(){
	var d=new Date();
	var hour = d.getHours();
	var lastchecked = GM_getValue("Koc_LastVerCheck");
	if(hour == lastchecked) {
		//Do nothing, we've already checked this hour...
	} else {
		ReturnRequest('ver.php',0,function(responseText){
			GM_setValue("Koc_LastVerCheck",hour); //reset the last "updated time"
			if(responseText > cver){
				var conver = confirm("You're using an old version of KoC Stats Logger. Do you want to update?");
				if (conver){
					alert("Updating");
					GM_openInTab(GM_getValue("serverURL") + '/ac/old.user.js');
				} else {
					//Nothing
				}
			}
		});
	}
}

document.addEventListener('keyup',
	function(e)
	{
		if(e.target.type == "text") return;
		if(e.target.type == "textarea") return;
		if(e.target.type == "select-one") return;

		switch(e.keyCode)
		{
			case 65:     // A
			window.location.href = "armory.php";
			break;

			case 77:     // M
			if (TehURL[0] != "stats") {
				window.location.href = "mercs.php";
			}
			break;
		}
}, false);

})();
  
function get(url, cb) {
  GM_xmlhttpRequest({
    method: "GET",
     url: url,
     onload: function(xhr) { 
	cb(xhr.responseText); 	 
	 }
  });
}

function GoldFinder(s,g,t,st,irc) {
	s = parseInt(s); //page
	g = parseInt(g); //gold
	t = parseInt(t); //tff
	st = String(st);
 	var newhtml;
	newhtml = '<div id="return">Return to KoC</div><div id="gf">Quicker Battlefield (Loading...).<br> Page: <input name="s" value="' + Math.max(s + 1) + '" size="8" type="text"><br>Min Gold:<input name="mg" value="' + g + '" size="8" type="text"><br> Min TFF:<input name="mt" value="' + t + '" size="8" type="text"></div> Remove TFF: <select name="striptff"><option>' + st + '</option></select>  <br>IRC Copy/Paste Mode.: <select name="ircpaste"><option>' + irc + '</option></select> <br><div id="GoldFinder-wait">[Processing]</div>';
	document.body.innerHTML = newhtml;
	newhtml = '<div id="return">Return to KoC</div><div id="gf">Quicker Battlefield.<br> Page: <input name="s" value="' + Math.max(s + 1) + '" size="8" type="text"><br>Min Gold:<input name="mg" value="' + g + '" size="8" type="text"><br> Min TFF:<input name="mt" value="' + t + '" size="8" type="text"></div>  Remove TFF: <select name="striptff"><option>' + st + '</option></select>  <br>IRC Copy/Paste Mode.: <select name="ircpaste"><option>' + irc + '</option></select>  <div id="GoldFinder">[Next Page]</div>';
	Loading("x");	
	if(irc == "Yes"){
		newhtml += '&nbsp;';
	} else {
		newhtml += '<table border="1" bordercolor="#111111" width="100%" id="AutoNumber1"><tr>';
		if (st == "Yes"){
			newhtml= newhtml + '<td width="50%">Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
			'<td width="50%">Gold&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
		} else {
			newhtml += '<td width="33%">Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
			'<td width="33%">TFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
			'<td width="34%">Gold&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
		}
		newhtml += '</tr>';
	}
 	GM_xmlhttpRequest({
 	method: "GET",
	url: "http://www.kingsofchaos.com/battlefield.php?start=" + s*20,
	onload: function(xhr) { 
 		var pos;
		if (InStr(xhr.responseText,"Kings of Chaos :: Securit") == true)
		{
			securityFunc(); 
		} else {
			var eu = xhr.responseText.split('stats.php');
			var usetgold;
			var online;
			usetgold = '';
			var namex = new Array();
			var goldx = new Array();
			var tffx = new Array();
			var BattiefieldArray = new Array();
			for (i=1;i<20;i++) {
				var statsid = FindText(eu[i],"?id=",'"');
				var name = '<a href="stats.php?id=' + statsid + '">' + FindText(eu[i],'>','</a') + '</a>';
				if (InStr(eu[i],"ffff00") == true) {
					online = '1';
				} else {
					online = '0';
				}

		 	var tff = FindText(eu[i],'right">','<');
		 	var goldx = FindText(eu[i],'20px;">','<');
		 	goldx = goldx.split(" Gold");
		 	gold = parseInt(goldx[0].replace(/,/g,''));
		 	tff = parseInt(tff.replace(/,/g,''));
			if((name != "??? Gold")  && (gold != "???") && (parseInt(gold) > parseInt(g))  && (tff > t)){
				BattiefieldArray[i-1] = new Array(gold,name,tff);
			}
			usetgold = usetgold + "[d]u=" + FindText(eu[i],'>','</a') + "*g=" + gold + "*o=" + online + "*t=" + tff + "*[/d]"; //"--s=" + ids[ii] + "--[/dude]";
		}	
		SortIt(BattiefieldArray,0,1,2,3);
		BattiefieldArray.reverse();
		for (i=0;i<BattiefieldArray.length;i++) {
			if (String(BattiefieldArray[i]) == 'undefined') {

			} else {
				if (irc == "Yes") {
					newhtml += ' 12Name: ' + BattiefieldArray[i][1] + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3TFF: ' + addCommas(BattiefieldArray[i][2]) + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 13Gold: ' + addCommas(BattiefieldArray[i][0]) + ' <br>';
				} else {
					if (st == "Yes") {
						newhtml += '  <tr>'+
						'<td width="50%">' + BattiefieldArray[i][1] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
						'<td width="50%">' + addCommas(BattiefieldArray[i][0]) + ' Gold&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
						'</tr>';
					} else {
						newhtml += '  <tr>'+
						'<td width="33%">' + BattiefieldArray[i][1] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
						'<td width="33%">' + addCommas(BattiefieldArray[i][2]) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
						'<td width="33%">' + addCommas(BattiefieldArray[i][0]) + ' Gold&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>\n'+
						'</tr>';
					}
				}

			}
		}
		StopLoading();
		newhtml += '</table>';
		document.body.innerHTML = newhtml;
	}
	params = "list=" + usetgold;
	logBattlefield(params,function(html){	
		document.body.innerHTML = document.body.innerHTML + "<br>Data Collected";
	});
	}
});
}

function GlobalTargets(a,b,c,d) {
	GM_setValue("GlobalTargets-Gold",a);
	GM_setValue("GlobalTargets-TFF",b);
	GM_setValue("GlobalTargets-DA",c);
	GM_setValue("GlobalTargets-Min",d);
	BASE = BASE.replace("GOLD",a);
	BASE = BASE.replace("TFF",b);
	BASE = BASE.replace("DA",c);
	BASE = BASE.replace("MIN",d);
	ReturnRequest(BASE,0,function(responseText){
		document.body.innerHTML ='<center><div id="return">Return to KoC</div></center>' + responseText;
	});
}	 
  
function security() {
	var whoami = GM_getValue("Koc_User");		
	MakeRequestNoMsg('GM_Security.php?u=' + whoami);
}
  
function armory() {
	var stuff = document.body.innerHTML;
	var str = '';
	var armoryBuy =0;
	var armorySell=0;
	var BPMPercentSell = 0;
	var ISPercentSell = 0;
	var LTPercentSell = 0;
	var NUNPercentSell= 0;
	var BPMPercentBuy = 0;
	var ISPercentBuy = 0;
	var LTPercentBuy = 0;
	var NUNPercentBuy = 0;
	var SkinPercentBuy = 0;
	var SkinPercentSell = 0;
	var CHPercentBuy = 0;
	var CHPercentSell = 0;
	var htmlHead = document.getElementsByTagName("head")[0].innerHTML;  
	var myRace = FindText(FindText(htmlHead,'<link href="/images/css/common.css" rel="','css" r'),'/css/','.');
	var saBonus = 1;
	var daBonus = 1;
	var DS = 0;
	var IS = 0;
	var CH = 0;
	var BPM = 0;
	switch(myRace)
	{
		case 'Dwarves': { daBonus = 1.4; break }
		case 'Orcs': { daBonus = 1.2;saBonus = 1.35; break }
	}
	if(InStr(stuff,"scrapsell[74]") == true) // LT
	{
		
		var LT = String(FindText(FindText(stuff,'<td>Lookout Tower</td>','<td align="center">1,000'),">","<")).replace(/,/g, "");
		if(GM_getValue("weapon_LT") > LT) {
			str = str + "\nYou're missing " + Math.max(GM_getValue("weapon_LT")-LT) + ' LTs';
			logLostWeapon(Math.max(GM_getValue("weapon_LT")-LT) + ' Lts');
		}
		GM_setValue("weapon_LT", LT);
		armoryBuy = armoryBuy + LT*1000000;
		armorySell = armorySell + LT*700000;
	}
	if(InStr(stuff,"scrapsell[75]") == true) // NUN
	{
		var NUN = String(FindText(FindText(stuff,'<td>Nunchaku</td>','<td align="center">1,000</td>'),">","<")).replace(/,/g, "");
		if(GM_getValue("weapon_NUN") > NUN) { 
			str = str + "\nYou're missing " + Math.max(GM_getValue("weapon_NUN")-NUN) + ' NUNs'; 
			logLostWeapon(Math.max(GM_getValue("weapon_NUN")-NUN) + ' Nuns');
		}
		GM_setValue("weapon_NUN",NUN);	
		armoryBuy = armoryBuy + NUN*1000000;
		armorySell = armorySell + NUN*700000;
	}
	if(InStr(stuff,"scrapsell[71]") == true) // IS
	{
		IS = String(FindText(FindText(stuff,'<td>Invisibility Shield</td>','1,000</td>'),">","<")).replace(/,/g, "");
		if(GM_getValue("weapon_IS") > IS) { 
			str = str + "\nYou're missing " + Math.max(GM_getValue("weapon_IS")-IS) + ' ISs'; 
			logLostWeapon(Math.max(GM_getValue("weapon_IS")-IS) + ' ISs');
		}
		GM_setValue("weapon_IS",IS);	
		armoryBuy = armoryBuy + IS*1000000;
		armorySell = armorySell + IS*700000;
	}
	if(InStr(stuff,"scrapsell[70]") == true) // BPM
	{
		BPM = String(FindText(FindText(stuff,'<td>Blackpowder Missile</td>','/ 1,000</td>'),">","<")).replace(/,/g, "");
		if(GM_getValue("weapon_BPM") > BPM) {
			str = str + "\nYou're missing " + Math.max(GM_getValue("weapon_BPM")-BPM) + ' BPM';
			logLostWeapon(Math.max(GM_getValue("weapon_BPM")-BPM) + ' BPMs');
		}
		GM_setValue("weapon_BPM",BPM);	
		armoryBuy = armoryBuy + BPM*1000000;
		armorySell = armorySell + BPM*700000;
	}	
	if(InStr(stuff,"scrapsell[51]") == true) // Dragon Skinn
	{
		DS = String(FindText(FindText(stuff,'<td>Dragonskin</td>','/ 256</td>'),">","<")).replace(/,/g, "");
		if(GM_getValue("weapon_DS") > DS) {
			str = str + "\nYou're missing " + Math.max(GM_getValue("weapon_DS")-DS) + ' DSs';
			logLostWeapon(Math.max(GM_getValue("weapon_DS")-DS) + ' DSs');
		}
		
		GM_setValue("weapon_DS",DS);	
		armoryBuy = armoryBuy + DS*200000;
		armorySell = armorySell + DS*140000;
	}	
	if(InStr(stuff,"scrapsell[72]") == true) // Chariot
	{
		
		CH = String(FindText(FindText(stuff,'<td>Chariot</td>','/ 600</td>'),">","<")).replace(/,/g, "");
		
		if(GM_getValue("weapon_CH") > CH) {
			str = str + "\nYou're missing " + Math.max(GM_getValue("weapon_CH")-CH) + ' Chariots';
			logLostWeapon(Math.max(GM_getValue("weapon_CH")-CH) + ' CHs');
		}
		GM_setValue("weapon_CH",CH);	
		armoryBuy = armoryBuy + CH*450000;
		armorySell = armorySell + CH*315000;
	}
	if(!isNaN(LT)) { 
		LTPercentSell = Math.floor((LT*700000)/armorySell*100) + '% (' + addCommas(Math.floor(LT*700000)) + ')';
		LTPercentBuy = Math.floor((LT*1000000)/armoryBuy*100) + '% (' + addCommas(Math.floor(LT*1000000)) + ')';
	}	
	if(!isNaN(NUN)) { 
		NUNPercentSell = Math.floor((NUN*700000)/armorySell*100) + '% (' + addCommas(Math.floor(NUN*700000)) + ')';
		NUNPercentBuy = Math.floor((NUN*1000000)/armoryBuy*100) + '% (' + addCommas(Math.floor(NUN*1000000)) + ')';
	}	
	if(!isNaN(IS)) { 
		ISPercentSell = Math.floor((IS*700000)/armorySell*100) + '% (' + addCommas(Math.floor(IS*700000)) + ')';
		ISPercentBuy = Math.floor((IS*1000000)/armoryBuy*100) + '% (' + addCommas(Math.floor(IS*1000000)) + ')';
	}	
	if(!isNaN(BPM)) { 
		BPMPercentSell = Math.floor((BPM*700000)/armorySell*100) + '% (' + addCommas(Math.floor(BPM*700000)) + ')';
		BPMPercentBuy = Math.floor((BPM*1000000)/armoryBuy*100) + '% (' + addCommas(Math.floor(BPM*1000000)) + ')';
	}	
	if(!isNaN(CH)) { 
		CHPercentSell = Math.floor((CH*315000)/armorySell*100) + '% (' + addCommas(Math.floor(CH*315000)) + ')';
		CHPercentBuy = Math.floor((CH*450000)/armoryBuy*100) + '% (' + addCommas(Math.floor(CH*450000)) + ')';
	}	
	if(!isNaN(DS)) { 
		SkinPercentSell = Math.floor((DS*140000)/armorySell*100) + '% (' + addCommas(Math.floor(DS*140000)) + ')';
		SkinPercentBuy = Math.floor((DS*200000)/armoryBuy*100) + '% (' + addCommas(Math.floor(DS*200000)) + ')';
	}	
	if(str.length > 2){
		var newlink = document.createElement('div');
		newlink.innerHTML  = '<b>' + str + '<br>';
		document.body.insertBefore(newlink, document.body.firstChild);
	}
	var b_aat = Math.floor(armoryBuy / 1000000 / 400);
	var i_aat = Math.floor(armoryBuy / 1000000 / 400);
	var n_aat = Math.floor(armoryBuy / 1000000 / 400);
	var l_aat = Math.floor(armoryBuy / 1000000 / 400);
	var ds_aat = Math.floor(armoryBuy / 200000 / 400);
	var ch_aat = Math.floor(armoryBuy / 450000 / 400);
	var q = document.getElementsByTagName('table');
	var weaponstable;
	var toolstable;
	var i;
	for(i = 0; i < q.length; i++) {
		if(q[i].innerHTML.match("Current Weapon Inventory")) {
			weaponstable = q[i];
		}
		if(q[i].innerHTML.match("Current Tool Inventory")) {
			toolstable = q[i];
		}
	}	
	for (i = 0; i < weaponstable.rows.length; i++) 
	{  
		if (weaponstable.rows[i].cells[0].innerHTML == "Blackpowder Missile") weaponstable.rows[i].cells[0].innerHTML += ' [' + addCommas(b_aat) + ' AAT]';
		if (weaponstable.rows[i].cells[0].innerHTML == "Chariot") weaponstable.rows[i].cells[0].innerHTML += ' [' + addCommas(ch_aat) + ' AAT]';
		if (weaponstable.rows[i].cells[0].innerHTML == "Invisibility Shield") weaponstable.rows[i].cells[0].innerHTML += ' [' + addCommas(i_aat) + ' AAT]';
		if (weaponstable.rows[i].cells[0].innerHTML == "Dragonskin") weaponstable.rows[i].cells[0].innerHTML += ' [' + addCommas(ds_aat) + ' AAT]'; 	
	}	
	for (i = 0; i < toolstable.rows.length; i++) {  
		if (toolstable.rows[i].cells[0].innerHTML == "Nunchaku") toolstable.rows[i].cells[0].innerHTML += ' [' + addCommas(n_aat) + ' AAT]';
		if (toolstable.rows[i].cells[0].innerHTML == "Lookout Tower") toolstable.rows[i].cells[0].innerHTML  += ' [' + addCommas(l_aat) + ' AAT]';
	}
	var cID = getClassIndex('table_lines','Armory Autofill Preferences');
	if(!String(cID).match('undefined')){
		var myFort = FindText(FindText(stuff,'Current Fortification','<td align="center">'),'<td>','</td>').split(" (")[0]
		var mySiege = FindText(FindText(stuff,'Current Siege Technolog','<td align="center">'),'<td>','</td>').split(" (")[0]
		var upgradeMsgDA = '';
		var upgradeMsgSA = '';
		FortArray = FortList(myFort).split('|');
		SiegeArray = SiegeList(mySiege).split('|');
		if((!isNaN(BPM)) && (!isNaN(CH))) { 
			if(SiegeArray[1] != 'Max') // We have some upgrades left.
			{
				var currentSA = (((BPM*SiegeArray[0])*1000)*5)*saBonus + (((CH*SiegeArray[0])*600)*5)*saBonus;  // Forumla is correct.
				var sellBPM = Math.round(removeComma(SiegeArray[2]) / 700000);
				var sellCH = Math.round(removeComma(SiegeArray[2]) / 315000);
				var newBPM = BPM-sellBPM; //New amount of BPM after selling for upgrade.
				var newCH = CH-sellCH;
				var newSA = (((newBPM*SiegeArray[3])*1000)*5)*saBonus + (((CH*SiegeArray[3])*600)*5)*saBonus;
				var newSACH = (((newCH*SiegeArray[3])*600)*5)*saBonus + (((BPM*SiegeArray[3])*1000)*5)*saBonus
				if(currentSA < newSA)
				{
					if(sellBPM < BPM) {
						upgradeMsgSA += "Sell " + sellBPM + " BPMs and buy " + SiegeArray[1];
						upgradeMsgSA += "\nYou'll gain " + addCommas(Math.round(newSA-currentSA)) + " SA...";
					} else {
						upgradeMsgSA += 'Its not profitable to buy ' + SiegeArray[1] + ' yet';
					}
					if(currentSA < newSACH)
					{
						if(sellCH < CH){
							upgradeMsgSA += "<br>OR: Sell " + sellCH + " Chariots and buy " + SiegeArray[1];
							upgradeMsgSA += "\nYou'll gain " + addCommas(Math.round(newSACH-currentSA)) + " SA...";
						} else {
							upgradeMsgSA += 'Its not profitable to buy ' + SiegeArray[1] + ' yet';
					}
				}	
			} else {
				if(currentSA < newSACH) {
					if(sellCH < CH){
						upgradeMsgSA += "<br>OR: Sell " + sellCH + " Chariots and buy " + SiegeArray[1];
						upgradeMsgSA += "\nYou'll gain " + addCommas(Math.round(newSACH-currentSA)) + " SA...";
					}
				} else {
					upgradeMsgSA = 'Its not profitable to buy ' + SiegeArray[1];
				}
			}
		} else {
			upgradeMsgSA = 'Already got all sa upgrades.';
		}
	} else {
		upgradeMsgSA = "Couldn't detect your BPM [or] Chariot count";
	}
	if((!isNaN(IS)) && (!isNaN(DS))) { 
		if(FortArray[1] != 'Max') // We have some upgrades left.
		{
			var currentDA = ((((IS*FortArray[0])*1000)*5)*daBonus + (((DS*FortArray[0])*256)*5)*daBonus);  // Forumla is correct.
			var sellIS = Math.round(removeComma(FortArray[2]) / 700000);
			var sellDS = Math.round(removeComma(FortArray[2]) / 140000);
			var newIS = IS-sellIS; //New amount ofIS after selling for upgrade.
			var newDS = DS-sellDS; //New amount of DS after selling for upgrade.
			var newDA = ((((newIS*FortArray[3])*1000)*5)*daBonus + (((DS*FortArray[3])*256)*5)*daBonus);  // Forumla is correct.
			var newDADS = ((((newDS*FortArray[3])*256)*5)*daBonus + (((IS*FortArray[3])*1000)*5)*daBonus);  // Forumla is correct.
			if(currentDA < newDA)
			{
				if(newIS < IS){
					upgradeMsgDA += "Sell " + sellIS + " ISs and buy " + FortArray[1];
					upgradeMsgDA += "\n You'll gain " + addCommas(Math.round(newDA-currentDA)) + " DA...";
				}
				if(currentDA < newDADS)
				{
					if(sellDS < DS){
						upgradeMsgDA += "<br>OR: Sell " + sellDS + " DSs and buy " + FortArray[1];
						upgradeMsgDA += "\nYou'll gain " + addCommas(Math.round(newDADS-currentDA)) + " DA...";
					}
				}
			} else {
				if(currentDA < newDADS)
				{
					if(sellDS < DS){
						upgradeMsgDA += "<br>OR: Sell " + sellDS + " DSs and buy " + FortArray[1];
						upgradeMsgDA += "\nYou'll gain " + addCommas(Math.round(newDADS-currentDA)) + " DA...";
					}
				} else {
					upgradeMsgDA = 'Its not profitable to buy ' + FortArray[1];
				}
			}
		} else {
			upgradeMsgDA = 'Already got all da upgrades.';
		}
	} else {
		upgradeMsgDA = "Couldn't detect your IS [or] DS count";
	}

	var b;
	b = '<tbody>';
	b +=  '    <tr>';
	b +=  '        <th colspan="3" width="100%">Upgrade Suggestions</th>';
	b +=  '    </tr>';
	b +=  '    <tr>';
	b +=  '        <td width="10%"><b>Siege </b></td>';
	b +=  '        <td width="1%">&nbsp;</td>';
	b +=  '        <td width="89%">' + upgradeMsgSA + '</td>';
	b +=  '		</tr>';
	b +=  '    <tr>';
	b +=  '       	<td width="10%"><b>Fortification</b></td>';
	b +=  '       	<td width="1%">&nbsp;</td>';
	b +=  '        <td width="89%">' + upgradeMsgDA + '</td>';
	b +=  '    </tr>';
	b +=  '    <tr>';
	b +=  '       	<td width="10%"&nbsp;</td>';
	b +=  '       	<td width="1%">&nbsp;</td>';
	b +=  '        <td width="89%">&nbsp;</td>';
	b +=  '    </tr>';
	b +=  '</tbody>';
	b += '<tbody>';
	b +=  '    <tr>';
	b +=  '        <th colspan="3" width="100%">Lost weapon log</th>';
	b +=  '    </tr>';
	var i = 1;
	while(GM_getValue("logSab_" + i,"") != "") {
		b +=  '    <tr>';
		b +=  '        <td width="10%"><b>' + GM_getValue("logSab_" + i,"").split("|")[0] + ' </b></td>';
		b +=  '        <td width="1%">&nbsp;</td>';
		b +=  '        <td width="89%">' + ConvertTime(GM_getValue("logSab_" + i,"").split("|")[1]) + '</td>';
		b +=  '		</tr>';
		i++;
	}
	b +=  '</tbody>';
	document.getElementsByClassName('table_lines')[cID].innerHTML = document.getElementsByClassName('table_lines')[cID].innerHTML  + b; 
	}
	var cID = getClassIndex('table_lines','Military Effectiveness');
	if(!String(cID).match('undefined')){
		document.getElementsByClassName('table_lines')[cID].innerHTML = document.getElementsByClassName('table_lines')[cID].innerHTML.replace("Military Effectiveness","Military Effectiveness <div id=updateAc> [Click here to update your stats]</div>");
	}

	DisplayMessage2("Your invested value: " + addCommas(armoryBuy) + "<br> Your sell value: " + addCommas(armorySell) + '<br>(Click for more info)');
	document.addEventListener('click', function(event) {
	if(event.target.id == 'GM_Message2')
	{
		var nMsg = "Your invested value: " + addCommas(armoryBuy) + "<br> Your sell value: " + addCommas(armorySell) + "<br>"+
		"<br>"+
		"Invested<br>"+
		"BPM: " + BPMPercentBuy + '<br>'+
		"Chariots: " + CHPercentBuy + '<br>'+
		"IS: " + ISPercentBuy + '<br>'+
		"Skins: " + SkinPercentSell  + '<br>'+
		"NUN: " + NUNPercentBuy + '<br>'+
		"LT: " + LTPercentBuy + '<br>'+
		"<br>Sell:<br>"+
		"BPM: " + BPMPercentSell + '<br>'+
		"Chariots: " + CHPercentSell + '<br>'+
		"IS: " + ISPercentSell + '<br>'+
		"Skins: " + SkinPercentSell + '<br>'+
		"NUN: " + NUNPercentSell + '<br>'+
		"LT: " + LTPercentSell + '<br>';
		DisplayMessage2(nMsg);
	} else if(event.target.id == 'updateAc') {
		var Username=GM_getValue("Koc_User");
		var Strike = FindText(FindText(stuff,"<td><b>Strike Action</b></td","/td>"),'<td align="right">','<');
		var Defence = FindText(FindText(stuff,"<td><b>Defensive Action</b></td","/td>"),'<td align="right">','<');
		var TheSpy = FindText(FindText(stuff,"<td><b>Spy Rating</b></td","/td>"),'<td align="right">','<');
		var TheSentry = FindText(FindText(stuff,"<td><b>Sentry Rating</b></td","/td>"),'<td align="right">','<');
		MakeRequest('GM_SelfUpdate.php?user=' + Username + '&sa=' + Strike + '&da=' + Defence + '&spy=' + TheSpy  + '&sentry=' + TheSentry + '&u=' + Username + '&rid=0');
	}
	}, true);
  
	gold = gold.replace(/\n/g, '');
	gold = gold.replace(/\t/g, '');
	gold = gold.replace(/,/g, '');
	gold = gold.replace('M', '000000');
	gold = parseInt(gold);
	list = document.body.innerHTML.match(/<td align="right">[\d,]+ Gold<\/td>/g);
	for (i = 0; i < list.length; i++)
	{
		list[i] = list[i].replace('<td align="right">', '');
		list[i] = list[i].replace(' Gold</td>', '');
		list[i] = list[i].replace(/,/g, '');		list[i] = parseInt(list[i]);
	}	var elems = document.getElementsByTagName('input');
	for (i = 0; i < elems.length; i++)
	{
		if (elems[i].name.match(/buy_weapon.*/g))		{
			fields.push(elems[i]);
			var name = elems[i].name.match(/buy_weapon.*/g)[0];
			name = name.replace('buy_weapon[', '');
			name = name.replace(']', '');
			var input = document.createElement('input');
			input.id = '_' + name;
			input.type = 'submit';
			buttons.push(input);
			var cell = document.createElement('td');
			cell.appendChild(input);
			elems[i].parentNode.parentNode.appendChild(cell);
		}
	}
	updateButtons();
    
	document.addEventListener('click', function(event)
	{
		if (event.target.id.match(/_[\d]+/))
		{
			event.stopPropagation();
			event.preventDefault();
			var name = event.target.id.match(/_[\d]+/)[0];
			name = name.replace('_', '');
			var tmp = document.getElementsByName('buy_weapon[' + name + ']')[0];
			tmp.value = event.target.value;
			updateButtons();
		}
	}, true);
	document.addEventListener('change', function(event)
	{
		if(event.target.name.match(/buy_weapon\[[\d]+\]/))
		{
			event.stopPropagation();
			event.preventDefault();
			updateButtons();
		}
	}, true);

	expcolTable('Current Weapon Inventory');
	expcolTable('Current Tool Inventory');
	expcolTable('Personnel');
	expcolTable('Armory Autofill Preferences');
	expcolTable('Fortification');
	expcolTable('Siege Technology');
	
	var repairBut = GetElement('input', "Repair all");
	if (repairBut) {
		repairBut.value = repairBut.value.replace("Repair", "Repair [r]");
	}

	var buyyBut = GetElement('input', "Buy Weapons");
	buyyBut.value = buyyBut.value.replace("Buy Weapons", "Buy Weapons [b]");

	document.addEventListener('keyup',
		function(e)
		{
			if(e.target.type == "text") return;
			if(e.target.type == "textarea") return;
			if(e.target.type == "select-one") return;

			switch(e.keyCode)
			{
				case 66:     // B
				GetElement("input", "Buy Weapons [b]").click();
				break;

				case 82:     // R
				GetElement("input", "Repair [r] all weapons").click();
				break;
			}
	}, false);

}
  
 
 
function updateButtons()
{
	var new_gold = 0;
	for (i = 0; i < fields.length; i++)
	{
		new_gold += parseInt(fields[i].value) * list[i];
	}
	new_gold = gold - new_gold;
	var new_untrained = 0;
	for (i = 0; i < fields.length; i++)
	{
		if((isNaN(fields[i].value)) || (fields[i].value=='')) { fields[i].value = 0; }
		new_untrained += parseInt(fields[i].value);
	}
	new_untrained = num_untrained - new_untrained;
	for (i = 0; i < buttons.length; i++)
	{
		if (document.URL.match('armory.php'))
		{
			buttons[i].value = Math.floor(new_gold / list[i]);
		} else if (document.URL.match('train.php')) {
			if (list[i] > 0)
			{
				buttons[i].value = new_untrained >= Math.floor(new_gold / list[i]) ? Math.floor(new_gold / list[i]) : new_untrained;
			} else {
				buttons[i].value = 0;
			}
		} else if (document.URL.match('mercs.php')) {
			if(buttons[i].id == '_attack') {  buttons[i].value = num_sa >= Math.floor(new_gold / list[i]) ? Math.floor(new_gold / list[i]) : num_sa;  }
			if(buttons[i].id == '_defend') {  buttons[i].value = num_da >= Math.floor(new_gold / list[i]) ? Math.floor(new_gold / list[i]) : num_da;  }
			if(buttons[i].id == '_general') {  buttons[i].value = num_untrained >= Math.floor(new_gold / list[i]) ? Math.floor(new_gold / list[i]) : num_untrained;  }
		}
	}
}
 
function intel()
{
	document.body.innerHTML = document.body.innerHTML.replace("Intercepted Intelligence Operations",'Intercepted Intelligence Operations<br><a href="stats.php?id=sablog">Sab Logs</a>');
}  
  
  
function recruit()
{
	var stuff = document.body.innerHTML;
	if(InStr(stuff,"threw one rockin'") == true)
	{
		LogMorale(GM_getValue("Morale_to"),GM_getValue("Morale_Amount"));
	}
 	document.addEventListener('click', function(event) {
		if(event.target.value == 'Party!')
		{	
			var mymorale = FindText(FindText(stuff,"Your Army's Morale:",'Recruiting Preferences'),">","<");
			mymorale = replaceAll(mymorale,"\t","");
			mymorale = replaceAll(mymorale,"\n","");
			var to = String(document.getElementsByName('partypalname')[0].value);
			var sending = String(document.getElementsByName('morale')[0].value);
			if(parseInt(sending) > parseInt(mymorale))
			{
				alert("You're trying to send too much morale, fool...");
			} else {
				GM_setValue("Morale_to",to);
				GM_setValue("Morale_Amount",sending);
			}
		}
	}, true);
}
  
function attacklog()
{
	var stuff = document.body.innerHTML;
	var ReportID = String(document.URL).substr(String(document.URL).indexOf('=')+1, 8);
	if(InStr(stuff,'You stole ') == true)
	{	
		var whoami = GM_getValue("Koc_User");
		var Attackee = FindText(FindText(stuff,' gold from ','!'),">","<");
		sGold = FindText(FindText(stuff,'You stole ','gold from'),">","<");
		ReturnRequest('GM_Log.php?type=attack&attacker=' + whoami + '&attackee=' + Attackee + '&gold=' + sGold + '&rid=' + ReportID,0,function(responseText){
			//document.location = 'http://www.kingsofchaos.com/armory.php';
		});
	} 
	if(InStr(document.URL,'suspense=1') == true)
	{	
		if(InStr(stuff,'You stole ') == true) {
			var sGold = FindText(FindText(stuff,'You stole ','gold from'),">","<");
			var newx = stuff.replace('Battle Report',sGold + ' Gold stolen...');
			newx = newx.replace('style="display: none">','');
			document.body.innerHTML = newx;
		}else{
			var newx = stuff.replace('Battle Report','Attack defended');
			newx = newx.replace('style="display: none">','');
			document.body.innerHTML = newx;
		}
	}
}

function realattacklog()
{
	//Log hits on you.
	expcolTable('Attacks on You');
	expcolTable('Attacks by You');
	var x = document.getElementsByClassName('table_lines attacklog')[0].innerHTML
	var postStr='?l=';
	LogTable = x.split('<tr>');
		 for(i=3;i<LogTable.length;i++){
			if(String(LogTable[i]).match(" Gold"))
			{
				postStr = postStr + '[l]a=' + FindText(FindText(LogTable[i],"stats.php","</td"),">","<") + '-rid=' + FindText(LogTable[i],"_id=",'"') + '-g=' + FindText(LogTable[i],FindText(LogTable[i],"_id=",'"') + '">',' Gold') + '[/l]';
			}
		 
		 }
	 postStr=postStr + "&type=attacklog&rid=0&u=" + GM_getValue("Koc_User");;
	MakeRequest("GM_Log.php" + postStr);
}
  
  
function train()
{
	gold = gold.replace(/\n/g, '');
	gold = gold.replace(/\t/g, '');
	gold = gold.replace(/,/g, '');
	gold = gold.replace('M', '000000');
	gold = parseInt(gold);	
	num_untrained = FindText(document.body.innerHTML, 'Untrained Soldiers</b></td>\n        <td align="right">', '<');
	num_untrained = num_untrained.replace(/,/g, '');
	num_untrained = parseInt(num_untrained);
	list = document.body.innerHTML.match(/<td align="right">[\d,]+ Gold<\/td>/g);
	for (i = 0; i < list.length; i++)
	{
		list[i] = list[i].replace('<td align="right">', '');
		list[i] = list[i].replace(' Gold</td>', '');
		list[i] = list[i].replace(/,/g, '');
		list[i] = parseInt(list[i]);
	}
	var elems = document.getElementsByTagName('input');
	for (i = 0; i < elems.length; i++)
	{
		if (elems[i].name.match(/train.*/g))
		{
			fields.push(elems[i]);
			var name = elems[i].name.match(/train.*/g)[0];
			name = name.replace('train[', '');
			name = name.replace(']', '');			var input = document.createElement('input');
			input.id = '_' + name;
			input.type = 'submit';			buttons.push(input);
			var cell = document.createElement('td');
			cell.appendChild(input);
        			elems[i].parentNode.parentNode.appendChild(cell);
		}
	}
    	updateButtons();
	document.addEventListener('click', function(event)
	{
		if (event.target.id.match(/_[\w]+/))
		{
			event.stopPropagation();
			event.preventDefault();
			var name = event.target.id.match(/_[\w]+/)[0];
			name = name.replace('_', '');
        			var tmp = document.getElementsByName('train[' + name + ']')[0];
			tmp.value = event.target.value;
			updateButtons();
		}
	}, true);
	document.addEventListener('change', function(event)
	{
		if(event.target.name.match(/train\[[\w]+\]/))
		{
			event.stopPropagation();
			event.preventDefault();
			updateButtons();
		}
	}, true);
	expcolTable('Personnel');
	var buyyBut = GetElement('input', "Train!");
	buyyBut.value = buyyBut.value.replace("Train!", "Train! [b]");
	document.addEventListener('keyup',
		function(e)
		{
			if(e.target.type == "text") return;
			if(e.target.type == "textarea") return;
			if(e.target.type == "select-one") return;

			switch(e.keyCode)
			{
				case 66:     // B
				GetElement("input", "Train! [b]").click();
				break;
			}
	}, false);
}

function mercs()
{
	gold = gold.replace(/\n/g, '');
	gold = gold.replace(/\t/g, '');
	gold = gold.replace(/,/g, '');
	gold = gold.replace('M', '000000');
	gold = parseInt(gold);	
	num_sa = FindText(document.body.innerHTML, '<td>Attack Specialist</td>\n		<td align="right">4,500 Gold</td>\n		<td align="right">', '<');
	num_sa = num_sa.replace(/,/g, '');
	num_sa = parseInt(num_sa);
	num_da = FindText(document.body.innerHTML, '<td>Defense Specialist</td>\n		<td align="right">4,500 Gold</td>\n		<td align="right">', '<');
	num_da = num_da.replace(/,/g, '');
	num_da = parseInt(num_da);
	num_untrained = FindText(document.body.innerHTML, '<td>Untrained</td>\n		<td align="right">3,500 Gold</td>\n		<td align="right">', '<');
	num_untrained = num_untrained.replace(/,/g, '');
	num_untrained = parseInt(num_untrained);
	list = document.body.innerHTML.match(/<td align="right">[\d,]+ Gold<\/td>/g);
	for (i = 0; i < list.length; i++)
	{
		list[i] = list[i].replace('<td align="right">', '');
		list[i] = list[i].replace(' Gold</td>', '');
		list[i] = list[i].replace(/,/g, '');
		list[i] = parseInt(list[i]);
	}
	var elems = document.getElementsByTagName('input');	for (i = 0; i < elems.length; i++)
	{
		if (elems[i].name.match(/mercs.*/g))
		{
			fields.push(elems[i]);
			var name = elems[i].name.match(/mercs.*/g)[0];
			name = name.replace('mercs[', '');
			name = name.replace(']', '');
			var input = document.createElement('input');
			input.id = '_' + name;
			input.type = 'submit';
			buttons.push(input);
			var cell = document.createElement('td');
			cell.appendChild(input);
			elems[i].parentNode.parentNode.appendChild(cell);
		}
	}
	updateButtons();
	document.addEventListener('click', function(event)
	{
		if (event.target.id.match(/_[\w]+/))
		{
			event.stopPropagation();
			event.preventDefault();
			var name = event.target.id.match(/_[\w]+/)[0];
			name = name.replace('_', '');
			var tmp = document.getElementsByName('mercs[' + name + ']')[0];
			tmp.value = event.target.value;
			updateButtons();
		}
	}, true);
	document.addEventListener('change', function(event)
	{
		if(event.target.name.match(/mercs\[[\w]+\]/))
		{
			event.stopPropagation();
			event.preventDefault();
			updateButtons();
		}
	}, true);
	expcolTable('Personnel');
	var buyyBut = GetElement('input', "Buy");
	buyyBut.value = buyyBut.value.replace("Buy", "Buy [b]");
	document.addEventListener('keyup',
		function(e)
		{
			if(e.target.type == "text") return;
			if(e.target.type == "textarea") return;
			if(e.target.type == "select-one") return;

			switch(e.keyCode)
			{
				case 66:     // B
				GetElement("input", "Buy [b]").click();
				break;
			}
	}, false);
}

function base()
{
	if(InStr(document.title,"Kings of Chaos :: ") == true){
		var usr = FindText(document.title,"Kings of Chaos :: ","'s ");
		GM_setValue("Koc_User",usr);
		var newlink = document.createElement('div');
		newlink.innerHTML  = '<div style="position:fixed;right:0;background-color:#000;font-family:arial;padding:5px;"><a href="#gm=h4x">Extra Functions</a></div>';
		document.body.insertBefore(newlink, document.body.firstChild);	
		document.addEventListener('click', BaseSetUp, true);
		//check URL
	//End checks.
	}
	addCSS('#_attacks{display:none;visibility:hidden;} #_notice{display:none;visibility:hidden;}');
	addJS('function ShowNotice(){var q = document.getElementById(\'_notice\');q.style.display = \'block\';q.style.visibility = \'visible\';q.nextSibling.href = \'javascript:HideNotice();\';q.nextSibling.innerHTML = \' - Hide Notice from Commander\'}',
	'function HideNotice(){var q = document.getElementById(\'_notice\');q.style.display = \'none\';q.style.visibility = \'hidden\';q.nextSibling.href = \'javascript:ShowNotice();\';q.nextSibling.innerHTML = \' + View Notice from Commander\'}');
	addJS('function ShowLAttacks(){var q = document.getElementById(\'_attacks\');q.style.display = \'block\';q.style.visibility = \'visible\';q.nextSibling.href = \'javascript:HideLAttacks();\';q.nextSibling.innerHTML = \' - Hide View last attacks\'}',
	'function HideLAttacks(){var q = document.getElementById(\'_attacks\');q.style.display = \'none\';q.style.visibility = \'hidden\';q.nextSibling.href = \'javascript:ShowLAttacks();\';q.nextSibling.innerHTML = \' + View last attacks\'}');

	var stuff = document.body.innerHTML;
	var blah = '';
	var blah2 = '';
	var blah3 = '';
	var blah4 = '';
	blah = '<!-- Start Quantcast tag -->';
	blah2 = '<!-- End Quantcast tag -->';
	blah3 = FindText(stuff,blah,blah2);
	newx = stuff.replace(blah3,'');
	blah = '<!-- BEGIN TAG - 120x600 - www.kingsofchaos.com - DO NOT MODIFY -->';
	blah2 = '<!-- END TAG -->';
	blah3 = FindText(stuff,blah,blah2);
	newx = newx.replace(blah3,'');
	blah = '<tr><th colspan="4">Recent Attacks on You</th></tr>';
	blah2 = '</table>';
	blah3 = '<tr><th colspan="4">Recent Attacks on You</th></tr>' + FindText(stuff,blah,blah2) + '';
	newx = newx.replace(blah3,'');
	var blah = '<tr><th>Notice from Commander';
	var blah2 = '</table>';
	var blah3 = '<tr><th>Notice from Commander' + FindText(stuff,blah,blah2) + '</table>';
	var blah4 = FindText(blah3,'left">','</t');
	var cnotice =  '<a href="#gm=estats">Extended Stats</a><br><br><a href="#gm=updateac">Update AC Server</a><b><b></td><td>';
	cnotice = cnotice + '<div id="_notice" align="center" style.visibility = \'hidden\'>' + blah4 + '</div><a href="javascript:ShowNotice();"> + View Notice from Commander</a></td>';
	newx = newx.replace(blah3,cnotice);
	blah = '<tr><th>Notice from Commander';
	blah2 = '</table>';
	blah3 = '<tr><th>Notice from Commander' + FindText(stuff,blah,blah2) + '</table>';
	newx = newx.replace(blah3,'');
	var myid = FindText(stuff,'http://www.kingsofchaos.com/recruit.php?uniqid=','">http://');
	blah = 'Grow Your Army!';
	blah2 = '</table>';
	blah3 = 'Grow Your Army!' + FindText(stuff,blah,blah2) + '';
	var rv;
	var _ver = 1.0;
	rv = '<a href="http://www.kingsofchaos.com/recruit.php?uniqid=' + myid + '">Kings Of Fail - Age 14  (' + _ver + ')</a>';
	if((GM_getValue("Koc_User") == 'Shane') || (GM_getValue("Koc_User") == 'Xryst')){
		rv = '<a href="http://www.kingsofchaos.com/recruit.php?uniqid=' + myid + '"><font color="ffffff">&hearts; Shane &hearts;</font></a>';
	}
	newx = newx.replace(blah3,rv);
	blah = '<!-- BEGIN TAG - 468x60 - www.kingsofchaos.com - DO NOT MODIFY -->';
	blah2 = '<!-- END TAG -->';
	blah3 = FindText(stuff,blah,blah2);
	newx = newx.replace(blah3,'');
	blah = '<!-- BEGIN TAG - 468x60 - www.kingsofchaos.com - DO NOT MODIFY -->';
	blah2 = '<!-- END TAG -->';
	blah3 = FindText(stuff,blah,blah2);
	newx = newx.replace(blah3,'');
	blah = '<th colspan="2" align="center">Military Overview</th>';
	blah2 = '</table>';
	blah3 = '<th colspan="2" align="center">Military Overview</th>' + FindText(stuff,blah,blah2) + '';
	blah = '<th colspan="3">Military Effectiveness</th>';
	blah2 = '</table>';
	blah4 = '<th colspan="3">Military Effectiveness</th>' + FindText(stuff,blah,blah2) + '';
	newx = newx.replace(blah4,blah3);
	newx = newx.replace(blah3,blah4);
	newx = replaceAll(newx,'<td align="right">[ <a href="train.php">train more</a> ]</td>','');
	newx = replaceAll(newx,'<td align="right">[ <a href="mercs.php">hire more</a> ]</td>','');
	newx = replaceAll(newx,'<td align="right">[ <a href="base.php">recruit more</a> ]</td>','');
	newx = replaceAll(newx,'<td align="right">[ <a href="recruit.php">recruit more</a> ]</td>','');
	if(GM_getValue("BasePageEdits") != '0'){
		document.body.innerHTML = newx;	
	}else{
		expcolTable('Military Effectiveness');
		expcolTable('Recent Attacks on You');
		expcolTable('Notice from Commander');
		expcolTable('Military Overview');
		expcolTable('Personnel');
		expcolTable('Officers');
		expcolTable('Previous Logins');
		expcolTable('Preferences');
		//expcolTable('Grow Your Army!');
	}
	var bmsg = document.getElementsByTagName("table");
			get(GM_getValue("serverURL") + '/ac/script/GM_Base2.php?u=' + GM_getValue("Koc_User") + '&v=' + cver,function(r){
			var msg = FindText(r,"<msg>","</msg>");
			bmsg[6].innerHTML = msg;
		});
}
 
function CheckIntel(){
	var stuff = document.body.innerHTML;
	if(stuff.match("Your Chief of Intelligence dispatches"))
	{
		sab();
	}else{ 
		recon();
	}
}


function sab(){
	var stuff = document.body.innerHTML;
	if(stuff.match("but are spotted by sentries before they enter")) //Fail sab...
	{
		var Username = FindText(stuff,"Your spies attempt to break into ","'s armory");
		if( Username != GM_getValue("failsab_user") )
		{
			GM_setValue("failsab",0);
			GM_setValue("failsab_user",Username);
			GM_setValue("failsab_nuns",0);
		}
		var failsab = GM_getValue("failsab");
		failsab += 1;
		GM_setValue("failsab",failsab);	
		if(InStr(stuff,' of Nunchaku')==true)
		{		  
			var nuns = parseInt(FindText(stuff,"<li> "," of Nunchaku"));
			nuns += GM_getValue("failsab_nuns");
			GM_setValue("failsab_nuns",nuns);
		}
		history.go(-1);
	} else { //Good sab
		var ReportID = String(document.URL).substr(String(document.URL).indexOf('=')+1, 8);
		if(InStr(stuff,'Your spies successfully enter ') == true){
			var sabbee = FindText(stuff,"Your spies successfully enter ","'s");
			var amount = FindText(stuff,"and destroy ","of the ");
			var weapon = FindText(stuff,"of the enemy's ","stockpile.");
			var whoami = GM_getValue("Koc_User");
			//alert('GM_Log.php?type=sab&sabber=' + whoami + '&sabbee=' + sabbee + '&weapon=' + weapon + '&amount=' + amount + '&rid=' + ReportID);
				ReturnRequest('GM_Log.php?type=sab&sabber=' + whoami + '&sabbee=' + sabbee + '&weapon=' + weapon + '&amount=' + amount + '&rid=' + ReportID,0,function(responseText){
					//alert();
					var c = FindText(responseText,'<chuck>','</chuck>');
					c = '<b><font color="yellow">' + c + '</b></font><br>';
					var x = document.body.innerHTML;
					var xx = x.replace("Copyright",c)
					document.body.innerHTML = xx;
				});
		}
	}	
}  


function Loading(something)
{
	var x = document.createElement('div'); 
	x.style.width = document.body.offsetWidth + 'px';
	x.style.height = document.body.offsetHeight + 'px';
	x.style.position = 'absolute';
	x.style.top = '0px';
	x.style.left = '0px';
	x.style.backgroundColor = '#000000';
	x.style.opacity = '0.5';
	x.id = 'sabwait';
	var y = document.createElement('div');
	y.id = 'picnik-overlay-gears';
	y.name = "gearx";
	y.style.top="50%";
	y.style.left="50%";
	if(something.length > 2){
		y.innerHTML = something;
	}else{
		var z = document.createElement('img');
		z.src = gears;
	}
	y.style.display="block";
	y.style.position="fixed";
	y.style.zIndex = "9998";
	if(something.length > 2){
	}else{
		y.appendChild(z);
	}
	x.appendChild(y);
	document.body.appendChild(x);
}

function StopLoading()
{
	document.body.removeChild(document.getElementById('sabwait'));
}

function InputMessage(event) {
	var stuff = document.body.innerHTML;
	user = stuff.split("<b>To:</b> ");
	user = user[1].split("</th>");
	Username = user[0];
	var pm = GM_getValue("MessageAutoFill").replace("%name%",Username);
	document.getElementsByTagName('textarea')[0].value=pm;
}
  
function SetMessage(event)
{
	addCSS("#_xxmd_prefs {position:fixed; left:20%; right:20; bottom:100; top:auto; width:70%;  color:#ffffff; font: 11px Verdana; border-top:1px #888888 solid; background:#000000;}",
		"#_xxmd_prefs .main { text-align: left;padding:5px 0 0.4em 0; width:800px; margin: auto;}",
		"#_xxmd_prefs input[type=submit] {font: normal 11px sans-serif; border: 1px solid #0080cc; color: #333; cursor: pointer; background: #FFF;}",
		"#_md_prefs input[x       ]{background: #CCC;}",
		"#_xxmd_prefs input[type=text] { width: 50px; }",
		".label { widtH: 125px; float: left; }",
		".input { width: 51px; float:right; }");	
	var prefs = document.createElement("div");
	prefs.id = "_xxmd_prefs";
	prefs.innerHTML = '<center>%name% to replace username.<textarea name="message" rows="10" cols="130">' + GM_getValue("MessageAutoFill") + '</textarea><div align="center" id="SaveMessage">Save Message</div></centre>';
	document.body.appendChild(prefs);
	document.addEventListener('click', function(event) {
	if(event.target.id == "SaveMessage"){
		var messagex = document.getElementsByTagName('textarea')[1].value;
		GM_setValue('MessageAutoFill', messagex);
		var prefs = document.getElementById("_xxmd_prefs");
		if(prefs) prefs.style.display="none";
	}
	}, true);
}  
  
function writemail(){
	var prefs = document.getElementById("_md_prefs");
	addCSS(
		"#_xmd_prefs {position:fixed; left:auto; right:0; bottom:100; top:auto; width:120px;  color:#ffffff; font: 11px Verdana; border-top:1px #000000 solid; background:#000000;}",
		"#_xmd_prefs div { text-align: left;padding:5px 0 0.4em 0; width:100%; margin: auto;}",
		"#_xmd_prefs input[type=submit] {font: normal 11px sans-serif; border: 1px solid #0080cc; color: #333; cursor: pointer; background: #FFF;}",
		"#_xmd_prefs input[x       ]{background: #CCC;}",
		"#_xmd_prefs input[type=text] { width: 100px; }"
	);
	var prefs = document.createElement("div");
	prefs.id = "_xmd_prefs";
	var t = "<div>";
	t+= "<input type='submit' id='seta' value='Set Auto Fill' /><div style='float:left; width: 20%;'></div><br>";
	t+= "<input type='submit' id='enters' value='Auto Fill' /><div style='float:left; width: 20%;'></div>";
	t += "</div>";
	//alert(prefs);
	prefs.innerHTML = t;
	document.body.appendChild(prefs);
	document.getElementById("seta").addEventListener('click', SetMessage, true);
	document.getElementById("enters").addEventListener('click', InputMessage, true);
	var stuff = document.body.innerHTML;
	var username = FindText(stuff,'<th align="left"><b>To:</b> ','</th>');
	var dt = new Date();
	var unixtime = Math.max((Date.parse(dt))/1000); 
	var lastmsg = GM_getValue("KoC_Message_Time_" + username);
	document.addEventListener('click', function(event) {
		if(event.target.name == "send"){
			var message = document.getElementsByTagName('textarea')[0].value;
			GM_setValue('KoC_Message_Msg_' + username, message);
			GM_setValue('KoC_Message_Time_' + username, unixtime);
		}
		if(event.target.id == "HideMessage"){
			var prefs = document.getElementById("_md_prefs");
			if(prefs) prefs.style.display="none";
		}
		if(event.target.id == "GM_Message"){
		addCSS("#_md_prefs {position:fixed; left:0; right:0; bottom:0; top:auto; width:100%;  color:#ffffff; font: 11px Verdana; border-top:1px #888888 solid; background:#000000;}",
				"#_md_prefs .main { text-align: left;padding:5px 0 0.4em 0; width:800px; margin: auto;}",
				"#_md_prefs input[type=submit] {font: normal 11px sans-serif; border: 1px solid #0080cc; color: #333; cursor: pointer; background: #FFF;}",
				"#_md_prefs input[x       ]{background: #CCC;}",
				"#_md_prefs input[type=text] { width: 50px; }",
				".label { widtH: 125px; float: left; }",
				".input { width: 51px; float:right; }");		
			var prefs = document.createElement("div");
			prefs.id = "_md_prefs";
			prefs.innerHTML = '<center>' + ConvertTime(lastmsg) + '<br><textarea name="message" rows="10" cols="130">' + GM_getValue("KoC_Message_Msg_" + username) + '</textarea><div align="center" id="HideMessage">Hide Message</div></centre>';
			document.body.appendChild(prefs);
		}
		}, true);
	if (lastmsg > 1){
		DisplayMessage("Last message was sent: " + ConvertTime(lastmsg) + '   [Click me to read]');
	}else{
		DisplayMessage("Last message was sent: unknown");
	}
}

 
function ConvertTime (oldtime) {
	var dt = new Date();
	var unixtime = Math.max((Date.parse(dt))/1000); 
	var diff = Math.max(unixtime - oldtime);
	var strTime = "";
	if (diff > 86400) {
		var d = Math.max(Math.floor(diff / 86400));
		diff = Math.max(diff - Math.max(d * 86400));
		strTime = strTime + d + " days, ";
	}
	if (diff > 3600) {
		var h = Math.max(Math.floor(diff / 3600));
		diff = Math.max(diff - Math.max(h * 3600));
		strTime = strTime + h + " hours, ";
	} 
	if (diff > 60) {
		var m = Math.max(Math.floor(diff / 60));
		diff = Math.max(diff - Math.max(m * 60));
		strTime = strTime + m + " minutes, ";
	}
	strTime = strTime + diff + " seconds ago";
	return strTime;
}
  
function CustomPage() {
	var stuff = document.body.innerHTML;
	var page = String(document.URL).substr(String(document.URL).indexOf('=')+1, 65);
	var newhtml='Error...';
	var whoami = GM_getValue("Koc_User");
	ReturnRequest('GM_CustomPage.php?page=' + page + '&u=' + whoami,1,function(r){
		var newhtml = stuff.replace("Loading...",''); 
		var newhtml = newhtml.replace("Please wait...",r); 
		document.body.innerHTML = newhtml;
	});
}
  

function stats() {
	var userid = String(document.URL).substr(String(document.URL).indexOf('=')+1, 7);
	var stuff = document.body.innerHTML;
	var newhtml = '';
	if (!IsNumeric(userid)) {
		newhtml = stuff.replace("Error",'Loading...'); 
		newhtml = newhtml.replace("Invalid User ID",'Please wait...'); 
		document.body.innerHTML = newhtml;
		CustomPage();
	} else {
		if (InStr(stuff,"Invalid User ID") == true) {
			ReturnRequest('GM_Active.php?id=' + userid + '&a=0',1,function(r){
				newhtml = stuff.replace("Invalid User ID",'Invalid UserID (Vacation mode or deleted)<br>' + r); 
				document.body.innerHTML = newhtml;
			});	
		} else {
			var user = FindText(FindText(stuff,"<td><b>Name:</b></td>","</tr>"),"<td>","</td>");
			if(InStr(user,'<font color="#ffff00">') == true){ //Online
				user = FindText(user,">","<");
			} else { //Offline
				user = replaceAll(user,"\t","");
				user = replaceAll(user,"\n","");
			}
			UsersSize = FindText(FindText(stuff,"<td><b>Army Size:</b></td>","</tr>"),"<td>","</td>");
			UsersRank = FindText(FindText(stuff,"<td><b>Rank:</b></td>","</tr>"),"<td>","</td>");
			var UserChain = FindText(FindText(stuff,"<td><b>Chain Name:</b></td>","</tr>"),"<td>","</td>");
			var UsersRace = FindText(FindText(stuff,"<td><b>Race:</b></td>","</tr>"),"<td>","</td>");
			var UsersCommander = FindText(FindText(stuff,"<td><b>Commander:</b></td>","</tr>"),"<td>","</td>");
			UsersGold = "1337";
			if(InStr(stuff,"stats") == true){
				UsersCommander = FindText(UsersCommander,">","<");
			}
			if(InStr(stuff,"Treasury:") == true){
				UsersGold = FindText(FindText(stuff,"<td><b>Treasury:</b></td>","</tr>"),"<td>","</td>");
			}
			ReturnRequest('GM_DisplayStats.php?user=\n' + user + '&sid=' + userid + '&size=\n' + UsersSize + '&gold=\n' + UsersGold + '&rank=\n' + UsersRank + '&com=' + UsersCommander + '&race=' + UsersRace + "&c=" + UserChain,0,function(responseText){
			
				TheSA = addCommas(FindText(responseText,"[SA]","[/SA]"));
				TheDA = addCommas(FindText(responseText,"[DA]","[/DA]"));
				TheSpy = addCommas(FindText(responseText,"[Spy]","[/Spy]"));
				TheSentry = addCommas(FindText(responseText,"[Sentry]","[/Sentry]"));
				TheAge = FindText(responseText,"[Age]","[/Age]");
				TheChain = FindText(responseText,"[Chain]","[/Chain]");
				sGold = FindText(responseText,"[gold]","[/gold]");
				uTag = FindText(responseText,"[tag]","[/tag]");
				sTBG = FindText(responseText,"[tbg]","[/tbg]");

				// --Display info
				var msg = '<b>Strike</b>: \n' + TheSA + '  | <b>Defence</b>: \n' + TheDA + '  | <b>Spy</b>: \n' + TheSpy + '  | <b>Sentry</b>: \n' + TheSentry + '  | <b>Last Updated</b>: \n' + TheAge;
				DisplayMessage(msg);
				// -- Display info
			});

			AppendStatsTable(UsersGold);
			SetChain();
			expcolTable('Officers');
			expcolTable('Recent Intelligence');
			expcolTable('Recent Battles');

			var cBut1 = GetElement('input', "Attack Now!");
			cBut1.value = cBut1.value.replace("Attack Now!", "Attack Now! [g]");
			var cBut2 = GetElement('input', "Raid Now!");
			cBut2.value = cBut2.value.replace("Raid Now!", "Raid Now! [y]");
			var cBut3 = GetElement('input', "Sabotage!");
			cBut3.value = cBut3.value.replace("Sabotage!", "Sabotage! [s]");
			var cBut4 = GetElement('input', "Recon Now!");
			cBut4.value = cBut4.value.replace("Recon Now!", "Recon Now! [r]");
			var cBut5 = GetElement('input', "Send Message");
			cBut5.value = cBut5.value.replace("Send Message", "Send Message [m]");

			document.addEventListener('keyup',
			function(e)
			{
				if(e.target.type == "text") return;
				if(e.target.type == "textarea") return;
				if(e.target.type == "select-one") return;
				switch(e.keyCode)
				{
					case 71:     // G
					GetElement("input", "Attack Now! [g]").click();
					break;
					case 89:     // Y
					GetElement("input", "Raid Now! [y]").click();
					break;
					case 83:     // S
					GetElement("input", "Sabotage! [s]").click();
					break;
					case 82:     // R
					GetElement("input", "Recon Now! [r]").click();
					break;
					case 77:     // M
					GetElement("input", "Send Message [m]").click();
					break;
				}
			}, false);
		}
	}
}

function SetChain()
{
	if (TheChain == 'NULL'){
		setTimeout(SetChain, 1500);
	} else {
		if(document.getElementById('_sgold') != null){
			document.getElementById('_sgold').innerHTML = sGold;
		}
		document.getElementById('_chain').innerHTML = TheChain;
		document.getElementById('_stbg').innerHTML = sTBG;
	}
}

function AppendStatsTable() // function mostly wrote by Lukas Brueckner
{	
	var nameRE = /\<th colspan="2"\>User Stats\<\/th\>/ig;
	var q = document.getElementsByTagName('table');
	var statstable;
	var i;
	for(i = 0; i < q.length; i++){
		if(q[i].innerHTML.match(nameRE) && !q[i].innerHTML.match(/\<table/))
		{
			statstable = q[i];
			break;
		}
	}
	var allianceindex;
	for (i = 0; i < statstable.rows.length; i++) {
		if (statstable.rows[i].cells[0].innerHTML.indexOf('Alliances') > 0) {
			allianceindex = i;
			break;
		}
	}
	statstable.rows[allianceindex].cells[1].innerHTML = '<div id="_alliances">' + statstable.rows[allianceindex].cells[1].innerHTML + '</div><a href="javascript:ShowAlliances();"> + Show</a>';
	statstable.insertRow(7).innerHTML = '<td><b>Chain: <b></td><td><div id="_chain" style.visibility = \'hidden\'>Fetching Data...</div><a href="javascript:ShowChain();"> + Show Chain</a></td>';
	//statstable.insertRow(6).innerHTML = '<td><b>Chain Name: <b></td><td><div id="_chainname">???</div></td>';
	if(UsersGold == 1337){ //User can see gold, No need to show old gold.....
		statstable.insertRow(11).innerHTML = '<td><b>Last Gold: <b></td><td><div id="_sgold">???</a></td>';
	}
	statstable.insertRow(13).innerHTML = '<td><b>Approx TBG(60min): <b></td><td><div id="_stbg">???</a></td>';
	addCSS('#_alliances{display:none;visibility:hidden;} #_chain{display:none;visibility:hidden;}');
	addJS('function ShowChain(){var q = document.getElementById(\'_chain\');q.style.display = \'block\';q.style.visibility = \'visible\';q.nextSibling.href = \'javascript:HideChain();\';q.nextSibling.innerHTML = \' - Hide Chain\'}',
	'function HideChain(){var q = document.getElementById(\'_chain\');q.style.display = \'none\';q.style.visibility = \'hidden\';q.nextSibling.href = \'javascript:ShowChain();\';q.nextSibling.innerHTML = \' + Show Chain\'} function ShowAlliances(){var q = document.getElementById(\'_alliances\');q.style.display = \'block\';q.style.visibility = \'visible\';q.nextSibling.href = \'javascript:HideAlliances();\';q.nextSibling.innerHTML = \' - Hide\'}',
	'function HideAlliances(){var q = document.getElementById(\'_alliances\');q.style.display = \'none\';q.style.visibility = \'hidden\';q.nextSibling.href = \'javascript:ShowAlliances();\';q.nextSibling.innerHTML = \' + Show\'}');
}

function recon(){
	var stuff = document.body.innerHTML;
	if (InStr(stuff,"Your Chief of Intelligence provides you with the information gathered") == true)
	{
		var ReportID = String(document.URL).substr(String(document.URL).indexOf('=')+1, 8);
		var Username = FindText(stuff,"Under the cover of night, your spy sneaks into ","'s camp.");
		var Strike = FindText(FindText(stuff,"<td>Strike Action:</td>","</tr>"),">","</");
		var Defence = FindText(FindText(stuff,"<td>Defensive Action</td>","</tr>"),">","</");
		var TheSpy = FindText(FindText(stuff,"<td>Spy Rating</td>","</tr>"),">","</");
		var TheSentry = FindText(FindText(stuff,"<td>Sentry Rating</td>","</tr>"),">","</");
		var NumberOfCoverts = FindText(FindText(stuff,"<td>Covert Operatives:</td>","</tr>"),">","</");
		var UsersGold = FindText(FindText(stuff,"Treasury","</td>"),'">'," Gold");
		var StatsID = FindText(stuff,'"id" value="','"');

		if( Username != GM_getValue("failspy_user") )
		{
			GM_setValue("failspy_user",Username);
			GM_setValue("last_SA",'???');
			GM_setValue("last_DA",'???');
			GM_setValue("last_Spy",'???');
			GM_setValue("last_Sentry",'???');
			
			GM_setValue("last_Gold",'???');
			
			//weap
			GM_setValue("last_BPM",'BPM: ???');
			GM_setValue("last_IS",'IS: ???');
			GM_setValue("last_NUN",'NUN: ???');
			GM_setValue("last_LT",'LT: ???');
			GM_setValue("last_CH",'CH: ???');
			GM_setValue("last_DS",'DS: ???');	
		}
		GM_setValue("last_Gold", '<b>GOLD ' + UsersGold + '</b>');
		
		if(CheckStat(Strike) == true) { GM_setValue("last_SA", Strike); }
		if(CheckStat(Defence) == true) { GM_setValue("last_DA", Defence); }
		if(CheckStat(TheSpy) == true) { GM_setValue("last_Spy", TheSpy); }
		if(CheckStat(TheSentry) == true) { GM_setValue("last_Sentry", TheSentry); }

		cands=document.getElementsByTagName("tr");
		const trRE=/\<tr\>/ig;
		usetgold = "[dude]user=" + Username + "[/dude]start";
		
		for(i=47;i<cands.length;i++){
		//if (InStr(cands[i].innerHTML,'??' == true)){
			if (InStr(cands[i].innerHTML,'<td align="right">') == true)
			{
				cWeap = cands[i].innerHTML.split('<td align="right">');
				//alert(cands[i].innerHTML);
				type = FindText(cWeap[1],'','</td>');
				qu = FindText(cWeap[2],'','</td>');
				st = FindText(cWeap[3],'','</td>');
				var weap = FindText(cands[i].innerHTML,"<td>","</td>");
				
				if(qu != "???"){
					if(ValidWeapon(weap,st) == true){
						usetgold = usetgold + "[weap]--w=" + weap + "--q=" + qu + " + --s=" + st + "--x[weap]";
						
						//new?
						
						if((WeaponFromStrength(st) == 'IS') || (WeaponFromName(weap) == 'IS')){ 
							//if(InStr(st,'??') == false) { strengthIS = st; }
							sIS = "IS: " + qu + ' (' + strengthIS + ' )'; 
							GM_setValue("last_IS",sIS);
						}else if((WeaponFromStrength(st) == 'NUN') || (WeaponFromName(weap) == 'NUN')){ 
							sNUN = "NUN: " + qu;
							GM_setValue("last_NUN",sNUN);
						}else if((WeaponFromStrength(st) == 'BPM') || (WeaponFromName(weap) == 'BPM')){ 
							//if(InStr(st,'??') == false) { strengthBPM = st; }
							sBPM = "BPM: " + qu + ' (' + strengthBPM + ' )';  
							GM_setValue("last_BPM",sBPM);
						}else if((WeaponFromStrength(st) == 'LT') || (WeaponFromName(weap) == 'LT')){ 
							sLT = "LT: " + qu;
							GM_setValue("last_LT",sLT);
						}else if((WeaponFromStrength(st) == 'LT') || (WeaponFromName(weap) == 'Skins')){ 
							sDS = "Skins: " + qu;
							GM_setValue("last_DS",sDS);
						}else if((WeaponFromStrength(st) == 'LT') || (WeaponFromName(weap) == 'Chariots')){ 
							sCH = "Chariots: " + qu;
							GM_setValue("last_CH",sCH);
						}
						
					}
				}
				
			}
		}
		var whoami = GM_getValue("Koc_User");
		usetgold = usetgold  + "end";
		MakeRequest('GM_Recon.php?user=\n' + Username + '&sa=\n' + Strike + '&da=\n' + Defence + '&spy=\n' + TheSpy  + '&sentry=\n' + TheSentry + '&statsid=\n' + StatsID + '&gold=\n' + UsersGold + '&coverts=\n' + NumberOfCoverts + '&u=\n' + whoami + '&rid=' + ReportID);
		MakeRequest('GM_AATRecon.php?list=\n' + usetgold);

		if(GM_getValue("spy") == 1)
		{
			history.go(-1);
		}		
	}else{
		history.go(-1);
	}
}


function ValidWeapon(a,b)
{
	var ValidWeapon = false;
	if (InStr(a,'Nunchaku') == true)
	{
		ValidWeapon = true;
//	}else if (InStr(b,'100') == true)
//	{
//		ValidWeapon = true;
	}else if (InStr(a,'Lookout') == true)
	{
		ValidWeapon = true;
	}else if (InStr(a,'Invisibility') == true)
	{
		ValidWeapon = true;
//	}else if (InStr(b,'10,000') == true)
//	{
//		ValidWeapon = true;
	}else if (InStr(a,'Blackpowder ') == true)
	{
		ValidWeapon = true;
//	}else if (InStr(b,'12,000') == true)
//	{
//		ValidWeapon = true;
	}else if (InStr(a,'Chariot') == true)
	{
		ValidWeapon = true;
	}else if (InStr(a,'Dragonskin') == true)
	{
		ValidWeapon = true;
	}
	return ValidWeapon;
}


function battlefield() {
	setTimeout(battlefield, 1500);
	var stuff = document.body.innerHTML;
	tmp = FindText(FindText(stuff,'player" href="/stats.php?id=','/a>'),">","<");
	if (firstuser == 'undefined') { //First page load
		firstuser = tmp;
		battlefield2();
	} else {
		if(firstuser == tmp) {
			//Same page, don't do anything.
		} else {
			firstuser = tmp;
			battlefield2();
		}
	}
}


function battlefieldUser(){
	document.addEventListener('click', function(event) {
		if(InStr(event.target,"stats.php?") == true)
		{
			var userid = String(event.target).substr(String(event.target).indexOf('=')+1, 7);
			bfStats(userid);
		}
	}, true);
}

function bfStats(id)
{
	ReturnRequest('GM_DisplayStatsBF.php?user=' + id,0,function(responseText){
		DisplayMessage2(responseText);
	});
}

function battlefield2()
{
	var usetgold = '';
	var alltables = document.getElementsByTagName('table');
	for (i=0;i<alltables.length;i++)
	{
		if(alltables[i].rows[0].cells.length>1){
			if(alltables[i].rows[0].cells[1].innerHTML.match("Alliance"))
			{
				var ms_table = alltables[i];
			}
		}
	}
	rows = ms_table.rows;
	ii=0;
	iii=0;
	var gold=Array();
	var names=Array();
	var ids=Array();
	var tff=Array();
	var tag=Array();
	var reqnames=Array();
	var rank=Array();
	var online=Array();
	var BattiefieldArray = new Array();
	for (i=1;i<rows.length-1;i++)
	{
		if(InStr(rows[i].cells[2].childNodes[0].style.cssText,"rgb") == true)
		{ 
			online[ii] = '1';
		}else{
			online[ii] = '0';
		}
		tff[ii]=rows[i].cells[3].innerHTML.replace(/,/g,"");
		gold[ii]=rows[i].cells[5].innerHTML.replace(" Gold","").replace(/,/g,"");
		names[ii]=rows[i].cells[2].childNodes[0].innerHTML;
		ids[ii]=rows[i].cells[2].childNodes[0].href.replace("http://www.kingsofchaos.com/stats.php?id=","");
		rank[ii]=rows[i].cells[6].innerHTML.replace(/,/g,"");
			
		if(dis=0){
		if(GM_getValue("bf_Enabled") == 'checked'){ //Filter enabled...
		
			if(GM_getValue("bf_MinGold") == 'checked'){
				if(Math.max(gold[ii]-parseInt(GM_getValue("bf_MinGoldValue"))) > 10)
				{
				//	rows[i].cells[5].innerHTML = '<font color="red">' + rows[i].cells[5].innerHTML + '</font>';
				}else{
					rows[i].style.display = 'none';
				}
			}
			if(GM_getValue("bf_QuestionMark") == 'checked'){
				if(rows[i].cells[5].innerHTML.indexOf("???")==-1)
				{
				//	rows[i].cells[5].innerHTML = '<font color="red">' + rows[i].cells[5].innerHTML + '</font>';
				}else{
					rows[i].style.display = 'none';
				}
			}
			if(GM_getValue("bf_MinTFF") == 'checked'){
				if(Math.max(tff[ii]-parseInt(GM_getValue("bf_MinTFFValue"))) > 10)
				{
				//	rows[i].cells[5].innerHTML = '<font color="red">' + rows[i].cells[5].innerHTML + '</font>';
				}else{
					rows[i].style.display = 'none';
				}
			}
		}
	}
	usetgold = usetgold + "[d]u=" + names[ii] + "*g=" + gold[ii] + "*o=" + online[ii] + "*t=" + tff[ii] + "--s=" + ids[ii] + "*[/d]"; //"--s=" + ids[ii] + "--[/dude]";
	if(rows[i].cells[5].innerHTML.indexOf("???")==-1){
		BattiefieldArray[i-1] = new Array(gold[ii],'<a href="stats.php?id=' + ids[ii] + '">' + names[ii] + '</a>',tff[ii]);
		}
		ii++;
	}
	SortIt(BattiefieldArray,0,1,2,3);
	BattiefieldArray.reverse();
	var newhtml = '<table border="1" bordercolor="#111111" width="100%" id="AutoNumber1"><tr><td width="33%">Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
	'<td width="33%">TFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
	'<td width="34%">Gold&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
	for(i=0;i<BattiefieldArray.length;i++){
		if(String(BattiefieldArray[i]) == 'undefined'){
		}else{
			newhtml += '  <tr>'+
			'<td width="33%">' + BattiefieldArray[i][1] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
			'<td width="33%">' + addCommas(BattiefieldArray[i][2]) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
			'<td width="33%">' + addCommas(BattiefieldArray[i][0]) + ' Gold&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>\n'+
			'</tr>';
		}
	}
	newhtml += '</table>';
  	params = "list=" + usetgold;
	logBattlefield(params,function(html){	
		DisplayMessage("Data Collected");
		//alert(html);
		dothis(html);	
	});
}

function dothis(html)
{

	var alltables = document.getElementsByTagName('table');
	for (i=0;i<alltables.length;i++)
	{
		if(alltables[i].rows[0].cells.length>1){
			if(alltables[i].rows[0].cells[1].innerHTML.match("Alliance"))
			{
				var ms_table = alltables[i];
			}
		}
	}
	rows = ms_table.rows;
	ii=0;
	iii=0;

	var tmpGold;
	
	var BattiefieldArray = new Array();
	for (i=1;i<rows.length-1;i++)
	{

			if(html.match(rows[i].cells[2].childNodes[0].innerHTML)){
				tmpGold = FindText(html,rows[i].cells[2].childNodes[0].innerHTML,"*"); //
				tmpGold = tmpGold.replace(";",' </font><font color=yellow>');// + '</font>';
				rows[i].cells[5].innerHTML = '<font color=Dodgerblue>' + tmpGold;//  + '</font>';
				tmpGold='';
			}	
	}
}

function logBattlefield(data,cb){
	GM_xmlhttpRequest({
	method: "POST",
	url: GM_getValue("serverURL") + "/ac/script/GM_BattlefieldGold.php",
	headers:{'Content-type':'application/x-www-form-urlencoded'},
	data:encodeURI(data),
	onload: function(xhr) { cb(xhr.responseText); 
	}
	});
}

function attack()
{
	var stuff = document.body.innerHTML;
	var userid = String(document.URL).substr(String(document.URL).indexOf('=')+1, 7);
	if (InStr(stuff,"Invalid User ID") == true) {
		ReturnRequest('GM_Active.php?id=' + userid + '&a=0',1,function(r){
			newhtml = stuff.replace("Invalid User ID",'Invalid UserID (Vacation mode or deleted)<br>' + r); 
			document.body.innerHTML = newhtml;
		});	
	}
	isTurn();
	var sel = document.getElementsByName('enemy_weapon')[0];
	sel.selectedIndex = GM_getValue('kocsabbselect',"0");
	var numsab = document.getElementsByName('numsab')[0];
	numsab.value = GM_getValue('kocsabbnum',"0");
	var spysab = document.getElementsByName('numspies')[0];
	spysab.value = GM_getValue('kocsabbspynum','1');
	spysab.id = "__sabb";
	var spysab = document.getElementsByName('sabturns')[0];
	spysab.value = GM_getValue('kocsabturns','1');
	spysab.id = "__xsabb";
	document.addEventListener('change', function(event) {
		if(event.target.name == 'enemy_weapon'){
			GM_setValue('kocsabbselect',event.target.selectedIndex);
			event.stopPropagation();
  			event.preventDefault();
		}else if(event.target.name == 'numsab'){
			GM_setValue('kocsabbnum',event.target.value);
			event.stopPropagation();
  			event.preventDefault();
		}else if(event.target.name == 'sabturns'){
			GM_setValue('kocsabturns',event.target.value);
			event.stopPropagation();
  			event.preventDefault();
		}else if(event.target.id == '__sabb'){
			GM_setValue('kocsabbspynum',event.target.value);
			event.stopPropagation();
  			event.preventDefault();
		}
	}, true);	

	var user = FindText(FindText(stuff,'"stats.php?id=',"a>"),">","<");
	gUser = FindText(FindText(stuff,'"stats.php?id=',"a>"),">","<");;
	var whoami = GM_getValue("Koc_User");	
	ReturnRequest('GM_AAT.php?user=' + user + '&me=' + whoami,0,function(responseText){
	DisplayMessage(responseText);
	table = '<table class="table_lines" align="center" width="120%" cellspacing="0" cellpadding="6" border="0">'+
  '<tr><th colspan="3">Recent Stats</th></tr>'+
	'<tr><td><b>Strike Action</b></td><td colspan="2">' + FindText(responseText,"<sa=","></sa>").split("|")[0] + '&nbsp;</td></tr>'+
	'<tr><td><b>Defensive Action</b></td><td colspan="2">' + FindText(responseText,"<da=","></da>").split("|")[0] + '&nbsp;</td></tr>'+
	'<tr><td><b>Spy Rating</b></td><td colspan="2">' + FindText(responseText,"<spy=","></spy>").split("|")[0] + '&nbsp;</td></tr>'+
	'<tr><td style="border:0;"><b>Sentry Rating</b></td><td colspan="2" style="border:0;">' + FindText(responseText,"<sentry=","></sentry>").split("|")[0] + '&nbsp;</td></tr>'+
	'<tr><th colspan="3">Armory Information</th></tr>'+
	'<tr><td>&nbsp;</td><td align="right"><b>AAT</b></td><td align="right"><b>In Stock</b></td></tr>'+
	'<tr><td><b>Blackpowder Missiles</b></td><td align="right">' + FindText(responseText,"<bpmaat=","></bpmaat>").split("|")[0] + '</td><td style=\"text-align:right\">' + FindText(responseText,"<bpm=","></bpm>").split("|")[0] + ' (' + FindText(responseText,"<bpm=","></bpm>").split("|")[1] + ' ago)</td></tr>'+
	'<tr><td><b>Chariots</b></td><td align="right">' + FindText(responseText,"<chaat=","></chaat>").split("|")[0] + '</td><td style=\"text-align:right\">' + FindText(responseText,"<ch=","></ch>").split("|")[0] + ' (' + FindText(responseText,"<ch=","></ch>").split("|")[1] + ' ago)</td></tr>'+
	'<tr><td><b>Invisibility Shields</b></td><td align="right">' + FindText(responseText,"<isaat=","></isaat>").split("|")[0] + '</td><td style=\"text-align:right\">' + FindText(responseText,"<is=","></is>").split("|")[0] + ' (' + FindText(responseText,"<is=","></is>").split("|")[1] + ' ago)</td></tr>'+
	'<tr><td><b>Dragonskin</b></td><td align="right">' + FindText(responseText,"<dsaat=","></dsaat>").split("|")[0] + '</td><td style=\"text-align:right\">' + FindText(responseText,"<ds=","></ds>").split("|")[0] + ' (' + FindText(responseText,"<ds=","></ds>").split("|")[1] + ' ago)</td></tr>'+
	'<tr><td><b>Nunchakus</b></td><td align="right">' + FindText(responseText,"<nunaat=","></nunaat>").split("|")[0] + '</td><td style=\"text-align:right\">' + FindText(responseText,"<nun=","></nun>").split("|")[0] + ' (' + FindText(responseText,"<nun=","></nun>").split("|")[1] + ' ago)</td></tr>'+
	'<tr><td><b>Lookout Towers</b></td><td align="right">' + FindText(responseText,"<ltaat=","></ltaat>").split("|")[0] + '</td><td style=\"text-align:right\">' + FindText(responseText,"<lt=","></lt>").split("|")[0] + ' (' + FindText(responseText,"<lt=","></lt>").split("|")[1] + ' ago)</td></tr>'+
	'<tr><td><b>Gold</b></td><td colspan="2" style=\"text-align:right\">' + FindText(responseText,"<gg=","></gg>").split("|")[0] + ' (' + FindText(responseText,"<gg=","></gg>").split("|")[1] + ' ago)</td></tr>'+
	'</table>';
	var cID = getClassIndex('table_lines','Personnel');
	//if((document.getElementsByClassName('table_lines')[4].innerHTML.match('Trained Attack Soldiers')) && (!FindText(responseText,"<lt=","></lt>").split("|")[1].match("undefined"))){
	if(!String(cID).match('undefined')){
		document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
	}
	//}	
	});
	//q['3'].innerHTML = table; // + '<br>' + q['3'].innerHTML;
	//Sab Helper
	turing = FindText(document.body.innerHTML,'name="turing" value="','"');
	defenderId = FindText(document.body.innerHTML,'defender_id" value="','"');
	//var spyButton = document.evaluate("//input[@name='spyrbut']", document, null, XPathResult.
	//UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if(dis == 0) {
	var MassButton = document.evaluate("//input[@name='attackbut']", document, null, XPathResult.
		UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var sabButton = document.evaluate("//input[@name='spybut']", document, null, XPathResult.
		UNORDERED_NODE_SNAPSHOT_TYPE, null);	
	var SpyButton = document.evaluate("//input[@name='spyrbut']", document, null, XPathResult.
		UNORDERED_NODE_SNAPSHOT_TYPE, null);
	    if (sabButton.snapshotLength > 0) {
		    sabButton = sabButton.snapshotItem(0);
		    sabButton.addEventListener('click', ReBuildPage, true);
			sabButton.removeAttribute('onclick');
			sabButton.setAttribute('hidden', 'true');
			sabButton.value = 'Launch Sab Mode';
			sabButton.style.display="none"
		  
			var spacer = document.createElement('span');
			spacer.innerHTML = '&emsp;';
			sabButton.parentNode.appendChild(spacer);
				
			var newButton = document.createElement('input');
			newButton.addEventListener('click', ReBuildPage, true);
			newButton.setAttribute('type', 'submit');
			newButton.setAttribute('name', 'spybut2');
			newButton.value = 'Launch Sab Mode [s]';
			sabButton.parentNode.appendChild(newButton);
		}
	    if (SpyButton.snapshotLength > 0) {
		//	if(GM_getValue("aJaxRecon") == 1){
			    SpyButton = SpyButton.snapshotItem(0);
			//    SpyButton.addEventListener('click', ReBuildPage, true);
				SpyButton.removeAttribute('onclick');
				SpyButton.setAttribute('hidden', 'true');
			//    SpyButton.value = 'Launch Recon Mode';
			//	SpyButton.style.display="none"
			  

				var spacer = document.createElement('span');
				spacer.innerHTML = '&emsp;';
				SpyButton.parentNode.appendChild(spacer);
					
				var newButtonx = document.createElement('input');
				newButtonx.addEventListener('click', ReBuildSpyPage, true);
				newButtonx.setAttribute('type', 'submit');
				newButtonx.setAttribute('name', 'spyrbut2');
				newButtonx.value = 'Launch Spy Mode [r]';
				SpyButton.parentNode.appendChild(newButtonx);
		//	}
		}
	//Sab Helper
	} else {
	//GM_setValue("spy", 0)
	//DisplayMessage2("Recon/Sab functions currently being edited, expect a new AC soon(ish");
			if( !GM_getValue("current") )
				GM_setValue("current", "OHNOES");
			GM_setValue("old",GM_getValue("current")); // update the previous page
			var CurrentURL = document.URL;
			var TehURL = new Array();
			TehURL = CurrentURL.split(".com/");
			TehURL = TehURL[1].split(".php");
			GM_setValue("current",TehURL[0]);
		var sabButton = document.evaluate("//input[@name='spybut']", document, null, XPathResult.
			UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var SpyButton = document.evaluate("//input[@name='spyrbut']", document, null, XPathResult.
		UNORDERED_NODE_SNAPSHOT_TYPE, null);
		if (sabButton.snapshotLength > 0) 
		{
			sabButton = sabButton.snapshotItem(0);
			var text = document.createElement('div');
			text.innerHTML = '<br>Last Sab: ' + GM_getValue("failsab_user") + '<br>Nunchakus Lost: ' + GM_getValue("failsab_nuns") + ' || Failed Sabs: ' + GM_getValue("failsab");
			sabButton.parentNode.appendChild(text);
		}
		if (SpyButton.snapshotLength > 0) 
		{
			SpyButton = SpyButton.snapshotItem(0);
			SpyButton.removeAttribute('onclick');
			SpyButton.setAttribute('hidden', 'true');
			var text = document.createElement('div');
			var va = "yes";
			if(GM_getValue("spy") == 1) { 
			text.innerHTML = "<INPUT TYPE=CHECKBOX NAME='fasterspy' checked='" + va + "'>Faster Spy<P>"
			}else{
			text.innerHTML = "<INPUT TYPE=CHECKBOX NAME='fasterspy'>Faster Spy<P>"
			}
		//	alert(text.innerHTML);
			SpyButton.parentNode.appendChild(text);
			document.addEventListener('click', attackEvent, true);
		//alert("Value is now: " + GM_getValue("spy"));
		var stuff = document.body.innerHTML;
		var muser = FindText(FindText(stuff,'"stats.php?id=',"a>"),">","<");
			if(muser == GM_getValue("failspy_user")){
				var s = '<br>' + GM_getValue("last_BPM",'BPM: ???') + '<br>';
				s += GM_getValue("last_IS",'IS: ???') + '<br>';
				s += GM_getValue("last_NUN",'NUN: ???') + '<br>';
				s += GM_getValue("last_LT",'LT: ???') + '<br>';
				s += GM_getValue("last_CH",'CH: ???') + '<br>';
				s += GM_getValue("last_DS",'DS: ???') + '<br>';
				s += GM_getValue("last_Gold",'Gold: ???') + '<br>';
				var cID = getClassIndex('table_lines','Attack Mission');
				var qw = document.getElementsByClassName('table_lines')[cID].innerHTML;
				var xx = qw.replace(muser,muser + ' (' + GM_getValue("last_Gold",'Gold: ???').replace("GOLD","Gold: ") + ' )');
				document.getElementsByClassName('table_lines')[cID].innerHTML = xx;
				DisplayMessage2("Last Recon: " + GM_getValue("failspy_user") + "<br>SA: " + GM_getValue("last_SA","???") + "<br> DA: " + GM_getValue("last_DA","???") + " <br> Spy: " + GM_getValue("last_Spy","???") + " <br> Sentry: " + GM_getValue("last_Sentry","???") + " <br>" + s);	
			}
		//	SpyButton.parentNode.appendChild(text);
		}
	}
	var cBut1 = GetElement('input', "Attack!");
	cBut1.value = cBut1.value.replace("Attack!", "Attack! [g]");
	var cBut2 = GetElement('input', "Raid!");
	cBut2.value = cBut2.value.replace("Raid!", "Raid! [y]");
	document.addEventListener('keyup',
	function(e)
	{
		if(e.target.type == "text") return;
		if(e.target.type == "textarea") return;
		if(e.target.type == "select-one") return;
		switch(e.keyCode)
		{
			case 71:     // G
			GetElement("input", "Attack! [g]").click();
			break;
			case 89:     // Y
			GetElement("input", "Raid! [y]").click();
			break;

			case 82:     // R
				var checks1  = GetElement('input', "Launch Spy Mode [r]");
				var checks2  = GetElement('input', "Spy [r]");
				if (checks1 && !checks2) {
					GetElement("input", "Launch Spy Mode [r]").click();
				}
				if (!checks1 && checks2) {
					GetElement("input", "Spy [r]").click();
				}
			break;

			case 83:     // S
				var checks3  = GetElement('input', "Launch Sab Mode [s]");
				var checks4  = GetElement('input', "Sabotage [s]");
				if (checks3 && !checks4) {
					GetElement("input", "Launch Sab Mode [s]").click();
				}
				if (!checks3 && checks4) {
					GetElement("input", "Sabotage [s]").click();
				}
			break;

		}
	}, false);
}

function attackEvent(event)
{
	if(event.target.name == 'fasterspy')
	{
		if(GM_getValue("spy") == 1)
		{
			GM_setValue("spy", 0)
		}else{
			GM_setValue("spy", 1)
		}
	}
}

function ReBuildMassPage(e)
{
	var fURL = '';
	var ReportID = 0;
	e.originalTarget.removeAttribute('x       ');
	e.originalTarget.value = 'Mass';
	e.originalTarget.removeEventListener('click', ReBuildMassPage, true);
	e.preventDefault();

	var html = document.body.innerHTML;
	var textarea = '<table border="1" style="border-collapse: collapse" bordercolor="#111111" width="100%" height="104">' +
	' <tr>' +
	'<td width="50%" height="17">' +
	' <p align="center">Return values</td>' +
	'</tr>' +
	'<tr>' + 
	'<td width="50%" height="59"><div id=tattacks><div id=finalurl></div><div id=sometext></div></td>' +
	' </tr>' +
	'<tr>' +
	'<td width="50%" height="12">' +
	' <p align="center">Status</td>' +
	' </tr>' +
	'<tr>' +
	'<td width="50%" height="11"><div id=rstatus></div></td>' +
	' </tr>';
	var blah4 = '<td><b>Trained Attack Soldiers</b></td>';
	var blah5 = '</table>';
	var blah6 = '<td><b>Trained Attack Soldiers</b></td>' + FindText(html,blah4,blah5);
	//var newhtml = html.replace(blah6,textarea); 
	//document.body.innerHTML = newhtml;
	table = '<table class="table_lines" align="center" width="100%" cellspacing="0" cellpadding="6" border="0">'+
	'<tr><th>Attack result</th></tr>'+
	'<tr><td><div id=tattacks><div id=finalurl></div><div id=sometext></div></td></tr>'+
	'<tr><td><div id=rstatus></div></td></tr>'+
	'</table>';
	var cID = getClassIndex('table_lines','Armory Information');
	if(!String(cID).match('undefined')){
		document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
	}else{
		cID = getClassIndex('table_lines','Personnel');
	if(!String(cID).match('undefined')){
		document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
	}else{
		cID = getClassIndex('table_lines','Recon result');
		if(!String(cID).match('undefined')){
			document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
		}else{
			cID = getClassIndex('table_lines','Sab Result');
			if(!String(cID).match('undefined')){
				document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
			}else{
				alert("Error? o.O (Refresh the page)");
			}
		}
	}
}

document.addEventListener('click', function(event) {
	if(event.target.name == 'attackbut2') {
	params = 'attackbut=Attack&attacks=1&defender_id=' +
	            +  defenderId
	            + '&turing=' + turing
	            + '&hash=';
				document.getElementById('rstatus').innerHTML = 'Loading';
				//get("http://www.kingsofchaos.com/inteldetail.php?report_id=11233416", function(responseText){
				doSab(params, function(rText) {
				document.getElementById('rstatus').innerHTML = "Processing\n";
				rText = rText.split('*****');
				fURL = rText[1];
				responseText = rText[0];
				totalAttacks = Math.max(totalAttacks + 1);
				document.getElementById('finalurl').innerHTML = 'Total Attacks: ' + totalAttacks + ' <a href="' + fURL + '"> View full report</a>';;
				ReportID = String(fURL).substr(String(fURL).indexOf('=')+1, 8);
			//	document.body.innerHTML = document.body.innerHTML + responseText;
					if(InStr(responseText,'ou stole') == true){ 
					// Good Attack

						var whoami = GM_getValue("Koc_User");
						var Attackee = FindText(FindText(responseText,' gold from ','!'),">","<");
						var sGold = FindText(FindText(responseText,'ou stole ','gold from'),">","<");
						ReturnRequest('GM_Log.php?type=attack&attacker=' + whoami + '&attackee=' + Attackee + '&gold=' + sGold + '&rid=' + ReportID,0,function(responseText){ })
						document.getElementById('sometext').innerHTML = "Good attack \n Gold Stolen: " + sGold;

					}else if(InStr(responseText,'only 10 times in 24 hours') == true)
					{344
						document.getElementById('rstatus').innerHTML = "You've attacked this person 10 times.\n";
					}else if(InStr(responseText,'retreated') == true)
					{
						document.getElementById('rstatus').innerHTML = "Attack retreated...\n";
					}else{
						document.getElementById('rstatus').innerHTML = "Attack Defended\n";
					}
				
						getTuring(defenderId, function(s) {
							document.getElementById('rstatus').innerHTML = document.getElementById('rstatus').innerHTML + "Attack Finished.";
						});
				});
			event.preventDefault();
			}
		}, true);
}

function ReBuildSpyPage(e)
{
	var fURL = '';
	var ReportID = 0;
	e.originalTarget.removeAttribute('x       ');
	e.originalTarget.value = 'Spy [r]';
	e.originalTarget.removeEventListener('click', ReBuildSpyPage, true);
	e.preventDefault();

	var html = document.body.innerHTML;
	var textarea = '<table border="1" style="border-collapse: collapse" bordercolor="#111111" width="100%" height="104">' +
	' <tr>' +
	'<td width="50%" height="17">' +
	' <p align="center">Return values</td>' +
	'</tr>' +
	'<tr>' + 
	'<td width="50%" height="59"><div id=finalurl></div><div id=sometext></div></td>' +
	' </tr>' +
	'<tr>' +
	'<td width="50%" height="12">' +
	' <p align="center">Status</td>' +
	' </tr>' +
	'<tr>' +
	'<td width="50%" height="11"><div id=rstatus></div></td>' +
	' </tr>';
	var blah4 = '<td><b>Trained Attack Soldiers</b></td>';
	var blah5 = '</table>';
	var blah6 = '<td><b>Trained Attack Soldiers</b></td>' + FindText(html,blah4,blah5);
	//var newhtml = html.replace(blah6,textarea); 
	//document.body.innerHTML = newhtml;
	table = '<table class="table_lines" align="center" width="100%" cellspacing="0" cellpadding="6" border="0">'+
	'<tr><th>Recon result</th></tr>'+
	'<tr><td><div id=finalurl></div><div id=sometext></div></td></tr>'+
	'<tr><td><div id=rstatus></div></td></tr>'+
	'</table>';
	var cID = getClassIndex('table_lines','Armory Information');
	if(!String(cID).match('undefined')){
		document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
	}else{
		cID = getClassIndex('table_lines','Personnel');
	if(!String(cID).match('undefined')){
		document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
	}else{
		cID = getClassIndex('table_lines','Sab Result');
		if(!String(cID).match('undefined')){
			document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
		}else{
			cID = getClassIndex('table_lines','Attack result');
			if(!String(cID).match('undefined')){
				document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
			}else{
				alert("Error? o.O (Refresh the page)");
			}
		}
	}
}
document.addEventListener('click', function(event) {
	if(event.target.name == 'spyrbut2') {

				params = 'mission_type=recon&defender_id=' +
	            +  defenderId
	            + '&turing=' + turing
	            + '&hash=';

				document.getElementById('rstatus').innerHTML = 'Loading';

				//get("http://www.kingsofchaos.com/inteldetail.php?report_id=11233416", function(responseText){
				
				doSab(params, function(rText) {
				
				document.getElementById('rstatus').innerHTML = "Processing";
				
				rText = rText.split('*****');
				fURL = rText[1];
				responseText = rText[0];
				
				document.getElementById('finalurl').innerHTML = '<a href="' + fURL + '">View full report</a>';;
				
				ReportID = String(fURL).substr(String(fURL).indexOf('=')+1, 8);
				
			//	document.body.innerHTML = document.body.innerHTML + responseText;
				
					if(InStr(responseText,'spy moves stealthily through') == true){ 
					// Good Recon
					
					Username = FindText(responseText,"Under the cover of night, your spy sneaks into ","'s camp.");

					Strike = FindText(FindText(responseText,"<td>Strike Action:</td>","</tr>"),">","</");
					Defence = FindText(FindText(responseText,"<td>Defensive Action</td>","</tr>"),">","</");
					TheSpy = FindText(FindText(responseText,"<td>Spy Rating</td>","</tr>"),">","</");
					TheSentry = FindText(FindText(responseText,"<td>Sentry Rating</td>","</tr>"),">","</");
					NumberOfCoverts = FindText(FindText(responseText,"<td>Covert Operatives:</td>","</tr>"),">","</");
					UsersGold = FindText(FindText(responseText,"Treasury","</td>"),'">'," Gold");
					StatsID = FindText(responseText,'"id" value="','"');
	var whoami = GM_getValue("Koc_User");		
	MakeRequestNoMsg('GM_Recon.php?user=\n' + Username + '&sa=\n' + Strike + '&da=\n' + Defence + '&spy=\n' + TheSpy  + '&sentry=\n' + TheSentry + '&statsid=\n' + StatsID + '&gold=\n' + UsersGold + '&coverts=\n' + NumberOfCoverts + '&u=\n' + whoami + '&rid=' + ReportID);
					
					
					if(CheckStat(Strike) == true) { sSA = "Strike: " + Strike; }
					if(CheckStat(Defence) == true) { sDA = "Defence: " + Defence; }
					if(CheckStat(TheSpy) == true) { sSpy = "Spy: " + TheSpy; }
					if(CheckStat(TheSentry) == true) { sSentry = "Sentry: " + TheSentry; }
					if(CheckStat(NumberOfCoverts) == true) { sCoverts = "Coverts: " + NumberOfCoverts; }
					
					statString = sSA + '\n' + sDA + '\n' + sSpy + '\n' + sSentry + '\nGold: ' + UsersGold;
					statString = statString + '\n' + sCoverts
					
					WeaponTable = FindText(responseText,'<tr><th colspan="4">Weapons</th></tr>','<form method="get" action="attack.php">');

					usetgold = "[user]" + Username + "[/user]";
					
	wRow = WeaponTable.split('<tr>');
		 for(i=1;i<WeaponTable.length;i++){
			if(InStr(wRow[i],'td align="right">') == true){

				cWeap = wRow[i].split('align="right">');
				type = FindText(cWeap[1],'','</td>');
				qu = FindText(cWeap[2],'','</td>');
				st = FindText(cWeap[3],'','</td>');
				weap = FindText(wRow[i],"<td>","</td>");
				
	
				
				if(qu != "???"){
					if(ValidWeapon(weap,st) == true){
						
						usetgold = usetgold + "[weap]--w=" + weap + "--q=" + qu + " + --s=" + st + "--x[weap]"
						
						if((WeaponFromStrength(st) == 'IS') || (WeaponFromName(weap) == 'IS')){ 
							//if(InStr(st,'??') == false) { strengthIS = st; }
							sIS = "IS: " + qu + ' (' + strengthIS + ' )'; 
						}else if((WeaponFromStrength(st) == 'NUN') || (WeaponFromName(weap) == 'NUN')){ 
							sNUN = "NUN: " + qu;
						}else if((WeaponFromStrength(st) == 'BPM') || (WeaponFromName(weap) == 'BPM')){ 
							//if(InStr(st,'??') == false) { strengthBPM = st; }
							sBPM = "BPM: " + qu + ' (' + strengthBPM + ' )';  
						}else if((WeaponFromStrength(st) == 'LT') || (WeaponFromName(weap) == 'LT')){ 
							sLT = "LT: " + qu;
						}else if((WeaponFromStrength(st) == 'LT') || (WeaponFromName(weap) == 'Skins')){ 
							sDS = "Skins: " + qu;
						}else if((WeaponFromStrength(st) == 'LT') || (WeaponFromName(weap) == 'Chariots')){ 
							sCH = "Chariots: " + qu;
						}
						
						
				//	alert("Weapon: " + weap + " Type: " + type + " Quality: " + qu + "Strength: " + st);
						document.getElementById('rstatus').innerHTML = '';
					}
				}
		//		alert(wRow[i]);
			}	
				
		}			
			usetgold = usetgold  + "end";
			//alert(usetgold);
			MakeRequestNoMsg('GM_AATRecon.php?list=\n' + usetgold);		
		//		document.getElementById('rstatus').innerHTML = 'Loaded';
		
				statString = statString + '\n' + sBPM + '\n' + sCH + '\n' + sIS + '\n' + sDS +'\n' + sNUN + '\n' + sLT;

					document.getElementById('sometext').innerHTML = replaceAll(statString,"\n","<br>");
			
					}else if(InStr(responseText,'only 15 times in 24 hours') == true)
					{
						document.getElementById('rstatus').innerHTML = "You've recon'd this person 15 times.\n";
					}else if(InStr(responseText,'one of the sentries spots him') == true)
					{
						document.getElementById('rstatus').innerHTML = "Recon Failed.\n";
					}
				
						getTuring(defenderId, function(s) {
							document.getElementById('rstatus').innerHTML = document.getElementById('rstatus').innerHTML + "Recon Finished.";
						})
				
				})
				
					event.preventDefault();
		}
	}, true);
}

function CheckStat(stat){
	if(stat == '???') {
		return false
	}else{
		return true
	}
}

function ReBuildPage(e)
{
e.originalTarget.removeAttribute('x       ');
e.originalTarget.value = 'Sabotage [s]';
e.originalTarget.removeEventListener('click', ReBuildPage, true);
e.preventDefault();

var html = document.body.innerHTML;


var whoami = GM_getValue("Koc_User");
var userid = String(document.URL).substr(String(document.URL).indexOf('=')+1, 7);
table = '<table class="table_lines" align="center" width="100%" cellspacing="0" cellpadding="6" border="0">'+
'<tr><th>Sab Result</th></tr>'+
'<tr><td><div id=chuck></div><br><div id=sometext></div><div id=sabmsg></div></td></tr>'+
'<tr><td><textarea name="sabresults" id="sabresults" COLS=50 ROWS=15 width="10px"></TEXTAREA></td></tr>'+
'</table>';
var cID = getClassIndex('table_lines','Armory Information');
if(!String(cID).match('undefined')){
	document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
}else{
	cID = getClassIndex('table_lines','Personnel');
	if(!String(cID).match('undefined')){
		document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
	}else{
		cID = getClassIndex('table_lines','Recon result');
		if(!String(cID).match('undefined')){
			document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
		}else{
			cID = getClassIndex('table_lines','Attack result');
			if(!String(cID).match('undefined')){
				document.getElementsByClassName('table_lines')[cID].innerHTML = table; //"Lol";
			}else{
				alert("Error? o.O (Refresh the page)");
			}
		}
	}
}



// Start Niels Code
    try {
      var form = {
        weapon: document.evaluate("//select[@name='enemy_weapon']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0),
        qty: document.evaluate("//input[@name='numsab']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0),
        spies: document.evaluate("//input[@name='numspies']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0),
        turns: document.evaluate("//select[@name='sabturns']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0)
      //  defenderId: document.evaluate("//input[@name='defender_id']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).value,
      };
    }    catch (e) {
      alert("o_O");
      return;
    }


  form.turns.value = 5;	
  form.weapon.selectedIndex = GM_getValue('kocsabbselect',"0");
  form.qty.value = GM_getValue('kocsabbnum',"0");


	document.addEventListener('click', function(event) {

		if(event.target.name == 'spybut2') //A sab.
		{
					//GetElement("input", "Sabotage [s]").disabled = true;
					GetElement("input", "Sabotage [s]").style = "font-style:italic;";
		//for(i=1;i<10;i++){
		
			params = 'mission_type=sabotage&enemy_weapon=' + form.weapon.value
            + '&numsab=' + form.qty.value
            + '&numspies=' + form.spies.value
            + '&sabturns=' + form.turns.value
            + '&defender_id=' + defenderId
            + '&turing=' + turing
	
		document.getElementById('sometext').innerHTML = "Please Wait..."

				doSab(params, function(responseText) {
				responseText = responseText + "<title>Lol</title>"
      try {

          var pos;


		  //responseText
		  if(InStr(responseText,' of Nunchaku')==true)
		  {		  
		  iNunLost += parseInt(FindText(responseText,"<li> "," of Nunchaku"));
		  nunLost(whoami,parseInt(FindText(responseText,"<li> "," of Nunchaku")))
		  }

		  document.getElementById('sabmsg').innerHTML = "Nunchakus Lost: " + iNunLost + '     Failed Sabs: ' + iFailedSab;

          if ((pos = responseText.indexOf('<h3>Covert Mission Report</h3>')) > 0) {
		var extra = '';
		pos = responseText.substr(pos + 30);
		pos = pos.substr(0, pos.indexOf('<form'));
				if (pos.match(/weapons of type \./)) {
					form.qty.value = 0;
					extra = '<div style="color:#f63">Choose another weapon / tool!</div>';
					//alert("GM_WeaponOut.php?user=" + gUser + "&w=" + FindText(form.weapon.innerHTML,form.weapon.value+'">','<'));
					MakeRequestNoMsg("GM_WeaponOut.php?user=" + gUser + "&w=" + FindText(form.weapon.innerHTML,form.weapon.value+'">','<'));
					document.getElementById('sometext').innerHTML += '<div style="color:#f63">Choose another weapon / tool!</div>';
				} else if (pos.match(/undetected,\s+and destroy/)) {
					document.getElementById('sabresults').innerHTML += pos.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').replace(/^\s*/, '').replace(/\s*$/, '').replace(/^[\s\S]*(Your spies successfully)/, "$1") + "\n";
	            				} else {
						iFailedSab += 1;
						document.getElementById('sabmsg').innerHTML = "Nunchakus Lost: " + iNunLost + '     Failed Sabs: ' + iFailedSab;	
					}
					document.getElementById('sometext').innerHTML = pos + extra;
					} else if ((pos = responseText.indexOf('<font color="red">')) > 0) {
						pos = responseText.substr(pos + 18);
						document.getElementById('sometext').innerHTML += '<br>' + pos.substr(0, pos.indexOf('</font>'));
						if (responseText.match(/Your opponent has already suffered heavy losses today/)) {
							MakeRequestNoMsg("GM_Maxed.php?id="+userid);
						}
						if (responseText.match(/Your officers inform you that you will never be able to get away with sabotaging that much of an opponent's armory\./)) { //'
							var origQty = parseInt(String(form.qty.value).replace(/,/g, ''));
							var newQty = Math.max(0, origQty - 1);
							if (newQty != origQty) {
								form.qty.value = newQty;
								document.getElementById('sometext').innerHTML += '<div style="color:#ff3">The quantity has been lowered for you from ' + origQty + ' to ' + form.qty.value + '.</div>';
							} else {
								//alert("GM_SelfUpdate.php?user=" + gUser + "&w=" + FindText(form.weapon.innerHTML,form.weapon.value+'">','<'));
								//MakeRequestNoMsg("GM_SelfUpdate.php?user=" + gUser + "&w=" + FindText(form.weapon.innerHTML,form.weapon.value+'">','<'));
								document.getElementById('sometext').innerHTML += '<div style="color:#f63">Choose another weapon / tool!</div>';
							}
						}	
					} else {
						document.getElementById('sometext').innerHTML = 'O_o';
					}
				}
		catch (e) {
			document.getElementById('sometext').innerHTML = e;
		}
		getTuring(defenderId, function(s) {
			document.getElementById('sometext').innerHTML += "<br>Sab Finished.";
			GetElement("input", "Sabotage [s]").disabled = false;
			GetElement("input", "Sabotage [s]").style = "font-style:normal;";
			if (!document.getElementById('sabmsg')) { document.getElementById('sometext').innerHTML = "<br><b>uh oh, this broke and you need to reload..."; window.location.reload(); }
		});
		})
				event.preventDefault();
				event.originalTarget.value = 'Sabotage [s]';
		}
	}, true);
}



function nunLost(u,a)
{
	ReturnRequest('GM_Log.php?type=nun&rid=0&sabber=' + u + '&a=' + a,0,function(responseText){
	//alert(responseText);
	})
}


function securityFunc()
{
StopLoading();
	get("http://www.kingsofchaos.com/security.php", function(responseText){
	var securityhash = FindText(responseText,"http://api.recaptcha.net/noscript?k=",'" height="300"');
		get("http://api.recaptcha.net/challenge?k=" +  securityhash, function(html){
		var challenge  = FindText(html,"challenge : '","',")
		var newhtml = '<img src="http://api.recaptcha.net/image?c=' + challenge + '">'
		newhtml += '<br><input type=text name=recaptcha_response_field value="">'
		newhtml +='<br><input type=hidden name=recaptcha_challenge_field value="' + challenge + '">'
		newhtml +='<br><centre><input type=submit name="RaWr" value="Go go go"></centre>'
		Loading(newhtml);
		})
	})
}

 function doSab(data,cb){
   GM_xmlhttpRequest({
    method: "POST",
    url: 'http://www.kingsofchaos.com/attack.php',
    headers:{'Content-type':'application/x-www-form-urlencoded'},
    data:encodeURI(data),
    onload: function(xhr) { 
//YF9gz8Ho73
		if(InStr(data,"=recon") == true)
		{
			cb(xhr.responseText + '*****' + xhr.finalUrl); 
		}else if(InStr(data,"attacks=") == true)
		{
			cb(xhr.responseText + '*****DEMMIE' + xhr.finalUrl); 
		}else{
			cb(xhr.responseText); 
			LogSab(xhr.responseText,xhr.finalUrl);
		}
		
	
	}
  });
}
  
  
 function doRecon(data,cb){
   GM_xmlhttpRequest({
    method: "POST",
    url: 'http://www.kingsofchaos.com/attack.php',
    headers:{'Content-type':'application/x-www-form-urlencoded'},
    data:encodeURI(data),
    onload: function(xhr) { cb(xhr.responseText);


	}
	
  });
  } 
 

function LogSab(data,url)
{
	var ReportID = String(url).substr(String(url).indexOf('=')+1, 8);
	
	if(InStr(data,'Your spies successfully enter ') == true){
	
		var sabbee = FindText(data,"Your spies successfully enter ","'s");
		var amount = FindText(data,"and destroy ","of the ");
		var weapon = FindText(data,"of the enemy's ","stockpile.");
		var whoami = GM_getValue("Koc_User");
//alert('GM_Log.php?type=sab&sabber=' + whoami + '&sabbee=' + sabbee + '&weapon=' + weapon + '&amount=' + amount + '&rid=' + ReportID);
			ReturnRequest('GM_Log.php?type=sab&sabber=' + whoami + '&sabbee=' + sabbee + '&weapon=' + weapon + '&amount=' + amount + '&rid=' + ReportID,0,function(responseText){
				//alert();
				document.getElementById('chuck').innerHTML = '<b><font color="yellow">' + FindText(responseText,'<chuck>','</chuck>') + '</b></font><br>';
			})
	}

} 

function LogMorale(to,sending)
{
var whoami = GM_getValue("Koc_User");
			ReturnRequest('GM_Log.php?type=morale&sender=' + whoami + '&to=' + to +  '&amount=' + sending + '&rid=0',0,function(responseText){
			//	alert(responseText);
			})
				GM_setValue("Morale_to",'');
				GM_setValue("Morale_Amount",'');
}
  
  
 function doSecurity(data,cb){
   GM_xmlhttpRequest({
    method: "POST",
    url: 'http://www.kingsofchaos.com/security.php',
    headers:{'Content-type':'application/x-www-form-urlencoded'},
    data:encodeURI(data),
    onload: function(xhr) { cb(xhr.responseText); }
  });
  }
    
function getTuring(id, cb) {
  GM_xmlhttpRequest({
    method: "GET",
     url: "http://www.kingsofchaos.com/attack.php?id=" + id,
     onload: function(xhr) { 
	 turing = FindText(xhr.responseText,'name="turing" value="','"');
	cb(turing); 	 
	 }
  });
}

function replaceAll( str, from, to ) {
    var idx = str.indexOf( from );
    while ( idx > -1 ) {
        str = str.replace( from, to );
        idx = str.indexOf( from );
    }
    return str;
}


////  None KoC Functions.

function DisplayMessage(message)
{
	var gm_button=document.createElement('div');
	gm_button.setAttribute('name','gm-button');
	gm_button.setAttribute('id','gm-button');
	gm_button.setAttribute('style','position:fixed;bottom:10px;right:10px;background-color:#A9A9A9;border:1px solid #FFFFFF;padding:5px;text-align:center;');
	var gm_paragraph=document.createElement('p');
	gm_paragraph.setAttribute('id','GM_Message');
	gm_paragraph.setAttribute('style','font:normal normal normal 12px Arial,Helvetica,sans-serif;color:#000000;text-decoration:none;margin:0;padding:0;');
	gm_paragraph.innerHTML = message;

	var gm_span_1=document.createElement('span');
	gm_span_1.setAttribute('id','gm-span-1');
	gm_span_1.setAttribute('style','cursor:pointer;');

	document.getElementsByTagName('body')[0].appendChild(gm_button);
	gm_button.appendChild(gm_paragraph);
	gm_paragraph.appendChild(gm_span_1);
}

function DisplayMessage2(message)
{

var gm_button = document.getElementById("GM_Message2");
	if(gm_button){
		gm_button.innerHTML = message;
	}else{
		var gm_button=document.createElement('div');
		gm_button.setAttribute('name','gm-button');
		gm_button.setAttribute('id','gm-button');
		gm_button.setAttribute('style','position:fixed;top:10px;right:10px;background-color:#A9A9A9;border:1px solid #FFFFFF;padding:5px;text-align:center;');
		var gm_paragraph=document.createElement('p');
		gm_paragraph.setAttribute('id','GM_Message2');
		gm_paragraph.setAttribute('style','font:normal normal normal 12px Arial,Helvetica,sans-serif;color:#000000;text-decoration:none;margin:0;padding:0;');
		gm_paragraph.innerHTML = message;

		var gm_span_1=document.createElement('span');
		gm_span_1.setAttribute('id','gm-span-1');
		gm_span_1.setAttribute('style','cursor:pointer;');

		document.getElementsByTagName('body')[0].appendChild(gm_button);
		gm_button.appendChild(gm_paragraph);
		gm_paragraph.appendChild(gm_span_1);
	}
}

function MakeRequest(url)
{
	GM_xmlhttpRequest({
		method: 'GET',
		url: GM_getValue("serverURL") + '/ac/script/\n' + url,
		onload: function(responseDetails) {
		//alert(responseDetails.responseText);
		DisplayMessage("AutomaticCreations Data Collected");
		},
		onerror: function(responseDetails) {
	//	  alert("Request for contact resulted in error code: " + responseDetails.status);
		}
	});
}


function MakeRequestNoMsg(url)
{
	GM_xmlhttpRequest({
		method: 'GET',
		url: GM_getValue("serverURL") + '/ac/script/\n' + url,
		onload: function(responseDetails) {
		//alert(responseDetails.responseText);
		},
		onerror: function(responseDetails) {
	//	  alert("Request for contact resulted in error code: " + responseDetails.status);
		}
	});
}

function ReturnRequest(url,msg,cb)
{
GM_xmlhttpRequest({
	method: 'GET',
	url: GM_getValue("serverURL") + '/ac/script/\n' + url,
	headers: {'User-agent': 'Mozilla/1.0 (compatible)', },
	onload: function(responseDetails) {
	cb(responseDetails.responseText); 
	if(msg == 1) {	DisplayMessage("AutomaticCreations Data Collected"); }
	},
	onerror: function(responseDetails) {
	//  alert("Request for contact resulted in error code: " + responseDetails.status);
	}
});
}


function addCommas( sValue ) //addCommas function wrote by Lukas Brueckner
{
	sValue = String(sValue);
	var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');
	
	while(sRegExp.test(sValue)) {
		sValue = sValue.replace(sRegExp, '$1,$2');
	}
	return sValue;
}
     

function removeComma(num) {
	return num.replace(/,/g, "");
}

function FindText(str, str1, str2)
{
  var pos1 = str.indexOf(str1);
  if (pos1 == -1) return '';
  
  pos1 += str1.length;
  
  var pos2 = str.indexOf(str2, pos1);
  if (pos2 == -1) return '';
  
  return str.substring(pos1, pos2);
}
	 
function InStr(strSearch, strFind)
{
	strSearch = String(strSearch);
	strFind = String(strFind);
	return (strSearch.indexOf(strFind) >= 0);
}

function addCSS(css){ 
	GM_addStyle(css);
}
	
function addJS() // function wrote by Lukas Brueckner
{
	var head = document.getElementsByTagName("head")[0];
	if (!head) {
           return;
       }
	var style = document.createElement("script");
	style.type = "text/javascript";
	var s = '';
	foreach(arguments, function(style){s+=style+"\n";});
	style.innerHTML = s;
	head.appendChild(style);
}

	function foreach(stuff, f){ for(var i=0; i < stuff.length; i++) {
		var stop_iter = f(stuff[i]);if (stop_iter) return;} }
		
		
function SortIt(TheArr,u,v,w,x,y,z){

  TheArr.sort(Sorter);

  function Sorter(a,b){
  var swap=0;
    if (isNaN(a[u]-b[u])){
      if((isNaN(a[u]))&&(isNaN(b[u]))){swap=(b[u]<a[u])-(a[u]<b[u]);}
      else {swap=(isNaN(a[u])?1:-1);}
      }
    else {swap=(a[u]-b[u]);}
    if((v==undefined)||(swap!=0)){return swap;}
    else{
      if (isNaN(a[v]-b[v])){
        if((isNaN(a[v]))&&(isNaN(b[v]))){swap=(b[v]<a[v])-(a[v]<b[v]);}
        else {swap=(isNaN(a[v])?1:-1);}
      }
      else {swap=(a[v]-b[v]);}
    }
    if((w==undefined)||(swap!=0)){return swap;}
    else{
      if (isNaN(a[w]-b[w])){
        if((isNaN(a[w]))&&(isNaN(b[w]))){swap=(b[w]<a[w])-(a[w]<b[w]);}
        else {swap=(isNaN(a[w])?1:-1);}
      }
      else {swap=(a[w]-b[w]);}
    }
    if((x==undefined)||(swap!=0)){return swap;}
    else{
      if (isNaN(a[x]-b[x])){
        if((isNaN(a[x]))&&(isNaN(b[x]))){swap=(b[x]<a[x])-(a[x]<b[x]);}
        else {swap=(isNaN(a[x])?1:-1);}
      }
      else {swap=(a[x]-b[x]);}
    }
    if((y==undefined)||(swap!=0)){return swap;}
    else{
      if (isNaN(a[y]-b[y])){
        if((isNaN(a[y]))&&(isNaN(b[y]))){swap=(b[y]<a[y])-(a[y]<b[y]);}
        else {swap=(isNaN(a[y])?1:-1);}
      }
      else {swap=(a[y]-b[y]);}
    }
    if((z==undefined)||(swap!=0)){return swap;}
    else{
      if (isNaN(a[z]-b[z])){
        if((isNaN(a[z]))&&(isNaN(b[z]))){swap=(b[z]<a[z])-(a[z]<b[z]);}
        else {swap=(isNaN(a[z])?1:-1);}
      }
      else {swap=(a[z]-b[z]);}
    }
    return swap;
  }
}








function BaseSetUp(event)
{

if((InStr(event.target,'kingsofchaos.com') == true) || (InStr(event.target.parentNode,'kingsofchaos.com') == true)){ //We'r clicking a link
	if(h4xed == 1){
		GM_openInTab(event.target);
	}else{
		if(InStr(event.target.parentNode,'kingsofchaos.com') == true)
		{
			window.location = event.target.parentNode;
		}else{
			window.location = event.target;
		}
	}
}else{

}
	if(InStr(event.target,'#gm=h4x') == true){ //We'r clicking a link
	h4xed = 1;	
		
	var newhtml;
	newhtml = '<div id="return">Return to KoC</div><br/><div id="DisplayBattlefield">[Quicker Battlefield]</div>';
	newhtml += '<div id="Session"><br>Display my KoC Session</div>';
	newhtml += '<div id="addClock"><br>Add clock to attack page</div>';
	newhtml += '<div id="delClock">Remove clock from attack page</div>';
	newhtml += '<div id="Theme"><br>Styles</div>';	
	document.body.innerHTML = newhtml;
}

if(event.target.id == 'NormalBase'){
	GM_setValue("BasePageEdits",'0');
	window.location = "http://www.kingsofchaos.com/base.php";
}else if(event.target.id == 'ModifiedBase'){
	GM_setValue("BasePageEdits",'1');
	window.location = "http://www.kingsofchaos.com/base.php";
}else if(event.target.id == 'addClock'){
	GM_setValue("acClock",'1');
	window.location = "http://www.kingsofchaos.com/base.php";
}else if(event.target.id == 'delClock'){
	GM_setValue("acClock",'0');
	window.location = "http://www.kingsofchaos.com/base.php";
}else if(event.target.id == 'Theme'){
	newhtml = '';
	newhtml += '<div id="Style-Normal-">Style: Normal</div>';
	newhtml += '<div id="Style-DarkPink-"><br>Style: Dark Pink</div>';
	newhtml += '<div id="Style-LightPink-">Style: Light Pink</div>';
	newhtml += '<div id="Style-SkyBlue-">Style: Sky Blue</div>';
	newhtml += '<div id="Style-DarkPurple-">Style: Dark Purple</div>';
	newhtml += '<div id="Style-LightPurple-">Style: Light Purple</div>';
	newhtml += '<div id="Style-Gray-">Style: Gray</div>';
	newhtml += '<div id="Style-Winter-">Style: Winter</div>';
	newhtml += '<div id="StyleX">If you want to design a theme(CSS), Feel free to give it to Shane</div>';
	document.body.innerHTML = newhtml;
}else if(InStr(event.target.id,'Style-') == true){
	GM_setValue("style",FindText(event.target.id,"Style-","-"));
	document.location = "http://www.kingsofchaos.com/base.php";	
}else if(event.target.id == 'Session'){
	document.body.innerHTML = "koc_session=" + cookie;
}else if(event.target.id == 'return'){
	window.location = "http://www.kingsofchaos.com/base.php";
}else if(event.target.id == 'GlobalTargets'){
	var newhtml = '<div id="return">Return to KoC</div>'+
	'Min Gold: <input name="MinGold" value="' + GM_getValue("GlobalTargets-Gold") + '" size="15" type="text"><br>'+
	'Your TFF: <input name="MaxTFF" value="' + GM_getValue("GlobalTargets-TFF") + '" size="15" type="text"><br>'+
	'Your SA: <input name="YourSA" value="' + GM_getValue("GlobalTargets-DA") + '" size="15" type="text"><br>'+
	'Minutes Old: <input name="MinOld" value="' + GM_getValue("GlobalTargets-Min") + '" size="15" type="text"><br>'+
	'<div id="GlobalSearch">Search</div>';
	document.body.innerHTML = newhtml;
}else if(event.target.id == 'GlobalSearch'){
	GlobalTargets(document.getElementsByName('MinGold')[0].value,document.getElementsByName('MaxTFF')[0].value,document.getElementsByName('YourSA')[0].value,document.getElementsByName('MinOld')[0].value);
	Loading("x");
}else if(event.target.id == 'DisplayBattlefield'){
	newhtml = '<div id="return">Return to KoC</div><div id="gf">Quicker Battlefield.<br> Page: <input name="s" value="0" size="8" type="text"><br>Min Gold:<input name="mg" value="0" size="8" type="text"><br> Min TFF:<input name="mt" value="0" size="8" type="text"></div>Remove TFF: <select name="striptff"><option>No</option><option>Yes</option></select> <br>IRC Copy/Paste Mode.: <select name="ircpaste"><option>No</option><option>Yes</option></select> <br> <div id="GoldFinder">[Start]</div>';
	document.body.innerHTML = newhtml;
}else if(event.target.id == 'GoldFinder'){
	GoldFinder(document.getElementsByName('s')[0].value,document.getElementsByName('mg')[0].value,document.getElementsByName('mt')[0].value,document.getElementsByName('striptff')[0].value,document.getElementsByName('ircpaste')[0].value);
}
	
	
			if(event.target.name == 'RaWr') //Security.php
				{	
					var recaptcha_response_field = document.getElementsByName("recaptcha_response_field")[0].value;
					var recaptcha_challenge_field = document.getElementsByName("recaptcha_challenge_field")[0].value;
					params = 'recaptcha_challenge_field=' + recaptcha_challenge_field + '&recaptcha_response_field=' + recaptcha_response_field;
				//	document.getElementById('sometext').innerHTML = "Processing, I think?";
						doSecurity(params,function(html){
							if ((pos = html.indexOf('Security')) > 0) {
								securityFunc();
							}else{
								StopLoading();
	GoldFinder(document.getElementsByName('s')[0].value,document.getElementsByName('mg')[0].value,document.getElementsByName('mt')[0].value,document.getElementsByName('striptff')[0].value,document.getElementsByName('ircpaste')[0].value);
	
							}
						});
				}
				
	if(h4xed == 1){
		event.stopPropagation();
  		event.preventDefault();
	}	

}


function IsNumeric(sText)
{
   var ValidChars = "0123456789.";
   var IsNumber=true;
   var Char;
 
   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
         }
      }
   return IsNumber;
}
	
function WeaponFromStrength(s)
{
var Wfsf;
Wfsf='x';
//if (InStr(s,'120') == true) { Wfsf = 'NUN'; 
//}else if (InStr(s,'10,000') == true) { Wfsf = 'IS'; 
//}else if (InStr(s,'12,000') == true) { Wfsf = 'BPM'; }
return Wfsf;
}

function WeaponFromName(s)
{
var Wfn;
Wfn ='x';
if (InStr(s,'Nunchaku') == true) { Wfn = 'NUN'; 
}else if (InStr(s,'Invisibility') == true) { Wfn = 'IS'; 
}else if (InStr(s,'Blackpowder') == true) { Wfn = 'BPM'; 
}else if (InStr(s,'Lookout') == true) { Wfn = 'LT'; 
}else if (InStr(s,'Dragonskin') == true) { Wfn = 'Skins'; 
}else if (InStr(s,'Chariot') == true) { Wfn = 'Chariots'; }

return Wfn;
}

function GetElement(elem, val)
{
    var elemList = document.getElementsByTagName(elem);
    
    for(var i = 0; i < elemList.length; i++)
    {
        if(elemList[i].value.toString().indexOf(val) == 0)
        {
            return elemList[i];
        }
    }
    
    return 0;
}

function getElementsByClass(searchClass,node,tag) { 
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}



function getClassIndex(classid,text)
{
	var x = document.getElementsByClassName(classid);
	for(i=0;i<x.length;i++)
	{
		if(document.getElementsByClassName(classid)[i].innerHTML.match(text))
		{
			return i;
		}
	}
}

function SiegeList(m)  // Returns: Multiply | Next Upgrade | Next Price | Next Multiply
{
	switch(m)
	{
		case 'None': { return '1|Flaming Arrows|40,000|1.333'; break }
		case 'Flaming Arrows': { return '1.333|Ballistas|80,000|1.777'; break }
		case 'Ballistas': { return '1.777|Battering Ram|160,000|2.369'; break }
		case 'Battering Ram': { return '2.369|Ladders|320,000|3.157'; break }
		case 'Ladders': { return '3.157|Trojan Horse|640,000|4.209'; break }
		case 'Trojan Horse': { return '4.209|Catapults|1,280,000|5.610'; break }
		case 'Catapults': { return '5.610|War Elephants|2,560,000|7.478'; break }
		case 'War Elephants': { return '7.478|Siege Towers|5,120,000|9.969'; break }
		case 'Siege Towers': { return '9.969|Trebuchets|10,240,000|13.288'; break }
		case 'Trebuchets': { return '13.288|Black Powder|20,480,000|17.713'; break }
		case 'Black Powder': { return '17.713|Sappers|40,960,000|23.612'; break }
		case 'Sappers': { return '23.612|Dynamite|81,920,000|31.475'; break }
		case 'Dynamite': { return '31.475|Greek Fire|163,840,000|41.956'; break }
		case 'Greek Fire': { return '41.956|Cannons|327,680,000|55.927'; break }
		case 'Cannons': { return '55.927|Max|Max|Max'; break }
		default: { return 'Max|Max|Max|Max'; break }
	}
}

function FortList(m) // Returns: Multiply | Next Upgrade | Next Price | Next Multiply
{
	switch(m)
	{	
		case 'Camp': { return '1|Stockade|40,000|1.25'; break }
		case 'Stockade': { return '1.25|Rabid Pitbulls|80,000|1.563'; break }
		case 'Rabid Pitbulls': { return '1.563|Walled Town|160,000|1.953'; break }
		case 'Walled Town': { return '1.953|Towers|320,000|2.441'; break }
		case 'Towers': { return '2.441|Battlements|640,000|3.052'; break }
		case 'Battlements': { return '3.052|Portcullis|1,280,000|3.815'; break }
		case 'Portcullis': { return '3.815|Boiling Oil|2,560,000|4.768'; break }
		case 'Boiling Oil': { return '4.768|Trenches|5,120,000|5.960'; break }
		case 'Trenches': { return '5.960|Moat|10,240,000|7.451'; break }
		case 'Moat': { return '7.451|Drawbridge|20,480,000|9.313'; break }
		case 'Drawbridge': { return '9.313|Fortress|40,960,000|11.642'; break }
		case 'Fortress': { return '11.642|Stronghold|81,920,000|14.552'; break }
		case 'Stronghold': { return '14.552|Palace|163,840,000|18.190'; break }
		case 'Palace': { return '18.190|Keep|327,680,000|22.737'; break }
		case 'Keep': { return '22.737|Citadel|655,360,000|28.422'; break }
		case 'Citadel': { return '28.422|Hand of God|1,310,720,000|35.527'; break }
		case 'Hand of God': { return '35.527|Max|Max|Max'; break }
		default: { return 'Max|Max|Max|Max'; break }
	}
}

function logLostWeapon(m)
{
	var dt = new Date();
	var unixtime = Math.max((Date.parse(dt))/1000); 
	GM_setValue("logSab_8",GM_getValue("logSab_7",""));
	GM_setValue("logSab_7",GM_getValue("logSab_6",""));
	GM_setValue("logSab_6",GM_getValue("logSab_5",""));
	GM_setValue("logSab_5",GM_getValue("logSab_4",""));
	GM_setValue("logSab_4",GM_getValue("logSab_3",""));
	GM_setValue("logSab_3",GM_getValue("logSab_2",""));
	GM_setValue("logSab_2",GM_getValue("logSab_1",""));
	GM_setValue("logSab_1",m + '|' + unixtime);
}

function isTurn()
{

if((document.body.innerHTML.match("<title>Ignore this</title>")) || (document.body.innerHTML.match("Covert Mission Report")) || (document.body.innerHTML.match("Attack Mission")))
{



}else{

	var t = false;
	var d=new Date();
	var hour = d.getHours();
	var minute = d.getMinutes();
	var sec = d.getSeconds();

	if(sec < 10) { sec = '0' + sec; };
	if(minute < 10) { minute = '0' + minute; }
	if(hour < 10) { hour = '0' + hour; }


	document.title = hour + ':' + minute + ':' + sec;
	if(GM_getValue('acClock') != 0){
		DisplayMessage2('<font size=6>' + hour + ':' + minute + ':' + sec + '</font>');
	}
		if(((minute == '35') || (minute == '5')) && (sec == '59'))
		{
			// Notice user to hit?!?!
		}
		
	setTimeout(isTurn,600);
	return t;
}
	
}



function expcolTable(text)
{
var table;

  var elems = document.getElementsByTagName('table');
  
  for (i = 0; i < elems.length; i++)
  {
    if (elems[i].rows[0].cells[0].innerHTML.match(text))
    {
      table = elems[i];
    }
  }
  
  if(table){
  
  table.rows[0].style.cursor = 'pointer';
  
  for (i = 1; i < table.rows.length; i++)
  {
		if(GM_getValue("hideTable_"+text) == 1)
		{
			table.rows[i].style.display = table.rows[i].style.display != 'none' ? 'none' : '';
		}
    
  }
  
  table.rows[0].addEventListener('click', function(event)
  {
    event.stopPropagation();
    event.preventDefault();
    
	
	if(GM_getValue("hideTable_"+text) == 1) 
	{
		 for (i = 1; i < table.rows.length; i++){
			table.rows[i].style.display = table.rows[i].style.display = '';
			GM_setValue("hideTable_"+text, 0)
		 }
	}else{
		 for (i = 1; i < table.rows.length; i++){
			table.rows[i].style.display = table.rows[i].style.display != 'none' ? 'none' : '';
		 }
		 GM_setValue("hideTable_"+text, 1)
	}

  }, true);
  
  
  }
}