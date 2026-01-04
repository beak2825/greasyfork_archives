// ==UserScript==
// @name         AutoFill
// @name:zh      自动填表
// @name:en      AutoFill
// @namespace    https://github.com/mixterjim
// @version      1.1
// @author       MixterJim
// @description  自动填写表单数据的Tampermonkey脚本
// @description:en Tampermonkey Script for Autofilling Form Data
// @homepage     https://greasyfork.org/scripts/472933-autofill
// @supportURL   https://gist.github.com/mixterjim/894de1234bce1b3a2eb6a60b9ddd23a5
// @match        */*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/472933/AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/472933/AutoFill.meta.js
// ==/UserScript==

(function() {
    // 引入按钮组件样式
    const modalStyle = `
        /* 设置界面容器 */
        .settings-modal {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          zIndex: 9999;
          width: 400px;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          position: fixed;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .settings-modal:hover {
          /* 鼠标悬停时的样式 */
          opacity: 1;
        }

        /* 标签样式 */
        .settings-label {
          font-weight: bold;
          margin-bottom: 10px;
          display: block;
        }

        /* 输入框样式 */
        .settings-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f8f8f8;
          color: #333;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

        .settings-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
        }

        /* 按钮Div */
        .settings-buttons {
          display: flex;
        }

        /* 按钮样式 */
        .settings-button {
          flex: 1;
          padding: 8px 16px; /* 调整按钮的内边距 */
          margin-top: 10px;
          border: none;
          border-radius: 4px;
          color: #fff;
          background-color: #007bff;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-size: 14px;  /* 调整按钮的字体大小 */
        }

        .settings-button:not(:last-child) {
          margin-right: 20px;
        }

        .settings-button:hover {
          background-color: #0056b3;
        }

        .settings-button:active {
          background-color: #004f9d;
        }

        /* 关闭按钮样式 */
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 6px;
          border: none;
          background-color: transparent;
          color: #333;
          font-size: 18px;
          cursor: pointer;
        }

        .close-button:hover {
          color: #007bff;
        }
    `;

    // 创建设置按钮
    function createSettingsButton() {
        const button = document.createElement('button');
        button.innerText = 'AutoFill';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.opacity = 0.8;
        button.style.color = 'gray';
        button.style.textShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
        button.addEventListener('click', openSettingsModal);
        return button;
    }

    // 创建设置模态框
    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'settings-modal';
        modal.style.zIndex = '9999'; // 解决部分网站会遮挡的问题

        const createElement = (tagName, className, text, eventListener) => {
            const element = document.createElement(tagName);
            if (className) element.className = className;
            if (text) element.innerText = text;
            if (eventListener) element.addEventListener('click', eventListener);
            return element;
        };

        const inputLabel = createElement('label', 'settings-label', '表单数据：');
        const closeButton = createElement('button', 'close-button', 'x', closeSettingsModal);
        const inputField = createElement('input', 'settings-input');
        const buttons = createElement('div', 'settings-buttons');
        const saveButton = createElement('button', 'settings-button', '保存', saveFormData);
        const fillButton = createElement('button', 'settings-button', '恢复', fillForm);
        const clearButton = createElement('button', 'settings-button', '清空', clearFormData);

        modal.appendChild(inputLabel);
        modal.appendChild(closeButton);
        modal.appendChild(inputField);
        modal.appendChild(buttons);
        buttons.appendChild(saveButton);
        buttons.appendChild(fillButton);
        buttons.appendChild(clearButton);

        // 引入样式
        const styleElement = document.createElement('style');
        styleElement.textContent = modalStyle;
        document.head.appendChild(styleElement);

        return modal;
    }

    // 打开设置模态框
    function openSettingsModal() {
        const formData = getFormData();
        const modal = createSettingsModal();
        const inputField = modal.querySelector('input');

        inputField.value = formData;

        // Check if the modal is already open
        if (!document.querySelector('.settings-modal')) {
            document.body.appendChild(modal);
        }
    }

    // 关闭设置模态框
    function closeSettingsModal() {
        const modal = document.querySelector('.settings-modal');
        if (modal) {
            modal.remove();
        }
    }

    // 保存表单数据到本地存储
    function saveFormData() {
        const inputField = document.querySelector('.settings-modal input');
        const formData = inputField.value;

        // 保存表单数据到本地存储
        localStorage.setItem('formData', formData);
        console.log(formData);
        closeSettingsModal();
    }

    // 清空表单数据
    function clearFormData() {
        // 清空本地存储中的表单数据
        localStorage.removeItem('formData');

        // 清空表单中的值
        const formFields = document.querySelectorAll('input, textarea, select');
        formFields.forEach(function(field) {
            field.value = '';
        });

        closeSettingsModal();
    }

    // 获取表单数据
    function getFormData() {
        const formFields = document.querySelectorAll('input, textarea, select');
        const formData = {};
        const form = document.querySelector('form');

        formFields.forEach(function(field) {
            formData[field.name] = field.value;
        });

        return JSON.stringify(formData);
    }

    // 设置表单数据
    function setFormData(formData) {
        try {
            const parsedData = JSON.parse(formData);
            const formFields = document.querySelectorAll('input, textarea, select');

            formFields.forEach(function(field) {
                if (field.name in parsedData) {
                    field.value = parsedData[field.name];
                }
            });
        } catch (error) {
            console.error('无法解析表单数据:', error);
        }
    }

    // 自动填充表单数据
    function fillForm() {
        // 检查本地存储中是否存在已保存的表单数据
        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
            setFormData(savedFormData);
        }
        closeSettingsModal();
    }

    // 在页面完全加载后执行
    window.addEventListener('load', function() {
        // 添加设置按钮
        const settingsButton = createSettingsButton();
        document.body.appendChild(settingsButton);

        // 自动填充表单数据
        setTimeout(fillForm, 1000); // 延迟填充数据，防止表单未完全载入
    });
})();