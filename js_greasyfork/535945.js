// ==UserScript==
// @name         ParaTranz-AI
// @namespace    http://tampermonkey.net/
// @version      1.7.3
// @description  ParaTranz文本替换和AI翻译功能拓展。
// @author       HCPTangHY
// @license      WTFPL
// @match        https://paratranz.cn/*
// @icon         https://paratranz.cn/favicon.png
// @require      https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js
// @require      https://cdn.jsdelivr.net/npm/diff2html@3.4.51/bundles/js/diff2html-ui.min.js
// @resource     css https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535945/ParaTranz-AI.user.js
// @updateURL https://update.greasyfork.org/scripts/535945/ParaTranz-AI.meta.js
// ==/UserScript==

const PARATRANZ_AI_TAB_STYLES = `
/* 当 AI 标签激活时，隐藏原始面板 */
.sidebar-right.ai-tab-active .translation-memory,
.sidebar-right.ai-tab-active .tab.history,
.sidebar-right.ai-tab-active .terms-tab,
.sidebar-right.ai-tab-active .tab.comment-tab {
    display: none !important;
}
`;
GM_addStyle(PARATRANZ_AI_TAB_STYLES);

const PARATRANZ_AI_TOAST_STYLES = `
/* Toast Notifications */
#toast-container-paratranz-ai {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    pointer-events: none; /* Allow clicks to pass through the container */
}

.toast-message {
    padding: 10px 20px;
    margin-top: 10px;
    border-radius: 5px;
    color: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    min-width: 250px;
    max-width: 80vw;
    text-align: center;
    pointer-events: all; /* Individual toasts should be interactive if needed */
}

.toast-message.show {
    opacity: 1;
    transform: translateY(0);
}

.toast-message.toast-success { background-color: #28a745; }
.toast-message.toast-error   { background-color: #dc3545; }
.toast-message.toast-warning { background-color: #ffc107; color: black; }
.toast-message.toast-info    { background-color: #17a2b8; }
`;
GM_addStyle(GM_getResourceText("css") + PARATRANZ_AI_TOAST_STYLES);

// fork from HeliumOctahelide https://greasyfork.org/zh-CN/scripts/503063-paratranz-tools
(function() {
    'use strict';

    // --- ParaTranz-AI Force Sort Interceptor (Fetch Injector) ---
    function injectFetchInterceptor() {
        // 使用 ES5 语法重写注入代码以提高兼容性 (避免 const/let/async/模板字符串)
        var interceptorCode =
            "(function() {" +
            "    var ORIGINAL_FETCH = window.fetch;" +
            "    window.fetch = function(input, init) {" +
            "        var urlStr;" +
            "        if (typeof input === 'string') {" +
            "            urlStr = input;" +
            "        } else if (input instanceof URL) {" +
            "            urlStr = input.toString();" +
            "        } else if (input instanceof Request) {" +
            "            urlStr = input.url;" +
            "        }" +
            "        if (urlStr && urlStr.includes('/api/projects/') && urlStr.includes('/strings') && !urlStr.includes('/strings/')) {" +
            "            try {" +
            "                var urlObj = new URL(urlStr, window.location.origin);" +
            "                if (/\\/api\\/projects\\/\\d+\\/strings(?:$|\\?)/.test(urlObj.pathname)) {" +
            "                    var sortMethod = localStorage.getItem('paratranzForceSort');" +
            "                    if (sortMethod) {" +
            "                        urlObj.searchParams.set('orderBy', sortMethod);" +
            "                        if (input instanceof Request) {" +
            "                            var newRequestInit = {};" +
            "                            for (var p in init) newRequestInit[p] = init[p];" +
            "                            var keys = ['method', 'headers', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'integrity'];" +
            "                            for (var i = 0; i < keys.length; i++) {" +
            "                                var key = keys[i];" +
            "                                if (input[key] !== undefined && newRequestInit[key] === undefined) {" +
            "                                    newRequestInit[key] = input[key];" +
            "                                }" +
            "                            }" +
            "                            input = new Request(urlObj.toString(), newRequestInit);" +
            "                        } else {" +
            "                            input = urlObj.toString();" +
            "                        }" +
            "                    }" +
            "                }" +
            "            } catch (e) {" +
            "                console.warn('[ParaTranz-AI] Injected fetch interceptor failed:', e);" +
            "            }" +
            "        }" +
            "        return ORIGINAL_FETCH(input, init);" +
            "    };" +
            "})();";

        var scriptElement = document.createElement('script');
        scriptElement.textContent = interceptorCode;
        (document.head || document.documentElement).appendChild(scriptElement);
        if (scriptElement.parentNode) {
            scriptElement.parentNode.removeChild(scriptElement);
        }
    }

    // 在油猴脚本的主体中立即调用注入器
    injectFetchInterceptor();
    // -------------------------------------------

    // Helper function for Toast Notifications
    function showToast(message, type = 'info', duration = 3000) {
        let toastContainer = document.getElementById('toast-container-paratranz-ai');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container-paratranz-ai';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-dismiss
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                if (toast.parentElement) { // Check if still attached
                    toast.remove();
                }
                if (toastContainer && !toastContainer.hasChildNodes()) {
                    // Check if toastContainer is still in the DOM before removing
                    if (toastContainer.parentElement) {
                        toastContainer.remove();
                    }
                }
            }, { once: true });
        }, duration);
    }

    // 基类定义
    class BaseComponent {
        constructor(selector) {
            this.selector = selector;
            this.init();
        }

        init() {
            this.checkExistence();
        }

        checkExistence() {
            const element = document.querySelector(this.selector);
            if (!element) {
                this.insert();
            }
            setTimeout(() => this.checkExistence(), 1000);
        }

        insert() {
            // 留空，子类实现具体插入逻辑
        }
    }

    // 按钮类定义，继承自BaseComponent
    class Button extends BaseComponent {
        constructor(selector, toolbarSelector, htmlContent, callback, title = '') {
            super(selector);
            this.toolbarSelector = toolbarSelector;
            this.htmlContent = htmlContent;
            this.callback = callback;
            this.title = title;
        }

        insert() {
            const toolbar = document.querySelector(this.toolbarSelector);
            if (!toolbar) {
                console.log(`Toolbar not found: ${this.toolbarSelector}`);
                return;
            }
            if (toolbar && !document.querySelector(this.selector)) {
                const button = document.createElement('button');
                button.className = this.selector.split('.').join(' ');
                button.innerHTML = this.htmlContent;
                button.type = 'button';
                if (this.title) {
                    button.title = this.title;
                }
                button.addEventListener('click', this.callback);
                toolbar.insertAdjacentElement('afterbegin', button);
                console.log(`Button inserted: ${this.selector}`);
            }
        }
    }

    // --- 新增：AI 标签页管理器 ---
    class AITabManager extends BaseComponent {
        constructor(tabContainerSelector, tabContentSelector) {
            super(tabContainerSelector); // 监视 ul.nav
            this.tabContentSelector = tabContentSelector; // div.tabs
            this.tabs = [];
            this.delegateListenerAttached = false; // 事件委托标记
        }

        checkExistence() {
            // 重写 checkExistence：我们需要宿主容器存在时才插入
            const element = document.querySelector(this.selector);
            if (element) {
                this.insert();
            }
            setTimeout(() => this.checkExistence(), 1000);
        }

        addTab(id, title, contentHTML, initCallback) {
            this.tabs.push({ id, title, contentHTML, initCallback });
        }

        // 隐藏所有 AI 面板并移除 AI 标签的 active 状态，同时移除 sidebar 的 ai-tab-active 类
        hideAIPanels() {
            document.querySelectorAll('.ai-panel').forEach(p => { p.style.display = 'none'; });
            document.querySelectorAll('.ai-tab-link').forEach(l => l.classList.remove('active'));
            // 移除 sidebar 的激活类，让原始面板可以正常显示
            const sidebar = document.querySelector('.sidebar-right');
            if (sidebar) {
                sidebar.classList.remove('ai-tab-active');
            }
        }

        // 通过添加 CSS 类来隐藏原始面板（切换词条时 Vue 重新渲染后不会受影响）
        activateAIMode() {
            const sidebar = document.querySelector('.sidebar-right');
            if (sidebar) {
                sidebar.classList.add('ai-tab-active');
            }
        }

        // 设置事件委托监听器（不克隆替换原始标签，只监听点击）
        setupDelegateListener(tabContainer) {
            if (this.delegateListenerAttached) return;

            // 使用捕获阶段监听，以便在 Vue 事件之前处理
            tabContainer.addEventListener('click', (e) => {
                const link = e.target.closest('.nav-link');
                if (!link) return;

                // 如果点击的是原始标签（非 AI 标签）
                if (!link.classList.contains('ai-tab-link')) {
                    // 只需隐藏 AI 面板，让 Vue 正常处理原始标签的切换
                    this.hideAIPanels();
                }
            }, true); // 捕获阶段

            this.delegateListenerAttached = true;
        }

        // 处理 AI 标签点击
        handleAITabClick(e, navLink, panel) {
            e.preventDefault();
            e.stopPropagation();

            // 隐藏所有 AI 面板
            document.querySelectorAll('.ai-panel').forEach(p => { p.style.display = 'none'; });
            document.querySelectorAll('.ai-tab-link').forEach(l => l.classList.remove('active'));

            // 激活 AI 模式（通过 CSS 类隐藏原始面板）
            // 不移除原始标签的 active 类，以避免干扰 Vue 的状态管理
            this.activateAIMode();

            // 激活当前 AI 标签
            navLink.classList.add('active');
            if (panel) {
                panel.style.display = 'block';
            }
        }

        insert() {
            const tabContainer = document.querySelector(this.selector);
            const tabContentContainer = document.querySelector(this.tabContentSelector);
            if (!tabContainer || !tabContentContainer) {
                return; // 等待容器出现
            }

            // 检查 AI 标签是否已插入
            const aiTabExists = document.getElementById(`ai-tab-${this.tabs[0].id}`);

            // 如果 AI 标签不存在（首次加载或 Vue 重新渲染后），需要重置状态
            if (!aiTabExists) {
                // 移除 ai-tab-active 类，因为 AI 标签被移除了
                const sidebar = document.querySelector('.sidebar-right');
                if (sidebar) {
                    sidebar.classList.remove('ai-tab-active');
                }
                // 重置事件委托标记，以便重新绑定
                this.delegateListenerAttached = false;
            } else {
                // AI 标签已存在，无需重新插入
                return;
            }

            // 设置事件委托（在 sidebar-right 上，而不是 tabContainer 上，因为后者可能被 Vue 替换）
            this.setupDelegateListener(tabContainer);

            // 3. 插入 AI 标签页
            this.tabs.forEach((tab) => {
                // 创建标签页头 (li > a)
                const navItem = document.createElement('li');
                navItem.className = 'nav-item';
                const navLink = document.createElement('a');
                navLink.id = `ai-tab-${tab.id}`;
                navLink.className = 'nav-link ai-tab-link';
                navLink.href = `#ai-panel-${tab.id}`;
                navLink.textContent = tab.title;
                navLink.style.cursor = 'pointer';
                navItem.appendChild(navLink);
                tabContainer.appendChild(navItem);

                // 创建内容面板
                const panel = document.createElement('div');
                panel.id = `ai-panel-${tab.id}`;
                panel.className = 'tab ai-panel';
                panel.style.display = 'none'; // 默认隐藏
                panel.innerHTML = tab.contentHTML;
                tabContentContainer.appendChild(panel);

                // AI 标签点击事件
                navLink.addEventListener('click', (e) => this.handleAITabClick(e, navLink, panel));

                // 初始化面板逻辑
                if (tab.initCallback) {
                    requestAnimationFrame(() => {
                        setTimeout(() => tab.initCallback(), 0);
                    });
                }
            });
        }
    }

    // 定义具体的文本替换管理面板
    class StringReplacePanel {
        constructor() {
            this.contentHTML = `
                <div id="manageReplacePage">
                    <div id="replaceListContainer"></div>
                    <div class="replace-item mb-3 p-2" style="border: 1px solid #ccc; border-radius: 8px;">
                        <input type="text" placeholder="查找文本" id="newFindText" class="form-control mb-2"/>
                        <input type="text" placeholder="替换为" id="newReplacementText" class="form-control mb-2"/>
                        <button class="btn btn-secondary" id="addReplaceRuleButton">
                            <i class="far fa-plus-circle"></i> 添加替换规则
                        </button>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-primary" id="exportReplaceRulesButton">导出替换规则</button>
                        <input type="file" id="importReplaceRuleInput" class="d-none"/>
                        <button class="btn btn-primary" id="importReplaceRuleButton">导入替换规则</button>
                    </div>
                </div>
            `;
        }

        init() {
            document.getElementById('addReplaceRuleButton').addEventListener('click', this.addReplaceRule);
            document.getElementById('exportReplaceRulesButton').addEventListener('click', this.exportReplaceRules);
            document.getElementById('importReplaceRuleButton').addEventListener('click', () => {
                document.getElementById('importReplaceRuleInput').click();
            });
            document.getElementById('importReplaceRuleInput').addEventListener('change', this.importReplaceRules);
            this.loadReplaceList();
        }

        addReplaceRule = () => {
            const findText = document.getElementById('newFindText').value;
            const replacementText = document.getElementById('newReplacementText').value;

            if (findText) {
                const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
                replaceList.push({ findText, replacementText, disabled: false });
                localStorage.setItem('replaceList', JSON.stringify(replaceList));
                this.loadReplaceList();
                document.getElementById('newFindText').value = '';
                document.getElementById('newReplacementText').value = '';
            }
        };

        updateRuleText(index, type, value) {
            const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
            if (replaceList[index]) {
                if (type === 'findText') {
                    replaceList[index].findText = value;
                } else if (type === 'replacementText') {
                    replaceList[index].replacementText = value;
                }
                localStorage.setItem('replaceList', JSON.stringify(replaceList));
            }
        }

        loadReplaceList() {
            const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
            const replaceListDiv = document.getElementById('replaceListContainer');
            replaceListDiv.innerHTML = '';
            // Add scrollbar when rules are too many
            replaceListDiv.style.maxHeight = '40vh'; // Adjust as needed
            replaceListDiv.style.overflowY = 'auto';
            replaceList.forEach((rule, index) => {
                const ruleDiv = document.createElement('div');
                ruleDiv.className = 'replace-item mb-3 p-2';
                ruleDiv.style.border = '1px solid #ccc';
                ruleDiv.style.borderRadius = '8px';
                ruleDiv.style.transition = 'transform 0.3s';
                ruleDiv.style.backgroundColor = rule.disabled ? '#f2dede' : '#fff';

                const inputsDiv = document.createElement('div');
                inputsDiv.className = 'mb-2';

                const findInput = document.createElement('input');
                findInput.type = 'text';
                findInput.className = 'form-control mb-1';
                findInput.value = rule.findText;
                findInput.placeholder = '查找文本';
                findInput.dataset.index = index;
                findInput.addEventListener('change', (event) => this.updateRuleText(index, 'findText', event.target.value));
                inputsDiv.appendChild(findInput);

                const replInput = document.createElement('input');
                replInput.type = 'text';
                replInput.className = 'form-control';
                replInput.value = rule.replacementText;
                replInput.placeholder = '替换为';
                replInput.dataset.index = index;
                replInput.addEventListener('change', (event) => this.updateRuleText(index, 'replacementText', event.target.value));
                inputsDiv.appendChild(replInput);
                ruleDiv.appendChild(inputsDiv);

                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'd-flex justify-content-between';

                const leftButtonGroup = document.createElement('div');
                leftButtonGroup.className = 'btn-group';
                leftButtonGroup.setAttribute('role', 'group');

                const moveUpButton = this.createButton('上移', 'fas fa-arrow-up', () => this.moveReplaceRule(index, -1));
                const moveDownButton = this.createButton('下移', 'fas fa-arrow-down', () => this.moveReplaceRule(index, 1));
                const toggleButton = this.createButton('禁用/启用', rule.disabled ? 'fas fa-toggle-off' : 'fas fa-toggle-on', () => this.toggleReplaceRule(index));
                const applyButton = this.createButton('应用此规则', 'fas fa-play', () => this.applySingleReplaceRule(index));

                leftButtonGroup.append(moveUpButton, moveDownButton, toggleButton, applyButton);

                const rightButtonGroup = document.createElement('div');
                rightButtonGroup.className = 'btn-group';
                rightButtonGroup.setAttribute('role', 'group');

                const deleteButton = this.createButton('删除', 'far fa-trash-alt', () => this.deleteReplaceRule(index), 'btn-danger');
                rightButtonGroup.appendChild(deleteButton);

                buttonsDiv.append(leftButtonGroup, rightButtonGroup);
                ruleDiv.appendChild(buttonsDiv);
                replaceListDiv.appendChild(ruleDiv);
            });

            replaceListDiv.style.display = 'none';
            replaceListDiv.offsetHeight;
            replaceListDiv.style.display = '';
        }

        createButton(title, iconClass, onClick, btnClass = 'btn-secondary') {
            const button = document.createElement('button');
            button.className = `btn ${btnClass}`;
            button.title = title;
            button.innerHTML = `<i class="${iconClass}"></i>`;
            button.addEventListener('click', onClick);
            return button;
        }

        deleteReplaceRule(index) {
            const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
            replaceList.splice(index, 1);
            localStorage.setItem('replaceList', JSON.stringify(replaceList));
            this.loadReplaceList();
        }

        toggleReplaceRule(index) {
            const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
            replaceList[index].disabled = !replaceList[index].disabled;
            localStorage.setItem('replaceList', JSON.stringify(replaceList));
            this.loadReplaceList();
        }

        applySingleReplaceRule(index) {
            const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
            const rule = replaceList[index];
            if (rule.disabled || !rule.findText) return;

            const textareas = document.querySelectorAll('textarea.translation.form-control');
            textareas.forEach(textarea => {
                let text = textarea.value;
                text = text.replaceAll(rule.findText, rule.replacementText);
                this.simulateInputChange(textarea, text);
            });
        }

        moveReplaceRule(index, direction) {
            const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
            const newIndex = index + direction;
            if (newIndex >= 0 && newIndex < replaceList.length) {
                const [movedItem] = replaceList.splice(index, 1);
                replaceList.splice(newIndex, 0, movedItem);
                localStorage.setItem('replaceList', JSON.stringify(replaceList));
                this.loadReplaceListWithAnimation(index, newIndex);
            }
        }

        loadReplaceListWithAnimation(oldIndex, newIndex) {
            const replaceListDiv = document.getElementById('replaceListContainer');
            const items = replaceListDiv.querySelectorAll('.replace-item');
            if (items[oldIndex] && items[newIndex]) {
                items[oldIndex].style.transform = `translateY(${(newIndex - oldIndex) * 100}%)`;
                items[newIndex].style.transform = `translateY(${(oldIndex - newIndex) * 100}%)`;
            }

            setTimeout(() => {
                this.loadReplaceList();
            }, 300);
        }

        simulateInputChange(element, newValue) {
            const inputEvent = new Event('input', { bubbles: true });
            const originalValue = element.value;
            element.value = newValue;

            const tracker = element._valueTracker;
            if (tracker) {
                tracker.setValue(originalValue);
            }
            element.dispatchEvent(inputEvent);
        }

        exportReplaceRules() {
            const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
            const json = JSON.stringify(replaceList, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'replaceList.json';
            a.click();
            URL.revokeObjectURL(url);
        }

        importReplaceRules(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const content = e.target.result;
                    const importedList = JSON.parse(content);
                    if (Array.isArray(importedList) && importedList.every(item => typeof item.findText === 'string' && typeof item.replacementText === 'string')) {
                        localStorage.setItem('replaceList', JSON.stringify(importedList));
                        this.loadReplaceList();
                        showToast('替换规则导入成功！', 'success');
                    } else {
                        showToast('导入的文件格式不正确。', 'error');
                    }
                } catch (error) {
                    console.error('Error importing rules:', error);
                    showToast('导入失败，文件可能已损坏或格式不正确。', 'error');
                }
            };
            reader.readAsText(file);
            event.target.value = null;
        }
    }

    // 排序下拉菜单类
    class SortDropdown extends BaseComponent {
        constructor() {
            super('#paratranz-sort-dropdown');
            this.parentSelector = '.search-bar .input-group';
        }

        insert() {
            const inputGroup = document.querySelector(this.parentSelector);
            if (inputGroup && !document.querySelector(this.selector)) {
                const container = document.createElement('div');
                container.id = this.selector.substring(1);
                container.className = 'input-group-append';

                const button = document.createElement('button');
                button.className = 'btn btn-outline-secondary dropdown-toggle';
                button.type = 'button';
                button.id = 'sortDropdownMenuButton';
                // button.setAttribute('data-toggle', 'dropdown'); // 手动管理，不依赖 Bootstrap JS
                button.setAttribute('aria-haspopup', 'true');
                button.setAttribute('aria-expanded', 'false');
                button.title = "强制排序 (ParaTranz-AI)";
                button.innerHTML = '<i class="fas fa-sort-amount-down"></i> <span id="current-sort-label">默认</span>';

                const menu = document.createElement('div');
                menu.className = 'dropdown-menu dropdown-menu-right';
                menu.setAttribute('aria-labelledby', 'sortDropdownMenuButton');

                // 手动切换下拉菜单
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const willShow = !menu.classList.contains('show');
                    // 关闭其他可能打开的菜单
                    document.querySelectorAll('.dropdown-menu.show').forEach(m => {
                        if (m !== menu) m.classList.remove('show');
                    });
                    menu.classList.toggle('show', willShow);
                    button.setAttribute('aria-expanded', String(willShow));
                });

                // 点击外部关闭菜单
                document.addEventListener('click', (e) => {
                    if (menu.classList.contains('show') && !container.contains(e.target)) {
                        menu.classList.remove('show');
                        button.setAttribute('aria-expanded', 'false');
                    }
                });

                const options = [
                    { value: '', text: '默认' },
                    { value: 'id', text: 'ID' },
                    { value: 'key', text: '键值' },
                    { value: 'context', text: '上下文' }
                ];

                const currentSortValue = localStorage.getItem('paratranzForceSort') || '';

                options.forEach(opt => {
                    const item = document.createElement('a');
                    item.className = 'dropdown-item' + (opt.value === currentSortValue ? ' active' : '');
                    item.href = '#';
                    item.textContent = opt.text;
                    item.dataset.value = opt.value;

                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        const newVal = e.target.dataset.value;
                        const newText = e.target.textContent;

                        localStorage.setItem('paratranzForceSort', newVal);

                        menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                        e.target.classList.add('active');

                        button.querySelector('#current-sort-label').textContent = newText;

                        // 选择后关闭菜单
                        menu.classList.remove('show');
                        button.setAttribute('aria-expanded', 'false');

                        if (newVal) {
                            showToast('排序已强制为: ' + newText + '。请刷新页面或重新执行搜索以生效。', 'info', 3000);
                        } else {
                            showToast('已恢复默认排序。请刷新页面生效。', 'info', 3000);
                        }
                    });
                    menu.appendChild(item);
                });

                const initialOption = options.find(opt => opt.value === currentSortValue);
                if (initialOption) {
                    button.querySelector('#current-sort-label').textContent = initialOption.text;
                }

                container.appendChild(button);
                container.appendChild(menu);

                inputGroup.appendChild(container);
            }
        }
    }

    // 定义具体的机器翻译面板
    class MachineTranslationPanel {
        constructor() {
            this.contentHTML = `
                    <div class="d-flex mb-2">
                        <button class="btn btn-primary" id="openTranslationConfigButton">配置翻译</button>
                        <button class="btn btn-info ml-2" id="batchTranslateButton" title="获取并翻译所有当前页面词条">
                            <i class="fas fa-sync-alt"></i> 批量预翻译
                        </button>
                    </div>
                <div class="mt-3">
                    <div class="d-flex">
                        <textarea id="originalText" class="form-control" style="width: 100%; height: 25vh;"></textarea>
                        <div class="d-flex flex-column ml-2">
                            <button class="btn btn-secondary mb-2" id="copyOriginalButton">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn btn-secondary" id="translateButton">
                                <i class="fas fa-globe"></i>
                            </button>
                        </div>
                    </div>
                    <div class="d-flex mt-2">
                        <textarea id="translatedText" class="form-control" style="width: 100%; height: 25vh;"></textarea>
                        <div class="d-flex flex-column ml-2">
                            <button class="btn btn-secondary mb-2" id="pasteTranslationButton">
                                <i class="fas fa-arrow-alt-left"></i>
                            </button>
                            <button class="btn btn-secondary" id="copyTranslationButton">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Translation Configuration Modal -->
                <div class="modal" id="translationConfigModal" tabindex="-1" role="dialog" style="display: none;">
                    <div class="modal-dialog modal-lg" role="document"> <!-- Added modal-lg -->
                        <div class="modal-content">
                            <div class="modal-header py-2">
                                <h5 class="modal-title">翻译配置</h5>
                                <button type="button" class="close" id="closeTranslationConfigModal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body p-3" style="max-height: 80vh; overflow-y: auto;"> <!-- Increased max-height, added p-3 -->
                                <form id="translationConfigForm">
                                    <div class="form-row">
                                        <div class="form-group col-md-7">
                                            <label for="apiConfigSelect">API 配置</label>
                                            <select class="custom-select" id="apiConfigSelect">
                                                <option value="" selected>选择或新建配置...</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-5 d-flex align-items-end">
                                            <button type="button" class="btn btn-success mr-2 w-100" id="saveApiConfigButton" title="保存或更新当前填写的配置"><i class="fas fa-save"></i> 保存</button>
                                            <button type="button" class="btn btn-info mr-2 w-100" id="newApiConfigButton" title="清空表单以新建配置"><i class="fas fa-plus-circle"></i> 新建</button>
                                            <button type="button" class="btn btn-danger w-100" id="deleteApiConfigButton" title="删除下拉框中选中的配置"><i class="fas fa-trash-alt"></i> 删除</button>
                                        </div>
                                    </div>
                                    <hr>
                                    <p><strong>当前配置详情：</strong></p>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="apiConfigName">配置名称</label>
                                            <input type="text" class="form-control" id="apiConfigName" placeholder="为此配置命名 (例如 My OpenAI)">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="apiKey">API Key</label>
                                            <input type="text" class="form-control" id="apiKey" placeholder="Enter API key">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="baseUrl">Base URL</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="baseUrl" placeholder="Enter base URL">
                                            <div class="input-group-append">
                                                <button class="btn btn-outline-secondary" type="button" title="OpenAI API" id="openaiButton">
                                                    <img src="https://paratranz.cn/media/f2014e0647283fcff54e3a8f4edaa488.png!webp160" style="width: 16px; height: 16px;">
                                                </button>
                                                <button class="btn btn-outline-secondary" type="button" title="DeepSeek API" id="deepseekButton">
                                                    <img src="https://paratranz.cn/media/0bfd294f99b9141e3432c0ffbf3d8e78.png!webp160" style="width: 16px; height: 16px;">
                                                </button>
                                            </div>
                                        </div>
                                        <small id="fullUrlPreview" class="form-text text-muted mt-1" style="word-break: break-all;"></small>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-8">
                                            <label for="model">Model</label>
                                            <div class="input-group">
                                                <input type="text" class="form-control" id="model" placeholder="Enter model (e.g., gpt-4o-mini)">
                                                <div class="input-group-append">
                                                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="modelDropdownToggle" aria-haspopup="true" aria-expanded="false"></button>
                                                    <div class="dropdown-menu dropdown-menu-right" id="modelDropdownMenu" style="max-height: 300px; overflow-y: auto;">
                                                        <h6 class="dropdown-header">请先点击刷新按钮获取模型</h6>
                                                    </div>
                                                    <button class="btn btn-outline-secondary" type="button" id="fetchModelsButton" title="Fetch Models from API">
                                                        <i class="fas fa-sync-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="temperature">Temperature</label>
                                            <input type="number" step="0.1" class="form-control" id="temperature" placeholder="e.g., 0.7">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="prompt">Prompt</label>
                                        <textarea class="form-control" id="prompt" rows="3" placeholder="Enter prompt or use default prompt. 可用变量: {{original}}, {{context}}, {{terms}}"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="promptLibrarySelect">Prompt 库</label>
                                        <div class="input-group">
                                            <select class="custom-select" id="promptLibrarySelect">
                                                <option value="" selected>从库中选择或管理...</option>
                                            </select>
                                            <div class="input-group-append">
                                                <button class="btn btn-outline-secondary" type="button" id="saveToPromptLibraryButton" title="保存当前Prompt到库"><i class="fas fa-save"></i></button>
                                                <button class="btn btn-outline-danger" type="button" id="deleteFromPromptLibraryButton" title="从库中删除选定Prompt"><i class="fas fa-trash-alt"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>自动化选项</label>
                                        <div class="d-flex">
                                            <div class="custom-control custom-switch mr-3">
                                                <input type="checkbox" class="custom-control-input" id="autoTranslateToggle">
                                                <label class="custom-control-label" for="autoTranslateToggle">自动翻译</label>
                                            </div>
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input" id="autoPasteToggle">
                                                <label class="custom-control-label" for="autoPasteToggle">自动粘贴</label>
                                            </div>
                                        </div>
                                        <small class="form-text text-muted">自动翻译：进入新条目时自动翻译 / 自动粘贴：翻译完成后自动填充到翻译框</small>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" id="closeTranslationConfigModalButton">关闭</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        init() {
            const translationConfigModal = document.getElementById('translationConfigModal');
            document.getElementById('openTranslationConfigButton').addEventListener('click', function() {
                translationConfigModal.style.display = 'block';
            });

            function closeModal() {
                translationConfigModal.style.display = 'none';
            }

            document.getElementById('closeTranslationConfigModal').addEventListener('click', closeModal);
            document.getElementById('closeTranslationConfigModalButton').addEventListener('click', closeModal);

            const apiConfigSelect = document.getElementById('apiConfigSelect');
            const saveApiConfigButton = document.getElementById('saveApiConfigButton');
            const newApiConfigButton = document.getElementById('newApiConfigButton');
            const deleteApiConfigButton = document.getElementById('deleteApiConfigButton');
            const apiConfigNameInput = document.getElementById('apiConfigName');
            const baseUrlInput = document.getElementById('baseUrl');
            const apiKeyInput = document.getElementById('apiKey');
            const modelSelect = document.getElementById('model'); // This is now an input text field
            const modelDropdownToggle = document.getElementById('modelDropdownToggle');
            const modelDropdownMenu = document.getElementById('modelDropdownMenu');
            const fetchModelsButton = document.getElementById('fetchModelsButton');
            const promptInput = document.getElementById('prompt');
            const temperatureInput = document.getElementById('temperature');
            const autoTranslateToggle = document.getElementById('autoTranslateToggle');
            const autoPasteToggle = document.getElementById('autoPasteToggle');
            const promptLibrarySelect = document.getElementById('promptLibrarySelect');
            const saveToPromptLibraryButton = document.getElementById('saveToPromptLibraryButton');
            const deleteFromPromptLibraryButton = document.getElementById('deleteFromPromptLibraryButton');

            // API Config related functions are now defined in IIFE scope

            function updateActiveConfigField(fieldName, value) {
                const activeConfigName = getCurrentApiConfigName();
                if (activeConfigName) {
                    let configs = getApiConfigurations();
                    const activeConfigIndex = configs.findIndex(c => c.name === activeConfigName);
                    if (activeConfigIndex > -1) {
                        configs[activeConfigIndex][fieldName] = value;
                        saveApiConfigurations(configs);
                        // console.log(`Field '${fieldName}' for active config '${activeConfigName}' updated to '${value}' and saved.`);
                    }
                }
            }

            function updateFullUrlPreview(baseUrl) {
                const fullUrlPreview = document.getElementById('fullUrlPreview');
                if (baseUrl) {
                    const fullUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}chat/completions`;
                    fullUrlPreview.textContent = `完整URL: ${fullUrl}`;
                } else {
                    fullUrlPreview.textContent = '';
                }
            }

            function populateApiConfigSelect() {
                const configs = getApiConfigurations();
                const currentConfigName = getCurrentApiConfigName();
                apiConfigSelect.innerHTML = '<option value="">选择或新建配置...</option>'; // Changed placeholder
                configs.forEach(config => {
                    const option = document.createElement('option');
                    option.value = config.name;
                    option.textContent = config.name;
                    if (config.name === currentConfigName) {
                        option.selected = true;
                    }
                    apiConfigSelect.appendChild(option);
                });
            }

            function clearConfigForm() {
                apiConfigNameInput.value = '';
                baseUrlInput.value = '';
                apiKeyInput.value = '';
                // Optionally reset model, prompt, temp, toggles to defaults or leave them
                // modelSelect.value = 'gpt-4o-mini';
                // promptInput.value = '';
                // temperatureInput.value = '';
                // autoTranslateToggle.checked = false;
                // autoPasteToggle.checked = false;
                updateFullUrlPreview('');
                apiConfigSelect.value = ""; // Reset dropdown to placeholder
            }

            function loadConfigToUI(configName) {
                const configs = getApiConfigurations();
                const config = configs.find(c => c.name === configName);
                if (config) {
                    apiConfigNameInput.value = config.name;
                    baseUrlInput.value = config.baseUrl;
                    apiKeyInput.value = config.apiKey;
                    modelSelect.value = config.model || localStorage.getItem('model') || 'gpt-4o-mini';
                    promptInput.value = config.prompt || localStorage.getItem('prompt') || '';
                    temperatureInput.value = config.temperature || localStorage.getItem('temperature') || '';
                    autoTranslateToggle.checked = config.autoTranslateEnabled !== undefined ? config.autoTranslateEnabled : (localStorage.getItem('autoTranslateEnabled') === 'true');
                    autoPasteToggle.checked = config.autoPasteEnabled !== undefined ? config.autoPasteEnabled : (localStorage.getItem('autoPasteEnabled') === 'true');
                    setCurrentApiConfigName(config.name);
                    apiConfigSelect.value = config.name; // Ensure dropdown reflects loaded config
                } else {
                    clearConfigForm(); // Clear form if no specific config is loaded (e.g., "Select or create new")
                }
                updateFullUrlPreview(baseUrlInput.value);
            }

            // Initial load
            populateApiConfigSelect();
            const activeConfigName = getCurrentApiConfigName();
            if (activeConfigName) {
                loadConfigToUI(activeConfigName);
            } else {
                // Try to migrate old settings if no new config is active
                const oldBaseUrl = localStorage.getItem('baseUrl'); // Check for old individual settings
                const oldApiKey = localStorage.getItem('apiKey');
                if (oldBaseUrl && oldApiKey && !getApiConfigurations().length) { // Migrate only if no new configs exist
                    const defaultConfigName = "默认迁移配置";
                    const newConfig = {
                        name: defaultConfigName,
                        baseUrl: oldBaseUrl,
                        apiKey: oldApiKey,
                        model: localStorage.getItem('model') || 'gpt-4o-mini',
                        prompt: localStorage.getItem('prompt') || '',
                        temperature: localStorage.getItem('temperature') || '',
                        autoTranslateEnabled: localStorage.getItem('autoTranslateEnabled') === 'true',
                        autoPasteEnabled: localStorage.getItem('autoPasteEnabled') === 'true'
                    };
                    let configs = getApiConfigurations();
                    configs.push(newConfig);
                    saveApiConfigurations(configs);
                    setCurrentApiConfigName(defaultConfigName);
                    populateApiConfigSelect();
                    loadConfigToUI(defaultConfigName);
                    // Optionally remove old keys after successful migration
                    // localStorage.removeItem('baseUrl'); localStorage.removeItem('apiKey');
                } else {
                    // If no active config and no old settings to migrate, or if configs already exist, load general settings.
                    modelSelect.value = localStorage.getItem('model') || 'gpt-4o-mini';
                    promptInput.value = localStorage.getItem('prompt') || '';
                    temperatureInput.value = localStorage.getItem('temperature') || '';
                    autoTranslateToggle.checked = localStorage.getItem('autoTranslateEnabled') === 'true';
                    autoPasteToggle.checked = localStorage.getItem('autoPasteEnabled') === 'true';
                    clearConfigForm(); // Start with a clean slate for API specific parts if no config selected
                }
            }

            apiConfigSelect.addEventListener('change', function() {
                if (this.value) {
                    loadConfigToUI(this.value);
                } else {
                    clearConfigForm();
                    // User selected "Select or create new...", so we clear the form for a new entry.
                    // Do not clear currentApiConfigName here, as they might just be viewing.
                }
            });

            newApiConfigButton.addEventListener('click', function() {
                clearConfigForm();
                apiConfigNameInput.focus();
            });

            saveApiConfigButton.addEventListener('click', function() {
                const name = apiConfigNameInput.value.trim();
                const baseUrl = baseUrlInput.value.trim();
                const apiKey = apiKeyInput.value.trim();

                if (!name || !baseUrl || !apiKey) {
                    showToast('配置名称、Base URL 和 API Key 不能为空。', 'error');
                    return;
                }

                let configs = getApiConfigurations();
                const existingConfigIndex = configs.findIndex(c => c.name === name);

                const currentConfigData = {
                    name,
                    baseUrl,
                    apiKey,
                    model: modelSelect.value,
                    prompt: promptInput.value,
                    temperature: temperatureInput.value,
                    autoTranslateEnabled: autoTranslateToggle.checked,
                    autoPasteEnabled: autoPasteToggle.checked
                };

                if (existingConfigIndex > -1) {
                    configs[existingConfigIndex] = currentConfigData; // Update existing
                } else {
                    configs.push(currentConfigData); // Add new
                }
                saveApiConfigurations(configs);
                setCurrentApiConfigName(name); // Set this as the active config
                populateApiConfigSelect(); // Refresh dropdown
                apiConfigSelect.value = name; // Ensure the saved/updated config is selected
                showToast(`API 配置 "${name}" 已保存！`, 'success');
            });

            deleteApiConfigButton.addEventListener('click', function() {
                const selectedNameToDelete = apiConfigSelect.value; // The config selected in dropdown
                if (!selectedNameToDelete) {
                    showToast('请先从下拉列表中选择一个要删除的配置。', 'error');
                    return;
                }
                if (!confirm(`确定要删除配置 "${selectedNameToDelete}" 吗？`)) {
                    return;
                }

                let configs = getApiConfigurations();
                configs = configs.filter(c => c.name !== selectedNameToDelete);
                saveApiConfigurations(configs);

                // If the deleted config was the currently active one, clear the form and active status
                if (getCurrentApiConfigName() === selectedNameToDelete) {
                    setCurrentApiConfigName('');
                    clearConfigForm();
                }
                populateApiConfigSelect(); // Refresh dropdown
                showToast(`API 配置 "${selectedNameToDelete}" 已删除！`, 'success');
                 // If there are other configs, load the first one or leave blank
                if (getApiConfigurations().length > 0) {
                    const firstConfigName = getApiConfigurations()[0].name;
                    loadConfigToUI(firstConfigName);
                    apiConfigSelect.value = firstConfigName;
                } else {
                    clearConfigForm(); // No configs left, clear form
                }
            });

            // Event listeners for general (non-API-config specific) fields
            // Event listeners for general (non-API-config specific) fields
            // These save to general localStorage and also update the active API config if one is selected.
            baseUrlInput.addEventListener('input', () => {
                updateFullUrlPreview(baseUrlInput.value);
                // Base URL and API Key are core to a config, usually not changed outside explicit save.
            });
            // apiKeyInput does not have a live update to avoid frequent writes of sensitive data.

            document.getElementById('openaiButton').addEventListener('click', () => {
                baseUrlInput.value = 'https://api.openai.com/v1';
                updateFullUrlPreview(baseUrlInput.value);
            });
            document.getElementById('deepseekButton').addEventListener('click', () => {
                baseUrlInput.value = 'https://api.deepseek.com';
                updateFullUrlPreview(baseUrlInput.value);
            });

            fetchModelsButton.addEventListener('click', async () => {
                await this.fetchModelsAndUpdateDatalist();
            });

            // Dropdown Toggle Logic
            modelDropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShown = modelDropdownMenu.classList.contains('show');
                document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show')); // Close others
                if (!isShown) modelDropdownMenu.classList.add('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (modelDropdownMenu.classList.contains('show') && !modelDropdownMenu.contains(e.target) && e.target !== modelDropdownToggle) {
                    modelDropdownMenu.classList.remove('show');
                }
            });

            modelSelect.addEventListener('input', () => { // modelSelect is the input field
                localStorage.setItem('model', modelSelect.value);
                updateActiveConfigField('model', modelSelect.value);
            });
            promptInput.addEventListener('input', () => {
                localStorage.setItem('prompt', promptInput.value);
                updateActiveConfigField('prompt', promptInput.value);
            });
            temperatureInput.addEventListener('input', () => {
                const tempValue = temperatureInput.value;
                localStorage.setItem('temperature', tempValue);
                updateActiveConfigField('temperature', tempValue);
            });
            autoTranslateToggle.addEventListener('change', () => {
                localStorage.setItem('autoTranslateEnabled', autoTranslateToggle.checked);
                updateActiveConfigField('autoTranslateEnabled', autoTranslateToggle.checked);
            });
            autoPasteToggle.addEventListener('change', () => {
                localStorage.setItem('autoPasteEnabled', autoPasteToggle.checked);
                updateActiveConfigField('autoPasteEnabled', autoPasteToggle.checked);
            });

            const PROMPT_LIBRARY_KEY = 'promptLibrary';

            function getPromptLibrary() {
                return JSON.parse(localStorage.getItem(PROMPT_LIBRARY_KEY)) || [];
            }

            function savePromptLibrary(library) {
                localStorage.setItem(PROMPT_LIBRARY_KEY, JSON.stringify(library));
            }

            function populatePromptLibrarySelect() {
                const library = getPromptLibrary();
                promptLibrarySelect.innerHTML = '<option value="" selected>从库中选择或管理...</option>';
                library.forEach((promptText) => {
                    const option = document.createElement('option');
                    option.value = promptText;
                    option.textContent = promptText.substring(0, 50) + (promptText.length > 50 ? '...' : '');
                    option.dataset.fulltext = promptText;
                    promptLibrarySelect.appendChild(option);
                });
            }

            promptLibrarySelect.addEventListener('change', function() {
                if (this.value) {
                    promptInput.value = this.value;
                    localStorage.setItem('prompt', this.value); // Keep for fallback if no config selected
                    updateActiveConfigField('prompt', this.value);
                }
            });

            saveToPromptLibraryButton.addEventListener('click', function() {
                const currentPrompt = promptInput.value.trim();
                if (currentPrompt) {
                    let library = getPromptLibrary();
                    if (!library.includes(currentPrompt)) {
                        library.push(currentPrompt);
                        savePromptLibrary(library);
                        populatePromptLibrarySelect();
                        promptLibrarySelect.value = currentPrompt;
                        showToast('Prompt 已保存到库中。', 'success');
                    } else {
                        showToast('此 Prompt 已存在于库中。', 'warning');
                    }
                } else {
                    showToast('Prompt 内容不能为空。', 'error');
                }
            });

            deleteFromPromptLibraryButton.addEventListener('click', function() {
                const selectedPromptValue = promptLibrarySelect.value;
                if (selectedPromptValue) {
                    let library = getPromptLibrary();
                    const indexToRemove = library.indexOf(selectedPromptValue);
                    if (indexToRemove > -1) {
                        library.splice(indexToRemove, 1);
                        savePromptLibrary(library);
                        populatePromptLibrarySelect();
                        if (promptInput.value === selectedPromptValue) {
                            promptInput.value = '';
                            localStorage.setItem('prompt', '');
                        }
                        showToast('选定的 Prompt 已从库中删除。', 'success');
                    }
                } else {
                    showToast('请先从库中选择一个 Prompt 进行删除。', 'error');
                }
            });

            populatePromptLibrarySelect();

            // Sync promptLibrarySelect with the initial promptInput value
            const initialPromptValue = promptInput.value;
            if (initialPromptValue) {
                const library = getPromptLibrary();
                if (library.includes(initialPromptValue)) {
                    promptLibrarySelect.value = initialPromptValue;
                } else {
                    promptLibrarySelect.value = ""; // If not in library, keep placeholder
                }
            } else {
                 promptLibrarySelect.value = ""; // Default to placeholder if no initial prompt
            }
            // Removed duplicated listeners for temperature and autoTranslateToggle here,
            // as they are already defined above with updateActiveConfigField logic.

            this.setupTranslation();
            this.setupBatchTranslation();
        }

        async fetchModelsAndUpdateDatalist() {
            const modelDropdownMenu = document.getElementById('modelDropdownMenu');
            const modelSelect = document.getElementById('model');
            const fetchModelsButton = document.getElementById('fetchModelsButton');
            const originalButtonHtml = fetchModelsButton.innerHTML;
            fetchModelsButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            fetchModelsButton.disabled = true;

            let API_SECRET_KEY = '';
            let BASE_URL = '';

            const currentConfigName = getCurrentApiConfigName();
            let activeConfig = null;

            if (currentConfigName) {
                const configs = getApiConfigurations();
                activeConfig = configs.find(c => c.name === currentConfigName);
            }

            if (activeConfig) {
                BASE_URL = activeConfig.baseUrl;
                API_SECRET_KEY = activeConfig.apiKey;
            } else {
                // Fallback to general localStorage if no active config (less ideal)
                BASE_URL = localStorage.getItem('baseUrl');
                API_SECRET_KEY = localStorage.getItem('apiKey');
            }

            if (!BASE_URL || !API_SECRET_KEY) {
                showToast('请先配置并选择一个有效的 API 配置 (包含 Base URL 和 API Key)。', 'error', 5000);
                fetchModelsButton.innerHTML = originalButtonHtml;
                fetchModelsButton.disabled = false;
                return;
            }

            // Construct the models API URL (OpenAI standard is /models)
            const modelsUrl = `${BASE_URL}${BASE_URL.endsWith('/') ? '' : '/'}models`;

            try {
                const response = await fetch(modelsUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${API_SECRET_KEY}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    console.error('Error fetching models:', response.status, errorData);
                    showToast(`获取模型列表失败: ${response.status} - ${errorData.substring(0,100)}`, 'error', 5000);
                    return;
                }

                const data = await response.json();
                if (data && data.data && Array.isArray(data.data)) {
                    modelDropdownMenu.innerHTML = ''; // Clear existing options
                    data.data.forEach(model => {
                        if (model.id) {
                            const item = document.createElement('a');
                            item.className = 'dropdown-item';
                            item.href = '#';
                            item.textContent = model.id;
                            item.addEventListener('click', (e) => {
                                e.preventDefault();
                                modelSelect.value = model.id;
                                const event = new Event('input', { bubbles: true });
                                modelSelect.dispatchEvent(event);
                                modelDropdownMenu.classList.remove('show');
                            });
                            modelDropdownMenu.appendChild(item);
                        }
                    });
                    showToast('模型列表已更新。', 'success');
                } else {
                    console.warn('Unexpected models API response structure:', data);
                    showToast('获取模型列表成功，但响应数据格式不符合预期。', 'warning', 4000);
                }
            } catch (error) {
                console.error('Failed to fetch models:', error);
                showToast(`获取模型列表时发生网络错误: ${error.message}`, 'error', 5000);
            } finally {
                fetchModelsButton.innerHTML = originalButtonHtml;
                fetchModelsButton.disabled = false;
            }
        }


        setupTranslation() {

            // 将缓存和进行中的翻译提升为全局变量，以便批量翻译和常规翻译共享
            window.translationCache = window.translationCache || {};
            window.translationsInProgress = window.translationsInProgress || {};

            // 为了兼容性保留局部引用
            const translationCache = window.translationCache;
            const translationsInProgress = window.translationsInProgress;

            async function getCurrentStringId() {
                // 优先获取当前词条的ID
                const { stringId } = await getProjectIdAndStringId();
                return stringId;
            }

            function updateTranslationUI(text, modelName, cacheKeyForUI) {
                document.getElementById('translatedText').value = text;

                if (localStorage.getItem('autoPasteEnabled') === 'true') {
                    const targetTextarea = document.querySelector('textarea.translation.form-control');
                    // 修复：仅当翻译框为空时才自动粘贴
                    if (targetTextarea && targetTextarea.value.trim() === '') {
                        simulateInputChange(targetTextarea, text);
                    }
                }

                let translationMemoryDiv = document.querySelector('.translation-memory');
                let mtListContainer;

                if (!translationMemoryDiv) {
                    const tabs = document.querySelector('.sidebar-right .tabs');
                    if (!tabs) {
                        console.error('找不到.sidebar-right .tabs元素');
                        return;
                    }
                    translationMemoryDiv = document.createElement('div');
                    translationMemoryDiv.className = 'translation-memory';
                    translationMemoryDiv.style.display = 'block';
                    const header = document.createElement('header');
                    header.className = 'mb-3';
                    const headerContent = document.createElement('div');
                    headerContent.className = 'row medium align-items-center';
                    headerContent.innerHTML = `
                        <div class="col-auto">
                            <button title="Ctrl + Shift + F" type="button" class="btn btn-secondary btn-sm">
                                <i class="far fa-search"></i> 搜索历史翻译
                            </button>
                        </div>
                        <div class="col text-right">
                            <span class="text-muted">共 0 条建议</span>
                            <button type="button" class="btn btn-secondary btn-sm"><i class="far fa-cog fa-fw"></i></button>
                        </div>`;
                    header.appendChild(headerContent);
                    translationMemoryDiv.appendChild(header);
                    mtListContainer = document.createElement('div');
                    mtListContainer.className = 'list mt-list';
                    translationMemoryDiv.appendChild(mtListContainer);
                    tabs.insertBefore(translationMemoryDiv, tabs.firstChild);
                } else {
                    mtListContainer = translationMemoryDiv.querySelector('.list.mt-list');
                    if (!mtListContainer) {
                        mtListContainer = document.createElement('div');
                        mtListContainer.className = 'list mt-list';
                        const header = translationMemoryDiv.querySelector('header');
                        if (header) header.insertAdjacentElement('afterend', mtListContainer);
                        else translationMemoryDiv.appendChild(mtListContainer);
                    }
                }

                const existingAiReferences = mtListContainer.querySelectorAll('.mt-reference.paratranz-ai-reference');
                existingAiReferences.forEach(ref => ref.remove());

                if (mtListContainer) {
                    const newReferenceDiv = document.createElement('div');
                    newReferenceDiv.className = 'mt-reference paratranz-ai-reference';
                    newReferenceDiv.dataset.cacheKey = cacheKeyForUI;
                    const header = document.createElement('header');
                    header.className = 'medium mb-2 text-muted';
                    const icon = document.createElement('i');
                    icon.className = 'far fa-language';
                    header.appendChild(icon);
                    header.appendChild(document.createTextNode(' 机器翻译参考'));
                    newReferenceDiv.appendChild(header);
                    const bodyRow = document.createElement('div');
                    bodyRow.className = 'row align-items-center';
                    const colAuto = document.createElement('div');
                    colAuto.className = 'col-auto pr-0';
                    const copyButton = document.createElement('button');
                    copyButton.title = '复制当前文本至翻译框';
                    copyButton.type = 'button';
                    copyButton.className = 'btn btn-link';
                    const copyIcon = document.createElement('i');
                    copyIcon.className = 'far fa-clone';
                    copyButton.appendChild(copyIcon);
                    copyButton.addEventListener('click', function() {
                        simulateInputChange(document.querySelector('textarea.translation.form-control'), text);
                    });
                    colAuto.appendChild(copyButton);
                    bodyRow.appendChild(colAuto);
                    const colText = document.createElement('div');
                    colText.className = 'col';
                    const translationSpan = document.createElement('span');
                    translationSpan.className = 'translation notranslate';
                    translationSpan.textContent = text;
                    colText.appendChild(translationSpan);
                    bodyRow.appendChild(colText);
                    newReferenceDiv.appendChild(bodyRow);
                    const footer = document.createElement('footer');
                    footer.className = 'medium mt-2 text-muted';
                    const leftText = document.createElement('span');
                    leftText.textContent = 'Paratranz-AI';
                    const rightText = document.createElement('div');
                    rightText.className = 'float-right';
                    rightText.textContent = modelName || 'N/A';
                    footer.appendChild(leftText);
                    footer.appendChild(rightText);
                    newReferenceDiv.appendChild(footer);
                    mtListContainer.prepend(newReferenceDiv);
                }
            }

            async function processTranslationRequest(cacheKey, textToTranslate) {
                const translateButtonElement = document.getElementById('translateButton');

                if (!cacheKey) {
                    console.warn('processTranslationRequest called with no cache key.');
                    return;
                }
                if (window.translationsInProgress[cacheKey]) {
                    console.log(`Translation for cache key ${cacheKey} is already in progress. Ignoring new request.`);
                    return;
                }

                window.translationsInProgress[cacheKey] = true;
                if (translateButtonElement) translateButtonElement.disabled = true;

                document.getElementById('translatedText').value = '翻译中...';
                let translatedTextOutput = '';

                try {
                    console.log(`Processing translation for cache key ${cacheKey}:`, textToTranslate);
                    const model = localStorage.getItem('model') || 'gpt-4o-mini';
                    const promptStr = localStorage.getItem('prompt') || `You are a translator, you will translate all the message I send to you.\n\nSource Language: en\nTarget Language: zh-cn\n\nOutput result and thought with zh-cn, and keep the result pure text\nwithout any markdown syntax and any thought or references.\n\nInstructions:\n  - Accuracy: Ensure the translation accurately conveys the original meaning.\n  - Context: Adapt to cultural nuances and specific context to avoid misinterpretation.\n  - Tone: Match the tone (formal, informal, technical) of the source text.\n  - Grammar: Use correct grammar and sentence structure in the target language.\n  - Readability: Ensure the translation is clear and easy to understand.\n  - Keep Tags: Maintain the original tags intact, do not translate tags themselves!\n  - Keep or remove the spaces around the tags based on the language manners (in CJK, usually the spaces will be removed).\n\nTags are matching the following regular expressions (one per line):\n/{\w+}/\n/%[ds]?\d/\n/\\s#\d{1,2}/\n/<[^>]+?>/\n/%{\d}[a-z]/\n/@[a-zA-Z.]+?@/`;
                    const temperature = parseFloat(localStorage.getItem('temperature')) || 0;

                    translatedTextOutput = await translateText(textToTranslate, model, promptStr, temperature);

                    const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
                    replaceList.forEach(rule => {
                        if (!rule.disabled && rule.findText) {
                            translatedTextOutput = translatedTextOutput.replaceAll(rule.findText, rule.replacementText);
                        }
                    });

                    // 新增：去除思维链内容
                    translatedTextOutput = removeThoughtProcessContent(translatedTextOutput);

                    // 检查翻译是否成功，如果失败则不保存到缓存
                    const isTranslationError = translatedTextOutput.startsWith("API Base URL 或 Key 未配置。") ||
                                               translatedTextOutput.startsWith("API 翻译失败:") ||
                                               translatedTextOutput === "翻译失败: API响应格式无效" ||
                                               translatedTextOutput === "翻译请求超时。" ||
                                               translatedTextOutput.startsWith("翻译请求失败:");

                    if (!isTranslationError) {
                        window.translationCache[cacheKey] = translatedTextOutput;
                    }

                    const currentStringId = await getCurrentStringId();
                    const currentOriginalText = document.querySelector('.original.well')?.innerText || '';
                    const currentCacheKey = getCacheKey(currentStringId, currentOriginalText);
                    if (currentCacheKey === cacheKey) {
                        updateTranslationUI(translatedTextOutput, model, cacheKey);
                    } else {
                        console.log(`Translated cache key ${cacheKey}, but page is now ${currentCacheKey}. Reference UI not updated for ${cacheKey}.`);
                        document.getElementById('translatedText').value = translatedTextOutput;
                    }

                } catch (error) {
                    console.error(`Error during translation processing for cache key ${cacheKey}:`, error);
                    const translatedTextArea = document.getElementById('translatedText');
                    if (translatedTextArea) {
                        translatedTextArea.value = `翻译出错 (Cache Key: ${cacheKey}): ${error.message}`;
                    }
                } finally {
                    delete window.translationsInProgress[cacheKey];
                    if (translateButtonElement) translateButtonElement.disabled = false;
                    console.log(`Translation processing for cache key ${cacheKey} finished, flags reset.`);
                }
            }

            async function updateOriginalTextAndTranslateIfNeeded() {
                const currentStringId = await getCurrentStringId();
                const originalDiv = document.querySelector('.original.well');
                if (!originalDiv) {
                    return;
                }

                const originalText = originalDiv.innerText;
                document.getElementById('originalText').value = originalText;

                const cacheKey = getCacheKey(currentStringId, originalText);
                const existingAiReference = document.querySelector('.mt-reference.paratranz-ai-reference');

                if (window.translationCache[cacheKey]) {
                    console.log(`Using cached translation for cache key: ${cacheKey}`);
                    const model = localStorage.getItem('model') || 'gpt-4o-mini';
                    if (existingAiReference && existingAiReference.dataset.cacheKey !== cacheKey) {
                        existingAiReference.remove();
                    }
                    updateTranslationUI(window.translationCache[cacheKey], model, cacheKey);
                    return;
                } else {
                     if (existingAiReference) {
                        existingAiReference.remove();
                    }
                }

                // 检查是否有matching>=100的翻译建议
                if (currentStringId) {
                    const { projectId } = await getProjectIdAndStringId();
                    if (projectId) {
                        const suggestions = await getSuggestionsForString(projectId, currentStringId);
                        const perfectMatch = suggestions.find(s => s.matching >= 100);
                        if (perfectMatch && perfectMatch.translation) {
                            console.log(`Found perfect match (matching=${perfectMatch.matching}) for cache key: ${cacheKey}`);
                            const model = localStorage.getItem('model') || 'gpt-4o-mini';
                            window.translationCache[cacheKey] = perfectMatch.translation;
                            updateTranslationUI(perfectMatch.translation, model, cacheKey);
                            return;
                        }
                    }
                }

                if (localStorage.getItem('autoTranslateEnabled') === 'true' && originalText.trim() !== '' && !window.translationsInProgress[cacheKey]) {
                    console.log(`Auto-translating for cache key: ${cacheKey}`);
                    await processTranslationRequest(cacheKey, originalText);
                } else if (window.translationsInProgress[cacheKey]) {
                    console.log(`Translation already in progress for cache key: ${cacheKey} (checked in updateOriginalText)`);
                }
            }

            let debounceTimer = null;
            const observer = new MutationObserver(async () => {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(async () => {
                    console.log('Observer triggered, updating original text and checking translation.');
                    if (document.getElementById('diffModal')?.style.display === 'block') {
                        diffModal.closeModal();
                    }
                    await updateOriginalTextAndTranslateIfNeeded();
                }, 200);
            });

            const config = { childList: true, subtree: true, characterData: true };

            const tryObserveOriginal = () => {
                const originalDivTarget = document.querySelector('.original.well');
                if (originalDivTarget) {
                    observer.observe(originalDivTarget, config);
                    updateOriginalTextAndTranslateIfNeeded();
                    console.log("Observer attached to .original.well");
                } else {
                    // console.warn("Original text container (.original.well) not found, retrying...");
                    setTimeout(tryObserveOriginal, 1000);
                }
            };

            tryObserveOriginal();

            document.getElementById('copyOriginalButton').addEventListener('click', async () => {
                await updateOriginalTextAndTranslateIfNeeded();
            });

            document.getElementById('translateButton').addEventListener('click', async function() {
                const currentStringId = await getCurrentStringId();
                const originalText = document.getElementById('originalText').value;
                const cacheKey = getCacheKey(currentStringId, originalText);
                await processTranslationRequest(cacheKey, originalText);
            });

            document.getElementById('copyTranslationButton').addEventListener('click', function() {
                const translatedText = document.getElementById('translatedText').value;
                navigator.clipboard.writeText(translatedText).then(() => {
                    console.log('Translated text copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });

            document.getElementById('pasteTranslationButton').addEventListener('click', function() {
                const translatedText = document.getElementById('translatedText').value;
                simulateInputChange(document.querySelector('textarea.translation.form-control'), translatedText);
            });
        }

        setupBatchTranslation() {
            const batchTranslateButton = document.getElementById('batchTranslateButton');
            if (!batchTranslateButton) return;

            // 全局词条映射表
            let stringItemsMap = new Map();

            // 构建词条映射表的函数
            const buildStringItemsMap = () => {
                stringItemsMap.clear();
                try {
                    const stringsContainer = document.querySelector('.strings.container');
                    if (!stringsContainer || !stringsContainer.__vue__) {
                        console.warn('无法访问 Vue 实例，词条映射表构建失败');
                        return false;
                    }

                    const results = stringsContainer.__vue__.results;
                    if (!Array.isArray(results)) {
                        console.warn('Vue results 不是数组');
                        return false;
                    }

                    results.forEach(item => {
                        if (item.id) {
                            stringItemsMap.set(item.id, item);
                        }
                    });

                    console.log(`成功构建词条映射表，共 ${stringItemsMap.size} 个词条`);
                    return true;
                } catch (error) {
                    console.error('构建词条映射表时出错:', error);
                    return false;
                }
            };

            // 页面加载后构建映射表
            const initMapWithRetry = async (maxRetries = 5, delay = 500) => {
                for (let i = 0; i < maxRetries; i++) {
                    if (buildStringItemsMap()) {
                        return true;
                    }
                    console.log(`第 ${i + 1} 次尝试构建映射表失败，${delay}ms 后重试...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                return false;
            };

            // 初始化映射表
            initMapWithRetry();

            batchTranslateButton.addEventListener('click', async () => {
                // 重新构建映射表以获取最新数据
                if (!buildStringItemsMap()) {
                    showToast('无法获取词条列表，请确保页面已完全加载', 'error');
                    return;
                }

                if (stringItemsMap.size === 0) {
                    showToast('当前页面没有找到词条', 'warning');
                    return;
                }

                // 获取项目ID
                const { projectId } = await getProjectIdAndStringId();
                if (!projectId) {
                    showToast('无法获取项目ID', 'error');
                    return;
                }

                // 筛选出 stage 为 0 的词条（未翻译）
                const untranslatedItems = Array.from(stringItemsMap.values()).filter(item => item.stage === 0);

                if (untranslatedItems.length === 0) {
                    showToast('当前页面没有未翻译的词条', 'info');
                    return;
                }

                // 计算已缓存的数量
                const cachedCount = untranslatedItems.filter(item => {
                    const cacheKey = getCacheKey(item.id, item.original);
                    return window.translationCache[cacheKey];
                }).length;

                const needTranslationCount = untranslatedItems.length - cachedCount;

                if (needTranslationCount === 0) {
                    showToast(`所有 ${untranslatedItems.length} 个未翻译词条已存在缓存中`, 'info');
                    return;
                }

                // 显示确认对话框
                if (!confirm(`检测到 ${untranslatedItems.length} 个未翻译词条，其中 ${needTranslationCount} 个需要翻译，是否开始批量预翻译？`)) {
                    return;
                }

                // 禁用按钮并显示加载状态
                batchTranslateButton.disabled = true;
                const originalButtonHtml = batchTranslateButton.innerHTML;
                batchTranslateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 翻译中...';

                let completedCount = 0;
                let errorCount = 0;
                let skippedCount = 0;

                // 创建进度提示
                let progressToast = null;
                const updateProgress = (current, total) => {
                    if (progressToast) {
                        progressToast.remove();
                    }
                    progressToast = document.createElement('div');
                    progressToast.className = 'toast-message toast-info show';
                    progressToast.textContent = `批量翻译进度: ${current}/${total}`;
                    const toastContainer = document.getElementById('toast-container-paratranz-ai');
                    if (toastContainer) {
                        toastContainer.appendChild(progressToast);
                    }
                };

                // 处理单个翻译任务
                const processItem = async (item, taskStatus, index) => {
                    const taskInfo = taskStatus.get(index);
                    if (taskInfo.completed || taskInfo.inProgress) return;

                    taskInfo.inProgress = true;

                    try {
                        const cacheKey = getCacheKey(item.id, item.original);

                        // 检查缓存
                        if (window.translationCache[cacheKey]) {
                            skippedCount++;
                            taskInfo.completed = true;
                            taskInfo.inProgress = false;
                            return;
                        }

                        // 获取翻译建议
                        const suggestions = await getSuggestionsForString(projectId, item.id);

                        // 检查是否有matching>=100的完美匹配
                        const perfectMatch = suggestions.find(s => s.matching >= 100);
                        if (perfectMatch && perfectMatch.translation) {
                            console.log(`词条 ID ${item.id} 找到完美匹配 (matching=${perfectMatch.matching})，直接使用`);

                            // 应用替换规则
                            let finalText = perfectMatch.translation;
                            const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
                            replaceList.forEach(rule => {
                                if (!rule.disabled && rule.findText) {
                                    finalText = finalText.replaceAll(rule.findText, rule.replacementText);
                                }
                            });

                            // 去除思维链内容
                            finalText = removeThoughtProcessContent(finalText);

                            // 保存到缓存
                            window.translationCache[cacheKey] = finalText;
                            completedCount++;
                            taskInfo.success = true;
                            taskInfo.completed = true;
                            taskInfo.inProgress = false;
                            return;
                        }

                        // 构建消息数组
                        const model = localStorage.getItem('model') || 'gpt-4o-mini';
                        const promptStr = localStorage.getItem('prompt') || '';
                        const temperature = parseFloat(localStorage.getItem('temperature')) || 0;

                        // 使用 translateText 函数，它会自动处理 terms 和 suggestions
                        // 但我们需要临时设置当前字符串ID以便 translateText 能获取正确的 terms
                        const translatedText = await translateTextWithContext(
                            item.original,
                            model,
                            promptStr,
                            temperature,
                            item.terms || [],
                            suggestions
                        );

                        // 检查翻译结果
                        const isTranslationError = translatedText.startsWith("API Base URL 或 Key 未配置。") ||
                                                 translatedText.startsWith("API 翻译失败:") ||
                                                 translatedText === "翻译失败: API响应格式无效" ||
                                                 translatedText === "翻译请求超时。" ||
                                                 translatedText.startsWith("翻译请求失败:");

                        if (!isTranslationError) {
                            // 应用替换规则
                            let finalText = translatedText;
                            const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
                            replaceList.forEach(rule => {
                                if (!rule.disabled && rule.findText) {
                                    finalText = finalText.replaceAll(rule.findText, rule.replacementText);
                                }
                            });

                            // 去除思维链内容
                            finalText = removeThoughtProcessContent(finalText);

                            // 保存到缓存
                            window.translationCache[cacheKey] = finalText;
                            completedCount++;
                            taskInfo.success = true;

                            console.log(`词条 ID ${item.id} 翻译成功`);
                        } else {
                            errorCount++;
                            console.error(`词条 ID ${item.id} 翻译失败:`, translatedText);
                        }
                    } catch (error) {
                        errorCount++;
                        console.error(`词条 ID ${item.id} 翻译出错:`, error);
                    } finally {
                        await new Promise(resolve => setTimeout(resolve, 200));
                        taskInfo.completed = true;
                        taskInfo.inProgress = false;
                    }
                };

                // 并发处理
                const processQueue = async () => {
                    const itemsNeedTranslation = untranslatedItems.filter(item => {
                        const cacheKey = getCacheKey(item.id, item.original);
                        return !window.translationCache[cacheKey];
                    });

                    if (itemsNeedTranslation.length === 0) {
                        if (progressToast) progressToast.remove();
                        return;
                    }

                    const MAX_CONCURRENT = 5;
                    const taskStatus = new Map();
                    itemsNeedTranslation.forEach((item, index) => {
                        taskStatus.set(index, {
                            completed: false,
                            success: false,
                            inProgress: false
                        });
                    });

                    const updateProgressBar = () => {
                        const completed = Array.from(taskStatus.values()).filter(s => s.completed).length;
                        const total = itemsNeedTranslation.length;
                        const inProgress = Array.from(taskStatus.values()).filter(s => s.inProgress && !s.completed).length;

                        batchTranslateButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 翻译中 ${completed}/${total} (${inProgress}个进行中)`;
                        updateProgress(completed, total);
                    };

                    const runWithConcurrencyLimit = async () => {
                        const queue = [...itemsNeedTranslation.keys()];
                        const activePromises = new Map();

                        while (queue.length > 0 || activePromises.size > 0) {
                            while (activePromises.size < MAX_CONCURRENT && queue.length > 0) {
                                const index = queue.shift();
                                const item = itemsNeedTranslation[index];

                                const taskPromise = processItem(item, taskStatus, index).finally(() => {
                                    activePromises.delete(index);
                                    updateProgressBar();
                                });

                                activePromises.set(index, taskPromise);
                            }

                            if (activePromises.size > 0) {
                                await Promise.race(activePromises.values());
                            }
                        }
                    };

                    await runWithConcurrencyLimit();

                    if (progressToast) {
                        progressToast.remove();
                    }
                };

                try {
                    await processQueue();
                    showToast(`批量预翻译完成，${completedCount} 个成功，${skippedCount} 个已缓存，${errorCount} 个失败。`, 'success', 5000);
                } catch (error) {
                    showToast(`批量预翻译过程中发生错误: ${error.message}`, 'error', 5000);
                } finally {
                    batchTranslateButton.disabled = false;
                    batchTranslateButton.innerHTML = originalButtonHtml;
                }
            });
        }
    }

    // 辅助函数：生成缓存键
    function getCacheKey(stringId, originalText) {
        // 如果有ID，使用ID作为缓存键；否则使用原文
        return stringId || originalText;
    }

    // 辅助函数：获取项目ID和字符串ID
    async function getProjectIdAndStringId() {
        const pathParts = window.location.pathname.split('/');
        let projectId = null;
        let stringId = null;

        // 尝试从当前URL路径获取项目ID
        let projectPathIndex = pathParts.indexOf('projects');
        if (projectPathIndex !== -1 && pathParts.length > projectPathIndex + 1) {
            projectId = pathParts[projectPathIndex + 1];
        }

        // 尝试从当前URL路径获取字符串ID
        const stringsPathIndex = pathParts.indexOf('strings');
        if (stringsPathIndex !== -1 && pathParts.length > stringsPathIndex + 1) {
            const idFromPath = pathParts[stringsPathIndex + 1];
            if (idFromPath && !isNaN(parseInt(idFromPath, 10))) {
                stringId = idFromPath;
            }
        }

        // 如果未在路径中找到，或为了确认/覆盖，则回退到使用页面元素
        const copyLinkButton = document.querySelector('.string-editor a.float-right.no-select[href*="/strings?id="]');
        if (copyLinkButton) {
            const href = copyLinkButton.getAttribute('href');
            const url = new URL(href, window.location.origin); // 确保是完整URL以便解析
            const urlParams = new URLSearchParams(url.search);
            const idFromHref = urlParams.get('id');
            if (idFromHref && !isNaN(parseInt(idFromHref, 10))) {
                if (!stringId) stringId = idFromHref; // 如果路径中没有，则优先使用href中的ID

                const hrefPathParts = url.pathname.split('/');
                const projectIdxHref = hrefPathParts.indexOf('projects');
                if (projectIdxHref !== -1 && hrefPathParts.length > projectIdxHref + 1) {
                    const pidFromHref = hrefPathParts[projectIdxHref + 1];
                    if (pidFromHref) {
                        if (!projectId || projectId !== pidFromHref) projectId = pidFromHref; // 如果项目ID不同或未找到，则更新
                    }
                }
            }
        }

        if (!stringId) { // 如果仍然没有字符串ID，尝试设置链接
            const settingsLink = document.querySelector('.string-editor .tab.context-tab a[href*="/settings/strings?id="]');
            if (settingsLink) {
                const href = settingsLink.getAttribute('href');
                const url = new URL(href, window.location.origin);
                const urlParams = new URLSearchParams(url.search);
                const idFromHref = urlParams.get('id');
                if (idFromHref && !isNaN(parseInt(idFromHref, 10))) {
                    stringId = idFromHref;
                    const hrefPathParts = url.pathname.split('/');
                    const projectIdxHref = hrefPathParts.indexOf('projects');
                    if (projectIdxHref !== -1 && hrefPathParts.length > projectIdxHref + 1) {
                        const pidFromHref = hrefPathParts[projectIdxHref + 1];
                        if (pidFromHref && (!projectId || projectId !== pidFromHref)) {
                             projectId = pidFromHref;
                        }
                    }
                }
            }
        }

        // 确保projectId和stringId是字符串类型
        if (projectId && typeof projectId !== 'string') {
            projectId = String(projectId);
        }
        if (stringId && typeof stringId !== 'string') {
            stringId = String(stringId);
        }

        return { projectId, stringId: stringId && !isNaN(parseInt(stringId, 10)) ? stringId : null };
    }

    // 获取翻译建议的函数 (全局作用域)
    async function getSuggestionsForString(projectId, stringId) {
        if (!projectId || !stringId) return [];

        const apiUrl = `https://paratranz.cn/api/projects/${projectId}/strings/${stringId}/suggestions`;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(apiUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error(`获取建议失败 (ID: ${stringId}): ${response.status}`);
                return [];
            }

            const suggestions = await response.json();
            return Array.isArray(suggestions) ? suggestions : [];
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error(`获取建议超时 (ID: ${stringId})`);
            } else {
                console.error(`获取建议出错 (ID: ${stringId}):`, error);
            }
            return [];
        }
    }

    // 获取 Tags 数据 (通过 Vue 实例)
    function extractTagsFromText(originalText) {
        try {
            const stringsContainer = document.querySelector('.strings.container');
            if (stringsContainer && stringsContainer.__vue__ && typeof stringsContainer.__vue__.$extractTags === 'function') {
                const tags = stringsContainer.__vue__.$extractTags(originalText);
                if (Array.isArray(tags) && tags.length > 0) {
                    console.log(`从原文中提取到 ${tags.length} 个 tag:`, tags);
                    return tags;
                }
            }
        } catch (error) {
            console.warn('提取 tags 时出错:', error);
        }
        return [];
    }

    // 获取术语表数据 (异步)
    async function getTermsData() {
        const terms = [];
        const { projectId, stringId } = await getProjectIdAndStringId();

        if (!projectId) {
            console.warn('无法从 URL 或页面元素中解析项目 ID，跳过术语获取。');
            return terms;
        }
        if (!stringId) {
            console.warn('无法从 URL 或页面元素中解析有效的字符串 ID，跳过术语获取。');
            return terms;
        }

        const apiUrl = `https://paratranz.cn/api/projects/${projectId}/strings/${stringId}/terms`;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

            const response = await fetch(apiUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error(`获取术语 API 失败: ${response.status} ${response.statusText}`);
                return terms;
            }
            const apiResult = await response.json();
            apiResult.forEach(item => {
                if (item.term && item.translation) {
                    terms.push({
                        source: item.term,
                        target: item.translation,
                        note: item.note || ''
                    });
                }
            });
            // console.log(`通过 API 获取到 ${terms.length} 条术语。`);
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('获取术语 API 超时。');
            } else {
                console.error('调用术语 API 时发生错误:', error);
            }
        }
        return terms;
    }

    async function buildTermsSystemMessageWithRetry() {
        let terms = await getTermsData();
        if (!terms.length) {
            // console.log('第一次通过 API 获取术语表失败或为空，等待100ms后重试...');
            await new Promise(resolve => setTimeout(resolve, 100));
            terms = await getTermsData();
            if (!terms.length) {
                // console.log('第二次通过 API 获取术语表仍然失败或为空。');
                return null;
            }
            // console.log(`第二次尝试通过 API 获取到 ${terms.length} 条术语。`);
        } else {
            // console.log(`第一次尝试通过 API 获取到 ${terms.length} 条术语。`);
        }

        const termsContext = terms.map(term => {
            let termString = `${term.source} → ${term.target}`;
            if (term.note) {
                termString += ` (备注(辅助思考不要出现在译文中)：${term.note})`;
            }
            return termString;
        }).join('\n');

        return {
            role: "user",
            content: `翻译时请参考以下术语表:\n${termsContext}`
        };
    }

    // 新增：获取翻译建议上下文
    async function getTranslationSuggestionsContext() {
        const { projectId, stringId } = await getProjectIdAndStringId();
        const suggestionsContext = [];

        if (!projectId || !stringId) {
            // console.warn('无法获取翻译建议：项目 ID 或字符串 ID 未找到。');
            return suggestionsContext;
        }

        const apiUrl = `https://paratranz.cn/api/projects/${projectId}/strings/${stringId}/suggestions`;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

            const response = await fetch(apiUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error(`获取翻译建议 API 失败: ${response.status} ${response.statusText}`);
                return suggestionsContext;
            }
            const apiResult = await response.json();

            if (Array.isArray(apiResult)) {
                apiResult.forEach(suggestion => {
                    // 确保 original 和 translation 存在且不为空字符串
                    if (suggestion.original && suggestion.translation &&
                        typeof suggestion.matching === 'number' && suggestion.matching >= 0.7) {
                        suggestionsContext.push({ role: "user", content: suggestion.original });
                        suggestionsContext.push({ role: "assistant", content: suggestion.translation });
                    }
                });
            }
            // console.log(`获取到 ${suggestionsContext.length / 2} 条符合条件的翻译建议。`);
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('获取翻译建议 API 超时。');
            } else {
                console.error('调用翻译建议 API 时发生错误:', error);
            }
        }
        return suggestionsContext;
    }

    // 辅助函数：移除思考过程内容
    function removeThoughtProcessContent(text) {
        if (typeof text !== 'string') return text;
        // 移除XML风格的思考标签
        let cleanedText = text.replace(/<thought>[\s\S]*?<\/thought>/gi, '');
        cleanedText = cleanedText.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
        cleanedText = cleanedText.replace(/<think>[\s\S]*?<\/think>/gi, '');
        cleanedText = cleanedText.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '');
        // 移除Markdown风格的思考标签
        cleanedText = cleanedText.replace(/\[THOUGHT\][\s\S]*?\[\/THOUGHT\]/gi, '');
        cleanedText = cleanedText.replace(/\[REASONING\][\s\S]*?\[\/REASONING\]/gi, '');
        // 移除以特定关键词开头的思考过程
        cleanedText = cleanedText.replace(/^(思考过程：|思考：|Thought process:|Thought:|Thinking:|Reasoning:)[\s\S]*?(\n|$)/gim, '');
        // 移除常见的工具交互XML标签
        cleanedText = cleanedText.replace(/<tool_code>[\s\S]*?<\/tool_code>/gi, '');
        cleanedText = cleanedText.replace(/<tool_code_executing>[\s\S]*?<\/tool_code_executing>/gi, '');
        cleanedText = cleanedText.replace(/<tool_code_completed>[\s\S]*?<\/tool_code_completed>/gi, '');
        cleanedText = cleanedText.replace(/<tool_code_error>[\s\S]*?<\/tool_code_error>/gi, '');
        cleanedText = cleanedText.replace(/<tool_code_output>[\s\S]*?<\/tool_code_output>/gi, '');
        cleanedText = cleanedText.replace(/<tool_code_execution_succeeded>[\s\S]*?<\/tool_code_execution_succeeded>/gi, '');
        cleanedText = cleanedText.replace(/<tool_code_execution_failed>[\s\S]*?<\/tool_code_execution_failed>/gi, '');
        // 移除 SEARCH/REPLACE 块标记
        cleanedText = cleanedText.replace(/<<<<<<< SEARCH[\s\S]*?>>>>>>> REPLACE/gi, '');

        // 清理多余的空行，并将多个连续空行合并为一个
        cleanedText = cleanedText.replace(/\n\s*\n/g, '\n');
        // 移除首尾空白字符 (包括换行符)
        cleanedText = cleanedText.trim();

        return cleanedText;
    }

    class PromptTagProcessor {
        constructor() {
            this.tagProcessors = new Map();
            this.setupDefaultTags();
        }

        setupDefaultTags() {
            this.registerTag('original', (text) => text);
            this.registerTag('context', async () => {
                const contextDiv = document.querySelector('.context .well');
                if (!contextDiv) return '';
                return contextDiv.innerText.trim();
            });
            this.registerTag('terms', async () => {
                const terms = await getTermsData();
                if (!terms.length) return '';
                return terms.map(term => {
                    let termString = `${term.source} → ${term.target}`;
                    if (term.note) termString += ` (${term.note})`;
                    return termString;
                }).join('\n');
            });
        }

        registerTag(tagName, processor) {
            this.tagProcessors.set(tagName, processor);
        }

        async processPrompt(prompt, originalText) {
            let processedPrompt = prompt;
            for (const [tagName, processor] of this.tagProcessors) {
                const tagPattern = new RegExp(`{{${tagName}}}`, 'g');
                if (tagPattern.test(processedPrompt)) {
                    let replacement;
                    try {
                        replacement = (tagName === 'original') ? originalText : await processor();
                        processedPrompt = processedPrompt.replace(tagPattern, replacement || '');
                        // console.log(`替换标签 {{${tagName}}} 成功`);
                    } catch (error) {
                        console.error(`处理标签 {{${tagName}}} 时出错:`, error);
                    }
                }
            }
            // console.log('处理后的prompt:', processedPrompt);
            return processedPrompt;
        }
    }
    // Define API config utility functions in IIFE scope
    const API_CONFIGURATIONS_KEY = 'apiConfigurations';
    const CURRENT_API_CONFIG_NAME_KEY = 'currentApiConfigName';

    function getApiConfigurations() {
        return JSON.parse(localStorage.getItem(API_CONFIGURATIONS_KEY)) || [];
    }

    function saveApiConfigurations(configs) {
        localStorage.setItem(API_CONFIGURATIONS_KEY, JSON.stringify(configs));
    }

    function getCurrentApiConfigName() {
        return localStorage.getItem(CURRENT_API_CONFIG_NAME_KEY);
    }

    function setCurrentApiConfigName(name) {
        localStorage.setItem(CURRENT_API_CONFIG_NAME_KEY, name);
    }

    async function translateText(query, model, prompt, temperature) {
        let API_SECRET_KEY = '';
        let BASE_URL = '';

        const currentConfigName = getCurrentApiConfigName();
        let activeConfig = null;

        if (currentConfigName) {
            const configs = getApiConfigurations();
            activeConfig = configs.find(c => c.name === currentConfigName);
        }

        if (activeConfig) {
            BASE_URL = activeConfig.baseUrl;
            API_SECRET_KEY = activeConfig.apiKey;
            model = activeConfig.model || localStorage.getItem('model') || 'gpt-4o-mini'; // Fallback to general localStorage then default
            prompt = activeConfig.prompt || localStorage.getItem('prompt') || '';
            temperature = activeConfig.temperature !== undefined && activeConfig.temperature !== '' ? parseFloat(activeConfig.temperature) : (localStorage.getItem('temperature') !== null ? parseFloat(localStorage.getItem('temperature')) : 0);
        } else {
            // If no active config, try to use general localStorage settings as a last resort for key/URL
            // This case should ideally be handled by prompting user to select/create a config
            console.warn("No active API configuration selected. Translation might fail or use stale settings.");
            BASE_URL = localStorage.getItem('baseUrl_fallback_for_translate') || ''; // Example of a dedicated fallback key
            API_SECRET_KEY = localStorage.getItem('apiKey_fallback_for_translate') || '';
            // For other params, use general localStorage or defaults
            model = localStorage.getItem('model') || 'gpt-4o-mini';
            prompt = localStorage.getItem('prompt') || '';
            temperature = localStorage.getItem('temperature') !== null ? parseFloat(localStorage.getItem('temperature')) : 0;
        }

        if (!BASE_URL || !API_SECRET_KEY) {
            console.error("API Base URL or Key is missing. Please configure an API setting.");
            return "API Base URL 或 Key 未配置。请在翻译配置中设置。";
        }

        if (!prompt) { // Default prompt if still empty after all fallbacks
            prompt = "You are a professional translator focusing on translating Magic: The Gathering cards from English to Chinese. You are given a card's original text in English. Translate it into Chinese.";
        }

        const tagProcessor = new PromptTagProcessor();
        const processedPrompt = await tagProcessor.processPrompt(prompt, query);

        const messages = [{ role: "system", content: processedPrompt }];
        // 新增：提取并添加 Tags 信息
        const tags = extractTagsFromText(query);
        if (tags && tags.length > 0) {
            const tagsContext = tags.join(',\n ');
            messages.push({
                role: "user",
                content: `原文中包含以下Tags，不要翻译或修改它们:
                \`\`\`\n[\n${tagsContext}\n]\n\`\`\``
            });
        }


        // console.log('准备获取术语表信息...');
        const termsMessage = await buildTermsSystemMessageWithRetry(); // 间接使用 getProjectIdAndStringId
        if (termsMessage && termsMessage.content) {
            // console.log('成功获取术语表信息，添加到请求中。');
            messages.push(termsMessage);
        } else {
            // console.log('未获取到术语表信息或术语表为空，翻译请求将不包含术语表。');
        }

        // 新增：获取并添加翻译建议上下文
        // console.log('准备获取翻译建议上下文...');
        const suggestionContextMessages = await getTranslationSuggestionsContext(); // 直接使用 getProjectIdAndStringId
        if (suggestionContextMessages && suggestionContextMessages.length > 0) {
            // console.log(`成功获取 ${suggestionContextMessages.length / 2} 条翻译建议，添加到请求中。`);
            messages.push(...suggestionContextMessages);
        } else {
            // console.log('未获取到符合条件的翻译建议，或获取失败。');
        }

        messages.push({ role: "user", content: query });

        const requestBody = { model, temperature, messages };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 250000); // 25秒超时

            const response = await fetch(`${BASE_URL}${BASE_URL.endsWith('/') ? '' : '/'}chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET_KEY}` },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorData;
                try { errorData = await response.json(); } catch (e) { /* ignore */ }
                console.error('API Error:', errorData || response.statusText);
                return `API 翻译失败: ${response.status} - ${errorData?.error?.message || errorData?.message || response.statusText}`;
            }

            const data = await response.json();
            if (data.choices && data.choices[0]?.message?.content) {
                return data.choices[0].message.content;
            } else {
                console.error('Invalid API response structure:', data);
                return '翻译失败: API响应格式无效';
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('API translation request timed out.');
                return '翻译请求超时。';
            }
            console.error('Translation Fetch/Network Error:', error);
            return `翻译请求失败: ${error.message || error.toString()}`;
        }
    }

    // 带上下文的翻译函数，用于批量翻译
    async function translateTextWithContext(query, model, prompt, temperature, terms = [], suggestions = []) {
        let API_SECRET_KEY = '';
        let BASE_URL = '';

        const currentConfigName = getCurrentApiConfigName();
        let activeConfig = null;

        if (currentConfigName) {
            const configs = getApiConfigurations();
            activeConfig = configs.find(c => c.name === currentConfigName);
        }

        if (activeConfig) {
            BASE_URL = activeConfig.baseUrl;
            API_SECRET_KEY = activeConfig.apiKey;
            model = activeConfig.model || localStorage.getItem('model') || 'gpt-4o-mini';
            prompt = activeConfig.prompt || localStorage.getItem('prompt') || '';
            temperature = activeConfig.temperature !== undefined && activeConfig.temperature !== '' ? parseFloat(activeConfig.temperature) : (localStorage.getItem('temperature') !== null ? parseFloat(localStorage.getItem('temperature')) : 0);
        } else {
            console.warn("No active API configuration selected. Translation might fail or use stale settings.");
            BASE_URL = localStorage.getItem('baseUrl_fallback_for_translate') || '';
            API_SECRET_KEY = localStorage.getItem('apiKey_fallback_for_translate') || '';
            model = localStorage.getItem('model') || 'gpt-4o-mini';
            prompt = localStorage.getItem('prompt') || '';
            temperature = localStorage.getItem('temperature') !== null ? parseFloat(localStorage.getItem('temperature')) : 0;
        }

        if (!BASE_URL || !API_SECRET_KEY) {
            console.error("API Base URL or Key is missing. Please configure an API setting.");
            return "API Base URL 或 Key 未配置。请在翻译配置中设置。";
        }

        if (!prompt) {
            prompt = "You are a professional translator focusing on translating Magic: The Gathering cards from English to Chinese. You are given a card's original text in English. Translate it into Chinese.";
        }

        const tagProcessor = new PromptTagProcessor();
        const processedPrompt = await tagProcessor.processPrompt(prompt, query);

        const messages = [{ role: "system", content: processedPrompt }];

        // 添加术语表（如果提供）
        if (terms && terms.length > 0) {
            const termsContext = terms.map(term => {
                let termString = `${term.source || term.term} → ${term.target || term.translation}`;
                if (term.note) {
                    termString += ` (备注(辅助思考不要出现在译文中)：${term.note})`;
                }
                return termString;
            }).join('\n');

            messages.push({
                role: "user",
                content: `翻译时请参考以下术语表:\n${termsContext}`
            });
        }

        // 添加翻译建议（如果提供）
        if (suggestions && suggestions.length > 0) {
            suggestions.forEach(suggestion => {
                if (suggestion.original && suggestion.translation &&
                    typeof suggestion.matching === 'number' && suggestion.matching >= 0.7) {
                    messages.push({ role: "user", content: suggestion.original });
                    messages.push({ role: "assistant", content: suggestion.translation });
                }
            });
        }

        messages.push({ role: "user", content: query });

        const requestBody = { model, temperature, messages };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 250000);

            const response = await fetch(`${BASE_URL}${BASE_URL.endsWith('/') ? '' : '/'}chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET_KEY}` },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorData;
                try { errorData = await response.json(); } catch (e) { /* ignore */ }
                console.error('API Error:', errorData || response.statusText);
                return `API 翻译失败: ${response.status} - ${errorData?.error?.message || errorData?.message || response.statusText}`;
            }

            const data = await response.json();
            if (data.choices && data.choices[0]?.message?.content) {
                return data.choices[0].message.content;
            } else {
                console.error('Invalid API response structure:', data);
                return '翻译失败: API响应格式无效';
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('API translation request timed out.');
                return '翻译请求超时。';
            }
            console.error('Translation Fetch/Network Error:', error);
            return `翻译请求失败: ${error.message || error.toString()}`;
        }
    }

    function simulateInputChange(element, newValue) {
        if (element.value.trim() !== '') {
            // return; // Allowing overwrite now based on typical user expectation for paste
        }
        const inputEvent = new Event('input', { bubbles: true });
        const originalValue = element.value;
        element.value = newValue;
        const tracker = element._valueTracker;
        if (tracker) tracker.setValue(originalValue);
        element.dispatchEvent(inputEvent);
    }

    // 合并面板类
    class ParaTranzAIPanel {
        constructor() {
            this.stringReplacePanel = new StringReplacePanel();
            this.machineTranslationPanel = new MachineTranslationPanel();
            this.contentHTML = `
                <ul class="nav nav-tabs nav-fill mb-3" id="paratranz-ai-subtabs" style="border-bottom: 1px solid #dee2e6;">
                    <li class="nav-item">
                        <a class="nav-link active" id="subtab-translate-tab" href="#subtab-translate" style="cursor: pointer;">机器翻译</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="subtab-replace-tab" href="#subtab-replace" style="cursor: pointer;">文本替换</a>
                    </li>
                </ul>
                <div class="tab-content" id="paratranz-ai-subtabs-content">
                    <div class="tab-pane fade show active" id="subtab-translate" style="display: block;">
                        ${this.machineTranslationPanel.contentHTML}
                    </div>
                    <div class="tab-pane fade" id="subtab-replace" style="display: none;">
                        ${this.stringReplacePanel.contentHTML}
                    </div>
                </div>
            `;
        }

        init() {
            this.machineTranslationPanel.init();
            this.stringReplacePanel.init();

            // 手动处理子标签页切换
            const tabs = document.querySelectorAll('#paratranz-ai-subtabs .nav-link');
            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // 防止冒泡影响外层 Tab

                    // 切换 Tab 样式
                    tabs.forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');

                    // 切换内容显示
                    const targetId = e.target.getAttribute('href').substring(1);
                    const panes = document.querySelectorAll('#paratranz-ai-subtabs-content .tab-pane');
                    panes.forEach(p => {
                        if (p.id === targetId) {
                            p.classList.add('show', 'active');
                            p.style.display = 'block';
                        } else {
                            p.classList.remove('show', 'active');
                            p.style.display = 'none';
                        }
                    });
                });
            });
        }
    }

    const sortDropdown = new SortDropdown(); // <-- 初始化排序下拉菜单

    // --- 初始化 AI 标签页 ---
    // 目标 ul.nav (L783) 和 div.tabs (L791)
    // 修正选择器以匹配 template.html 中的结构
    const tabManager = new AITabManager('.sidebar-right ul.nav.nav-pills', '.sidebar-right .tabs');

    const paraTranzAIPanel = new ParaTranzAIPanel();

    // 1. 定义要移动的内容 (L609, L640) 和目标 Tab
    tabManager.addTab('paratranz-ai', 'AI', paraTranzAIPanel.contentHTML, () => paraTranzAIPanel.init());
    // AITabManager 继承自 BaseComponent，会自动调用 checkExistence() 来运行 insert()

    // Diff对比模态框类
    class DiffModal {
        constructor() {
            this.modalId = 'diffModal';
            this.diffLib = null;
            this.initModal();
            this.initDiffLibraries();
            this.handleEscKey = this.handleEscKey.bind(this);
        }

        initDiffLibraries() {
            if (typeof Diff !== 'undefined') {
                this.diffLib = Diff;
                console.log('jsdiff library initialized successfully');
            } else {
                console.error('jsdiff library is not available');
            }
        }

        initModal() {
            if (document.getElementById(this.modalId)) return;

            const modalHTML = `
                <div class="modal" id="${this.modalId}" tabindex="-1" role="dialog" style="display: none;">
                    <div class="modal-dialog modal-xl" role="document">
                        <div class="modal-content">
                            <div class="modal-header py-2">
                                <h5 class="modal-title">文本对比</h5>
                                <button type="button" class="close" id="closeDiffModal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body p-0" style="height: 70vh;">
                                <div class="diff-container d-flex h-100">
                                    <div class="diff-original w-50 border-right" style="overflow-y: auto;">
                                        <div class="diff-header bg-light p-2">原文</div>
                                        <div class="diff-content" id="originalDiffContent"></div>
                                    </div>
                                    <div class="diff-translation w-50" style="overflow-y: auto;">
                                        <div class="diff-header bg-light p-2 d-flex justify-content-between align-items-center">
                                            <span>当前翻译</span>
                                            <button class="btn btn-sm btn-primary" id="editTranslationButton">编辑</button>
                                        </div>
                                        <div class="diff-content" id="translationDiffContent" style="display: block;"></div>
                                        <textarea class="form-control" id="translationEditor" style="display: none; height: 100%; width: 100%; border: none; resize: none; font-family: monospace;" placeholder="在此编辑翻译内容..."></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <div class="mr-auto">
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button type="button" class="btn btn-outline-primary" id="applyAllSafeButton" title="替换修改 + 插入缺失（不删除右侧多余行）">应用所有块</button>
                                        <button type="button" class="btn btn-outline-danger" id="applyAllFullSyncButton" title="替换修改 + 插入缺失 + 删除多余（危险操作）">全量同步为原文</button>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-secondary" id="closeDiffModalButton">关闭</button>
                                <button type="button" class="btn btn-primary" id="saveTranslationButton" style="display: none;">保存</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            const style = document.createElement('style');
            style.textContent = `
                .diff-line {
                    display: flex;
                    padding: 2px 5px;
                    font-family: monospace;
                    line-height: 1.4;
                }
                .diff-line-number {
                    min-width: 35px;
                    color: #999;
                    text-align: right;
                    padding-right: 10px;
                    user-select: none;
                    font-size: 0.9em;
                }
                .diff-line-content {
                    flex: 1;
                    white-space: pre-wrap;
                    word-break: break-word;
                    padding-left: 5px;
                }
                .diff-line.diff-added {
                    background-color: #e6ffed; /* Light green for whole line add */
                }
                .diff-line.diff-removed {
                    background-color: #ffeef0; /* Light red for whole line remove */
                }
                .diff-line.diff-common {
                    background-color: #ffffff;
                }
                .diff-line.diff-placeholder,
                .diff-line.diff-modified-old, /* Placeholder for original side of a modification */
                .diff-line.diff-added-extra { /* Placeholder for translation side of a modification where original has fewer lines */
                    background-color: #f0f0f0; /* Grey for placeholders */
                }
                .copy-action-button { /* Unified class for action buttons */
                    cursor: pointer;
                    margin-left: 8px;
                    padding: 0 4px;
                    font-size: 0.9em;
                    line-height: 1;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    background-color: #f0f0f0;
                }
                .copy-action-button:hover {
                    background-color: #e0e0e0;
                }
                .diff-header {
                    font-weight: bold;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                    background-color: #f8f9fa; /* Ensure header bg covers scrolling content */
                }
                /* Intra-line diff styles */
                .diff-intraline-added {
                    background-color: #acf2bd; /* More prominent green for intra-line additions */
                    /* text-decoration: underline; */
                }
                .diff-intraline-removed {
                    background-color: #fdb8c0; /* More prominent red for intra-line deletions */
                    text-decoration: line-through;
                }
                /* Hunk toolbar */
                .diff-hunk-toolbar {
                    display: flex;
                    align-items: center;
                    padding: 4px 8px;
                    background-color: #f6f8fa;
                    border-bottom: 1px solid #e1e4e8;
                    position: sticky;
                    top: 24px;
                    z-index: 2;
                }
                .diff-hunk-badge {
                    display: inline-block;
                    font-size: 0.75rem;
                    color: #586069;
                    background: #eaf5ff;
                    border: 1px solid #c8e1ff;
                    border-radius: 10px;
                    padding: 0 6px;
                    margin-right: 8px;
                }
                .diff-hunk-actions .btn {
                    margin-right: 6px;
                }
            `;
            document.head.appendChild(style);

            document.getElementById('closeDiffModal').addEventListener('click', this.closeModal.bind(this));
            document.getElementById('closeDiffModalButton').addEventListener('click', this.closeModal.bind(this));
            document.getElementById('editTranslationButton').addEventListener('click', this.toggleEditMode.bind(this));
            document.getElementById('saveTranslationButton').addEventListener('click', this.saveTranslation.bind(this));
            const safeBtn = document.getElementById('applyAllSafeButton');
            if (safeBtn) {
                safeBtn.addEventListener('click', () => this.applyAllHunks({ replace: true, insert: true, delete: false }));
            }
            const fullSyncBtn = document.getElementById('applyAllFullSyncButton');
            if (fullSyncBtn) {
                fullSyncBtn.addEventListener('click', () => {
                    if (confirm('将删除译文中比原文多出的行，且不可撤销，确定继续？')) {
                        this.applyAllHunks({ replace: true, insert: true, delete: true });
                    }
                });
            }

            // Sync scroll between original and translation panes (line-anchored, VSCode-like)
            if (!this._scrollSyncSetup) {
                this._scrollSyncSetup = true;
                this._scrollSyncLock = null;
                this._scrollRafLeft = null;
                this._scrollRafRight = null;

                const leftContent = document.getElementById('originalDiffContent');
                const rightContent = document.getElementById('translationDiffContent');
                const leftScroll = leftContent ? leftContent.parentElement : null;
                const rightScroll = rightContent ? rightContent.parentElement : null;

                if (leftScroll && rightScroll && leftContent && rightContent) {
                    const getHeaderHeight = (scrollEl) => {
                        const header = scrollEl.querySelector('.diff-header');
                        return header ? header.offsetHeight : 0;
                    };

                    const getTopRowIndex = (scrollEl, contentEl) => {
                        const viewTop = scrollEl.getBoundingClientRect().top + getHeaderHeight(scrollEl) + 1;
                        const lines = contentEl.querySelectorAll('.diff-line');
                        for (let i = 0; i < lines.length; i++) {
                            const el = lines[i];
                            const rect = el.getBoundingClientRect();
                            if (rect.bottom > viewTop) {
                                const row = parseInt(el.dataset.row || '0', 10);
                                return isNaN(row) ? 0 : row;
                            }
                        }
                        const last = contentEl.querySelector('.diff-line:last-child');
                        const lastRow = last ? parseInt(last.dataset.row || '0', 10) : 0;
                        return isNaN(lastRow) ? 0 : lastRow;
                    };

                    const scrollToRow = (scrollEl, contentEl, rowIndex) => {
                        const target = contentEl.querySelector(`.diff-line[data-row="${rowIndex}"]`);
                        if (!target) return;
                        const scrollRectTop = scrollEl.getBoundingClientRect().top;
                        const headerH = getHeaderHeight(scrollEl);
                        const delta = target.getBoundingClientRect().top - (scrollRectTop + headerH);
                        scrollEl.scrollTop += delta;
                    };

                    leftScroll.addEventListener('scroll', () => {
                        if (this._scrollSyncLock === 'left') return;
                        cancelAnimationFrame(this._scrollRafLeft);
                        this._scrollRafLeft = requestAnimationFrame(() => {
                            this._scrollSyncLock = 'right';
                            const row = getTopRowIndex(leftScroll, leftContent);
                            scrollToRow(rightScroll, rightContent, row);
                            this._scrollSyncLock = null;
                        });
                    });

                    rightScroll.addEventListener('scroll', () => {
                        if (this._scrollSyncLock === 'right') return;
                        cancelAnimationFrame(this._scrollRafRight);
                        this._scrollRafRight = requestAnimationFrame(() => {
                            this._scrollSyncLock = 'left';
                            const row = getTopRowIndex(rightScroll, rightContent);
                            scrollToRow(leftScroll, leftContent, row);
                            this._scrollSyncLock = null;
                        });
                    });
                }
            }
        }

        toggleEditMode() {
            const translationContent = document.getElementById('translationDiffContent');
            const translationEditor = document.getElementById('translationEditor');
            const editButton = document.getElementById('editTranslationButton');
            const saveButton = document.getElementById('saveTranslationButton');

            if (translationContent.style.display === 'block') {
                translationContent.style.display = 'none';
                translationEditor.style.display = 'block';
                editButton.textContent = '取消编辑';
                saveButton.style.display = 'inline-block';
                translationEditor.value = document.querySelector('textarea.translation.form-control')?.value || '';
                translationEditor.focus();
            } else {
                translationContent.style.display = 'block';
                translationEditor.style.display = 'none';
                editButton.textContent = '编辑';
                saveButton.style.display = 'none';
            }
        }

        saveTranslation() {
            const translationEditor = document.getElementById('translationEditor');
            const textarea = document.querySelector('textarea.translation.form-control');
            if (textarea) {
                textarea.value = translationEditor.value;
                simulateInputChange(textarea, textarea.value); // Ensure change is registered by React/Vue if applicable
                this.closeModal();
            }
        }

        show() {
            const modal = document.getElementById(this.modalId);
            modal.style.display = 'block';
            this.generateDiff();
            document.addEventListener('keydown', this.handleEscKey);
        }

        closeModal() {
            document.getElementById(this.modalId).style.display = 'none';
            document.removeEventListener('keydown', this.handleEscKey);
        }

        handleEscKey(event) {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        }

        // Helper to split lines, handling trailing newline consistently and removing CR
        splitIntoLines(text) {
            if (text === null || text === undefined) return [];
            if (text === '') return ['']; // An empty text is one empty line for diffing purposes
            let lines = text.split('\n');
            // If the text ends with a newline, split will produce an empty string at the end.
            // jsdiff's diffLines handles this by considering the newline as part of the last line's value or as a separate token.
            // For our rendering, we want to represent each line distinctly.
            // If text is "a\nb\n", split gives ["a", "b", ""]. We want ["a", "b"].
            // If text is "a\nb", split gives ["a", "b"]. We want ["a", "b"].
            // If text is "\n", split gives ["", ""]. We want [""] for one empty line.
            if (text.endsWith('\n') && lines.length > 0) {
                 lines.pop(); // Remove the empty string caused by a trailing newline
            }
            return lines.map(l => l.replace(/\r$/, '')); // Remove CR if present for consistency
        }


        generateDiff() {
            const originalText = document.querySelector('.original.well')?.innerText || '';
            const translationText = document.querySelector('textarea.translation.form-control')?.value || '';

            const originalContent = document.getElementById('originalDiffContent');
            const translationContent = document.getElementById('translationDiffContent');
            originalContent.innerHTML = '';
            translationContent.innerHTML = '';

            if (!this.diffLib) {
                console.error('Diff library (jsdiff) not loaded.');
                originalContent.innerHTML = '<p>差异库未加载</p>';
                return;
            }

            const parts = this.diffLib.diffLines(originalText, translationText, { newlineIsToken: false, ignoreWhitespace: false });

            let origDisplay = 1;
            let transDisplay = 1;
            let transIndex = 0;
            let rowIndex = 0; // Visual row index for line-anchored scroll sync

            this.hunks = [];

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];

                if (part.removed) {
                    const removed = this.splitIntoLines(part.value);
                    if (i + 1 < parts.length && parts[i + 1].added) {
                        const added = this.splitIntoLines(parts[i + 1].value);

                        const hunk = {
                            id: this.hunks.length,
                            type: 'modify',
                            origLines: removed,
                            transLines: added,
                            transStart: transIndex,
                            transEnd: transIndex + added.length,
                            origStartDisplay: origDisplay,
                            transStartDisplay: transDisplay
                        };
                        this.hunks.push(hunk);
                        // no per-hunk toolbar; use inline arrows on left lines to apply whole block
                        const maxLines = Math.max(removed.length, added.length);
                        let leftActionInjected = false; // ensure only one arrow per hunk on the left
                        for (let j = 0; j < maxLines; j++) {
                            const r = j < removed.length ? removed[j] : null;
                            const a = j < added.length ? added[j] : null;

                            if (r !== null) {
                                const showBtn = !leftActionInjected;
                                this.appendLine(
                                    originalContent,
                                    origDisplay++,
                                    r,
                                    'diff-removed',
                                    r,
                                    hunk.transStart,
                                    showBtn,
                                    'original',
                                    a,
                                    'replace',
                                    showBtn ? 'replace' : null,
                                    showBtn ? hunk.id : null
                                );
                                if (showBtn) leftActionInjected = true;
                            } else {
                                this.appendLine(originalContent, '-', '', 'diff-placeholder diff-added-extra', null, null, false, 'original', null);
                            }

                            if (a !== null) {
                                this.appendLine(translationContent, transDisplay++, a, 'diff-added', a, null, false, 'translation', r);
                            } else {
                                this.appendLine(translationContent, '-', '', 'diff-placeholder diff-modified-old', null, null, false, 'translation', null);
                            }

                            // Link this visual row for scroll sync
                            const leftEl = originalContent.lastElementChild;
                            const rightEl = translationContent.lastElementChild;
                            if (leftEl) {
                                leftEl.dataset.row = String(rowIndex);
                                leftEl.dataset.side = 'original';
                            }
                            if (rightEl) {
                                rightEl.dataset.row = String(rowIndex);
                                rightEl.dataset.side = 'translation';
                            }
                            rowIndex++;
                        }
                        transIndex += added.length;
                        i++; // skip paired added part
                    } else {
                        // Pure removal => missing on right, can insert
                        const hunk = {
                            id: this.hunks.length,
                            type: 'remove',
                            origLines: removed,
                            transLines: [],
                            transStart: transIndex,
                            transEnd: transIndex,
                            origStartDisplay: origDisplay,
                            transStartDisplay: transDisplay
                        };
                        this.hunks.push(hunk);
                        // no per-hunk toolbar; use inline arrows on left lines to apply whole block
                        removed.forEach((r, idx) => {
                            const showBtn = idx === 0; // one arrow per hunk on the first original line
                            this.appendLine(
                                originalContent,
                                origDisplay++,
                                r,
                                'diff-removed',
                                r,
                                hunk.transStart,
                                showBtn,
                                'original',
                                '',
                                'insert',
                                showBtn ? 'insert' : null,
                                showBtn ? hunk.id : null
                            );
                            this.appendLine(translationContent, '-', '', 'diff-placeholder', null, null, false, 'translation', null);

                            // Link this visual row for scroll sync
                            const leftEl = originalContent.lastElementChild;
                            const rightEl = translationContent.lastElementChild;
                            if (leftEl) {
                                leftEl.dataset.row = String(rowIndex);
                                leftEl.dataset.side = 'original';
                            }
                            if (rightEl) {
                                rightEl.dataset.row = String(rowIndex);
                                rightEl.dataset.side = 'translation';
                            }
                            rowIndex++;
                        });
                    }
                } else if (part.added) {
                    // Pure addition => extra on right, can delete
                    const added = this.splitIntoLines(part.value);
                    const hunk = {
                        id: this.hunks.length,
                        type: 'add',
                        origLines: [],
                        transLines: added,
                        transStart: transIndex,
                        transEnd: transIndex + added.length,
                        origStartDisplay: origDisplay,
                        transStartDisplay: transDisplay
                    };
                    this.hunks.push(hunk);
                    // no per-hunk toolbar; keep inline rendering

                    added.forEach(a => {
                        this.appendLine(originalContent, '-', '', 'diff-placeholder', null, null, false, 'original', null);
                        this.appendLine(translationContent, transDisplay++, a, 'diff-added', a, null, false, 'translation', '');

                        // Link this visual row for scroll sync
                        const leftEl = originalContent.lastElementChild;
                        const rightEl = translationContent.lastElementChild;
                        if (leftEl) {
                            leftEl.dataset.row = String(rowIndex);
                            leftEl.dataset.side = 'original';
                        }
                        if (rightEl) {
                            rightEl.dataset.row = String(rowIndex);
                            rightEl.dataset.side = 'translation';
                        }
                        rowIndex++;
                    });
                    transIndex += added.length;
                } else {
                    // Common lines
                    const common = this.splitIntoLines(part.value);
                    common.forEach(lineText => {
                        this.appendLine(originalContent, origDisplay++, lineText, 'diff-common', lineText, null, false, 'original', lineText);
                        this.appendLine(translationContent, transDisplay++, lineText, 'diff-common', lineText, null, false, 'translation', lineText);

                        // Link this visual row for scroll sync
                        const leftEl = originalContent.lastElementChild;
                        const rightEl = translationContent.lastElementChild;
                        if (leftEl) {
                            leftEl.dataset.row = String(rowIndex);
                            leftEl.dataset.side = 'original';
                        }
                        if (rightEl) {
                            rightEl.dataset.row = String(rowIndex);
                            rightEl.dataset.side = 'translation';
                        }
                        rowIndex++;
                    });
                    transIndex += common.length;
                }
            }
        }

        appendLine(container, lineNumber, text, diffClass, lineTextForAction = null, translationLineIndexForAction = null, showActionButton = false, side = 'original', otherTextForIntralineDiff = null, actionType = 'replace', hunkAction = null, hunkId = null) { // Added hunkAction to support whole-block apply
            const lineDiv = document.createElement('div');
            lineDiv.className = `diff-line ${diffClass || ''}`;

            const numberSpan = document.createElement('span');
            numberSpan.className = 'diff-line-number';
            numberSpan.textContent = lineNumber;
            lineDiv.appendChild(numberSpan);

            const contentSpan = document.createElement('span');
            contentSpan.className = 'diff-line-content';

            if (text === null || (text === '' && diffClass.includes('placeholder'))) {
                contentSpan.innerHTML = '&nbsp;';
            } else if (this.diffLib && otherTextForIntralineDiff !== null && (diffClass.includes('diff-removed') || diffClass.includes('diff-added'))) {
                // VSCode-like: each side renders only its own text.
                // - Left/original shows old text only (skip added parts), highlight removals.
                // - Right/translation shows new text only (skip removed parts), highlight additions.
                let oldContentForWordDiff, newContentForWordDiff;

                if (diffClass.includes('diff-removed')) { // left line of a modification
                    oldContentForWordDiff = text;
                    newContentForWordDiff = otherTextForIntralineDiff || '';
                } else if (diffClass.includes('diff-added')) { // right line of a modification
                    oldContentForWordDiff = otherTextForIntralineDiff || '';
                    newContentForWordDiff = text;
                }

                const wordDiff = this.diffLib.diffWordsWithSpace(oldContentForWordDiff, newContentForWordDiff);
                wordDiff.forEach(part => {
                    // Filter out the opposite side segments so each column keeps its own content
                    if (side === 'original' && part.added) {
                        // additions belong to the right/new side — do not render on the left
                        return;
                    }
                    if (side === 'translation' && part.removed) {
                        // removals belong to the left/old side — do not render on the right
                        return;
                    }

                    const span = document.createElement('span');
                    if (side === 'original') {
                        if (part.removed) span.className = 'diff-intraline-removed';
                    } else if (side === 'translation') {
                        if (part.added) span.className = 'diff-intraline-added';
                    }
                    span.textContent = part.value;
                    contentSpan.appendChild(span);
                });

            } else {
                contentSpan.textContent = text;
            }
            lineDiv.appendChild(contentSpan);

            if (showActionButton && lineTextForAction !== null && translationLineIndexForAction !== null && !diffClass.includes('placeholder')) {
                const actionButton = document.createElement('button');
                actionButton.className = `btn btn-link p-0 ml-2 copy-action-button`;
                let buttonTitle = '';
                let buttonIconClass = '';

                if (side === 'original') {
                    buttonIconClass = 'fas fa-arrow-right';
                    if (hunkAction) {
                        buttonTitle = hunkAction === 'replace' ? '用原文块替换右侧（整块）' : '将原文块插入右侧（整块）';
                    } else if (actionType === 'replace') {
                        buttonTitle = '使用此原文行覆盖译文对应行';
                    } else { // actionType === 'insert'
                        buttonTitle = '将此原文行插入到译文对应位置';
                    }
                }
                // Add logic for buttons on translation side if needed later

                if (buttonIconClass && !diffClass.includes('diff-common')) { // <--- 修改点在这里
                    actionButton.innerHTML = `<i class="${buttonIconClass}"></i>`;
                    actionButton.title = buttonTitle;
                    actionButton.addEventListener('click', () => {
                        if (hunkAction) {
                            this.applyHunkById(hunkId, hunkAction);
                            return;
                        }
                        const textarea = document.querySelector('textarea.translation.form-control');
                        if (!textarea) return;
                        let lines = textarea.value.split('\n');
                        const targetIndex = Math.max(0, translationLineIndexForAction);

                        while (lines.length <= targetIndex) {
                            lines.push('');
                        }
                        if (actionType === 'replace') {
                            while (lines.length <= targetIndex) {
                                lines.push('');
                            }
                            lines[targetIndex] = lineTextForAction;
                        } else { // actionType === 'insert'
                            const effectiveTargetIndex = Math.min(lines.length, targetIndex);
                            lines.splice(effectiveTargetIndex, 0, lineTextForAction);
                        }

                        textarea.value = lines.join('\n');
                        simulateInputChange(textarea, textarea.value);
                        requestAnimationFrame(() => this.generateDiff());
                    });
                    lineDiv.appendChild(actionButton);
                }
            }
            container.appendChild(lineDiv);
        }

        // === Hunk-level helpers and actions ===

        getTranslationLines() {
            const textarea = document.querySelector('textarea.translation.form-control');
            if (!textarea) return [];
            return textarea.value.split('\n');
        }

        setTranslationLines(lines) {
            const textarea = document.querySelector('textarea.translation.form-control');
            if (!textarea) return;
            textarea.value = lines.join('\n');
            simulateInputChange(textarea, textarea.value);
        }

        applyHunkById(hunkId, mode) {
            const h = (this.hunks || []).find(x => x.id === hunkId);
            if (!h) return;
            this.applyHunk(h, mode);
        }

        applyHunk(h, mode) {
            const lines = this.getTranslationLines();
            const start = Math.max(0, h.transStart);
            const end = Math.max(start, h.transEnd);

            if (mode === 'replace' && h.type === 'modify') {
                lines.splice(start, h.transLines.length, ...h.origLines);
            } else if (mode === 'insert' && (h.type === 'remove' || h.type === 'modify')) {
                lines.splice(start, 0, ...h.origLines);
            } else if (mode === 'delete' && h.type === 'add') {
                lines.splice(start, h.transLines.length);
            } else if (mode === 'sync') {
                if (h.type === 'modify') {
                    lines.splice(start, h.transLines.length, ...h.origLines);
                } else if (h.type === 'remove') {
                    lines.splice(start, 0, ...h.origLines);
                } else if (h.type === 'add') {
                    lines.splice(start, h.transLines.length);
                }
            } else {
                return;
            }

            this.setTranslationLines(lines);
            requestAnimationFrame(() => this.generateDiff());
        }

        applyAllHunks(options = { replace: true, insert: true, delete: false }) {
            const hunks = this.hunks || [];
            let lines = this.getTranslationLines();
            let offset = 0;

            for (const h of hunks) {
                const start = h.transStart + offset;
                const addCount = h.origLines.length;
                const oldCount = h.transLines.length;

                if (h.type === 'modify' && options.replace) {
                    lines.splice(start, oldCount, ...h.origLines);
                    offset += (addCount - oldCount);
                } else if (h.type === 'remove' && options.insert) {
                    lines.splice(start, 0, ...h.origLines);
                    offset += addCount;
                } else if (h.type === 'add' && options.delete) {
                    lines.splice(start, oldCount);
                    offset -= oldCount;
                }
            }

            this.setTranslationLines(lines);
            requestAnimationFrame(() => this.generateDiff());
        }

        appendHunkHeader(originalContent, translationContent, hunk) {
            const left = document.createElement('div');
            left.className = 'diff-line diff-hunk-toolbar';
            const right = document.createElement('div');
            right.className = 'diff-line diff-hunk-toolbar';

            const leftNum = document.createElement('span');
            leftNum.className = 'diff-line-number';
            leftNum.textContent = ' ';
            left.appendChild(leftNum);

            const leftContent = document.createElement('span');
            leftContent.className = 'diff-line-content';

            const badge = document.createElement('span');
            badge.className = 'diff-hunk-badge';
            const counts = `${hunk.origLines.length}行 -> ${hunk.transLines.length}行`;
            if (hunk.type === 'modify') {
                badge.textContent = `修改块 #${hunk.id + 1} (${counts})`;
            } else if (hunk.type === 'remove') {
                badge.textContent = `缺失块 #${hunk.id + 1} (+${hunk.origLines.length})`;
            } else {
                badge.textContent = `多余块 #${hunk.id + 1} (-${hunk.transLines.length})`;
            }
            leftContent.appendChild(badge);

            const actions = document.createElement('span');
            actions.className = 'diff-hunk-actions';

            if (hunk.type === 'modify') {
                const replaceBtn = document.createElement('button');
                replaceBtn.className = 'btn btn-sm btn-outline-primary';
                replaceBtn.textContent = '用原文块替换右侧';
                replaceBtn.title = '将此修改块的原文整体替换右侧对应块';
                replaceBtn.addEventListener('click', () => this.applyHunk(hunk, 'replace'));
                actions.appendChild(replaceBtn);
            }

            if (hunk.type === 'remove') {
                const insertBtn = document.createElement('button');
                insertBtn.className = 'btn btn-sm btn-outline-primary';
                insertBtn.textContent = '插入到右侧';
                insertBtn.title = '在对应位置插入这些原文行';
                insertBtn.addEventListener('click', () => this.applyHunk(hunk, 'insert'));
                actions.appendChild(insertBtn);
            }

            if (hunk.type === 'add') {
                const delBtn = document.createElement('button');
                delBtn.className = 'btn btn-sm btn-outline-danger';
                delBtn.textContent = '删除右侧块';
                delBtn.title = '删除右侧此多余块';
                delBtn.addEventListener('click', () => this.applyHunk(hunk, 'delete'));
                actions.appendChild(delBtn);
            }

            leftContent.appendChild(actions);
            left.appendChild(leftContent);

            const rightNum = document.createElement('span');
            rightNum.className = 'diff-line-number';
            rightNum.textContent = ' ';
            right.appendChild(rightNum);

            const rightContent = document.createElement('span');
            rightContent.className = 'diff-line-content';
            rightContent.innerHTML = '&nbsp;';
            right.appendChild(rightContent);

            originalContent.appendChild(left);
            translationContent.appendChild(right);
        }
    }

    const diffModal = new DiffModal();

    // 添加对比按钮
    const diffButton = new Button(
        '.btn.btn-secondary.show-diff-button',
        '.string-editor .toolbar .left', // 移动到编辑器工具栏左侧 (L578)
        '<i class="fas fa-file-alt"></i> 对比文本',
        function() {
            diffModal.show();
        },
        '快捷键: Ctrl + Alt + D'
    );

    const runAllReplacementsButton = new Button(
        '.btn.btn-secondary.apply-all-rules-button',
        '.string-editor .toolbar .left', // 移动到编辑器工具栏左侧 (L578)
        '<i class="fas fa-cogs"></i> 应用全部替换',
        function() {
            const replaceList = JSON.parse(localStorage.getItem('replaceList')) || [];
            const textareas = document.querySelectorAll('textarea.translation.form-control');
            textareas.forEach(textarea => {
                let text = textarea.value;
                replaceList.forEach(rule => {
                    if (!rule.disabled && rule.findText) {
                         text = text.replaceAll(rule.findText, rule.replacementText);
                    }
                });
                simulateInputChange(textarea, text);
            });
        }
    );

    // AI 对话框类
    class AIChatDialog {
        constructor() {
            this.fabId = 'ai-chat-fab';
            this.dialogId = 'ai-chat-dialog';
            this.messagesContainerId = 'ai-chat-messages';
            this.inputAreaId = 'ai-chat-input';
            this.sendButtonId = 'ai-chat-send';
            this.closeButtonId = 'ai-chat-close';
            this.clearHistoryButtonId = 'ai-chat-clear-history'; // New ID for clear button
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.dialogX = 0;
            this.dialogY = 0;
            this.sendContextToggleId = 'ai-chat-send-context-toggle';
            this.localStorageKeySendContext = 'aiChatSendContextEnabled';
            this.aiChatModelInputId = 'aiChatModelInput';
            this.aiChatModelSelectId = 'aiChatModelSelect';
            this.fetchAiChatModelsButtonId = 'fetchAiChatModelsButton';
            this.localStorageKeyAiChatModel = 'aiChatModelName'; // New key for AI chat model
            // Chat history configuration
            this.chatHistoryStorageKey = 'paratranzAiChatHistory';
            this.chatHistoryLimit = 20;
            this.chatHistory = [];
            this.init();
        }

        init() {
            this.addStyles();
            this.insertFab();
            // Dialog is inserted only when FAB is clicked for the first time
        }

        addStyles() {
            const css = `
                #${this.fabId} {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    background-color: #007bff;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 9998; /* Below dialog */
                    transition: background-color 0.3s ease;
                }
                #${this.fabId}:hover {
                    background-color: #0056b3;
                }
                /* 从右侧弹出的覆盖窗口，宽度动态匹配原右侧栏 */
                #${this.dialogId} {
                    position: fixed;
                    top: 70px; /* 尽量避开顶栏，具体高度不敏感 */
                    right: 0;
                    bottom: 0;
                    width: var(--ai-chat-width, 33.333%); /* 默认使用 col-xl-4 的宽度 */
                    max-width: 450px;
                    min-width: 320px;
                    background-color: white;
                    border-left: 1px solid #dee2e6;
                    box-shadow: -3px 0 10px rgba(0,0,0,0.15);
                    display: flex;
                    flex-direction: column;
                    z-index: 9999;
                    overflow: hidden; /* Prevent content spill */
                    transform: translateX(100%);
                    opacity: 0;
                    pointer-events: none; /* 隐藏时不阻挡点击 */
                    transition: transform 0.25s ease-out, opacity 0.25s ease-out;
                }
                /* 可见状态：从右侧滑出 */
                #${this.dialogId}.ai-chat-visible {
                    transform: translateX(0);
                    opacity: 1;
                    pointer-events: auto; /* 只在自身区域接收点击 */
                }
                #${this.dialogId} .ai-chat-header {
                    padding: 10px 15px;
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: default;
                }
                #${this.dialogId} .ai-chat-header h5 {
                    margin: 0;
                    font-size: 1rem;
                    flex-grow: 1; /* Allow title to take space */
                }
                #${this.dialogId} .ai-chat-header .header-buttons {
                    display: flex;
                    align-items: center;
                }
                #${this.dialogId} .ai-chat-header .btn-icon { /* Style for icon buttons */
                    background: none;
                    border: none;
                    font-size: 1.2rem; /* Adjust icon size */
                    opacity: 0.6;
                    cursor: pointer;
                    padding: 5px;
                    margin-left: 8px;
                }
                #${this.dialogId} .ai-chat-header .btn-icon:hover {
                    opacity: 1;
                }
                #${this.messagesContainerId} {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 0;
                    background-color: #fff;
                }
                #${this.messagesContainerId} .message {
                    padding: 20px;
                    border-bottom: 1px solid #f0f0f0;
                    width: 100%;
                    word-wrap: break-word;
                    position: relative;
                }
                #${this.messagesContainerId} .message:hover {
                    background-color: #f8f9fa;
                }
                #${this.messagesContainerId} .message.user {
                    background-color: #fff;
                    color: #333;
                }
                #${this.messagesContainerId} .message.ai {
                    background-color: #fff;
                    color: #333;
                }
                 #${this.messagesContainerId} .message.error {
                    background-color: #fff5f5;
                    color: #dc3545;
                }
                
                #${this.messagesContainerId} .message-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 12px;
                    color: #999;
                }
                
                #${this.messagesContainerId} .message-sender {
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                #${this.messagesContainerId} .message-actions {
                    opacity: 0;
                    transition: opacity 0.2s;
                    display: flex;
                    gap: 8px;
                }
                
                #${this.messagesContainerId} .message:hover .message-actions {
                    opacity: 1;
                }
                
                #${this.messagesContainerId} .message-action-btn {
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    padding: 2px 5px;
                    font-size: 12px;
                    border-radius: 3px;
                }
                
                #${this.messagesContainerId} .message-action-btn:hover {
                    color: #007bff;
                    background-color: rgba(0,123,255,0.1);
                }

                #${this.messagesContainerId} .message-content {
                    font-size: 14px;
                    line-height: 1.6;
                }
                #${this.dialogId} .ai-chat-input-area {
                    display: flex;
                    align-items: flex-start; /* Align items to the start for multi-line textarea */
                    padding: 10px;
                    border-top: 1px solid #dee2e6;
                    background-color: #f8f9fa;
                }
                #${this.inputAreaId} {
                    flex-grow: 1;
                    margin-right: 8px; /* Reduced margin */
                    resize: none; /* Prevent manual resize */
                    min-height: 40px; /* Ensure it's at least one line */
                    max-height: 120px; /* Limit max height for textarea */
                    overflow-y: auto; /* Allow scroll if content exceeds max-height */
                    line-height: 1.5; /* Adjust line height for better readability */
                }
                #${this.sendButtonId} {
                    height: 40px; /* Keep button height consistent */
                    min-width: 65px; /* Ensure button has enough space for "发送" */
                    padding-left: 12px;
                    padding-right: 12px;
                    align-self: flex-end; /* Align button to bottom if textarea grows */
                }
                .ai-chat-options {
                    padding: 5px 10px;
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #dee2e6;
                    font-size: 0.85rem;
                }
                .ai-chat-options .custom-control-label {
                    font-weight: normal;
                }
                #${this.messagesContainerId} .code-block-wrapper {
                    position: relative;
                    margin: 8px 0;
                }
                #${this.messagesContainerId} .code-block-wrapper pre {
                    background-color: #272822;
                    color: #f8f8f2;
                    padding: 8px;
                    padding-top: 32px; /* 为按钮留出空间 */
                    border-radius: 4px;
                    overflow-x: auto;
                    font-size: 0.85rem;
                    margin: 0;
                }
                #${this.messagesContainerId} .code-block-actions {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    display: flex;
                    gap: 4px;
                    z-index: 1;
                    align-items: center;
                }
                #${this.messagesContainerId} .code-block-actions .code-block-language {
                    padding: 2px 6px;
                    border-radius: 3px;
                    background-color: rgba(0, 0, 0, 0.35);
                    color: #f8f8f2;
                    font-size: 0.75rem;
                    line-height: 1.2;
                }
                #${this.messagesContainerId} .code-block-actions button {
                    background-color: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #f8f8f2;
                    padding: 2px 8px;
                    border-radius: 3px;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                #${this.messagesContainerId} .code-block-actions button:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
                #${this.messagesContainerId} .code-block-actions button.copied {
                    background-color: #28a745;
                    border-color: #28a745;
                }
                #${this.messagesContainerId} code {
                    background-color: rgba(27, 31, 35, 0.05);
                    padding: 0.2em 0.4em;
                    border-radius: 3px;
                    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                #${this.messagesContainerId} a {
                    color: #0056b3;
                    text-decoration: underline;
                }
                @media (max-width: 768px) {
                    /* 移动端：全屏覆盖显示 */
                    #${this.dialogId} {
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 0;
                        box-shadow: none;
                        border: none;
                    }
                    #${this.fabId} {
                        bottom: 10px;
                        right: 10px;
                    }
                }
            `;
            GM_addStyle(css);
        }

        insertFab() {
            if (document.getElementById(this.fabId)) return;
            const fab = document.createElement('div');
            fab.id = this.fabId;
            fab.innerHTML = '<i class="fas fa-robot"></i>'; // Example icon
            fab.title = 'AI 助手';
            fab.addEventListener('click', () => this.toggleDialog());
            document.body.appendChild(fab);
        }

        insertDialog() {
            if (document.getElementById(this.dialogId)) return;

            const dialog = document.createElement('div');
            dialog.id = this.dialogId;
            dialog.innerHTML = `
                <div class="ai-chat-header">
                    <h5>AI 助手</h5>
                    <div class="header-buttons">
                        <button type="button" class="btn-icon" id="${this.clearHistoryButtonId}" title="清空聊天记录">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button type="button" class="btn-icon close" id="${this.closeButtonId}" aria-label="Close" title="关闭对话框">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
                <div id="${this.messagesContainerId}">
                    <div class="message ai">你好！有什么可以帮你的吗？</div>
                </div>
                <div class="ai-chat-options">
                    <div class="custom-control custom-switch custom-control-sm">
                        <input type="checkbox" class="custom-control-input" id="${this.sendContextToggleId}">
                        <label class="custom-control-label" for="${this.sendContextToggleId}">发送页面上下文给AI</label>
                    </div>
                </div>
                <div class="ai-chat-options" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 5px;"> <!-- Model selection for AI Chat -->
                    <div class="form-group mb-1">
                        <label for="${this.aiChatModelInputId}" style="font-size: 0.85rem; margin-bottom: .2rem;">AI 模型:</label>
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control form-control-sm" id="${this.aiChatModelInputId}" placeholder="默认 (gpt-4o-mini)">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="${this.aiChatModelSelectId}_toggle" aria-haspopup="true" aria-expanded="false"></button>
                                <div class="dropdown-menu dropdown-menu-right" id="${this.aiChatModelSelectId}_menu" style="max-height: 200px; overflow-y: auto;">
                                    <h6 class="dropdown-header">请先点击刷新按钮获取模型</h6>
                                </div>
                                <button class="btn btn-outline-secondary btn-sm" type="button" id="${this.fetchAiChatModelsButtonId}" title="获取模型列表">
                                    <i class="fas fa-sync-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ai-chat-input-area">
                    <textarea id="${this.inputAreaId}" class="form-control" placeholder="输入消息..."></textarea>
                    <button id="${this.sendButtonId}" class="btn btn-primary">发送</button>
                </div>
            `;

            // 始终挂载到 body，作为从右侧弹出的覆盖窗口
            document.body.appendChild(dialog);

            // 初始化并渲染历史记录
            this.chatHistory = this.loadChatHistory();
            this.renderChatHistory();

            // Add event listeners
            document.getElementById(this.closeButtonId).addEventListener('click', () => this.toggleDialog(false));
            document.getElementById(this.clearHistoryButtonId).addEventListener('click', () => this.clearChatHistory());
            document.getElementById(this.sendButtonId).addEventListener('click', () => this.sendMessage());

            const sendContextToggle = document.getElementById(this.sendContextToggleId);
            const aiChatModelInput = document.getElementById(this.aiChatModelInputId);
            const aiChatModelMenu = document.getElementById(`${this.aiChatModelSelectId}_menu`);
            const aiChatModelToggle = document.getElementById(`${this.aiChatModelSelectId}_toggle`);
            const fetchAiChatModelsButton = document.getElementById(this.fetchAiChatModelsButtonId);

            // Load saved preference for sending context
            const savedSendContextPreference = localStorage.getItem(this.localStorageKeySendContext);
            if (savedSendContextPreference === 'true') {
                sendContextToggle.checked = true;
            } else if (savedSendContextPreference === 'false') {
                sendContextToggle.checked = false;
            } else {
                sendContextToggle.checked = true; // Default to true if not set
                localStorage.setItem(this.localStorageKeySendContext, 'true');
            }

            sendContextToggle.addEventListener('change', (e) => {
                localStorage.setItem(this.localStorageKeySendContext, e.target.checked);
            });

            // AI Chat Model preferences
            let initialAiChatModel = localStorage.getItem(this.localStorageKeyAiChatModel);
            if (!initialAiChatModel) {
                // If no specific AI chat model is saved, try to use the model from the current translation config
                const currentTranslationConfigName = getCurrentApiConfigName();
                if (currentTranslationConfigName) {
                    const configs = getApiConfigurations();
                    const activeTranslationConfig = configs.find(c => c.name === currentTranslationConfigName);
                    if (activeTranslationConfig && activeTranslationConfig.model) {
                        initialAiChatModel = activeTranslationConfig.model;
                        // Save this inherited model as the current AI chat model
                        localStorage.setItem(this.localStorageKeyAiChatModel, initialAiChatModel);
                    }
                }
            }
            aiChatModelInput.value = initialAiChatModel || ''; // Fallback to empty if no model found

            aiChatModelInput.addEventListener('input', () => {
                localStorage.setItem(this.localStorageKeyAiChatModel, aiChatModelInput.value);
            });
            fetchAiChatModelsButton.addEventListener('click', async () => {
                await this.fetchModelsAndUpdateDatalistForChat();
            });

            // Dropdown Toggle Logic for AI Chat
            aiChatModelToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShown = aiChatModelMenu.classList.contains('show');
                document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
                if (!isShown) aiChatModelMenu.classList.add('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (aiChatModelMenu.classList.contains('show') && !aiChatModelMenu.contains(e.target) && e.target !== aiChatModelToggle) {
                    aiChatModelMenu.classList.remove('show');
                }
            });

            // Auto-resize textarea
            const textarea = document.getElementById(this.inputAreaId);
            textarea.addEventListener('input', () => {
                // Auto-resize textarea based on content, up to max-height
                textarea.style.height = 'auto'; // Reset height to shrink if text is deleted
                let scrollHeight = textarea.scrollHeight;
                const maxHeight = parseInt(window.getComputedStyle(textarea).maxHeight, 10);
                if (maxHeight && scrollHeight > maxHeight) {
                    textarea.style.height = maxHeight + 'px';
                    textarea.style.overflowY = 'auto';
                } else {
                    textarea.style.height = scrollHeight + 'px';
                    textarea.style.overflowY = 'hidden';
                }
            });
        }

        toggleDialog(forceShow = null) {
            if (!document.getElementById(this.dialogId)) {
                this.insertDialog();
            }
            const dialog = document.getElementById(this.dialogId);
            const isVisible = dialog.classList.contains('ai-chat-visible');
            const shouldShow = forceShow !== null ? forceShow : !isVisible;

            if (shouldShow) {
                // 动态获取原版边栏宽度并应用
                this.syncWidthWithSidebar();
                dialog.classList.add('ai-chat-visible');
                setTimeout(() => {
                    const input = document.getElementById(this.inputAreaId);
                    if (input) input.focus();
                }, 0);
            } else {
                dialog.classList.remove('ai-chat-visible');
            }
        }

        syncWidthWithSidebar() {
            const dialog = document.getElementById(this.dialogId);
            const sidebarRight = document.querySelector('.sidebar-right');
            if (dialog && sidebarRight) {
                const sidebarWidth = sidebarRight.offsetWidth;
                if (sidebarWidth > 0) {
                    dialog.style.setProperty('--ai-chat-width', sidebarWidth + 'px');
                    dialog.style.width = sidebarWidth + 'px';
                }
            }
        }

        displayMessage(text, sender = 'ai', isError = false) {
            const messagesContainer = document.getElementById(this.messagesContainerId);
            if (!messagesContainer) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender} ${isError ? 'error' : ''}`;
            messageDiv.dataset.rawText = text || '';

            // Header
            const headerDiv = document.createElement('div');
            headerDiv.className = 'message-header';
            
            const senderIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
            const senderName = sender === 'user' ? 'You' : 'AI';
            
            headerDiv.innerHTML = `
                <div class="message-sender">
                    <i class="fas ${senderIcon}"></i> ${senderName}
                </div>
            `;

            // Actions
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            
            // Copy Button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'message-action-btn';
            copyBtn.title = '复制内容';
            copyBtn.innerHTML = '<i class="far fa-copy"></i>';
            copyBtn.onclick = () => {
                const textToCopy = messageDiv.dataset.rawText || '';
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('已复制', 'success');
                });
            };
            actionsDiv.appendChild(copyBtn);
            
            headerDiv.appendChild(actionsDiv);
            messageDiv.appendChild(headerDiv);

            // Content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';

            if (sender === 'ai' && !isError) {
                contentDiv.innerHTML = this.renderMarkdown(text);
                this.bindCodeBlockActions(contentDiv);
            } else {
                contentDiv.textContent = text;
            }
            
            messageDiv.appendChild(contentDiv);

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return messageDiv; // Return the created message element for potential stream updates
        }

        renderMarkdown(text) {
            if (typeof text !== 'string' || text.length === 0) {
                return '';
            }
            const escapeHtml = (str) => {
                return str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            };

            const codeBlockPlaceholders = [];
            const placeholderPrefix = '__CODE_BLOCK_';
            const codeBlockRegex = /```([\w.+-]*)[ \t]*\r?\n?([\s\S]*?)```/g;
            const textWithPlaceholders = text.replace(codeBlockRegex, (match, lang = '', code = '') => {
                const placeholder = `${placeholderPrefix}${codeBlockPlaceholders.length}__`;
                const language = (lang || '').trim();
                let cleanedCode = code.replace(/^[\r\n]+/, '').replace(/[\r\n]+$/, '');
                codeBlockPlaceholders.push({
                    language,
                    code: cleanedCode
                });
                return placeholder;
            });

            let html = escapeHtml(textWithPlaceholders);

            // Inline code `code`
            html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

            // Headings
            html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
            html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
            html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
            html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
            html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
            html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

            // Bold **text**
            html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

            // Italic *text*
            html = html.replace(/(\s|^)\*([^*]+)\*(\s|$)/g, '$1<em>$2</em>$3');

            // Links [text](url)
            html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

            // Line breaks
            html = html.replace(/\r?\n/g, '<br>');

            // Restore code blocks with action buttons
            codeBlockPlaceholders.forEach((block, index) => {
                const escapedCode = escapeHtml(block.code);
                const languageLabel = block.language ? `<span class="code-block-language">${escapeHtml(block.language)}</span>` : '';
                const encodedCode = encodeURIComponent(block.code);
                const dataAttributes = [`data-code="${encodedCode}"`];
                if (block.language) {
                    dataAttributes.push(`data-language="${encodeURIComponent(block.language)}"`);
                }
                const codeBlockHtml = `<div class="code-block-wrapper" ${dataAttributes.join(' ')}>
                    <div class="code-block-actions">
                        ${languageLabel}
                        <button class="code-copy-btn" title="复制代码">复制</button>
                        <button class="code-fill-btn" title="填充到翻译框">填充翻译</button>
                    </div>
                    <pre><code>${escapedCode}</code></pre>
                </div>`;
                const placeholderPattern = new RegExp(`${placeholderPrefix}${index}__`, 'g');
                html = html.replace(placeholderPattern, codeBlockHtml);
            });

            return html;
        }

        updateAIMessage(messageElement, fullText) {
            if (!messageElement) return;
            const contentDiv = messageElement.querySelector('.message-content');
            if (contentDiv) {
                contentDiv.innerHTML = this.renderMarkdown(fullText || '');
                this.bindCodeBlockActions(contentDiv);
            }
            messageElement.dataset.rawText = fullText || '';

            const messagesContainer = document.getElementById(this.messagesContainerId);
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }

        bindCodeBlockActions(containerElement) {
            if (!containerElement) return;

            const getCodeBlockRawText = (wrapper, codeElement) => {
                if (!wrapper && !codeElement) return '';
                const encoded = wrapper?.dataset?.code;
                if (encoded) {
                    try {
                        return decodeURIComponent(encoded);
                    } catch (err) {
                        console.warn('Failed to decode code-block dataset:', err);
                    }
                }
                return codeElement?.textContent || '';
            };

            // 绑定复制按钮
            const copyButtons = containerElement.querySelectorAll('.code-copy-btn');
            copyButtons.forEach(btn => {
                if (btn.dataset.bound) return; // 避免重复绑定
                btn.dataset.bound = 'true';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const codeBlock = btn.closest('.code-block-wrapper');
                    const codeElement = codeBlock?.querySelector('code');
                    const codeText = getCodeBlockRawText(codeBlock, codeElement);
                    navigator.clipboard.writeText(codeText).then(() => {
                        btn.textContent = '已复制';
                        btn.classList.add('copied');
                        setTimeout(() => {
                            btn.textContent = '复制';
                            btn.classList.remove('copied');
                        }, 2000);
                    }).catch(err => {
                        console.error('复制失败:', err);
                        showToast('复制失败', 'error');
                    });
                });
            });

            // 绑定填充到翻译按钮
            const fillButtons = containerElement.querySelectorAll('.code-fill-btn');
            fillButtons.forEach(btn => {
                if (btn.dataset.bound) return; // 避免重复绑定
                btn.dataset.bound = 'true';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const codeBlock = btn.closest('.code-block-wrapper');
                    const codeElement = codeBlock?.querySelector('code');
                    const codeText = getCodeBlockRawText(codeBlock, codeElement);
                    const targetTextarea = document.querySelector('textarea.translation.form-control');
                    if (targetTextarea) {
                        simulateInputChange(targetTextarea, codeText);
                        showToast('已填充到翻译框', 'success');
                    } else {
                        showToast('未找到翻译输入框', 'error');
                    }
                });
            });
        }

        loadChatHistory() {
            try {
                const raw = localStorage.getItem(this.chatHistoryStorageKey);
                if (!raw) return [];
                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) return [];
                return parsed.filter(m => m && typeof m.role === 'string' && typeof m.content === 'string');
            } catch (e) {
                console.warn('[ParaTranz-AI] 无法加载 AI 聊天历史：', e);
                return [];
            }
        }

        saveChatHistory() {
            try {
                const trimmed = this.chatHistory.slice(-this.chatHistoryLimit * 2);
                localStorage.setItem(this.chatHistoryStorageKey, JSON.stringify(trimmed));
            } catch (e) {
                console.warn('[ParaTranz-AI] 无法保存 AI 聊天历史：', e);
            }
        }

        appendToHistory(userContent, assistantContent) {
            if (userContent) {
                this.chatHistory.push({ role: 'user', content: userContent });
            }
            if (assistantContent) {
                this.chatHistory.push({ role: 'assistant', content: assistantContent });
            }
            if (this.chatHistory.length > this.chatHistoryLimit * 2) {
                this.chatHistory = this.chatHistory.slice(-this.chatHistoryLimit * 2);
            }
            this.saveChatHistory();
        }

        renderChatHistory() {
            const messagesContainer = document.getElementById(this.messagesContainerId);
            if (!messagesContainer) return;
            messagesContainer.innerHTML = '';

            if (!this.chatHistory || this.chatHistory.length === 0) {
                this.displayMessage('你好！有什么可以帮你的吗？', 'ai');
                return;
            }

            this.chatHistory.forEach(msg => {
                if (!msg || typeof msg.content !== 'string') return;
                if (msg.role === 'assistant') {
                    this.displayMessage(msg.content, 'ai');
                } else if (msg.role === 'user') {
                    this.displayMessage(msg.content, 'user');
                }
            });
        }

        clearHistoryStorage() {
            this.chatHistory = [];
            try {
                localStorage.removeItem(this.chatHistoryStorageKey);
            } catch (e) {
                // ignore
            }
        }

        clearChatHistory() {
            this.clearHistoryStorage();
            this.renderChatHistory();
        }

        async sendMessage() {
            const inputArea = document.getElementById(this.inputAreaId);
            const sendButton = document.getElementById(this.sendButtonId);
            if (!inputArea || !sendButton) return;

            const messageText = inputArea.value.trim();
            if (!messageText) return;

            this.displayMessage(messageText, 'user');
            inputArea.value = '';
            // Reset textarea height after sending
            inputArea.style.height = 'auto';
            inputArea.style.height = (inputArea.scrollHeight < 40 ? 40 : inputArea.scrollHeight) + 'px';
            if (parseInt(inputArea.style.height, 10) > parseInt(window.getComputedStyle(inputArea).maxHeight, 10)) {
                inputArea.style.height = window.getComputedStyle(inputArea).maxHeight;
                inputArea.style.overflowY = 'auto';
            } else {
                inputArea.style.overflowY = 'hidden';
            }
            inputArea.disabled = true;
            sendButton.disabled = true;

            // Display "Thinking..." and get the message element
            let aiMessageElement = this.displayMessage('思考中...', 'ai');
            const messagesContainerElement = document.getElementById(this.messagesContainerId);
            let fullResponseText = '';

            try {
                fullResponseText = await this.chatWithAI(messageText, (currentText) => {
                    fullResponseText = currentText || '';
                    if (aiMessageElement) {
                        this.updateAIMessage(aiMessageElement, fullResponseText);
                        aiMessageElement.classList.remove('error');
                    }
                });

                if (!fullResponseText && aiMessageElement && aiMessageElement.textContent === '思考中...') {
                    aiMessageElement.classList.add('error');
                    aiMessageElement.textContent = 'AI 未返回任何内容。';
                }

                if (fullResponseText) {
                    this.appendToHistory(messageText, fullResponseText);
                }
            } catch (error) {
                console.error('AI Chat Error:', error);
                const errText = `抱歉，与 AI 通信时出错: ${error.message}`;
                if (aiMessageElement && messagesContainerElement) { // Ensure element exists
                    if (aiMessageElement.textContent === '思考中...') {
                        aiMessageElement.classList.add('error');
                        aiMessageElement.textContent = errText;
                    } else {
                        this.displayMessage(errText, 'ai', true);
                    }
                } else { // Fallback if aiMessageElement somehow isn't there
                    this.displayMessage(errText, 'ai', true);
                }
            } finally {
                inputArea.disabled = false;
                sendButton.disabled = false;
                inputArea.focus();
            }
        }

        // Modified chat function to support streaming
        async fetchModelsAndUpdateDatalistForChat() {
            const modelMenu = document.getElementById(`${this.aiChatModelSelectId}_menu`);
            const modelInput = document.getElementById(this.aiChatModelInputId);
            const fetchButton = document.getElementById(this.fetchAiChatModelsButtonId);
            const originalButtonHtml = fetchButton.innerHTML;
            fetchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            fetchButton.disabled = true;

            let API_SECRET_KEY = '';
            let BASE_URL = '';
            const currentConfigName = getCurrentApiConfigName();
            let activeConfig = null;

            if (currentConfigName) {
                const configs = getApiConfigurations();
                activeConfig = configs.find(c => c.name === currentConfigName);
            }

            if (activeConfig) {
                BASE_URL = activeConfig.baseUrl;
                API_SECRET_KEY = activeConfig.apiKey;
            } else {
                showToast('请先在“机器翻译”配置中选择一个有效的 API 配置。', 'error', 5000);
                fetchButton.innerHTML = originalButtonHtml;
                fetchButton.disabled = false;
                return;
            }

            if (!BASE_URL || !API_SECRET_KEY) {
                showToast('当前选中的 API 配置缺少 Base URL 或 API Key。', 'error', 5000);
                fetchButton.innerHTML = originalButtonHtml;
                fetchButton.disabled = false;
                return;
            }

            const modelsUrl = `${BASE_URL}${BASE_URL.endsWith('/') ? '' : '/'}models`;

            try {
                const response = await fetch(modelsUrl, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${API_SECRET_KEY}` }
                });
                if (!response.ok) {
                    const errorData = await response.text();
                    showToast(`为AI助手获取模型列表失败: ${response.status} - ${errorData.substring(0,100)}`, 'error', 5000);
                    return;
                }
                const data = await response.json();
                if (data && data.data && Array.isArray(data.data)) {
                    modelMenu.innerHTML = ''; // Clear existing options
                    data.data.forEach(model => {
                        if (model.id) {
                            const item = document.createElement('a');
                            item.className = 'dropdown-item';
                            item.href = '#';
                            item.textContent = model.id;
                            item.addEventListener('click', (e) => {
                                e.preventDefault();
                                modelInput.value = model.id;
                                localStorage.setItem(this.localStorageKeyAiChatModel, model.id);
                                modelMenu.classList.remove('show');
                            });
                            modelMenu.appendChild(item);
                        }
                    });
                    showToast('AI助手模型列表已更新。', 'success');
                } else {
                    showToast('AI助手模型列表响应数据格式不符合预期。', 'warning', 4000);
                }
            } catch (error) {
                showToast(`为AI助手获取模型列表时发生网络错误: ${error.message}`, 'error', 5000);
            } finally {
                fetchButton.innerHTML = originalButtonHtml;
                fetchButton.disabled = false;
            }
        }

        async chatWithAI(userMessage, onTextUpdated) {
            let API_SECRET_KEY = '';
            let BASE_URL = '';

            const currentConfigName = getCurrentApiConfigName(); // This is the translation config
            let activeTranslationConfig = null;
            if (currentConfigName) {
                const configs = getApiConfigurations();
                activeTranslationConfig = configs.find(c => c.name === currentConfigName);
            }

            // Get AI Chat specific model.
            // Priority: 1. localStorageKeyAiChatModel, 2. activeTranslationConfig.model, 3. 'gpt-4o-mini'
            let model = localStorage.getItem(this.localStorageKeyAiChatModel);
            if (!model && activeTranslationConfig && activeTranslationConfig.model) {
                model = activeTranslationConfig.model;
            }
            if (!model) {
                model = 'gpt-4o-mini'; // Ultimate fallback
            }

            let temperature = 0.7; // Default temperature for chat
            let systemPrompt = `你是一个在 Paratranz 翻译平台工作的 AI 助手。请根据用户的问题，结合当前条目的原文、上下文、术语等信息（如果提供），提供翻译建议、解释或回答相关问题。请保持回答简洁明了。`;

            if (activeTranslationConfig) {
                BASE_URL = activeTranslationConfig.baseUrl;
                API_SECRET_KEY = activeTranslationConfig.apiKey;
                temperature = (activeTranslationConfig.temperature !== undefined && activeTranslationConfig.temperature !== '')
                              ? parseFloat(activeTranslationConfig.temperature)
                              : temperature;
            } else {
                console.warn("AI Chat: No active API configuration selected for API credentials. Chat might fail.");
                // Attempt to use fallback keys if absolutely necessary, but ideally user should configure
                BASE_URL = localStorage.getItem('baseUrl_fallback_for_translate') || '';
                API_SECRET_KEY = localStorage.getItem('apiKey_fallback_for_translate') || '';
            }

            if (!BASE_URL || !API_SECRET_KEY) {
                throw new Error("API Base URL 或 Key 未配置。请在“机器翻译”配置中设置。");
            }

            // --- Context Gathering (Optional but Recommended) ---
            let contextInfo = "";
            const shouldSendContext = localStorage.getItem(this.localStorageKeySendContext) === 'true';

            if (shouldSendContext) {
                try {
                    const originalDiv = document.querySelector('.original.well');
                    if (originalDiv) contextInfo += `当前原文 (Original Text):\n${originalDiv.innerText.trim()}\n\n`;

                    const currentTranslationTextarea = document.querySelector('textarea.translation.form-control');
                    if (currentTranslationTextarea && currentTranslationTextarea.value.trim()) {
                        contextInfo += `当前翻译 (Current Translation):\n${currentTranslationTextarea.value.trim()}\n\n`;
                    }

                    const contextNoteDiv = document.querySelector('.context .well');
                    if (contextNoteDiv) contextInfo += `上下文注释 (Context Note):\n${contextNoteDiv.innerText.trim()}\n\n`;

                    const terms = await getTermsData(); // Reuse existing function
                    if (terms.length > 0) {
                        contextInfo += `相关术语 (Terms):\n${terms.map(t => `${t.source} -> ${t.target}${t.note ? ` (${t.note})` : ''}`).join('\n')}\n\n`;
                    }
                } catch (e) {
                    console.warn("AI Chat: Error gathering context:", e);
                }
            }
            // --- End Context Gathering ---

            const messages = [
                { role: "system", content: systemPrompt }
            ];

            // Attach previous chat history (multi-turn)
            if (this.chatHistory && this.chatHistory.length > 0) {
                const historyToSend = this.chatHistory.slice(-this.chatHistoryLimit * 2);
                historyToSend.forEach(msg => {
                    if (msg && typeof msg.role === 'string' && typeof msg.content === 'string') {
                        messages.push({ role: msg.role, content: msg.content });
                    }
                });
            }

            const finalUserContent = contextInfo
                ? `请参考以下上下文信息：\n${contextInfo}我的问题是：\n${userMessage}`
                : userMessage;

            messages.push({ role: "user", content: finalUserContent });

            const requestBody = { model, temperature, messages, stream: true }; // Enable streaming

            const response = await fetch(`${BASE_URL}${BASE_URL.endsWith('/') ? '' : '/'}chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET_KEY}` },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                let errorData;
                try { errorData = await response.json(); } catch (e) { /* ignore parsing error for non-json errors */ }
                console.error('AI Chat API Error:', errorData || response.statusText);
                throw new Error(`API 请求失败: ${response.status} - ${errorData?.error?.message || errorData?.message || response.statusText}`);
            }

            if (!response.body) {
                throw new Error('ReadableStream not available in response.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullText = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    let eolIndex;
                    while ((eolIndex = buffer.indexOf('\n')) >= 0) {
                        const line = buffer.substring(0, eolIndex).trim();
                        buffer = buffer.substring(eolIndex + 1);

                        if (line.startsWith('data: ')) {
                            const jsonData = line.substring(6);
                            if (jsonData === '[DONE]') {
                                console.log("Stream finished.");
                                if (typeof onTextUpdated === 'function') {
                                    onTextUpdated(fullText);
                                }
                                return fullText; // Stream ended
                            }
                            try {
                                const parsed = JSON.parse(jsonData);
                                if (parsed.choices && parsed.choices[0]?.delta?.content) {
                                    fullText += parsed.choices[0].delta.content;
                                    if (typeof onTextUpdated === 'function') {
                                        onTextUpdated(fullText);
                                    }
                                }
                            } catch (e) {
                                console.error('Error parsing stream JSON:', e, jsonData);
                            }
                        }
                    }
                }
                // Process any remaining buffer content if necessary (though for SSE, lines usually end with \n)
                const trimmed = buffer.trim();
                if (trimmed.startsWith('data: ')) {
                    const jsonData = trimmed.substring(6);
                    if (jsonData !== '[DONE]') {
                        try {
                            const parsed = JSON.parse(jsonData);
                            if (parsed.choices && parsed.choices[0]?.delta?.content) {
                                fullText += parsed.choices[0].delta.content;
                            }
                        } catch (e) {
                            console.error('Error parsing final buffer JSON:', e, jsonData);
                        }
                    }
                }

                if (typeof onTextUpdated === 'function') {
                    onTextUpdated(fullText);
                }
                return fullText;
            } catch (error) {
                console.error('Error reading stream:', error);
                throw new Error(`读取流时出错: ${error.message}`);
            } finally {
                reader.releaseLock();
            }
        }
    }

    // --- Initialization ---
    const aiChatDialog = new AIChatDialog(); // Initialize AI Chat Dialog

    // 全局快捷键：在 AI 聊天输入框内屏蔽宿主页面快捷键，并支持 Enter 发送 / Shift+Enter 换行
    window.addEventListener('keydown', function(e) {
        try {
            const active = document.activeElement;
            if (!active || active.id !== aiChatDialog.inputAreaId) return;

            if (e.key === 'Enter') {
                if (e.shiftKey) {
                    // 新行，不触发宿主快捷键
                    e.stopPropagation();
                    return;
                }
                // 回车发送消息，阻止宿主快捷键
                e.preventDefault();
                e.stopPropagation();
                aiChatDialog.sendMessage();
            } else {
                // 在聊天输入框内的其他按键也不应触发宿主快捷键
                e.stopPropagation();
            }
        } catch (err) {
            console.error('[ParaTranz-AI] 全局键盘事件处理失败:', err);
        }
    }, true);

    document.addEventListener('keydown', function(e) {
        const activeElement = document.activeElement;
        const isTyping = activeElement && (activeElement.isContentEditable || activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');

        // Ctrl + Alt + D to open diff modal
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd' && !isTyping) {
            e.preventDefault();
            diffModal.show();
        }
    });
})();
