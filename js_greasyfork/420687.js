// ==UserScript==
// @name         Animeplanet Release Parser
// @namespace    http://tampermonkey.net/
// @version      0.19.1
// @description  Parse anime & manga tracking data and show it at a glance. Also link manga to asura.
// @icon         https://www.anime-planet.com/favicon-32x32.png
// @author       myklosbotond
// @match        https://www.anime-planet.com/users/*/anime/*
// @match        https://www.anime-planet.com/users/*/manga/*
// @match        https://www.anime-planet.com/anime/*
// @match        https://www.anime-planet.com/manga/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      manhuaplus.com
// @connect      manhuaplus.org
// @connect      mangajuice.com
// @connect      manga-scans.com
// @connect      asuratoon.com
// @connect      asuracomic.net
// @connect      drakescans.com
// @connect      toonily.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/420687/Animeplanet%20Release%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/420687/Animeplanet%20Release%20Parser.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

const ASURA_BASE_URL = "https://asuracomic.net";
const ASURA_PATH_PREFIX = "3882241996";

const FIREBASE_API_KEY = "AIzaSyAPDZsUrnvzudh7lsA-0BxNX7Sc_2Cxv38";
const FIRESTORE_URL =
	"https://firestore.googleapis.com/v1/projects/mb-animeplanet-data/databases/(default)/documents";

const MANGA_INDICATOR_EXCEPTIONS = [
	{
		mangaId: "67602",
		maxCount: "106",
		siteCount: "107",
	},
	{
		mangaId: "30886",
		maxCount: "*",
		siteCount: "*",
	},
];

const SEMI_GLOBALS = {
	mangaReadOverride: {},
};

(async function () {
	"use strict";

	setupCss();

	if (/anime-planet.com\/users\/.*\/(anime|manga)\/.*/.test(location.href)) {
		runListPageScript();
	}
})();

function setupCss() {
	GM_addStyle(`
.statusArea.hasAired::before {
	background-color: #8dea43;
	content: "";
	display: inline-block;
	width: .7em;
	height: .7em;
	margin-right: .5em;
	margin-bottom: .07em;
}

.statusArea.hasAired.finished::before {
	background-color: #6f99e4;
}

.statusArea.newEpisode {
	font-weight: bold;
	border: 1px solid #afd3f5;
	border-radius: 5px;
	margin-top: 5px;
	margin-bottom: -5px;
}

.statusArea.newEpisode.has-asura-id {
	border-color: #afd3f580;
}

.anime-release-time {
	opacity: 0.6;
	font-style: italic;
	margin-top: 5px;
}

.asura-link {
	padding: 5px;
	display: flex !important;
	align-items: center;
	border-top: 1px solid #8888;
	margin-top: 5px;
}

.asura-link img {
	margin-right: 5px;
}

.asura-link.newEpisode {
	font-weight: bold;
	border: 1px solid #afd3f5;
	border-radius: 5px;
}
.asura-link .chapter-number {
	flex: 1;
	font-size: 0.8rem;
}

.asura-link .chapter-name {
	font-size: 0.65rem;
	display: block;
}

.fetch-info {
	padding: 10px;
	text-align: center;
}

.fetch-info-2 {
	padding: 10px;
	padding-top: 0;
	text-align: center;
}

.fetch-loading::after {
	content: ".  ";
	animation: dots 3s steps(3, end) infinite;
}

@keyframes dots {
	0% {
		content: ".  ";
	}
	33% {
		content: ".. ";
	}
	66% {
		content: "...";
	}
}

.ap-increment-button {
	margin-top: 8px;
}

div.avgRating span {
	position: relative;
}

div.avgRating::after {
	content: attr(title);
	margin-top: 5px;
	display: inline-block;
}
`);
}

async function runListPageScript() {
	"use strict";

	prepareFetchInfo();

	//#region Setup sorting
	const filterSelectEl = document.querySelector(".sortFilter select");
	filterSelectEl.append(
		htmlToElements(`<option value="release">Release date</option>`)
	);

	const urlParams = new URLSearchParams(location.search);
	const isReleaseSort = urlParams.get("sort") === "release";
	if (isReleaseSort) {
		filterSelectEl.value = "release";
	}
	//#endregion

	//#region Run Anime
	const animeSettings = await getAnimeSetting();

	const animeList = document.querySelectorAll("li[data-type=anime]");

	await Promise.all(
		[...animeList].map(async (animeElement) => {
			const animeId = animeElement.dataset.id;

			const response = await fetch(
				`/ajaxDelegator.php?mode=short_stats&type=anime&id=${animeId}`
			);
			const respHtml = await response.text();

			const vdom = document.createElement("html");
			vdom.innerHTML = respHtml;

			const watchedEl = vdom.querySelector("li.status1 .slCount");
			const watchedCount = watchedEl ? watchedEl.textContent : "0";
			const watchingEl = vdom.querySelector("li.status2 .slCount");
			const watchingCount = watchingEl ? watchingEl.textContent : "0";
			const aired = watchedCount !== "0" || watchingCount !== "0";

			const statusNode = animeElement.querySelector(".statusArea");

			if (aired) {
				statusNode.classList.add("hasAired");

				if (watchedCount !== "0") {
					statusNode.classList.add("finished");
				}
			}

			statusNode.innerHTML = statusNode.innerHTML.replace(
				/[0-9]+ eps/,
				`${animeElement.dataset.episodes}/${animeElement.dataset.totalEpisodes}`
			);
			if (
				animeElement.dataset.episodes !==
				animeElement.dataset.totalEpisodes
			) {
				statusNode.classList.add("newEpisode");
			}

			const releaseTime = animeSettings.releaseTimes[animeId];
			if (!!releaseTime) {
				addReleaseTimeToAnime(animeElement, releaseTime);
			}
		})
	);

	if (isReleaseSort) {
		const sortedEls = [
			...document.querySelectorAll("li[data-type=anime]"),
		].sort(sortByReleaseTime);

		const ul = document.querySelector("ul[data-type=anime]");
		sortedEls.forEach((el) => {
			ul.append(el);
		});
	}
	//#endregion

	//#region Run Manga
	const mangaList = document.querySelectorAll("li[data-type=manga]");

	let mangaSettings = {};
	/** @type {Record<string, number>} */
	let mangaWatchedOverrides = {};
	if (mangaList.length > 0) {
		try {
			mangaSettings = await loadExternalSiteSettings();
			mangaWatchedOverrides = await getMangaReadOverrides();
		} catch (e) {
			console.log(e);
		}
	}

	const promiseList = [...mangaList].map(async (mangaElement) => {
		const mangaId = mangaElement.dataset.id;

		const response = await fetch(
			`/ajaxDelegator.php?mode=short_stats&type=manga&id=${mangaId}`
		);
		const respHtml = await response.text();

		console.log("Manga ID:", mangaId);
		const vdom = document.createElement("html");
		vdom.innerHTML = respHtml;

		const watchedEl = vdom.querySelector("li.status1 .slCount");
		const watchedCount = watchedEl ? watchedEl.textContent : "0";
		const watchingEl = vdom.querySelector("li.status2 .slCount");
		const watchingCount = watchingEl ? watchingEl.textContent : "0";
		const aired = watchedCount !== "0" || watchingCount !== "0";

		const statusNode = mangaElement.querySelector(".statusArea");

		if (aired) {
			statusNode.classList.add("hasAired");

			if (watchedCount !== "0") {
				statusNode.classList.add("finished");
			}
		}

		const totalEps = Number(mangaElement.dataset.totalEpisodes);

		const loggedReadEps = Number(mangaElement.dataset.episodes);
		const readOverride = mangaWatchedOverrides[mangaId] ?? 0;
		const readEps = Math.max(loggedReadEps, readOverride);

		statusNode.innerHTML = statusNode.innerHTML.replace(
			/[0-9]+ (?:vols|chs)/,
			`${loggedReadEps}/${totalEps}${
				readEps > loggedReadEps ? ` - ${readEps}*` : ""
			}`
		);
		if (readEps < totalEps) {
			statusNode.classList.add("newEpisode");
		}

		const toonilyUrl = mangaSettings?.apToToonilyUrl?.[mangaId];
		if (!!toonilyUrl) {
			console.log("Toonily");
			statusNode.classList.add("has-asura-id");

			await addToonilyToItem(mangaElement, readEps, toonilyUrl);
			return;
		}

		const asuraUrl = mangaSettings?.apToAsuraUrl?.[mangaId];
		if (!!asuraUrl) {
			console.log("Asura");
			statusNode.classList.add("has-asura-id");

			await addAsuraToItem(mangaElement, readEps, asuraUrl);
			return;
		}

		const drakeScansUrl = mangaSettings?.apToDrakeScansUrl?.[mangaId];
		if (!!drakeScansUrl) {
			console.log("drakeScansUrl");
			statusNode.classList.add("has-asura-id");

			await addDrakeScansToItem(mangaElement, readEps, drakeScansUrl);
			return;
		}

		const manhuaplusUrl = mangaSettings?.apToManhuaplusUrl?.[mangaId];
		if (!!manhuaplusUrl) {
			console.log("manhuaplus");
			statusNode.classList.add("has-asura-id");

			await addManhuaplusToItem(mangaElement, readEps, manhuaplusUrl);
			return;
		}

		const mangaJuiceUrl = mangaSettings?.apToMangaJuiceUrl?.[mangaId];
		if (!!mangaJuiceUrl) {
			console.log("MangaJuice");
			statusNode.classList.add("has-asura-id");

			await addMangaJuiceToItem(mangaElement, readEps, mangaJuiceUrl);
			return;
		}

		const mangaScansUrl = mangaSettings?.apToMangaScansUrl?.[mangaId];
		if (!!mangaScansUrl) {
			console.log("mangaScans");
			statusNode.classList.add("has-asura-id");

			await addMangaScansToItem(mangaElement, readEps, mangaScansUrl);
			return;
		}
	});

	const results = await Promise.allSettled(promiseList);
	results.forEach((result) => {
		if (result.status === "rejected") {
			console.log(result.reason);
		}
	});
	//#endregion

	const isManga = mangaList.length > 0;
	insertFetchInfo(isManga);

	fixFavicon();
}

//#region Fetch Info
function prepareFetchInfo() {
	const controlBar = document.querySelector("div.controlBar");

	const newDiv = document.createElement("div");
	controlBar.parentNode.insertBefore(newDiv, controlBar);

	newDiv.id = "fetch-info-container";

	newDiv.innerHTML = `
		<div class="fetch-info">Script running:</div>
		<div class="fetch-info-2 fetch-loading">Fetching info</div>
	`;
}

/**
 * @param {boolean} isMangaPage
 */
function insertFetchInfo(isMangaPage) {
	const fetchInfoContainer = document.querySelector("#fetch-info-container");

	fetchInfoContainer.innerHTML = `
		<div class="fetch-info">Fetched on ${new Date().toLocaleString("en-GB")}</div>
	`;

	if (isMangaPage) {
		const newEpCount = document.querySelectorAll(
			".asura-link.newEpisode"
		).length;
		const externalLinkCount =
			document.querySelectorAll(".asura-link").length;

		fetchInfoContainer.innerHTML += `
			<div class="fetch-info-2">New mangas published: ${newEpCount}/${externalLinkCount}</div>
		`;
	} else {
		const newEpCount = document.querySelectorAll(
			".statusArea.newEpisode"
		).length;
		const externalLinkCount =
			document.querySelectorAll(".statusArea").length;

		fetchInfoContainer.innerHTML += `
			<div class="fetch-info-2">New animes aired: ${newEpCount}/${externalLinkCount}</div>
		`;
	}
}
//#endregion

/*
    _          _
   / \   _ __ (_)_ __ ___   ___
  / _ \ | '_ \| | '_ ` _ \ / _ \
 / ___ \| | | | | | | | | |  __/
/_/   \_\_| |_|_|_| |_| |_|\___|
*/
//#region Anime

/**
 * @param animeElement {Element}
 * @param releaseTime {string}
 */
function addReleaseTimeToAnime(animeElement, releaseTime) {
	const releaseTimeItem = htmlToElements(`
        <div class="anime-release-time">
            ${releaseTime}
        </div>
    `);

	animeElement.appendChild(releaseTimeItem);
	animeElement.dataset.releaseTime = releaseTime;
}

const dayToNum = {
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6,
	sun: 7,
};

/**
 * @param {Element} a
 * @param {Element} b
 * @returns {number}
 */
function sortByReleaseTime(a, b) {
	const [dayA, hourA] = a.dataset.releaseTime?.split(" ") ?? [];
	const [dayB, hourB] = b.dataset.releaseTime?.split(" ") ?? [];

	const dayNoA = dayToNum[dayA?.toLowerCase()] ?? 0;
	const dayNoB = dayToNum[dayB?.toLowerCase()] ?? 0;

	const dayDiff = dayNoA - dayNoB;

	if (dayDiff !== 0) {
		return dayDiff;
	}

	return hourA?.localeCompare(hourB ?? "") ?? 0;
}

async function getAnimeSetting() {
	try {
		const response = await fetch(
			`${FIRESTORE_URL}/animeSettings/idReleaseMapping?key=${FIREBASE_API_KEY}`
		);
		const idReleaseMappings = await response.json();

		return {
			releaseTimes: firestoreStrFieldsToObject(idReleaseMappings),
		};
	} catch (error) {
		console.error("Failed to get anime settings:", error);
		return {
			releaseTimes: {},
		};
	}
}
//#endregion

//#region Manga
/*
 __  __
|  \/  | __ _ _ __   __ _  __ _
| |\/| |/ _` | '_ \ / _` |/ _` |
| |  | | (_| | | | | (_| | (_| |
|_|  |_|\__,_|_| |_|\__, |\__,_|
                    |___/
*/

/**
 * @param mangaElement {Element}
 * @param mangaScansUrl {string}
 */
async function addToonilyToItem(mangaElement, readChapters, toonilyUrl) {
	console.log("Toonily", toonilyUrl);
	const response = await promisifyGMRequest({
		url: toonilyUrl,
		fetch: true,
	});
	const respHtml = response.responseText;

	const vdom = document.createElement("html");
	vdom.innerHTML = respHtml;

	const latestChapterEl = vdom.querySelector("ul.main.version-chap li a");
	const latestUrl = latestChapterEl.href;

	const [, chapterNo] =
		latestChapterEl.textContent.match(/(chapter\s*[\d.]+)/i) ?? [];

	const iconUrl =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABxUlEQVR42u2XTUsCURSGXeUvqP5IEVGbKIOo6AuiiCAI2rSpbS0iM4IUogJbJhToIpfhIihNUSMqSSqFFqEk+UHZIs0c5+0MjGDjNRm/VnPgWc29cx7OvRfOURWGo22wieglDokQwROoEp4IEybx32oVK+hDM6El4gTqRILQE62s5EcER6DOcISFaCksu1aa3E64+qZwt7SGoG4Pwc39ivEvr8PRMSyVMBBqQaCXVXbPxAJi3htkvzPgeR7VRPLWD2f3uLQScUKjEi8c/tA+hJdjq5i4+og5r3DZOcI6DrMgEJJ+cHaN4f3ah1rETyqFh40d2Nn3ISwI8CyB2JkT6UiUCfeVQmEIlcp8JIvWfQae8ag3wtE1WvKJCgJg4e6fgXdojknUdoHCyHEcnraNRetcfdN0nP+/ClFAHhGrrUjgfmWrxHpFQBFQBBQBRUARUATKC/CNE2A3JGG5G19PTisUYLdkJrkbg/oD8LlcLQTM+bY8IWeje2AWb+cuZFNpoR+sVCCRb8vVhF7uVOTqmYRvcRUB3S6ChGd0vtwe9mAiTkethKWBo5mVNR+2EIYGDKcGMXlxiMehIcxEuMbjuZnQSMfzX6N64cJA0hmIAAAAAElFTkSuQmCC";
	appendMangaUrl({
		mangaElement,
		chapterNo,
		readChapters,
		latestUrl,
		iconUrl,
	});
}

/**
 * @param mangaElement {Element}
 * @param asuraUrl {string}
 */
async function addAsuraToItem(mangaElement, readChapters, asuraUrl) {
	const response = await promisifyGMRequest({ url: asuraUrl, fetch: true });
	const respHtml = response.responseText;

	const vdom = document.createElement("html");
	vdom.innerHTML = respHtml;

	const latestChapterEl = vdom.querySelector(
		".overflow-y-auto.scrollbar-thumb-themecolor > div:first-child a"
	);

	/** @type {string} */
	let latestUrl = latestChapterEl.href;
	const currentPath = window.location.href.replace(/\/[^/]*$/, "");
	if (latestUrl.startsWith(currentPath)) {
		latestUrl = latestUrl.replace(currentPath, `${ASURA_BASE_URL}/series`);
	}

	const chapterNoText = latestChapterEl
		.querySelector("h3")
		.textContent.trim();

	const chapterParts = chapterNoText?.match(/^(\w+\s*[\d.]+)(.*)$/) ?? [];
	let [, chapterNo, chapterName] = chapterParts;
	chapterName = chapterName?.replace(/^\s*-\s*/, "");

	const needsWait = !!latestChapterEl.querySelector("svg");

	const iconUrl = `${ASURA_BASE_URL}/images/logo.webp`;
	appendMangaUrl({
		mangaElement,
		chapterNo,
		readChapters,
		latestUrl,
		chapterName,
		iconUrl,
		needsWait,
	});
}

/**
 * @param mangaElement {Element}
 * @param drakeScansUrl {string}
 */
async function addDrakeScansToItem(mangaElement, readChapters, drakeScansUrl) {
	const response = await promisifyGMRequest({
		url: drakeScansUrl,
		method: "POST",
		fetch: true,
	});
	const respHtml = response.responseText;

	const vdom = document.createElement("html");
	vdom.innerHTML = respHtml;

	const latestChapterEl = vdom.querySelector(
		"#chapterlist li:last-of-type a"
	);
	const latestUrl = latestChapterEl.href;

	const chapterNo = latestChapterEl
		.querySelector(".chapternum")
		.textContent.replace(/\s+/g, " ")
		.trim();

	const iconUrl =
		"https://i0.wp.com/drakescans.com/wp-content/uploads/2023/08/cropped-dragonlogo-min-1.png?fit=32%2C32&ssl=1";
	appendMangaUrl({
		mangaElement,
		chapterNo,
		readChapters,
		latestUrl,
		iconUrl,
	});
}

/**
 * @param mangaElement {Element}
 * @param manhuaplusUrl {string}
 */
async function addManhuaplusToItem(mangaElement, readChapters, manhuaplusUrl) {
	console.log("ManhuaPlus", manhuaplusUrl);
	const response = await promisifyGMRequest({
		url: manhuaplusUrl,
		fetch: true,
	});
	const respHtml = response.responseText;

	const vdom = document.createElement("html");
	vdom.innerHTML = respHtml;

	const latestChapterEl = vdom.querySelector("li.chapter a");
	const latestUrl = latestChapterEl.href;

	const chapterNo = latestChapterEl.textContent.replace(/\s+/g, " ").trim();

	const iconUrl =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAPsklEQVR4Xu2dB7AkVRWGZ4YsgkRhAVniAkKxApIkSEZxJQpigSwCIohQiKIoFCBBJIOCgkpUscgCokt0yTnLIklYyUgOq6Rz/e7MvNl+73Xf0HPerl19u6qrtt6ce+45//nvubm32UhPrRFo1tr75HwjEaDmJEgESASoOQI1dz9lgESAmiNQc/dTBkgEqDkCNXc/ZYBEgJojUHP3UwZIBKg5AjV3P2WARICaI1Bz91MGSASoOQI1dz9lgESAmiNQc/dTBkgEqDkCNXc/ZYBEgJojUHP3UwZIBKg5AjV3P2WARICaI1Bz91MGSASoOQI1dz9lgESAmiNQc/dTBkgEqDkCNXc/ZYBEgJojUHP3UwZIBKg5AjV3f5pmANNof5JmNO+yvMvx3sAf7q15DKar+yNCAAI9G16NaQe61bLBXrZhjA34mEazaX8beM5siuyqjQD170S95wTpNWZy05jFgmS7QuifH/0vx5TJlTVG+PsU3td5nwGbSQ2RO/j3BALzbN/6AxSoEQBQNsGBfbutezT/bnnrN+ZViLEgRnzolY0QMM3mROr/fFARY56FAJ8Kkp1KgDkhwJsxZaJljbkFbE6h3AXgY4kyIo8mAQ4AlKOirRTZGCOujS5XUAAiLkXwH+MN882Y5yHAwjH1U8cs+PrfmDKlZY15CCLsgTO3ltbhKBgGUkDNgHIQoBweIDpU5HS6gT1KlMstYlqtn/LDj4L1GfMiBBgVLI9geyzTao1YqxxmizEfQYJDCdYRMXaGyOoRoNU6hAoPDal0kIwxL+PcKI00R2BmoOX/i3ehYDuM+TcE+GSwfFeQbuY96pk5tlyf8mcwRvgmWOGqzqNJANv6Dypllsj6GDKxVNlMIVAZR8u8IkoP4xAIMF9UGZsFms23IMAcseUU5I8lY/5AQU9bhSYBbP9/QEnDTsWp75Qs2ytGUC4lKFtG6THmdQgwT1SZDgFeoa55Y8upyItsSeAu09ClSYBjMGj/UkYZ8wLdwML9pDZa/wIE5FneGaNsMOYtCPCJqDIdAjwX1dXEVuCSN+Y58FoGvN7tV60mAU7AmO+WNkhkbYy5pWx5CLA/6d+SMO4x5h0IEJ3KIcA/IcDi3spEbKOw07mBZwb+MRevzR4rY/O6BHM7dM3u1ZUVoBsAr2OjyuQIaxLg5+jfuw+DTqIbKE0gAvIIINpFp7jHmCkQIA78TgYIq09kT0A+zdmgLSFarcOi8DPmGYizWL+DZ00CnIoD345DPyPdcWh0mW6A1r8WAN5cqm5j3oMAs8aWhQD3Q7ix3nIiu+DTWV45S6pGY1f8+G2IbFumz6xpVWgS4HT07R5sfJ6gyBoYZJdCox7m/mdS4BtRhQaEjfkAAkRP5yDAHRBgNW+dIjvg03leua4AvsTgeDhZ8+BQ3XlymgSwzO13Xf84HIoaSNJqPk4gXozuQ6cS4CMIEDdwtK212byROtfxgi+yDSBf4pUbIECjsTB6n+SdxVvGmKuxfVOvnENAkwBnU894pzHG2KlT8ZzbmKdwaIkYhyDAbqTN3+SWsYtMzaZ3kQfSReMAAa5F94ZeW0XGofxKr1xGAN0T0O0PbAm8htoR7XiRI6Su3/PbDoWO2p2vZtMOhtzjBJHPYtQ9oYAB1m3oXWOYvDH/4e82K/kHpiKt2LEH9V6J/s28dopshO7rvHJZAjQaB0Jq/7Jvye4ra4smAf6I4u0dBHiXQd6XcGyiB4yjaJE/DgGM1r8c+iYVyJ7PIOkBfrd7A+5HZEaA+Mgnlv0dAlwCAbbylhFZB91RA1T82hG7f+fVbQVEZkX/e0GyOUJ6BGg2LwSQrzgI8AoEGFisKd58MeZxugF7lsD7kHWOQ+h7uYIiX+bvSwDkyV5FIrMAxPteuWwrbbXchB+QFVkN3XdF6W40NsPusG5DZA70vxOjPyurSQD3Mmx3352g/QID3Mu+ImMx7EGXU7SSmborf8P7eDvW6Ozw7Vw4PsgqF5mN+qK2d/HjbFS4xzydFroiuh+KCRC+bYHdf/KWMcbgp81epXcmNQlwOQGxrS7/6bZsnFsH5270OOed3qBna/RcXKCnvbeAzNeQ8U/BRGYHCHsyJ/gJnq6J2CXbx4IVI4jd47HbEsz9QHSy5fw+MdfvmgT4CwT4ooMAD2Ls2PZeemfNvnjL1phHkP20MwO4BmHd9QTq2hwg/ZsmInMCxNsxQAZlsk4GsKt1k6N0h56tMOZWcForRvdQWU0CXEVQN3EQ4A6MbY/WAc/2y/s4DRdZHuNyB3gE1s6VJ/PadfXBT2YMgdxGEOAaL0Aic1FX1BEv5/gjW6GIPfL2kteGjAADzMvwbfOAMieT6ewxvNKPJgGuw+gNHASYCAHWbxMgZOlW5BCMs+vjw2PsniYdCig/6dazJgTwH6USmYe67MHM4AcCHImwf7YiMje63whVDDazguPzvHN7yzDQRfefvXIOAU0C3IDR6zoIMAECtLuIbjdgT+4s4pBvdxlDf++WfZyyS+aWFVkKp57s1rMiBHjAC5DI/JR5xSuXbaWNxsHobhPN+UQOMIOngMa81j1JFTV7GWqrJgFuJijF/ZExlxLQrQcMoAWdyL/d6UtkDAY+njUagNYH+OtzQTfmNur4XK+ORmNJZJ/wxYh+egHqiTrmjR0/RPfPAnQHLzKhc3YwfIh3ca/eRuN4Mt33A+ScIpoEuB3DV3fUdh4G91YKcdafnlkQwsBBJ42dK44ieyH/ywwBRhGk570gidgziS965QZngH3RbUlc/ESs1IFHC33noqx4NbXnmJlC6188lrR5hmoS4G4IsIoDjjMgwG6Z4NjZwNO8ixaWMeZeWnRPJyDN1e0fs5dLOsUBu5sSX83UEXZ+X8SeRvITZTAB9iRgPbIVZKS3sX9OH7Hwa772MnmzuY1Ptv270mEQq0qTAPfhwGccDpwCAQaty9Oaj0d+P6fTIktg5FPtGNt9hFbLnjsY/hhzOWBvkf0B+RmQ9186EVmUOp4JAr8rFLR3XzBPp6zdfbTz92WwbxzE3RXs7Ckh/0M3h7xdXo5aui5SrEkA23et4PBg2FYvQKwOALd7CNA7+sT06B7qWDlXXmQ7nLlw6G9Bx7fLzdXD1+v9YQ2T6JydXAU/Xwgr4JfSJMAkgmPv/xU9uat7BMh2A6MLSxlzJy17dcgyFrLcX9D63+xeMRu2nIv+17xTqkyW8UPWkcCebbHnglD5vuU61+g2IGDOJfLYejQJYK9jLV1oQM6Arg1kq2UPNhaPZjvr3aMB2x4UKdraHTS+yNoAAeyly+LpphUWWRog/LOFjOLgVcbYiOTJc30NDDbDRv+UNrI+TQK4T8ly4JPKThqWohuNVQnunU67jbHz+lEE8mO5co6LJRDgUcq5dxfLrddvit0TIvGOFzfmLoK/NdiNyG1hTQLYpdniEb3jdGzwEev81uE8TIrue7FrJSfyIssBxD9iokMGWA8C/C2mTJSsMe9j9zFkp8Ow7YOoshHCmgRwX5QQ2ZnKzsmNYat1NH8ve93paGYXhTeSIMBNALm2hwArYNvDEbjZMYB/HSNG4YCsvQjabF5E4A+K7ZbKVKdJgJcwvPj8nchXqSx30ASYq9Ca7i7jAEA5gwcB3JtUnTFAmT378jbnZ7KHu4E/C5wml8KiRCFNArjvyonYfuzSIhsJ1BOF6/uFhcz9zBCc6R297nMKHQKsjG33xeAHaVeAtO6DHlw9R+fQgZtdl7DnFV+n3qf59yO8t1F/1EpkjK0uWU0CvIFTxXfsRLansvMLY9n5uETc5VLWwtFpF5MKHwjgPqfQIcCG6MnfXyjQDAHGQIBHnYHIWZzSCpyWHk0CfAgBhu/PD1gqMp7K7Fp37gOgKwFo+Aej7CljYxbxLYpAgGuwayMnYAWLSE5iudYlBgoacz0Zyn90XCuaJfSoEKC9i9VquQ8miuxOZfnn97uGEyz3WkLWQWOuAdziAyhTdfq/FxRwf28otvi8Nj7f5MkA7UWsEnGZZkW0CLAQYDznaWV7U1n2luww8eBDFp207cwovUbYbN5CBuhtEefa2Blx2wMewQ8E+AI+/9VDAO/RtuAKR0hQiwCu8/kd00P665C0anVxo9ceMcd473FossqdEGBVD34nMpV0b0oNURC0FMyFVzJA8drICAU1Rq0WAUI2dQ6kMv8ljRjrA2QhgG+X0mo5FwKMD1DXE4EAu5ABzvBkgFJfH4mxo19ZLQJsAhhXeYw5DJAP6dfg2PIQ4O9kgOU9gbqSljouRjcE2Aef3ZdOIg6ExNStKatFgJCdMeeKnaZTWV1BewFDjpKF2AIBwu7v9Xl1K8SWfmS0CBDyYYO+vgBS1smgfQZjHiMDLBNTBwPWsHULkfkAuXdKKaaOaSGrRYD9SIfOBRmc+RVdQPkviJREI2g7uMSn4iCAndHs5TWrxGETr05FAR0CdI5H+75UMSIfhvZhAQHsxyMW8IwB7KLSTIARfMcOApyDzp189fv2KrzlR1hAiwD+I96Nxh/IADuOsD/D1EOAVyGA/zuAIvMCxmuh9qH3YvT2jrkXliv52ZtQO/qV0yKA/xs9xlxEP7ttvwbHlidQYV/0zLmD4KoLvVdDgI299ih/DNtbX6SADgFCWoMxV0CAkPtukS64xQmU3XnzfwVMZE3AcB9QzVSF3lvRu6bXWJGt0Ou/6u1VNDICWgTwb7gofNCoDAQEyr1JNaA08ls+6PWdgu5oFvk6INvP5/xfPloE8C+3GnMDGWC9aYkCc/Xwz7oH7i0M2O89zTyVWN4PRU5LTIbWpUUA/8FLY26HAP6UqYgGBJiZ6WnY93PYCwAM91WvwV1A2MeiFW/xKELTU6VFgBfoDxd0GmjMfRAg/1LHSHiGzqBt6ql1H8ksJfhz90EXTjq6p8sSeCikWgSYAgGG39fLWmHMJAjgXpMPtTpQrn2XsNUKvfd/GgTYM0Q1emdCb+i17BPQm/8hq5DKRlimbwK077m1Wv5jy5zthwBLjbA/g9RjW8z/7nUhgdouxD70zoPPocu7v0bvt0L0Tg+ZvgkwPYxOdeohkAigh2UlNSUCVDJsekYnAuhhWUlNiQCVDJue0YkAelhWUlMiQCXDpmd0IoAelpXUlAhQybDpGZ0IoIdlJTUlAlQybHpGJwLoYVlJTYkAlQybntGJAHpYVlJTIkAlw6ZndCKAHpaV1JQIUMmw6RmdCKCHZSU1JQJUMmx6RicC6GFZSU2JAJUMm57RiQB6WFZSUyJAJcOmZ3QigB6WldSUCFDJsOkZnQigh2UlNSUCVDJsekYnAuhhWUlNiQCVDJue0YkAelhWUlMiQCXDpmd0IoAelpXUlAhQybDpGZ0IoIdlJTUlAlQybHpG/w81vFHMow4RoQAAAABJRU5ErkJggg==";
	appendMangaUrl({
		mangaElement,
		chapterNo,
		readChapters,
		latestUrl,

		iconUrl,
	});
}

/**
 * @param mangaElement {Element}
 * @param mangaJuiceUrl {string}
 */
async function addMangaJuiceToItem(mangaElement, readChapters, mangaJuiceUrl) {
	console.log("MangaJuice", mangaJuiceUrl);
	const response = await promisifyGMRequest({
		url: mangaJuiceUrl,
		fetch: true,
	});
	const respHtml = response.responseText;

	const vdom = document.createElement("html");
	vdom.innerHTML = respHtml;

	const latestChapterEl = vdom.querySelector(".chapterslist li a");
	const latestUrl = latestChapterEl.href;

	const [, chapterNo] =
		latestChapterEl.textContent.match(/(chapter\s*[0-9.]+)/i) ?? [];

	const iconUrl =
		"https://mangajuice.com/wp-content/uploads/2023/11/manga_juice_fav.png";
	appendMangaUrl({
		mangaElement,
		chapterNo,
		readChapters,
		latestUrl,
		iconUrl,
	});
}

/**
 * @param mangaElement {Element}
 * @param mangaScansUrl {string}
 */
async function addMangaScansToItem(mangaElement, readChapters, mangaScansUrl) {
	console.log("MangaScans", mangaScansUrl);
	const response = await promisifyGMRequest({
		url: mangaScansUrl,
		fetch: true,
	});
	const respHtml = response.responseText;

	const vdom = document.createElement("html");
	vdom.innerHTML = respHtml;

	const latestChapterEl = vdom.querySelector(".chapterslist li a");
	const latestUrl = latestChapterEl.href;

	const [, chapterNo] =
		latestChapterEl.textContent.match(/(chapter\s*[0-9.]+)/i) ?? [];

	const iconUrl =
		"https://manga-scans.com/wp-content/uploads/2022/09/MANGA-SCANS-150x150.png";
	appendMangaUrl({
		mangaElement,
		chapterNo,
		readChapters,
		latestUrl,
		iconUrl,
	});
}

/**
 * @param mangaElement {Element}
 * @param chapterNo {any}
 * @param latestUrl {string}
 * @param chapterName {string}
 * @param iconUrl {string}
 */
function appendMangaUrl({
	mangaElement,
	chapterNo,
	readChapters,
	latestUrl,
	chapterName,
	iconUrl,
	needsWait = false,
}) {
	const mangaId = mangaElement.dataset.id;
	const shouldIgnoreNew = shouldIgnore({
		mangaId,
		maxCount: mangaElement.dataset.totalEpisodes,
		siteCount: chapterNo,
	});

	const numericChapterNo = Math.floor(
		Number(chapterNo.replace(/[^0-9.]/g, ""))
	);

	const newChapterReleased =
		!shouldIgnoreNew && readChapters < numericChapterNo && !needsWait;

	const iconSize = 16;
	const externalLinkItem = htmlToElements(`
        <a href="${latestUrl}" target="_blank" class="asura-link${
		newChapterReleased ? " newEpisode" : ""
	}">
            <img src="${iconUrl}" width="${iconSize}" height="${iconSize}" />
            <span class="chapter-number">${needsWait ? "⏲ " : ""}${chapterNo}${
		chapterName ? `<span class="chapter-name">${chapterName}</span>` : ""
	}</span>
        </a>
    `);

	mangaElement.appendChild(externalLinkItem);

	const totalEps = Number(mangaElement.dataset.totalEpisodes);
	const shouldShowPlus =
		totalEps < numericChapterNo && readChapters < numericChapterNo;
	if (shouldShowPlus) {
		const incButton = htmlToElements(
			`<button class="ap-increment-button">+ Chapter*</button>`
		);
		mangaElement.appendChild(incButton);

		incButton.onclick = async () => {
			await updateMangaReadOverrides(mangaId, readChapters);
			location.reload();
		};
	}
}

/**
 *
 * @param {{ mangaId: string, maxCount: string, siteCount: string }}
 * @returns {boolean}
 */
function shouldIgnore({ mangaId, maxCount, siteCount }) {
	return MANGA_INDICATOR_EXCEPTIONS.some(
		({
			mangaId: excMangaId,
			maxCount: excMaxCount,
			siteCount: excSiteCount,
		}) => {
			if (excMangaId !== mangaId) {
				return false;
			}

			const maxCountMatches =
				excMaxCount === "*" || excMaxCount === maxCount;
			const siteCountMatches =
				excSiteCount === "*" || siteCount.includes(excSiteCount);

			return maxCountMatches && siteCountMatches;
		}
	);
}

async function loadExternalSiteSettings() {
	let respJson;
	// {
	// 	apToAsura: {
	// 		73877: "101912",
	// 		66402: "132961",
	// 		65390: "49137",
	// 		75338: "116341",
	// 		65345: "49050",
	// 		54729: "90395",
	// 		74466: "107248",
	// 		78052: "160464",
	// 		59043: "31591",
	// 		75528: "119179",
	// 		80556: "182221",
	// 		64461: "46495",
	// 		72891: "96904",
	// 		59820: "33590",
	// 	},
	// 	apToAsuraUrl: {
	// 		73877: "https://asuratoon.com/manga/3882241996-to-hell-with-being-a-saint-im-a-doctor/",
	// 		66402: "https://asuratoon.com/manga/3882241996-the-greatest-estate-developer/",
	// 		65390: "https://asuratoon.com/manga/3882241996-the-dark-magician-transmigrates-after-66666-years/",
	// 		75338: "https://asuratoon.com/manga/3882241996-player-who-returned-10000-years-later/",
	// 		65345: "https://asuratoon.com/manga/3882241996-reincarnation-of-the-suicidal-battle-god/",
	// 		54729: "https://asuratoon.com/manga/3882241996-trash-of-the-counts-family/",
	// 		74466: "https://asuratoon.com/manga/3882241996-damn-reincarnation/",
	// 		78052: "https://asuratoon.com/manga/3882241996-pick-me-up-infinite-gacha/",
	// 		59043: "https://asuratoon.com/manga/3882241996-sss-class-suicide-hunter/",
	// 		75528: "https://asuratoon.com/manga/3882241996-standard-of-reincarnation/",
	// 		80556: "https://asuratoon.com/manga/3882241996-the-dark-mages-return-to-enlistment/",
	// 		64461: "https://asuratoon.com/manga/3882241996-reformation-of-the-deadbeat-noble/",
	// 		72891: "https://asuratoon.com/manga/3882241996-swordmasters-youngest-son/",
	// 		59820: "https://asuratoon.com/manga/3882241996-doctors-rebirth/",
	// 		86640: "https://asuratoon.com/manga/3882241996-martial-god-regressed-to-level-2/",
	// 		69825: "https://asuratoon.com/manga/3882241996-duke-pendragon/",
	// 		64010: "https://asuratoon.com/manga/3882241996-the-lords-coins-arent-decreasing/",
	// 		85154: "https://asuratoon.com/manga/3882241996-necromancers-evolutionary-traits/",
	// 	},
	// 	apToDrakeScansUrl: {
	// 		84564: "https://drakescans.com/series/nm-12322213232323/",
	// 	},
	// 	apToManhuaplusUrl: {
	// 		"--84564": "https://manhuaplus.org/manga/disastrous-necromancer/",
	// 	},
	// 	apToMangaJuiceUrl: {
	// 		67602: "https://mangajuice.com/manga/the-lone-necromancer/",
	// 	},
	// 	apToMangaScansUrl: {
	// 		30886: "https://manga-scans.com/manga/a-returners-magic-should-be-special/",
	// 		7810: "https://manga-scans.com/manga/tower-of-god",
	// 	},
	// };

	try {
		const response = await fetch(
			`${FIRESTORE_URL}/mangaSettings/apToExternalUrls?key=${FIREBASE_API_KEY}`
		);
		const mangaSettings = await response.json();

		respJson = Object.fromEntries(
			Object.entries(mangaSettings.fields).map(
				([externalMapName, mappings]) => [
					externalMapName,
					firestoreStrFieldsToObject(mappings.mapValue),
				]
			)
		);
	} catch (error) {
		console.error("Failed to get manga settings:", error);
		return {};
	}

	const asuraPathPrefix = await getAsuraPathPrefix();

	fixAsuraLinks(respJson, ASURA_BASE_URL, asuraPathPrefix);

	try {
		/** Used to test (via redirect) if prefix was changed again. */
		const canaryMangaId = "75338";
		const response = await promisifyGMRequest({
			url: respJson.apToAsuraUrl[canaryMangaId],
			fetch: true,
		});
		const { finalUrl } = response;

		const [, prefix] =
			finalUrl.replace(ASURA_BASE_URL, "").match(/^[\a-z\/]*(\d+)/i) ??
			[];

		if (prefix && prefix !== asuraPathPrefix) {
			console.log(`Asura churn: ${asuraPathPrefix} -> ${prefix}`);
			fixAsuraLinks(respJson, ASURA_BASE_URL, prefix);

			updateAsuraPrefix(prefix);
		}
	} catch (error) {
		console.error("Asura canary failed:", error);
	}

	return respJson;
}

async function getAsuraPathPrefix() {
	try {
		const response = await fetch(
			`${FIRESTORE_URL}/mangaSettings/asuraPathPrefix?key=${FIREBASE_API_KEY}`
		);
		const asuraPathPrefix = await response.json();

		return asuraPathPrefix.fields.prefix.stringValue;
	} catch (error) {
		console.error("Failed to get asuraPathPrefix:", error);
		return ASURA_PATH_PREFIX;
	}
}

async function updateAsuraPrefix(newPrefix) {
	try {
		await fetch(
			`${FIRESTORE_URL}/mangaSettings/asuraPathPrefix?key=${FIREBASE_API_KEY}`,
			{
				method: "PATCH",
				body: JSON.stringify({
					name: "projects/mb-animeplanet-data/databases/(default)/documents/mangaSettings/asuraPathPrefix",
					fields: {
						prefix: { stringValue: newPrefix },
					},
				}),
			}
		);
	} catch (error) {
		console.error("Failed to update asuraPathPrefix:", error);
	}
}

async function getMangaReadOverrides() {
	try {
		const response = await fetch(
			`${FIRESTORE_URL}/mangaSettings/watchedOverride?key=${FIREBASE_API_KEY}`
		);

		const mangaReadOverrides = await response.json();

		SEMI_GLOBALS.mangaReadOverride = mangaReadOverrides;

		return firestoreNumFieldsToObject(mangaReadOverrides);
	} catch (error) {
		console.error("Failed to get watchedOverride:", error);
		return {};
	}
}

async function updateMangaReadOverrides(mangaId, readChapters) {
	try {
		SEMI_GLOBALS.mangaReadOverride.fields[mangaId] = {
			integerValue: readChapters + 1,
		};

		await fetch(
			`${FIRESTORE_URL}/mangaSettings/watchedOverride?key=${FIREBASE_API_KEY}`,
			{
				method: "PATCH",
				body: JSON.stringify(SEMI_GLOBALS.mangaReadOverride),
			}
		);
	} catch (error) {
		console.error("Failed to update watchedOverride:", error);
	}
}

/**
 * @param {*} respJson
 * @param {string} baseUrl
 * @param {string} pathPrefix
 */
function fixAsuraLinks(respJson, baseUrl, pathPrefix) {
	Object.keys(respJson?.apToAsuraUrl ?? {}).forEach((mangaId) => {
		const savedUrl = respJson.apToAsuraUrl[mangaId];
		const path = new URL(savedUrl).pathname;
		const correctDomainUrl = new URL(path, baseUrl).toString();
		const correctPathUrl = correctDomainUrl.replace(
			/\/\d{8,12}/,
			`/${pathPrefix}`
		);

		respJson.apToAsuraUrl[mangaId] = correctPathUrl;
	});
}
//#endregion

/*
 _   _ _   _ _
| | | | |_(_) |___
| | | | __| | / __|
| |_| | |_| | \__ \
 \___/ \__|_|_|___/
*/
//#region Utils

/**
 * @returns {Record<string, string>}
 */
function firestoreStrFieldsToObject(response) {
	return Object.fromEntries(
		Object.entries(response.fields).map(([key, field]) => [
			key,
			field.stringValue,
		])
	);
}

/**
 * @returns {Record<string, number>}
 */
function firestoreNumFieldsToObject(response) {
	return Object.fromEntries(
		Object.entries(response.fields).map(([key, field]) => [
			key,
			field.integerValue,
		])
	);
}

async function promisifyGMRequest(setting) {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			...setting,
			onload: (response) => {
				resolve(response);
			},
			onerror: (error) => {
				reject(error);
			},
		});
	});
}

/** `GM_xmlhttpRequest` overwrites the favicon to asure's, so fix is needed. */
function fixFavicon() {
	document.querySelectorAll("link[rel=icon]").forEach((faviconEl) => {
		faviconEl.href = faviconEl.href;
	});
}

/**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 * @source https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
 */
function htmlToElements(html) {
	const template = document.createElement("template");
	template.innerHTML = html;

	return template.content.children[0];
}
//#endregion
