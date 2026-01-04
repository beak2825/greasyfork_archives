// ==UserScript==
// @name         网页背景修改
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  本脚本可以自定义背景颜色，类需要从F12中观看，教程为下图，本脚本面对GPT编写，任何bug和修改请找GPT
// @author       You
// @license MIT
// @include      *
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/500937/%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/500937/%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认设置
    let settings = JSON.parse(localStorage.getItem('backgroundChangerSettings')) || {};

    // 当前网站的设置
    let currentSite = window.location.hostname;
    if (!settings[currentSite]) {
        settings[currentSite] = {
            classes: [],
            backgroundColor: 'white'
        };
    }

    function saveSettings() {
        localStorage.setItem('backgroundChangerSettings', JSON.stringify(settings));
    }

    function changeBackgroundColor() {
        let siteSettings = settings[currentSite];
        siteSettings.classes.forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(function(element) {
                element.style.setProperty('background', siteSettings.backgroundColor, 'important');
            });
        });
    }

    // 添加设置菜单
    GM_registerMenuCommand("设置背景颜色", showSettingsDialog);
    GM_registerMenuCommand("清除所有网站设置", clearAllSettings);

    // 显示设置对话框
    function showSettingsDialog() {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.border = '1px solid black';
        dialog.style.padding = '20px';
        dialog.style.zIndex = '1001';
        dialog.style.width = '80%';
        dialog.style.maxWidth = '400px';

        const classInput = document.createElement('input');
        classInput.type = 'text';
        classInput.value = settings[currentSite].classes.join(', ');
        classInput.placeholder = '输入类名英文逗号","分隔';
        classInput.style.width = '100%';
        classInput.style.marginBottom = '10px';
        dialog.appendChild(classInput);

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = settings[currentSite].backgroundColor;
        colorInput.style.width = '100%';
        colorInput.style.marginBottom = '10px';
        dialog.appendChild(colorInput);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';

        const saveButton = document.createElement('button');
        saveButton.innerText = '保存';
        saveButton.addEventListener('click', () => {
            settings[currentSite].classes = classInput.value.split(',').map(cls => cls.trim()).filter(cls => cls);
            settings[currentSite].backgroundColor = colorInput.value;
            saveSettings();
            changeBackgroundColor();
            document.body.removeChild(dialog);
        });
        buttonContainer.appendChild(saveButton);

        const cancelButton = document.createElement('button');
        cancelButton.innerText = '取消';
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        buttonContainer.appendChild(cancelButton);

        dialog.appendChild(buttonContainer);
        document.body.appendChild(dialog);
    }

    // 清除所有网站设置
    function clearAllSettings() {
        if (confirm("确定要清除所有网站的设置吗？此操作不可逆！")) {
            if (confirm("请再次确认，确定要清除所有网站的设置吗？")) {
                localStorage.removeItem('backgroundChangerSettings');
                settings = {};
                alert("所有网站的设置已清除，页面将自动刷新！");
                location.reload(); // 自动刷新页面
            }
        }
    }

    // Initial change on load
    window.addEventListener('load', changeBackgroundColor);

    // Use MutationObserver to listen for changes in the DOM
    const observer = new MutationObserver(changeBackgroundColor);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

    // Add throttled event listeners for specific events that may change the DOM
    document.addEventListener('click', function() {
        setTimeout(changeBackgroundColor, 100); // Delay to allow changes to take effect
    }, true);

    document.addEventListener('input', function() {
        setTimeout(changeBackgroundColor, 100); // Delay to allow changes to take effect
    }, true);
})();
