// ==UserScript==
// @name         谷歌搜索自动访问U2
// @namespace    http://example.com
// @version      0.3
// @description  Sends a background request to U2分享園@動漫花園 when opening Google search page
// @author       Your Name
// @match        https://www.google.com/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489046/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E8%AE%BF%E9%97%AEU2.user.js
// @updateURL https://update.greasyfork.org/scripts/489046/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E8%AE%BF%E9%97%AEU2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetUrl = 'https://u2.dmhy.org/index.php';
    const lastRequestKey = 'u2_last_request_timestamp';

    // Get the timestamp for today (without time)
    const todayTimestamp = new Date().setHours(0, 0, 0, 0);

    // Get the stored timestamp (if any)
    const storedTimestamp = parseInt(localStorage.getItem(lastRequestKey), 10);

    // Check if a request was made today
    if (storedTimestamp === todayTimestamp) {
        console.log('Already requested U2 today. Skipping.');
        return;
    }

    // Send a background request (GET) to U2
    GM_xmlhttpRequest({
        method: 'GET',
        url: targetUrl,
        onload: function(response) {
            if (response.status === 200) {
                console.log('Background request to U2 successful!');
                // Store today's timestamp to prevent further requests
                localStorage.setItem(lastRequestKey, todayTimestamp);
                // Check if user is logged in
                if (response.finalUrl.indexOf('portal')<0) {
                    console.log('User is logged in.');
                } else {
                    console.log('User is not logged in. Displaying alert.');
                    alert('未登录');
                    window.open(targetUrl, '_blank');
                }
            } else {
                console.error('Background request failed:', response.statusText);
            }
        },
        onerror: function(error) {
            console.error('Background request error:', error);
        }
    });
})();
