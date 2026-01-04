// ==UserScript==
// @name         Bitbucket normalize url
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  For normalize bitbucket url
// @author       You
// @match        https://bitbucket.org/rexmas_cl/%7Bcfa73af8-a135-4ef5-bb8a-421a75d73ba4%7D/*
// @match        https://bitbucket.org/rexmas_cl/rexmas/pull-requests/*/*
// @icon         http://bitbucket.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447869/Bitbucket%20normalize%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/447869/Bitbucket%20normalize%20url.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href.replace('%7Bcfa73af8-a135-4ef5-bb8a-421a75d73ba4%7D', 'rexmas');
    const regex = /(https\:\/\/bitbucket\.org\/rexmas_cl\/rexmas\/pull\-requests\/(?:\d+|new))\??([^#]*)#?(.*)/g;
    const excecutedRegex = regex.exec(url);
    if (excecutedRegex) {
        let [fullUrl, newUrl, params, hashtag] = excecutedRegex;
        if (params) {
            newUrl += `?${params}`;
        }
        if (hashtag) {
            newUrl += `#${hashtag}`;
        }
        history.replaceState(null, null, newUrl);
    }
})();