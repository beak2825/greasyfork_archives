// ==UserScript==
// @name     asianleak hd download options
// @include  https://asianleak.com/videos/*/*/
// @grant	 none
// @description Add buttons to download multiple res of video.
// @version 0.0.1.20210416094546
// @namespace https://greasyfork.org/users/760233
// @downloadURL https://update.greasyfork.org/scripts/425119/asianleak%20hd%20download%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/425119/asianleak%20hd%20download%20options.meta.js
// ==/UserScript==

setTimeout(() => {
	console.log(window.flashvars);

	let myVars = window.flashvars;

	/*
		video_alt_url: "https://asianleak.com/get_file/1/1d61f6a55fda088acc81cd3ae03f3a7914643f1d0f/2000/2243/2243_720p.mp4/"
		video_alt_url2: "https://asianleak.com/get_file/1/4542e56d5ee5b8de37d399fe5b4183aa924016888b/2000/2243/2243_1080p.mp4/"
		video_alt_url2_hd: "1"
		video_alt_url2_text: "1080p"
		video_alt_url_hd: "1"
		video_alt_url_text: "720p"
	*/

	if (myVars.hasOwnProperty("video_alt_url")) {
		AddNewBtn(myVars.video_alt_url + "?download=true", myVars.postfix + " " + myVars.video_alt_url_text);
	}

	if (myVars.hasOwnProperty("video_alt_url2")) {
		AddNewBtn(myVars.video_alt_url2 + "?download=true", myVars.postfix + " " + myVars.video_alt_url2_text);
	}

	function AddNewBtn(videoUrl, btnText){
		let newBtn = document.createElement("a");
		newBtn.href = videoUrl;
		newBtn.innerText = btnText;
		let defaultDlBtn = document.querySelector("#tab_video_info > div > div.info > div:nth-child(5) > a");
		defaultDlBtn.parentNode.insertBefore(newBtn, defaultDlBtn.nextSibling);
	}
}, 2000);