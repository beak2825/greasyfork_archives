// ==UserScript==
// @name         Survey Radio Button Clicker 
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically click specific radio buttons in survey with better DOM detection
// @author       Your name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521574/Survey%20Radio%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/521574/Survey%20Radio%20Button%20Clicker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建状态提示元素
    function createStatusIndicator() {
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 5px;
            z-index: 9999;
            transition: opacity 0.5s;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
        `;
        statusDiv.id = 'radioButtonStatus';
        document.body.appendChild(statusDiv);
        return statusDiv;
    }

    // 显示状态消息
    function showStatus(message, isSuccess = true) {
        const statusDiv = document.getElementById('radioButtonStatus') || createStatusIndicator();
        statusDiv.style.opacity = '1';
        statusDiv.style.backgroundColor = isSuccess ? 'rgba(0, 128, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
        statusDiv.textContent = message;

        setTimeout(() => {
            statusDiv.style.opacity = '0';
        }, 5000);
    }

    // 更灵活的元素查找函数
    function findRadioButtons() {
        const radioButtons = [];
        
        // 方法1: 查找所有包含评分选项的容器
        const questionContainers = document.querySelectorAll('div[class*="Question"], div[class*="question"], .wjtxQuestionContainer');
        
        if (questionContainers.length > 0) {
            questionContainers.forEach((container, index) => {
                // 在每个问题容器中查找第一个单选按钮
                const firstRadio = container.querySelector('.jqx-radiobutton, input[type="radio"], .ant-radio-wrapper');
                if (firstRadio) {
                    radioButtons.push({
                        element: firstRadio,
                        questionIndex: index + 1,
                        container: container
                    });
                }
            });
        }
        
        // 方法2: 如果方法1失败，尝试直接查找所有单选按钮组
        if (radioButtons.length === 0) {
            const allRadios = document.querySelectorAll('.jqx-radiobutton, input[type="radio"], .ant-radio-wrapper');
            const processedGroups = new Set();
            
            allRadios.forEach((radio, index) => {
                const name = radio.getAttribute('name') || radio.closest('[data-question]')?.getAttribute('data-question') || `group_${Math.floor(index / 5)}`;
                
                if (!processedGroups.has(name)) {
                    processedGroups.add(name);
                    radioButtons.push({
                        element: radio,
                        questionIndex: processedGroups.size,
                        container: radio.closest('div')
                    });
                }
            });
        }
        
        return radioButtons;
    }

    // 改进的点击函数
    function clickRadioButton(radioInfo) {
        try {
            const { element, questionIndex } = radioInfo;
            
            // 检查是否已经被选中
            if (element.getAttribute('aria-checked') === 'true' || 
                element.checked || 
                element.classList.contains('ant-radio-checked') ||
                element.closest('.ant-radio-wrapper-checked')) {
                console.log(`Question ${questionIndex} already selected`);
                return false;
            }

            // 滚动到元素位置，确保可见
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 等待滚动完成
            setTimeout(() => {
                // 多种点击方式尝试
                const clickMethods = [
                    () => element.click(),
                    () => {
                        const event = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        element.dispatchEvent(event);
                    },
                    () => {
                        if (element.tagName === 'INPUT') {
                            element.checked = true;
                            element.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                ];

                for (let method of clickMethods) {
                    try {
                        method();
                        // 验证点击是否成功
                        setTimeout(() => {
                            if (element.getAttribute('aria-checked') === 'true' || 
                                element.checked || 
                                element.classList.contains('ant-radio-checked') ||
                                element.closest('.ant-radio-wrapper-checked')) {
                                console.log(`Successfully clicked question ${questionIndex}`);
                                return true;
                            }
                        }, 100);
                        break;
                    } catch (error) {
                        console.warn(`Click method failed for question ${questionIndex}:`, error);
                        continue;
                    }
                }
            }, 200);

            return true;
        } catch (error) {
            console.error('Error clicking radio button:', error);
            return false;
        }
    }

    // 主处理函数
    async function processAllQuestions() {
        showStatus('正在查找评教问题...', true);
        
        // 等待页面完全加载
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 检查是否在iframe中
        let targetDocument = document;
        const iframes = document.querySelectorAll('iframe');
        
        for (let iframe of iframes) {
            try {
                if (iframe.contentDocument && iframe.contentDocument.querySelector('.jqx-radiobutton, .wjtxQuestionContainer')) {
                    targetDocument = iframe.contentDocument;
                    console.log('Found content in iframe');
                    break;
                }
            } catch (e) {
                // 跨域iframe，忽略
                continue;
            }
        }
        
        // 在目标文档中查找单选按钮
        const radioButtons = findRadioButtons.call({ document: targetDocument });
        
        if (radioButtons.length === 0) {
            showStatus('未找到评教问题或已全部完成', false);
            return;
        }

        let clickedCount = 0;
        let totalFound = radioButtons.length;
        let failedQuestions = [];

        showStatus(`找到 ${totalFound} 个问题，开始自动选择...`, true);

        // 逐个处理问题，添加延迟
        for (let i = 0; i < radioButtons.length; i++) {
            const radioInfo = radioButtons[i];
            
            // 添加随机延迟
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
            
            try {
                if (clickRadioButton(radioInfo)) {
                    clickedCount++;
                } else {
                    failedQuestions.push(radioInfo.questionIndex);
                }
            } catch (error) {
                console.error(`Error processing question ${radioInfo.questionIndex}:`, error);
                failedQuestions.push(radioInfo.questionIndex);
            }
        }

        // 显示最终结果
        const successRate = Math.round((clickedCount / totalFound) * 100);
        let statusMessage = `完成！找到 ${totalFound} 个问题，成功选择 ${clickedCount} 个 (${successRate}%)`;
        
        if (failedQuestions.length > 0) {
            statusMessage += `\n失败的问题: ${failedQuestions.join(', ')}`;
        }
        
        showStatus(statusMessage, failedQuestions.length === 0);
        
        return { total: totalFound, clicked: clickedCount, failed: failedQuestions };
    }

    // 等待页面加载完成
    function waitForPageLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initScript);
        } else {
            initScript();
        }
    }

    // 初始化脚本
    function initScript() {
        // 添加控制按钮
        const controlButton = document.createElement('button');
        controlButton.textContent = '自动选择满意度';
        controlButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        
        controlButton.onclick = processAllQuestions;
        document.body.appendChild(controlButton);

        // 添加快捷键支持
        document.addEventListener('keydown', function (e) {
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                processAllQuestions();
            }
        });

        // 自动执行（延迟更长时间确保页面完全加载）
        setTimeout(() => {
            // 检查是否是评教页面
            if (document.querySelector('.jqx-radiobutton, .wjtxQuestionContainer') || 
                document.querySelector('iframe[src*="pjapp"]')) {
                processAllQuestions();
            }
        }, 3000);
    }

    // 启动脚本
    waitForPageLoad();
})();
