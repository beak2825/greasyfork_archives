// ==UserScript==
// @name         R.E.D粉丝俱乐部登录助手
// @version      1.0.0
// @description  自动登录 | 通过悬浮球保存账号信息后，每次页面重新加载或手动刷新页面（或双击悬浮球刷新页面）均可切换为登录状态，无需手动登录 | 点击悬浮球可进行账号管理 | 240711
// @author       云边有片芝士
// @icon         data:image/png;base64,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
// @license      GPL-3.0-or-later
// @match        *://*.red-official.cn/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @run-at       document-start

// @namespace https://greasyfork.org/users/1457258
// @downloadURL https://update.greasyfork.org/scripts/533731/RED%E7%B2%89%E4%B8%9D%E4%BF%B1%E4%B9%90%E9%83%A8%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533731/RED%E7%B2%89%E4%B8%9D%E4%BF%B1%E4%B9%90%E9%83%A8%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加密相关函数
    const SECURITY = {
        // 获取或生成加密密钥
        getOrCreateKey: function() {
            let key = localStorage.getItem('_r3d_cfg_');
            if (!key) {
                key = CryptoJS.lib.WordArray.random(32).toString();
                localStorage.setItem('_r3d_cfg_', key);
            }
            return key;
        },

        // 加密数据
        encrypt: function(data) {
            const key = this.getOrCreateKey();
            return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
        },
        
        // 解密数据
        decrypt: function(encryptedData) {
            const key = this.getOrCreateKey();
            const bytes = CryptoJS.AES.decrypt(encryptedData, key);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        },

        // 重新生成密钥
        regenerateKey: function() {
            const oldKey = this.getOrCreateKey();
            const newKey = CryptoJS.lib.WordArray.random(32).toString();
            localStorage.setItem('_r3d_cfg_', newKey);
            return newKey;
        }
    };

    // 从本地存储读取登录信息
    const savedData = localStorage.getItem('loginData');
    let loginData = {
        password: '',
        phoneNumber: '',
        projectId: "1853688995599622144"
    };

    if (savedData) {
        try {
            const decryptedData = SECURITY.decrypt(savedData);
            loginData.password = decryptedData.password;
            loginData.phoneNumber = decryptedData.phoneNumber;
        } catch (e) {
            console.error('解密失败', e);
            // 解密失败时清除数据
            localStorage.removeItem('loginData');
        }
    }
    
    // 判断是否有登录信息 - 全局变量
    const hasLoginInfo = loginData.password && loginData.phoneNumber;

    // 保存登录信息到本地存储函数
    function saveLoginData() {
        const dataToSave = {
            password: loginData.password,
            phoneNumber: loginData.phoneNumber
        };
        const encryptedData = SECURITY.encrypt(dataToSave);
        localStorage.setItem('loginData', encryptedData);
    }

    // 设置cookie函数
    function setTokenCookie(token) {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = `red-token=${token}; path=/; expires=${expires.toUTCString()};`;
        console.log("Token已设置到Cookie");
    }

    // 通用登录请求函数
    function sendLoginRequest(loginParams, options = {}) {
        const {
            onSuccess = () => {},
            onError = () => {},
            showUI = false,
            loginButton = null,
            originalBtnText = ''
        } = options;

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.red-official.cn/prod-api/api/login/passwordLogin",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: JSON.stringify(loginParams),
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                if (result.code === 200) {
                    console.log("登录成功");

                    // 设置token
                    if (result.token) {
                        setTokenCookie(result.token);
                    }

                    onSuccess(result);
                } else {
                    console.error("登录失败：", result.msg || "未知错误");
                    onError(result.msg || "未知错误");
                }

                // 恢复按钮状态 (如果有UI)
                if (showUI && loginButton) {
                    loginButton.textContent = originalBtnText;
                    loginButton.disabled = false;
                }
            },
            onerror: function(error) {
                console.error("请求错误：", error);
                onError("网络错误，请稍后再试");

                // 恢复按钮状态 (如果有UI)
                if (showUI && loginButton) {
                    loginButton.textContent = originalBtnText;
                    loginButton.disabled = false;
                }
            }
        });
    }

    // 登录函数
    function performLogin() {
        sendLoginRequest(loginData);
    }

    // 测试并保存登录信息函数
    function testAndSaveLogin() {
        const newPhone = document.getElementById('phoneInput').value;
        const newPassword = document.getElementById('passwordInput').value;

        // 清除之前的状态信息
        const statusDiv = document.getElementById('statusMessage');
        statusDiv.textContent = '';
        statusDiv.style.opacity = '0';
        statusDiv.style.backgroundColor = '';
        statusDiv.style.color = '';
        statusDiv.style.border = 'none';

        // 临时保存当前输入的值用于登录测试
        const tempLoginData = {
            password: newPassword,
            phoneNumber: newPhone,
            projectId: loginData.projectId
        };

        // 显示加载状态
        const loginButton = document.getElementById('loginButton');
        const originalText = loginButton.textContent;
        loginButton.textContent = '登录中...';
        loginButton.disabled = true;

        // 发送登录请求
        sendLoginRequest(
            tempLoginData,
            {
                showUI: true,
                loginButton,
                originalBtnText: originalText,
                onSuccess: (result) => {
                    // 登录成功才保存到本地
                    loginData.phoneNumber = newPhone;
                    loginData.password = newPassword;
                    saveLoginData();

                    // 显示成功信息
                    statusDiv.style.backgroundColor = '';
                    statusDiv.style.border = 'none';
                    statusDiv.style.opacity = '1';
                    statusDiv.textContent = '账号登录成功并保存！即将刷新页面。';
                    statusDiv.style.color = '#2e7d32';

                    // 刷新页面
                    setTimeout(function() {
                        location.reload();
                    }, 1500);
                },
                onError: (errorMsg) => {
                    // 显示失败信息
                    statusDiv.textContent = '登录失败：' + errorMsg;
                    statusDiv.style.color = '#c62828';
                    statusDiv.style.opacity = '1';
                }
            }
        );
    }

    // 创建悬浮球以及悬浮窗函数
    function createFloatingWindow() {
        const floatingDiv = document.createElement('div');
        // 创建悬浮窗
        floatingDiv.style.display = 'none';
        floatingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
            display: none;
            width: 340px;
        `;

        floatingDiv.innerHTML = `
            <div style="text-align: left; margin-bottom: 20px; font-size: 18px; font-weight: bold;">账号信息</div>
            ${hasLoginInfo ? `
            <div style="text-align: left; margin-bottom: 15px; font-size: 14px; color: #666;">
                已保存账号：${loginData.phoneNumber}
            </div>
            <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                <button id="deleteButton" style="width: 100%; padding: 10px; background: #0057ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">
                    删除账号信息
                    </button>
            </div>
            ` : `
            <div style="margin-bottom: 15px;">
                <input type="text" id="phoneInput" placeholder="请输入手机号或邮箱地址" value=""
                    style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; outline: none; transition: border-color 0.3s; font-size: 14px;">
            </div>
            <div style="margin-bottom: 20px; position: relative;">
                <input type="password" id="passwordInput" placeholder="请输入密码" value=""
                    style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; outline: none; transition: border-color 0.3s; font-size: 14px;">
                <div id="togglePassword" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="#9E9E9E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="eyeIcon">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="#9E9E9E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="eyeOffIcon" style="display: none;">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                </div>
            </div>
            <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                <button id="loginButton" style="width: 100%; padding: 10px; background: #0057ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; opacity: 0.6; font-size: 14px;" disabled>
                    登录并保存
                </button>
            </div>
            `}
            <div id="statusMessage" style="text-align: center; min-height: 24px; padding: 2px; border-radius: 4px; margin-top: 6px; opacity: 0; transition: opacity 0.3s; font-size: 12px; display: flex; justify-content: center; align-items: center;">
                &nbsp;
            </div>
            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">使用说明：</div>
                <div style="font-size: 12px; color: #666; display: flex; align-items: center; margin-bottom: 4px;">
                    <span style="display: inline-block; width: 4px; height: 4px; background: #999; border-radius: 50%; margin-right: 6px;"></span>
                    <span>单击悬浮球：查看/编辑登录信息</span>
                </div>
                <div style="font-size: 12px; color: #666; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 4px; height: 4px; background: #999; border-radius: 50%; margin-right: 6px;"></span>
                    <span>双击悬浮球或刷新页面：快速登录</span>
                </div>
            </div>
        `;

        document.body.appendChild(floatingDiv);

        // 创建悬浮球
        const floatingBall = document.createElement('div');

        // 从localStorage读取上一次停靠位置
        const savedPosition = localStorage.getItem('floatingBallPosition');
        // 默认中下部
        const initialY = savedPosition ? parseInt(savedPosition) : window.innerHeight/2;

        floatingBall.style.cssText = `
            position: fixed;
            top: ${initialY}px;
            right: 0;
            width: 40px;
            height: 36px;
            background: white;
            border-radius: 15px 0 0 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #d70832;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            user-select: none;
            touch-action: none;
            opacity: 0.9;
        `;
        floatingBall.innerHTML = `
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
         <defs>
            <style>
                :root {
                    --icon-color: ${hasLoginInfo ? '#d70832' : '#999'};
                }
                .stroke-color {
                    stroke: var(--icon-color);
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }
                .fill-color {
                    fill: var(--icon-color);
                }
            </style>
         </defs>
         <g class="layer">
          <title>Layer 1</title>
          <path fill="none" id="svg_4" class="stroke-color"/>
          <g id="svg_7">
           <circle cx="16.73" cy="16.42" fill="none" id="svg_1" r="12.61" class="stroke-color" transform="matrix(1 0 0 1 0 0) matrix(0.482619 -0.87583 0.87583 0.482619 -5.72264 23.1516)"/>
           <path d="m35.31,29.12l-11.25,12.57a3.68,3.68 0 0 1 -5.96,-4.25l7.78,-14.01m1.73,7.77l-2.01,3.05" fill="none" id="svg_2" class="stroke-color" transform="rotate(-61.1434 26.465 33.1809)"/>
           <g class="fill-color" id="svg_3">
            <g class="fill-color" id="svg_6">
             <path d="m17.51,17.81l-3.02,0l0,5.2l-1.7,0l0,-12.87l4.27,0q2.17,0 3.35,0.99q1.17,0.99 1.17,2.88q0,1.2 -0.65,2.1q-0.65,0.89 -1.81,1.34l3.02,5.46l0,0.11l-1.82,0l-2.8,-5.2m-3.02,-1.39l2.61,0q1.27,0 2.01,-0.65q0.74,-0.66 0.74,-1.76q0,-1.19 -0.71,-1.83q-0.71,-0.64 -2.05,-0.65l-2.6,0l0,4.87l0,0.01z" id="svg_8" transform="rotate(-27.718 17.4601 16.5765)"/>
            </g>
            <g class="fill-color" id="svg_9" transform="rotate(-32.5809 27.5268 64.3982) translate(0 62.207)">
             <path id="svg_10"/>
            </g>
           </g>
          </g>
         </g>
        </svg>`;
        document.body.appendChild(floatingBall);

        // 拖动相关变量
        let isDragging = false;
        let dragStartY = 0;
        let startY = 0;
        let dragDistance = 0;
        let dragStartTime = 0;
        let isClick = true; // 标记是否为点击事件
        let lastTouchTime = 0; // 为触摸事件添加一个独立的时间记录

        // 通用拖动初始化函数
        function initDrag(clientY) {
            isDragging = true;
            isClick = true; // 初始假设是点击
            dragStartY = clientY;
            startY = parseInt(floatingBall.style.top || floatingBall.getBoundingClientRect().top);
            dragDistance = 0;
            dragStartTime = Date.now();
        }

        // 通用拖动处理函数
        function handleDrag(clientY) {
            if (!isDragging) return;

            // 计算拖动距离
            dragDistance += Math.abs(clientY - dragStartY);

            // 如果拖动距离超过阈值，标记为非点击事件
            if (dragDistance > 5) {
                isClick = false;
            }

            const newY = startY + (clientY - dragStartY);

            // 确保悬浮球不会超出视窗边界
            const maxY = window.innerHeight - floatingBall.offsetHeight;
            const clampedY = Math.max(0, Math.min(newY, maxY));

            // 更新悬浮球位置
            floatingBall.style.top = clampedY + 'px';
            floatingBall.style.bottom = 'auto'; // 移除bottom属性，改为使用top
        }

        // 添加拖动功能 - PC端
        floatingBall.addEventListener('mousedown', function(e) {
            initDrag(e.clientY);
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            handleDrag(e.clientY);
        });

        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                // 保存当前位置到localStorage
                saveBallPosition();
            }
            isDragging = false;
        });

        // 添加拖动功能 - 移动端
        floatingBall.addEventListener('touchstart', function(e) {
            initDrag(e.touches[0].clientY);
            e.preventDefault();
        });

        document.addEventListener('touchmove', function(e) {
            handleDrag(e.touches[0].clientY);
        });

        // 创建通用的悬浮球交互处理函数
        function handleBallInteraction(currentTime, lastTime, timeoutVar) {
            // 检测是否是点击（而非拖动）
            if (dragDistance < 5) {
                const timeDiff = currentTime - lastTime;

                // 判断是否为双击（两次点击间隔小于500ms）
                if (timeDiff < 500) {
                    console.log("检测到双击");
                    clearTimeout(timeoutVar); // 清除单击超时
                    location.reload();
                    return {isDoubleTap: true, newLastTime: currentTime};
                } else {
                    // 设置单击超时，延迟处理单击事件
                    clearTimeout(timeoutVar);

                    const newTimeout = setTimeout(function() {
                        console.log("单击，显示表单");
                        // 显示登录表单，隐藏悬浮球
                        toggleFormVisibility(true);

                        // 清空输入框和状态信息
                        if (!hasLoginInfo) {
                            clearFormInputs();
                        }
                    }, 300); // 300ms延迟，等待可能的第二次点击

                    return {isDoubleTap: false, newLastTime: currentTime, newTimeout: newTimeout};
                }
            }
            return {isDoubleTap: false, newLastTime: lastTime};
        }

        // 通用函数：保存悬浮球位置
        function saveBallPosition() {
            const currentPosition = parseInt(floatingBall.style.top);
            localStorage.setItem('floatingBallPosition', currentPosition);
        }

        // 通用函数：切换表单显示状态
        function toggleFormVisibility(showForm) {
            if (showForm) {
                floatingDiv.style.display = 'block';
                floatingBall.style.display = 'none';
            } else {
                floatingDiv.style.display = 'none';
                floatingBall.style.display = 'flex';
            }
        }

        // 通用函数：清空表单输入和状态
        function clearFormInputs() {
            const phoneInput = document.getElementById('phoneInput');
            const passwordInput = document.getElementById('passwordInput');
            const statusDiv = document.getElementById('statusMessage');

            if (phoneInput) phoneInput.value = '';
            if (passwordInput) passwordInput.value = '';

            // 清除状态信息
            if (statusDiv) {
                statusDiv.textContent = '';
                statusDiv.style.opacity = '0';
                statusDiv.style.backgroundColor = '';
                statusDiv.style.color = '';
                statusDiv.style.border = 'none';
            }
        }

        // 双击单击处理 - 移动端
        let lastTapTime = 0;
        let tapTimeout;

        floatingBall.addEventListener('touchstart', function(e) {
            // 防止默认行为（如滚动）
            e.preventDefault();
        });

        floatingBall.addEventListener('touchend', function(e) {
            // 检测是否是点击（而非拖动）
            if (dragDistance < 5) {
                const currentTime = new Date().getTime();
                const result = handleBallInteraction(currentTime, lastTapTime, tapTimeout);

                lastTapTime = result.newLastTime;
                if (result.newTimeout) tapTimeout = result.newTimeout;

                if (result.isDoubleTap) return;
            } else {
                // 拖动结束，保存位置
                saveBallPosition();
            }

            isDragging = false;
            e.preventDefault(); // 防止触发其他点击事件
        });


        // 双击单击处理 - PC端
        let lastClickTime = 0;
        let clickTimeout;
        floatingBall.addEventListener('click', function(e) {

            // 检测是否是点击（而非拖动）
            if (dragDistance < 5) {
                const currentTime = new Date().getTime();
                const result = handleBallInteraction(currentTime, lastClickTime, clickTimeout);

                lastClickTime = result.newLastTime;
                if (result.newTimeout) clickTimeout = result.newTimeout;

                if (result.isDoubleTap) return;
            }

            // 阻止拖动和事件冒泡
            isDragging = false;
            e.stopPropagation();
        });

        // 点击文档外区域隐藏表单并显示悬浮球
        document.addEventListener('click', function(e) {
            // 检查点击是否发生在浮动表单或悬浮球外部
            if (!floatingBall.contains(e.target) && !floatingDiv.contains(e.target)) {
                toggleFormVisibility(false);
            }
        });

        // 登录表单面板
        if (!hasLoginInfo) {
            const toggleBtn = document.getElementById('togglePassword');
            const passwordInput = document.getElementById('passwordInput');
            const phoneInput = document.getElementById('phoneInput');
            const loginButton = document.getElementById('loginButton');
            const eyeIcon = document.getElementById('eyeIcon');
            const eyeOffIcon = document.getElementById('eyeOffIcon');
            const statusDiv = document.getElementById('statusMessage');

            // 设置输入框焦点时的边框颜色
            phoneInput.addEventListener('focus', function() {
                this.style.borderColor = '#0057ff';
                clearStatusMessage();
            });

            phoneInput.addEventListener('blur', function() {
                this.style.borderColor = '#ddd';
            });

            passwordInput.addEventListener('focus', function() {
                this.style.borderColor = '#0057ff';
                clearStatusMessage();
            });

            passwordInput.addEventListener('blur', function() {
                this.style.borderColor = '#ddd';
            });

            // 验证输入并控制按钮状态
            function validateInputs() {
                if (phoneInput.value.trim() && passwordInput.value.trim()) {
                    loginButton.disabled = false;
                    loginButton.style.opacity = '1';
                    loginButton.style.cursor = 'pointer';
                } else {
                    loginButton.disabled = true;
                    loginButton.style.opacity = '0.6';
                    loginButton.style.cursor = 'default';
                }
            }

            // 添加输入事件监听
            phoneInput.addEventListener('input', validateInputs);
            passwordInput.addEventListener('input', validateInputs);

            toggleBtn.addEventListener('click', function() {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeIcon.style.display = 'none';
                    eyeOffIcon.style.display = 'block';
                } else {
                    passwordInput.type = 'password';
                    eyeIcon.style.display = 'block';
                    eyeOffIcon.style.display = 'none';
                }
            });

            // 清除状态信息函数
            function clearStatusMessage() {
                statusDiv.textContent = '';
                statusDiv.style.opacity = '0';
                statusDiv.style.backgroundColor = '';
                statusDiv.style.color = '';
                statusDiv.style.border = 'none';
            }

            // 添加测试并保存按钮事件
            loginButton.addEventListener('click', function() {
                if (!this.disabled) {
                    testAndSaveLogin();
                }
            });
        }

        // 账号信息管理面板
        if (hasLoginInfo) {
            document.getElementById('deleteButton').addEventListener('click', function() {
                // 清除本地存储
                localStorage.removeItem('loginData');

                // 清除内存中的数据
                loginData.phoneNumber = '';
                loginData.password = '';

                // 显示状态信息
                const statusDiv = document.getElementById('statusMessage');
                statusDiv.textContent = '已删除账号信息，即将刷新页面。';
                statusDiv.style.color = '#c62828';
                statusDiv.style.opacity = '1';

                // 隐藏删除按钮
                this.style.display = 'none';

                // 刷新页面
                setTimeout(function() {
                    location.reload();
                }, 1500);
            });
        }
    }

    // 等待DOM加载完成后创建悬浮窗
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingWindow);
    } else {
        createFloatingWindow();
    }

    // 刷新页面时，当存在登录信息时进行登录
    if (hasLoginInfo) {
        performLogin();
        // 处于登录页面时，不会自动跳转。所以添加强制跳转逻辑
        if (window.location.href.includes('/pages/login')) {
            window.location.href = 'https://www.red-official.cn/#/pages/moments';
        }
    }

})();