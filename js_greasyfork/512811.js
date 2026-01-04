// ==UserScript==
// @name         stop Adblock page
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  sdasdasdasd!
// @author       massyao
// @run-at       document-start
// @match        https://getadblock.com/*
// @match        https://adblockplus.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getadblock.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512811/stop%20Adblock%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/512811/stop%20Adblock%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const page_list = [
        'adblockplus.org',
        'getadblock.com'
    ];
    if(page_list.some(domin => location.href.includes(domin))) {
        window.close()
    }
    // Your code here...
})();