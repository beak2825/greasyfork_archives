// ==UserScript==
// @name         华南理工大学计算机相关课程自动互评脚本（默认好评）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  该网站互评时开启，能够实现打分-评语-切换下一题自动化
// @author       BAIKEMARK
// @match        http://1024.se.scut.edu.cn/*
// @grant        none
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/519362/%E5%8D%8E%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%9B%B8%E5%85%B3%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84%E8%84%9A%E6%9C%AC%EF%BC%88%E9%BB%98%E8%AE%A4%E5%A5%BD%E8%AF%84%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/519362/%E5%8D%8E%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%9B%B8%E5%85%B3%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84%E8%84%9A%E6%9C%AC%EF%BC%88%E9%BB%98%E8%AE%A4%E5%A5%BD%E8%AF%84%EF%BC%89.meta.js
// ==/UserScript==

javascript:(function() {
    // 脚本2: 自动选择选项
    setInterval(function() {
        var lastExecuted = localStorage.getItem('script2_lastExecuted');
        var currentTime = Date.now();

        // 获取当前日志
        var log = localStorage.getItem('script2_log') || '';

        // 如果lastExecuted为null，说明第一次执行，初始化
        if (lastExecuted === null) {
            lastExecuted = 0; // 设置初始值为0，强制第一次执行
        }

        var logMessage = "脚本2开始执行，当前时间：" + currentTime + ", 上次执行时间：" + lastExecuted;
        log += logMessage + '\n';
        console.log(logMessage);

        // 检查是否超过16秒
        if (currentTime - lastExecuted >= 16000) {
            var studentSelect = document.getElementById('MainContent_dropStudent');
            if (studentSelect) {
                var currentSelectedIndex = studentSelect.selectedIndex;
                var currentSelectedValue = studentSelect.value;
                logMessage = "当前选择的学生值：" + currentSelectedValue;
                log += logMessage + '\n';
                console.log(logMessage);

                if (currentSelectedValue === '作业003') {
                    var titleSelect = document.getElementById('MainContent_dropTitleList');
                    if (titleSelect) {
                        var currentTitleIndex = titleSelect.selectedIndex;
                        var nextTitleOption = titleSelect.options[currentTitleIndex + 1];
                        if (nextTitleOption) {
                            titleSelect.value = nextTitleOption.value;
                            titleSelect.dispatchEvent(new Event('change'));
                            logMessage = "切换到下一个标题";
                            log += logMessage + '\n';
                            console.log(logMessage);
                        } else {
                            logMessage = "未找到下一个标题选项";
                            log += logMessage + '\n';
                            console.log(logMessage);
                        }
                    } else {
                        logMessage = "未找到标题选择框";
                        log += logMessage + '\n';
                        console.log(logMessage);
                    }

                    var firstOption = studentSelect.options[0];
                    studentSelect.value = firstOption.value;
                    studentSelect.dispatchEvent(new Event('change'));
                    logMessage = "学生选择框切换回第一个学生";
                    log += logMessage + '\n';
                    console.log(logMessage);
                } else {
                    var nextStudentOption = studentSelect.options[currentSelectedIndex + 1];
                    if (nextStudentOption) {
                        studentSelect.value = nextStudentOption.value;
                        studentSelect.dispatchEvent(new Event('change'));
                        logMessage = "切换到下一个学生";
                        log += logMessage + '\n';
                        console.log(logMessage);
                    } else {
                        logMessage = "已是最后一个学生";
                        log += logMessage + '\n';
                        console.log(logMessage);
                    }
                }
            } else {
                logMessage = "未找到学生选择框";
                log += logMessage + '\n';
                console.log(logMessage);
            }

            // 更新lastExecuted时间
            localStorage.setItem('script2_lastExecuted', currentTime);
            logMessage = "脚本2执行完毕，更新时间戳：" + currentTime;
            log += logMessage + '\n';
            console.log(logMessage);
        } else {
            logMessage = "脚本2未执行，原因：距离上次执行时间不足16秒";
            log += logMessage + '\n';
            console.log(logMessage);
        }

        // 保存日志到 localStorage
        localStorage.setItem('script2_log', log);
    }, 16000); // 每16秒执行一次

    // 脚本1: 自动选择评分
    var lastExecuted = localStorage.getItem('script1_lastExecuted');
    var currentTime = Date.now();

    // 获取当前日志
    var log = localStorage.getItem('script1_log') || '';

    // 如果lastExecuted为null，说明第一次执行，初始化
    if (lastExecuted === null) {
        lastExecuted = 0; // 设置初始值为0，强制第一次执行
    }

    var logMessage = "脚本1开始执行，当前时间：" + currentTime + ", 上次执行时间：" + lastExecuted;
    log += logMessage + '\n';
    console.log(logMessage);

    // 检查是否超过15秒
    if (currentTime - lastExecuted >= 15000) {
        var selectElement = document.getElementById('MainContent_dropScore');
        if (selectElement) {
            selectElement.value = '100';
            logMessage = "选择了100分";
            log += logMessage + '\n';
            console.log(logMessage);
        } else {
            logMessage = "未找到选择框";
            log += logMessage + '\n';
            console.log(logMessage);
        }

        var commentBox = document.getElementById('MainContent_txtRemark');
        if (commentBox) {
            commentBox.value = '回答的很好，100分';
            logMessage = "设置了评语";
            log += logMessage + '\n';
            console.log(logMessage);
        } else {
            logMessage = "未找到评语框";
            log += logMessage + '\n';
            console.log(logMessage);
        }

        var submitButton = document.getElementById('MainContent_btnScore');
        if (submitButton) {
            submitButton.click();
            logMessage = "提交按钮被点击";
            log += logMessage + '\n';
            console.log(logMessage);
        } else {
            logMessage = "未找到提交按钮";
            log += logMessage + '\n';
            console.log(logMessage);
        }

        // 更新lastExecuted时间
        localStorage.setItem('script1_lastExecuted', currentTime);
        logMessage = "脚本1执行完毕，更新时间戳：" + currentTime;
        log += logMessage + '\n';
        console.log(logMessage);
    } else {
        logMessage = "脚本1未执行，原因：距离上次执行时间不足15秒";
        log += logMessage + '\n';
        console.log(logMessage);
    }

    // 保存日志到 localStorage
    localStorage.setItem('script1_log', log);
})();
