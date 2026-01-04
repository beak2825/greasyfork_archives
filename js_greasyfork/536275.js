// ==UserScript==
// @name         TiktokShop点击复制名称插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键复制
// @author       Yizhe
// @match        https://partner.us.tiktokshop.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536275/TiktokShop%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6%E5%90%8D%E7%A7%B0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/536275/TiktokShop%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6%E5%90%8D%E7%A7%B0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 创建 Toast 提示元素
    const toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.transform = 'translateY(-20px)';
    toast.style.zIndex = '999999';
    toast.style.fontFamily = 'sans-serif';
    toast.innerText = '已复制到剪贴板';
    document.body.appendChild(toast);

    // 显示Toast的方法
    function showToast() {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
        }, 2000);
    }

    // 初始化逻辑
    function initCopyOnClick() {
        document.querySelectorAll('.index-title--AnTxK').forEach(el => {
            el.style.cursor = 'pointer';
            el.addEventListener('click', async () => {
                const text = el.innerText.trim();
                if (!text) return;

                try {
                    await navigator.clipboard.writeText(text);
                    showToast();
                } catch (err) {
                    console.error('复制失败:', err);
                    alert('复制失败，请重试');
                }
            });
        });
    }

    // 使用 MutationObserver 监听 DOM 变化（支持动态加载的内容）
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    node.querySelectorAll && node.querySelectorAll('.index-title--AnTxK').forEach(el => {
                        if (window.getComputedStyle(el).cursor !== 'pointer') {
                            el.style.cursor = 'pointer';
                            el.addEventListener('click', async () => {
                                const text = el.innerText.trim();
                                if (!text) return;

                                try {
                                    await navigator.clipboard.writeText(text);
                                    showToast();
                                } catch (err) {
                                    console.error('复制失败:', err);
                                    alert('复制失败，请重试');
                                }
                            });
                        }
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始注入样式和事件监听
    initCopyOnClick();
    // Your code here...
})();