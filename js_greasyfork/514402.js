// ==UserScript==
// @name         publink-webpage-test-beautify
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  webpage test 样式美化
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514402/publink-webpage-test-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/514402/publink-webpage-test-beautify.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = `
    .alert-banner,
    .testingBannerMessage,
    cp-header
    { display: none !important; }
    `
    document.body.append(styleElement)
    // Your code here...
})();