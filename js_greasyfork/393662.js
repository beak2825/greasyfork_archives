// ==UserScript==
// @name        ZooCab Download
// @description Adds download buttons on videos
// @namespace   ZooCab-Download
// @version     1.2
// @grant       none
// @run-at      document-idle
// @include     https://video.zoo.cab/video/*/*
// @include     https://animalporn.rocks/video*/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/393662/ZooCab%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/393662/ZooCab%20Download.meta.js
// ==/UserScript==

(function () {
	// add download buttons
	const wrapper = document.getElementById("wrapper"),
	notPrivate = document.getElementsByClassName("text-danger")[0].style.display == "none";
	let download_html = "", video_url = "";

	// fetch and manipulate content
	const data = wrapper.children[3].innerHTML,
	video_id = data.match(/vid = (\d+)/m)[1],
	video_title = document.title.match(/(.+) - AnimalPorn.rocks Beastiality Videos$/m) ? document.title.match(/(.+) - AnimalPorn.rocks Beastiality Videos$/m)[1] : "Unknown Title",
	webseed = data.match(/h264Base = '([\/\w]+)/m)[1],
	iphoneVideo = /iphoneVideo = (true)/.test(data),
	files = JSON.parse(data.match(/(\[\{[\\\"\w\:\,\.\}\]\{]+)/)[0].replace("\\",""));
	if (iphoneVideo) {
		download_html = `<div class='pull-right m-l-5'><a target='_blank' href='https://video.zoo.cab/media/videos/iphone/${video_id}.mp4' class='btn btn-default'><i class='glyphicon glyphicon-download-alt'></i><span class='hidden-xs'>SD</span></a></div><div class='pull-right m-l-5'><a target='_blank' href='https://video.zoo.cab/media/videos/hd/${video_id}.mp4' class='btn btn-default'><i class='glyphicon glyphicon-download-alt'></i> <span class='hidden-xs'>HD</span></a></div>`
		video_url = `https://video.zoo.cab/media/videos/iphone/${video_id}.mp4`
	}
	else {
		for (const file of files) {
			download_html += `<div class='pull-right m-l-5'><a target='_blank' href='http://cdn.sloppyta.co${webseed}${file.file}' class='btn btn-default'><i class='glyphicon glyphicon-download-alt'></i> <span class='hidden-xs'>${file.label}</span></a></div>`;
		}
		video_url = `http://cdn.sloppyta.co${webseed}${files[files.length-1].file}`;
	}
	console.info("Download Info:", video_title, video_id, files);

	// insert elements
	if (notPrivate) {
		const controls = document.getElementById("share_video").parentNode;
		if (controls) {
			const downloadMenu = document.createElement("div");
			downloadMenu.style.width = "100%";
			downloadMenu.className = "pull-right m-t-15";
			downloadMenu.innerHTML = download_html;
			controls.parentNode.insertBefore(downloadMenu, controls.nextSibling);
		}
		else {
			console.error("Can't find controls?");
		}
	}
	else {
		wrapper.getElementsByClassName("container")[0].innerHTML = `<div class='row'><div class='col-md-8'><h3 class='hidden-xs big-title-truncate m-t-0'>${video_title}</h3></div></div><div class='row'><div class='col-md-8'><div class='video-container'><div class='video-js vjs-16-9'><video class='vjs-tech' poster='https://video.zoo.cab/media/videos/tmb/${video_id}/default.jpg' tabindex='-1' controls src='${video_url}'></video></div></div><div class='pull-right m-t-15' style='width: 100%;'>${download_html}</div></div></div>`;
	}
})();