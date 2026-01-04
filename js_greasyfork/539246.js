// ==UserScript==
// @name         知乎AI搜索高亮移除工具
// @namespace    https://github.com/yc-w-cn/zhihu-ai-highlight-remover
// @supportURL   https://github.com/yc-w-cn/zhihu-ai-highlight-remover/issues
// @version      1.2
// @description  移除知乎文章中的AI搜索高亮提示，提供调试模式
// @author       Yuchen Wang <contact@wangyuchen.cn>
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539246/%E7%9F%A5%E4%B9%8EAI%E6%90%9C%E7%B4%A2%E9%AB%98%E4%BA%AE%E7%A7%BB%E9%99%A4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/539246/%E7%9F%A5%E4%B9%8EAI%E6%90%9C%E7%B4%A2%E9%AB%98%E4%BA%AE%E7%A7%BB%E9%99%A4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 配置区域 =====
    const DEBUG_MODE = false; // 设为true启用调试日志
    const CHECK_INTERVAL = 1000; // 检查新内容的间隔(毫秒)
    // ===================

    // 调试日志函数
    function debugLog(...args) {
        if (DEBUG_MODE) {
            console.log('[知乎AI移除工具]', ...args);
        }
    }

    // 主清理函数
    function removeAIHighlights() {
        debugLog('开始扫描AI高亮元素...');

        // 查找所有AI高亮链接
        const aiLinks = document.querySelectorAll('a.RichContent-EntityWord');
        debugLog(`找到 ${aiLinks.length} 个AI高亮链接`);

        aiLinks.forEach(link => {
            // 检查是否已经被处理过
            if (link.dataset.aiProcessed) {
                debugLog('跳过已处理的链接:', link.textContent);
                return;
            }

            debugLog('处理链接:', link.textContent);

            // 创建文本节点替换链接
            const textNode = document.createTextNode(link.textContent);
            const parent = link.parentNode;

            if (parent) {
                parent.replaceChild(textNode, link);
                debugLog('链接已替换为文本:', textNode.textContent);

                // 标记为已处理
                textNode.dataset = textNode.dataset || {};
                textNode.dataset.aiProcessed = 'true';

                // 清理可能的空标签
                cleanupEmptyTags(parent);
            }
        });

        // 移除AI图标
        const aiIcons = document.querySelectorAll('svg.ZDI--FourPointedStar16');
        debugLog(`找到 ${aiIcons.length} 个AI图标`);

        aiIcons.forEach(icon => {
            debugLog('移除AI图标');
            icon.remove();
        });

        debugLog('扫描完成');
    }

    // 清理空标签
    function cleanupEmptyTags(element) {
        if (!element || !element.childNodes || element.childNodes.length > 0) {
            return;
        }

        if (element.nodeName === 'SPAN' && !element.textContent.trim()) {
            debugLog('移除空标签:', element);
            element.remove();
        }
    }

    // 初始清理
    removeAIHighlights();

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(mutations => {
        let foundChanges = false;

        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                foundChanges = true;
            }
        });

        if (foundChanges) {
            debugLog('检测到DOM变化，重新扫描...');
            setTimeout(removeAIHighlights, 500);
        }
    });

    // 配置并启动observer
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 定期检查（处理动态加载内容）
    setInterval(removeAIHighlights, CHECK_INTERVAL);

    debugLog('脚本已启动，调试模式:', DEBUG_MODE);
})();