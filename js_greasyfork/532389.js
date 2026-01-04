// ==UserScript==
// @name         Linux.do 自动滚动工具
// @name:en      Linux.do Auto Scroller
// @name:zh-CN   Linux.do 自动滚动工具
// @namespace    https://greasyfork.org/zh-TW/users/1252908-eep
// @version      1.1.0
// @description  为 Linux.do 网站添加自动滚动功能，可缓慢滚动
// @description:en  Add auto-scroll functionality to Linux.do
// @description:zh-CN  为 Linux.do 网站添加自动滚动功能，可缓慢滚动 
// @author       EEP
// @license      MIT
// @match        https://linux.do/*
// @icon         https://linux.do/favicon.ico
// @grant        none
// @run-at       document-idle
// @supportURL   https://github.com/yourusername/linux-do-autoscroller/issues
// @homepageURL  https://github.com/yourusername/linux-do-autoscroller
// @downloadURL https://update.greasyfork.org/scripts/532389/Linuxdo%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/532389/Linuxdo%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 检查是否在iframe中，如果是则不执行
    if (window.self !== window.top) {
        console.log('检测到iframe环境，脚本不会运行');
        return;
    }
    // 滚动状态变量
    let isScrolling = false;
    let scrollInterval;
    let scrollSpeed = 3; // 每次滚动的像素数，数值越小滚动越慢
    let timer = null

    // 创建控制按钮
    let button
    function createScrollButton() {
        button = document.createElement('button');
        button.id = 'auto-scroll-button';
        button.textContent = '开始自动滚动';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // 添加速度控制滑块
        const speedControl = document.createElement('div');
        speedControl.style.position = 'fixed';
        speedControl.style.bottom = '60px';
        speedControl.style.right = '20px';
        speedControl.style.zIndex = '9999';
        speedControl.style.backgroundColor = 'white';
        speedControl.style.padding = '5px';
        speedControl.style.borderRadius = '4px';
        speedControl.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        speedControl.style.display = 'flex';
        speedControl.style.flexDirection = 'column';
        speedControl.style.alignItems = 'center';

        const speedLabel = document.createElement('label');
        speedLabel.textContent = '滚动速度:';
        speedLabel.style.marginBottom = '5px';
        speedLabel.style.color = '#333';

        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '1';
        speedSlider.max = '10';
        speedSlider.value = scrollSpeed;
        speedSlider.style.width = '100px';

        speedSlider.addEventListener('input', function() {
            scrollSpeed = parseInt(this.value);
        });
        speedControl.appendChild(speedLabel);
        speedControl.appendChild(speedSlider);

        // 点击事件处理
        button.addEventListener('click', function() {
            if (isScrolling) {
                stopScrolling();
                button.textContent = '开始自动滚动';
                button.style.backgroundColor = '#4CAF50';
            } else {
                startScrolling();
                button.textContent = '停止自动滚动';
                button.style.backgroundColor = '#F44336';
            }
        });
        const checkBoxDiv = document.createElement('div')
        checkBoxDiv.style.marginTop = '5px'
        checkBoxDiv.style.display = 'flex'
        checkBoxDiv.style.alignItems = 'center'
        const checkBox = document.createElement('input')
        checkBox.type = 'checkbox'
        checkBox.id = 'autoscrollnext'
        checkBox.style.margin = 0
        checkBox.style.marginLeft= '5px'
        const spanText = document.createElement('label')
        spanText.setAttribute('for', 'autoscrollnext')
        spanText.style.fontSize = '14px'
        spanText.style.margin = 0
        spanText.innerText = '连续刷帖'

        checkBoxDiv.appendChild(spanText)
        checkBoxDiv.appendChild(checkBox)
        checkBox.addEventListener('change', function(event) {
            event.preventDefault();
            const checked = event.target.checked
            localStorage.setItem('ischecked', checked)
        })
        document.body.appendChild(button);
        document.body.appendChild(speedControl);
        speedControl.appendChild(checkBoxDiv);
    }

    // 自动刷
    let previousUrl = localStorage.getItem('previousUrl')
    setTimeout(function(){
        const checked = localStorage.getItem('ischecked')
        const newUrl = location.href;
        if (newUrl !== previousUrl && checked === 'true') {
            document.querySelector('#auto-scroll-button').click()
            localStorage.setItem('previousUrl', newUrl)
        }
    }, 2000);

    // 开始缓慢滚动到底部
    function startScrolling() {
        if (isScrolling) return;

        isScrolling = true;

        // 使用setInterval方法实现平滑滚动
        scrollInterval = setInterval(function() {
            // 获取当前滚动位置
            const currentPosition = window.pageYOffset || document.documentElement.scrollTop;

            // 获取文档总高度
            const totalHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );

            // 获取视窗高度
            const windowHeight = window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight;

            // 如果已经到达底部，停止滚动
            if (currentPosition + windowHeight + 10 >= totalHeight) {
                // 如果看到底部了，等待一段时间看是否有新内容加载
                if (timer) return
                timer = setTimeout(function(){
                   checkForNewContent(currentPosition, totalHeight)
                }, 500);
            } else {
                // 否则继续向下滚动
                window.scrollBy(0, scrollSpeed);
            }
        }, 10); // 每10毫秒滚动一次，确保平滑
    }

    // 检查是否有新内容加载
    function checkForNewContent(previousPosition, previousHeight) {
        // 获取文档高度
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        // 获取当前滚动位置
        const scrollPosition = window.scrollY + window.innerHeight;

        // 定义一个小的阈值，避免由于计算误差导致判断问题
        const threshold = 10;

        // 如果高度变化了，说明加载了新内容，继续滚动
        if (scrollPosition + threshold >= documentHeight) {
            stopScrolling()
            button.textContent = '开始自动滚动';
            button.style.backgroundColor = '#4CAF50';
            const url = findSpecificTableCellAndGetLink()
            const checked = localStorage.getItem('ischecked')
            if (url && checked === 'true') {
                window.location.href = url
            }
        }
        timer = null;
    }
    function getPreviousSiblingElement(element) {
        // 确保传入的是一个有效的元素
        if (!element || typeof element.previousElementSibling === 'undefined') {
            return null;
        }
        return element.previousElementSibling;
    }
    function findSpecificTableCellAndGetLink() {
        // Get the table with class 'topic-list'
        const table = document.querySelector('table.topic-list');

        if (!table) {
            return null; // Table not found
        }

        // Find all td elements with the specified class within the tbody
        const cells = table.querySelectorAll('tbody td.posts-map.posts.topic-list-data'); //  main-link.topic-list-data
        // Loop through each cell to check conditions
        for (const cell of cells) {
            // Check if the cell contains a span with class 'topic-post-badges'
            const badgeSpan = cell.querySelector('span.number');
            if (badgeSpan) {
                // Get the text content and convert to number
                const value = parseInt(badgeSpan.textContent.trim(), 10);
                // Check if it's a valid number and not greater than 300
                if (!isNaN(value) && value <= 300) {
                    // Find the anchor element within this cell
                    const link = cell.querySelector('a');
                    if (!link.getAttribute('href')) {
                        continue
                    }
                    const prevCell = getPreviousSiblingElement(cell)
                    const prevLink = prevCell.querySelector('a');
                    if (prevLink) {
                        return prevLink ? prevLink.getAttribute('href') : null;
                    }
                    // If link exists, return its href attribute, otherwise return the cell
                    return link ? link.getAttribute('href') : null;
                }
            }
        }

        // No matching cell found
        return null;
    }

    // 停止滚动
    function stopScrolling() {
        if (!isScrolling) return;

        clearInterval(scrollInterval);
        isScrolling = false;
    }

    // 等待页面完全加载后添加按钮
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createScrollButton);
        } else {
            createScrollButton();
            // 设置checkbox
            const _checked = localStorage.getItem('ischecked')
            if (_checked) {
                document.getElementById('autoscrollnext').checked = _checked === 'true'
            }
        }
    }

    // 监听动态内容加载
    function observeDOMChanges() {
        const observer = new MutationObserver(function(mutations) {
            // 当页面内容变化时，确保我们的按钮仍然存在
            if (!document.getElementById('auto-scroll-button')) {
                createScrollButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 执行初始化
    init();
    observeDOMChanges();
})();

