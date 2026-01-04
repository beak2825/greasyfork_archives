// ==UserScript==
// @name         MAL manga default search
// @namespace    http://tampermonkey.net/
// @version      2024-03-08
// @description  Make MyAnimelist search work faster for adding manga.
// @copyright    2024, Santeri Hetekivi (https://github.com/SanteriHetekivi)
// @license      Apache-2.0
// @author       Santeri Hetekivi
// @match        https://myanimelist.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371030/MAL%20manga%20default%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/371030/MAL%20manga%20default%20search.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Base timeout.
    const TIMEOUT_MS = 100

    // Id for select element.
    const ID_SELECT = "topSearchValue"

    // Id for text input element.
    const ID_TEXT_INPUT = "topSearchText"

    /**
     * Get element by id.
     * @param {string} id For this id.
     * @param {function} callback Function to call with element.
     * @param {?string} key If given, use this key for data.
     */
    function getElementById(id, callback, key) {
        // Get element by id.
        const element = document.getElementById(id)

        // Init data.
        if (typeof getElementById.data !== "object") {
            getElementById.data = {}
        }

        // If key is undefined
        if (typeof key === "undefined") {
            // generate key that is not in use.
            do {
                key = (Math.random() + 1).toString(36).substring(2)
            } while (key in getElementById.data)
        }
        // Else if key is not in use
        else if (!(key in getElementById.data)) {
            // throw error.
            throw new Error("Key '" + key + "' not found in getElementById.data!")
        }

        // Key has data.
        const keyHasData = (typeof getElementById.data[key] === "object")

        // If element found.
        if (element) {
            // If key has data
            if (keyHasData) {
                // and timeout is number
                if (typeof getElementById.data[key].timeout === "number") {
                    // clear timeout.
                    clearTimeout(getElementById.data[key].timeout)
                }
                // delete data for key.
                delete getElementById.data[key]
            }
            // Callback with element.
            callback(element)
        }
        // Else if element not found.
        else {
            // If key has no data
            if (!keyHasData) {
                // init data.
                getElementById.data[key] = { counter: 0, timeout: null }
            }
            // After timeout
            getElementById.data[key].timeout = setTimeout(
                function () {
                    // call again with same key.
                    getElementById(id, callback, key)
                },
                (
                    // Wait base timeout
                    TIMEOUT_MS
                    *
                    // times updated counter.
                    (getElementById.data[key].counter++)
                )
            )
        }
    }
    // Get select element and
    getElementById(
        ID_SELECT,
        function (element) {
            // set value to manga.
            element.value = "manga"
        }
    )
    // Get text input element and
    getElementById(
        ID_TEXT_INPUT,
        function (element) {
            // focus on it.
            element.focus()
        }
    )
})();