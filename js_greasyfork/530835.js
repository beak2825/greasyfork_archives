// ==UserScript==
// @name         知乎专栏外链自动跳转
// @namespace    https://github.com/leiqichn
// @version      3.1
// @description  专为知乎专栏优化的外链自动跳转，支持最新页面结构
// @author       Lei Qi 
// @match        https://zhuanlan.zhihu.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530835/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/530835/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 深度解码URL（处理知乎新的多层编码）
    const decodeZhihuUrl = (encodedUrl) => {
        try {
            let decoded = encodedUrl;
            // 检测是否包含多重编码特征
            while(/%[0-9A-Fa-f]{2}/.test(decoded)) {
                decoded = decodeURIComponent(decoded);
            }
            // 处理可能的Base64编码（新发现的特征）
            if(decoded.startsWith('http%3A') && decoded.length > 100){
                const b64Match = decoded.match(/b64=(.*?)(&|$)/);
                if(b64Match){
                    return atob(b64Match[1]);
                }
            }
            return decoded;
        } catch(e) {
            console.warn('URL解码失败:', e);
            return encodedUrl;
        }
    };

    // 强化链接处理
    const enhanceLinks = () => {
        document.querySelectorAll('a').forEach(link => {
            try {
                const urlObj = new URL(link.href);

                // 匹配知乎专栏专用跳转模式
                const isZhihuRedirect =
                    urlObj.hostname === 'link.zhihu.com' ||
                    urlObj.pathname === '/platform-api/redirect';

                if(isZhihuRedirect && urlObj.searchParams.has('target')){
                    // 处理多层编码的target参数
                    const rawTarget = urlObj.searchParams.get('target');
                    const finalUrl = decodeZhihuUrl(rawTarget);

                    // 创建新链接并保留重要属性
                    const newLink = link.cloneNode(true);
                    newLink.href = finalUrl;

                    // 清除知乎的事件监听（重要！）
                    newLink.replaceWith(...newLink.childNodes);
                    link.parentNode.replaceChild(newLink, link);
                }
            } catch(e) {
                // 忽略无效链接
            }
        });
    };

    // 使用高性能MutationObserver
    const observer = new MutationObserver(mutations => {
        if(!mutations) return;
        for(const mutation of mutations) {
            if(mutation.type === 'childList') {
                enhanceLinks();
            }
        }
    });

    // 劫持所有点击事件（优先级最高）
    document.addEventListener('click', e => {
        const link = e.target.closest('a');
        if(link) {
            const href = link.href;
            // 匹配知乎专栏外链特征
            if(href && /(link\.zhihu\.com|redirect\/target)/.test(href)) {
                e.stopImmediatePropagation();
                e.preventDefault();
                window.location.href = decodeZhihuUrl(
                    new URL(href).searchParams.get('target') || href
                );
                return false;
            }
        }
    }, true); // 捕获阶段执行

    // 初始化设置
    observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: false,
        characterData: false
    });

    // 即时处理现有内容
    enhanceLinks();

    // 防御知乎动态脚本（每500ms检查一次）
    setInterval(() => {
        // 清除知乎的跳转弹窗
        const modals = document.querySelectorAll('.Modal-wrapper, .SecurityModal');
        modals.forEach(modal => modal.remove());

        // 覆盖弹窗相关方法
        window.alert = function(){};
        window.confirm = function(){ return true; };
    }, 500);

    // 伪装成正常流量
    Object.defineProperty(navigator, 'userAgent', {
        value: navigator.userAgent.replace(/Tampermonkey|HeadlessChrome/, ''),
        configurable: false,
        enumerable: true,
        writable: false
    });
})();