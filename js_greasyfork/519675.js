// ==UserScript==
// @name         YouTube Transcript for all videos with subs
// @namespace    https://baegus.cz
// @version      0.1
// @description  Shows a transcript with clickable timestamps for any video with subtitles. Just enable subtitles and look in the description (or the dev console).
// @author       Jaroslav Petrnoušek
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519675/YouTube%20Transcript%20for%20all%20videos%20with%20subs.user.js
// @updateURL https://update.greasyfork.org/scripts/519675/YouTube%20Transcript%20for%20all%20videos%20with%20subs.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function seekToTime (milliseconds) {
		window.scrollTo(0,0);
		const player = document.querySelector("video");
		if (player) {
			player.currentTime = milliseconds / 1000;
		}
	}

	const pad = (num) => num.toString().padStart(2, "0");

	function formatYouTubeTime(ms) {
		const totalSeconds = Math.floor(ms / 1000);
		const days = Math.floor(totalSeconds / (24 * 3600));
		const remainingSeconds = totalSeconds % (24 * 3600);

		const hours = Math.floor(remainingSeconds / 3600);
		const minutes = Math.floor((remainingSeconds % 3600) / 60);
		const seconds = remainingSeconds % 60;

		// Construct the time string based on duration
		if (days > 0) {
			return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
		} else if (hours > 0) {
			return `${hours}:${pad(minutes)}:${pad(seconds)}`;
		} else {
			return `${minutes}:${pad(seconds)}`;
		}
	}

	function dispatchSubtitleData(subtitleData) {
		const event = new CustomEvent("youtubeSubtitleData", {
			detail: subtitleData
		});
		window.dispatchEvent(event);
	}

	// Intercept Fetch requests
	const originalFetch = window.fetch;
	window.fetch = async function(...args) {
		try {
			const response = await originalFetch(...args);

			if (args[0] && typeof args[0] === "string" && args[0].includes("/api/timedtext")) {
				const clonedResponse = response.clone();
				try {
					const data = await clonedResponse.json();
					dispatchSubtitleData({
						type: "fetch",
						url: args[0],
						data: data
					});
				} catch (jsonError) {
					console.log("Error parsing subtitle JSON (fetch):", jsonError);
				}
			}
			return response;
		} catch (fetchError) {
			throw fetchError;
		}
	};

	// Intercept XMLHttpRequest
	const originalXHROpen = XMLHttpRequest.prototype.open;
	const originalXHRSend = XMLHttpRequest.prototype.send;

	XMLHttpRequest.prototype.open = function(...args) {
		this._url = args[1];
		return originalXHROpen.apply(this, args);
	};

	XMLHttpRequest.prototype.send = function(...args) {
		const xhr = this;

		if (xhr._url && xhr._url.includes("/api/timedtext")) {
			const originalOnLoad = xhr.onload;
			xhr.onload = function() {
				try {
					const data = JSON.parse(xhr.responseText);

					dispatchSubtitleData({
						type: "xhr",
						url: xhr._url,
						data: data
					});
				} catch (parseError) {
					console.log("Error parsing subtitle JSON (XHR):", parseError);
				}

				if (originalOnLoad) {
					originalOnLoad.apply(xhr, arguments);
				}
			};

			const originalAddEventListener = xhr.addEventListener;
			xhr.addEventListener = function(event, callback, ...rest) {
				if (event === "load") {
					const wrappedCallback = function() {
						try {
							const data = JSON.parse(xhr.responseText);

							dispatchSubtitleData({
								type: "xhr",
								url: xhr._url,
								data: data
							});
						} catch (parseError) {
							console.log("Error parsing subtitle JSON (XHR addEventListener):", parseError);
						}

						return callback.apply(this, arguments);
					};

					return originalAddEventListener.call(xhr, event, wrappedCallback, ...rest);
				}

				return originalAddEventListener.call(xhr, event, callback, ...rest);
			};
		}

		return originalXHRSend.apply(this, args);
	};

	console.log("'YouTube Transcript for all videos' is active. Enable subtitles to show transcript here in the console!");

	window.addEventListener("youtubeSubtitleData", async function(event) {
		try {
			//console.log("Subtitle Data Intercepted:", event.detail);

			const subtitleData = event.detail.data;
			if (!event.detail.data) {
				throw new Error("No subtitle data");
			}
			const timedTextData = [];
			const timeTextLines = [];
			subtitleData.events.forEach(event => {
				if (!event.segs) return;
				const segText = event.segs.map(segData => segData.utf8).join(" ");
				if (segText == "\n") return;
				const timeFormatted = formatYouTubeTime(event.tStartMs);
				timedTextData.push({
					time: event.tStartMs,
					timeFormatted,
					text: segText,
				});
				timeTextLines.push(`${timeFormatted}  ${segText}`);
			});
			console.clear();
			console.log("Transcript created. You can find it in the video description (with clickable timestamps) or right here:")
			console.log(timeTextLines.join("\n"));

			const bottomRowItems = document.querySelector("#bottom-row #items");

			const existingTranscriptCont = bottomRowItems.querySelector("#customTranscriptCont");
			if (existingTranscriptCont) {
				existingTranscriptCont.parentNode.removeChild(existingTranscriptCont);
			}

			const transcriptCont = document.createElement("div");
			transcriptCont.id = "customTranscriptCont";

			const transcriptTitle = document.createElement("h2");
			transcriptTitle.className = "style-scope ytd-rich-list-header-renderer";
			Object.assign(transcriptTitle.style, {
				"margin": "1em 0",
			});

			transcriptTitle.innerText = "Custom transcript";
			transcriptCont.appendChild(transcriptTitle);

			for (const line of timedTextData) {
				const lineCont = document.createElement("p");

				const timestampLink = document.createElement("span");
				timestampLink.className = "yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color";
				timestampLink.style.cursor = "pointer";
				timestampLink.innerText = `${line.timeFormatted} `;
				lineCont.appendChild(timestampLink);
				timestampLink.addEventListener("click",(e) => {
					seekToTime(line.time);
				});

				const subtitleText = document.createElement("span");
				subtitleText.innerText = line.text;
				lineCont.appendChild(subtitleText);

				transcriptCont.appendChild(lineCont);
			}

			bottomRowItems.prepend(transcriptCont);

		} catch (error) {
			console.error("Error processing subtitle data:", error);
		}
	});
})();