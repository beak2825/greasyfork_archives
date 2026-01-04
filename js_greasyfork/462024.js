// ==UserScript==
// @name         访问纽约时报中文网简中页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动访问纽约时报中文网简体中文页面
// @author       Dylan_Zhang
// @match        https://cn.nytimes.com/*/*/*/*/
// @match        https://cn.nytimes.com/*/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462024/%E8%AE%BF%E9%97%AE%E7%BA%BD%E7%BA%A6%E6%97%B6%E6%8A%A5%E4%B8%AD%E6%96%87%E7%BD%91%E7%AE%80%E4%B8%AD%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/462024/%E8%AE%BF%E9%97%AE%E7%BA%BD%E7%BA%A6%E6%97%B6%E6%8A%A5%E4%B8%AD%E6%96%87%E7%BD%91%E7%AE%80%E4%B8%AD%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的URL
var currentURL = window.location.href;

// 将"zh-hant"替换为"zh-hans"
var newURL = currentURL.replace("zh-hant", "zh-hans");

// 判断新旧URL是否相同，如果不同则重定向到新URL
if (newURL !== currentURL) {
  window.location.replace(newURL);
}
})();