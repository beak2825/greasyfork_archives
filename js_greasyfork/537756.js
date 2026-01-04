// ==UserScript==
// @name         AI网站公式复制Latex
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  支持Claude、DeepSeek、Google Gemini等网站的公式复制，包括点击复制、选择复制和按钮复制，格式化为$和$$包裹的LaTeX
// @license      MIT
// @author       fanxing
// @match        *://demo.fuclaude.oaifree.com/*
// @match        *://claude.ai/*
// @match        *://*.zhihu.com/*
// @match        *://*.wikipedia.org/*
// @match        *://*.chatgpt.com/*
// @match        *://*.x.liaox.ai/*
// @match        *://*.moonshot.cn/*
// @match        *://*.stackexchange.com/*
// @match        *://*.oi-wiki.org/*
// @match        *://*.luogu.com/*
// @match        *://*.doubao.com/*
// @match        *://*.deepseek.com/*
// @match        *://chat.deepseek.com/*
// @match        *://aistudio.google.com/*
// @match        *://gemini.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537756/AI%E7%BD%91%E7%AB%99%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6Latex.user.js
// @updateURL https://update.greasyfork.org/scripts/537756/AI%E7%BD%91%E7%AB%99%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6Latex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('公式复制格式调整脚本已加载');
    console.log('当前网站:', window.location.href);
    console.log('浏览器剪贴板API支持:', {
        clipboard: !!navigator.clipboard,
        writeText: !!(navigator.clipboard && navigator.clipboard.writeText),
        write: !!(navigator.clipboard && navigator.clipboard.write),
        ClipboardItem: !!window.ClipboardItem
    });

    // 安全检查：确保脚本只加载一次
    if (window.formulaScriptLoaded) {
        console.log('脚本已经加载过，跳过重复加载');
        return;
    }
    window.formulaScriptLoaded = true;

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .formula-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: opacity 0.3s, transform 0.3s;
            opacity: 0;
            transform: translateY(20px);
        }
        .formula-toast.show {
            opacity: 1;
            transform: translateY(0);
        }
        .formula-toast.success {
            background-color: #4caf50;
        }
        .formula-toast.error {
            background-color: #f44336;
        }
        .formula-toast.info {
            background-color: #2196F3;
        }

        /* LaTeX提示框样式 */
        .latex-tooltip {
            position: fixed;
            background-color: #333;
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10001;
            display: none;
            opacity: 0;
            transition: opacity 0.2s;
            max-width: 350px;
            word-break: break-all;
            white-space: pre-wrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            font-family: monospace;
            pointer-events: none;
        }

        /* 复制成功提示 */
        .latex-copy-success {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10002;
            transition: opacity 0.2s;
            opacity: 1;
        }

        /* 高亮样式 */
        .formula-hover {
            cursor: pointer !important;
            box-shadow: 0 0 0 1px #007bff !important;
            background-color: rgba(0, 123, 255, 0.1) !important;
        }
    `;
    document.head.appendChild(style);

    // 创建提示框元素
    const tooltip = document.createElement('div');
    tooltip.classList.add('latex-tooltip');
    document.body.appendChild(tooltip);

    // 声明全局变量
    let tooltipTimeout;
    let activeFormulaElement = null;

    // Gemini专用：KaTeX Hook系统
    const allKatexGemini = {};
    let isGeminiKatexHooked = false;

    // Gemini专用：Hook KaTeX render方法
    function hookKatexRender(katexObj) {
        if (!katexObj || typeof katexObj.render !== 'function') {
            console.warn('katex.render not found, skipping hook');
            return false;
        }

        const originalRender = katexObj.render;
        katexObj.render = new Proxy(originalRender, {
            apply: function(target, thisArg, args) {
                let result = target.apply(thisArg, args);
                if (args.length >= 2) {
                    const latexStr = args[0];
                    const element = args[1];
                    const katexHtml = element.querySelector('.katex-html');
                    if (element instanceof Element && katexHtml !== null) {
                        allKatexGemini[katexHtml.outerHTML] = latexStr;
                        console.log('Gemini KaTeX记录:', latexStr);
                    }
                }
                return result;
            }
        });
        console.log('Successfully hooked katex.render for Gemini');
        return true;
    }

    // Gemini专用：设置KaTeX Hook
    function setupGeminiKatexHook() {
        if (isGeminiKatexHooked) return;

        // 1. 检查现有katex
        if (window.katex) {
            isGeminiKatexHooked = hookKatexRender(window.katex);
            return;
        }

        // 2. 监听katex赋值
        let originalKatex = window.katex;
        Object.defineProperty(window, 'katex', {
            set: function(newKatex) {
                console.log('Detected katex assignment for Gemini, hooking render...');
                originalKatex = newKatex;
                if (!isGeminiKatexHooked) {
                    isGeminiKatexHooked = hookKatexRender(originalKatex);
                }
                return originalKatex;
            },
            get: function() {
                return originalKatex;
            },
            configurable: true
        });
    }

    // Gemini专用：处理选择复制时的KaTeX替换
    function katexReplaceWithTexGemini(fragment) {
        const katexHtml = fragment.querySelectorAll('.katex-html');
        for (let i = 0; i < katexHtml.length; i++) {
            const element = katexHtml[i];
            const texSource = document.createElement('annotation');
            
            if (element.outerHTML && allKatexGemini[element.outerHTML]) {
                const latexStr = allKatexGemini[element.outerHTML];
                
                // 判断是否为显示模式（块级公式）
                const isDisplayMode = element.closest('.katex-display') || 
                                     element.closest('.math-block');
                
                if (isDisplayMode) {
                    texSource.textContent = `\n$$\n${latexStr}\n$$\n`;
                } else {
                    texSource.textContent = `$${latexStr}$`;
                }

                if (element.replaceWith) {
                    element.replaceWith(texSource);
                } else if (element.parentNode) {
                    element.parentNode.replaceChild(texSource, element);
                }
            }
        }
        return fragment;
    }

    // Gemini专用：查找包含节点的最近KaTeX元素
    function closestKatex(node) {
        const element = (node instanceof Element ? node : node.parentElement);
        return element && element.closest('.katex');
    }

    // 显示Toast提示函数
    function showToast(message, type = 'success', duration = 3000) {
        // 移除现有的toast，避免重叠
        const existingToast = document.querySelector('.formula-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新的toast
        const toast = document.createElement('div');
        toast.className = `formula-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // 显示toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // 设置自动消失
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }

    // 显示复制成功提示
    function showCopySuccessTooltip() {
        const copyTooltip = document.createElement("div");
        copyTooltip.className = "latex-copy-success";
        copyTooltip.innerText = "已复制LaTeX公式";
        document.body.appendChild(copyTooltip);
        setTimeout(() => {
            copyTooltip.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(copyTooltip);
            }, 200);
        }, 1000);
    }

    // 设置剪贴板为纯文本
    async function setClipboardToPlainText(text) {
        console.log('开始设置剪贴板，文本长度:', text.length);

        // 方法1：使用ClipboardItem（更可靠的纯文本格式）
        try {
            if (navigator.clipboard && window.ClipboardItem) {
                const blob = new Blob([text], { type: 'text/plain' });
                const data = new ClipboardItem({
                    'text/plain': blob
                });

                await navigator.clipboard.write([data]);
                console.log('已成功将内容设置为纯文本格式到剪贴板（方法1）');
                return true;
            }
        } catch (err) {
            console.error('ClipboardItem方法失败:', err);
        }

        // 方法2：使用writeText（备用方法）
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                console.log('已成功使用writeText设置剪贴板（方法2）');
                return true;
            }
        } catch (err) {
            console.error('writeText方法失败:', err);
        }

        // 方法3：使用传统的execCommand（最后备用）
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                console.log('已成功使用execCommand设置剪贴板（方法3）');
                return true;
            }
        } catch (err) {
            console.error('execCommand方法失败:', err);
        }

        console.error('所有剪贴板方法都失败了');
        return false;
    }

    // 隐藏提示框的函数
    function hideTooltip() {
        tooltip.style.display = 'none';
        tooltip.style.opacity = '0';
        if (activeFormulaElement) {
            activeFormulaElement.classList.remove('formula-hover');
            activeFormulaElement = null;
        }
    }

    // 全局点击和滚动事件强制隐藏提示框
    document.addEventListener('click', function(e) {
        // 检查点击是否在公式上，如果不是，隐藏提示框
        if (activeFormulaElement && !activeFormulaElement.contains(e.target)) {
            hideTooltip();
        }
    });

    document.addEventListener('scroll', hideTooltip);
    window.addEventListener('resize', hideTooltip);

    // 获取对象和公式方法
    function getTarget(url) {
        let target = { elementSelector: '', getLatexString: null, isDisplayMode: null }

        // 检查元素是否是公式块
        function isDisplayModeFormula(element) {
            // Claude
            if (element.classList.contains('math-display') ||
                element.closest('.math-display') !== null) {
                return true;
            }

            // KaTeX相关网站
            if (element.classList.contains('katex-display') ||
                element.closest('.katex-display') !== null) {
                return true;
            }

            // DeepSeek
            if (element.closest('.ds-markdown-math') !== null) {
                return true;
            }

            // Google AI Studio - 检查ms-katex元素是否为块级公式
            if (element.tagName === 'MS-KATEX' && !element.classList.contains('inline')) {
                return true;
            }
            if (element.closest('ms-katex') && !element.closest('ms-katex').classList.contains('inline')) {
                return true;
            }

            return false;
        }

        // 格式化latex
        function formatLatex(input, isDisplayMode) {
            if (!input) return null;

            // 清理可能的多余字符
            input = input.trim();
            while (input.endsWith(' ') || input.endsWith('\\')) {
                input = input.slice(0, -1).trim();
            }

            // 如果输入已经有$或$$包裹，先去除
            if (input.startsWith('$') && input.endsWith('$')) {
                // 判断是否是$$公式块
                if (input.startsWith('$$') && input.endsWith('$$')) {
                    input = input.slice(2, -2).trim();
                } else {
                    input = input.slice(1, -1).trim();
                }
            }

            // 额外剥离 \( ... \) 与 \[ ... \] 定界，兼容豆包等站点
            if ((input.startsWith('\\(') && input.endsWith('\\)')) ||
                (input.startsWith('\\[') && input.endsWith('\\]'))) {
                // \( ... \) 或 \[ ... \]
                input = input.slice(2, -2).trim();
            }

            // 根据显示模式添加适当的分隔符
            if (isDisplayMode) {
                return '\n$$\n' + input + '\n$$\n';
            } else {
                return '$' + input + '$';
            }
        }

        // Claude.ai
        if (url.includes('claude.ai') || url.includes('fuclaude.oaifree.com')) {
            target.elementSelector = 'span.katex, span.math-inline, span.math-display, div.math-display';
            target.getLatexString = (element) => {
                const annotation = element.querySelector('annotation[encoding="application/x-tex"]');
                const isDisplay = isDisplayModeFormula(element);
                return annotation ? formatLatex(annotation.textContent, isDisplay) : null;
            };
            target.isDisplayMode = isDisplayModeFormula;
            return target;
        }
        // DeepSeek
        else if (url.includes('deepseek.com')) {
            target.elementSelector = 'span.katex';
            target.getLatexString = (element) => {
                const annotation = element.querySelector('annotation[encoding="application/x-tex"]');
                // 检查是否是公式块
                const isDisplay = isDisplayModeFormula(element);
                return annotation ? formatLatex(annotation.textContent, isDisplay) : null;
            };
            target.isDisplayMode = isDisplayModeFormula;
            return target;
        }
        // Google Gemini
        else if (url.includes('gemini.google.com')) {
            target.elementSelector = 'span.katex, span.katex-html, .katex-html, span.math-inline, div.math-block span.katex, span.math-display, div.math-block, .math-inline, .math-display';
            target.getLatexString = (element) => {
                // 使用Gemini的hook数据
                const katexHtml = element.classList.contains('katex-html') ? element : element.querySelector('.katex-html');
                if (katexHtml && allKatexGemini[katexHtml.outerHTML]) {
                    const latexStr = allKatexGemini[katexHtml.outerHTML];
                    const isDisplay = isDisplayModeFormula(element);
                    return formatLatex(latexStr, isDisplay);
                }
                return null;
            };
            target.isDisplayMode = isDisplayModeFormula;
            return target;
        }
        // Google AI Studio
        else if (url.includes('aistudio.google.com')) {
            target.elementSelector = 'ms-katex, span.katex, span.math-inline, span.math-display, div.math-display';
            target.getLatexString = (element) => {
                const annotation = element.querySelector('annotation[encoding="application/x-tex"]');
                const isDisplay = isDisplayModeFormula(element);
                return annotation ? formatLatex(annotation.textContent, isDisplay) : null;
            };
            target.isDisplayMode = isDisplayModeFormula;
            return target;
        }
        // 豆包
        else if (url.includes('doubao.com')) {
            target.elementSelector = 'span.container-rkuXQi, span.katex, span.math-inline, span.math-display';
            target.getLatexString = (element) => {
                // 优先从最近的容器读取 data-custom-copy-text（兼容事件绑定在 .katex 等子节点的情况）
                const container = element.closest('.container-rkuXQi') || element;
                const customCopyText = container.getAttribute('data-custom-copy-text') || element.getAttribute('data-custom-copy-text');
                if (customCopyText) {
                    // 显示模式：优先依据是否存在 .katex-display，其次依据容器/元素的行内/块级标记
                    const isDisplay = !!(container.querySelector('.katex-display') || element.closest('.katex-display')) ||
                                      container.classList.contains('math-display') ||
                                      (!container.classList.contains('math-inline') && !element.classList.contains('math-inline'));
                    return formatLatex(customCopyText, isDisplay);
                }
                
                // 回退到标准annotation方法
                const annotation = element.querySelector('annotation[encoding="application/x-tex"]');
                const isDisplay = isDisplayModeFormula(element);
                return annotation ? formatLatex(annotation.textContent, isDisplay) : null;
            };
            target.isDisplayMode = (element) => !!(element.querySelector && element.querySelector('.katex-display')) ||
                                               !!element.closest('.katex-display') ||
                                               element.classList.contains('math-display') ||
                                               !element.classList.contains('math-inline');
            return target;
        }
        // 知乎
        else if (url.includes('zhihu.com')) {
            target.elementSelector = 'span.ztext-math';
            target.getLatexString = (element) => {
                const isDisplay = element.classList.contains('ztext-math-block');
                return formatLatex(element.getAttribute('data-tex'), isDisplay);
            };
            target.isDisplayMode = (element) => element.classList.contains('ztext-math-block');
            return target;
        }
        // 默认KaTeX检测
        target.elementSelector = 'span.katex, span.math';
        target.getLatexString = (element) => {
            const annotation = element.querySelector('annotation[encoding="application/x-tex"]');
            const isDisplay = isDisplayModeFormula(element);
            return annotation ? formatLatex(annotation.textContent, isDisplay) : null;
        };
        target.isDisplayMode = isDisplayModeFormula;
        return target;
    }

    // 重构：直接处理DOM fragment，避免Trusted Types问题
    function processFormulaContentFromFragment(fragment) {
        if (!fragment) return '';

        console.log('处理选中的DOM fragment开始');

        // 克隆fragment以避免修改原始选择
        const workingFragment = fragment.cloneNode(true);

        // 创建临时容器来处理fragment
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(workingFragment);

        return processFormulaFromElement(tempDiv);
    }

    // 新函数：直接从DOM元素处理公式，完全避免HTML字符串操作
    function processFormulaFromElement(element) {
        console.log('开始处理元素中的公式');

        // 找出所有KaTeX公式，包括Google AI Studio的ms-katex和豆包的container-rkuXQi
        const allFormulas = element.querySelectorAll('.katex, .math-inline, .math-display, .katex-display, ms-katex, .container-rkuXQi');
        console.log(`找到 ${allFormulas.length} 个公式元素`);

        // 打印找到的公式元素信息
        allFormulas.forEach((formula, index) => {
            console.log(`公式 ${index + 1}:`, {
                tagName: formula.tagName,
                className: formula.className,
                hasAnnotation: !!formula.querySelector('annotation[encoding="application/x-tex"]')
            });
        });

        // 处理每个公式
        allFormulas.forEach((formula, index) => {
            try {
                console.log(`处理公式 ${index + 1}`);
                
                let latexContent = null;
                let isDisplayMode = false;
                
                // 豆包：优先使用data-custom-copy-text属性
                const customCopyText = formula.getAttribute('data-custom-copy-text');
                if (customCopyText) {
                    latexContent = customCopyText;
                    isDisplayMode = formula.classList.contains('math-display') || 
                                   !formula.classList.contains('math-inline');
                } else {
                    // 其他网站：查找annotation元素
                    const annotation = formula.querySelector('annotation[encoding="application/x-tex"]');
                    if (annotation && annotation.textContent) {
                        latexContent = annotation.textContent;
                        // 判断是否是公式块
                        isDisplayMode = formula.classList.contains('math-display') ||
                                      formula.classList.contains('katex-display') ||
                                      formula.closest('.math-display') !== null ||
                                      formula.closest('.katex-display') !== null ||
                                      formula.closest('.ds-markdown-math') !== null ||
                                      (formula.tagName === 'MS-KATEX' && !formula.classList.contains('inline')) ||
                                      (formula.closest('ms-katex') && !formula.closest('ms-katex').classList.contains('inline'));
                    }
                }

                // 如果找到了LaTeX内容
                if (latexContent) {
                    // 创建替换内容
                    let replacementText;
                    if (isDisplayMode) {
                        replacementText = '\n$$\n' + latexContent.trim() + '\n$$\n';
                    } else {
                        replacementText = '$' + latexContent.trim() + '$';
                    }

                    // 替换公式元素
                    const textNode = document.createTextNode(replacementText);

                    // 找到最合适的父节点进行替换
                    let targetNode = formula;
                    if (formula.closest('.katex-display')) {
                        targetNode = formula.closest('.katex-display');
                    } else if (formula.closest('.math-display')) {
                        targetNode = formula.closest('.math-display');
                    } else if (formula.closest('.ds-markdown-math')) {
                        targetNode = formula.closest('.ds-markdown-math');
                    } else if (formula.closest('.container-rkuXQi')) {
                        targetNode = formula.closest('.container-rkuXQi');
                    } else if (formula.tagName === 'MS-KATEX') {
                        targetNode = formula;
                    } else if (formula.closest('ms-katex')) {
                        targetNode = formula.closest('ms-katex');
                    }

                    if (targetNode.parentNode) {
                        targetNode.parentNode.replaceChild(textNode, targetNode);
                    }
                }
            } catch (e) {
                console.error('处理公式时出错:', e);
            }
        });

        // 返回处理后的文本内容
        let result;
        try {
            result = element.textContent || element.innerText || '';
        } catch (e) {
            console.error('获取文本内容失败:', e);
            // 如果连textContent都无法访问，尝试手动提取
            result = extractTextFromElement(element);
        }
        console.log('处理后的文本:', result);
        return result;
    }

    // 辅助函数：安全地从元素中提取文本
    function extractTextFromElement(element) {
        let text = '';
        try {
            // 递归遍历所有子节点
            for (let node of element.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    text += node.textContent || '';
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    text += extractTextFromElement(node);
                }
            }
        } catch (e) {
            console.error('手动文本提取也失败:', e);
            return '';
        }
        return text;
    }

    // 为公式元素添加事件处理
    function setupFormulaHandlers() {
        const target = getTarget(window.location.href);
        if (!target) return;

        const formulaElements = document.querySelectorAll(target.elementSelector);
        if (formulaElements.length === 0) return;

        console.log(`找到 ${formulaElements.length} 个公式元素，添加事件处理器`);

        formulaElements.forEach(element => {
            // 防止重复添加
            if (element.hasAttribute('data-formula-handled')) return;

            // 为了处理嵌套元素，检查父元素是否已经处理过
            let parent = element.parentElement;
            while (parent) {
                if (parent.hasAttribute('data-formula-handled')) return;
                parent = parent.parentElement;
            }

            // 标记为已处理
            element.setAttribute('data-formula-handled', 'true');

            // 检查元素是否包含有效的LaTeX内容
            let hasValidLatex = false;
            
            if (window.location.href.includes('gemini.google.com')) {
                // Gemini：检查hook数据
                const katexHtml = element.classList.contains('katex-html') ? element : element.querySelector('.katex-html');
                hasValidLatex = katexHtml && allKatexGemini[katexHtml.outerHTML];
            } else if (window.location.href.includes('doubao.com')) {
                // 豆包：检查data-custom-copy-text属性
                hasValidLatex = !!element.getAttribute('data-custom-copy-text') || 
                               !!element.querySelector('annotation[encoding="application/x-tex"]');
            } else {
                // 其他网站：检查annotation元素
                const annotation = element.querySelector('annotation[encoding="application/x-tex"]');
                hasValidLatex = !!annotation;
            }
            
            if (!hasValidLatex) return;

            // 鼠标进入事件
            element.addEventListener('mouseenter', function() {
                clearTimeout(tooltipTimeout);

                // 设置活动元素
                if (activeFormulaElement) {
                    activeFormulaElement.classList.remove('formula-hover');
                }

                activeFormulaElement = element;
                element.classList.add('formula-hover');

                // 准备显示LaTeX提示
                tooltipTimeout = setTimeout(function() {
                    const latexString = target.getLatexString(element);
                    if (latexString) {
                        tooltip.textContent = latexString;

                        // 计算位置
                        const rect = element.getBoundingClientRect();
                        tooltip.style.display = 'block';
                        tooltip.style.opacity = '0';

                        // 确保提示框不会超出视窗
                        let leftPos = rect.left;
                        if (leftPos + 350 > window.innerWidth) {
                            leftPos = window.innerWidth - 350;
                        }
                        if (leftPos < 10) leftPos = 10;

                        // 在元素上方或下方显示
                        if (rect.top > 100) {
                            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                        } else {
                            tooltip.style.top = `${rect.bottom + 5}px`;
                        }

                        tooltip.style.left = `${leftPos}px`;
                        tooltip.style.opacity = '0.9';
                    }
                }, 300);
            });

            // 鼠标离开事件
            element.addEventListener('mouseleave', function() {
                clearTimeout(tooltipTimeout);
                element.classList.remove('formula-hover');

                tooltipTimeout = setTimeout(function() {
                    if (activeFormulaElement === element) {
                        hideTooltip();
                    }
                }, 100);
            });

            // 点击事件 - 复制公式
            element.addEventListener('click', function(e) {
                const latexString = target.getLatexString(element);
                if (latexString) {
                    navigator.clipboard.writeText(latexString).then(() => {
                        showCopySuccessTooltip();
                        console.log(`已复制公式: ${latexString}`);
                    }).catch(err => {
                        console.error('复制公式失败:', err);
                        showToast('复制公式失败: ' + err.message, 'error');
                    });

                    // 阻止事件冒泡
                    e.stopPropagation();
                    e.preventDefault();
                }
            });
        });
    }

    // 监听复制事件（用户使用Ctrl+C或右键复制）
    document.addEventListener('copy', async function(e) {
        console.log('复制事件触发');

        // 检查是否有选中的内容
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            console.log('没有选中内容，跳过处理');
            return;
        }

        console.log('选中文本:', selection.toString());

        // 获取选中的DOM内容（直接处理DOM，避免Trusted Types错误）
        const range = selection.getRangeAt(0);
        const fragment = range.cloneContents();

        // 直接检查DOM fragment中是否有公式元素
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(fragment.cloneNode(true));

        // 直接在DOM中检测公式元素
        const formulaElements = tempDiv.querySelectorAll('.katex, .math-inline, .math-display, .katex-display, ms-katex, .katex-html, .container-rkuXQi');
        const hasFormula = formulaElements.length > 0;

        console.log('找到公式元素数量:', formulaElements.length);
        console.log('是否包含公式:', hasFormula);

        if (hasFormula) {
            console.log('检测到选中内容包含公式，开始处理...');

            try {
                e.preventDefault(); // 阻止默认复制行为
                e.stopPropagation(); // 阻止事件冒泡

                let processedText;
                
                // Gemini网站特殊处理
                if (window.location.href.includes('gemini.google.com')) {
                    console.log('使用Gemini专用复制逻辑');
                    
                    // 扩展选择范围到完整的katex元素
                    const startKatex = closestKatex(range.startContainer);
                    if (startKatex) {
                        range.setStartBefore(startKatex);
                    }
                    
                    const endKatex = closestKatex(range.endContainer);
                    if (endKatex) {
                        range.setEndAfter(endKatex);
                    }
                    
                    // 重新获取扩展后的fragment
                    const expandedFragment = range.cloneContents();
                    
                    // 使用Gemini专用的替换函数
                    katexReplaceWithTexGemini(expandedFragment);
                    processedText = expandedFragment.textContent;
                    
                    // 阻止Gemini的默认处理
                    e.stopImmediatePropagation();
                } else {
                    // 其他网站使用原有逻辑
                    processedText = processFormulaContentFromFragment(fragment);
                }
                
                console.log('处理后的文本:', processedText);

                // 设置到剪贴板
                const success = await setClipboardToPlainText(processedText);

                if (success) {
                    showToast('已格式化选中的公式内容', 'success');
                    console.log('复制成功');
                } else {
                    // 备用复制方法
                    try {
                        await navigator.clipboard.writeText(processedText);
                        showToast('已格式化选中的公式内容（备用方法）', 'success');
                        console.log('备用复制方法成功');
                    } catch (fallbackError) {
                        console.error('备用复制方法也失败:', fallbackError);
                        showToast('复制失败，请手动复制。处理后的内容已打印到控制台', 'error');
                        console.log('请手动复制以下内容:', processedText);
                    }
                }
            } catch (error) {
                console.error('处理复制事件时出错:', error);
                showToast('处理复制事件时出错: ' + error.message, 'error');
            }
        }
    }, { capture: true, passive: false });

    // 处理按钮点击事件
    function handleButtonClick() {
        console.log('复制按钮被点击');

        setTimeout(async function() {
            try {
                const text = await navigator.clipboard.readText();

                // 统一规范化三种常见定界：$$...$$, \[...\], \(...\)
                let modifiedText = text;
                let matchCount = 0;

                // $$...$$ → 换行块级
                modifiedText = modifiedText.replace(/\$\$(.*?)\$\$/gs, (m, f) => {
                    matchCount++;
                    return `\n$$\n${f.trim()}\n$$\n`;
                });

                // \[...\] → 换行块级（避免与 $$ 已替换的重复，这里直接处理剩余）
                modifiedText = modifiedText.replace(/\\\[(.*?)\\\]/gs, (m, f) => {
                    matchCount++;
                    return `\n$$\n${f.trim()}\n$$\n`;
                });

                // \(...\) → 行内
                modifiedText = modifiedText.replace(/\\\((.*?)\\\)/gs, (m, f) => {
                    matchCount++;
                    return `$${f.trim()}$`;
                });

                if (matchCount > 0) {
                    const success = await setClipboardToPlainText(modifiedText);
                    if (success) {
                        showToast(`已格式化 ${matchCount} 个公式`, 'success');
                    } else {
                        showToast('写入纯文本格式到剪贴板失败', 'error');
                    }
                }
            } catch (err) {
                console.error('处理剪贴板失败:', err);
                showToast('处理剪贴板失败', 'error');
            }
        }, 100);
    }

    // 查找并监听复制按钮
    function setupButtonListener() {
        // 查找所有可能的复制按钮
        const copyButtons = document.querySelectorAll('button[data-testid="action-bar-copy"], button:has(svg[data-testid="action-bar-copy"])');

        // DeepSeek特定按钮
        if (window.location.href.includes('deepseek.com')) {
            const deepseekButtons = document.querySelectorAll('button.copy-btn, button:has(svg[data-icon="copy"])');
            if (deepseekButtons.length > 0) {
                deepseekButtons.forEach(button => {
                    button.removeEventListener('click', handleButtonClick);
                    button.addEventListener('click', handleButtonClick);
                });
            }
        }

        // 豆包特定按钮
        if (window.location.href.includes('doubao.com')) {
            const doubaoButtons = document.querySelectorAll('button[data-testid="message_action_copy"]');
            if (doubaoButtons.length > 0) {
                doubaoButtons.forEach(button => {
                    button.removeEventListener('click', handleButtonClick);
                    button.addEventListener('click', handleButtonClick);
                });
                console.log(`找到 ${doubaoButtons.length} 个豆包复制按钮，添加监听器`);
            }
        }

        if (copyButtons.length > 0) {
            console.log(`找到 ${copyButtons.length} 个复制按钮，添加监听器`);

            copyButtons.forEach(button => {
                button.removeEventListener('click', handleButtonClick);
                button.addEventListener('click', handleButtonClick);
            });
        }
    }

    // 页面加载和DOM变化时初始化功能
    function initialize() {
        setupButtonListener();
        setupFormulaHandlers();
    }

    // Gemini专用延迟初始化逻辑
    function initializeForGemini() {
        let retryCount = 0;
        const maxRetries = 3;
        const baseDelay = 1000; // 1秒基础延迟

        function attemptInitialization() {
            console.log(`Gemini初始化尝试 ${retryCount + 1}/${maxRetries}`);

            // 首先设置KaTeX Hook
            setupGeminiKatexHook();

            // 检查是否有对话容器存在
            const conversationContainer = document.querySelector('.response-container, message-content, .model-response-text');

            if (conversationContainer || retryCount >= maxRetries) {
                initialize();

                // 为Gemini对话容器添加特殊监听
                if (conversationContainer) {
                    const geminiObserver = new MutationObserver(function() {
                        // 确保hook依然有效
                        if (!isGeminiKatexHooked) {
                            setupGeminiKatexHook();
                        }
                        setTimeout(initialize, 500); // 短延迟后重新初始化
                    });
                    geminiObserver.observe(conversationContainer, { childList: true, subtree: true });
                }
                return;
            }

            retryCount++;
            const delay = baseDelay * retryCount; // 递增延迟
            setTimeout(attemptInitialization, delay);
        }

        attemptInitialization();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (window.location.href.includes('gemini.google.com')) {
                initializeForGemini();
            } else {
                initialize();
            }
        });
    } else {
        if (window.location.href.includes('gemini.google.com')) {
            initializeForGemini();
        } else {
            initialize();
        }
    }

    // 使用MutationObserver监视DOM变化
    const observer = new MutationObserver(function(mutations) {
        let needsSetup = false;

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                needsSetup = true;
            }
            // 针对Gemini添加属性变化监听
            if (mutation.type === 'attributes' &&
                (mutation.attributeName === 'class' || mutation.attributeName === 'data-formula-handled')) {
                needsSetup = true;
            }
        });

        if (needsSetup) {
            initialize();
        }
    });

    // 开始观察文档体的变化，针对Gemini增强监听
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-formula-handled']
    };
    observer.observe(document.body, observerConfig);

    // 添加安全定时器，定期重新扫描页面上的公式
    setInterval(initialize, 5000);

    // 添加调试辅助函数
    window.debugFormulaScript = function() {
        console.log('=== 公式复制脚本调试信息 ===');
        console.log('脚本版本: 0.9 (豆包网站新增支持)');
        console.log('当前网站:', window.location.href);
        console.log('支持的网站:', ['Claude', 'DeepSeek', '知乎', 'Google AI Studio', 'Google Gemini', '豆包', '等等']);

        const target = getTarget(window.location.href);
        console.log('当前网站配置:', target);

        const formulas = document.querySelectorAll(target.elementSelector);
        console.log(`页面上找到 ${formulas.length} 个公式元素`);

        formulas.forEach((formula, index) => {
            const latex = target.getLatexString(formula);
            console.log(`公式 ${index + 1}:`, latex);
        });

        // Gemini特殊调试信息
        if (window.location.href.includes('gemini.google.com')) {
            console.log('=== Gemini特殊调试信息 ===');
            console.log('KaTeX Hook状态:', isGeminiKatexHooked);
            console.log('已记录的KaTeX映射数量:', Object.keys(allKatexGemini).length);
            const containers = document.querySelectorAll('.response-container, message-content, .model-response-text');
            console.log(`找到 ${containers.length} 个对话容器`);
            const mathBlocks = document.querySelectorAll('div.math-block');
            console.log(`找到 ${mathBlocks.length} 个数学块容器`);
            const katexHtmlElements = document.querySelectorAll('.katex-html');
            console.log(`找到 ${katexHtmlElements.length} 个katex-html元素`);
            
            // 显示已记录的KaTeX映射
            console.log('KaTeX映射详情:');
            Object.entries(allKatexGemini).forEach(([html, latex], index) => {
                console.log(`  ${index + 1}. ${latex}`);
            });
        }

        // 豆包特殊调试信息
        if (window.location.href.includes('doubao.com')) {
            console.log('=== 豆包特殊调试信息 ===');
            const doubaoContainers = document.querySelectorAll('.container-rkuXQi');
            console.log(`找到 ${doubaoContainers.length} 个豆包公式容器`);
            const copyButtons = document.querySelectorAll('button[data-testid="message_action_copy"]');
            console.log(`找到 ${copyButtons.length} 个豆包复制按钮`);
            
            // 显示豆包公式的data-custom-copy-text属性
            console.log('豆包公式data-custom-copy-text属性:');
            doubaoContainers.forEach((container, index) => {
                const customText = container.getAttribute('data-custom-copy-text');
                if (customText) {
                    console.log(`  ${index + 1}. ${customText}`);
                }
            });
        }

        console.log('如果复制不工作，请检查浏览器控制台的错误信息');
        console.log('=== 调试信息结束 ===');
    };

    // 在页面上显示初始化成功提示
    showToast('公式复制格式调整脚本已加载', 'info', 2000);

    // 如果是Google AI Studio，显示特殊提示
    if (window.location.href.includes('aistudio.google.com')) {
        setTimeout(() => {
            showToast('Google AI Studio适配已启用，控制台输入debugFormulaScript()查看调试信息', 'info', 4000);
        }, 2500);
    }

    // 如果是Google Gemini，显示特殊提示
    if (window.location.href.includes('gemini.google.com')) {
        setTimeout(() => {
            showToast('Google Gemini适配已启用，支持动态加载内容，控制台输入debugFormulaScript()查看调试信息', 'info', 4000);
        }, 2500);
    }

    // 如果是豆包，显示特殊提示
    if (window.location.href.includes('doubao.com')) {
        setTimeout(() => {
            showToast('豆包适配已启用，支持data-custom-copy-text属性，控制台输入debugFormulaScript()查看调试信息', 'info', 4000);
        }, 2500);
    }
})();