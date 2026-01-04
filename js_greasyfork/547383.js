// ==UserScript==
// @name         Gemini Nav Pro: Live Navigator & Toolbox
// @namespace    https://greasyfork.org/en/users/1509088-eithon
// @version      4.2
// @description  Adds a powerful floating panel to Gemini chats that live-updates as responses generate. Features one-click code copying, active section highlighting, and rapid prompt-to-prompt navigation.
// @author       Eithon (and Gemini AI Assistant)
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547383/Gemini%20Nav%20Pro%3A%20Live%20Navigator%20%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/547383/Gemini%20Nav%20Pro%3A%20Live%20Navigator%20%20Toolbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* --- Styles are unchanged --- */
        #gemini-nav-panel {
            position: fixed; top: 50%; right: 20px; transform: translateY(-50%);
            z-index: 9999; background-color: rgba(240, 244, 250, 0.9);
            border: 1px solid #DDE2E7; border-radius: 12px; padding: 8px;
            display: none; flex-direction: column; gap: 6px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1); backdrop-filter: blur(10px); max-height: 90vh;
        }
        .gemini-nav-dynamic-links {
            display: flex; flex-direction: column; gap: 6px; overflow-y: auto;
        }
        .gemini-nav-separator { border: none; border-top: 1px solid #DDE2E7; margin: 4px 0; }
        .gemini-nav-button {
            cursor: pointer; height: 36px; padding: 0 12px; display: flex;
            align-items: center; justify-content: center; background-color: #FFFFFF;
            color: #444746; border-radius: 8px; font-size: 14px; font-weight: 500;
            font-family: 'Google Sans', sans-serif; text-decoration: none;
            transition: all 0.2s ease; border: 1px solid #DDE2E7; white-space: nowrap;
        }
        .gemini-nav-button:hover:not(:disabled) {
            border-color: #8ab4f8; background-color: #eaf2ff;
            box-shadow: 0 0 8px rgba(100, 150, 255, 0.6);
        }
        .gemini-nav-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .gemini-nav-item-container {
            display: flex; align-items: center; gap: 4px; background-color: #FFFFFF;
            border: 1px solid #DDE2E7; border-radius: 8px; transition: all 0.2s ease;
        }
        .gemini-nav-item-container:hover { border-color: #8ab4f8; background-color: #eaf2ff; }
        .gemini-nav-label {
            flex-grow: 1; cursor: pointer; padding: 0 12px; height: 36px;
            display: flex; align-items: center; font-size: 14px; font-weight: 500;
        }
        .gemini-nav-copy-btn {
            cursor: pointer; background: none; border: none; padding: 6px 10px 6px 6px;
            font-size: 16px; border-left: 1px solid #DDE2E7;
            border-top-right-radius: 8px; border-bottom-right-radius: 8px;
            transition: background-color 0.2s;
        }
        .gemini-nav-copy-btn:hover { background-color: rgba(0,0,0,0.08); }
        @keyframes subtle-glow {
            0%   { box-shadow: 0 0 0px rgba(100, 150, 255, 0); }
            50%  { box-shadow: 0 0 12px rgba(100, 150, 255, 0.7); }
            100% { box-shadow: 0 0 0px rgba(100, 150, 255, 0); }
        }
        .gemini-nav-item-container.glow, .gemini-nav-button.glow {
            animation: subtle-glow 2s ease-out;
        }
        body.dark-theme #gemini-nav-panel { background-color: rgba(30, 31, 34, 0.9); border-color: #5f6368; }
        body.dark-theme .gemini-nav-separator { border-top-color: #5f6368; }
        body.dark-theme .gemini-nav-button { background-color: #35373A; color: #E2E2E3; border-color: #5f6368; }
        body.dark-theme .gemini-nav-button:hover:not(:disabled) {
            border-color: #A8C5EE; background-color: #3C485A;
            box-shadow: 0 0 8px rgba(168, 197, 238, 0.5);
        }
        body.dark-theme .gemini-nav-item-container { background-color: #35373A; border-color: #5f6368; }
        body.dark-theme .gemini-nav-item-container:hover { border-color: #A8C5EE; background-color: #3C485A; }
        body.dark-theme .gemini-nav-copy-btn { border-left-color: #5f6368; }
        body.dark-theme .gemini-nav-copy-btn:hover { background-color: rgba(255,255,255,0.1); }
        @keyframes subtle-glow-dark {
            0%   { box-shadow: 0 0 0px rgba(168, 197, 238, 0); }
            50%  { box-shadow: 0 0 12px rgba(168, 197, 238, 0.5); }
            100% { box-shadow: 0 0 0px rgba(168, 197, 238, 0); }
        }
        body.dark-theme .gemini-nav-item-container.glow, body.dark-theme .gemini-nav-button.glow {
            animation-name: subtle-glow-dark;
        }
    `);

    let navPanel = null;
    let cachedScrollContainer = null;
    let currentNavTarget = null;
    let navigableItems = [];
    let lastHighlightedElement = null;
    let contentObserver = null;

    // --- A throttle utility function ---
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function findScrollContainer() {
        if (cachedScrollContainer && document.body.contains(cachedScrollContainer)) return cachedScrollContainer;
        const lastResponse = Array.from(document.querySelectorAll('model-response')).pop();
        if (!lastResponse) return null;
        let parent = lastResponse.parentElement;
        while (parent && parent !== document.body) {
            if (parent.scrollHeight > parent.clientHeight) {
                cachedScrollContainer = parent;
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    }

    // --- FIXED: Adjusted scroll alignment to the top of the element ---
    function smoothScrollToElement(targetElement) {
        if (!targetElement) return;
        // The browser's native `scrollIntoView` is robust against dynamic content.
        // Using `block: 'start'` aligns the top of the element with the top
        // of the scrollable viewport, which is the desired behavior.
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    function mainLoop() {
        const responses = document.querySelectorAll('model-response');
        let mostVisibleResponse = null;
        let maxVisibility = 0;
        responses.forEach(response => {
            const rect = response.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                const visibilityPercentage = rect.height > 0 ? visibleHeight / rect.height : 0;
                if (visibilityPercentage > maxVisibility) {
                    maxVisibility = visibilityPercentage;
                    mostVisibleResponse = response;
                }
            }
        });

        if (mostVisibleResponse) {
            if (mostVisibleResponse !== currentNavTarget) {
                buildNavForResponse(mostVisibleResponse);
            }
        } else {
            removeNavPanel();
        }

        if (navigableItems.length > 0) {
            let mostVisibleItem = null;
            let minDistanceFromCenter = Infinity;
            const viewportCenter = window.innerHeight / 2;
            navigableItems.forEach(item => {
                const rect = item.element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - viewportCenter);
                    if (distanceFromCenter < minDistanceFromCenter) {
                        minDistanceFromCenter = distanceFromCenter;
                        mostVisibleItem = item;
                    }
                }
            });
            if (mostVisibleItem && mostVisibleItem.element !== lastHighlightedElement) {
                lastHighlightedElement = mostVisibleItem.element;
                navigableItems.forEach(item => item.uiElement.classList.remove('glow'));
                mostVisibleItem.uiElement.classList.add('glow');
                setTimeout(() => mostVisibleItem.uiElement.classList.remove('glow'), 2000);
            }
        }
    }

    const throttledRebuild = throttle((responseElement) => {
        if (responseElement === currentNavTarget) {
            buildNavForResponse(responseElement);
        }
    }, 1000);

    function buildNavForResponse(responseElement) {
        if (contentObserver) contentObserver.disconnect();
        currentNavTarget = responseElement;
        navigableItems = [];

        if (!navPanel) {
            navPanel = document.createElement('div');
            navPanel.id = 'gemini-nav-panel';
            document.body.appendChild(navPanel);
        }
        while (navPanel.firstChild) navPanel.removeChild(navPanel.firstChild);

        const userPrompt = findPreviousUserQuery(responseElement);
        const codeContainers = responseElement.querySelectorAll('.code-container');
        const allPrompts = Array.from(document.querySelectorAll('user-query'));
        const currentIndex = allPrompts.findIndex(p => p === userPrompt);
        const pageTopButton = createButton('⏫', 'Scroll to Top', () => findScrollContainer()?.scrollTo({ top: 0, behavior: 'smooth' }));
        const prevPromptButton = createButton('▲', 'Previous Prompt', () => { if (currentIndex > 0) smoothScrollToElement(allPrompts[currentIndex - 1]); });
        prevPromptButton.disabled = (currentIndex <= 0);
        navPanel.append(pageTopButton, prevPromptButton);
        const promptPoint = userPrompt ? { element: userPrompt, label: 'Prompt' } : null;
        const codeBlockPoints = [];
        codeContainers.forEach((container, index) => {
            const scrollTarget = container.closest('code-block');
            if (scrollTarget) {
                const langSpan = scrollTarget.querySelector('.code-block-decoration span');
                const lang = langSpan ? langSpan.textContent.trim() : 'Code';
                codeBlockPoints.push({ element: scrollTarget, label: `${index + 1}. ${lang}` });
            }
        });

        if (promptPoint || codeBlockPoints.length > 0) {
            navPanel.appendChild(document.createElement('hr')).className = 'gemini-nav-separator';
            const dynamicLinksContainer = document.createElement('div');
            dynamicLinksContainer.className = 'gemini-nav-dynamic-links';
            navPanel.appendChild(dynamicLinksContainer);

            if (promptPoint) {
                const promptButton = createButton(promptPoint.label, `Scroll to ${promptPoint.label}`, () => smoothScrollToElement(promptPoint.element));
                dynamicLinksContainer.appendChild(promptButton);
                navigableItems.push({ element: promptPoint.element, uiElement: promptButton });
            }

            codeBlockPoints.forEach(point => {
                const itemContainer = document.createElement('div');
                itemContainer.className = 'gemini-nav-item-container';
                const label = document.createElement('span');
                label.className = 'gemini-nav-label';
                label.textContent = point.label;
                label.title = `Scroll to ${point.label}`;
                label.onclick = () => smoothScrollToElement(point.element);
                const copyBtn = document.createElement('button');
                copyBtn.className = 'gemini-nav-copy-btn';
                copyBtn.textContent = '📋';
                copyBtn.title = 'Copy Code';
                copyBtn.onclick = () => {
                    const code = point.element.querySelector('pre code')?.textContent || '';
                    navigator.clipboard.writeText(code).then(() => {
                        copyBtn.textContent = '✅';
                        setTimeout(() => { copyBtn.textContent = '📋'; }, 2000);
                    });
                };
                itemContainer.append(label, copyBtn);
                dynamicLinksContainer.appendChild(itemContainer);
                navigableItems.push({ element: point.element, uiElement: itemContainer });
            });
        }

        const nextPromptButton = createButton('▼', 'Next Prompt', () => { if (currentIndex > -1 && currentIndex < allPrompts.length - 1) smoothScrollToElement(allPrompts[currentIndex + 1]); });
        nextPromptButton.disabled = (currentIndex >= allPrompts.length - 1);
        const pageBottomButton = createButton('⏬', 'Scroll to Bottom', () => findScrollContainer()?.scrollTo({ top: findScrollContainer().scrollHeight, behavior: 'smooth' }));
        navPanel.appendChild(document.createElement('hr')).className = 'gemini-nav-separator';
        navPanel.append(nextPromptButton, pageBottomButton);
        navPanel.style.display = 'flex';

        contentObserver = new MutationObserver(() => throttledRebuild(responseElement));
        contentObserver.observe(responseElement, { childList: true, subtree: true });
    }

    function createButton(text, title, onClick) {
        const button = document.createElement('button');
        button.className = 'gemini-nav-button';
        button.textContent = text;
        button.title = title;
        button.addEventListener('click', onClick);
        return button;
    }

    function removeNavPanel() {
        if (navPanel) navPanel.style.display = 'none';
        currentNavTarget = null;
        navigableItems = [];
        lastHighlightedElement = null;
        if (contentObserver) contentObserver.disconnect();
    }

    function findPreviousUserQuery(element) {
        let sibling = element.previousElementSibling;
        while (sibling) {
            if (sibling.tagName.toLowerCase() === 'user-query') return sibling;
            sibling = sibling.previousElementSibling;
        }
        return element.closest('.conversation-container')?.querySelector('user-query');
    }

    setInterval(mainLoop, 750);

})();