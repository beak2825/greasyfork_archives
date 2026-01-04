// ==UserScript==
// @name           Gazelle Freeleech Browser
// @author         mewx, the_dunce
// @namespace      http://tampermonkey.net/
// @description    Inserts a freeleech link in main menu for Gazelle trackers. Torrents are grouped by default.
// @include        http*://*orpheus.network/*
// @include        http*://*redacted.ch/*
// @include        http*://*dicmusic.club/*
// @include        http*://*greatposterwall.com/*
// @include        http*://*gazellegames.net/*
// @include        http*://*awesome-hd.me/*
// @include        http*://*alpharatio.cc/*
// @include        http*://*lztr.me/*
// @version        1.2
// @grant          none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441790/Gazelle%20Freeleech%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/441790/Gazelle%20Freeleech%20Browser.meta.js
// ==/UserScript==

// Checking website.
var website = 'default';
var currentURL = '' + window.location;
if (currentURL.includes('greatposterwall')) {
    website = 'gpw';
}

function createFreeNode() {
	var a = document.createElement('a');
	a.innerHTML = 'Free';
	a.href = "torrents.php?freetorrent=1&group_results=1&action=advanced&searchsubmit=1";
    if (website == 'gpw') {
        a.className = 'HeaderNav-link';
    }

	var li = document.createElement('li');
    li.id = 'nav_free';
    if (website == 'gpw') {
        li.className = 'HeaderNavList-item';
    }
	li.appendChild(a);
	return li;
}

// Add new navigation button.
var target = null;
if (website == 'gpw') {
    target = document.getElementsByClassName('HeaderNav')[0].getElementsByTagName('ul')[0];
} else {
    target = document.getElementById('menu').getElementsByTagName('ul')[0];
}
target.appendChild(createFreeNode());
