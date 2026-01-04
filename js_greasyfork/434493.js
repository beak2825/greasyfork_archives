
// ==UserScript==
// @name         UA模拟Chrome
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  使得爱家pc端可以在EDGE浏览器上打开
// @author       CUILONGJIN
// @include      *://broker.mklij.com*
// @include      *://broker-h5.mklij.com*
// @include      *://broker-dev.mklij.com*
// @include      *://broker-h5-dev.mklij.com*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_cookie
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/434493/UA%E6%A8%A1%E6%8B%9FChrome.user.js
// @updateURL https://update.greasyfork.org/scripts/434493/UA%E6%A8%A1%E6%8B%9FChrome.meta.js
// ==/UserScript==

(function() {
    let customUA =  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.9 Safari/537.36"
    Object.defineProperty(navigator, 'userAgent', { get: function () { return customUA; } });
})();