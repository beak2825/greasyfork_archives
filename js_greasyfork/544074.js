// ==UserScript==
// @name         MusixMatch Lyrics Grabber
// @namespace    MXMGrabber
// @match        https://www.musixmatch.com/*
// @version      12-3-2025
// @author       Lioncat6
// @description  Tool to grab Synced lyrics from MusixMatch lyrics pages to either download or upload them to LRCLIB
// @resource     toastifyJs https://cdn.jsdelivr.net/npm/toastify-js
// @resource     toastifyCss https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musixmatch.com
// @homepageURL  https://github.com/Lioncat6/Misc-UserScripts
// @supportURL   https://github.com/Lioncat6/Misc-UserScripts/issues
// @license MIT
// @grant        GM_registerMenuCommand
// @grant 	     GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/544074/MusixMatch%20Lyrics%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/544074/MusixMatch%20Lyrics%20Grabber.meta.js
// ==/UserScript==

(function () {
	"use strict";

	function updateMenu() {
		try {
			GM_unregisterMenuCommand("enableMultiThreading");
			GM_unregisterMenuCommand("LRCLIB Upload MultiThreading [ON]");
			GM_unregisterMenuCommand("LRCLIB Upload MultiThreading [OFF]");
			GM_registerMenuCommand(
				"LRCLIB Upload MultiThreading [" + (GM_getValue("enableMultiThreading", false) ? "ON" : "OFF") + "]",
				function () {
					let current = GM_getValue("enableMultiThreading", false);
					GM_setValue("enableMultiThreading", !current);
					updateMenu();
				},
				"enableMultiThreading"
			);
		} catch (error) {
			console.error("Error updating menu commands:", error);
		}
	}
	updateMenu();

	function safeGetSetting(key, defaultValue) {
		try {
			let value = GM_getValue(key, defaultValue);
			if (typeof value === "undefined") {
				console.warn(`Setting "${key}" is undefined, using default value: ${defaultValue}`);
				return defaultValue;
			}
			return value;
		} catch (error) {
			console.error(`Error retrieving setting "${key}":`, error);
			return defaultValue;
		}
	}

	let enableMultiThreading = safeGetSetting("enableMultiThreading", false);

	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";
	document.head.appendChild(link);

	const mxmScript = document.createElement("script");
	mxmScript.src = "https://cdn.jsdelivr.net/npm/toastify-js";
	mxmScript.type = "text/javascript";
	document.head.appendChild(mxmScript);

	let lyricsDict = [];
	let metaDict = [];

	let good = "linear-gradient(to right, #00b09b, #96c93d)";
	let bad = "linear-gradient(to right, #ff416c, #ff4b2b)";
	let waiting = "linear-gradient(to right, #f7971e, #ffd200)";

	function notification(message, isBad = false) {
		Toastify({
			text: message,
			duration: 8000,
			close: true,
			gravity: "top", // `top` or `bottom`
			position: "right", // `left`, `center` or `right`
			stopOnFocus: false, // Prevents dismissing of toast on hover
			style: {
				background: isBad ? bad : good,
				"font-family": "Arial",
			},
		}).showToast();
	}

	function displayPersistentToast(message) {
		return Toastify({
			text: message,
			duration: -1,
			close: true,
			gravity: "top", // `top` or `bottom`
			position: "right", // `left`, `center` or `right`
			stopOnFocus: false, // Prevents dismissing of toast on hover
			style: {
				background: waiting,
				"font-family": "Arial",
			},
		}).showToast();
	}

	function uploadStatus(success = true) {
		Toastify({
			text: success ? "Lyrics submitted successfully." : "Failed to submit lyrics.",
			duration: 3000,
			style: { background: success ? good : bad },
		}).showToast();
		let submitButton = document.getElementById("lrclib-submit-button");
		if (submitButton) {
			let submissionStatus = document.getElementById("lrclib-submission-status");
			if (submissionStatus) {
				submissionStatus.textContent = success ? "✅" : "❌";
			} else {
				submissionStatus = document.createElement("span");
				submissionStatus.id = "lrclib-submission-status";
				submissionStatus.textContent = success ? "✅" : "❌";
				submitButton.parentNode.insertBefore(submissionStatus, submitButton.nextSibling);
			}
			submitButton.background = success ? good : bad;
			submitButton.title = success ? "Successfully submitted lyrics to LRCLIB." : "Failed to submit lyrics to LRCLIB. Check console for error.";
		}
	}

	function uploadFailed() {
		uploadStatus(false);
	}

	function uploadSuccess() {
		uploadStatus(true);
	}

	function showToast() {
		Toastify({
			text: "Click to view lyrics",
			duration: -1,
			close: true,
			gravity: "top", // `top` or `bottom`
			position: "right", // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: good,
				"font-family": "Arial",
			},
			onClick: function () {
				showPopup();
			}, // Callback after click
		}).showToast();
	}

	function instrumentalIcon() {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("fill", "white");
		svg.setAttribute("height", "24");
		svg.setAttribute("viewBox", "0 0 24 24");
		svg.setAttribute("width", "24");
		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute(
			"d",
			"M4.9 11.3v1.4a1.3 1.3 0 1 1-2.6 0v-1.4a1.3 1.3 0 1 1 2.6 0zM7.8 8a1.3 1.3 0 0 0-1.3 1.3v5.4a1.3 1.3 0 1 0 2.6 0V9.3A1.3 1.3 0 0 0 7.8 8zM12 3a1.3 1.3 0 0 0-1.3 1.3v15.4a1.3 1.3 0 1 0 2.6 0V4.3A1.3 1.3 0 0 0 12 3zm4.2 6a1.3 1.3 0 0 0-1.3 1.3v3.4a1.3 1.3 0 1 0 2.6 0v-3.4A1.3 1.3 0 0 0 16.2 9zm4.2 1a1.3 1.3 0 0 0-1.3 1.3v1.4a1.3 1.3 0 1 0 2.6 0v-1.4a1.3 1.3 0 0 0-1.3-1.3z"
		);
		svg.appendChild(path);
		return svg;
	}

	function createLyricsElements(lyrics) {
		lyrics = JSON.parse(lyrics);
		let lyricsContainer = document.createElement("div");
		lyricsContainer.style.display = "flex";
		lyricsContainer.style.flexDirection = "column";
		lyricsContainer.style.maxHeight = "100px";
		lyricsContainer.style.overflowY = "auto";
		lyricsContainer.style.transition = "max-height 0.25s ease";
		lyricsContainer.className = "mxm-lyrics-container";
		if (lyrics) {
			lyrics.forEach((element) => {
				let lineContainer = document.createElement("div");
				lineContainer.style.display = "flex";
				lineContainer.style.flexDirection = "row";
				lineContainer.style.marginBottom = "5px";
				let timeStamp = document.createElement("div");
				timeStamp.style.borderRadius = "10px";
				timeStamp.style.padding = "5px";
				timeStamp.style.marginRight = "10px";
				timeStamp.style.background = "var(--mxm-backgroundSecondary)";
				timeStamp.innerText = `${element.time.minutes}:${element.time.seconds.toString().padStart(2, "0")}:${element.time.hundredths.toString().padStart(2, "0")}`;
				lineContainer.appendChild(timeStamp);
				let lyricText = document.createElement("div");
				if (element.text.length === 0) {
					let icon = instrumentalIcon();
					icon.style.margin = "0 auto";
					icon.style.display = "block";
					lyricText.style.display = "flex";
					lyricText.style.justifyContent = "center";
					lyricText.style.width = "100%";
					lyricText.appendChild(icon);
				} else {
					lyricText.innerText = element.text;
				}
				lineContainer.appendChild(lyricText);
				lyricsContainer.appendChild(lineContainer);
			});
		}
		return lyricsContainer;
	}

	function expandShrinkLyrics() {
		let lyricsContainer = document.querySelector(".mxm-lyrics-container");
		let button = document.querySelector(".mxm-lyrics-expand-button");
		if (lyricsContainer) {
			lyricsContainer.style.maxHeight = lyricsContainer.style.maxHeight === "400px" ? "100px" : "400px";
		}
		if (button) {
			button.style.transform = button.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
		}
	}

	function closePopup() {
		let popup = document.querySelector(".mxm-lyrics-popup");
		if (popup) {
			popup.remove();
		}
	}

	function checkFormat() {
		let formatSelect = document.getElementById("mxm-format-select");
		if (formatSelect) {
			return formatSelect.value;
		}
		return "json"; // Default format
	}

	function getLyricsContent(overrideFormat) {
		let format = overrideFormat || checkFormat();
		let lyrics = JSON.parse(lyricsDict[lyricsDict.length - 1]);
		if (format === "json") {
			return JSON.stringify(lyrics, null, 2);
		} else if (format === "text") {
			return lyrics.map((line) => line.text).join("\n");
		} else if (format === "synced") {
			return lyrics
				.map((line) => {
					const min = line.time.minutes.toString().padStart(2, "0");
					const sec = line.time.seconds.toString().padStart(2, "0");
					const hun = line.time.hundredths.toString().padStart(2, "0");
					return `[${min}:${sec}.${hun}] ${line.text}`;
				})
				.join("\n");
		} else if (format === "html") {
			return lyrics.map((line) => `<div>${line.time.minutes}:${line.time.seconds.toString().padStart(2, "0")}:${line.time.hundredths.toString().padStart(3, "0")} ${line.text}</div>`).join("");
		}
		return "";
	}

	function copyLyrics() {
		let lyricsContent = getLyricsContent();
		navigator.clipboard
			.writeText(lyricsContent)
			.then(() => {
				notification("Lyrics copied to clipboard!");
			})
			.catch((err) => {
				console.error("Error copying lyrics: ", err);
			});
	}

	function clearNotification(notificationElement) {
		if (notificationElement) {
			try {
				notificationElement.hideToast();
			} catch (e) {
				console.error("Error hiding notification toast: ", e);
			}
		}
	}

	function downloadLyrics() {
		let lyricsContent = getLyricsContent();
		let format = checkFormat();
		let fileName = `lyrics.${format === "json" ? "json" : format === "text" ? "txt" : format === "synced" ? "txt" : "html"}`;
		let blob = new Blob([lyricsContent], { type: format === "json" ? "application/json" : format === "text" || format === "synced" ? "text/plain" : "text/html" });
		let url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		notification("Lyrics downloaded!");
	}

	function submitToLRCLIB() {
		let syncedLyrics = getLyricsContent("synced");
		let plainLyrics = getLyricsContent("text");
		let currentMeta = metaDict[metaDict.length - 1] || {};
		const getInput = (id, fallback) => {
			const el = document.getElementById(id);
			return el ? el.value : (typeof fallback !== 'undefined' ? fallback : "");
		};
		let artistName = getInput("mxm-meta-artist", currentMeta.artist);
		let trackName = getInput("mxm-meta-track", currentMeta.track);
		let albumName = getInput("mxm-meta-album", currentMeta.album);
		let durationVal = getInput("mxm-meta-duration", currentMeta.duration);
		let duration = parseFloat(durationVal) || currentMeta.duration || 0;
		let isrc = getInput("mxm-meta-isrc", currentMeta.isrc);

		// Helper to publish lyrics (used in both single and multi-thread)
		async function publishLyrics(publishToken, notif) {
			const payload = {
				trackName: trackName,
				artistName: artistName,
				albumName: albumName,
				duration: duration,
				plainLyrics: plainLyrics,
				syncedLyrics: syncedLyrics,
			};
			let publishResp;
			try {
				publishResp = await fetch("https://lrclib.net/api/publish", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Publish-Token": publishToken,
					},
					body: JSON.stringify(payload),
				});
				if (!publishResp.ok) {
					console.warn("Direct publishing failed, trying with corsproxy...\nStatus:", publishResp.status, "Status Text:", publishResp.statusText);
					// Try with corsproxy if direct fails
					publishResp = await fetch("https://corsproxy.io/?url=https://lrclib.net/api/publish", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-Publish-Token": publishToken,
						},
						body: JSON.stringify(payload),
					});
				}
			} catch (e) {
				console.warn("Direct publishing failed, trying with corsproxy...\nError:", e);
				// Try with corsproxy if fetch throws
				publishResp = await fetch("https://corsproxy.io/?url=https://lrclib.net/api/publish", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Publish-Token": publishToken,
					},
					body: JSON.stringify(payload),
				});
			}
			clearNotification(notif);
			if (publishResp.status === 201) {
				uploadSuccess();
			} else {
				uploadFailed();
				let errorText = await publishResp.text();
				console.error("Failed to submit lyrics:", errorText);
				notification("Failed to submit lyrics: " + errorText, true);
			}
		}

		(async function () {
			try {
				notification("Submitting lyrics to LRCLIB...");
				let notif = displayPersistentToast("Requesting challenge...");
				const challengeResp = await fetch("https://lrclib.net/api/request-challenge", {
					method: "POST",
				});
				if (!challengeResp.ok) {
					alert("Failed to get challenge");
					return;
				}
				const challengeData = await challengeResp.json();
				const prefix = challengeData.prefix;
				const targetHex = challengeData.target;

				// Helper: hex string to Uint8Array
				function hexToBytes(hex) {
					const bytes = new Uint8Array(hex.length / 2);
					for (let i = 0; i < bytes.length; i++) {
						bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
					}
					return bytes;
				}

				// Helper: verify nonce
				function verifyNonce(result, target) {
					if (result.length !== target.length) return false;
					for (let i = 0; i < result.length; i++) {
						if (result[i] > target[i]) return false;
						else if (result[i] < target[i]) break;
					}
					return true;
				}

				// Helper: sha256 as Uint8Array
				async function sha256Bytes(str) {
					const enc = new TextEncoder();
					const buf = enc.encode(str);
					const hash = await crypto.subtle.digest("SHA-256", buf);
					return new Uint8Array(hash);
				}
				clearNotification(notif);
				notif = displayPersistentToast("Solving challenge...");
				const target = hexToBytes(targetHex);

				let nonce = 0;
				let found = false;
				let result;

				if (enableMultiThreading) {
					console.log("Using multi-threaded nonce search");
					const workerCode = [
						'self.onmessage = async function(e) {',
						'  var prefix = e.data.prefix;',
						'  var targetArr = e.data.target;',
						'  var start = e.data.start;',
						'  var step = e.data.step;',
						'  var target = new Uint8Array(targetArr);',
						'  function verifyNonce(result, target) {',
						'    if (result.length !== target.length) return false;',
						'    for (var i = 0; i < result.length; i++) {',
						'      if (result[i] > target[i]) return false;',
						'      else if (result[i] < target[i]) break;',
						'    }',
						'    return true;',
						'  }',
						'  async function sha256Bytes(str) {',
						'    var enc = new TextEncoder();',
						'    var buf = enc.encode(str);',
						'    var hash = await crypto.subtle.digest("SHA-256", buf);',
						'    return new Uint8Array(hash);',
						'  }',
						'  var nonce = start;',
						'  var lastPrint = Date.now();',
						'  while (true) {',
						'    var input = prefix + nonce;',
						'    var result = await sha256Bytes(input);',
						'    if (verifyNonce(result, target)) {',
						'      self.postMessage({ found: true, nonce: nonce });',
						'      break;',
						'    }',
						'    if (Date.now() - lastPrint > 1000) {',
						'      self.postMessage({ found: false, nonce: nonce });',
						'      lastPrint = Date.now();',
						'    }',
						'    nonce += step;',
						'  }',
						'};'
					].join('\n');
					const blob = new Blob([workerCode], { type: 'application/javascript' });
					const workerUrl = URL.createObjectURL(blob);
					const numWorkers = Math.max(2, navigator.hardwareConcurrency ? Math.floor(navigator.hardwareConcurrency / 2) : 2);
					let resolved = false;
					let workers = [];
					let publishNonce = null;
					for (let i = 0; i < numWorkers; i++) {
						const w = new Worker(workerUrl);
						w.onmessage = function(e) {
							if (e.data.found && !resolved) {
								resolved = true;
								publishNonce = e.data.nonce;
								// Terminate all workers
								workers.forEach(wrk => wrk.terminate());
								clearNotification(notif);
								notif = displayPersistentToast("Submitting lyrics...");
								const publishToken = `${prefix}:${publishNonce}`;
								publishLyrics(publishToken, notif);
							} else if (!e.data.found) {
								console.log('Worker', i, 'current nonce:', e.data.nonce);
							}
						};
						w.postMessage({ prefix, target: Array.from(target), start: i, step: numWorkers });
						workers.push(w);
					}
					return; // Don't run the single-threaded code below
				}

				// Single-threaded fallback
				let lastPrintedNonce = 0;
				const printInterval = setInterval(() => {
					console.log("Current nonce:", lastPrintedNonce);
				}, 1000);

				while (!found) {
					const input = `${prefix}${nonce}`;
					result = await sha256Bytes(input);
					lastPrintedNonce = nonce;
					if (verifyNonce(result, target)) {
						found = true;
						break;
					}
					nonce++;
				}
				clearInterval(printInterval);

				const publishToken = `${prefix}:${nonce}`;
				clearNotification(notif);
				notif = displayPersistentToast("Submitting lyrics...");
				await publishLyrics(publishToken, notif);

			} catch (error) {
				notification("Error submitting lyrics: " + error.message, true);
			}
		})();
	}

	function showPopup() {
		let popup = document.createElement("div");
		popup.className = "mxm-lyrics-popup";
		popup.style.position = "fixed";
		popup.style.top = "50%";
		popup.style.left = "50%";
		popup.style.transform = "translate(-50%, -50%)";
		popup.style.background = "var(--mxm-backgroundPrimary)";
		popup.style.padding = "20px";
		popup.style.borderRadius = "20px";
		popup.style.color = "var(--mxm-contentPrimary)";
		popup.style.fontFamily = "Arial";
		popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
		let closeButton = document.createElement("button");
		closeButton.innerText = "×";
		closeButton.style.position = "absolute";
		closeButton.style.top = "10px";
		closeButton.style.right = "10px";
		closeButton.style.backgroundColor = "var(--mxm-backgroundSecondary)";
		closeButton.style.color = "var(--mxm-contentPrimary)";
		closeButton.style.border = "none";
		closeButton.style.borderRadius = "50%";
		closeButton.style.cursor = "pointer";
		closeButton.style.width = "30px";
		closeButton.style.height = "30px";
		closeButton.onclick = closePopup;
		popup.appendChild(closeButton);
		let header = document.createElement("h2");
		header.innerText = "Lyrics";
		header.style.textAlign = "center";
		header.style.marginBottom = "20px";
		popup.appendChild(header);
		let lyricsWrapper = document.createElement("div");
		lyricsWrapper.style.marginBottom = "20px";
		lyricsWrapper.style.display = "flex";
		lyricsWrapper.style.flexDirection = "column";
		let expandButton = document.createElement("button");
		expandButton.innerText = "▲";
		expandButton.style.backgroundColor = "var(--mxm-backgroundSecondary)";
		expandButton.style.color = "var(--mxm-contentPrimary)";
		expandButton.style.border = "none";
		expandButton.style.borderRadius = "50px";
		expandButton.style.cursor = "pointer";
		expandButton.style.transform = "rotate(180deg)";
		expandButton.style.width = "40px";
		expandButton.style.fontSize = "large";
		expandButton.style.padding = "5px";
		expandButton.style.margin = "auto";
		expandButton.className = "mxm-lyrics-expand-button";
		expandButton.onclick = expandShrinkLyrics;
		lyricsWrapper.appendChild(createLyricsElements(lyricsDict[lyricsDict.length - 1]));
		lyricsWrapper.appendChild(expandButton);

		let currentMeta = metaDict[metaDict.length - 1] || {};
		let metaContainer = document.createElement("div");
		metaContainer.style.display = "flex";
		metaContainer.style.flexDirection = "column";
		metaContainer.style.gap = "8px";
		metaContainer.style.margin = "10px 0";
		metaContainer.style.width = "100%";

		const makeField = (id, labelText, value, attrs = {}) => {
			let wrapper = document.createElement("div");
			wrapper.style.display = "flex";
			wrapper.style.flexDirection = "row";
			wrapper.style.alignItems = "center";
			wrapper.style.gap = "8px";
			let label = document.createElement("label");
			label.innerText = labelText + ":";
			label.style.minWidth = "60px";
			label.style.color = "var(--mxm-contentPrimary)";
			label.htmlFor = id;
			let input = document.createElement("input");
			input.id = id;
			input.value = typeof value !== "undefined" ? value : "";
			input.style.flex = "1";
			input.style.padding = "6px";
			input.style.borderRadius = "6px";
			input.style.border = "1px solid var(--mxm-borderPrimary)";
			input.style.background = "var(--mxm-backgroundSecondary)";
			input.style.color = "var(--mxm-contentPrimary)";
			Object.keys(attrs).forEach(k => input.setAttribute(k, attrs[k]));
			wrapper.appendChild(label);
			wrapper.appendChild(input);
			return { wrapper, input };
		};

		const trackField = makeField("mxm-meta-track", "Track", currentMeta.track || "");
		const artistField = makeField("mxm-meta-artist", "Artist", currentMeta.artist || "");
		const albumField = makeField("mxm-meta-album", "Album", currentMeta.album || "");
		const durationField = makeField("mxm-meta-duration", "Duration(s)", currentMeta.duration || "", { type: "number", step: "0.01", min: "0" });
		const isrcField = makeField("mxm-meta-isrc", "ISRC", currentMeta.isrc || "");

		metaContainer.appendChild(trackField.wrapper);
		metaContainer.appendChild(artistField.wrapper);
		metaContainer.appendChild(albumField.wrapper);
		metaContainer.appendChild(durationField.wrapper);
		metaContainer.appendChild(isrcField.wrapper);

		const syncMeta = () => {
			let idx = metaDict.length - 1;
			if (idx < 0) {
				metaDict.push({});
				idx = metaDict.length - 1;
			}
			metaDict[idx] = metaDict[idx] || {};
			metaDict[idx].track = document.getElementById("mxm-meta-track").value;
			metaDict[idx].artist = document.getElementById("mxm-meta-artist").value;
			metaDict[idx].album = document.getElementById("mxm-meta-album").value;
			const durVal = document.getElementById("mxm-meta-duration").value;
			metaDict[idx].duration = durVal === "" ? currentMeta.duration : parseFloat(durVal);
			metaDict[idx].isrc = document.getElementById("mxm-meta-isrc").value;
		};

		["mxm-meta-track", "mxm-meta-artist", "mxm-meta-album", "mxm-meta-duration", "mxm-meta-isrc"].forEach(id => {
			const el = document.getElementById(id);
			if (el) el.addEventListener("input", syncMeta);
		});

		popup.appendChild(lyricsWrapper);
		let bottomButtonContainer = document.createElement("div");
		bottomButtonContainer.style.display = "flex";
		bottomButtonContainer.style.justifyContent = "center";
		bottomButtonContainer.style.marginTop = "20px";
		bottomButtonContainer.style.alignItems = "center";
		let formatLabel = document.createElement("label");
		formatLabel.innerText = "Format: ";
		formatLabel.style.marginRight = "5px";
		formatLabel.style.color = "var(--mxm-contentPrimary)";
		formatLabel.htmlFor = "mxm-format-select";
		let formatSelect = document.createElement("select");
		formatSelect.id = "mxm-format-select";
		formatSelect.title = "Select lyrics format";
		formatSelect.style.marginRight = "10px";
		formatSelect.style.padding = "5px";
		formatSelect.style.borderRadius = "5px";
		formatSelect.style.border = "1px solid var(--mxm-borderPrimary)";
		formatSelect.style.background = "var(--mxm-backgroundSecondary)";
		formatSelect.style.color = "var(--mxm-contentPrimary)";
		formatSelect.innerHTML = `
			<option value="json">JSON</option>
			<option value="text">Text</option>
			<option value="synced">Text (Synced)</option>
			<option value="html">HTML</option>
		`;
		bottomButtonContainer.appendChild(formatLabel);
		bottomButtonContainer.appendChild(formatSelect);
		let copyButton = document.createElement("button");
		copyButton.innerText = "Copy Lyrics";
		copyButton.style.backgroundColor = "var(--mxm-backgroundSecondary)";
		copyButton.style.color = "var(--mxm-contentPrimary)";
		copyButton.style.border = "none";
		copyButton.style.borderRadius = "5px";
		copyButton.style.cursor = "pointer";
		copyButton.style.padding = "10px 20px";
		copyButton.style.marginRight = "10px";
		copyButton.onclick = copyLyrics;
		bottomButtonContainer.appendChild(copyButton);
		let downloadButton = document.createElement("button");
		downloadButton.innerText = "Download Lyrics";
		downloadButton.style.backgroundColor = "var(--mxm-backgroundSecondary)";
		downloadButton.style.color = "var(--mxm-contentPrimary)";
		downloadButton.style.border = "none";
		downloadButton.style.borderRadius = "5px";
		downloadButton.style.cursor = "pointer";
		downloadButton.style.padding = "10px 20px";
		downloadButton.style.marginRight = "10px";
		downloadButton.onclick = downloadLyrics;
		bottomButtonContainer.appendChild(downloadButton);
		let submitButton = document.createElement("button");
		submitButton.id = "lrclib-submit-button";
		submitButton.innerText = "Submit to LRCLIB";
		submitButton.style.backgroundColor = "var(--mxm-backgroundSecondary)";
		submitButton.style.color = "var(--mxm-contentPrimary)";
		submitButton.style.border = "none";
		submitButton.style.borderRadius = "5px";
		submitButton.style.cursor = "pointer";
		submitButton.style.padding = "10px 20px";
		submitButton.onclick = submitToLRCLIB;
		bottomButtonContainer.appendChild(submitButton);

		// Toggle button to show/hide metadata (collapsed by default)
		const metaToggle = document.createElement("button");
		metaToggle.id = "mxm-meta-toggle";
		metaToggle.innerText = "Metadata ▼";
		metaToggle.style.backgroundColor = "var(--mxm-backgroundSecondary)";
		metaToggle.style.color = "var(--mxm-contentPrimary)";
		metaToggle.style.border = "none";
		metaToggle.style.borderRadius = "5px";
		metaToggle.style.cursor = "pointer";
		metaToggle.style.padding = "8px 12px";
		metaToggle.style.marginLeft = "10px";

		// Append the toggle next to the submit button
		bottomButtonContainer.appendChild(metaToggle);

		popup.appendChild(bottomButtonContainer);

		// Wrap metaContainer so we can collapse/expand it via max-height
		const metaWrapper = document.createElement("div");
		metaWrapper.style.overflow = "hidden";
		metaWrapper.style.maxHeight = "0px"; // collapsed by default
		metaWrapper.style.transition = "max-height 0.25s ease";
		metaWrapper.appendChild(metaContainer);

		// Toggle behavior
		let metaExpanded = false;
		metaToggle.addEventListener("click", () => {
			metaExpanded = !metaExpanded;
			if (metaExpanded) {
				metaWrapper.style.maxHeight = "300px"; // expanded height
				metaToggle.innerText = "Metadata ▲";
			} else {
				metaWrapper.style.maxHeight = "0px";
				metaToggle.innerText = "Metadata ▼";
			}
		});

		popup.appendChild(metaWrapper);
		document.body.appendChild(popup);
	}

	const trackTargetString = "https://www.musixmatch.com/ws/1.1/track.subtitle.get?";
	const spotifyDataString = "https://api.spotify.com/v1/tracks/";

	let windowProxy = window;

	if (unsafeWindow) {
		windowProxy = unsafeWindow;
	}
	const originalFetch = windowProxy.fetch;
	windowProxy.fetch = function (...args) {
		const [url] = args;

		return originalFetch.apply(this, args).then(async (response) => {
			// If 404, skip processing and just return response
			if (response.status === 404) {
				return response;
			}

			// Clone the response so we can read its body without affecting downstream usage
			const clonedResponse = response.clone();

			// Check if it's the fetch we're watching
			if (typeof url === "string" && url.includes(trackTargetString)) {
				await clonedResponse.json().then((body) => {
					if (body.message.header.status_code != 200) {
						notification("Failed to fetch lyrics", true);
						return response;
					}
					showToast();
					let rawLyrics = body.message.body.subtitle.subtitle_body;
					lyricsDict.push(rawLyrics);
					console.log("Lyrics Data");
					console.log(body);
					console.log("Raw Lyrics");
					console.log(rawLyrics);
				});
			} else if (typeof url === "string" && url.includes(spotifyDataString)) {
				await clonedResponse.json().then((body) => {
					let trackName = body.name;
					let artistName = body.artists[0].name;
					let albumName = body.album.name;
					let duration = body.duration_ms / 1000; // Convert milliseconds to seconds
					let isrc = body.external_ids.isrc;
					metaDict.push({
						track: trackName,
						artist: artistName,
						album: albumName,
						duration: duration,
						isrc: isrc,
					});
					console.log("Track Metadata");
					console.log(metaDict);
				});
			}

			return response;
		});
	};
})();
