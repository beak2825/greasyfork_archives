
/*==========================================================================*\
|  Chimp - GreaseMonkey Script for Hollywood Stock Exchange                  |
|      (c) 2009-2016 by Eduardo Zepeda                                       |
|  Trade panel for all HSX pages (even port page, in place of Port Monkey,   |
|  or not), with bond lookup and optional settings. Works with Chrome and    |
|  Opera (most features). Works on several HSX fan sites.                    |
\*==========================================================================*/

// ==UserScript==
// @name           HSX Chimp
// @namespace      edzep.scripts
// @version        1.5.8
// @author         EdZep at HSX
// @description    Floating trade panel for all HSX pages - F2 toggles hide/show
// @include        https://*hsx.com/*
// @include        http://www.hsxdude.com/*
// @include        http://howprofitable.com/*
// @include        http://kaigee.com/*
// @exclude        http*://*hsx.com/javascript/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_log
// @require        https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment-with-locales.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.1/moment-timezone-with-data.min.js
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAALHRFWHRDcmVhdGlvbiBUaW1lAFN1biAxMCBBcHIgMjAxMSAxMToyNTo1OCAtMDUwMF3oDl8AAAAHdElNRQfbBAsOKR27crm1AAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC/xhBQAAAA9QTFRF////AAAAAAD///8AgAAADJhXAAAAAAF0Uk5TAEDm2GYAAAC5SURBVHjajZNBFsQgCENN9f5nnhFBE+hry6YVvhFEGl6s4Xq0AO72MgD0YotYwIz7tvjCCQNsNcwQP8OJCVCcACf+QMT5CAe6lRlxzi+AfgAp42xghUieBRZAOQ5kAasiASzAZe4jWMAvStIUAblJ1BJ2L04hLrBS12aVXuARkG5eOP3u1G0C2t2DaQIUAgoUAtPHQCJgLgGEwPIoQATckYBNINZ8D/xeeHTS6O1xKKN3CCTHh+F9sR+bJgggaRbXggAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/24425/HSX%20Chimp.user.js
// @updateURL https://update.greasyfork.org/scripts/24425/HSX%20Chimp.meta.js
// ==/UserScript==

// Start

(function() {
//--- global object references, etc
var refSymbolCh = "";
var refQuantityCh = "";
var refTradePanel = "";
var url = "";
var bondBufferCh = "";
var enterOK = false;
var isdrag = false;
var x, y, tx, ty;

//--- center "fixed" element in browser
function centerThis(e) {
	var eRef = document.getElementById(e);
	var x = (document.documentElement.clientWidth - eRef.offsetWidth) / 2;
	var y = (document.documentElement.clientHeight - eRef.offsetHeight) * .4;
	eRef.style.left = x + "px";
	eRef.style.top = parseInt(y) + "px";
}

//--- display expected bond adjust info
function showBondInfoCh(currentVal,isBond) {
	var tempBuffer = bondBufferCh;
	// get data freshness date
	var bondInfoDateCh = tempBuffer.substring(0,tempBuffer.indexOf('\n')-1);
	// find and format bond ticker & adjust info
	var ticker = refSymbolCh.value;
	var future = "the future is hazy";
	var info = new Array();
	var locate = tempBuffer.indexOf(',' + ticker +','); // mcg
	if(locate > -1 && currentVal != -1) {
		if(locate > 20) {
			do {
				locate -= 1;
				var ch = tempBuffer.charAt(locate);
			}
			while(ch != '\n');
			locate = locate+=1;
		}
		else locate = 0; // top, for first remaining
		 
		 tempBuffer = tempBuffer.substring(locate);
		 for(var i=0; i<3; i++) {
		locate = tempBuffer.indexOf(',')+1;
		info[i] = tempBuffer.substring(0,locate-1);
		tempBuffer = tempBuffer.substring(locate);
		 }
		 info[3] = tempBuffer.substring(0,tempBuffer.indexOf('\n')-1);
		 var futureVal = parseFloat(info[3]).toFixed(2);  
		 var futureStyled = "<b>H$" + futureVal + "</b>";
		 
		 if(parseFloat(futureVal) > currentVal) futureStyled = "<span class=pmGreen>H$" + futureVal + "</span>";
		 if(parseFloat(futureVal) < currentVal) futureStyled = "<span class=pmRed>H$" + futureVal + "</span>";
		 future = futureStyled + " with " + info[1] + ", " + info[0];
	}
	if(currentVal == -1) currentVal = "Error!";
	else 
		{
		currentVal = "H$" + currentVal.toFixed(2);
		//GM_setValue("chimpTicker",ticker);
		}
	 var bigstr = "<table class='calc'><tr><td style='font-weight:bold'><a href='https://www.hsx.com/security/view/" + ticker + "' target='pm_a'>" + ticker + "</a></td><td width=90%><a href='javascript:closeTipCh();' style='display:block; text-align:right'>X </a></span></td></tr><tr><td colspan=2>Current: <b>" + currentVal + "</b></td></tr>";
	 if(isBond) bigstr += "<tr><td colspan=2>Estimated: " + future + "</td></tr>";
	 bigstr += "<tr><td colspan=2>";
	 if(currentVal != "Error!" && isBond) bigstr += "<a href='http://www.kaigee.com/SBO/" + ticker + "' target='pm_b' title='Last update: " + bondInfoDateCh + "'>Details at KaiGee.com</a></td></tr></table>";
	 
displayTipCh(bigstr);
}
//--- fetch bond adjust info or security price
function fetchBondInfoCh() {
		GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://www.hsx.com/security/view/' + refSymbolCh.value,
		onload: function(response) {
			var doc = document.createElement('div');
			var price = -1;
			doc.innerHTML = response.responseText;
			try { 
				var findvalue = document.evaluate("//p[@class='value']", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				price = parseFloat(findvalue.snapshotItem(0).textContent.slice(2)); 
			}
			catch(err) {}
			var isBond = false, ttext = "";
			try {
				findvalue = document.evaluate("//title", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				ttext = findvalue.snapshotItem(0).textContent.toLowerCase();
			}
			catch(err) {}
			if(ttext.indexOf('starbond') > -1 && ttext.indexOf('movie fund') < 0) 
				{ isBond = true; }
			if(bondBufferCh != "" || isBond == false)
				{ showBondInfoCh(price, isBond); }
			else {
				GM_xmlhttpRequest({
					method: 'GET',
					url: 'http://www.kaigee.com/Lists/PM.csv',
					onload: function(response) {
						bondBufferCh = response.responseText;
						showBondInfoCh(price, isBond);
					}
				});
			}
		}
	});
}

//--- display bond tooltip box
function displayTipCh(newHTML) {
	var calcDiv = document.getElementById("calcTipCh");
	calcDiv.innerHTML = newHTML;
	var realWidth = calcDiv.offsetWidth;
			
	calcDiv.style.top = refTradePanel.style.top; 
	calcDiv.style.left = parseInt(refTradePanel.style.left) + parseInt(refTradePanel.style.width) + 2 + "px";
	if (parseInt(calcDiv.style.left) + realWidth + 20 > window.innerWidth)
	{ calcDiv.style.left = parseInt(refTradePanel.style.left) - realWidth + "px"; }

	// dirty fix for non-firefox
	if (parseInt(calcDiv.style.left) < 0) {
		calcDiv.style.left = parseInt(refTradePanel.style.left) - 300 + "px";
		calcDiv.style.width = 300 + "px";         
	}
	calcDiv.style.visibility = "visible";
}

//--- manage read/write of settings from the options panel
function chimpOptions() {
	var optDivCh = document.getElementById("optionsPanelCh");
	if(optDivCh.style.visibility == "hidden") {
		// read
		if (GM_getValue("chimpVis", "visible") == "visible")
			{ document.getElementById("chimpvis").checked = true; }
		else { document.getElementById("chimpvis").checked = false; }
		document.getElementById("chimproll").checked = GM_getValue("chimpRoll", false);
		document.getElementById("chimptime").checked = GM_getValue("chimpTime", true);
		document.getElementById("chimpPMCM").checked = GM_getValue("chimpPMCM", false);
		document.getElementById("chimpQtyAt").value = GM_getValue("chimpQtyAt", "75k"); // cust. qty. text
		document.getElementById("chimpQtyBt").value = GM_getValue("chimpQtyBt", "50k");
		document.getElementById("chimpQtyCt").value = GM_getValue("chimpQtyCt", "25k");
		document.getElementById("chimpQtyAq").value = GM_getValue("chimpQtyAq", "75000"); // cust. qty. amounts
		document.getElementById("chimpQtyBq").value = GM_getValue("chimpQtyBq", "50000");
		document.getElementById("chimpQtyCq").value = GM_getValue("chimpQtyCq", "25000");
		document.getElementById("chimppanelw").value = GM_getValue("chimpPanW", "105"); // side panel width
		document.getElementById("chimppanelf").value = GM_getValue("chimpPanF", "13"); // font size
		document.getElementById("chimpconfw").value = GM_getValue("chimpConW", "275"); // confirmation window width
		document.getElementById("chimpconfh").value = GM_getValue("chimpConH", "115"); // height
		centerThis("optionsPanelCh");
		optDivCh.style.visibility = "visible"; // state changed, so catches else, below, and writes on exit
	}
	else {
		// write
		if (document.getElementById("chimpvis").checked) { GM_setValue("chimpVis","visible"); }
		else { GM_setValue("chimpVis","hidden"); }
		GM_setValue("chimpRoll",document.getElementById("chimproll").checked);
		GM_setValue("chimpTime",document.getElementById("chimptime").checked);
		GM_setValue("chimpPMCM",document.getElementById("chimpPMCM").checked);
		GM_setValue("chimpQtyAt", document.getElementById("chimpQtyAt").value);
		GM_setValue("chimpQtyBt", document.getElementById("chimpQtyBt").value);
		GM_setValue("chimpQtyCt", document.getElementById("chimpQtyCt").value);
		GM_setValue("chimpQtyAq", document.getElementById("chimpQtyAq").value);
		GM_setValue("chimpQtyBq", document.getElementById("chimpQtyBq").value);
		GM_setValue("chimpQtyCq", document.getElementById("chimpQtyCq").value);
		GM_setValue("chimpPanW", document.getElementById("chimppanelw").value);
		GM_setValue("chimpPanF", document.getElementById("chimppanelf").value);
		GM_setValue("chimpConW", document.getElementById("chimpconfw").value);
		GM_setValue("chimpConH", document.getElementById("chimpconfh").value);
		optDivCh.style.visibility = "hidden";
	}
}

//--- receive and place orders from chimp button links, via event listener
function placeOrderCh(orderType) {
	if(refSymbolCh.value == "") return;
	if(refQuantityCh.value == "") refQuantityCh.value = "max";

	var buildURL = "https://www.hsx.com/trade/?symbol=" + refSymbolCh.value + "&shares=" + refQuantityCh.value + "&action=place+order" + "&tradeType=" + orderType;
	var wh = "width=" + GM_getValue("chimpConW", "310") + ",height=" + GM_getValue("chimpConH", "145")
	var windowRef = window.open(buildURL, "conf", wh);
}

function putTickerCh(e) {
	var thisurl = e.target.href;
	var slash = thisurl.lastIndexOf('/');
	var ticker = thisurl.slice(slash+1);
	refSymbolCh.value = ticker;
	refSymbolCh.focus();
	refSymbolCh.selectionStart = refSymbolCh.selectionEnd;
	//GM_setValue("chimpTicker",ticker);
}

function getParam(tempstr) {
	var paren1 = tempstr.indexOf('(');
	var paren2 = tempstr.indexOf(')');
	return tempstr.substring(paren1+2,paren2-1);
}

function chimpRollup() {
	var aRollup = document.getElementById("a4rollup");
	var divHide = document.getElementById("div2hide");
	var titleTable = document.getElementById("titleTable");
	if (aRollup.textContent == String.fromCharCode(9650)) {
		divHide.style.display = "none";
		refTradePanel.style.height = titleTable.clientHeight + "px";
		aRollup.textContent = String.fromCharCode(9660)
		GM_setValue("chimpRoll",true);
		return;
	}
	else {
		divHide.style.display = "block";
		refTradePanel.style.height = divHide.clientHeight + titleTable.clientHeight + "px";
		aRollup.textContent = String.fromCharCode(9650)
		GM_setValue("chimpRoll",false);
	}
}

function chimpHide() {
	if (refTradePanel.style.visibility == "hidden") {
		refTradePanel.style.visibility = "visible";
		GM_setValue("chimpVis","visible");
	}
	else {
		refTradePanel.style.visibility = "hidden";
		GM_setValue("chimpVis","hidden");
	}
}

function symbolFocus() { enterOK = true; }

function symbolBlur() { enterOK = false; }

//--- global event listeners allow working across scopes
document.addEventListener('keydown', function(e) {
	if(!e) e=window.event;
	var key = e.keyCode;
	var quash = false;
	if(key == 113) { //f2
		chimpHide();
		document.getElementById("calcTipCh").style.visibility = "hidden";
		quash=true;
	}
	if(quash == true) {
		e.stopPropagation();
		e.preventDefault();
	}
}, true);

document.addEventListener('keypress', function(e) {
	if(!e) e=window.event;
	var key = e.keyCode ? e.keyCode : e.which;
	var quash = false;
	//GM_log(key + " " + e.keyCode + " " + e.which);
	if(key == 13) {
		if(url.indexOf('hsx.com/trade') > -1) { window.close(); }
		else if(enterOK) { 
			refSymbolCh.value = refSymbolCh.value.toUpperCase();
			fetchBondInfoCh(); 
			refSymbolCh.select();
		}
	}
	if(quash == true) {
	e.stopPropagation();
	e.preventDefault();
	}
}, true);

document.addEventListener('mouseup', function(e) {
	isdrag=false
}, true);

document.addEventListener('mousedown', function(e) {
	var fobj = e.target;
		if (fobj.className=="dragme") {
		isdrag = true;
		tx = parseInt(refTradePanel.style.left+0);
		ty = parseInt(refTradePanel.style.top+0);
		x = e.clientX;
		y = e.clientY;
	}
}, true);

document.addEventListener('mousemove', function(e) {
	if(isdrag) {
		var setX, setY;
		setX = tx + e.clientX - x;
		setY = ty + e.clientY - y;
		// keep Chimp in bounds
		if(setX < 0) setX = 0;
		if(setY < 0) setY = 0; 
		var d = document.documentElement;   
		if(setX > d.clientWidth - refTradePanel.clientWidth - 2)
			{ setX = d.clientWidth - refTradePanel.clientWidth - 2; }
		if(setY > d.clientHeight - document.getElementById("td4time").clientHeight - 3)
			{ setY = d.clientHeight - document.getElementById("td4time").clientHeight - 3; }
		refTradePanel.style.left = setX + "px";
		refTradePanel.style.top  = setY + "px";
		GM_setValue("chimpX", setX + "px");
		GM_setValue("chimpY", setY + "px");
	}
}, true);

document.addEventListener('click', function(e) {
	var tempstr = new String(e.target);
	var quash = false;
	if(tempstr.indexOf('chimpRollup') > -1)
		{
		chimpRollup();
		quash = true;
		}
	if(tempstr.indexOf('putAmountCh') > -1)
		{
		var p = getParam(tempstr);
		if (p == "M") p = "max"
		else if (p == "75") p = GM_getValue("chimpQtyAq", "75000")
		else if (p == "50") p = GM_getValue("chimpQtyBq", "50000")
		else if (p == "25") p = GM_getValue("chimpQtyCq", "25000")
		else p = "1"
		refQuantityCh.value = p;
		quash = true;
		}
	if(e.target.id == "optButtonOKch" || e.target == "javascript:chimpOptions();")
		{ chimpOptions(); quash = true; }
	if(tempstr.indexOf('checkBond') > -1) { 
		if (document.getElementById("calcTipCh").style.visibility == "hidden")
			{ fetchBondInfoCh(); }
		else document.getElementById("calcTipCh").style.visibility = "hidden";
		quash = true;
	}
	if(tempstr.indexOf('closeTipCh') > -1) { 
		document.getElementById("calcTipCh").style.visibility = "hidden";
		quash = true;
	}
	if(tempstr.indexOf('placeOrderCh') > -1)
		{
		var tradetype = getParam(tempstr);
		placeOrderCh(tradetype);
		quash = true;
		}
	if(quash == true)
		{
		//quash any further actions of events handled here
		e.stopPropagation();
		e.preventDefault();
		}
}, true);

function HSXchimp_Run(){ //--- main script block from this point
	if (window != window.top) return; // prevent run in IFRAME - forum text box

	url = window.location.href; // get URL and determine if trade page; global save for later use
	if(url.indexOf('hsx.com/portfolio') > -1 && GM_getValue("chimpPMCM", false) == true) {
		if(url.indexOf('history') < 0 && url.indexOf('limit') < 0 && url.indexOf('chart') < 0)
		{ return; }
	}

	if(url.indexOf('hsx.com/trade/?') < 0) {

		var panelFontSize = GM_getValue("chimpPanF", "13") + "px";

		// table styles
		GM_addStyle('table.chtrade {border: 0px ridge silver; font-family: sans-serif; font-size:' + panelFontSize + '; line-height: 1; background-color: #F3F3F3; padding: 0px; margin:0}' +

		'table.chtrade td {padding: 3px 3px 0px 3px; background-color: #F3F3F3; text-align: center; font-family: sans-serif; font-size:' + panelFontSize + '; line-height: 1;}' +

		'table.chqty {border-collapse: collapse; background-color: #FFF9E3; border: 2px ridge silver; text-align:center; margin:0; padding: 0px;}' +

		'table.chqty td {background-color: #FFF9E3; text-align: center; font-family: sans-serif; font-size:' + panelFontSize + '; border: 1px solid #FFF9E3;}' +

		'table.calc {border: 2px ridge #FBEDBB; border-collapse: collapse; background-color: #FFF9E3;}' +

		'table.calc td {border: 1px solid #FFF9E3; padding: 0px 3px; background-color: #FFF9E3;}');

		// misc. styles //#E0EAF1, lt. blue/gray; #D2F8E3, seafoam green; #D4E4ED, better blue/gray
		GM_addStyle('.chbutton {font-family: sans-serif; border: 1px solid #006; background: #D4E4ED; display: block; text-align: center; border-width : 0px 1px 1px 0px; padding: 2px 2px 2px 0; }' +

		'.chbutton:hover {font-weight: normal; border: 1px solid #006; background: #E6FAE4; border-width : 0px 1px 1px 0px;}' +

		'.chbutton:active {border: 1px solid #DA0808; background: #E6FAE4; border-width : 0px 1px 1px 0px;}' +

		'.pmRed {color: red; font-weight: bold; font-style: italic}' +
		'.pmGreen {color: green; font-weight: bold}' +
		'.tlink {color: #444444;}' +
		'.dragme { cursor: move }' +
		'.qlink {display: block; text-align: center; }' +
		'a:visited {color: #3597b2;} a:hover {color: #84B84B;}'); //make reg. link color stick

		//--- make new add-in panel for trading

		var tradeDivCh = document.createElement("div");
		tradeDivCh.innerHTML = "<table class=chtrade id=titleTable><tr><td id=td4time class=dragme style='text-align:left; width:98%; background: #D4E4ED; padding: 2px 5px;'></td><td style='background: #D4E4ED; padding: 2px 4px;'><a href='javascript:chimpOptions();' id=a4options>" + String.fromCharCode(9829) + "</a><a href='javascript:chimpRollup();' id=a4rollup>" + String.fromCharCode(9650) + "</a></td></tr></table>" +

		"<div id=div2hide><table class=chtrade><tr><td align=right style='padding: 5px 0px 0px 4px;'><b><a href='javascript:checkBond;' class=qlink> S:</a></b></td><td style='padding: 5px 4px 0px 3px;'><input type=text id=Symbol maxlength=8 onfocus='this.select();' onblur='this.value = this.value.toUpperCase();' style='width:98%; font-size: 1em; line-height:1; margin:0em; padding: 0;' /></td></tr>" +

		"<tr><td align=right style='padding: 3px 0px 0px 4px;'>Q:</td><td style='padding: 3px 4px 0px 3px;'><input type=text id=Quantity maxlength=6 onfocus='this.select();' onblur='this.value = this.value.toLowerCase(); if(this.value != \"max\" && !(parseInt(this.value)>0)) this.value=\"\";' style='width:98%; font-size: 1em; line-height:1; margin:0; padding: 0;' /></td></tr></table>" +

		"<table class=chtrade><tr><td rowspan=4 valign=top style='padding: 3px 2px 0px 3px; width:10%;'>" +

		"<table class=chqty><tr><td><a href='javascript:putAmountCh(\"M\");' class=qlink>Max</a></td></tr><tr><td><a href='javascript:putAmountCh(\"75\");' class=qlink>" + GM_getValue("chimpQtyAt","75k") + "</a></td></tr><tr><td><a href='javascript:putAmountCh(\"50\");' class=qlink>" + GM_getValue("chimpQtyBt","50k") + "</a></td></tr><tr><td><a href='javascript:putAmountCh(\"25\");' class=qlink>" + GM_getValue("chimpQtyCt","25k") + "</a></td></tr><tr><td style='padding: 3px 3px 3px 3px;'><a href='javascript:putAmountCh(\"R\");' class=qlink>1</a></td></tr></table>" +

		"</td><td><a href='javascript:placeOrderCh(\"buy\");' class=chbutton>Buy</a></td></tr><tr><td><a href='javascript:placeOrderCh(\"sell\");' class=chbutton>Sell</a></td></tr><tr><td><a href='javascript:placeOrderCh(\"short\");' class=chbutton>Short</a></td></tr><tr><td><a href='javascript:placeOrderCh(\"cover\");' class=chbutton>Cover</a></td></tr><tr><td colspan=2></td></tr></table></div>";

		tradeDivCh.id = "tradePanelCh";
		tradeDivCh.style.position = "fixed";
		tradeDivCh.style.display = "block";
		tradeDivCh.style.backgroundColor = "#F3F3F3";
		tradeDivCh.style.zIndex = "104";
		tradeDivCh.style.borderWidth = "1px";
		tradeDivCh.style.borderStyle = "solid";
		tradeDivCh.style.borderColor = "black";

		//--- make new add-in panel for Chimp options

		var optDivCh = document.createElement("div");
		optDivCh.innerHTML = "<p><b><u>OPTIONS</u> - <a href='https://greasyfork.org/en/scripts/24425-hsx-chimp' title='Chimp homepage' style='text-decoration:none;' target='_new'>Chimp</a></b> by EdZep<form style='margin-bottom:1.2em'>" +

		"<p>Show Chimp: <input id='chimpvis' type='checkbox' /> (use keyboard F2 for live toggle)" +

		"<p style='margin-top:.7em;'>Show HSX time: <input id='chimptime' type='checkbox' />&nbsp;&nbsp;&nbsp;Show rolled up: <input id='chimproll' type='checkbox' />" +

		"<p style='margin-top:.7em;'>Suppress on Portfolio page: <input id='chimpPMCM' type='checkbox' /> (Port Monkey compatibility mode)" +

		"<p style='margin-top:.9em;'>Custom quantities (button text): <input id='chimpQtyAt' type='text' maxlength='3' style='width:2.5em;' />&nbsp;&nbsp;<input id='chimpQtyBt' type='text' maxlength='3' style='width:2.5em;' />&nbsp;&nbsp;<input id='chimpQtyCt' type='text' maxlength='3' style='width:2.5em;' /> from top, after Max" +

		"<p>Custom quantities (amounts): <input id='chimpQtyAq' type='text' maxlength='5' style='width:3.5em;' />&nbsp;&nbsp;<input id='chimpQtyBq' type='text' maxlength='5' style='width:3.5em;' />&nbsp;&nbsp;<input id='chimpQtyCq' type='text' maxlength='5' style='width:3.5em;' /> (no commas)" +

		"<p>Widget width: <input id='chimppanelw' type='text' maxlength='3' style='width:2.5em;' />&nbsp;&nbsp;font size: <input id='chimppanelf' type='text' maxlength='2' style='width:2em;' /> (both in pixels)" +

		"<p style='margin-bottom:-.6em;'>Confirm. window width: <input id='chimpconfw' type='text' maxlength='3' style='width:2.5em;' />&nbsp;&nbsp;height: <input id='chimpconfh' type='text' maxlength='3' style='width:2.5em;' />px</form>" +

		"<hr><p style='margin-top:-.1em; margin-bottom:0'>Most changes occur on port refresh<p style='margin-top:.4em; margin-bottom:0'><input id='optButtonOKch' type='button' value='      OK      ' />";

		optDivCh.id = "optionsPanelCh";
		optDivCh.style.position = "fixed";
		optDivCh.style.visibility = "hidden";
		optDivCh.style.top = "0px";
		optDivCh.style.left = "0px";
		optDivCh.style.backgroundColor = "#F3F3F3";
		optDivCh.style.padding = "10px";
		optDivCh.style.zIndex = "105";
		optDivCh.style.borderWidth = "5px";
		optDivCh.style.borderStyle = "ridge";
		optDivCh.style.borderColor = "gray";
		optDivCh.style.height = "auto";
		optDivCh.style.width = "auto";

		//--- div panel for bond info pseudo-tooltip

		var calcDivCh = document.createElement("div");

		calcDivCh.id = "calcTipCh";
		calcDivCh.style.position = "fixed";
		calcDivCh.style.zIndex = "106";
		calcDivCh.style.visibility = "hidden";
		calcDivCh.style.height = "auto";
		calcDivCh.style.width = "auto";

		//--- place new panels into HTML

		var findbody = document.evaluate("//body", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var item = findbody.snapshotItem(0);
		item.insertBefore(tradeDivCh, item.firstChild);
		item.insertBefore(optDivCh, item.firstChild);
		item.insertBefore(calcDivCh, item.firstChild);

		//--- store global references to trade inputs, etc. for later use

		refSymbolCh = document.getElementById("Symbol");
		refQuantityCh = document.getElementById("Quantity");
		refTradePanel = document.getElementById("tradePanelCh");
		refSymbolCh.addEventListener("focus", symbolFocus, false);
		refSymbolCh.addEventListener("blur", symbolBlur, false);

		//--- collect security links

		var findsecurities = document.evaluate("//a[contains(@href,'security/view')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		var item = "";
		for(var i=findsecurities.snapshotLength-1; i>=0; i--)
		{
		item = findsecurities.snapshotItem(i);
		item.addEventListener("mouseover", putTickerCh, false);
		}

		//--- set up appearance

		var divHide = document.getElementById("div2hide");
		var titleTable = document.getElementById("titleTable");
		refTradePanel.style.height = divHide.clientHeight + titleTable.clientHeight + "px";
		refTradePanel.style.width = GM_getValue("chimpPanW", "105") + "px";
		refTradePanel.style.left = GM_getValue("chimpX", "100px");
		refTradePanel.style.top = GM_getValue("chimpY", "100px");
		refTradePanel.style.visibility = GM_getValue("chimpVis", "visible");
		if (GM_getValue("chimpRoll", false) == true) chimpRollup();
		//refSymbolCh.value = GM_getValue("chimpTicker","");

		var tdTime = document.getElementById("td4time");
		if (GM_getValue("chimpTime", true) == true) {
            var m = moment();
            var la = moment.tz(m,"America/Los_Angeles");
            var laTime = la.format('hh:mm A');
            tdTime.textContent = laTime;
            //GM_log(laTime);    
		}
		else { tdTime.textContent = "Chimp"; }

		// put in ticker symbol for any security
			if (url.indexOf('security/view') > -1) {
			var tickStart = url.lastIndexOf("/") + 1;
			refSymbolCh.value = url.substr(tickStart);	
		}

		//--- intraday price graph link
		var findType = document.evaluate("//title", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		// See if we have a moviestock page
		if(findType.snapshotItem(0).textContent.indexOf('MovieStock') > -1) {
			// Get security name and todays change nodes
			var findTicker = document.evaluate("//p[@class='security_name']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var findChange = document.evaluate("//p[@class='value']//span", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			var tickStart = url.lastIndexOf("/") + 1;
			var ticker = url.substr(tickStart);

			// Get direction of today's change; add appropriate class and add link to node
			var changeItem = findChange.snapshotItem(0);
			var todayColor = "#444444";
			if (changeItem.className.indexOf('down') > -1) todayColor = "#bf1f11"; //  hsx red
			else if (changeItem.className.indexOf('up') > -1) todayColor = "#3da72e"; // hsx green

			var wURL = "http://theun4gven.com/hsx/daily.php?sec=" + ticker;
			var wh = "width=" + "450" + ",height=" + "320";

			// Allow underlined link, as differentiates from non-movie security pages
			changeItem.innerHTML = "<a href='javascript:void(0)' title='Click for intraday price graph' onclick='javascript:window.open(\"" + wURL + "\", \"iday\", \"" + wh + "\");' style=\"color:" + todayColor + "\"'>" + changeItem.textContent + "</a>";
		}
	}

	else {
		if (url.indexOf('symbol') < 0 || url.indexOf('shares') < 0 || url.indexOf('tradeType') < 0 || url.indexOf('action') < 0 || url.indexOf('limit') > -1 || url.indexOf('trade_origin_url') > -1) return;

		// get trade info from URL, to use in CONFIRMATION WINDOW
		var urlHash = url;
		var chunk = new Array();
		var eq = ""; var amp = "";
		var tradeInfo = "";

		for(var i=0; i<4; i++) {
			eq = urlHash.indexOf('=');
			amp = urlHash.indexOf('&');
			chunk[i] = urlHash.substring(eq+1,amp);
			if(i == 3) chunk[3] = urlHash.substring(eq+1);
			if(chunk[i] != "submit" && chunk[i] != "place+order") {
				tradeInfo += " " + chunk[i];
				if(i < 3) tradeInfo += ",";
			}
			urlHash = urlHash.substring(amp+1);
		}

		// cut stuff out
		var cutpanel = document.getElementById("announce_bar");
		try { cutpanel.parentNode.removeChild(cutpanel); }
		catch(err) {}
		cutpanel = document.getElementById("header");
		cutpanel.parentNode.removeChild(cutpanel);
		cutpanel = document.getElementById("navigation");
		cutpanel.parentNode.removeChild(cutpanel);	
		cutpanel = document.getElementById("footer");
		cutpanel.parentNode.removeChild(cutpanel);	
		findpanel = document.evaluate("//div[@class='column-row']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		cutpanel = findpanel.snapshotItem(0);
		cutpanel.parentNode.removeChild(cutpanel);
		cutpanel = findpanel.snapshotItem(2);
		cutpanel.parentNode.removeChild(cutpanel);
		findpanel = document.evaluate("//div[@class='four columns last']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		cutpanel = findpanel.snapshotItem(0);
		cutpanel.parentNode.removeChild(cutpanel);

		// make new add-in panel with close button
		var buttonDiv = document.createElement("div");
		buttonDiv.innerHTML = "<form><input value='Close' onclick='javascript:window.close();' type='submit' title='Keyboard shortcut: Enter' />" + tradeInfo + "</form>";
		buttonDiv.id = "buttonPanel";
		buttonDiv.style.position = "relative";

		// add panel, and cut out more
		var h1 = document.getElementsByTagName("h1");
		if(h1[0].textContent != "Trade Placed") {
			document.title = "Failed!";
			var item = document.getElementById("adv-trader-container");
			item.insertBefore(buttonDiv, item.firstChild);
			cutpanel = document.getElementById("advanced-trader-form");
			cutpanel.parentNode.removeChild(cutpanel);	
			cutpanel = item.firstChild.nextSibling.nextSibling;
			cutpanel.parentNode.removeChild(cutpanel);	
			cutpanel = item.firstChild.nextSibling.nextSibling.nextSibling;
			cutpanel.parentNode.removeChild(cutpanel);	
		}
		else {
			document.title = tradeInfo; // trade success
			var item = document.getElementById("reg-container");
			item.insertBefore(buttonDiv, item.firstChild);
			for (var i=0; i<5; i++) {
			cutpanel = item.firstChild.nextSibling;
			cutpanel.parentNode.removeChild(cutpanel);
			}	
			cutpanel = item.firstChild.nextSibling;
			cutpanel.innerHTML = "<span style='color: green; font-weight: bold'>Success!</span>";
		}	
	}
}

HSXchimp_Run();

})();
// End

