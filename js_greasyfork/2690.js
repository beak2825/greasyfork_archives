// ==UserScript==
// @name Fitmisc_Total_Ignore
// @author Arris
// @description	This script is designed to completly eradicate from sight the worst posters on Fitmisc.com
// @include	http://fitmisc.com/*
// @namespace http://fitmisc.com/
// @version 0.9
// @downloadURL https://update.greasyfork.org/scripts/2690/Fitmisc_Total_Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/2690/Fitmisc_Total_Ignore.meta.js
// ==/UserScript==

function canIgnore(sUser) {
	if( sUser.match(/niko/i) )
		return true;
	if( sUser.match(/thesavagepony/i) )
		return true;
	if( sUser.match(/Lloyd Banks/i) )
		return true;
	if( sUser.match(/Lil B/i) )
		return true;
	if( sUser.match(/Round-Mound/i) )
		return true;
	return false; 
}

function setIgnoreThread() {
	var a; var s;
	
	a=document.evaluate(
    "//div[starts-with(@class, 'threadmeta')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
	for (var i=0; i<a.snapshotLength; i++) {
		s=a.snapshotItem(i).innerHTML;
		if( canIgnore(s) ) {
			//a.snapshotItem(i).parentNode.parentNode.parentNode.style.display = 'none';
			a.snapshotItem(i).parentNode.parentNode.parentNode.innerHTML = '';
		}
	}
}

function setIgnorePost() {
	var a; var s;
	
	a=document.evaluate(
    "//div[starts-with(@class, 'username_container')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
	for (var i=0; i<a.snapshotLength; i++) {
		s=a.snapshotItem(i).innerHTML;
		if( canIgnore(s) ) {
			//a.snapshotItem(i).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            a.snapshotItem(i).parentNode.parentNode.parentNode.innerHTML = '<li class="postbitlegacy postbitim postcontainer old" style="background:white;border-color:white;"></li>';
		}
	}
}

function setIgnoreQuote() {
	var a; var s;
	
	a=document.evaluate(
    "//div[starts-with(@class, 'bbcode_postedby')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
	for (var i=0; i<a.snapshotLength; i++) {
		s=a.snapshotItem(i).innerHTML;
		if( canIgnore(s) ) {
			//a.snapshotItem(i).parentNode.parentNode.parentNode.style.display = 'none';
			a.snapshotItem(i).parentNode.innerHTML = '';
		}
	}
}

if(window.opera) { //opera only
	(function(){
		document.addEventListener('DOMContentLoaded', function() {
			setIgnoreThread();
			setIgnorePost();
			setIgnoreQuote();
		}, false);
	})()
} else {
	setIgnoreThread();
	setIgnorePost();
	setIgnoreQuote();
}