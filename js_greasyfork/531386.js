// ==UserScript==
// @name         AcWing 错题本管理
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在 AcWing 网站上添加错题本管理功能。
// @author       CN059
// @match        https://www.acwing.com/*
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/531386/AcWing%20%E9%94%99%E9%A2%98%E6%9C%AC%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/531386/AcWing%20%E9%94%99%E9%A2%98%E6%9C%AC%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化错题本数据
    let wrongNotebooks = GM_getValue('wrongNotebooks', {});

    // 获取当前页面的题目信息
    function getCurrentProblemInfo() {
        const titleElement = document.querySelector('.nice_font.problem-content-title');
        const algorithmTags = Array.from(document.querySelectorAll('.problem-algorithm-tag-field-item'))
            .map(tag => tag.textContent.trim());
        const sourceTags = Array.from(document.querySelectorAll('.problem-algorithm-source-field-item'))
            .map(tag => tag.textContent.trim());
        const difficultyElement = document.querySelector('.label.label-success.round, .label.label-warning.round, .label.label-danger.round');
        const problemLink = window.location.href;

        if (!titleElement || !algorithmTags.length) return null;

        return {
            title: titleElement.textContent.trim(),
            algorithms: algorithmTags,
            sources: sourceTags,
            difficulty: difficultyElement ? difficultyElement.textContent.trim() : '未知',
            link: problemLink,
            addedTime: new Date().toLocaleString()
        };
    }

    // 添加“添加到错题本”按钮
    function addAddToNotebookButton() {
        if (!document.querySelector('#submit_code_btn')) return;

        const menuDiv = document.querySelector('#submit_code_btn').parentNode;
        const addButton = document.createElement('button');
        addButton.textContent = '添加到错题本';
        addButton.className = 'btn btn-primary';
        addButton.style.float = 'right';
        addButton.style.borderRadius = '20px';
        addButton.style.margin = '20px 0 0 20px';

        addButton.addEventListener('click', () => {
            showAddToNotebookModal();
        });

        menuDiv.appendChild(addButton);
    }

    // 显示“添加到错题本”弹窗
    function showAddToNotebookModal() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.width = '400px';
        modal.style.padding = '20px';
        modal.style.backgroundColor = '#fff';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        modal.style.zIndex = '9999';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '20px';

        const title = document.createElement('h3');
        title.textContent = '添加到错题本';
        header.appendChild(title);

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#fff';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            modal.remove();
        });
        header.appendChild(closeButton);

        const notebookList = document.createElement('ul');
        notebookList.style.listStyle = 'none';
        notebookList.style.padding = '0';
        notebookList.style.margin = '0';

        let selectedNotebook = null;

        const updateNotebookList = () => {
            notebookList.innerHTML = '';
            Object.keys(wrongNotebooks).forEach(notebookName => {
                const li = document.createElement('li');
                li.textContent = notebookName;
                li.style.padding = '10px';
                li.style.cursor = 'pointer';
                li.style.borderBottom = '1px solid #ddd';

                li.addEventListener('click', () => {
                    selectedNotebook = notebookName;
                    Array.from(notebookList.children).forEach(item => item.style.backgroundColor = '');
                    li.style.backgroundColor = '#f0f0f0';
                });

                notebookList.appendChild(li);
            });
        };

        const createNotebookButton = document.createElement('button');
        createNotebookButton.textContent = '新建错题本';
        createNotebookButton.style.width = '100%';
        createNotebookButton.style.marginTop = '10px';
        createNotebookButton.addEventListener('click', () => {
            const newNotebookName = prompt('请输入新错题本的名称：');
            if (newNotebookName && !wrongNotebooks[newNotebookName]) {
                wrongNotebooks[newNotebookName] = [];
                GM_setValue('wrongNotebooks', wrongNotebooks);
                updateNotebookList();
            }
        });

        const footer = document.createElement('div');
        footer.style.display = 'flex';
        footer.style.justifyContent = 'flex-end';
        footer.style.marginTop = '20px';

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '添加';
        confirmButton.style.padding = '10px 20px';
        confirmButton.style.backgroundColor = '#5cb85c';
        confirmButton.style.color = '#fff';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '5px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.addEventListener('click', () => {
            if (!selectedNotebook) {
                alert('请选择一个错题本！');
                return;
            }

            const problemInfo = getCurrentProblemInfo();
            if (!problemInfo) {
                alert('无法获取当前题目信息，请刷新页面后重试！');
                return;
            }

            wrongNotebooks[selectedNotebook].push(problemInfo);
            GM_setValue('wrongNotebooks', wrongNotebooks);
            alert(`已将题目添加到错题本 "${selectedNotebook}" 中！`);
            modal.remove();
        });

        footer.appendChild(confirmButton);

        modal.appendChild(header);
        modal.appendChild(notebookList);
        modal.appendChild(createNotebookButton);
        modal.appendChild(footer);

        updateNotebookList();
        document.body.appendChild(modal);
    }

    // 创建可拖动的“查看错题本”按钮
    function createDraggableButton() {
        const button = document.createElement('div');
        button.textContent = '📖';
        button.style.position = 'fixed';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.borderRadius = '50%';
        button.style.backgroundColor = '#ff4d4d';
        button.style.color = '#fff';
        button.style.textAlign = 'center';
        button.style.lineHeight = '50px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        button.style.top = '20px';
        button.style.right = '20px';

        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - button.offsetLeft;
            offsetY = e.clientY - button.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                button.style.left = `${e.clientX - offsetX}px`;
                button.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        button.addEventListener('click', () => {
            showWrongNotebooksWindow();
        });

        document.body.appendChild(button);
    }

    // 显示错题本窗口
    function showWrongNotebooksWindow() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.width = '800px';
        modal.style.height = '600px';
        modal.style.backgroundColor = '#fff';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        modal.style.zIndex = '9999';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';

        // 顶部操作栏
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '10px';
        header.style.borderBottom = '1px solid #ddd';

        const title = document.createElement('h3');
        title.textContent = '错题本管理';
        header.appendChild(title);

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#fff';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            modal.remove();
        });
        header.appendChild(closeButton);

        // 左侧：错题集列表
        const leftPanel = document.createElement('div');
        leftPanel.style.width = '200px';
        leftPanel.style.padding = '20px';
        leftPanel.style.borderRight = '1px solid #ddd';
        leftPanel.style.overflowY = 'auto';

        const notebookList = document.createElement('ul');
        notebookList.style.listStyle = 'none';
        notebookList.style.padding = '0';
        notebookList.style.margin = '0';

        let selectedNotebook = null;

        const updateNotebookList = () => {
            notebookList.innerHTML = '';
            Object.keys(wrongNotebooks).forEach(notebookName => {
                const li = document.createElement('li');
                li.textContent = notebookName;
                li.style.padding = '10px';
                li.style.cursor = 'pointer';
                li.style.borderBottom = '1px solid #ddd';

                li.addEventListener('click', () => {
                    selectedNotebook = notebookName;
                    Array.from(notebookList.children).forEach(item => item.style.backgroundColor = '');
                    li.style.backgroundColor = '#f0f0f0';
                    showNotebookContent(notebookName);
                });

                const deleteButton = document.createElement('span');
                deleteButton.textContent = '❌';
                deleteButton.style.float = 'right';
                deleteButton.style.cursor = 'pointer';
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`确定要删除错题本 "${notebookName}" 吗？`)) {
                        delete wrongNotebooks[notebookName];
                        GM_setValue('wrongNotebooks', wrongNotebooks);
                        updateNotebookList();
                        rightPanel.innerHTML = '<p>请选择一个错题本。</p>';
                    }
                });

                li.appendChild(deleteButton);
                notebookList.appendChild(li);
            });
        };

        const createNotebookButton = document.createElement('button');
        createNotebookButton.textContent = '新建错题本';
        createNotebookButton.style.width = '100%';
        createNotebookButton.style.marginTop = '10px';
        createNotebookButton.addEventListener('click', () => {
            const newNotebookName = prompt('请输入新错题本的名称：');
            if (newNotebookName && !wrongNotebooks[newNotebookName]) {
                wrongNotebooks[newNotebookName] = [];
                GM_setValue('wrongNotebooks', wrongNotebooks);
                updateNotebookList();
            }
        });

        const importButton = document.createElement('button');
        importButton.textContent = '导入错题本';
        importButton.style.width = '100%';
        importButton.style.marginTop = '10px';
        importButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        if (Array.isArray(importedData)) {
                            // 单个错题本
                            const notebookName = prompt('请输入新错题本的名称：');
                            if (notebookName) {
                                wrongNotebooks[notebookName] = importedData;
                            }
                        } else {
                            // 多个错题本
                            Object.assign(wrongNotebooks, importedData);
                        }
                        GM_setValue('wrongNotebooks', wrongNotebooks);
                        updateNotebookList();
                        alert('导入成功！');
                    } catch (error) {
                        alert('导入失败：文件格式不正确！');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        const exportAllButton = document.createElement('button');
        exportAllButton.textContent = '导出所有错题本';
        exportAllButton.style.width = '100%';
        exportAllButton.style.marginTop = '10px';
        exportAllButton.addEventListener('click', () => {
            const dataStr = JSON.stringify(wrongNotebooks, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'all_notebooks.json';
            a.click();

            URL.revokeObjectURL(url);
        });

        leftPanel.appendChild(notebookList);
        leftPanel.appendChild(createNotebookButton);
        leftPanel.appendChild(importButton);
        leftPanel.appendChild(exportAllButton);

        // 右侧：错题集内容
        const rightPanel = document.createElement('div');
        rightPanel.style.flexGrow = '1';
        rightPanel.style.padding = '20px';
        rightPanel.style.overflowY = 'auto';

        const showNotebookContent = (notebookName) => {
            rightPanel.innerHTML = '';
            const problems = wrongNotebooks[notebookName] || [];

            if (problems.length === 0) {
                rightPanel.innerHTML = '<p>该错题本暂无记录。</p>';
                return;
            }

            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';

            const exportButton = document.createElement('button');
            exportButton.textContent = '导出该错题本';
            exportButton.style.marginBottom = '10px';
            exportButton.addEventListener('click', () => {
                const dataStr = JSON.stringify(problems, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${notebookName}.json`;
                a.click();

                URL.revokeObjectURL(url);
            });
            rightPanel.appendChild(exportButton);

            problems.forEach((problem, index) => {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid #ddd';
                row.style.padding = '10px 0';

                const numberCell = document.createElement('td');
                numberCell.textContent = index + 1;
                numberCell.style.width = '50px';
                numberCell.style.textAlign = 'center';

                const titleCell = document.createElement('td');
                const titleLink = document.createElement('a');
                titleLink.textContent = problem.title;
                titleLink.href = problem.link;
                titleLink.target = '_blank';
                titleLink.style.textDecoration = 'underline';
                titleLink.style.color = '#007bff';
                titleCell.appendChild(titleLink);

                const tagsCell = document.createElement('td');
                const renderTags = (tags, color) => {
                    tags.forEach(tag => {
                        const tagSpan = document.createElement('span');
                        tagSpan.textContent = tag;
                        tagSpan.style.marginRight = '5px';
                        tagSpan.style.marginBottom = '3px';
                        tagSpan.style.color = '#505050';
                        tagSpan.style.fontSize = '12px';
                        tagSpan.style.padding = '2.5px 12px';
                        tagSpan.style.backgroundColor = '#f4f4f4';
                        tagSpan.style.borderRadius = '15px';
                        tagSpan.style.border = `1px solid ${color}`;
                        tagSpan.style.cursor = 'pointer';
                        tagSpan.style.display = 'inline-block';
                        tagsCell.appendChild(tagSpan);
                    });
                };
                renderTags(problem.sources, 'lightgrey');
                renderTags(problem.algorithms, 'lightgrey');

                const difficultyCell = document.createElement('td');
                const difficultySpan = document.createElement('span');
                difficultySpan.textContent = problem.difficulty;
                difficultySpan.style.padding = '.2em .6em .3em';
                difficultySpan.style.fontSize = '75%';
                difficultySpan.style.fontWeight = '700';
                difficultySpan.style.lineHeight = '1';
                difficultySpan.style.color = '#fff';
                difficultySpan.style.textAlign = 'center';
                difficultySpan.style.whiteSpace = 'nowrap';
                difficultySpan.style.verticalAlign = 'baseline';
                difficultySpan.style.borderRadius = '1020px';
                difficultySpan.style.display = 'inline-block';
                difficultySpan.style.backgroundColor = getDifficultyColor(problem.difficulty);
                difficultyCell.appendChild(difficultySpan);
                difficultyCell.style.textAlign = 'right';

                const deleteCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.style.padding = '5px 10px';
                deleteButton.style.backgroundColor = '#fff';
                deleteButton.style.color = '#000';
                deleteButton.style.border = '1px solid #ddd';
                deleteButton.style.borderRadius = '5px';
                deleteButton.style.cursor = 'pointer';

                deleteButton.addEventListener('click', () => {
                    if (deleteButton.textContent === '删除') {
                        deleteButton.textContent = '确定？';
                        deleteButton.style.backgroundColor = '#d9534f';
                        deleteButton.style.color = '#fff';
                    } else {
                        wrongNotebooks[notebookName].splice(index, 1);
                        GM_setValue('wrongNotebooks', wrongNotebooks);
                        showNotebookContent(notebookName);
                    }
                });

                deleteCell.appendChild(deleteButton);

                row.appendChild(numberCell);
                row.appendChild(titleCell);
                row.appendChild(tagsCell);
                row.appendChild(difficultyCell);
                row.appendChild(deleteCell);
                table.appendChild(row);
            });

            rightPanel.appendChild(table);
        };

        modal.appendChild(header);
        modal.appendChild(document.createElement('div')).style.display = 'flex';
        modal.lastChild.appendChild(leftPanel);
        modal.lastChild.appendChild(rightPanel);

        updateNotebookList();
        document.body.appendChild(modal);
    }

    // 根据难度获取颜色
    function getDifficultyColor(difficulty) {
        switch (difficulty) {
            case '简单': return '#5cb85c';
            case '中等': return '#f0ad4e';
            case '困难': return '#d9534f';
            default: return '#ccc';
        }
    }

    // 初始化脚本
    function init() {
        if (window.location.href.includes('/problem/content/')) {
            addAddToNotebookButton();
        }
        createDraggableButton();
    }

    init();
})();
