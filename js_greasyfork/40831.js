// ==UserScript==
// @version         1.3.2
// @name            [OFFLINE] YouTube MP3 Download | Convert2mp3.net | Für 2017 YouTube Design!
// @name:en         [OFFLINE] YouTube MP3 Download | Convert2mp3.net | For 2017 YouTube Design!
// @namespace       https://www.youtube.com/user/InvisibleQuantum/
// @description     Fügt einen MP3 Download-Button zur Videoseite hinzu, um das Video über Convert2mp3.net zu MP3 umzuwandeln. Nur für das alte YouTube Design aus 2017 (siehe Screenshot)!
// @description:en  Simple YouTube MP3 download button for "Convert2mp3.net"-service. Only for 2017 YouTube Design!
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      safari
// @icon            http://convert2mp3.net/favicon.ico
// @match           http*://www.youtube.com/*
// @homepageURL     https://www.youtube.com/user/InvisibleQuantum/
// @supportURL      https://twitter.com/InvisibleQuant/
// @contributionURL https://www.youtube.com/user/InvisibleQuantum?sub_confirmation=1
// @require     	http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @copyright   	2018-04-19 // InvisibleQuantum
// @license         CC BY-SA
// @license         https://creativecommons.org/licenses/by-sa/4.0
// @downloadURL https://update.greasyfork.org/scripts/40831/%5BOFFLINE%5D%20YouTube%20MP3%20Download%20%7C%20Convert2mp3net%20%7C%20F%C3%BCr%202017%20YouTube%20Design%21.user.js
// @updateURL https://update.greasyfork.org/scripts/40831/%5BOFFLINE%5D%20YouTube%20MP3%20Download%20%7C%20Convert2mp3net%20%7C%20F%C3%BCr%202017%20YouTube%20Design%21.meta.js
// ==/UserScript==
        var linkPath ='http://convert2mp3.net/addon_call.php?format=mp3&url='+encodeURIComponent(document.URL);
        $(  '<a target="_blank" id="youtube2mp3" class="yt-uix-button yt-uix-button-default" href="'+linkPath+'" style="margin-left: 8px; height: 26px; padding: 0 22px; /* background-color: #e62117; */"><img src="http://fs5.directupload.net/images/170615/azryj69k.png" style="vertical-align:middle;color: white;"> <span class="yt-uix-button-content" style="line-height: 25px; /* font-variant: small-caps; */ font-size: 12px; /* color: #fefefe; */">MP3 Download</span></a>').insertAfter( "#watch7-subscription-container" );