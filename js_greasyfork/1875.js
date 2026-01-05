// ==UserScript==
// @name         dA - dATitleCleaner
// @namespace    http://hoffer.cx
// @description  Sets a standard "dA: something" title for all deviantART pages
// @include      http://deviantart.com/*
// @include      https://deviantart.com/*
// @include      http://*.deviantart.com/*
// @include      https://*.deviantart.com/*
// @include      http://sta.sh/*
// @include      https://sta.sh/*
// @grant        none
// @version      1.1
// @downloadURL https://update.greasyfork.org/scripts/1875/dA%20-%20dATitleCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/1875/dA%20-%20dATitleCleaner.meta.js
// ==/UserScript==

/*
	by: http://rotane.deviantart.com/
	deviation page: http://fav.me/d1l0kdw
	contact: dATitleCleaner@hoffer.cx
	licence: Licensed under the GNU General Public License, version 2 (but no later version!)

	This script replaces most titles to a coherent "dA: something" format, 
	excluding pages on dAmn (I suggest using dAmn.extend for that).
	Feel free to contact me if you find any pages I missed!

	version history:
	v1.0		2017.05.29 - modified the script for the updated "xxx | DeviantArt" scheme
	v0.9		2017.01.14 - modified the script for the new "DeviantArt" spelling
	v0.8		2014.10.02 - added new front pages (Activity Feed, etc) and a few other fixes
	v0.7		2008.08.26 - added Activity, Gallery Stats, Pageviews
	v0.6		2008.08.23 - updated for dA v6
	v0.4		2006.09.21 - added Browse and deviant's journal sub-pages
	v0.3		2006.09.04 - added deviant's prints and store pages
	v0.2		2006.09.04 - initial release
	v0.1		2006.08.20 - private testing
	
	todo:
	gallery management
*/

t = document.title;
u = window.location.href;

if	(t.indexOf("\'s Forums") > 1) {
	document.title = t.substring(12);
	document.title = 'dA: ' + document.title.replace("\'s Forums", ": Forums");
}

else if	(u.indexOf('.deviantart.com\/prints\/') > 1 && u.substr(0,7) == 'http:\/\/') {
	document.title = u.substring(7);
	document.title = 'dA: ' + document.title.replace(".deviantart.com\/prints\/", ": Prints");
}

else if	(u.indexOf('.deviantart.com\/store\/') > 1 && u.substr(0,7) == 'http:\/\/') {
	document.title = u.substring(7);
	document.title = 'dA: ' + document.title.replace(".deviantart.com\/store\/", ": Store");
}

else if (t.indexOf('on DeviantArt') > 1) {
	document.title = 'dA: ' + t.replace(' on DeviantArt', '');
}

else if (t.indexOf(' - DeviantArt') > 1) {
	document.title = 'dA: ' + t.replace(' - DeviantArt', '');
}

else if (t.indexOf(' | DeviantArt') > 1) {
	document.title = 'dA: ' + t.replace(' | DeviantArt', '');
}

else if (t.indexOf("\'s DeviantArt gallery") > 1) {
	document.title = 'dA: ' + t.replace("\'s DeviantArt gallery", ": Gallery");
}

else if (t.indexOf("\'s DeviantArt Gallery") > 1) {
	document.title = 'dA: ' + t.replace("\'s DeviantArt Gallery", ": Gallery");
}

else if (t.indexOf("\'s DeviantArt favourites") > 1) {
	document.title = 'dA: ' + t.replace("\'s DeviantArt favourites", ": Favourites");
}

else if (t.indexOf("\'s DeviantArt Favourites") > 1) {
	document.title = 'dA: ' + t.replace("\'s DeviantArt Favourites", ": Favourites");
}

else if (t.indexOf("\'s DeviantArt Journal") > 1) {
	document.title = 'dA: ' + t.replace("\'s DeviantArt Journal", ": Journal");
}

else if (t.indexOf("\'s Journal") > 1) {
	x = t.replace("\'s Journal", ": Journal");
	document.title = x.replace("DeviantArt", "dA");
}

else if (t.indexOf("\'s DeviantArt Forum") > 1) {
	document.title = 'dA: ' + t.replace("\'s DeviantArt Forum", ": Forum");
}

else if (t.indexOf("\'s Activity") > 1) {
	document.title = 'dA: ' + t.replace("\'s Activity", ": Activity");
}

else if (t.indexOf("\'s Pageviews") > 1) {
	x = t.replace("\'s Pageviews", ": Pageviews");
	document.title = x.replace("deviantART", "dA");
}

else if (t.indexOf("\'s Gallery Stats") > 1) {
	x = t.replace("\'s Gallery Stats", ": Gallery Stats");
	document.title = x.replace("DeviantArt", "dA");
}

else if (t.indexOf("\'s Polls") > 1) {
	x = t.replace("\'s Polls", ": Polls");
	document.title = x.replace("DeviantArt", "dA");
}

else if	(t.indexOf('News: ') == 0) {
	document.title = 'dA: News: ' + t.substring(6);
}

else if (t.indexOf('Browse DeviantArt') == 0) {
	document.title = t.replace('Browse DeviantArt', 'dA: Browse');
}

else if (t.indexOf('Browsing DeviantArt') == 0) {
	document.title = t.replace('Browsing DeviantArt', 'dA: Browse');
}

else if (t.indexOf('Your Journal') == 0) {
	document.title = t.replace('Your Journal', 'dA: Journal');
}

else if (t.indexOf('Your Journal Enhancements') == 0) {
	document.title = t.replace('Your Journal Enhancements', 'dA: Journal Enhancements');
}

else if (t.indexOf('Favourites for ') == 0) {
	document.title = t.replace('Favourites for ', 'dA: ') + ': Favourites';
}

else if	(t.indexOf('DeviantArt: ') == 0) {
	document.title = 'dA: ' + t.substring(12);
}

else if	(t.indexOf('DeviantArt : ') == 0) {
	document.title = 'dA: ' + t.substring(13);
}

else if	(t.indexOf('DeviantArt - ') == 0) {
	document.title = 'dA: ' + t.substring(13);
}

else if (t.indexOf('DeviantArt ') == 0) {
	document.title = 'dA: ' + t.substring(11);
}

else {
	document.title = 'dA: ' + t;
}