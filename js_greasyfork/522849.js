// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       People starving to death
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    let isLibraryInitialized = false;

    // 判断当前页面是否为列表页 /geek/job
    const isListPage = window.location.href.includes("/geek/job");

    // 处理列表页的逻辑
    function processListPage() {
        if (isLibraryInitialized) return;
        console.log("正在处理列表页...");
        isLibraryInitialized = true;

        // 获取列表中的所有职位项
        const jobListItems = document.querySelectorAll('ul.job-list-box > li'); // 替换为你实际的列表项选择器

        // 监听翻页操作
        const nextPageButton = document.querySelector('.pagination-next');
        if (nextPageButton) {
            nextPageButton.addEventListener('click', function() {
                console.log("翻页了，重新加载列表页面");
                // 重新调用列表页的处理函数
                setTimeout(() => hideJobItems(), 500); // 延时处理，等待新页面加载
            });
        }

        // 监听 postMessage 事件，接收来自详情页的消息
        window.addEventListener("message", function(event) {
            if (isListPage && event.data && event.data.type === "hideJobItem" && event.data.data) {
                const { nameText, salary, bossInfo } = event.data.data;
                console.log(`接收到隐藏职位的事件: ${nameText}`);
                hideJobItems(nameText, salary, bossInfo);  // 调用处理隐藏的函数
            }
        });

        // 每次页面加载或翻页后，处理所有符合条件的职位项
        hideJobItems(); // 自动执行隐藏任务
    }

    // 直接暴露的全局方法，可以供详情页调用
    window.hideJobItem = function(nameText, salary, bossInfo) {
        console.log(`通过库函数在列表页隐藏职位项: ${nameText}, ${salary}, ${bossInfo}`);
        hideJobItems(nameText, salary, bossInfo); // 调用处理隐藏的函数
    };

    // 根据传递的职位信息来隐藏职位项
    function hideJobItems(nameText = null, salary = null, bossInfo = null) {
        const jobListItems = document.querySelectorAll('ul.job-list-box > li'); // 替换为你实际的列表项选择器
console.log('document',document)
        console.log('jobListItems',jobListItems)
        jobListItems.forEach(function(item) {
            const itemText = item.textContent;
            console.log('nameText',nameText)
            console.log('itemText',itemText)
            const matchesName = nameText === '' || itemText.includes(nameText);
        const matchesSalary = salary === '' || itemText.includes(salary);
        const matchesBossInfo = bossInfo === '' || itemText.includes(bossInfo);
            // 检查职位项中是否包含相应的名称、薪资和老板信息
            if (matchesName && matchesSalary && matchesBossInfo) {
                item.style.display = 'none';
                console.log(`在列表页隐藏职位项: ${nameText}`);
            }
        });
    }

    // 使用 MutationObserver 监听 DOM 变化
    function observePageChanges() {
        const observer = new MutationObserver(() => {
            // 每次 DOM 发生变化时，检查职位项是否需要隐藏
            hideJobItems();
        });

        // 配置 MutationObserver
        observer.observe(document.body, {
            childList: true, // 监听子节点的变化
            subtree: true,   // 监听所有子孙节点的变化
        });
    }

    // 在页面加载完成后执行，确保元素都存在
    window.addEventListener('load', function() {
        if (isListPage) {
            console.log("页面为列表页");
            processListPage();
            observePageChanges(); // 开始监听页面变化
        }
    });
})();