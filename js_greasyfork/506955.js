// ==UserScript==
// @name         网页版抖音自动设置高清画质
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  自动点击高清选项
// @icon         https://xxmdmst.oss-cn-beijing.aliyuncs.com/imgs/favicon.ico
// @author       kif5
// @match        https://www.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506955/%E7%BD%91%E9%A1%B5%E7%89%88%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E9%AB%98%E6%B8%85%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/506955/%E7%BD%91%E9%A1%B5%E7%89%88%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E9%AB%98%E6%B8%85%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个标志变量，用于控制是否继续检查
    let isHighDefinitionSelected = false;

    // 定义一个函数来检查并点击高清选项
    function checkAndClickHighDefinition() {
        // 检查高清选项是否已选择
        var highDefinitionButton = document.querySelector('.xgplayer-playclarity-setting .item.selected');
        if (highDefinitionButton && highDefinitionButton.querySelector('span') && highDefinitionButton.querySelector('span').textContent.trim() === '高清') {
            console.log('已经是高清选项');
            isHighDefinitionSelected = true; // 标记为高清选项已选择
        } else {
            isHighDefinitionSelected = false; // 标记为高清选项未选择
        }

        // 如果高清选项未选择，尝试点击设置按钮并选择高清
        if (!isHighDefinitionSelected) {
            var settingsButton = document.querySelector('.xgplayer-playclarity-setting');
            if (settingsButton) {
                settingsButton.click();
                console.log('已点击设置按钮');
            }

            // 获取所有清晰度选项的元素
            var clarityButtons = document.querySelectorAll('.xgplayer-playclarity-setting .item:not(.selected)');

            // 找到高清选项并点击
            clarityButtons.forEach(function(button) {
                if (button.querySelector('span') && button.querySelector('span').textContent.trim() === '高清') {
                    button.click();
                    console.log('已点击高清选项');
                    isHighDefinitionSelected = true; // 标记为高清选项已选择
                }
            });
        }
    }

    // 定期检查并点击高清选项
    setInterval(checkAndClickHighDefinition, 1000); // 每1000毫秒（1秒）检查一次

    // 监听页面变化，如果高清选项被选中，则停止检查
    document.addEventListener('click', function() {
        var highDefinitionButton = document.querySelector('.xgplayer-playclarity-setting .item.selected');
        if (highDefinitionButton && highDefinitionButton.querySelector('span') && highDefinitionButton.querySelector('span').textContent.trim() === '高清') {
            isHighDefinitionSelected = true;
            console.log('检测到高清选项已选中，停止进一步检查');
            clearInterval(checkAndClickHighDefinition); // 停止定时检查
        }
    });
})();