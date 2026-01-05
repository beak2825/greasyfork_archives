// ==UserScript==
// @name           HSX Forum Styler
// @namespace      edzep.scripts
// @version        1.2.5
// @author         EdZep at HSX
// @description    Changes colors, sizes and page selector to make the forums more useable
// @include        http*://*hsx.com/forum/forum.php*
// @grant          GM_addStyle
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAALHRFWHRDcmVhdGlvbiBUaW1lAFN1biAxMCBBcHIgMjAxMSAxMToyNTo1OCAtMDUwMF3oDl8AAAAHdElNRQfbBAsOKR27crm1AAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC/xhBQAAAA9QTFRF////AAAAAAD///8AgAAADJhXAAAAAAF0Uk5TAEDm2GYAAAC5SURBVHjajZNBFsQgCENN9f5nnhFBE+hry6YVvhFEGl6s4Xq0AO72MgD0YotYwIz7tvjCCQNsNcwQP8OJCVCcACf+QMT5CAe6lRlxzi+AfgAp42xghUieBRZAOQ5kAasiASzAZe4jWMAvStIUAblJ1BJ2L04hLrBS12aVXuARkG5eOP3u1G0C2t2DaQIUAgoUAtPHQCJgLgGEwPIoQATckYBNINZ8D/xeeHTS6O1xKKN3CCTHh+F9sR+bJgggaRbXggAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/25228/HSX%20Forum%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/25228/HSX%20Forum%20Styler.meta.js
// ==/UserScript==

// Start

// Edit these to taste
var mainHeadColor = "blue";
var mainHeadSize = "14px";

var subHeadColor = "#075B17";
var subHeadSize = "14px";

var beenReadColor = "gray";
var beenReadSize = "14px";

var insideMsgColor = "black";
var insideMsgSize = "14px";

var currentHeadColor = "darkred";
var currentHeadSize = "14px";

var jumpLinkSize = "16px";

// Function from Netlobo.com
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
    }

(function() {
    var css = "";
    // main heading links
    css += "div#threads p.topic a{ font-size:" + mainHeadSize + " !important; color:" + mainHeadColor + " !important; }";
    // sub heading links
    css += "div#threads p a{ font-size:" + subHeadSize + " !important; color:" + subHeadColor + " !important; }";
    // threads that have been read
    css += "div#threads p a:visited{ font-size:" + beenReadSize + "!important; color:" + beenReadColor + " !important; }";
    // inside message text
    css += "div.post_message p { font-size:" + insideMsgSize + " !important; color:" + insideMsgColor + " !important; line-height:175% !important; }";
    // current item heading in thread list
    css += "div#threads p { font-size:" + currentHeadSize + " !important; color:" + currentHeadColor + " !important; }";        
    GM_addStyle(css);

	// re-do the page & forum links; lose the dropdown!
    var findDiv = document.evaluate("//div[@class='whitebox_content']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	cutItem = findDiv.snapshotItem(0).firstChild.nextSibling.nextSibling.nextSibling;
	cutItem.parentNode.removeChild(cutItem); //br
	cutItem = findDiv.snapshotItem(0).firstChild.nextSibling.nextSibling.nextSibling;
	cutItem.parentNode.removeChild(cutItem); //br

	findDiv = document.evaluate("//div[@id='forum-jump-links']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    
	if(window.location.href.indexOf('forum.php?id=1') < 0) {
        cutItem = findDiv.snapshotItem(0).firstChild.nextSibling.nextSibling.nextSibling.firstChild;
        cutItem.parentNode.removeChild(cutItem); //link to reply; NOT on announcements page
        }

    cutItem = findDiv.snapshotItem(0).firstChild.nextSibling.nextSibling.nextSibling.firstChild;
    cutItem.parentNode.removeChild(cutItem); //invisible or nbsp

    var changeItem = findDiv.snapshotItem(0).firstChild.nextSibling.nextSibling.nextSibling.firstChild;
    changeItem.textContent = "Forum Main Page";
	changeItem.setAttribute("style","font-size:" + jumpLinkSize);
    changeItem.removeAttribute("class");
    
    cutItem = changeItem.nextSibling.nextSibling;
	cutItem.parentNode.removeChild(cutItem); //view all forums

    cutItem = changeItem.parentNode.nextSibling.nextSibling;
	cutItem.parentNode.removeChild(cutItem); //dropdown list
    
    var newItem = document.createElement("span");
    newItem.setAttribute("style","float: right;font-size:" + jumpLinkSize);
    newItem.innerHTML = "<a href='http://www.hsx.com/forum/forum.php?id=1'>Announcements</a> | <a href='http://www.hsx.com/forum/forum.php?id=2'>Players</a> | <a href='http://www.hsx.com/forum/forum.php?id=3'>Movies</a> | <a href='http://www.hsx.com/forum/forum.php?id=4'>Stars</a> | <a href='http://www.hsx.com/forum/forum.php?id=5'>Life</a> | <a href='http://www.hsx.com/forum/forum.php?id=6'>Support</a>";
    insertAfter(changeItem,newItem);

	if(window.location.href.indexOf('forum.php?id=1') < 0) {
        newItem = document.createElement("span");
        newItem.innerHTML = " | <a href='#newpost'>Post / Reply</a>";
		newItem.setAttribute("style","font-size:" + jumpLinkSize);
        insertAfter(changeItem,newItem);
        }

})();

// End
