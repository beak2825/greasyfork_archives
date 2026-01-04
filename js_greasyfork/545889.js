// ==UserScript==
// @name         新窗口打开链接
// @namespace    http://tampermonkey.net/
// @version      2025-08-15
// @description  使所有的网页链接在新窗口打开
// @author       2535688890
// @match        *://*/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/545889/%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/545889/%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const links = document.querySelectorAll('a');
    links.forEach(function (link) {
        let href = link.getAttribute('href');
        if (href?.startsWith('http') || href?.startsWith('//')) {
            link.setAttribute('target', '_blank');
        } else if (href?.startsWith('/')) {
            link.setAttribute('href', window.location.origin + href);
            link.setAttribute('target', '_blank');
        }
    });
})();