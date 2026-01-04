// ==UserScript==
// @name         tapd-block
// @namespace    longslee-longslee
// @version      2024-05-14
// @description  block it
// @author       longslee
// @include      https://www.tapd.cn*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494475/tapd-block.user.js
// @updateURL https://update.greasyfork.org/scripts/494475/tapd-block.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var originalOpen = XMLHttpRequest.prototype.open;
     XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
       
        if (method.toLowerCase() === "get" && url.startsWith("/api/company/company/get_company_renew_info")) {
            console.log("Blocked GET request to:", url);
            return; // Block the request by not calling the original open method
        }
        originalOpen.apply(this, arguments);
    };
    // Your code here...
})();