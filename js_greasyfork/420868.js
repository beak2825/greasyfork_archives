// ==UserScript==
// @name        Chirbit.com Chirb.it Downloader
// @description This is a simple script that shows you a direct link to audio file that you want to download.
// @license     Creative Commons Zero v1.0 Universal
// @supportURL  https://github.com/q2p/Chirbit-Link-Exporter
// @author      q2p
// @namespace   q2p
// @version     0.4
// @include     http://chirb.it/*
// @include     https://chirb.it/*
// @include     http://chirbit.com/*
// @include     https://chirbit.com/*
// @include     http://www.chirbit.com/*
// @include     https://www.chirbit.com/*
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/420868/Chirbitcom%20Chirbit%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/420868/Chirbitcom%20Chirbit%20Downloader.meta.js
// ==/UserScript==

(function() {
	'use strict';
	function make_link(name, title, fd) {
		const file = "https://" + atob(fd.split("").reverse().join("")).replace("http://","").replace("https://","");
		const link_container = document.createElement("div");
		const link = document.createElement("a");
		link.href = file;
		link.download = name+" - "+title+".mp3";
		link.target = "_blank";
		link.textContent = "Download Link";
		link_container.appendChild(link);
		return link_container;
	}
	const full_name = document.getElementsByClassName("profile-fullname");
	const chirbit_username = document.getElementById("chirbit-username");
	if (full_name.length === 0 && chirbit_username !== null) {
		const name = chirbit_username.textContent;
		const title = document.getElementsByClassName("chirbit-title")[0].textContent;
		const wavholder = document.getElementsByClassName("wavholder")[0];
		const player_buttons = wavholder.getElementsByClassName("player-buttons")[0];
		for(let e of player_buttons.getElementsByTagName("i")) {
			if (e.id.startsWith("cplayer_") && e.dataset.fd) {
				let link = make_link(name, title, e.dataset.fd);
				link.classList.add("container");
				wavholder.parentElement.insertBefore(link, wavholder.nextSibling);
				break;
			}
		}
	} else if (full_name.length === 1 && chirbit_username === null) {
		const name = full_name[0];
		const cards = document.getElementsByClassName("media");
		for(let e of cards) {
			let media_body = e.getElementsByClassName("media-body")[0];
			let title = e.getElementsByClassName("truncate")[0].textContent;
			for(let i of e.getElementsByTagName("i")) {
				if (i.id.startsWith("cplayer_") && i.dataset.fd) {
					let link = make_link(name, title, i.dataset.fd);
					link.classList.add("media_row");
					let rows = media_body.getElementsByClassName("media-row");
					media_body.insertBefore(link, rows[rows.length-1]);
					break;
				}
			}
		}
	}
})();