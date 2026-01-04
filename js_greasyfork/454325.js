// ==UserScript==
// @name         Block Roblox Desktop App Banner
// @namespace    http://tampermonkey.net/
// @version      v1.2
// @description  Want a break from the ads? This userscript blocks the annoying "Explore Roblox in our Desktop app!" banner
// @author       Samuel Olagunju
// @match        *://*.roblox.com/*
// @license      GPL-v3.0
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454325/Block%20Roblox%20Desktop%20App%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/454325/Block%20Roblox%20Desktop%20App%20Banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ad = document.querySelector(".banner-container");
    ad.parentNode.removeChild(ad);
})();