// ==UserScript==
// @name         河南城建学院校园网自动登录v0.2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  带配置界面的校园网自动登录
// @author       z
// @match        https://netauth.huuc.edu.cn/a79.htm
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507477/%E6%B2%B3%E5%8D%97%E5%9F%8E%E5%BB%BA%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95v02.user.js
// @updateURL https://update.greasyfork.org/scripts/507477/%E6%B2%B3%E5%8D%97%E5%9F%8E%E5%BB%BA%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95v02.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置存储键名
    const CONFIG_KEYS = {
        ACCOUNT: 'user_account',
        PASSWORD: 'user_password',
        ISP: 'user_isp'
    };

    // 创建配置界面
    function createConfigPanel() {
        const panel = document.createElement('div');
        panel.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
        `;

        panel.innerHTML = `
            <div>
            <h3 style="margin:0 0 15px 0;text-align:center">使用配置
            <span id="tm-close" style="
            position: absolute;
            right: 15px;
            top: 10px;
            cursor: pointer;
            font-size: 18px;
            color: #666;
            ">×</span>
            </h3>
            <div style="margin-bottom:10px">
                <label>学号：</label>
                <input type="text" id="tm-account" style=
                "padding:5px;
                 width: 150px;
                 height: 25px">
            </div>
            <div style="margin-bottom:10px">
                <label>密码：</label>
                <input type="password" id="tm-password" style=
                "padding:5px;
                 width: 150px;
                 height: 25px"">
            </div>
            <div style="padding:5px 0">
                <label>运营商：</label>
                <select id="tm-isp" style=
                "width: 90px;
                 height: 30px">
                    <option value="1">中国移动</option>
                    <option value="2">中国联通</option>
                </select>
            </div>
            <div style="display: flex; justify-content: center;">
            <button id="tm-save" style="
            padding:6px 15px;
            background:#007bff;
            color:white;
            border:none;
            border-radius:4px;
            margin: 15px auto 0;
            cursor: pointer;
            box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 30px 0 rgba(0,0,0,0.19); 
            background: linear-gradient(
                to right, #8e7cc3, #6fa8dc
            );
            ">保存配置</button>
            </div>
            </div>
        `;

        document.body.appendChild(panel);
        document.getElementById('tm-close').addEventListener('click', () => {
            panel.remove(); // 直接移除整个配置面板
        });
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent === '重新配置') btn.remove();
            });
        createReconfigButton(); // 保存后立即刷新按钮
        // 保存配置事件
        document.getElementById('tm-save').addEventListener('click', () => {
            const account = document.getElementById('tm-account').value.trim();
            const password = document.getElementById('tm-password').value.trim();
            const isp = document.getElementById('tm-isp').value;

            if (!account || !password) {
                alert('账号密码不能为空！');
                return;
            }

            GM_setValue(CONFIG_KEYS.ACCOUNT, account);
            GM_setValue(CONFIG_KEYS.PASSWORD, password);
            GM_setValue(CONFIG_KEYS.ISP, isp);
            
            panel.remove();
            startLoginProcess();
        });
    }
    // 重新配置按钮
    function createReconfigButton() {
    const btn = document.createElement('button');
    btn.textContent = '重新配置';
    btn.style = `
        position: fixed;
        font-size:20px;
        right: 20px;
        top: 10px;
        padding: 6px 15px;
        background: white;
        color: red;
        border: none;
        box-shadow: rgba(149, 157, 165,0.2) 0px 8px 24px;
        border-radius: 4px;
        cursor: pointer;
        z-index: 9999;
    `;
    btn.onclick = createConfigPanel; // 直接复用配置窗口创建函数
    document.body.appendChild(btn);
    }
    // 主登录流程
    async function startLoginProcess() {
        const account = GM_getValue(CONFIG_KEYS.ACCOUNT);
        const password = GM_getValue(CONFIG_KEYS.PASSWORD);
        const ispIndex = GM_getValue(CONFIG_KEYS.ISP) || '2';

        
        if (!account || !password) {
            createConfigPanel();
            return;
        }

        // 原有登录逻辑
        const selectors = {
            account: '#edit_body > div:nth-child(3) > div.tijiao.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(3)',
            password: '#edit_body > div:nth-child(3) > div.tijiao.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(4)',
            isp: '#edit_body > div:nth-child(3) > div.tijiao.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > select',
            loginBtn: '#edit_body > div:nth-child(3) > div.tijiao.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(1)'
        };

        try {
            document.querySelector(selectors.account).value = account;
            document.querySelector(selectors.password).value = password;
            document.querySelector(selectors.isp).selectedIndex = ispIndex;
            document.querySelector(selectors.loginBtn).click();
            
            // 登录状态检查
            setTimeout(() => {
                if (document.querySelector(buttonOfBack).value === "返  回") {
                    alert("登录失败，请检查账号密码！");
                }
            }, 1000);
        } catch (error) {
            console.error('自动登录失败:', error);
        }
    }

    // 初始化
    if (location.href === 'https://netauth.huuc.edu.cn/a79.htm') {
    // 已有配置时显示重新配置按钮
        if (GM_getValue(CONFIG_KEYS.ACCOUNT)) {
        createReconfigButton();
        }
    setTimeout(startLoginProcess, 300);
    }
})();