// ==UserScript==
// @name         Add quote-tweet links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a quote-tweet link only to full date tweets
// @author       Noah
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509261/Add%20quote-tweet%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/509261/Add%20quote-tweet%20links.meta.js
// ==/UserScript==

function isFullDate(datetime) {
    // Checks for a valid ISO 8601 datetime (e.g. "2025-01-18T21:39:19.000Z")
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(datetime);
}

function isRelativeTime(text) {
    // If the time text is just a number followed by "h" or "m" (e.g. "12h"), consider it relative
    return /^\d+[hm]$/i.test(text.trim());
}

function addQuoteLink() {
    // Remove any /photo/<number> suffix so we work with the base tweet URL
    const baseTweetUrl = window.location.href.replace(/\/photo\/\d+$/, "");
    const tweetIdMatch = baseTweetUrl.match(/\/status\/(\d+)/);
    if (!tweetIdMatch) return;
    const tweetId = tweetIdMatch[1];

    // Look for an anchor that links to this tweet id
    let anchors = document.getElementsByTagName("a");
    for (let i = 0; i < anchors.length; i++) {
        if (anchors[i].href && anchors[i].href.includes(`/status/${tweetId}`)) {
            // Look for a <time> child element
            for (let j = 0; j < anchors[i].childNodes.length; j++) {
                const child = anchors[i].childNodes[j];
                if (child.tagName === "TIME") {
                    const datetimeAttr = child.getAttribute("datetime");
                    const timeText = child.textContent;
                    // Only proceed if the datetime attribute is valid and the text is not a relative time
                    if (datetimeAttr && isFullDate(datetimeAttr) && !isRelativeTime(timeText)) {
                        // Check for an existing (Quotes) link to avoid duplicates
                        if (anchors[i].parentElement.querySelector(".quote-link")) {
                            return;
                        }
                        let newElem = document.createElement("a");
                        newElem.textContent = " (Quotes) ";
                        newElem.href = baseTweetUrl + "/quotes";
                        newElem.className = "quote-link";
                        newElem.style.color = "rgb(231, 233, 234)";
                        newElem.style.textDecoration = "none";
                        anchors[i].parentElement.insertBefore(newElem, anchors[i].nextSibling);
                        return;
                    }
                }
            }
        }
    }
}

let previousURL = "";
setInterval(() => {
    const currentUrl = window.location.href;
    // Only re-run when the URL changes
    if (currentUrl !== previousURL) {
        previousURL = currentUrl;
        addQuoteLink();
    }
}, 100);
