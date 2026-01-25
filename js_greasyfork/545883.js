// ==UserScript==
// @name         AI Conversation Navigator
// @namespace    https://greasyfork.org
// @version      9.1
// @description  Floating navigator for your prompts in conversations. Applied for ChatGPT, Gemini, Aistudio, NotebookLM, Grok, Claude, Mistral, Perplexity, Meta, Poe, Deepai, Huggingface, Deepseek, Kimi, Qwen, Manus, Z.ai, Longcat, Chatglm, Chatboxai, Lmarena, Quillbot, Canva, Genspark, Character, Spacefrontiers, Scienceos, Evidencehunt, Playground (allen), Paperfigureqa (allen), Scira, Scispace, Exa.ai, Consensus, Openevidence, Pathway, Math-gpt.
// @author       Bui Quoc Dung
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @match        https://notebooklm.google.com/*
// @match        https://grok.com/*
// @match        https://claude.ai/*
// @match        https://www.kimi.com/*
// @match        https://chat.mistral.ai/*
// @match        https://www.perplexity.ai/*
// @match        https://www.meta.ai/*
// @match        https://poe.com/*
// @match        https://deepai.org/*
// @match        https://huggingface.co/chat/*
// @match        https://chat.deepseek.com/*
// @match        https://chat.qwen.ai/*
// @match        https://manus.im/*
// @match        https://chat.z.ai/*
// @match        https://longcat.chat/*
// @match        https://chatglm.cn/*
// @match        https://web.chatboxai.app/*
// @match        https://lmarena.ai/*
// @match        https://quillbot.com/*
// @match        https://www.canva.com/*
// @match        https://www.genspark.ai/*
// @match        https://character.ai/*
// @match        https://spacefrontiers.org/*
// @match        https://app.scienceos.ai/*
// @match        https://evidencehunt.com/*
// @match        https://playground.allenai.org/*
// @match        https://paperfigureqa.allen.ai/*
// @match        https://scira.ai/*
// @match        https://exa.ai/*
// @match        https://consensus.app/*
// @match        https://www.openevidence.com/*
// @match        https://www.pathway.md/*
// @match        https://math-gpt.org/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545883/AI%20Conversation%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/545883/AI%20Conversation%20Navigator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const NAV_WIDTH = 250;
    const NAV_COLLAPSED_WIDTH = 80;
    const DEBOUNCE_TIME = 500;
    const AISTUDIO_DEBOUNCE_TIME = 200;
    let activeMessageIndex = -1;
    let lastUrl = window.location.href;
    let lastPromptsContent = "";
    let cachedPrompts = [];
    let urlCheckInterval = null;
    let injectedStyleId = 'nav-shift-styles';
    let loadingTimeout = null;

    function getAIStudioData() {
        const prompts = [];
        const scrollButtons = document.querySelectorAll('ms-prompt-scrollbar button[id^="scrollbar-item-"]');
        scrollButtons.forEach(btn => {
            const isUser = btn.querySelector('.prompt-scrollbar-dot');
            if (isUser) {
                let text = btn.getAttribute('aria-label');
                if (!text && (btn.querySelector('img') || btn.querySelector('mat-icon'))) {
                    text = "image:";
                }
                if (text) {
                    prompts.push({
                        element: btn,
                        text: text.trim()
                    });
                }
            }
        });
        return prompts;
    }

    const SITE_CONFIGS = {
        chatgpt: {
            domain: 'chatgpt.com',
            includePath: ['chatgpt.com/c/', 'chatgpt.com/g/'],
            userMessage: 'div[data-message-author-role="user"]',
            shiftTarget: '[data-scroll-root="true"]',
            shiftHeader: '.flex.items-center.justify-end.gap-2.overflow-x-hidden',
            collapsedTop: '0'
        },
        gemini: {
            domain: 'gemini.google.com',
            includePath: ['gemini.google.com/app/','gemini.google.com/gem/', 'gemini.google.com/u/1/app/', 'gemini.google.com/u/2/app/'],
            userMessage: '.query-text',
            shiftTarget: 'chat-app, .boqOnegoogleliteOgbOneGoogleBar, top-bar-actions',
            shiftHeader: '.boqOnegoogleliteOgbOneGoogleBar, top-bar-actions',
            collapsedTop: '13px'
        },
        aistudio: {
            domain: 'aistudio.google.com',
            includePath: 'aistudio.google.com/prompts/',
            customFinder: getAIStudioData,
            useClick: true,
            shiftTarget: '.layout-wrapper',
            fastUpdate: true,
            debounceTime: AISTUDIO_DEBOUNCE_TIME,
            shiftHeader: '.toolbar-container',
            collapsedTop: '14px'
        },
        notebooklm: {
            domain: 'notebooklm.google.com',
            includePath: 'notebooklm.google.com/notebook/',
            userMessage: 'chat-message .from-user-container',
            shiftTarget: 'notebook, .boqOnegoogleliteOgbOneGoogleBar',
            shiftHeader: '.notebook-header-container, .boqOnegoogleliteOgbOneGoogleBar',
            collapsedTop: '11px'
        },
        grok: {
            domain: 'grok.com',
            includePath: 'grok.com/c/',
            userMessage: '.relative.group.flex.flex-col.justify-center.items-end',
            shiftTarget: 'main',
            shiftHeader: '.ms-auto.end-3',
            collapsedTop: '7px'
        },
        claude: {
            domain: 'claude.ai',
            includePath: 'claude.ai/chat/',
            userMessage: 'div.group.relative.inline-flex',
            shiftTarget: '.flex.flex-1.h-full.w-full.overflow-hidden.relative',
            shiftHeader: '[data-testid="wiggle-controls-actions"]',
            collapsedTop: '0'
        },
        mistral: {
            domain: 'chat.mistral.ai',
            includePath: 'chat.mistral.ai/chat/',
            userMessage: 'div[data-message-author-role="user"] div[dir="auto"]',
            shiftTarget: 'main.bg-sidebar-subtle',
            shiftHeader: '.items-center.p-3',
            collapsedTop: '7px'
        },
        perplexity: {
            domain: 'perplexity.ai',
            includePath: 'www.perplexity.ai/search/',
            userMessage: 'div.group\\/title',
            shiftTarget: '#root',
            shiftHeader: '.pr-md',
            collapsedTop: '5px'
        },
        meta: {
            domain: 'meta.ai',
            includePath: 'www.meta.ai/prompt/',
            userMessage: '.x78zum5.x15zctf7',
            shiftTarget: '.xph554m.x73z65k',
            shiftHeader: '.x78zum5.xfex06f',
            collapsedTop: '10px'
        },
        poe: {
            domain: 'poe.com',
            includePath: 'poe.com/chat/',
            userMessage: '[class*="ChatMessagesView_tupleGroupContainer"] > div > div:first-child',
            shiftTarget: '[class*="CanvasSidebarLayout_chat-column"]'
        },
        deepai: {
            domain: 'deepai.org',
            includePath: 'deepai.org/chat',
            userMessage: '.chatbox',
            shiftTarget: '.chat-layout-container, .new-chat-button-container, .persistent-compose-area, .nav-items'
        },
        huggingface: {
            domain: 'huggingface.co',
            includePath: 'huggingface.co/chat/conversation/',
            userMessage: '.disabled.w-full.appearance-none',
            shiftTarget: '.relative.min-h-0.min-w-0'
        },
        deepseek: {
            domain: 'chat.deepseek.com',
            includePath: 'chat.deepseek.com/a/chat/',
            userMessage: '._9663006 .fbb737a4',
            shiftTarget: '._8f60047, ._189b4a0',
            shiftHeader: '._2be88ba',
            collapsedTop: '10px'
        },
        kimi: {
            domain: 'www.kimi.com',
            includePath: 'www.kimi.com/chat/',
            userMessage: '.user-content',
            shiftTarget: '.has-sidebar',
            shiftHeader: '[class="chat-header-actions"]',
            collapsedTop: '10px'
        },
        glm: {
            domain: 'chat.z.ai',
            includePath: 'chat.z.ai/c/',
            userMessage: '.chat-user',
            shiftTarget:'#chat-container',
            shiftHeader: '.flex.px-1',
            collapsedTop: '0'
        },
        qwen: {
            domain: 'chat.qwen.ai',
            includePath: 'chat.qwen.ai/c/',
            userMessage: '.chat-user-message',
            shiftTarget: '.desktop-layout-content',
            shiftHeader: '.header-right',
            collapsedTop: '5px'
        },
        manus: {
            domain: 'manus.im',
            includePath: 'manus.im/app/',
            userMessage: '.flex.relative.flex-col.gap-2.items-end',
            shiftTarget: '.simplebar-content'
        },
        longcat: {
            domain: 'longcat.chat',
            includePath: 'longcat.chat/c/',
            userMessage: '.user-message',
            shiftTarget: '.content',
        },
        chatglm: {
            domain: 'chatglm.cn',
            includePath: 'chatglm.cn/main/alltoolsdetail?t=',
            userMessage: '.question-txt.dots',
            shiftTarget: '.detail-container'
        },
        chatboxai: {
            domain: 'web.chatboxai.app',
            includePath: 'web.chatboxai.app/session/',
            userMessage: '.user-msg',
            shiftTarget: '.h-full.w-full.MuiBox-root'
        },
        lmarena: {
            domain: 'lmarena.ai',
            includePath: 'lmarena.ai/c/',
            userMessage: '.justify-end.gap-2',
            shiftTarget: '#chat-area',
            reverse: true
        },
        quillbot: {
            domain: 'quillbot.com',
            includePath: 'quillbot.com/ai-chat/c/',
            userMessage: 'div.MuiGrid-root.MuiGrid-container > div.MuiGrid-root > p.MuiTypography-root.MuiTypography-bodyMedium.MuiTypography-paragraph',
            shiftTarget: '#root-client'
        },
        canva: {
            domain: 'www.canva.com',
            includePath: 'www.canva.com/ai/',
            userMessage: '#_r_1_ .uV9Uzw .Ka9auQ p',
            shiftTarget: '#root'
        },
        genspark: {
            domain: 'www.genspark.ai',
            includePath: 'www.genspark.ai/agents?',
            userMessage: '.conversation-item-desc.user',
            shiftTarget: '.n-config-provider'
        },
        character: {
            domain: 'character.ai',
            includePath: 'character.ai/chat/',
            userMessage: '.w-full .bg-surface-elevation-3.opacity-90',
            shiftTarget: '#__next, #chat-header-background',
            reverse: true
        },
        spacefrontiers: {
            domain: 'spacefrontiers.org',
            includePath: 'spacefrontiers.org/c/',
            userMessage: '.inline.whitespace-pre-line',
            shiftTarget: '#app'
        },
        scienceos: {
            domain: 'app.scienceos.ai',
            includePath: 'app.scienceos.ai/chat/',
            userMessage: 'div[data-prompt]',
            shiftTarget: 'div[data-strategy]'
        },
        evidencehunt: {
            domain: 'evidencehunt.com',
            includePath: 'evidencehunt.com/chat',
            userMessage: '.chat__message:has(.message__user-image) .message__content p',
            shiftTarget: '.v-main'
        },
        playground: {
            domain: 'playground.allenai.org',
            includePath: 'playground.allenai.org/thread/',
            userMessage: 'div[class*="chat-message"]:nth-of-type(even)',
            shiftTarget: '.MuiPaper-outlined'
        },
        paperfigure: {
            domain: 'paperfigureqa.allen.ai',
            includePath: 'paperfigureqa.allen.ai/app',
            userMessage: '#chat-scroll-container > div > div:nth-of-type(odd) .MuiPaper-root',
            shiftTarget: '#root'
        },
        scira: {
            domain: 'scira.ai',
            includePath: 'scira.ai/search/',
            userMessage: '.max-w-full .relative',
            shiftTarget: '.sm\\:max-w-2xl'
        },
        exa: {
            domain: 'exa.ai',
            includePath: 'exa.ai/search/',
            userMessage: 'div[data-test-id="UserMessage"]',
            shiftTarget: 'div[data-test-id="ChatPresentation"]'
        },
        consensus: {
            domain: 'consensus.app',
            includePath: 'consensus.app/search/',
            userMessage: '.flex.flex-col.pt-6.w-full.max-w-page h2',
            shiftTarget: '#__next'
        },
        openevidence: {
            domain: 'openevidence.com',
            includePath: 'www.openevidence.com/ask/',
            userMessage: '.brandable--query-bar--container form',
            shiftTarget: '#__next, .brandable--query-bar--container.hide-on-print.follow-up'
        },
        pathway: {
            domain: 'pathway.md',
            includePath: 'www.pathway.md/ai',
            userMessage: '[id] > div > div > div .chakra-text',
        },
        mathgpt: {
            domain: 'math-gpt.org',
            includePath: 'math-gpt.org/chat/',
            userMessage: '.w-full.flex.items-end.flex-col.pb-8.relative',
            shiftTarget: '.overflow-x-hidden, .px-2.flex.flex-col.gap-1'
        },
    };

    function getCurrentConfig() {
        const hostname = window.location.hostname;
        for (const key in SITE_CONFIGS) {
            if (hostname.includes(SITE_CONFIGS[key].domain)) {
                return SITE_CONFIGS[key];
            }
        }
        return null;
    }

    const CURRENT_SITE = getCurrentConfig();
    if (!CURRENT_SITE) return;

    function checkURL(url) {
        if (!CURRENT_SITE.includePath) return false;
        if (Array.isArray(CURRENT_SITE.includePath)) {
            return CURRENT_SITE.includePath.some(path => url.includes(path));
        }
        return url.includes(CURRENT_SITE.includePath);
    }

    const BASE_CONTAINER_CSS = `
        right: 0px; width: ${NAV_WIDTH}px; bottom: 0px; overflow-y: auto;
        z-index: 9999;
        transition: width 0.3s, padding 0.3s, opacity 0.3s, transform 0.3s;
        font-family: Calibri, sans-serif; font-size: 17px; color: CanvasText; position: fixed;text-align: left;
        border-left: 1px solid color-mix(in srgb, CanvasText 15%, transparent);
    `;

    const getShiftStyle = (width, selector = '', isHeader = false) => {
        if (!selector) return '';
        const selectors = selector.split(',');
        const prefixedSelector = selectors.map(s => `body.navigator-expanded ${s.trim()}`).join(', ');
        const preventNesting = isHeader && CURRENT_SITE.shiftTarget
            ? `:not(${CURRENT_SITE.shiftTarget} *)`
            : '';

        return `
            ${selector} {
                transition: margin-right 0.3s ease, max-width 0.3s ease, margin-left 0.3s ease;
            }
            ${prefixedSelector}${preventNesting} {
                margin-left: 0 !important;
                margin-right: ${width}px !important;
                max-width: calc(100% - ${width}px) !important;
            }
        `;
    };

    function updateShiftStyles(shouldInject) {
        let existingStyle = document.getElementById(injectedStyleId);
        if (shouldInject && !existingStyle) {
            const currentWidth = CURRENT_SITE.width || NAV_WIDTH;
            let cssContent = '';

            if (CURRENT_SITE.shiftTarget) {
                cssContent += getShiftStyle(currentWidth, CURRENT_SITE.shiftTarget);
            }

            if (CURRENT_SITE.shiftHeader) {
                cssContent += `
                    body.navigator-collapsed ${CURRENT_SITE.shiftHeader} {
                        margin-right: ${NAV_COLLAPSED_WIDTH}px !important;
                    }
                `;
            }

            if (cssContent) {
                const styleElement = document.createElement('style');
                styleElement.id = injectedStyleId;
                styleElement.textContent = cssContent;
                document.head.appendChild(styleElement);
            }
        } else if (!shouldInject && existingStyle) {
            existingStyle.remove();
        }
    }

    GM_addStyle(`
        .nav-list-item { font-weight: normal; transition: font-weight 0.1s ease; }
        .nav-list-item.active { font-weight: bold !important; background-color: rgba(0, 0, 0, 0.05); }
        @keyframes nav-blink-animation { 0% { opacity: 1; } 50% { opacity: 0.1; } 100% { opacity: 1; } }
        .nav-blink-active { animation: nav-blink-animation 0.5s ease-in-out 4; }
    `);

    const allUserSelectors = Object.values(SITE_CONFIGS)
            .map(config => config.userMessage)
            .filter(selector => typeof selector === 'string' && selector.length > 0)
            .join(', ');

    if (allUserSelectors) {
        GM_addStyle(`${allUserSelectors} { scroll-margin-top: 10px !important; }`);
    }

    let conversationObserver = null;
    let isCollapsed = false;
    window.navigatorUpdateTimeout = null;

    function updateBodyClassForLayout() {
        const container = document.getElementById('message-nav');
        const content = document.getElementById('message-nav-content');
        if (!container || container.style.display === 'none') {
            document.body.classList.remove('navigator-expanded', 'navigator-collapsed');
            return;
        }
        if (content && content.style.display !== 'none') {
            document.body.classList.add('navigator-expanded');
            document.body.classList.remove('navigator-collapsed');
        } else {
            document.body.classList.remove('navigator-expanded');
            document.body.classList.add('navigator-collapsed');
        }
    }

    function createContainer() {
        let container = document.getElementById('message-nav');
        if (!container) {
            container = document.createElement('div');
            container.id = 'message-nav';
            container.style.cssText = `top: 0; ${BASE_CONTAINER_CSS}`;
            const header = document.createElement('div');
            Object.assign(header.style, {
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontWeight: 'bold', position: 'sticky', top: '0', zIndex: '10',
                padding: '15px 0', backgroundColor: 'Canvas',
                borderBottom : '1px solid color-mix(in srgb, CanvasText 15%, transparent)'
            });
            const toggleBtn = document.createElement('button');
            Object.assign(toggleBtn.style, { background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'inherit' });
            toggleBtn.textContent = 'Close';
            header.appendChild(toggleBtn);
            const content = document.createElement('div');
            content.id = 'message-nav-content';
            content.style.padding = '5px';
            container.appendChild(header);
            container.appendChild(content);
            document.body.appendChild(container);

            const currentWidth = CURRENT_SITE.width || NAV_WIDTH;
            const toggleHandler = (e) => {
                e.stopPropagation();
                isCollapsed = !isCollapsed;
                container.classList.add('transitioning');

                if (!isCollapsed) {
                    Object.assign(container.style, {
                        width: `${currentWidth}px`, bottom: '0px', height: 'auto', top: '0px', right: '0px',
                        borderLeft: '1px solid color-mix(in srgb, CanvasText 15%, transparent)'
                    });
                    Object.assign(header.style, {
                        backgroundColor: 'Canvas', padding: '15px 0',
                        borderBottom: '1px solid color-mix(in srgb, CanvasText 15%, transparent)',
                    });
                    content.style.display = 'block';
                    toggleBtn.textContent = 'Close';
                } else {
                    Object.assign(container.style, {
                        width: `${NAV_COLLAPSED_WIDTH}px`,
                        borderLeft: 'none', bottom: 'auto', height: 'min-content', right: '10px',
                        top: CURRENT_SITE.collapsedTop || '55px'
                    });
                    Object.assign(header.style, {
                        backgroundColor: 'transparent', borderBottom: 'none', padding: '10px 0'
                    });
                    content.style.display = 'none';
                    toggleBtn.textContent = 'Open';
                }

                updateBodyClassForLayout();
                setTimeout(() => container.classList.remove('transitioning'), 300);
            };
            toggleBtn.addEventListener('click', toggleHandler);
            updateBodyClassForLayout();
        }
        return container;
    }

    function findUserPrompts() {
        if (CURRENT_SITE.customFinder) return CURRENT_SITE.customFinder();
        let prompts = [];
        if (!CURRENT_SITE.userMessage) return prompts;
        const elements = document.querySelectorAll(CURRENT_SITE.userMessage);
        elements.forEach((element) => {
            let text = element.textContent.trim();
            if (!text && (element.querySelector('img') || element.querySelector('canvas') || element.querySelector('svg'))) {
                text = "image";
            }
            if (text) prompts.push({ element, text });
        });
        if (CURRENT_SITE.reverse) prompts.reverse();
        return prompts;
    }

    function findPromptElementByIndex(targetIndex) {
        if (CURRENT_SITE.customFinder) {
            const prompts = CURRENT_SITE.customFinder();
            return prompts[targetIndex] ? prompts[targetIndex].element : null;
        }
        if (!CURRENT_SITE.userMessage) return null;
        const elements = Array.from(document.querySelectorAll(CURRENT_SITE.userMessage));
        if (CURRENT_SITE.reverse) elements.reverse();
        return elements[targetIndex] || null;
    }

    function createListItem(prompt, index) {
        const listItem = document.createElement('li');
        const preview = prompt.text.length > 80 ? prompt.text.slice(0, 80) + '...' : prompt.text;
        listItem.textContent = `${index}. ${preview}`;
        Object.assign(listItem.style, { cursor: 'pointer', padding: '5px 0px 5px 5px' });
        listItem.classList.add('nav-list-item');
        if (index === activeMessageIndex) listItem.classList.add('active');

        listItem.addEventListener('click', () => {
            const parentList = listItem.parentElement;
            if (parentList) parentList.querySelectorAll('.nav-list-item').forEach(li => li.classList.remove('active'));
            listItem.classList.add('active');
            activeMessageIndex = index;

            const targetElement = findPromptElementByIndex(index - 1);
            if (targetElement) {
                const waitForImages = (element) => {
                    const images = element.querySelectorAll('img');
                    const promises = Array.from(images).map(img => {
                        if (img.complete) return Promise.resolve();
                        return new Promise((resolve) => {
                            img.addEventListener('load', resolve);
                            img.addEventListener('error', resolve);
                            setTimeout(resolve, 3000);
                        });
                    });
                    return Promise.all(promises);
                };

                if (CURRENT_SITE.useClick) {
                    targetElement.click();
                } else {
                    targetElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                    waitForImages(targetElement).then(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                }

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            targetElement.classList.add('nav-blink-active');
                            setTimeout(() => targetElement.classList.remove('nav-blink-active'), 2000);
                            observer.unobserve(targetElement);
                        }
                    });
                }, { threshold: 0.5 });

                observer.observe(targetElement);
            }
        });
        return listItem;
    }

    function updateMessageList(forceUpdate = false) {
        const currentUrl = window.location.href;
        let container = document.getElementById('message-nav');

        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            lastPromptsContent = "";
            activeMessageIndex = -1;
            cachedPrompts = [];
            forceUpdate = true;
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
                loadingTimeout = null;
            }
        }

        const shouldShow = checkURL(currentUrl);
        updateShiftStyles(shouldShow);

        if (!shouldShow) {
            if (container) container.style.display = 'none';
            document.body.classList.remove('navigator-expanded', 'navigator-collapsed');
            updateBodyClassForLayout();
            return;
        }

        const activeContainer = createContainer();
        activeContainer.style.display = 'block';
        updateBodyClassForLayout();

        const content = document.getElementById('message-nav-content');
        if (!content) return;

        let list = content.querySelector('ul');
        if (!list) {
            list = document.createElement('ul');
            list.style.cssText = 'padding: 0; margin: 0; list-style: none;';
            content.appendChild(list);
        }

        const prompts = findUserPrompts();
        const currentPromptsContent = prompts.map(p => p.text).join('|');

        if (!forceUpdate && currentPromptsContent === lastPromptsContent) return;

        lastPromptsContent = currentPromptsContent;
        cachedPrompts = prompts;

        while (list.firstChild) list.removeChild(list.firstChild);

        if (prompts.length === 0) {
            activeMessageIndex = -1;
            const noContent = document.createElement('div');
            noContent.id = 'nav-status-display';
            noContent.textContent = 'Loading...';
            noContent.style.cssText = 'color: #999; font-style: italic; text-align: center; padding: 15px 0;';
            list.appendChild(noContent);

            if (!loadingTimeout) {
                loadingTimeout = setTimeout(() => {
                    const statusDiv = document.getElementById('nav-status-display');
                    if (statusDiv && cachedPrompts.length === 0) {
                        statusDiv.textContent = 'No message found';
                    }
                }, 5000);
            }
        } else {
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
                loadingTimeout = null;
            }
            prompts.forEach((prompt, index) => {
                const listItem = createListItem(prompt, index + 1);
                list.appendChild(listItem);
            });
        }
    }

    function startUrlWatcher() {
        if (!CURRENT_SITE.fastUpdate) return;
        if (urlCheckInterval) clearInterval(urlCheckInterval);
        urlCheckInterval = setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) updateMessageList(true);
        }, 300);
    }

    function observeConversation() {
        if (conversationObserver) conversationObserver.disconnect();
        const debounceTime = CURRENT_SITE.debounceTime || DEBOUNCE_TIME;
        conversationObserver = new MutationObserver(() => {
            clearTimeout(window.navigatorUpdateTimeout);
            window.navigatorUpdateTimeout = setTimeout(() => updateMessageList(), debounceTime);
        });
        conversationObserver.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', () => {
            lastPromptsContent = ""; cachedPrompts = []; updateMessageList(true);
        });

        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            lastPromptsContent = ""; cachedPrompts = [];
            setTimeout(() => updateMessageList(true), 100);
        };
    }

    setTimeout(() => { updateMessageList(true); startUrlWatcher(); }, 1000);
    observeConversation();
})();
