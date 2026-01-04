// ==UserScript==
// @name           Animated Youtube Thumbnails Updated
// @namespace      YTTN
// @description    Animated Youtube thumbnails on hover. (Updated)
// @version        1.0
// @include        http://*.youtube.*/*
// @include        http://youtube.*/*
// @include        https://*.youtube.*/*
// @include        https://youtube.*/*
// @grant          GM_addStyle
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/31559/Animated%20Youtube%20Thumbnails%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/31559/Animated%20Youtube%20Thumbnails%20Updated.meta.js
// ==/UserScript==


// If you are interested in YouTube images:
// Thumbnails url looks like http://img.youtube.com/vi/8aYQ_wjmriQ/2.jpg
// Youtube generates 4 thumbnails: 0.jpg at 320x240, and 1.jpg, 2.jpg, 3.jpg
// Also large: hqdefault.jpg (480x360) and sometimes but not always hq1.jpg, hq2.jpg, hq3.jpg

var animateThumbnails  = true;


if (animateThumbnails) {

	// == Thumbnail animation ==
	// TODO: This is working fine on "related videos" thumbnails, but not on queue
	// thumbnails, even if I have the queue open when I load the page.
	// Perhaps we are responding to a mouseout event from a child element, because
	// we are not checking the event target like we should do.
	function initThumbnailAnimator() {
		// function createThumbnailAnimatorEvent(thumbImage) {
		var filenameRE = /\/([^/]*)\.(jpg|webp)(\?.*|$)/;
		var thumbImage    = null;
		var originalHref  = null;
		var timer  = null;
		//var frames = ["1.jpg","2.jpg","3.jpg"];   // "default.jpg",
		var frames = ["hq1","hq2","hq3"];
		var frameI = 0;
		function changeFrame() {
			frameI = (frameI + 1) % frames.length;
			var match = originalHref.match(filenameRE);
			var extension = match[2];
			var filename = frames[frameI] + '.' + extension;
			thumbImage.src = originalHref.replace(filenameRE, '/' + filename);
		}
		function startAnimation() {
			// Because there was a bug that the running animation would not stop!
			if (timer) {
				clearInterval(timer);
			}
			originalHref = thumbImage.src;
			if (originalHref.match(/^data:/)) {
				return;
			}
			// We make this check quite late, due to lazy loading
			if (originalHref.match(filenameRE)) {
				// logElem("Starting animation",thumbImage);
				timer = setInterval(changeFrame,600);
			}
		}
		function stopAnimation() {
			if (timer) {
				// logElem("Stopping animation",thumbImage);
				clearInterval(timer);
				timer = null;
				// This isn't really neccessary, except to ensure the check for default\.jpg above works next time!
				//thumbImage.src = thumbImage.src.replace(/\/[^/]*$/,'') + '/' + "default.jpg";
				thumbImage.src = originalHref;
			}
		}
		function logElem(name,elem) {
			report = "<"+elem.tagName+" id="+elem.id+" class="+elem.className+" src="+elem.src+" />";
			GM_log(name+" = "+report);
		}
		function check(fn) {
			return function(evt) {
				// logElem("["+evt.type+"] evt.target",evt.target);
				var elemToCheck = evt.target || evt.srcElement;
				if (elemToCheck.tagName == "IMG") {
					thumbImage = elemToCheck;
					return fn();
				} else if (elemToCheck.className=='screen') {
					var seekImg = elemToCheck.parentNode.getElementsByTagName("img")[0];
					if (seekImg) {
						thumbImage = seekImg;
						return fn();
					}
				// } else {
					// var imgCount = elemToCheck.getElementsByTagName("img").length;
					// if (imgCount == 1) {
						// thumbImage = elemToCheck.getElementsByTagName("img")[0];
						// // logElem("["+evt.type+"] checking sub-image",thumbImage);
						// logElem("Whilst checking",elemToCheck);
						// logElem("  Animating elem",thumbImage);
						// logElem("  with parent",thumbImage.parentNode);
						// logElem("  whilst currentTarget",evt.currentTarget);
						// logElem("  and srcElement",evt.srcElement);
						// return fn();
					// }
				}
			};
		}
		//// Unfortunately these do not fire on any HTMLImageElements when browsing the queue.
		document.body.addEventListener("mouseover",check(startAnimation),false);
		document.body.addEventListener("mouseout",check(stopAnimation),false);
		// var videoList = document.getElementById("watch-sidebar"); // or watch-module or watch-module-body or watch-related or watch-more-related
		// var videoList = document.getElementsByClassName("video-list")[0]; // can be 4 of these!
		// var thumbs = document.getElementsByTagName("img");
		// for (var i=0;i<thumbs.length;i++) {
			// createThumbnailAnimatorEvent(thumbs[i]);
		// }
	}
	setTimeout(initThumbnailAnimator,1000);
	GM_addStyle(" .yt-thumb-simple img, .yt-uix-simple-thumb-related > img { object-fit: cover; } ");

}
