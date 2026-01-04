// ==UserScript==
// @name         我的知乎登录弹出自动去除,新增关闭登录小弹窗（出现该弹窗文本内容无法复制，我一度以为电脑出问题了）。
// @namespace    http://tampermonkey.net/
// @version      2.230810
// @description  自动关闭知乎登陆提示弹出
// @author       Huang
// @match        *://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/445271/%E6%88%91%E7%9A%84%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E5%BC%B9%E5%87%BA%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%2C%E6%96%B0%E5%A2%9E%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E5%B0%8F%E5%BC%B9%E7%AA%97%EF%BC%88%E5%87%BA%E7%8E%B0%E8%AF%A5%E5%BC%B9%E7%AA%97%E6%96%87%E6%9C%AC%E5%86%85%E5%AE%B9%E6%97%A0%E6%B3%95%E5%A4%8D%E5%88%B6%EF%BC%8C%E6%88%91%E4%B8%80%E5%BA%A6%E4%BB%A5%E4%B8%BA%E7%94%B5%E8%84%91%E5%87%BA%E9%97%AE%E9%A2%98%E4%BA%86%EF%BC%89%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/445271/%E6%88%91%E7%9A%84%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E5%BC%B9%E5%87%BA%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%2C%E6%96%B0%E5%A2%9E%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E5%B0%8F%E5%BC%B9%E7%AA%97%EF%BC%88%E5%87%BA%E7%8E%B0%E8%AF%A5%E5%BC%B9%E7%AA%97%E6%96%87%E6%9C%AC%E5%86%85%E5%AE%B9%E6%97%A0%E6%B3%95%E5%A4%8D%E5%88%B6%EF%BC%8C%E6%88%91%E4%B8%80%E5%BA%A6%E4%BB%A5%E4%B8%BA%E7%94%B5%E8%84%91%E5%87%BA%E9%97%AE%E9%A2%98%E4%BA%86%EF%BC%89%E3%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';



    document.addEventListener("DOMSubtreeModified", function(){
        for (const element of document.getElementsByClassName('Modal Modal--default signFlowModal')) {
            // if (element.innerText.indexOf('扫码登录') > -1) {
            for (const element of document.getElementsByClassName('Button Modal-closeButton Button--plain')) {
                element.click();
            }}}, false);


    document.addEventListener("DOMSubtreeModified", function(){
        // 检查标签是否存在
        var targetDiv = document.querySelector('.css-1izy64v');

        if (targetDiv) {
            // 查找标签中的X图标元素
            var xIcon = targetDiv.querySelector('.ZDI--Xmark16');

            if (xIcon) {
                // 模拟点击X图标
                var clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                xIcon.dispatchEvent(clickEvent);
            }
        }
    }, false);



})();

