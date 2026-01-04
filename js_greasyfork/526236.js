// ==UserScript==
// @name         图片黑白效果和开关灯效果
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  给页面上的所有图片添加黑白效果，并通过按钮控制开关黑白效果和开关灯效果
// @author       乂
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526236/%E5%9B%BE%E7%89%87%E9%BB%91%E7%99%BD%E6%95%88%E6%9E%9C%E5%92%8C%E5%BC%80%E5%85%B3%E7%81%AF%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/526236/%E5%9B%BE%E7%89%87%E9%BB%91%E7%99%BD%E6%95%88%E6%9E%9C%E5%92%8C%E5%BC%80%E5%85%B3%E7%81%AF%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("脚本加载成功")
    // 获取页面上所有的图片
    let images = document.querySelectorAll('img');
    let grayscaleEnabled = true; // 默认开启黑白效果
    let darkModeEnabled = false; // 默认关闭开关灯效果（暗模式）

    // 创建黑白效果按钮
    let grayscaleButton = document.createElement('button');
    grayscaleButton.textContent = '切换黑白效果';
    grayscaleButton.style.position = 'fixed';
    grayscaleButton.style.bottom = '20px';
    grayscaleButton.style.left = '50%';
    grayscaleButton.style.transform = 'translateX(-50%)';
    grayscaleButton.style.padding = '10px 20px';
    grayscaleButton.style.backgroundColor = '#007bff';
    grayscaleButton.style.color = 'white';
    grayscaleButton.style.border = 'none';
    grayscaleButton.style.borderRadius = '5px';
    grayscaleButton.style.cursor = 'pointer';
    grayscaleButton.style.zIndex = '9999';  // 确保按钮浮在页面之上

    // 创建开关灯按钮
    let darkModeButton = document.createElement('button');
    darkModeButton.textContent = '开启暗模式';
    darkModeButton.style.position = 'fixed';
    darkModeButton.style.bottom = '70px';  // 位于黑白效果按钮上方
    darkModeButton.style.left = '50%';
    darkModeButton.style.transform = 'translateX(-50%)';
    darkModeButton.style.padding = '10px 20px';
    darkModeButton.style.backgroundColor = '#28a745';
    darkModeButton.style.color = 'white';
    darkModeButton.style.border = 'none';
    darkModeButton.style.borderRadius = '5px';
    darkModeButton.style.cursor = 'pointer';
    darkModeButton.style.zIndex = '9999';  // 确保按钮浮在页面之上

    // 将按钮添加到页面
    document.body.appendChild(grayscaleButton);
    document.body.appendChild(darkModeButton);

    // 给黑白效果按钮添加点击事件，切换黑白效果
    grayscaleButton.addEventListener('click', () => {
        grayscaleEnabled = !grayscaleEnabled; // 切换状态
        images.forEach(img => {
            if (grayscaleEnabled) {
                img.style.filter = 'grayscale(100%)'; // 启用黑白效果
            } else {
                img.style.filter = ''; // 恢复原始状态
            }
        });
        grayscaleButton.textContent = grayscaleEnabled ? '取消黑白效果' : '开启黑白效果'; // 更新按钮文本
    });

    // 给开关灯按钮添加点击事件，切换暗模式
    darkModeButton.addEventListener('click', () => {
        darkModeEnabled = !darkModeEnabled; // 切换状态
        if (darkModeEnabled) {
            document.body.style.filter = 'brightness(50%)'; // 开启暗模式
            darkModeButton.textContent = '取消暗模式'; // 更新按钮文本
        } else {
            document.body.style.filter = ''; // 恢复原始亮度
            darkModeButton.textContent = '开启暗模式'; // 更新按钮文本
        }
    });

    // 初始化页面图片的黑白效果
    images.forEach(img => {
        img.style.filter = 'grayscale(100%)';
    });
})();
/*
MIT License

Copyright (c) 2025 乂

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/