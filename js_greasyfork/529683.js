// ==UserScript==
// @name         妖火帖子列表IFrame打开展示(电脑版)
// @namespace    https://yaohuo.me/bbs/userinfo.aspx?touserid=25038
// @version      0.17
// @description  在妖火论坛列表页面旁生成一个iframe，点击帖子后在iframe中打开显示
// @author       老六(uid:25038)
// @match        *://yaohuo.me/bbs/book_list*
// @match        *://yaohuo.me/bbs/list*
// @match        *://yaohuo.me/bbslist-*
// @match        *://www.yaohuo.me/bbs/book_list*
// @match        *://www.yaohuo.me/bbs/list*
// @match        *://www.yaohuo.me/bbslist-*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529683/%E5%A6%96%E7%81%AB%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8IFrame%E6%89%93%E5%BC%80%E5%B1%95%E7%A4%BA%28%E7%94%B5%E8%84%91%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529683/%E5%A6%96%E7%81%AB%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8IFrame%E6%89%93%E5%BC%80%E5%B1%95%E7%A4%BA%28%E7%94%B5%E8%84%91%E7%89%88%29.meta.js
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
 
    const iframe = document.createElement('iframe');
    iframe.style.width = '720px';
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
 
    iframe.addEventListener('load', function() {
        const iframeDocument = this.contentDocument || this.contentWindow.document;
        const biaotiwenziElement = iframeDocument.querySelector('.biaotiwenzi');
        if (biaotiwenziElement) {
            biaotiwenziElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
 
        const iframeLinks = iframeDocument.querySelectorAll('a');
        iframeLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                const href = this.getAttribute('href');
                if (href) {
                    const url = new URL(href, iframeDocument.baseURI);
                    if (!url.href.toLowerCase().startsWith('javascript:') && (!url.hostname.includes('yaohuo.me') || (url.hostname.includes('yaohuo.me') && url.href.includes("download.aspx")))) {
                        event.preventDefault();
                        window.open(href, '_blank');
                    }
                }
            });
        });
    });
 
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