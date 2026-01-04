// ==UserScript==
// @name         学习公社-20分钟自动点击
// @namespace    https://study.enaea.edu.cn/
// @version      1.1
// @description  每隔20分钟自动点击弹出框确定按钮
// @match        https://study.enaea.edu.cn/*
// @grant        none
// @license      MIT    
// @downloadURL https://update.greasyfork.org/scripts/493146/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE-20%E5%88%86%E9%92%9F%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/493146/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE-20%E5%88%86%E9%92%9F%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

function checkAndClickButton() {
    // 查询页面上是否存在特定的按钮
    const button = document.querySelector('button[style*="background-color: rgb(192, 19, 13)"]');
    if (button) {
        // 生成一个介于3000毫秒（3秒）到15000毫秒（15秒）之间的随机延时
        let delay = Math.floor(Math.random() * (15000 - 3000 + 1) + 3000);
        console.log(`找到按钮，将在 ${delay / 1000} 秒后自动点击...`);
        
        // 使用setTimeout来实现延时点击
        setTimeout(() => {
            console.log('正在点击按钮...');
            button.click();
        }, delay);
    } else {
        console.log('当前没有找到指定的按钮。');
    }
}

// 首先执行一次检查，以处理页面加载时已存在的按钮
checkAndClickButton();

// 创建一个观察器实例并传入回调函数
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(node => {
            // 检查是否是元素节点，并且包含特定的按钮
            if (node.nodeType === 1 && node.querySelector('button[style*="background-color: rgb(192, 19, 13)"]')) {
                checkAndClickButton();
            }
        });
    });
});

// 配置观察选项
var config = { childList: true, subtree: true };

// 选择需要观察变动的节点
var targetNode = document.body;

// 调用 `observe` 方法开始观察选定的节点
observer.observe(targetNode, config);

console.log('观察者已激活，继续等待按钮出现...');
