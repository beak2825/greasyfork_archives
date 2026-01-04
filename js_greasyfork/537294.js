// ==UserScript==
// @name         LinkedIn智能主页内容抓取器
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  排除广告区域的专业级内容抓取工具
// @author       Charlie
// @license MIT
// @match        https://www.linkedin.com/company/*
// @match        https://www.linkedin.com/company/builtinhob/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/537294/LinkedIn%E6%99%BA%E8%83%BD%E4%B8%BB%E9%A1%B5%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537294/LinkedIn%E6%99%BA%E8%83%BD%E4%B8%BB%E9%A1%B5%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 广告容器特征
    const AD_SELECTOR = 'div[data-testid="text-ads-container"]';

    // 智能元素检测
    const isInAdContainer = (element) => {
        return element.closest(AD_SELECTOR) !== null;
    };

    // 创建防干扰按钮
    const createSafeButton = () => {
        const btn = document.createElement('button');
        btn.id = 'safeCopyBtn';
        btn.textContent = "🚀 安全复制";

        // 按钮动态定位
        Object.assign(btn.style, {
            position: 'fixed',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10000,
            padding: '12px 24px',
            background: '#2E7D32',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            fontSize: '14px',
            fontWeight: 'bold'
        });

        // 确保按钮不在广告容器内
        document.body.appendChild(btn);
        return btn;
    };

    // 增强型内容获取
    const getFilteredContent = () => {
        return Array.from(document.querySelectorAll('span[dir="ltr"]'))
            .filter(span => {
                // 多层过滤条件
                return !isInAdContainer(span) &&
                       span.offsetParent !== null &&
                       span.getClientRects().length > 0;
            })
            .map(span => {
                // 内容清洗
                return span.innerText
                    .trim()
                    .replace(/\s{2,}/g, ' ')
                    .replace(/[\u00A0\u1680\u2000-\u200F\u202F\u205F\u3000]/g, ' ');
            })
            .filter(text => text.length > 10)  // 过滤短文本
            .join('\n\n━━━━━━━━━━\n\n');  // 专业分隔符
    };

    // 智能提示系统
    const showSmartToast = (message, isError = false) => {
        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: isError ? '#D32F2F' : '#388E3C',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '14px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            animation: 'fadeInOut 3s forwards'
        });
        toast.textContent = message;

        // 添加动画效果
        document.head.insertAdjacentHTML('style', `
            @keyframes fadeInOut {
                0% { opacity: 0; bottom: 0; }
                10% { opacity: 1; bottom: 30px; }
                90% { opacity: 1; bottom: 30px; }
                100% { opacity: 0; bottom: 60px; }
            }
        `);

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // 主逻辑
    const init = () => {
        // 清理可能存在的广告按钮
        document.querySelectorAll(AD_SELECTOR + ' #safeCopyBtn').forEach(b => b.remove());

        const btn = createSafeButton();

        btn.addEventListener('click', () => {
            try {
                const content = getFilteredContent();
                if (!content) {
                    showSmartToast('⚠️ 未发现有效内容', true);
                    return;
                }

                GM_setClipboard(content);
                showSmartToast(`✅ 已安全复制 ${content.split('\n\n').length} 条优质内容`);

                // 添加临时视觉反馈
                btn.style.transform = 'translateY(-50%) scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'translateY(-50%) scale(1)';
                }, 100);
            } catch (error) {
                showSmartToast(`❌ 安全复制失败: ${error.message}`, true);
            }
        });

        // 防御性DOM监听
        new MutationObserver(() => {
            if (!document.body.contains(btn)) {
                document.body.appendChild(btn);
            }
        }).observe(document.body, { childList: true });
    };

    // 安全启动
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);  // 等待动态内容加载
    }
})();
