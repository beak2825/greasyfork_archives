// ==UserScript==
// @name         自动点击登录按钮脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  等待登录按钮加载并自动点击
// @author       你的名字
// @match        http://10.44.20.8/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492059/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95%E6%8C%89%E9%92%AE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/492059/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95%E6%8C%89%E9%92%AE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

const observer = new MutationObserver((mutations, me) => {
    document.getElementsByClassName('el-button primary-btn el-button--primary el-button--large')[0].click();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

})();
