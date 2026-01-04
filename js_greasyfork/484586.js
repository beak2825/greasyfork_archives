// ==UserScript==
// @name         快手调整
// @namespace    http://tampermonkey.net/
// @version      2024-01-11
// @description  对快手搜索网页进行修整
// @author       zanghuaao
// @match        https://www.kuaishou.com/search/video?searchKey=*
// @icon         https://static.yximgs.com/udata/pkg/WEB-LIVE/kwai_icon.8f6787d8.ico
// @run-at       document-end
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/484586/%E5%BF%AB%E6%89%8B%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/484586/%E5%BF%AB%E6%89%8B%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //放置各种属性设置
    // 使用模板字符串设置样式规则
    var styles = `
        .video-info-title,.info-text {
        color:red !important;
        }
    `;

    // 设置网页的背景颜色
    var targetElement = document.querySelector('.search');
    if (targetElement) {
        // 更改元素的样式属性
        targetElement.style.backgroundColor = 'rgb(245, 245, 220)';
    }
    //设置视频信息
    // 创建一个 style 元素
    //var styleElement = document.createElement('style');
    // 将 CSS 规则添加到 style 元素中
    //styleElement.textContent = styles;
    // 将 style 元素添加到页面的 head 中
    //document.head.appendChild(styleElement);

    // 使用 MutationObserver 等待页面元素加载完成
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 如果发现了包含 .info-text 类的元素
            if (document.querySelector('.info-text')) {
                // 停止观察
                observer.disconnect();

                // 执行你的脚本
                var infoTextElements = document.querySelectorAll('.info-text');
                infoTextElements.forEach(function(infoTextElement) {
                    var textContent = infoTextElement.textContent;
                    var match = textContent.match(/\d+/);

                    // 输出提取的数字部分
                    if (match) {
                        var extractedNumber = match[0];
                        alert("找到的数字部分是：" + extractedNumber);
                    } else {
                        alert("未找到数字部分");
                    }
                });
            }
        });
    });

    // 开始观察整个文档的变化
    observer.observe(document, { subtree: true, childList: true });




})();