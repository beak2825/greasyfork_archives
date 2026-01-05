/*==================================================================================*\
|  Nosy - GreaseMonkey Script for Hollywood Stock Exchange                           |
|      (c) 2016 by Eduardo Zepeda                                                    |
|  When reading inner messages on the forums, reports the message writer's gain or   |
|  loss for the day, as a tooltip over the username, or as a pop-up, via clickable   |
|  links on leaderboards, watchlists and leagues. Frienemy display option shows      |
|  gains for the day, for up to 3 players, on most HSX pages.                        |
\*==================================================================================*/

// ==UserScript==
// @name           HSX Nosy
// @namespace      edzep.scripts
// @version        1.2.3
// @author         EdZep at HSX
// @description    Reports day's gain/loss of other players; hover profile link, or click ?
// @include        http*://*hsx.com/*
// @exclude        http*://*hsx.com/portfolio/*
// @exclude        http*://*hsx.com/profile/*
// @exclude        http*://*hsx.com/trade/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAALHRFWHRDcmVhdGlvbiBUaW1lAFN1biAxMCBBcHIgMjAxMSAxMToyNTo1OCAtMDUwMF3oDl8AAAAHdElNRQfbBAsOKR27crm1AAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC/xhBQAAAA9QTFRF////AAAAAAD///8AgAAADJhXAAAAAAF0Uk5TAEDm2GYAAAC5SURBVHjajZNBFsQgCENN9f5nnhFBE+hry6YVvhFEGl6s4Xq0AO72MgD0YotYwIz7tvjCCQNsNcwQP8OJCVCcACf+QMT5CAe6lRlxzi+AfgAp42xghUieBRZAOQ5kAasiASzAZe4jWMAvStIUAblJ1BJ2L04hLrBS12aVXuARkG5eOP3u1G0C2t2DaQIUAgoUAtPHQCJgLgGEwPIoQATckYBNINZ8D/xeeHTS6O1xKKN3CCTHh+F9sR+bJgggaRbXggAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/24428/HSX%20Nosy.user.js
// @updateURL https://update.greasyfork.org/scripts/24428/HSX%20Nosy.meta.js
// ==/UserScript==

// Start

(function() {

var announceBarRef = "";
var announceBarLink = "<a href='javascript:nView();' class='nLink'>?</a>&nbsp;&nbsp;&nbsp;";
var announceBarNormal = "";
var announceBarModified = "To see gain/loss of others here, enter IDs and/or refresh the page. Or, wait...";
var nosyViewState = 0;

function doNosyId1(allIDs) {

    GM_xmlhttpRequest({
        method: 'GET',
        url: "https://www.hsx.com/profile/index.php?uname=" + allIDs[0],
        onload: function(response) {

            var doc = document.createElement('div');
            doc.innerHTML = response.responseText;

            var findLabels = document.evaluate("//td[@class='label']", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            var netWorthTemp = findLabels.snapshotItem(1).nextSibling.textContent;
            var rank = findLabels.snapshotItem(2).nextSibling.textContent;

            var netWorth = parseInt(netWorthTemp.substring(2,netWorthTemp.length-3).replace(/\,/g,''));
            rank = rank.substring(0,rank.indexOf(' ')).replace(/\,/g,'');

            var rankPage = parseInt(rank / 100);
            if(rank % 100 == 0) rankPage--;

            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://www.hsx.com/leader/?type=ltd&page=" + rankPage,
                onload: function(response) {
                    var doc = document.createElement('div');
                    doc.innerHTML = response.responseText;

                    var findRank = document.evaluate("//table[@class='sortable']//td[ . = " + rank + "]", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                    var rankNode = findRank.snapshotItem(0);
                    var resetWorth = parseInt(rankNode.parentNode.childNodes[9].textContent.replace(/\,/g,''));

                    var sstyle = "<span class='nGreen'>";
                    var change = netWorth - resetWorth;
                    if(resetWorth > netWorth) {
                        sstyle = "<span class='nRed'>-";
                        change = resetWorth - netWorth;
                        }

					announceBarModified = "<span class='aText'>" + allIDs[0] + ": </span>" + sstyle + "H$" + numberFormat(change) + "</span>&nbsp;&nbsp;&nbsp;";
					nosyView(false);

					if(allIDs.length > 1) doNosyId2(allIDs);
                    }
                });
            }
        });
	}

function doNosyId2(allIDs) {

    GM_xmlhttpRequest({
        method: 'GET',
        url: "https://www.hsx.com/profile/index.php?uname=" + allIDs[1],
        onload: function(response) {

            var doc = document.createElement('div');
            doc.innerHTML = response.responseText;

            var findLabels = document.evaluate("//td[@class='label']", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            var netWorthTemp = findLabels.snapshotItem(1).nextSibling.textContent;
            var rank = findLabels.snapshotItem(2).nextSibling.textContent;

            var netWorth = parseInt(netWorthTemp.substring(2,netWorthTemp.length-3).replace(/\,/g,''));
            rank = rank.substring(0,rank.indexOf(' ')).replace(/\,/g,'');

            var rankPage = parseInt(rank / 100);
            if(rank % 100 == 0) rankPage--;

            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://www.hsx.com/leader/?type=ltd&page=" + rankPage,
                onload: function(response) {
                    var doc = document.createElement('div');
                    doc.innerHTML = response.responseText;

                    var findRank = document.evaluate("//table[@class='sortable']//td[ . = " + rank + "]", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                    var rankNode = findRank.snapshotItem(0);
                    var resetWorth = parseInt(rankNode.parentNode.childNodes[9].textContent.replace(/\,/g,''));

                    var sstyle = "<span class='nGreen'>";
                    var change = netWorth - resetWorth;
                    if(resetWorth > netWorth) {
                        sstyle = "<span class='nRed'>-";
                        change = resetWorth - netWorth;
                        }

					announceBarModified += "<span class='aText'>" + allIDs[1] + ": </span>" + sstyle + "H$" + numberFormat(change) + "</span>&nbsp;&nbsp;&nbsp;";
					nosyView(false);

					if(allIDs.length > 2) doNosyId3(allIDs);
                    }
                });
            }
        });
    }

function doNosyId3(allIDs) {

    GM_xmlhttpRequest({
        method: 'GET',
        url: "https://www.hsx.com/profile/index.php?uname=" + allIDs[2],
        onload: function(response) {

            var doc = document.createElement('div');
            doc.innerHTML = response.responseText;

            var findLabels = document.evaluate("//td[@class='label']", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            var netWorthTemp = findLabels.snapshotItem(1).nextSibling.textContent;
            var rank = findLabels.snapshotItem(2).nextSibling.textContent;

            var netWorth = parseInt(netWorthTemp.substring(2,netWorthTemp.length-3).replace(/\,/g,''));
            rank = rank.substring(0,rank.indexOf(' ')).replace(/\,/g,'');

            var rankPage = parseInt(rank / 100);
            if(rank % 100 == 0) rankPage--;

            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://www.hsx.com/leader/?type=ltd&page=" + rankPage,
                onload: function(response) {
                    var doc = document.createElement('div');
                    doc.innerHTML = response.responseText;

                    var findRank = document.evaluate("//table[@class='sortable']//td[ . = " + rank + "]", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                    var rankNode = findRank.snapshotItem(0);
                    var resetWorth = parseInt(rankNode.parentNode.childNodes[9].textContent.replace(/\,/g,''));

                    var sstyle = "<span class='nGreen'>";
                    var change = netWorth - resetWorth;
                    if(resetWorth > netWorth) {
                        sstyle = "<span class='nRed'>-";
                        change = resetWorth - netWorth;
                        }

					announceBarModified += "<span class='aText'>" + allIDs[2] + ": </span>" + sstyle + "H$" + numberFormat(change) + "</span>";
					nosyView(false);
                    }
                });
            }
        });
    }

function getInfo(profileLink,asTooltip,x,y) {

    GM_xmlhttpRequest({
        method: 'GET',
        url: profileLink,
        onload: function(response) {
            var doc = document.createElement('div');
            doc.innerHTML = response.responseText;

            var findName = document.evaluate("//div[@class='security_data']//h1", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var userName = findName.snapshotItem(0).textContent;

            var findLabels = document.evaluate("//td[@class='label']", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            var netWorthTemp = findLabels.snapshotItem(1).nextSibling.textContent;
            var rank = findLabels.snapshotItem(2).nextSibling.textContent;

            var netWorth = parseInt(netWorthTemp.substring(2,netWorthTemp.length-3).replace(/\,/g,''));
            rank = rank.substring(0,rank.indexOf(' ')).replace(/\,/g,'');
            if(rank == "-") {
                if(asTooltip) profileLink.setAttribute("title", "Sorry, this port is unranked");
                else {
                    var message = "<table class='calc'><tr><td>Sorry, this port is unranked.</td><td><a href='javascript:closeTip();' style='display:block; text-align:right'> X </a></td></tr></table>";
                    displayTip(message,x,y);
                    }
                return;
                }

            var rankPage = parseInt(rank / 100);
            if(rank % 100 == 0) rankPage--;

            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://www.hsx.com/leader/?type=ltd&page=" + rankPage,
                onload: function(response) {
                    var doc = document.createElement('div');
                    doc.innerHTML = response.responseText;

                    var findRank = document.evaluate("//table[@class='sortable']//td[ . = " + rank + "]", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                    var rankNode = findRank.snapshotItem(0);
                    var resetWorth = parseInt(rankNode.parentNode.childNodes[9].textContent.replace(/\,/g,''));

                    var status = "gain";
                    var sstyle = "<span style='color:#038013; font-weight:bold'>";
                    var change = netWorth - resetWorth;
                    if(resetWorth > netWorth) {
                        status = "loss";
                        sstyle = "<span style='color:#E30000; font-weight:bold'>";
                        change = resetWorth - netWorth;
                        }

                    var message = "Port rank: " + rank + ". Port value: H$" + numberFormat(netWorth) + ". Today's " + status + ": H$" + numberFormat(change);

                    if(asTooltip) profileLink.setAttribute("title", message);
                    else {
                        message = "<table class='calc'><tr><td style='font-weight:bold'>" + userName + "</td><td><a href='javascript:closeTip();' style='display:block; text-align:right'>X </a></td></tr><tr><td colspan=2>Port rank: " + rank + "</td></tr>";
                        message += "<tr><td colspan=2>Port value: H$" + numberFormat(netWorth) + "</td></tr>";
                        message += "<tr><td colspan=2>Today's " + sstyle + status + "</span>: H$" + numberFormat(change) + "</td></tr></table>";
                        displayTip(message,x,y);
                        }
                    }
                });
            }
        });
    }

// display info popup

function displayTip(newHTML,clickX,clickY) {
	var popDiv = document.getElementById("popTip");
	popDiv.innerHTML = newHTML;

	popDiv.style.top = clickY + 15 + "px";
	popDiv.style.left = clickX + 25 + "px";

	//keep popup display from appearing below screen edge
	var divHeight = popDiv.offsetHeight;
	var pageBottom = window.innerHeight + window.scrollY;

	if (parseInt(popDiv.style.top) > pageBottom - divHeight + 25)
		{ popDiv.style.top = pageBottom - divHeight + 25 + "px"; }
	popDiv.style.visibility = "visible";
	}

// Function from Netlobo.com
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
    }

// Function from Netlobo.com formats numbers with commas
function numberFormat(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1))
	x1 = x1.replace(rgx, '$1' + ',' + '$2');
	return x1 + x2;
	}

function getParam(tempstr) {
	var paren1 = tempstr.indexOf('(');
	var paren2 = tempstr.indexOf(')');
	return tempstr.substring(paren1+2,paren2-1);
	}

function createNosyDisplay(savedIDlist) {
	var allIDs = new Array();
	allIDs = savedIDlist.split(',');

	if(GM_getValue("nosyShowIDlistView", false) == true) {
		nosyViewState = 1;
		if(allIDs.length > 0) {
			var startIdx = 0;
			if(allIDs.length > 3) {
				startIdx = GM_getValue("nosyRotateIdx", 0);
				if(startIdx > allIDs.length - 3) startIdx = 0;
				GM_setValue("nosyRotateIdx", startIdx+1);
				}
			doNosyId1(allIDs.slice(startIdx));
			}
		}
	nosyView(false);
	}

function nosyView(cycle) {
	if(cycle) {
		if(nosyViewState == 2) { nosyInputShowHide(); return; }
		nosyViewState++;
		if(nosyViewState > 2) nosyViewState = 0;
		}
	if(nosyViewState == 0) {
		GM_setValue("nosyShowIDlistView", false);
		announceBarRef.innerHTML = announceBarLink + announceBarNormal;
		}
	else if(nosyViewState == 1) {
		GM_setValue("nosyShowIDlistView", true);
		announceBarRef.innerHTML = announceBarLink + announceBarModified;
		}
	else if(nosyViewState == 2) nosyInputShowHide();
	}

function nosyInputShowHide() {
	var idVisible = document.getElementById("idPanel");
	var idUsers = document.getElementById("idUsers");

	if(idVisible.style.visibility == "visible") {
		idVisible.style.visibility = "hidden";
		if(idUsers.value.length > 0) GM_setValue("nosyIDlist", idUsers.value);
		announceBarRef.innerHTML = announceBarLink + "Any changes will be reflected on refresh";
		GM_setValue("nosyShowIDlistView", true);
		nosyViewState = 3;
		}
	else {
		idVisible.style.visibility = "visible";
		idUsers.value = GM_getValue("nosyIDlist", "");
		idUsers.focus();
		}
	}

document.addEventListener('click', function(event) {
	var tempstr = new String(event.target);
	var quash = false;

	if(tempstr.indexOf('nosy') > -1) {
        var profileLink = getParam(tempstr);
        getInfo(profileLink, false, event.pageX, event.pageY);
		quash = true;
        }
	if(tempstr.indexOf('closeTip') > -1) {
		document.getElementById("popTip").style.visibility = "hidden";
		quash = true;
		}
	if(tempstr.indexOf('nView') > -1) {
		nosyView(true);
		quash = true;
		}
	if(event.target.id == "inputOK") {
		nosyInputShowHide();
		quash = true;
		}
	if(quash == true) {
		//quash any further actions of events handled here
		event.stopPropagation();
		event.preventDefault();
		}
	}, true);

function HSXNosy_Run(){
	if (window != window.top) return; // prevent run in IFRAME - forum text box

	GM_addStyle('table.calc {border: 2px ridge #FBEDBB} table.calc td {background-color: #FFF9E3; border: 1px solid #FFF9E3; padding: 0 3px}');

	GM_addStyle('.nRed {color: red; font-weight: bold} .nGreen {color: #51B84D; font-weight: bold}');
	GM_addStyle('.aText {color: white} .nLink, .nLink:visited {color: #03CFF4 !important; font-style: italic; font-weight: bold; text-decoration: none} .nLink:hover {color: white !important}');

    var findProfileLink = document.evaluate("//a[contains(@href,'/profile/')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    var url = window.location.href; // get URL, determine whether forum page
    if(url.indexOf('hsx.com/forum') > -1 && url.indexOf('pid=') > -1) {
        var profileLink = findProfileLink.snapshotItem(findProfileLink.snapshotLength-1);
        getInfo(profileLink, true,0,0);
        }
    else {
        for(var i=0; i<findProfileLink.snapshotLength; i++)
            {
            var profileLink = findProfileLink.snapshotItem(i);
            // create new ? link
            var nosyLink = document.createElement("a");
            var spaceNode = document.createTextNode(" ");
            nosyLink.href = "javascript:nosy('" + profileLink + "');";
            nosyLink.title = "Nosy?";
            nosyLink.appendChild(document.createTextNode("?"));
            nosyLink.style.cssText = "color:navy; font-weight:bold; font-style:italic;";
            insertAfter(profileLink,spaceNode);
            insertAfter(spaceNode,nosyLink);
            }
        }
	// div panel for info popup
	var popDiv = document.createElement("div");
	popDiv.id = "popTip";
	popDiv.style.visibility = "hidden";
    popDiv.style.color = "444444";
	popDiv.style.zIndex = "103";
	popDiv.style.width = "auto";
	popDiv.style.position = "absolute";
	var item = document.getElementsByTagName("body")[0];
	item.insertBefore(popDiv, item.firstChild);

	//--- make new add-in panel for IDs

	var idDiv = document.createElement("div");
	idDiv.innerHTML = "<p style='margin-top:-.1em; margin-bottom:0'>Enter HSX user IDs, separated with commas (no spaces):<p style='margin-top:.4em; margin-bottom:-.5em'><input id='idUsers' type='text' style='width:28em' /> <input id='inputOK' type='button' value='    OK    ' />";

	idDiv.id = "idPanel";
	idDiv.style.position = "fixed";
	idDiv.style.visibility = "hidden";
	idDiv.style.backgroundColor = "lightgray";
	idDiv.style.padding = "10px";
	idDiv.style.top = "0px";
	idDiv.style.left = "50px";
	idDiv.style.width = "620px";
	idDiv.style.zIndex = "104";
	idDiv.style.borderWidth = "5px";
	idDiv.style.borderStyle = "ridge";
	idDiv.style.borderColor = "gray";

	//item = document.getElementsByTagName("body")[0];
	item.insertBefore(idDiv, item.firstChild);

	// get announcement bar, and prep it with ? link
	announceBarRef = document.getElementById("announce_bar");
	announceBarNormal = announceBarRef.innerHTML;
	announceBarRef.setAttribute("style","text-align: left");
	announceBarRef.innerHTML = announceBarLink + announceBarNormal;
	var savedIDlist = GM_getValue("nosyIDlist", "");
	if(savedIDlist.length > 0) createNosyDisplay(savedIDlist);
	}

HSXNosy_Run();

})();
// End
