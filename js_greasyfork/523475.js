// ==UserScript==
// @name         学习通作业复习助手
// @namespace    http://xuanyue1024.net/
// @version      0.8
// @description  为作业添加答题按钮
// @author       竹林听雨
// @match        file:///*.html
// @match        https://mooc1.chaoxing.com/mooc-ans/mooc2/work/view*
// @match        *://*/*.html
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523475/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E5%A4%8D%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523475/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E5%A4%8D%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // 主函数
    function addAnswerButtons() {
        // 添加清除记录按钮
        addClearButton();
        
        // 查找所有题目
        const questions = document.querySelectorAll('.questionLi');
        
        questions.forEach(question => {
            // 检查是否已经添加过按钮
            if (question.querySelector('.custom-answer-buttons')) {
                return;
            }

            // 获取题号并移除对应题号的active类
            const questionId = question.getAttribute('id');
            if (questionId) {
                // 恢复上次的作答记录
                restoreAnswer(question, questionId);
            }

            // 隐藏答案区域
            const answerArea = question.querySelector('.mark_answer');
            if (answerArea) {
                answerArea.style.setProperty('display', 'none', 'important');
            }

            // 创建按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'custom-answer-buttons';
            buttonContainer.style.cssText = 'margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;';

            // 添加展示答案按钮
            const showAnswerButton = document.createElement('button');
            showAnswerButton.textContent = '显示答案';
            showAnswerButton.style.cssText = 'margin: 0 5px; padding: 5px 15px; border: 1px solid #ddd; border-radius: 3px; cursor: pointer; background-color: #4CAF50; color: white;';
            showAnswerButton.addEventListener('click', () => toggleAnswer(question));

            // 添加标记按钮
            const markButton = document.createElement('button');
            markButton.textContent = '标记题目';
            markButton.style.cssText = 'margin: 0 5px; padding: 5px 15px; border: 1px solid #ddd; border-radius: 3px; cursor: pointer; background-color: #fff; color: #666;';
            markButton.addEventListener('click', () => toggleMarkQuestion(question, markButton));

            // 先添加显示答案按钮，再添加标记按钮
            buttonContainer.appendChild(showAnswerButton);
            buttonContainer.appendChild(markButton);

            // 获取题目类型
            const titleElement = question.querySelector('.colorShallow');
            if (titleElement) {
                const questionType = titleElement.textContent;
                
                // 为选项添加点击事件
                if (questionType.includes('单选题')) {
                    addSingleChoiceHandlers(question);
                } else if (questionType.includes('判断题')) {
                    addTrueFalseHandlers(question);
                }
            }

            // 在题目内容后插入按钮容器
            const content = question.querySelector('.aiAreaContent');
            if (content) {
                content.appendChild(buttonContainer);
            }

            // 恢复标记状态
            if (questionId) {
                const marks = JSON.parse(localStorage.getItem('questionMarks') || '{}');
                if (marks[questionId]) {
                    markButton.textContent = '取消标记';
                    markButton.style.backgroundColor = '#FFA500';
                    markButton.style.color = '#fff';
                    question.style.backgroundColor = '#FFF3E0';
                    
                    // 恢复题号标记图标
                    const questionNumber = questionId.replace('question', '');
                    const answerSheetItem = document.querySelector(`#answerSheet${questionNumber}`);
                    if (answerSheetItem && !answerSheetItem.querySelector('.mark-icon')) {
                        const markIcon = document.createElement('span');
                        markIcon.className = 'mark-icon';
                        markIcon.innerHTML = '★';
                        markIcon.style.color = '#FF4444';
                        answerSheetItem.appendChild(markIcon);
                    }
                }
            }
        });
    }

    // 为单选题添加点击处理
    function addSingleChoiceHandlers(question) {
        const options = question.querySelectorAll('.mark_letter li');
        options.forEach((option, index) => {
            option.style.cursor = 'pointer';
            option.addEventListener('click', () => selectAnswer(question, index, 'single'));
        });
    }

    // 为判断题添加点击处理
    function addTrueFalseHandlers(question) {
        const options = question.querySelectorAll('.mark_letter li');
        options.forEach((option, index) => {
            option.style.cursor = 'pointer';
            option.addEventListener('click', () => selectAnswer(question, index, 'judge'));
        });
    }

    // 切换显示/隐藏答案
    function toggleAnswer(question) {
        const answerContainer = question.querySelector('.mark_answer');
        if (!answerContainer) return;

        const isHidden = answerContainer.style.display === 'none' || getComputedStyle(answerContainer).display === 'none';
        answerContainer.style.setProperty('display', isHidden ? 'block' : 'none', 'important');

        // 更新按钮文本
        const showAnswerButton = question.querySelector('.custom-answer-buttons button:first-child');
        if (showAnswerButton) {
            showAnswerButton.textContent = isHidden ? '隐藏答案' : '显示答案';
            showAnswerButton.style.backgroundColor = isHidden ? '#f44336' : '#4CAF50';
        }
    }

    // 选择答案
    function selectAnswer(question, index, type) {
        // 获取答案区域的父元素
        const answerContainer = question.querySelector('.mark_answer');
        if (!answerContainer) return;

        // 获取所有选项
        const options = question.querySelectorAll('.mark_letter li');
        
        // 检查是否是重复点击同一个选项
        const isSelected = options[index].style.backgroundColor === 'rgb(240, 240, 240)';
        
        // 获取题目ID
        const questionId = question.getAttribute('id');
        const questionNumber = questionId.replace('question', '');
        const answerSheetItem = document.querySelector(`#answerSheet${questionNumber}`);

        // 如果是重复点击，则取消选择
        if (isSelected) {
            // 重置选项样式
            options[index].style.backgroundColor = '';
            options[index].style.color = '';
            
            // 隐藏答案区域
            answerContainer.style.setProperty('display', 'none', 'important');

            // 移除题号的active类并重置颜色
            if (answerSheetItem) {
                answerSheetItem.classList.remove('active');
                answerSheetItem.style.backgroundColor = '#fff';
                answerSheetItem.style.color = '#6BA9FF';
            }

            // 从localStorage中移除该题的记录
            if (questionId) {
                let answers = JSON.parse(localStorage.getItem('answersRecord') || '{}');
                delete answers[questionId];
                localStorage.setItem('answersRecord', JSON.stringify(answers));
            }

            return;
        }

        // 如果不是重复点击，执行正常的选择逻辑
        if (questionId) {
            saveAnswer(questionId, index, type);
        }

        // 隐藏"我的答案"部分
        const myAnswerSpan = answerContainer.querySelector('.colorDeep.marginRight40.fl');
        const myAnswerText = answerContainer.querySelector('.element-invisible-hidden.colorDeep');
        if (myAnswerSpan) {
            myAnswerSpan.style.display = 'none';
        }
        if (myAnswerText) {
            myAnswerText.style.display = 'none';
        }

        // 隐藏对错标记部分
        const markScore = answerContainer.querySelector('.mark_score');
        if (markScore) {
            markScore.style.display = 'none';
        }

        // 显示答案区域
        answerContainer.style.setProperty('display', 'block', 'important');
            
        // 高亮选中的选项
        options.forEach((option, i) => {
            if (i === index) {
                option.style.backgroundColor = '#f0f0f0';
                option.style.color = '#6C07A2';
            } else {
                option.style.backgroundColor = '';
                option.style.color = '';
            }
        });

        // 更新题号状态
        if (answerSheetItem) {
            answerSheetItem.classList.add('active');
            answerSheetItem.style.backgroundColor = '#BFDAFF';
            answerSheetItem.style.color = '#6BA9FF';
        }
    }

    // 添加清除记录按钮
    function addClearButton() {
        const container = document.querySelector('.fanyaMarking_left');
        if (!container || container.querySelector('.clear-answers-button')) return;

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'clear-buttons-container';
        buttonContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; display: flex; gap: 10px;';

        // 清除作答记录按钮
        const clearAnswersButton = document.createElement('button');
        clearAnswersButton.className = 'clear-answers-button';
        clearAnswersButton.textContent = '清除作答记录';
        clearAnswersButton.style.cssText = 'padding: 8px 16px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;';
        clearAnswersButton.addEventListener('click', clearAllAnswers);

        // 清除标记按钮
        const clearMarksButton = document.createElement('button');
        clearMarksButton.className = 'clear-marks-button';
        clearMarksButton.textContent = '清除所有标记';
        clearMarksButton.style.cssText = 'padding: 8px 16px; background-color: #FFA500; color: white; border: none; border-radius: 4px; cursor: pointer;';
        clearMarksButton.addEventListener('click', clearAllMarks);

        // 添加按钮到容器
        buttonContainer.appendChild(clearAnswersButton);
        buttonContainer.appendChild(clearMarksButton);
        container.appendChild(buttonContainer);
    }

    // 清除所有作答记录
    function clearAllAnswers() {
        if (confirm('确定要清除所有作答记录吗？')) {
            localStorage.removeItem('answersRecord');
            // 刷新页面
            window.location.reload();
        }
    }

    // 保存答案
    function saveAnswer(questionId, index, type) {
        let answers = JSON.parse(localStorage.getItem('answersRecord') || '{}');
        answers[questionId] = { index, type };
        localStorage.setItem('answersRecord', JSON.stringify(answers));
    }

    // 恢复答案
    function restoreAnswer(question, questionId) {
        const answers = JSON.parse(localStorage.getItem('answersRecord') || '{}');
        const savedAnswer = answers[questionId];
        
        if (savedAnswer) {
            // 恢复选择
            selectAnswer(question, savedAnswer.index, savedAnswer.type);
            
            // 恢复题号状态
            const questionNumber = questionId.replace('question', '');
            const answerSheetItem = document.querySelector(`#answerSheet${questionNumber}`);
            if (answerSheetItem) {
                answerSheetItem.classList.add('active');
                // 确保颜色正确
                answerSheetItem.style.backgroundColor = '#BFDAFF';
                answerSheetItem.style.color = '#6BA9FF';
            }
        } else {
            // 如果没有保存的答案，移除题号的active类并重置颜色
            const questionNumber = questionId.replace('question', '');
            const answerSheetItem = document.querySelector(`#answerSheet${questionNumber}`);
            if (answerSheetItem) {
                answerSheetItem.classList.remove('active');
                answerSheetItem.style.backgroundColor = '#fff';
                answerSheetItem.style.color = '#6BA9FF';
            }
        }
    }

    // 切换题目标记状态
    function toggleMarkQuestion(question, markButton) {
        const questionId = question.getAttribute('id');
        if (!questionId) return;

        let marks = JSON.parse(localStorage.getItem('questionMarks') || '{}');
        const isMarked = marks[questionId];

        // 获取题号元素
        const questionNumber = questionId.replace('question', '');
        const answerSheetItem = document.querySelector(`#answerSheet${questionNumber}`);

        if (isMarked) {
            // 取消标记
            delete marks[questionId];
            markButton.textContent = '标记题目';
            markButton.style.backgroundColor = '#fff';
            markButton.style.color = '#666';
            question.style.backgroundColor = '';
            if (answerSheetItem) {
                const markIcon = answerSheetItem.querySelector('.mark-icon');
                if (markIcon) {
                    markIcon.remove();
                }
            }
        } else {
            // 添加标记
            marks[questionId] = true;
            markButton.textContent = '取消标记';
            markButton.style.backgroundColor = '#FFA500';
            markButton.style.color = '#fff';
            question.style.backgroundColor = '#FFF3E0';
            if (answerSheetItem) {
                // 添加标记图标
                if (!answerSheetItem.querySelector('.mark-icon')) {
                    const markIcon = document.createElement('span');
                    markIcon.className = 'mark-icon';
                    markIcon.innerHTML = '★';
                    markIcon.style.color = '#FF4444';
                    answerSheetItem.appendChild(markIcon);
                }
            }
        }

        localStorage.setItem('questionMarks', JSON.stringify(marks));
    }

    // 清除所有标记
    function clearAllMarks() {
        if (confirm('确定要清除所有标记吗？')) {
            // 清除localStorage中的标记
            localStorage.removeItem('questionMarks');

            // 移除所有标记图标和样式
            document.querySelectorAll('.mark-icon').forEach(icon => icon.remove());
            document.querySelectorAll('.questionLi').forEach(question => {
                const markButton = question.querySelector('.custom-answer-buttons button:first-child');
                if (markButton) {
                    markButton.textContent = '标记题目';
                    markButton.style.backgroundColor = '#fff';
                    markButton.style.color = '#666';
                }
                question.style.backgroundColor = '';
            });
        }
    }

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        /* 通用样式 */
        .mark_letter li,
        .custom-answer-buttons button,
        .questionLi,
        .topicNumber_list li {
            transition: all 0.3s;
        }

        /* 按钮和选项样式 */
        .custom-answer-buttons button:hover,
        .clear-answers-button:hover {
            opacity: 0.9;
        }

        .mark_letter li {
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        }

        /* 隐藏元素 */
        .questionLi .mark_answer,
        .mark_answer .colorDeep.marginRight40.fl,
        .mark_answer .element-invisible-hidden.colorDeep {
            display: none !important;
        }

        /* 题号样式 */
        .topicNumber_list li {
            position: relative;
            background-color: #fff !important;
            color: #6BA9FF !important;
        }
        
        .topicNumber_list li.active {
            background-color: #BFDAFF !important;
        }

        /* 标记图标样式 */
        .mark-icon {
            position: static;
            display: inline;
            margin-left: 2px;
            font-size: inherit;
            color: #FF4444 !important;
        }

        /* 清除按钮样式 */
        .clear-answers-button:hover,
        .clear-marks-button:hover {
            opacity: 0.9;
        }

        .clear-answers-button:hover {
            background-color: #d32f2f !important;
        }

        .clear-marks-button:hover {
            background-color: #FF8C00 !important;
        }
    `;
    document.head.appendChild(style);

    // 页面加载完成后添加按钮
    waitForElement('.questionLi', () => {
        addAnswerButtons();
    });
})(); 