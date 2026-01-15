// ==UserScript==
// @name         AI Chat to Microsoft Word, Markdown, Html, Pdf, Json, Txt
// @namespace    https://greasyfork.org/
// @version      2.8
// @description  Export AI answers with multiple formats. Applied for ChatGPT, Gemini, Aistudio, Notebooklm, Grok, Claude, Mistral, Perplexity, Deepseek, Kimi, Scienceos, Evidencehunt, Spacefrontiers.
// @author       Bui Quoc Dung
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @match        https://notebooklm.google.com/*
// @match        https://grok.com/*
// @match        https://claude.ai/*
// @match        https://chat.mistral.ai/*
// @match        https://www.perplexity.ai/*
// @match        https://chat.deepseek.com/*
// @match        https://www.kimi.com/*
// @match        https://app.scienceos.ai/*
// @match        https://evidencehunt.com/*
// @match        https://spacefrontiers.org/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.min.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @require      https://cdn.jsdelivr.net/npm/he@1.2.0/he.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/545017/AI%20Chat%20to%20Microsoft%20Word%2C%20Markdown%2C%20Html%2C%20Pdf%2C%20Json%2C%20Txt.user.js
// @updateURL https://update.greasyfork.org/scripts/545017/AI%20Chat%20to%20Microsoft%20Word%2C%20Markdown%2C%20Html%2C%20Pdf%2C%20Json%2C%20Txt.meta.js
// ==/UserScript==

(function () {
    'use strict';

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
            attach_to: '.markdown',
            siteName: 'ChatGPT',
            nameSelector: 'a[data-active] .truncate'
        },
        gemini: {
            domain: 'gemini.google.com',
            user: '.query-text',
            ai_response: '.model-response-text',
            attach_to: null,
            siteName: 'Gemini',
            nameSelector: '.conversation-title.gds-title-m'
        },
        aistudio: {
            domain: 'aistudio.google.com',
            user: '.user-prompt-container .text-chunk.ng-star-inserted',
            ai_response: '.model-prompt-container .text-chunk.ng-star-inserted',
            attach_to: null,
            siteName: 'AIStudio',
            nameSelector: 'h1.actions.mode-title, h1.actions.v3-font-headline-2'
        },
        notebooklm: {
            domain: 'notebooklm.google.com',
            user: 'chat-message .from-user-container',
            ai_response: 'chat-message .to-user-container',
            attach_to: ':last-child',
            siteName: 'NotebookLM',
            nameSelector: '.title-container.ng-star-inserted'
        },
        grok: {
            domain: 'grok.com',
            user: '.relative.group.flex.flex-col.justify-center.items-end',
            ai_response: '.relative.group.flex.flex-col.justify-center.items-start',
            attach_to: null,
            siteName: 'Grok',
            nameSelector: 'a.border-border-l1 span'
        },
        claude: {
            domain: 'claude.ai',
            user: 'div.group.relative.inline-flex',
            ai_response: '.group.relative.pb-3',
            attach_to: null,
            siteName: 'Claude',
            nameSelector: '.truncate.font-base-bold'
        },
        mistral: {
            domain: 'chat.mistral.ai',
            user: 'div[data-message-author-role="user"] div[dir="auto"]',
            ai_response: 'div[data-message-author-role="assistant"] div[data-message-part-type="answer"]',
            attach_to: null,
            siteName: 'Mistral',
            nameSelector: 'a[data-active="true"] .block'
        },
        perplexity: {
            domain: 'www.perplexity.ai',
            user: 'div.group\\/title',
            ai_response: '.leading-relaxed.break-words.min-w-0',
            attach_to: null,
            siteName: 'Perplexity',
            nameSelector: 'title'
        },
        deepseek: {
            domain: 'chat.deepseek.com',
            user: '._9663006 .fbb737a4',
            ai_response: '._43c05b5',
            attach_to: null,
            siteName: 'Deepseek',
            nameSelector: '.afa34042.e37a04e4.e0a1edb7'
        },
        kimi: {
            domain: 'www.kimi.com',
            user: '.user-content',
            ai_response: '.markdown-container',
            attach_to: null,
            siteName: 'Kimi',
            nameSelector: '.chat-header-content'
        },
        scienceos: {
            domain: 'app.scienceos.ai',
            user: 'div[data-prompt]',
            ai_response: '.tailwind',
            attach_to: null,
            siteName: 'ScienceOS',
            nameSelector: 'header'
        },
        evidencehunt: {
            domain: 'evidencehunt.com',
            user: '.chat__message:has(.message__user-image) .message__content p',
            ai_response: '.chat__message:has(.message__eh-image) .message__content',
            attach_to: null,
            siteName: 'EvidenceHunt',
            nameSelector: 'button.bg-primary-lighten-1 .chip-button__text'
        },
        spacefrontiers: {
            domain: 'spacefrontiers.org',
            user: '.inline.whitespace-pre-line',
            ai_response: '.citation-processed-content',
            attach_to: null,
            siteName: 'SpaceFrontiers',
            nameSelector: 'h1.whitespace-pre-line'
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

    function getConversationName() {
        if (!CONFIG.nameSelector) return '';

        const nameElement = document.querySelector(CONFIG.nameSelector);
        if (nameElement) {
            let name = nameElement.textContent.trim();
            name = name.replace(/[<>:"/\\|?*]/g, '-');
            if (name.length > 50) {
                name = name.substring(0, 50);
            }
            return name;
        }
        return '';
    }

    function generateFileName(baseName, index = null) {
        const timestamp = getTimestamp();
        const siteName = CONFIG.siteName;
        const conversationName = getConversationName();

        let fileName = siteName;
        if (conversationName) {
            fileName += `-${conversationName}`;
        }
        if (index !== null) {
            fileName += `-Response-${index}`;
        } else {
            fileName += `-Full-Chat`;
        }
        fileName += `-${timestamp}`;
        return fileName;
    }

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
            color: 'CanvasText'
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
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function getTimestamp() {
        const now = new Date();
        return now.toISOString().slice(0, 19).replace(/:/g, '-');
    }

    const Exporters = {
        html: (el, name) => {
            const cleaned = cleanNode(el);
            const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
                body { font-family: sans-serif; line-height: 1.5; padding: 20px; max-width: 900px; margin: auto; }
                table { border-collapse: collapse; width: 100%; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
            </style></head><body>${cleaned.innerHTML}</body></html>`;
            download(new Blob([fullHtml], { type: 'text/html;charset=utf-8' }), name + '.html');
        },
        json: (nodes, name) => {
            const isArray = Array.isArray(nodes);
            const nodeList = isArray ? nodes : [nodes];
            const data = nodeList.map(n => ({
                role: n.matches(CONFIG.user) ? 'user' : 'assistant',
                content: window.he ? window.he.decode(cleanNode(n).innerText.trim()) : cleanNode(n).innerText.trim()
            }));
            download(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), name + '.json');
        },
        text: (el, name) => {
            const text = window.he ? window.he.decode(cleanNode(el).innerText.trim()) : cleanNode(el).innerText.trim();
            download(new Blob([text], { type: 'text/plain;charset=utf-8' }), name + '.txt');
        }
    };

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

    async function exportPDF(element, filename, btn) {
        try {
            const original = btn ? btn.textContent : '';
            if (btn) {
                btn.textContent = 'Wait...';
                btn.disabled = true;
            }

            await new Promise(resolve => setTimeout(resolve, 50));

            const cleaned = cleanNode(element);
            const container = document.createElement('div');
            container.style.cssText = `
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 1.6;
                padding: 20px;
                max-width: 800px;
                color: #000;
                background: #fff;
            `;
            container.appendChild(cleaned);

            container.style.position = 'absolute';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            const canvas = await window.html2canvas(container, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: 800,
                backgroundColor: '#ffffff'
            });

            document.body.removeChild(container);

            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 20);

            while (heightLeft > 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
                heightLeft -= (pdfHeight - 20);
            }

            pdf.save(filename + '.pdf');

            if (btn) {
                btn.textContent = 'Done!';
                btn.disabled = false;
                setTimeout(() => btn.textContent = original, 2000);
            }
        } catch (e) {
            console.error('PDF export error:', e);
            if (btn) {
                btn.textContent = 'Error!';
                btn.disabled = false;
                setTimeout(() => btn.textContent = original, 2000);
            }
        }
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

    function getCombinedNodes() {
        const selectors = [CONFIG.ai_response, CONFIG.user].join(',');
        return Array.from(document.querySelectorAll(selectors))
            .sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    }

    function getCombinedHTML() {
        const container = document.createElement('div');
        const nodes = getCombinedNodes();
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

            const name = generateFileName(null, index + 1);
            const nameAll = generateFileName(null, null);

            container.appendChild(createButton('Docx', () => exportWord(answer, name)));
            container.appendChild(createButton('Md', () => exportMarkdown(answer, name)));
            container.appendChild(createButton('Html', () => Exporters.html(answer, name)));
            container.appendChild(createButton('Pdf', (e) => exportPDF(answer, name, e.target)));
            container.appendChild(createButton('Json', () => Exporters.json(answer, name)));
            container.appendChild(createButton('Txt', () => Exporters.text(answer, name)));
            container.appendChild(createButton('Copy (Word)', (e) => copyContent(answer, e.target)));
            container.appendChild(createButton('Copy (Md)', (e) => copyMarkdownToClipboard(answer, e.target)));

            targetContainer.appendChild(container);

            if (index === answers.length - 1) {
                const allContainer = document.createElement('div');
                allContainer.className = INJECTED_CLASS + '-all';
                Object.assign(allContainer.style, COMMON_CONTAINER_STYLE);

                allContainer.appendChild(createButton('Docx All', () => exportWord(getCombinedHTML(), nameAll)));
                allContainer.appendChild(createButton('Md All', () => exportMarkdown(getCombinedHTML(), nameAll)));
                allContainer.appendChild(createButton('Html All', () => Exporters.html(getCombinedHTML(), nameAll)));
                allContainer.appendChild(createButton('Pdf All', (e) => exportPDF(getCombinedHTML(), nameAll, e.target)));
                allContainer.appendChild(createButton('Json All', () => Exporters.json(getCombinedNodes(), nameAll)));
                allContainer.appendChild(createButton('Txt All', () => Exporters.text(getCombinedHTML(), nameAll)));

                targetContainer.appendChild(allContainer);
            }
        });
    }

    const observer = new MutationObserver(() => inject());
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(inject, 2000);

})();