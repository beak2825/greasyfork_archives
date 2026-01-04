// ==UserScript==
// @name         Bangumi 词条信息翻译器
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  使用 Ollama/OpenAI格式的 API/Gemini API 翻译 Bangumi 的作品简介和角色简介，支持模型切换、缓存翻译记录、术语表和提示格式选择。自动检测中文,日文,英文. 
// @author       Sedoruee
// @match        https://bgm.tv/subject/*
// @match        https://bgm.tv/character/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513293/Bangumi%20%E8%AF%8D%E6%9D%A1%E4%BF%A1%E6%81%AF%E7%BF%BB%E8%AF%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/513293/Bangumi%20%E8%AF%8D%E6%9D%A1%E4%BF%A1%E6%81%AF%E7%BF%BB%E8%AF%91%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项
    const config = {
        apiType: 'ollama', // 'ollama', 'openai', 'gemini'
        ollamaEndpoint: 'http://185.60.44.146:2222/api/generate',
        openaiEndpoint: 'https://sedoruee.top/v1/chat/completions',
        openaiApiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxx',
        geminiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
        geminiApiKey: 'AIzaSxxxxxxxxxxxxxxxxx6KHl4', // Google Gemini API Key
        models: {
            ollama: {
                subject: 'qwen2.5:14b',
                character: 'qwen2.5:14b',
            },
            openai: {
                subject: 'deepseek-ai/DeepSeek-V3',
                character: 'deepseek-ai/DeepSeek-V3'
            },
            gemini: {
                subject: 'gemini-2.0-flash-exp',
                character: 'gemini-2.0-flash-exp'
            }
        },
        subject: {
            autoTranslate: 0,
            useNewPromptFormat: 1
        },
        character: {
            autoTranslate: 0,
            useNewPromptFormat: 1,
            glossary: [
                {"src": "可选", "dst": "可选", "info": "可选"},
                {"src": "可选", "dst": "可选"},
            ]
        }
    };

    // 获取页面类型和ID
    const isSubjectPage = window.location.href.includes('/subject/');
    const pageType = isSubjectPage ? 'subject' : 'character';
    const id = window.location.href.match(isSubjectPage ? /subject\/(\d+)/ : /character\/(\d+)/)[1];

    // 获取配置
    const { autoTranslate, useNewPromptFormat, glossary } = config[pageType];
    const model = config.models[config.apiType][pageType];
    const detailElement = isSubjectPage ? document.getElementById('subject_summary') : document.querySelector('div.detail');
    const cacheKey = `translatedText_${id}`; // 统一缓存键，不包含模型
    const translatedFlagKey = `translatedFlag_${id}`; // 翻译完成标记

    // 显示状态
    function displayStatus(message) {
        console.log(message);
        const statusDiv = document.getElementById('translationStatus') || document.createElement('div');
        statusDiv.id = 'translationStatus';
        statusDiv.textContent = message;
        statusDiv.style.marginTop = '5px';
        if (isSubjectPage) {
            detailElement.parentNode.insertBefore(statusDiv, detailElement.nextSibling);
        } else {
            detailElement.appendChild(statusDiv);
        }
    }

    // 检查文本是否包含中文
    function isChinese(text) {
        return /[\u4e00-\u9fa5]/.test(text);
    }

    // 检查文本是否包含日文，并检查日文占比
    function shouldTranslateJapanese(text) {
        const hiragana = [
            "あ", "い", "う", "え", "お",
            "か", "き", "く", "け", "こ",
            "さ", "し", "す", "せ", "そ",
            "た", "ち", "つ", "て", "と",
            "な", "に", "ぬ", "ね", "の",
            "は", "ひ", "ふ", "へ", "ほ",
            "ま", "み", "む", "め", "も",
            "や", "ゆ", "よ",
            "ら", "り", "る", "れ", "ろ",
            "わ", "を", "ん",
            "ぁ", "ぃ", "ぅ", "ぇ", "ぉ",
            "ゃ", "ゅ", "ょ",
            "っ",
            "が", "ぎ", "ぐ", "げ", "ご",
            "ざ", "じ", "ず", "ぜ", "ぞ",
            "だ", "ぢ", "づ", "で", "ど",
            "ば", "び", "ぶ", "べ", "ぼ",
            "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"
        ];

        const katakana = [
            "ア", "イ", "ウ", "エ", "オ",
            "カ", "キ", "ク", "ケ", "コ",
            "サ", "シ", "ス", "セ", "ソ",
            "タ", "チ", "ツ", "テ", "ト",
            "ナ", "ニ", "ヌ", "ネ", "ノ",
            "ハ", "ヒ", "フ", "ヘ", "ホ",
            "マ", "ミ", "ム", "メ", "モ",
            "ヤ", "ユ", "ヨ",
            "ラ", "リ", "ル", "レ", "ロ",
            "ワ", "ヲ", "ン",
            "ァ", "ィ", "ゥ", "ェ", "ォ",
            "ャ", "ュ", "ョ",
            "ッ",
            "ガ", "ギ", "グ", "ゲ", "ゴ",
            "ザ", "ジ", "ズ", "ゼ", "ゾ",
            "ダ", "ヂ", "ヅ", "デ", "ド",
            "バ", "ビ", "ブ", "ベ", "ボ",
            "パ", "ピ", "プ", "ぺ", "ポ"
        ];

        const japaneseChars = text.match(new RegExp(`[${hiragana.join("")}${katakana.join("")}]`, 'g')) || [];
        return japaneseChars.length / text.length >= 0.2;
    }

    // 检查文本是否包含英文，并检查英文占比
    function shouldTranslateEnglish(text) {
        const englishChars = text.match(/[a-zA-Z]/g) || [];
        return englishChars.length / text.length >= 0.60;
    }


    // 显示翻译结果
    function displayTranslation(translatedText) {
        const translatedDiv = document.createElement('div');
        translatedDiv.style.marginTop = '10px';
        translatedDiv.innerHTML = `<hr><h3>翻译结果：</h3><p>${translatedText.replace(/\n/g, '<br>')}</p>`;
        if (isSubjectPage) {
            detailElement.parentNode.insertBefore(translatedDiv, document.getElementById('translationStatus').nextSibling);
        } else {
            detailElement.appendChild(translatedDiv);
        }
    }

    // 构建 Prompt
    function buildPrompt(textToTranslate) {
        let prompt;
        if (useNewPromptFormat === 1) {
            let glossaryText = "";
            if (glossary && glossary.length > 0) {
                const glossaryLines = glossary.map(item => {
                    const info = item.info ? ` #${item.info}` : "";
                    return `${item.src}->${item.dst}${info}`;
                });
                glossaryText = "根据以下术语表：\n" + glossaryLines.join('\n') + "\n";
            }

            prompt = `<|im_start|>system\n你是一个轻小说翻译模型，可以流畅通顺地以日本轻小说的风格将日文翻译成简体中文，并联系上下文正确使用人称代词，不擅自添加原文中没有的代词。<|im_end|>\n` +
                `<|im_start|>user\n${glossaryText}将下面的日文文本翻译成中文：${textToTranslate}<|im_end|>\n` +
                `<|im_start|>assistant\n`;
        } else {
            prompt = `把这段日语文本直接翻译为中文文本,不保留任何非中文语言和额外内容: "\n\n${textToTranslate}"`;
        }
        return prompt;
    }


    // 使用 Ollama API 进行翻译
    function translateWithOllama(textToTranslate) {
        const prompt = buildPrompt(textToTranslate);
        const requestBody = { model, prompt, stream: false };

        GM_xmlhttpRequest({
            method: 'POST',
            url: config.ollamaEndpoint,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(requestBody),
            onload: function(response) {
                try {
                    const responseJson = JSON.parse(response.responseText);
                    if (responseJson.response) {
                        const translatedText = responseJson.response;
                        displayTranslation(translatedText);
                        GM_setValue(cacheKey, translatedText);
                        GM_setValue(translatedFlagKey, true); // 设置翻译完成标记
                        displayStatus("翻译完成");
                    } else {
                        displayStatus('翻译失败: ' + (responseJson.error || 'Unexpected response format.'));
                    }
                } catch (error) {
                    displayStatus('解析JSON响应失败: ' + error);
                }
            },
            onerror: function(error) {
                displayStatus('请求失败: ' + error);
            }
        });
    }


    // 使用 OpenAI 格式 API 进行翻译
    function translateWithOpenAI(textToTranslate) {
        const prompt = buildPrompt(textToTranslate);

        const requestBody = {
            model: model,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            stream: false
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: config.openaiEndpoint,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.openaiApiKey}`
            },
            data: JSON.stringify(requestBody),
            onload: function(response) {
                try {
                    const responseJson = JSON.parse(response.responseText);
                    if (responseJson.choices && responseJson.choices.length > 0) {
                        const translatedText = responseJson.choices[0].message.content;
                        displayTranslation(translatedText);
                        GM_setValue(cacheKey, translatedText);
                        GM_setValue(translatedFlagKey, true); // 设置翻译完成标记
                        displayStatus("翻译完成");
                    } else {
                        displayStatus('翻译失败: ' + (responseJson.error || 'Unexpected response format.'));
                    }
                } catch (error) {
                    displayStatus('解析JSON响应失败: ' + error);
                }
            },
            onerror: function(error) {
                displayStatus('请求失败: ' + error);
            }
        });
    }

    // 使用 Gemini API 进行翻译
    function translateWithGemini(textToTranslate) {
        const prompt = buildPrompt(textToTranslate);

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: config.geminiEndpoint + "?key=" + config.geminiApiKey,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(requestBody),
            onload: function(response) {
                try {
                    const responseJson = JSON.parse(response.responseText);
                    if (responseJson.candidates && responseJson.candidates.length > 0) {
                        const translatedText = responseJson.candidates[0].content.parts[0].text;
                        displayTranslation(translatedText);
                        GM_setValue(cacheKey, translatedText);
                        GM_setValue(translatedFlagKey, true); // 设置翻译完成标记
                        displayStatus("翻译完成");
                    } else {
                        displayStatus('翻译失败: ' + (responseJson.error || 'Unexpected response format.'));
                    }
                } catch (error) {
                    displayStatus('解析JSON响应失败: ' + error);
                }
            },
            onerror: function(error) {
                displayStatus('请求失败: ' + error);
            }
        });
    }

    // 执行翻译
    function translate() {
        try {
            const textToTranslate = detailElement.innerText;
            displayStatus("翻译中...");
            switch (config.apiType) {
                case 'ollama':
                    translateWithOllama(textToTranslate);
                    break;
                case 'openai':
                    translateWithOpenAI(textToTranslate);
                    break;
                case 'gemini':
                    translateWithGemini(textToTranslate)
                    break;
                default:
                    displayStatus('未知的API类型');
            }
        } catch (error) {
            displayStatus('翻译过程中发生错误: ' + error);
        }
    }


    displayStatus("正在检测...");

    // 检查是否已经翻译过
    const hasTranslated = GM_getValue(translatedFlagKey, false);

    if (hasTranslated) {
        displayStatus("已经翻译过，跳过...");
        const cachedData = GM_getValue(cacheKey);
        if (cachedData) {
            displayStatus("正在调用缓存...");
            displayTranslation(cachedData);
            displayStatus("调用缓存完成");
        }
    } else {
        if (shouldTranslateJapanese(detailElement.innerText) || shouldTranslateEnglish(detailElement.innerText)) {
            const cachedData = GM_getValue(cacheKey);
            if (cachedData) {
                displayStatus("正在调用缓存...");
                displayTranslation(cachedData);
                displayStatus("调用缓存完成");
                GM_setValue(translatedFlagKey, true); // 标记为已翻译，即使使用了缓存
            } else {
                displayStatus("未找到缓存，开始翻译...");
                translate();
            }
        } else {
            displayStatus("检测到中文");
        }
    }

})();