// ==UserScript==
// @name         ChatGPT对话Markdown导出
// @name:en       ChatGPT to Markdown Exporter
// @version      1.2
// @description  导出ChatGPT和Grok网站上的对话为Markdown格式.
// @description:en  Export chat history from ChatGPT and Grok websites to Markdown format.
// @author       ChingyuanCheng //origin from: Marverlises
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://*.openai.com/*
// @match        https://grok.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1435416
// @downloadURL https://update.greasyfork.org/scripts/529601/ChatGPT%E5%AF%B9%E8%AF%9DMarkdown%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/529601/ChatGPT%E5%AF%B9%E8%AF%9DMarkdown%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    // Select chat elements based on the website
    function getConversationElements() {
        const currentUrl = window.location.href;
        if (currentUrl.includes("openai.com") || currentUrl.includes("chatgpt.com")) {
            return document.querySelectorAll('div.flex.flex-grow.flex-col.max-w-full');
        } else if (currentUrl.includes("grok.com")) {
            return document.querySelectorAll('div.message-bubble');
        }
        return [];
    }

    // Convert HTML to Markdown
    function htmlToMarkdown(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Handle formulas
        doc.querySelectorAll('span.katex-html').forEach(element => element.remove());
        doc.querySelectorAll('mrow').forEach(mrow => mrow.remove());
        doc.querySelectorAll('annotation[encoding="application/x-tex"]').forEach(element => {
            if (element.closest('.katex-display')) {
                const latex = element.textContent;
                element.replaceWith(`\n$$\n${latex}\n$$\n`);
            } else {
                const latex = element.textContent;
                element.replaceWith(`$${latex}$`);
            }
        });

        // Bold text
        doc.querySelectorAll('strong, b').forEach(bold => {
            bold.parentNode.replaceChild(document.createTextNode(`**${bold.textContent}**`), bold);
        });

        // Italic text
        doc.querySelectorAll('em, i').forEach(italic => {
            italic.parentNode.replaceChild(document.createTextNode(`*${italic.textContent}*`), italic);
        });

        // Inline code
        doc.querySelectorAll('p code').forEach(code => {
            code.parentNode.replaceChild(document.createTextNode(`\`${code.textContent}\``), code);
        });

        // Links
        doc.querySelectorAll('a').forEach(link => {
            link.parentNode.replaceChild(document.createTextNode(`[${link.textContent}](${link.href})`), link);
        });

        // Images
        doc.querySelectorAll('img').forEach(img => {
            img.parentNode.replaceChild(document.createTextNode(`![${img.alt}](${img.src})`), img);
        });

        // Code blocks
        doc.querySelectorAll('pre').forEach(pre => {
            const codeType = pre.querySelector('div > div:first-child')?.textContent || '';
            const markdownCode = pre.querySelector('div > div:nth-child(3) > code')?.textContent || pre.textContent;
            pre.innerHTML = `\n\`\`\`${codeType}\n${markdownCode}\`\`\`\n`;
        });

        // Unordered lists
        doc.querySelectorAll('ul').forEach(ul => {
            let markdown = '';
            ul.querySelectorAll(':scope > li').forEach(li => {
                markdown += `- ${li.textContent.trim()}\n`;
            });
            ul.parentNode.replaceChild(document.createTextNode('\n' + markdown.trim()), ul);
        });

        // Ordered lists
        doc.querySelectorAll('ol').forEach(ol => {
            let markdown = '';
            ol.querySelectorAll(':scope > li').forEach((li, index) => {
                markdown += `${index + 1}. ${li.textContent.trim()}\n`;
            });
            ol.parentNode.replaceChild(document.createTextNode('\n' + markdown.trim()), ol);
        });

        // Headers
        for (let i = 1; i <= 6; i++) {
            doc.querySelectorAll(`h${i}`).forEach(header => {
                header.parentNode.replaceChild(document.createTextNode('\n' + `${'#'.repeat(i)} ${header.textContent}\n`), header);
            });
        }

        // Paragraphs
        doc.querySelectorAll('p').forEach(p => {
            p.parentNode.replaceChild(document.createTextNode('\n' + p.textContent + '\n'), p);
        });

        // Tables
        doc.querySelectorAll('table').forEach(table => {
            let markdown = '';
            table.querySelectorAll('thead tr').forEach(tr => {
                tr.querySelectorAll('th').forEach(th => {
                    markdown += `| ${th.textContent} `;
                });
                markdown += '|\n';
                tr.querySelectorAll('th').forEach(() => {
                    markdown += '| ---- ';
                });
                markdown += '|\n';
            });
            table.querySelectorAll('tbody tr').forEach(tr => {
                tr.querySelectorAll('td').forEach(td => {
                    markdown += `| ${td.textContent} `;
                });
                markdown += '|\n';
            });
            table.parentNode.replaceChild(document.createTextNode('\n' + markdown.trim() + '\n'), table);
        });

        let markdown = doc.body.innerHTML.replace(/<[^>]*>/g, '');
        markdown = markdown.replaceAll(/- &gt;/g, '- $\\gt$')
                          .replaceAll(/>/g, '>')
                          .replaceAll(/</g, '<')
                          .replaceAll(/≥/g, '>=')
                          .replaceAll(/≤/g, '<=')
                          .replaceAll(/≠/g, '\\neq');
        return markdown.trim();
    }

    // Download content as a file
    function download(data, filename, type) {
        const file = new Blob([data], { type: type });
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    // Show export modal with Markdown content
    function showExportModal() {
        let markdownContent = "";
        const allElements = getConversationElements();

        for (let i = 0; i < allElements.length; i += 2) {
            if (!allElements[i + 1]) break;
            let userText = allElements[i].textContent.trim();
            let answerHtml = allElements[i + 1].innerHTML.trim();

            userText = htmlToMarkdown(userText);
            answerHtml = htmlToMarkdown(answerHtml);

            const isGrok = window.location.href.includes("grok.com");
            markdownContent += `\n# User Question\n${userText}\n# ${isGrok ? 'Grok' : 'ChatGPT'}\n${answerHtml}`;
        }
        markdownContent = markdownContent.replace(/&amp;/g, '&');

        if (!markdownContent) {
            alert("No conversation content found.");
            return;
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'markdown-modal';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000'
        });

        const modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            backgroundColor: '#fff',
            color: '#000',
            padding: '20px',
            borderRadius: '8px',
            width: '50%',
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        });

        const textarea = document.createElement('textarea');
        textarea.value = markdownContent;
        Object.assign(textarea.style, {
            flex: '1',
            resize: 'none',
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginBottom: '10px',
            boxSizing: 'border-box',
            color: '#000',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ccc',
            borderRadius: '4px'
        });
        textarea.setAttribute('readonly', true);

        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex',
            justifyContent: 'flex-end'
        });

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        Object.assign(copyButton.style, {
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#28A745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            marginRight: '10px'
        });

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        Object.assign(downloadButton.style, {
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            marginRight: '10px'
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        Object.assign(closeButton.style, {
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#DC3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
        });

        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(closeButton);
        modalContent.appendChild(textarea);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Event listeners for buttons
        copyButton.addEventListener('click', () => {
            textarea.select();
            navigator.clipboard.writeText(textarea.value)
                .then(() => {
                    copyButton.textContent = 'Copied';
                    setTimeout(() => copyButton.textContent = 'Copy', 2000);
                })
                .catch(err => console.error('Copy failed', err));
        });

        downloadButton.addEventListener('click', () => {
            download(markdownContent, 'chat-export.md', 'text/markdown');
        });

        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Close modal with Escape key or click outside
        const escListener = (e) => {
            if (e.key === 'Escape' && document.getElementById('markdown-modal')) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escListener);
            }
        };
        document.addEventListener('keydown', escListener);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escListener);
            }
        });
    }

    // Create the export button on the page
    function createExportButton() {
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export Chat';
        exportButton.id = 'export-chat';
        const styles = {
            position: 'fixed',
            height: '36px',
            top: '10px',
            right: '35%',
            zIndex: '10000',
            padding: '10px',
            backgroundColor: '#000000',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            textAlign: 'center',
            lineHeight: '16px'
        };
        Object.assign(exportButton.style, styles);
        document.body.appendChild(exportButton);
        exportButton.addEventListener('click', showExportModal);
    }

    // Initialize button and periodically check its presence
    createExportButton();
    setInterval(() => {
        if (!document.getElementById('export-chat')) {
            createExportButton();
        }
    }, 1000);
})();