// ==UserScript==
// @name        YouTube Unshortifier
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      lucasm
// @namespace   luluco250.YouTubeUnshortifier
// @license     CC0
// @description Redirects YouTube Shorts to regular pages.
// @downloadURL https://update.greasyfork.org/scripts/477551/YouTube%20Unshortifier.user.js
// @updateURL https://update.greasyfork.org/scripts/477551/YouTube%20Unshortifier.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const shortsLinkRegex = /\/shorts\/([A-z0-9_-]+)/;

    function isObject(value) {
        return !!value && typeof value === "object" && !Array.isArray(value);
    }

    function forObjectInArray(array, callback) {
        for (const item of array) {
            if (!item || typeof item !== "object") continue;

            if (Array.isArray(item)) {
                forObjectInArray(item, callback);
                continue;
            }

            callback(item);
        }
    }

    /**
     * Recursively look for a property of a specific name in an object.
     * If it is found, it is returned as an array of the object that contains it and its value.
     * Otherwise it returns null.
     */
    function forEachProp(obj, propName, callback) {
        for (const [key, value] of Object.entries(obj)) {
            if (key === propName) {
                callback(obj, value);
                continue;
            }

            if (!value || typeof value !== "object") continue;

            if (Array.isArray(value)) {
                forObjectInArray(value, x => forEachProp(x, propName, callback));
                continue;
            }

            forEachProp(value, propName, callback);
        }
    }

    function tryGetShortId(uri) {
        if (!uri) return null;
        const match = uri.match(shortsLinkRegex);
        return match === null ? null : match[1];
    }

    function tryUnshortify(uri, callback) {
        const id = tryGetShortId(uri);
        if (id === null) {
            return false;
        }

        console.log(`Unshortifying ${id}`);
        callback(`/watch?v=${id}`);
        return true;
    }

    function unshortifyMany(anchorNodes) {
        if (!anchorNodes) {
            return;
        }

        for (const a of anchorNodes) {
            const href = a.getAttribute("href");
            tryUnshortify(href, x => a.setAttribute("href", x));
        }
    }

    new MutationObserver(mutations => {
        unshortifyMany(mutations.map(x => x.target));
    }).observe(document.body, {
        subtree: true,
        attributeFilter: ["href"],
    });

    window.addEventListener("load", () => {
        console.log("YouTube Unshortifier initialized.");
        console.log("Unshortifying existing anchors...");
        unshortifyMany(document.getElementsByTagName("a"));

        if (window.hasOwnProperty("ytInitialData")) {
            forEachProp(ytInitialData, "url", (obj, url) => {
                if (tryUnshortify(url, x => obj.url = x)) {
                    obj.webPageType = "WEB_PAGE_TYPE_WATCH";
                }
            });
        }
    });
})();