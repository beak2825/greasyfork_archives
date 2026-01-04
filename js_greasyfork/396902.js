// ==UserScript==
// @name         Media Replacer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @exclude      *://youtube/*
// @match      *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396902/Media%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/396902/Media%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

var url = "";

function replace() {
	var images = document.getElementsByTagName("img");
	for (var i = 0; i < images.length; i++) {
		images[i].src = url;
	}
	var elements = document.getElementsByTagName('video')
while (elements[0]) elements[0].parentNode.removeChild(elements[0])
}

		var css = document.createElement("style");
		css.innerHTML = "img { content: url(test) !important; }";
		document.body.appendChild(css);
		window.setInterval(replace, 1000);
		replace();


    //https://greasyfork.org/en/scripts/6487-pause-all-html5-videos-on-load/code
var videos = document.getElementsByTagName('video');
function stopVideo()
{
    for (var i=0; i<videos.length; i++)
    {
            var element = document.getElementById(videos[i]);
    videos[i].parentNode.removeChild(videos[i]);

    }
}


})();