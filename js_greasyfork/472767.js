// ==UserScript==
// @name         联新禅道18.1自动创建主任务
// @namespace    https://example.com
// @version      1.0.4
// @description  进入冲刺故事页后批量创建各个故事的主任务(适配禅道18.1)
// @author       梁殿豪
// @match        http://10.2.3.109:1024/zentao/project-story-*.html
// @match        http://183.62.162.28:1024/zentao/project-story-*.html
// @match        http://10.2.3.109:1024/zentao/execution-story-*.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472767/%E8%81%94%E6%96%B0%E7%A6%85%E9%81%93181%E8%87%AA%E5%8A%A8%E5%88%9B%E5%BB%BA%E4%B8%BB%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/472767/%E8%81%94%E6%96%B0%E7%A6%85%E9%81%93181%E8%87%AA%E5%8A%A8%E5%88%9B%E5%BB%BA%E4%B8%BB%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听页面加载完成事件
    $(document).ready(function() {
        // 禅道18.1的故事列表选择器可能已变化
        var tbody = document.querySelector('#storyList tbody');
        if (!tbody) {
            // 尝试备选选择器
            tbody = document.querySelector('#storyTable tbody');
            if (!tbody) {
                alert('无法找到故事列表，请确认页面结构是否已变化');
                return;
            }
        }

        // 获取tbody中的所有tr元素
        var stories = Array.from(tbody.querySelectorAll('tr[data-id]'));

// 检查是否有需要创建任务的故事
var needCreated = stories.some(function(story) {
    // 使用新的任务数量选择器
    var taskNumElement = story.querySelector('.datatable-cell.c-taskCount');

    // 检查元素是否存在且内容不为0
    return !taskNumElement || taskNumElement.textContent.trim() === '0';
});

关键修改点

        if (needCreated) {
            var confirmed = confirm("是否需要批量创建禅道主任务？");

            // 根据用户选择执行相应操作
            if (confirmed) {
                var assignee = prompt("请输入指派人：");
                if (assignee) {
                    // 记录成功和失败的任务数
                    var successCount = 0;
                    var failCount = 0;

                    // 遍历每个故事
                    var processStory = function(index) {
                        if (index >= stories.length) {
                            // 所有故事处理完成
                            alert(`任务创建完成！成功: ${successCount}, 失败: ${failCount}`);
                            return;
                        }

                        var story = stories[index];
                        var storyId = story.getAttribute('data-id');

                        // 获取故事标题
                        var nameElement = story.querySelector('.c-name .text') ||
                            story.querySelector('.c-name a') ||
                            story.querySelector('.c-name') ||
                            story.querySelector('td:nth-child(2)') ||
                            story.querySelector('td:nth-child(3)') ||
                            story.querySelector('[data-field="title"]') ||
                            story.querySelector('[data-field="name"]');

                        var name = nameElement ? nameElement.textContent.trim() : `任务${storyId}`;
                        name = storyId + ':' + name;

                        // 获取优先级
                        var priElement = story.querySelector('.c-pri .label') ||
                                         story.querySelector('.c-pri');
                        var pri = priElement ? priElement.textContent.trim() : '3';

                        // 检查是否已有任务
                        var taskNumElement = story.querySelector('.linkbox') ||
                                            story.querySelector('.c-tasks .label') ||
                                            story.querySelector('.c-actions a:nth-child(2)');
                        var taskNum = taskNumElement ? taskNumElement.textContent.trim() : '0';

                        if (taskNum !== '0' && taskNum !== '') {
                            // 已有任务，跳过
                            processStory(index + 1);
                            return;
                        }

                        // 获取项目ID和创建任务URL
                        var createTaskUrl = '';
                        var projectId = '';

                        // 尝试从操作按钮获取URL
                        var actionButtons = story.querySelectorAll('.c-actions a, .dropdown-menu a');
                        for (var i = 0; i < actionButtons.length; i++) {
                            var button = actionButtons[i];
                            if (button.href && button.href.includes('task-create-')) {
                                createTaskUrl = button.href;
                                // 使用正则表达式提取projectId
                                var regex = /task-create-(\d+)-/;
                                var match = createTaskUrl.match(regex);
                                if (match && match[1]) {
                                    projectId = match[1];
                                    break;
                                }
                            }
                        }

                        if (!createTaskUrl || !projectId) {
                            console.error('无法获取创建任务URL或项目ID', story);
                            failCount++;
                            processStory(index + 1);
                            return;
                        }

                        // 创建任务的请求参数
                        var params = new URLSearchParams();
                        params.append('name', name);
                        params.append('assignedTo[]', assignee);
                        params.append('type', 'devel');
                        params.append('execution', projectId);
                        params.append('status', 'wait');
                        params.append('story', storyId);
                        params.append('pri', pri);
                        params.append('module', '0');

                        // 发送创建任务的请求
                        fetch(createTaskUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Accept': 'application/json, text/javascript, */*; q=0.01',
                                'X-Requested-With': 'XMLHttpRequest' // 可能需要添加这个头
                            },
                            body: params
                        })
                        .then(function(response) {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('请求失败: ' + response.status);
                            }
                        })
                        .then(function(data) {
                            // 检查禅道18.1的返回格式
                            if (data && data.result === 'success') {
                                successCount++;
                                console.log(`成功创建任务: ${name}`);
                            } else {
                                failCount++;
                                console.error('创建任务失败:', data);
                            }
                            processStory(index + 1);
                        })
                        .catch(function(error) {
                            failCount++;
                            console.error('创建任务请求失败', error);
                            processStory(index + 1);
                        });
                    };

                    // 开始处理第一个故事
                    processStory(0);
                }
            }
        }
    });
})();