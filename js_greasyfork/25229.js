/*=====================================================================================*\
|  HSX League Genie                                                                     |
|  GreaseMonkey Script for Hollywood Stock Exchange                                     |
|      2016 by Eduardo Zepeda                                                           |
\*=====================================================================================*/

// ==UserScript==
// @name           HSX League Genie
// @namespace      edzep.scripts
// @version        1.0.6
// @author         EdZep at HSX
// @description    Allows section hiding, provides hotkeys, and prevents overlong comments
// @include        http*://*hsx.com/league/view*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAALHRFWHRDcmVhdGlvbiBUaW1lAFN1biAxMCBBcHIgMjAxMSAxMToyNTo1OCAtMDUwMF3oDl8AAAAHdElNRQfbBAsOKR27crm1AAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC/xhBQAAAA9QTFRF////AAAAAAD///8AgAAADJhXAAAAAAF0Uk5TAEDm2GYAAAC5SURBVHjajZNBFsQgCENN9f5nnhFBE+hry6YVvhFEGl6s4Xq0AO72MgD0YotYwIz7tvjCCQNsNcwQP8OJCVCcACf+QMT5CAe6lRlxzi+AfgAp42xghUieBRZAOQ5kAasiASzAZe4jWMAvStIUAblJ1BJ2L04hLrBS12aVXuARkG5eOP3u1G0C2t2DaQIUAgoUAtPHQCJgLgGEwPIoQATckYBNINZ8D/xeeHTS6O1xKKN3CCTHh+F9sR+bJgggaRbXggAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/25229/HSX%20League%20Genie.user.js
// @updateURL https://update.greasyfork.org/scripts/25229/HSX%20League%20Genie.meta.js
// ==/UserScript==

// Start
(function() {

var charAvailable = "";
var hotkeysOff = false;

function toggle(hidethis) {

	if(hidethis == "hideInfo") {
		var ttarget1 = document.getElementById("tableInfoA");
		var ttarget2 = document.getElementById("tableInfoB");
		var ttarget3 = document.getElementById("afterTables");

		if(ttarget1.style.display == "none") {
			ttarget1.style.display = "block";
			if(ttarget2 != null) ttarget2.style.display = "block";
			ttarget3.style.display = "block";
			GM_setValue(hidethis,false);
			}
		else {
			ttarget1.style.display = "none";
			if(ttarget2 != null) ttarget2.style.display = "none";
			ttarget3.style.display = "none";
			GM_setValue(hidethis,true);
			}
		}
	else {
		if(hidethis == "hidePending")
			{ var ttarget = document.getElementById("tablePending"); }
		if(hidethis == "hideStandings")
			{ var ttarget = document.getElementById("tableStandings"); }
		if(ttarget.style.display == "none")
			{ ttarget.style.display = "inline"; GM_setValue(hidethis,false); }
		else { ttarget.style.display = "none"; GM_setValue(hidethis,true); }
		}
	}

function ObjectPosition(obj) {
	// this function by Peter-Paul Koch, http://www.quirksmode.org/js/findpos.html
	var curleft = 0;
	var curtop = 0;
	if (obj.offsetParent) {
        	do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
	return [curleft,curtop];
	}

// This function inserts newNode after referenceNode; from netLobo.com
function insertAfter( referenceNode, newNode )
	{ referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling ); }

function hotkeysOfz() { hotkeysOff = true; }

function hotkeysOn() { hotkeysOff = false; }

function messageMonitor(e) {
	if(!e) e=window.event;
	var key = e.keyCode ? e.keyCode : e.which;
	//GM_log(key + " " + e.keyCode + " " + e.which);

	var tempstr = e.target.value + String.fromCharCode(key);
	var avail = 255 - (tempstr.length);
	if((e.which == 0 && e.keyCode == 46) || key == 8) { // backspace, delete
		avail = avail + 2;
		if(avail > 255) avail = 255;
		}
	else if(e.which == 0) avail++; // other special keys

if(avail >= 0) {
	charAvailable.textContent = avail;
	return;
	}

e.stopPropagation();
e.preventDefault();
}

function sectionJump(param) {
	switch(param) {
		case 1:
			var objpos = ObjectPosition(document.getElementById("headStandings")); break;
		case 2:
			var objpos = ObjectPosition(document.getElementById("headComments"));
		}
	scrollTo(pageXOffset,objpos[1]-20);
	}

document.addEventListener('keypress', function(e) {
	if(!e) e=window.event;
	var key = e.keyCode ? e.keyCode : e.which;
	var quash = false;

	if(hotkeysOff) return;
	if(key == 91) { sectionJump(1); quash=true; } // [
	if(key == 93) { sectionJump(2); quash=true; } // ]

	if(quash == true) e.stopPropagation();
	}, true);

document.addEventListener('click', function(event) {

	var tempstr = new String(event.target);
	var quash = false;
	//GM_log(event.target);

	if(tempstr.indexOf('toggle') > -1 )
		{
		if(tempstr.indexOf('info') > -1 ) toggle("hideInfo");
		if(tempstr.indexOf('pending') > -1 ) toggle("hidePending");
		if(tempstr.indexOf('standings') > -1 ) toggle("hideStandings");
		quash = true;
		}

	if(quash == true)
		{
		//quash any further actions of events handled here
		event.stopPropagation();
		event.preventDefault();
		}

	}, true);

function HSXLeagueGenie_Run(){
GM_addStyle('.pmHead { font-size:1.5em;text-transform:uppercase;font-style:italic;color:blue; }');

///// Find the tables to toggle out of site /////
var findTables = document.evaluate("//table", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

// -------- top section, 2 tables + form or quit link
var tableInfoA = findTables.snapshotItem(0);
var tableInfoB = findTables.snapshotItem(1);

tableInfoA.id = "tableInfoA";
tableInfoB.id = "tableInfoB";

var newDiv = document.createElement("div");
newDiv.innerHTML = "Hotkeys: [ = Standings, ] = Comments";
newDiv.style.position = "absolute";
newDiv.style.top = "0px";
newDiv.style.right = "10px";
tableInfoA.parentNode.insertBefore(newDiv,tableInfoA);

var userStatus = "", thisItem = "";
var findForm = document.evaluate("//form[@action='invite.php']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
var thisForm = findForm.snapshotItem(0);
if(thisForm != null) {
	userStatus = "admin";
	}
if(userStatus == "") {
	var findForm = document.evaluate("//form[@action='join.php']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var thisForm = findForm.snapshotItem(0);
	if(thisForm != null) {
		userStatus = "guest";
		}
	}
if(userStatus == "") {
	var findForm = document.evaluate("//a[contains(@href,'remove.php')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var thisForm = findForm.snapshotItem(0);
	if(thisForm != null) {
		userStatus = "member";
		}
	}

thisItem = tableInfoA.previousSibling.previousSibling; // delete BR
thisItem.parentNode.removeChild(thisItem);

thisItem = thisForm.previousSibling.previousSibling; // delete BR
thisItem.parentNode.removeChild(thisItem);

thisForm.id = "afterTables";

var newSpan = document.createElement("span");
newSpan.innerHTML = "<a href=\"javascript:toggle(info);\" class=\"pmHead\" title=\"Click to view / hide this section\">League Info</a><p />";
tableInfoA.parentNode.insertBefore(newSpan,tableInfoA);

// -------- regular tables and headings; pending and standings

var findheadings = document.evaluate("//h3", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

if(userStatus == "admin") {
	var tablePending = findTables.snapshotItem(2);
	var tableStandings = findTables.snapshotItem(3);
	// next lines because some pages are formatted differently
	if(tableStandings.getAttribute("class") != "sortable") {
		tablePending = findTables.snapshotItem(1);
		tableStandings = findTables.snapshotItem(2);
		}

	tablePending.id = "tablePending";
	if(GM_getValue("hidePending", false) == true) toggle("hidePending");

	var headPending = findheadings.snapshotItem(0);
	var headStandings = findheadings.snapshotItem(1);
	var headComments = findheadings.snapshotItem(2);

	for(var i=0; i<2; i++) { // remove some <br>
		thisItem = headPending.previousSibling.previousSibling;
		thisItem.parentNode.removeChild(thisItem);
		}
	var newSpan = document.createElement("span");
	newSpan.innerHTML = "<a href=\"javascript:toggle(pending);\" class=\"pmHead\" title=\"Click to view / hide this section\">Pending / Inactive Members</a><p />";
	headPending.parentNode.insertBefore(newSpan,headPending);
	headPending.parentNode.removeChild(headPending);
	}
else {
	var headStandings = findheadings.snapshotItem(0);
	var headComments = findheadings.snapshotItem(1);

	var tableStandings = findTables.snapshotItem(2);
	// next lines because some pages are formatted differently
	//GM_log(tableStandings.getAttribute("class"));
	if(tableStandings == null || tableStandings.getAttribute("class") != "sortable")
		{ tableStandings = findTables.snapshotItem(1); }

	var t = 5; if(userStatus == "member") t = 6;
	for(var i=0; i<t; i++) { // remove a lot of <br>
		thisItem = headStandings.previousSibling.previousSibling;
		thisItem.parentNode.removeChild(thisItem);
		}
	}

tableStandings.id = "tableStandings";

var newSpan = document.createElement("span");
newSpan.innerHTML = "<a href=\"javascript:toggle(standings);\" id=\"headStandings\" class=\"pmHead\" title=\"Click to view / hide this section\">League Standings</a><p />";
headStandings.parentNode.insertBefore(newSpan,headStandings);
headStandings.parentNode.removeChild(headStandings);

if(GM_getValue("hideInfo", false) == true) toggle("hideInfo");
if(GM_getValue("hideStandings", false) == true) toggle("hideStandings");

///// Set up character counter for message box /////
if(userStatus != "guest") {
	headComments.id = "headComments"; // leftover from above

	var messageBox = document.getElementsByName("comment")[0];
	messageBox.addEventListener("keypress", messageMonitor, false);
	messageBox.addEventListener("focus", hotkeysOfz, false);
	messageBox.addEventListener("blur", hotkeysOn, false);

	var findSpan = document.evaluate("//span[contains(.,'255')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var targetSpan = findSpan.snapshotItem(0);
	targetSpan.textContent = "Characters available: ";
	charAvailable = document.createElement("span");
	charAvailable.textContent = "255";
	insertAfter(targetSpan,charAvailable);
	}
}

HSXLeagueGenie_Run();

})();
// End


