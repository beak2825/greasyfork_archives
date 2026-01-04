// ==UserScript==
// @name         publink-deepl-beautify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  deepl 样式美化
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518280/publink-deepl-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/518280/publink-deepl-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = `
    #document-scroll-container header,
    #document-scroll-container .mobile:hidden,
    #document-scroll-container footer
    { display: none !important; }
    `
    document.body.append(styleElement)

})();