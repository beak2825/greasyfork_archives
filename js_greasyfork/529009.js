// ==UserScript==
// @name         momo ai英文助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  提供实时英文翻译、单词查询和生词本功能，墨墨背单词导入功能
// @author       Your name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @connect      127.0.0.1
// @connect      api.deepseek.com
// @connect      open.maimemo.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529009/momo%20ai%E8%8B%B1%E6%96%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529009/momo%20ai%E8%8B%B1%E6%96%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试模式
    const DEBUG = true;
    function log(...args) {
        if (DEBUG) {
            console.log('[英文阅读助手]', ...args);
        }
    }

    log('脚本开始加载');
    function localLLMParseResponse(response) {

        const cleanedText = response.replace(/<think>[\s\S]*?<\/think>/g, "")

        const regex = /{[^{}]*}/;
        const match = cleanedText.match(regex);

        if (match) {
            try {
              // 将提取到的内容解析为 JSON
              const jsonData = JSON.parse(match[0]);
          
              // 遍历 JSON 对象，生成所需的格式
              let result = "";
              for (const key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                  // 将词性缩写和词义拼接为 "v. 增强" 的格式
                  result += `${key}. ${jsonData[key].join("；")}\n`;
                }
              }
          
              return result.trim();
            } catch (e) {
              console.error("解析 JSON 时出错：", e.message);
            }
          } else {
            console.log("未找到符合条件的 JSON 内容");
          }
        // if (match && match[0]) {
        //     const jsonData = JSON.parse(match[0])
        
        //     const formatEntries = (obj) => 
        //         Object.entries(obj)
        //         .map(([pos, meanings]) => 
        //             `${pos}. ${meanings.join(', ').replace(/,(?=[^,]+$)/, ', ')}`
        //         )
        //         .join('\n');
            
        //     // 执行转换并输出
        //     return formatEntries(jsonData);
        // } else {
        //     console.log('No JSON content found.');
        // }
    }

    var config = {
        translationService: 'local', // 可选值: 'deepseek', 'momo', 'custom', 'local'
        sentenceAnalysisService: 'deepseek', // 可选值: 'deepseek', 'custom'
        deepseekAPIKey: 'sk-b69b270bf3184f2baef2e501d968f940', // DeepSeek API Key
        momoAPIKey: 'df1cd963e6b5e50ddee08b36bf7abe0b9821e313ba95a08ab0001c6240d0435d', // 墨墨背单词 API Key
    };

    // curl -X POST http://127.0.0.1:11434/api/generate -d '{"model": "llama3", "prompt": "Translate the following English text to Chinese: Hello", "stream": false}'
    // curl -X POST http://localhost:11434/api/generate -d '{"model": "deepseek-r1:7b", "prompt": "Translate the following English text to Chinese: Hello, world!", "stream": false}'
     // 翻译服务模块
     const TranslationService = {
        async translate(text) {
            if (config.translationService === 'deepseek') {
                return await this._translateWithDeepSeek(text);
            } else if (config.translationService === 'momo') {
                return await this._translateWithMomo(text);
            } else if (config.translationService === 'custom') {
                return await this._translateWithCustomService(text);
            } else if (config.translationService === 'local') {
                return await this._translateWithLocal(text);
            }
        },
        async _translateWithLocal(text) {
            // deepseek-r1:7b
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'http://127.0.0.1:11434/api/generate',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            model: "deepseek-r1:7b",
                            prompt: `
【系统角色】你精读牛津/朗文/韦氏/剑桥词典的翻译专家，
请严格按以下要求处理：
1. 基于《牛津》《朗文》《韦氏》《剑桥》词典内容翻译，对英文单词进行翻译
2. 输出必须为严格JSON格式：{ \"词性\": [\"词义1\", \"词义2\"], ... }
3. 禁止任何解释、标注、思考过程或非JSON内容
4. 词性使用英文缩写（v/n/adj/adv等）
5. 多个词义用分号分隔
6. 错误格式将导致系统奔溃！！！

【输出示例】
{
  \"n\": [\"申请\", \"应用\", \"应用程序\"],
  \"v\": [\"涂抹\", \"敷用\"],
  \"adj\": [\"应用的\", \"实用的\"]
}

现在请翻译：${text}`,
                            stream: false,
                        }),
                        onload: function(response) {
                            if (response.status >= 200 && response.status < 300) {
                                const data = JSON.parse(response.responseText);
                                resolve(data.response.trim());
                            } else {
                                reject(new Error(`HTTP error! status: ${response.status}`));
                            }
                        },
                        onerror: function(error) {
                            console.error('请求失败:', error);
                            reject(new Error(`翻译失败: ${error.message}`));
                        }
                    });
                });
        
                return response;
            } catch (error) {
                throw new Error(`翻译失败: ${error.message}`);
            }
        },

        async _translateWithDeepSeek(text) {
            try {
                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.deepseekAPIKey}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: [
                            {
                                role: "system",
                                content: "你是一个翻译助手，精读《牛津高阶英汉双解词典》，《朗文当代高级英语词典》、《韦氏词典》、《剑桥高阶英汉双解词典》。请将根据这些词典内容，对以下英文单词进行翻译。翻译的结果应该包括：词性(动词用v，名词用n，形容词用adj，副词用adv等). 词义（一个单词可能有多个词性，同一个词性可能有多个词义），只需要提供翻译结果，不要详细解释。"
                            },
                            {
                                role: "user",
                                content: text
                            }
                        ],
                        temperature: 0.3,
                        max_tokens: 1000
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.choices[0].message.content.trim();
            } catch (error) {
                throw new Error(`翻译失败: ${error.message}`);
            }
        },

        async _translateWithMomo(text) {
            // 调用墨墨背单词API进行翻译
            // 这里需要实现具体的API调用逻辑
            throw new Error('墨墨背单词翻译功能尚未实现');
        },

        async _translateWithCustomService(text) {
            // 调用自定义翻译服务
            // 这里需要实现具体的API调用逻辑
            throw new Error('自定义翻译服务尚未实现');
        }
    };

    // 长难句分析服务模块
    const SentenceAnalysisService = {
        async analyze(sentence) {
            if (config.sentenceAnalysisService === 'deepseek') {
                return await this._analyzeWithDeepSeek(sentence);
            } else if (config.sentenceAnalysisService === 'custom') {
                return await this._analyzeWithCustomService(sentence);
            }
        },

        async _analyzeWithDeepSeek(sentence) {
            try {
                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.deepseekAPIKey}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: [
                            {
                                role: "system",
                                content: "你是一个英语长难句分析助手。请为用户提供所查询句子的结构分析、翻译技巧、重点单词及单词翻译。请使用JSON格式返回，格式为：{\"structure_analysis\": \"结构分析\", \"translation_techniques\": \"翻译技巧\", \"key_words\": [{\"word\": \"单词\", \"translation\": \"翻译\"}]}。不要有任何其他多余文字。"
                            },
                            {
                                role: "user",
                                content: sentence
                            }
                        ],
                        temperature: 0.3,
                        max_tokens: 1000
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const content = data.choices[0].message.content.trim();
                const jsonMatch = content.match(/\{.*\}/s);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('无法解析长难句分析结果');
                }
            } catch (error) {
                throw new Error(`长难句分析失败: ${error.message}`);
            }
        },

        async _analyzeWithCustomService(sentence) {
            // 调用自定义长难句分析服务
            // 这里需要实现具体的API调用逻辑
            throw new Error('自定义长难句分析服务尚未实现');
        }
    };

    // 添加颜色选择器和自定义颜色存储
    let customColors = GM_getValue('customColors', {
        highlight: ['#ffc107', '#28a745', '#007bff', '#dc3545', '#6f42c1'],
        underline: ['#ffc107', '#28a745', '#007bff', '#dc3545', '#6f42c1']
    });

    // 添加文本样式存储
    let textStyles = GM_getValue('textStyles', {});

    // 样式注入
    const style = document.createElement('style');
    style.textContent = `
        .translation-tools {
            position: fixed;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: none;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
            z-index: 999999;
            font-size: 12px;
            display: none;
            padding: 0;
            user-select: none;
            min-width: 260px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
        }
        .translation-tools .tools-content {
            padding: 12px;
        }
        .tools-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 0;
        }
        .tools-row:last-child {
            margin-bottom: 0;
        }
        .tools-row-label {
            width: 42px;
            color: #1d1d1f;
            font-size: 12px;
            font-weight: 500;
            flex-shrink: 0;
            opacity: 0.8;
            letter-spacing: -0.01em;
        }
        .tools-row-content {
            display: flex;
            gap: 6px;
            flex-grow: 1;
        }
        .translation-tools button {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.9);
            color: #1d1d1f;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            margin: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .translation-tools button:hover {
            background-color: rgba(255, 255, 255, 1);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .translation-tools button:active {
            transform: scale(0.96);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .translation-tools .translate-btn,
        .translation-tools .analyze-sentence-btn {
            background-color: #0071e3;
            color: white;
        }
        .translation-tools .translate-btn:hover,
        .translation-tools .analyze-sentence-btn:hover {
            background-color: #0077ED;
        }
        .translation-tools .save-word-btn {
            background-color: rgba(0, 113, 227, 0.1);
            color: #0071e3;
        }
        .translation-tools .save-word-btn:hover {
            background-color: rgba(0, 113, 227, 0.15);
        }
        .translation-tools .show-vocab-btn,
        .translation-tools .show-style-set-btn {
            background-color: rgba(0, 0, 0, 0.05);
            color: #1d1d1f;
        }
        .translation-tools .show-vocab-btn:hover,
        .translation-tools .show-style-set-btn:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
        / * 颜色按钮样式 */
        .translation-tools .color-btn {
            width: 28px;
            height: 28px;
            padding: 0;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
        }

        .translation-tools .color-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .translation-tools .color-btn:active {
            transform: scale(0.96);
        }
        .color-btn {
            width: 28px;
            height: 28px;
            padding: 0 !important;
            border: 2px solid white !important;
            border-radius: 8px !important;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .color-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .color-btn:active {
            transform: scale(0.96);
        }
        .translation-popup {
            position: fixed;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: none;
            padding: 16px 20px;
            border-radius: 14px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
            z-index: 999999;
            font-size: 15px;
            line-height: 1.6;
            max-width: 400px;
            color: #1d1d1f;
            margin-top: 8px;
            display: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
        }
        .translation-loading {
            color: #86868b;
            font-style: normal;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
        }
        .translation-loading::after {
            content: '';
            width: 18px;
            height: 18px;
            border: 2px solid rgba(0, 113, 227, 0.2);
            border-top-color: #0071e3;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .example-sentences ,.vocabulary-list {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #eee;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 999998;
            width: 300px;
            max-height: 80vh;
            overflow-y: auto;
            display: none;
        }
        .vocabulary-list-header {
            padding: 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
        }
        .vocabulary-list-content {
            padding: 10px;
        }
        .vocabulary-item {
            padding: 5px 0;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
        }
        .vocabulary-item:last-child {
            border-bottom: none;
        }
        .vocabulary-word {
            font-weight: bold;
        }
        .vocabulary-translation {
            color: #666;
            font-size: 13px;
        }
        .text-style-tools {
            display: flex;
            gap: 5px;
            padding: 4px;
            border-top: 1px solid #eee;
            margin-top: 4px;
        }
        .style-btn {
            padding: 2px 6px;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        .style-btn:hover {
            background: #f5f5f5;
        }
        .highlight-yellow {
            background-color: #fff3cd;
        }
        .highlight-green {
            background-color: #d4edda;
        }
        .highlight-blue {
            background-color: #cce5ff;
        }
        .underline {
            text-decoration: underline;
        }
        .delete-word {
            color: #dc3545;
            cursor: pointer;
            font-size: 12px;
            padding: 2px 6px;
        }
        .delete-word:hover {
            background: #fee;
            border-radius: 3px;
        }
        .color-picker-container {
            position: relative;
            display: inline-block;
            margin-left: 4px;
        }

        .color-picker-btn {
            width: 24px;
            height: 24px;
            padding: 0;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            background: linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff);
            position: relative;
        }

        .color-picker-btn::after {
            content: "+";
            position: absolute;
            right: -6px;
            top: -6px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 50%;
            width: 14px;
            height: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #666;
        }

        .color-picker-btn:hover::after {
            background: #f0f0f0;
        }

        .color-picker-panel {
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 999999;
            display: none;
            width: 200px;
            margin-top: 5px;
        }

        .color-picker-panel.active {
            display: block !important;
        }

        .preset-colors {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 4px;
            margin-bottom: 12px;
        }

        .preset-color {
            width: 24px;
            height: 24px;
            border-radius: 3px;
            cursor: pointer;
            border: 1px solid #ddd;
            transition: transform 0.2s;
        }

        .preset-color:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .color-input-group {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f8f9fa;
            padding: 8px;
            border-radius: 4px;
        }

        .color-input {
            width: 100px;
            height: 24px;
            padding: 0;
            border: 1px solid #ddd;
            border-radius: 3px;
        }

        .apply-color-btn {
            padding: 4px 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
        }

        .apply-color-btn:hover {
            background: #45a049;
        }

        .vocabulary-search {
            padding: 10px;
            border-bottom: 1px solid #eee;
            background: #f8f9fa;
        }
        .vocabulary-search input {
            width: 95%;
            padding: 6px 0px 6px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
        }
        .vocabulary-search input:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        .vocabulary-item.hidden {
            display: none;
        }
        .no-results {
            padding: 10px;
            color: #666;
            text-align: center;
            font-style: italic;
        }
        .style-set-list {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #eee;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 999998;
            width: 300px;
            max-height: 80vh;
            overflow-y: auto;
            display: none;
        }
        .style-set-header {
            padding: 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
        }
        .style-set-content {
            padding: 10px;
        }
        .style-set-item {
            padding: 12px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .style-set-content {
            flex-grow: 1;
            margin-right: 16px;
        }
        .style-set-word {
            font-size: 14px;
            margin-bottom: 6px;
        }
        .style-set-info {
            font-size: 12px;
            color: #666;
        }
        .style-info {
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 4px;
            margin-right: 6px;
        }
        .style-set-actions {
            display: flex;
            gap: 8px;
        }
        .style-set-actions .style-btn {
            padding: 4px 8px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            color: #dc3545;
            transition: all 0.2s ease;
        }
        .style-set-actions .style-btn:hover {
            background: #fee;
            border-color: #dc3545;
        }
        .draggable-header {
            cursor: move;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            background: rgba(255, 255, 255, 0.8);
            border-radius: 12px 12px 0 0;
            position: relative;
            z-index: 1;
            font-weight: 500;
            color: #1d1d1f;
            letter-spacing: -0.01em;
            font-size: 12px;
        }
        .pin-button {
            padding: 4px 8px;
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            font-size: 14px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        .pin-button:hover {
            background: rgba(0, 0, 0, 0.05);
            color: #333;
            transform: translateY(-1px);
        }
        .pin-button.pinned {
            color: #0071e3;
        }
        .vocabulary-list-header,
        .style-set-header {
            cursor: move;
            user-select: none;
        }
        .vocabulary-list.pinned,
        .style-set-list.pinned,
        .translation-tools.pinned {
            box-shadow: 0 4px 24px rgba(0, 113, 227, 0.15), 0 2px 4px rgba(0, 113, 227, 0.1);
        }
        .header-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .word-details {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 14px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
            padding: 16px;
            margin-top: 10px;
            color: #1d1d1f;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
            z-index: 999999;
            width: 400px;
            position: fixed;
            cursor: default;
        }

        .word-details-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            cursor: move;
        }

        .word-details-title {
            font-weight: 500;
            font-size: 14px;
            color: #555;
        }

        .word-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1d1d1f;
        }

        .word-phonetic {
            color: #86868b;
            font-size: 14px;
            margin-bottom: 12px;
        }

        .word-definition {
            margin-bottom: 16px;
        }

        .definition-item {
            margin-bottom: 8px;
            line-height: 1.5;
        }

        .part-of-speech {
            font-weight: 500;
            color: #0071e3;
            margin-right: 6px;
        }

        .definition-text {
            color: #1d1d1f;
        }

        .examples-section {
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            padding-top: 12px;
        }

        .examples-title {
            font-weight: 500;
            margin-bottom: 8px;
            color: #1d1d1f;
        }

        .example-item {
            margin-bottom: 12px;
            background: rgba(0, 0, 0, 0.02);
            padding: 10px 12px;
            border-radius: 8px;
        }

        .example-text {
            color: #1d1d1f;
            margin-bottom: 4px;
            line-height: 1.5;
        }

        .example-translation {
            color: #86868b;
            font-size: 14px;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(style);
    log('样式已注入');

    // 创建工具栏
    const toolsPopup = document.createElement('div');
    toolsPopup.className = 'translation-tools';
    toolsPopup.innerHTML = `
        <div class="draggable-header tools-pin-header">
            <div class="header-actions">
                <button class="pin-button" title="钉住">📌</button>
            </div>
        </div>
        <div>加载中...</div>
    `;
    document.body.appendChild(toolsPopup);
    log('工具栏已创建');

    // 创建翻译结果弹窗
    const translationPopup = document.createElement('div');
    translationPopup.className = 'translation-popup';
    document.body.appendChild(translationPopup);
    log('翻译弹窗已创建');

    // 创建单词详情弹窗
    const wordDetailsPopup = document.createElement('div');
    wordDetailsPopup.className = 'translation-popup word-details';
    document.body.appendChild(wordDetailsPopup);
    log('单词详情弹窗已创建');

    // 创建长难句分析弹窗
    const sentenceAnalysisPopup = document.createElement('div');
    sentenceAnalysisPopup.className = 'translation-popup sentence-analysis';
    document.body.appendChild(sentenceAnalysisPopup);
    log('长难句分析弹窗已创建');

    // 创建例句库弹窗
    const exampleSentencesPopup = document.createElement('div');
    exampleSentencesPopup.className = 'translation-popup example-sentences';
    exampleSentencesPopup.innerHTML = `
        <div class="example-sentences-header">
            <div class="example-sentences-title">例句库 - 拖动此处可移动</div>
            <div class="header-actions">
                <button class="pin-button" title="钉住">📌</button>
                <button id="export-example-sentences">导出</button>
                <button id="close-example-sentences">关闭</button>
            </div>
        </div>
        <div class="vocabulary-search">
            <input type="text" id="example-search" placeholder="搜索例句..." />
        </div>
        <div class="example-sentences-content"></div>
    `;
    document.body.appendChild(exampleSentencesPopup);
    log('例句库弹窗已创建');

    const vocabularySearch= document.querySelector(".vocabulary-search");
    vocabularySearch.style.cssText = `
        padding: 0px;
    `
    const exampleSearchInput = exampleSentencesPopup.querySelector('#example-search');
    exampleSearchInput.style.cssText = `
        padding: 6px 0px 6px 6px;
        width: 392px;
    `
    if (exampleSearchInput) {
        exampleSearchInput.addEventListener('input', debounce((e) => {
            searchExampleSentences(e.target.value.trim());
        }, 300));
    }

    function searchExampleSentences(searchTerm) {
        const content = exampleSentencesPopup.querySelector('.example-sentences-content');
        const items = content.querySelectorAll('.example-sentence-item');
        let hasResults = false;
    
        items.forEach(item => {
            const exampleText = item.querySelector('.example-text').textContent.toLowerCase();
            const translationText = item.querySelector('.example-translation')?.textContent.toLowerCase() || '';
            const matches = exampleText.includes(searchTerm.toLowerCase()) ||
                             translationText.includes(searchTerm.toLowerCase());
    
            item.style.display = matches ? '' : 'none';
            if (matches) hasResults = true;
        });
    
        // Show no results message
        const noResultsMsg = content.querySelector('.no-results');
        if (!hasResults && searchTerm) {
            if (!noResultsMsg) {
                const msg = document.createElement('div');
                msg.className = 'no-results';
                msg.textContent = '未找到匹配的例句';
                content.appendChild(msg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // 添加单词详情相关的样式
    const wordDetailsStyle = document.createElement('style');
    wordDetailsStyle.textContent = `
        .word-details {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 14px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
            padding: 16px;
            margin-top: 10px;
            color: #1d1d1f;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
            z-index: 999999;
            width: 400px;
            position: fixed;
            cursor: default;
        }

        .word-details-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            cursor: move;
        }

        .word-details-title {
            font-weight: 500;
            font-size: 14px;
            color: #555;
        }

        .word-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1d1d1f;
        }

        .word-phonetic {
            color: #86868b;
            font-size: 14px;
            margin-bottom: 12px;
        }

        .word-definition {
            margin-bottom: 16px;
        }

        .definition-item {
            margin-bottom: 8px;
            line-height: 1.5;
        }

        .part-of-speech {
            font-weight: 500;
            color: #0071e3;
            margin-right: 6px;
        }

        .definition-text {
            color: #1d1d1f;
        }

        .examples-section {
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            padding-top: 12px;
        }

        .examples-title {
            font-weight: 500;
            margin-bottom: 8px;
            color: #1d1d1f;
        }

        .example-item {
            margin-bottom: 12px;
            background: rgba(0, 0, 0, 0.02);
            padding: 10px 12px;
            border-radius: 8px;
        }

        .example-text {
            color: #1d1d1f;
            margin-bottom: 4px;
            line-height: 1.5;
        }

        .example-translation {
            color: #86868b;
            font-size: 14px;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(wordDetailsStyle);
    log('单词详情样式已注入');

    // 创建生词本列表
    const vocabularyList = document.createElement('div');
    vocabularyList.className = 'vocabulary-list';
    vocabularyList.innerHTML = `
        <div class="vocabulary-list-header">
            <div>
                <span>生词本：</span>
                <span id="vocabulary-count"></span>
            </div>
            <div class="header-actions">
                <button class="pin-button" title="钉住">📌</button>
                <button class="style-btn" id="export-vocab-list">导出</button>
                <button class="style-btn" id="close-vocab-list">关闭</button>
            </div>
        </div>
        <div class="vocabulary-search">
            <input type="text" id="vocab-search" placeholder="搜索单词..." />
        </div>
        <div class="vocabulary-list-content"></div>
    `;
    document.body.appendChild(vocabularyList);

    // 创建生词样式集列表
    const styleSetList = document.createElement('div');
    styleSetList.className = 'style-set-list';
    styleSetList.innerHTML = `
        <div class="style-set-header">
            <span>生词样式集</span>
            <div class="header-actions">
                <button class="pin-button" title="钉住">📌</button>
                <button class="style-btn" id="close-style-set">关闭</button>
            </div>
        </div>
        <div class="vocabulary-search">
            <input type="text" id="style-set-search" placeholder="搜索标记的单词..." />
        </div>
        <div class="style-set-content"></div>
    `;
    document.body.appendChild(styleSetList);

    // 获取选中文本的位置
    function getSelectionCoordinates() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // 转换为页面坐标
        return {
            left: rect.left + window.pageXOffset,
            top: rect.top + window.pageYOffset,
            width: rect.width,
            height: rect.height
        };
    }

    // 添加长难句分析相关的样式
    const sentenceAnalysisStyle = document.createElement('style');
    sentenceAnalysisStyle.textContent = `
        .sentence-analysis {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 14px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
            padding: 16px;
            margin-top: 10px;
            color: #1d1d1f;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
            z-index: 999999;
            width: 500px;
            position: fixed;
            cursor: default;
        }

        .sentence-analysis-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            cursor: move;
        }

        .sentence-analysis-title {
            font-weight: 500;
            font-size: 14px;
            color: #555;
        }

        .sentence-analysis-content {
            max-height: 400px;
            overflow-y: auto;
        }

        .sentence-analysis-section {
            margin-bottom: 16px;
        }

        .sentence-analysis-section-title {
            font-weight: 500;
            margin-bottom: 8px;
            color: #1d1d1f;
        }

        .sentence-analysis-section-content {
            color: #1d1d1f;
            line-height: 1.5;
        }

        .sentence-analysis-section-content ul {
            margin: 0;
            padding-left: 20px;
        }

        .sentence-analysis-section-content li {
            margin-bottom: 8px;
        }

        .sentence-analysis-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }

        .sentence-analysis-actions button {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }

        .sentence-analysis-actions .primary-button {
            background-color: #0071e3;
            color: white;
        }

        .sentence-analysis-actions .primary-button:hover {
            background-color: #0077ED;
            transform: translateY(-1px);
        }

        .sentence-analysis-actions .secondary-button {
            background-color: rgba(0, 0, 0, 0.05);
            color: #1d1d1f;
        }

        .sentence-analysis-actions .secondary-button:hover {
            background-color: rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }
    `;
    document.head.appendChild(sentenceAnalysisStyle);

    // 添加例句库相关的样式
    const exampleSentencesStyle = document.createElement('style');
    exampleSentencesStyle.textContent = `
        .example-sentences {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 14px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
            padding: 16px;
            margin-top: 10px;
            color: #1d1d1f;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
            z-index: 999999;
            width: 500px;
            position: fixed;
            cursor: default;
        }

        .example-sentences-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            cursor: move;
        }

        .example-sentences-title {
            font-weight: 500;
            font-size: 14px;
            color: #555;
        }

        .example-sentences-content {
            max-height: 400px;
            overflow-y: auto;
        }

        .example-sentences-section {
            margin-bottom: 16px;
        }

        .example-sentences-section-title {
            font-weight: 500;
            margin-bottom: 8px;
            color: #1d1d1f;
        }

        .example-sentences-section-content {
            color: #1d1d1f;
            line-height: 1.5;
        }

        .example-sentences-section-content ul {
            margin: 0;
            padding-left: 20px;
        }

        .example-sentences-section-content li {
            margin-bottom: 8px;
        }

        .example-sentences-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }

        .example-sentences-actions button {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }

        .example-sentences-actions .primary-button {
            background-color: #0071e3;
            color: white;
        }

        .example-sentences-actions .primary-button:hover {
            background-color: #0077ED;
            transform: translateY(-1px);
        }

        .example-sentences-actions .secondary-button {
            background-color: rgba(0, 0, 0, 0.05);
            color: #1d1d1f;
        }

        .example-sentences-actions .secondary-button:hover {
            background-color: rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }
    `;
    document.head.appendChild(exampleSentencesStyle);
    log('例句库样式已注入');

    // 生词本数据结构
    let vocabulary = GM_getValue('vocabulary', {});
    log('生词本加载完成，当前词数：', Object.keys(vocabulary).length);

    // 当前选中的文本
    let currentSelection = '';

    // 保存文本样式
    function saveTextStyle(text, style, color) {
        if (!textStyles[text]) {
            textStyles[text] = {
                styles: [],
                timestamp: Date.now()
            };
        }

        // 检查是否已存在相同类型的样式
        const existingIndex = textStyles[text].styles.findIndex(s => s.type === style);
        if (existingIndex >= 0) {
            textStyles[text].styles[existingIndex] = { type: style, color: color };
        } else {
            textStyles[text].styles.push({ type: style, color: color });
        }

        textStyles[text].timestamp = Date.now(); // 更新时间戳
        GM_setValue('textStyles', textStyles);

        // 如果这个词已经在生词本中，也更新生词本中的样式
        if (vocabulary[text]) {
            vocabulary[text].styles = textStyles[text].styles;
            GM_setValue('vocabulary', vocabulary);
        }

        log('保存文本样式：', text, textStyles[text]);

        // 立即重新标记页面上的单词
        autoMarkSavedWords();
    }

    // 修改应用文本样式函数
    function applyStyle(selection, style, color) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');

        if (style === 'highlight') {
            span.style.backgroundColor = color;
        } else if (style === 'underline') {
            span.style.borderBottom = `2px solid ${color}`;
        }

        const text = selection.toString().trim();
        saveTextStyle(text, style, color);
        range.surroundContents(span);
    }

    // 修改自动标记函数，同时处理生词本和已标记文本
    function autoMarkSavedWords() {
        if (document.body.dataset.autoMarked === 'true') return;

        // 确保textStyles已经被加载
        textStyles = GM_getValue('textStyles', {});

        // 合并需要处理的文本
        const wordsToMark = [
            ...Object.entries(vocabulary)
                .filter(([_, data]) => data.styles?.length > 0)
                .map(([word, data]) => ({ text: word, styles: data.styles })),
            ...Object.entries(textStyles)
                .map(([text, data]) => ({ text, styles: data.styles }))
        ]
        .filter((item, index, self) => // 去重
            index === self.findIndex((t) => t.text === item.text)
        )
        .sort((a, b) => b.text.length - a.text.length);

        if (wordsToMark.length === 0) {
            document.body.dataset.autoMarked = 'true';
            return;
        }

        // 构建单个正则表达式
        const wordPattern = wordsToMark
            .map(({ text }) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');
        const regex = new RegExp(`\\b(${wordPattern})\\b`, 'g');

        // 创建样式映射
        const styleMap = new Map(wordsToMark.map(item => [item.text, item.styles]));

        // 重置已标记状态
        document.body.dataset.autoMarked = 'false';

        // 分批处理节点
        const BATCH_SIZE = 50;
        let processedNodes = 0;
        let isProcessing = false;

        function processNodes() {
            if (isProcessing) return;
            isProcessing = true;

            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        const parent = node.parentNode;
                        if (!parent) return NodeFilter.FILTER_REJECT;

                        // 排除不需要处理的元素
                        if (parent.nodeName === 'SCRIPT' ||
                            parent.nodeName === 'STYLE' ||
                            parent.nodeName === 'TEXTAREA' ||
                            parent.nodeName === 'INPUT' ||
                            parent.closest('.translation-tools') ||
                            parent.closest('.translation-popup') ||
                            parent.closest('.vocabulary-list') ||
                            parent.closest('.style-set-list') ||
                            parent.closest('[data-marked="true"]')) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            let node;
            let nodesInBatch = 0;
            let hasMoreNodes = true;

            requestAnimationFrame(() => {
                while (nodesInBatch < BATCH_SIZE && (node = walker.nextNode())) {
                    const text = node.textContent;
                    if (!regex.test(text)) continue;

                    let modified = text;
                    let hasMatch = false;
                    modified = modified.replace(regex, (match) => {
                        const styles = styleMap.get(match);
                        if (!styles) return match;

                        hasMatch = true;
                        let html = match;
                        styles.forEach(style => {
                            if (style.type === 'highlight') {
                                html = `<span style="background-color: ${style.color}">${html}</span>`;
                            } else if (style.type === 'underline') {
                                html = `<span style="border-bottom: 2px solid ${style.color}">${html}</span>`;
                            }
                        });
                        return html;
                    });

                    if (hasMatch && node.parentNode) {
                        const span = document.createElement('span');
                        span.setAttribute('data-marked', 'true');
                        span.innerHTML = modified;
                        node.parentNode.replaceChild(span, node);
                        nodesInBatch++;
                    }
                }

                processedNodes += nodesInBatch;
                hasMoreNodes = !!walker.nextNode();

                if (hasMoreNodes) {
                    isProcessing = false;
                    setTimeout(processNodes, 0);
                } else {
                    document.body.dataset.autoMarked = 'true';
                    isProcessing = false;
                    log('完成标记所有保存的单词样式');
                }
            });
        }

        processNodes();
    }

    // 修改保存单词到生词本的逻辑
    function saveWordToRepository(word) {
        if (!vocabulary[word]) {
        vocabulary[word] = {
            timestamp: Date.now(),
            translation: '',
            styles: textStyles[word] || [] // 如果文本已有样式，则继承样式
        };
        }

        GM_setValue('vocabulary', vocabulary);
        showNotification(`${word} 成功添加到生词本`, 'success');
        log('保存单词到生词本：', word, vocabulary[word]);
    }

    // 更新工具栏内容
    function updateToolsPopup(selectedText) {
        const isWordInVocabulary = vocabulary[selectedText] !== undefined;

        toolsPopup.innerHTML = `
            <div class="tools-content">
                ${selectedText.split(/\s+/).length === 1 ? `
                    <div class="tools-row">
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button class="lookup-word-btn">墨墨翻译</button>
                                <button class="translate-btn-local">本地翻译</button>
                                <button class="translate-btn">DeepSeek翻译</button>
                        </div>
                    </div>
                `: ''}

                <div class="tools-row">
                    <button class="show-example-sentences-btn">例句库</button>
                    <button class="analyze-sentence-btn">DeepSeek长难句分析</button>
                </div>
                ${selectedText.split(/\s+/).length === 1 ? `
                    <div class="tools-row">
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button class="save-word-btn" ${isWordInVocabulary ? 'disabled' : ''}>${isWordInVocabulary ? '已在生词本' : '加入生词本'}</button>
                            <button class="show-vocab-btn">生词本</button>
                            <button class="show-style-set-btn">样式集</button>
                            
                        </div>
                    </div>
                ` : ''}
                <div class="tools-row">
                    <div class="tools-row-label">标记</div>
                    <div class="tools-row-content">
                        ${customColors.highlight.map((color, index) => `
                            <button class="color-btn"
                                    style="background-color: ${color} !important;"
                                    data-style="highlight"
                                    data-color="${color}"
                                    data-index="${index}"
                                    title="标记颜色"></button>
                        `).join('')}
                    </div>
                </div>
                <div class="tools-row">
                    <div class="tools-row-label">下划线</div>
                    <div class="tools-row-content">
                        ${customColors.underline.map((color, index) => `
                            <button class="color-btn"
                                    style="background-color: ${color} !important;"
                                    data-style="underline"
                                    data-color="${color}"
                                    data-index="${index}"
                                    title="下划线颜色"></button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    // 在文档开始时初始化全局变量
    window.lastTranslatedWord = null;
    window.isDeepSeekTranslation = false;

    // 清除点击事件处理函数，以便完全重新实现
    toolsPopup.addEventListener('click', async function(e) {
        const target = e.target;

        if (target.classList.contains('translate-btn') || target.classList.contains('translate-btn-local')) {
            // 显示翻译加载状态
            translationPopup.innerHTML = '<span class="translation-loading">正在翻译...</span>';
            translationPopup.style.display = 'block';

            // 定位翻译结果框（固定在工具栏下方）
            if(wordDetailsPopup.style.display == 'block'){
                const toolsRect = wordDetailsPopup.getBoundingClientRect();
                const left = toolsRect.left;
                const top = toolsRect.bottom + 10;
    
                translationPopup.style.left = left + 'px';
                translationPopup.style.top = top + 'px';
    
            } else {
                const toolsRect = toolsPopup.getBoundingClientRect();
                const left = toolsRect.right+10;
                const top = toolsRect.top;
    
                translationPopup.style.left = left + 'px';
                translationPopup.style.top = top + 'px';    
            }
            
 
            // 设置标记，阻止自动调用墨墨翻译
            window.isDeepSeekTranslation = true;

            if(target.classList.contains('translate-btn')){
                console.log('deepseek翻译');
                
                config.translationService = 'deepseek'
            }else {
                console.log('本地翻译');
                
                config.translationService = 'local'
            }
            // 执行翻译
            const translation = await translateWord(currentSelection);

            // 添加拖拽功能到翻译弹窗
            if (!translationPopup.dataset.draggableInitialized) {
                initDraggableForPopup(translationPopup);
                translationPopup.dataset.draggableInitialized = 'true';
            }

            translationPopup.innerHTML = translation;

            // 延迟重置标记
            setTimeout(() => {
                window.isDeepSeekTranslation = false;
            }, 200);

        } else if (target.classList.contains('lookup-word-btn')) {
            // 直接调用墨墨翻译，这里需要重置lastTranslatedWord以确保能响应重复点击
            e.preventDefault();
            e.stopPropagation();
            lookupWord(currentSelection);
        } else if (target.classList.contains('save-word-btn')) {
            const word = currentSelection;
            saveWordToRepository(word); // 使用新的保存函数
            target.textContent = '已在生词本';
            target.disabled = true;
            showVocabularyList();
            showNotification(`单词 "${word}" 已加入生词本`,'success')
        } else if (target.classList.contains('color-btn')) {
            const style = target.dataset.style;
            const color = target.dataset.color;
            if (style && color) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    applyStyle(selection, style, color);
                }
            }
        } else if (target.classList.contains('show-example-sentences-btn')){
            e.preventDefault();
            e.stopPropagation();
            showExampleSentences();
        } else if (target.classList.contains('show-vocab-btn')){
            e.preventDefault();
            e.stopPropagation();
            showVocabularyList();
        } else if (target.classList.contains('show-style-set-btn')){
            e.preventDefault();
            e.stopPropagation();
            showStyleSet();
        } else if (target.classList.contains('analyze-sentence-btn')){
            e.preventDefault();
            e.stopPropagation();
            analyzeSentence(currentSelection);
        }
    });

    
    // 显示例句库
    function showExampleSentences() {
        if (!exampleSentencesPopup) {
            console.error('例句库弹窗未正确初始化');
            return;
        }
        console.log("例句库弹窗初始化");
        // Toggle visibility
        if (exampleSentencesPopup.style.display === 'block') {
            exampleSentencesPopup.style.display = 'none';
        } else {
            exampleSentencesPopup.style.display = 'block';
            updateExampleSentences();
        }
    }

    // 更新例句库显示
    function updateExampleSentences() {
        const content = exampleSentencesPopup.querySelector('.example-sentences-content');
        if (!content) {
            console.error('例句库内容区域未找到');
            return;
        }
    // 使用更美观的 Markdown 格式显示例句
    content.innerHTML = sentenceAnalysisResults
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((analysis, index) => {
            // 将结构分析和翻译技巧按句号分割成列表项
            const structureAnalysisList = analysis.analysis.structure_analysis
                .split(/。+/)
                .filter(s => s.trim())
                .map(s => s.trim() + '。')
                .join('\n');

            const translationTechniquesList = analysis.analysis.translation_techniques
                .split(/。+/)
                .filter(s => s.trim())
                .map(s => s.trim() + '。')
                .join('\n');

            return `
                <div class="example-sentence-item">
                    <div class="example-sentence-header">
                        <span class="example-number">例句 ${index + 1}</span>
                        <button class="delete-sentence-analysis" data-index="${index}">删除</button>
                    </div>
                    <div class="example-card">
                        <div class="example-section">
                            <div class="section-title">📝 原文</div>
                            <div class="section-content">${analysis.sentence}</div>
                        </div>
                        <div class="analysis-section">
                            <div class="section-title">🔍 结构分析</div>
                            <div class="section-content">
                                ${structureAnalysisList}
                            </div>
                        </div>
                        <div class="analysis-section">
                            <div class="section-title">🎯 翻译技巧</div>
                            <div class="section-content">
                                ${translationTechniquesList}
                            </div>
                        </div>
                        <div class="analysis-section">
                            <div class="section-title">📌 重点单词</div>
                            <div class="keywords-list">
                                ${analysis.analysis.key_words.map(kw => `
                                    <div class="keyword-item">
                                        <span class="keyword-word">${kw.word}</span>
                                        <span class="keyword-translation">${kw.translation}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('') || '<div style="padding: 10px; color: #666;">暂无长难句分析结果</div>';

        // 添加事件监听
        const exportExampleSentencesBtn = exampleSentencesPopup.querySelector('#export-example-sentences');
        const closeExampleSentencesBtn = exampleSentencesPopup.querySelector('#close-example-sentences');

        if (exportExampleSentencesBtn) {
            exportExampleSentencesBtn.removeEventListener('click', exportExampleSentences);
            exportExampleSentencesBtn.addEventListener('click', exportExampleSentences);
        }

        if (closeExampleSentencesBtn) {
            // closeExampleSentencesBtn.removeEventListener('click', closeExampleSentences);
            closeExampleSentencesBtn.addEventListener('click', () => {
                exampleSentencesPopup.style.display = 'none';
            });
        }
    }
    // 导出例句库
    function exportExampleSentences() {
        
        const markdownContent = `# 例句库分析报告\n\n` + 
        sentenceAnalysisResults
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((analysis, index) => {
                // 将结构分析和翻译技巧按句号分割成列表项
                const structureAnalysisList = analysis.analysis.structure_analysis
                    .split(/。+/)
                    .filter(s => s.trim())
                    .map(s => `- ${s.trim()}。`)
                    .join('\n');

                const translationTechniquesList = analysis.analysis.translation_techniques
                    .split(/。+/)
                    .filter(s => s.trim())
                    .map(s => `- ${s.trim()}。`)
                    .join('\n');

                return `
## 例句 ${index + 1}

### 原文
${analysis.sentence}

### 结构分析
${structureAnalysisList}

### 翻译技巧
${translationTechniquesList}

### 重点单词
${analysis.analysis.key_words.map(kw => `- **${kw.word}**: ${kw.translation}`).join('\n')}

---
`;
            }).join('\n');

        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `例句库分析报告_${new Date().toLocaleDateString().replace(/\//g, '')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('例句库已导出', 'success');
    }

    // 长难句分析
    async function analyzeSentence(sentence) {
        log('开始长难句分析...', sentence);
        showNotification('开始长难句分析...', 'success', 10000)
        sentenceAnalysisPopup.innerHTML = '<span class="translation-loading">正在分析长难句...</span>';
        sentenceAnalysisPopup.style.display = 'block';

        try {
            const analysisResult = await SentenceAnalysisService.analyze(sentence);
            saveSentenceToExampleLibrary(sentence, analysisResult);
            displaySentenceAnalysis(sentence, analysisResult);
        } catch (error) {
            log('长难句分析出错：', error);
            sentenceAnalysisPopup.innerHTML = `
                <div class="sentence-analysis-header">
                    <div class="sentence-analysis-title">长难句分析 - 拖动此处可移动</div>
                </div>
                <div class="sentence-analysis-content">
                    <div class="sentence-analysis-section">
                        <div class="sentence-analysis-section-title">错误</div>
                        <div class="sentence-analysis-section-content">
                            <p>长难句分析失败: ${error.message || '服务暂时不可用'}</p>
                        </div>
                    </div>
                </div>
                <div class="sentence-analysis-actions">
                    <button class="secondary-button" id="close-sentence-analysis">关闭</button>
                </div>
            `;

            // 添加事件监听
            sentenceAnalysisPopup.querySelector('#close-sentence-analysis').addEventListener('click', () => {
                sentenceAnalysisPopup.style.display = 'none';
            });
        }
    }
    
    let sentenceAnalysisResults = GM_getValue('sentenceAnalysisResults', []);
    // 保存长难句分析结果到例句库
    function saveSentenceToExampleLibrary(sentence, analysisResult) {

        // 将分析结果保存到例句库
        sentenceAnalysisResults.push({
            sentence: sentence,
            analysis: analysisResult,
            timestamp: Date.now()
        });

        GM_setValue('exampleLibrary', sentenceAnalysisResults);
        log('长难句分析结果已保存到例句库');
        showNotification('长难句分析结果已保存到例句库', 'success', 3000)
    }

    // 显示长难句分析结果
    function displaySentenceAnalysis(sentence, analysisResult) {
        log('显示长难句分析结果:', analysisResult);

        const structureAnalysis = analysisResult.structure_analysis || '暂无结构分析';
        const translationTechniques = analysisResult.translation_techniques || '暂无翻译技巧';
        const keyWords = analysisResult.key_words || [];

        const keyWordsHTML = keyWords.map(word => `
            <li><strong>${word.word}</strong>: ${word.translation || '暂无翻译'}</li>
        `).join('');

        sentenceAnalysisPopup.innerHTML = `
            <div class="sentence-analysis-header">
                <div class="sentence-analysis-title">长难句分析 - 拖动此处可移动</div>
            </div>
            <div class="sentence-analysis-content">
                <div class="sentence-analysis-section">
                    <div class="sentence-analysis-section-title">句子</div>
                    <div class="sentence-analysis-section-content">
                        <p>${sentence}</p>
                    </div>
                </div>
                <div class="sentence-analysis-section">
                    <div class="sentence-analysis-section-title">结构分析</div>
                    <div class="sentence-analysis-section-content">
                        <p>${structureAnalysis}</p>
                    </div>
                </div>
                <div class="sentence-analysis-section">
                    <div class="sentence-analysis-section-title">翻译技巧</div>
                    <div class="sentence-analysis-section-content">
                        <p>${translationTechniques}</p>
                    </div>
                </div>
                <div class="sentence-analysis-section">
                    <div class="sentence-analysis-section-title">重点单词</div>
                    <div class="sentence-analysis-section-content">
                        <ul>${keyWordsHTML}</ul>
                    </div>
                </div>
            </div>
            <div class="sentence-analysis-actions">
                <button class="primary-button" id="export-sentence-analysis">导出分析结果</button>
                <button class="secondary-button" id="close-sentence-analysis">关闭</button>
            </div>
        `;

        // 添加事件监听
        const exportSentenceAnalysisBtn = sentenceAnalysisPopup.querySelector('#export-sentence-analysis');
        const closeSentenceAnalysisBtn = sentenceAnalysisPopup.querySelector('#close-sentence-analysis');

        if (exportSentenceAnalysisBtn) {
            exportSentenceAnalysisBtn.addEventListener('click', () => {
                exportSentenceAnalysis(sentence, analysisResult);
            });
        }

        if (closeSentenceAnalysisBtn) {
            closeSentenceAnalysisBtn.addEventListener('click', () => {
                sentenceAnalysisPopup.style.display = 'none';
            });
        }
    }

    // 导出长难句分析结果
    function exportSentenceAnalysis(sentence, analysisResult) {
        const structureAnalysis = analysisResult.structure_analysis || '暂无结构分析';
        const translationTechniques = analysisResult.translation_techniques || '暂无翻译技巧';
        const keyWords = analysisResult.key_words || [];

        const keyWordsText = keyWords.map(word => `- **${word.word}**: ${word.translation || '暂无翻译'}`).join('\n');

        const markdownContent = `
# 长难句分析

## 句子
${sentence}

## 结构分析
${structureAnalysis}

## 翻译技巧
${translationTechniques}

## 重点单词
${keyWordsText}
        `;

        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `长难句分析_${new Date().toLocaleDateString().replace(/\//g, '')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('长难句分析结果已导出', 'success', 3000);
    }

    // 修改翻译逻辑，先检查墨墨翻译是否存在
    async function translateWord(word) {
        log('开始翻译单词:', word);
        translationPopup.innerHTML = '<span class="translation-loading">正在翻译...</span>';
        
        // 检查墨墨翻译是否存在
        const wordData = await fetchWordFromMomoAPI(word);
        if (wordData && wordData.found && wordData.definitions.length > 0) {
            log('单词释义已存在于墨墨背单词:', wordData);
            // translationPopup.innerHTML = `
            //     <div class="translation-content">
            //         <div>单词 "${word}" 已存在于墨墨背单词。${wordData}</div>
            //     </div>
            // `;
            ;
            return `单词 "${word}" 释义已存在于墨墨背单词；\n ${wordData.definitions.map(def => `
                <div class="definition-item">
                    <span class="part-of-speech">${def.partOfSpeech || ''}</span>
                    <span class="definition-text">${def.definition || ''}</span>
                </div>
            `).join('')} `;
        }

        try {
            // 将翻译过的单词加入到本地生词本
            saveWordToRepository(word)

            const translation = await TranslationService.translate(word);
            
            if (wordData.found && wordData.definitions.length == 0 && config.translationService != 'local') {
                // 保存释义到墨墨背单词
                await saveDefinitionsToMomoAPI(word, translation, wordData.vocId);
            } 

            if (config.translationService == 'deepseek'){
                log(`${config.translationService} 翻译结果：${translation}`)
                return translation;
            } else if (config.translationService == 'local'){
            
                const localTranslation = localLLMParseResponse(translation);
                log(`${config.translationService} 翻译结果：${localTranslation}`)
                return localTranslation;
            }

            // log(`${config.translationService} 翻译结果：${translation}`)
            // log(`${config.translationService} 翻译结果：${localLLMParseResponse(translation)}`);
            
        } catch (error) {
            showNotification('翻译服务暂时不可用，请检查 API 设置', 'error');
            return '翻译服务暂时不可用，请检查 API 设置';
        }
    }


    // 更新生词本显示
    function updateVocabularyList() {
        const vocCount = vocabularyList.querySelector('#vocabulary-count');
        vocCount.innerHTML = `${Object.keys(vocabulary).length}个生词`;
        vocCount.style.cssText = `
            fontsize: 5px;
            color:rgb(198, 198, 198);
        `;

        const content = vocabularyList.querySelector('.vocabulary-list-content');
        content.innerHTML = Object.entries(vocabulary)
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
            .map(([word, data]) => {
                // 应用样式到单词本身
                let styledWord = word;
                if (data.styles?.length) {
                    data.styles.forEach(style => {
                        if (style.type === 'highlight') {
                            styledWord = `<span style="background-color: ${style.color}">${styledWord}</span>`;
                        } else if (style.type === 'underline') {
                            styledWord = `<span style="border-bottom: 2px solid ${style.color}">${styledWord}</span>`;
                        }
                    });
                }

                return `
                <div class="vocabulary-item">
                    <div>
                            <div class="vocabulary-word">${styledWord}</div>
                        ${data.translation ? `<div class="vocabulary-translation">${data.translation}</div>` : ''}
                    </div>
                    <span class="delete-word" data-word="${word}">删除</span>
                </div>
                `;
            }).join('') || '<div style="padding: 10px; color: #666;">暂无生词</div>';
    }

    // 显示生词本
    function showVocabularyList() {
        updateVocabularyList();
        if (vocabularyList.style.display === 'block') {
            vocabularyList.style.display = 'none';
        } else {
            vocabularyList.style.display = 'block';
            updateVocabularyList();
        }

        // 添加搜索框事件监听
        const searchInput = vocabularyList.querySelector('#vocab-search');
        if (searchInput) {
            searchInput.value = ''; // 清空搜索框
            searchInput.addEventListener('input', debounce((e) => {
                searchVocabulary(e.target.value.trim());
            }, 300));
        }
    }

    // 修改选择文本时的处理函数，加强控制墨墨翻译调用的条件
    document.addEventListener('mouseup', function(e) {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();

            if (!selectedText) {
                if (!e.target.closest('.vocabulary-list') &&
                    !e.target.closest('.translation-tools') &&
                    !e.target.closest('.translation-popup')) {
                    if (!toolsPopup.classList.contains('pinned')) {
                        toolsPopup.style.display = 'none';
                    }
                    if (!translationPopup.classList.contains('pinned')) {
                        translationPopup.style.display = 'none';
                    }
                }
                return;
            }

            // 检查选中的文本是否与上一次选中的相同，如果相同则不重复处理
            if (selectedText === currentSelection && !e.target.classList.contains('lookup-word-btn')) {
                return;
            }

            currentSelection = selectedText;
            const coords = getSelectionCoordinates();
            if (!coords) return;

            // 更新工具栏内容
            updateToolsPopup(selectedText);

            // 如果工具栏没有被钉住，更新位置并显示
            if (!toolsPopup.classList.contains('pinned')) {
                updateToolsPosition(coords);
                toolsPopup.style.display = 'block';
            }
        }, 10);
    });


    // 修改生词本相关事件处理
    vocabularyList.addEventListener('click', function(e) {
        if (e.target.id === 'close-vocab-list') {
            vocabularyList.style.display = 'none';
        } else if (e.target.id === 'export-vocab-list') {
            exportVocabulary();
        } else if (e.target.classList.contains('delete-word')) {
            const word = e.target.dataset.word;
            delete vocabulary[word];
            GM_setValue('vocabulary', vocabulary);
            updateVocabularyList();
        }
    });

    // 修改点击页面空白处隐藏弹窗的处理
    document.addEventListener('click', function(e) {
        // 排除所有颜色选择器相关元素
        if (e.target.closest('.color-picker-panel') ||
            e.target.closest('.color-picker-btn') ||
            e.target.closest('.preset-color') ||
            e.target.classList.contains('color-input')) {
            return;
        }

        // 关闭所有颜色选择器面板
        document.querySelectorAll('.color-picker-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        if (!e.target.closest('.translation-tools') &&
            !e.target.closest('.translation-popup')) {
            if (!toolsPopup.classList.contains('pinned')) {
            toolsPopup.style.display = 'none';
            }
            if (!translationPopup.classList.contains('pinned')) {
            translationPopup.style.display = 'none';
            }
            currentSelection = '';
        }
    });

  


    // 显示提示框的函数
    function showNotification(message, type = 'info', timeout=1500) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 10px 20px;
            background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: fadeIn 0.5s ease-in-out;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);

        // 将提示框添加到页面
        document.body.appendChild(notification);

        // 5秒后自动消失
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-in-out';
            setTimeout(() => {
                notification.remove();
            }, 500); // 等待动画完成后再移除元素
        }, timeout);
    }
    // 修改导出生词本功能
    function exportVocabulary() {
        log('导出生词本');
        const vocabularyText = Object.entries(vocabulary)
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
            .map(([word, data]) => {
                return `${word}${data.translation ? `\t${data.translation}` : ''}`;
            })
            .join('\n');

        const blob = new Blob([vocabularyText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toLocaleDateString().replace(/\//g, '');
        a.download = `生词本_${date}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('生词本已导出','success');
    }

    // 跳转墨墨官网
    GM_registerMenuCommand('墨墨官网', () => {
        window.open('https://www.maimemo.com/notepad/detail/3816316?scene=', '_blank');
    });

    // 注册显示生词本菜单命令
    GM_registerMenuCommand('显示生词本', () => {
        vocabularyList.style.display = vocabularyList.style.display === 'none' ? 'block' : 'none';
        if (vocabularyList.style.display === 'block') {
            updateVocabularyList();
        }
    });

    // 注册显示样式集菜单命令
    GM_registerMenuCommand('显示样式集', () => {
        if (styleSetList.style.display === 'none') {
            updateStyleSet();
            styleSetList.style.display = 'block';
        } else {
            styleSetList.style.display = 'none';
        }
    });

    // 注册导出生词本菜单命令
    GM_registerMenuCommand('导出生词本', exportVocabulary);

    // 初始化完成通知
    GM_notification({
        text: '英文阅读助手已启动',
        title: '英文阅读助手',
        timeout: 2000
    });

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 修改页面加载完成后的处理逻辑
    window.addEventListener('DOMContentLoaded', () => {
        // 确保所有数据都被正确加载
        textStyles = GM_getValue('textStyles', {});
        vocabulary = GM_getValue('vocabulary', {});

        // 立即执行一次标记
        autoMarkSavedWords();
    });

    // 添加 MutationObserver 配置
    const observerConfig = {
        childList: true,
        subtree: true,
        characterData: true
    };

    // 创建 MutationObserver 实例
    const markObserver = new MutationObserver(debounce((mutations) => {
        const shouldUpdate = mutations.some(mutation => {
            return !mutation.target.closest('.translation-tools') &&
                   !mutation.target.closest('.translation-popup') &&
                   !mutation.target.closest('.vocabulary-list') &&
                   !mutation.target.closest('.style-set-list') &&
                   !mutation.target.closest('[data-marked="true"]');
        });

        if (shouldUpdate) {
            document.body.dataset.autoMarked = 'false';
            autoMarkSavedWords();
        }
    }, 200));

    // 在页面加载完成后开始观察
    window.addEventListener('load', () => {
        markObserver.observe(document.body, observerConfig);

        // 确保样式被应用
        setTimeout(() => {
            document.body.dataset.autoMarked = 'false';
            autoMarkSavedWords();
        }, 500);
    });

    // 在updateVocabularyList函数后添加搜索功能
    function searchVocabulary(searchTerm) {

        const content = vocabularyList.querySelector('.vocabulary-list-content');
        const items = content.querySelectorAll('.vocabulary-item');
        let hasResults = false;

        var count = 0;
        items.forEach(item => {
            const word = item.querySelector('.vocabulary-word').textContent.toLowerCase();
            const translation = item.querySelector('.vocabulary-translation')?.textContent.toLowerCase() || '';
            const matches = word.includes(searchTerm.toLowerCase()) ||
                          translation.includes(searchTerm.toLowerCase());

            item.classList.toggle('hidden', !matches);
            if (matches) {
                hasResults = true;
                count++;
            }
        });

        const vocCount = vocabularyList.querySelector('#vocabulary-count');
        vocCount.innerHTML = `${count}个生词`;
        vocCount.style.cssText = `
            fontsize: 5px;
            color:rgb(198, 198, 198);
        `;

        // 显示无结果提示
        const noResultsMsg = content.querySelector('.no-results');
        if (!hasResults && searchTerm) {
            if (!noResultsMsg) {
                const msg = document.createElement('div');
                msg.className = 'no-results';
                msg.textContent = '未找到匹配的单词';
                content.appendChild(msg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // 显示生词样式集
    function showStyleSet() {
        if (styleSetList.style.display === 'block') {
            styleSetList.style.display = 'none';
        } else {
            styleSetList.style.display = 'block';
            updateStyleSet();
        }

        // 添加搜索框事件监听
        const searchInput = styleSetList.querySelector('#style-set-search');
        if (searchInput) {
            searchInput.value = ''; // 清空搜索框
            searchInput.addEventListener('input', debounce((e) => {
                searchStyleSet(e.target.value.trim());
            }, 300));
        }
    }

    // 更新生词样式集显示
    function updateStyleSet() {
        const content = styleSetList.querySelector('.style-set-content');

        // 获取最新的样式数据
        textStyles = GM_getValue('textStyles', {});

        if (Object.keys(textStyles).length === 0) {
            content.innerHTML = '<div style="padding: 10px; color: #666;">暂无标记的单词</div>';
            return;
        }

        content.innerHTML = Object.entries(textStyles)
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
            .map(([word, data]) => {
                if (!data.styles || data.styles.length === 0) return '';

                // 应用样式到单词本身
                let styledWord = word;
                        data.styles.forEach(style => {
                            if (style.type === 'highlight') {
                        styledWord = `<span style="background-color: ${style.color}">${styledWord}</span>`;
                            } else if (style.type === 'underline') {
                        styledWord = `<span style="border-bottom: 2px solid ${style.color}">${styledWord}</span>`;
                    }
                });

                // 显示样式信息
                const styleInfo = data.styles.map(style => {
                    const styleType = style.type === 'highlight' ? '标记' : '下划线';
                    return `<span class="style-info">
                        <span class="style-type">${styleType}</span>
                        <span class="style-color" style="display: inline-block; width: 12px; height: 12px; background-color: ${style.color}; border-radius: 2px; vertical-align: middle; margin-left: 4px;"></span>
                    </span>`;
                }).join('');

                return `
                    <div class="style-set-item">
                        <div class="style-set-content">
                            <div class="style-set-word">${styledWord}</div>
                            <div class="style-set-info">${styleInfo}</div>
                        </div>
                        <div class="style-set-actions">
                            <button class="style-btn delete-style" data-word="${word}">删除</button>
                        </div>
                    </div>
                `;
            })
            .filter(item => item !== '') // 过滤掉空项
            .join('');
    }

    // 搜索生词样式集
    function searchStyleSet(searchTerm) {
        const content = styleSetList.querySelector('.style-set-content');
        const items = content.querySelectorAll('.style-set-item');
        let hasResults = false;

        items.forEach(item => {
            const word = item.querySelector('.style-set-word').textContent.toLowerCase();
            const matches = word.includes(searchTerm.toLowerCase());
            item.style.display = matches ? '' : 'none';
            if (matches) hasResults = true;
        });

        // 显示无结果提示
        let noResultsMsg = content.querySelector('.no-results');
        if (!hasResults && searchTerm) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results';
                noResultsMsg.textContent = '未找到匹配的单词';
                content.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // 添加生词样式集相关事件处理
    styleSetList.addEventListener('click', function(e) {
        if (e.target.id === 'close-style-set') {
            styleSetList.style.display = 'none';
        } else if (e.target.classList.contains('delete-style')) {
            const word = e.target.dataset.word;

            // 删除样式
            delete textStyles[word];
            GM_setValue('textStyles', textStyles);

            // 如果在生词本中，也更新生词本中的样式
            if (vocabulary[word]) {
                vocabulary[word].styles = [];
                GM_setValue('vocabulary', vocabulary);
            }

            // 更新显示
            updateStyleSet();

            // 重新标记页面
            document.body.dataset.autoMarked = 'false';
            autoMarkSavedWords();

            // 显示通知
            GM_notification({
                text: `已删除"${word}"的样式`,
                title: '英文阅读助手',
                timeout: 2000
            });
        }
    });

    // 恢复原有的按钮样式
    const buttonStyle = document.createElement('style');
    buttonStyle.textContent = `
        .action-buttons {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }

        .action-button {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }

        .primary-button {
            background-color: #0071e3;
            color: white;
        }

        .primary-button:hover {
            background-color: #0077ED;
            transform: translateY(-1px);
        }

        .secondary-button {
            background-color: rgba(0, 0, 0, 0.05);
            color: #1d1d1f;
        }

        .secondary-button:hover {
            background-color: rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }
    `;
    document.head.appendChild(buttonStyle);

    // 优化拖拽功能，使其更流畅
    function makeDraggable(element, dragHandle) {
        let offsetX = 0, offsetY = 0;
        let moving = false;

        // 添加硬件加速
        element.style.transform = 'translate3d(0,0,0)';
        element.style.willChange = 'transform';

        dragHandle.addEventListener('mousedown', startDrag);
        dragHandle.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            e.preventDefault();
            e.stopPropagation();

            // 记录初始位置
            if (e.type === 'touchstart') {
                offsetX = e.touches[0].clientX - element.getBoundingClientRect().left;
                offsetY = e.touches[0].clientY - element.getBoundingClientRect().top;
            } else {
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
            }

            moving = true;

            // 添加移动和停止事件
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);

            // 设置拖动样式
            dragHandle.style.cursor = 'grabbing';
            element.style.transition = 'none';
        }

        function onMove(e) {
            if (!moving) return;
            e.preventDefault();

            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            // 使用 requestAnimationFrame 优化性能
            requestAnimationFrame(() => {
                // 计算新位置，确保不超出屏幕
                const left = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, clientX - offsetX));
                const top = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, clientY - offsetY));

                // 设置元素位置
                element.style.left = `${left}px`;
                element.style.top = `${top}px`;
            });
        }

        function stopDrag() {
            moving = false;

            // 移除事件监听
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);

            // 恢复样式
            dragHandle.style.cursor = 'move';
            element.style.transition = 'box-shadow 0.2s ease';
        }
    }

    // 添加钉住功能
    function addPinFeature(element) {
        const pinButton = element.querySelector('.pin-button');
        if (!pinButton) return;

        pinButton.addEventListener('click', () => {
            const isPinned = element.classList.toggle('pinned');
            pinButton.classList.toggle('pinned');

            if (isPinned) {
                // 保存当前位置
                const rect = element.getBoundingClientRect();
                element.dataset.pinnedLeft = rect.left + 'px';
                element.dataset.pinnedTop = rect.top + 'px';

                // 如果是工具栏，则在选中新文本时不要重置位置
                if (element === toolsPopup) {
                    element.dataset.keepPosition = 'true';
                }
            } else {
                delete element.dataset.keepPosition;
            }
        });
    }

    // 初始化拖动和钉住功能
    // makeDraggable(toolsPopup, toolsPopup.querySelector('.tools-pin-header'));
    makeDraggable(vocabularyList, vocabularyList.querySelector('.vocabulary-list-header'));
    makeDraggable(styleSetList, styleSetList.querySelector('.style-set-header'));
    makeDraggable(exampleSentencesPopup, exampleSentencesPopup.querySelector('.example-sentences-header'));

    // addPinFeature(toolsPopup);
    addPinFeature(vocabularyList);
    addPinFeature(styleSetList);
    // addPinFeature(exampleSentencesPopup);

    // 修改工具栏位置更新逻辑
    function updateToolsPosition(coords) {
        // 如果工具栏被钉住，不更新位置
        if (toolsPopup.dataset.keepPosition) {
            return;
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const toolsWidth = toolsPopup.offsetWidth;
        const toolsHeight = toolsPopup.offsetHeight;

        // 计算相对于视口的坐标
        const viewportLeft = coords.left - window.pageXOffset;
        const viewportTop = coords.top - window.pageYOffset;

        // 默认显示在选中文本的右下方
        let left = viewportLeft + coords.width + 10;
        let top = viewportTop + coords.height + 5;

        // 如果右侧空间不足，显示在左侧
        if (left + toolsWidth > viewportWidth - 10) {
            left = viewportLeft - toolsWidth - 10;
        }

        // 如果底部空间不足，显示在上方
        if (top + toolsHeight > viewportHeight - 10) {
            top = viewportTop - toolsHeight - 5;
        }

        // 确保不超出视口边界
        left = Math.max(10, Math.min(left, viewportWidth - toolsWidth - 10));
        top = Math.max(10, Math.min(top, viewportHeight - toolsHeight - 10));

        // 使用 fixed 定位设置位置
        toolsPopup.style.position = 'fixed';
        toolsPopup.style.left = left + 'px';
        toolsPopup.style.top = top + 'px';
        toolsPopup.style.transform = 'none';
    }

    // 添加查询单词功能相关变量
    let currentWordData = null;

    // 查询单词功能
    async function lookupWord(word) {
        log('查询单词:', word);

        // 显示加载状态
        wordDetailsPopup.innerHTML = '<span class="translation-loading">正在查询单词...</span>';
        wordDetailsPopup.style.display = 'block';

        // 获取工具栏的位置
        const toolsRect = toolsPopup.getBoundingClientRect();

        // 计算单词详情框的位置
        const left = toolsRect.right + 10; // 工具栏右侧 + 10px 的间距
        const top = toolsRect.top; // 与工具栏顶部对齐

        // 设置单词详情框的位置
        wordDetailsPopup.style.left = left + 'px';
        wordDetailsPopup.style.top = top + 'px';


        try {
            // 首先尝试从默默背单词API获取数据
            const wordData = await fetchWordFromMomoAPI(word);

            if (wordData && wordData.found) {
                // 如果找到了单词数据，显示详情
                currentWordData = wordData;
                displayWordDetails(wordData);
            } else {
                // 如果没有找到，提供使用DeepSeek创建的选项
                wordDetailsPopup.innerHTML = `
                    <div class="word-title">${word}</div>
                    <div style="margin: 10px 0; color: #86868b;">该单词在生词本中未找到</div>
                    <div class="action-buttons">
                        <button class="action-button primary-button" id="create-word-deepseek">使用AI创建释义和例句</button>
                        <button class="action-button secondary-button" id="close-word-details">关闭</button>
                    </div>
                `;
                wordDetailsPopup.querySelector('#close-word-details').addEventListener('click', () => {
                    wordDetailsPopup.style.display = 'none';
                });
            }
        } catch (error) {
            log('查询单词出错：', error);
            wordDetailsPopup.innerHTML = `
                <div class="word-title">${word}</div>
                <div style="margin: 10px 0; color: #dc3545;">查询单词时出错</div>
                <div style="color: #86868b; margin-bottom: 10px;">${error.message || '网络错误，请稍后重试'}</div>
                <div class="action-buttons">
                    <button class="action-button secondary-button" id="close-word-details">关闭</button>
                </div>
            `;

            wordDetailsPopup.querySelector('#close-word-details').addEventListener('click', () => {
                wordDetailsPopup.style.display = 'none';
            });
        }
    }


    // 使用DeepSeek获取单词例句
    async function getWordExamplesWithDeepSeek(word) {
        log('使用DeepSeek获取单词例句:', word);

        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-b69b270bf3184f2baef2e501d968f940'
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: "你是一个英语例句助手。请为用户提供所查询单词的2个例句及其中文翻译。请使用JSON格式返回，格式为：[{\"example\": \"英文例句\", \"translation\": \"中文翻译\"}]。例句应该简洁且能够体现单词的用法，同时应该容易理解，有一些趣味性。不要有任何其他多余文字。"
                        },
                        {
                            role: "user",
                            content: word
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();

            // 提取JSON内容
            const jsonMatch = content.match(/\[.*\]/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            // 如果没有匹配到标准JSON格式，尝试直接解析整个内容
            try {
                return JSON.parse(content);
            } catch (e) {
                log('解析DeepSeek返回的例句失败，返回空例句');
                // 如果解析失败，返回空数组
                return [];
            }
        } catch (error) {
            log('获取单词例句出错：', error);
            throw new Error('获取单词例句失败，请稍后重试');
        }
    }

    // 显示单词详情
    function displayWordDetails(wordData) {
        log('显示单词详情:', wordData);

        let definitionsHTML = '';
        if (wordData.definitions && wordData.definitions.length > 0) {
            definitionsHTML = wordData.definitions.map(def => `
                <div class="definition-item">
                    <span class="part-of-speech">${def.partOfSpeech || ''}</span>
                    <span class="definition-text">${def.definition || ''}</span>
                </div>
            `).join('');
        } else {
            definitionsHTML = '<div class="definition-item">暂无释义</div>';
        }

        let examplesHTML = '';
        if (wordData.examples && wordData.examples.length > 0) {
            // 高亮例句中的当前单词
            const highlightedExamples = wordData.examples.map(ex => {
                // 创建正则表达式匹配单词（考虑单词边界）
                const regex = new RegExp(`\\b${wordData.word}\\b`, 'gi');
                const highlightedExample = ex.example.replace(regex, match =>
                    `<span class="highlighted-word">${match}</span>`
                );

                return {
                    ...ex,
                    highlightedExample
                };
            });

            examplesHTML = `
                <div class="examples-section">
                    <div class="examples-title">例句</div>
                    ${highlightedExamples.map(ex => `
                        <div class="example-item">
                            <div class="example-text">${ex.highlightedExample || ex.example}</div>
                            <div class="example-translation">${ex.translation || ''}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // 检查单词是否已在生词本
        const isWordInVocabulary = vocabulary[wordData.word] !== undefined;

        let actionButtonsHTML = `
            <div class="action-buttons">
                ${!isWordInVocabulary ?
                    `<button class="action-button primary-button" id="add-to-vocab">加入生词本</button>` :
                    `<button class="action-button primary-button" disabled>已在生词本</button>`
                }
                ${wordData.vocId ? `
                    <button class="action-button primary-button" id="add-examples-manual">手动添加例句</button>
                    <button class="action-button primary-button" id="add-examples-ai">AI生成例句</button>
                ` : ''}
                <button class="action-button secondary-button" id="close-word-details">关闭</button>
            </div>
        `;

        wordDetailsPopup.innerHTML = `
            <div class="word-details-header">
                <div class="word-details-title">单词详情 - 拖动此处可移动</div>
            </div>
            <div class="word-title">${wordData.word}</div>
            ${wordData.phonetic ? `<div class="word-phonetic">${wordData.phonetic}</div>` : ''}
            <div class="word-definition">
                ${definitionsHTML}
            </div>
            ${examplesHTML}
            ${actionButtonsHTML}
        `;

        // 添加事件监听
        const addToVocabBtn = wordDetailsPopup.querySelector('#add-to-vocab');
        const addExamplesManualBtn = wordDetailsPopup.querySelector('#add-examples-manual');
        const addExamplesAIBtn = wordDetailsPopup.querySelector('#add-examples-ai');

        if (addToVocabBtn) {
            addToVocabBtn.addEventListener('click', () => {
                saveWordToRepository(wordData.word);
                // 更新按钮状态
                addToVocabBtn.textContent = '已在生词本';
                addToVocabBtn.disabled = true;
                showNotification(`${wordData.word} 成功添加到生词本`, 'success');
            });
        }

        if (addExamplesManualBtn) {
            addExamplesManualBtn.addEventListener('click', () => {
                showManualExampleForm(wordData);
            });
        }

        if (addExamplesAIBtn) {
            addExamplesAIBtn.addEventListener('click', async () => {
                await addExamplesThroughDeepSeek(wordData.word, wordData.vocId);
            });
        }

        wordDetailsPopup.querySelector('#close-word-details').addEventListener('click', () => {
            wordDetailsPopup.style.display = 'none';
        });

        // 添加拖拽功能
        makeDraggable(wordDetailsPopup, wordDetailsPopup.querySelector('.word-details-header'));
    }

    // 添加手动例句表单 - 优化版
    function showManualExampleForm(wordData) {
        const formHTML = `
            <div class="word-details-header">
                <div class="word-details-title">添加例句 - 拖动此处可移动</div>
            </div>
            <div class="manual-example-form">
                <div class="form-title">为 "${wordData.word}" 添加例句</div>
                <div class="form-group">
                    <label for="example-text">英文例句:</label>
                    <textarea id="example-text" class="form-input" rows="2" placeholder="请输入英文例句"></textarea>
                </div>
                <div class="form-group">
                    <label for="example-translation">中文翻译:</label>
                    <textarea id="example-translation" class="form-input" rows="2" placeholder="请输入中文翻译"></textarea>
                </div>
                <div class="form-actions">
                    <button id="submit-example" class="action-button primary-button">保存</button>
                    <button id="cancel-example" class="action-button secondary-button">取消</button>
                </div>
            </div>
        `;

        // 保存当前内容以便取消时恢复
        const originalContent = wordDetailsPopup.innerHTML;
        wordDetailsPopup.innerHTML = formHTML;

        // 添加拖拽功能
        makeDraggable(wordDetailsPopup, wordDetailsPopup.querySelector('.word-details-header'));

        // 添加样式
        const formStyle = document.createElement('style');
        formStyle.textContent = `
            .manual-example-form {
                padding: 6px 0;
            }
            .form-title {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 10px;
                color: #1d1d1f;
            }
            .form-group {
                margin-bottom: 10px;
            }
            .form-group label {
                display: block;
                margin-bottom: 3px;
                font-weight: 500;
                font-size: 13px;
                color: #555;
            }
            .form-input {
                width: calc(100% - 16px);
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                resize: none;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
                outline: none;
                transition: border-color 0.2s ease;
            }
            .form-input:focus {
                border-color: #0071e3;
                box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.2);
            }
            .form-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
            }
        `;
        document.head.appendChild(formStyle);

        // 添加事件监听
        document.getElementById('submit-example').addEventListener('click', async () => {
            const exampleText = document.getElementById('example-text').value.trim();
            const exampleTranslation = document.getElementById('example-translation').value.trim();

            if (!exampleText || !exampleTranslation) {
                alert('请填写例句和翻译');
                return;
            }

            const example = {
                example: exampleText,
                translation: exampleTranslation,
                tag: '考研' // 使用默认标签
            };

            // 保存例句
            try {
                const result = await saveExampleToMomoAPI(wordData.word, example, wordData.vocId);
                if (result.success) {
                    // 重新获取单词数据以显示更新后的例句
                    const updatedWordData = await fetchWordFromMomoAPI(wordData.word);
                    displayWordDetails(updatedWordData);
                }
            } catch (error) {
                log('保存例句失败:', error);
                alert(`保存例句失败: ${error.message || '未知错误'}`);
                // 恢复原内容
                wordDetailsPopup.innerHTML = originalContent;
                addEventListenersToWordDetails(wordData);
            }
        });

        document.getElementById('cancel-example').addEventListener('click', () => {
            // 恢复原内容
            wordDetailsPopup.innerHTML = originalContent;
            addEventListenersToWordDetails(wordData);
        });
    }

    // 添加事件监听回调函数
    function addEventListenersToWordDetails(wordData) {
        const addExamplesManualBtn = wordDetailsPopup.querySelector('#add-examples-manual');
        const addExamplesAIBtn = wordDetailsPopup.querySelector('#add-examples-ai');

        if (addExamplesManualBtn) {
            addExamplesManualBtn.addEventListener('click', () => {
                showManualExampleForm(wordData);
            });
        }

        if (addExamplesAIBtn) {
            addExamplesAIBtn.addEventListener('click', async () => {
                await addExamplesThroughDeepSeek(wordData.word, wordData.vocId);
            });
        }

        wordDetailsPopup.querySelector('#close-word-details').addEventListener('click', () => {
            wordDetailsPopup.style.display = 'none';
        });
    }

    // 使用API保存单个例句到默默背单词
    async function saveExampleToMomoAPI(word, example, vocId) {
        log('保存例句到momo背单词:', word, example);

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${momoConfig.apiBaseURL}/phrases`,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${momoConfig.token}`
                    },
                    data: JSON.stringify({
                        phrase: {
                            voc_id: vocId,
                            phrase: example.example,
                            interpretation: example.translation,
                            tags: [example.tag || "考研"],
                            origin: example.tag || "考研"
                        }
                    }),
                    responseType: 'json',
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response.response);
                        } else {
                            reject(new Error(`API 请求失败: ${response.status} ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('网络请求失败'));
                    }
                });
            });

            return { success: true, data: response };
        } catch (error) {
            log('保存例句出错：', error);

            showNotification(`保存例句失败: ${error.message || '服务暂时不可用'}`,'error');

            throw error;
        }
    }

    // 修改使用DeepSeek生成并保存例句的函数
    async function addExamplesThroughDeepSeek(word, vocId) {
        log('为单词添加例句:', word);

        const loadingHTML = '<span class="translation-loading">正在使用AI生成例句...</span>';
        const examplesSection = wordDetailsPopup.querySelector('.examples-section');

        if (examplesSection) {
            examplesSection.innerHTML = loadingHTML;
        } else {
            const newExamplesSection = document.createElement('div');
            newExamplesSection.className = 'examples-section';
            newExamplesSection.innerHTML = loadingHTML;
            wordDetailsPopup.querySelector('.word-definition').after(newExamplesSection);
        }

        try {
            // 获取单词例句
            const examples = await getWordExamplesWithDeepSeek(word);

            // 更新当前单词数据
            if (currentWordData) {
                currentWordData.examples = examples;
            }

            // 高亮例句中的当前单词
            const highlightedExamples = examples.map(ex => {
                // 创建正则表达式匹配单词（考虑单词边界）
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                const highlightedExample = ex.example.replace(regex, match =>
                    `<span class="highlighted-word">${match}</span>`
                );

                return {
                    ...ex,
                    highlightedExample
                };
            });

            // 更新界面显示生成的例句
            const examplesHTML = `
                <div class="examples-title">AI生成的例句</div>
                ${highlightedExamples.map(ex => `
                    <div class="example-item">
                        <div class="example-text">${ex.highlightedExample || ex.example}</div>
                        <div class="example-translation">${ex.translation || ''}</div>
                    </div>
                `).join('')}
                <div class="action-buttons">
                    <button class="action-button primary-button" id="save-ai-examples">保存例句到momo背单词</button>
                </div>
            `;

            const examplesSection = wordDetailsPopup.querySelector('.examples-section');
            if (examplesSection) {
                examplesSection.innerHTML = examplesHTML;

                // 添加保存按钮的事件监听
                const saveAIExamplesBtn = examplesSection.querySelector('#save-ai-examples');
                if (saveAIExamplesBtn) {
                    saveAIExamplesBtn.addEventListener('click', async () => {
                        saveAIExamplesBtn.textContent = '保存中...';
                        saveAIExamplesBtn.disabled = true;

                        try {
                            // 逐个保存例句
                            for (const example of examples) {
                                await saveExampleToMomoAPI(word, {
                                    example: example.example,
                                    translation: example.translation,
                                    tag: '考研'
                                }, vocId);
                            }

                            showNotification(`${word}：例句已成功墨墨背单词`,'success', 3000)
                            // 更新按钮状态
                            saveAIExamplesBtn.textContent = '保存成功';

                            // 重新获取单词数据以显示更新后的例句
                            setTimeout(async () => {
                                const updatedWordData = await fetchWordFromMomoAPI(word);
                                displayWordDetails(updatedWordData);
                            }, 1000);
                        } catch (error) {
                            saveAIExamplesBtn.textContent = '保存失败';
                            log('保存AI生成的例句出错：', error);
                        }
                    });
                }
            }
        } catch (error) {
            log('添加例句出错：', error);

            const examplesSection = wordDetailsPopup.querySelector('.examples-section');
            if (examplesSection) {
                examplesSection.innerHTML = `
                    <div class="examples-title">例句</div>
                    <div style="color: #dc3545; padding: 10px;">生成例句失败: ${error.message || '服务暂时不可用'}</div>
                `;
            }
        }
    }

    // 添加默默背单词 API 配置
    const momoConfig = {
        apiBaseURL: 'https://open.maimemo.com/open/api/v1',
        token: 'df1cd963e6b5e50ddee08b36bf7abe0b9821e313ba95a08ab0001c6240d0435d' // 实际使用时请替换为有效 token
    };

    // 从默默背单词API获取单词数据 - 修正版
    async function fetchWordFromMomoAPI(word) {
        log('从momo背单词API获取单词数据:', word);

        try {
            // 1. 先通过单词获取 voc_id
            const vocData = await fetchMomoAPI(`vocabulary?spelling=${encodeURIComponent(word)}`);

            if (!vocData.success || !vocData.data.voc) {
                log('未找到单词:', word);
                return { found: false, word: word };
            }

            const vocId = vocData.data.voc.id;
            log('获取到单词ID:', vocId);

            // 2. 获取单词释义
            const interpretationData = await fetchMomoAPI(`interpretations?voc_id=${encodeURIComponent(vocId)}`);
            const definitions = [];

            if (interpretationData.success && interpretationData.data.interpretations) {
                // 解析释义数据
                const interpretationText = interpretationData.data.interpretations[0]?.interpretation || '';

                // 解析多行释义文本，每行可能是不同词性
                const lines = interpretationText.split('\n');
                lines.forEach(line => {
                    // 尝试解析词性和释义，格式通常是 "n. 天气" 这种
                    const match = line.match(/^([a-z]+\.)\s+(.+)$/i);
                    if (match) {
                        definitions.push({
                            partOfSpeech: match[1].trim(),
                            definition: match[2].trim()
                        });
                    } else if (line.trim()) {
                        // 如果没有明确词性格式，但有内容，就添加无词性释义
                        definitions.push({
                            partOfSpeech: '',
                            definition: line.trim()
                        });
                    }
                });
            }

            // 3. 获取单词例句
            const phrasesData = await fetchMomoAPI(`phrases?voc_id=${encodeURIComponent(vocId)}`);
            const examples = [];

            if (phrasesData.success && phrasesData.data.phrases) {
                phrasesData.data.phrases.forEach(phrase => {
                    examples.push({
                        example: phrase.phrase,
                        translation: phrase.interpretation
                    });
                });
            }

            // 4. 返回完整的单词数据
            return {
                word: word,
                vocId: vocId,
                definitions: definitions,
                examples: examples,
                found: true
            };
        } catch (error) {
            log('获取单词数据出错：', error);
            return { found: false, word: word, error: error.message };
        }
    }

    // 使用 GM_xmlhttpRequest 调用默默背单词 API，解决 CORS 问题
    function fetchMomoAPI(endpoint) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${momoConfig.apiBaseURL}/${endpoint}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${momoConfig.token}`
                },
                responseType: 'json',
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`API 请求失败: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 将单词释义保存到默默背单词API - 修正版
    async function saveDefinitionsToMomoAPI(word, translation, vocId) {
        log('保存释义到墨墨背单词:', word, translation, vocId);

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://open.maimemo.com/open/api/v1/interpretations',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${momoConfig.token}`
                    },
                    data: JSON.stringify({
                        interpretation: {
                            voc_id: vocId,
                            interpretation: translation,
                            tags: ["考研"],
                            status: "PUBLISHED"
                        }
                    }),
                    responseType: 'json',
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response.response);
                        } else {
                            reject(new Error(`API 请求失败: ${response.status} ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('网络请求失败'));
                    }
                });
            });

            showNotification(`单词 "${word}" 的释义 ${translation} 已保存到墨墨背单词`, 'success', 5000);
            return { success: true, data: response };
        } catch (error) {
            log('保存单词出错：', error);

            showNotification(`保存单词失败: ${error.message || '服务暂时不可用'}`,'error');
            return { success: false, error: error.message };
        }
    }

    // 添加样式，用于例句中高亮当前单词和设置例句容器的最大高度
    const exampleStyle = document.createElement('style');
    exampleStyle.textContent = `
        .examples-section {
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            padding-top: 12px;
            max-height: 300px;
            overflow-y: auto;
        }

        .examples-section::-webkit-scrollbar {
            width: 6px;
        }

        .examples-section::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 3px;
        }

        .examples-section::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }

        .examples-section::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
        }

        .highlighted-word {
            color: #e74c3c;
            text-decoration: underline;
            text-decoration-style: dashed;
            text-decoration-thickness: 1px;
            text-underline-offset: 2px;
        }
    `;
    document.head.appendChild(exampleStyle);

    // 添加一个新函数来初始化拖拽功能
    function initDraggableForPopup(popup) {
        // 添加拖拽头部
        const dragHeader = document.createElement('div');
        dragHeader.className = 'draggable-header';
        dragHeader.innerHTML = `
            <div>翻译结果 - 拖动此处可移动</div>
            <div class="header-actions">
                <button class="pin-button" title="钉住">📌</button>
            </div>
        `;

        // 将头部添加到弹窗的最前面
        if (popup.firstChild) {
            popup.insertBefore(dragHeader, popup.firstChild);
        } else {
            popup.appendChild(dragHeader);
        }

        // 添加拖拽功能
        makeDraggable(popup, dragHeader);

        // 添加钉住功能
        addPinFeature(popup);
    }


    function processVocabulary(vocabulary) {
        // 1. 将时间戳转换为 YYYYMMDD 格式
        function formatDate(timestamp) {
          const date = new Date(timestamp);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          return `${year}${month}${day}`;
        }

        // 2. 按日期分组
        const groupedData = {};
        for (const [word, data] of Object.entries(vocabulary)) {
          const dateKey = formatDate(data.timestamp);
          if (!groupedData[dateKey]) {
            groupedData[dateKey] = [];
          }
          groupedData[dateKey].push({ word, timestamp: data.timestamp });
        }

        // 3. 排序
        // 3.1 按日期分组内的 timestamp 降序排列
        for (const dateKey in groupedData) {
          groupedData[dateKey].sort((a, b) => b.timestamp - a.timestamp);
        }

        // 3.2 按日期整体降序排列
        const sortedDates = Object.keys(groupedData).sort((a, b) => b.localeCompare(a));

        // 4. 格式化输出
        let output = '';
        for (const date of sortedDates) {
          output += `# ${date}\n`;
          for (const item of groupedData[date]) {
            output += `${item.word}\n`;
          }
          output += '\n';
        }

        return output;
    }

    function addWordsToContext(wordsContext, vocabulary) {
        // 1. 将 wordsContext 按行分割，提取已有的日期和单词
        const lines = wordsContext.split('\n');
        const dateMap = {}; // 存储日期和对应的单词
        let currentDate = '';

        lines.forEach(line => {
            if (line.startsWith('# ')) {
            currentDate = line.slice(2); // 提取日期
            if (!dateMap[currentDate]) {
                dateMap[currentDate] = []; // 初始化日期的单词数组
            }
            } else if (line.trim()) {
            dateMap[currentDate].push(line.trim()); // 将单词添加到对应日期的数组中
            }
        });

        // 2. 处理 vocabulary，按时间分组并过滤重复单词
        function formatDate(timestamp) {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}${month}${day}`;
        }

        for (const [word, data] of Object.entries(vocabulary)) {
            const dateKey = formatDate(data.timestamp);
            if (!dateMap[dateKey]) {
            dateMap[dateKey] = []; // 初始化新日期的单词数组
            }
            // 检查单词是否已经存在于任何日期的分组中
            const isWordExist = Object.values(dateMap).some(words => words.includes(word));
            if (!isWordExist) {
            dateMap[dateKey].push(word); // 添加新单词到对应日期的数组中
            }
        }

        // 3. 按日期升序排序并生成结果
        const sortedDates = Object.keys(dateMap).sort((a, b) => a.localeCompare(b)); // 按升序排序
        let result = '';
        sortedDates.forEach(date => {
            if (dateMap[date].length > 0) {
            result += `# ${date}\n`;
            dateMap[date].forEach(word => {
                result += `${word}\n`;
            });
            result += '\n';
            }
        });

        return result.trim();
    }

    function importWords(wordsContext, vocabulary) {
        // 1. 解析 wordsContext，提取已有的单词
        const existingWords = new Set();
        const lines = wordsContext.split('\n');
        lines.forEach(line => {
          if (line.trim() && !line.startsWith('#')) {
            existingWords.add(line.toLowerCase().trim());
          }
        });

        // 2. 提取 vocabulary 中的新单词
        const importedWords = {};
        for (const [word, data] of Object.entries(vocabulary)) {
          if (!existingWords.has(word.toLowerCase())) {
            importedWords[word.toLowerCase] = true; // 将新单词保存到对象中
          }
        }

        // 3. 返回导入成功的单词对象
        return importedWords;
      }

    function isMaiMemoSite(){
        return window.location.hostname.includes('maimemo.com')
    }

    if(isMaiMemoSite()){
        console.log("正在momo背单词官网");
        // 等待页面加载完成

            // 尝试查找墨墨生词本区域
            const checkForNotepadArea = setInterval(function() {

                const dl = document.querySelector(".input-box3").parentElement.parentElement;
                const dt = document.createElement("dt");
                dt.style.cssText = `
                    overflow:hidden;
                    margin: 0px;
                    margin-bottom:8px;
                    padding:0px;
                `;
                const updateButton = document.querySelector('#update');
                updateButton.style.cssText = `
                    display: inline-block;
                        line-height: 22px;
                        padding: 4px 10px;
                        background:rgb(56, 173, 149);
                        border-radius: 3px;
                        float: left;
                        margin-left:10px;
                        color: white;
                        fontsize:14px;
                        cursor: pointer;
                `

                const wordList = document.querySelector('#content');
                console.log(wordList);

                if (dl && wordList) {
                    wordList.style.cssTest = `background: #0066cc;`
                    console.log("有生词本区域");

                    clearInterval(checkForNotepadArea);
                    // 创建查看按钮
                    const showButton = document.createElement('a');
                    showButton.textContent = '查看本地生词本';
                    showButton.className = 'maimemo-showButton';
                    showButton.style.cssText = `
                        display: inline-block;
                        line-height: 22px;
                        padding: 4px 10px;
                        background:rgb(219, 145, 27);
                        border-radius: 3px;
                        float: left;
                        color: white;
                        fontsize:14px;
                        cursor: pointer;
                    `;

                    // 创建导入按钮
                    const importButton = document.createElement('a');
                    importButton.textContent = '导入本地生词本';
                    importButton.className = 'maimemo-importButton';
                    importButton.style.cssText = `
                        display: inline-block;
                        line-height: 22px;
                        padding: 4px 10px;
                        background: #0066cc;
                        border-radius: 3px;
                        float: left;
                        margin-left:10px;
                        color: white;
                        fontsize:14px;
                        cursor: pointer;
                    `;

                    dl.insertBefore(dt, dl.querySelectorAll('dd')[2]);
                    dt.appendChild(showButton);
                    dt.appendChild(importButton);
                    dt.appendChild(updateButton);

                    showButton.addEventListener('click', function() {
                        const vocabulary = GM_getValue('vocabulary', {});
                        const words = Object.keys(vocabulary);
                        if (words.length === 0) {
                            alert('本地生词本为空');
                            return;
                        } else {
                            showVocabularyList();
                            console.log(words);
                            console.log(vocabulary);
                            const result = processVocabulary(vocabulary);
                            console.log(result);
                        }
                    })

                    importButton.addEventListener('click', function(){
                        const wordsContext = wordList.textContent.trim();

                        // 调用函数
                        const successImportedWords = Object.keys(importWords(wordsContext, vocabulary));
                        console.log("导入成功的单词:", successImportedWords);

                        var notifText = `成功导入 ${successImportedWords.length} 个单词 \n ${successImportedWords}`;
                        // 没有新单词
                        if (successImportedWords.length == 0){
                            notifText = '没有新单词可以导入';
                            showNotification(notifText, 'error');
                        } else {
                            // 调用函数
                            const newWordList = addWordsToContext(wordsContext, vocabulary);
                            console.log(newWordList);
                            wordList.textContent = newWordList;
                            showNotification(notifText, 'success', 5000);
                        }
                    })

                } else{
                    console.log("没有生词本区域");

                }
            }, 1000);
    }

    // 修改点击页面空白处隐藏弹窗的处理
    document.addEventListener('click', function(e) {
        // 排除所有颜色选择器相关元素
        if (e.target.closest('.color-picker-panel') ||
            e.target.closest('.color-picker-btn') ||
            e.target.closest('.preset-color') ||
            e.target.classList.contains('color-input')) {
            return;
        }

        // 关闭所有颜色选择器面板
        document.querySelectorAll('.color-picker-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // 检查点击是否在任何一个弹窗内
        const isInsidePopup = e.target.closest('.translation-tools') ||
                            e.target.closest('.translation-popup') ||
                            e.target.closest('.vocabulary-list') ||
                            e.target.closest('.style-set-list') ||
                            e.target.closest('.word-details');

        // 如果点击不在任何一个弹窗内，关闭所有弹窗
        if (!isInsidePopup) {
            if (!toolsPopup.classList.contains('pinned')) {
                toolsPopup.style.display = 'none';
            }
            if (!translationPopup.classList.contains('pinned')) {
                translationPopup.style.display = 'none';
            }
            if (!vocabularyList.classList.contains('pinned')) {
                vocabularyList.style.display = 'none';
            }
            if (!styleSetList.classList.contains('pinned')) {
                styleSetList.style.display = 'none';
            }
            if (!wordDetailsPopup.classList.contains('pinned')) {
                wordDetailsPopup.style.display = 'none';
            }
            if(!exampleSentencesPopup.classList.contains('pinned')){
                exampleSentencesPopup.style.display = 'none';
            }
            currentSelection = '';
        }
    });
})();