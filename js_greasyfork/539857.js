// ==UserScript==
// @name         NotebookLM shows all citations
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Automatically appends source infomation in NotebookLM
// @author       Bui Quoc Dung
// @match        https://notebooklm.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539857/NotebookLM%20shows%20all%20citations.user.js
// @updateURL https://update.greasyfork.org/scripts/539857/NotebookLM%20shows%20all%20citations.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const SUPPORTED_EXTS = [
        '.pdf', '.txt', '.md', '.markdown', '.mp3', '.docx',
        '.avif', '.bmp', '.gif', '.ico', '.jp2', '.png', '.webp',
        '.tif', '.tiff', '.heic', '.heif', '.jpeg', '.jpg', '.jpe'
    ];

    const isSupportedFile = text => {
    const t = text.trim().toLowerCase();
    return t
      rue;
    };
    const extractFileName = text => {
    return text.trim().replace(/\.(pdf|txt|md|markdown|mp3|docx|avif|bmp|gif|ico|jp2|png|webp|tif|tiff|heic|heif|jpeg|jpg|jpe)$/i, '');
    };

    function getFileFromButton(btn) {
        const span = btn.querySelector('span[aria-label]');
        if (!span) return null;
        const label = span.getAttribute('aria-label') || '';
        const match = label.match(/^(?:\d+: )?(.+)$/i);
        if (match) {
            return extractFileName(match[1]);
        }
        return null;
    }

    async function processCitationButton(button) {
        if (!button.isConnected || button.dataset.processed === "true") return;

        const text = button.textContent.trim();
        if (text === '> <') {
            button.dataset.processed = "true";
            return;
        }

        button.dataset.processing = "true";

        if (text === '...') {
            button.click();
            await delay(1000);

            const parent = button.closest('span')?.parentElement;
            const found = new Set();

            if (parent) {
                const newBtns = Array.from(parent.querySelectorAll('button.citation-marker'))
                    .filter(b => b !== button && !['...', '> <'].includes(b.textContent.trim()));

                for (const b of newBtns) {
                    const name = getFileFromButton(b);
                    if (name) {
                        found.add(name);
                        b.dataset.processed = "true";
                        b.style.display = 'none';
                    }
                }
            }

            if (found.size > 0) {
                const textNode = document.createElement('span');
                textNode.textContent = ` [${Array.from(found).join('][')}]`;
                textNode.style.cssText = "font-style:italic;margin-left:2px;font-size:0.9em;color:#666;";
                if (button.parentNode) button.parentNode.replaceChild(textNode, button);
            } else {
                button.dataset.processed = "true";
            }
            return;
        }

        const fileName = getFileFromButton(button);
        if (fileName) {
            const textNode = document.createElement('span');
            textNode.textContent = ` [${fileName}]`;
            textNode.style.cssText = "font-style:italic;margin-left:2px;font-size:0.9em;color:#666;";
            if (button.parentNode) button.parentNode.replaceChild(textNode, button);
            button.dataset.processed = "true";
        }

        button.dataset.processing = "false";
    }

    async function processCitationsInContainer(container) {
        const buttons = Array.from(container.querySelectorAll('button.citation-marker'))
            .filter(btn => !btn.dataset.processed);

        if (buttons.length === 0) return false;

        for (const btn of buttons) {
            await processCitationButton(btn);
            await delay(50);
        }
        return true;
    }

    function collectAllCitationsInPage() {
        const spans = document.querySelectorAll('span');
        const citations = new Set();
        spans.forEach(span => {
            const match = span.textContent.match(/\[([^\]]+)\]/g);
            if (match) {
                match.forEach(m => {
                    const name = m.replace(/[\[\]]/g, '').trim();
                    if (name) citations.add(name);
                });
            }
        });
        return Array.from(citations).sort().join('\n');
    }

    const BASE_BTN_STYLE = `
        background: none;
        border: none;
        padding: 0 8px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        color: inherit;
        display: flex;
        align-items: center;
    `;

    function createActionButton(text, title, actionFn) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.title = title;
        btn.style.cssText = BASE_BTN_STYLE;

        btn.addEventListener('click', async () => {
            const originalText = btn.textContent;
            try {
                const resultText = await actionFn(btn);
                btn.textContent = resultText || 'Done';
            } catch (e) {
                btn.textContent = 'Err';
                console.error(e);
            }
            setTimeout(() => btn.textContent = originalText, 1500);
        });
        return btn;
    }

    function createToolbar(targetContentElement, wrapperStyle) {
        const wrap = document.createElement('div');
        wrap.style.cssText = wrapperStyle;
        wrap.className = 'notebooklm-custom-buttons-footer';

        const btnConvert = createActionButton('Convert', 'Convert citations in this block', async (btn) => {
            btn.textContent = '...';
            const hasWork = await processCitationsInContainer(targetContentElement);
            return hasWork ? 'Done' : 'None';
        });

        const btnConvertAll = createActionButton('Convert All', 'Convert citations on ENTIRE PAGE', async (btn) => {
            btn.textContent = 'Running...';
            const hasWork = await processCitationsInContainer(document.body);
            return hasWork ? 'Done' : 'None';
        });

        const btnBib = createActionButton('Bibliography', 'Copy citations list', async () => {
            const bibText = collectAllCitationsInPage();
            if (!bibText.trim()) return 'Empty';
            await navigator.clipboard.writeText(bibText);
            return 'Copied';
        });

        wrap.appendChild(btnConvert);
        wrap.appendChild(btnConvertAll);
        wrap.appendChild(btnBib);

        return wrap;
    }

    function addButtonsToChat() {
        const actionContainers = document.querySelectorAll('.mat-mdc-card-actions.message-actions:not([data-buttons-added])');

        actionContainers.forEach(actionContainer => {
            const card = actionContainer.closest('.mat-mdc-card') || actionContainer.closest('mat-card');
            if (!card) return;

            const messageContent = card.querySelector('.message-content')
                                || card.querySelector('.note-editor.note-editor--readonly');
            if (!messageContent) return;

            const wrapperStyle = "display:flex; flex-direction:row; gap:4px; margin-left:auto; align-items:center; border-left:1px solid rgba(0,0,0,0.1); padding-left:8px;";

            const toolbar = createToolbar(messageContent, wrapperStyle);
            actionContainer.appendChild(toolbar);
            actionContainer.dataset.buttonsAdded = "true";
        });
    }

    function addButtonsToReadonlyNotes() {
        const notes = document.querySelectorAll('.note-editor.note-editor--readonly:not([data-buttons-added])');

        notes.forEach(note => {
            const wrapperStyle = "display:flex; flex-direction:row; gap:4px; margin-top:6px; align-items:center; padding-top:6px; border-top:1px solid rgba(0,0,0,0.1);";

            const toolbar = createToolbar(note, wrapperStyle);

            note.insertAdjacentElement('afterend', toolbar);
            note.dataset.buttonsAdded = "true";
        });
    }

    const observer = new MutationObserver(() => {
        setTimeout(() => {
            addButtonsToChat();
            addButtonsToReadonlyNotes();
        }, 200);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        addButtonsToChat();
        addButtonsToReadonlyNotes();
    }, 2000);

})();
