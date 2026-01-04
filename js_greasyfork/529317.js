// ==UserScript==
// @name         Chapter Downloader
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Tự động lấy nội dung từ chương hiện tại đến hết tại truyen.tangthuvien.vn
// @author       You
// @match        https://truyen.tangthuvien.vn/doc-truyen/*
// @match        https://truyen.tangthuvien.vn/doc-truyen/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529317/Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/529317/Chapter%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= TẠO GIAO DIỆN =================
    const panel = document.createElement('div');
    panel.id = 'reader-panel';
    panel.style.cssText = `
        position: fixed;
        top: 10%;
        right: 10px;
        width: 300px;
        background-color: #f8f8f8;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        z-index: 9999;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
    `;

    const textarea = document.createElement('textarea');
    textarea.id = 'content-textarea';
    textarea.style.cssText = `
        width: 100%;
        height: 300px;
        margin-bottom: 10px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: vertical;
    `;

    const startButton = document.createElement('button');
    startButton.textContent = 'Bắt đầu';
    startButton.style.cssText = `
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Xoá';
    clearButton.style.cssText = `
        width: 49%;
        padding: 8px;
        margin-right: 2%;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Sao Chép';
    copyButton.style.cssText = `
        width: 49%;
        padding: 8px;
        background-color: #9c27b0;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;

    panel.appendChild(textarea);
    panel.appendChild(startButton);
    panel.appendChild(clearButton);
    panel.appendChild(copyButton);
    document.body.appendChild(panel);

    const saved = localStorage.getItem('chapterDownloaderContent');
    if (saved) textarea.value = saved;

    function saveContent() {
        localStorage.setItem('chapterDownloaderContent', textarea.value);
    }

    textarea.addEventListener('input', saveContent);

    // ========== CẬP NHẬT PHẦN XỬ LÝ NỘI DUNG ==========
    function extractChapterContent() {
        const titleElement = document.querySelector('h2');
        const contentElement = document.querySelector('.box-chap');
        if (titleElement && contentElement) {
            const title = titleElement.innerText.trim();
            const content = contentElement.innerText
                .split('\n')
                .map(line => line.trim())
                .filter(line => line !== '' && !/^[-=_*]{3,}$/.test(line))
                .join('\n');

            if (textarea.value) {
                textarea.value += '\n\n' + title + '\n' + content;
            } else {
                textarea.value = title + '\n' + content;
            }
            saveContent();
            return true;
        }
        return false;
    }

    function goToNextChapter() {
        const next = document.querySelector('.bot-next_chap.bot-control') ||
            [...document.querySelectorAll('a[href*="chuong"]')].find(a =>
                /tiếp|sau|next/i.test(a.textContent));
        if (next) {
            next.click();
            return true;
        }
        return false;
    }

    let isAutoDownloading = false;

    startButton.addEventListener('click', () => {
        isAutoDownloading = !isAutoDownloading;
        if (isAutoDownloading) {
            localStorage.setItem('chapterDownloaderAuto', 'true');
            startButton.textContent = 'Dừng';
            startButton.style.backgroundColor = '#f44336';
            extractChapterContent();
            setTimeout(() => goToNextChapter(), 1000);
        } else {
            localStorage.setItem('chapterDownloaderAuto', 'false');
            startButton.textContent = 'Bắt đầu';
            startButton.style.backgroundColor = '#4CAF50';
        }
    });

    clearButton.addEventListener('click', () => {
        textarea.value = '';
        saveContent();
    });

    copyButton.addEventListener('click', () => {
        textarea.select();
        document.execCommand('copy');
        const notification = document.createElement('div');
        notification.textContent = 'Đã sao chép!';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    });

    // Khôi phục trạng thái auto sau khi load trang mới
    window.addEventListener('load', () => {
        const shouldContinue = localStorage.getItem('chapterDownloaderAuto') === 'true';
        if (shouldContinue) {
            setTimeout(() => {
                extractChapterContent();
                setTimeout(() => goToNextChapter(), 1000);
            }, 1000);
        }
    });

    console.log('✅ Chapter Downloader Auto script loaded');
})();
