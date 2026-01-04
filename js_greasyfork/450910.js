// ==UserScript==
// @name         扩大百度文库可读范围
// @namespace    http://tampermonkey.net/
// @version      0.04
// @description  百度文库屏幕上的广告和下载按钮把可读范围缩小到了1/2个屏幕。此脚本可帮你将可读范围扩大
// @author       SB
// @match        https://wenku.baidu.com/view/*
// @match        https://wenku.baidu.com/aggs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452538/%E6%89%A9%E5%A4%A7%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8F%AF%E8%AF%BB%E8%8C%83%E5%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/452538/%E6%89%A9%E5%A4%A7%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8F%AF%E8%AF%BB%E8%8C%83%E5%9B%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.getElementsByTagName('link')[0].remove()
document.getElementById('app-right').remove()
//清理右侧广告并将阅读器下移

setTimeout(() => {
document.getElementsByClassName("read-all")[0].click();
}, 5000)
//5秒后展开全文 若不安装 https://greasyfork.org/scripts/449800 脚本，则会跳转开通会员界面

})();