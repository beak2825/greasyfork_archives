// ==UserScript==
// @name         toni alarm
// @description  Alarm na shit posty
// @namespace    https://www.skyscrapercity.com/
// @match        https://www.skyscrapercity.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @version      1.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426428/toni%20alarm.user.js
// @updateURL https://update.greasyfork.org/scripts/426428/toni%20alarm.meta.js
// ==/UserScript==

var user = 'toni...';

var songUrl = 'https://instrumentalfx.co/wp-content/upload/11/The-Benny-Hill-Show-Theme-Song.mp3';

$(document).ready(function() {
	var shitPost = $(".is-unread[data-author='" + user + "']");
  
	if (shitPost.length > 0) {
    $("<audio></audio>").attr({
    'src': songUrl,
    'loop': false,
    'volume':1.0
	}).appendTo("body");
  
   var audio = $("audio")[0];
   audio.play();
  }
});