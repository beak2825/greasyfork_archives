// ==UserScript==
// @name         Youtube Comment Sponsor Blocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove annoying sponsored messages within youtube comments & descriptions
// @author       github.com/Aveygo
// @match        https://www.youtube.com/watch?v=*
// @icon         https://cdn-icons-png.flaticon.com/256/1384/1384060.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481131/Youtube%20Comment%20Sponsor%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/481131/Youtube%20Comment%20Sponsor%20Blocker.meta.js
// ==/UserScript==

const blacklist = [
    "sign up",
    "start",
    "sale",
    "ends",
    "free",
    "trial",
    "first",
    "promo",
    "code",
    "% off",
    "http",
    "sponsored by",
    "visit",
    "check out",
    "purchase",
    "go to",
    "head over",
    "merch",
    "support",
    "deal",
    "discount",
    "today",
    "expires",
    "$",
]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForElm(root, selector) {
    return new Promise(resolve => {
        if (root.querySelector(selector)) {
            return resolve(root.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (root.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(root, {
            childList: true,
            subtree: true
        });
    });
}

function countBlacklist(inputString, targets) {
    const lowerCaseString = inputString.toLowerCase();
    let count = 0;

    targets.forEach(target => {
        if (lowerCaseString.includes(target)) {
            count++;
        }
    });

    return count;
}

async function checkCommment() {
    // Wait for the first comment to be inserted into dom
    const elm = await waitForElm(document, 'ytd-comment-thread-renderer');
    const target = elm.innerText;

    // Check if the comment was pinned (1st criterion)
    if (target.includes("Pinned by")) {

        // Check if the the comment contains enough trigger words (2nd criterion)
        var count = countBlacklist(target, blacklist);
        if (count >= 3) {
            elm.remove()
        }
    }
}

async function checkDescription() {
    // Wait for the video meta to be inserted into dom
    const elm = await waitForElm(document, 'ytd-watch-metadata');

    // Wait for the video meta to be populated 
    var trash = await waitForElm(elm, "div")

    // Wait for the video description to be populated
    var target = elm.querySelectorAll("yt-attributed-string")[7]
    const observer = new MutationObserver(mutations => {
        if (target.innerText) {

            // If the description contains more than three trigger words, remove 
            var count = countBlacklist(target.innerText, blacklist);
            if (count >= 3) {
                target.remove()
            }
            observer.disconnect();
        }
    });

    observer.observe(target, {
        childList: true,
        subtree: true
    });
}

async function main() {
    'use strict';
    checkCommment()
    checkDescription()
};

const observeUrlChange = () => {
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            main()
        }
    });
    observer.observe(body, { childList: true, subtree: true });
};

main()
window.onload = observeUrlChange;