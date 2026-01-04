// ==UserScript==
// @name         oil-set
// @namespace    longslee-longslee
// @version      2024-10-18_06
// @description  google proxy
// @author       longslee
// @include      https://admin-zc.zjcw.cn*
// @include      https://webapi.amap.com*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513061/oil-set.user.js
// @updateURL https://update.greasyfork.org/scripts/513061/oil-set.meta.js
// ==/UserScript==
(function() {

// 拦截并修改请求
const originalFetch = window.fetch;
window.fetch = function(input, init) {
    console.log('normal fetch')
    if (typeof input === 'string' && input.startsWith('https://test-zc.zjcw.cn/satellite/map/vt2/')) {
        input = input.replace('https://test-zc.zjcw.cn/satellite/map/vt2/', 'http://23.94.25.133/kh/kh/');
        input += '&v=968';
    }
    return originalFetch.call(this, input, init);
};

// 拦截并修改 XMLHttpRequest
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    console.log('ajax fetch')
    if (typeof url === 'string' && url.startsWith('https://test-zc.zjcw.cn/satellite/map/vt2/')) {
        url = url.replace('https://test-zc.zjcw.cn/satellite/map/vt2/', 'http://23.94.25.133/kh/kh/');
        url += '&v=968';
    }
    return originalOpen.call(this, method, url, async, user, password);
};
})();