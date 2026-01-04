// ==UserScript==
// @name         Tumblr HD Video Download Buttons
// @namespace    TumblrVideoReszr
// @description  Automatically redirect Tumblr video links to raw HD versions, and display a download button below videos
// @version      3.1
// @author       Kai Krause <kaikrause95@gmail.com>
// @match        http://*.tumblr.com/*
// @match        https://*.tumblr.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      tumblr.com
// @downloadURL https://update.greasyfork.org/scripts/32038/Tumblr%20HD%20Video%20Download%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/32038/Tumblr%20HD%20Video%20Download%20Buttons.meta.js
// ==/UserScript==

// Typical Video URL Patterns:
// https://vt.media.tumblr.com/tumblr_ID_NUM.mp4
// https://vtt.tumblr.com/tumblr_ID_NUM.mp4
// https://vt.tumblr.com/tumblr_ID_NUM.mp4
// https://ve.tumblr.com/tumblr_ID_NUM.mp4

var loc = location.toString();

// ----------------------------------------
// DIRECT MP4 URLS
// ----------------------------------------

function redirectToHD() {
	// Check that the URL is a ~.mp4
	if (!loc.endsWith('.mp4')) return;

	var lowQuality = /[$_]\d*.mp4$/;
	// Do not redirect if already HD
	if (!loc.match(lowQuality)) return;
	// Change to HD
	loc = loc.replace(lowQuality, '.mp4');

	// If the URL is HTTP, change it to HTTPS
	if (!loc.startsWith('https://')) {
		loc = loc.replace(/^http/, 'https');
	}

	// Redirect to the HD video
	location.replace(loc);
}
redirectToHD();

// ----------------------------------------
// DOWNLOAD BUTTON STYLE
// ----------------------------------------

// Create the button style
var downloadButtonStyle = document.createElement("style");
downloadButtonStyle.innerText = ".videoDownloadButtonStyle_kk{display:table !important; width:100% !important; padding:6px !important; border:2px solid #979EA8 !important; background-color:#2F3D51 !important; color: #979EA8 !important; line-height: 100% !important; font-family:'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 600 !important; text-align: center !important; font-style: normal !important; text-decoration: none !important} .videoDownloadButtonStyle_kk:hover{color:#F5F5F5 !important;}";
document.head.appendChild(downloadButtonStyle);

// ----------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------

// Dynamic function wrapper
function dynamicScroll (f) {
	window.addEventListener("scroll", (function(){
		f();
	}), false);
}

function fixVideoUrl(videoURL) {
	videoURL = videoURL.replace(/\d+(?=\.media)/, 'vt');
	videoURL = videoURL.replace(/[^_]*$/, '');
	videoURL = videoURL.replace(/_$/, '.mp4');
	return videoURL;
}

function createBtn(videoURL) {
	// Create the button
	var downloadButton = document.createElement('a');
	downloadButton.innerText = 'Download This Video (HD)';
	// Set and style the download button
	downloadButton.setAttribute('class', 'videoDownloadButtonStyle_kk');
	downloadButton.setAttribute('href', videoURL);
	downloadButton.setAttribute('target', '_blank');
	downloadButton.setAttribute('download', videoURL);
	return downloadButton;
}

// ----------------------------------------
// DASHBOARD BUTTONS
// ----------------------------------------

function dashboardDownloadButtons() {
	// Tumblr uses two class names that only differ by "-" and "_". The former used for blogs, and the latter for the dashboard.
	var posts = document.getElementsByClassName('post-wrapper');
	if (!posts[0]) posts = document.getElementsByClassName('post_wrapper');
	if (!posts[0]) posts = document.getElementsByClassName('text-post'); // blogs...

	for (var i = 0; i < posts.length; ++i) {
		var videos = posts[i].getElementsByTagName('video');
		if (videos[0]) {
			for (var a = 0; a < videos.length; ++a) {
				// if the button already exists, ignore this post
				var btnCheck = posts[i].getElementsByClassName('videoDownloadButtonStyle_kk');
				if (btnCheck[0]) continue;

				// Generate the video URL
				var videoURL;
				// Check whether the video is a livePhoto
				var livePhoto = videos[a].getAttribute("class");
				if (livePhoto && livePhoto == "live-photo-video") {
					videoURL = videos[a].src;
				}
				// Otherwise, use the video preview image url
				else if (videos[a].poster) {
					videoURL = videos[a].poster;
					videoURL = fixVideoUrl(videoURL);
				} else {
					continue;
				}

				var downloadBtn = createBtn(videoURL);

				var belowVideo = "";
				// reblogged videos
				if (!belowVideo) belowVideo = posts[i].getElementsByClassName('reblog-content')[0];
				// normal videos
				if (!belowVideo) belowVideo = posts[i].getElementsByClassName('post_media')[0];
				if (!belowVideo) belowVideo = posts[i].getElementsByClassName('tmblr-full')[0];
				if (!belowVideo) belowVideo = posts[i].getElementsByTagName('figure')[0];
				/*
				// This will a) not load-in because tumblr's JS overwrites it, and b) displays underneath the video player control bar somehow...
				if (!belowVideo) {
					var crtVideo = posts[i].getElementsByClassName('post_body')[0].getElementsByTagName("div")[0];
					if (crtVideo.hasAttribute("data-crt-video")) belowVideo = crtVideo;
				}*/
				if (!belowVideo) belowVideo = posts[i].getElementsByClassName('post_body')[0];
				belowVideo.appendChild(downloadBtn);
				// consider displaying the button above videos, due to tumblr changes and the problem of displaying it below videos
				//belowVideo.insertBefore(downloadButton, belowVideo.childNodes[0]);
			}
		}
	}
}
if (location.hostname.includes("tumblr.com")) {
	if (loc.endsWith('.com/') || loc.includes('tumblr.com/dashboard') || loc.includes('tumblr.com/post') || loc.includes('tumblr.com/like')
		|| loc.includes('tumblr.com/search/') || loc.includes('tumblr.com/tagged')) {
		window.addEventListener("DOMContentLoaded", function load() {
			window.removeEventListener("DOMContentLoaded", load, false);
			// For initial page load
			dashboardDownloadButtons();
			// For endless scrolling users
			dynamicScroll(dashboardDownloadButtons);
		}, false);
	}
}

// ----------------------------------------
// BLOG BUTTONS
// ----------------------------------------
var eDisplay = false;
function req (videoNum, video) {
	GM_xmlhttpRequest({
		url: video,
		headers: {
			":Authority": "www.tumblr.com",
			"Referer": location.href
		},
		method: 'GET',
		onload: function(response) {
			if (response.status == '200' && response.responseText) {
				try {
					var text = response.responseText;
					var a = text.match("previews.+tumblr_.+filmstrip\.") || text.match("\/tumblr_.+frame1\.");
					a[0] = a[0].replace("previews\/", "");
					a[0] = a[0].replace("_r1_filmstrip", "");
					a[0] = a[0].replace("_filmstrip", "");
					a[0] = a[0].replace("_frame1", "");
					var videoUrl = "https://vt.tumblr.com/" + a[0].toString() + "mp4";
					embedBlogDownloadButtons(videoNum, videoUrl);
				}
				catch (e) {
					if (!eDisplay) {
						window.alert("There was a problem embedding video download buttons. Please report this at the below site. （動画のダウンロードボタンの埋め込みに問題が発生しました。下のサイトまで報告してください。）\n\nhttps://greasyfork.org/en/scripts/32038-tumblr-hd-video-download-buttons\n\n" + "The problem is (発生した問題は):\n" + e);
						eDisplay = true;
					}
					console.error(e);
				}
			}
		}
	});
}
var videoCache = [];
function blogDownloadButtons() {
	// Get the iframe of this post, which has the video URL
	var frames = document.getElementsByTagName("iframe");
	for (var i = 0; i < frames.length; i++) {
		var frame = frames[i];

		// Check whether this is a video
		if (!frame.src.includes("/video/")) continue;
		// if the button already exists, ignore this post
		var frameParent = frame.parentNode;
		var btnCheck = frameParent.getElementsByClassName('videoDownloadButtonStyle_kk');
		if (videoCache.indexOf(frame.src) > -1 || btnCheck[0]) continue;
		// Cache the current post ID
		videoCache.push(frame.src);

		// Get the video url via a crossDomain request from the iframe
		var videoNum = i;
		req(videoNum, frame.src);
	}
}
function embedBlogDownloadButtons (videoNum, videoURL) {
	var frames = document.getElementsByTagName("iframe");
	var frame = frames[videoNum];
	var frameParent = frame.parentNode;
	var downloadBtn = createBtn(videoURL);
	frameParent.appendChild(downloadBtn);
}
if (location.hostname.includes('tumblr.com') && location.hostname != 'tumblr.com') {
	window.addEventListener("DOMContentLoaded", function load() {
		window.removeEventListener("DOMContentLoaded", load, false);
		// For initial page load
		blogDownloadButtons();
		dashboardDownloadButtons();
		// For endless scrolling users
		dynamicScroll(blogDownloadButtons);
		dynamicScroll(dashboardDownloadButtons);
	}, false);
}
