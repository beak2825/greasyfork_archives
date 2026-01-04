// ==UserScript==
// @name         TweetDeck lightboxes
// @namespace    https://yal.cc/
// @version      1.0
// @description  Shows an inline lightbox for images instead of opening a new tab/etc.
// @author       YellowAfterlife
// @match        https://tweetdeck.twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381779/TweetDeck%20lightboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/381779/TweetDeck%20lightboxes.meta.js
// ==/UserScript==
/* jshint eqnull:true */
/* jshint esversion:6 */
(function() {
    'use strict';
	let css = document.createElement("style");
	css.type = "text/css";	css.innerHTML = `
	.prf-header .imgxis-badge {
		position: absolute;
		left: 4px;
		top: 4px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.7);
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}
	.imgxis-panner {
		background: rgba(41,47,51,0.9);
		position: absolute;
		left: 0; width: 100%;
		top: 0; height: 100%;
		z-index: 350;
	}
	.imgxis-panner, .imgxis-panner img {
		cursor: move;
	}
	.imgxis-panner.zoomed, .imgxis-panner.zoomed img {
		-ms-interpolation-mode: nearest-neighbor;
		image-rendering: optimizeSpeed;
		image-rendering: -moz-crisp-edges;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: -o-crisp-edges;
		image-rendering: pixelated;
	}
	.imgxis-panner img, .imgxis-panner video {
		position: absolute;
		transform-origin: top left !important;
		margin: 0;
		background: none !important;
	}
	.imgxis-panner::after {
		content: attr(zoom);
		color: white;
		display: inline-block;
		padding: 1px 2px;
		background: rgba(0, 0, 0, 0.4);
		position: absolute; top: 0; left: 0;
	}
	.imgxis-panner.odd-zoom::after {
		color: #ffe040;
	}
	.imgxis-panner iframe {
		position: absolute;
		top: 0; bottom: 0;
		left: 50px;
		width: calc(100% - 100px);
		height: 100%;
		height: 100vh;
		border: 0;
	}
	`;
	document.body.appendChild(css);
	//
	let img0 = document.createElement("img"); // original
	let img0failed = false;
	img0.onerror = (_) => { img0failed = true };
	//
	let img1 = document.createElement("img"); // full-sized
	let img1failed = false;
	img1.onerror = (_) => { img1failed = true };
	//
	let video = document.createElement("video");
	video.loop = true;
	video.controls = true;
	video.autoplay = true;
	let videoLoaded = false;
	video.oncanplay = (_) => { videoLoaded = true };
	let isVideo = false;
	//
	let iframe = document.createElement("iframe");
	iframe.setAttribute
	//
	let panner = document.createElement("div");
	panner.className = "imgxis-panner";
	panner.appendChild(img0);
	panner.appendChild(img1);
	panner.appendChild(video);
	panner.appendChild(iframe);
	let panX = 0, panY = 0, panZ = 0, panM = 1;
	let panWidth = 0, panHeight = 0;
	let panIdle = false; // whether nothing happened to it yet
	let zoomed = false;
	//
	function panUpdate() {
		let pz = (panM >= 1);
		if (pz != zoomed) {
			zoomed = pz;
			let cl = panner.classList;
			if (pz) cl.add("zoomed"); else cl.remove("zoomed");
		}
		panner.setAttribute("zoom", `${panM*100|0}%`);
		let tf = `matrix(${panM},0,0,${panM},${-panX|0},${-panY|0})`;
		img0.style.transform = tf;
		img1.style.transform = tf;
		video.style.transform = tf;
	}
	//
	function panWheel(e) {
		panIdle = false;
		panner.classList.remove("odd-zoom");
		let d = e.deltaY;
		d = (d < 0 ? 1 : d > 0 ? -1 : 0) * 0.5;
		let zx = e.pageX, zy = e.pageY;
		let prev = panM;
		if (Math.abs(panZ - Math.round(panZ * 2) / 2) > 0.001) {
			panZ = d > 0 ? Math.ceil(panZ * 2) / 2 : Math.floor(panZ * 2) / 2;
		} else panZ = Math.round((panZ + d) * 2) / 2;
		panM = Math.pow(2, panZ);
		let f = panM / prev;
		panX = (zx + panX) * f - zx;
		panY = (zy + panY) * f - zy;
		panUpdate();
	}
	var mouseX = 0, mouseY = 0, mouseDown = false;
	function panMove(e) {
		let lastX = mouseX; mouseX = e.pageX;
		let lastY = mouseY; mouseY = e.pageY;
		if (mouseDown) {
			panX -= (mouseX - lastX);
			panY -= (mouseY - lastY);
			panUpdate();
		}
	}
	function panPress(e) {
		panIdle = false;
		panMove(e);
		if (e.target == panner) {
			e.preventDefault();
			setTimeout(() => panHide(), 1);
		} else if (e.which != 3) {
			e.preventDefault();
			mouseDown = true;
		}
	}
	function panRelease(e) {
		panMove(e);
		mouseDown = false;
	}
	function panKeyDown(e) {
		if (e.keyCode == 27/* ESC */) {
			e.preventDefault();
			e.stopPropagation();
			panHide();
			return false;
		}
	}
	panner.addEventListener("mousemove", panMove);
	panner.addEventListener("mousedown", panPress);
	panner.addEventListener("mouseup", panRelease);
	panner.addEventListener("wheel", panWheel);
	//
	function panFit(lw, lh) {
		let iw = window.innerWidth, ih = window.innerHeight;
		panZ = 0;
		if (lw < iw && lh < ih) {
			// zoom in (up to 800%)
			for (let k = 0; k < 3; k++) {
				if (lw * 2 < iw && lh * 2 < ih) {
					panZ += 1; lw *= 2; lh *= 2;
				}
			}
		} else {
			while (lw > iw || lh > ih) { // zoom out until fits
				panZ -= 1; lw /= 2; lh /= 2;
			}
		}
		panM = Math.pow(2, panZ);
		panX = -(iw - lw) / 2;
		panY = -(ih - lh) / 2;
		console.log(iw, ih, lw, lh, panX, panY, panM);
	}
	//
	let panCheckInt2 = null;
	function panCheck2() {
		if (isVideo) {
			let lw = video.offsetWidth, lh = video.offsetHeight;
			if (!videoLoaded) return;
			clearInterval(panCheckInt2); panCheckInt2 = null;
			panFit(lw, lh);
			console.log(lw, lh, panX, panY);
		} else {
			let lw = img1.width, lh = img1.height;
			if (lw <= 0 || lh <= 0) return;
			clearInterval(panCheckInt2); panCheckInt2 = null;
			//
			if (img1failed) return;
			img1.style.visibility = "";
			if (/*panIdle*/true) { // it makes sense to rescale to original if idle, but looks odd
				panZ -= Math.log2(Math.max(lw / img0.width, lh / img0.height));
				panM = Math.pow(2, panZ);
				if (Math.abs((panZ * 2) % 1) > 0.001) {
					panner.classList.add("odd-zoom");
				}
			} else panFit(lw, lh);
			img0.width = lw;
			img0.height = lh;
		}
		panUpdate();
	}
	//
	let panCheckInt = null;
	function panCheck() {
		let lw = img0.width, lh = img0.height;
		if (lw <= 0 || lh <= 0) return;
		if (img0failed) return;
		//console.log(lw, lh, img0failed);
		clearInterval(panCheckInt); panCheckInt = null;
		panFit(lw, lh);
		img0.style.visibility = "";
		panUpdate();
		if (img1.src) {
			panCheckInt2 = setInterval(panCheck2, 25);
		}
	}
	//
	var panTickInt = null;
	function panTick() {
		let lastWidth = panWidth; panWidth = window.innerWidth;
		let lastHeight = panHeight; panHeight = window.innerHeight;
		if (panWidth != lastWidth || panHeight != lastHeight) {
			panX -= (panWidth - lastWidth) / 2;
			panY -= (panHeight - lastHeight) / 2;
			panUpdate();
		}
	}
	function panShow(url, orig, mode) {
		isVideo = mode == 1;
		img1.style.display = img0.style.display = (mode == 0 ? "" : "none");
		video.style.display = mode == 1 ? "" : "none";
		iframe.style.display = mode == 2 ? "" : "none";
		if (mode == 2) {
			iframe.src = url;
		} else if (mode == 1) {
			video.src = url;
			videoLoaded = false;
		} else {
			img0.removeAttribute("width");
			img0.removeAttribute("height");
			img1.src = url; img0failed = false;
			img0.src = orig; img1failed = false;
			img1.style.visibility = "hidden";
			img0.style.visibility = "hidden";
		}
		document.querySelector(".application").appendChild(panner);
		document.addEventListener("keydown", panKeyDown);
		panWidth = window.innerWidth;
		panHeight = window.innerHeight;
		if (mode == 2) return;
		panTickInt = setInterval(panTick, 100);
		if (isVideo) {
			panCheckInt2 = setInterval(panCheck2, 25);
		} else {
			panCheckInt = setInterval(panCheck, 25);
		}
	}
	function panHide() {
		video.src = "";
		img0.src = "";
		img1.src = "";
		iframe.src = "";
		panner.parentElement.removeChild(panner);
		document.removeEventListener("keydown", panKeyDown);
		clearInterval(panTickInt); panTickInt = null;
		if (panCheckInt != null) { clearInterval(panCheckInt); panCheckInt = null; }
		if (panCheckInt2 != null) { clearInterval(panCheckInt2); panCheckInt2 = null; }
	}
	//
	function panGetShow(url, orig, mode) {
		if (mode == null) mode = 0;
		return (e) => {
			e.preventDefault();
			e.stopPropagation();
			panShow(url, orig, mode);
		};
	}
	//
	function getBackgroundUrl(el) {
		let url = el.style.backgroundImage;
		if (url == null) return url;
		return url.slice(4, -1).replace(/"/g, "");
	}
	setInterval(() => {
		// pictures:
		for (let query of [
			`.js-media-preview-container:not(.is-video):not(.is-gif) .js-media-image-link:not(.imgxis-link)`,
			`.media-image-container .js-media-image-link:not(.imgxis-link)`,
		]) for (let el of document.querySelectorAll(query)) {
			el.classList.add("imgxis-link");
			let url, orig;
			if (/(?:.jpg|.png|.jpeg|.gif)$/g.test(el.href)) {
				url = el.href;
				orig = el.getAttribute("data-original-url") || (url + ":small");
			} else {
				let img = el.querySelector("img");
				if (img == null) {
					orig = getBackgroundUrl(el);
					if (orig == null) continue;
				} else {
					orig = img.src;
				}
				url = orig.replace(/(?:\:small|\:large|\?format=.+)$/g, ":orig");
			}
			el.addEventListener("click", panGetShow(url, orig));
		}
		// profile backgrounds:
		for (let el of document.querySelectorAll(`.prf-header:not(.imgxis-link`)) {
			el.classList.add("imgxis-link");
			let orig = getBackgroundUrl(el);
			if (orig == null) continue;
			let url = orig.replace(/\/web$/g, "/1500x500");
			let a = document.createElement("a");
			a.className = "imgxis-badge";
			a.href = "#";
			a.title = "View profile background";
			a.addEventListener("click", panGetShow(url, orig));
			el.appendChild(a);
		}
		// avatars:
		for (let el of document.querySelectorAll(`.prf-img img.avatar:not(.imgxis-link)`)) {
			el.classList.add("imgxis-link");
			let orig = el.src;
			let url = orig.replace(/(?:_bigger|_normal)\./g, ".");
			el.addEventListener("click", panGetShow(url, orig));
		}
		// gifs:
		for (let el of document.querySelectorAll(`.media-item-gif:not(.imgxis-link)`)) {
			el.classList.add("imgxis-link");
			let url = el.src;
			el.parentElement.addEventListener("click", panGetShow(url, url, 1));
		}
		// videos:
		for (let el of document.querySelectorAll(`.media-preview-container.is-video:not(.imgxis-link)`)) {
			el.classList.add("imgxis-link");
			let link = el.querySelector("a");
			let par = el.parentElement;
			let url = link && link.href;
			if (url) url = url.replace("https://www.", "https://");
			if (!url) {
				//
			} else if (url.startsWith("https://t.co") || url.startsWith("https://twitter.com")) {
				url = null;
			} else if (url.startsWith("https://youtube.com/")) {
				var mt = /v=([\w-]+)/.exec(url);
				if (mt) url = `https://www.youtube.com/embed/${mt[1]}?autoplay=1`;
			}
			if (!url) while (par) {
				if (par.tagName == "ARTICLE" || par.classList.contains("quoted-tweet")) {
					url = par.getAttribute("data-tweet-id");
					if (url) url = `https://twitter.com/i/videos/tweet/${url}?auto_buffer=1&autoplay=1`;
					break;
				} else par = par.parentElement;
			}
			if (url) el.parentElement.addEventListener("click", panGetShow(url, url, 2));
		}
	}, 250);
})();