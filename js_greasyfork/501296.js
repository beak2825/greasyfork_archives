// ==UserScript==
// @name         claudeSessionKeySwitch
// @version      2.0
// @description  使用sessionKey自动登录claude（带蓝色切换按钮,使用下拉框持久显示当前Token，菜单在SessionKey按钮下方展开）
// @match        https://claude.ai/*
// @match        https://demo.fuclaude.com/*
// @match        https://claude.asia/*
// @grant        none
// @license      GNU GPLv3
// @namespace https://greasyfork.org/users/1337296
// @downloadURL https://update.greasyfork.org/scripts/501296/claudeSessionKeySwitch.user.js
// @updateURL https://update.greasyfork.org/scripts/501296/claudeSessionKeySwitch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tokens = [
        {name: 'default_empty', key: 'sk-ant-sid01xxxx'},
        // 在这里添加其他token add tokens here
    ];

    const createElem = (tag, styles) => {
        const elem = document.createElement(tag);
        Object.assign(elem.style, styles);
        return elem;
    };

    const tokenSelect = createElem('select', {
        fontSize: '14px',
        width: '150px',
        backgroundColor: '#ffffff',
        color: '#000000',
        height: '30px',
        padding: '0 4px',
        lineHeight: '30px',
        border: '1px solid #4a4a4a',
        borderRadius: '3px',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right .5em top 50%',
        backgroundSize: '.65em auto',
        marginBottom: '5px'
    });
    tokens.forEach((token, index) => {
        const option = document.createElement('option');
        option.value = token.key;
        option.text = token.name;
        tokenSelect.appendChild(option);
    });

    const saveButton = createElem('button', {
        fontSize: '14px',
        height: '30px',
        padding: '0 12px',
        lineHeight: '28px',
        border: '1px solid #4a4a4a',
        borderRadius: '3px',
        backgroundColor: '#007bff',
        color: '#ffffff',
        cursor: 'pointer',
        marginRight: '5px'
    });
    saveButton.innerText = '切换';

    const hideButton = createElem('button', {
        fontSize: '14px',
        height: '30px',
        padding: '0 12px',
        lineHeight: '28px',
        border: '1px solid #4a4a4a',
        borderRadius: '3px',
        backgroundColor: '#6c757d',
        color: '#ffffff',
        cursor: 'pointer'
    });
    hideButton.innerText = '收起';

    const toggleButton = createElem('button', {
        fontSize: '14px',
        padding: '5px 10px',
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        position: 'fixed',
        top: '14px',
        right: '115px',
        zIndex: '10000',
        transition: 'background-color 0.3s ease',
    });
    toggleButton.innerText = 'SessionKey切换';

    toggleButton.addEventListener('mouseover', () => {
        toggleButton.style.backgroundColor = 'rgba(0, 123, 255, 1.0)';
    });
    toggleButton.addEventListener('mouseout', () => {
        toggleButton.style.backgroundColor = 'rgba(0, 123, 255, 0.5)';
    });

    const container = createElem('div', {
        position: 'fixed',
        zIndex: '9999',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    });

    const buttonContainer = createElem('div', {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    });

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(hideButton);

    [tokenSelect, buttonContainer].forEach(elem => container.appendChild(elem));
    document.body.appendChild(container);
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
        if (container.style.display === 'none') {
            const buttonRect = toggleButton.getBoundingClientRect();
            container.style.top = `${buttonRect.bottom + window.scrollY+3}px`;
            container.style.left = `${buttonRect.left + window.scrollX}px`;
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    });

    hideButton.addEventListener('click', () => {
        container.style.display = 'none';
    });

    saveButton.addEventListener('click', () => {
        const selectedToken = tokenSelect.value;
        localStorage.setItem('claudeSelectedToken', selectedToken);
        handleTokenSelection(selectedToken);
    });

    tokenSelect.addEventListener('change', () => {
        localStorage.setItem('claudeSelectedToken', tokenSelect.value);
    });

    function handleTokenSelection(token) {
        if (token === '') {
            console.log('Empty token selected. No action taken.');
        } else {
            autoLogin(token);
        }
    }

    function autoLogin(token) {
        const currentURL = window.location.href;
        let loginUrl;

        if (currentURL.startsWith('https://demo.fuclaude.com/')) {
            loginUrl = `https://demo.fuclaude.com/login_token?session_key=${token}`;
        } else if (currentURL.startsWith('https://claude.asia/')) {
            loginUrl = `https://claude.asia/login_token?session_key=${token}`;
        } else {
            loginUrl = `https://demo.fuclaude.com/login_token?session_key=${token}`;
        }

        window.location.href = loginUrl;
    }

    const initializeSelection = () => {
        const storedToken = localStorage.getItem('claudeSelectedToken');
        if (storedToken) {
            tokenSelect.value = storedToken;
        }
    };

    initializeSelection();
})();