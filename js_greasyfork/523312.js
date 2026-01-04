// ==UserScript==
// @name         AutoRemoveReadonly
// @namespace    http://tampermonkey.net/
// @version      2025-01-16 14:57
// @description  自动去除扫码输入框readonly属性并定位!
// @author       You
// @license      MIT
// @match        http://192.168.126.17/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523312/AutoRemoveReadonly.user.js
// @updateURL https://update.greasyfork.org/scripts/523312/AutoRemoveReadonly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个观察器实例并定义一个回调函数
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                var targetDiv = mutation.target;
                if (targetDiv.classList.contains('panel') && targetDiv.classList.contains('window')) {
                    var displayStyle = targetDiv.style.display;
                    if (displayStyle === 'block') {
                        // 定期检查元素是否加载
                        const checkElement = setInterval(() => {
                            console.log("执行了");
                            const inputElement = document.querySelector('#div1042188 .ck-edit-border');
                            if (inputElement) {
                                // 取消readonly属性
                                if (inputElement.getAttribute("readonly") !== null) {
                                    inputElement.removeAttribute('readonly');
                                }
                                // 定位光标
                                inputElement.focus();
                                // 检测输入框，有内容，则全部选择
                                if (inputElement.value.trim() !== '') {
                                    inputElement.select();
                                }
                            }
                        }, 1000); // 每1000毫秒（1秒）检查一次
                    } else if (displayStyle === 'none') {
                        // 重置标志变量为false
                        hasShownAlert = false;
                    }
                }
            }
        });
    });

    // 提供一个被观察目标节点，以及观察选项（观察属性变化）
    var config = { attributes: true, subtree: true, attributeFilter: ['style'] };
    var targetNode = document.body; // 监测整个文档的body部分

    // 开始观察
    observer.observe(targetNode, config);

    // 你可以在适当的时候停止观察
    // observer.disconnect();

})();