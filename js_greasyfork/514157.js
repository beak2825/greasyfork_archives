// ==UserScript==
// @name         AO3下载文章
// @namespace    https://greasyfork.org/users/1384897
// @version      0.4
// @description  下载AO3 tag页文章为ZIP
// @author       ✌
// @match        https://archiveofourown.org/tags/*/works*
// @match        https://archiveofourown.org/works?*
// @match        https://archiveofourown.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      archiveofourown.org
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514157/AO3%E4%B8%8B%E8%BD%BD%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/514157/AO3%E4%B8%8B%E8%BD%BD%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const maxWorks = 1000;
    const delay = 4000;
    let worksProcessed = Number(localStorage.getItem('worksProcessed')) || 0;
    let zip = new JSZip();
    let isDownloading = false;
    let downloadInterrupted = false;

    if (localStorage.getItem('ao3ZipData')) {
        const zipData = JSON.parse(localStorage.getItem('ao3ZipData'));
        Object.keys(zipData).forEach(filename => zip.file(filename, zipData[filename]));
    }

    const button = document.createElement('button');
    button.innerText = `开始下载`;
    button.style.cssText = `
        margin: 10px auto;
        display: block;
        padding: 10px 20px;
        background-color: #3498db;
        color: #000;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);`;

    const header = document.querySelector('header#header');
    if (header) header.insertAdjacentElement('afterend', button);

    button.addEventListener('click', () => {
        if (isDownloading) {
            finalizeDownloadPartial(true, () => {
                downloadInterrupted = true;
                console.log('下载已暂停');
                button.innerText = '开始下载';
                localStorage.setItem('stopFlag', 'true');
                localStorage.removeItem('worksProcessed');
                localStorage.removeItem('ao3ZipData');
                worksProcessed = 0;
                isDownloading = false;
                location.reload();
            });
        } else {
            localStorage.removeItem('stopFlag');
            downloadInterrupted = false;
            startDownload();
        }
    });

    if (localStorage.getItem('worksProcessed') && localStorage.getItem('stopFlag') !== 'true') {
        startDownload();
    }

    function startDownload() {
        console.log(`开始下载最多 ${maxWorks} 篇作品...`);
        isDownloading = true;
        updateButtonProgress();
        processPage(window.location.href);
    }

    function processWorksWithDelay(links, index = 0, doc) {
        if (downloadInterrupted || index >= links.length || worksProcessed >= maxWorks) {
            checkForNextPage(doc);
            return;
        }

        const link = links[index];
        GM_xmlhttpRequest({
            method: 'GET',
            url: link,
            onload: response => {
                if (downloadInterrupted) return;

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const title = doc.querySelector('h2.title')?.innerText.trim() || '无标题';
                const author = doc.querySelector('a[rel="author"]')?.innerText.trim() || "匿名";
                const content = doc.querySelector('#workskin')?.innerHTML || "<p>内容不可用</p>";

                const htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head><meta charset="UTF-8"><title>${title} by ${author}</title></head>
                    <body><h1>${title}</h1><h2>by ${author}</h2>${content}</body>
                    </html>`;

                const filename = `${worksProcessed + 1}`.padStart(4, '0') + ` - ${title} - ${author}.html`.replace(/[\/:*?"<>|]/g, '');
                zip.file(filename, htmlContent);

                const zipData = JSON.parse(localStorage.getItem('ao3ZipData') || '{}');
                zipData[filename] = htmlContent;
                try {
                    localStorage.setItem('ao3ZipData', JSON.stringify(zipData));
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        finalizeDownloadPartial(true);
                    }
                }

                worksProcessed++;
                localStorage.setItem('worksProcessed', worksProcessed);
                updateButtonProgress();

                if (worksProcessed % 100 === 0) {
                    finalizeDownloadPartial();
                }

                setTimeout(() => processWorksWithDelay(links, index + 1, doc), delay);
            },
            onerror: () => {
                console.error(`加载内容失败: ${link}`);
                setTimeout(() => processWorksWithDelay(links, index + 1, doc), delay);
            }
        });
    }

    function processPage(url) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: response => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const links = Array.from(doc.querySelectorAll('h4.heading a'))
                    .filter(link => link.href.includes("/works/"))
                    .map(link => `${link.href}?view_adult=true&view_full_work=true`);
                processWorksWithDelay(links, 0, doc); 
            },
            onerror: () => {
                console.error(`加载页面失败: ${url}`);
            }
        });
    }

    function checkForNextPage(doc) {
        if (worksProcessed >= maxWorks || downloadInterrupted) {
            finalizeDownload();
            return;
        }

        const nextLink = doc.querySelector('a[rel="next"]'); 
        if (nextLink) {
            const nextPageUrl = new URL(nextLink.href, window.location.origin).toString();
            console.log("跳转下一页:", nextPageUrl);
            window.location.href = nextPageUrl;
        } else {
            finalizeDownload();
        }
    }

    function finalizeDownloadPartial(forceDownload = false, callback = null) {
        if (Object.keys(zip.files).length === 0) {
            if (callback) callback();
            return;
        }

        console.log(`生成部分 ZIP 文件...`);
        zip.generateAsync({ type: "blob" }).then(blob => {
            const partNumber = Math.ceil(worksProcessed / 100) || 1;
            GM_download({
                url: URL.createObjectURL(blob),
                name: `AO3_Works_Part_${partNumber}.zip`,
                saveAs: true,
                onload: () => {
                    zip = new JSZip();
                    localStorage.removeItem('ao3ZipData');
                    if (callback) callback();
                },
                onerror: (e) => {
                    console.error("ZIP 下载失败：", e);
                    if (callback) callback();
                }
            });
        }).catch(err => {
            console.error("ZIP 生成失败:", err);
            if (callback) callback();
        });
    }

    function finalizeDownload() {
        if (worksProcessed % 100 !== 0) {
            finalizeDownloadPartial(true, () => {
                completeAndReset();
            });
        } else {
            completeAndReset();
        }
    }

    function completeAndReset() {
        console.log("下载完成，清空记录。");
        localStorage.clear();
        worksProcessed = 0;
        isDownloading = false;
        location.reload();
    }

    function updateButtonProgress() {
        button.innerText = `下载中 - 进度：${worksProcessed}/${maxWorks}`;
    }
})();

