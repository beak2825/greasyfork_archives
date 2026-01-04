// ==UserScript==
// @name         CMS人员管理助手
// @namespace    https://greasyfork.org/zh-CN/scripts/519663
// @version      3.0
// @description  自定义人员添加和管理工具
// @author       小辑轻舟
// @match        http://cms.ahluqiao.com:9090/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABaUExURTMwMJOOjsjDw4aCgrqzs87IyLWvr0xpcQAAABIRETQyMsK8vKehoaynp4SAgCYkJOjh4f/6+uLa2lRRUTY0NJ+ZmW5qaoiDg3x4eEhGRiYkJJiTk/fw8GJfXxZ3+4sAAAAWdFJOU2n2/O39/v0AC0WD/vz+7V////////4sgfxuAAAAk0lEQVQY02XPyRKEIAwEUEBAEJ0iCbv6/785Llg15fTxHdIdNr7CxtFY1mPNCWbiQomSpdTDZA6wfAPwNSn0ONgDmADAFChE7zU7QQGoRjxw7+UDWKnUiHiDQ9ShpFYpxQuWnajtJexrnC8QHmVNnNafGzm5SPkBAYrcllvutZZjWWBbg+zDzPSZlXA66j7977lXvrUYCtAbaK9PAAAAAElFTkSuQmCC
// @license      MIT
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/519663/CMS%E4%BA%BA%E5%91%98%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519663/CMS%E4%BA%BA%E5%91%98%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isInterfaceOpen = false; // 用于标记用户界面是否已打开

    // 监听页面按钮点击事件
    document.addEventListener('click', function (e) {
        const target = e.target;

        // 检查是否点击了目标按钮且界面未打开
        if (target && (target.matches('.textbox-button') || target.closest('.textbox-button'))) {
            if (!isInterfaceOpen) { // 确保只有第一次点击时打开界面
                setTimeout(() => {
                    const targetWindow = document.querySelector('.window-shadow');
                    if (targetWindow) {
                        createUserInterface(targetWindow);
                        isInterfaceOpen = true; // 设置标记，表示界面已打开
                    }
                }, 100);
            }
        }
    });

    // 创建用户界面
    function createUserInterface(targetWindow) {
        const formHtml = `
            <div id="userInterface" style="position: absolute; top: 50px; left: 50px; width: 300px; padding: 10px; background-color: white; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); z-index: 9999;">
                <div id="dragHeader" style="background-color: #f1f1f1; padding: 10px; border-bottom: 1px solid #ccc;">
                    <span>人员管理</span>
                    <button id="closeButton" style="float: right; background: none; border: none; cursor: pointer;">×</button>
                    <button id="toggleButton" style="float: right; background: none; border: none; cursor: pointer; margin-right: 10px;">&#x25BC;</button> <!-- 折叠按钮 -->
                </div>
                <div id="formContent">
                    <label>姓名：</label>
                    <input id="nameInput" placeholder="输入姓名" class="form-input">
                    <label>编号：</label>
                    <input id="idInput" placeholder="输入编号" class="form-input">
                    <button id="addButton" class="form-button">添加到列表</button>
                    <div style="margin-top: 20px;">
                        <h4>当前列表</h4>
                        <ul id="userList" style="border: 1px solid #ccc; padding: 10px; max-height: 150px; overflow-y: auto;"></ul>
                    </div>
                    <div style="margin-top: 20px;">
                        <button id="applyButton" class="form-button">应用到选择框</button>
                    </div>
                    <div style="margin-top: 20px;">
                        <label>方案名称：</label>
                        <input id="schemeNameInput" placeholder="输入方案名称" class="form-input">
                        <button id="saveSchemeButton" class="form-button">保存方案</button>
                    </div>
                    <div style="margin-top: 20px;">
                        <h4>已保存方案</h4>
                        <select id="schemeList" class="form-input">
                            <option value="">请选择方案</option>
                        </select>
                        <button id="loadSchemeButton" class="form-button">加载方案</button>
                        <button id="renameSchemeButton" class="form-button">重命名方案</button>
                        <button id="deleteSchemeButton" class="form-button">删除方案</button>
                        <button id="exportSchemeButton" class="form-button">导出方案</button>
                        <input type="file" id="importSchemeButton" class="form-input" />
                    </div>
                </div>
            </div>
        `;

        // 创建并插入自定义界面
        const userInterface = document.createElement('div');
        userInterface.innerHTML = formHtml;
        document.body.appendChild(userInterface);

        $('#userInterface').css({
            'border-radius': '8px',
            'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)'
        });

        $('.form-button').css({
            'width': '100%',
            'padding': '10px',
            'background-color': '#4CAF50',
            'color': 'white',
            'border': 'none',
            'cursor': 'pointer',
            'border-radius': '5px',
            'margin-bottom': '10px'
        });

        $('.form-button').hover(function () {
            $(this).css('background-color', '#45a049');
        }, function () {
            $(this).css('background-color', '#4CAF50');
        });

        $('.form-input').css({
            'width': '100%',
            'padding': '8px',
            'margin-bottom': '10px',
            'border': '1px solid #ccc',
            'border-radius': '5px',
            'box-sizing': 'border-box'
        });

        $('#schemeList').css({
            'width': '100%',                // 设置宽度为100%，适应父容器
            'max-width': '300px',           // 设置最大宽度，防止框体过宽
            'height': '35px',               // 设置高度
            'overflow': 'hidden',           // 隐藏溢出的文字
            'text-overflow': 'ellipsis',    // 超长文字显示省略号
            'white-space': 'nowrap',        // 防止换行
        });

        // 设置关闭按钮事件
        document.getElementById('closeButton').addEventListener('click', () => {
            userInterface.remove();
            isInterfaceOpen = false; // 关闭时恢复标记，允许再次打开
        });

        // 设置折叠按钮事件
        const toggleButton = document.getElementById('toggleButton');
        toggleButton.addEventListener('click', () => {
            const formContent = document.getElementById('formContent');
            if ($(formContent).is(':visible')) {
                $(formContent).slideUp(); 
                $(toggleButton).html('&#x25B2;');
            } else {
                $(formContent).slideDown();
                $(toggleButton).html('&#x25BC;');
            }
        });

        // 设置保存方案、加载方案、重命名方案、删除方案等功能事件
        setupEventListeners();
    }

    // 设置事件监听
    function setupEventListeners() {
        const nameInput = $('#nameInput');
        const idInput = $('#idInput');
        const userListContainer = $('#userList');
        const applyButton = $('#applyButton');
        const schemeNameInput = $('#schemeNameInput');
        const schemeList = $('#schemeList');

        let userList = [];

        // 添加人员到列表
        $('#addButton').on('click', () => {
            const name = nameInput.val().trim();
            const id = idInput.val().trim();

            if (!name || !id) {
                alert('请输入姓名和编号');
                return;
            }

            const listItem = $('<li>').text(`姓名: ${name}, 编号: ${id}`);
            const removeButton = $('<button>')
                .text('删除')
                .css('margin-left', '10px')
                .on('click', () => {
                    listItem.remove();
                });

            listItem.append(removeButton);
            userListContainer.append(listItem);

            userList.push({ name, id });

            nameInput.val('');
            idInput.val('');

            alert('人员已成功添加到列表');
        });

        // 应用到选择框
        applyButton.on('click', () => {
            const selectBox = $('#selected');
            if (selectBox.length === 0) {
                alert('未找到<select>元素');
                return;
            }

            userList.forEach(user => {
                const option = $('<option>')
                    .val(`U‖${user.id}‖${user.name}`)
                    .text(user.name);
                selectBox.append(option);
            });

            alert('人员列表已应用到选择框');
        });

        // 保存方案
        $('#saveSchemeButton').on('click', () => {
            const schemeName = schemeNameInput.val().trim();
            if (!schemeName) {
                alert('请输入方案名称');
                return;
            }

            // 获取已保存的方案
            const savedSchemes = JSON.parse(localStorage.getItem('savedSchemes') || '[]');
            const newScheme = { name: schemeName, users: [...userList] };
            savedSchemes.push(newScheme);
            localStorage.setItem('savedSchemes', JSON.stringify(savedSchemes));

            const option = $('<option>').val(schemeName).text(schemeName);
            schemeList.append(option);

            schemeNameInput.val(''); // 清空方案名称输入框
            alert('方案已保存');
        });

        // 加载方案
        $('#loadSchemeButton').on('click', () => {
            const selectedScheme = schemeList.val();
            if (!selectedScheme) {
                alert('请选择方案');
                return;
            }

            const savedSchemes = JSON.parse(localStorage.getItem('savedSchemes') || '[]');
            const scheme = savedSchemes.find(s => s.name === selectedScheme);
            if (!scheme) {
                alert('未找到选中的方案');
                return;
            }

            userList.length = 0; // 清空当前用户列表
            userList.push(...scheme.users);

            userListContainer.empty(); // 清空用户列表展示

            scheme.users.forEach(user => {
                const listItem = $('<li>').text(`姓名: ${user.name}, 编号: ${user.id}`);
                userListContainer.append(listItem);
            });

            alert('方案已加载');
        });

        // 删除方案
        $('#deleteSchemeButton').on('click', () => {
            const selectedScheme = schemeList.val();
            if (!selectedScheme) {
                alert('请选择方案');
                return;
            }

            const savedSchemes = JSON.parse(localStorage.getItem('savedSchemes') || '[]');
            const updatedSchemes = savedSchemes.filter(s => s.name !== selectedScheme);
            localStorage.setItem('savedSchemes', JSON.stringify(updatedSchemes));

            // 移除下拉框中的选项
            schemeList.find(`option[value="${selectedScheme}"]`).remove();

            alert('方案已删除');
        });

        // 重命名方案
        $('#renameSchemeButton').on('click', () => {
            const selectedScheme = schemeList.val();
            if (!selectedScheme) {
                alert('请选择方案');
                return;
            }

            const newSchemeName = prompt('请输入新的方案名称');
            if (newSchemeName) {
                const savedSchemes = JSON.parse(localStorage.getItem('savedSchemes') || '[]');
                const scheme = savedSchemes.find(s => s.name === selectedScheme);
                if (scheme) {
                    scheme.name = newSchemeName;
                    localStorage.setItem('savedSchemes', JSON.stringify(savedSchemes));

                    // 更新方案名称下拉框
                    schemeList.find(`option[value="${selectedScheme}"]`).text(newSchemeName);
                    schemeList.val(newSchemeName);
                    alert('方案名称已更新');
                }
            }
        });

        // 导出方案
        $('#exportSchemeButton').on('click', () => {
            const selectedScheme = schemeList.val();
            if (!selectedScheme) {
                alert('请选择方案');
                return;
            }

            const savedSchemes = JSON.parse(localStorage.getItem('savedSchemes') || '[]');
            const scheme = savedSchemes.find(s => s.name === selectedScheme);
            if (scheme) {
                const blob = new Blob([JSON.stringify(scheme)], { type: 'application/json' });
                const link = $('<a>')
                    .attr('href', URL.createObjectURL(blob))
                    .attr('download', `${selectedScheme}.json`)
                    .get(0)
                    .click();
                alert('方案已导出');
            }
        });

        // 导入方案
        $('#importSchemeButton').on('change', (event) => {
            const file = event.target.files[0];
            if (file && file.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = function () {
                    try {
                        const importedScheme = JSON.parse(reader.result);
                        const savedSchemes = JSON.parse(localStorage.getItem('savedSchemes') || '[]');
                        savedSchemes.push(importedScheme);
                        localStorage.setItem('savedSchemes', JSON.stringify(savedSchemes));

                        const option = $('<option>')
                            .val(importedScheme.name)
                            .text(importedScheme.name);
                        schemeList.append(option);

                        alert('方案已导入');
                    } catch (e) {
                        alert('导入失败: 无效的方案文件');
                    }
                };
                reader.readAsText(file);
            } else {
                alert('请选择一个有效的 JSON 文件');
            }
        });

        // 从localStorage加载已保存的方案
        loadSavedSchemes();
    }

    // 从localStorage加载已保存的方案
    function loadSavedSchemes() {
        const savedSchemes = JSON.parse(localStorage.getItem('savedSchemes') || '[]');
        const schemeList = $('#schemeList');
        savedSchemes.forEach(scheme => {
            const option = $('<option>')
                .val(scheme.name)
                .text(scheme.name);
            schemeList.append(option);
        });
    }
})();