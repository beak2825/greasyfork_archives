// ==UserScript==
// @name         自动转换 ed2k 和磁力链接并一键复制
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  自动检测网页中的所有 ed2k 和磁力链接并将其转换为可点击的超链接，同时提供一键复制所有链接的功能，并支持排除指定网址。
// @author       98-liu**
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/525698/%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%20ed2k%20%E5%92%8C%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%B9%B6%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/525698/%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%20ed2k%20%E5%92%8C%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%B9%B6%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EXCLUDE_KEY = 'excludedUrls';
    const COPY_BUTTON_POSITION_KEY = 'copyButtonPosition';
    const CONFIG_BUTTON_POSITION_KEY = 'configButtonPosition';
    const TOGGLE_BUTTONS_POSITION_KEY = 'toggleButtonsPosition';
    const COPY_BUTTON_VISIBLE_KEY = 'copyButtonVisible';
    const CONFIG_BUTTON_VISIBLE_KEY = 'configButtonVisible';

    // 检查当前页面是否在排除列表中
    function isExcluded(url) {
        const excludedUrls = GM_getValue(EXCLUDE_KEY, []);
        for (const pattern of excludedUrls) {
            if (new RegExp(pattern).test(url)) {
                return true;
            }
        }
        return false;
    }

    // 自动检测并转换 ed2k 和磁力链接为超链接
    function convertLinks() {
        if (isExcluded(window.location.href)) return;

        // 正则表达式匹配 ed2k 链接
        const ed2kRegex = /ed2k:\/\/\|file\|[^\|]+\|\d+\|[a-fA-F0-9]+\|\//g;
        // 正则表达式匹配磁力链接
        const magnetRegex = /magnet:\?xt=urn:[a-zA-Z0-9:.&=]+/g;

        // 遍历网页中的所有文本节点
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while (node = walker.nextNode()) {
            if (node.nodeValue.match(ed2kRegex) || node.nodeValue.match(magnetRegex)) {
                const parent = node.parentNode;

                // 避免重复处理（如果已经是超链接则跳过）
                if (parent.tagName !== 'A') {
                    let newHTML = node.nodeValue;
                    newHTML = newHTML.replace(ed2kRegex, '<a href="$&" target="_blank">$&</a>');
                    newHTML = newHTML.replace(magnetRegex, '<a href="$&" target="_blank">$&</a>');

                    const temp = document.createElement('div');
                    temp.innerHTML = newHTML;

                    // 将新内容插入到 DOM 中
                    while (temp.firstChild) {
                        parent.insertBefore(temp.firstChild, node);
                    }

                    // 移除原始文本节点
                    parent.removeChild(node);
                }
            }
        }
    }

    // 获取网页中的所有 ed2k 和磁力链接，包括现有的超链接
    function getAllLinks() {
        const ed2kRegex = /ed2k:\/\/\|file\|[^\|]+\|\d+\|[a-fA-F0-9]+\|\//g;
        const magnetRegex = /magnet:\?xt=urn:[a-zA-Z0-9:.&=]+/g;

        const links = [];

        // 查找所有现有的 ed2k 和磁力超链接
        document.querySelectorAll('a').forEach(anchor => {
            if (anchor.href.match(ed2kRegex) || anchor.href.match(magnetRegex)) {
                links.push(anchor.href);
            }
        });

        // 查找所有文本节点中的 ed2k 和磁力链接
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while (node = walker.nextNode()) {
            const matches = node.nodeValue.match(ed2kRegex) || [];
            links.push(...matches);

            const magnetMatches = node.nodeValue.match(magnetRegex) || [];
            links.push(...magnetMatches);
        }

        return links.join('\n');
    }

    // 创建一键复制按钮
    function createCopyButton() {
        const button = document.createElement('button');
        button.id = 'copyAllLinksButton';
        button.textContent = '复制所有链接';
        button.style.position = 'fixed';
        button.style.zIndex = '10000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.width = '120px'; // 固定宽度
        button.style.height = '40px'; // 固定高度

        // 设置初始位置或恢复保存的位置
        const position = GM_getValue(COPY_BUTTON_POSITION_KEY, { top: '10px', left: '10px' });
        button.style.top = position.top;
        button.style.left = position.left;

        // 点击按钮时复制所有链接
        button.addEventListener('click', () => {
            const links = getAllLinks();
            if (links) {
                GM_setClipboard(links);
                alert('已复制所有链接到剪贴板！');
            } else {
                alert('未找到链接！');
            }
        });

        makeDraggable(button);

        document.body.appendChild(button);
    }

    // 保存排除网址列表
    function saveExcludedUrls(urls) {
        GM_setValue(EXCLUDE_KEY, urls);
    }

    // 打开配置面板
    function openConfigPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.left = '10px';
        panel.style.width = '300px';
        panel.style.height = '200px';
        panel.style.backgroundColor = '#fff';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '10px';
        panel.style.zIndex = '1001';
        panel.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(panel);

        const title = document.createElement('h3');
        title.textContent = '排除网址配置';
        panel.appendChild(title);

        const list = document.createElement('ul');
        list.style.maxHeight = '100px';
        list.style.overflowY = 'auto';
        panel.appendChild(list);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入网址模式（正则表达式）';
        input.style.width = 'calc(100% - 22px)';
        input.style.marginBottom = '5px';
        panel.appendChild(input);

        const addButton = document.createElement('button');
        addButton.textContent = '添加';
        addButton.addEventListener('click', () => {
            const value = input.value.trim();
            if (value) {
                const excludedUrls = GM_getValue(EXCLUDE_KEY, []);
                excludedUrls.push(value);
                saveExcludedUrls(excludedUrls);
                updateList();
                input.value = '';
            }
        });
        panel.appendChild(addButton);

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.float = 'right';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(panel);
        });
        panel.appendChild(closeButton);

        updateList();

        function updateList() {
            list.innerHTML = '';
            const excludedUrls = GM_getValue(EXCLUDE_KEY, []);
            excludedUrls.forEach((pattern, index) => {
                const li = document.createElement('li');
                li.textContent = pattern;
                const removeButton = document.createElement('button');
                removeButton.textContent = '删除';
                removeButton.style.float = 'right';
                removeButton.addEventListener('click', () => {
                    excludedUrls.splice(index, 1);
                    saveExcludedUrls(excludedUrls);
                    updateList();
                });
                li.appendChild(removeButton);
                list.appendChild(li);
            });
        }
    }

    // 创建配置按钮
    function createConfigButton() {
        const button = document.createElement('button');
        button.id = 'configExcludeButton';
        button.textContent = '配置排除网址';
        button.style.position = 'fixed';
        button.style.zIndex = '10000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#ffc107';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.width = '120px'; // 固定宽度
        button.style.height = '40px'; // 固定高度

        // 设置初始位置或恢复保存的位置
        const position = GM_getValue(CONFIG_BUTTON_POSITION_KEY, { top: '60px', left: '10px' });
        button.style.top = position.top;
        button.style.left = position.left;

        // 点击按钮时打开配置面板
        button.addEventListener('click', openConfigPanel);

        makeDraggable(button);

        document.body.appendChild(button);
    }

    // 创建两个切换按钮
    function createToggleButtons() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.zIndex = '10000';
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.alignItems = 'center';

        // 设置初始位置或恢复保存的位置
        const position = GM_getValue(TOGGLE_BUTTONS_POSITION_KEY, { top: '110px', left: '10px' });
        container.style.top = position.top;
        container.style.left = position.left;

        // 切换复制所有链接按钮
        const toggleCopyButton = document.createElement('button');
        toggleCopyButton.id = 'toggleCopyButton';
        toggleCopyButton.textContent = '隐藏复制按钮';
        toggleCopyButton.style.padding = '10px';
        toggleCopyButton.style.backgroundColor = '#dc3545';
        toggleCopyButton.style.color = '#fff';
        toggleCopyButton.style.border = 'none';
        toggleCopyButton.style.borderRadius = '5px 0 0 5px';
        toggleCopyButton.style.cursor = 'pointer';
        toggleCopyButton.style.width = '80px'; // 固定宽度
        toggleCopyButton.style.height = '50px'; // 固定高度

        toggleCopyButton.addEventListener('click', () => {
            toggleCopyButtonVisibility();
        });

        // 切换配置排除网址按钮
        const toggleConfigButton = document.createElement('button');
        toggleConfigButton.id = 'toggleConfigButton';
        toggleConfigButton.textContent = '隐藏配置网址按钮';
        toggleConfigButton.style.padding = '10px';
        toggleConfigButton.style.backgroundColor = '#28a745';
        toggleConfigButton.style.color = '#fff';
        toggleConfigButton.style.border = 'none';
        toggleConfigButton.style.borderRadius = '0 5px 5px 0';
        toggleConfigButton.style.cursor = 'pointer';
        toggleConfigButton.style.width = '80px'; // 固定宽度
        toggleConfigButton.style.height = '50px'; // 固定高度

        toggleConfigButton.addEventListener('click', () => {
            toggleConfigButtonVisibility();
        });

        // 使容器可拖动
        makeDraggable(container);

        container.appendChild(toggleCopyButton);
        container.appendChild(toggleConfigButton);
        document.body.appendChild(container);
    }

    // 使元素可拖动
    function makeDraggable(element) {
        let offsetX, offsetY;
        let isDragging = false;

        element.addEventListener('mousedown', (e) => {
            if (e.target === element || e.target.parentElement === element) {
                offsetX = e.clientX - element.offsetLeft;
                offsetY = e.clientY - element.offsetTop;
                isDragging = true;
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            }
        });

        function mouseMoveHandler(e) {
            if (!isDragging) return;

            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            element.style.left = `${Math.min(maxX, Math.max(0, e.clientX - offsetX))}px`;
            element.style.top = `${Math.min(maxY, Math.max(0, e.clientY - offsetY))}px`;

            // 更新位置信息
            if (element.id === 'toggleButtonsContainer') {
                GM_setValue(TOGGLE_BUTTONS_POSITION_KEY, { top: element.style.top, left: element.style.left });
            }
        }

        function mouseUpHandler() {
            isDragging = false;
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }
    }

    // 切换复制所有链接按钮的显示状态
    function toggleCopyButtonVisibility() {
        const copyButton = document.getElementById('copyAllLinksButton');
        const toggleCopyButton = document.getElementById('toggleCopyButton');

        const isVisible = !GM_getValue(COPY_BUTTON_VISIBLE_KEY, true);

        if (isVisible) {
            copyButton.style.display = 'block';
            toggleCopyButton.textContent = '隐藏复制按钮';
        } else {
            copyButton.style.display = 'none';
            toggleCopyButton.textContent = '显示复制按钮';
        }

        GM_setValue(COPY_BUTTON_VISIBLE_KEY, isVisible);
    }

    // 切换配置排除网址按钮的显示状态
    function toggleConfigButtonVisibility() {
        const configButton = document.getElementById('configExcludeButton');
        const toggleConfigButton = document.getElementById('toggleConfigButton');

        const isVisible = !GM_getValue(CONFIG_BUTTON_VISIBLE_KEY, true);

        if (isVisible) {
            configButton.style.display = 'block';
            toggleConfigButton.textContent = '隐藏配置按钮';
        } else {
            configButton.style.display = 'none';
            toggleConfigButton.textContent = '显示配置按钮';
        }

        GM_setValue(CONFIG_BUTTON_VISIBLE_KEY, isVisible);
    }

    // 在页面加载完成后执行
    window.addEventListener('load', () => {
        if (!isExcluded(window.location.href)) {
            convertLinks();
            createCopyButton();
            createConfigButton();
            createToggleButtons();

            // 初始化按钮显示状态
            const copyButtonVisible = GM_getValue(COPY_BUTTON_VISIBLE_KEY, true);
            const configButtonVisible = GM_getValue(CONFIG_BUTTON_VISIBLE_KEY, true);

            const copyButton = document.getElementById('copyAllLinksButton');
            const configButton = document.getElementById('configExcludeButton');
            const toggleCopyButton = document.getElementById('toggleCopyButton');
            const toggleConfigButton = document.getElementById('toggleConfigButton');

            if (!copyButtonVisible) {
                copyButton.style.display = 'none';
                toggleCopyButton.textContent = '显示复制按钮';
            }

            if (!configButtonVisible) {
                configButton.style.display = 'none';
                toggleConfigButton.textContent = '显示配置按钮';
            }
        } else {
            // 如果页面在排除列表中，移除可能存在的按钮
            const copyButton = document.getElementById('copyAllLinksButton');
            if (copyButton) {
                document.body.removeChild(copyButton);
            }
            const configButton = document.getElementById('configExcludeButton');
            if (configButton) {
                document.body.removeChild(configButton);
            }
            const toggleButtonsContainer = document.getElementById('toggleButtonsContainer');
            if (toggleButtonsContainer) {
                document.body.removeChild(toggleButtonsContainer);
            }
        }
    });

    // 监听动态内容加载（例如 AJAX）
    const observer = new MutationObserver(() => {
        if (!isExcluded(window.location.href)) {
            convertLinks();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();



