// ==UserScript==
// @name         Huayiwang自动完成视频和考试
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动完成视频播放和考试答题
// @author       Your name
// @match        *://*/*
// @grant        none
// @license      UNLICENSED
// @copyright    2025, start light (All rights reserved)
// @antifeature  tracking
// @downloadURL https://update.greasyfork.org/scripts/536498/Huayiwang%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E8%A7%86%E9%A2%91%E5%92%8C%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/536498/Huayiwang%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E8%A7%86%E9%A2%91%E5%92%8C%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

// 版权声明: 本脚本仅供个人学习使用，严禁复制、修改、分发或用于商业用途
// 版权所有 © 2025 start light，保留所有权利

(function() {
    'use strict';

    // 视频快速完成脚本
    function autoCompleteVideo() {
        // 等待播放器加载完成
        function waitForPlayer() {
            if (typeof player !== 'undefined' && player && player.j2s_getDuration) {
                console.log('播放器已就绪，开始执行脚本');
                completeVideo();
            } else {
                console.log('等待播放器加载...');
                setTimeout(waitForPlayer, 1000);
            }
        }

        // 视频快速完成主函数
        function completeVideo() {
            try {
                // 获取视频总时长
                const duration = player.j2s_getDuration();
                console.log('视频总时长：', duration, '秒');
                
                // 设置一个接近结束的时间点（总时长减去5秒）
                const targetTime = duration - 5;
                console.log('尝试跳转到：', targetTime, '秒');
                
                // 模拟播放到最后
                console.log('正在模拟完成播放...');
                
                // 绕过正常的更新进度机制
                const originalUpdateProcess = window.updateCourseWareProcess;
                window.updateCourseWareProcess = function(status) {
                    console.log('拦截状态更新，状态码：', status);
                    // 始终报告正在播放
                    if (status === 1 || status === 3) {
                        originalUpdateProcess(2); // 发送播放完成状态
                    }
                };
                
                // 处理签到弹窗
                const originalInitialSign = window.initialSign;
                window.initialSign = function() {
                    console.log('拦截签到弹窗');
                    // 自动点击签到按钮
                    setTimeout(() => {
                        if (document.querySelector('.btn_sign')) {
                            document.querySelector('.btn_sign').click();
                        }
                    }, 500);
                };
                
                // 尝试直接调用播放结束函数
                setTimeout(() => {
                    try {
                        // 保存当前时间位置
                        localStorage.setItem(uid + cwrid + coaid, duration);
                        
                        // 设置视频到最后
                        if (player.j2s_seekVideo) {
                            player.j2s_seekVideo(targetTime);
                            console.log('已跳转到视频末尾');
                            
                            // 手动触发播放完成事件
                            setTimeout(() => {
                                console.log('触发播放完成事件');
                                if (window.s2j_onPlayOver) {
                                    window.s2j_onPlayOver();
                                }
                                
                                console.log('视频应该已完成，检查"进入考试"按钮状态');
                                if (document.querySelector("#jrks")) {
                                    document.querySelector("#jrks").removeAttribute("disabled");
                                    document.querySelector("#jrks").classList.remove("inputstyle2_2");
                                    document.querySelector("#jrks").classList.add("inputstyle2");
                                }
                            }, 5000);
                        }
                    } catch (e) {
                        console.error('跳转失败：', e);
                    }
                }, 2000);
                
            } catch (e) {
                console.error('执行脚本出错：', e);
            }
        }
        
        // 开始执行
        console.log('视频快速完成脚本已加载');
        waitForPlayer();
    }

    // 考试自动答题脚本
    async function autoCompleteExam(autoSubmit = false) {
        const KNOWLEDGE_BASE_KEY = 'examKnowledgeBase_v3_examAspx';
        const PENDING_FEEDBACK_KEY = 'examPendingFeedback_v3_examAspx';

        // 用户配置区域
        const DEEPSEEK_API_KEY = "sk-95f1b6a3ce324bf78c27a818f7817b82"; // 请替换为您的API密钥

        // 页面配置
        const AUTO_FEEDBACK_CONFIG = {
            RESULTS_PAGE_PATH_CONTAINS: "exam_result.aspx",
            STATUS_TEXT_SELECTOR: "div.state_tips p.tips_text",
            PASS_INDICATOR_TEXT: ["考试已通过", "恭喜您，考试通过"],
            FAIL_INDICATOR_TEXT: ["考试未通过"],
            QUESTION_ITEM_SELECTOR_ON_FAIL_RESULT: "ul.state_cour_ul li.state_cour_lis",
            QUESTION_TEXT_SELECTOR_ON_RESULT_ITEM: "p.state_lis_text:nth-of-type(1)",
            YOUR_ANSWER_TEXT_SELECTOR_ON_RESULT_ITEM: "p.state_lis_text:nth-of-type(2)",
            RETRY_BUTTON_SELECTOR: 'input.state_foot_btn.state_edu[value="重新考试"]'
        };

        function loadData(key) {
            const stored = localStorage.getItem(key);
            try {
                return stored ? JSON.parse(stored) : null;
            } catch (e) {
                console.error(`从localStorage解析 ${key} 时出错:`, e);
                return null;
            }
        }

        function saveData(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.error(`保存 ${key} 到localStorage时出错:`, e);
            }
        }

        function clearData(key) { 
            localStorage.removeItem(key); 
        }

        let knowledgeBase = loadData(KNOWLEDGE_BASE_KEY) || {};

        function createStatusDisplay() {
            let statusDiv = document.getElementById('autoExamStatusDiv');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.id = 'autoExamStatusDiv';
                statusDiv.style.position = 'fixed';
                statusDiv.style.top = '150px';
                statusDiv.style.left = '10px';
                statusDiv.style.padding = '10px';
                statusDiv.style.background = 'rgba(255, 255, 224, 0.9)';
                statusDiv.style.border = '1px solid #F0AD4E';
                statusDiv.style.borderRadius = '5px';
                statusDiv.style.zIndex = '10001';
                statusDiv.style.fontFamily = 'Arial, sans-serif';
                statusDiv.style.fontSize = '13px';
                statusDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                statusDiv.innerHTML = `
                    <h5 style="margin-top:0; margin-bottom:8px; border-bottom:1px solid #ddd; padding-bottom:5px;">自动化考试状态</h5>
                    <div id="overallStatus" style="font-weight:bold; margin-bottom:5px;">等待开始...</div>
                    <ul id="questionStatusList" style="list-style-type: none; padding-left: 0; margin-bottom:0; max-height: 250px; overflow-y: auto; font-size:12px;"></ul>
                    <button id="clearKnowledgeBaseBtn" style="font-size:10px; padding: 2px 5px; margin-top:5px;">清除全部记忆</button>
                `;
                
                document.body.appendChild(statusDiv);

                document.getElementById('clearKnowledgeBaseBtn').addEventListener('click', () => {
                    if (confirm("确定要清除此考试的所有已存答案、错误尝试和待反馈记录吗？")) {
                        clearData(KNOWLEDGE_BASE_KEY);
                        clearData(PENDING_FEEDBACK_KEY);
                        knowledgeBase = {};
                        updateOverallStatus("所有记忆已清除。请重新运行脚本以开始新的尝试。");
                    }
                });
            }
            return statusDiv;
        }

        function updateOverallStatus(message, isError = false) {
            createStatusDisplay();
            const overallStatusElem = document.getElementById('overallStatus');
            if (overallStatusElem) overallStatusElem.textContent = message;
            if(isError) console.error(`[总体状态] ${message}`); else console.log(`[总体状态] ${message}`);
        }

        function updateQuestionStatus(questionNumberOrId, message, isError = false, source = "") {
            createStatusDisplay();
            const list = document.getElementById('questionStatusList');
            if (!list) return;
            const statusId = `qStatus-${String(questionNumberOrId).replace(/\s+/g, '-')}`;
            let item = document.getElementById(statusId);
            if (!item) {
                item = document.createElement('li');
                item.id = statusId;
                item.style.padding = '2px 0';
                item.style.borderBottom = '1px dotted #eee';
                list.insertBefore(item, list.firstChild);
            }
            item.textContent = `${source ? '['+source+'] ' : ''}${message}`;
            item.style.color = isError ? 'red' : (source === 'KB' ? 'blue' : (source === 'AI' ? 'green' : (source === 'User' || source === 'AutoResult' ? 'purple' : 'inherit')));
            const consoleMsg = typeof questionNumberOrId === 'number' ? `[题目 ${questionNumberOrId} 状态]` : `[问题 ${questionNumberOrId} 状态]`;
            if(isError) console.error(`${consoleMsg} ${message}`); else console.log(`${consoleMsg} ${message}`);
        }

        function extractExamQuestions() {
            updateOverallStatus("正在从页面提取考题...");
            const examData = [];
            const questionTables = document.querySelectorAll('div.test table.tablestyle');

            if (!questionTables || questionTables.length === 0) {
                updateOverallStatus("警告: 未找到任何题目表格。", false);
                return [];
            }

            questionTables.forEach((table, index) => {
                const questionLabelElement = table.querySelector('label.q_name');
                if (!questionLabelElement) {
                    updateQuestionStatus(index + 1, `第 ${index + 1} 题: 未找到题目文本元素。`, true);
                    return;
                }
                let questionText = questionLabelElement.textContent.trim().replace(/^\d+、\s*/, '').trim();
                const questionId = questionLabelElement.getAttribute('data-qid');

                if (!questionId) {
                    updateQuestionStatus(index + 1, `第 ${index + 1} 题: 未找到题目ID。`, true);
                    return;
                }
                
                const questionData = {
                    qNumDisplay: index + 1,
                    questionText: questionText,
                    options: [],
                    questionIdFromInputName: questionId
                };

                const optionRows = table.querySelectorAll('tbody tr');
                optionRows.forEach(row => {
                    const radioInput = row.querySelector('input.qo_name[type="radio"]');
                    const labelElement = row.querySelector('label');
                    if (radioInput && labelElement) {
                        const optionValue = radioInput.value;
                        let optionFullText = labelElement.textContent.trim();
                        const optionMatch = optionFullText.match(/^([A-Z])、\s*(.*)$/);
                        
                        if (optionMatch) {
                            const optionLetter = optionMatch[1];
                            const optionTextContent = optionMatch[2].trim();
                            questionData.options.push({
                                value: optionLetter,
                                text: optionTextContent,
                                originalValue: optionValue
                            });
                        }
                    }
                });

                if (questionData.options.length > 0) {
                    examData.push(questionData);
                }
            });

            if (examData.length > 0) updateOverallStatus(`成功提取 ${examData.length} 道题目。`);
            return examData;
        }

        function fillExamAnswers(answersArray) {
            updateOverallStatus("正在将答案填入考卷...");
            if (!Array.isArray(answersArray) || answersArray.length === 0) {
                updateOverallStatus("错误: 答案数组无效或为空，无法填写。", true);
                return false;
            }

            let allSuccessfullyFilled = true;
            answersArray.forEach((ans, index) => {
                const qNum = ans.qNumDisplay || (index + 1);
                if (!ans.questionIdFromInputName || !ans.chosenAnswer) {
                    updateQuestionStatus(qNum, `第 ${qNum} 题的答案数据不完整，跳过填写。`, true, ans.source);
                    allSuccessfullyFilled = false;
                    return;
                }

                const radioGroupName = "radio_" + ans.questionIdFromInputName;
                const radios = document.getElementsByName(radioGroupName);
                let foundAndChecked = false;

                if (radios && radios.length > 0) {
                    for (let i = 0; i < radios.length; i++) {
                        const radioLabel = radios[i].parentElement;
                        if (radioLabel && radioLabel.tagName === 'LABEL') {
                            const labelText = radioLabel.textContent.trim();
                            if (labelText.toUpperCase().startsWith(ans.chosenAnswer.toUpperCase() + "、")) {
                                radios[i].checked = true;
                                updateQuestionStatus(qNum, `第 ${qNum} 题: 已选 ${ans.chosenAnswer}`, false, ans.source);
                                foundAndChecked = true;
                                break;
                            }
                        }
                    }
                    if (!foundAndChecked) {
                        updateQuestionStatus(qNum, `第 ${qNum} 题: 未找到选项 '${ans.chosenAnswer}'`, true, ans.source);
                        allSuccessfullyFilled = false;
                    }
                } else {
                    updateQuestionStatus(qNum, `第 ${qNum} 题: 未找到选项组`, true, ans.source);
                    allSuccessfullyFilled = false;
                }
            });

            if(allSuccessfullyFilled) updateOverallStatus("所有答案已尝试填入。");
            else updateOverallStatus("部分答案填写时遇到问题，请检查状态列表。", true);
            return allSuccessfullyFilled;
        }

        const SYSTEM_PROMPT_FOR_BATCH_ANSWERS = `你是一个专门解答单项选择题的助手。接下来会提供一个包含多个问题的列表，每个问题都有其选项 (A, B, C, D, E等)。
请仔细阅读每个问题和选项。
你的任务是为每个问题选择一个最正确的答案的字母。
请按照以下JSON格式返回所有答案，确保是一个包含对象的有效JSON数组。每个对象代表一道题的答案，包含'questionNumber' (与输入问题列表中的显示题号 qNumDisplay 一致) 和 'answerLetter' (大写字母 A, B, C, D, 或 E)。
例如，如果输入有3道题，你的输出应该是这样的格式：
[
  {"questionNumber": 1, "answerLetter": "A"},
  {"questionNumber": 2, "answerLetter": "C"},
  {"questionNumber": 3, "answerLetter": "B"}
]
确保只返回这个JSON数组，不要包含任何其他解释、介绍或总结性文字。如果对某道题不确定，请也尽力选择一个最可能的答案字母。`;

        async function getBatchAnswersFromDeepSeek(questionsForAI, apiKey) {
            if (!questionsForAI || questionsForAI.length === 0) {
                updateOverallStatus("没有需要从 DeepSeek 获取答案的题目。");
                return [];
            }

            updateOverallStatus(`正在为 ${questionsForAI.length} 道新题/待重试题构建请求...`);
            let userBatchPrompt = "请为以下所有问题提供答案，严格按照JSON数组格式返回，包含 'questionNumber' 和 'answerLetter'：\n\n";
            questionsForAI.forEach((qData) => {
                userBatchPrompt += `问题 ${qData.qNumDisplay}: ${qData.questionText}\n`;
                const qInfo = knowledgeBase[qData.questionText];
                const attemptedIncorrect = qInfo?.incorrectAttempts || [];
                if (attemptedIncorrect.length > 0) {
                    userBatchPrompt += `(注意: 对于此题，请避免选择以下已尝试过的错误答案: ${attemptedIncorrect.join(', ')})\n`;
                }
                qData.options.forEach(opt => {
                    userBatchPrompt += `${opt.value}: ${opt.text}\n`;
                });
                userBatchPrompt += "\n";
            });

            const messages = [
                { "role": "system", "content": SYSTEM_PROMPT_FOR_BATCH_ANSWERS },
                { "role": "user", "content": userBatchPrompt }
            ];

            updateOverallStatus(`正在向 DeepSeek 发送包含 ${questionsForAI.length} 道题的请求...`);
            try {
                const response = await fetch("https://api.deepseek.com/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: messages,
                        stream: false,
                        temperature: 0.1,
                        max_tokens: 2048
                    })
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    updateOverallStatus(`DeepSeek API错误 ${response.status}. ${errorBody.substring(0,150)}`, true);
                    throw new Error(`Batch API request failed with status ${response.status}: ${errorBody}`);
                }

                const data = await response.json();
                if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                    const llmResponseContent = data.choices[0].message.content.trim();
                    updateOverallStatus("已收到DeepSeek的批量回复，尝试解析...");
                    
                    try {
                        const jsonMatch = llmResponseContent.match(/(\[[\s\S]*\])/);
                        let parsedAnswersByLLM;
                        if (jsonMatch && jsonMatch[1]) {
                            parsedAnswersByLLM = JSON.parse(jsonMatch[1]);
                        } else {
                            parsedAnswersByLLM = JSON.parse(llmResponseContent);
                        }
                        
                        if (Array.isArray(parsedAnswersByLLM) && parsedAnswersByLLM.every(ans => 
                            typeof ans.questionNumber === 'number' && 
                            typeof ans.answerLetter === 'string' && 
                            /^[A-Z]$/.test(ans.answerLetter.toUpperCase())
                        )) {
                            updateOverallStatus(`成功解析 ${parsedAnswersByLLM.length} 个来自LLM的答案。`);
                            const processedAIAnswers = [];
                            
                            parsedAnswersByLLM.forEach(llmAns => {
                                const originalQuestion = questionsForAI.find(q => q.qNumDisplay === llmAns.questionNumber);
                                if (originalQuestion) {
                                    let finalChoice = llmAns.answerLetter.toUpperCase();
                                    const qInfo = knowledgeBase[originalQuestion.questionText];
                                    const attemptedIncorrect = qInfo?.incorrectAttempts || [];

                                    if (attemptedIncorrect.includes(finalChoice)) {
                                        updateQuestionStatus(originalQuestion.qNumDisplay, 
                                            `第 ${originalQuestion.qNumDisplay} 题: AI建议 (${finalChoice}) 已知错误。尝试选择其他选项...`, 
                                            true, "AI/KB");
                                        
                                        const availableOptions = originalQuestion.options
                                            .map(opt => opt.value.toUpperCase())
                                            .filter(optVal => !attemptedIncorrect.includes(optVal));
                                        
                                        if (availableOptions.length > 0) {
                                            finalChoice = availableOptions[0];
                                            updateQuestionStatus(originalQuestion.qNumDisplay, 
                                                `第 ${originalQuestion.qNumDisplay} 题: 更换为选项 ${finalChoice}。`, 
                                                false, "KB Logic");
                                        } else {
                                            updateQuestionStatus(originalQuestion.qNumDisplay, 
                                                `第 ${originalQuestion.qNumDisplay} 题: AI建议 (${finalChoice}) 已知错误，且无其他未尝试选项。仍使用AI建议。`, 
                                                true, "AI/KB");
                                        }
                                    }
                                    
                                    processedAIAnswers.push({
                                        qNumDisplay: originalQuestion.qNumDisplay,
                                        questionIdFromInputName: originalQuestion.questionIdFromInputName,
                                        questionText: originalQuestion.questionText,
                                        options: originalQuestion.options,
                                        chosenAnswer: finalChoice,
                                        source: "AI"
                                    });
                                    
                                    updateQuestionStatus(originalQuestion.qNumDisplay, 
                                        `第 ${originalQuestion.qNumDisplay} 题: AI 处理后选定 ${finalChoice}`, 
                                        false, "AI");
                                }
                            });
                            
                            return processedAIAnswers;
                        } else {
                            updateOverallStatus("DeepSeek 返回的JSON格式不正确或内容不符合预期。", true);
                            return [];
                        }
                    } catch (e) {
                        updateOverallStatus("解析DeepSeek返回的JSON时出错。", true);
                        console.error("Error parsing LLM JSON response:", e);
                        return [];
                    }
                } else {
                    updateOverallStatus("DeepSeek 返回数据结构异常。", true);
                    return [];
                }
            } catch (error) {
                updateOverallStatus("调用 DeepSeek API 时发生错误。", true);
                console.error("Error calling DeepSeek API:", error);
                throw error;
            }
        }

        async function tryAutoParseResultsPage(pendingData) {
            updateOverallStatus("尝试自动解析考试结果页面...");
            const config = AUTO_FEEDBACK_CONFIG;
            const { answersFilledInLastAttempt } = pendingData;

            if (!window.location.pathname.includes(config.RESULTS_PAGE_PATH_CONTAINS)) {
                updateOverallStatus("当前页面不是预期的结果页。跳过自动解析。", false);
                return { success: false, reason: "非结果页路径。" };
            }
            
            const statusTextElement = document.querySelector(config.STATUS_TEXT_SELECTOR);
            if (!statusTextElement) {
                updateOverallStatus("结果页状态文本元素未找到。自动解析失败。", true);
                return { success: false, reason: "状态文本元素未找到。" };
            }

            const statusText = statusTextElement.textContent.trim();
            let updatesMade = 0;

            if (config.PASS_INDICATOR_TEXT.some(txt => statusText.includes(txt))) {
                updateOverallStatus(`检测到: ${statusText}。所有上次答案标记为正确。`);
                if (!answersFilledInLastAttempt || answersFilledInLastAttempt.length === 0) {
                    return { success: true, allCorrect: true, updatesMade: false, reason: "通过页面，但无待反馈答案。" };
                }

                for (const ans of answersFilledInLastAttempt) {
                    const qTextForKB = ans.questionText;
                    const chosenAnswerLetter = ans.chosenAnswer.toUpperCase();
                    
                    if (!knowledgeBase[qTextForKB]) knowledgeBase[qTextForKB] = { incorrectAttempts: [] };
                    knowledgeBase[qTextForKB].knownCorrectAnswer = chosenAnswerLetter;
                    knowledgeBase[qTextForKB].incorrectAttempts = (knowledgeBase[qTextForKB].incorrectAttempts || [])
                        .filter(ia => ia !== chosenAnswerLetter);
                    
                    updateQuestionStatus(ans.qNumDisplay || qTextForKB.substring(0,10), 
                        `"${qTextForKB.substring(0,20)}..." (选${chosenAnswerLetter}) 已确认为正确 (因考试通过)。`, 
                        false, "AutoResult");
                    updatesMade++;
                }

                if (updatesMade > 0) saveData(KNOWLEDGE_BASE_KEY, knowledgeBase);
                return { success: true, allCorrect: true, updatesMade: updatesMade > 0, reason: "已处理通过页面。" };
            }

            if (config.FAIL_INDICATOR_TEXT.some(txt => statusText.includes(txt))) {
                updateOverallStatus(`检测到: ${statusText}。解析错误题目...`);
                const resultItems = document.querySelectorAll(config.QUESTION_ITEM_SELECTOR_ON_FAIL_RESULT);
                let anyMarkedIncorrectInThisBatch = false;

                if (resultItems.length === 0 && answersFilledInLastAttempt && answersFilledInLastAttempt.length > 0) {
                    updateOverallStatus("考试未通过但未找到错误题目列表。假设全部提交的答案错误。", false);
                    
                    for (const ans of answersFilledInLastAttempt) {
                        const qTextForKB = ans.questionText;
                        const submittedAnswerLetter = ans.chosenAnswer.toUpperCase();
                        
                        if (!knowledgeBase[qTextForKB]) knowledgeBase[qTextForKB] = { incorrectAttempts: [] };
                        if (!knowledgeBase[qTextForKB].incorrectAttempts.includes(submittedAnswerLetter)) {
                            knowledgeBase[qTextForKB].incorrectAttempts.push(submittedAnswerLetter);
                            updatesMade++;
                        }
                        
                        knowledgeBase[qTextForKB].knownCorrectAnswer = null;
                        updateQuestionStatus(ans.qNumDisplay || qTextForKB.substring(0,10), 
                            `结果页(无细目): "${qTextForKB.substring(0,20)}..." (选${submittedAnswerLetter}) 假定为错误。`, 
                            true, "AutoResult");
                        anyMarkedIncorrectInThisBatch = true;
                    }
                } else {
                    for (const item of resultItems) {
                        const questionTextElement = item.querySelector(config.QUESTION_TEXT_SELECTOR_ON_RESULT_ITEM);
                        const userAnswerElement = item.querySelector(config.YOUR_ANSWER_TEXT_SELECTOR_ON_RESULT_ITEM);

                        if (!questionTextElement || !userAnswerElement) continue;

                        let questionTextOnResult = (questionTextElement.getAttribute('title') || questionTextElement.textContent).trim();
                        questionTextOnResult = questionTextOnResult.replace(/^\d+、\s*/, '').trim();

                        const userAnswerFullText = userAnswerElement.textContent.trim();
                        const answerLetterMatch = userAnswerFullText.match(/【您的答案：\s*([A-Z])(?:[、，.。]|\s|$)/i);

                        if (!answerLetterMatch || !answerLetterMatch[1]) continue;

                        const chosenAnswerLetterOnResult = answerLetterMatch[1].toUpperCase();
                        const correspondingAnswerFromLastAttempt = answersFilledInLastAttempt.find(
                            ans => ans.questionText.trim() === questionTextOnResult
                        );

                        if (correspondingAnswerFromLastAttempt) {
                            const qTextForKB = correspondingAnswerFromLastAttempt.questionText;
                            const submittedAnswerLetter = correspondingAnswerFromLastAttempt.chosenAnswer.toUpperCase();
                            const qNumDisplay = correspondingAnswerFromLastAttempt.qNumDisplay;

                            const imgElement = item.querySelector('img.state_error');
                            let isExplicitlyWrong = false;
                            
                            if (imgElement && imgElement.src.includes('error_icon.png')) {
                                isExplicitlyWrong = true;
                            }

                            if (isExplicitlyWrong) {
                                if (submittedAnswerLetter === chosenAnswerLetterOnResult) {
                                    if (!knowledgeBase[qTextForKB]) knowledgeBase[qTextForKB] = { incorrectAttempts: [] };
                                    if (!knowledgeBase[qTextForKB].incorrectAttempts) knowledgeBase[qTextForKB].incorrectAttempts = [];

                                    if (!knowledgeBase[qTextForKB].incorrectAttempts.includes(submittedAnswerLetter)) {
                                        knowledgeBase[qTextForKB].incorrectAttempts.push(submittedAnswerLetter);
                                        updatesMade++;
                                    }
                                    
                                    knowledgeBase[qTextForKB].knownCorrectAnswer = null;
                                    updateQuestionStatus(qNumDisplay || qTextForKB.substring(0,10), 
                                        `结果页: "${qTextForKB.substring(0,20)}..." (选${submittedAnswerLetter}) 被明确标记为错误。`, 
                                        true, "AutoResult");
                                    anyMarkedIncorrectInThisBatch = true;
                                }
                            } else {
                                if (submittedAnswerLetter === chosenAnswerLetterOnResult) {
                                    if (!knowledgeBase[qTextForKB]) knowledgeBase[qTextForKB] = { incorrectAttempts: [] };
                                    knowledgeBase[qTextForKB].knownCorrectAnswer = submittedAnswerLetter;
                                    knowledgeBase[qTextForKB].incorrectAttempts = (knowledgeBase[qTextForKB].incorrectAttempts || [])
                                        .filter(ia => ia !== submittedAnswerLetter);
                                    updatesMade++;
                                    
                                    updateQuestionStatus(qNumDisplay || qTextForKB.substring(0,10), 
                                        `结果页: "${qTextForKB.substring(0,20)}..." (选${submittedAnswerLetter}) 被识别为正确。`, 
                                        false, "AutoResult");
                                }
                            }
                        }
                    }
                }

                if (updatesMade > 0) saveData(KNOWLEDGE_BASE_KEY, knowledgeBase);
                return { 
                    success: true, 
                    allCorrect: !anyMarkedIncorrectInThisBatch, 
                    updatesMade: updatesMade > 0, 
                    reason: "已处理未通过页面。" 
                };
            }

            updateOverallStatus("结果页状态文本未匹配任何已知通过/失败指示。自动解析保守失败。", false);
            return { success: false, reason: "状态文本不明确。" };
        }

        async function attemptAutoRetry() {
            if (AUTO_FEEDBACK_CONFIG.RETRY_BUTTON_SELECTOR) {
                const retryButton = document.querySelector(AUTO_FEEDBACK_CONFIG.RETRY_BUTTON_SELECTOR);
                if (retryButton) {
                    updateOverallStatus("尝试自动点击重试按钮 ('重新考试')...", false);
                    retryButton.click();
                    return true;
                } else {
                    updateOverallStatus("未找到'重新考试'按钮。请手动操作。", true);
                }
            } else {
                updateOverallStatus("'重新考试'按钮选择器未配置。请手动操作。", true);
            }
            return false;
        }

        async function manualProcessPendingFeedback(pendingData) {
            updateOverallStatus("自动解析失败或未配置。准备手动反馈 (当前默认上次全对)...");
            
            const { answersFilledInLastAttempt } = pendingData;
            let anyMarkedIncorrect = false;

            if (!answersFilledInLastAttempt || answersFilledInLastAttempt.length === 0) {
                updateOverallStatus("待反馈数据为空，无需手动反馈。", false);
                clearData(PENDING_FEEDBACK_KEY);
                return { success: true, allCorrect: true };
            }

            updateOverallStatus("自动解析失败/未配置。默认上次所有答案为正确处理...");
            for (const ans of answersFilledInLastAttempt) {
                const qText = ans.questionText;
                const choice = ans.chosenAnswer.toUpperCase();
                const qNumDisplay = ans.qNumDisplay;
                
                if (!knowledgeBase[qText]) knowledgeBase[qText] = { incorrectAttempts: [] };
                
                knowledgeBase[qText].knownCorrectAnswer = choice;
                knowledgeBase[qText].incorrectAttempts = (knowledgeBase[qText].incorrectAttempts || [])
                    .filter(ia => ia !== choice);
                
                updateQuestionStatus(qNumDisplay || qText.substring(0,10), 
                    `上次的答案 ${choice} for "${qText.substring(0,20)}..." 已默认标记为正确。`, 
                    false, "User (Default)");
            }

            saveData(KNOWLEDGE_BASE_KEY, knowledgeBase);
            clearData(PENDING_FEEDBACK_KEY);

            updateOverallStatus("（伪）手动反馈流程已完成 (默认全对)，知识库已更新。", false);
            return { success: true, allCorrect: !anyMarkedIncorrect };
        }

        // 主执行函数
        async function mainExecution() {
            if (DEEPSEEK_API_KEY.includes("YOUR_DEEPSEEK_API_KEY") || DEEPSEEK_API_KEY === "" || DEEPSEEK_API_KEY.length < 15 ) {
                alert("错误：请在脚本中填入您的真实DeepSeek API密钥！");
                updateOverallStatus("错误: API密钥未配置或无效。", true);
                return;
            }

            updateOverallStatus("自动化脚本启动。");
            
            knowledgeBase = loadData(KNOWLEDGE_BASE_KEY) || {};
            const pendingFeedback = loadData(PENDING_FEEDBACK_KEY);
            let autoRetryTriggeredByFeedback = false;

            if (pendingFeedback) {
                const autoResult = await tryAutoParseResultsPage(pendingFeedback);
                if (autoResult.success) {
                    clearData(PENDING_FEEDBACK_KEY);
                    if (!autoResult.allCorrect) {
                        updateOverallStatus("根据自动结果解析，上次提交包含错误。");
                        if (await attemptAutoRetry()) {
                            autoRetryTriggeredByFeedback = true;
                        }
                    } else {
                        updateOverallStatus("上次提交所有题目均正确！考试完成。");
                        return;
                    }
                } else {
                    updateOverallStatus(`自动解析尝试信息: ${autoResult.reason || '未知原因'}. 执行（伪）手动反馈...`);
                    const manualFeedbackResult = await manualProcessPendingFeedback(pendingFeedback);
                    if (!manualFeedbackResult.allCorrect) {
                        if (await attemptAutoRetry()) {
                            autoRetryTriggeredByFeedback = true;
                        }
                    } else {
                        updateOverallStatus("（伪）手动反馈已处理 (默认无错误)。");
                    }
                }
            }

            if (autoRetryTriggeredByFeedback) {
                updateOverallStatus("已根据反馈处理尝试自动重试，请等待页面加载后再次运行脚本。");
                return;
            }

            const allQuestionsOnPage = extractExamQuestions();

            if (!allQuestionsOnPage || allQuestionsOnPage.length === 0) {
                if (!pendingFeedback) {
                    updateOverallStatus("当前页面似乎不是考试答题页或未提取到题目。请导航到考试页面。", true);
                } else {
                    updateOverallStatus("反馈处理完毕。当前页面非考试答题页。若需继续，请导航到考试页面并重跑脚本。", false);
                }
                return;
            }

            updateOverallStatus(`页面成功提取 ${allQuestionsOnPage.length} 道题目，开始决策...`);

            const questionsToAskAI = [];
            const answersFromKB = [];

            allQuestionsOnPage.forEach(q => {
                const qInfo = knowledgeBase[q.questionText];
                const knownAnswerLetter = qInfo?.knownCorrectAnswer;

                if (knownAnswerLetter) {
                    if (q.options.some(opt => opt.value.toUpperCase() === knownAnswerLetter.toUpperCase())) {
                        answersFromKB.push({ ...q, chosenAnswer: knownAnswerLetter, source: "KB" });
                        updateQuestionStatus(q.qNumDisplay, `第 ${q.qNumDisplay} 题: 从知识库加载答案 ${knownAnswerLetter}`, false, "KB");
                    } else {
                        questionsToAskAI.push(q);
                        updateQuestionStatus(q.qNumDisplay, `第 ${q.qNumDisplay} 题: 知识库答案 ${knownAnswerLetter} 无效，将提交AI。`, true, "KB");
                    }
                } else {
                    questionsToAskAI.push(q);
                    updateQuestionStatus(q.qNumDisplay, `第 ${q.qNumDisplay} 题: 知识库无答案或上次错误，将提交AI。`, false, "KB");
                }
            });

            let aiAnswers = [];
            if (questionsToAskAI.length > 0) {
                try {
                    aiAnswers = await getBatchAnswersFromDeepSeek(questionsToAskAI, DEEPSEEK_API_KEY);
                } catch (error) {
                    updateOverallStatus("获取 DeepSeek 答案时发生严重错误，脚本停止。", true);
                    alert("获取 DeepSeek 答案时发生严重错误，脚本停止。请检查控制台和API密钥。");
                    return;
                }

                if (!aiAnswers || aiAnswers.length === 0 && questionsToAskAI.length > 0) {
                    updateOverallStatus("从 DeepSeek 获取答案失败或返回为空，尽管有题目需要回答。", true);
                    alert("无法从 DeepSeek 获取有效答案，脚本停止。请检查API密钥和网络连接。");
                    return;
                }
            } else {
                updateOverallStatus("所有题目均已在知识库中找到有效答案。");
            }

            const allAnswersToFill = answersFromKB.concat(aiAnswers);

            if (allAnswersToFill.length > 0) {
                if (fillExamAnswers(allAnswersToFill)) {
                    saveData(PENDING_FEEDBACK_KEY, {
                        answersFilledInLastAttempt: allAnswersToFill.map(ans => ({
                            qNumDisplay: ans.qNumDisplay,
                            questionText: ans.questionText,
                            chosenAnswer: ans.chosenAnswer,
                            source: ans.source
                        }))
                    });
                    updateOverallStatus(`已保存本次 (${allAnswersToFill.length} 道题) 的答案用于后续反馈。`);

                    if (autoSubmit) {
                        updateOverallStatus("准备提交，请查看控制台日志。几秒后将尝试提交...", false);
                        const submitButton = document.querySelector('input#btn_submit');
                        if (submitButton) {
                            console.log("---- 即将自动提交！请在页面跳转前，尽快查看并复制上面的 [调试 Fill] 日志。-----");
                            setTimeout(() => {
                                updateOverallStatus("正在自动提交考卷...", false);
                                submitButton.click();
                            }, 500);
                        } else {
                            updateOverallStatus("未找到提交按钮，请手动提交。", true);
                        }
                    } else {
                        updateOverallStatus("自动填充完毕，请手动检查和提交。", false);
                    }
                } else {
                    updateOverallStatus("答案填写过程中出现问题，未提交。请检查。", true);
                }
            } else {
                updateOverallStatus("没有可填写的答案。脚本结束。", true);
            }
        }

        // 开始执行
        mainExecution().catch(e => {
            updateOverallStatus("脚本执行过程中发生未捕获的严重错误: " + e.message, true);
            console.error("Unhandled error in mainExecution:", e);
        });
    }

    // 检测当前页面类型并执行相应功能
    function detectAndExecute() {
        // 检测是否是视频页面
        if (typeof player !== 'undefined' && player && player.j2s_getDuration) {
            console.log('检测到视频页面,启动视频自动完成功能');
            autoCompleteVideo();
        }
        
        // 检测是否是考试页面
        if (window.location.pathname.includes('exam.aspx') || window.location.pathname.includes('exam_result.aspx')) {
            console.log('检测到考试页面,启动考试自动答题功能');
            autoCompleteExam(true);
        }
    }

    // 页面加载完成后执行检测
    window.addEventListener('load', detectAndExecute);
})(); 