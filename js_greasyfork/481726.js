// ==UserScript==
// @name         Flyert Universal Dynamic URL Redirector
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Redirect from specific URL to another while maintaining parameters, excluding mobile=yes
// @author       You
// @match        https://47.100.65.202/forum.php*
// @match        https://www.flyert.com.cn/forum.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481726/Flyert%20Universal%20Dynamic%20URL%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/481726/Flyert%20Universal%20Dynamic%20URL%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // Check if the URL contains the IP address
    if (/47\.100\.65\.202/.test(currentUrl)) {
        // Replace IP address with the domain
        const newUrl = currentUrl.replace(/47\.100\.65\.202/, 'www.flyert.com');
        // Redirect to the new URL
        window.location.href = newUrl;
    } else {
        // Just remove '&mobile=yes' if the URL is not the IP address
        const newUrl = currentUrl.replace(/&mobile=yes/, '');
        if (newUrl !== currentUrl) {
            window.location.href = newUrl;
        }
    }
})();
