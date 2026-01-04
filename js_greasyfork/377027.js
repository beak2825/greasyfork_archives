// ==UserScript==
// @name         Auto expand RES images (Shift + X)
// @namespace    https://www.reddit.com/
// @version      0.3
// @description  Clicks "Show Images" button on Reddit
// @author       12c(with permission)
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377027/Auto%20expand%20RES%20images%20%28Shift%20%2B%20X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377027/Auto%20expand%20RES%20images%20%28Shift%20%2B%20X%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".res-show-images > a").click()
})();