// ==UserScript==
// @name         阿西吧抢终极
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  此脚本受版权专利保护，禁止未经授权的修改和分发，否则负法律责任
// @author       晓星翼翼
// @license      All Rights Reserved
// @copyright    2025, 晓星翼翼
// @match        https://docs.qq.com/form/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/537451/%E9%98%BF%E8%A5%BF%E5%90%A7%E6%8A%A2%E7%BB%88%E6%9E%81.user.js
// @updateURL https://update.greasyfork.org/scripts/537451/%E9%98%BF%E8%A5%BF%E5%90%A7%E6%8A%A2%E7%BB%88%E6%9E%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从存储中获取个人信息，如果不存在则使用默认值
    let myInfo = {
        name: GM_getValue('userInfo_name', ''),
        gradeClass: GM_getValue('userInfo_gradeClass', ''),
        contact: GM_getValue('userInfo_contact', ''),
        volunteerId: GM_getValue('userInfo_volunteerId', '') 
    };

    const hashedKey = '413c05ba9f2feb8109e371acd4dc0f257d150376a8fd6dba427cfc15ad56636c';
    const keyExpiration = 4320 * 60 * 60 * 1000;

    let hasFilledForm = false;
    let autoSubmitEnabled = GM_getValue('autoSubmitEnabled', false);
    let autoFillEnabled = GM_getValue('autoFillEnabled', true);
    let keyVerified = false;
    let lastVerificationTime = GM_getValue('lastVerificationTime', 0);
    let userInfoSet = GM_getValue('userInfoSet', false);

    // 延迟设置（单位：秒）
    let delaySettings = {
        fillDelay: GM_getValue('delay_fillDelay', 0.1), // 填写字段间隔
        submitDelay: GM_getValue('delay_submitDelay', 0.1), // 提交前等待
        confirmDelay: GM_getValue('delay_confirmDelay', 0.1) // 确认按钮点击延迟
    };

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

    function checkUserInfo() {
        return userInfoSet && myInfo.name && myInfo.gradeClass && myInfo.contact && myInfo.volunteerId;
    }

    function createDelayDialog() {
        const existingDialog = document.getElementById('delaySettingsDialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        const dialog = document.createElement('div');
        dialog.id = 'delaySettingsDialog';
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
            width: 400px;
            font-family: Arial, sans-serif;
        `;

        dialog.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">延迟时间设置</h3>
            <p style="color: #666; font-size: 14px;">请合理设置时间，不要太离谱了</p>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-size: 14px;">填写字段间隔 (秒)：</label>
                <input type="number" id="fillDelayInput" value="${delaySettings.fillDelay}" min="0.05" max="10" step="0.05" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
                <small style="color: #999;">建议: 0.1-0.3秒，填写每个字段之间的等待时间</small>
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-size: 14px;">提交前等待 (秒)：</label>
                <input type="number" id="submitDelayInput" value="${delaySettings.submitDelay}" min="0.1" max="20" step="0.1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
                <small style="color: #999;">建议: 0.2-0.5秒，填写完成后到提交的等待时间</small>
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-size: 14px;">确认按钮延迟 (秒)：</label>
                <input type="number" id="confirmDelayInput" value="${delaySettings.confirmDelay}" min="0.05" max="5" step="0.05" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
                <small style="color: #999;">建议: 0.1-0.2秒，点击提交到确认之间的延迟</small>
            </div>

            <div style="background: #f8f9fa; padding: 10px; border-radius: 3px; margin: 15px 0; font-size: 12px; color: #666;">
                <strong>预设方案：</strong><br>
                <button id="fastPreset" style="margin: 2px; padding: 3px 8px; font-size: 11px; background: #17a2b8; color: white; border: none; border-radius: 2px; cursor: pointer;">极速 (0.05,0.1,0.05)</button>
                <button id="normalPreset" style="margin: 2px; padding: 3px 8px; font-size: 11px; background: #28a745; color: white; border: none; border-radius: 2px; cursor: pointer;">正常 (0.2,0.3,0.1)</button>
                <button id="slowPreset" style="margin: 2px; padding: 3px 8px; font-size: 11px; background: #ffc107; color: black; border: none; border-radius: 2px; cursor: pointer;">缓慢 (0.5,1,0.5)</button>
                <button id="randomPreset" style="margin: 2px; padding: 3px 8px; font-size: 11px; background: #6f42c1; color: white; border: none; border-radius: 2px; cursor: pointer;">随机化</button>
            </div>

            <div style="text-align: right; margin-top: 20px;">
                <button id="cancelDelayButton" style="background: #f5f5f5; border: 1px solid #ddd; padding: 8px 16px; margin-right: 10px; border-radius: 3px; cursor: pointer;">取消</button>
                <button id="saveDelayButton" style="background: #4285f4; color: white; border: none; padding: 8px 16px; border-radius: 3px; cursor: pointer;">保存</button>
            </div>
        `;

        document.body.appendChild(dialog);

        // 添加背景遮罩
        const overlay = document.createElement('div');
        overlay.id = 'delayDialogOverlay';
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

        // 预设方案事件
        document.getElementById('fastPreset').addEventListener('click', () => {
            document.getElementById('fillDelayInput').value = '0.05';
            document.getElementById('submitDelayInput').value = '0.1';
            document.getElementById('confirmDelayInput').value = '0.05';
        });

        document.getElementById('normalPreset').addEventListener('click', () => {
            document.getElementById('fillDelayInput').value = '0.2';
            document.getElementById('submitDelayInput').value = '0.3';
            document.getElementById('confirmDelayInput').value = '0.1';
        });

        document.getElementById('slowPreset').addEventListener('click', () => {
            document.getElementById('fillDelayInput').value = '0.5';
            document.getElementById('submitDelayInput').value = '1.0';
            document.getElementById('confirmDelayInput').value = '0.5';
        });

        document.getElementById('randomPreset').addEventListener('click', () => {
            document.getElementById('fillDelayInput').value = (0.1 + Math.random() * 0.4).toFixed(2);
            document.getElementById('submitDelayInput').value = (0.2 + Math.random() * 0.6).toFixed(2);
            document.getElementById('confirmDelayInput').value = (0.05 + Math.random() * 0.15).toFixed(2);
        });

        document.getElementById('cancelDelayButton').addEventListener('click', () => {
            dialog.remove();
            overlay.remove();
        });

        document.getElementById('saveDelayButton').addEventListener('click', saveDelaySettings);
    }

    // 保存延迟设置
    function saveDelaySettings() {
        const fillDelay = parseFloat(document.getElementById('fillDelayInput').value);
        const submitDelay = parseFloat(document.getElementById('submitDelayInput').value);
        const confirmDelay = parseFloat(document.getElementById('confirmDelayInput').value);

        delaySettings = { fillDelay, submitDelay, confirmDelay };

        GM_setValue('delay_fillDelay', fillDelay);
        GM_setValue('delay_submitDelay', submitDelay);
        GM_setValue('delay_confirmDelay', confirmDelay);

        document.getElementById('delaySettingsDialog').remove();
        const overlay = document.getElementById('delayDialogOverlay');
        if (overlay) overlay.remove();

        updateStatus(`延迟设置已保存：填写${fillDelay}s，提交${submitDelay}s，确认${confirmDelay}s`, true);
    }

    function createInfoDialog(isFirstTime = false) {
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
            width: 400px;
            font-family: Arial, sans-serif;
            max-height: 80vh;
            overflow-y: auto;
        `;

        dialog.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">${isFirstTime ? '首次设置个人信息' : '修改个人信息'}</h3>
            <p style="color: #666; font-size: 14px;">请输入您的详细信息，这些信息仅用于自动填写表单</p>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-size: 14px;">姓名：</label>
                <input type="text" id="nameInput" value="${myInfo.name}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;" placeholder="请输入您的姓名">
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-size: 14px;">年级班级：</label>
                <input type="text" id="gradeClassInput" value="${myInfo.gradeClass}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;" placeholder="例如：2023级计算机1班">
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-size: 14px;">联系方式：</label>
                <input type="text" id="contactInput" value="${myInfo.contact}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;" placeholder="手机号码或QQ号">
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-size: 14px;">志愿者编号：</label>
                <input type="text" id="volunteerIdInput" value="${myInfo.volunteerId}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;" placeholder="请输入志愿者编号">
            </div>

            <div style="text-align: right; margin-top: 20px;">
                ${!isFirstTime ? '<button id="cancelInfoButton" style="background: #f5f5f5; border: 1px solid #ddd; padding: 8px 16px; margin-right: 10px; border-radius: 3px; cursor: pointer;">取消</button>' : ''}
                <button id="saveInfoButton" style="background: #4285f4; color: white; border: none; padding: 8px 16px; border-radius: 3px; cursor: pointer;">保存</button>
            </div>
            <p id="infoError" style="color: red; font-size: 12px; margin-top: 10px; display: none;">请填写完整的信息</p>
        `;

        document.body.appendChild(dialog);

        // 添加背景遮罩
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

        // 绑定事件
        if (!isFirstTime) {
            document.getElementById('cancelInfoButton').addEventListener('click', () => {
                dialog.remove();
                overlay.remove();
            });
        }

        document.getElementById('saveInfoButton').addEventListener('click', () => saveUserInfo(isFirstTime));

        // 回车保存
        [document.getElementById('nameInput'), document.getElementById('gradeClassInput'), document.getElementById('contactInput'), document.getElementById('volunteerIdInput')].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveUserInfo(isFirstTime);
                }
            });
        });

        setTimeout(() => {
            document.getElementById('nameInput').focus();
        }, 100);
    }

    // 保存用户信息
    function saveUserInfo(isFirstTime = false) {
        const nameInput = document.getElementById('nameInput');
        const gradeClassInput = document.getElementById('gradeClassInput');
        const contactInput = document.getElementById('contactInput');
        const volunteerIdInput = document.getElementById('volunteerIdInput');
        const errorMsg = document.getElementById('infoError');

        const name = nameInput.value.trim();
        const gradeClass = gradeClassInput.value.trim();
        const contact = contactInput.value.trim();
        const volunteerId = volunteerIdInput.value.trim();

        // 验证必填字段
        if (!name || !gradeClass || !contact || !volunteerId) {
            errorMsg.style.display = 'block';
            return;
        }

        // 保存信息
        myInfo = { name, gradeClass, contact, volunteerId };
        GM_setValue('userInfo_name', name);
        GM_setValue('userInfo_gradeClass', gradeClass);
        GM_setValue('userInfo_contact', contact);
        GM_setValue('userInfo_volunteerId', volunteerId);
        GM_setValue('userInfoSet', true);
        userInfoSet = true;

        // 关闭对话框
        document.getElementById('userInfoDialog').remove();
        const overlay = document.getElementById('infoDialogOverlay');
        if (overlay) overlay.remove();

        // 显示成功消息
        updateStatus(`信息已保存：${name} - ${gradeClass}`, true);

        // 如果是首次设置，继续初始化流程
        if (isFirstTime) {
            setTimeout(() => {
                if (checkKeyValidity()) {
                    init();
                    addControlButtons();
                } else {
                    createKeyDialog();
                }
            }, 1000);
        } else {
            // 重置填写状态，允许重新填写
            hasFilledForm = false;
        }
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
            <p style="color: #666; font-size: 14px;">请输入正确的密钥以打开新世界大门</p>
            <input type="password" id="keyInput" style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
            <div style="text-align: right;">
                <button id="cancelKeyButton" style="background: #f5f5f5; border: 1px solid #ddd; padding: 5px 10px; margin-right: 10px; border-radius: 3px; cursor: pointer;">取消</button>
                <button id="submitKeyButton" style="background: #4285f4; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">确认</button>
            </div>
            <p id="keyError" style="color: red; font-size: 12px; margin-top: 10px; display: none;">密码错误，请重新输入</p>
        `;

        document.body.appendChild(dialog);

        // 添加背景遮罩
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

        // 绑定事件
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

        // 聚焦到输入框
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
                init();
                addControlButtons();
                updateStatus('密钥验证成功！', true);
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
            padding: 12px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 13px;
            min-width: 220px;
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
            <div style="margin-bottom: 5px; font-weight: bold;">自动填写状态：</div>
            <div style="color: ${success ? '#4CAF50' : '#FF5252'}">${message}</div>
            <div style="font-size: 11px; margin-top: 5px; color: #ccc;">
                <div>姓名: ${myInfo.name || '未设置'}</div>
                <div>班级: ${myInfo.gradeClass || '未设置'}</div>
                <div>联系: ${myInfo.contact || '未设置'}</div>
                <div>编号: ${myInfo.volunteerId || '未设置'}</div>
            </div>
            <div style="font-size: 10px; margin-top: 3px; color: #999;">延迟: ${delaySettings.fillDelay}s/${delaySettings.submitDelay}s/${delaySettings.confirmDelay}s</div>
        `;
    }

function findInputsByText() {
    const allInputs = Array.from(document.querySelectorAll('.form-simple-main textarea'));
    const result = {
        nameInput: null,
        gradeClassInput: null,
        contactInput: null,
        volunteerIdInput: null
    };

    // 为每个输入框找到最相关的标题文本
    const inputTextPairs = allInputs.map(textarea => {
        let bestTitle = '';
        let confidence = 0;

        // 方法1: 查找最近的标题元素
        let currentElement = textarea.parentElement;
        let searchDepth = 0;

        while (currentElement && searchDepth < 3) {
            let prevSibling = currentElement.previousElementSibling;

            while (prevSibling) {
                const text = prevSibling.textContent.trim();

                if (text.length > 0 && text.length < 50 &&
                    !text.includes('例如') && !text.includes('示例') &&
                    !text.includes('格式') && !text.includes('请输入')) {

                    let currentConfidence = 100 - text.length;

                    if (text.includes('：') || text.includes(':') || text.match(/^\d+[.)]/)) {
                        currentConfidence += 20;
                    }

                    if (currentConfidence > confidence) {
                        bestTitle = text.toLowerCase();
                        confidence = currentConfidence;
                    }
                }

                prevSibling = prevSibling.previousElementSibling;
            }

            currentElement = currentElement.parentElement;
            searchDepth++;
        }

        if (confidence < 50) {
            const labels = document.querySelectorAll('label');
            labels.forEach(label => {
                if (label.textContent.trim().length < 20) {
                    const labelText = label.textContent.trim().toLowerCase();
                    const labelConfidence = 60; // label的置信度设为60

                    if (labelConfidence > confidence) {
                        bestTitle = labelText;
                        confidence = labelConfidence;
                    }
                }
            });
        }

        return {
            textarea: textarea,
            title: bestTitle,
            confidence: confidence,
            index: allInputs.indexOf(textarea)
        };
    });

    console.log('输入框标题匹配结果:', inputTextPairs.map(pair => ({
        index: pair.index,
        title: pair.title,
        confidence: pair.confidence
    })));

    const matchRules = [
        {
            field: 'nameInput',
            keywords: ['姓名', 'name', '名字'],
            exactMatches: ['01', '1.', '1）', '（1）']
        },
        {
            field: 'gradeClassInput',
            keywords: ['年级', '班级', 'grade', 'class', '专业'],
            exactMatches: ['02', '2.', '2）', '（2）']
        },
        {
            field: 'contactInput',
            keywords: ['联系', '电话', '手机', 'qq', 'contact', 'phone', '微信'],
            exactMatches: ['03', '3.', '3）', '（3）']
        },
        {
            field: 'volunteerIdInput',
            keywords: ['志愿者', '编号', 'volunteer', 'id', '学号'],
            exactMatches: ['04', '4.', '4）', '（4）']
        }
    ];

    const sortedPairs = [...inputTextPairs].sort((a, b) => b.confidence - a.confidence);

    const assignedFields = new Set();
    const assignedTextareas = new Set();

    sortedPairs.forEach(pair => {
        if (assignedTextareas.has(pair.textarea)) return;

        for (const rule of matchRules) {
            if (assignedFields.has(rule.field)) continue;

            const hasExactMatch = rule.exactMatches.some(exact =>
                pair.title.includes(exact.toLowerCase())
            );

            const hasKeywordMatch = rule.keywords.some(keyword =>
                pair.title.includes(keyword)
            );

            if (hasExactMatch || hasKeywordMatch) {
                result[rule.field] = pair.textarea;
                assignedFields.add(rule.field);
                assignedTextareas.add(pair.textarea);

                console.log(`匹配成功: ${rule.field} <- "${pair.title}" (置信度: ${pair.confidence})`);
                break;
            }
        }
    });

    if (assignedFields.size < 4) {
        console.log('精确匹配未完成，按顺序分配剩余字段...');

        const unassignedInputs = allInputs.filter(input => !assignedTextareas.has(input));
        const unassignedFields = ['nameInput', 'gradeClassInput', 'contactInput', 'volunteerIdInput']
            .filter(field => !assignedFields.has(field));

        unassignedFields.forEach((field, index) => {
            if (index < unassignedInputs.length) {
                result[field] = unassignedInputs[index];
                console.log(`顺序分配: ${field} <- 第${allInputs.indexOf(unassignedInputs[index]) + 1}个输入框`);
            }
        });
    }

    console.log('最终字段分配结果:', {
        姓名: result.nameInput ? `第${allInputs.indexOf(result.nameInput) + 1}个框` : '未找到',
        班级: result.gradeClassInput ? `第${allInputs.indexOf(result.gradeClassInput) + 1}个框` : '未找到',
        联系方式: result.contactInput ? `第${allInputs.indexOf(result.contactInput) + 1}个框` : '未找到',
        志愿者编号: result.volunteerIdInput ? `第${allInputs.indexOf(result.volunteerIdInput) + 1}个框` : '未找到'
    });

    return result;
}

    function simulateUserInput(element, value) {
        element.focus();
        element.value = '';
        element.dispatchEvent(new Event('input', { bubbles: true }));

        for (let i = 0; i < value.length; i++) {
            element.value = value.substring(0, i + 1);
            element.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: value[i]
            }));
        }

        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
        element.dispatchEvent(new Event('focusout', { bubbles: true }));
        element.dispatchEvent(new Event('keyup', { bubbles: true }));
        element.dispatchEvent(new Event('keydown', { bubbles: true }));
    }

    function autoSubmit() {
        updateStatus('准备提交表单...', true);
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
            }, delaySettings.confirmDelay * 1000);
        } else {
            updateStatus('未找到提交按钮', false);
        }
    }

    function fillForm() {
        if (hasFilledForm) {
            return;
        }

        const inputs = findInputsByText();
        let availableFields = 0;
        let filledCount = 0;

        // 计算可用字段数量
        if (inputs.nameInput) availableFields++;
        if (inputs.gradeClassInput) availableFields++;
        if (inputs.contactInput) availableFields++;
        if (inputs.volunteerIdInput) availableFields++;

        if (availableFields === 0) {
            updateStatus('未找到任何输入框', false);
            return;
        }

        function checkAndSubmit() {
            if (filledCount === availableFields) {
                updateStatus('所有可用字段填写完成！准备提交...');
                hasFilledForm = true;
                if (autoSubmitEnabled) {
                    setTimeout(autoSubmit, delaySettings.submitDelay * 1000);
                }
            }
        }

        let currentDelay = 0;

        // 填写姓名
        if (inputs.nameInput) {
            setTimeout(() => {
                updateStatus('正在填写姓名...', true);
                simulateUserInput(inputs.nameInput, myInfo.name);
                filledCount++;
                checkAndSubmit();
            }, currentDelay);
            currentDelay += delaySettings.fillDelay * 1000;
        }

        // 填写年级班级
        if (inputs.gradeClassInput) {
            setTimeout(() => {
                updateStatus('正在填写年级班级...', true);
                simulateUserInput(inputs.gradeClassInput, myInfo.gradeClass);
                filledCount++;
                checkAndSubmit();
            }, currentDelay);
            currentDelay += delaySettings.fillDelay * 1000;
        }

        // 填写联系方式
        if (inputs.contactInput) {
            setTimeout(() => {
                updateStatus('正在填写联系方式...', true);
                simulateUserInput(inputs.contactInput, myInfo.contact);
                filledCount++;
                checkAndSubmit();
            }, currentDelay);
            currentDelay += delaySettings.fillDelay * 1000;
        }

        // 填写志愿者编号
        if (inputs.volunteerIdInput) {
            setTimeout(() => {
                updateStatus('正在填写志愿者编号...', true);
                simulateUserInput(inputs.volunteerIdInput, myInfo.volunteerId);
                filledCount++;
                checkAndSubmit();
            }, currentDelay);
        }

        if (availableFields === 0) {
            updateStatus('未找到任何匹配的输入框', false);
        }
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
            gap: 8px;
            z-index: 9999;
        `;

        const fillButton = document.createElement('button');
        fillButton.innerHTML = `填写模式: ${autoFillEnabled ? '自动' : '手动'}`;
        fillButton.style.cssText = `
            padding: 6px 12px;
            background-color: ${autoFillEnabled ? '#FFA500' : '#2196F3'};
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.3s;
            font-size: 12px;
        `;

        const submitToggle = document.createElement('button');
        submitToggle.innerHTML = `自动提交: ${autoSubmitEnabled ? '开启' : '关闭'}`;
        submitToggle.style.cssText = `
            padding: 6px 12px;
            background-color: ${autoSubmitEnabled ? '#4CAF50' : '#FF5252'};
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.3s;
            font-size: 12px;
        `;

        const submitNowButton = document.createElement('button');
        submitNowButton.innerHTML = '立即提交';
        submitNowButton.style.cssText = `
            padding: 6px 12px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.3s;
            font-size: 12px;
        `;

        const fillNowButton = document.createElement('button');
        fillNowButton.innerHTML = '立即填写';
        fillNowButton.style.cssText = `
            padding: 6px 12px;
            background-color: #FF9800;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.3s;
            font-size: 12px;
        `;

        const editInfoButton = document.createElement('button');
        editInfoButton.innerHTML = '修改信息';
        editInfoButton.style.cssText = `
            padding: 6px 12px;
            background-color: #9C27B0;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.3s;
            font-size: 12px;
        `;

        const delayButton = document.createElement('button');
        delayButton.innerHTML = '延迟设置';
        delayButton.style.cssText = `
            padding: 6px 12px;
            background-color: #607D8B;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.3s;
            font-size: 12px;
        `;

        const resetKeyButton = document.createElement('button');
        resetKeyButton.innerHTML = '重置密钥';
        resetKeyButton.style.cssText = `
            padding: 6px 12px;
            background-color: #795548;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.3s;
            font-size: 12px;
        `;

        [fillButton, submitToggle, submitNowButton, fillNowButton, editInfoButton, delayButton, resetKeyButton].forEach(button => {
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

        fillNowButton.onclick = () => {
            hasFilledForm = false; // 重置填写状态
            fillForm();
        };

        editInfoButton.onclick = () => {
            createInfoDialog(false);
        };

        delayButton.onclick = () => {
            createDelayDialog();
        };

        resetKeyButton.onclick = () => {
            keyVerified = false;
            GM_setValue('lastVerificationTime', 0);
            document.getElementById('controlButtonsContainer').remove();
            createKeyDialog();
            updateStatus('已重置密钥验证状态，请重新验证', false);
        };

        buttonContainer.appendChild(fillButton);
        buttonContainer.appendChild(submitToggle);
        buttonContainer.appendChild(submitNowButton);
        buttonContainer.appendChild(fillNowButton);
        buttonContainer.appendChild(editInfoButton);
        buttonContainer.appendChild(delayButton);
        buttonContainer.appendChild(resetKeyButton);
        document.body.appendChild(buttonContainer);
    }

    function init() {
        if (!document.getElementById('autoFillStatus')) {
            createFloatingWindow();
        }

        if (document.readyState === 'complete') {
            updateStatus('正在查找表单...');
            if (autoFillEnabled) {
                fillForm();
            } else {
                updateStatus('当前为手动填写模式');
            }
        } else {
            updateStatus('等待页面加载...', false);
            setTimeout(init, 100);
        }
    }

    // 主入口
    setTimeout(() => {
        // 首先检查是否已设置个人信息
        if (!checkUserInfo()) {
            createFloatingWindow();
            updateStatus('首次使用，请设置个人信息', false);
            createInfoDialog(true);
            return;
        }

        if (checkKeyValidity()) {
            init();
            addControlButtons();
            updateStatus('密钥已验证，脚本已启动', true);
        } else {
            createFloatingWindow();
            updateStatus('请输入密钥验证', false);
            createKeyDialog();
        }
    }, 200);

    // 额外检查
    setTimeout(() => {
        if (keyVerified && !hasFilledForm && document.getElementById('autoFillStatus')) {
            init();
        }
    }, 500);

    // 页面变化监听 - 处理动态加载的表单
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                // 检查是否有新的表单元素添加
                const hasFormElements = Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === Node.ELEMENT_NODE &&
                           (node.querySelector && node.querySelector('.form-simple-main textarea'));
                });

                if (hasFormElements && keyVerified && !hasFilledForm && autoFillEnabled) {
                    setTimeout(() => {
                        fillForm();
                    }, 1000);
                }
            }
        });
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();