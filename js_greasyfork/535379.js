// ==UserScript==
// @name         nodeseek根据标题关键字过滤隐藏
// @version      0.5
// @description  根据标题关键字隐藏帖子，并统计归集到右上角
// @author       hahahaha
// @namespace   *://*nodeseek.com/*
// @match       *://*nodeseek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535379/nodeseek%E6%A0%B9%E6%8D%AE%E6%A0%87%E9%A2%98%E5%85%B3%E9%94%AE%E5%AD%97%E8%BF%87%E6%BB%A4%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535379/nodeseek%E6%A0%B9%E6%8D%AE%E6%A0%87%E9%A2%98%E5%85%B3%E9%94%AE%E5%AD%97%E8%BF%87%E6%BB%A4%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在这里定义你要过滤的关键字
    const keywords = ['claw', 'cursor','isif'];

    // 获取所有的帖子列表项
    const postListItems = document.querySelectorAll('.post-list-item');
    let hiddenCount = 0;
    const hiddenTitleLinks = [];

    postListItems.forEach((item) => {
        const postTitleElement = item.querySelector('.post-title a');
        if (postTitleElement) {
            const postTitle = postTitleElement.textContent.toLowerCase();
            const shouldHide = keywords.some((keyword) =>
                postTitle.includes(keyword.toLowerCase())
            );

            if (shouldHide) {
                item.style.display = 'none';
                hiddenCount++;
                // 抽取标题和链接并添加到隐藏标题链接数组
                const title = postTitleElement.textContent;
                const link = postTitleElement.href;
                hiddenTitleLinks.push({ title, link });
            }
        }
    });

    // 创建悬浮图标元素
    const floatingIcon = document.createElement('div');
    floatingIcon.style.position = 'fixed';
    floatingIcon.style.top = '10px';
    floatingIcon.style.right = '40px';
    floatingIcon.style.backgroundColor = 'red';
    floatingIcon.style.color = 'white';
    floatingIcon.style.padding = '5px 10px';
    floatingIcon.style.borderRadius = '5px';
    floatingIcon.style.zIndex = 9999;
    floatingIcon.style.cursor = 'pointer';
    floatingIcon.textContent = hiddenCount;

    // 创建隐藏标题列表容器
    const hiddenTitleListContainer = document.createElement('div');
    hiddenTitleListContainer.style.position = 'fixed';
    hiddenTitleListContainer.style.top = '40px';
    hiddenTitleListContainer.style.right = '10px';
    hiddenTitleListContainer.style.backgroundColor = 'white';
    hiddenTitleListContainer.style.border = '1px solid #ccc';
    hiddenTitleListContainer.style.padding = '10px';
    hiddenTitleListContainer.style.zIndex = 9998;
    hiddenTitleListContainer.style.display = 'none';
    // 设置最大宽度和最大高度为窗口尺寸，这里减去一些边距以保证不超出窗口
    hiddenTitleListContainer.style.maxWidth = `${window.innerWidth - 20}px`;
    hiddenTitleListContainer.style.maxHeight = `${window.innerHeight - 50}px`;
    // 当内容超过容器高度时显示滚动条
    hiddenTitleListContainer.style.overflowY = 'auto';

    // 阻止滚动事件冒泡到背景
    hiddenTitleListContainer.addEventListener('wheel', (event) => {
        const deltaY = event.deltaY;
        const container = hiddenTitleListContainer;
        if (
            (deltaY < 0 && container.scrollTop === 0) ||
            (deltaY > 0 && container.scrollTop + container.clientHeight === container.scrollHeight)
        ) {
            event.preventDefault();
        }
    });

    // 将隐藏的标题链接添加到列表容器中
    hiddenTitleLinks.forEach(({ title, link }) => {
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.textContent = title;
        linkElement.style.display = 'block';
        linkElement.style.marginBottom = '5px';
        const originalColor = linkElement.style.color;

        // 鼠标悬浮标题变色
        linkElement.addEventListener('mouseenter', () => {
            linkElement.style.color = 'blue';
        });

        // 鼠标离开标题恢复原色
        linkElement.addEventListener('mouseleave', () => {
            linkElement.style.color = originalColor;
        });

        // 点击标题时变色并在新标签页打开
        linkElement.addEventListener('click', (event) => {
            event.preventDefault();
            linkElement.style.color = 'red';
            window.open(link, '_blank');
        });
        hiddenTitleListContainer.appendChild(linkElement);
    });

    // 点击图标显示或隐藏列表
    floatingIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        if (hiddenTitleListContainer.style.display === 'none') {
            hiddenTitleListContainer.style.display = 'block';
        } else {
            hiddenTitleListContainer.style.display = 'none';
        }
    });

    // 点击除悬浮框和图标之外的地方关闭悬浮框
    document.addEventListener('click', (event) => {
        if (
            hiddenTitleListContainer.style.display === 'block' &&
            !floatingIcon.contains(event.target) &&
            !hiddenTitleListContainer.contains(event.target)
        ) {
            hiddenTitleListContainer.style.display = 'none';
        }
    });

    // 将图标和列表容器添加到页面
    document.body.appendChild(floatingIcon);
    document.body.appendChild(hiddenTitleListContainer);

    // 存储初始的右侧距离
    const initialRight = '10px';

    // 调整容器位置，仅调整列表容器，不调整图标
    function adjustForScrollbar() {
        // 计算滚动条宽度
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // 如果有滚动条，调整列表容器位置
        if (scrollbarWidth > 0) {
            hiddenTitleListContainer.style.right = `${parseInt(initialRight) + scrollbarWidth}px`;
        } else {
            // 恢复默认位置
            hiddenTitleListContainer.style.right = initialRight;
        }

        // 同时更新容器的最大宽度，防止内容超出窗口
        hiddenTitleListContainer.style.maxWidth = `${window.innerWidth - 20}px`;
    }

    // 初始化位置
    adjustForScrollbar();

    // 监听窗口大小变化
    window.addEventListener('resize', adjustForScrollbar);

    // 监听页面滚动，处理滚动条显示/隐藏
    window.addEventListener('scroll', adjustForScrollbar);
})();