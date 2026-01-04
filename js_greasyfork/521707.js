// ==UserScript==
// @name         验证码自动识别
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  使用 Python API 自动识别验证码
// @author       Yoke
// @match        http://*/*
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      82.157.111.62
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.3/axios.min.js
// @icon         data:image/png;base64,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
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/521707/%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/521707/%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 修改规则存储结构
    function saveRules(rules) {
        // 将规则按组整理
        const groupedRules = {};
        Object.entries(rules).forEach(([url, rule]) => {
            const ruleKey = `${rule.imgSelector}|${rule.inputSelector}`;
            if (!groupedRules[ruleKey]) {
                groupedRules[ruleKey] = {
                    urls: [],
                    rule: {
                        imgSelector: rule.imgSelector,
                        inputSelector: rule.inputSelector,
                        enabled: rule.enabled
                    }
                };
            }
            if (!groupedRules[ruleKey].urls.includes(url)) {
                groupedRules[ruleKey].urls.push(url);
            }
        });

        GM_setValue('captchaRules', groupedRules);
        return groupedRules;
    }

    // 修改规则加载函数
    function loadRules() {
        const groupedRules = GM_getValue('captchaRules', {});
        const rules = {};

        // 如果是旧格式的规则，直接返回
        if (Object.values(groupedRules).every(rule => !rule.urls)) {
            return groupedRules;
        }

        // 转换新格式的规则
        Object.values(groupedRules).forEach(group => {
            group.urls.forEach(url => {
                rules[url] = { ...group.rule };
            });
        });

        return rules;
    }

    // 存储页面规则
    let rules = loadRules();
    let isSelecting = false;
    let currentSelector = null;

    // 添加设置菜单
    GM_registerMenuCommand('添加验证码规则', addNewRule);
    GM_registerMenuCommand('管理验证码规则', manageRules);

    // 创建选择器提示框
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 14px 28px;
        border-radius: 12px;
        z-index: 999999;
        display: none;
        font-size: 14px;
        font-weight: 500;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
        animation: pulse 2s infinite;
    `;

    // 添加动画样式
    const animStyle = document.createElement('style');
    animStyle.textContent = `
        @keyframes pulse {
            0%, 100% { box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4); }
            50% { box-shadow: 0 10px 50px rgba(102, 126, 234, 0.6); }
        }
        @keyframes highlightPulse {
            0%, 100% { border-color: #667eea; background: rgba(102, 126, 234, 0.1); }
            50% { border-color: #764ba2; background: rgba(118, 75, 162, 0.15); }
        }
    `;
    document.head.appendChild(animStyle);
    document.body.appendChild(tooltip);

    // 创建元素高亮框
    const highlighter = document.createElement('div');
    highlighter.style.cssText = `
        position: absolute;
        border: 3px solid #667eea;
        background: rgba(102, 126, 234, 0.1);
        pointer-events: none;
        z-index: 999998;
        display: none;
        border-radius: 4px;
        animation: highlightPulse 1.5s infinite;
        transition: all 0.15s ease;
    `;
    document.body.appendChild(highlighter);

    // CSS 选择器特殊字符转义函数
    function escapeCSS(str) {
        return str.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
    }

    // 添加日志函数
    function log(message, type = 'info') {
        const styles = {
            info: 'color: #2196F3',
            success: 'color: #4CAF50',
            warning: 'color: #FFC107',
            error: 'color: #F44336'
        };

        console.log(`%c[验证码识别] ${message}`, styles[type]);
    }

    // 获取元素的选择器
    function getSelector(element) {
        // 递归向上查找，直到找到带有id、class或name的元素，或者到达body
        function findParentWithIdentifier(el, maxDepth = 3) {
            let path = [];
            let currentEl = el;
            let depth = 0;

            // 先添加当前元素
            let currentSelector = currentEl.tagName.toLowerCase();

            // 检查当前元素的标识符
            const identifiers = [];

            // 检查 name 属性
            if (currentEl.name) {
                identifiers.push(`[name="${currentEl.name}"]`);
            }

            // 检查 class
            if (currentEl.className && typeof currentEl.className === 'string' && currentEl.className.trim()) {
                identifiers.push('.' + currentEl.className.trim().split(/\s+/).map(escapeCSS).join('.'));
            }

            // 如果有标识符，使用它们
            if (identifiers.length > 0) {
                currentSelector += identifiers.join('');
            }

            path.push(currentSelector);

            while (currentEl && currentEl !== document.body && depth < maxDepth) {
                currentEl = currentEl.parentElement;
                if (!currentEl || currentEl === document.body) break;

                log(`正在查找父元素: ${currentEl.tagName.toLowerCase()}`, 'info');

                // 检查 ID
                if (currentEl.id) {
                    const selector = '#' + currentEl.id + ' > ' + path.join(' > ');
                    log(`找到ID选择器: ${selector}`, 'success');
                    return selector;
                }

                // 检查 name 和 class
                const parentIdentifiers = [];
                if (currentEl.name) {
                    parentIdentifiers.push(`[name="${currentEl.name}"]`);
                }
                if (currentEl.className && typeof currentEl.className === 'string' && currentEl.className.trim()) {
                    parentIdentifiers.push('.' + currentEl.className.trim().split(/\s+/).map(escapeCSS).join('.'));
                }

                let selector = currentEl.tagName.toLowerCase();
                if (parentIdentifiers.length > 0) {
                    selector += parentIdentifiers.join('');
                    const fullSelector = selector + ' > ' + path.join(' > ');
                    log(`找到带标识符的选择器: ${fullSelector}`, 'success');
                    return fullSelector;
                }

                // 如果没有标识符，使用位置
                const parent = currentEl.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(currentEl);
                    if (siblings.length > 1) {
                        selector += `:nth-child(${index + 1})`;
                    }
                }

                path.unshift(selector);
                depth++;
            }

            const finalSelector = path.join(' > ');
            log(`使用路径选择器: ${finalSelector}`, 'warning');
            return finalSelector;
        }

        // 首先检查元素本身
        const identifiers = [];

        // 检查 ID
        if (element.id) {
            const selector = '#' + element.id;
            log(`直接使用ID选择器: ${selector}`, 'success');
            return selector;
        }

        // 检查 name
        if (element.name) {
            identifiers.push(`[name="${element.name}"]`);
        }

        // 检查 class
        if (element.className && typeof element.className === 'string' && element.className.trim()) {
            identifiers.push('.' + element.className.trim().split(/\s+/).map(escapeCSS).join('.'));
        }

        // 如果有标识符，使用它们
        if (identifiers.length > 0) {
            const selector = element.tagName.toLowerCase() + identifiers.join('');
            log(`直接使用标识符选择器: ${selector}`, 'success');
            return selector;
        }

        log('元素没有ID、name或class，开始向上查找父元素...', 'info');
        return findParentWithIdentifier(element);
    }

    // 开始选择元素
    function startSelection(type) {
        isSelecting = true;
        currentSelector = type;
        tooltip.style.display = 'block';
        tooltip.textContent = `请点击${type === 'img' ? '验证码图片' : '输入框'}`;

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('click', handleClick, true);
    }

    // 处理鼠标悬停
    function handleMouseOver(e) {
        if (!isSelecting) return;

        const element = e.target;
        const rect = element.getBoundingClientRect();

        highlighter.style.display = 'block';
        highlighter.style.left = rect.left + window.scrollX + 'px';
        highlighter.style.top = rect.top + window.scrollY + 'px';
        highlighter.style.width = rect.width + 'px';
        highlighter.style.height = rect.height + 'px';
    }

    // 处理鼠标移出
    function handleMouseOut() {
        if (!isSelecting) return;
        highlighter.style.display = 'none';
    }

    // 处理点击选择
    function handleClick(e) {
        if (!isSelecting) return;

        e.preventDefault();
        e.stopPropagation();

        const element = e.target;
        const selector = getSelector(element);

        if (currentSelector === 'img') {
            tempRule.imgSelector = selector;
            startSelection('input');
        } else {
            tempRule.inputSelector = selector;
            finishSelection();
        }
    }

    // 结束选择
    function finishSelection() {
        isSelecting = false;
        currentSelector = null;
        tooltip.style.display = 'none';
        highlighter.style.display = 'none';

        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('click', handleClick, true);

        saveRule();
    }

    // 临时存储规则
    let tempRule = {};

    // 添加新规则
    function addNewRule() {
        // 获取当前页面的URL信息
        const currentURL = new URL(window.location.href);
        let defaultPattern = currentURL.protocol + '//' + currentURL.hostname;

        // 添加端口（如果不是默认端口）
        if (currentURL.port &&
            !((currentURL.protocol === 'http:' && currentURL.port === '80') ||
                (currentURL.protocol === 'https:' && currentURL.port === '443'))) {
            defaultPattern += ':' + currentURL.port;
        }

        // 添加路径
        defaultPattern += currentURL.pathname;

        tempRule = {
            url: defaultPattern,
            enabled: true
        };

        startSelection('img');
    }

    // 保存规则
    function saveRule() {
        const currentUrl = window.location.href;
        rules[currentUrl] = {
            imgSelector: tempRule.imgSelector,
            inputSelector: tempRule.inputSelector,
            enabled: true
        };

        // 保存并重新加载规则
        const groupedRules = saveRules(rules);
        rules = loadRules();

        showToast('规则已保存', 'success');
        log('规则已保存', 'success');
    }

    // 修改模态框样式
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        /* 基础变量 */
        .captcha-modal * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* 模态框遮罩 */
        .captcha-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* 模态框内容 */
        .captcha-modal-content {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            padding: 0;
            border-radius: 16px;
            width: 720px;
            max-width: 90%;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
            animation: slideUp 0.3s ease;
            overflow: hidden;
        }

        /* 头部 */
        .captcha-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            flex-shrink: 0;
        }

        .captcha-modal-title {
            font-size: 18px;
            font-weight: 600;
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .captcha-modal-title::before {
            content: "🔐";
            font-size: 20px;
        }

        .captcha-modal-close {
            cursor: pointer;
            padding: 8px 16px;
            border: none;
            background: rgba(255,255,255,0.2);
            color: white;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            backdrop-filter: blur(4px);
        }

        .captcha-modal-close:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-1px);
        }

        /* 内容区域 */
        .captcha-modal-body {
            overflow-y: auto;
            flex-grow: 1;
            padding: 24px;
        }

        /* 规则卡片 */
        .captcha-rule-item {
            border: 1px solid #e2e8f0;
            padding: 20px;
            margin-bottom: 16px;
            border-radius: 12px;
            background: white;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .captcha-rule-item:hover {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
            transform: translateY(-2px);
        }

        /* 规则字段 */
        .rule-field {
            margin-bottom: 14px;
            line-height: 1.6;
            display: flex;
            align-items: center;
            padding: 10px 14px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }

        .rule-field strong {
            min-width: 90px;
            color: #64748b;
            font-size: 13px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .editable-value {
            cursor: pointer;
            padding: 6px 10px;
            border-radius: 6px;
            color: #334155;
            background: white;
            flex-grow: 1;
            margin-left: 10px;
            transition: all 0.2s ease;
            font-size: 13px;
            border: 1px solid transparent;
            word-break: break-all;
        }

        .editable-value:hover {
            background: #eff6ff;
            border-color: #667eea;
            color: #667eea;
        }

        .edit-input {
            width: 100%;
            padding: 8px 12px;
            border: 2px solid #667eea;
            border-radius: 6px;
            font-size: 13px;
            margin-left: 10px;
            flex-grow: 1;
            outline: none;
            transition: all 0.2s ease;
            background: white;
        }

        .edit-input:focus {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        /* 开关按钮 */
        .toggle-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
            margin: 0;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
            margin: 0;
        }

        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 24px;
        }

        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .toggle-switch input:checked + .toggle-slider {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .toggle-switch input:checked + .toggle-slider:before {
            transform: translateX(20px);
        }

        .toggle-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            user-select: none;
        }

        /* 状态字段 */
        .rule-field.status-field {
            background: transparent;
            padding: 14px 0 0 0;
            border: none;
            border-top: 1px solid #e2e8f0;
            margin-top: 16px;
            margin-bottom: 0;
        }

        /* 操作按钮区域 */
        .captcha-rule-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            gap: 10px;
        }

        .captcha-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .captcha-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .captcha-btn:active {
            transform: translateY(0);
        }

        .captcha-btn-delete {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
        }

        .captcha-btn-delete:hover {
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .captcha-btn-clear {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            margin-top: 20px;
            width: 100%;
            padding: 14px;
            font-size: 14px;
            justify-content: center;
        }

        .captcha-btn-clear:hover {
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }

        /* 空状态提示 */
        .captcha-empty-tip {
            text-align: center;
            color: #64748b;
            padding: 60px 20px;
            font-size: 15px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 12px;
            margin: 20px 0;
            border: 2px dashed #e2e8f0;
        }

        .captcha-empty-tip::before {
            content: "📭";
            display: block;
            font-size: 48px;
            margin-bottom: 16px;
        }

        /* 自定义滚动条 */
        .captcha-modal-body::-webkit-scrollbar {
            width: 6px;
        }

        .captcha-modal-body::-webkit-scrollbar-track {
            background: transparent;
        }

        .captcha-modal-body::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }

        .captcha-modal-body::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        /* URL 列表 */
        .url-list-field {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
        }

        .url-list-field strong {
            margin-bottom: 4px;
        }

        .url-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
        }

        .url-item {
            display: flex;
            align-items: center;
            gap: 8px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.2s ease;
        }

        .url-item:hover {
            border-color: #667eea;
        }

        .url-item .editable-value {
            flex: 1;
            margin: 0;
            border: none;
            border-radius: 0;
            padding: 10px 14px;
        }

        .url-item .edit-input {
            flex: 1;
            margin: 0;
            border: none;
            border-radius: 0;
            padding: 10px 14px;
        }

        .url-item .edit-input:focus {
            box-shadow: inset 0 0 0 2px #667eea;
        }

        .url-delete-btn {
            padding: 10px 14px;
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s ease;
        }

        .url-delete-btn:hover {
            background: #fef2f2;
            color: #ef4444;
        }

        .add-url-btn {
            margin-top: 8px;
            padding: 12px;
            background: transparent;
            border: 2px dashed #e2e8f0;
            color: #64748b;
            cursor: pointer;
            border-radius: 8px;
            width: 100%;
            transition: all 0.2s ease;
            font-size: 13px;
            font-weight: 500;
        }

        .add-url-btn:hover {
            border-color: #667eea;
            color: #667eea;
            background: #f8fafc;
        }
    `;
    document.head.appendChild(modalStyle);

    // 添加删除按钮相关样式
    modalStyle.textContent += `
        /* 规则操作区域 */
        .rule-actions {
            position: absolute;
            top: 15px;
            right: 15px;
            z-index: 1;
        }

        /* 删除规则按钮 */
        .rule-delete-btn {
            padding: 6px 12px;
            background: none;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            color: #f44336;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .rule-delete-btn:hover {
            background: #fef2f2;
            border-color: #f44336;
        }

        /* 规则项容器需要添加相对定位 */
        .captcha-rule-item {
            position: relative;
            padding: 20px;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }

        .captcha-rule-item:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
    `;

    // 管理规则函数
    function manageRules() {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'captcha-modal';

        const content = document.createElement('div');
        content.className = 'captcha-modal-content';

        // 添加标题和关闭按钮
        const header = document.createElement('div');
        header.className = 'captcha-modal-header';

        const title = document.createElement('div');
        title.className = 'captcha-modal-title';
        title.textContent = '验证码规则管理';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'captcha-modal-close';
        closeBtn.textContent = '关闭';
        closeBtn.onclick = () => modal.remove();

        header.appendChild(title);
        header.appendChild(closeBtn);
        content.appendChild(header);

        // 添加内容容器
        const modalBody = document.createElement('div');
        modalBody.className = 'captcha-modal-body';
        content.appendChild(modalBody);

        // 将规则按组显示
        const groupedRules = saveRules(rules);
        Object.values(groupedRules).forEach(group => {
            const ruleItem = createRuleItem(group.urls, group.rule);
            modalBody.appendChild(ruleItem);
        });

        // 如果没有规则，显示提示
        if (Object.keys(rules).length === 0) {
            const emptyTip = document.createElement('div');
            emptyTip.className = 'captcha-empty-tip';
            emptyTip.textContent = '暂无规则';
            modalBody.appendChild(emptyTip);
        }

        // 添加清空按钮到 modalBody
        const clearAllBtn = document.createElement('button');
        clearAllBtn.className = 'captcha-btn captcha-btn-clear';
        clearAllBtn.textContent = '清空所有规则';
        modalBody.appendChild(clearAllBtn);

        modal.appendChild(content);
        document.body.appendChild(modal);

        // 点击模态框背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    // 检查当前页面是否匹配规则
    function checkPageRules() {
        const currentUrl = window.location.href;
        const currentUrlObj = new URL(currentUrl);

        for (let ruleUrl in rules) {
            try {
                // 将规则URL转换为正则表达式模式
                let pattern;
                if (ruleUrl.includes('*')) {
                    // 如果包含通配符，转换为正则表达式
                    pattern = new RegExp('^' + ruleUrl
                        .replace(/\./g, '\\.')  // 转义点号
                        .replace(/\*/g, '.*')   // 将星号转换为正则通配符
                        + '$');
                } else {
                    // 如果不包含通配符，直接比较URL的议、主机和口部
                    const ruleUrlObj = new URL(ruleUrl);
                    if (ruleUrlObj.protocol === currentUrlObj.protocol &&
                        ruleUrlObj.host === currentUrlObj.host) {
                        return rules[ruleUrl];
                    }
                    continue;
                }

                if (pattern.test(currentUrl) && rules[ruleUrl].enabled) {
                    return rules[ruleUrl];
                }
            } catch (e) {
                console.error('规则URL格式错误:', ruleUrl, e);
                continue;
            }
        }
        return null;
    }

    // 添加提示框样式
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        .captcha-toast {
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 14px 20px 14px 16px;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: white;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 999999;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateX(100%) scale(0.9);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 360px;
            backdrop-filter: blur(8px);
        }
        .captcha-toast::before {
            content: "ℹ️";
            font-size: 16px;
        }
        .captcha-toast.show {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
        .captcha-toast.error {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        .captcha-toast.error::before {
            content: "❌";
        }
        .captcha-toast.success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .captcha-toast.success::before {
            content: "✅";
        }
        .captcha-toast.warning {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        .captcha-toast.warning::before {
            content: "⚠️";
        }
    `;
    document.head.appendChild(toastStyle);

    // 添加提示框函数
    function showToast(message, type = 'info', duration = 3000) {
        // 移除现有的提示框
        const existingToast = document.querySelector('.captcha-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `captcha-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    function imgToBase64(imgElement) {
        return new Promise((resolve, reject) => {
            // 创建一个新的 Canvas 元素
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 确保图像加载完成
            imgElement.onload = function () {
                // 设置 canvas 大小与图像一致
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;

                // 在 canvas 上绘制图像
                ctx.drawImage(imgElement, 0, 0);

                // 将 canvas 内容转换为 Base64 字符串
                const base64Image = canvas.toDataURL('image/png');

                // 返回 Base64 字符串
                resolve(base64Image);
            };

            // 如果图像已经加载完毕，则直接执行回调
            if (imgElement.complete) {
                imgElement.onload();
            }

            // 处理加载失败的情况
            imgElement.onerror = function () {
                reject(new Error('图片加载失败'));
            };
        });
    }

    // 修改 blob 处理函数
    async function blobToBase64(blobUrl) {
        try {
            // 1. 先尝试直接通过 fetch 获取
            try {
                const response = await fetch(blobUrl);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                log('直接fetch失败，尝试其他方法', 'warning');
            }

            // 2. 尝试通过 canvas 获取
            const img = new Image();
            img.crossOrigin = 'anonymous';  // 允许跨域

            return new Promise((resolve, reject) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    try {
                        ctx.drawImage(img, 0, 0);
                        const dataUrl = canvas.toDataURL('image/png');
                        resolve(dataUrl);
                    } catch (e) {
                        reject(new Error(`Canvas 转换失败: ${e.message}`));
                    }
                };

                img.onerror = () => {
                    reject(new Error('图片加载失败'));
                };

                img.src = blobUrl;
            });
        } catch (error) {
            throw new Error(`Blob转换失败: ${error.message}`);
        }
    }

    // 识别验证码
    async function recognizeCaptcha(imageElement) {
        try {
            let imageData;

            // 处理 Blob URL
            if (imageElement.src.startsWith('blob:')) {
                try {
                    imageData = await blobToBase64(imageElement.src);
                    log('Blob转换成功', 'success');
                } catch (error) {
                    // 如果转换失败，尝试直接使用图片元素
                    log('Blob转换失败，尝试直接使用图片元素', 'warning');
                    imageData = await imgToBase64(imageElement);
                }
            }
            // 处理 Base64
            else if (imageElement.src.startsWith('data:image')) {
                imageData = imageElement.src;
            }
            // 处理普通 URL
            else {
                imageData = await imgToBase64(imageElement);
            }

            // 检查图片数据是否有效
            if (!imageData || !imageData.includes('base64,')) {
                throw new Error('无效的图片数据');
            }

            // 使用 GM_xmlhttpRequest 发送请求
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('验证码服务请求超时'));
                }, 10000);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'http://82.157.111.62:8000/ocr',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: `image=${encodeURIComponent(imageData.split(',')[1])}`,
                    onload: function (response) {
                        clearTimeout(timeout);
                        try {
                            const result = JSON.parse(response.responseText);
                            if (!result.code) {
                                throw new Error(result.error || '识别失败');
                            }
                            log(`识别结果: ${result.data}`, 'success');
                            resolve(result.data);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: function (error) {
                        clearTimeout(timeout);
                        reject(new Error('验证码服务请求失败'));
                    }
                });
            });

        } catch (error) {
            log(`验证码识别失败: ${error.message}`, 'error');
            showToast(`验证码识别失败: ${error.message}`, 'error');
            return '';
        }
    }

    // 处理验证码
    async function processCaptcha(rule) {
        try {
            log('规则存在开始处理验证码...', 'info');
            log('图片元素选择器' + rule.imgSelector, 'info');
            log('输入框元素选择器' + rule.inputSelector, 'info');

            // 安全的选择器查询函数，处理未转义的特殊字符
            function safeQuerySelector(selector) {
                try {
                    return document.querySelector(selector);
                } catch (e) {
                    // 如果选择器无效，尝试转义类名中的特殊字符
                    const escapedSelector = selector.replace(/\.([^.\s\[#>+~]+)/g, (match, className) => {
                        const escaped = className.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
                        return '.' + escaped;
                    });
                    log(`原选择器无效，尝试转义后: ${escapedSelector}`, 'warning');
                    return document.querySelector(escapedSelector);
                }
            }

            // 等待验证码元素出现
            async function waitForElement(selector, timeout = 10000) {
                const startTime = Date.now();

                while (Date.now() - startTime < timeout) {
                    const element = safeQuerySelector(selector);
                    if (element) {
                        return element;
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return null;
            }

            // 等待验证码图片和输入框出现
            log('等待验证码元素加载...','info');
            const imgElement = await waitForElement(rule.imgSelector);
            const inputElement = await waitForElement(rule.inputSelector);
            // console.log(rule.imgSelector,rule.inputSelector)
            if (!imgElement || !inputElement) {
                log('未找到验证码图片或输入框元素', 'error');
                return;
            }

            log(`找到验证码图片: ${rule.imgSelector}`, 'success');
            log(`找到输入框: ${rule.inputSelector}`, 'success');

            const recognizeAndFill = async () => {
                try {
                    // 检查图片是否有效
                    if (!imgElement.complete || !imgElement.naturalWidth) {
                        log('等待图片加载...', 'info');
                        await new Promise(resolve => imgElement.onload = resolve);
                    }

                    // 检查图片是否有实际内容
                    if (!imgElement.src || imgElement.src === 'about:blank') {
                        log('验证码图片未加载，等待src更新...', 'warning');
                        return;
                    }

                    await new Promise(resolve => setTimeout(resolve, 100));
                    log('开始识别验证码...', 'info');

                    const captchaText = await recognizeCaptcha(imgElement);
                    if (captchaText) {
                        // 使用多种方式设置输入框的值
                        const setInputValue = (input, value) => {
                            // 防止值闪烁
                            const preventFlash = (e) => {
                                e.stopImmediatePropagation();  // 阻止其他事件处理器
                                e.preventDefault();
                                return false;
                            };

                            // 临时添加事件拦截
                            input.addEventListener('input', preventFlash, true);
                            input.addEventListener('change', preventFlash, true);
                            input.addEventListener('focus', preventFlash, true);
                            input.addEventListener('blur', preventFlash, true);

                            try {
                                // 1. 使用 Object.defineProperty 设置值
                                const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
                                if (descriptor && descriptor.set) {
                                    descriptor.set.call(input, value);
                                }

                                // 2. 直接设置value属性
                                input.value = value;

                                // 3. 使用setAttribute
                                input.setAttribute('value', value);

                                // 4. 模拟用户输入
                                const inputEvent = new InputEvent('input', {
                                    bubbles: true,
                                    cancelable: true,
                                    inputType: 'insertText',
                                    data: value,
                                    composed: true
                                });
                                input.dispatchEvent(inputEvent);

                                // 5. 触发 change 事件
                                const changeEvent = new Event('change', {
                                    bubbles: true,
                                    cancelable: true
                                });
                                input.dispatchEvent(changeEvent);

                            } finally {
                                // 移除临时事件拦截
                                setTimeout(() => {
                                    input.removeEventListener('input', preventFlash, true);
                                    input.removeEventListener('change', preventFlash, true);
                                    input.removeEventListener('focus', preventFlash, true);
                                    input.removeEventListener('blur', preventFlash, true);
                                }, 0);
                            }
                        };

                        //此段逻辑借鉴Crab大佬的代码，十分感谢
                        function fire(element, eventName) {
                            var event = document.createEvent("HTMLEvents");
                            event.initEvent(eventName, true, true);
                            element.dispatchEvent(event);
                        }
                        function FireForReact(element, eventName) {
                            try {
                                let env = new Event(eventName);
                                element.dispatchEvent(env);
                                var funName = Object.keys(element).find(p => Object.keys(element[p]).find(f => f.toLowerCase().endsWith(eventName)));
                                if (funName != undefined) {
                                    element[funName].onChange(env)
                                }
                            }
                            catch (e) { }
                        }

                        let ans = captchaText.replace(/\s+/g, "");
                        if (inputElement.tagName == "TEXTAREA") {
                            inputElement.innerHTML = ans;
                        } else {
                            inputElement.value = ans;
                            if (typeof (InputEvent) !== "undefined") {
                                inputElement.value = ans;
                                inputElement.dispatchEvent(new InputEvent('input'));
                                var eventList = ['input', 'change', 'focus', 'keypress', 'keyup', 'keydown', 'select'];
                                for (var i = 0; i < eventList.length; i++) {
                                    fire(inputElement, eventList[i]);
                                }
                                FireForReact(inputElement, 'change');
                                inputElement.value = ans;
                            }
                            else if (KeyboardEvent) {
                                inputElement.dispatchEvent(new KeyboardEvent("input"));
                            }
                        }

                        log(`验证码已填入: ${captchaText}`, 'success');
                        showToast(`验证码已填入: ${captchaText}`, 'success');
                    } else {
                        log('验证码识别结果为空', 'warning');
                        showToast('验证码识别失败', 'error');
                    }
                } catch (error) {
                    log(`处理验证码时出错: ${error.message}`, 'error');
                    showToast(`处理验证码时出错: ${error.message}`, 'error');
                }
            };

            // 监听验证码图片变化
            const observer = new MutationObserver(async (mutations) => {
                for (let mutation of mutations) {
                    if (mutation.type === 'attributes' &&
                        (mutation.attributeName === 'src' || mutation.attributeName === 'data-src')) {
                        log('检测到验证码图片更新', 'info');

                        // 等待图片加载完成
                        if (!imgElement.complete) {
                            await new Promise(resolve => imgElement.onload = resolve);
                        }

                        // 额外等待一下确保图片完全加载
                        await new Promise(resolve => setTimeout(resolve, 200));

                        // 识别新的验证码
                        await recognizeAndFill();
                    }
                }
            });

            observer.observe(imgElement, {
                attributes: true,
                attributeFilter: ['src', 'data-src']
            });
            log('已设置验证码图片监听', 'success');

            // 监听图片点击事件
            imgElement.addEventListener('click', async (e) => {
                // 移除阻止默认行为，允许正常点击刷新
                // e.preventDefault();
                // e.stopPropagation();

                log('验证码图片被点击', 'info');

                // 等待新验证码加载
                await new Promise(resolve => setTimeout(resolve, 500));

                // MutationObserver 会自动处理新的验证码识别
            });
            log('已设置点击事件监听', 'success');

            // 检查图片是否已经可用
            const isImageReady = () => {
                return imgElement.complete &&
                       imgElement.naturalWidth > 0 &&
                       imgElement.src &&
                       imgElement.src !== 'about:blank' &&
                       !imgElement.src.startsWith('data:image/gif;base64,R0lGOD'); // 排除占位图
            };

            // 只有当图片实际加载了内容才进行首次识别
            if (isImageReady()) {
                log('图片已就绪，开始首次识别', 'info');
                await recognizeAndFill();
            } else {
                log('等待验证码图片首次加载...', 'info');

                // 监听图片首次加载完成
                const handleFirstLoad = async () => {
                    imgElement.removeEventListener('load', handleFirstLoad);
                    log('验证码图片首次加载完成', 'success');
                    // 等待一下确保图片完全渲染
                    await new Promise(resolve => setTimeout(resolve, 300));
                    if (isImageReady()) {
                        await recognizeAndFill();
                    }
                };

                imgElement.addEventListener('load', handleFirstLoad);

                // 如果图片已经 complete 但 naturalWidth 为 0，可能是缓存问题，强制触发
                if (imgElement.complete && imgElement.src && imgElement.src !== 'about:blank') {
                    log('图片状态异常，延迟重试...', 'warning');
                    setTimeout(async () => {
                        if (isImageReady()) {
                            imgElement.removeEventListener('load', handleFirstLoad);
                            await recognizeAndFill();
                        }
                    }, 500);
                }
            }
        } catch (error) {
            log(`验证码处理失败: ${error.message}`, 'error');
            showToast(`验证码处理失败: ${error.message}`, 'error');
        }
    }

    // 主函数
    function main() {
        const rule = checkPageRules();
        if (rule) {
            // 等待页面加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => processCaptcha(rule));
            } else {
                processCaptcha(rule);
            }
        }
    }

    // 修改规则项的生成代码
    function createRuleItem(urls, rule) {
        const ruleItem = document.createElement('div');
        ruleItem.className = 'captcha-rule-item';

        // URL 列表字段
        const urlListDiv = document.createElement('div');
        urlListDiv.className = 'rule-field url-list-field';

        const urlLabel = document.createElement('span');
        urlLabel.innerHTML = '<strong>URL列表:</strong>';
        urlListDiv.appendChild(urlLabel);

        const urlList = document.createElement('div');
        urlList.className = 'url-list';

        // 将单个 URL 转换为数组格式
        const urlArray = Array.isArray(urls) ? urls : [urls];

        // 创建 URL 列表
        urlArray.forEach(url => {
            const urlItem = createUrlItem(url, rule, rule);
            urlList.appendChild(urlItem);
        });

        // 添加新 URL 按钮
        const addUrlBtn = document.createElement('button');
        addUrlBtn.className = 'add-url-btn';
        addUrlBtn.innerHTML = '+ 添加URL';
        addUrlBtn.onclick = () => {
            const urlItem = createUrlItem('', rule, rule);
            urlList.appendChild(urlItem);
            const input = urlItem.querySelector('input');
            input.style.display = 'block';
            input.focus();
        };

        urlListDiv.appendChild(urlList);
        urlListDiv.appendChild(addUrlBtn);
        ruleItem.appendChild(urlListDiv);

        // 其他字段（选择器等）
        const fields = [
            { label: '图片选择器', key: 'imgSelector', value: rule.imgSelector },
            { label: '输入框选择器', key: 'inputSelector', value: rule.inputSelector }
        ];

        fields.forEach(field => {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'rule-field';

            const textSpan = document.createElement('span');
            textSpan.innerHTML = `<strong>${field.label}:</strong> `;
            fieldDiv.appendChild(textSpan);

            const valueSpan = document.createElement('span');
            valueSpan.className = 'editable-value';
            valueSpan.textContent = field.value;
            valueSpan.title = '点击编辑';
            fieldDiv.appendChild(valueSpan);

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'edit-input';
            input.value = field.value;
            input.style.display = 'none';
            fieldDiv.appendChild(input);

            // 编辑功能
            valueSpan.onclick = () => {
                valueSpan.style.display = 'none';
                input.style.display = 'inline-block';
                input.focus();
                input.select();
            };

            input.onblur = () => {
                const newValue = input.value.trim();
                if (newValue && newValue !== field.value) {
                    // 更新所有相关 URL 的规则
                    urlArray.forEach(url => {
                        if (rules[url]) {
                            rules[url][field.key] = newValue;
                        }
                    });
                    GM_setValue('captchaRules', rules);
                    valueSpan.textContent = newValue;
                    showToast('规则已更新', 'success');
                }
                valueSpan.style.display = 'inline-block';
                input.style.display = 'none';
            };

            ruleItem.appendChild(fieldDiv);
        });

        // 状态切换
        const statusDiv = document.createElement('div');
        statusDiv.className = 'rule-field status-field';
        statusDiv.innerHTML = `
            <strong>状态:</strong>
            <div class="toggle-container">
                <label class="toggle-switch">
                    <input type="checkbox" ${rule.enabled ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">${rule.enabled ? '启用' : '禁用'}</span>
            </div>
        `;

        // 状态切换事件
        const checkbox = statusDiv.querySelector('input[type="checkbox"]');
        checkbox.onchange = () => {
            urlArray.forEach(url => {
                if (rules[url]) {
                    rules[url].enabled = checkbox.checked;
                }
            });
            statusDiv.querySelector('.toggle-label').textContent = checkbox.checked ? '启用' : '禁用';
            GM_setValue('captchaRules', rules);
            showToast(`规则已${checkbox.checked ? '启用' : '禁用'}`, 'success');
        };

        ruleItem.appendChild(statusDiv);

        // 添加删除规则按钮
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'rule-actions';

        const deleteRuleBtn = document.createElement('button');
        deleteRuleBtn.className = 'rule-delete-btn';
        deleteRuleBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            删除规则
        `;
        deleteRuleBtn.onclick = () => {
            // 删除所有相关的 URL 规则
            urlArray.forEach(url => {
                if (rules[url]) {
                    delete rules[url];
                }
            });
            GM_setValue('captchaRules', rules);

            // 添加淡出动画
            ruleItem.style.opacity = '0';
            ruleItem.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                ruleItem.remove();
                showToast('规则已删除', 'success');

                // 检查是否需要显示空状态提示
                const modalBody = document.querySelector('.captcha-modal-body');
                if (Object.keys(rules).length === 0 && modalBody) {
                    const emptyTip = document.createElement('div');
                    emptyTip.className = 'captcha-empty-tip';
                    emptyTip.textContent = '暂无规则';
                    modalBody.appendChild(emptyTip);
                }
            }, 300);
        };

        actionsDiv.appendChild(deleteRuleBtn);
        ruleItem.appendChild(actionsDiv);

        return ruleItem;
    }

    // 创建单个 URL 项
    function createUrlItem(url, rule, ruleGroup) {
        const urlItem = document.createElement('div');
        urlItem.className = 'url-item';

        const valueSpan = document.createElement('span');
        valueSpan.className = 'editable-value';
        valueSpan.textContent = url || '请输入URL';
        valueSpan.title = '点击编辑';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = url;
        input.placeholder = '请输入URL';
        input.style.display = 'none';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'url-delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = '删除';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (urlItem.parentElement.children.length > 1) {
                if (url) {
                    delete rules[url];
                    GM_setValue('captchaRules', rules);
                }
                urlItem.remove();
                showToast('URL已删除', 'success');
            } else {
                showToast('至少保留一个URL', 'warning');
            }
        };

        // 修改样式和交互
        if (!url) {
            valueSpan.style.display = 'none';
            input.style.display = 'block';
            urlItem.classList.add('new-item');
        }

        valueSpan.onclick = () => {
            valueSpan.style.display = 'none';
            input.style.display = 'block';
            input.focus();
            input.select();
        };

        input.onblur = () => {
            const newValue = input.value.trim();
            if (newValue) {
                if (newValue !== url) {
                    if (url) {
                        delete rules[url];
                    }
                    rules[newValue] = {
                        imgSelector: ruleGroup.imgSelector,
                        inputSelector: ruleGroup.inputSelector,
                        enabled: ruleGroup.enabled
                    };

                    // 保存并重新加载规则
                    const groupedRules = saveRules(rules);
                    rules = loadRules();

                    valueSpan.textContent = newValue;
                    showToast('URL已更新', 'success');
                }
                valueSpan.style.display = 'block';
                input.style.display = 'none';
                urlItem.classList.remove('new-item');
            } else if (!url) {
                urlItem.remove();
            }
        };

        urlItem.appendChild(valueSpan);
        urlItem.appendChild(input);
        urlItem.appendChild(deleteBtn);

        return urlItem;
    }

    main();
})();
