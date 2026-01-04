// ==UserScript==
// @name         publink-yuque-logo-invert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  售后宝语雀logo反差
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446905/publink-yuque-logo-invert.user.js
// @updateURL https://update.greasyfork.org/scripts/446905/publink-yuque-logo-invert.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = '.logo img:nth-last-of-type(1) { filter: invert(100%); }'
    document.body.append(styleElement)
    // Your code here...
})();