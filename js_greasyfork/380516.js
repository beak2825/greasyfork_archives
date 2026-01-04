// ==UserScript==
// @name          Add missing FAVICON (png)- USERSTYLES - 
// @description   Add missing favicon for userstyles Forum  [from "CH CrowdSource-OneSpace Favicon" : http://www.mturkgrind.com/threads/clickhappiers-userscripts-and-modifications.23532/page-6]
// @version       1.2
// @author        decembre
// @namespace     decembre
// @include       https://forum.userstyles.org/*
// @require       http://code.jquery.com/jquery-latest.min.js
// @grant         GM_log

// favicons Userstyles from:
// https://forum.userstyles.org/discussion/28375/need-some-graphics

// [GM fork from clickhappier : CH CrowdSource-OneSpace Favicon] : 
// http://www.mturkgrind.com/threads/clickhappiers-userscripts-and-modifications.23532/page-6
// Replaces OneSpace favicon with a nicer-looking version.

// @downloadURL https://update.greasyfork.org/scripts/380516/Add%20missing%20FAVICON%20%28png%29-%20USERSTYLES%20-.user.js
// @updateURL https://update.greasyfork.org/scripts/380516/Add%20missing%20FAVICON%20%28png%29-%20USERSTYLES%20-.meta.js
// ==/UserScript==

// CrowdSource rebranded themselves as OneSpace on 11/17/2015. Their new favicon
// for both the work platform and their forums is an orange box with a white logo.
// I'm not particularly fond of it, and want the work platform to have a different
// favicon than the forum to better distinguish my tabs, so I made this userscript
// (based on my favicon userscript for MTurk) to switch it to a better logo version.
//
// Adapted from 'RTM Favicon Redesigned' by Tyler Sticka circa 2009-2010: http://userscripts-mirror.org/scripts/show/42247

// create the favicon element
var faviconElem = document.createElement('link');
faviconElem.rel = 'shortcut icon';
faviconElem.type = 'image/x-icon';
// 64-bit text-encoded copy of improved favicon file's data (created from https://work.onespace.com/static/work-station/img/svg/logo_footer.svg ):
faviconElem.href = 'https://forum.userstyles.org/uploads/FileUpload/11/2751.png';

// add this favicon to the head
headElem = document.getElementsByTagName('head')[0];
headElem.appendChild(faviconElem);

// remove any existing favicons
var headLinks = headElem.getElementsByTagName('link');
for (var i=0; i < headLinks.length; i++) 
{
	if ( headLinks[i].href == faviconElem.href ) 
	{
	    return;
	}
	if ( headLinks[i].rel == "shortcut icon" || headLinks[i].rel == "icon" )
	{
	    headElem.removeChild(headLinks[i]);
	}
}

// force browser to acknowledge change
var shim = document.createElement('iframe');
shim.width = shim.height = 0;
document.body.appendChild(shim);
shim.src = "icon";
document.body.removeChild(shim);
