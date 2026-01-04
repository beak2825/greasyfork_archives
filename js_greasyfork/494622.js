// ==UserScript==
// @name         福利吧网址跳转
// @author       hihi427
// @description  福利吧网址自动跳转
// @version      0.2
// @license MIT
// @match        *://*.wnflb99.com/*
// @match        *://*.wnflb00.com/*
// @match        *://wnflb2023.com/*
// @match        *://bbs.fuliba.net/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bbs.fuliba.net
// @run-at       document-start
// @namespace https://greasyfork.org/users/1299761
// @downloadURL https://update.greasyfork.org/scripts/494622/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%BD%91%E5%9D%80%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/494622/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%BD%91%E5%9D%80%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.stop(); // Stop the page from loading
    var currentURL = new URL(location.href);
    var newHostName = 'www.wnflb2023.com';
    var newURL = currentURL.protocol + '//' + newHostName + currentURL.pathname + currentURL.search + currentURL.hash;
    location.replace(newURL);
})();