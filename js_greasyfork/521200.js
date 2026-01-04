// ==UserScript==
// @name         法穿工具箱
// @name:en      Law Tools Box
// @version      1.0.6
// @description  自动填写广东法院诉讼服务网账号密码，支持律师和个人账号登录
// @description:en Null
// @namespace    https://greasyfork.org/zh-CN/users/1412891-lawyer-ray
// @author       Kaisa
// @match        https://ssfw.gdcourts.gov.cn/web/loginA?action=lawyer_login
// @match        https://ssfw.gdcourts.gov.cn/web/loginA
// @match        https://ssfw.gdcourts.gov.cn/web/loginA?action=uc&identification=0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521200/%E6%B3%95%E7%A9%BF%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/521200/%E6%B3%95%E7%A9%BF%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加设置面板的样式
    GM_addStyle(`
        .settings-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .settings-panel input {
            margin: 5px 0;
            padding: 3px;
            width: 200px;
        }
        .settings-panel button {
            margin-top: 5px;
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .settings-panel button:hover {
            background: #45a049;
        }
        .password-container {
            position: relative;
            display: flex;
            align-items: center;
        }
        .toggle-password {
            position: absolute;
            right: 5px;
            cursor: pointer;
            user-select: none;
            color: #666;
        }
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .close-button {
            cursor: pointer;
            color: #666;
            font-size: 18px;
            padding: 5px;
            line-height: 1;
        }
        .close-button:hover {
            color: #333;
        }
        .account-group {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 4px;
        }
        .account-group h5 {
            margin: 0 0 10px 0;
        }
        .switch-button {
            margin-right: 5px;
            padding: 5px 10px;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #switch-account1 {
            background: #2196F3;  /* 蓝色 */
        }
        #switch-account1:hover {
            background: #1976D2;
        }
        #switch-account2 {
            background: #FF9800;  /* 橙色 */
        }
        #switch-account2:hover {
            background: #F57C00;
        }
        #save-settings {
            background: #4CAF50;  /* 绿色 */
            width: 100%;         /* 保存按钮占满宽度 */
            margin-top: 10px;    /* 与上方按钮保持间距 */
        }
        #save-settings:hover {
            background: #45a049;
        }
        .switch-buttons-container {
            display: flex;
            gap: 10px;  /* 两个按钮之间的间距 */
            margin-bottom: 10px;
        }
        .switch-button {
            flex: 1;  /* 让两个切换按钮平分宽度 */
            padding: 8px 0;  /* 调整按钮高度 */
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
        }
        #switch-account1 {
            background: #2196F3;  /* 蓝色 */
        }
        #switch-account1:hover {
            background: #1976D2;
        }
        #switch-account2 {
            background: #FF9800;  /* 橙色 */
        }
        #switch-account2:hover {
            background: #F57C00;
        }
        #save-settings {
            width: 100%;
            padding: 8px 0;  /* 与切换按钮相同的高度 */
            background: #4CAF50;  /* 绿色 */
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
        }
        #save-settings:hover {
            background: #45a049;
        }
    `);

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'settings-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h4 style="margin: 0;">登录信息设置</h4>
                <span class="close-button" title="关闭面板">×</span>
            </div>
            <div class="account-group">
                <h5>账号1</h5>
                <input type="text" id="username1-setting" placeholder="账号1" value="${GM_getValue('username1', '')}">
                <br>
                <div class="password-container">
                    <input type="password" id="password1-setting" placeholder="密码1" value="${GM_getValue('password1', '')}">
                    <span class="toggle-password" title="显示/隐藏密码">👁️</span>
                </div>
            </div>
            <div class="account-group">
                <h5>账号2</h5>
                <input type="text" id="username2-setting" placeholder="账号2" value="${GM_getValue('username2', '')}">
                <br>
                <div class="password-container">
                    <input type="password" id="password2-setting" placeholder="密码2" value="${GM_getValue('password2', '')}">
                    <span class="toggle-password" title="显示/隐藏密码">👁️</span>
                </div>
            </div>
            <div class="switch-buttons-container">
                <button class="switch-button" id="switch-account1">使用账号1</button>
                <button class="switch-button" id="switch-account2">使用账号2</button>
            </div>
            <button id="save-settings">保存设置</button>
        `;
        document.body.appendChild(panel);

        // 关闭按钮事件
        const closeButton = panel.querySelector('.close-button');
        closeButton.addEventListener('click', () => panel.style.display = 'none');

        // 显示/隐藏密码功能
        const toggleButtons = panel.querySelectorAll('.toggle-password');
        toggleButtons.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling;
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
            });
        });

        // 切换账号按钮事件
        document.getElementById('switch-account1').addEventListener('click', function() {
            const username = GM_getValue('username1', '');
            const password = GM_getValue('password1', '');
            fillForm(username, password);
        });

        document.getElementById('switch-account2').addEventListener('click', function() {
            const username = GM_getValue('username2', '');
            const password = GM_getValue('password2', '');
            fillForm(username, password);
        });

        // 保存���置按钮事件
        document.getElementById('save-settings').addEventListener('click', function() {
            const username1 = document.getElementById('username1-setting').value;
            const password1 = document.getElementById('password1-setting').value;
            const username2 = document.getElementById('username2-setting').value;
            const password2 = document.getElementById('password2-setting').value;

            GM_setValue('username1', username1);
            GM_setValue('password1', password1);
            GM_setValue('username2', username2);
            GM_setValue('password2', password2);

            alert('设置已保存！');
        });
    }

    // 触发输入事件
    function triggerInputEvent(element) {
        const events = ['input', 'change', 'blur', 'keyup'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
        });
    }

    // 填充表单函数
    function fillForm(username, password) {
        // 尝试获取律师登录页面的输入框
        let usernameInput = document.evaluate('//*[@id="login_lawyer_name"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let passwordInput = document.evaluate('//*[@id="login_lawyer_psw"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // 如果没有找到律师登录页面的输入框，尝试获取普通登录页面的输入框
        if (!usernameInput || !passwordInput) {
            usernameInput = document.evaluate('//*[@id="login_user_name"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            passwordInput = document.evaluate('//*[@id="psw"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        if (usernameInput && passwordInput) {
            // 先清空输入框的值
            usernameInput.value = '';
            passwordInput.value = '';
            triggerInputEvent(usernameInput);
            triggerInputEvent(passwordInput);

            // 使用 setTimeout 确保清空操作完成后再填充
            setTimeout(() => {
                // 填充用户名
                usernameInput.value = username;
                triggerInputEvent(usernameInput);

                // 填充密码
                passwordInput.value = password;
                triggerInputEvent(passwordInput);

                // 确保密码字段保持type="password"
                passwordInput.setAttribute('type', 'password');
            }, 50);
        }
    }


    // 检测并点击指定元素
    function checkAndClickElement() {
        try {
            const element = document.evaluate('//*[@id="layui-layer1"]/div[3]/a[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                console.log('检测到指定元素，尝试点击...');
                element.click();
                return true;
            }
        } catch (error) {
            console.log('检测元素时出错:', error);
        }
        return false;
    }

    // 主函数
    function main() {
        // 等待一小段时间确保页面元素都加载完成
        setTimeout(() => {
            // 创建设置面板
            createSettingsPanel();

            // 获取保存的账号密码
            const username = GM_getValue('username1', '');
            const password = GM_getValue('password1', '');

            // 如果有保存的账号密码，自动填充
            if (username && password) {
                fillForm(username, password);
            }

            // 尝试检测并点击指定元素
            checkAndClickElement();

            const intervalId = setInterval(() => {
                if (checkAndClickElement()) {
                    clearInterval(intervalId);
                }
            }, 1000);

        }, 500);
    }

    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();