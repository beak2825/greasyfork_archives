// ==UserScript==
// @name         纪念币预约辅助工具
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  纪念币预约辅助工具,可以在预约前提前录入人员信息,在预约时点击复制,快速录入预约人的信息,添加了时间便于预约
// @author       jiangbkvir,pengjackchen
// @include        *://*.icbc.com.cn/*
// @include        *://*.ccb.com/*
// @include        *://*.bankcomm.com/*
// @include        *://*.hxb.com.cn/*
// @include        *://*.spdb.com.cn/*
// @include        *://*.psbc.com/*
// @include        *://*.abchina.com/*
// @include        *://*.boc.cn/*
// @include        *://*.szbk.com/*
// @include        *://*.hxb.com.cn/*
// @include        *://*.csbbank.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521654/%E7%BA%AA%E5%BF%B5%E5%B8%81%E9%A2%84%E7%BA%A6%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/521654/%E7%BA%AA%E5%BF%B5%E5%B8%81%E9%A2%84%E7%BA%A6%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    // 启用严格模式
    'use strict';

    // 页面加载完成后执行,向指定元素添加监听事件
    window.addEventListener('load', () => {
        // 创建表单容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '40%';
        container.style.right = '0';
        container.style.transform = 'translateY(-50%)';
        container.style.width = '350px';
        container.style.maxHeight = '90%';
        container.style.overflowY = 'auto';
        container.style.padding = '50px 5px 5px';
        container.style.background = 'rgba(249, 249, 249, .8)';
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        container.style.zIndex = '9999';
        container.id = 'formContainer';


        // 创建提示框
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '10%'; // 靠近页面顶部显示
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.minWidth = '300px';
        notification.style.padding = '10px';
        notification.style.background = '#4caf50';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        notification.style.fontSize = '14px';
        notification.style.textAlign = 'center';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(notification);

        // 显示提示信息
        function showNotification(message, type = 'success') {
            notification.innerText = message;
            notification.style.background = type === 'success' ? '#4caf50' : '#f44336';
            notification.style.opacity = '1';
            setTimeout(() => {
                notification.style.opacity = '0';
            }, 2000); // 提示2秒后消失
        }


        // 存储表单数据
        const data = [];

        // 验证手机号
        function validateMobile(mobile) {
            return /^1[3-9]\d{9}$/.test(mobile);
        }

        // 验证身份证号
        function validateIDCard(idCard) {
            return /^\d{15}$|^\d{17}[0-9X]$/.test(idCard);
        }

        // 创建单个表单（卡片样式）
        function createForm(entry = {name: '', mobile: '', idCard: '', other: ''}, index) {
            const card = document.createElement('div');
            card.style.marginBottom = '10px';
            card.style.border = '1px solid #ddd';
            card.style.borderRadius = '8px';
            card.style.padding = '10px 40px 0px 10px';
            card.style.background = 'rgba(249, 249, 249, .4)';
            card.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
            card.style.position = 'relative';

            // 删除按钮放到右上角
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'X';
            deleteButton.style.position = 'absolute';
            deleteButton.style.top = '5px';
            deleteButton.style.right = '5px';
            deleteButton.style.padding = '5px 8px';
            deleteButton.style.background = '#dc3545';
            deleteButton.style.color = '#fff';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '50%';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.fontSize = '14px';

            deleteButton.addEventListener('click', () => {
                data.splice(index, 1);  // 删除对应数据
                card.remove();  // 删除表单
                showNotification('表单已删除！');
                saveData();  // 删除后更新保存数据
            });

            const fields = ['name', 'idCard', 'mobile', 'other'];
            const labels = ['姓名', '身份证号', '手机号', '其他'];

            fields.forEach((field, idx) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.marginBottom = '8px';

                const label = document.createElement('label');
                label.innerText = `${labels[idx]}：`;
                label.style.width = '80px'; // 优化标签宽度，减少空间浪费
                label.style.fontSize = '12px';

                const input = document.createElement('input');
                input.type = 'text';
                input.value = entry[field];
                input.style.flex = '1';
                input.style.padding = '4px';
                input.style.border = '1px solid #ccc';
                input.style.borderRadius = '4px';
                input.style.marginRight = '10px';
                input.style.fontSize = '12px';
                input.style.maxWidth = '100%'; // 确保所有输入框宽度一致

                input.addEventListener('blur', () => {
                    let valid = true;

                    // 校验
                    if (field === 'mobile' && !validateMobile(input.value)) {
                        showNotification('手机号格式不正确！', 'error');
                        input.value = '';  // 清空输入框
                        valid = false;
                    }
                    if (field === 'idCard' && !validateIDCard(input.value)) {
                        showNotification('身份证号格式不正确！', 'error');
                        input.value = '';  // 清空输入框
                        valid = false;
                    }

                    // 如果校验通过
                    if (valid) {
                        entry[field] = input.value;  // 更新数据
                        showNotification('数据已保存！');
                    } else {
                        entry[field] = '';  // 保证无效数据清空
                    }

                    saveData();  // 每次输入框失去焦点时自动保存
                });

                // 创建复制按钮并放置在输入框后
                const copyButton = document.createElement('button');
                copyButton.innerText = '复制';
                copyButton.style.marginLeft = '8px';
                copyButton.style.padding = '4px 8px';
                copyButton.style.background = '#007bff';
                copyButton.style.color = '#fff';
                copyButton.style.border = 'none';
                copyButton.style.borderRadius = '5px';
                copyButton.style.cursor = 'pointer';
                copyButton.style.fontSize = '12px';

                copyButton.addEventListener('click', () => {
                    const inputValue = input.value; // 获取当前输入框的值
                    navigator.clipboard.writeText(inputValue)  // 将输入框的值复制到剪贴板
                        .then(() => {
                            const name = entry.name || '姓名';
                            let message = `${name} 已复制！`;
                            if (field === 'idCard') {
                                message = `${name} 身份证已复制！`;
                            } else if (field === 'mobile') {
                                message = `${name} 手机号已复制！`;
                            } else if (field === 'other') {
                                message = `${name} 其他信息已复制！`;
                            }
                            showNotification(message);
                        })
                        .catch(() => showNotification('复制失败！', 'error'));
                });

                row.appendChild(label);
                row.appendChild(input);
                row.appendChild(copyButton);  // 将复制按钮放到输入框后面
                card.appendChild(row);

                // 动态更新数据
                input.addEventListener('input', () => {
                    entry[field] = input.value;
                });
            });

            card.appendChild(deleteButton);
            container.appendChild(card);
        }

        // 保存数据
        function saveData() {
            // localStorage.setItem('formData', JSON.stringify(data));
            GM_setValue('formData', JSON.stringify(data));
        }

        // 添加按钮组（放置按钮）
        function addButtons() {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.id = 'buttonsContainer';
            buttonsContainer.style.marginBottom = '10px';
            buttonsContainer.style.display = 'flex';
            buttonsContainer.style.flexDirection = 'row'; // 保持在同一行显示按钮
            buttonsContainer.style.alignItems = 'center';
            buttonsContainer.style.position = 'absolute';
            buttonsContainer.style.top = '10px'; // 确保按钮在顶部固定

            // 添加表单按钮
            const addButton = document.createElement('button');
            addButton.innerText = '添加';
            addButton.style.marginRight = '8px';
            addButton.style.padding = '6px 10px';
            addButton.style.background = '#28a745';
            addButton.style.color = '#fff';
            addButton.style.border = 'none';
            addButton.style.borderRadius = '5px';
            addButton.style.cursor = 'pointer';
            addButton.style.fontSize = '12px';

            addButton.addEventListener('click', () => {
                const newEntry = {name: '', mobile: '', idCard: '', other: ''};
                data.push(newEntry);
                createForm(newEntry, data.length - 1);
                saveData(); // 自动保存
            });

            // 导出按钮
            const exportButton = document.createElement('button');
            exportButton.innerText = '导出';
            exportButton.style.marginRight = '8px';
            exportButton.style.padding = '6px 10px';
            exportButton.style.background = '#007bff';
            exportButton.style.color = '#fff';
            exportButton.style.border = 'none';
            exportButton.style.borderRadius = '5px';
            exportButton.style.cursor = 'pointer';
            exportButton.style.fontSize = '12px';

            exportButton.addEventListener('click', () => {
                const jsonData = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonData], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'form_data.json';
                a.click();
            });

            // 导入按钮
            const importButton = document.createElement('button');
            importButton.innerText = '导入';
            importButton.style.marginRight = '8px';
            importButton.style.padding = '6px 10px';
            importButton.style.background = '#ffc107';
            importButton.style.color = '#000';
            importButton.style.border = 'none';
            importButton.style.borderRadius = '5px';
            importButton.style.cursor = 'pointer';
            importButton.style.fontSize = '12px';

            importButton.addEventListener('click', () => {
                if (confirm('导入会覆盖现有数据，确定导入吗？')) {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.addEventListener('change', (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                try {
                                    const importedData = JSON.parse(e.target.result);
                                    data.splice(0, data.length, ...importedData); // 更新数据
                                    container.innerHTML = ''; // 清空现有表单
                                    addButtons(); // 重新添加按钮组
                                    importedData.forEach(entry => {
                                        createForm(entry, data.length - 1);
                                    });
                                    saveData(); // 导入后自动保存
                                } catch (error) {
                                    showNotification('导入的文件格式不正确！', 'error');
                                }
                            };
                            reader.readAsText(file);
                        }
                    });
                    input.click();
                }
            });

            // 收起按钮
            const collapseButton = document.createElement('button');
            collapseButton.innerText = '收起';
            collapseButton.style.marginRight = '8px';
            collapseButton.style.padding = '6px 10px';
            collapseButton.style.background = '#6c757d';
            collapseButton.style.color = '#fff';
            collapseButton.style.border = 'none';
            collapseButton.style.borderRadius = '5px';
            collapseButton.style.cursor = 'pointer';
            collapseButton.style.fontSize = '12px';

            collapseButton.addEventListener('click', () => {
                container.style.display = 'none';  // 收起表单容器
                expandButton.style.display = 'inline-block';  // 显示展开按钮
            });

            buttonsContainer.appendChild(addButton);
            buttonsContainer.appendChild(exportButton);
            buttonsContainer.appendChild(importButton);
            buttonsContainer.appendChild(collapseButton);
            container.appendChild(buttonsContainer);

            //添加一个当前日期时间,只需要显示时间
            const currentDate = new Date();
            const currentTime = currentDate.toLocaleTimeString();
            const currentDateElement = document.createElement('div');
            currentDateElement.innerText = currentTime;
            currentDateElement.style.color = 'red';
            currentDateElement.style.padding = '0px 40px';
            buttonsContainer.appendChild(currentDateElement);
            setInterval(() => {
                const currentTime = new Date().toLocaleTimeString();
                currentDateElement.innerText = currentTime;
            }, 1000);
        }

        // 展开按钮
        const expandButton = document.createElement('button');
        expandButton.innerText = '展开';
        expandButton.style.marginRight = '8px';
        expandButton.style.padding = '6px 10px';
        expandButton.style.background = '#28a745';
        expandButton.style.color = '#fff';
        expandButton.style.border = 'none';
        expandButton.style.borderRadius = '5px';
        expandButton.style.cursor = 'pointer';
        expandButton.style.fontSize = '12px';
        expandButton.style.display = 'none';  // 默认隐藏展开按钮
        expandButton.style.position = 'fixed';
        expandButton.style.top = '50%';
        expandButton.style.right = '0';
        expandButton.style.transform = 'translateY(-50%)';

        expandButton.addEventListener('click', () => {
            container.style.display = 'block';  // 展开表单容器
            expandButton.style.display = 'none';  // 隐藏展开按钮
        });

        // 添加展开按钮到 body
        document.body.appendChild(expandButton);


        // 从 Tampermonkey 存储空间获取数据
        let savedData;
        try {
            savedData = GM_getValue('formData', [])// 如果没有保存数据，返回空字符串
        } catch (err) {
            savedData = [];
        }


        if (!savedData) {
            console.log('没有找到保存的数据');
            return
        }
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                parsedData.forEach(entry => {
                    data.push(entry);  // 将保存的数据添加到数据数组
                    createForm(entry, data.length - 1);  // 创建表单
                });
                showNotification('已加载保存的数据！');
            } catch (error) {
                showNotification('加载保存的数据失败！', 'error');
            }
        }

        addButtons();  // 添加按钮组
        document.body.appendChild(container);  // 将容器添加到页面

    });
})();