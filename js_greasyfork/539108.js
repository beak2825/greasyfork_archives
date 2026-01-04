// ==UserScript==
// @name         Discuz帖子列表IFrame打开展示(电脑版)
// @namespace    https://sss.921069.xyz
// @version      0.13
// @description  在Discuz论坛列表页面旁生成一个iframe，点击帖子后在iframe中打开显示
// @author       老六(uid:25038)
// @match        *://*/*?mod=forumdisplay*
// @match        *://*/forum.php?mod=forumdisplay*
// @match        *://*/forum.php?mod=guide*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539108/Discuz%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8IFrame%E6%89%93%E5%BC%80%E5%B1%95%E7%A4%BA%28%E7%94%B5%E8%84%91%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539108/Discuz%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8IFrame%E6%89%93%E5%BC%80%E5%B1%95%E7%A4%BA%28%E7%94%B5%E8%84%91%E7%89%88%29.meta.js
// ==/UserScript==

// 移动端不要使用！！！

(function() {
    'use strict';

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
        alert('(脚本作者提醒您)\r\n脚本 "妖火帖子列表IFrame打开展示(电脑版)" 不支持在移动端运行，请停止启动该脚本');
        return;
    }

    if (window.self !== window.top) {
        return;
    }

    const customCSS = `
    .boardnavr .comiis_lbox, a#filter_dateline{
      display: none;
    }
    .boardnavr .comiis_width, .boardnavr .comiis_rk{
      margin-left: unset;
    }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = customCSS;
    (document.head || document.documentElement).appendChild(style);

    const iframe = document.createElement('iframe');
    iframe.style.width = '730px';
    iframe.style.height = '100vh';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';


    const bodyWidth = 720;


    // 定义一个函数来更新布局
    function updateLayout() {
        const windowWidth = window.innerWidth;
        const totalWidth = bodyWidth + parseInt(iframe.style.width, 10);
        const leftOffset = (windowWidth - totalWidth) / 2;

        document.body.style.marginLeft = `${leftOffset}px`;
        iframe.style.left = `${leftOffset + bodyWidth}px`;
    }

    updateLayout();
    document.body.appendChild(iframe);

    window.addEventListener('resize', updateLayout);


    // 为iframe添加load事件监听器
    iframe.addEventListener('load', function() {
        // 获取iframe内的文档
        const iframeDocument = this.contentDocument || this.contentWindow.document;
        // 查找.biaotiwenzi元素
        const biaotiwenziElement = iframeDocument.querySelector('#thread_subject');
        // 如果找到元素，则滚动到该元素
        if (biaotiwenziElement) {
            biaotiwenziElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // 为iframe内的链接添加点击事件监听器
        const iframeLinks = iframeDocument.querySelectorAll('a');
        iframeLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                const href = this.getAttribute('href');
                if (href) {
                    const url = new URL(href, iframeDocument.baseURI);
                    if (!url.hostname.includes('921069.xyz') || (url.hostname.includes('921069.xyz') && url.href.includes("mod=attachment"))) {
                        event.preventDefault();
                        window.open(href, '_blank');
                    }
                }
            });
        });
    });

    // 定义一个函数来为链接添加点击事件监听器
    function setupLinkEvents() {
        let links = document.querySelectorAll('tbody[id^="normalthread_"] > tr > th > a.s.xst');
        links = !links.length ? document.querySelectorAll('tbody[id^="normalthread_"] > tr > th > a.xst') :links;
        links = !links.length ? document.querySelectorAll('tbody[id^="normalthread_"] .comiis_common>a[onclick]:nth-child(2)') :links;
        console.log("Discuz帖子列表IFrame打开展示(电脑版)");
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

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                setupLinkEvents();
            }
        }
    });

    // 观察可能包含新列表项的父元素
    const targetNode = document.getElementById('threadlisttableid') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });
})();