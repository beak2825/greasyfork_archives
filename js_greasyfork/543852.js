// ==UserScript==
// @name         猫点饭 NAT 检测次数限制破解 - mao.fan/mynat
// @version      1.0
// @description  绕过 mao.fan/mynat 的 check_limit 检测，但仍需登录
// @author       Nameless
// @match        https://mao.fan/mynat*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1442595
// @downloadURL https://update.greasyfork.org/scripts/543852/%E7%8C%AB%E7%82%B9%E9%A5%AD%20NAT%20%E6%A3%80%E6%B5%8B%E6%AC%A1%E6%95%B0%E9%99%90%E5%88%B6%E7%A0%B4%E8%A7%A3%20-%20maofanmynat.user.js
// @updateURL https://update.greasyfork.org/scripts/543852/%E7%8C%AB%E7%82%B9%E9%A5%AD%20NAT%20%E6%A3%80%E6%B5%8B%E6%AC%A1%E6%95%B0%E9%99%90%E5%88%B6%E7%A0%B4%E8%A7%A3%20-%20maofanmynat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('/check_limit')) {
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(JSON.stringify({
                    allowed: true
                })),
                json: () => Promise.resolve({
                    allowed: true
                }),
            });
        }
        return originalFetch.apply(this, arguments);
    };
})();