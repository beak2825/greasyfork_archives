// ==UserScript==
// @name         RawChat 账号池助手
// @namespace    https://www.runningcheese.com
// @version      2.4
// @description  自动登录和切换账号，让你实现 GPT-4 自由。
// @author       RunningCheese,Kai
// @match        https://chat.rawchat.top/*
// @match        https://chat.freegpts.org/*
// @match        https://gpt.github.cn.com/*
// @icon         https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://chat.rawchat.top
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/495454/RawChat%20%E8%B4%A6%E5%8F%B7%E6%B1%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/495454/RawChat%20%E8%B4%A6%E5%8F%B7%E6%B1%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取存储的账号信息
    if (window.location.href.includes('https://chat.rawchat.top/login') || window.location.href.includes('https://chat.freegpts.org/login') || window.location.href.includes('https://gpt.github.cn.com/login')) {
        let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        let currentAccountIndex = parseInt(localStorage.getItem('currentAccountIndex') || '0', 10);
        let isAddAccountFormVisible = false;

        // 检查是否有存储的账号信息，如果没有，提示用户输入
        if (accounts.length === 0) {
            showAddAccountForm();
        } else {
            checkAndAddButtons();
        }

        function fillCredentials(account) {
            const [username, password] = account.split(':');

            // 输入用户名和密码
            document.querySelector('input[name="username"]').value = username;
            document.querySelector('input[name="password"]').value = password;
            document.querySelector('input[name="password"]').dispatchEvent(new Event('input', {
                bubbles: true
            })); // 触发事件确保密码框填入
            document.querySelector('input[name="password"]').dispatchEvent(new Event('change', {
                bubbles: true
            }));

            // 模拟按下Enter键以实现自动登录
            document.querySelector('[class*="_button-login-password"]').dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }));
            showAlert('已自动切换账号，按 Continue 登录！', 5000, '#007bff');
        }

        function switchAccount() {
            currentAccountIndex = Math.floor(Math.random() * accounts.length); // 随机使用账号
            localStorage.setItem('currentAccountIndex', currentAccountIndex);
            fillCredentials(accounts[currentAccountIndex]);
        }

        function addSwitchButton() {
            const button = document.createElement('button');
            button.id = 'switchAccountButton';
            button.innerText = '切换账号';
            button.style.cssText =
                'max-width: 320px;margin-bottom: 10px;padding: 8px 15px;border: none;border-radius: 6px;color: white;cursor: pointer;font-size: 16px;width: 100%;text-align: center;background-color: #28a745;position: fixed;left: 50%;top: 50%;transform: translate(-50%, -50%);';
            button.style.position = 'fixed';
            button.style.top = '100px';
            button.style.right = '40%';
            button.style.zIndex = 1000;
            button.addEventListener('click', handleButtonClick);
            document.body.appendChild(button);
        }

        function addDeleteAccountButton() {
            const button = document.createElement('button');
            button.id = 'deleteAccountButton';
            button.innerText = '删除账号';
            button.style.cssText =
                'max-width: 320px;margin-bottom: 10px;padding: 8px 15px;border: none;border-radius: 6px;color: white;cursor: pointer;font-size: 16px;width: 100%;text-align: center;background-color: #F23822;position: fixed;left: 50%;top: 50%;transform: translate(-50%, -50%);';
            button.style.position = 'fixed';
            button.style.top = '145px';
            button.style.right = '40%';
            button.style.zIndex = 1000;
            button.addEventListener('click', deleteCookiesAndLocalStorage);
            document.body.appendChild(button);
        }

        function showAddAccountForm() {
            if (isAddAccountFormVisible) return;

            const form = document.createElement('div');
            form.id = 'addAccountForm';
            form.style.position = 'fixed';
            form.style.top = '40px';
            form.style.left = '50%';
            form.style.transform = 'translate(-50%, 0)';
            form.style.padding = '20px';
            form.style.zIndex = 1000;
            form.style.display = 'flex';
            form.style.flexDirection = 'column';
            form.style.alignItems = 'center'; // 水平居中

            const accountLabel = document.createElement('label');
            accountLabel.style.marginBottom = '10px'; // 增加下方间距

            const accountInput = document.createElement('input');
            accountInput.type = 'text';
            accountInput.style.cssText =
                'max-width: 320px;margin-bottom: 10px;padding: 8px 15px;border-radius: 6px;cursor: pointer;font-size: 16px;width: 100%;text-align: center;';
            accountInput.placeholder = '请输入账号，或者 URL'; // 设置占位符

            const saveButtonContainer = document.createElement('div');
            saveButtonContainer.style.display = 'flex';
            saveButtonContainer.style.flexDirection = 'column';
            saveButtonContainer.style.alignItems = 'center'; // 水平居中
            saveButtonContainer.style.width = '320px';

            const saveButton = document.createElement('button');
            saveButton.innerText = '保存';
            saveButton.style.cssText =
                'flex: 1; width: 320px;margin-bottom: 10px; padding: 8px 15px; border: none; border-radius: 6px; color: white; cursor: pointer; font-size: 16px; text-align: center; background-color: #F23822;';
            saveButton.addEventListener('click', () => {
                const input = accountInput.value.trim();
                if (!input) {
                    showAlert('请输入账号信息或 URL');
                    return;
                }
                if (input.startsWith('http://') || input.startsWith('https://')) {
                    fetchAccountsFromUrl(input);
                } else {
                    addMultipleAccounts(input);
                    localStorage.setItem('accounts', JSON.stringify(accounts));
                    document.body.removeChild(form);
                    isAddAccountFormVisible = false;
                    showAlert('添加成功');
                    checkAndAddButtons();
                }
            });

            const fetchButton = document.createElement('button');
            fetchButton.innerText = '一键获取';
            fetchButton.style.cssText =
                'flex: 1; width: 320px;margin-bottom: 10px; padding: 8px 15px; border: none; border-radius: 6px; color: white; cursor: pointer; font-size: 16px; text-align: center; background-color: #007bff;';
            fetchButton.addEventListener('click', () => {
                accountInput.value =
                    `https://jsd.onmicrosoft.cn/gh/runningcheese/RunningCheese-Firefox/Restore/chatgpt/21.txt`;
                fetchAccountsFromUrl(accountInput.value);
            });

            saveButtonContainer.appendChild(saveButton);
            saveButtonContainer.appendChild(fetchButton);

            form.appendChild(accountLabel);
            form.appendChild(accountInput);
            form.appendChild(saveButtonContainer);
            document.body.appendChild(form);

            isAddAccountFormVisible = true;
        }

        function toggleAddAccountForm() {
            const form = document.getElementById('addAccountForm');
            if (form) {
                document.body.removeChild(form);
                isAddAccountFormVisible = false;
            } else {
                showAddAccountForm();
            }
        }

        function fetchAccountsFromUrl(url) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    if (response.status === 200) {
                        const newAccounts = response.responseText.trim().split('\n').filter(line =>
                            line.includes(':'));
                        addMultipleAccounts(newAccounts.join(' '));
                        localStorage.setItem('accounts', JSON.stringify(accounts));
                        showAlert('从URL添加成功');
                        location.reload(); // 添加成功后刷新页面
                    } else {
                        showAlert('无法从URL获取账号信息');
                    }
                },
                onerror: function () {
                    showAlert('请求URL时出错');
                }
            });
        }

        function addMultipleAccounts(newAccounts) {
            const accountArray = newAccounts.split(' ').filter(account => account.includes(':'));
            accountArray.forEach(account => {
                if (!accounts.includes(account)) {
                    accounts.push(account);
                }
            });
        }

        function handleButtonClick() {
            const currentURL = window.location.href;
            if (currentURL.includes('https://chat.rawchat.top/login') || currentURL.includes('https://chat.freegpts.org/login') || currentURL.includes('https://gpt.github.cn.com/login')) {
                if (accounts.length === 0) {
                    showAlert('请先添加账号');
                } else {
                    switchAccount();
                }
            } else if (currentURL === 'https://chat.rawchat.top/' || currentURL === 'https://chat.freegpts.org/' || currentURL === 'https://gpt.github.cn.com/') {
                currentAccountIndex = Math.floor(Math.random() * accounts.length); // 随机使用账号
                localStorage.setItem('currentAccountIndex', currentAccountIndex);
                window.open(`${currentURL}login`, '_blank');
            }
        }

        function deleteCookiesAndLocalStorage() {
            // 清除所有 cookies
            const cookies = document.cookie.split("; ");
            for (let c = 0; c < cookies.length; c++) {
                const d = window.location.hostname.split(".");
                while (d.length > 0) {
                    const cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
                        '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=.' + d.join('.') + ' ;path=';
                    const p = location.pathname.split('/');
                    document.cookie = cookieBase + '/';
                    while (p.length > 0) {
                        document.cookie = cookieBase + p.join('/');
                        p.pop();
                    };
                    d.shift();
                }
            }

            // 清除 localStorage
            localStorage.clear();

            showAlert('已删除所有帐号和 Cookies！');
            location.reload(); // 刷新页面以应用更改
        }

        function showAlert(message, duration = 1500, bgColor = '#F23822') {
            const alert = document.createElement('div');
            alert.innerText = message;
            alert.style.cssText =
                `position: fixed; top: 20px; left: 50%; width:320px; transform: translateX(-50%); background-color: ${bgColor}; color: white; padding: 10px 20px; border-radius: 5px; z-index: 9000; font-size: 16px;text-align: center;`;
            document.body.appendChild(alert);
            setTimeout(() => {
                document.body.removeChild(alert);
            }, duration);
        }

        function checkAndAddButtons() {
            if (!document.getElementById('switchAccountButton')) {
                addSwitchButton();
            }
            if (!document.getElementById('deleteAccountButton')) {
                addDeleteAccountButton();
            }
        }

        window.addEventListener('load', () => {
            const currentURL = window.location.href;
            if (currentURL.includes('https://chat.rawchat.top/login') || currentURL.includes('https://chat.freegpts.org/login') || currentURL.includes('https://gpt.github.cn.com/login')) {
                if (accounts.length > 0) {
                    // 切换账号并填入凭据
                    switchAccount();
                }
            }
            if (accounts.length > 0) {
                checkAndAddButtons();
            }
        });
    }
})();

(function () {
'use strict';
if (
    (window.location.href.includes('https://chat.rawchat.top/') && !window.location.href.includes('https://chat.rawchat.top/login') && !window.location.href.includes('https://chat.rawchat.top/v') && !window.location.href.includes('https://chat.rawchat.top/fc')) ||
    (window.location.href.includes('https://chat.freegpts.org/') && !window.location.href.includes('https://chat.freegpts.org/login') && !window.location.href.includes('https://chat.freegpts.org/v') && !window.location.href.includes('https://chat.freegpts.org/fc')) ||
    (window.location.href.includes('https://gpt.github.cn.com/') && !window.location.href.includes('https://gpt.github.cn.com/login') && !window.location.href.includes('https://gpt.github.cn.com/v') && !window.location.href.includes('https://gpt.github.cn.com/fc'))
) {
    function createButton() {
        if (!document.getElementById('newButton')) {
        const button = document.createElement('button');
        button.id = 'newButton';
        button.innerHTML = 'New';
        button.style.position = 'fixed';
        button.style.top = '50px';
        button.style.right = '1px';
        button.style.width = '40px'; // Adjusted width
        button.style.height = '34px'; // Adjusted height
        button.style.borderTopLeftRadius = '34px'; // Adjusted border radius
        button.style.borderBottomLeftRadius = '34px'; // Adjusted border radius
        button.style.backgroundColor = '#007bff'; // Gradient background
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.zIndex = '99999';
        button.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        button.style.fontSize = '12px';
        button.style.fontWeight = '600';
        button.style.textAlign = 'center';
        button.style.lineHeight = '34px'; // Adjusted line height
        document.body.appendChild(button);

        button.addEventListener('click', function () {
            getAccessToken();
        });
    }
}

    function createSwitchButton() {
    if (!document.getElementById('switchButton')) {
        const switchButton = document.createElement('button');
        switchButton.id = 'switchButton';
        switchButton.innerHTML = '换';
        switchButton.style.position = 'fixed';
        switchButton.style.top = '96px'; // Adjusted top position
        switchButton.style.right = '1px';
        switchButton.style.width = '40px'; // Adjusted width
        switchButton.style.height = '34px'; // Adjusted height
        switchButton.style.borderTopLeftRadius = '34px'; // Adjusted border radius
        switchButton.style.borderBottomLeftRadius = '34px'; // Adjusted border radius
        switchButton.style.backgroundColor = '#28a745'; // Gradient background
        switchButton.style.color = 'white';
        switchButton.style.border = 'none';
        switchButton.style.cursor = 'pointer';
        switchButton.style.zIndex = '99999';
        switchButton.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        switchButton.style.fontSize = '15px';
        switchButton.style.fontWeight = '600';
        switchButton.style.textAlign = 'center';
        switchButton.style.lineHeight = '34px'; // Adjusted line height
        document.body.appendChild(switchButton);

        switchButton.addEventListener('click', function () {
            deleteCookiesAndGoToLogin();
        });
    }
   }


    function getAccessToken() {
        fetch(`${window.location.origin}/api/auth/session`, {
            method: "GET",
            credentials: 'include' // 使用 include 以确保发送 Cookie
        })
        .then(response => response.json())
        .then(jsonResponse => {
            if (jsonResponse.accessToken) {
                let accessToken = jsonResponse.accessToken;
                console.log("AccessToken: " + accessToken);

                // 检测是否为移动设备
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                // 复制 accessToken 到剪贴板
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(accessToken).then(() => {
                        if (confirm(`已复制 AccessToken 到剪贴板！\n是否要打开 https://new.oaifree.com ?\n打开后，按 Ctlr+V 粘贴。`)) {
                            window.open("https://new.oaifree.com/", '_blank');
                        }
                    }).catch(err => {
                        // 移动设备上的错误处理
                        if (isMobile) {
                            showManualCopyPrompt(accessToken);
                        } else {
                            alert("复制到剪贴板失败，请手动复制以下 AccessToken:");
                            prompt("无法自动复制，请手动复制以下 AccessToken:", accessToken);
                        }
                    });
                } else {
                    // Clipboard API 不支持，提示用户手动复制
                    showManualCopyPrompt(accessToken);
                }
            } else {
                console.log("AccessToken not found in the response.");
            }
        })
        .catch(error => {
            console.log("Error fetching the session API: " + error);
        });
    }

    function showManualCopyPrompt(accessToken) {
        const promptDiv = document.createElement('div');
        promptDiv.innerHTML = `
            <div style="position: fixed; top: 10%; left: 50%; transform: translateX(-50%); background-color: white; border: 1px solid #ccc; padding: 10px; z-index: 1000;">
                <p>无法自动复制，请手动复制以下 AccessToken:</p>
                <textarea style="width: 100%; height: 50px;">${accessToken}</textarea>
                <button id="copyButton">复制</button>
            </div>
        `;
        document.body.appendChild(promptDiv);

        document.getElementById('copyButton').addEventListener('click', () => {
            const textarea = promptDiv.querySelector('textarea');
            textarea.select();
            document.execCommand('copy');
            alert("已复制 AccessToken 到剪贴板！");
            document.body.removeChild(promptDiv);
            if (confirm(`是否要打开 https://new.oaifree.com ?\n打开后，手动粘贴 AccessToken。`)) {
                window.location.href = "https://new.oaifree.com/";
            }
        });
    }

    function deleteCookiesAndGoToLogin() {
        // 清除所有 cookies
        const cookies = document.cookie.split("; ");
        for (let c = 0; c < cookies.length; c++) {
            const d = window.location.hostname.split(".");
            while (d.length > 0) {
                const cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
                    '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=.' + d.join('.') + ' ;path=';
                const p = location.pathname.split('/');
                document.cookie = cookieBase + '/';
                while (p.length > 0) {
                    document.cookie = cookieBase + p.join('/');
                    p.pop();
                };
                d.shift();
            }
        }
        window.location.href = `${window.location.origin}/login`; // 跳转到登录页面
    }

    window.addEventListener('DOMContentLoaded', () => {
    createButton();
    createSwitchButton();
});

}})();
