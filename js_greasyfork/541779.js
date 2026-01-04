// ==UserScript==
// @name        X Auto-Unmute Videos
// @namespace   m19.ca
// @version     v1
// @description Automatically unmutes autoplayed videos on X
// @author      m19.ca
// @match       https://x.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=x.com
// @license     MIT
// @homepageURL https://github.com/M19-ca/auto-unmute-x-com-userscript
// @downloadURL https://update.greasyfork.org/scripts/541779/X%20Auto-Unmute%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/541779/X%20Auto-Unmute%20Videos.meta.js
// ==/UserScript==

(() => {
    const bind = v => {
        if (v._autoUnmuteBound) return;
        v._autoUnmuteBound = true;
        v.addEventListener('play', () => {
            v.muted = false;
            v.volume = 1;
        });
    };

    new MutationObserver(records => {
        for (const record of records) {
            for (const node of record.addedNodes) {
                if (node.tagName === 'VIDEO') bind(node);
                else if (node.querySelectorAll) {
                    node.querySelectorAll('video').forEach(bind);
                }
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll('video').forEach(bind);
})();