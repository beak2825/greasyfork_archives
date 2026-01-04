// ==UserScript==
// @name        Kemono Browser
// @namespace   Violentmonkey Scripts
// @version     1.9.17
// @description Adds a button at the bottom right of all kemono, coomer & nekohouse supported creator websites that redirects to the corresponding page.
// @author      zWolfrost
// @license     MIT
// @match       *://*.patreon.com/*
// @match       *://*.fanbox.cc/*
// @match       *://*.pixiv.net/*
// @match       *://*.discord.com/*
// @match       *://*.fantia.jp/*
// @match       *://*.boosty.to/*
// @match       *://*.dlsite.com/*
// @match       *://*.gumroad.com/*
// @match       *://*.subscribestar.com/*
// @match       *://*.subscribestar.adult/*
// @match       *://*.onlyfans.com/*
// @match       *://*.fansly.com/*
// @match       *://*.candfans.jp/*
// @match       *://*.x.com/*
// @connect     kemono.cr
// @connect     coomer.st
// @connect     nekohouse.su
// @connect     fansly.com
// @icon        https://kemono.cr/static/favicon.ico
// @grant       GM.xmlHttpRequest
// @grant       GM.getResourceUrl
// @grant       GM.openInTab
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/483259/Kemono%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/483259/Kemono%20Browser.meta.js
// ==/UserScript==
"use strict";


///////////////// OPTIONS /////////////////

// Buttons to include
const BUTTONS = {
	KEMONO: true,
	COOMER: true,
	NEKOHOUSE: false
}

// Whether to open the url in a new tab by default
// Note that ctrl+clicking the button does the opposite of the default behavior
const OPEN_IN_NEW_TAB = true;

// Button classes to apply
const BUTTONS_CLASSES = {
	"include-icon": true,
	"include-text": true,
	"animate-click": true
}

// Buttons CSS
const BUTTONS_CSS = `
#_kemono-browser-container {
	--status-prefix: "Creator: ";
}

/* WEBSITE-SPECIFIC BUTTON CSS */
#_kemono-browser-container.discord { transform: translate(-248px, -75px); }
#_kemono-browser-container.patreon { --btn-shadow-color: #ffffff50; }
#_kemono-browser-container.x { --btn-shadow-color: #ffffff50; }


#_kemono-browser-container {
	--btn-shadow-color: transparent;

	display: block !important;
	position: fixed !important;

	z-index: 999999 !important;
	right: 0 !important;
	bottom: 0 !important;
}


#_kemono-browser-container > a {
	display: none !important;
	position: relative !important;

	min-width: 1vh !important;
	min-height: 1vh !important;
	max-width: max-content !important;
	max-height: max-content !important;

	align-items: center !important;
	justify-content: center !important;
	gap: 0.3vh !important;

	border: 0.2vh solid black !important;
	border-radius: 0.4vh !important;
	padding: 0.6vh !important;
	margin: 1.2vh !important;
	margin-left: auto !important;

	font-family: arial !important;
	font-weight: bold !important;
	font-size: 1.9vh !important;

	line-height: normal !important;
	text-decoration: none !important;
	cursor: pointer !important;
	user-select: none !important;

	transition-property: top, right, bottom, left, box-shadow !important;
	transition-duration: 0.05s !important;
	transition-timing-function: ease-out !important;
}
#_kemono-browser-container > a.disabled {
	pointer-events: none !important;
	opacity: 0.5 !important;
}
#_kemono-browser-container > a:hover { filter: brightness(90%); }
#_kemono-browser-container > a:active { filter: brightness(75%); }


#_kemono-browser-container > a > img {
	display: none !important;
}
#_kemono-browser-container > a.include-icon > img {
	display: inline-block !important;
	width: 2.3vh !important;
	height: 2.3vh !important;
}
#_kemono-browser-container > a.disabled[data-status=update] > img {
	animation: rotating 1s linear infinite !important;
}
@keyframes rotating {
	to { transform: rotate(360deg); }
}


#_kemono-browser-container > a.animate-click {
	bottom: 0.0vh;
	right: 0.0vh;
	box-shadow: black 0.05vh 0.05vh, black 0.1vh 0.1vh, black 0.15vh 0.15vh, black 0.2vh 0.2vh,
		black 0.25vh 0.25vh, black 0.3vh 0.3vh, black 0.35vh 0.35vh, black 0.4vh 0.4vh,
		var(--btn-shadow-color) 0vh 0vh 0.5vh, var(--btn-shadow-color) 0.4vh 0.4vh 0.5vh;
}
#_kemono-browser-container > a.animate-click:active {
	bottom: -0.4vh;
	right: -0.4vh;
	box-shadow: var(--btn-shadow-color) 0vh 0vh 0.5vh;
}


#_kemono-browser-container > a[data-status] { display: flex !important; background-color: #444444; color: white; }
#_kemono-browser-container > a.include-text[data-status]::after { content: var(--status-prefix) "Unknown (error " attr(data-status) ")"; }

#_kemono-browser-container > a[data-status=found] { background-color: green; color: white; }
#_kemono-browser-container > a.include-text[data-status=found]::after { content: var(--status-prefix) "Found"; }

#_kemono-browser-container > a[data-status=incomplete] { background-color: gold; color: black; }
#_kemono-browser-container > a[data-status=incomplete] > img { filter: invert(1); }
#_kemono-browser-container > a.include-text[data-status=incomplete]::after { content: var(--status-prefix) "Incomplete"; }

#_kemono-browser-container > a[data-status=missing] { background-color: red; color: white; }
#_kemono-browser-container > a.include-text[data-status=missing]::after { content: var(--status-prefix) "Missing"; }

#_kemono-browser-container > a[data-status=pending] { background-color: gray; color: white; }
#_kemono-browser-container > a.include-text[data-status=pending]::after { content: var(--status-prefix) "Pending..."; }

#_kemono-browser-container > a[data-status=update] { background-color: gray; color: white; }
#_kemono-browser-container > a[data-status=update]::after { display: none; }
#_kemono-browser-container > a.disabled[data-status=update]::after { display: inline; content: "Waiting to avoid hitting rate-limit..."; }
`;


////////////// BUTTONS STUFF //////////////

// initialize buttons
function initButtons() {
	// get domain & classes to include
	const domain = window.location.hostname.split(".").slice(-2).join(".");

	// append css to head
	document.head.appendChild(document.createElement("style")).innerHTML = BUTTONS_CSS;

	// create button container
	const BUTTONS_CONTAINER = document.createElement("div");
	BUTTONS_CONTAINER.id = "_kemono-browser-container";
	BUTTONS_CONTAINER.classList.add(domain.split(".")[0]);
	document.body.prepend(BUTTONS_CONTAINER);

	// create update button
	BUTTONS.UPDATE = true;

	for (let key in BUTTONS) {
		if (BUTTONS[key]) {
			// create button element
			BUTTONS[key] = document.createElement("a");

			// set button icon
			let name = key.toLocaleLowerCase();
			BUTTONS[key].id = `_${name}-btn`;
			const ICON = document.createElement("img");
			ICON.src = `data:image/png;base64,${ICONS_B64[name]}`;
			BUTTONS[key].prepend(ICON);

			// set button attributes
			let classes = Object.keys(BUTTONS_CLASSES).filter(key => BUTTONS_CLASSES[key]);
			BUTTONS[key].classList.add(...classes);
			BUTTONS[key].target = OPEN_IN_NEW_TAB ? "_blank" : "_self";
			BUTTONS[key].draggable = false;
			BUTTONS[key].querySelector("img").draggable = false;

			// add ctrl+click event listener
			BUTTONS[key].addEventListener("click", function(e) {
				if (e.ctrlKey) {
					e.preventDefault();

					if (this.target == "_self") GM.openInTab(this.href);
					else window.open(this.href, "_self");
				}
			});

			// append button to body
			BUTTONS_CONTAINER.prepend(BUTTONS[key]);
		}
		else {
			delete BUTTONS[key];
		}
	}

	if (domain in rateLimitedDomainMethods) {
		BUTTONS.UPDATE.classList.add("include-icon");
		BUTTONS.UPDATE.dataset.status = "update";
		BUTTONS.UPDATE.addEventListener("click", function() {
			rateLimitedDomainMethods[domain]().then(updateButtons)

			// wait a bit before re-enabling the button to avoid hitting the rate limit
			this.classList.add("disabled");
			setTimeout(() => this.classList.remove("disabled"), 3000);
		});
		delete BUTTONS.UPDATE;
	}
	else if (domain in domainMethods) {
		setInterval(() => {
			if (!document.getElementById(BUTTONS_CONTAINER.id)) document.body.prepend(BUTTONS_CONTAINER);
			updateButtons(domainMethods[domain]());
		}, 222);
	}
}

// update buttons
function updateButtons(urls) {
	for (let key in BUTTONS) {
		let newURL = urls[key] ?? "";
		if (newURL != BUTTONS[key].dataset.href) {
			if (newURL) {
				// set the button to the pending status, while waiting for a response
				BUTTONS[key].href = newURL;
				BUTTONS[key].dataset.href = newURL;
				BUTTONS[key].dataset.status = "pending";

				getCreatorStatus(BUTTONS[key].dataset.href).then(status => {
					if (status == "incomplete" && newURL.includes("/post")) {
						BUTTONS[key].href = newURL.split("/").slice(0, -2).join("/");
					}

					if (BUTTONS[key].dataset.href == newURL) {
						BUTTONS[key].dataset.status = status;
					}
				});
			}
			else {
				BUTTONS[key].href = "";
				delete BUTTONS[key].dataset.href;
				delete BUTTONS[key].dataset.status;
			}
		}
	}
}


////////// URLs EXTRACTION STUFF //////////

const domainMethods = {
	"patreon.com": extractURLFromPatreon,
	"fanbox.cc": extractURLFromFanbox,
	"pixiv.net": extractURLFromPixiv,
	"discord.com": extractURLFromDiscord,
	"fantia.jp": extractURLFromFantia,
	"boosty.to": extractURLFromBoosty,
	"dlsite.com": extractURLFromDlsite,
	"gumroad.com": extractURLFromGumroad,
	"subscribestar.com": extractURLFromSubscribeStar,
	"subscribestar.adult": extractURLFromSubscribeStar,
	"onlyfans.com": extractURLFromOnlyFans,
	"candfans.jp": extractURLFromCandFans,
	"x.com": extractURLFromTwitter
}
const rateLimitedDomainMethods = {
	"fansly.com": extractURLFromFansly
}

// create the creator url with the given parameters
function compileURL({domains, service, userID=null, postID=null} = {}) {
	let obj = {};

	for (let domain of domains) {
		let redirectURL = `https://${domain}/${service}`;

		if (userID) {
			redirectURL += `/user/${userID}`;

			if (postID) {
				redirectURL += `/post/${postID}`;
			}
		}
		else continue;

		obj[domain.split(".").at(-2).toUpperCase()] = redirectURL;
	}

	return obj;
}

function extractURLFromPatreon() {
	return compileURL({
		domains: ["kemono.cr"],
		service: "patreon",
		userID: extract(select("#__NEXT_DATA__"), '"creator":{"data":{"id":"', '"') ??
			extract(select("body"), '\\"https://www.patreon.com/api/user/', "\\"),
		postID: extractNextUrlPath("posts")?.split("-")?.at(-1)
	})
}
function extractURLFromFanbox() {
	return compileURL({
		domains: ["kemono.cr", "nekohouse.su"],
		service: "fanbox",
		userID: extract(select('meta[property="og:image"]', "content"), "/creator/", "/") ??
			extract(select(".styled__StyledUserIcon-sc-1upaq18-10[style]", "style"), "/user/", "/") ??
			extract(select('a[href^="https://www.pixiv.net/users/"]', "href"), "/users/", "/"),
		postID: extractNextUrlPath("posts")
	})
}
function extractURLFromPixiv() {
	return compileURL({
		domains: ["kemono.cr", "nekohouse.su"],
		service: "fanbox",
		userID: extractNextUrlPath("users") ??
			select("button[data-gtm-user-id]", "data-gtm-user-id") ??
			select("a.user-details-icon[href]", "href")?.split("/").at(-1),
	})
}
function extractURLFromDiscord() {
	const pathname = window.location.pathname.split("/");

	const serverID = /\d/.test(pathname[2]) ? `${pathname[2]}/${pathname?.[3] ?? ""}` : null

	return serverID ? {
		"KEMONO": `https://kemono.cr/discord/server/${serverID}`
	} : {}
}
function extractURLFromFantia() {
	return compileURL({
		domains: ["kemono.cr", "nekohouse.su"],
		service: "fantia",
		userID: extractNextUrlPath("fanclubs") ?? extract(select(".fanclub-header > a[href]", "href"), "/fanclubs/", "/"),
		postID: extractNextUrlPath("posts") ?? extractNextUrlPath("products")
	})
}
function extractURLFromBoosty() {
	return compileURL({
		domains: ["kemono.cr"],
		service: "boosty",
		userID: extractNextUrlPath("/"),
		postID: extractNextUrlPath("posts")
	})
}
function extractURLFromDlsite() {
	return compileURL({
		domains: ["kemono.cr"],
		service: "dlsite",
		userID: extractNextUrlPath("maker_id", ".html") ?? extract(select(".maker_name[itemprop=brand] > a", "href"), "/maker_id/", "."),
		postID: concatOrFalsy("RE", extractNextUrlPath("product_id")?.replace(/\D/g, ""))
	})
}
function extractURLFromGumroad() {
	const json = select("script.js-react-on-rails-component[data-component-name^=Profile]")

	return compileURL({
		domains: ["kemono.cr"],
		service: "gumroad",
		userID: extract(json, '"external_id":"', '"') ?? extract(json, '"seller":{"id":"', '"'),
		postID: select('meta[property="product:retailer_item_id"]', "content")
	})
}
function extractURLFromSubscribeStar() {
	return compileURL({
		domains: ["kemono.cr", "nekohouse.su"],
		service: "subscribestar",
		userID: select('img[data-type="avatar"][alt]', "alt").toLowerCase(),
		postID: extractNextUrlPath("posts")
	})
}
function extractURLFromOnlyFans() {
	return compileURL({
		domains: ["coomer.st"],
		service: "onlyfans",
		userID: select("#content .g-avatar[href]", "href")?.split("/")[1],
		postID: select("div.b-post:not(.is-not-post-page)", "id")?.replace(/\D/g, "")
	})
}
async function extractURLFromFansly() {
	let userID = null;

	const userName = select("div.feed-item-name a.username-wrapper", "href")?.split("/").at(-1) ?? select("meta[property='og:title']", "content")?.slice(10);
	if (userName) {
		const res = await request({ method: "GET", url: `https://apiv3.fansly.com/api/v1/account?usernames=${userName}&ngsw-bypass=true` });
		userID = JSON.parse(res.responseText)?.response?.[0].id ?? null;
	}

	return compileURL({
		domains: ["coomer.st"],
		service: "fansly",
		userID: userID,
		postID: extractNextUrlPath("post")
	})
}
function extractURLFromCandFans() {
	return compileURL({
		domains: ["coomer.st"],
		service: "candfans",
		userID: extract(select("div.v-main__wrap"), "user/", "/"),
		postID: extractNextUrlPath("show")
	})
}
function extractURLFromTwitter() {
	return compileURL({
		domains: ["nekohouse.su"],
		service: "twitter",
		userID: (select('div[data-testid="UserName"]') || select("#profile-username")) ? extractNextUrlPath("/") : null,
		postID: extractNextUrlPath("status")
	})
}


////////////// UTILITY STUFF //////////////

/**
 * get query element attribute shorthand
 * @returns {string}
 */
function select(query, attribute=null) {
	const el = document.querySelector(query);
	return attribute ? el?.getAttribute(attribute) : el?.innerHTML
}

/**
 * get string between a prefix and a suffix
 * @returns {string}
 */
function extract(string, prefix, suffix) {
	if (string == null) return null;

	let begIndex = string.indexOf(prefix);
	if (begIndex == -1) return null;
	else begIndex += prefix.length;

	let endIndex = string.indexOf(suffix, begIndex);
	if (endIndex == -1) endIndex = undefined;
	let result = string.slice(begIndex, endIndex);

	return result;
}

/**
 * get next path segment in url pathname after a prefix.
 * if prefix is blank, return the first path segment.
 * @returns {string}
 */
function extractNextUrlPath(prefix, suffix="/") {
	return extract(window.location.pathname, (prefix == "/") ? "/" : `/${prefix}/`, suffix);
}

/**
 * concatenate strings if they are truthy, otherwise return the first falsy string
 * @returns {string}
 */
function concatOrFalsy(...args)
{
	for (let arg of args) {
		if (!arg) return arg;
	}
	return args.join("");
}

/**
 * check if the creator exists on kemono
 * @returns {string}
 */
async function getCreatorStatus(url) {
	if (url) {
		const Url = new URL(url);

		if (Url.hostname == "kemono.cr" || Url.hostname == "coomer.st") {
			if (Url.pathname.split("/")[1] == "discord") {
				const response = await request({ method: "GET", url: `https://${Url.hostname}/api/v1/discord/server/${Url.pathname.split("/")[3]}` });

				if (response.status == 200) {
					let channels = JSON.parse(response.responseText).channels;

					if (channels.length == 0) return "missing";
					else if (channels.some(channel => channel.id == Url.pathname.split("/").at(-1))) return "found";
					else return "incomplete";
				}
				else if (response.status == 404) return "missing";
				else return response.status;
			}
			else {
				const is_post = Url.pathname.includes("/post");

				if (is_post) {
					const postResponse = await request({ method: "HEAD", url: `https://${Url.hostname}/api/v1${Url.pathname}` });

					if (postResponse.status == 200 || postResponse.status == 202) return "found";
					Url.pathname = Url.pathname.split("/").slice(0, -2).join("/");
				}

				const response = await request({ method: "HEAD", url: `https://${Url.hostname}/api/v1${Url.pathname}/profile` });

				if (response.status == 200 || response.status == 202) return is_post ? "incomplete" : "found";
				else if (response.status == 404) return "missing";
				else return response.status;
			}
		}
		else if (Url.hostname == "nekohouse.su") {
			const response = await request({ method: "HEAD", url: url });
			const redirectUrl = response?.finalUrl;

			if (response.status == 200) {
				if (redirectUrl == url) return "found";
				else if (redirectUrl.includes("user")) return "incomplete";
				else if (redirectUrl.includes("artists")) return "missing";
			}
			else return "missing";
		}
	}

	return 400;
}

/**
 * make a request
 * @returns {Promise}
 */
function request(details) {
	return new Promise((resolve, reject) => {
		GM.xmlHttpRequest({ ...details, headers: {"Accept": "text/css"}, onload: resolve, onerror: reject });
	});
}


/* base64 of icons */
let ICONS_B64 = {
	"kemono": "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAANd0lEQVR42uWdeZwUxRXHCxZYcFdXIQgKhCgiikaIFxpAgfUKoICKxg8iRgU/EhRFhQ+iHAmeRNTIqSIoKKgolyAkQfwY0UBAgSiKLsp9uSCwXLuz9b75Y2Z6ume6e7rn2Jldqv6aqup69X5V/erVe696lDruEjV5XRAYE/w5j9OPK/Z/xTxBEOiglFJKkAP0pvpxwn4T1gbZl4OcFAYAgfnHwzrgd/wcYh8+CRWGC6SYO6s4+71kv8EtPBguXmEUCvM5rYoyX42HJRBhX6B5uOp+S/E+elOtyrFfh7FmLgXZQk648nQ5Zq1kDo3SOJh63MYkXo4pH8QwrqdeGiieIP+MYh+mmxrIB9HVUsztaQPguiCNsgstpY1DA7su5fSa8nUMf3CzuUlPmwZaFtAwnQAwx1LaPz0A0E42xnInh6lrblSdPTaNkGLuSAMAZ4d6DxhiSCkl60IA9Egprc4csuOMFdENX7IFAEHeT1Ye0NX6XnOyMYy/G2Wt0KGykdHvb+KU9YOi7bliWPQgL3UEAIr5Y+LSV4+hjK9pbQeAHAlvujxlULMAQCc5wETqJEA5h8kijjxdHrtLrnKBQOu3E5PO3B7q4+eyVkZZnpSEe9YvB19B2W4HAIUSXMCrfNOtK/Oc+ZGd1Ix95FGXBxBkM1cnAEBtdoQY2x15nvUCYWFUTymuMIFtAEDH8PvLDJ9UG/NfV14+sHvoDKueZJO1nho6PvgZzADj+QC3RAAwGB6slJ4e+a1fNxZ/mH0Jndo8ptLfym53ThxEuyyKAwACP9LZrxLCZuPpUv4UA8AeGpg1dFkSnH0xpDcbfNG7SQ7EjvvgDhPFAL+xf/Q20yOHGMs+WxCEiZY9NP6QHjARF56lmsy29LjUAvFi8+wLAo/70PefkLKYEZcySEwAyFqnx0+Ugyay+ylkmcM62EShLzmw0/y0fiZoj3HIS+hAiWX4TTzSydXjbforpQcWwCObb2wX1g6+pxFPSqnDOpjiXR6Y5ACCiPP2JMiWKNVlvkcaJ2HzCrOTc8M6plHW0bmT9lFN55NLO8vyMddu5FrPcmBLfPniQOU2TxQa8Z3N07s4j6byi6W/w+Q5d1NDfooi/6JSnMiHTsPTEzjZ0wAHJsh+sZejOW1tJ2kFBdSK2RAXunc1ImYII5Uih/ukxFEeeNikqGOVA54BGO+h75stu0g4r+QUpRgc0+PgeAeV0hgh0l0ppWhhGBNjh/kKJ/qUA97YD3BxXIW3v+2TU6mmFL+PtnSI5uw4A5X/2MjRDiFp/hoOhwvZGLgmzlDzZKtvAFbF2/b0q7YCeho5SpHPtzF12+MvqDtsutxBy1BtN6eljGa8875AbbrIj77XwG4eo4FjnwWxdh5BNANC9eNsZNYr8QEokEO2EJwTqm9mVVyi9MSOtiawEVKU8C5wlHe4OtZrQQu+sGlfzv2h+lsIJLin6Km2A1kblvfkMMrpnC3oCZF1QA7tmeWgSfjLRTxqtk/ROnJ+NOUSrgzVn2UrGEsp8LJl/cFhEJ+bWOvgMqcbKVSKfPqxLgWsY7IezApcRQ2l6MpRmynaFt6PyGW1bQ9LPaqusskRggLTwo46cVNk2BQCsti8bbJBvkoVDGzQs2zZL+LXxhqe4PDscK+q6wuO5JebIKhGX8s2U0QuI6M2nlJm0okcanAja1K6Hqx5NU2Ncd3qoGoL7b0CcI7LDCw3y3pam03O1FOKCwnNNlsZERmWUlTjLrang33+ETGa0UL2ObTb68eNtNKF3GeRxaYUtZgUFom0CnnfR7GQ7jZmJ0UdBiWmE7qM592I4ZQ8Gz0mLJ7f9HOGv9eV5DZaWC0JQZ8rPT313ZCxTop1Auz/zTJxk11a3u0HgAYccSW8i65RBrVPBfbogd78ipzGm5QlzX6A4WZ6tHZhv5wz/dnUZ7oT19NiDOCvhvyKjT2CfIGe5WoZiD/7k2Ne3SmOrdf6NWbe6kq8NNpdQi3DfrSfXobnNR6Vy/ksCQgOcGlUf/U56ADWU34ByGWXC/ZfxLA/x9Jigfd4EzrL5wlDsDd8SjF6m+ow4muV38TLLgA8G9V2pM3pwbM/ier0S/S0wDfW4xJ3OmiR+f4BaOXiWrJIVPo6yIkp3u3H1GaI1XjlOX9i3nC5xna8C72zfW0kSIZvHAEwWYW5PsbsEMnb/PgROIURtmfRePmDCAQU2I63v9chXCkllPAQtZVSigfjA0BzF/aDVp3xLmZIuw3yNSn3/SKMiFiHbevP90b8DAP/NRQqRROn+Th2lqF4elFuv43xxsYZh57md4PkERcANtlppfYq8FyTaWEmJ8sSB3J5SilFvpvKbMnHeN7jICIm+n/5AYEjQTlPjVjTmwc7UOQttEjjvbZGpxAAVHe2Ddk+s55LfIrhDvI/HxSOcq5S5LNDipjJBAZyE7sF+dbPK6hoiwcxRL5STPQtrA4zxF8IHjW5VdydKiIB2Syf6hcYFVSLTALxbEHQz/vd/h72AEAhQxPct1dwnvI/IvMJUstGVvEWTzOAi8O2SrtU3jcxAHJcoytCIQtxownc1sFgavgcUx6P8zSD6Mb51Pf81PSEAFCKumxKo/Um6ANuqdKegh5JRscPJzoh2uzMZSk4rLrnYvqmNySXhkF9whISadvwzwIbWKgnld/DFeHDLIPSDEDQ+9w0jQBcZBMTausMs+71ZbJPlvO6HuHflZUABL+kIxQzBEBPZ2cIOeRTyO38ldZKDqefUVcQZqcjQFopxoT6v8py7uygx7A0YvjXYxW/ZhqBjIKws7xz6gGQBSEALqUV1+mRLJDVxAZQ/RJEpp2syugq2JNINKiXTVDA7VUuY5zxVpTfLdszCEFhClmvSWN6STzHnJal5nBtpRT19XP+j6Kpsu6ngPFT6aFHyyIv4pv1DhYrWsiy5Gy1CbvBC5JhXWbzo5R5Pjk+5hYq1ZKPMrIG7kwCgPd80Jlu9myZQ9naMEQWyeFMzL8gsCxh9nt4prEmHEFgtQI+xhLZm1ltQJAyzk2I/abs877hyhwGcLFF9c844wlEBVsAeCsBWkf5SA/lcvKyC4DNCbB/S1I09/FFFgFg3Of2zn795HUXxc08rd9guRzMlPgzATDJp7qbgv3KGnHdhj56qJ6VMZ1wrx+VmG5JT9k+2WTXcX/J2OEoGJjrMYbBf6yJSEDWsZjn6Mf1nGajDpGvZ2X0JfjQ72HHj5ClbbxOW8sPGZYCR70ZPemZ0PLfwoVunfaTI1mwEwzxwH49tiXY+xHuc7IEz3AOgK1QAFbTnjpB96xjAM87SfSv9cwYGxQt+Sqb9AFBArKGlUzkJfrQhRbmL1vQLempWs9Flhs3UhxrKpK5ehAbs0ZFOiZ7+Y6FTGVkgoEU0bLG/KUM+dioKGGZfoRLqKYUhVm2KhJldr99vBOvGiGWXCmH+DejuMIUdZnD91UEgJ9pRise4H2sQfT7TSE8sRoYfaoG+4LAhLCPMdCB4SwNRqrqJ902mlrmG77BI2QlhiDq/il1aKefcfVH0MuqQupxPF6Z14Ce7NdF/r0lIvMepaIiAgKZPzu6Lvp5UZdmjjjcGXcAYIipqx+CH8CwAsBUt8jsLABgKM340uqC887+SRL55NhCTg2VDrW8Uy3Il13ZDIBS5PIGYgr78hqjZNz4L2MUuUbpULNpWSnTF0KyFACllNIPR26tMdcrAM1YJ8hubrSUDjfZb88KhdUtySKmS8yRRGEAlKKNsVLF+xpowFguiDI/zTc6nxa5XcSxrJnzF7nPDgClaCiheEZ6J+N5m2fMv+nCDKOzBICd5FGTnyK7QFQ8+muU0Cc512MIAD0jSmHanhXz/4hSSul77QEI2hCSDTiYH5r/5lEdd81weAWCrAuHR0r485DzVaoTEygXeMOmZm7G599wddPFaQWkAoJ6dLfzrNJIMioKzRd4yAl9InS+qsjEsAwCIAHLlVhuoEhP8RegnzwAtdJ6M9g9z1bZkOiUIZOq9nkhMn1Jz8jIMXeKypZEg9TdCPac96cnyDJRCPpVuPwfpbIpkRPnQ4YpD6jwdw+pIiBoU5Fxhrqfyr6kn68wAL5MfXhtKtbAKWytoBegs8rOxB0VYS5leRb/JYR8lnYAAq5+/oyvgXPSrRHwnsrulF47EYe9fqYjcwDkyeY0AjBOZX+y+2R/itjf5f3qZGYheDe9Fv/sB+BM20/aJZvX+7oLnmGtMA3+5KQs+xW+BmonE3qFfQRZDVWZEm1TqxXSSVW2xJspBODDSvgPSDRJ1WUcAoldqakydiL9tqqsSVamAICD6fnXo4pZA5cl7znSz6nKnJKNJ2J7Vlp/fABQN/F/GBAE/YCq7Ckq7tDf/H9TyedfKaWoxsfRTi3ZyiJGcyNXG/kGPYpFURG9Kf7/scxB0DxyH6WsiEedjVrk0UUWGwCsUVUl6SeD9ryDPd718M1Ruoacn22qDACcRJEgMNBT67/4u0VWOSDoLgjsjP8neuRRLEiZ7V3/Si0K3xEEBsVt2TuBGO9KAcEZclCQbfHsOnwpSHHWW38TgmCYIOCq2tARLfCEqoqJXFkvyC435Ya3BNmYzGdVshuC9lIOPORYX0CZwF0VM5r/A9GLHk5tUKv1AAAAAElFTkSuQmCC",
	"nekohouse": "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAABZVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8N/mJiAAAAdnRSTlMAAQIDBAUGBwgJCgwODxITFRcZGxwdHiMkJicoKS0vMzQ2Nzk/QkNGS01PUVNZWltiY2dpb3BxcnN0dXl/gYONjo+RkpOUlZaYmZudn6Cho6SlqKmtrq+wsrS5vb7Bx8jLzM/S1Nvi5efo6evt7u/w8fP09/n+Wb4x+gAAA5lJREFUeNrtm+lb00AQxlcORWgFrQpe8b7AE+qFINYLUcS7InhWQRGsqDh/vyktoW1mNrubzQ4U3o+Z3X1/mUmf7s6TCEFqC0CrsCB/nXNGE6GkTgv2vpoNZm6FsjKx/BfLi5wxmOpVAOCduX2wBphWoKy7ZvaZqiXiARilMFWzQFp7fhpqhY867wuPXFaaL9HVugVgNjSkfyXUT4fMASCswer4oCR2EplsAwDg4Er0Vjj2/YJ0qh0AgO1+6A4Rg/eH/OhzPFbU9H9AmYyDVGR4SROgCLZlpwLrGaDADfBXy78AzDWARgTIa/i3JwHwVgMgD8w1gMYEyCn7H0gG4LUyQA6YawCNCpBdLwBZYK4BNC7AESX/48CcggT9oUfBfyZJAIUUpBL1Rw54LgugkoKFpAH+MScgansODqTaVGEhcOIPe0n/V24AyBR0O/KHx6wFKGkP6v/IHQBahJ0O/eE+awFKaotsTDovAjADFIGZwLl/3Z9SwT0AMCdgDQDkE++IaKSAxR9aAv8OHoCxAGCcBwCYK7B6XM9wAQBzAtYAwO5l/14+gIfMCajUgBvA4wTwmBMAk9wAsGYBOoR9p+u4EerUJ0STXf/DxK2m8fOA/V9nmlhxjhsA+AFgAwEscANkN3wJNAHsaz0B9HADwPDw8IBVc3/BFzoAQR1yo1pPZ3iTm7shnyMijs+aPw9kl13gBojY+Mrac/YA6P5Dn4h4CIoJA/jBbQ4ApNtycYmKDoXnqgDM11wpSqfID6c5MwBQB2iJOB7bAJC9EpKNemckaYDILpktgOg2naBHpBMDWKwG+EPWKDkAhb/K0VDE0wVIyxdf1RO19aIAPAwA3Ywuqe0WkIzukAEM1Tc8yLdyQjuGNmrUs9g9GIUClDSGDNsfu4VDAShu2Xr9y11x/EeIhT0MAOkXTsU9IHhECpV3rXEBiBtT3zfbAPgcujpGAbxUvYOYz6DG0cFLAmAXDdCFPq3m/r3Y9CnZAeZL3eBfpYs3jQFaMQCt81vl9/rGyL4JXbJZ7wS5cvmbrnvwxtQxZI+oAbAvCMxr+adqv7bTOfnXTfi0GvmhbH+KXG4mGuArnoBl/VSyvyZ5QVGrjzBr9KbJdHjSdBDsVgE4WnU41n7zn/iI4HY5+lGtm3HaHzpBhydoe8m3ke2TFntP93D7gnCnOcT/onCqevsrwrU6q+0HBIeCDzGeCi6dLdl/EJw68VtsalPx9B8Ij64BxQ+VywAAAABJRU5ErkJggg==",
	"update": "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAn1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8Kd3m4AAAANHRSTlMAAwcLExcbHyMnKzM3Oz9LT1NXW19jb3N3e4OHi4+Tm5+jp6uvs7e/w8vP19vf4+fr7/P72WaXdwAAA3ZJREFUeNrtm2tD6jAMhjsGFAQUFAVEYCoKynVb/v9vOx88yjnSrkmWrV54P697H7o0zbKi1EknfU81+tPFBv5qMx91yrOu38VgVjLRRZtXI3DpvlbcT38FnNatIuynQNEylHUPVkBWV9B+CywN7bckBcoC2Lqx3DIlLJce5JIxHgHwADHk1M7kjwZog4D6nyIK8ACPIKLtkT8SYAdSqn7cMwQ8AAjq8n35ARogAFFFSimlmoAGEPYHWP4X07rU+X/TSp0DHgAK0AbwAAkULC2R/bfjQ55tj14FAS4RIWWqAWszGYCKa/RjxT74VgAge2hy5qrc4pwAmXXnOkCk0EqcByDM2loD5C7ayAGQ2kc1CWVUxAW4to55ohWSNSaAdciZoirhANhmLuVU0xsGAL6ww2hNBpjbNjKmyADC/gsqwMSc+7j+M3IMmC/m+g/Iq+DCeG2F6d+j5wFjErxi+ncYich05Z7p32Sk4kgwAKqczch04ZTZUeDshqHgBLDqgQfDdYOC/I0AchOQigE88PppkVvV42E3gjmQpcQ3AKHHVYgC3xPgPQQM1dOz7xDo+AZQvyoGe74BDDvRS6kAhhfqse8Y7PoG0D9tFWZbnAC8AxQv7Rug6xtgfOwflwrwIlV0C8ZgzzdA4BugVP+Ob4BnQ+f9V733eI/Bmy/45pl8wRCoIjoLvK7VA+4JaHdrJRWbACYAz3+AbP/ogvyNExByAJgrd4r9LS6AmuAERAyAJtN/j36Y2QDcfsUVfjVlAnDLF/O3+AsywFAwB1qXk3adwhHqfwJMqABLrv+KlE+0dAKy+c/JAMzqaUf8PRkxsOH4p9SAyloF9PLhjP5AtWQifrLe6JoJADOCfZNVUjh3wwa277rPuEmYAwBizIfkYO0+WMgFAIjrrthL+DUNBgAAbjN2Hucx2IoAAADMTEuis8SfLc0LAADwOmp/jGyNccfPF0oQgCFXNtOW85diIrTyztWqfP9/ANpKqaW0f4AHeKt/o7L9PwDe19hlqfN/ADgk66qYPe4wmj6eqq2M/yOhof3pUfUl/LH/O9LGR5X7Xwb4nrQ2h0ornz/hlUqnhB4XUgtKGZdR9Q2ZB+oFe4Fduv1KuBUZ0pLzVBWg1hpbLNRVUardO91Nx5SEP8FNbJVnfFdXpakzmh/+9rqY9hvqpJO+p/4AeTGo5zZFcEwAAAAASUVORK5CYII="
}
ICONS_B64["coomer"] = ICONS_B64["kemono"]


initButtons();
