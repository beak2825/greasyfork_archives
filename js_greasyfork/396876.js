// ==UserScript==
// @name         xvideos download linker
// @namespace     http://www.jfyrdtrdfvgytifgfgygu.com
// @description   Adds download links to videos on xvideos.com
// @version        1.1.1
// @include        http://*.xvideos.com/*
// @include        http://xvideos.com/*
// @include        https://*.xvideos.com/*
// @include        https://xvideos.com/*
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/396876/xvideos%20download%20linker.user.js
// @updateURL https://update.greasyfork.org/scripts/396876/xvideos%20download%20linker.meta.js
// ==/UserScript==
//
//v 1.1

function newget(uu) {
var ng = GM_xmlhttpRequest({
	method:"GET",
	url:uu,
	headers:{
		"User-Agent":"Mozilla/5.0 (Windows NT 6.2; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0",
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		},
	ignoreRedirect:true,
	synchronous:true,
	});
	return ng.responseText.split("flashvar")[1];
}

var a = document.getElementById("flash-player-embed");
var s = document.getElementsByTagName("script");
var b = null;
for (var si = 0; si < s.length; si++) {
	if (s[si].textContent.indexOf("html5player.setVideoUrlHigh")!=-1) {
		b = s[si].textContent.split("html5player.setVideoUrlHigh")[1].split("('")[1].split("'")[0];
		b = unescape(b);
		break;
	}
	
}

if (b==null) {
try {
	var b = a.getAttribute("flashvars").toString();
} catch(e) {
	try {
		var b = a.nextSibling.getAttribute("flashvars").toString();
	} catch(e) {
	  b = newget(document.location.href);
	 }
 }


 b = unescape(b);
 b = b.split("flv_url=")[1];
 b = unescape(b);
 b = b.split("|")[0];
 b = b.split("&url_bigthumb")[0];
 b = b.split("&amp;url_bigthumb")[0];
	
}


var c = document.createElement("div");
c.style='display: block; z-index:10001 !important; font-size:108%; line-height:108%; color: #ffffff; background-color: #222222; border: 2px solid #7f7ebe; margin-left: auto; margin-right:auto; text-align:center; font-weight:bold;'
c.innerHTML = "<a href='"+b+"' style='margin-right:auto; margin-left:auto; align:center; color:white;'>Download Video</a>"
document.body.insertBefore(c, document.body.firstChild);

