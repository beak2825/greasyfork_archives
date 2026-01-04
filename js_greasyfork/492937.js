// ==UserScript==
// @name         zhihu 创作助手
// @namespace    https://blog.17lai.site
// @version      1.0.1
// @description  1，去掉知乎链接跳转，还原原始链接,2，去掉知乎关键字搜索
// @author       夜法之书
// @license      GPL V3
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @include      https://www.zhihu.com/*
// @include      https://zhuanlan.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/492937/zhihu%20%E5%88%9B%E4%BD%9C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492937/zhihu%20%E5%88%9B%E4%BD%9C%E5%8A%A9%E6%89%8B.meta.js
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
    floatingIcon.style.background = 'blue';
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
        replaceZhidaLinks();
        redirecAllUrl();
    });

    // 替换链接函数
    function replaceLinks() {
        // 查找页面中所有的 <a> 标签
        var links = document.getElementsByTagName('a');

        // 遍历所有的 <a> 标签
        for (var i = 0; i < links.length; i++) {
            // 获取当前 <a> 标签的 href 属性值
            var hrefValue = links[i].getAttribute('href');

            // 检查 href 属性值是否以特定字符串开头
            if (hrefValue && hrefValue.startsWith("https://www.zhihu.com/search")) {
                // 获取当前 <a> 标签的文本内容
                var textContent = links[i].innerText;

                // 创建一个新的文本节点
                var textNode = document.createTextNode(textContent);

                // 将文本节点插入到 <a> 标签之前
                links[i].parentNode.insertBefore(textNode, links[i]);

                // 移除当前 <a> 标签
                links[i].parentNode.removeChild(links[i]);
            }
        }
    }

    // 替换链接函数
    function replaceZhidaLinks() {
        // 查找页面中所有的 <a> 标签
        var links = document.getElementsByTagName('a');

        // 遍历所有的 <a> 标签
        for (var i = 0; i < links.length; i++) {
            // 获取当前 <a> 标签的 href 属性值
            var hrefValue = links[i].getAttribute('href');

            // 检查 href 属性值是否以特定字符串开头
            if (hrefValue && hrefValue.startsWith("https://zhida.zhihu.com/search")) {
                // 获取当前 <a> 标签的文本内容
                var textContent = links[i].innerText;

                // 创建一个新的文本节点
                var textNode = document.createTextNode(textContent);

                // 将文本节点插入到 <a> 标签之前
                links[i].parentNode.insertBefore(textNode, links[i]);

                // 移除当前 <a> 标签
                links[i].parentNode.removeChild(links[i]);
            }
        }
    }


    // 函数：从跳转链接中获取原始链接
    function redirecAllUrl(redirectUrl) {
        // 查找页面中所有带有指定类名的链接
        var links = document.querySelectorAll('a[href^="https://link.zhihu.com"]');

        // 遍历所有链接
        links.forEach(function(link) {
            // 获取链接中的跳转地址
            var redirectUrl = link.getAttribute('href');

            // 解析跳转地址，获取原始链接
            var originalUrl = getOriginalUrl(redirectUrl);

            // 如果找到原始链接，则更新链接的 href 属性为原始链接
            if (originalUrl) {
                link.href = originalUrl;
            }
        });
    }

    // 函数：从跳转链接中获取原始链接
    function getOriginalUrl(redirectUrl) {
        // 解析跳转地址中的查询参数
        var queryString = redirectUrl.split('?')[1];

        // 解析查询参数中的 target 值
        var targetParam = new URLSearchParams(queryString).get('target');

        // 如果解析到 target 值，则返回解码后的原始链接
        if (targetParam) {
            return decodeURIComponent(targetParam);
        }

        // 如果未解析到 target 值，则返回空字符串
        return '';
    }


})();

