// ==UserScript==
// @name              Fanqie Novel Free Reading
// @namespace         https://github.com/SmashPhoenix272
// @version           6.0.1
// @description       番茄小说免费网页阅读 不用客户端 可下载小说
// @description:zh-cn 番茄小说免费网页阅读 不用客户端 可下载小说
// @description:en    Fanqie Novel Reading, No Need for a Client, Novels Available for Download
// @author            ibxff, SmashPhoenix272
// @license           MIT License
// @match             https://fanqienovel.com/*
// @require           https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @icon              data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0zNS40Mjg2IDQuODg0MzVDMzkuNjQ2MyA0Ljg4NDM1IDQzLjA4MTYgOC4zMTk3MyA0My4wODE2IDEyLjUzNzRWMzUuNDI4NkM0My4wODE2IDM5LjY0NjMgMzkuNjQ2MyA0My4wODE2IDM1LjQyODYgNDMuMDgxNkgxMi41Mzc0QzguMzE5NzMgNDMuMDgxNiA0Ljg4NDM1IDM5LjY0NjMgNC44ODQzNSAzNS40Mjg2VjEyLjUzNzRDNC44ODQzNSA4LjMxOTczIDguMzE5NzMgNC44ODQzNSAxMi41Mzc0IDQuODg0MzVIMzUuNDI4NlpNMzUuNDI4NiA0SDEyLjUzNzRDNy44MDk1MiA0IDQgNy44MDk1MiA0IDEyLjUzNzRWMzUuNDI4NkM0IDQwLjE1NjUgNy44MDk1MiA0My45NjYgMTIuNTM3NCA0My45NjZIMzUuNDI4NkM0MC4xNTY1IDQzLjk2NiA0My45NjYgNDAuMTU2NSA0My45NjYgMzUuNDI4NlYxMi41Mzc0QzQ0IDcuODA5NTIgNDAuMTU2NSA0IDM1LjQyODYgNFoiIGZpbGw9IiMzMzMiLz48cGF0aCBkPSJNMjkuMTAxNiA0VjEyLjQwMTRMMzIuMzMyOSAxMC41NjQ2TDM1LjU2NDEgMTIuNDAxNFY0SDI5LjEwMTZaIiBmaWxsPSIjMzMzIi8+PHBhdGggZD0iTTI0LjAzNCAxOC4yODU4QzE1LjgzNjcgMTguMjg1OCA4LjU1NzgyIDIxLjg1NzIgNCAyNy4zNjc0VjM1LjQyODZDNCA0MC4xNTY1IDcuODA5NTIgNDMuOTY2IDEyLjUzNzQgNDMuOTY2SDM1LjQyODZDNDAuMTU2NSA0My45NjYgNDMuOTY2IDQwLjE1NjUgNDMuOTY2IDM1LjQyODZWMjcuMjY1NEMzOS40MDgyIDIxLjc4OTIgMzIuMTk3MyAxOC4yODU4IDI0LjAzNCAxOC4yODU4Wk0xNC42MTIyIDM3LjY3MzVDMTMuMTE1NiAzNy42NzM1IDEyLjQwMTQgMzcuMTI5MyAxMi40MDE0IDM2LjQxNUMxMi40MDE0IDM1LjcwMDcgMTMuMDgxNiAzNS4xMjI1IDE0LjU3ODIgMzUuMTIyNUMxNi4wNzQ4IDM1LjEyMjUgMTcuODc3NiAzNi4zODEgMTcuODc3NiAzNi4zODFDMTcuODc3NiAzNi4zODEgMTYuMTA4OCAzNy42NzM1IDE0LjYxMjIgMzcuNjczNVpNMTUuODM2NyAzMS4yMTA5QzE0Ljc0ODMgMzAuMTU2NSAxNC42NDYzIDI5LjI3MjIgMTUuMTU2NSAyOC43NjJDMTUuNjY2NyAyOC4yNTE4IDE2LjU1MSAyOC4zMTk4IDE3LjYzOTUgMjkuNDA4MkMxOC43Mjc5IDMwLjQ2MjYgMTkuMDY4IDMyLjYwNTUgMTkuMDY4IDMyLjYwNTVDMTkuMDY4IDMyLjYwNTUgMTYuODkxMiAzMi4yNjU0IDE1LjgzNjcgMzEuMjEwOVpNMjQuMDM0IDMwLjQ2MjZDMjQuMDM0IDMwLjQ2MjYgMjIuNzQxNSAyOC43Mjc5IDIyLjcwNzUgMjcuMTk3M0MyMi43MDc1IDI1LjcwMDcgMjMuMjUxNyAyNC45ODY0IDIzLjk2NiAyNC45ODY0QzI0LjY4MDMgMjQuOTg2NCAyNS4yNTg1IDI1LjY2NjcgMjUuMjU4NSAyNy4xNjMzQzI1LjI5MjUgMjguNjkzOSAyNC4wMzQgMzAuNDYyNiAyNC4wMzQgMzAuNDYyNlpNMzAuMzYwNSAyOS4zNzQyQzMxLjQ0OSAyOC4zMTk4IDMyLjMzMzMgMjguMjUxOCAzMi44NDM1IDI4LjcyNzlDMzMuMzUzNyAyOS4yMzgxIDMzLjI1MTcgMzAuMTIyNSAzMi4xNjMzIDMxLjE3NjlDMzEuMDc0OCAzMi4yMzEzIDI4LjkzMiAzMi41Mzc1IDI4LjkzMiAzMi41Mzc1QzI4LjkzMiAzMi41Mzc1IDI5LjI3MjEgMzAuNDI4NiAzMC4zNjA1IDI5LjM3NDJaTTMzLjM1MzcgMzcuNjczNUMzMS44NTcxIDM3LjY3MzUgMzAuMDg4NCAzNi4zNDcgMzAuMDg4NCAzNi4zNDdDMzAuMDg4NCAzNi4zNDcgMzEuODU3MSAzNS4wODg1IDMzLjM4NzggMzUuMDg4NUMzNC44ODQ0IDM1LjA4ODUgMzUuNTk4NiAzNS43MDA3IDM1LjU2NDYgMzYuMzgxQzM1LjU2NDYgMzcuMTI5MyAzNC44NTAzIDM3LjY3MzUgMzMuMzUzNyAzNy42NzM1WiIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==
// @grant             GM_xmlhttpRequest
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/518609/Fanqie%20Novel%20Free%20Reading.user.js
// @updateURL https://update.greasyfork.org/scripts/518609/Fanqie%20Novel%20Free%20Reading.meta.js
// ==/UserScript==

// API Client class
class FqClient {
    async getContentKeys(itemIds) {
        const itemIdsStr = Array.isArray(itemIds) ? itemIds.join(',') : itemIds;
        return this._apiRequest(itemIdsStr);
    }

    async _apiRequest(itemIds) {
        const url = `https://fanqie.tutuxka.top/?item_ids=${itemIds}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            resolve(JSON.parse(response.responseText));
                        } catch (e) {
                            reject(new Error(`Failed to parse response: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`API request failed with status ${response.status}`));
                    }
                },
                onerror: (error) => {
                    reject(new Error(`API request error: ${error.error}`));
                },
                timeout: 10000
            });
        });
    }
}

// UI and Helper Functions
const styleElement = document.createElement("style");
const cssRule = `
    @keyframes hideAnimation {
        0% { opacity: 1; }
        50% { opacity: 0.75; }
        100% { opacity: 0; display: none; }
    }
    option:checked {
        background-color: #ffb144;
        color: white;
    }
`;
styleElement.innerHTML = cssRule;
document.head.appendChild(styleElement);

function hideElement(ele) {
    if (!ele) return;
    ele.style.animation = "hideAnimation 1.5s ease";
    ele.addEventListener("animationend", function () {
        ele.style.display = "none";
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const mark = (ele) => {
    if (ele) ele.style.boxShadow = "0px 0px 50px rgba(0, 0, 0, 0.2)";
};

// Common function to process chapter content
function processChapterContent(content) {
    // Clean up content first
    const cleanContent = content
        .replace(/<header>.*?<\/header>/g, '') // Remove header
        .replace(/<footer>.*?<\/footer>/g, '') // Remove footer
        .replace(/<article>/g, '') // Remove article opening tag
        .replace(/<\/article>/g, '') // Remove article closing tag
        .replace(/<p>/g, '') // Remove paragraph opening tags
        .replace(/<\/p>/g, '\n') // Replace closing p tags with newlines
        .replace(/&nbsp;/g, ' ') // Replace HTML spaces
        .replace(/&lt;/g, '<') // Replace HTML entities
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/\n\s*\n/g, '\n') // Remove multiple consecutive newlines
        .replace(/^\s+|\s+$/gm, ''); // Trim each line

    // Process paragraphs with indentation
    return cleanContent
        .split('\n')
        .filter(para => para.trim()) // Remove empty paragraphs
        .map(para => '　　' + para.trim()) // Add two full-width spaces for indentation
        .join('\n');
}

function processContentForDownload(content) {
    // Extract chapter title from content
    const titleMatch = content.match(/<title>(.+?)<\/title>/);
    let title = titleMatch ? titleMatch[1] : '';
    title = title.replace(/在线免费阅读_番茄小说官网$/, '');

    // Process content using common function
    const processedContent = processChapterContent(content);

    // Combine title and content with proper formatting
    return `${title}\n${processedContent}`.trim();
}

// Main Script
(function() {
    'use strict';
    const client = new FqClient();
    const path = window.location.href.match(/\/([^/]+)\/\d/)?.[1];

    switch(path) {
        case 'reader':
            handleReaderPage(client);
            break;
        case 'page':
            handleBookPage(client);
            break;
    }
})();

async function handleReaderPage(client) {
    const toolbar = document.querySelector("#app > div > div > div > div.reader-toolbar > div > div.reader-toolbar-item.reader-toolbar-item-download");
    const text = toolbar?.querySelector('div:nth-child(2)');
    
    if (toolbar && text) {
        mark(toolbar);
        text.innerHTML = 'Processing';
    }

    document.title = document.title.replace(/在线免费阅读_番茄小说官网$/, '');
    var currentURL = window.location.href;
    setInterval(() => window.location.href !== currentURL ? location.reload() : null, 1000);

    let cdiv = document.getElementsByClassName('muye-reader-content noselect')[0];
    if (cdiv) {
        cdiv.classList = cdiv.classList[0];
    } else {
        const html0 = document.getElementById('html_0');
        if (!html0) return;
        cdiv = html0.children[2] || html0.children[0];
        if (!cdiv) return;
    }

    try {
        const url = window.location.href;
        const match = url.match(/\/(\d+)/);
        if (!match) return;

        const chapterId = match[1];
        const response = await client.getContentKeys(chapterId);
        
        if (!response.data || !response.data.content) {
            throw new Error('No content found for chapter');
        }

        // Format content for web display - skip first line (chapter title)
        const content = response.data.content.split('\n')
            .filter(line => line.trim()) // Remove empty lines
            .slice(1) // Skip the first line (chapter title)
            .map(line => `<p style="text-indent: 2em; margin: 10px 0;">${line.trim()}</p>`)
            .join('');

        const formattedContent = `<div style="padding: 20px 0;">${content}</div>`;

        document.getElementsByClassName('muye-to-fanqie')[0]?.remove();
        document.getElementsByClassName('pay-page')[0]?.remove();
        cdiv.innerHTML = formattedContent;
        document.getElementById('html_0')?.classList.remove('pay-page-html');

        if (toolbar && text) {
            toolbar.style.backgroundColor = '#B0E57C';
            text.innerHTML = 'Success';
            hideElement(toolbar);
        }
    } catch (error) {
        console.error('Error:', error);
        if (toolbar && text) {
            toolbar.style.backgroundColor = 'pink';
            text.innerHTML = 'Failed';
            hideElement(toolbar);
        }
    }
}

async function handleBookPage(client) {
    const infoName = document.querySelector("#app > div > div.muye.muye-page > div > div.page-wrap > div > div.page-header-info > div.info > div.info-name > h1")?.innerHTML;
    const authorName = document.querySelector(".author-name-text")?.innerHTML;
    const totalChapters = document.querySelector(".page-directory-header h3")?.textContent.match(/(\d+)章/)?.[1] || '';
    const infoLabels = Array.from(document.querySelectorAll('.info-label span')).map(span => span.textContent).join(' ');
    const wordCount = document.querySelector('.info-count-word')?.textContent.trim();
    const lastUpdate = document.querySelector('.info-last')?.textContent.trim();
    const abstract = document.querySelector("#app > div > div.muye.muye-page > div > div.page-body-wrap > div > div.page-abstract-content > p")?.innerHTML;

    var content = 'Using Free Fanqie script download\n\n' +
                 '作者：' + authorName + '\n' +
                 '书名：' + infoName + '\n' +
                 '标签：' + infoLabels + '\n' +
                 '字数：' + wordCount + '\n' +
                 '更新：' + lastUpdate + '\n\n' +
                 '简介：' + abstract + '\n';
    content = content.replace(/undefined|null|NaN/g,'');

    await setupDownloadUI(client, content, infoName, totalChapters);
}

async function setupDownloadUI(client, content, infoName, totalChapters) {
    await sleep(1500);
    
    document.querySelector("#app > div > div.muye.muye-page > div > div.page-wrap > div > div.page-header-info > div.info > div.download-icon.muyeicon-tomato")?.remove();
    const download = document.querySelector("#app > div > div.muye.muye-page > div > div.page-wrap > div > div.page-header-info > div.info > a");
    if (!download) return;

    const downloadSpan = download.querySelector('button > span');
    if (downloadSpan) downloadSpan.innerHTML = '*Download Novel';
    download.href = 'javascript:void 0';

    const parentElement = document.querySelector("#app > div > div.muye.muye-page > div > div.page-wrap > div > div.page-header-info > div.info");
    if (!parentElement) return;

    const selectElement = createEncodingSelect();
    parentElement.appendChild(selectElement);

    const books = Array.from(document.getElementsByClassName('chapter-item'));
    
    async function downloadChapter(chapterId, ele) {
            try {
                const response = await client.getContentKeys(chapterId);
                if (!response.data || !response.data.content) {
                    throw new Error('No content found');
                }
                const title = response.data.title || ele.textContent;
                const processedContent = processChapterContent(response.data.content);
                return `\n\n${title}\n${processedContent}`;
            } catch (error) {
                console.error(`Failed to download chapter ${chapterId}:`, error);
                ele.style.backgroundColor = 'pink';
                ele.style.border = "2px solid pink";
                return null;
            }
        }

    async function downloadNext() {
        if (!books.length) return;
        const ele = books[0].querySelector('a');
        if (!ele) return;

        ele.style.border = "3px solid navajowhite";
        ele.style.borderRadius = "5px";
        ele.style.backgroundColor = "navajowhite";

        const match = ele.href.match(/\/(\d+)/);
        if (!match) return;

        const chapterId = match[1];
        const chapterContent = await downloadChapter(chapterId, ele);
        
        if (chapterContent) {
            content += '\n\n' + chapterContent;
            ele.style.backgroundColor = '#D2F9D1';
            ele.style.border = "2px solid #D2F9D1";
        }

        books.shift();
        
        if (!books.length) {
            const charset = selectElement.value;
            const blob = new Blob([new TextEncoder(charset).encode(content)], 
                { type: `text/plain;charset=${charset}` });
            const fileName = totalChapters ? 
                `${infoName}_${totalChapters}章.txt` : 
                `${infoName}.txt`;
            saveAs(blob, fileName);
        } else {
            downloadNext();
        }
    }

    download.addEventListener('click', downloadNext);
    download.addEventListener('click', () => {
        download.style.display = 'none';
        selectElement.style.display = 'none';
    });
}

function createEncodingSelect() {
    const selectElement = document.createElement("select");
    selectElement.className = "byte-btn byte-btn-primary byte-btn-size-large byte-btn-shape-square muye-button";
    
    const options = ["UTF-8", "GBK", "UNICODE", "UTF-16", "ASCII"];
    options.forEach(opt => {
        const option = document.createElement("option");
        option.text = opt;
        option.value = opt;
        selectElement.appendChild(option);
    });

    Object.assign(selectElement.style, {
        position: "absolute",
        left: "320px",
        bottom: "0px",
        height: "32px",
        width: "80px",
        fontSize: "15px"
    });

    return selectElement;
}
