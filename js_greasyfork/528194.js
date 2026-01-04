// ==UserScript==
// @name         Kimi citations collector
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Kimi citations can copy to Microsoft Word
// @author       Bui Quoc Dung
// @match        https://kimi.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528194/Kimi%20citations%20collector.user.js
// @updateURL https://update.greasyfork.org/scripts/528194/Kimi%20citations%20collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function clickTagsAndExtractLinks() {
        let tags = document.querySelectorAll('.markdown-container:not(.researchItem-text) .rag-tag'); // Tìm tất cả .rag-tag

        for (let index = 0; index < tags.length; index++) {
            let tag = tags[index];
            tag.click(); // Click vào .rag-tag để mở .scroll-container
            console.log(`🔘 Click vào .rag-tag [index: ${index}]`);

            await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 1 giây để nội dung tải xong

            let links = document.querySelectorAll('.info-container .title a'); // Tìm tất cả các link
            let firstLink = links[index]; // Lấy link theo index

            if (firstLink) {
                let href = firstLink.href;
                console.log(`🔗 Tìm thấy link [index: ${index}]: ${href}`);

                // Tạo phần tử <a> chứa "Ref"
                let refLink = document.createElement('a');
                refLink.href = href;
                refLink.target = '_blank';
                refLink.textContent = "*";
                refLink.style.color = '#007bff';
                refLink.style.textDecoration = 'none';
                refLink.style.fontWeight = 'bold';
                refLink.style.marginLeft = '5px';

                // Kiểm tra xem "Ref" đã tồn tại chưa để tránh chèn nhiều lần
                if (!tag.querySelector('a')) {
                    tag.appendChild(refLink);
                }
            } else {
                console.warn(`⚠️ Không tìm thấy link cho .rag-tag [index: ${index}]`);
            }

            // Xóa icon .rag-icon nếu có
            let ragIcon = tag.querySelector('.icon.rag-icon');
            if (ragIcon) {
                ragIcon.remove();
                console.log(`🗑️ Xóa .rag-icon trong .rag-tag [index: ${index}]`);
            }

            // Click vào nút đóng .scroll-container
            let closeBtn = document.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.click();
                console.log(`❌ Click vào .close-btn để đóng .scroll-container [index: ${index}]`);
                await new Promise(resolve => setTimeout(resolve, 500)); // Chờ 0.5 giây để đảm bảo popup đóng trước khi tiếp tục
            } else {
                console.warn("⚠️ Không tìm thấy .close-btn!");
            }
        }
    }

    // Chờ trang tải xong rồi chạy script
    window.onload = function() {
        setTimeout(clickTagsAndExtractLinks, 2000); // Đợi 2 giây để đảm bảo trang đã tải xong
    };
})();
