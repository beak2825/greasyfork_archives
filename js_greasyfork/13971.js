// ==UserScript==
// @name          CH CrowdSource-OneSpace Favicon
// @description   Replaces OneSpace favicon with a nicer-looking version.
// @version       1.0c
// @author        clickhappier
// @namespace     clickhappier
// @include       https://work.crowdsource.com/*
// @include       https://work.onespace.com/*
// @require       http://code.jquery.com/jquery-latest.min.js
// @grant         GM_log
// @downloadURL https://update.greasyfork.org/scripts/13971/CH%20CrowdSource-OneSpace%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/13971/CH%20CrowdSource-OneSpace%20Favicon.meta.js
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
faviconElem.href = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAD//////////////////////Pv2/+fjv//+/vz///////7+/P////7//////////////////////////////////////////////////v79///////KwHD/xbpj//Px3////////v79//7+/P////////////////////////////////////////////7+/P//////4dyx/6ydJf+3qT3/18+T//v69P////////7+/////////////////////////////////////////v7///////j14//DsDn/t6g4/7CiMf++slD/5uK8//////////7/////////////////////////////////+/3+///////I3f3/dpef/7aqQf/BrTT/tqc4/7CgKP/c1aD///////7+/P//////////////////////+/3////////E2fj/Nn/n/yh68/9LiNP/jp15/7erQ/+1pjX/w7he/////////////////////////////f7///////+50/f/MHzn/zJ96P88guT/KHv4/0WG3P+yqUr/uKk5/7eqP//08eD///////7+/f///////v7///////+syvb/LHnn/zN+6P87guf/Knnr/0uGyf+xqU3/uqo1/7irQv+xoiz/3tel///////+/vz////////////2+f7/P4Xp/zB85/86g+n/JHTj/2Cd+v/IwoH/uKYq/7aqQ/+zpjf/tac7/+voyv///////v79///////9/v///////3Sn7/8seuf/Lnrn/3Ci6//+////5eC6/7CjNP+5qTj/xLNE//bw0f///////f39/////////////P3///////+sy/b/JnPl/0eU7v+Uz/r/8fv///n26//Crzr/qqRJ/2WX0P/E3P/////8//7///////////////3+////////4Or7/0aW7/9fufn/Wrb5/2G4+f+54f7/tbiG/0aDzP8oevP/LXnj/3Wn8P/e6vv///////7+/////////v/////////N6v7/cL/6/1az+f9dtvn/Xbn5/1Gh9f8teev/O4Pm/zN+6P8ldeb/vNX3///////9/v/////////////+/v////////b7//+o2Pz/X7f5/1m2+f9dsPX/OoHn/y575/81f+j/yNz5///////9/v////////////////////////3+///+/v///////+Tz/v+Ky/v/Xbf5/zeF6v8+hOn/0eL6///////8/f///////////////////////////////////v////3+/////////////8Pm/v9jpvH/0OD5///////7/f//////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

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
