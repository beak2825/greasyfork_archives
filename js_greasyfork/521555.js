// ==UserScript==
// @name         纪念币预约-自动填充
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动填充网页中的姓名、身份证号和手机号，支持多组数据，此项目为piplong二开，原作者：上仙社区VX：Sxian00001
// @author       piplong 二开版
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521555/%E7%BA%AA%E5%BF%B5%E5%B8%81%E9%A2%84%E7%BA%A6-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/521555/%E7%BA%AA%E5%BF%B5%E5%B8%81%E9%A2%84%E7%BA%A6-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const toggleFloatingWindowButton = document.createElement('button');
    toggleFloatingWindowButton.className = 'autofill-button';
    toggleFloatingWindowButton.textContent = '悬浮窗开关';
    toggleFloatingWindowButton.style.position = 'fixed';
    toggleFloatingWindowButton.style.bottom = '60px';
    toggleFloatingWindowButton.style.right = '10px';
    toggleFloatingWindowButton.style.zIndex = '1001';
    toggleFloatingWindowButton.style.padding = '10px';
    toggleFloatingWindowButton.style.background = 'linear-gradient(to right, #228B22, #66CDAA)';
    toggleFloatingWindowButton.style.color = '#fff';
    toggleFloatingWindowButton.style.border = 'none';
    toggleFloatingWindowButton.style.borderRadius = '5px';
    toggleFloatingWindowButton.style.cursor = 'pointer';

    toggleFloatingWindowButton.addEventListener('click', () => {
        const autofillButtons = document.querySelector('.autofill-buttons');
        if (autofillButtons) {
            autofillButtons.style.display = autofillButtons.style.display === 'none' ? 'flex' : 'none';
        }
    });

    document.body.appendChild(toggleFloatingWindowButton);


    const donateButton = document.createElement('button');
    donateButton.style.display = 'none';
    donateButton.className = 'autofill-button';
    donateButton.textContent = '';
    donateButton.style.position = 'fixed';
    donateButton.style.bottom = '110px';
    donateButton.style.right = '10px';
    donateButton.style.zIndex = '1001';
    donateButton.style.padding = '10px';
    donateButton.style.background = 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)';
    donateButton.style.color = '#fff';
    donateButton.style.border = 'none';
    donateButton.style.borderRadius = '5px';
    donateButton.style.cursor = 'pointer';
    donateButton.style.backgroundSize = '400% 100%';
    donateButton.style.animation = 'rainbowBackground 5s linear infinite';

    donateButton.addEventListener('click', () => {
        createAnnouncement();
    });

    document.body.appendChild(donateButton);

    var floatButton = document.createElement('button');
    floatButton.innerHTML = '点击获取验证码';
    floatButton.style.position = 'fixed';
    floatButton.style.bottom = '10px';
    floatButton.style.right = '10px';
    floatButton.style.zIndex = '1000';
    floatButton.style.padding = '10px';
    floatButton.style.backgroundColor = '#f00';
    floatButton.style.color = '#fff';
    floatButton.style.border = 'none';
    floatButton.style.borderRadius = '5px';
    floatButton.style.cursor = 'pointer';

    document.body.appendChild(floatButton);


    floatButton.addEventListener('click', function() {

        var selectors = [
            '.free_get ml20 next',//建设
            '#free_get ml20 next',//建设
            'free_get ml20 next',//建设
            '.to_code',//建设
            'to_code',//建设
            '#to_code',//建设
            'btn-submit',//农业
            '.btn-submit',//农业
            '#btn-submit',//农业
            'forCashInfor_fillbtn',
            '.forCashInfor_fillbtn',//中国银行
            '#forCashInfor_fillbtn',//中国银行
            'link4Verifyimage2Name',//gs
            '.link4Verifyimage2Name',//gs
            '#link4Verifyimage2Name',//gs
            '.el-button.el-button--text.append-text'
        ];

        // 遍历选择器列表，查找并点击按钮
        selectors.forEach(function(selector) {
            var buttons = document.querySelectorAll(selector);
            buttons.forEach(function(button) {
                button.click();
                console.log('按钮已点击: ' + selector);
            });
        });
    });

    // 添加样式
    GM_addStyle(`
    .autofill-settings {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        z-index: 10001;
        display: none;
        max-width: 90vw;
        width: 50%;
        max-height: 80vh;
        overflow-y: auto;
    }
    .autofill-settings::-webkit-scrollbar {
        width: 8px;
    }
    .autofill-settings::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    .autofill-settings::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }
    .autofill-settings::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    .autofill-settings h2 {
        margin-top: 0;
        margin-bottom: 20px;
        color: #333;
        position: sticky;
        top: 0;
        background: white;
        padding: 10px 0;
        z-index: 1;
    }
    .autofill-settings .grid-container {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
    }
    .autofill-settings .group {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: #f9f9f9;
    }
    .autofill-settings .group h3 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #444;
        font-size: 14px;
    }
    .autofill-settings label {
        display: block;
        margin-bottom: 5px;
        color: #666;
        font-size: 12px;
    }
    .autofill-settings input {
        width: calc(80%);
        padding: 6px;
        margin-bottom: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 12px;
    }
    .autofill-settings input:focus {
        border-color: #4CAF50;
        outline: none;
        box-shadow: 0 0 3px rgba(76, 175, 80, 0.3);
    }
    .autofill-settings .buttons {
        text-align: right;
        margin-top: 15px;
        position: sticky;
        bottom: 0;
        background: white;
        padding: 10px 0;
        border-top: 1px solid #eee;
    }
    .autofill-settings button {
        padding: 8px 20px;
        margin-left: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;
    }
    .autofill-settings .save {
        background: #4CAF50;
        color: white;
    }
    .autofill-settings .save:hover {
        background: #45a049;
    }
    .autofill-settings .cancel {
        background: #f44336;
        color: white;
    }
    .autofill-settings .cancel:hover {
        background: #da190b;
    }
    .autofill-buttons {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .autofill-button {
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: background-color 0.3s;
    }
    .autofill-button:hover {
        background-color: #45a049;
    }
    .settings-button {
        background-color: #2196F3 !important;
    }
    .settings-button:hover {
        background-color: #1976D2 !important;
    }
    `);


    const defaultData = {
        groups: Array.from({ length: 10 }, () => ({
            name: '',
            idCard: '',
            phone: '',
            bankBranch: '',
            reservationAmount: '',
            note: ''
        }))
    };


    let savedData = GM_getValue('autofillData', defaultData);


    function createSettingsPanel() {
    const panel = document.createElement('div');
    panel.className = 'autofill-settings';
    panel.style.display = 'none'; // 默认隐藏

    let html = `
    <style>
    .autofill-settings {
        display: flex; /* 确保是左右布局 */
        max-width: 90vw;
        max-height: 80vh;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        padding: 20px;
        z-index: 10001;
    }

    .left-panel {
        flex: 1;
        padding-right: 20px;
        border-right: 1px solid #ccc;
        overflow-y: auto;
    }

    .right-panel {
        flex: 2;
        padding-left: 20px;
        transition: max-height 0.3s ease-in-out;
        overflow-y: auto;
    }

    .group-title {
        cursor: pointer;
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .footer-note {
        font-size: 12px;
        color: #666;
        text-align: center;
        margin-top: 20px;
    }

    .notification {
        display: none;
        color: green;
        margin-top: 10px;
    }
    </style>

    <div class="left-panel">
        <h3 style="display: flex; justify-content: space-between; align-items: center;">
            数据组
            <div>
                <button class="cancel">关闭</button>
                <button class="save">保存</button>
            </div>
        </h3>
    `;

    // 创建组标题和展开图标
    savedData.groups.forEach((group, index) => {
        html += `
            <div class="group-title" data-index="${index}">
                <span>第 ${index + 1} 组数据</span>
                <span class="expand-icon">🐍</span>
            </div>
        `;
    });

    html += `
        <div class="footer-note">PS：修改备注或添加信息保存后，需刷新页面才可以显示最新状态</div>
        <div class="notification">保存成功！</div>
        </div>
        <div class="right-panel">
            <h3>请选择左侧的组进行编辑</h3>
        </div>
    `;

    panel.innerHTML = html;
    document.body.appendChild(panel);

    // 获取左侧的所有组标题
    const groupTitles = panel.querySelectorAll('.group-title');
    const rightPanel = panel.querySelector('.right-panel');
    const notification = panel.querySelector('.notification');

    groupTitles.forEach(title => {
        title.addEventListener('click', () => {
            const index = Number(title.dataset.index);

            // 显示右侧面板
            rightPanel.innerHTML = `
                <h3>编辑 第 ${index + 1} 组数据</h3>
                <label>姓名：</label>
                <input type="text" class="name-input" data-group="${index}" value="${savedData.groups[index].name}">
                <label>身份证号：</label>
                <input type="text" class="idcard-input" data-group="${index}" value="${savedData.groups[index].idCard}">
                <label>手机号：</label>
                <input type="text" class="phone-input" data-group="${index}" value="${savedData.groups[index].phone}">
                <label>银行网点：</label>
                <input type="text" class="branch-input" data-group="${index}" value="${savedData.groups[index].bankBranch}">
                <label>预约数量：</label>
                <input type="text" class="amount-input" data-group="${index}" value="${savedData.groups[index].reservationAmount}" placeholder="视银行而定">
                <label>备注：</label>
                <input type="text" class="note-input" data-group="${index}" value="${savedData.groups[index].note}" placeholder="填充按钮重命名，用于辨识分组信息，可不填">
            `;
        });
    });

    // 保存按钮
    panel.querySelector('.save').addEventListener('click', () => {
        const groupCount = savedData.groups.length;

        // 遍历所有组，更新数据
        for (let i = 0; i < groupCount; i++) {
            const nameInput = panel.querySelector(`.name-input[data-group="${i}"]`);
            const idCardInput = panel.querySelector(`.idcard-input[data-group="${i}"]`);
            const phoneInput = panel.querySelector(`.phone-input[data-group="${i}"]`);
            const branchInput = panel.querySelector(`.branch-input[data-group="${i}"]`);
            const amountInput = panel.querySelector(`.amount-input[data-group="${i}"]`);
            const noteInput = panel.querySelector(`.note-input[data-group="${i}"]`);

            // 更新对应组的数据
            savedData.groups[i] = {
                name: nameInput ? nameInput.value : savedData.groups[i].name,
                idCard: idCardInput ? idCardInput.value : savedData.groups[i].idCard,
                phone: phoneInput ? phoneInput.value : savedData.groups[i].phone,
                bankBranch: branchInput ? branchInput.value : savedData.groups[i].bankBranch,
                reservationAmount: amountInput ? amountInput.value : savedData.groups[i].reservationAmount,
                note: noteInput ? noteInput.value : savedData.groups[i].note
            };
        }

        GM_setValue('autofillData', savedData);

        console.log(savedData);
        alert("保存成功！别忘了刷新页面哦~");

        panel.style.display = 'none';
    });

    // 关闭按钮
    panel.querySelector('.cancel').addEventListener('click', () => {
        panel.style.display = 'none';
    });

    return panel;
}





    function autoFillForm(groupIndex) {
        const personalInfo = savedData.groups[groupIndex];


        const nameInputs = document.querySelectorAll('input[type="text"]');
        nameInputs.forEach(input => {
            const inputId = (input.id || '').toLowerCase();
            const inputName = (input.name || '').toLowerCase();
            const inputPlaceholder = (input.placeholder || '').toLowerCase();
            const inputLabel = input.labels && input.labels[0] ? input.labels[0].textContent.toLowerCase() : '';

            if (
                inputId.includes('name') ||
                inputName.includes('name') ||
                inputId.includes('oppAcNme') ||
                inputName.includes('oppAcNme') ||
                inputId.includes('usr_nm') ||
                inputName.includes('usr_nm') ||
                inputPlaceholder.includes('姓名') ||
                inputPlaceholder.includes('name') ||
                inputId.includes('客户') ||
                inputName.includes('客户') ||
                inputPlaceholder.includes('客户') ||
                inputLabel.includes('姓名') ||
                inputLabel.includes('客户') ||
                inputId.includes('username') ||
                inputName.includes('username') ||
                inputId.includes('fullname') ||
                inputName.includes('fullname') ||
                inputId.includes('realname') ||
                inputName.includes('realname') ||
                inputPlaceholder.includes('真实姓名') ||
                inputLabel.includes('真实姓名') ||
                inputId.includes('客户姓名') ||
                inputName.includes('客户姓名') ||
                inputPlaceholder.includes('客户姓名') ||
                inputLabel.includes('客户姓名') ||
                (inputId.includes('客户') && inputId.includes('姓名')) ||
                (inputName.includes('客户') && inputName.includes('姓名')) ||
                (inputPlaceholder.includes('客户') && inputPlaceholder.includes('姓名'))
            ) {
                input.value = personalInfo.name;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        const idInputs = document.querySelectorAll('input');
        idInputs.forEach(input => {
            const inputId = (input.id || '').toLowerCase();
            const inputName = (input.name || '').toLowerCase();
            const inputPlaceholder = (input.placeholder || '').toLowerCase();
            const inputLabel = input.labels && input.labels[0] ? input.labels[0].textContent.toLowerCase() : '';

            if (
                inputId.includes('id') ||
                inputName.includes('id') ||
                inputId.includes('credNumTemp') ||
                inputName.includes('credNumTemp') ||
                inputId.includes('.credNumTemp') ||
                inputName.includes('.credNumTemp') ||
                inputId.includes('#credNumTemp') ||
                inputName.includes('#credNumTemp') ||
                inputId.includes('证件号码') ||
                inputName.includes('证件号码') ||
                inputId.includes('hidden') ||
                inputName.includes('hidden') ||
                inputId.includes('credNumTemp1') ||
                inputName.includes('credNumTemp1') ||
                inputId.includes('crdt_no') ||
                inputName.includes('crdt_no') ||
                inputPlaceholder.includes('身份证') ||
                inputPlaceholder.includes('证件') ||
                inputPlaceholder.includes('证件号码') ||
                inputPlaceholder.includes('证件号码') ||
                inputPlaceholder.includes('credNumTemp') ||
                inputPlaceholder.includes('credNumTemp') ||
                inputLabel.includes('身份证') ||
                inputLabel.includes('证件号') ||
                inputLabel.includes('证件号码') ||
                inputLabel.includes('证件号码') ||
                inputLabel.includes('credNumTemp') ||
                inputLabel.includes('credNumTemp') ||
                inputId.includes('idcard') ||
                inputName.includes('idcard') ||
                inputId.includes('idnumber') ||
                inputName.includes('idnumber')
            ) {
                input.value = personalInfo.idCard;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });


        const phoneInputs = document.querySelectorAll('input[type="tel"], input[type="text"], input[type="number"]');
        phoneInputs.forEach(input => {
            const inputId = (input.id || '').toLowerCase();
            const inputName = (input.name || '').toLowerCase();
            const inputPlaceholder = (input.placeholder || '').toLowerCase();
            const inputLabel = input.labels && input.labels[0] ? input.labels[0].textContent.toLowerCase() : '';

            if (
                inputId.includes('phone') ||
                inputId.includes('mobile') ||
                inputName.includes('phone') ||
                inputName.includes('mobile') ||
                inputId.includes('secure-input-plain-phone') ||
                inputName.includes('secure-input-plain-phone') ||
                inputId.includes('el-form-item__content') ||
                inputName.includes('el-form-item__content') ||
                inputId.includes('el-form-item') ||
                inputName.includes('el-form-item') ||
                inputId.includes('safe-input') ||
                inputName.includes('safe-input') ||
                inputId.includes('mblph_no') ||
                inputName.includes('mblph_no') ||
                inputPlaceholder.includes('手机') ||
                inputPlaceholder.includes('电话') ||
                inputLabel.includes('手机') ||
                inputLabel.includes('电话') ||
                inputId.includes('tel') ||
                inputName.includes('tel') ||
                inputPlaceholder.includes('联系方式') ||
                inputId.includes('cellphone') ||
                inputName.includes('cellphone') ||
                inputId.includes('telephone') ||
                inputName.includes('telephone') ||
                inputPlaceholder.includes('手机号码') ||
                inputPlaceholder.includes('手机号') ||
                inputLabel.includes('手机号码') ||
                inputLabel.includes('手机号') ||
                inputPlaceholder.includes('联系电话') ||
                inputLabel.includes('联系电话') ||
                inputId.includes('客户手机') ||
                inputName.includes('客户手机') ||
                inputPlaceholder.includes('客户手机') ||
                inputLabel.includes('客户手机') ||
                (inputId.includes('客户') && (inputId.includes('手机') || inputId.includes('电话'))) ||
                (inputName.includes('客户') && (inputName.includes('手机') || inputName.includes('电话'))) ||
                (inputPlaceholder.includes('客户') && (inputPlaceholder.includes('手机') || inputPlaceholder.includes('电话'))) ||
                (inputLabel.includes('客户') && (inputLabel.includes('手机') || inputLabel.includes('电话'))) ||
                inputPlaceholder.includes('移动电话') ||
                inputLabel.includes('移动电话') ||
                inputId.includes('联系人手机') ||
                inputName.includes('联系人手机') ||
                inputPlaceholder.includes('联系人手机') ||
                inputLabel.includes('联系人手机')
            ) {
                input.value = personalInfo.phone;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });


        const branchInputs = document.querySelectorAll('input[type="text"], select');
        branchInputs.forEach(input => {
            const inputId = (input.id || '').toLowerCase();
            const inputName = (input.name || '').toLowerCase();
            const inputPlaceholder = (input.placeholder || '').toLowerCase();
            const inputLabel = input.labels && input.labels[0] ? input.labels[0].textContent.toLowerCase() : '';

            if (
                inputId.includes('branch') ||
                inputName.includes('branch') ||
                inputPlaceholder.includes('网点') ||
                inputLabel.includes('网点') ||
                inputId.includes('bank') ||
                inputName.includes('bank') ||
                inputPlaceholder.includes('银行') ||
                inputLabel.includes('银行') ||
                inputId.includes('兑换') ||
                inputName.includes('兑换') ||
                inputPlaceholder.includes('兑换') ||
                inputLabel.includes('兑换') ||
                inputId.includes('领取') ||
                inputName.includes('领取') ||
                inputPlaceholder.includes('领取') ||
                inputLabel.includes('领取') ||
                inputId.includes('选择') ||
                inputName.includes('选择') ||
                inputPlaceholder.includes('选择') ||
                inputLabel.includes('选择')
            ) {
                if (input.tagName.toLowerCase() === 'select') {

                    const options = input.querySelectorAll('option');
                    options.forEach(option => {
                        if (option.textContent.includes(personalInfo.bankBranch)) {
                            option.selected = true;
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    });
                } else {

                    input.value = personalInfo.bankBranch;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });

        const amountInputs = document.querySelectorAll('input[type="number"], input[type="text"]');
        amountInputs.forEach(input => {
            const inputId = (input.id || '').toLowerCase();
            const inputName = (input.name || '').toLowerCase();
            const inputPlaceholder = (input.placeholder || '').toLowerCase();
            const inputLabel = input.labels && input.labels[0] ? input.labels[0].textContent.toLowerCase() : '';

            if (
                inputId.includes('amount') ||
                inputName.includes('amount') ||
                inputPlaceholder.includes('数量') ||
                inputLabel.includes('数量') ||
                inputId.includes('预约') ||
                inputName.includes('预约') ||
                inputPlaceholder.includes('预约') ||
                inputLabel.includes('预约') ||
                inputId.includes('兑换') ||
                inputName.includes('兑换') ||
                inputPlaceholder.includes('兑换') ||
                inputLabel.includes('兑换')
            ) {
                input.value = personalInfo.reservationAmount;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }





    function createButtons() {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'autofill-buttons';

    savedData.groups.forEach((group, index) => {
        if (group.name.trim() !== '') {
            const button = document.createElement('button');
            button.className = 'autofill-button';
            const note = group.note;
            button.textContent = note ? note : `填充第 ${index + 1} 组`;
            button.style.background = 'linear-gradient(to right, #228B22, #66CDAA)';
            button.addEventListener('click', () => {
                autoFillForm(index);
                button.textContent = note ? note : `已填充第 ${index + 1} 组`;
                setTimeout(() => {
                    button.textContent = note ? note : `填充第 ${index + 1} 组`;
                }, 1000);
            });
            buttonsContainer.appendChild(button);
        }
    });

    const settingsButton = document.createElement('button');
    settingsButton.className = 'autofill-button settings-button';
    settingsButton.textContent = '自动填充设置';
    settingsButton.style.background = 'linear-gradient(to right, #1E90FF, #00BFFF)';
    settingsButton.addEventListener('click', () => {
        const panel = document.querySelector('.autofill-settings');
        panel.style.display = 'flex'; // 确保以 flex 布局显示
    });
    buttonsContainer.appendChild(settingsButton);

    document.body.appendChild(buttonsContainer);

    // 创建设置面板并默认隐藏
    createSettingsPanel();
}


    function init() {
        const settingsPanel = createSettingsPanel();
        createButtons();

        const hasShownAnnouncement = GM_getValue('hasShownAnnouncement', false);

        if (!hasShownAnnouncement) {
            createAnnouncement();
            GM_setValue('hasShownAnnouncement', true);
        }


    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();