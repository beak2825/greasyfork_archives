// ==UserScript==
// @name         修复缩放异常
// @namespace    http://tampermonkey.net/
// @version      1.9.10
// @description  修复抖音右下角 positionBox 元素缩放异常
// @author       Lucas
// @match        *://*.douyin.com/*
// @match        *://*.iesdouyin.com/*
// @icon         https://douyin.com/favicon.ico
// @icon64       https://douyin.com/favicon.ico
// @license      GPLv3
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/533338/%E4%BF%AE%E5%A4%8D%E7%BC%A9%E6%94%BE%E5%BC%82%E5%B8%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/533338/%E4%BF%AE%E5%A4%8D%E7%BC%A9%E6%94%BE%E5%BC%82%E5%B8%B8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 步骤1: 定义目标元素选择器
    const targetElementSelector = '[class*="positionBox"]';  // 匹配包含 "positionBox" 子字符串的类属性
    let documentObserver = null;  // 用于监控文档变化的观察器

    function setupObservers() {
        let targetElements = document.querySelectorAll(targetElementSelector);
        
        if (targetElements.length > 0) {
            console.log('找到匹配元素，正在设置监控...');
            const elementObserver = new MutationObserver(handleMutations);
            
            targetElements.forEach(element => {
                elementObserver.observe(element, { attributes: true, attributeFilter: ['style'] });
                console.log('正在监控元素:', element);
            });
            
            // 如果有文档观察器，停止它以节省资源
            if (documentObserver) {
                documentObserver.disconnect();
                documentObserver = null;
            }
        } else {
            // 如果未找到，继续轮询
            console.log('未找到匹配元素，继续尝试...');
            setTimeout(setupObservers, 500);  // 每500ms重新检查一次
        }
    }

    // 步骤2: 如果元素未立即找到，监控文档变化
    function startDocumentObservation() {
        documentObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {  // 子节点变化
                    setupObservers();  // 重新尝试查找元素
                }
            });
        });
        
        documentObserver.observe(document.body, { childList: true, subtree: true });  // 监控整个文档树
        console.log('正在监控文档变化，等待目标元素出现...');
    }

    // 步骤3: 处理 mutations 的函数
    function handleMutations(mutationsList) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const element = mutation.target;
                const currentTransform = element.style.transform;  // 获取当前 transform 值
                console.log('检测到 style 属性变化，当前 transform:', currentTransform);
                
                const scaleValue = parseScaleFromTransform(currentTransform);  // 解析 scale 值
                if (scaleValue !== null && scaleValue !== 1) {  // 如果 scale 不为 1
                    console.log('检测到 scale 不为 1，强制修正...');
                    fixScale(element);  // 修正为 scale(1)
                }
                else if (scaleValue === 1) {
                    console.log('当前 scale 已为 1，无需修正。');
                }
                else {
                    console.log('未检测到有效的 scale 值，可能是初始状态。');
                }
            }
        });
    }

    // 辅助函数：从 transform 属性中解析 scale 值
    function parseScaleFromTransform(transformString) {
        if (!transformString) return null;
        const scaleRegex = /scale\(([^)]+)\)/;
        const match = transformString.match(scaleRegex);
        if (match && match[1]) {
            const scaleValues = match[1].split(',').map(val => parseFloat(val.trim()));
            if (scaleValues.length > 0) {
                return scaleValues[0];  // 返回第一个 scale 值
            }
        }
        return null;
    }

    // 修正函数：强制设置 scale 为 1
    function fixScale(element) {
        element.style.transform = 'scale(1)';  // 强制应用 scale(1)
        element.style.transformOrigin = 'center center';  // 可选：设置缩放原点
        console.log('已为元素强制应用 scale(1):', element);
    }

    // 启动脚本
    console.log('脚本加载成功，正在尝试查找并监控元素...');
    setupObservers();  // 先尝试查找
    if (document.querySelectorAll(targetElementSelector).length === 0) {
        startDocumentObservation();  // 如果未找到，启动文档监控
    }
})();
