// ==UserScript==
// @name        Youtube - Hide Livestreams in Subscriptions
// @description Simply hides all videos that were produced by livestreams and livestreams themselves from your subscriptions feed.
// @namespace   azzurite.tv
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      Azzurite
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542429/Youtube%20-%20Hide%20Livestreams%20in%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/542429/Youtube%20-%20Hide%20Livestreams%20in%20Subscriptions.meta.js
// ==/UserScript==

function hasLiveTag(card) {
    return [...card.querySelectorAll(`p`)].some(elem => elem.textContent === `LIVE`);
}

function hasStreamedMetadata(card) {
    return card.querySelector(`#metadata-line`)?.textContent.includes(`Streamed`);
}

function isFromLivestream(card) {
    return hasLiveTag(card) || hasStreamedMetadata(card);
}

function fixLayoutAfterRemoving(feed) {
debugger;
    (function shiftUp() {
        const items = [...feed.children];
        const shortsIdx = items.findLastIndex(item => item.querySelector(`h2`)?.textContent.includes(`Shorts`))
        const shorts = items[shortsIdx];
        const shiftUpToIdx = feed.classList.contains(`ytd-rich-grid-renderer`) ? 7 : 1;
        let toShiftUp = shiftUpToIdx - shortsIdx;
        let i = shortsIdx + 1;
        for (let i = shortsIdx + 1; toShiftUp !== 0; ++i, --toShiftUp) {
            feed.insertBefore(items[i], shorts);
        }
    })();

    (function fixFirstOfColumn() {
        const items = [...feed.querySelectorAll(`:scope > ytd-rich-item-renderer`)];
        for (let i = 0; i !== items.length; ++i) {
            const item = items[i];
            if (i % 3 === 0) {
                if (!item.hasAttribute(`is-in-first-column`)) item.setAttribute(`is-in-first-column`);
            } else {
                item.removeAttribute(`is-in-first-column`);
            }
        }
    })();
}




setInterval(() => {
    if (location.href !== `https://www.youtube.com/feed/subscriptions`) {
        return;
    }
    const feed = document.querySelector(`[page-subtype="subscriptions"] > #primary > ytd-rich-grid-renderer > #contents`);
    if (!feed) {
        return;
    }

    const items = [...feed.querySelectorAll(`:scope > ytd-rich-item-renderer`)];
    for (let i = 0; i < items.length; ++i) {
        const cur = items[i];
        if (isFromLivestream(cur)) {
            cur.remove();
        }
    }

    fixLayoutAfterRemoving(feed);
}, 500);