// ==UserScript==
// @name 		Houzz.com downloader
// @description 	Allow to download images from houzz.com
// @author		Basil Poupline
// @include		https://*houzz.com/*
// @require 		https://code.jquery.com/jquery-2.2.4.min.js
// @version 0.0.1.20171124121006
// @namespace https://greasyfork.org/users/160637
// @downloadURL https://update.greasyfork.org/scripts/35630/Houzzcom%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/35630/Houzzcom%20downloader.meta.js
// ==/UserScript==

$(document).ready(function() 
{
	// remove class hide-context from main image
	//$("div, img").removeClass("hide-context");
	$("div, img").removeAttr("onmousedown");
	$("div, img").removeAttr("ondragstart");
	$("div, img").removeAttr("onselectstart");
	$("div, img").removeAttr("oncontextmenu");
	
	//replace fg transparent image to actual product image, used as a background
	var bg_url = $(".lbImageView").css('background-image');
	$(".lbImageView").attr('src', bg_url);
});