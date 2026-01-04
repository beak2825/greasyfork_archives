// ==UserScript==
// @name         Yahoo Auto Refresh
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Yahooずっとリロード
// @author       YourName
// @match        https://search.yahoo.co.jp/search?p=3.11*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529423/Yahoo%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/529423/Yahoo%20Auto%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const refreshInterval = 10 * 1000;

    setTimeout(() => {
        location.reload();
    }, refreshInterval);
})();
