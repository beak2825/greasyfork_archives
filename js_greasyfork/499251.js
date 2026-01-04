// ==UserScript==
// @name         Artifacts For Poe
// @namespace    http://tampermonkey.net/
// @version      2024-06-29
// @description  Add preview, download, and new window functionality for code blocks on Poe.com, inspired by Anthropic's Artifacts feature.
// @author       teezzz20
// @license      MIT
// @match        https://poe.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/499251/Artifacts%20For%20Poe.user.js
// @updateURL https://update.greasyfork.org/scripts/499251/Artifacts%20For%20Poe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .code-header-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 6px;
            margin-left: auto;
        }
        .artifact-button {
            background: transparent;
            display: flex;
            flex-direction: row;
            border: none;
            gap: 6px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-weight: 450;
            font-size: inherit;
            text-align: center;
            padding: .6em 1rem;
            margin: 0;
            border-radius: 1.5em;
        }
        .artifact-button:hover {
            background-image: linear-gradient(rgb(255 255 255/8%) 0 0);
        }
        .preview-iframe {
            width: 100%;
            height: 80vh;
            border: 1px solid #ccc;
            margin-top: 10px;
        }
    `);

    function createButton(text, svgPath) {
        const button = document.createElement('button');
        button.className = 'artifact-button';
        button.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="${svgPath}"></path></svg> ${text}`;
        return button;
    }

    async function getClipboardContent() {
        try {
            return await navigator.clipboard.readText();
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    }

    async function togglePreview(codeHeader, previewButton) {
        const copyButton = codeHeader.querySelector('[class*="MarkdownCodeBlock_copyButton"]');
        const codeBlockWrapper = codeHeader.parentElement;
        const preTag = codeBlockWrapper.querySelector('pre[class*="MarkdownCodeBlock_preTag"]');

        if (!preTag) {
            console.error('Pre tag not found');
            return;
        }

        if (previewButton.textContent.includes('Preview')) {
            copyButton.click();
            await new Promise(resolve => setTimeout(resolve, 100));
            const code = await getClipboardContent();

            if (code) {
                const iframe = document.createElement('iframe');
                iframe.className = 'preview-iframe';
                iframe.srcdoc = code;
                codeBlockWrapper.insertBefore(iframe, preTag.nextSibling);
                iframe.onload = function() {
                    this.style.height = this.contentWindow.document.body.scrollHeight + 'px';
                };
                previewButton.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></svg> Code';
                preTag.style.display = 'none';
            }
        } else {
            const iframe = codeBlockWrapper.querySelector('.preview-iframe');
            if (iframe) iframe.remove();
            previewButton.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg> Preview';
            preTag.style.display = 'block';
        }
    }

    function detectFileTypeAndName(code) {
        const fileTypes = [
            { type: 'html', ext: 'html', detect: (code) => /<html|<!DOCTYPE html>/i.test(code) },
            { type: 'css', ext: 'css', detect: (code) => /^\s*(\.|#|[a-z])[^{]+\{/im.test(code) },
            { type: 'javascript', ext: 'js', detect: (code) => /function|const|let|var|=>/i.test(code) },
            { type: 'python', ext: 'py', detect: (code) => /def|class|import|from|if __name__ == ['"]__main__['"]:/i.test(code) },
            { type: 'svg', ext: 'svg', detect: (code) => /<svg/i.test(code) },
        ];

        for (const { type, ext, detect } of fileTypes) {
            if (detect(code)) {
                return { name: `code.${ext}`, type };
            }
        }

        return { name: 'code.txt', type: 'text' };
    }

    function downloadCode(code) {
        const { name, type } = detectFileTypeAndName(code);
        const blob = new Blob([code], { type: `text/${type}` });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function openInNewWindow(code) {
        const newWindow = window.open('', '_blank');
        newWindow.document.write(code);
        newWindow.document.close();
    }

    function observeNewCodeBlocks() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const codeHeader = node.querySelector('[class*="MarkdownCodeBlock_codeHeader"]');
                            if (codeHeader && !codeHeader.querySelector('.artifact-button')) {
                                const buttonContainer = document.createElement('div');
                                buttonContainer.className = 'code-header-buttons';

                                const previewButton = createButton('Preview', 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z');
                                const downloadButton = createButton('Download', 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z');
                                const newWindowButton = createButton('New Window', 'M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z');

                                buttonContainer.appendChild(downloadButton);
                                buttonContainer.appendChild(newWindowButton);
                                buttonContainer.appendChild(previewButton);

                                codeHeader.appendChild(buttonContainer);

                                previewButton.addEventListener('click', () => togglePreview(codeHeader, previewButton));
                                downloadButton.addEventListener('click', async () => {
                                    const copyButton = codeHeader.querySelector('[class*="MarkdownCodeBlock_copyButton"]');
                                    copyButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 100));
                                    const code = await getClipboardContent();
                                    if (code) downloadCode(code);
                                });
                                newWindowButton.addEventListener('click', async () => {
                                    const copyButton = codeHeader.querySelector('[class*="MarkdownCodeBlock_copyButton"]');
                                    copyButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 100));
                                    const code = await getClipboardContent();
                                    if (code) openInNewWindow(code);
                                });
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start observing
    observeNewCodeBlocks();
})();