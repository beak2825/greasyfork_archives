// ==UserScript==
// @name         MSDN English
// @version      2025-06-24
// @description  Open MSDN pages in english, because all other translations are shit and absolutely annoying.
// @author       Michael Chen
// @namespace    https://cnml.de/
// @license      MIT
// @match        https://learn.microsoft.com/*
// @exclude      https://learn.microsoft.com/en-us/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540607/MSDN%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/540607/MSDN%20English.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultLocale = "en-us";

    /**
     * @param {string} name
     */
    function parseLocale(name) {
        try {
            const locale = new Intl.Locale(name);
            return locale.baseName.toLowerCase();
        } catch (error) {
            if (error instanceof RangeError) return;
            throw error;
        }
    }

    const url = new URL(location.href);
    const segments = url.pathname.split("/");
    if (segments[0] !== "") throw new Error("Path is not rooted!");
    const locale = parseLocale(segments[1]);
    if (locale === undefined) throw new Error("Page seems to not be locale specific!");
    if (locale === defaultLocale) return;
    segments[1] = defaultLocale;
    url.pathname = segments.join("/");
    location.replace(url);
})();