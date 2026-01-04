// ==UserScript==
// @name         Telegram Ad Filter
// @version      1.4.2
// @description  Collapses messages that contain words from the ad-word list
// @license      MIT
// @author       VChet
// @icon         https://web.telegram.org/favicon.ico
// @namespace    telegram-ad-filter
// @match        https://web.telegram.org/k/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @homepage     https://github.com/VChet/telegram-ad-filter
// @homepageURL  https://github.com/VChet/telegram-ad-filter
// @supportURL   https://github.com/VChet/telegram-ad-filter
// @downloadURL https://update.greasyfork.org/scripts/379355/Telegram%20Ad%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/379355/Telegram%20Ad%20Filter.meta.js
// ==/UserScript==

/* jshint esversion: 11 */


//#region src/DOM.ts
const globalStyles = `
  .bubble:not(.has-advertisement) .advertisement,
  .bubble.has-advertisement .bubble-content *:not(.advertisement),
  .bubble.has-advertisement .reply-markup {
    display: none;
  }
  .advertisement {
    padding: 0.5rem 1rem;
    cursor: pointer;
    white-space: nowrap;
    font-style: italic;
    font-size: var(--messages-text-size);
    font-weight: var(--font-weight-bold);
    color: var(--link-color);
  }
  #telegram-ad-filter-settings {
    display: inline-flex;
    justify-content: center;
    width: 24px;
    font-size: 24px;
    color: transparent;
    text-shadow: 0 0 var(--secondary-text-color);
  }
`;
const frameStyle = `
  inset: 115px auto auto 130px;
  border: 1px solid rgb(0, 0, 0);
  height: 300px;
  margin: 0px;
  max-height: 95%;
  max-width: 95%;
  opacity: 1;
  overflow: auto;
  padding: 0px;
  position: fixed;
  width: 75%;
  z-index: 9999;
  display: block;
`;
const popupStyle = `
  #telegram-ad-filter {
    background: #181818;
    color: #ffffff;
  }
  #telegram-ad-filter textarea {
    resize: vertical;
    width: 100%;
    min-height: 150px;
  }
  #telegram-ad-filter .reset, #telegram-ad-filter .reset a, #telegram-ad-filter_buttons_holder {
    color: inherit;
  }
`;
function addSettingsButton(element, callback) {
	const settingsButton = document.createElement("button");
	settingsButton.classList.add("btn-icon", "rp");
	settingsButton.setAttribute("title", "Telegram Ad Filter Settings");
	const ripple = document.createElement("div");
	ripple.classList.add("c-ripple");
	const icon = document.createElement("span");
	icon.id = "telegram-ad-filter-settings";
	icon.textContent = "⚙️";
	settingsButton.append(ripple);
	settingsButton.append(icon);
	settingsButton.addEventListener("click", (event) => {
		event.stopPropagation();
		callback();
	});
	element.append(settingsButton);
}
function handleMessageNode(node, adWords) {
	const message = node.querySelector(".message");
	if (!message || node.querySelector(".advertisement")) return;
	const textContent = message.textContent?.toLowerCase();
	const links = [...message.querySelectorAll("a")].reduce((acc, { href }) => {
		if (href) acc.push(href.toLowerCase());
		return acc;
	}, []);
	if (!textContent && !links.length) return;
	if (!adWords.map((filter) => filter.toLowerCase()).some((filter) => textContent?.includes(filter) || links.some((href) => href.includes(filter)))) return;
	const trigger = document.createElement("div");
	trigger.classList.add("advertisement");
	trigger.textContent = "Hidden by filter";
	node.querySelector(".bubble-content")?.prepend(trigger);
	node.classList.add("has-advertisement");
	trigger.addEventListener("click", () => {
		node.classList.remove("has-advertisement");
	});
	message.addEventListener("click", () => {
		node.classList.add("has-advertisement");
	});
}

//#endregion
//#region src/configs.ts
const settingsConfig = {
	id: "telegram-ad-filter",
	frameStyle,
	css: popupStyle,
	title: "Telegram Ad Filter Settings",
	fields: { listUrls: {
		label: "Blacklist URLs (one per line) – each URL must be a publicly accessible JSON file containing an array of blocked words or phrases",
		type: "textarea",
		default: "https://raw.githubusercontent.com/VChet/telegram-ad-filter/master/blacklist.json"
	} }
};

//#endregion
//#region src/fetch.ts
function isValidURL(payload) {
	try {
		if (typeof payload !== "string") return false;
		const parsedUrl = new URL(payload);
		return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
	} catch {
		return false;
	}
}
function isValidJSON(payload) {
	try {
		JSON.parse(payload);
		return true;
	} catch {
		return false;
	}
}
async function fetchAndParseJSON(url) {
	const content = await fetch(url).then((response) => response.text());
	if (!isValidJSON(content)) throw new SyntaxError(`Invalid JSON: data from ${url}`);
	return JSON.parse(content);
}
async function fetchLists(urlsString) {
	const urls = urlsString.split("\n").map((url) => url.trim()).filter(Boolean);
	const resultSet = /* @__PURE__ */ new Set();
	for (const url of urls) {
		if (!isValidURL(url)) throw new URIError(`Invalid URL: ${url}. Please ensure it leads to an online source like GitHub, Gist, Pastebin, etc.`);
		try {
			const parsedData = await fetchAndParseJSON(url);
			if (!Array.isArray(parsedData)) throw new TypeError(`Invalid array: data from ${url}`);
			const strings = parsedData.filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter(Boolean);
			for (const string of strings) resultSet.add(string);
		} catch (error) {
			if (error instanceof SyntaxError) throw error;
			throw new Error(`Fetch error: ${url}. Please check the URL or your network connection.`);
		}
	}
	return [...resultSet];
}

//#endregion
//#region src/main.ts
(async () => {
	GM_addStyle(globalStyles);
	let adWords = [];
	const gmc = new GM_configStruct({
		...settingsConfig,
		events: {
			init: async function() {
				adWords = await fetchLists(this.get("listUrls").toString());
			},
			save: async function() {
				try {
					adWords = await fetchLists(this.get("listUrls").toString());
					this.close();
				} catch (error) {
					alert(error instanceof Error ? error.message : String(error));
				}
			}
		}
	});
	function walk(node) {
		if (!(node instanceof HTMLElement) || !node.nodeType) return;
		let child = null;
		let next = null;
		switch (node.nodeType) {
			case node.ELEMENT_NODE:
			case node.DOCUMENT_NODE:
			case node.DOCUMENT_FRAGMENT_NODE:
				if (node.matches(".chat-utils")) addSettingsButton(node, () => {
					gmc.open();
				});
				if (node.matches(".bubble")) handleMessageNode(node, adWords);
				child = node.firstChild;
				while (child) {
					next = child.nextSibling;
					walk(child);
					child = next;
				}
				break;
			case node.TEXT_NODE:
			default: break;
		}
	}
	function mutationHandler(mutationRecords) {
		for (const { type, addedNodes } of mutationRecords) if (type === "childList" && typeof addedNodes === "object" && addedNodes.length) for (const node of addedNodes) walk(node);
	}
	new MutationObserver(mutationHandler).observe(document, {
		childList: true,
		subtree: true,
		attributeFilter: ["class"]
	});
})();

//#endregion
