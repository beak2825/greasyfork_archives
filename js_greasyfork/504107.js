// ==UserScript==
// @name        网页复制破解助手
// @namespace   ack20a@gmail.com
// @version     0.2
// @description  破解网页防复制限制，支持破解百度文库 (wk.baidu.com)、腾讯文档 (docs.qq.com) 和道客巴巴 (doc88.com) 等网站的文本复制。
// @author      ack20
// @match       *://*/*
// @grant       none
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504107/%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E7%A0%B4%E8%A7%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/504107/%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E7%A0%B4%E8%A7%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试模式设置
    const DEBUG = false;

    // 日志函数
    function log(...args) {
        if (DEBUG) {
            console.log('[SuperCopy]', ...args);
        }
    }

    // CSS样式
    const copyCSS = `
        #_copy{
            align-items: center;
            background: #4494d5;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            display: flex;
            font-size: 13px;
            height: 30px;
            justify-content: center;
            position: absolute;
            width: 60px;
            z-index: 1000
        }
        #select-tooltip, #sfModal, .modal-backdrop, div[id^=reader-helper]{
            display: none!important
        }
        .modal-open{
            overflow: auto!important
        }
        ._sf_adjust_body{
            padding-right: 0!important
        }
        :not(input):not(textarea)::selection {
            background-color: #2440B3 !important;
            color: #fff !important;
        }
        :not(input):not(textarea)::-moz-selection {
            background-color: #2440B3 !important;
            color: #fff !important;
        }
        * {
            user-select: text !important;
            -webkit-user-select: text !important;
            -webkit-touch-callout: text !important;
        }
    `;

    // 添加样式
    function addStyle(css) {
        const styleId = '_supercopy_style';
        // 避免重复添加样式
        if (document.getElementById(styleId)) return;

        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
        log('添加样式完成');
    }

    // 解除复制限制的主要功能
    function enableCopy() {
        log('执行解除复制限制');
        const doc = document;
        const docEl = document.documentElement;
        const body = document.body;

        // 移除所有阻止复制的事件监听器
        function removeEventListeners() {
            docEl.onselectstart = docEl.oncopy = docEl.oncut = docEl.onpaste =
            docEl.onkeyup = docEl.onkeydown = docEl.oncontextmenu =
            docEl.onmousemove = docEl.onmousedown = docEl.onmouseup =
            docEl.ondragstart = null;

            body.onselectstart = body.oncopy = body.oncut = body.onpaste =
            body.onkeyup = body.onkeydown = body.oncontextmenu =
            body.onmousemove = body.onmousedown = body.onmouseup =
            body.ondragstart = null;

            doc.onselectstart = doc.oncopy = doc.oncut = doc.onpaste =
            doc.onkeyup = doc.onkeydown = doc.oncontextmenu =
            doc.onmousemove = doc.onmousedown = doc.onmouseup =
            doc.ondragstart = null;

            window.onkeyup = window.onkeydown = null;
        }

        // 移除元素的事件监听器和属性
        function cleanElement(el) {
            if (!el || el.nodeType !== 1) return;

            try {
                el.removeAttribute('oncontextmenu');
                el.removeAttribute('ondragstart');
                el.removeAttribute('onselect');
                el.removeAttribute('onselectstart');
                el.removeAttribute('onselectend');
                el.removeAttribute('oncopy');
                el.removeAttribute('onbeforecopy');
                el.removeAttribute('oncut');
                el.removeAttribute('onpaste');
                el.removeAttribute('onclick');
                el.removeAttribute('onkeydown');
                el.removeAttribute('onkeyup');
                el.removeAttribute('onmousedown');
                el.removeAttribute('onmouseup');
                el.removeAttribute('unselectable');

                // 尝试使用jQuery清理（如果存在）
                if (window.jQuery && jQuery(body) && typeof jQuery(body).off !== 'undefined') {
                    jQuery(el).off('contextmenu copy cut beforecopy beforecut beforepaste');
                    jQuery(el).unbind();
                }
            } catch (e) {
                log('清理元素属性失败:', e);
            }
        }

        // 处理所有HTML元素
        function processAllElements() {
            const tags = ['html', 'body', 'div', 'p', 'b', 'strong', 'small', 'span',
                         'pre', 'a', 'form', 'iframe', 'ul', 'li', 'dl', 'dt', 'dd',
                         'table', 'tr', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

            for (const tagName of tags) {
                const elements = document.getElementsByTagName(tagName);
                log(`处理 ${tagName} 元素, 数量: ${elements.length}`);
                for (let i = 0; i < elements.length; i++) {
                    const el = elements[i];

                    // 设置用户选择样式
                    try {
                        if (el && el.nodeType === 1) {
                            const style = el.currentStyle || window.getComputedStyle(el, null);
                            if (style && style.userSelect === 'none') {
                                el.setAttribute('style', (el.getAttribute('style') || '') + '; user-select: text !important;-webkit-user-select: text !important;-webkit-touch-callout: text !important;');
                            }

                            cleanElement(el);

                            // 添加允许默认行为的事件监听
                            const events = ['select', 'selectstart', 'selectend', 'copy', 'cut', 'paste',
                                         'keydown', 'keyup', 'keypress', 'contextmenu', 'dragstart'];
                            for (const event of events) {
                                el.addEventListener(event, allowDefault);
                            }
                        }
                    } catch (e) {
                        log('处理元素失败:', e);
                    }
                }
            }
        }

        // 添加全局事件监听器
        function addGlobalEventListeners() {
            const events = ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown',
                           'mouseup', 'mousemove', 'keydown', 'keypress', 'keyup'];

            for (const event of events) {
                document.documentElement.addEventListener(event, allowDefault, { capture: true });
            }
        }

        // 允许默认行为的事件处理函数
        function allowDefault(e) {
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            e.returnValue = true;
            return true;
        }

        // 清理jQuery事件（如果存在）
        function cleanJQuery() {
            if (window.jQuery && jQuery(body) && typeof jQuery(body).off !== 'undefined') {
                try {
                    jQuery(body).off('contextmenu copy cut beforecopy beforecut beforepaste');
                } catch (e) {
                    log('清理jQuery事件失败:', e);
                }
            }
        }

        // 执行所有清理函数
        removeEventListeners();
        processAllElements();
        cleanJQuery();
        addGlobalEventListeners();

        // 动态处理文档树变化 (MutationObserver)
        setupMutationObserver();

        log('完成解除复制限制过程');
    }

    // 设置MutationObserver监视DOM变化
    function setupMutationObserver() {
        log('设置MutationObserver');
        // 如果已经设置了观察器，不再重复设置
        if (window._superCopyObserver) return;

        // 防抖函数 - 避免频繁处理DOM变化
        const debounce = (func, delay) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        };

        // 处理DOM变化的防抖函数
        const processMutations = debounce((mutations) => {
            log(`处理 ${mutations.length} 个DOM变化`);

            // 处理新添加的元素
            const processNewNodes = (nodes) => {
                nodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                        // 处理添加的元素
                        try {
                            const style = node.currentStyle || window.getComputedStyle(node, null);
                            if (style && style.userSelect === 'none') {
                                node.setAttribute('style', (node.getAttribute('style') || '') + '; user-select: text !important;-webkit-user-select: text !important;-webkit-touch-callout: text !important;');
                            }

                            // 移除限制复制的属性
                            node.removeAttribute('oncontextmenu');
                            node.removeAttribute('oncopy');
                            node.removeAttribute('oncut');
                            node.removeAttribute('onselectstart');
                            node.removeAttribute('unselectable');

                            // 添加允许复制的事件处理
                            node.addEventListener('copy', (e) => { e.stopPropagation(); });
                            node.addEventListener('cut', (e) => { e.stopPropagation(); });
                            node.addEventListener('contextmenu', (e) => { e.stopPropagation(); });
                            node.addEventListener('selectstart', (e) => { e.stopPropagation(); });

                            // 递归处理子元素
                            if (node.children && node.children.length) {
                                processNewNodes(Array.from(node.children));
                            }
                        } catch (e) {
                            log('处理新节点失败:', e);
                        }
                    }
                });
            };

            // 处理每个变化
            mutations.forEach(mutation => {
                // 处理添加的节点
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    processNewNodes(Array.from(mutation.addedNodes));
                }

                // 处理属性变化
                if (mutation.type === 'attributes' && mutation.target.nodeType === 1) {
                    const target = mutation.target;
                    const attrName = mutation.attributeName;

                    if (attrName === 'style') {
                        try {
                            const style = target.currentStyle || window.getComputedStyle(target, null);
                            if (style && style.userSelect === 'none') {
                                target.setAttribute('style', (target.getAttribute('style') || '') + '; user-select: text !important;-webkit-user-select: text !important;-webkit-touch-callout: text !important;');
                            }
                        } catch (e) {
                            log('处理样式属性变化失败:', e);
                        }
                    } else if (attrName === 'oncontextmenu' || attrName === 'oncopy' ||
                              attrName === 'oncut' || attrName === 'onselectstart' ||
                              attrName === 'unselectable') {
                        // 移除限制复制的属性
                        target.removeAttribute(attrName);
                    }
                }
            });

            log('DOM变化处理完成');
        }, 300); // 300ms防抖延迟

        // 创建并启动MutationObserver
        try {
            const observer = new MutationObserver(processMutations);
            observer.observe(document.documentElement, {
                childList: true,     // 监视子节点添加或删除
                subtree: true,       // 监视所有后代节点
                attributes: true,    // 监视属性变化
                attributeFilter: ['style', 'oncontextmenu', 'oncopy', 'oncut', 'onselectstart', 'unselectable'] // 监视特定属性
            });

            // 保存观察器引用，避免重复设置
            window._superCopyObserver = observer;
            log('MutationObserver设置成功');
        } catch (e) {
            log('设置MutationObserver失败:', e);
        }
    }

    // 添加复制按钮功能
    function setupCopyButton() {
        log('设置复制按钮功能');

        // 防止重复添加事件监听
        if (window._superCopyButtonSetup) return;
        window._superCopyButtonSetup = true;

        // 添加复制功能
        document.body.addEventListener('mouseup', function(e) {
            // 获取选中的文本
            const selectedText = window.getSelection ? window.getSelection().toString() :
                                document.getSelection ? document.getSelection().toString() :
                                document.selection ? document.selection.createRange().text : '';

            if (!selectedText) return;
            log('检测到文本选择:', selectedText.substring(0, 20) + (selectedText.length > 20 ? '...' : ''));

            // 移除已有的复制按钮
            const existingCopy = document.getElementById('_copy');
            if (existingCopy) existingCopy.remove();

            // 创建复制按钮
            const copyButton = document.createElement('div');
            copyButton.id = '_copy';
            copyButton.style.left = (e.pageX + 30) + 'px';
            copyButton.style.top = e.pageY + 'px';
            copyButton.textContent = '复制';
            copyButton.setAttribute('data-clipboard-text', selectedText);

            // 防止事件冒泡
            copyButton.addEventListener('mousedown', function(e) {
                e.stopPropagation();
                return false;
            });

            copyButton.addEventListener('mouseup', function(e) {
                e.stopPropagation();
                return false;
            });

            // 点击复制
            copyButton.addEventListener('click', function() {
                log('点击复制按钮');
                const textarea = document.createElement('textarea');
                textarea.value = selectedText;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();

                try {
                    const successful = document.execCommand('copy');
                    copyButton.textContent = successful ? '复制成功!' : '复制失败!';
                } catch (err) {
                    copyButton.textContent = '复制失败!';
                    log('复制失败:', err);
                }

                document.body.removeChild(textarea);
                setTimeout(function() {
                    copyButton.style.display = 'none';
                    setTimeout(() => copyButton.remove(), 500);
                }, 1000);
            });

            document.body.appendChild(copyButton);
        });

        log('复制按钮功能设置完成');
    }

    // 检测当前网站
    function detectSite() {
        const url = window.location.href;

        // 百度文库
        if (url.match(/.*wk\.baidu\.com\/view\/.+/)) {
            return 'baiduwenku';
        }
        // 豆丁文档
        else if (url.match(/.*doc88\.com\/.+/)) {
            return 'doc88';
        }
        // QQ文档
        else if (url.match(/.*docs\.qq\.com\/.+/)) {
            return 'qqdoc';
        }
        // 语雀
        else if (url.match(/.*yuque\.com\/.+/)) {
            return 'yuque';
        }
        // 博客园
        else if (url.match(new RegExp('.+://boke112.com/post/.+'))) {
            return 'boke112';
        }
        // 起点小说
        else if (url.match(/qidian/)) {
            return 'qidian';
        }
        // CSDN
        else if (url.match(/csdn\.net/)) {
            return 'csdn';
        }
        // 掘金
        else if (url.match(/juejin\.cn/)) {
            return 'juejin';
        }
        // 简书
        else if (url.match(/jianshu\.com/)) {
            return 'jianshu';
        }
        // 知乎
        else if (url.match(/zhihu\.com/)) {
            return 'zhihu';
        }
        // 其他网站
        return 'other';
    }

    // 针对特定网站的处理
    function handleSpecificSites(siteType) {
        log('处理特定网站:', siteType);

        switch(siteType) {
            case 'baiduwenku':
                document.head.insertAdjacentHTML('beforeend', '<style>@media print { body{ display:block; } }</style>');
                break;

            case 'qqdoc':
                // 处理QQ文档的特殊限制
                const qqStyle = document.createElement('style');
                qqStyle.id = 'copy-hide';
                qqStyle.textContent = '#_copy{display: none !important;}';
                document.body.appendChild(qqStyle);
                break;

            case 'boke112':
                // 处理博客园的特殊限制
                document.addEventListener('click', function(e) {
                    e.stopPropagation();
                    return true;
                }, true);
                break;

            case 'qidian':
                // 处理起点的特殊限制
                const qidianStyle = document.createElement('style');
                qidianStyle.textContent = 'body { user-select: auto !important; -webkit-user-select: auto !important; }';
                document.body.appendChild(qidianStyle);

                // 移除起点的复制拦截
                document.querySelector('.main-read-container')?.addEventListener('copy', function(e) {
                    e.stopPropagation();
                    return true;
                });

                document.querySelector('.main-read-container')?.addEventListener('contextmenu', function(e) {
                    e.stopPropagation();
                    return true;
                });
                break;

            case 'csdn':
                // 处理CSDN复制限制
                const csdnStyle = document.createElement('style');
                csdnStyle.textContent = `
                    .hljs-button.signin, .hljs-button { display: none !important; }
                    code { user-select: text !important; }
                `;
                document.head.appendChild(csdnStyle);
                // 移除CSDN代码块的复制限制
                document.querySelectorAll('code').forEach(code => {
                    code.addEventListener('copy', e => e.stopPropagation());
                });
                break;

            case 'juejin':
            case 'jianshu':
            case 'zhihu':
                // 这些平台通常使用事件拦截或CSS限制
                // 通用样式处理已足够应对
                break;
        }
    }

    // Ajax完成事件监听
    function setupAjaxListener() {
        log('设置Ajax监听');

        // 防止重复设置
        if (window._superCopyAjaxSetup) return;
        window._superCopyAjaxSetup = true;

        try {
            // 覆盖原生XMLHttpRequest
            const originalXHR = window.XMLHttpRequest;
            function newXHR() {
                const xhr = new originalXHR();
                const originalOnReadyStateChange = xhr.onreadystatechange;

                xhr.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        log('检测到XMLHttpRequest完成');
                        // 延迟执行，确保DOM已更新
                        setTimeout(function() {
                            enableCopy();
                        }, 300);
                    }

                    if (originalOnReadyStateChange) {
                        originalOnReadyStateChange.apply(this, arguments);
                    }
                };

                return xhr;
            }

            window.XMLHttpRequest = newXHR;

            // 监听fetch API
            if (window.fetch) {
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                    log('检测到fetch请求');
                    return originalFetch.apply(this, args).then(response => {
                        // 返回结果后延迟处理DOM
                        setTimeout(enableCopy, 300);
                        return response;
                    });
                };
            }

            log('Ajax监听设置成功');
        } catch (e) {
            log('设置Ajax监听失败:', e);
        }
    }

    // 处理定时触发
    function setupPeriodicExecution() {
        // 处理潜在的动态加载内容
        const intervals = [1000, 3000, 5000, 10000, 15000];
        intervals.forEach(timeout => {
            setTimeout(() => {
                log(`定时执行 - ${timeout}ms`);
                enableCopy();
            }, timeout);
        });

        // 每30秒定期检查一次，持续5分钟
        let count = 0;
        const intervalId = setInterval(() => {
            count++;
            log(`周期性检查 #${count}`);
            enableCopy();

            // 5分钟后停止周期性检查
            if (count >= 10) {
                clearInterval(intervalId);
                log('周期性检查结束');
            }
        }, 30000);
    }

    // 监听页面滚动事件，处理懒加载内容
    function setupScrollListener() {
        log('设置滚动监听');

        if (window._superCopyScrollSetup) return;
        window._superCopyScrollSetup = true;

        // 使用防抖函数避免过于频繁调用
        const debounce = (func, delay) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        };

        // 滚动处理函数
        const handleScroll = debounce(() => {
            log('滚动事件触发');
            enableCopy();
        }, 500);

        // 添加滚动事件监听
        window.addEventListener('scroll', handleScroll);
    }

    // 主函数
    function main() {
        log('启动Super Copy');

        try {
            // 添加CSS样式
            addStyle(copyCSS);

            // 检测网站类型
            const siteType = detectSite();

            // 处理特定网站
            handleSpecificSites(siteType);

            // 启用复制功能
            enableCopy();

            // 设置复制按钮
            setupCopyButton();

            // 设置Ajax监听
            setupAjaxListener();

            // 设置滚动监听
            setupScrollListener();

            // 设置定期执行
            setupPeriodicExecution();

            log('Super Copy初始化完成');
        } catch (e) {
            console.error('[SuperCopy] 执行出错:', e);
        }
    }

    // 执行主函数
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();

