// ==UserScript==
// @name         网页强制缩放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  123
// @author       YJP
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450662/%E7%BD%91%E9%A1%B5%E5%BC%BA%E5%88%B6%E7%BC%A9%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/450662/%E7%BD%91%E9%A1%B5%E5%BC%BA%E5%88%B6%E7%BC%A9%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    document.body.style.zoom = 1.4 / window.devicePixelRatio;
})();
