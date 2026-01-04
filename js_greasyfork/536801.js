// ==UserScript==
// @name         国开答题助手（可自动勾选答案、一键复制题目及提示词到剪贴板、AI自动答题）
// @namespace    http://tampermonkey.net/
// @homepage	 https://github.com/minivv/tampermonkey
// @version      0.7
// @description  国开答题辅助工具，可自动勾选答案、一键复制题目及提示词到剪贴板、AI自动答题。
// @author       minivv
// @match        https://lms.ouchn.cn/exam/*/subjects*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.deepseek.com
// @connect      *
// @icon         https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @run-at       document-idle
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/536801/%E5%9B%BD%E5%BC%80%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%EF%BC%88%E5%8F%AF%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E7%AD%94%E6%A1%88%E3%80%81%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E9%A2%98%E7%9B%AE%E5%8F%8A%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF%E3%80%81AI%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536801/%E5%9B%BD%E5%BC%80%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%EF%BC%88%E5%8F%AF%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E7%AD%94%E6%A1%88%E3%80%81%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E9%A2%98%E7%9B%AE%E5%8F%8A%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF%E3%80%81AI%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- UI 元素 ---
    const panel = document.createElement('div');
    panel.id = 'answerHelperPanel';
    document.body.appendChild(panel);

    const title = document.createElement('h3');
    title.textContent = '国开答题助手';
    panel.appendChild(title);

    // 创建标签页容器
    const tabContainer = document.createElement('div');
    tabContainer.id = 'tabContainer';
    tabContainer.style.marginBottom = '10px';
    panel.appendChild(tabContainer);

    // 创建标签页按钮
    const manualTab = document.createElement('button');
    manualTab.id = 'manualTab';
    manualTab.textContent = '手动答题';
    manualTab.className = 'tab-button active';
    tabContainer.appendChild(manualTab);

    const aiTab = document.createElement('button');
    aiTab.id = 'aiTab';
    aiTab.textContent = 'AI一键答题';
    aiTab.className = 'tab-button';
    tabContainer.appendChild(aiTab);

    // 创建标签页内容区域
    const tabContents = document.createElement('div');
    tabContents.id = 'tabContents';
    panel.appendChild(tabContents);

    // 手动答题标签页内容
    const manualTabContent = document.createElement('div');
    manualTabContent.id = 'manualTabContent';
    manualTabContent.className = 'tab-content';
    tabContents.appendChild(manualTabContent);

    const instructions = document.createElement('p');
    instructions.innerHTML = `请粘贴答案，格式如下：<br>1. A<br>2. A, B<br>3. C<br>(题号后可跟 . 或 、 或 ．)`;
    manualTabContent.appendChild(instructions);

    const answerTextArea = document.createElement('textarea');
    answerTextArea.id = 'answerInputArea';
    answerTextArea.rows = 6;
    answerTextArea.cols = 35;
    answerTextArea.placeholder = "例如：\n1. A\n2. A, B\n3. C,D\n49. A,B,C";
    manualTabContent.appendChild(answerTextArea);

    const submitButton = document.createElement('button');
    submitButton.id = 'submitAnswersButton';
    submitButton.textContent = '自动勾选答案';
    submitButton.className = 'primary-button';
    manualTabContent.appendChild(submitButton);

    const copyButton = document.createElement('button');
    copyButton.id = 'copyQuestionsButton';
    copyButton.textContent = '复制题目到剪贴板';
    copyButton.className = 'secondary-button';
    copyButton.style.marginTop = '8px';
    manualTabContent.appendChild(copyButton);

    // AI一键答题标签页内容
    const aiTabContent = document.createElement('div');
    aiTabContent.id = 'aiTabContent';
    aiTabContent.className = 'tab-content';
    aiTabContent.style.display = 'none'; // 初始隐藏
    tabContents.appendChild(aiTabContent);

    // API配置区域
    const apiConfigContainer = document.createElement('div');
    apiConfigContainer.id = 'apiConfigContainer';
    apiConfigContainer.style.marginBottom = '12px';
    aiTabContent.appendChild(apiConfigContainer);

    // API Key输入框
    const apiKeyLabel = document.createElement('label');
    apiKeyLabel.textContent = 'API Key: ';
    apiKeyLabel.style.fontSize = '0.85em';
    apiKeyLabel.style.display = 'block';
    apiKeyLabel.style.marginBottom = '4px';
    apiConfigContainer.appendChild(apiKeyLabel);

    const apiKeyInput = document.createElement('input');
    apiKeyInput.id = 'deepseekApiKey';
    apiKeyInput.type = 'password';
    apiKeyInput.placeholder = '请输入API Key';
    apiKeyInput.style.width = '100%';
    apiKeyInput.style.boxSizing = 'border-box';
    apiKeyInput.style.padding = '4px';
    apiKeyInput.style.marginBottom = '4px';
    apiKeyInput.style.borderRadius = '4px';
    apiKeyInput.style.border = '1px solid #ced4da';
    apiKeyInput.value = GM_getValue('deepseekApiKey', '');
    apiKeyInput.addEventListener('change', function() {
        GM_setValue('deepseekApiKey', this.value);
        logStatus("API Key已保存", false);
    });
    apiConfigContainer.appendChild(apiKeyInput);

    const apiKeyToggle = document.createElement('button');
    apiKeyToggle.textContent = '显示API Key';
    apiKeyToggle.style.fontSize = '0.7em';
    apiKeyToggle.style.padding = '2px 5px';
    apiKeyToggle.style.marginLeft = '5px';
    apiKeyToggle.addEventListener('click', function() {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            apiKeyToggle.textContent = '隐藏API Key';
        } else {
            apiKeyInput.type = 'password';
            apiKeyToggle.textContent = '显示API Key';
        }
    });
    apiConfigContainer.appendChild(apiKeyToggle);

    // API站点输入框
    const apiUrlLabel = document.createElement('label');
    apiUrlLabel.textContent = 'API站点: ';
    apiUrlLabel.style.fontSize = '0.85em';
    apiUrlLabel.style.display = 'block';
    apiUrlLabel.style.marginBottom = '4px';
    apiUrlLabel.style.marginTop = '8px';
    apiConfigContainer.appendChild(apiUrlLabel);

    const apiUrlInput = document.createElement('input');
    apiUrlInput.id = 'apiUrl';
    apiUrlInput.type = 'text';
    apiUrlInput.placeholder = '默认为https://api.deepseek.com';
    apiUrlInput.style.width = '100%';
    apiUrlInput.style.boxSizing = 'border-box';
    apiUrlInput.style.padding = '4px';
    apiUrlInput.style.marginBottom = '4px';
    apiUrlInput.style.borderRadius = '4px';
    apiUrlInput.style.border = '1px solid #ced4da';
    apiUrlInput.value = GM_getValue('apiUrl', 'https://api.deepseek.com');
    apiUrlInput.addEventListener('change', function() {
        GM_setValue('apiUrl', this.value || 'https://api.deepseek.com');
        logStatus("API站点已保存", false);
    });
    apiConfigContainer.appendChild(apiUrlInput);

    // 模型名称输入框
    const modelNameLabel = document.createElement('label');
    modelNameLabel.textContent = '模型名称: ';
    modelNameLabel.style.fontSize = '0.85em';
    modelNameLabel.style.display = 'block';
    modelNameLabel.style.marginBottom = '4px';
    modelNameLabel.style.marginTop = '8px';
    apiConfigContainer.appendChild(modelNameLabel);

    const modelNameInput = document.createElement('input');
    modelNameInput.id = 'modelName';
    modelNameInput.type = 'text';
    modelNameInput.placeholder = '默认为deepseek-chat';
    modelNameInput.style.width = '100%';
    modelNameInput.style.boxSizing = 'border-box';
    modelNameInput.style.padding = '4px';
    modelNameInput.style.marginBottom = '4px';
    modelNameInput.style.borderRadius = '4px';
    modelNameInput.style.border = '1px solid #ced4da';
    modelNameInput.value = GM_getValue('modelName', 'deepseek-chat');
    modelNameInput.addEventListener('change', function() {
        GM_setValue('modelName', this.value || 'deepseek-chat');
        logStatus("模型名称已保存", false);
    });
    apiConfigContainer.appendChild(modelNameInput);

    const aiButton = document.createElement('button');
    aiButton.id = 'aiAnswerButton';
    aiButton.textContent = 'AI自动答题';
    aiButton.className = 'ai-button';
    aiTabContent.appendChild(aiButton);

    // 状态信息区域
    const statusDiv = document.createElement('div');
    statusDiv.id = 'statusMessage';
    panel.appendChild(statusDiv);

    // 标签页切换功能
    manualTab.addEventListener('click', function() {
        manualTab.className = 'tab-button active';
        aiTab.className = 'tab-button';
        manualTabContent.style.display = 'block';
        aiTabContent.style.display = 'none';
    });

    aiTab.addEventListener('click', function() {
        aiTab.className = 'tab-button active';
        manualTab.className = 'tab-button';
        aiTabContent.style.display = 'block';
        manualTabContent.style.display = 'none';
    });

    // --- 样式 ---
    GM_addStyle(`
        #answerHelperPanel {
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: #f8f9fa;
            border: 1px solid #ced4da;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            font-family: "Microsoft YaHei", "Segoe UI", Roboto, sans-serif;
            width: 300px;
            border-radius: 8px;
        }
        #answerHelperPanel h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #343a40;
            font-size: 1.2em;
            text-align: center;
        }
        #answerHelperPanel p {
            font-size: 0.85em;
            color: #495057;
            margin-bottom: 10px;
            line-height: 1.4;
        }
        #answerInputArea {
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 10px;
            border: 1px solid #ced4da;
            padding: 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        /* 标签页样式 */
        #tabContainer {
            display: flex;
            border-bottom: 1px solid #dee2e6;
            margin-bottom: 15px;
        }
        .tab-button {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-bottom: none;
            border-radius: 4px 4px 0 0;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 0.9em;
            margin-right: 5px;
            outline: none;
            flex: 1;
        }
        .tab-button.active {
            background-color: #fff;
            border-bottom: 1px solid #fff;
            margin-bottom: -1px;
            font-weight: bold;
        }
        .tab-content {
            padding: 5px 0;
        }
        /* 按钮样式 */
        .primary-button {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
            font-size: 1em;
        }
        .primary-button:hover {
            background-color: #0056b3;
        }
        .secondary-button {
            background-color: #28a745;
            color: white;
            padding: 10px 15px;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
            font-size: 1em;
        }
        .secondary-button:hover {
            background-color: #1e7e34;
        }
        .ai-button {
            background-color: #6f42c1;
            color: white;
            padding: 10px 15px;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
            font-size: 1em;
            margin-top: 8px;
        }
        .ai-button:hover {
            background-color: #5a32a3;
        }
        #statusMessage {
            margin-top: 12px;
            font-size: 0.85em;
            padding: 8px;
            border-radius: 4px;
            background-color: #e9ecef;
            min-height: 30px;
            max-height: 150px;
            overflow-y: auto;
        }
    `);

    // --- 选择器配置 (全局) ---
    // 1. `questionBlocksSelector`: 选取【每一个独立题目】的容器元素。
    const questionBlocksSelector = 'div[ng-if="subject.isObjective()"]';

    // 2. `questionNumberSelector`: 在单个题目块(block)内部，找到【题号数字所在的元素】。
    const questionNumberSelector = '.subject-resort-index span.ng-binding';

    // 3. `optionLabelsSelector`: 在单个题目块(block)内部，找到【每个选项的<label>元素】。
    const optionLabelsSelector = 'ol.subject-options li.option > label';

    // 4. `getOptionInputElement`: 根据选项的<label>元素，找到其对应的【可选的<input>元素】。
    function getOptionInputElement(labelElement) {
        return labelElement.querySelector('input[type="radio"], input[type="checkbox"]');
    }

    // 5. `getOptionLetter`: 从选项的<label>元素中提取【选项字母 (A, B, C...)】。
    function getOptionLetter(labelElement) {
        const optionIndexElement = labelElement.querySelector('span.option-index');
        return optionIndexElement ? optionIndexElement.textContent.trim().toUpperCase() : null;
    }

    // 6. `getOptionText`: 从选项的<label>元素中提取【选项的文本内容】。
    function getOptionText(labelElement) {
        const optionContentElement = labelElement.querySelector('.option-content');
        return optionContentElement ? optionContentElement.textContent.trim() : '选项内容为空';
    }

    // 7. `getQuestionStem`: 从题目块(block)中提取【题干/描述】。
    function getQuestionStem(block) {
        const stemElement = block.querySelector('.subject-description'); // 您提供的HTML中题干的class
        return stemElement ? stemElement.textContent.trim() : '题干为空';
    }

    // 8. `getQuestionType`: 从题目块(block)中提取【题目类型】。
    function getQuestionType(block) {
        const typeElement = block.querySelector('.summary-sub-title span.ng-binding:first-child'); // 您提供的HTML中题型的选择器
        return typeElement ? typeElement.textContent.trim() : '类型未知';
    }
    // --- 选择器配置结束 ---

    // --- 核心逻辑 ---
    submitButton.addEventListener('click', processAnswers);
    copyButton.addEventListener('click', copyQuestionsToClipboard); // 复制按钮的事件监听
    aiButton.addEventListener('click', processAiAnswer); // AI按钮的事件监听

    // 切换到AI标签页时自动聚焦到API Key输入框
    aiTab.addEventListener('click', function() {
        if (!apiKeyInput.value) {
            setTimeout(() => apiKeyInput.focus(), 100);
        }
    });

    function logStatus(message, isError = false) {
        const now = new Date();
        const timestamp = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const newLogEntry = document.createElement('div');
        newLogEntry.textContent = `[${timestamp}] ${message}`;
        newLogEntry.style.color = isError ? '#dc3545' : '#28a745';
        if (isError) newLogEntry.style.fontWeight = 'bold';
        newLogEntry.style.marginBottom = '5px'; // 为每条日志添加下边距

        statusDiv.appendChild(newLogEntry);
        statusDiv.scrollTop = statusDiv.scrollHeight;

        console.log((isError ? "错误: " : "状态: ") + message);
    }

    function parseInput(inputText) {
        const lines = inputText.trim().split('\n');
        const parsed = [];
        const lineRegex = /^(\d+)\s*[．.\u3001]\s*([A-Za-z](?:\s*,\s*[A-Za-z])*)$/;

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === "") continue;

            const match = trimmedLine.match(lineRegex);
            if (match) {
                const qNum = match[1];
                const answers = match[2].split(',').map(a => a.trim().toUpperCase());
                parsed.push({ qNum, answers });
            } else {
                logStatus(`无法解析行: "${trimmedLine}". 请检查格式 (例如: 1. A 或 1. A,B).`, true);
            }
        }
        return parsed;
    }

    function processAnswers() {
        const inputText = answerTextArea.value;
        if (!inputText.trim()) {
            logStatus("请输入答案!", true);
            return;
        }

        const userAnswers = parseInput(inputText);
        if (!userAnswers || userAnswers.length === 0) {
            logStatus("未解析到有效答案或输入格式完全错误.", true);
            return;
        }

        const questionBlocks = document.querySelectorAll(questionBlocksSelector);

        if (questionBlocks.length === 0) {
            logStatus(`错误: 未在页面上找到任何题目块 (使用选择器: "${questionBlocksSelector}"). 请确认此选择器是否正确匹配每个题目外层容器。如果题目不是div或者ng-if的值不同，请修改。`, true);
            return;
        }

        let questionsFoundAndAttempted = 0;
        let answersSuccessfullySet = 0;

        userAnswers.forEach(ua => {
            let questionMatchedOnPage = false;
            for (const block of questionBlocks) {
                let pageQNum = null;
                const qNumElement = block.querySelector(questionNumberSelector);

                if (qNumElement) {
                    const numMatch = qNumElement.textContent.trim().match(/^(\d+)/);
                    if (numMatch) {
                        pageQNum = numMatch[1];
                    }
                } else {
                    const blockTextMatch = block.textContent.trim().match(/^(\d+)/);
                    if (blockTextMatch) pageQNum = blockTextMatch[1];
                }


                if (pageQNum === ua.qNum) {
                    questionMatchedOnPage = true;
                    questionsFoundAndAttempted++;
                    const optionLabels = block.querySelectorAll(optionLabelsSelector);
                    if (optionLabels.length === 0) {
                        logStatus(`警告: 题目 ${ua.qNum} 内部未找到选项标签 (使用选择器: "${optionLabelsSelector}"). 请检查 'optionLabelsSelector'.`, true);
                        continue;
                    }

                    let optionsSelectedCount = 0;
                    optionLabels.forEach(label => {
                        const inputElement = getOptionInputElement(label);
                        const optionLetter = getOptionLetter(label);

                        if (inputElement && optionLetter) {
                            if (ua.answers.includes(optionLetter)) {
                                if (!inputElement.checked) {
                                    inputElement.click();
                                    if (inputElement.checked) {
                                       logStatus(`  - 题目 ${ua.qNum}: 已选择选项 ${optionLetter}`, false);
                                       optionsSelectedCount++;
                                    } else {
                                       logStatus(`  - 题目 ${ua.qNum}: 尝试点击选项 ${optionLetter}，但似乎未成功选中。可能需要特殊处理或事件触发。`, true);
                                    }
                                } else {
                                    logStatus(`  - 题目 ${ua.qNum}: 选项 ${optionLetter} 已是选中状态.`, false);
                                    optionsSelectedCount++;
                                }
                            }
                        } else if (!inputElement) {
                             logStatus(`  - 题目 ${ua.qNum}: 选项 ${optionLetter || '未知'} 找不到对应的 input 元素.`, true);
                        } else if (!optionLetter) {
                             logStatus(`  - 题目 ${ua.qNum}: 某个选项无法提取选项字母.`, true);
                        }
                    });

                    if (optionsSelectedCount === ua.answers.length) {
                        answersSuccessfullySet++;
                    } else if (ua.answers.length > 0 && optionsSelectedCount < ua.answers.length) {
                        logStatus(`警告: 题目 ${ua.qNum}: 目标选择 ${ua.answers.length} 个, 实际操作 ${optionsSelectedCount} 个. 请检查页面选项是否完整或答案是否有误.`, true);
                    }
                    break;
                }
            }

            if (!questionMatchedOnPage) {
                logStatus(`警告: 未在页面上找到您输入的题目 ${ua.qNum}. 请检查题号或页面题目范围.`, true);
            }
        });

        if (questionsFoundAndAttempted > 0) {
             logStatus(`处理完成! 共匹配到 ${questionsFoundAndAttempted} 个您输入的题目, 其中 ${answersSuccessfullySet} 个题目的选项已按预期设置. 请仔细核对页面上的选择!`, false);
        } else if (userAnswers.length > 0) {
            logStatus("处理完成, 但未能匹配到您输入的任何题目. 请重点检查脚本中的 'questionBlocksSelector' 配置及页面实际题号.", true);
        } else {
            logStatus("处理完成, 没有有效的用户答案输入.", true);
        }
    }

    // --- 新增：复制题目到剪贴板功能 ---
    async function copyQuestionsToClipboard() {
        logStatus("开始复制题目内容...", false);

        const questionBlocks = document.querySelectorAll(questionBlocksSelector);
        logStatus(`查找到 ${questionBlocks.length} 个题目块。`, false);

        if (questionBlocks.length === 0) {
            logStatus(`错误: 未在页面上找到任何题目块 (使用选择器: "${questionBlocksSelector}"). 请检查脚本中的选择器配置。`, true);
            return;
        }

        let allQuestionsText = "";
        let questionsCopiedCount = 0;

        questionBlocks.forEach((block, index) => {
            try {
                let questionText = `仅输出题号和答案的选项，严格按照格式单选: 1. A 或多选 24. A,B,D这种格式输出，多个题目之间需要换行。以下是所有题：\n`;
                let pageQNum = "未知题号";
                const qNumElement = block.querySelector(questionNumberSelector);
                if (qNumElement) {
                    const numMatch = qNumElement.textContent.trim().match(/^(\d+)/);
                    if (numMatch) pageQNum = numMatch[1];
                }

                const qType = getQuestionType(block);
                const qStem = getQuestionStem(block);

                questionText += `题号: ${pageQNum}. (${qType})\n`;
                questionText += `题干: ${qStem}\n`;
                questionText += "选项:\n";

                const optionLabels = block.querySelectorAll(optionLabelsSelector);
                if (optionLabels.length > 0) {
                    optionLabels.forEach(label => {
                        const optionLetter = getOptionLetter(label);
                        const optionTextContent = getOptionText(label);
                        if (optionLetter) {
                            questionText += `  ${optionLetter}. ${optionTextContent}\n`;
                        }
                    });
                } else {
                    questionText += "  (未找到选项或选项格式无法解析)\n";
                }
                questionText += "--------------------\n\n";
                allQuestionsText += questionText;
                questionsCopiedCount++;
            } catch (err) {
                logStatus(`处理题目 ${index + 1} 时出错: ${err.message}`, true);
                console.error(`处理题目 ${index + 1} 时出错:`, err);
            }
        });

        if (questionsCopiedCount > 0) {
            try {
                await navigator.clipboard.writeText(allQuestionsText);
                logStatus(`成功复制 ${questionsCopiedCount} 道题目的内容到剪贴板!`, false);
            } catch (err) {
                logStatus(`复制到剪贴板失败: ${err.message}. 可能是浏览器限制或权限问题。内容已打印到控制台。`, true);
                console.log("复制失败的题目内容：\n", allQuestionsText); // 备用方案，打印到控制台
                // 尝试使用 GM_setClipboard 作为备选方案
                try {
                    GM_setClipboard(allQuestionsText, 'text');
                    logStatus(`已尝试使用 GM_setClipboard 作为备用方案复制内容。`, false);
                } catch (clipErr) {
                    logStatus(`GM_setClipboard 也失败了: ${clipErr.message}. 请检查浏览器设置或手动复制控制台中的内容。`, true);
                }
            }
        } else {
            logStatus("未找到可复制的题目内容。", true);
        }
    }

    // --- 新增：DeepSeek AI自动答题功能 ---
    async function processAiAnswer() {
        logStatus("开始AI自动答题流程...", false);

        // 检查API Key
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            logStatus("错误: 请先设置API Key!", true);
            return;
        }

        // 获取题目内容
        logStatus("正在获取题目内容...", false);
        const questionBlocks = document.querySelectorAll(questionBlocksSelector);

        if (questionBlocks.length === 0) {
            logStatus(`错误: 未在页面上找到任何题目块 (使用选择器: "${questionBlocksSelector}"). 请检查脚本中的选择器配置。`, true);
            return;
        }

        // 构建题目文本，与复制功能类似
        let allQuestionsText = "";
        let questionsProcessed = 0;

        questionBlocks.forEach((block, index) => {
            try {
                let questionText = `仅输出题号和答案的选项，严格按照格式单选: 1. A 或多选 24. A,B,D这种格式输出，多个题目之间需要换行。以下是所有题：\n`;
                let pageQNum = "未知题号";
                const qNumElement = block.querySelector(questionNumberSelector);
                if (qNumElement) {
                    const numMatch = qNumElement.textContent.trim().match(/^(\d+)/);
                    if (numMatch) pageQNum = numMatch[1];
                }

                const qType = getQuestionType(block);
                const qStem = getQuestionStem(block);

                questionText += `题号: ${pageQNum}. (${qType})\n`;
                questionText += `题干: ${qStem}\n`;
                questionText += "选项:\n";

                const optionLabels = block.querySelectorAll(optionLabelsSelector);
                if (optionLabels.length > 0) {
                    optionLabels.forEach(label => {
                        const optionLetter = getOptionLetter(label);
                        const optionTextContent = getOptionText(label);
                        if (optionLetter) {
                            questionText += `  ${optionLetter}. ${optionTextContent}\n`;
                        }
                    });
                } else {
                    questionText += "  (未找到选项或选项格式无法解析)\n";
                }
                questionText += "--------------------\n\n";
                allQuestionsText += questionText;
                questionsProcessed++;
            } catch (err) {
                logStatus(`处理题目 ${index + 1} 时出错: ${err.message}`, true);
                console.error(`处理题目 ${index + 1} 时出错:`, err);
            }
        });

        if (questionsProcessed === 0) {
            logStatus("未能处理任何题目，无法继续。", true);
            return;
        }

        logStatus(`成功处理 ${questionsProcessed} 道题目。正在发送到AI...`, false);

        try {
            // 调用AI API
            const response = await callDeepSeekAPI(allQuestionsText, apiKey);

            if (!response || !response.choices || !response.choices[0] || !response.choices[0].message || !response.choices[0].message.content) {
                logStatus("从AI API获取的响应格式不正确。", true);
                console.error("API响应:", response);
                return;
            }

            const aiAnswer = response.choices[0].message.content;
            logStatus("AI返回答案成功！正在解析答案...", false);

            // 将AI回答填入文本框
            answerTextArea.value = aiAnswer;

            // 自动执行勾选答案
            logStatus("正在自动勾选AI提供的答案...", false);
            processAnswers();

        } catch (error) {
            logStatus(`调用DeepSeek API出错: ${error.message}`, true);
            console.error("API调用错误:", error);
        }
    }

    // 调用AI API的函数
    function callDeepSeekAPI(prompt, apiKey) {
        return new Promise((resolve, reject) => {
            // 获取自定义API站点和模型名称
            const apiUrl = apiUrlInput.value.trim() || 'https://api.deepseek.com';
            const modelName = modelNameInput.value.trim() || 'deepseek-chat';

            // 提取域名信息，用于日志显示
            let domain = apiUrl;
            try {
                const urlObj = new URL(apiUrl);
                domain = urlObj.hostname;
            } catch (e) {
                console.error("URL解析错误:", e);
            }

            // 创建基本状态消息
            const statusMessage = `正在发送请求到 ${domain}`;
            logStatus(`${statusMessage}...`, false);
            logStatus(`使用模型: ${modelName}`, false);

            // 创建加载指示器
            let dots = 0;
            const maxDots = 3;
            const loadingInterval = setInterval(() => {
                dots = (dots % maxDots) + 1;
                const dotsStr = '.'.repeat(dots);
                // 更新最后一条状态消息
                const lastLogEntry = statusDiv.lastElementChild.previousElementSibling;
                if (lastLogEntry && lastLogEntry.textContent.includes(statusMessage)) {
                    const timestamp = lastLogEntry.textContent.split(']')[0] + ']';
                    lastLogEntry.textContent = `${timestamp} ${statusMessage}${dotsStr}`;
                }
            }, 500);

            GM_xmlhttpRequest({
                method: "POST",
                url: `${apiUrl}/v1/chat/completions`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    model: modelName,
                    messages: [
                        {
                            role: "system",
                            content: "你是一个专业的答题助手。请根据题目内容，直接给出答案，格式为题号+答案选项，例如：1. A 或 2. A,B,C。不要解释，只需要给出答案。"
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.3
                }),
                onload: function(response) {
                    // 清除加载指示器
                    clearInterval(loadingInterval);

                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            logStatus("解析AI响应失败: " + e.message, true);
                            reject(new Error("解析AI响应失败: " + e.message));
                        }
                    } else {
                        logStatus(`AI请求失败: 状态码 ${response.status}`, true);
                        try {
                            const errorData = JSON.parse(response.responseText);
                            logStatus(`AI错误: ${JSON.stringify(errorData)}`, true);
                            reject(new Error(`AI请求失败: ${JSON.stringify(errorData)}`));
                        } catch (e) {
                            reject(new Error(`AI请求失败: 状态码 ${response.status}`));
                        }
                    }
                },

                onerror: function(error) {
                    // 清除加载指示器
                    clearInterval(loadingInterval);
                    logStatus("AI请求网络错误", true);
                    reject(new Error("网络错误: " + error.error));
                },
                ontimeout: function() {
                    // 清除加载指示器
                    clearInterval(loadingInterval);
                    logStatus("AI请求超时", true);
                    reject(new Error("请求超时"));
                }
            });
        });
    }

    logStatus("【答题助手已加载】分为手动答题和AI一键答题，点击上方标签切换。手动答题流程：点击复制题目按钮（自带AI格式要求提示词，直接粘贴到AI平台即可），将AI输出的答案复制，粘贴到答题页面，点击自动勾选答案按钮勾选答案。", false);
})();