// ==UserScript==
// @name           Lemmy/KBin Redir
// @version        0.3.2
// @author         ikeman2003
// @description    Redirects all Lemmy/kbin links to the host of your choice mine being kbin.
// @match          *://*.lemmy.ml/c/*   
// @match          *://*.lemmynsfw.com/c/*
// @match          *://*.sh.itjust.works/c/*
// @match          *://*.beehaw.org/c/*
// @match          *://*.lemmy.world/c/*
// @match          *://*.midwest.social/c/*
// @match          *://*.lemmy.one/c/*
// @match          *://*.hexbear.net/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @run-at         document-start
// @namespace https://greasyfork.org/users/934524
// @downloadURL https://update.greasyfork.org/scripts/468824/LemmyKBin%20Redir.user.js
// @updateURL https://update.greasyfork.org/scripts/468824/LemmyKBin%20Redir.meta.js
// ==/UserScript==

// Enforce strict mode for better code quality
'use strict';

// Declare current URL as a constant
const currentURL = window.location.href;

// Declare the host URL as a constant
const hostURL = 'https://kbin.social/m/';

// Check if the current URL is leading to lemmy.ml if so, redirect to the host URL
if (currentURL.includes("lemmy.ml/c/")) {
    const newURL = currentURL.replace(/^https?:\/\/(www\.)?lemmy.ml\/c\//, hostURL);
    window.location.replace(newURL + "@lemmy.ml");
} else if (currentURL.includes("https://lemmynsfw.com/c/")) {
    const newURL = currentURL.replace(/^https?:\/\/(www\.)?lemmynsfw\.com\/c\//, hostURL);
    window.location.replace(newURL + "@lemmynsfw.com");
} else if (currentURL.includes("https://sh.itjust.works/c/")) {
    const newURL = currentURL.replace(/^https?:\/\/(www\.)?sh\.itjust\.works\/c\//, hostURL);
    window.location.replace(newURL + "@sh.itjust.works");
} else if (currentURL.includes("https://beehaw.org/c/")) {
    const newURL = currentURL.replace(/^https?:\/\/(www\.)?beehaw\.org\/c\//, hostURL);
    window.location.replace(newURL + "@beehaw.org");
} else if (currentURL.includes("https://lemmy.world/c/")) {
    const newURL = currentURL.replace(/^https?:\/\/(www\.)?lemmy\.world\/c\//, hostURL);
    window.location.replace(newURL + "@lemmy.world");
} else if (currentURL.includes("https://midwest.social/c/")) {
    const newURL = currentURL.replace(/^https?:\/\/(www\.)?midwest\.social\/c\//, hostURL);
    window.location.replace(newURL + "@midwest.social");
} else if (currentURL.includes("https://lemmy.one/c/")) {
    const newURL = currentURL.replace(/^https?:\/\/(www\.)?lemmy\.one\/c\//, hostURL);
    window.location.replace(newURL + "@lemmy.one");
} else if (currentURL.includes("https://hexbear.net/c/")) {
    const newURL = currentURL.replace(/^https?:\/\/(www\.)?hexbear\.net\/c\//, hostURL);
    window.location.replace(newURL + "@hexbear.net");
}
