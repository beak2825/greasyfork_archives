// ==UserScript==
// @name         周边抢枪抢
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  无介绍
// @description  此脚本受版权专利保护，禁止未经授权的修改和分发，否则负法律责任
// @author       晓星翼翼
// @match        https://docs.qq.com/form/*
// @license      All Rights Reserved
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/538043/%E5%91%A8%E8%BE%B9%E6%8A%A2%E6%9E%AA%E6%8A%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/538043/%E5%91%A8%E8%BE%B9%E6%8A%A2%E6%9E%AA%E6%8A%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hashedKey = '413c05ba9f2feb8109e371acd4dc0f257d150376a8fd6dba427cfc15ad56636c';
    const keyExpiration = 4320 * 60 * 60 * 1000;

    let hasFilledForm = false;
    let autoSubmitEnabled = GM_getValue('autoSubmitEnabled', false);
    let autoFillEnabled = GM_getValue('autoFillEnabled', true);
    let keyVerified = false;
    let lastVerificationTime = GM_getValue('lastVerificationTime', 0);
    let userInfo = GM_getValue('userInfo', null);

    function sha256(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        return crypto.subtle.digest('SHA-256', data)
            .then(hash => {
                return Array.from(new Uint8Array(hash))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
            });
    }

    function checkKeyValidity() {
        const now = Date.now();
        if (lastVerificationTime && (now - lastVerificationTime < keyExpiration)) {
            keyVerified = true;
            return true;
        }
        return false;
    }

    function createUserInfoDialog() {
        const existingDialog = document.getElementById('userInfoDialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        const dialog = document.createElement('div');
        dialog.id = 'userInfoDialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 10000;
            width: 300px;
            font-family: Arial, sans-serif;
        `;

        dialog.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">首次使用设置</h3>
            <p style="color: #666; font-size: 14px;">请输入您的QQ群相关信息，用于自动填写表单</p>
            <label style="display: block; margin: 10px 0 5px 0; color: #333;">在群QQ：</label>
            <input type="text" id="qqGroupInput" placeholder="请输入QQ群名称或QQ号等信息" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
            <div style="text-align: right; margin-top: 15px;">
                <button id="cancelInfoButton" style="background: #f5f5f5; border: 1px solid #ddd; padding: 5px 10px; margin-right: 10px; border-radius: 3px; cursor: pointer;">取消</button>
                <button id="saveInfoButton" style="background: #4285f4; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">保存</button>
            </div>
            <p id="infoError" style="color: red; font-size: 12px; margin-top: 10px; display: none;">请填写完整信息</p>
        `;

        document.body.appendChild(dialog);

        const overlay = document.createElement('div');
        overlay.id = 'infoDialogOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        `;
        document.body.appendChild(overlay);

        // 如果已有信息，填入输入框
        if (userInfo) {
            document.getElementById('qqGroupInput').value = userInfo.qqGroup || '';
        }

        document.getElementById('cancelInfoButton').addEventListener('click', () => {
            dialog.remove();
            overlay.remove();
            if (!userInfo) {
                updateStatus('未设置用户信息，无法自动填写', false);
            }
        });

        document.getElementById('saveInfoButton').addEventListener('click', saveUserInfo);
        document.getElementById('qqGroupInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveUserInfo();
            }
        });

        setTimeout(() => {
            document.getElementById('qqGroupInput').focus();
        }, 100);
    }

    function saveUserInfo() {
        const qqGroup = document.getElementById('qqGroupInput').value.trim();
        const errorMsg = document.getElementById('infoError');

        if (!qqGroup) {
            errorMsg.style.display = 'block';
            return;
        }

        userInfo = {
            qqGroup: qqGroup
        };

        GM_setValue('userInfo', userInfo);
        document.getElementById('userInfoDialog').remove();
        document.getElementById('infoDialogOverlay').remove();
        updateStatus('用户信息保存成功！', true);
    }

    function createKeyDialog() {
        const existingDialog = document.getElementById('keyVerificationDialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        const dialog = document.createElement('div');
        dialog.id = 'keyVerificationDialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 10000;
            width: 300px;
            font-family: Arial, sans-serif;
        `;

        dialog.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">请输入密钥</h3>
            <p style="color: #666; font-size: 14px;">请输入正确的密钥以使用此脚本功能</p>
            <input type="password" id="keyInput" style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
            <div style="text-align: right;">
                <button id="cancelKeyButton" style="background: #f5f5f5; border: 1px solid #ddd; padding: 5px 10px; margin-right: 10px; border-radius: 3px; cursor: pointer;">取消</button>
                <button id="submitKeyButton" style="background: #4285f4; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">确认</button>
            </div>
            <p id="keyError" style="color: red; font-size: 12px; margin-top: 10px; display: none;">密钥错误，请重试</p>
        `;

        document.body.appendChild(dialog);

        const overlay = document.createElement('div');
        overlay.id = 'keyDialogOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        `;
        document.body.appendChild(overlay);

        document.getElementById('cancelKeyButton').addEventListener('click', () => {
            dialog.remove();
            overlay.remove();
        });

        document.getElementById('submitKeyButton').addEventListener('click', verifyKey);
        document.getElementById('keyInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyKey();
            }
        });

        setTimeout(() => {
            document.getElementById('keyInput').focus();
        }, 100);
    }

    function verifyKey() {
        const keyInput = document.getElementById('keyInput');
        const errorMsg = document.getElementById('keyError');
        sha256(keyInput.value).then(inputHash => {
            if (inputHash === hashedKey) {
                keyVerified = true;
                lastVerificationTime = Date.now();
                GM_setValue('lastVerificationTime', lastVerificationTime);
                document.getElementById('keyVerificationDialog').remove();
                document.getElementById('keyDialogOverlay').remove();

                // 检查是否需要设置用户信息
                if (!userInfo) {
                    createUserInfoDialog();
                } else {
                    init();
                    addControlButtons();
                    updateStatus('密钥验证成功！', true);
                }
            } else {
                errorMsg.style.display = 'block';
                keyInput.value = '';
                keyInput.focus();
            }
        }).catch(error => {
            console.error('哈希计算错误:', error);
            errorMsg.textContent = '验证过程中出错，请重试';
            errorMsg.style.display = 'block';
        });
    }

    function createFloatingWindow() {
        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'autoFillStatus';
        floatingWindow.style.cssText = `
            position: fixed;
            top: 135px;
            right: 250px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 14px;
            min-width: 200px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0.3;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(floatingWindow);

        floatingWindow.onmouseenter = () => { floatingWindow.style.opacity = '1'; };
        floatingWindow.onmouseleave = () => { floatingWindow.style.opacity = '0.3'; };

        return floatingWindow;
    }

    function updateStatus(message, success = true) {
        const statusDiv = document.getElementById('autoFillStatus') || createFloatingWindow();
        statusDiv.innerHTML = `
            <div style="margin-bottom: 5px;">自动填写状态：</div>
            <div style="color: ${success ? '#4CAF50' : '#FF5252'}">${message}</div>
        `;
    }

    // 修改后的查找输入框函数，支持关键字识别
    function findInputsByText() {
        const allInputs = Array.from(document.querySelectorAll('.form-simple-main textarea'));
        const result = {
            qqGroupInput: null
        };

        // 定义关键字数组
        const qqKeywords = ['群', 'qq', 'q', 'QQ', 'Q', '群聊', '群号', '企鹅', '腾讯'];

        allInputs.forEach(textarea => {
            let questionText = '';
            let currentElement = textarea;

            // 查找问题文本
            while (currentElement && !questionText) {
                const prevElement = currentElement.previousElementSibling;
                if (prevElement) {
                    questionText = prevElement.textContent.trim();
                }
                currentElement = currentElement.parentElement;
            }

            // 检查是否包含QQ相关关键字
            const hasQQKeyword = qqKeywords.some(keyword =>
                questionText.toLowerCase().includes(keyword.toLowerCase())
            );

            if (hasQQKeyword) {
                result.qqGroupInput = textarea;
            }
        });

        return result;
    }

    function simulateUserInput(element, value) {
        element.focus();
        element.value = '';
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.value = value;
        element.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: value
        }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
        element.dispatchEvent(new Event('focusout', { bubbles: true }));
        element.dispatchEvent(new Event('keyup', { bubbles: true }));
        element.dispatchEvent(new Event('keydown', { bubbles: true }));
    }

    function autoSubmit() {
        const submitButton = document.querySelector('button[type="button"]');
        if (submitButton) {
            submitButton.click();

            setTimeout(() => {
                const confirmButton = document.querySelector('.dui-modal-footer-ok');
                if (confirmButton) {
                    confirmButton.click();
                    updateStatus('表单已自动提交！');
                } else {
                    updateStatus('未找到确认按钮', false);
                }
            }, 50);
        } else {
            updateStatus('未找到提交按钮', false);
        }
    }

    function fillForm() {
        if (hasFilledForm || !userInfo) {
            return;
        }

        const inputs = findInputsByText();

        if (!inputs.qqGroupInput) {
            updateStatus('未找到QQ群相关输入框', false);
            return;
        }

        setTimeout(() => {
            simulateUserInput(inputs.qqGroupInput, userInfo.qqGroup);
            updateStatus('QQ群信息填写完成！');
            hasFilledForm = true;

            if (autoSubmitEnabled) {
                setTimeout(autoSubmit, 50);
            }
        }, 10);
    }

    function addControlButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'controlButtonsContainer';
        buttonContainer.style.cssText = `
            position: fixed;
            top: 200px;
            right: 300px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 9999;
        `;

        const fillButton = document.createElement('button');
        fillButton.innerHTML = `填写模式: ${autoFillEnabled ? '自动' : '手动'}`;
        fillButton.style.cssText = `
            padding: 5px 10px;
            background-color: ${autoFillEnabled ? '#FFA500' : '#2196F3'};
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.3s;
        `;

        const submitToggle = document.createElement('button');
        submitToggle.innerHTML = `自动提交: ${autoSubmitEnabled ? '开启' : '关闭'}`;
        submitToggle.style.cssText = `
            padding: 5px 10px;
            background-color: ${autoSubmitEnabled ? '#4CAF50' : '#FF5252'};
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.30s;
        `;

        const submitNowButton = document.createElement('button');
        submitNowButton.innerHTML = '立即提交';
        submitNowButton.style.cssText = `
            padding: 5px 10px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.30s;
        `;

        const resetKeyButton = document.createElement('button');
        resetKeyButton.innerHTML = '重置密钥';
        resetKeyButton.style.cssText = `
            padding: 5px 10px;
            background-color: #FF9800;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.30s;
        `;

        // 设置信息按钮
        const settingsButton = document.createElement('button');
        settingsButton.innerHTML = '设置信息';
        settingsButton.style.cssText = `
            padding: 5px 10px;
            background-color: #9C27B0;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.30s;
        `;

        [fillButton, submitToggle, submitNowButton, resetKeyButton, settingsButton].forEach(button => {
            button.onmouseenter = () => { button.style.opacity = '1'; };
            button.onmouseleave = () => { button.style.opacity = '0.3'; };
        });

        fillButton.onclick = () => {
            autoFillEnabled = !autoFillEnabled;
            GM_setValue('autoFillEnabled', autoFillEnabled);
            fillButton.innerHTML = `填写模式: ${autoFillEnabled ? '自动' : '手动'}`;
            fillButton.style.backgroundColor = autoFillEnabled ? '#FFA500' : '#2196F3';
            updateStatus(`当前模式: ${autoFillEnabled ? '自动填写' : '手动填写'}`);

            if (autoFillEnabled && !hasFilledForm) {
                fillForm();
            }
        };

        submitToggle.onclick = () => {
            autoSubmitEnabled = !autoSubmitEnabled;
            GM_setValue('autoSubmitEnabled', autoSubmitEnabled);
            submitToggle.innerHTML = `自动提交: ${autoSubmitEnabled ? '开启' : '关闭'}`;
            submitToggle.style.backgroundColor = autoSubmitEnabled ? '#4CAF50' : '#FF5252';

            if (autoSubmitEnabled && hasFilledForm) {
                autoSubmit();
            }
        };

        submitNowButton.onclick = () => {
            autoSubmit();
        };

        resetKeyButton.onclick = () => {
            keyVerified = false;
            GM_setValue('lastVerificationTime', 0);
            document.getElementById('controlButtonsContainer').remove();
            createKeyDialog();
            updateStatus('已重置密钥验证状态，请重新验证', false);
        };

        settingsButton.onclick = () => {
            createUserInfoDialog();
        };

        buttonContainer.appendChild(fillButton);
        buttonContainer.appendChild(submitToggle);
        buttonContainer.appendChild(submitNowButton);
        buttonContainer.appendChild(resetKeyButton);
        buttonContainer.appendChild(settingsButton);
        document.body.appendChild(buttonContainer);
    }

    function init() {
        if (!document.getElementById('autoFillStatus')) {
            createFloatingWindow();
        }

        if (document.readyState === 'complete') {
            updateStatus('正在查找表单...');
            if (autoFillEnabled && userInfo) {
                fillForm();
            } else if (!userInfo) {
                updateStatus('请先设置用户信息', false);
            } else {
                updateStatus('当前为手动填写模式');
            }
        } else {
            updateStatus('等待页面加载...', false);
            setTimeout(init, 10);
        }
    }

    // 主入口
    setTimeout(() => {
        if (checkKeyValidity()) {
            if (!userInfo) {
                createUserInfoDialog();
            } else {
                init();
                addControlButtons();
                updateStatus('密钥已验证，脚本已启动', true);
            }
        } else {
            createFloatingWindow();
            updateStatus('请输入密钥验证', false);
            createKeyDialog();
        }
    }, 100);

    setTimeout(() => {
        if (keyVerified && !hasFilledForm && document.getElementById('autoFillStatus')) {
            init();
        }
    }, 200);
})();
