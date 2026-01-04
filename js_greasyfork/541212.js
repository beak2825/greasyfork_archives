// ==UserScript==
// @name         MiroTalk Auto Full Screen (Custom User)
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Automatically enter full screen mode for a specific user
// @author       You
// @match        https://p2p.mirotalk.com/join/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541212/MiroTalk%20Auto%20Full%20Screen%20%28Custom%20User%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541212/MiroTalk%20Auto%20Full%20Screen%20%28Custom%20User%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义目标用户名 - 修改此处可以切换目标用户
    const TARGET_USER = 'huaix3';

    console.log(`MiroTalk自动全屏脚本已启动，目标: ${TARGET_USER}`);
    
    // 存储按钮点击状态
    let isButtonClicked = false;
    let clickAttempts = 0;
    
    // 每10秒执行一次检查和点击
    const intervalId = setInterval(function() {
        clickAttempts++;
        console.log(`尝试查找${TARGET_USER}的全屏按钮，第${clickAttempts}次尝试`);
        
        // 查找包含目标用户名的视频容器
        const videoContainers = document.querySelectorAll('.videoPeerName');
        let targetContainer = null;
        
        videoContainers.forEach(container => {
            if (container.textContent.trim() === TARGET_USER) {
                targetContainer = container.parentElement;
                console.log(`找到${TARGET_USER}的视频容器`);
            }
        });
        
        // 如果找到目标容器，查找并点击全屏按钮
        if (targetContainer) {
            // 在容器内查找全屏按钮（ID包含"fullScreen"且有expand图标）
            const fullScreenButton = targetContainer.querySelector('button[id*="fullScreen"][class*="fa-expand"]');
            
            if (fullScreenButton) {
                fullScreenButton.click();
                isButtonClicked = true;
                console.log(`已成功点击${TARGET_USER}的全屏按钮`);
                clearInterval(intervalId);
            } else {
                console.log(`在${TARGET_USER}的视频容器中未找到全屏按钮`);
            }
        } else {
            console.log(`未找到${TARGET_USER}的视频容器，10秒后再次尝试`);
        }
        
        // 如果尝试超过30次（5分钟），则停止尝试
        if (clickAttempts >= 30) {
            console.log('已尝试30次，停止查找全屏按钮');
            clearInterval(intervalId);
        }
    }, 10000); // 10秒间隔
})();