// ==UserScript==
// @name         从m.thepaper.cn转到www.thepaper.cn
// @version      0.1
// @description  Redirect m.thepaper.cn URLs to www.thepaper.cn with correct format
// @author       bingqiang
// @match        https://m.thepaper.cn/*
// @grant        none
// @namespace https://greasyfork.org/users/1346278
// @downloadURL https://update.greasyfork.org/scripts/502750/%E4%BB%8Emthepapercn%E8%BD%AC%E5%88%B0wwwthepapercn.user.js
// @updateURL https://update.greasyfork.org/scripts/502750/%E4%BB%8Emthepapercn%E8%BD%AC%E5%88%B0wwwthepapercn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect function
    function redirectUrl() {
        var currentUrl = window.location.href;

        // Check if the URL starts with m.thepaper.cn and contains numbers
        if (currentUrl.startsWith('https://m.thepaper.cn/')) {
            // Extract ID (digits) from the URL
            var regex = /(\d+)/;
            var match = currentUrl.match(regex);
            if (match && match[1]) {
                var id = match[1];
                var newUrl = 'https://www.thepaper.cn/newsDetail_forward_' + id;
                // Redirect to the new URL
                window.location.replace(newUrl);
            }
        }
    }

    // Check if the URL starts with m.thepaper.cn
    if (window.location.hostname === 'm.thepaper.cn') {
        redirectUrl();
    }
})();
