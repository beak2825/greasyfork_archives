// ==UserScript==
// @name			Full Screen KoC
// @namespace		PBP
// @description		Full Screen for Kingdoms of Camelot
// @icon			https://rycamelot1-a.akamaihd.net/fb/e2/src/img/items/70/363.jpg
// @include			*.rycamelot.com/*main_src.php*
// @include			*.beta.rycamelot.com/*main_src.php*
// @include			*apps.facebook.com/kingdomsofcamelot/*
// @include			*.rockyou.com/rya/*
// @include			*facebook.com/*dialog/feed*
// @include			*rycamelot.com/*acceptToken_src.php*
// @include			*rycamelot.com/*helpFriend_src.php*
// @include			*rycamelot.com/*claimVictoryToken_src.php*
// @include			*rycamelot.com/*merlinShare_src.php*
// @exclude 	    *sharethis*
// @connect			*
// @connect			greasyfork.org
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_deleteValue
// @grant			GM_listValues
// @grant			GM_addStyle
// @grant			GM_log
// @grant			GM_getResourceText
// @grant			GM_registerMenuCommand
// @grant			GM_xmlhttpRequest
// @grant			unsafeWindow
// @run-at			document-end
// @author          Twiries
// @license			http://creativecommons.org/licenses/by/4.0/
// @contributionURL	https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8VEDPV3X9X82L
// @version			1.2
// @releasenotes	<p>Full Screen</p>
// @downloadURL https://update.greasyfork.org/scripts/403415/Full%20Screen%20KoC.user.js
// @updateURL https://update.greasyfork.org/scripts/403415/Full%20Screen%20KoC.meta.js
// ==/UserScript==

var Version = '1';
var SourceName = "Full Screen";
var box1 = document.getElementsByClassName('xod5an3')[0];
var box = document.getElementsByClassName('x1cvmir6')[0];
var box3 = document.getElementsByClassName('xsgj6o6')[1];
var box2 = document.getElementsByClassName('xsgj6o6')[2];


box.style.display = 'none';
box1.style.display = 'none';
box2.style.display = 'none';
box3.style.display = 'none';