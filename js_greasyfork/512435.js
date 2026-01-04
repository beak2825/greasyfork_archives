// ==UserScript==
// @name         批量代扣
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  自动勾选、点击搜索、代扣还款、处理弹窗确认并循环执行操作
// @match        https://crm.amh-group.com/crm-sales-workbench/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512435/%E6%89%B9%E9%87%8F%E4%BB%A3%E6%89%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/512435/%E6%89%B9%E9%87%8F%E4%BB%A3%E6%89%A3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let running = false;
    let interval = 10000; // 默认操作间隔时间（毫秒）
    let currentPage = 1; // 当前页码
    let totalPages = 0; // 总页码数
    let controlPanel;

    function createControlPanel() {
        controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.bottom = '10px';
        controlPanel.style.left = '10px';
        controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        controlPanel.style.padding = '5px';
        controlPanel.style.color = 'white';
        controlPanel.style.zIndex = '10000';
        controlPanel.style.borderRadius = '8px';
        controlPanel.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        controlPanel.style.width = '120px'; // 设置控制面板宽度为120px

        const controlContainer = document.createElement('div');
        controlContainer.style.display = 'flex';
        controlContainer.style.flexDirection = 'column';
        controlContainer.style.alignItems = 'center';

        const startStopBtn = document.createElement('button');
        startStopBtn.textContent = '开始运行';
        startStopBtn.style.backgroundColor = 'green';
        startStopBtn.style.color = 'white';
        startStopBtn.style.border = 'none';
        startStopBtn.style.padding = '5px';
        startStopBtn.style.borderRadius = '5px';
        startStopBtn.style.width = '100%'; // 按钮宽度为100%
        startStopBtn.style.height = '40px'; // 按钮高度为40px
        startStopBtn.style.cursor = 'pointer';
        startStopBtn.style.marginBottom = '5px';
        startStopBtn.style.boxSizing = 'border-box';

        startStopBtn.addEventListener('click', () => {
            running = !running;
            if (running) {
                startStopBtn.textContent = '结束运行';
                startStopBtn.style.backgroundColor = 'red';
                currentPage = 1; // 重置当前页码
                getTotalPages(() => {
                    executeProcess();
                });
            } else {
                stopScript();
            }
        });

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.value = 10; // 默认值为10秒
        intervalInput.min = 1;
        intervalInput.style.padding = '5px';
        intervalInput.style.width = '100%'; // 输入框宽度为100%
        intervalInput.style.height = '40px'; // 输入框高度为40px
        intervalInput.style.border = '1px solid #ccc';
        intervalInput.style.borderRadius = '5px';
        intervalInput.style.textAlign = 'center';
        intervalInput.style.backgroundColor = 'white'; // 设置背景颜色为白色
        intervalInput.placeholder = '间隔时间(秒)';

        intervalInput.addEventListener('change', () => {
            const userInput = parseInt(intervalInput.value);
            if (userInput > 0) {
                interval = userInput * 1000; // 更新间隔时间（转换为毫秒）
                console.log(`间隔时间设置为: ${userInput} 秒`);
            }
        });

        controlContainer.appendChild(startStopBtn);
        controlContainer.appendChild(intervalInput);
        controlPanel.appendChild(controlContainer);
        document.body.appendChild(controlPanel);
    }

    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - startTime >= timeout) {
                clearInterval(interval);
                console.error('超时: 无法找到元素 ' + selector);
            }
        }, 500);
    }

    function getTotalPages(callback) {
        waitForElement('.el-pagination__total', (totalText) => {
            const totalMatches = totalText.textContent.match(/共 (\d+) 条/);
            if (totalMatches) {
                totalPages = Math.ceil(parseInt(totalMatches[1]) / 10);
                console.log(`总页数: ${totalPages}`);
                callback();
            }
        });
    }

    function selectAll() {
        const selectAllBtn = document.querySelector('th.el-table-column--selection .el-checkbox__inner');
        if (selectAllBtn) {
            selectAllBtn.click();
            console.log('已勾选全部');
        } else {
            console.error('找不到勾选全部按钮');
        }
    }

    function clickRepayment() {
        const repaymentBtn = [...document.querySelectorAll('span')].find(span => span.textContent.trim() === '代扣还款');
        if (repaymentBtn) {
            repaymentBtn.click();
            console.log('已点击代扣还款');
        } else {
            console.error('找不到代扣还款按钮');
        }
    }

    function confirmPopup() {
        waitForElement('.el-message-box__btns .el-button--primary', (confirmBtn) => {
            confirmBtn.click();
            console.log('已点击弹窗确认按钮');
        });
    }

    function goToPage(page, callback) {
        if (page > totalPages) {
            console.log('已到最后一页');
            stopScript(); // 停止脚本
            return;
        }

        const pageBtn = [...document.querySelectorAll('.el-pager .number')].find(btn => btn.textContent.trim() === page.toString());
        const quickNextBtn = document.querySelector('.btn-quicknext');

        if (!pageBtn && quickNextBtn) {
            quickNextBtn.click();
            console.log('已点击“更多”按钮显示更多页码');
            setTimeout(() => goToPage(page, callback), 1000);
        } else if (pageBtn) {
            pageBtn.click();
            console.log(`已跳转到第 ${page} 页`);
            waitForPageLoad(callback);
        } else {
            console.error(`找不到第 ${page} 页的按钮`);
        }
    }

    function waitForPageLoad(callback, timeout = 10000) {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (!loadingIndicator) {
                clearInterval(checkInterval);
                console.log('页面加载完成');
                callback();
            } else if (Date.now() - startTime >= timeout) {
                clearInterval(checkInterval);
                console.error('页面加载超时');
            }
        }, 500);
    }

    function executeProcess() {
        if (!running) return;

        selectAll();
        setTimeout(() => {
            clickRepayment();
            setTimeout(() => {
                confirmPopup();
                setTimeout(() => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        goToPage(currentPage, executeProcess);
                    } else {
                        console.log('所有页码已处理完成');
                        stopScript();
                    }
                }, interval);
            }, 2000);
        }, 2000);
    }

    function stopScript() {
        running = false;
        currentPage = 1; // 重置当前页码
        const startStopBtn = controlPanel.querySelector('button');
        startStopBtn.textContent = '开始运行'; // 恢复为开始运行
        startStopBtn.style.backgroundColor = 'green'; // 恢复为绿色
        console.log('脚本已停止运行');
    }

    window.addEventListener('load', () => {
        setTimeout(createControlPanel, 3000);
    });
})();