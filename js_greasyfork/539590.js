// ==UserScript==
// @name         ZTplus自动答题助手（测试题专用）
// @namespace    https://greasyfork.org/users/100156-handsomedruid
// @version      1.1
// @description  自动从题库查询答案并选择（支持判断题、单选题、多选题的批量处理）
// @author       Moeary & handsomeDruid
// @license      GPL-3.0
// @match        *://www.ztplus.cn/pc/index.html*
// @match        *://ztplus.cn/pc/index.html*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/539590/ZTplus%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B5%8B%E8%AF%95%E9%A2%98%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539590/ZTplus%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B5%8B%E8%AF%95%E9%A2%98%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        SERVER_URL: 'https://tgwskk.ccuqso.workers.dev/query', //请修改这里
        ANSWER_DELAY_MIN: 200,  // 最小答题间隔(毫秒)
        ANSWER_DELAY_MAX: 400,  // 最大答题间隔(毫秒)
        RETRY_DELAY: 100,       // 重试间隔
        MAX_RETRIES: 3           // 最大重试次数
    };

    let isRunning = false;
    let currentQuestionIndex = 0;
    let totalQuestions = 0;
    let answeredCount = 0;
    let correctCount = 0;

    // 创建控制面板
    function createControlPanel() {
        if (document.getElementById('test-auto-answer-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'test-auto-answer-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #007bff;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        panel.innerHTML = `
            <div style="font-weight: bold; font-size: 16px; color: #007bff; margin-bottom: 10px; text-align: center;">
                🎯 测试题自动答题助手
            </div>
            <div id="panel-status" style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-radius: 5px; font-size: 12px;">
                状态: 等待开始...
            </div>
            <div id="panel-progress" style="margin-bottom: 10px; font-size: 12px;">
                进度: 0/0 | 正确: 0
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                <button id="start-btn" style="flex: 1; padding: 8px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                    开始答题
                </button>
                <button id="stop-btn" style="flex: 1; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;" disabled>
                    停止答题
                </button>
            </div>
            <div style="font-size: 11px; color: #666; text-align: center;">
                自动识别页面题目并查询题库答案
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('start-btn').onclick = startAutoAnswer;
        document.getElementById('stop-btn').onclick = stopAutoAnswer;
    }

    // 更新面板状态
    function updatePanelStatus(status, progress = null) {
        const statusEl = document.getElementById('panel-status');
        const progressEl = document.getElementById('panel-progress');
        
        if (statusEl) statusEl.innerHTML = `状态: ${status}`;
        if (progressEl && progress) {
            progressEl.innerHTML = `进度: ${progress.current}/${progress.total} | 正确: ${progress.correct}`;
        }
    }    // 获取页面中的所有题目
    function getAllQuestions() {
        const questions = [];
        const questionElements = document.querySelectorAll('.sub-content[data-v-a98933d6]');
        
        console.log(`找到 ${questionElements.length} 个题目元素`);
        
        questionElements.forEach((element, index) => {
            try {
                // 提取题目文本
                const questionP = element.querySelector('p[id^="question_"]');
                if (!questionP) return;
                
                let questionText = questionP.textContent.trim();
                // 移除题号 (如 "1. ")
                questionText = questionText.replace(/^\d+\.\s*/, '');
                
                // 检测题目类型并提取选项
                const radioLabels = element.querySelectorAll('.el-radio__label');
                const checkboxLabels = element.querySelectorAll('.el-checkbox__label');
                
                let questionType = 'unknown';
                let options = [];
                let inputs = [];
                
                if (radioLabels.length > 0) {
                    // 单选题 (判断题、单选题)
                    questionType = 'radio';
                    radioLabels.forEach(label => {
                        options.push(label.textContent.trim());
                    });
                    inputs = Array.from(element.querySelectorAll('input[type="radio"]'));
                } else if (checkboxLabels.length > 0) {
                    // 多选题
                    questionType = 'checkbox';
                    checkboxLabels.forEach(label => {
                        options.push(label.textContent.trim());
                    });
                    inputs = Array.from(element.querySelectorAll('input[type="checkbox"]'));
                }
                
                questions.push({
                    index: index + 1,
                    element: element,
                    questionText: questionText,
                    questionType: questionType,
                    options: options,
                    inputs: inputs,
                    answered: false
                });
                
                console.log(`题目 ${index + 1} (${questionType}): ${questionText.substring(0, 50)}...`);
            } catch (error) {
                console.error(`解析题目 ${index + 1} 时出错:`, error);
            }
        });
        
        return questions;
    }

    // 查询题库服务器
    function queryQuestionBank(questionText) {
        return new Promise((resolve) => {
            const url = `${CONFIG.SERVER_URL}?term=${encodeURIComponent(questionText)}`;
            
            console.log(`查询题库: ${questionText.substring(0, 50)}...`);
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 5000,
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            if (data && data.length > 0) {
                                const answer = data[0].correct_answer;
                                console.log(`找到答案: ${answer}`);
                                resolve(answer);
                            } else {
                                console.log('题库中未找到答案');
                                resolve(null);
                            }
                        } else {
                            console.error('服务器响应错误:', response.status);
                            resolve(null);
                        }
                    } catch (error) {
                        console.error('解析响应数据失败:', error);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error('请求题库失败:', error);
                    resolve(null);
                },
                ontimeout: function() {
                    console.error('请求题库超时');
                    resolve(null);
                }
            });
        });
    }    // 选择答案
    function selectAnswer(question, answer) {
        try {
            if (question.questionType === 'radio') {
                return selectRadioAnswer(question, answer);
            } else if (question.questionType === 'checkbox') {
                return selectCheckboxAnswer(question, answer);
            } else {
                console.warn(`未知题目类型: ${question.questionType}`);
                return false;
            }
        } catch (error) {
            console.error(`选择答案时出错:`, error);
            return false;
        }
    }

    // 选择单选题答案
    function selectRadioAnswer(question, answer) {
        let selectedInput = null;
        
        if (answer === 'A' || answer === '正确') {
            selectedInput = question.inputs[0];
        } else if (answer === 'B' || answer === '错误') {
            selectedInput = question.inputs[1];
        } else if (answer === 'C') {
            selectedInput = question.inputs[2];
        } else if (answer === 'D') {
            selectedInput = question.inputs[3];
        } else {
            // 尝试通过选项文本匹配
            for (let i = 0; i < question.options.length; i++) {
                if (question.options[i].includes(answer) || answer.includes(question.options[i])) {
                    selectedInput = question.inputs[i];
                    break;
                }
            }
        }
        
        // 如果没找到匹配的答案，默认选择A
        if (!selectedInput) {
            console.log('未找到匹配答案，默认选择A');
            selectedInput = question.inputs[0];
        }
        
        if (selectedInput) {
            // 模拟点击
            selectedInput.click();
            
            // 触发change事件
            const event = new Event('change', { bubbles: true });
            selectedInput.dispatchEvent(event);
            
            question.answered = true;
            console.log(`已选择单选答案: ${answer} (题目 ${question.index})`);
            return true;
        }
        
        return false;
    }

    // 选择多选题答案
    function selectCheckboxAnswer(question, answer) {
        // 解析多选答案，如 "ABC", "ABCD", "BD" 等
        const selectedOptions = [];
        
        // 如果答案包含多个字母，解析每个字母
        if (answer && answer.length > 1 && /^[A-Z]+$/.test(answer)) {
            for (let char of answer) {
                selectedOptions.push(char);
            }
        } else if (answer === 'A' || answer === 'B' || answer === 'C' || answer === 'D') {
            selectedOptions.push(answer);
        } else {
            // 如果无法解析，默认选择A
            console.log('无法解析多选答案，默认选择A');
            selectedOptions.push('A');
        }
        
        console.log(`解析多选答案: ${answer} -> ${selectedOptions.join(',')}`);
        
        let successCount = 0;
        
        // 选择对应的选项
        selectedOptions.forEach(option => {
            let optionIndex = -1;
            
            switch(option) {
                case 'A': optionIndex = 0; break;
                case 'B': optionIndex = 1; break;
                case 'C': optionIndex = 2; break;
                case 'D': optionIndex = 3; break;
                default: 
                    console.warn(`未识别的选项: ${option}`);
                    return;
            }
            
            if (optionIndex >= 0 && optionIndex < question.inputs.length) {
                const input = question.inputs[optionIndex];
                if (input && !input.checked) {
                    // 模拟点击复选框
                    input.click();
                    
                    // 触发change事件
                    const event = new Event('change', { bubbles: true });
                    input.dispatchEvent(event);
                    
                    successCount++;
                    console.log(`已选择多选选项: ${option} (索引 ${optionIndex})`);
                } else if (input && input.checked) {
                    console.log(`选项 ${option} 已经被选中`);
                    successCount++;
                }
            } else {
                console.warn(`选项索引超出范围: ${option} (索引 ${optionIndex})`);
            }
        });
        
        if (successCount > 0) {
            question.answered = true;
            console.log(`已完成多选题答题: ${answer} (题目 ${question.index}), 成功选择 ${successCount} 个选项`);
            return true;
        }
        
        return false;
    }

    // 随机延迟函数
    function randomDelay() {
        const delay = Math.random() * (CONFIG.ANSWER_DELAY_MAX - CONFIG.ANSWER_DELAY_MIN) + CONFIG.ANSWER_DELAY_MIN;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // 开始自动答题
    async function startAutoAnswer() {
        if (isRunning) return;
        
        isRunning = true;
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
        
        updatePanelStatus('正在扫描页面题目...');
        
        const questions = getAllQuestions();
        totalQuestions = questions.length;
        currentQuestionIndex = 0;
        answeredCount = 0;
        correctCount = 0;
        
        if (totalQuestions === 0) {
            updatePanelStatus('未找到题目，请确认页面已完全加载');
            stopAutoAnswer();
            return;
        }
        
        updatePanelStatus(`找到 ${totalQuestions} 个题目，开始答题...`);
        
        for (let i = 0; i < questions.length && isRunning; i++) {
            const question = questions[i];
            currentQuestionIndex = i + 1;
            
            updatePanelStatus(`正在处理第 ${currentQuestionIndex} 题...`, {
                current: currentQuestionIndex,
                total: totalQuestions,
                correct: correctCount
            });
            
            // 滚动到当前题目
            question.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            await randomDelay();
            
            if (!isRunning) break;
            
            // 查询答案
            const answer = await queryQuestionBank(question.questionText);
            
            if (!isRunning) break;
            
            // 选择答案
            if (selectAnswer(question, answer)) {
                answeredCount++;
                if (answer) correctCount++;
                
                updatePanelStatus(`已完成第 ${currentQuestionIndex} 题`, {
                    current: currentQuestionIndex,
                    total: totalQuestions,
                    correct: correctCount
                });
            } else {
                updatePanelStatus(`第 ${currentQuestionIndex} 题选择失败`, {
                    current: currentQuestionIndex,
                    total: totalQuestions,
                    correct: correctCount
                });
            }
            
            // 题目间隔
            if (i < questions.length - 1) {
                await randomDelay();
            }
        }
        
        if (isRunning) {
            updatePanelStatus(`答题完成！共 ${totalQuestions} 题，已答 ${answeredCount} 题`, {
                current: totalQuestions,
                total: totalQuestions,
                correct: correctCount
            });
        }
        
        stopAutoAnswer();
    }

    // 停止自动答题
    function stopAutoAnswer() {
        isRunning = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        
        if (currentQuestionIndex > 0) {
            updatePanelStatus('已停止答题');
        }
    }

    // 检查是否为测试页面
    function isTestPage() {
        return window.location.href.includes('/paper/testing/') || 
               document.querySelector('.sub-content[data-v-a98933d6]');
    }

    // 初始化
    function init() {
        if (!isTestPage()) {
            console.log('当前不是测试页面，脚本不会运行');
            return;
        }
        
        console.log('检测到测试页面，初始化自动答题助手...');
        
        // 等待页面完全加载
        setTimeout(() => {
            createControlPanel();
            updatePanelStatus('准备就绪，点击开始答题');
        }, 2000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听 hash 变化，适配 SPA 路由切换
    let lastUrl = location.href;
    function checkUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            init();
        }
    }
    setInterval(checkUrlChange, 500); // 每 500ms 检查一次 URL

    window.addEventListener('hashchange', init, false);
})();
