// ==UserScript==
// @name         Pikpak验证码获取工具[AAA]
// @namespace    https://home.bilivo.top/
// @version      1.3
// @license      MIT
// @description  配合纸鸢油猴子脚本，获取注册 pikpak 时的验证码。20241012更新：由于微软邮箱新机制，短效邮箱的登录需要搭配Oauth2协议，所以新加了 oauth2 取件接口。2025更新：将显/隐按钮替换为设置图标，并美化 alert 弹窗。
// @author       AAA
// @icon         https://image.211678.top/file/AgACAgUAAyEGAASIgfLNAAMEZt1G7t_dD1e01O-7w-xW3MQGbUcAAqvEMRtEPPBWNntf0QmNWM4BAAMCAAN4AAM2BA
// @match        *://mypikpak.com/*
// @match        *://pikpak.me/*
// @match        *://mypikpak.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512318/Pikpak%E9%AA%8C%E8%AF%81%E7%A0%81%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7%5BAAA%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/512318/Pikpak%E9%AA%8C%E8%AF%81%E7%A0%81%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7%5BAAA%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        @import url('https://unpkg.com/element-ui/lib/theme-chalk/index.css');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        #toggleButton {
            position: fixed;
            top: 7%;
            right: 20px;
            z-index: 9999;
            background-color: #409EFF;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            line-height: 20px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #toggleButton::before {
            content: '\\f013';
            font-family: 'Font Awesome 5 Free';
            font-weight: 900;
            font-size: 20px;
        }
        #formContainer {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9998;
            background: white;
            padding: 20px;
            box-shadow: 0px 0px 15px rgba(0,0,0,0.1);
            border-radius: 10px;
            width: 300px;
            display: none;
        }
        #modeSwitch { display: flex; justify-content: space-around; margin-bottom: 20px; }
        #pop3Section, #oauth2Section { display: none; }
        #oauthCode { height: 130px; line-height: 20px; }
        .el-form-item { margin-bottom: 20px; }
        .el-button { width: 100%; padding: 10px 0; }
        /* 自定义弹窗样式 */
        #customAlert {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
        }
        #customAlert .alert-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 300px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.15);
            text-align: center;
        }
        #customAlert .alert-message {
            margin-bottom: 20px;
            font-size: 14px;
            color: #606266;
            word-wrap: break-word;
        }
        #customAlert .alert-button {
            background-color: #409EFF;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        #customAlert .alert-button:hover {
            background-color: #66b1ff;
        }
    `);

    // 创建自定义弹窗
    const alertContainer = document.createElement('div');
    alertContainer.id = 'customAlert';
    alertContainer.innerHTML = `
        <div class="alert-box">
            <div class="alert-message"></div>
            <button class="alert-button">确定</button>
        </div>
    `;
    document.body.appendChild(alertContainer);

    // 自定义 alert 函数
    function customAlert(message) {
        const alertBox = document.getElementById('customAlert');
        const messageElement = alertBox.querySelector('.alert-message');
        const confirmButton = alertBox.querySelector('.alert-button');

        messageElement.textContent = message;
        alertBox.style.display = 'flex';

        confirmButton.onclick = () => {
            alertBox.style.display = 'none';
        };
    }

    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleButton';
    document.body.appendChild(toggleButton);

    const formContainer = document.createElement('div');
    formContainer.id = 'formContainer';
    formContainer.innerHTML = `
        <div id="modeSwitch">
            <button id="pop3Mode" class="el-button el-button--primary">POP3</button>
            <button id="oauth2Mode" class="el-button">OAuth2</button>
        </div>
        <form id="emailForm" class="el-form" label-position="top">
            <div id="pop3Section">
                <div class="el-form-item">
                    <label class="el-form-item__label">邮箱</label>
                    <div class="el-input">
                        <input id="userName" type="text" autocomplete="off" placeholder="请输入邮箱" class="el-input__inner">
                    </div>
                </div>
                <div class="el-form-item">
                    <label class="el-form-item__label">POP3 授权码</label>
                    <div class="el-input">
                        <input id="passWord" type="password" autocomplete="off" placeholder="请输入POP3授权码" class="el-input__inner">
                    </div>
                </div>
            </div>
            <div id="oauth2Section">
                <div class="el-form-item">
                    <label class="el-form-item__label">oauth2形式邮箱数据</label>
                    <div class="el-input">
                        <textarea id="oauthCode" placeholder="以闪邮箱提取示例：dru3wkzv6xxx@hotmail.com----UUPtTxxxx----M.C501_BAY.0.U.-Cxxxx$----8b4ba9dd-3ea5-4e5f-86f1-xxxx" class="el-input__inner" rows="20"></textarea>
                    </div>
                </div>
            </div>
            <div class="el-form-item">
                <label class="el-form-item__label">验证码</label>
                <div class="el-input">
                    <input id="verificationCode" type="text" autocomplete="off" placeholder="验证码将显示在此处" class="el-input__inner" readonly>
                </div>
            </div>
            <div class="el-form-item">
                <button id="getCodeBtn" class="el-button el-button--primary" type="button">获取验证码</button>
            </div>
        </form>
    `;
    document.body.appendChild(formContainer);

    const pop3Section = document.getElementById('pop3Section');
    const oauth2Section = document.getElementById('oauth2Section');
    const pop3ModeBtn = document.getElementById('pop3Mode');
    const oauth2ModeBtn = document.getElementById('oauth2Mode');
    let currentMode = 'pop3';
    pop3Section.style.display = 'block';

    toggleButton.addEventListener('click', function() {
        const appElement = document.getElementById('formContainer');
        if (appElement.style.display === 'none' || appElement.style.display === '') {
            appElement.style.display = 'block';
        } else {
            appElement.style.display = 'none';
        }
    });

    pop3ModeBtn.addEventListener('click', function() {
        currentMode = 'pop3';
        pop3Section.style.display = 'block';
        oauth2Section.style.display = 'none';
        pop3ModeBtn.classList.add('el-button--primary');
        oauth2ModeBtn.classList.remove('el-button--primary');
    });

    oauth2ModeBtn.addEventListener('click', function() {
        currentMode = 'oauth2';
        pop3Section.style.display = 'none';
        oauth2Section.style.display = 'block';
        oauth2ModeBtn.classList.add('el-button--primary');
        pop3ModeBtn.classList.remove('el-button--primary');
    });

    const getCodeBtn = document.getElementById('getCodeBtn');
    getCodeBtn.addEventListener('click', function() {
        const verificationCodeInput = document.getElementById('verificationCode');
        let url, requestData;
        if (currentMode === 'pop3') {
            const userName = document.getElementById('userName').value;
            const passWord = document.getElementById('passWord').value;
            if (!userName || !passWord) {
                customAlert('请输入邮箱和POP3授权码！');
                return;
            }
            url = 'https://ppcode.bilivo.top/get_code';
            requestData = {
                userName: userName,
                passWord: passWord,
                recipientEmail: userName
            };
        } else if (currentMode === 'oauth2') {
            const oauthCode = document.getElementById('oauthCode').value.trim();
            if (!oauthCode) {
                customAlert('请输入oauth2形式邮箱数据！以闪邮箱提取示例：dru3wkzv6xxx@hotmail.com----UUPtTxxxx----M.C501_BAY.0.U.-Cxxxx$----8b4ba9dd-3ea5-4e5f-86f1-xxxx');
                return;
            }
            const oauthData = oauthCode.split('----');
            if (oauthData.length !== 4) {
                customAlert('oauth2形式邮箱数据格式错误，请检查输入！');
                return;
            }
            const [userName, passWord, refreshToken, clientId] = oauthData;
            url = 'https://ppcode.bilivo.top/oauth2';
            requestData = {
                userName: userName,
                passWord: passWord,
                refreshToken: refreshToken,
                clientId: clientId
            };
        }
        getCodeBtn.innerText = '加载中...';
        getCodeBtn.disabled = true;
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(requestData),
            onload: function(response) {
                console.log("开始获取验证码...");
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data.code === 200) {
                        const verificationCode = data.verification_code;
                        verificationCodeInput.value = verificationCode;
                        navigator.clipboard.writeText(verificationCode).then(function() {
                            customAlert('验证码已自动复制到剪切板：' + verificationCode);
                        }, function(err) {
                            customAlert('复制验证码到剪切板失败：' + err);
                        });
                    } else {
                        customAlert('未能获取到验证码，请重试或确保信息正确！');
                    }
                } else {
                    const data = JSON.parse(response.responseText);
                    customAlert(data.msg || '服务出错了...');
                }
                getCodeBtn.innerText = '获取验证码';
                getCodeBtn.disabled = false;
            },
            onerror: function() {
                customAlert('无法连接到服务器');
                getCodeBtn.innerText = '获取验证码';
                getCodeBtn.disabled = false;
            }
        });
    });
})();