// ==UserScript==
// @name         publink-lanhu-beautify
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  蓝湖样式美化
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450125/publink-lanhu-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/450125/publink-lanhu-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = `
    #prototypeSidebar { min-width: 340px; } 
    `
    document.body.append(styleElement)
    // Your code here...
})();