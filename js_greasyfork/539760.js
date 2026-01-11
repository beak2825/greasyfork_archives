// ==UserScript==
// @name         文字替换工具
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  文字替换工具，支持按网址分组管理替换规则及原网址映射，添加原链角标显示，修复动态内容替换问题
// @author       Yesaye
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAyZJREFUaEPtmUuoTVEYx39XHokolOfQQCGPQpmIMhADkkgeeRtI7tjYGCNJlGcMvAojkiSMiDAy81YGrgy813db+7Tusvbe59tnrXP2qbsnp87+1tr///re6+uhy5+eGuMfA0wH/gKvga8hrHUkMAs4BKwwv8Ms6J/ALeAg8MIlUjcCa4GzwMgcy/gObASuZ+/rRGC9MZlzwNASsxYSCzNN1IVAHvhXgGCc4ZG6BqyR/0IE5L/dwHZgJjCqoqO/A/YAN0rWh8D/st8Xc5JnJ3DC2Ud8YjzQ5xOYYtW4tCJof9lbYFrBXnngNwGXvHWiDVcT84EnLoEhwG0gFnj5fhEBDXjZq5TAXuBYpJOXbYpMSAt+C3DawfYDmOCb0GPr3ZncTWAH8DEiKdlKCz4kH3TiPmC0A3Yy8KGG4CWMLgBe+lFIUnbKJBfj5CU6bQAuhxJZSgLrgAtekvoNbAXOB7TctLwbhVIRaBqMJaKST01ABcaUB1r5AZk4tga0YLTy/QpLpQEtGK18w21SENCC0crnhsoYJqQFo5X/L2DF1IAWjFY+mFNjEdCC0crnFgQxCEgbeNFLUpIxQyVxlVqosJpplYCU4G8AqZuyp23gY4TRudJUJAK/yhzMcbt3bmfXqgYOAIcdAo0y19O7tpCT5aLZqXaf3MaoVQJXgdUO2F7giAe+qsM2FdZbISD2/8k21xnmeYbQU4dAVfCyRXICvv1/MS3pREBu1pbY3nqlIjr50SY5Ad/+vwHSq47LiXtF0Sm0JDkB3/6L4rUWfFtM6LO9GShMNOZy6z2wD7hSJui9T64BN8y53xZfuG/84K7xg3vAM+CPEnxbNJAlmuHAgwiA2+7EFQ5VtSS5CanQVBAeJNDp2cGgBrpOA/7l7qQEN9PN+rIMWqSEzh4ZsY4NLXZP+RGwyBGS0dCuBDfUZSSkuztpx6yZ7ENgcRmB/cDRst079F5mdu6MrAHD1cAIw1qGHHM6BDLvs3dMpl8e6A/65X1HlRbuDLCsJiQE/GZbEAYh5Y1ZZay5zQwSZntTm3bwkr7iOXDK+oKfDwZg6HSobPlAup7APyoi/DGtMXsgAAAAAElFTkSuQmCC
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539760/%E6%96%87%E5%AD%97%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/539760/%E6%96%87%E5%AD%97%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 生成唯一ID的函数
    function generateUniqueId() {
        return 'rule_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }

    // 从GM存储中获取已保存的替换规则
    function getReplaceRules() {
        return GM_getValue('textReplaceRules', []);
    }

    // 保存替换规则到GM存储
    function saveReplaceRules(rules) {
        GM_setValue('textReplaceRules', rules);
    }

    // 获取网址映射关系
    function getUrlMappings() {
        return GM_getValue('urlMappings', {});
    }

    // 保存网址映射关系
    function saveUrlMappings(mappings) {
        GM_setValue('urlMappings', mappings);
    }

    // 获取默认展开设置
    function getDefaultExpandSetting() {
        return GM_getValue('defaultExpandGroups', false);
    }

    // 保存默认展开设置
    function saveDefaultExpandSetting(expand) {
        GM_setValue('defaultExpandGroups', expand);
    }

    // 获取面板折叠状态
    function getPanelCollapsed() {
        return GM_getValue('panelCollapsed', true);
    }

    // 保存面板折叠状态
    function savePanelCollapsed(collapsed) {
        GM_setValue('panelCollapsed', collapsed);
    }

    // 获取自动替换是否启用
    function getAutoReplaceEnabled() {
        return GM_getValue('autoReplaceEnabled', false);
    }

    // 保存自动替换状态
    function saveAutoReplaceEnabled(enabled) {
        GM_setValue('autoReplaceEnabled', enabled);
    }

    // 检查URL是否匹配模式
    function isUrlMatch(url, regexPattern) {
        if (!regexPattern || regexPattern === '*') return true;

        try {
            // 尝试解码URL（处理中文编码问题）
            let decodedUrl = url;
            try {
                decodedUrl = decodeURI(url);
            } catch (decodeError) {
                // 如果无法完全解码，则尝试部分解码
                try {
                    decodedUrl = decodeURIComponent(url);
                } catch (partialDecodeError) {
                    // 如果仍无法解码，则使用原始URL
                    console.warn('URL解码失败，使用原始URL进行匹配', partialDecodeError);
                }
            }

            // 使用解码后的URL进行正则匹配
            const regex = new RegExp(regexPattern, 'i');
            return regex.test(decodedUrl);
        } catch (error) {
            console.error('正则表达式解析错误:', error);
            return false;
        }
    }

    // 获取当前URL
    function getCurrentUrl() {
        return window.location.href;
    }

    // 获取当前域名
    function getCurrentDomain() {
        return window.location.hostname;
    }

    // 获取所有适用于当前URL的规则
    function getAllRulesForCurrentUrl() {
        const currentUrl = getCurrentUrl();
        const currentDomain = getCurrentDomain();
        const allRules = getReplaceRules();

        return allRules.filter(rule => {
            return isUrlMatch(currentUrl, rule.urlPattern) || isUrlMatch(currentDomain, rule.urlPattern);
        });
    }

    // 将规则按urlPattern分组
    function groupRulesByPattern(rules) {
        const groups = {};
        rules.forEach(rule => {
            const pattern = rule.urlPattern || '*';
            if (!groups[pattern]) groups[pattern] = [];
            groups[pattern].push(rule);
        });
        return groups;
    }

    // 新增：查找匹配当前URL的最长规则
    function findLongestMatchingRule() {
        const rules = getAllRulesForCurrentUrl();
        if (rules.length === 0) return null;

        // 按原文长度降序排序，取第一条
        return rules.sort((a, b) => b.original.length - a.original.length)[0];
    }

    // 新增：自动填充最长匹配规则到输入框
    function autoFillLongestRule() {
        const longestRule = findLongestMatchingRule();
        if (!longestRule) return;

        // const originalInput = document.querySelector('#text-replace-panel input[placeholder="要替换的文字"]');
        // const replacementInput = document.querySelector('#text-replace-panel input[placeholder="替换后的文字"]');
        const urlPatternInput = document.querySelector('#text-replace-panel input[placeholder="网址正则匹配 (例如: ^.*example.com.*$)"]');

        // if (originalInput) {
        //     originalInput.value = longestRule.original;
        // }
        // if (replacementInput) {
        //     replacementInput.value = longestRule.replacement;
        // }
        if (urlPatternInput) {
            urlPatternInput.value = longestRule.urlPattern;
        }
    }


    // 创建管理界面
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'text-replace-panel';
        panel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 400px;
            z-index: 9999;
            background: white;
            padding: 10px;
            box-shadow: 2px 0 10px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: transform 0.3s ease;
            transform-origin: left;
        `;

        // 折叠/展开按钮
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-panel';
        toggleButton.textContent = '收起 ◀';
        toggleButton.style.cssText = `
            position: absolute;
            right: 0px;
            bottom: 10px;
            padding: 5px 8px;
            background-color: #555;
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            font-size: 12px;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transition: .3s all;
        `;

        toggleButton.addEventListener('click', () => {
            const isCollapsed = panel.classList.toggle('collapsed');
            toggleButton.textContent = isCollapsed ? '展开 ▶' : '收起 ◀';
            savePanelCollapsed(isCollapsed);
        });

        panel.appendChild(toggleButton);

        // 新增：默认展开设置
        const defaultExpandToggle = document.createElement('label');
        defaultExpandToggle.style.display = 'flex';
        defaultExpandToggle.style.alignItems = 'center';
        defaultExpandToggle.style.marginBottom = '10px';

        const defaultExpandCheckbox = document.createElement('input');
        defaultExpandCheckbox.type = 'checkbox';
        defaultExpandCheckbox.id = 'default-expand';
        defaultExpandCheckbox.checked = getDefaultExpandSetting();

        const defaultExpandLabel = document.createElement('span');
        defaultExpandLabel.textContent = '展开所有组';
        defaultExpandLabel.style.marginLeft = '5px';
        defaultExpandLabel.style.cursor = 'pointer';

        defaultExpandToggle.appendChild(defaultExpandCheckbox);
        defaultExpandToggle.appendChild(defaultExpandLabel);

        const title = document.createElement('h3');
        title.textContent = '文字替换工具';
        title.style.margin = '0 0 10px 0';

        const originalInput = document.createElement('input');
        originalInput.placeholder = '要替换的文字';
        originalInput.style.padding = '5px';
        originalInput.style.marginBottom = '5px';
        originalInput.style.width = 'calc(100% - 14px)';

        const replacementInput = document.createElement('input');
        replacementInput.placeholder = '替换后的文字';
        replacementInput.style.padding = '5px';
        replacementInput.style.marginBottom = '5px';
        replacementInput.style.width = 'calc(100% - 14px)';

        const urlPatternInput = document.createElement('input');
        urlPatternInput.placeholder = '网址正则匹配 (例如: ^.*example.com.*$)';
        urlPatternInput.style.padding = '5px';
        urlPatternInput.style.marginBottom = '10px';
        urlPatternInput.style.width = 'calc(100% - 14px)';
        urlPatternInput.style.fontSize = '1.5rem';
        urlPatternInput.value = '.*.*.*';

        const addButton = document.createElement('button');
        addButton.textContent = '添加替换';
        addButton.style.padding = '5px 10px';
        addButton.style.backgroundColor = '#4CAF50';
        addButton.style.color = 'white';
        addButton.style.border = 'none';
        addButton.style.cursor = 'pointer';
        addButton.style.marginBottom = '10px';
        addButton.style.width = '100%';

        const applyButton = document.createElement('button');
        applyButton.textContent = '应用替换';
        applyButton.style.padding = '5px 10px';
        applyButton.style.backgroundColor = '#2196F3';
        applyButton.style.color = 'white';
        applyButton.style.border = 'none';
        applyButton.style.cursor = 'pointer';
        applyButton.style.marginBottom = '10px';
        applyButton.style.width = '100%';

        const autoReplaceToggle = document.createElement('label');
        autoReplaceToggle.style.display = 'flex';
        autoReplaceToggle.style.alignItems = 'center';
        autoReplaceToggle.style.marginBottom = '10px';

        const autoReplaceCheckbox = document.createElement('input');
        autoReplaceCheckbox.type = 'checkbox';
        autoReplaceCheckbox.id = 'auto-replace';
        autoReplaceCheckbox.checked = getAutoReplaceEnabled();

        const autoReplaceLabel = document.createElement('span');
        autoReplaceLabel.textContent = '自动替换';
        autoReplaceLabel.style.marginLeft = '5px';
        autoReplaceLabel.style.cursor = 'pointer';

        autoReplaceToggle.appendChild(autoReplaceCheckbox);
        autoReplaceToggle.appendChild(autoReplaceLabel);

        const rulesList = document.createElement('div');
        rulesList.id = 'rules-list';
        rulesList.style.flexGrow = '1';
        rulesList.style.overflowY = 'auto';

        panel.appendChild(title);
        panel.appendChild(originalInput);
        panel.appendChild(replacementInput);
        panel.appendChild(urlPatternInput);
        panel.appendChild(addButton);
        panel.appendChild(applyButton);
        panel.appendChild(autoReplaceToggle);
        panel.appendChild(defaultExpandToggle);
        panel.appendChild(rulesList);

        document.body.insertBefore(panel, document.body.firstChild);

        // 加载已保存的规则
        loadRulesToList();

        // 自动替换复选框事件监听
        autoReplaceCheckbox.addEventListener('change', (e) => {
            saveAutoReplaceEnabled(e.target.checked);
            manageAutoReplacement(e.target.checked); // 管理自动替换状态
        });

        // 添加替换规则（自动生成ID）
        addButton.addEventListener('click', () => {
            const original = originalInput.value.trim();
            const replacement = replacementInput.value.trim();
            const urlPattern = urlPatternInput.value.trim() || '*';

            if (original && replacement) {
                const rules = getReplaceRules();
                rules.push({
                    id: generateUniqueId(),
                    original,
                    replacement,
                    urlPattern
                });
                saveReplaceRules(rules);
                loadRulesToList();
                originalInput.value = '';
                replacementInput.value = '';

                // 如果启用了自动替换，应用新规则
                if (getAutoReplaceEnabled()) {
                    replaceText(getAllRulesForCurrentUrl());
                }
            }
        });

        // 应用替换
        applyButton.addEventListener('click', () => {
            replaceText(getAllRulesForCurrentUrl());
        });

        defaultExpandCheckbox.addEventListener('change', (e) => {
            saveDefaultExpandSetting(e.target.checked);
            loadRulesToList();
        });

        // 恢复面板折叠状态
        if (getPanelCollapsed()) {
            panel.classList.add('collapsed');
            toggleButton.textContent = '展开 ▶';
        }

        return panel;
    }

    // 管理自动替换功能（启动或停止监听）
    function manageAutoReplacement(enabled) {
        const controlPanel = document.getElementById('text-replace-panel');

        // 如果已存在观察者，先断开连接
        if (window.mutationObserver) {
            window.mutationObserver.disconnect();
        }

        if (enabled) {
            // 初始应用替换
            [100, 500, 1000, 2000, 5000].forEach(delay => {
                setTimeout(() => {
                    replaceText(getAllRulesForCurrentUrl());
                }, delay);
            });

            // 创建并启动突变观察者
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    // 只处理添加节点的突变
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // 等待一小段时间，让内容稳定
                        setTimeout(() => {
                            replaceText(getAllRulesForCurrentUrl());
                        }, 300);
                    }
                });
            });

            // 配置观察者选项：监听子节点变化和子树修改
            const config = {
                childList: true,
                subtree: true
            };

            // 开始观察文档体的变化
            observer.observe(document.body, config);

            // 保存观察者实例
            window.mutationObserver = observer;
            console.log('自动替换已启用，正在监听页面内容变化...');
        } else {
            // 停止自动替换
            if (window.mutationObserver) {
                window.mutationObserver.disconnect();
                delete window.mutationObserver;
            }
            console.log('自动替换已禁用');
        }
    }

    // 应用与当前URL匹配的替换规则
    function applyUrlSpecificReplacements() {
        const rules = getAllRulesForCurrentUrl();
        if (rules.length > 0) {
            replaceText(rules);
        }
    }

    // 加载规则到列表（按分组显示，不显示ID列）
    function loadRulesToList() {
        const rulesList = document.getElementById('rules-list');
        rulesList.innerHTML = '';

        const rules = getReplaceRules();
        const groups = groupRulesByPattern(rules);

        if (Object.keys(groups).length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = '暂无替换规则';
            rulesList.appendChild(emptyMsg);
            return;
        }

        const currentUrl = getCurrentUrl();
        const currentDomain = getCurrentDomain();
        const defaultExpand = getDefaultExpandSetting();

        // 分离匹配和不匹配的规则组
        const matchingGroups = {};
        const nonMatchingGroups = {};

        Object.entries(groups).forEach(([pattern, groupRules]) => {
            const isMatching = isUrlMatch(currentUrl, pattern) || isUrlMatch(currentDomain, pattern);
            if (isMatching) {
                matchingGroups[pattern] = groupRules;
            } else {
                nonMatchingGroups[pattern] = groupRules;
            }
        });

        // 先渲染匹配的规则组（始终展开）
        if (Object.keys(matchingGroups).length > 0) {
            Object.entries(matchingGroups).reverse().forEach(([pattern, groupRules]) => {
                const groupContainer = createRuleGroup(pattern, groupRules, true, true); // 匹配组始终展开
                rulesList.appendChild(groupContainer);
            });
        }

        // 再渲染不匹配的规则组（按设置决定是否展开）
        if (Object.keys(nonMatchingGroups).length > 0) {
            Object.entries(nonMatchingGroups).reverse().forEach(([pattern, groupRules]) => {
                const groupContainer = createRuleGroup(pattern, groupRules, false, defaultExpand); // 非匹配组按设置
                rulesList.appendChild(groupContainer);
            });
        }
    }

    // 创建规则分组容器（移除ID列）
    function createRuleGroup(pattern, rules, isMatching, shouldExpand) {
        const groupContainer = document.createElement('div');
        groupContainer.className = 'rule-group';
        groupContainer.style.marginBottom = '15px';
        groupContainer.style.border = '1px solid #ddd';
        groupContainer.style.borderRadius = '4px';

        // 分组标题栏
        const header = document.createElement('div');
        header.className = 'group-header';
        header.style.backgroundColor = isMatching ? '#e8f5e9' : '#f2f2f2';
        header.style.padding = '8px 12px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.cursor = 'pointer';

        const title = document.createElement('h4');
        // 将网址匹配模式包装到可点击的span中
        const patternSpan = document.createElement('span');
        patternSpan.textContent = pattern || '*';
        patternSpan.style.cursor = 'pointer';
        patternSpan.addEventListener('click', () => {
            selectText(patternSpan);
        });

        title.appendChild(patternSpan);
        title.style.margin = '0';
        title.style.fontWeight = isMatching ? 'bold' : 'normal';
        title.style.overflow = 'auto';

        const groupActions = document.createElement('div');
        groupActions.style.display = 'flex';
        groupActions.style.gap = '5px';

        const editGroupBtn = document.createElement('button');
        editGroupBtn.textContent = '修改';
        editGroupBtn.style.padding = '3px 8px';
        editGroupBtn.style.backgroundColor = '#2196F3';
        editGroupBtn.style.color = 'white';
        editGroupBtn.style.border = 'none';
        editGroupBtn.style.cursor = 'pointer';
        editGroupBtn.dataset.pattern = pattern;
        editGroupBtn.addEventListener('click', () => {
            openEditGroupPatternModal(pattern, rules);
        });

        const manageUrlsBtn = document.createElement('button');
        manageUrlsBtn.textContent = '原链';
        manageUrlsBtn.style.padding = '3px 8px';
        manageUrlsBtn.style.backgroundColor = '#FF9800';
        manageUrlsBtn.style.color = 'white';
        manageUrlsBtn.style.border = 'none';
        manageUrlsBtn.style.cursor = 'pointer';
        manageUrlsBtn.dataset.pattern = pattern;

        // 添加角标元素
        const badge = document.createElement('span');
        badge.className = 'url-badge';
        const urlCount = getUrlMappings()[pattern]?.length || 0;
        badge.textContent = urlCount;
        manageUrlsBtn.appendChild(badge);

        manageUrlsBtn.addEventListener('click', () => {
            openManageUrlsModal(pattern);
        });

        const collapseBtn = document.createElement('button');
        const isCollapsed = !shouldExpand; // 非匹配组按设置决定是否折叠
        collapseBtn.textContent = isCollapsed ? '▲' : '▼';
        collapseBtn.style.padding = '3px 6px';
        collapseBtn.style.backgroundColor = '#ddd';
        collapseBtn.style.color = '#333';
        collapseBtn.style.border = 'none';
        collapseBtn.style.borderRadius = '2px';
        collapseBtn.style.cursor = 'pointer';
        collapseBtn.dataset.collapsed = isCollapsed;
        collapseBtn.addEventListener('click', (e) => {
            const isCollapsed = e.target.dataset.collapsed === 'true';
            const content = groupContainer.querySelector('.group-content');
            content.style.display = isCollapsed ? 'block' : 'none';
            e.target.textContent = isCollapsed ? '▼' : '▲';
            e.target.dataset.collapsed = !isCollapsed;
        });

        groupActions.appendChild(editGroupBtn);
        groupActions.appendChild(manageUrlsBtn);
        groupActions.appendChild(collapseBtn);
        header.appendChild(title);
        header.appendChild(groupActions);
        groupContainer.appendChild(header);

        // 分组内容
        const content = document.createElement('div');
        content.className = 'group-content';
        content.style.padding = '8px';
        content.style.display = isCollapsed ? 'none' : 'block'; // 按初始状态显示

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.tableLayout = 'fixed';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="background-color: #f9f9f9;">
                <th style="padding: 6px; text-align: left; width: 35%;">原文</th>
                <th style="padding: 6px; text-align: left; width: 35%;">替换</th>
                <th style="padding: 6px; text-align: center; width: 30%;">操作</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        rules.forEach(rule => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #eee';

            // 为当前URL匹配的规则添加高亮
            if (isUrlMatch(getCurrentUrl(), rule.urlPattern) || isUrlMatch(getCurrentDomain(), rule.urlPattern)) {
                tr.style.backgroundColor = '#e8f5e9';
            }

            const originalTd = document.createElement('td');
            originalTd.textContent = rule.original;
            originalTd.style.padding = '6px';
            originalTd.style.overflow = 'hidden';
            originalTd.style.textOverflow = 'ellipsis';
            originalTd.style.whiteSpace = 'nowrap';
            originalTd.title = rule.original;

            const replacementTd = document.createElement('td');
            replacementTd.textContent = rule.replacement;
            replacementTd.style.padding = '6px';
            replacementTd.style.overflow = 'hidden';
            replacementTd.style.textOverflow = 'ellipsis';
            replacementTd.style.whiteSpace = 'nowrap';
            replacementTd.title = rule.replacement;

            const actionTd = document.createElement('td');
            actionTd.style.textAlign = 'center';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.gap = '5px';

            const editBtn = document.createElement('button');
            editBtn.textContent = '编辑';
            editBtn.style.padding = '2px 6px';
            editBtn.style.backgroundColor = '#2196F3';
            editBtn.style.color = 'white';
            editBtn.style.border = 'none';
            editBtn.style.cursor = 'pointer';
            editBtn.dataset.id = rule.id;
            editBtn.addEventListener('click', () => {
                openEditRuleModal(rule.id, rule);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.style.padding = '2px 6px';
            deleteBtn.style.backgroundColor = '#f44336';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.dataset.id = rule.id;
            deleteBtn.addEventListener('click', () => {
                deleteRuleById(rule.id);
                loadRulesToList();
            });

            buttonContainer.appendChild(editBtn);
            buttonContainer.appendChild(deleteBtn);
            actionTd.appendChild(buttonContainer);

            tr.appendChild(originalTd);
            tr.appendChild(replacementTd);
            tr.appendChild(actionTd);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        content.appendChild(table);
        groupContainer.appendChild(content);

        return groupContainer;
    }

    // 新增：选中元素文本的函数
    function selectText(element) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    // 删除指定ID的规则
    function deleteRuleById(ruleId) {
        const allRules = getReplaceRules();
        const updatedRules = allRules.filter(rule => rule.id !== ruleId);
        saveReplaceRules(updatedRules);
    }

    // 打开编辑组匹配模式的模态框
    function openEditGroupPatternModal(oldPattern, groupRules) {
        // 创建模态框背景
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'edit-group-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // 创建模态框内容
        const modalContent = document.createElement('div');
        modalContent.id = 'edit-group-modal-content';
        modalContent.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            max-width: 400px;
            width: 90%;
            position: relative;
        `;

        // 标题
        const title = document.createElement('h3');
        title.textContent = '修改网址匹配模式';
        title.style.marginTop = '0';

        // 说明文本
        const desc = document.createElement('p');
        desc.textContent = `将以下 ${groupRules.length} 条规则的匹配模式从 "${oldPattern}" 修改为:`;
        desc.style.color = '#666';
        desc.style.marginBottom = '15px';

        // 新匹配模式输入
        const patternLabel = document.createElement('label');
        patternLabel.textContent = '网址正则匹配 (例如: ^.*example.com.*$):';
        patternLabel.style.display = 'block';
        patternLabel.style.marginBottom = '5px';

        const patternInput = document.createElement('input');
        patternInput.type = 'text';
        patternInput.value = oldPattern;
        patternInput.style.width = '100%';
        patternInput.style.padding = '8px';
        patternInput.style.boxSizing = 'border-box';
        patternInput.required = true;

        // 按钮组
        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.justifyContent = 'flex-end';
        buttonGroup.style.marginTop = '20px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.padding = '8px 15px';
        cancelBtn.style.marginRight = '10px';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存修改';
        saveBtn.style.padding = '8px 15px';
        saveBtn.style.backgroundColor = '#4CAF50';
        saveBtn.style.color = 'white';
        saveBtn.style.border = 'none';
        saveBtn.style.cursor = 'pointer';
        saveBtn.addEventListener('click', () => {
            const newPattern = patternInput.value.trim() || '*';
            if (!newPattern) {
                alert('网址匹配模式不能为空');
                return;
            }

            // 通过ID更新规则
            const allRules = getReplaceRules();
            groupRules.forEach(rule => {
                const ruleIndex = allRules.findIndex(r => r.id === rule.id);
                if (ruleIndex !== -1) {
                    allRules[ruleIndex].urlPattern = newPattern;
                }
            });

            saveReplaceRules(allRules);
            loadRulesToList();
            document.body.removeChild(modalOverlay);
            replaceText(getAllRulesForCurrentUrl());
        });

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.backgroundColor = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });

        // 组装模态框
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(desc);
        modalContent.appendChild(patternLabel);
        modalContent.appendChild(patternInput);
        modalContent.appendChild(buttonGroup);
        buttonGroup.appendChild(cancelBtn);
        buttonGroup.appendChild(saveBtn);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }

    // 打开编辑规则的模态框（隐藏ID显示）
    function openEditRuleModal(ruleId, rule) {
        const allRules = getReplaceRules();
        const targetRule = allRules.find(r => r.id === ruleId);
        if (!targetRule) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'edit-rule-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.id = 'edit-rule-modal-content';
        modalContent.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            max-width: 400px;
            width: 90%;
            position: relative;
        `;

        const title = document.createElement('h3');
        title.textContent = '编辑替换规则';
        title.style.marginTop = '0';

        const originalLabel = document.createElement('label');
        originalLabel.textContent = '原文:';
        originalLabel.style.display = 'block';
        originalLabel.style.marginBottom = '5px';

        const originalInput = document.createElement('input');
        originalInput.type = 'text';
        originalInput.value = targetRule.original;
        originalInput.style.width = '100%';
        originalInput.style.padding = '8px';
        originalInput.style.boxSizing = 'border-box';
        originalInput.required = true;

        const replacementLabel = document.createElement('label');
        replacementLabel.textContent = '替换为:';
        replacementLabel.style.display = 'block';
        replacementLabel.style.marginTop = '15px';
        replacementLabel.style.marginBottom = '5px';

        const replacementInput = document.createElement('input');
        replacementInput.type = 'text';
        replacementInput.value = targetRule.replacement;
        replacementInput.style.width = '100%';
        replacementInput.style.padding = '8px';
        replacementInput.style.boxSizing = 'border-box';
        replacementInput.required = true;

        const urlPatternLabel = document.createElement('label');
        urlPatternLabel.textContent = '网址正则匹配 (例如: ^.*example.com.*$):';
        urlPatternLabel.style.display = 'block';
        urlPatternLabel.style.marginTop = '15px';
        urlPatternLabel.style.marginBottom = '5px';

        const urlPatternInput = document.createElement('input');
        urlPatternInput.type = 'text';
        urlPatternInput.value = targetRule.urlPattern || '*';
        urlPatternInput.style.width = '100%';
        urlPatternInput.style.padding = '8px';
        urlPatternInput.style.boxSizing = 'border-box';

        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.justifyContent = 'flex-end';
        buttonGroup.style.marginTop = '20px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.padding = '8px 15px';
        cancelBtn.style.marginRight = '10px';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存修改';
        saveBtn.style.padding = '8px 15px';
        saveBtn.style.backgroundColor = '#4CAF50';
        saveBtn.style.color = 'white';
        saveBtn.style.border = 'none';
        saveBtn.style.cursor = 'pointer';
        saveBtn.addEventListener('click', () => {
            const original = originalInput.value.trim();
            const replacement = replacementInput.value.trim();
            const urlPattern = urlPatternInput.value.trim() || '*';

            if (original && replacement) {
                // 通过ID更新规则
                const updatedRules = allRules.map(rule => {
                    if (rule.id === ruleId) {
                        return { ...rule, original, replacement, urlPattern };
                    }
                    return rule;
                });
                saveReplaceRules(updatedRules);
                loadRulesToList();
                document.body.removeChild(modalOverlay);
                replaceText(getAllRulesForCurrentUrl());
            } else {
                alert('原文和替换文本不能为空');
            }
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.backgroundColor = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(originalLabel);
        modalContent.appendChild(originalInput);
        modalContent.appendChild(replacementLabel);
        modalContent.appendChild(replacementInput);
        modalContent.appendChild(urlPatternLabel);
        modalContent.appendChild(urlPatternInput);
        modalContent.appendChild(buttonGroup);
        buttonGroup.appendChild(cancelBtn);
        buttonGroup.appendChild(saveBtn);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }

    // 打开管理原网址的模态框
    function openManageUrlsModal(pattern) {
        const urls = getUrlMappings()[pattern] || [];

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'manage-urls-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.id = 'manage-urls-modal-content';
        modalContent.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            max-width: 500px;
            width: 90%;
            position: relative;
        `;

        const title = document.createElement('h3');
        title.textContent = `管理匹配模式 "${pattern}" 的原网址 (${urls.length})`;
        title.style.marginTop = '0';

        const urlList = document.createElement('div');
        urlList.id = 'url-list';
        urlList.style.marginBottom = '15px';
        urlList.style.padding = '10px';
        urlList.style.border = '1px solid #ddd';
        urlList.style.borderRadius = '4px';
        urlList.style.maxHeight = '200px';
        urlList.style.overflowY = 'auto';

        if (urls.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = '暂无原网址记录';
            emptyMsg.style.color = '#666';
            urlList.appendChild(emptyMsg);
        } else {
            urls.forEach((url, index) => {
                const urlItem = document.createElement('div');
                urlItem.style.display = 'flex';
                urlItem.style.alignItems = 'center';
                urlItem.style.padding = '5px 0';
                urlItem.style.borderBottom = '1px dashed #eee';

                const urlLink = document.createElement('a');
                urlLink.href = url;
                urlLink.textContent = url;
                urlLink.style.color = '#0066cc';
                urlLink.style.textDecoration = 'underline';
                urlLink.style.wordBreak = 'break-all';
                urlLink.style.flexGrow = '1';
                urlLink.target = '_blank';

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '删除';
                deleteBtn.style.padding = '2px 6px';
                deleteBtn.style.backgroundColor = '#f44336';
                deleteBtn.style.color = 'white';
                deleteBtn.style.border = 'none';
                deleteBtn.style.borderRadius = '2px';
                deleteBtn.style.marginLeft = '5px';
                deleteBtn.style.cursor = 'pointer';
                deleteBtn.dataset.index = index;
                deleteBtn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    urls.splice(index, 1);
                    const newMappings = { ...getUrlMappings(), [pattern]: urls };
                    saveUrlMappings(newMappings);
                    loadUrlList(urlList, urls, pattern);
                    updateUrlBadges(); // 更新角标
                });

                urlItem.appendChild(urlLink);
                urlItem.appendChild(deleteBtn);
                urlList.appendChild(urlItem);
            });
        }

        const addUrlContainer = document.createElement('div');
        addUrlContainer.style.display = 'flex';
        addUrlContainer.style.marginBottom = '15px';

        const addUrlInput = document.createElement('input');
        addUrlInput.type = 'url';
        addUrlInput.placeholder = '输入原网址 (例如: https://example.com)';
        addUrlInput.style.flexGrow = '1';
        addUrlInput.style.padding = '8px';
        addUrlInput.style.marginRight = '5px';
        addUrlInput.style.boxSizing = 'border-box';

        const addUrlBtn = document.createElement('button');
        addUrlBtn.textContent = '添加';
        addUrlBtn.style.padding = '8px 15px';
        addUrlBtn.style.backgroundColor = '#4CAF50';
        addUrlBtn.style.color = 'white';
        addUrlBtn.style.border = 'none';
        addUrlBtn.style.cursor = 'pointer';
        addUrlBtn.addEventListener('click', () => {
            const url = addUrlInput.value.trim();
            if (url && !urls.includes(url)) {
                urls.push(url);
                saveUrlMappings({ ...getUrlMappings(), [pattern]: urls });
                addUrlInput.value = '';
                loadUrlList(urlList, urls, pattern);
                updateUrlBadges(); // 更新角标
            } else if (!url) {
                alert('请输入有效的网址');
            } else {
                alert('该网址已存在');
            }
        });

        addUrlContainer.appendChild(addUrlInput);
        addUrlContainer.appendChild(addUrlBtn);

        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.justifyContent = 'flex-end';
        buttonGroup.style.marginTop = '20px';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.padding = '8px 15px';
        closeBtn.style.backgroundColor = '#666';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });

        buttonGroup.appendChild(closeBtn);

        // 组装模态框
        modalContent.appendChild(title);
        modalContent.appendChild(urlList);
        modalContent.appendChild(addUrlContainer);
        modalContent.appendChild(buttonGroup);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }

    // 加载网址列表到模态框
    function loadUrlList(container, urls, pattern) {
        container.innerHTML = '';
        if (urls.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = '暂无原网址记录';
            emptyMsg.style.color = '#666';
            container.appendChild(emptyMsg);
            return;
        }

        urls.forEach((url, index) => {
            const urlItem = document.createElement('div');
            urlItem.style.display = 'flex';
            urlItem.style.alignItems = 'center';
            urlItem.style.padding = '5px 0';
            urlItem.style.borderBottom = '1px dashed #eee';

            const urlLink = document.createElement('a');
            urlLink.href = url;
            urlLink.textContent = url;
            urlLink.style.color = '#0066cc';
            urlLink.style.textDecoration = 'underline';
            urlLink.style.wordBreak = 'break-all';
            urlLink.style.flexGrow = '1';
            urlLink.target = '_blank';

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.style.padding = '2px 6px';
            deleteBtn.style.backgroundColor = '#f44336';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.borderRadius = '2px';
            deleteBtn.style.marginLeft = '5px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.dataset.index = index;
            deleteBtn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                urls.splice(index, 1);
                const mappings = getUrlMappings();
                const newMappings = { ...mappings, [pattern]: urls };
                saveUrlMappings(newMappings);
                loadUrlList(container, urls, pattern);
                updateUrlBadges(); // 更新角标
            });

            urlItem.appendChild(urlLink);
            urlItem.appendChild(deleteBtn);
            container.appendChild(urlItem);
        });
    }

    // 更新所有原链按钮的角标
    function updateUrlBadges() {
        const manageUrlsButtons = document.querySelectorAll('button[data-pattern]');
        manageUrlsButtons.forEach(button => {
            const pattern = button.dataset.pattern;
            const badge = button.querySelector('.url-badge');
            const urlCount = getUrlMappings()[pattern]?.length || 0;
            if (badge) {
                badge.textContent = urlCount;
            }
        });
    }

    // 替换页面文字
    function replaceText(rules) {
        if (!rules || rules.length === 0) return;

        const controlPanel = document.getElementById('text-replace-panel');

        function processTextNode(node) {
            if (controlPanel && controlPanel.contains(node)) return;

            let text = node.nodeValue;
            let modified = false;

            rules.forEach(rule => {
                const regex = new RegExp(rule.original, 'g');
                if (regex.test(text)) {
                    text = text.replace(regex, rule.replacement);
                    modified = true;
                }
            });

            if (modified) {
                node.nodeValue = text;
            }
        }

        function walk(node) {
            if (node === controlPanel) return;

            if (node.nodeType === Node.TEXT_NODE) {
                processTextNode(node);
            } else {
                let child = node.firstChild;
                while (child) {
                    walk(child);
                    child = child.nextSibling;
                }
            }
        }

        walk(document.body);
        console.log(`已应用 ${rules.length} 条替换规则！`);
    }

    // 初始化
    const controlPanel = createControlPanel();

    // 检查自动替换状态并初始化
    const autoReplaceEnabled = getAutoReplaceEnabled();
    if (autoReplaceEnabled) {
        manageAutoReplacement(true);
    }

    // 新增：页面加载完成后自动填充最长匹配规则
    window.addEventListener('load', autoFillLongestRule);

    // 新增：监听URL变化，URL变化时检查并填充
    window.addEventListener('popstate', () => {
        autoFillLongestRule();
    });

    // 添加样式
    GM_addStyle(`
        #text-replace-panel table th, #text-replace-panel table td {
            border: 1px solid #ddd;
        }
        #text-replace-panel button:hover {
            opacity: 0.8;
        }
        #text-replace-panel.collapsed {
            transform: translateX(-100%);
        }
        #text-replace-panel.collapsed #toggle-panel {
            transform: translateX(100%);
            background-color: #333;
        }
        #text-replace-panel input, #text-replace-panel button {
            box-sizing: border-box;
        }
        #text-replace-panel table {
            min-width: 280px;
        }

        /* 分组样式 */
        .rule-group {
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .group-header {
            background-color: #f2f2f2;
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }
        .group-content {
            padding: 8px;
        }
        #text-replace-panel h4 {
            margin: 0;
            font-weight: normal;
        }

        /* 匹配组样式 */
        .group-header[style*="background-color: #e8f5e9"] {
            border-left: 4px solid #4caf50;
            font-weight: bold;
        }

        /* 模态框样式 */
        #edit-rule-modal-overlay, #edit-group-modal-overlay, #manage-urls-modal-overlay {
            backdrop-filter: blur(2px);
        }
        #edit-rule-modal-content button, #edit-group-modal-content button, #manage-urls-modal-content button {
            font-family: Arial, sans-serif;
        }
        #text-replace-panel button {
            white-space: nowrap;
            padding: 3px 10px;
        }

        /* 网址管理模态框样式 */
        #url-list a {
            display: inline-block;
            max-width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* 角标样式 */
        .url-badge {
            display: inline-block;
            margin-left: 3px;
            padding: 0 3px;
            background-color: #e74c3c;
            border-radius: 10px;
            color: white;
            font-size: 10px;
            line-height: 1;
            vertical-align: middle;
        }
    `);
})();