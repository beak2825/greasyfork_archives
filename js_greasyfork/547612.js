// ==UserScript==
// @name         单选/多选/量表题/滑块题/填空题/单行量表题/简答题/排序题自动答题脚本（5.1）
// @namespace    http://tampermonkey.net/
// @version      5.5.1
// @description  自动完成单选题、多选题、量表题、滑块题、填空题、单行量表题、简答题和排序题，支持随机答题和固定答案配置+一键下滑+自动翻页+修改多选的数量为3-4+去除自动翻页增加一键提交和一键下滑的美化
// @author       蜡笔小新不是新
// @match        *://*.wjx.cn/*/*
// @match        *://*.wjx.top/*/*
// @match        *://*.wjx.com/*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @icon         https://img.icons8.com/color/96/000000/robot.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547612/%E5%8D%95%E9%80%89%E5%A4%9A%E9%80%89%E9%87%8F%E8%A1%A8%E9%A2%98%E6%BB%91%E5%9D%97%E9%A2%98%E5%A1%AB%E7%A9%BA%E9%A2%98%E5%8D%95%E8%A1%8C%E9%87%8F%E8%A1%A8%E9%A2%98%E7%AE%80%E7%AD%94%E9%A2%98%E6%8E%92%E5%BA%8F%E9%A2%98%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%8851%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547612/%E5%8D%95%E9%80%89%E5%A4%9A%E9%80%89%E9%87%8F%E8%A1%A8%E9%A2%98%E6%BB%91%E5%9D%97%E9%A2%98%E5%A1%AB%E7%A9%BA%E9%A2%98%E5%8D%95%E8%A1%8C%E9%87%8F%E8%A1%A8%E9%A2%98%E7%AE%80%E7%AD%94%E9%A2%98%E6%8E%92%E5%BA%8F%E9%A2%98%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%8851%EF%BC%89.meta.js
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
                width: 380px;
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
            .badge-scale {
                background: #9b59b6;
            }
            .badge-multiline {
                background: #e67e22;
            }
            .badge-text {
                background: #34495e;
            }
            .badge-singlescale {
                background: #1abc9c;
            }
            .badge-essay {
                background: #d35400;
            }
            .badge-sort {
                background: #f39c12;
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

            .slider-row {
                margin-bottom: 15px;
                padding: 10px;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
            }

            .slider-title {
                font-size: 0.9rem;
                margin-bottom: 8px;
                color: #ddd;
            }

            .slider-container {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .slider-input {
                width: 60px;
                padding: 5px;
                border-radius: 4px;
                border: 1px solid rgba(255,255,255,0.2);
                background: rgba(0,0,0,0.2);
                color: white;
                text-align: center;
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

            .slider-value {
                min-width: 30px;
                text-align: center;
            }

            .btn-container {
                display: flex;
                gap: 15px;
                margin-top: 20px;
            }

            .btn {
                flex: 1;
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

            .row-title {
                font-weight: bold;
                margin-bottom: 8px;
                color: #ddd;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .row-badge {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 8px;
                font-size: 0.7rem;
                background: #e67e22;
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

            console.log("保存前的固定答案配置:", JSON.stringify(fixedAnswers));
            GM_setValue('fixedAnswers', fixedAnswers);
            console.log("保存后的固定答案配置:", JSON.stringify(GM_getValue('fixedAnswers')));

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
                const isScale = isMatrixScaleQuestion(question);
                const isText = questionType === '1';  // 普通填空题
                const isGapFill = questionType === '9';  // 小空填空题
                const isMultiLineGapFill = isMultiLineGapFillQuestion(question); // 多行小空填空题
                const isSingleScale = isSingleScaleQuestion(question);
                const isMatrixScale = isMatrixScaleQuestion(question);
                const isEssay = questionType === '2';  // 简答题
                const isSort = questionType === '11'; // 排序题

                // 跳过不需要配置的题型
                if (isScale || isSingleScale || isMatrixScale || isMultiLineGapFill || isSort) return;

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
                } else if (isEssay) {
                    typeText = '简答题';
                } else {
                    // 未知题型跳过
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
                isEssay ? 'badge-essay' : '',

                    isText ? 'badge-text' : ''
            }">
                            ${typeText}
                        </span>
                    </div>
                    <div class="options-container" id="options-${questionId}"></div>
                `;
                container.appendChild(questionEl);

                const optionsContainer = document.getElementById(`options-${questionId}`);

                // 处理多行小空填空（即滑块题）
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
                        rowEl.className = 'slider-row';
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

                // 处理简答题 (type="2")
                if (isEssay) {
                    // 确保有固定答案配置
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

                    // 添加输入事件
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

                // 处理小空填空题
                if (isGapFill) {
                    // 确保有固定答案配置
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

                    // 添加输入事件
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

                    // 确保有固定答案配置
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

                    // 添加输入事件
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

                if (optionContainers.length === 0) return;

                // 在渲染前确保多选题已选选项在2-3个之间
                //if (isCheckbox && fixedAnswers[questionId]) {
                //   if (fixedAnswers[questionId].length > 3) {
                //        fixedAnswers[questionId] = fixedAnswers[questionId].slice(0, 3);
                //    } else if (fixedAnswers[questionId].length < 2) {
                //         delete fixedAnswers[questionId];
                // }

                optionContainers.forEach((container, index) => {
                    const optionText = container.querySelector('.label')?.textContent || `选项 ${index + 1}`;
                    const inputElement = container.querySelector('input[type="checkbox"], input[type="radio"]');
                    if (!inputElement) return;

                    const value = inputElement.value || `${index + 1}`;
                    const optionEl = document.createElement('div');
                    optionEl.className = 'option';
                    optionEl.textContent = optionText;
                    optionEl.dataset.qid = questionId;
                    optionEl.dataset.value = value;
                    optionEl.dataset.type = isCheckbox ? 'checkbox' : 'radio';

                    // 检查该选项是否已被选中
                    const isSelected = isCheckbox ?
                          fixedAnswers[questionId] && fixedAnswers[questionId].includes(value) :
                    fixedAnswers[questionId] === value;

                    if (isSelected) {
                        optionEl.classList.add('selected');
                    }

                    optionEl.addEventListener('click', () => {
                        if (!isCheckbox) {
                            // 单选题处理
                            document.querySelectorAll(`[data-qid="${questionId}"]`).forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            if (fixedAnswers[questionId] === value) {
                                delete fixedAnswers[questionId];
                            } else {
                                optionEl.classList.add('selected');
                                fixedAnswers[questionId] = value;
                            }
                        } else {
                            // 多选题处理
                            if (!fixedAnswers[questionId]) {
                                fixedAnswers[questionId] = [];
                            }
                            const currentSelected = fixedAnswers[questionId];
                            const isCurrentlySelected = currentSelected.includes(value);

                            if (isCurrentlySelected) {
                                // 允许取消选择
                                optionEl.classList.remove('selected');

                                // 找到值的索引并从数组中移除
                                const index = currentSelected.indexOf(value);
                                if (index > -1) {
                                    currentSelected.splice(index, 1);
                                }

                                // 如果所有选项都取消选择，删除该问题的配置
                                if (currentSelected.length === 0) {
                                    delete fixedAnswers[questionId];
                                }
                            } else {
                                // 允许选择
                                optionEl.classList.add('selected');
                                currentSelected.push(value);
                            }

                            // 添加调试信息，帮助诊断问题
                            console.log(`题目 ${questionId} 当前选择:`, currentSelected);
                        }
                    });

                    optionsContainer.appendChild(optionEl);
                });
            });
        }
    }

    // 获取题目ID
    function getQuestionId(questionElement) {
        // 尝试从ID中提取数字
        const idMatch = questionElement.id.match(/\d+/);
        if (idMatch) return idMatch[0];

        // 尝试从题号中提取
        const topicNum = questionElement.querySelector('.topicnumber');
        if (topicNum) {
            const numMatch = topicNum.textContent.match(/\d+/);
            if (numMatch) return numMatch[0];
        }

        // 使用随机ID作为后备
        return 'q' + Math.random().toString(36).substr(2, 5);
    }

    // 判断是否为量表题
    function isMatrixScaleQuestion(questionElement) {
        // PC端量表题标识
        if (questionElement.querySelector('.scalerowtitletd') !== null) return true;

        // 手机端量表题标识
        if (questionElement.querySelector('.matrixtable') !== null) return true;

        // 通用标识
        if (questionElement.querySelector('.rate-off.rate-offlarge') !== null &&
            questionElement.querySelector('tr:has(a.rate-off.rate-offlarge)') !== null) {
            return true;
        }

        // 新型矩阵量表题（带matrix-rating类）
        if (questionElement.querySelector('.matrix-rating') !== null) return true;

        return false;
    }

    // 判断是否为单行量表题
    function isSingleScaleQuestion(questionElement) {
        // 通过type="5"判断
        if (questionElement.getAttribute('type') === '5') return true;

        // 通过特定类名判断
        if (questionElement.querySelector('ul.modlen5') !== null) return true;

        // 通过结构判断
        const scaleDiv = questionElement.querySelector('.scale-div');
        if (scaleDiv && scaleDiv.querySelector('ul > li > a.rate-off.rate-offlarge')) {
            return true;
        }

        return false;
    }

    // 判断是否为多行小空填空题（滑块题）
    function isMultiLineGapFillQuestion(questionElement) {
        const questionType = questionElement.getAttribute('type');
        if (questionType !== '9') return false;

        // 检查是否有多个填空行
        const rows = questionElement.querySelectorAll('tr[id^="drv"]:not([id$="t"])');
        return rows.length > 0;
    }

    // 生成随机简答题答案
    function generateRandomEssayAnswer() {
        const topics = [
            "外卖平台管理方面，存在配送时间不稳定、配送员服务态度差、餐品质量无法保证等问题。",
            "申诉机制不够透明，用户提交申诉后处理时间过长，且缺乏有效的沟通渠道。",
            "平台对商家的审核不够严格，导致部分无证经营商家上线，影响食品安全。",
            "退款流程复杂，用户申请退款时经常需要提供大量证明材料，体验不佳。",
            "配送费用设置不合理，不同时间段和距离的配送费计算标准不透明。",
            "用户评价系统存在缺陷，商家可以通过刷单提高评分，导致真实评价被掩盖。",
            "平台对用户隐私保护不足，订单信息泄露问题时有发生。",
            "优惠活动规则复杂，存在虚假宣传，用户实际享受优惠时受到诸多限制。",
            "客服响应速度慢，解决问题能力有限，无法有效处理用户投诉。",
            "平台对配送员的培训不足，导致服务标准不统一，用户体验参差不齐。",
            "订单状态更新不及时，用户无法准确了解餐品配送进度。",
            "平台对食品安全监管不到位，存在卫生问题和食品质量问题。"
        ];

        return topics[Math.floor(Math.random() * topics.length)];
    }

    // 处理排序题
    function handleSortQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);
        console.log(`处理排序题 ${questionId}`);

        // 获取所有选项
        const options = questionElement.querySelectorAll('li.ui-li-static');
        if (options.length === 0) {
            console.warn(`排序题 ${questionId} 未找到选项`);
            return;
        }

        // 随机选择3-5个选项
        const minSelect = Math.min(3, options.length);
        const maxSelect = Math.min(5, options.length);
        const selectCount = Math.floor(Math.random() * (maxSelect - minSelect + 1)) + minSelect;

        // 创建索引数组并打乱顺序
        const indices = Array.from({length: options.length}, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // 选择前selectCount个选项
        const selectedIndices = indices.slice(0, selectCount);

        // 按照随机顺序依次点击这些选项
        selectedIndices.forEach((index, i) => {
            setTimeout(() => {
                const option = options[index];
                console.log(`排序题 ${questionId} 点击第 ${index + 1} 个选项 (${i + 1}/${selectCount})`);
                option.click();
            }, i * 500); // 每个点击间隔500毫秒
        });

        console.log(`排序题 ${questionId} 随机选择了 ${selectCount} 个选项进行排序`);
    }

    // 处理量表题
    function handleMatrixScaleQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);

        // 手机端结构
        const mobileRows = questionElement.querySelectorAll('tr:has(a.rate-off.rate-offlarge)');
        if (mobileRows.length > 0) {
            mobileRows.forEach((row, rowIndex) => {
                const options = row.querySelectorAll('a.rate-off.rate-offlarge');
                if (options.length === 0) return;

                // 随机选择一个选项
                const randomIndex = Math.floor(Math.random() * options.length);
                options[randomIndex].click();
            });
            return;
        }

        // PC端结构
        const pcRows = questionElement.querySelectorAll('.scalerowtitletd');
        if (pcRows.length > 0) {
            pcRows.forEach((row, rowIndex)=> {
                const rowContainer = row.closest('tr');
                if (!rowContainer) return;

                const options = rowContainer.querySelectorAll('a[class*="rate-off"]');
                if (options.length === 0) return;

                // 随机选择一个选项
                const randomIndex = Math.floor(Math.random() * options.length);
                options[randomIndex].click();
            });
            return;
        }

        console.log(`未识别到量表题结构: ${questionId}`);
    }

    // 处理单行量表题
    function handleSingleScaleQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);
        const options = questionElement.querySelectorAll('a.rate-off.rate-offlarge');

        if (options.length === 0) {
            return;
        }

        // 随机选择一个选项
        const randomIndex = Math.floor(Math.random() * options.length);
        options[randomIndex].click();
    }

    // 处理简答题 (type="2")
    function handleEssayQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);
        const textarea = questionElement.querySelector('textarea');

        if (!textarea) {
            console.log(`简答题 ${questionId} 未找到文本域`);
            return;
        }

        console.log(`检测到简答题 ${questionId}`);

        // 检查是否有固定答案配置
        if (fixedAnswers[questionId] && fixedAnswers[questionId].length > 0) {
            // 从多个固定答案中随机选择一个
            const randomIndex = Math.floor(Math.random() * fixedAnswers[questionId].length);
            const selectedAnswer = fixedAnswers[questionId][randomIndex];

            // 如果答案是数组形式（来自旧版本配置），转换为字符串
            let value = selectedAnswer;
            if (Array.isArray(selectedAnswer)) {
                value = selectedAnswer.join('，');
            }

            textarea.value = value;
            console.log(`简答题 ${questionId} 使用固定答案: ${value.substring(0, 20)}...`);
        } else {
            // 生成随机答案
            const randomAnswer = generateRandomEssayAnswer();
            textarea.value = randomAnswer;
            console.log(`简答题 ${questionId} 生成随机答案: ${randomAnswer.substring(0, 20)}...`);
        }

        // 触发事件以确保UI更新
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
    }

    // 处理填空题
    function handleTextQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);
        const input = questionElement.querySelector('input[type="text"], input[type="tel"], input[type="number"]');

        if (!input) return;

        // 检查是否有固定答案配置
        if (fixedAnswers[questionId] && fixedAnswers[questionId].length > 0) {
            // 从多个固定答案中随机选择一个
            const randomIndex = Math.floor(Math.random() * fixedAnswers[questionId].length);
            const value = fixedAnswers[questionId][randomIndex];
            input.value = value;
        }

        // 触发事件以确保UI更新
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    }

    // 处理小空填空题 (type="9")
    function handleGapFillQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);

        // 获取可编辑元素
        const editableSpan = questionElement.querySelector('.textCont[contenteditable="true"]');
        const hiddenInput = questionElement.querySelector('input[type="text"][style*="display:none"]');

        if (!editableSpan) {
            return;
        }

        // 检查是否有固定答案配置
        let value = '';
        if (fixedAnswers[questionId] && fixedAnswers[questionId].length > 0) {
            // 从多个固定答案中随机选择一个
            const randomIndex = Math.floor(Math.random() * fixedAnswers[questionId].length);
            value = fixedAnswers[questionId][randomIndex];
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
        }

        // 填写答案
        editableSpan.textContent = value;

        // 触发事件
        const inputEvent = new Event('input', { bubbles: true });
        editableSpan.dispatchEvent(inputEvent);

        // 更新关联的隐藏输入框
        if (hiddenInput) {
            hiddenInput.value = value;
        }
    }

    // 处理多行小空填空题（即滑块）
    function handleMultiLineGapFillQuestion(questionElement) {
        const questionId = getQuestionId(questionElement);
        const rows = questionElement.querySelectorAll('tr[id^="drv"]:not([id$="t"])');

        if (rows.length === 0) {
            console.warn(`多行小空填空题 ${questionId} 未找到填空行`);
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
                // 从多个固定答案中随机选择一个
                const answers = fixedAnswers[questionId][cid];
                value = answers[Math.floor(Math.random() * answers.length)];
                console.log(`多行小空填空题 ${questionId} 行 "${rowTitle}" 使用固定答案: ${value}`);
            } else {
                // 生成1-5的随机数字
                value = Math.floor(Math.random() * 5) + 1;
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

            // 判断是否为排序题 (type="11")
            if (questionType === '11') {
                // 处理排序题
                handleSortQuestion(question);
                return;
            }

            // 判断是否为新型小空填空题 (type="9")
            const isGapFill = questionType === '9';
            const isMultiLineGapFill = isMultiLineGapFillQuestion(question);
            if (isGapFill && isMultiLineGapFill) {
                // 处理多行小空填空题（即滑块）
                handleMultiLineGapFillQuestion(question);
                return;
            } else if (isGapFill) {
                // 处理单行小空填空题
                handleGapFillQuestion(question);
                return;
            }

            // 判断是否为简答题 (type="2")
            if (questionType === '2') {
                handleEssayQuestion(question);
                return;
            }

            // 判断是否为量表题
            const isMatrixScale = isMatrixScaleQuestion(question);

            if (isMatrixScale) {
                // 处理量表题
                handleMatrixScaleQuestion(question);
                return;
            }

            // 判断是否为单行量表题
            const isSingleScale = isSingleScaleQuestion(question);

            if (isSingleScale) {
                // 处理单行量表题
                handleSingleScaleQuestion(question);
                return;
            }

            // 判断是否为填空题
            const isText = questionType === '1';

            if (isText) {
                // 处理填空题
                handleTextQuestion(question);
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
                            console.log(`题目 ${questionId} (多选) 选择选项: ${optionValue}`);
                        }
                    });

                    console.log(`题目 ${questionId} (多选) 选择了 ${selectedCount} 个固定选项`);

                    // 确保选择数量在3-4个之间

                }
            } else {
                // 没有固定答案，随机选择
                selectRandomOption(options, questionTypeName, questionId);
            }
        });

        console.log('自动答题完成！');
    }

    // 随机选择选项
    function selectRandomOption(options, questionType, questionId, minCount = null,maxCount=null) {
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
            const min = minCount || 3;
            const max = maxCount ||4;
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
                // 如果选项未被选中，则点击
                if (!option.classList.contains('jqchecked')) {
                    option.click();
                }
            }

            console.log(`题目 ${questionId} (多选) 随机选择 ${selectCount} 个选项`);
        }
    }

    // 创建配置面板
    createConfigPanel();
    createActionButtons();
    // 页面加载完成后执行自动答题
    if (document.readyState === 'complete') {
        autoAnswer();
    } else {
        window.addEventListener('load', autoAnswer);
    }
    // 配置对象 - 在这里修改下滑速度
    const config = {
        scrollDuration: 100 // 下滑动画持续时间（毫秒），值越小速度越快
    };

    // 创建功能按钮
    function createActionButtons() {
        // 创建主容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'actionButtonsContainer';
        buttonsContainer.style.position = 'fixed';
        buttonsContainer.style.bottom = '20px';
        buttonsContainer.style.right = '20px';
        buttonsContainer.style.zIndex = '9999';
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.flexDirection = 'column';
        buttonsContainer.style.gap = '10px';

        // 创建滚动到底部按钮
        const scrollButton = document.createElement('div');
        scrollButton.className = 'action-btn';
        scrollButton.innerHTML = '⇩';
        scrollButton.title = '滚动到底部';
        scrollButton.addEventListener('click', function() {
            scrollToBottom(config.scrollDuration);
        });

        // 创建提交按钮
        const submitButton = document.createElement('div');
        submitButton.className = 'action-btn';
        submitButton.innerHTML = '✓';
        submitButton.title = '一键提交';
        submitButton.addEventListener('click', autoSubmitForm);

        // 添加按钮到容器
        buttonsContainer.appendChild(scrollButton);
        buttonsContainer.appendChild(submitButton);

        // 添加到页面
        document.body.appendChild(buttonsContainer);

        // 应用样式
        applyButtonStyles();
    }

    // 应用样式
    function applyButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .action-btn {
                width: 50px;
                height: 50px;
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-size: 24px;
                font-weight: bold;
                transition: transform 0.3s, background-color 0.3s;
                user-select: none;
            }

            .action-btn:hover {
                transform: scale(1.1);
            }

            .action-btn:nth-child(1) {
                background-color: #2196F3;
            }

            .action-btn:nth-child(1):hover {
                background-color: #0b7dda;
            }

            .action-btn:nth-child(2) {
                background-color: #4CAF50;
            }

            .action-btn:nth-child(2):hover {
                background-color: #45a049;
            }
        `;
        document.head.appendChild(style);
    }

    // 滚动到页面底部的函数（支持自定义速度）
    function scrollToBottom(duration = 1000) {
        const start = window.pageYOffset;
        const scrollHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
        const distance = scrollHeight - start - window.innerHeight;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            window.scrollTo(0, start + distance * progress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // 自动提交表单函数
    function autoSubmitForm() {
        const originalSubmitBtn = document.getElementById('ctlNext');

        if (originalSubmitBtn) {
            originalSubmitBtn.click();
            console.log('已触发提交按钮点击事件');
        } else {
            console.log('未找到提交按钮，请检查元素ID是否为ctlNext');
            alert('未找到提交按钮！');
        }
    }

})();