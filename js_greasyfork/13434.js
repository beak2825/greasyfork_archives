// ==UserScript==
// @name        阻止百度网盘wap版自动跳转
// @namespace   https://greasyfork.org/users/4514
// @author      喵拉布丁
// @homepage    https://greasyfork.org/scripts/13434
// @description 阻止百度网盘wap版自动跳转到PC版网页（仅限Firefox浏览器有效）
// @include     http://pan.baidu.com/wap/*
// @include     https://pan.baidu.com/wap/*
// @include     http://yun.baidu.com/wap/*
// @include     https://yun.baidu.com/wap/*
// @version     1.3
// @grant       none
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/13434/%E9%98%BB%E6%AD%A2%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98wap%E7%89%88%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/13434/%E9%98%BB%E6%AD%A2%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98wap%E7%89%88%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
document.addEventListener('beforescriptexecute', function (e) {
    if (e.target.id == 'platform') {
        e.preventDefault();
    }
});