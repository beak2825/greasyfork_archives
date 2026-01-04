// ==UserScript==
// @name         8chan sounds player
// @version      2.3.0_0052
// @namespace    8chanss
// @description  Play that faggy music weeb boi
// @author       original by: RCC; ported to 8chan by: soundboy_1459944
// @website      https://greasyfork.org/en/scripts/533468
// @match        *://*.8chan.moe/*/*/*.html
// @match        *://*.8chan.se/*/*/*.html
// @match        *://*.8chan.st/*/*/*.html
// @match        *://*.8chan.cc/*/*/*.html
// @match        *://*.8ch.moe/*/*/*.html
// @match        *://*.alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*/*/*.html
// @connect      4chan.org
// @connect      4channel.org
// @connect      a.4cdn.org
// @connect      8chan.moe
// @connect      8chan.se
// @connect      8chan.st
// @connect      8chan.cc
// @connect      desu-usergeneratedcontent.xyz
// @connect      arch-img.b4k.co
// @connect      arch-img.b4k.dev
// @connect      archive-media-0.nyafuu.org
// @connect      4cdn.org
// @connect      a.pomf.cat
// @connect      pomf.cat
// @connect      litter.catbox.moe
// @connect      files.catbox.moe
// @connect      catbox.moe
// @connect      share.dmca.gripe
// @connect      z.zz.ht
// @connect      z.zz.fo
// @connect      zz.ht
// @connect      too.lewd.se
// @connect      lewd.se
// @connect      *
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM_addValueChangeListener
// @grant        GM_getResourceURL
// @grant        GM_addElement
// @run-at       document-start
// @license      CC0 1.0
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik02LjAzMiA1LjYzNHYxMi43MzJhLjc5Ni43OTYgMCAwIDAgMS4yMTIuNjc5bDEwLjM0Ni02LjM2N2EuNzk2Ljc5NiAwIDAgMCAwLTEuMzU2TDcuMjQ0IDQuOTU2YS43OTUuNzk1IDAgMCAwLTEuMjEyLjY3OFoiLz48L2RlZnM+PHBhdGggZD0iTTE5LjkxLjVIMy45M0EzLjQxIDMuNDEgMCAwIDAgLjUgMy45M3YxNS45OWMwIDEuOSAxLjUyIDMuNDMgMy40MyAzLjQzaDE1Ljk5YzEuOSAwIDMuNDMtMS41MiAzLjQzLTMuNDNWMy45M2MwLTEuOS0xLjUyLTMuNDMtMy40My0zLjQzWiIgc3R5bGU9ImZpbGw6IzAzOWJlNTtzdHJva2U6I2ZmZiIvPjx1c2UgaHJlZj0iI2EiIHN0eWxlPSJmaWxsOiMwMjU2N2E7c3Ryb2tlOiMwMjU2N2E7c3Ryb2tlLW1pdGVybGltaXQ6MjtzdHJva2Utd2lkdGg6M3B4O2ZpbHRlcjpibHVyKC4xcHgpIi8+PHVzZSBocmVmPSIjYSIgc3R5bGU9ImZpbGw6IzAxMzE0NztzdHJva2U6IzAxMzE0NztzdHJva2UtbWl0ZXJsaW1pdDoyO3N0cm9rZS13aWR0aDozcHg7ZmlsdGVyOmJsdXIoMS41cHgpIi8+PHVzZSBocmVmPSIjYSIgc3R5bGU9ImZpbGw6I2ZmZjtzdHJva2U6I2ZmZjtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6M3B4Ii8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/533468/8chan%20sounds%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/533468/8chan%20sounds%20player.meta.js
// ==/UserScript==

//kudos to the original sound player by RCC: https://github.com/rcc11/4chan-sounds-player

// TO DO:
// add support for:
// @match        *://boards.4chan.org/*
// @match        *://boards.4channel.org/*
// @match        *://*.desuarchive.org/*
// note: partially done, Module 32 (Inline Player) unfinished
//
// combine parsePost8chan and parsePost4chan to reduce duplication.
// finish inline-player
// finish play-on-hover
// inline player: improve play controls (drag volume/seek-bar)
// Where possible, combine Module 6 (Controls) and Module 32 (Inline Player) to reduce duplication.
// FIX BUG: multiple instances: playlist gets emptied on playlist style change (caused by settings/storage somehow)
// multiple instances: settings arent perfectly in sync
// multiple instances: store and sync media/video size
// HANDLE module 6, play function, Case 2: if (externalVideo.videoWidth === 0 && externalVideo.videoHeight === 0), treat externalVideoSrc as audio and use imageSrc for video
// make Dropdown Menu logic modular (_handleMenu, _handleDropdownMenu, Player.templates.itemMenu)
// make _handleDropdownMenu customizable
// gallery view: make items per row customizable (fc-sounds-gallery-container: grid-template-columns, grid-auto-rows)
// consider: id="fc-sounds-container" positioning (top,left) use % instead of px

// Webpack Module Execution Order
//	Module 3 (Entry)
//	→ Module 4 (Globals)
//	→ Module 2 (Core Player)
//		→ Module 5 (Settings)
//		→ Module 6 (Controls)
//		→ Module 7 (Display)
//		→ Module 8 (Events)
//		→ Module 9 (Footer)
//		→ Module 10 (Header)
//		→ Module 11 (Hotkeys)
//		→ Module 12 (Minimised)
//		→ Module 13 (Playlist)
//		→ Module 14 (Position)
//		→ Module 15 (Threads)
//		→ Module 17 (UserTemplate)
//		→ Module 32 (Inline Player)
//	→ Module 0 (File Parser)
(function(modules) { // webpackBootstrap
	'use strict';

	// The module cache
	var installedModules = {};

	// The require function
	function __webpack_require__(moduleId) {

		// Check if module is in cache
		if (installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		// Create a new module (and put it into the cache)
		var module = installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		};

		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		// Flag the module as loaded
		module.l = true;

		// Return the exports of the module
		return module.exports;
	}


	// expose the modules object (__webpack_modules__)
	__webpack_require__.m = modules;

	// expose the module cache
	__webpack_require__.c = installedModules;

	// define getter function for harmony exports
	__webpack_require__.d = function(exports, name, getter) {
		if (!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, {
				enumerable: true,
				get: getter
			});
		}
	};

	// define __esModule on exports
	__webpack_require__.r = function(exports) {
		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, {
				value: 'Module'
			});
		}
		Object.defineProperty(exports, '__esModule', {
			value: true
		});
	};

	// create a fake namespace object
	// mode & 1: value is a module id, require it
	// mode & 2: merge all properties of value into the ns
	// mode & 4: return value when already ns object
	// mode & 8|1: behave like require
	__webpack_require__.t = function(value, mode) {
		if (mode & 1) value = __webpack_require__(value);
		if (mode & 8) return value;
		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
		var ns = Object.create(null);
		__webpack_require__.r(ns);
		Object.defineProperty(ns, 'default', {
			enumerable: true,
			value: value
		});
		if (mode & 2 && typeof value != 'string')
			for (var key in value) __webpack_require__.d(ns, key, function(key) {
				return value[key];
			}.bind(null, key));
		return ns;
	};

	// getDefaultExport function for compatibility with non-harmony modules
	__webpack_require__.n = function(module) {
		var getter = module && module.__esModule ?
			function getDefault() {
				return module['default'];
			} :
			function getModuleExports() {
				return module;
			};
		__webpack_require__.d(getter, 'a', getter);
		return getter;
	};

	// Object.prototype.hasOwnProperty.call
	__webpack_require__.o = function(object, property) {
		return Object.prototype.hasOwnProperty.call(object, property);
	};

	// __webpack_public_path__
	__webpack_require__.p = "";

	// Load entry module and return exports
	return __webpack_require__(__webpack_require__.s = 3);
})
([
	/* 0 - File Parser
		•	parseFileName(): Extracts sound URLs from filenames using regex pattern [sound=URL]
		•	parsePost(): Processes individual posts to find sound files and create play buttons
		•	parseFiles(): Scans the page or specific elements for posts containing sounds
		•	Key Features:
			o	Handles URL decoding
			o	Creates unique IDs for each sound
			o	Generates play links next to sound files
	*/
	(function(module, exports) {
		const protocolRE = /^(https?:)?\/\//;
		const filenameRE = /(.*?)[[({](?:audio|sound)[ =:|$](.*?)[\])}]/gi;
		const filenameRE2 = /(\[([^\]]*(?:catbox\.moe)[^\]]*)\])/gi;
		const videoFileExtRE = /\.(webm|mp4|m4v|ogv|avi|mpeg|mpg|mpe|m1v|m2v|mov|wmv)$/i;
		const audioFileExtRE = /\.(mp3|m4a|m4b|flac|ogg|oga|opus|mp2|mpega|wav|aac)$/i;
		const imageMimeRE = /^image\/.+$/;
		const videoMimeRE = /^video\/.+$/;
		const audioMimeRE = /^audio\/.+$/;

		// Function to safely get file extension (handles multiple dots in filename)
		function getFileExtension(filename) {
			// Handle edge cases: no extension, hidden files, or filenames ending with dot
			if (!filename || filename.indexOf('.') === -1 || filename.endsWith('.')) {
				return '';
			}
			return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
		}

		function extractFilesize(textOrElement) {
			// Convert DOM element to text if needed
			const text = typeof textOrElement === 'string'
			? textOrElement
			: textOrElement?.textContent || textOrElement?.innerText || String(textOrElement);

			if (!text || typeof text !== 'string') {
				console.error('extractDimensions: Invalid input - expected string or DOM element');
				return null;
			}

			// Regex patterns for different file size formats
			const patterns = [
				// Pattern for: (1.87 MB, 1280x662)
				/\(([\d.,]+\s*[KMGTP]?B)\s*,\s*\d+x\d+\)/i,

				// Pattern for: 897KiB, 720x720
				/([\d.,]+\s*[KMGTP]?i?B)\s*,\s*\d+x\d+/i,

				// Pattern for: <span class="sizeLabel">43.16 KB</span>
				/sizeLabel[^>]*>([\d.,]+\s*[KMGTP]?i?B)</i,

				// General pattern: looks for number + unit pattern
				/([\d.,]+\s*[KMGTP]?i?B)/gi
			];

			for (const pattern of patterns) {
				const match = text.match(pattern);
				if (match) {
					// For the general pattern, we might get multiple matches
					if (pattern.flags.includes('g')) {
						const matches = [...text.matchAll(pattern)];
						if (matches.length > 0) {
							return matches[0][1].trim();
						}
					} else {
						return match[1].trim();
					}
				}
			}

			return null;
			//return "0 KB";
		}

		function extractDimensions(textOrElement) {
			// Convert DOM element to text if needed
			const text = typeof textOrElement === 'string'
			? textOrElement
			: textOrElement?.textContent || textOrElement?.innerText || String(textOrElement);

			if (!text || typeof text !== 'string') {
				console.error('extractDimensions: Invalid input - expected string or DOM element');
				return null;
			}

			// Regex patterns for different dimension formats
			const patterns = [
				// Pattern for: (1.87 MB, 1280x662)
				/\([^)]*?(\d+x\d+)\)/i,

				// Pattern for: 897KiB, 720x720
				/[^,]*,\s*(\d+x\d+)/i,

				// Pattern for: <span class="dimensionLabel">693x181</span>
				/dimensionLabel[^>]*>(\d+x\d+)</i,

				// General pattern: looks for digit+x+digit pattern
				/(\d+x\d+)/gi
			];

			for (const pattern of patterns) {
				const match = text.match(pattern);
				if (match) {
					// For the general pattern, we might get multiple matches
					if (pattern.flags.includes('g')) {
						const matches = [...text.matchAll(pattern)];
						if (matches.length > 0) {
							// Return the first valid dimensions match
							for (const match of matches) {
								if (isValidDimensions(match[1])) {
									return match[1].trim();
								}
							}
						}
					} else {
						if (isValidDimensions(match[1])) {
							return match[1].trim();
						}
					}
				}
			}

			return null;
		}

		function isValidDimensions(dimensions) {
			if (!dimensions) return false;

			const dimMatch = dimensions.match(/^(\d+)x(\d+)$/);
			if (!dimMatch) return false;

			const width = parseInt(dimMatch[1]);
			const height = parseInt(dimMatch[2]);

			// Basic validation: dimensions should be reasonable numbers
			return width > 0 && width < 100000 && height > 0 && height < 100000;
		}

		function determinateMimeType(extension, isVideo, isAudio) {
			let type;
			if (isVideo) {
				switch (extension) {
					case 'webm': type = 'video/webm'; break;
					case 'mp4': type = 'video/mp4'; break;
					case 'm4v': type = 'video/mp4'; break;
					case 'ogv': type = 'video/ogg'; break;
					case 'avi': type = 'video/x-msvideo'; break;
					case 'mpeg': case 'mpg': case 'mpe': case 'm1v': case 'm2v':
						type = 'video/mpeg'; break;
					default: type = 'video/mp4'; // default fallback
				}
			} else if (isAudio) {
				switch (extension) {
					case 'mp3': case 'mpega': case 'mp2': type = 'audio/mpeg'; break;
					case 'm4a': case 'm4b': type = 'audio/mp4'; break;
					case 'flac': type = 'audio/flac'; break;
					case 'ogg': case 'oga': case 'opus': type = 'audio/ogg'; break;
					case 'wav': type = 'audio/wav'; break;
					case 'aac': type = 'audio/aac'; break;
					default: type = 'audio/mpeg'; // default fallback
				}
			} else {
				type = 'audio/mpeg'; // ultimate fallback
			}
			return type;
		}

		function getFullFilename(element) {
			if (element.dataset.fileExt) {
				return element.textContent + element.nextElementSibling.textContent;
			}
			return element.textContent;
		}

		function formatFileTitle(filename) {
			let baseName = filename.replace(/\.[^/.]+$/, ""); // Get base filename without extension
			if(/^[a-z0-9]{64}$/.test(baseName)) baseName = `<span class="${window.ns}-truncate-text" style="opacity: 0.8; background: transparent !important">${baseName.slice(0, 17)}</span>`; // If the filename is randomly generated text, shorten it.
			else if(/^[0-9]{8,64}$/.test(baseName)) baseName = `<span class="${window.ns}-truncate-text" style="opacity: 0.8; background: transparent !important">${baseName.slice(0, 17)}</span>`; // If the filename is randomly generated text, shorten it.

			return baseName;
		}

		function formatFileSize(fileSize, addSpace = false) {
			// local files case (module 13 addFromFiles())
			if(fileSize == null) return 'NULL';

			// Convert fileSize (assumed to be a string like "99.50 KB" or "1.82 MB") into MB
			let sizeValue = parseFloat(fileSize);
			let sizeInMB = 0;

			if (fileSize.toLowerCase().includes("kib")) {
				sizeInMB = sizeValue / 1024; // 1 KiB = 1024 bytes, convert to MB
			} else if (fileSize.toLowerCase().includes("kb")) {
				sizeInMB = sizeValue / 1000; // 1 KB = 1000 bytes, convert to MB
			} else if (fileSize.toLowerCase().includes("mib")) {
				sizeInMB = sizeValue * 1024 / 1024; // 1 MiB = 1048576 bytes, convert to MB
			} else if (fileSize.toLowerCase().includes("mb")) {
				sizeInMB = sizeValue; // Already in MB
			}

			// Round up to 1 decimal place
			sizeInMB = Math.ceil(sizeInMB * 10) / 10;

			// Cap anything over 99.5 MB
			// Omit the .0 when it's a 2 digits number like 11.0 MB (11.0 MB → 11 MB).
			let displaySize = sizeInMB > 99 ? "99+ MB" : `${(sizeInMB > 9.9 ? '&puncsp;' + sizeInMB.toFixed(0): sizeInMB.toFixed(1))} MB`;
			if(!addSpace) displaySize = sizeInMB > 99 ? "99+ MB" : `${(sizeInMB > 9.9 ? sizeInMB.toFixed(0): sizeInMB.toFixed(1))} MB`;

			return displaySize;
		}

		function getPostID(postElement) {
			// If not found in ID, look for the linkQuote element
			const linkQuote = postElement.querySelector('.linkQuote');
			if (linkQuote && linkQuote.textContent && /^\d+$/.test(linkQuote.textContent)) {
				return linkQuote.textContent;
			}

			// Fallback to a generated ID if nothing else works
			return 'idGrabFailed';
		}

		function parseFileName(filename, image, post, thumb, imageMD5, fileSize, fileIndex, dataFilemime) {
			if (!filename) return [];
			filename = filename.replace(/-/, '/');

			// First check for [sound=URL]
			const matches = [];
			let match;
			while (((match = filenameRE.exec(filename)) !== null) || (((match = filenameRE2.exec(filename)) !== null))) {
				// Fix for Firefox filenames: turns [sound=catbox.moe_2Faaaaa.mp3] to [sound=catbox.moe%2Faaaaa.mp3]
				if (match[2].includes('_') && !match[2].includes('%')) {
					const hex_pattern = /_(23|24|26|2B|2C|2F|3A|3B|3D|3F|40)/g;
					match[2] = match[2].replace(hex_pattern, '%$1');
				}
				if (match[2].includes('_')) continue; // If there are still underscores after decoding, it's likely invalid
				matches.push(match);
			}

			// If we found [sound=URL], process them and ignore video files
			if (matches.length) {
				return matches.reduce((sounds, match, i) => {
					let src = match[2];
					const id = post + ':' + fileIndex;
					//const title = match[1].trim() || defaultName + (matches.length > 1 ? ` (${i + 1})` : '');

					try {
						//if (src.includes('_') && !src.includes('%')) src = src.replace(/_/g, '%'); // Fix for Firefox issue: replace underscores that were mistakenly used instead of percent-encoding
						if (src.includes('%')) src = decodeURIComponent(src);
						if (src.match(protocolRE) === null) src = (location.protocol + '//' + src);
					} catch (error) {
						return sounds;
					}

					// Determine if this is a video file based on extension
					const isVideo = videoFileExtRE.test(src) ? true : false;
					const isAudio = audioFileExtRE.test(src) ? true : false;

					// Determine the MIME type based on extension
					const extension = getFileExtension(filename);
					let type = determinateMimeType(extension, isVideo, isAudio)

					const sound = {
						src, // external sound
						id,
						title: formatFileTitle(filename),
						post,
						image, // image or video taked from the post
						filename,
						thumb,
						imageMD5,
						extension,
						type, // external sound
						isVideo, // is external sound video?
						hasSoundUrlInFilename: true,
						fileIndex: fileIndex,
						fileSize: formatFileSize(fileSize, false),
						dataFilemime: dataFilemime
					};
					Player.acceptedSound(sound) && sounds.push(sound);
					return sounds;
				}, []);
			}

			// If no [sound=URL] found, check for video files
			const isVideo = videoFileExtRE.test(image);
			const isAudio = audioFileExtRE.test(image);
			if (isVideo || isAudio) {
				const id = post + ':' + fileIndex + ':0';

				// Determine the MIME type based on extension
				const extension = getFileExtension(image);
				let type = determinateMimeType(extension, isVideo, isAudio)

				return [{
					src: image, // Use the image URL as src for video files
					id: post + ':' + fileIndex,
					title: formatFileTitle(filename),
					post,
					image, // image (post file)
					filename,
					thumb,
					imageMD5,
					extension,
					type, // image (post file)
					isVideo, // is image (post file) video?
					hasSoundUrlInFilename: false, // external sound
					fileIndex: fileIndex,
					fileSize: formatFileSize(fileSize, false),
					dataFilemime: dataFilemime
				}];
			}

			return [];
		}

		function parsePost(target, postRender) {
			(is8chan) ? parsePost8chan(target, postRender) : parsePost4chan(target, postRender);
		}

		function parsePost8chan(post, skipRender) {
			try {
				// Get the actual post number for this post
				const postID = getPostID(post);
				if (!postID) return;

				// If there are existing play links, just reconnect their handlers
				const existingLinks = post.querySelectorAll(`.${ns}-play-link`);
				const playLinkInnerText = Player.config.playLinkInnerText || '【▶】';
				if (existingLinks.length > 0) {
					existingLinks.forEach(link => {
						link.innerHTML = playLinkInnerText;
						const id = link.getAttribute('data-id');
						link.onclick = (e) => {
							e && e.preventDefault();
							Player.play(Player.sounds.find(sound => sound.id === id));
							if (Player.container && Player.container.style.display === 'none' && !Player.minimised._showingPIP) {
								Player.show();
							}
						}
					});
					return;
				}

				// Get all file containers in the post
				const fileContainers = post.querySelectorAll('.uploadCell');
				if (!fileContainers || fileContainers.length === 0) return;

				let allSounds = [];

				// Process each file in the post
				fileContainers.forEach((container, fileIndex) => {
					let filename = null;
					let fileLink = null;
					let fileSize = "0 KB";

					// Try to get filename from various locations
					const originalNameLink = container.querySelector('.originalNameLink');
					if (originalNameLink) filename = getFullFilename(originalNameLink);

					// Get file size if available
					const sizeLabel = container.querySelector('.sizeLabel');
					if (sizeLabel) fileSize = sizeLabel.textContent.trim();

					// Get file dimensions if available
					const dimensionLabel = container.querySelector('.dimensionLabel'); // e.g. '123x123'

					// If no filename found via standard selectors, try to find file links
					if (!filename) {
						const fileLinkEl = container.querySelector('.nameLink');
						if (fileLinkEl) {
							fileLink = fileLinkEl.href;
							filename = fileLink.split('/').pop();
						}
					}

					if (!filename) return;

					const fileThumb = container.querySelector('.imgLink');
					const imageSrc = fileThumb && fileThumb.href;
					const thumbImg = fileThumb && fileThumb.querySelector('img');
					let thumbSrc = thumbImg && thumbImg.src;
					const md5Match = imageSrc && imageSrc.match(/\/\.media\/([a-f0-9]{64})/i);
					const imageMD5 = md5Match && md5Match[1];
					const dataFilemime = fileThumb && fileThumb.getAttribute('data-filemime');
					let dimensions = [null, null];
					if(dimensionLabel) {
						dimensions = dimensionLabel.textContent.trim().split(/x|×/);
					} else {
						const img = new Image();
						img.onload = function() {
							dimensions = [img.width, img.height];
						}
						img.src = thumbImg.src;
					}

					// Replace spoiler thumbnail with actual thumbnail if available
					if (/spoiler/.test(thumbSrc)) {
						const domain = new URL(thumbSrc).origin;
						thumbSrc = imageSrc && `${domain}/.media/t_${imageMD5}`;
					}

					// Set the full image as the thumbnail for images that are 220x220 pixels or smaller.
					// This is a fix for small images because thumbnails are not generated for them.
					// This crap does not apply to GIFs, GIFs always generate thumbnails.
					if (dimensions.length === 2 && /^image\/.+$/.test(dataFilemime) && !/^image\/gif$/.test(dataFilemime) ) {
						if (parseInt(dimensions[0]) <= 220 && parseInt(dimensions[1]) <= 220) {
							thumbSrc = imageSrc;
						}
					}

					const sounds = parseFileName(filename, imageSrc, postID, thumbSrc, imageMD5, fileSize, fileIndex, dataFilemime);
					if (!sounds.length) return;

					allSounds = allSounds.concat(sounds);

					// Create play link for this file
					const firstID = sounds[0].id;
					//const text = /*'▶︎'*/'【▶】';
					const text = Player.config.playLinkInnerText || '【▶】';
					const clss = `${ns}-play-link`;
					let playLinkParent = container.querySelector('.uploadDetails') ||
						container.querySelector('.fileLink') ||
						container.querySelector('.fileText') ||
						container; // Fallback to the container itself

					if (playLinkParent) {
						const playLink = document.createElement('a');
						playLink.href = "#;";
						playLink.className = clss;
						playLink.setAttribute('data-id', firstID);
						playLink.innerHTML = text;
						playLink.title = 'Play in Sounds Player';
						playLink.style.display = 'inline-block';
						//playLink.style.marginLeft = '3px';
						//playLink.style.fontSize = '10px';
						//playLink.style.fontWeight = 'bold';
						playLink.onclick = (e) => {
							e && e.preventDefault();
							Player.play(Player.sounds.find(sound => sound.id === firstID));
							if (Player.container && Player.container.style.display === 'none' && !Player.minimised._showingPIP) {
								Player.show();
							}
						}

						playLinkParent.appendChild(document.createTextNode(' '));
						playLinkParent.appendChild(playLink);
					}
				});

				if (allSounds.length === 0) return;

				allSounds.forEach(sound => Player.add(sound, skipRender));
				return allSounds.length > 0;
			} catch (err) {
				console.error('[8chan sounds player] Error parsing post:', err);
				console.error(post);
			}
		}

		function parsePost4chan(post, skipRender) {
			try {
				if (post.classList.contains('style-fetcher')) {
					return;
				}
				const parentParent = post.parentElement.parentElement || post.parentElement;
				if (parentParent.id === 'qp' || post.parentElement.classList.contains('noFile')) {
					return;
				}

				// If there's a play button this post has already been parsed. Just wire up the link.
				let playLink = post.querySelector(`.${ns}-play-link`);
				const playLinkInnerText = Player.config.playLinkInnerText || '【▶】';
				if (playLink) {
					playLink.innerHTML = playLinkInnerText;
					const id = playLink.getAttribute('data-id');
					playLink.onclick = (e) => {
						e && e.preventDefault();
						Player.play(Player.sounds.find(sound => sound.id === id));
						if (Player.container && Player.container.style.display === 'none' && !Player.minimised._showingPIP) {
							Player.show();
						}
					};
					return;
				}

				let filename = null;
				let filenameLocations;

				// For the archive there's just the one place to check.
				// For 4chan there's native / 4chan X / 4chan X with file info formatting
				if (!is4chan) {
					filenameLocations = { '.post_file_filename': 'title' };
				} else {
					filenameLocations = {
						'.fileText .file-info .fnfull': 'textContent',
						'.fileText .file-info > a': 'textContent',
						'.fileText > a': 'title',
						'.fileText': 'textContent'
					};
				}

				Object.keys(filenameLocations).some(function (selector) {
					const node = post.querySelector(selector);
					return node && (filename = node[filenameLocations[selector]]);
				});

				if (!filename) {
					return;
				}

				const postID = post.id.slice(is4chan ? 1 : 0);
				const fileThumb = post.querySelector(is4chan ? '.fileThumb' : '.thread_image_link');
				const imageSrc = fileThumb && fileThumb.href;
				const thumbImg = fileThumb && fileThumb.querySelector('img');
				let thumbSrc = thumbImg && thumbImg.src || thumbImg && thumbImg.getAttribute('data-src');
				const imageMD5 = thumbImg && thumbImg.getAttribute('data-md5');
				let fileSize = "0 KB";
				const sizeLabel = post.querySelector('.file-info') || post.querySelector('.post_file_metadata');
				if (sizeLabel) fileSize = extractFilesize(sizeLabel);

				// Replace spoiler thumbnail with actual thumbnail
				if (/spoiler/.test(thumbSrc)) {
					thumbSrc = `${imageSrc.replace(/\.[^/.]+$/, "")}s.jpg`;
				}

				const sounds = parseFileName(filename, imageSrc, postID, thumbSrc, imageMD5, fileSize, 1, null);

				if (!sounds.length) {
					return;
				}

				// Create a play link
				const firstID = sounds[0].id;
				//const text = post.querySelector('a.fa.fa-download.download-button') ? '▶︎' : is4chan ? 'play' : 'Play';
				const text = Player.config.playLinkInnerText || '【▶】';
				const clss = `${ns}-play-link` + (is4chan ? '' : ' btnr');
				playLink = document.createElement('a');
				playLink.href = "javascript:;";
				playLink.className = clss;
				playLink.setAttribute('data-id', firstID);
				playLink.innerHTML = text;
				playLink.title = 'Play in Sounds Player';
				playLink.style.display = 'inline-block';
				//playLink.style.fontSize = '10px';
				//playLink.style.fontWeight = 'bold';
				//playLink.style.marginLeft = '3px';
				playLink.onclick = (e) => {
					e && e.preventDefault();
					Player.play(Player.sounds.find(sound => sound.id === firstID));
					if (Player.container && Player.container.style.display === 'none' && !Player.minimised._showingPIP) {
						Player.show();
					}
				}

				const playLinkParent = post.querySelector('a.fa.fa-download.download-button') ||
						(is4chan ?
							(isChanX ? post.querySelector('.file-info') : post.querySelector('.fileText')) :
							post.querySelector('.post_controls')
						);

				if (playLinkParent) {
					if (playLinkParent.matches('.fa.fa-download.download-button')) {
						playLinkParent.after(document.createTextNode(' '), playLink);
					} else if (is4chan) {
						playLinkParent.appendChild(document.createTextNode(' '));
						playLinkParent.appendChild(playLink);
					} else {
						playLinkParent.appendChild(playLink);
					}
				}

				/*if (playLinkParent) {
					playLinkParent.after(document.createTextNode(' '), playLink);
				}*/

				// Create a play link
				/*const firstID = sounds[0].id;
				//const text = is4chan ? 'play' : 'Play';
				const text = '▶︎';
				const clss = `${ns}-play-link` + (is4chan ? '' : ' btnr');
				let playLinkParent;
				//let playLinkParent = post.querySelector('.fa.fa-download.download-button');
				if (is4chan) {
					playLinkParent = (isChanX) ? post.querySelector('.file-info') : post.querySelector('.fileText');
					playLinkParent.appendChild(document.createTextNode(' '));
				} else {
					playLinkParent = post.querySelector('.post_controls');
				}

				playLink = createElement(`<a href="javascript:;" class="${clss}" data-id="${firstID}">${text}</a>`, playLinkParent);
				playLink.onclick = (e) => {
					e && e.preventDefault();
					Player.play(Player.sounds.find(sound => sound.id === firstID));
					if (Player.container && Player.container.style.display === 'none' && !Player.minimised._showingPIP) {
						Player.show();
					}
				};*/

				// Don't add sounds from inline quotes of posts in the thread
				sounds.forEach(sound => Player.add(sound, skipRender));
				return sounds.length > 0;
			} catch (err) {
				Player.logError('There was an issue parsing the files. Please check the console for details.');
				console.log('[8chan sounds player]', post);
				console.error(err);
			}
		}

		function parseFiles(target, postRender) {
			(is8chan) ? parseFiles8chan(target, postRender) : parseFiles4chan(target, postRender);
		}

		function parseFiles8chan(target, postRender) {
			let addedSounds = false;
			let posts = target.classList && target.classList.contains('postCell') ?
				[target] :
			target.querySelectorAll('.innerOP, .innerPost');

			posts.forEach(post => parsePost8chan(post, postRender) && (addedSounds = true));

			if (addedSounds && postRender && Player.container) Player.playlist.render();
		}

		function parseFiles4chan(target, postRender) {
			let addedSounds = false;
			let posts = target.classList.contains('post')
			? [ target ]
			: target.querySelectorAll('.post');

			posts.forEach(post => parsePost4chan(post, postRender) && (addedSounds = true));

			if (addedSounds && postRender && Player.container) {
				Player.playlist.render();
			}
		}

		module.exports = {
			parseFiles,
			parsePost,
			parseFileName
		};
	}),
	/* 1 - Settings Configuration
		•	Contains all default configuration options for the player:
			o	Playback settings (shuffle, repeat)
			o	UI settings (view styles, hover images)
			o	Keybindings
			o	Allowed hosts list
			o	Color schemes
			o	Template layouts
		•	Defines the structure for:
			o	Header/footer/row templates
			o	Hotkey bindings
			o	Player appearance settings
	*/
	(function(module, exports) {

		module.exports = [{
				property: 'shuffle',
				default: false
			},
			{
				property: 'repeat',
				default: 'all'
			},
			{
				property: 'viewStyle',
				default: 'gallery',
				options: {
					playlist: 'Playlist',
					image: 'Image',
					gallery: 'Gallery'
				}
			},
			{
				property: 'hoverImages',
				default: true
			},
			{
				property: 'preventHoverImagesFor',
				default: [],
				save: false
			},
			{
				property: 'volumeValue',
				title: 'Volume value',
				description: 'Stores the volume value from the previous session.',
				showInSettings: false,
				default: '1'
			},
			{
				title: 'Miscellaneous',
				description: 'Variety of different settings',
				showInSettings: true,
				settings: [{
						property: 'fontSize',
						title: 'Font Size',
						description: 'Adjust the font size.',
						default: '13',
						showInSettings: true,
						updateStylesheet: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'autoshow',
						default: true,
						title: 'Autoshow',
						description: 'Automatically show the player when the thread contains sounds.',
						showInSettings: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'pauseOnHide',
						default: false,
						title: 'Pause on hide',
						description: 'Pause the player when it\'s hidden.',
						showInSettings: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'borderWidth',
						default: '1px',
						title: 'Border Width',
						showInSettings: true,
						updateStylesheet: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.forceBorderWidth',
						}],
					},
					{
						property: 'playLinkInnerText',
						title: 'Play Link Inner Text',
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
						default:
							'<b style="font-size: 10px;">\n' +
							'【▶】\n' +
							'</b>',
						description: '',
						showInSettings: 'textarea',
						attrs: 'spellcheck="false" style="height:60px;"',
						updateStylesheet: true
					},
				]
			},
			{
				title: 'Play on hover & Inline player (4chan only)',
				description: '',
				settings: [
					{
						property: 'playExpandedImages',
						default: true,
						title: 'Play Expanded Media',
						description: 'Play Expanded Media',
						showInSettings: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'playHoveredImages',
						default: true,
						title: 'Play Hovered Images',
						description: 'Play Hovered Images',
						showInSettings: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					}
				]
			},
			{
				title: 'On Initialization: Show Only Soundposts',
				description: 'This setting controls whether all posts or just those with an external sound are displayed in the playlist when the script starts.',
				settings: [
					{
						property: 'onInitShowOnlySoundposts4chan',
						title: 'On 4chan specifically:',
						description: '',
						default: false,
						showInSettings: true,
						options: {
							true: true,
							false: false
						},
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}]
					},
					{
						property: 'onInitShowOnlySoundposts8chan',
						title: 'On 8chan specifically:',
						description: '',
						default: false,
						showInSettings: true,
						options: {
							true: true,
							false: false
						},
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}]
					},
					{
						property: 'onInitShowOnlySoundpostsDefault',
						title: 'On other sites:',
						description: '',
						default: false,
						showInSettings: true,
						options: {
							true: true,
							false: false
						},
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}]
					}
				]
			},
			{
				title: 'Minimised Display <span style="font-size: 10px; margin: 0.2em 0;">(Picture-in-picture)</span>',
				description: 'Optional displays for when the player is minimised.',
				settings: [{
						property: 'pip',
						title: 'Enabled',
						description: 'Display a fixed Minimised Display of the playing sound in the bottom right of the thread.',
						default: true,
						showInSettings: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'maxPIPWidth',
						title: 'Maximum Width',
						description: 'Maximum width for the Minimised Display.',
						default: '200px',
						updateStylesheet: true,
						showInSettings: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'maxPIPHeight',
						title: 'Maximum Height',
						description: 'Maximum height for the Minimised Display.',
						default: '220px',
						updateStylesheet: true,
						showInSettings: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'offsetBottomPIP',
						title: 'Bottom offset',
						description: 'Changes the bottom offset (position) of the minimized player.',
						default: '10px',
						updateStylesheet: true,
						showInSettings: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'offsetRightPIP',
						title: 'Right offset',
						description: 'Changes the right offset (position) of the minimized player.',
						default: '10px',
						updateStylesheet: true,
						showInSettings: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'zIndexPIP',
						title: 'Z-Index',
						description: 'Changes the Z-INDEX of the minimized player. Setting the value below 0 will disable the "remaximize on-click" feature. To maximize the player again, click the icon in the header.',
						default: '0',
						updateStylesheet: true,
						showInSettings: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'chanXControls',
						title: '<span style="font-size: 14px; margin: 0.2em 0;">Navbar Header Controls</span>',
						description: 'Show playback controls in the header. Customise the template below.',
						default: 'always',
						showInSettings: true,
						options: {
							always: 'Always',
							closed: 'Only with the player closed',
							never: 'Never'
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}]
					}
				]
			},
			{
				title: "Controls",
				displayGroup: "Display",
				showInSettings: true,
				settings: [{
						property: "preventControlWrapping",
						title: "Prevent Wrapping",
						description: "Hide elements from controls to prevent wrapping when the player is too small",
						default: true,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
				},
				{
						property: "controlsHideOrder",
						title: "Hide Order",
						description: 'Order controls are hidden in to prevent wrapping. ' +
							'Available controls are\n' +
							'previous, ' +
							'play, ' +
							'next, ' +
							'seek-bar, ' +
							'time, ' +
							'duration, ' +
							'volume-bar ' +
							'and fullscreen.',
						default: ["fullscreen", "seek-bar", "duration", "time", "volume-bar", "previous", "next"],
						showInSettings: 'textarea',
						attrs: 'spellcheck="false" style="height:120px;"',
						split: '\n',
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
				}]
			},
			{
				title: 'Limit Post Width',
				description: 'Limit the width of posts so they aren\'t hidden under the player.',
				showInSettings: true,
				settings: [{
						property: 'limitPostWidths',
						title: 'Enabled',
						default: false,
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'minPostWidth',
						title: 'Minimum Width',
						default: '30%',
						actions: [{
							title: 'Reset',
							handler: 'settings.reset'
						}],
					}
				]
			},
			{
				property: 'threadsViewStyle',
				title: 'Threads View',
				description: 'How threads in the threads view are listed.',
				showInSettings: false,
				settings: [{
					title: 'Display',
					default: 'table',
					options: {
						table: 'Table',
						board: 'Board'
					}
				}]
			},
			{
				title: 'Keybinds',
				showInSettings: true,
				description: 'Enable keyboard shortcuts.',
				format: 'hotkeys.stringifyKey',
				parse: 'hotkeys.parseKey',
				class: `${ns}-key-input`,
				property: 'hotkey_bindings',
				settings: [{
						property: 'hotkeys',
						default: 'open',
						handler: 'hotkeys.apply',
						title: 'Enabled',
						format: null,
						parse: null,
						class: null,
						options: {
							always: 'Always',
							open: 'Only with the player open',
							never: 'Never'
						}
					},
					{
						property: 'hotkey_bindings.playPause',
						title: 'Play/Pause',
						keyHandler: 'togglePlay',
						ignoreRepeat: true,
						default: {
							key: ' '
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'hotkey_bindings.previous',
						title: 'Previous',
						keyHandler: 'previous',
						ignoreRepeat: true,
						default: {
							key: 'arrowleft'
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'hotkey_bindings.next',
						title: 'Next',
						keyHandler: 'next',
						ignoreRepeat: true,
						default: {
							key: 'arrowright'
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'hotkey_bindings.volumeUp',
						title: 'Volume Up',
						keyHandler: 'hotkeys.volumeUp',
						default: {
							shiftKey: true,
							key: 'arrowup'
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'hotkey_bindings.volumeDown',
						title: 'Volume Down',
						keyHandler: 'hotkeys.volumeDown',
						default: {
							shiftKey: true,
							key: 'arrowdown'
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'hotkey_bindings.toggleFullscreen',
						title: 'Toggle Fullscreen',
						keyHandler: 'display.toggleFullScreen',
						default: {
							key: ''
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'hotkey_bindings.togglePlayer',
						title: 'Show/Hide',
						keyHandler: 'display.toggle',
						default: {
							key: 'h'
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'hotkey_bindings.togglePlaylist',
						title: 'Toggle Playlist',
						keyHandler: 'playlist.toggleView',
						default: {
							key: ''
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'hotkey_bindings.scrollToPlaying',
						title: 'Jump To Playing',
						keyHandler: 'playlist.scrollToPlaying',
						default: {
							key: ''
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}],
					},
					{
						property: 'hotkey_bindings.toggleHoverImages',
						title: 'Toggle Hover Images',
						keyHandler: 'playlist.toggleHoverImages',
						default: {
							key: ''
						},
						actions: [{
							title: 'R',
							handler: 'settings.reset'
						}],
					}
				]
			},
			{
				property: 'allow',
				title: 'Allowed Hosts',
				description: 'Which domains sources are allowed to be loaded from.',
				default: [
					'4cdn.org',
					'8chan.se',
					'8chan.st',
					'8chan.moe',
					'catbox.moe',
					'dmca.gripe',
					'lewd.se',
					'pomf.cat',
					'zz.ht',
					'desu-usergeneratedcontent.xyz'
				],
				actions: [{
					title: 'Reset',
					handler: 'settings.reset'
				}],
				showInSettings: true,
				split: '\n'
			},
			{
				property: 'filters',
				default: ['# Image MD5 or sound URL'],
				title: 'Filters',
				description: 'List of URLs or image MD5s to filter, one per line.\nLines starting with a # will be ignored.',
				actions: [{
					title: 'Reset',
					handler: 'settings.reset'
				}],
				showInSettings: true,
				split: '\n'
			},
			{
				property: 'headerTemplate',
				title: 'Header Contents',
				actions: [{
					title: 'Reset',
					handler: 'settings.reset'
				}],
				//default: 'repeat-button shuffle-button hover-images-button playlist-button\nsound-name\nadd-button reload-button threads-button settings-button close-button',
				//default: 'repeat-button shuffle-button hover-images-button playlist-button &nbsp; \nsound-name &nbsp; \nadd-button reload-button settings-button&nbsp;close-button',
				default: 'repeat-button shuffle-button hover-images-button view-style-button \nsound-name \nadd-button dropdownMenu-button settings-button&nbsp;close-button',
				description: 'Template for the header contents.\n\nElements inside of p:{ &nbsp; } are hidden if no sound is playing.\nElements inside of h:{ &nbsp; } are hidden and appear on hover.',
				showInSettings: 'textarea',
				attrs: 'spellcheck="false"'
			},
			{
				property: 'rowTemplate',
				title: 'Row Contents',
				actions: [{
					title: 'Reset',
					handler: 'settings.reset'
				}],
				default:
					'<div class="${ns}-col" style="margin-left: 4px;">\n' +
					' <span style="padding-right: 4px;">sound-post</span>\n' +
					' <span style="padding-right: 8px; min-width: calc(40px); text-align: right;">sound-filesize</span>\n' +
					' <span style="padding-right: 8px; min-width: calc(40px);">.sound-extension</span>\n' +
					' <span class="${ns}-truncate-text">sound-name</span>\n' +
					' h:{menu-button}\n' +
					'</div>',
				description: 'Template for the playlist row contents.\n\nElements inside of p:{ &nbsp; } are hidden if no sound is playing.\nElements inside of h:{ &nbsp; } are hidden and appear on hover.',
				showInSettings: 'textarea',
				attrs: 'spellcheck="false" style="height:160px;"'
			},
			{
				property: 'galleryItemTemplate',
				title: 'Gallery Item Contents',
				actions: [{
					title: 'Reset',
					handler: 'settings.reset'
				}],
				default:
					'<div class="${ns}-gallery-thumb-container">\n' +
					' <img class="${ns}-gallery-thumb" src="sound-thumb" draggable="false" loading="lazy">\n' +
					' <div class="${ns}-gallery-overlay" style="font-size: 9.5px;">\n' +
					'  <span class="${ns}-gallery-title">sound-post ▪ sound-filesize</span>\n' +
					' </div>\n' +
					' h:{menu-button}\n' +
					'</div>',
				description: 'Template for the gallery item contents.\n\nElements inside of p:{ &nbsp; } are hidden if no sound is playing.\nElements inside of h:{ &nbsp; } are hidden and appear on hover.',
				showInSettings: 'textarea',
				attrs: 'spellcheck="false" style="height:180px;"'
			},
			{
				property: 'footerTemplate',
				title: 'Footer Contents',
				actions: [{
					title: 'Reset',
					handler: 'settings.reset'
				}],
				default:
					'<div class="${ns}-footer-left">\n' +
					' playing-button:"sound-index /"&nbsp;sound-count ui-files-icon\n' +
					'</div>\n\n' +
					'<div class="${ns}-footer-right">\n' +
					' soundpost-only-toggle-button\n' +
					' p:{\n' +
					'  post-link\n' +
					' }\n' +
					' pip-toggle-button\n' +
					' p:{\n' +
					'  <span class="${ns}-footer-text">&nbsp;Open:</span>\n' +
					'  ui-bracketL-icon\n' +
					'   image-link sound-link\n' +
					'  ui-bracketR-icon\n' +
					'  \n' +
					'  <span class="${ns}-footer-text">Download:</span>\n' +
					'  ui-bracketL-icon\n' +
					'   dl-image-button dl-sound-button\n' +
					'  ui-bracketR-icon\n' +
					' }\n' +
					'</div>',
				description: 'Template for the footer contents.\n\nElements inside of p:{ &nbsp; } are hidden if no sound is playing.\nElements inside of h:{ &nbsp; } are hidden and appear on hover.',
				showInSettings: 'textarea',
				attrs: 'spellcheck="false" style="height:340px;"'
			},
			{
				property: 'chanXTemplate',
				//title: '4chan X Header Controls',
				title: 'Navbar Header Controls',
				//default: 'p:{\n\tpost-link:"sound-name"\n\tprev-button\n\tplay-button\n\tnext-button\n\tsound-current-time / sound-duration\n}',
				default: 'p:{\n prev-button\n play-button\n next-button\n &nbsp;sound-current-time sound-duration-slash sound-duration&nbsp;\n}',
				actions: [{
					title: 'Reset',
					handler: 'settings.reset'
				}],
				showInSettings: 'textarea',
				attrs: 'spellcheck="false" style="height:100px;"'
			},
			{
				title: 'Colors',
				showInSettings: true,
				property: 'colors',
				updateStylesheet: true,
				actions: [{
					title: 'Match Theme',
					handler: 'settings.forceBoardTheme'
				}],
				// These colors will be overriden with the theme defaults at initialization.
				settings: [{
						property: 'colors.text',
						default: 'rgba(0,0,0,1)',
						title: 'Text'
					},
					{
						property: 'colors.background',
						default: 'rgba(214,218,240,1)',
						title: 'Background'
					},
					{
						property: 'colors.border',
						default: 'rgba(183,197,217,1)',
						title: 'Border'
					},
					{
						property: 'colors.odd_row',
						default: 'rgba(214,218,240,1)',
						title: 'Odd Row',
					},
					{
						property: 'colors.even_row',
						default: 'rgba(201,205,226,1)',
						title: 'Even Row'
					},
					{
						property: 'colors.playing',
						default: 'rgba(44,44,78,0.62)',
						title: 'Playing Row'
					},
					{
						property: 'colors.dragging',
						default: 'rgba(78,79,110,0.7)',
						title: 'Dragging Row'
					},
					{
						property: 'colors.text_playing',
						default: 'rgba(214,218,240,1)',
						title: '<span style="font-size: 13.5px; margin: 0.2em 0;">Text color of the<br>playing/dragging row</span>'
					},
					{
						property: 'colors.controls_panel',
						default: 'rgba(190,194,214,1)',
						title: '<span style="font-size: 13.5px; margin: 0.2em 0;">Playback Controls<br>Panel Background</span>',
					},
					{
						property: 'colors.buttons_color',
						default: 'rgba(44,44,78,1)',
						title: 'Buttons'
					},
					{
						property: 'colors.hover_color',
						default: 'rgba(221,0,0,1)',
						title: 'Hover',
					},
					{
						property: 'colors.controls_current_time',
						default: 'rgba(0,0,0,1)',
						title: 'Current Time'
					},
					{
						property: 'colors.controls_duration',
						default: 'rgba(76,78,86,1)',
						title: 'Duration'
					},
					{
						property: 'colors.progress_bar',
						default: 'rgba(156,156,165,0.7)',
						title: '<span style="margin: 0.2em 0;">Progress Bar<br>Background</span>',
					},
					{
						property: 'colors.progress_bar_loaded',
						default: 'rgba(150,152,178,1)',
						title: '<span style="margin: 0.25em 0 0.2em 0;">Loaded Bar<br>Background</span>',
					}
				]
			},

		];
	}),
	/* 3 - Main Entry Point
		•	Initialization sequence:
			a.	Waits for DOM/4chan X readiness
			b.	Sets up mutation observer for dynamic content
			c.	Triggers initial page scan
		•	Handles both:
			o	Native 4chan interface
			o	4chan X extension environment
	*/
	(function(module, exports, __webpack_require__) {

		const components = {
			// Settings must be first.
			settings: __webpack_require__(5),
			controls: __webpack_require__(6),
			display: __webpack_require__(7),
			events: __webpack_require__(8),
			footer: __webpack_require__(9),
			header: __webpack_require__(10),
			hotkeys: __webpack_require__(11),
			minimised: __webpack_require__(12),
			playlist: __webpack_require__(13),
			position: __webpack_require__(14),
			threads: __webpack_require__(15),
			userTemplate: __webpack_require__(17),
			inline: __webpack_require__(32)
		};

		// Create a global ref to the player.
		const Player = window.Player = module.exports = {
			//ns,
			audio: new Audio(),
			sounds: [],
			isHidden: true,
			container: null,
			ui: {},

			// Build the config from the default
			config: {},

			// Helper function to query elements in the player.
			$: (...args) => Player.container && Player.container.querySelector(...args),
			$all: (...args) => Player.container && Player.container.querySelectorAll(...args),

			// Store a ref to the components so they can be iterated.
			components,

			// Get all the templates.
			templates: {
				body: __webpack_require__(19),
				controls: __webpack_require__(20),
				css: __webpack_require__(21),
				footer: __webpack_require__(22),
				header: __webpack_require__(23),
				itemMenu: __webpack_require__(24),
				list: __webpack_require__(25),
				player: __webpack_require__(26),
				settings: __webpack_require__(27),
				threads: __webpack_require__(28),
				threadBoards: __webpack_require__(29),
				threadList: __webpack_require__(30),
				galleryList: __webpack_require__(31)
			},

			// Set up the player.
			initialize: async function initialize() {
				if (Player.initialized) {
					return;
				}
				Player.initialized = true;
				try {
					Player.sounds = [];

					// Run the initialisation for each component.
					for (let name in components) {
						components[name].initialize && await components[name].initialize();
					}

					if (!is4chan) {
						// Add a sounds link in the nav for archives
						const nav = document.querySelector('.navbar-inner .nav:nth-child(2)');
						const li = createElement('<li><a>Sounds</a></li>', nav);
						li.children[0].addEventListener('click', Player.display.toggle);
					} else if (isChanX) {
						// If it's already known that 4chan X is running then setup the button for it.
						Player.display.initChanX();
					} else {
						// Add the [Sounds] link in the top and bottom nav.
						document.querySelectorAll('#settingsWindowLink, #settingsWindowLinkBot').forEach(function(link) {
							const showLink = createElement('<a>Sounds</a>', null, {
								click: Player.display.toggle
							});
							link.parentNode.insertBefore(showLink, link);
							link.parentNode.insertBefore(document.createTextNode('] ['), link);
						});
					}

					// Render the player, but not neccessarily show it.
					Player.display.render();
					// show the player
					if(Player.config.autoshow) {
						const checkSounds = setInterval(() => {
							if (Player.sounds && Player.sounds.length > 0) {
								Player.display.show();
								clearInterval(checkSounds);
							}
						}, 1000);
					}
				} catch (err) {
					Player.logError('There was an error initialzing the sound player. Please check the console for details.');
					console.error('[8chan sounds player]', err);
					// Can't recover so throw this error.
					throw err;
				}
			},

			// Compare two ids for sorting.
			compareIds: function(a, b) {
				const [aPID, aSID] = a.split(':');
				const [bPID, bSID] = b.split(':');
				const postDiff = aPID - bPID;
				return postDiff !== 0 ? postDiff : aSID - bSID;
			},

			// Check whether a sound src and image are allowed and not filtered.
			acceptedSound: function({
				src,
				imageMD5
			}) {
				try {
					const link = new URL(src);
					const host = link.hostname.toLowerCase();
					return !Player.config.filters.find(v => v === imageMD5 || v === host + link.pathname) &&
						Player.config.allow.find(h => host === h || host.endsWith('.' + h));
				} catch (err) {
					return false;
				}
			},

			// Listen for changes
			syncTab: (property, callback) => GM_addValueChangeListener(property, (_prop, oldValue, newValue, remote) => {
				remote && callback(newValue, oldValue);
			}),

			// Send an error notification event.
			logError: function(message, type = 'error') {
				console.error(message);
				document.dispatchEvent(new CustomEvent('CreateNotification', {
					bubbles: true,
					detail: {
						type: type,
						content: message,
						lifetime: 5
					}
				}));
			}
		};

		// Add each of the components to the player.
		for (let name in components) {
			Player[name] = components[name];
			(Player[name].atRoot || []).forEach(k => Player[k] = Player[name][k]);
		}
	}),
	// 3 - Main Entry Point
	//	•	Initialization sequence:
	//		a.	Waits for DOM/4chan X readiness
	//		b.	Sets up mutation observer for dynamic content
	//		c.	Triggers initial page scan
	//	•	Handles both:
	//		o	Native 4chan interface
	//		o	4chan X extension environment
	(function(module, __webpack_exports__, __webpack_require__) {
		"use strict";
		__webpack_require__.r(__webpack_exports__);

		// Store references to modules but don't load them yet
		var _globals__WEBPACK_IMPORTED_MODULE_0__;
		var _globals__WEBPACK_IMPORTED_MODULE_0___default;
		var _player__WEBPACK_IMPORTED_MODULE_1__;
		var _player__WEBPACK_IMPORTED_MODULE_1___default;
		var _file_parser__WEBPACK_IMPORTED_MODULE_2__;
		var _file_parser__WEBPACK_IMPORTED_MODULE_2___default;

		window.is4chan = /(4chan\.org|4channel\.org)/.test(location.hostname);
		window.isChanX = document.documentElement && document.documentElement.classList.contains('fourchan-x');
		window.is8chan = /(dev\.8ch|8chan\.(moe|se|st|cc)|alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad\.onion)/.test(location.hostname);

		async function doInit() {
			// Delay the script before initialization
			await new Promise(resolve => setTimeout(resolve, (is8chan) ? 0 : 3000));

			const SELECTORS = [
				'#fc-sounds-container',
				'#fcsp-container'
			];

			// Check if another player exists
			// Prevent the script from running if another Sounds Player script is present
			let existingPlayer;
			for (const selector of SELECTORS) {
				existingPlayer = document.querySelector(selector);
				if (existingPlayer) {
					console.log('[8chan sounds player] Another sounds player detected, stopping initialization');
					return;
				}
			}

			console.log('[8chan sounds player] Starting initialization');

			// Only proceed with module loading if no existing player
			_globals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
			_globals__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_globals__WEBPACK_IMPORTED_MODULE_0__);
			_player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
			_player__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_player__WEBPACK_IMPORTED_MODULE_1__);
			_file_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
			_file_parser__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(_file_parser__WEBPACK_IMPORTED_MODULE_2__);

			if (isChanX) {
				_player__WEBPACK_IMPORTED_MODULE_1___default.a.display.initChanX();
			}

			await _player__WEBPACK_IMPORTED_MODULE_1__.initialize();

			// Initialize header and footer buttons
			_player__WEBPACK_IMPORTED_MODULE_1__.display.initHeader();
			_player__WEBPACK_IMPORTED_MODULE_1__.display.initFooter();

			// Parse existing posts
			_file_parser__WEBPACK_IMPORTED_MODULE_2__.parseFiles(document.body, true);

			_file_parser__WEBPACK_IMPORTED_MODULE_2__.parseFiles(document.body, true);

			// Set up mutation observer
			const observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === 'childList') {
						mutation.addedNodes.forEach(function(node) {
							if (node.nodeType === Node.ELEMENT_NODE) {
								_file_parser__WEBPACK_IMPORTED_MODULE_2__.parseFiles(node);
							}
						});
					}
				});
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		}

		document.addEventListener('4chanXInitFinished', function () {
			if (isChanX) {
				doInit();
			}
			isChanX = true;
		});

		if (!isChanX) {
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', doInit);
			} else {
				doInit();
			}
		}
	}),
	/* 4 - Globals & Utilities
		•	Defines shared utilities:
			o	_set()/_get(): Deep object property access
			o	toDuration(): Formats time (00:00)
			o	timeAgo(): Relative time formatting
			o	createElement(): DOM creation helper
			o	noDefault(): Event handler wrapper
		•	Sets global constants:
			o	ns: Namespace prefix
			o	is4chan/isChanX: Environment detection
			o	Board: Current board name
			o	VERSION
		•	Load in glyphs
	*/
	(function(module, exports, __webpack_require__) {
		// Update globals for 8chan
		window.ns = 'fc-sounds';
		window.is4chan = /(4chan\.org|4channel\.org)/.test(location.hostname);
		window.isChanX = document.documentElement && document.documentElement.classList.contains('fourchan-x');
		window.is8chan = /(dev\.8ch|8chan\.(moe|se|st|cc)|alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad\.onion)/.test(location.hostname);
		//window.isFoolFuuka = document.querySelector('meta[name="generator"][content*="FoolFuuka"]');
		window.Board = location.pathname.split('/')[1];
		window.localFileCounter = 0;
		window.isLoading = false;
		window.Master = undefined;
		window.Slave = undefined;
		window.mediaStatus = undefined;
		window.showSoundPostsOnly = /*is4chan*/false;

		const scriptVersion = GM_info.script.version;
		window.VERSION = scriptVersion ? scriptVersion : 'Version not found';

		// Keep rest of original globals.js content
		window._set = function(object, path, value) {
			const props = path.split('.');
			const lastProp = props.pop();
			const setOn = props.reduce((obj, k) => obj[k] || (obj[k] = {}), object);
			setOn && (setOn[lastProp] = value);
			return object;
		};

		window._get = function(object, path, dflt) {
			const props = path.split('.');
			const lastProp = props.pop();
			const parent = props.reduce((obj, k) => obj && obj[k], object);
			return parent && Object.prototype.hasOwnProperty.call(parent, lastProp) ?
				parent[lastProp] :
				dflt;
		};

		window.toDuration = function(number) {
			number = Math.floor(number || 0);
			let [seconds, minutes, hours] = _duration(0, number);
			seconds < 10 && (seconds = '0' + seconds);
			return (hours ? hours + ':' : '') + minutes + ':' + seconds;
		};

		window.timeAgo = function(date) {
			const [seconds, minutes, hours, days, weeks] = _duration(Math.floor(date), Math.floor(Date.now() / 1000));
			/* _eslint-disable indent */
			return weeks > 1 ? weeks + ' weeks ago' :
				days > 0 ? days + (days === 1 ? ' day' : ' days') + ' ago' :
				hours > 0 ? hours + (hours === 1 ? ' hour' : ' hours') + ' ago' :
				minutes > 0 ? minutes + (minutes === 1 ? ' minute' : ' minutes') + ' ago' :
				seconds + (seconds === 1 ? ' second' : ' seconds') + ' ago';
			/* eslint-enable indent */
		};

		function _duration(from, to) {
			const diff = Math.max(0, to - from);
			return [
				diff % 60,
				Math.floor(diff / 60) % 60,
				Math.floor(diff / 60 / 60) % 24,
				Math.floor(diff / 60 / 60 / 24) % 7,
				Math.floor(diff / 60 / 60 / 24 / 7)
			];
		}

		window.createElement = function(html, parent, events = {}) {
			const container = document.createElement('div');
			container.innerHTML = html;
			const el = container.children[0];
			parent && parent.appendChild(el);
			for (let event in events) {
				el.addEventListener(event, events[event]);
			}
			return el;
		};

		window.createElementBefore = function(html, before, events = {}) {
			const el = createElement(html, null, events);
			before.parentNode.insertBefore(el, before);
			return el;
		};

		window.noDefault = (f, ...args) => e => {
			e.preventDefault();
			const func = typeof f === 'function' ? f : _get(Player, f);
			func(...args);
		};

		window.throttleFc = function(func, limit) {
			let inThrottle;
			return function() {
				const args = arguments;
				const context = this;
				if (!inThrottle) {
					func.apply(context, args);
					inThrottle = true;
					setTimeout(() => inThrottle = false, limit);
				}
			}
		};

		window.debounceFc = function(func, timeout = 300){
			let timer;
			return (...args) => {
				clearTimeout(timer);
				timer = setTimeout(() => { func.apply(this, args); }, timeout);
			};
		};
	}),
	/* 5 - Settings Manager
		•	Manages all user configuration:
			o	load()/save(): Persistent storage
			o	set(): Updates settings with validation
			o	applyBoardTheme(): Matches 8chan's colors
		•	Handles:
			o	Settings UI rendering
			o	Change detection
			o	Cross-tab synchronization
	*/
	(function(module, exports, __webpack_require__) {

		const settingsConfig = __webpack_require__(1);

		module.exports = {
			atRoot: ['set'],

			delegatedEvents: {
				click: {
					[`.${ns}-settings .${ns}-heading-action`]: 'settings.handleAction',
				},
				focusout: {
					[`.${ns}-settings input, .${ns}-settings textarea`]: 'settings.handleChange'
				},
				change: {
					[`.${ns}-settings input[type=checkbox], .${ns}-settings select`]: 'settings.handleChange'
				},
				keydown: {
					[`.${ns}-key-input`]: 'settings.handleKeyChange',
				},
				keyup: {
					[`.${ns}-encoded-input`]: 'settings._handleEncoded',
					[`.${ns}-decoded-input`]: 'settings._handleDecoded'
				}
			},

			initialize: async function() {
				await Player.settings.updateLegacySettings();

				// Apply the default config.
				Player.config = settingsConfig.reduce(function reduceSettings(config, setting) {
					if (setting.settings) {
						setting.settings.forEach(subSetting => {
							let _setting = {
								...setting,
								...subSetting
							};
							_set(config, _setting.property, _setting.default);
						});
						return config;
					}
					return _set(config, setting.property, setting.default);
				}, {});

				// Load the user config.
				await Player.settings.load();

				// Apply the default board theme as default.
				Player.settings.applyBoardTheme();

				// Listen for the player closing to apply the pause on hide setting.
				Player.on('hide', function() {
					if (Player.config.pauseOnHide) {
						Player.pause();
					}
				});

				// Listen for changes from other tabs
				Player.syncTab('settings', value => Player.settings.apply(value, {
					bypassSave: true,
					applyDefault: true,
					ignore: ['viewStyle']
				}));

				window.showSoundPostsOnly = ((is8chan) ? Player.config.onInitShowOnlySoundposts8chan : (is4chan) ? Player.config.onInitShowOnlySoundposts4chan : Player.config.onInitShowOnlySoundpostsDefault) || false;

				// Apply the default board theme as default again just in case the script loaded before the CSS
				setTimeout(() => {Player.settings.applyBoardTheme()}, 3000);
			},

			updateLegacySettings: async function() {
				try {
					const savedSettings = await GM.getValue('settings');

					// If no settings exist, initialize with default values
					if (!savedSettings) {
						const defaultSettings = {
							viewStyle: "gallery",
							VERSION: GM_info.script.version,
						};
						await GM.setValue('settings', JSON.stringify(defaultSettings));
						return;
					}

					// Parse settings safely (handle malformed JSON)
					let settings;
					try {
						settings = JSON.parse(savedSettings);
					} catch (e) {
						console.error("[8chan sounds player] Failed to parse settings, resetting to defaults.", e);
						settings = {
							viewStyle: "gallery",
							VERSION: GM_info.script.version,
						};
						await GM.setValue('settings', JSON.stringify(settings));
						return;
					}

					// Safely split and compare version (handle unexpected version formats)
					const versionParts = settings.VERSION.split(/_/, 2);
					const versionNumber = parseInt(versionParts[1]);
					if (versionParts.length < 2 || isNaN(versionParts[1]) || versionNumber < 52) {
						settings = {
							viewStyle: "gallery",
							VERSION: GM_info.script.version,
						};
						await GM.setValue('settings', JSON.stringify(settings));
					}
				} catch (error) {
					console.error("[8chan sounds player] Failed to update settings:", error);
				}
			},

			render: function() {
				if (Player.container) {
					Player.$(`.${ns}-settings`).innerHTML = Player.templates.settings();
				}
			},

			forceBorderWidth: function() {
				Player.settings.applyBorderWidth(true);
				Player.settings.save();
			},

			applyBorderWidth: function(force) {
				// Create a reply element to gather the style from
				const innerPostElement = (is8chan)
							? createElement(`<div class="innerPost"></div>`, document.body)
							: createElement(`<div class="${is4chan ? 'post reply style-fetcher' : 'post_wrapper'}"></div>`, document.body);
				const innerPostStyle = (!innerPostElement) ? null : window.getComputedStyle(innerPostElement);
				let borderWidth = (innerPostStyle !== null) ? innerPostStyle.getPropertyValue('border-right-width') : '1px';
				borderWidth = Math.max(0.1, Math.min(2, parseFloat(borderWidth))) + 'px' || '1px';

				Player.set('borderWidth', borderWidth, { bypassSave: true, bypassRender: true });

				// Clean up the element.
				document.body.removeChild(innerPostElement);
				// Updated the stylesheet if it exists.
				Player.stylesheet && Player.display.updateStylesheet();
				// Re-render the settings if needed.
				Player.settings.render();
			},

			forceBoardTheme: function() {
				Player.settings.applyBoardTheme(true);
				Player.settings.save();
			},

			applyBoardTheme: function(force) {
				const rootStyles = window.getComputedStyle(document.documentElement);
				//console.log(rootStyles);

				// Create a reply element to gather the style from
				const linkElement = (is8chan)
							? createElement(`<a class="backLink postLink"></a>`, document.body)
							: createElement(`<a class="backlink"></a>`, document.body);
				const innerPostElement = (is8chan)
							? createElement(`<div class="innerPost"></div>`, document.body)
							: createElement(`<div class="${is4chan ? 'post reply style-fetcher' : 'post_wrapper'}"></div>`, document.body);
				const quoteElementParent = (is8chan)
							? createElement(`<div class="divMessage"></div>`, document.body)
							: (is4chan)
								? createElement(`<blockquote class="postMessage"></blockquote>`, document.body)
								: createElement(`<span class="theme_default"><article class="thread"></article></span>`, document.body);
				const quoteElement = (is8chan)
							? createElement(`<span class="greenText"></span>`, quoteElementParent)
							: createElement(`<span class="${is4chan ? 'quote' : 'greentext'}"></span>`, quoteElementParent);
				const quotelinkElement = (is8chan)
							? createElement(`<a class="quoteLink"></a>`, document.body)
							: createElement(`<a class="${is4chan ? 'quotelink' : 'backlink'}"></a>`, document.body);

				const linkStyle = (!linkElement) ? null : window.getComputedStyle(linkElement);
				const innerPostStyle = (!innerPostElement) ? null : window.getComputedStyle(innerPostElement);
				const quoteStyle = (!quoteElement) ? null : window.getComputedStyle(quoteElement);
				const quotelinkStyle = (!quotelinkElement) ? null : window.getComputedStyle(quotelinkElement);
				const selectedTheme = localStorage.getItem('selectedTheme'); //8chan

				let textColor = innerPostStyle.color || 'rgba(0,0,0,1)';
				let linkColor = linkStyle.color || 'rgba(52, 52, 92,1)';
				let backgroundColor = innerPostStyle.backgroundColor || 'rgba(214,218,240,1)';
				let borderColor = (innerPostStyle !== null) ? innerPostStyle.getPropertyValue('border-bottom-color') : rootStyles.getPropertyValue('--horizon-sep-color').trim() || rootStyles.getPropertyValue('--border-color').trim() || 'rgba(183, 197, 217,1)';

				let linkHoverColor = rootStyles.getPropertyValue('--link-hover-color').trim() || quotelinkStyle.color || 'rgba(221,0,0,1)';
				let windowsColor = rootStyles.getPropertyValue('--windows-focused-background').trim() || null; //8chan windows theme

				textColor = Player.settings.isLightColor(backgroundColor) ? Player.settings.adjustColor(textColor, { h: 0, s: -3, v: -3, a:1 }) : Player.settings.adjustColor(textColor, { h: 0, s: -3, v: 3, a:1 });
				linkColor = Player.settings.adjustColor(linkColor, { h: 0, s: 0, v: 0, a:1 });
				backgroundColor = Player.settings.adjustColor(backgroundColor, { h: 0, s: 0, v: 0, a:1 });
				borderColor = Player.settings.adjustColor(borderColor, { h: 0, s: 0, v: 0, a:1 });
				linkHoverColor = Player.settings.adjustColor(linkHoverColor, { h: 0, s: 0, v: 0, a:1 });

				borderColor = (borderColor === backgroundColor) ? Player.settings.mixColors(borderColor, textColor, 0.3) : (borderColor === 'rgba(0,0,0,1)') ? Player.settings.mixColors(backgroundColor, textColor, 0.15) : borderColor;

				let oddRow = backgroundColor;
				let evenRow = Player.settings.mixColors(textColor, oddRow, 0.94);

				let controlsPanel = Player.settings.mixColors(backgroundColor, textColor, 0.11);
				let buttonsColor = (windowsColor !== null) ? Player.settings.adjustColor(windowsColor, { h: 0, s: 0, v: 0, a:1 }) : Player.settings.mixColors(textColor, linkColor, 0.85);
				let hoverColor = linkHoverColor;
				let controlsCurrentTime = textColor;
				let controlsDuration = Player.settings.mixColors(controlsPanel, textColor, 0.6);
				let textPlaying;

				switch (selectedTheme) {
					case "tomorrow":
						hoverColor = Player.settings.adjustColor(linkHoverColor, { h: 0, s: 10, v: 50, a:1 });
						break;
					case "evita":
						textPlaying = textColor;
						break;
					case "vivian":
						textPlaying = 'rgba(208,208,208,1.0)';
						break;
					case "warosu":
						textPlaying = 'rgba(245,245,245,1.0)';
						break;
					default:
						textPlaying = Player.settings.isLightColor(backgroundColor)
						? (Player.settings.isLightColor(textColor) ? 'rgba(22,22,22,1.0)' : backgroundColor)
						: (Player.settings.isLightColor(textColor) ? 'rgba(218,218,218,1.0)' : backgroundColor);
				}

				let playing = Player.settings.isLightColor(backgroundColor)
									? Player.settings.adjustColor(buttonsColor, { h: 0, s: 0, v: 0, a:0.62 })
									: Player.settings.adjustColor(buttonsColor, { h: 0, s: 0, v: 0, a:0.42 });
				let dragging = Player.settings.mixColors(backgroundColor, buttonsColor, 0.8);
					dragging = Player.settings.adjustColor(dragging, { h: 0, s: 0, v: 0, a:0.7 });

				let progressBarLoaded = Player.settings.mixColors(backgroundColor, buttonsColor, 0.35);
					progressBarLoaded = Player.settings.mixColors(progressBarLoaded, linkColor, 0.05);;
				let progressBar = Player.settings.isLightColor(controlsPanel) ? Player.settings.adjustColor(progressBarLoaded, { h: 0, s: -10, v: -5, a:0.7 }) : Player.settings.adjustColor(progressBarLoaded, { h: 0, s: -10, v: 5, a:0.7 });

				const colorSettingMap = {
					'colors.text': textColor,
					'colors.background': backgroundColor,
					'colors.border': borderColor,
					'colors.odd_row': oddRow,
					'colors.even_row': evenRow,
					'colors.playing': playing,
					'colors.dragging': dragging,
					'colors.text_playing': textPlaying,

					'colors.controls_panel': controlsPanel,
					'colors.buttons_color': buttonsColor,
					'colors.hover_color': hoverColor,
					'colors.controls_current_time': controlsCurrentTime,
					'colors.controls_duration': controlsDuration,
					'colors.progress_bar': progressBar,
					'colors.progress_bar_loaded': progressBarLoaded,
				};

				settingsConfig.find(s => s.property === 'colors').settings.forEach(setting => {
					const updateConfig = force || (setting.default === _get(Player.config, setting.property));
					colorSettingMap[setting.property] && (setting.default = colorSettingMap[setting.property]);
					updateConfig && Player.set(setting.property, setting.default, {
						bypassSave: true,
						bypassRender: true
					});
				});

				// Clean up the element.
				document.body.removeChild(linkElement);
				document.body.removeChild(innerPostElement);
				quoteElementParent.removeChild(quoteElement);
				document.body.removeChild(quoteElementParent);
				document.body.removeChild(quotelinkElement);

				// Updated the stylesheet if it exists.
				Player.stylesheet && Player.display.updateStylesheet();

				// Re-render the settings if needed.
				Player.settings.render();

				Player.settings.applyBorderWidth();
			},

			parseColor: function(color) {
				let result;

				// Named HTML colors to hex mapping
				const htmlColors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};

				// Convert named color to hex first if it exists
				if (htmlColors[color.toLowerCase()]) {
					color = htmlColors[color.toLowerCase()];
				}

				// Helper function to validate and clamp RGB values
				const clampRGB = (value) => Math.min(255, Math.max(0, parseInt(value, 10)));

				// Helper function to validate and clamp alpha values
				const clampAlpha = (value) => {
					const num = parseFloat(value);
					return Math.min(1, Math.max(0, isNaN(num) ? 1 : num));
				};

				// Hex formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
				if (/^#([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color)) {
					let hex = color.slice(1);
					// Expand shorthand (e.g., #RGBA → #RRGGBBAA)
					if (hex.length === 3 || hex.length === 4) {
						hex = hex.split('').map(x => x + x).join('');
					}
					// Parse to [r, g, b, a] (alpha defaults to 1 if missing)
					const r = clampRGB(parseInt(hex.slice(0, 2), 16));
					const g = clampRGB(parseInt(hex.slice(2, 4), 16));
					const b = clampRGB(parseInt(hex.slice(4, 6), 16));
					const a = hex.length === 8 ? clampAlpha(parseInt(hex.slice(6, 8), 16) / 255) : 1;
					return [r, g, b, a];
				}
				// RGB: rgb(r, g, b) → [r, g, b, 1]
				else if (/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.test(color)) {
					const matches = color.match(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i);
					const r = clampRGB(matches[1]);
					const g = clampRGB(matches[2]);
					const b = clampRGB(matches[3]);
					return [r, g, b, 1];
				}
				// RGBA: rgba(r, g, b, a) → [r, g, b, a]
				else if (/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.\d+|0|1)\s*\)$/i.test(color)) {
					const matches = color.match(/rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.\d+|0|1)\s*\)/i);
					const r = clampRGB(matches[1]);
					const g = clampRGB(matches[2]);
					const b = clampRGB(matches[3]);
					const a = clampAlpha(matches[4]);
					return [r, g, b, a];
				}
				// Return null if format is invalid
				return null;
			},

			isLightColor: function(color) {
				const rgba = Player.settings.parseColor(color);
				if (!rgba) return false;

				// Extract RGB components (ignore alpha for luminance calculation)
				const [r, g, b] = rgba;

				// Calculate luminance
				const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

				// Return true if luminance exceeds threshold (102)
				return luminance > 102;
			},

			// Checks if a color's hue is above (greater than) yellow (60°).
			// @param {string} color - Input color (hex, rgb, rgba, or named color)
			// @returns {boolean|null} - Returns:
			//	- `true` if hue > 60° (e.g., greens, blues, purples)
			//	- `false` if hue ≤ 60° (e.g., reds, oranges, yellows)
			//	- `null` if color is invalid or grayscale (no hue)
			isHueAboveYellow: function(color) {
				const rgba = Player.settings.parseColor(color);
				if (!rgba) return null;

				// Convert RGB to HSV to extract hue
				const [r, g, b] = rgba.map(c => c / 255);
				const [hue] = Player.settings.rgbToHsv(r, g, b);

				// Grayscale check (saturation ≈ 0)
				const saturation = Player.settings.rgbToHsv(r, g, b)[1];
				if (saturation < 0.05) return null;

				// Compare hue to yellow (60° in HSV/HSL)
				return (hue * 360) > 60;
			},

			// color:				rgba(255, 255, 255, 1)
			// h: hue,				range (-100 — 100)
			// s: saturation,		range (-100 — 100)
			// v: value/brightness,	range (-100 — 100)
			// a: alpha,	decimal range (  0  —  1 ) and -1 = keep original alpha
			adjustColor: function(color, { h = 0, s = 0, v = 0, a = -1 } = {}) {
				const rgba = Player.settings.parseColor(color);
				if (!rgba) return color;

				// Normalize RGB to [0, 1] and extract alpha (default: 1)
				let [r, g, b, originalA = 1] = rgba;
				r /= 255; g /= 255; b /= 255;

				// Convert to HSV
				const [hue, sat, val] = Player.settings.rgbToHsv(r, g, b);

				// Adjust Hue (handle negative values by looping)
				let newHue = (hue * 360 + h) % 360; // Apply hue shift
				newHue = newHue < 0 ? newHue + 360 : newHue; // Ensure 0-360 range

				// Adjust Saturation & Value (clamped to 0-1)
				const newSat = Math.min(1, Math.max(0, sat + s / 100));
				const newVal = Math.min(1, Math.max(0, val + v / 100));

				// Handle Alpha (if a=-1, keep original; else clamp to [0, 1])
				const newAlpha = a === -1 ? originalA : Math.min(1, Math.max(0, a));

				// Convert back to RGB
				const [newR, newG, newB] = Player.settings.hsvToRgb(newHue, newSat, newVal);

				// Helper function to validate and clamp alpha values
				const clampAlpha = (value) => {
					const num = parseFloat(value);
					return Math.min(1, Math.max(0, isNaN(num) ? 1 : num));
				};

				// Return as RGBA string
				return `rgba(${Math.round(newR * 255)},${Math.round(newG * 255)},${Math.round(newB * 255)},${clampAlpha(newAlpha.toFixed(2))})`;
			},

			// Mixes two rgba colors with optional weighting and blending mode
			// @param {string} color1 - First color (rgba)
			// @param {string} color2 - Second color (rgba)
			// @param {object} options - Mixing options:
			// - weight: 0-1 (default 0.5, equal blend)
			// @returns {string} Mixed color in rgba() format
			mixColors: function(color1, color2, weight = 0.5) {
				// Parse the input RGBA strings
				const parseRgba = (rgba) => {
					const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([0-9.]+)?\)/);
					if (!match) throw new Error("Invalid RGBA format");
					return {
						r: parseInt(match[1]),
						g: parseInt(match[2]),
						b: parseInt(match[3]),
						a: match[4] !== undefined ? parseFloat(match[4]) : 1,
					};
				};

				const c1 = parseRgba(color1);
				const c2 = parseRgba(color2);

				// Linear interpolation function
				const lerp = (a, b, t) => a + (b - a) * t;

				// Mix the colors
				const a = lerp(c1.a, c2.a, weight);
				const r = Math.round(lerp(c1.r * c1.a, c2.r * c2.a, weight) / a);
				const g = Math.round(lerp(c1.g * c1.a, c2.g * c2.a, weight) / a);
				const b = Math.round(lerp(c1.b * c1.a, c2.b * c2.a, weight) / a);

				// Helper function to validate and clamp alpha values
				const clampAlpha = (value) => {
					const num = parseFloat(value);
					return Math.min(1, Math.max(0, isNaN(num) ? 1 : num));
				};

				return `rgba(${r},${g},${b},${clampAlpha(a.toFixed(2))})`;
			},

			rgbToHsv: function(r, g, b) {
				const max = Math.max(r, g, b);
				const min = Math.min(r, g, b);
				let hVal, sVal, vVal = max;
				const d = max - min;

				sVal = max === 0 ? 0 : d / max;

				if (d === 0) {
					hVal = 0;
				} else {
					switch (max) {
						case r: hVal = (g - b) / d + (g < b ? 6 : 0); break;
						case g: hVal = (b - r) / d + 2; break;
						case b: hVal = (r - g) / d + 4; break;
					}
					hVal /= 6;
				}

				return [hVal, sVal, vVal];
			},

			hsvToRgb: function(h, s, v) {
				const c = v * s;
				const x = c * (1 - Math.abs((h / 60) % 2 - 1));
				const m = v - c;

				let r1, g1, b1;
				if (h < 60) [r1, g1, b1] = [c, x, 0];
				else if (h < 120) [r1, g1, b1] = [x, c, 0];
				else if (h < 180) [r1, g1, b1] = [0, c, x];
				else if (h < 240) [r1, g1, b1] = [0, x, c];
				else if (h < 300) [r1, g1, b1] = [x, 0, c];
				else [r1, g1, b1] = [c, 0, x];

				return [r1 + m, g1 + m, b1 + m];
			},

			// Update a setting.
			set: function(property, value, {
				bypassSave,
				bypassRender,
				silent
			} = {}) {
				const previousValue = _get(Player.config, property);
				if (previousValue === value) {
					return;
				}
				_set(Player.config, property, value);
				!silent && Player.trigger('config', property, value, previousValue);
				!silent && Player.trigger('config:' + property, value, previousValue);
				!bypassSave && Player.settings.save();
				!bypassRender && Player.settings.findDefault(property).showInSettings && Player.settings.render();
			},

			// Reset a setting to the default value
			reset: function(property) {
				let settingConfig = Player.settings.findDefault(property);
				Player.set(property, settingConfig.default);
				Player.display.updateStylesheet();
				//Player.settings.render();
			},

			// Persist the player settings.
			save: function() {
				try {
					// Filter settings that have been modified from the default.
					const settings = settingsConfig.reduce(function _handleSetting(settings, setting) {
						if (setting.settings) {
							setting.settings.forEach(subSetting => _handleSetting(settings, {
								property: setting.property,
								default: setting.default,
								...subSetting
							}));
						} else {
							const userVal = _get(Player.config, setting.property);
							if (userVal !== undefined && userVal !== setting.default) {
								_set(settings, setting.property, userVal);
							}
						}
						return settings;
					}, {});
					// Show the playlist or image view on load, whichever was last shown.
					settings.viewStyle = Player.playlist._lastView;
					// Store the player version with the settings.
					settings.VERSION = window.VERSION;
					// Save the settings.
					return GM.setValue('settings', JSON.stringify(settings));
				} catch (err) {
					Player.logError('There was an error saving the sound player settings. Please check the console for details.');
					console.error('[8chan sounds player]', err);
				}
			},

			// Restore the saved player settings.
			load: async function() {
				try {
					let settings = await GM.getValue('settings') || await GM.getValue(ns + '.settings');
					if (settings) {
						Player.settings.apply(settings, {
							bypassSave: true,
							silent: true
						});
					}
				} catch (err) {
					Player.logError('There was an error loading the sound player settings. Please check the console for details.');
					console.error('[8chan sounds player]', err);
				}
			},

			apply: function(settings, opts = {}) {
				if (typeof settings === 'string') {
					settings = JSON.parse(settings);
				}
				settingsConfig.forEach(function _handleSetting(setting) {
					if (setting.settings) {
						return setting.settings.forEach(subSetting => _handleSetting({
							property: setting.property,
							default: setting.default,
							...subSetting
						}));
					}
					if (opts.ignore && opts.ignore.includes(opts.property)) {
						return;
					}
					const value = _get(settings, setting.property, opts.applyDefault ? setting.default : undefined);
					if (value !== undefined) {
						Player.set(setting.property, value, opts);
					}
				});
			},

			// Find a setting in the default configuration.
			findDefault: function(property) {
				let settingConfig;
				settingsConfig.find(function(setting) {
					if (setting.property === property) {
						return settingConfig = setting;
					}
					if (setting.settings) {
						let subSetting = setting.settings.find(_setting => _setting.property === property);
						return subSetting && (settingConfig = {
							...setting,
							settings: null,
							...subSetting
						});
					}
					return false;
				});
				return settingConfig || {
					property
				};
			},

			// Toggle whether the player or settings are displayed.
			toggle: function(e) {
				e && e.preventDefault();
				// Blur anything focused so the change is applied.
				let focused = Player.$(`.${ns}-settings :focus`);
				focused && focused.blur();
				if (Player.container.getAttribute('data-view-style') === 'settings') {
					Player.playlist.restore();
				} else {
					Player.display.setViewStyle('settings');
				}
			},

			// Handle the user making a change in the settings view.
			handleChange: function(e) {
				try {
					const input = e.eventTarget;
					const property = input.getAttribute('data-property');
					if (!property) {
						return;
					}
					let settingConfig = Player.settings.findDefault(property);

					// Get the new value of the setting.
					const currentValue = _get(Player.config, property);
					let newValue = input[input.getAttribute('type') === 'checkbox' ? 'checked' : 'value'];

					if (settingConfig.parse) {
						newValue = _get(Player, settingConfig.parse)(newValue);
					}
					if (settingConfig && settingConfig.split) {
						newValue = newValue.split(decodeURIComponent(settingConfig.split));
					}

					// Not the most stringent check but enough to avoid some spamming.
					if (currentValue !== newValue) {
						// Update the setting.
						Player.set(property, newValue, {
							bypassRender: true
						});

						// Update the stylesheet reflect any changes.
						if (settingConfig.updateStylesheet) {
							Player.display.updateStylesheet();
						}
					}

					// Run any handler required by the value changing
					settingConfig && settingConfig.handler && _get(Player, settingConfig.handler, () => null)(newValue);
				} catch (err) {
					Player.logError('There was an error updating the setting. Please check the console for details.');
					console.error('[8chan sounds player]', err);
				}
			},

			// Converts a key event in an input to a string representation set as the input value.
			handleKeyChange: function(e) {
				e.preventDefault();
				if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Meta') {
					return;
				}
				e.eventTarget.value = Player.hotkeys.stringifyKey(e);
			},

			// Handle an action link next to a heading being clicked.
			handleAction: function(e) {
				e.preventDefault();
				const property = e.eventTarget.getAttribute('data-property');
				const handlerName = e.eventTarget.getAttribute('data-handler');
				const handler = _get(Player, handlerName);
				handler && handler(property);
			},

			// Encode the decoded input.
			_handleDecoded: function(e) {
				Player.$(`.${ns}-encoded-input`).value = encodeURIComponent(e.eventTarget.value);
			},

			// Decode the encoded input.
			_handleEncoded: function(e) {
				Player.$(`.${ns}-decoded-input`).value = decodeURIComponent(e.eventTarget.value);
			}
		};
	}),
	/* 6 - Playback Controls
		•	Core audio functions:
			o	play()/pause()/togglePlay()
			o	next()/previous(): Track navigation
			o	_movePlaying(): Handles repeat modes
		•	UI controls:
			o	Seek bar handling
			o	Volume control
			o	Progress updates
		•	Video sync for webm files
	*/
	(function(module, exports) {
		const videoFileExtRE = /\.(webm|mp4|m4v|ogv|avi|mpeg|mpg|mpe|m1v|m2v|mov|wmv)$/i;
		const audioFileExtRE = /\.(mp3|m4a|m4b|flac|ogg|oga|opus|mp2|mpega|wav|aac)$/i;
		const videoMimeRE = /^video\/.+$/;
		const audioMimeRE = /^audio\/.+$/;
		const progressBarStyleSheets = {};
		const pendingRequests = new Set();
		let syncInterval;
		let blobUrl;

		module.exports = {
			atRoot: ['togglePlay', 'play', 'pause', 'next', 'previous'],

			delegatedEvents: {
				click: {
					[`.${ns}-previous-button`]: () => Player.previous(),
					[`.${ns}-play-button`]: 'togglePlay',
					[`.${ns}-next-button`]: () => Player.next(),
					[`.${ns}-seek-bar`]: 'controls.handleSeek',
					[`.${ns}-volume-bar`]: 'controls.handleVolume',
					[`.${ns}-fullscreen-button`]: 'display.toggleFullScreen',
					[`.${ns}-media:not(.${ns}-pip) .${ns}-image-link`]: 'togglePlay',
					[`.${ns}-media:not(.${ns}-pip) .${ns}-image`]: 'togglePlay',
					[`.${ns}-media:not(.${ns}-pip) .${ns}-video`]: 'togglePlay',
				},
				mousedown: {
					[`.${ns}-seek-bar`]: () => Player._seekBarDown = true,
					[`.${ns}-volume-bar`]: () => Player._volumeBarDown = true
				},
				mousemove: {
					[`.${ns}-seek-bar`]: e => Player._seekBarDown && Player.controls.handleSeek(e),
					[`.${ns}-volume-bar`]: e => Player._volumeBarDown && Player.controls.handleVolume(e)
				}
			},

			undelegatedEvents: {
				ended: {
					[`.${ns}-video`]: 'controls.handleSoundEnded'
				},
				mouseleave: {
					[`.${ns}-seek-bar`]: e => Player._seekBarDown && Player.controls.handleSeek(e),
					[`.${ns}-volume-bar`]: e => Player._volumeBarDown && Player.controls.handleVolume(e)
				},
				mouseup: {
					body: () => {
						Player._seekBarDown = false;
						Player._volumeBarDown = false;
					}
				}
			},

			soundEvents: {
				ended: 'controls.handleSoundEnded',
				pause: 'controls.handlePlaybackState',
				play: 'controls.handlePlaybackState',
				seeked: 'controls.handlePlaybackState',
				playing: 'controls.handlePlaybackState',
				waiting: 'controls.handlePlaybackState',
				timeupdate: 'controls.updateDuration',
				loadedmetadata: 'controls.updateDuration',
				durationchange: 'controls.updateDuration',
				volumechange: 'controls.updateVolume',
				loadstart: 'controls.pollForLoading',
				error: 'controls.handleSoundError',
			},

			audioEvents: {
				ended: 'controls.handleSoundEnded',
				pause: 'controls.handlePlaybackState',
				play: 'controls.handlePlaybackState',
				//seeked: 'controls.handlePlaybackState',
				//playing: 'controls.handlePlaybackState',
				//waiting: 'controls.handlePlaybackState',
				timeupdate: 'controls.updateDuration',
				//loadedmetadata: 'controls.updateDuration',
				durationchange: 'controls.updateDuration',
				//volumechange: 'controls.updateVolume',
				//loadstart: 'controls.pollForLoading',
			},

			initialize: function() {
				Player.on('show', () => Player._hiddenWhilePolling && Player.controls.pollForLoading());
				Player.on('hide', () => {
					Player._hiddenWhilePolling = !!Player._loadingPoll;
					Player.controls.stopPollingForLoading();
				});

				// Listen for repeat mode changes through Player events
				Player.on('config:repeat', Player.controls.updateLoop);
				Player.on('show', Player.controls.updateLoop);
				Player.on('hide', Player.controls.updateLoop);

				document.addEventListener('visibilitychange', () => {
					// video starts to lag when window is in background, this should get it back to normal speed on tab in + should fix sync
					if (!document.hidden && Player.playing && window.Master !== undefined && !window.Master.paused) {
						const video = document.querySelector(`.${ns}-video`);

						if (isFinite(window.Master.duration) && window.Slave !== undefined && (Math.abs(window.Master.duration - video.duration) < 2) || isFinite(window.Master.duration) && window.Slave === undefined) {
							// Try to resume playback when tab becomes visible
							const currentTime = window.Master.currentTime;
							window.Master.currentTime = 0;
							video.currentTime = 0;
							window.Master.currentTime = currentTime;
							video.currentTime = currentTime;
						}

						window.Master.play().catch(() => {});
						video.play().catch(() => {});
						Player.controls.handlePlaybackState(); // Resync UI
					}
				});

				Player.on('rendered', () => {
					// Keep track of heavily updated elements.
					Player.ui.currentTimeBar = Player.$(`.${ns}-seek-bar .${ns}-current-bar`);
					Player.ui.loadedBar = Player.$(`.${ns}-seek-bar .${ns}-loaded-bar`);

					Player.on('rendered', () => {
						Player.ui.currentTimeBar = Player.$(`.${ns}-seek-bar .${ns}-current-bar`);
						Player.ui.loadedBar = Player.$(`.${ns}-seek-bar .${ns}-loaded-bar`);
					});

					// video event listeners
					const video = document.querySelector(`.${ns}-video`);
					if (video) {
						Object.entries(Player.controls.soundEvents).forEach(([event, handler]) => {
							// Handle both string paths and direct function references
							const handlerFn = typeof handler === 'function'
							? handler
							: _get(Player, handler);
							video.addEventListener(event, handlerFn);
						});
					}
					const syncRate = (source, target) => {
						target.playbackRate = source.playbackRate;
					};

					video.addEventListener('ratechange', () => syncRate(video, Player.audio));
					//audio.addEventListener('ratechange', () => syncRate(audio, video));

					// audio element event listeners
					Object.entries(Player.controls.soundEvents).forEach(([event, handler]) => {
						Player.audio.addEventListener(event, Player.controls[handler]);
					});

					// Update repeat mode when player is rendered
					video.loop = Player.config.repeat === 'one';
					Player.audio.loop = Player.config.repeat === 'one';

					// Restore volume value from the previous session.
					Player.audio.volume = parseFloat(Player.config.volumeValue) || '1';
					video.volume = parseFloat(Player.config.volumeValue) || '1';

					// Add stylesheets to adjust the progress indicator of the seekbar and volume bar.
					document.head.appendChild(progressBarStyleSheets[`.${ns}-seek-bar`] = document.createElement('style'));
					document.head.appendChild(progressBarStyleSheets[`.${ns}-volume-bar`] = document.createElement('style'));
					Player.controls.updateVolume();
					setTimeout(Player.controls.displayMsg, 50);
					setTimeout(Player.controls.displayMsg, 50);
				});
			},

			displayMsg: async function() {
				if(!is4chan && !is8chan) return;

				const msg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><path id="a" d="M20.4 0H3.6C1.6 0 0 1.6 0 3.6v16.8c0 2 1.6 3.6 3.6 3.6h16.8c2 0 3.6-1.6 3.6-3.6V3.6c0-2-1.6-3.6-3.6-3.6Z"/><path id="b" d="M6.032 5.634v12.732a.796.796 0 0 0 1.212.679l10.346-6.367a.796.796 0 0 0 0-1.356L7.244 4.956a.795.795 0 0 0-1.212.678Z"/></defs><g style="opacity:.2;filter:saturate(.5)" transform="translate(7 7) scale(.416667)"><use href="#a" style="fill:#039be5;filter:blur(3px)"/><use href="#a" style="fill:#039be5;filter:blur(.2px)"/><use href="#b" style="fill:#02567a;stroke:#02567a;stroke-miterlimit:2;stroke-width:3px;filter:blur(1.5px)"/><use href="#b" style="fill:#fff;stroke:#fff;stroke-miterlimit:10;stroke-width:3px"/></g></svg>`;

				const blob = new Blob([msg], { type: 'image/svg+xml' });
				let url = URL.createObjectURL(blob);

				const video = document.querySelector(`.${ns}-video`);
				const image = document.querySelector(`.${ns}-image`);

				// Clean up
				// image.onload = () => URL.revokeObjectURL(url);
				// image.onerror = () => URL.revokeObjectURL(url);

				video.src = "";
				video.poster = url;
				image.src = url;

				image.onerror = () => {
					URL.revokeObjectURL(url);
					video.poster = Player.sounds[0].thumb;
					image.src = Player.sounds[0].thumb;
				}

				// Clean up
				// URL.revokeObjectURL(url);
			},

			// Initialize loop state based on current repeat mode
			updateLoop: function() {
				const video = document.querySelector(`.${ns}-video`);

				// if durations don't equal ±2 seconds difference.
				if (window.Slave !== undefined && (Math.abs(window.Master.duration - window.Slave.duration) > 2)) {
					if (syncInterval) clearInterval(syncInterval);
					video.loop = true;
					Player.audio.loop = Player.config.repeat === 'one';
					return;
				}

				video.loop = Player.config.repeat === 'one';
				Player.audio.loop = Player.config.repeat === 'one';
			},

			// Switching being playing and paused.
			togglePlay: function() {
				// Return early if currently loading
				if (window.isLoading) return;

				if (!Player.playing) {
					if (Player.sounds.length) {
						return Player.play(Player.sounds[0]);
					}
					return;
				}

				const video = document.querySelector(`.${ns}-video`);

				if (window.Master !== undefined && window.Master.ended) {
					window.Master.currentTime = 0;
					video.currentTime = 0;
					window.Master.play();
					video.play().catch(() => {});
				} else if (window.Master !== undefined && window.Master.paused) {
					video.currentTime = window.Master.currentTime;
					window.Master.play();
					video.play().catch(() => {});
				} else {
					if (window.Master !== undefined) window.Master.pause();
					if (video) video.pause();
				}

				Player.controls.handlePlaybackState();
			},

			updatePlayButtonState: function() {
				const buttons = document.querySelectorAll(`.${ns}-play-button, .${ns}-seek-bar`);
				buttons.forEach(button => {
					//button.disabled = window.isLoading;
					button.style.opacity = window.isLoading ? '0.5' : '1';
					button.style.cursor = window.isLoading ? 'wait' : 'pointer';
				});
			},

			// Function to safely get file extension (handles multiple dots in filename)
			getFileExtension: function(filename) {
				// Handle edge cases: no extension, hidden files, or filenames ending with dot
				if (!filename || filename.indexOf('.') === -1 || filename.endsWith('.')) {
					return '';
				}
				return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
			},

			/*detectMimeType: function(url, arrayBuffer, responseType) {
				if(audioMimeRE.test(responseType)) return responseType;
				if(videoMimeRE.test(responseType)) return responseType;

				const extension = Player.controls.getFileExtension(url);
				const bytes = new Uint8Array(arrayBuffer);

				// Check by file signature (magic numbers)

				// MKV / WebM
				if (bytes.length >= 4 &&
					bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) {
					// Ideally parse to find DocType (e.g., webm or matroska)
					//return extension === 'webm' ? 'video/webm' : 'video/x-matroska';
					return 'video/webm';
				}

				// MP4/M4A/M4V/M4B (MPEG-4 containers)
				if (bytes.length >= 8 &&
					((bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) || // ftyp
					 (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x00 &&
					  (bytes[3] === 0x18 || bytes[3] === 0x20) && bytes[4] === 0x66 &&
					  bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70))) {
					// Check for specific MP4 subtypes
					if (bytes.length >= 12) {
						if (bytes[8] === 0x4D && bytes[9] === 0x34 && bytes[10] === 0x41 && bytes[11] === 0x20) {
							return 'audio/mp4'; // M4A
						}
						if (bytes[8] === 0x4D && bytes[9] === 0x34 && bytes[10] === 0x56 && bytes[11] === 0x20) {
							return 'video/mp4'; // M4V
						}
						if (bytes[8] === 0x4D && bytes[9] === 0x34 && bytes[10] === 0x42 && bytes[11] === 0x20) {
							return 'audio/mp4'; // M4B (audiobook format, same as M4A)
						}
						if (bytes[8] === 0x71 && bytes[9] === 0x74 && bytes[10] === 0x20 && bytes[11] === 0x20) {
							return 'video/quicktime'; // MOV (QuickTime)
						}
					}
					return 'video/mp4'; // default MP4
				}

				// FLAC
				if (bytes.length >= 4 &&
					bytes[0] === 0x66 &&
					bytes[1] === 0x4C &&
					bytes[2] === 0x61 &&
					bytes[3] === 0x43) {
					return 'audio/flac';
				}

				// OGG (including OGV, OGA, OPUS)
				if (bytes.length >= 4 &&
					bytes[0] === 0x4F &&
					bytes[1] === 0x67 &&
					bytes[2] === 0x67 &&
					bytes[3] === 0x53) {
					// Could be audio or video OGG
					return extension === 'ogv' ? 'video/ogg' : 'audio/ogg';
				}

				// AVI
				if (bytes.length >= 12 &&
					bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && // RIFF
					bytes[8] === 0x41 && bytes[9] === 0x56 && bytes[10] === 0x49 && bytes[11] === 0x20) { // AVI
					return 'video/x-msvideo';
				}

				// WAV
				if (bytes.length >= 12 &&
					bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && // RIFF
					bytes[8] === 0x57 && bytes[9] === 0x41 && bytes[10] === 0x56 && bytes[11] === 0x45) { // WAVE
					return 'audio/wav';
				}

				// MOV (QuickTime)
				if (bytes.length >= 8 &&
					((bytes[4] === 0x6D && bytes[5] === 0x6F && bytes[6] === 0x6F && bytes[7] === 0x76) || // moov
					 (bytes[4] === 0x66 && bytes[5] === 0x72 && bytes[6] === 0x65 && bytes[7] === 0x65))) { // free
					return 'video/quicktime';
				}

				// WMV/ASF
				if (bytes.length >= 16 &&
					bytes[0] === 0x30 && bytes[1] === 0x26 && bytes[2] === 0xB2 && bytes[3] === 0x75 &&
					bytes[4] === 0x8E && bytes[5] === 0x66 && bytes[6] === 0xCF && bytes[7] === 0x11 &&
					bytes[8] === 0xA6 && bytes[9] === 0xD9 && bytes[10] === 0x00 && bytes[11] === 0xAA &&
					bytes[12] === 0x00 && bytes[13] === 0x62 && bytes[14] === 0xCE && bytes[15] === 0x6C) {
					return extension === 'wmv' ? 'video/x-ms-wmv' : 'video/x-ms-asf';
				}

				// MKV (Matroska)
				if (bytes.length >= 4 &&
					bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) {
					return 'video/x-matroska';
				}

				// MPEG (MP3, MP2, MPEG video)
				if (bytes.length >= 3) {
					// MP3 with ID3 tag
					if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
						return 'audio/mpeg';
					}

					// MPEG audio (MP3, MP2) - frame sync
					if ((bytes[0] === 0xFF) && ((bytes[1] & 0xE0) === 0xE0)) {
						// Check layer bits (bits 1-2 of byte 1)
						const layer = (bytes[1] & 0x06) >> 1;
						// Layer 3 (MP3) or Layer 2 (MP2)
						return layer === 3 ? 'audio/mpeg' : 'audio/mpeg'; // MP2 also uses audio/mpeg
					}

					// MPEG video
					if (bytes.length >= 4 &&
						bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 &&
						(bytes[3] >= 0xB0 && bytes[3] <= 0xBF)) {
						return 'video/mpeg';
					}
				}

				// 3GP/3G2 (mobile video formats)
				if (bytes.length >= 12 &&
					bytes[4] === 0x66 && bytes[5] === 0x74 &&
					bytes[6] === 0x79 && bytes[7] === 0x70) { // 'ftyp'

					const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);

					// Known 3GP/3G2 brands
					const known3GPBrands = ['3gp4', '3gp5', '3g2a', '3g2b', '3gr6', '3gs7', '3ge6', '3gg6'];

					if (known3GPBrands.includes(brand)) {
						return 'video/3gpp';
					}
				}

				// AAC (Advanced Audio Coding)
				if (bytes.length >= 2 &&
					(bytes[0] === 0xFF && (bytes[1] & 0xF6) === 0xF0)) {
					return 'audio/aac';
				}

				// Fallback to extension-based detection
				switch(extension) {
					case 'webm': return 'video/webm';
					case 'mp4': return 'video/mp4';
					case 'm4a': case 'm4b': return 'audio/mp4';
					case 'm4v': return 'video/mp4';
					case 'flac': return 'audio/flac';
					case 'ogg': case 'oga': return 'audio/ogg';
					case 'ogv': return 'video/ogg';
					case 'opus': return 'audio/ogg';
					case 'avi': return 'video/x-msvideo';
					case 'asx': return 'video/x-ms-asf'; // Advanced Stream Redirector
					case 'mpeg': case 'mpg': case 'mpe': case 'm1v': case 'm2v': return 'video/mpeg';
					case 'mp3': case 'mpega': case 'mp2': return 'audio/mpeg';
					case 'm3u': return 'application/x-mpegurl'; // Playlist file
					default: return 'audio/mpeg'; // default fallback
				}
			},*/

			BlobXmlHttpRequest: function (src) {
				return new Promise((resolve, reject) => {
					const requestDetails = {
						src,
						resolve,
						reject,
						aborted: false
					};

					pendingRequests.add(requestDetails);

					GM.xmlHttpRequest({
						method: 'GET',
						url: src,
						responseType: 'blob',
						onload: function(response) {
							if (requestDetails.aborted) return; // Skip if aborted
							pendingRequests.delete(requestDetails);

							if (response.status >= 400) {
								console.error(`[8chan sounds player] Failed to fetch media; status: ${response.status}`);
								reject(new Error(`HTTP ${response.status}`));
							} else {
								resolve(response);
							}
						},
						onerror: function(error) {
							pendingRequests.delete(requestDetails);
							reject(error);
						},
						ontimeout: function() {
							pendingRequests.delete(requestDetails);
							reject(new Error('Request timed out'));
						}
					});
				});
			},

			// Cancel a specific request by URL
			cancelRequest: function(src) {
				pendingRequests.forEach(request => {
					if (request.src === src) {
						request.aborted = true;
						request.reject(new Error('Request cancelled by user'));
						pendingRequests.delete(request);
					}
				});
			},

			// Cancel all pending requests
			cancelAllRequests: function() {
				pendingRequests.forEach(request => {
					request.aborted = true;
					request.reject(new Error('All requests cancelled'));
				});
				pendingRequests.clear();
			},

			/*BlobReader: function(blob) {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => {
						// Extract only the base64 data after the comma
						const dataUrl = reader.result;
						const base64Data = dataUrl.split(',')[1]; // Split at comma and take the second part
						resolve(base64Data);
					};
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				});
			},*/

			// Wait for audio to be ready to play
			waitForAudioReady: function() {
				return new Promise((resolve, reject) => {
					if (!Player.audio) {
						return reject(new Error('Player.audio element not found'));
					}

					// Check if already ready
					if (Player.audio.readyState >= 3) {
						return resolve();
					}

					const onReady = () => {
						cleanup();
						resolve();
					};

					const onError = (err) => {
						cleanup();
						reject(err);
					};

					const cleanup = () => {
						Player.audio.removeEventListener('loadeddata', onReady);
						Player.audio.removeEventListener('error', onError);
					};

					Player.audio.addEventListener('loadeddata', onReady);
					Player.audio.addEventListener('error', onError);
				});
			},

			// Wait for video to be ready to play
			waitForVideoReady: function() {
				return new Promise((resolve, reject) => {
					const video = document.querySelector(`.${ns}-video`);
					if (!video) {
						return reject(new Error('Video element not found'));
					}

					// Check if already ready
					if (video.readyState >= 3) {
						return resolve();
					}

					const onReady = () => {
						cleanup();
						resolve();
					};

					const onError = (err) => {
						cleanup();
						reject(err);
					};

					const cleanup = () => {
						video.removeEventListener('loadeddata', onReady);
						video.removeEventListener('error', onError);
					};

					video.addEventListener('loadeddata', onReady);
					video.addEventListener('error', onError);
				});
			},


			// Start playback.
			play: async function(sound) {
				const video = document.querySelector(`.${ns}-video`);
				const image = document.querySelector(`.${ns}-image`);

				// if play(sound) and previous play(sound) equal just reset currentTime
				if (Player.playing !== undefined && window.Master !== undefined && sound.id === Player.playing.id && window.mediaStatus !== "Error") {
					window.Master.currentTime = 0;
					video.currentTime = 0;
					window.Master.play().catch(() => {});
					video.play().catch(() => {});
					Player.controls.handlePlaybackState(); // Resync UI
					return;
				}

				Player.controls.cancelAllRequests();

				window.mediaStatus = undefined; Player.header.render();
				window.isLoading = true;

				if (!sound && !Player.playing && Player.sounds.length) {
					sound = Player.sounds[0];
				}
				if (!sound) {
					window.isLoading = false;
					return;
				}

				//console.log(sound);
				//console.log(Player.sounds);

				window.Master = undefined;
				window.Slave = undefined;

				// Clear previous playback
				if (Player.playing) Player.playing.playing = false;

				// Reset media elements completely
				video.pause();
				video.removeAttribute('src');
				video.load();
				video.currentTime = 0;
				Player.audio.pause();
				Player.audio.removeAttribute('src');
				Player.audio.load();
				Player.audio.currentTime = 0;
				URL.revokeObjectURL(blobUrl);

				Player.controls.updateLoop();
				Player.controls.updatePlayButtonState();

				const showVideo = videoFileExtRE.test(sound.src) || videoFileExtRE.test(sound.image) || videoFileExtRE.test(sound.filename);
				const container = document.querySelector(`.${ns}-media`);
				container.classList[showVideo ? 'add' : 'remove'](ns + '-show-video');

				try {
					sound.playing = true;
					Player.playing = sound;
					await Player.trigger('playsound', sound);
					video.poster = sound.thumb;
					Player.minimised.updatePipSize();
					let response;

					// Case 1: hasSoundUrlInFilename and it is audio (.mp3, .ogg, .m4a, ...)
					if (sound.hasSoundUrlInFilename && !sound.isVideo) {
						//console.log("Case 1: hasSoundUrlInFilename and it is audio");
						window.mediaStatus = "Loading"; Player.header.render();
						window.Master = Player.audio;
						window.Slave = video;

						if(!is8chan) {
							Player.audio.src = sound.src;
							video.muted = true;
							// Wait for Player.audio to be ready
							await Player.controls.waitForAudioReady();
						} else {
							// First try with GM.xmlHttpRequest
							try {
								response = await Player.controls.BlobXmlHttpRequest(sound.src);
							} catch (error) {
								response = null;
							}
							//console.log(response.response); console.log('response.type '+response.response.type); console.log('response.status '+response.status);

							if (response && response.status === 200) {
								//const rawBase64 = await Player.controls.BlobReader(response.response);
								//const mimeType = await Player.controls.detectMimeType(sound.src, rawBase64, response.response.type);
								//Player.audio.src = `data:${mimeType};base64,${rawBase64}`;
								blobUrl = URL.createObjectURL(response.response);
								Player.audio.src = blobUrl;
								video.muted = true;

								// Wait for Player.audio to be ready
								await Player.controls.waitForAudioReady();

								if (!isFinite(window.Master.duration)) {
									// Try to estimate from buffered data
									if (window.Master.buffered && window.Master.buffered.length > 0) {
										window.Master.duration = window.Master.buffered.end(window.Master.buffered.length - 1);
									}
								}

							} else {
								console.error(new Error('[8chan sounds player] Failed to fetch via GM_xmlhttpRequest, trying fallback:'));
								window.mediaStatus = "Error"; Player.header.render();
								Player.audio.pause();
								Player.audio.removeAttribute('src');
								Player.audio.load();
								window.Master = video;
								video.muted = false;
								window.Slave = undefined;
							}
						}

						// Handle video/image element carefully for Case 1
						const imageIsVideo = videoFileExtRE.test(sound.filename); // Check if sound.image is actually a supported video format
						if (imageIsVideo) {
							video.src = sound.image; // Use .image for video if it's a supported format

							// Wait for video to be ready
							await Player.controls.waitForVideoReady();

							await video.play().catch(e => {
								console.error('[8chan sounds player] Video playback failed, falling back to empty source:', e);
								video.pause();
								video.removeAttribute('src');
								video.load();
								window.Slave = undefined;
							});
						} else {
							video.pause();
							video.removeAttribute('src');
							video.load();
							window.Slave = undefined;
						}

						// Start playback and Initial sync
						/*if (!is8chan || (response && response.status === 200)) {
							await Player.audio.play();
							Player.controls.syncPlayback();
							// Start sync interval
							if (syncInterval) clearInterval(syncInterval);
							syncInterval = setInterval(Player.controls.syncPlayback, 50);
						}*/
						if (window.Master === Player.audio) {
							await Player.audio.play();
							video.play();
							Player.controls.syncPlayback();
							// Start sync interval
							if (syncInterval) clearInterval(syncInterval);
							syncInterval = setInterval(Player.controls.syncPlayback, 50);
						} else {
							video.play();
							Player.controls.syncPlayback();
						}
					}

					// Case 2: hasSoundUrlInFilename and it is video (.webm, .mp4)
					else if (sound.hasSoundUrlInFilename && sound.isVideo) {
						//console.log("Case 2: hasSoundUrlInFilename and it is video");
						window.mediaStatus = "Loading"; Player.header.render();
						window.Master = video;

						if(!is8chan) {
							video.src = sound.src;
							video.muted = false;
							// Wait for Player.audio to be ready
							await Player.controls.waitForVideoReady();
							// Start playback
							await video.play();
						} else {
							// First try with GM.xmlHttpRequest
							try {
								response = await Player.controls.BlobXmlHttpRequest(sound.src);
							} catch (error) {
								response = null;
							}
							//console.log(response.response); console.log('response.type '+response.response.type); console.log('response.status '+response.status);

							if (response && response.status === 200) {
								//const rawBase64 = await Player.controls.BlobReader(response.response);
								//const mimeType = await Player.controls.detectMimeType(sound.src, rawBase64, response.response.type);
								//video.src = `data:${mimeType};base64,${rawBase64}`;
								blobUrl = URL.createObjectURL(response.response);
								video.src = blobUrl;
								video.muted = false;

								// Wait for video to be readys
								await Player.controls.waitForVideoReady();

								if (!isFinite(window.Master.duration)) {
									// Try to estimate from buffered data
									if (window.Master.buffered && window.Master.buffered.length > 0) {
										window.Master.duration = window.Master.buffered.end(window.Master.buffered.length - 1);
									}
								}

								// Start playback
								await video.play();

							} else {
								console.error(new Error('[8chan sounds player] Failed to fetch via GM_xmlhttpRequest, trying fallback:'));
								window.mediaStatus = "Error"; Player.header.render();
								video.muted = false;
								// Fallback to direct video playback
								const imageIsVideo = videoFileExtRE.test(sound.filename); // Check if sound.image is actually a supported video format
								if (imageIsVideo) {
									video.src = sound.image; // Use .image for video if it's a supported format

									// Wait for video to be ready
									await Player.controls.waitForVideoReady();

									if (!isFinite(window.Master.duration)) {
										// Try to estimate from buffered data
										if (window.Master.buffered && window.Master.buffered.length > 0) {
											window.Master.duration = window.Master.buffered.end(window.Master.buffered.length - 1);
										}
									}

									await video.play().catch(e => {
										console.error('[8chan sounds player] Video playback failed, falling back to empty source:', e);
										video.pause();
										video.removeAttribute('src');
										video.load();
										window.Master = undefined;
									});
								} else {
									video.pause();
									video.removeAttribute('src');
									video.load();
									window.Master = undefined;
								}
							}
						}
					}

					// Case 3: doesn't have SoundUrlInFilename and is video
					else if (!sound.hasSoundUrlInFilename && sound.isVideo) {
						//console.log("Case 3: doesn't have hasSoundUrlInFilename and is video");
						window.mediaStatus = "Loading"; Player.header.render();
						window.Master = video;
						video.src = sound.src;
						video.muted = false;

						// Wait for video to be ready
						await Player.controls.waitForVideoReady();

						if (!isFinite(window.Master.duration)) {
							// Try to estimate from buffered data
							if (window.Master.buffered && window.Master.buffered.length > 0) {
								window.Master.duration = window.Master.buffered.end(window.Master.buffered.length - 1);
							}
						}

						// Start playback
						await video.play();
					}

					// Case 4: doesn't have SoundUrlInFilename and is audio
					else if (!sound.hasSoundUrlInFilename && !sound.isVideo) {
						//console.log("Case 4: doesn't have hasSoundUrlInFilename and is audio");
						window.mediaStatus = "Loading"; Player.header.render();

						window.Master = Player.audio;
						Player.audio.src = sound.src;
						image.src = sound.thumb;

						// Wait for Player.audio to be ready
						await Player.controls.waitForAudioReady();

						if (!isFinite(window.Master.duration)) {
							// Try to estimate from buffered data
							if (window.Master.buffered && window.Master.buffered.length > 0) {
								window.Master.duration = window.Master.buffered.end(window.Master.buffered.length - 1);
							}
						}

						// Start playback
						await Player.audio.play();
					}

				  //console.log('Master: '+window.Master);
				  //console.log('Slave: '+window.Slave);

				  // handlePlaybackState
				  Player.controls.handlePlaybackState();

				} catch (err) {
					console.error('[8chan sounds player] Playback error:', err);
					Player.logError('Could not play sound');
					window.mediaStatus = "Error"; Player.header.render();

					// Full cleanup
					Player.audio.pause();
					Player.audio.removeAttribute('src');
					Player.audio.load();
					const video = document.querySelector(`.${ns}-video`);
					if (video) {
						video.pause();
						video.removeAttribute('src');
						video.load();
					}
					window.Master = undefined;
					window.Slave = undefined;

					//const container = document.querySelector(`.${ns}-media`);
					//container.classList.remove(`${ns}-show-video`);

					if (syncInterval) clearInterval(syncInterval);

					// handlePlaybackState
					Player.controls.handlePlaybackState();

					return Player.next(); // Skip to next track on error

				} finally {
					window.isLoading = false;
					if(window.mediaStatus !== "Error") { window.mediaStatus = undefined; Player.header.render(); }
					container.classList[showVideo ? 'add' : 'remove'](ns + '-show-video');
					Player.controls.updatePlayButtonState();
					Player.minimised.updatePipSize();
				}
			},

			// Pause playback.
			pause: function() {
				const video = document.querySelector(`.${ns}-video`);
				if (window.Master !== undefined) window.Master.pause();
				if (video) video.pause();
				Player.controls.handlePlaybackState();
			},

			// Play the next sound.
			next: function(force = true) {
				Player.controls._movePlaying(1, force);
			},

			// Play the previous sound.
			previous: function(force = true) {
				Player.controls._movePlaying(-1, force);
			},

			_movePlaying: function(direction, force) {
				if (!Player.audio) return;
				if (window.Master === undefined) return;
				if (!window.Master.ended && !force) return;

				try {
					// If there's no sound fall out.
					if (!Player.sounds.length) return;
					// If there's no sound currently playing or it's not in the list then just play the first sound.
					const currentIndex = Player.sounds.indexOf(Player.playing);
					if (currentIndex === -1) return Player.play(Player.sounds[0]);

					// Calculate next index based on repeat mode
					let nextIndex;
					if (!force && Player.config.repeat === 'one') return; //let loop handle it
					if (!force && Player.config.repeat === 'none') {
						const video = document.querySelector(`.${ns}-video`);
						Player.pause();
						if (video) video.pause();
						return;
					}
					nextIndex = currentIndex + direction;
					// Handle if (Player.config.repeat === 'all') / Wrap around for 'all' mode
					if (nextIndex >= Player.sounds.length) nextIndex = 0;
					if (nextIndex < 0) nextIndex = Player.sounds.length - 1;

					const nextSound = Player.sounds[nextIndex];
					nextSound && Player.play(nextSound);

					window.showSoundPostsOnly = false;
					Player.playlist.showOnlySoundposts();
				} catch (err) {
					Player.logError(`There was an error selecting the ${direction > 0 ? 'next' : 'previous'} track. Please check the console for details.`);
					console.error('[8chan sounds player]', err);
				}
			},

			getCurrentPlaybackPosition: function() {
				if (window.Master === undefined) return;

				const video = document.querySelector(`.${ns}-video`);
				return window.Master ? window.Master.currentTime : 0;
			},

			syncPlayback: async function() {
				if (!Player.playing) return;
				if (window.Master === undefined || window.Slave === undefined) return;
				const video = document.querySelector(`.${ns}-video`);
				if (!isFinite(window.Master.duration)) {
					if (syncInterval) clearInterval(syncInterval);
					return;
				}

				// If nothing is playing or Master isn't available, bail out
				if (!window.Master || window.Master.paused) return;

				// if durations don't equal ±2 seconds difference.
				if (window.Slave && (Math.abs(window.Master.duration - window.Slave.duration) > 2)) {
					if (syncInterval) clearInterval(syncInterval);
					video.loop = true;
					Player.audio.loop = Player.config.repeat === 'one';
					return;
				}

				// Sync Slave to Master if it exists and isn't already in sync
				if (window.Slave && (Math.abs(window.Slave.currentTime - window.Master.currentTime) > 0.8)) {
					window.Slave.currentTime = window.Master.currentTime;
				}
			},

			handlePlaybackState: function() {
				const video = document.querySelector(`.${ns}-video`);
				const isPlaying = !Player.audio.paused || (video && !video.paused);

				// Update all play buttons
				document.querySelectorAll(`.${ns}-play-button .${ns}-play-button-display`).forEach(el => {
					el.classList.toggle(`${ns}-play`, !isPlaying);
				});

				// Update container state if needed
				if (Player.container) {
					Player.container.classList.toggle(`${ns}-playing`, isPlaying);
					Player.container.classList.toggle(`${ns}-paused`, !isPlaying);
				}

				Player.controls.updateDuration();
			},

			handleSoundEnded: function() {
				Player.next(false);
			},

			// Handle sound errors
			handleSoundError: function() {
				const video = document.querySelector(`.${ns}-video`);

				// Clean up blob URLs on error
				if (Player.audio.src && Player.audio.src.startsWith('blob:')) {
					URL.revokeObjectURL(Player.audio.src);
					Player.audio.pause();
					Player.audio.removeAttribute('src');
					Player.audio.load();
				}

				if ((window.Master === video) && video?.error) {
					console.error('[8chan sounds player] Video error:', video.error);
					Player.logError('Video playback error.');
					window.mediaStatus = "Error"; Player.header.render();
				} else if (Player.audio?.error) {
					console.error('[8chan sounds player] Audio error:', Player.audio.error);
					Player.logError('Audio playback error.');
					window.mediaStatus = "Error"; Player.header.render();
				}
			},

			// Poll for how much has loaded. I know there's the progress event but it unreliable.
			pollForLoading: function() {
				Player._loadingPoll = Player._loadingPoll || setInterval(Player.controls.updateLoaded, 50);
			},

			// Stop polling for how much has loaded.
			stopPollingForLoading: function() {
				Player._loadingPoll && clearInterval(Player._loadingPoll);
				Player._loadingPoll = null;
			},

			// Update the loading bar.
			updateLoaded: function() {
				if (window.Master === undefined) return;

				const video = document.querySelector(`.${ns}-video`);

				let duration = window.Master.duration;
				if (!isFinite(duration)) {
					// Try to estimate from buffered data
					if (window.Master.buffered && window.Master.buffered.length > 0) {
						duration = window.Master.buffered.end(window.Master.buffered.length - 1);
					}
				}

				if (!window.Master || !window.Master.buffered || window.Master.buffered.length === 0) return;

				const length = window.Master.buffered.length;
				const size = (window.Master.buffered.end(length - 1) / duration) * 100;

				if (size === 100) {
					Player.controls.stopPollingForLoading();
				}

				if (Player.ui.loadedBar) {
					Player.ui.loadedBar.style.width = size + '%';
				}
			},


			// Update the seek bar and the duration labels.
			updateDuration: function() {
				if (!Player.container) return;
				if (window.Master === undefined) return;

				const video = document.querySelector(`.${ns}-video`);

				let duration = window.Master.duration;
				if (!isFinite(duration)) {
					// Try to estimate from buffered data
					if (window.Master.buffered && window.Master.buffered.length > 0) {
						duration = window.Master.buffered.end(window.Master.buffered.length - 1);
					}
				}

				const currentTime = Player.controls.getCurrentPlaybackPosition();

				document.querySelectorAll(`.${ns}-current-time`).forEach(el => el.innerHTML = toDuration(currentTime));
				document.querySelectorAll(`.${ns}-duration`).forEach(el => el.innerHTML = toDuration(duration));

				Player.controls.updateProgressBarPosition(`.${ns}-seek-bar`, Player.ui.currentTimeBar, currentTime, duration);
			},

			// Update the volume bar.
			updateVolume: function() {
				Player.controls.updateProgressBarPosition(`.${ns}-volume-bar`, Player.$(`.${ns}-volume-bar .${ns}-current-bar`), Player.audio.volume, 1);
			},

			// Update a progress bar width. Adjust the margin of the circle so it's contained within the bar at both ends.
			updateProgressBarPosition: function(id, bar, current, total) {
				current || (current = 0);
				total || (total = 0);
				const ratio = !total ? 0 : Math.max(0, Math.min(((current || 0) / total), 1));
				bar.style.width = (ratio * 100) + '%';
				if (progressBarStyleSheets[id]) {
					progressBarStyleSheets[id].innerHTML = `${id} .${ns}-current-bar:after {
						margin-right: ${-0.8 * (1 - ratio)}rem;
					}`;
				}
			},

			// Handle the user interacting with the seek bar.
			handleSeek: function(e) {
				e.preventDefault();
				if (!Player.playing) return;
				if (Player.playing.playing == false) return;
				if (window.Master === undefined) return;

				const video = document.querySelector(`.${ns}-video`);

				let duration = window.Master.duration;
				if (!isFinite(duration)) {
					// Try to estimate from buffered data
					if (window.Master.buffered && window.Master.buffered.length > 0) {
						duration = window.Master.buffered.end(window.Master.buffered.length - 1);
					}
				}

				if (!window.Master || !isFinite(duration)) return;

				const ratio = e.offsetX / parseInt(document.defaultView.getComputedStyle(e.eventTarget || e.target).width, 10);
				const seekTime = duration * ratio;

				// Update media elements
				window.Master.currentTime = seekTime;
				if (Player.playing?.hasSoundUrlInFilename) {
					if (video) video.currentTime = seekTime;
				}

				if (!window.Master.paused) {
					window.Master.play();
					video.play().catch(() => {});
				}
				Player.controls.handlePlaybackState(); // Resync UI
			},


			// Handle the user interacting with the volume bar.
			handleVolume: function(e) {
				e.preventDefault();
				if (!Player.container) return;

				const ratio = e.offsetX / parseInt(document.defaultView.getComputedStyle(e.eventTarget || e.target).width, 10);

				Player.audio.volume = Math.max(0, Math.min(ratio, 1));
				const video = document.querySelector(`.${ns}-video`);
				if (video) {
					video.volume = Player.audio.volume;
				}

				// Set the volume value so it can be used for the next session and restore the volume value during the initialization.
				Player.set('volumeValue', Player.audio.volume.toString());

				Player.controls.updateVolume();
			},
		};
	}),
	/* 7 - Display Management
		•	Player UI lifecycle:
			o	render(): Creates player DOM
			o	show()/hide(): Visibility control
			o	toggleFullScreen()
		•	Handles:
			o	4chan X integration
			o	View style switching
			o	Drag-and-drop for files
	*/
	(function(module, exports) {
		module.exports = {
			atRoot: ['show', 'hide'],

			delegatedEvents: {
				click: {
					[`.${ns}-close-button`]: 'hide'
				},
				fullscreenchange: {
					[`.${ns}-media-and-controls`]: 'display._handleFullScreenChange'
				},
				drop: {
					[`#${ns}-container`]: 'display._handleDrop'
				}
			},

			// Create the player show/hide button in to the 4chan X header.
			initChanX: function () {
				if (Player.display._initedChanX) {
					return;
				}
				const shortcuts = document.getElementById('shortcuts');
				if (!shortcuts) {
					return;
				}
				Player.display._initedChanX = true;

				let innerHtml;
				if(document.documentElement && document.documentElement.classList.contains('fourchan-xt')) {
					innerHtml = `<span id="shortcut-sounds" class="shortcut brackets-wrap" data-index="0">
									<a title="8chan Sounds" href="javascript:;">
										<span class="icon--alt-text">Sounds</span>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z"/></svg>
									</a>
								</span>
					`;
				} else {
					innerHtml = `<span id="shortcut-sounds" class="shortcut brackets-wrap" data-index="0">
									<a href="javascript:;" title="8chan Sounds" style="font-weight: 900;" class="fa fa-play-circle-o">Sounds</a>
								</span>`;
				}
				const showIcon = createElement(innerHtml);


				shortcuts.insertBefore(showIcon, document.getElementById('shortcut-settings'));
				showIcon.querySelector('a').addEventListener('click', Player.display.toggle);
			},

			// Create the player show/hide button in the 8chan header
			initHeader: function() {
				if (Player.display._initedHeader && !is8chan) {
					return;
				}

				// Find the header navigation container
				const navOptions = document.querySelector('#navOptionsSpan');
				if (!navOptions) {
					return;
				}

				Player.display._initedHeader = true;

				navOptions.insertBefore(createElement(`<span>/</span>`), navOptions.lastElementChild);

				// Create the sounds button
				const soundsButton = createElement(`<a title="8chan Sounds Player" class="coloredIcon navOptions8chanSoundsPlayer"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 8 8"><path fill="currentColor" d="M8 0C3 0 2 1 2 1v4.09A1.6 1.6 0 0 0 1.5 5C.67 5 0 5.67 0 6.5S.67 8 1.5 8S3 7.33 3 6.5V2.53c.73-.23 1.99-.44 4-.5v2.06A1.6 1.6 0 0 0 6.5 4C5.67 4 5 4.67 5 5.5S5.67 7 6.5 7S8 6.33 8 5.5z"/></svg></a>`);
				navOptions.insertBefore(soundsButton, navOptions.lastElementChild);
				soundsButton.addEventListener('click', Player.display.toggle);

				// Also add to mobile menu
				const mobileMenu = document.querySelector('#sidebar-menu ul');
				if (mobileMenu) {
					const mobileItem = createElement(`<li><a class="coloredIcon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 8 8" style="margin-right: 0.1em;"><path fill="currentColor" d="M8 0C3 0 2 1 2 1v4.09A1.6 1.6 0 0 0 1.5 5C.67 5 0 5.67 0 6.5S.67 8 1.5 8S3 7.33 3 6.5V2.53c.73-.23 1.99-.44 4-.5v2.06A1.6 1.6 0 0 0 6.5 4C5.67 4 5 4.67 5 5.5S5.67 7 6.5 7S8 6.33 8 5.5z"/></svg>Sounds Player</a></li>`);
					mobileMenu.appendChild(mobileItem);
					mobileItem.querySelector('a').addEventListener('click', Player.display.toggle);
				}
			},

			// Initialize footer elements
			initFooter: function() {
				if (Player.display._initedFooter && !is8chan) {
					return;
				}

				// Find the footer navigation container
				const threadBottom = document.querySelector('.threadBottom .innerUtility');
				if (!threadBottom) {
					return;
				}

				Player.display._initedFooter = true;

				// Check if sounds link already exists
				if (!threadBottom.querySelector('a[title*="8chan Sounds Player"]')) {
					// Create the sounds button
					const soundsButton = createElement(`
						<a title="8chan Sounds Player">Sounds Player</a>
					`);

					// Insert after Catalog link
					const catalogLink = threadBottom.querySelector('a[href$="catalog.html"]');
					if (catalogLink) {
						threadBottom.insertBefore(document.createTextNode(' '), catalogLink.nextSibling);
						threadBottom.insertBefore(soundsButton, catalogLink.nextSibling);
						threadBottom.insertBefore(document.createTextNode(' '), catalogLink.nextSibling);
					} else {
						// Fallback if catalog link not found
						threadBottom.insertBefore(document.createTextNode(' '), threadBottom.firstChild);
						threadBottom.insertBefore(soundsButton, threadBottom.firstChild);
					}

					// Add click handler
					soundsButton.addEventListener('click', Player.display.toggle);
				}
			},

			// Render the player.
			render: async function() {
				try {
					if (Player.container) {
						document.body.removeChild(Player.container);
						document.head.removeChild(Player.stylesheet);
					}

					// Create the main stylesheet.
					Player.display.updateStylesheet();

					// Create the main player. For native threads put it in the threads to get free quote previews.
					const isThread = document.body.classList.contains('is_thread');
					const parent = isThread && !isChanX && document.body.querySelector('.board') || document.body;
					Player.container = createElement(Player.templates.body(), parent);

					Player.trigger('rendered');
				} catch (err) {
					Player.logError('There was an error rendering the sound player. Please check the console for details.');
					console.error('[8chan sounds player]', err);
					// Can't recover, throw.
					throw err;
				}
			},

			updateStylesheet: function() {
				// Insert the stylesheet if it doesn't exist.
				Player.stylesheet = Player.stylesheet || createElement('<style></style>', document.head);
				Player.stylesheet.innerHTML = Player.templates.css();
			},

			// Change what view is being shown
			setViewStyle: function(style) {
				// Get the size and style prior to switching.
				const previousStyle = Player.config.viewStyle;
				const {
					width,
					height
				} = Player.container.getBoundingClientRect();

				const containerStyle = window.getComputedStyle(document.querySelector(`#${ns}-container`));
				const containerWidth = parseFloat(containerStyle.getPropertyValue('width')) || width;

				// Exit fullscreen before changing to a different view.
				if (style !== 'fullscreen') {
					document.fullscreenElement && document.exitFullscreen();
				}

				// Change the style.
				Player.set('viewStyle', style);
				Player.container.setAttribute('data-view-style', style);

				// Try to reapply the pre change sizing unless it was fullscreen.
				if (previousStyle !== 'fullscreen' || style === 'fullscreen') {
					Player.position.resize(parseInt(containerWidth, 10), parseInt(height, 10));
				}
				Player.trigger('view', style, previousStyle);
			},

			// Togle the display status of the player.
			toggle: function(e) {
				e && e.preventDefault();
				if (Player.container.style.display === 'none') {
					Player.show();
				} else {
					Player.hide();
				}
			},

			// Hide the player. Stops polling for changes, and pauses the aduio if set to.
			hide: function(e) {
				if (!Player.container) {
					return;
				}
				try {
					e && e.preventDefault();
					Player.container.style.display = 'none';

					Player.isHidden = true;
					Player.trigger('hide');
				} catch (err) {
					Player.logError('There was an error hiding the sound player. Please check the console for details.');
					console.error('[8chan sounds player]', err);
				}
			},

			// Show the player. Reapplies the saved position/size, and resumes loaded amount polling if it was paused.
			show: async function(e) {
				if (!Player.container) {
					return;
				}
				try {
					e && e.preventDefault();
					if (!Player.container.style.display) {
						return;
					}
					Player.container.style.display = null;

					Player.isHidden = false;
					await Player.trigger('show');
				} catch (err) {
					Player.logError('There was an error showing the sound player. Please check the console for details.');
					console.error('[8chan sounds player]', err);
				}
			},

			// Toggle the video/image and controls fullscreen state
			toggleFullScreen: async function() {
				if (!document.fullscreenElement) {
					// Make sure the player (and fullscreen contents) are visible first.
					if (Player.isHidden) {
						Player.show();
					}
					Player.$(`.${ns}-media-and-controls`).requestFullscreen();
				} else if (document.exitFullscreen) {
					document.exitFullscreen();
				}
			},

			// Handle file/s being dropped on the player.
			_handleDrop: function(e) {
				e.preventDefault();
				e.stopPropagation();
				Player.playlist.addFromFiles(e.dataTransfer.files);
			},

			// Handle the fullscreen state being changed
			_handleFullScreenChange: function() {
				if (document.fullscreenElement) {
					Player.display.setViewStyle('fullscreen');
					document.querySelector(`.${ns}-image-link`).removeAttribute('href');
				} else {
					if (Player.playing) {
						//document.querySelector(`.${ns}-image-link`).href = Player.playing.image;
						document.querySelector(`.${ns}-image-link`).removeAttribute('href');
					}
					Player.playlist.restore();
				}
			}
		};
	}),
	/* 8 - Event System
		•	Custom event bus with:
			o	Delegated event handling
			o	Audio event bindings
			o	Pub/sub pattern (on/off/trigger)
		•	Manages all player interactions
	*/
	(function(module, exports) {

		module.exports = {
			atRoot: ['on', 'off', 'trigger'],

			// Holder of event handlers.
			_events: {},
			_delegatedEvents: {},
			_undelegatedEvents: {},
			_audioEvents: [],

			initialize: function() {
				const eventLocations = {
					Player,
					...Player.components
				};
				const delegated = Player.events._delegatedEvents;
				const undelegated = Player.events._undelegatedEvents;
				const audio = Player.events._audioEvents;

				for (let name in eventLocations) {
					const comp = eventLocations[name];
					for (let evt in comp.delegatedEvents || {}) {
						delegated[evt] || (delegated[evt] = []);
						delegated[evt].push(comp.delegatedEvents[evt]);
					}
					for (let evt in comp.undelegatedEvents || {}) {
						undelegated[evt] || (undelegated[evt] = []);
						undelegated[evt].push(comp.undelegatedEvents[evt]);
					}
					comp.audioEvents && (audio.push(comp.audioEvents));
				}

				Player.on('rendered', function() {
					// Wire up delegated events on the container.
					Player.events.addDelegatedListeners(Player.container, delegated);

					// Wire up undelegated events.
					Player.events.addUndelegatedListeners(document, undelegated);

					// Wire up audio events.
					for (let eventList of audio) {
						for (let evt in eventList) {
							Player.audio.addEventListener(evt, Player.events.getHandler(eventList[evt]));
						}
					}
				});
			},

			// Set delegated events listeners on a target
			addDelegatedListeners(target, events) {
				for (let evt in events) {
					target.addEventListener(evt, function(e) {
						let nodes = [e.target];
						while (nodes[nodes.length - 1] !== target) {
							nodes.push(nodes[nodes.length - 1].parentNode);
						}
						for (let node of nodes) {
							for (let eventList of [].concat(events[evt])) {
								for (let selector in eventList) {
									if (node.matches && node.matches(selector)) {
										e.eventTarget = node;
										let handler = Player.events.getHandler(eventList[selector]);
										// If the handler returns false stop propogation
										if (handler && handler(e) === false) {
											return;
										}
									}
								}
							}
						}
					});
				}
			},

			// Set, or reset, directly bound events.
			addUndelegatedListeners: function(target, events) {
				for (let evt in events) {
					for (let eventList of [].concat(events[evt])) {
						for (let selector in eventList) {
							target.querySelectorAll(selector).forEach(element => {
								const handler = Player.events.getHandler(eventList[selector]);
								element.removeEventListener(evt, handler);
								element.addEventListener(evt, handler);
							});
						}
					}
				}
			},

			// Create an event listener on the player.
			// @param {String} evt The name of the events.
			// @param {function} handler The handler function.
			on: function(evt, handler) {
				Player.events._events[evt] || (Player.events._events[evt] = []);
				Player.events._events[evt].push(handler);
			},

			// Remove an event listener on the player.
			// @param {String} evt The name of the events.
			// @param {function} handler The handler function.
			off: function(evt, handler) {
				const index = Player.events._events[evt] && Player.events._events[evt].indexOf(handler);
				if (index > -1) {
					Player.events._events[evt].splice(index, 1);
				}
			},

			// Trigger an event on the player.
			// @param {String} evt The name of the events.
			// @param {*} data Data passed to the handler.
			trigger: async function(evt, ...data) {
				const events = Player.events._events[evt] || [];
				for (let handler of events) {
					await handler(...data);
				}
			},

			// Returns the function of Player referenced by name or a given handler function.
			// @param {String|Function} handler Name to function on Player or a handler function.
			getHandler: function(handler) {
				return typeof handler === 'string' ? _get(Player, handler) : handler;
			}
		};
	}),
	/* 9 - Footer Components
		•	Template rendering for:
			o	Footer (status info)
		•	Uses the user-defined templates
	*/
	(function(module, exports) {

		module.exports = {
			initialize: function() {
				Player.userTemplate.maintain(Player.footer, 'footerTemplate');
			},

			render: function() {
				if (Player.container) {
					Player.$(`.${ns}-footer`).innerHTML = Player.templates.footer();
					Player.position.preventWrappingHeaderFooter();
					if (Player.playing) {
						const buttons = document.querySelectorAll(`.${ns}-sound-button, .${ns}-download-sound`);
						buttons.forEach(button => {
							button.style.pointerEvents = !Player.playing?.hasSoundUrlInFilename ? 'none' : 'auto';
							button.style.opacity = !Player.playing?.hasSoundUrlInFilename ? '0.7' : '1';
							button.style.cursor = !Player.playing?.hasSoundUrlInFilename ? 'not-allowed' : 'pointer';
							button.style.filter = !Player.playing?.hasSoundUrlInFilename ? 'grayscale(0.5)' : 'grayscale(0)';
						});
					}
				}
			}
		};


	}),
	/* 10 - Header Components
		•	Template rendering for:
			o	Player header (controls)
		•	Uses the user-defined templates
	*/
	(function(module, exports) {

		module.exports = {
			initialize: function() {
				Player.userTemplate.maintain(Player.header, 'headerTemplate');
			},

			render: function() {
				if (Player.container) {
					Player.$(`.${ns}-header`).innerHTML = Player.templates.header();
				}
			}
		};
	}),
	/* 11 - Hotkey System
		•	Keyboard control:
			o	Binding management
			o	Key event handling
			o	Modifier key support
		•	Configurable activation modes
	*/
	(function(module, exports, __webpack_require__) {

		const settingsConfig = __webpack_require__(1);

		module.exports = {
			initialize: function() {
				Player.on('rendered', Player.hotkeys.apply);
			},

			_keyMap: {
				' ': 'space',
				arrowleft: 'left',
				arrowright: 'right',
				arrowup: 'up',
				arrowdown: 'down'
			},

			addHandler: () => {
				Player.hotkeys.removeHandler();
				document.body.addEventListener('keydown', Player.hotkeys.handle);
			},
			removeHandler: () => {
				document.body.removeEventListener('keydown', Player.hotkeys.handle);
			},

			// Apply the selecting hotkeys option
			apply: function() {
				const type = Player.config.hotkeys;
				Player.hotkeys.removeHandler();
				Player.off('show', Player.hotkeys.addHandler);
				Player.off('hide', Player.hotkeys.removeHandler);

				if (type === 'always') {
					// If hotkeys are always enabled then just set the handler.
					Player.hotkeys.addHandler();
				} else if (type === 'open') {
					// If hotkeys are only enabled with the player toggle the handler as the player opens/closes.
					// If the player is already open set the handler now.
					if (!Player.isHidden) {
						Player.hotkeys.addHandler();
					}
					Player.on('show', Player.hotkeys.addHandler);
					Player.on('hide', Player.hotkeys.removeHandler);
				}
			},

			// Handle a keydown even on the body
			handle: function(e) {
				// Ignore events on inputs so you can still type.
				const ignoreFor = ['INPUT', 'SELECT', 'TEXTAREA', 'INPUT'];
				if (ignoreFor.includes(e.target.nodeName) || Player.isHidden && (Player.config.hotkeys !== 'always' || !Player.sounds.length)) {
					return;
				}
				const k = e.key.toLowerCase();
				const bindings = Player.config.hotkey_bindings || {};

				// Look for a matching hotkey binding
				for (let key in bindings) {
					const keyDef = bindings[key];
					const bindingConfig = k === keyDef.key &&
						(!!keyDef.shiftKey === !!e.shiftKey) && (!!keyDef.ctrlKey === !!e.ctrlKey) && (!!keyDef.metaKey === !!e.metaKey) &&
						(!keyDef.ignoreRepeat || !e.repeat) &&
						settingsConfig.find(s => s.property === 'hotkey_bindings').settings.find(s => s.property === 'hotkey_bindings.' + key);

					if (bindingConfig) {
						e.preventDefault();
						return _get(Player, bindingConfig.keyHandler)();
					}
				}
			},

			// Turn a hotkey definition or key event into an input string.
			stringifyKey: function(key) {
				let k = key.key.toLowerCase();
				Player.hotkeys._keyMap[k] && (k = Player.hotkeys._keyMap[k]);
				return (key.ctrlKey ? 'Ctrl+' : '') + (key.shiftKey ? 'Shift+' : '') + (key.metaKey ? 'Meta+' : '') + k;
			},

			// Turn an input string into a hotkey definition object.
			parseKey: function(str) {
				const keys = str.split('+');
				let key = keys.pop();
				Object.keys(Player.hotkeys._keyMap).find(k => Player.hotkeys._keyMap[k] === key && (key = k));
				const newValue = {
					key
				};
				keys.forEach(key => newValue[key.toLowerCase() + 'Key'] = true);
				return newValue;
			},

			volumeUp: function() {
				Player.audio.volume = Math.min(Player.audio.volume + 0.05, 1);
			},

			volumeDown: function() {
				Player.audio.volume = Math.max(Player.audio.volume - 0.05, 0);
			}
		};
	}),
	/* 12 - Minimized UI
		•	Picture-in-picture mode:
			o	Thumbnail display
			o	4chan X header controls
		•	Handles compact view states
	*/
	(function(module, exports) {

		module.exports = {
			_showingPIP: false,

			delegatedEvents: {
				click: {
					[`.${ns}-pip-toggle-button`]: 'minimised.updatePipSettings'
				}
			},

			initialize: function() {
				if (isChanX || is8chan) {
					// Create a reply element to gather the style from
					const a = createElement('<a></a>', document.body);
					const style = document.defaultView.getComputedStyle(a);
					createElement(`<style>.${ns}-chan-x-controls .${ns}-media-control > div { background: ${style.color} }</style>`, document.head);
					// Clean up the element.
					document.body.removeChild(a);
					// Set up the contents and maintain user template changes.
					Player.userTemplate.maintain(Player.minimised, 'chanXTemplate', ['chanXControls'], ['show', 'hide']);
				}
				Player.on('rendered', Player.minimised.render);
				Player.on('show', Player.minimised.hidePIP);
				Player.on('hide', Player.minimised.showPIP);
				Player.on('playsound', Player.minimised.showPIP);
				Player.on('config:maxPIPWidth', Player.minimised.updatePipSize);
				Player.on('config:maxPIPHeight', Player.minimised.updatePipSize);
			},

			render: function() {
				if (Player.container && (isChanX || is8chan)) {
					let container = document.querySelector(`.${ns}-chan-x-controls`);
					// Create the element if it doesn't exist.
					// Set the user template and control events on it to make all the buttons work.
					if (!container) {
						container = createElementBefore(`<span class="${ns}-chan-x-controls ${ns}-col-auto"></span>`, document.querySelector(`${is8chan ? '#navOptionsSpan' : '#shortcuts'}`).firstElementChild);
						Player.events.addDelegatedListeners(container, {
							click: [Player.userTemplate.delegatedEvents.click, Player.controls.delegatedEvents.click]
						});
					}

					if (Player.config.chanXControls === 'never' || Player.config.chanXControls === 'closed' && !Player.isHidden) {
						return container.innerHTML = '';
					}

					// Render the contents.
					container.innerHTML = Player.userTemplate.build({
						template: Player.config.chanXTemplate,
						sound: Player.playing,
						replacements: {
							'prev-button': `<div class="${ns}-media-control ${ns}-previous-button"><div class="${ns}-previous-button-display"></div></div>`,
							'play-button': `<div class="${ns}-media-control ${ns}-play-button"><div class="${ns}-play-button-display ${!Player.audio || Player.audio.paused ? `${ns}-play` : ''}"></div></div>`,
							'next-button': `<div class="${ns}-media-control ${ns}-next-button"><div class="${ns}-next-button-display"></div></div>`,
							'sound-current-time': `<span class="${ns}-current-time">0:00</span>`,
							'sound-duration-slash': `<span class="${ns}-duration-slash">/</span>`,
							'sound-duration': `<span class="${ns}-duration">0:00</span>`
						}
					});

					Player.controls.handlePlaybackState(); // Resync UI
				}
			},

			updatePipSettings: function(e) {
				e && e.preventDefault();
				Player.set('pip', !Player.config.pip);
			},

			// Move the image to a picture in picture like thumnail.
			showPIP: function() {
				if (!Player.isHidden || !Player.config.pip || !Player.playing || Player.minimised._showingPIP) {
					return;
				}
				Player.minimised._showingPIP = true;
				const image = document.querySelector(`.${ns}-media`);
				document.body.appendChild(image);
				image.classList.add(`${ns}-pip`);
				image.style.bottom = (Player.position.getHeaderOffset().bottom) + 'px';

				Player.minimised.updatePipSize();

				// Show the player again when the image is clicked.
				image.addEventListener('click', Player.show);
			},

			// Move the image back to the player.
			hidePIP: function() {
				document.querySelector(`.${ns}-video`).removeAttribute('style');
				document.querySelector(`.${ns}-image`).removeAttribute('style');
				Player.minimised._showingPIP = false;
				const image = document.querySelector(`.${ns}-media`);
				image.style.minWidth = '100%';
				image.style.maxWidth = '100%';
				image.style.maxHeight = '100%';
				Player.$(`.${ns}-media-and-controls`).insertBefore(document.querySelector(`.${ns}-media`), Player.$(`.${ns}-controls`));
				image.classList.remove(`${ns}-pip`);
				image.style.bottom = null;
				image.removeEventListener('click', Player.show);
			},

			updatePipSize: function() {
				const mediaPIP = document.querySelector(`.${ns}-media.${ns}-pip`);
				const videoEl = document.querySelector(`.${ns}-video`);
				const imageEl = document.querySelector(`.${ns}-image`);

				mediaPIP?.removeAttribute('style');
				videoEl?.removeAttribute('style');
				imageEl?.removeAttribute('style');

				if (!Player.isHidden || !Player.config.pip || !Player.playing || !mediaPIP) {
					return;
				}

				const pipMaxWidth = Math.max(1, parseInt(Player.config.maxPIPWidth) || 220); // Fallback: 220px
				const pipMaxHeight = Math.max(1, parseInt(Player.config.maxPIPHeight) || 220); // Fallback: 220px
				// Safely get video dimensions (fallback to container size if missing)
				const mediaWidth = Player.playing?.isVideo ? Math.max(1, videoEl.videoWidth || pipMaxWidth) : Math.max(1, imageEl.naturalWidth || pipMaxWidth) ;
				const mediaHeight = Player.playing?.isVideo ? Math.max(1, videoEl.videoHeight || pipMaxHeight) : Math.max(1, imageEl.naturalHeight || pipMaxHeight) ;
				//if(videoEl && Player.playing?.isVideo) console.log('videoEl.videoWidth '+videoEl.videoWidth+' videoEl.videoHeight '+videoEl.videoHeight);
				//if(imageEl && !Player.playing?.isVideo) console.log('imageEl.naturalWidth '+imageEl.naturalWidth+' imageEl.naturalHeight '+imageEl.naturalHeight);
				const mediaAspectRatio = mediaWidth / mediaHeight;
				const maxAspectRatio = pipMaxWidth / pipMaxHeight;

				const applyPipDimensions = (element) => {
					let newWidth, newHeight;

					// Determine scaling factor based on aspect ratio comparison
					if (!isFinite(mediaAspectRatio) || !isFinite(maxAspectRatio)) {
						// Fallback if invalid aspect ratios
						newWidth = pipMaxWidth;
						newHeight = pipMaxHeight;
					} else if (mediaAspectRatio > maxAspectRatio) {
						// Video is wider than container -> scale by width
						newWidth = pipMaxWidth;
						newHeight = pipMaxWidth / mediaAspectRatio;
					} else {
						// Video is taller than container -> scale by height
						newHeight = pipMaxHeight;
						newWidth = pipMaxHeight * mediaAspectRatio;
					}

					element.style.maxWidth = `${newWidth}px`;
					element.style.maxHeight = `${newHeight}px`;
					mediaPIP.style.maxWidth = `${newWidth}px`;
					mediaPIP.style.maxHeight = `${newHeight}px`;
				};

				if (Player.playing) {
					applyPipDimensions(videoEl);
					applyPipDimensions(imageEl);
				} else {
					mediaPIP.style.width = Player.config.maxPIPWidth;
					mediaPIP.style.height = Player.config.maxPIPHeight;
				}
			}
		};
	}),
	/* 13 - Playlist & Gallery Management
	    • Sound collection:
 	       o add()/remove()
 	       o Drag-and-drop reordering
 	       o Filtering
 	   • Features:
	        o Hover image previews
	        o Video detection
	        o Playlist navigation
	        o Gallery thumbnail view
	*/
	(function(module, exports, __webpack_require__) {
		const videoFileExtRE = /\.(webm|mp4|m4v|ogv|avi|mpeg|mpg|mpe|m1v|m2v|mov|wmv)$/i;
		const videoMimeRE = /^video\/.+$/;

		const {
			parseFiles,
			parseFileName
		} = __webpack_require__(0);

		module.exports = {
			atRoot: ['add', 'remove'],

			delegatedEvents: {
				click: {
					[`.${ns}-list-item`]: 'playlist.handleSelect',
					[`.${ns}-gallery-item`]: 'playlist.handleSelect',
				},
				mousemove: {
					[`.${ns}-list-item`]: 'playlist.positionHoverImage',
					[`.${ns}-gallery-item`]: 'playlist.positionHoverImage'
				},
				dragstart: {
					[`.${ns}-list-item`]: 'playlist.handleDragStart',
					[`.${ns}-gallery-item`]: 'playlist.handleDragStart'
				},
				dragenter: {
					[`.${ns}-list-item`]: 'playlist.handleDragEnter',
					[`.${ns}-gallery-item`]: 'playlist.handleGalleryDragEnter'
				},
				dragend: {
					[`.${ns}-list-item`]: 'playlist.handleDragEnd',
					[`.${ns}-gallery-item`]: 'playlist.handleDragEnd'
				},
				dragover: {
					[`.${ns}-list-item`]: e => e.preventDefault(),
					[`.${ns}-gallery-item`]: e => e.preventDefault()
				},
				drop: {
					[`.${ns}-list-item`]: e => e.preventDefault(),
					[`.${ns}-gallery-item`]: e => e.preventDefault()
				}
			},

			undelegatedEvents: {
				mouseenter: {
					[`.${ns}-list-item`]: 'playlist.updateHoverImage',
					[`.${ns}-gallery-item`]: 'playlist.updateHoverImage'
				},
				mouseleave: {
					[`.${ns}-list-item`]: 'playlist.removeHoverImage',
					[`.${ns}-gallery-item`]: 'playlist.removeHoverImage'
				}
			},

			initialize: function() {
				// Keep track of the last view style so we can return to it.
				Player.playlist._lastView = ['playlist', 'image', 'gallery'].includes(Player.config.viewStyle)
											? Player.config.viewStyle
											: 'playlist';

				Player.on('view', style => {
					// Focus the playing song when switching views
					if (style === 'playlist') {
						Player.playlist.scrollToPlayingPlaylist();
					} else if (style === 'gallery') {
						Player.playlist.scrollToPlayingGallery();
					}
					// Track state
					if (style === 'playlist' || style === 'image' || style === 'gallery') {
						Player.playlist._lastView = style;
					}
					Player.playlist.setHoverImageVisibility();
				});

				// Update the UI when a new sound plays, and scroll to it
				Player.on('playsound', sound => {
					Player.playlist.showImage(sound);
					Player.$all(`.${ns}-list-item.playing`).forEach(el => el.classList.remove('playing'));
					Player.$all(`.${ns}-gallery-item.playing`).forEach(el => el.classList.remove('playing'));
					Player.$(`.${ns}-list-item[data-id="${Player.playing.id}"]`)?.classList.add('playing');
					Player.$(`.${ns}-gallery-item[data-id="${Player.playing.id}"]`)?.classList.add('playing');

					Player.playlist.scrollToPlaying();
				});

				// Listen to anything that can affect the display
				Player.on('config:filters', Player.playlist.applyFilters);
				Player.on('config:hoverImages', Player.playlist.setHoverImageVisibility);
				Player.on('menu-open', Player.playlist.setHoverImageVisibility);
				Player.on('menu-close', Player.playlist.setHoverImageVisibility);
				Player.on('config:rowTemplate', Player.playlist.render);
				Player.on('config:galleryItemTemplate', Player.playlist.render);

				// Multiple instances of the script can run simultaneously, with each tab having a different dataViewStyle.
				// This function ensures that the Three-State viewStyle button displays what it's supposed to.
				/*document.addEventListener('visibilitychange', () => {
					if (!document.hidden) {
						if (!Player.container) return;
						const dataViewStyle = Player.container.getAttribute('data-view-style');
						//const dataViewStyle = Player.config.viewStyle
						if (dataViewStyle && dataViewStyle !== undefined) {
							try {
								Player.display.setViewStyle(dataViewStyle);
								Player.set('config:viewStyle', dataViewStyle);
								//Player.playlist._switchView(dataViewStyle);
							} catch (err) {
								Player.logError('There was an error switching the view style. Please check the console for details.', 'warning');
								console.error('[8chan sounds player]', err);
							}
						}
					}
				});*/

				// Keeps dataViewStyle in sync between multiple instances/tabs.
				// This function ensures that the Three-State viewStyle button displays what it's supposed to.
				Player.on('config:viewStyle', () => {
					if (Player.container && !document.hasFocus()) {
						const currentStyle = Player.container.getAttribute('data-view-style');
						const newStyle = Player.config.viewStyle;
						if (currentStyle && currentStyle !== undefined) {
							//console.log({currentStyle, newStyle});
							try {
								Player.playlist._switchView(newStyle, currentStyle);
							} catch (err) {
								Player.logError('There was an error switching the view style. Please check the console for details.', 'warning');
								console.error('[8chan sounds player]', err);
							}
						}
					}
				});
			},

			// Render the playlist or gallery based on current view
			render: function() {
				if (!Player.container) {
					return;
				}

				const galleryContainer = Player.$(`.${ns}-gallery-container`);
				galleryContainer.innerHTML = Player.templates.galleryList(); // module 31

				const playlistContainer = Player.$(`.${ns}-list-container`);
				playlistContainer.innerHTML = Player.templates.list(); // module 25

				Player.events.addUndelegatedListeners(document.body, Player.playlist.undelegatedEvents);
				Player.playlist.showOnlySoundposts();
				Player.playlist.updateStripes();
			},

			// Restore the last playlist or image view.
			restore: function() {
				Player.display.setViewStyle(Player.playlist._lastView || 'playlist');
			},

			// Update the image displayed in the player.
			showImage: function(sound, thumb) {
				if (!Player.container) {
					return;
				}
				const isVideo = videoFileExtRE.test(sound.src) || videoFileExtRE.test(sound.image) || videoFileExtRE.test(sound.filename);
				try {
					const container = document.querySelector(`.${ns}-media`);
					const img = container.querySelector(`.${ns}-image`);
					const video = container.querySelector(`.${ns}-video`);
					img.src = '';
					img.src = isVideo || thumb ? sound.thumb : sound.image;
					video.src = isVideo ? sound.image : undefined;
					container.classList[isVideo ? 'add' : 'remove'](ns + '-show-video');
				} catch (err) {
					Player.logError('There was an error display the sound player image. Please check the console for details.');
					console.error('[8chan sounds player]', err);
				}
			},

			// Switch between playlist and image view.
			toggleView: function(e) {
				const style = Player.config.viewStyle === 'playlist' ? 'gallery' : Player.config.viewStyle === 'gallery' ? 'image' : 'playlist';
				//const style = Player.config.viewStyle === 'playlist' ? 'gallery' : 'playlist';

				//const styles = ['playlist', 'gallery', 'image'];
				//const currentIndex = styles.indexOf(Player.config.viewStyle);
				//const style = styles[(currentIndex + 1) % styles.length];

				Player.playlist._switchView(style);
			},

			viewPlaylist: function(e) {
				Player.playlist._switchToView('playlist', e);
			},

			viewGallery: function(e) {
				Player.playlist._switchToView('gallery', e);
			},

			viewImage: function(e) {
				Player.playlist._switchToView('image', e);
			},

			// Helper method to switch to a specific view
			_switchToView: function(style, e) {
				e?.preventDefault();
				Player.playlist._switchView(style);
			},

			// Main view switching logic
			_switchView: function(newStyle, currentStyle = Player.config.viewStyle) {
				if (!Player.container) return;
				if (newStyle === currentStyle) return;
				try {
					const mediaElement = Player.$(`.${ns}-media`);
					const listElement = Player.$(`.${ns}-list-container`);
					const galleryElement = Player.$(`.${ns}-gallery-container`);

					// Handle height calculations based on transition
					if (currentStyle === 'image' && newStyle !== 'image') {
						// Transitioning FROM image view
						const mediaHeight = Player.playlist._getElementHeight(mediaElement);
						const galleryHeight = Player.playlist._getElementHeight(galleryElement);
						const newHeight = Math.max(mediaHeight - galleryHeight, 25);

						mediaElement.style.height = newHeight + 'px';
						Player.display.setViewStyle(newStyle);

						listElement.style.height = galleryHeight + 'px';
						galleryElement.style.height = galleryHeight + 'px';
					} else if (currentStyle !== 'image' && newStyle === 'image') {
						// Transitioning TO image view
						const sourceHeight = currentStyle === 'playlist'
						? Player.playlist._getElementHeight(listElement)
						: Player.playlist._getElementHeight(galleryElement);

						Player.display.setViewStyle(newStyle);

						listElement.style.height = sourceHeight + 'px';
						galleryElement.style.height = sourceHeight + 'px';
					} else if (currentStyle !== 'image' && newStyle !== 'image') {
						// Transitioning between playlist and gallery
						const sourceHeight = currentStyle === 'playlist'
						? Player.playlist._getElementHeight(listElement)
						: Player.playlist._getElementHeight(galleryElement);

						Player.display.setViewStyle(newStyle);

						listElement.style.height = sourceHeight + 'px';
						galleryElement.style.height = sourceHeight + 'px';
					}

					// Apply the new view style
					Player.display.setViewStyle(newStyle);
					Player.set('config:viewStyle', newStyle);
					Player.playlist.setHoverImageVisibility();
					Player.playlist.updateStripes();
				} catch (err) {
					Player.logError('There was an error switching the view style. Please check the console for details.', 'warning');
					console.error('[8chan sounds player]', err);
				}
			},

			// Helper to get element height
			_getElementHeight: function(element) {
				return parseFloat(element.style.height) || parseFloat(getComputedStyle(element).height) || 200;
			},

			// Add a new sound from the thread to the player.
			add: function(sound, skipRender) {
				try {
					const id = sound.id;
					// Make sure the sound is not a duplicate.
					if (Player.sounds.find(sound => sound.id === id)) {
						return;
					}

					// Add the sound with the location based on the shuffle settings.
					let index = Player.config.shuffle ?
						Math.floor(Math.random() * Player.sounds.length - 1) :
					Player.sounds.findIndex(s => Player.compareIds(s.id, id) > 1);
					index < 0 && (index = Player.sounds.length);
					Player.sounds.splice(index, 0, sound);

					if (Player.container) {
						if (!skipRender) {

							// Add the sound to the gallery.
							const galleryContainer = Player.$(`.${ns}-gallery-container`);
							let itemContainer = document.createElement('div');
							itemContainer.innerHTML = Player.templates.galleryList({
								sounds: [sound]
							});
							Player.events.addUndelegatedListeners(itemContainer, Player.playlist.undelegatedEvents);
							let item = itemContainer.children[0];
							if (index < Player.sounds.length - 1) {
								const before = Player.$(`.${ns}-gallery-item[data-id="${Player.sounds[index + 1].id}"]`);
								galleryContainer.insertBefore(item, before);
							} else {
								galleryContainer.appendChild(item);
							}

							// Add the sound to the playlist.
							const list = Player.$(`.${ns}-list-container`);
							let rowContainer = document.createElement('div');
							rowContainer.innerHTML = Player.templates.list({
								sounds: [sound]
							});
							Player.events.addUndelegatedListeners(rowContainer, Player.playlist.undelegatedEvents);
							let row = rowContainer.children[0];
							if (index < Player.sounds.length - 1) {
								const before = Player.$(`.${ns}-list-item[data-id="${Player.sounds[index + 1].id}"]`);
								list.insertBefore(row, before);
							} else {
								list.appendChild(row);
							}

						}

						// If nothing else has been added yet show the image for this sound.
						if (Player.sounds.length === 1) {
							// If we're on a thread with autoshow enabled then make sure the player is displayed
							if (/\/thread\//.test(location.href) && Player.config.autoshow) {
								Player.show();
							}
							Player.playlist.showImage(sound);
						}
						Player.trigger('add', sound);

						Player.playlist.showOnlySoundposts(); // filter new sounds
						Player.playlist.updateStripes();
					}
				} catch (err) {
					Player.logError('There was an error adding to the sound player. Please check the console for details.');
					console.log('[8chan sounds player]', sound);
					console.error('[8chan sounds player]', err);
				}
			},

			// Add a new local sound from the users computer to the player.
			addFromFiles: async function(files) {
				for (const file of files) {
					// Skip non-media files
					if (!file.type.startsWith('image') && !file.type.startsWith('video/')/* && !file.type.startsWith('audio/')*/) {
						console.warn("[8chan sounds player] localFile is not an image or video");
						return;
					}

					const filenameRE = /(.*?)[[({](?:audio|sound)[ =:|$](.*?)[\])}]/gi;
					const filenameRE2 = /(\[([^\]]*(?:catbox\.moe)[^\]]*)\])/gi;
					if (file.type.startsWith('image')
						&& (!filenameRE.test(file.name) || (!filenameRE2.test(file.name)))) {
						console.warn("[8chan sounds player] localFile: image without [sound=URL]");
						return;
					}

					try {
						// Convert file to base64 data URL instead of blob URL
						///const dataUrl = await new Promise((resolve) => {
						///	const reader = new FileReader();
						///	reader.onload = () => resolve(reader.result);
						///	reader.readAsDataURL(file);
						///});
						const dataUrl = URL.createObjectURL(file);

						//console.log(file);

						const videoFileExtRE = /(webm|mp4|m4v|ogv|avi|mpeg|mpg|mpe|m1v|m2v|mov|wmv)$/i;

						//const domain = location.href.split("/").slice(0, 3).join("/");
						//const imageSrc = (file.type.startsWith('image') || file.type.startsWith('video/')) ? dataUrl : `${domain}/audioGenericThumb.png`;
						const imageSrc = dataUrl;
						const type = file.type;
						let thumbSrc = imageSrc;
						const fileURL = dataUrl;
						const fileExt = file.name.split('.').pop().toLowerCase();
						const isVideo = videoFileExtRE.test(fileExt);

						if (isVideo) {
							// Create video thumbnail
							const videoTmp = document.createElement('video');
							const canvas = document.createElement('canvas');
							const ctx = canvas.getContext('2d');

							await new Promise((resolve) => {
								videoTmp.addEventListener('loadeddata', () => {
									// setTimeout to avoid black thumbnails
									setTimeout(() => {
										canvas.width = videoTmp.videoWidth;
										canvas.height = videoTmp.videoHeight;
										ctx.drawImage(videoTmp, 0, 0, canvas.width, canvas.height);
										thumbSrc = canvas.toDataURL('image/jpeg');
										resolve();
									}, 100);
								});
								videoTmp.src = dataUrl;
								videoTmp.currentTime = 0.1; // Seek to a small time to get a frame
							});
						}

						function formatFileSize(bytes) {
							if (bytes === 0) return '0 KB';

							const units = ['KB', 'MB', 'GB'];
							const i = Math.floor(Math.log(bytes) / Math.log(1024));

							// Ensure we never return "Bytes" (always at least KB)
							const adjustedSize = i === 0 ? bytes / 1024 : bytes / Math.pow(1024, i);
							const unit = i === 0 ? 'KB' : units[i - 1];

							return adjustedSize.toFixed(2) + ' ' + unit;
						}

						const fileSize = formatFileSize(file.size);

						//function parseFileName(filename, image, post, thumb, imageMD5, fileSize, fileIndex, dataFilemime);
						parseFileName(file.name, imageSrc, 'Local File '+window.localFileCounter, thumbSrc, null, fileSize, 'lF'+window.localFileCounter, file.type)
							.forEach(sound => Player.add({
							...sound,
							src: (sound.hasSoundUrlInFilename) ? sound.src : dataUrl,
							id: 'locF:' + window.localFileCounter,
							local: true,
							type,
						}));

						window.localFileCounter++;
					} catch (error) {
						console.error('[8chan sounds player] Error processing file:', file.name, error);
					}
				}
			},

			// Remove a sound
			remove: function(sound) {
				const index = Player.sounds.indexOf(sound);

				// If the playing sound is being removed then play the next sound.
				if (Player.playing === sound) {
					Player.pause();
					Player.next(true);
				}
				// Remove the sound from the the list and play order.
				if (index > -1) {
					Player.sounds.splice(index, 1);

					// Clean up blob URLs only for local files
					if (sound.local) {
						if (sound.url?.startsWith('blob:')) URL.revokeObjectURL(sound.url);
						if (sound.image?.startsWith('blob:')) URL.revokeObjectURL(sound.image);
						if (sound.thumb?.startsWith('blob:')) URL.revokeObjectURL(sound.thumb);
					}
				}
				// Remove the item from the list.
				Player.$(`.${ns}-list-container`)?.removeChild(Player.$(`.${ns}-list-item[data-id="${sound.id}"]`));
				Player.$(`.${ns}-gallery-container`)?.removeChild(Player.$(`.${ns}-gallery-item[data-id="${sound.id}"]`));
				Player.trigger('remove', sound);
				Player.playlist.updateStripes();
			},

			// Handle an playlist/gallery item being clicked. Either open/close the menu or play the sound.
			handleSelect: function(e) {
				// Ignore if a link was clicked.
				if (e.target.nodeName === 'A' || e.target.closest('a')) {
					return;
				}
				e.preventDefault();
				const id = e.eventTarget.getAttribute('data-id');
				const sound = id && Player.sounds.find(sound => sound.id === id);
				sound && Player.play(sound);
			},

			// Read all the sounds from the thread again.
			refresh: function() {
				parseFiles(document.body);
			},

			// Remove all the parsed sounds from the playlist and parse all the sounds from the thread again.
			reload: function() {
				const galleryContainer = Player.$(`.${ns}-gallery-container`);
				galleryContainer.innerHTML = '';

				const playlistContainer = Player.$(`.${ns}-list-container`);
				playlistContainer.innerHTML = '';

				//Player.playing = undefined;
				const video = document.querySelector(`.${ns}-video`);
				const image = document.querySelector(`.${ns}-image`);

				window.mediaStatus = undefined;
				window.Master = undefined;
				window.Slave = undefined;
				if(Player.playing) Player.playing = undefined;
				Player.controls.pause();
				video.pause();
				video.removeAttribute('src');
				video.removeAttribute('poster');
				video.load();
				image.removeAttribute('src');
				Player.audio.pause();
				Player.audio.removeAttribute('src');
				Player.audio.load();

				Player.sounds = Player.sounds.filter(sound => sound.local === true);
				[...document.querySelectorAll(`a.${ns}-play-link`)].forEach(element => element.remove());
				parseFiles(document.body, false);

				Player.playlist.render();
				Player.controls.updateLoop();
				Player.controls.updatePlayButtonState();

				document.querySelectorAll(`.${ns}-current-time`).forEach(el => el.innerHTML = toDuration(0));
				document.querySelectorAll(`.${ns}-duration`).forEach(el => el.innerHTML = toDuration(0));
				Player.controls.updateProgressBarPosition(`.${ns}-seek-bar`, Player.ui.currentTimeBar, 0, 0);

				setTimeout(Player.controls.displayMsg, 50);
			},

			// Toggle the hoverImages setting
			toggleHoverImages: function(e) {
				e && e.preventDefault();
				Player.set('hoverImages', !Player.config.hoverImages);
			},

			// Only show the hover image with the setting enabled, no item menu open, and nothing being dragged.
			setHoverImageVisibility: function() {
				const container = Player.$(`.${ns}-player`);
				const hideImage = !Player.config.hoverImages ||
					  Player.playlist._dragging ||
					  container.querySelector(`.${ns}-item-menu`);
				container.classList[hideImage ? 'add' : 'remove'](`${ns}-hide-hover-image`);
			},

			// Set the displayed hover image and reposition.
			updateHoverImage: function(e) {
				const id = e.currentTarget.getAttribute('data-id');
				const sound = Player.sounds.find(sound => sound.id === id);
				const hoverImage = Player.$(`.${ns}-hover-image`);
				const dataViewStyle = Player.container.getAttribute('data-view-style');
				dataViewStyle === 'gallery' ? hoverImage.style.display = 'none' : hoverImage.style.display = 'block';
				hoverImage.setAttribute('src', sound.thumb);
				Player.playlist.positionHoverImage(e);
			},

			// Reposition the hover image to follow the cursor.
			positionHoverImage: function(e) {
				const hoverImage = Player.$(`.${ns}-hover-image`);
				const {
					width,
					height
				} = hoverImage.getBoundingClientRect();
				const maxX = document.documentElement.clientWidth - width - 5;
				hoverImage.style.left = (Math.min(e.clientX, maxX) + 5) + 'px';
				hoverImage.style.top = (e.clientY - height - 10) + 'px';
			},

			// Hide the hover image when nothing is being hovered over.
			removeHoverImage: function() {
				const hoverImage = Player.$(`.${ns}-hover-image`);
				hoverImage.style.display = 'none';
			},

			// Start dragging a playlist item.
			handleDragStart: function(e) {
				Player.playlist._dragging = e.eventTarget;
				Player.playlist.setHoverImageVisibility();
				e.eventTarget.classList.add(`${ns}-dragging`);
				//setTimeout(() => {e.dataTransfer.setDragImage(new Image(), 0, 0);}, 100);
				e.dataTransfer.dropEffect = 'move';
				e.dataTransfer.setData('text/plain', e.eventTarget.getAttribute('data-id'));
			},

			// Swap a playlist item when it's dragged over another item (and update gallery accordingly)
			handleDragEnter: function(e) {
				if (!Player.playlist._dragging) return;
				e.preventDefault();

				const moving = Player.playlist._dragging;
				const id = moving.getAttribute('data-id');
				let before = e.target.closest(`.${ns}-list-item`);
				if (!before || moving === before) return;

				// Get corresponding gallery elements
				const movingGallery = Player.$(`.${ns}-gallery-item[data-id="${id}"]`);
				const beforeId = before.getAttribute('data-id');
				let beforeGallery = Player.$(`.${ns}-gallery-item[data-id="${beforeId}"]`);

				const movingIdx = Player.sounds.findIndex(s => s.id === id);
				const list = moving.parentNode;
				const galleryList = movingGallery?.parentNode;

				// Calculate position
				const position = moving.compareDocumentPosition(before);
				if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
					before = before.nextElementSibling;
					if (beforeGallery) {
						beforeGallery = beforeGallery.nextElementSibling;
					}
				}

				// Safely move elements
				try {
					// Update playlist view
					if (before && list.contains(before)) {
						list.insertBefore(moving, before);
					} else {
						list.appendChild(moving);
					}

					// Update gallery view if elements exist
					if (movingGallery && galleryList) {
						if (beforeGallery && galleryList.contains(beforeGallery)) {
							galleryList.insertBefore(movingGallery, beforeGallery);
						} else {
							galleryList.appendChild(movingGallery);
						}
					}

					// Update sounds array
					const newIndex = before ?
						  Player.sounds.findIndex(s => s.id === before.getAttribute('data-id')) :
					Player.sounds.length;
					const [movedSound] = Player.sounds.splice(movingIdx, 1);
					Player.sounds.splice(newIndex, 0, movedSound);

					Player.trigger('order');
					Player.playlist.updateStripes();
				} catch (err) {
					console.error('[8chan sounds player] Drag operation failed:', err);
				}
			},

			// Handle gallery item drag over (and update playlist accordingly)
			handleGalleryDragEnter: function(e) {
				if (!Player.playlist._dragging) return;
				e.preventDefault();

				const moving = Player.playlist._dragging;
				const id = moving.getAttribute('data-id');
				let before = e.target.closest(`.${ns}-gallery-item`);
				if (!before || moving === before) return;

				// Get corresponding playlist elements
				const movingPlaylist = Player.$(`.${ns}-list-item[data-id="${id}"]`);
				const beforeId = before.getAttribute('data-id');
				let beforePlaylist = Player.$(`.${ns}-list-item[data-id="${beforeId}"]`);

				const movingIdx = Player.sounds.findIndex(s => s.id === id);
				const list = moving.parentNode;
				const playlistList = movingPlaylist?.parentNode;

				// Calculate position
				const position = moving.compareDocumentPosition(before);
				if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
					before = before.nextElementSibling;
					if (beforePlaylist) {
						beforePlaylist = beforePlaylist.nextElementSibling;
					}
				}

				// Safely move elements
				try {
					// Update gallery view
					if (before && list.contains(before)) {
						list.insertBefore(moving, before);
					} else {
						list.appendChild(moving);
					}

					// Update playlist view if elements exist
					if (movingPlaylist && playlistList) {
						if (beforePlaylist && playlistList.contains(beforePlaylist)) {
							playlistList.insertBefore(movingPlaylist, beforePlaylist);
						} else {
							playlistList.appendChild(movingPlaylist);
						}
					}

					// Update sounds array
					const newIndex = before ?
						  Player.sounds.findIndex(s => s.id === before.getAttribute('data-id')) :
					Player.sounds.length;
					const [movedSound] = Player.sounds.splice(movingIdx, 1);
					Player.sounds.splice(newIndex, 0, movedSound);

					Player.trigger('order');
					Player.playlist.updateStripes();
				} catch (err) {
					console.error('[8chan sounds player] Drag operation failed:', err);
				}
			},

			// Start dragging a playlist item.
			handleDragEnd: function(e) {
				if (!Player.playlist._dragging) {
					return;
				}
				e.preventDefault();
				delete Player.playlist._dragging;
				e.eventTarget.classList.remove(`${ns}-dragging`);
				Player.playlist.setHoverImageVisibility();
				Player.playlist.updateStripes();
			},

			// Scroll to the playing item.
			scrollToPlaying: function(type = 'center') {
				const dataViewStyle = Player.container.getAttribute('data-view-style');
				if (dataViewStyle === 'playlist') {
					Player.playlist.scrollToPlayingPlaylist(type);
				} else if (dataViewStyle === 'gallery') {
					Player.playlist.scrollToPlayingGallery(type);
				}
			},

			// Scroll to the playing item, unless there is an open menu in the playlist.
			scrollToPlayingPlaylist: function(type = 'center') {
				if (Player.$(`.${ns}-list-container .${ns}-item-menu`)) {
					return;
				}
				const playing = Player.$(`.${ns}-list-item.playing`);
				playing && playing.scrollIntoView({ behavior: 'smooth', block: type });
			},

			// Scroll to playing item in gallery view
			scrollToPlayingGallery: function(type = 'center') {
				const playing = Player.$(`.${ns}-gallery-item.playing`);
				playing && playing.scrollIntoView({ behavior: 'smooth', block: type });
			},

			updateStripes: function() {
				const updateContainerStripes = (container, itemSelector) => {
					const items = Array.from(container.querySelectorAll(`${itemSelector}:not([style*="display: none"])`));
					items.forEach((item, index) => {
						item.classList.remove('odd', 'even');
						item.classList.add(index % 2 === 0 ? 'odd' : 'even');
					});
				};

				// Update playlist stripes
				const listContainer = Player.$(`.${ns}-list-container`);
				if (listContainer) {
					updateContainerStripes(listContainer, `.${ns}-list-item`);
				}

				// Update gallery stripes
				const galleryContainer = Player.$(`.${ns}-gallery-container`);
				if (galleryContainer) {
					updateContainerStripes(galleryContainer, `.${ns}-gallery-item`);
				}
			},

			// Remove any user filtered items from the playlist.
			applyFilters: function() {
				Player.sounds.filter(sound => !Player.acceptedSound(sound)).forEach(Player.playlist.remove);
				Player.playlist.updateStripes();
			},

			showOnlySoundposts: function() {
				// Filter playlist items
				const listItems = Player.$all(`.${ns}-list-item`);
				listItems.forEach(item => {
					const id = item.getAttribute('data-id');
					const sound = Player.sounds.find(s => s.id === id);
					if (sound) {
						item.style.display = window.showSoundPostsOnly && !sound.hasSoundUrlInFilename ? 'none' : '';
					}
				});

				// Filter gallery items
				const galleryItems = Player.$all(`.${ns}-gallery-item`);
				galleryItems.forEach(item => {
					const id = item.getAttribute('data-id');
					const sound = Player.sounds.find(s => s.id === id);
					if (sound) {
						item.style.display = window.showSoundPostsOnly && !sound.hasSoundUrlInFilename ? 'none' : '';
					}
				});

				// Focus the playing song
				Player.playlist.scrollToPlaying();
				Player.playlist.updateStripes();
			},
		};
	}),
	/* 14 - Positioning
		•	Player window:
			o	Draggable header
			o	Resizable
			o	Smart post width limiting
		•	Handles:
			o	Saved position/size
			o	Viewport constraints
			o	4chan X header offsets
	*/
	(function(module, exports) {

		module.exports = {
			delegatedEvents: {
				mousedown: {
					[`.${ns}-header`]: 'position.initMove',
					[`.${ns}-expander`]: 'position.initResize',
				},
			},

			initialize: function() {
				// Apply the last position/size, and post width limiting, when the player is shown.
				Player.on('show', async function() {
					const [top, left] = (await GM.getValue('position') || '').split(':');
					const [width, height] = (await GM.getValue('size') || '').split(':'); +
					top && +left && Player.position.move(top, left, true); +
					width && +height && Player.position.resize(width, height);

					// Ensure player is on screen when shown
					Player.position.ensureOnScreen();

					if (Player.config.limitPostWidths) {
						Player.position.setPostWidths();
						window.addEventListener('scroll', Player.position.setPostWidths);
					}
				});

				// Remove post width limiting when the player is hidden.
				Player.on('hide', function() {
					Player.position.setPostWidths();
					window.removeEventListener('scroll', Player.position.setPostWidths);
				});

				// Reapply the post width limiting config values when they're changed.
				Player.on('config', prop => {
					if (prop === 'limitPostWidths' || prop === 'minPostWidth') {
						window.removeEventListener('scroll', Player.position.setPostWidths);
						Player.position.setPostWidths();
						if (Player.config.limitPostWidths) {
							window.addEventListener('scroll', Player.position.setPostWidths);
						}
					}
				});

				// Remove post width limit from inline quotes
				if(is4chan) {
					new MutationObserver(function() {
						document.querySelectorAll('#hoverUI .postContainer, .inline .postContainer, .backlink_container article').forEach(post => {
							post.style.maxWidth = null;
							post.style.minWidth = null;
						});
					}).observe(document.body, {
						childList: true,
						subtree: true
					});
				}

				this.debouncedResize = window.debounceFc(() => {
					if (Player.config.limitPostWidths) {
						Player.position.setPostWidths();
					}
					Player.position.preventWrapping();
					Player.position.preventWrappingHeaderFooter();
				}, 8);

				window.addEventListener('resize', this.debouncedResize);

				// Document resize observer
				this.resizeObserver = new ResizeObserver(entries => {
					if (Player.container && !Player.isHidden) {
						Player.position.ensureOnScreen();
					}
				});

				this.resizeObserver.observe(document.documentElement);
				this.resizeObserver.observe(document.body);

				// Listen for changes from other tabs
				Player.syncTab('position', value => Player.position.move(...value.split(':').concat(true)));
				Player.syncTab('size', value => Player.position.resize(...value.split(':')));

				Player.on("config:preventControlsWrapping", (e) => !e && Player.position.showAllControls());
				Player.on("config:controlsHideOrder", () => {
					Player.position.setHideOrder();
					Player.position.preventWrapping();
				});

				const preventOffscreenOnMouseUp = () => {
					// Prevents the window from being offscreen when resized.
					const {
						width,
						height
					} = Player.container.getBoundingClientRect();

					const containerStyle = window.getComputedStyle(document.querySelector(`#${ns}-container`));
					const containerWidth = parseFloat(containerStyle.getPropertyValue('width')) || width;

					Player.position.resize(containerWidth, height);
				};

				document.body.addEventListener('mouseup', preventOffscreenOnMouseUp);
			},

			// Applies a max width to posts next to the player so they don't get hidden behind it.
			setPostWidths: /*window.throttleFc(*/function() {
				const offset = (document.documentElement.clientWidth - Player.container.offsetLeft) + 10;
				const selector = is8chan ? '.innerPost:not(.clone)' : is4chan ? '.thread > .postContainer' : '.posts > article.post';
				const enabled = !Player.isHidden && Player.config.limitPostWidths;
				const startY = Player.container.offsetTop;
				const endY = Player.container.getBoundingClientRect().height + startY;

				document.querySelectorAll(selector).forEach(post => {
					const rect = enabled && post.getBoundingClientRect();
					const limitWidth = enabled && rect.top + rect.height > startY && rect.top < endY;
					post.style.maxWidth = limitWidth ? `calc(100% - ${offset}px)` : null;
					post.style.minWidth = limitWidth && Player.config.minPostWidth ? `${Player.config.minPostWidth}` : null;
				});
			},/* 100),*/

			// Handle the user grabbing the expander.
			initResize: function initDrag(e) {
				e.preventDefault();
				Player._startX = e.clientX;
				Player._startY = e.clientY;
				let {
					width,
					height
				} = Player.container.getBoundingClientRect();
				Player._startWidth = width;
				Player._startHeight = height;
				document.documentElement.addEventListener('mousemove', Player.position.doResize, false);
				document.documentElement.addEventListener('mouseup', Player.position.stopResize, false);
			},

			// Handle the user dragging the expander.
			doResize: function(e) {
				e.preventDefault();
				Player.position.resize(Player._startWidth + e.clientX - Player._startX, Player._startHeight + e.clientY - Player._startY);
			},

			// Handle the user releasing the expander.
			stopResize: function() {
				const {
					width,
					height
				} = Player.container.getBoundingClientRect();
				document.documentElement.removeEventListener('mousemove', Player.position.doResize, false);
				document.documentElement.removeEventListener('mouseup', Player.position.stopResize, false);
				GM.setValue('size', width + ':' + height);
			},

			// Resize the player.
			resize: function(width, height) {
				if (!Player.container || Player.container.getAttribute('data-view-style') === 'fullscreen') {
					console.log('Resize aborted: No container or in fullscreen mode');
					return;
				}

				const {
					bottom
				} = Player.position.getHeaderOffset();

				if(width) {
					const maxWidth = document.documentElement.clientWidth - Player.container.offsetLeft; // Make sure the player isn't going off screen.
					width = Math.min(Math.ceil(width), maxWidth);
					Player.container.style.width = width + 'px';
				}

				if(height) {
					const maxHeight = document.documentElement.clientHeight - Player.container.offsetTop - bottom; // Make sure the player isn't going off screen.
					height = Math.min(height, maxHeight);

					// Which element to change the height of depends on the view being displayed.
					const dataViewStyle = Player.container.getAttribute('data-view-style');

					const heightElement = dataViewStyle === 'playlist' ? Player.$(`.${ns}-list-container`) :
					dataViewStyle === 'gallery' ? Player.$(`.${ns}-gallery-container`) :
					dataViewStyle === 'image' ? Player.$(`.${ns}-media`) :
					dataViewStyle === 'settings' ? Player.$(`.${ns}-settings`) :
					dataViewStyle === 'threads' ? Player.$(`.${ns}-threads`) : null;
					const heightElementSibling = dataViewStyle === 'playlist' ? Player.$(`.${ns}-gallery-container`) :
					dataViewStyle === 'gallery' ? Player.$(`.${ns}-list-container`) : null;

					if (!heightElement) {
						console.log('Resize aborted: No height element found for view style');
						return;
					}

					let containerHeight = Player.container.getBoundingClientRect().height;
					let elementHeight = heightElement.getBoundingClientRect().height;
					let offset = containerHeight - elementHeight;
					let finalElementHeight = height - offset;
					//console.log('finalElementHeight 1:'+finalElementHeight);

					// Prevent negative height values
					if ((dataViewStyle === 'playlist' || dataViewStyle === 'gallery') && finalElementHeight < -1) {
						// Resize the media element so that the footer is not off-screen.
						Player.$(`.${ns}-media`).style.height = parseFloat(Player.$(`.${ns}-media`).style.height) + finalElementHeight - elementHeight + 'px';

						// Recalculation is needed because the media element has been resized.
						containerHeight = Player.container.getBoundingClientRect().height;
						elementHeight = heightElement.getBoundingClientRect().height;
						offset = containerHeight - elementHeight;
						finalElementHeight = height - offset;
						if (finalElementHeight < 0) finalElementHeight = 0;
						//console.log('finalElementHeight 2:'+finalElementHeight);
					}

					heightElement.style.height = finalElementHeight + 'px';
					if (heightElementSibling) heightElementSibling.style.height = finalElementHeight + 'px';
				}

				Player.position.preventWrapping();
				Player.position.preventWrappingHeaderFooter();
			},

			// Handle the user grabbing the header.
			initMove: function(e) {
				e.preventDefault();
				if(e.target.tagName !== 'DIV' && e.target.tagName !== 'SPAN') return; // Prevent the initMove() function from being triggered when the click target is an icon.
				Player.userTemplate._closeMenus();

				Player.$(`.${ns}-header`).style.cursor = 'grabbing';

				// Try to reapply the current sizing to fix oversized winows.
				const {
					width,
					height
				} = Player.container.getBoundingClientRect();

				const containerStyle = window.getComputedStyle(document.querySelector(`#${ns}-container`));
				const containerWidth = parseFloat(containerStyle.getPropertyValue('width')) || width;

				Player.position.resize(containerWidth, height);

				Player._offsetX = e.clientX - Player.container.offsetLeft;
				Player._offsetY = e.clientY - Player.container.offsetTop;
				document.documentElement.addEventListener('mousemove', Player.position.doMove, false);
				document.documentElement.addEventListener('mouseup', Player.position.stopMove, false);
			},

			// Handle the user dragging the header.
			doMove: function(e) {
				e.preventDefault();
				Player.position.move(e.clientX - Player._offsetX, e.clientY - Player._offsetY);
			},

			// Handle the user releasing the header.
			stopMove: function() {
				document.documentElement.removeEventListener('mousemove', Player.position.doMove, false);
				document.documentElement.removeEventListener('mouseup', Player.position.stopMove, false);
				Player.$(`.${ns}-header`).style.cursor = null;
				GM.setValue('position', parseInt(Player.container.style.left, 10) + ':' + parseInt(Player.container.style.top, 10));
			},

			// Move the player.
			move: function(x, y, allowOffscreen) {
				if (!Player.container) {
					return;
				}

				const {
					top,
					bottom
				} = Player.position.getHeaderOffset();

				// Ensure the player stays fully within the window.
				const {
					width,
					height
				} = Player.container.getBoundingClientRect();
				const maxX = allowOffscreen ? Infinity : document.documentElement.clientWidth - width;
				const maxY = allowOffscreen ? Infinity : document.documentElement.clientHeight - height - bottom;

				// Move the window.
				Player.container.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
				Player.container.style.top = Math.max(top, Math.min(y, maxY)) + 'px';

				if (Player.config.limitPostWidths) {
					Player.position.setPostWidths();
				}
			},

			// Get the offset from the top or bottom required for the 4chan X header.
			getHeaderOffset: function () {
				if(is8chan) {
					const header = document.querySelector('#dynamicHeader, #dynamicHeaderBoard, #dynamicHeaderThread, .navHeader');
					const headerStyle = header ? window.getComputedStyle(header) : null;
					const headerTopPositionValue = header ? headerStyle.top : null;
					const headerBottomPositionValue = header ? headerStyle.bottom : null;

					const headerHeight = header ? header.getBoundingClientRect().height : 0;

					const top = headerTopPositionValue < headerBottomPositionValue ? headerHeight : 0;
					const bottom = headerTopPositionValue > headerBottomPositionValue ? headerHeight : 0;

					return { top, bottom };
				} else {
					const docClasses = document.documentElement.classList;
					const hasChanXHeader = docClasses.contains('fixed');
					const headerHeight = hasChanXHeader ? document.querySelector('#header-bar').getBoundingClientRect().height : 0;
					const top = hasChanXHeader && docClasses.contains('top-header') ? headerHeight : 0;
					const bottom = hasChanXHeader && docClasses.contains('bottom-header') ? headerHeight : 0;

					return { top, bottom };
				}
			},

			// Ensures the player is within the visible screen area
			ensureOnScreen: function() {
				if (!Player.container || Player.isHidden || Player.container.getAttribute('data-view-style') === 'fullscreen') {
					return;
				}

				const containerRect = Player.container.getBoundingClientRect();
				const viewportWidth = document.documentElement.clientWidth;
				const viewportHeight = document.documentElement.clientHeight;
				const { top: headerTop, bottom: headerBottom } = this.getHeaderOffset();

				// Check if player is completely offscreen
				const isOffscreen =
					containerRect.right < 0 ||
					containerRect.bottom < headerTop ||
					containerRect.left > viewportWidth ||
					containerRect.top > viewportHeight - headerBottom;

				if (isOffscreen) {
					// Move to default position if completely offscreen
					this.move(10, headerTop + 10);
				} else {
					// Adjust position if partially offscreen
					let newLeft = containerRect.left;
					let newTop = containerRect.top;

					if (containerRect.left < 0) {
						newLeft = 0;
					} else if (containerRect.right > viewportWidth) {
						newLeft = viewportWidth - containerRect.width;
					}

					if (containerRect.top < headerTop) {
						newTop = headerTop;
					} else if (containerRect.bottom > viewportHeight - headerBottom) {
						newTop = viewportHeight - headerBottom - containerRect.height;
					}

					if (newLeft !== containerRect.left || newTop !== containerRect.top) {
						this.move(newLeft, newTop);
					}
				}
			},

			showAllControls: function() {
				Player.$all(`.${ns}-controls [data-hide-id]`).forEach((e) => (e.style.display = null));
			},

			preventWrapping: function() {
				// Reset display style first
				Player.position.showAllControls();

				if (!Player.config.preventControlWrapping) return;

				const container = Player.$(`.${ns}-media-and-controls .${ns}-controls`);
				const hideOrder = Player.position.setHideOrder();
				let controls = Array.from(container.children).filter(el => el.hasAttribute('data-hide-id'));
				let lastControl = controls[controls.length - 1];
				const currentTime = container.querySelector(`.${ns}-current-time`);
				const durationSlash = container.querySelector(`.${ns}-duration-slash`);
				const duration = container.querySelector(`.${ns}-duration`);

				// Get initial state
				const containerWidth = container.clientWidth + 1; // +1 fix for Penumbra css theme
				let contentWidth = Array.from(container.children).reduce((sum, el) => sum + el.clientWidth, 0);

				const seekBar = document.querySelector(`.${ns}-seek-bar`);
				const volumeBar = document.querySelector(`.${ns}-volume-bar`);
				if(containerWidth <= 345) {
					seekBar.style.margin = "0 0.4rem";
					volumeBar.style.margin = "0 0.4rem";
				} else {
					seekBar.style.margin = "0 0.8rem";
					volumeBar.style.margin = "0 0.8rem";
				}

				durationSlash.style.display = (currentTime.style.display == "none" || duration.style.display == "none") ? "none" : "";
				if (contentWidth <= containerWidth) return;

				// Hide controls until content fits
				let hideIndex = 0;
				while (contentWidth > containerWidth && hideIndex < hideOrder.length) {
					const controlToHide = hideOrder[hideIndex];
					if (!controlToHide) continue;

					controlToHide.style.display = "none";
					controls = controls.filter(control => control !== controlToHide);

					if (controlToHide === lastControl && controls.length > 0) {
						lastControl = controls[controls.length - 1];
					}

					durationSlash.style.display = (currentTime.style.display == "none" || duration.style.display == "none") ? "none" : "";

					contentWidth = Array.from(container.children).reduce((sum, el) => sum + el.clientWidth, 0);
					hideIndex++;
				}
			},

			setHideOrder: function() {
				// Reset to default if not set
				if (!Array.isArray(Player.config.controlsHideOrder)) {
					Player.settings.reset("controlsHideOrder");
				}

				const controlsContainer = Player.$(`.${ns}-controls`);

				// Create priority map based on array position
				const priorityMap = {};
				Player.config.controlsHideOrder.forEach((control, index) => {
					priorityMap[control] = index;
				});

				// Get all hideable controls, filter to only those in priorityMap, and sort by priority
				Player.position.hideOrder = Array.from(controlsContainer.querySelectorAll('[data-hide-id]'))
					.filter(element => element.getAttribute('data-hide-id') in priorityMap)
					.sort((a, b) => {
						const aPriority = priorityMap[a.getAttribute('data-hide-id')];
						const bPriority = priorityMap[b.getAttribute('data-hide-id')];
						return aPriority - bPriority;
					});

				return Player.position.hideOrder;
			},

			preventWrappingHeaderFooter: function() {
				const container = Player.$(`.${ns}-footer`);
				if (!container) return;

				const containerWidth = container.clientWidth;
				const footerUiBrackets = document.querySelectorAll(`.${ns}-footer .${ns}-ui-bracket`);
				const footerText = document.querySelectorAll(`.${ns}-footer .${ns}-footer-text`);
				const headerTitle = document.querySelectorAll(`.${ns}-header.${ns}-row .${ns}-col.${ns}-truncate-text span`);

				// Hide or unhide
				const footerBracketDisplay = containerWidth < 235 ? "none" : "";
				const footerTextDisplay = containerWidth < 345 ? "none" : "";
				const headerTitleDisplay = containerWidth < 268 ? "none" : "";

				footerUiBrackets.forEach(el => el.style.display = footerBracketDisplay);
				footerText.forEach(el => el.style.display = footerTextDisplay);
				headerTitle.forEach(el => el.style.display = headerTitleDisplay);
			},
		};
	}),
	/* 15 - Thread Search
		•	Catalog scanning:
			o	Board selection
			o	Sound thread detection
		•	Displays:
			o	Table view (metadata)
			o	Board-style view (4chan X only)
	*/
	(function(module, exports, __webpack_require__) {

		const {
			parseFileName
		} = __webpack_require__(0);
		const {
			get
		} = __webpack_require__(16);

		const boardsURL = (is4chan) ? 'https://a.4cdn.org/boards.json' : '';
		const catalogURL = (is4chan) ? 'https://a.4cdn.org/%s/catalog.json' : '';

		module.exports = {
			boardList: null,
			soundThreads: null,
			displayThreads: {},
			selectedBoards: Board ? [Board] : ['a'],
			showAllBoards: false,

			delegatedEvents: {
				click: {
					[`.${ns}-fetch-threads-link`]: 'threads.fetch',
					[`.${ns}-all-boards-link`]: 'threads.toggleBoardList'
				},
				keyup: {
					[`.${ns}-threads-filter`]: e => Player.threads.filter(e.eventTarget.value)
				},
				change: {
					[`.${ns}-threads input[type=checkbox]`]: 'threads.toggleBoard'
				}
			},

			initialize: function() {
				Player.threads.hasParser = is4chan && typeof Parser !== 'undefined';
				// If the native Parser hasn't been intialised chuck customSpoiler on it so we can call it for threads.
				// You shouldn't do things like this. We can fall back to the table view if it breaks though.
				if (Player.threads.hasParser && !Parser.customSpoiler) {
					Parser.customSpoiler = {};
				}

				Player.on('show', Player.threads._initialFetch);
				Player.on('view', Player.threads._initialFetch);
				Player.on('rendered', Player.threads.afterRender);
				Player.on('config:threadsViewStyle', Player.threads.render);
			},

			// Fetch the threads when the threads view is opened for the first time.
			_initialFetch: function() {
				if (Player.container && Player.container.getAttribute('data-view-style') === 'threads' && Player.threads.boardList === null) {
					Player.threads.fetchBoards(true);
				}
			},

			render: function() {
				if (Player.container) {
					Player.$(`.${ns}-threads`).innerHTML = Player.templates.threads();
					Player.threads.afterRender();
				}
			},

			// Render the threads and apply the board styling after the view is rendered.
			afterRender: function() {
				const threadList = Player.$(`.${ns}-thread-list`);
				if (threadList) {
					const bodyStyle = document.defaultView.getComputedStyle(document.body);
					threadList.style.background = bodyStyle.backgroundColor;
					threadList.style.backgroundImage = bodyStyle.backgroundImage;
					threadList.style.backgroundRepeat = bodyStyle.backgroundRepeat;
					threadList.style.backgroundPosition = bodyStyle.backgroundPosition;
				}
				Player.threads.renderThreads();
			},

			// Render just the threads.
			renderThreads: function() {
				if (!Player.threads.hasParser || Player.config.threadsViewStyle === 'table') {
					Player.$(`.${ns}-threads-body`).innerHTML = Player.templates.threadList();
				} else {
					try {
						const list = Player.$(`.${ns}-thread-list`);
						for (let board in Player.threads.displayThreads) {
							// Create a board title
							const boardConf = Player.threads.boardList.find(boardConf => boardConf.board === board);
							const boardTitle = `/${boardConf.board}/ - ${boardConf.title}`;
							createElement(`<div class="boardBanner"><div class="boardTitle">${boardTitle}</div></div>`, list);

							// Add each thread for the board
							const threads = Player.threads.displayThreads[board];
							for (let i = 0; i < threads.length; i++) {
								list.appendChild(Parser.buildHTMLFromJSON.call(Parser, threads[i], threads[i].board, true, true));

								// Add a line under each thread
								createElement('<hr style="clear: both">', list);
							}
						}
					} catch (err) {
						Player.logError('Unable to display the threads board view.', 'warning');
						// If there was an error fall back to the table view.
						Player.set('threadsViewStyle', 'table');
						Player.renderThreads();
					}
				}
			},

			// Render just the board selection.
			renderBoards: function() {
				Player.$(`.${ns}-thread-board-list`).innerHTML = Player.templates.threadBoards();
			},

			// Toggle the threads view.
			toggle: function(e) {
				e && e.preventDefault();
				if (Player.container.getAttribute('data-view-style') === 'threads') {
					Player.playlist.restore();
				} else {
					Player.display.setViewStyle('threads');
				}
			},

			// Switch between showing just the selected boards and all boards.
			toggleBoardList: function() {
				Player.threads.showAllBoards = !Player.threads.showAllBoards;
				Player.$(`.${ns}-all-boards-link`).innerHTML = Player.threads.showAllBoards ? 'Selected Only' : 'Show All';
				Player.threads.renderBoards();
			},

			// Select/deselect a board.
			toggleBoard: function(e) {
				const board = e.eventTarget.value;
				const selected = e.eventTarget.checked;
				if (selected) {
					!Player.threads.selectedBoards.includes(board) && Player.threads.selectedBoards.push(board);
				} else {
					Player.threads.selectedBoards = Player.threads.selectedBoards.filter(b => b !== board);
				}
			},

			// Fetch the board list from the 4chan API.
			fetchBoards: async function(fetchThreads) {
				Player.threads.loading = true;
				Player.threads.render();
				Player.threads.boardList = (await get(boardsURL)).boards;
				if (fetchThreads) {
					Player.threads.fetch();
				} else {
					Player.threads.loading = false;
					Player.threads.render();
				}
			},

			// Fetch the catalog for each selected board and search for sounds in OPs.
			fetch: async function(e) {
				e && e.preventDefault();
				Player.threads.loading = true;
				Player.threads.render();
				if (!Player.threads.boardList) {
					try {
						await Player.threads.fetchBoards();
					} catch (err) {
						Player.logError('Failed to fetch the boards configuration.');
						console.error(err);
						return;
					}
				}
				const allThreads = [];
				try {
					await Promise.all(Player.threads.selectedBoards.map(async board => {
						const boardConf = Player.threads.boardList.find(boardConf => boardConf.board === board);
						if (!boardConf) {
							return;
						}
						const pages = boardConf && await get(catalogURL.replace('%s', board));
						(pages || []).forEach(({
							page,
							threads
						}) => {
							allThreads.push(...threads.map(thread => Object.assign(thread, {
								board,
								page,
								ws_board: boardConf.ws_board
							})));
						});
					}));

					Player.threads.soundThreads = allThreads.filter(thread => {
						const sounds = parseFileName(thread.filename, `https://i.4cdn.org/${thread.board}/${thread.tim}${thread.ext}`, thread.no, `https://i.4cdn.org/${thread.board}/${thread.tim}s${thread.ext}`, thread.md5);
						return sounds.length;
					});
				} catch (err) {
					Player.logError('Failed to search for sounds threads.');
					console.error(err);
				}
				Player.threads.loading = false;
				Player.threads.filter(Player.$(`.${ns}-threads-filter`).value, true);
				Player.threads.render();
			},

			// Apply the filter input to the already fetched threads.
			filter: function(search, skipRender) {
				Player.threads.filterValue = search || '';
				if (Player.threads.soundThreads === null) {
					return;
				}
				Player.threads.displayThreads = Player.threads.soundThreads.reduce((threadsByBoard, thread) => {
					if (!search || thread.sub && thread.sub.includes(search) || thread.com && thread.com.includes(search)) {
						threadsByBoard[thread.board] || (threadsByBoard[thread.board] = []);
						threadsByBoard[thread.board].push(thread);
					}
					return threadsByBoard;
				}, {});
				!skipRender && Player.threads.renderThreads();
			}
		};
	}),
	/* 16 - Network Utilities
		•	Cached requests:
			o	get(): GM_xmlHttpRequest wrapper
			o	Conditional requests
			o	JSON handling
	*/
	(function(module, exports) {

		const cache = {};

		module.exports = {
			get
		};

		async function get(url) {
			return new Promise(function(resolve, reject) {
				const headers = {};
				if (cache[url]) {
					headers['If-Modified-Since'] = cache[url].lastModified;
				}
				GM.xmlHttpRequest({
					method: 'GET',
					url,
					headers,
					responseType: 'json',
					onload: response => {
						if (response.status >= 200 && response.status < 300) {
							cache[url] = {
								lastModified: response.responseHeaders['last-modified'],
								response: response.response
							};
						}
						resolve(response.status === 304 ? cache[url].response : response.response);
					},
					onerror: reject
				});
			});
		}
	}),
	/* 17 - Template System
		•	Dynamic UI generation:
			o	Button definitions
			o	Template parsing
			o	Conditional rendering
		•	Handles all user-customizable layouts
	*/
	(function(module, exports, __webpack_require__) {

		const buttons = __webpack_require__(18);

		// Regex for replacements
		const playingRE = /p: ?{([^}]*)}/g;
		const hoverRE = /h: ?{([^}]*)}/g;
		//const playingRE = /p:\s*\{\s*([^{}]*(\{[^{}]*\}[^{}]*)*)\s*\}/g;
		//const hoverRE = /h:\s*\{\s*([^{}]*(\{[^{}]*\}[^{}]*)*)\s*\}/g;
		const buttonRE = new RegExp(`(${buttons.map(option => option.tplName).join('|')})-(?:button|link|icon)(?:\\:"([^"]+?)")?`, 'g');

		const nsRE = /\${ns}/g;
		const soundRE = /sound/i;
		const soundNameRE = /sound-name/g;
		const soundIndexRE = /sound-index/g;
		const soundCountRE = /sound-count/g;
		const soundIdRE = /sound-id/g;
		const soundPostRE = /sound-post/g;
		const soundFilenameRE = /sound-filename/g;
		const soundFilesizeRE = /sound-filesize/g;
		const soundExtensionRE = /sound-extension/g;
		const soundThumbnailRE = /sound-thumb/g;

		// Hold information on which config values components templates depend on.
		const componentDeps = [];

		module.exports = {
			buttons,

			delegatedEvents: {
				click: {
					[`.${ns}-playing-jump-link`]: () => Player.playlist.scrollToPlaying('center'),
					[`.${ns}-viewStyle-button`]: 'playlist.toggleView',
					[`.${ns}-viewStylePlaylist-button`]: 'playlist.viewPlaylist',
					[`.${ns}-viewStyleGallery-button`]: 'playlist.viewGallery',
					[`.${ns}-viewStyleImage-button`]: 'playlist.viewImage',
					[`.${ns}-hoverImages-button`]: 'playlist.toggleHoverImages',
					[`.${ns}-reload-link`]: 'userTemplate._handleReload',
					[`.${ns}-remove-link`]: 'userTemplate._handleRemove',
					[`.${ns}-filter-link`]: 'userTemplate._handleFilter',
					[`.${ns}-download-link`]: 'userTemplate._handleDownload',
					[`.${ns}-shuffle-button`]: 'userTemplate._handleShuffle',
					[`.${ns}-repeat-button`]: 'userTemplate._handleRepeat',
					[`.${ns}-reload-button`]: noDefault('playlist.reload'),
					[`.${ns}-refresh-button`]: noDefault('playlist.refresh'),
					[`.${ns}-add-button`]: noDefault(() => Player.$(`.${ns}-file-input`).click()),
					[`.${ns}-item-menu-button`]: 'userTemplate._handleMenu',
					[`.${ns}-dropdown-menu-button`]: 'userTemplate._handleDropdownMenu',
					[`.${ns}-threads-button`]: 'threads.toggle',
					[`.${ns}-config-button`]: 'settings.toggle',
					[`#${ns}-codecs-close-button`]: 'userTemplate.codecsInfoClose',
					[`.${ns}-soundpost-only-toggle-button`]: 'userTemplate._handleSoundpostToggle',
					[`.${ns}-ui-button`]: () => {
						// Re-render components that contain the toggle button
						Player.header.render();
						Player.footer.render();
					},
				},
				change: {
					[`.${ns}-file-input`]: 'userTemplate._handleFileSelect'
				}
			},

			undelegatedEvents: {
				click: {
					body: 'userTemplate._closeMenus'
				},
				keydown: {
					body: e => e.key === 'Escape' && Player.userTemplate._closeMenus()
				}
			},

			initialize: function() {
				Player.on('config', Player.userTemplate._handleConfig);
				Player.on('playsound', () => Player.userTemplate._handleEvent('playsound'));
				Player.on('add', () => Player.userTemplate._handleEvent('add'));
				Player.on('remove', () => Player.userTemplate._handleEvent('remove'));
				Player.on('order', () => Player.userTemplate._handleEvent('order'));
				Player.on('show', () => Player.userTemplate._handleEvent('show'));
				Player.on('hide', () => Player.userTemplate._handleEvent('hide'));
				Player.on('config:playLinkInnerText', () => Player.userTemplate._handlePlayLinkInnerText());

				document.addEventListener('visibilitychange', () => {
					if (document.hidden) {
						if (!Player.container) return;
						Player.userTemplate._closeMenus();
					}
				});
			},

			// Build a user template.
			build: function(data) {
				const outerClass = data.outerClass || '';
				let name = (data.template === Player.config.headerTemplate)
								? (data.sound && data.sound.post || data.defaultName)
								: (data.sound && data.sound.title || data.defaultName);
				if(data.template === Player.config.headerTemplate) {
					if(window.mediaStatus === "Loading") name = 'Loading...';
					if(window.mediaStatus === "Error") name = 'error';
				}
				const postID = data.sound && data.sound.post || data.defaultName;

				// Apply common template replacements
				let html = data.template
					.replace(nsRE, window.ns)
					.replace(playingRE, Player.playing && Player.playing === data.sound ? '$1' : '')
					.replace(hoverRE, `<span class="${ns}-hover-display ${outerClass}">$1</span>`)
					.replace(buttonRE, function(full, type, text) {
						let buttonConf = buttons.find(conf => conf.tplName === type);
						if (buttonConf.requireSound && !data.sound || buttonConf.showIf && !buttonConf.showIf(data)) {
							return '';
						}
						// If the button config has sub values then extend the base config with the selected sub value.
						// Which value is to use is taken from the `property` in the base config of the player config.
						// This gives us different state displays.
						if (buttonConf.values) {
							buttonConf = {
								...buttonConf,
								...buttonConf.values[_get(Player.config, buttonConf.property)] || buttonConf.values[Object.keys(buttonConf.values)[0]]
							};
						}
						const attrs = typeof buttonConf.attrs === 'function' ? buttonConf.attrs(data) : buttonConf.attrs || [];
						attrs.some(attr => attr.startsWith('href')) /*|| attrs.push('href=javascript:;')*/;
						(buttonConf.class || outerClass) && attrs.push(`class="${buttonConf.class || ''} ${outerClass || ''}"`);

						if (!text) {
							const icon = typeof buttonConf.icon === 'function' ? buttonConf.icon(data) : buttonConf.icon || null;
							text = icon ?
								`<svg xmlns="http://www.w3.org/2000/svg" ${icon}></svg>`+buttonConf.text :
								buttonConf.text;
						}

						if (/-icon$/.test(full)) return `<div ${attrs.join(' ')}>${text}</div>`;
						return `<a ${attrs.join(' ')} draggable="false">${text}</a>`;
					})
					.replace(soundNameRE, name ? `<div class="${window.ns}-col ${window.ns}-truncate-text"><span class="${window.ns}-truncate-text" title="${postID}">${name}</span></div>` : '')
					.replace(soundIndexRE, data.sound ? Player.sounds.indexOf(data.sound) + 1 : 0)
					.replace(soundCountRE, Player.sounds.length)
					.replace(soundIdRE, data.sound ? data.sound.id : 'undefined')
					.replace(soundPostRE, data.sound ? data.sound.post : 'undefined')
					.replace(soundFilenameRE, data.sound ? data.sound.filename.replace(/\.[^/.]+$/, "") : 'undefined')
					.replace(soundFilesizeRE, data.sound ? data.sound.fileSize : 'undefined')
					.replace(soundExtensionRE, data.sound ? data.sound.extension : 'undefined')
					.replace(soundThumbnailRE, data.sound ? data.sound.thumb : 'undefined')
					.replace(/%v/g, "2.3.0");

				// Apply any specific replacements
				if (data.replacements) {
					for (let k of Object.keys(data.replacements)) {
						html = html.replace(new RegExp(k, 'g'), data.replacements[k]);
					}
				}

				return html;
			},

			// Sets up a components to render when the template or values within it are changed.
			maintain: function(component, property, alwaysRenderConfigs = [], alwaysRenderEvents = []) {
				componentDeps.push({
					component,
					property,
					...Player.userTemplate.findDependencies(property, null),
					alwaysRenderConfigs,
					alwaysRenderEvents
				});
			},

			// Find all the config dependent values in a template.
			findDependencies: function(property, template) {
				template || (template = _get(Player.config, property));
				// Figure out what events should trigger a render.
				const events = [];

				// add/remove should render templates showing the count.
				// playsound should render templates showing the playing sounds name/index or dependent on something playing.
				// order should render templates showing a sounds index.
				const hasCount = soundCountRE.test(template);
				const hasName = soundNameRE.test(template);
				const hasIndex = soundIndexRE.test(template);
				const hasPlaying = playingRE.test(template);
				hasCount && events.push('add', 'remove');
				(hasPlaying || property !== 'rowTemplate' || property !== 'galleryItemTemplate' && (hasName || hasIndex)) && events.push('playsound');
				hasIndex && events.push('order');

				// Find which buttons the template includes that are dependent on config values.
				const config = [];
				let match;
				while ((match = buttonRE.exec(template)) !== null) {
					// If user text is given then the display doesn't change.
					if (!match[2]) {
						let type = match[1];
						let buttonConf = buttons.find(conf => conf.tplName === type);
						if (buttonConf.property) {
							config.push(buttonConf.property);
						}
					}
				}

				return {
					events,
					config
				};
			},

			// When a config value is changed check if any component dependencies are affected.
			_handleConfig: function(property, value) {
				// Check if a template for a components was updated.
				componentDeps.forEach(depInfo => {
					if (depInfo.property === property) {
						Object.assign(depInfo, Player.userTemplate.findDependencies(property, value));
						depInfo.component.render();
					}
				});
				// Check if any components are dependent on the updated property.
				componentDeps.forEach(depInfo => {
					if (depInfo.alwaysRenderConfigs.includes(property) || depInfo.config.includes(property)) {
						depInfo.component.render();
					}
				});
			},

			// When a player event is triggered check if any component dependencies are affected.
			_handleEvent: function(type) {
				// Check if any components are dependent on the updated property.
				componentDeps.forEach(depInfo => {
					if (depInfo.alwaysRenderEvents.includes(type) || depInfo.events.includes(type)) {
						depInfo.component.render();
					}
				});
			},

			// Add local files.
			_handleFileSelect: function(e) {
				e.preventDefault();
				const input = e.eventTarget;
				Player.playlist.addFromFiles(input.files);
			},

			// Toggle the repeat style.
			_handleRepeat: function(e) {
				try {
					e.preventDefault();
					const values = ['all', 'one', 'none'];
					const current = values.indexOf(Player.config.repeat);
					Player.set('repeat', values[(current + 4) % 3]);
				} catch (err) {
					Player.logError('There was an error changing the repeat setting. Please check the console for details.', 'warning');
					console.error('[8chan sounds player]', err);
				}
			},

			// Toggle the shuffle style.
			_handleShuffle: function(e) {
				try {
					e.preventDefault();
					Player.set('shuffle', !Player.config.shuffle);
					Player.header.render();

					// Update the play order
					if (!Player.config.shuffle) {
						// Restore original order - separate local files and post files
						Player.sounds.sort((a, b) => {
							// Local files come after post files
							if (a.id.startsWith('locF:') && !b.id.startsWith('locF:')) return 1;
							if (!a.id.startsWith('locF:') && b.id.startsWith('locF:')) return -1;
							// Both are same type - compare appropriately
							return a.id.startsWith('locF:')
								? parseInt(a.id.split(':')[1]) - parseInt(b.id.split(':')[1]) // Compare local file numbers
							: Player.compareIds(a.id, b.id); // Compare post IDs
						});
					} else {
						// Shuffle the array (Fisher-Yates algorithm)
						const sounds = Player.sounds;
						for (let i = sounds.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[sounds[i], sounds[j]] = [sounds[j], sounds[i]];
						}
					}

					// Rebuild views while preserving playing state and scroll positions
					const rebuildView = (container, templateFn) => {
						const scrollPos = container.scrollTop;
						const playingId = Player.playing?.id;

						container.innerHTML = templateFn({ sounds: Player.sounds });

						// Restore playing state if needed
						if (playingId) {
							const playingEl = container.querySelector(`[data-id="${playingId}"]`);
							if (playingEl) playingEl.classList.add('playing');
						}

						container.scrollTop = scrollPos;
					};

					rebuildView(Player.$(`.${ns}-list-container`), Player.templates.list);
					rebuildView(Player.$(`.${ns}-gallery-container`), Player.templates.galleryList);

					// Reattach event listeners
					Player.events.addUndelegatedListeners(document.body, Player.playlist.undelegatedEvents);

					Player.trigger('order');
					Player.playlist.showOnlySoundposts();
					Player.playlist.updateStripes();
					Player.playlist.scrollToPlaying();
				} catch (err) {
					Player.logError('There was an error changing the shuffle setting. Please check the console for details.', 'warning');
					console.error('[8chan sounds player]', err);
				}
			},

			// Display an item menu.
			_handleMenu: function(e) {
				e.preventDefault();
				e.stopPropagation();
				Player.userTemplate._closeMenus();
				const x = e.clientX;
				const y = e.clientY;
				const id = e.eventTarget.getAttribute('data-id');
				const sound = Player.sounds.find(s => s.id === id);

				// Add row item menus to the list container. Append to the container otherwise.
				const listContainer = Player.config.viewStyle === 'gallery' ? e.eventTarget.closest(`.${ns}-gallery-container`) : e.eventTarget.closest(`.${ns}-list-container`);
				const parent = listContainer || Player.container;

				// Create the menu.
				const dialog = createElement(Player.templates.itemMenu({
					x,
					y,
					sound
				}), parent);

				parent.appendChild(dialog);

				// Make sure it's within the page.
				const style = document.defaultView.getComputedStyle(dialog);
				const width = parseInt(style.width, 10);
				const height = parseInt(style.height, 10);
				// Show the dialog to the left of the cursor, if there's room.
				if (x - width > 0) {
					dialog.style.left = x - width + 'px';
				}
				// Move the dialog above the cursor if it's off screen.
				if (y + height > document.documentElement.clientHeight - 40) {
					dialog.style.top = y - height + 'px';
				}
				// Add the focused class handler
				dialog.querySelectorAll('.entry').forEach(el => {
					el.addEventListener('mouseenter', Player.userTemplate._setFocusedMenuItem);
					el.addEventListener('mouseleave', Player.userTemplate._unsetFocusedMenuItem);
				});

				Player.trigger('menu-open', dialog);
			},

			_handleDropdownMenu: function(e) {
				e.preventDefault();
				e.stopPropagation();
				Player.userTemplate._closeMenus();
				const x = e.clientX;
				const y = e.clientY;
				const sound = Player.sounds[0];

				const parent = Player.container;

				const template = /*Player.sounds.map(sound => */`
										<div class="${ns}-item-menu dialog" id="menu" tabindex="0" data-type="post" style="position: fixed; top: ${y}px; left: ${x}px;">
											<a title="View mode: Playlist" data-view="playlist" class="entry ${ns}-ui-button ${ns}-viewStylePlaylist-button ${ns}-row" draggable="false"><svg xmlns="http://www.w3.org/2000/svg" width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-playlist"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M17 17v-13h4"></path><path d="M13 5h-10"></path><path d="M3 9l10 0"></path><path d="M9 13h-6"></path>&gt;</svg>&nbsp;Playlist</a>
											<a title="View mode: Gallery" data-view="gallery" class="entry ${ns}-ui-button ${ns}-viewStyleGallery-button ${ns}-row" draggable="false"><svg xmlns="http://www.w3.org/2000/svg" width="17.6px" height="16px" viewBox="1 0 22 23" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-library-photo"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"></path><path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1"></path><path d="M17 7h.01"></path><path d="M7 13l3.644 -3.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644"></path><path d="M15 12l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l2.644 2.644"></path>&gt;</svg>&nbsp;Gallery</a>
											<a title="View mode: Image" data-view="image" class="entry ${ns}-ui-button ${ns}-viewStyleImage-button ${ns}-row" draggable="false"><svg xmlns="http://www.w3.org/2000/svg" width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-playlist-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 14a3 3 0 1 0 3 3"></path><path d="M17 13v-9h4"></path><path d="M13 5h-4m-4 0h-2"></path><path d="M3 9h6"></path><path d="M9 13h-6"></path><path d="M3 3l18 18"></path>&gt;</svg>&nbsp;Image</a>

											<a title="Refresh the playlist" class="entry ${ns}-ui-button ${ns}-refresh-button ${ns}-row" draggable="false"><svg xmlns="http://www.w3.org/2000/svg" width="17.6px" height="16px" viewBox="2 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>&gt;</svg>&nbsp;Refresh</a>
											<a title="Reload the playlist" class="entry ${ns}-ui-button ${ns}-reload-button ${ns}-row" draggable="false"><svg xmlns="http://www.w3.org/2000/svg" width="17.6px" height="16px" viewBox="2 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-reload"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"></path><path d="M20 4v5h-5"></path>&gt;</svg>&nbsp;Reload</a>
											<a title="Threads" class="entry ${ns}-ui-button ${ns}-threads-button ${ns}-row" draggable="false"><svg xmlns="http://www.w3.org/2000/svg" width="17.6px" height="16px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path>&gt;</svg>&nbsp;Threads</a>
										</div>`/*).join('')*/;

				// Create the menu.
				const dialog = createElement(template, parent);

				parent.appendChild(dialog);

				// Make sure it's within the page.
				const style = document.defaultView.getComputedStyle(dialog);
				const width = parseInt(style.width, 10);
				const height = parseInt(style.height, 10);
				// Show the dialog to the left of the cursor, if there's room.
				if (x - width > 0) {
					dialog.style.left = x - width + 'px';
				}
				// Move the dialog above the cursor if it's off screen.
				if (y + height > document.documentElement.clientHeight - 40) {
					dialog.style.top = y - height + 'px';
				}
				// Add the focused class handler
				dialog.querySelectorAll('.entry').forEach(el => {
					el.addEventListener('mouseenter', Player.userTemplate._setFocusedMenuItem);
					el.addEventListener('mouseleave', Player.userTemplate._unsetFocusedMenuItem);
				});

				Player.trigger('menu-open', dialog);
			},

			// Close any open menus, except for one belonging to an item that was clicked.
			_closeMenus: function() {
				document.querySelectorAll(`.${ns}-item-menu`).forEach(menu => {
					menu.parentNode.removeChild(menu);
					Player.trigger('menu-close', menu);
				});
			},

			_setFocusedMenuItem: function(e) {
				e.currentTarget.classList.add('focused');
				const submenu = e.currentTarget.querySelector('.submenu');
				// Move the menu to the other side if there isn't room.
				if (submenu && submenu.getBoundingClientRect().right > document.documentElement.clientWidth) {
					submenu.style.inset = '0px auto auto -100%';
				}
			},

			_unsetFocusedMenuItem: function(e) {
				e.currentTarget.classList.remove('focused');
			},

			_handleFilter: function(e) {
				e.preventDefault();
				let filter = e.eventTarget.getAttribute('data-filter');
				if (filter) {
					Player.set('filters', Player.config.filters.concat(filter));
				}
			},

			_handleDownload: function(e) {
				//const id = e.eventTarget.getAttribute('data-id');
				const title = e.eventTarget.getAttribute('title');
				const src = e.eventTarget.getAttribute('data-src');
				const urlSrcFilename = new URL(src).pathname.split('/').pop();
				let name = e.eventTarget.getAttribute('data-name') || urlSrcFilename;

				if(title.match(soundRE)) {
					name = name + ' ' + urlSrcFilename;
				}

				GM.xmlHttpRequest({
					method: 'GET',
					url: src,
					responseType: 'blob',
					onload: response => {
						const a = createElement(`<a href="${URL.createObjectURL(response.response)}" download="${name}" rel="noopener" target="_blank"></a>`);
						a.click();
						URL.revokeObjectURL(a.href);
					},
					onerror: () => Player.logError('There was an error downloading.', 'warning')
				});
			},

			_handleRemove: function(e) {
				const id = e.eventTarget.getAttribute('data-id');
				const sound = id && Player.sounds.find(sound => sound.id === '' + id);
				sound && Player.remove(sound);
			},

			_handleReload: function(e) {
				const id = e.eventTarget.getAttribute('data-id');
				const sound = id && Player.sounds.find(sound => sound.id === '' + id);
				Player.playing = undefined;
				sound && Player.controls.play(sound);
			},

			codecsInfoClose: function(e) {
				const codecsInfo = document.querySelector(`#${ns}-codecs-info`);
				codecsInfo.style.display = 'none';
			},

			// Handle soundpost-only toggle and update button appearance
			_handleSoundpostToggle: function(e) {
				e.preventDefault();

				window.showSoundPostsOnly = !window.showSoundPostsOnly;

				// Update the button appearance based on current state
				/// Module 17 Template System > delegatedEvents > delegatedEvents > [`.${ns}-ui-button`]

				// Apply the filter
				Player.playlist.showOnlySoundposts();
			},

			_handlePlayLinkInnerText: function() {
				const existingLinks = document.querySelectorAll(`.${ns}-play-link`);
				if (existingLinks.length > 0) {
					existingLinks.forEach(link => {
						const text = Player.config.playLinkInnerText || '【▶】';
						link.innerHTML = text;
					});
					return;
				}
			},
		};
	}),
	/* 18 - Button Definitions
		•	All control buttons:
			o	Icons
			o	Behavior flags
			o	State variants
		•	Organized by function (playback, navigation, etc.)
	*/
	(function(module, exports) {

		module.exports = [{
				property: 'repeat',
				tplName: 'repeat',
				class: `${ns}-ui-button ${ns}-repeat-button`,
				values: {
					all: {
					attrs: ['title="Repeat All"'],
					text: '',
					icon: 'width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-repeat"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" />'
					},
					one: {
					attrs: ['title="Repeat One"'],
					text: '',
					icon: 'width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-repeat-once"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" /><path d="M11 11l1 -1v4" />'
					},
					none: {
					attrs: ['title="No Repeat"'],
					text: '',
					icon: 'width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-repeat-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12v-3c0 -1.336 .873 -2.468 2.08 -2.856m3.92 -.144h10m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -.133 .886m-1.99 1.984a3 3 0 0 1 -.877 .13h-13m3 3l-3 -3l3 -3" /><path d="M3 3l18 18" />'
					}
				}
			},
			{
				property: 'shuffle',
				tplName: 'shuffle',
				class: `${ns}-ui-button ${ns}-shuffle-button`,
				values: {
					true: {
						attrs: ['title="Shuffled"'],
						text: '',
						icon: 'width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-shuffle-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 4l3 3l-3 3" /><path d="M18 20l3 -3l-3 -3" /><path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" /><path d="M3 17h3a5 5 0 0 0 5 -5a5 5 0 0 1 5 -5h5" />',
					},
					false: {
						attrs: ['title="Ordered"'],
						text: '',
						icon: 'width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 17l-18 0" /><path d="M18 4l3 3l-3 3" /><path d="M18 20l3 -3l-3 -3" /><path d="M21 7l-18 0" />',
					}
				}
			},
			{
				property: 'viewStyle',
				tplName: 'view-style',
				class: `${ns}-ui-button ${ns}-viewStyle-button`,
				values: {
					playlist: {
						attrs: data => [
							'title="View mode: Playlist"',
							`data-view="playlist"`,
						],
						text: '',
						icon: 'width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-playlist"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M17 17v-13h4" /><path d="M13 5h-10" /><path d="M3 9l10 0" /><path d="M9 13h-6" />',
					},
					gallery: {
						attrs: data => [
							'title="View mode: Gallery"',
							`data-view="gallery"`,
						],
						text: '',
						icon: 'width="17.6px" height="16px" viewBox="1 0 22 23" fill="none" stroke="currentColor" stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-library-photo"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" /><path d="M17 7h.01" /><path d="M7 13l3.644 -3.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644" /><path d="M15 12l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l2.644 2.644" />',
					},
					image: {
						attrs: data => [
							'title="View mode: Image"',
							`data-view="image"`,
						],
						text: '',
						icon: 'width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-playlist-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 14a3 3 0 1 0 3 3" /><path d="M17 13v-9h4" /><path d="M13 5h-4m-4 0h-2" /><path d="M3 9h6" /><path d="M9 13h-6" /><path d="M3 3l18 18" />',
					}
				}
			},
			{
				tplName: 'viewStylePlaylist',
				tplName: 'view-playlist',
				class: `${ns}-ui-button ${ns}-viewStylePlaylist-button`,
				icon: 'width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-playlist"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M17 17v-13h4" /><path d="M13 5h-10" /><path d="M3 9l10 0" /><path d="M9 13h-6" />',
				text: '',
				attrs: data => [
					'title="View mode: Playlist"',
					`data-view="playlist"`,
				],
			},
			{
				tplName: 'viewStyleGallery',
				tplName: 'view-gallery',
				class: `${ns}-ui-button ${ns}-viewStyleGallery-button`,
				icon: 'width="17.6px" height="16px" viewBox="1 0 22 23" fill="none" stroke="currentColor" stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-library-photo"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" /><path d="M17 7h.01" /><path d="M7 13l3.644 -3.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644" /><path d="M15 12l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l2.644 2.644" />',
				text: '',
				attrs: data => [
					'title="View mode: Gallery"',
					`data-view="gallery"`,
				],
			},
			{
				tplName: 'viewStyleImage',
				tplName: 'view-image',
				class: `${ns}-ui-button ${ns}-viewStyleImage-button`,
				icon: 'width="17.6px" height="16px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-playlist-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 14a3 3 0 1 0 3 3" /><path d="M17 13v-9h4" /><path d="M13 5h-4m-4 0h-2" /><path d="M3 9h6" /><path d="M9 13h-6" /><path d="M3 3l18 18" />',
				text: '',
				attrs: data => [
					'title="View mode: Image"',
					`data-view="image"`,
				],
			},
			{
				property: 'hoverImages',
				tplName: 'hover-images',
				class: `${ns}-ui-button ${ns}-hoverImages-button`,
				values: {
					true: {
						attrs: ['title="Hover Images Enabled"'],
						text: '',
						icon: 'width="17.6px" height="16px" viewBox="1 0 22 23" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-photo-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M11.5 21h-5.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l.5 .5" /><path d="M15 19l2 2l4 -4" />',
					},
					false: {
						attrs: ['title="Hover Images Disabled"'],
						text: '',
						icon: 'width="17.6px" height="16px" viewBox="1 0 22 23" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-photo-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M13 21h-7a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3 3" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0" /><path d="M22 22l-5 -5" /><path d="M17 22l5 -5" />',
					}
				}
			},
			{
				tplName: 'add',
				class: `${ns}-ui-button ${ns}-add-button`,
				icon: 'width="17.6px" height="16px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" />',
				text: '',
				attrs: ['title="Add local files"'],
			},
			{
				tplName: 'reload',
				class: `${ns}-ui-button ${ns}-reload-button`,
				icon: 'width="17.6px" height="16px" viewBox="2 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-reload"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" /><path d="M20 4v5h-5" />',
				text: '',
				attrs: ['title="Reload the playlist"'],
			},
			{
				tplName: 'refresh',
				class: `${ns}-ui-button ${ns}-refresh-button`,
				icon: 'width="17.6px" height="16px" viewBox="2 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />',
				text: '',
				attrs: ['title="Refresh the playlist"'],
			},
			{
				tplName: 'settings',
				class: `${ns}-ui-button ${ns}-config-button`,
				icon: 'width="17.6px" height="16px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />',
				text: '',
				attrs: ['title="Settings"'],
			},
			{
				tplName: 'threads',
				class: `${ns}-ui-button ${ns}-threads-button`,
				icon: 'width="17.6px" height="16px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" />',
				text: '',
				attrs: ['title="Threads"'],
			},
			{
				tplName: 'close',
				class: `${ns}-ui-button ${ns}-close-button`,
				icon: 'width="17.6px" height="16px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" /><path d="M9 9l6 6m0 -6l-6 6" />',
				text: '',
				attrs: ['title="Hide the player"'],
			},
			{
				tplName: 'dropdownMenu',
				class: `${ns}-ui-button ${ns}-dropdown-menu-button`,
				icon: 'width="17.6px" height="16px" viewBox="1 1 22 22"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-square-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 11l-3 3l-3 -3" /><path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />',
				text: '',
				attrs: ['title="Dropdown menu"'],
			},
			{
				tplName: 'playing',
				requireSound: true,
				class: `${ns}-ui-button ${ns}-playing-jump-link`,
				text: 'Playing',
				attrs: ['title="Scroll the playlist currently playing sound."'],
			},
			{
				tplName: 'post',
				class: `${ns}-ui-button ${ns}-post-button`,
				requireSound: true,
				icon: 'width="16px" height="14px" viewBox="1.5 1 22 22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-message"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9h8" /><path d="M8 13h6" /><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />',
				text: '',
				showIf: data => data.sound.post,
				attrs: data => [
					`href=${'#' + (is4chan ? 'p' : '') + data.sound.post}`,
					'title="Jump to the post for the current sound"',
				],
			},
			{
				tplName: 'image',
				class: `${ns}-ui-button ${ns}-image-button`,
				requireSound: true,
				icon: 'width="16px" height="14px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-photo"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M12 21h-6a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3 3" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0" /><path d="M16 22l5 -5" /><path d="M21 21.5v-4.5h-4.5" />',
				text: '',
				attrs: data => [
					`href=${data.sound.image}`,
					'title="Open the image in a new tab"',
					'target="_blank"',
				],
			},
			{
				tplName: 'sound',
				class: `${ns}-ui-button ${ns}-sound-button`,
				requireSound: true,
				href: data => data.sound.src,
				icon: 'width="16px" height="14px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-music"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M9 17v-13h10v9" /><path d="M9 8h10" /><path d="M16 22l5 -5" /><path d="M21 21.5v-4.5h-4.5" />',
				text: '',
				attrs: data => [
					`href=${data.sound.src}`,
					'title="Open the sound in a new tab"',
					'target="blank"',
				],
			},
			{
				tplName: 'dl-image',
				requireSound: true,
				class: `${ns}-ui-button ${ns}-download-link ${ns}-download-image`,
				icon: 'width="16px" height="14px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-photo-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" /><path d="M14 14l1 -1c.653 -.629 1.413 -.815 2.13 -.559" /><path d="M19 16v6" /><path d="M22 19l-3 3l-3 -3" />',
				text: '',
				attrs: data => [
					'title="Download the image with the original filename"',
					`data-id="${data.sound.id}"`,
					`data-src="${data.sound.image}"`,
					`data-name="${data.sound.filename}"`,
				],
			},
			{
				tplName: 'dl-sound',
				requireSound: true,
				class: `${ns}-ui-button ${ns}-download-link ${ns}-download-sound`,
				icon: 'width="16px" height="14px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-music-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M9 17v-13h10v8" /><path d="M9 8h10" /><path d="M19 16v6" /><path d="M22 19l-3 3l-3 -3" />',
				text: '',
				attrs: data => [
					'title="Download the sound"',
					`data-id="${data.sound.id}"`,
					`data-src="${data.sound.src}"`,
					`data-name="${data.sound.filename}"`,
				],
			},
			{
				tplName: 'filter-image',
				requireSound: true,
				class: `${ns}-ui-button ${ns}-ui-button ${ns}-filter-link`,
				icon: 'width="16px" height="14px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-filter"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />',
				text: '',
				showIf: data => data.sound.imageMD5,
				attrs: data => [
					'title="Add the image MD5 to the filters."',
					`data-filter="${data.sound.imageMD5}"`,
				],
			},
			{
				tplName: 'filter-sound',
				requireSound: true,
				class: `${ns}-ui-button ${ns}-filter-link`,
				icon: 'width="16px" height="14px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-filter"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />',
				text: '',
				attrs: data => [
					'title="Add the sound URL to the filters."',
					`data-filter="${data.sound.src.replace(/^(https?:)?\/\//, '')}"`,
				],
			},
			{
				tplName: 'remove',
				requireSound: true,
				class: `${ns}-ui-button ${ns}-remove-link`,
				icon: 'width="16px" height="14px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />',
				text: '',
				attrs: data => [
					'title="Filter the image."',
					`data-id="${data.sound.id}"`,
				],
			},
			{
				tplName: 'menu',
				requireSound: true,
				class: `${ns}-ui-button ${ns}-item-menu-button`,
				icon: '',
				text: '&#8239;▼&#8239;',
				attrs: data => [`data-id=${data.sound.id}`],
			},
			{
				tplName: 'ui-bracketL',
				class: `${ns}-ui-icon ${ns}-ui-bracket ${ns}-ui-bracketL-icon`,
				icon: 'width="7px" height="14px" viewBox="0 4 8 16" fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M 7 20 L 4 12 L 7 4" />',
				text: '',
			},
			{
				tplName: 'ui-bracketR',
				class: `${ns}-ui-icon ${ns}-ui-bracket ${ns}-ui-bracketR-icon`,
				icon: 'width="7px" height="14px" viewBox="0 4 8 16" fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M 1.5 4 L 4.5 12 L 1.5 20" />',
				text: '',
			},
			{
				tplName: 'ui-files',
				class: `${ns}-ui-icon ${ns}-ui-files-icon`,
				icon: 'width="12px" height="14px" viewBox="1 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-files"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 3v4a1 1 0 0 0 1 1h4" /><path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" /><path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />',
				text: '',
				attrs: data => [
					'title="Files"',
				],
			},
			{
				tplName: 'soundpost-only-toggle',
				class: `${ns}-ui-button ${ns}-soundpost-only-toggle-button`,
				icon: () => [
					window.showSoundPostsOnly
					? 'width="16px" height="14px" viewBox="1 1 22 22" fill="currentColor" stroke="currentColor" stroke-width="-0.1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-filled icon-tabler-filter"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 3h-16a1 1 0 0 0 -1 1v2.227l.008 .223a3 3 0 0 0 .772 1.795l4.22 4.641v8.114a1 1 0 0 0 1.316 .949l6 -2l.108 -.043a1 1 0 0 0 .576 -.906v-6.586l4.121 -4.12a3 3 0 0 0 .879 -2.123v-2.171a1 1 0 0 0 -1 -1z" />'
					: 'width="16px" height="14px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-filter"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />'
				],
				text: '',
				attrs: () => [
					window.showSoundPostsOnly
					? 'title="Show only sound posts ENABLED"'
					: 'title="Show only sound posts DISABLED"'
				],
			},
			{
				tplName: 'pip-toggle',
				class: `${ns}-ui-button ${ns}-pip-toggle-button`,
				property: 'pip',
				values: {
					true: {
						attrs: ['title="Picture-in-picture ENABLED"'],
						text: '',
						icon: 'width="16px" height="14px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-picture-in-picture"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" /><path d="M14 14m0 1a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z" />',
					},
					false: {
						attrs: ['title="Picture-in-picture DISABLED"'],
						text: '',
						icon: 'width="16px" height="14px" viewBox="1 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-picture-in-picture-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" /><path d="M14 14m0 1a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z" /><path d="M3 3l18 18" />',
					}
				}
			},
		];
	}),
	/* 19 - Templates
	   Main player structure */
	(function(module, exports) {

		module.exports = (data = {}) => `<div id="${ns}-container" data-view-style="${Player.config.viewStyle}" style="top: 30px; left: 0px; width: 350px; display: none;">
											<div class="${ns}-header ${ns}-row">
												${Player.templates.header(data)}
											</div>
											<div class="${ns}-view-container">
												<div class="${ns}-player ${!Player.config.hoverImages ? `${ns}-hide-hover-image` : ''}" ">
													${Player.templates.player(data)}
												</div>
												<div class="${ns}-settings ${ns}-panel" style="height: 400px">
													${Player.templates.settings(data)}
												</div>
												<div class="${ns}-threads ${ns}-panel" style="height: 400px">
													${Player.templates.threads(data)}
												</div>
											</div>
											<div class="${ns}-footer">
												${Player.templates.footer(data)}
											</div>
											<input class="${ns}-file-input" type="file" style="display: none" accept="image/*,.webm,.mp4" multiple>
										</div>`
	}),
	/* 20 - Templates
	   Control bars */
	(function(module, exports) {

		module.exports = (data = {}) => `<div class="${ns}-col-auto" style="padding: 0 0 0 0.25rem;">
											<div class="${ns}-media-control ${ns}-previous-button" data-hide-id="previous">
												<div class="${ns}-previous-button-display"></div>
											</div>
											<div class="${ns}-media-control ${ns}-play-button" data-hide-id="play">
												<div class="${ns}-play-button-display ${!Player.audio || Player.audio.paused ? `${ns}-play` : ''}"></div>
											</div>
											<div class="${ns}-media-control ${ns}-next-button" data-hide-id="next">
												<div class="${ns}-next-button-display"></div>
											</div>
										</div>
										<div class="${ns}-col" data-hide-id="seek-bar">
											<div class="${ns}-seek-bar ${ns}-progress-bar" style="margin: 0 0.8rem;">
												<div class="${ns}-full-bar">
													<div class="${ns}-loaded-bar"></div>
													<div class="${ns}-current-bar"></div>
												</div>
											</div>
										</div>
										<div class="${ns}-col-auto" data-hide-id="time" style="margin: 0 auto; padding: 0 0.25rem;">
											<span class="${ns}-current-time">0:00</span> <span class="${ns}-duration-slash">/</span> <span class="${ns}-duration" data-hide-id="duration">0:00</span>
										</div>
										<div class="${ns}-col-auto" data-hide-id="volume-bar">
											<div class="${ns}-volume-bar ${ns}-progress-bar" style="margin: 0 0.8rem;">
												<div class="${ns}-full-bar">
													<div class="${ns}-current-bar" style="width: ${Player.audio.volume * 100}%"></div>
												</div>
											</div>
										</div>
										<div class="${ns}-col-auto" data-hide-id="fullscreen" style="margin: 0 auto;">
											<div class="${ns}-media-control ${ns}-fullscreen-button">
												<div class="${ns}-fullscreen-button-display"></div>
											</div>
										</div>
										<div class="${ns}-col-auto" style="padding: 0 0.25rem 0 0;"">
										</div>`
	}),
	/* 21 - Templates
	   CSS */
	(function(module, exports) {

		module.exports = (data = {}) => `

		/*
		 *
		 * CONTROLS CSS
		 *
		 */

		.${ns}-controls {
			align-items: center;
			padding: 0.5rem 0;
			position: relative;
			justify-content: space-between;
			background: ${Player.config.colors.controls_panel};
			border-top: solid ${Player.config.borderWidth} ${Player.config.colors.border};
			border-bottom: solid ${Player.config.borderWidth} ${Player.config.colors.border};
		}
		.${ns}-media-control {
			height: 1.2rem;
			width: 1.5rem;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer
		}
		.${ns}-media-control .${ns}-col-auto {
			padding: 0 0.5rem;
		}
		.${ns}-media-control>div {
			height: 1rem;
			width: .8rem;
			background: ${Player.config.colors.buttons_color};
		}
		.${ns}-media-control:hover>div {
			background: ${Player.config.colors.hover_color};
		}
		.${ns}-play-button-display {
			clip-path: polygon(10% 10%, 10% 90%, 35% 90%, 35% 10%, 65% 10%, 65% 90%, 90% 90%, 90% 10%, 10% 10%)
		}
		.${ns}-play-button-display.${ns}-play {
			clip-path: polygon(0 0, 0 100%, 100% 50%, 0 0)
		}
		.${ns}-previous-button-display,
		.${ns}-next-button-display {
			clip-path: polygon(10% 10%, 10% 90%, 30% 90%, 30% 50%, 90% 90%, 90% 10%, 30% 50%, 30% 10%, 10% 10%)
		}
		.${ns}-next-button-display {
			transform: scale(-1, 1)
		}
		.${ns}-fullscreen-button-display {
			width: 1rem !important;
			clip-path: polygon(0% 35%, 0% 0%, 35% 0%, 35% 15%, 15% 15%, 15% 35%, 0% 35%, 0% 100%, 35% 100%, 35% 85%, 15% 85%, 15% 65%, 0% 65%, 100% 65%, 100% 100%, 65% 100%, 65% 85%, 85% 85%, 85% 15%, 65% 15%, 65% 0%, 100% 0%, 100% 35%, 85% 35%, 85% 65%, 0% 65%)
		}
		.${ns}-controls .${ns}-current-time,
		.${ns}-controls .${ns}-duration,
		.${ns}-controls .${ns}-duration-slash {
			font-size: 14px;
		}
		.${ns}-current-time {
			color: ${Player.config.colors.controls_current_time};
		}
		.${ns}-duration,
		.${ns}-duration-slash {
			color: ${Player.config.colors.controls_duration};
		}
		.${ns}-progress-bar {
			min-width: 3.5rem;
			height: 1.2rem;
			display: flex;
			align-items: center;
		}
		.${ns}-progress-bar .${ns}-full-bar {
			height: .3rem;
			width: 100%;
			background: ${Player.config.colors.progress_bar};
			border-radius: 1rem;
			position: relative
		}
		.${ns}-progress-bar .${ns}-full-bar>div {
			position: absolute;
			top: 0;
			bottom: 0;
			border-radius: 1rem
		}
		.${ns}-progress-bar .${ns}-full-bar .${ns}-loaded-bar {
			background: ${Player.config.colors.progress_bar_loaded};
		}
		.${ns}-progress-bar .${ns}-full-bar .${ns}-current-bar {
			background: ${Player.config.colors.buttons_color};
			display: flex;
			justify-content: flex-end;
			align-items: center
		}
		.${ns}-progress-bar .${ns}-full-bar .${ns}-current-bar:after {
			content: "";
			background: ${Player.config.colors.buttons_color};
			height: .8rem;
			min-width: .8rem;
			border-radius: 1rem;
			box-shadow: rgba(0, 0, 0, .76) 0 0 3px 0
		}
		.${ns}-progress-bar:hover .${ns}-current-bar:after {
			background: ${Player.config.colors.hover_color};
		}
		.${ns}-seek-bar .${ns}-current-bar {
			background: ${Player.config.colors.hover_color};
		}
		.${ns}-volume-bar .${ns}-current-bar {
			background: ${Player.config.colors.controls_current_time};
		}
		.${ns}-chan-x-controls {
			align-items: inherit;
			vertical-align: middle;
		}
		.${ns}-chan-x-controls .${ns}-media-control {
			width: 0.9rem;
			height: auto;
			margin-top: -1px
		}
		.${ns}-chan-x-controls .${ns}-media-control>div {
			height: .7rem;
			width: .6rem
		}

		/*
		 *
		 * FOOTER CSS
		 *
		 */

		.${ns}-footer {
			padding: .15rem .25rem;
			border-top: solid ${Player.config.borderWidth} ${Player.config.colors.border};
			font-size: 13px;
		}
		.${ns}-footer .${ns}-expander {
			position: absolute;
			bottom: 0px;
			right: 0px;
			height: .75rem;
			width: .75rem;
			cursor: se-resize;
			background:linear-gradient(to bottom right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 65%, ${Player.config.colors.buttons_color} 65%, ${Player.config.colors.buttons_color} 100%)
		}
		.${ns}-footer .${ns}-expander:hover {
			background:linear-gradient(to bottom right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 65%, ${Player.config.colors.hover_color} 65%, ${Player.config.colors.hover_color} 100%)
		}
		.${ns}-footer:hover .${ns}-hover-display {
			display: inline-block
		}
		.${ns}-footer .${ns}-footer-right {
			float: right;
			margin-right: 0.25rem;
			display: flex;
			justify-content: center; /* Horizontal center */
			/*align-items: center;*/ /* Vertical center */
			text-align: center; /* Optional: center text inside the box */
		}
		.${ns}-footer .${ns}-footer-left {
			float: left;
			display: flex;
			justify-content: center; /* Horizontal center */
			/*align-items: center;*/ /* Vertical center */
			text-align: center; /* Optional: center text inside the box */
		}
		/*
		 *
		 * HEADER CSS
		 *
		 */

		.${ns}-header {
			cursor: grab;
			text-align: center;
			border-bottom:solid ${Player.config.borderWidth} ${Player.config.colors.border};
			padding: .25rem;
		}
		.${ns}-header:hover .${ns}-hover-display {
			display: flex
		}
		.${ns}-header.${ns}-row .${ns}-col.${ns}-truncate-text {
			display: flex;
			justify-content: center; /* Horizontal center */
			align-items: center; /* Vertical center */
			text-align: center; /* Optional: center text inside the box */
			font-size: calc(${Player.config.fontSize}px);
		}
		/*html.fourchan-x .fa-repeat.fa-repeat-one::after {
			content: "1";
			font-size: .5rem;
			visibility: visible;
			margin-left: -1px
		}*/

		/*
		 *
		 * UI CSS
		 *
		 */

		#${ns}-container .icon {
			width: fit-content !important;
			height: fit-content !important;
			display: initial !important;
			background-size: initial !important;
			position: initial !important;
		}
		.${ns}-ui-button {
			color:${Player.config.colors.buttons_color} !important;
		}
		.${ns}-ui-button:hover {
			color:${Player.config.colors.hover_color} !important;
		}
		.${ns}-ui-icon {
			color:${Player.config.colors.text} !important;
		}
		.${ns}-ui-icon:hover {
			color:${Player.config.colors.text} !important;
		}
		a.disabled {
			pointer-events: none;
			cursor: default;
			opacity: .45;
		}
		#${ns}-container a {
			cursor: pointer !important;
			color:${Player.config.colors.buttons_color} !important;
		}
		#${ns}-container a:hover {
			color:${Player.config.colors.hover_color} !important;
		}
		${!is4chan ? 'a[class*="threads-button"] { pointer-events: none; cursor: default; opacity: .45; }' : '' }

		/*
		 *
		 * SITE NAVIGATION CSS
		 *
		 */

		/*.navOptions8chanSoundsPlayer:before {
			font-family: 'Icons';
			content:'\\e0a1';
		}*/
		#navOptionsSpan a[class*="navOptions8chanSoundsPlayer"] {
			user-select: none;
			/*font-weight: 900;*/
			margin-left: 1px;
			margin-right: 3px;
			vertical-align: sub;
		}
		@media only screen and (max-width: 812px) {
			#navOptionsSpan a[class*="navOptions8chanSoundsPlayer"] {
				margin-left: 0;
				margin-right: 0;
			}
		}
		@media only screen and (max-width: 520px) {
			#navOptionsSpan a[class*="navOptions8chanSoundsPlayer"] {
				display: none;
			}
		}

		/*
		 *
		 * IMAGE CSS
		 *
		 */

		#${ns}-container[data-view-style=${window.ns}-playing] .${ns}-view-container .${ns}-media:not(.${ns}-pip),
		#${ns}-container[data-view-style=playlist] .${ns}-view-container .${ns}-media:not(.${ns}-pip),
		#${ns}-container[data-view-style=gallery] .${ns}-view-container .${ns}-media:not(.${ns}-pip),
		#${ns}-container[data-view-style=image] .${ns}-view-container .${ns}-media:not(.${ns}-pip) {
			text-align: center;
			display: flex;
			justify-items: center;
			justify-content: center;
			position: relative;
			resize: vertical;
			overflow: hidden;
			min-width: 100%;
			max-width: 100%;
			min-height: 15px !important;
		}
		#${ns}-container[data-view-style=fullscreen] .${ns}-view-container .${ns}-media:not(.${ns}-pip) {
			text-align: center;
			display: flex;
			justify-items: center;
			justify-content: center;
			position: relative;
			overflow: hidden;
			min-width: 100%;
			max-width: 100%;
		}
		.${ns}-media.${ns}-pip {
			text-align: right;
			position: fixed !important;
			right: ${Player.config.offsetRightPIP} !important;
			bottom: ${Player.config.offsetBottomPIP} !important;
			left: auto !important;
			top: auto !important;
			z-index: ${Player.config.zIndexPIP};
		}
		.${ns}-media.${ns}-pip:hover {
			filter: drop-shadow(0 0 0.1rem ${Player.config.colors.buttons_color});
		}
		.${ns}-media .${ns}-video {
			display: none
		}
		.${ns}-image,
		.${ns}-video {
			max-width: 100%;
			object-fit: contain
		}
		#${ns}-container[data-view-style=fullscreen] .${ns}-image,
		#${ns}-container[data-view-style=fullscreen] .${ns}-video {
			height: 100% !important;
			width: 100% !important;
			max-height: 100% !important;
			max-width: 100% !important;
		}
		.${ns}-media.${ns}-show-video .${ns}-video {
			display: block
		}
		.${ns}-media.${ns}-show-video .${ns}-image {
			display: none
		}
		.${ns}-media img,
		.${ns}-media video {
			object-fit: contain;
			cursor: pointer;
			/*pointer-events: none;*/
		}
		.${ns}-resize-handle {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 5px;
			height: 5px;
			cursor: se-resize;
		}
		.${ns}-image-link {
			display: none;
			/*display: block;*/
			position: absolute;
			width: 80% !important;
			height: 94% !important;
			opacity: 0;
		}
		.${ns}-media.${ns}-pip .${ns}-image-link {
			display: none;
			/*display: block;*/
			position: absolute;
			width: 100% !important;
			height: 100% !important;
			opacity: 0;
		}

		/*
		 *
		 * LAYOUT CSS
		 *
		 */

		#${ns}-container {
			position: fixed;
			background:${Player.config.colors.background};
			border: solid ${Player.config.borderWidth} ${Player.config.colors.border};
			min-width: 179px;
			width: 375px;
			color:${Player.config.colors.text};
			scrollbar-color: ${Player.config.colors.controls_panel} ${Player.config.colors.background};
			line-height: normal !important;
		}
		.${ns}-panel {
			padding: 0 .25rem;
			height: 100%;
			width: calc(100% - .5rem);
			overflow: auto
		}
		.${ns}-heading {
			font-weight: 600;
			margin: .5rem 0;
			min-width: 100%
		}
		.${ns}-has-description {
			cursor: help
		}
		.${ns}-heading-action {
			font-weight: normal;
			text-decoration: underline;
			margin-left: .25rem
		}
		.${ns}-row {
			display: flex;
			flex-wrap: wrap;
			min-width: 100%;
			box-sizing: border-box
		}
		.${ns}-col-auto {
			flex: 0 0 auto;
			width: auto;
			max-width: 100%;
			display: inline-flex
		}
		.${ns}-col {
			flex-basis: 0;
			flex-grow: 1;
			max-width: 100%;
			width: 100%
		}
		/*html.fourchan-x #${ns}-container .icon {
			font-size: 0;
			visibility: hidden;
			margin: 0 .15rem
		}*/
		.${ns}-truncate-text {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden
		}
		.${ns}-hover-display {
			display: flex;
			float: right;
			opacity: 0
		}
		.${ns}-hover-display:hover {
			opacity: 1
		}
		.${ns}-hover-display a {
			text-decoration: none;
		}

		/*
		 *
		 * LIST CSS
		 *
		 */

		.${ns}-player .${ns}-hover-image {
			position: fixed;
			max-height: 125px;
			max-width: 125px
		}
		.${ns}-player.${ns}-hide-hover-image .${ns}-hover-image {
			display: none !important
		}
		.${ns}-list-container {
			overflow-y: auto;
			font-size: calc(${Player.config.fontSize}px)
		}
		.${ns}-list-container .${ns}-col {
			display: flex;
		}
		.${ns}-list-container .${ns}-col-auto {
			flex-shrink: 0;
		}
		.${ns}-col > span:not(.${ns}-truncate-text):not(.${ns}-col-auto) {
			flex-shrink: 0;
		}
		.${ns}-list-container .${ns}-truncate-text {
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			min-width: 0; /* Important for flex truncation */
		}
		.${ns}-list-container .${ns}-list-item {
			list-style-type: none;
			padding: .15rem .25rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			cursor: pointer;
			overflow: hidden;
			height: calc(${Player.config.fontSize * 0.1}rem);
			font-size: calc(${Player.config.fontSize}px)
		}
		.${ns}-list-container .${ns}-list-item.playing {
			background: ${Player.config.colors.playing} !important;
			color: ${Player.config.colors.text_playing} !important
		}
		.${ns}-list-container .${ns}-list-item.odd {
			background: ${Player.config.colors.odd_row};
		}
		.${ns}-list-container .${ns}-list-item.even {
			background: ${Player.config.colors.even_row};
		}
		.${ns}-list-container .${ns}-list-item .${ns}-item-menu-button {
			right: .25rem
		}
		.${ns}-list-container .${ns}-list-item:hover .${ns}-hover-display {
			display: flex;
			opacity: 1;
		}
		.${ns}-list-container .${ns}-list-item.${ns}-dragging {
			background: ${Player.config.colors.dragging} !important;
			color: ${Player.config.colors.text_playing} !important
		}
		html:not(.fourchan-x) .dialog {
			background:${Player.config.colors.background};
			background:${Player.config.colors.background};
			border-color:${Player.config.colors.border};
			border-radius: 3px;
			box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
			border-radius: 3px;
			padding-top: 1px;
			padding-bottom: 3px
		}
		html:not(.fourchan-x) .${ns}-item-menu .entry {
			position: relative;
			display: block;
			padding: .125rem .5rem;
			min-width: 70px;
			white-space: nowrap
		}
		html:not(.fourchan-x) .${ns}-item-menu .has-submenu::after {
			content: "";
			border-left: .5em solid;
			border-top: .3em solid transparent;
			border-bottom: .3em solid transparent;
			display: inline-block;
			margin: .35em;
			position: absolute;
			right: 3px
		}
		html:not(.fourchan-x) .${ns}-item-menu .submenu {
			position: absolute;
			display: none
		}
		html:not(.fourchan-x) .${ns}-item-menu .focused>.submenu {
			display: block
		}
		.${ns}-list-container .${ns}-list-item .${ns}-col.${ns}-truncate-text {
			background: transparent !important
		}
		.${ns}-list-container .${ns}-list-item .${ns}-col.${ns}-truncate-text span {
			background: transparent !important
		}
		.${ns}-playlist-file-ext {
			display: inline-block;
			min-width: calc(${Player.config.fontSize * 4}px);
			text-align: left;
			background: transparent !important;
		}
		.${ns}-list-item.${ns}-dragging {
			opacity: 1;
		}

		/*
		 *
		 * SETTINGS CSS
		 *
		 */

		.${ns}-settings textarea {
			font-size: 80%;
			border: solid ${Player.config.borderWidth} ${Player.config.colors.border};
			min-width: 100%;
			min-height: 4rem;
			box-sizing: border-box;
			white-space: pre
		}
		.${ns}-settings .${ns}-sub-settings .${ns}-col {
			min-height: 1.55rem;
			display: flex;
			align-items: center;
			align-content: center;
			white-space: nowrap
		}
		.${ns}-settings .${ns}-heading-action {
			font-size: 12px;
		}
		.${ns}-settings .${ns}-col {
			font-size: 16px;
		}
		.${ns}-settings .${ns}-col select {
			font-size: 12px;
		}
		.${ns}-settings .${ns}-heading {
			font-size: 19px;
		}
		.${ns}-settings .${ns}-heading::before {
			content: "";
			display: block;
			border-top: solid ${Player.config.borderWidth};
			opacity: 0.2;
			margin-bottom: 0.7em;
			width: 100%;
		}
		.${ns}-settings .${ns}-heading::before {
			content: "";
			display: block;
			border-top: solid ${Player.config.borderWidth};
			opacity: 0.2;
			margin-bottom: 0.7em;
			width: 100%;
		}
		/*.${ns}-settings input, .${ns}-settings select, .${ns}-settings textarea {
			background:${Player.config.colors.background};
			border-color:${Player.config.colors.border};
			color:${Player.config.colors.text};
			font-size: calc(${Player.config.fontSize}px);
			font-family: arial, helvetica, sans-serif;
		}*/
		#${ns}-codecs-info {
			background: rgba(255,216,0,0.3);
			border-style: solid;
			border-color: rgba(255, 255, 0, 0.9);
			border-width: 3px 0 3px 0;
			text-align: left;
			font-size: 10px;
			font-weight: 600;
			margin: .5rem 0;
			position: relative;
			padding: 6px 24px 6px 8px;
			max-height: 160px;
			overflow-y: auto;
			scrollbar-color: rgba(255, 255, 0, 0.7) rgba(190, 170, 70, 0.6);
		}
		#${ns}-codecs-info a {
			text-decoration: underline;
		}
		#${ns}-codecs-close-button {
			position: absolute;
			right: 4px;
			top: 4px;
			padding-bottom: 1.75px;
			font-size: 10px;
			color:${Player.config.colors.text};
			background: rgba(255, 255, 0, 0.4);
			border-style: solid;
			border-width: 1px;
			font-weight: bold;
			cursor: pointer;
		}
		#${ns}-codecs-close-button:hover {
			background: rgba(255, 0, 0, 0.4);
			color: black;
			border-color: black;
		}

		/*
		 *
		 * THREADS CSS
		 *
		 */

		.${ns}-threads .${ns}-thread-board-list label {
			display: inline-block;
			width: 4rem
		}
		.${ns}-threads .${ns}-thread-list {
			margin: 1rem -0.25rem 0;
			padding: .5rem 1rem;
			border-top:solid ${Player.config.borderWidth} ${Player.config.colors.border}
		}
		.${ns}-threads .${ns}-thread-list .boardBanner {
			margin: 1rem 0
		}
		.${ns}-threads table {
			margin-top: .5rem;
			border-collapse: collapse
		}
		.${ns}-threads table th {
			border-bottom:solid ${Player.config.borderWidth} ${Player.config.colors.border}
		}
		.${ns}-threads table th,
		.${ns}-threads table td {
			text-align: left;
			padding: .25rem
		}
		.${ns}-threads table tr {
			padding: .25rem 0
		}
		.${ns}-threads table .${ns}-threads-body tr {
			background:${Player.config.colors.even_row}
		}
		.${ns}-threads table .${ns}-threads-body tr:nth-child(2n) {
			background:${Player.config.colors.odd_row}
		}
		.${ns}-threads,
		.${ns}-settings,
		.${ns}-player {
			display: none
		}
		#${ns}-container[data-view-style=settings] .${ns}-settings {
			display: block
		}
		#${ns}-container[data-view-style=threads] .${ns}-threads {
			display: block
		}
		#${ns}-container[data-view-style=image] .${ns}-player,
		#${ns}-container[data-view-style=playlist] .${ns}-player,
		#${ns}-container[data-view-style=gallery] .${ns}-player,
		#${ns}-container[data-view-style=fullscreen] .${ns}-player {
			display: block
		}
		#${ns}-container[data-view-style=image] .${ns}-list-container {
			display: none
		}
		#${ns}-container[data-view-style=image] .${ns}-media {
			height: auto
		}
		#${ns}-container[data-view-style=playlist] .${ns}-media,
		#${ns}-container[data-view-style=gallery] .${ns}-media {
			height: 125px
		}
		#${ns}-container[data-view-style=fullscreen] .${ns}-media {
			height: calc(100% - .4rem) !important
		}
		#${ns}-container[data-view-style=fullscreen] .${ns}-controls {
			position: absolute;
			left: 0;
			right: 0;
			bottom: calc(-2.5rem + .4rem)
		}
		#${ns}-container[data-view-style=fullscreen] .${ns}-controls:hover {
			bottom: 0
		}

		/*
		 *
		 * GALLERY CSS
		 *
		 */

		.${ns}-gallery-container {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
			grid-auto-rows: 80px;
			gap: 8px;
			padding: 0 8px;
			overflow-y: auto;
			box-sizing: border-box;
		}
		.${ns}-gallery-item {
			position: relative;
			margin: 8px 0;
			height: 100%;
			width: 100%;
			min-height: 0;
			min-width: 0;
			box-sizing: border-box;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;
			border: 1.75px solid ${Player.config.colors.border};
			border-radius: 3px;
			overflow: hidden;
			cursor: pointer;
		}
		.${ns}-gallery-item.odd {
			background: ${Player.config.colors.odd_row};
		}
		.${ns}-gallery-item.even {
			background: ${Player.config.colors.odd_row};
		}
		.${ns}-gallery-item .${ns}-item-menu-button {
			;
		}
		.${ns}-gallery-thumb-container .${ns}-hover-display {
			text-align: right;
			position: absolute;
			top: 0;
			right: 0;
			bottom: auto;
			left: auto;
			display: none;
			font-size: 12px;
			background: ${Player.config.colors.odd_row};
			border-bottom: solid 1.75px ${Player.config.colors.border};
			border-left: solid 1.75px ${Player.config.colors.border};
			border-radius: 0 0 0 8px;
		}
		.${ns}-gallery-item.playing .${ns}-gallery-thumb-container .${ns}-hover-display {
			background: ${Player.config.colors.progress_bar_loaded};
			border-bottom: solid 3px ${Player.config.colors.buttons_color};
			border-left: solid 3px ${Player.config.colors.buttons_color};
		}
		.${ns}-gallery-thumb-container:hover .${ns}-hover-display {
			display: block;
			opacity: 1;
		}
		.${ns}-gallery-thumb-container {
			width: 100%;
			height: 100%;
			min-height: 0;
			display: flex;
			flex-direction: column; /* Stack children vertically */
			align-items: center;
			justify-content: space-between; /* Distribute space between top, middle, bottom */
			position: relative;
			box-sizing: border-box;
		}
		.${ns}-gallery-overlay {
			flex: 0 0 auto; /* Don't grow or shrink */
			width: 100%;
			background: rgba(0, 0, 0, 0.65);
			color: white;
			padding: 3px 4px 2px 4px;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			flex-shrink: 0; /* Don't shrink the overlays */
		}
		.${ns}-gallery-thumb {
			object-fit: contain;
			flex: 1 1 auto; /* Grow and shrink as needed */
			min-height: 0; /* Important for flex item shrinking */
			width: auto;
			height: auto;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.${ns}-gallery-item:hover:not(.${ns}-gallery-item.playing) {
			border-color: ${Player.config.colors.buttons_color};
			filter: drop-shadow(0 0 0.1rem ${Player.config.colors.buttons_color});
		}
		.${ns}-gallery-item:hover:not(.${ns}-gallery-item.playing)::before,
		.${ns}-gallery-item:hover:not(.${ns}-gallery-item.playing) .${ns}-gallery-thumb-container::before {
			box-shadow: inset 0px 0px 15px ${Player.config.colors.buttons_color};
			content: '';
			display: block;
			height: 100%;
			position: absolute;
			top: 0;
			width: 100%;
		}
		.${ns}-gallery-item:hover:not(.${ns}-gallery-item.playing) .${ns}-gallery-thumb-container .${ns}-hover-display {
			border-color: ${Player.config.colors.buttons_color};
			filter: drop-shadow(0 0 0.1rem ${Player.config.colors.buttons_color});
		}
		.${ns}-gallery-item.playing {
			box-sizing: border-box;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;
			background: ${Player.config.colors.progress_bar_loaded} !important;
			border: 3px solid ${Player.config.colors.buttons_color};
			border-radius: 2px;
			filter: drop-shadow(0 0 0.1rem ${Player.config.colors.buttons_color});
		}
		.${ns}-gallery-item.playing .${ns}-gallery-overlay {
			box-sizing: border-box;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;
			padding: 2px 3px 1px 3px;
			background: ${Player.config.colors.buttons_color};
			color: ${Player.config.colors.background};
			border-top: solid 1px ${Player.config.colors.buttons_color};
		}
		.${ns}-gallery-item.playing .${ns}-gallery-thumb-container {
			background: ${Player.config.colors.progress_bar_loaded};
		}
		#${ns}-container[data-view-style=gallery] .${ns}-gallery-container {
			display: grid !important;
		}
		#${ns}-container[data-view-style=gallery] .${ns}-list-container {
			display: none;
		}
		#${ns}-container[data-view-style=${window.ns}-playing] .${ns}-gallery-container,
		#${ns}-container[data-view-style=playlist] .${ns}-gallery-container,
		#${ns}-container[data-view-style=image] .${ns}-gallery-container {
			display: none;
		}
		.${ns}-gallery-item.${ns}-dragging {
			opacity: 0.5;
		}
		.${ns}-gallery-container .${ns}-item-menu {
			font-size: calc(${Player.config.fontSize}px);
		}
		`
	}),

	/* 22 - Templates
	   Footer */
	(function(module, exports) {

		module.exports = (data = {}) => Player.userTemplate.build({
				template: Player.config.footerTemplate,
				sound: Player.playing
			}) +
			`<div class="${ns}-expander"></div>`
	}),
	/* 23 - Templates
	   Header */
	(function(module, exports) {

		module.exports = (data = {}) => Player.userTemplate.build({
			template: Player.config.headerTemplate,
			sound: Player.playing,
			defaultName: '8chan Sounds',
			outerClass: `${ns}-col-auto`
		});
	}),
	/* 24 - Templates
	   Context menus */
	(function(module, exports) {

		module.exports = (data = {}) => `<div class="${ns}-item-menu dialog" id="menu" tabindex="0" data-type="post" style="position: fixed; top: ${data.y}px; left: ${data.x}px;">
											<a class="${ns}-reload-link entry focused" data-id="${data.sound.id}" title="Force re-fetch and play">Reload & Play</a>
											<a class="${ns}-remove-link entry" data-id="${data.sound.id}">Remove</a>
											${data.sound.post ? `<a class="entry" href="#${(is4chan ? 'p' : '') + data.sound.post}">Show Post</a>` : ''}
											<div class="entry has-submenu">
												Open
												<div class="dialog submenu" style="inset: 0px auto auto 100%;">
													<a class="entry" href="${data.sound.image}" target="_blank">Image</a>
													${data.sound.hasSoundUrlInFilename ? `<a class="entry" href="${data.sound.src}" target="_blank">Sound</a>` : ''}
												</div>
											</div>
											<div class="entry has-submenu">
												Download
												<div class="dialog submenu" style="inset: 0px auto auto 100%;">
													<a class="${ns}-download-link entry" title="Download the image with the original filename" data-id="${data.sound.id}" data-src="${data.sound.image}" data-name="${data.sound.filename}">Image</a>
													${data.sound.hasSoundUrlInFilename ? `<a class="${ns}-download-link entry" title="Download the sound" data-id="${data.sound.id}" data-src="${data.sound.src}" data-name="${data.sound.filename}">Sound</a>` : ''}
												</div>
											</div>
											<div class="entry has-submenu">
												Filter
												<div class="dialog submenu" style="inset: 0px auto auto 100%;">
													${data.sound.imageMD5 ? `<a class="${ns}-filter-link entry" data-filter="${data.sound.imageMD5}">Image</a>` : ''}
													${data.sound.hasSoundUrlInFilename ? `<a class="${ns}-filter-link entry" data-filter="${data.sound.src.replace(/^(https?\:)?\/\//, '')}">Sound</a>` : ''}
												</div>
											</div>
										</div>`
	}),
	/* 25 - Templates
	   Playlist items */
	(function(module, exports) {

		module.exports = (data = {}) => (data.sounds || Player.sounds).map(sound =>
			`<div class="${ns}-list-item ${ns}-row ${sound.playing ? 'playing' : ''}" data-id="${sound.id}" draggable="true">
				${Player.userTemplate.build({
					template: Player.config.rowTemplate,
					sound,
					outerClass: `${ns}-col-auto`
				})}
			</div>`
		).join('')
	}),
	/* 26 - Templates
	   Media display */
	(function(module, exports) {

		module.exports = (data = {}) => `<div class="${ns}-media-and-controls">
								<div class="${ns}-media" style="height: 125px;">
									<a class="${ns}-image-link" target="_blank"></a>
									<img class="${ns}-image"></img>
									<video class="${ns}-video"></video>
								</div>
								<div class="${ns}-controls ${ns}-row">
									${Player.templates.controls(data)}
								</div>
								</div>
								<div class="${ns}-list-container" style="height: 200px">
									${Player.templates.list(data)}
								</div>
								<div class="${ns}-gallery-container" style="height: 200px">
									${Player.templates.galleryList(data)}
								</div>
								<img class="${ns}-hover-image" style="display: none">`
	}),
	/* 27 - Templates
	   Settings panel */
	(function(module, exports, __webpack_require__) {

		module.exports = (data = {}) => {
			const settingsConfig = __webpack_require__(1);

			let tpl = `<div style="text-align: right; font-size: 10px; font-weight: 600; margin: .5rem 0; min-width: 100%"><b>Version</b>
							<a href="https://greasyfork.org/en/scripts/533468" target="_blank">${VERSION}</a>
						</div>
						<div id="${ns}-codecs-info">
							<button id="${ns}-codecs-close-button">×</button>
							<b>Some videos WILL NOT PLAY unless the appropriate codecs are installed.</b>
							<br><b>Consider installing them if you haven't already.</b>
							<br>HEVC/h265 codec: <a href="https://apps.microsoft.com/detail/9n4wgh0z6vhq" target="_blank">HEVC Video Extensions from Device Manufacturer</a>
							<br>HEVC/h265 codec: <a href="https://archive.org/download/hevc-video-extensions-arm-64" target="_blank">HEVC Video Extensions</a>
							<br><small>&nbsp;&nbsp;&nbsp;▪&nbsp;&nbsp;There are two different HEVC codecs. I don't know which one is better.</small>
							<br>AV1 codec: <a href="https://apps.microsoft.com/detail/9mvzqvxjbq9v" target="_blank">AV1 Video Extension</a>
							<br>VP8 codec: <a href="https://apps.microsoft.com/detail/9n5tdp8vcmhs" target="_blank">Web Media Extensions</a>
							<br>VP9 codec: <a href="https://apps.microsoft.com/detail/9n4d0msmp0pt" target="_blank">VP9 Video Extensions</a>
							<br>MPEG-2 codec: <a href="https://apps.microsoft.com/detail/9n95q1zzpmh4" target="_blank">MPEG-2 Video Extension</a>
							<br><b>Restart your PC after installing the codecs.</b>
						</div>
						<div class="${ns}-heading">Encode / Decode URL</div>
						<div class="${ns}-row">
							<input type="text" class="${ns}-decoded-input ${ns}-col" placeholder="https://">
							<input type="text" class="${ns}-encoded-input ${ns}-col" placeholder="https%3A%2F%2F">
						</div>
					`;

			settingsConfig.forEach(function addSetting(setting) {
				// Filter settings that aren't flagged to be displayed.
				if (!setting.showInSettings && !(setting.settings || []).find(s => s.showInSettings)) {
					return;
				}
				const desc = setting.description;

				tpl += `
					<div class="${ns}-row ${setting.isSubSetting ? `${ns}-sub-settings` : ''}">
					<div class="${ns}-col ${!setting.isSubSetting ? `${ns}-heading` : ''} ${desc ? `${ns}-has-description` : ''}" ${desc ? `title="${desc.replace(/"/g, '&quot;')}"` : ''}>
						${setting.title}
						${(setting.actions || []).map(action => `<a class="${ns}-heading-action" data-handler="${action.handler}" data-property="${setting.property}">${action.title}</a>`)}
					</div>`;

				if (setting.settings) {
					setting.settings.forEach(subSetting => addSetting({
						...setting,
						actions: null,
						settings: null,
						description: null,
						...subSetting,
						isSubSetting: true
					}));
				} else {

					let value = _get(Player.config, setting.property, setting.default),
						attrs = (setting.attrs || '') + (setting.class ? ` class="${setting.class}"` : '') + ` data-property="${setting.property}"`;

					if (setting.format) {
						value = _get(Player, setting.format)(value);
					}
					let type = typeof value;

					if (setting.split) {
						value = value.join(setting.split);
					} else if (type === 'object') {
						value = JSON.stringify(value, null, 4);
					}

					tpl += `
				<div class="${ns}-col">
				${
					type === 'boolean'
						? `<input type="checkbox" ${attrs} ${value ? 'checked' : ''}></input>`

					: setting.showInSettings === 'textarea' || type === 'object'
						? `<textarea ${attrs}>${value}</textarea>`

					: setting.options
						? `<select ${attrs}>
							${Object.keys(setting.options).map(k => `<option value="${k}" ${value === k ? 'selected' : ''}>
								${setting.options[k]}
							</option>`).join('')}
						</select>`

					: `<input type="text" ${attrs} value="${value}"></input>`
				}
				</div>`;
				}
				tpl += '</div>';
			});

			return tpl;
		}
	}),
	/* 28 - Templates
	   Thread browser */
	(function(module, exports) {

		module.exports = (data = {}) => `<div class="${ns}-heading ${ns}-has-description" title="Search for threads with a sound OP">
	Active Threads
	${!Player.threads.loading ? `- <a class="${ns}-fetch-threads-link ${ns}-heading-action">Update</a>` : ''}
									</div>
									<div style="display: ${Player.threads.loading ? 'block' : 'none'}">Loading</div>
									<div style="display: ${Player.threads.loading ? 'none' : 'block'}">
										<div class="${ns}-heading ${ns}-has-description" title="Only includes threads containing the search.">
											Filter
										</div>
										<input type="text" class="${ns}-threads-filter" value="${Player.threads.filterValue || ''}"></input>
										<div class="${ns}-heading">
											Boards - <a class="${ns}-all-boards-link ${ns}-heading-action">${Player.threads.showAllBoards ? 'Selected Only' : 'Show All'}</a>
										</div>
										<div class="${ns}-thread-board-list">
											${Player.templates.threadBoards(data)}
										</div>
										${
											!Player.threads.hasParser || Player.config.threadsViewStyle === 'table'
											? `<table style="width: 100%">
													<tr>
														<th>Thread</th>
														<th>Subject</th>
														<th>Replies/Images</th>
														<th>Started</th>
														<th>Updated</th>
													<tr>
													<tbody class="${ns}-threads-body"></tbody>
												</table>`
											: `<div class="${ns}-thread-list"></div>`
										}
									</div>`
	}),
	/* 29 - Templates
	   Thread browser */
	(function(module, exports) {

		module.exports = (data = {}) => (Player.threads.boardList || []).map(board => {
			let checked = Player.threads.selectedBoards.includes(board.board);
			return !checked && !Player.threads.showAllBoards ?
				'' :
				`<label>
			<input type="checkbox" value="${board.board}" ${checked ? 'checked' : ''}>
			/${board.board}/
		</label>`
		}).join('')
	}),
	/* 30 - Templates
	   Thread browser */
	(function(module, exports) {

		module.exports = (data = {}) => Object.keys(Player.threads.displayThreads).reduce((rows, board) => {
			return rows.concat(Player.threads.displayThreads[board].map(thread => `
		<tr>
			<td>
				<a class="quotelink" href="//boards.${thread.ws_board ? '4channel' : '4chan'}.org/${thread.board}/thread/${thread.no}#p${thread.no}" target="_blank">
					>>>/${thread.board}/${thread.no}
				</a>
			</td>
			<td>${thread.sub || ''}</td>
			<td>${thread.replies} / ${thread.images}</td>
			<td>${timeAgo(thread.time)}</td>
			<td>${timeAgo(thread.last_modified)}</td>
		</tr>
	`))
		}, []).join('')
	}),
	/* 31 - Templates
	   Gallery playlist items */
	(function(module, exports) {

		module.exports = (data = {}) => (data.sounds || Player.sounds).map(sound =>
			`<div class="${ns}-gallery-item ${Player.playing && Player.playing.id === sound.id ? 'playing' : ''}" data-id="${sound.id}" draggable="true" title="${sound.filename}">
				${Player.userTemplate.build({
					template: Player.config.galleryItemTemplate,
					sound,
					outerClass: `${ns}-col-auto`
				})}
			</div>`
		).join('')

	}),

	// TO DO:
	// add seekBar, volumeBar drag
	// combine UI with module 6
	// fix fc-sounds-current-bar:After MARGIN
	// 8chan implement xmlRequest
	// HANDLE CASE: 8chan expandedImage gets hidden instead of removed, DUE TO THAT inline controls persist

	/* 32 - Inline Player
	   •	Handles inline playback of sounds when images/videos are hovered or expanded
	   •	Features:
		   o	Automatic sound playback on image hover/expand
		   o	Synchronized audio/video playback
		   o	Inline controls for expanded media */
	(function(module, exports, __webpack_require__) {

		const {
			parseFileName
		} = __webpack_require__(0);

		// Site-specific selectors
		const selectors = {
			'4chan': {
				postIdPrefix: 'p',
				posts: '.post',
				expandedImage: isChanX ? '.full-image' : '.expanded-thumb, .expandedWebm',
				hoverImage: isChanX ? '#ihover' : '#image-hover'
			},
			'8chan': {
				postIdPrefix: '',
				posts: '.innerOP, .innerPost',
				/*expandedImage: '.imgLink img.imgExpanded, .imgLink video',*/
				expandedImage: '.imgLink img.imgExpanded, video',
				/*hoverImage: 'body > img[style*="position:fixed"]' // no video on hover on 8chan*/
				hoverImage: 'body > img' // no video on hover on 8chan
			}
		}[is8chan ? '8chan' : '4chan'];

		module.exports = {
			audio: { },
			expandedNodes: [ ],
			idx: 0,

			// Similar but not exactly the audio events in the controls component.
			mediaEvents: {
				ended: evt => {
					const audioId = evt.currentTarget.dataset.id;
					const audio = Player.inline.audio[audioId];
					if (!audio || !audio._inlinePlayer) return;

					const data = audio._inlinePlayer;
					const loopMode = /*Player.config.expandedRepeat*/'one';

					console.log('[Inline Player] Media ended, loop mode:', loopMode);

					if (loopMode === 'one') {
						// For single loop, restart the same track
						data.master.currentTime = 0;
						data.master.play().catch(err => {
							console.error('[Inline Player] Loop playback failed:', err);
						});
						if (data.isVideo) {
							data.video.currentTime = 0;
							data.video.play().catch(err => {
								console.error('[Inline Player] Video loop playback failed:', err);
							});
						}
					} else if (loopMode === 'all' && data.sounds.length > 1) {
						// For playlist loop with multiple tracks, move to next
						Player.inline._movePlaying(audioId, 1);
					}
					// For 'none' mode or single track in 'all' mode, playback stops naturally
				},
				pause: evt => Player.inline.handlePlaybackState(evt.currentTarget.dataset.id),
				play: evt => Player.inline.handlePlaybackState(evt.currentTarget.dataset.id),
				seeked: 'controls.handleMediaEvent',
				waiting: 'controls.handleMediaEvent',
				timeupdate: evt => Player.inline.updateDuration(evt.currentTarget.dataset.id),
				loadedmetadata: evt => Player.inline.updateDuration(evt.currentTarget.dataset.id),
				durationchange: evt => Player.inline.updateDuration(evt.currentTarget.dataset.id),
				volumechange: evt => Player.inline.updateVolumeBar(evt.currentTarget)
			},

			initialize() {
				//console.log('[Inline Player] initialize() called');

				if (!is4chan/* && !is8chan*/) {
					console.log('[8chan sounds player - Inline Player] Not 4chan platform, skipping initialization');
					return;
				}

				Player.inline.observer = new MutationObserver(function (mutations) {
					//console.log('[Inline Player] Mutation observed, count:', mutations.length);
					mutations.forEach(function (mutation) {
						/*console.log('[Inline Player] Processing mutation:', {
							addedNodes: mutation.addedNodes.length,
							removedNodes: mutation.removedNodes.length
						});*/
						mutation.addedNodes.forEach(Player.inline.handleAddedNode);
						mutation.removedNodes.forEach(Player.inline.handleRemovedNode);
					});
				});

				Player.on('config:playExpandedImages', Player.inline._handleConfChange);
				Player.on('config:playHoveredImages', Player.inline._handleConfChange);
				Player.inline._handleConfChange();

				//console.log('[Inline Player] Initialization complete');
			},

			/**
			 * Start/stop observing for hover images when a dependent conf is changed.
			 */
			_handleConfChange() {
				/*console.log('[Inline Player] _handleConfChange() called, config:', {
					playExpandedImages: Player.config.playExpandedImages,
					playHoveredImages: Player.config.playHoveredImages,
					expandedRepeat: Player.config.expandedRepeat
				});*/

				if (Player.config.playExpandedImages || Player.config.playHoveredImages) {
					console.log('[Inline Player] Starting observation');
					Player.inline.start();
				} else {
					console.log('[Inline Player] Stopping observation');
					Player.inline.stop();
				}

				// Update loop settings for active players
				Player.inline.updateLoopSettings();
			},

			/**
			 * Check if an added node is an expanded/hover sound image and play the audio.
			 *
			 * @param {Element} node Added node.
			 */
			async handleAddedNode(node) {
				try {
					/*console.log('[Inline Player] handleAddedNode() called for:', {
						nodeName: node.nodeName,
						className: node.className,
						id: node.id,
						src: node.src
					});*/

					if (node.nodeName !== 'IMG' && node.nodeName !== 'VIDEO') {
						//console.log('[Inline Player] Not IMG or VIDEO, skipping');
						return;
					}

					const isExpandedImage = Player.config.playExpandedImages && node.matches(selectors.expandedImage);
					const isHoverImage = !is8chan && Player.config.playHoveredImages && node.matches(selectors.hoverImage);

					console.log('[Inline Player] Detection results:', {
						isExpandedImage,
						isHoverImage,
						matchesExpanded: node.matches(selectors.expandedImage),
						matchesHover: node.matches(selectors.hoverImage)
					});

					if (isExpandedImage || isHoverImage) {
						console.log('[Inline Player] Found eligible media for inline playback');

						// Add style observer for expanded images when display changes to none
						if (is8chan && isExpandedImage) {
							Player.inline.observeExpandedImageStyle(node);
						}

						const isVideo = node.nodeName === 'VIDEO';
						let id, sounds;
						if(is4chan) {
							try {
								// 4chan X images have the id set. Handy.
								// Otherwise get the parent post, looking up the image link for native hover images, and the id from it.
								if (isChanX) {
									id = node.dataset.fileID.split('.')[1];
									console.log('[Inline Player] 4chan X - got ID from dataset:', id);
								} else {
									const targetNode = isExpandedImage ? node : document.querySelector(`a[href$="${node.src.replace(/^https?:/, '')}"]`);
									console.log('[Inline Player] Native - target node:', targetNode);
									id = targetNode.closest(selectors.posts).id.slice(selectors.postIdPrefix.length);
									console.log('[Inline Player] Native - got ID from post:', id);
								}
							} catch (err) {
								console.error('[Inline Player] Error getting post ID:', err);
								return;
							} finally {
								// Check for sounds added to the player.
								sounds = id && Player.sounds.filter(s => s.post === id && s.hasSoundUrlInFilename) || [];
								console.log('[Inline Player] Found sounds from player:', sounds);
							}
						} else {
							sounds = Player.sounds.filter(s => s.image === node.src && s.hasSoundUrlInFilename);
							if (sounds !== undefined && sounds.length !== 0) {
								try {
									id = sounds[0].post;
								} catch (err) {
									console.error('[Inline Player] Error getting post ID:', err);
									return;
								}
							} else {
								console.log('[Inline Player] No sounds found for post, skipping');
								return;
							}
						}

						//if(!sounds.hasSoundUrlInFilename) return;

						/*if (Player.config.expandedAllowFiltered) {
							const filteredSounds = Player.filteredSounds.filter(s => s.post === id && !s.disallow.host);
							console.log('[Inline Player] Adding filtered sounds:', filteredSounds);
							sounds = sounds.concat(filteredSounds);
						}*/

						if (!sounds.length || sounds.length === 0) {
							console.log('[Inline Player] No sounds found for post, skipping');
							return;
						}

						// Create a new audio element.
						const audio = new Audio();
						const aId = audio.dataset.id = Player.inline.idx++;
						const master = /*isVideo && Player.config.expandedLoopMaster === 'video' ? node :*/ audio;
						Player.inline.audio[aId] = audio;

						// Apply loop settings based on configuration
						const loopMode = /*Player.config.expandedRepeat*/'one';
						if (loopMode === 'one') {
							audio.loop = true;
							if (isVideo) {
								node.loop = true;
							}
						} else {
							audio.loop = false;
							if (isVideo) {
								node.loop = false;
							}
						}

						console.log('[Inline Player] Loop configuration:', {
							loopMode,
							audioLoop: audio.loop,
							videoLoop: isVideo ? node.loop : 'N/A'
						});

						console.log('[Inline Player] Created audio element:', {
							aId,
							master: master.nodeName,
							isVideo
						});

						// Remember this node is playing audio.
						Player.inline.expandedNodes.push(node);

						// Add some data and cross link the nodes.
						node.classList.add(`${ns}-has-inline-audio`);
						node._inlineAudio = audio;
						audio._inlinePlayer = node._inlinePlayer = {
							master,
							video: node,
							isVideo,
							audio,
							sounds,
							index: 0,
							blobUrl: null // Store blob URL for cleanup
						};

						// Link video & audio so they sync.
						if (isVideo) {
							node._linked = audio;
							audio._linked = node;
							console.log('[Inline Player] Linked video and audio for sync');
						}

						// Start from the beginning taking the volume from the main player.
						audio.volume = Player.audio.volume;
						audio.currentTime = 0;

						try {
							// Use BlobXmlHttpRequest for 8chan, direct src for 4chan
							if (is8chan) {
								const response = await Player.controls.BlobXmlHttpRequest(sounds[0].src);
								const blob = response.response;
								const blobUrl = URL.createObjectURL(blob);
								audio.src = blobUrl;
								audio._inlinePlayer.blobUrl = blobUrl; // Store for cleanup
								console.log('[Inline Player] Loaded audio via BlobXmlHttpRequest, blob URL created');
							} else {
								// 4chan can use direct src
								audio.src = sounds[0].src;
								console.log('[Inline Player] Loaded audio via direct src');
							}
						} catch (err) {
							console.error('[Inline Player] Failed to load audio source:', err);
							Player.logError('Failed to load audio source.', err);
							Player.inline._removeForNode(node);
							return;
						}


						console.log('[Inline Player] Audio configured:', {
							src: audio.src,
							volume: audio.volume,
							currentTime: audio.currentTime
						});

						// Load audio source using BlobXmlHttpRequest for 8chan CSP
						console.log('[Inline Player] Loading audio source:', sounds[0].src);

						// Add the sync handlers to which source is master.
						Player.inline.updateSyncListeners(master, 'add');

						// Show the player controls for expanded images/videos.
						const showPlayerControls = isExpandedImage/* && Player.config.expandedControls*/;
						console.log('[Inline Player] Controls configuration:', {
							showPlayerControls,
							isExpandedImage,
							/*expandedControls: Player.config.expandedControls*/
						});

						if (node instanceof HTMLVideoElement) {
							node.muted = true;
						}

						if (isVideo && showPlayerControls) {
							// Remove the default controls, and remove them again when 4chan X tries to add them.
							node.controls = false;
							node.controlsObserver = new MutationObserver(() => {
								console.log('[Inline Player] Controls mutation detected, removing controls');
								node.controls = false;
							});
							node.controlsObserver.observe(node, { attributes: true });
							// Play/pause the audio instead when the video is clicked.
							node.addEventListener('click', () => {
								console.log('[Inline Player] Video clicked, toggling play/pause');
								Player.inline.playPause(aId);
							});
						}

						// Initialize ready states
						//node._inlinePlayer.videoReady = false;
						//node._inlinePlayer.audioReady = false;

						// For videos wait for both to load before playing.
						if (isVideo && (node.readyState < 3 || audio.readyState < 3)) {
							console.log('[Inline Player] Video not ready, waiting for canplaythrough');
							audio.pause();
							node.pause();

							// Set the add controls function so playOnceLoaded can run it when it's ready.
							node._inlinePlayer.pendingControls = showPlayerControls;

							// Initialize load state
							//node._inlinePlayer._loadState = { videoReady: false, audioReady: false };

							// Add listeners to both elements
							node.addEventListener('canplaythrough', Player.inline.playOnceLoaded);
							audio.addEventListener('canplaythrough', Player.inline.playOnceLoaded);

							console.log('[Inline Player] Added canplaythrough listeners to both video and audio');
						} else {
							console.log('[Inline Player] Media ready, starting playback');
							if (showPlayerControls) {
								Player.inline.addControls(node, audio, aId, sounds);
							}
							audio.play().catch(err => {
								console.error('[Inline Player] Audio playback failed:', err);
							});
							if (isVideo) {
								node.play().catch(err => {
									console.error('[Inline Player] Video playback failed:', err);
								});
							}
						}
					}
				} catch (err) {
					console.error('[Inline Player] Failed to play sound:', err);
					Player.logError('Failed to play sound.', err);
				}
			},

			/**
			 * Observe expanded image style changes and remove node when display becomes none
			 * @param {Element} node The expanded image node to observe
			 */
			observeExpandedImageStyle(node) {
				console.log('[Inline Player] Starting style observation for expanded image');

				// Create a MutationObserver to watch for style changes
				const styleObserver = new MutationObserver((mutations) => {
					mutations.forEach((mutation) => {
						if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
							const displayValue = window.getComputedStyle(node).display;
							console.log('[Inline Player] Style changed, display value:', displayValue);

							if (displayValue === 'none') {
								console.log('[Inline Player] Expanded image display changed to none, removing node');
								styleObserver.disconnect();
								Player.inline._removeForNode(node);

								// Also remove the node from DOM if it still exists
								if (node.parentNode) {
									node.parentNode.removeChild(node);
								}
							}
						}
					});
				});

				// Start observing style attribute changes
				styleObserver.observe(node, {
					attributes: true,
					attributeFilter: ['style']
				});

				// Store the observer reference for cleanup
				node._styleObserver = styleObserver;

				console.log('[Inline Player] Style observation started for node');
			},

			/**
			 * Check if a removed node is an expanded/hover sound image and stop the audio.
			 *
			 * @param {Element} node Added node.
			 */
			handleRemovedNode(node) {
				/*console.log('[Inline Player] handleRemovedNode() called for:', {
					nodeName: node.nodeName,
					className: node.className,
					id: node.id
				});*/

				const nodes = [ node ];
				node.querySelectorAll && nodes.push(...node.querySelectorAll(`.${ns}-has-inline-audio`));

				//console.log('[Inline Player] Checking nodes for cleanup:', nodes.length);

				nodes.forEach(node => {
					if (node._inlineAudio) {
						console.log('[Inline Player] Found node with inline audio, cleaning up');
						Player.inline._removeForNode(node);
					}
				});
			},

			_removeForNode(node) {
				console.log('[Inline Player] _removeForNode() cleaning up:', node);

				// Stop style observation
				if (node._styleObserver) {
					node._styleObserver.disconnect();
					delete node._styleObserver;
					console.log('[Inline Player] Style observer disconnected');
				}

				if(!node._inlineAudio) return;

				// Stop polling
				Player.inline.stopPolling(node._inlineAudio?.dataset.id);
				// Stop removing controls.
				node.controlsObserver && node.controlsObserver.disconnect();
				// Stop listening for media events.
				Player.inline.updateSyncListeners(node._inlinePlayer.master, 'remove');
				// Remove controls.
				const controls = node._inlineAudio._inlinePlayer.controls;
				if (controls) {
					console.log('[Inline Player] Removing controls');
					controls.parentNode.classList.remove(`${ns}-has-controls`);
					controls.remove();
				}
				// Stop the audio and cleanup the data.
				node._inlineAudio.pause();
				delete Player.inline.audio[node._inlineAudio.dataset.id];
				delete node._inlineAudio;
				Player.inline.expandedNodes = Player.inline.expandedNodes.filter(n => n !== node);

				console.log('[Inline Player] Cleanup complete, remaining nodes:', Player.inline.expandedNodes.length);
			},

			/**
			 * Set audio/video sync listeners on a video for an inline sound webm.
			 *
			 * @param {Element} video Video node.
			 * @param {String} action add or remove.
			 */
			updateSyncListeners(node, action) {
				console.log('[Inline Player] updateSyncListeners()', {
					nodeName: node.nodeName,
					action
				});

				if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
					const audio = node._inlineAudio || node;
					if (action === 'remove') {
						const video = audio._inlinePlayer.video;
						video.removeEventListener('canplaythrough', Player.inline.playOnceLoaded);
						audio.removeEventListener('canplaythrough', Player.inline.playOnceLoaded);
						console.log('[Inline Player] Removed canplaythrough listeners');
					}
					Object.entries(Player.inline.mediaEvents).forEach(([ event, handler ]) => {
						console.log(`[Inline Player] ${action} event listener:`, event);
						node[`${action}EventListener`](event, Player.events.getHandler(handler));
					});
				}
			},

			/**
			 * Start observing for expanded/hover images.
			 */
			start() {
				//console.log('[Inline Player] start() - starting observation');
				Player.inline.observer.observe(document.body, {
					childList: true,
					subtree: true
				});
			},

			/**
			 * Stop observing for expanded/hover images.
			 */
			stop() {
				//console.log('[Inline Player] stop() - stopping observation and cleaning up', Player.inline.expandedNodes.length, 'nodes');
				Player.inline.observer.disconnect();
				Player.inline.expandedNodes.forEach(Player.inline._removeForNode);
				Player.inline.expandedNodes = [];
			},

			/**
			 * Add controls to expanded media
			 */
			addControls(node, audio, aId, sounds) {
				console.log('[Inline Player] addControls() called');

				try {
					// Remove any existing controls first
					const existingControls = node.parentNode.querySelector(`.${ns}-inline-controls`);
					if (existingControls) {
						existingControls.remove();
						console.log('[Inline Player] Removed existing controls');
					}

					// Create controls container
					const controlsContainer = document.createElement('div');
					controlsContainer.className = `${ns}-inline-controls ${ns}-controls ${ns}-row`;
					controlsContainer.style.cssText = `
						position: absolute;
						bottom: 0;
						left: 0;
						right: 0;
						display: flex;
						opacity: 0;
					`;

					node.addEventListener('mouseenter', () => {
						controlsContainer.style.opacity = '1';
						controlsContainer.style.pointerEvents = 'auto';
					});

					controlsContainer.addEventListener('mouseenter', () => {
						controlsContainer.style.opacity = '1';
						controlsContainer.style.pointerEvents = 'auto';
					});

					node.addEventListener('mouseleave', () => {
						controlsContainer.style.opacity = '0';
						controlsContainer.style.pointerEvents = 'none';
					});

					// Set the template HTML with additional controls
					controlsContainer.innerHTML = `
						<div class="${ns}-col-auto" style="padding: 0 0 0 0.25rem;">
							<div class="${ns}-media-control ${ns}-play-button" data-hide-id="play">
								<div class="${ns}-play-button-display ${ns}-play"></div>
							</div>
						</div>
						<div class="${ns}-col" data-hide-id="seek-bar">
							<div class="${ns}-seek-bar ${ns}-progress-bar" style="margin: 0 0.8rem;">
								<div class="${ns}-full-bar">
									<div class="${ns}-loaded-bar"></div>
									<div class="${ns}-current-bar"></div>
								</div>
							</div>
						</div>
						<div class="${ns}-col-auto" data-hide-id="time" style="margin: 0 auto; padding: 0 0.25rem;">
							<span class="${ns}-current-time">0:00</span> <span class="${ns}-duration-slash">/</span> <span class="${ns}-duration" data-hide-id="duration">0:00</span>
						</div>
						<div class="${ns}-col-auto" data-hide-id="volume-bar">
							<div class="${ns}-volume-bar ${ns}-progress-bar" style="margin: 0 0.8rem;">
								<div class="${ns}-full-bar">
									<div class="${ns}-current-bar"></div>
								</div>
							</div>
						</div>
					`;

					// Add to parent node
					node.parentNode.classList.add(`${ns}-has-controls`);
					node.parentNode.style.position = 'relative';
					node.parentNode.appendChild(controlsContainer);

					console.log('[Inline Player] Controls container added');

					// Store reference to controls and UI elements
					audio._inlinePlayer.controls = controlsContainer;
					audio._inlinePlayer.ui = {
						playButton: controlsContainer.querySelector(`.${ns}-play-button`),
						seekBar: controlsContainer.querySelector(`.${ns}-seek-bar`),
						volumeBar: controlsContainer.querySelector(`.${ns}-volume-bar`),
						currentTime: controlsContainer.querySelector(`.${ns}-current-time`),
						duration: controlsContainer.querySelector(`.${ns}-duration`),
						loadedBar: controlsContainer.querySelector(`.${ns}-seek-bar .${ns}-loaded-bar`),
						currentTimeBar: controlsContainer.querySelector(`.${ns}-seek-bar .${ns}-current-bar`),
						volumeCurrentBar: controlsContainer.querySelector(`.${ns}-volume-bar .${ns}-current-bar`)
					};

					// Set up event listeners for controls
					Player.inline.setupControlEvents(controlsContainer, aId, audio);

					// Initialize UI state
					Player.inline.updateVolumeBar(audio);
					Player.inline.updatePlayButton(audio);

					// Start polling for updates
					Player.inline.startPolling(aId);

					console.log('[Inline Player] Controls setup complete');

				} catch (err) {
					console.error('[Inline Player] Error adding controls:', err);
				}
			},

			/**
			 * Set up event listeners for inline controls
			 */
			setupControlEvents(controls, aId, audio) {
				console.log('[Inline Player] setupControlEvents() called for audio ID:', aId);

				const ui = audio._inlinePlayer.ui;

				// Play/Pause button
				if (ui.playButton) {
					ui.playButton.addEventListener('click', (e) => {
						e.preventDefault();
						e.stopPropagation();
						console.log('[Inline Player] Play button clicked');
						Player.inline.playPause(aId);
					});
				}

				// Seek bar
				if (ui.seekBar) {
					ui.seekBar.addEventListener('click', (e) => {
						e.preventDefault();
						e.stopPropagation();
						console.log('[Inline Player] Seek bar clicked');
						Player.inline.handleSeek(e, aId);
					});
				}

				// Volume bar
				if (ui.volumeBar) {
					ui.volumeBar.addEventListener('click', (e) => {
						e.preventDefault();
						e.stopPropagation();
						console.log('[Inline Player] Volume bar clicked');
						Player.inline.handleVolume(e, aId);
					});
				}

				// Prevent clicks on controls from propagating to parent
				controls.addEventListener('click', (e) => {
					e.preventDefault();
					e.stopPropagation();
				});
			},

			/**
			 * Start polling for updates
			 */
			startPolling(aId) {
				const audio = Player.inline.audio[aId];
				if (!audio) return;

				// Clear any existing poll
				Player.inline.stopPolling(aId);

				// Start new poll
				audio._inlinePlayer.pollInterval = setInterval(() => {
					Player.inline.updateDuration(aId);
					Player.inline.updateLoadedProgress(aId);
				}, 50);

				console.log('[Inline Player] Started polling for updates');
			},

			/**
			 * Stop polling for updates
			 */
			stopPolling(aId) {
				const audio = Player.inline.audio[aId];
				if (audio && audio._inlinePlayer.pollInterval) {
					clearInterval(audio._inlinePlayer.pollInterval);
					delete audio._inlinePlayer.pollInterval;
				}
			},

			/**
			 * Get current playback position from master (audio or video)
			 */
			getCurrentPlaybackPosition(aId) {
				const audio = Player.inline.audio[aId];
				if (!audio || !audio._inlinePlayer) return 0;

				const data = audio._inlinePlayer;
				return data.master.currentTime || 0;
			},

			/**
			 * Sync playback between audio and video
			 */
			async syncPlayback(aId) {
				const audio = Player.inline.audio[aId];
				if (!audio || !audio._inlinePlayer) return;

				const data = audio._inlinePlayer;
				if (data.isVideo) {
					// Ensure audio and video are synchronized
					const timeDiff = Math.abs(data.audio.currentTime - data.video.currentTime);
					if (timeDiff > 0.1) {
						console.log('[Inline Player] Syncing audio and video, time difference:', timeDiff);
						data.video.currentTime = data.audio.currentTime;
					}
				}
			},

			/**
			 * Handle playback state changes for both audio and video
			 */
			handlePlaybackState(aId) {
				const audio = Player.inline.audio[aId];
				if (!audio || !audio._inlinePlayer) return;

				const data = audio._inlinePlayer;
				const isPlaying = !data.master.paused;

				// Ensure audio and video are in sync
				if (data.isVideo && isPlaying) {
					Player.inline.syncPlayback(aId);
				}

				// Update play button
				Player.inline.updatePlayButton(audio);

				// Start/stop polling based on playback state
				if (isPlaying) {
					Player.inline.startPolling(aId);
				} else {
					Player.inline.stopPolling(aId);
				}

				console.log('[Inline Player] Playback state:', {
					isPlaying,
					audioTime: audio.currentTime,
					videoTime: data.isVideo ? data.video.currentTime : 'N/A'
				});
			},

			/**
			 * Update play button state
			 */
			updatePlayButton(audio) {
				if (!audio._inlinePlayer.ui) return;

				const isPlaying = !audio._inlinePlayer.master.paused;
				const playDisplay = audio._inlinePlayer.ui.playButton?.querySelector(`.${ns}-play-button-display`);

				if (playDisplay) {
					playDisplay.classList.toggle(`${ns}-play`, !isPlaying);
					playDisplay.classList.toggle(`${ns}-pause`, isPlaying);
				}
			},

			/**
			 * Update duration display from master element
			 */
			updateDuration(aId) {
				const audio = Player.inline.audio[aId];
				if (!audio || !audio._inlinePlayer || !audio._inlinePlayer.ui) return;

				const data = audio._inlinePlayer;
				const ui = data.ui;
				const currentTime = Player.inline.getCurrentPlaybackPosition(aId);
				let duration = data.master.duration;

				if (!isFinite(duration) && data.isVideo) {
					// Fall back to video duration if master duration is not finite
					duration = data.video.duration;
				}

				if (!isFinite(duration)) {
					// Try to estimate from buffered data
					const mediaElement = data.isVideo ? data.video : data.master;
					if (mediaElement.buffered && mediaElement.buffered.length > 0) {
						duration = mediaElement.buffered.end(mediaElement.buffered.length - 1);
					}
				}

				// Update time displays
				if (ui.currentTime) {
					ui.currentTime.textContent = Player.inline.toDuration(currentTime);
				}
				if (ui.duration && isFinite(duration)) {
					ui.duration.textContent = Player.inline.toDuration(duration);
				}

				// Update progress bar
				Player.inline.updateProgressBarPosition(ui.currentTimeBar, currentTime, duration);
			},

			/**
			 * Update loaded progress bar from both audio and video
			 */
			updateLoadedProgress(aId) {
				const audio = Player.inline.audio[aId];
				if (!audio || !audio._inlinePlayer || !audio._inlinePlayer.ui) return;

				const data = audio._inlinePlayer;
				const ui = data.ui;
				let duration = data.master.duration;

				// Use video buffered data if available, otherwise use audio
				const mediaElement = data.isVideo ? data.video : data.master;

				if (!mediaElement || !mediaElement.buffered || mediaElement.buffered.length === 0) return;

				if (!isFinite(duration)) {
					if (mediaElement.buffered && mediaElement.buffered.length > 0) {
						duration = mediaElement.buffered.end(mediaElement.buffered.length - 1);
					}
				}

				if (!duration || duration === 0) return;

				const length = mediaElement.buffered.length;
				const loadedEnd = mediaElement.buffered.end(length - 1);
				const loadedPercent = (loadedEnd / duration) * 100;

				if (ui.loadedBar) {
					ui.loadedBar.style.width = loadedPercent + '%';
				}
			},

			/**
			 * Update volume bar display
			 */
			updateVolumeBar(audio) {
				if (!audio._inlinePlayer.ui) return;

				const ui = audio._inlinePlayer.ui;
				if (ui.volumeCurrentBar) {
					ui.volumeCurrentBar.style.width = (audio.volume * 100) + '%';
				}
			},

			/**
			 * Update progress bar position
			 */
			updateProgressBarPosition(barElement, current, total) {
				if (!barElement) return;

				current = current || 0;
				total = total || 0;
				const ratio = !total ? 0 : Math.max(0, Math.min(current / total, 1));
				barElement.style.width = (ratio * 100) + '%';
			},

			/**
			 * Convert seconds to duration string (mm:ss)
			 */
			toDuration(seconds) {
				if (!isFinite(seconds)) return '0:00';

				const mins = Math.floor(seconds / 60);
				const secs = Math.floor(seconds % 60);
				return `${mins}:${secs.toString().padStart(2, '0')}`;
			},

			/**
			 * Handle seek bar interaction - seeks both audio and video
			 */
			handleSeek(e, aId) {
				const audio = Player.inline.audio[aId];
				if (!audio || !audio._inlinePlayer) return;

				const data = audio._inlinePlayer;
				const seekBar = e.currentTarget;
				const rect = seekBar.getBoundingClientRect();
				const percent = (e.clientX - rect.left) / rect.width;

				let duration = data.master.duration;
				if (!isFinite(duration)) {
					// Try to estimate from buffered data
					if (data.master.buffered && data.master.buffered.length > 0) {
						duration = data.master.buffered.end(data.master.buffered.length - 1);
					}
				}

				if (!isFinite(duration)) return;

				const seekTime = duration * percent;
				console.log('[Inline Player] Seeking to:', { seekTime, duration, percent });

				// Update both audio and video
				data.master.currentTime = seekTime;
				if (data.isVideo) {
					data.video.currentTime = seekTime;
				}

				// Resume playback
				data.master.play().catch(err => console.error('[Inline Player] Master play after seek failed:', err));
				if (data.isVideo) {
					data.video.play().catch(err => console.error('[Inline Player] Video play after seek failed:', err));
				}

				Player.inline.updateDuration(aId);
			},

			/**
			 * Handle volume bar interaction - controls volume for both audio and video
			 */
			handleVolume(e, aId) {
				const audio = Player.inline.audio[aId];
				if (!audio || !audio._inlinePlayer) return;

				const data = audio._inlinePlayer;
				const volumeBar = e.currentTarget;
				const rect = volumeBar.getBoundingClientRect();
				const percent = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));

				// Update volume for both audio and video
				audio.volume = percent;
				if (data.isVideo) {
					data.video.volume = percent;
				}

				console.log('[Inline Player] Volume set to:', percent);

				// Update UI
				Player.inline.updateVolumeBar(audio);

				// Save volume preference
				Player.set('volumeValue', percent.toString());
			},

			/**
			 * Play once both audio and video are loaded (for canplaythrough event)
			 */
			playOnceLoaded(e) {
				console.log('[Inline Player] playOnceLoaded() called for:', e.target.nodeName);
				const node = e.target;
				console.log('//////////////////////////////////////////////////////////////'+node);

				// Get the inline player data from either the video or audio element
				let data;
				if (node._inlinePlayer) {
					// Called from video element
					data = node._inlinePlayer;
				} else if (node._linked && node._linked._inlinePlayer) {
					// Called from audio element - get data from linked video
					data = node._linked._inlinePlayer;
				} else {
					console.error('[Inline Player] Could not find inline player data');
					return;
				}

				// Remove listener for this specific element
				node.removeEventListener('canplaythrough', Player.inline.playOnceLoaded);

				// Mark which element is ready
				if (node === data.video || (data.isVideo && node === data.audio && data.video === node._linked)) {
					data.videoReady = true;
					console.log('[Inline Player] Video ready');
				}
				if (node === data.audio || (data.isVideo && node === data.video && data.audio === node._linked)) {
					data.audioReady = true;
					console.log('[Inline Player] Audio ready');
				}

				// Check if both are ready (for videos) or just audio is ready (for images)
				const bothReady = data.isVideo ? (data.videoReady && data.audioReady) : data.audioReady;

				if (bothReady) {
					console.log('[Inline Player] All media ready, starting playback');
					Player.inline._startPlaybackAfterLoad(data);
				} else {
					console.log('[Inline Player] Waiting for other media element. Video ready:', data.videoReady, 'Audio ready:', data.audioReady);
				}
			},

			/**
			 * Start playback after all media is loaded
			 */
			_startPlaybackAfterLoad(data) {
				// Clean up any remaining listeners
				if (data.video && !data.videoReady) {
					data.video.removeEventListener('canplaythrough', Player.inline.playOnceLoaded);
				}
				if (data.audio && !data.audioReady) {
					data.audio.removeEventListener('canplaythrough', Player.inline.playOnceLoaded);
				}

				// Add controls if pending
				if (data.pendingControls) {
					Player.inline.addControls(data.video, data.audio, data.audio.dataset.id, data.sounds);
					delete data.pendingControls;
				}

				// Start playback with error handling
				const playPromises = [data.master.play().catch(err => {
					console.error('[Inline Player] Master playback failed after load:', err);
				})];

				if (data.isVideo && data.video !== data.master) {
					playPromises.push(data.video.play().catch(err => {
						console.error('[Inline Player] Video playback failed after load:', err);
					}));
				}

				Promise.all(playPromises).then(() => {
					console.log('[Inline Player] Playback started successfully');
				}).catch(err => {
					console.error('[Inline Player] Playback failed:', err);
				});
			},

			_movePlaying(audioId, dir) {
				console.log('[Inline Player] _movePlaying()', { audioId, dir });
				const audio = Player.inline.audio[audioId];
				const data = audio && audio._inlinePlayer;
				const count = data.sounds.length;
				const repeat = /*Player.config.expandedRepeat*/'one';

				console.log('[Inline Player] Move playing state:', {
					hasData: !!data,
					soundCount: count,
					repeatMode: repeat,
					currentIndex: data.index
				});

				// For single track or no navigation, just handle loop behavior
				if (data && repeat === 'one') {
					// Single track loop - restart current track
					data.master.currentTime = 0;
					data.master.play().catch(err => {
						console.error('[Inline Player] Loop playback failed:', err);
					});
					if (data.isVideo) {
						data.video.currentTime = 0;
						data.video.play().catch(err => {
							console.error('[Inline Player] Video loop playback failed:', err);
						});
					}
				} else if (data && repeat === 'all' && count > 1) {
					// Playlist loop - move to next track (simplified without UI)
					data.index = (data.index + dir + count) % count;
					audio.src = data.sounds[data.index].src;

					console.log('[Inline Player] Changed to sound index:', data.index);

					// For videos wait for both to load before playing.
					if (data.isVideo && (data.video.readyState < 3 || audio.readyState < 3)) {
						console.log('[Inline Player] Video not ready, waiting for load');
						data.master.currentTime = 0;
						data.master.pause();
						data.video.pause();
						data.video.addEventListener('canplaythrough', Player.inline.playOnceLoaded);
						audio.addEventListener('canplaythrough', Player.inline.playOnceLoaded);
					} else {
						console.log('[Inline Player] Starting playback of new sound');
						data.master.currentTime = 0;
						data.master.play().catch(err => {
							console.error('[Inline Player] Playback failed:', err);
						});
					}
				}
				// For 'none' mode, playback will just stop naturally
			},

			/**
			 * Handle play/pause click for inline controls - controls both audio and video
			 */
			playPause(audioId) {
				console.log('[Inline Player] playPause() called for:', audioId);
				const audio = Player.inline.audio[audioId];
				if (!audio || !audio._inlinePlayer) return;

				const data = audio._inlinePlayer;
				console.log('[Inline Player] Playback state:', {
					audioPaused: audio.paused,
					videoPaused: data.isVideo ? data.video.paused : 'N/A',
					masterPaused: data.master.paused
				});

				if (data.master.paused) {
					// Play both audio and video
					Promise.all([
						audio.play().catch(err => console.error('[Inline Player] Audio play failed:', err)),
						data.isVideo ? data.video.play().catch(err => console.error('[Inline Player] Video play failed:', err)) : Promise.resolve()
					]).then(() => {
						console.log('[Inline Player] Playback started successfully');
						Player.inline.handlePlaybackState(audioId);
					});
				} else {
					// Pause both audio and video
					audio.pause();
					if (data.isVideo) {
						data.video.pause();
					}
					Player.inline.handlePlaybackState(audioId);
				}
			},

			/**
			 * Update loop settings for all active inline players
			 */
			updateLoopSettings() {
				const loopMode = /*Player.config.expandedRepeat*/'one';
				console.log('[Inline Player] Updating loop settings to:', loopMode);

				Object.values(Player.inline.audio).forEach(audio => {
					if (audio._inlinePlayer) {
						const data = audio._inlinePlayer;
						const shouldLoop = loopMode === 'one';

						audio.loop = shouldLoop;
						if (data.isVideo) {
							data.video.loop = shouldLoop;
						}

						console.log('[Inline Player] Updated loop for audio:', audio.dataset.id, 'Loop:', shouldLoop);
					}
				});
			},
		};
	}),
]);