// ==UserScript==
// @name         妖火帖子列表IFrame打开展示(自适应兼容非全屏版)
// @namespace    https://yaohuo.me/
// @version      0.21
// @description  在妖火论坛列表页面左侧显示列表，右侧iframe中打开帖子，各占一半屏幕宽度
// @author       我黄某与赌毒不两立
// @match        *://yaohuo.me/bbs/book_list*
// @match        *://yaohuo.me/bbs/list*
// @match        *://yaohuo.me/bbslist-*
// @match        *://www.yaohuo.me/bbs/book_list*
// @match        *://www.yaohuo.me/bbs/list*
// @match        *://www.yaohuo.me/bbslist-*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533160/%E5%A6%96%E7%81%AB%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8IFrame%E6%89%93%E5%BC%80%E5%B1%95%E7%A4%BA%28%E8%87%AA%E9%80%82%E5%BA%94%E5%85%BC%E5%AE%B9%E9%9D%9E%E5%85%A8%E5%B1%8F%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533160/%E5%A6%96%E7%81%AB%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8IFrame%E6%89%93%E5%BC%80%E5%B1%95%E7%A4%BA%28%E8%87%AA%E9%80%82%E5%BA%94%E5%85%BC%E5%AE%B9%E9%9D%9E%E5%85%A8%E5%B1%8F%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移动端不运行
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
        alert('(脚本作者提醒您)\r\n脚本 "妖火帖子列表IFrame打开展示(电脑版)" 不支持在移动端运行，请停止启动该脚本');
        return;
    }

    // 防止被嵌套在其他网页的iframe中运行
    if (window.self !== window.top) {
        return;
    }

    // 创建iframe元素
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.right = '0';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';

    // 将iframe添加到页面中
    document.body.appendChild(iframe);

    // 更新布局函数：左右各占50%
    function updateLayout() {
        const halfWidth = window.innerWidth / 2;

        // 设置iframe宽度和位置
        iframe.style.width = `${halfWidth}px`;
        iframe.style.left = `${halfWidth}px`; // 右侧

        // 设置主内容区宽度为左边50%
        document.body.style.width = `${halfWidth}px`;
        document.body.style.marginLeft = '0'; // 居左显示
        document.body.style.float = 'left';
    }

    // 初始调用和窗口大小变化时更新布局
    updateLayout();
    window.addEventListener('resize', updateLayout);

    // iframe加载完成后的处理
    iframe.addEventListener('load', function () {
        const iframeDocument = this.contentDocument || this.contentWindow.document;

        // 自动滚动到标题区域（如果有的话）
        const biaotiwenziElement = iframeDocument.querySelector('.biaotiwenzi');
        if (biaotiwenziElement) {
            biaotiwenziElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // 处理iframe内部链接点击事件：非站内链接或下载链接在新标签页打开
        const iframeLinks = iframeDocument.querySelectorAll('a');
        iframeLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                const href = this.getAttribute('href');
                if (href) {
                    const url = new URL(href, iframeDocument.baseURI);
                    if (!url.hostname.includes('yaohuo.me') ||
                        (url.hostname.includes('yaohuo.me') && url.href.includes("download.aspx"))) {
                        event.preventDefault();
                        window.open(href, '_blank');
                    }
                }
            });
        });
    });

    // 给所有帖子链接绑定点击事件，加载到iframe中
    function setupLinkEvents() {
        const links = document.querySelectorAll('.topic-link');
        links.forEach(link => {
            if (!link.hasAttribute('data-clicked')) {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    const href = this.getAttribute('href');
                    iframe.src = href;
                    this.style.color = 'red';
                    this.setAttribute('data-clicked', 'true');
                });
            }
        });
    }

    setupLinkEvents();

    // 监听DOM变化（用于支持分页等动态加载的内容）
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                setupLinkEvents();
            }
        }
    });

    const targetNode = document.getElementById('KL_show_next_list') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });
})();