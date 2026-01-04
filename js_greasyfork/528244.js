// ==UserScript==
// @name         DeepSeek清空历史记录
// @version      0.7
// @description  在历史记录页面右上角“清空历史记录”，点击后清空所有历史记录
// @author       Yu1978
// @match        https://chat.deepseek.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1440235
// @downloadURL https://update.greasyfork.org/scripts/528244/DeepSeek%E6%B8%85%E7%A9%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/528244/DeepSeek%E6%B8%85%E7%A9%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
 
    const startButton = document.createElement('button');
    startButton.textContent = '清空历史记录';
    
    // 设置按钮样式
    startButton.style.position = 'fixed';
    startButton.style.top = '15px'; // 距离顶部15px
    startButton.style.right = '15px'; // 距离右侧15px
    startButton.style.zIndex = 999999;

    // 按钮外观样式
    startButton.style.backgroundColor = '#4D6BFE'; // 黑色背景
    startButton.style.color = 'white'; // 白色文字
    startButton.style.fontSize = '16px'; // 文字大小
    startButton.style.fontWeight = 'bold'; // 文字加粗
    startButton.style.padding = '10px 10px'; // 内边距，左右更宽
    startButton.style.border = 'none'; // 去掉默认边框
    startButton.style.borderRadius = '30px'; // 两端圆形
    startButton.style.cursor = 'pointer'; // 鼠标悬浮时显示指针
    startButton.style.transition = 'background-color 0.3s ease'; // 添加平滑的颜色变化效果

    // 设置文本竖排
    startButton.style.writingMode = 'vertical-rl'; // 使文字竖排，rtl表示从右到左
    // startButton.style.textAlign = 'center'; // 设置文字居中
    startButton.style.letterSpacing = '5px'; // 设置字间距
    startButton.style.height = 'auto'; // 高度自适应内容
    startButton.style.width = '30px'; // 设置按钮宽度，防止太宽
    startButton.style.display = 'flex'; // 使用flex布局
    startButton.style.alignItems = 'center'; // 垂直居中
    startButton.style.justifyContent = 'center'; // 水平居中
    startButton.style.paddingLeft = '7px'; // 手动增加填充使文字水平居中
 
    // 鼠标悬浮时的效果
    startButton.onmouseover = function() {
        startButton.style.backgroundColor = '#3A50BF'; // 鼠标悬浮时变暗
    };
 
    startButton.onmouseout = function() {
        startButton.style.backgroundColor = '#4D6BFE'; // 鼠标移出时恢复原色
    };
 
    document.body.appendChild(startButton);
 
    // 开始按钮点击事件处理函数
    startButton.addEventListener('click', async function() {
        var moreBtn = document.querySelectorAll('.aa7b7ebb');
        var delayTime = 1000;

        function waitFor(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function performClicks() {
            for (var i = 0; i < moreBtn.length; i++) {
                var elementA = moreBtn[i];

                elementA.click();
                await waitFor(delayTime);

                var deleteBtn = document.querySelector('.ds-dropdown-menu-option--error');

                if (deleteBtn) {
                    deleteBtn.click();

                    await waitFor(delayTime);
                    var sureBtn = document.querySelector('.ds-button--error');

                    if (sureBtn) {
                        sureBtn.click();
                    }
                }
            }
        }

        performClicks();

    });
})();