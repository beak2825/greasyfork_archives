// ==UserScript==
// @name         Nekopost Downloader
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Fully automated downloader for Nekopost.
// @author       sayurin & Miyu
// @match        https://www.nekopost.net/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/544092/Nekopost%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/544092/Nekopost%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createToastNotification(message, duration = 3000) {
        const notif = document.createElement('div');
        notif.textContent = message;
        Object.assign(notif.style, {
            position: 'fixed', top: '20px', right: '20px',
            backgroundColor: '#1E90FF', color: 'white',
            padding: '15px 20px', borderRadius: '10px',
            zIndex: '10000', fontSize: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            opacity: '0', transition: 'opacity 0.5s',
        });
        document.body.appendChild(notif);
        setTimeout(() => notif.style.opacity = '1', 100);
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 500);
        }, duration);
    }

    function findButtonByText(selector, text) {
        const buttons = document.querySelectorAll(selector);
        for (const button of buttons) {
            const span = button.querySelector('span');
            if (span && span.textContent.trim() === text) {
                return button;
            }
        }
        return null;
    }

    function clickNextChapter() {
        setTimeout(() => {
            const nextButton = findButtonByText('button.btn.w-1\\/5:not([disabled])', 'Next');
            if (nextButton) {
                createToastNotification('กำลังไปตอนต่อไปใน 1 วิ...');
                setTimeout(() => {
                    sessionStorage.setItem('miyuAutoStart', 'true');
                    nextButton.click();
                }, 1000);
            } else {
                createToastNotification('นี่คือตอนล่าสุดแล้วค่ะ!');
                sessionStorage.removeItem('miyuAutoStart');
            }
        }, 2000);
    }

    async function downloadImages() {
        const pathParts = window.location.pathname.split('/').filter(p => p);
        if (pathParts.length < 3) { createToastNotification('⚠️ ไม่สามารถหา ID ของเรื่อง/ตอน จาก URL ได้'); return; }
        const mangaId = pathParts[1];
        const chapterNumber = pathParts[2];
        const requiredPath = `/collectManga/${mangaId}/`;
        const allImages = document.querySelectorAll('img[src*="osemocphoto.com/collectManga/"]');
        const chapterImages = Array.from(allImages).filter(img => img.src.includes(requiredPath));
        if (chapterImages.length === 0) { createToastNotification('⚠️ หารูปภาพของเรื่องนี้ไม่เจอค่ะ!'); return; }
        createToastNotification(`ตรวจพบ ${chapterImages.length} รูปภาพ กำลังเริ่มดาวน์โหลด...`);
        const delay = ms => new Promise(res => setTimeout(res, ms));
        for (let i = 0; i < chapterImages.length; i++) {
            const img = chapterImages[i];
            const src = img.src;
            const fileExtension = src.split('.').pop().split('?')[0] || 'jpg';
            const fileName = `${chapterNumber} - ${String(i + 1).padStart(3, '0')}.${fileExtension}`;
            GM_download(src, fileName);
            await delay(200);
        }
        createToastNotification('✅ ส่งคำสั่งดาวน์โหลดทั้งหมดแล้วค่ะ!');
        clickNextChapter();
    }

    const scrollButton = document.createElement('button');
    scrollButton.id = 'miyu-download-button';
    scrollButton.textContent = 'ซายุจัง Slide & Save!';
    Object.assign(scrollButton.style, {
        position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999',
        padding: '10px 15px', backgroundColor: '#1E90FF', color: 'white',
        border: '2px solid white', borderRadius: '25px', cursor: 'pointer',
        fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.2s'
    });
    document.body.appendChild(scrollButton);

    scrollButton.addEventListener('click', () => {
        sessionStorage.removeItem('miyuAutoStart');
        scrollButton.textContent = 'กำลังเลื่อน...';
        scrollButton.disabled = true;

        const scrollInterval = setInterval(() => {
            const nextButton = findButtonByText('button.btn.w-1\\/5:not([disabled])', 'Next');
            const disabledNextButton = findButtonByText('button.btn.w-1\\/5[disabled]', 'Next');
            window.scrollBy(0, 300);
            let stopScrolling = false;
            let reason = "";
            const buffer = 150;
            if (nextButton && (window.innerHeight + window.scrollY + buffer) >= nextButton.offsetTop) {
                stopScrolling = true;
                reason = "เจอส่วนปุ่ม Next แล้ว";
            } else if (disabledNextButton && (window.innerHeight + window.scrollY + buffer) >= disabledNextButton.offsetTop) {
                stopScrolling = true;
                reason = "เจอตอนสุดท้ายแล้ว";
            } else if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                stopScrolling = true;
                reason = "เลื่อนจนสุดหน้าแล้ว";
            }
            if (stopScrolling) {
                clearInterval(scrollInterval);
                scrollButton.textContent = 'เรียบร้อย!';
                scrollButton.style.backgroundColor = '#32CD32';
                createToastNotification(`หยุดเลื่อนแล้ว: ${reason}, เริ่มดาวน์โหลด...`);
                downloadImages();
            }
        }, 20);
    });

    window.addEventListener('load', () => {
        if (sessionStorage.getItem('miyuAutoStart') === 'true') {
            createToastNotification('เริ่มทำงานอัตโนมัติ...');
            setTimeout(() => {
                const autoClickButton = document.getElementById('miyu-download-button');
                if (autoClickButton) {
                    autoClickButton.click();
                }
            }, 2000);
        }
    });

})();