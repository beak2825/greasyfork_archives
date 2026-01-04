// ==UserScript==
// @name         BIT-AutoLogin
// @version      1.0
// @description  通过脚本实现BIT网站自动登录，可在任意学校网站页面通过一个总菜单管理所有操作。
// @author       YuhangHere
// @match        *://*.bit.edu.cn/*
// @icon         https://www.bit.edu.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @namespace https://greasyfork.org/users/1489574
// @downloadURL https://update.greasyfork.org/scripts/541020/BIT-AutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/541020/BIT-AutoLogin.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.self !== window.top) {
        return; // 在 iframe 里，直接退出
    } // 实测在 xkjs网站会 match 到3个页面

    // === 常量定义 ===
    const USERNAME_STORAGE_KEY = 'bit_login_username'; // 用于存储学号的键
    const PASSWORD_STORAGE_KEY = 'bit_login_password'; // 用于存储加密后密码的键
    const LOGIN_ATTEMPT_KEY = 'bit_login_attempt'; // 用于在 session 存储中标记登录尝试

    // === 核心功能：加解密与存储 ===

    /**
     * 使用简单的异或算法对文本进行加密或解密
     * @param {string} text - 需要处理的文本
     * @param {string} key - 用于加密/解密的密钥
     * @returns {string} 处理后的文本
     */
    function xorCrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    } // 这是我们的简易加密/解密函数,它足够防止非技术人员（比如通过简单的浏览器工具查看存储内容）直接看到密码
    // 它不是密码学意义上的“强加密”，但对于我们这个场景来说，在便利性和安全性之间取得了很好的平衡。

    /**
     * 将学号和密码保存到油猴脚本的本地存储中
     * @param {string} username - 学号
     * @param {string} password - 原始密码
     */
    function setCredentials(username, password) {
        // 保存学号到本地存储
        GM_setValue(USERNAME_STORAGE_KEY, username);

        // 使用学号生成加密密钥，确保每个用户的密钥不同
        const encryptionKey = 'bit_webvpn_key_' + username;
        try {
            // 加密过程：先异或加密，再进行 Base64 编码
            const encryptedPassword = btoa(xorCrypt(password, encryptionKey));
            // 保存加密后的密码到本地存储
            GM_setValue(PASSWORD_STORAGE_KEY, encryptedPassword);
            console.log('BIT-Login-Script: 凭据已安全保存到本地。');
        } catch (e) {
            console.error('BIT-Login-Script: 密码加密及保存失败。', e);
        }
    }

    /**
     * 清除本地存储的学号和密码
     */
    function clearCredentials() {
        GM_deleteValue(USERNAME_STORAGE_KEY);
        GM_deleteValue(PASSWORD_STORAGE_KEY);
        alert('已清除所有保存的登录凭据！');
    }

    /**
     * 获取本地存储的学号
     * @returns {string | null} 学号或 null
     */
    function getUsername() {
        return GM_getValue(USERNAME_STORAGE_KEY, null);
    }

    /**
     * 获取本地存储并解密后的密码
     * @returns {string | null} 解密后的密码或 null
     */
    function getPassword() {
        const username = getUsername();
        if (!username) {
            // 如果连学号都没有，说明从未设置过，直接返回
            return null;
        }
        // 使用学号生成加密密钥，确保每个用户的密钥不同
        const encryptionKey = 'bit_webvpn_key_' + username;
        const encryptedPassword = GM_getValue(PASSWORD_STORAGE_KEY, null);
        if (!encryptedPassword) {
            return null;
        }
        try {
            // 解密过程：先 Base64 解码，再进行异或解密
            const decryptedPassword = xorCrypt(atob(encryptedPassword), encryptionKey);
            return decryptedPassword;
        } catch (e) {
            console.error('BIT-Login-Script: 密码解密失败，可能是存储内容已损坏。', e);
            // 如果解密失败，清除损坏的数据
            clearCredentials();
            return null;
        }
    }

    // === UI 功能：首次设置引导框 ===
    /**
     * 显示一个用于输入学号和密码的模态框
     */
    function showCredentialPrompt() {
        // 防止重复创建
        if (document.getElementById('gm-login-prompt')) return;

        const currentUsername = getUsername() || '';
        const currentPassword = getPassword() || '';

        const promptHtml = `
            <div id="gm-login-prompt-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9998;"></div>
            <div id="gm-login-prompt" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; width: 320px; font-family: sans-serif;">
                <h3 style="margin-top: 0; margin-bottom: 15px; color: #333;">设置 BIT 登录凭据</h3>
                <p style="font-size: 13px; color: #666; margin-top: 0; margin-bottom: 15px;">您的学号和密码将经过加密后保存在浏览器本地，仅用于自动登录。</p>
                <label for="gm-username" style="display: block; margin-bottom: 5px; font-size: 14px; color: #333;">学号</label>
                <input type="text" id="gm-username" value="${currentUsername}" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 15px;">
                <label for="gm-password" style="display: block; margin-bottom: 5px; font-size: 14px; color: #333;">密码</label>
                <input type="password" id="gm-password" value="${currentPassword}" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 20px;">
                <button id="gm-save-btn" style="width: 100%; padding: 10px; border: none; background-color: #007bff; color: white; border-radius: 4px; cursor: pointer; font-size: 16px;">保存</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', promptHtml);

        // 点击空白区域时关闭提示框
        function closePrompt() {
            document.getElementById('gm-login-prompt-overlay')?.remove();
            document.getElementById('gm-login-prompt')?.remove();
        }
        document.getElementById('gm-login-prompt-overlay').addEventListener('click', closePrompt);

        // 点击保存按钮时
        document.getElementById('gm-save-btn').addEventListener('click', () => {
            const username = document.getElementById('gm-username').value.trim();
            const password = document.getElementById('gm-password').value; // 密码不清空格

            if (username && password) {
                setCredentials(username, password);
                document.getElementById('gm-login-prompt-overlay').remove();
                document.getElementById('gm-login-prompt').remove();
                alert('学号和密码保存成功！');
                // 保存后立即尝试登录
                tryLogin();
            } else {
                alert('学号和密码不能为空！');
            }
        });
    }

    // === UI 功能：自定义的总菜单 ===
    function showCustomMenu() {
        // 防止重复创建
        if (document.getElementById('gm-custom-menu')) return;

        const menuHtml = `
            <div id="gm-custom-menu-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 9998;"></div>
            <div id="gm-custom-menu" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #f9f9f9; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 9999; width: 280px; font-family: sans-serif; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
                <h4 style="margin: 5px 10px 10px; color: #333; text-align: center; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">BIT 自动登录菜单</h4>
                <button id="gm-menu-update" class="gm-menu-btn">⚙️ 修改/设置登录凭据</button>
                <button id="gm-menu-clear" class="gm-menu-btn">🗑️ 清除已存登录凭据</button>
                <button id="gm-menu-show-id" class="gm-menu-btn">🔍 显示已保存的学号</button>
            </div>
        `;
        const styleHtml = `
            <style>
                .gm-menu-btn {
                    width: 100%;
                    padding: 12px;
                    border: none;
                    background-color: #fff;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    text-align: left;
                    color: #222;
                    transition: background-color 0.2s, transform 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .gm-menu-btn:hover {
                    background-color: #f0f0f0;
                    transform: translateY(-1px);
                }
                .gm-menu-btn:active {
                    transform: translateY(0);
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styleHtml);
        document.body.insertAdjacentHTML('beforeend', menuHtml);

        function closeMenu() {
            document.getElementById('gm-custom-menu-overlay')?.remove();
            document.getElementById('gm-custom-menu')?.remove();
        }
        document.getElementById('gm-custom-menu-overlay').addEventListener('click', closeMenu);

        document.getElementById('gm-menu-update').addEventListener('click', () => {
            closeMenu();
            setTimeout(() => {
                showCredentialPrompt();
            }, 100); // 延迟 100 毫秒等菜单关闭动画完成
        });

        document.getElementById('gm-menu-clear').addEventListener('click', () => {
            closeMenu();
            setTimeout(() => {
                clearCredentials();
            }, 100);
        });

        document.getElementById('gm-menu-show-id').addEventListener('click', () => {
            closeMenu();
            const username = getUsername();
            setTimeout(() => {
                alert(username ? `已保存的学号：${username}` : '尚未保存学号。');
            }, 100);
        });
    }

    // === 油猴菜单命令注册 ===
    GM_registerMenuCommand('BIT 自动登录菜单', showCustomMenu);

    // === 登录执行逻辑 ===

    /**
     * 向输入框填值并触发相关事件，模拟用户输入
     * @param {HTMLInputElement | HTMLTextAreaElement} element - 要填充的输入框或文本域元素
     * @param {string} value - 要设置的值
     */
    function fill(element, value) {
        element.value = value;
        element.dispatchEvent(
            new Event('input', {
                bubbles: true,
                cancelable: true,
            })
        );
        element.dispatchEvent(
            new Event('change', {
                bubbles: true,
                cancelable: true,
            })
        );
    }

    /**
     * 检查页面是否存在登录失败的提示信息
     * @returns {boolean} 如果发现用户名或密码错误的提示信息则返回 true，否则返回 false
     */
    function checkForLoginError() {
        const errorElement = document.querySelector('.ant-alert-message');
        if (errorElement && /密码错误/.test(errorElement.textContent)) {
            return true;
        }
        return false;
    }

    /**
     * 尝试执行一次完整的登录流程
     * @returns {boolean} 是否诊断到错误或成功登录
     */
    function tryLogin() {
        // 模式一：诊断模式 - 登录失败可能面临的问题
        if (sessionStorage.getItem(LOGIN_ATTEMPT_KEY) === 'true') {
            console.log('BIT-Login-Script: 进入登录后诊断模式...');
            sessionStorage.removeItem(LOGIN_ATTEMPT_KEY); // 读取记录后立即清除

            const observer = new MutationObserver(() => {
                if (checkForLoginError()) {
                    observer.disconnect();
                    console.warn('BIT-Login-Script: 检测到登录失败，凭据无效。');
                    alert('BIT-AutoLogin检测到登录失败，已保存的学号或密码是错误的。\n将为您清除旧数据并重新设置。');
                    clearCredentials();
                    setTimeout(showCredentialPrompt, 100);
                }
            });
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
            setTimeout(() => observer.disconnect(), 3000);
            return true;
        }

        // 模式二：登录模式
        const username = getUsername();
        const password = getPassword();
        const userInput = document.querySelector('#nameInput');
        const passInput = document.querySelector('input[type="password"]');

        if (!userInput || !passInput) {
            console.error('BIT-Login-Script: 错误！tryLogin被调用，但登录框元素未找到。');
            return false;
        }

        fill(userInput, username);
        fill(passInput, password);

        const loginButton = document.querySelector('#submitBtn');
        if (loginButton && !loginButton.disabled) {
            sessionStorage.setItem(LOGIN_ATTEMPT_KEY, 'true');
            setTimeout(() => loginButton.click(), 100);
            return true;
        }
    }

    // === 主程序入口与页面判断 ===
    // 脚本启动时，先判断是否在目标页面，再决定是否执行登录逻辑
    function isLoginPage() {
        // 使用正则表达式来匹配两个登录页的 URL 格式
        const loginPageRegex = /^https:\/\/(webvpn\.bit\.edu\.cn\/.*?\/cas\/login|sso\.bit\.edu\.cn\/cas\/login)/;
        return loginPageRegex.test(window.location.href);
    }

    function main() {
        if (!getUsername() || !getPassword()) {
            // 无凭据 -> 显示设置引导
            setTimeout(showCredentialPrompt, 1000);
        } else {
            // 有凭据 -> 尝试登录
            if (!tryLogin()) {
                // 如果首次登录失败（比如表单还没加载），启动观察器
                const observer = new MutationObserver(() => {
                    if (tryLogin()) {
                        observer.disconnect();
                    }
                });
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                });
                setTimeout(() => observer.disconnect(), 5000);
            }
        }
    }

    if (isLoginPage()) {
        console.log('BIT-Login-Script: 检测到登录页面，启动自动登录程序。');
        main();
    } else {
        // 在其他页面，脚本静默，只提供菜单功能，清理可能遗留的登录记录，以防万一
        if (sessionStorage.getItem(LOGIN_ATTEMPT_KEY)) {
            sessionStorage.removeItem(LOGIN_ATTEMPT_KEY);
        }
    }
})();
