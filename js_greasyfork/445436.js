// ==UserScript==
// @name         sonarcloud view as list
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change view to list for sonarcloud
// @license      MIT
// @author       IgnaV
// @match        https://sonarcloud.io/*
// @icon         https://sonarcloud.io/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/445436/sonarcloud%20view%20as%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/445436/sonarcloud%20view%20as%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const excecuteWithCondition = (condition, callback, maxAttempts=20, delay=100) => {
        let attempts = 0;
        const intervalId = setInterval(() => {
            const result = condition();
            if (result) {
                clearInterval(intervalId);
                callback(result)
            } else if (attempts < maxAttempts) {
                attempts++;
            } else {
                clearInterval(intervalId);
            }
        }, delay);
    }

    const cond = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('view');
        return document.location.pathname === '/component_measures' && urlParams.get('view') !== 'list';
    };
    const redirectToList = () => {
        const href = new URL(document.location.href);
        href.searchParams.set('view', 'list');
        window.location.replace(href);
    };
    excecuteWithCondition(cond, redirectToList);
})();