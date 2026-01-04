// ==UserScript==
// @name         Block YouTube Comments
// @namespace    http://tampermonkey.net/
// @version      2025-08-26
// @description  Block the entire comment section
// @author       skygate2012
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/547459/Block%20YouTube%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/547459/Block%20YouTube%20Comments.meta.js
// ==/UserScript==

(function() {
    const ogIntersectionObserver = unsafeWindow.IntersectionObserver;
    unsafeWindow.IntersectionObserver = function(cb, options) {
        return new ogIntersectionObserver((entries, obs) => {
            const filtered = entries.filter(e => !document.getElementById('comments')?.contains(e.target));
            if (filtered.length) cb(filtered, obs);
        }, options);
    };
})();