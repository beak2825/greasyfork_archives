// ==UserScript==
// @name          Axiom推文翻译
// @namespace     http://tampermonkey.net/
// @version       4.7
// @author        @Gufii_666
// @description   对axiom的推文监控，代币内推文，扫链出现的推文进行翻译
// @match         https://axiom.trade/pulse*
// @match         https://axiom.trade/trackers*
// @match         https://axiom.trade/meme/*
// @match         https://axiom.trade/discover*
// @license       MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/541898/Axiom%E6%8E%A8%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/541898/Axiom%E6%8E%A8%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TRANSLATION_BASE_URL = 'https://translate.googleapis.com/translate_a/single';
    const CLIENT_PARAM = 'gtx';
    const SOURCE_LANG = 'auto';
    const TARGET_LANG = 'zh-CN';
    const DATA_TYPE = 't';

    const TRANSLATED_TEXT_CLASS = 'localized-content-display';
    const ORIGINAL_DATA_ATTR = 'data-translation-processed-status';
    const ORIGINAL_TEXT_STORE_ATTR = 'data-original-text';
    const UNIQUE_TRANSLATION_ID_ATTR = 'data-translation-id';

    const ONGOING_TRANSLATIONS = new Map();

    // 定义所有可翻译的元素选择器
    const TRANSLATABLE_SELECTORS = [
        "p.tweet-body_root__ChzUj", // 主要推文内容
        "p.text-textSecondary.mt-1.whitespace-pre-wrap", // 可能的用户简介或其他通用文本
        "div.mt-2.border.border-secondaryStroke.rounded-\\[4px\\].relative.group.overflow-hidden p.text-textSecondary.mt-1", // 嵌套在特定结构中的文本
        "p.break-words", // 通用段落文本，包括用户简介
        // 新增：针对 "This is America" 这类在 <span> 中的推文内容
        // 匹配包含特定 Tailwind 类名的 div 内部的 span 标签
        "div.flex.flex-col.justify-start.items-start.gap-\\[6px\\].w-full span"
    ].join(', ');


    async function obtainLocalizedText(inputString) {
        if (!inputString || typeof inputString !== 'string') {
            return '[Translation Input Error]';
        }

        const queryParams = new URLSearchParams({
            client: CLIENT_PARAM,
            sl: SOURCE_LANG,
            tl: TARGET_LANG,
            dt: DATA_TYPE,
            q: inputString
        });
        const fullUrl = `${TRANSLATION_BASE_URL}?${queryParams.toString()}`;

        try {
            const response = await fetch(fullUrl);
            const data = await response.json();
            if (data && data[0] && Array.isArray(data[0])) {
                return data[0].map(segment => segment[0]).join('');
            }
            throw new Error("Invalid translation response structure.");
        } catch (error) {
            console.error("Content localization failed:", error);
            return '[翻译失败]';
        }
    }

    // Function to apply layout fixes to a specific element
    function applyLayoutFixes(element) {
        if (!element) return;

        const currentDisplay = getComputedStyle(element).display;
        if (currentDisplay.includes('inline') && !currentDisplay.includes('flex') && !currentDisplay.includes('grid')) {
            element.style.display = 'block';
        }

        Object.assign(element.style, {
            maxHeight: "none",
            height: "auto",
            overflow: "visible",
            overflowY: "visible",
            overflowX: "visible",
            minHeight: "unset",
            flexShrink: "0",
            alignSelf: "stretch"
        });

        const gradient = element.querySelector("div[class*='bg-gradient-to-b']");
        if (gradient) {
            gradient.style.display = "none";
        }
    }

    function updateTranslationBox(targetElement, statusOrContent, prepend = false) {
        if (!targetElement || !targetElement.parentElement) return;

        if (!targetElement.dataset.translationId) {
            targetElement.dataset.translationId = Math.random().toString(36).substring(2, 15);
        }
        const translationId = targetElement.dataset.translationId;

        let translationParagraph = targetElement.parentElement.querySelector(`p.${TRANSLATED_TEXT_CLASS}[${UNIQUE_TRANSLATION_ID_ATTR}="${translationId}"]`);

        if (!translationParagraph) {
            translationParagraph = document.createElement("p");
            translationParagraph.classList.add(TRANSLATED_TEXT_CLASS);
            translationParagraph.setAttribute(UNIQUE_TRANSLATION_ID_ATTR, translationId);
            if (prepend) {
                targetElement.parentElement.insertBefore(translationParagraph, targetElement);
            } else {
                targetElement.parentElement.appendChild(translationParagraph);
            }
        }

        translationParagraph.textContent = statusOrContent;

        Object.assign(translationParagraph.style, {
            color: "#FFFFFF",
            fontSize: "14px",
            padding: "8px 12px",
            borderRadius: "6px",
            margin: "8px 0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
            lineHeight: "1.5",
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
            backgroundColor: "",
            border: "",
            fontWeight: "",
            cursor: "",
            opacity: ""
        });


        if (statusOrContent === '[翻译中...]') {
            Object.assign(translationParagraph.style, {
                backgroundColor: "#4A90E2",
                border: "1px solid #337AB7",
                fontWeight: "normal",
                cursor: "wait",
                opacity: "0.8"
            });
            translationParagraph.title = "翻译中，请稍候...";
            translationParagraph.onclick = null;
        } else if (statusOrContent === '[翻译失败]') {
            Object.assign(translationParagraph.style, {
                backgroundColor: "#DC3545",
                border: "1px solid #DC3545",
                fontWeight: "normal",
                cursor: "pointer",
                opacity: "1"
            });
            translationParagraph.title = "点击重试翻译";
            translationParagraph.onclick = (event) => {
                event.stopPropagation();
                event.preventDefault();

                targetElement.removeAttribute(ORIGINAL_DATA_ATTR);
                targetElement.removeAttribute(ORIGINAL_TEXT_STORE_ATTR);
                targetElement.removeAttribute(UNIQUE_TRANSLATION_ID_ATTR);
                ONGOING_TRANSLATIONS.delete(targetElement);
                translationParagraph.remove();
                processElementForTranslation(targetElement);
            };
        } else { // Successful translation
            Object.assign(translationParagraph.style, {
                backgroundColor: "#2E8B57",
                border: "1px solid #4CAF50",
                fontWeight: "bold",
                cursor: "default",
                opacity: "1"
            });
            translationParagraph.title = "";
            translationParagraph.onclick = null;
        }

        // --- Layout Adjustment Logic ---
        // Apply fixes to the immediate parent of the targetElement
        applyLayoutFixes(targetElement.parentElement);

        // Also apply to relevant ancestors (up to 5 levels)
        let currentParent = targetElement.parentElement;
        let depth = 0;
        while (currentParent && depth < 5) {
            if (currentParent.matches("div.hover\\:bg-primaryStroke\\/20") ||
                currentParent.matches("article.tweet-container_article__0ERPK") ||
                currentParent.matches("div.mt-2.border.border-secondaryStroke.rounded-\\[4px\\].relative.group.overflow-hidden") ||
                currentParent.matches("div.flex-1.min-w-0")
            ) {
                applyLayoutFixes(currentParent);
            }
            currentParent = currentParent.parentElement;
            depth++;
        }
    }

    /**
     * Centralized function to determine element type and initiate translation.
     * This makes sure all entry points (initial scan, observer, retry)
     * funnel through one place for consistent logic.
     */
    async function processElementForTranslation(el) {
        if (!el || ONGOING_TRANSLATIONS.has(el)) {
            return;
        }

        // 默认推文内容（p.tweet-body_root__ChzUj 和 span 标签）的翻译会前置
        let prepend = true;
        // 用户简介等可能是追加的
        if (el.matches("p.break-words") || el.matches("p.text-textSecondary.mt-1.whitespace-pre-wrap")) {
            prepend = false;
        }

        initiateTextTranslation(el, prepend);
    }

    /**
     * Unified function to initiate translation for a text element.
     * This function now handles content change detection more robustly.
     */
    async function initiateTextTranslation(textElement, prepend) {
        const rawContent = textElement.innerText.trim();
        if (!rawContent) {
            textElement.setAttribute(ORIGINAL_DATA_ATTR, 'true');
            return;
        }

        const storedOriginalText = textElement.getAttribute(ORIGINAL_TEXT_STORE_ATTR);
        const isProcessed = textElement.getAttribute(ORIGINAL_DATA_ATTR) === 'true';
        const hasTranslationBox = textElement.parentElement ? textElement.parentElement.querySelector(`p.${TRANSLATED_TEXT_CLASS}[${UNIQUE_TRANSLATION_ID_ATTR}="${textElement.dataset.translationId}"]`) : null;

        // --- IMPORTANT LOGIC FOR CONTENT CHANGE DETECTION AND RE-PROCESSING ---
        let forceRetranslate = false;

        if (isProcessed) {
            // Case 1: Content has genuinely changed for an already processed element.
            if (rawContent !== storedOriginalText) {
                console.log('Content changed for element, forcing re-processing:', rawContent, 'vs', storedOriginalText);
                forceRetranslate = true;
            }
            // Case 2: Previous translation failed, allow retry (click handler will trigger this path).
            else if (hasTranslationBox && hasTranslationBox.textContent.includes('[翻译失败]')) {
                console.log('Previous translation failed, forcing re-processing for retry:', rawContent);
                forceRetranslate = true;
            }
            // Case 3: Already processed successfully and content is same. Do not re-process.
            else {
                return;
            }
        }

        if (forceRetranslate || !isProcessed) {
            if (hasTranslationBox) {
                hasTranslationBox.remove();
            }
            textElement.removeAttribute(ORIGINAL_DATA_ATTR);
            textElement.removeAttribute(ORIGINAL_TEXT_STORE_ATTR);
            textElement.removeAttribute(UNIQUE_TRANSLATION_ID_ATTR);
            ONGOING_TRANSLATIONS.delete(textElement);
        }
        // --- END NEW LOGIC ---

        textElement.setAttribute(ORIGINAL_TEXT_STORE_ATTR, rawContent);

        updateTranslationBox(textElement, '[翻译中...]', prepend);

        const translationPromise = obtainLocalizedText(rawContent).then(localizedContent => {
            updateTranslationBox(textElement, localizedContent, prepend);
            textElement.setAttribute(ORIGINAL_DATA_ATTR, 'true');
        }).catch(() => {
            updateTranslationBox(textElement, '[翻译失败]', prepend);
            textElement.setAttribute(ORIGINAL_DATA_ATTR, 'true');
        }).finally(() => {
            ONGOING_TRANSLATIONS.delete(textElement);
        });

        ONGOING_TRANSLATIONS.set(textElement, translationPromise);
    }


    function performFullPageScan() {
        // 清除所有之前的翻译框
        document.querySelectorAll(`.${TRANSLATED_TEXT_CLASS}`).forEach(el => el.remove());

        // 使用新的通用选择器进行扫描
        document.querySelectorAll(TRANSLATABLE_SELECTORS).forEach(processElementForTranslation);
    }


    let lastPathname = window.location.pathname;
    let scanTimeoutId = null;

    const contentWatcher = new MutationObserver((mutations) => {
        // 主要触发器：URL 路径改变（SPA 导航）
        if (window.location.pathname !== lastPathname) {
            lastPathname = window.location.pathname;
            clearTimeout(scanTimeoutId); // 清除任何之前 URL 的待定扫描
            scanTimeoutId = setTimeout(performFullPageScan, 500); // 防抖全页面扫描
            return; // 页面正在改变时，不处理单个 DOM 突变
        }

        // 处理单个突变，针对相同页面上添加的内容或属性更改
        for (const mutationRecord of mutations) {
            // 检查添加的节点（新元素出现）
            if (mutationRecord.type === 'childList' && mutationRecord.addedNodes.length > 0) {
                for (const addedNode of mutationRecord.addedNodes) {
                    // 只查询元素节点（跳过文本节点等）
                    if (addedNode.nodeType !== 1 || !addedNode.querySelector) continue;

                    // 在新添加的节点内或如果 addedNode 本身就是可翻译元素，进行查询
                    // 注意：如果 addedNode 本身就是可翻译元素，querySelectorAll 不会匹配到它自己，需要单独检查
                    if (addedNode.matches(TRANSLATABLE_SELECTORS)) {
                        processElementForTranslation(addedNode);
                    }
                    addedNode.querySelectorAll(TRANSLATABLE_SELECTORS).forEach(processElementForTranslation);
                }
            }
            // 处理 characterData 更改（文本内容直接更新）
            else if (mutationRecord.type === 'characterData') {
                const parentElement = mutationRecord.target.parentElement;
                if (parentElement && parentElement.matches(TRANSLATABLE_SELECTORS)) {
                    processElementForTranslation(parentElement);
                }
            }
        }
    });

    // 配置 MutationObserver 观察子节点、子树和文本内容变化
    contentWatcher.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false,
    });

    // 脚本首次运行时进行初始全页面扫描
    performFullPageScan();

    // 确保在页面卸载时清除计时器
    window.addEventListener('beforeunload', () => {
        if (scanTimeoutId) clearTimeout(scanTimeoutId);
    });

})();