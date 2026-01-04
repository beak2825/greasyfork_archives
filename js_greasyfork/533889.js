// ==UserScript==
// @name         问卷星自动答题脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动采集问卷星题目并设置答案，支持固定答案和问题高亮
// @license MIT
// @author       ruby
// @match        https://www.wjx.cn/vm/*
// @match        https://www.wjx.cn/wjx/join/complete.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533889/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/533889/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 问题类型枚举
    const QuestionType = {
        RADIO: 'radio',           // 单选题
        CHECKBOX: 'checkbox',     // 多选题
        SCALE: 'scale',          // 量表题
        TEXT: 'text',            // 文本题
    };

    // 存储所有题目信息的数组
    let questions = [];

    // 全局变量存储固定答案
    let fixedAnswers = {};

    // 当前选中的问题编号
    let selectedQuestionNumber = null;

    // CSS样式
    const css = `
        .wjx-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            width: 320px;
            max-height: 90vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: all 0.3s ease;
        }

        .wjx-panel-title {
            margin: 0 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }

        .wjx-btn-group {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
        }

        .wjx-btn {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            background-color: #4a6ee0;
            color: white;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .wjx-btn:hover {
            background-color: #3a5cc9;
        }

        .wjx-btn-secondary {
            background-color: #e6e6e6;
            color: #333;
        }

        .wjx-btn-secondary:hover {
            background-color: #d9d9d9;
        }

        .wjx-btn-danger {
            background-color: #e74c3c;
        }

        .wjx-btn-danger:hover {
            background-color: #c0392b;
        }

        .wjx-btn-success {
            background-color: #2ecc71;
        }

        .wjx-btn-success:hover {
            background-color: #27ae60;
        }

        .wjx-fixed-section {
            margin-bottom: 20px;
            padding: 12px;
            background-color: #f5f7fa;
            border-radius: 6px;
        }

        .wjx-fixed-title {
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: 600;
            color: #444;
        }

        .wjx-fixed-table {
            width: 100%;
            border-collapse: collapse;
        }

        .wjx-fixed-table th {
            padding: 6px;
            border-bottom: 1px solid #ddd;
            text-align: left;
            font-weight: 600;
            color: #555;
        }

        .wjx-fixed-table td {
            padding: 6px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }

        .wjx-form {
            max-height: 500px;
            overflow-y: auto;
            margin-top: 15px;
            padding: 5px;
            border: 1px solid #eee;
            border-radius: 6px;
        }

        .wjx-question {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 6px;
            transition: all 0.2s ease;
        }

        .wjx-question:hover {
            background-color: #f0f0f0;
        }

        .wjx-question.selected {
            background-color: #e6f7ff;
            border-left: 4px solid #1890ff;
        }

        .wjx-question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .wjx-question-title {
            font-weight: 500;
            color: #333;
        }

        .wjx-question-fixed {
            background-color: #2ecc71;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 3px 8px;
            font-size: 12px;
            cursor: pointer;
        }

        .wjx-question-fixed:not(.active) {
            background-color: #3498db;
        }

        .wjx-question-fixed:hover {
            opacity: 0.9;
        }

        .wjx-option {
            display: block;
            margin-bottom: 5px;
            padding: 4px;
            border-radius: 4px;
        }

        .wjx-option:hover {
            background-color: #f0f0f0;
        }

        .wjx-option.selected {
            background-color: #e3f2fd;
            border: 1px solid #bbdefb;
        }

        .wjx-scale-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }

        .wjx-textarea {
            width: 100%;
            height: 60px;
            margin-top: 8px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: inherit;
            resize: vertical;
        }

        .wjx-textarea:focus {
            border-color: #4a6ee0;
            outline: none;
            box-shadow: 0 0 0 2px rgba(74, 110, 224, 0.2);
        }

        .wjx-message {
            padding: 10px;
            color: #856404;
            background-color: #fff3cd;
            border-radius: 4px;
            margin-bottom: 10px;
            text-align: center;
        }

        .wjx-empty {
            font-style: italic;
            color: #999;
            text-align: center;
            padding: 10px;
        }

        .wjx-badge {
            display: inline-block;
            min-width: 20px;
            height: 20px;
            padding: 0 6px;
            font-size: 12px;
            line-height: 20px;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            background-color: #777;
            border-radius: 10px;
            margin-right: 5px;
        }

        .wjx-badge-radio {
            background-color: #3498db;
        }

        .wjx-badge-checkbox {
            background-color: #9b59b6;
        }

        .wjx-badge-scale {
            background-color: #f39c12;
        }

        .wjx-badge-text {
            background-color: #1abc9c;
        }

        @keyframes highlight {
            0% { background-color: #fff; }
            50% { background-color: #e6f7ff; }
            100% { background-color: #fff; }
        }

        .highlight-question {
            animation: highlight 1.5s ease;
        }
    `;

    // 添加样式到页面
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    // 采集题目信息
    function collectQuestions() {
        // 获取所有题目元素
        const questionElements = document.querySelectorAll('.field');
        questions = []; // 清空之前的题目

        questionElements.forEach((element, index) => {
            const questionTitle = element.querySelector('.field-label')?.textContent.trim();
            const questionNumber = index + 1;
            const questionId = element.getAttribute('topic') || element.id.replace('div', '');
            let type = QuestionType.RADIO; // 默认为单选题

            // 确定题目类型
            if (element.querySelector('input[type="checkbox"]') || element.querySelectorAll('.ui-checkbox').length > 0) {
                type = QuestionType.CHECKBOX;
            } else if (element.querySelector('.scale-div') || element.querySelector('.scale-rating')) {
                type = QuestionType.SCALE;
            } else if (element.querySelector('textarea') || element.querySelector('input[type="text"]')) {
                type = QuestionType.TEXT;
            }

            // 获取选项
            let options = [];

            if (type === QuestionType.RADIO) {
                // 单选题选项
                const optionElements = element.querySelectorAll('.ui-radio');
                optionElements.forEach((opt, optIndex) => {
                    const input = opt.querySelector('input[type="radio"]');
                    const optionText = opt.querySelector('.label')?.textContent.trim();
                    const optionValue = input?.value || (optIndex + 1).toString();
                    options.push({
                        index: optIndex + 1,
                        value: optionValue,
                        text: optionText,
                        element: opt
                    });
                });
            } else if (type === QuestionType.CHECKBOX) {
                // 多选题选项
                const optionElements = element.querySelectorAll('.ui-checkbox');
                optionElements.forEach((opt, optIndex) => {
                    const input = opt.querySelector('input[type="checkbox"]');
                    const optionText = opt.querySelector('.label')?.textContent.trim();
                    const optionValue = input?.value || (optIndex + 1).toString();
                    options.push({
                        index: optIndex + 1,
                        value: optionValue,
                        text: optionText,
                        element: opt
                    });
                });
            } else if (type === QuestionType.SCALE) {
                // 量表题选项
                const optionElements = element.querySelectorAll('.scale-rating .onscore li');
                optionElements.forEach((opt, optIndex) => {
                    const anchor = opt.querySelector('a');
                    const optionValue = anchor?.getAttribute('val') || (optIndex + 1).toString();
                    const optionText = anchor?.getAttribute('title') || optionValue;
                    options.push({
                        index: optIndex + 1,
                        value: optionValue,
                        text: optionText,
                        element: anchor
                    });
                });
            }

            questions.push({
                number: questionNumber,
                id: questionId,
                title: questionTitle,
                type: type,
                options: options,
                element: element
            });
        });

        console.log('采集到的题目：', questions);
        return questions;
    }

    // 设置答案
    function setAnswer(questionNumber, answer) {
        const question = questions.find(q => q.number === questionNumber);
        if (!question) {
            console.error(`未找到题号 ${questionNumber} 的题目`);
            return false;
        }

        switch (question.type) {
            case QuestionType.RADIO:
                // 单选题设置答案
                const radioOption = question.options.find(opt => opt.value === answer);
                if (radioOption && radioOption.element) {
                    // 点击jqradio元素
                    const jqradio = radioOption.element.querySelector('.jqradio');
                    if (jqradio) {
                        jqradio.click();
                        return true;
                    }
                }
                break;

            case QuestionType.CHECKBOX:
                // 多选题设置答案（answer应该是数组）
                if (Array.isArray(answer)) {
                    // 先清除所有已选中的选项
                    question.options.forEach(option => {
                        const jqcheck = option.element.querySelector('.jqcheck');
                        if (jqcheck && option.element.querySelector('input[type="checkbox"]').checked) {
                            jqcheck.click();
                        }
                    });

                    // 然后设置新的选中项
                    answer.forEach(value => {
                        const checkboxOption = question.options.find(opt => opt.value === value);
                        if (checkboxOption && checkboxOption.element) {
                            const jqcheck = checkboxOption.element.querySelector('.jqcheck');
                            if (jqcheck) {
                                jqcheck.click();
                            }
                        }
                    });
                    return true;
                }
                break;

            case QuestionType.SCALE:
                // 量表题设置答案
                const scaleOption = question.options.find(opt => opt.value === answer);
                if (scaleOption && scaleOption.element) {
                    scaleOption.element.click();
                    return true;
                }
                break;

            case QuestionType.TEXT:
                // 文本题设置答案
                const textarea = question.element.querySelector('textarea');
                if (textarea) {
                    textarea.value = answer;
                    // 触发change事件
                    const event = new Event('change', { bubbles: true });
                    textarea.dispatchEvent(event);
                    return true;
                }

                // 处理input[type="text"]
                const textInput = question.element.querySelector('input[type="text"]');
                if (textInput) {
                    textInput.value = answer;
                    // 触发change和input事件
                    const changeEvent = new Event('change', { bubbles: true });
                    const inputEvent = new Event('input', { bubbles: true });
                    textInput.dispatchEvent(changeEvent);
                    textInput.dispatchEvent(inputEvent);

                    if (typeof setTip === 'function') {
                        // 如果存在setTip函数，也触发它
                        try {
                            setTip(textInput);
                        } catch (e) {
                            console.error('调用setTip函数失败:', e);
                        }
                    }

                    return true;
                }
                break;
        }

        console.error(`设置题号 ${questionNumber} 的答案失败`);
        return false;
    }

    // 批量设置答案
    function batchSetAnswers(answerMap) {
        let successCount = 0;

        // 按照题目顺序设置答案
        questions.forEach(question => {
            const answer = answerMap[question.number];
            if (answer !== undefined) {
                if (setAnswer(question.number, answer)) {
                    successCount++;
                }
            }
        });

        return successCount;
    }

    // 保存答案设置到本地存储
    function saveAnswerSettings(answerMap) {
        const surveyId = getSurveyId();
        if (surveyId) {
            localStorage.setItem(`wjxAnswers_${surveyId}`, JSON.stringify(answerMap));
            return true;
        }
        return false;
    }

    // 从本地存储加载答案设置
    function loadAnswerSettings() {
        const surveyId = getSurveyId();
        if (surveyId) {
            const savedData = localStorage.getItem(`wjxAnswers_${surveyId}`);
            if (savedData) {
                try {
                    return JSON.parse(savedData);
                } catch (e) {
                    console.error('加载已保存答案失败:', e);
                }
            }
        }
        return {};
    }

    // 保存固定答案
    function saveFixedAnswers() {
        const surveyId = getSurveyId();
        if (surveyId) {
            localStorage.setItem(`wjxFixedAnswers_${surveyId}`, JSON.stringify(fixedAnswers));
            return true;
        }
        return false;
    }

    // 加载固定答案
    function loadFixedAnswers() {
        const surveyId = getSurveyId();
        if (surveyId) {
            const savedData = localStorage.getItem(`wjxFixedAnswers_${surveyId}`);
            if (savedData) {
                try {
                    fixedAnswers = JSON.parse(savedData);
                    return fixedAnswers;
                } catch (e) {
                    console.error('加载固定答案失败:', e);
                }
            }
        }
        fixedAnswers = {};
        return fixedAnswers;
    }

    // 清除固定答案
    function clearFixedAnswers() {
        const surveyId = getSurveyId();
        if (surveyId) {
            localStorage.removeItem(`wjxFixedAnswers_${surveyId}`);
        }
        fixedAnswers = {};
    }

    // 设置固定答案
    function setFixedAnswer(questionNumber, answer) {
        // 确保多选题答案是数组格式
        if (Array.isArray(answer)) {
            // 深拷贝数组，避免引用问题
            fixedAnswers[questionNumber] = [...answer];
        } else {
            fixedAnswers[questionNumber] = answer;
        }
        console.log(`设置固定答案: 第${questionNumber}题, 答案:`, fixedAnswers[questionNumber]);
        saveFixedAnswers();
    }

    // 移除某题的固定答案
    function removeFixedAnswer(questionNumber) {
        delete fixedAnswers[questionNumber];
        saveFixedAnswers();
    }

    // 应用固定答案
    function applyFixedAnswers(answerMap) {
        // 将固定答案合并到随机答案中，固定答案优先级更高
        for (const [questionNumber, answer] of Object.entries(fixedAnswers)) {
            const qNum = parseInt(questionNumber);
            if (!isNaN(qNum)) {
                // 确保多选题答案是数组格式
                if (Array.isArray(answer)) {
                    answerMap[qNum] = [...answer]; // 深拷贝数组
                } else {
                    answerMap[qNum] = answer;
                }
                console.log(`应用固定答案: 第${qNum}题, 答案:`, answerMap[qNum]);
            }
        }
        return answerMap;
    }

    // 获取问卷ID
    function getSurveyId() {
        const match = location.href.match(/vm\/([A-Za-z0-9]+)/);
        return match ? match[1] : '';
    }

    // 创建答案设置界面
    function createAnswerSettingsUI(containerElement) {
        containerElement.innerHTML = ''; // 清空容器

        if (questions.length === 0) {
            const message = document.createElement('div');
            message.className = 'wjx-message';
            message.textContent = '请先点击"采集题目"按钮';
            containerElement.appendChild(message);
            return;
        }

        // 加载固定答案
        loadFixedAnswers();

        // 创建固定答案管理区域
        const fixedAnswerSection = document.createElement('div');
        fixedAnswerSection.className = 'wjx-fixed-section';

        const fixedTitle = document.createElement('h4');
        fixedTitle.className = 'wjx-fixed-title';
        fixedTitle.textContent = '固定答案设置';
        fixedAnswerSection.appendChild(fixedTitle);

        // 显示当前已设置的固定答案
        const fixedAnswerList = document.createElement('div');
        fixedAnswerList.id = 'fixedAnswerList';

        if (Object.keys(fixedAnswers).length === 0) {
            const noFixed = document.createElement('p');
            noFixed.className = 'wjx-empty';
            noFixed.textContent = '当前没有设置固定答案';
            fixedAnswerList.appendChild(noFixed);
        } else {
            const fixedTable = document.createElement('table');
            fixedTable.className = 'wjx-fixed-table';

            // 表头
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            ['题号', '设置值', '操作'].forEach(text => {
                const th = document.createElement('th');
                th.textContent = text;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            fixedTable.appendChild(thead);

            // 表体
            const tbody = document.createElement('tbody');
            Object.entries(fixedAnswers).forEach(([qNum, answer]) => {
                const question = questions.find(q => q.number === parseInt(qNum));
                if (!question) return;

                const row = document.createElement('tr');
                row.dataset.questionNumber = qNum;

                // 点击行高亮对应的问题
                row.style.cursor = 'pointer';
                row.addEventListener('click', (e) => {
                    // 如果点击的是删除按钮，则不触发高亮
                    if (e.target.tagName === 'BUTTON') return;

                    selectQuestion(parseInt(qNum));
                });

                // 题号列
                const numCell = document.createElement('td');
                numCell.textContent = qNum;
                row.appendChild(numCell);

                // 设置值列
                const valueCell = document.createElement('td');

                // 根据题目类型显示不同的答案格式
                switch (question.type) {
                    case QuestionType.RADIO:
                    case QuestionType.SCALE:
                        const option = question.options.find(opt => opt.value === answer);
                        valueCell.textContent = option ? option.text : answer;
                        break;

                    case QuestionType.CHECKBOX:
                        if (Array.isArray(answer)) {
                            const optionTexts = answer.map(val => {
                                const opt = question.options.find(o => o.value === val);
                                return opt ? opt.text : val;
                            });
                            valueCell.textContent = optionTexts.join(', ');
                        } else {
                            valueCell.textContent = answer;
                        }
                        break;

                    case QuestionType.TEXT:
                        valueCell.textContent = answer;
                        break;
                }

                row.appendChild(valueCell);

                // 操作列
                const actionsCell = document.createElement('td');

                const removeBtn = document.createElement('button');
                removeBtn.textContent = '删除';
                removeBtn.className = 'wjx-btn wjx-btn-danger';
                removeBtn.style.padding = '2px 5px';
                removeBtn.style.fontSize = '12px';

                removeBtn.onclick = () => {
                    removeFixedAnswer(qNum);
                    createAnswerSettingsUI(containerElement); // 刷新UI
                };

                actionsCell.appendChild(removeBtn);
                row.appendChild(actionsCell);

                tbody.appendChild(row);
            });

            fixedTable.appendChild(tbody);
            fixedAnswerList.appendChild(fixedTable);
        }

        fixedAnswerSection.appendChild(fixedAnswerList);

        // 清除所有固定答案按钮
        if (Object.keys(fixedAnswers).length > 0) {
            const clearAllBtn = document.createElement('button');
            clearAllBtn.textContent = '清除所有固定答案';
            clearAllBtn.className = 'wjx-btn wjx-btn-danger';
            clearAllBtn.style.marginTop = '10px';

            clearAllBtn.onclick = () => {
                if (confirm('确定要清除所有固定答案吗？')) {
                    clearFixedAnswers();
                    createAnswerSettingsUI(containerElement); // 刷新UI
                }
            };

            fixedAnswerSection.appendChild(clearAllBtn);
        }

        containerElement.appendChild(fixedAnswerSection);

        // 创建答案设置表单
        const form = document.createElement('form');
        form.className = 'wjx-form';

        // 获取最新的答案设置
        const savedAnswers = loadAnswerSettings();

        // 为每个问题创建设置界面
        questions.forEach(question => {
            const questionSection = document.createElement('div');
            questionSection.className = 'wjx-question';
            questionSection.dataset.questionNumber = question.number;

            // 如果是当前选中的问题，添加选中样式
            if (selectedQuestionNumber === question.number) {
                questionSection.classList.add('selected');
            }

            // 点击问题区域时选中该问题
            questionSection.addEventListener('click', () => {
                selectQuestion(question.number);
            });

            // 问题标题行
            const titleRow = document.createElement('div');
            titleRow.className = 'wjx-question-header';

            // 问题类型徽章和标题
            const titleElement = document.createElement('div');
            titleElement.className = 'wjx-question-title';

            // 添加题目类型徽章
            const badge = document.createElement('span');
            badge.className = `wjx-badge wjx-badge-${question.type}`;

            switch(question.type) {
                case QuestionType.RADIO:
                    badge.textContent = '单选';
                    break;
                case QuestionType.CHECKBOX:
                    badge.textContent = '多选';
                    break;
                case QuestionType.SCALE:
                    badge.textContent = '量表';
                    break;
                case QuestionType.TEXT:
                    badge.textContent = '文本';
                    break;
            }

            titleElement.appendChild(badge);
            titleElement.appendChild(document.createTextNode(`${question.number}. ${question.title}`));
            titleRow.appendChild(titleElement);

            // 固定答案按钮
            const fixBtn = document.createElement('button');
            fixBtn.textContent = fixedAnswers[question.number] ? '已固定' : '固定答案';
            fixBtn.className = 'wjx-question-fixed';
            if (fixedAnswers[question.number]) {
                fixBtn.classList.add('active');
            }

            fixBtn.onclick = (e) => {
                e.preventDefault(); // 防止表单提交
                e.stopPropagation(); // 阻止事件冒泡，避免触发问题选择

                if (fixedAnswers[question.number]) {
                    // 如果已经有固定答案，则删除
                    removeFixedAnswer(question.number);
                    createAnswerSettingsUI(containerElement); // 刷新UI
                } else {
                    // 获取当前设置的答案
                    let currentAnswer;

                    switch (question.type) {
                        case QuestionType.RADIO:
                        case QuestionType.SCALE:
                            const radioInput = questionSection.querySelector(`input[type="radio"][name="q_${question.number}"]:checked`);
                            if (radioInput) {
                                currentAnswer = radioInput.value;
                            }
                            break;

                        case QuestionType.CHECKBOX:
                            const checkboxInputs = questionSection.querySelectorAll(`input[type="checkbox"][name="q_${question.number}"]:checked`);
                            if (checkboxInputs.length > 0) {
                                currentAnswer = Array.from(checkboxInputs).map(input => input.value);
                            }
                            break;

                        case QuestionType.TEXT:
                            const textarea = questionSection.querySelector(`textarea[name="q_${question.number}"]`);
                            if (textarea && textarea.value.trim()) {
                                currentAnswer = textarea.value.trim();
                            }
                            break;
                    }

                    if (currentAnswer) {
                        setFixedAnswer(question.number, currentAnswer);
                        createAnswerSettingsUI(containerElement); // 刷新UI
                    } else {
                        alert('请先设置答案再固定');
                    }
                }
            };

            titleRow.appendChild(fixBtn);
            questionSection.appendChild(titleRow);

            // 根据问题类型创建不同的输入控件
            let inputElement;
            // 优先使用固定答案，其次使用保存的答案
            const answerToUse = fixedAnswers[question.number] !== undefined ?
                                fixedAnswers[question.number] :
                                savedAnswers[question.number];

            switch (question.type) {
                case QuestionType.RADIO:
                    // 单选题
                    question.options.forEach(option => {
                        const radioLabel = document.createElement('label');
                        radioLabel.className = 'wjx-option';

                        // 检查是否选中
                        if (answerToUse === option.value) {
                            radioLabel.classList.add('selected');
                        }

                        const radioInput = document.createElement('input');
                        radioInput.type = 'radio';
                        radioInput.name = `q_${question.number}`;
                        radioInput.value = option.value;
                        radioInput.dataset.questionNumber = question.number;
                        radioInput.checked = answerToUse === option.value;

                        // 点击时阻止事件冒泡，避免触发问题选择
                        radioInput.addEventListener('click', (e) => {
                            e.stopPropagation();

                            // 更新选中状态高亮
                            questionSection.querySelectorAll('.wjx-option').forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            radioLabel.classList.add('selected');

                            // 实时更新答案
                            const currentAnswers = getAnswersFromUI();
                            saveAnswerSettings(currentAnswers);
                        });

                        radioLabel.appendChild(radioInput);
                        radioLabel.appendChild(document.createTextNode(' ' + option.text));
                        questionSection.appendChild(radioLabel);
                    });
                    break;

                case QuestionType.CHECKBOX:
                    // 多选题
                    question.options.forEach(option => {
                        const checkboxLabel = document.createElement('label');
                        checkboxLabel.className = 'wjx-option';

                        const checkboxInput = document.createElement('input');
                        checkboxInput.type = 'checkbox';
                        checkboxInput.name = `q_${question.number}`;
                        checkboxInput.value = option.value;
                        checkboxInput.dataset.questionNumber = question.number;

                        // 检查是否之前已选中
                        let isChecked = false;
                        if (answerToUse && Array.isArray(answerToUse)) {
                            isChecked = answerToUse.includes(option.value);
                            checkboxInput.checked = isChecked;

                            // 已选中选项添加高亮
                            if (isChecked) {
                                checkboxLabel.classList.add('selected');
                            }
                        }

                        // 点击时阻止事件冒泡，避免触发问题选择
                        checkboxInput.addEventListener('click', (e) => {
                            e.stopPropagation();

                            // 更新这个选项的高亮状态
                            if (checkboxInput.checked) {
                                checkboxLabel.classList.add('selected');
                            } else {
                                checkboxLabel.classList.remove('selected');
                            }

                            // 实时更新答案
                            const currentAnswers = getAnswersFromUI();
                            saveAnswerSettings(currentAnswers);
                        });

                        checkboxLabel.appendChild(checkboxInput);
                        checkboxLabel.appendChild(document.createTextNode(' ' + option.text));
                        questionSection.appendChild(checkboxLabel);
                    });
                    break;

                case QuestionType.SCALE:
                    // 量表题
                    const scaleContainer = document.createElement('div');
                    scaleContainer.className = 'wjx-scale-container';

                    question.options.forEach(option => {
                        const radioLabel = document.createElement('label');
                        radioLabel.className = 'wjx-option';
                        radioLabel.style.marginRight = '5px';

                        // 检查是否选中
                        if (answerToUse === option.value) {
                            radioLabel.classList.add('selected');
                        }

                        const radioInput = document.createElement('input');
                        radioInput.type = 'radio';
                        radioInput.name = `q_${question.number}`;
                        radioInput.value = option.value;
                        radioInput.dataset.questionNumber = question.number;
                        radioInput.checked = answerToUse === option.value;

                        // 点击时阻止事件冒泡，避免触发问题选择
                        radioInput.addEventListener('click', (e) => {
                            e.stopPropagation();

                            // 更新选中状态高亮
                            scaleContainer.querySelectorAll('.wjx-option').forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            radioLabel.classList.add('selected');

                            // 实时更新答案
                            const currentAnswers = getAnswersFromUI();
                            saveAnswerSettings(currentAnswers);
                        });

                        radioLabel.appendChild(radioInput);
                        radioLabel.appendChild(document.createTextNode(' ' + option.text));
                        scaleContainer.appendChild(radioLabel);
                    });

                    questionSection.appendChild(scaleContainer);
                    break;

                case QuestionType.TEXT:
                    // 文本题
                    const textarea = document.createElement('textarea');
                    textarea.className = 'wjx-textarea';
                    textarea.name = `q_${question.number}`;
                    textarea.dataset.questionNumber = question.number;
                    textarea.value = answerToUse || '';

                    // 点击时阻止事件冒泡，避免触发问题选择
                    textarea.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });

                    // 添加输入事件，实时更新答案
                    textarea.addEventListener('input', (e) => {
                        // 延迟更新，避免频繁保存
                        clearTimeout(textarea.saveTimeout);
                        textarea.saveTimeout = setTimeout(() => {
                            const currentAnswers = getAnswersFromUI();
                            saveAnswerSettings(currentAnswers);
                        }, 500);
                    });

                    questionSection.appendChild(textarea);
                    break;
            }

            form.appendChild(questionSection);
        });

        containerElement.appendChild(form);
    }

    // 选中问题并高亮显示
    function selectQuestion(questionNumber) {
        // 保存当前选中的问题编号
        selectedQuestionNumber = questionNumber;

        // 移除所有问题的选中状态
        document.querySelectorAll('.wjx-question').forEach(el => {
            el.classList.remove('selected');
        });

        // 为选中的问题添加选中样式
        const questionElement = document.querySelector(`.wjx-question[data-question-number="${questionNumber}"]`);
        if (questionElement) {
            questionElement.classList.add('selected');

            // 滚动到选中的问题
            questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // 高亮页面中的问题
        highlightQuestionInPage(questionNumber);
    }

    // 在页面中高亮显示选中的问题
    function highlightQuestionInPage(questionNumber) {
        const question = questions.find(q => q.number === questionNumber);
        if (question && question.element) {
            // 移除之前的高亮
            document.querySelectorAll('.highlight-question').forEach(el => {
                el.classList.remove('highlight-question');
            });

            // 添加高亮动画
            question.element.classList.add('highlight-question');

            // 滚动到页面中的问题位置
            question.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // 从设置界面获取答案
    function getAnswersFromUI() {
        const answerMap = {};

        // 处理单选题和量表题
        const radioInputs = document.querySelectorAll('input[type="radio"]:checked');
        radioInputs.forEach(input => {
            const qNum = parseInt(input.dataset.questionNumber);
            if (!isNaN(qNum)) {
                answerMap[qNum] = input.value;
            }
        });

        // 处理多选题
        const checkboxGroups = {};
        const checkboxInputs = document.querySelectorAll('input[type="checkbox"]:checked');
        checkboxInputs.forEach(input => {
            const qNum = parseInt(input.dataset.questionNumber);
            if (!isNaN(qNum)) {
                if (!checkboxGroups[qNum]) {
                    checkboxGroups[qNum] = [];
                }
                checkboxGroups[qNum].push(input.value);
            }
        });

        // 将多选题答案合并到答案映射
        Object.entries(checkboxGroups).forEach(([qNum, values]) => {
            answerMap[qNum] = values;
        });

        // 处理文本题
        const textareas = document.querySelectorAll('textarea[data-question-number]');
        textareas.forEach(textarea => {
            const qNum = parseInt(textarea.dataset.questionNumber);
            if (!isNaN(qNum) && textarea.value.trim()) {
                answerMap[qNum] = textarea.value.trim();
            }
        });

        return answerMap;
    }

    // 添加控制面板
    function addControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'wjx-panel';

        const title = document.createElement('h3');
        title.className = 'wjx-panel-title';
        title.textContent = '问卷自动答题控制面板';
        panel.appendChild(title);

        // 顶部按钮组
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'wjx-btn-group';

        // 采集题目按钮
        const collectButton = document.createElement('button');
        collectButton.className = 'wjx-btn';
        collectButton.textContent = '采集题目';
        collectButton.onclick = () => {
            collectQuestions();
            createAnswerSettingsUI(settingsContainer);
            alert(`成功采集 ${questions.length} 道题目！`);
        };
        buttonGroup.appendChild(collectButton);

        // 应用答案按钮
        const applyButton = document.createElement('button');
        applyButton.className = 'wjx-btn';
        applyButton.textContent = '应用答案';
        applyButton.onclick = () => {
            const answers = getAnswersFromUI();
            const count = batchSetAnswers(answers);
            saveAnswerSettings(answers);
            alert(`成功应用 ${count} 个答案！`);
        };
        buttonGroup.appendChild(applyButton);

        // 随机答案按钮
        const randomButton = document.createElement('button');
        randomButton.className = 'wjx-btn';
        randomButton.textContent = '随机答案';
        randomButton.onclick = () => {
            if (questions.length === 0) {
                alert('请先点击"采集题目"按钮！');
                return;
            }

            // 生成随机答案，并应用固定答案
            const randomAnswers = generateRandomAnswers();
            const finalAnswers = applyFixedAnswers(randomAnswers);

            const count = batchSetAnswers(finalAnswers);
            saveAnswerSettings(finalAnswers);
            createAnswerSettingsUI(settingsContainer); // 更新UI
            alert(`成功应用 ${count} 个答案！`);
        };
        buttonGroup.appendChild(randomButton);

        panel.appendChild(buttonGroup);

        // 添加刷新界面按钮
        const refreshButton = document.createElement('button');
        refreshButton.className = 'wjx-btn wjx-btn-secondary';
        refreshButton.textContent = '刷新控制面板';
        refreshButton.style.width = '100%';
        refreshButton.style.marginBottom = '10px';
        refreshButton.onclick = () => {
            createAnswerSettingsUI(settingsContainer);
        };
        panel.appendChild(refreshButton);

        // 折叠/展开按钮
        const toggleButton = document.createElement('button');
        toggleButton.className = 'wjx-btn wjx-btn-secondary';
        toggleButton.textContent = '折叠面板';
        toggleButton.style.width = '100%';
        toggleButton.onclick = () => {
            if (settingsContainer.style.display === 'none') {
                settingsContainer.style.display = 'block';
                toggleButton.textContent = '折叠面板';
                panel.style.width = '320px';
            } else {
                settingsContainer.style.display = 'none';
                toggleButton.textContent = '展开面板';
                panel.style.width = 'auto';
            }
        };
        panel.appendChild(toggleButton);

        // 答案设置容器
        const settingsContainer = document.createElement('div');
        panel.appendChild(settingsContainer);

        document.body.appendChild(panel);

        // 初始化答案设置界面
        window.setTimeout(() => {
            collectQuestions();
            createAnswerSettingsUI(settingsContainer);
        }, 1000);
    }

    // 生成随机答案
    function generateRandomAnswers() {
        const answerMap = {};

        questions.forEach(question => {
            switch (question.type) {
                case QuestionType.RADIO:
                    if (question.options.length > 0) {
                        // 随机选择一个选项
                        const randomOption = question.options[Math.floor(Math.random() * question.options.length)];
                        answerMap[question.number] = randomOption.value;
                    }
                    break;

                case QuestionType.CHECKBOX:
                    if (question.options.length > 0) {
                        // 修改为随机选择3-4个选项(或全部，如果选项少于3个)
                        const minSelect = Math.min(question.options.length, 3); // 至少3个
                        const maxSelect = Math.min(question.options.length, 4); // 最多4个
                        let selectCount;

                        if (minSelect === maxSelect) {
                            // 如果选项数量少于或等于3，选择所有选项
                            selectCount = minSelect;
                        } else {
                            // 随机选择3或4个选项
                            selectCount = Math.random() < 0.5 ? minSelect : maxSelect;
                        }

                        // 随机洗牌选项
                        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

                        // 选择前selectCount个
                        answerMap[question.number] = shuffledOptions.slice(0, selectCount).map(opt => opt.value);
                    }
                    break;

                case QuestionType.SCALE:
                    if (question.options.length > 0) {
                        // 对于量表题，选择3-5范围内的值（即第3、4、5个选项）
                        let targetValues = [];

                        // 确保量表选项总数至少有3个
                        if (question.options.length >= 3) {
                            // 获取第3、4、5个选项（如果量表只有3或4个选项，则取全部可用选项）
                            const startIdx = Math.min(2, question.options.length - 1); // 第3个选项对应索引2
                            const endIdx = Math.min(4, question.options.length - 1);   // 第5个选项对应索引4

                            for (let i = startIdx; i <= endIdx; i++) {
                                targetValues.push(question.options[i]);
                            }

                            // 从3-5之间随机选择一个
                            const randomOption = targetValues[Math.floor(Math.random() * targetValues.length)];
                            answerMap[question.number] = randomOption.value;
                        } else {
                            // 如果选项不足3个，随机选择一个
                            const randomOption = question.options[Math.floor(Math.random() * question.options.length)];
                            answerMap[question.number] = randomOption.value;
                        }
                    }
                    break;

                case QuestionType.TEXT:
                    // 修改为在所有文本题中填写"无"
                    answerMap[question.number] = "无";
                    break;
            }
        });

        return answerMap;
    }

    // 等待页面加载完成后初始化
    window.addEventListener('load', () => {
        // 添加样式
        addStyles();

        setTimeout(() => {
            addControlPanel();
        }, 1500); // 延迟添加控制面板，确保页面完全加载
    });

    // 将函数暴露到全局作用域，方便在控制台调用
    window.setAnswer = setAnswer;
    window.collectQuestions = collectQuestions;
    window.batchSetAnswers = batchSetAnswers;
    window.selectQuestion = selectQuestion;
})();