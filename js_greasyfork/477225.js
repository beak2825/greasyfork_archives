// ==UserScript==
// @name         Mobile Jira Create Task Tool
// @namespace    http://www.akuvox.com/
// @version      1.1
// @description  Help create task
// @author       Bink
// @match        http://192.168.10.2:82/secure/*
// @grant        none
// @license      111
// @downloadURL https://update.greasyfork.org/scripts/477225/Mobile%20Jira%20Create%20Task%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/477225/Mobile%20Jira%20Create%20Task%20Tool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 监听新建按钮的点击事件
    var createButton = document.getElementById('create_link');
    if (createButton) {
        createButton.addEventListener('click', function () {
            // 等待页面加载完成
            var waitForDialogInterval = setInterval(function () {
                var createIssueDialog = document.querySelector('#create-issue-dialog');
                if (createIssueDialog) {
                    clearInterval(waitForDialogInterval);
                    // 获取当前用户信息
                    var currentUser = document.querySelector('meta[name="ajs-remote-user"]').getAttribute('content');

                    var defaultSummaryInputValue = '(版本)#APP-安卓-开发#开发#';
                    // 创建一个数组包含允许的用户名
                    var androidUsers = ['Bink', 'yisha.yang', 'jiawei.dai','han.lin'];
                    if (androidUsers.includes(currentUser)) {
                        defaultSummaryInputValue = '(版本)#APP-安卓-开发#开发#';
                    } else {
                        defaultSummaryInputValue = '(版本)#APP-IOS-开发#开发#';
                    }

                    // 等待直到弹窗内容加载完成
                    var observer = new MutationObserver(function (mutationsList, observer) {
                        for (var mutation of mutationsList) {
                            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                // 弹窗内容已添加到DOM
                                var qfContainer = createIssueDialog.querySelector('.qf-container');
                                if (qfContainer) {
                                    // 找到项目选择框的元素
                                    var projectSelect = document.getElementById('project');
                                    // 设置默认选中项的值为 "10401"
                                    projectSelect.value = '10401';

                                    var summaryInput = qfContainer.querySelector('input#summary');
                                    if (summaryInput) {
                                        summaryInput.value = defaultSummaryInputValue;
                                    }

                                    // 找到经办人字段的元素
                                    var assigneeField = document.getElementById('assignee-field');
                                    var assigneeSingleSelect = document.getElementById('assignee-single-select');
                                    var assigneeSelect = document.getElementById('assignee');

                                    if (assigneeField && assigneeSingleSelect && assigneeSelect) {
                                        // 替换经办人字段的值为当前用户
                                        assigneeField.value = 'current-user';
                                        assigneeSelect.value = '-1';

                                        // 模拟选择"分配给我"操作
                                        var assignToMeTrigger = document.getElementById('assign-to-me-trigger');
                                        if (assignToMeTrigger) {
                                            assignToMeTrigger.click();
                                        }

                                        // 触发经办人字段的变更事件
                                        var changeEvent = new Event('change', {
                                            bubbles: true,
                                            cancelable: true
                                        });
                                        assigneeSelect.dispatchEvent(changeEvent);

                                        var assigneeEntityIcon = assigneeSingleSelect.querySelector('.aui-ss-entity-icon');
                                        var currentUserAvatar = document.querySelector('#current-user-avatar'); // 使用当前用户头像的唯一 ID
                                        if (assigneeEntityIcon && currentUserAvatar) {
                                            assigneeEntityIcon.src = currentUserAvatar.src;
                                        }
                                    }

                                    observer.disconnect(); // 停止监听
                                }
                            }
                        }
                    });

                    // 配置观察选项
                    var config = { childList: true, subtree: true };
                    // 开始观察
                    observer.observe(createIssueDialog, config);
                }
            }, 100); // 100毫秒检查一次弹窗是否加载完成
        });
    }
})();