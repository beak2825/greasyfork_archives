// ==UserScript==
// @name         WhatsApp Translator
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  在 WhatsApp 网页版中使用 DeepL、智谱 GLM4 Flash、Qwen-Max、Azure GPT-4o 或 ChatGPT 翻译，支持悬浮按钮翻译、输入框翻译、语言自动识别，禁止发送中文消息，带优化控制面板，冻结仅影响中文限制，可自定义快捷键 F1-F12，大模型提示词个性化翻译，支持自定义翻译引擎和首选词
// @author       Grok (xAI)
// @match        https://web.whatsapp.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531393/WhatsApp%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/531393/WhatsApp%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey script loaded");

    // 默认设置
    let settings = GM_getValue('settings', {
        plat: 'deepl',  // 默认使用 DeepL
        your_lang: 'ZH',
        contact_lang: 'AUTO',
        color: '#a4a9ab',
        fontSize: '100',
        autoTranslator: false,
        quickTranslator: true,
        immediate: false,
        translateKey: 'F1',  // 默认快捷键为 F1
        customPrompt: '', // 默认大模型提示词为空
        customEngines: [], // 自定义翻译引擎列表
        preferredTerms: [], // 翻译首选词列表
        historyEngines: [] // 历史保存的引擎记录
    });

    let isChineseRestrictionFrozen = false;
    let isToggleBtnVisible = true; // 控制悬浮图标显示状态

    // API 密钥
    const DEEPL_AUTH_KEY = 'd1bb179e-baa8-369d-1a0c-be1a7655b603:fx';
    const GLM4_AUTH_KEY = 'aaaa63e138f84209b732a6b7ae76b067.RwzDQet5YZmth8o6';
    const QWEN_MAX_AUTH_KEY = 'sk-ffd22562e50040b9b8e2b19fc11412cc';
    const AZURE_GPT4O_AUTH_KEY = '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';
    const CHATGPT_AUTH_KEY = 'sk-ZwyBr1iusFJqqEi6BEUhPblnXn60PcHY1NgnphlfEt8HGYpF';
    const SILICONFLOW_AUTH_KEY = 'sk-rovxlhvnsvuoabvqkqwjzmqpzklkaxacqjkiulrwhrwxnadb';

    // 支持的语言列表
    const languages = [
        { val: 'AUTO', text: '自动检测', text_en: 'Auto Detect' },
        { val: 'ZH', text: '中文', text_en: 'Chinese' },
        { val: 'EN', text: '英语', text_en: 'English' },
        { val: 'ES', text: '西班牙语', text_en: 'Spanish' },
        { val: 'FR', text: '法语', text_en: 'French' },
        { val: 'RU', text: '俄语', text_en: 'Russian' },
        { val: 'PT', text: '葡萄牙语', text_en: 'Portuguese' }
    ];

    // 支持的快捷键列表
    const functionKeys = Array.from({ length: 12 }, (_, i) => `F${i + 1}`);

    // 保存设置
    function saveSettings(newSettings) {
        settings = { ...settings, ...newSettings };
        GM_setValue('settings', settings);
        console.log('Settings saved:', settings);
        updateStyles();
        if (settings.autoTranslator) processMessages();
        setupInputTranslation();
    }

    // 显示错误通知
    function showError(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #f44336; color: white;
            padding: 10px 20px; border-radius: 4px; z-index: 9999; font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2); max-width: 300px; text-align: center;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 0.5s';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // 显示中文限制提示
    function showChineseToast(message) {
        if (isChineseRestrictionFrozen) return;
        const existingToast = document.querySelector("#forbid-toast");
        if (existingToast) return;

        const toast = document.createElement("div");
        toast.id = "forbid-toast";
        toast.innerText = message;
        toast.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #f44336;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "1";
        }, 10);

        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    }

    // DeepL 翻译函数
    function translateWithDeepL(text, targetLang, callback) {
        const data = `text=${encodeURIComponent(text)}&target_lang=${targetLang}`;
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api-free.deepl.com/v2/translate',
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_AUTH_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data.translations || !data.translations[0]?.text) {
                        throw new Error('无法解析翻译结果');
                    }
                    const translatedText = data.translations[0].text;
                    console.log(`DeepL Translated: ${text} -> ${translatedText}`);
                    callback({ success: true, text: translatedText });
                } catch (error) {
                    console.error('DeepL parse error:', error);
                    callback({ success: false, error: error.message || '无法解析翻译结果' });
                }
            },
            onerror: function(error) {
                console.error('DeepL request failed:', error);
                callback({ success: false, error: '网络错误或密钥无效' });
            }
        });
    }

    // GLM4 翻译函数
    function translateWithGLM4(text, targetLang, callback) {
        const langMap = {
            'ZH': 'zh',
            'EN': 'en',
            'ES': 'es',
            'FR': 'fr',
            'RU': 'ru',
            'PT': 'pt'
        };
        const target = langMap[targetLang] || 'en';
        const customPrompt = settings.customPrompt ? settings.customPrompt + '\n' : '';
        const modifiedText = applyPreferredTerms(text);

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            headers: {
                'Authorization': `Bearer ${GLM4_AUTH_KEY}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: 'glm-4-flash',
                messages: [{
                    role: 'user',
                    content: `${customPrompt}将以下文本翻译成${targetLang === 'ZH' ? '中文' : targetLang === 'EN' ? '英语' : targetLang === 'ES' ? '西班牙语' : targetLang === 'FR' ? '法语' : targetLang === 'RU' ? '俄语' : '葡萄牙语'}:\n${modifiedText}`
                }],
                temperature: 0.7
            }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data.choices || !data.choices[0]?.message?.content) {
                        throw new Error('无法解析翻译结果');
                    }
                    const translatedText = data.choices[0].message.content.trim();
                    console.log(`GLM4 Translated: ${text} -> ${translatedText}`);
                    callback({ success: true, text: translatedText });
                } catch (error) {
                    console.error('GLM4 parse error:', error);
                    callback({ success: false, error: error.message || '无法解析翻译结果' });
                }
            },
            onerror: function(error) {
                console.error('GLM4 request failed:', error);
                callback({ success: false, error: '网络错误或密钥无效' });
            }
        });
    }

    // Qwen-Max 翻译函数
    function translateWithQwenMax(text, targetLang, callback) {
        const langMap = {
            'ZH': 'zh',
            'EN': 'en',
            'ES': 'es',
            'FR': 'fr',
            'RU': 'ru',
            'PT': 'pt'
        };
        const target = langMap[targetLang] || 'en';
        const customPrompt = settings.customPrompt ? settings.customPrompt + '\n' : '';
        const modifiedText = applyPreferredTerms(text);

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
            headers: {
                'Authorization': `Bearer ${QWEN_MAX_AUTH_KEY}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: 'qwen-max',
                input: {
                    prompt: `${customPrompt}将以下文本翻译成${targetLang === 'ZH' ? '中文' : targetLang === 'EN' ? '英语' : targetLang === 'ES' ? '西班牙语' : targetLang === 'FR' ? '法语' : targetLang === 'RU' ? '俄语' : '葡萄牙语'}:\n${modifiedText}`
                },
                parameters: {
                    temperature: 0.7
                }
            }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data.output || !data.output.text) {
                        throw new Error('无法解析翻译结果');
                    }
                    const translatedText = data.output.text.trim();
                    console.log(`Qwen-Max Translated: ${text} -> ${translatedText}`);
                    callback({ success: true, text: translatedText });
                } catch (error) {
                    console.error('Qwen-Max parse error:', error);
                    callback({ success: false, error: error.message || '无法解析翻译结果' });
                }
            },
            onerror: function(error) {
                console.error('Qwen-Max request failed:', error);
                callback({ success: false, error: '网络错误或密钥无效' });
            }
        });
    }

    // Azure GPT-4o 翻译函数
    function translateWithAzureGPT4o(text, targetLang, callback) {
        const langMap = {
            'ZH': 'Chinese',
            'EN': 'English',
            'ES': 'Spanish',
            'FR': 'French',
            'RU': 'Russian',
            'PT': 'Portuguese'
        };
        const target = langMap[targetLang] || 'English';
        const customPrompt = settings.customPrompt ? settings.customPrompt + '\n' : '';
        const modifiedText = applyPreferredTerms(text);

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://models.inference.ai.azure.com/chat/completions',
            headers: {
                'Authorization': `Bearer ${AZURE_GPT4O_AUTH_KEY}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: 'gpt-4o',
                messages: [{
                    role: 'user',
                    content: `${customPrompt}Translate the following text into ${target}:\n${modifiedText}`
                }],
                temperature: 0.7
            }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data.choices || !data.choices[0]?.message?.content) {
                        throw new Error('无法解析翻译结果');
                    }
                    const translatedText = data.choices[0].message.content.trim();
                    console.log(`Azure GPT-4o Translated: ${text} -> ${translatedText}`);
                    callback({ success: true, text: translatedText });
                } catch (error) {
                    console.error('Azure GPT-4o parse error:', error);
                    callback({ success: false, error: error.message || '无法解析翻译结果' });
                }
            },
            onerror: function(error) {
                console.error('Azure GPT-4o request failed:', error);
                callback({ success: false, error: '网络错误或密钥无效' });
            }
        });
    }

    // ChatGPT 翻译函数
    function translateWithChatGPT(text, targetLang, callback) {
        const langMap = {
            'ZH': 'Chinese',
            'EN': 'English',
            'ES': 'Spanish',
            'FR': 'French',
            'RU': 'Russian',
            'PT': 'Portuguese'
        };
        const target = langMap[targetLang] || 'English';
        const customPrompt = settings.customPrompt ? settings.customPrompt + '\n' : '';
        const modifiedText = applyPreferredTerms(text);

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.chatanywhere.tech/v1/chat/completions',
            headers: {
                'Authorization': `Bearer ${CHATGPT_AUTH_KEY}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: `${customPrompt}Translate the following text into ${target}:\n${modifiedText}`
                }],
                temperature: 0.7
            }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data.choices || !data.choices[0]?.message?.content) {
                        throw new Error('无法解析翻译结果');
                    }
                    const translatedText = data.choices[0].message.content.trim();
                    console.log(`ChatGPT Translated: ${text} -> ${translatedText}`);
                    callback({ success: true, text: translatedText });
                } catch (error) {
                    console.error('ChatGPT parse error:', error);
                    callback({ success: false, error: error.message || '无法解析翻译结果' });
                }
            },
            onerror: function(error) {
                console.error('ChatGPT request failed:', error);
                callback({ success: false, error: '网络错误或密钥无效' });
            }
        });
    }

    // SiliconFlow GLM-4-9B-0414 翻译函数
    function translateWithSiliconFlow(text, targetLang, callback) {
        const langMap = {
            'ZH': 'Chinese',
            'EN': 'English',
            'ES': 'Spanish',
            'FR': 'French',
            'RU': 'Russian',
            'PT': 'Portuguese'
        };
        const target = langMap[targetLang] || 'English';
        const customPrompt = settings.customPrompt ? settings.customPrompt + '\n' : '';
        const modifiedText = applyPreferredTerms(text);

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.siliconflow.cn/v1/chat/completions',
            headers: {
                'Authorization': `Bearer ${SILICONFLOW_AUTH_KEY}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: 'THUDM/GLM-4-9B-0414',
                messages: [{
                    role: 'user',
                    content: `${customPrompt}Translate the following text into ${target}:\n${modifiedText}`
                }],
                temperature: 0.7,
                stream: false
            }),
            onload: function(response) {
                try {
                    console.log('SiliconFlow response:', response.responseText);
                    const data = JSON.parse(response.responseText);
                    if (!data.choices || !data.choices[0]?.message?.content) {
                        throw new Error('无法解析翻译结果');
                    }
                    const translatedText = data.choices[0].message.content.trim();
                    console.log(`SiliconFlow GLM-4-9B-0414 Translated: ${text} -> ${translatedText}`);
                    callback({ success: true, text: translatedText });
                } catch (error) {
                    console.error('SiliconFlow parse error:', error);
                    callback({ success: false, error: error.message || '无法解析翻译结果' });
                }
            },
            onerror: function(error) {
                console.error('SiliconFlow request failed:', error);
                callback({ success: false, error: '网络错误或密钥无效，状态码：' + (error.status || '未知') });
            }
        });
    }

    // 自定义翻译引擎函数
    function translateWithCustomEngine(text, targetLang, engine, callback) {
        const langMap = {
            'ZH': 'Chinese',
            'EN': 'English',
            'ES': 'Spanish',
            'FR': 'French',
            'RU': 'Russian',
            'PT': 'Portuguese'
        };
        const target = langMap[targetLang] || 'English';
        const customPrompt = settings.customPrompt ? settings.customPrompt + '\n' : '';
        const modifiedText = applyPreferredTerms(text);

        GM_xmlhttpRequest({
            method: 'POST',
            url: engine.url,
            headers: {
                'Authorization': `Bearer ${engine.apiKey}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: engine.modelName || 'default-model',
                messages: [{
                    role: 'user',
                    content: `${customPrompt}Translate the following text into ${target}:\n${modifiedText}`
                }],
                temperature: 0.7
            }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data.choices || !data.choices[0]?.message?.content) {
                        throw new Error('无法解析翻译结果');
                    }
                    const translatedText = data.choices[0].message.content.trim();
                    console.log(`Custom Engine (${engine.name}) Translated: ${text} -> ${translatedText}`);
                    callback({ success: true, text: translatedText });
                } catch (error) {
                    console.error(`Custom Engine (${engine.name}) parse error:`, error);
                    callback({ success: false, error: error.message || '无法解析翻译结果' });
                }
            },
            onerror: function(error) {
                console.error(`Custom Engine (${engine.name}) request failed:`, error);
                callback({ success: false, error: '网络错误或密钥无效' });
            }
        });
    }

    // 测试自定义翻译引擎连接
    function testCustomEngineConnection(engine, callback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: engine.url,
            headers: {
                'Authorization': `Bearer ${engine.apiKey}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: engine.modelName || 'default-model',
                messages: [{
                    role: 'user',
                    content: 'Test connection'
                }],
                temperature: 0.7
            }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.choices && data.choices[0]?.message?.content) {
                        callback({ success: true, message: '连接成功' });
                    } else {
                        callback({ success: false, message: '响应格式错误' });
                    }
                } catch (error) {
                    callback({ success: false, message: '解析错误: ' + error.message });
                }
            },
            onerror: function(error) {
                callback({ success: false, message: '连接失败: 网络错误或密钥无效' });
            }
        });
    }

    // 应用翻译首选词
    function applyPreferredTerms(text) {
        let modifiedText = text;
        settings.preferredTerms.forEach(term => {
            const regex = new RegExp(`\\b${term.original}\\b`, 'gi');
            modifiedText = modifiedText.replace(regex, term.translation);
        });
        return modifiedText;
    }

    // 通用翻译函数
    function translateText(text, targetLang, callback) {
        if (settings.plat === 'deepl') {
            translateWithDeepL(text, targetLang, callback);
        } else if (settings.plat === 'glm4') {
            translateWithGLM4(text, targetLang, callback);
        } else if (settings.plat === 'qwen-max') {
            translateWithQwenMax(text, targetLang, callback);
        } else if (settings.plat === 'azure-gpt4o') {
            translateWithAzureGPT4o(text, targetLang, callback);
        } else if (settings.plat === 'chatgpt') {
            translateWithChatGPT(text, targetLang, callback);
        } else if (settings.plat === 'siliconflow') {
            translateWithSiliconFlow(text, targetLang, callback);
        } else {
            const customEngine = settings.customEngines.find(engine => engine.id === settings.plat);
            if (customEngine) {
                translateWithCustomEngine(text, targetLang, customEngine, callback);
            } else {
                callback({ success: false, error: '未找到自定义引擎' });
            }
        }
    }

    // 语言检测函数
    function detectLanguage(text) {
        const chinesePattern = /[\u4e00-\u9fff]/;
        const cyrillicPattern = /[а-яА-Я]/;
        const latinPattern = /[a-zA-Z]/;

        if (chinesePattern.test(text) && latinPattern.test(text)) return 'MIXED';
        if (chinesePattern.test(text)) return 'ZH';
        if (cyrillicPattern.test(text)) return 'RU';
        if (latinPattern.test(text)) {
            if (text.match(/[áéíóúñ]/)) return 'ES';
            if (text.match(/[àâçéèêîôûù]/)) return 'FR';
            if (text.match(/[áàâãéêíóôõúç]/i)) return 'PT';
            return 'EN';
        }
        return null;
    }

    // 中文检测函数
    function containsChinese(text) {
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
                return true;
            }
        }
        return false;
    }

    // 添加样式
    function addStyles() {
        const style = document.createElement('style');
        style.id = 'translator-styles';
        style.textContent = `
            #trans_btn svg { display: none; }
            #trans_btn:not(.loading) svg:first-child, #trans_btn.loading svg:last-child { display: block; }
            #trans_btn.loading svg:last-child { animation: rotating 2s linear infinite; }
            .trans_btn { margin: 4px 10px 0; display: none; }
            .show { display: block !important; }
            .hide { display: none !important; }
            .hr-divider { margin: 7px 0; padding-top: 1px; border-width: 0; background: linear-gradient(to right, transparent, rgb(208, 208, 213), transparent); }
            .myTextTransMsg { width: 100%; overflow-wrap: break-word; display: inline-block; margin-bottom: 10px; color: ${settings.color}; font-size: ${settings.fontSize}%; }
            .trans_container { min-height: 0; max-height: none; overflow: visible; transition: min-height 0.2s ease; width: 100%; }
            @keyframes rotating { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
            #settings-panel {
                position: fixed; top: 60px; right: 10px; background: #fff; padding: 15px;
                border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 9999;
                font-family: Arial, sans-serif; width: 280px; transition: transform 0.3s ease, opacity 0.3s ease;
                transform: translateX(300px); /* 默认隐藏 */
                opacity: 0; /* 默认透明 */
            }
            #settings-panel.open { transform: translateX(0); opacity: 1; }
            #settings-panel h3 { margin: 0 0 10px; font-size: 16px; color: #333; }
            #settings-panel label { display: flex; align-items: center; margin: 8px 0; font-size: 14px; color: #555; }
            #settings-panel select, #settings-panel input[type="color"], #settings-panel input[type="number"], #settings-panel input[type="text"] {
                width: 100%; padding: 5px; margin-top: 4px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;
            }
            #settings-panel input[type="checkbox"] { margin-right: 8px; }
            #settings-panel .section { margin-top: 12px; padding-top: 10px; border-top: 1px solid #eee; }
            #settings-panel .checkbox-group { display: flex; flex-direction: column; align-items: flex-start; }
            #toggle-btn {
                position: fixed; top: 10px; right: 10px; width: 40px; height: 40px; background: #4CAF50;
                color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                cursor: pointer; z-index: 10000; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            #toggle-btn:hover { background: #45a049; }
            #forbid-toast { box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
            .custom-modal {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; padding: 15px;
                border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 10001; font-family: Arial, sans-serif;
                width: 300px; display: none; opacity: 0; transition: opacity 0.3s ease;
            }
            .custom-modal.open { display: block; opacity: 1; }
            .custom-modal h3 { margin: 0 0 10px; font-size: 16px; color: #333; }
            .custom-modal label { display: flex; align-items: center; margin: 8px 0; font-size: 14px; color: #555; }
            .custom-modal select, .custom-modal input[type="text"] {
                width: 100%; padding: 5px; margin-top: 4px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;
            }
            .custom-modal textarea {
                width: 100%; height: 100px; padding: 5px; margin-top: 4px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;
            }
            .custom-modal .section { margin-top: 12px; padding-top: 10px; border-top: 1px solid #eee; }
            .custom-modal .close-btn {
                position: absolute; top: 10px; right: 10px; background: #f44336; color: white;
                border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center;
                justify-content: center; cursor: pointer; font-size: 12px; line-height: 20px;
            }
            #customEnginesList, #preferredTermsList { max-height: 150px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; margin-top: 5px; }
            .custom-engine-item, .preferred-term-item { display: flex; justify-content: space-between; align-items: center; padding: 5px; border-bottom: 1px solid #eee; }
            .custom-engine-item button, .preferred-term-item button { background: #f44336; color: white; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; }
            .test-connection-btn { background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px; width: 100%; }
            .test-connection-btn:hover { background: #1976D2; }
            .modal-buttons { display: flex; justify-content: space-between; margin-top: 10px; }
            .modal-buttons button { padding: 5px 10px; border-radius: 4px; cursor: pointer; border: none; color: white; width: 48%; }
            .modal-buttons .save-btn { background: #4CAF50; }
        `;
        document.head.appendChild(style);
    }

    // 更新样式
    function updateStyles() {
        const style = document.getElementById('translator-styles');
        if (style) {
            style.textContent = style.textContent.replace(
                /myTextTransMsg {[^}]+}/,
                `.myTextTransMsg { width: 100%; overflow-wrap: break-word; display: inline-block; margin-bottom: 10px; color: ${settings.color}; font-size: ${settings.fontSize}%; }`
            );
            document.querySelectorAll('.myTextTransMsg').forEach(el => {
                el.style.color = settings.color;
            });
        }
    }

    // 替换输入框内容
    function replaceInputText(text) {
        const input = document.querySelector('#main .copyable-area [contenteditable="true"][role="textbox"]');
        if (!input) return;
        input.focus();
        document.execCommand('selectAll');
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text', text);
        const pasteEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer, bubbles: true });
        input.dispatchEvent(pasteEvent);
        if (settings.immediate) {
            setTimeout(() => {
                const sendBtn = document.querySelector('#main footer button[data-tab="11"]');
                if (sendBtn && !sendBtn.disabled) sendBtn.click();
            }, 10);
        }
    }

    // 获取元素
    function getElements() {
        const inputBox = document.querySelector("#main .copyable-area [contenteditable='true'][role='textbox']");
        const sendButton = document.querySelector("#main footer button[data-tab='11'].x1c4vz4f");
        return { inputBox, sendButton };
    }

    // 节流函数
    function throttle(fn, delay) {
        let timeout = null;
        return function (...args) {
            if (!timeout && !isChineseRestrictionFrozen) {
                timeout = setTimeout(() => {
                    fn.apply(this, args);
                    timeout = null;
                }, delay);
            }
        };
    }

    // 更新发送按钮状态
    const updateSendButtonState = throttle((inputBox, sendButton) => {
        if (inputBox && sendButton) {
            const text = inputBox.innerText;
            if (containsChinese(text)) {
                sendButton.setAttribute("disabled", "true");
            } else {
                sendButton.removeAttribute("disabled");
            }
        }
    }, 200);

    // 设置中文发送限制
    function setupChineseRestriction() {
        let observer;
        const interval = setInterval(() => {
            const { inputBox, sendButton } = getElements();
            if (inputBox && sendButton) {
                clearInterval(interval);

                updateSendButtonState(inputBox, sendButton);

                observer = new MutationObserver((mutations) => {
                    if (isChineseRestrictionFrozen) return;
                    mutations.forEach(() => {
                        updateSendButtonState(inputBox, sendButton);
                    });
                });

                observer.observe(inputBox, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });

                inputBox.addEventListener("keydown", (e) => {
                    if (isChineseRestrictionFrozen) return;
                    if (e.key === "Enter" && !e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                        const text = inputBox.innerText;
                        if (containsChinese(text)) {
                            e.preventDefault();
                            e.stopPropagation();
                            showChineseToast("禁止发送中文消息！");
                        }
                    }
                }, true);
            }
        }, 500);
    }

    // 处理输入框翻译
    function setupInputTranslation() {
        const inputArea = document.querySelector('#main .copyable-area [contenteditable="true"][role="textbox"]');
        if (!inputArea) {
            setTimeout(setupInputTranslation, 2000);
            return;
        }

        const oldBtn = document.getElementById('trans_btn');
        if (oldBtn) oldBtn.remove();

        const btn = document.createElement('button');
        btn.id = 'trans_btn';
        btn.style.margin = '0 10px';
        btn.innerHTML = `
            <svg t="1676293033227" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1243" width="24" height="24"><path d="M166 403.612c22.092 0 40-17.908 40-40v-62h140v62c2.112 53.072 77.906 53.032 80 0v-214c-8.264-199.044-291.81-198.89-300 0v214c0 22.092 17.908 40 40 40z m40-254c3.856-92.888 136.178-92.816 140 0v72h-140z m234.172 590.38c42.236 42.716 42.32 112.166 0. Ascend,descend,0.25 -0.25 155.988 155.988 0 0 1.244-56.554l-61.524-64.29c-15.292-15.976-40.614-16.502-56.554-1.244-15.96 15.274-16.516 40.594-1.244 56.556l42.436 44.344H212.5C95.328 859.612 0 764.286 0 647.112v-161.5c2.112-53.072 77.906-53.032 80 0v161.5c0 73.06 59.44 132.5 132.5 132.5h153.826l-46.334-45.442c-15.772-15.468-16.018-40.794-0.548-56.566s40.796-16.016 56.566-0.548l63.73 62.502 0.432 0.434zM1024 380.112v161.5c-2.112 53.072-77.906 53.032-80 0v-161.5c0-73.06-59.44-132.5-132.5-132.5h-153.826l46.334 45.442c15.772 15.468 16.018 40.794 0.548 56.566-15.478 15.778-40.802 16.01-56.566 0.548l-63.73-62.502-0.436-0.434c-42.236-42.716-42.32-112.166-0.25-154.988l61.524-64.29c15.272-15.96 40.592-16.516 56.554-1.244 15.96 15.274 16.516 40.594 1.244 56.556L660.46 167.61h151.036C928.672 167.612 1024 262.94 1024 380.112z m-60 319.5c0 22.092-17.908 40-40 40h-21.99c-4.884 42.434-39.134 130.046-84.268 180.73 26.094 14.15 57.262 23.27 94.258 23.27 22.092 0 40 17.908 40 40s-17.908 40-40 40c-57.514 0-109.952-15.826-155.89-47.042-45.574 31.018-98.234 47.042-156.11 47.042-22.092 0-40-17.908-40-40s17.908-40 40-40c34.546 0 66.088-7.724 94.44-23.066-12.404-14.704-23.884-30.858-34.378-48.398-11.342-18.958-5.168-43.52 13.79-54.862 18.956-11.344 43.52-5.168 54.862 13.788 7.5 12.534 16.55 25.656 27.34 38.332a282.312 282.312 0 0 0 17.192-22.642c27.328-39.914 41.51-81.504 47.386-107.152H588c-53.072-2.112-53.032-77.906 0-80h130v-40c2.112-53.072 77.906-53.032 80 0v40h126c22.092 0 40 17.908 40 40z" p-id="1244" fill="#0ec041"></path></svg>
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path fill="#0ec041" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"/>
            </svg>
        `;
        inputArea.parentElement.appendChild(btn);

        btn.onclick = () => {
            const text = inputArea.innerText.trim();
            if (!text || btn.classList.contains('loading')) return;
            btn.classList.add('loading');
            const detectedLang = detectLanguage(text);
            let targetLang;
            if (settings.contact_lang === 'AUTO') {
                targetLang = (detectedLang === 'MIXED' || detectedLang === null) ? settings.your_lang : (detectedLang === 'ZH' ? 'EN' : 'ZH');
            } else {
                targetLang = settings.contact_lang;
            }
            translateText(text, targetLang, (response) => {
                btn.classList.remove('loading');
                if (response.success) {
                    replaceInputText(response.text);
                } else {
                    showError(response.error);
                }
            });
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === settings.translateKey && settings.quickTranslator && document.activeElement === inputArea) {
                e.preventDefault();
                btn.click();
            }
        });
    }

    // 处理消息翻译
    function processMessages() {
        const messages = document.querySelectorAll('.message-in, .message-out');
        messages.forEach(msg => {
            const container = msg.querySelector('._21Ahp, ._akbu');
            const textSpan = container?.querySelector('.selectable-text');
            if (textSpan && !msg.classList.contains('processed')) {
                const btn = document.createElement('button');
                btn.className = 'trans_btn hide';
                btn.style.margin = '4px 10px 0';
                btn.innerHTML = '<svg t="1676293033227" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1243" width="24" height="24"><path d="M166 403.612c22.092 0 40-17.908 40-40v-62h140v62c2.112 53.072 77.906 53.032 80 0v-214c-8.264-199.044-291.81-198.89-300 0v214c0 22.092 17.908 40 40 40z m40-254c3.856-92.888 136.178-92.816 140 0v72h-140z m234.172 590.38c42.236 42.716 42.32 112.166 0.25 154.988l-61.524 64.29c-15.292 15.976-40.614 16.502-56.554 1.244-15.96-15.274-16.516-40.594-1.244-56.556l42.436-44.344H212.5C95.328 859.612 0 764.286 0 647.112v-161.5c2.112-53.072 77.906-53.032 80 0v161.5c0 73.06 59.44 132.5 132.5 132.5h153.826l-46.334-45.442c-15.772-15.468-16.018-40.794-0.548-56.566s40.796-16.016 56.566-0.548l63.73 62.502 0.432 0.434zM1024 380.112v161.5c-2.112 53.072-77.906 53.032-80 0v-161.5c0-73.06-59.44-132.5-132.5-132.5h-153.826l46.334 45.442c15.772 15.468 16.018 40.794 0.548 56.566-15.478 15.778-40.802 16.01-56.566 0.548l-63.73-62.502-0.436-0.434c-42.236-42.716-42.32-112.166-0.25-154.988l61.524-64.29c15.272-15.96 40.592-16.516 56.554-1.244 15.96 15.274 16.516 40.594 1.244 56.556L660.46 167.61h151.036C928.672 167.612 1024 262.94 1024 380.112z m-60 319.5c0 22.092-17.908 40-40 40h-21.99c-4.884 42.434-39.134 130.046-84.268 180.73 26.094 14.15 57.262 23.27 94.258 23.27 22.092 0 40 17.908 40 40s-17.908 40-40 40c-57.514 0-109.952-15.826-155.89-47.042-45.574 31.018-98.234 47.042-156.11 47.042-22.092 0-40-17.908-40-40s17.908-40 40-40c34.546 0 66.088-7.724 94.44-23.066-12.404-14.704-23.884-30.858-34.378-48.398-11.342-18.958-5.168-43.52 13.79-54.862 18.956-11.344 43.52-5.168 54.862 13.788 7.5 12.534 16.55 25.656 27.34 38.332a282.312 282.312 0 0 0 17.192-22.642c27.328-39.914 41.51-81.504 47.386-107.152H588c-53.072-2.112-53.032-77.906 0-80h130v-40c2.112-53.072 77.906-53.032 80 0v40h126c22.092 0 40 17.908 40 40z" p-id="1244" fill="#0ec041"></path></svg>';
                container.appendChild(btn);

                container.onmouseenter = () => btn.className = 'trans_btn show';
                container.onmouseleave = () => btn.className = 'trans_btn hide';

                btn.onclick = (e) => {
                    e.stopPropagation();
                    const text = textSpan.innerText.trim();
                    const detectedLang = detectLanguage(text);
                    let targetLang;
                    if (settings.contact_lang === 'AUTO') {
                        targetLang = (detectedLang === 'MIXED' || detectedLang === null) ? settings.your_lang : (detectedLang === 'ZH' ? 'EN' : 'ZH');
                    } else {
                        targetLang = settings.your_lang;
                    }
                    translateText(text, targetLang, (response) => {
                        if (response.success && text !== response.text) {
                            let transContainer = container.querySelector('.trans_container');
                            if (!transContainer) {
                                transContainer = document.createElement('div');
                                transContainer.className = 'trans_container';
                                const hr = document.createElement('hr');
                                hr.className = 'hr-divider';
                                const transText = document.createElement('span');
                                transText.className = 'myTextTransMsg selectable-text copyable-text';
                                transContainer.appendChild(hr);
                                transContainer.appendChild(transText);
                                container.appendChild(transContainer);
                            }
                            const transText = transContainer.querySelector('.myTextTransMsg');
                            transText.innerText = response.text;
                            transText.style.color = settings.color;
                            transContainer.style.minHeight = `${transText.scrollHeight + 23}px`;
                            container.removeChild(btn);
                            msg.classList.add('has_trans');
                        } else if (!response.success) {
                            showError(response.error);
                        }
                    });
                };

                if (settings.autoTranslator) btn.click();
                msg.classList.add('processed');
            }
        });
        requestAnimationFrame(processMessages);
    }

    // 切换悬浮图标和设置面板的显示/隐藏状态
    function toggleButtonVisibility() {
        const toggleBtn = document.getElementById('toggle-btn');
        const settingsPanel = document.getElementById('settings-panel');
        if (toggleBtn && settingsPanel) {
            isToggleBtnVisible = !isToggleBtnVisible;
            toggleBtn.style.display = isToggleBtnVisible ? 'flex' : 'none';
            settingsPanel.style.display = isToggleBtnVisible ? 'block' : 'none';
            if (!isToggleBtnVisible) {
                settingsPanel.classList.remove('open'); // 隐藏时关闭面板
            }
            console.log(`Toggle button and settings panel are now ${isToggleBtnVisible ? 'visible' : 'hidden'}`);
        }
    }

    // 渲染自定义引擎列表
    function renderCustomEnginesList() {
        const list = document.getElementById('customEnginesList');
        if (!list) return;
        list.innerHTML = '';
        settings.customEngines.forEach(engine => {
            const item = document.createElement('div');
            item.className = 'custom-engine-item';
            item.innerHTML = `
                <span>${engine.name}</span>
                <button class="delete-engine-btn" data-id="${engine.id}">删除</button>
            `;
            list.appendChild(item);
            item.querySelector('.delete-engine-btn').onclick = () => {
                const updatedEngines = settings.customEngines.filter(e => e.id !== engine.id);
                saveSettings({ customEngines: updatedEngines });
                renderCustomEnginesList();
                updatePlatformOptions();
            };
        });
    }

    // 渲染翻译首选词列表
    function renderPreferredTermsList() {
        const list = document.getElementById('preferredTermsList');
        if (!list) return;
        list.innerHTML = '';
        settings.preferredTerms.forEach(term => {
            const item = document.createElement('div');
            item.className = 'preferred-term-item';
            item.innerHTML = `
                <span>${term.original} -> ${term.translation}</span>
                <button class="delete-term-btn" data-id="${term.id}">删除</button>
            `;
            list.appendChild(item);
            item.querySelector('.delete-term-btn').onclick = () => {
                const updatedTerms = settings.preferredTerms.filter(t => t.id !== term.id);
                saveSettings({ preferredTerms: updatedTerms });
                renderPreferredTermsList();
            };
        });
    }

    // 更新翻译引擎下拉选项
    function updatePlatformOptions() {
        const platform = document.getElementById('platform');
        if (!platform) return;
        platform.innerHTML = `
            <option value="deepl">DeepL</option>
            <option value="glm4">智谱 GLM4 Flash</option>
            <option value="qwen-max">Qwen-Max</option>
            <option value="azure-gpt4o">Azure GPT-4o</option>
            <option value="chatgpt">ChatGPT (gpt-3.5-turbo)</option>
            <option value="siliconflow">SiliconFlow GLM-4-9B</option>
        `;
        settings.customEngines.forEach(engine => {
            const option = document.createElement('option');
            option.value = engine.id;
            option.textContent = `自定义: ${engine.name}`;
            platform.appendChild(option);
        });
        platform.value = settings.plat;
    }

    // 添加设置面板
    function addSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'settings-panel';
        panel.innerHTML = `
            <h3>翻译设置</h3>
            <div class="section">
                <label>翻译引擎:</label>
                <select id="platform">
                    <option value="deepl">DeepL</option>
                    <option value="glm4">智谱 GLM4 Flash</option>
                    <option value="qwen-max">Qwen-Max</option>
                    <option value="azure-gpt4o">Azure GPT-4o</option>
                    <option value="chatgpt">ChatGPT (gpt-3.5-turbo)</option>
                    <option value="siliconflow">SiliconFlow GLM-4-9B</option>
                </select>
                <label>我的语言:</label>
                <select id="yourLang">
                    ${languages.filter(lang => lang.val !== 'AUTO').map(lang => `<option value="${lang.val}">${lang.text}</option>`).join('')}
                </select>
                <label>联系人语言:</label>
                <select id="contactLang">
                    ${languages.map(lang => `<option value="${lang.val}">${lang.text}</option>`).join('')}
                </select>
                <label>译文颜色:</label>
                <input type="color" id="color" value="${settings.color}">
                <label>字体大小 (%):</label>
                <input type="number" id="fontSize" min="50" max="200" value="${settings.fontSize}">
            </div>
            <div class="section">
                <div class="checkbox-group">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="autoTranslate" ${settings.autoTranslator ? 'checked' : ''} style="margin-right: 8px;"> 自动翻译消息
                    </label>
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="quickTranslate" ${settings.quickTranslator ? 'checked' : ''} style="margin-right: 8px;"> 快捷翻译
                    </label>
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="immediate" ${settings.immediate ? 'checked' : ''} style="margin-right: 8px;"> 翻译后立即发送
                    </label>
                </div>
                <label>快捷键:</label>
                <select id="translateKey">
                    ${functionKeys.map(key => `<option value="${key}">${key}</option>`).join('')}
                </select>
            </div>
            <div class="section">
                <button id="customPromptBtn" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px; width: 30%;">提示词</button>
                <button id="customEngineBtn" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px; width: 30%;">自定义引擎</button>
                <button id="preferredTermBtn" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 30%;">首选词</button>
            </div>
            <div class="section">
                <button id="freeze-btn" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">冻结中文限制</button>
            </div>
        `;
        document.body.appendChild(panel);

        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'toggle-btn';
        toggleBtn.textContent = '⚙️';
        document.body.appendChild(toggleBtn);

        // 提示词弹窗
        const promptModal = document.createElement('div');
        promptModal.className = 'custom-modal';
        promptModal.id = 'promptModal';
        promptModal.innerHTML = `
            <button class="close-btn" id="closePromptModal">X</button>
            <h3>大模型提示词</h3>
            <div class="section">
                <label>自定义提示词 (自定义翻译语气):</label>
                <textarea id="customPrompt" placeholder="请输入自定义提示词，翻译时会优先使用此提示词">${settings.customPrompt}</textarea>
            </div>
            <div class="modal-buttons">
                <button class="save-btn" id="savePromptBtn">保存</button>
            </div>
        `;
        document.body.appendChild(promptModal);

        // 自定义翻译引擎弹窗
        const engineModal = document.createElement('div');
        engineModal.className = 'custom-modal';
        engineModal.id = 'engineModal';
        engineModal.innerHTML = `
            <button class="close-btn" id="closeEngineModal">X</button>
            <h3>自定义翻译引擎</h3>
            <div class="section">
                <label>引擎名称:</label>
                <input type="text" id="customEngineName" placeholder="请输入引擎名称">
                <button style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px; width: 100%;" id="addCustomEngineBtn">添加自定义引擎</button>
                <div id="customEnginesList"></div>
            </div>
            <div class="modal-buttons">
                <button class="save-btn" id="saveEngineBtn">保存</button>
            </div>
        `;
        document.body.appendChild(engineModal);

        // 首选词弹窗
        const termModal = document.createElement('div');
        termModal.className = 'custom-modal';
        termModal.id = 'termModal';
        termModal.innerHTML = `
            <button class="close-btn" id="closeTermModal">X</button>
            <h3>翻译首选词</h3>
            <div class="section">
                <label>批量输入 (每行一个，格式：原文=译文):</label>
                <textarea id="preferredTermBatch" placeholder="例如：船=vessel&#10;书=book"></textarea>
                <button style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px; width: 100%;" id="addPreferredTermBtn">添加首选词</button>
                <div id="preferredTermsList"></div>
            </div>
            <div class="modal-buttons">
                <button class="save-btn" id="saveTermBtn">保存</button>
            </div>
        `;
        document.body.appendChild(termModal);

        const platform = panel.querySelector('#platform');
        const yourLang = panel.querySelector('#yourLang');
        const contactLang = panel.querySelector('#contactLang');
        const color = panel.querySelector('#color');
        const fontSize = panel.querySelector('#fontSize');
        const autoTranslate = panel.querySelector('#autoTranslate');
        const quickTranslate = panel.querySelector('#quickTranslate');
        const immediate = panel.querySelector('#immediate');
        const translateKey = panel.querySelector('#translateKey');
        const freezeBtn = panel.querySelector('#freeze-btn');
        const customPromptBtn = panel.querySelector('#customPromptBtn');
        const customEngineBtn = panel.querySelector('#customEngineBtn');
        const preferredTermBtn = panel.querySelector('#preferredTermBtn');
        const customPrompt = promptModal.querySelector('#customPrompt');
        const customEngineName = engineModal.querySelector('#customEngineName');
        const addCustomEngineBtn = engineModal.querySelector('#addCustomEngineBtn');
        const preferredTermBatch = termModal.querySelector('#preferredTermBatch');
        const addPreferredTermBtn = termModal.querySelector('#addPreferredTermBtn');
        const savePromptBtn = promptModal.querySelector('#savePromptBtn');
        const saveEngineBtn = engineModal.querySelector('#saveEngineBtn');
        const saveTermBtn = termModal.querySelector('#saveTermBtn');
        const closePromptModal = promptModal.querySelector('#closePromptModal');
        const closeEngineModal = engineModal.querySelector('#closeEngineModal');
        const closeTermModal = termModal.querySelector('#closeTermModal');

        platform.value = settings.plat;
        yourLang.value = settings.your_lang;
        contactLang.value = settings.contact_lang;
        translateKey.value = settings.translateKey;
        customPrompt.value = settings.customPrompt;

        // 渲染自定义引擎列表和首选词列表，并更新下拉选项
        renderCustomEnginesList();
        renderPreferredTermsList();
        updatePlatformOptions();

        platform.onchange = () => saveSettings({ plat: platform.value });
        yourLang.onchange = () => saveSettings({ your_lang: yourLang.value });
        contactLang.onchange = () => saveSettings({ contact_lang: contactLang.value });
        color.onchange = () => saveSettings({ color: color.value });
        fontSize.onchange = () => saveSettings({ fontSize: fontSize.value });
        autoTranslate.onchange = () => saveSettings({ autoTranslator: autoTranslate.checked });
        quickTranslate.onchange = () => saveSettings({ quickTranslator: quickTranslate.checked });
        immediate.onchange = () => saveSettings({ immediate: immediate.checked });
        translateKey.onchange = () => saveSettings({ translateKey: translateKey.value });

        customPromptBtn.onclick = () => {
            promptModal.classList.add('open');
        };

        customEngineBtn.onclick = () => {
            engineModal.classList.add('open');
        };

        preferredTermBtn.onclick = () => {
            termModal.classList.add('open');
        };

        addCustomEngineBtn.onclick = () => {
            const name = customEngineName.value.trim();
            if (!name) {
                showError('请输入引擎名称');
                return;
            }
            const newEngine = {
                id: 'custom-' + Date.now(),
                name: name,
                apiKey: SILICONFLOW_AUTH_KEY,
                modelName: 'THUDM/GLM-4-9B-0414',
                url: 'https://api.siliconflow.cn/v1/chat/completions'
            };
            const updatedEngines = [...settings.customEngines, newEngine];
            saveSettings({ customEngines: updatedEngines });
            renderCustomEnginesList();
            updatePlatformOptions();
            customEngineName.value = '';
            showError('自定义引擎添加成功');
        };

        addPreferredTermBtn.onclick = () => {
            const batchText = preferredTermBatch.value.trim();
            if (!batchText) {
                showError('请输入首选词信息');
                return;
            }
            const lines = batchText.split('\n');
            const newTerms = [];
            lines.forEach(line => {
                const [original, translation] = line.split('=').map(part => part.trim());
                if (original && translation) {
                    newTerms.push({
                        id: 'term-' + Date.now() + Math.random().toString(36).substr(2, 9),
                        original: original,
                        translation: translation
                    });
                }
            });
            if (newTerms.length > 0) {
                const updatedTerms = [...settings.preferredTerms, ...newTerms];
                saveSettings({ preferredTerms: updatedTerms });
                renderPreferredTermsList();
                preferredTermBatch.value = '';
                showError('翻译首选词添加成功');
            } else {
                showError('无效的首选词格式');
            }
        };

        savePromptBtn.onclick = () => {
            saveSettings({ customPrompt: customPrompt.value });
            promptModal.classList.remove('open');
            showError('提示词设置已保存');
        };

        saveEngineBtn.onclick = () => {
            engineModal.classList.remove('open');
            showError('自定义引擎设置已保存');
        };

        saveTermBtn.onclick = () => {
            termModal.classList.remove('open');
            showError('首选词设置已保存');
        };

        closePromptModal.onclick = () => {
            promptModal.classList.remove('open');
        };

        closeEngineModal.onclick = () => {
            engineModal.classList.remove('open');
        };

        closeTermModal.onclick = () => {
            termModal.classList.remove('open');
        };

        freezeBtn.onclick = () => {
            isChineseRestrictionFrozen = !isChineseRestrictionFrozen;
            freezeBtn.innerText = isChineseRestrictionFrozen ? "恢复中文限制" : "冻结中文限制";
            freezeBtn.style.background = isChineseRestrictionFrozen ? "#4CAF50" : "#f44336";
            if (!isChineseRestrictionFrozen) {
                setupChineseRestriction();
            }
        };

        toggleBtn.onclick = () => {
            panel.classList.toggle('open');
            // 当面板收起时，设置透明度
            if (!panel.classList.contains('open')) {
                panel.style.opacity = '0';
            } else {
                panel.style.opacity = '1';
            }
        };

        // 添加 F10 快捷键监听
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F10') {
                e.preventDefault();
                toggleButtonVisibility();
            }
        });
    }

    // 添加油猴菜单
    function addMenuCommands() {
        GM_registerMenuCommand("悬浮图标控制 -> 显示悬浮图标", () => {
            const toggleBtn = document.getElementById('toggle-btn');
            if (toggleBtn && !isToggleBtnVisible) {
                toggleButtonVisibility();
            }
        });

        GM_registerMenuCommand("悬浮图标控制 -> 隐藏悬浮图标", () => {
            const toggleBtn = document.getElementById('toggle-btn');
            if (toggleBtn && isToggleBtnVisible) {
                toggleButtonVisibility();
            }
        });
    }

    // 等待页面加载并检测聊天切换
    function waitForMessages() {
        const observer = new MutationObserver(() => {
            const main = document.querySelector('#main');
            if (main) {
                observer.disconnect();
                addStyles();
                processMessages();
                setupInputTranslation();
                setupChineseRestriction();
                addSettingsPanel();
                addMenuCommands(); // 添加油猴菜单
                const chatObserver = new MutationObserver(() => {
                    const newInput = document.querySelector('#main .copyable-area [contenteditable="true"][role="textbox"]');
                    if (newInput && !newInput.classList.contains('processed')) {
                        setupInputTranslation();
                        setupChineseRestriction();
                        newInput.classList.add('processed');
                    }
                });
                chatObserver.observe(document.querySelector('#app'), { childList: true, subtree: true });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 主函数
    function main() {
        console.log('WhatsApp Translator with Chinese Restriction script started');
        waitForMessages();
    }

    main();
})();
