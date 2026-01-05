// ==UserScript==
// @name           hi_lite
// @namespace      arfcom
// @description    Highlights certain things.
// @copyright      2013+, tc2k11
// @include        http://www.ar15.com/forums/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @version        1
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/5048/hi_lite.user.js
// @updateURL https://update.greasyfork.org/scripts/5048/hi_lite.meta.js
// ==/UserScript==


// highlights posts containing USERNAME
$("div.postBody").filter(function(){
	return new RegExp("USERNAME").test($(this).text());
}).css("background", "green");

// highlights quotations containing USERNAME
$("div.quoteStyle").filter(function(){
	return new RegExp("USERNAME").test($(this).text());
}).css("background", "green");

// highlights 13'ers
$("div.postAuthorInfo").filter(function(){
	return new RegExp("2013").test($(this).text());
}).css({"background-color": "yellow", "color": "black"});
$("div.postAuthorInfo").filter(function(){
	return new RegExp("Dec 2012").test($(this).text());
}).css({"background-color": "yellow", "color": "black"});

// highlight 14'ers
$("div.postAuthorInfo").filter(function(){
	return new RegExp("2014").test($(this).text());
}).css({"background-color": "orange", "color": "black"});

// highlights Somalians
$("div.postAuthorInfoLocation").filter(function(){
	return new RegExp("SOM").test($(this).text());
}).css({"background-color": "red", "color": "black"});