// ==UserScript==
// @name         墨墨背单词划词翻译
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  选中英文单词时显示墨墨背单词中的释义
// @author       Your name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      open.maimemo.com
// @downloadURL https://update.greasyfork.org/scripts/529728/%E5%A2%A8%E5%A2%A8%E8%83%8C%E5%8D%95%E8%AF%8D%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/529728/%E5%A2%A8%E5%A2%A8%E8%83%8C%E5%8D%95%E8%AF%8D%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 内存存储
    const memoryStore = {
        interpretations: new Map(),
        phrases: new Map(),
        vocabulary: new Map(), // 改为Map以存储单词及其相关信息
        cloudNotepads: [], // 云词本列表
        selectedNotepadId: null // 当前选中的云词本ID
    };

    let currentVocId = null;

    // 存储数据到内存
    function setMemoryData(type, id, data) {
        memoryStore[type].set(id, data);
    }

    // 从内存获取数据
    function getMemoryData(type, id) {
        return memoryStore[type].get(id);
    }

    // 创建一个浮动div来显示释义和工具栏
    const tooltipDiv = document.createElement('div');
    tooltipDiv.style.cssText = `
        position: fixed;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 15px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        display: none;
        z-index: 999999;
        max-width: 450px;
        min-width: 350px;
        font-size: 13px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        transition: all 0.2s ease;
        opacity: 0;
        transform: translateY(10px);
    `;

    // 创建工具栏
    const toolbarDiv = document.createElement('div');
    toolbarDiv.style.cssText = `
        display: flex;
        flex-direction: row;
        gap: 8px;
        padding-top: 16px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        justify-content: space-between;
    `;

    // 创建添加例句按钮
    const addPhraseButton = document.createElement('button');
    addPhraseButton.textContent = '添加例句';
    addPhraseButton.style.cssText = `
        padding: 6px 10px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
        outline: none;
        flex: 1;
        white-space: nowrap;
        text-align: center;
    `;

    // 创建添加/更新释义按钮
    const addInterpretationButton = document.createElement('button');
    addInterpretationButton.textContent = '添加释义';
    addInterpretationButton.style.cssText = `
        padding: 6px 10px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
        outline: none;
        flex: 1;
        white-space: nowrap;
        text-align: center;
    `;

    // 创建查看生词本按钮
    const viewVocabButton = document.createElement('button');
    viewVocabButton.textContent = '查看生词本';
    viewVocabButton.className = 'maimemo-button';
    viewVocabButton.style.background = '#5856d6';
    viewVocabButton.style.flex = '1';

    // 统一按钮样式
    function updateButtonStyles() {
        // 设置所有按钮的基础样式
        const buttons = [addToVocabButton, addPhraseButton, addInterpretationButton, viewVocabButton];
        buttons.forEach(button => {
            button.style.cssText = `
                padding: 6px 10px;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s ease;
                outline: none;
                flex: 1;
                white-space: nowrap;
                text-align: center;
            `;
        });

        // 设置各按钮的颜色
        addToVocabButton.style.background = memoryStore.vocabulary.has(currentWord) ? '#ff3b30' : '#ff9500';
        addPhraseButton.style.background = '#4CAF50';
        addInterpretationButton.style.background = '#2196F3';
        viewVocabButton.style.background = '#5856d6';
    }

    // 添加按钮悬停效果
    addPhraseButton.addEventListener('mouseenter', () => {
        addPhraseButton.style.background = '#45a049';
    });
    addPhraseButton.addEventListener('mouseleave', () => {
        addPhraseButton.style.background = '#4CAF50';
    });

    addInterpretationButton.addEventListener('mouseenter', () => {
        addInterpretationButton.style.background = '#1976D2';
    });
    addInterpretationButton.addEventListener('mouseleave', () => {
        addInterpretationButton.style.background = '#2196F3';
    });

    // 创建例句输入表单
    const phraseForm = document.createElement('div');
    phraseForm.style.cssText = `
        display: none;
        margin-top: 16px;
        width: 100%;
        animation: fadeIn 0.2s ease;
    `;

    // 创建释义输入表单
    const interpretationForm = document.createElement('div');
    interpretationForm.style.cssText = `
        display: none;
        margin-top: 16px;
        width: 100%;
        animation: fadeIn 0.2s ease;
    `;

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .maimemo-tooltip-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .maimemo-textarea {
            width: 100%;
            margin-bottom: 12px;
            padding: 12px;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            resize: vertical;
            min-height: 60px;
            background: #f5f5f7;
            color: #1d1d1f;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
            transition: all 0.2s ease;
            outline: none;
        }

        .maimemo-textarea:focus {
            background: #ffffff;
            box-shadow: 0 0 0 2px #0066cc;
        }

        .maimemo-button {
            padding: 8px 18px;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            outline: none;
            background: #0066cc;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .maimemo-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
        }

        .maimemo-button:active {
            transform: translateY(0);
            box-shadow: none;
        }

        .maimemo-button-primary {
            background: #0066cc;
        }

        .maimemo-button-primary:hover {
            background: #0055b3;
        }

        .maimemo-button-danger {
            background: #ff3b30;
        }

        .maimemo-button-danger:hover {
            background: #d63028;
        }

        .maimemo-phrase-item {
            margin-bottom: 16px;
            padding: 16px;
            border-radius: 12px;
            background: #f5f5f7;
            position: relative;
            transition: all 0.2s ease;
        }

        .maimemo-phrase-item:hover {
            background: #ffffff;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        .maimemo-edit-button {
            position: absolute;
            right: 12px;
            top: 12px;
            padding: 6px 12px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0;
            transition: all 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .maimemo-phrase-item:hover .maimemo-edit-button {
            opacity: 1;
        }

        .maimemo-edit-button:hover {
            background: #0055b3;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
        }

        .maimemo-edit-button:active {
            transform: translateY(0);
            box-shadow: none;
        }

        .maimemo-tooltip {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
        }

        .maimemo-section-title {
            font-size: 15px;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 12px;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .maimemo-interpretation {
            font-size: 14px;
            line-height: 1.5;
            color: #1d1d1f;
            background: #f5f5f7;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .maimemo-phrases {
            background: #f5f5f7;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 16px;
        }

        .maimemo-phrase-text {
            font-size: 14px;
            line-height: 1.5;
            color: #1d1d1f;
            margin-bottom: 4px;
        }

        .maimemo-phrase-translation {
            font-size: 14px;
            line-height: 1.5;
            color: #86868b;
        }

        .maimemo-toolbar {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-top: 16px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .maimemo-form {
            margin-top: 16px;
            padding: 16px;
            background: #f5f5f7;
            border-radius: 12px;
            animation: fadeIn 0.2s ease;
        }

        .maimemo-notepad-selector {
            margin-top: 16px;
            padding: 16px;
            background: #f5f5f7;
            border-radius: 12px;
        }

        .maimemo-select {
            width: 100%;
            padding: 8px;
            margin-bottom: 12px;
            border: none;
            border-radius: 8px;
            background: white;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .maimemo-vocabulary-count {
            font-size: 12px;
            color: #86868b;
            margin-top: 8px;
            text-align: center;
        }

        .maimemo-form textarea, .maimemo-form input, .maimemo-form button {
            max-width: 100%;
            box-sizing: border-box;
        }

        .maimemo-form {
            max-width: 100%;
            box-sizing: border-box;
        }

        .maimemo-tooltip {
            box-sizing: border-box;
        }

        .maimemo-tooltip * {
            box-sizing: border-box;
            max-width: 100%;
        }
    `;
    document.head.appendChild(style);

    // 更新工具提示框样式
    tooltipDiv.className = 'maimemo-tooltip';
    tooltipDiv.style.cssText = `
        position: fixed;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 15px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        display: none;
        z-index: 999999;
        max-width: 450px;
        min-width: 350px;
        font-size: 13px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        transition: all 0.2s ease;
        opacity: 0;
        transform: translateY(10px);
    `;

    // 更新工具栏样式
    toolbarDiv.className = 'maimemo-toolbar';

    // 更新按钮样式
    addPhraseButton.className = 'maimemo-button';
    addInterpretationButton.className = 'maimemo-button';
    viewVocabButton.className = 'maimemo-button';

    // 更新表单样式
    phraseForm.className = 'maimemo-form';
    interpretationForm.className = 'maimemo-form';

    // 创建表单内容的函数
    function createPhraseFormContent() {
        const englishTextarea = document.createElement('textarea');
        englishTextarea.placeholder = '输入英文例句';
        englishTextarea.className = 'phrase-english';
        englishTextarea.style.cssText = 'width: 100%; margin-bottom: 5px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;';

        const chineseTextarea = document.createElement('textarea');
        chineseTextarea.placeholder = '输入中文翻译';
        chineseTextarea.className = 'phrase-chinese';
        chineseTextarea.style.cssText = 'width: 100%; margin-bottom: 5px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;';

        const submitButton = document.createElement('button');
        submitButton.textContent = '提交';
        submitButton.className = 'submit-phrase';
        submitButton.style.cssText = `
            padding: 6px 10px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            outline: none;
            white-space: nowrap;
            text-align: center;
            background: #0066cc;
            width: 100%;
            box-sizing: border-box;
            margin-top: 8px;
        `;

        phraseForm.innerHTML = '';
        phraseForm.appendChild(englishTextarea);
        phraseForm.appendChild(chineseTextarea);
        phraseForm.appendChild(submitButton);

        // 为提交按钮添加点击事件
        submitButton.addEventListener('click', async function(e) {
            e.stopPropagation();
            const englishPhrase = englishTextarea.value.trim();
            const chinesePhrase = chineseTextarea.value.trim();

            if (!englishPhrase || !chinesePhrase) {
                alert('请输入完整的例句和翻译');
                return;
            }

            if (!currentVocId) {
                alert('未找到单词ID，请重新选择单词');
                return;
            }

            console.log('提交例句:', {
                vocId: currentVocId,
                englishPhrase,
                chinesePhrase
            });

            try {
                await addPhrase(currentVocId, englishPhrase, chinesePhrase);
                alert('例句添加成功！');
                phraseForm.style.display = 'none';
                englishTextarea.value = '';
                chineseTextarea.value = '';

                // 刷新例句显示
                try {
                    // 获取当前释义
                    const interpretation = await getWordInterpretation(currentVocId);
                    // 获取更新后的例句
                    const phrases = await getPhrases(currentVocId);
                    // 显示更新后的内容
                    showTooltip(
                        interpretation,
                        phrases,
                        parseInt(tooltipDiv.style.left),
                        parseInt(tooltipDiv.style.top)
                    );
                } catch (error) {
                    console.error('刷新显示失败:', error);
                }
            } catch (error) {
                console.error('添加例句失败:', error);
                alert(error);
            }
        });
    }

    // 创建释义表单内容的函数
    function createInterpretationFormContent() {
        const interpretationTextarea = document.createElement('textarea');
        interpretationTextarea.placeholder = '输入单词释义（例如：n. 苹果）';
        interpretationTextarea.className = 'interpretation-input';
        interpretationTextarea.style.cssText = 'width: 100%; margin-bottom: 5px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;';

        const submitButton = document.createElement('button');
        submitButton.textContent = '提交';
        submitButton.className = 'submit-interpretation';
        submitButton.style.cssText = `
            padding: 6px 10px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            outline: none;
            white-space: nowrap;
            text-align: center;
            background: #0066cc;
            width: 100%;
            box-sizing: border-box;
            margin-top: 8px;
        `;

        interpretationForm.innerHTML = '';
        interpretationForm.appendChild(interpretationTextarea);
        interpretationForm.appendChild(submitButton);

        // 为提交按钮添加点击事件
        submitButton.addEventListener('click', async function(e) {
            e.stopPropagation();
            const interpretationText = interpretationTextarea.value.trim();

            if (!interpretationText) {
                alert('请输入释义');
                return;
            }

            if (!currentVocId) {
                alert('未找到单词ID，请重新选择单词');
                return;
            }

            try {
                // 先尝试获取现有释义
                const existingInterpretation = await getWordInterpretation(currentVocId, true);

                if (existingInterpretation && existingInterpretation.id) {
                    // 如果存在释义，则更新
                    await updateInterpretation(existingInterpretation.id, interpretationText);
                    alert('释义更新成功！');
                } else {
                    // 如果不存在释义，则添加新释义
                    await addInterpretation(currentVocId, interpretationText);
                    alert('释义添加成功！');
                }

                interpretationForm.style.display = 'none';
                interpretationTextarea.value = '';

                // 刷新显示
                try {
                    const interpretation = await getWordInterpretation(currentVocId);
                    const phrases = await getPhrases(currentVocId);
                    showTooltip(
                        interpretation,
                        phrases,
                        parseInt(tooltipDiv.style.left),
                        parseInt(tooltipDiv.style.top)
                    );
                } catch (error) {
                    console.error('刷新显示失败:', error);
                }
            } catch (error) {
                console.error('操作失败:', error);
                alert(error);
            }
        });
    }

    // 初始化表单内容
    createPhraseFormContent();
    createInterpretationFormContent();

    // API Token
    const API_TOKEN = 'df1cd963e6b5e50ddee08b36bf7abe0b9821e313ba95a08ab0001c6240d0435d';

    // 获取单词ID
    function getWordId(word) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://open.maimemo.com/open/api/v1/vocabulary?spelling=${encodeURIComponent(word)}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    if (data.success && data.data.voc) {
                        resolve(data.data.voc.id);
                    } else {
                        reject('未找到该单词');
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 获取单词释义（增加返回完整响应的选项）
    async function getWordInterpretation(vocId, fullResponse = false) {
        // 尝试从内存获取
        const cachedData = getMemoryData('interpretations', vocId);
        if (cachedData) {
            console.log('从内存获取释义:', cachedData);
            return fullResponse ? cachedData : cachedData.interpretation;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://open.maimemo.com/open/api/v1/interpretations?voc_id=${vocId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    if (data.success && data.data.interpretations && data.data.interpretations.length > 0) {
                        const interpretation = data.data.interpretations[0];
                        // 存入内存
                        setMemoryData('interpretations', vocId, interpretation);
                        if (fullResponse) {
                            resolve(interpretation);
                        } else {
                            resolve(interpretation.interpretation);
                        }
                    } else {
                        if (fullResponse) {
                            resolve(null);
                        } else {
                            reject('未找到释义');
                        }
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 获取单词例句
    async function getPhrases(vocId) {
        // 尝试从内存获取
        const cachedData = getMemoryData('phrases', vocId);
        if (cachedData) {
            console.log('从内存获取例句:', cachedData);
            return cachedData;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://open.maimemo.com/open/api/v1/phrases?voc_id=${vocId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    if (data.success && data.data.phrases) {
                        // 存入内存
                        setMemoryData('phrases', vocId, data.data.phrases);
                        resolve(data.data.phrases);
                    } else {
                        reject('未找到例句');
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 添加例句
    function addPhrase(vocId, phrase, interpretation) {
        return new Promise((resolve, reject) => {
            console.log('准备添加例句:', { vocId, phrase, interpretation });
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://open.maimemo.com/open/api/v1/phrases',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    phrase: {
                        voc_id: vocId,
                        phrase: phrase,
                        interpretation: interpretation,
                        tags: ["考研"],
                        origin: "考研"
                    }
                }),
                onload: function(response) {
                    console.log('API响应:', response.responseText);
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            resolve('例句添加成功');
                        } else {
                            const errorMsg = data.errors ? data.errors.join(', ') : '未知错误';
                            reject(`添加失败: ${errorMsg}`);
                        }
                    } catch (error) {
                        console.error('解析响应失败:', error);
                        reject('解析响应失败: ' + error.message);
                    }
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                    reject('网络请求失败: ' + error.message);
                }
            });
        });
    }

    // 添加释义
    function addInterpretation(vocId, interpretation) {
        return new Promise((resolve, reject) => {
            console.log('准备添加释义:', { vocId, interpretation });
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://open.maimemo.com/open/api/v1/interpretations',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    interpretation: {
                        voc_id: vocId,
                        interpretation: interpretation,
                        tags: ["考研"],
                        status: "PUBLISHED"
                    }
                }),
                onload: function(response) {
                    console.log('API响应:', response.responseText);
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            resolve('释义添加成功');
                        } else {
                            const errorMsg = data.errors ? data.errors.join(', ') : '未知错误';
                            reject(`添加失败: ${errorMsg}`);
                        }
                    } catch (error) {
                        console.error('解析响应失败:', error);
                        reject('解析响应失败: ' + error.message);
                    }
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                    reject('网络请求失败: ' + error.message);
                }
            });
        });
    }

    // 更新释义
    function updateInterpretation(interpretationId, interpretation) {
        return new Promise((resolve, reject) => {
            console.log('准备更新释义:', { interpretationId, interpretation });
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://open.maimemo.com/open/api/v1/interpretations/${interpretationId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    interpretation: {
                        interpretation: interpretation,
                        tags: ["考研"],
                        status: "PUBLISHED"
                    }
                }),
                onload: function(response) {
                    console.log('API响应:', response.responseText);
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            resolve('释义更新成功');
                        } else {
                            const errorMsg = data.errors ? data.errors.join(', ') : '未知错误';
                            reject(`更新失败: ${errorMsg}`);
                        }
                    } catch (error) {
                        console.error('解析响应失败:', error);
                        reject('解析响应失败: ' + error.message);
                    }
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                    reject('网络请求失败: ' + error.message);
                }
            });
        });
    }

    // 添加更新例句的函数
    function updatePhrase(phraseId, phrase, interpretation) {
        return new Promise((resolve, reject) => {
            console.log('准备更新例句:', { phraseId, phrase, interpretation });
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://open.maimemo.com/open/api/v1/phrases/${phraseId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    phrase: {
                        phrase: phrase,
                        interpretation: interpretation,
                        tags: ["考研"],
                        origin: "考研"
                    }
                }),
                onload: function(response) {
                    console.log('API响应:', response.responseText);
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            resolve('例句更新成功');
                        } else {
                            const errorMsg = data.errors ? data.errors.join(', ') : '未知错误';
                            reject(`更新失败: ${errorMsg}`);
                        }
                    } catch (error) {
                        console.error('解析响应失败:', error);
                        reject('解析响应失败: ' + error.message);
                    }
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                    reject('网络请求失败: ' + error.message);
                }
            });
        });
    }

    // 显示释义和工具栏
    function showTooltip(text, phrases, x, y) {
        console.log('显示工具提示框:', { text, x, y });

        // 清除之前的内容
        tooltipDiv.innerHTML = '';

        // 首先添加工具栏按钮
        toolbarDiv.innerHTML = '';

        // 更新当前单词
        currentWord = window.getSelection().toString().trim();

        // 更新生词本按钮状态
        if (memoryStore.vocabulary.has(currentWord)) {
            addToVocabButton.textContent = '从生词本移除';
            notepadSelector.style.display = 'block';
        } else {
            addToVocabButton.textContent = '添加到生词本';
            notepadSelector.style.display = 'none';
        }

        // 添加所有按钮到工具栏
        toolbarDiv.appendChild(addToVocabButton);
        toolbarDiv.appendChild(addPhraseButton);

        // 只有当没有释义时才显示添加释义按钮
        if (!text || text === '未找到释义' || text === '未找到释义，点击下方按钮添加释义' || text === '正在加载释义...') {
        toolbarDiv.appendChild(addInterpretationButton);
        }

        toolbarDiv.appendChild(viewVocabButton);

        // 更新按钮样式
        updateButtonStyles();

        // 添加工具栏到最顶部
        tooltipDiv.appendChild(toolbarDiv);

        // 创建内容容器，用于动态切换显示内容
        const contentContainer = document.createElement('div');
        contentContainer.id = 'maimemo-content-container';
        tooltipDiv.appendChild(contentContainer);

        // 添加生词本面板、表单和选择器（但不直接显示）
        tooltipDiv.appendChild(vocabPanel);
        tooltipDiv.appendChild(notepadSelector);
        tooltipDiv.appendChild(phraseForm);
        tooltipDiv.appendChild(interpretationForm);

        // 显示释义和例句
        showWordContent(contentContainer, text, phrases);

        // 更新生词数量显示
        updateVocabularyCount();

        // 设置初始位置
        tooltipDiv.style.display = 'block';
        tooltipDiv.style.opacity = '0';
        tooltipDiv.style.transform = 'translateY(10px)';

        // 获取视口尺寸和鼠标位置
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const mouseX = x - window.pageXOffset;
        const mouseY = y - window.pageYOffset;

        // 获取工具提示框的尺寸
        const tooltipRect = tooltipDiv.getBoundingClientRect();

        // 计算最佳位置
        let finalX = Math.min(
            Math.max(10, mouseX + 10),
            viewportWidth - tooltipRect.width - 10
        );

        let finalY = Math.min(
            Math.max(10, mouseY + 10),
            viewportHeight - tooltipRect.height - 10
        );

        // 应用位置
        tooltipDiv.style.left = `${finalX}px`;
        tooltipDiv.style.top = `${finalY}px`;

        // 触发动画
        requestAnimationFrame(() => {
            tooltipDiv.classList.add('maimemo-tooltip-visible');
        });
    }

    // 显示单词内容（释义和例句）
    function showWordContent(container, text, phrases) {
        container.innerHTML = '';

        // 创建释义容器，包含释义文本和编辑图标
        const interpretationContainer = document.createElement('div');
        interpretationContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            background: #f5f5f7;
            padding: 12px;
            border-radius: 8px;
            margin-top: 12px;
            margin-bottom: 12px;
            position: relative;
        `;

        // 添加释义文本
        const interpretationDiv = document.createElement('div');
        interpretationDiv.textContent = text;
        interpretationDiv.className = 'maimemo-interpretation';
        interpretationDiv.style.cssText = `
            font-size: 14px;
            line-height: 1.5;
            color: #1d1d1f;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
            flex: 1;
            padding-right: 24px;
        `;

        // 如果有释义，添加编辑图标
        if (text && text !== '未找到释义' && text !== '未找到释义，点击下方按钮添加释义' && text !== '正在加载释义...') {
            // 创建编辑图标
            const editIcon = document.createElement('div');
            editIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
            `;
            editIcon.style.cssText = `
                cursor: pointer;
                color: #0066cc;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                position: absolute;
                top: 12px;
                right: 12px;
            `;

            // 鼠标悬停效果
            editIcon.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
            });

            editIcon.addEventListener('mouseleave', function() {
                this.style.opacity = '0.7';
            });

            // 点击编辑图标时显示释义输入框
            editIcon.addEventListener('click', function(e) {
                e.stopPropagation();

                // 显示释义输入框
                interpretationForm.style.display = 'block';

                // 预填当前释义
                const textarea = interpretationForm.querySelector('.interpretation-input');
                if (textarea) {
                    textarea.value = text;
                    textarea.focus();
                }
            });

            interpretationContainer.appendChild(interpretationDiv);
            interpretationContainer.appendChild(editIcon);
        } else {
            interpretationContainer.appendChild(interpretationDiv);
        }

        container.appendChild(interpretationContainer);

        // 添加例句
        if (phrases && phrases.length > 0) {
            const phrasesDiv = document.createElement('div');
            phrasesDiv.className = 'maimemo-phrases';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'maimemo-section-title';
            titleDiv.textContent = '例句';
            phrasesDiv.appendChild(titleDiv);

            phrases.forEach(phrase => {
                const phraseItem = document.createElement('div');
                phraseItem.className = 'maimemo-phrase-item';

                // 创建编辑按钮
                const editButton = document.createElement('button');
                editButton.textContent = '编辑';
                editButton.className = 'maimemo-edit-button';

                // 显示例句内容
                const contentDiv = document.createElement('div');
                contentDiv.innerHTML = `
                    <div class="maimemo-phrase-text">${phrase.phrase}</div>
                    <div class="maimemo-phrase-translation">${phrase.interpretation}</div>
                `;

                phraseItem.appendChild(contentDiv);
                phraseItem.appendChild(editButton);

                // 点击编辑按钮时的处理
                editButton.addEventListener('click', (e) => {
                    e.stopPropagation();

                    // 创建编辑表单
                    const editForm = document.createElement('div');
                    editForm.className = 'maimemo-form';

                    const englishTextarea = document.createElement('textarea');
                    englishTextarea.value = phrase.phrase;
                    englishTextarea.className = 'maimemo-textarea';
                    englishTextarea.placeholder = '英文例句';

                    const chineseTextarea = document.createElement('textarea');
                    chineseTextarea.value = phrase.interpretation;
                    chineseTextarea.className = 'maimemo-textarea';
                    chineseTextarea.placeholder = '中文翻译';

                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.cssText = 'display: flex; gap: 8px;';

                    const submitButton = document.createElement('button');
                    submitButton.textContent = '保存';
                    submitButton.className = 'maimemo-button maimemo-button-primary';
                    submitButton.style.flex = '1';

                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = '取消';
                    cancelButton.className = 'maimemo-button maimemo-button-danger';
                    cancelButton.style.flex = '1';

                    buttonContainer.appendChild(submitButton);
                    buttonContainer.appendChild(cancelButton);

                    editForm.appendChild(englishTextarea);
                    editForm.appendChild(chineseTextarea);
                    editForm.appendChild(buttonContainer);

                    // 隐藏原内容，显示编辑表单
                    contentDiv.style.display = 'none';
                    editButton.style.display = 'none';
                    phraseItem.appendChild(editForm);

                    // 处理取消编辑
                    cancelButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        editForm.remove();
                        contentDiv.style.display = 'block';
                        editButton.style.display = '';
                    });

                    // 处理提交更新
                    submitButton.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const newPhrase = englishTextarea.value.trim();
                        const newInterpretation = chineseTextarea.value.trim();

                        if (!newPhrase || !newInterpretation) {
                            alert('请输入完整的例句和翻译');
                            return;
                        }

                        try {
                            await updatePhrase(phrase.id, newPhrase, newInterpretation);
                            // 更新内存
                            const phrases = await getPhrases(currentVocId);
                            setMemoryData('phrases', currentVocId, phrases);

                            const interpretation = await getWordInterpretation(currentVocId);
                            showTooltip(
                                interpretation,
                                phrases,
                                parseInt(tooltipDiv.style.left),
                                parseInt(tooltipDiv.style.top)
                            );
                        } catch (error) {
                            console.error('更新例句失败:', error);
                            alert(error);
                        }
                    });
                });

                phrasesDiv.appendChild(phraseItem);
            });
            container.appendChild(phrasesDiv);
        }
    }

    // 隐藏释义
    function hideTooltip() {
        tooltipDiv.classList.remove('maimemo-tooltip-visible');
        setTimeout(() => {
            if (!tooltipDiv.classList.contains('maimemo-tooltip-visible')) {
                tooltipDiv.style.display = 'none';
                phraseForm.style.display = 'none';
                interpretationForm.style.display = 'none';
            }
        }, 200);
        console.log('工具提示框已隐藏');
    }

    // 修改监听选词事件，改进提示框隐藏逻辑
    document.addEventListener('mouseup', async function(e) {
        // 如果点击在提示框内，不做任何处理
        if (tooltipDiv.contains(e.target)) {
            return;
        }

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        // 检查是否选中了文本，且是英文单词
        if (selectedText && /^[a-zA-Z]+$/.test(selectedText)) {
            // 如果选中了新单词，则显示新的提示框
            if (selectedText !== currentWord) {
            console.log('选中的单词:', selectedText);
            currentWord = selectedText;

            // 立即显示工具栏，不等待API响应
            showTooltip(
                '正在加载释义...',
                [],
                e.pageX,
                e.pageY
            );

                // 检查是否在生词本中
                if (memoryStore.vocabulary.has(selectedText)) {
                    const vocabData = memoryStore.vocabulary.get(selectedText);
                    currentVocId = vocabData.vocId;

                    // 更新工具提示框内容
                    showTooltip(
                        vocabData.interpretation || '未找到释义，点击下方按钮添加释义',
                        vocabData.phrases || [],
                        e.pageX,
                        e.pageY
                    );

                    if (!vocabData.interpretation) {
                        interpretationForm.style.display = 'block';
                        phraseForm.style.display = 'none';
                    }
                } else {
            try {
                const wordId = await getWordId(selectedText);
                currentVocId = wordId;
                console.log('获取到的单词ID:', wordId);

                let interpretation = null;
                let phrases = [];

                try {
                    interpretation = await getWordInterpretation(wordId);
                    console.log('单词释义:', interpretation);
                } catch (error) {
                    console.log('获取释义失败:', error);
                }

                try {
                    phrases = await getPhrases(wordId);
                    console.log('获取到的例句:', phrases);
                } catch (error) {
                    console.log('获取例句失败:', error);
                }

                // 更新工具提示框内容
                showTooltip(
                    interpretation || '未找到释义，点击下方按钮添加释义',
                    phrases,
                    e.pageX,
                    e.pageY
                );

                if (!interpretation) {
                    interpretationForm.style.display = 'block';
                    phraseForm.style.display = 'none';
                }
            } catch (error) {
                console.error('获取单词ID失败:', error);
                hideTooltip();
                    }
                }
            }
        } else {
            // 获取选中的文本范围
            const range = selection.getRangeAt(0);
            const selectedNode = range.commonAncestorContainer;

            // 检查点击位置是否在选中的单词上
            const isClickOnSelectedWord = currentWord &&
                                         selectedNode.textContent &&
                                         selectedNode.textContent.includes(currentWord) &&
                                         !tooltipDiv.contains(e.target);

            // 只有当点击不在提示框内且不在选中的单词上时才隐藏
            if (!tooltipDiv.contains(e.target) && !isClickOnSelectedWord) {
                hideTooltip();
            }
        }
    });

    // 添加文档点击事件监听，只在点击非提示框和非选中单词区域时隐藏提示框
    document.addEventListener('click', function(e) {
        // 如果点击在提示框内，不做任何处理
        if (tooltipDiv.contains(e.target)) {
            return;
        }

        // 获取当前选中的文本
        const selection = window.getSelection();

        // 如果没有选中文本，且当前有显示的提示框
        if (selection.toString().trim() === '' && tooltipDiv.style.display === 'block') {
            // 检查点击位置是否在选中的单词附近
            const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
            const clickedText = clickedElement ? clickedElement.textContent : '';

            // 如果点击的元素不包含当前单词，则隐藏提示框
            if (!clickedText || !clickedText.includes(currentWord)) {
                hideTooltip();
            }
        }
    });

    // 点击添加例句按钮
    addPhraseButton.addEventListener('click', function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        console.log('点击添加例句按钮');
        phraseForm.style.display = phraseForm.style.display === 'none' ? 'block' : 'none';
    });

    // 点击添加/更新释义按钮
    addInterpretationButton.addEventListener('click', function(e) {
        e.stopPropagation();

        // 隐藏例句表单
        phraseForm.style.display = 'none';

        // 显示/隐藏释义表单
        interpretationForm.style.display = interpretationForm.style.display === 'block' ? 'none' : 'block';

        // 如果显示表单，则清空输入框
        if (interpretationForm.style.display === 'block') {
            const textarea = interpretationForm.querySelector('.interpretation-input');
            if (textarea) {
                textarea.value = '';
                textarea.focus();
            }
        }
    });

    // 为查看生词本按钮添加事件处理
    viewVocabButton.addEventListener('click', function(e) {
        e.stopPropagation();

        // 显示生词本面板
        showVocabularyPanel();
    });

    // 创建生词本面板
    const vocabPanel = document.createElement('div');
    vocabPanel.className = 'maimemo-form';
    vocabPanel.style.display = 'none';

    // 修改显示生词本面板的函数，确保隐藏释义输入框
    function showVocabularyPanel() {
        // 隐藏其他表单
            phraseForm.style.display = 'none';
        interpretationForm.style.display = 'none';

        // 获取内容容器
        const contentContainer = document.getElementById('maimemo-content-container');

        // 如果生词本已显示，则隐藏生词本并显示单词内容
        if (vocabPanel.style.display === 'block') {
            vocabPanel.style.display = 'none';

            // 恢复显示单词内容
            if (currentWord && memoryStore.vocabulary.has(currentWord)) {
                const vocabData = memoryStore.vocabulary.get(currentWord);
                showWordContent(
                    contentContainer,
                    vocabData.interpretation || '未找到释义',
                    vocabData.phrases || []
                );
            } else if (currentVocId) {
                // 尝试重新获取当前单词的内容
                getWordInterpretation(currentVocId).then(interpretation => {
                    getPhrases(currentVocId).then(phrases => {
                        showWordContent(contentContainer, interpretation, phrases);
                    }).catch(() => {
                        showWordContent(contentContainer, interpretation, []);
                    });
                }).catch(() => {
                    showWordContent(contentContainer, '未找到释义', []);
                });
            }
        } else {
            // 更新生词本内容
            updateVocabPanel();

            // 显示生词本面板，隐藏单词内容和输入框
            contentContainer.innerHTML = '';
            vocabPanel.style.display = 'block';

            // 确保生词本内容可见
            tooltipDiv.appendChild(vocabPanel);

            // 确保释义输入框不可见
            phraseForm.style.display = 'none';
            interpretationForm.style.display = 'none';
        }

        // 防止提示框移动
        const currentLeft = parseInt(tooltipDiv.style.left);
        const currentTop = parseInt(tooltipDiv.style.top);

        // 确保提示框不会移动
        setTimeout(() => {
            tooltipDiv.style.left = `${currentLeft}px`;
            tooltipDiv.style.top = `${currentTop}px`;
        }, 10);
    }

    // 更新生词本面板内容
    function updateVocabPanel() {
        vocabPanel.innerHTML = '';

        // 创建标题行，包含标题和导出按钮
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        `;

        // 添加标题
        const titleDiv = document.createElement('div');
        titleDiv.className = 'maimemo-section-title';
        titleDiv.textContent = '我的生词本';
        titleDiv.style.fontSize = '16px';
        titleDiv.style.fontWeight = '600';

        // 添加导出按钮
        const exportButton = document.createElement('button');
        exportButton.textContent = '导出TXT';
        exportButton.className = 'maimemo-button';
        exportButton.style.background = '#4CAF50';
        exportButton.style.padding = '4px 8px';
        exportButton.style.fontSize = '11px';

        // 将标题和按钮添加到标题行
        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(exportButton);

        // 将标题行添加到面板
        vocabPanel.appendChild(headerDiv);

        // 添加生词列表
        const wordListDiv = document.createElement('div');
        wordListDiv.style.maxHeight = '250px';
        wordListDiv.style.overflowY = 'auto';

        const words = Array.from(memoryStore.vocabulary.entries()).sort((a, b) => a[0].localeCompare(b[0]));

        if (words.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = '生词本为空';
            emptyMsg.style.padding = '10px';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.color = '#86868b';
            wordListDiv.appendChild(emptyMsg);
        } else {
            words.forEach(([word, data]) => {
                const wordItem = document.createElement('div');
                wordItem.className = 'maimemo-phrase-item';
                wordItem.style.cursor = 'pointer';
                wordItem.style.marginBottom = '8px';
                wordItem.style.padding = '10px';

                // 单词标题
                const wordTitle = document.createElement('div');
                wordTitle.style.fontWeight = 'bold';
                wordTitle.style.fontSize = '15px';
                wordTitle.style.marginBottom = '6px';
                wordTitle.textContent = word;

                // 释义
                const interpretationDiv = document.createElement('div');
                interpretationDiv.className = 'maimemo-phrase-text';
                interpretationDiv.style.fontSize = '13px';
                interpretationDiv.textContent = data.interpretation || '(无释义)';

                // 例句数量
                const phrasesCount = document.createElement('div');
                phrasesCount.className = 'maimemo-phrase-translation';
                phrasesCount.style.fontSize = '12px';
                phrasesCount.style.color = '#86868b';
                phrasesCount.textContent = `例句: ${data.phrases ? data.phrases.length : 0}个`;

                // 操作按钮
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'space-between';
                buttonContainer.style.marginTop = '8px';

                const updateButton = document.createElement('button');
                updateButton.textContent = '更新';
                updateButton.className = 'maimemo-button';
                updateButton.style.background = '#0066cc';
                updateButton.style.padding = '4px 8px';
                updateButton.style.fontSize = '11px';

                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.className = 'maimemo-button';
                deleteButton.style.background = '#ff3b30';
                deleteButton.style.padding = '4px 8px';
                deleteButton.style.fontSize = '11px';

                buttonContainer.appendChild(updateButton);
                buttonContainer.appendChild(deleteButton);

                // 添加到词条
                wordItem.appendChild(wordTitle);
                wordItem.appendChild(interpretationDiv);
                wordItem.appendChild(phrasesCount);
                wordItem.appendChild(buttonContainer);

                // 点击单词项显示详情
                wordItem.addEventListener('click', function(e) {
                    if (e.target !== updateButton && e.target !== deleteButton) {
                        // 模拟选中该单词
                        currentWord = word;
                        currentVocId = data.vocId;

                        // 显示该单词的详细信息
                        showTooltip(
                            data.interpretation || '未找到释义，点击下方按钮添加释义',
                            data.phrases || [],
                            parseInt(tooltipDiv.style.left),
                            parseInt(tooltipDiv.style.top)
                        );
                    }
                });

                // 更新按钮事件
                updateButton.addEventListener('click', async function(e) {
        e.stopPropagation();

                    try {
                        // 获取最新的释义和例句
                        if (data.vocId) {
                            const newInterpretation = await getWordInterpretation(data.vocId);
                            const newPhrases = await getPhrases(data.vocId);

                            // 更新生词本中的数据
                            memoryStore.vocabulary.set(word, {
                                vocId: data.vocId,
                                interpretation: newInterpretation || data.interpretation,
                                phrases: newPhrases || data.phrases
                            });

                            saveVocabulary();
                            updateVocabPanel();
                            alert('单词信息已更新');
                        } else {
                            alert('无法更新，缺少单词ID');
                        }
                    } catch (error) {
                        console.error('更新单词信息失败:', error);
                        alert('更新失败: ' + error);
                    }
                });

                // 删除按钮事件
                deleteButton.addEventListener('click', function(e) {
        e.stopPropagation();
                    memoryStore.vocabulary.delete(word);
                    updateVocabPanel();
                    saveVocabulary();
                });

                wordListDiv.appendChild(wordItem);
            });
        }

        vocabPanel.appendChild(wordListDiv);

        // 添加导出功能
        exportButton.addEventListener('click', (e) => {
        e.stopPropagation();
            exportVocabulary();
        });
    }

    // 导出生词本
    function exportVocabulary() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const dateStr = `${year}${month}${day}`;

        const words = Array.from(memoryStore.vocabulary.entries()).sort((a, b) => a[0].localeCompare(b[0]));
        const content = `# ${dateStr}\n${words.map(([word, vocabData]) => `${word} - ${vocabData.interpretation}`).join('\n')}`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `生词本_${dateStr}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    // 添加到页面
    document.body.appendChild(tooltipDiv);
    console.log('脚本初始化完成');

    // 添加云词本相关函数
    async function fetchCloudNotepads() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://open.maimemo.com/open/api/v1/notepads?limit=10&offset=0',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            memoryStore.cloudNotepads = data.data.notepads;
                            resolve(data.data.notepads);
                        } else {
                            reject('获取云词本失败');
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    async function fetchNotepadWords(notepadId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://open.maimemo.com/open/api/v1/notepads/${notepadId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            const words = data.data.notepad.list
                                .filter(item => item.type === 'WORD')
                                .map(item => item.word);
                            resolve(words);
                        } else {
                            reject('获取云词本单词失败');
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    async function addWordToNotepad(notepadId, word) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://open.maimemo.com/open/api/v1/notepads/${notepadId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    notepad: {
                        status: 'PUBLISHED',
                        content: word,
                        title: '生词本',
                        brief: '通过划词工具添加的生词',
                        tags: ['考研']
                    }
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            resolve('添加成功');
                        } else {
                            reject('添加失败');
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 创建云词本选择器
    function createNotepadSelector() {
        const container = document.createElement('div');
        container.className = 'maimemo-notepad-selector';
        container.style.display = 'none';

        // 只保留生词数量显示
        const countDiv = document.createElement('div');
        countDiv.className = 'maimemo-vocabulary-count';
        countDiv.textContent = `生词本中共有 ${memoryStore.vocabulary.size} 个单词`;
        container.appendChild(countDiv);

        return container;
    }

    // 创建添加到生词本的按钮
    const addToVocabButton = document.createElement('button');
    addToVocabButton.textContent = '添加到生词本';
    addToVocabButton.className = 'maimemo-button';
    addToVocabButton.style.background = '#ff9500';
    addToVocabButton.style.flex = '1';

    // 创建云词本选择器
    const notepadSelector = createNotepadSelector();

    let currentWord = null;

    // 添加到生词本按钮的事件处理
    addToVocabButton.addEventListener('click', async function(e) {
        e.stopPropagation();
        if (!currentWord) {
            alert('请先选择单词');
            return;
        }

        if (memoryStore.vocabulary.has(currentWord)) {
            memoryStore.vocabulary.delete(currentWord);
            addToVocabButton.textContent = '添加到生词本';
            addToVocabButton.style.background = '#ff9500';
            notepadSelector.style.display = 'none';
        } else {
            // 获取当前单词的释义和例句
            let interpretation = null;
            let phrases = [];

            try {
                if (currentVocId) {
                    interpretation = await getWordInterpretation(currentVocId);
                    phrases = await getPhrases(currentVocId);
                }
            } catch (error) {
                console.error('获取单词信息失败:', error);
            }

            // 保存单词及其信息
            memoryStore.vocabulary.set(currentWord, {
                vocId: currentVocId,
                interpretation: interpretation || '',
                phrases: phrases || []
            });

            addToVocabButton.textContent = '从生词本移除';
            addToVocabButton.style.background = '#ff3b30';
            notepadSelector.style.display = 'block';
        }

        // 更新生词数量显示
        updateVocabularyCount();
        saveVocabulary();
    });

    // 更新生词数量显示
    function updateVocabularyCount() {
        const countDiv = document.querySelector('.maimemo-vocabulary-count') || document.createElement('div');
        countDiv.className = 'maimemo-vocabulary-count';
        countDiv.textContent = `生词本中共有 ${memoryStore.vocabulary.size} 个单词`;

        if (!document.querySelector('.maimemo-vocabulary-count')) {
            notepadSelector.appendChild(countDiv);
        }
    }

    // 使用localStorage存储生词本数据
    function saveVocabulary() {
        try {
            // 使用sessionStorage存储当前页面的时间戳，用于检测是否是同一个页面
            const pageId = sessionStorage.getItem('maimemo_page_id') || Date.now().toString();
            sessionStorage.setItem('maimemo_page_id', pageId);

            // 保存生词本数据和页面ID
            const dataToSave = {
                vocabulary: Array.from(memoryStore.vocabulary.entries()),
                pageId: pageId,
                timestamp: Date.now()
            };

            localStorage.setItem('maimemo_vocabulary', JSON.stringify(dataToSave));
            console.log('生词本已保存到localStorage，页面ID:', pageId);
        } catch (error) {
            console.error('保存生词本失败:', error);
        }
    }

    function loadVocabulary() {
        try {
            const saved = localStorage.getItem('maimemo_vocabulary');
            if (saved) {
                try {
                    const parsedData = JSON.parse(saved);

                    // 检查数据格式
                    if (parsedData && parsedData.vocabulary && Array.isArray(parsedData.vocabulary)) {
                        memoryStore.vocabulary = new Map(parsedData.vocabulary);
                        console.log('从localStorage加载生词本成功，共有', memoryStore.vocabulary.size, '个单词');

                        // 获取当前页面ID
                        const currentPageId = sessionStorage.getItem('maimemo_page_id');

                        // 如果不是当前页面保存的数据，记录一下
                        if (currentPageId && parsedData.pageId && currentPageId !== parsedData.pageId) {
                            console.log('从其他页面加载的生词本数据，页面ID:', parsedData.pageId);
                        }
                    } else {
                        // 兼容旧格式数据
                        if (Array.isArray(parsedData)) {
                            memoryStore.vocabulary = new Map(parsedData);
                            console.log('从旧格式加载生词本成功，共有', memoryStore.vocabulary.size, '个单词');
                            // 保存为新格式
                            saveVocabulary();
                        } else {
                            console.error('生词本数据格式错误，重置生词本');
                            memoryStore.vocabulary = new Map();
                            saveVocabulary(); // 重置存储
                        }
                    }
                } catch (error) {
                    console.error('解析生词本数据失败:', error);
                    memoryStore.vocabulary = new Map();
                    saveVocabulary(); // 重置存储
                }
            } else {
                memoryStore.vocabulary = new Map();
                console.log('localStorage中没有生词本数据');
            }
        } catch (error) {
            console.error('加载生词本失败:', error);
            memoryStore.vocabulary = new Map();
        }
    }

    // 增强storage事件监听，确保跨页面同步
    window.addEventListener('storage', function(e) {
        if (e.key === 'maimemo_vocabulary') {
            console.log('检测到其他页面更新了生词本');

            try {
                const newData = JSON.parse(e.newValue);

                // 检查数据格式
                if (newData && newData.vocabulary && Array.isArray(newData.vocabulary)) {
                    // 获取当前页面ID
                    const currentPageId = sessionStorage.getItem('maimemo_page_id');

                    // 如果不是当前页面保存的数据，则更新
                    if (currentPageId !== newData.pageId) {
                        console.log('从页面ID更新生词本:', newData.pageId);
                        memoryStore.vocabulary = new Map(newData.vocabulary);

                        // 如果当前正在显示生词本，则更新显示
                        if (vocabPanel.style.display === 'block') {
                            updateVocabPanel();
                        }

                        // 如果当前有选中的单词，更新按钮状态
                        if (currentWord) {
                            updateButtonStyles();
                        }
                    }
                }
            } catch (error) {
                console.error('解析storage事件数据失败:', error);
            }
        }
    });

    // 确保页面加载和卸载时都保存生词本
    window.addEventListener('beforeunload', function() {
        saveVocabulary();
    });

    // 检测是否在墨墨官网
    function isMaiMemoSite() {
        return window.location.hostname.includes('maimemo.com');
    }

    // 在墨墨官网添加导入按钮
    if (isMaiMemoSite()) {
        // 等待页面加载完成
        window.addEventListener('load', function() {
            // 尝试查找墨墨生词本区域
            const checkForNotepadArea = setInterval(function() {
                const notepadArea = document.querySelector('.notepad-container') ||
                                   document.querySelector('.vocabulary-list') ||
                                   document.querySelector('.word-list-container');

                if (notepadArea) {
                    clearInterval(checkForNotepadArea);

                    // 创建导入按钮
                    const importButton = document.createElement('button');
                    importButton.textContent = '导入本地生词本';
                    importButton.className = 'maimemo-button';
                    importButton.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        z-index: 1000;
                        background: #0066cc;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 8px 16px;
                        cursor: pointer;
                    `;

                    // 添加导入功能
                    importButton.addEventListener('click', async function() {
                        try {
                            // 加载本地生词本
                            loadVocabulary();

                            // 获取生词本中的单词
                            const words = Array.from(memoryStore.vocabulary.keys());

                            if (words.length === 0) {
                                alert('本地生词本为空');
                                return;
                            }

                            // 获取当前选中的云词本ID
                            let notepadId = null;

                            // 尝试从页面URL或DOM中获取词本ID
                            const urlMatch = window.location.href.match(/notepads\/(\d+)/);
                            if (urlMatch) {
                                notepadId = urlMatch[1];
                            }

                            if (!notepadId) {
                                // 如果没有找到ID，提示用户选择一个云词本
                                const notepads = await fetchCloudNotepads();
                                if (notepads.length === 0) {
                                    alert('未找到云词本，请先创建一个');
                                    return;
                                }

                                // 创建选择器
                                const select = document.createElement('select');
                                notepads.forEach(notepad => {
                                    const option = document.createElement('option');
                                    option.value = notepad.id;
                                    option.textContent = notepad.title;
                                    select.appendChild(option);
                                });

                                // 显示选择器
                                const result = prompt('请选择要导入到的云词本ID:\n' +
                                    notepads.map(n => `${n.id}: ${n.title}`).join('\n'));

                                if (!result) return;

                                notepadId = result.trim();
                            }

                            if (!notepadId) {
                                alert('未选择云词本');
                                return;
                            }

                            // 开始导入
                            let successCount = 0;
                            let failCount = 0;

                            for (const word of words) {
                                try {
                                    await addWordToNotepad(notepadId, word);
                                    successCount++;
                                } catch (error) {
                                    console.error('导入单词失败:', word, error);
                                    failCount++;
                                }

                                // 添加延迟避免请求过快
                                await new Promise(resolve => setTimeout(resolve, 300));
                            }

                            alert(`导入完成！成功: ${successCount}, 失败: ${failCount}`);

                            // 刷新页面显示新导入的单词
                            if (successCount > 0) {
                                window.location.reload();
                            }
                        } catch (error) {
                            console.error('导入失败:', error);
                            alert('导入失败: ' + error);
        }
    });

    // 添加到页面
                    notepadArea.style.position = 'relative';
                    notepadArea.appendChild(importButton);
                }
            }, 1000);
        });
    }

    // 阻止工具提示框内的点击事件冒泡
    tooltipDiv.addEventListener('mousedown', function(e) {
        e.stopPropagation();
    });

    tooltipDiv.addEventListener('mouseup', function(e) {
        e.stopPropagation();
    });

    tooltipDiv.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 确保页面加载时立即加载生词本
    window.addEventListener('load', function() {
        loadVocabulary();
        console.log('页面加载完成，已加载生词本');
    });

    // 立即执行加载，不等待DOMContentLoaded
    (function() {
        loadVocabulary();
        console.log('脚本初始化时加载生词本');
    })();
})();