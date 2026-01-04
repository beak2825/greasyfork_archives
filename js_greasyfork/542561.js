// ==UserScript==
// @name         黄淮学院简单答题助手v1
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  自动选择答案 - 显示题目、答案和选项
// @author       You
// @match        https://huanghuai.jijiaox.com/*
// @match        http://huanghuai.jijiaox.com/*
// @include      *://huanghuai.jijiaox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542561/%E9%BB%84%E6%B7%AE%E5%AD%A6%E9%99%A2%E7%AE%80%E5%8D%95%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8Bv1.user.js
// @updateURL https://update.greasyfork.org/scripts/542561/%E9%BB%84%E6%B7%AE%E5%AD%A6%E9%99%A2%E7%AE%80%E5%8D%95%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8Bv1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let answersData = null;

    // 拦截XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        const xhr = this;
        const originalOnReadyStateChange = xhr.onreadystatechange;

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr._url && xhr._url.includes('/api/studycenter/classroom/praxise')) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.code === 0 && response.data) {
                            answersData = response.data;
                            updateStatus('已获取答案数据');
                        }
                    } catch (e) {
                        // 解析失败
                    }
                }
            }

            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(this, arguments);
            }
        };

        return originalSend.apply(this, arguments);
    };

    // 拦截fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [url] = args;

        return originalFetch.apply(this, args).then(response => {
            if (url && url.includes('/api/studycenter/classroom/praxise')) {
                response.clone().json().then(data => {
                    if (data.code === 0 && data.data) {
                        answersData = data.data;
                        updateStatus('已获取答案数据');
                    }
                }).catch(e => {
                    // 解析失败
                });
            }
            return response;
        });
    };

    let statusDiv = null;

    function updateStatus(message) {
        if (statusDiv) {
            statusDiv.textContent = message;
        }
    }

    // 等待页面加载
    setTimeout(function() {
        // 创建主界面
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            width: 350px;
            cursor: move;
        `;

        container.innerHTML = `
            <div id="drag-handle" style="margin: -10px -10px 10px -10px; padding: 10px; background: #4CAF50; color: white; border-radius: 5px 5px 0 0; cursor: move; user-select: none;">
                <h4 style="margin: 0; text-align: center;">答题助手 v1</h4>
            </div>
            <div id="status" style="margin-bottom: 10px; color: #666;">等待答案加载...</div>
            <label style="display: block; margin-bottom: 5px; cursor: pointer;">
                <input type="checkbox" id="clearSelected" checked> 清除已选答案
            </label>
            <div style="font-size: 11px; color: #666; margin-bottom: 10px; padding: 8px; background: #e3f2fd; border-left: 3px solid #2196F3; border-radius: 3px;">
                <strong>提示：</strong>勾选后会先清除多选题的错误选项，再选择正确答案。<br>
                如果不勾选，会保留之前的选择（可能包含错误选项）。建议保持勾选。
            </div>
            <button id="doAnswer" style="background: #4CAF50; color: white; border: none; padding: 8px 15px; cursor: pointer; width: 100%; margin-bottom: 10px;">开始答题</button>
            <div id="loading" style="display: none; text-align: center; margin: 10px 0;">
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .loader {
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid #4CAF50;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        animation: spin 1s linear infinite;
                        display: inline-block;
                    }
                </style>
                <div class="loader"></div>
                <div id="progress" style="margin-top: 10px; color: #666; font-size: 14px;">正在答题中...</div>
            </div>
            <div id="result" style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px; max-height: 300px; overflow-y: auto; display: none; word-break: break-word;"></div>
        `;

        document.body.appendChild(container);
        statusDiv = document.getElementById('status');

        // 添加拖动功能
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        const dragHandle = document.getElementById('drag-handle');

        // 鼠标按下
        dragHandle.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            container.style.cursor = 'grabbing';
            e.preventDefault();
        });

        // 鼠标移动
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            e.preventDefault();

            // 计算新位置
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // 限制在窗口内
            newX = Math.max(0, Math.min(newX, window.innerWidth - container.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight));

            container.style.left = newX + 'px';
            container.style.top = newY + 'px';
            container.style.right = 'auto';
        });

        // 鼠标释放
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'move';
            }
        });

        // 防止拖动时选中文本
        container.addEventListener('selectstart', function(e) {
            if (isDragging) {
                e.preventDefault();
            }
        });

        // 初始状态
        if (answersData) {
            updateStatus(`已获取 ${answersData.length} 道题答案`);
        }


        // 主答题功能
        document.getElementById('doAnswer').onclick = async function() {
            const resultDiv = document.getElementById('result');
            const loadingDiv = document.getElementById('loading');
            const progressDiv = document.getElementById('progress');
            const button = this;

            // 隐藏结果，显示loading
            resultDiv.style.display = 'none';
            loadingDiv.style.display = 'block';
            button.disabled = true;
            button.style.opacity = '0.6';

            if (!answersData) {
                loadingDiv.style.display = 'none';
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = '<span style="color: red;">未获取到答案数据</span>';
                button.disabled = false;
                button.style.opacity = '1';
                return;
            }

            try {
                let successCount = 0;
                let failCount = 0;
                let results = [];

                // 获取所有题目
                const allQuestions = document.querySelectorAll('div.mt_2');
                const validQuestions = [];

                // 过滤有效题目
                allQuestions.forEach((q) => {
                    const titleType = q.querySelector('.titleType');
                    const questionText = q.querySelector('.ml_2.mt_1[style*="color"]');
                    const hasOptions = q.querySelectorAll('.el-radio, .el-checkbox').length > 0;

                    if (titleType && questionText && hasOptions) {
                        validQuestions.push(q);
                    }
                });

                // 按顺序处理
                const minLength = Math.min(validQuestions.length, answersData.length);

                // 使用async/await处理答题
                for (let i = 0; i < minLength; i++) {
                    // 更新进度
                    progressDiv.textContent = `正在答题中... (${i + 1}/${minLength})`;

                    const q = validQuestions[i];
                    const answer = answersData[i];
                    const questionType = answer.praxise.type;
                    const questionTextElement = q.querySelector('.ml_2.mt_1[style*="color"]');
                    const questionText = questionTextElement ? questionTextElement.textContent.trim() : '';

                    let selectedCount = 0;
                    let selectedOptions = [];

                    if (questionType === 'muti') {
                        // 多选题处理
                        const checkboxes = q.querySelectorAll('.el-checkbox');

                        try {
                            // 解析答案 "[1,2,3]"
                            const answerArray = JSON.parse(answer.praxise.answer);

                            // 清除已选（如果需要）
                            if (document.getElementById('clearSelected').checked) {
                                const checkedBoxes = q.querySelectorAll('.el-checkbox.is-checked');
                                for (const box of checkedBoxes) {
                                    box.click();
                                    await new Promise(resolve => setTimeout(resolve, 50));
                                }
                            }

                            // 选择答案
                            for (const ansIdx of answerArray) {
                                const targetIdx = ansIdx - 1;
                                if (targetIdx >= 0 && targetIdx < checkboxes.length) {
                                    const checkbox = checkboxes[targetIdx];
                                    if (!checkbox.classList.contains('is-checked')) {
                                        checkbox.click();
                                        await new Promise(resolve => setTimeout(resolve, 100));
                                    }

                                    // 获取选项文本
                                    const optionText = checkboxes[targetIdx].querySelector('.el-checkbox__label');
                                    if (optionText) {
                                        selectedOptions.push(optionText.textContent.trim());
                                    }
                                    selectedCount++;
                                }
                            }

                            if (selectedCount > 0) {
                                successCount++;
                                results.push({
                                    status: '✅',
                                    index: i + 1,
                                    type: '多选',
                                    question: questionText.substring(0, 50) + (questionText.length > 50 ? '...' : ''),
                                    selectedOptions: selectedOptions,
                                    answerValue: answer.praxise.answer
                                });
                            } else {
                                failCount++;
                                results.push({
                                    status: '❌',
                                    index: i + 1,
                                    type: '多选',
                                    question: questionText.substring(0, 50) + (questionText.length > 50 ? '...' : ''),
                                    selectedOptions: [],
                                    answerValue: answer.praxise.answer,
                                    error: '未找到选项'
                                });
                            }

                        } catch (e) {
                            failCount++;
                            results.push({
                                status: '❌',
                                index: i + 1,
                                type: '多选',
                                question: questionText.substring(0, 50) + (questionText.length > 50 ? '...' : ''),
                                selectedOptions: [],
                                answerValue: answer.praxise.answer,
                                error: '解析答案失败'
                            });
                        }

                    } else if (questionType === 'single' || questionType === 'charge') {
                        // 单选题和判断题
                        const radios = q.querySelectorAll('.el-radio');
                        let answerIndex;

                        // 判断题特殊处理
                        if (questionType === 'charge') {
                            // 判断题: 1 = 正确（第一个选项）, -1 = 错误（第二个选项）
                            answerIndex = answer.praxise.answer === "1" ? 0 : 1;
                        } else {
                            // 单选题: 正常处理
                            answerIndex = parseInt(answer.praxise.answer) - 1;
                        }

                        if (answerIndex >= 0 && answerIndex < radios.length) {
                            if (!radios[answerIndex].classList.contains('is-checked')) {
                                radios[answerIndex].click();
                                await new Promise(resolve => setTimeout(resolve, 50));
                            }

                            // 获取选中的选项文本
                            const optionText = radios[answerIndex].querySelector('.el-radio__label');
                            if (optionText) {
                                selectedOptions.push(optionText.textContent.trim());
                            }

                            successCount++;
                            results.push({
                                status: '✅',
                                index: i + 1,
                                type: questionType === 'single' ? '单选' : '判断',
                                question: questionText.substring(0, 50) + (questionText.length > 50 ? '...' : ''),
                                selectedOptions: selectedOptions,
                                answerValue: answer.praxise.answer
                            });
                        } else {
                            failCount++;
                            results.push({
                                status: '❌',
                                index: i + 1,
                                type: questionType === 'single' ? '单选' : '判断',
                                question: questionText.substring(0, 50) + (questionText.length > 50 ? '...' : ''),
                                selectedOptions: [],
                                answerValue: answer.praxise.answer,
                                error: '未找到选项'
                            });
                        }
                    }

                    // 每题之间增加延迟，避免卡顿
                    if (i < minLength - 1) {
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }

                // 显示结果
                let html = `
                    <h5>答题完成</h5>
                    <p>成功: <span style="color: green;">${successCount}</span> | 失败: <span style="color: red;">${failCount}</span></p>
                    <div style="font-size: 12px; max-height: 150px; overflow-y: auto;">
                `;

                results.forEach(r => {
                    html += `
                        <div style="margin-bottom: 10px; padding: 5px; background: ${r.status === '✅' ? '#e8f5e9' : '#ffebee'}; border-radius: 3px; overflow: hidden;">
                            <div>${r.status} 题${r.index} [${r.type}]</div>
                            <div style="color: #666; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">题目: ${r.question}</div>
                            <div style="color: #2196F3; font-size: 11px;">答案值: ${r.answerValue}</div>
                            ${r.selectedOptions.length > 0 ?
                                `<div style="color: #4CAF50; font-size: 11px; white-space: normal; word-break: break-all;">已选: ${r.selectedOptions.join(', ')}</div>` :
                                `<div style="color: #f44336; font-size: 11px;">错误: ${r.error || '未知'}</div>`
                            }
                        </div>
                    `;
                });

                html += '</div>';

                resultDiv.innerHTML = html;

            } catch (e) {
                resultDiv.innerHTML = `<span style="color: red;">错误: ${e.message}</span>`;
            } finally {
                // 隐藏loading，显示结果
                loadingDiv.style.display = 'none';
                resultDiv.style.display = 'block';
                button.disabled = false;
                button.style.opacity = '1';
            }
        };

    }, 2000);
})();