// ==UserScript==
// @name        PSSTAudio.com Downloader
// @description This is a simple script that shows you a direct link to audio file that you want to download.
// @license     Creative Commons Zero v1.0 Universal
// @supportURL  https://github.com/q2p/PSSTAudio-Link-Exporter
// @author      q2p
// @namespace   q2p
// @version     0.4
// @include     https://psstaudio.com/post/*
// @include     https://www.psstaudio.com/post/*
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/413695/PSSTAudiocom%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/413695/PSSTAudiocom%20Downloader.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const page_content = document.getElementsByClassName("page-content")[0];
	const card_body = page_content.getElementsByClassName("card-body")[0];
	const title = card_body.getElementsByClassName("card-title")[0].textContent;
	const description = card_body.getElementsByClassName("card-text")[0].textContent;
	const audio = card_body.getElementsByTagName("audio")[0];
	const audio_src = audio.firstElementChild.src;

	const link_container = document.createElement("div");
	const link = document.createElement("a");
	link.href = audio_src;
	link.download = title+" "+description+".mp3";
	link.textContent = "Download Link";
	link_container.appendChild(link);
	card_body.appendChild(link_container);
})();
