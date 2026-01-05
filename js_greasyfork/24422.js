/*=====================================================================================*\
|  Port Monkey - GreaseMonkey Script for Hollywood Stock Exchange                       |
|      (c) 2009-2016 by Eduardo Zepeda                                                  |
|  A logical and effective re-tuning of the HSX portfolio re-design, including a        |
|  sidebar trade panel, price trend arrows, custom tagging, color styler, estimated     |
|  bond adjust fetch, info pop-ups, and configurable options. Works with Opera          |
|  and Chrome (most features).                                                          |
\*=====================================================================================*/

// ==UserScript==
// @name           HSX Port Monkey
// @namespace      edzep.scripts
// @version        5.3.8
// @author         EdZep at HSX
// @description    Port tuneup with sidebar trade panel, trend arrows, tagging, options, etc.
// @include        https://*hsx.com/portfolio/*
// @exclude        https://*hsx.com/portfolio/bank*
// @exclude        https://*hsx.com/portfolio/limit*
// @exclude        https://*hsx.com/portfolio/history*
// @exclude        https://*hsx.com/portfolio/chart*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_log
// @resource       jscolorXS https://greasyfork.org/scripts/25223-jscolorxs/code/jscolorXS.js?version=160404
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAALHRFWHRDcmVhdGlvbiBUaW1lAFN1biAxMCBBcHIgMjAxMSAxMToyNTo1OCAtMDUwMF3oDl8AAAAHdElNRQfbBAsOKR27crm1AAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC/xhBQAAAA9QTFRF////AAAAAAD///8AgAAADJhXAAAAAAF0Uk5TAEDm2GYAAAC5SURBVHjajZNBFsQgCENN9f5nnhFBE+hry6YVvhFEGl6s4Xq0AO72MgD0YotYwIz7tvjCCQNsNcwQP8OJCVCcACf+QMT5CAe6lRlxzi+AfgAp42xghUieBRZAOQ5kAasiASzAZe4jWMAvStIUAblJ1BJ2L04hLrBS12aVXuARkG5eOP3u1G0C2t2DaQIUAgoUAtPHQCJgLgGEwPIoQATckYBNINZ8D/xeeHTS6O1xKKN3CCTHh+F9sR+bJgggaRbXggAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/24422/HSX%20Port%20Monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/24422/HSX%20Port%20Monkey.meta.js
// ==/UserScript==

// Start

(function() {

//--- global object references, etc

var refSymbol = "";
var refQuantity = "";
var refTradeConfirm = "";
var refNavbar = "";
var refMainDataDiv = "";
var refObjectTemp = "";
var holdStatus = "";
var url = "";
var bondBuffer = "";
var hotkeysActive = true;
var mouseDown = false;
var positions = new Array(); // 0=movies, 1=bonds, 2=deriv, 3=funds

//--- copy data to system clipboard

function put2clipboard(sectionName) {
	var table = document.getElementById(sectionName);
	var clipboard = '';
	var chunk = new Array();
	
	if(table != null) {
		for(var r = 1, n = table.rows.length; r < n; r++) {
			// get values for entire row
			for(var j=0; j<10; j++) {
				chunk[j]= table.rows[r].cells[j].textContent+' ';
				var h = chunk[j].indexOf("H$"); // remove H$, which makes ss text of numbers
				if(h>-1) chunk[j]=chunk[j].slice(h+2);
			}
			// revert to HSX original long/short indicators
			chunk[2]="long ";
			if(chunk[1].indexOf('-')>-1) {
				chunk[2]="short ";
				chunk[1]=chunk[1].slice(1); // remove invisible - on short share numbers
			}
			// remove % sign on last column
			GM_log(chunk[9]);
			chunk[9] = chunk[9].slice(0,-2);
			GM_log(chunk[9]);
			
			clipboard += chunk[0] + chunk[1] + chunk[2] + chunk[3] + chunk[4] + chunk[5] +  chunk[6] + chunk[7] + chunk[8] + chunk[9] + "\n";
		}
	}
	GM_setClipboard(clipboard);
}

//--- find missing MovieStocks

function idMissingMovies() {

	// find all securities
	var findsecurities = document.evaluate("//div[@class='twelve columns last']//a[contains(@href,'security/view')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	var strAllOwnedMovies = "";
	for(var i=0; i<positions[0]; i++) strAllOwnedMovies += findsecurities.snapshotItem(i).textContent + ",";

	// *** perform 5 searches; results of each expected to be about 300-350 items
	// *** HSX can return 500 results per search; if any of the 5 search results
	// *** exceeds 500, this whole process will become inaccurate
	var doc = new Array();
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://www.hsx.com/search/?keyword=&status=ACT&type=1&minprice=min&maxprice=.06&action=submit_advanced',
		onload: function(response) {
			doc[1] = document.createElement('div');
			doc[1].innerHTML = response.responseText;

	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://www.hsx.com/search/?keyword=&status=ACT&type=1&minprice=.07&maxprice=.40&action=submit_advanced',
		onload: function(response) {
			doc[2] = document.createElement('div');
			doc[2].innerHTML = response.responseText;
			
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://www.hsx.com/search/?keyword=&status=ACT&type=1&minprice=.41&maxprice=4&action=submit_advanced',
		onload: function(response) {
			doc[3] = document.createElement('div');
			doc[3].innerHTML = response.responseText;

	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://www.hsx.com/search/?keyword=&status=ACT&type=1&minprice=4.01&maxprice=14&action=submit_advanced',
		onload: function(response) {
			doc[4] = document.createElement('div');
			doc[4].innerHTML = response.responseText;

	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://www.hsx.com/search/?keyword=&status=ACT&type=1&minprice=14.01&maxprice=max&action=submit_advanced',
		onload: function(response) {
			doc[5] = document.createElement('div');
			doc[5].innerHTML = response.responseText;

			var findDoc1WB = document.evaluate("//div[@class='whitebox_content']", doc[1], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var doc1Whitebox = findDoc1WB.snapshotItem(0);

			// merge search results 2,3,4,5 into the first
			for(i=2; i<6; i++) {
				var findTable = document.evaluate("//table[@class='sortable']", doc[i], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				var docTable = findTable.snapshotItem(0);
				doc1Whitebox.insertBefore(docTable, doc1Whitebox.firstChild);
				}
				
			var findAllMovies = document.evaluate("//div[@class='whitebox_content']//a[contains(@href,'security/view')]", doc[1], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		
			var resultsText="Moviestocks listed below are not held in your portfolio.<p>";
			
			var availableCount = 0;
			var missingCount = 0;
			// each stock will appear TWICE in findAllMovies, so count by 2s
			for(i=0; i<findAllMovies.snapshotLength; i+=2) {
				var item = findAllMovies.snapshotItem(i);
				var title = item.textContent;
				var ppNode = item.parentNode.parentNode;
				var ticker = ppNode.childNodes[3].textContent; 
				var status = ppNode.childNodes[7].textContent;
				
				if(status!="IPO") {
					availableCount++;
					var missingMovie = true;		
					if(strAllOwnedMovies.indexOf(ticker) > -1) missingMovie = false;
					if(missingMovie==true) {
						resultsText += "<a href='https://www.hsx.com/security/view/" + ticker + " 'target='_new'>" + ticker + "</a> - " + title +    "<br>";
						missingCount++;
						}
					}
				}

			resultsText += "<p>Active Moviestocks: " + availableCount + "<br>Not held: " + missingCount;
			var width = 400;
			var height = 400;
			var left = parseInt((screen.width/2) - (width/2));
			var top = parseInt((screen.height/2) - (height/2));
			var windowFeatures = "width=" + width + ",height=" + height +   
				",status,resizable,left=" + left + ",top=" + top + 
				"screenX=" + left + ",screenY=" + top + ",scrollbars=yes";

            var resultsWindow = window.open("data:text/html," + encodeURIComponent(resultsText),"_blank", windowFeatures);
            resultsWindow.focus();
			}
		});
			}
		});
			}
		});
			}
		});
			}
		});
	}


//--- center "fixed" element in browser

function centerThis(e) {
    var eRef = document.getElementById(e);
    var x = (document.documentElement.clientWidth - eRef.offsetWidth) / 2;
    var y = (document.documentElement.clientHeight - eRef.offsetHeight) * .4;
    eRef.style.left = x + "px";
    eRef.style.top = parseInt(y) + "px";
    }

//--- color picker functions

function colorShowHide() {
	var optColor = document.getElementById("colorPanel");
	if(optColor.style.left == "-1000px") {
		optShowHide();
		document.getElementById("opt_cutCorn").checked = GM_getValue("opt_cutCorn", false);
		document.getElementById("opt_cutGrad").checked = GM_getValue("opt_cutGrad", false);
		document.getElementById("opt_cutGrid").checked = GM_getValue("opt_cutGrid", false);
		document.getElementById("opt_cutPx").checked = GM_getValue("opt_cutPx", false);
		document.getElementById("opt_cutBrd").checked = GM_getValue("opt_cutBrd", false);
		document.getElementById("opt_cutJlogo").checked = GM_getValue("opt_cutJlogo", false);
        centerThis("colorPanel");
		}
	else {
		// don't hide, just move, so picker can initialize and work properly
		optColor.style.left = "-1000px";

        var findInputs = document.evaluate("//div[@id='colorPanel']//input[@class='color']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for(var i=0; i<findInputs.snapshotLength; i++) {
            var inputID = findInputs.snapshotItem(i).id;
            GM_setValue(inputID, document.getElementById(inputID).value);
            }

		GM_setValue("opt_cutCorn", document.getElementById("opt_cutCorn").checked);
		GM_setValue("opt_cutGrad", document.getElementById("opt_cutGrad").checked);
		GM_setValue("opt_cutGrid", document.getElementById("opt_cutGrid").checked);
		GM_setValue("opt_cutPx", document.getElementById("opt_cutPx").checked);
		GM_setValue("opt_cutBrd", document.getElementById("opt_cutBrd").checked);
		GM_setValue("opt_cutJlogo", document.getElementById("opt_cutJlogo").checked);
		}
	}

function colorDefaults() {
    alert("Refresh port to see changes,\nor to further edit colors.");
	document.getElementById("colorPanel").style.left = "-1000px";

    var findInputs = document.evaluate("//div[@id='colorPanel']//input[@class='color']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for(var i=0; i<findInputs.snapshotLength; i++) {
        var inputID = findInputs.snapshotItem(i).id;
        GM_deleteValue(inputID);
        }
	}

function insertPickerCode() {
	var scriptNode = document.createElement("script");
	scriptNode.textContent = GM_getResourceText("jscolorXS");
	scriptNode.setAttribute("type", "text/javascript");
	document.getElementsByTagName("head")[0].appendChild(scriptNode);
	}

//--- display expected bond adjust info

function showBondInfo(clickX, clickY, mode, currentVal, isBond) {
	var tempBuffer = bondBuffer;
	
    // get data freshness date
    var bondInfoDate = tempBuffer.substring(0,tempBuffer.indexOf('\n')-1);

	// find and format bond ticker & adjust info
	var ticker = refSymbol.value;
	if(mode == "inPort") {
		ticker = refObjectTemp.getAttribute("alt");
		currentVal = parseFloat(refObjectTemp.textContent.slice(2));
		}
	var future = "the future is hazy";
	var info = new Array();
	var locate = tempBuffer.indexOf(',' + ticker +','); // mcg
    
	if(locate > -1 && currentVal != -1) {
        
        if(locate > 20) {
            do {
                locate -= 1;
                ch = tempBuffer.charAt(locate);
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
	
	var position = "absolute";
	if(mode == "symbol") {
		position = "fixed";
		clickX = parseInt(document.getElementById("tradePanel").style.width) - 12;
		clickY = parseInt(document.getElementById("topLinkPanel").style.height) * 3.4;
		}

	if(currentVal == -1) currentVal = "Error!";
	else currentVal = "H$" + currentVal.toFixed(2);
	var bigstr = "<table class='calc'><tr><td style='font-weight:bold'><a href='https://www.hsx.com/security/view/" + ticker + "' target='pm_a'>" + ticker + "</a></td><td width=90%><a href='javascript:closeTipPm();' style='display:block; text-align:right'>X </a></td></tr><tr><td colspan=2>Current: <b>" + currentVal + "</b></td></tr>";
	if(isBond) bigstr += "<tr><td colspan=2>Estimated: " + future + "</td></tr>";
	bigstr += "<tr><td colspan=2>";
	if(currentVal != "Error!" && isBond) bigstr += "<a href='http://www.kaigee.com/SBO/" + ticker + "' target='pm_b' title='Last update: " + bondInfoDate + "'>Details at KaiGee.com</a></td></tr></table>";
		
	displayTip(bigstr,clickX,clickY,3,position);
	}
	
//--- fetch bond adjust info, regular click on current price
	
function fetchBondInfoA(clickX, clickY, mode) {
	if(mode == "symbol") {
        // get data from HSX
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://www.hsx.com/security/view/' + refSymbol.value,
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

				if(bondBuffer != "" || isBond == false)
					{ showBondInfo(clickX, clickY, mode, price, isBond); }
				else { 
                    // get data from the-numbers
                    fetchBondInfoB(clickX, clickY, mode, price, isBond); 
                    }
				}
			});
		}
	else {
		// mode = "inPort"
		if(bondBuffer != "")
			{ showBondInfo(clickX, clickY, mode, 0, true); }
		else { 
            // get data from the-numbers
            fetchBondInfoB(clickX, clickY, mode, 0, true); 
            }
		}
	}

function fetchBondInfoB(clickX, clickY, mode, price, isBond) {
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.kaigee.com/Lists/PM.csv',
		onload: function(response) {
			bondBuffer = response.responseText;
			showBondInfo(clickX, clickY, mode, price, isBond);
			}
		});
	}
	
//--- retrieve description for SECURITY, click-hold on price paid

function showDescription(clickX, clickY) {
	var ticker = refObjectTemp.getAttribute("alt");
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://www.hsx.com/security/view/' + ticker,
		onload: function(response) {
			var doc = document.createElement('div');
			doc.innerHTML = response.responseText;
			
			var findparagraph = document.evaluate("//div[@class='whitebox_content']//p", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var bigstr = findparagraph.snapshotItem(0).textContent;
			
			if (bigstr.indexOf('nception') > -1 && (bigstr.indexOf('ate') > -1 || bigstr.indexOf('und') > -1))
				{ bigstr = findparagraph.snapshotItem(1).textContent; }
			bigstr = "<table class='calc'><tr><td style='font-weight:bold'>" + ticker + "</td></tr><tr><td>" + ltrim(bigstr) + "</td></tr></table>";
			if (mouseDown) { displayTip(bigstr,clickX,clickY,2,"absolute"); }
			}
		});
	}

//--- set up window for SECURITY intraday graph fetch, click on today's change

function intraday() {
	var ticker = refObjectTemp.getAttribute("alt");
    var wURL = "http://theun4gven.com/hsx/daily.php?sec=" + ticker;
	var wh = "width=" + "450" + ",height=" + "320";
	var windowRef = window.open(wURL, "iday", wh);
	}

//--- do calculations for MOVIE, click-hold on current price

function showCalc(clickX, clickY) {
	var price = refObjectTemp.textContent.slice(2);
	var ticker = refObjectTemp.getAttribute("alt");
	var ch = String.fromCharCode(247); //proper divide sign
	var calc2 = (price / 2.0).toFixed(2);
	var calc3 = (price / 2.2).toFixed(2);
	var calc1 = (price / 2.7).toFixed(2);
	var calc4 = (price / 4.8).toFixed(2);

	var newHTML = "<table class='calc'><tr><td colspan=5 style='font-weight:bold'>" + ticker + "</td></tr><tr><td>" + price + "</td><td>" + ch + "</td><td>2.0</td><td>=</td><td style='text-align:right'>" + calc2 + "</td></tr><tr><td></td><td>" + ch + "</td><td>2.2</td><td>=</td><td style='text-align:right'>" + calc3 + "</td></tr><tr><td></td><td><b>" + ch + "</b></td><td><b>2.7</b></td><td><b>=</b></td><td style='text-align:right'><b>" + calc1 + "</b></td></tr><tr><td></td><td>" + ch + "</td><td>4.8</td><td>=</td><td style='text-align:right'>" + calc4 + "</td></tr></table>";

	displayTip(newHTML,clickX,clickY,1,"absolute");
	}

//--- display calculation, description or bond tooltip box

function displayTip(newHTML,clickX,clickY,mode,position) {
	var calcDiv = document.getElementById("calcTip");
	calcDiv.innerHTML = newHTML;

    calcDiv.style.color = GM_getValue("opt_qLnk","#3597B2");
	calcDiv.style.top = clickY + 15 + "px";
	calcDiv.style.left = clickX + 25 + "px";
	calcDiv.style.zIndex = "103";
	calcDiv.style.width = "auto";
	calcDiv.style.position = position;
	
	// mode 1 = calc division; mode 2 = description; mode 3 = bond info
	if (mode == 2) { calcDiv.style.width = document.documentElement.clientWidth - clickX - 50 + "px"; }
	if (mode == 3) { calcDiv.style.zIndex = "203"; }
	
	//keep calc display from appearing below screen edge
	var divHeight = calcDiv.offsetHeight;
	var pageBottom = window.innerHeight + window.scrollY;

	if (parseInt(calcDiv.style.top) > pageBottom - divHeight + 25)
		{ calcDiv.style.top = pageBottom - divHeight + 25 + "px"; }
		//not sure why 25 is the magic number for bottom-edge tuning
	calcDiv.style.visibility = "visible";
	}

//--- read tag data for tagger and for building table

function readTag(ticker) {

	var tagChar = "";
	var tagColor = "";
	var tagNote = "";
	var tagAllTickers = GM_getValue("tagTickers", "");
	ticker += "      ";
	ticker = ticker.slice(0,7);
	var tickerIdx = tagAllTickers.indexOf(ticker);

	if(tickerIdx > -1) {
		var setIdx = tickerIdx / 7 * 3 + 1; // this type of array starts at 1
		var splitCh = String.fromCharCode(255);
		var tagAllNotes = new Array();
		var tempStr = unescape(GM_getValue("tagNotes", ""));
		tagAllNotes = tempStr.split(splitCh);

		tagChar = tagAllNotes[setIdx];
		tagColor = tagAllNotes[setIdx+1];
		tagNote = tagAllNotes[setIdx+2];
		}

	return [tagChar,tagColor,tagNote];
	}

//--- tag weeder; kill off tags for sold or delisted items

function tagWeeder() {
	var tagTickers = GM_getValue("tagTickers", "");
	var arrowTickers = GM_getValue("prevTickers", "");
	if(arrowTickers == "") return;

	// get each tag ticker and see if it still exists in the full port ticker list
	for(var i=0; i<tagTickers.length/7; i++) {
		var ticker = tagTickers.substr(i*7,7);
		if( !(arrowTickers.indexOf(ticker) > -1) ) {
			// did NOT find it, so call to have it deleted from tag set
			writeTag('delete',ticker);
			}
		}
	}

//--- write data from tagger

function writeTag(mode, ticker) {

	var tagDiv = document.getElementById("tagPanel"); // get values from form
	var movie = document.getElementById("tagMovie").value;
	var tagChar = document.getElementById("tagChar").value;
	var tagColor = document.getElementById("tagColor").value;
	var tagNote = document.getElementById("tagNote").value;

	var tagAllTickers = GM_getValue("tagTickers", "");

	var tagWeeder = true; // ticker param. usually omitted, so tagWeeder will become false
	if (typeof ticker == "undefined") {
		var ticker = movie.substring(0,movie.indexOf('-')-1) + "      ";
		ticker = ticker.slice(0,7);
		tagWeeder = false; // false will by typical use
		// if NO ticker has been passed, extract from available info; may be a save or normal delete
		// if ticker HAS been passed, should also be mode = 'delete'; we are weeding an orphaned tag
		}

	var tickerIdx = tagAllTickers.indexOf(ticker);
	var setIdx = tickerIdx / 7 * 3 + 1; // this type of array starts at 1

	var splitCh = String.fromCharCode(255);
	var tagAllNotes = new Array();
	var tempStr = unescape(GM_getValue("tagNotes", ""));
	tagAllNotes = tempStr.split(splitCh);

	if(mode == "save" && tagChar != "" && tagChar != " ") { // new or edited; char must exist and be visible
		if ( !(tickerIdx > -1) ) { // add new tag
			tagAllTickers += ticker;
			GM_setValue("tagTickers", tagAllTickers);
			tagAllNotes.push(tagChar); tagAllNotes.push(tagColor); tagAllNotes.push(tagNote);
			}
		else { // modify existing tag; tickerIdx = 0,7,14; setIdx = 0,3,6
			tagAllNotes[setIdx] = tagChar;
			tagAllNotes[setIdx+1] = tagColor;
			tagAllNotes[setIdx+2] = tagNote;
			}
		refObjectTemp.textContent = tagChar;
		refObjectTemp.setAttribute("style","color:" + tagColor);
		refObjectTemp.title = tagNote;

		// save current values as defaults for next use
		GM_setValue("tagPrevChar", tagChar);
		GM_setValue("tagPrevColor", tagColor);
		GM_setValue("tagPrevNote", tagNote);

		}
	else if(mode == "delete") {
		var newAllTickers = "";
		if(tickerIdx > 0) newAllTickers = tagAllTickers.substring(0,tickerIdx);
		newAllTickers += tagAllTickers.substr(tickerIdx+7);
		GM_setValue("tagTickers", newAllTickers);
		tagAllNotes.splice(setIdx,3);

		if(tagWeeder == false) { // if weeding, there's nothing on screen to clear
			refObjectTemp.textContent = "!|!";
			refObjectTemp.setAttribute("style","color:" + GM_getValue("opt_grayTxt", "#999999"));
			refObjectTemp.title = "";
			}
		}

	// finalize and write the notes; tickers have already been written,above
	tempStr = tagAllNotes.join(splitCh);
	GM_setValue("tagNotes", escape(tempStr));
	GM_setValue("tagUsePrev", document.getElementById("tagUsePrev").checked);

	tagDiv.style.visibility = "hidden";
	}

//--- tagger panel

function showTagger() {
	var tagDiv = document.getElementById("tagPanel");
	var movie = refObjectTemp.getAttribute("movie");

	if(tagDiv.style.visibility == "hidden") {
		document.getElementById("tagMovie").value = movie;
		var ticker = movie.substring(0,movie.indexOf('-')-1);
		var tagData = readTag(ticker);

		var tagUsePrev = GM_getValue("tagUsePrev", false);
		document.getElementById("tagUsePrev").checked = tagUsePrev;

		if(tagData[0] == "" || tagUsePrev) { // new or checkbox; put values from last use
			document.getElementById("tagChar").value = GM_getValue("tagPrevChar", "&");
			document.getElementById("tagColor").value = GM_getValue("tagPrevColor", "blue");
			document.getElementById("tagNote").value = GM_getValue("tagPrevNote", "");
			if(tagData[0] == "") document.getElementById("tagDelete").disabled = true;
			else document.getElementById("tagDelete").disabled = false;
			}
		else { // use what we read for edit
			document.getElementById("tagChar").value = tagData[0];
			document.getElementById("tagColor").value = tagData[1];
			document.getElementById("tagNote").value = tagData[2];
			document.getElementById("tagDelete").disabled = false;
			}
		centerThis("tagPanel");
        tagDiv.style.visibility = "visible";
		document.getElementById("tagNote").focus();
		}
	}

//--- manage read/write of settings from the options panel

function optShowHide() {

	var optDiv = document.getElementById("optionsPanel");
	if(optDiv.style.visibility == "hidden") { // then read
		document.getElementById("optnav").checked = GM_getValue("optnav", true);

		if(GM_getValue("optarrowmode", "change") == "trend")
			{ document.getElementById("optarrow3").checked = true; }
		else document.getElementById("optarrow4").checked = true;

		if(GM_getValue("optmjump", "top") == "top")
			{ document.getElementById("optmjump1").checked = true; }
		else document.getElementById("optmjump2").checked = true;
		
		document.getElementById("pmQtyAt").value = GM_getValue("pmQtyAt", "75k");
		document.getElementById("pmQtyBt").value = GM_getValue("pmQtyBt", "50k");
		document.getElementById("pmQtyCt").value = GM_getValue("pmQtyCt", "25k");
		document.getElementById("pmQtyAq").value = GM_getValue("pmQtyAq", "75000");
		document.getElementById("pmQtyBq").value = GM_getValue("pmQtyBq", "50000");
		document.getElementById("pmQtyCq").value = GM_getValue("pmQtyCq", "25000");
		document.getElementById("optpanelw").value = GM_getValue("optpanelw", "130");
		document.getElementById("optpanelh").value = GM_getValue("optpanelh", "420");
		document.getElementById("optpanelf").value = GM_getValue("optpanelf", "13");
		document.getElementById("optpgwidth").value = GM_getValue("optpgwidth", "900");
		centerThis("optionsPanel");
		optDiv.style.visibility = "visible";
		}
	else { // write
		GM_setValue("optnav",document.getElementById("optnav").checked);

		if(document.getElementById("optarrow3").checked == true)
			{ GM_setValue("optarrowmode","trend"); }
		else GM_setValue("optarrowmode","change");

		if(document.getElementById("optmjump1").checked == true)
			{ GM_setValue("optmjump","top"); }
		else GM_setValue("optmjump","MovieStocks");

		GM_setValue("pmQtyAt", document.getElementById("pmQtyAt").value);
		GM_setValue("pmQtyBt", document.getElementById("pmQtyBt").value);
		GM_setValue("pmQtyCt", document.getElementById("pmQtyCt").value);
		GM_setValue("pmQtyAq", document.getElementById("pmQtyAq").value);
		GM_setValue("pmQtyBq", document.getElementById("pmQtyBq").value);
		GM_setValue("pmQtyCq", document.getElementById("pmQtyCq").value);
		GM_setValue("optpanelw", document.getElementById("optpanelw").value);
		GM_setValue("optpanelh", document.getElementById("optpanelh").value);
		GM_setValue("optpanelf", document.getElementById("optpanelf").value);
		GM_setValue("optpgwidth", document.getElementById("optpgwidth").value);
		optDiv.style.visibility = "hidden";
		}
	}

//--- receive and place orders from sidepanel links, via event listener

function placeOrder(orderType) {

	if(refSymbol.value == "") return;
	if(refQuantity.value == "") refQuantity.value = "max";

	var buildURL = "https://www.hsx.com/trade/?symbol=" + refSymbol.value + "&shares=" + refQuantity.value + "&action=place+order" + "&tradeType=" + orderType;
	
	GM_xmlhttpRequest({
		method: 'GET',
		url: buildURL,
		onload: function(response) {
			var doc = document.createElement('div');
			doc.innerHTML = response.responseText;
			//GM_log(response.responseText);
			
			var h1 = doc.getElementsByTagName("h1");
			if(h1[0].textContent != "Trade Placed") {
				refTradeConfirm.innerHTML = "<p class='pmSize para1'><span style='color:" + GM_getValue('opt_redTxt','#E30000') + "; font-weight:bold'>Trade Failed!</span></p>";
				}
			else {
				refTradeConfirm.innerHTML = "<p class='pmSize para1'><strong>Submitted</strong><br><span style='font-size:80%'>" + refSymbol.value + ", " + refQuantity.value + ", " + orderType + "</span></p>";
			}
		}
	});		
}

//--- find first decimal in string; cut it and 2 places right, but preserve end

function stripDeci(str_in) {

	var str_out = str_in;
	var idx = str_in.indexOf('.');

	if(idx > -1) str_out = str_in.substring(0,idx) + str_in.substring(idx+3);
	return str_out;
	}

//--- remove commas, and possibly spaces

function numberClean(numStr) {
	var newStr = "";
	for(var i=0; i<numStr.length; i++) {
		if(numStr.charCodeAt(i) >= 48 && numStr.charCodeAt(i) <= 57) newStr += numStr.charAt(i);
		}
	return newStr;
	}

 //--- access correct LTD standings page for ranktip amount; called by onceDaily

function doRankTip() {
	var ranklink = document.getElementById("ranklink");
	var idx = ranklink.textContent.indexOf(':');
	var rank = numberClean(ranklink.textContent.substring(idx+1));
	var tiptext = "It's good to be the Queen!";
	var urlLTD = "https://www.hsx.com/leader/?type=ltd&page=" + parseInt((rank-2)/100);

	GM_xmlhttpRequest({
		method: 'GET',
		url: urlLTD,
		onload: function(response) {
			var doc = document.createElement('div');
			doc.innerHTML = response.responseText;

			if(rank > 1) {
				if((rank-1) % 100 == 0) { // current player and higher port are on different pages
					var findRow = document.evaluate("//table[@class='sortable']//tr", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
					var rowNode = findRow.snapshotItem(100);
					var higherPort = rowNode.childNodes[9].textContent;
					}
				else { // both on same page
					var findRank = document.evaluate("//table[@class='sortable']//td[ . = " + rank + "]", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
					var rankNode = findRank.snapshotItem(0);
					var higherPort = rankNode.parentNode.previousElementSibling.childNodes[9].textContent;
					}
				tiptext = "Next port to beat: H$" + higherPort;
				}
			ranklink.title = tiptext; // tooltip will show over Rank link
			GM_setValue("rankTipText",tiptext);
			}
		});
	}

//--- called after HSX reset, or by manual arrow reset

function onceDaily() {
	tagWeeder();
	doRankTip();
	GM_setValue("prevTickers", "");
	GM_setValue("prevPrices", "");
	}

//--- find document position of any object

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

//--- this section jump method avoids side-shift of existing anchors within table

function sectionJump(param) {
	var offseth = 0;
	var clienth = document.documentElement.clientHeight;
	switch(param) {
		case 1: // movies top
			var objpos = ObjectPosition(document.getElementById(GM_getValue("optmjump", "top"))); break;
		case 2: // bonds top
		case 5: // movies bottom
			var objpos = ObjectPosition(document.getElementById("StarBonds")); break;
		case 3: // derivitives top
		case 6: // bonds bottom
			var objpos = ObjectPosition(document.getElementById("Derivatives")); break;
		case 4:
		case 7:
			var objpos = ObjectPosition(document.getElementById("MovieFunds")); break;
		}
	if(param == 5 || param == 6 || param == 7) offseth = clienth + 12;
	scrollTo(pageXOffset,objpos[1]-12-offseth);
	}

//--- specific object event handlers, etc.

function putTicker(event) {
	refSymbol.value = event.target.textContent;
	holdStatus = event.target.getAttribute('alt');
	}

function hotkeysOff(event) { 
	hotkeysActive = false; 
	refObjectTemp = event.target; // used in keypress handler to see if Symbol box has focus
	}

function hotkeysOn() { hotkeysActive = true; }

function clearHoldStatus() {
	holdStatus = "";
	hotkeysActive = true;
	}

function getParam(tempstr) {
	var paren1 = tempstr.indexOf('(');
	var paren2 = tempstr.indexOf(')');
	return tempstr.substring(paren1+2,paren2-1);
	}

function ltrim(stringToTrim) {
	return stringToTrim.replace(/^\s+/,"");
}

//--- global event listeners allow working across scopes

document.addEventListener('keydown', function(e) {
	if(!e) e=window.event;
	var key = e.keyCode;
	var quash = false;

	if(url.indexOf('hsx.com/portfolio') > -1) {
		var tagPanelStyle = document.getElementById("tagPanel").style;
		if(key == 27 && tagPanelStyle.visibility == "visible")
			{ tagPanelStyle.visibility = "hidden"; quash=true; }

		if(key == 113) { // F2
			if (refNavbar.style.visibility == "hidden") {
				refNavbar.style.visibility = "visible";
				refMainDataDiv.style.top = "-45px";
				GM_setValue("optnav",true);
				}
			else {
				refNavbar.style.visibility = "hidden";
				refMainDataDiv.style.top = "-80px";
				GM_setValue("optnav",false);
				}
			quash=true;
			}
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
        else if(refObjectTemp.getAttribute('id') == "Symbol") { 
            refSymbol.value = refSymbol.value.toUpperCase();
            fetchBondInfoA(0, 0, "symbol"); 
            refSymbol.select();
            }
        }

	if(url.indexOf('hsx.com/portfolio') > -1) {

		if(hotkeysActive == false) return;

		var tagPanelStyle = document.getElementById("tagPanel").style;
		if(key == 13 && tagPanelStyle.visibility == "visible") { writeTag('save'); quash=true; }

		if(document.getElementById("optionsPanel").style.visibility == "visible" || tagPanelStyle.visibility == "visible") { return; }

		if(key == 44) { sectionJump(1); quash=true; } // < unshift
		if(key == 91) { sectionJump(2); quash=true; } // [
		if(key == 93) { sectionJump(6); quash=true; } // ]
		if(key == 61) { sectionJump(7); } // + unshift // w/FF4, quash killed zoom keys
        if(e.keyCode == 0 && e.which == 45) { sectionJump(3); } // - !insert
        if(e.keyCode == 0 && e.which == 46) { sectionJump(5); quash=true; } // > unshift !delete
		}

	if(quash == true) {
		e.stopPropagation();
		e.preventDefault();
		}
	}, true);

document.addEventListener('mouseup', function(event) {

	var calcDiv = document.getElementById("calcTip");
	// using zIndex value 103 to ID click-hold from click-clickable 203
	if (calcDiv.style.zIndex == "103") calcDiv.style.visibility = "hidden";
	mouseDown = false;
	}, true);

document.addEventListener('mousedown', function(event) {

	var tempstr = new String(event.target);
	if(tempstr.indexOf('4div') > -1) {
		refObjectTemp = event.target;
		showCalc(event.pageX, event.pageY);
		event.stopPropagation();
		event.preventDefault();
		}
	if(tempstr.indexOf('info') > -1) {
		refObjectTemp = event.target;
		showDescription(event.pageX, event.pageY);
		mouseDown = true;
		event.stopPropagation();
		event.preventDefault();
		}
	if(tempstr.indexOf('iday') > -1) {
		refObjectTemp = event.target;
		intraday();
		event.stopPropagation();
		event.preventDefault();
		}
	}, true);

document.addEventListener('click', function(event) {
	var tempstr = new String(event.target);
	var quash = false;

	if(tempstr.indexOf('putAmountPm') > -1) {
		var p = getParam(tempstr);
		if (p == "M") p = "max"
		else if (p == "75") p = GM_getValue("pmQtyAq", "75000")
		else if (p == "50") p = GM_getValue("pmQtyBq", "50000")
		else if (p == "25") p = GM_getValue("pmQtyCq", "25000")
		else p = "1"
		refQuantity.value = p;
		quash = true;
		}

	if(event.target.id == "tagOK")
		{ writeTag('save'); quash = true; }

	if(event.target.id == "tagDelete")
		{ writeTag('delete'); quash = true; }

	if(event.target.id == "tagCancel") {
		GM_setValue("tagUsePrev", document.getElementById("tagUsePrev").checked);
		document.getElementById("tagPanel").style.visibility = "hidden";
		quash = true;
		}

	if(event.target.id == "optButtonOKpm" || event.target == "javascript:optShowHide();")
		{ optShowHide(); quash = true; }

	if(event.target.id == "optButtonColors" || event.target.id == "colorOK") 
		{ colorShowHide(); quash = true; }

	if(event.target.id == "colorDefaults") 
		{ colorShowHide(); colorDefaults(); quash = true; }

	if(tempstr.indexOf('tagger') > -1)
		{ refObjectTemp = event.target; showTagger(); quash = true; }

	if(tempstr.indexOf('4div') > -1 || tempstr.indexOf('info') > -1 || tempstr.indexOf('iday') > -1)
		{ quash = true; } //kill here; handled in mousedown

	if(tempstr.indexOf('bondP') > -1) {
		// from bond owned in the port
		refObjectTemp = event.target;
		fetchBondInfoA(event.pageX, event.pageY, "inPort");
		quash = true;
		}

	if(tempstr.indexOf('bondS') > -1) { 
		// from symbol in the SBL box
        if (document.getElementById("calcTip").style.visibility == "hidden")
            { fetchBondInfoA(0, 0, "symbol"); }
        else document.getElementById("calcTip").style.visibility = "hidden";
		quash = true;
		}

	if(tempstr.indexOf('closeTipPm') > -1) { 
		document.getElementById("calcTip").style.visibility = "hidden";
		quash = true;
		}

	if(tempstr.indexOf('placeOrderPm') > -1) {
		refTradeConfirm.innerHTML = "";
		var tradetype = getParam(tempstr);
		placeOrder(tradetype);
		quash = true;
		}

	if(tempstr.indexOf('arrowReset') > -1) {
		onceDaily();
		alert('Arrows will reset on port refresh.');
		quash = true;
		}

	if(tempstr.indexOf('2clip') > -1) {
		if(tempstr.indexOf('movies') > -1) put2clipboard("sortable_MovieStocks");
		else put2clipboard("sortable_StarBonds");
		quash = true;
		}

	if(tempstr.indexOf('idMissingMovies') > -1) {
		idMissingMovies();
		quash = true;
		}

	if(tempstr.indexOf('sectionJump') > -1)
		{ sectionJump(parseInt(tempstr.substr(23,1))); quash = true; }

	if(quash == true) {
		//quash any further actions of events handled here
		event.stopPropagation();
		event.preventDefault();
		}

	}, true);

//--- main script block from this point
	
function HSXPortMonkey_Run() { 
	insertPickerCode();
	url = window.location.href; // get URL, determine whether port or trade page; save for later use

	var panelFontSize = GM_getValue("optpanelf", "13") + "px";
	var panelBG = GM_getValue("opt_panelBG","#F3F3F3");
	
	// revise HSX base styles
	GM_addStyle('#bodywrap {color:' + GM_getValue("opt_dataTxt","#444444") + '}' +
	'p {color:' + GM_getValue("opt_panelTxt","#444444") + '}' +
	'h1,h2,h4 {color:' + GM_getValue("opt_panelTxt","#444444") + '}' +
	'h3 {color:' + GM_getValue("opt_dataTxt","#444444") + '}' +
	'div.table_label p {color:' + GM_getValue("opt_grayTxt","#999999") + '}' +
	'div.whitebox_content {background:' + GM_getValue("opt_dataBG","#FFFFFF") + '}' +
	'body {background:' + GM_getValue("opt_pageBG","#FFFFFF") + '}' +
	'a, a:visited {color:' + GM_getValue("opt_regLnk","#3597B2") + '; text-decoration:none}' +
	'a:hover {color:' + GM_getValue("opt_regHov","#84B84B") + '}' +
	'table,col,tr {border-color: ' + GM_getValue("opt_grid","#DDDDDD") + '}' +
	'tr {border-top: solid 1px ' + GM_getValue("opt_grid","#DDDDDD") + '}' +
	'th {color: ' + GM_getValue("opt_colLab","#FFFFFF") + '}' +
	'thead {background-color: ' + GM_getValue("opt_colBG","#555555") + '}' +
    '.sorttable_sorted, .sorttable_sorted_reverse {background-color: #919191}' +
	'h2 {font-size:1.6em; margin-bottom:.7em}');
		
	if(GM_getValue("opt_cutGrad", false)) GM_addStyle('#bodywrap {background: url() #1A1A1A}');
	if(GM_getValue("opt_cutGrid", false)) GM_addStyle('table,col,tr {border:none}');
		
	// text & link colors
	GM_addStyle('.pmGray {color: ' + GM_getValue("opt_grayTxt","#999999") + '}' +
    '.pmBlack {color: ' + GM_getValue("opt_dataTxt","#444444") + '; font-weight: bold}' +
	'.pmRed {color: ' + GM_getValue("opt_redTxt","#E30000") + '; font-weight: bold; font-style: italic}' +
	'.pmGreen {color: ' + GM_getValue("opt_greenTxt","#038013") + '; font-weight: bold}' +
	'.jlink, .jlink:visited {color: ' + GM_getValue("opt_jumpLnk","#84B84B") + '}' +
	'.jlink:hover {color: ' + GM_getValue("opt_jumpHov","#3597B2") + '}' +
	'.plink, .plink:visited {color: ' + GM_getValue("opt_panLnk","#3597B2") + '}' +
	'.plink:hover {color: ' + GM_getValue("opt_panHov","#84B84B") + '}' +
	'.qlink, .qlink:visited {color: ' + GM_getValue("opt_qLnk","#3597B2") + '; display: block; text-align: center}' +
	'.qlink:hover {color: ' + GM_getValue("opt_qHov","#84B84B") + '}' +
	'a.pmbutton, a.pmbutton:visited {color: ' + GM_getValue("opt_butTxt","#3597B2") + '}' +
	'a.pmbutton:hover {color: ' + GM_getValue("opt_butHov","#84B84B") + '}' +
	'.tlink {color: ' + GM_getValue("opt_dataTxt","#444444") + '}' +
    '.tlink:hover {color:black}');
	
	// tables
	GM_addStyle('table.pmtrade td {border: 1px solid ' + panelBG + '; padding: 4px 3px 0;  text-align: center; font-family: sans-serif; font-size:' + panelFontSize + '; line-height: 1}');
	GM_addStyle('table.pmqty {border: 2px ridge silver; text-align:center; margin:0; padding: 0} table.pmqty td {background-color: ' + GM_getValue("opt_popQ","#FFF9E3") + '; text-align: center; font-family: sans-serif; font-size:' + panelFontSize + '; border: 1px solid ' + GM_getValue("opt_popQ","#FFF9E3") + '}');
	GM_addStyle('table.calc {border: 2px ridge #FBEDBB} table.calc td {background-color: ' + GM_getValue("opt_popQ","#FFF9E3") + '; border: 1px solid ' + GM_getValue("opt_popQ","#FFF9E3") + '; padding: 0 3px}');

	// buttons
	GM_addStyle('.pmbutton {font-family: sans-serif; border: 1px solid ' + GM_getValue("opt_buttonShd","#000066") + '; background: ' + GM_getValue("opt_button","#D4E4ED") + '; display: block; text-align: center; border-width : 0px 1px 1px 0px; padding: 3px} .pmbutton:hover {font-weight: normal; border: 1px solid ' + GM_getValue("opt_buttonShd","#000066") + '; background: ' + GM_getValue("opt_buttonHov","#EBFFE9") + '; border-width : 0px 1px 1px 0px} .pmbutton:active {border: 1px solid #DA0808; background: ' + GM_getValue("opt_buttonHov","#EBFFE9") + '; border-width : 0px 1px 1px 0px}');

	// misc.
	GM_addStyle('input.color {text-align: center; width: 6em; font-size: 1.1em; line-height:1; margin:0em; padding: 3px}' +
	'input.pmInput {color: ' + GM_getValue("opt_inTxt","#444444") + '; background: ' + GM_getValue("opt_inBG","#FFFFFF") + '; width:98%; font-size: 1em; line-height:1; margin:0em; padding: 0}' +
    'input.w3 {width:2.5em}' +
	'.pmSize {font-size:' + panelFontSize + '}' +
	'td.center,th.center {text-align: center}' +
	'p.para1 {line-height:115%; margin-bottom: .7em}');
	
	// Firefox 3.5+ every other line in different color
	GM_addStyle('table.sortable > tbody > tr:nth-child(2n) {background-color:' + GM_getValue("opt_stripe","#EBFFE9") + '}');

	// overall width
	var oaWidth = GM_getValue("optpgwidth", "900");
	GM_addStyle('div.column.twelve,div.columns.twelve { width: ' + oaWidth + 'px ! important} ' +
	'div#container,div.container { width: ' + oaWidth + 'px ! important} ' +
	'div#navigation { width: ' + oaWidth + 'px ! important} ' +
	'div#navigation form#search-form {right: ' + (oaWidth<971?10:oaWidth-970+10) + 'px ! important} '); // search bar placement

	// tweak column widths
	GM_addStyle("table col.symbol { width:85px ! important} \
				table col.quantity_held { width:95px ! important} \
				table col.trade_transaction_type_id { width:20px ! important} \
				table col.avg_price_paid { width:119px ! important} \
				table col.price { width:123px ! important} \
				table col.price_change { width:115px ! important} \
				table col.pct_price_change { width:20px ! important} \
				table col.tot_worth { width:150px ! important} \
				table col.worth_change { width:150px ! important} \
				table col.pct_worth_change { width:70px ! important} \
				table col.trade_button { width:20px ! important}"); // had been 930 total

	//--- make new add-in panel for portfolio info and trading

	var networth = document.getElementById("net-worth").firstChild.nextSibling.textContent;
	var cash = document.getElementById("cash-on-hand").firstChild.textContent;
	var findtodaychange = document.evaluate("//span[@class='label']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var todaychange = findtodaychange.snapshotItem(0).nextSibling.nextSibling.textContent;

	var todaySpan = stripDeci(todaychange);
	if(todaySpan.indexOf('-') > -1) todaySpan = "<span style='color:" + GM_getValue('opt_redTxt','#E30000') + "'>" + todaySpan + "</span>";

	var findrankspan = document.evaluate("//span[@class='rank']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var ranklink = findrankspan.snapshotItem(0).firstChild;
	ranklink.setAttribute("id","ranklink"); // for later access
    ranklink.setAttribute("class","plink");
	ranklink.setAttribute("title",GM_getValue("rankTipText", ""));
	var rankspan = findrankspan.snapshotItem(0).innerHTML;
	var idx = rankspan.indexOf(')');
	rankspan = rankspan.substring(0,idx+1) + "<br>" + rankspan.substring(idx+4);

	var tradeDiv = document.createElement("div");
	var tradeDivHtml = "<div style='padding:0 0 0 4px'><h2>My Portfolio</h2>" + "<p class='pmSize para1'><strong>Net Worth:</strong><br>" + stripDeci(networth) + "<p class='pmSize para1'><strong>Cash:</strong><br>" + stripDeci(cash) +

	"<p class='pmSize para1'><strong>Today:</strong><br>" + todaySpan + " <a href='javascript:optShowHide();' class='plink' title='Set options'>" + String.fromCharCode(9829) + "</a>" +

	"<p class='pmSize' style='line-height:115%; margin-bottom: .6em'>" + rankspan + "<br><a href='/leader/watchlist.php' class='plink'>Watchlist</a> - <a href='/portfolio/chart.php' class='plink'>Chart</a></div>" +

	"<table class=pmtrade><tr><td align=right><a href='javascript:bondS;' class='plink'>SBL:</a></td><td><input class='pmInput' type=text id=Symbol maxlength=8 onfocus='this.select();' onblur='this.value = this.value.toUpperCase();' /></td></tr>" +

	"<tr><td align=right style='color:" + GM_getValue("opt_panelTxt","#444444") + "'>QTY:</td><td><input type=text class='pmInput' id=Quantity maxlength=6 onfocus='this.select();' onblur='this.value = this.value.toLowerCase(); if(this.value != \"max\" && !(parseInt(this.value)>0)) this.value=\"\";' /></td></tr><tr><td colspan=2 style='padding-bottom: 3px'></td></tr><tr><td rowspan=4 valign=top>" +

	"<table class=pmqty><tr><td><a href='javascript:putAmountPm(\"M\");' class=qlink>Max</a></td></tr><tr><td><a href='javascript:putAmountPm(\"75\");' class=qlink>" + GM_getValue("pmQtyAt","75k") + "</a></td></tr><tr><td><a href='javascript:putAmountPm(\"50\");' class=qlink>" + GM_getValue("pmQtyBt","50k") + "</a></td></tr><tr><td><a href='javascript:putAmountPm(\"25\");' class=qlink>" + GM_getValue("pmQtyCt","25k") + "</a></td></tr><tr><td style='padding-bottom: 3px'><a href='javascript:putAmountPm(\"R\");' class=qlink>1</a></td></tr></table>" +

	"</td><td><a href='javascript:placeOrderPm(\"buy\");' class=pmbutton>Buy</a></td></tr><tr><td><a href='javascript:placeOrderPm(\"sell\");' class=pmbutton>Sell</a></td></tr><tr><td><a href='javascript:placeOrderPm(\"short\");' class=pmbutton>Short</a></td></tr><tr><td><a href='javascript:placeOrderPm(\"cover\");' class=pmbutton>Cover</a></td></tr></table>" +
	
	"<div id=TradeConfirm style='padding:0 0 0 4px; margin-top:-.8em; font-size:" + panelFontSize + "'></div>";

	tradeDiv.innerHTML = tradeDivHtml;
	tradeDiv.id = "tradePanel";
	tradeDiv.style.position = "fixed";
	tradeDiv.style.top = "111px";
	tradeDiv.style.backgroundColor = panelBG;
	tradeDiv.style.padding = "7px 5px";
	tradeDiv.style.height = GM_getValue("optpanelh", "420") + "px";
	tradeDiv.style.width = GM_getValue("optpanelw", "130") + "px";
	tradeDiv.style.zIndex = "101";
	tradeDiv.style.borderWidth = "1px";
	tradeDiv.style.borderStyle = "solid";
	tradeDiv.style.borderColor = GM_getValue("opt_cutBrd", false)?panelBG:"#151515";

	//--- make new add-in panel for top-left links

	var topDiv = document.createElement("div");
	topDiv.innerHTML = "<p class='pmSize' style='line-height:155%; margin-bottom: 1em'><a href='javascript:sectionJump(1);' class='jlink' title='Keyboard shortcuts: < or > (unshifted) to top/bottom'>Moviestocks</a><br><a href='javascript:sectionJump(2);' class='jlink' title='Keyboard shortcuts: [ or ] to top/bottom'>Starbonds</a><br><a href='javascript:sectionJump(3);' class='jlink' title='Keyboard shortcuts: - or + (unshifted) to top/bottom'>Derivatives</a><br><a href='javascript:sectionJump(4);' class='jlink'>Movie Funds</a>";

	topDiv.id = "topLinkPanel";
	topDiv.style.position = "fixed";
	topDiv.style.padding = "10px";
	topDiv.style.height = "92px";
	topDiv.style.width = parseInt(tradeDiv.style.width) - 8 + "px";
	topDiv.style.zIndex = "102";
	topDiv.style.backgroundColor = panelBG;
	if(GM_getValue("opt_cutJlogo", false)) document.getElementById("top").style.left = "-148px";
    else topDiv.style.background = "url(/images/logo.jpg)";

	//--- make new add-in panel for Port Monkey options

	var optDiv = document.createElement("div");
	var optDivHtml = "<p><b><u>OPTIONS</u> - <a href='https://greasyfork.org/en/scripts/24422-hsx-port-monkey' class='plink' title='Port Monkey homepage' target='_new'>Port Monkey</a></b> by EdZep" +

	"<p>Show HSX nav bar: <input id='optnav' type='checkbox' /> (use keyboard F2 for live toggle)<br>" +

	"Arrow mode: <input id='optarrow3' name='optarrowmode' type='radio' /> <a href='javascript:;' class='plink' title='A trend arrow remains until price movement changes direction' onclick='document.getElementById(\"optarrow3\").checked = true;'>trend</a>&nbsp;&nbsp; <input id='optarrow4' name='optarrowmode' type='radio' /> <a href='javascript:;' class='plink' title='A change arrow shows only if a price has changed since the last reload' onclick='document.getElementById(\"optarrow4\").checked = true;'>change</a><br>" +

	"Movietsocks jump link / hotkey: <input id='optmjump1' name='optmjump' type='radio' /> to page top&nbsp;&nbsp; <input id='optmjump2' name='optmjump' type='radio' /> to section start</p>" +

	"<p style='margin-bottom:-.6em'>Custom quantities (button text): <input id='pmQtyAt' type='text' maxlength='3' class=w3 />&nbsp;&nbsp;<input id='pmQtyBt' type='text' maxlength='3' class=w3 />&nbsp;&nbsp;<input id='pmQtyCt' type='text' maxlength='3' class=w3 /> from top, after Max<br>" +

	"Custom quantities (amounts): <input id='pmQtyAq' type='text' maxlength='5' style='width:3.5em' />&nbsp;&nbsp;<input id='pmQtyBq' type='text' maxlength='5' style='width:3.5em' />&nbsp;&nbsp;<input id='pmQtyCq' type='text' maxlength='5' style='width:3.5em' /> (no commas)<br>" +

	"Sidepanel width: <input id='optpanelw' type='text' maxlength='3' class=w3 />&nbsp;&nbsp; height: <input id='optpanelh' type='text' maxlength='3' class=w3 />&nbsp;&nbsp; font size: <input id='optpanelf' type='text' maxlength='2' style='width:2em' /> (all in pixels)<br>" +

	"Overall content width: <input id='optpgwidth' type='text' maxlength='4' class=w3 /> px</p>" +

    "<hr><p style='margin-top:-.1em; margin-bottom:0'>Most changes occur on port refresh<p style='margin-top:.4em; margin-bottom:0'><input id='optButtonOKpm' type='button' value='      OK      ' />";
	optDivHtml += " <input id='optButtonColors' type='button' value=' Color Styler ' />"; 

	optDiv.innerHTML = optDivHtml;
	optDiv.id = "optionsPanel";
	optDiv.style.position = "fixed";
	optDiv.style.visibility = "hidden";
	optDiv.style.backgroundColor = panelBG;
	optDiv.style.padding = "10px";
	optDiv.style.zIndex = "103";
	optDiv.style.borderWidth = "5px";
	optDiv.style.borderStyle = "ridge";
	optDiv.style.borderColor = "gray";

	//--- make new add-in panel for tagger

	var tagDiv = document.createElement("div");
	tagDiv.innerHTML = "<p><b><u>TAGGER</u></b><form style='margin-bottom:1.2em'><p>Security: <input id='tagMovie' type='text' disabled='disabled' style='width:23em' /><br>Tag character: <input id='tagChar' onblur='document.getElementById(\"tagNote\").focus();' type='text' maxlength='1' onfocus='this.select()' style='width:1.5em' />&nbsp;&nbsp; " +

	"Tag color: <select id='tagColor' onchange='document.getElementById(\"tagNote\").focus();'><option>Black</option>.<option>Red</option><option>Purple</option><option>Magenta</option><option>Green</option><option>Lime</option><option>Blue</option><option>Turquoise</option></select><br>" +

	"<p style='line-height:190%; margin-top:-.8em; margin-bottom:-.6em'>Tooltip note:<br><input id='tagNote' type='text' onfocus='this.select()' maxlength='60' style='width:28em' />" +

	"<p style='margin-top:-.3em; margin-bottom:-.1em'>For edits, last values entered override existing: <input id='tagUsePrev' type='checkbox' /> <a href='javascript:;' class='plink' onclick='document.getElementById(\"tagUsePrev\").checked = !document.getElementById(\"tagUsePrev\").checked' title='OK, Cancel or Delete will save this setting.'>note</a></form>" +

	"<hr><p style='margin-top:.8em; margin-bottom:0'><input id='tagOK' type='button' value='      OK      ' /> <input id='tagCancel' type='button' value=' Cancel ' /> <input id='tagDelete' type='button' value=' Delete ' /></p>";

	tagDiv.id = "tagPanel";
	tagDiv.style.position = "fixed";
	tagDiv.style.visibility = "hidden";
	tagDiv.style.backgroundColor = panelBG;
	tagDiv.style.padding = "10px";
	tagDiv.style.zIndex = "103";
	tagDiv.style.borderWidth = "5px";
	tagDiv.style.borderStyle = "ridge";
	tagDiv.style.borderColor = "gray";

	//--- div panel for calculation pseudo-tooltip

	var calcDiv = document.createElement("div");
	calcDiv.id = "calcTip";
	calcDiv.style.position = "absolute";
	calcDiv.style.zIndex = "103";
	calcDiv.style.visibility = "hidden";

	//--- div panel for color picker

	var colorDiv = document.createElement("div");
	colorDiv.innerHTML = "<p><b><u>COLOR STYLER</u></b> - Click and pick!</p><div><div style='float:left'><p style='line-height:115%'>" +
	"<input id='opt_pageBG' type='text' value='" + GM_getValue("opt_pageBG", "#FFFFFF") + "' class='color' /> Page background<br>" +
	"<input id='opt_panelBG' type='text' value='" + GM_getValue("opt_panelBG", "#F3F3F3") + "' class='color' /> Panel background<br>" +
	"<input id='opt_dataBG' type='text' value='" + GM_getValue("opt_dataBG", "#FFFFFF") + "' class='color' /> Data background<br>" +
	"<input id='opt_panelTxt' type='text' value='" + GM_getValue("opt_panelTxt", "#444444") + "' class='color' /> Panel text<br>" +
	"<input id='opt_dataTxt' type='text' value='" + GM_getValue("opt_dataTxt", "#444444") + "' class='color' /> Data text<br>" +
	"<input id='opt_grayTxt' type='text' value='" + GM_getValue("opt_grayTxt", "#999999") + "' class='color' /> Data accent text<br>" +
	"<input id='opt_greenTxt' type='text' value='" + GM_getValue("opt_greenTxt", "#038013") + "' class='color' /> Positive text<br>" +
	"<input id='opt_redTxt' type='text' value='" + GM_getValue("opt_redTxt", "#E30000") + "' class='color' /> Negative text<br>" +
	"<input id='opt_colBG' type='text' value='" + GM_getValue("opt_colBG", "#555555") + "' class='color' /> Column header<br>" +
	"<input id='opt_colLab' type='text' value='" + GM_getValue("opt_colLab", "#FFFFFF") + "' class='color' /> Column label<br>" +
	"<input id='opt_grid' type='text' value='" + GM_getValue("opt_grid", "#DDDDDD") + "' class='color' /> Data grid<br>" +
	"<input id='opt_stripe' type='text' value='" + GM_getValue("opt_stripe", "#EBFFE9") + "' class='color' /> Data stripe<br>" +
	"<input id='opt_inBG' type='text' value='" + GM_getValue("opt_inBG", "#FFFFFF") + "' class='color' /> Input background<br>" +
	"<input id='opt_inTxt' type='text' value='" + GM_getValue("opt_inTxt", "#444444") + "' class='color' /> Input text" +
    
    "</p></div><div style='float:right; padding:0 0 0 18px'><p style='line-height:115%'>" +
	"<input id='opt_regLnk' type='text' value='" + GM_getValue("opt_regLnk", "#3597B2") + "' class='color' /> Data links<br>" +
	"<input id='opt_regHov' type='text' value='" + GM_getValue("opt_regHov", "#84B84B") + "' class='color' /> Data hover<br>" +
	"<input id='opt_jumpLnk' type='text' value='" + GM_getValue("opt_jumpLnk", "#84B84B") + "' class='color' /> Jump links<br>" +
	"<input id='opt_jumpHov' type='text' value='" + GM_getValue("opt_jumpHov", "#3597B2") + "' class='color' /> Jump hover<br>" +
	"<input id='opt_panLnk' type='text' value='" + GM_getValue("opt_panLnk", "#3597B2") + "' class='color' /> Panel links<br>" +
	"<input id='opt_panHov' type='text' value='" + GM_getValue("opt_panHov", "#84B84B") + "' class='color' /> Panel hover<br>" +
	"<input id='opt_qLnk' type='text' value='" + GM_getValue("opt_qLnk", "#3597B2") + "' class='color' /> Quick-pick links<br>" +
	"<input id='opt_qHov' type='text' value='" + GM_getValue("opt_qHov", "#84B84B") + "' class='color' /> Quick-pick hover<br>" +
	"<input id='opt_butTxt' type='text' value='" + GM_getValue("opt_butTxt", "#3597B2") + "' class='color' /> Button text<br>" +
	"<input id='opt_butHov' type='text' value='" + GM_getValue("opt_butHov", "#84B84B") + "' class='color' /> Button text hover<br>" +
	"<input id='opt_button' type='text' value='" + GM_getValue("opt_button", "#D4E4ED") + "' class='color' /> Button face<br>" +
	"<input id='opt_buttonHov' type='text' value='" + GM_getValue("opt_buttonHov", "#EBFFE9") + "' class='color' /> Button face hover<br>" +
	"<input id='opt_buttonShd' type='text' value='" + GM_getValue("opt_buttonShd", "#000066") + "' class='color' /> Button shadow<br>" +
	"<input id='opt_popQ' type='text' value='" + GM_getValue("opt_popQ", "#FFF9E3") + "' class='color' /> Pop-up/Q-pick BG" +
	"</p></div></div>" +
	"<p><input id='opt_cutCorn' type='checkbox' /> Remove rounded white corners&nbsp;&nbsp; <input id='opt_cutGrid' type='checkbox' /> Remove data grid<br><input id='opt_cutGrad' type='checkbox' /> Remove gray gradient&nbsp;&nbsp; <input id='opt_cutBrd' type='checkbox' /> Remove panel border<br><input id='opt_cutJlogo' type='checkbox' /> Match jump link BG to panel&nbsp;&nbsp; <input id='opt_cutPx' type='checkbox' /> Shift data 4px left</p><hr><input id='colorOK' type='button' value='      OK      ' /> <input type='button' onclick='document.getElementById(\"colorPanel\").style.left=\"-1000px\"' value=' Cancel ' /><input style='float:right' id='colorDefaults' type='button' value=' Default Colors ' />";

	colorDiv.id = "colorPanel";
	colorDiv.style.position = "fixed";
	colorDiv.style.left = "-1000px";
	colorDiv.style.backgroundColor = panelBG;
	colorDiv.style.padding = "10px";
	colorDiv.style.zIndex = "103";
	colorDiv.style.borderWidth = "5px";
	colorDiv.style.borderStyle = "ridge";
	colorDiv.style.borderColor = "gray";

	//--- place new panels into HTML

	var item = document.getElementsByTagName("body")[0];
	item.insertBefore(topDiv, item.firstChild);
	item.insertBefore(tradeDiv, item.firstChild);
	item.insertBefore(optDiv, item.firstChild);
	item.insertBefore(tagDiv, item.firstChild);
	item.insertBefore(calcDiv, item.firstChild);
	item.insertBefore(colorDiv, item.firstChild);

	//--- store global references to trade inputs, etc. for later use

	refSymbol = document.getElementById("Symbol");
	refSymbol.addEventListener("focus", hotkeysOff, false);
	refSymbol.addEventListener("blur", clearHoldStatus, false);
	refQuantity = document.getElementById("Quantity");
	refQuantity.addEventListener("focus", hotkeysOff, false);
	refQuantity.addEventListener("blur", hotkeysOn, false);
	refTradeConfirm = document.getElementById("TradeConfirm");

	//--- reformat page features

	// adjust width, and move content to leave space at left
	var bodywrapstyle = document.getElementById("bodywrap").style;
	bodywrapstyle.width = parseInt(oaWidth) + 8 + "px";
	bodywrapstyle.left = parseInt(tradeDiv.style.width) + (GM_getValue("opt_cutPx", false)?8:12) + "px";

	// put time display and see if it's time to clear trend arrows
	var findTime = document.getElementsByTagName("dt");
	var hsxTime = findTime[1].textContent;
	var item = document.getElementById("account-actions");
	item.setAttribute("style","color: dimgray");
	item.innerHTML = item.innerHTML + "<br>" + hsxTime;
	var cutItem = item.parentNode.childNodes[5]; // WHO YOU OWN slogan, to remove
	try { cutItem.parentNode.removeChild(cutItem); }
	catch(err) {}

	var idx = hsxTime.indexOf(':');
	var newTime = hsxTime.substr(idx+2,2) + hsxTime.substr(idx+5,2);
	lastRefresh = GM_getValue("lastRefresh", "0000");
	if(newTime < lastRefresh) onceDaily(); //reset actions
	GM_setValue("lastRefresh", newTime);

	// delete original top panels, jump links
	var cutpanel = document.getElementById("announce_bar");
	try { cutpanel.parentNode.removeChild(cutpanel); }
	catch(err) {}

	var findpanel = document.evaluate("//div[@class='four columns']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var cutpanel0 = findpanel.snapshotItem(0);
	var cutpanel1 = findpanel.snapshotItem(1);
	var cutpanel2 = findpanel.snapshotItem(1).nextSibling.nextSibling;
	cutpanel0.parentNode.removeChild(cutpanel0);
	cutpanel1.parentNode.removeChild(cutpanel1);
	cutpanel2.parentNode.removeChild(cutpanel2);

	findpanel = document.evaluate("//div[@class='column-row secondary_nav']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	cutpanel = findpanel.snapshotItem(0);
	cutpanel.parentNode.removeChild(cutpanel);

	findpanel = document.evaluate("//p[@class='top']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for(var i=0; i<findpanel.snapshotLength; i++) {
		cutpanel = findpanel.snapshotItem(i);
		cutpanel.parentNode.removeChild(cutpanel);
		}

	// remove rounded corners; needed to allow non-white data backgrounds
	if(GM_getValue("opt_cutCorn", false)) {
		findpanel = document.evaluate("//div[@class='whitebox_start']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		cutpanel = findpanel.snapshotItem(0);
		cutpanel.parentNode.removeChild(cutpanel);
		findpanel = document.evaluate("//div[@class='whitebox_stop']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		cutpanel = findpanel.snapshotItem(0);
		cutpanel.parentNode.removeChild(cutpanel);
		findpanel = document.evaluate("//div[@class='whitebox_content']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		findpanel.snapshotItem(0).style.padding = "10px 10px 5px";
		}
		
	// use/not use nav bar, and adjust vertical position of main data panel
	refNavbar = document.getElementById("navigation"); // global reference for later use
	findpanel = document.evaluate("//div[@class='column-row']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	refMainDataDiv = findpanel.snapshotItem(1); // global reference for later use

	if(GM_getValue("optnav", true) == true) refMainDataDiv.style.top = "-45px";
	else {
		refNavbar.style.visibility = "hidden";
		refMainDataDiv.style.top = "-80px";
		}

	// tidy up section summary info
	findInfo = document.evaluate("//span[@class='summary_shares']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	for(var i=0; i<findInfo.snapshotLength; i++)
		{
		var item1 = findInfo.snapshotItem(i);
		var item2 = item1.nextSibling.nextSibling;
		var item3 = item2.nextSibling.nextSibling;
		var item0 = item1.parentNode.firstChild.nextSibling;

		item3.removeAttribute("class");
		item3.textContent = "Gain: " + stripDeci(item3.textContent);
		item3.setAttribute("style","position: absolute; left: 330px");
		var linkyText = '';
		
		// before moving stuff, get positions counts, for use in main loop, stocks not owned, etc.
		var pText = item0.textContent;
		positions[i] = parseInt(pText.substr(0,pText.indexOf(' ')));	
		
		if (i == 0) {
			var item4 = item3.nextSibling.nextSibling;
			item4.removeAttribute("class");
			item4.setAttribute("style","position: absolute; right: 0px");
			item4.firstChild.textContent = "Sort: ";
			
			linkyText = "<b><a href='javascript:movies2clip();' title='Copy Moviestock holdings to clipboard'>" + String.fromCharCode(8623) + "</a> <a href='javascript:idMissingMovies();' title='List Moviestocks not owned'>" + String.fromCharCode(8800) + "</a><a href='javascript:arrowReset();' title='Reset arrows'>" + String.fromCharCode(9650) + "</a> |</b> ";
		}

		if (i == 1) {
			linkyText = "<b><a href='javascript:bonds2clip();' title='Copy Starbond holdings to clipboard'>" + String.fromCharCode(8623) + "</a> |</b> ";
		}
		
		item0.innerHTML = linkyText + item0.innerHTML + " <b>|</b> " + item3.innerHTML;
		item3.parentNode.removeChild(item3);
		item2.parentNode.removeChild(item2);
		item1.parentNode.removeChild(item1);
		}

	// add missing column dividers
	var findtables = document.evaluate("//table[@class='sortable']//colgroup", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var item = "", nodeToday = "", nodeGain = "", nodeGainPct = "";

	for(var i=0; i<findtables.snapshotLength; i++)
		{
        try { // potential problem in some browsers
            item = findtables.snapshotItem(i);
            nodeToday = item.childNodes[10];
            nodeGain = item.childNodes[16];
            nodeGainPct = item.childNodes[18];
            nodeToday.removeAttribute("style");
            nodeGain.removeAttribute("style");
            if (i==0) nodeGainPct.removeAttribute("style");
            }
        catch(err) {}
		}

	// tweak table headings
	var findtables = document.evaluate("//th[@class='sorttable_alpha']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var item = "", pNode = "";
	//var nodeShares = "", nodeCurrent = "",  nodeValue = "";
	var  nodeHeld = "", nodePaid = "",  nodeToday = "";
	var nodeTodayPct = "", nodeGain = "", nodeGainPct = "", nodeButton = "";

	for(var i=0; i<findtables.snapshotLength; i++)
		{
		item = findtables.snapshotItem(i);
		pNode = item.parentNode;

		//nodeShares = pNode.childNodes[3];
		nodeHeld = pNode.childNodes[5];
		nodePaid = pNode.childNodes[7];
		//nodeCurrent = pNode.childNodes[9];
		nodeToday = pNode.childNodes[11];
		nodeTodayPct = pNode.childNodes[13];
		//nodeValue = pNode.childNodes[15];
		nodeGain = pNode.childNodes[17];
		nodeGainPct = pNode.childNodes[19];
		nodeButton = pNode.childNodes[21];

		nodeHeld.textContent = "&"; //String.fromCharCode(8727); //notes 9834, 9835; asterisks 8727, 10033
		nodeHeld.setAttribute("class","center");
		nodeHeld.setAttribute("title", "Tags (semi-sortable if page has been reloaded since tag entry)");
		nodePaid.textContent = "Paid";
		nodeToday.textContent = "Today";
		nodeTodayPct.textContent = String.fromCharCode(9650); //up-arrow
		nodeTodayPct.setAttribute("title", "Price movement arrows (not sortable)");
		nodeGain.textContent = "Gain / Loss";
		nodeGainPct.textContent = String.fromCharCode(177); //plus-minus

		nodeButton.setAttribute("class","center");
		if (i==0) {
			nodeButton.textContent = String.fromCharCode(9733); //star
			nodeButton.setAttribute("title", "Phase (not sortable)"); //916, delta
			}
		}

	//--- tweak data for every single security

	var findsecurities = document.evaluate("//div[@class='twelve columns last']//a[contains(@href,'security/view')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var item = "", ppNode = "", held = "", nodePaid = "";
	var nodeShares = "", nodeHeld = "", nodeCurrent = "", nodeToday = "";
	var nodeTodayPct = "", nodeValue = "", nodeGain = "", nodeGainPct = "", nodeButton = "";

	var tagChar = "", tagColor = ""; tagNote = ""; ititle = "";
	var lightGray = GM_getValue("opt_grayTxt", "#999999");
	var tagAllTickers = GM_getValue("tagTickers", "");
	var arrowmode = GM_getValue("optarrowmode", "change");
	var ticker = "", price = "", paddedTicker = "";
	var allTickersNew = "", allPricesNew = "";
	var allTickersOld = GM_getValue("prevTickers", "---"); // get trend info
	var allPricesOld = GM_getValue("prevPrices", "---");

	// pre-format trend arrows
	var pkgarrowup = "<span class='pmGreen'>" + String.fromCharCode(9650) + "</span>"; 
	var pkgarrowdown = "<span class='pmRed'>" + String.fromCharCode(9660) + "</span>";

	// bigass loop; main impact on speed is here
	for(var i=0; i<findsecurities.snapshotLength; i++)
		{
		item = findsecurities.snapshotItem(i);
		ppNode = item.parentNode.parentNode;

		nodeShares = ppNode.childNodes[3];
		nodeHeld = ppNode.childNodes[5];
		nodePaid = ppNode.childNodes[7];
		nodeCurrent = ppNode.childNodes[9];
		nodeToday = ppNode.childNodes[11];
		nodeTodayPct = ppNode.childNodes[13];
		nodeValue = ppNode.childNodes[15];
		nodeGain = ppNode.childNodes[17];
		nodeGainPct = ppNode.childNodes[19];
		nodeButton = ppNode.childNodes[21];

		ticker = item.textContent;
		ititle = item.title; //used for tagger and phase
		item.addEventListener("mouseover", putTicker, false);
		held = nodeHeld.textContent;

		if (held == "short") { nodeShares.innerHTML = "<span style='display:none;'>-</span><span class='pmRed'>" + nodeShares.textContent + "</span>"; }
		else { nodeShares.innerHTML = "<span class='pmGreen'>" + nodeShares.textContent + "</span>"; }

		var gainToday = nodeToday.textContent;

        var todayColor = "tlink";
		if (nodeToday.firstChild.getAttribute("class") == "down")
			{ 
            nodeToday.innerHTML = "<span class='pmRed'>-" + gainToday + "</span>"; 
            todayColor = "pmRed";
            }
		else if (gainToday.substring(2) > 0)
			{ 
            nodeToday.innerHTML = "<span class='pmGreen'>" + gainToday + "</span>"; 
            todayColor = "pmGreen";
            }
		else nodeToday.innerHTML = gainToday;

		nodeHeld.removeAttribute("style");
		nodeHeld.setAttribute("class","center");

		nodePaid.innerHTML = "<a href='javascript:info;' alt='" + ticker + "' class='tlink'>" + nodePaid.textContent + "</a>";

		// processes that only occur for movie section
		if(i < positions[0]) {
			var phase = ititle.charAt(ititle.lastIndexOf('(') + 1);
			nodeButton.innerHTML = phase;
            nodeButton.setAttribute("class","pmGray center"); // phase color default
			if (phase == 'C') {
				nodeButton.setAttribute("class","pmRed center");
				nodeButton.setAttribute("style","font-style:normal");
				}
			if (phase == 'D') nodeButton.setAttribute("class","pmBlack center");
			if (phase == 'P') nodeButton.setAttribute("class","pmGreen center");
            ititle = ititle.substring(0,ititle.lastIndexOf('(')-1); //shortened, for tagger
			nodeCurrent.innerHTML = "<a href='javascript:4div;' alt='" + ticker + "' class='tlink'>" + nodeCurrent.textContent + "</a>";
			nodeToday.innerHTML = "<a href='javascript:iday;' alt='" + ticker + "' class='" + todayColor + "'>" + nodeToday.textContent + "</a>";
			}
		else nodeButton.innerHTML = ""; //remove trade button on lower sections

		// processes that only occur for starbonds
		if(i >= positions[0] && i < positions[0] + positions[1]) {
			nodeCurrent.innerHTML = "<a href='javascript:bondP;' alt='" + ticker + "' class='tlink'>" + nodeCurrent.textContent + "</a>";
			}

		// put tags in place
		tagChar = "!|!";
		tagColor = lightGray;
		tagNote = "";

		paddedTicker = ticker + "      ";
		paddedTicker = paddedTicker.slice(0,7); // also used below, for arrow read

		if(tagAllTickers.indexOf(paddedTicker) > -1) { // this is ticker pre-scan
			var tagInfo = readTag(ticker); // switch back to all function call by removing condition around this
			if(tagInfo[0] != "") {
				tagChar = tagInfo[0];
				tagColor = tagInfo[1];
				tagNote = tagInfo[2];
				}
			}

		nodeHeld.innerHTML = "<a href='javascript:tagger;' style='color:" + tagColor + "' title='" + tagNote + "' movie='"  + ticker + " - " + ititle +  "'>" + tagChar + "</a>";

		nodeValue.textContent = stripDeci(nodeValue.textContent);

		// format gain/loss and percent data
		var gaintext = stripDeci(nodeGain.textContent);

		if (nodeGainPct.textContent.indexOf('-') > -1)
			{ nodeGain.innerHTML = "<span class='pmRed'>-H$" + gaintext + "</span>"; }
		else if (parseInt(gaintext) > 0)
			{ nodeGain.innerHTML = "<span class='pmGreen'>H$" + gaintext + "</span>"; }
		else nodeGain.innerHTML = "H$" + gaintext;

		var gainPct = nodeGainPct.textContent;
		nodeGainPct.innerHTML = gainPct.substring(1,gainPct.length-5) + "%";

		// trend arrows
		price = nodeCurrent.textContent.slice(2);
		var indicator = " ";
		var tickerIdx = allTickersOld.indexOf(paddedTicker);
		if (tickerIdx > -1) {
			var oldPrice = parseFloat(allPricesOld.substr(tickerIdx,6));
			if(arrowmode == "trend") indicator = allPricesOld.substr(tickerIdx + 6,1);

			if (price > oldPrice) indicator = "^";
			if (price < oldPrice) indicator = "v";
			}

		if (indicator == "v") nodeTodayPct.innerHTML = pkgarrowdown;
		else if (indicator == "^") nodeTodayPct.innerHTML = pkgarrowup;
		else nodeTodayPct.textContent = "";

		allTickersNew += paddedTicker;
		price = price + "    ";
		price = price.slice(0,6) + indicator;
		allPricesNew += price;
		}

	// save trend info after loop concludes
	GM_setValue("prevTickers", allTickersNew);
	GM_setValue("prevPrices", allPricesNew);
}

HSXPortMonkey_Run();

})();
// End
