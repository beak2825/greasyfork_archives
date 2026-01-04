// ==UserScript==
// @name         Block ManWa Ads
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Block ManWa All Ads
// @author       FuMan
// @match        https://manwa.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manwa.me
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447072/Block%20ManWa%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/447072/Block%20ManWa%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(".index-banner {visibility: hidden !important;}")
    GM_addStyle(".ad-area {display: none !important;}")

    unsafeWindow.setTimeout_ = unsafeWindow.setTimeout
    unsafeWindow.setTimeout = function(...args) {
        if(args[0] && args[0].toString().search(/\.ad-area-close|adbck/) !== -1) {
            return 0
        }
        if(args[0] && args[0].toString().indexOf("e.params.autoplay.reverseDirection") !== -1) {
            return 0
        }
        return unsafeWindow.setTimeout_.apply(this, args)
    }

    unsafeWindow.setInterval_ = unsafeWindow.setInterval
    unsafeWindow.setInterval = function(...args) {
        if(args[0] && args[0].toString().indexOf("ad-area") !== -1) {
            return 0
        }
        return unsafeWindow.setInterval_.apply(this, args)
    }
})();