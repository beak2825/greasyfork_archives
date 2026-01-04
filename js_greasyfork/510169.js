// ==UserScript==
// @name         添加自定义Header
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  尝试在请求中添加自定义Header
// @author       你的名字
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510169/%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89Header.user.js
// @updateURL https://update.greasyfork.org/scripts/510169/%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener('loadstart', function() {
            this.setRequestHeader('x-tt-env', 'boe_im');
        }, false);
        originalOpen.call(this, method, url, async, user, password);
    };

    // 修改 fetch
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        // 如果 init 对象已经存在，并且 headers 也是对象，则添加自定义 header
        if (init && typeof init.headers === 'object') {
            init.headers['x-tt-env'] = 'boe_im';
        } else {
            // 否则创建一个新的 headers 对象
            init = {
                ...init,
                headers: {
                    'x-tt-env': 'boe_im',
                    ...(init && init.headers ? init.headers : {}),
                },
            };
        }
        return originalFetch(input, init);
    };
})();