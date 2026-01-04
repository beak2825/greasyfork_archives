// ==UserScript==
// @name         fuclaude SessionKey Switch
// @version      3.0
// @description  使用sessionKey自动登录demo.fuclaude.com
// @match        https://demo.fuclaude.com/*
// @grant        none
// @license      GNU GPLv3
// @namespace https://greasyfork.org/users/1369183
// @downloadURL https://update.greasyfork.org/scripts/508879/fuclaude%20SessionKey%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/508879/fuclaude%20SessionKey%20Switch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置对象，存储token列表和本地存储键名
    let CONFIG = {
        tokens: [
            // 预设的token列表，每个token包含名称和密钥
            {name: 'Token 1', key: ''},
        ],
        storageKey: 'fuclaude_SelectedToken', // 用于存储选中token的本地存储键名
        configStorageKey: 'fuclaude_Config' // 用于存储整个配置的本地存储键名
    };

    // 创建HTML元素的通用函数
    const createElement = (tag, styles, attributes = {}) => {
        const elem = document.createElement(tag);
        Object.assign(elem.style, styles);
        Object.entries(attributes).forEach(([key, value]) => elem.setAttribute(key, value));
        return elem;
    };

    // 创建下拉选择框的函数
    const createSelect = (options, styles) => {
        const select = createElement('select', styles);
        options.forEach(({name, key}) => {
            const option = createElement('option', {}, {value: key});
            option.textContent = name;
            select.appendChild(option);
        });
        return select;
    };

    // 创建按钮的函数
    const createButton = (text, primaryColor, hoverColor) => {
        const button = createElement('button', {
            fontSize: '14px',
            padding: '10px 15px',
            backgroundColor: primaryColor,
            color: '#333333',
            border: '1px solid #d0d0d0',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            margin: '0 5px'
        }, {
            onmouseover: `this.style.backgroundColor='${hoverColor}'`,
            onmouseout: `this.style.backgroundColor='${primaryColor}'`
        });
        button.textContent = text;
        return button;
    };

    // 创建主UI的函数
    const createUI = () => {
        // 创建token选择下拉框
        const tokenSelect = createSelect(CONFIG.tokens, {
            fontSize: '14px',
            width: '100%',
            backgroundColor: '#ffffff',
            color: '#333333',
            height: '40px',
            padding: '0 10px',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px top 50%',
            backgroundSize: '12px auto',
            marginBottom: '10px',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        });

        // 创建保存和配置按钮
        const saveButton = createButton('切换', '#f0f0f0', '#e0e0e0');
        const configButton = createButton('配置', '#f0f0f0', '#e0e0e0');

        // 创建切换按钮
        const toggleButton = createElement('button', {
            fontSize: '14px',
            padding: '10px 15px',
            backgroundColor: '#f0f0f0',
            color: '#333333',
            border: '1px solid #d0d0d0',
            borderRadius: '5px',
            cursor: 'pointer',
            position: 'fixed',
            top: '20px',
            right: '300px',
            zIndex: '10000',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }, {
            onmouseover: "this.style.backgroundColor='#e0e0e0'",
            onmouseout: "this.style.backgroundColor='#f0f0f0'"
        });
        toggleButton.textContent = 'SessionKey切换';

        // 创建主容器
        const container = createElement('div', {
            position: 'fixed',
            zIndex: '9999',
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            width: '300px'
        });

        // 创建按钮容器
        const buttonContainer = createElement('div', {
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
        });

        // 组装UI元素
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(configButton);

        container.appendChild(tokenSelect);
        container.appendChild(buttonContainer);

        return { tokenSelect, saveButton, configButton, toggleButton, container };
    };

    // 创建配置UI的函数
    const createConfigUI = () => {
        // 创建配置容器
        const configContainer = createElement('div', {
            position: 'fixed',
            zIndex: '10001',
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            width: '400px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        });

        // 创建token列表
        const tokenList = createElement('ul', {
            listStyleType: 'none',
            padding: '0',
            width: '100%'
        });

        // 为每个token创建列表项
        CONFIG.tokens.forEach((token, index) => {
            const listItem = createElement('li', {
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center'
            });
            const nameInput = createElement('input', {
                width: '30%',
                marginRight: '10px'
            }, { type: 'text', value: token.name });
            const keyInput = createElement('input', {
                width: '50%',
                marginRight: '10px'
            }, { type: 'text', value: token.key });
            const deleteButton = createButton('删除', '#f0f0f0', '#e0e0e0');
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.fontSize = '12px';

            listItem.appendChild(nameInput);
            listItem.appendChild(keyInput);
            listItem.appendChild(deleteButton);
            tokenList.appendChild(listItem);
        });

        // 创建添加和保存按钮
        const addButton = createButton('添加Token', '#f0f0f0', '#e0e0e0');
        const saveConfigButton = createButton('保存配置', '#f0f0f0', '#e0e0e0');

        // 组装配置UI
        configContainer.appendChild(tokenList);
        configContainer.appendChild(addButton);
        configContainer.appendChild(saveConfigButton);

        return { configContainer, addButton, saveConfigButton, tokenList };
    };

    // 处理token选择的函数
    const handleTokenSelection = (token) => {
        if (token === '') {
            console.log('Empty token selected. No action taken.');
        } else {
            autoLogin(token);
        }
    };

    // 自动登录函数
    const autoLogin = (token) => {
        const loginUrl = `https://demo.fuclaude.com/login_token?session_key=${token}`;
        window.location.href = loginUrl;
    };

    // 保存配置到本地存储的函数
    const saveConfig = () => {
        localStorage.setItem(CONFIG.configStorageKey, JSON.stringify(CONFIG));
    };

    // 从本地存储加载配置的函数
    const loadConfig = () => {
        const savedConfig = localStorage.getItem(CONFIG.configStorageKey);
        if (savedConfig) {
            Object.assign(CONFIG, JSON.parse(savedConfig));
        }
    };

    // 设置事件监听器的函数
    const setupEventListeners = (ui) => {
        // 切换按钮点击事件
        ui.toggleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (ui.container.style.display === 'none') {
                const buttonRect = ui.toggleButton.getBoundingClientRect();
                ui.container.style.top = `${buttonRect.bottom + window.scrollY + 10}px`;
                ui.container.style.left = `${buttonRect.left + window.scrollX}px`;
                ui.container.style.display = 'flex';
            } else {
                ui.container.style.display = 'none';
            }
        });

        // 保存按钮点击事件
        ui.saveButton.addEventListener('click', () => {
            const selectedToken = ui.tokenSelect.value;
            localStorage.setItem(CONFIG.storageKey, selectedToken);
            handleTokenSelection(selectedToken);
        });

        // token选择变化事件
        ui.tokenSelect.addEventListener('change', () => {
            localStorage.setItem(CONFIG.storageKey, ui.tokenSelect.value);
        });

        // 创建配置UI
        const configUI = createConfigUI();
        document.body.appendChild(configUI.configContainer);

        // 配置按钮点击事件
        ui.configButton.addEventListener('click', () => {
            configUI.configContainer.style.display = 'flex';
        });

        // 添加token按钮点击事件
        configUI.addButton.addEventListener('click', () => {
            const newToken = { name: 'New Token', key: '' };
            CONFIG.tokens.push(newToken);
            updateConfigUI(configUI);
        });

        // 保存配置按钮点击事件
        configUI.saveConfigButton.addEventListener('click', () => {
            updateConfigFromUI(configUI);
            saveConfig();
            updateMainUI(ui);
            configUI.configContainer.style.display = 'none';
        });

        // 删除token的处理函数
        const handleDeleteToken = (index) => {
            CONFIG.tokens.splice(index, 1);
            updateConfigUI(configUI);
        };

        // token列表点击事件（用于删除）
        configUI.tokenList.addEventListener('click', (event) => {
            if (event.target.textContent === '删除') {
                const listItem = event.target.closest('li');
                const index = Array.from(configUI.tokenList.children).indexOf(listItem);
                handleDeleteToken(index);
            }
        });

        // 点击其他位置时收起菜单
        document.addEventListener('click', (event) => {
            if (!ui.container.contains(event.target) && event.target !== ui.toggleButton) {
                ui.container.style.display = 'none';
            }
            if (!configUI.configContainer.contains(event.target)) {
                configUI.configContainer.style.display = 'none';
            }
        });

        // 阻止点击菜单内部时关闭菜单
        ui.container.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        configUI.configContainer.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    };

// 更新配置UI的函数
    const updateConfigUI = (configUI) => {
        configUI.tokenList.innerHTML = '';
        CONFIG.tokens.forEach((token, index) => {
            const listItem = createElement('li', {
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center'
            });
            // 创建名称输入框
            const nameInput = createElement('input', {
                width: '30%',
                marginRight: '10px'
            }, { type: 'text', value: token.name });
            // 创建密钥输入框
            const keyInput = createElement('input', {
                width: '50%',
                marginRight: '10px'
            }, { type: 'text', value: token.key });
            // 创建删除按钮
            const deleteButton = createButton('删除', '#f0f0f0', '#e0e0e0');
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.fontSize = '12px';

            // 将元素添加到列表项中
            listItem.appendChild(nameInput);
            listItem.appendChild(keyInput);
            listItem.appendChild(deleteButton);
            configUI.tokenList.appendChild(listItem);
        });
    };

    // 从UI更新配置的函数
    const updateConfigFromUI = (configUI) => {
        const tokenInputs = configUI.tokenList.querySelectorAll('li');
        CONFIG.tokens = Array.from(tokenInputs).map(li => ({
            name: li.querySelector('input[type="text"]:nth-child(1)').value,
            key: li.querySelector('input[type="text"]:nth-child(2)').value
        }));
    };

    // 更新主UI的函数
    const updateMainUI = (ui) => {
        ui.tokenSelect.innerHTML = '';
        CONFIG.tokens.forEach(token => {
            const option = createElement('option', {}, { value: token.key });
            option.textContent = token.name;
            ui.tokenSelect.appendChild(option);
        });
    };

    // 初始化函数
    const init = () => {
        // 从本地存储加载配置
        loadConfig();
        // 创建主UI
        const ui = createUI();
        // 将UI添加到页面
        document.body.appendChild(ui.container);
        document.body.appendChild(ui.toggleButton);

        // 设置事件监听器
        setupEventListeners(ui);

        // 从本地存储中读取之前选择的token
        const storedToken = localStorage.getItem(CONFIG.storageKey);
        if (storedToken) {
            ui.tokenSelect.value = storedToken;
        }
    };

    // 执行初始化
    init();
})();