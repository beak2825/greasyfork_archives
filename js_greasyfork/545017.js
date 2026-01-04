// ==UserScript==
// @name         AI Chat to Microsoft Word & Markdown
// @namespace    https://greasyfork.org/
// @version      2.0
// @description  Export AI answers as Word, Markdown or Copy to Clipboard. Applied for ChatGPT, Gemini, Aistudio, Notebooklm, Grok, Claude, Mistral, Perplexity, Scienceos, Evidencehunt.
// @author       Bui Quoc Dung
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @match        https://notebooklm.google.com/*
// @match        https://grok.com/*
// @match        https://claude.ai/*
// @match        https://chat.mistral.ai/*
// @match        https://www.perplexity.ai/*
// @match        https://app.scienceos.ai/*
// @match        https://evidencehunt.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.min.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @downloadURL https://update.greasyfork.org/scripts/545017/AI%20Chat%20to%20Microsoft%20Word%20%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/545017/AI%20Chat%20to%20Microsoft%20Word%20%20Markdown.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let sanitizer = { createHTML: (s) => s, createScriptURL: (s) => s };
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            sanitizer = window.trustedTypes.createPolicy('ai_exporter_policy', {
                createHTML: (string) => string,
                createScriptURL: (string) => string
            });
        } catch (e) {}
    }

    const COMMON_CONTAINER_STYLE = {
        marginTop: '10px',
        marginBottom: '10px',
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap',
        clear: 'both',
        justifyContent: 'flex-end',
        width: '100%'
    };

    const SITE_CONFIGS = {
        chatgpt: {
            domain: 'chatgpt.com',
            user: 'div[data-message-author-role="user"]',
            ai_response: 'div[data-message-author-role="assistant"]',
            attach_to: '.markdown'
        },
        gemini: {
            domain: 'gemini.google.com',
            user: '.query-text',
            ai_response: '.model-response-text',
            attach_to: null
        },
        aistudio: {
            domain: 'aistudio.google.com',
            user: '.user-prompt-container .text-chunk.ng-star-inserted',
            ai_response: '.model-prompt-container .text-chunk.ng-star-inserted',
            attach_to: null
        },
        notebooklm: {
            domain: 'notebooklm.google.com',
            user: 'chat-message .from-user-container',
            ai_response: 'chat-message .to-user-container',
            attach_to: ':last-child'
        },
        grok: {
            domain: 'grok.com',
            user: '.relative.group.flex.flex-col.justify-center.items-end',
            ai_response: '.relative.group.flex.flex-col.justify-center.items-start',
            attach_to: null
        },
        claude: {
            domain: 'claude.ai',
            user: 'div.group.relative.inline-flex',
            ai_response: '.group.relative.pb-3',
            attach_to: null
        },
        mistral: {
            domain: 'chat.mistral.ai',
            user: 'div[data-message-author-role="user"] div[dir="auto"]',
            ai_response: 'div[data-message-author-role="assistant"] div[data-message-part-type="answer"]',
            attach_to: null
        },
        perplexity: {
            domain: 'www.perplexity.ai',
            user: 'div.group\\/title',
            ai_response: '.leading-relaxed.break-words.min-w-0',
            attach_to: null
        },
        scienceos: {
            domain: 'app.scienceos.ai',
            user: 'div[data-prompt]',
            ai_response: '.tailwind',
            attach_to: null
        },
        evidencehunt: {
            domain: 'evidencehunt.com',
            user: '.chat__message:has(.message__user-image) .message__content p',
            ai_response: '.chat__message:has(.message__eh-image) .message__content',
            attach_to: null
        },
    };

    const CONFIG = (function() {
        const hostname = window.location.hostname;
        for (const key in SITE_CONFIGS) {
            if (hostname.includes(SITE_CONFIGS[key].domain)) return SITE_CONFIGS[key];
        }
        return null;
    })();

    if (!CONFIG) return;

    const INJECTED_CLASS = 'ai-exporter-btn-wrapper';
    const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    turndownService.keep(['table', 'tr', 'td', 'th', 'tbody', 'thead']);

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            marginLeft: '8px',
            padding: '2px 10px',
            fontSize: '13px',
            lineHeight: '20px',
            borderRadius: '12px',
            border: '1px solid #dadce0',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
            transition: 'all 0.1s',
            color: 'currentColor'
        });

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(e);
        };
        return btn;
    }

    function cleanNode(element) {
        const clone = element.cloneNode(true);
        clone.querySelectorAll(`.${INJECTED_CLASS}, button, .copy-button, [aria-label*="Copy"], .not-export`).forEach(el => el.remove());
        return clone;
    }

    function download(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = sanitizer.createScriptURL ? sanitizer.createScriptURL(url) : url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportWord(element, filename) {
        const cleaned = cleanNode(element);
        const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
            body { font-family: sans-serif; line-height: 1.5; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 5px; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
            h1 { font-size: 20px; font-weight: bold; color: #2d3748; margin-top: 20px; }
        </style></head><body>${cleaned.innerHTML}</body></html>`;

        try {
            const blob = window.htmlDocx.asBlob(fullHtml);
            download(blob, filename + '.docx');
        } catch (e) { console.error(e); }
    }

    function exportMarkdown(element, filename) {
        try {
            const cleaned = cleanNode(element);
            const markdown = turndownService.turndown(cleaned);
            const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
            download(blob, filename + '.md');
        } catch (e) { console.error(e); }
    }

    async function copyContent(element, btn) {
        try {
            const cleaned = cleanNode(element);
            const blobHtml = new Blob([cleaned.innerHTML], { type: 'text/html' });
            const blobText = new Blob([cleaned.innerText], { type: 'text/plain' });
            const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];
            await navigator.clipboard.write(data);
            const original = btn.textContent;
            btn.textContent = 'Copied';
            setTimeout(() => btn.textContent = original, 2000);
        } catch (e) { console.error(e); }
    }

    async function copyMarkdownToClipboard(element, btn) {
        try {
            const cleaned = cleanNode(element);
            const markdown = turndownService.turndown(cleaned);
            await navigator.clipboard.writeText(markdown);
            const original = btn.textContent;
            btn.textContent = 'Copied';
            setTimeout(() => btn.textContent = original, 2000);
        } catch (e) { console.error(e); }
    }


    function getCombinedNode() {
        const container = document.createElement('div');
        const selectors = [CONFIG.ai_response, CONFIG.user].join(',');
        const nodes = Array.from(document.querySelectorAll(selectors))
            .sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);

        nodes.forEach(node => {
            const isUser = node.matches(CONFIG.user);
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '20px';

            if (isUser) {
                const h1 = document.createElement('h1');
                h1.textContent = node.innerText.trim();
                h1.style.cssText = 'font-size: 16pt; font-family: sans-serif; font-weight: bold; margin-bottom: 10px; color: #000;';
                wrapper.appendChild(h1);
            } else {
                wrapper.appendChild(cleanNode(node));
            }
            container.appendChild(wrapper);
        });
        return container;
    }

    function inject() {
        const answers = document.querySelectorAll(CONFIG.ai_response);
        answers.forEach((answer, index) => {
            if (answer.querySelector(`.${INJECTED_CLASS}`)) return;

            let targetContainer = answer;
            if (CONFIG.attach_to) {
                if (CONFIG.attach_to === ':last-child') {
                    if (answer.lastElementChild) targetContainer = answer.lastElementChild;
                } else {
                    const inner = answer.querySelector(CONFIG.attach_to);
                    if (inner) targetContainer = inner;
                }
            }

            const container = document.createElement('div');
            container.className = INJECTED_CLASS;
            Object.assign(container.style, COMMON_CONTAINER_STYLE);

            const name = `Response-${index + 1}`;

            container.appendChild(createButton('Docx', () => exportWord(answer, name)));
            container.appendChild(createButton('MD', () => exportMarkdown(answer, name)));
            container.appendChild(createButton('Copy (Word)', (e) => copyContent(answer, e.target)));
            container.appendChild(createButton('Copy (MD)', (e) => copyMarkdownToClipboard(answer, e.target)));

            targetContainer.appendChild(container);

            if (index === answers.length - 1) {
                if (!container.querySelector('.sep-all')) {
                    const sep = document.createElement('div');
                    sep.className = 'sep-all';
                    sep.style.cssText = 'width:1px; background:#e5e7eb; margin:0 4px';
                    container.appendChild(sep);

                    container.appendChild(createButton('Docx All', () => exportWord(getCombinedNode(), 'Full-Chat')));
                    container.appendChild(createButton('MD All', () => exportMarkdown(getCombinedNode(), 'Full-Chat')));
                }
            }
        });
    }

    const observer = new MutationObserver(() => inject());
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(inject, 2000);

})();