// ==UserScript==
// @name         解除山东省普通高等学校招生考试信息平台复选框限制+自动勾选
// @namespace    https://wsbm.sdzk.cn
// @version      1.0
// @description  在山东省普通高等学校招生考试信息平台（https://wsbm.sdzk.cn/zyIndex.jsp）页面自动勾选“我已认真阅读上述内容”复选框，节省广大考生和家长的时间
// @author       Bing & Cysnies
// @match        https://wsbm.sdzk.cn/zyIndex.jsp
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/470103/%E8%A7%A3%E9%99%A4%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%99%AE%E9%80%9A%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E6%8B%9B%E7%94%9F%E8%80%83%E8%AF%95%E4%BF%A1%E6%81%AF%E5%B9%B3%E5%8F%B0%E5%A4%8D%E9%80%89%E6%A1%86%E9%99%90%E5%88%B6%2B%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/470103/%E8%A7%A3%E9%99%A4%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%99%AE%E9%80%9A%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E6%8B%9B%E7%94%9F%E8%80%83%E8%AF%95%E4%BF%A1%E6%81%AF%E5%B9%B3%E5%8F%B0%E5%A4%8D%E9%80%89%E6%A1%86%E9%99%90%E5%88%B6%2B%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // 等待页面加载完成
        window.addEventListener('load', function() {
        // 获取复选框元素
        var cbxAccept = document.getElementById("cbxAccept");
        // 如果元素存在且被禁用
        if (cbxAccept && cbxAccept.disabled) {
            // 取消禁用状态
            cbxAccept.disabled = false;
            // 勾选复选框
            cbxAccept.checked = true;
        }
    });
})();
