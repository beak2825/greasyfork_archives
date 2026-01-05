// ==UserScript==
// @name Total_Ignore Delicious
// @author Arris
// @description	This script is designed to completly eradicate from sight the worst posters on Fitmisc.com
// @include	http://fitmisc.com/*
// @version 1.0.0
// @namespace https://greasyfork.org/users/2931
// @downloadURL https://update.greasyfork.org/scripts/2714/Total_Ignore%20Delicious.user.js
// @updateURL https://update.greasyfork.org/scripts/2714/Total_Ignore%20Delicious.meta.js
// ==/UserScript==

function canIgnore(sUser) {
	if( sUser.match(/Delicious/i) )
		return true;
	return false; 
}

function setIgnoreThread() {
	var a; var s;
	
	a=document.evaluate(
    "//div[starts-with(@class, 'inner')]",
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
    "//div[starts-with(@class, 'userinfo')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
	for (var i=0; i<a.snapshotLength; i++) {
		s=a.snapshotItem(i).innerHTML;
		if( canIgnore(s) ) {
			//a.snapshotItem(i).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            a.snapshotItem(i).parentNode.parentNode.innerHTML = '';
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