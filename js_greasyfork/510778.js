// ==UserScript==
// @name         Redirect alipan.com to aliyundrive.com
// @namespace    https://findhao.net
// @version      0.2
// @description  Redirect alipan.com to aliyundrive.com on any webpage
// @author       Your Name
// @match        *://alipan.com/*
// @match        *://www.alipan.com/*
// @copyright  2024+, Find
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510778/Redirect%20alipancom%20to%20aliyundrivecom.user.js
// @updateURL https://update.greasyfork.org/scripts/510778/Redirect%20alipancom%20to%20aliyundrivecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current URL contains "alipan.com" or "www.alipan.com"
    if (window.location.hostname === 'alipan.com' || window.location.hostname === 'www.alipan.com') {
        // Redirect to the corresponding aliyundrive.com URL
        window.location.hostname = 'aliyundrive.com';
    }
})();
