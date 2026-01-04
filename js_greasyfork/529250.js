// ==UserScript==
// @name         Copy X Timeline Text
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在X.com上添加按钮以复制Home timeline的文字，并添加跳转到intumu.com的按钮
// @author       Civilpy
// @license MIT
// @match        https://x.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/529250/Copy%20X%20Timeline%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/529250/Copy%20X%20Timeline%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建容器div来容纳两个按钮
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.right = '20px';
    buttonContainer.style.top = '50%';
    buttonContainer.style.transform = 'translateY(-50%)';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '10px'; // 按钮间距

    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.textContent = '复制 Timeline';
    copyButton.style.padding = '10px 15px';
    copyButton.style.backgroundColor = '#1DA1F2'; // X/Twitter蓝色
    copyButton.style.color = 'white';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '5px';
    copyButton.style.cursor = 'pointer';

    // 复制按钮悬停效果
    copyButton.addEventListener('mouseover', () => {
        copyButton.style.backgroundColor = '#1791D6';
    });
    copyButton.addEventListener('mouseout', () => {
        copyButton.style.backgroundColor = '#1DA1F2';
    });

    // 创建跳转按钮
    const visitButton = document.createElement('button');
    visitButton.textContent = '访问 我的主页';
    visitButton.style.padding = '10px 15px';
    visitButton.style.backgroundColor = '#FF5733'; // 橙色，与复制按钮区分
    visitButton.style.color = 'white';
    visitButton.style.border = 'none';
    visitButton.style.borderRadius = '5px';
    visitButton.style.cursor = 'pointer';

    // 跳转按钮悬停效果
    visitButton.addEventListener('mouseover', () => {
        visitButton.style.backgroundColor = '#E64A2E';
    });
    visitButton.addEventListener('mouseout', () => {
        visitButton.style.backgroundColor = '#FF5733';
    });

    // 创建一个 Set 来存储已收集的内容，避免重复
const collectedContent = new Set();

function updateContent() {
    // 查找时间线容器
    const targetDiv = document.querySelector('div[aria-label="Home timeline"]');
    
    if (targetDiv) {
        // 获取所有包含推文内容的元素（根据 Twitter 的结构调整选择器）
        const tweetElements = targetDiv.querySelectorAll('article');
        
        tweetElements.forEach(tweet => {
            const text = tweet.innerText || tweet.textContent;
            if (text) {
                collectedContent.add(text.trim()); // 添加新内容并去重
            }
        });
    }
}

// 复制按钮点击事件
copyButton.addEventListener('click', () => {
    updateContent(); // 更新内容集合
    
    if (collectedContent.size > 0) {
        // 将 Set 转换为字符串，添加换行分隔
        const allText = Array.from(collectedContent).join('\n\n');
        GM_setClipboard(allText);
        
        copyButton.textContent = '已复制!';
        copyButton.style.backgroundColor = '#17BF63';
        
        setTimeout(() => {
            copyButton.textContent = '复制 Timeline';
            copyButton.style.backgroundColor = '#1DA1F2';
        }, 2000);
    } else {
        alert('没有可复制的内容');
    }
});

// 监听滚动事件
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 只在向下滚动时触发
    if (currentScrollTop > lastScrollTop) {
        updateContent();
    }
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
}, { passive: true });

// 初始加载时收集一次内容
updateContent();
    // 跳转按钮点击事件
    visitButton.addEventListener('click', () => {
        window.open('https://intumu.com', '_blank'); // 在新标签页打开
    });

    // 将按钮添加到容器
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(visitButton);

    // 添加容器到页面
    function addButtonsToPage() {
        if (!document.body.contains(buttonContainer)) {
            document.body.appendChild(buttonContainer);
        }
    }

    // 观察页面变化
    const observer = new MutationObserver(() => {
        addButtonsToPage();
    });

    // 页面加载完成时添加按钮
    window.addEventListener('load', () => {
        addButtonsToPage();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // 初始加载检查
    if (document.readyState === 'complete') {
        addButtonsToPage();
    }
})();