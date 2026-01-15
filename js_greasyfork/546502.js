// ==UserScript==
// @name         中文Wikipedia移动版智能折叠章节
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在zh.m.wikipedia.org自动折叠参见、参考链接、外部链接等章节，需在设置中启用启用"自动展开所有章节"
// @author       Claude Opus
// @match        https://zh.m.wikipedia.org/*
// @match        https://zh.wikipedia.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546502/%E4%B8%AD%E6%96%87Wikipedia%E7%A7%BB%E5%8A%A8%E7%89%88%E6%99%BA%E8%83%BD%E6%8A%98%E5%8F%A0%E7%AB%A0%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/546502/%E4%B8%AD%E6%96%87Wikipedia%E7%A7%BB%E5%8A%A8%E7%89%88%E6%99%BA%E8%83%BD%E6%8A%98%E5%8F%A0%E7%AB%A0%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 要折叠的章节标题（绝对匹配）
    const TARGET_SECTIONS = ['备注', '参见', '参考', '参考链接', '参考来源', '参考来源与注释', '参考文献', '参考书目', '参考信息', '参考资料', '参考注释', '参看', '参阅', '关联项目', '脚注', '扩展阅读', '来源', '另见', '书籍', '拓展阅读', '外部连结', '外部连接', '外部链接', '外部阅读', '文献', '相关连结', '相关书目', '相关条目', '相关作品', '信息来源', '研究书目', '延伸阅读', '引用', '引用文献', '注解', '注脚', '注释', '注释或参考', '著名人物', '资料来源', '参考资料与备注', '注解及参考资料'];

    // 存储键名
    const STORAGE_KEY = 'wiki_sections_collapsed';
    
    // 获取当前折叠状态
    let isCollapsed = GM_getValue(STORAGE_KEY, true);
    
    // 存储已处理的章节
    let processedSections = new Set();
    
    // ★ 新增：标记是否已完成初始折叠
    let hasCompletedInitialCollapse = false;

    // 日志函数
    function log(message) {
        console.log('[维基章节折叠] ' + message);
    }

    // 检查文本是否匹配目标章节（改为绝对匹配）
    function isTargetSection(text) {
        // 清理文本：移除编辑标记、前后空格
        const cleanText = text.replace(/\[编辑\]|\[編輯\]/g, '').trim();
        
        // 绝对匹配：清理后的文本必须完全等于目标章节之一
        return TARGET_SECTIONS.includes(cleanText);
    }

    // 查找章节对应的切换按钮和内容区域
    function findSectionElements(heading) {
        const result = {
            toggleButton: null,
            contentArea: null,
            sectionContainer: null
        };

        // 查找切换按钮的多种可能位置
        const buttonSelectors = [
            '.mw-ui-icon',
            '.toggle-list__toggle', 
            '[class*="toggle"]',
            '[class*="collapse"]',
            '[class*="expand"]',
            '.section-heading .mw-ui-icon',
            '.collapsible-heading .mw-ui-icon'
        ];

        // 在标题及其相关容器中查找按钮
        const searchContainers = [
            heading,
            heading.parentElement,
            heading.closest('.section-heading'),
            heading.closest('.collapsible-heading'),
            heading.closest('section'),
            heading.closest('[class*="section"]')
        ];

        for (let container of searchContainers) {
            if (!container) continue;
            
            for (let selector of buttonSelectors) {
                const button = container.querySelector(selector);
                if (button) {
                    result.toggleButton = button;
                    result.sectionContainer = container;
                    break;
                }
            }
            if (result.toggleButton) break;
        }

        // 查找内容区域
        if (result.sectionContainer) {
            // 在章节容器中查找内容区域
            const contentSelectors = [
                '.section-content',
                '.mw-parser-output',
                '.content',
                '[class*="content"]',
                '[id^="content-collapsible-block"]'
            ];

            for (let selector of contentSelectors) {
                const content = result.sectionContainer.querySelector(selector);
                if (content) {
                    result.contentArea = content;
                    break;
                }
            }
        }

        // 如果在容器中没找到，尝试查找后续的兄弟元素
        if (!result.contentArea) {
            let nextElement = heading.nextElementSibling;
            let scanCount = 0;
            
            while (nextElement && scanCount < 5) {
                // 如果遇到下一个标题就停止
                if (nextElement.tagName && nextElement.tagName.match(/^H[1-6]$/)) {
                    break;
                }
                
                // 检查是否是内容区域
                if (nextElement.id && nextElement.id.match(/^content-collapsible-block-\d+$/)) {
                    result.contentArea = nextElement;
                    break;
                }
                
                // 或者检查是否包含大量文本内容
                if (nextElement.textContent && nextElement.textContent.length > 50) {
                    result.contentArea = nextElement;
                    break;
                }
                
                nextElement = nextElement.nextElementSibling;
                scanCount++;
            }
        }

        return result;
    }

    // 尝试折叠章节的多种方法
    function collapseSection(heading, elements) {
        const headingText = heading.textContent.replace(/\[编辑\]|\[編輯\]/g, '').trim();
        let success = false;

        // 检查章节是否已经被折叠（简化检查，移除脚本标记检查）
        if (elements.contentArea && elements.contentArea.offsetHeight === 0) {
            log(`章节已折叠，跳过: ${headingText}`);
            return true;
        }

        // 方法1: 点击切换按钮
        if (elements.toggleButton) {
            try {
                // 检查按钮状态
                const isExpanded = !elements.toggleButton.classList.contains('mf-icon-expand') &&
                                 !elements.toggleButton.classList.contains('collapsed');
                
                if (isExpanded) {
                    log(`尝试通过按钮折叠章节: ${headingText}`);
                    
                    // 添加处理标记，防止重复处理
                    elements.toggleButton.setAttribute('data-processing', 'true');
                    
                    elements.toggleButton.click();
                    success = true;
                    
                    // 延迟移除标记
                    setTimeout(() => {
                        elements.toggleButton.removeAttribute('data-processing');
                    }, 1000);
                }
            } catch (e) {
                log(`按钮点击失败: ${e.message}`);
            }
        }

        // 方法2: 点击整个标题区域
        if (!success && elements.sectionContainer && !elements.sectionContainer.getAttribute('data-processing')) {
            try {
                log(`尝试通过点击标题折叠章节: ${headingText}`);
                
                elements.sectionContainer.setAttribute('data-processing', 'true');
                
                // 创建点击事件
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                
                elements.sectionContainer.dispatchEvent(clickEvent);
                success = true;
                
                setTimeout(() => {
                    elements.sectionContainer.removeAttribute('data-processing');
                }, 1000);
            } catch (e) {
                log(`标题点击失败: ${e.message}`);
            }
        }

        return success;
    }

    // 展开章节（简化版，移除直接操作方法）
    function expandSection(heading, elements) {
        const headingText = heading.textContent.replace(/\[编辑\]|\[編輯\]/g, '').trim();
        log(`章节展开请求: ${headingText} (使用原生维基机制)`);
    }

    // 处理所有目标章节
    function processSections() {
        let processedCount = 0;
        
        // 查找所有可能的标题元素
        const headingSelectors = [
            'h1, h2, h3, h4, h5, h6',
            '.mw-headline',
            '.section-heading',
            '[class*="heading"]'
        ];
        
        const allHeadings = new Set();
        
        headingSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(heading => {
                allHeadings.add(heading);
            });
        });
        
        allHeadings.forEach(heading => {
            const headingText = heading.textContent || heading.innerText || '';
            
            if (isTargetSection(headingText)) {
                const sectionId = heading.id || `section-${heading.textContent.slice(0, 10)}`;
                
                if (processedSections.has(sectionId)) {
                    return; // 已处理过的章节跳过
                }
                
                log(`发现目标章节: "${headingText.trim()}"`);
                
                const elements = findSectionElements(heading);
                
                if (isCollapsed) {
                    if (collapseSection(heading, elements)) {
                        processedSections.add(sectionId);
                        processedCount++;
                    }
                } else {
                    expandSection(heading, elements);
                    processedSections.delete(sectionId);
                }
            }
        });
        
        log(`本次处理了 ${processedCount} 个章节`);
        return processedCount;
    }

    // 防抖处理函数
    let processTimeout = null;
    let isProcessing = false;
    
    function debouncedProcessSections() {
        // ★ 修改：如果已完成初始折叠，不再自动处理
        if (hasCompletedInitialCollapse) {
            log('已完成初始折叠，跳过自动处理');
            return;
        }
        
        if (isProcessing) {
            log('正在处理中，跳过本次触发');
            return;
        }
        
        clearTimeout(processTimeout);
        processTimeout = setTimeout(() => {
            if (isCollapsed && !isProcessing && !hasCompletedInitialCollapse) {
                isProcessing = true;
                log('开始防抖处理章节');
                processSections();
                setTimeout(() => {
                    isProcessing = false;
                    log('防抖处理完成');
                }, 2000);
            }
        }, 1500);
    }

    // ★ 修改：监听DOM变化 - 仅在初始折叠完成前工作
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            // ★ 如果已完成初始折叠，不再响应DOM变化
            if (hasCompletedInitialCollapse) {
                return;
            }
            
            let shouldProcess = false;
            let hasStyleChanges = false;
            
            mutations.forEach((mutation) => {
                // 忽略脚本自身造成的样式变化
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'style' || 
                        mutation.attributeName === 'data-collapsed-by-script' ||
                        mutation.attributeName === 'class') {
                        hasStyleChanges = true;
                        return;
                    }
                }
                
                // 只处理真正的内容添加
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 忽略脚本添加的样式元素
                            if (node.tagName === 'STYLE' && node.id === 'wiki-hide-blocks-style') {
                                return;
                            }
                            
                            // 检查是否添加了新的标题或章节内容
                            if (node.tagName && node.tagName.match(/^H[1-6]$/)) {
                                shouldProcess = true;
                            } else if (node.querySelector && 
                                     (node.querySelector('h1, h2, h3, h4, h5, h6') ||
                                      node.querySelector('[class*="section"]') ||
                                      node.querySelector('[id*="content-collapsible"]'))) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });
            
            // 如果只是样式变化，不触发处理
            if (hasStyleChanges && !shouldProcess) {
                return;
            }
            
            if (shouldProcess && isCollapsed && !isProcessing) {
                log('DOM变化检测到新内容，准备处理');
                debouncedProcessSections();
            }
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        log('DOM变化监听器已启动');
    }

    // ★ 修改：设置URL变化监听 - 只在页面路径真正变化时才重新处理
    function setupUrlChangeListener() {
        let lastPathname = location.pathname;  // ★ 只记录pathname，忽略hash和search
        
        const urlObserver = new MutationObserver(() => {
            const currentPathname = location.pathname;
            // ★ 只有当pathname变化时才认为是真正的页面导航
            if (currentPathname !== lastPathname) {
                lastPathname = currentPathname;
                log('检测到页面导航: ' + currentPathname);
                
                // 页面导航后重置状态并重新处理
                processedSections.clear();
                hasCompletedInitialCollapse = false;  // ★ 重置初始折叠标志
                
                setTimeout(() => {
                    if (isCollapsed && !isProcessing) {
                        debouncedProcessSections();
                    }
                }, 1500);
            }
            // ★ 如果只是hash或search变化（如打开搜索框），不做任何处理
        });
        
        urlObserver.observe(document, { subtree: true, childList: true });
        
        window.addEventListener('popstate', () => {
            const currentPathname = location.pathname;
            // ★ 同样只在pathname变化时处理
            if (currentPathname !== lastPathname) {
                lastPathname = currentPathname;
                processedSections.clear();
                hasCompletedInitialCollapse = false;
                
                setTimeout(() => {
                    if (isCollapsed && !isProcessing) {
                        debouncedProcessSections();
                    }
                }, 1000);
            }
        });
    }

    // 初始化函数
    function init() {
        log('脚本初始化开始');
        log(`当前折叠状态: ${isCollapsed}`);
        
        // 设置监听器
        setupMutationObserver();
        setupUrlChangeListener();
        
        // ★ 修改：页面加载完成后只处理一次
        const processWhenReady = () => {
            // ★ 如果已完成初始折叠，不再处理
            if (hasCompletedInitialCollapse) {
                log('已完成初始折叠，跳过');
                return;
            }
            
            if (isCollapsed && !isProcessing) {
                isProcessing = true;
                setTimeout(() => {
                    const count = processSections();
                    setTimeout(() => {
                        isProcessing = false;
                        // ★ 标记初始折叠已完成
                        if (count > 0 || document.readyState === 'complete') {
                            hasCompletedInitialCollapse = true;
                            log('初始折叠已完成，后续URL变化将不再自动折叠');
                        }
                    }, 2000);
                }, 500);
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(processWhenReady, 1000);
            });
        } else {
            setTimeout(processWhenReady, 500);
        }
        
        // ★ 修改：只保留一次延迟执行，并在完成后标记
        setTimeout(() => {
            if (!hasCompletedInitialCollapse) {
                processWhenReady();
                // 最终标记完成
                setTimeout(() => {
                    hasCompletedInitialCollapse = true;
                    log('初始折叠流程结束');
                }, 3000);
            }
        }, 2000);
        
        log('脚本初始化完成');
    }

    // 启动脚本
    init();
})();