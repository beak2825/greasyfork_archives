// ==UserScript==
// @name         快捷输入助手 for DIC Music Reports
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在报告页面的"说明 (必填):"输入框上方添加快捷输入按钮，可自定义按钮和文本。
// @author       Your Name (You can change this)
// @match        https://dicmusic.com/reportsv2.php?action=report&id=*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/540468/%E5%BF%AB%E6%8D%B7%E8%BE%93%E5%85%A5%E5%8A%A9%E6%89%8B%20for%20DIC%20Music%20Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/540468/%E5%BF%AB%E6%8D%B7%E8%BE%93%E5%85%A5%E5%8A%A9%E6%89%8B%20for%20DIC%20Music%20Reports.meta.js
// ==/UserScript==

/* globals $, GM_setValue, GM_getValue, GM_addStyle, GM_registerMenuCommand */

(function() {
    'use strict';

    const MAX_BUTTONS = 50;
    const BUTTON_CONFIG_KEY = 'dicmusic_quick_input_buttons';
    const SCRIPT_BUTTON_CONTAINER_ID = 'quick-input-buttons-container'; // ID for the div holding buttons
    const SCRIPT_BUTTON_TR_ID = 'quick-input-buttons-tr'; // ID for the TR holding the button container
    const SETTINGS_MODAL_ID = 'quick-input-settings-modal';

    const defaultButtons = [
        { name: '格式错误', text: '种子格式不符合规则，具体说明：' },
        { name: '信息不全', text: '种子信息描述不完整或有误，具体说明：' }
    ];

    let buttonsConfig = GM_getValue(BUTTON_CONFIG_KEY, defaultButtons);

    function addGlobalStyles() {
        GM_addStyle(`
            /* Div that holds all buttons */
            #${SCRIPT_BUTTON_CONTAINER_ID} {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                align-items: center;
                gap: 6px;
                margin-bottom: 10px; /* Applies if in fallback mode */
            }
            /* The Table Cell that will contain the button div, if placed in table */
            #${SCRIPT_BUTTON_TR_ID} td {
                padding-bottom: 10px; /* Space below button bar */
                border: none;
            }
            #${SCRIPT_BUTTON_CONTAINER_ID} button {
                background-color: #f0f0f0; border: 1px solid #bbb; color: #333;
                padding: 5px 10px; border-radius: 3px; cursor: pointer;
                font-size: 0.9em; line-height: 1.2; white-space: nowrap;
            }
            #${SCRIPT_BUTTON_CONTAINER_ID} button:hover { background-color: #e0e0e0; border-color: #999; }
            #${SCRIPT_BUTTON_CONTAINER_ID} .settings-cog-btn { padding: 5px 8px; font-size: 1em; }
            #${SETTINGS_MODAL_ID} {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background-color: white; border: 1px solid #ccc; padding: 20px;
                z-index: 10001; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                width: 500px; max-height: 80vh; overflow-y: auto; font-size: 14px;
            }
            #${SETTINGS_MODAL_ID} h3 { margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            #${SETTINGS_MODAL_ID} .button-entry { display: flex; margin-bottom: 10px; align-items: center; }
            #${SETTINGS_MODAL_ID} .button-entry input[type="text"] {
                flex-grow: 1; margin-right: 10px; padding: 6px;
                border: 1px solid #ccc; border-radius: 3px;
            }
            #${SETTINGS_MODAL_ID} .button-entry input[name="btn-name"] { max-width: 120px; }
            #${SETTINGS_MODAL_ID} .action-buttons button, #${SETTINGS_MODAL_ID} .button-entry button {
                padding: 6px 12px; background-color: #5cb85c; color: white;
                border: none; border-radius: 3px; cursor: pointer; margin-left: 5px;
            }
            #${SETTINGS_MODAL_ID} .button-entry .remove-btn { background-color: #d9534f; }
            #${SETTINGS_MODAL_ID} .action-buttons button:hover, #${SETTINGS_MODAL_ID} .button-entry button:hover { opacity: 0.9; }
            #${SETTINGS_MODAL_ID} .action-buttons { margin-top: 20px; text-align: right; }
            #${SETTINGS_MODAL_ID} #add-button-row { background-color: #4682B4; }
            .settings-modal-backdrop {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0,0,0,0.5); z-index: 10000;
            }
        `);
    }

    function findCommentsLabelAndTextarea() {
        const dynamicForm = $('#dynamic_form');
        if (!dynamicForm.length) return null;
        let commentsLabelTd = null;
        dynamicForm.find('table.layout td.label').each(function() {
            if ($(this).text().includes('说明')) {
                commentsLabelTd = $(this);
                return false;
            }
        });
        if (!commentsLabelTd || !commentsLabelTd.length) return null;
        const textarea = commentsLabelTd.next('td').find('textarea');
        if (!textarea.length) return null;
        return { labelTd: commentsLabelTd, textarea: textarea };
    }

    function insertTextIntoTextarea(textToInsert) {
        const elements = findCommentsLabelAndTextarea();
        if (elements && elements.textarea) {
            const textarea = elements.textarea[0];
            const currentText = textarea.value;
            if (currentText.length > 0 && !currentText.endsWith('\n')) {
                textarea.value += '\n' + textToInsert;
            } else {
                textarea.value += textToInsert;
            }
            textarea.focus();
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.warn("QuickInputHelper: Textarea not found for insertion.");
        }
    }

    function createButtonElement(config) {
        const button = $('<button type="button"></button>');
        button.text(config.name);
        button.attr('title', `点击插入: "${config.text}"`);
        button.on('click', function() {
            insertTextIntoTextarea(config.text);
        });
        return button;
    }

    function renderButtons() {
        // Only remove elements specifically created by this script
        $(`#${SCRIPT_BUTTON_TR_ID}`).remove(); // Removes the TR if it exists
        $(`#${SCRIPT_BUTTON_CONTAINER_ID}`).remove(); // Removes the div if it exists (e.g. from fallback)

        const $buttonHostDiv = $(`<div id="${SCRIPT_BUTTON_CONTAINER_ID}"></div>`);
        const $settingsButton = $('<button type="button" class="settings-cog-btn" title="设置快捷输入按钮"><i class="fas fa-cog"></i></button>');
        $settingsButton.on('click', openSettingsPanel);
        $buttonHostDiv.append($settingsButton);
        buttonsConfig.forEach(config => {
            $buttonHostDiv.append(createButtonElement(config));
        });

        const elements = findCommentsLabelAndTextarea();
        if (elements && elements.labelTd) {
            const $parentTR = elements.labelTd.closest('tr');
            if ($parentTR.length) {
                let colspan = $parentTR.children('td').length;
                if (colspan === 0 && $parentTR.parent().children('tr:first-child').length) {
                     colspan = $parentTR.parent().children('tr:first-child').children('td').length;
                }
                if (colspan < 1) colspan = 1;

                const $containerTR = $(`<tr id="${SCRIPT_BUTTON_TR_ID}"><td colspan="${colspan}"></td></tr>`);
                $containerTR.children('td').append($buttonHostDiv);
                $parentTR.before($containerTR);
                return;
            }
        }

        const $dynamicForm = $('#dynamic_form');
        if ($dynamicForm.length) {
            $dynamicForm.prepend($buttonHostDiv);
        } else {
            const $reportForm = $('form[name="report"]');
            if ($reportForm.length) {
                $reportForm.prepend($buttonHostDiv);
            }
        }
    }

    // --- Settings Panel Functions (openSettingsPanel, createSettingEntry, closeSettingsPanel) ---
    // These are unchanged from version 1.3, so they are kept concise here for brevity.
    // Assume they are correctly implemented as in the previous version.
    function openSettingsPanel() { /* ... same as v1.3 ... */
        $(`#${SETTINGS_MODAL_ID}`).remove(); $('.settings-modal-backdrop').remove();
        const backdrop = $('<div class="settings-modal-backdrop"></div>'); $('body').append(backdrop);
        const modal = $(`<div id="${SETTINGS_MODAL_ID}"></div>`);
        modal.append('<h3>快捷输入按钮设置</h3>');
        const formContainer = $('<div></div>');
        buttonsConfig.forEach((btn, index) => { formContainer.append(createSettingEntry(btn, index)); });
        modal.append(formContainer);
        const addButtonRow = $('<button type="button" id="add-button-row">添加新按钮</button>');
        addButtonRow.on('click', function() {
            if (formContainer.children('.button-entry').length < MAX_BUTTONS) {
                const newIndex = formContainer.children('.button-entry').length;
                formContainer.append(createSettingEntry({ name: '', text: '' }, newIndex, true));
            } else { alert(`最多只能添加 ${MAX_BUTTONS} 个按钮。`); }
        });
        const actions = $('<div class="action-buttons"></div>');
        const saveButton = $('<button type="button">保存设置</button>');
        saveButton.on('click', function() {
            const newConfig = [];
            formContainer.find('.button-entry').each(function() {
                const name = $(this).find('input[name="btn-name"]').val().trim();
                const text = $(this).find('input[name="btn-text"]').val().trim();
                if (name && text) { newConfig.push({ name, text }); }
            });
            buttonsConfig = newConfig.slice(0, MAX_BUTTONS);
            GM_setValue(BUTTON_CONFIG_KEY, buttonsConfig);
            renderButtons(); closeSettingsPanel();
        });
        const cancelButton = $('<button type="button" style="background-color: #aaa;">取消</button>');
        cancelButton.on('click', closeSettingsPanel);
        actions.append(addButtonRow).append(saveButton).append(cancelButton);
        modal.append(actions); $('body').append(modal);
        backdrop.on('click', closeSettingsPanel);
    }
    function createSettingEntry(btn, index, isNew = false) { /* ... same as v1.3 ... */
        const entry = $('<div class="button-entry"></div>');
        entry.append(`<label style="margin-right:5px;">${index + 1}.</label>`);
        const nameInput = $(`<input type="text" name="btn-name" placeholder="按钮名称" value="${btn.name}">`);
        const textInput = $(`<input type="text" name="btn-text" placeholder="快捷文本" value="${btn.text}">`);
        const removeButton = $('<button type="button" class="remove-btn">移除</button>');
        removeButton.on('click', function() {
            $(this).closest('.button-entry').remove();
            $(`#${SETTINGS_MODAL_ID} .button-entry`).each(function(i){ $(this).find('label:first-child').text(`${i+1}.`); });
        });
        entry.append(nameInput).append(textInput).append(removeButton);
        if (isNew) nameInput.focus(); return entry;
    }
    function closeSettingsPanel() { /* ... same as v1.3 ... */ $(`#${SETTINGS_MODAL_ID}`).remove(); $('.settings-modal-backdrop').remove(); }


    function initialize() {
        addGlobalStyles();
        GM_registerMenuCommand('设置快捷输入按钮 (DIC Music)', openSettingsPanel, 's');
        renderButtons();

        const dynamicFormNode = document.getElementById('dynamic_form');
        if (dynamicFormNode) {
            const observer = new MutationObserver(function(mutationsList, observerInstance) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') { // Check if children of dynamic_form changed
                        const myTableButtonsExist = $(`#${SCRIPT_BUTTON_TR_ID}`).length > 0;
                        // Check if the div exists and is a direct child of dynamic_form (fallback scenario)
                        const myFallbackButtonsExist = $(`#dynamic_form > #${SCRIPT_BUTTON_CONTAINER_ID}`).length > 0;

                        if (!myTableButtonsExist && !myFallbackButtonsExist) {
                            // This script's buttons are not present in either their primary (table TR)
                            // or fallback (direct child of dynamic_form) locations.
                            const reportFormExists = $('form[name="report"]').length > 0;
                            const dynamicFormStillExists = $('#dynamic_form').length > 0;

                            if (reportFormExists && dynamicFormStillExists) {
                                // console.log("QuickInputHelper: Buttons not found. Attempting to re-render.");
                                renderButtons();
                            }
                        }
                        break; // Process only one relevant mutation from the list
                    }
                }
            });
            observer.observe(dynamicFormNode, { childList: true, subtree: true });
        } else {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (document.getElementById('dynamic_form') || attempts > 20) { // Max 10 seconds wait
                    clearInterval(interval);
                    if (document.getElementById('dynamic_form')) {
                        initialize(); // Re-run initialize to attach observer to the now existing form
                    } else {
                        console.warn("QuickInputHelper: #dynamic_form not found after waiting. Buttons may not appear correctly.");
                    }
                }
            }, 500);
        }
    }

    $(document).ready(function() {
        setTimeout(initialize, 750); // Slightly increased delay to allow other scripts potentially more time
    });

})();