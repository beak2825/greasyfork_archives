// ==UserScript==
// @name        YouTube - No more Letterboxing
// @description Middleclick a YT video to crop black borders and fill the viewport (without loosing content)
// @namespace   ceremony.no.more.letterboxing
// @include     /https?://(.*\.)?youtube\..+/.*/
// @require     https://unpkg.com/underscore@1.8.3/underscore.js
// @require     https://unpkg.com/javascript-detect-element-resize@0.5.3/detect-element-resize.js
// @version     0.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34528/YouTube%20-%20No%20more%20Letterboxing.user.js
// @updateURL https://update.greasyfork.org/scripts/34528/YouTube%20-%20No%20more%20Letterboxing.meta.js
// ==/UserScript==

let contrast = 10, pixelsteps = 64, handled = [], active = [];
setInterval(function () {
	Array.prototype.forEach.call(document.querySelectorAll(".html5-video-player video"), handleVideo)
}, 1000);
Array.prototype.forEach.call(document.querySelectorAll(".html5-video-player video"), handleVideo)

function handleVideo(video) {
	if (handled.indexOf(video) != -1)
		return;
	handled.push(video);
	let resizeEvent = _.throttle(function () {
			centerVideo(video, video.offset);
			scaleVideo(video, video.offset);
		}, 16, {
			leading: false
		});
	video.addEventListener('mousedown', function (e) {
		if (e.buttons !== 4)
			return;
		e.preventDefault();
		if (active.indexOf(video) == -1) {
			active.push(video);
			video.offset = getBlackBars(video);
			let hook = video;
			for (let i = 0; i < 4; i++) {
				addResizeListener(hook, resizeEvent);
				hook = hook.parentElement;
			}
		} else {
			active.splice(active.indexOf(video), 1);
			video.style.transform = "";
			let hook = video;
			for (let i = 0; i < 4; i++) {
				removeResizeListener(hook, resizeEvent);
				hook = hook.parentElement;
			}
		}
	})
}

function centerVideo(video, offset) {
	let style = video.style.transform.replace(/ ?translate\([^)]+\) ?/i, ""),
	centerx = (offset.right - offset.left) / video.videoWidth * 50,
	centery = (offset.bottom - offset.top) / video.videoHeight * 50;
	style += " translate(" + (Math.abs(centerx) > 0.01 ? centerx : 0) + "%," + (Math.abs(centery) > 0.01 ? centery : 0) + "%)";
	video.style.transform = style;
}

function scaleVideo(video, offset) {
	let style = video.style.transform.replace(/ ?scale\([^)]+\) ?/i, ""),
	container = video.parentElement.parentElement,
	zoom = Math.min(container.clientWidth / (video.videoWidth - offset.left - offset.right), container.clientHeight / (video.videoHeight - offset.top - offset.bottom)) / video.clientWidth * video.videoWidth;
	if (zoom > 1)
		style = "scale(" + zoom + ") " + style;
	video.style.transform = style;
}

function getBlackBars(video) {
	let w = video.videoWidth,
			h = video.videoHeight,
			canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d'),a
			offset = {
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			};
	canvas.width = w;
	canvas.height = h;
	ctx.drawImage(video, 0, 0, w, h);
	
	let imagedata = ctx.getImageData(0, 0, w, h).data;
  
	for (let i = 0; i < h / 2; i++) {
		let pixels = Array(Math.floor(pixelsteps*1.5)).fill(w * i).map((x, y) => 4 * Math.floor(x + w / 5 + w / 5 * 3 / (pixelsteps*1.5 + 1) * (y + 1)));
    if (pixelsAnalyzer(pixels, imagedata))
			break;
		offset.top++
	}
	
	for (let i = h; i > h / 2; i--) {
		let pixels = Array(Math.floor(pixelsteps*1.5)).fill(w * i).map((x, y) => 4 * Math.floor(x - w / 5 - w / 5 * 3 / (pixelsteps*1.5 + 1) * (y + 1)));
		if (pixelsAnalyzer(pixels, imagedata))
			break;
		offset.bottom++;
	}
	
	for (let i = 0; i < w / 2; i++) {
		let pixels = Array(pixelsteps).fill(w).map((x, y) => 4 * (x * Math.floor(h / 5 + h / 5 * 3 / (pixelsteps + 1) * (y + 1)) + i));
		if (pixelsAnalyzer(pixels, imagedata))
			break;
		offset.left++;
	}
	
	for (let i = w - 1; i > w / 2; i--) {
		let pixels = Array(pixelsteps).fill(w).map((x, y) => 4 * (x * Math.floor(h / 5 + h / 5 * 3 / (pixelsteps + 1) * (y + 1)) + i));
		if (pixelsAnalyzer(pixels, imagedata))
			break;
		offset.right++;
	}
	return offset;
}

function pixelsAnalyzer(pixels, imagedata) {
	return !pixels.every(px => Math.max.apply(null, [0, 1, 2].map(i => imagedata[px + i])) < contrast) ;
}