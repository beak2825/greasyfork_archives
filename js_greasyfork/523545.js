// ==UserScript==
// @name          AniList:RE
// @namespace     Kellen's userstyles
// @version       2.0.0
// @description   For anilist.co, this script enhances the display of anime and manga information by adding scores from multiple sources to the header, relocating and formatting genres and tags, and displaying both romaji and native titles.
// @author        kln (t.me/kln_lzt)
// @homepageURL   https://github.com/Kellenok/userscipts/
// @supportURL    https://github.com/Kellenok/userscipts/issues
// @match         https://anilist.co/*
// @connect       graphql.anilist.co
// @connect       api.jikan.moe
// @connect       kitsu.io
// @connect       shikimori.one
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM.xmlHttpRequest
// @grant         GM.setValue
// @grant         GM.getValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/523545/AniList%3ARE.user.js
// @updateURL https://update.greasyfork.org/scripts/523545/AniList%3ARE.meta.js
// ==/UserScript==
 
// This user script was tested with the following user script managers:
// - Violentmonkey (preferred): https://violentmonkey.github.io/
// - TamperMonkey: https://www.tampermonkey.net/
// - GreaseMonkey: https://www.greasespot.net/
 
(async function() {
	'use strict';
 
	/**
	 * Default user configuration options.
	 *
	 * You can override these options if your user script runner supports it. Your
	 * changes will persist across user script updates.
	 *
	 * In Violentmonkey:
	 * 1. Install the user script.
	 * 2. Let the script run at least once by loading an applicable url.
	 * 3. Click the edit button for this script from the Violentmonkey menu.
	 * 4. Click on the "Values" tab for this script.
	 * 5. Click on the configuration option you want to change and edit the value
	 *    (change to true or false).
	 * 6. Click the save button.
	 * 7. Refresh or visit the page to see the changes.
	 *
	 * In TamperMonkey:
	 * 1. Install the user script.
	 * 2. Let the script run at least once by loading an applicable url.
	 * 3. From the TamperMonkey dashboard, click the "Settings" tab.
	 * 4. Change the "Config mode" mode to "Advanced".
	 * 5. On the "Installed userscripts" tab (dashboard), click the edit button
	 *    for this script.
	 * 6. Click the "Storage" tab. If you don't see this tab be sure the config
	 *    mode is set to "Advanced" as described above. Also be sure that you have
	 *    visited an applicable page with the user script enabled first.
	 * 7. Change the value for any desired configuration options (change to true
	 *    or false).
	 * 8. Click the "Save" button.
	 * 9. Refresh or visit the page to see the changes. If it doesn't seem to be
	 *    working, refresh the TamperMonkey dashboard to double check your change
	 *    has stuck. If not try again and click the save button.
	 *
	 * Other user script managers:
	 * 1. Change any of the options below directly in the code editor and save.
	 * 2. Whenever you update this script or reinstall it you will have to make
	 *    your changes again.
	 */
	const defaultConfig = {
		/** When true, adds the AniList average score to the header. */
		addAniListScore: true,
 
		/** When true, adds the MyAnimeList score to the header. */
		addMyAnimeListScore: true,
 
		/** When true, adds the Kitsu score to the header. */
		addKitsuScore: false,
 
		/** When true, adds the Shikimori score to the header. */
		addShikimoriScore: false,
 
		/** When true, show the smile/neutral/frown icons next to the AniList score. */
		showIconWithAniListScore: true,
 
		/**
		 * When true, show AniList's "Mean Score" instead of the "Average Score".
		 * Regardless of this value, if the "Average Score" is not available
		 * then the "Mean Score" will be shown.
		 */
		preferAniListMeanScore: false,
 
		/** When true, shows loading indicators when scores are being retrieved. */
		showLoadingIndicators: true,
 
		/**
		 * Sets the main title to display.
		 * Possible values: 'native', 'romaji', 'english'.
		 */
		mainTitle: 'romaji',
 
		/**
		 * Sets the secondary title to display.
		 * Possible values: 'native', 'romaji', 'english'.
		 */
		secondaryTitle: 'english',
 
		/** Maximum number of tags to show initially */
		maxVisibleTags: 10,
 
	};
 
	/**
	 * Constants for this user script.
	 */
	const constants = {
		/** Endpoint for the AniList API */
		ANI_LIST_API: 'https://graphql.anilist.co',
 
		/** Endpoint for the MyAnimeList API */
		MAL_API: 'https://api.jikan.moe/v4',
 
		/** Endpoint for the Kitsu API */
		KITSU_API: 'https://kitsu.io/api/edge',
 
		SHIKI_API: 'https://shikimori.one/api',
 
		/** Regex to extract the page type and media id from a AniList url path */
		ANI_LIST_URL_PATH_REGEX: /(anime|manga)\/([0-9]+)/i,
 
		/** Prefix message for logs to the console */
		LOG_PREFIX: '[AniList Unlimited User Script]',
 
		/** Prefix for class names added to created elements (prevent conflicts) */
		CLASS_PREFIX: 'kln',
 
		/** Title suffix added to created elements (for user information) */
		CUSTOM_ELEMENT_TITLE: '(by kln)',
 
		/** When true, output additional logs to the console */
		DEBUG: false,
 
		/** Maximum number of tags to show initially */
		MAX_TAGS_VISIBLE: 10,
 
		SEPERATOR: ' · ',
		SPOILER_TAG_SELECTOR: '.spoiler-toggle',
 
		SHOW_MORE_TEXT: ' more',
		COLLAPSE_TEXT: 'Collapse',
	};
 
	/**
	 * User script manager functions.
	 *
	 * Provides compatibility between Tampermonkey, Greasemonkey 4+, etc...
	 */
	const userScriptAPI = (() => {
		const api = {};
 
		if (typeof GM_xmlhttpRequest !== 'undefined') {
			api.GM_xmlhttpRequest = GM_xmlhttpRequest;
		} else if (
			typeof GM !== 'undefined' &&
			typeof GM.xmlHttpRequest !== 'undefined'
		) {
			api.GM_xmlhttpRequest = GM.xmlHttpRequest;
		}
 
		if (typeof GM_setValue !== 'undefined') {
			api.GM_setValue = GM_setValue;
		} else if (
			typeof GM !== 'undefined' &&
			typeof GM.setValue !== 'undefined'
		) {
			api.GM_setValue = GM.setValue;
		}
 
		if (typeof GM_getValue !== 'undefined') {
			api.GM_getValue = GM_getValue;
		} else if (
			typeof GM !== 'undefined' &&
			typeof GM.getValue !== 'undefined'
		) {
			api.GM_getValue = GM.getValue;
		}
 
		/** whether GM_xmlhttpRequest is supported. */
		api.supportsXHR = typeof api.GM_xmlhttpRequest !== 'undefined';
 
		/** whether GM_setValue and GM_getValue are supported. */
		api.supportsStorage =
			typeof api.GM_getValue !== 'undefined' &&
			typeof api.GM_setValue !== 'undefined';
 
		return api;
	})();
 
	/**
	 * Utility functions.
	 */
	const utils = {
		/**
		 * Logs an error message to the console.
		 *
		 * @param {string} message - The error message.
		 * @param  {...any} additional - Additional values to log.
		 */
		error(message, ...additional) {
			console.error(`${constants.LOG_PREFIX} Error: ${message}`, ...additional);
		},
 
		/**
		 * Logs a group of related error messages to the console.
		 *
		 * @param {string} label - The group label.
		 * @param  {...any} additional - Additional error messages.
		 */
		groupError(label, ...additional) {
			console.groupCollapsed(`${constants.LOG_PREFIX} Error: ${label}`);
			additional.forEach(entry => {
				console.log(entry);
			});
			console.groupEnd();
		},
 
		/**
		 * Logs a debug message which only shows when constants.DEBUG = true.
		 *
		 * @param {string} message The message.
		 * @param  {...any} additional - ADditional values to log.
		 */
		debug(message, ...additional) {
			if (constants.DEBUG) {
				console.debug(`${constants.LOG_PREFIX} ${message}`, ...additional);
			}
		},
 
		/**
		 * Makes an XmlHttpRequest using the user script util.
		 *
		 * Common options include the following:
		 *
		 * - url (url endpoint, e.g., https://api.endpoint.com)
		 * - method (e.g., GET or POST)
		 * - headers (an object containing headers such as Content-Type)
		 * - responseType (e.g., 'json')
		 * - data (body data)
		 *
		 * See https://wiki.greasespot.net/GM.xmlHttpRequest for other options.
		 *
		 * If `options.responseType` is set then the response data is returned,
		 * otherwise `responseText` is returned.
		 *
		 * @param {Object} options - The request options.
		 *
		 * @returns A Promise that resolves with the response or rejects on any
		 * errors or status code other than 200.
		 */
		xhr(options) {
			return new Promise((resolve, reject) => {
				const xhrOptions = Object.assign({}, options, {
					onabort: res => reject(res),
					ontimeout: res => reject(res),
					onerror: res => reject(res),
					onload: res => {
						if (res.status === 200) {
							if (options.responseType && res.response) {
								resolve(res.response);
							} else {
								resolve(res.responseText);
							}
						} else {
							reject(res);
						}
					},
				});
 
				userScriptAPI.GM_xmlhttpRequest(xhrOptions);
			});
		},
 
		/**
		 * Waits for an element to load.
		 *
		 * @param {string} selector - Wait for the element matching this
		 * selector to be found.
		 * @param {Element} [container=document] - The root element for the
		 * selector, defaults to `document`.
		 * @param {number} [timeoutSecs=7] - The number of seconds to wait
		 * before timing out.
		 *
		 * @returns {Promise<Element>} A Promise returning the DOM element, or a
		 * rejection if a timeout occurred.
		 */
		async waitForElement(selector, container = document, timeoutSecs = 7) {
			const element = container.querySelector(selector);
			if (element) {
				return Promise.resolve(element);
			}
 
			return new Promise((resolve, reject) => {
				const timeoutTime = Date.now() + timeoutSecs * 1000;
 
				const handler = () => {
					const element = document.querySelector(selector);
					if (element) {
						resolve(element);
					} else if (Date.now() > timeoutTime) {
						reject(new Error(`Timed out waiting for selector '${selector}'`));
					} else {
						setTimeout(handler, 100);
					}
				};
 
				setTimeout(handler, 1);
			});
		},
		/**
		 * Waits for an element to load.
		 *
		 * @param {string} selector - Wait for the element matching this
		 * selector to be found.
		 * @param {Element} [container=document] - The root element for the
		 * selector, defaults to `document`.
		 * @param {string} text - The text content the element needs to have.
		 * @param {number} [timeoutSecs=7] - The number of seconds to wait
		 * before timing out.
		 *
		 * @returns {Promise<Element>} A Promise returning the DOM element, or a
		 * rejection if a timeout occurred.
		 */
		async waitForElementWithText(selector, container = document, text, timeoutSecs = 7) {
 
			return new Promise((resolve, reject) => {
				const timeoutTime = Date.now() + timeoutSecs * 1000;
				const handler = () => {
					const elements = container.querySelectorAll(selector);
					let element = null;
					for (const el of elements) {
						if (el.textContent.trim() === text) {
							element = el;
							break;
						}
					}
					if (element) {
						resolve(element);
					} else if (Date.now() > timeoutTime) {
						reject(new Error(`Timed out waiting for selector '${selector}' with text '${text}'`));
					} else {
						setTimeout(handler, 100);
					}
				};
 
				setTimeout(handler, 1);
			});
		},
		/**
		 * Removes all children from a given DOM element.
		 * @param {HTMLElement} element
		 */
		clearElement(element) {
			while (element.firstChild) {
				element.removeChild(element.firstChild)
			}
		},
 
		/**
		 * Loads user configuration from storage.
		 *
		 * @param {Object} defaultConfiguration - An object containing all of
		 * the user configuration keys mapped to their default values. This
		 * object will be used to set an initial value for any keys not currently
		 * in storage.
		 *
		 * @param {Boolean} [setDefault=true] - When true, save the value from
		 * defaultConfiguration for keys not present in storage for next time.
		 * This lets the user edit the configuration more easily.
		 *
		 * @returns {Promise<Object>} A Promise returning an object that has the
		 * config from storage, or an empty object if the storage APIs are not
		 * defined.
		 */
		async loadUserConfiguration(defaultConfiguration, setDefault = true) {
			if (!userScriptAPI.supportsStorage) {
				utils.debug('User configuration is not enabled');
				return {};
			}
 
			const userConfig = {};
 
			for (let [key, value] of Object.entries(defaultConfiguration)) {
				const userValue = await userScriptAPI.GM_getValue(key);
 
				// init any config values that haven't been set
				if (setDefault && userValue === undefined) {
					utils.debug(`setting default config value for ${key}: ${value}`);
					await userScriptAPI.GM_setValue(key, value);
				} else {
					userConfig[key] = userValue;
				}
			}
 
			utils.debug('loaded user configuration from storage', userConfig);
			return userConfig;
		},
	};
 
	/**
	 * Functions to make API calls.
	 */
	const api = {
		/**
		 * Loads data from the AniList API.
		 *
		 * @param {('anime'|'manga')} type - The type of media content.
		 * @param {string} aniListId - The AniList media id.
		 *
		 * @returns {Promise<Object>} A Promise returning the media's data, or a
		 * rejection if there was a problem calling the API.
		 */
		async fetchAniListData(type, aniListId) {
			var query = `
                query ($id: Int, $type: MediaType) {
                    Media (id: $id, type: $type) {
                        idMal
                        averageScore
                        meanScore
                        title {
                          english
                          romaji
                        }
                    }
                }
            `;
 
			const variables = {
				id: aniListId,
				type: type.toUpperCase(),
			};
 
			try {
				const response = await utils.xhr({
					url: constants.ANI_LIST_API,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					responseType: 'json',
					data: JSON.stringify({
						query,
						variables,
					}),
				});
				utils.debug('AniList API response:', response);
 
				return response.data.Media;
			} catch (res) {
				const message = `AniList API request failed for media with ID '${aniListId}'`;
				utils.groupError(
					message,
					`Request failed with status ${res.status}`,
					...(res.response ? res.response.errors : [res])
				);
				const error = new Error(message);
				error.response = res;
				throw error;
			}
		},
 
		/**
		 * Loads data from the MyAnimeList API.
		 *
		 * @param {('anime'|'manga')} type - The type of media content.
		 * @param {string} myAnimeListId - The MyAnimeList media id.
		 *
		 * @returns {Promise<Object>} A Promise returning the media's data, or a
		 * rejection if there was a problem calling the API.
		 */
		async fetchMyAnimeListData(type, myAnimeListId) {
			try {
				const response = await utils.xhr({
					url: `${constants.MAL_API}/${type}/${myAnimeListId}`,
					method: 'GET',
					responseType: 'json',
				});
				utils.debug('MyAnimeList API response:', response);
 
				return response.data;
			} catch (res) {
				const message = `MyAnimeList API request failed for mapped MyAnimeList ID '${myAnimeListId}'`;
				utils.groupError(
					message,
					`Request failed with status ${res.status}`,
					res.response ? res.response.error || res.response.message : res
				);
				const error = new Error(message);
				error.response = res;
				throw error;
			}
		},
 
		/**
		 * Loads data from the Shikimori API.
		 *
		 */
		async fetchShikimoriData(pageType, shikimoriId) {
			let type;
			try {
				type = pageType === 'anime' ? 'animes' : 'mangas';
				const response = await utils.xhr({
					url: `${constants.SHIKI_API}/${type}/${shikimoriId}`,
					method: 'GET',
					responseType: 'json',
				});
 
				utils.debug('Shikimori API response:', response);
				return response;
			} catch (res) {
				const message = `Shikimori API request failed for mapped Shikimori ID '${shikimoriId}'`;
				utils.groupError(
					message,
					`Request failed with status ${res.status}`,
					res.response ? res.response.error || res.response.message : res
				);
 
				const error = new Error(message);
				error.response = res;
				throw error;
			}
		},
 
		/**
		 * Loads data from the Kitsu API.
		 *
		 * @param {('anime'|'manga')} type - The type of media content.
		 * @param {string} englishTitle - Search for media with this title.
		 * @param {string} romajiTitle - Search for media with this title.
		 *
		 * @returns {Promise<Object>} A Promise returning the media's data, or a
		 * rejection if there was a problem calling the API.
		 */
		async fetchKitsuData(type, englishTitle, romajiTitle) {
			try {
				const fields = 'slug,averageRating,userCount,titles';
				const response = await utils.xhr({
					url: encodeURI(
						`${constants.KITSU_API
                        }/${type}?page[limit]=3&fields[${type}]=${fields}&filter[text]=${englishTitle || romajiTitle
                        }`
					),
					method: 'GET',
					headers: {
						Accept: 'application/vnd.api+json',
						'Content-Type': 'application/vnd.api+json',
					},
					responseType: 'json',
				});
				utils.debug('Kitsu API response:', response);
 
				if (response.data && response.data.length) {
					let index = 0;
					let isExactMatch = false;
 
					const collator = new Intl.Collator({
						usage: 'search',
						sensitivity: 'base',
						ignorePunctuation: true,
					});
 
					const matchedIndex = response.data.findIndex(result => {
						return Object.values(result.attributes.titles).find(kitsuTitle => {
							return (
								collator.compare(englishTitle, kitsuTitle) === 0 ||
								collator.compare(romajiTitle, kitsuTitle) === 0
							);
						});
					});
 
					if (matchedIndex > -1) {
						utils.debug(
							`matched title for Kitsu result at index ${matchedIndex}`,
							response.data[index]
						);
						index = matchedIndex;
						isExactMatch = true;
					} else {
						utils.debug('exact title match not found in Kitsu results');
					}
 
					return {
						isExactMatch,
						data: response.data[index].attributes,
					};
				} else {
					utils.debug(`Kitsu API returned 0 results for '${englishTitle}'`);
					return {};
				}
			} catch (res) {
				const message = `Kitsu API request failed for text '${englishTitle}'`;
				utils.groupError(
					message,
					`Request failed with status ${res.status}`,
					...(res.response ? res.response.errors : [])
				);
				const error = new Error(message);
				error.response = res;
				throw error;
			}
		},
	};
 
	/**
	 * AniList SVGs.
	 */
	const svg = {
		/** from AniList */
		smile: '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="smile" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="rgb(var(--color-green))" class="icon svg-inline--fa fa-smile fa-w-16"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z" class=""></path></svg>',
		/** from AniList */
		neutral: '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="meh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="rgb(var(--color-orange))" class="icon svg-inline--fa fa-meh fa-w-16"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z" class=""></path></svg>',
		/** from AniList */
		frown: '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="frown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="rgb(var(--color-red))" class="icon svg-inline--fa fa-frown fa-w-16"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z" class=""></path></svg>',
		/**  From https://github.com/SamHerbert/SVG-Loaders */
		// License/accreditation https://github.com/SamHerbert/SVG-Loaders/blob/master/LICENSE.md
		loading: '<svg width="60" height="8" viewbox="0 0 130 32" style="fill: rgb(var(--color-text-light, 80%, 80%, 80%))" xmlns="http://www.w3.org/2000/svg" fill="#fff"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/></circle><circle cx="60" cy="15" r="9" fill-opacity=".3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from=".5" to=".5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"/></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/></circle></svg>',
		mal: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" version="1.1" id="svg1" width="18" height="18" viewBox="0 0 256 256"><defs id="defs1"/><g id="g1"><rect style="opacity:1;fill:#2e51a2;fill-opacity:1;stroke-width:0.999999;stroke-linejoin:round;paint-order:stroke fill markers" id="rect2" width="256" height="256" x="0" y="0"/><path id="path1" style="fill:#ffffff;fill-opacity:1;stroke-linejoin:round;paint-order:stroke fill markers" d="m 30.638616,88.40918 v 68.70703 h 17.759766 v -41.91016 l 15.470703,19.77344 16.67825,-19.77344 v 41.91016 H 98.307101 V 88.40918 H 80.547335 L 63.869085,109.82324 48.398382,88.40918 Z"/><path id="path1-1" style="fill:#ffffff;fill-opacity:1;stroke-linejoin:round;paint-order:stroke fill markers" d="m 182.49799,88.40918 v 68.70703 h 39.07974 l 3.78365,-14.65739 H 200.25775 V 88.40918 Z"/><path id="path1-1-8" style="fill:#ffffff;fill-opacity:1;stroke-linejoin:round;paint-order:stroke fill markers" d="m 149.65186,88.40918 c -21.64279,0 -35.06651,10.210974 -39.36914,25.39258 -4.19953,14.81779 0.34128,34.3715 10.28711,53.78906 l 14.85742,-10.47461 c 0,0 -7.06411,-9.21728 -8.39453,-23.03516 h 21.98437 v 23.03516 h 19.73438 v -51.67969 h -19.73438 v 14.9668 H 130.8003 c 1.71696,-11.1972 8.295,-17.30859 15.46875,-17.30859 h 25.8164 l -5.12304,-14.68555 z"/></g></svg>',
		shiki: '<svg class="svg-inline--fa fa-shikimori" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="shikimori" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105 105"><path class="" fill="currentColor" d="m6.7 104-.9-.5-.9-.4c0-.1.3-.5.9-1 1.6-1.5 3-3 3.6-4l1.5-1.9c2.4-2.7 5.7-7.6 8.4-12.7 1.7-3.3 1.8-3.6 2-6a73.3 73.3 0 0 0-.8-15.4c0-.1-.4 0-3.2 1.2a15 15 0 0 0-3.1 1.7l-1.6 1c-1.4.8-1.8.8-4 .3-2-.4-3-1-5-2.8l-.9-.9-2-3.2-.7-.8.2-.8c.2-.7.2-1.2.2-2.6v-2c.1 0 .2-.5.1-.8v-.7l.8-.3c.4-.3 1-.4 1.2-.4.4 0 .6 0 .8-.3 1-.8 1.6-1 2.3-.6.4.1.4.2.3 1.3 0 1.4 0 1.5 1 1.7 1.2.2 2.5 0 6.2-.6l8.6-1.3c.2 0 .4-.2.8-.7l1.2-1.3.7-.6h1.1c2 .2 4.4.5 5.2.8.7.2.8.2 2.2 0l2.8-.4c3.3-.3 3.8-.4 4-.6h.3l.5-.1c1.2-.7 1.4-.8 3.3-.8 1.1 0 2.3 0 2.9-.2 2.5-.5 10-1.5 13.6-1.7h1.3l-.2-.4c-.2-.5-.2-.7 0-.6H63.3l.7-1 .9-1.2c.1-.2.2-.2.9.5.4.4.9 1 1 1.4l.3.6H69a487 487 0 0 1 13.1 0l2 .1c.8 0 .8.1-.5-1.6-.9-1.1-2-2.2-2.8-2.5l-.8-.5a12 12 0 0 0-2.4-1 11.5 11.5 0 0 1-2.9-1.3s-.7 0-1.3-.2c-1-.3-1.2-.3-1.2-.5 0-.5 1.1-.3 3.7.6 1.1.4 1.5.5 1.5.3 0 0-.6-.4-1.8-.8a6.5 6.5 0 0 1-1.9-.7c0-.1.1-.2.3-.2.3 0 0-.1-.4-.2l-.4-.3-.1-.3s-.1 0 0-.2l-.1-.1c-.2 0-.6.5-1.1 1.3a3 3 0 0 1-.6.9h-1l-1.3-.2c-.2 0-.2 0-.2-.2s-.2-.3-1.7-.4c-1.2-.1-1.7-.2-1.8 0-.2.1-.4.1-.4 0a221.7 221.7 0 0 0-6.6-.5l-.1.1c-.3.1-.3.1-.3-.2 0-.4 0-.4-1.1-.4h-1c0 .1 0 .2.2.2l.6.3 1 .3h.5l.2.2h-1.7l-.8.1.5.1.8.5.3.4-.7.1-1 .3V37h-.4l-.8.4c-.3.2-.5.2-1.2.2h-1V37c-.2-.6-.3-.7-.7-.2-.2.3-.4.5-.6.5 0 0-.1 0 0 .2 0 .2 0 .3-.2.3a289 289 0 0 1-9.4.2l-1 .2h.4l1 .2c.6.2 0 .3-1.8.3-2.2 0-2.6 0-2.1.4.2.2.1.2-.6.3H36c-.4 0-.5 0-.3.2h1c.6 0 .8.1.4.3l-1.7.2c-1.3.1-2.8.4-3.1.7l-.9.2-1.1.1-2 .3c-1 0-1.7.2-2 .3-.5.3-.8.3-4.3.2a29.8 29.8 0 0 1-8-.8c-1.9-.4-5.3-2.3-6.7-3.7-1.3-1.3-1.5-1.7-2.1-5.3-.3-1.7-.4-2.1-.3-4.2 0-2.6.2-3.4 1.2-5.4 1.9-4 4.7-6 7.7-5 1.4.3 2.8.6 3.4.6.9 0 2.7.3 2.9.5.2.3-.3.4-2.7.4-2.5.1-3.1.2-4.4.8-1 .5-1.5 1.1-2 2.1l-.2.5.6.5c1.1 1 3 2 5 2.5l4 .7a27 27 0 0 1 3.7.8c.2 0 1 0 1.6.2 1.3.1 1.8.4.6.3h-.4c.2.2.5.2 1.2 0 .9 0 1.5 0 1.5.2h-.2c-.1 0-.2.1-.1.2l1.2.2a1323.8 1323.8 0 0 0 11.9 1.2c.2.1.2.2 0 .3-.2.2-.2.2.4.3.6.1.7.1.8 0 .1-.2.5-.2 2-.2 1.8 0 1.9 0 2 .2.1.3 0 .3-.5.4l-.9.2c-.7 0 3.4.5 4.9.5l2.7.3c1.4.2 2.2.2 5 .2a64.6 64.6 0 0 1 7.4.2h.7l1.6.3 2.2.5c.8.3 3.4.7 5.3.9.7 0 1.8.3 2.5.5l2.3.6a17 17 0 0 1 6 2.5c2.3 1.2 3.7 3.6 4.1 7.1v1.3c-.2.2-.2.2.8.4 1 .3 2.1.8 2 1.1l-.1.3c-.2.3.7 1.2 1.2 1.4l1 .5c.3.2.4.3.4.8 0 .4 0 .7.5 1.3.3.5.7 1 1 1.2.4.5.5 1 .2 1.5l-.5 2.3c-.4 2-.5 2.2-1.6 2.8-.8.3-.8.4-1.5 1.5-.6.9-.5 1.2.5 2 .7.4-.1.3-1.2-.2-.6-.3-1-.2-1.8.3-.5.3-.7.4-2 .5H88l-1.6-1c-1-.6-1.7-1-2-1l-2-1-2.2-1.3-7.2-2 .5 1.8a35 35 0 0 1 2.3 8c.5 3.6 1.3 8.2 1.5 8.9.7 2 1.8 3.8 5.1 8 3 4 6.7 9 7 9.6.5.8 1.3 4 1.3 4.9 0 .1-.2.3-.5.4-.5.2-.6.5-.6 1.4 0 .5-.6 1.3-1.8 2.5-.9.9-1 1-1.6 1-1 .2-2.8.2-3.4 0-1.4-.4-1.5-.5-1.7-1l-.7-1-1.1-1.5a6.5 6.5 0 0 0-2.6-2.3c-.9-.4-2.2-1.2-3.6-2.3-1.1-.8-2-1.8-2.6-3l-1.2-2a11 11 0 0 1-1.8-3.8c-.3-1.2-.4-1.5-.4-4.2L67 73a31 31 0 0 0-.9-9.6 159 159 0 0 0-2.4-7.8l-1.6-.2c-1.4-.2-1.9-.1-3.2 0-1 .2-1.8.2-2.8.2h-1.3a195.1 195.1 0 0 1 4 19c.4 2.1.4 5.4.2 8.2-.3 2.2-.5 3.4-1.2 5.1a4.3 4.3 0 0 1-1.4 2c-.8.8-1 1.3-1 1.9 0 .4-1 1.8-1.6 2.1l-.8 1-.7.8a7 7 0 0 0-.8.6c-.7.6-1.3.9-2.5 1-2 0-2 0-4.4-2.3a25.4 25.4 0 0 0-3-2.7c-.9-.5-1.1-.8-1.3-1.2a8 8 0 0 0-2.7-2.4c-.5-.2-.8-.5-.9-.6 0-.2-.5-.6-.9-1a4 4 0 0 1-1-1c0-.2-.3-.5-.5-.6a3 3 0 0 1-.6-.7L33 84c-.2-.2-.3-.3-.2-.7l-.1-.7c-.2-.2-.2-.2 0-.2l.3-.1-1.1-1.4a18 18 0 0 1-1-1.4l1.7.8a76.2 76.2 0 0 0 8.1 3.5c1.7.7 2.3.8 2.8.4.8-.6.9-.8 1-5.5.1-4.9.2-6.2.7-10.6a47.2 47.2 0 0 0 .3-11 23.7 23.7 0 0 0-6 1l-2.7.7-2.5.5-3.4.5-2.4.3-.6.4c-.2.3-.8.7-1.3 1-.8.5-1 .6-1.1 1.7-.5 2.1-.2 4.8.7 7.7.5 1.7.7 2.2 1.5 3.5 1.5 2.2 2 3.8 2 6.6.1 1.7.1 1.9.5 2.5.2.3.4.7.4 1 .1.4-.3 2.1-.7 2.8l-.4.9c-.1.5-1.2 1.4-2.5 2.2a63 63 0 0 0-6.2 5.8 42.1 42.1 0 0 1-6.1 5.9c-.8.6-1.4.9-2.1 1a5 5 0 0 0-1.2.2c-.7.2-1.5.2-2 0l-.3-.3-1 .5c-1 .5-1.2.5-1.4.3zm78.8-59.3c-.2-.2-.4-.2-.5-.2-.2 0 .2.4.6.4.2 0 .2 0-.1-.2zm-9.2-8c.2-.2.1-.2 0-.2a.6.6 0 0 1-.5-.2c-.1-.3-.1-.2-.1 0s0 .4.3.4h.3zM55 36s.1-.2 0-.2c0-.2-.6 0-.5.2h.5zm16-.8c.6-.1.7-.2.7-.5s.1-.3.8-.3H74c.8.2.6 0-.3-.2-.2 0-.3 0-.3-.2H75c0-.2-.2-.2-.4-.1-.1 0-.5 0-.9-.2-.7-.2-.7-.2-1.2.1-.5.3-.7.3-1.5.2h-1c-.2.2-.3.2-.6 0-.3-.3-.5-.3-1.6-.3h-1.3l2.2.4 2.2.5c.1.2-.5 0-2.8-.2a35.2 35.2 0 0 0-2-.2c1.6.3 3 .6 3.5.9.6.3.5.3 1.4 0z M58.8 37.4c0-.3.2-.5.4-.5.3 0 .5 0 .7.4.2.2.2.2-.5.2l-.6-.1zM47.1 30.3a3 3 0 0 1 1.6-.6c.5-.1.5 0 .1.4-.5.4-.8.5-1.5.5h-.6l.4-.3zM82.3 28v-1c0-1-.2-1.5-.8-2.2-.5-.4-2.7-1.6-4.2-2.1a115 115 0 0 0-25-2.6 129.9 129.9 0 0 1-17.1-1.5c.1 0-.3-.2-1.6-.4-2.1-.3-2-.3-2 0l-.1.1-.2-.1c0-.1 0-.1-.2 0-.2.2-.5 0-.5-.2s-.4-.4-1.5-.5l-1.2-.3-.3.1.4.1c.5 0 .9.2.9.4 0 .1-.1.2-.7 0-1.2 0-1.8-.3-1.8-.5s0-.2.2-.2.2 0 0-.2a1 1 0 0 0-.4 0c-.2 0-.4-.2-.5-.3a22 22 0 0 0-2.7-1c-6.7-2-9.2-3.3-11.6-5.9-.8-.8-1.8-2.2-1.8-2.4 0-.2.4 0 .5.2.2.4 1 1 1.7 1.6.3.2.7.5.8.8l.5.4.9.6c.8.6 2.6 1.6 2.8 1.5l-.4-.4c-.6-.4-1.4-1.4-2.8-3.3l-1-1.2V8c0 .6 0 .7-.1.5L11.9 7c-.3-.8-.6-1.3-1-1.8-.6-.7-.8-1.1-.7-1.2.1-.2 1 .7 1.2 1.2l.6 1 .4.5v-.4c0-.6.2-.6 1.5.1 2 1 3.5 1.5 4.9 1.6.7 0 1.8.2 2.7.4a42.6 42.6 0 0 0 11.9 1.2l4.6.2a162.4 162.4 0 0 0-7.8-.8c0-.1.7-.2 3-.1h3.2c.5-.2 2.4-.4 6-.6 1.2-.1 2-.2 2.5-.4l4.5-.9c1.5-.2 1.8-.4 2.4-.7.4-.4.6-.5 1.2-.5h1.2c.4-.2 2-.1 4.5 0 2.2.2 4.2.2 4.8.2 1.4-.2 6 0 8.1.4 1.5.2 2.3.4 3.3.8L77 8c1.9.6 3.3 1.5 4.8 3.1 1.3 1.4 1.5 2 2.6 5.5a14 14 0 0 1 1 4.8c.1 2.7 0 3.4-1.4 4.6-.4.3-.7.7-.7.8 0 .7-.8 1.4-1.1 1z"></path></svg>',
		kitsu: `<svg xmlns="http://www.w3.org/2000/svg" fill="#ef4f37" width="18px" height="18px" viewBox="0 0 24 24" role="img"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"><path d="M1.429 5.441a12.478 12.478 0 0 0 1.916 2.056c.011.011.022.011.022.022.452.387 1.313.947 1.937 1.173 0 0 3.886 1.496 4.091 1.582a1.4 1.4 0 0 0 .237.075.694.694 0 0 0 .808-.549c.011-.065.022-.172.022-.248V5.161c.011-.667-.205-1.679-.398-2.239 0-.011-.011-.022-.011-.032A11.979 11.979 0 0 0 8.824.36L8.781.285a.697.697 0 0 0-.958-.162c-.054.032-.086.075-.129.119L7.608.36a4.743 4.743 0 0 0-.786 3.412 8.212 8.212 0 0 0-.775.463c-.043.032-.42.291-.71.56A4.803 4.803 0 0 0 1.87 4.3c-.043.011-.097.021-.14.032-.054.022-.107.043-.151.076a.702.702 0 0 0-.193.958l.043.075zM8.222 1.07c.366.614.678 1.249.925 1.917-.495.086-.98.215-1.453.388a3.918 3.918 0 0 1 .528-2.305zM4.658 5.463a7.467 7.467 0 0 0-.893 1.216 11.68 11.68 0 0 1-1.453-1.55 3.825 3.825 0 0 1 2.346.334zm13.048-.302a7.673 7.673 0 0 0-2.347-.474 7.583 7.583 0 0 0-3.811.818l-.215.108v3.918c0 .054 0 .258-.032.431a1.535 1.535 0 0 1-.646.98 1.545 1.545 0 0 1-1.152.247 2.618 2.618 0 0 1-.409-.118 747.6 747.6 0 0 1-3.402-1.313 8.9 8.9 0 0 0-.323-.129 30.597 30.597 0 0 0-3.822 3.832l-.075.086a.698.698 0 0 0 .538 1.098.676.676 0 0 0 .42-.118c.011-.011.022-.022.043-.032 1.313-.947 2.756-1.712 4.284-2.325a.7.7 0 0 1 .818.13.704.704 0 0 1 .054.915l-.237.388a20.277 20.277 0 0 0-1.97 4.306l-.032.129a.646.646 0 0 0 .108.538.713.713 0 0 0 .549.301.657.657 0 0 0 .42-.118c.054-.043.108-.086.151-.14l.043-.065a18.95 18.95 0 0 1 1.765-2.153 20.156 20.156 0 0 1 10.797-6.018c.032-.011.065-.011.097-.011.237.011.42.215.409.452a.424.424 0 0 1-.344.398c-3.908.829-10.948 5.469-8.483 12.208.043.108.075.172.129.269a.71.71 0 0 0 .538.301.742.742 0 0 0 .657-.398c.398-.754 1.152-1.593 3.326-2.497 6.061-2.508 7.062-6.093 7.17-8.364v-.129a7.716 7.716 0 0 0-5.016-7.451zm-6.083 17.762c-.56-1.669-.506-3.283.151-4.823 1.26 2.035 3.456 2.207 3.456 2.207-2.25.937-3.133 1.863-3.607 2.616z"/></g></svg>`
	};
 
	/**
	 * Handles manipulating the current AniList page.
	 */
	class AniListPage {
		constructor(config) {
			this.selectors = {
				pageTitle: 'head > title',
				header: '.page-content .header .content',
				headerContainer: '.page-content .header .container',
				sidebar: '.page-content .sidebar',
				genresContainer: '.data-set.data-list .type',
				tagsContainer: '.tags',
				tagItem: '.tag',
				genreItem: '.data-set.data-list .value a',
				pageBanner: '.page-content .container .banner',
				pageContent: '.page-content',
				pageContainer: '.page-content .header .container',
				romajiTitle: '.data-set .type',
				nativeTitle: '.data-set .type',
				h1Title: '.page-content .header .content h1',
				coverWrap: '.page-content .header .cover-wrap',
				content: '.page-content .header .content',
			};
			this.headerCache = null;
			this.lastProcessedPath = null;
			this.config = config;
		}
 
		/**
		 * init the page and apply page modifications.
		 */
		init() {
			utils.debug('initializing page');
			this.applyModifications().catch(e =>
				utils.error(`Unable to apply modifications to the page - ${e.message}`)
			);
 
			// eslint-disable-next-line no-unused-vars
			const observer = new MutationObserver((mutations, observer) => {
				utils.debug('mutation observer', mutations);
				this.applyModifications().catch(e =>
					utils.error(
						`Unable to apply modifications to the page - ${e.message}`
					)
				);
			});
 
			const target = document.querySelector(this.selectors.pageTitle);
			observer.observe(target, {
				childList: true,
				characterData: true
			});
		}
 
		/**
		 * Applies modifications to the page based on config settings.
		 *
		 * This will only add content if we are on a relevant page in the app.
		 */
		async applyModifications() {
			const pathname = window.location.pathname;
			utils.debug('checking page url', pathname);
 
			if (this.lastProcessedPath === pathname) {
				utils.debug('url path did not change, skipping');
				return;
			}
			this.lastProcessedPath = pathname;
 
			const matches = constants.ANI_LIST_URL_PATH_REGEX.exec(pathname);
			if (!matches) {
				utils.debug('url did not match');
				return;
			}
			const pageType = matches[1];
			const mediaId = matches[2];
			utils.debug('pageType:', pageType, 'mediaId:', mediaId);
 
 
			const aniListData = await api.fetchAniListData(pageType, mediaId);
 
			if (this.config.addAniListScore) {
				this.addAniListScore(pageType, mediaId, aniListData);
			}
 
			if (this.config.addShikimoriScore) {
				this.addShikimoriScore(pageType, mediaId, aniListData);
			}
 
			if (this.config.addMyAnimeListScore) {
				this.addMyAnimeListScore(pageType, mediaId, aniListData);
			}
 
			if (this.config.addKitsuScore) {
				this.addKitsuScore(pageType, mediaId, aniListData);
			}
			await this.applyGenresAndTagsModifications();
			await this.applyTitlesModifications();
			this.correctGrid();
 
		}
 
		/**
		 * Adds the AniList score to the header.
		 *
		 * @param {('anime'|'manga')} type - The type of media content.
		 * @param {string} mediaId - The AniList media id.
		 * @param {Object} aniListData - The data from the AniList api.
		 */
		async addAniListScore(pageType, mediaId, aniListData) {
			const slot = 1;
			const source = 'AniList';
 
			let rawScore, info;
			if (
				aniListData.meanScore &&
				(this.config.preferAniListMeanScore || !aniListData.averageScore)
			) {
				rawScore = aniListData.meanScore;
				info = ' (mean)';
			} else if (aniListData.averageScore) {
				rawScore = aniListData.averageScore;
				info = ' (average)';
			}
 
			const score = rawScore ? `${rawScore}%` : '(N/A)';
 
			let iconMarkup;
			if (this.config.showIconWithAniListScore) {
				if (rawScore === null || rawScore == undefined) {
					iconMarkup = svg.neutral;
				} else if (rawScore >= 75) {
					iconMarkup = svg.smile;
				} else if (rawScore >= 60) {
					iconMarkup = svg.neutral;
				} else {
					iconMarkup = svg.frown;
				}
			}
 
			this.addScores({
				slot,
				source,
				score,
				iconMarkup,
				info,
				href: `https://anilist.co/${pageType}/${mediaId}`
			}).catch(e => {
				utils.error(
					`Unable to add the ${source} score to the header: ${e.message}`
				);
			});
		}
 
 
 
		/**
		 * Adds the MyAnimeList score to the header.
		 *
		 * @param {('anime'|'manga')} type - The type of media content.
		 * @param {string} mediaId - The AniList media id.
		 * @param {Object} aniListData - The data from the AniList api.
		 */
		async addMyAnimeListScore(pageType, mediaId, aniListData) {
			const slot = 2;
			const source = 'MyAnimeList';
 
			if (!aniListData.idMal) {
				utils.error(`no ${source} id found for media ${mediaId}`);
				return this.clearScoreSlot(slot);
			}
 
			if (this.config.showLoadingIndicators) {
				await this.showSlotLoading(slot);
			}
 
			api
				.fetchMyAnimeListData(pageType, aniListData.idMal)
				.then(data => {
					const score = data.score;
					const href = data.url;
					return this.addScores({
						slot,
						source,
						score,
						href
					});
				})
				.catch(e => {
					utils.error(
						`Unable to add the ${source} score to the header: ${e.message}`
					);
 
					// https://github.com/jikan-me/jikan-rest/issues/102
					if (e.response && e.response.status === 503) {
						return this.addScores({
							slot,
							source,
							score: 'Unavailable',
							info: ': The Jikan API is temporarily unavailable. Please try again later',
						});
					} else if (e.response && e.response.status === 429) {
						// rate limited
						return this.addScores({
							slot,
							source,
							score: 'Unavailable*',
							info: ': Temporarily unavailable due to rate-limiting, since you made too many requests to the MyAnimeList API. Reload in a few seconds to try again',
						});
					}
				});
		}
 
		async addShikimoriScore(pageType, mediaId, aniListData) {
			const slot = 3;
			const source = 'Shikimori';
 
			if (!aniListData.idMal) {
				utils.error(`no ${source} id found for media ${mediaId}`);
				return this.clearScoreSlot(slot);
			}
 
			if (this.config.showLoadingIndicators) {
				await this.showSlotLoading(slot);
			}
 
			try {
				const data = await api.fetchShikimoriData(pageType, aniListData.idMal);
 
				if (!data || !data.rates_scores_stats || data.rates_scores_stats.length === 0) {
					utils.error(`No rates_scores_stats found in Shikimori API response for media ${mediaId} with idMal ${aniListData.idMal}`);
					return this.addScores({
						slot,
						source,
						score: 'N/A'
					});
				}
 
				const totalVotes = data.rates_scores_stats.reduce((sum, stat) => sum + stat.value, 0);
				const weightedSum = data.rates_scores_stats.reduce((sum, stat) => sum + stat.name * stat.value, 0);
				const averageScore = weightedSum / totalVotes;
 
				utils.debug(`score: ${averageScore}`);
 
				const score = averageScore.toFixed(2);
				const href = new URL(data.url, 'https://shikimori.one').href;
 
				return this.addScores({
					slot,
					source,
					score,
					href
				});
			} catch (e) {
				console.error(`Unable to add the ${source} score to the header:`, e);
				//... other error handling code...
			}
		}
		/**
		 * Adds the Kitsu score to the header.
		 *
		 * @param {('anime'|'manga')} type - The type of media content.
		 * @param {string} mediaId - The AniList media id.
		 * @param {Object} aniListData - The data from the AniList api.
		 */
		async addKitsuScore(pageType, mediaId, aniListData) {
			const slot = 4;
			const source = 'Kitsu';
 
			const englishTitle = aniListData.title.english;
			const romajiTitle = aniListData.title.romaji;
			if (!englishTitle && !romajiTitle) {
				utils.error(
					`Unable to search ${source} - no media title found for ${mediaId}`
				);
				return this.clearScoreSlot(slot);
			}
 
			if (this.config.showLoadingIndicators) {
				await this.showSlotLoading(slot);
			}
 
			api
				.fetchKitsuData(pageType, englishTitle, romajiTitle)
				.then(entry => {
					if (!entry.data) {
						utils.error(`no ${source} matches found for media ${mediaId}`);
						return this.clearScoreSlot(slot);
					}
 
					const data = entry.data;
 
					let score = null;
					if (data.averageRating !== undefined && data.averageRating !== null) {
						score = `${data.averageRating}%`;
						if (!entry.isExactMatch) {
							score += '*';
						}
					}
 
					const href = `https://kitsu.io/${pageType}/${data.slug}`;
 
					let info = '';
					if (!entry.isExactMatch) {
						info += ', *exact match not found';
					}
					const kitsuTitles = Object.values(data.titles).join(', ');
					info += `, matched on "${kitsuTitles}"`;
 
					return this.addScores({
						slot,
						source,
						score,
						href,
						info,
						iconMarkup: svg.kitsu
					});
 
				})
				.catch(e => {
					utils.error(
						`Unable to add the ${source} score to the header: ${e.message}`
					);
				});
		}
 
		/**
		 * Shows a loading indicator in the given slot position.
		 *
		 * @param {number} slot - The slot position.
		 */
		async showSlotLoading(slot) {
			const slotEl = await this.getScoreSlot(slot);
			if (slotEl) {
				slotEl.style.display = 'flex'
				slotEl.innerHTML = svg.loading;
			}
		}
 
		/**
		 * Removes markup from the header for the given slot position.
		 *
		 * @param {number} slot - The slot position.
		 */
		async clearScoreSlot(slot) {
			const slotEl = await this.getScoreSlot(slot);
			if (slotEl) {
				while (slotEl.lastChild) {
					slotEl.removeChild(slotEl.lastChild);
				}
				slotEl.style.display = 'none'
				slotEl.style.marginRight = '0';
			}
		}
 
		/**
		 * Add score data to a slot in the header section.
		 *
		 * @param {Object} info - Data about the score.
		 * @param {number} info.slot - The ordering position within the header.
		 * @param {string} info.source - The source of the data.
		 * @param {string} [info.score] - The score text.
		 * @param {string} [info.href] - The link for the media from the source.
		 * @param {string} [info.iconMarkup] - Icon markup representing the score.
		 * @param {string} [info=''] - Additional info about the score.
		 */
		async addScores({
			slot,
			source,
			score,
			href,
			iconMarkup,
			info = ''
		}) {
			const containerEl = await this.getScoreContainer();
			let slotEl = await this.getScoreSlot(slot);
 
 
			if (slotEl) {
 
				let slotColor;
				if (document.body.classList.contains('site-theme-dark')) {
					slotColor = 'rgb(var(--color-gray-800))';
				} else if (document.body.classList.contains('site-theme-contrast') || !document.body.classList.length) {
					slotColor = 'rgb(250, 250, 250)';
				} else {
					slotColor = 'rgb(250, 250, 250)';
				}
 
				slotEl.style.color = slotColor;
 
				slotEl.style.display = 'flex'
				const newSlotEl = slotEl.cloneNode(false);
				newSlotEl.title = `${source} Score${info} ${constants.CUSTOM_ELEMENT_TITLE}`;
				newSlotEl.style.display = 'flex';
				newSlotEl.style.alignItems = 'center';
				newSlotEl.style.gap = '0.3em';
 
 
 
				const link = document.createElement('a');
				link.href = href;
				link.title = `View this entry on ${source} ${constants.CUSTOM_ELEMENT_TITLE}`;
				link.style.display = 'flex'; // Changed to inline-flex
				link.style.textDecoration = 'none';
				link.style.color = 'inherit';
 
				if (source === 'MyAnimeList') {
					link.innerHTML = svg.mal;
				} else if (source === 'Shikimori') {
					link.innerHTML = svg.shiki;
				} else if (iconMarkup) {
					link.innerHTML = iconMarkup;
				} else {
					link.textContent = source;
				}
 
				newSlotEl.appendChild(link);
 
				const scoreEl = document.createElement('span');
 
				scoreEl.style.fontWeight = '500';
 
				scoreEl.append(document.createTextNode(score || 'No Score'));
				newSlotEl.appendChild(scoreEl);
 
				slotEl.replaceWith(newSlotEl);
			} else {
				throw new Error(`Unable to find element to place ${source} score`);
			}
		}
 
 
		/**
		 * Gets the slot element at the given position.
		 *
		 * @param {number} slot - Get the slot element at this ordering position.
		 */
		async getScoreSlot(slot) {
			const containerEl = await this.getScoreContainer();
			const slotClass = `${constants.CLASS_PREFIX}-slot${slot}`;
			return containerEl.querySelector(`.${slotClass}`);
		}
 
		/**
		 * Gets the container for new content, adding it to the DOM if
		 * necessary.
		 */
		async getScoreContainer() {
			const headerEl = await utils.waitForElement(this.selectors.header);
			const containerElement = await utils.waitForElement(this.selectors.headerContainer)
			const insertionPoint =
				containerElement.querySelector('.page-content > div:nth-child(1)') || containerElement.firstElementChild;
 
			const containerClass = `${constants.CLASS_PREFIX}-scores`;
			let containerEl = containerElement.querySelector(`.${containerClass}`);
			if (!containerEl) {
				containerEl = document.createElement('div');
				containerEl.className = containerClass;
				containerEl.style.display = 'flex'; // Ensure horizontal layout
				containerEl.style.marginBottom = '1em';
				containerEl.style.alignItems = 'flex-end';
				containerEl.style.justifyContent = 'flex-end';
				containerEl.style.gridArea = 'rates';
				containerEl.style.gap = '1em';
				containerEl.style.height = '100px';
				containerEl.style.zIndex = '2'
				containerEl.style.flexWrap = 'wrap'; // Allow wrapping if needed
				const numSlots = 4;
				for (let i = 0; i < numSlots; i++) {
					const slotEl = document.createElement('div');
					slotEl.className = `${constants.CLASS_PREFIX}-slot${i + 1}`;
					slotEl.style.display = 'none'
					containerEl.appendChild(slotEl);
				}
 
 
				insertionPoint.insertAdjacentElement('afterend', containerEl);
			}
			return containerEl;
		}
 
 
		async applyGenresAndTagsModifications() {
			try {
				const headerEl = await utils.waitForElement(this.selectors.header);
				const sidebarElement = await utils.waitForElement(this.selectors.sidebar);
				const genresContainer = await utils.waitForElementWithText(this.selectors.genresContainer, sidebarElement, "Genres");
				const genres = genresContainer.parentElement;
				const tagsContainer = await utils.waitForElement(this.selectors.tagsContainer, sidebarElement);
 
				const insertionPoint =
					headerEl.querySelector('h1') || headerEl.firstElementChild;
 
				const containerClass = `${constants.CLASS_PREFIX}-genres-tags`;
				let containerEl = headerEl.querySelector(`.${containerClass}`);
				if (!containerEl) {
					containerEl = document.createElement('div');
					containerEl.className = containerClass;
					containerEl.style.display = 'flex';
					containerEl.style.flexDirection = 'column';
					containerEl.style.marginTop = '2em';
					containerEl.style.alignItems = 'flex-start';
 
					insertionPoint.insertAdjacentElement('afterend', containerEl);
				} else {
					utils.clearElement(containerEl);
				}
 
 
				if (genres) {
					const genreList = genres.querySelectorAll(this.selectors.genreItem)
 
 
					const formattedGenres = document.createElement('div');
					formattedGenres.title = `Genres ${constants.CUSTOM_ELEMENT_TITLE}`;
					formattedGenres.style.marginBottom = '0.5em'
 
					genreList.forEach(genreLink => {
						const genreWrapper = document.createElement('span');
						const genreText = genreLink.textContent.trim()
						genreWrapper.style.fontWeight = 'bold';
						const genreLinkClone = genreLink.cloneNode(true);
						genreLinkClone.textContent = genreText
						genreWrapper.appendChild(genreLinkClone)
 
						formattedGenres.appendChild(genreWrapper);
						if (genreLink !== genreList[genreList.length - 1]) {
							formattedGenres.append(constants.SEPERATOR)
						}
					})
					containerEl.appendChild(formattedGenres);
				}
 
				if (tagsContainer) {
					const tagElements = Array.from(tagsContainer.querySelectorAll(this.selectors.tagItem));
					const formattedTags = document.createElement('div');
					formattedTags.title = `Search this tag ${constants.CUSTOM_ELEMENT_TITLE}`;
					formattedTags.style.display = 'flex';
					formattedTags.style.flexWrap = 'wrap';
					formattedTags.style.fontSize = '0.85em';
					formattedTags.style.columnGap = '1em';
					formattedTags.style.rowGap = '0.5em';
 
					const visibleTags = [];
					const hiddenTags = [];
 
					tagElements.forEach((tagElement, index) => {
						const nameLink = tagElement.querySelector('a.name');
						const rankElement = tagElement.querySelector('.rank');
						if (!nameLink || !rankElement) {
							return;
						}
						const name = nameLink.textContent.trim();
						const rank = rankElement.textContent.trim();
 
						const tagSpan = document.createElement('span');
						const isSpoiler = tagElement.closest(constants.SPOILER_TAG_SELECTOR) !== null;
 
						const tagLinkClone = nameLink.cloneNode(true);
						tagLinkClone.textContent = name;
						const rankSpan = document.createElement('span');
						rankSpan.textContent = constants.SEPERATOR + rank;
						rankSpan.classList.add(`${constants.CLASS_PREFIX}-tag-rank`);
 
						tagSpan.appendChild(tagLinkClone);
						tagSpan.appendChild(rankSpan);
 
						if (isSpoiler) {
							tagSpan.classList.add(`${constants.CLASS_PREFIX}-spoiler-tag`);
						}
 
						if (index < this.config.maxVisibleTags) {
							visibleTags.push(tagSpan);
						} else {
							tagSpan.classList.add(`${constants.CLASS_PREFIX}-hidden-tag`);
							hiddenTags.push(tagSpan);
						}
					});
					visibleTags.forEach(tag => formattedTags.appendChild(tag))
 
					let showMoreButton = null;
					if (hiddenTags.length > 0) {
						showMoreButton = document.createElement('span');
						showMoreButton.textContent = `${hiddenTags.length}${constants.SHOW_MORE_TEXT}`;
						showMoreButton.classList.add(`${constants.CLASS_PREFIX}-show-more-tags`, `${constants.CLASS_PREFIX}-tag-rank`);
						let isExpanded = false;
 
						showMoreButton.addEventListener('click', () => {
 
							isExpanded = !isExpanded;
							if (isExpanded) {
								hiddenTags.forEach(tag => {
									tag.classList.remove(`${constants.CLASS_PREFIX}-hidden-tag`);
									tag.classList.add(`${constants.CLASS_PREFIX}-visible-tag`);
									formattedTags.appendChild(tag);
								});
								formattedTags.appendChild(showMoreButton);
								showMoreButton.textContent = constants.COLLAPSE_TEXT;
							} else {
								hiddenTags.forEach(tag => {
									tag.classList.add(`${constants.CLASS_PREFIX}-hidden-tag`);
									tag.classList.remove(`${constants.CLASS_PREFIX}-visible-tag`)
									formattedTags.insertBefore(tag, showMoreButton)
 
								});
								showMoreButton.textContent = `${hiddenTags.length}${constants.SHOW_MORE_TEXT}`;
							}
						});
						formattedTags.appendChild(showMoreButton);
 
						hiddenTags.forEach(tag => {
							formattedTags.insertBefore(tag, showMoreButton);
						})
						hiddenTags.forEach(tag => tag.classList.add(`${constants.CLASS_PREFIX}-hidden-tag`))
 
					}
					containerEl.appendChild(formattedTags)
				}
			} catch (error) {
				utils.error("Unable to move or format genres or tags: ", error);
			}
		}
 
 
 
		async applyTitlesModifications() {
			try {
				const headerContainer = await utils.waitForElement(this.selectors.headerContainer);
				const sidebarElement = await utils.waitForElement(this.selectors.sidebar);
				const h1Title = await utils.waitForElement(this.selectors.h1Title, headerContainer);
 
				const romajiTitleContainer = await utils.waitForElementWithText(this.selectors.romajiTitle, sidebarElement, "Romaji");
				const nativeTitleContainer = await utils.waitForElementWithText(this.selectors.nativeTitle, sidebarElement, "Native");
 
 
				let romajiTitle = romajiTitleContainer?.nextElementSibling?.textContent?.trim() || '';
				let nativeTitle = nativeTitleContainer?.nextElementSibling?.textContent?.trim() || '';
 
				const containerClass = `${constants.CLASS_PREFIX}-titles`;
				let containerEl = headerContainer.querySelector(`.${containerClass}`);
				if (!containerEl) {
					containerEl = document.createElement('div');
					containerEl.className = containerClass;
					containerEl.style.gridArea = 'header';
					containerEl.style.zIndex = '2';
 
 
					headerContainer.insertBefore(containerEl, headerContainer.firstChild);
				} else {
					utils.clearElement(containerEl);
				}
 
				const formattedTitles = document.createElement('div');
				formattedTitles.title = `Copy title ${constants.CUSTOM_ELEMENT_TITLE}`;
				formattedTitles.style.display = 'flex';
				formattedTitles.style.flexDirection = 'column';
				formattedTitles.style.gap = '0.3em';
				formattedTitles.style.marginTop = '40px';
				formattedTitles.style.color = 'rgb(var(--color-gray-600))';
				formattedTitles.style.height = '4.5em';
				formattedTitles.style.justifyContent = 'flex-end';
 
 
				const mainTitleSpan = document.createElement('span');
 
				let mainTitleSpanColor;
				if (document.body.classList.contains('site-theme-dark')) {
					mainTitleSpanColor = 'rgb(var(--color-gray-800))';
				} else if (document.body.classList.contains('site-theme-contrast') || !document.body.classList.length) {
					mainTitleSpanColor = 'rgb(250, 250, 250)';
				} else {
					mainTitleSpanColor = 'rgb(250, 250, 250)';
				}
 
				mainTitleSpan.style.color = mainTitleSpanColor;
				mainTitleSpan.style.fontWeight = '800';
				mainTitleSpan.style.fontSize = '2rem';
				mainTitleSpan.style.letterSpacing = '0.03em';
				mainTitleSpan.style.fontFamily = "'Overpass'";
 
				const secondaryTitleSpan = document.createElement('span');
 
 
				let mainTitleText, secondaryTitleText;
 
				if (this.config.mainTitle === 'native') {
					mainTitleText = nativeTitle;
				} else if (this.config.mainTitle === 'english') {
					const aniListData = await api.fetchAniListData(
						constants.ANI_LIST_URL_PATH_REGEX.exec(window.location.pathname)[1],
						constants.ANI_LIST_URL_PATH_REGEX.exec(window.location.pathname)[2]
					);
					mainTitleText = aniListData?.title?.english || romajiTitle;
				} else {
					mainTitleText = romajiTitle;
				}
 
 
				if (this.config.secondaryTitle === 'native') {
					secondaryTitleText = nativeTitle;
				} else if (this.config.secondaryTitle === 'english') {
					const aniListData = await api.fetchAniListData(
						constants.ANI_LIST_URL_PATH_REGEX.exec(window.location.pathname)[1],
						constants.ANI_LIST_URL_PATH_REGEX.exec(window.location.pathname)[2]
					);
					secondaryTitleText = aniListData?.title?.english || romajiTitle;
				} else {
					secondaryTitleText = romajiTitle;
				}
				if (mainTitleText === secondaryTitleText) {
					secondaryTitleText = null;
				}
 
				mainTitleSpan.textContent = mainTitleText;
				if (secondaryTitleText) {
					secondaryTitleSpan.textContent = secondaryTitleText;
				}
 
 
 
				const mainTitleLink = document.createElement('a');
				mainTitleLink.style.textDecoration = 'none';
				mainTitleLink.style.color = 'inherit';
				mainTitleLink.appendChild(mainTitleSpan);
 
 
				mainTitleLink.addEventListener('click', (event) => {
					event.preventDefault();
					navigator.clipboard.writeText(mainTitleText)
						.then(() => utils.debug('Main Title copied to clipboard'))
						.catch(err => utils.error('Could not copy main title:', err));
 
				});
 
				const secondaryTitleLink = document.createElement('a');
				secondaryTitleLink.style.textDecoration = 'none';
				secondaryTitleLink.style.color = 'inherit';
				if (secondaryTitleText) {
					secondaryTitleLink.appendChild(secondaryTitleSpan);
				}
 
 
				secondaryTitleLink.addEventListener('click', (event) => {
					event.preventDefault();
					navigator.clipboard.writeText(secondaryTitleText)
						.then(() => utils.debug('Secondary Title copied to clipboard'))
						.catch(err => utils.error('Could not copy secondary title:', err));
				});
 
 
 
				formattedTitles.appendChild(mainTitleLink);
				if (secondaryTitleText) {
					formattedTitles.appendChild(secondaryTitleLink);
				}
 
 
 
				containerEl.appendChild(formattedTitles);
				h1Title.style.display = 'none';
 
 
			} catch (error) {
				utils.error("Unable to move or format titles: ", error);
			}
		}
 
		correctGrid() {
			try {
				const container = document.querySelector(this.selectors.pageContainer);
				const coverWrap = document.querySelector(this.selectors.coverWrap);
				const content = document.querySelector(this.selectors.content);
 
			} catch (error) {
				utils.error("Unable to fix grid: ", error)
			}
 
		}
	}
 
	// execution:
 
	// check for compatibility
	if (!userScriptAPI.supportsXHR) {
		utils.error(
			'The current version of your user script manager ' +
			'does not support required features. Please update ' +
			'it to the latest version and try again.'
		);
		return;
	}
 
	// setup configuration
	const userConfig = await utils.loadUserConfiguration(defaultConfig);
	const config = Object.assign({}, defaultConfig, userConfig);
	utils.debug('configuration values:', config);
 
	const page = new AniListPage(config);
	page.init();
 
	const style = document.createElement('style');
	style.textContent = `
        .${constants.CLASS_PREFIX}-spoiler-tag {
            filter: blur(4px);
            transition: all 0.3s cubic-bezier(0, 0, 0.23, 1);
        }

        .${constants.CLASS_PREFIX}-spoiler-tag:hover {
            filter: none;
        }

        .${constants.CLASS_PREFIX}-tag-rank {
            font-weight: lighter;
            opacity: 0.7;
        }

        .${constants.CLASS_PREFIX}-hidden-tag {
            display: none;
        }

        .${constants.CLASS_PREFIX}-show-more-tags {
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            margin-bottom: 0.5em;
        }

        .${constants.CLASS_PREFIX}-show-more-tags:hover {
            text-decoration: underline;
        }

        .media-page-unscoped.media-manga .banner::before,
        .media-page-unscoped.media-anime .banner::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2;
             background: linear-gradient(to top, rgba(0, 0, 0, .85), transparent 180px), rgba(0, 0, 0, 0);
        }

        .media-page-unscoped.media-manga .banner,
        .media-page-unscoped.media-anime .banner {
            margin-bottom: -8em;
            z-index: 1;
            position: relative;
        }


        .media-page-unscoped.media-manga .header-wrap .shadow,
        .media-page-unscoped.media-anime .header-wrap .shadow {
            display: none;
        }

        .${constants.CLASS_PREFIX}-titles span:hover {
            cursor: pointer;
        }

        .media-page-unscoped.media-manga  .header .container,
        .media-page-unscoped.media-anime  .header .container {
            display: grid;
            grid-column-gap: 30px;
            grid-template-columns: 215px 1fr auto;
            grid-template-areas: "cover header rates" "cover content content";
        }

        .media-page-unscoped.media-manga  .header .cover-wrap,
        .media-page-unscoped.media-anime  .header .cover-wrap {
            grid-area: cover;
            z-index: 2;
            margin-top: 16px;
        }

        .media-page-unscoped.media-manga  .header .content,
        .media-page-unscoped.media-anime  .header .content {
            grid-area: content;
            padding-top: 0;
        }

        .media .hohDownload {z-index: 5;}

        @media (max-width: 760px) {
            .media-page-unscoped.media-manga .banner::before,
            .media-page-unscoped.media-anime .banner::before {
                background: radial-gradient(circle at center -30%, rgba(10, 10, 10, 0.2) 0, #0A0A0A 100%);
            }

            .media-page-unscoped.media-manga  .header .container,
            .media-page-unscoped.media-anime  .header .container {
                display: grid;
                grid-column-gap: 30px;
                 grid-template-columns: auto;
                grid-template-areas:
                    "cover"
                    "header"
                    "rates"
                    "content";
            }

            .media-page-unscoped.media-manga .cover-wrap-inner,
            .media-page-unscoped.media-anime .cover-wrap-inner {
                display: flex !important;
                flex-direction: column;
                grid-gap: 0 !important;
            }

              .media-page-unscoped.media-manga .cover-wrap-inner .cover,
               .media-page-unscoped.media-anime .cover-wrap-inner .cover {
                max-width: 200px !important;
                margin: 0 auto;
            }


              .media-page-unscoped.media-anime .cover-wrap-inner .actions,
              .media-page-unscoped.media-manga .cover-wrap-inner .actions {
                max-width: 500px;
                width: 100%;
                margin: 20px auto;
              }

            .${constants.CLASS_PREFIX}-genres-tags {
                margin-top: 0.5em !important;
            }

            .${constants.CLASS_PREFIX}-scores {
                margin-top: 1.4em;
                height: max-content !important;
                justify-content: flex-start !important;
                color: rgb(var(--color-gray-800)) !important;
            }

            .${constants.CLASS_PREFIX}-titles div {
                height: max-content !important;
            }

            .${constants.CLASS_PREFIX}-titles span {
				        color: rgb(var(--color-gray-600)) !important;
			      }

            .${constants.CLASS_PREFIX}-titles > div > a:nth-child(1) span{
				        color: rgb(var(--color-gray-800)) !important;
			      }

	     .${constants.CLASS_PREFIX}-scores div{
                color: rgb(var(--color-gray-800)) !important;
            }

            .media-page-unscoped.media-manga .banner,
            .media-page-unscoped.media-anime .banner {
                height: 400px!important;
                margin-bottom: -25em;
            }
        }
    `;
	document.head.appendChild(style);
})();
