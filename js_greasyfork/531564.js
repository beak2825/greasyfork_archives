// ==UserScript==
// @name         拷貝漫畫
// @namespace    http://tampermonkey.net/
// @version      17.0
// @description  清理符號，檢查連結訪問狀態，開啟未訪問的連結，並在章節頁面自動處理
// @match        https://mangacopy.com/comic/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531564/%E6%8B%B7%E8%B2%9D%E6%BC%AB%E7%95%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/531564/%E6%8B%B7%E8%B2%9D%E6%BC%AB%E7%95%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_START_DELAY = 1000;// 目錄頁面腳本開始延遲時間（毫秒）
    const CHAPTER_PAGE_START_DELAY = 1000;// 章節頁面腳本開始延遲時間（毫秒）
    const LINK_CLEAN_DELAY = 2000;// 目錄頁面清理連結延遲時間（毫秒）
    const visitedPagesKey = 'visitedPages';
    const listPrefix = 'unvisitedLinks_';
    const scriptDisabledKey = 'copyMangaCleanerDisabled';
    const isChapterPage = window.location.href.includes('/chapter/');

    function showStatus(message) {
        let statusBar = document.getElementById('status-bar');
        if (!statusBar) {
            statusBar = document.createElement('div');
            statusBar.id = 'status-bar';
            statusBar.style.position = 'fixed';
            statusBar.style.top = '10px';
            statusBar.style.left = '10px';
            statusBar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            statusBar.style.color = 'white';
            statusBar.style.padding = '10px';
            statusBar.style.borderRadius = '5px';
            statusBar.style.zIndex = '9999';
            document.body.appendChild(statusBar);
        }
        statusBar.textContent = message;
    }

    async function sha256(message) {
        try {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            return hashBuffer;
        } catch (error) {
            console.error('哈希生成失敗:', error);
            return null;
        }
    }

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    if (!isChapterPage) {
        async function cleanLinks() {
            const links = document.querySelectorAll('a[href*="/chapter/"]:not([href*="#"])');
            const visitedPages = new Set(JSON.parse(localStorage.getItem(visitedPagesKey) || '[]'));
            for (const link of links) {
                const originalHref = link.href;
                link.href = link.href.replace(/-(?=[^/]*$)/g, '');
                const hashBuffer = await sha256(link.href);
                if (!hashBuffer) return false;
                const hashBase64 = arrayBufferToBase64(hashBuffer);
                if (visitedPages.has(hashBase64)) {
                    link.style.color = 'red';
                } else {
                    link.style.color = 'green';
                }
            }
            return true;
        }

        async function processUnvisitedLinks() {
            const currentPageUrl = window.location.href;
            const listKey = listPrefix + currentPageUrl;
            const visitedPages = new Set(JSON.parse(localStorage.getItem(visitedPagesKey) || '[]'));
            const allLinks = Array.from(document.querySelectorAll('a[href*="/chapter/"]:not([href*="#"])'));
            const tableDefaultRightDivs = document.querySelectorAll('div.table-default-right');
            let links = [];

            if (tableDefaultRightDivs.length > 0) {
                links = Array.from(tableDefaultRightDivs[0].querySelectorAll('a[href*="/chapter/"]:not([href*="#"])'));
            } else {
                links = allLinks;
            }

            const allUnvisited = [];

            for (const link of links) {
                const hashBuffer = await sha256(link.href);
                if (!hashBuffer) continue;
                const hashBase64 = arrayBufferToBase64(hashBuffer);
                if (!visitedPages.has(hashBase64)) {
                    allUnvisited.push(link.href);
                    visitedPages.add(hashBase64);
                }
            }

            if (allUnvisited.length > 0) {
                let targetLink = allUnvisited[0];
                const newUnvisitedLinks = [targetLink, currentPageUrl];
                localStorage.setItem(listKey, JSON.stringify(newUnvisitedLinks));
                localStorage.setItem(visitedPagesKey, JSON.stringify([...visitedPages]));
                showStatus('已儲存連結，正在跳轉...');
                window.location.href = targetLink;
            } else {
                showStatus('沒有未訪問的連結');
            }
        }

        function addClearHistoryButton() {
            const clearButton = document.createElement('button');
            clearButton.textContent = '清除歷史';
            clearButton.style.position = 'fixed';
            clearButton.style.top = '60px';
            clearButton.style.left = '10px';
            clearButton.style.zIndex = '9999';
            clearButton.style.padding = '5px 10px';
            clearButton.style.backgroundColor = '#ff4444';
            clearButton.style.color = 'white';
            clearButton.style.border = 'none';
            clearButton.style.borderRadius = '5px';
            clearButton.style.cursor = 'pointer';
            clearButton.addEventListener('click', async () => {
                const links = Array.from(document.querySelectorAll('a[href*="/chapter/"]:not([href*="#"])'));
                const visitedPages = new Set(JSON.parse(localStorage.getItem(visitedPagesKey) || '[]'));
                for (const link of links) {
                    const hashBuffer = await sha256(link.href);
                    if (!hashBuffer) return;
                    const hashBase64 = arrayBufferToBase64(hashBuffer);
                    if (visitedPages.has(hashBase64)) {
                        visitedPages.delete(hashBase64);
                    }
                }
                localStorage.setItem(visitedPagesKey, JSON.stringify([...visitedPages]));
                showStatus('已清除當前頁面的連結記錄！');
            });
            document.body.appendChild(clearButton);
        }

        function addClearQueueButton() {
            const clearButton = document.createElement('button');
            clearButton.textContent = '清除隊列';
            clearButton.style.position = 'fixed';
            clearButton.style.top = '60px';
            clearButton.style.left = '100px';
            clearButton.style.zIndex = '9999';
            clearButton.style.padding = '5px 10px';
            clearButton.style.backgroundColor = '#ffaa44';
            clearButton.style.color = 'white';
            clearButton.style.border = 'none';
            clearButton.style.borderRadius = '5px';
            clearButton.style.cursor = 'pointer';
            clearButton.addEventListener('click', () => {
                const listKey = listPrefix + window.location.href.replace(/\/chapter\/.*/, '');
                localStorage.removeItem(listKey);
                showStatus('已清除當前隊列！');
            });
            document.body.appendChild(clearButton);
        }

        function addDisableLinksButton() {
            const disableButton = document.createElement('button');
            disableButton.textContent = '停用連結';
            disableButton.style.position = 'fixed';
            disableButton.style.top = '60px';
            disableButton.style.left = '190px';
            disableButton.style.zIndex = '9999';
            disableButton.style.padding = '5px 10px';
            disableButton.style.backgroundColor = '#4444ff';
            disableButton.style.color = 'white';
            disableButton.style.border = 'none';
            disableButton.style.borderRadius = '5px';
            disableButton.style.cursor = 'pointer';
            disableButton.addEventListener('click', () => {
                const newState = localStorage.getItem(scriptDisabledKey) !== 'true';
                localStorage.setItem(scriptDisabledKey, newState.toString());
                showStatus(newState ? '章節頁面腳本已停用' : '章節頁面腳本已啟用');
            });
            document.body.appendChild(disableButton);
        }

        function runScript() {
            addClearHistoryButton();
            addClearQueueButton();
            addDisableLinksButton();
            setTimeout(async () => {
                const success = await cleanLinks();
                if (!success) {
                    showStatus('清理連結失敗，停止腳本');
                    return;
                }
                processUnvisitedLinks();
            }, LINK_CLEAN_DELAY);
        }

        setTimeout(runScript, SCRIPT_START_DELAY);
    }

    if (isChapterPage) {
        function runScript() {
            const isDisabled = localStorage.getItem(scriptDisabledKey) === 'true';
            if (!isDisabled) {
                const parentUrl = window.location.href.replace(/\/chapter\/.*/, '');
                window.location.href = parentUrl;
            } else {
                showStatus('腳本當前已停用');
            }
        }

        setTimeout(runScript, CHAPTER_PAGE_START_DELAY);
    }
})();
