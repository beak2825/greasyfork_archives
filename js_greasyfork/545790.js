// ==UserScript==
// @name         大模型response转飞书markdown格式助手
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  LLM response格式化助手
// @author       彭彩平
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545790/%E5%A4%A7%E6%A8%A1%E5%9E%8Bresponse%E8%BD%AC%E9%A3%9E%E4%B9%A6markdown%E6%A0%BC%E5%BC%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/545790/%E5%A4%A7%E6%A8%A1%E5%9E%8Bresponse%E8%BD%AC%E9%A3%9E%E4%B9%A6markdown%E6%A0%BC%E5%BC%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== 配置常量 ==========
    const CONFIG = {
        SELECTORS: {
            answerItems: "div.containerWrap--r2_gRwLP > div.content--FOu1seVU > div > div > div.tongyi-markdown",
            answerItemsTools: "div.containerWrap--r2_gRwLP > div.tools--JSWHLNPm > div.rightArea--rL5UNOps",
            copyButton: "div:nth-child(2)"
        },
        MARKERS: {
            DOUBLE: '\uFFFF_DOLLAR_DOLLAR\uFFFF',
            SINGLE: '\uFFFF_DOLLAR\uFFFF',
            STARSIGNAL: '\uFFFF_STAR\uFFFF'
        },
        OBSERVER_CONFIG: {
            childList: true,
            subtree: true,
            attributes: false
        },
        delay: 0
    };

    const SITES = {
      'www.qianwen.com': {
        name: '通义千问',
        match: 'https://www.qianwen.com/*',
        selectors: {
          answerItems: 'div.content-wXxT0D > div > div > div.tongyi-markdown',
          answerItemsTools: 'div.mt-5.flex.gap-4 > div > div.leftArea-_O1Dzs',
          copyButton:  'div:nth-child(2)'
        },
        delay: 100
      },
    
      'chatgpt.com': {
        name: 'ChatGPT',
        match: 'https://chatgpt.com/c/*',
        selectors: {
          answerItems: 'article[data-turn="assistant"] > div > div > div.flex.max-w-full.flex-col.grow > div > div > div',
          answerItemsTools: 'article[data-turn="assistant"] > div > div > div.flex.min-h-\\[46px\\].justify-start > div',
          copyButton: 'div:nth-child(1)'
        },
        delay: 100
      },
    
      'www.kimi.com': {
        name: 'Kimi',
        match: 'https://www.kimi.com/chat/*',
        selectors: {
          answerItems: 'div.segment-container > div > div.segment-content-box > div > div.markdown',
          answerItemsTools: 'div.segment-container > div > div.segment-assistant-actions > div.segment-assistant-actions-content',
          copyButton: 'div:nth-child(1)'
        },
        delay: 1000
      },
      'www.doubao.com': {
        name: 'Kimi',
        match: 'https://www.doubao.com/chat/*',
        selectors: {
          answerItems: 'div[data-testid="receive_message"] > div > div.flex.flex-row.w-full > div > div',
          answerItemsTools: 'div[data-testid="receive_message"] > div > div.answer-action-bar-pgm2JD.answer-action-bar.flex.flex-col.justify-end > div > div > div',
          copyButton: 'div:nth-child(2)'
        },
        delay: 100
      },
     'chatglm.cn': {
        name: 'zhipu',
        match: 'https://chatglm.cn/main',
        selectors: {
           answerItems: 'div.answer-content-wrap > div > div > div.markdown-body.md-body.tl',
           answerItemsTools: 'div.interactContainer > div > div.interact-operate.flex.flex-x-between > div.flex.regenerate-part-container > div:nth-child(1)',
           copyButton: 'div:nth-child(3)'
                },
       delay: 100
      }
    };
    
    // ========== 样式管理模块 ==========
    const StyleManager = {
        CSS_ID: 'custom-button-style',
        
        inject() {
            // 避免重复注入
            if (document.getElementById(this.CSS_ID)) {
                return;
            }

            const css = `
                /* 基础按钮样式 */
                .replaceButton,
                .recoverButton {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 12px;
                    margin: 0 4px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    user-select: none;
                    white-space: nowrap;
                }

                /* 替换按钮 - 蓝色主题 */
                .replaceButton {
                    background-color: #3b82f6;
                    color: #ffffff;
                }
                .replaceButton:hover {
                    background-color: #2563eb;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
                }
                .replaceButton:active {
                    background-color: #1d4ed8;
                    transform: translateY(0);
                    box-shadow: 0 1px 2px rgba(59, 130, 246, 0.2);
                }

                /* 恢复按钮 - 灰色主题 */
                .recoverButton {
                    background-color: #e5e7eb;
                    color: #4b5563;
                }
                .recoverButton:hover {
                    background-color: #d1d5db;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(229, 231, 235, 0.3);
                }
                .recoverButton:active {
                    background-color: #9ca3af;
                    transform: translateY(0);
                    box-shadow: 0 1px 2px rgba(229, 231, 235, 0.2);
                }

                /* 编辑状态样式 */
                .editing-mode {
                    background-color: #f8f9fa !important;
                    border: 1px dashed #6c757d !important;
                    padding: 8px !important;
                    border-radius: 4px !important;
                }
            `;

            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = this.CSS_ID;
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }
    };

    // ========== 内容处理模块 ==========
    const ContentProcessor = {
        adjustContent(OCRedText) {
            if (!OCRedText || typeof OCRedText !== 'string') {
                return '';
            }

            const { DOUBLE, SINGLE, STARSIGNAL } = CONFIG.MARKERS;
            let result = OCRedText;
            

            // 第一步：给行间公式添加标记
            result = result.replace(/(?<!\$)\s*\$\$\s*([^$]*?)\s*\$\$\s*(?!\$)/g, (match, content) => {
                return DOUBLE + content.trim() + DOUBLE;
            });
            // 第二步：给行内公式添加标记
            result = result.replace(/(?<!\$)\s*\$\s*([^$]*?)\s*\$\s*(?!\$)/g, (match, content) => {
                return SINGLE + content.trim() + SINGLE;
            });
            console.log(result);
            // 第三步：给双星号添加记号
            result = result.replace(/(?<!\*)\*\*\s*([^*]*?)\s*\*\*(?!\*)/g, (match, content) => {
                return STARSIGNAL + content.trim() + STARSIGNAL;
            });
            console.log(result);
            // 第四步：处理行间公式 - 前后添加空格
            result = result.split(DOUBLE).map((part, index) => {
                if (index % 2 === 1) {
                    return `\n$$ ${part} $$\n`;
                }
                return part;
            }).join('');

            // 第五步：处理行内公式 - 前后添加空格
            result = result.split(SINGLE).map((part, index) => {
                if (index % 2 === 1) {
                    return ` $ ${part} $ `;
                }
                return part;
            }).join('');
            // 第六步：处理星号（加粗）
            result = result.split(STARSIGNAL).map((part, index) => {
                if (index % 2 === 1) {
                    return ` **${part}** `;
                }
                return part;
            }).join('');

            // 第七步：清理多余的换行符
            result = result.replace(/\r\n|\r|\n/g, '\n').replace(/\n{2,}/g, '\n');// 多个换行 → 一个

            return result;
        },

        async parseClipboardContent(clipBoardText) {
            const regFormat = /(\{\s*"识别结果"\s*:\s*"[\S\s]*"\s*\})/;
            
            if (regFormat.test(clipBoardText)) {
                try {
                    const match = clipBoardText.match(regFormat)[0];
                    const parsed = JSON.parse(match);
                    return parsed.识别结果 || clipBoardText;
                } catch (error) {
                    console.warn('解析JSON失败，使用原始内容:', error);
                    return clipBoardText;
                }
            }
            return clipBoardText;
        }
    };

    // ========== 按钮管理模块 ==========
    const ButtonManager = {
        // 存储原始内容的WeakMap
        originalContentMap: new WeakMap(),
        origincontent: 0,

        createReplaceButton() {
            const button = document.createElement('div');
            button.textContent = '替换';
            button.className = 'replaceButton';
            button.title = '点击替换为OCR识别结果';
            return button;
        },

        createRecoverButton() {
            const button = document.createElement('div');
            button.textContent = '恢复';
            button.className = 'recoverButton';
            button.title = '点击恢复原始内容';
            return button;
        },

        async handleReplace(copyButton, answerItem) {
            try {
                // 保存原始内容
                if (!this.originalContentMap.has(answerItem)) {
                    this.origincontent = answerItem.innerHTML;
                    this.originalContentMap.set(answerItem, {
                        content: answerItem.innerHTML,
                        textContent: answerItem.textContent,
                        isEditable: answerItem.contentEditable,
                        originalStyle: {
                            fontSize: answerItem.style.fontSize,
                            border: answerItem.style.border,
                            outline: answerItem.style.outline,
                            whitespace: answerItem.style.whiteSpace
                        }
                    });
                }

                // 触发复制按钮
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                copyButton.dispatchEvent(clickEvent);

                // 等待一小段时间确保复制完成
                await new Promise(resolve => setTimeout(resolve, CONFIG.delay));

                // 获取剪贴板内容
                const clipBoardText = await navigator.clipboard.readText();
                const parsedText = await ContentProcessor.parseClipboardContent(clipBoardText);
                const processedText = ContentProcessor.adjustContent(parsedText);

                // 设置编辑状态
                answerItem.contentEditable = true;
                answerItem.textContent = processedText;
                answerItem.style.fontSize = '14px';
                answerItem.style.border = 'none';
                answerItem.style.outline = 'none';
                answerItem.classList.add('editing-mode');
                answerItem.style.whiteSpace = 'pre-wrap';
                answerItem.focus();

                // 写回剪贴板
                await navigator.clipboard.writeText(processedText);
                
                console.log('内容替换成功');
            } catch (error) {
                console.error('替换操作失败:', error);
                alert('替换失败，请检查剪贴板权限或重试');
            }
        },

        handleRecover(answerItem) {
            const originalData = this.originalContentMap.get(answerItem);
            if (!originalData) {
                console.warn('未找到原始内容，无法恢复');
                return;
            }

            try {
                // 恢复内容和样式
                answerItem.innerHTML = originalData.content;
                answerItem.contentEditable = originalData.isEditable;
                answerItem.style.fontSize = originalData.originalStyle.fontSize;
                answerItem.style.border = originalData.originalStyle.border;
                answerItem.style.outline = originalData.originalStyle.outline;
                answerItem.classList.remove('editing-mode');
                answerItem.style.whiteSpace = originalData.originalStyle.whitespace;
                console.log('内容恢复成功');
            } catch (error) {
                console.error('恢复操作失败:', error);
            }
        },

        addButtonsToElement(toolArea, answerItem) {
            // 避免重复添加
            if (toolArea.querySelector('.replaceButton, .recoverButton')) {
                return;
            }

            const replaceButton = this.createReplaceButton();
            const recoverButton = this.createRecoverButton();

            // 绑定事件
            replaceButton.addEventListener('click', () => {
                const copyButton = toolArea.querySelector(CONFIG.SELECTORS.copyButton);
                if (copyButton) {
                    this.handleReplace(copyButton, answerItem);
                } else {
                    console.error('未找到复制按钮');
                }
            });

            recoverButton.addEventListener('click', () => {
                this.handleRecover(answerItem);
            });

            // 添加到DOM
            toolArea.appendChild(replaceButton);
            toolArea.appendChild(recoverButton);
        }
    };

    // ========== DOM管理模块 ==========
    const DOMManager = {
        observer: null,

        queryElements() {
            return {
                answerItems: document.querySelectorAll(CONFIG.SELECTORS.answerItems),
                answerItemsTools: document.querySelectorAll(CONFIG.SELECTORS.answerItemsTools)
            };
        },

        addButtonsToAllElements() {
            const { answerItems, answerItemsTools } = this.queryElements();
            const minLen = Math.min(answerItems.length, answerItemsTools.length);

            console.log(`找到 ${answerItems.length} 个回答区域，${answerItemsTools.length} 个工具区域`);

            for (let i = 0; i < minLen; i++) {
                ButtonManager.addButtonsToElement(answerItemsTools[i], answerItems[i]);
            }
        },

        startObserving() {
            if (this.observer) {
                this.observer.disconnect();
            }

            this.observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && 
                        (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                        shouldUpdate = true;
                    }
                });

                if (shouldUpdate) {
                    // 使用防抖，避免频繁更新
                    clearTimeout(this.updateTimer);
                    this.updateTimer = setTimeout(() => {
                        this.addButtonsToAllElements();
                    }, 500);
                }
            });

            this.observer.observe(document.body, CONFIG.OBSERVER_CONFIG);
            console.log('DOM监听器已启动');
        },

        stopObserving() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    };

    // ========== 应用程序主模块 ==========
    const App = {
        init() {
            console.log('脚本开始初始化...');
            
            // 注入样式
            StyleManager.inject();
            
            // 初始添加按钮
            DOMManager.addButtonsToAllElements();
            
            // 开始监听DOM变化
            DOMManager.startObserving();
            console.log('脚本初始化完成');
        },

        destroy() {
            DOMManager.stopObserving();
            const styleElement = document.getElementById(StyleManager.CSS_ID);
            if (styleElement) {
                styleElement.remove();
            }
            console.log('脚本已清理');
        }
    };

    // ========== 启动应用 ==========
    function main() {
        // 匹配不同站点
        const siteCfg = SITES[location.hostname];
        console.log(location.hostname)
        if (!siteCfg) {
          console.info('OCR脚本：当前站点未配置，跳过');
          return;
        }
        CONFIG.SELECTORS = siteCfg.selectors; // 覆盖原 SELECTORS
        CONFIG.delay = siteCfg.delay;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => App.init());
        } else {
            App.init();
        }

        window.addEventListener('beforeunload', () => App.destroy());
    }

    main();
})();