// ==UserScript==
// @name         LMArena Purifier
// @namespace    http://tampermonkey.net/
// @version      004
// @description  优化UI，主要是为了大家在LMARENA和匿名模型玩的时候被另外一个弱智模型影响，作者discord skuhrasr0plus1
// @author       skuhrasr0plus1
// @match        https://lmarena.ai/*
// @grant        GM_addStyle
// @license MIT// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541825/LMArena%20Purifier.user.js
// @updateURL https://update.greasyfork.org/scripts/541825/LMArena%20Purifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let purifiedContainer = null;
    let purifiedChatArea = null;
    let observer = null;
    let selectedMode = null; // 'A' or 'B'

GM_addStyle(`
        /* --- Variables & Theme (Elegant Dark) --- */
        :root {
            --purify-bg-primary: #121212; /* Deep Black for background */
            --purify-bg-secondary: #1e1e1e; /* Slightly lighter for panels/AI bubbles */
            --purify-accent: #007acc; /* Sophisticated Blue Accent (for User bubble/buttons) */
            --purify-accent-hover: #005f99;
            --purify-text-primary: #f0f0f0;
            --purify-text-secondary: #b0b0b0;
            --purify-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            --purify-radius: 12px; /* Softer corners */
        }

        /* --- Button Styling (Floating Selector) --- */
        #purify-selector-buttons {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            display: flex;
            gap: 15px;
        }
        .purify-btn {
            background-color: var(--purify-bg-secondary);
            color: var(--purify-text-primary);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 10px 20px;
            cursor: pointer;
            border-radius: var(--purify-radius);
            font-weight: 600;
            box-shadow: var(--purify-shadow);
            transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .purify-btn:hover {
            background-color: var(--purify-accent);
            transform: translateY(-2px); /* Slight lift effect */
        }

        /* --- Main Purified Container --- */
        #purified-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: var(--purify-bg-primary);
            color: var(--purify-text-primary);
            z-index: 2000;
            display: flex;
            font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
        }

        /* --- Top Control Panel (Sleek) --- */
        #purified-control-panel {
            padding: 15px 30px;
            background-color: var(--purify-bg-secondary);
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: flex;
            justify-content: space-between; /* Space out elements */
            align-items: center;
        }
        .control-group {
            display: flex;
            gap: 10px;
        }

        /* --- Chat Area (Readability Focused) --- */
        #purified-chat-area {
            flex-grow: 1;
            overflow-y: auto;
            padding: 30px 15px;
            display: flex;
            flex-direction: column-reverse;
            max-width: 800px;
            margin: 0 auto;
            width: 100%;
        }

        /* --- Custom Scrollbar (Thin and subtle) --- */
        #purified-chat-area::-webkit-scrollbar {
            width: 6px;
        }
        #purified-chat-area::-webkit-scrollbar-track {
            background: var(--purify-bg-primary);
        }
        #purified-chat-area::-webkit-scrollbar-thumb {
            background-color: var(--purify-bg-secondary);
            border-radius: 3px;
        }

        /* --- Input Area (Integrated) --- */
        #purified-input-area {
            padding: 20px 15px;
            background-color: var(--purify-bg-primary);
            /* Subtle border instead of heavy background change */
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            z-index: 2001;
            max-width: 800px;
            margin: 0 auto;
            width: 100%;
        }
         #purified-input-area textarea {
             background-color: var(--purify-bg-secondary) !important;
             color: var(--purify-text-primary) !important;
             border-radius: var(--purify-radius) !important;
             border: 1px solid rgba(255, 255, 255, 0.1) !important;
         }

        /* --- Message Bubbles (Modern Chat UI) --- */
        .cloned-message {
            margin-bottom: 20px;
            padding: 12px 18px;
            border-radius: 18px; /* Highly rounded */
            line-height: 1.5;
            display: block !important;
            flex: none !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        /* User Message Bubble (Accent Color) */
        .cloned-user {
            background-color: var(--purify-bg-secondary);
            color: var(--purify-text-primary);
            align-self: flex-end;
            max-width: 80%;
            border-bottom-right-radius: 4px;
        }

        /* AI Message Bubble (Secondary Color) */
        .cloned-ai {
            background-color: var(--purify-bg-secondary);
            color: var(--purify-text-primary);
            align-self: flex-start;
            max-width: 80%;
            border-bottom-left-radius: 4px;
        }

         /* Ensure links inside messages are visible */
        .cloned-message a {
            color: #63b3ed !important;
            text-decoration: none !important;
        }
        .cloned-message a:hover {
            text-decoration: underline !important;
        }
        .cloned-message p, .cloned-message ol, .cloned-message ul {
             margin-top: 0.5em !important;
             margin-bottom: 0.5em !important;
        }


        /* --- Control Panel Buttons --- */
        .control-btn {
            background-color: transparent;
            color: var(--purify-text-secondary);
            border: 1px solid var(--purify-text-secondary);
            padding: 6px 15px;
            cursor: pointer;
            border-radius: 50px; /* Pill shape */
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        .control-btn:hover {
            background-color: var(--purify-text-secondary);
            color: var(--purify-bg-primary);
        }
        .control-btn.exit {
           /* No specific color needed, keep it subtle */
        }
        .control-btn.end-chat {
            border-color: #e53e3e;
            color: #e53e3e;
        }
        .control-btn.end-chat:hover {
            background-color: #e53e3e;
            color: white;
        }

        /* --- Retry Button Styling (Subtle integration) --- */
        .retry-btn {
            background-color: rgba(255, 255, 255, 0.1);
            color: var(--purify-text-secondary);
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: var(--purify-radius);
            font-size: 12px;
            font-weight: bold;
            margin-top: 8px;
            transition: background-color 0.2s;
        }
        .retry-btn:hover {
            background-color: var(--purify-accent);
            color: white;
        }
    `);

    function findChatList() {
        return document.querySelector('main ol[class*="flex-col-reverse"]');
    }

    function findChatInputBar() {
        const main = document.querySelector('main');
        if (!main) return null;
        const textarea = main.querySelector('textarea');
        if (textarea) {
             return textarea.closest('main > div:last-child > div:last-child');
        }
        return document.querySelector('main > div:nth-child(2) > div:nth-child(3)');
    }

    function exitPurifiedMode() {
        if (purifiedContainer) {
            purifiedContainer.remove();
            purifiedContainer = null;
            purifiedChatArea = null;
        }

        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (window.purifyInputWatchdog) {
            clearInterval(window.purifyInputWatchdog);
            window.purifyInputWatchdog = null;
        }

        selectedMode = null;
        const buttons = document.getElementById('purify-selector-buttons');
        if (buttons) {
            buttons.style.display = 'flex';
        }

        console.log('Exited purified mode');
    }
    function ensureInputBarPosition() {
        if (!purifiedContainer || !purifiedChatArea) return;

        const purifiedInputArea = document.getElementById('purified-input-area');
        if (!purifiedInputArea) return;

        if (purifiedInputArea.children.length === 0 || !document.body.contains(purifiedInputArea.children[0])) {
            const chatInputBar = findChatInputBar();
            if (chatInputBar) {
                console.log("Purifier: 输入框丢失，重新捕获。");
                purifiedInputArea.innerHTML = '';
                purifiedInputArea.appendChild(chatInputBar);
            }
        }
    }
    function findEndChatButton() {
        let xpathPath;
        if (selectedMode === 'A') {
            xpathPath = '/html/body/div[1]/div[2]/div[2]/div/div[2]/main/div[2]/div[1]/div[2]/button[1]';
        } else if (selectedMode === 'B') {
            xpathPath = '/html/body/div[1]/div[2]/div[2]/div/div[2]/main/div[2]/div[1]/div[2]/button[4]';
        } else {
            console.error('No mode selected');
            return null;
        }
        const endChatButton = document.evaluate(
            xpathPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        return endChatButton;
    }

    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'purified-control-panel';
        const modeLabel = document.createElement('span');
        modeLabel.textContent = `Model: ${selectedMode}`;
        modeLabel.style.color = '#e2e8f0';
        modeLabel.style.fontWeight = 'bold';
        const exitBtn = document.createElement('button');
        exitBtn.textContent = 'Exit Purified Mode';
        exitBtn.className = 'control-btn exit';
        exitBtn.onclick = exitPurifiedMode;
        const endChatBtn = document.createElement('button');
        endChatBtn.textContent = 'openBox';
        endChatBtn.className = 'control-btn end-chat';
        endChatBtn.onclick = function() {
            const originalEndChatButton = findEndChatButton();
            if (originalEndChatButton) {
                originalEndChatButton.click();
                console.log(`End chat button clicked for mode ${selectedMode}`);
            } else {
                console.error(`Could not find end chat button for mode ${selectedMode}`);
            }
        };

        controlPanel.appendChild(modeLabel);
        controlPanel.appendChild(exitBtn);
        controlPanel.appendChild(endChatBtn);

        return controlPanel;
    }

    function setupPurifiedInterface() {
        if (!purifiedContainer) {
            purifiedContainer = document.createElement('div');
            purifiedContainer.id = 'purified-container';
            const controlPanel = createControlPanel();
            purifiedContainer.appendChild(controlPanel);

            purifiedChatArea = document.createElement('div');
            purifiedChatArea.id = 'purified-chat-area';

            const purifiedInputArea = document.createElement('div');
            purifiedInputArea.id = 'purified-input-area';

            purifiedContainer.appendChild(purifiedChatArea);
            purifiedContainer.appendChild(purifiedInputArea);
            document.body.appendChild(purifiedContainer);

            ensureInputBarPosition();
            if (!window.purifyInputWatchdog) {
                window.purifyInputWatchdog = setInterval(ensureInputBarPosition, 500);
            }
            const chatInputBar = findChatInputBar();
            if (chatInputBar) {
                purifiedInputArea.appendChild(chatInputBar);
            } else {
                console.warn("Purifier: Could not find the chat input bar.");
            }
        }
    }

    function findRetryButton() {
        let xpathPath;
        if (selectedMode === 'A') {
            xpathPath = '/html/body/div[1]/div[2]/div[2]/div/div[2]/main/div[1]/div/div/ol/div[2]/div[1]/div[1]/div[1]/div[2]/div[3]/button[1]';
        } else if (selectedMode === 'B') {
            xpathPath = '/html/body/div[1]/div[2]/div[2]/div/div[2]/main/div[1]/div/div/ol/div[2]/div[2]/div[1]/div[1]/div[2]/div[3]/button[1]';
        } else {
            console.error('No mode selected');
            return null;
        }
        const retryButton = document.evaluate(
            xpathPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (retryButton) {
            return retryButton;
        }

        const chatList = findChatList();
        if (!chatList) return null;

        const lastAIMessageBlock = chatList.querySelector('div[data-sentry-component="AIMessage"]:last-of-type');
        if (lastAIMessageBlock) {
            const abChildren = lastAIMessageBlock.querySelectorAll('div[class*="relative flex-1"]');
            if (abChildren.length >= 2) {
                const targetChild = selectedMode === 'A' ? abChildren[0] : abChildren[1];
                return targetChild.querySelector('button[aria-label*="retry"], button[title*="retry"], button:has(svg)');
            }
        }

        return null;
    }

    function createRetryButton() {
        const retryBtn = document.createElement('button');
        retryBtn.textContent = `Retry ${selectedMode}`;
        retryBtn.className = 'retry-btn';
        retryBtn.onclick = function() {
            const originalRetryButton = findRetryButton();
            if (originalRetryButton) {
                originalRetryButton.click();
                console.log(`Retry button ${selectedMode} clicked`);
            } else {
                console.error(`Could not find original retry button for mode ${selectedMode}`);
            }
        };
        return retryBtn;
    }

    function syncChatContent() {
        const chatList = findChatList();
        if (!chatList || !purifiedChatArea) return;

        purifiedChatArea.innerHTML = '';

        const messages = Array.from(chatList.children);

        messages.forEach((message, index) => {
            if (message.className.includes('h-[')) {
                 return;
            }

            let elementToClone = null;
            let cloneType = 'cloned-history';

            const isUserMessage = message.getAttribute('data-sentry-component') === 'UserMessage';
            const potentialABChildren = message.querySelectorAll('div[class*="relative flex-1"]');
            const isABBlock = potentialABChildren.length === 2;

            if (isUserMessage) {
                 elementToClone = message;
                 cloneType = 'cloned-user';
            } else if (isABBlock) {
                if (selectedMode === 'A') {
                    elementToClone = potentialABChildren[0];
                } else if (selectedMode === 'B') {
                    elementToClone = potentialABChildren[1];
                }
                cloneType = 'cloned-ai';

            } else if (potentialABChildren.length >= 1 || message.querySelector('div[class*="flex-col w-full"]')) {
                 elementToClone = message;
                 cloneType = 'cloned-ai';
            }


            if (elementToClone) {
                const clonedElement = elementToClone.cloneNode(true);
                clonedElement.classList.remove('flex-1', 'min-w-0', 'w-full', 'flex', 'flex-col', 'relative');
                clonedElement.style.width = 'auto';
                clonedElement.classList.add('cloned-message', cloneType);
                if (cloneType === 'cloned-ai') {
                    const retryBtn = createRetryButton();
                    clonedElement.appendChild(retryBtn);
                }

                purifiedChatArea.appendChild(clonedElement);
            }
        });
    }

    function startPurification(mode) {
        selectedMode = mode;
        console.log(`Starting purification mode: ${mode}`);

        const buttons = document.getElementById('purify-selector-buttons');
        if (buttons) buttons.style.display = 'none';

        setupPurifiedInterface();

        const chatList = findChatList();
        if (!chatList) {
            console.error("Purifier: Could not find the main chat list (<ol>).");
            return;
        }

        syncChatContent();

        if (observer) observer.disconnect();

        observer = new MutationObserver((mutations) => {
            if (window.syncTimeout) clearTimeout(window.syncTimeout);
            window.syncTimeout = setTimeout(syncChatContent, 50);
        });

        observer.observe(chatList, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false
        });
    }

    function createButtons() {
        if (document.getElementById('purify-selector-buttons')) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'purify-selector-buttons';

        const buttonA = document.createElement('button');
        buttonA.textContent = 'Purify A (Left)';
        buttonA.className = 'purify-btn';
        buttonA.onclick = () => startPurification('A');

        const buttonB = document.createElement('button');
        buttonB.textContent = 'Purify B (Right)';
        buttonB.className = 'purify-btn';
        buttonB.onclick = () => startPurification('B');

        buttonContainer.appendChild(buttonA);
        buttonContainer.appendChild(buttonB);
        document.body.appendChild(buttonContainer);
    }

    const waitForLoad = setInterval(() => {
        if (findChatList() && findChatInputBar()) {
            if (!document.getElementById('purify-selector-buttons')){
                 createButtons();
            }
            if (purifiedContainer && purifiedContainer.style.display !== 'none') {
            } else {
                 const buttons = document.getElementById('purify-selector-buttons');
                 if (buttons) buttons.style.display = 'flex';
            }
        }
    }, 1000);

})();
