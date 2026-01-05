// ==UserScript==
// @name        TVI Play Download
// @description Inclui comando do rtmpdump nas páginas da TVI para fazer download do vídeo.
// @namespace   daniel-sousa-me
// @include     http://www.tvi.iol.pt/programa/*
// @grant       none
// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/1272/TVI%20Play%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/1272/TVI%20Play%20Download.meta.js
// ==/UserScript==
// Based on RTP Play Download, since I didn't know how to create GreaseMonkey scripts

var metaTags=document.getElementsByTagName("meta");

var full_video_url = "";
for (var i = 0; i < metaTags.length; i++) {
    if (metaTags[i].getAttribute("property") == "og:video") {
        full_video_url = metaTags[i].getAttribute("content");
        break;
    }
}

var rtmp_dump_cmd = "rtmpdump -e -R -r "+getUrlVars(full_video_url)["streamer"]+"/"+getUrlVars(full_video_url)["file"];

var parentGuest = document.getElementsByClassName("seccao")[0];
// http://stackoverflow.com/questions/7258185/javascript-append-child-after-element/7258301#7258301
parentGuest.parentNode.insertBefore(document.createTextNode(rtmp_dump_cmd), parentGuest.nextSibling);

var a = document.createElement("a");
if (link.length != 0) {
	a.setAttribute("href",link);
	a.appendChild(document.createTextNode("Link Directo"));
}
else {
	a.appendChild(document.createTextNode(flashvars));
}
div_add.appendChild(a);

// http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars(url) {
	var vars = {};
	var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	    vars[key] = decodeURIComponent(value);
	});
	return vars;
}
