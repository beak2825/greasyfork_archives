// ==UserScript==
// @name        Bovverzoom Beta
// @description View linked images and animated GIFs on Reddit by hovering instead of having to click and navigate away.
// @namespace   raina
// @include     /^https?:\/\/(\w+\.)?reddit\.com\//
// @version     2.0a3
// @done        Icons, mutations.
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
// @todo        Handle Imgur albums and galleries somehow.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31036/Bovverzoom%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/31036/Bovverzoom%20Beta.meta.js
// ==/UserScript==
// Font Awesome by Dave Gandy (http://fontawesome.io) is licensed under SIL Open Font License v1.1 (https://opensource.org/licenses/OFL-1.1).
(function() {
	"use strict";

	var icon = {
		spinner: '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fill="rgb(128,128,128)" d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"/></svg>',
		zoom: '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fill="rgb(128,128,128)" d="M1088 800v64q0 13-9.5 22.5t-22.5 9.5h-224v224q0 13-9.5 22.5t-22.5 9.5h-64q-13 0-22.5-9.5t-9.5-22.5v-224h-224q-13 0-22.5-9.5t-9.5-22.5v-64q0-13 9.5-22.5t22.5-9.5h224v-224q0-13 9.5-22.5t22.5-9.5h64q13 0 22.5 9.5t9.5 22.5v224h224q13 0 22.5 9.5t9.5 22.5zm128 32q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 53-37.5 90.5t-90.5 37.5q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z"/></svg>'
	};

	var i, j;
	var doc = document;
	var thumbs = [].slice.call(doc.getElementsByClassName("thumbnail"));
	var userText = doc.getElementsByClassName("usertext-body");
	var show = function() {
		this.classList.remove("hidden");
	};
	var hide = function() {
		this.classList.add("hidden");
	};
	var img = doc.createElement("img");
		img.cache = "";
	var imgdiv = doc.createElement("div");
		imgdiv.className = "bovverzoom-container hidden";
		imgdiv.show = show;
		imgdiv.hide = hide;
		imgdiv.appendChild(img);

	var clip = doc.createElement("video");
		clip.autoplay = "autoplay";
		clip.muted = "muted";
		clip.loop = "loop";
		clip.cache = "";
	var clipdiv = doc.createElement("div");
		clipdiv.className = "bovverzoom-container hidden";
		clipdiv.show = show;
		clipdiv.hide = hide;
		clipdiv.appendChild(clip);
	var style = doc.createElement("style");
		style.type = "text/css";
		style.textContent = "[class*=\"bovverzoom-\"]::after," +
			".bovverzoom-container {" +
			"max-height: 100%;" +
			"opacity: 1;" +
			"transition: opacity .125s;" +
			"}" +
			"[class*=\"bovverzoom-\"].hidden::after," +
			".bovverzoom-container.hidden {" +
			"opacity: 0;" +
			"}" +
			".bovverzoom-container {" +
			"background-color: rgba(0,0,0,.01);" +
			"position: fixed;" +
			"right: 0;" +
			"top: 0;" +
			"z-index: 100;" +
			"max-width: 100%;" +
			"max-height: 100%;" +
			"pointer-events: none;" +
			"border-radius: 3px;" +
			"}" +
			".bovverzoom-container > * {" +
			"position: relative;" +
			"max-height: 100%;" +
			"max-width: 100%;" +
			"overflow: hidden;" +
			"}" +
			".bovverzoom-container.loaded::before {" +
			"display: none;" +
			// "background: red;" +
			"}" +
			".bovverzoom-container::before {" +
			"content: ' ';" +
			"display: block;" +
			"width: 10vw;" +
			"height: 10vw;" +
			"position: absolute;" +
			"left: calc(50% - 5vw);" +
			"top: calc(50% - 5vw);" +
			"background-image: url('data:image/svg+xml;utf8," + icon.spinner + "');" +
			"background-size: 100%;" +
			"animation: spin infinite .5s step-end" +
			// "transition: opacity 0 .125s;" +
			"}" +
			"@keyframes spin {" +
			"0% { transform: rotate(0deg); }" +
			"12.5% { transform: rotate(45deg); }" +
			"25% { transform: rotate(90deg); }" +
			"37.5% { transform: rotate(135deg); }" +
			"50% { transform: rotate(180deg); }" +
			"62.5% { transform: rotate(225deg); }" +
			"75% { transform: rotate(270deg); }" +
			"87.5% { transform: rotate(315deg); }" +
			"}" +
			".bovverzoom-link," +
			".bovverzoom-thumbnail {" +
			"position: relative;" +
			"}" +
			".bovverzoom-link {" +
			"padding-right: 1.2rem" +
			"}" +
 			".bovverzoom-link::after," +
 			".bovverzoom-thumbnail::after {" +
			"position: absolute;" +
			"right: 0;" +
			"bottom: 0;" +
			"content: ' ';" +
			"display: block;" +
			"width: 1rem;" +
			"height: 1rem;" +
			"background-repeat: no-repeat;" +
			"background-size: 100%;" +
			"background-image: url('data:image/svg+xml;utf8," + icon.zoom + "');" +
			"mix-blend-mode: difference" +
			"}";

	var fetchGFY = function(url, e) {
		imgdiv.hide();
		if (url != clip.cache) {
			var xhr = new XMLHttpRequest();
			xhr.addEventListener("load", showGFY, false);
			xhr.open("GET", url, true);
			xhr.send();
			clip.cache = url;
		} else {
			clipdiv.show();
		}
	};

	var showGFY = function() {
		var gfyItem = JSON.parse(this.responseText).gfyItem;

		clipdiv.style.width = (gfyItem.width < window.innerWidth ? gfyItem.width : window.innerWidth) + "px";
		clipdiv.style.height = (gfyItem.height < window.innerHeight ? gfyItem.height : window.innerHeight) + "px";
		var newClip = clip.cloneNode(false);

		var webmSrc = doc.createElement("source");
		webmSrc.src = gfyItem.webmUrl.replace(/^https?:/, "");
		webmSrc.type = "video/webm";
		newClip.appendChild(webmSrc);

		var mp4Src = doc.createElement("source");
		mp4Src.src = gfyItem.mp4Url.replace(/^https?:/, "");
		mp4Src.type = "video/mp4";
		newClip.appendChild(mp4Src);

		clipdiv.replaceChild(newClip, clip);
		var cache = clip.cache;
		clip = newClip;
		clip.cache = cache;
		clipdiv.show();
	};

	var showGIFV = function(url) {
		clipdiv.show();
		var newClip = clip.cloneNode(false);

		var webmSrc = doc.createElement("source");
		webmSrc.src = url.replace(".gifv", ".webm").replace(/^https?:/, "");
		webmSrc.type = "video/webm";
		newClip.appendChild(webmSrc);

		var mp4Src = doc.createElement("source");
		mp4Src.src = url.replace(".gifv", ".mp4").replace(/^https?:/, "");
		mp4Src.type = "video/mp4";
		newClip.appendChild(mp4Src);

		clipdiv.replaceChild(newClip, clip);
		clip = newClip;
		clipdiv.show();
	};

	var finishLoading = function(e) {
		console.log("loaded");
		console.log(e.target.naturalWidth, e.target.naturalHeight);
	};

	var imgMe = function(src, e) {
		clipdiv.hide();
		if (src != img.cache) {
			imgdiv.classList.remove("loaded");
			img.src = "";
			img.addEventListener("load", function(e) {
				img = e.target;
				var aspectRatio = 1;
				var height = img.naturalHeight;
				var reset = true;
				if (img.naturalWidth > window.innerWidth && img.naturalWidth > img.naturalHeight) {
					aspectRatio = img.naturalWidth / img.naturalHeight;
					height = (window.innerWidth * aspectRatio);
					img.style.width = window.innerWidth + "px";
					img.style.height = height + "px";
					reset = false;
				}
				if (height > window.innerHeight) {
					aspectRatio = img.naturalHeight / img.naturalWidth;
					img.style.width = (window.innerHeight / aspectRatio) + "px";
					img.style.height = window.innerHeight + "px";
					reset = false;
				}
				if (reset) {
					img.style.width = "";
					img.style.height = "";
				}
				img.parentElement.classList.add("loaded");
			});
			img.src = src;
			img.cache = src;
		}
		imgdiv.show();
	};

	var killMe = function(e) {
		clipdiv.hide();
		imgdiv.hide();
	};

	var rigMe = function(src, el) {
		el.addEventListener("mouseover", swapper, false);
		el.addEventListener("mouseout", swapper, false);
		el.classList.add("hidden");
		if (el.getElementsByTagName("img").length) {
			el.classList.add("bovverzoom-thumbnail");
		} else {
			el.classList.add("bovverzoom-link");
		}
		setTimeout(function() {
			el.classList.remove("hidden");
		}, 1);
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
	doc.body.appendChild(clipdiv);
	doc.body.appendChild(imgdiv);

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
