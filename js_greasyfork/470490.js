// ==UserScript==
// @name         删除Bilibili网站的前往内测按钮和插件阻拦提示
// @namespace    your-namespace
// @version      2.0
// @description  自动删除Bilibili网站上的前往内测按钮和插件阻拦提示
// @match        https://www.bilibili.com/
// @author       梦呓萤殇
// @grant        none
// @icon64       https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo.png
// @downloadURL https://update.greasyfork.org/scripts/470490/%E5%88%A0%E9%99%A4Bilibili%E7%BD%91%E7%AB%99%E7%9A%84%E5%89%8D%E5%BE%80%E5%86%85%E6%B5%8B%E6%8C%89%E9%92%AE%E5%92%8C%E6%8F%92%E4%BB%B6%E9%98%BB%E6%8B%A6%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/470490/%E5%88%A0%E9%99%A4Bilibili%E7%BD%91%E7%AB%99%E7%9A%84%E5%89%8D%E5%BE%80%E5%86%85%E6%B5%8B%E6%8C%89%E9%92%AE%E5%92%8C%E6%8F%92%E4%BB%B6%E9%98%BB%E6%8B%A6%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var maxTries = 5; // 最大尝试次数
    var currentTry = 0; // 当前尝试次数
    var deletionComplete = false; // 删除完成标志

    // 创建 MutationObserver 对象
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查是否有新添加的节点
            if (mutation.addedNodes) {
                // 遍历新增节点
                mutation.addedNodes.forEach(function(node) {
                    // 检查是否为目标按钮元素
                    if (node.nodeName === 'BUTTON' && node.classList.contains('primary-btn') && node.classList.contains('go-back')) {
                        // 删除目标按钮元素
                        node.remove();
                        deletionComplete = true; // 标记删除完成
                    }

                    // 检查是否为插件阻拦提示的节点
                    if (node.nodeName === 'DIV' && node.classList.contains('adblock-tips')) {
                        // 删除插件阻拦提示节点
                        node.remove();
                    }
                });
            }
        });
    });

    // 配置 MutationObserver 监听选项
    var observerOptions = {
        childList: true,
        subtree: true
    };

    // 检测页面是否存在目标按钮元素，并进行删除
    function checkAndRemoveButton() {
        var targetElement = document.querySelector('button.primary-btn.go-back');
        if (targetElement) {
            targetElement.remove();
            deletionComplete = true; // 标记删除完成
        }
    }

    // 检测页面是否存在插件阻拦提示节点，并进行删除
    function checkAndRemoveAdBlockTips() {
        var targetElement = document.querySelector('div.adblock-tips');
        if (targetElement) {
            targetElement.remove();
        }
    }

    // 在页面加载完成后执行脚本
    window.addEventListener('load', function() {
        // 检测并删除按钮元素
        checkAndRemoveButton();
        // 检测并删除插件阻拦提示节点
        checkAndRemoveAdBlockTips();

        // 开始观察页面变化
        observer.observe(document.documentElement, observerOptions);

        // 创建悬浮窗口
        var popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '27.5%';//浮窗上下位置
        popup.style.left = '50%';//浮窗左右位置
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#fff';
        popup.style.padding = '10px';
        popup.style.border = 'none'; // 隐藏边框
        popup.style.outline = 'none'; // 移除轮廓边框
        popup.style.zIndex = '9999';
        popup.style.textAlign = 'center';
        popup.style.fontWeight = 'bold';
        popup.style.color = 'red'; // 修改文字颜色为红色

        // 将悬浮窗口添加到页面中
        document.body.appendChild(popup);

        // 设置定时器，每秒钟检测按钮元素和插件阻拦提示节点并进行删除
        var timer = setInterval(function() {
            currentTry++;
            checkAndRemoveButton();
            checkAndRemoveAdBlockTips();

            // 达到最大尝试次数时停止定时器
            if (currentTry >= maxTries || (deletionComplete && !document.querySelector('div.adblock-tips'))) {
                clearInterval(timer);
            }

            // 显示不同的信息
            if (currentTry <= maxTries) {
                popup.textContent = '----------------------------    正在删除前往内测按钮和插件阻拦提示...    ----------------------------';
                popup.style.background = 'rgba(255, 255, 255, 0)'; // 修改背景为15%的透明度

                // 1秒后将文字修改为空
                setTimeout(function() {
                    popup.textContent = '';
                }, 1000);
            }
            if (deletionComplete && !document.querySelector('div.adblock-tips')) {
                popup.textContent = '----------------------------    前往内测按钮和插件阻拦提示已成功删除！    ----------------------------';
                popup.style.background = 'rgba(255, 255, 255, 0)'; // 修改背景为15%的透明度

                // 2秒后移除悬浮窗口
                setTimeout(function() {
                    document.body.removeChild(popup);
                }, 4500);
            }
        }, 1000);
    });
})();
