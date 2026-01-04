// ==UserScript==
// @name         publink-x-beautify
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  x 样式美化
// @author       huangbc
// @include      https://x.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530251/publink-x-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/530251/publink-x-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = `
    .temp-gallery-list,
    header[role="banner"]
    { display: none !important; }
    `
    document.body.append(styleElement)
    // Your code here...
})();