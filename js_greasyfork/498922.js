// ==UserScript==
// @name         轻复制CSDN(LiteCopy)
// @namespace    http://tampermonkey.net/
// @version      2024-06-26-2
// @description  使不能选中的选中，使不能复制的复制。使用：选中网页内的元素，按C、F、K任意一键即可复制
// @author       zcg
// @match        *.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498922/%E8%BD%BB%E5%A4%8D%E5%88%B6CSDN%28LiteCopy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/498922/%E8%BD%BB%E5%A4%8D%E5%88%B6CSDN%28LiteCopy%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TODO
    // 1. 确保标签最高优先级，目前方式影响最小，但缺点是应对不了大版本更新，其他标签不能选中也可添加标签，或者直接全局元素无脑添加属性。
    // 2. 放开copy api权限可能会影响源站页面直接向粘贴板内拉屎，可以改成其他方式

    console.log("轻复制插件加载成功")

    document.addEventListener('keydown', function(event) {
        // 检查是否按下了'c'键或'f'键
        if (event.key === 'c' || event.key === 'f' || event.key === 'k' || event.key === 'C' || event.key === 'F'|| event.key === 'K') {
            // 获取当前选中的文本
            var selectedText = window.getSelection().toString();
            // 如果选中的文本不为空，则尝试复制到剪贴板
            if (selectedText) {
                navigator.clipboard.writeText(selectedText).then(function() {
                    console.log('文本已成功复制到剪贴板');
                }).catch(function(err) {
                    // 这将在用户拒绝剪贴板权限时触发
                    console.error('无法复制文本: ', err);
                });
            }else{
                console.warn('文本为空或其他异常');
            }
        }
    });

    // 获取页面中所有的<code>标签
    var codeElements = document.getElementsByTagName('code');
    // 遍历这些标签并设置user-select属性
    for (var i = 0; i < codeElements.length; i++) {
        codeElements[i].style.userSelect = 'text';
        // 同时，为了兼容某些浏览器，也设置其他可能的属性名称
        codeElements[i].style.MozUserSelect = 'text'; // Firefox
        codeElements[i].style.msUserSelect = 'text'; // IE/Edge
        codeElements[i].style.KhtmlUserSelect = 'text'; // Konqueror
        codeElements[i].style.WebkitUserSelect = 'text'; // Safari, Chrome
    }
})();