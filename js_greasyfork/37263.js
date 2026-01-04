// ==UserScript==
// @name        xnxx video download linker
// @namespace   http://ftuhrxtfhrtxhxrh.com
// @description Download adult videos from xnxx.com
// @include     https://*.xnxx.com/video-*
// @include     https://xnxx.com/video-*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/37263/xnxx%20video%20download%20linker.user.js
// @updateURL https://update.greasyfork.org/scripts/37263/xnxx%20video%20download%20linker.meta.js
// ==/UserScript==


if (document.getElementById("player")) {
	var h = document.getElementById("player");
	var hh = h.getElementsByTagName("embed")[0].getAttribute("flashvars");
	var dlink = unescape(hh.split("flv_url=")[1].split("&")[0]);
	  
	var c = document.createElement("div");
	c.style='display: block; z-index:10001 !important; font-size:108%; line-height:108%; color: #ffffff; background-color: #222222; border: 2px solid #7f7ebe; margin-left: auto; margin-right:auto; text-align:center; font-weight:bold;'
	c.innerHTML = "<a href='"+dlink+"' style='margin-right:auto; margin-left:auto; align:center;'>Download Video</a>"
	document.body.insertBefore(c, document.body.firstChild);
} else {
	var links = {};
	var S = document.getElementsByTagName("script");
	for (var s in S) {
	  if (S[s].innerHTML && S[s].innerHTML.indexOf("setVideoUrlLow")!=-1) {
		links.low = S[s].innerHTML.split("html5player.setVideoUrlLow('")[1].split("');")[0];
		links.high = S[s].innerHTML.split("html5player.setVideoUrlHigh('")[1].split("');")[0];
		links.hld = S[s].innerHTML.split("html5player.setVideoHLS('")[1].split("');")[0];
      }
	}

	for (var x in links) {
	  if (!document.getElementById(x)) {
		var c = document.createElement("div");
		c.id = x;
		c.style='display: block; z-index:10001 !important; font-size:108%; line-height:108%; color: #ffffff; background-color: #222222; border: 2px solid #7f7ebe; margin-left: auto; margin-right:auto; text-align:center; font-weight:bold;'
		c.innerHTML = "<a href='"+links[x]+"' style='margin-right:auto; margin-left:auto; align:center;'>Download "+x.toString()+" Video</a>"
		document.body.insertBefore(c, document.body.firstChild);
	  }
	}
}

