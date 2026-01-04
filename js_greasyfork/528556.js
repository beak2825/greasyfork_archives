// ==UserScript==
// @name         Linux DO 关键词过滤器
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  根据关键词智能过滤 Linux Do 论坛上的水贴，支持 SPA 页面切换
// @author       whiteSnow
// @match        https://linux.do/*
// @match        https://*.discourse.org/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528556/Linux%20DO%20%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528556/Linux%20DO%20%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 序列化处理（解决正则表达式无法直接存储的问题）
    function serializeKeywordGroups(groups) {
        return JSON.stringify(groups, (key, value) => {
            if (value instanceof RegExp) {
                return { __type: 'RegExp', source: value.source, flags: value.flags };
            }
            return value;
        });
    }

    // 反序列化处理
    function deserializeKeywordGroups(jsonStr) {
        return JSON.parse(jsonStr, (key, value) => {
            if (value?.__type === 'RegExp') {
                return new RegExp(value.source, value.flags);
            }
            return value;
        });
    }
    // 关键词分组配置 - 使用更精确的匹配模式
    const DEFAULT_KEYWORD_GROUPS = {
        '水贴': [
            { words: ['恭喜', '通过',"赞",'好'], minCount: 1,maxLength:10 },  // 同时包含这些词中至少2个
            { words: ['骚扰'], context: ['欢迎', '邮箱'],maxLength:10 },  // 包含"骚扰"且上下文中有"欢迎"或"邮箱"
            { words: ['申请'], context: ['通过', '审核', '等待'], maxLength: 10 },  // 包含"申请"且上下文有相关词，且内容较短
            { exact: '期待ing' },  // 精确匹配
            { regex: /\b申请.*?(通过|成功)\b/i,maxLength:10 }  // 正则匹配
        ],
        '感谢':[
            { words: ['感谢','谢谢'],maxLength:15},
        ],
        '大佬':[
            { words: ['大佬','太强了','厉害','牛逼','牛','大佬牛逼','大佬厉害','大佬牛','tql','666'],maxLength:15},
        ],
        '打卡':[
            { words: ['打卡','签到','签个到','打个卡','来了','来来来','前排','支持','围观'],maxLength:15},
            // { words: ['Mark', 'mark', '马克'],maxLength:10},   //添加mark，by snowsoul
            { regex: /\b(mark|马克)\b/i,maxLength:10},   //添加mark，by snowsoul
        ],
        '技术': [
            { words: ['代码', '问题'], minCount: 1, context: ['解决', '实现', '如何'],maxLength:20 },
            { words: ['教程', '学习'], context: ['方法', '步骤'] ,maxLength:50},
            { regex: /\b(bug|error|exception|failed)\b/i,maxLength:20 }
        ],
    };

    let keywordGroups = DEFAULT_KEYWORD_GROUPS;
    if (!GM_getValue("defaultKeywordGroups")) {
        GM_setValue("defaultKeywordGroups", serializeKeywordGroups(DEFAULT_KEYWORD_GROUPS));
    }
    
    // 添加过滤统计面板样式
    GM_addStyle(`
        #filter-stats {
            position: fixed;
            top: 70px;
            left: 20px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            font-size: 14px;
            min-width: 180px;
        }
        #filter-stats h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .filter-group {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .filter-count {
            font-weight: bold;
            color: #e45735;
        }
        .filter-toggle {
            cursor: pointer;
            user-select: none;
            display: block;
            margin-top: 10px;
            text-align: center;
            color: #0088cc;
        }
        .filter-settings {
            cursor: pointer;
            user-select: none;
            display: block;
            margin-top: 5px;
            text-align: center;
            color: #0088cc;
            font-size: 12px;
        }
        .filtered-post {
            opacity: 0.4;
            position: relative;
        }
        .filtered-post::before {
            content: attr(data-filter-reason);
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(228, 87, 53, 0.8);
            color: white;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 12px;
            z-index: 10;
        }
        .filtered-post.hidden {
            display: none !important;
        }
        .confidence-high::before {
            background: rgba(228, 87, 53, 0.9);
        }
        .confidence-medium::before {
            background: rgba(255, 152, 0, 0.9);
        }
        .confidence-low::before {
            background: rgba(158, 158, 158, 0.9);
        }
        #filter-settings-panel {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 1001;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
        }
        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .settings-close {
            cursor: pointer;
            font-size: 20px;
        }
        .settings-group {
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .settings-group-title {
            font-weight: bold;
            margin-bottom: 8px;
        }
        .settings-threshold {
            margin-top: 15px;
        }
        .settings-threshold label {
            display: block;
            margin-bottom: 5px;
        }
        .settings-actions {
            margin-top: 15px;
            text-align: right;
        }
        .settings-actions button {
            padding: 5px 15px;
            margin-left: 10px;
            border-radius: 4px;
            border: 1px solid #ddd;
            background: #f5f5f5;
            cursor: pointer;
        }
        .settings-actions button.save {
            background: #0088cc;
            color: white;
            border-color: #0088cc;
        }
        #filter-debug {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            z-index: 1001;
            display: none;
        }
        #filter-stats {
            position: fixed;
            cursor: default;
        }
        #filter-stats h3 {
            cursor: grab;
            padding: 8px 12px; /* 增加点击区域 */
            margin: 0;
        }
        #filter-stats h3:active {
            cursor: grabbing;
        }
        /* 新增圆形按钮样式 */
        .filter-toggle-button {
            position: fixed;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgb(209.1, 239.7, 255);
            cursor: move;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: black;
            font-size: 14px;
            z-index: 9999;
            transition: transform 0.2s;
        }
        .filter-toggle-button:hover {
            transform: scale(1.1);
        }

        /* 调整统计面板为弹出式 */
        #filter-stats {
            display: none;
            position: fixed;
            min-width: 250px;
            z-index: 1001;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        #filter-stats.visible {
            display: block;
            animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
    `);
    // 修改最后三个属性的样式，因为使用 fixed 定位，故需要修改为 left/top ，方便计算位置


// 修改创建面板的函数
function createFilterStatsPanel() {
    // 创建圆形按钮
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'filter-toggle-button';
    toggleBtn.innerHTML = '滤';
    document.body.appendChild(toggleBtn);

    // 获取当前隐藏状态
    const hideFiltered = GM_getValue('hideFiltered', false);

    // 创建统计面板
    const panel = document.createElement('div');
    panel.id = 'filter-stats';
    // panel.innerHTML = `
    //     <h3>关键词过滤统计</h3>
    //     <div id="filter-groups"></div>
    //     <div class="filter-settings" id="open-settings">过滤设置</div>
    // `;
    panel.innerHTML = `
        <h3>关键词过滤统计</h3>
        <div id="filter-groups"></div>
        <div class="filter-toggle" id="toggle-filter">${hideFiltered ? '显示' : '隐藏'}已过滤帖子</div>
        <div class="filter-settings" id="open-settings">过滤设置</div>
    `;
    // 位置计算逻辑
    function calculatePosition(btnRect) {
        const panelWidth = 250;
        const panelHeight = 200;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 左下显示
        if (btnRect.left + panelWidth + 60 > viewportWidth - 20 && btnRect.top + panelHeight < viewportHeight - 20) {
            return {
                left: btnRect.left - panelWidth - 10,
                top: btnRect.top
            };
        }
        // 左上显示
        else if (btnRect.left + panelWidth + 60 > viewportWidth - 20 && btnRect.top + panelHeight > viewportHeight - 20) {
            return {
                left: btnRect.left - panelWidth - 10,
                top: btnRect.top - panelHeight - 10
            };
        }
        // 右上显示
        else if (btnRect.top + panelHeight > viewportHeight - 20 ) {
            return {
                left: btnRect.left + btnRect.width + 10,
                top: btnRect.top - panelHeight - 10
            };
        }
        // 其他情况右下显示
        else {
            return {
                left: btnRect.left + btnRect.width + 10,
                top: btnRect.top
            };
        }

    }

    // 点击按钮切换面板
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = panel.classList.contains('visible');
        
        if (!isVisible) {
            const btnRect = toggleBtn.getBoundingClientRect();
            const pos = calculatePosition(btnRect);
            
            panel.style.left = `${pos.left}px`;
            panel.style.top = `${pos.top}px`;
            panel.classList.add('visible');
        } else {
            panel.classList.remove('visible');
        }
    });

    // 点击外部区域关闭面板
    // document.addEventListener('click', function(e) {
    //     if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
    //         panel.classList.remove('visible');
    //     }
    // });

    // 保持原有拖动功能（修改为拖动按钮）
    let isDragging = false;
    let startX, startY, initialX, initialY;

    toggleBtn.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    // 恢复保存的位置
    const savedPosition = GM_getValue('buttonPosition', { x: '20px', y: '70px' });
    toggleBtn.style.left = savedPosition.x;
    toggleBtn.style.top = savedPosition.y;

    function startDrag(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = toggleBtn.offsetLeft;
        initialY = toggleBtn.offsetTop;
        toggleBtn.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const newX = Math.max(0, Math.min(window.innerWidth - toggleBtn.offsetWidth, initialX + dx));
        const newY = Math.max(0, Math.min(window.innerHeight - toggleBtn.offsetHeight, initialY + dy));

        toggleBtn.style.left = `${newX}px`;
        toggleBtn.style.top = `${newY}px`;
    }

    function stopDrag() {
        isDragging = false;
        toggleBtn.style.cursor = 'pointer';
        GM_setValue('buttonPosition', {
            x: toggleBtn.style.left,
            y: toggleBtn.style.top
        });
    }

    document.body.appendChild(panel);

    // 保持原有设置面板和过滤功能...

    // 添加切换过滤显示/隐藏的事件
    document.getElementById('toggle-filter').addEventListener('click', function() {
        const hideFiltered = !GM_getValue('hideFiltered', false);
        GM_setValue('hideFiltered', hideFiltered);

        // 更新按钮文本
        this.textContent = hideFiltered ? '显示已过滤帖子' : '隐藏已过滤帖子';

        // 应用隐藏/显示状态
        applyFilterVisibility();
    });

    // 添加设置面板打开事件
    document.getElementById('open-settings').addEventListener('click', function() {
        openSettingsPanel();
    });

    // 创建调试面板
    const debugPanel = document.createElement('div');
    debugPanel.id = 'filter-debug';
    document.body.appendChild(debugPanel);

}
    

// 应用过滤帖子的隐藏/显示状态
function applyFilterVisibility() {
    const hideFiltered = GM_getValue('hideFiltered', false);
    const filteredPosts = document.querySelectorAll('.filtered-post');

    filteredPosts.forEach(post => {
        if (hideFiltered) {
            post.classList.add('hidden');
        } else {
            post.classList.remove('hidden');
        }
    });
}

    // 创建设置面板
function createSettingsPanel() {
    // 如果已存在，则不重复创建
    if (document.getElementById('filter-settings-panel')) return document.getElementById('filter-settings-panel');

    const panel = document.createElement('div');
    panel.id = 'filter-settings-panel';

    let groupsHtml = '';
    for (const group in keywordGroups) {
        // 获取该组的启用状态
        const enabled = GM_getValue(`enable-${group}`, true);

        groupsHtml += `
            <div class="settings-group">
                <div class="settings-group-title">
                    <input type="checkbox" id="enable-${group}" ${enabled ? 'checked' : ''}>
                    <label for="enable-${group}">${group}</label>
                </div>
                <div class="group-rules" id="rules-${group}">
                    <div class="rule-count">${keywordGroups[group].length}条规则</div>
                    <button class="edit-rules" data-group="${group}">编辑规则</button>
                </div>
            </div>
        `;
    }

    panel.innerHTML = `
        <div class="settings-header">
            <h3>过滤设置</h3>
            <span class="settings-close" id="close-settings">×</span>
        </div>
        <div class="settings-tabs">
            <div class="tab active" data-tab="general">常规设置</div>
            <div class="tab" data-tab="groups">分组管理</div>
            <div class="tab" data-tab="advanced">高级设置</div>
        </div>
        <div class="tab-content" id="tab-general">
            <div class="settings-option">
                <label>
                    <input type="checkbox" id="auto-hide-filtered" ${GM_getValue('hideFiltered', false) ? 'checked' : ''}>
                    自动隐藏已过滤的帖子
                </label>
            </div>
            <div class="settings-length-threshold">
                <label for="filter-length-threshold">长度阈值 (0-100):</label>
                <input type="range" id="filter-length-threshold" min="0" max="100" value="${GM_getValue('filterLengthThreshold', 20)}" style="width: 100%">
                <div class="threshold-display">
                    <span id="length-threshold-value">${GM_getValue('filterLengthThreshold', 20)}</span>
                    <span class="threshold-description">
                        (只要帖子长度低于该值, 且置信度较低，就会被过滤)
                    </span>
                </div>
            </div>
            <div class="settings-threshold">
                <label for="confidence-threshold">置信度阈值 (0-100):</label>
                <input type="range" id="confidence-threshold" min="0" max="100" value="${GM_getValue('confidenceThreshold', 60)}" style="width: 100%">
                <div class="threshold-display">
                    <span id="threshold-value">${GM_getValue('confidenceThreshold', 60)}</span>
                    <span class="threshold-description">
                        (较低的值会过滤更多帖子，但可能误判；较高的值过滤更精确，但可能遗漏)
                    </span>
                </div>
            </div>
        </div>
        <div class="tab-content" id="tab-groups" style="display:none">
            ${groupsHtml}
            <div class="add-group">
                <button id="add-new-group">+ 添加新分组</button>
            </div>
        </div>
        <div class="tab-content" id="tab-advanced" style="display:none">
            <div class="settings-option">
                <label>
                    <input type="checkbox" id="enable-debug" ${GM_getValue('enableDebug', false) ? 'checked' : ''}>
                    启用调试模式
                </label>
            </div>
            <div class="settings-option">
                <label>
                    <input type="checkbox" id="highlight-only" ${GM_getValue('highlightOnly', false) ? 'checked' : ''}>
                    仅高亮不隐藏（覆盖自动隐藏设置）
                </label>
            </div>
            <div class="export-import">
                <button id="export-settings">导出设置</button>
                <button id="import-settings">导入设置</button>
            </div>
        </div>
        <div class="settings-actions">
            <button id="reset-settings">重置</button>
            <button id="save-settings" class="save">保存</button>
        </div>
    `;

    document.body.appendChild(panel);

    // 添加事件监听
    document.getElementById('close-settings').addEventListener('click', closeSettingsPanel);
    document.getElementById('filter-length-threshold').addEventListener('input', function() {
        document.getElementById('length-threshold-value').textContent = this.value;
    });
    document.getElementById('confidence-threshold').addEventListener('input', function() {
        document.getElementById('threshold-value').textContent = this.value;
    });
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('reset-settings').addEventListener('click', resetSettings);

    // 添加标签切换功能
    document.querySelectorAll('.settings-tabs .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的active类
            document.querySelectorAll('.settings-tabs .tab').forEach(t => t.classList.remove('active'));
            // 添加当前标签的active类
            this.classList.add('active');

            // 隐藏所有内容
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });

            // 显示当前标签对应的内容
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`tab-${tabId}`).style.display = 'block';
        });
    });

    // 添加编辑规则按钮事件
    document.querySelectorAll('.edit-rules').forEach(button => {
        button.addEventListener('click', function() {
            const group = this.getAttribute('data-group');
            openRuleEditor(group);
        });
    });

    // 添加新分组按钮事件
    document.getElementById('add-new-group').addEventListener('click', addNewGroup);

    // 添加导入导出功能
    document.getElementById('export-settings').addEventListener('click', exportSettings);
    document.getElementById('import-settings').addEventListener('click', importSettings);

    return panel;
}

// 打开规则编辑器
function openRuleEditor(group) {
    // 创建规则编辑器面板
    const editorPanel = document.createElement('div');
    editorPanel.id = 'rule-editor-panel';
    editorPanel.className = 'settings-panel';

    const rules = keywordGroups[group] || [];
    let rulesHtml = '';

    rules.forEach((rule, index) => {
        rulesHtml += createRuleHtml(rule, index);
    });

    editorPanel.innerHTML = `
        <div class="settings-header">
            <h3>编辑 "${group}" 规则</h3>
            <span class="settings-close" id="close-rule-editor">×</span>
        </div>
        <div class="rules-container" id="rules-container">
            ${rulesHtml}
        </div>
        <div class="rule-actions">
            <button id="add-rule">+ 添加规则</button>
        </div>
        <div class="settings-actions">
            <button id="cancel-rules">取消</button>
            <button id="save-rules" class="save">保存规则</button>
        </div>
    `;

    document.body.appendChild(editorPanel);

    // 添加事件监听
    document.getElementById('close-rule-editor').addEventListener('click', () => {
        document.body.removeChild(editorPanel);
    });

    document.getElementById('cancel-rules').addEventListener('click', () => {
        document.body.removeChild(editorPanel);
    });

    document.getElementById('add-rule').addEventListener('click', () => {
        const container = document.getElementById('rules-container');
        const newIndex = container.children.length;
        const newRuleHtml = createRuleHtml({words: []}, newIndex);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newRuleHtml;
        container.appendChild(tempDiv.firstElementChild);

        // 添加删除规则按钮事件
        document.querySelector(`.rule-item[data-index="${newIndex}"] .delete-rule`).addEventListener('click', function() {
            const ruleItem = this.closest('.rule-item');
            ruleItem.parentNode.removeChild(ruleItem);
        });
    });

    document.getElementById('save-rules').addEventListener('click', () => {
        saveRules(group);
        document.body.removeChild(editorPanel);
    });

    // 添加删除规则按钮事件
    document.querySelectorAll('.delete-rule').forEach(button => {
        button.addEventListener('click', function() {
            const ruleItem = this.closest('.rule-item');
            ruleItem.parentNode.removeChild(ruleItem);
        });
    });
}

// 创建规则HTML
function createRuleHtml(rule, index) {
    let ruleHtml = `
        <div class="rule-item" data-index="${index}">
            <div class="rule-header">
                <span class="rule-type">规则 #${index + 1}</span>
                <button class="delete-rule">删除</button>
            </div>
            <div class="rule-content">
    `;

    // 词组匹配
    if (rule.words) {
        const words = Array.isArray(rule.words) ? rule.words.join(', ') : '';
        const minCount = rule.minCount || 1;
        const maxLength = rule.maxLength || '';

        ruleHtml += `
            <div class="rule-option">
                <label>
                    <input type="radio" name="rule-type-${index}" value="words" checked>
                    词组匹配
                </label>
                <div class="rule-details">
                    <div class="rule-field">
                        <label>关键词(逗号分隔):</label>
                        <input type="text" class="rule-words" value="${words}">
                    </div>
                    <div class="rule-field">
                        <label>最小匹配数:</label>
                        <input type="number" class="rule-min-count" value="${minCount}" min="1">
                    </div>
                    <div class="rule-field">
                        <label>最大内容长度:</label>
                        <input type="number" class="rule-max-length" value="${maxLength}" placeholder="不限">
                    </div>
                </div>
            </div>
        `;

        // 上下文匹配
        if (rule.context) {
            const context = Array.isArray(rule.context) ? rule.context.join(', ') : '';

            ruleHtml += `
                <div class="rule-field">
                    <label>上下文词(逗号分隔):</label>
                    <input type="text" class="rule-context" value="${context}">
                </div>
            `;
        } else {
            ruleHtml += `
                <div class="rule-field">
                    <label>上下文词(逗号分隔):</label>
                    <input type="text" class="rule-context" placeholder="可选">
                </div>
            `;
        }
    }
    // 精确匹配
    else if (rule.exact) {
        ruleHtml += `
            <div class="rule-option">
                <label>
                    <input type="radio" name="rule-type-${index}" value="exact" checked>
                    精确匹配
                </label>
                <div class="rule-details">
                    <div class="rule-field">
                        <label>精确文本:</label>
                        <input type="text" class="rule-exact" value="${rule.exact}">
                    </div>
                </div>
            </div>
        `;
    }
    // 正则匹配
    else if (rule.regex) {
        const regexStr = rule.regex.toString();
        const regexPattern = regexStr.substring(1, regexStr.lastIndexOf('/'));
        const regexFlags = regexStr.substring(regexStr.lastIndexOf('/') + 1);

        ruleHtml += `
            <div class="rule-option">
                <label>
                    <input type="radio" name="rule-type-${index}" value="regex" checked>
                    正则匹配
                </label>
                <div class="rule-details">
                    <div class="rule-field">
                        <label>正则表达式:</label>
                        <input type="text" class="rule-regex-pattern" value="${regexPattern}">
                    </div>
                    <div class="rule-field">
                        <label>正则标志:</label>
                        <input type="text" class="rule-regex-flags" value="${regexFlags}" placeholder="i">
                    </div>
                </div>
            </div>
        `;
    }

    ruleHtml += `
            </div>
        </div>
    `;

    return ruleHtml;
}

// 保存规则
function saveRules(group) {
    const ruleItems = document.querySelectorAll('.rule-item');
    const newRules = [];

    ruleItems.forEach(item => {
        const index = item.getAttribute('data-index');
        const ruleType = item.querySelector(`input[name="rule-type-${index}"]:checked`).value;

        let rule = {};

        if (ruleType === 'words') {
            const wordsInput = item.querySelector('.rule-words').value;
            const words = wordsInput.split(',').map(word => word.trim()).filter(word => word);

            if (words.length > 0) {
                rule.words = words;

                const minCount = parseInt(item.querySelector('.rule-min-count').value);
                if (!isNaN(minCount) && minCount > 0) {
                    rule.minCount = minCount;
                }

                const maxLength = parseInt(item.querySelector('.rule-max-length').value);
                if (!isNaN(maxLength) && maxLength > 0) {
                    rule.maxLength = maxLength;
                }

                const contextInput = item.querySelector('.rule-context').value;
                if (contextInput) {
                    const context = contextInput.split(',').map(ctx => ctx.trim()).filter(ctx => ctx);
                    if (context.length > 0) {
                        rule.context = context;
                    }
                }

                newRules.push(rule);
            }
        } else if (ruleType === 'exact') {
            const exact = item.querySelector('.rule-exact').value.trim();
            if (exact) {
                rule.exact = exact;
                newRules.push(rule);
            }
        } else if (ruleType === 'regex') {
            const pattern = item.querySelector('.rule-regex-pattern').value.trim();
            const flags = item.querySelector('.rule-regex-flags').value.trim() || 'i';

            if (pattern) {
                try {
                    rule.regex = new RegExp(pattern, flags);
                    newRules.push(rule);
                } catch (e) {
                    alert(`正则表达式错误: ${e.message}`);
                }
            }
        }
    });

    // 更新关键词组
    keywordGroups[group] = newRules;
s
    // 更新规则计数显示
    const ruleCountElement = document.querySelector(`#rules-${group} .rule-count`);
    if (ruleCountElement) {
        ruleCountElement.textContent = `${newRules.length}条规则`;
    }

    // 重新应用过滤
    filterPosts();
}

// 添加新分组
function addNewGroup() {
    const groupName = prompt('请输入新分组名称:');
    if (groupName && groupName.trim()) {
        // 检查是否已存在
        if (keywordGroups[groupName]) {
            alert('该分组名称已存在!');
            return;
        }

        // 添加新分组
        keywordGroups[groupName] = [];
        GM_setValue(`enable-${groupName}`, true);

        // 重新创建设置面板
        const oldPanel = document.getElementById('filter-settings-panel');
        if (oldPanel) {
            document.body.removeChild(oldPanel);
        }

        const newPanel = createSettingsPanel();
        newPanel.style.display = 'block';

        // 切换到分组管理标签
        document.querySelector('.tab[data-tab="groups"]').click();
    }
}

// 导出设置
function exportSettings() {
    const settings = {
        keywordGroups: keywordGroups,
        filterLengthThreshold: GM_getValue('filterlengthThreshold', 20),
        confidenceThreshold: GM_getValue('confidenceThreshold', 60),
        hideFiltered: GM_getValue('hideFiltered', false),
        enableDebug: GM_getValue('enableDebug', false),
        highlightOnly: GM_getValue('highlightOnly', false)
    };

    // 为每个分组添加启用状态
    for (const group in keywordGroups) {
        settings[`enable-${group}`] = GM_getValue(`enable-${group}`, true);
    }

    const blob = new Blob([JSON.stringify(settings, (key, value) => {
        // 特殊处理正则表达式
        if (value instanceof RegExp) {
            return {
                __regex: true,
                source: value.source,
                flags: value.flags
            };
        }
        return value;
    }, 2)], {type: 'application/json'});

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'discourse-filter-settings.json';
    a.click();

    URL.revokeObjectURL(url);
}

// 导入设置
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const settings = JSON.parse(e.target.result, (key, value) => {
                    // 恢复正则表达式
                    if (value && value.__regex) {
                        return new RegExp(value.source, value.flags);
                    }
                    return value;
                });

                // 更新关键词组
                if (settings.keywordGroups) {
                    Object.assign(keywordGroups, settings.keywordGroups);
                }

                // 更新其他设置
                if (settings.filterLengthThreshold !== undefined) {
                    GM_setValue('filterLengthThreshold', settings.filterLengthThreshold);
                }
                if (settings.confidenceThreshold !== undefined) {
                    GM_setValue('confidenceThreshold', settings.confidenceThreshold);
                }

                if (settings.hideFiltered !== undefined) {
                    GM_setValue('hideFiltered', settings.hideFiltered);
                }

                if (settings.enableDebug !== undefined) {
                    GM_setValue('enableDebug', settings.enableDebug);
                }

                if (settings.highlightOnly !== undefined) {
                    GM_setValue('highlightOnly', settings.highlightOnly);
                }

                // 更新分组启用状态
                for (const group in keywordGroups) {
                    if (settings[`enable-${group}`] !== undefined) {
                        GM_setValue(`enable-${group}`, settings[`enable-${group}`]);
                    }
                }

                // 重新创建设置面板
                const oldPanel = document.getElementById('filter-settings-panel');
                if (oldPanel) {
                    document.body.removeChild(oldPanel);
                }

                const newPanel = createSettingsPanel();
                newPanel.style.display = 'block';

                // 重新应用过滤
                filterPosts();

                alert('设置导入成功!');
            } catch (error) {
                alert(`导入失败: ${error.message}`);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// 保存设置
function saveSettings() {
    const filterLengthThreshold = parseInt(document.getElementById('filter-length-threshold').value);
    GM_setValue('filterLengthThreshold', filterLengthThreshold);
    const confidenceThreshold = parseInt(document.getElementById('confidence-threshold').value);
    GM_setValue('confidenceThreshold', confidenceThreshold);

    // 保存分组启用状态
    for (const group in keywordGroups) {
        const checkbox = document.getElementById(`enable-${group}`);
        if (checkbox) GM_setValue(`enable-${group}`, checkbox.checked);
    }

    // 保存自动隐藏设置
    const autoHide = document.getElementById('auto-hide-filtered').checked;
    GM_setValue('hideFiltered', autoHide);

    // 保存调试模式设置
    const enableDebug = document.getElementById('enable-debug')?.checked || false;
    GM_setValue('enableDebug', enableDebug);

    // 保存仅高亮设置
    const highlightOnly = document.getElementById('highlight-only')?.checked || false;
    GM_setValue('highlightOnly', highlightOnly);

    // 更新过滤器面板上的切换按钮文本
    const toggleButton = document.getElementById('toggle-filter');
    if (toggleButton) {
        toggleButton.textContent = autoHide ? '显示已过滤帖子' : '隐藏已过滤帖子';
    }

    // 保存自定义规则
    GM_setValue("customKeywordGroups", serializeKeywordGroups(keywordGroups));

    closeSettingsPanel();
    filterPosts(); // 重新应用过滤
}

// 添加更多样式
GM_addStyle(`
    .settings-tabs {
        display: flex;
        border-bottom: 1px solid #ddd;
        margin-bottom: 15px;
    }
    .tab {
        padding: 8px 15px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
    }
    .tab.active {
        border-bottom: 2px solid #0088cc;
        font-weight: bold;
    }
    .rule-item {
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        background: #f9f9f9;
    }
    .rule-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .rule-type {
        font-weight: bold;
    }
    .delete-rule {
        background: #ff4d4d;
        color: white;
        border: none;
        border-radius: 3px;
        padding: 3px 8px;
        cursor: pointer;
    }
    .rule-field {
        margin-bottom: 8px;
    }
    .rule-field label {
        display: block;
        margin-bottom: 3px;
        font-size: 12px;
        color: #666;
    }
    .rule-field input {
        width: 100%;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 3px;
    }
    .rule-actions {
        margin: 15px 0;
    }
    #add-rule, #add-new-group {
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 3px;
        padding: 5px 10px;
        cursor: pointer;
    }
    .threshold-display {
        display: flex;
        align-items: center;
        margin-top: 5px;
    }
    #length-threshold-value {
        font-weight: bold;
        margin-right: 10px;
    }
    #threshold-value {
        font-weight: bold;
        margin-right: 10px;
    }
    .threshold-description {
        font-size: 12px;
        color: #666;
    }
    .export-import {
        margin-top: 15px;
    }
    .export-import button {
        margin-right: 10px;
        padding: 5px 10px;
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 3px;
        cursor: pointer;
    }
    #rule-editor-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1001;
        width: 500px;
        max-height: 80vh;
        overflow-y: auto;
    }
    .rules-container {
        max-height: 400px;
        overflow-y: auto;
        margin-bottom: 15px;
    }
    .group-rules {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
    }
    .rule-count {
        font-size: 12px;
        color: #666;
    }
    .edit-rules {
        background: #0088cc;
        color: white;
        border: none;
        border-radius: 3px;
        padding: 3px 8px;
        cursor: pointer;
        font-size: 12px;
    }
    .settings-option {
        margin-bottom: 15px;
    }
`);


    // 打开设置面板
    function openSettingsPanel() {
        const panel = document.getElementById('filter-settings-panel') || createSettingsPanel();
        panel.style.display = 'block';

        // 加载当前设置
        const filterLengthThreshold = GM_getValue('filterLengthThreshold', 20);
        document.getElementById('filter-length-threshold').value = filterLengthThreshold;
        document.getElementById('length-threshold-value').textContent = filterLengthThreshold;
        const confidenceThreshold = GM_getValue('confidenceThreshold', 60);
        document.getElementById('confidence-threshold').value = confidenceThreshold;
        document.getElementById('threshold-value').textContent = confidenceThreshold;

        for (const group in keywordGroups) {
            const enabled = GM_getValue(`enable-${group}`, true);
            const checkbox = document.getElementById(`enable-${group}`);
            if (checkbox) checkbox.checked = enabled;
        }
    }

    // 关闭设置面板
    function closeSettingsPanel() {
        const panel = document.getElementById('filter-settings-panel');
        if (panel) panel.style.display = 'none';
    }

    // 重置设置
    function resetSettings() {
        GM_setValue('filterLengthThreshold', 20);
        document.getElementById('filter-length-threshold').value = 20;
        document.getElementById('length-threshold-value').value = 20;
        GM_setValue('confidenceThreshold', 60);
        document.getElementById('confidence-threshold').value = 60;
        document.getElementById('threshold-value').textContent = 60;

        // 重新加载默认配置
        keywordGroups = deserializeKeywordGroups(GM_getValue("defaultKeywordGroups", DEFAULT_KEYWORD_GROUPS));

        for (const group in keywordGroups) {
            GM_setValue(`enable-${group}`, true);
            const checkbox = document.getElementById(`enable-${group}`);
            if (checkbox) checkbox.checked = true;
        }

        // 重新创建设置面板
        const oldPanel = document.getElementById('filter-settings-panel');
        if (oldPanel) {
            document.body.removeChild(oldPanel);
        }

        const newPanel = createSettingsPanel();
        newPanel.style.display = 'block';

        // 立即应用新规则
        filterPosts();
    }

    // 更新过滤统计
    function updateFilterStats(stats) {
        const container = document.getElementById('filter-groups');
        if (!container) return;

        container.innerHTML = '';

        for (const group in stats) {
            if (stats[group] > 0) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'filter-group';
                groupDiv.innerHTML = `
                    <span class="filter-name">${group}:</span>
                    <span class="filter-count">${stats[group]}</span>
                `;
                container.appendChild(groupDiv);
            }
        }

        // 添加总计
        const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
        if (total > 0) {
            const totalDiv = document.createElement('div');
            totalDiv.className = 'filter-group';
            totalDiv.innerHTML = `
                <span class="filter-name"><strong>总计:</strong></span>
                <span class="filter-count">${total}</span>
            `;
            container.appendChild(totalDiv);
        }
    }

    // 检查帖子是否包含关键词 - 改进的匹配逻辑
    function checkPostForKeywords(post) {
        const postContent = post.querySelector('.cooked')?.textContent || '';
        const postContentLower = postContent.toLowerCase();
        const stats = {};
        const confidenceThreshold = GM_getValue('confidenceThreshold', 60);
        const filterLengthThreshold = GM_getValue('filterLengthThreshold', 20);

        // 移除之前的过滤标记
        post.classList.remove('filtered-post', 'confidence-high', 'confidence-medium', 'confidence-low');
        post.removeAttribute('data-filter-reason');

        for (const group in keywordGroups) {
            // 检查该组是否启用
            if (!GM_getValue(`enable-${group}`, true)) {
                stats[group] = 0;
                continue;
            }

            stats[group] = 0;
            let maxConfidence = 0;
            let matchReason = '';

            // 遍历该组的所有匹配规则
            for (const rule of keywordGroups[group]) {
                let confidence = 0;
                let matched = false;

                // 1. 精确匹配
                if (rule.exact && postContentLower === (rule.exact.toLowerCase())) {
                    confidence = 95;
                    matched = true;
                    matchReason = `精确匹配: "${rule.exact}"`;
                }

                // 2. 正则匹配
                else if (rule.regex && rule.regex.test(postContent)) {
                    confidence = 90;
                    matched = true;
                    matchReason = `正则匹配: ${rule.regex.toString()}`;
                }

                // 3. 词组匹配
                else if (rule.words) {
                    // 计算匹配的词数
                    const matchedWords = rule.words.filter(word =>
                        postContentLower.includes(word.toLowerCase())
                    );

                    // 检查是否达到最小匹配数
                    const minCount = rule.minCount || 1;
                    if (matchedWords.length >= minCount) {
                        matched = true;

                        // 基础置信度: 匹配词数/总词数的比例
                        confidence = (matchedWords.length / rule.words.length) * 70;

                        // 上下文匹配加分
                        if (rule.context) {
                            const contextMatches = rule.context.filter(ctx =>
                                postContentLower.includes(ctx.toLowerCase())
                            );
                            if (contextMatches.length > 0) {
                                confidence += 20 * (contextMatches.length / rule.context.length);
                            } else {
                                confidence -= 30; // 没有上下文匹配则降低置信度
                            }
                        }

                        // 内容长度检查
                        if (rule.maxLength && postContent.length <= rule.maxLength) {
                            confidence += 10;
                        } else if (rule.maxLength) {
                            // 内容长度超过设定值时动态扣除置信度
                            const lengthRatio = postContent.length / rule.maxLength;
                            if (lengthRatio > 5) {
                                // 内容长度过长时，直接将置信度置为0
                                confidence = 0;
                            } else if (lengthRatio > 2) {
                                // 根据长度比例动态扣除置信度，长度越长扣除越多
                                confidence -= Math.min(50, 20 * (lengthRatio - 1));
                            }
                        }

                        matchReason = `匹配词: ${matchedWords.join(', ')}`;
                    }
                }

                // 更新最高置信度
                if (matched && confidence > maxConfidence) {
                    maxConfidence = confidence;
                    stats[group] = 1;
                }
            }

            // 修改，如果置信度超过阈值且长度低于阈值，标记为过滤
            if (maxConfidence >= confidenceThreshold && postContent.length < filterLengthThreshold) {
                post.classList.add('filtered-post');
                post.setAttribute('data-filter-reason', `${group} (${Math.round(maxConfidence)}%): ${matchReason}`);

                // 根据置信度添加不同的样式
                if (maxConfidence >= 85) {
                    post.classList.add('confidence-high');
                } else if (maxConfidence >= 70) {
                    post.classList.add('confidence-medium');
                } else {
                    post.classList.add('confidence-low');
                }

                break; // 一个帖子只归类到一个组
            }
        }

        return stats;
    }

    // 过滤帖子并统计
// 更新过滤帖子函数，支持新的设置
function filterPosts() {
    // 查找所有可能的帖子容器
    const postContainers = [
        ...document.querySelectorAll('.topic-post'),                // 帖子详情页
        ...document.querySelectorAll('.topic-list-item'),           // 帖子列表页
        ...document.querySelectorAll('[id^="ember"] .topic-post')   // SPA 动态加载的帖子
    ];

    const stats = {};

    // 初始化统计对象
    for (const group in keywordGroups) {
        stats[group] = 0;
    }

    // 调试信息
    const debugPanel = document.getElementById('filter-debug');
    const enableDebug = GM_getValue('enableDebug', false);

    if (debugPanel) {
        debugPanel.textContent = `找到 ${postContainers.length} 个帖子容器`;
        debugPanel.style.display = (postContainers.length > 0 && enableDebug) ? 'block' : 'none';

        // 5秒后隐藏调试信息
        if (enableDebug) {
            setTimeout(() => {
                debugPanel.style.display = 'none';
            }, 5000);
        }
    }

    postContainers.forEach(post => {
        const postStats = checkPostForKeywords(post);
        for (const group in postStats) {
            stats[group] += postStats[group];
        }
    });

    updateFilterStats(stats);

    // 应用当前的隐藏/显示状态
    applyFilterVisibility();
}

// 更新应用过滤可见性函数，支持仅高亮模式
function applyFilterVisibility() {
    const hideFiltered = GM_getValue('hideFiltered', false);
    const highlightOnly = GM_getValue('highlightOnly', false);
    const filteredPosts = document.querySelectorAll('.filtered-post');

    filteredPosts.forEach(post => {
        if (hideFiltered && !highlightOnly) {
            post.classList.add('hidden');
        } else {
            post.classList.remove('hidden');
        }
    });
}

    // 监听 URL 变化
    function observeUrlChanges() {
        let lastUrl = location.href;

        // 创建一个新的 MutationObserver 实例
        const observer = new MutationObserver(() => {
            if (lastUrl !== location.href) {
                lastUrl = location.href;
                console.log('URL changed to:', lastUrl);

                // 延迟执行，等待 SPA 内容加载
                setTimeout(() => {
                    filterPosts();
                    setupPostStreamObserver();
                }, 1000);
            }
        });

        // 开始观察 document.body 的变化
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 监听帖子流的变化
    function setupPostStreamObserver() {
        // 查找可能的帖子容器
        const postStreams = [
            document.querySelector('.post-stream'),
            document.querySelector('.topic-list'),
            ...document.querySelectorAll('[id^="ember"] .post-stream')
        ].filter(el => el !== null);

        if (postStreams.length === 0) return;

        // 为每个容器创建观察器
        postStreams.forEach(container => {
            const observer = new MutationObserver(mutations => {
                let shouldFilter = false;

                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1 && (
                                node.classList?.contains('topic-post') ||
                                node.classList?.contains('topic-list-item') ||
                                node.querySelector?.('.topic-post')
                            )) {
                                shouldFilter = true;
                            }
                        });
                    }
                });

                if (shouldFilter) {
                    filterPosts();
                }
            });

            observer.observe(container, {
                childList: true,
                subtree: true
            });
        });
    }

    // 监听 DOM 变化，处理 SPA 动态加载的内容
    function observeDomChanges() {
        const observer = new MutationObserver(mutations => {
            let newEmberContainers = false;
            let newPostsAdded = false;

            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            // 检查是否是 Ember 容器
                            if (node.id && node.id.startsWith('ember')) {
                                newEmberContainers = true;
                            }

                            // 检查是否包含帖子
                            if (node.classList?.contains('topic-post') ||
                                node.classList?.contains('topic-list-item') ||
                                node.querySelector?.('.topic-post, .topic-list-item')) {
                                newPostsAdded = true;
                            }
                        }
                    });
                }
            });

            if (newEmberContainers || newPostsAdded) {
                // 延迟执行，等待内容完全加载
                setTimeout(() => {
                    filterPosts();
                    setupPostStreamObserver();
                }, 500);
            }
        });

        // 观察 #main-outlet 和整个 body
        const mainOutlet = document.getElementById('main-outlet');
        if (mainOutlet) {
            observer.observe(mainOutlet, { childList: true, subtree: true });
        } else {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // 初始化
function init() {
    // 等待页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }

    function onReady() {
        // 初始化规则
        const savedData = GM_getValue('customKeywordGroups');
        if (savedData) {
            keywordGroups = deserializeKeywordGroups(savedData);
        }

        // 初始化设置
        if (GM_getValue('filterLengthThreshold') === undefined) {
            GM_setValue('filterLengthThreshold', 20);
        }
        if (GM_getValue('confidenceThreshold') === undefined) {
            GM_setValue('confidenceThreshold', 60);
            for (const group in keywordGroups) {
                GM_setValue(`enable-${group}`, true);
            }
        }

        // 初始化隐藏状态设置（如果未设置）
        if (GM_getValue('hideFiltered') === undefined) {
            GM_setValue('hideFiltered', false);
        }

        createFilterStatsPanel();

        // 初始过滤
        setTimeout(() => {
            filterPosts();
        }, 1000);

        // 设置各种观察器
        observeUrlChanges();
        setupPostStreamObserver();
        observeDomChanges();

        // 添加页面可见性变化监听
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // 页面重新变为可见时，重新过滤
                setTimeout(() => {
                    filterPosts();
                }, 500);
            }
        });
    // 恢复面板位置，by snowsoul
    const panel = document.getElementById('filter-stats');
    if (panel) {
        const savedPosition = GM_getValue('panelPosition', null);
        if (savedPosition) {
            panel.style.left = savedPosition.x;
            panel.style.top = savedPosition.y;
            panel.style.right = 'unset'; // 取消原有的right定位
        }
    }

    }
}

    init();
})();