// ==UserScript==
// @name         通用划词翻译
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在任意网页上划词翻译，支持中英互译
// @author       You
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @connect      fanyi.youdao.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547430/%E9%80%9A%E7%94%A8%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/547430/%E9%80%9A%E7%94%A8%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tooltip = null;
    let isTranslating = false;

    // 创建翻译提示框
    function createTooltip() {
        if (tooltip) return;

        tooltip = document.createElement('div');
        tooltip.id = 'translate-tooltip';
        tooltip.style.cssText = `
            position: absolute !important;
            background: linear-gradient(135deg, rgba(32, 32, 32, 0.98), rgba(28, 28, 28, 0.98)) !important;
            color: #e0e0e0 !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 10px !important;
            padding: 15px 18px !important;
            font-size: 14px !important;
            z-index: 999999 !important;
            box-shadow: 0 10px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1) !important;
            max-width: 350px !important;
            word-wrap: break-word !important;
            display: none !important;
            backdrop-filter: blur(12px) !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            line-height: 1.5 !important;
            transform-origin: center bottom !important;
        `;

        document.body.appendChild(tooltip);
    }

    // 检测文本语言
    function detectLanguage(text) {
        // 简单的语言检测：包含中文字符就认为是中文
        return /[\u4e00-\u9fa5]/.test(text) ? 'zh' : 'en';
    }

    // 翻译文本
    function translateText(text, callback) {
        if (isTranslating) return;
        isTranslating = true;

        const sourceLang = detectLanguage(text);
        const targetLang = sourceLang === 'zh' ? 'en' : 'zh';

        // 使用谷歌翻译API
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                isTranslating = false;
                try {
                    const result = JSON.parse(response.responseText);
                    const translation = result[0][0][0];
                    callback(null, translation);
                } catch (error) {
                    // 如果谷歌翻译失败，尝试使用有道翻译
                    fallbackTranslate(text, sourceLang, targetLang, callback);
                }
            },
            onerror: function() {
                isTranslating = false;
                // 谷歌翻译失败，尝试有道翻译
                fallbackTranslate(text, sourceLang, targetLang, callback);
            }
        });
    }

    // 备用翻译方案（有道翻译）
    function fallbackTranslate(text, sourceLang, targetLang, callback) {
        const youdaoUrl = `https://fanyi.youdao.com/translate?&doctype=json&type=${sourceLang}2${targetLang}&i=${encodeURIComponent(text)}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: youdaoUrl,
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.translateResult && result.translateResult[0] && result.translateResult[0][0]) {
                        const translation = result.translateResult[0][0].tgt;
                        callback(null, translation);
                    } else {
                        callback('翻译失败，请重试', null);
                    }
                } catch (error) {
                    callback('翻译服务暂时不可用', null);
                }
            },
            onerror: function() {
                callback('网络错误，请检查连接', null);
            }
        });
    }

    // 显示翻译结果
    function showTranslation(rect, originalText, translation, error) {
        if (!tooltip) createTooltip();

        let content = '';
        if (error) {
            content = `
                <div style="color: #ff8a80; font-style: italic; text-align: center;">${error}</div>
            `;
        } else {
            content = `
                <div style="font-weight: 500; margin-bottom: 10px; color: #ffffff; font-size: 13px; opacity: 0.9;">
                    ${originalText}
                </div>
                <div style="color: #81c784; line-height: 1.5; font-size: 14px;">
                    ${translation}
                </div>
            `;
        }

        tooltip.innerHTML = content;

        // 先设置内容，然后计算位置
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden';
        tooltip.style.transform = 'scale(0.8) translateY(10px)';
        tooltip.style.opacity = '0';

        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipHeight = tooltipRect.height;
        const tooltipWidth = tooltipRect.width;

        // 计算最佳位置（选中文字上方居中，保持距离）
        let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        let top = rect.top + window.scrollY - tooltipHeight - 12;

        // 边界检测和调整
        const margin = 15;

        if (left < margin) {
            left = margin;
        } else if (left + tooltipWidth > window.innerWidth - margin) {
            left = window.innerWidth - tooltipWidth - margin;
        }

        if (top < window.scrollY + margin) {
            top = rect.bottom + window.scrollY + 12;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.visibility = 'visible';

        // 优雅的出现动画
        requestAnimationFrame(() => {
            tooltip.style.transition = 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
            tooltip.style.transform = 'scale(1) translateY(0)';
            tooltip.style.opacity = '1';
        });
    }

    // 隐藏翻译提示框
    function hideTooltip() {
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    // 获取选中的文本
    function getSelectedText() {
        const selection = window.getSelection();
        return selection.toString().trim();
    }

    // 处理文本选择
    function handleTextSelection(e) {
        setTimeout(() => {
            const selectedText = getSelectedText();

            if (selectedText && selectedText.length > 1 && selectedText.length < 500) {
                // 过滤掉只包含标点符号或数字的选择
                if (/^[^\w\u4e00-\u9fa5]+$/.test(selectedText)) {
                    hideTooltip();
                    return;
                }

                const x = e.pageX;
                const y = e.pageY;

                // 显示加载状态
                showTranslation(x, y, selectedText, '翻译中...', null);

                // 执行翻译
                translateText(selectedText, (error, translation) => {
                    if (error) {
                        showTranslation(x, y, selectedText, null, error);
                    } else {
                        showTranslation(x, y, selectedText, translation, null);
                    }
                });
            } else {
                hideTooltip();
            }
        }, 100);
    }

    // 初始化事件监听
    function initializeEventListeners() {
        // 监听鼠标释放事件（选择文本后）
        document.addEventListener('mouseup', handleTextSelection);

        // 监听键盘选择事件
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
                e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
                (e.ctrlKey && e.key === 'a')) {
                handleTextSelection(e);
            }
        });

        // 点击其他地方隐藏提示框
        document.addEventListener('click', (e) => {
            if (tooltip && !tooltip.contains(e.target)) {
                hideTooltip();
            }
        });

        // 滚动时隐藏提示框
        document.addEventListener('scroll', hideTooltip);

        // 按ESC键隐藏提示框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideTooltip();
            }
        });
    }

    // 防止在输入框中触发翻译
    function isInputElement(element) {
        const tagName = element.tagName.toLowerCase();
        return tagName === 'input' || tagName === 'textarea' ||
               element.contentEditable === 'true' ||
               element.isContentEditable;
    }

    // 改进的文本选择处理
    function handleTextSelection(e) {
        // 如果是在输入框中，不执行翻译
        if (isInputElement(e.target)) {
            hideTooltip();
            return;
        }

        setTimeout(() => {
            const selectedText = getSelectedText();

            if (selectedText && selectedText.length > 1 && selectedText.length < 500) {
                // 过滤掉只包含标点符号、数字或空格的选择
                if (/^[\s\d\p{P}]+$/u.test(selectedText)) {
                    hideTooltip();
                    return;
                }

                const selection = window.getSelection();
                if (selection.rangeCount === 0) {
                    hideTooltip();
                    return;
                }

                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // 显示加载状态
                if (!tooltip) createTooltip();
                tooltip.innerHTML = `
                    <div style="font-weight: 500; margin-bottom: 8px; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px;">
                        ${selectedText}
                    </div>
                    <div style="color: #a0a0a0; font-style: italic;">
                        翻译中...
                    </div>
                `;

                // 临时显示用于获取尺寸
                tooltip.style.display = 'block';
                tooltip.style.visibility = 'hidden';

                const tooltipRect = tooltip.getBoundingClientRect();
                let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                let top = rect.top + window.scrollY - tooltipRect.height - 15;

                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                if (top < window.scrollY + 10) {
                    top = rect.bottom + window.scrollY + 15;
                }

                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
                tooltip.style.visibility = 'visible';

                // 执行翻译
                translateText(selectedText, (error, translation) => {
                    if (error) {
                        showTranslation(rect, selectedText, null, error);
                    } else {
                        showTranslation(rect, selectedText, translation, null);
                    }
                });
            } else {
                hideTooltip();
            }
        }, 100);
    }

    // 启动脚本
    function init() {
        createTooltip();
        initializeEventListeners();

        // 添加样式到页面头部
        const style = document.createElement('style');
        style.textContent = `
            #translate-tooltip {
                user-select: none !important;
                pointer-events: auto !important;
            }

            #translate-tooltip:hover {
                transform: scale(1.02) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();