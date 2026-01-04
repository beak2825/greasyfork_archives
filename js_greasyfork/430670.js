// ==UserScript==
// @name        HoverBabe
// @namespace   Empornium Scripts
// @description Hover over performer tag and get their Babepedia Bio.
// @version     1.36.1
// @author      vandenium
// @include     /^https://www\.empornium\.(me|sx|is)\/torrents.php/
// @include     /^https://www\.empornium\.(me|sx|is)\/top10.php/
// @include     /^https://www\.empornium\.(me|sx|is)\/requests.php/
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_info

// @downloadURL https://update.greasyfork.org/scripts/430670/HoverBabe.user.js
// @updateURL https://update.greasyfork.org/scripts/430670/HoverBabe.meta.js
// ==/UserScript==
// Changelog:
// Version 1.36.1 - 2025-09-27
// - Fix cache purging issue when localStorage is full. This was preventing
// biobox from displaying if localStorage full.
// Version 1.36.0 - 2025-09-10
// - Added similar performers section to bio box.
// Version 1.35.0 - 2025-08-11
// - Fix the Turnstile check logic, it was returning false positives.
// - Add a cooldown period for the Turnstile check to prevent excessive requests.
//   - Only check once per hour for Turnstile
//   - If detected, disable for 12 hours
// Version 1.34.0 - 2025-08-05
// - Disable Hoverbabe for 12 hours when Cloudflare Turnstile is detected.
// Version 1.33.3 - 2025-07-23
// - Fix headers sent in GM_xmlhttpRequest
// - Display message when Cloudflare Turnstile is detected.
// Version 1.33.2 - 2025-07-23
// - Display alert when performer update happens.
// Version 1.33.1 - 2025-07-22
// - Fix minor display issue
// Version 1.33.0 - 2025-07-22
// - Fixes for Babepedia's UI update
// - Biobox is now always centered and draggable
// Version 1.32.3
// - Fix issue of not displaying if no birthplace property.
// - Fix additional birthplace formatting issue.
// Version 1.32.2
// - Fix status indicator reporting 0 performers on the torrent details page.
// Version 1.32.1
// - Add Babepedia, Boobpedia links
// - Update external links text
// Version 1.31.0
// - Remove extraneous alias section
// - Link performers in status area
// - Update status area font
// Version 1.30.1
//  - Fix the performer name in XHR URL.
// Version 1.30.0
//  - Add searchable Links section
//  - Remove HB's gallerybanner section in the About section
// Version 1.29.1
//  - Fix issue of not getting secondary image if no primary image.
// Version 1.29.0
//  - Add About section to the bio box.
//  - Add max height and scrolling to bio box sections.
// Version 1.28.0
//  - Add option to click instead of hover to open the bio box.
//  - Remove "Enable Hover functionality" option. This is replaced by above.
// Version 1.27.0
//  - Store performers in tag name format, lowercases and dots.
//  - Fixes issue of not recognizing single names with both upper and lower case letters.
// Version 1.26.0
//  - New feature: If no primary image exists in Babepedia, try to get first user-uploaded image.
// Version 1.25.0
//  - New feature: Add link to actor titles on Empornium.
// Version 1.24.0
//  - New feature: Complete overhaul of image caching.
//    - More cache - utilize both local and session storage to cache more actor images.
//    - Smarter caching to cache more actors longer.
// Version 1.23.0
//  - New feature: User-defined aliases (in Settings). This feature allows you to create
//    multiple aliases to your favorite actors.
// Version 1.22.4
//  - Bug fix: On torrent title page, lazy load actor data when number of actors in torrent
//    is greater than 10.
// Version 1.22.3
//  - Bug fix: Set font color in the settings dialog, text not visible in lighter themes.
// Version 1.22.2
//  - New feature: Changing layout of bio box inner content from flex to grid.
// Version 1.22.1
//  - Bug fix: Fixed issue of initial hovers after install not displaying bio box.
// Version 1.22.0
//  - Bug fix: Fixed issue of the actor tag indicator and hover functionality breaking
//    when sorting tags on the torrent page.
//  - New feature: If no IAFD page found, don't continue to make requests for it when
//    displaying the bio box.
// Version 1.21.2
//  - Bug fix: Fixed issue of the actor tag indicator and hover functionality breaking
//    when adding new tag on the torrent page.
// Version 1.21.1
//  - Bug fix: Fix tag sorting for warned torrents on search results page.
// Version 1.21.0
//  - New Features: Formatting updates: Birthdate, age, aka.
// Version 1.20.0
//  - New Feature: Bio box design updates.
//  - Bug fix: Fix not being able to click close icon.
// Version 1.19.0
//  - New Feature: Camera icon now flashes indicating it's downloading bio.
// Version 1.18.0
//  - New Feature: Filter out known non-actor tags.
// Version 1.17.0
//  - New Feature: Option to enable/disable tag highlighting in Settings menu in addition to
//    setting the color.
// Version 1.16.0
//  - New Features:
//    - Close bio on scroll.
//    - Hovering over actor closes open bio.
// Version 1.15.0
//  - New Feature: Bio popup now includes IAFD link to actor.🎉
// Version 1.14.0
//  - In settings, replaced text input with color input for tag highlight.
// Version 1.13.0
//  - Issue with sleazyfork.org and 1.12.1, just bumping version.
// Version 1.12.1
//  - Bugfix. Request page not respecting 'sort actors first' option.
// Version 1.12.0
//  - Now works on Uploaded Torrents page.
// Version 1.11.0
//  - Now works on the Requests page.
// Version 1.10.3
//  - Bugfix. Typo in code.
// Version 1.10.2
//  - Bugfix. Prevent excessive server calls and issue of bio dialog remaining open.
//  - Code cleanup.
// Version 1.10.1
//  - Bugfix. Update tag selector on search results page to work with Tag Highlighter.
// Version 1.10.0
//  - Add Settings dialog box.
//  - Configurable settings:
//    - Show/hide status area
//    - Enable/disable hover functionality
//    - Sort actors with bios to beginning of tags list
//    - Set highlight color
//    - Fix version check code.
// Version 1.9.1
//  - Fix issue of bio extending beyond top of viewport. Open bio under tag
//    if it will extend beyond top of viewport.
// Version 1.9.0
//  - All actor tag highlighting (camera icon) instantaneous on page load.
//  - Add version update functionality.
//  - Display version and days to next update.
// Version 1.8.1
//  - Refactor and clean up tag processing/caching code.
// Version 1.8.0
//  - Performance improvement. Speed up tag searches by caching actor tags as well as non-actor tags
// Version 1.7.2
//  - Bugfix. If "Age" field was not present, bio data would not display.
// Version 1.7.1
//  - Fix for nasty Tampermonkey issue of it not saving entire responseObject from page request
//    This caused invalid page data being saved to page cache. (First hover OK, 2nd hover error.)
// Version 1.7.0
//  - Persist excluded tags in localStorage to speedup the tag search of actor list.
//  - Refactor arrays to Sets for performance.
// Version 1.6.0
//  - Remove highlighting of tags, just use indicator (camera emoji).
// Version 1.5.2
//  - Handle case of page but no bio area.
// Version 1.5.1
//  - Fix issue of caching unavailable Babepedia bio page.
//  - Don't continue to request unavailable pages.
//  - Fix status area placement.
// Version 1.5.0
//  - Status container now always in lower right corner.
//  - Position it above alerts, if alerts present.
// Version 1.4.0
//  - Enable on Top 10 pages.
// Version 1.3.0
//  - Hoverbabe now works on Search and Notification pages.
//  - Update tag highlight style.
//  - Updating status area style.
// Version 1.2.0
//  - Add debut year and debut age to bio data.
// version 1.1.0
//  - Handle scenario when no image available.
// Version 1.0.2
//  - Add increased height back to status area.
//  - Move status area inner style to outer container.
// Version 1.0.1
//  - Remove height from status area.
// Version 1.0.0
//  - The initial version.
//  - Features
//    - Babepedia actress bio pops up when hovering over an actress tag on the torrent page.
//    - Bio includes actress image and data.
//    - 📸-indicator next to actress if bio is available.
//    - Available actresses are downloaded from Babepedia once a month.
//    - Babepedia images and page data are cached locally for performance and reduced network activity.
//    - Caches cleaned periodically based on time in cache (page data) or cache size available (images).
//    - Works with Emp++ Tag Highlighter (https://www.empornium.is/forum/thread/78406)
//    - Tested in multiple browsers
//    - Works across [b].is[/b], [b].sx[/b], [b].me[/b].
// Future:
//  - JAV actresses.
//  - Male actors.
//  - Other data source integration: IAFD, etc.
let settings;
let hovered;
const oneMonth = 30 * 24 * 60 * 60 * 1000;
let iconSpinnerIntervalHandle;

const CF_BLOCK_KEY = "cf_block_until";
const CF_NEXT_CHECK_KEY = "cf_next_check";
const CF_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour cooldown between checks

const getTagCache = (type) => {
	const key = type === "hits" ? "hb-tag-hits" : "excludedTagNames";
	const val = localStorage.getItem(key);
	if (val) {
		return new Set(JSON.parse(val));
	}
	return new Set();
};

// Tag Caches
const excludedTagNamesSet = getTagCache("misses");
const tagHits = getTagCache("hits");

// GM data.
let data = {};
let statusArea;

// Check if Babepedia is returning good response.
async function isBabepediaOK() {
	return new Promise((resolve) => {
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://www.babepedia.com",
			anonymous: true,
			onload: (response) => {
				return resolve(response.status !== 200);
			},
			onerror: () => resolve(false), // Network error ≠ Turnstile
		});
	});
}

const sortCacheEntries = (arr) =>
	arr.sort((a, b) => {
		if (a.timeDiff > b.timeDiff) {
			return 1;
		}

		if (a.timeDiff < b.timeDiff) {
			return -1;
		}

		return 0;
	});

const getNameFromUri = (uri) => decodeURI(uri).split("/").at(-1).split(".")[0];

// Image caching - utilize both session and local storage.
// Tags - always cache to localStorage
// Images - cache in both session and localStorage with fallback strategy:
//   1. Try sessionStorage first (faster access)
//   2. If sessionStorage is full → fallback to localStorage
//   3. If localStorage is also full → purge oldest images from localStorage until space available
//   4. Purging only removes image entries (jpg/png/webp/avif/gif), preserving other data
//   5. Images are evicted in localStorage iteration order (oldest keys first)
//   6. Process continues until the new image can be stored or all image entries are exhausted
const cacheEntryInBrowserStorage = (key, val) => {
	const storageType = key.includes(".jpg") ? "sessionStorage" : "localStorage";

	try {
		// cache img
		if (storageType === "sessionStorage") {
			setStatus?.(`Caching image for ${getNameFromUri(key)}`);
			sessionStorage.setItem(key, val);
			return;
		}

		// otherwise, store in localStorage
		localStorage.setItem(key, val);
		return;
	} catch (e) {
		// If sessionStorage is full → try localStorage
		if (storageType === "sessionStorage") {
			try {
				localStorage.setItem(key, val);
				return;
			} catch {
				// fallthrough to purge below
			}
		}

		// LocalStorage is full → purge until it fits
		const success = removeOldestImageFromLocalStorage(key, val);
		if (!success) {
			console.warn(
				`cacheEntryInBrowserStorage: Could not store key=${key}, storage is full.`,
			);
		}
	}
};

// Helper: estimate size of a key+value pair (2 bytes per char)
const getEntrySize = (key, value) => {
	const v = value == null ? "" : value;
	return (key.length + v.length) * 2;
};

/**
 * Purge oldest image entries from localStorage until 'requiredKey' can be stored.
 * Returns true on success, false if unable to free enough space.
 *
 * Only considers keys that look like image cache keys (jpg/png/webp/avif/gif).
 */
const removeOldestImageFromLocalStorage = (requiredKey, requiredVal) => {
	// Try one final attempt before doing any removals (fast path)
	try {
		localStorage.setItem(requiredKey, requiredVal);
		return true;
	} catch (e) {
		// continue to eviction
	}

	// Collect image keys (in localStorage iteration order) and their sizes
	const imageKeyRegex = /\.(jpe?g|png|gif|webp|avif)(?:[?#].*)?$/i;
	const entries = [];
	for (let i = 0; i < localStorage.length; i++) {
		const k = localStorage.key(i);
		if (!k) continue;
		if (!imageKeyRegex.test(k)) continue; // only evict image-like keys
		const v = localStorage.getItem(k) || "";
		entries.push({ key: k, size: getEntrySize(k, v) });
	}

	if (entries.length === 0) {
		// Nothing safe to remove
		console.warn(
			"removeOldestImageFromLocalStorage: no image entries to evict",
		);
		return false;
	}

	// Evict entries one-by-one (oldest first = iteration order)
	while (entries.length > 0) {
		const oldest = entries.shift();
		try {
			localStorage.removeItem(oldest.key);
		} catch (err) {
			console.warn("Failed removing key during eviction:", oldest.key, err);
			// continue trying other keys
		}

		// After each eviction try to store the required item
		try {
			localStorage.setItem(requiredKey, requiredVal);
			console.log(`Evicted ${oldest.key} and stored ${requiredKey}`);
			return true;
		} catch (err) {
			// still full - continue loop and evict next
		}
	}

	// As a last resort, attempt once more (in case other keys freed or race)
	try {
		localStorage.setItem(requiredKey, requiredVal);
		return true;
	} catch (err) {
		console.warn(
			`removeOldestImageFromLocalStorage: could not free enough space for ${requiredKey}`,
		);
		return false;
	}
};

const saveTagCache = (type, set) => {
	const key = type === "hits" ? "hb-tag-hits" : "excludedTagNames";
	if (set) {
		// Tags always cache to localStorage
		cacheEntryInBrowserStorage(key, JSON.stringify([...set]));
	}
};

const setStatus = (msg) => (statusArea ? statusArea.setStatus(msg) : null);

const getData = () => {
	const data = GM_getValue("hoverbabe-data");
	if (data) {
		// convert actorNames.names back to Set.
		const o = JSON.parse(data);
		o.actorNames.names = new Set(JSON.parse(o.actorNames.names));
		return o;
	}

	return {
		actorNames: {
			names: new Set(),
			time: undefined,
		},
		pages: {},
	};
};
const saveData = (dataObj) => {
	// Convert actorNames.names to array first
	dataObj.actorNames.names = JSON.stringify([...dataObj.actorNames.names]);
	GM_setValue("hoverbabe-data", JSON.stringify(dataObj));
	data = getData();
};
const clearAllData = () => GM_deleteValue("hoverbabe-data");

const getAllAliases = (settings) => {
	const { optionAliases } = settings;
	if (optionAliases) {
		const allAliases = Object.values(optionAliases)
			.flat()
			.map((v) => v.trim());
		return allAliases;
	}
	return [];
};

const runDelayedFunc = (f, n) => {
	window.setTimeout(f, n);
};

const getStorageStats = (type) => {
	let x;
	let total = 0;

	const thisStorage = window[type];
	for (x in thisStorage) {
		if (Object.hasOwn(thisStorage, x)) {
			total += thisStorage[x].length * 2;
		}
	}
	return parseFloat((total / 1024).toFixed(2));
};

const stringToHTML = (str) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(str, "text/html");
	return doc.body;
};

/**
 * Excluded tags stored in localStorage.
 * Clean if >= 20% of localStorage. This likely wouldn't be hit before the
 * monthly actor reset. This runs when the actor reset runs.
 */
const cleanTagCaches = (force = false) => {
	const storageSize = 10000;
	const max = 0.2 * storageSize;
	const localStorageStats = getStorageStats("localStorage");
	// console.log(
	//   `Current localStorage size: ${localStorageStats}KB, max ${max}KB`
	// );
	if (force || localStorageStats >= max) {
		setStatus("Cleaning excluded tag cache.");
		localStorage.removeItem("excludedTagNames");
		localStorage.removeItem("hb-tag-hits");
	}
};

let currentActorTotal = 0;

const xmlHttpPromiseBabepedia = (config) =>
	new Promise((resolve, reject) => {
		window.setTimeout(() => {
			GM_xmlhttpRequest({
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.140 Safari/537.36",
					Referer: config.referer || "https://www.babepedia.com",
					Host: config.host || "www.babepedia.com",
				},
				url: config.url,
				onload: (responseObject) => {
					if (statusArea) {
						const allActorsFromPage =
							getAllActorsNamesFromIndexPage(responseObject);
						currentActorTotal += allActorsFromPage.size;
						statusArea.setTotalActors(currentActorTotal);
					}
					return resolve(responseObject);
				},
				oneerror: () => reject("onerror"),
				onabort: () => reject("abort"),
				onprogress: () => {
					setStatus(
						`⏳ Downloading all performers, current letter: ${config.letter}. (This only runs once a month)`,
					);
				},
			});
		}, config.delay);
	});

const nameToTag = (name) => name.toLowerCase().split(" ").join(".");

const getAllActorsNamesFromIndexPage = (responseObject) => {
	const knownNonActorTags = ["royalty", "softcore", "lesbian.threesome"];
	const html = responseObject.responseText;
	const dom = stringToHTML(html);
	const names = Array.from(dom.querySelectorAll('#content a[href*="babe"]'))
		.map((anchor) => {
			const nameLower = anchor.innerText.toLowerCase();
			const nameClean = nameLower.replace(/['-]/g, "");
			return nameClean.replace(/\s+/g, ".");
		})
		.filter((name) => !knownNonActorTags.includes(nameToTag(name))); // filter out known non-actors
	return new Set(names);
};

const calculateRemainingDaysToRefreshActors = () => {
	const now = new Date();
	if (data.actorNames) {
		const lastDownloadedTime = data.actorNames.time;
		return (
			(lastDownloadedTime + oneMonth - now.getTime()) /
			(60 * 60 * 24 * 1000)
		).toFixed(0);
	}
	return 0;
};

const getAllActors = () => {
	const now = new Date();
	const nowTime = now.getTime();

	if (data?.actorNames && data.actorNames.names.size > 0) {
		const actorsLastCacheTime = data.actorNames.time;
		if (nowTime - actorsLastCacheTime <= oneMonth) {
			return Promise.resolve("cache current");
		}
	}

	// Clean the excluded tags cache. This is so newly available actors can
	// get off of the excluded list.
	cleanTagCaches(true);

	const letters = [
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"z",
	];

	const promises = [];
	letters.forEach((letter, i) => {
		promises.push(
			xmlHttpPromiseBabepedia({
				url: `https://www.babepedia.com/index/${letter}`,
				referer: "https://www.babepedia.com",
				host: "www.babepedia.com",
				delay: i * 2000,
				letter,
			}),
		);
	});

	// Cache all actors after all responses come back.
	let allActorNames = new Set();
	return Promise.all(promises).then((responseObjects) => {
		responseObjects.forEach((responseObject) => {
			const names = getAllActorsNamesFromIndexPage(responseObject);
			allActorNames = new Set([...allActorNames, ...names]);
			data.actorNames = {
				names: allActorNames,
				time: now.getTime(),
			};
			saveData(data);
		});
		// Set total
		if (statusArea) {
			statusArea.setTotalActors();
		}
		return responseObjects;
	});
};

const getAllActorNamesFromCache = () => data.actorNames.names;

const capitalizeFirst = (string) =>
	`${string.charAt(0).toUpperCase()}${string.slice(1)}`;

const tagToName = (tag) => {
	if (tag.includes("📸")) {
		// Remove icon if it exists
		tag = tag.substring(2);
	}
	const names = tag.split(".");
	if (names.length === 3) {
		return [
			capitalizeFirst(names[0]),
			capitalizeFirst(names[1]),
			capitalizeFirst(names[2]),
		].join(" ");
	}
	if (names.length === 2) {
		return [capitalizeFirst(names[0]), capitalizeFirst(names[1])].join(" ");
	}
	return capitalizeFirst(names[0]);
};

const createBioContainer = (
	name,
	bioImage,
	bioData,
	aboutEl,
	performerLinks,
) => {
	const width = 475;
	let top;
	let left;

	const template = `
  <style>
    div#hoverbabe-inner {
      display: grid;
      grid-template-areas: "bioimage biodata biotext""external-links external-links external-links";
      gap: 5px;
      padding: 5px;
    }
    div#hoverbabe-container  {
      position: fixed;
      top: ${top};
      background-color: rgba(0, 0, 0, 0.9);
      padding: 10px;
      border: solid #333 1px;
      border-radius: 5px;
      left: ${left}px;
      font-size: inherit;
      color: #ccc;
      z-index: 100;
    }

    div#hoverbabe-container img {
      width: 230px;
    }

    div#external-links {
      grid-area: external-links;
    }

    div#hoverbabe-container .label {
      background-color: inherit;
    }

    div#bioimage {
      grid-area: bioimage;
    }

    div#biodata {
      grid-area: biodata;
      padding: 0 3px;
      max-height: 370px;
      overflow: auto;
      width:auto;
    }

    div#biotext {
      grid-area: biotext;
      overflow-y: auto;
      max-height: 350px;
      padding-right: 5px;
    }

    div#biotext p {
       margin: 3px 3px;
    }

    div#hoverbabe-container h1 {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 1.5em;
      font-weight: bold;
      vertical-align: baseline;
      display: inline-block;
    }

    div#hoverbabe-container h2 {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 1.4em;
      vertical-align: baseline;
      text-align: left;
      color: inherit;
      background-color: inherit;
      border: none !important;
      background: none;
      box-shadow: none;
      border-radius: 0;
    }

    div#biotext h2 {
       margin: 0 0 0 3px;
    }

    div#hoverbabe-container li {
      margin: 0;
      padding: 0;
      border: 0;
      font: inherit;
      vertical-align: baseline;
      text-align: left;
      list-style: none;
      list-style-position: inherit;
    }

    div#hoverbabe-container span {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: inherit;
      vertical-align: baseline;
      line-height: 1.3em;
    }

    div#hoverbabe-container #bioarea {

    }

    div#hoverbabe-container #tattoo-text-span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 160px;
      margin: 0 0 2px 2px;
      vertical-align: middle;
      display: inline-block;
    }

    div#hoverbabe-container #tattoo-text-span:hover {
      cursor: help;
    }

    div#close-hb {
      float: right;
      border-radius: 5px;
      height: 20px;
      font-size: 16px;
      margin: 0;
    }

    div#close-hb:hover{
      cursor:pointer;
      border-radius: 5px;
      height: 20px;
      color: #eee;
    }

    #hb-title {
      margin-bottom: 5px;
    }

    #babename {
      background-color: #222;
      border-radius: 5px;
      text-align: center;
      width: 95%;
    }

    #iafd-link {
      display: inline-block;
    }

    .hb-more-of {
      display: inline-block;
      padding-right: 5px;
    }

    .info-title {
      border-bottom: 1px solid #ccc;
      font-weight: bold;
      margin-bottom: 3px;
    }
  #similar-performers {
    display: block;
  }

  </style>

  <div id="hb-title">
    <h1 id='bioname'></h1>
    <div id="close-hb">❌</div>
  </div>

  <div id='hoverbabe-inner'>
    <div id='bioimage' class='col'></div>
    <div id='biodata' class='col'></div>
    <div id='biotext' class='col'>
      <h2>About ${name}</h2>
    </div>
    <div id='external-links'>
      <span id='links-list'><b>Links</b>: </span>
      <span id='similar-performers'><b>If you like <span id='similar-performers-first-name'></span></b>: </span>
<!--       <span id='similar-performers'><b>Similar Performers</b>: </span> -->
    </div>
  </div>
  `;

	const div = document.createElement("div");
	div.id = "hoverbabe-container";
	div.innerHTML = template;

	if (bioImage) {
		bioImage.style.borderRadius = "5px";
		div.querySelector("#bioimage").append(bioImage);
	} else {
		const span = document.createElement("span");
		span.innerText = "No image available.";
		div.querySelector("#bioimage").append(span);
	}

	const bioArea = div.querySelector("#biodata");

	bioArea.append(bioData);

	// About width (depends on if About content present)
	const aboutArea = div.querySelector("#biotext");
	const widthInPixels = aboutEl?.innerText ? 860 : width;

	if (aboutEl?.innerText) {
		aboutArea.append(aboutEl);
	} else {
		aboutArea.remove();
	}

	// Links
	if (performerLinks.length) {
		const linksTitle = document.createElement("h2");
		linksTitle.innerHTML = `${name} Links`;
		aboutArea.append(linksTitle);
		const linksSearchEl = document.createElement("input");
		linksSearchEl.type = "text";
		linksSearchEl.placeholder = "Type to search links";
		linksSearchEl.addEventListener("keyup", (e) => {
			performerLinks.forEach((linkEl) => {
				if (
					linkEl.innerText.toLowerCase().includes(e.target.value.toLowerCase())
				) {
					linkEl.hidden = false;
					linkEl.nextSibling.hidden = false;
				} else {
					linkEl.hidden = true;
					linkEl.nextSibling.hidden = true;
				}
			});
		});
		aboutArea.append(linksSearchEl);

		const linksArea = document.createElement("p");
		linksArea.style.minHeight = "300px"; // prevent shifting

		performerLinks.forEach((linkEl) => {
			const sep = document.createElement("span");
			sep.innerText = " • ";

			// anonymize
			linkEl.href = `http://anonym.es/?${linkEl.href}`;
			linkEl.target = "_blank";
			linkEl.rel = "noreferrer";
			linksArea.append(linkEl);
			linksArea.append(sep);
		});
		aboutArea.append(linksArea);
	}

	// Move actor name to top of dialog
	const nameEl = div.querySelector("#bioname");
	nameEl.innerText = name;

	// close
	div.querySelector("#close-hb").addEventListener("click", () => {
		div.remove();
	});

	// Set width in px after calculations.
	div.style.width = `${widthInPixels}px`;

	return div;
};

/**
 * Try to get image from session/local storage.
 * @param {String} imgSrc
 */
const getImageFromCache = (imgSrc) => {
	const cachedImageData = sessionStorage.getItem(imgSrc);
	if (cachedImageData) {
		return cachedImageData;
	}
	return localStorage.getItem(imgSrc);
};

const getBioImage = (name, imgSrc, cb) => {
	const cachedImageData = getImageFromCache(imgSrc);

	if (cachedImageData) {
		const cachedImageObject = JSON.parse(cachedImageData);
		const cachedImage = cachedImageObject.image;

		// console.log(`Getting cached image for ${name}: ${imgSrc}`);
		statusArea.setStatus(`Getting cached image for ${name}`);

		const img = document.createElement("img");
		img.src = cachedImage;
		return cb(img);
	}

	// No image available
	if (imgSrc.includes("javascript")) {
		return cb(null);
	}

	GM_xmlhttpRequest({
		headers: {
			Referer: "https://www.babepedia.com",
			Host: "www.babepedia.com",
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.140 Safari/537.36",
		},
		url: `https://www.babepedia.com${imgSrc}`,
		responseType: "blob",
		onload: (data) => {
			const img = document.createElement("img");
			data.response.text().then(() => {
				// Convert blob to base64
				const reader = new FileReader();
				reader.readAsDataURL(data.response);
				reader.onloadend = () => {
					const base64data = reader.result;
					img.src = base64data;

					const now = new Date();

					// cache image in session storage
					cacheEntryInBrowserStorage(
						imgSrc,
						JSON.stringify({
							time: now.getTime(),
							image: base64data,
						}),
					);
					cb(img);
				};
			});
		},
	});
};

const insertAfter = (newNode, existingNode) =>
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);

const findEl = (dom, parentSelector, text) => {
	const res = Array.from(dom.querySelector(parentSelector).children).filter(
		(node) => node.innerText.includes(text),
	);
	if (res) {
		return res[0];
	}
};

const createBioEntry = (name, value) => {
	const div = document.createElement("div");
	div.className = "info-item";
	const sp1 = document.createElement("span");
	sp1.className = "label";
	const sp2 = document.createElement("span");
	sp2.className = "value";

	sp1.innerText = `${name}: `;
	sp2.innerText = value;
	div.append(sp1);
	div.append(sp2);
	return div;
};

const addDebutInfo = (bioDom) => {
	const target = findEl(bioDom, ".info-grid", "Age:");
	if (target) {
		const birthYearEl = bioDom.querySelector("a[href*=born]");
		let birthYear;
		if (birthYearEl) {
			birthYear = birthYearEl.innerText;
		}
		const debutYearEl = Array.from(
			bioDom.querySelectorAll(".info-item"),
		).filter((el) => el.innerText.includes("active"));
		if (debutYearEl && debutYearEl.length === 1 && birthYear) {
			const debutYear = Array.from(bioDom.querySelectorAll(".info-item"))
				.filter((el) => el.innerText.includes("active"))
				.map((el) => el.innerText.split(":")[1].split("-")[0].trim())[0];
			const debutAge = debutYear * 1 - birthYear * 1;

			// add to bioDom
			const debutAgeEl = createBioEntry("Debut Age", debutAge);
			const debutYearEl = createBioEntry("Debut Year", debutYear);

			insertAfter(debutAgeEl, target);
			insertAfter(debutYearEl, debutAgeEl);
		}
	}
};

const cleanUpDom = (bioDom) => {
	addDebutInfo(bioDom);

	// Remove links in bio section.
	const allBioLinks = Array.from(
		bioDom.querySelectorAll("#personal-info-block a"),
	);

	allBioLinks.forEach((link) => {
		const textNode = document.createTextNode(link.textContent);
		link.parentNode.replaceChild(textNode, link);
	});

	// Remove any inline styles from values
	const els = bioDom.querySelectorAll("div.info-item .value");

	els.forEach((el) => {
		const { children } = el;
		if (children.length > 0) {
			Array.from(children).forEach((child) => {
				child.removeAttribute("style");
			});
		}
	});

	const labelEls = Array.from(bioDom.querySelectorAll("div.info-item .label"));

	// birthdate formatting
	const bornLabelList = labelEls.filter((el) =>
		el.innerText.toLowerCase().includes("born"),
	);
	if (bornLabelList.length > 0) {
		const birthDateEl = bornLabelList[0].parentElement.children[1];
		const birthDateList = birthDateEl.textContent.split(" ");
		const birthDateText = `${birthDateList[3]} ${birthDateList[1]}, ${birthDateList[4]}`;
		birthDateEl.textContent = birthDateText;
	}

	// Age formatting
	const ageLabelList = labelEls.filter((el) =>
		el.innerText.toLowerCase().includes("age"),
	);
	if (ageLabelList.length > 0) {
		const ageEl = ageLabelList[0].nextElementSibling;
		ageEl.textContent = ` ${ageEl.textContent.split("years")[0].trim()}`;
	}

	// Debut age, year
	const debutAgeList = labelEls.filter((el) =>
		el.innerText.toLowerCase().includes("debut age"),
	);
	const debutYearList = labelEls.filter((el) =>
		el.innerText.toLowerCase().includes("debut year"),
	);

	if (debutAgeList.length > 0) {
		const parts = debutAgeList[0].innerText.split(":");
		const label = `${parts[0]}:`;
		const age = parts[1];
		debutAgeList[0].innerText = label;
		insertAfter(document.createTextNode(age), debutAgeList[0]);
	}

	if (debutYearList.length > 0) {
		const parts = debutYearList[0].innerText.split(":");
		const label = `${parts[0]}:`;
		const age = parts[1];
		debutYearList[0].innerText = label;
		insertAfter(document.createTextNode(age), debutYearList[0]);
	}

	// Aliases
	const akaEl = bioDom.parentElement.querySelector("#aka");
	if (akaEl) {
		const text = akaEl.textContent
			.split(":")[1]
			.split(/\s+-\s+/)
			.join(", ")
			.trim();
		const aliasEl = createBioEntry("Aliases", text);
		const target = bioDom.querySelectorAll(".info-item")[0];
		target.parentNode.insertBefore(aliasEl, target);
	}

	// Profession
	const professionEl = labelEls.find((el) =>
		el.innerText.toLowerCase().includes("profession"),
	);

	if (professionEl) {
		const professionElCloned = professionEl.cloneNode(true);
		const professionParent = professionEl.parentNode;
		const professionValues = Array.from(professionParent.children).slice(1);
		const professionText = professionValues.map((v) => v.innerText).join(", ");
		professionParent.innerHTML = "";
		const professionSpan = document.createElement("span");
		professionSpan.innerText = ` ${professionText}`;
		professionParent.append(professionElCloned);
		professionParent.append(professionSpan);
	}

	return bioDom;
};

const cleanPagesCache = () => {
	const oneWeek = 604800000;
	const now = new Date();

	if (data.pages) {
		Object.keys(data.pages).forEach((name) => {
			if (now.getTime() - data.pages[name].time > oneWeek) {
				setStatus(`Deleting cached page for ${name}`);
				delete data.pages[name];
			}
		});
	}
};

const createOpenNewPageLink = (url, props, text) => {
	const a = document.createElement("a");

	Object.keys(props).forEach((key) => {
		a.setAttribute(key, props[key]);
	});

	a.innerHTML = text;

	a.style.cursor = "pointer";

	a.addEventListener("click", (e) => {
		e.preventDefault();
		window.open(url, "_blank");
	});
	return a;
};

const createIAFDLink = (url) =>
	createOpenNewPageLink(
		url,
		{
			id: "iafd-link",
		},
		`IAFD`,
	);

function isCCuporGreater(performerData) {
	if (!performerData) return false;
	const braSize = performerData["Bra/cup size"];
	if (!braSize) {
		return false;
	}
	for (const char of braSize) {
		if (char >= "C" && char <= "Z") {
			return true;
		}
	}
	return false;
}

const displayBio = (name, pageDom, precacheOnly) => {
	let updatedBioArea;
	const bioArea = pageDom.querySelector("#personal-info-block");
	let noDataBioEl;

	// May not be a bio area
	if (bioArea) {
		// Do some cleanup of dom
		if (!precacheOnly) {
			updatedBioArea = cleanUpDom(bioArea);
		}
	} else {
		// create a 'no data' for bioArea
		noDataBioEl = document.createElement("div");
		noDataBioEl.id = "no-data";
		noDataBioEl.innerText = "No Bio Data Available.";
	}

	// Put performer bio data in object
	const performerData = Array.from(
		bioArea?.querySelectorAll(".info-item:not(.info-title)"),
	).reduce((prev, cur) => {
		prev[cur.children[0]?.innerText?.split(":")[0]] =
			cur.children[1]?.innerText;
		return prev;
	}, {});

	// Pass in the raw bio image src, cb will receive the imgDom with image blob;
	const bioImg = pageDom.querySelector("#profimg").querySelector("a");
	let bioImgSrc = bioImg.getAttribute("href");

	// If no primary image, get first user-uploaded image.
	if (bioImg.classList.contains("noimg")) {
		const userUploadsArea = pageDom.querySelector("div.useruploads2");
		if (userUploadsArea) {
			bioImgSrc = userUploadsArea.querySelector("a").getAttribute("href");
		}
	}

	// Get About section
	const aboutEl = pageDom.querySelector("#biotext");
	// Remove unneeded sections
	aboutEl?.querySelector(".gallerybanner")?.remove();

	// Get performer links
	const performerLinks = Array.from(pageDom.querySelectorAll(".outlink"));

	// Get suggested performers
	const similarPerformers = Array.from(
		pageDom.querySelectorAll("div#morelikethumbs .thumbshot"),
	).map((v) => v.textContent.trim());

	// Get bio image and show
	if (hovered) {
		getBioImage(name, bioImgSrc, (img) => {
			if (hovered) {
				hovered = false;
				if (!precacheOnly) {
					const target = document.querySelector(
						"#details_top, #torrent_table, #content",
					);

					const bioContainer = createBioContainer(
						name,
						img,
						updatedBioArea || noDataBioEl,
						aboutEl,
						performerLinks,
					);

					const iafdSpinner = document.createElement("div");
					iafdSpinner.style.display = "inline-block";
					iafdSpinner.id = "iafd-spinner";
					iafdSpinner.innerText = "Getting IAFD link";

					const externalLinksContainer =
						bioContainer.querySelector("#links-list");

					const similarPerformersContainer = bioContainer.querySelector(
						"#similar-performers",
					);

					if (similarPerformers.length > 0) {
						const e = bioContainer.querySelector(
							"#similar-performers-first-name",
						);
						e.textContent = name.split(" ")[0];
						similarPerformers.forEach((performer, i) => {
							const tag = nameToTag(performer);
							const el = document.createElement("a");
							el.href = `/torrents.php?taglist=${tag}`;
							el.text = performer;
							similarPerformersContainer.append(el);
							if (i < similarPerformers.length - 1) {
								el.insertAdjacentText("afterend", ", ");
							}
						});
					} else {
						similarPerformersContainer.remove();
					}

					const tag = nameToTag(name);

					// Add get more of link
					externalLinksContainer.append(
						getMoreOfLink(
							`/torrents.php?taglist=${nameToTag(name)}`,
							"Empornium",
						),
					);

					externalLinksContainer.append(
						getMoreOfLink(
							`http://anonym.es/?https://www.babepedia.com/babe/${name.replace(
								" ",
								"_",
							)}`,
							"Babepedia",
						),
					);

					if (isCCuporGreater(performerData)) {
						externalLinksContainer.append(
							getMoreOfLink(
								`http://anonym.es/?https://www.boobpedia.com/boobs/${name.replace(
									" ",
									"_",
								)}`,
								"Boobpedia",
							),
						);
					}

					// Try getting link from data.iafd in case that request came back earlier, otherwise add
					// spinner.
					if (data.iafd?.[tag]) {
						const iafdLink = createIAFDLink(data.iafd[tag], tag);
						externalLinksContainer.append(iafdLink);
					} else {
						setInterval(() => {
							iafdSpinner.append(".");
						}, 1000);

						externalLinksContainer.append(iafdSpinner);
					}

					target.appendChild(bioContainer);
					bioContainer.style.left = "50%";
					bioContainer.style.top = "50%";
					bioContainer.style.transform = "translate(-50%, -50%)";

					// stop icon spinner
					window.clearInterval(iconSpinnerIntervalHandle);

					// add drag handling
					const container = document.getElementById("hoverbabe-container");
					const titleBar = document.getElementById("hb-title");

					let offsetX = 0;
					let offsetY = 0;
					let isDragging = false;

					titleBar.style.cursor = "move"; // visual cue for drag handle

					titleBar.addEventListener("mousedown", (e) => {
						isDragging = true;

						const rect = container.getBoundingClientRect();

						// Set absolute pixel position based on current visual position
						container.style.left = `${rect.left}px`;
						container.style.top = `${rect.top}px`;

						// Remove transform so future moves are pixel-based with no offset jump
						container.style.transform = "none";

						offsetX = e.clientX - rect.left;
						offsetY = e.clientY - rect.top;

						document.addEventListener("mousemove", onMouseMove);
						document.addEventListener("mouseup", onMouseUp);

						e.preventDefault(); // prevent text selection
					});

					function onMouseMove(e) {
						if (!isDragging) return;

						const left = e.clientX - offsetX;
						const top = e.clientY - offsetY;

						container.style.left = `${left}px`;
						container.style.top = `${top}px`;
						container.style.right = "inherit"; // optional: override right if used elsewhere
					}

					function onMouseUp() {
						isDragging = false;
						document.removeEventListener("mousemove", onMouseMove);
						document.removeEventListener("mouseup", onMouseUp);
					}
				}

				// show indicator when precaching
				if (precacheOnly) {
					highlightTorrentTag(name);
				}
			}
		});
	}
};

const getMoreOfLink = (url, siteName) =>
	createOpenNewPageLink(
		url,
		{
			class: "hb-more-of",
		},
		siteName,
	);

const getBioContainer = () => document.querySelector("#hoverbabe-container");

const xmlHttpPromise = (config) =>
	new Promise((resolve, reject) => {
		window.setTimeout(() => {
			GM_xmlhttpRequest({
				headers: {
					Referer: config.referer || "https://www.babepedia.com",
					Host: config.host || "www.babepedia.com",
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.140 Safari/537.36",
				},
				url: config.url,
				onload: (responseObject) => resolve(responseObject),
				oneerror: () => reject("onerror"),
				onabort: () => reject("abort"),
			});
		}, config.delay);
	});

const getIAFDLink = (actorTag) => {
	const actorSearchName = actorTag.replace(".", "+");

	// check cache
	if (data.iafd?.[actorTag]) {
		return Promise.resolve(createIAFDLink(data.iafd[actorTag], actorTag));
	}

	// Actor known not to be in IAFD
	if (data.iafd && data.iafd[actorTag] === null) {
		return Promise.resolve(null);
	}

	const p = xmlHttpPromise({
		url: `https://www.iafd.com/results.asp?searchtype=comprehensive&searchstring=${actorSearchName}`,
		referer: "https://www.iafd.com",
		host: "www.iafd.com",
	});

	return p.then((responseObject) => {
		const pageDom = stringToHTML(responseObject.response);
		const iafdLink = pageDom.querySelector("table#tblFem a");

		if (iafdLink) {
			const href = iafdLink.getAttribute("href");
			const url = `http://anonym.es/?https://www.iafd.com${href}`;
			const link = createIAFDLink(url, actorTag);

			// cache iafd url
			if (data.iafd) {
				data.iafd[actorTag] = url;
			} else {
				data.iafd = {
					[actorTag]: url,
				};
			}

			saveData(data);
			return link;
		}
		if (data.iafd) {
			data.iafd[actorTag] = null;
		} else {
			data.iafd = {
				[actorTag]: null,
			};
		}
		saveData(data);
		return null;
	});
};

const getBabepediaNameForAlias = (aliasName, settings) => {
	const allAliases = getAllAliases(settings);
	if (allAliases.includes(nameToTag(aliasName))) {
		const babePediaTagName = Object.keys(settings.optionAliases).find((alias) =>
			settings.optionAliases[alias].includes(nameToTag(aliasName)),
		);
		return babePediaTagName;
	}
};

const getPageBio = (name, precacheOnly) => {
	// First, check any user-defined aliases for Babepedia actor and convert to that.
	const allAliases = getAllAliases(settings);
	if (allAliases.includes(nameToTag(name))) {
		const babePediaTagName = getBabepediaNameForAlias(name, settings);

		setStatus(
			`User-defined alias exists:  ${tagToName(babePediaTagName)} -> ${name}. `,
		);
		name = tagToName(babePediaTagName);
	}

	// Check cache first.
	if (data.pages?.[name]) {
		if (data.pages[name].response) {
			setStatus(`Getting page bio for ${name} from cache.`);

			const pageDom = stringToHTML(data.pages[name].response);
			displayBio(name, pageDom, precacheOnly);
			return;
		}
		setStatus(`Page bio unavailable for ${name}.`);
		return;
	}

	setStatus(`Getting page bio for ${name} from server...`);

	const now = new Date();

	GM_xmlhttpRequest({
		headers: {
			Referer: "https://www.babepedia.com",
			Host: "www.babepedia.com",
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.140 Safari/537.36",
		},
		url: `https://www.babepedia.com/babe/${name.trim().replace(/\s+/g, "_")}`,
		onload: (responseObject) => {
			if (responseObject.status === 403) {
				setStatus(
					" ⚠️ HoverBabe temporarily down due to Cloudflare Turnstile (CAPTCHA) being enabled on Babepedia.",
				);
				return;
			}

			// Cache results
			if (!data.pages) {
				data.pages = {};
			}

			// check responseObject prior to caching.
			const pageDom = stringToHTML(responseObject.response);
			if (pageDom) {
				const bioAreaEl = pageDom.querySelector("#personal-info-block");
				if (bioAreaEl) {
					data.pages[name] = {
						response: responseObject.response,
						time: now.getTime(),
					};

					// this is a little slow. how can we speed up? Save after display.
					saveData(data);

					// pass bioEl?
					displayBio(name, pageDom, precacheOnly);
				} else {
					// Was unable to get page data, display error.
					setStatus(`Unable to retrieve actor bio data for ${name}.`);
				}
			} else {
				setStatus(`Unable to retrieve actor page for ${name}.`);

				// need to set something so not to keep making request.
				data.pages[name] = {
					responseObject: null,
					time: now.getTime(),
				};
			}
		},
	});
};

const isBioOpen = () => !!document.querySelector("#hoverbabe-container");

const closeBio = (handle) => {
	// cancel event
	clearTimeout(handle);

	const container = document.querySelector("#hoverbabe-container");
	if (container) {
		container.remove();
	}
};

const getTagNameFromTagEl = (el) => {
	if (el.href) {
		return el.innerText.split("").slice(2).join("");
	}
	return el.parentNode.href.split("=")[1];
};

const startIconSpinner = (icon) => {
	window.clearInterval(iconSpinnerIntervalHandle);
	return window.setInterval(() => {
		if (icon.innerText === "📷") {
			icon.innerText = "📸";
		} else {
			icon.innerText = "📷";
		}
	}, 350);
};

const lookup = (hoverEvent) => {
	const tag = getTagNameFromTagEl(hoverEvent.target);
	const name = tagToName(tag);

	const allActors = getAllActorNamesFromCache();

	// check allActors and user-defined aliases
	if (allActors.has(tag) || getAllAliases(settings).includes(tag)) {
		if (isBioOpen()) {
			closeBio();
		}

		const icon = hoverEvent.target.firstChild;
		iconSpinnerIntervalHandle = startIconSpinner(icon);

		hovered = true;
		setStatus(`Getting bio for ${name}...`);

		// Get IAFD link and add to the bio container or window
		getIAFDLink(tag).then((iafdLink) => {
			const bioContainer = getBioContainer();
			if (bioContainer) {
				const iafdSpinner = bioContainer.querySelector("#iafd-spinner");
				const externalLinksContainer =
					// todo
					bioContainer.querySelector("#links-list");
				if (bioContainer && iafdLink) {
					const existingIafdLink = bioContainer.querySelector("#iafd-link");
					if (!existingIafdLink) {
						externalLinksContainer.append(iafdLink);
						iafdSpinner.remove();
					}
				}

				// No actor on iafd
				if (!iafdLink) {
					if (iafdSpinner) {
						iafdSpinner.remove();
					}

					externalLinksContainer.append("No IAFD page found.😞");
				}
				// could have returned earlier than bio. It's in data now so try
				// displaying link in displayBio.
			}
		});

		return getPageBio(name);
	}
	hovered = false;
};

const highlightTorrentTag = (name) => {
	const tagsInPage = Array.from(
		document.querySelectorAll("#torrent_tags a[href*=torrents]"),
	);
	const span = document.createElement("span");
	span.innerText = "📸";
	span.style.marginLeft = "2px";
	tagsInPage.forEach((tag) => {
		if (tag.innerText === nameToTag(name)) {
			tag.parentNode.prepend(span);
			highlightTag(tag.parentNode);
		}
	});
};

const highlightAliases = (tagEls, settings) => {
	const allAliases = getAllAliases(settings);
	const aliasesToHighlight = tagEls.filter((tagEl) =>
		allAliases.includes(tagEl.innerText),
	);
	aliasesToHighlight.forEach(highlightTag);
};

// Filter incoming tags to prevent need to search the large list of actors. Relies on hit/miss caches.
const processTags = (tags, hits, misses, actorList) => {
	const newTags = tags.filter(
		(tag) => !hits.has(tag.innerText) && !misses.has(tag.innerText),
	);
	const knownHits = tags.filter((tag) => hits.has(tag.innerText));

	// Expensive search. Use cache data to only do this search once per tag.
	const newHits = newTags.filter((tag) => actorList.has(tag.innerText));

	const newMisses = newTags.filter((tag) => !newHits.includes(tag));
	const tagsToHighlight = [...knownHits, ...newHits];

	return {
		knownHits, // knownHits + newHits = tags to prefetch
		newHits, // save to hits
		newMisses, // save to misses
		tagsToHighlight,
	};
};

// Prefetch bios on the title page.
// Note, for titles with very large number of actors, this can cause browser to become so busy that it locks up.
// If total number of hits is greater than 10, lazy load all highlighted actors.
const prefetchBioPagesAndImages = () => {
	const maxNumberOfActorTagsBeforeLazyLoading = 10;
	const allActors = getAllActorNamesFromCache();

	// Get all tags.
	const tagEls = Array.from(
		document.querySelectorAll("#torrent_tags a[href*=torrents]"),
	);
	const tagMisses = getTagCache("misses");
	const tagHits = getTagCache("hits");

	const { knownHits, newHits, newMisses, tagsToHighlight } = processTags(
		tagEls,
		tagHits,
		tagMisses,
		allActors,
	);

	// When adding indicators, mutation observer will hit this function again but these will be 0.
	// This will overwrite the status indicator with 0 hits on the torrent page. We can return here.
	if (
		knownHits.length === 0 &&
		newHits.length === 0 &&
		newMisses.length === 0 &&
		tagsToHighlight.length === 0
	)
		return;

	// Add new hits, misses to cache
	newHits.forEach((tag) => {
		tagHits.add(tag.innerText);
	});
	newMisses.forEach((tag) => {
		tagMisses.add(tag.innerText);
	});

	// All tags (names) to prefetch
	const newActorsAndCachedActorTagNames = knownHits
		.concat(newHits)
		.map((tag) => tagToName(tag.innerText));

	// Prefetch only those not already in cache
	const pagesInCache = data.pages ? Object.keys(data.pages) : [];
	const filteredPagesToPrefetch = newActorsAndCachedActorTagNames.filter(
		(page) => !pagesInCache.includes(page),
	);

	// Grab page every second
	const timeInterval = 1000;
	let nextTime = 0;
	const tagsToPrefetchLength = filteredPagesToPrefetch.length;

	// Highlight tags that have already been prefetched.
	tagsToHighlight.forEach(highlightTag);

	// Highlight all aliases
	highlightAliases(tagEls, settings);

	const totalTagsToHighlight =
		tagsToHighlight.length + newMisses.length + newHits.length;
	const tagsForStatus = tagsToHighlight.concat(newMisses).concat(newHits);

	statusArea.setStatus(
		`${totalTagsToHighlight} performer tags with bios on page: ${
			tagsForStatus.length > 0
				? tagsForStatus
						.map(
							(tag) =>
								`<a href='https://www.empornium.is/torrents.php?taglist=${nameToTag(
									tagToName(tag.innerText),
								)}'>${tagToName(tag.innerText)}</a>`,
						)
						.sort()
						.join(", ")
				: "none"
		}`,
		false,
	);

	// Only prefetch bios if total number of tags to prefetch is <= max.
	if (tagsToPrefetchLength <= maxNumberOfActorTagsBeforeLazyLoading) {
		// console.log(`Prefetching ${tagsToPrefetchLength} bio pages & images...`);
		for (let n = 0; n < tagsToPrefetchLength; n += 1) {
			nextTime = n * timeInterval;
			runDelayedFunc(() => {
				const name = filteredPagesToPrefetch[n];
				getPageBio(name, true);
			}, nextTime);
		}
	} else {
		statusArea.setStatus(
			`Large number of actor tags detected (${tagsToHighlight.length}). Lazy loading bio boxes on tag hover.`,
		);
	}

	// Update caches if needed. (do last for performance)
	if (newHits.length > 0) {
		saveTagCache("hits", tagHits);
	}

	if (newMisses.length > 0) {
		saveTagCache("misses", tagMisses);
	}
};

const getTotalActors = () =>
	data.actorNames?.names && data.actorNames.names.size > 0
		? data.actorNames.names.size
		: 0;

const getAlertsArea = () => document.querySelector("#alerts");

const createHoverBabeStatusArea = () => {
	const alerts = getAlertsArea();
	const alertsRect = alerts?.getBoundingClientRect();

	let position = "fixed";
	const width = "300px";
	const margin = 2;
	const right = 0;
	let bottom = 0;

	if (alerts) {
		if (alertsRect.top > 500) {
			// at bottom
			position = "initial";
			bottom = "initial";
		}
	}

	const template = `
  <style>
    div#hoverbabe-status-container {
      position: ${position};
      width: ${width};
      right: ${right};
      margin: ${margin}px;
      bottom: ${bottom};
      min-height: 40px;
      background-color: rgb(0,0,0,0.8);
      border-radius: 5px;
      font-family: Verdana,Arial,Helvetica,sans-serif;
      padding: 5px;
      font-size: 10px;
      font-weight: normal;
      color: rgb(230, 230, 230, 0.8);
      text-align: none;
    }
    div#hoverbabe-status-inner #msg {
      margin: 5px 0 0 0;
      overflow-y: auto;
      max-height: 60px;
    }
    div#hoverbabe-status-inner #title {
    }

    div#hoverbabe-status-container #total-actors-area {
      float: right;
    }

    #total-actors-area:hover, #total-actors:hover {
      background-color: #222;
      border-radius: 2px;
      cursor: default;
    }
  </style>
  <div id='hoverbabe-status-inner'>
    <span id='title'>HoverBabe Version: <span id='hb-version'></span><span id='total-actors-area' title=''>Performers </bold><span id='total-actors' title=''>${
			getTotalActors() || 0
		}</span></span></span>
    <p id='msg'></p>
  </div>
  `;

	const api = {
		setStatus: (msg, isText = true) => {
			const container = document.querySelector(
				"div#hoverbabe-status-container",
			);
			const statusEl = document.querySelector(
				"div#hoverbabe-status-container #msg",
			);
			const method = isText ? "innerText" : "innerHTML";
			if (container) {
				statusEl[method] = `💁${msg}`;
				// console.log(msg);
			}
		},
		hide: () => {
			const container = document.querySelector(
				"div#hoverbabe-status-container",
			);
			if (container) {
				container.style.display = "none";
			}
		},
		show: () => {
			const div = document.createElement("div");
			div.id = "hoverbabe-status-container";
			div.innerHTML = template;

			// Placement
			if (alerts && alertsRect.top > 500) {
				alerts.prepend(div);
			} else {
				document.querySelector("body").append(div);
			}

			api.setTotalActors();
			api.updateDaysToRefreshActors();
			api.setVersion();
		},
		setTotalActors: (val) => {
			const container = document.querySelector(
				"div#hoverbabe-status-container",
			);
			const totalEl = document.querySelector(
				"div#hoverbabe-status-container #total-actors",
			);
			if (container) {
				if (val) {
					totalEl.innerText = val;
					return;
				}
				totalEl.innerText = getTotalActors();
			}
		},
		updateDaysToRefreshActors: () => {
			const container = document.querySelector(
				"div#hoverbabe-status-container",
			);
			const totalElTitle = document.querySelector(
				"div#hoverbabe-status-container #total-actors-area",
			);
			const totalEl = document.querySelector(
				"div#hoverbabe-status-container #total-actors",
			);
			if (container) {
				const msg = `Refreshes in ${calculateRemainingDaysToRefreshActors()} days.`;
				totalEl.title = msg;
				totalElTitle.title = msg;
			}
		},
		setVersion: () => {
			const container = document.querySelector(
				"div#hoverbabe-status-container",
			);
			const version = document.querySelector(
				"div#hoverbabe-status-container #hb-version",
			);
			if (container) {
				version.innerText = `v${GM_getValue("hb-version")}`;
			}
		},
	};
	return api;
};

const highlightTag = (el) => {
	// Create indicator el and put in anchor
	const indicatorEl = document.createElement("span");
	if (!el.innerText.includes("📸")) {
		indicatorEl.className = "hoverbabe-indicator";
		indicatorEl.style.fontStyle = "normal";
		indicatorEl.style.float = "none";
		indicatorEl.style.textDecoration = "none";
		indicatorEl.innerText = "📸";
		el.style.whiteSpace = "nowrap";
		if (settings.optionEnableTagHighlighting) {
			el.style.backgroundColor = settings.optionHighlight;
			el.style.borderRadius = "2px";
		}
		el.prepend(indicatorEl);
	}
};

const highlightAllTagsOnPage = () => {
	const allActors = getAllActorNamesFromCache();
	const tags = Array.from(document.querySelectorAll("div.tags a"));

	let sectionActorTags = []; // for statusarea

	const { knownHits, newHits, newMisses, tagsToHighlight } = processTags(
		tags,
		tagHits,
		excludedTagNamesSet,
		allActors,
	);

	sectionActorTags = [
		...sectionActorTags,
		...newHits.map((hit) => hit.innerText),
		...knownHits.map((hit) => hit.innerText),
	];
	const sectionActorTagsSet = new Set(sectionActorTags);
	const sectionActorTagsNoDups = [...sectionActorTagsSet];

	// Add hits/misses to caches
	newMisses.forEach((tag) => {
		excludedTagNamesSet.add(tag.innerText);
	});
	newHits.forEach((tag) => {
		tagHits.add(tag.innerText);
	});

	statusArea.setStatus(
		`${sectionActorTagsNoDups.length} performers with bios on page: ${
			sectionActorTagsNoDups.length > 0
				? sectionActorTagsNoDups
						.map((tag) => {
							return `<a href='./torrents.php?taglist=${tag}'>${tagToName(
								tag,
							)}</a>`;
						})
						.sort()
						.join(", ")
				: "none"
		}`,
		false,
	);
	tagsToHighlight.forEach(highlightTag);

	// Highlight aliases
	highlightAliases(tags, settings);

	// write to cache if there were any new hits/misses.
	if (newHits && newHits.length > 0) {
		saveTagCache("hits", tagHits);
	}

	if (newMisses && newMisses.length > 0) {
		saveTagCache("misses", excludedTagNamesSet);
	}
};

const isSearchResultsPage = () =>
	(window.location.pathname.includes("torrents.php") &&
		!window.location.href.includes("?id")) ||
	window.location.pathname.includes("top10") ||
	window.location.pathname.includes("requests");

const setCurrentVersion = () => {
	const curVersion = GM_getValue("hb-version");
	const scriptVersion = GM_info.script.version;
	if (curVersion !== scriptVersion) {
		GM_setValue("hb-version", scriptVersion);
	}
};

function versionCompare(v1, v2, options) {
	const lexicographical = options?.lexicographical;
	const zeroExtend = options?.zeroExtend;
	let v1parts = v1.split(".");
	let v2parts = v2.split(".");

	function isValidPart(x) {
		return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
	}

	if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
		return NaN;
	}

	if (zeroExtend) {
		while (v1parts.length < v2parts.length) v1parts.push("0");
		while (v2parts.length < v1parts.length) v2parts.push("0");
	}

	if (!lexicographical) {
		v1parts = v1parts.map(Number);
		v2parts = v2parts.map(Number);
	}

	for (let i = 0; i < v1parts.length; ++i) {
		if (v2parts.length === i) {
			return 1;
		}

		if (v1parts[i] === v2parts[i]) {
		} else if (v1parts[i] > v2parts[i]) {
			return 1;
		} else {
			return -1;
		}
	}

	if (v1parts.length !== v2parts.length) {
		return -1;
	}

	return 0;
}

const updateCheck = (autoUpdate) => {
	const curVersion = GM_getValue("hb-version");
	const scriptVersion = GM_info.script.version;
	if (curVersion && scriptVersion) {
		return autoUpdate && versionCompare(scriptVersion, curVersion) === 1;
	}
	return true;
};

const getSettings = () => {
	const key = "hb-settings";
	const rawOptions = GM_getValue(key);
	if (rawOptions) {
		return JSON.parse(GM_getValue(key));
	}
	return {
		optionClickToOpen: false,
		optionSortActors: false,
		optionHighlight: "",
		optionShowStatusArea: true,
		optionEnableTagHighlighting: false,
		optionAliases: {
			"chloe.couture": ["chloe.cherry"],
		},
	};
};

const saveSettings = (settings) => {
	GM_setValue("hb-settings", JSON.stringify(settings));
};

const hideSettings = () =>
	document.querySelector("#threadman-options-outer-container").remove();

// Convert aliases back to string for alias textarea in settings
const convertObjectToString = (aliasesObject) => {
	if (aliasesObject) {
		let str = "";
		const keys = Object.keys(aliasesObject);
		keys.forEach((key) => {
			const aliasesString = aliasesObject[key].map((v) => v.trim());
			const entry = `${key}: ${aliasesString}\n`;
			str += entry;
		});
		return str;
	}
	return "";
};

// Settings
const showSettings = () => {
	// Get settings
	const options = getSettings();

	const settingsTemplate = `
  <style>
  #threadman-options-outer-container {
    color: #ccc;
    position: fixed;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    top: 50%;
    width: 650px;
    height: auto;
    border: solid #333 1px;
    background-color: rgb(0,0,0,0.9);
    border-radius: 15px;
    margin: 5px;
  }

  .threadman-options-container {
    position: relative;
    margin: 15px;
  }

  .threadman-options-container p{
    margin: 0;
  }

    .options-inner {
      width: 100%;
      margin: 10px 0 0 0;
      display: inline-block;
    }

    #threadman-save-settings {
      margin-top: 10px;
    }

    #close-threadman-settings a {
      float: right;
      text-decoration:none;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      font-size: 1.3em;
    }

    #close-threadman-settings a:hover {
      background-color: rgba(100,100,10,0.9);
    }

    #option-highlight {
      padding: 0;
      width: 15px;
      height: 15px;
    }

    #option-highlight-label {
      vertical-align: bottom;
    }

    #option-aliases {
      width: 100%;
    }

  </style>

  <div class="threadman-options-container" id="threadman-option-container">
    <div id='close-threadman-settings'><a href='#'>✖️</a></div>
    <h3>HoverBabe Settings</h3>

    <div>
      <div class='options-inner'>
        <input type="checkbox" id="option-click-to-open" name="option-click-to-open" ${
					options.optionClickToOpen ? "checked" : ""
				}>
        <label for="option-click-to-open"> Click to open bio box (instead of hover)</label>
        <br>
        <input type="checkbox" id="option-show-status-area" name="option-show-status-area" ${
					options.optionShowStatusArea ? "checked" : ""
				}>
        <label for="option-show-status-area"> Show status area</label>
        <br>
        <input type="checkbox" id="option-sort-actors" name="option-sort-actors" ${
					options.optionSortActors ? "checked" : ""
				}>
        <label for="option-sort-actors"> Performer tags at beginning of tag list (Search results pages, not on torrent page)</label>
        <br>
        <input type="checkbox" id="option-enable-tag-highlighting" name="option-enable-tag-highlighting" ${
					options.optionEnableTagHighlighting ? "checked" : ""
				}>
        <label for="option-enable-tag-highlighting"> Enable tag highlighting</label>
        <br>
        <input type="color" id="option-highlight" name="option-highlight" value="${
					options.optionHighlight
				}">
        <label id='option-highlight-label' for="option-highlight"> Tag highlight color</label><br><br>
        <h4 id='option-aliases-label' for="option-aliases">User-defined Aliases</h4>
        <p>Format: <code>[babepedia tag]:[alias tag 1],[alias tag 2], etc. (no spaces, 1 actor per line)</code></p>
        <p>Example: <code>polina.maxim:polina.max,polina.maxima,verena.maxima,venera.maxima</code></p>
        <textarea placeholder="List of aliases (see above for format)" id="option-aliases" rows=10>${convertObjectToString(
					options.optionAliases,
				)}</textarea>
      </div>
    </div>

    <div>
      <button id='threadman-save-settings'>Save Settings</button>
      <p>(Chrome only: Refresh page after saving settings)</p>
    </div>

  </div>
  `;

	const createTemplateDOM = (str) => {
		const template = document.createElement("div");
		template.id = "threadman-options-outer-container";
		template.innerHTML = str;
		return template;
	};

	const dom = createTemplateDOM(settingsTemplate);

	// Save settings
	dom
		.querySelector("#threadman-save-settings")
		.addEventListener("click", () => {
			const optionClickToOpen = document.querySelector("#option-click-to-open");
			const optionSortActors = document.querySelector("#option-sort-actors");
			const optionHighlight = document.querySelector("#option-highlight");
			const optionShowStatusArea = document.querySelector(
				"#option-show-status-area",
			);
			const optionEnableTagHighlighting = document.querySelector(
				"#option-enable-tag-highlighting",
			);
			const optionAliases = document.querySelector("#option-aliases");

			const localSettings = {
				optionClickToOpen: optionClickToOpen.checked,
				optionSortActors: optionSortActors.checked,
				optionHighlight: optionHighlight.value,
				optionShowStatusArea: optionShowStatusArea.checked,
				optionEnableTagHighlighting: optionEnableTagHighlighting.checked,
				/* optionAliases */
			};

			// Alias conversion/handling:
			// actor1: alias1, alias2, alias3\n
			// actor2: alias1, alias2\n
			const rawOptionAliases = optionAliases.value.trim();
			if (rawOptionAliases && rawOptionAliases !== "") {
				try {
					const entries = rawOptionAliases.trim().split("\n");
					const parsedAliases = entries.reduce((acc, v) => {
						const parts = v.split(":");
						acc[parts[0]] = parts[1].split(",").map((val) => val.trim());
						return acc;
					}, {});
					saveSettings({
						...localSettings,
						...{ optionAliases: parsedAliases },
					});
					hideSettings();
					window.location.reload(true);
				} catch {
					window.alert("Error: Double-check your aliases.");
				}
			} else {
				saveSettings(localSettings);

				hideSettings();
				window.location.reload(true);
			}
		});

	// Close settings
	dom
		.querySelector("#close-threadman-settings a")
		.addEventListener("click", hideSettings);

	// Add to document.
	const body = document.querySelector("body");
	body.appendChild(dom);
};

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

const tagHighlighterInstalled = () =>
	!!document.querySelector("li[title*=Highlighter]");

const sortTagsActorFirst = () => {
	const torrents = document.querySelectorAll(
		".torrent.rowa, .torrent.rowb, .torrent.redbar, table#request_table .rowa, table#request_table .rowb",
	);
	let actorTags;
	let nonActorTags;
	torrents.forEach((torrent) => {
		const tags = Array.from(
			torrent.querySelectorAll(
				tagHighlighterInstalled() ? ".tags span.s-tag" : ".tags a",
			),
		);
		actorTags = tags.filter((tag) => tag.innerText.includes("📸")).sort();
		nonActorTags = tags.filter((tag) => !tag.innerText.includes("📸"));

		const newTags = [...actorTags, ...nonActorTags];
		const tagsParent = torrent.querySelector(".tags");
		removeAllChildNodes(tagsParent);
		newTags.forEach((tag) => {
			tagsParent.appendChild(tag);
			tagsParent.append(" ");
		});
	});
};

// Add settings link to page.
const addSettingsLink = () => {
	const ul = document.createElement("ul");
	const li = document.createElement("li");
	ul.append(li);
	ul.style.display = "inline-block";

	const a = document.createElement("a");
	a.href = "#";
	a.textContent = "HoverBabe Settings";
	a.addEventListener("click", () => {
		showSettings();
	});
	li.appendChild(a);
	const container = document.querySelector("#major_stats");
	container.prepend(ul);
};

const debounce = (callback, wait) => {
	let timeoutId = null;
	return (...args) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback.apply(null, args);
		}, wait);
	};
};

const isTorrentPage = () => document.location.href.includes("torrents.php?id=");

async function shouldSkipDueToCloudflare() {
	const now = Date.now();
	const blockedUntil = parseInt(localStorage.getItem(CF_BLOCK_KEY), 10);
	const nextCheck = parseInt(localStorage.getItem(CF_NEXT_CHECK_KEY), 10);

	// Still in block window → skip script entirely
	if (!Number.isNaN(blockedUntil) && now < blockedUntil) {
		console.warn("Cloudflare block active until", new Date(blockedUntil));
		return true;
	}

	// Not time to check yet → skip network request
	if (!Number.isNaN(nextCheck) && now < nextCheck) {
		console.log(
			"Skipping Cloudflare check — next allowed at",
			new Date(nextCheck),
		);
		return false;
	}

	// Check if Babepedia OK.
	const cfBlocked = await isBabepediaOK();

	if (cfBlocked) {
		alert(
			"⚠️ Cloudflare protection detected or Babepedia is down. HoverBabe disabled for 12 hours.",
		);
		const twelveHoursFromNow = now + 12 * 60 * 60 * 1000;
		localStorage.setItem(CF_BLOCK_KEY, twelveHoursFromNow.toString());
		localStorage.setItem(CF_NEXT_CHECK_KEY, twelveHoursFromNow.toString());
		return true;
	}

	// No block, schedule next check in 1 hour
	localStorage.setItem(CF_NEXT_CHECK_KEY, (now + CF_CHECK_INTERVAL).toString());
	return false;
}

const run = async () => {
	// Check if Turnstile is enabled on Babepedia
	// debugger;
	if (await shouldSkipDueToCloudflare()) return;

	settings = getSettings();

	// Add aliases to settings
	// saveSettings({
	//   ...settings,
	//   ...{
	//     optionAliases: {
	//       'chloe.couture': ['chloe.cherry'],
	//       'lexie.fox': ['lexie.fux'],
	//       'polina.maxim': ['polina.max', 'polina.maxima', 'verena.maxima', 'venera.maxima'],
	//     },
	//   },
	// });

	// settings = getSettings();

	const autoUpdate = true;
	const doUpdate = updateCheck(autoUpdate);

	if (doUpdate) {
		alert(
			"Hoverbabe performer data is updating. Don't navigate away from page until the update completes (check the HoverBabe status panel).",
		);
		clearAllData();
	}

	setCurrentVersion();

	data = getData();

	const handleMouseOver = debounce((e) => {
		lookup(e);
	}, 250);

	const setUpHoverAndHighlightTags = () => {
		window.setTimeout(() => {
			const tags = document.querySelectorAll(
				'#torrent_tags_list a[href*="torrent"], .tags a',
			);
			tags.forEach((tag) => {
				if (!settings.optionClickToOpen) {
					tag.addEventListener("mouseover", handleMouseOver);
				} else {
					const hbIndicator = tag.firstChild;
					hbIndicator.addEventListener("click", (e) => {
						e.preventDefault();
						handleMouseOver(e);
					});
				}
			});

			if (!isSearchResultsPage()) {
				prefetchBioPagesAndImages();
			}
		}, 1000);

		// For Search results
		if (isSearchResultsPage()) {
			highlightAllTagsOnPage();
		}

		// optionally sort all tags
		if (settings.optionSortActors) {
			sortTagsActorFirst();
		}
	};

	getAllActors().then(setUpHoverAndHighlightTags);

	const { body } = document;
	body.addEventListener("keyup", (e) => {
		if (e.key === "Escape") {
			closeBio();
		}
	});

	body.addEventListener("click", (e) => {
		const bioContainer = getBioContainer();
		if (bioContainer) {
			const boundingRect = bioContainer.getBoundingClientRect();
			if (
				e.clientX < boundingRect.x ||
				e.clientX > boundingRect.right ||
				e.clientY < boundingRect.top ||
				e.clientY > boundingRect.bottom
			) {
				closeBio();
			}
		}
	});

	window.addEventListener("scroll", closeBio);

	cleanPagesCache();
	// cleanTagCaches();

	statusArea = createHoverBabeStatusArea(data);

	if (settings.optionShowStatusArea) {
		statusArea.show();
	}

	addSettingsLink();

	const debouncedMutationCb = debounce((mutation) => {
		if (mutation.type === "childList") {
			setUpHoverAndHighlightTags();
		}
	}, 250);

	if (isTorrentPage()) {
		// Re-set up tags when new tag is added/removed.
		const observer = new MutationObserver((mutationsList) => {
			mutationsList.forEach(debouncedMutationCb);
		});
		observer.observe(document.querySelector("#tag_container"), {
			childList: true,
			subtree: true,
		});
	}
};

// Go!
run();
