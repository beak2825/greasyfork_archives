// ==UserScript==
// @name         信阳学院自动评教
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license MIT
// @description  自动完成所有评教，全选优秀但随机一个选良好，自动跳转到下一个老师
// @author       AI助手
// @match        https://jw.xyu.edu.cn/eams/homeExt.action*
// @match        https://jw.xyu.edu.cn/eams/quality/stdEvaluate*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536673/%E4%BF%A1%E9%98%B3%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/536673/%E4%BF%A1%E9%98%B3%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        console.log('页面加载完成，检查页面类型...');

        // 检查是否在评教列表页面
        if (document.querySelector('.gridtable') && !document.querySelector('#question-list')) {
            console.log('当前在评教列表页面');
            addAutoEvaluateAllButton();

            // 如果URL中包含自动评教参数，自动点击下一个评教链接
            if (window.location.href.includes('autoEvaluate=true')) {
                console.log('检测到自动评教参数，准备点击下一个评教链接');
                setTimeout(clickNextEvaluationLink, 1000);
            }
        }

        // 检查是否在评教问卷页面
        else if (document.querySelector('#question-list')) {
            console.log('当前在评教问卷页面，开始自动评教...');
            setTimeout(function() {
                autoEvaluate();

                // 如果URL中包含自动评教参数，自动提交
                if (window.location.href.includes('autoEvaluate=true')) {
                    console.log('检测到自动评教参数，3秒后自动提交');
                    setTimeout(function() {
                        document.querySelector('#sub').click();
                    }, 3000);
                }
            }, 1000);
        }
    });

    // 添加"自动评教全部"按钮
    function addAutoEvaluateAllButton() {
        const gridDiv = document.querySelector('.grid');
        if (!gridDiv) return;

        const autoEvalAllBtn = document.createElement('button');
        autoEvalAllBtn.textContent = '自动评教全部';
        autoEvalAllBtn.style.backgroundColor = '#4CAF50';
        autoEvalAllBtn.style.color = 'white';
        autoEvalAllBtn.style.padding = '10px 15px';
        autoEvalAllBtn.style.margin = '10px 0';
        autoEvalAllBtn.style.border = 'none';
        autoEvalAllBtn.style.borderRadius = '4px';
        autoEvalAllBtn.style.cursor = 'pointer';
        autoEvalAllBtn.style.fontSize = '16px';

        autoEvalAllBtn.onclick = function() {
            if (confirm('确定要自动完成所有评教吗？将会自动选择所有选项为"优秀"，但每个问卷随机一个选项为"良好"。')) {
                clickNextEvaluationLink();
            }
        };

        // 将按钮添加到表格前面
        gridDiv.parentNode.insertBefore(autoEvalAllBtn, gridDiv);

        // 添加状态显示区域
        const statusDiv = document.createElement('div');
        statusDiv.id = 'autoEvalStatus';
        statusDiv.style.margin = '10px 0';
        statusDiv.style.padding = '10px';
        statusDiv.style.backgroundColor = '#f8f8f8';
        statusDiv.style.border = '1px solid #ddd';
        statusDiv.style.borderRadius = '4px';
        statusDiv.innerHTML = '<b>自动评教状态：</b>就绪，点击上方按钮开始自动评教';

        gridDiv.parentNode.insertBefore(statusDiv, gridDiv);
    }

    // 点击下一个评教链接
    function clickNextEvaluationLink() {
        const evalLinks = document.querySelectorAll('a[href*="stdEvaluate!answer.action"]');

        if (evalLinks.length > 0) {
            // 更新状态
            const statusDiv = document.getElementById('autoEvalStatus');
            if (statusDiv) {
                statusDiv.innerHTML = `<b>自动评教状态：</b>正在处理，剩余 ${evalLinks.length} 个评教任务...`;
            }

            console.log(`找到 ${evalLinks.length} 个未完成的评教链接，点击第一个`);

            // 修改链接，添加自动评教参数
            let nextLink = evalLinks[0].href;
            if (nextLink.includes('?')) {
                nextLink += '&autoEvaluate=true';
            } else {
                nextLink += '?autoEvaluate=true';
            }

            // 点击链接
            window.location.href = nextLink;
        } else {
            console.log('没有找到未完成的评教链接，评教已全部完成');

            // 更新状态
            const statusDiv = document.getElementById('autoEvalStatus');
            if (statusDiv) {
                statusDiv.innerHTML = '<b>自动评教状态：</b>所有评教任务已完成！';
                statusDiv.style.backgroundColor = '#e6ffe6';
                statusDiv.style.border = '1px solid #4CAF50';
            }

            alert('所有评教任务已完成！');
        }
    }

    // 自动填写评教问卷
    function autoEvaluate() {
        // 获取所有问题
        const questions = document.querySelectorAll('.qBox.objective.required');
        if (questions.length === 0) {
            console.log('未找到评教问题，请检查页面结构');
            return;
        }

        console.log(`找到 ${questions.length} 个评教问题`);

        // 随机选择一个问题设为"良好"
        const randomIndex = Math.floor(Math.random() * questions.length);
        console.log(`随机选择第 ${randomIndex + 1} 个问题设为"良好"`);

        // 遍历所有问题
        questions.forEach((question, index) => {
            const questionId = question.id.replace('question_', '');

            // 如果是随机选中的问题，选择"良好"
            if (index === randomIndex) {
                const goodOption = document.querySelector(`#option_${questionId}_1`);
                if (goodOption) {
                    goodOption.click();
                    console.log(`问题 ${questionId} 已选择"良好"`);
                }
            }
            // 其他问题选择"优秀"
            else {
                const excellentOption = document.querySelector(`#option_${questionId}_0`);
                if (excellentOption) {
                    excellentOption.click();
                    console.log(`问题 ${questionId} 已选择"优秀"`);
                }
            }
        });

        // 添加一个自动提交按钮
        const autoSubmitBtn = document.createElement('button');
        autoSubmitBtn.textContent = '自动提交评教';
        autoSubmitBtn.style.backgroundColor = '#4CAF50';
        autoSubmitBtn.style.color = 'white';
        autoSubmitBtn.style.padding = '10px 15px';
        autoSubmitBtn.style.margin = '10px';
        autoSubmitBtn.style.border = 'none';
        autoSubmitBtn.style.borderRadius = '4px';
        autoSubmitBtn.style.cursor = 'pointer';

        autoSubmitBtn.onclick = function() {
            document.querySelector('#sub').click();
        };

        // 将按钮添加到页面
        const submitArea = document.querySelector('#sub').parentNode;
        submitArea.insertBefore(autoSubmitBtn, submitArea.firstChild);

        // 显示评教信息
        const teacherInfo = document.querySelector('#base-info p');
        if (teacherInfo) {
            console.log('当前评教信息: ' + teacherInfo.textContent);

            // 添加评教信息显示
            const infoDiv = document.createElement('div');
            infoDiv.style.margin = '10px';
            infoDiv.style.padding = '10px';
            infoDiv.style.backgroundColor = '#f0f8ff';
            infoDiv.style.border = '1px solid #add8e6';
            infoDiv.style.borderRadius = '4px';
            infoDiv.innerHTML = `
                <p><b>自动评教进行中</b></p>
                <p>当前评教: ${teacherInfo.textContent}</p>
                <p>已随机选择第 ${randomIndex + 1} 个问题为"良好"，其余为"优秀"</p>
                <p>自动模式下将在3秒后提交</p>
            `;

            const headDiv = document.querySelector('#head');
            if (headDiv) {
                headDiv.parentNode.insertBefore(infoDiv, headDiv.nextSibling);
            }
        }

        console.log('自动评教完成，请检查并提交');
    }
})();
