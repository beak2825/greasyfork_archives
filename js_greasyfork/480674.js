// ==UserScript==
// @name         publink-processon-beautify
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  processon 样式美化
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480674/publink-processon-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/480674/publink-processon-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = `
    .carsouselBox,
    #quick-desktop-butt,
    .quick-desktop-poupe,
    .po-select.po-border-circle.po-select__btn
    { display: none !important; }
    `
    document.body.append(styleElement)
    // Your code here...
})();