// ==UserScript==
// @name         抖音弹商品
// @version      1.0
// @description  抖音-巨量百应自动弹商品
// @author       Praise
// @match        https://buyin.jinritemai.com/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/1130807
// @downloadURL https://update.greasyfork.org/scripts/488402/%E6%8A%96%E9%9F%B3%E5%BC%B9%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/488402/%E6%8A%96%E9%9F%B3%E5%BC%B9%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 页面完全加载后执行的代码
    function onPageLoaded() {
        // 延迟执行
        setInterval(startJiangjie, 5000); // 延迟5秒执行
        setInterval(endJiangjie, 20000); // 延迟20秒执行

    }

    function endJiangjie() {
        var buttons = document.querySelectorAll('button'); // 获取所有按钮元素
        var foundTargetButton = false; // 声明一个变量，用于标记是否找到目标按钮
        buttons.forEach(function(button) { // 遍历按钮元素
            var buttonText = button.innerText || button.textContent || button.value || ''; // 获取按钮的文本内容
               if (buttonText.trim() === '取消讲解') { // 如果按钮文本为"讲解"且未找到目标按钮
                button.click(); // 触发点击事件
                foundTargetButton = true; // 设置标记为true，表示已找到目标按钮
                console.log('praise:' + new Date().toLocaleString(), buttonText.trim()); // 打印按钮名称到控制台

            }
        });
    }

        function startJiangjie() {
        var buttons = document.querySelectorAll('button'); // 获取所有按钮元素
        var foundTargetButton = false; // 声明一个变量，用于标记是否找到目标按钮
        buttons.forEach(function(button) { // 遍历按钮元素
            var buttonText = button.innerText || button.textContent || button.value || ''; // 获取按钮的文本内容
            if (buttonText.trim() === '讲解' && !foundTargetButton) { // 如果按钮文本为"讲解"且未找到目标按钮
                button.click(); // 触发点击事件
                foundTargetButton = true; // 设置标记为true，表示已找到目标按钮
                console.log('praise:' + new Date().toLocaleString() , buttonText.trim()); // 打印按钮名称到控制台

            }
        });
    }

    // 当页面完全加载后调用onPageLoaded函数
    window.addEventListener('load', onPageLoaded);
})();
