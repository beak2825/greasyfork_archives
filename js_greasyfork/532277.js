// ==UserScript==
// @name         知识星球、小报童文章保存为PDF-2026版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license      MIT
// @description  将知识星球和小报童文章保存为PDF，使用原生打印功能，自动展开帖子内容，并删除水印
// @author       #观澜话不多 11208596微信
// @match        https://articles.zsxq.com/*.html
// @match        https://wx.zsxq.com/dweb2/index/group/*
// @match        https://wx.zsxq.com/dweb2/index/topic*
// @match        https://wx.zsxq.com/group*
// @match        https://wx.zsxq.com/*
// @match        https://*.zsxq.com/*
// @match        https://xiaobot.net/*
// @match        https://*.xiaobot.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532277/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E3%80%81%E5%B0%8F%E6%8A%A5%E7%AB%A5%E6%96%87%E7%AB%A0%E4%BF%9D%E5%AD%98%E4%B8%BAPDF-2026%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/532277/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E3%80%81%E5%B0%8F%E6%8A%A5%E7%AB%A5%E6%96%87%E7%AB%A0%E4%BF%9D%E5%AD%98%E4%B8%BAPDF-2026%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("知识星球PDF导出脚本运行");

    // 确保脚本正常工作的标志
    window.zsxqPdfExportInitialized = false;

    // 使用WeakSet记录已处理元素（内存安全）- 用于自动展开功能
    const processed = new WeakSet();

    // 智能点击控制器 - 用于自动展开功能
    function smartClick(element) {
        // 三重安全校验
        if (!element ||
            getComputedStyle(element).display === 'none' ||
            processed.has(element)) return;

        // 通过按钮文本精准识别
        const text = element.textContent.trim();
        if (!/展[开示]/.test(text)) return;

        // 执行模拟点击
        element.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        }));

        // 标记已处理（即使点击后变成"收起"按钮也不会重复操作）
        processed.add(element);
    }

    // 主处理函数 - 用于自动展开功能
    function processExpanding() {
        const isXiaobot = window.location.hostname.includes('xiaobot.net');

        if (isXiaobot) {
            // xiaobot.net 展开按钮选择器
            const xiaobotExpandSelectors = [
                '[class*="expand"]', '[class*="show-more"]', '[class*="read-more"]',
                '.expand', '.show-more', '.read-more', '.more',
                'button:contains("展开")', 'button:contains("显示更多")',
                'a:contains("展开")', 'a:contains("显示更多")',
                '[class*="collapse"]', '[class*="fold"]'
            ];

            xiaobotExpandSelectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(smartClick);
                } catch (e) {
                    // 忽略不支持的选择器
                }
            });

            // 查找包含"展开"、"显示更多"等文本的按钮
            const allButtons = document.querySelectorAll('button, a, span, div');
            allButtons.forEach(btn => {
                const text = btn.textContent.trim();
                if (/展[开示]|显示更多|阅读更多|展开全文|显示全部/.test(text)) {
                    smartClick(btn);
                }
            });
        } else {
            // 知识星球展开按钮
            document.querySelectorAll('p.showAll').forEach(smartClick);
        }
    }

    // 防抖观察器配置 - 用于自动展开功能
    let observerLock = false;
    const expandingObserver = new MutationObserver(mutations => {
        if (observerLock) return;
        observerLock = true;

        // 智能延迟处理
        setTimeout(() => {
            processExpanding();
            observerLock = false;
        }, 300); // 延迟时间适配主流SPA加载速度
    });

    // 删除水印功能
    function del_watermark() {
        const isXiaobot = window.location.hostname.includes('xiaobot.net');

        if (isXiaobot) {
            // xiaobot.net 水印处理
            const xiaobotWatermarks = document.querySelectorAll(
                '[class*="watermark"], [class*="brand"], [class*="logo"], ' +
                '.watermark, .brand, .logo, [style*="background-image"]'
            );
            xiaobotWatermarks.forEach(el => {
                if (el.style.backgroundImage && el.style.backgroundImage !== 'none') {
                    el.style.backgroundImage = 'none !important';
                    el.style.backgroundSize = '0px';
                }
            });
        } else {
            // 知识星球水印处理
            // 首页水印
            const index_elements = document.querySelectorAll("[watermark]");
            if (index_elements) {
                for (let i = 0; i < index_elements.length; i++) {
                    if (index_elements[i].style.backgroundImage !== "none !important;") {
                        index_elements[i].style.backgroundImage = "none !important;";
                        index_elements[i].style.backgroundSize = "0px";
                    }
                }
            }

            // 文章页水印
            const articles_elements = document.querySelectorAll(".js_watermark");
            if (articles_elements) {
                for (let j = 0; j < articles_elements.length; j++) {
                    if (articles_elements[j].style.backgroundImage !== "none !important;") {
                        articles_elements[j].style.backgroundImage = "none !important;";
                        articles_elements[j].style.backgroundSize = "0px";
                    }
                }
            }
        }
    }

    // 监听详情容器点击展开
    function details_listen() {
        const detailsContainer = document.querySelectorAll('.details-container');
        if (detailsContainer) {
            for (let y = 0; y < detailsContainer.length; y++) {
                detailsContainer[y].addEventListener('click', function () {
                    // 在点击div后500毫秒检查一次
                    setInterval(function () {
                        // 文章点开 topic-detail-panel
                        const topic_elements = document.getElementsByClassName("topic-detail-panel");
                        if (topic_elements) {
                            for (let x = 0; x < topic_elements.length; x++) {
                                if (topic_elements[x].style.backgroundImage !== "none !important;") {
                                    topic_elements[x].style.backgroundImage = "none !important;";
                                    topic_elements[x].style.backgroundSize = "0px";
                                }
                            }
                        }
                    }, 500);
                });
            }
        }
    }

    // 监听话题预览点击
    function topic_preview() {
        const topicpreview = document.querySelectorAll('.topic-preview');
        if (topicpreview) {
            for (let z = 0; z < topicpreview.length; z++) {
                topicpreview[z].addEventListener('click', function () {
                    // 在点击div后500毫秒检查一次
                    setInterval(function () {
                        // 文章点开 topic-detail-panel
                        const topic_elements_z = document.getElementsByClassName("topic-detail-panel");
                        if (topic_elements_z) {
                            for (let xz = 0; xz < topic_elements_z.length; xz++) {
                                if (topic_elements_z[xz].style.backgroundImage !== "none !important;") {
                                    topic_elements_z[xz].style.backgroundImage = "none !important;";
                                    topic_elements_z[xz].style.backgroundSize = "0px";
                                }
                            }
                        }
                    }, 500);
                });
            }
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', function () {
        console.log("页面加载完成，开始添加按钮");
        setTimeout(initButtons, 1000);

        // 初始化自动展开功能
        processExpanding();

        // 监听动态内容变化，自动展开
        expandingObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 针对单页应用的hashchange处理
        window.addEventListener('hashchange', processExpanding);

        // 初始化删除水印功能
        del_watermark();
        details_listen();
        topic_preview();
    });

    // 针对SPA应用，监听URL变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            console.log("URL已变化，重新添加按钮");
            setTimeout(initButtons, 1000);
            // URL变化时也处理展开
            processExpanding();
            // URL变化时也处理水印
            del_watermark();
            details_listen();
            topic_preview();
        }
    }).observe(document, { subtree: true, childList: true });

    // 监听DOM变化，以适应动态加载的内容
    let contentChangeObserver = new MutationObserver((mutations) => {
        // 避免频繁触发
        if (window.zsxqPdfContentChangeTimeout) {
            clearTimeout(window.zsxqPdfContentChangeTimeout);
        }

        window.zsxqPdfContentChangeTimeout = setTimeout(() => {
            console.log("检测到内容变化，重新检查打印按钮");
            addPrintButtons();
            // 内容变化时也处理展开
            processExpanding();
            // 内容变化时也处理水印
            del_watermark();
        }, 1000);
    });

    // 开始观察文档变化
    contentChangeObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 鼠标滚动触发水印删除
    window.addEventListener("scroll", function () {
        del_watermark();
    });

    // 初始化按钮
    function initButtons() {
        // 尝试添加打印按钮
        const buttonsAdded = addPrintButtons();
        console.log(`初始化完成，添加了 ${buttonsAdded} 个打印按钮`);

        // 标记为已初始化
        window.zsxqPdfExportInitialized = true;

        // 总是添加紧急工具栏作为备用方案
        setTimeout(() => {
            if (!document.querySelector('.zsxq-emergency-toolbar')) {
                console.log('添加紧急工具栏作为备用方案');
                addEmergencyPrintButton();
            }
        }, 2000);

        // 如果没有添加任何按钮，尝试重试
        if (buttonsAdded === 0) {
            const isXiaobot = window.location.hostname.includes('xiaobot.net');
            const retryDelay = isXiaobot ? 2000 : 5000;
            const maxRetries = isXiaobot ? 10 : 3;

            if (!window.retryCount) {
                window.retryCount = 0;
            }

            if (window.retryCount < maxRetries) {
                window.retryCount++;
                console.log(`未添加任何按钮，第 ${window.retryCount} 次重试，${retryDelay / 1000}秒后重试...`);
                setTimeout(initButtons, retryDelay);
            } else {
                console.log("达到最大重试次数，添加全局按钮和紧急工具栏");
                addGlobalPrintButton();
                addEmergencyPrintButton();
            }
        } else {
            // 重置重试计数
            window.retryCount = 0;
        }
    }

    // 查找内容块
    function findContentBlocks() {
        console.log("查找内容块...");

        // 知识星球最新结构选择器
        const zsxqSelectors = [
            // 帖子内容
            '.content-box', '.content-piece', '.feed-content',
            '[class*="content-piece"]', '[class*="feed-content"]',
            '[class*="post-content"]', '[class*="topic-content"]',
            // 2024版本新增选择器
            '.feed-main', '.topic-main', '.post-main',
            '.topic-detail-panel', '.topic-card',
            // 评论和回复
            '.comment-content', '.reply-content',
            // 具体的帖子内容容器
            '.article-content', '.topic-content',
            '[class*="content-container"]',
            // 打印按钮的父容器
            '.feed-item', '.topic-item', '.post-item',
            // 新增选择器
            '.feed-text', '.topic-text', '.post-text',
            '.feed-detail', '.topic-detail', '.post-detail',
            // 通用内容选择器
            '[class*="_content"]', '[class*="content_"]',
            '[class*="text-content"]', '[class*="content-text"]'
        ];

        // xiaobot.net 特定选择器
        const xiaobotSelectors = [
            // 文章内容 - 更具体的选择器
            '.post-content', '.article-content', '.content', '.post-body',
            '[class*="post-content"]', '[class*="article-content"]',
            '[class*="content"]', '[class*="post-body"]',
            '.markdown-body', '.prose', '.rich-text', '.text-content',
            // 新增：针对Vue.js的data-v属性
            'div[data-v-*][class*="content"]', 'div[data-v-*][class*="post"]',
            'div[data-v-*][class*="article"]', 'div[data-v-*][class*="text"]',
            // 文章容器
            '.post', '.article', '.entry', '.post-container', '.article-container',
            '[class*="post"]', '[class*="article"]', '[class*="entry"]',
            '[class*="post-container"]', '[class*="article-container"]',
            // 主要内容区域
            'main', '.main', '#main', '.container', '.content-container',
            '[class*="main"]', '[class*="container"]', '[class*="content-container"]',
            // 文本内容
            '.text', '.body', '.description', '.summary', '.content-text',
            '[class*="text"]', '[class*="body"]', '[class*="description"]',
            '[class*="content-text"]', '[class*="text-content"]',
            // 通用选择器
            'article', 'section', '.content-wrapper', '.content-area',
            '[class*="content-wrapper"]', '[class*="content-area"]',
            // 新增：更宽泛的选择器
            'div[class*="content"]', 'div[class*="text"]', 'div[class*="body"]',
            'div[class*="post"]', 'div[class*="article"]', 'div[class*="entry"]',
            // 新增：针对可能的动态内容
            '[data-content]', '[data-text]', '[data-body]',
            '.dynamic-content', '.loaded-content', '.rendered-content',
            // 新增：Vue.js特定选择器
            'div[data-v-*]', '[data-v-*]'
        ];

        let contentBlocks = [];

        // 根据当前域名选择合适的选择器
        const isXiaobot = window.location.hostname.includes('xiaobot.net');
        const selectorsToUse = isXiaobot ? xiaobotSelectors : zsxqSelectors;

        console.log(`当前域名: ${window.location.hostname}, 使用选择器类型: ${isXiaobot ? 'xiaobot.net' : '知识星球'}`);

        selectorsToUse.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.log(`使用选择器 ${selector} 找到 ${elements.length} 个内容块`);
                    contentBlocks = [...contentBlocks, ...Array.from(elements)];
                }
            } catch (e) {
                // 某些选择器可能不被支持，比如data-v-*
                console.log(`选择器 ${selector} 不被支持，尝试替代方法`);

                // 尝试使用更具体的选择器
                if (selector.includes('data-v-*')) {
                    // 查找所有元素
                    const allElements = document.querySelectorAll('*');
                    const matchingElements = Array.from(allElements).filter(el => {
                        // 检查是否有data-v-开头的属性
                        return Array.from(el.attributes).some(attr => attr.name.startsWith('data-v-'));
                    });

                    if (matchingElements.length > 0) {
                        console.log(`找到 ${matchingElements.length} 个带有data-v-属性的元素`);
                        contentBlocks = [...contentBlocks, ...matchingElements];
                    }
                }
            }
        });

        // 过滤掉太小的元素和隐藏元素，但保留有足够内容的元素
        contentBlocks = contentBlocks.filter(el => {
            const rect = el.getBoundingClientRect();
            const textLength = el.textContent.trim().length;
            const hasContent = textLength > 20; // 进一步降低内容长度要求
            const isVisible = rect.width > 50 && rect.height > 30 && el.offsetParent !== null; // 进一步降低尺寸要求
            const notExcluded = !el.className.includes('zsxq-print-btn');
            const hasTextOrImage = textLength > 0 || el.querySelectorAll('img').length > 0;

            // 特殊处理Vue.js内容块
            const isVueContent = el.hasAttribute('data-v-') &&
                (el.className.includes('content') || el.className.includes('post') || el.className.includes('article'));

            // 添加详细的调试信息
            if (textLength > 10) {
                console.log(`元素检查: ${el.className}, data-v: ${el.hasAttribute('data-v-')}, 文本长度: ${textLength}, 尺寸: ${rect.width}x${rect.height}, 可见: ${isVisible}, Vue内容: ${isVueContent}`);
            }

            // 如果是Vue.js内容块，降低要求
            if (isVueContent) {
                return hasContent && isVisible && notExcluded;
            }

            return hasContent && isVisible && notExcluded && hasTextOrImage;
        });

        // 去重
        contentBlocks = Array.from(new Set(contentBlocks));

        console.log(`找到 ${contentBlocks.length} 个内容块`);

        // 如果没有找到内容块，尝试备用方案
        if (contentBlocks.length === 0 && isXiaobot) {
            console.log("常规选择器未找到内容，尝试备用方案...");

            // 备用方案：查找所有包含文本的div
            const allDivs = document.querySelectorAll('div');
            const potentialContent = Array.from(allDivs).filter(div => {
                const text = div.textContent.trim();
                const hasSignificantText = text.length > 100 && text.length < 50000;
                const hasMultipleLines = (text.match(/\n/g) || []).length > 2;
                const hasParagraphs = div.querySelectorAll('p').length > 1;
                const hasImages = div.querySelectorAll('img').length > 0;
                const isVisible = div.offsetParent !== null &&
                    div.getBoundingClientRect().width > 200 &&
                    div.getBoundingClientRect().height > 100;

                // 特殊处理Vue.js内容
                const isVueContent = div.hasAttribute('data-v-') &&
                    (div.className.includes('content') || div.className.includes('post') || div.className.includes('article'));

                // 如果是Vue.js内容，降低要求
                if (isVueContent) {
                    return hasSignificantText && isVisible;
                }

                return hasSignificantText && (hasMultipleLines || hasParagraphs || hasImages) && isVisible;
            });

            if (potentialContent.length > 0) {
                console.log(`备用方案找到 ${potentialContent.length} 个潜在内容块`);
                contentBlocks = potentialContent;
            }
        }

        return contentBlocks;
    }

    // 添加打印按钮
    function addPrintButtons() {
        console.log("尝试添加打印按钮...");

        // 查找内容块
        const contentBlocks = findContentBlocks();

        let buttonsAdded = 0;

        // 处理每个内容块
        contentBlocks.forEach(block => {
            // 如果已经有打印按钮，跳过
            if (block.querySelector('.zsxq-print-btn')) {
                return;
            }

            // 检查是否为有效内容
            const hasContent = block.textContent.trim().length > 20 || block.querySelectorAll('img').length > 0;
            if (!hasContent) {
                console.log(`跳过内容块: 文本长度 ${block.textContent.trim().length}, 图片数量 ${block.querySelectorAll('img').length}`);
                return;
            }

            // 创建打印按钮
            const printBtn = document.createElement('button');
            printBtn.className = 'zsxq-print-btn';
            printBtn.textContent = '打印内容';
            printBtn.style.cssText = `
                background: #FF9800;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 14px;
                margin: 8px 0;
                display: inline-block;
            `;

            // 添加打印功能
            printBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                directPrint(block);
            });

            // 尝试找到合适的位置插入按钮
            const insertPosition = findButtonInsertPosition(block);
            if (insertPosition) {
                insertPosition.insertBefore(printBtn, insertPosition.firstChild);
            } else {
                block.insertBefore(printBtn, block.firstChild);
            }

            buttonsAdded++;
        });

        console.log(`添加了 ${buttonsAdded} 个打印按钮`);
        return buttonsAdded;
    }

    // 查找按钮插入位置
    function findButtonInsertPosition(element) {
        // 首先尝试找到标题或头部区域
        const header = element.querySelector('.title, h1, h2, h3, [class*="header"], [class*="title"]');
        if (header) {
            return header.parentNode;
        }

        // 尝试找到内容区域的开始
        const content = element.querySelector('[class*="content"], .text, .body');
        if (content) {
            return content;
        }

        // 如果都找不到，返回元素本身
        return element;
    }

    // 添加一个浮动的全局打印按钮
    function addFloatingPrintButton(targetBlock) {
        // 检查是否已存在
        if (document.querySelector('.zsxq-floating-print-btn')) {
            return;
        }

        // 创建悬浮按钮容器
        const floatingBtnContainer = document.createElement('div');
        floatingBtnContainer.className = 'zsxq-floating-print-btn';
        floatingBtnContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: #1E88E5;
            color: white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            cursor: pointer;
            font-weight: bold;
        `;
        floatingBtnContainer.innerHTML = `<span style="font-size: 16px;">打印</span>`;

        // 添加打印功能
        floatingBtnContainer.addEventListener('click', function () {
            directPrint(targetBlock);
        });

        // 添加到页面
        document.body.appendChild(floatingBtnContainer);
    }

    // 添加全局打印按钮作为备用方案
    function addGlobalPrintButton() {
        // 检查是否已存在
        if (document.querySelector('.zsxq-global-print-btn')) {
            return;
        }

        console.log("添加全局打印按钮作为备用方案");

        // 创建全局打印按钮
        const globalBtn = document.createElement('button');
        globalBtn.className = 'zsxq-global-print-btn';
        globalBtn.textContent = '打印整个页面';
        globalBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #FF5722;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 15px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        // 添加打印功能
        globalBtn.addEventListener('click', function () {
            console.log("使用全局打印功能");
            // 直接打印整个页面
            window.print();
        });

        // 添加到页面
        document.body.appendChild(globalBtn);
    }

    // 添加紧急备用打印按钮 - 针对xiaobot.net特别优化
    function addEmergencyPrintButton() {
        console.log("添加紧急备用打印按钮");

        // 创建一个打印按钮工具栏
        const toolbar = document.createElement('div');
        toolbar.className = 'zsxq-emergency-toolbar';
        toolbar.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 99999;
            background: #FFFFFF;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-width: 200px;
            max-width: 250px;
            animation: zsxqToolbarPulse 2s infinite;
        `;

        // 添加动画样式
        const animStyle = document.createElement('style');
        animStyle.textContent = `
            @keyframes zsxqToolbarPulse {
                0% { box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                50% { box-shadow: 0 4px 20px rgba(76,175,80,0.5); }
                100% { box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
            }
        `;
        document.head.appendChild(animStyle);

        // 添加标题
        const title = document.createElement('div');
        title.textContent = '📄 文章打印工具';
        title.style.cssText = `
            font-weight: bold;
            font-size: 16px;
            color: #333;
            margin-bottom: 8px;
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
        `;
        toolbar.appendChild(title);

        // 添加批量导出区域
        const batchSection = document.createElement('div');
        batchSection.style.cssText = `
            background: #f8f9fa;
            border-radius: 6px;
            padding: 12px;
            margin: 8px 0;
            border: 1px solid #e9ecef;
        `;

        const batchTitle = document.createElement('div');
        batchTitle.textContent = '📦 批量导出';
        batchTitle.style.cssText = `
            font-weight: bold;
            font-size: 14px;
            color: #495057;
            margin-bottom: 10px;
            text-align: center;
        `;
        batchSection.appendChild(batchTitle);

        // 数量选择输入框
        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.min = '1';
        countInput.max = '50';
        countInput.value = '5';
        countInput.placeholder = '导出数量';
        countInput.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 10px;
            box-sizing: border-box;
        `;
        batchSection.appendChild(countInput);



        // 添加悬停效果
        batchExportBtn.onmouseover = function () {
            this.style.backgroundColor = '#0056b3';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        };
        batchExportBtn.onmouseout = function () {
            this.style.backgroundColor = '#007bff';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        };

        // 添加方向选择
        const directionLabel = document.createElement('div');
        directionLabel.textContent = '导出方向：';
        directionLabel.style.cssText = `
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        `;
        batchSection.appendChild(directionLabel);

        const directionSelect = document.createElement('select');
        directionSelect.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 10px;
            box-sizing: border-box;
        `;

        const option1 = document.createElement('option');
        option1.value = 'bottom-to-top';
        option1.textContent = '📄 从下到上（最新内容优先）';
        directionSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = 'top-to-bottom';
        option2.textContent = '📄 从上到下（最早内容优先）';
        directionSelect.appendChild(option2);

        batchSection.appendChild(directionSelect);

        // 批量导出按钮
        const batchExportBtn = document.createElement('button');
        batchExportBtn.textContent = '🚀 开始批量导出';
        batchExportBtn.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 10px 15px;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
            font-weight: bold;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        // 批量导出功能
        batchExportBtn.addEventListener('click', function () {
            const count = parseInt(countInput.value) || 5;
            const direction = directionSelect.value;
            if (count < 1 || count > 50) {
                alert('请输入1-50之间的数量');
                return;
            }
            startBatchExport(count, direction);
        });
        batchSection.appendChild(batchExportBtn);

        toolbar.appendChild(batchSection);

        // 添加打印当前内容按钮
        const printContentBtn = document.createElement('button');
        printContentBtn.textContent = '🖨️ 打印文章内容';
        printContentBtn.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 10px 15px;
            cursor: pointer;
            font-size: 15px;
            width: 100%;
            font-weight: bold;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        // 添加悬停效果
        printContentBtn.onmouseover = function () {
            this.style.backgroundColor = '#45a049';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        };
        printContentBtn.onmouseout = function () {
            this.style.backgroundColor = '#4CAF50';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        };
        printContentBtn.addEventListener('click', function () {
            try {
                // 尝试找到内容
                const content = findVueContent();
                if (content) {
                    console.log("找到内容，准备打印", content);
                    // 直接使用简化版的打印方法，避免复杂处理可能导致的问题
                    printSimpleContent(content);
                } else {
                    console.log("未找到内容，将打印整个页面");
                    alert('未找到内容，将打印整个页面');
                    window.print();
                }
            } catch (e) {
                console.error("打印内容时出错:", e);
                alert('打印时出错，将打印整个页面');
                window.print();
            }
        });
        toolbar.appendChild(printContentBtn);

        // 添加打印整个页面按钮
        const printPageBtn = document.createElement('button');
        printPageBtn.textContent = '📃 打印整个页面';
        printPageBtn.style.cssText = `
            background: #FF9800;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 10px 15px;
            cursor: pointer;
            font-size: 15px;
            width: 100%;
            font-weight: bold;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        // 添加悬停效果
        printPageBtn.onmouseover = function () {
            this.style.backgroundColor = '#F57C00';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        };
        printPageBtn.onmouseout = function () {
            this.style.backgroundColor = '#FF9800';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        };

        printPageBtn.addEventListener('click', function () {
            window.print();
        });
        toolbar.appendChild(printPageBtn);

        // 添加提示信息
        const tip = document.createElement('div');
        tip.textContent = '如果打印内容按钮无效，请尝试打印整个页面';
        tip.style.cssText = `
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #eee;
        `;
        toolbar.appendChild(tip);

        // 添加到页面
        document.body.appendChild(toolbar);
    }

    // 批量导出功能实现
    function startBatchExport(count, direction = 'bottom-to-top') {
        console.log(`开始批量导出 ${count} 条内容，方向：${direction}`);

        // 显示进度提示
        const progressDiv = document.createElement('div');
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 100000;
            text-align: center;
            font-size: 16px;
            max-width: 400px;
        `;

        const directionText = direction === 'bottom-to-top' ? '从下到上' : '从上到下';
        progressDiv.innerHTML = `
            <div>📄 正在准备批量导出...</div>
            <div style="margin-top: 10px; font-size: 14px;">导出方向：${directionText}</div>
            <div style="margin-top: 5px; font-size: 14px;">第1步：${direction === 'bottom-to-top' ? '滚动到页面底部' : '滚动到页面顶部'}</div>
        `;
        document.body.appendChild(progressDiv);

        // 根据方向选择滚动策略
        const scrollCallback = () => {
            progressDiv.innerHTML = `
                <div>📄 正在批量导出...</div>
                <div style="margin-top: 10px; font-size: 14px;">第2步：查找内容块</div>
            `;

            // 查找内容
            setTimeout(() => {
                const contentBlocks = findContentBlocksByDirection(count, direction);

                if (contentBlocks.length === 0) {
                    progressDiv.innerHTML = `
                        <div>❌ 未找到内容</div>
                        <div style="margin-top: 10px; font-size: 14px;">正在尝试备用方案...</div>
                    `;

                    // 尝试备用方案
                    setTimeout(() => {
                        const backupBlocks = findContentBlocksBackup(count, direction);
                        if (backupBlocks.length > 0) {
                            progressDiv.innerHTML = `
                                <div>📄 找到 ${backupBlocks.length} 条内容（备用方案）</div>
                                <div style="margin-top: 10px; font-size: 14px;">第3步：开始导出</div>
                            `;
                            setTimeout(() => {
                                batchPrintContents(backupBlocks, progressDiv);
                            }, 1000);
                        } else {
                            progressDiv.innerHTML = `
                                <div>❌ 未找到任何内容</div>
                                <div style="margin-top: 10px; font-size: 12px;">请确保页面已完全加载</div>
                                <div style="margin-top: 5px; font-size: 12px;">或尝试手动滚动页面后重试</div>
                                <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
                            `;
                        }
                    }, 2000);
                    return;
                }

                progressDiv.innerHTML = `
                    <div>📄 找到 ${contentBlocks.length} 条内容</div>
                    <div style="margin-top: 10px; font-size: 14px;">第3步：开始导出</div>
                `;

                // 开始批量导出
                setTimeout(() => {
                    batchPrintContents(contentBlocks, progressDiv);
                }, 1000);
            }, 1000);
        };

        // 根据方向执行滚动
        if (direction === 'bottom-to-top') {
            scrollToBottom(scrollCallback);
        } else {
            scrollToTop(scrollCallback);
        }
    }

    // 滚动到页面底部
    function scrollToBottom(callback) {
        const scrollStep = () => {
            const currentScroll = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;

            // 如果已经到底部，执行回调
            if (currentScroll + windowHeight >= documentHeight - 100) {
                console.log('已滚动到页面底部');
                callback();
                return;
            }

            // 继续滚动
            window.scrollBy(0, 500);
            setTimeout(scrollStep, 200);
        };

        scrollStep();
    }

    // 新增：滚动到页面顶部
    function scrollToTop(callback) {
        const scrollStep = () => {
            const currentScroll = window.pageYOffset;

            // 如果已经到顶部，执行回调
            if (currentScroll <= 100) {
                console.log('已滚动到页面顶部');
                callback();
                return;
            }

            // 继续滚动
            window.scrollBy(0, -500);
            setTimeout(scrollStep, 200);
        };

        scrollStep();
    }

    // 新增：滚动到页面顶部
    function scrollToTop(callback) {
        const scrollStep = () => {
            const currentScroll = window.pageYOffset;

            // 如果已经到顶部，执行回调
            if (currentScroll <= 100) {
                console.log('已滚动到页面顶部');
                callback();
                return;
            }

            // 继续滚动
            window.scrollBy(0, -500);
            setTimeout(scrollStep, 200);
        };

        scrollStep();
    }

    // 修改：根据方向查找内容块
    function findContentBlocksByDirection(count, direction) {
        console.log(`查找 ${count} 条内容，方向：${direction}`);

        const isXiaobot = window.location.hostname.includes('xiaobot.net');

        // 更全面的内容选择器
        const contentSelectors = isXiaobot ? [
            '.post-content', '.article-content', '.content', '.post-body',
            '[class*="post-content"]', '[class*="article-content"]',
            '[class*="content"]', '[class*="post-body"]',
            'div[data-v-*][class*="content"]', 'div[data-v-*][class*="post"]',
            'div[data-v-*][class*="article"]', 'article', 'section',
            '.markdown-body', '.prose', '.rich-text', '.text-content',
            'main', '.main', '#main'
        ] : [
            '.content-box', '.content-piece', '.feed-content',
            '[class*="content-piece"]', '[class*="feed-content"]',
            '[class*="post-content"]', '[class*="topic-content"]',
            '.feed-main', '.topic-main', '.post-main',
            '.topic-detail-panel', '.topic-card', '.feed-item',
            '.topic-item', '.post-item', '.feed-text', '.topic-text'
        ];

        let allContentBlocks = [];

        // 查找所有内容块
        contentSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                allContentBlocks = [...allContentBlocks, ...Array.from(elements)];
            } catch (e) {
                console.log(`选择器 ${selector} 不被支持`);
            }
        });

        // 降低过滤条件
        const validBlocks = allContentBlocks.filter(block => {
            const textLength = block.textContent.trim().length;
            const rect = block.getBoundingClientRect();
            const isVisible = rect.width > 20 && rect.height > 15 && block.offsetParent !== null;
            const hasContent = textLength > 30; // 大幅降低要求
            const notButton = !block.className.includes('zsxq-print-btn') &&
                !block.className.includes('print-btn') &&
                block.tagName !== 'BUTTON';

            return hasContent && isVisible && notButton;
        });

        // 去重
        const uniqueBlocks = Array.from(new Set(validBlocks));

        // 按照方向排序
        uniqueBlocks.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();

            if (direction === 'bottom-to-top') {
                return rectB.top - rectA.top; // 从下到上排序
            } else {
                return rectA.top - rectB.top; // 从上到下排序
            }
        });

        // 返回指定数量的内容块
        const selectedBlocks = uniqueBlocks.slice(0, count);
        console.log(`找到 ${selectedBlocks.length} 个有效内容块`);

        return selectedBlocks;
    }

    // 新增：备用内容查找方案
    function findContentBlocksBackup(count, direction) {
        console.log('使用备用方案查找内容块');

        // 更宽泛的选择器
        const backupSelectors = [
            'article', 'section', 'main',
            '.content', '.post', '.article', '.entry',
            '[class*="content"]', '[class*="post"]', '[class*="article"]',
            'div[data-v-*]', 'p', 'div'
        ];

        let allElements = [];

        backupSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                allElements = [...allElements, ...Array.from(elements)];
            } catch (e) {
                console.log(`备用选择器 ${selector} 失败`);
            }
        });

        // 非常宽松的过滤条件
        const validElements = allElements.filter(el => {
            const text = el.textContent.trim();
            const rect = el.getBoundingClientRect();

            return text.length > 30 && // 最低文本要求
                rect.width > 20 &&
                rect.height > 15 &&
                el.offsetParent !== null &&
                !el.className.includes('print-btn') &&
                el.tagName !== 'BUTTON' &&
                el.tagName !== 'SCRIPT' &&
                el.tagName !== 'STYLE';
        });

        // 去重并排序
        const uniqueElements = Array.from(new Set(validElements));

        uniqueElements.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();

            if (direction === 'bottom-to-top') {
                return rectB.top - rectA.top;
            } else {
                return rectA.top - rectB.top;
            }
        });

        return uniqueElements.slice(0, count);
    }

    // 批量打印内容
    function batchPrintContents(contentBlocks, progressDiv) {
        let currentIndex = 0;
        const totalCount = contentBlocks.length;

        const printNext = () => {
            if (currentIndex >= totalCount) {
                progressDiv.innerHTML = `
                    <div>✅ 批量导出完成！</div>
                    <div style="margin-top: 10px; font-size: 14px;">共导出 ${totalCount} 条内容</div>
                `;
                setTimeout(() => {
                    document.body.removeChild(progressDiv);
                }, 3000);
                return;
            }

            const currentBlock = contentBlocks[currentIndex];
            currentIndex++;

            progressDiv.innerHTML = `
                <div>📄 正在导出第 ${currentIndex} / ${totalCount} 条</div>
                <div style="margin-top: 10px; font-size: 14px;">请在打印对话框中选择保存为PDF</div>
            `;

            // 打印当前内容块
            directPrint(currentBlock);

            // 等待用户完成打印操作后继续下一个
            setTimeout(() => {
                printNext();
            }, 3000); // 给用户3秒时间处理打印对话框
        };

        printNext();
    }

    // 简化版打印内容函数
    function printSimpleContent(contentBlock) {
        console.log("使用简化版打印函数");

        try {
            // 创建一个隐藏的iframe，用于打印
            const printFrame = document.createElement('iframe');
            printFrame.style.cssText = 'position: absolute; width: 0; height: 0; border: 0; visibility: hidden;';
            document.body.appendChild(printFrame);

            // 准备打印文档
            const frameDoc = printFrame.contentWindow.document;
            frameDoc.open();

            // 查找页面标题
            let titleElement = document.querySelector('h1.title[data-v-5ad7bcd3]') ||
                document.querySelector('h1.title') ||
                document.querySelector('h1[data-v-*]') ||
                document.querySelector('.title') ||
                document.querySelector('h1');

            let titleText = titleElement ? titleElement.textContent.trim() : "";
            let documentTitle = document.title || "文章内容";

            // 如果找不到标题元素，使用文档标题
            if (!titleText) {
                titleText = documentTitle;
            }

            console.log("找到标题:", titleText);

            // 克隆内容，避免修改原始内容
            const clone = contentBlock.cloneNode(true);

            // 移除可能的打印按钮
            const buttons = clone.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.parentNode) {
                    btn.parentNode.removeChild(btn);
                }
            });

            // 检查内容中是否已经包含标题
            const hasTitle = clone.querySelector('h1.title') || clone.querySelector('h1');

            // 处理内容中的标题
            if (hasTitle) {
                console.log("内容中已包含标题，不需要额外添加");
            }

            // 添加HTML
            frameDoc.write(`
                 <!DOCTYPE html>
                 <html>
                 <head>
                     <title>${titleText}</title>
                     <meta charset="utf-8">
                     <style>
                         body {
                             font-family: Arial, "Microsoft YaHei", sans-serif;
                             margin: 20px;
                             padding: 0;
                             color: #333;
                             line-height: 1.6;
                             font-size: 16px;
                         }
                         .article-title {
                             font-size: 24px;
                             font-weight: bold;
                             margin-bottom: 20px;
                             padding-bottom: 10px;
                             border-bottom: 1px solid #eee;
                             color: #333;
                         }
                         img {
                             max-width: 100%;
                             height: auto;
                             margin: 10px 0;
                         }
                         p {
                             margin: 0.8em 0;
                         }
                         h1, h2, h3, h4 {
                             margin-top: 1.2em;
                             margin-bottom: 0.6em;
                         }
                         .footer {
                             margin-top: 20px;
                             padding-top: 10px;
                             border-top: 1px solid #eee;
                             color: #999;
                             font-size: 12px;
                             text-align: center;
                         }
                         /* 隐藏内容中的标题，因为我们已经添加了一个 */
                         .content h1.title[data-v-5ad7bcd3] {
                             display: none;
                         }
                     </style>
                 </head>
                 <body>
                     ${hasTitle ? '' : `<h1 class="article-title">${titleText}</h1>`}
                     <div class="content">
                         ${clone.innerHTML}
                     </div>
                     <div class="footer">
                         来源: ${window.location.hostname} - 由PDF导出工具生成
                     </div>
                 </body>
                 </html>
             `);
            frameDoc.close();

            // 等待图片和资源加载完成
            setTimeout(async function () {
                try {
                    // 等待图片加载的核心逻辑
                    console.log('正在等待图片加载...');
                    const frameImages = Array.from(frameDoc.querySelectorAll('img'));

                    const imageLoadPromises = frameImages.map(img => {
                        if (img.complete && img.naturalHeight > 0) return Promise.resolve();
                        if (!img.src) return Promise.resolve();

                        return new Promise(resolve => {
                            const timeout = setTimeout(() => {
                                console.warn('图片加载超时:', img.src);
                                resolve();
                            }, 5000);

                            img.onload = () => {
                                clearTimeout(timeout);
                                resolve();
                            };

                            img.onerror = () => {
                                clearTimeout(timeout);
                                console.warn('图片加载失败:', img.src);
                                resolve();
                            };
                        });
                    });

                    if (imageLoadPromises.length > 0) {
                        await Promise.all(imageLoadPromises);
                    }

                    // 额外缓冲
                    await new Promise(r => setTimeout(r, 500));

                    // 调用打印
                    printFrame.contentWindow.focus();
                    printFrame.contentWindow.print();

                    // 打印后清理
                    setTimeout(function () {
                        document.body.removeChild(printFrame);
                    }, 1000);
                } catch (e) {
                    console.error("打印失败:", e);
                    alert("打印失败，请尝试使用浏览器的打印功能。");
                    document.body.removeChild(printFrame);
                    // 备用方案：直接打印整个页面
                    window.print();
                }
            }, 500);
        } catch (e) {
            console.error("准备打印时出错:", e);
            alert("准备打印时出错，将使用浏览器打印功能。");
            window.print();
        }
    }

    // 查找Vue.js内容
    function findVueContent() {
        console.log("开始查找内容...");

        // 0. 首先尝试找到文章标题和内容的父容器
        try {
            // 查找标题元素
            const titleElement = document.querySelector('h1.title[data-v-5ad7bcd3]') ||
                document.querySelector('h1.title');

            if (titleElement) {
                console.log("找到标题元素:", titleElement);

                // 查找标题的父元素
                let parent = titleElement.parentElement;

                // 尝试查找内容元素
                let contentElement = null;

                // 首先在父元素中查找
                contentElement = parent.querySelector('.content.post-content') ||
                    parent.querySelector('.post-content') ||
                    parent.querySelector('.content');

                // 如果在父元素中找到内容元素
                if (contentElement) {
                    console.log("在标题父元素中找到内容元素!");

                    // 创建一个包含标题和内容的新div
                    const container = document.createElement('div');
                    container.className = 'article-container';

                    // 克隆标题和内容
                    const titleClone = titleElement.cloneNode(true);
                    const contentClone = contentElement.cloneNode(true);

                    // 添加到容器
                    container.appendChild(titleClone);
                    container.appendChild(contentClone);

                    console.log("创建了包含标题和内容的容器");
                    return container;
                }

                // 如果在父元素中没有找到内容元素，尝试查找相邻的内容元素
                const nextElement = titleElement.nextElementSibling;
                if (nextElement &&
                    (nextElement.className.includes('content') ||
                        nextElement.className.includes('post-content'))) {
                    console.log("找到标题的相邻内容元素!");

                    // 创建一个包含标题和内容的新div
                    const container = document.createElement('div');
                    container.className = 'article-container';

                    // 克隆标题和内容
                    const titleClone = titleElement.cloneNode(true);
                    const contentClone = nextElement.cloneNode(true);

                    // 添加到容器
                    container.appendChild(titleClone);
                    container.appendChild(contentClone);

                    console.log("创建了包含标题和相邻内容的容器");
                    return container;
                }

                // 如果找不到相关的内容元素，返回标题的父元素
                console.log("没有找到相关的内容元素，返回标题的父元素");
                return parent;
            }
        } catch (e) {
            console.log("查找标题和内容父容器失败:", e);
        }

        // 1. 尝试查找特定的内容结构 - 针对您提供的HTML
        try {
            // 精确匹配您提供的HTML结构
            const specificContent = document.querySelector('div[data-v-5ad7bcd3].content.post-content');
            if (specificContent) {
                console.log("找到完全匹配的内容结构!");
                return specificContent;
            }
        } catch (e) {
            console.log("精确匹配失败:", e);
        }

        // 2. 尝试查找任何带有data-v属性的内容元素
        try {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
                // 检查是否有data-v开头的属性
                const hasDataV = Array.from(el.attributes).some(attr => attr.name.startsWith('data-v-'));
                if (hasDataV &&
                    (el.className.includes('content') || el.className.includes('post')) &&
                    el.textContent.trim().length > 100) {
                    console.log("找到带data-v属性的内容元素:", el);
                    return el;
                }
            }
        } catch (e) {
            console.log("data-v属性搜索失败:", e);
        }

        // 3. 尝试使用常规选择器
        const selectors = [
            'div.content.post-content',
            'div[class="content post-content"]',
            'div.post-content',
            'div[class*="content"]',
            'div[class*="post-content"]',
            'main',
            'article',
            '.content',
            '.post-content',
            '.article-content'
        ];

        for (const selector of selectors) {
            try {
                const elements = document.querySelectorAll(selector);
                console.log(`选择器 ${selector} 找到 ${elements.length} 个元素`);
                for (const el of elements) {
                    if (el.textContent.trim().length > 100) {
                        console.log(`找到内容: ${selector}`);
                        return el;
                    }
                }
            } catch (e) {
                console.log(`选择器 ${selector} 错误:`, e);
            }
        }

        // 4. 查找包含特定内容的元素
        try {
            const allDivs = document.querySelectorAll('div');
            for (const div of allDivs) {
                const text = div.textContent;
                // 查找包含特定文本片段的元素
                if (text.includes('作品输出：让AI做你的写作编辑') ||
                    text.includes('AI辅助提供知识作品的结构') ||
                    text.includes('AI时代，AI工具已经是知识管理')) {
                    console.log("通过内容关键词找到内容块");
                    return div;
                }
            }
        } catch (e) {
            console.log("内容关键词搜索失败:", e);
        }

        // 5. 如果还是找不到，尝试更宽泛的搜索
        try {
            const allDivs = document.querySelectorAll('div');
            for (const div of allDivs) {
                if (div.textContent.trim().length > 500 && div.querySelectorAll('p').length > 3) {
                    console.log('通过内容长度找到可能的内容块');
                    return div;
                }
            }
        } catch (e) {
            console.log("宽泛搜索失败:", e);
        }

        console.log("未找到任何内容");
        return null;
    }

    // 直接打印，不显示预览页面
    function directPrint(contentBlock) {
        console.log("直接打印内容");

        // 检查内容块是否有效
        const isXiaobot = window.location.hostname.includes('xiaobot.net');
        const hasValidContent = contentBlock && contentBlock.textContent.trim().length > 50;

        if (!hasValidContent && isXiaobot) {
            console.log("内容块无效，尝试查找页面主要内容...");

            // 尝试查找页面主要内容，包括Vue.js内容
            const mainContent = document.querySelector('main, .main, #main, .content, .post-content, .article-content, div[data-v-*][class*="content"], div[data-v-*][class*="post"]');
            if (mainContent && mainContent.textContent.trim().length > 100) {
                console.log("找到主要内容，使用主要内容进行打印");
                contentBlock = mainContent;
            } else {
                // 尝试查找任何包含data-v属性的内容块
                const vueContent = document.querySelector('div[data-v-*]');
                if (vueContent && vueContent.textContent.trim().length > 100) {
                    console.log("找到Vue.js内容，使用Vue内容进行打印");
                    contentBlock = vueContent;
                } else {
                    console.log("未找到有效内容，使用整个页面进行打印");
                    // 如果还是找不到内容，直接打印整个页面
                    window.print();
                    return;
                }
            }
        }

        // 创建一个隐藏的iframe，用于打印
        const printFrame = document.createElement('iframe');
        printFrame.style.cssText = 'position: absolute; width: 0; height: 0; border: 0; visibility: hidden;';
        document.body.appendChild(printFrame);

        // 查找当前内容块的完整帖子容器
        const postContainer = findPostContainer(contentBlock);
        const targetContent = postContainer || contentBlock;

        // 尝试加载更多内容
        tryLoadMoreContent();

        // 准备打印文档
        const frameDoc = printFrame.contentWindow.document;
        frameDoc.open();

        // 获取基本信息
        let dateStr = extractDateInfo(targetContent);
        let authorName = extractAuthorInfo(targetContent);
        let titleText = extractTitleInfo(targetContent);

        // 设置打印标题
        const printTitle = `${dateStr}${titleText}`;

        // 添加HTML
        frameDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${printTitle}</title>
                <meta charset="utf-8">
                <style>
                    body {
                        font-family: Arial, "Microsoft YaHei", sans-serif;
                        margin: 0;
                        padding: 10px;
                        color: #333;
                        line-height: 1.5;
                        font-size: 16px;
                        white-space: normal;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        page-break-after: avoid;
                        margin-top: 0.6em;
                        margin-bottom: 0.3em;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        page-break-inside: avoid;
                        margin: 5px 0;
                    }
                    pre, code {
                        white-space: pre-wrap;
                        background: #f5f5f5;
                        padding: 6px;
                        border-radius: 4px;
                        margin: 6px 0;
                        font-family: Consolas, Monaco, monospace;
                        font-size: 14px;
                        page-break-inside: avoid;
                        overflow-x: auto;
                    }
                    p {
                        margin: 0.3em 0;
                        text-align: justify;
                        white-space: pre-line;
                    }
                    ul, ol {
                        padding-left: 1.5em;
                        margin: 0.3em 0;
                    }
                    li {
                        margin-bottom: 0.2em;
                        white-space: pre-line;
                    }
                    a {
                        color: #1E88E5;
                        text-decoration: none;
                    }
                    blockquote {
                        border-left: 3px solid #ddd;
                        padding-left: 8px;
                        margin: 6px 0;
                        color: #555;
                        font-style: italic;
                        white-space: pre-line;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 8px 0;
                        page-break-inside: avoid;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 4px;
                        text-align: left;
                        white-space: pre-line;
                    }
                    th {
                        background-color: #f5f5f5;
                    }
                    .footer {
                        margin-top: 10px;
                        color: #999;
                        font-size: 10px;
                        text-align: right;
                        border-top: 1px solid #eee;
                        padding-top: 4px;
                    }
                    @page {
                        margin: 0.5cm;
                        size: auto;
                    }
                    /* 保留换行和空格 */
                    .preserve-format {
                        white-space: pre-line !important;
                    }
                    div, span {
                        white-space: normal;
                    }
                    /* 空行处理 */
                    .empty-line {
                        height: 1em;
                        display: block;
                    }
                    /* 段落间距 */
                    p + p {
                        margin-top: 0.8em;
                    }
                    /* 问答区分样式 */
                    .zsxq-question {
                        background-color: #f5f8fa;
                        border-left: 4px solid #1E88E5;
                        padding: 10px;
                        margin: 15px 0;
                        border-radius: 4px;
                    }
                    .zsxq-answer {
                        background-color: #fff;
                        border-left: 4px solid #4CAF50;
                        padding: 10px;
                        margin: 15px 0 20px 0;
                        border-radius: 4px;
                    }
                    .zsxq-question-header, .zsxq-answer-header {
                        font-weight: bold;
                        margin-bottom: 8px;
                        padding-bottom: 5px;
                        border-bottom: 1px dashed #ddd;
                    }
                    .zsxq-question-header {
                        color: #1E88E5;
                    }
                    .zsxq-answer-header {
                        color: #4CAF50;
                    }
                    /* 打印时显示链接URL */
                    @media print {
                        a:after {
                            content: " (" attr(href) ")";
                            font-size: 90%;
                            color: #666;
                        }
                        img {
                            max-height: 85vh;
                        }
                    }
                </style>
            </head>
            <body>
                ${cleanContentHTML(targetContent)}
                <div class="footer">
                    来源: 知识星球
                </div>
            </body>
            </html>
        `);
        frameDoc.close();

        // 等待图片和资源加载完成
        setTimeout(async function () {
            try {
                // 等待图片加载的核心逻辑
                console.log('正在等待图片加载(简化版)...');
                const frameImages = Array.from(frameDoc.querySelectorAll('img'));

                const imageLoadPromises = frameImages.map(img => {
                    if (img.complete && img.naturalHeight > 0) return Promise.resolve();
                    if (!img.src) return Promise.resolve();

                    return new Promise(resolve => {
                        const timeout = setTimeout(() => {
                            resolve();
                        }, 5000);

                        img.onload = () => {
                            clearTimeout(timeout);
                            resolve();
                        };

                        img.onerror = () => {
                            clearTimeout(timeout);
                            resolve();
                        };
                    });
                });

                if (imageLoadPromises.length > 0) {
                    await Promise.all(imageLoadPromises);
                }

                await new Promise(r => setTimeout(r, 500));

                // 调用打印
                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();

                // 打印后清理
                setTimeout(function () {
                    document.body.removeChild(printFrame);
                }, 1000);
            } catch (e) {
                console.error("打印失败:", e);
                alert("打印失败，请尝试使用浏览器的打印功能。");
                document.body.removeChild(printFrame);
            }
        }, 500);

        // 尝试加载更多内容
        function tryLoadMoreContent() {
            const loadMoreElements = document.querySelectorAll('[class*="load-more"], [class*="show-more"], .more, .pager, .pagination');
            loadMoreElements.forEach(el => {
                try {
                    if (el.offsetParent !== null && !el.classList.contains('disabled')) {
                        el.click();
                    }
                } catch (e) {
                    console.warn("加载更多内容失败:", e);
                }
            });
        }

        // 清理内容HTML
        function cleanContentHTML(content) {
            // 克隆内容，避免修改原始内容
            const clone = content.cloneNode(true);

            const isXiaobot = window.location.hostname.includes('xiaobot.net');

            // 移除不需要的元素
            const removeSelectors = [
                // 移除用户列表和点赞信息
                '[class*="like"]',
                // 移除操作按钮和交互区域
                'button', '.zsxq-print-btn',
                '.interaction',
                '.input', '[class*="input"]', 'input', 'textarea',
                '.menu', '.dropdown', '.popup', '.tooltip',
                // 移除其他无关元素
                '[class*="fold"]', '[class*="collapse"]', '.hidden',
                '[style*="display: none"]',
                '[aria-hidden="true"]', '.invisible',
                // 移除查看详情元素
                '.view-more', '.read-more', '.show-more',
                '[class*="view-detail"]', '[class*="show-detail"]'
            ];

            // xiaobot.net 特定移除元素
            if (isXiaobot) {
                removeSelectors.push(
                    // xiaobot.net 特定元素
                    '[class*="sidebar"]', '[class*="navigation"]', '[class*="nav"]',
                    '[class*="header"]', '[class*="footer"]', '[class*="comment"]',
                    '[class*="share"]', '[class*="social"]', '[class*="ad"]',
                    '[class*="advertisement"]', '[class*="banner"]', '[class*="promo"]',
                    '.sidebar', '.navigation', '.nav', '.header', '.footer',
                    '.comment', '.share', '.social', '.ad', '.advertisement',
                    '.banner', '.promo', '.related', '.recommendation',
                    // 保留Vue.js内容，不移除data-v属性
                    // 但移除可能的Vue.js无关元素
                    '[class*="loading"]', '[class*="skeleton"]', '[class*="placeholder"]'
                );
            }

            removeSelectors.forEach(selector => {
                const elements = clone.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });
            });

            // 特别处理：移除包含特定文本的元素
            // 注意：不要使用 .includes 检查大段文本，否则会误删整个父容器
            const allElements = clone.getElementsByTagName('*');
            for (const el of allElements) {
                // 忽略脚本和样式标签
                if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;

                const text = el.textContent.trim();

                // 只有当文本长度较短时才进行匹配，避免误删大容器
                if (text.length > 20) continue;

                if (isXiaobot) {
                    // xiaobot.net 特定文本
                    if (/^(查看详情|阅读更多|展开全文|显示更多|分享|评论|点赞|收藏|关注|订阅|广告|推广|推荐|相关文章|热门文章)$/.test(text)) {
                        el.parentNode && el.parentNode.removeChild(el);
                    }
                } else {
                    // 知识星球特定文本
                    if (text === '查看详情' || text === '收起') {
                        el.parentNode && el.parentNode.removeChild(el);
                    }
                }
            }

            // 处理图片
            const images = clone.querySelectorAll('img');
            images.forEach(img => {
                // 尝试强制使用高清原图
                const originalSrc = img.getAttribute('data-original') ||
                    img.getAttribute('data-src') ||
                    img.getAttribute('data-large') ||
                    img.getAttribute('original-src');

                if (originalSrc) {
                    img.src = originalSrc;
                } else if (!img.src || img.src.startsWith('data:')) {
                    const fallbackSrc = img.getAttribute('lazy-src');
                    if (fallbackSrc) img.src = fallbackSrc;
                }

                if (img.src && !img.src.startsWith('http')) {
                    img.src = new URL(img.src, window.location.href).href;
                }

                // 无论是否替换了原图，都要清理掉原本的尺寸属性，防止变形
                img.removeAttribute('width');
                img.removeAttribute('height');

                // 排除头像、表情包等小图
                if (!img.className.match(/avatar|icon|emoji|head|profile/i) &&
                    !img.closest('.author') &&
                    !img.closest('.avatar')) {

                    // 强制图片撑满全宽，同时保持比例，绝对防止变形
                    img.style.setProperty('width', '100%', 'important');
                    img.style.setProperty('max-width', '100%', 'important');

                    // 核心修正：高度必须自适应，且不能受 max-height 限制
                    img.style.setProperty('height', 'auto', 'important');
                    img.style.setProperty('max-height', 'none', 'important');
                    img.style.setProperty('min-height', '0', 'important');

                    // 确保 objcet-fit 不会裁剪或拉伸
                    img.style.setProperty('object-fit', 'contain', 'important');

                    img.style.setProperty('display', 'block', 'important');
                    img.style.setProperty('margin', '15px 0', 'important');

                    // 向上遍历3层父元素，消除宽度限制
                    let parent = img.parentNode;
                    for (let i = 0; i < 3 && parent; i++) {
                        if (parent === clone) break; // 别改到根节点

                        // 强制父容器也是全宽块级显示
                        parent.style.setProperty('width', '100%', 'important');
                        parent.style.setProperty('max-width', '100%', 'important');
                        parent.style.setProperty('flex', 'none', 'important');
                        parent.style.setProperty('display', 'block', 'important');

                        // 清除可能的Grid布局限制
                        if (window.getComputedStyle(parent).display === 'grid' ||
                            parent.className.includes('grid')) {
                            parent.style.setProperty('display', 'block', 'important');
                            parent.style.setProperty('grid-template-columns', 'none', 'important');
                        }

                        parent = parent.parentNode;
                    }
                }
            });

            // 移除用户列表和点赞信息的特定处理
            const userLists = clone.querySelectorAll('[class*="user-list"], [class*="like-list"]');
            userLists.forEach(list => {
                if (list.parentNode) {
                    list.parentNode.removeChild(list);
                }
            });

            // xiaobot.net 特定处理
            if (isXiaobot) {
                const xiaobotSpecificElements = clone.querySelectorAll(
                    '[class*="author-info"]', '[class*="user-info"]', '[class*="profile"]',
                    '[class*="meta"]', '[class*="info"]', '[class*="stats"]',
                    '.author-info', '.user-info', '.profile', '.meta', '.info', '.stats'
                );
                xiaobotSpecificElements.forEach(el => {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });
            }

            // 移除文档开头的空白
            removeTopWhitespaceRecursive(clone);

            // 保留原有格式
            preserveFormatting(clone);

            // 识别并处理知识星球特有的格式
            processZsxqSpecificFormat(clone);

            // 特殊处理Vue.js内容
            if (isXiaobot) {
                processVueContent(clone);
            }

            // 移除收起后的内容
            removeCollapsedContent(clone);

            // 删除多余空白
            removeExcessWhitespace(clone);

            return clone.innerHTML;
        }

        // 处理Vue.js内容
        function processVueContent(element) {
            // 查找Vue.js内容块
            const vueBlocks = element.querySelectorAll('div[data-v-*]');

            vueBlocks.forEach(block => {
                // 确保Vue.js内容块保持原有结构
                if (block.className.includes('content') || block.className.includes('post') || block.className.includes('article')) {
                    // 保留Vue.js的data-v属性，但移除其他可能的Vue.js特定属性
                    const vueAttributes = Array.from(block.attributes).filter(attr =>
                        attr.name.startsWith('data-v-') ||
                        attr.name === 'class' ||
                        attr.name === 'style'
                    );

                    // 清理其他Vue.js相关属性
                    Array.from(block.attributes).forEach(attr => {
                        if (!vueAttributes.some(vueAttr => vueAttr.name === attr.name)) {
                            block.removeAttribute(attr.name);
                        }
                    });

                    // 确保内容可见
                    block.style.display = 'block';
                    block.style.visibility = 'visible';
                }
            });

            // 处理Vue.js中的图片
            const images = element.querySelectorAll('img');
            images.forEach(img => {
                // 确保图片正确显示
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.display = 'block';

                // 处理可能的懒加载
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        }

        // 移除文档开头的空白
        function removeTopWhitespace(element) {
            // 0. 清除容器本身的顶部间距
            element.style.marginTop = '0';
            element.style.paddingTop = '0';

            // 移除前5个子元素中的空白元素
            const firstChildren = Array.from(element.childNodes).slice(0, 10);
            for (let child of firstChildren) {
                // 如果是空文本节点，删除
                if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() === '') {
                    element.removeChild(child);
                }
                // 如果是空元素节点或只包含空白的元素，删除
                else if (child.nodeType === Node.ELEMENT_NODE) {
                    // 忽略 img 标签，防止误删图片
                    if (child.tagName === 'IMG') continue;

                    if (child.textContent.trim() === '' &&
                        !child.querySelector('img') &&
                        child.tagName !== 'BR') {
                        element.removeChild(child);
                    }
                }
            }

            // 确保第一个实际内容元素没有上边距
            // 使用 * 选择器匹配任意元素，包括自定义标签
            const firstContent = element.querySelector('*');
            if (firstContent) {
                firstContent.style.marginTop = '0';
                firstContent.style.paddingTop = '0';
            }

            // 特别针对 header 元素去边距
            const header = element.querySelector('app-topic-header, .header-container, .topic-header');
            if (header) {
                header.style.marginTop = '0';
                header.style.paddingTop = '0';
            }
        }
        // 移除文档开头的空白 (终极版：寻找第一个内容节点并修剪之前的元素)
        function removeTopWhitespaceRecursive(element) {
            // 1. 暴力清除已知的占位元素
            const ghosts = element.querySelectorAll('app-user-info-card, [class*="placeholder"], [id*="placeholder"]');
            ghosts.forEach(g => g.remove());

            // 2. 找到第一个真正的文本节点（非空白）
            let firstTextNode = null;
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            while (walker.nextNode()) {
                if (walker.currentNode.textContent.trim().length > 0) {
                    firstTextNode = walker.currentNode;
                    break;
                }
            }

            if (!firstTextNode) return; // 如果全是空的，就放弃

            // 3. 从这个文本节点开始，向上溯源到 root
            // 将沿途所有父元素的 margin/padding 归零
            // 并且移除沿途所有父元素之前的兄弟节点（Previous Siblings）
            let current = firstTextNode;
            let parent = current.parentNode;

            // 针对文本节点的直接父元素（比如 .role 或 .author），也强制去样式
            if (current.nodeType === Node.ELEMENT_NODE) {
                current.style.marginTop = '0';
                current.style.paddingTop = '0';
            } else if (parent && parent !== element) {
                parent.style.marginTop = '0';
                parent.style.paddingTop = '0';
                parent.style.borderTop = 'none';
            }

            // 向上遍历直到 root
            while (parent && parent !== element.parentNode) {
                // 强制去边距
                parent.style.setProperty('margin-top', '0', 'important');
                parent.style.setProperty('padding-top', '0', 'important');
                parent.style.setProperty('min-height', '0', 'important');

                // 移除当前分支左侧的所有兄弟节点（即在这个内容之前的所有东西）
                while (parent.firstChild && parent.firstChild !== current) {
                    parent.removeChild(parent.firstChild);
                }

                current = parent;
                parent = parent.parentNode;
            }

            // 4. 最后再次确保 root 本身干净
            element.style.marginTop = '0';
            element.style.paddingTop = '0';
        }


        // 保留原有格式
        function preserveFormatting(element) {
            // 处理段落和换行
            const paragraphs = element.querySelectorAll('p, div, section, article');
            paragraphs.forEach(p => {
                // 确保段落有足够的下边距，但不要太多
                if (p.childNodes.length > 0) {
                    p.style.marginBottom = '0.5em';
                    p.style.marginTop = '0.2em';

                    // 保留段落中的换行
                    p.style.whiteSpace = 'pre-line';
                    p.classList.add('preserve-format');
                }
            });

            // 保留换行符 - 增强版本
            const textNodes = [];
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            textNodes.forEach(textNode => {
                if (textNode.nodeValue && (textNode.nodeValue.includes('\n') || textNode.nodeValue.includes('\r'))) {
                    // 把换行符替换为<br/>
                    const parent = textNode.parentNode;
                    if (parent && parent.nodeName !== 'PRE' && parent.nodeName !== 'CODE') {
                        // 使用更强大的方式检测和处理换行符
                        const fragments = textNode.nodeValue.split(/\r?\n/);
                        if (fragments.length > 1) {
                            const newFragment = document.createDocumentFragment();
                            fragments.forEach((text, index) => {
                                if (index > 0) {
                                    newFragment.appendChild(document.createElement('br'));
                                }
                                if (text !== undefined) { // 保留空行
                                    newFragment.appendChild(document.createTextNode(text));
                                }
                            });
                            parent.replaceChild(newFragment, textNode);
                        }
                    }
                }
            });

            // 确保所有内容容器都能正确显示换行
            const contentContainers = element.querySelectorAll('div[class*="content"], .text, .body, article, section, span, p');
            contentContainers.forEach(container => {
                // 使用pre-line来保留原始文本中的换行
                container.style.whiteSpace = 'pre-line';
                container.classList.add('preserve-format');
            });

            // 对分段明显的文本区域应用更强的格式保留
            const textBlocks = element.querySelectorAll('[class*="text"], [class*="body"], [class*="content"]');
            textBlocks.forEach(block => {
                block.style.whiteSpace = 'pre-line';

                // 查找文本节点中的段落分隔（多个换行）并添加额外空间
                const content = block.innerHTML;
                // 将连续的多个<br>或换行替换为段落分隔
                const enhancedContent = content
                    .replace(/(<br\s*\/?>\s*){2,}/gi, '</p><p style="margin-top: 1em;">') // 多个br标签
                    .replace(/\n\s*\n/g, '</p><p style="margin-top: 1em;">'); // 多个换行符

                // 只有当内容有变化时才应用，避免不必要的DOM操作
                if (content !== enhancedContent) {
                    block.innerHTML = enhancedContent;
                }
            });

            // 确保代码块和预格式文本保留空格和换行
            const preElements = element.querySelectorAll('pre, code, [class*="code"]');
            preElements.forEach(pre => {
                pre.style.whiteSpace = 'pre-wrap';
                pre.style.fontFamily = 'Consolas, Monaco, monospace';
                pre.style.backgroundColor = '#f5f5f5';
                pre.style.padding = '10px';
                pre.style.borderRadius = '5px';
                pre.style.margin = '10px 0';
                pre.style.overflow = 'auto';
            });

            // 处理列表项，确保有适当的间距
            const listItems = element.querySelectorAll('li');
            listItems.forEach(li => {
                li.style.marginBottom = '0.3em';
                // 保留列表项中的换行
                li.style.whiteSpace = 'pre-line';
            });

            // 处理表格，确保边框可见
            const tables = element.querySelectorAll('table');
            tables.forEach(table => {
                table.style.borderCollapse = 'collapse';
                table.style.width = '100%';
                table.style.margin = '15px 0';

                const cells = table.querySelectorAll('th, td');
                cells.forEach(cell => {
                    cell.style.border = '1px solid #ddd';
                    cell.style.padding = '8px';
                    // 保留单元格中的换行
                    cell.style.whiteSpace = 'pre-line';
                });
            });

            // 处理引用块
            const quotes = element.querySelectorAll('blockquote');
            quotes.forEach(quote => {
                quote.style.borderLeft = '4px solid #ddd';
                quote.style.paddingLeft = '15px';
                quote.style.margin = '10px 0';
                quote.style.color = '#555';
                // 保留引用中的换行
                quote.style.whiteSpace = 'pre-line';
            });

            // 处理标题，减少边距
            const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
                heading.style.marginTop = '0.8em';
                heading.style.marginBottom = '0.5em';
            });
        }

        // 处理知识星球特有格式
        function processZsxqSpecificFormat(element) {
            // 识别知识星球的文本块
            const textBlocks = element.querySelectorAll('[class*="text"], [class*="body"], [class*="content"]');

            // 增强的普通内容识别：
            // 1. 如果它是(或包含)标准的正文容器
            // 2. 或者它没有问答类的关键词
            const hasStandardContent = element.matches('.talk-content-container, .talk-content, [class*="content"]') ||
                element.querySelector('.talk-content-container, .talk-content, app-talk-content');

            const isQA = element.querySelector('[class*="question"], [class*="answer"]') &&
                !hasStandardContent; // 如果有标准内容，即使有question/answer类也优先视为普通内容（可能是评论）

            if (hasStandardContent || !isQA) {
                wrapAsNormalContent(element);
            } else {
                // 尝试识别问答结构
                identifyQAStructure(element);
            }

            textBlocks.forEach(block => {
                // 1. 识别换行模式
                const html = block.innerHTML;

                // 2. 处理纯文本中的换行
                if (block.childElementCount === 0 && block.textContent.includes('\n')) {
                    // 将纯文本中的换行符转换为<br>标签
                    const lines = block.textContent.split('\n');
                    if (lines.length > 1) {
                        block.innerHTML = '';
                        lines.forEach((line, index) => {
                            if (index > 0) {
                                block.appendChild(document.createElement('br'));
                            }
                            block.appendChild(document.createTextNode(line));
                        });
                    }
                }

                // 3. 识别并处理多行空格缩进的代码块
                const codeBlockPattern = /(\n[ \t]{2,}[^\n]+){3,}/g;
                const content = block.textContent;
                let match;

                if ((match = codeBlockPattern.exec(content)) !== null) {
                    // 可能是代码块，创建pre元素
                    const pre = document.createElement('pre');
                    pre.className = 'detected-code-block';
                    pre.style.cssText = 'background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0; white-space: pre; font-family: monospace;';
                    pre.textContent = match[0].trim();

                    // 将代码块内容替换为pre元素
                    const newHtml = block.innerHTML.replace(match[0], pre.outerHTML);
                    block.innerHTML = newHtml;
                }
            });

            // 特别处理知识星球常见的分隔线
            const dividers = element.querySelectorAll('hr, [class*="divider"]');
            dividers.forEach(divider => {
                divider.style.margin = '1em 0';
                divider.style.borderTop = '1px solid #eee';
                divider.style.height = '1px';
            });
        }

        // 将普通内容包装为特定样式
        function wrapAsNormalContent(element) {
            // 尝试找到更大的完整容器（包含评论区的）
            // 这确保我们不会只包装了正文而丢掉了评论
            const fullContainer = findPostContainer(element);
            if (fullContainer && fullContainer !== element && fullContainer.contains(element)) {
                // 只有当找到的容器确实是父级时才替换
                // 防止死循环或错误替换
                element = fullContainer;
            }

            // 如果已经被包装过，则跳过
            if (element.closest('.zsxq-normal-content')) return;

            // 检查是否有足够的内容
            if (!element.textContent.trim()) return;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'zsxq-normal-content';
            contentDiv.style.cssText = `
                background-color: #fff;
                border-left: 4px solid #FF9800;
                padding: 15px;
                margin: 15px 0;
                border-radius: 4px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            `;

            // 添加作者信息
            const authorName = extractAuthorInfo(element);
            if (authorName) {
                const authorDiv = document.createElement('div');
                authorDiv.className = 'zsxq-content-author';
                authorDiv.style.cssText = `
                    color: #333;
                    font-weight: bold;
                    margin-bottom: 5px;
                `;
                authorDiv.textContent = authorName;
                contentDiv.appendChild(authorDiv);
            }

            // 添加时间信息
            const timeInfo = extractTimeInfo(element);
            if (timeInfo) {
                const timeDiv = document.createElement('div');
                timeDiv.className = 'zsxq-content-time';
                timeDiv.style.cssText = `
                    color: #666;
                    font-size: 0.9em;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px dashed #eee;
                `;
                timeDiv.textContent = `发布时间：${timeInfo}`;
                contentDiv.appendChild(timeDiv);
            }

            // 添加标题（如果存在）
            const title = element.querySelector('h1, h2, h3, .title, [class*="title"]');
            if (title) {
                const titleDiv = document.createElement('div');
                titleDiv.className = 'zsxq-content-title';
                titleDiv.style.cssText = `
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #eee;
                `;
                titleDiv.textContent = title.textContent;
                contentDiv.appendChild(titleDiv);
            }

            // 克隆内容
            const clone = element.cloneNode(true);

            // 如果有标题元素，从克隆中移除它（因为我们已经单独处理了）
            if (title) {
                const clonedTitle = clone.querySelector('h1, h2, h3, .title, [class*="title"]');
                if (clonedTitle && clonedTitle.parentNode) {
                    clonedTitle.parentNode.removeChild(clonedTitle);
                }
            }

            contentDiv.appendChild(clone);

            // 添加打印按钮
            const printBtn = document.createElement('button');
            printBtn.className = 'zsxq-print-btn';
            printBtn.textContent = '打印内容';
            printBtn.style.cssText = `
                background: #FF9800;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 14px;
                margin: 8px 0;
                display: inline-block;
            `;

            printBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                directPrint(contentDiv);
            });

            // 将打印按钮添加到内容顶部
            contentDiv.insertBefore(printBtn, contentDiv.firstChild);

            // 替换原始元素
            if (element.parentNode) {
                element.parentNode.replaceChild(contentDiv, element);
            }
        }

        // 识别问答结构
        function identifyQAStructure(element) {
            // 1. 首先尝试查找知识星球特有的问答结构
            const questionElements = element.querySelectorAll(
                '[class*="question"], [class*="ask"], [class*="topic"], [class*="title"]'
            );
            const answerElements = element.querySelectorAll(
                '[class*="answer"], [class*="reply"], [class*="comment"], [class*="response"]'
            );

            // 如果找到了明确的问答结构
            if (questionElements.length > 0 && answerElements.length > 0) {
                questionElements.forEach(q => {
                    // 排除 span 等行内元素，避免破坏布局
                    if (q.tagName === 'SPAN' || q.tagName === 'A' || q.tagName === 'I' || q.tagName === 'B') return;

                    if (!q.closest('.zsxq-question') && q.textContent.trim()) {
                        wrapAsQuestion(q);
                    }
                });

                answerElements.forEach(a => {
                    // 排除 span 等行内元素，尤其是知识星球评论区中的用户名 <span class="comment">
                    if (a.tagName === 'SPAN' || a.tagName === 'A' || a.tagName === 'I' || a.tagName === 'B') return;

                    if (!a.closest('.zsxq-answer') && a.textContent.trim()) {
                        wrapAsAnswer(a);
                    }
                });
                return; // 已找到明确结构，处理完毕
            }

            // 2. 尝试从元素关系识别问答
            // 寻找可能的问题部分（通常是标题或第一段）
            const possibleQuestions = element.querySelectorAll('h1, h2, h3, h4, .title, .topic-title, .topic');

            // 如果找到了可能的问题部分
            if (possibleQuestions.length > 0) {
                possibleQuestions.forEach(q => {
                    if (!q.closest('.zsxq-question') && q.textContent.trim().length > 5) {
                        // 找出问题之后的内容作为回答
                        let answer = findAnswerContent(q);
                        if (answer) {
                            wrapAsQuestion(q);
                            wrapAsAnswer(answer);
                        }
                    }
                });
                return;
            }

            // 3. 尝试通过内容特征识别问答（如文字特征、格式）
            const paragraphs = element.querySelectorAll('p, div, section');
            let lastWasQuestion = false;

            for (let i = 0; i < paragraphs.length; i++) {
                const p = paragraphs[i];
                if (p.closest('.zsxq-question') || p.closest('.zsxq-answer')) continue;

                const text = p.textContent.trim();
                if (!text) continue;

                // 通过内容特征识别问题（以问号结尾或包含问题相关词）
                if ((text.endsWith('?') || text.endsWith('？')) ||
                    /问题|请问|如何|什么|为什么|怎么|能否|能不能|是否/.test(text)) {

                    if (text.length > 10 && text.length < 200) {
                        wrapAsQuestion(p);
                        lastWasQuestion = true;
                    }
                }
                // 将问题后的段落视为回答
                else if (lastWasQuestion && text.length > 20) {
                    wrapAsAnswer(p);
                    lastWasQuestion = false;
                }
            }

            // 4. 尝试识别整体结构
            // 如果页面结构比较清晰，可能有一个问题区和一个回答区
            const mainContent = element.querySelector('main, .main, #main, article, .article, #article');
            if (mainContent) {
                const children = Array.from(mainContent.children);
                if (children.length >= 2) {
                    // 假设第一部分是问题，其余是回答
                    const firstPart = children[0];
                    if (!firstPart.closest('.zsxq-question') && !firstPart.closest('.zsxq-answer')) {
                        wrapAsQuestion(firstPart);

                        const remainingContent = document.createElement('div');
                        for (let i = 1; i < children.length; i++) {
                            if (!children[i].closest('.zsxq-question') && !children[i].closest('.zsxq-answer')) {
                                remainingContent.appendChild(children[i].cloneNode(true));
                            }
                        }

                        if (remainingContent.textContent.trim()) {
                            const answerDiv = document.createElement('div');
                            answerDiv.className = 'zsxq-answer';
                            const header = document.createElement('div');
                            header.className = 'zsxq-answer-header';
                            header.textContent = '回答';
                            answerDiv.appendChild(header);
                            answerDiv.appendChild(remainingContent);

                            mainContent.appendChild(answerDiv);
                        }
                    }
                }
            }
        }

        // 查找问题之后的回答内容
        function findAnswerContent(questionElement) {
            let current = questionElement.nextElementSibling;

            // 跳过空元素或不相关元素
            while (current &&
                (current.textContent.trim() === '' ||
                    current.tagName === 'BR' ||
                    current.style.display === 'none')) {
                current = current.nextElementSibling;
            }

            // 如果下一个元素存在且不是标题，可能是回答
            if (current &&
                !current.tagName.match(/^H[1-6]$/) &&
                !current.className.includes('question') &&
                !current.className.includes('title')) {
                return current;
            }

            // 如果找不到明确的回答元素，尝试使用问题的父元素之后的内容
            const parent = questionElement.parentElement;
            if (parent) {
                current = parent.nextElementSibling;
                if (current && current.textContent.trim() !== '') {
                    return current;
                }
            }

            return null;
        }

        // 将元素包装为问题样式
        function wrapAsQuestion(element) {
            if (element.closest('.zsxq-question')) return; // 已经包装过

            const questionDiv = document.createElement('div');
            questionDiv.className = 'zsxq-question';

            const header = document.createElement('div');
            header.className = 'zsxq-question-header';
            header.textContent = '问题';

            // 添加时间信息
            const timeInfo = extractTimeInfo(element);
            if (timeInfo) {
                const timeDiv = document.createElement('div');
                timeDiv.className = 'zsxq-content-time';
                timeDiv.style.cssText = `
                    color: #666;
                    font-size: 0.9em;
                    margin: 5px 0;
                `;
                timeDiv.textContent = `发布时间：${timeInfo}`;
                header.appendChild(timeDiv);
            }

            const clone = element.cloneNode(true);

            questionDiv.appendChild(header);
            questionDiv.appendChild(clone);

            if (element.parentNode) {
                element.parentNode.replaceChild(questionDiv, element);
            }
        }

        // 将元素包装为回答样式
        function wrapAsAnswer(element) {
            if (element.closest('.zsxq-answer')) return; // 已经包装过

            const answerDiv = document.createElement('div');
            answerDiv.className = 'zsxq-answer';

            const header = document.createElement('div');
            header.className = 'zsxq-answer-header';
            header.textContent = '回答';

            // 添加时间信息
            const timeInfo = extractTimeInfo(element);
            if (timeInfo) {
                const timeDiv = document.createElement('div');
                timeDiv.className = 'zsxq-content-time';
                timeDiv.style.cssText = `
                    color: #666;
                    font-size: 0.9em;
                    margin: 5px 0;
                `;
                timeDiv.textContent = `发布时间：${timeInfo}`;
                header.appendChild(timeDiv);
            }

            const clone = element.cloneNode(true);

            answerDiv.appendChild(header);
            answerDiv.appendChild(clone);

            if (element.parentNode) {
                element.parentNode.replaceChild(answerDiv, element);
            }
        }

        // 移除收起的内容
        function removeCollapsedContent(element) {
            // 尝试查找知识星球常见的"收起"按钮
            const foldButtons = element.querySelectorAll('[class*="fold"], [class*="collapse"], .spread, .unfold, .arrow-down, .arrow-up');
            foldButtons.forEach(button => {
                // 找到按钮所在的容器
                let container = button.parentNode;
                // 向上查找最多3层
                for (let i = 0; i < 3; i++) {
                    if (container && container.contains(button)) {
                        // 查找该容器下是否有被隐藏的内容
                        const hiddenContent = container.querySelectorAll('[style*="display: none"], [style*="height: 0"]');
                        hiddenContent.forEach(hidden => {
                            if (hidden.parentNode) {
                                hidden.parentNode.removeChild(hidden);
                            }
                        });

                        // 上移一层继续查找
                        container = container.parentNode;
                    }
                }

                // 移除按钮本身
                if (button.parentNode) {
                    button.parentNode.removeChild(button);
                }
            });

            // 查找被隐藏的元素
            const hiddenElements = element.querySelectorAll(
                '[style*="display: none"], [style*="visibility: hidden"], [hidden], [aria-hidden="true"]'
            );
            hiddenElements.forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        }

        // 移除多余空白
        function removeExcessWhitespace(element) {
            // 移除所有空元素
            const emptyDivs = element.querySelectorAll('div:empty, p:empty, section:empty, br:first-child, br + br');
            emptyDivs.forEach(div => {
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
            });

            // 查找第一个有意义的内容元素，确保它没有顶部边距
            const firstContent = element.querySelector('p, div, h1, h2, h3, h4, h5, h6');
            if (firstContent) {
                firstContent.style.marginTop = '0';
            }

            // 压缩所有元素的边距
            const allElements = element.querySelectorAll('*');
            allElements.forEach(el => {
                if (el.tagName !== 'HEAD' && el.tagName !== 'HTML' && el.tagName !== 'BODY') {
                    // 设置最大上下边距
                    if (parseFloat(getComputedStyle(el).marginTop) > 10) {
                        el.style.marginTop = '0.4em';
                    }
                    if (parseFloat(getComputedStyle(el).marginBottom) > 10) {
                        el.style.marginBottom = '0.3em';
                    }

                    // 减少内边距
                    if (parseFloat(getComputedStyle(el).paddingTop) > 10) {
                        el.style.paddingTop = '0.3em';
                    }
                    if (parseFloat(getComputedStyle(el).paddingBottom) > 10) {
                        el.style.paddingBottom = '0.3em';
                    }

                    // 标题边距减少
                    if (el.tagName === 'H1' || el.tagName === 'H2' ||
                        el.tagName === 'H3' || el.tagName === 'H4') {
                        el.style.marginTop = '0.5em';
                        el.style.marginBottom = '0.3em';
                    }
                }
            });

            // 移除第一个元素之前的所有空白节点
            let node = element.firstChild;
            while (node && node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') {
                const nextNode = node.nextSibling;
                element.removeChild(node);
                node = nextNode;
            }

            // 检查并处理顶层非内容元素
            const topNodes = Array.from(element.childNodes);
            for (let i = 0; i < Math.min(3, topNodes.length); i++) {
                const node = topNodes[i];
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 删除顶部可能的空白容器
                    if (node.textContent.trim() === '' && !node.querySelector('img')) {
                        if (node.parentNode) {
                            node.parentNode.removeChild(node);
                        }
                    } else {
                        // 确保第一个内容元素没有上边距
                        node.style.marginTop = '0';
                        const firstChild = node.querySelector('p, div, h1, h2, h3, h4, h5, h6');
                        if (firstChild) {
                            firstChild.style.marginTop = '0';
                        }
                    }
                }
            }
        }

        // 提取日期信息
        function extractDateInfo(content) {
            let dateStr = '';
            const dateElement = content.querySelector('.date, [class*="time"], [class*="date"], .timestamp, [class*="timestamp"]');
            if (dateElement) {
                const dateText = dateElement.textContent.trim();
                const date = new Date(dateText);
                if (!isNaN(date.getTime())) {
                    dateStr = formatDate(date, 'yyyy.MM.dd - ');
                } else {
                    dateStr = formatDate(new Date(), 'yyyy.MM.dd - ');
                }
            } else {
                dateStr = formatDate(new Date(), 'yyyy.MM.dd - ');
            }
            return dateStr;
        }

        // 提取作者信息
        function extractAuthorInfo(content) {
            let authorName = '';
            const authorElements = content.querySelectorAll('.author, [class*="author"], [class*="name"], .username, [class*="username"], .nickname, [class*="nickname"], [class*="role"], .owner');
            authorElements.forEach(el => {
                const text = el.textContent.trim();
                if (text && text.length < 20 && !authorName) {
                    authorName = text;
                }
            });
            return authorName;
        }

        // 提取标题信息
        function extractTitleInfo(content) {
            let titleText = '';
            const isXiaobot = window.location.hostname.includes('xiaobot.net');

            const titleElements = content.querySelectorAll('h1, h2, .title, [class*="title"], .subject, [class*="subject"], .topic-title, [class*="topic-title"]');
            titleElements.forEach(el => {
                const text = el.textContent.trim();
                if (text && text.length > 5 && text.length < 100 && !titleText) {
                    titleText = text;
                }
            });

            if (!titleText) {
                // 尝试从页面标题获取
                if (isXiaobot) {
                    titleText = document.title.replace(/小报童|xiaobot\.net/gi, '').trim();
                } else {
                    titleText = document.title.replace('知识星球', '').trim();
                }
            }
            return titleText;
        }

        // 提取时间信息的函数
        function extractTimeInfo(element) {
            const isXiaobot = window.location.hostname.includes('xiaobot.net');

            // 根据网站类型选择时间选择器
            const timeSelectors = isXiaobot ? [
                // xiaobot.net 时间选择器
                '[class*="time"]', '[class*="date"]', '[class*="timestamp"]',
                'time', '.time', '.date', '.timestamp', '.published',
                '[class*="published"]', '[class*="created"]', '[class*="updated"]',
                '.meta', '[class*="meta"]', '.info', '[class*="info"]'
            ] : [
                // 知识星球时间选择器
                'div[class*="date"]', // 知识星球2024版本的时间选择器
                '[class*="time"]',
                '[class*="date"]',
                'time',
                '.timestamp'
            ];

            // 从当前元素开始向上查找最多5层父级
            let current = element;
            let searchDepth = 0;
            while (current && searchDepth < 5) {
                // 在当前元素中查找时间
                for (let selector of timeSelectors) {
                    const timeElements = current.querySelectorAll(selector);
                    for (const timeElement of timeElements) {
                        const timeText = timeElement.textContent.trim();
                        // 匹配多种时间格式
                        if (isXiaobot) {
                            // xiaobot.net 时间格式：支持更多格式
                            if (timeText && (
                                /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(timeText) || // 2025-03-13 15:55
                                /^\d{4}\/\d{2}\/\d{2}/.test(timeText) || // 2025/03/13
                                /^\d{4}\.\d{2}\.\d{2}/.test(timeText) || // 2025.03.13
                                /^\d{2}-\d{2}\s+\d{2}:\d{2}/.test(timeText) || // 03-13 15:55
                                /^\d{2}\/\d{2}\s+\d{2}:\d{2}/.test(timeText) // 03/13 15:55
                            )) {
                                return timeText;
                            }
                        } else {
                            // 知识星球时间格式
                            if (timeText && /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(timeText)) {
                                return timeText;
                            }
                        }
                    }
                }
                current = current.parentElement;
                searchDepth++;
            }

            return '';
        }

        // 格式化日期的辅助函数
        function formatDate(date, fmt) {
            const opt = {
                "y+": date.getFullYear().toString(),
                "M+": (date.getMonth() + 1).toString(),
                "d+": date.getDate().toString(),
                "h+": date.getHours().toString(),
                "m+": date.getMinutes().toString(),
                "s+": date.getSeconds().toString()
            };

            let ret;
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
                }
            }
            return fmt;
        }
    }

    // 查找交互区域
    function findInteractionArea(block) {
        // 尝试各种可能的交互区域选择器
        const interactionSelectors = [
            '.actions', '.action-area', '.operate', '.operation',
            '.toolbar', '.tools', '.controls', '.buttons',
            '[class*="action"]', '[class*="operate"]', '[class*="tool"]',
            '[class*="control"]', '[class*="button"]', '.footer', '.bottom'
        ];

        for (let selector of interactionSelectors) {
            const area = block.querySelector(selector);
            if (area && area.offsetParent !== null) {
                return area;
            }
        }

        // 如果找不到适合的区域，可以返回内容块本身
        return block;
    }

    // 查找包含当前内容块的完整帖子容器
    function findPostContainer(contentBlock) {
        // 尝试找到完整的帖子容器
        // 优先级：总是优先选择包含评论的更大容器
        const postSelectors = [
            // ZSXQ Top-level Containers (Immediate Return)
            '.feed-item', '.topic-item', '[watermark="main"]',
            '.post', '.topic', '.article',
            // Generic Top-level
            '[class*="post-container"]', '[class*="topic-container"]', '[class*="article-container"]',
            '.card', '.post-card', '.topic-card',

            // Mid-level Containers (Fallback/Candidate)
            // 这些容器可能很大，但评论区可能在其兄弟节点（如 feed-item > detail-panel + comment-box）
            // 所以我们将它们降级为"备选"，继续向上查找父级
            '.topic-detail-panel', 'app-topic-detail-panel',

            // Narrow Containers (Fallback)
            '.talk-content-container', 'app-talk-content',
            '.comment-box', 'app-comment-box', // 如果用户正好选中了评论区
        ];

        let bestContainer = null;
        let current = contentBlock;

        // 向上查找，记录找到的最佳容器
        while (current && current !== document.body) {
            for (const selector of postSelectors) {
                if (current.matches(selector)) {
                    // 1. 顶级容器：直接返回
                    // 这些通常是包含所有内容（正文+评论）的最外层包装
                    if (current.matches('.feed-item') ||
                        current.matches('.topic-item') ||
                        current.matches('.post') ||
                        current.matches('.topic') ||
                        current.matches('.article') ||
                        current.matches('.card') ||
                        current.matches('.post-card') ||
                        current.matches('.topic-card')) {
                        return current;
                    }

                    // 2. 中级或狭义容器：记录为备选，但通过检测兄弟元素来决定是否应该返回父级
                    if (!bestContainer) {
                        bestContainer = current;
                    }

                    if (current.matches('.topic-detail-panel') || current.matches('app-topic-detail-panel')) {
                        const siblingComment = current.parentElement.querySelector('.comment-box, app-comment-box, .comment-list, app-comment-list');
                        if (siblingComment) {
                            // 如果发现了兄弟评论区，说明父级才是真正的完整容器
                            return current.parentElement;
                        }
                    }

                    // 继续向上找，看能不能找到更大的容器
                    break;
                }
            }

            // 3. 动态检查：如果当前节点包含了评论区，那么它很可能是我们想要的容器
            // 这种检查比单纯对比类名更可靠
            const hasCommentBox = current.querySelector('.comment-box, app-comment-box, .comment-list, app-comment-list, app-comment-item');
            if (hasCommentBox) {
                // 排除 document.body 和 html
                if (current !== document.body && current !== document.documentElement) {
                    // 记录为最佳容器，但允许继续向上找一两层以防万一
                    // 但通常由内向外找到的第一个包含评论的容器就是Post容器
                    return current;
                }
            }

            current = current.parentElement;
        }

        // 如果找到了备选容器，且没有找到更大的容器，就用它
        if (bestContainer) {
            return bestContainer;
        }

        // 如果找不到合适的父级，尝试在页面中找到可能包含当前内容的容器
        const pageContainers = document.querySelectorAll(postSelectors.join(','));
        for (const container of pageContainers) {
            if (container.contains(contentBlock)) {
                return container;
            }
        }

        // 如果都找不到，返回原始内容块
        return null;
    }

    // 最后的保障措施 - 即使前面的方法都失败，也确保脚本初始化
    setTimeout(() => {
        if (!window.zsxqPdfExportInitialized) {
            console.log("脚本似乎未正常初始化，强制初始化");
            initButtons();
            addGlobalPrintButton();
        }

        // 修改：为所有网站都添加紧急工具栏作为备用方案
        if (!document.querySelector('.zsxq-emergency-toolbar')) {
            console.log("未检测到紧急工具栏，添加批量导出功能");
            addEmergencyPrintButton();
        }
    }, 8000);

    // 初始化
    setTimeout(initButtons, 1500);

    // 对于xiaobot.net，添加更早的初始化
    if (window.location.hostname.includes('xiaobot.net')) {
        console.log("xiaobot.net网站，添加快速初始化");
        setTimeout(() => {
            if (!document.querySelector('.zsxq-emergency-toolbar')) {
                addEmergencyPrintButton();
            }
        }, 3000);
    }

    // 新增：为知识星球网站也添加快速初始化
    if (window.location.hostname.includes('zsxq.com')) {
        console.log("知识星球网站，添加快速初始化");
        setTimeout(() => {
            if (!document.querySelector('.zsxq-emergency-toolbar')) {
                addEmergencyPrintButton();
            }
        }, 3000);
    }

    // 在样式中添加普通内容的样式
    const style = document.createElement('style');
    style.textContent = `
        .zsxq-normal-content {
            background-color: #fff;
            border-left: 4px solid #FF9800;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .zsxq-content-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
        }
        /* 确保普通内容中的文本格式正确 */
        .zsxq-normal-content p,
        .zsxq-normal-content div {
            margin: 0.5em 0;
            line-height: 1.6;
            white-space: pre-line;
        }
        .zsxq-normal-content img {
            max-width: 100%;
            height: auto;
            margin: 10px 0;
        }
        .zsxq-content-time {
            color: #666;
            font-size: 0.9em;
            margin: 5px 0;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
})();