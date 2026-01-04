// ==UserScript==
// @name         蝉镜直接做
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将场景网站首页布局按钮的点击事件改为跳转到工作台
// @author       Your Name
// @match        https://www.chanjing.cc/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536595/%E8%9D%89%E9%95%9C%E7%9B%B4%E6%8E%A5%E5%81%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/536595/%E8%9D%89%E9%95%9C%E7%9B%B4%E6%8E%A5%E5%81%9A.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 函数：修改点击事件
    function modifyClickEvent() {
        // 查找具有指定class的元素
        const layoutBtn = document.querySelector('.layout-btn.home-step-1');
        
        // 如果找到了这个元素
        if (layoutBtn) {
            console.log('场景工作台跳转脚本：找到布局按钮，正在修改点击事件');
            
            // 移除所有已有的点击事件监听器（通过克隆元素实现）
            const newLayoutBtn = layoutBtn.cloneNode(true);
            layoutBtn.parentNode.replaceChild(newLayoutBtn, layoutBtn);
            
            // 添加新的点击事件监听器
            newLayoutBtn.addEventListener('click', function(e) {
                // 阻止原始点击事件的默认行为
                e.preventDefault();
                e.stopPropagation();
                
                // 跳转到指定URL
                window.location.href = 'https://www.chanjing.cc/worktable?direction=vertical&from=home&track=main_home_new';
                
                return false;
            }, true);
            
            console.log('场景工作台跳转脚本：点击事件修改完成');
        }
    }

    // 页面加载完成后执行修改
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(modifyClickEvent, 1000); // 延迟1秒执行，确保DOM元素已加载
    } else {
        window.addEventListener('DOMContentLoaded', function() {
            setTimeout(modifyClickEvent, 1000);
        });
    }

    // 还可以定期检查元素是否出现（对于动态加载的页面）
    const checkInterval = setInterval(function() {
        if (document.querySelector('.layout-btn.home-step-1')) {
            modifyClickEvent();
            clearInterval(checkInterval);
        }
    }, 2000);
})(); 