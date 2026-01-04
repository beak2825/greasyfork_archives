// ==UserScript==
// @name         GPT账号批量管理助手-国内GPT3.5/GPT4账号池系统
// @namespace    https://afdian.com/a/warmo
// @version      1.04
// @description  🦄️🦄️批量化添加自己的账号后，通过账号池系统切换解决免费用户3小时使用10次使用GPT4o限制，让GPT4o在国内使用和突破限制问题。
// @author       @有事可联系V：caicats
// @match        https://chat.rawchat.cc/login/**
// @match        https://chat.gptdsb.com/login/**
// @match        https://chat.gptdsb.com/**
// @match        https://chat.rawchat.cc/**
// @match        https://chat.gptdsb.com/login/**
// @match        https://chat.gptdsb.com/**
// @match        https://chat.freegpts.org/**
// @match        https://gpt.github.cn.com/**
// @match        https://chat.openai.com/**
// @match        https://chatgpt.com/**
// @match        https://new.oaifree.com/**
// @match        https://shared.oaifree.com/**
// @icon         https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://chat.rawchat.cc
// @grant        none
// @homepageURL  https://afdian.net/a/warmo
// @supportURL   https://afdian.net/a/warmo
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498589/GPT%E8%B4%A6%E5%8F%B7%E6%89%B9%E9%87%8F%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B-%E5%9B%BD%E5%86%85GPT35GPT4%E8%B4%A6%E5%8F%B7%E6%B1%A0%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/498589/GPT%E8%B4%A6%E5%8F%B7%E6%89%B9%E9%87%8F%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B-%E5%9B%BD%E5%86%85GPT35GPT4%E8%B4%A6%E5%8F%B7%E6%B1%A0%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [
        {username: 'dr_jj217@hotmail.com', password: 'Clipshow7!'},
        {username: 'pham7515@yahoo.com', password: 'Carman123!'},
        {username: 'leovalle70@gmail.com', password: 'Pb24885147!'},
        {username: 'jennifer.norman75@yahoo.com', password: 'Jen033630$'},
        {username: 'nsingleton093@gmail.com', password: 'Jalinnick1.'}
        
    ];
 
    // 获取当前账号索引
    let currentAccountIndex = parseInt(localStorage.getItem('currentAccountIndex') || '0', 10);
 
    function fillCredentials(account) {
        // 输入用户名和密码
        document.querySelector('input[name="username"]').value = account.username;
        document.querySelector('input[name="password"]').value = account.password;
        document.querySelector('input[name="password"]').dispatchEvent(new Event('input', { bubbles: true })); // 触发事件确保密码框填入
 
        // 模拟按下Enter键以实现自动登录
        document.querySelector('input[name="password"]').dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
    }
 
    function switchAccount() {
        currentAccountIndex++;
        if (currentAccountIndex >= accounts.length) {
            currentAccountIndex = 0; // 循环使用账号
        }
        localStorage.setItem('currentAccountIndex', currentAccountIndex);
        fillCredentials(accounts[currentAccountIndex]);
    }
 
    function addSwitchButton() {
        const button = document.createElement('button');
        button.innerText = '切换账号';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.addEventListener('click', handleButtonClick);
        document.body.appendChild(button);
    }
 
    function addAccountButton() {
        const button = document.createElement('button');
        button.innerText = '添加账号';
        button.style.position = 'fixed';
        button.style.top = '50px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.addEventListener('click', showAddAccountForm);
        document.body.appendChild(button);
    }
 
    function showAddAccountForm() {
        const form = document.createElement('div');
        form.style.position = 'fixed';
        form.style.top = '100px';
        form.style.right = '10px';
        form.style.padding = '20px';
        form.style.backgroundColor = 'white';
        form.style.border = '1px solid black';
        form.style.zIndex = 1000;
 
        const usernameLabel = document.createElement('label');
        usernameLabel.innerText = '账号: ';
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
 
        const passwordLabel = document.createElement('label');
        passwordLabel.innerText = '密码: ';
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
 
        const saveButton = document.createElement('button');
        saveButton.innerText = '保存';
        saveButton.addEventListener('click', () => {
            const newAccount = {
                username: usernameInput.value,
                password: passwordInput.value
            };
            accounts.push(newAccount);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            document.body.removeChild(form);
        });
 
        form.appendChild(usernameLabel);
        form.appendChild(usernameInput);
        form.appendChild(document.createElement('br'));
        form.appendChild(passwordLabel);
        form.appendChild(passwordInput);
        form.appendChild(document.createElement('br'));
        form.appendChild(saveButton);
        document.body.appendChild(form);
    }
 
    function handleButtonClick() {
        const currentURL = window.location.href;
        if (currentURL.includes('https://chat.rawchat.cc/login')) {
            switchAccount();
        } else if (currentURL === 'https://chat.rawchat.cc/') {
            currentAccountIndex++;
            if (currentAccountIndex >= accounts.length) {
                currentAccountIndex = 0; // 循环使用账号
            }
            localStorage.setItem('currentAccountIndex', currentAccountIndex);
            window.open('https://chat.rawchat.cc/login', '_blank');
        }
    }
 
    function addLibraryButton() {
        const button = document.createElement('button');
        button.innerText = '付费版系统';
        button.style.position = 'fixed';
        button.style.top = '90px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.style.backgroundColor = 'red';
        button.style.color = 'white';
        button.addEventListener('click', () => {
            window.location.href = 'https://afdian.com/a/warmo';
        });
        document.body.appendChild(button);
    }
 
    function addGuideButton() {
        const button = document.createElement('button');
        button.innerText = '使用指南';
        button.style.position = 'fixed';
        button.style.top = '130px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.style.backgroundColor = 'blue';
        button.style.color = 'white';
        button.addEventListener('click', () => {
            window.location.href = 'https://sourl.cn/Ms57c4';
        });
        document.body.appendChild(button);
    }
 
    window.addEventListener('load', () => {
        const currentURL = window.location.href;
        if (currentURL.includes('https://chat.rawchat.cc/login')) {
            fillCredentials(accounts[currentAccountIndex]);
        }
        addSwitchButton();
        addAccountButton();
        addLibraryButton();
        addGuideButton();
    });
})();