// ==UserScript==
// @name         GfyCat Redirect to WebM Video File
// @namespace    gfycatVideoRedirect_kk
// @description  Automatically promotes GfyCat gif pages to raw WebM video
// @version      0.2
// @author       Kai Krause <kaikrause95@gmail.com>
// @match        http://gfycat.com/*
// @match        https://gfycat.com/*
// @grant       none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/32493/GfyCat%20Redirect%20to%20WebM%20Video%20File.user.js
// @updateURL https://update.greasyfork.org/scripts/32493/GfyCat%20Redirect%20to%20WebM%20Video%20File.meta.js
// ==/UserScript==

// gifycat.com/gifs/detail/id
var videoPlayer = document.getElementsByTagName('video')[0];
if (videoPlayer) {
	var children = videoPlayer.childNodes;
	for (var i = 0; i < children.length; ++i) {
		if (children[i].type == "video/webm") {
			var webm = children[i].src;
			break;
		}
	}
} else {
	// gifycat.com/id
	var webm = document.getElementById('webmSource').src;
	var mp4 = document.getElementById('mp4Source').src;
}

if (webm) {
	location.assign(webm);
} else if (mp4) {
	location.assign(mp4);
}
