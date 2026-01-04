// ==UserScript==
// @name         Customize Selection Colors - 自定义选中颜色
// @version      1.0
// @description  Change the color of selected text across all websites with high priority - 修改选中内容的颜色
// @author       ZiLite
// @license      MIT
// @match        *://*/*
// @namespace    https://greasyfork.org/users/1131465
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @icon         https://m.qpic.cn/psc?/V10YE8Jx247iW0/ruAMsa53pVQWN7FLK88i5l0iQp8*LN4Ex9R89cVA*vLporiTR32ItvbXakCw6YMUwwgtNrjoW*nPlcH09oy5V*fZVXzqAK3MXUUB50*zJ7k!/b&bo=OAQ4BAAAAAADByI!&rf=viewer_4
// @downloadURL https://update.greasyfork.org/scripts/497118/Customize%20Selection%20Colors%20-%20%E8%87%AA%E5%AE%9A%E4%B9%89%E9%80%89%E4%B8%AD%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/497118/Customize%20Selection%20Colors%20-%20%E8%87%AA%E5%AE%9A%E4%B9%89%E9%80%89%E4%B8%AD%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加默认样式
    function addCustomStyles(textColor, bgColor) {
        GM_addStyle(`
            body ::selection {
                color: ${textColor} !important;
                background: ${bgColor} !important;
            }
            body ::-moz-selection {
                color: ${textColor} !important;
                background: ${bgColor} !important;
            }
        `);
    }

    // 获取保存的颜色值
    const defaultTextColor = '#fff';
    const defaultBgColor = '#FF490D';
    const textColor = GM_getValue('textColor', defaultTextColor);
    const bgColor = GM_getValue('bgColor', defaultBgColor);

    addCustomStyles(textColor, bgColor);

    // 创建设置面板
    let settingsPanel = null;

    function createSettingsPanel() {
        if (settingsPanel) return; // 防止打开多个设置面板

        const panel = document.createElement('div');
        const titleFontSize = 24; // 标题字体大小
        const fontSize = titleFontSize * 0.618; // 内容字体大小，黄金比例
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.padding = '20px';
        panel.style.width = '450px';
        panel.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // 透明度降低20%
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '10px';
        panel.style.zIndex = '9999';
        panel.style.fontSize = `${fontSize}px`;
        panel.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
        panel.style.fontFamily = 'Segoe UI, Arial, sans-serif';
        panel.style.textAlign = 'center';
        panel.style.backdropFilter = 'blur(10px)'; // 实时背景模糊效果

        panel.innerHTML = `
            <h2 style="margin-top: 0; margin-bottom: 20px; color: #000; font-size: ${titleFontSize}px;">选中颜色设置面板</h2>
            <div style="margin-bottom: 20px; color: #000;">
                <div>文本颜色设置:</div>
                <input type="color" id="textColor" value="${textColor}" style="margin-top: 10px; width: 50px; height: 50px; border: none; cursor: pointer;">
            </div>
            <div style="margin-bottom: 20px; color: #000;">
                <div>背景颜色设置:</div>
                <input type="color" id="bgColor" value="${bgColor}" style="margin-top: 10px; width: 50px; height: 50px; border: none; cursor: pointer;">
            </div>
            <div>
                <button id="saveBtn" style="margin-right: 10px; padding: 10px 20px; background-color: #FF490D; color: #fff; border: none; border-radius: 5px; font-size: ${fontSize}px;">保存</button>
                <button id="closeBtn" style="padding: 10px 20px; background-color: #f2f2f2; color: #000; border: none; border-radius: 5px; font-size: ${fontSize}px;">关闭</button>
            </div>
            <p style="text-align: center; margin-top: 20px; font-size: ${fontSize * 0.5}px; color: #666;">By ZiLite (=╹ヮ╹=)</p>
        `;

        document.body.appendChild(panel);
        settingsPanel = panel;

        // 警告提示框
        const warning = document.createElement('div');
        warning.id = 'warning';
        warning.style.position = 'fixed';
        warning.style.top = 'calc(50% + 250px)'; // 设置面板底部下方
        warning.style.left = '50%';
        warning.style.transform = 'translateX(-50%)';
        warning.style.backgroundColor = '#ffcc00';
        warning.style.color = '#000';
        warning.style.borderRadius = '15px';
        warning.style.padding = '10px';
        warning.style.marginTop = '10px';
        warning.style.fontSize = `${fontSize * 0.8}px`;
        warning.style.display = 'none';
        warning.style.zIndex = '9999';
        warning.textContent = '⚠️此设置可能会导致无法正常阅读';
        document.body.appendChild(warning);

        // 颜色选择器事件处理
        document.getElementById('textColor').addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止冒泡，防止点击周围空白处也触发事件
        });
        document.getElementById('bgColor').addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止冒泡，防止点击周围空白处也触发事件
        });

        // 添加颜色变化的监听器
        function checkColorContrast() {
            const newTextColor = document.getElementById('textColor').value;
            const newBgColor = document.getElementById('bgColor').value;

            // 简单对比算法，判断颜色是否接近
            const textRGB = parseInt(newTextColor.slice(1), 16);
            const bgRGB = parseInt(newBgColor.slice(1), 16);
            const rDiff = Math.abs((textRGB >> 16) - (bgRGB >> 16));
            const gDiff = Math.abs(((textRGB >> 8) & 0xff) - ((bgRGB >> 8) & 0xff));
            const bDiff = Math.abs((textRGB & 0xff) - (bgRGB & 0xff));
            const threshold = 100; // 加大颜色相似度的判断阈值

            if (rDiff < threshold && gDiff < threshold && bDiff < threshold) {
                warning.style.display = 'block';
            } else {
                warning.style.display = 'none';
            }
        }

        document.getElementById('textColor').addEventListener('input', checkColorContrast);
        document.getElementById('bgColor').addEventListener('input', checkColorContrast);

        document.getElementById('saveBtn').addEventListener('click', function() {
            const newTextColor = document.getElementById('textColor').value;
            const newBgColor = document.getElementById('bgColor').value;

            GM_setValue('textColor', newTextColor);
            GM_setValue('bgColor', newBgColor);

            // 重新应用新样式
            addCustomStyles(newTextColor, newBgColor);

            // 反馈保存成功
            alert('颜色已保存！');
        });

        document.getElementById('closeBtn').addEventListener('click', function() {
            document.body.removeChild(panel);
            document.body.removeChild(warning);
            settingsPanel = null;
        });

        // 防止点击面板以外的地方关闭面板
        panel.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        document.body.addEventListener('click', function() {
            if (settingsPanel) {
                document.body.removeChild(settingsPanel);
                document.body.removeChild(warning);
                settingsPanel = null;
            }
        });

        // 初始化颜色对比检查
        checkColorContrast();
    }

    // 注册菜单命令
    GM_registerMenuCommand('设置选中颜色', createSettingsPanel);
})();
