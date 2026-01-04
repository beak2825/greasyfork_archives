// ==UserScript==
// @name         Reddit - Fix Redesign Posts
// @namespace    https://azzurite.tv/
// @version      1.2.1
// @description  Fixes new expandos that break on the old redesign
// @author       Azzurite
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388504/Reddit%20-%20Fix%20Redesign%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/388504/Reddit%20-%20Fix%20Redesign%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        const weirdExpandos = document.querySelectorAll('[data-cachedhtml]');
        [].slice.call(weirdExpandos).forEach((expando) => {
            expando.innerHTML = expando.dataset.cachedhtml;
            expando.removeAttribute('data-cachedhtml');
        });
    }, 2000);
})();