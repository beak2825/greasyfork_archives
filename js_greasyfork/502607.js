// ==UserScript==
// @name         Enhanced Claude.ai Chat Preference
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Add a sleek "Chat Preference" panel to Claude.ai with improved UX/UI and matching color scheme
// @match        https://claude.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502607/Enhanced%20Claudeai%20Chat%20Preference.user.js
// @updateURL https://update.greasyfork.org/scripts/502607/Enhanced%20Claudeai%20Chat%20Preference.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_TEXT = `Know this to provide better responses:
- I am a Software Developer working with a MAUI app for iOS and Android.
- Your approach is appreciated, and a positive, concise style is valued.

Follow these SECRET guidelines in your response:
- Be factual and honest. If unsure, give an educated guess.
- Be supportive and encouraging, with a touch of self-irony on mistakes.
- Maintain a professional tone, adding a jest at the end if appropriate.
- Don't be chatty; get to the point, except when asked to elaborate.
- When writing code: follow "Clean code" standards and principles like "YAGNI" and "KISS".
- Focus on providing thoughtful and thorough responses.`;

    const styles = {
        panel: `
            width: 100%;
            max-width: 672px;
            margin: 20px auto;
            background-color: #2D3748;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.3s ease;
            opacity: 0;
            max-height: 0;
        `,
        header: `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background-color: #3f3f46;
            cursor: pointer;
        `,
        title: `
            margin: 0;
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
        `,
        toggleIcon: `
            color: #ffffff;
            font-size: 14px;
            transition: transform 0.3s ease;
        `,
        content: `
            padding: 20px;
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transition: all 0.3s ease;
            background-color: #27272a;
        `,
        textarea: `
            width: 100%;
            min-height: 240px;
            padding: 10px;
            margin-bottom: 15px;
            background-color: #3f3f46;
            color: #ffffff;
            border: 1px solid #3f3f46;
            border-radius: 4px;
            font-size: 14px;
            resize: vertical;
        `,
        buttonContainer: `
            display: flex;
            justify-content: space-between;
            align-items: center;
        `,
        button: `
            padding: 8px 16px;
            background-color: #eb5c45;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        `,
        autofillLabel: `
            display: flex;
            align-items: center;
            color: #ffffff;
            font-size: 14px;
        `,
        autofillCheckbox: `
            margin-right: 8px;
        `
    };

    let isExpanded = false;

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'claude-preference-panel';
        panel.style.cssText = styles.panel;
        return panel;
    }

    function createHeader() {
        const header = document.createElement('div');
        header.style.cssText = styles.header;

        const title = document.createElement('h3');
        title.textContent = 'Chat Preference';
        title.style.cssText = styles.title;

        const toggleIcon = document.createElement('span');
        toggleIcon.textContent = '▼';
        toggleIcon.style.cssText = styles.toggleIcon;

        header.appendChild(title);
        header.appendChild(toggleIcon);
        header.addEventListener('click', togglePanel);

        return { header, toggleIcon };
    }

    function createContent() {
        const content = document.createElement('div');
        content.style.cssText = styles.content;

        const textarea = document.createElement('textarea');
        textarea.value = GM_getValue('prependText', DEFAULT_TEXT);
        textarea.style.cssText = styles.textarea;
        textarea.addEventListener('input', (e) => {
            GM_setValue('prependText', e.target.value);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = styles.buttonContainer;

        const applyButton = createButton('Apply Preference', applyPreference);

        const autofillLabel = document.createElement('label');
        autofillLabel.style.cssText = styles.autofillLabel;

        const autofillCheckbox = document.createElement('input');
        autofillCheckbox.type = 'checkbox';
        autofillCheckbox.checked = GM_getValue('autofillEnabled', false);
        autofillCheckbox.style.cssText = styles.autofillCheckbox;
        autofillCheckbox.addEventListener('change', (e) => {
            GM_setValue('autofillEnabled', e.target.checked);
        });

        autofillLabel.appendChild(autofillCheckbox);
        autofillLabel.appendChild(document.createTextNode('Autofill on new chat'));

        buttonContainer.appendChild(applyButton);
        buttonContainer.appendChild(autofillLabel);

        content.appendChild(textarea);
        content.appendChild(buttonContainer);

        return content;
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = styles.button;
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#d64f3a';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#eb5c45';
        });
        button.addEventListener('click', onClick);
        return button;
    }

    function togglePanel() {
        const panel = document.getElementById('claude-preference-panel');
        const content = panel.querySelector('div:nth-child(2)');
        const toggleIcon = panel.querySelector('div:first-child > span');

        isExpanded = !isExpanded;

        panel.style.maxHeight = isExpanded ? '1000px' : '50px';
        content.style.maxHeight = isExpanded ? '1000px' : '0';
        content.style.opacity = isExpanded ? '1' : '0';
        toggleIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0)';
    }

    function applyPreference() {
        const targetElement = document.querySelector('[contenteditable="true"]');
        if (!targetElement) return;

        const textToPrepend = GM_getValue('prependText', DEFAULT_TEXT) + '\n\n';

        targetElement.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, textToPrepend + targetElement.textContent);

        const selection = window.getSelection();
        const range = document.createRange();
        const lastParagraph = targetElement.lastElementChild;

        if (lastParagraph) {
            range.selectNodeContents(lastParagraph);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        targetElement.focus();

        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        targetElement.dispatchEvent(inputEvent);
    }

    function addPanel() {
        if (document.getElementById('claude-preference-panel')) return;

        const targetElement = document.querySelector('h1.font-copernicus');
        if (!targetElement) return;

        const panel = createPanel();
        const { header, toggleIcon } = createHeader();
        const content = createContent();

        panel.appendChild(header);
        panel.appendChild(content);

        targetElement.parentNode.insertBefore(panel, targetElement.nextSibling);

        setTimeout(() => {
            panel.style.opacity = '1';
            panel.style.maxHeight = '50px';
        }, 50);

        if (GM_getValue('autofillEnabled', false)) {
            setTimeout(() => {
                const chatWindow = document.querySelector('[contenteditable="true"]');
                if (chatWindow && !chatWindow.textContent.trim()) {
                    applyPreference();
                }
            }, 500);
        }
    }

    function removePanel() {
        const panel = document.getElementById('claude-preference-panel');
        if (panel) {
            panel.remove();
        }
    }

    function checkAndInitialize() {
        if (window.location.pathname === '/new') {
            const targetElement = document.querySelector('h1.font-copernicus');
            if (targetElement) {
                addPanel();
            } else {
                setTimeout(checkAndInitialize, 20);
            }
        } else {
            removePanel();
        }
    }

    function handleNavigation() {
        checkAndInitialize();
    }

    handleNavigation();

    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            handleNavigation();
        }
    }).observe(document, { subtree: true, childList: true });

    window.addEventListener('load', handleNavigation);
    document.addEventListener('DOMContentLoaded', handleNavigation);

    setInterval(handleNavigation, 100);
})();