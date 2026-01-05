	// ==UserScript==
	// @name                YoutubeInMP3
	// @namespace	        tag:rinrynque@protonmail.ch,2015-08-27:YoutubeInMP3
	// @description	        simple button to download an mp3 from youtube
	// @include		https://www.youtube.com/*
	// @include		https://youtube.com/*
	// @include		http://www.youtube.com/*
	// @include		http://youtube.com/*
// @version 0.0.1.20150829204443
// @downloadURL https://update.greasyfork.org/scripts/12026/YoutubeInMP3.user.js
// @updateURL https://update.greasyfork.org/scripts/12026/YoutubeInMP3.meta.js
	// ==/UserScript==

setInterval(setSpawn, 4000);


function setSpawn (){
	var el = document.getElementById("action-panel-overflow-button");
	el.addEventListener("click", addDlLink, false);
}

function addDlLink () {
	if (!document.getElementById('DLButton'))
	{
	var elmNewContent = document.createElement('a');
	elmNewContent.id = 'DLButton';
	elmNewContent.href = 'http://youtubeinmp3.com/fetch/?video='+encodeURIComponent(document.URL)+"&hq=1";
	elmNewContent.appendChild(document.createTextNode('Download MP3'));
	var elmFoo = document.getElementById('watch7-views-info');
	elmFoo.parentNode.insertBefore(elmNewContent, elmFoo);
	}
	else
	{
		var dlButton = document.getElementById('DLButton');
		dlButton.parentNode.removeChild(dlButton);
	}
}