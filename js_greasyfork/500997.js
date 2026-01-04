// ==UserScript==
// @name         Disable Zalgo Effect on Alchemy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevent zalgo effect from running on the Alchemy page
// @match        https://*.trycloudflare.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/500997/Disable%20Zalgo%20Effect%20on%20Alchemy.user.js
// @updateURL https://update.greasyfork.org/scripts/500997/Disable%20Zalgo%20Effect%20on%20Alchemy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
        if (typeof callback === 'function' && callback.toString().includes('addZalgoToText')) {
            return;
        }
        return originalSetTimeout.apply(this, arguments);
    };
})();