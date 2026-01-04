// ==UserScript==
// @name           MISC Image Utilities
// @namespace      https://github.com/w4tchdoge
// @version        3.5.4-20250207_193332
// @description    Miscellaneous IMG related utilities
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://cdn.discordapp.com/*
// @match          *://media.discordapp.net/*
// @match          *://pbs.twimg.com/media/*
// @match          *://preview.redd.it/*
// @grant          GM_registerMenuCommand
// @grant          GM.registerMenuCommand
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license        AGPL-3.0-or-later
// @history        3.5.4 — Switch the order of Discord search params that get added to the new URL so that my ones can override any existing ones
// @history        3.5.3 — Make Discord IMG fix compatible with the "new" Discord IMG search params
// @history        3.5.2 — Fix issue when encountering preview.redd.it image URLs with the post title in the URL pathname
// @history        3.5.1 — Hard-disable script autorunning on Discord attachments
// @history        3.5.0 — Overhaul script to use URL() function/method for parsing and making URLs
// @history        3.4.0 — Added support for Discord banner images
// @downloadURL https://update.greasyfork.org/scripts/467413/MISC%20Image%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/467413/MISC%20Image%20Utilities.meta.js
// ==/UserScript==

/* SCRIPT GOES FUCKY WUCKY IF YOU SET THIS TO TRUE, EXCEPT NOT ANYMORE XD */
const discord_autofix = true;
const twitter_autofix = false;
const ireddit_autofix = true;


const currPG_URL = new URL(window.location.href);

function generic_Discord_IMG_Fix(x) {
	const init_url = new URL(window.location);
	let file_extension;

	if (Boolean(x)) {
		file_extension = x;
	} else {
		file_extension = init_url.pathname.split('.').at(1).toString();
	}

	const usr_search_params = {
		size: `4096`,
		quality: `lossless`
	};

	const search_params = (() => {
		let output_search_params = new URLSearchParams();
		const init_search_params = Object.fromEntries(init_url.searchParams.entries());

		Object.entries(init_search_params).forEach(
			([k, v]) => {
				output_search_params.set(k, v);
			}
		);
		Object.entries(usr_search_params).forEach(
			([k, v]) => {
				output_search_params.set(k, v);
			}
		);

		return output_search_params.toString();
	})();

	const new_url = new URL(`${init_url.pathname.split('.').at(0)}.${file_extension}?${search_params}`, `https://${init_url.hostname}`);

	return new_url;
}

if (currPG_URL.hostname.includes(`discordapp`)) {
	function Discord_IMG_Fix(override) {
		var new_url;

		if (currPG_URL.pathname.includes(`.webp`) || Boolean(override)) {
			new_url = generic_Discord_IMG_Fix(`png`);
		} else {
			new_url = generic_Discord_IMG_Fix();
		}

		// console.log(new_url.toString());

		window.location.href = new_url;
	}

	function DIF_override() {
		Discord_IMG_Fix(`override`);
	}

	GM.registerMenuCommand(`Discord – Image → PNG`, DIF_override);
	GM.registerMenuCommand(`Discord – Lossless Image`, Discord_IMG_Fix);

	if (discord_autofix === true && !currPG_URL.pathname.includes(`/attachments/`) && currPG_URL.pathname.includes(`webp`) && currPG_URL.searchParams.has(`quality`) === false) {
		Discord_IMG_Fix();
	}
	if (discord_autofix === true && !currPG_URL.pathname.includes(`/attachments/`) && (currPG_URL.searchParams.has(`quality`) === false || currPG_URL.searchParams.has(`size`) === false)) {
		Discord_IMG_Fix();
	}
}

if (currPG_URL.hostname.includes(`twimg`)) {
	function Twitter_Image2PNG() {
		var init_url = new URL(window.location.href);
		var new_url = new URL(`https://pbs.twimg.com`);

		new_url.pathname = init_url.pathname.split('.')[0];

		var search_params = {
			format: `png`,
			name: `4096x4096`
		};

		Object.entries(search_params).forEach(
			([k, v]) => {
				new_url.searchParams.append(k, v);
			}
		);

		window.location.href = new_url;
	}

	GM.registerMenuCommand(`Twitter – Image → PNG`, Twitter_Image2PNG);

	if (twitter_autofix === true && currPG_URL.search.includes(`4096x4096`) === false) {
		Twitter_Image2PNG();
	}
}

if (currPG_URL.hostname == `preview.redd.it`) {
	function i_redd_it_FixPreview() {
		const init_url = window.location;

		if (ireddit_autofix == true) {
			window.stop();
		}

		// Extract just the filename from the path of a URL like https://preview.redd.it/gen-z-deciding-who-serves-and-who-protects-v0-117e4bxr7bce1.jpeg
		const new_path = init_url.pathname.split(`/`).slice(-1).toString().split(/[\(\)_-]/).at(-1);

		const new_url = new URL(new_path, `https://i.redd.it`);

		if (ireddit_autofix == true) {
			window.location.replace(new_url);
		} else {
			window.location.href = new_url;
		}
	}

	GM.registerMenuCommand(`Reddit – preview.redd.it → i.redd.it`, i_redd_it_FixPreview);

	if (ireddit_autofix === true) {
		i_redd_it_FixPreview();
	}
}