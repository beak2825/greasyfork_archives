// ==UserScript==
// @name         NEW单选/多选/填空题自动答题脚本（含多行填空支持和Excel导入）
// @namespace    http://tampermonkey.net/
// @version      7.1.1
// @description  自动完成单选题、多选题、填空题（包括多行小空填空题），支持随机答题、固定答案配置和Excel导入
// @author       蜡笔小新不是新
// @match        *://*.wjx.cn/*/*
// @match        *://*.wjx.top/*/*
// @match        *://*.wjx.com/*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @icon         https://img.icons8.com/color/96/000000/robot.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547616/NEW%E5%8D%95%E9%80%89%E5%A4%9A%E9%80%89%E5%A1%AB%E7%A9%BA%E9%A2%98%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%88%E5%90%AB%E5%A4%9A%E8%A1%8C%E5%A1%AB%E7%A9%BA%E6%94%AF%E6%8C%81%E5%92%8CExcel%E5%AF%BC%E5%85%A5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547616/NEW%E5%8D%95%E9%80%89%E5%A4%9A%E9%80%89%E5%A1%AB%E7%A9%BA%E9%A2%98%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%88%E5%90%AB%E5%A4%9A%E8%A1%8C%E5%A1%AB%E7%A9%BA%E6%94%AF%E6%8C%81%E5%92%8CExcel%E5%AF%BC%E5%85%A5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户配置：固定答案
    const defaultFixedAnswers = {};

    // 加载用户保存的配置
    let fixedAnswers = GM_getValue('fixedAnswers', defaultFixedAnswers);

    // 创建配置界面
    function createConfigPanel() {
        GM_addStyle(`
            .auto-answer-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 420px;
                background: linear-gradient(135deg, #1e3c72, #2a5298);
                color: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                z-index: 9999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                overflow: hidden;
                max-height: 80vh;
                display: none;
            }

            .panel-header {
                background: rgba(0,0,0,0.2);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .panel-title {
                font-size: 1.4rem;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s;
            }

            .close-btn:hover {
                opacity: 1;
            }

            .panel-content {
                padding: 20px;
                overflow-y: auto;
                max-height: 60vh;
            }

            .section {
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .section-title {
                font-size: 1.2rem;
                margin-bottom: 15px;
                color: #64b3f4;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .config-item {
                background: rgba(255,255,255,0.08);
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
            }

            .question-title {
                font-weight: bold;
                margin-bottom: 10px;
                color: #a7c7ff;
                display: flex;
                align-items: center;
            }

            .question-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 0.8rem;
                margin-left: 10px;
            }

            .badge-radio {
                background: #3498db;
            }

            .badge-checkbox {
                background: #2ecc71;
            }
            .badge-text {
                background: #34495e;
            }
            .badge-multiline {
                background: #9b59b6;
            }
            .badge-multigap {
                background: #e67e22;
            }

            .options-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
                color: #212426;
            }

            .option {
                background: rgba(255,255,255,0.12);
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s;
                flex: 1;
                min-width: 80px;
                text-align: center;
            }

            .option:hover {
                background: rgba(100, 179, 244, 0.3);
            }

            .option.selected {
                background: #4CAF50;
                font-weight: bold;
            }

            .text-input-container {
                margin-top: 10px;
            }

            .text-input {
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.2);
                background: rgba(0,0,0,0.2);
                color: white;
                font-size: 0.9rem;
            }

            .text-hint {
                font-size: 0.8rem;
                opacity: 0.7;
                margin-top: 5px;
            }

            .multiline-row {
                background: rgba(0,0,0,0.1);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 10px;
            }

            .row-title {
                font-weight: bold;
                margin-bottom: 5px;
                color: #ddd;
                display: flex;
                align-items: center;
            }

            .row-badge {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 6px;
                background: #8e44ad;
                font-size: 0.7rem;
                margin-left: 8px;
            }

            .btn-container {
                display: flex;
                gap: 15px;
                margin-top: 20px;
                flex-wrap: wrap;
            }

            .btn {
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                flex: 1;
                min-width: 120px;
            }

            .btn-run {
                background: linear-gradient(to right, #00b09b, #96c93d);
                color: white;
            }

            .btn-save {
                background: linear-gradient(to right, #2193b0, #6dd5ed);
                color: white;
            }

            .btn-reset {
                background: linear-gradient(to right, #ff416c, #ff4b2b);
                color: white;
            }

            .btn-import {
                background: linear-gradient(to right, #8e44ad, #9b59b6);
                color: white;
            }

            .btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }

            .btn:active {
                transform: translateY(1px);
            }

            .floating-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #1e3c72, #2a5298);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                z-index: 9998;
                transition: all 0.3s;
            }

            .floating-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            }

            .notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(40, 40, 40, 0.95);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: bold;
                display: none;
            }

            .import-section {
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
            }

            .file-input-container {
                margin: 15px 0;
            }

            .file-input {
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.2);
                background: rgba(0,0,0,0.2);
                color: white;
                font-size: 0.9rem;
                margin-bottom: 10px;
            }

            .import-preview {
                max-height: 200px;
                overflow-y: auto;
                margin-top: 15px;
                background: rgba(0,0,0,0.1);
                border-radius: 8px;
                padding: 10px;
                display: none;
            }

            .preview-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
            }

            .preview-table th, .preview-table td {
                border: 1px solid rgba(255,255,255,0.1);
                padding: 5px;
                text-align: left;
            }

            .preview-table th {
                background-color: rgba(0,0,0,0.2);
            }
        `);

        // 创建悬浮按钮
        const floatBtn = document.createElement('div');
        floatBtn.className = 'floating-btn';
        floatBtn.innerHTML = '⚙️';
        floatBtn.title = '自动答题配置';
        document.body.appendChild(floatBtn);

        // 创建配置面板
        const panel = document.createElement('div');
        panel.className = 'auto-answer-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">
                    <span>🤖 答题配置</span>
                </div>
                <button class="close-btn">×</button>
            </div>
            <div class="panel-content">
                <div class="section">
                    <h3 class="section-title">📝 固定答案配置</h3>
                    <p style="margin-bottom:15px;opacity:0.8;">点击选项为题目设置固定答案（绿色为已设置）</p>

                    <div id="questionsContainer">
                        <!-- 题目将动态添加到这里 -->
                    </div>
                </div>

                <div class="section">
                    <h3 class="section-title">📊 Excel导入</h3>
                    <div class="import-section">
                        <p style="margin-bottom:10px;opacity:0.8;">导入Excel文件自动配置答案（格式：题型、题目、答案）</p>
                        <div class="file-input-container">
                            <input type="file" id="excelFileInput" accept=".xlsx,.xls" class="file-input">
                        </div>
                        <button class="btn btn-import" id="importExcelBtn">
                            <span>📊 导入Excel</span>
                        </button>
                        <div id="importPreview" class="import-preview">
                            <table class="preview-table">
                                <thead>
                                    <tr>
                                        <th>题型</th>
                                        <th>题目</th>
                                        <th>答案</th>
                                    </tr>
                                </thead>
                                <tbody id="previewTableBody"></tbody>
                            </table>
                        </div>
                </div>

                <div class="section">
                    <h3 class="section-title">⚡ 操作</h3>
                    <div class="btn-container">
                        <button class="btn btn-run" id="runBtn">
                            <span>▶️ 立即执行</span>
                        </button>
                        <button class="btn btn-save" id="saveBtn">
                            <span>💾 保存配置</span>
                        </button>
                        <button class="btn btn-reset" id="resetBtn">
                            <span>🔄 重置配置</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);

        // 显示通知
        function showNotification(message, isSuccess = true) {
            notification.innerHTML = isSuccess
                ? `<span>✅ ${message}</span>`
            : `<span>⚠️ ${message}</span>`;
            notification.style.display = 'flex';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }

        // Excel导入功能
        function setupExcelImport() {
            const fileInput = document.getElementById('excelFileInput');
            const importBtn = document.getElementById('importExcelBtn');
            const previewContainer = document.getElementById('importPreview');
            const previewTableBody = document.getElementById('previewTableBody');

            importBtn.addEventListener('click', handleExcelImport);

            function handleExcelImport() {
                if (!fileInput.files.length) {
                    showNotification('请先选择Excel文件', false);
                    return;
                }

                const file = fileInput.files[0];
                const reader = new FileReader();

                reader.onload = function(e) {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, {type: 'array'});

                        // 获取第一个工作表
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                        // 转换为JSON
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: ['type', 'question', 'answer']});

                        // 移除标题行
                        if (jsonData.length > 0 && jsonData[0].type === 'type' && jsonData[0].question === 'question' && jsonData[0].answer === 'answer') {
                            jsonData.shift();
                        }

                        // 显示预览
                        displayExcelPreview(jsonData);

                        // 处理Excel数据
                        processExcelData(jsonData);

                        showNotification('Excel导入成功！');
                    } catch (error) {
                        console.error('Excel导入错误:', error);
                        showNotification('Excel导入失败: ' + error.message, false);
                    }
                };

                reader.onerror = function() {
                    showNotification('文件读取失败', false);
                };

                reader.readAsArrayBuffer(file);
            }

            function displayExcelPreview(data) {
                previewTableBody.innerHTML = '';

                data.forEach(row => {
                    const tr = document.createElement('tr');

                    const typeTd = document.createElement('td');
                    typeTd.textContent = row.type || '';
                    tr.appendChild(typeTd);

                    const questionTd = document.createElement('td');
                    questionTd.textContent = row.question || '';
                    tr.appendChild(questionTd);

                    const answerTd = document.createElement('td');
                    answerTd.textContent = row.answer || '';
                    tr.appendChild(answerTd);

                    previewTableBody.appendChild(tr);
                });

                previewContainer.style.display = 'block';
            }

            // 文本清洗函数 - 移除标点符号和特殊字符，只保留文字和数字，并移除“答案+数字”模式
            function cleanText(text) {
                if (!text) return '';

                // 首先规范化文本（全角转半角）
                let normalized = text.normalize('NFKC');

                // 移除"答案"后跟一个或多个数字的模式
                normalized = normalized.replace(/答案\d+/g, '');

                // 移除所有括号（包括中文括号和英文括号）
                normalized = normalized.replace(/[()（）]/g, '');

                // 移除所有非文字数字字符，包括各种下划线
                return normalized.replace(/[^\w\u4e00-\u9fa5]|_/g, '');
            }

            function processExcelData(data) {
                const questions = document.querySelectorAll('div.field.ui-field-contain');
                let matchedQuestions = new Set();

                data.forEach(item => {
                    if (!item.type || !item.question || !item.answer) return;

                    const questionText = item.question.toString().trim();
                    const answer = item.answer.toString().trim();
                    const type = item.type.toString().trim();

                    // 查找匹配的题目
                    let matchedQuestion = null;

                    // 第一步：优先尝试精确匹配
                    for (const question of questions) {
                        if (matchedQuestions.has(question)) continue;

                        const questionElementText = question.querySelector('.topichtml')?.textContent || '';
                        const cleanQuestionText = cleanText(questionText);
                        const cleanElementText = cleanText(questionElementText);

                        if (cleanElementText === cleanQuestionText) {
                            console.log('精确匹配cleanQuestionText:', cleanQuestionText);
                            console.log('精确匹配cleanElementText:', cleanElementText);

                            matchedQuestion = question;
                            matchedQuestions.add(question);
                            break;
                        }
                    }

                    // 第二步：如果没有精确匹配，尝试模糊匹配
                    if (!matchedQuestion) {
                        for (const question of questions) {
                            if (matchedQuestions.has(question)) continue;

                            const questionElementText = question.querySelector('.topichtml')?.textContent || '';
                            const cleanQuestionText = cleanText(questionText);
                            const cleanElementText = cleanText(questionElementText);

                            if (cleanElementText.includes(cleanQuestionText) ||
                                cleanQuestionText.includes(cleanElementText)) {

                                console.log('模糊匹配cleanQuestionText:', cleanQuestionText);
                                console.log('模糊匹配cleanElementText:', cleanElementText);
                                console.log('模糊匹配questionElementText:', questionElementText);

                                matchedQuestion = question;
                                matchedQuestions.add(question);
                                break;
                            }
                        }
                    }

                    const cleanQuestionText = cleanText(questionText);
                    if (!matchedQuestion) {
                        console.log('未找到匹配的题目cleanQuestionText:', cleanQuestionText);
                        return;
                    }

                    const questionId = getQuestionId(matchedQuestion);
                    const questionType = matchedQuestion.getAttribute('type');

                    // 根据题型处理答案
                    if (type === '单选题' || type === '判断题') {
                        processRadioAnswer(matchedQuestion, answer, type);
                    } else if (type === '多选题') {
                        processCheckboxAnswer(matchedQuestion, answer);
                    } else if (type === '填空题' || type === '简答题') {
                        // 检查是否为多空填空题
                        const isMultiGapFill = isMultiGapFillQuestion(matchedQuestion);
                        if (isMultiGapFill) {
                            processMultiGapFillAnswer(matchedQuestion, answer);
                        } else {
                            processTextAnswer(matchedQuestion, answer);
                        }
                    }
                });

                // 找出并打印未匹配的页面题目
                questions.forEach(question => {
                    if (!matchedQuestions.has(question)) {
                        const questionElementText = question.querySelector('.topichtml')?.textContent || '';
                        const cleanElementText = cleanText(questionElementText);
                        console.log('未匹配的页面题目 cleanElementText:', cleanElementText);
                    }
                });

                // 重新渲染配置面板
                renderQuestions();
            }

            function processRadioAnswer(questionElement, answer, type) {
                const questionId = getQuestionId(questionElement);
                const options = questionElement.querySelectorAll('.ui-radio');

                let optionIndex = -1;

                if (type === '判断题') {
                    // 处理判断题答案
                    const normalizedAnswer = answer.toString().toUpperCase().trim();

                    if (normalizedAnswer.includes('正确') || normalizedAnswer.includes('对') || normalizedAnswer === 'A') {
                        optionIndex = 0; // 正确选项
                    } else if (normalizedAnswer.includes('错误') || normalizedAnswer.includes('错') || normalizedAnswer === 'B') {
                        optionIndex = 1; // 错误选项
                    } else {
                        // 默认处理：如果无法识别，默认选择第一个选项
                        console.warn(`无法识别的判断题答案: "${answer}", 默认选择第一个选项`);
                        optionIndex = 0;
                    }
                } else {
                    // 单选题
                    const optionMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5 };
                    optionIndex = optionMap[answer.toUpperCase()] !== undefined ? optionMap[answer.toUpperCase()] : 0;
                }

                if (optionIndex >= 0 && optionIndex < options.length) {
                    const option = options[optionIndex];
                    const inputElement = option.querySelector('input[type="radio"]');

                    if (inputElement) {
                        fixedAnswers[questionId] = inputElement.value;
                    }
                }
            }

            function processCheckboxAnswer(questionElement, answer) {
                const questionId = getQuestionId(questionElement);
                const options = questionElement.querySelectorAll('.ui-checkbox');

                fixedAnswers[questionId] = [];

                for (const char of answer.toUpperCase()) {
                    const optionMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5 };
                    const optionIndex = optionMap[char];

                    if (optionIndex !== undefined && optionIndex < options.length) {
                        const option = options[optionIndex];
                        const inputElement = option.querySelector('input[type="checkbox"]');

                        if (inputElement) {
                            fixedAnswers[questionId].push(inputElement.value);
                        }
                    }
                }
            }

            function processTextAnswer(questionElement, answer) {
                const questionId = getQuestionId(questionElement);
                // 直接使用Excel中的答案，不再随机选择
                fixedAnswers[questionId] = [answer];
            }

            function processMultiGapFillAnswer(questionElement, answer) {
                const questionId = getQuestionId(questionElement);

                // 使用'、'或'；'分隔答案
                const answers = answer.split(/[、；;]/).map(a => a.trim()).filter(a => a);

                fixedAnswers[questionId] = {};
                const gaps = questionElement.querySelectorAll('label.textEdit');

                // 按顺序填入各个空
                gaps.forEach((gap, index) => {
                    const hiddenInput = questionElement.querySelector(`input[name="q${questionId}_${index + 1}"]`);
                    const gapId = hiddenInput ? hiddenInput.id : `gap-${index + 1}`;

                    // 如果答案数量足够，使用对应位置的答案，否则使用空字符串
                    const gapAnswer = index < answers.length ? answers[index] : '';
                    fixedAnswers[questionId][gapId] = [gapAnswer];
                });
            }
        }

        // 按钮事件
        floatBtn.addEventListener('click', () => {
            panel.style.display = 'block';
            renderQuestions();
        });

        panel.querySelector('.close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        document.getElementById('runBtn').addEventListener('click', () => {
            autoAnswer();
            showNotification('答题已完成！');
            panel.style.display = 'none';
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            GM_setValue('fixedAnswers', fixedAnswers);
            showNotification('配置已保存！');
            // 保存后重新渲染题目以更新选中状态
            renderQuestions();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            fixedAnswers = {};
            GM_setValue('fixedAnswers', {});
            renderQuestions();
            showNotification('配置已重置');
        });

        // 注册菜单命令
        GM_registerMenuCommand("打开配置面板", () => {
            panel.style.display = 'block';
            renderQuestions();
        });

        GM_registerMenuCommand("执行自动答题", autoAnswer);

        GM_registerMenuCommand("重置所有配置", () => {
            fixedAnswers = {};
            GM_setValue('fixedAnswers', {});
            showNotification('配置已重置');
        });

        // 设置Excel导入功能
        setupExcelImport();

        // 渲染题目界面
        function renderQuestions() {
            const container = document.getElementById('questionsContainer');
            container.innerHTML = '';

            const questions = document.querySelectorAll('div.field.ui-field-contain');
            if (questions.length === 0) {
                container.innerHTML = '<p>未检测到题目，请确保在答题页面使用</p>';
                return;
            }

            questions.forEach(question => {
                const questionId = getQuestionId(question);
                const questionText = question.querySelector('.topichtml')?.textContent || `题目 ${questionId}`;
                const questionType = question.getAttribute('type');

                // 确定题目类型
                const isCheckbox = question.querySelector('.ui-checkbox') !== null;
                const isRadio = question.querySelector('.ui-radio') !== null;
                const isText = questionType === '1' || questionType === '7'; // 普通填空题
                const isGapFill = questionType === '9'; // 小空填空题
                const isMultiLineGapFill = isMultiLineGapFillQuestion(question); // 多行小空填空题
                const isMultiGapFill = isMultiGapFillQuestion(question); // 多空填空题（多个label.textEdit）

                // 跳过不需要配置的题型
                if (!isCheckbox && !isRadio && !isText && !isGapFill && !isMultiLineGapFill && !isMultiGapFill) return;

                let typeText = '';
                if (isCheckbox) {
                    typeText = '多选题';
                } else if (isRadio) {
                    typeText = '单选题';
                } else if (isText) {
                    typeText = '填空题';
                } else if (isGapFill) {
                    typeText = '小空填空题';
                } else if (isMultiLineGapFill) {
                    typeText = '多行小空填空';
                } else if (isMultiGapFill) {
                    typeText = '多空填空题';
                } else {
                    return;
                }

                const questionEl = document.createElement('div');
                questionEl.className = 'config-item';
                questionEl.innerHTML = `
            <div class="question-title">
                ${questionId}. ${questionText}
                <span class="question-badge ${
                isCheckbox ? 'badge-checkbox' :
                isRadio ? 'badge-radio' :
                isGapFill ? 'badge-text' :
                isMultiLineGapFill ? 'badge-multiline' :
                isMultiGapFill ? 'badge-multigap' : '',
                    isText ? 'badge-text' : ''
            }">
                    ${typeText}
                </span>
            </div>
            <div class="options-container" id="options-${questionId}"></div>
        `;
                container.appendChild(questionEl);

                const optionsContainer = document.getElementById(`options-${questionId}`);

                // 处理多空填空题（多个label.textEdit）
                if (isMultiGapFill) {
                    if (!fixedAnswers[questionId]) {
                        fixedAnswers[questionId] = {};
                    }
                    const gaps = question.querySelectorAll('label.textEdit');
                    gaps.forEach((gap, index) => {
                        const hiddenInput = question.querySelector(`input[name="q${questionId}_${index + 1}"]`);
                        const gapId = hiddenInput ? hiddenInput.id : `gap-${index + 1}`;
                        const gapTitle = `空${index + 1}`;

                        if (!fixedAnswers[questionId][gapId]) {
                            fixedAnswers[questionId][gapId] = [];
                        }

                        const gapEl = document.createElement('div');
                        gapEl.className = 'multiline-row';
                        gapEl.innerHTML = `
                    <div class="row-title">
                        ${gapTitle}
                        <span class="row-badge">填空</span>
                    </div>
                    <div class="text-input-container">
                        <input type="text" class="text-input"
                            value="${fixedAnswers[questionId][gapId].join('，') || ''}"
                            placeholder="多个答案用中文逗号分隔"
                            data-qid="${questionId}" data-gapid="${gapId}">
                        <div class="text-hint">多个答案用中文逗号分隔，答题时随机选择一个</div>
                    </div>
                `;
                        optionsContainer.appendChild(gapEl);

                        const textInput = gapEl.querySelector('.text-input');
                        textInput.addEventListener('input', function() {
                            const qid = this.dataset.qid;
                            const gapid = this.dataset.gapid;
                            const values = this.value.split('，').map(v => v.trim()).filter(v => v);
                            if (values.length > 0) {
                                if (!fixedAnswers[qid]) {
                                    fixedAnswers[qid] = {};
                                }
                                fixedAnswers[qid][gapid] = values;
                            } else {
                                if (fixedAnswers[qid] && fixedAnswers[qid][gapid]) {
                                    delete fixedAnswers[qid][gapid];
                                    if (Object.keys(fixedAnswers[qid]).length === 0) {
                                        delete fixedAnswers[qid];
                                    }
                                }
                            }
                        });
                    });
                    return;
                }

                // 处理多行小空填空题
                if (isMultiLineGapFill) {
                    if (!fixedAnswers[questionId]) {
                        fixedAnswers[questionId] = {};
                    }
                    const rows = question.querySelectorAll('tr[id^="drv"]:not([id$=""])');
                    rows.forEach(row => {
                        const rowTitle = row.querySelector('.itemTitleSpan')?.textContent || '未知行';
                        const input = row.querySelector('textarea, input[type="text"]');
                        if (!input) return;

                        const cid = input.getAttribute('cid');
                        const rowId = `row-${cid}`;

                        if (!fixedAnswers[questionId][cid]) {
                            fixedAnswers[questionId][cid] = [];
                        }

                        const rowEl = document.createElement('div');
                        rowEl.className = '';
                        rowEl.innerHTML = `
                    <div class="row-title">
                        ${rowTitle}
                        <span class="row-badge">填空行</span>
                    </div>
                    <div class="text-input-container">
                        <input type="text" class="text-input"
                            value="${fixedAnswers[questionId][cid].join('，') || ''}"
                            placeholder="多个答案用中文逗号分隔"
                            data-qid="${questionId}" data-cid="${cid}">
                        <div class="text-hint">多个答案用中文逗号分隔，答题时随机选择一个</div>
                    </div>
                `;
                        optionsContainer.appendChild(rowEl);

                        const textInput = rowEl.querySelector('.text-input');
                        textInput.addEventListener('input', function() {
                            const qid = this.dataset.qid;
                            const cid = this.dataset.cid;
                            const values = this.value.split('，').map(v => v.trim()).filter(v => v);
                            if (values.length > 0) {
                                if (!fixedAnswers[qid]) {
                                    fixedAnswers[qid] = {};
                                }
                                fixedAnswers[qid][cid] = values;
                            } else {
                                if (fixedAnswers[qid] && fixedAnswers[qid][cid]) {
                                    delete fixedAnswers[qid][cid];
                                    if (Object.keys(fixedAnswers[qid]).length === 0) {
                                        delete fixedAnswers[qid];
                                    }
                                }
                            }
                        });
                    });
                    return;
                }

                // 处理小空填空题
                if (isGapFill) {
                    if (!fixedAnswers[questionId]) {
                        fixedAnswers[questionId] = [];
                    }
                    const textEl = document.createElement('div');
                    textEl.className = 'text-input-container';
                    textEl.innerHTML = `
                <input type="text" class="text-input"
                    value="${fixedAnswers[questionId].join('，') || ''}"
                    placeholder="多个答案用中文逗号分隔"
                    data-qid="${questionId}">
                <div class="text-hint">多个答案用中文逗号分隔，答题时随机选择一个</div>
            `;
                    optionsContainer.appendChild(textEl);

                    const textInput = textEl.querySelector('.text-input');
                    textInput.addEventListener('input', function() {
                        const qid = this.dataset.qid;
                        const values = this.value.split('，').map(v => v.trim()).filter(v => v);
                        if (values.length > 0) {
                            fixedAnswers[qid] = values;
                        } else {
                            delete fixedAnswers[qid];
                        }
                    });
                    return;
                }

                // 处理填空题
                if (isText) {
                    const input = question.querySelector('input[type="text"], input[type="tel"], input[type="number"]');
                    if (!input) return;

                    if (!fixedAnswers[questionId]) {
                        fixedAnswers[questionId] = [];
                    }
                    const textEl = document.createElement('div');
                    textEl.className = 'text-input-container';
                    textEl.innerHTML = `
                <input type="text" class="text-input"
                    value="${fixedAnswers[questionId].join('，') || ''}"
                    placeholder="多个答案用中文逗号分隔"
                    data-qid="${questionId}">
                <div class="text-hint">多个答案用中文逗号分隔，答题时随机选择一个</div>
            `;
                    optionsContainer.appendChild(textEl);

                    const textInput = textEl.querySelector('.text-input');
                    textInput.addEventListener('input', function() {
                        const qid = this.dataset.qid;
                        const values = this.value.split('，').map(v => v.trim()).filter(v => v);
                        if (values.length > 0) {
                            fixedAnswers[qid] = values;
                        } else {
                            delete fixedAnswers[qid];
                        }
                    });
                    return;
                }

                // 获取选项（支持单选和多选）
                const optionContainers = isCheckbox ?
                      question.querySelectorAll('.ui-checkbox') :
                question.querySelectorAll('.ui-radio');

                console.log(`题目 ${questionId} (${isCheckbox ? '多选题' : '单选题'})：找到 ${optionContainers.length} 个选项`);

                if (optionContainers.length === 0) return;

                // 在渲染前确保多选题已选选项在2-3个之间（移除此限制）
                if (isCheckbox && fixedAnswers[questionId]) {
                    console.log(`题目 ${questionId} 当前 fixedAnswers：`, fixedAnswers[questionId]);
                }

                optionContainers.forEach((container, index) => {
                    const optionText = container.querySelector('.label')?.textContent || `选项 ${index + 1}`;
                    const inputElement = container.querySelector('input[type="checkbox"], input[type="radio"]');
                    if (!inputElement) {
                        console.log(`题目 ${questionId} 选项 ${index + 1} 未找到输入元素`);
                        return;
                    }

                    const value = inputElement.value || `${index + 1}`;
                    const optionEl = document.createElement('div');
                    optionEl.className = 'option';
                    optionEl.textContent = optionText;
                    optionEl.dataset.qid = questionId;
                    optionEl.dataset.value = value;
                    optionEl.dataset.type = isCheckbox ? 'checkbox' : 'radio';

                    const isSelected = isCheckbox ?
                          fixedAnswers[questionId] && fixedAnswers[questionId].includes(value) :
                    fixedAnswers[questionId] === value;

                    if (isSelected) {
                        optionEl.classList.add('selected');
                        console.log(`题目 ${questionId} 选项 ${optionText} 已选中`);
                    }

                    optionEl.addEventListener('click', () => {
                        if (!isCheckbox) {
                            document.querySelectorAll(`[data-qid="${questionId}"]`).forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            if (fixedAnswers[questionId] === value) {
                                delete fixedAnswers[questionId];
                            } else {
                                optionEl.classList.add('selected');
                                fixedAnswers[questionId] = value;
                                console.log(`题目 ${questionId} (单选) 选择选项：${value}`);
                            }
                        } else {
                            if (!fixedAnswers[questionId]) {
                                fixedAnswers[questionId] = [];
                            }
                            const currentSelected = fixedAnswers[questionId];
                            const isCurrentlySelected = currentSelected.includes(value);

                            if (isCurrentlySelected) {
                                optionEl.classList.remove('selected');
                                fixedAnswers[questionId] = currentSelected.filter(v => v !== value);
                                console.log(`题目 ${questionId} (多选) 取消选择选项：${value}`);
                                if (fixedAnswers[questionId].length === 0) {
                                    delete fixedAnswers[questionId];
                                }
                            } else {
                                optionEl.classList.add('selected');
                                fixedAnswers[questionId].push(value);
                                console.log(`题目 ${questionId} (多选) 选择选项：${value}`);
                            }
                        }
                    });

                    optionsContainer.appendChild(optionEl);
                });

                // 为多选题添加空白选项输入框
                if (isCheckbox) {
                    const blankOptionEl = document.createElement('div');
                    blankOptionEl.className = 'text-input-container';
                    blankOptionEl.innerHTML = `
                <input type="text" class="text-input"
                    value=""
                    placeholder="输入额外选项值（例如：选项 E）"
                    data-qid="${questionId}">
                <div class="text-hint">输入额外选项值，点击保存后生效</div>
            `;
                    optionsContainer.appendChild(blankOptionEl);

                    const textInput = blankOptionEl.querySelector('.text-input');
                    textInput.addEventListener('input', function() {
                        const qid = this.dataset.qid;
                        const value = this.value.trim();
                        if (!fixedAnswers[qid]) {
                            fixedAnswers[qid] = [];
                        }
                        if (value && !fixedAnswers[qid].includes(value)) {
                            fixedAnswers[qid].push(value);
                            console.log(`题目 ${questionId} (多选) 添加空白选项：${value}`);
                        }
                        // 重新渲染选项以显示新添加的选项
                        renderOptionsForQuestion(questionId, optionsContainer, question, isCheckbox);
                    });
                }
            });
        }
    }
    // 辅助函数：重新渲染某个问题的选项
    function renderOptionsForQuestion(questionId, optionsContainer, question, isCheckbox) {
        optionsContainer.innerHTML = '';
        const optionContainers = question.querySelectorAll('.ui-checkbox');
        console.log(`重新渲染题目 ${questionId} 的选项，找到 ${optionContainers.length} 个选项`);

        optionContainers.forEach((container, index) => {
            const optionText = container.querySelector('.label')?.textContent || `选项 ${index + 1}`;
            const inputElement = container.querySelector('input[type="checkbox"]');
            if (!inputElement) {
                console.log(`题目 ${questionId} 选项 ${index + 1} 未找到输入元素`);
                return;
            }

            const value = inputElement.value || `${index + 1}`;
            const optionEl = document.createElement('div');
            optionEl.className = 'option';
            optionEl.textContent = optionText;
            optionEl.dataset.qid = questionId;
            optionEl.dataset.value = value;
            optionEl.dataset.type = 'checkbox';

            const isSelected = fixedAnswers[questionId] && fixedAnswers[questionId].includes(value);
            if (isSelected) {
                optionEl.classList.add('selected');
                console.log(`题目 ${questionId} 选项 ${optionText} 已选中`);
            }

            optionEl.addEventListener('click', () => {
                if (!fixedAnswers[questionId]) {
                    fixedAnswers[questionId] = [];
                }
                const currentSelected = fixedAnswers[questionId];
                const isCurrentlySelected = currentSelected.includes(value);

                if (isCurrentlySelected) {
                    optionEl.classList.remove('selected');
                    fixedAnswers[questionId] = currentSelected.filter(v => v !== value);
                    console.log(`题目 ${questionId} (多选) 取消选择选项：${value}`);
                    if (fixedAnswers[questionId].length === 0) {
                        delete fixedAnswers[questionId];
                    }
                } else {
                    optionEl.classList.add('selected');
                    fixedAnswers[questionId].push(value);
                    console.log(`题目 ${questionId} (多选) 选择选项：${value}`);
                }
            });

            optionsContainer.appendChild(optionEl);
        });

        // 重新添加空白选项输入框
        const blankOptionEl = document.createElement('div');
        blankOptionEl.className = 'text-input-container';
        blankOptionEl.innerHTML = `
        <input type="text" class="text-input"
            value=""
            placeholder="输入额外选项值（例如：选项 E）"
            data-qid="${questionId}">
        <div class="text-hint">输入额外选项值，点击保存后生效</div>
    `;
        optionsContainer.appendChild(blankOptionEl);

        const textInput = blankOptionEl.querySelector('.text-input');
        textInput.addEventListener('input', function() {
            const qid = this.dataset.qid;
            const value = this.value.trim();
            if (!fixedAnswers[qid]) {
                fixedAnswers[qid] = [];
            }
            if (value && !fixedAnswers[qid].includes(value)) {
                fixedAnswers[qid].push(value);
                console.log(`题目 ${questionId} (多选) 添加空白选项：${value}`);
            }
            renderOptionsForQuestion(questionId, optionsContainer, question, isCheckbox);
        });
    }

    // 获取题目ID
    function getQuestionId(questionElement) {
        // 尝试从ID中提取数字
        const idMatch = questionElement.id.match(/\d+/);
        if (idMatch) return idMatch[0];

        // 尝试从题号极简版代码，不包含Excel导入功能中提取
        const topicNum = questionElement.querySelector('.topicnumber');
        if (topicNum) {
            const numMatch = topicNum.textContent.match(/\d+/);
            if (numMatch) return numMatch[0];
        }

        // 使用随机ID作为后备
        return 'q' + Math.random().toString(36).substr(2, 5);
    }

    // 判断是否为多行小空填空题
    function isMultiLineGapFillQuestion(questionElement) {
        const questionType = questionElement.getAttribute('type');
        if (questionType !== '9') return false;

        // 检查是否有多个填空行
        const rows = questionElement.querySelectorAll('tr[id^="drv"]:not([id$="t"])');
        return rows.length > 0;
    }

    // 判断是否为多空填空题（多个label.textEdit）
    function isMultiGapFillQuestion(questionElement) {
        const questionType = questionElement.getAttribute('type');
        if (questionType !== '9') return false;

        // 检查是否有多个label.textEdit元素
        const gaps = questionElement.querySelectorAll('label.textEdit');
        return gaps.length > 1;
    }

    // 处理填空题
    function handleTextQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);
        const input = questionElement.querySelector('input[type="text"], input[type="tel"], input[type="number"]');

        if (!input) return;

        console.log(`检测到填空题 ${questionId}`);

        // 检查是否有固定答案配置
        if (fixedAnswers[questionId] && fixedAnswers[questionId].length > 0) {
            // 直接使用第一个答案，不再随机选择
            const value = fixedAnswers[questionId][0];

            input.value = value;
            console.log(`填空题 ${questionId} 使用固定答案: ${value}`);
        } else {
            console.warn(`填空题 ${questionId} 没有配置固定答案，跳过填写`);
        }

        // 触发事件以确保UI更新
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    }

    // 处理小空填空题 (type="9")
    function handleGapFillQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);
        console.log(`检测到小空填空题 ${questionId}`);

        // 获取可编辑元素
        const editableSpan = questionElement.querySelector('.textCont[contenteditable="true"]');
        const hiddenInput = questionElement.querySelector('input[type="text"][style*="display:none"]');

        if (!editableSpan) {
            console.warn(`小空填空题 ${questionId} 未找到可编辑元素`);
            return;
        }

        // 检查是否有固定答案配置
        let value = '';
        if (fixedAnswers[questionId] && fixedAnswers[questionId].length > 0) {
            // 直接使用第一个答案，不再随机选择
            value = fixedAnswers[questionId][0];
            console.log(`小空填空题 ${questionId} 使用固定答案: ${value}`);
        } else {
            // 根据题目内容智能生成答案
            const questionText = questionElement.textContent || '';
            if (questionText.includes('year') || questionText.includes('Year') || questionText.includes('birth')) {
                // 年份类型：1995-2025之间的随机年份
                value = Math.floor(Math.random() * (2025 - 1995 + 1)) + 1995;
            } else {
                // 默认生成随机文本
                value = '答案' + Math.floor(Math.random() * 100);
            }
            console.log(`小空填空题 ${questionId} 生成随机答案: ${value}`);
        }

        // 填写答案
        editableSpan.textContent = value;

        // 触发事件
        const inputEvent = new Event('input', { bubbles: true });
        editableSpan.dispatchEvent(inputEvent);

        const changeEvent = new Event('change', { bubbles: true });
        editableSpan.dispatchEvent(changeEvent);

        // 更新关联的隐藏输入框
        if (hiddenInput) {
            hiddenInput.value = value;
        }
    }

    // 处理多空填空题（多个label.textEdit）
    function handleMultiGapFillQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);
        const gaps = questionElement.querySelectorAll('label.textEdit');

        if (gaps.length === 0) {
            console.warn(`多空填空题 ${questionId} 未找到填空`);
            return;
        }

        console.log(`检测到多空填空题 ${questionId}，共 ${gaps.length} 个空`);

        // 检查是否有固定答案配置
        const hasFixedAnswers = fixedAnswers[questionId] &&
              Object.keys(fixedAnswers[questionId]).length > 0;

        gaps.forEach((gap, index) => {
            const hiddenInput = questionElement.querySelector(`input[name="q${questionId}_${index + 1}"]`);
            const gapId = hiddenInput ? hiddenInput.id : `gap-${index + 1}`;

            let value = '';

            if (hasFixedAnswers && fixedAnswers[questionId][gapId]) {
                // 直接使用第一个答案，不再随机选择
                value = fixedAnswers[questionId][gapId][0];
                console.log(`多空填空题 ${questionId} 空 "${gapId}" 使用固定答案: ${value}`);
            }

            // 填写答案
            const span = gap.querySelector('.textCont');
            if (span) {
                span.textContent = value;

                // 触发事件
                const inputEvent = new Event('input', { bubbles: true });
                span.dispatchEvent(inputEvent);
            }

            // 更新关联的隐藏输入框
            if (hiddenInput) {
                hiddenInput.value = value;
            }
        });
    }

    // 处理多行小空填空题
    function handleMultiLineGapFillQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);
        const rows = questionElement.querySelectorAll('tr[id^="drv"]:not([id$="t"])');

        if (rows.length === 0) {
            console.warn(`多行小空填空题 ${questionId} 极简版代码，不包含Excel导入功能未找到填空行`);
            return;
        }

        console.log(`检测到多行小空填空题 ${questionId}，共 ${rows.length} 个填空行`);

        // 检查是否有固定答案配置
        const hasFixedAnswers = fixedAnswers[questionId] &&
              Object.keys(fixedAnswers[questionId]).length > 0;

        rows.forEach(row => {
            const input = row.querySelector('textarea, input[type="text"]');
            if (!input) return;

            const cid = input.getAttribute('cid');
            const rowTitle = row.querySelector('.itemTitleSpan')?.textContent || `行 ${cid}`;

            let value = '';

            if (hasFixedAnswers && fixedAnswers[questionId][cid]) {
                // 直接使用第一个答案，不再随机选择
                value = fixedAnswers[questionId][cid][0];
                console.log(`多行小空填空题 ${questionId} 行 "${rowTitle}" 使用固定答案: ${value}`);
            } else {
                // 根据行标题智能生成答案
                if (rowTitle.includes('日期') || rowTitle.includes('时间')) {
                    // 生成随机日期
                    const year = 2010 + Math.floor(Math.random() * 15);
                    const month = 1 + Math.floor(Math.random() * 12);
                    const day = 1 + Math.floor(Math.random() * 28);
                    value = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                } else if (rowTitle.includes('工号')) {
                    // 生成工号
                    value = `A${Math.floor(1000 + Math.random() * 9000)}`;
                } else {
                    // 默认生成随机文本
                    value = `${rowTitle}答案${Math.floor(Math.random() * 100)}`;
                }

                console.log(`多行小空填空题 ${questionId} 行 "${rowTitle}" 生成随机答案: ${value}`);
            }

            // 填写答案
            input.value = value;

            // 触发事件
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
        });
    }

    // 自动答题主函数
    function autoAnswer() {
        // 获取所有题目容器
        const questions = document.querySelectorAll('div.field.ui-field-contain');
        if (questions.length === 0) {
            console.log('未找到题目');
            return;
        }

        console.log(`找到 ${questions.length} 道题目`);

        // 遍历每道题目
        questions.forEach(question => {
            const questionId = getQuestionId(question);
            const questionType = question.getAttribute('type');

            // 判断是否为填空题
            const isText = questionType === '1';

            if (isText) {
                // 处理填空题
                handleTextQuestion(question);
                return;
            }

            // 判断是否为新型小空填空题 (type="9")
            const isGapFill = questionType === '9';
            const isMultiLineGapFill = isMultiLineGapFillQuestion(question);
            const isMultiGapFill = isMultiGapFillQuestion(question);

            if (isGapFill && isMultiGapFill) {
                // 处理多空填空题（多个label.textEdit）
                handleMultiGapFillQuestion(question);
                return;
            } else if (isGapFill && isMultiLineGapFill) {
                // 处理多行小空填空题
                handleMultiLineGapFillQuestion(question);
                return;
            } else if (isGapFill) {
                // 处理单行小空填空题
                handleGapFillQuestion(question);
                return;
            }

            // 确定题目类型（单选或多选）
            const isCheckbox = question.querySelector('.ui-checkbox') !== null;
            const questionTypeName = isCheckbox ? 'checkbox' : 'radio';

            // 获取所有选项
            const options = isCheckbox ?
                  question.querySelectorAll('a.jqcheck') :
            question.querySelectorAll('a.jqradio');

            if (options.length === 0) return;

            // 检查是否有固定答案配置
            if (fixedAnswers[questionId]) {
                // 单选题处理
                if (questionTypeName === 'radio') {
                    const fixedValue = fixedAnswers[questionId];
                    let found = false;

                    // 查找匹配的选项
                    options.forEach((option, index) => {
                        const parentElement = option.closest('.ui-radio');
                        const optionValue = parentElement.querySelector('input[type="radio"]').value;

                        if (optionValue === fixedValue) {
                            option.click();
                            console.log(`题目 ${questionId} (单选) 选择固定答案: ${fixedValue}`);
                            found = true;
                        }
                    });

                    if (!found) {
                        console.warn(`题目 ${questionId} (单选) 未找到选项值: ${fixedValue}，将随机选择`);
                        selectRandomOption(options, questionTypeName, questionId);
                    }
                }
                // 多选题处理
                else {
                    const fixedValues = fixedAnswers[questionId];
                    if (!Array.isArray(fixedValues)) {
                        console.error(`题目 ${questionId} (多选) 的多选配置格式错误，应为数组`);
                        return;
                    }

                    // 先取消所有选择
                    options.forEach(option => {
                        if (option.classList.contains('jqchecked')) {
                            option.click();
                        }
                    });

                    // 选择配置的选项
                    let selectedCount = 0;
                    options.forEach(option => {
                        const parentElement = option.closest('.ui-checkbox');
                        const optionValue = parentElement.querySelector('input[type="checkbox"]').value;

                        if (fixedValues.includes(optionValue)) {
                            option.click();
                            selectedCount++;
                            console.log(`题目 ${questionId} (极简版代码，不包含Excel导入功能多选) 选择选项: ${optionValue}`);
                        }
                    });

                    // 如果选择数量不足2个，补充随机选项
                    //     if (selectedCount < 2) {
                    //          console.warn(`题目 ${questionId} (多选) 固定答案不足2个，补充随机选项`);
                    //           selectRandomOption(options, questionTypeName, questionId, 2 - selectedCount);
                    //      }
                }
            } else {
                // 没有固定答案，随机选择
                selectRandomOption(options, questionTypeName, questionId);
            }
        });

        console.log('自动答题完成！');
    }

    // 随机选择选项
    function selectRandomOption(options, questionType, questionId, minCount = null) {
        if (options.length === 0) return;

        // 单选题：随机选择一个
        if (questionType === 'radio') {
            const randomIndex = Math.floor(Math.random() * options.length);
            const selectedOption = options[randomIndex];
            selectedOption.click();
            console.log(`题目 ${questionId} (单选) 随机选择第 ${randomIndex + 1} 个选项`);
        }
        // 多选题：随机选择至少2个
        else {
            // 确定要选择的选项数量（至少2个，最多选项总数）
            const min = minCount || 2;
            const max = options.length;
            const selectCount = Math.max(min, Math.min(max, Math.floor(Math.random() * (max - min + 1) + min)));

            // 创建索引数组并打乱顺序
            const indices = Array.from({length: options.length}, (_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }

            // 选择前selectCount个选项
            for (let i = 0; i < selectCount; i++) {
                const option = options[indices[i]];
                // 如果选项未被选中，则极简版代码，不包含Excel导入功能点击
                if (!option.classList.contains('jqchecked')) {
                    option.click();
                }
            }

            console.log(`题目 ${questionId} (多选) 随机选择 ${selectCount} 个选项`);
        }
    }

    // 滚动到页面底部的函数
    function scrollToBottom() {
        const scrollHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );

        window.scrollTo({
            top: scrollHeight,
            behavior: 'smooth'
        });
    }

    // 添加滚动到底部按钮
    function addScrollButton() {
        const button = document.createElement('button');
        button.textContent = '到底部';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        button.style.fontSize = '14px';

        button.addEventListener('click', scrollToBottom);

        document.body.appendChild(button);
    }

    // 创建配置面板
    createConfigPanel();
    addScrollButton();

    // 页面加载完成后执行自动答题
    if (document.readyState === 'complete') {
        autoAnswer();
    } else {
        window.addEventListener('load', autoAnswer);
    }

})();