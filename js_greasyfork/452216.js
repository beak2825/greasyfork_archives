// ==UserScript==
// @name         publink-mdn-beautify
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  mdn 样式美化
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452216/publink-mdn-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/452216/publink-mdn-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = `
    #top-nav-search-input { width: 300px;  background-color: #fff; color: red; caret-color: red; }
    `
    document.body.append(styleElement)
    // Your code here...
})();