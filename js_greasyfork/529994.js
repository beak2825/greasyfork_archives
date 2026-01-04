// ==UserScript==
// @name         网页元素屏蔽器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  屏蔽任意网站上的元素，支持缩略图记录和正则/简单模式屏蔽，新增动态屏蔽
// @author       JerryChiang
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529994/%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529994/%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .highlight {
            outline: 2px solid red !important;
            background-color: rgba(255, 0, 0, 0.1) !important;
        }
        .blocker-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            border-radius: 8px;
            font-family: Arial, sans-serif;
            width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }
        .blocker-popup p {
            margin: 0 0 10px;
            font-size: 16px;
            color: #333;
        }
        .blocker-popup button {
            margin: 5px;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        }
        .blocker-popup button:hover {
            opacity: 0.9;
        }
        #static-block {
            background-color: #007bff;
            color: white;
        }
        #dynamic-block {
            background-color: #28a745;
            color: white;
        }
        #preview {
            background-color: #17a2b8;
            color: white;
        }
        #cancel {
            background-color: #dc3545;
            color: white;
        }
        .blocker-popup input, .blocker-popup select {
            margin: 5px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        .rule-row {
            display: flex;
            align-items: center;
            margin: 5px 0;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .blocker-list {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            z-index: 9999;
            max-height: 80vh;
            overflow-y: auto;
            width: 500px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        .blocker-list h3 {
            margin: 0 0 15px;
            font-size: 18px;
            color: #333;
        }
        .blocker-list ul {
            list-style: none;
            padding: 0;
        }
        .blocker-list li {
            margin: 10px 0;
            display: flex;
            align-items: center;
            width: 100%;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .blocker-list img {
            max-width: 400px;
            max-height: 100px;
            object-fit: contain;
            border: 1px solid #ddd;
            flex-shrink: 0;
        }
        .blocker-list button {
            margin-left: auto;
            flex-shrink: 0;
            padding: 5px 10px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .blocker-list button:hover {
            background-color: #c82333;
        }
    `;
    document.head.appendChild(style);

    // 注册菜单
    GM_registerMenuCommand('手动屏蔽', startBlockingMode);
    GM_registerMenuCommand('按规则屏蔽', showRegexBlockInput);
    GM_registerMenuCommand('查看屏蔽记录', showBlockList);
    GM_registerMenuCommand('清除当前域名屏蔽规则（点击后需要快速点击回车）', clearDomainBlocks);

    // 进入元素选择模式
    function startBlockingMode() {
        document.body.addEventListener('mouseover', highlightElement);
        document.body.addEventListener('click', selectElement, true);
    }

    // 高亮悬停元素
    function highlightElement(event) {
        if (window.lastHighlighted) {
            window.lastHighlighted.classList.remove('highlight');
        }
        event.target.classList.add('highlight');
        window.lastHighlighted = event.target;
    }

    // 选择元素并弹出确认窗口
    function selectElement(event) {
        event.preventDefault();
        event.stopPropagation();

        document.body.removeEventListener('mouseover', highlightElement);
        document.body.removeEventListener('click', selectElement, true);

        const selectedElement = event.target;
        window.lastHighlighted.classList.remove('highlight');
        showConfirmation(selectedElement);
    }

    // 显示确认弹窗
    function showConfirmation(element) {
        const popup = document.createElement('div');
        popup.className = 'blocker-popup';
        popup.innerHTML = `
            <p>选择屏蔽方式：</p>
            <button id="static-block">静态屏蔽</button>
            <button id="dynamic-block">动态屏蔽</button>
            <button id="preview">预览</button>
            <button id="cancel">取消</button>
        `;
        document.body.appendChild(popup);

        let isPreviewHidden = false;

        const staticBtn = document.getElementById('static-block');
        staticBtn.addEventListener('click', async () => {
            staticBtn.disabled = true;
            try {
                await saveBlockWithThumbnail(element, 'static');
                element.style.display = 'none';
                document.body.removeChild(popup);
            } catch (e) {
                console.error('静态屏蔽失败:', e);
                staticBtn.disabled = false;
            }
        }, { once: true });

        const dynamicBtn = document.getElementById('dynamic-block');
        dynamicBtn.addEventListener('click', async () => {
            dynamicBtn.disabled = true;
            try {
                await saveBlockWithThumbnail(element, 'dynamic');
                applyDynamicBlocks();
                document.body.removeChild(popup);
            } catch (e) {
                console.error('动态屏蔽失败:', e);
                dynamicBtn.disabled = false;
            }
        }, { once: true });

        document.getElementById('preview').addEventListener('click', () => {
            if (!isPreviewHidden) {
                element.style.display = 'none';
                isPreviewHidden = true;
            } else {
                element.style.display = '';
                isPreviewHidden = false;
            }
        });

        document.getElementById('cancel').addEventListener('click', () => {
            document.body.removeChild(popup);
        });
    }

    // 保存屏蔽信息并生成缩略图
    async function saveBlockWithThumbnail(element, type = 'static') {
        const domain = window.location.hostname;
        const selector = getSelector(element);

        const rect = element.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        let thumbnail = null;
        try {
            const computedStyle = window.getComputedStyle(element);
            ctx.fillStyle = computedStyle.backgroundColor || '#ffffff';
            ctx.fillRect(0, 0, width, height);
            if (element.textContent.trim()) {
                ctx.fillStyle = computedStyle.color || '#000000';
                ctx.font = `${computedStyle.fontSize || '16px'} ${computedStyle.fontFamily || 'Arial'}`;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                const paddingLeft = parseInt(computedStyle.paddingLeft) || 0;
                const paddingTop = parseInt(computedStyle.paddingTop) || 0;
                wrapText(ctx, element.textContent.trim(), paddingLeft, paddingTop, width - paddingLeft * 2, parseInt(computedStyle.fontSize) || 16);
            }
            let scale = Math.min(400 / width, 100 / height, 1);
            const thumbnailCanvas = document.createElement('canvas');
            thumbnailCanvas.width = width * scale;
            thumbnailCanvas.height = height * scale;
            const thumbnailCtx = thumbnailCanvas.getContext('2d');
            thumbnailCtx.drawImage(canvas, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
            thumbnail = thumbnailCanvas.toDataURL('image/png');
        } catch (e) {
            console.error('生成缩略图失败:', e);
        }

        if (type === 'static') {
            let blocks = GM_getValue('blocks', {});
            if (!blocks[domain]) blocks[domain] = [];
            if (!blocks[domain].some(item => item.selector === selector)) {
                blocks[domain].push({ selector, thumbnail: thumbnail || null, type: 'static' });
                GM_setValue('blocks', blocks);
            }
        } else if (type === 'dynamic') {
            const className = element.className.split(' ').filter(c => c)[0] || '';
            let dynamicBlocks = GM_getValue('dynamicBlocks', {});
            if (!dynamicBlocks[domain]) dynamicBlocks[domain] = [];
            if (!dynamicBlocks[domain].some(item => item.className === className)) {
                dynamicBlocks[domain].push({ className, thumbnail: thumbnail || null, type: 'dynamic' });
                GM_setValue('dynamicBlocks', dynamicBlocks);
            }
        }
        return true;
    }

    // 辅助函数：将文本换行绘制到 canvas
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, x, currentY);
                line = words[i] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    }

    // 生成简单 CSS 选择器
    function getSelector(element) {
        if (element.id) return `#${element.id}`;
        let path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.tagName.toLowerCase();
            if (element.className && typeof element.className === 'string') {
                selector += '.' + element.className.trim().replace(/\s+/g, '.');
            }
            path.unshift(selector);
            element = element.parentElement;
        }
        return path.join(' > ');
    }

    // 应用屏蔽规则（静态 + 动态 + 正则）
    function applyBlocks() {
        const domain = window.location.hostname;
        const blocks = GM_getValue('blocks', {});
        const dynamicBlocks = GM_getValue('dynamicBlocks', {});
        const regexBlocks = GM_getValue('regexBlocks', {});

        // 应用静态屏蔽
        if (blocks[domain]) {
            blocks[domain].forEach(item => {
                try {
                    document.querySelectorAll(item.selector).forEach(el => {
                        if (!el.closest('.blocker-popup') && !el.closest('.blocker-list')) {
                            el.style.display = 'none';
                        }
                    });
                } catch (e) {
                    console.error(`无法应用选择器: ${item.selector}`, e);
                }
            });
        }

        // 应用动态屏蔽
        if (dynamicBlocks[domain]) {
            dynamicBlocks[domain].forEach(rule => {
                const elements = document.getElementsByClassName(rule.className);
                Array.from(elements).forEach(el => {
                    if (!el.closest('.blocker-popup') && !el.closest('.blocker-list')) {
                        el.style.display = 'none';
                    }
                });
            });
        }

        // 应用正则屏蔽
        if (regexBlocks[domain]) {
            regexBlocks[domain].forEach(rule => {
                try {
                    const regex = new RegExp(rule.regex);
                    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                        acceptNode: (node) => {
                            const parent = node.parentElement;
                            return (parent && (parent.closest('.blocker-popup') || parent.closest('.blocker-list')))
                                ? NodeFilter.FILTER_REJECT
                                : NodeFilter.FILTER_ACCEPT;
                        }
                    }, false);
                    let node;
                    while (node = walker.nextNode()) {
                        if (regex.test(node.textContent)) {
                            let element = node.parentElement;
                            for (let i = 0; i < rule.level; i++) {
                                if (element.parentElement) element = element.parentElement;
                                else break;
                            }
                            element.style.display = 'none';
                        }
                    }
                } catch (e) {
                    console.error(`无法应用规则: ${rule.regex}`, e);
                }
            });
        }
    }

    // 应用动态屏蔽（独立函数已无必要，保留为空兼容旧调用）
    function applyDynamicBlocks() {
        applyBlocks(); // 直接调用统一应用函数
    }

    // 显示屏蔽记录窗口
    function showBlockList() {
        const domain = window.location.hostname;
        const blocks = GM_getValue('blocks', {});
        const dynamicBlocks = GM_getValue('dynamicBlocks', {});
        const blockList = (blocks[domain] || []).concat(dynamicBlocks[domain] || []);

        const listWindow = document.createElement('div');
        listWindow.className = 'blocker-list';
        listWindow.innerHTML = `
            <h3>当前域名屏蔽记录 (${domain})</h3>
            <ul id="block-items"></ul>
            <button id="close-list">关闭</button>
        `;
        document.body.appendChild(listWindow);

        const ul = document.getElementById('block-items');
        if (blockList.length === 0) {
            ul.innerHTML = '<li>暂无屏蔽记录</li>';
        } else {
            blockList.forEach((item, index) => {
                const li = document.createElement('li');
                if (item.thumbnail) {
                    const img = document.createElement('img');
                    img.src = item.thumbnail;
                    li.appendChild(img);
                } else {
                    li.textContent = item.type === 'static' ? item.selector : item.className;
                }
                const unblockBtn = document.createElement('button');
                unblockBtn.textContent = '取消屏蔽';
                unblockBtn.addEventListener('click', () => {
                    removeBlock(domain, index, item.type);
                    listWindow.remove();
                    applyBlocks();
                    showBlockList();
                });
                li.appendChild(unblockBtn);
                ul.appendChild(li);
            });
        }

        document.getElementById('close-list').addEventListener('click', () => {
            document.body.removeChild(listWindow);
        });
    }

    // 删除屏蔽记录
    function removeBlock(domain, index, type) {
        if (type === 'static') {
            let blocks = GM_getValue('blocks', {});
            if (blocks[domain] && blocks[domain][index]) {
                blocks[domain].splice(index, 1);
                if (blocks[domain].length === 0) delete blocks[domain];
                GM_setValue('blocks', blocks);
            }
        } else if (type === 'dynamic') {
            let dynamicBlocks = GM_getValue('dynamicBlocks', {});
            const staticCount = (GM_getValue('blocks', {})[domain] || []).length;
            const dynamicIndex = index - staticCount;
            if (dynamicBlocks[domain] && dynamicBlocks[domain][dynamicIndex]) {
                dynamicBlocks[domain].splice(dynamicIndex, 1);
                if (dynamicBlocks[domain].length === 0) delete dynamicBlocks[domain];
                GM_setValue('dynamicBlocks', dynamicBlocks);
            }
        }
    }

    // 显示规则屏蔽输入和管理窗口
    function showRegexBlockInput() {
        const domain = window.location.hostname;
        let regexBlocks = GM_getValue('regexBlocks', {});
        let rules = regexBlocks[domain] || [];

        const popup = document.createElement('div');
        popup.className = 'blocker-popup';
        popup.innerHTML = `
            <p>设置屏蔽规则（层级：0 表示当前元素，1 表示父元素，依此类推，请先点击预览，避免失误将整个页面清除）：</p>
            <button id="regex-mode">正则模式</button>
            <button id="simple-mode">简单模式</button>
            <div id="input-container"></div>
            <div id="rules-list">
                <h3>当前规则列表</h3>
                <div id="rules-rows"></div>
            </div>
            <div>
                <button id="add-rule-row">新增规则</button>
                <button id="save-rules">保存</button>
                <button id="cancel-rule">取消</button>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('regex-mode').style.backgroundColor = '#007bff';
        document.getElementById('regex-mode').style.color = 'white';
        document.getElementById('simple-mode').style.backgroundColor = '#007bff';
        document.getElementById('simple-mode').style.color = 'white';
        document.getElementById('add-rule-row').style.backgroundColor = '#17a2b8';
        document.getElementById('add-rule-row').style.color = 'white';
        document.getElementById('save-rules').style.backgroundColor = '#17a2b8';
        document.getElementById('save-rules').style.color = 'white';
        document.getElementById('cancel-rule').style.backgroundColor = '#dc3545';
        document.getElementById('cancel-rule').style.color = 'white';

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        popup.addEventListener('mousedown', (e) => {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
                isDragging = true;
                initialX = e.clientX - currentX;
                initialY = e.clientY - currentY;
                popup.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                popup.style.left = `${currentX + (popup.offsetWidth / 2)}px`;
                popup.style.top = `${currentY + (popup.offsetHeight / 2)}px`;
                popup.style.transform = 'none';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            popup.style.cursor = 'default';
        });

        currentX = window.innerWidth / 2 - popup.offsetWidth / 2;
        currentY = window.innerHeight / 2 - popup.offsetHeight / 2;
        popup.style.left = `${currentX + (popup.offsetWidth / 2)}px`;
        popup.style.top = `${currentY + (popup.offsetHeight / 2)}px`;

        const inputContainer = document.getElementById('input-container');
        const rulesRows = document.getElementById('rules-rows');
        let isSimpleMode = false;
        let tempRules = [...rules];

        function showRegexInput() {
            inputContainer.innerHTML = `
                <div class="rule-row">
                    <input type="text" class="regex-input" placeholder="正则规则" />
                    <input type="number" class="level-input" placeholder="层级" value="0" min="0" />
                    <button class="preview-rule">预览</button>
                </div>
            `;
            document.querySelector('.preview-rule').style.backgroundColor = '#28a745';
            document.querySelector('.preview-rule').style.color = 'white';
            attachPreviewListeners();
        }

        function showSimpleInput() {
            inputContainer.innerHTML = `
                <div class="rule-row">
                    <select class="logic-select">
                        <option value="contains">包含</option>
                        <option value="not-contains">不包含</option>
                        <option value="equals">等于</option>
                    </select>
                    <input type="text" class="simple-input" placeholder="文本内容" />
                    <input type="number" class="level-input" placeholder="层级" value="0" min="0" />
                    <button class="preview-rule">预览</button>
                </div>
            `;
            document.querySelector('.preview-rule').style.backgroundColor = '#28a745';
            document.querySelector('.preview-rule').style.color = 'white';
            attachPreviewListeners();
        }

        document.getElementById('regex-mode').addEventListener('click', () => {
            isSimpleMode = false;
            showRegexInput();
        });
        document.getElementById('simple-mode').addEventListener('click', () => {
            isSimpleMode = true;
            showSimpleInput();
        });

        showRegexInput();

        function renderRules() {
            rulesRows.innerHTML = '';
            if (tempRules.length === 0) {
                rulesRows.innerHTML = '<p>暂无规则</p>';
                return;
            }
            tempRules.forEach((rule, index) => {
                const row = document.createElement('div');
                row.className = 'rule-row';
                row.innerHTML = `
                    <input type="text" class="rule-regex" value="${rule.regex}" />
                    <input type="number" class="rule-level" value="${rule.level}" min="0" />
                    <button class="delete-rule">删除</button>
                `;
                const regexInput = row.querySelector('.rule-regex');
                const levelInput = row.querySelector('.rule-level');
                const deleteBtn = row.querySelector('.delete-rule');

                regexInput.addEventListener('input', () => {
                    tempRules[index].regex = regexInput.value;
                });
                levelInput.addEventListener('input', () => {
                    tempRules[index].level = parseInt(levelInput.value, 10);
                });

                deleteBtn.addEventListener('click', () => {
                    tempRules.splice(index, 1);
                    renderRules();
                });

                rulesRows.appendChild(row);
            });
        }

        document.getElementById('add-rule-row').addEventListener('click', () => {
            let regex, level;
            if (isSimpleMode) {
                const logic = inputContainer.querySelector('.logic-select').value;
                const text = inputContainer.querySelector('.simple-input').value.trim();
                level = parseInt(inputContainer.querySelector('.level-input').value, 10);
                if (!text || isNaN(level) || level < 0) {
                    alert('请输入有效的文本和层级');
                    return;
                }
                regex = convertSimpleToRegex(logic, text);
            } else {
                regex = inputContainer.querySelector('.regex-input').value.trim();
                level = parseInt(inputContainer.querySelector('.level-input').value, 10);
                if (!regex || isNaN(level) || level < 0) {
                    alert('请输入有效的正则规则和层级');
                    return;
                }
            }
            tempRules.push({ regex, level });
            renderRules();
            if (isSimpleMode) {
                inputContainer.querySelector('.simple-input').value = '';
                inputContainer.querySelector('.level-input').value = '0';
            } else {
                inputContainer.querySelector('.regex-input').value = '';
                inputContainer.querySelector('.level-input').value = '0';
            }
        });

        document.getElementById('save-rules').addEventListener('click', () => {
            regexBlocks[domain] = tempRules;
            GM_setValue('regexBlocks', regexBlocks);
            applyBlocks();
            document.body.removeChild(popup);
        });

        document.getElementById('cancel-rule').addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        function convertSimpleToRegex(logic, text) {
            const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            switch (logic) {
                case 'contains': return `.*${escapedText}.*`;
                case 'not-contains': return `^(?!.*${escapedText}).*$`;
                case 'equals': return `^${escapedText}$`;
                default: return escapedText;
            }
        }

        function attachPreviewListeners() {
            const previewBtn = inputContainer.querySelector('.preview-rule');
            let previewActive = false;
            let affectedElements = [];

            previewBtn.addEventListener('click', () => {
                if (!previewActive) {
                    let regex, level;
                    if (isSimpleMode) {
                        const logic = inputContainer.querySelector('.logic-select').value;
                        const text = inputContainer.querySelector('.simple-input').value.trim();
                        level = parseInt(inputContainer.querySelector('.level-input').value, 10);
                        if (!text || isNaN(level) || level < 0) {
                            alert('请输入有效的文本和层级');
                            return;
                        }
                        regex = convertSimpleToRegex(logic, text);
                    } else {
                        regex = inputContainer.querySelector('.regex-input').value.trim();
                        level = parseInt(inputContainer.querySelector('.level-input').value, 10);
                        if (!regex || isNaN(level) || level < 0) {
                            alert('请输入有效的正则规则和层级');
                            return;
                        }
                    }
                    try {
                        const ruleRegex = new RegExp(regex);
                        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                            acceptNode: (node) => {
                                const parent = node.parentElement;
                                return (parent && (parent.closest('.blocker-popup') || parent.closest('.blocker-list')))
                                    ? NodeFilter.FILTER_REJECT
                                    : NodeFilter.FILTER_ACCEPT;
                            }
                        }, false);
                        let node;
                        affectedElements = [];
                        while (node = walker.nextNode()) {
                            if (ruleRegex.test(node.textContent)) {
                                let element = node.parentElement;
                                for (let i = 0; i < level; i++) {
                                    if (element.parentElement) element = element.parentElement;
                                    else break;
                                }
                                affectedElements.push(element);
                                element.style.display = 'none';
                            }
                        }
                        previewActive = true;
                        previewBtn.textContent = '取消预览';
                    } catch (e) {
                        alert('正则表达式无效，请检查输入');
                    }
                } else {
                    affectedElements.forEach(el => el.style.display = '');
                    affectedElements = [];
                    previewActive = false;
                    previewBtn.textContent = '预览';
                }
            });
        }

        renderRules();
    }

    // 清除当前域名屏蔽规则
    function clearDomainBlocks() {
        const domain = window.location.hostname;
        if (window.confirm(`是否确认清除当前域名 (${domain}) 下的所有屏蔽规则？`)) {
            let blocks = GM_getValue('blocks', {});
            let dynamicBlocks = GM_getValue('dynamicBlocks', {});
            let regexBlocks = GM_getValue('regexBlocks', {});

            delete blocks[domain];
            delete dynamicBlocks[domain];
            delete regexBlocks[domain];

            GM_setValue('blocks', blocks);
            GM_setValue('dynamicBlocks', dynamicBlocks);
            GM_setValue('regexBlocks', regexBlocks);

            // 刷新页面以恢复显示
            window.location.reload();
        }
    }

    // 页面加载时立即应用所有屏蔽规则
    applyBlocks();
    const observer = new MutationObserver(() => applyBlocks());
    observer.observe(document.body, { childList: true, subtree: true });
})();