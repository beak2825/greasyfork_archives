// ==UserScript==
// @name         publink-json-beautify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  json.con 样式美化
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459576/publink-json-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/459576/publink-json-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = `
    .header .row-fluid { display: none; }
    `
    document.body.append(styleElement)
    // Your code here...
})();