// ==UserScript==
// @name         Auto Voice Chat mode on ChatGPT website.
// @version      0.1
// @description  turn on the voice chat mode automatically when you open chatgpt.com
// @author       4kliksAlex
// @match        https://chatgpt.com/*
// @grant        none
// @license GPLv3
// @namespace https://greasyfork.org/users/1309012
// @downloadURL https://update.greasyfork.org/scripts/538208/Auto%20Voice%20Chat%20mode%20on%20ChatGPT%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/538208/Auto%20Voice%20Chat%20mode%20on%20ChatGPT%20website.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selector = '#thread-bottom > div > div > div.max-xs\\:\\[--force-hide-label\\:none\\].relative.z-1.flex.h-full.max-w-full.flex-1.flex-col > form > div.flex.w-full.cursor-text.flex-col.items-center.justify-center.rounded-\\[28px\\].bg-clip-padding.contain-inline-size.overflow-clip.shadow-short.bg-token-bg-primary.dark\\:bg-\\[\\#303030\\] > div > div.bg-primary-surface-primary.absolute.start-2\\.5.end-0.bottom-2\\.5.z-2.flex.items-center > div > div.absolute.end-2\\.5.bottom-0.flex.items-center.gap-2 > div > div > span > button';

    const interval = setInterval(() => {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.click();
            clearInterval(interval);
        }
    }, 300);

    // Optional: Stop trying after 30 seconds
    setTimeout(() => clearInterval(interval), 30000);
})();