// ==UserScript==
// @name         Export Youtube Playlist in plaintext
// @namespace    1N07
// @version      0.9.4
// @description  Shows a list of the playlist video names/channels/URLs in plaintext to be easily copied
// @author       1N07
// @license      unlicense
// @compatible   firefox v0.9.4 Tested on Firefox v137.0.1 and Tampermonkey 5.3.3 (Likely to work on other userscript managers, but not tested)
// @compatible   chrome v0.9.2 Tested on Chrome v132.0.6834.84 and Tampermonkey 5.3.3 (Likely to work on other userscript managers, but not tested)
// @compatible   opera untested, but likely works with at least Tampermonkey
// @compatible   edge untested, but likely works with at least Tampermonkey
// @compatible   safari untested, but likely works with at least Tampermonkey
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/383993/Export%20Youtube%20Playlist%20in%20plaintext.user.js
// @updateURL https://update.greasyfork.org/scripts/383993/Export%20Youtube%20Playlist%20in%20plaintext.meta.js
// ==/UserScript==

(() => {
	let getVideoTitle = GM_getValue("getVideoTitle", true);
	let getVideoChannel = GM_getValue("getVideoChannel", false);
	let getVideoURL = GM_getValue("getVideoURL", false);
	let videoListSeperator = GM_getValue("videoListSeperator", " ; ");

	let listCreationAllowed = true;
	let urlAtLastCheck = "";
	let buttonInsertInterval;
	let gmMenuButton;

	//add some CSS
	GM_addStyle(`
		tp-yt-paper-listbox#items { overflow-x: hidden; }

		#exportPlainTextList {
			cursor: pointer;
			height: 36px;
			width: 100%;
			display: flex;
			align-items: center;
		}
		#exportPlainTextList > img {
			height: 24px; width: 24px;
			color: rgb(144, 144, 144);
			padding: 0 13px 0 16px;
			filter: contrast(0%);
		}
		#exportPlainTextList > span {
			font-family: "Roboto","Arial",sans-serif;
			color: #d9d9d9;
			white-space: nowrap;
			font-size: 1.4rem;
			line-height: 2rem;
			font-weight: 400;
		}

		#exportPlainTextList:hover { background-color: rgba(255,255,255,0.1); }
		ytd-menu-popup-renderer.ytd-popup-container { overflow-x: hidden !important; max-height: none !important; }

		#listDisplayContainer {
			position: fixed;
			z-index: 9999;
			margin: 0 auto;
			background-color: #464646;
			padding: 10px;
			border-radius: 5px;
			left: 0;
			right: 0;
			max-width: 100vw;
			width: 1200px;
			height: 900px;
			max-height: 90vh;
			top: 5vh;
			resize: both;
			overflow: hidden;
		}
		#listDisplayContainer p {
			text-align: center;
		}
		#listDisplayContainer .title {
			font-size: 21px;
			font-weight: bold;
			color: #d9d9d9;
		}
		#listDisplayContainer ul {
			list-style: none;
			font-size: 12px;
			scale: 1.4;
			color: #d9d9d9;
			width: -moz-fit-content;
			width: fit-content;
			margin: 40px auto;
		}
		#listDisplayContainer > textarea {
			box-sizing: border-box;
			width: 100%;
			margin: 10px 0;
			height: calc(100% - 40px);
			background-color: #262626;
			border: none;
			color: #EEE;
			border-radius: 5px;
			resize: none;
		}
		#listDisplayContainer #listDisplayGetListButton {
			position: relative;
			margin: 10px 0;
			font-size: 13px;
			left: 50%;
			transform: translateX(-50%);
		}
		#closeTheListThing {
			float: right;
			font-weight: bold;
			background-color: RGBA(255,255,255,0.25);
			border: none;
			font-size: 17px;
			border-radius: 10px;
			height: 25px;
			width: 25px;
			cursor: pointer;
		}

		#closeTheListThing:hover { background-color: rgba(255,255,255,0.5); }

		tp-yt-iron-dropdown.ytd-popup-container #contentWrapper > yt-sheet-view-model.ytd-popup-container {
			max-height: unset !important;
		}

		.yt-pl-export-loading-popup {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #262626;
			padding: 20px;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
			z-index: 9999;
			border-radius: 8px;
			text-align: center;
		}
		.yt-pl-export-loading-popup-message {
			font-size: 2rem;
			color: #d9d9d9;
		}
	`);

	setInterval(() => {
		if (urlAtLastCheck !== window.location.href) {
			urlAtLastCheck = window.location.href;
			if (urlAtLastCheck.includes("/playlist?list=")) {
				gmMenuButton = GM_registerMenuCommand("Export Playlist", () => {
					if (document.querySelector("ytd-playlist-video-list-renderer > #contents.ytd-playlist-video-list-renderer")?.hasChildNodes()) {
						ScrollUntillAllVisible();
					}
					else {
						const popup = CreatePopup("No videos found in this playlist. Either this playlist has no videos, or they have not loaded in yet.");
						setTimeout(() => { popup.close() }, 3000);
					}
				});

				InsertButtonASAP();
			}
			else {
				if (gmMenuButton != null)
					GM_unregisterMenuCommand(gmMenuButton);
				clearInterval(buttonInsertInterval);
			}
		}
	}, 100);


	function InsertButtonASAP() {
		buttonInsertInterval = setInterval(() => {
			//wait for possible previous buttons to stop existing (due to how youtube loads pages) and for the space for the new button to be available
			if (!document.getElementById("exportPlainTextList")) {
				let place = document.querySelector("tp-yt-iron-dropdown.ytd-popup-container .yt-list-view-model-wiz[role='menu']");
				if (!place)
					place = document.querySelector("tp-yt-iron-dropdown.ytd-popup-container tp-yt-paper-listbox.ytd-menu-popup-renderer[role='listbox']");
				if (place) {
					place.appendChild(
						CreateElement("div", {
							attributes: { id: "exportPlainTextList" },
							children: [
								CreateElement("img", {
									attributes: { src: "https://i.imgur.com/emlur3a.png" }
								}),
								CreateElement("span", {
									properties: { textContent: "Export Playlist" }
								})
							],
							events: {
								click: ScrollUntillAllVisible
							}
						})
					);
				}

			}
		}, 100);
	}

	function ScrollUntillAllVisible() {
		if (!listCreationAllowed)
			return;

		document.querySelector("ytd-browse[page-subtype='playlist']").click();
		const popup = CreatePopup("Scrolling to load all videos in the playlist. Please wait...");
		listCreationAllowed = false;
		const scrollInterval = setInterval(() => {
			if (document.querySelector("ytd-continuation-item-renderer.ytd-playlist-video-list-renderer")) {
				window.scrollTo(0, (document.documentElement || document.body).scrollHeight);
			} else {
				popup.close();
				DisplayListOptions();
				clearInterval(scrollInterval);
			}
		}, 100);
	}

	function DisplayListOptions() {
		document.body.appendChild(
			CreateElement("div", {
				attributes: { id: "listDisplayContainer" },
				children: [
					CreateElement("p", {
						children: [
							CreateElement("span", {
								attributes: { class: "title" },
								children: ["Playlist in plain text"]
							}),
							CreateElement("button", {
								attributes: { id: "closeTheListThing" },
								properties: { textContent: "X" },
								events: {
									click: () => {
										document.getElementById("listDisplayContainer").remove();
										listCreationAllowed = true;
									}
								}
							})
						]
					}),
					CreateElement("textarea", {
						attributes: { style: "display: none;" }
					}),
					CreateElement("ul", {
						attributes: { id: "listDisplayOptions" },
						children: [
							CreateListItemWithCheckbox('Get titles', 'getVideoTitleCB', getVideoTitle, function () {
								getVideoTitle = this.checked;
								GM_setValue("getVideoTitle", getVideoTitle);
							}),
							CreateListItemWithCheckbox('Get channel names', 'getVideoChannelCB', getVideoChannel, function () {
								getVideoChannel = this.checked;
								GM_setValue("getVideoChannel", getVideoChannel);
							}),
							CreateListItemWithCheckbox('Get URLs', 'getVideoURLCB', getVideoURL, function () {
								getVideoURL = this.checked;
								GM_setValue("getVideoURL", getVideoURL);
							}),
							CreateElement("li", {
								children: [
									CreateElement("label", {
										children: [
											CreateElement("input", {
												attributes: { type: "text", id: "videoListSeperatorInput", name: "videoListSeperatorInput" },
												properties: { value: videoListSeperator, style: "width: 40px; text-align: center;" },
												events: {
													change: function () {
														videoListSeperator = this.value;
														GM_setValue("videoListSeperator", videoListSeperator);
													}
												}
											}),
											" Name/Author/URL separator"
										]
									})
								]
							}),
							CreateElement("li", {
								children: [
									CreateElement("button", {
										attributes: { id: "listDisplayGetListButton" },
										properties: { textContent: "Get list" },
										events: {
											click: BuildAndDisplayList
										}
									})
								]
							})
						]
					}),
				]
			})
		);
	}

	function BuildAndDisplayList() {
		document.getElementById("listDisplayOptions").style.display = "none";
		document.querySelector("#listDisplayContainer > textarea").style.display = "block";

		const videoTitleArr = [];
		const videoChannelArr = [];
		const videoURLArr = [];
		let videoCount = 0;

		for (const element of document.querySelectorAll("ytd-playlist-video-list-renderer > #contents.ytd-playlist-video-list-renderer > ytd-playlist-video-renderer #content")) {
			if (getVideoTitle)
				videoTitleArr.push(element.querySelector("#video-title").getAttribute("title"));

			if (getVideoURL)
				videoURLArr.push(`https://www.youtube.com${element.querySelector("#video-title").getAttribute("href").split("&")[0]}`);

			if (getVideoChannel)
				videoChannelArr.push(element.querySelector("#channel-name yt-formatted-string.ytd-channel-name > a").textContent);

			videoCount++;
		}

		let list = "";
		for (let i = 0; i < videoCount; i++) {
			if (getVideoTitle)
				list += videoTitleArr[i];

			if (getVideoChannel)
				list += (getVideoTitle ? `${videoListSeperator}` : "") + videoChannelArr[i];

			if (getVideoURL)
				list += (getVideoTitle || getVideoChannel ? `${videoListSeperator}` : "") + videoURLArr[i];

			list += "\n";
		}

		document.querySelector("#listDisplayContainer > textarea").value = list;
	}

	function CreateElement(tag, {
		attributes = {},
		properties = {},
		styles = {},
		events = {},
		children = []
	} = {}) {
		const el = document.createElement(tag);

		// Set attributes (id, type, value, etc.)
		for (const [attr, value] of Object.entries(attributes)) {
			el.setAttribute(attr, value);
		}

		// Set direct properties (like textContent, checked, disabled)
		for (const [prop, value] of Object.entries(properties)) {
			el[prop] = value;
		}

		// Apply styles
		for (const [key, value] of Object.entries(styles)) {
			el.style[key] = value;
		}

		// Add event listeners
		for (const [event, handler] of Object.entries(events)) {
			el.addEventListener(event, handler);
		}

		// Append children
		for (const child of children) {
			el.appendChild(
				typeof child === 'string' ? document.createTextNode(child) : child
			);
		}

		return el;
	}
	function CreateListItemWithCheckbox(labelText, checkboxId, checked, functionOnChange) {
		return CreateElement("li", {
			children: [
				CreateElement("label", {
					children: [
						CreateElement("input", {
							attributes: { type: "checkbox", id: checkboxId, name: checkboxId, value: checkboxId },
							properties: { checked: checked },
							events: {
								change: functionOnChange ? functionOnChange : () => { }
							}
						}),
						labelText
					]
				})
			]
		});
	}

	function CreatePopup(message) {
		const popup = CreateElement("div", {
			attributes: { id: "yt-pl-export-loading-popup" },
			children: [
				CreateElement("p", {
					attributes: { class: "yt-pl-export-loading-popup-message" },
					properties: { textContent: message }
				})
			]
		});
		document.body.appendChild(popup);

		// Return an object that can be used to close the popup later
		return {
			close: closePopup
		};

		// Function to close the popup
		function closePopup() {
			document.body.removeChild(popup);
		}
	}
})();