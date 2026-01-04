// ==UserScript==
// @name         浏览器滚动条美化
// @description  这款插件可以让你美化浏览器滚动条，提供了大、中、小三种滚动条宽度和浅色、深色、跟随系统主题三种颜色选择。
// @version      3.0
// @author       柒刻
// @icon         data:image/png;base64,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
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @namespace https://greasyfork.org/users/1067482
// @downloadURL https://update.greasyfork.org/scripts/480120/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/480120/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取保存的滚动条宽度，如果没有则默认为10PX
    let scrollbarWidth = GM_getValue('scrollbarWidth', 10);
    // 获取保存的滚动条颜色主题，如果没有则默认为跟随系统
    let scrollbarColorTheme = GM_getValue('scrollbarColorTheme', 'system');

    // 应用滚动条样式
    applyScrollbarStyle(scrollbarWidth, scrollbarColorTheme);

    // 注册设置菜单命令
    GM_registerMenuCommand('设置', () => {
        // 弹出设置窗口
        showSettingsPopup();
    });

    // 监听系统主题模式变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // 当系统主题模式发生变化时，重新应用滚动条样式
        scrollbarColorTheme = e.matches ? 'dark' : 'light';
        applyScrollbarStyle(scrollbarWidth, scrollbarColorTheme);
    });

    // 应用滚动条样式的函数
    function applyScrollbarStyle(width, theme) {
        // 获取滚动条颜色
        const scrollbarColor = getScrollbarColor(theme);

        // 添加自定义样式
        GM_addStyle(`
            *::-webkit-scrollbar {
                width: ${width}px!important;
                height: ${width}px!important;
            }
            *::-webkit-scrollbar-thumb {
                background-color: ${scrollbarColor} !important;
                border-radius: 5px; /* 添加圆角属性 */
            }
        `);
    }

    // 弹出设置窗口的函数
    function showSettingsPopup() {
        // 创建背景遮罩
        const mask = document.createElement('div');
        mask.style.position = 'fixed';
        mask.style.top = '0';
        mask.style.left = '0';
        mask.style.width = '100%';
        mask.style.height = '100%';
        mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        mask.style.zIndex = '999999';
        document.body.appendChild(mask);

        // 创建设置窗口
        const popup = document.createElement('div');
        popup.innerHTML = `
            <div style="width: 300px; background-color: #fff; border-radius: 8px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999999; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #007bff; color: #fff; text-align: center; font-weight: 700; font-size: 18px; padding: 10px 0; border-radius: 8px 8px 0 0;">菜单</div>
                <div style="padding: 20px;">
                    <button id="btn-width-16" style="width: 100%; padding: 10px 0; background-color: ${scrollbarWidth === 16 ? '#007bff' : '#e9ecef'}; color: ${scrollbarWidth === 16 ? '#fff' : '#495057'}; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 16px;" data-width="16">大-16PX</button>
                    <button id="btn-width-10" style="width: 100%; padding: 10px 0; background-color: ${scrollbarWidth === 10 ? '#007bff' : '#e9ecef'}; color: ${scrollbarWidth === 10 ? '#fff' : '#495057'}; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;" data-width="10">中-10PX</button>
                    <button id="btn-width-6" style="width: 100%; padding: 10px 0; background-color: ${scrollbarWidth === 6 ? '#007bff' : '#e9ecef'}; color: ${scrollbarWidth === 6 ? '#fff' : '#495057'}; border: none; border-radius: 5px; cursor: pointer;" data-width="6">小-6PX</button>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                        <button id="btn-theme-light" style="width: calc(100% / 3 - 10px); padding: 10px 0; background-color: ${scrollbarColorTheme === 'light' ? '#007bff' : '#e9ecef'}; color: ${scrollbarColorTheme === 'light' ? '#fff' : '#495057'}; border: none; border-radius: 5px; cursor: pointer;" data-theme="light">浅色主题</button>
                        <button id="btn-theme-dark" style="width: calc(100% / 3 - 10px); padding: 10px 0; background-color: ${scrollbarColorTheme === 'dark' ? '#007bff' : '#e9ecef'}; color: ${scrollbarColorTheme === 'dark' ? '#fff' : '#495057'}; border: none; border-radius: 5px; cursor: pointer;" data-theme="dark">深色主题</button>
                        <button id="btn-theme-system" style="width: calc(100% / 3 - 10px); padding: 10px 0; background-color: ${scrollbarColorTheme === 'system' ? '#007bff' : '#e9ecef'}; color: ${scrollbarColorTheme === 'system' ? '#fff' : '#495057'}; border: none; border-radius: 5px; cursor: pointer;" data-theme="system">跟随系统</button>
                    </div>
                </div>
                <div style="background-color: #007bff; color: #fff; text-align: center; font-weight: 700; font-size: 18px; padding: 10px 0; border-radius: 0 0 8px 8px; cursor: pointer;" id="close-settings-popup">关闭</div>
            </div>
        `;
        document.body.appendChild(popup);

        // 设置按钮点击事件
        const buttons = popup.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const width = button.getAttribute('data-width');
                const theme = button.getAttribute('data-theme');
                // 更新设置
                if (width) {
                    // 更新滚动条宽度
                    scrollbarWidth = parseInt(width);
                    // 保存选择的滚动条宽度
                    GM_setValue('scrollbarWidth', scrollbarWidth);
                }
                if (theme) {
                    // 更新滚动条颜色主题
                    scrollbarColorTheme = theme;
                    // 保存选择的滚动条颜色主题
                    GM_setValue('scrollbarColorTheme', scrollbarColorTheme);
                }
                // 应用新的滚动条样式
                applyScrollbarStyle(scrollbarWidth, scrollbarColorTheme);
                // 更新按钮样式以突出显示选中的按钮
                updateButtonStyles();
            });
        });

        // 关闭设置窗口按钮点击事件
        const closeButton = popup.querySelector('#close-settings-popup');
        closeButton.addEventListener('click', () => {
            // 移除设置窗口和背景遮罩
            document.body.removeChild(mask);
            document.body.removeChild(popup);
        });

        // 背景遮罩点击事件
        mask.addEventListener('click', () => {
            // 移除设置窗口和背景遮罩
            document.body.removeChild(mask);
            document.body.removeChild(popup);
        });

        // 更新按钮样式以突出显示选中的按钮
        updateButtonStyles();
    }

    // 更新按钮样式以突出显示选中的按钮
    function updateButtonStyles() {
        // 更新滚动条宽度按钮样式
        updateButtonStyle('btn-width-16', scrollbarWidth === 16);
        updateButtonStyle('btn-width-10', scrollbarWidth === 10);
        updateButtonStyle('btn-width-6', scrollbarWidth === 6);

        // 更新滚动条颜色主题按钮样式
        updateButtonStyle('btn-theme-light', scrollbarColorTheme === 'light');
        updateButtonStyle('btn-theme-dark', scrollbarColorTheme === 'dark');
        updateButtonStyle('btn-theme-system', scrollbarColorTheme === 'system');
    }

    // 更新按钮样式
    function updateButtonStyle(buttonId, isSelected) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.backgroundColor = isSelected ? '#007bff' : '#e9ecef';
            button.style.color = isSelected ? '#fff' : '#495057';
        }
    }

    // 获取滚动条颜色
    function getScrollbarColor(theme) {
        let color;
        if (theme === 'light') {
            color = '#CCC'; // 浅色主题颜色为浅灰色
        } else if (theme === 'dark') {
            color = '#444'; // 深色主题颜色为深灰色
        } else {
            // 跟随系统主题，根据系统主题设置颜色
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            if (systemTheme === 'dark') {
                color = '#444'; // 深色主题颜色为深灰色
            } else {
                color = '#CCC'; // 浅色主题颜色为浅灰色
            }
        }
        return color;
    }
})();



