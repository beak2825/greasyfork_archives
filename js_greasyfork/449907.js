// ==UserScript==
// @name         publink-shb-hide-guide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  售后宝隐藏引导
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449907/publink-shb-hide-guide.user.js
// @updateURL https://update.greasyfork.org/scripts/449907/publink-shb-hide-guide.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = `
    .v-tour { display: none !important; }
    `
    document.body.append(styleElement)
    // Your code here...
})();