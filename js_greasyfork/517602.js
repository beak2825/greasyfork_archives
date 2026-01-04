// ==UserScript==
// @name        河南师范大学（HTU）校园网自动登录
// @namespace   https://github.com/wlunan/HtuAutoLogin
// @match       http://10.101.2.194:6060/*
// @version     2.1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @author      lunan
// @icon        data:image/jpeg;base64,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
// @description 提示信息修改
// @downloadURL https://update.greasyfork.org/scripts/517602/%E6%B2%B3%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%EF%BC%88HTU%EF%BC%89%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/517602/%E6%B2%B3%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%EF%BC%88HTU%EF%BC%89%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

$(document).ready(function() {
    let username = GM_getValue("username", "");
    let password = GM_getValue("password", "");
    let loginTimer = null;

    var passwordPlaceholder = password ? '*'.repeat(Math.min(password.length, 12)) : '';

    var formHtml = `
    <div id="loginForm" style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 30px;
        border-radius: 12px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        width: 380px;
        font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
        backdrop-filter: blur(5px);
    ">
        <div style="
            background: linear-gradient(90deg, #1e88e5 0%, #1565c0 100%);
            margin: -30px -30px 20px -30px;
            padding: 20px;
            border-radius: 12px 12px 0 0;
            color: white;
            text-align: center;
        ">
            <h3 style="margin: 0; font-weight: 600; letter-spacing: 1px;">河南师范大学校园网登录</h3>
            <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">HTU Campus Network Auto Login</div>
        </div>

        <div style="margin-bottom: 20px; padding: 12px; background: #e3f2fd; border-radius: 8px; font-size: 13px; color: #0d47a1; line-height: 1.5;">
            <strong>登录提示：</strong><br>
            • 账号为学号/工号<br>
            • 初始密码为Myhtu+身份证12-17位<br>
            • 首次使用需保存凭证，下次自动登录<br>
            • 如需修改凭证，请先清除已保存信息
        </div>

        <div style="margin-bottom: 15px;">
            <label for="usernameInput" style="display: block; margin-bottom: 5px; font-weight: 600; color: #37474f;">账号</label>
            <input type="text" id="usernameInput" value="${username}" placeholder="请输入学号/工号" autocomplete="no" style="
                width: 100%;
                padding: 12px 15px;
                border: 1px solid #cfd8dc;
                border-radius: 6px;
                font-size: 15px;
                background: white;
                transition: all 0.3s;
                box-sizing: border-box;
            " onfocus="this.style.borderColor='#1e88e5'; this.style.boxShadow='0 0 0 2px rgba(30,136,229,0.2)';" onblur="this.style.borderColor='#cfd8dc'; this.style.boxShadow='none';">
        </div>

        <div style="margin-bottom: 20px; position: relative;">
            <label for="passwordInput" style="display: block; margin-bottom: 5px; font-weight: 600; color: #37474f;">密码</label>
            <div style="position: relative;">
                <input type="password" id="passwordInput" value="${password}" placeholder="${passwordPlaceholder || '请输入密码'}" autocomplete="no" style="
                    width: 100%;
                    padding: 12px 45px 12px 15px;
                    border: 1px solid #cfd8dc;
                    border-radius: 6px;
                    font-size: 15px;
                    background: white;
                    transition: all 0.3s;
                    box-sizing: border-box;
                " onfocus="this.style.borderColor='#1e88e5'; this.style.boxShadow='0 0 0 2px rgba(30,136,229,0.2)';" onblur="this.style.borderColor='#cfd8dc'; this.style.boxShadow='none';">
                <button id="togglePassword" type="button" style="
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #e0e0e0;
                    border: none;
                    border-radius: 4px;
                    padding: 6px 10px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #555;
                    font-weight: 600;
                " onmouseover="this.style.background='#d5d5d5';" onmouseout="this.style.background='#e0e0e0';">显示</button>
            </div>
            ${password ? '<div style="font-size:12px; color:#f57c00; margin-top:4px;">当前显示密码占位符，如需修改请输入新密码</div>' : ''}
        </div>

        <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button id="saveCredentials" style="
                flex: 1;
                background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
                color: white;
                border: none;
                border-radius: 6px;
                padding: 12px 20px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 6px rgba(30,136,229,0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(30,136,229,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(30,136,229,0.3)';">
                ${username ? '更新凭证' : '保存并登录'}
            </button>

            <button id="stop" style="
                flex: 1;
                background: linear-gradient(135deg, #f44336 0%, #c62828 100%);
                color: white;
                border: none;
                border-radius: 6px;
                padding: 12px 20px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 6px rgba(244,67,54,0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(244,67,54,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(244,67,54,0.3)';">
                清除凭证
            </button>
        </div>

        <div id="statusMessage" style="margin-top: 15px; font-size: 13px; text-align: center; height: 20px; color: #757575;"></div>

        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #757575;">
            <div style="margin-bottom: 8px; font-weight: 600; color: #555;">作者信息</div>
            <div>
                <a href="https://github.com/wlunan/HtuAutoLogin" target="_blank" style="color: #1e88e5; text-decoration: none; margin: 0 8px;">GitHub: wlunan</a>
                <span style="color: #999;">|</span>
                <a href="https://www.htu.edu.cn/" target="_blank" style="color: #1e88e5; text-decoration: none; margin: 0 8px;">学校官网</a>
            </div>
            <div style="margin-top: 6px; color: #999;">版本 v2.1 | 简洁化</div>
        </div>
    </div>
    `;

    $('body').append(formHtml);

    // 添加增强样式
    $('<style>').text(`
        #loginForm { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -45%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        #loginForm input[type="text"]:hover, #loginForm input[type="password"]:hover {
            border-color: #90caf9;
        }
        #loginForm button:active {
            transform: translateY(1px) !important;
        }
        #loginForm a:hover {
            text-decoration: underline !important;
            color: #1565c0 !important;
        }
    `).appendTo('head');

    // 状态消息显示函数
    function showStatus(message, isError = false) {
        const statusEl = $('#statusMessage');
        statusEl.text(message).css('color', isError ? '#d32f2f' : '#388e3c');
        setTimeout(() => statusEl.text('').css('color', '#757575'), 3000);
    }

    // 密码显示/隐藏切换功能
    $('#togglePassword').click(function() {
        const passwordInput = $('#passwordInput');
        const currentType = passwordInput.attr('type');
        const newType = currentType === 'password' ? 'text' : 'password';

        passwordInput.attr('type', newType);
        $(this).text(newType === 'password' ? '显示' : '隐藏');
        $(this).css('background', newType === 'password' ? '#e0e0e0' : '#1e88e5');
        $(this).css('color', newType === 'password' ? '#555' : 'white');

        const val = passwordInput.val();
        passwordInput.val('');
        passwordInput.val(val);
    });

    // 清除按钮事件
    $('#stop').click(function() {
        GM_deleteValue("username");
        GM_deleteValue("password");
        username = "";
        password = "";

        if (loginTimer) {
            clearTimeout(loginTimer);
            loginTimer = null;
        }

        $('#usernameInput').val('');
        $('#passwordInput').val('');
        $('#passwordInput').attr('placeholder', '请输入密码');
        $('#togglePassword').text('显示').css('background', '#e0e0e0').css('color', '#555');

        showStatus('凭证已清除，自动登录已取消');
        console.log('已清除保存的凭证');
    });

    // 保存/更新凭证事件
    $('#saveCredentials').click(function() {
        const inputUsername = $('#usernameInput').val().trim();
        const inputPassword = $('#passwordInput').val();

        if (!inputUsername) {
            showStatus('请输入有效的用户名！', true);
            return;
        }

        const newPassword = inputPassword || password;

        if (!newPassword) {
            showStatus('请输入有效的密码！', true);
            return;
        }

        GM_setValue("username", inputUsername);
        GM_setValue("password", newPassword);

        showStatus('凭证已保存，正在登录...');
        console.log('保存的账号: ', inputUsername);

        username = inputUsername;
        password = newPassword;

        setTimeout(() => loginCampusNetwork(username, password), 1000);
    });

    // 如果已有凭证，自动执行登录
    if (username && password) {
        showStatus('检测到已保存凭证，1秒后自动登录...');
        loginTimer = setTimeout(() => loginCampusNetwork(username, password), 1000);
    }
});

// 登录校园网 - 简洁版：点击登录后不显示提示，等待自动重定向
function loginCampusNetwork(username, password) {
    if (document.title.includes('河南师范大学校园网登录')) {
        console.log('正在尝试自动登录...');

        setTimeout(function() {
            $("input[name='userName']").val(username);
            $("input[name='password']").val(password);

            const loginButton = $("#checkButton");
            if (loginButton.length) {
                loginButton.click();
                console.log('登录按钮已点击，等待自动重定向...');
                // 不显示任何提示，让页面自然跳转

            } else {
                console.error('未找到登录按钮');
                $('form').submit();
            }
        }, 1500);
    } else {
        console.log('当前页面不是登录页面，跳过自动登录');
    }
}
