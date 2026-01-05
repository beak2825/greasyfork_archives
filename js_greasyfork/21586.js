// ==UserScript==
// @name           Download YouTube Audio as MP3
// @include        http://*youtube.*/*watch*
// @include        https://*youtube.*/*watch*
// @version        2.0
// @description     Adds a button to all YouTube videos that allows the user to download the audio as an mp3 file
// @namespace https://greasyfork.org/users/44041
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/21586/Download%20YouTube%20Audio%20as%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/21586/Download%20YouTube%20Audio%20as%20MP3.meta.js
// ==/UserScript==

//do_button();

function do_button(){
//console.log('testing');
	var DIV = document.createElement('span');
		DIV.innerHTML = '';
		DIV.style.cssFloat = "";

	var divp = document.getElementById("watch-headline-title");
		divp.appendChild(DIV);

	var urltemp = location.href.split("&")[0];
	var url = urltemp.split("=")[1];

	var INAU = document.createElement('iframe');
		INAU.style.height = "38px";
		INAU.style.width = "128px";
		INAU.style.float = "right";

		INAU.setAttribute('src',"https://www.youtube2mp3.cc/button-api/#" + url + "|mp3");

		DIV.appendChild(INAU);

}

$('video').ready(function() {
	var video = document.getElementsByTagName("video")[0];
		if(video) {
			video.addEventListener("playing", function() {
				var elements = document.getElementsByTagName('iframe');
				while (elements[0]) elements[0].parentNode.removeChild(elements[0])
				do_button();
			})
		} else {
			console.error("Video element not found");
	}
});