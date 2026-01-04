// ==UserScript==
// @name         CSDN 创作助手
// @namespace    https://blog.17lai.site
// @version      1.0.2
// @description  去掉 csdn 内置关键词搜索
// @author       夜法之书 
// @license      GPL V3
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/492936/CSDN%20%E5%88%9B%E4%BD%9C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492936/CSDN%20%E5%88%9B%E4%BD%9C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建悬浮图标
    var floatingIcon = document.createElement('div');
    floatingIcon.style.position = 'fixed';
    floatingIcon.style.top = '90px';
    floatingIcon.style.right = '20px';
    floatingIcon.style.width = '50px';
    floatingIcon.style.height = '50px';
    floatingIcon.style.background = 'red';
    floatingIcon.style.borderRadius = '50%';
    floatingIcon.style.cursor = 'pointer';
    floatingIcon.style.zIndex = '9999';
    floatingIcon.title = 'Replace Links';
    floatingIcon.innerHTML = '<span style="display: block; width: 100%; height: 100%; line-height: 50px; text-align: center; color: white;">🔗</span>';

    // 将悬浮图标添加到页面中
    document.body.appendChild(floatingIcon);

    // 记录鼠标相对于图标的偏移量
    var offsetX, offsetY;

    // 当鼠标按下时
    floatingIcon.addEventListener('mousedown', function(e) {
        // 计算鼠标相对于图标的偏移量
        offsetX = e.clientX - floatingIcon.getBoundingClientRect().left;
        offsetY = e.clientY - floatingIcon.getBoundingClientRect().top;

        // 添加鼠标移动和松开事件监听器
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // 当鼠标移动时
    function onMouseMove(e) {
        // 计算图标的新位置
        var newX = e.clientX - offsetX;
        var newY = e.clientY - offsetY;

        // 更新图标的位置
        floatingIcon.style.left = newX + 'px';
        floatingIcon.style.top = newY + 'px';
    }

    // 当鼠标松开时
    function onMouseUp() {
        // 移除鼠标移动和松开事件监听器
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // 点击悬浮图标时运行 replaceLinks 函数
    floatingIcon.addEventListener('click', function() {
        replaceLinks();
        replaceSpans();
    });

    function replaceSpans() {
        // 查找页面中所有具有 class 为 'words-blog hl-git-1' 的 <span> 标签
        var spans = document.querySelectorAll('span.words-blog, span.hl-1');
    
        // 遍历所有符合条件的 <span> 标签
        for (var i = 0; i < spans.length; i++) {
            // 获取当前 <span> 标签的文本内容
            var textContent = spans[i].innerText;
    
            // 创建一个新的文本节点
            var textNode = document.createTextNode(textContent);
    
            // 将文本节点插入到 <span> 标签之前
            spans[i].parentNode.insertBefore(textNode, spans[i]);
    
            // 移除当前 <span> 标签
            spans[i].parentNode.removeChild(spans[i]);
        }
    }

    function replaceLinks() {
        // 查找页面中所有的 <a> 标签
        var links = document.getElementsByTagName('a');

        // 遍历所有的 <a> 标签
        for (var i = 0; i < links.length; i++) {
            // 获取当前 <a> 标签的 href 属性值
            var hrefValue = links[i].getAttribute('href');

            // 打印当前 <a> 标签的 href 属性值，用于调试
            console.log('当前链接的 href 属性值为：', hrefValue);

            // 检查 href 属性值是否以特定字符串开头
            if (hrefValue && hrefValue.startsWith("https://so.csdn.net")) {
                // 获取当前 <a> 标签的文本内容
                var textContent = links[i].innerText;

                // 打印当前 <a> 标签的文本内容，用于调试
                console.log('当前链接的文本内容为：', textContent);

                // 创建一个新的文本节点
                var textNode = document.createTextNode(textContent);

                // 将文本节点插入到 <a> 标签之前
                links[i].parentNode.insertBefore(textNode, links[i]);

                // 打印替换后的内容，用于调试
                console.log('替换后的链接内容为：', textContent);

                // 移除当前 <a> 标签
                links[i].parentNode.removeChild(links[i]);
            }
        }
    }


})();
