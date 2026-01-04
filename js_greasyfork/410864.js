// ==UserScript==
// @name         Color OP
// @namespace    https://www.jeuxvideo.com/
// @version      0.2
// @description  Change la couleur de l'auteur dans un sujet
// @author       Lúthien Sofea Elanessë
// @match        https://www.jeuxvideo.com/forums/42-*
// @match        https://www.jeuxvideo.com/forums/1-*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410864/Color%20OP.user.js
// @updateURL https://update.greasyfork.org/scripts/410864/Color%20OP.meta.js
// ==/UserScript==
// jshint esversion:8

(async function() {
    'use strict';
	
	var withSaves = true;
	let url = new RegExp("^https?://www.jeuxvideo.com/forums/(42|1)-[0-9]+-([0-9]+)-", "i").exec(location.href);
	if (url) {
		let op = await getOp(url[2]);
		searchOp(op);
	}
	async function getOp(topic) {
		let saveKey = "colorOp-" + topic;
		let load = withSaves ? localStorage.getItem(saveKey) : null;
		if (!load) {
			let xhr = await getXhr(document.getElementsByClassName("bloc-date-msg")[0].firstElementChild.href);
			load = extractOp(xhr);
			if (withSaves) {
				localStorage.setItem(saveKey, load);
			}
		}
		return load.toLowerCase();
	}
	function getXhr(url) {
		return new Promise(function (resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.onerror = () => {
				reject({
					status: xhr.status,
					statusText: xhr.statusText
				});
			};
			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 400) {
					resolve(xhr);
				} else {
					xhr.onerror();
				}
			};
			xhr.send();
		});
	}
	function extractOp(xhr) {
		return xhr.responseURL
				.split("jeuxvideo.com/")[1]
				.split("/").shift()
				.trim();
	}
	function searchOp(op) {
		Array.from(document.getElementsByClassName("bloc-pseudo-msg")).forEach(bloc => {
			let pseudo = bloc.innerText.trim().toLowerCase();
			if (pseudo === op) {
				bloc.className += " bloc-op-msg";
			}
		});
		addStyle();
	}
	function addStyle() {
		let style = document.createElement("style");
		style.type = "text/css";
		style.appendChild(document.createTextNode([
			".bloc-op-msg.bloc-pseudo-msg {color: blue;}",
			".bloc-op-msg.bloc-pseudo-msg.text-modo {color: gray !important;}",
			".bloc-op-msg.bloc-pseudo-msg.text-admin {color: hotpink !important;}",
		].join("\r\n")));
		document.head.appendChild(style);
	}
})();
