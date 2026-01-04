// ==UserScript==
// @name     Youtube soundcloud sync
// @description embed an audio track from soundcloud on a youtube page and sync it with video playback
// @version  1
// @grant    none
// @include  https://www.youtube.com/*
// @include  https://w.soundcloud.com/*
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @namespace https://greasyfork.org/users/374871
// @downloadURL https://update.greasyfork.org/scripts/390420/Youtube%20soundcloud%20sync.user.js
// @updateURL https://update.greasyfork.org/scripts/390420/Youtube%20soundcloud%20sync.meta.js
// ==/UserScript==

var scapi = document.createElement('script');
scapi.src = "https://w.soundcloud.com/player/api.js";
document.getElementsByTagName('head')[0].appendChild(scapi);

function removeScEmbed(){
  soundCloudEmbed = document.getElementById("soundCloudEmbed");
  soundCloudEmbed.parentNode.removeChild(soundCloudEmbed);
  //embedSoundcloud();
}

function embedSoundcloud(){
	var element = document.getElementById("description");
  var idPattern = /(soundcloudsync)\((\d*)\)/i
  descriptionText = element.textContent;
  linkId = descriptionText.match(idPattern)[2];
  if (linkId != null){
    var para = document.createElement("iframe");
    element.appendChild(para)
    para.id = "soundCloudEmbed";
		para.src = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + linkId + "&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
    var frameScript = document.createElement("script");
  	frameScript.innerHTML = "iframeElement = document.querySelector('iframe'); widget1 = SC.Widget(iframeElement);"
  	document.head.appendChild(frameScript);
  }
	window.addEventListener("yt-navigate-finish", removeScEmbed);
}

function injectJavaCode(){
  var insertScript = document.createElement("script");
  insertScript.innerHTML = "ytplayer = document.getElementById(\"movie_player\"); ytplayer.addEventListener('onStateChange', function(event) {  try {  	widget1.seekTo(ytplayer.getCurrentTime()*1000);	widget1.toggle(); }  catch(error){};})"
  document.head.appendChild(insertScript);
}

waitForKeyElements ('#movie_player', injectJavaCode);
waitForKeyElements ('#description', embedSoundcloud);
