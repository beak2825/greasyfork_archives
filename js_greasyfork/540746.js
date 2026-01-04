// ==UserScript==
// @name         重庆医科大学自动评教脚本
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动给老师的除最后一个选项选a，如果没有应用上，刷新一下即可
// @author       一位学长
// @match        https://jiaowu.cqmu.edu.cn/*
// @grant        none
// @run-at       document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/540746/%E9%87%8D%E5%BA%86%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/540746/%E9%87%8D%E5%BA%86%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建悬浮窗口
    function createFloatingWindow() {
        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'autoEvaluatePanel';
        floatingDiv.style.position = 'fixed';
        floatingDiv.style.top = '10px';
        floatingDiv.style.right = '10px';
        floatingDiv.style.backgroundColor = 'rgba(240, 240, 240, 0.9)';
        floatingDiv.style.border = '1px solid #ccc';
        floatingDiv.style.padding = '10px';
        floatingDiv.style.borderRadius = '5px';
        floatingDiv.style.zIndex = '9999';
        floatingDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';

        const title = document.createElement('div');
        title.textContent = '评教助手';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '8px';
        title.style.borderBottom = '1px solid #ccc';
        title.style.paddingBottom = '5px';
        floatingDiv.appendChild(title);

        const statusDiv = document.createElement('div');
        statusDiv.id = 'evaluateStatus';
        statusDiv.style.marginBottom = '8px';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.color = '#666';
        statusDiv.textContent = '等待检测评教表格...';
        floatingDiv.appendChild(statusDiv);

        const runButton = document.createElement('button');
        runButton.textContent = '重新自动评教';
        runButton.style.padding = '5px 10px';
        runButton.style.cursor = 'pointer';
        runButton.style.backgroundColor = '#4CAF50';
        runButton.style.color = 'white';
        runButton.style.border = 'none';
        runButton.style.borderRadius = '3px';
        runButton.onclick = function() {
            runAutoEvaluate();
        };
        floatingDiv.appendChild(runButton);

        // 添加可拖动功能
        let isDragging = false;
        let offsetX, offsetY;

        title.style.cursor = 'move';
        title.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - floatingDiv.getBoundingClientRect().left;
            offsetY = e.clientY - floatingDiv.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            floatingDiv.style.left = (e.clientX - offsetX) + 'px';
            floatingDiv.style.top = (e.clientY - offsetY) + 'px';
            floatingDiv.style.right = 'auto'; // 取消right定位，使用left定位
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        document.body.appendChild(floatingDiv);
        return floatingDiv;
    }

    // 更新状态信息
    function updateStatus(text) {
        const statusDiv = document.getElementById('evaluateStatus');
        if (statusDiv) {
            statusDiv.textContent = text;
        }
    }

    // 自动评教函数
    function runAutoEvaluate() {
        // 检查课程评教表格
        const courseEvaluateContent = document.getElementById('courseEvaluateContent');
        if (courseEvaluateContent) {
            handleCourseEvaluation(courseEvaluateContent);
            return;
        }

        // 检查教师评教表格
        const teacherEvaluateTables = document.querySelectorAll('table.gridtable');
        if (teacherEvaluateTables.length > 0) {
            for (let table of teacherEvaluateTables) {
                // 检查是否包含评教选项
                const radioInputs = table.querySelectorAll('input[type="radio"]');
                if (radioInputs.length > 0) {
                    handleTeacherEvaluation(table);
                }
            }
            return;
        }

        updateStatus('未检测到评教表格');
    }

    // 处理课程评教
    function handleCourseEvaluation(container) {
        const rows = container.querySelectorAll('tr');
        if (rows.length <= 1) {
            updateStatus('未找到有效的课程评教行');
            return;
        }

        updateStatus('正在填写课程评教...');

        // 获取所有包含评教选项的行（排除表头行）
        const evaluationRows = [];
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].querySelectorAll('input[type="radio"]').length > 0) {
                evaluationRows.push(rows[i]);
            }
        }

        // 自动选择选项
        for (let i = 0; i < evaluationRows.length; i++) {
            const radioButtons = evaluationRows[i].querySelectorAll('input[type="radio"]');
            if (radioButtons.length === 0) continue;

            // 确定要选择的选项（最后一个选B，其他选A）
            // A选项的值是2，B选项的值是1
            const isLastQuestion = (i === evaluationRows.length - 1);
            const optionValue = isLastQuestion ? '1' : '2'; // 最后一个选B(1)，其他选A(2)

            for (let radio of radioButtons) {
                if (radio.value === optionValue) {
                    radio.checked = true;
                    break;
                }
            }
        }

        updateStatus('课程评教已完成！共处理 ' + evaluationRows.length + ' 个问题');
    }

    // 处理教师评教
    function handleTeacherEvaluation(table) {
        const rows = table.querySelectorAll('tr');
        if (rows.length <= 1) {
            updateStatus('未找到有效的教师评教行');
            return;
        }

        updateStatus('正在填写教师评教...');

        // 获取所有包含评教选项的行（排除表头行）
        const evaluationRows = [];
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].querySelectorAll('input[type="radio"]').length > 0) {
                evaluationRows.push(rows[i]);
            }
        }

        // 自动选择选项
        for (let i = 0; i < evaluationRows.length; i++) {
            const radioButtons = evaluationRows[i].querySelectorAll('input[type="radio"]');
            if (radioButtons.length === 0) continue;

            // 确定要选择的选项（最后一个选B，其他选A）
            // A选项的值是2，B选项的值是1
            const isLastQuestion = (i === evaluationRows.length - 1);
            const optionValue = isLastQuestion ? '1' : '2'; // 最后一个选B(1)，其他选A(2)

            for (let radio of radioButtons) {
                if (radio.value === optionValue) {
                    radio.checked = true;
                    break;
                }
            }
        }

        updateStatus('教师评教已完成！共处理 ' + evaluationRows.length + ' 个问题');
    }

    // 等待页面完全加载后执行
    window.addEventListener('load', function() {
        // 添加一点延迟确保DOM完全加载
        setTimeout(function() {
            createFloatingWindow();
            runAutoEvaluate();
        }, 1000);
    });

    // 观察DOM变化，以应对动态加载的评教表格
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // 检测新添加的节点是否包含评教表格
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.id === 'courseEvaluateContent' ||
                            node.querySelector('#courseEvaluateContent') ||
                            node.classList.contains('gridtable') ||
                            node.querySelector('.gridtable')) {
                            setTimeout(runAutoEvaluate, 500);
                            break;
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})(); 