// ==UserScript==
// @name         Tumblr Images to HD Redirector
// @namespace    TumblrImgReszr
// @description  Automatically promotes Tumblr image links to raw HD versions
// @version      2.5
// @author       Kai Krause <kaikrause95@gmail.com>
// @include      /^https?://.+\.media\.tumblr\.com.+?(jpe?g|png|bmp|gif)/
// @grant        GM_xmlhttpRequest
// @connect      tumblr.com
// @connect      s3.amazonaws.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/31593/Tumblr%20Images%20to%20HD%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/31593/Tumblr%20Images%20to%20HD%20Redirector.meta.js
// ==/UserScript==

var imageSizes = ['raw', '1280', '540', '500', '400', '250', '100'];

function checkSize(i) {
	i = i || 0;
	var loc = location.origin + location.pathname;
	var imageSize = loc.match(/\d+(?=.\w+$)/)[0];
	var imageType = "." + loc.match(/[^.]*$/)[0];
	var imageSizeType = imageSize + imageType;

	// Do not redirect if already HD
	if (i > imageSizes.length || parseInt(imageSize) >= parseInt(imageSizes[i]) || loc.includes('_raw')) {
		document.body.style.cursor = "";
		return;
	}

	document.body.style.cursor = "progress"; // Show loading cursor

	// Create the HD image url
	var imageNextSizeType = imageSizes[i] + imageType;
	if (imageSizes[i] == 'raw') {
		loc = loc.replace(/[^/]*media.tumblr.com/, 's3.amazonaws.com/data.tumblr.com');
		loc = loc.replace(imageSizeType, imageNextSizeType);
	} else {
		loc = loc.replace(imageSizeType, imageNextSizeType);
	}

	// If the URL is HTTP, change it to HTTPS
	if (!loc.startsWith('https://')) {
		loc = loc.replace(/^http/, 'https');
	}

	// Check that the HD image exists, then redirect to it
	GM_xmlhttpRequest({
		url: loc,
		method: 'HEAD',
		onload: function(response) {
			if (response.status == '200') {
				location.replace(loc);
			} else {
				checkSize(i+1);
			}
		},
		onerror: function (error) {
			checkSize(i+1);
		}
	});
}
checkSize();