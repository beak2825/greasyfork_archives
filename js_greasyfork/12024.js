// ==UserScript==
// @name        Bovverzoom
// @description View linked images and animated GIFs on Reddit by hovering instead of having to click and navigate away.
// @namespace   raina
// @include     /^https?:\/\/(\w+\.)?reddit\.com\//
// @version     1.9.6
// @done        They somehow broke it so I fixed it again, sorry for the wait.
// @done        Added support for Reddit hosted GIF animations.
// @done        Added respect for NSFW.
// @done        Rewrote Reddit hosted image support.
// @done        Added support for a newly spotted Giphy link pattern.
// @done        Added support for Imgur direct mp4 links.
// @done        Made Imgur page links with query parameters work.
// @done        Fixed v1.5 addition working only once per image per page load.
// @done        Changed Reddit hosted images' thumbnails link from comments to original image to activate them.
// @done        Support i.reddituploads.com.
// @done        Run on subdomains for languages, no participation mode etc...
// @done        Allow passive mixed content, so that images from hosts without HTTPS can load.
// @done        Avoid mixed content issues by stripping out explicit protocol. (E.g. GFYCat videos don't load over HTTP from an HTTPS Reddit session).
// @done        Handle Imgur ad hoc collection images.
// @done        Handle Imgur "gifv" clips.
// @todo        Handle DOM mutations.
// @todo        Handle Imgur albums and galleries somehow.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12024/Bovverzoom.user.js
// @updateURL https://update.greasyfork.org/scripts/12024/Bovverzoom.meta.js
// ==/UserScript==
(function() {
	"use strict";

	var i, j;
	var doc = document;
	var thumbs = [].slice.call(doc.getElementsByClassName("thumbnail"));
	var userText = doc.getElementsByClassName("usertext-body");
	var show = function() {
		this.style.display = "block";
	};
	var hide = function() {
		this.style.display = "none";
	};
	var img = doc.createElement("img");
		img.className = "bovverzoom";
		img.cache = "";
		img.show = show;
		img.hide = hide;

	var clip = doc.createElement("video");
		clip.className = "bovverzoom";
		clip.autoplay = "autoplay";
		clip.muted = "muted";
		clip.loop = "loop";
		clip.cache = "";
		clip.show = show;
		clip.hide = hide;

	var style = doc.createElement("style");
		style.type = "text/css";
		style.textContent = ".bovverzoom {" +
			"background-color: rgba(0,0,0,.01);" +
			"position: fixed;" +
			"right: 0;" +
			"top: 0;" +
			"z-index: 100;" +
			"max-width: 100%;" +
			"max-height: 100%;" +
			"pointer-events: none;" +
			"border-radius: 3px;" +
			"display: none;" +
			"}"+
 			".glow {" +
			"box-shadow: rgba(255, 255, 255, .5) 0 0 8px" +
 			"}";

	var fetchGFY = function(url, e) {
		img.hide();
		if (url != clip.cache) {
			var xhr = new XMLHttpRequest();
			xhr.addEventListener("load", showGFY, false);
			xhr.open("GET", url, true);
			xhr.send();
			clip.cache = url;
		} else {
			clip.show();
		}
	};

	var showGFY = function() {
		clip.show();
		var gfyItem = JSON.parse(this.responseText).gfyItem;
		var newClip = clip.cloneNode(false);

		var webmSrc = doc.createElement("source");
		webmSrc.src = gfyItem.webmUrl.replace(/^https?:/, "");
		webmSrc.type = "video/webm";
		newClip.appendChild(webmSrc);

		var mp4Src = doc.createElement("source");
		mp4Src.src = gfyItem.mp4Url.replace(/^https?:/, "");
		mp4Src.type = "video/mp4";
		newClip.appendChild(mp4Src);

		document.body.replaceChild(newClip, clip);
		newClip.hide = clip.hide;
		newClip.show = clip.show;
		clip = newClip;
		clip.show();
	};

	var showGIFV = function(url) {
		clip.show();
		var newClip = clip.cloneNode(false);

		var webmSrc = doc.createElement("source");
		webmSrc.src = url.replace(".gifv", ".webm").replace(/^https?:/, "");
		webmSrc.type = "video/webm";
		newClip.appendChild(webmSrc);

		var mp4Src = doc.createElement("source");
		mp4Src.src = url.replace(".gifv", ".mp4").replace(/^https?:/, "");
		mp4Src.type = "video/mp4";
		newClip.appendChild(mp4Src);

		document.body.replaceChild(newClip, clip);
		newClip.hide = clip.hide;
		newClip.show = clip.show;
		clip = newClip;
		clip.show();
	};

	var imgMe = function(src, e) {
		clip.hide();
		if (src != img.cache) {
			img.src = "";
			img.src = src;
			img.cache = src;
		}
		img.show();
	};

	var killMe = function(e) {
		clip.hide();
		img.hide();
	};

	var rigMe = function(src, el) {
		el.addEventListener("mouseover", swapper, false);
		el.addEventListener("mouseout", swapper, false);
		el.className = el.className + " glow";
	};

	var clipFunc = rigMe;
	var imgFunc = rigMe;
	var swapper = function(e) {
		var obj = e;
		if ("mouseover" === e.type) {
			if (e.target.matches('a')) {
				obj = e.target;
			} else {
				obj = e.target.parentElement;
			}
			clipFunc = obj.href.match(/gfycat/) ? fetchGFY : showGIFV;
			imgFunc = imgMe;
		}
		if ("mouseover" === e.type || "" === e.type) {
			if (obj.href.match(/^https?:\/\/(.*\.)?gfycat\.com\/.{1,}$/i)) { // gfycat.com, HTML5 video even for direct .gif links
				clipFunc("//gfycat.com/cajax/get/" + obj.href.replace(/^.*\.com\//, ""), e);
			} else if (obj.href.match(/^https?:\/\/((i|m|www)\.)?imgur\.com\/[^\/]{1,}\.(gifv|mp4)$/)) { // imgur.com HTML5 video
				clipFunc(obj.href, e);
			} else if (obj.href.match(/https?:\/\/g\.redditmedia\.com\/[\w]+\.gif/)) { // g.redditmedia.com
				clipFunc(obj.href, e);
			} else if (obj.href.match(/\.(bmp|gif|jpe?g|png|svg)(\?.*)?$/i)) { // images, any domain
				imgFunc(obj.href, e);
			} else if (obj.href.match(/^https?:\/\/i\.reddituploads\.com\/.+/)) { // i.reddituploads.com
				imgFunc(obj.href, e);
			} else if (obj.href.match(/^https?:\/\/giphy\.com\/gifs\//)) { // this one giphy.com url pattern
				imgFunc(obj.href.replace(/\/gifs\/([\w]+-)*/, "/media/") + "/giphy.gif", e);
			} else if (obj.href.match(/^https?:\/\/((www|m)\.)?imgur\.com(\/r\/[^\/]*)?\/[^\/]{1,}#[0-9]{1,}$/)) { // imgur.com ad hoc collections
				var imgList = obj.href.slice(obj.href.lastIndexOf("/") + 1, obj.href.lastIndexOf("#")).split(",");
				var index = obj.href.slice(obj.href.lastIndexOf("#") + 1);
				imgFunc("//i.imgur.com/" + imgList[index] + ".jpg", e);
			} else if (obj.href.match(/^https?:\/\/((www|m)\.)?imgur\.com(\/r\/[^\/]*)?\/[^\/]{1,}$/)) { // imgur.com, nonhotlinked single images
				imgFunc(obj.href.replace(/\/([^\/]*\.)?imgur\.com(\/r\/[^\/]*)?/, "/i.imgur.com").replace(/\?.*/, "") + ".jpg", e);
			} else { // not a recognized image/clip link
				killMe();
			}
		} else { // mouseout
			killMe();
		}
	};

	doc.head.appendChild(style);
	doc.body.appendChild(clip);
	doc.body.appendChild(img);

	thumbs.forEach(function(thumb) {
		if (thumb.classList.contains("nsfw")) {
			return false;
		} else if (thumb.href.match(/\/r\/\w+\/comments\//) && thumb.querySelector('img')) {
			var expandoButton = thumb.nextSibling.querySelector(".expando-button");
			var expando = thumb.nextSibling.querySelector(".expando");
			return setTimeout(function() {
				expandoButton.click();
				expando.style.display = "none";
				thumb.href = expando.querySelector('img, video source').src;
				thumb.setAttribute("data-href-url", thumb.href);
				expandoButton.click();
				return swapper(thumb);
			});
		}
		swapper(thumb);
	});

	for (i = 0; i < userText.length; i++) {
	var textLinks = userText[i].getElementsByClassName("md")[0].getElementsByTagName("a");
		if (textLinks.length) {
			for (j = 0; j < textLinks.length; j++) {
				swapper(textLinks[j]);
			}
		}
	}
}());
