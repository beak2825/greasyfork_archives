// ==UserScript==
// @name         YouTube Remove List
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  去掉YouTube视频链接list参数，以去掉youtube自动生成的playlist
// @license MIT
// @author       pianha
// @match        https://www.youtube.com/watch*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546685/YouTube%20Remove%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/546685/YouTube%20Remove%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'ytRemoveListEnabled';
    let enabled = localStorage.getItem(STORAGE_KEY);
    if (enabled === null) enabled = 'true';
    enabled = enabled === 'true';

    function removeListParam() {
        if (!enabled) return;
        const url = new URL(window.location.href);
        if (url.searchParams.has('list')) {
            url.searchParams.delete('list');
            window.history.replaceState({}, document.title, url.href);
        }
    }

    removeListParam();

})();
