/*=====================================================================================*\
|  HSX Recurrent Overbearing Trivia & Obnoxiousness Expunger -- ROTO Expunger           |
|  GreaseMonkey Script for Hollywood Stock Exchange                                     |
|      2006-2016 Eduardo Zepeda                                                         |
|  This script adds a basic killfile to HSX forums. Click on the X by any author's      |
|  name to make them disappear until you may want them back. This is an update of the   |
|  classic HSX killfile. That script began as a modification of the Google Groups       |
|  killfile by Damian Penney, which he descibed as a modification of the Metafilter     |
|  killfile script written by Mystyk, with a bit of jiggery pokery applied.             |
\*=====================================================================================*/

// ==UserScript==
// @name           HSX ROTO Expunger
// @namespace      edzep.scripts
// @version        0.9.3
// @author         EdZep at HSX
// @description    Filter out annoying posts and users, on HSX forums
// @include        http*://*hsx.com/forum/forum.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAALHRFWHRDcmVhdGlvbiBUaW1lAFN1biAxMCBBcHIgMjAxMSAxMToyNTo1OCAtMDUwMF3oDl8AAAAHdElNRQfbBAsOKR27crm1AAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC/xhBQAAAA9QTFRF////AAAAAAD///8AgAAADJhXAAAAAAF0Uk5TAEDm2GYAAAC5SURBVHjajZNBFsQgCENN9f5nnhFBE+hry6YVvhFEGl6s4Xq0AO72MgD0YotYwIz7tvjCCQNsNcwQP8OJCVCcACf+QMT5CAe6lRlxzi+AfgAp42xghUieBRZAOQ5kAasiASzAZe4jWMAvStIUAblJ1BJ2L04hLrBS12aVXuARkG5eOP3u1G0C2t2DaQIUAgoUAtPHQCJgLgGEwPIoQATckYBNINZ8D/xeeHTS6O1xKKN3CCTHh+F9sR+bJgggaRbXggAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/24426/HSX%20ROTO%20Expunger.user.js
// @updateURL https://update.greasyfork.org/scripts/24426/HSX%20ROTO%20Expunger.meta.js
// ==/UserScript==

// Start
(function() {


function manageROTOfile() {
	
	var ROTOdiv = document.getElementById("ROTOnicks");
	ROTOdiv.style.visibility = (ROTOdiv.style.visibility == "visible" ? "hidden" : "visible")
	}

function ROTOfileRemove(idWord) {
  
	var splitCh = String.fromCharCode(255);
	var data = "";
	var list = new Array();
	var newList = new Array();
	
	data = GM_getValue("hsxROTOnicks", "");	
	list = data.split(splitCh);
	
	for(var j=0; j<list.length; j++)
		{
		if(list[j] != idWord)
			{
			newList.push(list[j]);
			}
		}
	
	alert(idWord + ' removed from Expunger.\nRefresh page to see changes.');  
	data = newList.join(splitCh);
	
	// save new list with item removed
	GM_setValue("hsxROTOnicks", data);
	}

function ROTOfileSet(idWord) {

	var splitCh = String.fromCharCode(255);
	var data = "";
	var list = new Array();

	data = GM_getValue("hsxROTOnicks", "");
	list = data.split(splitCh);
	list.push(idWord);
	
	alert(idWord + ' added to Expunger.\nRefresh page to see changes.');
	data = list.join(splitCh);
	
	// re-save list with item added
	GM_setValue("hsxROTOnicks", data);
	}

function pullParam(tempstr){
	
	//get parameter...
	var paren1 = tempstr.indexOf('(');
	var paren2 = tempstr.lastIndexOf(')');

	return decodeURI(tempstr.substr(paren1+2,paren2-paren1-3));
	}

function getThreadIndent(className) {

	var pIndent;
	if (className.indexOf("topic") > -1) pIndent = "0";
	else pIndent = className.substring(6);
	return pIndent;
}

document.addEventListener('keypress', function(event) {

	// allow enter key instead of OK when adding filter word
	var addDiv = document.getElementById("addWord");
  	if (event && event.which == 13 && addDiv.style.visibility == "visible") { 
		event.stopPropagation();
		event.preventDefault();
		closeAddWord();
		}
	}, true);


// use eventlistener so no need to use unsafeWindow to access functions from link hrefs
document.addEventListener('click', function(event) {

	var tempstr = new String(event.target);
	var quash = false;
	
	if(tempstr.indexOf('ROTOfileSet') > -1) 
		{
		ROTOfileSet(pullParam(tempstr));
		quash = true;
		}
	
	if(tempstr.indexOf('ROTOfileRemove') > -1) 
		{
		ROTOfileRemove(pullParam(tempstr));
		quash = true;
		}
	
	if(event.target == "javascript:manageROTOfile();") 
		{	
		manageROTOfile();
		quash = true;
		}	

	if(quash == true) 
		{
		//quash actions of the javascript links
		//while clicks on other, normal links pass through
		event.stopPropagation();
		event.preventDefault();
		}
	
	}, true);


function hsxROTOexpunger_Run(){
var splitCh = String.fromCharCode(255);
var data = "";
var ROTOnicks = new Array();
var removeCount = 0; //total matches
var nickTally = new Array(); //per nick match

GM_addStyle('.redX {color: red !important; font-weight: bold !important}');

// retrieve list of expunged nicks
data = GM_getValue("hsxROTOnicks", "");
ROTOnicks = data.split(splitCh);

// initialize tally array
for(var j=0; j<ROTOnicks.length; j++) nickTally[j] = 0;
 
// get set of posting links that have bold siblings
var candidates = document.evaluate("//span[@class='author']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//GM_log("show me something... anything!!");

for(var i=0; i<candidates.snapshotLength; i++) 
	{
	var cand = candidates.snapshotItem(i);
	var candNick = cand.textContent;
	//GM_log(candNick);
	
	// prepare X ROTO link
	var link = document.createElement("a");
	link.href = "javascript:ROTOfileSet('" + candNick + "');";
	link.appendChild(document.createTextNode("X"));
    link.setAttribute("class","redX");
	
	// move beyond nick and place the X
	var thenext = cand.nextSibling;
	cand.innerHTML = cand.innerHTML + " ";
	cand.parentNode.insertBefore(link, thenext);
		
	var cutThis = false;
	var nickIdx = -1;

	// loop through ROTO list to find posts by matching nicks
	for(var j=1; j<ROTOnicks.length; j++)
		{
		//GM_log(j + ' ' + ROTOnicks[j] + ' ' + candNick);
		if(ROTOnicks[j] == candNick)
			{
			nickTally[j]++;
			cutThis = true;
			nickIdx = j;
			break;
			}
		}

	// these values will be found, current ITEM was deemed to be cut in PREVIOUS iteration
	var candCutOrder = cand.getAttribute("cutOrder"); 
	var candCutIndent = cand.getAttribute("cutIndent"); // indent of original cut ITEM

	if (cutThis == true || candCutOrder == "true") {
		// remove post or entire thread
		
		// START by getting details of ITEM to cut
		var pNode = cand.parentNode.parentNode;
		var pNodeClass = pNode.getAttribute("class");
		var pNodeIndent = getThreadIndent(pNodeClass);

		//GM_log(pNodeIndent);
		
		// THEN get details of next SIBLING, to see if it must be cut, NEXT time through;
		// cut any SIBLING that has greater indent than original ITEM
		var pNodeSibling = pNode.nextSibling.nextSibling;
		if (pNodeSibling != null) {
			var pNodeSiblingClass = pNodeSibling.getAttribute("class");
			var pNodeSiblingIndent = getThreadIndent(pNodeSiblingClass);
			var pNodeSiblingTarget = pNodeSibling.firstChild.nextSibling.nextSibling.firstChild;
			var pNodeSiblingNick = pNodeSiblingTarget.textContent;
			
			//GM_log("pNodeSiblingNick = " + pNodeSiblingNick);
			
			if (candCutIndent == null && pNodeSiblingIndent > pNodeIndent) {
				// save original indent value, and order to cut
				pNodeSiblingTarget.setAttribute("cutIndent", pNodeIndent);				
				pNodeSiblingTarget.setAttribute("cutOrder", "true");
				}
			else if (candCutIndent != null && pNodeSiblingIndent > candCutIndent) {
				pNodeSiblingTarget.setAttribute("cutIndent", candCutIndent);				
				pNodeSiblingTarget.setAttribute("cutOrder", "true");
				}				
			}
		pNode.parentNode.removeChild(pNode);
		removeCount++;		
		}		
	}
	
// add Expunger link
var findSpan = document.evaluate("//form[@name='paginate2']//span[@class='right']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
var spanContent = findSpan.snapshotItem(0);
spanContent.innerHTML = "<a href=\"javascript:manageROTOfile();\">Expunger(" + removeCount + ")</a> " + spanContent.innerHTML;

// define and hide the ROTO panel
var newDiv = document.createElement("div");
var divHtml = "<b>Expunger</b> by EdZep<br/>Click X to remove<br/><br/>";
for(var j=1; j<ROTOnicks.length; j++)
	{
	divHtml = divHtml + "<a href=\"javascript:ROTOfileRemove('" + ROTOnicks[j] + "');\">X</a> " + ROTOnicks[j] + " <b>" + nickTally[j] + "</b><br/>";
	}

divHtml = divHtml + "<br/><a href=\"javascript:manageROTOfile();\">Close</a>";
newDiv.innerHTML = divHtml;

newDiv.id = "ROTOnicks";
newDiv.style.position = "fixed";
newDiv.style.visibility = "hidden";
newDiv.style.top = "10px";
newDiv.style.left = "10px";
newDiv.style.backgroundColor = "#fff";
newDiv.style.fontSize = "10px";
newDiv.style.fontFamily = "Verdana";
newDiv.style.fontWeight = "normal";
newDiv.style.padding = "8px";
newDiv.style.border = "solid 1px #000000";
newDiv.style.zIndex = "300";		

item = document.getElementById("bodywrap")
item.insertBefore(newDiv, item.firstChild);

}

hsxROTOexpunger_Run();

})();
// End


