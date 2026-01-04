// ==UserScript==
// @name         Remove Ads on Example
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes annoying ads from example.com
// @match        https://www.example.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540137/Remove%20Ads%20on%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/540137/Remove%20Ads%20on%20Example.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('.ad, .popup').forEach(el => el.remove());
})();
// ==UserScript==
// @name         Auto Skip YouTube Ads
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        const skipBtn = document.querySelector('.ytp-ad-skip-button');
        if (skipBtn) skipBtn.click();
    }, 1000);
})();
// ==UserScript==
// @name         Auto Expand Read More
// @match        *://*.nytimes.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        document.querySelectorAll('.css-1bd8bfl, .expand-button').forEach(btn => btn.click());
    }, 1500);
})();
// ==UserScript==
// @name         Universal Dark Mode
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.innerHTML = `
        html, body {
            background: #121212 !important;
            color: #e0e0e0 !important;
        }
        img, video {
            filter: brightness(0.9) contrast(1.1);
        }
    `;
    document.head.appendChild(style);
})();