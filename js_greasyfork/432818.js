// ==UserScript==
// @name         video-translation
// @version      0.3
// @description  voice-over translation
// @author       kamran
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_addElement
// @namespace https://greasyfork.org/users/818043
// @downloadURL https://update.greasyfork.org/scripts/432818/video-translation.user.js
// @updateURL https://update.greasyfork.org/scripts/432818/video-translation.meta.js
// ==/UserScript==

const headers = {
	Host: "api.browser.yandex.ru",
	Connection: "keep-alive",
	Pragma: "no-cache",
	"Cache-Control": "no-cache",
	Accept: "application/x-protobuf",
	"Content-Type": "application/x-protobuf",
	"Sec-Fetch-Site": "none",
	"Sec-Fetch-Mode": "no-cors",
	"Sec-Fetch-Dest": "empty",
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 YaBrowser/21.8.3.614 Yowser/2.5 Safari/537.36",
	"Accept-Language": "ru,en;q=0.9",
	"Accept-Encoding": "gzip, deflate",
};

const fragment = document.createDocumentFragment();
const div = document.createElement("div");
div.style.cssText =
	"margin: 0px; padding: 0px; position: fixed; top: 12px; right: 330px; z-index: 9999;";
const btn = document.createElement("button");
btn.style.cssText =
	"width: 30px; height: 30px; border-radius: 50px; background: crimson;";
div.appendChild(btn);
fragment.appendChild(div);
document.body.appendChild(fragment);
const audio = new Audio();

GM_addElement(document.body, 'div', {
	class: 'volume'
});

GM_addElement(document.querySelector('.volume'), 'div', {});

GM_addElement(document.querySelector('.volume'), 'div', {});

GM_addElement(document.querySelector('.volume > div:nth-child(1)'), 'p', {
	textContent: 'video'
});

GM_addElement(document.querySelector('.volume > div:nth-child(1)'), 'input', {
	type: 'range',
	class: 'video-volume',
	name: 'volume',
	min: '0',
	max: '100'
});

GM_addElement(document.querySelector('.volume > div:nth-child(2)'), 'p', {
	textContent: 'audio'
});

GM_addElement(document.querySelector('.volume > div:nth-child(2)'), 'input', {
	type: 'range',
	class: 'audio-volume',
	name: 'volume',
	min: '0',
	max: '100'
});

GM_addStyle(`
	.volume {
  		display: inline-block;
  		background-color: crimson;
  		text-align: center;
  		color: white;
  		border-radius: 5px;
		position: fixed;
		top: 2px;
		right: 230px;
		z-index: 9999;
	}

	input {
		width: 80px;
		height: 3px;
	}
`)

document.addEventListener("transitionend", function(e) {
	if (e.target.id === "progress") {
		audio.src = "";
	}
});

// click
btn.addEventListener("click", async function() {
	const video = document.querySelector("video");
	let urlAudio = await getURL().then((responseText) => responseText.match(/(https.*)/)[1]);
	console.log(urlAudio);
	//getURL().then((responseText) => console.log(responseText));
	audio.src = urlAudio;

	const videoVolume = document.querySelector('.video-volume');
	videoVolume.addEventListener('input', function(e) {
		document.querySelector("video").volume = e.target.value / 100;
	})

	const audioVolume = document.querySelector('.audio-volume');
	audioVolume.addEventListener('input', function(e) {
		audio.volume = e.target.value / 100;
	})

	if (!video.paused) {
		audio.volume = video.volume;
		audio.currentTime = video.currentTime;
		audio.play();
	}

	// volumechange
	// video.addEventListener("volumechange", function(e) {
	// 	if (!e.target.muted) {
	// 		audio.volume = e.target.volume;
	// 	} else {
	// 		audio.volume = 0;
	// 	}
	// });

	// playing
	video.addEventListener("playing", function(e) {
		audio.currentTime = e.target.currentTime;
	});

	// play
	video.addEventListener("play", function(e) {
		audio.currentTime = e.target.currentTime;
		audio.play();
	});

	// pause
	video.addEventListener("pause", function(e) {
		audio.currentTime = e.target.currentTime;
		audio.pause();
	});

	// waiting
	video.addEventListener("waiting", function(e) {
		audio.currentTime = e.target.currentTime;
		audio.pause();
	});

	// canplay
	video.addEventListener("canplay", function(e) {
		audio.currentTime = e.target.currentTime;
		audio.play();
	});
});

function getURL() {
	const videoID = window.location.search.match(/v=(\w*)/)[1];
	const data = `https://youtu.be/${videoID}(`;
	console.log(videoID);
	console.log(data);
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: "POST",
			url: "https://api.browser.yandex.ru/video-translation/translate",
			headers: headers,
			data: data,
			// onerror: err => reject(err),
			onload: (response) =>
				resolve(response.responseText),
				//resolve(response)
		});
	});
}