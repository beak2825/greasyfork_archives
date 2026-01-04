// ==UserScript==
// @name         8591 TW Refresh - GE TW
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  schedule reload 8591
// @author       tot2313
// @match        https://www.8591.com.tw/v3/mall/list/60304?searchGame=60304*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=8591.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523830/8591%20TW%20Refresh%20-%20GE%20TW.user.js
// @updateURL https://update.greasyfork.org/scripts/523830/8591%20TW%20Refresh%20-%20GE%20TW.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        window.location.reload()
    }, 60_000)
})()