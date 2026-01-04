// ==UserScript==
// @name           Netflix Watch Credits
// @namespace      netflix-watch-credits.user.js
// @match          https://www.netflix.com/*
// @grant          none
// @version        1.4
// @author         nafumofu
// @description    エンドクレジットの画面縮小を抑制します。
// @description:en Suppress screen shrinkage of end credits.
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/443468/Netflix%20Watch%20Credits.user.js
// @updateURL https://update.greasyfork.org/scripts/443468/Netflix%20Watch%20Credits.meta.js
// ==/UserScript==

const watchCredits = (node) => {
    for (const [key, value] of Object.entries(node)) {
        if (key.startsWith('__reactProps$')) {
            const state = value.children._owner.memoizedState
            const {duration, timecodes} = state.playbackState;

            timecodes.find(timecode => timecode.type === 'ending').startOffsetMs = duration;
            break;
        }
    }
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const nodes = [...mutation.addedNodes].filter((node) => node.nodeType === Node.ELEMENT_NODE);
        
        for (const node of nodes) {
            if (node.matches('.watch-video--player-view')) {
                watchCredits(node);
            }
        }
    }
});

observer.observe(document.body, {
    subtree: true,
    childList: true,
});
