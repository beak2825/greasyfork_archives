// ==UserScript==
// @name         Twitter/X Login Blocker to Nitter
// @namespace    happyviking
// @version      3.0
// @description  Converts Twitter/X login flow redirects to Nitter links, and replaces old url in browser history. Also works in Firefox Android.
// @author       HappyViking
// @match	     *://*.twitter.com/i/flow/*
// @match	     *://*.x.com/i/flow/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474487/TwitterX%20Login%20Blocker%20to%20Nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/474487/TwitterX%20Login%20Blocker%20to%20Nitter.meta.js
// ==/UserScript==

function isProperTargetPage(url) {
    return !!url.match(/^(|http(s?):\/\/)(.*\.)?twitter.com\/i\/flow\/login(.*|$)/gim) || !!url.match(/^(|http(s?):\/\/)(.*\.)?x.com\/i\/flow\/login(.*|$)/gim)
}

function getNewUrl() {
    let params = new URL(document.location).searchParams;
    let name = params.get("redirect_after_login")?.trim();
    return `https://farside.link/nitter/${name ?? ""}`
}


const main = () => {
    if (isProperTargetPage(window.location.href)) {
        const newUrl = getNewUrl()
        location.replace(newUrl);
    }
}

//There are probably cleaner ways to do this but I don't really care, this works and is simple
let currentPage = location.href;
main()
setInterval(() => {
    if (currentPage != location.href) {
        currentPage = location.href;
        main()
    }
}, 500);
