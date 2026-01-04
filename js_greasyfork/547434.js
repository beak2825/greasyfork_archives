// ==UserScript==
// @name         全自动山海|数字匹配与自动点击融合脚本 (iOS 兼容性修复版)
// @namespace    https://greasyfork.org/zh-CN/scripts/475586
// @description  融合了数字匹配检测与自动点击操作。当数字不匹配时，自动点击课程列表；当数字匹配时，自动点击下一个任务。同时保留原有的查询答案等功能。代码已重构并针对iOS兼容性进行优化。
// @version      3.1
// @license      GPL-3.0
// @author       山海不爱玩&MomoneChionoi (融合修改) & Gemini (修复优化)
// @match        https://weiban.mycourse.cn/*
// @match        https://mcwk.mycourse.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      117.72.179.172
// @downloadURL https://update.greasyfork.org/scripts/547434/%E5%85%A8%E8%87%AA%E5%8A%A8%E5%B1%B1%E6%B5%B7%7C%E6%95%B0%E5%AD%97%E5%8C%B9%E9%85%8D%E4%B8%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%9E%8D%E5%90%88%E8%84%9A%E6%9C%AC%20%28iOS%20%E5%85%BC%E5%AE%B9%E6%80%A7%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547434/%E5%85%A8%E8%87%AA%E5%8A%A8%E5%B1%B1%E6%B5%B7%7C%E6%95%B0%E5%AD%97%E5%8C%B9%E9%85%8D%E4%B8%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%9E%8D%E5%90%88%E8%84%9A%E6%9C%AC%20%28iOS%20%E5%85%BC%E5%AE%B9%E6%80%A7%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 辅助函数 (已重构，提高可读性) ---

    /**
     * FIX: 核心API请求函数，尝试使用HTTPS协议以兼容iOS
     * @param {string} url 请求地址
     * @param {object} options 请求选项
     * @returns {Promise<object>}
     */
    function makeApiRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const requestDetails = {
                method: options.method || 'GET',
                url: url,
                headers: options.headers || { 'Content-Type': 'application/json' },
                onload: function(response) {
                    try {
                        const responseData = JSON.parse(response.responseText);
                        if (response.status >= 200 && response.status < 300) {
                            resolve(responseData);
                        } else {
                            const error = new Error(`API请求失败，状态码: ${response.status}`);
                            error.response = response;
                            reject(error);
                        }
                    } catch (e) {
                        reject(new Error('解析响应数据失败'));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('请求超时'))
            };

            if (options.data) {
                requestDetails.data = JSON.stringify(options.data);
            }

            GM_xmlhttpRequest(requestDetails);
        });
    }

    /**
     * 创建一个带样式的DIV容器
     * @param {object} config 样式配置
     * @returns {HTMLDivElement}
     */
    function createStyledDiv(config) {
        const bar = document.createElement('div');
        bar.id = config.barId;
        bar.style.cssText = `
            position: relative; z-index: 1000; width: 100%; padding: 12px 20px;
            background-color: ${config.backgroundColor}; color: ${config.textColor};
            text-align: center; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            box-sizing: border-box; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;
        const style = document.createElement('style');
        style.innerHTML = `
            #${config.barId} a { color: #ffeb3b; text-decoration: underline; margin-left: 5px; }
            #${config.barId} a:hover { color: #fff; }
        `;
        document.head.appendChild(style);
        return bar;
    }

    /**
     * 显示顶部公告栏
     */
    async function displayAnnouncementBar() {
        const config = {
            targetSelector: '.page-WH',
            // FIX: 优先使用HTTPS，解决iOS混合内容拦截问题
            apiUrl: 'https://117.72.179.172:5252/notc.php',
            defaultContent: '脚本正常运行中',
            backgroundColor: '#333',
            textColor: '#fff',
            barId: 'my-custom-announcement-bar',
            timeout: 5000
        };
        const container = document.querySelector(config.targetSelector);
        if (!container) {
            console.warn(`公告栏容器未找到: ${config.targetSelector}`);
            return;
        }
        const announcementBar = createStyledDiv(config);
        announcementBar.innerHTML = config.defaultContent;
        container.prepend(announcementBar);
        try {
            const result = await makeApiRequest(config.apiUrl, { timeout: config.timeout });
            if (result.code === 1 && result.msg) {
                announcementBar.innerHTML = result.msg;
            }
        } catch (error) {
            console.error('获取公告内容失败:', error);
            announcementBar.innerHTML = '公告加载失败，可能网络或服务器异常。';
        }
    }

    /**
     * 设置“查询答案”按钮和结果面板
     */
    function setupAnswerQueryUI() {
        const queryButton = createStyledButton('🔍 查询答案', '#4285F4');
        const resultPanel = createResultPanel();
        document.body.appendChild(queryButton);
        document.body.appendChild(resultPanel);
        queryButton.addEventListener('click', function () {
            const questionDetails = getQuestionDetails();
            if (questionDetails) {
                fetchAnswer(questionDetails.questionType, questionDetails.questionText, resultPanel);
            } else {
                displayMessageInPanel('请在答题页面使用此功能', false, resultPanel);
            }
        });
    }

    function getQuestionDetails() {
        const typeElement = document.querySelector('.quest-category');
        const textElement = document.querySelector('.quest-stem');
        if (!typeElement || !textElement) {
            console.error('找不到问题类型或问题内容的元素');
            return null;
        }
        return {
            questionType: typeElement.innerText,
            questionText: textElement.innerText
        };
    }

    function fetchAnswer(type, text, panel) {
        displayMessageInPanel('查询中...', false, panel);
        // FIX: 优先使用HTTPS
        const apiUrl = `https://117.72.179.172:5252/query_answer.php?question=${encodeURIComponent(text)}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: (response) => processApiResponseAndFillAnswers(response, type, panel, text),
            onerror: (error) => displayApiError(error, panel),
        });
    }

    function processApiResponseAndFillAnswers(response, questionType, resultPanel, questionText) {
        try {
            const data = JSON.parse(response.responseText);
            if (data.code === 1 && data.answer && data.answer.length > 0) {
                const answers = data.answer;
                let statusMessage = '';
                if (questionType === '多选题' || questionType === '单选题') {
                    const optionElements = document.querySelectorAll('.quest-option-top');
                    let filledCount = 0;
                    answers.forEach(answerText => {
                        for (const optionEl of optionElements) {
                            if (optionEl.innerText.substring(2).trim() === answerText.trim()) {
                                optionEl.click();
                                filledCount++;
                                break;
                            }
                        }
                    });
                    statusMessage = filledCount === answers.length ? '已自动填写所有答案' : `找到${filledCount}个答案(共${answers.length}个)`;
                    if (filledCount === answers.length) {
                        const submitButton = Array.from(document.querySelectorAll('.mint-button-text')).find(b => b.textContent.includes('提交'));
                        if (submitButton) {
                            submitButton.click();
                            statusMessage += '并跳转';
                        }
                    }
                    displayMessageInPanel(`题目|${questionText}\n答案|${answers.join('、')}\n状态|${statusMessage}`, true, resultPanel);
                } else {
                    displayMessageInPanel(`题目|${questionText}\n答案|${answers.join('\n')}\n状态|${data.msg}`, true, resultPanel);
                }
            } else {
                displayMessageInPanel(`题目|${questionText}\n状态|${data.msg || '未查询到答案'}`, true, resultPanel);
            }
        } catch (e) {
            displayApiError('服务器返回数据格式错误', resultPanel);
        }
    }

    function setupAutoFinishButton() {
        const button = document.createElement('button');
        button.id = 'execute-finishWx-btn';
        button.innerHTML = '一键完成 (<span id="countdown-text">18</span>秒)';
        button.style.cssText = `
            position: fixed; bottom: 20px; left: 20px; z-index: 9999; width: auto; height: 36px;
            background-color: #cccccc; color: #666666; border: none; border-radius: 18px; cursor: not-allowed;
            font-size: 14px; font-weight: 500; outline: none; box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; padding: 0 16px;
        `;
        button.addEventListener('mouseover', function() { if (!this.disabled) { this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)'; this.style.transform = 'translateY(-1px)'; } });
        button.addEventListener('mouseout', function() { this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'; this.style.transform = 'none'; });
        button.addEventListener('mousedown', function() { if (!this.disabled) { this.style.transform = 'translateY(1px)'; this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; } });

        let countdown = 17;
        const countdownSpan = button.querySelector('#countdown-text');
        const countdownInterval = setInterval(() => {
            countdown--;
            countdownSpan.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                button.disabled = false;
                button.innerHTML = '🚀 一键完成';
                button.style.backgroundColor = '#4285F4';
                button.style.color = 'white';
                button.style.cursor = 'pointer';
                button.click();
                console.log("倒计时结束，自动点击'一键完成'按钮。");
            }
        }, 1000);

        button.addEventListener('click', handleFinishButtonClick);
        document.body.appendChild(button);
    }

    function handleFinishButtonClick() {
        try {
            if (typeof finishWxCourse === 'function') {
                console.log('正在执行 finishWxCourse() ...');
                finishWxCourse();
                console.log('finishWxCourse() 执行完成');
                setTimeout(() => {
                    const popupConfirmButton = document.querySelector('body > div.pop-jsv > div > div > a');
                    if (popupConfirmButton) {
                        popupConfirmButton.click();
                        console.log("600ms后点击了弹出框确认按钮。");
                    } else {
                        console.warn("执行finishWxCourse后未找到弹出框确认按钮。");
                    }
                }, 600);
            } else {
                console.error('当前页面中未找到 finishWxCourse 函数');
            }
        } catch (error) {
            console.error(`执行finishWxCourse函数时出错: ${error.message}`, error);
        }
    }

    function createStyledButton(text, color) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999; width: auto; height: 36px;
            background-color: ${color}; color: ${color === '#cccccc' ? '#666666' : 'white'}; border: none;
            border-radius: 18px; cursor: pointer; font-size: 14px; font-weight: 500; outline: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15); transition: all 0.3s ease; display: flex;
            align-items: center; justify-content: center; padding: 0 16px;
        `;
        button.onmouseover = function() { if (!this.disabled) { this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)'; this.style.transform = 'translateY(-1px)'; } };
        button.onmouseout = function() { this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'; this.style.transform = 'none'; };
        button.onmousedown = function() { if (!this.disabled) { this.style.transform = 'translateY(1px)'; this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; } };
        return button;
    }

    function createResultPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999; background-color: #fff; border: none;
            padding: 0; max-width: 320px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: none;
            border-radius: 12px; font-size: 14px; line-height: 1.5; overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        `;
        const header = document.createElement('div');
        header.style.cssText = `
            background-color: #4285F4; color: white; padding: 12px 16px; font-weight: 500;
            display: flex; justify-content: space-between; align-items: center;
        `;
        header.innerHTML = '<span>查询结果</span>';
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `cursor: pointer; font-size: 20px; line-height: 1; padding: 0 0 2px 10px;`;
        closeButton.onclick = function() { panel.style.display = 'none'; };
        header.appendChild(closeButton);
        panel.appendChild(header);
        const content = document.createElement('div');
        content.style.cssText = `padding: 16px; background-color: #fff;`;
        content.id = 'notification-content';
        panel.appendChild(content);
        return panel;
    }

    function displayMessageInPanel(message, isTableFormat, panel) {
        if (!panel) return;
        const contentArea = panel.querySelector('#notification-content');
        contentArea.innerHTML = '';
        if (isTableFormat) {
            const table = document.createElement('table');
            table.style.cssText = `width: 100%; border-collapse: separate; border-spacing: 0; margin: 0;`;
            const addRow = (key, value, isLast = false) => {
                const row = table.insertRow();
                const cell1 = row.insertCell(0);
                cell1.textContent = key;
                cell1.style.cssText = `padding: 8px 12px; font-weight: 500; color: #5F6368; white-space: nowrap; border-bottom: ${isLast ? 'none' : '1px solid #e0e0e0'};`;
                const cell2 = row.insertCell(1);
                cell2.textContent = value;
                cell2.style.cssText = `padding: 8px 12px; color: #202124; word-break: break-word; border-bottom: ${isLast ? 'none' : '1px solid #e0e0e0'};`;
            };
            const lines = message.split('\n');
            lines.forEach((line, index) => {
                const separatorIndex = line.indexOf('|');
                if (separatorIndex > -1) {
                    const key = line.substring(0, separatorIndex).trim();
                    const value = line.substring(separatorIndex + 1).trim();
                    addRow(key, value, index === lines.length - 1);
                }
            });
            contentArea.appendChild(table);
        } else {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = message;
            messageDiv.style.cssText = `padding: 12px; color: #5F6368; text-align: center;`;
            contentArea.appendChild(messageDiv);
        }
        panel.style.display = 'block';
    }

    function displayApiError(error, panel) {
        console.error("API Error:", error);
        const errorMessage = `错误类型|连接失败\n详细信息|无法连接到答案服务器。这可能是由于iOS的安全限制(HTTP请求)或服务器问题。\n建议|请检查网络连接或稍后再试。`;
        displayMessageInPanel(errorMessage, true, panel);
    }

    // --- 融合后的核心逻辑 ---

    const mismatchClickTargets = [
        '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)',
        '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)',
        '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)',
        '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(4) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)',
        '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(5) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)'
    ];

    function clickElement(selector, logPrefix = '已点击') {
        const el = document.querySelector(selector);
        if (el) {
            el.click();
            console.log(`%c${logPrefix}: ${selector}`, 'color: #FF9800; font-weight: bold');
        } else {
            console.log(`%c点击失败: 元素未找到 -> ${selector}`, 'color: #f44336; font-weight: bold');
        }
    }

    /**
     * 核心检测函数
     */
    function performChecks() {
        try {
            const now = new Date().toLocaleTimeString();
            console.log(`\n%c[${now}] 开始检测...`, 'color: #2196F3; font-weight: bold');

            let maxA = null;
            for (let a = 5; a >= 1; a--) { // 从后往前找，找到第一个就一定是最大的
                const existenceSelector = `#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(${a})`;
                if (document.querySelector(existenceSelector)) {
                    maxA = a;
                    break;
                }
            }

            if (maxA === null) {
                console.log(`%c检测结果: 课程列表元素不存在`, 'color: #9E9E9E; font-weight: bold');
                return;
            }
            console.log(`%c最大存在的课程章节: ${maxA}`, 'color: #9C27B0; font-weight: bold');

            const numberSelector = `#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(${maxA}) > div.van-cell.van-cell--clickable.van-collapse-item__title > div > div.count`;
            const targetElement = document.querySelector(numberSelector);

            if (!targetElement) {
                console.log(`%c数字检测: 章节 ${maxA} 的进度元素未找到`, 'color: #999');
                return;
            }

            const text = targetElement.textContent.trim();
            const match = text.match(/(\d+)\s*\/\s*(\d+)/);

            if (match && match.length === 3) {
                const x = parseInt(match[1], 10);
                const y = parseInt(match[2], 10);
                console.log(`%c数字检测: 检测到进度: ${x} / ${y}`, 'color: #666');

                if (x === y && maxA < 5) {
                    console.log(`%c数字检测: ✅ 进度匹配!`, 'color: #0f9d58; font-weight: bold');
                    const clickA = maxA + 1;
                    console.log(`%c准备点击: 下一章节 ${clickA}`, 'color: #FF5722; font-weight: bold');
                    const clickSelector = `#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(${clickA}) > div.van-cell.van-cell--clickable.van-collapse-item__title > div > div.count`;
                    clickElement(clickSelector, `已点击 (章节 ${clickA})`);
                } else if (x !== y) {
                    console.log(`%c数字检测: ❌ 进度不匹配`, 'color: #db4437; font-weight: bold');
                    console.log('%c触发课程列表自动点击序列...', 'color: #FFA500; font-weight: bold');
                    mismatchClickTargets.forEach((sel, idx) => {
                        setTimeout(() => clickElement(sel, `不匹配-自动点击`), idx * 200);
                    });
                } else {
                     console.log(`%c数字检测: 进度已满或已是最后一章，无需操作。`, 'color: #0f9d58');
                }
            } else {
                console.log(`%c数字检测: 未检测到符合格式的数字 (格式应为 x / y)`, 'color: #f4b400');
            }
        } catch (error) {
            console.error('%c检测过程中发生错误:', 'color: #db4437', error);
        }
    }

    // --- 主函数入口 ---
    function main() {
        if (window.location.href.includes('mcwk.mycourse.cn')) {
            // 课程播放页面
            setupAutoFinishButton();
            displayAnnouncementBar();
        } else {
            // 主页面或考试页面
            setupAnswerQueryUI();
            // 启动核心检测循环
            setInterval(performChecks, 1500); // 调整检测间隔为1.5秒，避免过于频繁
        }
    }

    // 确保在页面完全加载后执行脚本
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }
})();