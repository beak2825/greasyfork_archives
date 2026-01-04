// ==UserScript==
// @name         酷学院自动答题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在酷学院考试页面添加自动答题功能
// @author       AI助手
// @match        https://pro.coolcollege.cn/*
// @icon         https://img.weimao.me/GIF-头像.GIF
// @grant        GM_xmlhttpRequest
// @connect      api.deepseek.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533091/%E9%85%B7%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/533091/%E9%85%B7%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 仅在考试页面执行
    if (!window.location.href.includes('/training/examination/new-exam/examing')) {
        return;
    }

    // 创建日志显示区域
    function createLogPanel() {
        const logPanel = document.createElement('div');
        logPanel.id = 'deepseek-log-panel';
        logPanel.style.cssText = `
            position: fixed;
            left: 10px;
            bottom: 10px;
            width: 300px;
            max-height: 300px;
            background-color: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            font-size: 12px;
            font-family: monospace;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            overflow-y: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        `;
        document.body.appendChild(logPanel);
        return logPanel;
    }

    // 添加日志
    function addLog(message, type = 'info') {
        const logPanel = document.getElementById('deepseek-log-panel') || createLogPanel();
        const logEntry = document.createElement('div');

        // 根据类型设置不同样式
        let color = '#00ff00'; // 默认绿色
        if (type === 'error') color = '#ff5555';
        if (type === 'request') color = '#55aaff';
        if (type === 'response') color = '#ffaa55';

        logEntry.style.cssText = `
            margin-bottom: 5px;
            color: ${color};
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding-bottom: 3px;
            word-break: break-word;
        `;

        // 添加时间戳
        const timestamp = new Date().toLocaleTimeString();
        logEntry.innerHTML = `<span style="color: #aaaaaa;">[${timestamp}]</span> ${message}`;

        logPanel.appendChild(logEntry);
        logPanel.scrollTop = logPanel.scrollHeight; // 自动滚动到底部
    }

    // 创建自动答题按钮
    function createAutoAnswerButton() {
        const button = document.createElement('div');
        button.id = 'auto-answer-btn';
        button.innerHTML = `
            <img src="https://img.weimao.me/GIF-头像.GIF" alt="自动答题" />
            <span>自动答题</span>
        `;
        button.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 5px;
            background: linear-gradient(135deg, #3a8ffe, #38bfff);
            color: white;
            font-size: 14px;
            font-weight: bold;
            padding: 5px 12px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            z-index: 9999;
            transition: all 0.2s ease;
        `;

        // 按钮内图标样式
        const img = button.querySelector('img');
        img.style.cssText = `
            width: 28px;
            height: 28px;
            border-radius: 50%;
            object-fit: cover;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.25)';
            button.style.transform = 'translateX(-50%) translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            button.style.transform = 'translateX(-50%)';
        });

        // 点击事件
        button.addEventListener('click', handleAutoAnswer);

        document.body.appendChild(button);
    }

    // 处理自动答题
    async function handleAutoAnswer() {
        const autoAnswerBtn = document.getElementById('auto-answer-btn');

        // 立即删除按钮，防止遮挡屏幕
        if (autoAnswerBtn) {
            autoAnswerBtn.remove();
        }

        // 添加日志信息
        addLog('开始自动答题过程', 'info');

        try {
            // 获取题目内容
            const questionList = document.querySelector('.list___3VUBg');
            if (!questionList) {
                addLog('未找到题目列表', 'error');
                throw new Error('未找到题目列表');
            }

            // 提取题目文本
            const questionText = extractQuestionText(questionList);
            addLog('已提取题目文本', 'info');

            // 调用DeepSeek API获取答案
            const answers = await getAnswersFromDeepSeek(questionText);

            // 自动选择答案
            selectAnswers(answers);

            addLog('答题完成', 'info');
        } catch (error) {
            console.error('自动答题失败:', error);
            addLog(`自动答题失败: ${error}`, 'error');
        }
    }

    // 提取题目文本，去除HTML标签
    function extractQuestionText(questionList) {
        // 创建一个克隆，以免修改原始DOM
        const clone = questionList.cloneNode(true);

        // 去除所有的脚本和样式元素
        const scripts = clone.querySelectorAll('script, style');
        scripts.forEach(script => script.remove());

        // 获取纯文本
        const text = clone.textContent.trim();
        addLog(`提取到的题目文本长度: ${text.length}字符`, 'info');
        return text;
    }

    // 调用DeepSeek API获取答案
    function getAnswersFromDeepSeek(questionText) {
        return new Promise((resolve, reject) => {
            const DEEPSEEK_API_KEY = 'sk-d4102372de644218bc71c6c59ddcdeb7';
            const prompt = `请认真分析以下考试题目，并为每一道题目提供正确答案。确保不遗漏任何题目。根据题目内容，基于主流、正确的价值观提供最准确的答案。注意：这些是考试题目，请确保分析每一道题目并给出选项字母（如A、B、C、D等）。

题目内容：${questionText}`;

            // 记录请求内容
            addLog('发送请求到DeepSeek API...', 'request');
            addLog(`系统提示: ${JSON.stringify({ role: 'system', content: '你是一个专业的考试助手，负责提供准确的答案。分析每道题目后，以清晰的格式列出所有题目的答案。确保按照"题号: 选项字母"的格式回复（例如"1: A"、"2: BC"等）。不要遗漏任何题目，即使不确定也要给出最可能的答案。不需要解释，只需要给出答案列表。' })}`, 'request');
            addLog(`用户提示: ${prompt.substring(0, 100)}...`, 'request');

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.deepseek.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                data: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: '你是一个专业的考试助手，负责提供准确的答案。分析每道题目后，以清晰的格式列出所有题目的答案。确保按照"题号: 选项字母"的格式回复（例如"1: A"、"2: BC"等）。不要遗漏任何题目，即使不确定也要给出最可能的答案。不需要解释，只需要给出答案列表。' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.1
                }),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const answerText = data.choices[0].message.content;

                            // 记录响应内容
                            addLog('收到DeepSeek API响应', 'response');
                            addLog(`状态码: ${response.status}`, 'response');
                            addLog(`完整响应: ${JSON.stringify(data).substring(0, 300)}...`, 'response');
                            addLog(`解析后的答案文本: ${answerText}`, 'response');

                            const answers = parseAnswers(answerText);
                            addLog(`解析出的答案数量: ${answers.length}`, 'response');
                            answers.forEach(answer => {
                                addLog(`题目${answer.questionNumber}: 选项 ${answer.options.join('')}`, 'response');
                            });

                            resolve(answers);
                        } catch (error) {
                            addLog(`解析API响应失败: ${error}`, 'error');
                            reject('解析API响应失败');
                        }
                    } else {
                        addLog(`API请求失败: ${response.status}`, 'error');
                        addLog(`错误详情: ${response.responseText}`, 'error');
                        reject(`API请求失败: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    addLog(`API请求错误: ${error}`, 'error');
                    reject(`API请求错误: ${error}`);
                }
            });
        });
    }

    // 解析DeepSeek返回的答案文本，提取出答案选项
    function parseAnswers(answerText) {
        const answers = [];
        // 增强正则表达式匹配更多可能的格式
        const regex = /(\d+)[\.、:：\s]+([A-Z]+)/g;
        let match;

        while ((match = regex.exec(answerText)) !== null) {
            answers.push({
                questionNumber: parseInt(match[1]),
                options: match[2].split('')  // 如果是多选题，会有多个字母
            });
        }

        // 如果没有找到答案，尝试其他可能的格式
        if (answers.length === 0) {
            const altRegex = /题\s*(\d+)\s*[：:]\s*([A-Z]+)/g;
            while ((match = altRegex.exec(answerText)) !== null) {
                answers.push({
                    questionNumber: parseInt(match[1]),
                    options: match[2].split('')
                });
            }
        }

        console.log('解析到的答案:', answers);
        return answers;
    }

    // 在页面上选择答案
    function selectAnswers(answers) {
        addLog(`开始选择答案，共${answers.length}道题`, 'info');

        answers.forEach(answer => {
            // 查找题目
            const questionDiv = findQuestionDiv(answer.questionNumber);
            if (!questionDiv) {
                addLog(`未找到题目 ${answer.questionNumber}`, 'error');
                return;
            }

            addLog(`找到题目 ${answer.questionNumber}`, 'info');

            // 选择正确答案
            answer.options.forEach(option => {
                const optionIndex = option.charCodeAt(0) - 65; // 'A'的ASCII码是65

                // 尝试多种选择器查找选项
                let optionElement = null;

                // 尝试方法1: 查找选项的label元素
                const optionLabels = questionDiv.querySelectorAll('.option___1SbNO label');
                if (optionLabels && optionLabels.length > optionIndex) {
                    optionElement = optionLabels[optionIndex];
                    addLog(`通过label找到选项 ${option}`, 'info');
                }

                // 如果找到了选项元素
                if (optionElement) {
                    addLog(`选择题目 ${answer.questionNumber} 的选项 ${option}`, 'info');

                    try {
                        // 直接点击label元素
                        addLog(`直接点击label`, 'info');
                        optionElement.click();

                        // 备用方案: 找到input并修改它的checked状态
                        setTimeout(() => {
                            try {
                                const inputElement = optionElement.querySelector('input[type="radio"]');
                                if (inputElement) {
                                    addLog(`找到了input元素，设置checked状态`, 'info');
                                    inputElement.checked = true;

                                    // 触发change事件
                                    try {
                                        const changeEvent = new Event('change', { bubbles: true });
                                        inputElement.dispatchEvent(changeEvent);
                                        addLog(`触发了change事件`, 'info');
                                    } catch (e) {
                                        addLog(`触发change事件失败: ${e}`, 'error');
                                    }
                                }
                            } catch (e) {
                                addLog(`设置checked状态失败: ${e}`, 'error');
                            }
                        }, 100);
                    } catch (e) {
                        addLog(`点击选项时出错: ${e}`, 'error');

                        // 最后尝试: 使用原生JavaScript来获取并触发点击
                        setTimeout(() => {
                            try {
                                // 找到对应索引的单选按钮并直接点击
                                const scripts = document.createElement('script');
                                scripts.textContent = `
                                    try {
                                        const questionDiv = document.getElementById('question${answer.questionNumber}');
                                        if (questionDiv) {
                                            const labels = questionDiv.querySelectorAll('.option___1SbNO label');
                                            if (labels && labels.length > ${optionIndex}) {
                                                labels[${optionIndex}].click();
                                                console.log('通过内联脚本点击了选项');
                                            }
                                        }
                                    } catch(e) {
                                        console.error('内联脚本执行失败:', e);
                                    }
                                `;
                                document.body.appendChild(scripts);
                                document.body.removeChild(scripts);
                                addLog(`尝试通过内联脚本点击`, 'info');
                            } catch (e) {
                                addLog(`内联脚本执行失败: ${e}`, 'error');
                            }
                        }, 200);
                    }
                } else {
                    addLog(`题目 ${answer.questionNumber} 没有找到选项 ${option}（索引 ${optionIndex}）`, 'error');
                }
            });
        });

        addLog('所有答案选择完成', 'info');
    }

    // 查找对应编号的题目div
    function findQuestionDiv(questionNumber) {
        // 直接使用问题ID查找
        const questionDiv = document.getElementById(`question${questionNumber}`);

        if (questionDiv) {
            return questionDiv;
        }

        // 如果通过ID找不到，则遍历所有题目div
        const allQuestionDivs = document.querySelectorAll('.question___2HZXG');
        addLog(`通过class查找，共找到${allQuestionDivs.length}个题目div`, 'info');

        for (let i = 0; i < allQuestionDivs.length; i++) {
            const titleElement = allQuestionDivs[i].querySelector('.question-title___2tpyJ');
            if (titleElement && titleElement.textContent.includes(`${questionNumber}.`)) {
                return allQuestionDivs[i];
            }
        }

        // 如果还是找不到，尝试通过题目顺序查找
        if (questionNumber > 0 && questionNumber <= allQuestionDivs.length) {
            addLog(`尝试通过索引查找题目${questionNumber}`, 'info');
            return allQuestionDivs[questionNumber - 1];
        }

        return null;
    }

    // 在页面加载完成后添加按钮和日志面板
    window.addEventListener('load', function() {
        createAutoAnswerButton();
        createLogPanel(); // 创建日志面板
    });

    // 也可以立即尝试添加按钮，以防页面已经加载完成
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(function() {
            createAutoAnswerButton();
            createLogPanel(); // 创建日志面板
        }, 1000);
    }
})();