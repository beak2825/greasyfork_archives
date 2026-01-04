// ==UserScript==
// @name         战字加粗 (优化版)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将网页中所有的"战"字加粗显示，优化性能防止卡死
// @author       您的名字
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536843/%E6%88%98%E5%AD%97%E5%8A%A0%E7%B2%97%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536843/%E6%88%98%E5%AD%97%E5%8A%A0%E7%B2%97%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置选项
    const config = {
        processDelay: 1000,          // 初始延迟时间(毫秒)
        batchSize: 100,              // 每批处理的节点数量
        batchDelay: 50,              // 批次间延迟(毫秒)
        observerThrottle: 2000,      // 观察者触发间隔(毫秒)
        targetChar: '战'             // 需要加粗的字符
    };
    
    // 存储已处理的节点，避免重复处理
    const processedNodes = new WeakSet();
    
    // 节点处理队列
    let nodeQueue = [];
    let isProcessing = false;
    let lastObserverTime = 0;
    
    // 创建一个函数来处理文本节点
    function processTextNode(textNode) {
        if (processedNodes.has(textNode) || !textNode.nodeValue.includes(config.targetChar)) {
            return;
        }
        
        try {
            // 创建一个文档片段来存储修改后的内容
            const fragment = document.createDocumentFragment();
            
            // 分割文本节点内容
            const parts = textNode.nodeValue.split(config.targetChar);
            
            // 重建节点，将"战"字替换为加粗版本
            for (let i = 0; i < parts.length; i++) {
                // 添加原始文本部分
                if (parts[i]) {
                    fragment.appendChild(document.createTextNode(parts[i]));
                }
                
                // 添加加粗的"战"字（除了最后一个分割之后）
                if (i < parts.length - 1) {
                    const bold = document.createElement('strong');
                    bold.textContent = config.targetChar;
                    fragment.appendChild(bold);
                }
            }
            
            // 标记为已处理
            processedNodes.add(textNode);
            
            // 使用修改后的内容替换原始文本节点
            if (textNode.parentNode) {
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        } catch (e) {
            console.error('处理文本节点时出错:', e);
        }
    }
    
    // 收集DOM树中的所有文本节点
    function collectTextNodes(node) {
        // 跳过已处理的节点
        if (processedNodes.has(node)) {
            return;
        }
        
        // 处理文本节点
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.nodeValue && node.nodeValue.includes(config.targetChar)) {
                nodeQueue.push(node);
            }
            return;
        }
        
        // 跳过不需要处理的元素
        if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || 
            node.nodeName === 'NOSCRIPT' || node.nodeName === 'TEXTAREA' || 
            node.nodeName === 'INPUT' || node.nodeName === 'SVG' ||
            node.className === '战字加粗-已处理') {
            return;
        }
        
        // 递归处理子节点
        try {
            const childNodes = node.childNodes;
            for (let i = 0; i < childNodes.length; i++) {
                collectTextNodes(childNodes[i]);
            }
        } catch (e) {
            console.error('收集节点时出错:', e);
        }
    }
    
    // 分批处理节点队列
    function processBatch() {
        if (nodeQueue.length === 0) {
            isProcessing = false;
            return;
        }
        
        isProcessing = true;
        
        // 获取当前批次需要处理的节点
        const batchNodes = nodeQueue.splice(0, config.batchSize);
        
        // 处理这一批节点
        for (const node of batchNodes) {
            if (node.parentNode) {  // 确保节点仍然在DOM中
                processTextNode(node);
            }
        }
        
        // 处理下一批
        if (nodeQueue.length > 0) {
            setTimeout(processBatch, config.batchDelay);
        } else {
            isProcessing = false;
        }
    }
    
    // 开始处理页面
    function startProcessing() {
        // 收集文本节点
        collectTextNodes(document.body);
        
        // 如果没有正在处理的任务，开始处理
        if (!isProcessing && nodeQueue.length > 0) {
            setTimeout(processBatch, 0);
        }
    }
    
    // 设置触发条件
    function setupTriggers() {
        // 1. 初始延迟加载
        setTimeout(startProcessing, config.processDelay);
        
        // 2. 滚动触发
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(startProcessing, 200);
        }, { passive: true });
        
        // 3. 点击触发
        document.addEventListener('click', function() {
            setTimeout(startProcessing, 100);
        }, { passive: true });
        
        // 4. 页面可见性变化触发
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(startProcessing, 100);
            }
        });
    }
    
    // 使用 MutationObserver 监听 DOM 变化
    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            // 限制观察者触发频率
            const now = Date.now();
            if (now - lastObserverTime < config.observerThrottle) {
                return;
            }
            lastObserverTime = now;
            
            let hasNewNodes = false;
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        if (!processedNodes.has(mutation.addedNodes[i])) {
                            collectTextNodes(mutation.addedNodes[i]);
                            hasNewNodes = true;
                        }
                    }
                }
            });
            
            if (hasNewNodes && !isProcessing && nodeQueue.length > 0) {
                setTimeout(processBatch, 0);
            }
        });
        
        // 配置 MutationObserver - 使用更具体的配置来减少不必要的触发
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }
    
    // 初始化
    function init() {
        // 防止在某些特殊页面上运行
        if (window.location.href.includes('chrome://') || 
            window.location.href.includes('about:') ||
            !document.body) {
            return;
        }
        
        // 设置触发条件
        setupTriggers();
        
        // 设置观察者
        setupObserver();
        
        // 添加调试信息（可在生产版本中移除）
        console.log('战字加粗脚本已加载');
    }
    
    // 当DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();