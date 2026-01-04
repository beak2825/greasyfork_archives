// ==UserScript==
// @name         知乎黑夜
// @namespace    132866686@qq.com
// @version      0.1
// @description  网页版知乎护眼模式
// @author       Don
// @match        *://*.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436057/%E7%9F%A5%E4%B9%8E%E9%BB%91%E5%A4%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/436057/%E7%9F%A5%E4%B9%8E%E9%BB%91%E5%A4%9C.meta.js
// ==/UserScript==

(function() {
    if (document.querySelector('html').getAttribute('data-theme') !== 'dark') {
        const url = new URL(location.href);
        const params = new URLSearchParams(url.search);
        params.set('theme', 'dark');
        url.search = params.toLocaleString();
        location.href = url.href;
    }
})();