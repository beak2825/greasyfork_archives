// ==UserScript==
// @name         智慧下载
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  试题导出，方便巩固复习
// @author       You
// @match        http://47.96.77.18/ks/ksks.php?*
// @icon         http://47.96.77.18/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519951/%E6%99%BA%E6%85%A7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/519951/%E6%99%BA%E6%85%A7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除特定乱码字符和所有空白字符
    function removeGarbledTextAndWhitespace() {
        // 获取所有 .ss3 类的元素
        const targetDivs = document.querySelectorAll('.ss3');

        targetDivs.forEach(targetDiv => {
            const walkNodes = function(node) {
                // 遍历所有子节点
                Array.from(node.childNodes).forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        // 对于文本节点，移除特定的乱码字符（\u0780-\u07Ba 和 \u2005）以及所有空白字符
                        child.nodeValue = child.nodeValue.replace(/[\u0780-\u07Ba\u2005]/g, '').replace(/\s+/g, '');
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        // 递归处理子元素节点
                        walkNodes(child);
                    }
                });
            };

            walkNodes(targetDiv);
        });
    }

    // 允许文本选择和复制
    function allowTextSelection() {
        document.body.style.webkitUserSelect = 'text';
        document.body.style.userSelect = 'text';
    }

    // 解除右键菜单限制
    function disableContextMenu() {
        // 覆盖 oncontextmenu 属性
        document.oncontextmenu = function() {
            return true; // 允许默认的右键菜单
        };
    }

    // 调用函数
    removeGarbledTextAndWhitespace();
    allowTextSelection();
    disableContextMenu();

// 向页面添加一个按钮，用于保存HTML源码为TXT文件
    var saveButton = document.createElement('button');
    saveButton.textContent = '试卷下载';
    saveButton.style.position = 'fixed';
    saveButton.style.top = '200px';
    saveButton.style.right = '200px';
    saveButton.style.zIndex = '9999';
    document.body.appendChild(saveButton);

    // 给按钮添加点击事件
    saveButton.addEventListener('click', function() {
        // 获取当前页面的HTML源码
        var htmlSource = document.documentElement.outerHTML;

        // 创建一个Blob对象，类型为纯文本，编码为UTF-8
        var blob = new Blob([htmlSource], {type: 'text/plain;charset=utf-8'});
        var now = new Date();
        // 创建一个可下载的链接
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = `${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}.txt`;
        document.body.appendChild(a);
        a.click(); // 模拟点击下载
        document.body.removeChild(a); // 移除临时创建的<a>标签
        URL.revokeObjectURL(url); // 释放创建的URL对象
    });
})();