// ==UserScript==
// @name:zh-CN   AI Studio 模型修改器 - 解锁隐藏模型
// @name:en      AI Studio Model Modifier - Unlock hidden models
// @name         AI Studio Model Modifier
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description:zh-CN 拦截 aistudio.google.com 的 GenerateContent 请求修改模型，支持在官方、预览及内部测试模型间切换，并提供带分类的下拉菜单。
// @description:en Modify the model for aistudio.google.com requests, allowing switching between official, preview, and internal test models with a categorized dropdown menu.
// @author       Z_06
// @match        *://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @homepageURL  https://greasyfork.org/zh-CN/scripts/539130-ai-studio-model-modifier
// @supportURL   https://greasyfork.org/zh-CN/scripts/539130-ai-studio-model-modifier/feedback
// @description Modify the model for aistudio.google.com requests, allowing switching between official, preview, and internal test models with a categorized dropdown menu.
// @downloadURL https://update.greasyfork.org/scripts/539130/AI%20Studio%20Model%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/539130/AI%20Studio%20Model%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Localization Object ---
    const L10N = {
        _lang: navigator.language && navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en',
        get: function(translations) {
            return translations[this._lang] || translations['en'];
        },
        format: function(translationKey, ...args) {
            let str = this.get(translationKey);
            args.forEach((arg, index) => {
                str = str.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
            });
            return str;
        }
    };

    const STRINGS = {
        scriptName: { zh: "[AI Studio] 模型修改器", en: "[AI Studio] Model Modifier" },
        modelSelectorTitle: { zh: "所有请求都将被强制使用此下拉框选中的模型", en: "All requests will be forced to use the model selected in this dropdown." },
        customModelGroupLabel: { zh: "自定义模型", en: "Custom Models" },
        customModelOptionPrefix: { zh: "* ", en: "* " }, // Prefix for custom added models
        menu_addSetCustomModel: { zh: "添加/设置自定义模型", en: "Add/Set Custom Model" },
        prompt_enterModelName: { zh: "请输入要强制使用的完整模型名称:", en: "Please enter the full model name to enforce:" },
        alert_modelUpdatedTo: { zh: "模型已更新为:\n{0}", en: "Model updated to:\n{0}" },
        log_loadedWithModel: { zh: "已加载。当前强制模型为 \"{0}\"", en: "loaded. Current forced model is \"{0}\"" },
        log_containerFound: { zh: "发现容器，注入UI...", en: "Container found, injecting UI..." },
        log_uiInjected: { zh: "自定义UI注入成功。", en: "Custom UI injected successfully." },
        log_modelSwitchedAndSaved: { zh: "模型已切换并保存: {0}", en: "Model switched and saved: {0}" },
        log_interceptRequest: { zh: "拦截请求。原始: {0} -> 修改为: {1}", en: "Intercepting request. Original: {0} -> Modified to: {1}" },
        log_errorModifyingPayload: { zh: "修改请求负载时出错:", en: "Error modifying request payload:" },

        // Model Group Labels
        group_internalTest: { zh: "内部测试模型", en: "Internal Test Models" },
        group_gemini25: { zh: "Gemini 2.5", en: "Gemini 2.5" },
        group_gemini20: { zh: "Gemini 2.0", en: "Gemini 2.0" },
        group_gemini15: { zh: "Gemini 1.5", en: "Gemini 1.5" },
        group_down: { zh: "已下线模型", en: "Offline Models" },

        // Model Name Suffixes/Parts
        suffix_internal: { zh: " (内部测试)", en: " (Internal)" },
        suffix_down: { zh: " (已下架)", en: " (Down)" },
        suffix_preview: { zh: " 预览版", en: " Preview" },
        suffix_exp: { zh: " EXP", en: " EXP" },
        suffix_abTest: { zh: " AB-Test", en: " AB-Test" },
        suffix_thinking: { zh: " Thinking", en: " Thinking" },
        suffix_imageGen: { zh: " (图片生成)", en: " (Image Gen.)" }
    };

    // --- Configuration ---
    const SCRIPT_NAME_LOCALIZED = L10N.get(STRINGS.scriptName);
    const STORAGE_KEY = "aistudio_custom_model_name_v2";
    const TARGET_URL = "https://alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/GenerateContent";
    const MODEL_SELECTOR_CONTAINER = 'div.settings-model-selector';

    const MODEL_OPTIONS = [
        {
            label: STRINGS.group_internalTest,
            options: [
                { baseName: "68zkqbz8vs", suffixKey: "suffix_internal", value: "models/68zkqbz8vs" },
                { baseName: "a24bo28u1a", suffixKey: "suffix_internal", value: "models/a24bo28u1a" },
                { baseName: "2vmc1bo4ri", suffixKey: "suffix_internal", value: "models/2vmc1bo4ri" },
                { baseName: "42fc3y4xfsz", suffixKey: "suffix_internal", value: "models/42fc3y4xfsz" },
                { baseName: "ixqzem8yj4j", suffixKey: "suffix_internal", value: "models/ixqzem8yj4j" },
                { baseName: "Calmriver", suffixKey: "suffix_internal", value: "models/calmriver-ab-test" },
                { baseName: "Claybrook", suffixKey: "suffix_internal", value: "models/claybrook-ab-test" },
                { baseName: "Frostwind", suffixKey: "suffix_internal", value: "models/frostwind-ab-test" },
                { baseName: "Goldmane", suffixKey: "suffix_internal", value: "models/goldmane-ab-test" },
            ]
        },
        {
            label: STRINGS.group_gemini25,
            options: [
                { baseName: "2.5 Pro", value: "models/gemini-2.5-pro" },
                { baseName: "2.5 Pro", date: "(06-05)", suffixKey: "suffix_preview", value: "models/gemini-2.5-pro-preview-06-05" },
                { baseName: "2.5 Pro", date: "(05-06)", suffixKey: "suffix_preview", value: "models/gemini-2.5-pro-preview-05-06" },
                { baseName: "2.5 Pro", date: "(03-25)", suffixKey: "suffix_preview", value: "models/gemini-2.5-pro-preview-03-25" },
                { baseName: "2.5 Pro", date: "(03-25)", suffixKey: "suffix_exp", value: "models/gemini-2.5-pro-exp-03-25" },
                { baseName: "2.5 Flash", value: "models/gemini-2.5-flash" },
                { baseName: "2.5 Flash", date: "(05-20)", suffixKey: "suffix_preview", value: "models/gemini-2.5-flash-preview-05-20" },
                { baseName: "2.5 Flash", date: "(04-17)", suffixKey: "suffix_preview", value: "models/gemini-2.5-flash-preview-04-17" },
                { baseName: "2.5 Flash", date: "(04-17)", suffixKey: "suffix_thinking", value: "models/gemini-2.5-flash-preview-04-17-thinking" },
                { baseName: "2.5 Flash Lite", date: "(06-17)", suffixKey: "suffix_preview", value: "models/gemini-2.5-flash-lite-preview-06-17" },
            ]
        },
        {
            label: STRINGS.group_gemini20,
            options: [
                { baseName: "2.0 Flash", value: "models/gemini-2.0-flash" },
                { baseName: "2.0 Flash", suffixKey: "suffix_imageGen", value: "models/gemini-2.0-flash-preview-image-generation" },
                { baseName: "2.0 Flash-Lite", value: "models/gemini-2.0-flash-lite" },
            ]
        },
        {
            label: STRINGS.group_gemini15,
            options: [
                { baseName: "1.5 Pro", value: "models/gemini-1.5-pro" },
                { baseName: "1.5 Flash", value: "models/gemini-1.5-flash" },
                { baseName: "1.5 Flash-8B", value: "models/gemini-1.5-flash-8b" },
            ]
        },
        {
            label: STRINGS.group_down,
            options: [
                { baseName: "Blacktooth", suffixKey: "suffix_down", value: "models/blacktooth-ab-test" },
                { baseName: "jfdksal98a", suffixKey: "suffix_down", value: "models/jfdksal98a" },
                { baseName: "Kingfall", suffixKey: "suffix_down", value: "models/kingfall-ab-test" },
                { baseName: "2.5 Pro AB-Test", date: "(03-25)", suffixKey: "suffix_down", value: "models/gemini-2.5-pro-preview-03-25-ab-test" },
            ]
        }
    ];
    const DEFAULT_MODEL = MODEL_OPTIONS[1].options[3].value; // 0325

    let customModelName = GM_getValue(STORAGE_KEY, DEFAULT_MODEL);

    GM_addStyle(`
        ${MODEL_SELECTOR_CONTAINER} ms-model-selector-two-column { display: none !important; }
        #custom-model-selector {
            width: 100%; padding: 8px 12px; margin-top: 4px; border: 1px solid #5f6368;
            border-radius: 8px; color: #e2e2e5; background-color: #35373a;
            font-family: 'Google Sans', 'Roboto', sans-serif; font-size: 14px; font-weight: 500;
            box-sizing: border-box; cursor: pointer; -webkit-appearance: none; -moz-appearance: none; appearance: none;
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23e2e2e5%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.4-5.4-13z%22%2F%3E%3C%2Fsvg%3E');
            background-repeat: no-repeat; background-position: right 12px center; background-size: 10px;
        }
        #custom-model-selector optgroup { font-weight: bold; color: #8ab4f8; }
    `);

    function getModelDisplayName(modelOption) {
        let name = modelOption.baseName;
        if (modelOption.date) name += ` ${modelOption.date}`;
        if (modelOption.suffixKey && STRINGS[modelOption.suffixKey]) {
            name += L10N.get(STRINGS[modelOption.suffixKey]);
        }
        return name;
    }

    function updateAndSelectModel(modelValue) {
        const selector = document.getElementById('custom-model-selector');
        if (!selector) return;

        if (!selector.querySelector(`option[value="${modelValue}"]`)) {
            let customGroup = document.getElementById('custom-model-optgroup');
            if (!customGroup) {
                customGroup = document.createElement('optgroup');
                customGroup.id = 'custom-model-optgroup';
                customGroup.label = L10N.get(STRINGS.customModelGroupLabel);
                selector.appendChild(customGroup);
            }
            const newOption = document.createElement('option');
            newOption.value = modelValue;
            newOption.textContent = L10N.get(STRINGS.customModelOptionPrefix) + modelValue.replace('models/', '');
            customGroup.appendChild(newOption);
        }
        selector.value = modelValue;
    }

    function createModelSelectorUI(container) {
        console.log(`[${SCRIPT_NAME_LOCALIZED}] ${L10N.get(STRINGS.log_containerFound)}`);
        const selector = document.createElement('select');
        selector.id = 'custom-model-selector';
        selector.title = L10N.get(STRINGS.modelSelectorTitle);

        MODEL_OPTIONS.forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = L10N.get(group.label);
            group.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = getModelDisplayName(opt);
                optgroup.appendChild(option);
            });
            selector.appendChild(optgroup);
        });

        selector.addEventListener('change', (event) => {
            const newModel = event.target.value;
            customModelName = newModel;
            GM_setValue(STORAGE_KEY, newModel);
            console.log(`[${SCRIPT_NAME_LOCALIZED}] ${L10N.format(STRINGS.log_modelSwitchedAndSaved, newModel)}`);
        });

        const injectionPoint = container.querySelector('.item-input-form-field');
        if (injectionPoint) {
            injectionPoint.appendChild(selector);
            updateAndSelectModel(customModelName);
            console.log(`[${SCRIPT_NAME_LOCALIZED}] ${L10N.get(STRINGS.log_uiInjected)}`);
        }
    }

    GM_registerMenuCommand(L10N.get(STRINGS.menu_addSetCustomModel), () => {
        const newModel = prompt(L10N.get(STRINGS.prompt_enterModelName), customModelName);
        if (newModel && newModel.trim() !== "") {
            const trimmedModel = newModel.trim();
            customModelName = trimmedModel;
            GM_setValue(STORAGE_KEY, trimmedModel);
            alert(L10N.format(STRINGS.alert_modelUpdatedTo, trimmedModel));
            updateAndSelectModel(trimmedModel);
        }
    });

    const observer = new MutationObserver((mutations, obs) => {
        const container = document.querySelector(MODEL_SELECTOR_CONTAINER);
        if (container && !document.getElementById('custom-model-selector')) {
            createModelSelectorUI(container);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        this._method = method;
        return originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        if (this._url === TARGET_URL && this._method.toUpperCase() === 'POST' && data) {
            try {
                let payload = JSON.parse(data);
                const originalModel = payload[0];
                if (typeof originalModel === 'string' && originalModel.startsWith('models/')) {
                    console.log(`[${SCRIPT_NAME_LOCALIZED}] ${L10N.format(STRINGS.log_interceptRequest, originalModel, customModelName)}`);
                    payload[0] = customModelName;
                    const modifiedData = JSON.stringify(payload);
                    return originalSend.call(this, modifiedData);
                }
            } catch (e) {
                console.error(`[${SCRIPT_NAME_LOCALIZED}] ${L10N.get(STRINGS.log_errorModifyingPayload)}`, e);
            }
        }
        return originalSend.apply(this, arguments);
    };

    console.log(`[${SCRIPT_NAME_LOCALIZED}] ${L10N.format(STRINGS.log_loadedWithModel, customModelName)}`);
})();