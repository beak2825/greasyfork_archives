// ==UserScript==
// @name         Auto-downvote Indian newspapers on Reddit
// @description  Automatically downvotes all seen Medium articles
// @lastupdated  2021-09-23
// @version      0.1
// @namespace    maredi
// @license      Public Domain
// @include      https://old.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431259/Auto-downvote%20Indian%20newspapers%20on%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/431259/Auto-downvote%20Indian%20newspapers%20on%20Reddit.meta.js
// ==/UserScript==
     
const INDIANEWS = new Set(['aljazeera.com','scmp.com','indiatimes.com','hindustantimes.com','indianexpress.com',
    'ndtv.com','india.com','indiatoday.in','moneycontrol.com']);
     
function indianews(domain) { return INDIANEWS.has(domain); }
     
for (let link of document.querySelectorAll('.thing.link')) {
    let domain = link.querySelector('.domain > a').textContent;
    if (indianews(domain)) {
        let downvote = link.querySelector('.down');
        if (downvote) {setTimeout(function() {downvote.click();}, 250);}}}