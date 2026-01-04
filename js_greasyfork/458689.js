// ==UserScript==
// 
// @name Video / Gif downloader from the new design of redgifs.com (v3)
// @name:en Video / Gif downloader from the new design of redgifs.com (v3)
// @name:ru Загрузка видео / гиф с нового дизайна redgifs.com(v3)
// @name:de Lädt Videos / Gifs von dem neuen Design der Seite redgifs.com(v3)
// 
// @description Gather all information about video / gif and create a download button in the sidebar of videos / gif
// @description:en Gather all information about video / gif and create a download button in the sidebar of videos / gif
// @description:ru Собирает информацию о видео / гифке и предоставляет в боковом меню видео / гифки ссылку для загрузки
// @description:de Sammelt die nötigen Informationen über das Video / Gif in dem neuen redgifs.com (v3) Design
// 
// @match https://*.redgifs.com
// @match https://*.redgifs.com/*
// 
// @namespace RedGifsDownloader
// @author Maxim Harder (2023 @ DevCraft.club)
// @license MIT
// @version 1.0.0
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/458689/Video%20%20Gif%20downloader%20from%20the%20new%20design%20of%20redgifscom%20%28v3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458689/Video%20%20Gif%20downloader%20from%20the%20new%20design%20of%20redgifscom%20%28v3%29.meta.js
// ==/UserScript==
function getVideoDownloadMod() {
	let videos_tall = document.querySelectorAll('[class="active player preview tall"] video');
	let videos_wide = document.querySelectorAll('[class="active player preview wide"] video');
	let videos = [];

	for (let i = 0, max = videos_tall.length; i < max; i++) {
		videos.push(videos_tall[i]);
	}

	for (let i = 0, max = videos_wide.length; i < max; i++) {
		videos.push(videos_wide[i]);
	}

	if (videos.length > 0) {
		let video_src = videos[0].src;
		let sidebar_elements = document.querySelectorAll('[class="active player preview tall"] div[class="sideBar"]>*');
		if (sidebar_elements.length == 0) sidebar_elements = document.querySelectorAll('[class="active player preview wide"] div[class="sideBar"]>*');
		let last_sb_el = sidebar_elements[sidebar_elements.length - 1];
		let sidebar = document.querySelectorAll('[class="active player preview tall"] div[class="sideBar"]')[0];
		if (sidebar == undefined) sidebar = document.querySelectorAll('[class="active player preview wide"] div[class="sideBar"]')[0];

		let active_download_tall = document.querySelectorAll('[class="active player preview tall"] div[class="sideBar"] .download-mod');
		let active_download_wide = document.querySelectorAll('[class="active player preview wide"] div[class="sideBar"] .download-mod');

		let video_div = document.querySelectorAll('[class="active player preview tall"]')[0];
		if (video_div == undefined) video_div = document.querySelectorAll('[class="active player preview wide"]')[0];
		let video_id = video_div.id;

		let storage_id = localStorage.getItem('download-mod-id');

		let download_btn = `<div class="download-mod"><img src="https://www.svgrepo.com/download/489722/download.svg" style="width: 100%;height: 100%; color: white;filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(86deg) brightness(116%) contrast(83%); cursor:pointer;" onclick="window.open('${video_src}')"></div>`;

		if (video_id != storage_id) {
			for (let i = 0, max = active_download_tall.length; i < max; i++) {
				let el = active_download_tall[i];
				el.parent.removeChild(el);
			}
			for (let i = 0, max = active_download_wide.length; i < max; i++) {
				let el = active_download_wide[i];
				el.parent.removeChild(el);
			}

			last_sb_el.insertAdjacentHTML('afterend', download_btn);

			localStorage.setItem('download-mod-id', video_id);

		}
	}
}


const download_mod_video = (path, filename) => {
	// Create a new link
	const anchor = document.createElement('a');
	anchor.href = path;
	anchor.download = filename;

	// Append to the DOM
	document.body.appendChild(anchor);

	// Trigger `click` event
	anchor.click();

	// Remove element from DOM
	document.body.removeChild(anchor);
};


setInterval(() => {
	getVideoDownloadMod();
}, 1000);
