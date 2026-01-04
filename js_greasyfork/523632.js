// ==UserScript==
// @name         教学评价自动处理脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动处理教学评价表单提交及评估（自动连续处理版本）
// @author       https://github.com/overflow0verture
// @match        http://stu.j.tjcu.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523632/%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523632/%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 暂停状态标志
    let isPaused = false;

    // 评教文本库
    const evaluationTexts = [
        "老师授课认真负责,讲解深入浅出,课堂氛围活跃",
        "教学内容充实,方法灵活多样,让人受益匪浅",
        "理论结合实践,案例丰富新颖,教学效果出色",
        "讲课思路清晰,重点难点突出,知识传授到位",
        "课堂互动频繁,学习氛围浓厚,收获很大"
    ];

    // 创建日志显示区域
    function createLogDisplay() {
        const logDiv = document.createElement('div');
        logDiv.style.position = 'fixed';
        logDiv.style.bottom = '20px';
        logDiv.style.right = '20px';
        logDiv.style.width = '300px';
        logDiv.style.maxHeight = '200px';
        logDiv.style.overflowY = 'auto';
        logDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        logDiv.style.color = 'white';
        logDiv.style.padding = '10px';
        logDiv.style.borderRadius = '5px';
        logDiv.style.fontSize = '12px';
        logDiv.style.zIndex = '9999';
        logDiv.id = 'evaluationLog';
        document.body.appendChild(logDiv);
        return logDiv;
    }

    // 添加日志
    function addLog(message) {
        const logDiv = document.getElementById('evaluationLog') || createLogDisplay();
        const logEntry = document.createElement('div');
        logEntry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
        logDiv.insertBefore(logEntry, logDiv.firstChild);
        console.log(message);
    }

    function getPageType() {
        const path = window.location.pathname;
        if (path.includes('/evaluation/index')) return 'list';
        if (path.includes('/evaluationPage')) return 'evaluation';
        return 'unknown';
    }

    // 监听并自动点击确认按钮
    // 监听并自动点击确认按钮
function autoConfirm() {
    return new Promise(resolve => {
        // 在点击提交之前就设置自动继续标记
        sessionStorage.setItem('autoContinue', 'true');

        const originalConfirm = layer.confirm;
        layer.confirm = function(content, options, callback) {
            if (callback && typeof callback === 'function') {
                setTimeout(() => {
                    callback(true);
                    resolve();
                }, 500);
            }
        };

        const submitButton = document.querySelector('#buttonSubmit');
        if (submitButton) {
            submitButton.click();
        }
    });
}

// 提交评估并返回列表页
async function submitEvaluationAndReturn() {
    addLog('提交评估并准备返回列表页...');
    // 确保在任何操作之前设置自动继续标记
    sessionStorage.setItem('autoContinue', 'true');
    await new Promise(resolve => setTimeout(resolve, 5000));
    window.location.href = 'http://stu.j.tjcu.edu.cn/student/teachingEvaluation/evaluation/index';
}

    // 监听倒计时并在时间到时提交
    function waitForSubmitTime() {
        return new Promise(resolve => {
            const checkTime = setInterval(() => {
                if (isPaused) return;

                const minutes = document.getElementById('RemainM');
                const seconds = document.getElementById('RemainS');

                if (minutes && seconds) {
                    if (minutes.textContent === '0' && seconds.textContent === '0') {
                        clearInterval(checkTime);
                        setTimeout(() => {
                            autoConfirm().then(() => {
                                resolve();
                            });
                        }, 1000);
                    }
                }
            }, 1000);
        });
    }

    // 实现评估填写逻辑
    async function fillEvaluation(status) {
        addLog('开始填写评估表...');

        return new Promise(resolve => {
            const radioGroups = {};
            const radios = document.querySelectorAll('input[type="radio"]');

            radios.forEach(radio => {
                if (!radioGroups[radio.name]) {
                    radioGroups[radio.name] = [];
                }
                radioGroups[radio.name].push(radio);
            });

            Object.values(radioGroups).forEach(group => {
                group[0].checked = true;
            });

            const zgpj = document.querySelector('textarea[name="zgpj"]');
            if (zgpj) {
                zgpj.value = evaluationTexts[Math.floor(Math.random() * evaluationTexts.length)];
            }

            const optTypeInput = document.querySelector('#optType');
            if (optTypeInput) {
                optTypeInput.value = 'submit';
            }

            waitForSubmitTime().then(() => {
                resolve();
            });
        });
    }

    // 提交评估并返回列表页
    async function submitEvaluationAndReturn() {
        addLog('提交评估并准备返回列表页...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        // 设置自动继续标记
        sessionStorage.setItem('autoContinue', 'true');
        window.location.href = 'http://stu.j.tjcu.edu.cn/student/teachingEvaluation/evaluation/index';
    }

    // 创建提交表单的函数
    function submitForm(item) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'http://stu.j.tjcu.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage';

        const addField = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        };

        addField('evaluatedPeople', item.evaluatedPeople);
        addField('evaluatedPeopleNumber', item.id.evaluatedPeople);
        addField('questionnaireCode', item.id.questionnaireCoding);
        addField('questionnaireName', item.questionnaire.questionnaireName);
        addField('evaluationContentNumber', item.id.evaluationContentNumber);

        document.body.appendChild(form);
        addLog(`准备提交评价 - ${item.evaluatedPeople}...`);

        form.submit();
    }

    // 处理列表页面
    function handleListPage() {
        if (!isPaused) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://stu.j.tjcu.edu.cn/student/teachingEvaluation/teachingEvaluation/search', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onload = async function() {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    const unEvaluatedItems = data.data.filter(item => item.isEvaluated === "否");

                    if (unEvaluatedItems.length > 0) {
                        addLog(`发现 ${unEvaluatedItems.length} 个未评价项目，开始处理下一个`);
                        submitForm(unEvaluatedItems[0]);
                    } else {
                        addLog('所有评价已处理完成！');
                        sessionStorage.removeItem('autoContinue');
                    }
                }
            };

            xhr.send('optType=1&pageSize=50');
        }
    }

    // 处理评估页面
    async function handleEvaluationPage(status) {
        status.appendChild(createControlButton());

        if (!isPaused) {
            await fillEvaluation(status);
            await submitEvaluationAndReturn();
        } else {
            addLog('评价处理已暂停，等待继续...');
            const waitForResume = setInterval(() => {
                if (!isPaused) {
                    clearInterval(waitForResume);
                    fillEvaluation(status).then(() => {
                        submitEvaluationAndReturn();
                    });
                }
            }, 1000);
        }
    }

    // 创建控制按钮
    function createControlButton() {
        const button = document.createElement('button');
        button.style.padding = '8px 16px';
        button.style.backgroundColor = isPaused ? '#4CAF50' : '#f44336';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '10px';
        button.textContent = isPaused ? '开始' : '暂停';

        button.onclick = () => {
            isPaused = !isPaused;
            button.textContent = isPaused ? '开始' : '暂停';
            button.style.backgroundColor = isPaused ? '#4CAF50' : '#f44336';
            addLog(isPaused ? '已暂停评价处理' : '继续评价处理');

            const pageType = getPageType();
            if (!isPaused) {
                if (pageType === 'list') {
                    handleListPage();
                } else if (pageType === 'evaluation') {
                    fillEvaluation(document.querySelector('.status')).then(() => {
                        submitEvaluationAndReturn();
                    });
                }
            }
        };

        return button;
    }

    // 页面加载完成后执行
    window.onload = async function() {
        const pageType = getPageType();
        createLogDisplay();

        // 添加状态显示
        const status = document.createElement('div');
        status.className = 'status';
        status.style.position = 'fixed';
        status.style.top = '20px';
        status.style.right = '20px';
        status.style.zIndex = '9999';
        status.style.padding = '10px';
        status.style.backgroundColor = '#4CAF50';
        status.style.color = 'white';
        status.style.borderRadius = '5px';
        status.style.fontSize = '14px';
        document.body.appendChild(status);

        if (pageType === 'list') {
            if (sessionStorage.getItem('autoContinue') === 'true') {
                // 如果是自动继续模式，直接继续处理下一个
                addLog('继续处理下一个评价...');
                status.appendChild(createControlButton());
                handleListPage();
            } else {
                // 首次启动，显示开始按钮
                const startButton = document.createElement('button');
                startButton.textContent = '开始处理评价';
                startButton.onclick = () => {
                    handleListPage();
                    status.removeChild(startButton);
                    status.appendChild(createControlButton());
                };
                status.appendChild(startButton);
            }
        } else if (pageType === 'evaluation') {
            await handleEvaluationPage(status);
        }
    };
})();