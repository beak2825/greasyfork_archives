// ==UserScript==
// @name            Bundle Helper Reborn
// @namespace       https://denilson.sa.nom.br/
// @version         2.8.1
// @description     Marks owned/ignored/wishlisted games on several sites, and also adds a button to open the steam page for each game.
// @match           *://astats.astats.nl/*
// @match           *://dailyindiegame.com/*
// @match           *://groupees.com/*
// @match           *://old.reddit.com/*
// @match           *://sgtools.info/*
// @match           *://steamground.com/*
// @match           *://steamkeys.ovh/*
// @match           *://www.dailyindiegame.com/*
// @match           *://www.fanatical.com/*
// @match           *://www.indiegala.com/*
// @match           *://www.reddit.com/*
// @match           *://www.sgtools.info/*
// @match           *://www.steamgifts.com/*
// @match           *://www.steamkeys.ovh/*
// @run-at          document-end
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @connect         store.steampowered.com
// @icon            https://store.steampowered.com/favicon.ico
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/478401/Bundle%20Helper%20Reborn.user.js
// @updateURL https://update.greasyfork.org/scripts/478401/Bundle%20Helper%20Reborn.meta.js
// ==/UserScript==

/*

# Bundle Helper Reborn

Marks owned/ignored/wishlisted games on several sites, and also adds a button to open the steam page for each game.

## Purpose

If you have a Steam account, you are probably also buying games from other
websites.

This user-script can help you by highlighting (on other sites) the games you
already have, games you have ignored, and games you have wishlisted (on Steam).

It also adds a convenient button (actually, a link) to open the Steam page for
each game on the supported third-party websites.

It is complementary to the amazing [AugmentedSteam browser extension](https://augmentedsteam.com/).
While that extension only applies to the Steam website(s), this user-script
applies to third-party websites.

It needs the permission to connect to `store.steampowered.com` to get the list
of owned/ignored/wishlisted items for the current logged-in user.

## History

This user-script is a fork of ["Bundle Helper" v1.09 by "7-elephant"](https://greasyfork.org/en/scripts/16105-bundle-helper).

It was initially based on 7-elephant's code, but has been completely rewritten
for v2.0. Code for obsolete websites was removed. Additional code for
extraneous poorly-documented functionality was also removed. This fork/version
has a clear purpose and sticks to that purpose. It's also supposed to be easier
to add support for more websites, or update the current ones when needed.

In order to avoid name clashes, I've decided to name it "Bundle Helper Reborn".

This fork also available at:
* https://greasyfork.org/en/scripts/478401-bundle-helper-reborn
* https://gist.github.com/denilsonsa/618ca8a9d04d574a162b10cbd3fce20f

* License: [GPL-3.0-only](https://spdx.org/licenses/GPL-3.0-only.html)
* Copyright 2016-2019, 7-elephant
* Copyright 2023, Denilson Sá Maia

*/

(function () {
	"use strict";
	// jshint multistr:true

	//////////////////////////////////////////////////
	// Convenience functions

	// Returns the Unix timestamp in seconds (as an integer value).
	function getUnixTimestamp() {
		return Math.trunc(Date.now() / 1000);
	}

	// Returns a human-readable amount of time.
	function humanReadableSecondsAmount(seconds) {
		if (!(Number.isFinite(seconds) && seconds >= 0)) {
			return "";
		}

		const minutes = seconds / 60;
		const hours = minutes / 60;
		const days = hours / 24;

		if (days >= 10 ) return days.toFixed(0) + " days";
		if (days >= 1.5) return days.toFixed(1) + " days";
		if (hours >= 10 ) return hours.toFixed(0) + " hours";
		if (hours >= 1.5) return hours.toFixed(1) + " hours";
		if (minutes >= 1) return minutes.toFixed(0) + " minutes";
		else return "just now";
	}

	// Returns just the filename (i.e. basename) of a URL.
	function filenameFromURL(s) {
		if (!s) {
			return "";
		}

		let url;
		try {
			url = new URL(s);
		} catch (ex) {
			// Invalid URL.
			return "";
		}

		return url.pathname.replace(reX`^.*/`, "");
	}

	// Returns a new function that will call the callback without arguments
	// after timeout milliseconds of quietness.
	function debounce(callback, timeout = 500) {
		let id = null;
		return function() {
			clearTimeout(id);
			id = setTimeout(callback, timeout);
		};
	}

	const active_mutation_observers = [];

	// Returns a new MutationObserver that observes a specific node.
	// The observer will be immediately active.
	function debouncedMutationObserver(rootNode, callback, timeout = 500) {
		const func = debounce(callback, timeout);
		func();
		const observer = new MutationObserver(func);
		observer.observe(rootNode, {
			subtree: true,
			childList: true,
			attributes: false,
		});
		active_mutation_observers.push(observer);
		return observer;
	}

	// Adds a MutationObserver to each root node matched by the CSS selector.
	function debouncedMutationObserverSelectorAll(rootSelector, callback, timeout = 500) {
		for (const root of document.querySelectorAll(rootSelector)) {
			debouncedMutationObserver(root, callback, timeout);
		}
	}

	function stopAllMutationObservers() {
		for (const mo of active_mutation_observers) {
			mo.disconnect();
		}
		active_mutation_observers.length = 0;
	}

	//////////////////////////////////////////////////
	// Regular expressions

	// Emulates the "x" flag for RegExp.
	// It's also known as "verbose" flag, as it allows whitespace and comments inside the regex.
	// It will probably break if the original string contains "$".
	function reX(re_string) {
		const raw = re_string.raw[0];
		let s = raw;
		// Removing comments.
		s = s.replace(/(?<!\\)\/\/.*$/gm, "");
		// Removing all whitespace.
		// Yes, even escaped whitespace.
		// Because I'm dealing with URLs, and these don't have any whitespace anyway.
		s = s.replace(/[ \t\r\n]+/g, "");
		return new RegExp(s);
	}
	// Same as reX, but ignoring case.
	function reXi(re_string) {
		return new RegExp(reX(re_string), "i");
	}

	// Example URLs:
	// https://store.steampowered.com/app/20/Team_Fortress_Classic/
	// https://store.steampowered.com/agecheck/app/976310/
	// https://steamcommunity.com/app/20
	// https://steamdb.info/app/20/
	// https://www.protondb.com/app/20
	// https://isthereanydeal.com/steam/app/20/
	// https://barter.vg/steam/app/20/
	// https://pcgamingwiki.com/api/appid.php?appid=20
	//
	// Screenshots, images, and user manual URLs:
	// https://cdn.akamai.steamstatic.com/steam/apps/20/0000000165.1920x1080.jpg
	// https://cdn.akamai.steamstatic.com/steam/apps/440/extras/page_banner_english1.jpg
	// https://store.steampowered.com/manual/440
	//
	// For packages:
	// https://store.steampowered.com/sub/237
	// https://steamdb.info/sub/237/
	//
	// Note: bundles are not the same as packages!
	// https://store.steampowered.com/bundle/237/HalfLife_1_Anthology/
	const re_app = reX`
		( /app/ | /apps/ | appid= )
		(?<id>[0-9]+)
		\b  // Word boundary, the regex will match 123 but not 123abc
	`;
	const re_sub = reX`
		( /sub/ | /subs/ )
		(?<id>[0-9]+)
		\b  // Word boundary, the regex will match 123 but not 123abc
	`;

	// Parses a string and tries to extract the app id or the sub id.
	function parseStringForSteamId(s) {
		const match_app = re_app.exec(s);
		const match_sub = re_sub.exec(s);

		// Resetting RegExp persistent state.
		// This is just one of those JavaScript quirks.
		// Supposedly this is only needed to RegExp objects with the global
		// flag, but I'm doing it anyway just to be safe.
		// (And just in case in the future we change those regexes to be global.)
		re_app.lastIndex = 0;
		re_sub.lastIndex = 0;

		if (match_app && match_sub) {
			console.warn("The string matched both app id and sub id. This is likely a mistake.", s, match_app, match_sub);
		}

		return {
			app: Number(match_app?.groups.id ?? 0),
			sub: Number(match_sub?.groups.id ?? 0),
		};
	}

	//////////////////////////////////////////////////
	// Steam profile data caching

	// The cached data.
	const cachename_profile_data = "bh_profile_data";
	// The timestamp of the cached version.
	const cachename_profile_time = "bh_profile_time";
	// The maximum age of the cache.
	// Cache will be considered after this amount of time.
	const cache_max_age_seconds = 60 * 60 * 24;  // 24 hours
	// For performance, we convert arrays into sets.
	let cached_sets = null;

	// Sets the cached value, while also updating its timestamp.
	function setProfileCache(data) {
		cached_sets = null;

		// WARNING: This is modifying the received data object in-place!
		// This is usually a bad idea, but it works fine for the purposes of
		// this script. And it doesn't add any extra overhead.

		// Deleting rgCurations because it's massive.
		data.rgCurations = {};
		// Deleting curator-related data because it's not used in this script.
		data.rgCurators = {};
		data.rgCuratorsIgnored = [];
		// Deleting recommendations because there is little to no value in storing them.
		data.rgRecommendedApps = [];
		data.rgRecommendedTags = [];

		GM_setValue(cachename_profile_data, data);
		GM_setValue(cachename_profile_time, getUnixTimestamp());
	}

	// Clears the cached data.
	// Not sure why we would do it.
	function clearProfileCache() {
		cached_sets = null;
		GM_setValue(cachename_profile_data, {});
		GM_setValue(cachename_profile_time, 0);
	}

	// Returns a human-readable string representation of the age.
	function getProfileCacheAge() {
		const now = getUnixTimestamp();
		const cached = GM_getValue(cachename_profile_time, 0);
		if (!cached) {
			return "";
		}
		return humanReadableSecondsAmount(now - cached);
	}

	// Returns a boolean.
	function isProfileCacheExpired() {
		const now = getUnixTimestamp();
		const cached = GM_getValue(cachename_profile_time, 0);
		return now - cached > cache_max_age_seconds;
	}

	// Returns a promise that resolves to the downloaded data.
	function downloadProfileData() {
		return new Promise((resolve, reject) => {
			function handleError(response) {
				console.error(`Error while loading the data: status=${response.status}; statusText=${response.statusText}`);
				reject();
				// I wish I had a better error-handling routine here.
				// But this is good enough for now.
			}

			GM_xmlhttpRequest({
				method: "GET",
				url: "https://store.steampowered.com/dynamicstore/userdata/?t=" + getUnixTimestamp(),
				responseType: "json",
				onabort: handleError,
				onerror: handleError,
				onload: function(response) {
					if (response.response) {
						resolve(response.response);
					} else {
						console.error("Null response after loading. Was it a valid JSON?");
						reject();
					}
				},
			});

			// There is also another API that can potentially be useful:
			// https://store.steampowered.com/api/appuserdetails/?appids=20,1234,5678
		});
	}

	// Downloads and updates the profile cache.
	// Returns a promise that resolves after updating it successfully.
	function downloadAndUpdateProfileCache() {
		return downloadProfileData().then((data) => {
			setProfileCache(data);
		});
	}

	// Returns a promise that resolves if the cache is fresh, or after updating it.
	function updateProfileCacheIfExpired() {
		if (isProfileCacheExpired()) {
			return downloadAndUpdateProfileCache();
		} else {
			return Promise.resolve();
		}
	}

	// Returns an object with the relevant data as sets.
	function getCachedSets() {
		if (!cached_sets) {
			const data = GM_getValue(cachename_profile_data, {});
			cached_sets = {
				// Lists of integers being converted to sets.
				appsInCart: new Set(data.rgAppsInCart),
				// creatorsFollowed: new Set(data.rgCreatorsFollowed),
				// creatorsIgnored: new Set(data.rgCreatorsIgnored),
				// curatorsIgnored: new Set(data.rgCuratorsIgnored),
				// followedApps: new Set(data.rgFollowedApps),
				ignoredPackages: new Set(data.rgIgnoredPackages),
				ownedApps: new Set(data.rgOwnedApps),
				ownedPackages: new Set(data.rgOwnedPackages),
				packagesInCart: new Set(data.rgPackagesInCart),
				// recommendedApps: new Set(data.rgRecommendedApps),
				// secondaryLanguages: new Set(data.rgSecondaryLanguages),
				wishlist: new Set(data.rgWishlist),

				// Ignored apps are a mapping of appids to zero.
				ignoredApps: new Set(Object.keys(data.rgIgnoredApps ?? {}).map((key) => Number(key))),

				// Tags are objects with this data:
				// {
				//   tagid: 1234,
				//   name: "Foobar",
				//   timestamp_added: 1672531200, // unix timestamp in seconds, only for rgExcludedTags, not for rgRecommendedTags.
				// }
				excludedTags: new Set(data.rgExcludedTags?.map((obj) => obj.name)),
				// recommendedTags: new Set(data.rgRecommendedTags?.map((obj) => obj.name)),

				// Available arrays of integers in the profile data:
				// rgAppsInCart
				// rgCreatorsFollowed
				// rgCreatorsIgnored
				// rgCuratorsIgnored
				// rgFollowedApps
				// rgIgnoredPackages  // Mostly empty, because there is no UI in steam to ignore a package.
				// rgOwnedApps
				// rgOwnedPackages
				// rgPackagesInCart
				// rgRecommendedApps
				// rgSecondaryLanguages
				// rgWishlist
				//
				// Available arrays of objects in the profile data:
				// rgExcludedTags
				// rgRecommendedTags
				//
				// Available arrays of unknown content in the profile data:
				// rgAutoGrantApps
				// rgExcludedContentDescriptorIDs
				// rgMasterSubApps
				// rgPreferredPlatforms
				//
				// Available objects (maps, associative arrays) in the profile data:
				// rgCurations
				// rgCurators
				// rgIgnoredApps
			};
		}
		return cached_sets;
	}

	//////////////////////////////////////////////////
	// Bundle Helper UI

	// Returns an object.
	function createBundleHelperUI() {
		const root = document.createElement("bundle-helper");
		const shadow = root.attachShadow({
			mode: "open",
		});

		shadow.innerHTML = `
			<style>
				.container {
					background: #222;
					color: #ddd;
					padding: 0.5em;
					border-radius: 0 0.5em 0 0;
					border: 1px #ddd outset;
					border-width: 1px 1px 0 0 ;
					font: 12px sans-serif;
				}
				p {
					margin: 0;
				}
				a {
					font: inherit;
					color: inherit;
					text-decoration: none;
				}
				a:hover {
					color: #fff;
					text-decoration: underline;
				}
				#close {
					float: right;
				}
			</style>
			<div class="container">
				<p>
					Steam profile data <a href="javascript:;" id="refresh">last fetched <output id="age"></output> ago</a>.
				</p>
				<p>
					Owned:
					<output id="ownedApps"></output> apps,
					<output id="ownedPackages"></output> packages.
				</p>
				<p>
					Ignored:
					<output id="ignoredApps"></output> apps,
					<output id="ignoredPackages"></output> packages.
				</p>
				<p>
					<a href="javascript:;" id="close">[close]</a>
					Wishlisted:
					<output id="wishlist"></output> apps.
				</p>
			</div>
		`;

		function updateUI() {
			const age = getProfileCacheAge() || "never";
			const sets = getCachedSets();

			shadow.querySelector("#age").value = age;
			shadow.querySelector("#ownedApps").value = sets.ownedApps.size;
			shadow.querySelector("#ownedPackages").value = sets.ownedPackages.size;
			shadow.querySelector("#ignoredApps").value = sets.ignoredApps.size;
			shadow.querySelector("#ignoredPackages").value = sets.ignoredPackages.size;
			shadow.querySelector("#wishlist").value = sets.wishlist.size;
		}

		shadow.querySelector("#refresh").addEventListener("click", function(ev) {
			ev.preventDefault();
			downloadAndUpdateProfileCache().finally(function() {
				unmarkAllElements();
				stopAllMutationObservers();
				updateUI();
				processSite();
			});
		});
		shadow.querySelector("#close").addEventListener("click", function(ev) {
			ev.preventDefault();
			root.remove();
		});

		updateUI()
		return {
			element: root,
			update: updateUI,
		};
	}

	// Adds the UI to the page.
	// It also triggers a profile data refresh if needed.
	function addBundleHelperUI(root) {
		if (typeof root == "string") {
			root = document.querySelector(root);
		}
		if (!root) {
			root = document.body;
		}

		const UI = createBundleHelperUI();
		root.appendChild(UI.element);
		updateProfileCacheIfExpired().finally(UI.update);
	}

	function getClassForAppId(id) {
		if (!id) return "";
		const sets = getCachedSets();
		if (sets.ownedApps.has(id)  ) return "bh_owned";
		if (sets.wishlist.has(id)   ) return "bh_wished";
		if (sets.ignoredApps.has(id)) return "bh_ignored";
		return "";
	}
	function getClassForSubId(id) {
		if (!id) return "";
		const sets = getCachedSets();
		if (sets.ownedPackages.has(id)  ) return "bh_owned";
		if (sets.ignoredPackages.has(id)) return "bh_ignored";
		return "";
	}

	// Create a new <a> link element to the appropriate Steam URL.
	// app_or_sub must be either "app" or "sub".
	// id must be the numeric id.
	// Returns the Node (HTMLElement).
	function createSteamLink(app_or_sub, id) {
		const url = `https://store.steampowered.com/${app_or_sub}/${id}`;
		// Copied from: https://github.com/edent/SuperTinyIcons/blob/master/images/svg/steam.svg
		const svg = `
			<svg xmlns="http://www.w3.org/2000/svg" aria-label="Steam" role="img" viewBox="0 0 512 512" fill="#ebebeb">
				<path d="m0 0H512V512H0" fill="#231f20"/>
				<path d="m183 280 41 28 27 41 87-62-94-96"/>
				<circle cx="340" cy="190" r="49"/>
				<g fill="none" stroke="#ebebeb">
					<circle cx="179" cy="352" r="63" stroke-width="19"/>
					<path d="m-18 271 195 81" stroke-width="80" stroke-linecap="round"/>
					<circle cx="340" cy="190" r="81" stroke-width="32"/>
				</g>
			</svg>
		`;
		const a = document.createElement("a");
		a.href = url;
		a.innerHTML = svg;
		a.className = "bh_steamlink";
		a.addEventListener("click", function(ev) {
			// Some pages have an onclick handler to the parent element.
			// Let's stop the even propagation to avoid that stupid handler.
			ev.stopPropagation();
		});
		return a;
	}

	// The main function that does most of the work on the page DOM.
	// This is the function that makes the results visible to the user.
	// Receives many parameters:
	function markElements({
		// CSS selector for the root node(s) of the subtree(s) that will be searched.
		// Useful to restrict the search to the main content, skipping unrelated elements.
		rootSelector = "body",
		// CSS selector matching each individual element (i.e. each game or package).
		itemSelector = "a[href*='store.steampowered.com/']",
		// JS callback that receives one item (i.e. one Element) and should
		// return a string containing the URL or a URL fragment.
		// The returned string of this function will be matched against re_app and re_sub.
		itemStringExtractor = (a) => a.href,
		// CSS selector to be passed to item.closest().
		// Assuming this item matched a valid id, this helps navigating upwards in the tree
		// until we find the appropriate block/container for the game or package.
		// The matched element will receive the bh_owned/bh_wished/bh_ignored CSS class.
		closestSelector = "*",
		// JS callback that will append/prepend/insert the "steamlink" element into the DOM tree.
		addSteamLinkFunc = (item, closest, steam_link) => {},
	}) {
		// Debugging statistics:
		let total_items = 0;
		let valid_data_items = 0;
		let valid_closest_items = 0;
		let skipped_items = 0;
		let marked_items = 0;
		for (const root of document.querySelectorAll(rootSelector)) {
			// console.debug("Analyzing subtree under this root:", root);
			for (const item of root.querySelectorAll(itemSelector)) {
				// console.debug("Analyzing item:", item);
				total_items++;
				const data = itemStringExtractor(item);
				// console.debug("Item data:", data);
				if (!data) {
					// No valid data found, ignore this item.
					continue;
				}
				valid_data_items++;
				const closest = item.closest(closestSelector);
				// console.debug("Closest:", closest);
				if (!closest) {
					continue;
				}
				valid_closest_items++;
				if (closest.classList.contains("bh_already_processed")) {
					skipped_items++;
					continue;
				}
				closest.classList.add("bh_already_processed");

				const {app, sub} = parseStringForSteamId(data);
				// console.debug("app:", app, "sub:", sub);
				if (app || sub) {
					marked_items++;
					closest.classList.remove("bh_owned", "bh_wished", "bh_ignored");
					// Figuring out if this app/sub is listed in the profile data.
					const cssClass = getClassForAppId(app) || getClassForSubId(sub);
					if (cssClass) {
						closest.classList.add(cssClass);
					}

					const steam_link = createSteamLink(app ? "app" : "sub", app || sub);
					addSteamLinkFunc?.(item, closest, steam_link)
				}
			}
		}

		console.info(
			"markElements(",
			"rootSelector=", rootSelector, ",",
			"itemSelector=", itemSelector, ",",
			"closestSelector=", closestSelector ,"):",
			`${total_items} total elements, ${valid_data_items} with valid data, ${valid_closest_items} with valid closest element, ${skipped_items} skipped, {$marked_items}`
		);
	}

	// This function tries to undo the effects of markElements().
	// It may not be perfect, but works well enough.
	function unmarkAllElements() {
		const classes = [
			"bh_owned", "bh_wished", "bh_ignored", "bh_already_processed",
		];
		for (const elem of document.querySelectorAll(classes.map((s) => `.${s}`).join(", "))) {
			elem.classList.remove(...classes);
		}
		for (const elem of document.querySelectorAll(".bh_steamlink")) {
			elem.remove();
		}
	}

	//////////////////////////////////////////////////
	// Site-specific data and code

	// Declaring some global variables here, so their value is preserved across
	// multiple calls to processSite().

	// There are no visible ids in the DOM.
	// Let's use something unique as the key: the cover image filenames.
	// The values are the "steam" objects from Fanatical API:
	// steam: {
	//   "type": "app",
	//   "id": 123456,
	//   "dlc": [],
	//   "deck_support": "verified",
	//   "deck_details": [],
	//   "packages": [],
	// }
	const fanatical_cover_map = new Map();

	const site_mapping = {
		"astats.astats.nl": function() {
			document.body.classList.add("bh_basic_style");
			GM_addStyle(`
				/* The website has this style that I have to override:
				 * table.tablesorter tr:nth-child(2n+1) { background: ... !important; }
				 */
				.bh_basic_style table.tablesorter tbody tr.bh_owned,
				.bh_basic_style table.tablesorter tbody tr.bh_wished,
				.bh_basic_style table.tablesorter tbody tr.bh_ignored {
					background: var(--bh-bgcolor) linear-gradient(135deg, rgba(0, 0, 0, 0.70) 10%, rgba(0, 0, 0, 0) 100%) !important;
				}
			`);
			markElements({
				rootSelector: "body",
				itemSelector: "td > a > img[alt='Logo']",
				itemStringExtractor: (img) => img.src,
				closestSelector: "tr",
			});

			// Example URL for this markup:
			// https://astats.astats.nl/astats/Steam_Games.php
			markElements({
				rootSelector: "body",
				itemSelector: "td > a > img.teaser[data-src]",
				itemStringExtractor: (img) => img.dataset.src,
				closestSelector: "td",
			});

			// This doesn't highlight much at all:
			// markElements({
			// 	itemSelector: "a[href*='store.steampowered.com/'], a[href*='steamcommunity.com/']",
			// 	itemStringExtractor: (a) => a.href,
			// });

			// This highlights too much:
			// markElements({
			// 	itemSelector: "a[href*='AppID=']",
			// 	itemStringExtractor: (a) => a.href.replace(/.*\bAppID=([0-9]+)/, "/app/$1"),
			// });
		},
		"dailyindiegame.com": function() {
			document.body.classList.add("bh_basic_style");

			// Applies to bundle pages:
			// /site_weeklybundle_1234.html
			markElements({
				rootSelector: ".DIG3_14_Gray",
				itemSelector: "td.DIG3_14_Orange a[href*='store.steampowered.com/']",
				itemStringExtractor: (a) => a.href,
				closestSelector: "td",
				addSteamLinkFunc: (item, closest, link) => {
					item.insertAdjacentElement("beforebegin", link);
				},
			});
			// Applies to game pages:
			// /site_gamelisting_123456.html
			markElements({
				rootSelector: "#DIG2TableGray",
				itemSelector: "a[href*='store.steampowered.com/']",
				itemStringExtractor: (a) => a.href,
				closestSelector: "tr:has(> .XDIGcontent)",
				addSteamLinkFunc: (item, closest, link) => {
					item.insertAdjacentElement("beforebegin", link);
				},
			});
			// Applies to lists of games, with images:
			// /site_list_topsellers.html
			// /site_list_whattoplay.html
			// /site_list_newgames.html
			// /site_list_category-action.html
			markElements({
				rootSelector: ".DIG-SiteLinksLarge, #DIG2TableGray",
				itemSelector: "a[href*='site_gamelisting_']:has(img)",
				itemStringExtractor: (a) => a.href.replace(/site_gamelisting_([0-9]+)\.html.*/, "app/$1"),
				closestSelector: "tr:has(> td.XDIGcontent), table#DIG2TableGray",
				addSteamLinkFunc: (item, closest, link) => {
					item.insertAdjacentElement("afterend", link);
					item.parentElement.style.position = "relative";
					link.style.position = "absolute";
					link.style.bottom = "0";
					link.style.right = "0";
				},
			});
			// Applies to lists of games, just text:
			// /site_content_marketplace.html
			markElements({
				rootSelector: "#TableKeys",
				itemSelector: "a[href*='site_gamelisting_']",
				itemStringExtractor: (a) => a.href.replace(/site_gamelisting_([0-9]+)\.html.*/, "app/$1"),
				closestSelector: "tr",
				addSteamLinkFunc: (item, closest, link) => {
					item.insertAdjacentElement("beforebegin", link);
				},
			});
			// Cannot get the right app id from this page:
			// /site_content_discountsteamkeys.html
		},
		"fanatical.com": function() {
			document.body.classList.add("bh_basic_style");
			GM_addStyle(`
				/* Custom styling for this page. */
				.bh_steamlink {
					position: absolute;
					bottom: 0;
					left: calc( 50% - var(--bh-steamlink-size) / 2 );
					z-index: 99;
				}
				.ProductHeader.container > .bh_steamlink {
					top: 0;
					right: 128px;
					left: auto;
					bottom: auto;
				}
			`);

			// Intercepting fetch() requests.
			// With help from:
			// * https://blog.logrocket.com/intercepting-javascript-fetch-api-requests-responses/
			// * https://stackoverflow.com/a/29293383
			// Using unsafeWindow to access the page's window object:
			// * https://violentmonkey.github.io/api/metadata-block/#inject-into
			const original_fetch = unsafeWindow.fetch;
			unsafeWindow.fetch = async function(...args) {
				let [resource, options] = args;
				const response = await original_fetch(resource, options);

				// Replacing the .json() method.
				const original_json = response.json;
				if (original_json) {
					response.json = function() {
						// Extracting useful data from the response.
						// We extract the cover art filenames and update the fanatical_cover_map.
						const p = original_json.apply(this);
						p.then((json_data) => {
							if (!json_data) {
								return;
							}

							// Example URLs:
							// Page: https://www.fanatical.com/en/bundle/batman-arkham-collection
							// AJAX: https://www.fanatical.com/api/products-group/batman-arkham-collection/en
							// There is usually only one object in this "bundles" array.
							for (const bundle of json_data.bundles ?? []) {
								for (const game of bundle.games ?? []) {
									if (game.cover && game.steam) {
										fanatical_cover_map.set(game.cover, game.steam);
									}
								}
							}

							// Example URLs:
							// Page: https://www.fanatical.com/en/pick-and-mix/build-your-own-bento-bundle
							// AJAX: https://www.fanatical.com/api/pick-and-mix/build-your-own-bento-bundle/en
							for (const game of json_data.products ?? []) {
								if (game.cover && game.steam) {
									fanatical_cover_map.set(game.cover, game.steam);
								}
							}

							// Example URLs:
							// Page: https://www.fanatical.com/en/game/the-last-of-us-part-i
							// AJAX: https://www.fanatical.com/api/products-group/the-last-of-us-part-i/en
							if (json_data.cover && json_data.steam) {
								fanatical_cover_map.set(json_data.cover, json_data.steam);
							}

							// Example URLs:
							// Page: https://www.fanatical.com/en/search
							// AJAX: https://w2m9492ddv-2.algolianet.com/1/indexes/*/queries?…
							// There is usually only one object in this "results" array.
							// for (const result of json_data.results ?? []) {
							// 	for (const game of result.hits ?? []) {
							// 		// We have game.cover, but there is no game.steam in this API result.
							// 		if (game.cover && game.steam) {
							// 			fanatical_cover_map.set(game.cover, game.steam);
							// 		}
							// 	}
							// }

							// Example URLs:
							// Page: https://www.fanatical.com/en/search
							// AJAX: https://www.fanatical.com/api/algolia/megamenu?altRank=false
							// But again we don't have any steam object in this API result.

							// console.debug("FANATICAL fanatical_cover_map:", fanatical_cover_map);
						});
						return p;
					}
				}
				return response;
			};

			// Setting a MutationObserver on the whole document is bad for
			// performance, but I can't find any better way, given the website
			// rewrites the DOM at will. At least, I'm increasing the debouncing
			// time to at least 2 seconds.
			debouncedMutationObserverSelectorAll("body", function() {
				markElements({
					rootSelector: "main",
					itemSelector: "img.img-full[srcset]",
					itemStringExtractor: (img) => {
						const filename = filenameFromURL(img.src);
						const steam = fanatical_cover_map.get(filename);
						if (!steam) {
							return "";
						}
						// console.debug("FANATICAL itemStringExtractor", `/${steam.type}/${steam.id}`, img);
						return `/${steam.type}/${steam.id}`;
					},
					closestSelector: ".bundle-game-card, .bundle-product-card, .card, .HitCard, .header-content-container, .NewPickAndMixCard, .PickAndMixCard, .ProductHeader.container",
					addSteamLinkFunc: (item, closest, link) => {
						// console.debug("FANATICAL addSteamLinkFunc", item, closest);
						closest.style.position = "relative";
						closest.insertAdjacentElement("beforeend", link);
					},
				});
			}, 2000);

			// We don't even try matching the dropdown results from the top bar.
			// It's not reliable and doesn't work properly.
		},
		"groupees.com": function() {
			// Not adding it because we need custom styles.
			// document.body.classList.add("bh_basic_style");

			GM_addStyle(`
				/* Removing the moving marquee message at the top of the page. */
				.broadcast-message .scroll-left > div {
					animation: none;
				}

				/* Custom styling for this page. */
				.product-tile.bh_owned,
				.product-tile.bh_wished,
				.product-tile.bh_ignored {
					outline: 3px solid var(--bh-bgcolor);
				}
				.product-tile.bh_ignored {
					opacity: 0.3;
				}
				.product-tile.bh_owned   .product-tile-wrapper:before,
				.product-tile.bh_wished  .product-tile-wrapper:before,
				.product-tile.bh_ignored .product-tile-wrapper:before {
					content: " ";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 9;
					pointer-events: none;
					opacity: 0.5;
					background: var(--bh-bgcolor) linear-gradient(135deg, rgba(0, 0, 0, 0.70) 10%, rgba(0, 0, 0, 0) 100%) !important;
				}
			`);
			markElements({
				rootSelector: ".bundle-content",
				itemSelector: ".external-links a[href*='store.steampowered.com/']",
				itemStringExtractor: (a) => a.href,
				closestSelector: ".product-tile",
				addSteamLinkFunc: (item, closest, link) => {
					closest.querySelector(".product-info > p").insertAdjacentElement("afterbegin", link);
				},
			});
		},
		"indiegala.com": function() {
			document.body.classList.add("bh_basic_style");

			// Applies to game pages:
			// /store/game/game-name-here/1234567
			markElements({
				rootSelector: ".store-product-main-container.product-main-container .product",
				itemSelector: "a[data-prod-id]",
				itemStringExtractor: (a) => "/app/" + a.dataset.prodId,
				closestSelector: "figcaption",
				addSteamLinkFunc: (item, closest, link) => {
					closest.insertAdjacentElement("afterbegin", link);
				},
			});

			// Applies to store list pages:
			// /store/category/strategy
			GM_addStyle(`
				/* Moving the background color from the figcaption to the whole item. */
				.main-list-results-item figcaption {
					background: transparent;
				}
				.main-list-results-item-margin {
					background: #FFF;
				}
				/* Adjusting the "Add to cart" button size. */
				a.main-list-results-item-add-to-cart {
					left: calc( 2 * 10px + var(--bh-steamlink-size) );
					width: auto;
					right: 10px;
				}
			`);
			debouncedMutationObserverSelectorAll("#ajax-contents-container.main-list-ajax-container", function() {
				markElements({
					rootSelector: ".results-collections .main-list-results-cont",
					itemSelector: ".main-list-results-item a[data-prod-id]",
					itemStringExtractor: (a) => "/app/" + a.dataset.prodId,
					closestSelector: ".main-list-results-item-margin",
					addSteamLinkFunc: (item, closest, link) => {
						closest.querySelector("div.flex").insertAdjacentElement("afterbegin", link);
					},
				});
			});

			// Applies to bundle pages:
			// //bundle/foo-bar-bundle
			GM_addStyle(`
				/* Moving the background color from the figcaption to the whole item. */
				.bundle-page-tier-item-outer figcaption {
					background: transparent;
				}
				.bundle-page-tier-item-outer {
					background: #FFF;
				}
			`);
			markElements({
				rootSelector: ".bundle-page-tier-games",
				itemSelector: "img.img-fit",
				itemStringExtractor: (img) => img.src.replace(/\/bundle_games\/[0-9]+\/([0-9]+)(_adult)?/, "/app/$1"),
				closestSelector: ".bundle-page-tier-item-outer",
				addSteamLinkFunc: (item, closest, link) => {
					closest.querySelector(".bundle-page-tier-item-platforms").insertAdjacentElement("afterbegin", link);
					link.style.position = "relative";
					link.style.zIndex = "99";
				},
			});

			// Applies to the top bar, links pointing to game pages.
			GM_addStyle(`
				/* Fixing colors, because the webdesigner was setting the foreground color without setting the background. */
				.header-search .results .results-item  a,
				.header-search .results .results-item .price .final-color-off {
					background: transparent;
					color: inherit;
				}
			`);
			debouncedMutationObserverSelectorAll("header", function() {
				markElements({
					rootSelector: "header",
					itemSelector: ".main-list-item a.fit-click",
					itemStringExtractor: (a) => a.href.replace(/\/store\/game\/[^\/]+\/([0-9]+)/, "/app/$1"),
					closestSelector: ".main-list-item",
					addSteamLinkFunc: (item, closest, link) => {
						item.insertAdjacentElement("afterend", link);
						link.style.position = "absolute";
						link.style.top = "0";
						link.style.left = "0";
						link.style.zIndex = "99";
					},
				});
				markElements({
					rootSelector: "#main-search-results",
					itemSelector: "a[href*='/store/game/']",
					itemStringExtractor: (a) => a.href.replace(/\/store\/game\/[^\/]+\/([0-9]+)/, "/app/$1"),
					closestSelector: ".results-item",
					addSteamLinkFunc: (item, closest, link) => {
						closest.querySelector("div.title").insertAdjacentElement("afterbegin", link);
						link.style.float = "left";
					},
				});
			});
		},
		"reddit.com": function() {
			document.body.classList.add("bh_basic_style");

			// Basic feature: coloring links from normal text.
			// Only works on the old reddit layout.
			// Examples:
			// https://old.reddit.com/r/GameDeals/
			// https://old.reddit.com/r/steamdeals/
			debouncedMutationObserverSelectorAll(".content", function() {
				markElements({
					itemSelector: "a[href*='store.steampowered.com/'], a[href*='steamcommunity.com/']",
					itemStringExtractor: (a) => a.href,
				});
			});
		},
		"sgtools.info": function() {
			document.body.classList.add("bh_basic_style");

			// Last 50 Bundled Games page:
			// /lastbundled
			GM_addStyle(`
				.bh_owned a,
				.bh_wished a,
				.bh_ignored a {
					color: inherit;
				}
			`);
			markElements({
				rootSelector: "#content",
				itemSelector: "table a[href*='store.steampowered.com/']",
				itemStringExtractor: (a) => a.href,
				closestSelector: "tr",
			});

			// Deals page:
			// /deals
			GM_addStyle(`
				.bh_owned h2,
				.bh_wished h2,
				.bh_ignored h2,
				.bh_owned h3,
				.bh_wished h3,
				.bh_ignored h3 {
					color: inherit;
				}
			`);
			markElements({
				rootSelector: "#deals",
				itemSelector: ".deal_game_image > img[src*='/steam/']",
				itemStringExtractor: (img) => img.src,
				closestSelector: ".game_deal_wrapper",
				addSteamLinkFunc: (item, closest, link) => {
					closest.querySelector(".deal_game_info").insertAdjacentElement("afterbegin", link);
					link.style.float = "left";
				},
			});
		},
		"steamgifts.com": function() {
			document.body.classList.add("bh_basic_style");

			GM_addStyle(`
				/* Removing insane text-shadow that is invisible, but still applied to the whole page text. */
				.page__outer-wrap {
					text-shadow: none;
				}
			`);

			// Giveaway lists:
			// /giveaways/search
			GM_addStyle(`
				/* Reordering the header, moving the icons to the left of the game title. */
				.giveaway__heading > * {
					order: 2;
				}
				.giveaway__heading > .giveaway__icon {
					order: 1;
				}
				/* Fixing the colors */
				.bh_owned   .giveaway__summary .giveaway__heading > *,
				.bh_wished  .giveaway__summary .giveaway__heading > *,
				.bh_ignored .giveaway__summary .giveaway__heading > *,
				.bh_owned   .giveaway__summary .giveaway__columns > *,
				.bh_wished  .giveaway__summary .giveaway__columns > *,
				.bh_ignored .giveaway__summary .giveaway__columns > * {
					color: inherit;
				}
			`);
			markElements({
				rootSelector: ".page__inner-wrap",
				itemSelector: "a.giveaway_image_thumbnail[style]",
				itemStringExtractor: (a) => a.style.backgroundImage,
				closestSelector: ".giveaway__row-inner-wrap",
			});

			// Giveaway wishlist:
			// /giveaways/wishlist
			GM_addStyle(`
				/* Fixing the colors */
				.bh_owned   .table__column__heading,
				.bh_wished  .table__column__heading,
				.bh_ignored .table__column__heading {
					color: inherit;
				}
			`);
			markElements({
				rootSelector: ".table",
				itemSelector: "a[href*='store.steampowered.com/']",
				itemStringExtractor: (a) => a.href,
				closestSelector: ".table__row-outer-wrap",
			});

			// Basic feature: coloring links from normal text.
			// https://www.steamgifts.com/discussion/iy081/steamground-wholesale-build-a-bundle-update-16-may
			markElements({
				itemSelector: "a[href*='store.steampowered.com/'], a[href*='steamcommunity.com/']",
				itemStringExtractor: (a) => a.href,
			});

		},
		"steamground.com": function() {
			document.body.classList.add("bh_basic_style");

			// The steam app id is only available on the pages for each individual game.
			// It may be possible to do a bunch of requests and parse each page to
			// get the steam id of each linked game… But that's a lot of work, more
			// work than I'm willing to do right now. And that's also bad, as it
			// will launch too many web requests.

			// Applies to each game page:
			// /games/foo-bar
			// /en/games/foo-bar
			GM_addStyle(`
				.bh_owned .inner__slider,
				.bh_wished .inner__slider,
				.bh_ignored .inner__slider {
					background-color: transparent;
				}
			`);
			markElements({
				rootSelector: ".content_inner",
				itemSelector: "a[href*='store.steampowered.com/']",
				itemStringExtractor: (a) => a.href,
				closestSelector: ".content_inner",
			});

			// Applies to:
			// /wholesale
			// /en/wholesale
			GM_addStyle(`
				.wholesale-card_info_about {
					display: inline-block;
					position: static;
				}
			`);
			// Doesn't work, because the steamground id is different than the steam id.
			// markElements({
			// 	rootSelector: ".opt-screen-container",
			// 	itemSelector: ".wholesale-card a[data-product-id]",
			// 	itemStringExtractor: (a) => "/app/" + a.dataset.productId,
			// 	closestSelector: ".wholesale-card",
			// 	addSteamLinkFunc: (item, closest, link) => {
			// 		closest.querySelector(".wholesale-card_info_about").insertAdjacentElement("beforebegin", link);
			// 	},
			// });
		},
		"steamkeys.ovh": function() {
			document.body.classList.add("bh_basic_style");

			markElements({
				rootSelector: "#gmm",
				itemSelector: "a[href*='store.steampowered.com/']",
				itemStringExtractor: (a) => a.href,
				closestSelector: "div.demo",
			});
		},
	};

	function processSite() {
		let hostname = document.location.hostname;
		// Removing the www. prefix, if present.
		hostname = hostname.replace(/^www\./, "");
		// Calling the site-specific code, if found.
		site_mapping[hostname]?.();
	}

	function main()
	{

		GM_addStyle(`
			bundle-helper {
				position: fixed;
				bottom: 0;
				left: 0;
				z-index: 99;
			}

			/* Background colors and background gradient copied from Enhanced Steam browser extension */
			body {
				--bh-bgcolor-owned: #00CE67;
				--bh-bgcolor-wished: #0491BF;
				--bh-bgcolor-ignored: #4F4F4F;
				--bh-fgcolor-owned: #FFFFFF;
				--bh-fgcolor-wished: #FFFFFF;
				--bh-fgcolor-ignored: #FFFFFF;
				--bh-steamlink-size: 24px;
			}
			.bh_owned {
				--bh-bgcolor: var(--bh-bgcolor-owned);
				--bh-fgcolor: var(--bh-fgcolor-owned);
			}
			.bh_wished {
				--bh-bgcolor: var(--bh-bgcolor-wished);
				--bh-fgcolor: var(--bh-fgcolor-wished);
			}
			.bh_ignored {
				--bh-bgcolor: var(--bh-bgcolor-ignored);
				--bh-fgcolor: var(--bh-fgcolor-ignored);
			}
			.bh_basic_style .bh_owned,
			.bh_basic_style .bh_wished,
			.bh_basic_style .bh_ignored {
				background: var(--bh-bgcolor) linear-gradient(135deg, rgba(0, 0, 0, 0.70) 10%, rgba(0, 0, 0, 0) 100%) !important;
				color: var(--bh-fgcolor) !important;
			}
			.bh_basic_style .bh_ignored {
				opacity: 0.3;
			}

			.bh_steamlink svg {
				width: var(--bh-steamlink-size);
				height: var(--bh-steamlink-size);
			}
		`);

		// Adding some statistics to the corner of the screen.
		addBundleHelperUI();

		// Run site-specific code.
		processSite();
	}

	main();

})();
