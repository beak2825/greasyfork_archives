// ==UserScript==
// @name 极速鸟批量计划一键执行
// @namespace https://www.kuiwaiwai.com/
// @version 0.3
// @description 一键点击页面中的所有执行按钮（拯救鼠标，从我做起！）
// @author kuiwaiwai
// @match https://customer.kunpengguanjia.com/*
// @match https://customer.jingwen520.com/*
// @license GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/500157/%E6%9E%81%E9%80%9F%E9%B8%9F%E6%89%B9%E9%87%8F%E8%AE%A1%E5%88%92%E4%B8%80%E9%94%AE%E6%89%A7%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/500157/%E6%9E%81%E9%80%9F%E9%B8%9F%E6%89%B9%E9%87%8F%E8%AE%A1%E5%88%92%E4%B8%80%E9%94%AE%E6%89%A7%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btn = document.createElement("BUTTON");
    btn.innerHTML = "√";

    // 设置按钮样式
    btn.style.position = "fixed";
    btn.style.bottom = "0.4rem";
    btn.style.right = "0.6rem";
    btn.style.width = "2.8rem";
    btn.style.height = "2.8rem";
    btn.style.fontSize = "0.6rem";
    btn.style.backgroundColor = "#1890ff";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.padding = "5px 10px";
    btn.style.borderRadius = "50%";
    btn.style.cursor = "pointer";
    btn.style.opacity = '0.6';
    btn.style.zIndex = "9999";

    // 当用户点击一键执行按钮时，找到页面中的所有执行按钮并点击
    btn.onclick = function() {
        var executeButtons = document.querySelectorAll('button.ant-btn.ant-btn-link');
        executeButtons.forEach(function(button) {
            if (button.textContent.trim() === '执行') {
                button.click();
            }});
    };

    // 检查URL是否包含#，并且#后的内容是否为指定的值
    function checkURL() {
        if (window.location.href.includes('#/assets/assets_byte/byte_assets_batch_ad')) {
            if (!document.body.contains(btn)) {
                document.body.appendChild(btn);
            }}else {
                if (document.body.contains(btn)) {
                    document.body.removeChild(btn);
                }}}
    // 监听URL变化
    window.onhashchange = checkURL;

    // 监听DOM变化
    var observer = new MutationObserver(checkURL);
    observer.observe(document.body, {childList: true, subtree: true});

    // 初始检查
    checkURL();
})();