// ==UserScript==
// @name         [outdated] De-emphasize Some Washington Post Bylines
// @namespace    http://tampermonkey.net/
// @version      2025-10-20
// @description  Adjust headline colors authors on washingtonpost.com
// @author       Leon Barrett
// @match        https://www.washingtonpost.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518507/%5Boutdated%5D%20De-emphasize%20Some%20Washington%20Post%20Bylines.user.js
// @updateURL https://update.greasyfork.org/scripts/518507/%5Boutdated%5D%20De-emphasize%20Some%20Washington%20Post%20Bylines.meta.js
// ==/UserScript==

const authorsToAdjust = ["george-f-will", "megan-mcardle", "marc-a-thiessen"];

function bylineAuthor(byline) {
    const link = byline.querySelector("a");
    const match = new RegExp("https://www\.washingtonpost\.com/people/([^/]*)/").exec(link);
    if (!match) {
        return "unknown";
    }
    return match[1];
}

function getHeadline(byline) {
    return byline.parentElement.querySelector("div.headline");
}

function adjustBylineColor(byline) {
    const headline = getHeadline(byline);
    const color = '#ddcccc'
    headline.style.color = color;
    byline.style.color = color;
}

(function() {
    'use strict';

    const bylines = document.querySelectorAll("div.byline");
    bylines.values().filter(byline => authorsToAdjust.includes(bylineAuthor(byline))).forEach(byline => adjustBylineColor(byline));
})();