// ==UserScript==
// @name         国家中小学智慧教育平台 - 下载教材PDF
// @namespace    https://github.com/fanzijun-github
// @homepage     https://github.com/fanzijun-github/SmartEduPDFDownload/
// @supportURL   https://github.com/fanzijun-github/SmartEduPDFDownload/issues/new
// @version      1.0
// @description  自动识别页面中最大的PDF文件并生成下载按钮，自动添加accessToken
// @author       fanzijun
// @match        https://basic.smartedu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541986/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%20-%20%E4%B8%8B%E8%BD%BD%E6%95%99%E6%9D%90PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/541986/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%20-%20%E4%B8%8B%E8%BD%BD%E6%95%99%E6%9D%90PDF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const collectedPDFs = new Set();
    let isDownloadButtonCreated = false;

    // ========== 获取 access_token ==========
    function getAccessToken() {
        const authKey = Object.keys(localStorage).find(key => key.startsWith("ND_UC_AUTH"));
        if (!authKey) return null;
        const tokenData = JSON.parse(localStorage.getItem(authKey));
        return JSON.parse(tokenData.value).access_token;
    }

    // ========== 给链接添加 token 参数 ==========
    function addTokenToURL(url, token) {
        try {
            const parsedUrl = new URL(url);
            parsedUrl.searchParams.set('accessToken', token);
            return parsedUrl.toString();
        } catch (e) {
            return url;
        }
    }

    // ========== 获取每个PDF的真实大小（HEAD 请求）==========
    async function getPdfSize(url) {
        try {
            const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
            const size = parseInt(response.headers.get('content-length'), 10);
            return isNaN(size) ? 0 : size;
        } catch (e) {
            return 0;
        }
    }

    // ========== 找出最大的 PDF ==========
    async function findLargestPdf() {
        const pdfsWithSize = await Promise.all(
            Array.from(collectedPDFs).map(async (url) => ({
                url,
                size: await getPdfSize(url),
            }))
        );

        pdfsWithSize.sort((a, b) => b.size - a.size);
        return pdfsWithSize[0]?.url || null;
    }

    // ========== 创建下载按钮 ==========
    function createDownloadButton(pdfUrl, accessToken) {
        if (isDownloadButtonCreated) return;
        isDownloadButtonCreated = true;

        const button = document.createElement('button');
        button.textContent = '下载教材';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '99999';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
        button.style.fontWeight = 'bold';

        button.addEventListener('click', () => {
            const downloadUrl = addTokenToURL(pdfUrl, accessToken);
            console.log("✅ 正在下载：", downloadUrl);
            window.open(downloadUrl, '_blank');
        });

        document.body.appendChild(button);
    }

    // ========== 主逻辑 ==========
    async function handleNewPDF(url) {
        if (isDownloadButtonCreated) return;

        collectedPDFs.add(url);

        const accessToken = getAccessToken();
        if (!accessToken) return;

        const largestPdfUrl = await findLargestPdf();
        if (largestPdfUrl) {
            createDownloadButton(largestPdfUrl, accessToken);
        }
    }

    // ========== 监听 fetch 请求 ==========
    const origFetch = window.fetch;
    window.fetch = function(resource, config) {
        return origFetch.apply(this, arguments).then(async response => {
            const url = resource instanceof Request ? resource.url : resource;
            if (url.toLowerCase().endsWith('.pdf') || url.includes('.pdf?')) {
                handleNewPDF(url);
            }
            return response;
        });
    };

    // ========== 监听 XMLHttpRequest 请求 ==========
    const origXHR = window.XMLHttpRequest;
    const origOpen = origXHR.prototype.open;
    origXHR.prototype.open = function(method, url) {
        this.addEventListener('load', function () {
            if (url.toLowerCase().endsWith('.pdf') || url.includes('.pdf?')) {
                handleNewPDF(url);
            }
        });
        return origOpen.apply(this, arguments);
    };

})();
