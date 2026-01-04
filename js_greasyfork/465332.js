// ==UserScript==
// @name 一键显示密码
// @namespace https://greasyfork.org
// @version 1.2
// @description 在页面上添加一个显示密码按钮
// @author Eqin
// @match :///*
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-idle
// @license Proprietary
// @downloadURL https://update.greasyfork.org/scripts/465332/%E4%B8%80%E9%94%AE%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/465332/%E4%B8%80%E9%94%AE%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = createToggleButton('显密');
    document.body.appendChild(button);

    const panel = createSettingsPanel(button);
    document.body.appendChild(panel);

    button.addEventListener('click', () => toggleSettingsPanel(panel));

    GM_addStyle(`
        .button-collapse {
            position: fixed;
            z-index: 1001;
            font-size: 16px;
            line-height: 20px;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            border: none;
            background-color: #4CAF50;
            color: #FFFFFF;
            box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
        }

        .button-collapse:hover {
            background-color: #3e8e41;
        }
    `);

    const collapse = document.createElement('div');
    collapse.innerHTML = '&#x25B4;';
    collapse.className = 'button-collapse';
    document.body.appendChild(collapse);

    collapse.addEventListener('click', () => managePassowrds());

    function createToggleButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.zIndex = 1001;
        button.style.fontSize = '16px';
        button.style.lineHeight = '20px';
        button.style.padding = '10px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.border = 'none';
        button.style.backgroundColor = GM_getValue('buttonBackgroundColor', '#4CAF50');
        button.style.color = GM_getValue('buttonTextColor', '#FFFFFF');
        button.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)';
        setButtonPosition(1, button);
        return button;
    }

    function setButtonPosition(position, button) {
        switch (position) {
            case 1:
                button.style.top = '10px';
                button.style.right = '10px';
                button.style.bottom = 'auto';
                button.style.left = 'auto';
                break;
            case 2:
                button.style.top = 'auto';
                button.style.right = 'auto';
                button.style.bottom = '10px';
                button.style.left = '10px';
                break;
            case 3:
                button.style.top = 'auto';
                button.style.right = '10px';
                button.style.bottom = '10px';
                button.style.left = 'auto';
                break;
        }
    }

    function createSettingsPanel(button) {
        const panel = document.createElement('div');
        panel.style.display = 'none';
        panel.style.padding = '10px';
        panel.style.backgroundColor = '#fff';
        panel.style.border = '1px solid #ccc';
        panel.style.position = 'fixed';
        panel.style.zIndex = 1002;

        const settings = [
            {
                label: '背景颜色',
                type: 'color',
                value: () => GM_getValue('buttonBackgroundColor', '#4CAF50'),
                onChange: (value) => {
                    button.style.backgroundColor = value;
                    GM_setValue('buttonBackgroundColor', value);
                },
            },
            {
                label: '文字颜色',
                type: 'color',
                value: () => GM_getValue('buttonTextColor', '#FFFFFF'),
                onChange: (value) => {
                    button.style.color = value;
                    GM_setValue('buttonTextColor', value);
                },
            },
            {
                label: '边框样式',
                type: 'text',
                value: () => GM_getValue('buttonBorder', 'none'),
                onChange: (value) => {
                    button.style.border = value;
                    GM_setValue('buttonBorder', value);
                },
            },
        ];

        settings.forEach(setting => {
            const label = document.createElement('label');
            label.textContent = setting.label;
            label.style.display = 'block';
            label.style.marginBottom = '5px';

            const input = document.createElement('input');
            input.type = setting.type;
            input.value = setting.value();
            input.addEventListener('change', () => setting.onChange(input.value));
            label.appendChild(input);

            panel.appendChild(label);
        });

        return panel;
    }

    function toggleSettingsPanel(panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        panel.style.top = `${button.offsetTop}px`;
        panel.style.left = `${button.offsetLeft}px`;
    }

    function managePassowrds() {
        const passwordInputs = document.querySelectorAll('input[type=password]');
        let passwords = [];
        for (const input of passwordInputs) {
            passwords.push(input.value);
        }
        const passwordsString = passwords.join('\n');
        navigator.clipboard.writeText(passwordsString).then(() => {
            alert('密码已复制到剪贴板');
        }, () => {
            alert('复制密码失败，请手动复制');
        });
    }

    // 添加显示密码菜单选项
    GM_registerMenuCommand('显示密码', function() {
        const passwordInputs = document.querySelectorAll('input[type=password]');
        for (const input of passwordInputs) {
            if(input.type === 'password') {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        }
    });
})();
