// ==UserScript==
// @name         Mutx163学习通自动评教
// @namespace    http://tampermonkey.net/
// @version      v1.28
// @description  学习通自动评价，支持批量评教，默认满分
// @author       Mutx163
// @match        https://newes.chaoxing.com/pj/newesReception/questionnaireInfo*
// @match        http://newes.chaoxing.com/pj/newesReception/questionnaireInfo*
// @match        https://newes.chaoxing.com/pj/frontv2/evaluateList/whatIEvaluated*
// @match        http://newes.chaoxing.com/pj/frontv2/evaluateList/whatIEvaluated*
// @match        https://newes.chaoxing.com/pj/frontv2/whatIEvaluatedDetails*
// @match        http://newes.chaoxing.com/pj/frontv2/whatIEvaluatedDetails*
// @icon
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/491058/Mutx163%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/491058/Mutx163%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

// ��������������
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;

    // 更新进度显示
    if (window.progressDiv) {
        window.progressDiv.innerHTML += `<div class="${type}">${logMessage}</div>`;
        // 保持最新消息可见
        window.progressDiv.scrollTop = window.progressDiv.scrollHeight;
    }

    // 控制台输出
    switch(type) {
        case 'error':
            console.error(logMessage);
            GM_log('[ERROR] ' + message);
            break;
        case 'warning':
            console.warn(logMessage);
            GM_log('[WARNING] ' + message);
            break;
        default:
            console.log(logMessage);
            GM_log('[INFO] ' + message);
    }
}

window.onload = function() {
    'use strict';

    try {
        log('脚本开始初始化...');

        // 创建进度显示元素
        const progressDiv = document.createElement('div');
        progressDiv.style.position = 'fixed';
        progressDiv.style.bottom = '60px';
        progressDiv.style.left = '10px';
        progressDiv.style.zIndex = '1000';
        progressDiv.style.padding = '10px';
        progressDiv.style.backgroundColor = '#f0f0f0';
        progressDiv.style.border = '1px solid #ccc';
        progressDiv.style.borderRadius = '5px';
        progressDiv.style.maxHeight = '400px';
        progressDiv.style.overflowY = 'auto';
        progressDiv.style.width = '300px';
        progressDiv.style.fontSize = '12px';
        progressDiv.style.lineHeight = '1.5';
        document.body.appendChild(progressDiv);
        window.progressDiv = progressDiv;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .info { color: black; }
            .warning { color: orange; }
            .error { color: red; }
            .success { color: green; }
        `;
        document.head.appendChild(style);

        // 创建控制按钮
        const autoEvaluateButton = document.createElement('button');
        autoEvaluateButton.textContent = '启动自动评教';
        autoEvaluateButton.style.position = 'fixed';
        autoEvaluateButton.style.bottom = '10px';
        autoEvaluateButton.style.left = '10px';
        autoEvaluateButton.style.zIndex = '1000';
        autoEvaluateButton.style.padding = '10px';
        autoEvaluateButton.style.backgroundColor = '#4CAF50';
        autoEvaluateButton.style.color = 'white';
        autoEvaluateButton.style.border = 'none';
        autoEvaluateButton.style.borderRadius = '5px';
        autoEvaluateButton.style.cursor = 'pointer';
        document.body.appendChild(autoEvaluateButton);

        // 检查localStorage中的状态
        const autoEvaluateEnabled = localStorage.getItem('autoEvaluateEnabled') === 'true';
        log(`当前自动评教状态: ${autoEvaluateEnabled ? '已启用' : '未启用'}`);

        // 根据存储的状态更新按钮文本
        autoEvaluateButton.textContent = autoEvaluateEnabled ? '禁用自动评教' : '启动自动评教';

        // 根据当前页面类型执行不同的操作
        const currentURL = window.location.href;
        log(`当前页面URL: ${currentURL}`);

        // 使用 URL 对象解析当前页面 URL
        const urlPath = new URL(currentURL).pathname;

        if (urlPath.includes('evaluateList/whatIEvaluated')) {
            log('检测到评教列表页面');
            handleEvaluationList(autoEvaluateButton);
        } else if (urlPath.includes('questionnaireInfo')) {
            log('检测到具体评教页面');
            handleEvaluationPage(autoEvaluateButton);
        } else if (urlPath.includes('whatIEvaluatedDetails')) {
            log('检测到评教详情页面');
            // 如果自动评教已启用，直接执行评教流程
            if (autoEvaluateEnabled) {
                executeEvaluationDetails();
            }
            handleEvaluationDetails(autoEvaluateButton);
        }

        log('脚本初始化完成', 'success');
    } catch (error) {
        log(`脚本初始化失败: ${error.message}`, 'error');
        console.error(error);
    }
};

// 处理评教列表
function handleEvaluationList(button) {
    // 添加自动执行逻辑
    if (localStorage.getItem('autoEvaluateEnabled') === 'true') {
        log('检测到自动评教已启用，开始执行...');
        startEvaluationProcess();
    }

    button.addEventListener('click', async function() {
        try {
            const isEnabled = localStorage.getItem('autoEvaluateEnabled') === 'true';
            localStorage.setItem('autoEvaluateEnabled', !isEnabled);
            button.textContent = !isEnabled ? '禁用自动评教' : '启动自动评教';

            if (!isEnabled) {
                startEvaluationProcess();
            }
        } catch (error) {
            log(`评教列表处理出错: ${error.message}`, 'error');
            console.error(error);
        }
    });
}

// 新增函数：等待元素加载
function waitForElement(selector, maxWaitTime = 10000) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`等待元素 ${selector} 超时`));
        }, maxWaitTime);
    });
}

// 修改开始评教流程函数
async function startEvaluationProcess() {
    try {
        log('开始检查未完成的评教任务...');

        // 等待表格加载
        log('等待评教任务表格加载...');
        await waitForElement('.el-table__body-wrapper');

        // 确保表格内容完全加载
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 获取所有行
        const rows = document.querySelectorAll('.el-table__row');
        log(`找到 ${rows.length} 个评教任务行`);

        if (rows.length === 0) {
            log('尝试使用备用选择器查找任务行...');
            const tableBody = document.querySelector('.el-table__body');
            if (tableBody) {
                const alternativeRows = tableBody.querySelectorAll('tr');
                log(`使用备用选择器找到 ${alternativeRows.length} 个任务行`);
                if (alternativeRows.length > 0) {
                    processRows(Array.from(alternativeRows));
                    return;
                }
            }
            log('无法找到评教任务行，请检查页面是否正确加载', 'error');
            return;
        }

        processRows(Array.from(rows));
    } catch (error) {
        log(`评教流程出错: ${error.message}`, 'error');
        console.error(error);
    }
}

// 新增函数：处理任务行
function processRows(rows) {
    // 过滤出未完成的任务行
    const unfinishedRows = rows.filter(row => {
        const statusTag = row.querySelector('.d_submit_tag');
        return statusTag && !statusTag.classList.contains('green');
    });

    const totalTasks = unfinishedRows.length;
    log(`其中有 ${totalTasks} 个未完成的评教任务`);

    if (totalTasks === 0) {
        log('没有找到未完成的评教任务', 'warning');
        return;
    }

    // 保存任务信息到GM存储
    GM_setValue('totalTasks', totalTasks);
    GM_setValue('currentTask', 0);
    log('已保存任务信息到存储');

    // 获取第一个未完成任务的"查看详情"按钮并点击
    const firstUnfinishedRow = unfinishedRows[0];

    // 查找查看详情按钮
    const buttons = firstUnfinishedRow.querySelectorAll('a.d_button_text');
    const detailButton = Array.from(buttons).find(btn => btn.textContent.trim() === '查看详情');

    if (detailButton) {
        log('找到未完成任务的查看详情按钮，准备点击...');
        setTimeout(() => {
            detailButton.click();
            log('已点击查看详情按钮');
        }, 1000);
    } else {
        log(`在未完成任务行中找到 ${buttons.length} 个按钮，但没有找到查看详情按钮`, 'error');
        // 输出所有按钮的文本内容以供调试
        buttons.forEach((btn, index) => {
            log(`按钮 ${index + 1} 的文本内容: "${btn.textContent.trim()}"`, 'info');
        });
    }
}

// 新增函数：执行评教详情页面的评教流程
function executeEvaluationDetails() {
    log('检测到自动评教已启用，准备查找评价按钮...');

    // 等待页面加载完成
    waitForElement('.d_table_btns').then(() => {
        try {
            // 查找所有按钮容器
            const btnContainers = document.querySelectorAll('.d_table_btns');
            log(`找到 ${btnContainers.length} 个按钮容器`);

            // 遍历容器查找评价按钮
            let evaluateButton = null;
            btnContainers.forEach((container, index) => {
                const btn = container.querySelector('a.d_button_text');
                if (btn && btn.textContent.trim() === '评价') {
                    evaluateButton = btn;
                    log(`在第 ${index + 1} 个容器中找到评价按钮`);
                }
            });

            if (evaluateButton) {
                log('找到评价按钮，准备点击...');
                setTimeout(() => {
                    evaluateButton.click();
                    log('已点击评价按钮');
                }, 1000);
            } else {
                // 如果没有找到评价按钮，说明可能已经评价完成，尝试返回
                const backButton = document.querySelector('a.d_back');
                if (backButton) {
                    log('找到返回按钮，准备返回上一页...');
                    setTimeout(() => {
                        backButton.click();
                        log('已点击返回按钮');
                    }, 1000);
                } else {
                    log('未找到返回按钮', 'error');
                    // 输出所有按钮的文本内容以供调试
                    btnContainers.forEach((container, index) => {
                        const btn = container.querySelector('a.d_button_text');
                        if (btn) {
                            log(`容器 ${index + 1} 中的按钮文本: "${btn.textContent.trim()}"`, 'info');
                        }
                    });
                }
            }
        } catch (error) {
            log(`查找评价按钮出错: ${error.message}`, 'error');
        }
    }).catch(error => {
        log(`等待按钮容器加载失败: ${error.message}`, 'error');
        // 尝试备用方案
        const allButtons = document.querySelectorAll('a.d_button_text');
        log(`使用备用选择器找到 ${allButtons.length} 个按钮`);
        allButtons.forEach((btn, index) => {
            log(`按钮 ${index + 1} 的文本内容: "${btn.textContent.trim()}"`, 'info');
            if (btn.textContent.trim() === '评价') {
                log('找到评价按钮，准备点击...');
                setTimeout(() => {
                    btn.click();
                    log('已点击评价按钮');
                }, 1000);
            }
        });
    });
}

// 处理评教详情页面
function handleEvaluationDetails(button) {
    try {
        log('开始处理评教详情页面...');
        // 如果自动评教已启用，自动执行评教流程
        if (localStorage.getItem('autoEvaluateEnabled') === 'true') {
            log('检测到自动评教已启用，准备执行评教流程...');
            // 确保页面完全加载后再执行
            setTimeout(executeEvaluationDetails, 1000);
        }

        // 添加按钮点击事件
        button.addEventListener('click', function() {
            const isEnabled = localStorage.getItem('autoEvaluateEnabled') === 'true';
            localStorage.setItem('autoEvaluateEnabled', !isEnabled);
            button.textContent = !isEnabled ? '禁用自动评教' : '启动自动评教';

            if (!isEnabled) {
                executeEvaluationDetails();
            }
        });
    } catch (error) {
        log(`评教详情页面处理出错: ${error.message}`, 'error');
        console.error(error);
    }
}

// 处理具体评教页面
function handleEvaluationPage(button) {
    try {
        const totalTasks = GM_getValue('totalTasks', 0);
        const currentTask = GM_getValue('currentTask', 0);

        if (totalTasks > 0) {
            log(`正在处理第 ${currentTask + 1}/${totalTasks} 个任务的评教`);
        }

        button.addEventListener('click', function() {
            const isEnabled = localStorage.getItem('autoEvaluateEnabled') === 'true';
            localStorage.setItem('autoEvaluateEnabled', !isEnabled);
            button.textContent = !isEnabled ? '禁用自动评教' : '启动自动评教';

            if (!isEnabled) {
                startAutoEvaluation();
            }
        });

        // 果已启用，自动开始评教
        if (localStorage.getItem('autoEvaluateEnabled') === 'true') {
            startAutoEvaluation();
        }
    } catch (error) {
        log(`评教页面处理出错: ${error.message}`, 'error');
        console.error(error);
    }
}

function triggerEvent(element, eventType) {
    try {
        const event = new Event(eventType, {
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
        log(`触发事件 ${eventType} 成功`);
    } catch (error) {
        log(`触发事件 ${eventType} 失败: ${error.message}`, 'error');
        console.error(error);
    }
}

function startAutoEvaluation() {
    setTimeout(() => {
        try {
            log('开始自动评教...');

            // 查找所有打分题输入框并填写满分
            const scoreInputs = document.querySelectorAll('input.dafen');
            log(`找到 ${scoreInputs.length} 个打分输入框`);

            if (scoreInputs.length > 0) {
                scoreInputs.forEach((input, index) => {
                    try {
                        const maxScore = input.getAttribute('maxscore');
                        input.value = maxScore;
                        log(`设置第 ${index + 1} 个评分为满分: ${maxScore}`);

                        // 触发所有必要的事件
                        triggerEvent(input, 'input');
                        triggerEvent(input, 'propertychange');
                        triggerEvent(input, 'keyup');
                        triggerEvent(input, 'blur');

                        if (typeof window.allScore === 'function') {
                            window.allScore();
                            log('调用计分函数成功');
                        }
                    } catch (error) {
                        log(`处理第 ${index + 1} 个评分出错: ${error.message}`, 'error');
                    }
                });
            }

            // 查找所有文本框并填写"无"
            const textareas = document.querySelectorAll('textarea.blueTextarea');
            log(`找到 ${textareas.length} 个文本框`);

            if (textareas.length > 0) {
                textareas.forEach((textarea, index) => {
                    try {
                        textarea.value = '无';
                        log(`设置第 ${index + 1} 个文本框内容为"无"`);
                        triggerEvent(textarea, 'input');
                        triggerEvent(textarea, 'propertychange');
                        triggerEvent(textarea, 'keyup');
                    } catch (error) {
                        log(`处理第 ${index + 1} 个文本框出错: ${error.message}`, 'error');
                    }
                });
            }

            // 延迟提交
            setTimeout(() => {
                log('准备提交评教...');
                // 查找提交按钮
                const submitButton = document.querySelector('a[onclick*="save(2)"]');

                if (submitButton) {
                    log('找到提交按钮，准备点击...');
                    // 直接调用save函数
                    if (typeof window.save === 'function') {
                        window.save(2);
                        log('已调用提交函数');
                    } else {
                        // 如果找不到save函数，尝试点击按钮
                        submitButton.click();
                        log('已点击提交按钮');
                    }

                    // 处理确认弹窗
                    setTimeout(() => {
                        try {
                            const confirmButtons = document.querySelectorAll('.layui-layer-btn0');
                            log(`找到 ${confirmButtons.length} 个确认按钮`);

                            if (confirmButtons.length > 0) {
                                confirmButtons.forEach(button => button.click());
                                log('已点击确认按钮');

                                // 更新任务计数并返回列表页
                                const currentTask = GM_getValue('currentTask', 0);
                                const totalTasks = GM_getValue('totalTasks', 0);

                                if (currentTask < totalTasks - 1) {
                                    GM_setValue('currentTask', currentTask + 1);
                                    log(`更新任务进度: ${currentTask + 1}/${totalTasks}`);
                                    setTimeout(() => {
                                        log('返回上一页...');
                                        window.location.href = document.referrer;
                                    }, 1000);
                                } else {
                                    // 所有任务完成，清除存储的任务信息
                                    GM_deleteValue('totalTasks');
                                    GM_deleteValue('currentTask');
                                    log('所有评教任务已完成！', 'success');
                                    setTimeout(() => {
                                        log('返回列表页...');
                                        window.location.href = document.referrer;
                                    }, 1000);
                                }
                            } else {
                                log('未找到确认按钮', 'error');
                            }
                        } catch (error) {
                            log(`处理确认弹窗出错: ${error.message}`, 'error');
                        }
                    }, 1000);
                } else {
                    log('未找到提交按钮', 'error');
                }
            }, 1000);
        } catch (error) {
            log(`自动评教过程出错: ${error.message}`, 'error');
            console.error(error);
        }
    }, 1000);
} 