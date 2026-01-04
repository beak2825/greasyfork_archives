// ==UserScript==
// @name         网页链接提取器
// @namespace    https://greasyfork.org/
// @version      0.4
// @description  提取当前网页上的所有超链接及其文本，并支持导出为HTML、JSON格式，支持拖动图标和面板。
// @author       zhangkunsir
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541292/%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541292/%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- UI Elements and Styles ---

    const styles = `
        #link-extractor-modal {
            position: fixed;
            top: 70px;
            right: 10px;
            width: 350px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 10000;
            display: none;
            flex-direction: column;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: sans-serif;
        }
        #link-extractor-header {
            padding: 10px;
            background-color: #f1f1f1;
            border-bottom: 1px solid #ccc;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #link-extractor-header span {
            font-weight: bold;
        }
        #link-extractor-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
        #link-extractor-content {
            padding: 10px;
            flex-grow: 1;
            display: flex;
        }
        #link-extractor-content textarea {
            width: 100%;
            height: 250px;
            resize: vertical;
            border: 1px solid #ddd;
        }
        #link-extractor-actions {
            padding: 10px;
            border-top: 1px solid #ccc;
            background-color: #f1f1f1;
            display: flex;
            justify-content: space-around;
        }
        #link-extractor-actions button {
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            cursor: pointer;
            background-color: #e7e7e7;
        }
        #link-extractor-actions button:hover {
            background-color: #ddd;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 创建圆形图标
    const circleIcon = document.createElement('div');
    circleIcon.style.width = '50px';
    circleIcon.style.height = '50px';
    circleIcon.style.borderRadius = '50%';
    circleIcon.style.backgroundColor = '#4CAF50';
    circleIcon.style.color = 'white';
    circleIcon.style.textAlign = 'center';
    circleIcon.style.lineHeight = '50px';
    circleIcon.style.position = 'fixed';
    circleIcon.style.top = '10px';
    circleIcon.style.right = '10px';
    circleIcon.style.cursor = 'pointer';
    circleIcon.textContent = '🔗';
    circleIcon.style.zIndex = '9999';
    document.body.appendChild(circleIcon);

    // 创建模态框
    const modal = document.createElement('div');
    modal.id = 'link-extractor-modal';
    modal.innerHTML = `
        <div id="link-extractor-header">
            <span>链接提取器</span>
            <button id="link-extractor-close">&times;</button>
        </div>
        <div id="link-extractor-content">
            <textarea id="link-extractor-preview" placeholder="点击图标开始提取..."></textarea>
        </div>
        <div id="link-extractor-actions">
            <button id="download-html-btn">导出HTML</button>
            <button id="download-json-btn">导出JSON</button>
            <button id="copy-csv-btn">复制CSV</button>
        </div>
    `;
    document.body.appendChild(modal);

    const modalPreview = document.getElementById('link-extractor-preview');
    const closeButton = document.getElementById('link-extractor-close');
    const downloadHtmlBtn = document.getElementById('download-html-btn');
    const downloadJsonBtn = document.getElementById('download-json-btn');
    const copyCsvBtn = document.getElementById('copy-csv-btn');
    const modalHeader = document.getElementById('link-extractor-header');

    let extractedLinks = [];

    // --- Helper Functions ---

    function escapeHTML(text) {
        const p = document.createElement('p');
        p.textContent = text;
        return p.innerHTML;
    }

    function generateCSV(links) {
        return links.map(link => `"${link.text.replace(/"/g, '""')}","${link.href}"`).join('\n');
    }

    function generateHTML(links) {
        const pageTitle = escapeHTML(document.title);
        const linksHTML = links.map(link => `            <DT><A HREF="${link.href}">${escapeHTML(link.text)}</A>`).join('\n');
        return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3>从 ${pageTitle} 提取的链接</H3>
    <DL><p>
${linksHTML}
    </DL><p>
</DL><p>`;
    }

    function generateJSON(links) {
        return JSON.stringify(links, null, 2);
    }

    function downloadFile(filename, content, mimeType) {
        const a = document.createElement('a');
        const blob = new Blob([content], {type: mimeType});
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    // --- Event Listeners ---

    circleIcon.addEventListener('click', function() {
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
            return;
        }

        const linkElements = document.querySelectorAll('a');
        extractedLinks = Array.from(linkElements)
            .map(link => {
                let href = link.getAttribute('href');
                if (href) {
                    try {
                        href = new URL(href, document.baseURI).href;
                    } catch (e) {
                        href = null;
                    }
                }
                return {
                    text: link.textContent.trim(),
                    href: href
                };
            })
            .filter(link => link.href && link.text && !link.href.startsWith('javascript:'));

        modalPreview.value = generateCSV(extractedLinks);
        modal.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    downloadHtmlBtn.addEventListener('click', () => {
        const htmlContent = generateHTML(extractedLinks);
        const filename = `links-${document.title.replace(/[\\/:*?"<>|]/g, '_')}.html`;
        downloadFile(filename, htmlContent, 'text/html;charset=utf-8');
    });

    downloadJsonBtn.addEventListener('click', () => {
        const jsonContent = generateJSON(extractedLinks);
        const filename = `links-${document.title.replace(/[\\/:*?"<>|]/g, '_')}.json`;
        downloadFile(filename, jsonContent, 'application/json;charset=utf-8');
    });

    copyCsvBtn.addEventListener('click', () => {
        if (!extractedLinks.length) return;
        navigator.clipboard.writeText(modalPreview.value).then(() => {
            copyCsvBtn.textContent = '已复制!';
            setTimeout(() => { copyCsvBtn.textContent = '复制CSV'; }, 2000);
        }).catch(err => {
            alert('复制失败: ' + err);
        });
    });

    // --- Dragging Logic ---

    let isDragging = false;
    let offsetX, offsetY;
    let isModalDragging = false;
    let modalOffsetX, modalOffsetY;

    circleIcon.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - circleIcon.getBoundingClientRect().left;
        offsetY = e.clientY - circleIcon.getBoundingClientRect().top;
    });

    modalHeader.addEventListener('mousedown', (e) => {
        if (e.target === closeButton) return;
        isModalDragging = true;
        modalOffsetX = e.clientX - modal.getBoundingClientRect().left;
        modalOffsetY = e.clientY - modal.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            circleIcon.style.left = `${e.clientX - offsetX}px`;
            circleIcon.style.top = `${e.clientY - offsetY}px`;
        }
        if (isModalDragging) {
            modal.style.left = `${e.clientX - modalOffsetX}px`;
            modal.style.top = `${e.clientY - modalOffsetY}px`;
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        isModalDragging = false;
        document.body.style.userSelect = '';
    });
})();