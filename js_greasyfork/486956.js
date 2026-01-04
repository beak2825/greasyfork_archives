// ==UserScript==
// @name         Google Referer
// @namespace    http://tampermonkey.net/
// @version      2024.02.09.1
// @description  Redirect google to HongKong domain
// @author       Dynesshely
// @license      AGPL
// @match        https://*.google.com*
// @icon         https://img.catrol.cn/avatar/avatar-head-only.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486956/Google%20Referer.user.js
// @updateURL https://update.greasyfork.org/scripts/486956/Google%20Referer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);

    if (url.search == '') {
        window.location.href = "https://www.google.com.hk/";
        return;
    }

    var query = url.searchParams.get('q');

    window.location.href = "https://www.google.com.hk/?q=" + query;
})();
