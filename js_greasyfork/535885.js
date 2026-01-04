// ==UserScript==
// @name            [银河奶牛]游戏内链接快速查看
// @name:en         [MWI]In-Game Link Quick Viewer
// @namespace       https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-dialog-link-viewer
// @description     说明：游戏里面的链接还是直接在游戏里面查看比较方便，这个插件能帮到你。
// @description:en  It's more convenient to check the links within the game directly, and this plugin can assist you with that.
// @version         1.0.4
// @author          shenhuanjie
// @license         MIT
// @homepage        https://greasyfork.org/scripts/535885
// @supportURL      https://greasyfork.org/scripts/535885
// @match           https://www.milkywayidle.com/*
// @icon            https://www.milkywayidle.com/favicon.svg
// @grant           GM_addStyle
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/535885/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%B8%B8%E6%88%8F%E5%86%85%E9%93%BE%E6%8E%A5%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/535885/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%B8%B8%E6%88%8F%E5%86%85%E9%93%BE%E6%8E%A5%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #dialog-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
        }

        #dialog-container.active {
            display: flex;
        }

        #dialog-content {
            background-color: white;
            width: 90%;
            height: 90%;
            max-width: 1600px;
            max-height: 900px;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            transform: scale(0.95);
            transition: transform 0.3s ease;
        }

        #dialog-container.active #dialog-content {
            transform: scale(1);
        }

        #dialog-header {
            padding: 16px 24px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f8f9fa;
        }

        #dialog-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            max-width: 80%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        #dialog-close {
            cursor: pointer;
            font-size: 28px;
            line-height: 1;
            color: #666;
            transition: color 0.2s;
        }

        #dialog-close:hover {
            color: #333;
        }

        #dialog-body {
            flex-grow: 1;
            overflow: hidden;
            position: relative;
        }

        #dialog-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        .dialog-loading {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: white;
            z-index: 1;
            opacity: 1;
            transition: opacity 0.3s;
        }

        .dialog-loading.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .dialog-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .dialog-error {
            text-align: center;
            padding: 20px;
        }

        .dialog-error p {
            margin: 10px 0;
        }

        .dialog-error a {
            color: #2196F3;
            text-decoration: underline;
        }
    `);

    // 创建容器元素
    const container = document.createElement('div');
    container.id = 'dialog-container';
    container.innerHTML = `
        <div id="dialog-content">
            <div id="dialog-header">
                <div id="dialog-title"></div>
                <div id="dialog-close">&times;</div>
            </div>
            <div id="dialog-body">
                <div class="dialog-loading">
                    <div class="dialog-spinner"></div>
                </div>
                <iframe id="dialog-iframe" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 获取元素引用
    const dialogContainer = document.getElementById('dialog-container');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogIframe = document.getElementById('dialog-iframe');
    const dialogClose = document.getElementById('dialog-close');
    const dialogLoading = container.querySelector('.dialog-loading');

    let currentUrl = '';

    // 关闭对话框
    dialogClose.addEventListener('click', () => {
        closeDialog();
    });

    // 点击外部关闭
    dialogContainer.addEventListener('click', (e) => {
        if (e.target === dialogContainer) {
            closeDialog();
        }
    });

    // 关闭对话框函数
    function closeDialog() {
        dialogContainer.classList.remove('active');
        setTimeout(() => {
            dialogIframe.src = 'about:blank';
        }, 300);
    }

    // 键盘事件监听
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dialogContainer.classList.contains('active')) {
            closeDialog();
        }
    });

    // 拦截链接点击
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && !link.hasAttribute('download') && !link.hasAttribute('target')) {
            // 阻止事件冒泡和默认行为
            e.stopPropagation();
            e.preventDefault();

            // 获取完整URL
            const url = new URL(link.href, window.location.href).href;
            openLinkInDialog(url, link.textContent);
        }
    }, true); // 使用捕获阶段

    // 在对话框中打开链接
    function openLinkInDialog(url, title) {
        // 防止打开内部链接
        if (url.startsWith(window.location.origin)) {
            // 内部链接
            window.location.href = url;
            return;
        }
        currentUrl = url;
        dialogTitle.textContent = title || url;
        dialogLoading.classList.remove('hidden');
        dialogLoading.innerHTML = '<div class="dialog-spinner"></div>';
        dialogContainer.classList.add('active');

        // 设置iframe源
        dialogIframe.src = url;

        // 监听iframe加载完成
        dialogIframe.onload = () => {
            try {
                // 尝试获取iframe标题更新对话框标题
                const iframeDoc = dialogIframe.contentDocument;
                if (iframeDoc && iframeDoc.title) {
                    dialogTitle.textContent = iframeDoc.title;
                }
            } catch (e) {
                // 跨域访问会抛出异常
            }

            setTimeout(() => {
                dialogLoading.classList.add('hidden');
            }, 300);
        };

        // 错误处理
        dialogIframe.onerror = () => {
            dialogLoading.innerHTML = `
                <div class="dialog-error">
                    <p style="color:red;">无法在iframe中加载此页面</p>
                    <p>可能是因为网站安全策略限制</p>
                    <a href="${url}" target="_blank">点击此处直接访问</a>
                </div>
            `;
        };
    }

    // 添加MutationObserver监听DOM变化
    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            // 重新绑定新添加的链接
            bindDynamicLinks();
        }, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 绑定动态加载的链接
    function bindDynamicLinks() {
      // 劫持页面上所有a标签的点击事件
        document.querySelectorAll('a').forEach(link => {
          // 保存原始的href属性
          const originalHref = link.getAttribute('href');
          // 为每个a标签添加点击事件监听器
          link.addEventListener('click', function(e) {
            // 阻止默认的点击行为
            e.preventDefault();

            openLinkInDialog(originalHref, link.textContent);
          });
        });
    }

    // 初始化绑定所有链接
    bindDynamicLinks();
})();