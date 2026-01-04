// ==UserScript==
// @name         Tieba Block Users Button
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  贴吧一键封禁按钮
// @author       Jay_Lee
// @match        *://tieba.baidu.com/bawu2/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535684/Tieba%20Block%20Users%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/535684/Tieba%20Block%20Users%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const blockDays = 1; // 封禁天数,允许值1~10,默认1
    const blockReason = '自动封禁中'; // 封禁理由,默认自动封禁中




    // ⚠️以下内容如果您非专业请勿随意修改⚠️
    const blockUserNameList = [];  // 初始化用户名数组
    const blockUri = 'https://tieba.baidu.com/pmc/blockid';
    const cookie = document.cookie || '';
    const FourmData = window.PageData.forum || {};
    const UserData = window.PageData.user || {};


    // 友情提示:拉黑不如屏蔽哦
    async function block() {
        const chunkSize = 50;
        const chunks = [];

        for (let i = 0; i < blockUserNameList.length; i += chunkSize) {
            chunks.push(blockUserNameList.slice(i, i + chunkSize));
        }

        let requestCount = 0;
        let blockDays = localStorage.getItem('blockDays');

        for (const userGroup of chunks) {
            requestCount++;
            const data = new URLSearchParams();
            data.append('day', blockDays);
            data.append('fid', FourmData.forum_id || '');
            data.append('tbs', UserData.tbs || '');
            data.append('ie', 'gbk');
            data.append('reason', blockReason);
            userGroup.forEach((username) => {
                data.append('user_name[]', username);
            });

            try {
                const response = await fetch(blockUri, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': cookie,
                    },
                    body: data.toString(),
                    credentials: 'include',
                });
                const result = await response.json(); // 假设返回的是 JSON 格式
                if (result.errno === 0) {
                    // 操作成功
                    console.log(`Blocked users: ${userGroup.join(', ')}`, result);
                    showNotification(
                        `第${requestCount}次请求，本次封禁用户列表：\n\n${userGroup.join('、')}\n\n封禁成功`,
                        '#00BFFF' // 成功背景色
                    );
                } else {
                    // 操作失败
                    console.warn(`Failed to block users: ${userGroup.join(', ')}`, result);
                    showNotification(
                        `第${requestCount}次请求，本次封禁用户列表：\n\n${userGroup.join('、')}\n\n封禁失败（错误信息：${result.errmsg}）`,
                        '#FFD700' // 失败背景色（黄色）
                    );
                }
            } catch (err) {
                console.error(`Error blocking users: ${userGroup.join(', ')}`, err);
                // 异常提示框
                showNotification(
                    `第${requestCount}次请求，本次封禁用户列表：\n\n${userGroup.join('、')}\n\n封禁失败（错误信息：${err.message}）`,
                    '#FF6347' // 异常背景色（红色）
                );
            }

            // 每次请求后暂停
            await sleep(2000);
        }


        // 封禁完成刷新网页
        location.reload();
    }

    // 提示框
    function showNotification(message, backgroundColor) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerText = message;

        // 样式设置
        Object.assign(notification.style, {
            position: 'fixed',
            right: '20px',
            zIndex: 10000,
            padding: '10px',
            backgroundColor,
            color: '#FFFFFF',
            border: '1px solid #000',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            bottom: `${20 + document.querySelectorAll('.notification').length * 110}px`, // 动态计算位置
            opacity: '1', // 初始透明度
            transition: 'opacity 0.5s ease, transform 0.5s ease', // 添加透明度和位移的过渡效果
        });

        document.body.appendChild(notification);

        // 自动移除提示框并添加动画
        setTimeout(() => {
            notification.style.opacity = '0'; // 渐隐效果
            notification.style.transform = 'translateX(100%)'; // 向右移动抽出效果
            setTimeout(() => {
                notification.remove();
                // 重新调整剩余提示框的位置
                document.querySelectorAll('.notification').forEach((notif, index) => {
                    notif.style.bottom = `${20 + index * 110}px`;
                });
            }, 500); // 等待动画完成后移除元素
        }, 2000);
    }

    // Zzz~
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // 用户列表编辑器
    function addUserListEditor() {
        // 从 localStorage 获取用户列表
        const storedUsernames = localStorage.getItem('blockUserNames');
        if (storedUsernames) {
            blockUserNameList.length = 0; // 清空原数组
            blockUserNameList.push(...storedUsernames.split(',')); // 更新数组
        }

        // 从 localStorage 获取封禁天数
        let storedBlockDays = parseInt(localStorage.getItem('blockDays'), 10);
        if (isNaN(storedBlockDays) || storedBlockDays < 1 || storedBlockDays > 10) {
            storedBlockDays = 1; // 默认1天
        }

        // 创建主容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '100px'; // 放在按钮上方
        container.style.left = '20px';
        container.style.zIndex = 9999;
        container.style.width = '400px';
        container.style.border = '1px solid #E0E0E0';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        container.style.backgroundColor = '#779977';
        container.style.overflow = 'hidden'; // 防止滚动条溢出

        // 创建顶部冻结部分
        const header = document.createElement('div');
        header.style.position = 'sticky';
        header.style.top = '0';
        header.style.backgroundColor = '#779977';
        header.style.padding = '15px';
        header.style.borderBottom = '1px solid #E0E0E0';
        header.style.zIndex = '10';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';

        // 标题
        const title = document.createElement('h4');
        title.innerText = '十循列表';
        title.style.margin = '0';
        title.style.fontSize = '18px';
        title.style.color = '#333';
        title.style.fontWeight = 'bold';

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        // 添加用户按钮
        const addButton = document.createElement('button');
        addButton.innerText = '添加用户';
        addButton.style.padding = '8px 12px';
        addButton.style.backgroundColor = '#00BFFF';
        addButton.style.color = '#779977';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '5px';
        addButton.style.cursor = 'pointer';
        addButton.style.fontSize = '14px';
        addButton.addEventListener('click', () => {
            blockUserNameList.push(''); // 添加一个空用户
            renderUserList(); // 重新渲染列表
        });

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.innerText = '保存';
        saveButton.style.padding = '8px 12px';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = '#779977';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.fontSize = '14px';
        saveButton.addEventListener('click', () => {
            // 持久化存储到 localStorage
            localStorage.setItem('blockUserNames', blockUserNameList.filter(name => name.trim()).join(','));
            alert('用户列表已更新并保存！');
        });

        // 将按钮添加到按钮容器
        buttonContainer.appendChild(addButton);
        buttonContainer.appendChild(saveButton);

        // 将标题和按钮容器添加到顶部
        header.appendChild(title);
        header.appendChild(buttonContainer);

        container.appendChild(header);

        // 创建滚动区域
        const scrollableArea = document.createElement('div');
        scrollableArea.style.maxHeight = '300px'; // 限制高度
        scrollableArea.style.overflowY = 'auto'; // 滑动展示
        scrollableArea.style.padding = '15px';

        // 创建表格容器
        const table = document.createElement('div');
        table.style.display = 'flex';
        table.style.flexDirection = 'column';
        table.style.gap = '10px';
        scrollableArea.appendChild(table);

        container.appendChild(scrollableArea);

        // 渲染用户列表
        function renderUserList() {
            table.innerHTML = ''; // 清空表格内容
            blockUserNameList.forEach((username, index) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.gap = '10px';

                const input = document.createElement('input');
                input.type = 'text';
                input.value = username;
                input.style.flex = '1';
                input.style.padding = '8px';
                input.style.border = '1px solid #E0E0E0';
                input.style.borderRadius = '5px';
                input.style.fontSize = '14px';
                input.addEventListener('input', (e) => {
                    blockUserNameList[index] = e.target.value.trim(); // 更新用户名
                });

                const deleteButton = document.createElement('button');
                deleteButton.innerText = '删除';
                deleteButton.style.padding = '8px 12px';
                deleteButton.style.backgroundColor = '#FF6347';
                deleteButton.style.color = '#779977';
                deleteButton.style.border = 'none';
                deleteButton.style.borderRadius = '5px';
                deleteButton.style.cursor = 'pointer';
                deleteButton.style.fontSize = '14px';
                deleteButton.addEventListener('click', () => {
                    blockUserNameList.splice(index, 1); // 删除该用户
                    renderUserList(); // 重新渲染列表
                });

                row.appendChild(input);
                row.appendChild(deleteButton);
                table.appendChild(row);
            });
        }

        document.body.appendChild(container);

        // 初次渲染用户列表
        renderUserList();
    }

    // 封禁天数设置
    function addBlockDaysEditor() {
        // 从 localStorage 获取封禁天数
        let storedBlockDays = parseInt(localStorage.getItem('blockDays'), 10);
        if (isNaN(storedBlockDays) || storedBlockDays < 1 || storedBlockDays > 10) {
            storedBlockDays = 1; // 默认1天
        }

        // 创建容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '520px';
        container.style.left = '20px';
        container.style.zIndex = 9999;
        container.style.width = '200px';
        container.style.border = '1px solid #E0E0E0';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        container.style.backgroundColor = '#779977';
        container.style.padding = '15px';
        container.style.marginBottom = '10px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.position = 'fixed';

        // 标题
        const title = document.createElement('h4');
        title.innerText = '封禁天数设置';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '18px';
        title.style.color = '#333';
        title.style.fontWeight = 'bold';

        // 输入框
        const label = document.createElement('label');
        label.innerText = '封禁天数（1-10天）：';
        label.style.color = '#333';
        label.style.fontSize = '14px';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.max = '10';
        input.value = storedBlockDays;
        input.style.width = '40px';
        input.style.marginLeft = '4px';
        input.style.border = '1px solid #E0E0E0';
        input.style.borderRadius = '4px';
        input.style.padding = '2px 4px';
        input.style.fontSize = '14px';

        label.appendChild(input);

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.innerText = '保存';
        saveButton.style.marginLeft = '16px';
        saveButton.style.padding = '6px 16px';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = '#779977';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.fontSize = '14px';

        saveButton.addEventListener('click', () => {
            let val = parseInt(input.value, 10);
            if (isNaN(val) || val < 1) val = 1;
            if (val > 10) val = 10;
            input.value = val;
            localStorage.setItem('blockDays', val);
            alert('封禁天数已保存！');
        });

        container.appendChild(title);
        container.appendChild(label);
        container.appendChild(saveButton);

        document.body.appendChild(container);
    }

    // 审判按钮
    function addButton() {
        const button = document.createElement('button');
        button.innerText = '🥒执行封禁🥒';
        button.style.position = 'fixed';
        button.style.bottom = '20px'; // 调整到屏幕底部
        button.style.left = '20px';   // 调整到屏幕左侧
        button.style.zIndex = 9999;
        button.style.padding = '12px 20px';
        button.style.backgroundColor = '#00BFFF'; // 修改背景色
        button.style.color = '#779977';           // 修改文字颜色
        button.style.border = 'none';
        button.style.borderRadius = '10px';
        button.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';

        button.addEventListener('click', block);
        document.body.appendChild(button);
    }


    window.addEventListener('load', () => {
        addUserListEditor();
        addBlockDaysEditor();
        addButton();
    });
})();
