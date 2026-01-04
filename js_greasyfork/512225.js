// ==UserScript==
// @name         我的代办工具软件
// @namespace    http://tampermonkey.net/
// @version      2.2.6
// @description  一款简洁大气的待办事项管理工具，支持添加、编辑、删除和展示待办事项，并提供搜索和历史记录功能。适用于任何网站，帮助您高效管理日常任务。
// @author       wll
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/512225/%E6%88%91%E7%9A%84%E4%BB%A3%E5%8A%9E%E5%B7%A5%E5%85%B7%E8%BD%AF%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/512225/%E6%88%91%E7%9A%84%E4%BB%A3%E5%8A%9E%E5%B7%A5%E5%85%B7%E8%BD%AF%E4%BB%B6.meta.js
// ==/UserScript==

/*
### 软件特点：
1. **简洁大气**：强调了工具的设计风格，吸引用户。
2. **功能全面**：列出了主要功能，包括添加、编辑、删除、展示、搜索和历史记录。
3. **适用性广**：明确指出适用于任何网站，增加了工具的通用性和吸引力。
4. **高效管理**：强调了工具的实用性，帮助用户高效管理日常任务。
*/
(function() {
    'use strict';

    function loadExternalResource(url, type) {
        return new Promise((resolve, reject) => {
            let tag;
            if (type === 'css') {
                tag = document.createElement('link');
                tag.rel = 'stylesheet';
                tag.href = url;
            } else if (type === 'js') {
                tag = document.createElement('script');
                tag.src = url;
            } else {
                reject(new Error('Invalid resource type'));
                return;
            }
            tag.onload = () => resolve();
            tag.onerror = () => reject(new Error(`Failed to load resource: ${url}`));
            document.head.appendChild(tag);
        });
    }

    async function initialize() {
        try {
            await loadExternalResource('https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js', 'js');
await loadExternalResource('https://cdn.bootcdn.net/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css', 'css');
await loadExternalResource('https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.3.3/js/bootstrap.bundle.min.js', 'js');

            main();
        } catch (error) {
            console.error('Failed to load external resources', error);
        }
    }

    function main() {
        $(document).ready(function() {
            function loadTodoList() {
                return JSON.parse(GM_getValue('todoList', '[]'));
            }

            function saveTodoList(todoList) {
                todoList.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                GM_setValue('todoList', JSON.stringify(todoList));
            }

            function loadHistoryList() {
                return JSON.parse(GM_getValue('historyList', '[]'));
            }

            function saveHistoryList(historyList) {
                GM_setValue('historyList', JSON.stringify(historyList));
            }

            function addTodoItem(task, deadline, reminderFrequency) {
                const todoList = loadTodoList();
                todoList.unshift({ task, deadline, reminderFrequency, done: false });
                saveTodoList(todoList);
                displayTodoList();
            }

            function deleteTodoItem(index) {
                const todoList = loadTodoList();
                todoList.splice(index, 1);
                saveTodoList(todoList);
                displayTodoList();
            }

            function editTodoItem(index, newTask, newDeadline, newReminder) {
                const todoList = loadTodoList();
                const todoItem = todoList[index];
                todoItem.task = newTask;
                todoItem.deadline = newDeadline;
                todoItem.reminderFrequency = newReminder;
                saveTodoList(todoList);
                displayTodoList();
            }

            function showMessage(message) {
                const messageElement = $('<div>').text(message).addClass('alert alert-warning position-fixed top-0 start-50 translate-middle-x');
                $('body').append(messageElement);
                setTimeout(() => messageElement.remove(), 3000);
            }

            function initializePresetTodoItems() {
                const todoList = loadTodoList();
                if (todoList.length === 0) {
                    addTodoItem('完成油猴脚本示例', '2023-12-31T23:59', '每天');
                    addTodoItem('开会', '2023-11-30T14:00', '每周');
                    addTodoItem('提交报告', '2023-12-15T17:00', '一次');
                }
            }

            function displayTodoList() {
                const todoList = loadTodoList();
                const todoListElement = $('#todoList');
                todoListElement.empty();
                $.each(todoList, (index, todoItem) => {
                    const listItem = $('<tr>').html(`
                        <td>${index + 1}</td>
                        <td><input type="checkbox" ${todoItem.done ? 'checked' : ''}></td>
                        <td>${todoItem.task}</td>
                        <td>${todoItem.deadline}</td>
                        <td>${todoItem.reminderFrequency}</td>
                        <td>
                            <button class="btn btn-primary btn-sm edit-btn">编辑</button>
                            <button class="btn btn-danger btn-sm delete-btn">删除</button>
                        </td>
                    `);
                    listItem.find('input[type="checkbox"]').on('change', function() {
                        toggleDone(index, this.checked);
                    });
                    listItem.find('.edit-btn').on('click', function() {
                        makeTodoItemEditable(index, listItem);
                    });
                    listItem.find('.delete-btn').on('click', function() {
                        deleteTodoItem(index);
                    });
                    todoListElement.append(listItem);
                });
            }

            function displayHistoryList() {
                const historyList = loadHistoryList();
                const historyListElement = $('#historyList');
                historyListElement.empty();
                $.each(historyList, (index, historyItem) => {
                    const listItem = $('<tr>').html(`
                        <td>${index + 1}</td>
                        <td><input type="checkbox" ${historyItem.done ? 'checked' : ''}></td>
                        <td>${historyItem.task}</td>
                        <td>${historyItem.deadline}</td>
                        <td>${historyItem.reminderFrequency}</td>
                        <td>
                            <button class="btn btn-primary btn-sm edit-history-btn">编辑</button>
                            <button class="btn btn-danger btn-sm delete-history-btn">删除</button>
                        </td>
                    `);
                    listItem.find('input[type="checkbox"]').on('change', function() {
                        toggleHistoryDone(index, this.checked);
                    });
                    listItem.find('.edit-history-btn').on('click', function() {
                        makeHistoryItemEditable(index, listItem);
                    });
                    listItem.find('.delete-history-btn').on('click', function() {
                        deleteHistoryItem(index);
                    });
                    historyListElement.append(listItem);
                });
            }

            function toggleDone(index, done) {
                const todoList = loadTodoList();
                const historyList = loadHistoryList();
                const [todoItem] = todoList.splice(index, 1);
                todoItem.done = done;
                if (done) {
                    historyList.unshift(todoItem);
                } else {
                    todoList.unshift(todoItem);
                }
                saveTodoList(todoList);
                saveHistoryList(historyList);
                displayTodoList();
                displayHistoryList();
            }

            function toggleHistoryDone(index, done) {
                const historyList = loadHistoryList();
                const todoList = loadTodoList();
                const [historyItem] = historyList.splice(index, 1);
                historyItem.done = done;
                if (done) {
                    historyList.unshift(historyItem);
                } else {
                    todoList.unshift(historyItem);
                }
                saveTodoList(todoList);
                saveHistoryList(historyList);
                displayTodoList();
                displayHistoryList();
            }

            function makeTodoItemEditable(index, listItem) {
                const todoList = loadTodoList();
                const todoItem = todoList[index];
                listItem.html(`
                    <td>${index + 1}</td>
                    <td><input type="checkbox" ${todoItem.done ? 'checked' : ''}></td>
                    <td><input type="text" class="form-control" value="${todoItem.task}"></td>
                    <td><input type="datetime-local" class="form-control" value="${todoItem.deadline}"></td>
                    <td>
                        <select class="form-control reminder-select">
                            <option value="每天" ${todoItem.reminderFrequency === '每天' ? 'selected' : ''}>每天</option>
                            <option value="每周" ${todoItem.reminderFrequency === '每周' ? 'selected' : ''}>每周</option>
                            <option value="每月" ${todoItem.reminderFrequency === '每月' ? 'selected' : ''}>每月</option>
                            <option value="每年" ${todoItem.reminderFrequency === '每年' ? 'selected' : ''}>每年</option>
                            <option value="一次" ${todoItem.reminderFrequency === '一次' ? 'selected' : ''}>一次</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-success btn-sm save-btn">保存</button>
                        <button class="btn btn-secondary btn-sm cancel-btn">取消</button>
                    </td>
                `);
                listItem.find('.save-btn').on('click', function() {
                    const newTask = listItem.find('input').eq(1).val();
                    const newDeadline = listItem.find('input').eq(2).val();
                    const newReminder = listItem.find('.reminder-select').val();
                    editTodoItem(index, newTask, newDeadline, newReminder);
                    showMessage('编辑成功');
                });
                listItem.find('.cancel-btn').on('click', function() {
                    displayTodoList();
                });
            }

            function makeHistoryItemEditable(index, listItem) {
                const historyList = loadHistoryList();
                const historyItem = historyList[index];
                listItem.html(`
                    <td>${index + 1}</td>
                    <td><input type="checkbox" ${historyItem.done ? 'checked' : ''}></td>
                    <td><input type="text" class="form-control" value="${historyItem.task}"></td>
                    <td><input type="datetime-local" class="form-control" value="${historyItem.deadline}"></td>
                    <td>
                        <select class="form-control reminder-select">
                            <option value="每天" ${historyItem.reminderFrequency === '每天' ? 'selected' : ''}>每天</option>
                            <option value="每周" ${historyItem.reminderFrequency === '每周' ? 'selected' : ''}>每周</option>
                            <option value="每月" ${historyItem.reminderFrequency === '每月' ? 'selected' : ''}>每月</option>
                            <option value="每年" ${historyItem.reminderFrequency === '每年' ? 'selected' : ''}>每年</option>
                            <option value="一次" ${historyItem.reminderFrequency === '一次' ? 'selected' : ''}>一次</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-success btn-sm save-btn">保存</button>
                        <button class="btn btn-secondary btn-sm cancel-btn">取消</button>
                    </td>
                `);
                listItem.find('.save-btn').on('click', function() {
                    historyItem.task = listItem.find('input').eq(1).val();
                    historyItem.deadline = listItem.find('input').eq(2).val();
                    historyItem.reminderFrequency = listItem.find('.reminder-select').val();
                    saveHistoryList(historyList);
                    displayHistoryList();
                    showMessage('编辑成功');
                });
                listItem.find('.cancel-btn').on('click', function() {
                    displayHistoryList();
                });
            }

            function deleteHistoryItem(index) {
                const historyList = loadHistoryList();
                historyList.splice(index, 1);
                saveHistoryList(historyList);
                displayHistoryList();
            }

            function createTodoManagerPage() {
                $('#todoManagerPanel').remove();
                const pageContent = `
                    <div id="todoManagerPanel" class="container" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; border: 1px solid black; padding: 20px; width: 700px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h1 class="flex-grow-1 text-center">代办事项管理</h1>
                            <button id="closeBtn" class="btn btn-danger btn-sm">X</button>
                        </div>
                        <div class="mb-3">
                            <input type="text" id="taskInput" placeholder="任务名称" class="form-control mb-2" style="display: inline-block; width: 30%;">
                            <input type="datetime-local" id="deadlineInput" class="form-control mb-2" style="display: inline-block; width: 30%;">
                            <select id="reminderInput" class="form-control mb-2" style="display: inline-block; width: 30%;">
                                <option value="每天">每天</option>
                                <option value="每周">每周</option>
                                <option value="每月">每月</option>
                                <option value="每年">每年</option>
                                <option value="一次" selected>一次</option>
                            </select>
                            <button id="addBtn" class="btn btn-primary btn-block">添加</button>
                        </div>
                        <div class="mb-3 d-flex">
                            <input type="text" id="searchInput" placeholder="搜索任务..." class="form-control me-2">
                            <button id="clearSearchBtn" class="btn btn-secondary">清除</button>
                        </div>
                        <div class="mb-3">
                            <h2>待办事项</h2>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>状态</th>
                                        <th>任务名称</th>
                                        <th>截止日期</th>
                                        <th>提醒频率</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody id="todoList"></tbody>
                            </table>
                        </div>
                        <div>
                            <h2>历史事项</h2>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>状态</th>
                                        <th>任务名称</th>
                                        <th>截止日期</th>
                                        <th>提醒频率</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody id="historyList"></tbody>
                            </table>
                        </div>
                    </div>
                `;
                $('body').append(pageContent);

                $('#addBtn').on('click', addTodo);
                $('#closeBtn').on('click', closeTodoManager);
                $('#searchInput').on('input', filterTodoList);
                $('#clearSearchBtn').on('click', clearSearch);

                displayTodoList();
                displayHistoryList();
            }

            function addTodo() {
                const task = $('#taskInput').val().trim();
                const deadline = $('#deadlineInput').val().trim();
                const reminderFrequency = $('#reminderInput').val().trim();
                if (task && deadline && reminderFrequency) {
                    addTodoItem(task, deadline, reminderFrequency);
                    $('#taskInput').val('');
                    $('#deadlineInput').val('');
                    $('#reminderInput').val('一次');
                    showMessage('添加成功');
                } else {
                    showMessage('请输入有效的代办事项信息');
                }
            }

            function clearSearch() {
                $('#searchInput').val('');
                filterTodoList();
            }

            function filterTodoList() {
                const searchInput = $('#searchInput').val().toLowerCase();
                const todoList = loadTodoList();
                const historyList = loadHistoryList();

                const filteredTodoList = todoList.filter(item => item.task.toLowerCase().includes(searchInput));
                const filteredHistoryList = historyList.filter(item => item.task.toLowerCase().includes(searchInput));

                displayFilteredTodoList(filteredTodoList);
                displayFilteredHistoryList(filteredHistoryList);
            }

            function displayFilteredTodoList(filteredTodoList) {
                const todoListElement = $('#todoList');
                todoListElement.empty();
                $.each(filteredTodoList, (index, todoItem) => {
                    const listItem = $('<tr>').html(`
                        <td>${index + 1}</td>
                        <td><input type="checkbox" ${todoItem.done ? 'checked' : ''}></td>
                        <td>${todoItem.task}</td>
                        <td>${todoItem.deadline}</td>
                        <td>${todoItem.reminderFrequency}</td>
                        <td>
                            <button class="btn btn-primary btn-sm edit-btn">编辑</button>
                            <button class="btn btn-danger btn-sm delete-btn">删除</button>
                        </td>
                    `);
                    listItem.find('input[type="checkbox"]').on('change', function() {
                        toggleDone(index, this.checked);
                    });
                    listItem.find('.edit-btn').on('click', function() {
                        makeTodoItemEditable(index, listItem);
                    });
                    listItem.find('.delete-btn').on('click', function() {
                        deleteTodoItem(index);
                    });
                    todoListElement.append(listItem);
                });
            }

            function displayFilteredHistoryList(filteredHistoryList) {
                const historyListElement = $('#historyList');
                historyListElement.empty();
                $.each(filteredHistoryList, (index, historyItem) => {
                    const listItem = $('<tr>').html(`
                        <td>${index + 1}</td>
                        <td><input type="checkbox" ${historyItem.done ? 'checked' : ''}></td>
                        <td>${historyItem.task}</td>
                        <td>${historyItem.deadline}</td>
                        <td>${historyItem.reminderFrequency}</td>
                        <td>
                            <button class="btn btn-primary btn-sm edit-history-btn">编辑</button>
                            <button class="btn btn-danger btn-sm delete-history-btn">删除</button>
                        </td>
                    `);
                    listItem.find('input[type="checkbox"]').on('change', function() {
                        toggleHistoryDone(index, this.checked);
                    });
                    listItem.find('.edit-history-btn').on('click', function() {
                        makeHistoryItemEditable(index, listItem);
                    });
                    listItem.find('.delete-history-btn').on('click', function() {
                        deleteHistoryItem(index);
                    });
                    historyListElement.append(listItem);
                });
            }

            function closeTodoManager() {
                $('#todoManagerPanel').remove();
            }

            GM_registerMenuCommand('代办管理', function() {
                createTodoManagerPage();
            });

            initializePresetTodoItems();
        });
    }

    initialize();
})();
