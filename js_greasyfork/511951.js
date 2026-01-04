// ==UserScript==
// @name         随机密码生成器
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  在页面中添加一个随机密码生成器，可以生成密码并记录历史记录，提供显示/隐藏功能和拖动按钮功能。
// @author       wll
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/511951/%E9%9A%8F%E6%9C%BA%E5%AF%86%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/511951/%E9%9A%8F%E6%9C%BA%E5%AF%86%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

/*
### 脚本特点及好处：
- **在页面中添加一个随机密码生成器**：生成器可以生成复杂的随机密码。
- **记录历史记录**：生成的密码会记录在历史记录中，并可以删除特定记录。
- **提供显示/隐藏功能**：通过油猴菜单命令控制生成器打开按钮的显示或隐藏状态。
- **拖动按钮功能**：生成器打开按钮可以拖动，并记录其拖动后的位置信息，防止拖动出页面之外。
*/

(function() {
    'use strict';

    const settingsKey = 'passwordGeneratorSettings';
    const historyKey = 'passwordGeneratorHistory';
    const positionKey = 'buttonPosition';
    const buttonVisibleKey = 'buttonVisible';

    // 读取设置
    function loadSettings() {
        const settings = GM_getValue(settingsKey, null);
        return settings ? JSON.parse(settings) : {
            upper: false,
            lower: false,
            numbers: false,
            special: false,
            minLength: 8,
            maxLength: 12,
            quantity: 1
        };
    }

    // 保存设置
    function saveSettings(settings) {
        GM_setValue(settingsKey, JSON.stringify(settings));
    }

    // 读取历史记录
    function loadHistory() {
        const history = GM_getValue(historyKey, null);
        return history ? JSON.parse(history) : [];
    }

    // 保存历史记录
    function saveHistory(history) {
        GM_setValue(historyKey, JSON.stringify(history));
    }

    // 读取按钮位置
    function loadPosition() {
        return GM_getValue(positionKey, { top: '10px', right: '10px' });
    }

    // 保存按钮位置
    function savePosition(position) {
        GM_setValue(positionKey, position);
    }

    // 读取按钮可见状态
    function loadButtonVisible() {
        return GM_getValue(buttonVisibleKey, true);
    }

    // 保存按钮可见状态
    function saveButtonVisible(visible) {
        GM_setValue(buttonVisibleKey, visible);
    }

    const settings = loadSettings();
    const history = loadHistory();
    let buttonVisible = loadButtonVisible();

    // 创建按钮打开密码生成器
    const button = document.createElement('button');
    button.innerText = '打开密码生成器';
    button.style.position = 'fixed';
    button.style.zIndex = '1000';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    const savedPosition = loadPosition();
    button.style.top = savedPosition.top;
    button.style.right = savedPosition.right;

    if (buttonVisible) {
        document.body.appendChild(button);
    }

    // 注册油猴菜单命令
    GM_registerMenuCommand('显示/隐藏菜单按钮', () => {
        buttonVisible = !buttonVisible;
        if (buttonVisible) {
            document.body.appendChild(button);
        } else {
            if (button.parentNode) {
                button.parentNode.removeChild(button);
            }
        }
        saveButtonVisible(buttonVisible);
    });

    // 创建生成器界面
    const generatorDiv = document.createElement('div');
    generatorDiv.style.display = 'none';
    generatorDiv.style.position = 'fixed';
    generatorDiv.style.top = '50%';
    generatorDiv.style.left = '50%';
    generatorDiv.style.transform = 'translate(-50%, -50%)';
    generatorDiv.style.padding = '20px';
    generatorDiv.style.backgroundColor = 'white';
    generatorDiv.style.border = '1px solid #ccc';
    generatorDiv.style.zIndex = '1000';
    generatorDiv.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
    generatorDiv.style.textAlign = 'center';
    generatorDiv.style.width = '300px';
    generatorDiv.style.maxHeight = '400px';
    generatorDiv.style.overflow = 'auto';
    document.body.appendChild(generatorDiv);

    // 添加选项
    generatorDiv.innerHTML = `
        <div style="position: relative;">
            <h2>随机密码生成器</h2>
            <button id="close" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 16px; cursor: pointer;">✖</button>
        </div>
        <div style="text-align: left; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
            <h3>选项</h3>
            <label><input type="checkbox" id="upper"> 字母大写</label><br>
            <label><input type="checkbox" id="lower"> 字母小写</label><br>
            <label><input type="checkbox" id="numbers"> 数字</label><br>
            <label><input type="checkbox" id="special"> 特殊字符</label><br>
            <label>生成长度：<input type="number" id="minLength" value="${settings.minLength}" min="1" style="width: 50px;"> 到 <input type="number" id="maxLength" value="${settings.maxLength}" min="1" style="width: 50px;"></label><br>
            <label>生成数量：<input type="number" id="quantity" value="${settings.quantity}" min="1" style="width: 50px;"></label><br>
            <button id="generate" style="margin-top: 10px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">生成密码</button><br>
        </div>
        <div style="text-align: left; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-top: 10px;">
            <h3>生成的密码</h3>
            <div id="passwordOutput" style="width: 100%; margin-top: 10px;"></div>
        </div>
        <div style="text-align: left; margin-top: 10px;">
            <h3>历史记录</h3>
            <div id="historyOutput" style="width: 100%; margin-top: 10px; max-height: 100px; overflow-y: auto;"></div>
        </div>
    `;

    // 提示框
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
    toast.style.color = 'white';
    toast.style.padding = '10px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1001';
    toast.style.display = 'none';
    document.body.appendChild(toast);

    // 显示提示
    function showToast(message) {
        toast.innerText = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    // 生成密码
    function generatePassword() {
        const upper = document.getElementById('upper').checked;
        const lower = document.getElementById('lower').checked;
        const numbers = document.getElementById('numbers').checked;
        const special = document.getElementById('special').checked;
        const minLength = parseInt(document.getElementById('minLength').value);
        const maxLength = parseInt(document.getElementById('maxLength').value);
        const quantity = parseInt(document.getElementById('quantity').value);

        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

        let allChars = '';
        if (upper) allChars += upperChars;
        if (lower) allChars += lowerChars;
        if (numbers) allChars += numberChars;
        if (special) allChars += specialChars;

        if (allChars === '') {
            showToast('请至少选择一种复杂度类型！');
            return [];
        }

        const passwords = [];
        for (let j = 0; j < quantity; j++) {
            const passwordLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
            let password = '';
            for (let i = 0; i < passwordLength; i++) {
                password += allChars.charAt(Math.floor(Math.random() * allChars.length));
            }
            passwords.push(password);
        }
        return passwords;
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('密码已复制到剪贴板！');
    }

    // 更新UI
    function updateOutput(passwords) {
        const output = document.getElementById('passwordOutput');
        output.innerHTML = passwords.map((pwd, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${pwd}</span>
                <button class="copy" data-password="${pwd}" style="background: none; border: none; color: blue; cursor: pointer;">复制</button>
            </div>
        `).join('');
    }

    function updateHistoryOutput() {
        const output = document.getElementById('historyOutput');
        output.innerHTML = history.map((pwd, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${pwd}</span>
                <button class="delete" data-index="${index}" style="background: none; border: none; color: red; cursor: pointer;">删除</button>
            </div>
        `).join('');
    }

    // 点击事件
    button.addEventListener('click', () => {
        generatorDiv.style.display = generatorDiv.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('close').addEventListener('click', () => {
        generatorDiv.style.display = 'none';
    });

    document.getElementById('generate').addEventListener('click', () => {
        const passwords = generatePassword();
        updateOutput(passwords);

        // 保存设置
        const settings = {
            upper: document.getElementById('upper').checked,
            lower: document.getElementById('lower').checked,
            numbers: document.getElementById('numbers').checked,
            special: document.getElementById('special').checked,
            minLength: parseInt(document.getElementById('minLength').value),
            maxLength: parseInt(document.getElementById('maxLength').value),
            quantity: parseInt(document.getElementById('quantity').value)
        };
        saveSettings(settings);
    });

    document.getElementById('passwordOutput').addEventListener('click', (e) => {
        if (e.target.classList.contains('copy')) {
            const password = e.target.getAttribute('data-password');
            copyToClipboard(password);
            history.push(password);
            saveHistory(history);
            updateHistoryOutput();
        }
    });

    document.getElementById('historyOutput').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            history.splice(index, 1);
            saveHistory(history);
            updateHistoryOutput();
        }
    });

    // 使按钮可拖动
    button.addEventListener('mousedown', (e) => {
        e.preventDefault();
        let offsetX = e.clientX - button.getBoundingClientRect().left;
        let offsetY = e.clientY - button.getBoundingClientRect().top;

        function mouseMoveHandler(e) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            let maxX = window.innerWidth - button.offsetWidth;
            let maxY = window.innerHeight - button.offsetHeight;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            button.style.left = `${newX}px`;
            button.style.top = `${newY}px`;
            button.style.right = 'auto';
        }

        function mouseUpHandler() {
            savePosition({ top: button.style.top, left: button.style.left });
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });

    // 初始化
    document.getElementById('upper').checked = settings.upper;
    document.getElementById('lower').checked = settings.lower;
    document.getElementById('numbers').checked = settings.numbers;
    document.getElementById('special').checked = settings.special;
    document.getElementById('minLength').value = settings.minLength;
    document.getElementById('maxLength').value = settings.maxLength;
    document.getElementById('quantity').value = settings.quantity;
    updateHistoryOutput();

})();
