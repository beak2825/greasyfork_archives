// ==UserScript==
// @name         Steam鉴赏家页面评测栏优化
// @namespace    https://steamcommunity.com/
// @version      1.3
// @description  重构评测栏使短评无需点击进入就能完整显示和复制评测文本
// @author       sjx01
// @match        https://store.steampowered.com/curator/*
// @exclude      https://store.steampowered.com/curator/*/admin/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532513/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E9%A1%B5%E9%9D%A2%E8%AF%84%E6%B5%8B%E6%A0%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532513/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E9%A1%B5%E9%9D%A2%E8%AF%84%E6%B5%8B%E6%A0%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG_KEY = 'steam_layout_optimization_v1.3';
    let isEnabled = GM_getValue(CONFIG_KEY, true);
    const processedCache = new WeakMap();
    let observer = null;
    let rafId = null; // 用于性能节流

    GM_registerMenuCommand(`🎮 评测栏布局优化: ${isEnabled ? '开' : '关'}`, toggleFeature);

    function injectProStyles() {
        if (document.getElementById('steam-pro-layout-v2.0')) return;

        const style = document.createElement('style');
        style.id = 'steam-pro-layout-v2.0';
        style.textContent = `
            /* --- 容器布局 --- */
            .recommendation.processed-by-script {
                display: grid !important;
                grid-template-columns: 230px 1fr !important;
                gap: 20px !important;
                padding: 16px !important;
                background: rgba(0, 0, 0, 0.2) !important;
                border-radius: 4px !important;
                margin-bottom: 15px !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
                align-items: start !important;
                height: auto !important;
                transition: background 0.2s ease;
            }
            .recommendation.processed-by-script:hover {
                background: rgba(0, 0, 0, 0.3) !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
            }

            /* --- 头部信息 --- */
            .recommendation_header {
                display: flex;
                align-items: center;
                height: 24px;
                margin-bottom: 8px;
            }
            .recommendation_type_ctn {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            .recommendation_type_ctn > * {
                margin: 0 !important;
            }
            .app_platforms {
                margin-left: 8px !important;
                display: flex !important;
                gap: 4px !important;
                opacity: 0.8;
            }

            /* --- 图片区域 --- */
            .capsule.smallcapsule {
                width: 100% !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                border-radius: 3px;
                overflow: hidden;
                transition: transform 0.2s;
            }
            .capsule.smallcapsule:hover {
                transform: scale(1.02);
            }

            /* --- 文本区域 --- */
            .recommendation_desc {
                position: relative !important;
                line-height: 1.6 !important;
                font-size: 13px !important;
                color: #c6d4df !important;
                padding: 0 0 0 28px !important;
                margin: 5px 0 15px 0 !important;
            }

            /* 重写 Steam 原生引号 */
            .recommendation_desc::before {
                position: absolute !important;
                top: -2px !important; /* 向上微调，对齐第一行字 */
                left: 5px !important; /* 向右移动，靠近文字 */
                font-family: Arial, sans-serif !important;
                font-size: 40px !important;
                opacity: 0.3 !important;
                color: #67c1f5 !important;
                line-height: 1 !important;
            }

            .recommendation_desc::after {
                position: absolute !important;
                font-family: Arial, sans-serif !important;
                font-size: 40px !important;
                opacity: 0.3 !important;
                color: #67c1f5 !important;
                line-height: 1 !important;
                padding-left: 6px; /* 跟左侧文字保持一定间距 */
            }

            /* --- 右侧内容流 --- */
            .recommendation_content {
                display: flex !important;
                flex-direction: column;
                height: 100%;
                justify-content: space-between; /* 确保底部对齐 */
                min-width: 0;
            }

            /* --- 激活码样式 --- */
            .steam-key-highlight {
                background: rgba(103, 193, 245, 0.15);
                color: #67c1f5;
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px dashed rgba(103, 193, 245, 0.5);
                font-family: "Consolas", monospace;
                font-size: 12px;
                cursor: pointer;
                user-select: all;
                transition: all 0.2s;
            }
            .steam-key-highlight:hover {
                background: rgba(103, 193, 245, 0.3);
                border-color: #67c1f5;
                color: #fff;
            }

            /* --- 底部布局 (价格和评测链接按钮) --- */
            .recommendation_footer {
                display: flex !important;
                justify-content: space-between;
                align-items: flex-end; /* 底部对齐 */
                margin-top: auto; /* 自动推到底部 */
                padding-top: 12px;
                border-top: 1px solid rgba(255,255,255,0.05);
            }

            /* 按钮组容器 */
            .footer_actions {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            /* 统一按钮样式 */
            .pro-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 4px 12px;
                font-size: 12px;
                border-radius: 2px;
                text-decoration: none !important;
                transition: all 0.2s;
                background: rgba(255, 255, 255, 0.1);
                color: #b8b6b4 !important;
                line-height: 1.4;
                white-space: nowrap;
            }
            .pro-btn:hover {
                background: #67c1f5;
                color: #fff !important;
                box-shadow: 0 2px 8px rgba(103, 193, 245, 0.3);
            }
            /* 完整评测按钮高亮一点 */
            .pro-btn.full-review {
                background: rgba(103, 193, 245, 0.2);
                color: #67c1f5 !important;
            }
            .pro-btn.full-review:hover {
                background: #67c1f5;
                color: #fff !important;
            }

        `;
        document.head.appendChild(style);
    }

    // 使用 requestAnimationFrame 节流，提高滚动时的性能
    function scheduleProcessing() {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            processAllItems();
            rafId = null;
        });
    }

    function processAllItems() {
        // 只选择尚未处理的元素
        const recommendations = document.querySelectorAll('.recommendation:not(.processed-by-script)');
        recommendations.forEach(item => {
            if (processedCache.has(item)) return;
            processedCache.set(item, true);
            rebuildStructure(item);
        });
    }

    function rebuildStructure(recommendation) {
        // 1. 提取左侧图片 (保留原始事件和属性)
        const capsuleDiv = recommendation.querySelector('.capsule');
        let imageLink = capsuleDiv ? capsuleDiv.closest('a') : null;

        // 2. 从图片链接中提取价格块
        let priceBlock = null;
        if (imageLink) {
            // 找到图片链接中的价格块
            priceBlock = imageLink.querySelector('.discount_block');
            if (priceBlock) {
                // 克隆价格块以便后续使用
                priceBlock = priceBlock.cloneNode(true);
                // 移除图片链接中的原始价格块
                imageLink.querySelector('.discount_block')?.remove();
            }
        }

        // 3. 提取并构建各部分
        const headerContent = extractHeader(recommendation);
        const descContent = extractDescription(recommendation);
        const footerContent = buildFooter(recommendation, priceBlock); // 传入提取的价格块

        // 4. 组装右侧内容容器
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'recommendation_content';
        contentWrapper.append(headerContent, descContent, footerContent);

        // 5. 清空并重新填充主容器
        recommendation.innerHTML = '';
        recommendation.classList.add('processed-by-script');

        if (imageLink) {
            // 确保图片链接只包含图片
            const cleanImageLink = document.createElement('a');
            cleanImageLink.href = imageLink.href;
            cleanImageLink.className = imageLink.className;
            cleanImageLink.onmouseover = imageLink.onmouseover;
            cleanImageLink.onmouseout = imageLink.onmouseout;
            cleanImageLink.setAttribute('data-ds-appid', imageLink.getAttribute('data-ds-appid'));
            cleanImageLink.setAttribute('data-ds-itemkey', imageLink.getAttribute('data-ds-itemkey'));
            cleanImageLink.setAttribute('data-ds-tagids', imageLink.getAttribute('data-ds-tagids'));
            cleanImageLink.setAttribute('data-ds-crtrids', imageLink.getAttribute('data-ds-crtrids'));

            // 只添加图片
            if (capsuleDiv) {
                cleanImageLink.appendChild(capsuleDiv.cloneNode(true));
            }

            recommendation.appendChild(cleanImageLink);
        }

        recommendation.appendChild(contentWrapper);
    }

    function extractHeader(recommendation) {
        const header = document.createElement('div');
        header.className = 'recommendation_header';

        // 提取 图标 和 平台
        const typeCtn = recommendation.querySelector('.recommendation_type_ctn');
        if (typeCtn) header.appendChild(typeCtn.cloneNode(true));

        return header;
    }

    function extractDescription(recommendation) {
        const descDiv = document.createElement('div');
        descDiv.className = 'recommendation_desc';
        const originalDesc = recommendation.querySelector('.recommendation_desc');
        let html = originalDesc ? originalDesc.innerHTML : '';

        // 激活码正则高亮
        const keyRegex = /\b([A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5})\b/g;
        if (html.match(keyRegex)) {
             html = html.replace(keyRegex, '<span class="steam-key-highlight" title="点击复制">$1</span>');
        }

        descDiv.innerHTML = html;

        // 绑定复制事件
        descDiv.querySelectorAll('.steam-key-highlight').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // 防止触发外层链接
                navigator.clipboard.writeText(el.innerText).then(() => {
                    const oldText = el.innerText;
                    el.style.width = el.offsetWidth + 'px'; // 固定宽度防止抖动
                    el.innerText = '已复制';
                    el.style.textAlign = 'center';
                    setTimeout(() => {
                        el.innerText = oldText;
                        el.style.width = '';
                        el.style.textAlign = '';
                    }, 1000);
                });
            });
        });
        return descDiv;
    }

    function buildFooter(recommendation, priceBlock) {
        const footer = document.createElement('div');
        footer.className = 'recommendation_footer';

        // 1. 左侧：价格块（使用传入的参数）
        if (priceBlock) {
            footer.appendChild(priceBlock);
        } else {
            // 如果没有价格块，检查是否有免费标签或其他价格信息
            const freeLabel = recommendation.querySelector('.discount_block_inline');
            if (freeLabel) {
                footer.appendChild(freeLabel.cloneNode(true));
            } else {
                // 添加一个空占位保持 justify-space-between 布局
                footer.appendChild(document.createElement('div'));
            }
        }

        // 2. 右侧：按钮组
        const actionsCtn = document.createElement('div');
        actionsCtn.className = 'footer_actions';

        // 获取 "查看短评" 链接
        const shortReviewLink = recommendation.querySelector('a.recommendation_link');
        // 获取 "查看完整评测" 链接
        const fullReviewLink = recommendation.querySelector('a[href*="/recommended/"]');

        // 如果有完整评测，短评放前面；如果没有，只有短评
        if (shortReviewLink) {
            const btn = shortReviewLink.cloneNode(true);
            btn.textContent = '查看短评';
            btn.className = 'pro-btn short-review';
            // 清除原有内联样式
            btn.style = '';
            actionsCtn.appendChild(btn);
        }

        if (fullReviewLink) {
            const btn = fullReviewLink.cloneNode(true);
            btn.textContent = '查看完整评测';
            btn.className = 'pro-btn full-review';
            // 清除原有内联样式
            btn.style = '';
            actionsCtn.appendChild(btn);
        }

        footer.appendChild(actionsCtn);
        return footer;
    }

    function initMod() {
        const target = document.getElementById('RecommendationsRows');
        if (!target) return; // 没找到列表容器就不执行

        injectProStyles();
        processAllItems();

        if (!observer) {
            observer = new MutationObserver((mutations) => {
                // 防抖：只要有变化就请求调度，合并短时间内的请求
                scheduleProcessing();
            });
            observer.observe(target, { childList: true, subtree: true });
        }
    }

    function toggleFeature() {
        isEnabled = !isEnabled;
        GM_setValue(CONFIG_KEY, isEnabled);
        location.reload();
    }

    if (isEnabled) {
        // 延迟一点执行确保 Steam 自身脚本初始化完毕
        setTimeout(initMod, 100);
        window.addEventListener('load', initMod);
    }
})();
