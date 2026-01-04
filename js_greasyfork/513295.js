// ==UserScript==
// @name         Temu调价批量选择拒绝
// @namespace    http://tampermonkey.net/
// @version      6.3
// @description  自动选择所有“我不接受”选项，并勾选“我已知晓风险”复选框，支持自动提交
// @author       Lemon Allen
// @match        *://*.kuajingmaihuo.com/*
// @match        *://*.temu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513295/Temu%E8%B0%83%E4%BB%B7%E6%89%B9%E9%87%8F%E9%80%89%E6%8B%A9%E6%8B%92%E7%BB%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/513295/Temu%E8%B0%83%E4%BB%B7%E6%89%B9%E9%87%8F%E9%80%89%E6%8B%A9%E6%8B%92%E7%BB%9D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const popupClassList = ['MDL_innerWrapper_5-118-0', 'MDL_innerWrapper_5-119-0', 'MDL_innerWrapper_5-120-1'];
    const textWrapperClassList = ['RD_textWrapper_5-118-0', 'RD_textWrapper_5-120-1'];
    let scriptRunning = true;

    function addButton() {
        const checkAndAddButton = () => {
            const popups = document.querySelectorAll(popupClassList.map(cls => `.${cls}`).join(', '));
            popups.forEach(popup => {
                const { offsetWidth: width, offsetHeight: height } = popup;
                const isValidSize = ((width > 1250 && width < 1350) || (width > 1000 && width < 1100)) || (width === 1000);
                if (isValidSize) {
                    if (!popup.querySelector('#batchRejectButton')) {
                        const button = document.createElement('button');
                        button.id = 'batchRejectButton';
                        button.textContent = '批量选择拒绝';
                        Object.assign(button.style, {
                            position: 'absolute',
                            top: '20px',
                            right: '120px',
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            zIndex: '9999',
                            fontSize: '16px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'background-color 0.2s, box-shadow 0.2s'
                        });

                        popup.style.position = 'relative';
                        popup.appendChild(button);

                        let isScriptRunning = false;
                        const updateButtonState = () => {
                            button.textContent = isScriptRunning ? '停止脚本' : '批量选择拒绝';
                            button.style.backgroundColor = isScriptRunning ? '#dc3545' : '#007bff';
                        };

                        button.addEventListener('click', () => {
                            isScriptRunning = !isScriptRunning;
                            updateButtonState();
                            scriptRunning = isScriptRunning;
                            if (isScriptRunning) handleBatchReject();
                        });

                        button.addEventListener('mousedown', () => button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.4)');
                        button.addEventListener('mouseup', () => button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)');
                        button.addEventListener('mouseout', () => button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)');

                        updateButtonState();
                    }
                }
            });
        };

        checkAndAddButton();
        const observer = new MutationObserver(() => checkAndAddButton());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function selectOptionByText(optionText) {
        const labels = document.querySelectorAll('label');
        labels.forEach(label => {
            for (const textWrapperClass of textWrapperClassList) {
                const textElement = label.querySelector(`.${textWrapperClass}`);
                if (textElement && textElement.textContent.trim() === optionText) {
                    const input = label.querySelector('input[type="radio"]');
                    if (input && !input.disabled) {
                        label.click();
                        console.log('已选择:', optionText);
                        return;
                    }
                }
            }
        });
    }

    function simulateEnterKey() {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, which: 13, bubbles: true }));
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, which: 13, bubbles: true }));
        console.log('已模拟回车键');
    }

    function checkForConfirmation() {
        const buttons = document.querySelectorAll('button');
        let found = false;
        buttons.forEach(button => {
            const text = button.textContent.trim();
            if (text === '确认，放弃高优权益' || text === '放弃参与活动') {
                found = true;
            }
        });
        if (!found) {
            handleBatchReject();
        } else {
            scriptRunning = false;
            console.log('确认按钮检测到，脚本停止');
        }
    }

    function handleBatchReject() {
        if (!scriptRunning) return;

        ['我不接受', '放弃活动', '放弃', '不参与活动，放弃权益', '不调整', '降价，为流量助力']
            .forEach(text => selectOptionByText(text));

        setTimeout(() => {
            const buttons = document.querySelectorAll('button');
            let found = false;

            buttons.forEach(button => {
                const text = button.textContent.trim();
                if (text === '确认' || text === '拒绝接受价格调整建议') {

                    // 自动点击“我已知晓风险”复选框并模拟回车
                    const acknowledgeDiv = document.querySelector('.CBX_textWrapper_5-120-1.CBX_prevCheckSquare_5-120-1');
                    if (acknowledgeDiv) {
                        acknowledgeDiv.click();
                        console.log('已点击：我已知晓风险，本次不再提醒');
                        simulateEnterKey();
                    }

                    const modalCandidates = [
                        { selector: '.PT_portalMain_5-120-1.PP_popoverMain_5-120-1', width: 408, height: 150 },
                        { selector: '.PT_outerWrapper_5-120-1.PP_outerWrapper_5-120-1.PT_popover_5-120-1.PT_portalBottom_5-120-1.PT_portalWithArrow_5-120-1.PT_inCustom_5-120-1.PP_popover_5-120-1', width: 408 },
                        { selector: '.PT_outerWrapper_5-120-1.PP_outerWrapper_5-120-1.PT_popover_5-120-1.PT_portalTop_5-120-1.PT_portalWithArrow_5-120-1.PT_inCustom_5-120-1.PP_popover_5-120-1', width: 364 }
                    ];

                    for (const { selector, width, height } of modalCandidates) {
                        const modal = button.closest(selector);
                        if (modal) {
                            const w = modal.offsetWidth;
                            const h = modal.offsetHeight;
                            if (w === width && (height === undefined || h === height)) {
                                button.click();
                                console.log('已点击按钮:', text);
                                found = true;
                                break;
                            }
                        }
                    }
                }
            });

            if (!found) console.log('未点击任何确认按钮');
            checkForConfirmation();
        }, 1000);
    }

    addButton();
})();
