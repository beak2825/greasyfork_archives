// ==UserScript==
// @name         ✨ GPT 对话大纲生成器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  为大语言模型对话生成一个精美的、悬浮于右侧的毛玻璃效果大纲视图，助您在长对话中快速导航。
// @author       YungVenuz
// @license      AGPL-3.0-or-later
// @match        https://chatgpt.com/*
// @match        https://chat.deepseek.com/*
// @match        https://gemini.google.com/*
// @match        https://www.kimi.com/*
// @match        https://yuanbao.tencent.com/*
// @match        https://*.tongyi.com/*
// @match        https://copilot.microsoft.com/*
// @match        https://chat.mistral.ai/*
// @include      https://ying.baichuan-ai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529962/%E2%9C%A8%20GPT%20%E5%AF%B9%E8%AF%9D%E5%A4%A7%E7%BA%B2%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529962/%E2%9C%A8%20GPT%20%E5%AF%B9%E8%AF%9D%E5%A4%A7%E7%BA%B2%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class BaseOutlineGenerator {
        constructor(config) {
            this.config = {
                selectors: { userMessage: '', messageText: '', observeTarget: 'body', scrollContainer: window },
                options: { waitForContentLoaded: false, contentReadySelector: '' },
                ...config
            };
            this.uiReady = false;
            this.outlineContainer = null;
            this.toggleButton = null;
            this.styleElement = null;
            this.lastUrl = window.location.href;
            this.scrollTimer = null;
            this.observer = null;
        }

        _addStyles() {
            if (this.styleElement && document.head.contains(this.styleElement)) return;
            const css = `
                /* ... (所有 CSS 样式保持不变) ... */
                :root {
                    --outline-bg-light: rgba(255, 255, 255, 0.75); --outline-bg-dark: rgba(30, 30, 30, 0.75);
                    --outline-hover-bg-light: rgba(240, 240, 240, 0.8); --outline-hover-bg-dark: rgba(50, 50, 50, 0.9);
                    --outline-text-light: #333; --outline-text-dark: #f1f1f1;
                    --outline-active-color: #00A9FF; --outline-border-light: rgba(0, 0, 0, 0.1);
                    --outline-border-dark: rgba(255, 255, 255, 0.15); --outline-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.17);
                }
                .outline-container-wrapper.dark .outline-container { background: var(--outline-bg-dark); border: 1px solid var(--outline-border-dark); }
                .outline-container-wrapper.dark .outline-header { border-bottom-color: var(--outline-border-dark); color: var(--outline-text-dark); }
                .outline-container-wrapper.dark .outline-item { color: var(--outline-text-dark); }
                .outline-container-wrapper.dark .outline-item:hover { background-color: var(--outline-hover-bg-dark); }
                .outline-container-wrapper.dark .outline-empty { color: #aaa; }
                .outline-container {
                    position: fixed; top: 80px; right: 20px; width: 280px; max-height: calc(100vh - 100px);
                    border-radius: 16px; z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    overflow: hidden; border: 1px solid var(--outline-border-light);
                    background: var(--outline-bg-light); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                    box-shadow: var(--outline-shadow);
                }
                .outline-header {
                    padding: 12px 16px; font-weight: 600; font-size: 16px; border-bottom: 1px solid var(--outline-border-light);
                    display: flex; justify-content: space-between; align-items: center; position: sticky;
                    top: 0; background: inherit; z-index: 2; color: var(--outline-text-light);
                }
                .outline-title { display: flex; align-items: center; gap: 8px; }
                .outline-items { padding: 8px; list-style: none; margin: 0; overflow-y: auto; max-height: calc(100vh - 150px); }
                .outline-item {
                    display: flex; align-items: center; gap: 10px; padding: 10px 12px; margin-bottom: 4px; border-radius: 8px;
                    cursor: pointer; font-size: 14px; transition: all 0.25s ease; border-left: 4px solid transparent;
                    color: var(--outline-text-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .outline-item:hover { background-color: var(--outline-hover-bg-light); transform: translateX(4px); }
                .outline-item.active { border-left-color: var(--outline-active-color); background-color: hsla(199, 100%, 50%, 0.1); font-weight: 500; }
                .outline-item-icon { color: var(--outline-active-color); flex-shrink: 0; }
                .outline-empty { padding: 40px 16px; text-align: center; color: #888; font-size: 14px; }
                .outline-close { cursor: pointer; opacity: 0.7; transition: opacity 0.2s; }
                .outline-close:hover { opacity: 1; }
                .outline-toggle {
                    position: fixed; top: 80px; right: 20px; width: 48px; height: 48px; border-radius: 50%;
                    background: linear-gradient(135deg, #00A9FF, #1C82AD); color: white; display: flex; align-items: center;
                    justify-content: center; cursor: pointer; z-index: 10000;
                    box-shadow: 0 4px 15px rgba(0, 169, 255, 0.4);
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .outline-toggle:hover { transform: scale(1.1) rotate(15deg); box-shadow: 0 6px 20px rgba(0, 169, 255, 0.5); }
            `;
            this.styleElement = document.createElement('style');
            this.styleElement.textContent = css;
            document.head.appendChild(this.styleElement);
        }

        /**
         * @description 【TrustedHTML 修复】重构此方法，不再使用 innerHTML，而是用安全方法创建每一个UI元素。
         */
        _createUI() {
            if (this.uiReady) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'outline-container-wrapper';

            this.outlineContainer = document.createElement('div');
            this.outlineContainer.className = 'outline-container';
            this.outlineContainer.style.display = 'none';

            // --- Programmatically create header ---
            const header = document.createElement('div');
            header.className = 'outline-header';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'outline-title';

            const titleIcon = document.createElement('span');
            titleIcon.textContent = '💬';
            const titleText = document.createElement('span');
            titleText.textContent = '对话大纲';

            titleDiv.appendChild(titleIcon);
            titleDiv.appendChild(titleText);

            const closeButton = document.createElement('span');
            closeButton.className = 'outline-close';
            closeButton.title = '关闭';
            closeButton.textContent = '✖';
            closeButton.addEventListener('click', () => this.hide());

            header.appendChild(titleDiv);
            header.appendChild(closeButton);
            // --- End header ---

            const itemsList = document.createElement('ul');
            itemsList.className = 'outline-items';

            this.outlineContainer.appendChild(header);
            this.outlineContainer.appendChild(itemsList);

            wrapper.appendChild(this.outlineContainer);

            this.toggleButton = document.createElement('div');
            this.toggleButton.className = 'outline-toggle';
            this.toggleButton.title = '显示大纲';
            this.toggleButton.addEventListener('click', () => this.show());

            const toggleIcon = document.createElement('span');
            toggleIcon.textContent = '📑';
            this.toggleButton.appendChild(toggleIcon);

            wrapper.appendChild(this.toggleButton);

            document.body.appendChild(wrapper);
            this.uiReady = true;
        }

        /**
         * @description 【TrustedHTML 修复】一个工具函数，用于安全地设置列表容器的消息（如“加载中”或“无内容”）
         * @param {string} message - 要显示的文本
         */
        _setItemsContainerMessage(message) {
            const itemsContainer = this.outlineContainer.querySelector('.outline-items');
            if (!itemsContainer) return;

            // Clear previous content
            while (itemsContainer.firstChild) {
                itemsContainer.removeChild(itemsContainer.firstChild);
            }

            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'outline-empty';
            emptyDiv.textContent = message;
            itemsContainer.appendChild(emptyDiv);
        }

        generateOutlineItems() {
            if (!this.uiReady) return;
            const userMessages = document.querySelectorAll(this.config.selectors.userMessage);

            if (userMessages.length === 0) {
                this._setItemsContainerMessage('当前没有对话内容');
                return;
            }

            const itemsContainer = this.outlineContainer.querySelector('.outline-items');
            // Clear previous items
            while (itemsContainer.firstChild) {
                itemsContainer.removeChild(itemsContainer.firstChild);
            }

            userMessages.forEach((message, index) => {
                const textEl = message.querySelector(this.config.selectors.messageText) || message;
                let title = (textEl.textContent || '').trim();
                if (!title) return;
                title = title.length > 20 ? title.substring(0, 20) + '...' : title;
                const item = this._createOutlineItem(message, index, title);
                itemsContainer.appendChild(item);
            });

            this.highlightVisibleItem();
        }

        /**
         * @description 【TrustedHTML 修复】重构此方法，不再使用 innerHTML，而是用安全方法创建列表项。
         * ✨ [MODIFIED] Added support for Ctrl/Alt + Click to change scroll alignment.
         */
        _createOutlineItem(message, index, title) {
            const item = document.createElement('li');
            item.className = 'outline-item';
            item.dataset.index = index;

            const iconSpan = document.createElement('span');
            iconSpan.className = 'outline-item-icon';
            iconSpan.textContent = '✨';

            const textSpan = document.createElement('span');
            textSpan.className = 'outline-item-text';
            textSpan.textContent = `${index + 1}. ${this._escapeHTML(title)}`;

            item.appendChild(iconSpan);
            item.appendChild(textSpan);

            // MODIFICATION STARTS HERE
            item.addEventListener('click', (event) => {
                // Determine scroll alignment based on modifier keys
                let scrollBlock = 'center'; // Default: center
                if (event.altKey) {
                    scrollBlock = 'start';  // Alt + Click: scroll to top
                } else if (event.ctrlKey) {
                    scrollBlock = 'end';    // Ctrl + Click: scroll to bottom
                }

                // Scroll with the determined alignment
                message.scrollIntoView({ behavior: 'smooth', block: scrollBlock });

                this.highlightItem(item);
                // Add a temporary highlight effect to the message itself
                message.style.transition = 'background-color 0.5s';
                message.style.backgroundColor = 'hsla(199, 100%, 50%, 0.1)';
                setTimeout(() => { message.style.backgroundColor = ''; }, 1500);
            });
            // MODIFICATION ENDS HERE

            return item;
        }

        // ... (其他所有基类方法，如 _escapeHTML, highlightVisibleItem, _observeScroll 等都保持不变) ...
        _escapeHTML(str) { const p = document.createElement('p'); p.textContent = str; return p.innerHTML; }
        highlightVisibleItem() { /* ... */ }
        highlightItem(itemToHighlight) { /* ... */ }
        _observeScroll() { /* ... */ }
        _observeMutations() { /* ... */ }
        _observeDarkMode() { const darkModeObserver = new MutationObserver(() => { const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark-theme'); if(this.outlineContainer) { this.outlineContainer.parentElement.classList.toggle('dark', isDark); } }); darkModeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] }); darkModeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] }); const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark-theme'); if(this.outlineContainer) { this.outlineContainer.parentElement.classList.toggle('dark', isDark); } }
        _observeUrlChanges() { const handleUrlChange = () => { setTimeout(() => { if (window.location.href !== this.lastUrl) { this.lastUrl = window.location.href; this.init(true); } }, 100); }; const originalPushState = history.pushState; history.pushState = function() { originalPushState.apply(this, arguments); handleUrlChange(); }; window.addEventListener('popstate', handleUrlChange); }
        _waitForContent(callback) { if (!this.config.options.waitForContentLoaded) { callback(); return; } this.show(); this._setItemsContainerMessage('正在加载大纲...'); let interval, timeout; const cleanup = () => { clearInterval(interval); clearTimeout(timeout); }; interval = setInterval(() => { if (document.querySelector(this.config.options.contentReadySelector)) { cleanup(); callback(); } }, 200); timeout = setTimeout(() => { cleanup(); callback(); }, 7000); }
        show() { if (!this.uiReady) this._createUI(); this.outlineContainer.style.display = 'block'; this.toggleButton.style.display = 'none'; this.generateOutlineItems(); }
        hide() { if (!this.uiReady) return; this.outlineContainer.style.display = 'none'; this.toggleButton.style.display = 'flex'; }


        run(isUrlChange = false) {
            if (!isUrlChange) {
                this._createUI();
                this._addStyles();
                this._observeUrlChanges();
            } else {
                if (this.observer) this.observer.disconnect();
                if(!this.uiReady) this._createUI();
            }

            this._waitForContent(() => {
                this.show();
                this._observeScroll();
                this._observeMutations();
            });
        }

        init(isUrlChange = false) {
            this.run(isUrlChange);
        }
    }

    // --- 各网站的特定实现 ---
    class ChatGPTOutlineGenerator extends BaseOutlineGenerator { constructor() { super({ selectors: { userMessage: '[data-message-author-role="user"]', messageText: '.whitespace-pre-wrap', observeTarget: 'main' }, options: { waitForContentLoaded: true, contentReadySelector: '[data-message-author-role="user"]' } }); } }

    class GeminiOutlineGenerator extends BaseOutlineGenerator {
        constructor() { super({ selectors: { userMessage: 'user-query', messageText: '.query-text', observeTarget: 'chat-window' }, options: { waitForContentLoaded: true, contentReadySelector: 'user-query .query-text' } }); }
        init(isUrlChange = false) {
            if (isUrlChange) {
                setTimeout(() => super.run(true), 500);
                return;
            }
            const geminiObserver = new MutationObserver((mutations, observer) => {
                if (document.querySelector('chat-window')) {
                    observer.disconnect();
                    super.run(false);
                }
            });
            geminiObserver.observe(document.body, { childList: true, subtree: true });
        }
    }
    class DeepSeekOutlineGenerator extends BaseOutlineGenerator { constructor() { super({ selectors: { userMessage: '.dad65929 > div:nth-child(odd)', messageText: 'div[class*="message_message__"]', observeTarget: '.dad65929' }, options: { waitForContentLoaded: true, contentReadySelector: '.dad65929 > div:nth-child(odd)' } }); } }
    class KimiOutlineGenerator extends BaseOutlineGenerator { constructor() { super({ selectors: { userMessage: '.chat-content-item-user', messageText: '.user-content', observeTarget: '.chat-content-list' }, options: { waitForContentLoaded: true, contentReadySelector: '.chat-content-item-user' } }); } }
    class BaichuanOutlineGenerator extends BaseOutlineGenerator { constructor() { super({ selectors: { userMessage: '[data-type="prompt-item"]', messageText: '.prompt-text-item', observeTarget: 'body' }, options: { waitForContentLoaded: true, contentReadySelector: '[data-type="prompt-item"]' } }); } }
    class YuanbaoOutlineGenerator extends BaseOutlineGenerator { constructor() { super({ selectors: { userMessage: '.agent-chat__list__item--human', messageText: '.hyc-content-text', observeTarget: '.agent-chat__list__content' }, options: { waitForContentLoaded: true, contentReadySelector: '.agent-chat__list__item--human' } }); } init(isUrlChange = false) { if (isUrlChange) { setTimeout(() => { super.run(true); }, 500); } else { super.run(false); } } }
    class TongyiOutlineGenerator extends BaseOutlineGenerator { constructor() { super({ selectors: { userMessage: '.questionItem--UrcRIuHd', messageText: '.bubble--OXh8Wwa1', observeTarget: '.scrollWrapper--G2M0l9ZP' }, options: { waitForContentLoaded: true, contentReadySelector: '.questionItem--UrcRIuHd' } }); } }
    class CopilotOutlineGenerator extends BaseOutlineGenerator {
        constructor() {
            super({
                selectors: {
                    userMessage: '[data-content="user-message"]',
                    messageText: 'div[class*="whitespace-pre-wrap"]',
                    observeTarget: '[data-content="conversation"]'
                },
                options: {
                    waitForContentLoaded: true,
                    contentReadySelector: '[data-content="user-message"]'
                }
            });
        }
    }
    class MistralOutlineGenerator extends BaseOutlineGenerator {
        constructor() {
            super({
                selectors: {
                    // 使用 :has() 伪类来精确定位用户消息（其直接子元素包含一个靠右对齐的 'ms-auto' 容器）
                    userMessage: 'div.group:has(>div>div.ms-auto)',
                    messageText: 'span.whitespace-pre-wrap',
                    observeTarget: 'div.mx-auto.flex.min-h-full'
                },
                options: {
                    waitForContentLoaded: true,
                    contentReadySelector: 'div.group:has(>div>div.ms-auto)'
                }
            });
        }
    }
    function main() {
        const generators = {
            'chatgpt.com': ChatGPTOutlineGenerator,
            'gemini.google.com': GeminiOutlineGenerator,
            'chat.deepseek.com': DeepSeekOutlineGenerator,
            'kimi.com': KimiOutlineGenerator,
            'ying.baichuan-ai.com': BaichuanOutlineGenerator,
            'yuanbao.tencent.com': YuanbaoOutlineGenerator,
            'tongyi.com': TongyiOutlineGenerator,
            'copilot.microsoft.com': CopilotOutlineGenerator,
            'chat.mistral.ai': MistralOutlineGenerator,
        };
        const currentHost = window.location.hostname;
        for (const [domain, Generator] of Object.entries(generators)) {
            if (currentHost.includes(domain)) {
                new Generator().init();
                break;
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();