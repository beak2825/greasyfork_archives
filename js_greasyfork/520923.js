// ==UserScript==
// @name         muc中央民族大学自动教评脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动教评
// @author       只爱吃排骨
// @match        https://jwxs.muc.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520923/muc%E4%B8%AD%E5%A4%AE%E6%B0%91%E6%97%8F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520923/muc%E4%B8%AD%E5%A4%AE%E6%B0%91%E6%97%8F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建可拖动的悬浮窗
    var floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.bottom = '10px';
    floatingWindow.style.right = '10px';
    floatingWindow.style.width = '300px'; // 增加宽度
    floatingWindow.style.height = '250px'; // 增加高度
    floatingWindow.style.backgroundColor = '#f0f0f0';
    floatingWindow.style.border = '2px solid #ccc';
    floatingWindow.style.borderRadius = '8px';
    floatingWindow.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    floatingWindow.style.zIndex = '1000';
    floatingWindow.style.overflow = 'auto';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.cursor = 'move';
    document.body.appendChild(floatingWindow);

    // 添加脚本信息和作者信息
    var scriptInfo = document.createElement('div');
    scriptInfo.innerHTML = '<strong>脚本名称:</strong> muc中央民族大学自动教评脚本<br><strong>作者:</strong> 只爱吃排骨<br><strong>作者博客:</strong> <a href="https://www.cznorth.cn" target="_blank">https://www.cznorth.cn</a>';
    scriptInfo.style.marginBottom = '10px';
    floatingWindow.appendChild(scriptInfo);

    // 创建开始按钮
    var startButton = document.createElement('button');
    startButton.style.width = '100%';
    startButton.style.padding = '5px';
    startButton.style.marginBottom = '10px';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '4px';
    startButton.style.cursor = 'pointer';
    floatingWindow.appendChild(startButton);

    // 创建日志显示区域
    var logArea = document.createElement('div');
    logArea.style.maxHeight = '100px'; // 增加日志显示区域高度
    logArea.style.overflowY = 'auto';
    floatingWindow.appendChild(logArea);

    // 日志函数
    function log(message) {
        var logEntry = document.createElement('div');
        logEntry.innerText = message;
        logArea.appendChild(logEntry);
        logArea.scrollTop = logArea.scrollHeight; // 自动滚动到底部
    }

    // 使悬浮窗可拖动
    floatingWindow.onmousedown = function(event) {
        var shiftX = event.clientX - floatingWindow.getBoundingClientRect().left;
        var shiftY = event.clientY - floatingWindow.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            floatingWindow.style.left = pageX - shiftX + 'px';
            floatingWindow.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        floatingWindow.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            floatingWindow.onmouseup = null;
        };
    };

    floatingWindow.ondragstart = function() {
        return false;
    };

    // 检查本地存储中的状态
    var isStarted = localStorage.getItem('isStarted') === 'true';

    // 更新按钮文本
    function updateButtonText() {
        startButton.innerText = isStarted ? '停止教评' : '开始教评';
    }

    // 执行教评逻辑
    function executeEvaluation() {
        if (!window.location.href.includes('newEval')) {
            window.location.href = 'https://jwxs.muc.edu.cn/student/teachingEvaluation/newEvaluation/index';
        }
        setTimeout(function() {
            var teacherTab = document.querySelector('a[data-toggle="tab"][href="#home"]');
            if (teacherTab) {
                teacherTab.click();
                clickTab('ktjs');
                log('点击了课堂教师标签');
            }
            setTimeout(function() {
                // 获取所有的评估按钮
                var evaluationButtons = document.querySelectorAll('button[flag="jxpg"]');

                // 遍历所有的评估按钮
                evaluationButtons.forEach(function(button) {
                    // 触发点击事件
                    button.click();
                    // 打印日志
                    log('点击了一个评估按钮');
                });
            }, 1000);

            // 获取所有的单选框
            var radioButtons = document.querySelectorAll('input[type="radio"]');

            // 遍历所有的单选框
            radioButtons.forEach(function(radio) {
                // 检查单选框的值是否包含“B_非常符合”
                if (radio.value.includes("非常符合") || radio.value.includes("非常清楚") || radio.value.includes("完全达成") || 
                radio.value.includes("非常大") || radio.value.includes("非常满意")
                ||radio.value.includes("非常愿意")) {
                    // 选中单选框
                    radio.checked = true;
                    // 打印日志
                    log('选中了一个值为“B_非常符合”的单选框');
                }
            });
            // 获取所有的文本框
            var textBoxes = document.querySelectorAll('textarea');

            // 遍历所有的文本框
            textBoxes.forEach(function(textBox) {
                textBox.value = "老师非常好，讲课内容丰富，条理清晰，课堂气氛活跃，能够很好地引导学生思考和讨论。";
                // 打印日志
                log('填上了“非常好”的文本框');
            });
            // 获取保存按钮
            var saveButton = document.getElementById('savebutton');
            log('60秒后点击保存按钮');
            setTimeout(function() {
                if (saveButton) {
                    saveButton.click();
                    log('点击了保存按钮');
                }
            }, 61000); // 60000毫秒等于1分钟
        }, 1000);
    }

    // 点击开始按钮时执行或停止脚本
    startButton.addEventListener('click', function() {
        isStarted = !isStarted;
        localStorage.setItem('isStarted', isStarted);
        updateButtonText();

        if (isStarted) {
            executeEvaluation();
        }
    });

    // 如果已经开始教评，自动执行
    if (isStarted) {
        executeEvaluation();
    }

    // 初始化按钮文本
    updateButtonText();
})();
