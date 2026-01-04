// ==UserScript==
// @name            哔哩哔哩——学习模式
// @name:en         Bilibili-Leaner
// @namespace       http://tampermonkey.net/
// @version         1.2
// @description     屏蔽特定标签的视频，并替换成“滚去学习”字样
// @description:en  Block videos with specific tags and replace them with the message "Go study."
// @author          GooZy
// @source          https://github.com/GooZy/Bilibili-Leaner
// @license         MIT
// @match           *://www.bilibili.com/video/*
// @match           *://bilibili.com/video/*
// @icon            https://static.hdslb.com/mobile/img/512.png
// @run-at          document-end
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/480533/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E2%80%94%E2%80%94%E5%AD%A6%E4%B9%A0%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/480533/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E2%80%94%E2%80%94%E5%AD%A6%E4%B9%A0%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

const SEPERATE = ' '; // 标签分隔符

(function() {
    'use strict';

    // 配置页初始化
    initConfigPage();

    // 获取配置
    const savedConfig = getSavedConfig();
    console.log("配置：", savedConfig);

    // 是否可见标签
    var isAvaliableTag = checkVideoTagAvaliable(savedConfig.allowedTags)
    // 是否可用时段
    var isAvaliableTime = checkTimeAvaliable(savedConfig.blockedTime)

    console.log("时段校验结果：", isAvaliableTime, "标签校验结果：", isAvaliableTag)
    if (isAvaliableTime || isAvaliableTag) {
        return
    }

    processHideVideo()

})();

/**
 * 校验当前视频标签是否允许观看
 */
function checkVideoTagAvaliable(allowedTags) {
    const elements = document.getElementsByClassName("tag not-btn-tag");
    for (let i = 0; i < elements.length; ++i) {
        const tagName = elements[i].innerText;
        if (allowedTags.includes(tagName)) {
            return true;
        }
    }
    return false;
}

/**
 * 校验当前时段是否可以打开B站
 */
function checkTimeAvaliable(blockedTimes) {
    const date = new Date();
    const hour = date.getHours();

    for (let i = 0; i < blockedTimes.length; ++i) {
        const blockedTime = blockedTimes[i];
        const [startHour, endHour] = blockedTime.split('-').map(time => parseInt(time.trim()));
        if (hour >= startHour && hour < endHour) {
            return true;
        }
    }

    return false;
}

function processHideVideo() {
    var playerElme = document.getElementById("playerWrap");

    // 创建一个新的 div 元素，作为替换的内容
    var newElement = document.createElement("div");
    newElement.className = "bilibili-player-placeholder";
    newElement.innerHTML = "快滚去学习😡";

    // 替换 video 元素为新的 div 元素
    playerElme.replaceWith(newElement);
}

function getSavedConfig() {
    const allowedTags = GM_getValue('allowedTags', '').split(SEPERATE).map(tag => tag.trim());
    const blockedTime = GM_getValue('blockedTime', '').split(SEPERATE).map(timeRange => timeRange.trim());
    const quickTagOption = GM_getValue('quickTagOption', false);
    return { allowedTags, blockedTime, quickTagOption };
}

// 编辑标签
function editTagToAllowedList(tagName, remove = false) {
    const savedConfig = getSavedConfig();
    const allowedTags = savedConfig.allowedTags || [];

    if (remove) {
        const index = allowedTags.indexOf(tagName);
        if (index !== -1) {
            allowedTags.splice(index, 1);
            GM_setValue('allowedTags', allowedTags.join(SEPERATE));
        }
        return;
    }

    if (!allowedTags.includes(tagName)) {
        allowedTags.push(tagName);
        GM_setValue('allowedTags', allowedTags.join(SEPERATE));
    }
}

function initConfigPage() {

    GM_registerMenuCommand(getLocalizedText("configCommand"), openConfigModal);

    const config = getSavedConfig();
    if (config.quickTagOption) {
        console.log("启用快速标签处理");
        // 为每个具有 'tag not-btn-tag' 类的元素添加右键点击事件监听器
        document.querySelectorAll('.tag.not-btn-tag').forEach(tag => {
            tag.addEventListener('contextmenu', function(event) {
                event.preventDefault(); // 阻止默认的右键菜单
                const tagName = this.innerText.trim(); // 获取标签名
                showCustomConfirmationDialog(tagName);
            });
        });
    }

    // 一些函数定义
    function openConfigModal() {
        const existingModal = document.getElementById('configModal');
        if (!existingModal) {
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = getConfigPage();
            document.body.appendChild(modalContainer);

            const saveConfigBtn = document.getElementById('saveConfigBtn');
            const cancelConfigBtn = document.getElementById('cancelConfigBtn');
            const quickTagBtn = document.getElementById('quickTagOption');
            const tagInputContainer = document.getElementById('tagInputContainer');
            const timeInputContainer = document.getElementById('timeInputContainer');
            const allowedTagsInput = document.getElementById('allowedTagsInput');
            const blockedTimeInput = document.getElementById('blockedTime');

            // 初始化值
            const savedConfig = getSavedConfig();
            savedConfig.allowedTags.forEach(tag => {
                const tagElement = document.createElement('div');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagInputContainer.appendChild(tagElement);
            });
            savedConfig.blockedTime.forEach(time => {
                const tagElement = document.createElement('div');
                tagElement.className = 'tag';
                tagElement.textContent = time;
                timeInputContainer.appendChild(tagElement);
            });

            allowedTagsInput.value = savedConfig.allowedTags.join(SEPERATE);
            blockedTimeInput.value = savedConfig.blockedTime.join(SEPERATE);
            quickTagBtn.checked = savedConfig.quickTagOption;

            // 注册事件
            saveConfigBtn.addEventListener('click', saveConfig);
            cancelConfigBtn.addEventListener('click', closeConfigModal);
            allowedTagsInput.addEventListener('input', updateTags);
            blockedTimeInput.addEventListener('input', updateTimes);
        }
    }

    function updateTags(event) {
        const tagInputContainer = document.getElementById('tagInputContainer');
        const tags = event.target.value.split(SEPERATE).filter(tag => tag.trim() !== '');

        tagInputContainer.innerHTML = '';

        tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagInputContainer.appendChild(tagElement);
        });
    }

    function updateTimes(event) {
        const timeInputContainer = document.getElementById('timeInputContainer');
        const tags = event.target.value.split(SEPERATE).filter(tag => tag.trim() !== '');

        timeInputContainer.innerHTML = '';

        tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            timeInputContainer.appendChild(tagElement);
        });
    }

    function saveConfig() {
        const allowedTagsInput = document.getElementById('allowedTagsInput');
        const blockedTimeInput = document.getElementById('blockedTime');
        const quickTagOption = document.getElementById('quickTagOption');

        GM_setValue('allowedTags', allowedTagsInput.value.trim());
        GM_setValue('blockedTime', blockedTimeInput.value.trim());
        GM_setValue('quickTagOption', quickTagOption.checked);

        closeConfigModal();
    }

    function closeConfigModal() {
        const configModal = document.getElementById('configModal');
        if (configModal) {
            configModal.remove();
        }
    }

    // 显示自定义确认对话框的函数
    function showCustomConfirmationDialog(tagName) {
        const dialog = document.createElement('div');
        dialog.innerHTML = `
            <style>
                .tag-input {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    border: 1px solid #ccc;
                    padding: 5px;
                }

                .tag-container {
                    display: inline-block;
                    width: auto;
                    border: none;
                    outline: none;
                    background-color: transparent;
                    font-size: 14px;
                }

                .tag {
                    background-color: #f0f0f0;
                    padding: 2px 5px;
                    border-radius: 3px;
                    margin: 2px;
                    display: inline-block;
                }

                #configModal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }

                #configContainer {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 400px;
                    text-align: center;
                }
            </style>

            <div id="configModal">
                <div id="configContainer">
                    <h3 style="margin-bottom: 20px;">${getLocalizedText("selectTagPrompt")}${tagName}</h3>

                    <button id="addButton" style="margin-right: 10px;">${getLocalizedText("add")}</button>
                    <button id="deleteButton" style="margin-right: 10px;">${getLocalizedText("delete")}</button>
                    <button id="cancelButton">${getLocalizedText("cancel")}</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        const addButton = dialog.querySelector('#addButton');
        addButton.addEventListener('click', () => {
            editTagToAllowedList(tagName); // 添加标签到允许列表
            location.reload();
            dialog.remove(); // 移除对话框
        });

        const deleteButton = dialog.querySelector('#deleteButton');
        deleteButton.addEventListener('click', () => {
            editTagToAllowedList(tagName, true); // 添加标签到允许列表
            location.reload();
            dialog.remove(); // 移除对话框
        });

        const cancelButton = dialog.querySelector('#cancelButton');
        cancelButton.addEventListener('click', () => {
            dialog.remove(); // 移除对话框
        });
    }

    function getConfigPage() {
        return `
        <style>
            .tag-input {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                border: 1px solid #ccc;
                padding: 5px;
            }

            .tag-checkbox {
                display: flex;
                flex-wrap: wrap;
                align-items: left;
                border: 1px solid #ccc;
                padding: 5px;
                gap: 5px;
            }

            .tag-container {
                display: inline-block;
                width: auto;
                border: none;
                outline: none;
                background-color: transparent;
                font-size: 14px;
            }

            .tag {
                background-color: #f0f0f0;
                padding: 2px 5px;
                border-radius: 3px;
                margin: 2px;
                display: inline-block;
            }

            #configModal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }

            #configContainer {
                background: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 400px;
                text-align: center;
            }
        </style>

        <div id="configModal">
            <div id="configContainer">
                <h3 style="margin-bottom: 20px;">${getLocalizedText("configTitle")}</h3>

                <label for="blockedTime">${getLocalizedText("blockedTimeLabel")}</label><br>
                <input type="text" id="blockedTime" style="width: 100%;"><br>
                <div id="timeInputContainer" class="tag-container" style="width: 100%;"></div><br>

                <label for="allowedTagsInput">${getLocalizedText("allowedTagsLabel")}</label><br>
                <input type="text" id="allowedTagsInput" class="tag-input" style="width: 100%;">
                <div id="tagInputContainer" class="tag-container" style="width: 100%;"></div><br>

                <label for="allowedTagsInput">${getLocalizedText("quickTagOptionHelp")}</label><br>
                <div id="tagOptionsContainer" class="tag-checkbox">
                    <label for="quickTagOption">
                        ${getLocalizedText("quickTagOptionLabel")}
                    </label>
                    <input type="checkbox" id="quickTagOption">
                </div><br>

                <button id="saveConfigBtn" style="margin-right: 10px;">${getLocalizedText("saveConfigBtn")}</button>
                <button id="cancelConfigBtn">${getLocalizedText("cancelConfigBtn")}</button>
            </div>
        </div>
    `;
    }
}

function getLocalizedText(key) {

    // 获取用户首选语言
    const userLanguages = navigator.languages || [navigator.language || navigator.userLanguage];
    const preferredLanguage = userLanguages.find(lang => lang.startsWith('zh')) || 'en'; // 如果找不到中文，就使用英文
    // 提取语言参数（例如：zh-CN -> zh）
    const languageParam = preferredLanguage.substring(0, 2);

    const translations = {
        "configTitle": {
            "zh": "配置学习模式",
            "en": "Configure Learning Mode"
        },
        "blockedTimeLabel": {
            "zh": "允许打开B站的时段（24小时制，例如 22-23，空格分隔）:",
            "en": "Allowed Bilibili opening time slots (24-hour format, e.g. 22-23, separated by space):"
        },
        "allowedTagsLabel": {
            "zh": "非允许时段，允许的视频标签（用空格分隔）:",
            "en": "Allowed video tags outside restricted time slots (separated by space):"
        },
        "saveConfigBtn": {
            "zh": "保存配置",
            "en": "Save Configuration"
        },
        "cancelConfigBtn": {
            "zh": "取消",
            "en": "Cancel"
        },
        "goStudyText": {
            "zh": "快滚去学习😡",
            "en": "Go study! 😡"
        },
        "configCommand": {
            "zh": "配置学习模式",
            "en": "Configure Learning Mode"
        },
        "add": {
            "zh": "添加",
            "en": "Add"
        },
        "delete": {
            "zh": "删除",
            "en": "Delete"
        },
        "cancel": {
            "zh": "取消",
            "en": "Cancel"
        },
        "selectTagPrompt": {
            "zh": "当前标签：",
            "en": "Current tag: "
        },
        "quickTagOptionLabel": {
            "zh": "快速处理标签：",
            "en": "Quick tag processing: "
        },
        "quickTagOptionHelp": {
            "zh": "开启快速处理标签选项后，鼠标右键点击视频标签可快速添加或删除标签",
            "en": "Enable the quick tag processing option, and you can quickly add or remove tags by right-clicking the video tags."
        }
    };

    return translations[key][languageParam];
}