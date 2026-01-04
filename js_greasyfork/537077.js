// ==UserScript==
// @name         岐黄天使刷课助手 - 题库模块
// @namespace    http://tampermonkey.net/qhtx-modules
// @version      1.4.3
// @description  岐黄天使刷课助手的题库管理模块。从 greasyfork.org/scripts/537085/questionBankDatasj.js 加载预定义题库数据，用于题目查找和显示。
// @author       AI助手
// ==/UserScript==

// 题库模块
(function() {
    'use strict';

    window.qh = window.qh || {}; // 确保 qh 对象存在
    window.qh.questionBankData = window.qh.questionBankData || []; // 初始化题库数据容器

    // 初始化题库数据
    function initializeQuestionBank() {
        console.log('[题库模块] 开始初始化题库数据');
        console.log('[题库模块] window.qhtxInitialQuestionBank 结构:', window.qhtxInitialQuestionBank);

        if (window.qhtxInitialQuestionBank && typeof window.qhtxInitialQuestionBank === 'object') {
            let questionsArray = [];

            if (Array.isArray(window.qhtxInitialQuestionBank.questions)) {
                console.log('[题库模块] 检测到 window.qhtxInitialQuestionBank.questions 数组');

                // 检查是否是嵌套结构
                const firstItem = window.qhtxInitialQuestionBank.questions[0];
                if (firstItem && typeof firstItem === 'object' && Array.isArray(firstItem.questions)) {
                    console.log('[题库模块] 检测到嵌套的 questions 结构，正在展开...');
                    // 展开嵌套的 questions 数组
                    window.qhtxInitialQuestionBank.questions.forEach(group => {
                        if (group && Array.isArray(group.questions)) {
                            questionsArray = questionsArray.concat(group.questions);
                        }
                    });
                    console.log('[题库模块] 从嵌套结构中提取了', questionsArray.length, '道题目');
                } else {
                    // 直接的题目数组
                    console.log('[题库模块] 直接的题目数组结构');
                    questionsArray = window.qhtxInitialQuestionBank.questions;
                }
            } else if (Array.isArray(window.qhtxInitialQuestionBank)) {
                // 兼容直接提供数组的情况
                console.log('[题库模块] 从 window.qhtxInitialQuestionBank (array) 加载题库数据');
                questionsArray = window.qhtxInitialQuestionBank;
            }

            // 转换数据格式以匹配期望的结构
            window.qh.questionBankData = questionsArray.map((item, index) => {
                if (!item || typeof item !== 'object') {
                    console.warn('[题库模块] 跳过无效的题目项:', item);
                    return null;
                }

                // 转换数据格式
                const question = {
                    id: item.id || `q_${index}`,
                    question: item.title || item.question || '题目文本缺失',
                    answer: item.answer || '未知',
                    analysis: item.analysis || '',
                    type: item.type || '未知类型'
                };

                // 处理选项
                if (item.options) {
                    if (typeof item.options === 'object' && !Array.isArray(item.options)) {
                        // 对象格式的选项 {A: "选项1", B: "选项2"}
                        question.options = Object.values(item.options).filter(opt => opt && opt.trim());
                    } else if (Array.isArray(item.options)) {
                        // 数组格式的选项
                        question.options = item.options.filter(opt => opt && opt.trim());
                    } else {
                        question.options = [];
                    }
                } else {
                    question.options = [];
                }

                return question;
            }).filter(item => item !== null); // 过滤掉无效项

        } else {
            console.warn('[题库模块] 未找到预定义的题库数据 (window.qhtxInitialQuestionBank)。题库将为空。');
            window.qh.questionBankData = []; // 确保在没有数据时为空数组
        }

        console.log('[题库模块] 题库初始化完成，题目数量:', window.qh.questionBankData.length);
        if (window.qh.questionBankData.length > 0) {
            console.log('[题库模块] 第一道题目示例:', window.qh.questionBankData[0]);
        }
    }

    // 显示题目面板
    window.showQuestionPanel = function() {
        console.log('[题库模块] showQuestionPanel 函数开始执行');

        try {
            // 检查是否已存在题目面板
            let panel = document.getElementById('qh-question-panel');
            let overlay = document.getElementById('qh-question-overlay');

            if (panel && overlay) {
                console.log('[题库模块] 面板已存在，显示并刷新内容');
                panel.style.display = 'block';
                overlay.style.display = 'block';
                // 如果面板已存在，可能需要刷新内容
                initializeQuestionBank(); // 确保数据最新
                displayQuestions(window.qh.questionBankData);
                return;
            }
        } catch (e) {
            console.error('[题库模块] 检查现有面板时出错:', e);
        }

        // 创建遮罩层
        let overlay = document.createElement('div');
        overlay.className = 'qh-question-overlay';
        overlay.id = 'qh-question-overlay';
        document.body.appendChild(overlay);

        // 创建题目面板
        let panel = document.createElement('div');
        panel.className = 'qh-question-panel';
        panel.id = 'qh-question-panel';
        panel.innerHTML = `
            <div class="qh-question-title">
                题库查看器
                <span class="qh-question-close" id="qh-question-close">×</span>
            </div>
            <div class="qh-question-content" id="qh-question-content">
                <div style="text-align: center; padding: 20px;">正在加载题库...</div>
            </div>
            <div class="qh-question-status" id="qh-question-status">
                题库总数: 0 道
            </div>
            <div class="qh-question-btns">
                <button class="qh-question-btn" id="qh-copy-questions-btn">复制当前显示题目</button>
            </div>
        `;
        document.body.appendChild(panel);

        // 绑定关闭按钮事件
        document.getElementById('qh-question-close').addEventListener('click', function() {
            document.getElementById('qh-question-panel').style.display = 'none';
            document.getElementById('qh-question-overlay').style.display = 'none';
        });

        // 绑定复制题目按钮事件
        document.getElementById('qh-copy-questions-btn').addEventListener('click', function() {
            copyQuestionsToClipboard();
        });

        // 显示面板
        try {
            panel.style.display = 'block';
            overlay.style.display = 'block';
            console.log('[题库模块] 面板显示成功');

            // 初始化题库并显示
            console.log('[题库模块] 开始初始化题库并显示题目');
            initializeQuestionBank();
            displayQuestions(window.qh.questionBankData);
            console.log('[题库模块] ✅ showQuestionPanel 函数执行完成');
        } catch (e) {
            console.error('[题库模块] ❌ 显示面板或加载题目时出错:', e);
            // 显示错误信息给用户
            if (panel) {
                const contentElement = panel.querySelector('#qh-question-content');
                if (contentElement) {
                    contentElement.innerHTML = `
                        <div style="text-align: center; padding: 20px; color: #f44336;">
                            <h3>题库加载失败</h3>
                            <p>错误信息: ${e.message}</p>
                            <p>请检查控制台获取详细信息</p>
                        </div>
                    `;
                }
            }
        }
    };

    // 从元素中提取题目信息 (保留，可能被 autoAnswer.js 使用)
    function extractQuestionFromElement(element, iframe = null) {
        try {
            // 获取题目文本
            const questionTextElement = element.querySelector('.subject');
            if (!questionTextElement) return null;

            const questionText = questionTextElement.textContent.trim();
            if (!questionText) return null;

            // 生成唯一ID
            const questionId = generateQuestionId(questionText);

            // 获取选项
            const optionsElements = element.querySelectorAll('.option');
            const options = Array.from(optionsElements).map(option => option.textContent.trim());

            // 获取答案
            let answer = '';
            const answerElement = element.querySelector('.answer');
            if (answerElement) {
                answer = answerElement.textContent.replace('答案:', '').trim();
            }

            // 获取解析
            let analysis = '';
            const analysisElement = element.querySelector('.analysis');
            if (analysisElement) {
                analysis = analysisElement.textContent.replace('解析:', '').trim();
            }

            return {
                id: questionId,
                question: questionText,
                options: options,
                answer: answer,
                analysis: analysis,
                isInIframe: !!iframe,
                iframe: iframe
            };
        } catch (e) {
            console.error('提取题目信息出错:', e);
            return null;
        }
    }

    // 生成题目ID (保留，可能被 autoAnswer.js 使用)
    function generateQuestionId(questionText) {
        // 安全检查：确保 questionText 是有效的字符串
        if (!questionText || typeof questionText !== 'string') {
            console.warn('[题库模块] generateQuestionId 收到无效的题目文本:', questionText);
            return 'q_invalid_' + Date.now(); // 返回一个基于时间戳的默认ID
        }

        // 使用题目文本的哈希值作为ID
        let hash = 0;
        for (let i = 0; i < questionText.length; i++) {
            const char = questionText.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return 'q_' + Math.abs(hash).toString(16);
    }

    // 获取题目列表 (供其他模块使用，如 autoAnswer.js)
    window.getQuestionList = function() {
        initializeQuestionBank(); // 确保题库已加载
        return window.qh.questionBankData;
    };

    // 显示题目
    function displayQuestions(questionsToDisplay) {
        const contentElement = document.getElementById('qh-question-content');
        const statusElement = document.getElementById('qh-question-status');

        if (!contentElement) return;

        if (!questionsToDisplay || questionsToDisplay.length === 0) {
            contentElement.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44336;">题库为空或加载失败。</div>';
            if (statusElement) {
                statusElement.textContent = '题库总数: 0 道';
            }
            return;
        }

        // 构建HTML
        let html = '';
        questionsToDisplay.forEach((question, index) => {
            // 安全检查：确保 question 对象有效
            if (!question || typeof question !== 'object') {
                console.warn('[题库模块] 发现无效的题目对象:', question);
                return; // 跳过这个无效的题目
            }

            // 安全获取题目ID
            let questionId;
            if (question.id) {
                questionId = question.id;
            } else if (question.question && typeof question.question === 'string') {
                questionId = generateQuestionId(question.question);
            } else {
                questionId = 'q_invalid_' + index + '_' + Date.now();
                console.warn('[题库模块] 题目缺少有效的问题文本:', question);
            }

            // 安全获取题目文本
            const questionText = question.question || '题目文本缺失';

            html += `
                <div class="qh-question-item" data-id="${questionId}">
                    <div class="qh-question-text">${index + 1}. ${questionText}</div>
                    <div class="qh-question-options">
                        ${(question.options && Array.isArray(question.options)) ? question.options.map((option, i) => `
                            <div class="qh-question-option">${String.fromCharCode(65 + i)}. ${option || '选项缺失'}</div>
                        `).join('') : '选项未提供'}
                    </div>
                    <div class="qh-question-answer">答案: ${question.answer || '未知'}</div>
                    ${question.analysis ? `<div class="qh-question-analysis">解析: ${question.analysis}</div>` : ''}
                </div>
            `;
        });

        contentElement.innerHTML = html;

        // 更新状态
        if (statusElement) {
            statusElement.textContent = `题库总数: ${questionsToDisplay.length} 道`;
        }
    }

    // 复制题目到剪贴板
    function copyQuestionsToClipboard() {
        try {
            const questionItems = document.querySelectorAll('#qh-question-panel .qh-question-item');
            if (questionItems.length === 0) {
                alert('面板中没有可复制的题目');
                return;
            }

            let text = '';
            questionItems.forEach((item, index) => {
                const questionTextElement = item.querySelector('.qh-question-text');
                const questionText = questionTextElement ? questionTextElement.textContent.replace(/^\d+\.\s*/, '') : '题目获取失败';

                const optionElements = item.querySelectorAll('.qh-question-option');
                const options = Array.from(optionElements).map(option => option.textContent.trim());

                const answerElement = item.querySelector('.qh-question-answer');
                const answerText = answerElement ? answerElement.textContent.replace('答案:', '').trim() : '未知';

                let analysisText = '';
                const analysisElement = item.querySelector('.qh-question-analysis');
                if (analysisElement) {
                    analysisText = analysisElement.textContent.replace('解析:', '').trim();
                }

                text += `${index + 1}. ${questionText}\n`;
                options.forEach(option => {
                    text += `   ${option}\n`;
                });
                text += `答案: ${answerText}\n`;
                if (analysisText) {
                    text += `解析: ${analysisText}\n`;
                }
                text += '\n';
            });

            GM_setClipboard(text);

            const statusElement = document.getElementById('qh-question-status');
            if (statusElement) {
                 statusElement.textContent = `已复制 ${questionItems.length} 道题目到剪贴板`;
            }
            alert(`已复制 ${questionItems.length} 道题目到剪贴板`);

        } catch (e) {
            console.error('[题库模块] 复制题目出错:', e);
            alert('复制题目出错: ' + e.message);
        }
    }

    // 导出函数供其他模块使用
    window.extractQuestionFromElement = extractQuestionFromElement;
    window.generateQuestionId = generateQuestionId;
    window.copyQuestionsToClipboard = copyQuestionsToClipboard;
    window.getQuestionList = getQuestionList; // 添加缺失的导出

    // 初始化时加载题库 (确保 qhtxInitialQuestionBank 已通过 @require 加载)
    initializeQuestionBank();

    console.log('[题库模块] 模块已加载并初始化。');
})();
