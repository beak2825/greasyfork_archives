// ==UserScript==
// @name         nodeseek首页悬浮展示帖子详情
// @version      0.4
// @description  鼠标悬浮展示nodeseek帖子详情
// @author       hahahaha
// @namespace   *://*nodeseek.com/*
// @match       *://*nodeseek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484124/nodeseek%E9%A6%96%E9%A1%B5%E6%82%AC%E6%B5%AE%E5%B1%95%E7%A4%BA%E5%B8%96%E5%AD%90%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/484124/nodeseek%E9%A6%96%E9%A1%B5%E6%82%AC%E6%B5%AE%E5%B1%95%E7%A4%BA%E5%B8%96%E5%AD%90%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建用于显示链接内容的元素
    var hoverBox = document.createElement('div');
    hoverBox.style.position = 'absolute';
    hoverBox.style.border = '1px solid black';
    hoverBox.style.background = 'white';
    hoverBox.style.padding = '10px';
    hoverBox.style.display = 'none';
    // 计算并设置固定宽度，这里假设取窗口宽度的 80%
    var fixedWidth = Math.min(0.8 * window.innerWidth, document.getElementById("nsk-body").offsetWidth - 100);
    hoverBox.style.width = fixedWidth + 'px';
    hoverBox.style.overflow = 'auto';
    document.body.appendChild(hoverBox);

    // 计算滚动条宽度
    function getScrollbarWidth() {
        var outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = 'scroll';

        // add innerdiv
        var inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }

    // 为所有 .post-title 下的 a 标签添加鼠标悬浮事件
    var links = document.querySelectorAll('.post-title a');
    links.forEach(function(link) {
        link.addEventListener('mouseover', function(event) {
            // 获取链接的 href
            var href = this.href;

            // 获取链接元素的边界信息
            var rect = this.getBoundingClientRect();

            // 发送 HTTP 请求到链接的 href
            fetch(href).then(function(response) {
                // 将响应的内容转换为文本
                return response.text();
            }).then(function(text) {
                // 创建一个新的 DOMParser
                var parser = new DOMParser();
                // 使用 DOMParser 解析响应的 HTML
                var doc = parser.parseFromString(text, 'text/html');
                // 获取 id 为 'nsk-body-left' 的元素的内容
                var content = doc.getElementById('nsk-body-left').innerHTML;
                // 更新 hoverBox 的内容
                hoverBox.innerHTML = content;

                // 移除多余的 pagination 组件
                removeExtraPagination(hoverBox);

                // 定义间距值
                const spacing = 20;
                // 计算可用高度
                var availableHeightBelow = window.innerHeight - rect.bottom - spacing;
                var availableHeightAbove = rect.top - spacing;

                if (availableHeightBelow > availableHeightAbove) {
                    // 向下展示
                    hoverBox.style.left = rect.left + 'px';
                    hoverBox.style.top = rect.bottom + window.scrollY + 'px';
                    // 确保悬浮框底部与浏览器窗口底部有间距
                    hoverBox.style.height = Math.min(availableHeightBelow, 500) + 'px';
                } else {
                    // 向上展示
                    hoverBox.style.left = rect.left + 'px';
                    hoverBox.style.top = rect.top + window.scrollY - Math.min(availableHeightAbove, 500) + 'px';
                    hoverBox.style.height = Math.min(availableHeightAbove, 500) + 'px';
                }

                hoverBox.style.display = 'block';

                // 禁用页面滚动但保留滚动条
                var scrollbarWidth = getScrollbarWidth();
                document.body.style.overflowY = 'hidden';
                document.body.style.paddingRight = scrollbarWidth + 'px';

                // 将悬浮框滚动到顶部
                hoverBox.scrollTop = 0;

                // 为悬浮框内的翻页链接添加点击事件监听器
                setupPaginationLinks(hoverBox, rect);
            }).catch(function(error) {
                // 如果发生错误，显示错误信息
                hoverBox.textContent = 'Error: ' + error;

                // 定义间距值
                const spacing = 20;
                // 计算可用高度
                var rect = event.target.getBoundingClientRect();
                var availableHeightBelow = window.innerHeight - rect.bottom - spacing;
                var availableHeightAbove = rect.top - spacing;

                if (availableHeightBelow > availableHeightAbove) {
                    // 向下展示
                    hoverBox.style.left = rect.left + 'px';
                    hoverBox.style.top = rect.bottom + window.scrollY + 'px';
                    // 确保悬浮框底部与浏览器窗口底部有间距
                    hoverBox.style.height = Math.min(availableHeightBelow, 500) + 'px';
                } else {
                    // 向上展示
                    hoverBox.style.left = rect.left + 'px';
                    hoverBox.style.top = rect.top + window.scrollY - Math.min(availableHeightAbove, 500) + 'px';
                    hoverBox.style.height = Math.min(availableHeightAbove, 500) + 'px';
                }

                hoverBox.style.display = 'block';

                // 禁用页面滚动但保留滚动条
                var scrollbarWidth = getScrollbarWidth();
                document.body.style.overflowY = 'hidden';
                document.body.style.paddingRight = scrollbarWidth + 'px';
            });
        });
    });

    // 点击 hoverBox 外部时隐藏 hoverBox
    document.addEventListener('click', function(event) {
        if (!hoverBox.contains(event.target)) {
            hoverBox.style.display = 'none';
            // 启用页面滚动
            document.body.style.overflowY = 'auto';
            document.body.style.paddingRight = '0px';
        }
    });

    // 鼠标进入悬浮框事件
    hoverBox.addEventListener('mouseenter', function() {
        document.body.style.overflowY = 'hidden';
    });

    // 鼠标离开悬浮框事件
    hoverBox.addEventListener('mouseleave', function() {
        document.body.style.overflowY = 'auto';
        document.body.style.paddingRight = '0px';
    });

    // 封装设置翻页链接事件监听器的函数
    function setupPaginationLinks(container, rect) {
        var paginationLinks = container.querySelectorAll('a');
        paginationLinks.forEach(function(paginationLink) {
            paginationLink.addEventListener('click', function(event) {
                console.log('Click event triggered on pagination link'); // 调试信息
                event.preventDefault();
                var newHref = this.href;
                fetch(newHref).then(function(response) {
                    return response.text();
                }).then(function(newText) {
                    var newParser = new DOMParser();
                    var newDoc = newParser.parseFromString(newText, 'text/html');
                    var newContent = newDoc.getElementById('nsk-body-left').innerHTML;
                    container.innerHTML = newContent;

                    // 移除多余的 pagination 组件
                    removeExtraPagination(container);

                    // 定义间距值
                    const spacing = 20;
                    // 重新计算高度和位置
                    var availableHeightBelow = window.innerHeight - rect.bottom - spacing;
                    var availableHeightAbove = rect.top - spacing;

                    if (availableHeightBelow > availableHeightAbove) {
                        // 向下展示
                        container.style.left = rect.left + 'px';
                        container.style.top = rect.bottom + window.scrollY + 'px';
                        // 确保悬浮框底部与浏览器窗口底部有间距
                        container.style.height = Math.min(availableHeightBelow, 500) + 'px';
                    } else {
                        // 向上展示
                        container.style.left = rect.left + 'px';
                        container.style.top = rect.top + window.scrollY - Math.min(availableHeightAbove, 500) + 'px';
                        container.style.height = Math.min(availableHeightAbove, 500) + 'px';
                    }

                    // 将悬浮框滚动到顶部
                    container.scrollTop = 0;
                    // 重新为新内容中的翻页链接添加点击事件监听器
                    setupPaginationLinks(container, rect);
                }).catch(function(error) {
                    container.textContent = 'Error: ' + error;
                });
            });
        });
    }

    // 移除多余的 pagination 组件
    function removeExtraPagination(container) {
        // 查找所有的翻页组件
        var paginationComponents = container.querySelectorAll('.nsk-pager');

        // 只保留最后一个翻页组件，移除其他的
        if (paginationComponents.length > 1) {
            for (var i = 0; i < paginationComponents.length - 1; i++) {
                paginationComponents[i].parentNode.removeChild(paginationComponents[i]);
            }
        }
    }
})();    