// ==UserScript==
// @name         修仙遊戲助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  可自訂圖片高度與監聽延遲秒數，並提供修仙資料修改功能
// @match        https://so-page.web.app/cultivation
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545648/%E4%BF%AE%E4%BB%99%E9%81%8A%E6%88%B2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/545648/%E4%BF%AE%E4%BB%99%E9%81%8A%E6%88%B2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        imageSelector: 'img[alt="主角頭像"].realm-image',
        buttonPlacementSelector: '#userDropdown',
        defaultHeight: 128,
        defaultDelay: 10,
        modalTitle: '個人圖片設定',
        buttonText: '個人圖片設定',
        modifyDataButtonText: '資料修改器',
        applyButtonText: '套用',
        cancelButtonText: '取消',
        sendButtonText: '送出',
    };

    // 圖片設定相關變數
    let currentHeight = GM_getValue('imageHeight', config.defaultHeight);
    let currentDelay = GM_getValue('observerDelay', config.defaultDelay);

    // 資料修改器開關狀態
    let dataModifierEnabled = GM_getValue('dataModifierEnabled', false);

    // 資料修改器相關變數
    const originalFetch = unsafeWindow.fetch;
    const targetApiUrl = 'database=projects%2Fso-page%2Fdatabases%2F(default)';
    let pendingResolve = null;
    let pendingReject = null;

    // 可修改欄位順序
    const editableFieldsOrder = [
        "ageInDays", "attribute", "aura", "realm","layer","cumulativeActionCount", "destiny", "name", "talent", "title",
        "fieldCount", "fieldLiStory", "ladderCount", "successRate"
    ];

    // attribute 下拉清單
    const attributeOptions = [
        "玄一道體", "太一道體", "乾一道體", "帝一道體", "天靈根", "玄天道體", "九霄道體", "吞天道體", "太玄道體",
        "風靈根", "空絮道體", "流霞道體", "風華道體", "空塵道體",
        "雷靈根", "雷煞道體", "罡雷道體", "紫霄道體", "煌雷道體",
        "冰靈根","寒晶道體", "凝雪道體", "寒魄道體", "霜華道體",
        "暗靈根","幽冥道體", "玄影道體", "幻魅道體", "玄幽道體",
        "金靈根","庚金道體", "鎏金道體", "鉑冕道體", "乾金道體",
        "木靈根","青木道體", "梧桐道體", "萬森道體", "荒木道體",
        "水靈根","淵水道體", "澄湖道體", "海嵐道體", "癸水道體",
        "火靈根","炎靈道體", "虹焰道體", "焚星道體", "炎陽道體",
        "土靈根","玄岩道體", "碧磐道體", "岱岳道體", "磐石道體",
        "九煉道體","破軍道體","至尊道體","天狼道體","九幽道體","霸天道體","天煞道體","孤星道體","巨神道體", "麒麟道體","貔貅道體","玄武道體",
        "血靈根", "劍靈根", "五色靈根", "月影靈根",
    ];

    // 圖片設定相關函數
    function showSettingModal() {
        const existingModal = document.getElementById('settingModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'settingModal';
        modal.innerHTML = `
            <div id="settingPanel">
                <h3>${config.modalTitle}</h3>
                <div class="form-row">
                    <label for="heightInput">高度 (px):</label>
                    <input type="number" id="heightInput" value="${currentHeight}" min="50" max="500">
                </div>
                <div class="form-row">
                    <label for="delayInput">監聽延遲 (秒):</label>
                    <input type="number" id="delayInput" value="${currentDelay}" min="1" max="60">
                </div>
                <div class="form-actions">
                    <button class="btn-secondary" id="cancelBtn">${config.cancelButtonText}</button>
                    <button class="btn-primary" id="applyBtn">${config.applyButtonText}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('applyBtn').addEventListener('click', applySettings);
        document.getElementById('cancelBtn').addEventListener('click', closeModal);
    }

    function applySettings() {
        const newHeight = parseInt(document.getElementById('heightInput').value);
        const newDelay = parseInt(document.getElementById('delayInput').value);

        if (newHeight >= 50 && newHeight <= 500 && newDelay >= 1 && newDelay <= 60) {
            currentHeight = newHeight;
            currentDelay = newDelay;
            GM_setValue('imageHeight', currentHeight);
            GM_setValue('observerDelay', currentDelay);
            modifyImageHeight();
            closeModal();
            console.log(`[UserScript] 設定已更新：高度 ${currentHeight}px，延遲 ${currentDelay} 秒`);
        } else {
            alert(`請輸入有效數值！（高度 50-500，延遲 1-60）`);
        }
    }

    function closeModal() {
        const modal = document.getElementById('settingModal');
        if (modal) modal.remove();
    }

    function modifyImageHeight() {
        const images = document.querySelectorAll(config.imageSelector);
        if (images.length) {
            images.forEach(img => {
                img.style.height = `${currentHeight}px`;
                img.style.width = 'auto';
            });
            return true;
        }
        return false;
    }

    // 資料修改器設定彈窗
    function showDataModifierSettings() {
        const existingModal = document.getElementById('dataModifierSettingsModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'dataModifierSettingsModal';
        modal.innerHTML = `
            <div id="dataModifierSettingsPanel">
                <h3>資料修改器設定</h3>
                <div class="form-row">
                    <label for="enableDataModifier">
                        <input type="checkbox" id="enableDataModifier" ${dataModifierEnabled ? 'checked' : ''}>
                        啟用資料修改器
                    </label>
                </div>
                <div class="warning-text">
                    <p><strong>⚠️ 免責聲明：</strong></p>
                    <p>• 使用資料修改器可能違反遊戲服務條款</p>
                    <p>• 可能導致帳號被封禁或遊戲資料異常</p>
                    <p>• 修改遊戲資料可能影響遊戲平衡性和公平性</p>
                    <p>• 使用此功能的一切後果由使用者自行承擔</p>
                    <p>• 開發者不對任何損失負責</p>
                    <p><strong> 💡 欄位皆是依照遊戲正常產生的值填入，如不修改也務必點擊送出 </strong> </p>
                </div>
                <div class="form-actions">
                    <button class="btn-secondary" id="cancelDataModifierBtn">${config.cancelButtonText}</button>
                    <button class="btn-primary" id="applyDataModifierBtn">${config.applyButtonText}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const checkbox = document.getElementById('enableDataModifier');

        document.getElementById('applyDataModifierBtn').addEventListener('click', () => {
            const newState = checkbox.checked;

            if (newState && !dataModifierEnabled) {
                // 第一次啟用時顯示責任警告
                if (confirm('⚠️ 重要警告 ⚠️\n\n您即將啟用資料修改器功能。\n\n請注意：\n• 此功能可能違反遊戲服務條款\n• 可能導致帳號被封禁\n• 可能造成遊戲資料損壞或異常\n• 影響遊戲公平性和其他玩家體驗\n• 一切使用後果由您自行承擔\n\n開發者對任何直接或間接的損失概不負責。\n\n確定要啟用此功能嗎？')) {
                    dataModifierEnabled = newState;
                    GM_setValue('dataModifierEnabled', dataModifierEnabled);
                    alert('✅ 資料修改器已啟用！\n當您進行遊戲操作時，系統會自動攔截並顯示修改介面。\n\n請謹慎使用，並隨時注意帳號安全！');
                }
            } else {
                dataModifierEnabled = newState;
                GM_setValue('dataModifierEnabled', dataModifierEnabled);
                if (dataModifierEnabled) {
                    alert('✅ 資料修改器已啟用！');
                } else {
                    alert('❌ 資料修改器已停用！');
                }
            }

            closeDataModifierSettings();
        });

        document.getElementById('cancelDataModifierBtn').addEventListener('click', closeDataModifierSettings);
    }

    function closeDataModifierSettings() {
        const modal = document.getElementById('dataModifierSettingsModal');
        if (modal) modal.remove();
    }
    function createDataModifyPanel(fieldsObj) {
        const existingModal = document.getElementById('dataModifyModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'dataModifyModal';
        modal.innerHTML = `
            <div id="dataModifyPanel">
                <h3>資料修改器 (F5以取消送出)</h3>
                <form id="firestore-edit-form">
                    ${editableFieldsOrder.map(key => {
                        if (!fieldsObj[key]) return '';

                        let inputHtml = '';
                        if (key === 'attribute') {
                            const options = attributeOptions.map(opt =>
                                `<option value="${opt}" ${fieldsObj[key].stringValue === opt ? 'selected' : ''}>${opt}</option>`
                            ).join('');
                            inputHtml = `<select name="${key}" class="form-input">${options}</select>`;
                        } else {
                            let value = '';
                            let type = 'text';
                            if (fieldsObj[key].hasOwnProperty('integerValue')) {
                                type = 'number';
                                value = fieldsObj[key].integerValue;
                            } else if (fieldsObj[key].hasOwnProperty('doubleValue')) {
                                type = 'number';
                                value = fieldsObj[key].doubleValue;
                            } else {
                                value = fieldsObj[key].stringValue || '';
                            }
                            inputHtml = `<input type="${type}" name="${key}" value="${value}" class="form-input">`;
                        }

                        return `
                            <div class="form-row">
                                <label for="${key}">${key}:</label>
                                ${inputHtml}
                            </div>
                        `;
                    }).join('')}
                </form>
                <div class="form-actions">
                    <button class="btn-primary" id="sendDataBtn">${config.sendButtonText}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('sendDataBtn').addEventListener('click', () => {
            const form = document.getElementById('firestore-edit-form');
            const newFields = { ...fieldsObj }; // 保留未修改欄位
            const formData = new FormData(form);

            for (const [key, value] of formData.entries()) {
                if (fieldsObj[key]) {
                    if (fieldsObj[key].hasOwnProperty('integerValue')) {
                        newFields[key] = { integerValue: value };
                    } else if (fieldsObj[key].hasOwnProperty('doubleValue')) {
                        newFields[key] = { doubleValue: value };
                    } else {
                        newFields[key] = { stringValue: value };
                    }
                }
            }

            modal.remove();
            pendingResolve && pendingResolve(newFields);
        });
    }

    function showDataModifyPanel(fieldsObj) {
        return new Promise((resolve, reject) => {
            pendingResolve = resolve;
            pendingReject = reject;
            createDataModifyPanel(fieldsObj);
        });
    }

    function addButtons() {
        if (document.getElementById('imageHeightSettingBtn')) return true;
        const placementTarget = document.querySelector(config.buttonPlacementSelector);
        if (placementTarget) {
            // 圖片設定按鈕
            const settingButton = document.createElement('button');
            settingButton.id = 'imageHeightSettingBtn';
            settingButton.textContent = config.buttonText;
            settingButton.addEventListener('click', showSettingModal);

            // 資料修改器說明按鈕（僅提示用途）
            const infoButton = document.createElement('button');
            infoButton.id = 'dataModifyInfoBtn';
            infoButton.textContent = config.modifyDataButtonText;
            infoButton.addEventListener('click', showDataModifierSettings);

            placementTarget.parentNode.insertBefore(settingButton, placementTarget);
            placementTarget.parentNode.insertBefore(infoButton, placementTarget);
            return true;
        }
        return false;
    }

    function initialize() {
        injectStyles();
        modifyImageHeight();
        addButtons();

        let stopTimeout;
        const observer = new MutationObserver(() => {
            modifyImageHeight();
            addButtons();
            clearTimeout(stopTimeout);
            stopTimeout = setTimeout(() => {
                observer.disconnect();
                console.log("[UserScript] 監聽已停止");
            }, currentDelay * 1000);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body, input, button, label, h3, select {
                font-family: Segoe UI, sans-serif;
            }
            #imageHeightSettingBtn, #dataModifyInfoBtn {
                background: #28a745; color: white; border: 1px solid #20c997; vertical-align: middle;
                border-radius: 0.375rem; padding: 0.375rem 0.75rem; cursor: pointer;
                font-size: 0.875rem; margin-right: 8px; transition: background-color 0.2s;
            }
            #dataModifyInfoBtn {
                background: #007bff; border-color: #0056b3;
            }
            #imageHeightSettingBtn:hover { background: #218838; }
            #dataModifyInfoBtn:hover { background: #0056b3; }
            #settingModal, #dataModifyModal, #dataModifierSettingsModal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.2); display: flex;
                justify-content: center; align-items: center; z-index: 10000;
            }
            #settingPanel, #dataModifyPanel, #dataModifierSettingsPanel {
                background: rgba(255, 255, 255, 0.8); border-radius: 8px; padding: 24px;
                min-width: 500px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                max-height: 80vh; overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.3);
                position: relative;
            }
            #dataModifyPanel {
                min-width: 700px;
            }
            #dataModifierSettingsPanel {
                min-width: 450px;
                max-width: 500px;
            }
            #settingPanel h3, #dataModifyPanel h3, #dataModifierSettingsPanel h3 {
                text-align: center; margin-bottom: 20px; color: #333;
            }
            .form-row {
                display: flex; align-items: center; margin-bottom: 14px;
            }
            .form-row label {
                flex: 0 0 220px; text-align: right; padding-right: 10px;
                font-weight: bold; font-size: 1rem; color: #333;
            }
            #dataModifierSettingsPanel .form-row label {
                flex: none; text-align: left; padding-right: 0;
                display: flex; align-items: center; cursor: pointer;
                justify-content: center; width: auto;
            }
            #dataModifierSettingsPanel .form-row label input[type="checkbox"] {
                margin-right: 8px;
            }
            .warning-text {
                background: rgba(255, 243, 205, 0.9); border: 1px solid #ffc107;
                border-radius: 4px; padding: 16px; margin: 16px 0;
                font-size: 0.85rem; line-height: 1.5; text-align: left;
            }
            .warning-text p {
                margin: 6px 0; color: #856404;
            }
            .warning-text p:first-child {
                margin-top: 0;
            }
            .warning-text p:last-child {
                margin-bottom: 0;
            }
            .form-row input, .form-row select {
                flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;
                font-size: 0.9rem;
            }
            .form-input {
                flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;
                font-size: 0.9rem;
            }
            .form-actions {
                display: flex; justify-content: center; gap: 12px; margin-top: 20px;
            }
            .btn-primary {
                background: #007bff; color: white; border: none; padding: 8px 16px;
                border-radius: 4px; font-size: 0.9rem; cursor: pointer; transition: background-color 0.2s;
            }
            .btn-primary:hover { background: #0056b3; }
            .btn-secondary {
                background: #6c757d; color: white; border: none; padding: 8px 16px;
                border-radius: 4px; font-size: 0.9rem; cursor: pointer; transition: background-color 0.2s;
            }
            .btn-secondary:hover { background: #545b62; }
        `;
        document.head.appendChild(style);
    }

    // 攔截 fetch 請求
    unsafeWindow.fetch = async function (input, init) {
        let requestUrl, method, bodyStr;

        if (typeof input === 'string') {
            requestUrl = input;
            method = init?.method || 'GET';
            bodyStr = init?.body;
        } else {
            requestUrl = input.url;
            method = input.method;
            bodyStr = await input.clone().text();
        }

        if (requestUrl.includes(targetApiUrl) && method.toUpperCase() === 'POST') {
            if (typeof bodyStr === 'string' && bodyStr.includes('req0___data__=')) {
                try {
                    const params = new URLSearchParams(bodyStr);

                    if (params.has('req0___data__')) {
                        const rawJson = params.get('req0___data__');
                        const dataObj = JSON.parse(rawJson);

                        // 篩選只處理遊戲資料，並檢查修改器是否啟用
                        if (!dataModifierEnabled || !dataObj.writes?.[0]?.update?.fields?.actionTimeStamp) {
                            return originalFetch.apply(this, arguments);
                        }

                        console.log("遊戲原始資料", dataObj.writes?.[0]?.update?.fields);
                        const fields = dataObj.writes[0].update.fields;
                        const newFields = await showDataModifyPanel(fields);

                        dataObj.writes[0].update.fields = newFields;
                        params.set('req0___data__', JSON.stringify(dataObj));
                        const newBody = params.toString();

                        if (typeof input === 'string') {
                            init.body = newBody;
                            return originalFetch.call(this, input, init);
                        } else {
                            const newReq = new Request(input, { body: newBody, method });
                            return originalFetch.call(this, newReq);
                        }
                    }
                } catch (e) {
                    console.warn("[油猴腳本] 修改 Firestore 請求資料時出錯：", e);
                }
            }
        }

        return originalFetch.apply(this, arguments);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();