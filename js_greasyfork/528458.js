// ==UserScript==
// @name         UTILS_FETCH Library
// @namespace    dannysaurus.epik
// @version      1.1
// @description  fetch library
//
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        unsafeWindow
// ==/UserScript==

/* jslint esversion: 11 */
/* global unsafeWindow */
(() => {
    'use strict';
    unsafeWindow.dannysaurus_epik ??= {};
    unsafeWindow.dannysaurus_epik.libraries ??= {};

    unsafeWindow.dannysaurus_epik.libraries.UTILS_FETCH = (() => {

        /**
         * General fetch method using GM_xmlhttpRequest.
         * 
         * @param {string} url - The URL to fetch the data from.
         * @param {string} [method='GET'] - The HTTP method to use for the request.
         * @returns {Promise<Response>} The fetched response.
         * @throws {Error} If there is an error fetching the data.
         */
        const fetch = async (url, method = 'GET') => {
            return new Promise((resolve, reject) => GM_xmlhttpRequest({
                method: method,
                url: url,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response);
                    } else {
                        console.error('HTTP error! status:', response.status);
                        reject(new Error(`HTTP error! status: ${response.status}`));
                    }
                },
                onerror: (error) => {
                    console.error('Request error:', error);
                    reject(error);
                }
            }));
        };

        /**
         * Fetches JSON data from the specified URL.
         * 
         * @param {string} url - The URL to fetch the JSON data from.
         * @param {string} [method='GET'] - The HTTP method to use for the request.
         * @returns {Promise<Object>} The fetched JSON data.
         * @throws {Error} If there is an error fetching or parsing the JSON data.
         */
        const fetchJSON = async (url, method = 'GET') => {
            const response = await fetch(url, method);
            try {
                return JSON.parse(response.responseText);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                throw error;
            }
        };

        /**
         * Fetches the names of accepted users from the users - JSON.
         * 
         * @param {Object} options
         * @param {string} [options.url] - The URL to fetch the JSON data from.
         * @param {string} [options.localStorageId] - The ID to store the fetched JSON data in the local storage.
         * @param {number} [options.delayMs] - The delay in milliseconds to wait before fetching the data again.
         * 
         * @returns {Promise<Object>} fetched JSON data.
         */
        const fetchJsonWithStorageCache = (() => {
            const cacheByUrl = {};

            return async ({ url, localStorageId, delayMs } = {}) => {
                localStorageId = localStorageId.replace(/\s/g, '');
                const cache = cacheByUrl[url] ??= {
                    jsonData: null,
                    timestamp: 0,
                };
                let fetchedJsonData = null;

                if (cache.jsonData === null || Date.now() - cache.timestamp >= delayMs) {
                    try {
                        fetchedJsonData = await fetchJSON(url);

                        const propertyNamesCached = Object.keys(cache.jsonData || {});
                        const propertyNamesFetched = Object.keys(fetchedJsonData || {});

                        if (propertyNamesCached.length !== propertyNamesFetched.length
                            || propertyNamesCached.some(propName => propertyNamesCached[propName] !== propertyNamesFetched[propName])
                        ) {
                            try {
                                await GM.setValue(localStorageId, fetchedJsonData);
                            } catch (storageError) {
                                console.error(`Error saving json data to local storage:`, storageError);
                            }
                        }
                    } catch (error) {
                        try {
                            fetchedJsonData = await GM.getValue(localStorageId, null);
                        } catch (storageError) {
                            console.error(`Error loading ${localStorageId} from local storage:`, storageError);
                        }
                    }


                    if (fetchedJsonData) {
                        cache.jsonData = fetchedJsonData;
                    }
                    cache.timestamp = Date.now();
                }

                return cache.jsonData || {};
            };
        })();

        return {
            fetch,
            fetchJSON,
            fetchJsonWithStorageCache,
        };
    })();
})();