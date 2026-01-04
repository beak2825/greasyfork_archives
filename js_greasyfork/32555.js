https://greasyfork.org/pt-BR/script_versions/new
// ==UserScript==
// @version         1.0
// @name            Mp3Tube - Youtube Mp3 Download
// @name:en         Mp3Tube - Youtube Mp3 Download
// @namespace       https://www.youtube.com/user/ricbr7
// @description     Youtube Mp3 Download
// @description:en  Youtube Mp3 Download
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      safari
// @icon            http://convert2mp3.net/favicon.ico
// @match           http*://www.youtube.com/*
// @homepageURL     https://www.youtube.com/user/ricbr7
// @supportURL      https://www.youtube.com/user/ricbr7/discussion
// @contributionURL https://www.youtube.com/user/ricbr7?sub_confirmation=1
// @require     	http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @copyright   	2017-08-23 // Ricbr7
// @license         CC BY-SA
// @license         https://creativecommons.org/licenses/by-sa/4.0
// @downloadURL https://update.greasyfork.org/scripts/32555/Mp3Tube%20-%20Youtube%20Mp3%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/32555/Mp3Tube%20-%20Youtube%20Mp3%20Download.meta.js
// ==/UserScript==
        var linkPath ='http://www.youtubeinmp3.com/fetch/?video='+encodeURIComponent(document.URL);
        $(  '<a target="_blank" id="youtube2mp3" class="yt-uix-button yt-uix-button-default" href="'+linkPath+'" style="margin-left: 8px; height: 26px; padding: 0 22px; /* background-color: #e62117; */"><img src="http://fs5.directupload.net/images/170615/azryj69k.png" style="vertical-align:middle;color: white;"> <span class="yt-uix-button-content" style="line-height: 25px; /* font-variant: small-caps; */ font-size: 12px; /* color: #fefefe; */">MP3 Download</span></a>').insertAfter( "#watch7-subscription-container" );
	