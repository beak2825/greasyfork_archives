// ==UserScript==
// @name         脚本ProMax
// @license MIT
// @version      5.7
// @description  如果不会写代码，该有多好
// @match        https://*.glowapp.vip/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glowapp.vip
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/509576/%E8%84%9A%E6%9C%ACProMax.user.js
// @updateURL https://update.greasyfork.org/scripts/509576/%E8%84%9A%E6%9C%ACProMax.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/DanNianya/moyu-@latest/jiaobenProMax.js';
    document.head.appendChild(script);
})();