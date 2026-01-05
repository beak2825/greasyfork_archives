// ==UserScript==
// @name        Webtoons.com for Desktop
// @description Resizes and downloads higher quality versions of the images on LINE (m.webtoons.com) to improve usability on Desktops and Laptops.
// @author      Gendalph
// @namespace   https://greasyfork.org/users/3807
// @include     http://*webtoons.com/viewer?*
// @version     2
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/3552/Webtoonscom%20for%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/3552/Webtoonscom%20for%20Desktop.meta.js
// ==/UserScript==

function main() {
	var img = document.createElement("img"),
		imgUrl = document.querySelector('._checkVisible').src;
	img.src = imgUrl;

	img.onload = function() {
		var heightResizeFactor = img.height / document.querySelector('._checkVisible').height;

		img.style.visibility = 'hidden';
		document.body.appendChild(img);

		console.log("Detected frame width: " + img.clientWidth + "px");
		resizeFrames(img.clientWidth);
		resizeViewer(heightResizeFactor);
	};
}

function resizeFrames(width) {
	var imageList = document.querySelectorAll('._checkVisible'),
		containerDivs = document.querySelectorAll('.flick-ct'),
		imageWidth = width,
		containerMargin = (document.body.clientWidth - imageWidth) / 2;
	containerMargin = "0px " + containerMargin + "px";

	for (var i = 0; i < imageList.length; i++) {
		var image = imageList[i],
			container = containerDivs[i];

		container.style.width = width + "px";
		container.style.margin = containerMargin;
		image.src = image.src.replace("?type=q70", "");
	}
}

function resizeViewer(factor) {
	var viewer = document.querySelector('#_viewer'),
		height = Number(viewer.style.height.replace('px', '')) * factor;
	viewer.style.height = height + "px";
}

main();