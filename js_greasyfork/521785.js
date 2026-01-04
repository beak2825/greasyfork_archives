// ==UserScript==  
// @name         直播弹窗  
// @namespace    http://tampermonkey.net/  
// @version      1.0  
// @description  在抖音中控台实现弹窗操作  
// @author       叶思年  
// @match        https://buyin.jinritemai.com/*  
// @grant        none  
// @license      GPL-3.0  
// @downloadURL https://update.greasyfork.org/scripts/521785/%E7%9B%B4%E6%92%AD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/521785/%E7%9B%B4%E6%92%AD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==    

/*  
GNU GENERAL PUBLIC LICENSE  
Version 3, 29 June 2007  

Copyright © 2024 叶思年  

Everyone is permitted to copy and distribute verbatim copies  
of this license document, but changing it is not allowed.  

This program is free software: you can redistribute it and/or modify  
it under the terms of the GNU General Public License as published by  
the Free Software Foundation, either version 3 of the License, or  
(at your option) any later version.  

This program is distributed in the hope that it will be useful,  
but WITHOUT ANY WARRANTY; without even the implied warranty of  
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the  
GNU General Public License for more details.  

You should have received a copy of the GNU General Public License  
along with this program. If not, see <https://www.gnu.org/licenses/>.  
*/  

(function () {  
    'use strict';  

    // 创建交互界面的容器  
    const uiContainer = document.createElement('div');  
    uiContainer.style.position = 'fixed';  
    uiContainer.style.top = '515px';  
    uiContainer.style.right = '8px';  
    uiContainer.style.zIndex = '9999'; // 提升 z-index  
    uiContainer.style.backgroundColor = '#fff';  
    uiContainer.style.border = '3px solid #007bff';  
    uiContainer.style.padding = '8px';  
    uiContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';  
    uiContainer.style.borderRadius = '6px';  
    uiContainer.style.width = '55px';  
    uiContainer.style.height = 'auto';  
    uiContainer.style.display = 'flex'; // 确保是可见  
    uiContainer.style.flexDirection = 'column';  
    uiContainer.style.alignItems = 'center';  

    // 创建状态提示  
    const statusMessage = document.createElement('div');  
    statusMessage.style.marginBottom = '6px';  
    statusMessage.style.fontSize = '14px';  
    statusMessage.style.textAlign = 'center';  
    statusMessage.textContent = '点击开始';  
    uiContainer.appendChild(statusMessage);  

    // 创建按钮函数  
    function createButton(text, bgColor, disabled = false) {  
        const button = document.createElement('button');  
        button.textContent = text;  
        button.style.display = 'block';  
        button.style.margin = '0 auto 2px';  
        button.style.padding = '5px';  
        button.style.backgroundColor = bgColor;  
        button.style.color = 'white';  
        button.style.border = 'none';  
        button.style.borderRadius = '4px';  
        button.style.cursor = 'pointer';  
        button.style.fontSize = '14px';  
        button.style.width = '35px';  
        button.disabled = disabled;  
        return button;  
    }  

    const startButton = createButton('开始', '#28a745');  
    const stopButton = createButton('停止', '#dc3545', true);  
    const helpButton = createButton('帮助', '#007bff');  

    uiContainer.appendChild(startButton);  
    uiContainer.appendChild(stopButton);  
    uiContainer.appendChild(helpButton);  
    document.body.appendChild(uiContainer);  

    let clickInterval;  

    // 点击按钮的函数  
    function performClick() {  
        const button = document.querySelector('.lvc2-grey-btn.active, .lvc2-grey-btn:hover');  
        if (button) {  
            button.click();  
            console.log('Button clicked!');  
            setTimeout(() => {  
                button.click();  
                console.log('Button clicked again!');  
            }, 500);  
        } else {  
            console.log('Button not found.');  
            // 这里可以添加一些条件，避免频繁停止  
            if (clickInterval) {  
                clearInterval(clickInterval);  
                startButton.textContent = '重启';  
                startButton.disabled = false;  
                stopButton.disabled = true;  
                statusMessage.textContent = '意外暂停';  
                uiContainer.style.borderColor = 'red';  
                uiContainer.style.boxShadow = '0 2px 5px rgba(255,0,0,0.5)';  
            }  
        }  
    }  

    // 开始点击操作的事件监听器  
    startButton.addEventListener('click', function () {  
        // 清除之前的点击间隔  
        clearInterval(clickInterval);  
        statusMessage.textContent = '正在弹窗';  
        startButton.disabled = true;  
        stopButton.disabled = false;  
        uiContainer.style.borderColor = 'green';  
        uiContainer.style.boxShadow = '0 2px 5px rgba(0,255,0,0.5)';  
        performClick();  
        clickInterval = setInterval(performClick, 10000);  
    });  

    // 停止点击操作的事件监听器  
    stopButton.addEventListener('click', function () {  
        clearInterval(clickInterval);  
        startButton.textContent = '开始';  
        startButton.disabled = false;  
        stopButton.disabled = true;  
        statusMessage.textContent = '操作已停止。';  
        uiContainer.style.borderColor = '#007bff';  
        uiContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';  
    });  

    // 帮助按钮事件监听器  
    helpButton.addEventListener('click', function () {  
        alert('帮助信息：\n 1、本脚本为提升商品曝光促进转化所用，使用前请先阅读本篇帮助来助于您对本脚本的了解。\n\n 2、“点击开始”按钮前请确保已有商品正在讲解当中，这点很重要！请留意直播画面。\n\n 3、如提示“未找到要点击的按钮”，请点击重启即可。\n\n4、自动弹链接的选择方式是基于正在讲解的商品来进行弹出的，如遇到换款的情况，正常手动换款后，弹链接的选择判定也会同步更新。\n\n5、如使用脚本期间遇到问题可联系微信：wx8691wt');  
    });  

    // 监听页面DOM变化  
    const observer = new MutationObserver(() => {  
        if (!document.body.contains(uiContainer)) {  
            document.body.appendChild(uiContainer);  
        }  
    });  

    observer.observe(document.body, { childList: true, subtree: true });  
})();