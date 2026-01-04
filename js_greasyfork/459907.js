// ==UserScript==
// @name         知乎搬运工登录界面去除，显示全文内容
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用该脚本可以去除登陆界面，显示全文小说
// @author       修明
// @match        https://www.zhbyg.top/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhbyg.top
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459907/%E7%9F%A5%E4%B9%8E%E6%90%AC%E8%BF%90%E5%B7%A5%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2%E5%8E%BB%E9%99%A4%EF%BC%8C%E6%98%BE%E7%A4%BA%E5%85%A8%E6%96%87%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/459907/%E7%9F%A5%E4%B9%8E%E6%90%AC%E8%BF%90%E5%B7%A5%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2%E5%8E%BB%E9%99%A4%EF%BC%8C%E6%98%BE%E7%A4%BA%E5%85%A8%E6%96%87%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('body > div.my-login-cover').remove()
})();