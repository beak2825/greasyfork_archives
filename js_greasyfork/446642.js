// ==UserScript==
// @name         2dfan去除复制限制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  2dfan去除复制限制，可以任意复制内容。
// @author       tianshi
// @match        *://*.2dfan.com/*
// @match        *://*.2dfdf.de/*
// @match        *://*.2dfmax.top/*
// @match        *://*.fan2d.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2dfan.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446642/2dfan%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/446642/2dfan%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var newVersion = 'v0.2';
    var t=function(t){t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation()};
    ["copy","cut","contextmenu","selectstart","mousedown","mouseup","keydown","keypress","keyup"].forEach(function(e){document.documentElement.addEventListener(e,t,{capture:!0})})
    // Your code here...
})();