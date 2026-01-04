// ==UserScript==
// @name         在线培训助手增强版
// @namespace    http://tampermonkey.net/
// @version      1.35
// @description  党旗飘飘学习助手增强版，支持自动刷课、自动答题，配合AI模型实现智能解答
// @author       bugo
// @match        *://*/jjfz/play*
// @match        *://*/*/jjfz/play*
// @match        *://*/jjfz/lesson/exam*
// @match        *://*/*/jjfz/lesson/exam*
// @match        *://*/jjfz/exam_center/end_exam*
// @match        *://*/*/jjfz/exam_center/end_exam*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/535939/%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E5%8A%A9%E6%89%8B%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/535939/%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E5%8A%A9%E6%89%8B%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("在线培训助手已加载");
    
    // 检测当前页面类型
    const isExamPage = window.location.href.includes('/lesson/exam') || window.location.href.includes('/exam_center/end_exam');
    const isPlayPage = window.location.href.includes('/jjfz/play');
    
    // 配置信息
    const config = {
        // AI API设置
        ai: {
            apiKey: GM_getValue('apiKey', ''),
            modelUrl: GM_getValue('modelUrl', 'https://deepseek.com/api/v1/chat/completions'),
            modelName: GM_getValue('modelName', 'deepseek-chat'),
            temperature: GM_getValue('temperature', 0.7),
            maxTokens: GM_getValue('maxTokens', 500),
            apiTimeout: 30000 // API请求超时时间(毫秒)
        },
        
        // 课程设置
        course: {
            autoPlay: GM_getValue('autoPlay', true),
            autoNext: true
        },
        
        // UI设置
        ui: {
            panelExpanded: GM_getValue('panelExpanded', true),
            activeTab: GM_getValue('activeTab', isExamPage ? 'exam' : 'course')
        }
    };
    
    // 保存配置
    function saveConfig() {
        try {
            // 保存API配置
            GM_setValue('modelUrl', config.ai.modelUrl);
            GM_setValue('modelName', config.ai.modelName);
            GM_setValue('apiKey', config.ai.apiKey);
            GM_setValue('temperature', config.ai.temperature);
            GM_setValue('maxTokens', config.ai.maxTokens);
            GM_setValue('apiTimeout', config.ai.apiTimeout);
            
            // 保存课程配置
            GM_setValue('autoPlay', config.course.autoPlay);
            
            // 保存UI配置
            GM_setValue('panelExpanded', config.ui.panelExpanded);
            GM_setValue('activeTab', config.ui.activeTab);
            
            // 输出保存配置日志
            console.log("配置已保存");
            return true;
        } catch (error) {
            console.error("保存配置失败:", error);
            return false;
        }
    }
    
    // 工具函数
    const utils = {
        // 获取视频元素
        getVideo: () => document.querySelector("video"),
        
        // 获取资源ID
        getRid: () => {
            const html = document.documentElement.innerHTML;
            const match = html.match(/rid[\s:="']*(\d+)["'\s]/);
            return match ? match[1] : null;
        },
        
        // 获取当前题目信息
        getQuestionInfo: () => {
            try {
                // 获取题目文本
                const questionTitle = document.querySelector('.exam_h2')?.textContent || '';
                
                // 判断题目类型
                let questionType = '';
                if (document.querySelector('.e_cont_title span')?.textContent.includes('单选题')) {
                    questionType = '单选题';
                } else if (document.querySelector('.e_cont_title span')?.textContent.includes('多选题')) {
                    questionType = '多选题';
                } else if (document.querySelector('.e_cont_title span')?.textContent.includes('判断题')) {
                    questionType = '判断题';
                } else if (document.querySelector('.summary_question')) {
                    questionType = '填空题';
                }
                
                // 获取选项文本(如果有)
                const options = [];
                document.querySelectorAll('.answer_list li label, .answer_list_box li label').forEach(label => {
                    options.push(label.textContent.trim());
                });
                
                // 获取当前题号
                const questionNumber = document.querySelector('.exam_pages span')?.textContent?.split('/')[0] || '';
                
                // 获取题目ID
                const questionId = document.querySelector('.answer_list ul')?.getAttribute('qid') || 
                                 document.querySelector('.answer_list_box ul')?.getAttribute('qid') ||
                                 document.querySelector('.exam_label_btn')?.getAttribute('data-val') || '';
                
                // 获取当前题目索引
                const questionIndex = document.querySelector('.answer_list ul')?.getAttribute('qindex') || 
                                     document.querySelector('.answer_list_box ul')?.getAttribute('qindex') ||
                                     document.querySelector('.exam_label_btn')?.getAttribute('data-index') || '';
                
                return {
                    title: questionTitle,
                    type: questionType,
                    options: options,
                    number: questionNumber,
                    id: questionId,
                    index: questionIndex
                };
            } catch (e) {
                console.error('获取题目信息失败:', e);
                return null;
            }
        },
        
        // 清除所有定时器
        clearAllTimers: () => {
            // 清除原页面定时器
            clearInterval(window.timer);
            window.clearInterval(window.loop_flag);
            window.clearInterval(window.flag);
    
            // 清除我们自己的定时器
            if (window.autoInterval) {
                clearInterval(window.autoInterval);
                window.autoInterval = null;
            }
            
            // 清除答题定时器
            if (window.answerInterval) {
                clearInterval(window.answerInterval);
                window.answerInterval = null;
            }
        },
        
        // 处理各种弹窗
        handleDialogs: () => {
            document.querySelectorAll(".public_close, .public_cancel, .public_submit, .public_cont1").forEach(btn => {
                if (btn) {
                    if (btn.textContent?.includes("继续观看") || btn.textContent?.includes("我知道了") || btn.textContent?.includes("继续")) {
                        btn.click();
                    }
                }
            });
        },
        
        // 用于防止页面监测
        preventDetection: () => {
            // 防止页面切换时暂停
            const originAddListener = Document.prototype.addEventListener;
            Document.prototype.addEventListener = function(type, listener, options) {
                if (type === "visibilitychange") return;
                return originAddListener.call(this, type, listener, options);
            };
            Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
            Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
        }
    };
    
    // AI接口
    const ai = {
        // 调用AI API
        callAI: (question, options, type) => {
            return new Promise((resolve, reject) => {
                if (!config.ai.apiKey) {
                    reject("请先设置API Key");
                    return;
                }
                
                // 构建prompt
                let prompt = `请帮我回答以下问题，直接给出答案选项编号，不要任何解释。\n问题: ${question}\n`;
                
                // 添加题型信息
                prompt += `题型: ${type}\n\n`;
                
                // 只有单选题和多选题需要拼接选项
                if ((type === '单选题' || type === '多选题') && options && options.length > 0) {
                    prompt += "选项:\n";
                    
                    // 根据题型设置选项前缀
                    options.forEach((option, index) => {
                        // 单选题用A,B,C,D标记，多选题用数字标记
                        const prefix = type === '多选题' ? (index + 1) : String.fromCharCode(65 + index);
                        prompt += `${prefix}. ${option}\n`;
                    });
                } else if (type === '判断题') {
                    // 判断题直接提示回答正确或错误
                    prompt += "这是一道判断题，请判断题目描述是否正确。\n";
                } else if (type === '填空题') {
                    prompt += "这是一道填空题，请直接给出答案。\n";
                }
                
                // 根据题型调整prompt的要求
                if (type === '单选题') {
                    prompt += "\n只需回答一个选项编号(A/B/C/D)，不要任何多余文字。";
                } else if (type === '多选题') {
                    prompt += "\n回答格式: 数字序号，用逗号分隔，如'1,3,4'，不要任何多余文字。";
                } else if (type === '判断题') {
                    prompt += "\n只需回答'正确'或'错误'，不要任何多余文字。";
                } else {
                    prompt += "\n请直接给出答案，简明扼要。";
                }
                
                console.log("发送AI请求: ", {
                    url: config.ai.modelUrl,
                    model: config.ai.modelName,
                    prompt: prompt
                });
                
                // 调用API
                GM_xmlhttpRequest({
                    method: "POST",
                    url: config.ai.modelUrl,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${config.ai.apiKey}`
                    },
                    data: JSON.stringify({
                        model: config.ai.modelName,
                        messages: [
                            {
                                role: "system",
                                content: "你是一个擅长党建知识的考试助手，你的回答必须简洁，只提供答案，不解释原因。"
                            },
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        temperature: config.ai.temperature,
                        max_tokens: config.ai.maxTokens
                    }),
                    timeout: config.ai.apiTimeout,
                    onload: function(response) {
                        try {
                            console.log("AI响应状态: ", response.status);
                            
                            // 处理非200响应
                            if (response.status !== 200) {
                                reject(`API请求失败，状态码: ${response.status}, 信息: ${response.statusText}`);
                                return;
                            }
                            
                            const result = JSON.parse(response.responseText);
                            if (result.choices && result.choices[0]) {
                                const answer = result.choices[0].message.content.trim();
                                
                                // 简单处理回答
                                let processedAnswer = answer;
                                
                                // 对单选题回答处理字母格式
                                if (type === '单选题') {
                                    // 提取第一个字母作为答案
                                    const letterMatch = answer.match(/[A-Da-d]/);
                                    if (letterMatch) {
                                        processedAnswer = letterMatch[0].toUpperCase();
                                    }
                                }
                                
                                // 对多选题处理，确保格式正确
                                if (type === '多选题') {
                                    // 提取所有数字
                                    const numbersMatch = answer.match(/\d+/g);
                                    if (numbersMatch) {
                                        processedAnswer = numbersMatch.join(',');
                                    }
                                }
                                
                                // 处理判断题答案
                                if (type === '判断题') {
                                    // 使用更强大的判断逻辑
                                    const lowerAnswer = answer.toLowerCase().trim();
                                    
                                    // 判断"正确"的各种表达方式
                                    if (lowerAnswer.includes('正确') || 
                                        lowerAnswer.includes('对') || 
                                        lowerAnswer.includes('√') || 
                                        lowerAnswer.includes('true') || 
                                        lowerAnswer.includes('right') || 
                                        lowerAnswer === 'a' || 
                                        lowerAnswer === 't' || 
                                        lowerAnswer === 'yes' || 
                                        lowerAnswer === 'y') {
                                        processedAnswer = '正确';
                                    }
                                    // 判断"错误"的各种表达方式
                                    else if (lowerAnswer.includes('错误') || 
                                             lowerAnswer.includes('错') || 
                                             lowerAnswer.includes('×') || 
                                             lowerAnswer.includes('false') || 
                                             lowerAnswer.includes('wrong') || 
                                             lowerAnswer === 'b' || 
                                             lowerAnswer === 'f' || 
                                             lowerAnswer === 'no' || 
                                             lowerAnswer === 'n') {
                                        processedAnswer = '错误';
                                    }
                                    // 如果无法识别，默认为"错误"
                                    else {
                                        console.warn(`无法识别的判断题答案: "${answer}"，默认处理为"错误"`);
                                        processedAnswer = '错误';
                                    }
                                }
                                
                                console.log("AI原始回答: ", answer);
                                console.log("处理后回答: ", processedAnswer);
                                
                                resolve(processedAnswer);
                            } else {
                                reject("API返回格式错误");
                            }
                        } catch (e) {
                            reject("解析API响应失败: " + e.message);
                        }
                    },
                    onerror: function(error) {
                        reject("API请求失败: " + error);
                    },
                    ontimeout: function() {
                        reject("API请求超时");
                    }
                });
            });
        },
        
        // 获取答案(调用指定的AI模型)
        getAnswer: async (question) => {
            try {
                const info = utils.getQuestionInfo();
                if (!info) {
                    throw new Error("无法获取题目信息");
                }
                
                // 记录到控制台
                console.log(`正在解答题目: ${info.title}`);
                console.log(`题目类型: ${info.type}`);
                console.log(`选项: `, info.options);
                
                // 更新UI显示为等待状态
                ui.updateAIAnswerStatus('waiting');
                
                // 调用API获取答案
                const answer = await ai.callAI(info.title, info.options, info.type);
                
                // 更新UI显示为成功状态
                ui.updateAIAnswerStatus('success', answer);
                
                console.log(`AI回答: ${answer}`);
                return {
                    answer: answer,
                    info: info
                };
            } catch (error) {
                console.error("获取答案失败:", error);
                
                // 更新UI显示为错误状态
                ui.updateAIAnswerStatus('error', error.message);
                
                // 返回错误信息
                return null;
            }
        }
    };
    
    // 考试功能
    const exam = {
        // 封装不同题型的答题函数
        handlers: {
            // 处理单选题
            handleSingleChoice: (answer, options) => {
                try {
                    // 处理单选题，转换A,B,C,D为数字索引
                    let index = -1;
                    
                    // 支持多种格式的单选答案
                    if (/^[A-Da-d]$/.test(answer.trim())) {
                        // 如果是A、B、C、D格式
                        index = answer.trim().toUpperCase().charCodeAt(0) - 65; // 'A'=0, 'B'=1, ...
                    } else if (/^\d+$/.test(answer.trim())) {
                        // 如果是数字格式 (1、2、3、4)
                        index = parseInt(answer.trim()) - 1;
                    }
                    
                    const labels = document.querySelectorAll('.answer_list li label');
                    
                    if (index >= 0 && index < labels.length) {
                        // 点击对应选项
                        console.log(`选择单选选项: ${index + 1}`);
                        labels[index].click();
                        return true;
                    } else {
                        throw new Error(`无效的单选答案索引: ${answer} -> ${index}`);
                    }
                } catch (error) {
                    console.error("单选题处理失败:", error);
                    throw error;
                }
            },
            
            // 处理多选题
            handleMultipleChoice: (answer, options) => {
                return new Promise((resolve, reject) => {
                    try {
                        // 处理多选题，答案格式为: "1,2,3" 或 "1,3,4"
                        let selectedIndexes = [];
                        
                        // 支持多种格式的多选答案
                        if (answer.includes(',')) {
                            // 处理以逗号分隔的格式
                            selectedIndexes = answer.split(',').map(num => {
                                const trimmed = num.trim();
                                return /^\d+$/.test(trimmed) ? parseInt(trimmed) - 1 : -1;
                            }).filter(idx => idx >= 0);
                        } else if (/^[A-Za-z]+$/.test(answer.trim())) {
                            // 处理字母格式 (如 "ACD")
                            selectedIndexes = Array.from(answer.trim().toUpperCase()).map(char => {
                                return char.charCodeAt(0) - 65;
                            }).filter(idx => idx >= 0 && idx < 26);
                        } else {
                            // 尝试提取所有数字
                            const matches = answer.match(/\d+/g);
                            if (matches) {
                                selectedIndexes = matches.map(num => parseInt(num) - 1);
                            }
                        }
                        
                        const labels = document.querySelectorAll('.answer_list_box li label');
                        
                        if (selectedIndexes.length === 0) {
                            throw new Error(`无法从答案中提取选项: ${answer}`);
                        }
                        
                        console.log(`选择多选选项: ${selectedIndexes.map(i => i + 1).join(',')}`);
                        
                        // 使用循环队列处理多选项的点击，避免递归调用可能导致的问题
                        let currentIndex = 0;
                        
                        // 创建间隔计时器，逐一点击选项
                        const clickInterval = setInterval(() => {
                            if (currentIndex >= selectedIndexes.length) {
                                // 所有选项都已点击完毕
                                clearInterval(clickInterval);
                                console.log("多选题选项已全部选择完毕");
                                resolve(true);
                                return;
                            }
                            
                            const optionIndex = selectedIndexes[currentIndex];
                            if (optionIndex >= 0 && optionIndex < labels.length) {
                                console.log(`选择多选选项 ${currentIndex + 1}/${selectedIndexes.length}: 选项=${optionIndex + 1}`);
                                labels[optionIndex].click();
                            } else {
                                console.warn(`无效的多选选项索引: ${optionIndex}`);
                            }
                            
                            // 移至下一个选项
                            currentIndex++;
                        }, 300); // 每300毫秒点击一个选项
                    } catch (error) {
                        console.error("多选题处理失败:", error);
                        reject(error);
                    }
                });
            },
            
            // 处理判断题
            handleJudgement: (answer, options) => {
                try {
                    // 处理判断题
                    let isCorrect = false;
                    
                    // 使用更强大的判断逻辑
                    const lowerAnswer = answer.toLowerCase().trim();
                    
                    // 判断"正确"的各种表达方式
                    if (lowerAnswer.includes('正确') || 
                        lowerAnswer.includes('对') || 
                        lowerAnswer.includes('√') || 
                        lowerAnswer.includes('true') || 
                        lowerAnswer.includes('right') || 
                        lowerAnswer === 'a' || 
                        lowerAnswer === 't' || 
                        lowerAnswer === 'yes' || 
                        lowerAnswer === 'y') {
                        isCorrect = true;
                    }
                    // 其他情况视为"错误"
                    
                    // 获取所有选项
                    const labels = document.querySelectorAll('.answer_list li label');
                    
                    // 默认假设第一个是"正确"，第二个是"错误"
                    let correctOptionIndex = -1;
                    let wrongOptionIndex = -1;
                    
                    // 遍历选项文本，查找正确和错误选项
                    for (let i = 0; i < labels.length; i++) {
                        const optionText = labels[i].textContent.trim().toLowerCase();
                        
                        if (optionText.includes('正确') || optionText.includes('对') || 
                            optionText.includes('√') || optionText.includes('true') || 
                            optionText.includes('right') || optionText === 'a') {
                            correctOptionIndex = i;
                        } else if (optionText.includes('错误') || optionText.includes('错') || 
                                  optionText.includes('×') || optionText.includes('false') || 
                                  optionText.includes('wrong') || optionText === 'b') {
                            wrongOptionIndex = i;
                        }
                    }
                    
                    // 如果没有找到明确的选项，使用默认方式处理
                    if (correctOptionIndex === -1) correctOptionIndex = 0;
                    if (wrongOptionIndex === -1) wrongOptionIndex = 1;
                    
                    // 根据AI回答选择选项
                    const indexToClick = isCorrect ? correctOptionIndex : wrongOptionIndex;
                    console.log(`选择判断: ${isCorrect ? '正确' : '错误'} (选项索引: ${indexToClick})`);
                    
                    // 点击对应选项
                    if (indexToClick >= 0 && indexToClick < labels.length) {
                        labels[indexToClick].click();
                        return true;
                    } else {
                        throw new Error(`判断题选项不存在: ${indexToClick}`);
                    }
                } catch (error) {
                    console.error("判断题处理失败:", error);
                    throw error;
                }
            },
            
            // 处理填空题
            handleFillBlank: (answer, options) => {
                try {
                    const inputField = document.querySelector('.summary_question');
                    if (inputField) {
                        inputField.value = answer;
                        // 触发blur事件以保存答案
                        inputField.dispatchEvent(new Event('input'));
                        inputField.dispatchEvent(new Event('change'));
                        inputField.dispatchEvent(new Event('blur'));
                        console.log(`填空: ${answer}`);
                        return true;
                    } else {
                        throw new Error("未找到填空输入框");
                    }
                } catch (error) {
                    console.error("填空题处理失败:", error);
                    throw error;
                }
            }
        },
        
        // 回答当前题目
        answerCurrentQuestion: async () => {
            try {
                // 使用更新状态函数更新UI
                ui.updateAIAnswerStatus('waiting');
                
                // 获取AI答案
                const result = await ai.getAnswer();
                if (!result) {
                    throw new Error("获取答案失败");
                }
                
                const { answer, info } = result;
                
                // 根据题型调用相应的处理函数
                let success = false;
                
                switch (info.type) {
                    case '单选题':
                        success = exam.handlers.handleSingleChoice(answer, info.options);
                        break;
                    case '多选题':
                        success = await exam.handlers.handleMultipleChoice(answer, info.options);
                        break;
                    case '判断题':
                        success = exam.handlers.handleJudgement(answer, info.options);
                        break;
                    case '填空题':
                        success = exam.handlers.handleFillBlank(answer, info.options);
                        break;
                    default:
                        throw new Error(`未知题型: ${info.type}`);
                }
                
                if (!success) {
                    throw new Error(`答题失败: ${info.type}`);
                }
                
                // 显示答题结果
                ui.showMessage(`回答成功: ${answer}`, 'success');
                
                return true;
            } catch (error) {
                // 使用更新状态函数更新错误状态
                ui.updateAIAnswerStatus('error', error.message);
                
                ui.showMessage(`回答失败: ${error.message}`, 'error');
                console.error("回答题目失败:", error);
                return false;
            }
        }
    };
    
    // 课程功能
    const course = {
        // 添加学习时长 - 参数为要添加的秒数
        addStudyTime: (seconds) => {
            const rid = utils.getRid();
            const video = utils.getVideo();
    
            if (!video || !rid || seconds <= 0) return false;
    
            // 计算目标时间
            const currentTime = video.currentTime || 0;
            const duration = video.duration || 600;
            // 减少2秒，等待网址自动上报完成事件
            const targetTime = Math.min(duration-2, currentTime + seconds);
    
            // 发送请求并设置视频时间
            let success = false;
    
            $.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                url: "/jjfz/lesson/current_time",
                data: {
                    rid: rid,
                    time: targetTime,
                    _xsrf: $(":input[name='_xsrf']").val()
                },
                async: false,
                success: function(data) {
                    if (data && data.code === 1) {
                        try {
                            video.currentTime = targetTime;
                            success = true;
                        } catch (e) {
                            success = false;
                        }
                    } else {
                        success = false;
                    }
                },
                error: function() {
                    success = false;
                }
            });
    
            return success;
        },
    
        // 自动播放下一集
        playNextVideo: () => {
            const current = document.querySelector('.video_red1')?.closest('li');
            const next = current?.nextElementSibling;
    
            if (next && next.querySelector('a')) {
                next.querySelector('a').click();
                return true;
            } else {
                GM_notification({ text: '✅ 本章播放完成，跳转课程列表页~', timeout: 4000 });
                location.href = `${location.protocol}//${location.host}/jjfz/lesson`;
                return false;
            }
        },
    
        // 处理视频结束事件
        handleVideoEnded: () => {
            utils.clearAllTimers();
            if (config.course.autoNext) {
                // 等待2秒，确保视频结束事件触发
                setTimeout(course.playNextVideo, 2000);
            }
        },
    
        // 启动自动学习
        startAutoLearning: () => {
            if (!config.course.autoPlay || window.autoInterval) return;
    
            // 处理弹窗
            utils.handleDialogs();
    
            // 监听视频结束事件
            const video = utils.getVideo();
            if (video && !video.hasEndedListener) {
                video.addEventListener('ended', function() {
                    console.log("视频播放结束");
                    course.handleVideoEnded();
                });
                video.hasEndedListener = true;
            }
    
            // 启动定时器
            window.autoInterval = setInterval(() => {
                const video = utils.getVideo();
                if (!video) return;
    
                // 尝试点击播放按钮
                if (video.paused) {
                    const playButton = document.querySelector('.plyr__controls [data-plyr="play"], .plyr__play-large, [aria-label="播放"]');
                    if (playButton) {
                        playButton.click();
                    } else {
                        // 触发点击事件
                        video.dispatchEvent(new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true
                        }));
                    }
                    video.play();
                }
    
                // 自动处理弹窗
                utils.handleDialogs();
    
                // 更新界面
                ui.updateCourseStatus();
    
                // 检测视频是否接近结束但尚未触发ended事件
                if (video.currentTime > video.duration * 0.98 && !video.ended) {
                    video.currentTime = video.duration; // 强制跳到结尾触发ended事件
                }
            }, 1500);
        },
        
        // 停止自动学习
        stopAutoLearning: () => {
            utils.clearAllTimers();
            config.course.autoPlay = false;
            saveConfig();
            ui.showMessage('自动学习已停止', 'info');
        }
    };
    
    // UI界面
    const ui = {
        // 添加CSS样式
        addStyles: () => {
            GM_addStyle(`
                /* 主面板样式 */
                .helper-panel {
                    position: fixed;
                    top: 110px;
                    left: 10px;
                    background: #fff;
                    border-radius: 4px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                    z-index: 9999;
                    padding: 12px;
                    width: 400px;
                    font-size: 14px;
                    margin-top: -1px;
                    max-height: 80vh;
                    overflow-y: auto;
                }
                
                /* 面板标题 */
                .helper-panel h3 {
                    margin: 0 0 10px 0;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #eee;
                    text-align: center;
                    font-size: 16px;
                    color: #e61d1d;
                    font-weight: bold;
                }
                
                /* 标签页 */
                .helper-tabs {
                    display: flex;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }
                
                .helper-tab {
                    flex: 1;
                    text-align: center;
                    padding: 6px 0;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .helper-tab:hover {
                    background-color: #f5f5f5;
                }
                
                .helper-tab.active {
                    color: #2196F3;
                    border-bottom: 2px solid #2196F3;
                    font-weight: bold;
                }
                
                /* 内容区域 */
                .helper-content {
                    display: none;
                    padding: 5px 0;
                }
                
                .helper-content.active {
                    display: block;
                }
                
                /* 选项区域 */
                .helper-option {
                    margin-bottom: 12px;
                }
                
                .helper-option label {
                    display: block;
                    margin-bottom: 4px;
                    font-weight: bold;
                    font-size: 13px;
                }
                
                /* 复选框包装 */
                .checkbox-wrapper {
                    display: flex;
                    align-items: center;
                    margin: 5px 0;
                    padding: 2px 0;
                }
                
                .checkbox-wrapper input[type="checkbox"] {
                    width: auto;
                    margin: 0 6px 0 0;
                    cursor: pointer;
                }
                
                .checkbox-wrapper label {
                    margin: 0;
                    font-weight: normal;
                    cursor: pointer;
                }
                
                /* 表单元素 */
                .helper-panel select, 
                .helper-panel input, 
                .helper-panel button {
                    width: 100%;
                    padding: 6px 8px;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                    margin-bottom: 6px;
                    cursor: pointer;
                    font-size: 13px;
                }
                
                .helper-panel select, 
                .helper-panel input[type="text"], 
                .helper-panel input[type="password"],
                .helper-panel input[type="number"] {
                    cursor: auto;
                    transition: border-color 0.2s ease;
                }
                
                .helper-panel select:focus, 
                .helper-panel input[type="text"]:focus, 
                .helper-panel input[type="password"]:focus,
                .helper-panel input[type="number"]:focus {
                    border-color: #2196F3;
                    outline: none;
                }
                
                /* 按钮样式 */
                .helper-panel button {
                    background: #2196F3;
                    color: white;
                    border: none;
                    font-weight: bold;
                    transition: background 0.2s ease, transform 0.1s ease;
                }
                
                .helper-panel button:hover {
                    background: #1976D2;
                }
                
                .helper-panel button:active {
                    transform: scale(0.98);
                }
                
                .helper-panel button.stop {
                    background: #F44336;
                }
                
                .helper-panel button.stop:hover {
                    background: #D32F2F;
                }
                
                /* 信息显示区域 */
                .helper-status {
                    background: #f8f8f8;
                    padding: 8px 10px;
                    border-radius: 3px;
                    border: 1px solid #eee;
                    margin-top: 5px;
                }
                
                .helper-status p {
                    margin: 4px 0;
                    font-size: 13px;
                    display: flex;
                    justify-content: space-between;
                }
                
                .helper-status p span {
                    max-width: 280px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                /* 切换按钮 */
                .helper-toggle {
                    position: fixed;
                    top: 80px;
                    left: 10px;
                    background: #2196F3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 6px 12px;
                    cursor: pointer;
                    z-index: 10000;
                    font-weight: bold;
                    width: 80px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    transition: background 0.2s ease;
                }
                
                .helper-toggle:hover {
                    background: #1976D2;
                }
                
                /* 消息提示 */
                .helper-message {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    padding: 10px 15px;
                    border-radius: 4px;
                    z-index: 10001;
                    color: #fff;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    opacity: 0;
                    transform: translateY(-20px);
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                }
                
                .helper-message.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                /* 不同类型的消息颜色 */
                .helper-message.success {
                    background: #4CAF50;
                }
                
                .helper-message.error {
                    background: #F44336;
                }
                
                .helper-message.info {
                    background: #2196F3;
                }
                
                .helper-message.warning {
                    background: #FFC107;
                    color: #333;
                }
                
                /* 高亮答案 */
                #helper-ai-answer {
                    font-family: monospace;
                    letter-spacing: 0.5px;
                }
                
                /* 设置模块内排列 */
                .settings-row {
                    display: flex;
                    gap: 8px;
                    margin-top: 8px;
                }
                
                .settings-col {
                    flex: 1;
                }
                
                .settings-col label {
                    font-weight: normal !important;
                    font-size: 12px !important;
                    color: #555;
                }
            `);
        },
        
        // 显示消息
        showMessage: (text, type = 'info') => {
            // 移除现有的消息
            const oldMessage = document.querySelector('.helper-message');
            if (oldMessage) {
                oldMessage.remove();
            }
            
            // 创建新消息
            const message = document.createElement('div');
            message.className = `helper-message ${type}`;
            message.textContent = text;
            document.body.appendChild(message);
            
            // 显示动画
            setTimeout(() => {
                message.classList.add('show');
            }, 10);
            
            // 自动消失
            setTimeout(() => {
                message.classList.remove('show');
                setTimeout(() => {
                    message.remove();
                }, 300);
            }, 1500);
        },
        
        // 更新课程状态
        updateCourseStatus: () => {
            if (!isPlayPage) return;
            
            const video = utils.getVideo();
            if (!video) return;
            
            // 当前视频标题
            const videoTitle = document.querySelector('.video_red1 a')?.textContent.trim() || "未知";
            
            // 计算进度 - 使用与原脚本相同的方式
            const total = document.querySelectorAll('.video_lists ul li').length;
            const current = Array.from(document.querySelectorAll('.video_lists ul li')).findIndex(li => li.classList.contains('video_red1')) + 1;
            
            // 更新到UI
            const videoTitleEl = document.querySelector('#helper-current-video');
            const progressEl = document.querySelector('#helper-video-progress');
            
            if (videoTitleEl) videoTitleEl.textContent = videoTitle;
            if (progressEl) progressEl.textContent = `${current}/${total}`;
            
            // 记录日志便于调试
            console.log(`学习进度: ${current}/${total}`);
        },
        
        // 更新问题状态(考试模式)
        updateExamStatus: () => {
            if (!isExamPage) return;
            
            const info = utils.getQuestionInfo();
            if (!info) return;
            
            // 检查题目是否变化
            const currentQuestionId = info.id;
            if (window.lastQuestionId !== currentQuestionId) {
                // 题目变化了，重置回答
                ui.updateAIAnswerStatus('reset');
                window.lastQuestionId = currentQuestionId;
            }
            
            // 更新到UI
            const currentQuestionEl = document.querySelector('#helper-current-question');
            const questionTypeEl = document.querySelector('#helper-question-type');
            
            if (currentQuestionEl) currentQuestionEl.textContent = info.title?.substring(0, 30) + '...';
            if (questionTypeEl) questionTypeEl.textContent = info.type;
        },
        
        // 创建面板
        createPanel: () => {
            // 创建切换按钮
            const toggleButton = document.createElement('button');
            toggleButton.className = 'helper-toggle';
            toggleButton.textContent = config.ui.panelExpanded ? '收起' : '展开';
            toggleButton.onclick = function() {
                const panel = document.querySelector('.helper-panel');
                config.ui.panelExpanded = !config.ui.panelExpanded;
                panel.style.display = config.ui.panelExpanded ? 'block' : 'none';
                this.textContent = config.ui.panelExpanded ? '收起' : '展开';
                saveConfig();
            };
            document.body.appendChild(toggleButton);
            
            // 创建面板容器
            const panel = document.createElement('div');
            panel.className = 'helper-panel';
            panel.style.display = config.ui.panelExpanded ? 'block' : 'none';
            document.body.appendChild(panel);
            
            // 面板标题
            const title = document.createElement('h3');
            title.textContent = '在线培训助手';
            panel.appendChild(title);
            
            // 创建标签页
            const tabs = document.createElement('div');
            tabs.className = 'helper-tabs';
            panel.appendChild(tabs);
            
            // 根据页面类型添加对应标签
            // 课程标签 - 仅在课程页面显示
            if (isPlayPage) {
                const courseTab = document.createElement('div');
                courseTab.className = `helper-tab ${config.ui.activeTab === 'course' ? 'active' : ''}`;
                courseTab.textContent = '课程';
                courseTab.onclick = function() {
                    if (config.ui.activeTab !== 'course') {
                        document.querySelectorAll('.helper-tab').forEach(tab => tab.classList.remove('active'));
                        document.querySelectorAll('.helper-content').forEach(content => content.classList.remove('active'));
                        this.classList.add('active');
                        document.querySelector('#helper-course-content').classList.add('active');
                        config.ui.activeTab = 'course';
                        saveConfig();
                    }
                };
                tabs.appendChild(courseTab);
                
                // 如果在课程页面，但活动标签不是课程，则自动设置为课程
                if (config.ui.activeTab !== 'course' && config.ui.activeTab !== 'settings') {
                    config.ui.activeTab = 'course';
                    saveConfig();
                }
            }
            
            // 考试标签 - 仅在考试页面显示
            if (isExamPage) {
                const examTab = document.createElement('div');
                examTab.className = `helper-tab ${config.ui.activeTab === 'exam' ? 'active' : ''}`;
                examTab.textContent = '考试';
                examTab.onclick = function() {
                    if (config.ui.activeTab !== 'exam') {
                        document.querySelectorAll('.helper-tab').forEach(tab => tab.classList.remove('active'));
                        document.querySelectorAll('.helper-content').forEach(content => content.classList.remove('active'));
                        this.classList.add('active');
                        document.querySelector('#helper-exam-content').classList.add('active');
                        config.ui.activeTab = 'exam';
                        saveConfig();
                    }
                };
                tabs.appendChild(examTab);
                
                // 如果在考试页面，但活动标签不是考试，则自动设置为考试
                if (config.ui.activeTab !== 'exam' && config.ui.activeTab !== 'settings') {
                    config.ui.activeTab = 'exam';
                    saveConfig();
                }
            }
            
            // 设置标签 - 始终显示
            const settingsTab = document.createElement('div');
            settingsTab.className = `helper-tab ${config.ui.activeTab === 'settings' ? 'active' : ''}`;
            settingsTab.textContent = '设置';
            settingsTab.onclick = function() {
                if (config.ui.activeTab !== 'settings') {
                    document.querySelectorAll('.helper-tab').forEach(tab => tab.classList.remove('active'));
                    document.querySelectorAll('.helper-content').forEach(content => content.classList.remove('active'));
                    this.classList.add('active');
                    document.querySelector('#helper-settings-content').classList.add('active');
                    config.ui.activeTab = 'settings';
                    saveConfig();
                }
            };
            tabs.appendChild(settingsTab);
            
            // 创建内容区域
            
            // 1. 课程内容 - 仅在课程页面创建
            if (isPlayPage) {
                const courseContent = document.createElement('div');
                courseContent.id = 'helper-course-content';
                courseContent.className = `helper-content ${config.ui.activeTab === 'course' ? 'active' : ''}`;
                panel.appendChild(courseContent);
                
                // 自动学习开关
                const autoLearningOption = document.createElement('div');
                autoLearningOption.className = 'helper-option';
                autoLearningOption.innerHTML = `
                    <button id="helper-toggle-auto" class="${config.course.autoPlay ? 'stop' : ''}">${config.course.autoPlay ? '⏸️ 暂停刷课' : '▶️ 开始刷课'}</button>
                `;
                courseContent.appendChild(autoLearningOption);
                
                // 快进控制
                const jumpOption = document.createElement('div');
                jumpOption.className = 'helper-option';
                jumpOption.innerHTML = `
                    <label>跳转控制</label>
                    <div style="display:flex;gap:5px;">
                        <input type="number" id="helper-jump-time" value="30" min="1" max="3600" style="flex:2;">
                        <button id="helper-jump-btn" style="flex:1;">快进(秒)⏩</button>
                    </div>
                `;
                courseContent.appendChild(jumpOption);
                
                // 课程状态
                const courseStatus = document.createElement('div');
                courseStatus.className = 'helper-status';
                courseStatus.innerHTML = `
                    <p>当前视频: <span id="helper-current-video">获取中...</span></p>
                    <p>学习进度: <span id="helper-video-progress">0/0</span></p>
                `;
                courseContent.appendChild(courseStatus);
            }
            
            // 2. 考试内容 - 仅在考试页面创建
            if (isExamPage) {
                const examContent = document.createElement('div');
                examContent.id = 'helper-exam-content';
                examContent.className = `helper-content ${config.ui.activeTab === 'exam' ? 'active' : ''}`;
                panel.appendChild(examContent);
                
                // 搜题和选择答案按钮
                const examButtonsOption = document.createElement('div');
                examButtonsOption.className = 'helper-option';
                examButtonsOption.innerHTML = `
                    <button id="helper-manual-answer">🤖 搜索并选择答案</button>
                `;
                examContent.appendChild(examButtonsOption);
                
                // 考试状态
                const examStatus = document.createElement('div');
                examStatus.className = 'helper-status';
                examStatus.innerHTML = `
                    <p>当前题目: <span id="helper-current-question">等待...</span></p>
                    <p>题目类型: <span id="helper-question-type">-</span></p>
                    <p>模型回答: <span id="helper-ai-answer">-</span></p>
                `;
                examContent.appendChild(examStatus);
            }
            
            // 3. 设置内容 - 总是创建
            const settingsContent = document.createElement('div');
            settingsContent.id = 'helper-settings-content';
            settingsContent.className = `helper-content ${config.ui.activeTab === 'settings' ? 'active' : ''}`;
            panel.appendChild(settingsContent);
            
            // AI设置
            const aiSettingsOption = document.createElement('div');
            aiSettingsOption.className = 'helper-option';
            aiSettingsOption.innerHTML = `
                <label>AI接口设置</label>
                <label style="font-weight:normal;margin-top:5px;font-size:12px;">接口URL:</label>
                <input type="text" id="helper-base-url" placeholder="完整API地址" value="${config.ai.modelUrl || ''}">
                
                <label style="font-weight:normal;margin-top:5px;font-size:12px;">模型名称:</label>
                <input type="text" id="helper-model-name" placeholder="如: gpt-4" value="${config.ai.modelName || ''}">
                
                <label style="font-weight:normal;margin-top:5px;font-size:12px;">API密钥:</label>
                <input type="password" id="helper-api-key" placeholder="API Key" value="${config.ai.apiKey || ''}">
                
                <div class="settings-row">
                    <div class="settings-col">
                        <label>温度:</label>
                        <input type="number" id="helper-temperature" value="${config.ai.temperature}" min="0" max="1" step="0.1">
                    </div>
                    <div class="settings-col">
                        <label>Token:</label>
                        <input type="number" id="helper-max-tokens" value="${config.ai.maxTokens}" min="100" max="8000" step="100">
                    </div>
                    <div class="settings-col">
                        <label>超时(ms):</label>
                        <input type="number" id="helper-api-timeout" value="${config.ai.apiTimeout}" min="5000" max="120000" step="1000">
                    </div>
                </div>
            `;
            settingsContent.appendChild(aiSettingsOption);
            
            // 保存设置按钮
            const saveSettingsOption = document.createElement('div');
            saveSettingsOption.className = 'helper-option';
            saveSettingsOption.innerHTML = `
                <button id="helper-save-settings">💾 保存设置</button>
            `;
            settingsContent.appendChild(saveSettingsOption);
        },
        
        // 初始化事件监听 - 根据页面类型添加对应事件
        setupEventListeners: () => {
            // 课程页面事件 - 仅在课程页面添加
            if (isPlayPage) {
                // 切换自动学习按钮
                document.getElementById('helper-toggle-auto')?.addEventListener('click', function() {
                    if (config.course.autoPlay) {
                        course.stopAutoLearning();
                        this.textContent = '▶️ 开始刷课';
                        this.classList.remove('stop');
                    } else {
                        config.course.autoPlay = true;
                        saveConfig();
                        course.startAutoLearning();
                        this.textContent = '⏸️ 暂停刷课';
                        this.classList.add('stop');
                    }
                });
                
                // 快进按钮
                document.getElementById('helper-jump-btn')?.addEventListener('click', function() {
                    const seconds = parseInt(document.getElementById('helper-jump-time')?.value) || 30;
                    if (course.addStudyTime(seconds)) {
                        ui.showMessage(`快进${seconds}秒成功`, 'success');
                    } else {
                        ui.showMessage('快进失败，请检查视频状态', 'error');
                    }
                });
            }
            
            // 考试页面事件 - 仅在考试页面添加
            if (isExamPage) {
                // 搜题并选择答案按钮
                document.getElementById('helper-manual-answer')?.addEventListener('click', function() {
                    exam.answerCurrentQuestion();
                });
            }
            
            // 设置页面事件 - 总是添加
            // 保存设置按钮
            document.getElementById('helper-save-settings')?.addEventListener('click', function() {
                try {
                    // 获取设置值
                    const baseUrl = document.getElementById('helper-base-url')?.value || '';
                    const modelName = document.getElementById('helper-model-name')?.value || '';
                    const apiKey = document.getElementById('helper-api-key')?.value || '';
                    const temperature = parseFloat(document.getElementById('helper-temperature')?.value) || 0.7;
                    const maxTokens = parseInt(document.getElementById('helper-max-tokens')?.value) || 500;
                    const apiTimeout = parseInt(document.getElementById('helper-api-timeout')?.value) || 30000;
                    
                    // 更新配置
                    config.ai.modelUrl = baseUrl;
                    config.ai.modelName = modelName;
                    config.ai.apiKey = apiKey;
                    config.ai.temperature = temperature;
                    config.ai.maxTokens = maxTokens;
                    config.ai.apiTimeout = apiTimeout;
                    
                    // 保存设置
                    if (saveConfig()) {
                        ui.showMessage('设置已保存', 'success');
                    } else {
                        ui.showMessage('设置保存失败', 'error');
                    }
                } catch (error) {
                    ui.showMessage(`设置保存出错: ${error.message}`, 'error');
                    console.error('保存设置错误:', error);
                }
            });
        },
        
        // 更新AI回答状态
        updateAIAnswerStatus: (status, answer = '', isError = false) => {
            const aiAnswerEl = document.querySelector('#helper-ai-answer');
            if (!aiAnswerEl) return;
            
            // 清除之前的样式
            aiAnswerEl.style.color = '';
            aiAnswerEl.style.fontWeight = 'normal';
            
            switch (status) {
                case 'waiting':
                    aiAnswerEl.textContent = "获取中...";
                    aiAnswerEl.style.color = "#2196F3";
                    break;
                    
                case 'success':
                    aiAnswerEl.textContent = answer || "获取成功";
                    aiAnswerEl.style.color = "#e61d1d";
                    aiAnswerEl.style.fontWeight = "bold";
                    break;
                    
                case 'error':
                    aiAnswerEl.textContent = answer ? `错误: ${answer}` : "获取失败";
                    aiAnswerEl.style.color = "#F44336";
                    break;
                    
                case 'reset':
                    aiAnswerEl.textContent = "-";
                    break;
                    
                default:
                    aiAnswerEl.textContent = answer || "-";
                    if (isError) {
                        aiAnswerEl.style.color = "#F44336";
                    }
            }
        }
    };
    
    // 初始化脚本
    function init() {
        // 添加样式
        ui.addStyles();
        
        // 防止页面监测
        utils.preventDetection();
        
        // 创建UI界面
        ui.createPanel();
        
        // 设置事件监听
        ui.setupEventListeners();
        
        // 根据页面类型初始化不同功能
        if (isPlayPage) {
            // 课程页面，检查是否要自动开始学习
            if (config.course.autoPlay) {
                setTimeout(() => {
                    course.startAutoLearning();
                }, 1000);
            }
            
            // 定期更新课程状态
            setInterval(() => {
                ui.updateCourseStatus();
            }, 1000);
        } else if (isExamPage) {
            // 考试页面
            
            // 定期更新考试状态
            setInterval(() => {
                ui.updateExamStatus();
            }, 1000);
            
            // 绑定答题卡点击事件
            setTimeout(() => {
                // 为答题卡中的题目添加点击事件
                document.querySelectorAll('.exam_ul li').forEach(li => {
                    li.addEventListener('click', () => {
                        // 题目切换时重置答案显示
                        setTimeout(() => {
                            ui.updateAIAnswerStatus('reset');
                        }, 200);
                    });
                });
                
                // 监听下一题和上一题按钮
                const nextBtn = document.querySelector('#next_question');
                const prevBtn = document.querySelector('#prev_question');
                
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => {
                        ui.updateAIAnswerStatus('reset');
                    });
                }
                
                if (prevBtn) {
                    prevBtn.addEventListener('click', () => {
                        ui.updateAIAnswerStatus('reset');
                    });
                }
            }, 2000); // 等待页面元素完全加载
        }
    }
    
    init();
})(); 