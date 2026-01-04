// ==UserScript==
// @name        [Frg] Accesskey Navigation for Kobatochan.com
// @namespace	https://github.com/Frigvid/scripts-and-userstyles
// @author      Frigvid
// @description Ctrl + Arrow Key navigation.
// @version     2.6.12
// @icon		https://raw.githubusercontent.com/Frigvid/scripts-and-userstyles/master/resources/favicons/kobatochan.png
// @supportURL  https://github.com/Frigvid/scripts-and-userstyles/issues
// @match       *://*.kobatochan.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406232/%5BFrg%5D%20Accesskey%20Navigation%20for%20Kobatochancom.user.js
// @updateURL https://update.greasyfork.org/scripts/406232/%5BFrg%5D%20Accesskey%20Navigation%20for%20Kobatochancom.meta.js
// ==/UserScript==

/* globals $ */

var prvCh = function(prv){
    var prvId = $('div').find('a').filter(':contains("<< Previous Chapter")');
    if ($(prvId).attr("href") == "null") {} else {window.open($(prvId).attr("href"),"_self")}
};

var nxtCh = function(nxt){
    var nxtId = $('div').find('a').filter(':contains("Next Chapter >>")');
    if ($(nxtId).attr("href") == "null") {} else {window.open($(nxtId).attr("href"),"_self")}
};

var prvPg = function(prv){
    var prvPgId = $('div').find('a').filter(':contains("« Previous Page")');
    if ($(prvPgId).attr("href") == "null") {} else {window.open($(prvPgId).attr("href"),"_self")}
};

var nxtPg = function(nxt){
    var nxtPgId = $('div').find('a').filter(':contains("Next Page »")');
    if ($(nxtPgId).attr("href") == "null") {} else {window.open($(nxtPgId).attr("href"),"_self")}
};

document.addEventListener('keydown', function(e){
	if (e.ctrlKey)
	{
		switch (e.keyCode)
		{
			case 37: prvCh(-1); break;
			case 39: nxtCh(1); break;
		}
	}

	if (e.shiftKey)
	{
		switch (e.keyCode)
		{
			case 37: prvPg(-1); break;
			case 39: nxtPg(1); break;
		}
	}
}, false);
