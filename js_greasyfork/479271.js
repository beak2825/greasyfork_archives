// ==UserScript==
// @name         Old Reddit Redirect
// @version      1.1
// @description  Converts reddit.com links to old.reddit.com, but handles /s/ shortlinks correctly
// @author       idk
// @match        *://*.reddit.com/*
// @exclude      *://www.reddit.com/poll/*
// @exclude      *://i.redd.it/*
// @exclude      *://www.reddit.com/media*
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1101475
// @downloadURL https://update.greasyfork.org/scripts/479271/Old%20Reddit%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/479271/Old%20Reddit%20Redirect.meta.js
// ==/UserScript==

const use_optimization = true;
const opti_threshold = 250;
const opti_dataname = 'orp40897';
const clean_interval = 1000;

const log = (msg) => console.log(`[old-reddit-please] ${msg}`);
log("Loaded");

function test(url) {
    return !!url.match(/^(|http(s?):\/\/)(|www\.)reddit.com(\/.*|$)/gim);
}

function isShortLink(url) {
    return url.match(/\/r\/[^\/]+\/s\/[^\/]+/);
}

function updateLink(url) {
    try {
        var target = new URL(url);
        if (target.hostname === 'www.reddit.com' && !isShortLink(target.pathname)) {
            target.hostname = 'old.reddit.com';
            return target.href;
        } else {
            return url;
        }
    } catch (e) {
        return url;
    }
}

// --- Main ---
(() => {
    let ready = true;
    let last_count = 0;
    let selector = 'a';

    const update_links = () => {
        if (!ready) return;
        ready = false;

        if (use_optimization && last_count >= opti_threshold) {
            selector = `a:not([data-${opti_dataname}])`;
        }

        const links = document.querySelectorAll(selector);
        last_count = links.length;

        if (last_count > 0) log('Updated ' + links.length + ' links');

        for (const link of links) {
            if (use_optimization && selector !== 'a') {
                link.setAttribute(`data-${opti_dataname}`, '1');
            }
            try {
                new URL(link.href);
                const updated = updateLink(link.href);
                if (updated !== link.href) link.setAttribute('href', updated);
            } catch (error) {
                // Ignore invalid URLs
            }
        }
        setTimeout(() => (ready = true), clean_interval);
    };

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const observer = new MutationObserver(update_links);
    observer.observe(document, { childList: true, subtree: true });
    window.addEventListener('load', () => setInterval(update_links, clean_interval));
    update_links();
})();

// --- Redirect if NOT a shortlink ---
if (test(window.location.href) && !isShortLink(window.location.pathname)) {
    const newUrl = updateLink(window.location.href);
    if (newUrl !== window.location.href) {
        window.location.assign(newUrl);
    }
}
