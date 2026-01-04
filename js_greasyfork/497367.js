// ==UserScript==
// @name         Twitter/X to Nitter
// @namespace    happyviking
// @version      1.0
// @description  Converts Twitter/X links to Nitter links, and replaces old url in browser history. Also works in Firefox Android.
// @author       HappyViking
// @match        *://*.x.com/*
// @match        *://*.twitter.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497367/TwitterX%20to%20Nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/497367/TwitterX%20to%20Nitter.meta.js
// ==/UserScript==

function isProperTargetPage(url) {
    const validXLink = !!url.match(/^(|http(s?):\/\/)(.*\.)?x.com(\/.*|$)/gim) &&
        !url.match(/^(|http(s?):\/\/)(.*\.)?x.com\/i\/flow\/login(.*|$)/gim)

    const validTwitterLink = !!url.match(/^(|http(s?):\/\/)(.*\.)?twitter.com(\/.*|$)/gim) &&
        !url.match(/^(|http(s?):\/\/)(.*\.)?twitter.com\/i\/flow\/login(.*|$)/gim)

    return validTwitterLink || validXLink
}

function getNewUrl(url, hostname) {
    return 'https://farside.link/nitter' + url.split(hostname).pop();
}

if (isProperTargetPage(window.location.href)) {
    const newUrl = getNewUrl(window.location.href, window.location.hostname)
    location.replace(newUrl);
}
