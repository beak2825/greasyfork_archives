// ==UserScript==
// @name           Get download link for DevUploads
// @name:vi        Lấy link tải DevUploads
// @namespace      DevUploads
// @version        25.02.03.c
// @description    Get download link from devuploads
// @description:vi Scripts lấy link tải DevUploads
// @author         Darias
// @icon           https://www.google.com/s2/favicons?sz=128&domain=devuploads.com
// @homepage       https://xem.li/DevUl
// @match          https://devuploads.com/*
// @match          https://djxmaza.in/*
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/525693/Get%20download%20link%20for%20DevUploads.user.js
// @updateURL https://update.greasyfork.org/scripts/525693/Get%20download%20link%20for%20DevUploads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ngăn chặn script ẩn nút download
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
        if (typeof callback === 'function' && callback.toString().includes('style.display')) {
            // Bỏ qua các setTimeout liên quan đến việc ẩn/hiện elements
            return;
        }
        return originalSetTimeout(callback, delay);
    };

    // Theo dõi và ngăn chặn thay đổi style.display
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.id === 'dlndiv' && mutation.type === 'attributes' && mutation.attributeName === 'style') {
                mutation.target.style.display = 'block';
            }
        });
    });

    // Hàm tìm link APK trong mã nguồn
    function findApkLink() {
        // Tìm trong scripts
        const scripts = document.getElementsByTagName('script');
        let apkLink = '';
        
        // Tìm theo nhiều pattern khác nhau
        const patterns = [
            /window\.open\('([^']*\.apk)'[^)]*\)/,
            /href="([^"]*\.apk)"/,
            /'([^']*\.apk)'/,
            /["']([^"']*?\/d\/[^"']*?\/[^"']*?\.apk)["']/
        ];

        // Tìm trong scripts
        for(let script of scripts) {
            for(let pattern of patterns) {
                const match = script.innerHTML.match(pattern);
                if(match && match[1]) {
                    apkLink = match[1];
                    return apkLink;
                }
            }
        }

        // Tìm trong toàn bộ HTML nếu không tìm thấy trong scripts
        const htmlContent = document.documentElement.innerHTML;
        for(let pattern of patterns) {
            const match = htmlContent.match(pattern);
            if(match && match[1]) {
                apkLink = match[1];
                return apkLink;
            }
        }

        return apkLink;
    }

    // Hàm tạo nút tải
    function createDownloadButton(apkLink) {
        let dlndiv = document.getElementById('dlndiv');
        if(!dlndiv) {
            dlndiv = document.createElement('div');
            dlndiv.id = 'dlndiv';
            dlndiv.className = 'text-center mb-4';
            
            // Chèn vào các vị trí có thể
            const possibleContainers = [
                '.download-page',
                '.container',
                'main',
                'body'
            ];

            let container;
            for(let selector of possibleContainers) {
                container = document.querySelector(selector);
                if(container) break;
            }

            if(container) {
                container.insertBefore(dlndiv, container.firstChild);
            }
        }

        // Tạo và cấu hình nút tải với style bảo vệ
        dlndiv.innerHTML = `
            <img src="https://devuploads.com/images/ins/download_now_en.png" 
                 style="cursor:pointer; max-width:240px; display:block !important; margin:auto; 
                        visibility:visible !important; opacity:1 !important;" 
                 onclick="window.open('${apkLink}', '_blank')"
                 title="Click to download APK directly">
        `;

        // Theo dõi thay đổi của dlndiv
        observer.observe(dlndiv, {
            attributes: true,
            attributeFilter: ['style']
        });

        // Thêm style bảo vệ
        const style = document.createElement('style');
        style.textContent = `
            #dlndiv {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 999999 !important;
            }
            #dlndiv img {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Hàm xóa các element không mong muốn
    function removeUnwantedElements() {
        const elementsToRemove = [
            '#adBlocked',
            '#Blocked',
            '.alert-danger',
            '#plzw',
            'script[src*="adsbygoogle"]',
            'script[src*="pagead2"]',
            'script[src*="ad-center"]'
        ];

        elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => element.remove());
        });
    }

    // Hàm chính
    function main() {
        // Chạy ngay khi có thể
        const checkAndCreate = () => {
            const apkLink = findApkLink();
            if(apkLink) {
                createDownloadButton(apkLink);
                removeUnwantedElements();
            }
        };

        // Chạy nhiều lần để đảm bảo
        checkAndCreate();
        document.addEventListener('DOMContentLoaded', checkAndCreate);
        window.addEventListener('load', checkAndCreate);

        // Chạy định kỳ trong 5 giây đầu
        let attempts = 0;
        const interval = setInterval(() => {
            checkAndCreate();
            attempts++;
            if(attempts >= 10) clearInterval(interval);
        }, 500);
    }

    // Khởi chạy script
    main();
})();