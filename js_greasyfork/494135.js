// ==UserScript==
// @name        GPT Input Dialog
// @description 为一系列 GPT 类网站添加长文输入对话框 | Add a long text input dialog to a series of GPT-like platforms
// @namespace   gitlab.com/frostime
// @version     5.17.0
// @match       *://poe.com/chat/*
// @match       *://poe.com
// @match       *://chat.mistral.ai/chat
// @match       *://chat.mistral.ai/chat/*
// @match       *://chat.openai.com/*
// @match       *://chatgpt.com/*
// @match       *://*.aizex.cn/*
// @match       *://*.aizex.net/*
// @match       *://*.aizex.me/*
// @match       *://*.memofun.net/*
// @match       *://chatglm.cn/*
// @match       *://gemini.google.com/app*
// @match       *://grok.com
// @match       *://grok.com/chat/*
// @match       https://claude.ai/*
// @match       https://chat.deepseek.com/*
// @match       https://aistudio.google.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=chat.openai.com
// @run-at      document-end
// @author      frostime
// @license     AGPL-3.0-only
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/494135/GPT%20Input%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/494135/GPT%20Input%20Dialog.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const splitTextareaLines = (textarea, position) => {
        const text = textarea.value;
        if (position < 0 || position > text.length) {
            throw new Error('Position is out of bounds of the text length');
        }
        const befores = text.slice(0, position).split('\n');
        const afters = text.slice(position).split('\n');
        const currentLineBefore = befores.pop() ?? '';
        const currentLineAfter = afters.shift() ?? '';
        const line = currentLineBefore + currentLineAfter;
        return { befores, line, afters };
    };
    function updateStyleSheet(container, id, cssText) {
        let style = container.querySelector(`#${id}`);
        if (!style) {
            style = document.createElement('style');
            style.id = id;
            container.appendChild(style);
        }
        style.textContent = cssText;
    }
    const queryOfficalTextarea = () => {
        const q = currentPlatform$1.selector.officialTextarea;
        const textarea = document.querySelector(q);
        return textarea;
    };
    const focusOffcialTextarea = () => {
        const textarea = queryOfficalTextarea();
        textarea?.focus();
    };
    const removeAllChildren = (element) => {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };
    const StyleSheet = (FontFamily, currentPlatform) => `
textarea.GrowingTextArea_textArea__ZWQbP {
    background: ${currentPlatform.css.backgroundColor} !important;
}
button#floating-button {
    position: absolute;
    right: 50px;
    bottom: 10px;
    padding: 10px 20px;
    background-color: ${currentPlatform.css.primaryColor};
    color: #fff;
    border: none;
    border-radius: 25px;
    cursor: pointer;
}
div#dialog {
    background-color: ${currentPlatform.css.backgroundColor};
    padding: 21px;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    width: 50%;
    max-width: 90%;
    min-width: 45%;
    height: 500px;
    max-height: 80%;
    position: absolute;
    bottom: 50px;
}
div#dialog svg {
    fill: ${currentPlatform.css.primaryColor};
}
div#dialog #dialog-text-input {
    border: 1px solid ${currentPlatform.css.primaryColor};
    border-radius: 4px;
    padding: 8px;
    flex-grow: 1; /* Allow the text input area to grow */
    display: flex; /* Make the text input area a flex container */
    flex-direction: column; /* Stack child elements vertically */
}
div#dialog #dialog-text-input textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    font-size: 22px;
    line-height: 1.5;
    font-family: ${FontFamily};
    flex-grow: 1; /* Allow the textarea to grow vertically */
}

div#dialog button#cancel-button {
    margin-right: 8px;
    padding: 8px 16px;
    background-color: #f2f2f2;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
}
div#dialog button#fill-button {
    margin-right: 8px;
    padding: 8px 16px;
    background-color: ${currentPlatform.css.primaryColor};
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
div#dialog button#confirm-button {
    padding: 8px 16px;
    background-color: ${currentPlatform.css.primaryColor};
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}`;

    const ContenteditableTextarea = {
        getText: (ele) => {
            let paras = ele.querySelectorAll('p');
            let text = Array.from(paras).map(para => para.textContent).join('\n');
            return text;
        },
        setText: (ele, text) => {
            let lines = text.trim().split('\n');
            removeAllChildren(ele);
            lines.forEach(line => {
                let p = document.createElement('p');
                p.textContent = line;
                ele.appendChild(p);
            });
        }
    };
    const Poe = {
        name: 'Poe',
        baseUrl: 'poe.com',
        selector: {
            officialTextarea: 'div.ChatMessageInputContainer_inputContainer__s2AGa textarea',
            submitButton: 'div.ChatMessageInputContainer_inputContainer__s2AGa button.ChatMessageInputContainer_sendButton__dBjTt',
            chatSessionTitle: 'p.ChatHeader_overflow__aVkfq',
        },
        css: {
            backgroundColor: 'var(--pdl-bg-base)',
            primaryColor: 'var(--pdl-accent-base)',
        },
        createTextarea: () => {
            const textarea = document.createElement('textarea');
            textarea.className = 'GrowingTextArea_textArea__ZWQbP';
            textarea.rows = 5;
            textarea.style.backgroundColor = 'var(--pdl-bg-base) !important';
            textarea.placeholder = 'Talk to ...';
            return textarea;
        }
    };
    const Mistral = {
        name: 'Mistral',
        baseUrl: 'chat.mistral.ai/chat',
        selector: {
            officialTextarea: 'textarea',
            submitButton: 'button[type="submit"]',
            chatSessionTitle: 'div.flex.w-full>p.block.truncate',
        },
        css: {
            backgroundColor: 'hsl(var(--background))',
            primaryColor: 'hsl(var(--primary))',
        },
        createTextarea: () => {
            const textarea = document.createElement('textarea');
            textarea.style.backgroundColor = 'hsl(var(--background)) !important';
            textarea.placeholder = 'Talk to ...';
            return textarea;
        }
    };
    const ChatGPT = {
        name: 'ChatGPT',
        baseUrl: 'chatgpt.com',
        selector: {
            officialTextarea: 'div#prompt-textarea',
            submitButton: 'button[data-testid="send-button"]',
            chatSessionTitle: '#chat-title',
        },
        css: {
            backgroundColor: 'var(--main-surface-primary)',
            primaryColor: '#2e95d3',
        },
        createTextarea: () => {
            const textarea = document.createElement('textarea');
            textarea.style.backgroundColor = 'var(--main-surface-primary)';
            textarea.style.padding = '0px';
            textarea.placeholder = 'Talk to ...';
            return textarea;
        },
        getSubmitButton: () => {
            let button = document.querySelector('button[data-testid="send-button"]');
            return button;
        },
        getText: () => {
            const officialTextarea = document.querySelector(ChatGPT.selector.officialTextarea);
            return ContenteditableTextarea.getText(officialTextarea);
        },
        setText: (text) => {
            const officialTextarea = document.querySelector(ChatGPT.selector.officialTextarea);
            ContenteditableTextarea.setText(officialTextarea, text);
        }
    };
    const Aizex = {
        name: 'Aizex',
        baseUrl: ['aizex.cn', 'aizex.net', 'aizex.me', 'memofun.net'],
        matchUrl: (url) => {
            const urlObj = new URL(url);
            const host = urlObj.hostname;
            const path = urlObj.pathname;
            const isAizex = Aizex.baseUrl.some(base => host.endsWith(base) && host !== base);
            const prefix = host.split('.')[0];
            if (isAizex && prefix.endsWith('-c')) {
                return false;
            }
            return isAizex && path.startsWith('/');
        },
        selector: {
            officialTextarea: 'div#prompt-textarea',
            submitButton: 'button[data-testid="send-button"]',
            chatSessionTitle: '#chat-title',
        },
        css: {
            backgroundColor: 'var(--main-surface-primary)',
            primaryColor: '#2e95d3',
        },
        createTextarea: () => {
            const textarea = document.createElement('textarea');
            textarea.style.backgroundColor = 'var(--main-surface-primary)';
            textarea.style.padding = '0px';
            textarea.placeholder = 'Talk to ...';
            return textarea;
        },
        getSubmitButton: () => {
            let button = document.querySelector('button[data-testid="send-button"]');
            return button;
        },
        getText: () => {
            const officialTextarea = document.querySelector(Aizex.selector.officialTextarea);
            return ContenteditableTextarea.getText(officialTextarea);
        },
        setText: (text) => {
            const officialTextarea = document.querySelector(Aizex.selector.officialTextarea);
            ContenteditableTextarea.setText(officialTextarea, text);
        }
    };
    const Claude = {
        name: 'Claude',
        baseUrl: ['claude.ai'],
        matchUrl: (url) => {
            const urlObj = new URL(url);
            const host = urlObj.hostname;
            const isClaude = Claude.baseUrl.some(base => host.endsWith(base));
            const isAizexClaude = (() => {
                const aizexBaseUrls = Aizex.baseUrl;
                const isAizex = aizexBaseUrls.some(base => host.endsWith(base));
                if (!isAizex)
                    return false;
                const firstPart = host.split('.aizex')[0];
                return firstPart.endsWith('-c');
            })();
            if (!isClaude && isAizexClaude) {
                return true;
            }
            return isClaude;
        },
        selector: {
            officialTextarea: 'fieldset div.ProseMirror[contenteditable="true"]',
            submitButton: 'fieldset button[aria-label="Send Message"]',
            chatSessionTitle: '#chat-title',
        },
        css: {
            backgroundColor: 'hsl(var(--bg-000)/var(--tw-bg-opacity))',
            primaryColor: 'hsl(var(--accent-main-100)/var(--tw-bg-opacity))',
        },
        createTextarea: () => {
            const textarea = document.createElement('textarea');
            textarea.style.backgroundColor = Claude.css.backgroundColor;
            textarea.style.padding = '0px';
            textarea.style.boxShadow = 'unset';
            textarea.placeholder = 'Talk to ...';
            return textarea;
        },
        getText: () => {
            const officialTextarea = document.querySelector(Claude.selector.officialTextarea);
            return ContenteditableTextarea.getText(officialTextarea);
        },
        setText: (text) => {
            const officialTextarea = document.querySelector(Claude.selector.officialTextarea);
            ContenteditableTextarea.setText(officialTextarea, text);
        }
    };
    const ChatGLM = {
        name: 'ChatGLM',
        baseUrl: 'chatglm.cn',
        selector: {
            officialTextarea: 'div.input-box-inner>textarea',
            submitButton: 'div.input-wrap>div.enter>img',
            chatSessionTitle: '.showHideText>div:first-child',
        },
        css: {
            backgroundColor: 'var(--bg_white_1)',
            primaryColor: '#2e95d3',
        },
        createTextarea: () => {
            const textarea = document.createElement('textarea');
            textarea.style.backgroundColor = 'var(--bg_white_1)';
            textarea.style.color = 'var(--txt_icon_black_1,#1a2029)';
            textarea.style.fontSize = '20px';
            textarea.placeholder = 'Talk to ...';
            return textarea;
        }
    };
    const Gemini = {
        name: 'Gemini',
        baseUrl: 'gemini.google.com',
        selector: {
            officialTextarea: 'rich-textarea > div.ql-editor.textarea',
            submitButton: '.input-buttons-wrapper-bottom button.send-button',
            chatSessionTitle: '',
        },
        css: {
            backgroundColor: 'var(--gem-sys-color--surface-container)',
            primaryColor: '#2e95d3',
        },
        createTextarea: () => {
            const textarea = document.createElement('textarea');
            Object.assign(textarea.style, {
                'color': 'var(--bard-color-inverse-surface-container)',
                'background-color': 'var(--bard-color-surface-container)'
            });
            textarea.placeholder = 'Talk to ...';
            return textarea;
        },
        getText: () => {
            const officialTextarea = document.querySelector(Gemini.selector.officialTextarea);
            return ContenteditableTextarea.getText(officialTextarea);
        },
        setText: (text) => {
            const officialTextarea = document.querySelector(Gemini.selector.officialTextarea);
            ContenteditableTextarea.setText(officialTextarea, text);
        }
    };
    const Deepseek = {
        name: 'Deepseek',
        baseUrl: 'chat.deepseek.com',
        selector: {
            officialTextarea: 'textarea#chat-input',
            submitButton: 'div[role="button"]._7436101',
            chatSessionTitle: '',
        },
        css: {
            backgroundColor: 'rgb(var(--ds-rgb-header))',
            primaryColor: '#4d6bfe',
        },
        createTextarea: () => {
            const textarea = document.createElement('textarea');
            Object.assign(textarea.style, {
                'background-color': 'var(--ds-toast-custom-color)',
                color: 'rgb(var(--ds-rgb-label-1))'
            });
            textarea.placeholder = 'Talk to ...';
            return textarea;
        }
    };
    const GoogleAIStudio = {
        name: 'GoogleAIStudio',
        baseUrl: 'aistudio.google.com',
        selector: {
            officialTextarea: 'footer textarea',
            submitButton: 'footer button[type="submit"]',
            chatSessionTitle: '',
        },
        css: {
            backgroundColor: 'var(--color-neutral-8)',
            primaryColor: '#2e95d3',
        },
        createTextarea: () => {
            const textarea = document.createElement('textarea');
            Object.assign(textarea.style, {
                'background-color': 'var(--color-surface-container-lowest)',
                color: 'var(--color-neutral-90)'
            });
            textarea.placeholder = 'Talk to ...';
            return textarea;
        }
    };
    const Grok = {
        name: 'Grok',
        baseUrl: 'grok.com',
        selector: {
            officialTextarea: 'textarea.w-full',
            submitButton: 'button[type="submit"]',
            chatSessionTitle: '',
        },
        css: {
            backgroundColor: 'var(--background)',
            primaryColor: '#1d9bf0',
        },
        createTextarea: () => {
            const textarea = document.createElement('textarea');
            Object.assign(textarea.style, {
                borderRadius: '8px',
                padding: '12px'
            });
            textarea.placeholder = 'Talk to Grok...';
            return textarea;
        }
    };
    const Platforms = [
        Poe, Mistral, ChatGPT,
        Aizex, ChatGLM, Gemini,
        Claude, Deepseek, GoogleAIStudio, Grok
    ];
    let currentPlatform$1;
    const togglePlatform = (name) => {
        console.log(`Try to toggle platform: ${name}`);
        const platform = Platforms.find(p => p.name === name);
        if (platform) {
            currentPlatform$1 = platform;
            console.log(`platform ${name} toggled.`);
        }
        else {
            console.error(`platform ${name} not found; togglePlatform failed.`);
        }
    };

    function withFocus(field, callback) {
      const document = field.ownerDocument;
      const initialFocus = document.activeElement;
      if (initialFocus === field) {
        return callback();
      }
      try {
        field.focus();
        return callback();
      } finally {
        field.blur();
        if (initialFocus instanceof HTMLElement) {
          initialFocus.focus();
        }
      }
    }
    function insertTextWhereverTheFocusIs(document, text) {
      if (text === '') {
        document.execCommand('delete');
      } else {
        document.execCommand('insertText', false, text);
      }
    }
    function insertTextIntoField(field, text) {
      withFocus(field, () => {
        insertTextWhereverTheFocusIs(field.ownerDocument, text);
      });
    }

    /**
     * @Declaration Copyfrom a MIT licensed project, with slight modifications.
     * @URL https://github.com/fregante/indent-textarea
     * @license MIT
     * ----------------------------------------------------------------------------
    MIT License
    Copyright (c) Federico Brigante <me@fregante.com> (https://fregante.com)
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    function indentSelection(element) {
        const { selectionStart, selectionEnd, value } = element;
        const selectedText = value.slice(selectionStart, selectionEnd);
        const lineBreakCount = /\n/g.exec(selectedText)?.length;
        if (lineBreakCount > 0) {
            const firstLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
            const newSelection = element.value.slice(firstLineStart, selectionEnd - 1);
            const indentedText = newSelection.replaceAll(/^|\n/g,
            '$&    ');
            const replacementsCount = indentedText.length - newSelection.length;
            element.setSelectionRange(firstLineStart, selectionEnd - 1);
            insertTextIntoField(element, indentedText);
            element.setSelectionRange(selectionStart + 4, selectionEnd + replacementsCount);
        }
        else {
            insertTextIntoField(element, '    ');
        }
    }
    function findLineEnd(value, currentEnd) {
        const lastLineStart = value.lastIndexOf('\n', currentEnd - 1) + 1;
        if (value.charAt(lastLineStart) !== '\t') {
            return currentEnd;
        }
        return lastLineStart + 1;
    }
    function unindentSelection(element) {
        const { selectionStart, selectionEnd, value } = element;
        const firstLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const minimumSelectionEnd = findLineEnd(value, selectionEnd);
        const newSelection = element.value.slice(firstLineStart, minimumSelectionEnd);
        const indentedText = newSelection.replaceAll(/(^|\n)(\t| {1,4})/g, '$1');
        const replacementsCount = newSelection.length - indentedText.length;
        element.setSelectionRange(firstLineStart, minimumSelectionEnd);
        insertTextIntoField(element, indentedText);
        const firstLineIndentation = /\t| {1,4}/.exec(value.slice(firstLineStart, selectionStart));
        const difference = firstLineIndentation
            ? firstLineIndentation[0].length
            : 0;
        const newSelectionStart = selectionStart - difference;
        element.setSelectionRange(selectionStart - difference, Math.max(newSelectionStart, selectionEnd - replacementsCount));
    }
    function tabToIndentListener(event) {
        if (event.defaultPrevented
            || event.metaKey
            || event.altKey
            || event.ctrlKey) {
            return;
        }
        const textarea = event.target;
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                unindentSelection(textarea);
            }
            else {
                indentSelection(textarea);
            }
            event.preventDefault();
            event.stopImmediatePropagation();
        }
        else if (event.key === 'Escape'
            && !event.shiftKey) {
            textarea.blur();
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }
    function enableTabToIndent(elements, signal) {
        if (typeof elements === 'string') {
            elements = document.querySelectorAll(elements);
        }
        else if (elements instanceof HTMLTextAreaElement) {
            elements = [elements];
        }
        for (const element of elements) {
            element.addEventListener('keydown', tabToIndentListener, { signal });
        }
    }

    const zhCN = {
        cancel: '取消[Esc]',
        fill: '填充[Alt+Enter]',
        confirm: '提交[Ctrl+Enter]',
    };
    const enUS = {
        cancel: 'Cancel[Esc]',
        fill: 'Fill[Alt+Enter]',
        confirm: 'Submit[Ctrl+Enter]',
    };
    const useI18n = () => {
        const lang = navigator.language;
        switch (lang) {
            case 'zh-CN':
                return zhCN;
            case 'en-US':
                return enUS;
            default:
                return enUS;
        }
    };

    const KeydownEventHandler = (event, { textarea, cancelButton, fillButton, confirmButton }) => {
        const { key, shiftKey } = event;
        if (key === 'Escape') {
            cancelButton.click();
        }
        if (key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            confirmButton.click();
        }
        if (key === 'Enter' && event.altKey) {
            event.preventDefault();
            fillButton.click();
        }
        const position = textarea.selectionStart;
        const { befores, line, afters } = splitTextareaLines(textarea, position);
        if (key === 'Enter' && !shiftKey) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            if (start !== end) {
                return;
            }
            const whiteSpaceMatch = line.match(/^\s*/);
            const whiteSpace = whiteSpaceMatch ? whiteSpaceMatch[0] : '';
            insertTextIntoField(textarea, `\n${whiteSpace}`);
            event.preventDefault();
        }
        if (key === 'Backspace' && textarea.selectionStart === textarea.selectionEnd) {
            const position = textarea.selectionStart;
            if (position === 0)
                return;
            const { line } = splitTextareaLines(textarea, position);
            if (line === '')
                return;
            if (line.trim() === '') {
                event.preventDefault();
                unindentSelection(textarea);
            }
        }
        if (event.ctrlKey && (key === 'ArrowUp' || key === 'ArrowDown')) {
            event.preventDefault();
            const fontSize = parseInt(window.getComputedStyle(textarea).fontSize);
            const newFontSize = key === 'ArrowUp' ? fontSize + 1 : fontSize - 1;
            textarea.style.fontSize = `${newFontSize}px`;
        }
        if (key === '>') {
            const tagMatch = line.match(/^\s*<(\S+?)$/);
            if (tagMatch) {
                event.preventDefault();
                const tagName = tagMatch[1];
                insertTextIntoField(textarea, `>${tagName ? `</${tagName}>` : ''}`);
                const newPosition = position + 1;
                textarea.setSelectionRange(newPosition, newPosition);
                return;
            }
        }
    };
    const createReloadIcon = () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M3 5.67541V3C3 2.44772 2.55228 2 2 2C1.44772 2 1 2.44772 1 3V7C1 8.10457 1.89543 9 3 9H7C7.55229 9 8 8.55229 8 8C8 7.44772 7.55229 7 7 7H4.52186C4.54218 6.97505 4.56157 6.94914 4.57995 6.92229C5.621 5.40094 7.11009 4.22911 8.85191 3.57803C10.9074 2.80968 13.173 2.8196 15.2217 3.6059C17.2704 4.3922 18.9608 5.90061 19.9745 7.8469C20.9881 9.79319 21.2549 12.043 20.7247 14.1724C20.1945 16.3018 18.9039 18.1638 17.0959 19.4075C15.288 20.6513 13.0876 21.1909 10.9094 20.9247C8.73119 20.6586 6.72551 19.605 5.27028 17.9625C4.03713 16.5706 3.27139 14.8374 3.06527 13.0055C3.00352 12.4566 2.55674 12.0079 2.00446 12.0084C1.45217 12.0088 0.995668 12.4579 1.04626 13.0078C1.25994 15.3309 2.2082 17.5356 3.76666 19.2946C5.54703 21.3041 8.00084 22.5931 10.6657 22.9188C13.3306 23.2444 16.0226 22.5842 18.2345 21.0626C20.4464 19.541 22.0254 17.263 22.6741 14.6578C23.3228 12.0526 22.9963 9.30013 21.7562 6.91897C20.5161 4.53782 18.448 2.69239 15.9415 1.73041C13.4351 0.768419 10.6633 0.756291 8.14853 1.69631C6.06062 2.47676 4.26953 3.86881 3 5.67541Z");
        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2344 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.546 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z");
        svg.appendChild(path1);
        svg.appendChild(path2);
        return svg;
    };
    class TextInputDialog {
        constructor() {
            this.confirmCallback = () => { };
            this.buildDialog();
        }
        bindConfirmCallback(callback) {
            this.confirmCallback = callback;
        }
        buildDialog() {
            const i18n = useI18n();
            const overlay = document.createElement('div');
            overlay.id = TextInputDialog.OVERLAY_ID;
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.display = 'none';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = '9999';
            this.overlay = overlay;
            const dialog = document.createElement('div');
            dialog.id = 'dialog';
            this.dialog = dialog;
            const textInput = document.createElement('div');
            textInput.id = 'dialog-text-input';
            textInput.dataset.replicatedValue = '';
            const textarea = currentPlatform$1.createTextarea();
            textInput.appendChild(textarea);
            this.textarea = textarea;
            textarea.style.whiteSpace = 'pre-wrap';
            textarea.addEventListener('keydown', (event) => {
                KeydownEventHandler(event, this);
            });
            enableTabToIndent(textarea);
            const bottom = document.createElement('div');
            bottom.style.display = 'flex';
            bottom.style.justifyContent = 'space-between';
            const bottomLeft = document.createElement('div');
            bottomLeft.style.display = 'flex';
            bottomLeft.style.alignItems = 'center';
            bottomLeft.style.justifyContent = 'flex-start';
            const reloadButton = document.createElement('button');
            reloadButton.ariaLabel = 'Latest Input';
            Object.assign(reloadButton.style, {
                width: '24px',
                height: '24px',
                padding: '0',
                margin: '0',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                outline: 'none',
            });
            reloadButton.appendChild(createReloadIcon());
            reloadButton.addEventListener('click', () => {
                textarea.value = globalThis.inputText ?? '';
            });
            bottomLeft.appendChild(reloadButton);
            const bottomRight = document.createElement('div');
            bottomRight.style.display = 'flex';
            bottomRight.style.alignItems = 'center';
            bottomRight.style.justifyContent = 'flex-end';
            bottomRight.style.marginTop = '16px';
            const cancelButton = document.createElement('button');
            cancelButton.id = 'cancel-button';
            cancelButton.textContent = i18n.cancel;
            const fillButton = document.createElement('button');
            fillButton.id = 'fill-button';
            fillButton.textContent = i18n.fill;
            const confirmButton = document.createElement('button');
            confirmButton.id = 'confirm-button';
            confirmButton.textContent = i18n.confirm;
            bottomRight.appendChild(cancelButton);
            bottomRight.appendChild(fillButton);
            bottomRight.appendChild(confirmButton);
            this.cancelButton = cancelButton;
            this.fillButton = fillButton;
            this.confirmButton = confirmButton;
            bottom.appendChild(bottomLeft);
            bottom.appendChild(bottomRight);
            dialog.appendChild(textInput);
            dialog.appendChild(bottom);
            overlay.appendChild(dialog);
            cancelButton.addEventListener('click', () => {
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                focusOffcialTextarea();
            });
            fillButton.addEventListener('click', () => {
                globalThis.inputText = textarea.value;
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.confirmCallback(textarea.value, false);
            });
            confirmButton.addEventListener('click', () => {
                globalThis.inputText = textarea.value;
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.confirmCallback(textarea.value, true);
            });
        }
        render(container) {
            console.log(`Install GPT-Dialog within: ${container.tagName}`);
            if (container.querySelector(`#${TextInputDialog.OVERLAY_ID}`)) {
                console.warn(`Overlay already exists, skip render`);
                return;
            }
            container.appendChild(this.overlay);
        }
        hide() {
            this.overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            focusOffcialTextarea();
        }
        show() {
            if (this.overlay.style.display === 'flex') {
                return;
            }
            this.overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            this.updateDialog();
            this.textarea.focus();
        }
        updateDialog() {
            if (currentPlatform$1.getText === undefined) {
                const baseText = queryOfficalTextarea()?.value;
                this.textarea.value = baseText || '';
            }
            else {
                this.textarea.value = currentPlatform$1.getText();
            }
            if (currentPlatform$1.selector.chatSessionTitle) {
                const title = document.querySelector(currentPlatform$1.selector.chatSessionTitle);
                if (title) {
                    this.textarea.placeholder = `Talk to ${title.textContent}`;
                }
            }
            this.textarea.focus();
        }
    }
    TextInputDialog.OVERLAY_ID = 'overlay';

    const FontFamily = 'HarmonyOS Sans, PingFang SC, Lantinghei SC, Microsoft YaHei, Arial, sans-serif';
    function submit() {
        setTimeout(() => {
            const cur = currentPlatform$1;
            let button;
            if (cur?.getSubmitButton) {
                button = cur.getSubmitButton();
            }
            else {
                const qButton = currentPlatform$1.selector.submitButton;
                button = document.querySelector(qButton);
            }
            if (button) {
                button.click();
            }
        }, 500);
    }
    function confirmed(text, doSubmit = false) {
        if (!text)
            return;
        const textarea = queryOfficalTextarea();
        if (textarea) {
            if (currentPlatform$1.setText) {
                currentPlatform$1.setText(text);
            }
            else {
                textarea.value = text;
            }
            textarea.focus();
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            if (doSubmit) {
                submit();
            }
        }
        focusOffcialTextarea();
    }
    const url = window.location.href;
    const DefaultMatchPlatformMethod = (url, p) => {
        if (p?.matchUrl) {
            return p.matchUrl(url);
        }
        if (typeof p.baseUrl === 'string' && url.includes(p.baseUrl)) {
            return true;
        }
        else if (Array.isArray(p.baseUrl)) {
            for (let u of p.baseUrl) {
                if (url.includes(u)) {
                    return true;
                }
            }
        }
        return false;
    };
    const toggle = () => {
        for (let p of Platforms) {
            let match = DefaultMatchPlatformMethod(url, p);
            if (match) {
                togglePlatform(p.name);
                return p;
            }
        }
        return null;
    };
    const install = () => {
        const dialog = new TextInputDialog();
        dialog.render(document.body);
        dialog.bindConfirmCallback(confirmed);
        updateStyleSheet(dialog.overlay, 'custom-dialog-style', StyleSheet(FontFamily, currentPlatform$1));
        document.addEventListener('keydown', (event) => {
            if (event.altKey && event.key === 's') {
                event.preventDefault();
                event.stopPropagation();
                dialog.show();
            }
        }, true);
        return dialog;
    };
    const currentPlatform = toggle();
    if (currentPlatform === null) {
        console.warn(`无法匹配当前网页: ${url}`);
    }
    else {
        install();
        const checkInterval = 2000;
        const maxTime = 10000;
        let elapsedTime = 0;
        const intervalId = setInterval(() => {
            elapsedTime += checkInterval;
            const overlay = document.getElementById(TextInputDialog.OVERLAY_ID);
            if (!overlay) {
                console.info('Overlay not found, install again');
                install();
            }
            if (elapsedTime >= maxTime) {
                clearInterval(intervalId);
            }
        }, checkInterval);
    }

})();
//# sourceMappingURL=bundle.user.js.map
