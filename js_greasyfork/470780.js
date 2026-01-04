// ==UserScript==
// @name         Reddit to Redlib
// @namespace    happyviking
// @version      1.1
// @description  Converts Reddit links to Redlib (previously Libreddit) links, and replaces old url in browser history. Also works in Firefox Android.
// @author       HappyViking
// @match        *://*.reddit.com/*
// @exclude      *://*.reddit.com/media*
// @icon         https://www.google.com/s2/favicons?domain=www.reddit.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470780/Reddit%20to%20Redlib.user.js
// @updateURL https://update.greasyfork.org/scripts/470780/Reddit%20to%20Redlib.meta.js
// ==/UserScript==


// Heavy credit to:
// https://greasyfork.org/en/scripts/432711-libreddit-converter/code
// https://greasyfork.org/en/scripts/465089-libreddit-redirector/code


function isProperTargetPage(url) {
    return !!url.match(/^(|http(s?):\/\/)(.*\.)?reddit.com(\/.*|$)/gim);
}

function getNewUrl(url) {
    return 'https://farside.link/redlib' + url.split('reddit.com').pop();
}

if (isProperTargetPage(window.location.href)) {
    const newUrl = getNewUrl(window.location.href)
    location.replace(newUrl);
}
