// ==UserScript==
// @name         Whmcs表单填充助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使用RandomUser API自动生成身份信息并填充网页注册表单。
// @author       Assistant (Enhanced by AI)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      randomuser.me
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542304/Whmcs%E8%A1%A8%E5%8D%95%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542304/Whmcs%E8%A1%A8%E5%8D%95%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 国家代码 -> 中文名
    const countryNamesCN = {
        'AU': '澳大利亚', 'BR': '巴西', 'CA': '加拿大', 'CH': '瑞士', 'DE': '德国',
        'DK': '丹麦', 'ES': '西班牙', 'FI': '芬兰', 'FR': '法国', 'GB': '英国',
        'IE': '爱尔兰', 'IN': '印度', 'IR': '伊朗', 'MX': '墨西哥', 'NL': '荷兰',
        'NO': '挪威', 'NZ': '新西兰', 'RS': '塞尔维亚', 'TR': '土耳其', 'UA': '乌克兰', 'US': '美国'
    };

    // 国家代码 -> 电话区号
    const countryPhoneCodes = {
        'AU': '+61', 'BR': '+55', 'CA': '+1', 'CH': '+41', 'DE': '+49', 'DK': '+45',
        'ES': '+34', 'FI': '+358', 'FR': '+33', 'GB': '+44', 'IE': '+353', 'IN': '+91',
        'IR': '+98', 'MX': '+52', 'NL': '+31', 'NO': '+47', 'NZ': '+64', 'RS': '+381',
        'TR': '+90', 'UA': '+380', 'US': '+1'
    };

    let currentUserData = null;

    GM_addStyle(`
        #form-filler-panel {
            position: fixed; top: 20px; right: 20px; width: 280px; background: #fff;
            border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
        }
        #form-filler-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 15px;
            border-radius: 8px 8px 0 0; cursor: move; display: flex; justify-content: space-between; align-items: center;
        }
        #form-filler-content { padding: 15px; }
        .form-group { margin-bottom: 12px; }
        .form-group label { display: block; margin-bottom: 4px; font-weight: bold; color: #333; }
        .form-group select, .form-group button {
            width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;
        }
        .form-group button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; cursor: pointer;
            font-weight: bold; transition: all 0.3s;
        }
        .form-group button:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); }
        .form-group button:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
        #user-preview {
            background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 10px; margin-top: 12px;
            font-size: 12px; max-height: 200px; overflow-y: auto;
        }
        .preview-item { margin-bottom: 4px; display: flex; justify-content: space-between; align-items: flex-start; }
        .preview-label { font-weight: bold; color: #495057; margin-right: 8px; white-space: nowrap; }
        .preview-value { color: #6c757d; text-align: right; max-width: 170px; word-break: break-all; }
        .close-btn { background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; width: 24px; height: 24px; text-align: center; line-height: 24px; }
        #form-filler-toggle {
            position: fixed; /* Use fixed positioning for the button */
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; border: none; padding: 10px 15px; border-radius: 20px; cursor: move; /* Change cursor to move */
            z-index: 9999; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: none;
        }
        .status-message { padding: 8px; border-radius: 4px; margin-top: 8px; text-align: center; font-size: 12px; }
        .status-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .status-loading { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
    `);

    const fieldMappings = {
        firstName: ['firstname', 'first_name', 'first-name', 'fname', 'given_name', 'givenname'],
        lastName: ['lastname', 'last_name', 'last-name', 'lname', 'surname', 'family_name', 'familyname'],
        fullName: ['fullname', 'full_name', 'full-name', 'name', 'username', 'user_name', 'user-name'],
        phone: ['phone', 'phonenumber', 'phone_number', 'phone-number', 'tel', 'telephone', 'mobile', 'cell'],
        address: ['address', 'street', 'streetaddress', 'street_address', 'street-address', 'address1', 'addr1'],
        city: ['city', 'town', 'locality'],
        state: ['state', 'province', 'region', 'stateprovince', 'state_province', 'state-province'],
        postcode: ['postcode', 'zipcode', 'zip', 'postal', 'postalcode', 'postal_code', 'postal-code', 'zip_code'],
        country: ['country', 'nation', 'nationality'],
        gender: ['gender', 'sex']
    };


    function createPanel() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'form-filler-toggle';
        toggleButton.textContent = '📝 表单填充';

        const savedPos = GM_getValue('buttonPosition', null);
        if (savedPos) {
            toggleButton.style.top = savedPos.top;
            toggleButton.style.left = savedPos.left;
            toggleButton.style.right = 'auto';
            toggleButton.style.bottom = 'auto';
        } else {
            toggleButton.style.top = '20px';
            toggleButton.style.right = '20px';
        }

        document.body.appendChild(toggleButton);

        const panel = document.createElement('div');
        panel.id = 'form-filler-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div id="form-filler-header"><span>📝 智能表单填充</span><button class="close-btn" id="close-panel">×</button></div>
            <div id="form-filler-content">
                <div class="form-group"><label for="country-select">选择国家/地区:</label><select id="country-select">${Object.entries(countryNamesCN).map(([code, name]) => `<option value="${code}">${name} (${code})</option>`).join('')}</select></div>
                <div class="form-group"><button id="generate-btn">🎲 生成用户信息</button></div>
                <div class="form-group"><button id="fill-btn" disabled>🖊️ 自动填充表单</button></div>
                <div class="form-group"><button id="clear-btn">🗑️ 清空表单</button></div>
                <div id="user-preview" style="display: none;"></div><div id="status-message"></div>
            </div>`;
        document.body.appendChild(panel);

        const savedCountry = GM_getValue('selectedCountry', 'US');
        document.getElementById('country-select').value = savedCountry;

        bindEvents();
        makeDraggable(panel, 'form-filler-header');
        makeButtonDraggable(toggleButton);
    }

    function bindEvents() {
        document.getElementById('form-filler-toggle').addEventListener('click', (e) => {
            if (e.detail === 1) {
                togglePanel();
            }
        });
        document.getElementById('close-panel').addEventListener('click', hidePanel);
        document.getElementById('generate-btn').addEventListener('click', generateUserData);
        document.getElementById('fill-btn').addEventListener('click', fillForm);
        document.getElementById('clear-btn').addEventListener('click', clearForm);
        document.getElementById('country-select').addEventListener('change', function() { GM_setValue('selectedCountry', this.value); });
    }

    function generateUserData() {
        const countryCode = document.getElementById('country-select').value;
        const generateBtn = document.getElementById('generate-btn');
        const fillBtn = document.getElementById('fill-btn');
        generateBtn.disabled = true; generateBtn.textContent = '⏳ 生成中...';
        showStatus('正在生成用户信息...', 'loading');
        GM_xmlhttpRequest({
            method: 'GET', url: `https://randomuser.me/api/?nat=${countryCode}&inc=name,location,phone,cell,dob,gender`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.results && data.results.length > 0) {
                        currentUserData = data.results[0];
                        const phoneCode = countryPhoneCodes[countryCode] || '';
                        currentUserData.formattedPhone = phoneCode + (currentUserData.phone || currentUserData.cell).replace(/[^\d]/g, '');
                        displayUserPreview(); fillBtn.disabled = false; showStatus('✅ 用户信息生成成功！', 'success');
                    } else { throw new Error('API未返回有效用户数据'); }
                } catch (error) { console.error('解析用户数据失败:', error); showStatus('❌ 生成失败，请重试', 'error'); }
                finally { generateBtn.disabled = false; generateBtn.textContent = '🎲 生成用户信息'; }
            },
            onerror: function(error) {
                console.error('API请求失败:', error); showStatus('❌ 网络请求失败，请检查网络', 'error');
                generateBtn.disabled = false; generateBtn.textContent = '🎲 生成用户信息';
            }
        });
    }

    function displayUserPreview() {
        if (!currentUserData) return;
        const preview = document.getElementById('user-preview'), user = currentUserData, code = document.getElementById('country-select').value;
        preview.innerHTML = `
            <div class="preview-item"><span class="preview-label">姓名:</span> <span class="preview-value">${user.name.first} ${user.name.last}</span></div>
            <div class="preview-item"><span class="preview-label">性别:</span> <span class="preview-value">${user.gender}</span></div>
            <div class="preview-item"><span class="preview-label">电话:</span> <span class="preview-value">${user.formattedPhone}</span></div>
            <div class="preview-item"><span class="preview-label">地址:</span> <span class="preview-value">${user.location.street.number} ${user.location.street.name}</span></div>
            <div class="preview-item"><span class="preview-label">城市:</span> <span class="preview-value">${user.location.city}</span></div>
            <div class="preview-item"><span class="preview-label">州/省:</span> <span class="preview-value">${user.location.state}</span></div>
            <div class="preview-item"><span class="preview-label">邮编:</span> <span class="preview-value">${user.location.postcode}</span></div>
            <div class="preview-item"><span class="preview-label">国家:</span> <span class="preview-value">${user.location.country} (${code})</span></div>`;
        preview.style.display = 'block';
    }

    function findInputFields() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], input:not([type]), select, textarea');
        const fields = {};
        for (const [fieldType, patterns] of Object.entries(fieldMappings)) {
            if (fields[fieldType]) continue;
            for (const input of inputs) {
                const attrs = [input.name, input.id, input.placeholder, input.className, input.getAttribute('data-field'), input.getAttribute('autocomplete')].filter(Boolean).join(' ').toLowerCase();
                let label = input.closest('label') || (input.id && document.querySelector(`label[for="${input.id}"]`));
                const allText = `${attrs} ${label ? label.textContent.toLowerCase() : ''}`;
                if (fieldType !== 'fullName' && fieldType !== 'firstName' && fieldType !== 'lastName' && (input.type === 'email' || input.type === 'password' || allText.includes('email') || allText.includes('password'))) continue;
                for (const pattern of patterns) { if (allText.includes(pattern)) { fields[fieldType] = input; break; } }
                if (fields[fieldType]) break;
            }
        }
        return fields;
    }

    function setFieldValue(element, value) {
        if (!element || typeof value === 'undefined') return false;
        element.focus();
        if (element.tagName.toLowerCase() === 'select') {
            const valLower = String(value).toLowerCase(); let found = false;
            for (const opt of element.options) { if (String(opt.value).toLowerCase() === valLower || String(opt.textContent).toLowerCase() === valLower) { element.value = opt.value; found = true; break; } }
            if (!found) { for (const opt of element.options) { if (String(opt.textContent).toLowerCase().includes(valLower)) { element.value = opt.value; found = true; break; } } }
            if (!found) return false;
        } else { element.value = value; }
        ['input', 'change', 'blur', 'keyup'].forEach(e => element.dispatchEvent(new Event(e, { bubbles: true, cancelable: true })));
        element.style.backgroundColor = '#e8f5e8'; setTimeout(() => { element.style.backgroundColor = ''; }, 1500);
        return true;
    }

    function fillForm() {
        if (!currentUserData) { showStatus('❌ 请先生成用户信息', 'error'); return; }
        const fieldsToFill = findInputFields(), user = currentUserData; let filledCount = 0;
        if (fieldsToFill.firstName && fieldsToFill.lastName) delete fieldsToFill.fullName;
        const fillData = {
            firstName: user.name.first, lastName: user.name.last, fullName: `${user.name.first} ${user.name.last}`, phone: user.formattedPhone,
            address: `${user.location.street.number} ${user.location.street.name}`, city: user.location.city, state: user.location.state,
            postcode: user.location.postcode.toString(), country: user.location.country, gender: user.gender
        };
        const countryField = fieldsToFill.country, stateField = fieldsToFill.state;
        if (countryField && stateField && stateField.tagName.toLowerCase() === 'select') {
            if (setFieldValue(countryField, fillData.country)) filledCount++;
            const stateSelect = stateField, stateName = fillData.state;
            if (setFieldValue(stateSelect, stateName)) { filledCount++; } else {
                const observer = new MutationObserver((_, obs) => {
                    if (setFieldValue(stateSelect, stateName)) { filledCount++; obs.disconnect(); clearTimeout(timeoutId); }
                });
                observer.observe(stateSelect, { childList: true });
                const timeoutId = setTimeout(() => { observer.disconnect(); console.warn(`Observer timed out for state: ${stateName}`); }, 3000);
            }
            delete fieldsToFill.country; delete fieldsToFill.state;
        }
        for (const fieldType in fieldsToFill) { if (fieldsToFill[fieldType] && setFieldValue(fieldsToFill[fieldType], fillData[fieldType])) filledCount++; }
        setTimeout(() => { showStatus(filledCount > 0 ? `✅ 成功填充 ${filledCount} 个字段` : '⚠️ 未找到可填充的字段', filledCount > 0 ? 'success' : 'error'); }, 500);
    }

    function clearForm() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], input:not([type]), select, textarea'); let clearedCount = 0;
        inputs.forEach(input => {
            const attrs = [input.name, input.id, input.placeholder, input.className].filter(Boolean).join(' ').toLowerCase();
            if (input.type === 'email' || input.type === 'password' || attrs.includes('email') || attrs.includes('password')) return;
            if (input.value.trim() !== '' || (input.tagName === 'SELECT' && input.selectedIndex > 0)) {
                input.value = (input.tagName === 'SELECT') ? input.options[0].value : '';
                ['input', 'change', 'blur'].forEach(e => input.dispatchEvent(new Event(e, { bubbles: true })));
                input.style.backgroundColor = '#ffe8e8'; setTimeout(() => { input.style.backgroundColor = ''; }, 500);
                clearedCount++;
            }
        });
        showStatus(clearedCount > 0 ? `🗑️ 已清空 ${clearedCount} 个字段` : 'ℹ️ 没有需要清空的字段', 'success');
    }

    function togglePanel() {
        const panel = document.getElementById('form-filler-panel'), toggleBtn = document.getElementById('form-filler-toggle');
        if (panel.style.display === 'none') { panel.style.display = 'block'; toggleBtn.style.display = 'none'; }
        else { panel.style.display = 'none'; updateButtonVisibility(); }
    }

    function hidePanel() {
        document.getElementById('form-filler-panel').style.display = 'none';
        updateButtonVisibility();
    }

    function makeDraggable(element, handleId) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const handle = document.getElementById(handleId);
        if (handle) handle.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event; e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = closeDragElement; document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event; e.preventDefault();
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px"; element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto'; element.style.bottom = 'auto';
        }
        function closeDragElement() { document.onmouseup = null; document.onmousemove = null; }
    }

    function makeButtonDraggable(button) {
        let offsetX, offsetY, isDragging = false;

        button.onmousedown = function(e) {
            isDragging = true;
            button.style.cursor = 'grabbing';
            e.preventDefault();
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        function onMouseMove(e) {
            if (!isDragging) return;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            button.style.left = `${newLeft}px`;
            button.style.top = `${newTop}px`;
            button.style.right = 'auto';
            button.style.bottom = 'auto';
        }

        function onMouseUp() {
            if (!isDragging) return;
            isDragging = false;
            button.style.cursor = 'move';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            GM_setValue('buttonPosition', { top: button.style.top, left: button.style.left });
        }
    }


    function showStatus(message, type = 'loading') {
        const statusDiv = document.getElementById('status-message');
        if (!statusDiv) return; statusDiv.innerHTML = `<div class="status-message status-${type}">${message}</div>`;
        if (type !== 'loading') setTimeout(() => { if (statusDiv) statusDiv.innerHTML = ''; }, 3000);
    }

    function shouldShowButton() {
        if (GM_getValue('forceShowButton', false)) return true;
        return Object.keys(findInputFields()).length >= 4;
    }

    function updateButtonVisibility() {
        const toggleBtn = document.getElementById('form-filler-toggle');
        if (toggleBtn) toggleBtn.style.display = shouldShowButton() ? 'block' : 'none';
    }

    function registerMenuCommands() {
        if (window.menuCommandId) GM_unregisterMenuCommand(window.menuCommandId);
        const isForced = GM_getValue('forceShowButton', false);
        const label = isForced ? '悬浮按钮: 手动 (点击切换为自动)' : '悬浮按钮: 自动 (点击切换为手动)';
        window.menuCommandId = GM_registerMenuCommand(label, () => {
            const newSetting = !GM_getValue('forceShowButton', false);
            GM_setValue('forceShowButton', newSetting);
            alert(`智能填充助手：悬浮按钮已切换为 "${newSetting ? '手动显示' : '自动检测'}" 模式。`);
            registerMenuCommands(); updateButtonVisibility();
        });
    }

    function init() {
        createPanel();
        registerMenuCommands();
        window.addEventListener('load', updateButtonVisibility);
    }

    init();
    console.log('Whcms表单填充助手已加载！');

})();