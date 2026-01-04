// ==UserScript==
// @name          AniList Unlimited - Score in Header
// @namespace     https://github.com/mysticflute
// @version       1.0.3
// @description   For anilist.co, make manga and anime scores more prominent by moving them to the title.
// @author        mysticflute
// @homepageURL   https://github.com/mysticflute/ani-list-unlimited
// @supportURL    https://github.com/mysticflute/ani-list-unlimited/issues
// @match         https://anilist.co/*
// @connect       graphql.anilist.co
// @connect       api.jikan.moe
// @connect       kitsu.io
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM.xmlHttpRequest
// @grant         GM.setValue
// @grant         GM.getValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/404465/AniList%20Unlimited%20-%20Score%20in%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/404465/AniList%20Unlimited%20-%20Score%20in%20Header.meta.js
// ==/UserScript==

// This user script was tested with the following user script managers:
// - Violentmonkey (preferred): https://violentmonkey.github.io/
// - TamperMonkey: https://www.tampermonkey.net/
// - GreaseMonkey: https://www.greasespot.net/

(async function () {
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
    addAniListScoreToHeader: true,

    /** When true, adds the MyAnimeList score to the header. */
    addMyAnimeListScoreToHeader: true,

    /** When true, adds the Kitsu score to the header. */
    addKitsuScoreToHeader: false,

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

    /** Regex to extract the page type and media id from a AniList url path */
    ANI_LIST_URL_PATH_REGEX: /(anime|manga)\/([0-9]+)/i,

    /** Prefix message for logs to the console */
    LOG_PREFIX: '[AniList Unlimited User Script]',

    /** Prefix for class names added to created elements (prevent conflicts) */
    CLASS_PREFIX: 'user-script-ani-list-unlimited',

    /** Title suffix added to created elements (for user information) */
    CUSTOM_ELEMENT_TITLE:
      '(this content was added by the ani-list-unlimited user script)',

    /** When true, output additional logs to the console */
    DEBUG: false,
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

        // initialize any config values that haven't been set
        if (setDefault && userValue === undefined) {
          utils.debug(`setting default config value for ${key}: ${value}`);
          userScriptAPI.GM_setValue(key, value);
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
    async loadAniListData(type, aniListId) {
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
    async loadMyAnimeListData(type, myAnimeListId) {
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
     * Loads data from the Kitsu API.
     *
     * @param {('anime'|'manga')} type - The type of media content.
     * @param {string} englishTitle - Search for media with this title.
     * @param {string} romajiTitle - Search for media with this title.
     *
     * @returns {Promise<Object>} A Promise returning the media's data, or a
     * rejection if there was a problem calling the API.
     */
    async loadKitsuData(type, englishTitle, romajiTitle) {
      try {
        const fields = 'slug,averageRating,userCount,titles';
        const response = await utils.xhr({
          url: encodeURI(
            `${
              constants.KITSU_API
            }/${type}?page[limit]=3&fields[${type}]=${fields}&filter[text]=${
              englishTitle || romajiTitle
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
    smile:
      '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="smile" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="rgb(var(--color-green))" class="icon svg-inline--fa fa-smile fa-w-16"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z" class=""></path></svg>',
    /** from AniList */
    straight:
      '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="meh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="rgb(var(--color-orange))" class="icon svg-inline--fa fa-meh fa-w-16"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z" class=""></path></svg>',
    /** from AniList */
    frown:
      '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="frown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="rgb(var(--color-red))" class="icon svg-inline--fa fa-frown fa-w-16"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z" class=""></path></svg>',
    /**  From https://github.com/SamHerbert/SVG-Loaders */
    // License/accreditation https://github.com/SamHerbert/SVG-Loaders/blob/master/LICENSE.md
    loading:
      '<svg width="60" height="8" viewbox="0 0 130 32" style="fill: rgb(var(--color-text-light, 80%, 80%, 80%))" xmlns="http://www.w3.org/2000/svg" fill="#fff"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/></circle><circle cx="60" cy="15" r="9" fill-opacity=".3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from=".5" to=".5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"/></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/></circle></svg>',
  };

  /**
   * Handles manipulating the current AniList page.
   */
  class AniListPage {
    /**
     * @param {Object} config - The user script configuration.
     */
    constructor(config) {
      this.selectors = {
        pageTitle: 'head > title',
        header: '.page-content .header .content',
      };

      this.config = config;
      this.lastCheckedUrlPath = null;
    }

    /**
     * Initialize the page and apply page modifications.
     */
    initialize() {
      utils.debug('initializing page');
      this.applyPageModifications().catch(e =>
        utils.error(`Unable to apply modifications to the page - ${e.message}`)
      );

      // eslint-disable-next-line no-unused-vars
      const observer = new MutationObserver((mutations, observer) => {
        utils.debug('mutation observer', mutations);
        this.applyPageModifications().catch(e =>
          utils.error(
            `Unable to apply modifications to the page - ${e.message}`
          )
        );
      });

      const target = document.querySelector(this.selectors.pageTitle);
      observer.observe(target, { childList: true, characterData: true });
    }

    /**
     * Applies modifications to the page based on config settings.
     *
     * This will only add content if we are on a relevant page in the app.
     */
    async applyPageModifications() {
      const pathname = window.location.pathname;
      utils.debug('checking page url', pathname);

      if (this.lastCheckedUrlPath === pathname) {
        utils.debug('url path did not change, skipping');
        return;
      }
      this.lastCheckedUrlPath = pathname;

      const matches = constants.ANI_LIST_URL_PATH_REGEX.exec(pathname);
      if (!matches) {
        utils.debug('url did not match');
        return;
      }

      const pageType = matches[1];
      const mediaId = matches[2];
      utils.debug('pageType:', pageType, 'mediaId:', mediaId);

      const aniListData = await api.loadAniListData(pageType, mediaId);

      if (this.config.addAniListScoreToHeader) {
        this.addAniListScoreToHeader(pageType, mediaId, aniListData);
      }

      if (this.config.addMyAnimeListScoreToHeader) {
        this.addMyAnimeListScoreToHeader(pageType, mediaId, aniListData);
      }

      if (this.config.addKitsuScoreToHeader) {
        this.addKitsuScoreToHeader(pageType, mediaId, aniListData);
      }
    }

    /**
     * Adds the AniList score to the header.
     *
     * @param {('anime'|'manga')} type - The type of media content.
     * @param {string} mediaId - The AniList media id.
     * @param {Object} aniListData - The data from the AniList api.
     */
    async addAniListScoreToHeader(pageType, mediaId, aniListData) {
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
          iconMarkup = svg.straight;
        } else if (rawScore >= 75) {
          iconMarkup = svg.smile;
        } else if (rawScore >= 60) {
          iconMarkup = svg.straight;
        } else {
          iconMarkup = svg.frown;
        }
      }

      this.addToHeader({ slot, source, score, iconMarkup, info }).catch(e => {
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
    async addMyAnimeListScoreToHeader(pageType, mediaId, aniListData) {
      const slot = 2;
      const source = 'MyAnimeList';

      if (!aniListData.idMal) {
        utils.error(`no ${source} id found for media ${mediaId}`);
        return this.clearHeaderSlot(slot);
      }

      if (this.config.showLoadingIndicators) {
        await this.showSlotLoading(slot);
      }

      api
        .loadMyAnimeListData(pageType, aniListData.idMal)
        .then(data => {
          const score = data.score;
          const href = data.url;

          return this.addToHeader({ slot, source, score, href });
        })
        .catch(e => {
          utils.error(
            `Unable to add the ${source} score to the header: ${e.message}`
          );

          // https://github.com/jikan-me/jikan-rest/issues/102
          if (e.response && e.response.status === 503) {
            return this.addToHeader({
              slot,
              source,
              score: 'Unavailable',
              info: ': The Jikan API is temporarily unavailable. Please try again later',
            });
          } else if (e.response && e.response.status === 429) {
            // rate limited
            return this.addToHeader({
              slot,
              source,
              score: 'Unavailable*',
              info: ': Temporarily unavailable due to rate-limiting, since you made too many requests to the MyAnimeList API. Reload in a few seconds to try again',
            });
          }
        });
    }

    /**
     * Adds the Kitsu score to the header.
     *
     * @param {('anime'|'manga')} type - The type of media content.
     * @param {string} mediaId - The AniList media id.
     * @param {Object} aniListData - The data from the AniList api.
     */
    async addKitsuScoreToHeader(pageType, mediaId, aniListData) {
      const slot = 3;
      const source = 'Kitsu';

      const englishTitle = aniListData.title.english;
      const romajiTitle = aniListData.title.romaji;
      if (!englishTitle && !romajiTitle) {
        utils.error(
          `Unable to search ${source} - no media title found for ${mediaId}`
        );
        return this.clearHeaderSlot(slot);
      }

      if (this.config.showLoadingIndicators) {
        await this.showSlotLoading(slot);
      }

      api
        .loadKitsuData(pageType, englishTitle, romajiTitle)
        .then(entry => {
          if (!entry.data) {
            utils.error(`no ${source} matches found for media ${mediaId}`);
            return this.clearHeaderSlot(slot);
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

          return this.addToHeader({ slot, source, score, href, info });
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
      const slotEl = await this.getSlotElement(slot);
      if (slotEl) {
        slotEl.innerHTML = svg.loading;
      }
    }

    /**
     * Removes markup from the header for the given slot position.
     *
     * @param {number} slot - The slot position.
     */
    async clearHeaderSlot(slot) {
      const slotEl = await this.getSlotElement(slot);
      if (slotEl) {
        while (slotEl.lastChild) {
          slotEl.removeChild(slotEl.lastChild);
        }
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
    async addToHeader({ slot, source, score, href, iconMarkup, info = '' }) {
      const slotEl = await this.getSlotElement(slot);
      if (slotEl) {
        const newSlotEl = slotEl.cloneNode(false);
        newSlotEl.title = `${source} Score${info} ${constants.CUSTOM_ELEMENT_TITLE}`;
        newSlotEl.style.marginRight = '1rem';
        if (slot > 1) {
          newSlotEl.style.fontSize = '.875em';
        }

        if (iconMarkup) {
          newSlotEl.insertAdjacentHTML('afterbegin', iconMarkup);
          newSlotEl.firstElementChild.style.marginRight = '6px';
        }

        const scoreEl = document.createElement('span');
        if (slot > 1) {
          scoreEl.style.fontWeight = 'bold';
        }
        scoreEl.append(document.createTextNode(score || 'No Score'));
        newSlotEl.appendChild(scoreEl);

        if (href) {
          newSlotEl.appendChild(document.createTextNode(' on '));

          const link = document.createElement('a');
          link.href = href;
          link.title = `View this entry on ${source} ${constants.CUSTOM_ELEMENT_TITLE}`;
          link.textContent = source;
          newSlotEl.appendChild(link);
        }

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
    async getSlotElement(slot) {
      const containerEl = await this.getContainerElement();
      const slotClass = `${constants.CLASS_PREFIX}-slot${slot}`;
      return containerEl.querySelector(`.${slotClass}`);
    }

    /**
     * Gets the container for new content, adding it to the DOM if
     * necessary.
     */
    async getContainerElement() {
      const headerEl = await utils.waitForElement(this.selectors.header);
      const insertionPoint =
        headerEl.querySelector('h1') || headerEl.firstElementChild;

      const containerClass = `${constants.CLASS_PREFIX}-scores`;
      let containerEl = headerEl.querySelector(`.${containerClass}`);
      if (!containerEl) {
        containerEl = document.createElement('div');
        containerEl.className = containerClass;
        containerEl.style.display = 'flex';
        containerEl.style.marginTop = '1em';
        containerEl.style.alignItems = 'center';

        const numSlots = 3;
        for (let i = 0; i < numSlots; i++) {
          const slotEl = document.createElement('div');
          slotEl.className = `${constants.CLASS_PREFIX}-slot${i + 1}`;
          containerEl.appendChild(slotEl);
        }

        insertionPoint.insertAdjacentElement('afterend', containerEl);
      }

      return containerEl;
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
  page.initialize();
})();
