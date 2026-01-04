// ==UserScript==
// @name         DeepSeek对话分类管理
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为DeepSeek网页版添加分类管理功能
// @author       shy
// @match        https://chat.deepseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/525310/DeepSeek%E5%AF%B9%E8%AF%9D%E5%88%86%E7%B1%BB%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/525310/DeepSeek%E5%AF%B9%E8%AF%9D%E5%88%86%E7%B1%BB%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

/*developed with deepseek*/
(function() {
    'use strict';

    // 初始化存储结构
    const initStorage = () => ({
        categories: {
            '默认分类': []
        },
        records: {}
    });

    // 获取或初始化数据
    const getStorage = () => GM_getValue('classification', initStorage());
    const setStorage = (data) => GM_setValue('classification', data);

    // 创建悬浮控件
    const createFloatingUI = () => {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            transition: all 0.3s ease;
            color: #007BFF; /* 新增全局颜色设置 */
        `;

        // 悬浮按钮
        const toggleBtn = document.createElement('div');
        toggleBtn.innerHTML = '📁';
        toggleBtn.style.cssText = `
            cursor: pointer;
            background: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        // 悬浮窗主体
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            width: 300px;
            max-height: 60vh;
            overflow: hidden;
            display: none;
            flex-direction: column;
        `;

        // 头部
        const header = document.createElement('div');
        header.style.padding = '10px';
        header.style.borderBottom = '1px solid #eee';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';

        const title = document.createElement('h3');
        title.textContent = '对话分类';
        title.style.color = '#2196F3';
        title.style.margin = '0';

        const addBtn = document.createElement('button');
        addBtn.textContent = '+';
        addBtn.onclick = addNewRecord;

        header.append(title, addBtn);

        // 内容区域
        const content = document.createElement('div');
        content.style.overflowY = 'auto';
        content.style.padding = '10px';

        // 组装组件
        panel.append(header, content);
        container.append(toggleBtn, panel);

        // 切换显示状态
        toggleBtn.onclick = () => {
            panel.style.display = panel.style.display === 'none'
                ? 'flex'
                : 'none';
        };

        return { container, content };
    };

    // 添加新记录
    const addNewRecord = async () => {
        const recordName = prompt('请输入记录名称：');
        if (!recordName) return;

        const categoryPath = prompt('请输入分类路径（使用/分隔）：\n示例: 工作/项目1') || '默认分类';
        const currentUrl = window.location.href;

        const storage = getStorage();

        // 创建分类结构
        const pathParts = categoryPath.split('/');
        let currentLevel = storage.categories;

        pathParts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = index === pathParts.length - 1 ? [] : {};
            }
            currentLevel = currentLevel[part];
        });

        // 添加记录
        storage.records[Date.now()] = {
            name: recordName,
            url: currentUrl,
            path: categoryPath
        };

        setStorage(storage);
        refreshContent();
    };

    // 渲染分类树
    const renderTree = (container, categories, path = '') => {
        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.paddingLeft = '15px';

        for (const [name, value] of Object.entries(categories)) {
            const li = document.createElement('li');

            // 分类节点
            const categorySpan = document.createElement('span');
            categorySpan.style.color = '#007BFF'; // 深蓝色
            categorySpan.style.fontWeight = '500'; // 增加可读性
            categorySpan.textContent = name;
            categorySpan.style.cursor = 'pointer';

            // 记录显示
            const recordsDiv = document.createElement('div');
            recordsDiv.style.display = 'none';

            if (Array.isArray(value)) {
                // 显示记录
                const records = getStorage().records;
                Object.values(records)
                    .filter(r => r.path === (path ? `${path}/${name}` : name))
                    .forEach(record => {
                    const recordDiv = document.createElement('div');
                    recordDiv.style.color = '#FE5F5F'; // 与标题同色系
                    recordDiv.textContent = record.name;
                    recordDiv.style.cursor = 'pointer';
                    recordDiv.style.padding = '5px';
                    recordDiv.style.margin = '2px 0';
                    recordDiv.style.borderRadius = '4px';
                    recordDiv.style.backgroundColor = '#f5f5f5';
                    recordDiv.onclick = () => window.open(record.url, '_blank');

                    // 右键菜单事件
                    recordDiv.addEventListener('contextmenu', (e) => {
                        e.preventDefault(); // 阻止默认右键菜单
                        if (confirm(`是否删除记录: ${record.name}?`)) {
                            deleteRecord(record); // 删除记录
                        }
                    });

                    recordsDiv.append(recordDiv);
                });
            } else {
                // 递归子分类
                renderTree(recordsDiv, value, path ? `${path}/${name}` : name);
            }

            // 切换显示
            categorySpan.onclick = () => {
                recordsDiv.style.display = recordsDiv.style.display === 'none'
                    ? 'block'
                : 'none';
            };

            li.append(categorySpan, recordsDiv);
            ul.append(li);
        }

        container.append(ul);
    };

    // 删除记录
    const deleteRecord = (record) => {
        const storage = getStorage();
        const records = storage.records;
        // 找到记录的时间戳
        const timestamp = Object.keys(records).find(t => records[t].name === record.name && records[t].url === record.url);
        if (timestamp) {
            delete records[timestamp];
            setStorage(storage);
            refreshContent();
        }
    };

    // 刷新内容
    const refreshContent = () => {
        contentContainer.innerHTML = '';
        const storage = getStorage();
        renderTree(contentContainer, storage.categories);
    };

    // 初始化
    const { container, content: contentContainer } = createFloatingUI();
    document.body.append(container);
    refreshContent();

    // 注册菜单命令
    GM_registerMenuCommand('清除所有数据', () => {
        if (confirm('确定要清除所有分类数据吗？')) {
            setStorage(initStorage());
            refreshContent();
        }
    });
})();
