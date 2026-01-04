// ==UserScript==
// @name         Claude Token Login |解决Claude登录后封号问题
// @namespace    https://afdian.com/a/warmo
// @version      1.05
// @description  使用token登录Claude，解决Claude登录后封号问题🐎完美支持Claude官网和Claude镜像服务
// @author       有问题可反馈V：caicats
// @match        https://claude.ai/*
// @match        https://www.atvai.com/*
// @match        https://new.oaifree.com/*
// @match        https://claude.ai/*
// @match        https://claude.asia/*
// @match        https://share.claude.asia/*
// @match        https://pool.claude.asia/*
// @match        https://chatgpt.com/*
// @match        https://www.anthropic.com/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/501149/Claude%20Token%20Login%20%7C%E8%A7%A3%E5%86%B3Claude%E7%99%BB%E5%BD%95%E5%90%8E%E5%B0%81%E5%8F%B7%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/501149/Claude%20Token%20Login%20%7C%E8%A7%A3%E5%86%B3Claude%E7%99%BB%E5%BD%95%E5%90%8E%E5%B0%81%E5%8F%B7%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 新增库按钮
    if (!document.getElementById('paidLibraryButton')) {
        const paidLibraryButton = document.createElement('button');
        paidLibraryButton.id = 'paidLibraryButton';
        paidLibraryButton.innerHTML = 'Go';
        paidLibraryButton.style.position = 'fixed';
        paidLibraryButton.style.top = '135px'; // 位置在换按钮的下面
        paidLibraryButton.style.right = '20px';
        paidLibraryButton.style.width = '39px';
        paidLibraryButton.style.height = '39px';
        paidLibraryButton.style.borderRadius = '50%';
        paidLibraryButton.style.backgroundColor = '#007bff';
        paidLibraryButton.style.color = 'white';
        paidLibraryButton.style.border = 'none';
        paidLibraryButton.style.cursor = 'pointer';
        paidLibraryButton.style.zIndex = '9999';
        paidLibraryButton.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        paidLibraryButton.style.fontSize = '16px';
        paidLibraryButton.style.fontWeight = '500';
        paidLibraryButton.style.textAlign = 'center';
        paidLibraryButton.style.lineHeight = '39px';
        document.body.appendChild(paidLibraryButton);

        paidLibraryButton.addEventListener('click', function () {
            window.location.href = 'https://h5ma.cn/jxn';
        });
    }

    // 预设的token列表
    const tokens = [
        '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',
        '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',
        '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',
        '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',
        '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',
        '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',
        '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',
        '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',
        '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',
        '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',
        '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',
        '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',
        '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',
        // 可以在这里添加更多的token
    ];
    let currentTokenIndex = 0;

    // 创建输入框、按钮和显示区
    var tokenInput = document.createElement('input');
    tokenInput.type = 'text';
    tokenInput.placeholder = '请输入sessionKey';
    tokenInput.style.marginRight = '10px';
    tokenInput.value = tokens[currentTokenIndex]; // 初始显示第一个token

    var saveButton = document.createElement('button');
    saveButton.innerText = '保存并应用';
    saveButton.style.marginRight = '10px';

    var switchButton = document.createElement('button');
    switchButton.innerText = '切换Token';

    var toggleButton = document.createElement('button');
    toggleButton.innerText = '隐藏';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9998';
    toggleButton.style.backgroundColor = 'white';
    toggleButton.style.padding = '5px';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';

    var cookieDisplay = document.createElement('div');
    cookieDisplay.style.marginTop = '10px';
    cookieDisplay.style.wordBreak = 'break-all';

    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'white';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    container.style.display = 'none'; // 初始状态隐藏

    // 组装组件
    container.appendChild(tokenInput);
    container.appendChild(saveButton);
    container.appendChild(switchButton);
    container.appendChild(cookieDisplay);
    document.body.appendChild(container);
    document.body.appendChild(toggleButton);

    // 切换对话框显示/隐藏状态
    toggleButton.addEventListener('click', function() {
        if (container.style.display === 'none') {
            container.style.display = 'block';
            toggleButton.innerText = '隐藏';
        } else {
            container.style.display = 'none';
            toggleButton.innerText = '显示';
        }
    });

     // 保存 token 并刷新页面
    saveButton.addEventListener('click', function() {
        var token = tokenInput.value;
        var cookieValue = 'sessionKey=' + token + '; path=/';
        document.cookie = cookieValue;
        location.reload();
    });

    // 顺序循环切换到下一个token
    switchButton.addEventListener('click', function() {
        // 使用模运算确保索引在有效范围内循环
        currentTokenIndex = (currentTokenIndex + 1) % tokens.length;
        tokenInput.value = tokens[currentTokenIndex];
    });

})();
