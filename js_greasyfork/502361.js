// ==UserScript==
// @name         tối ưu imail.edu.vn
// @match        https://*.imail.edu.vn/*
// @grant        none
// @description  xóa QC imail.edu.vn
// @version 0.0.1.20240801135540
// @namespace https://greasyfork.org/users/1031405
// @downloadURL https://update.greasyfork.org/scripts/502361/t%C3%B4%CC%81i%20%C6%B0u%20imaileduvn.user.js
// @updateURL https://update.greasyfork.org/scripts/502361/t%C3%B4%CC%81i%20%C6%B0u%20imaileduvn.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Cải tiến 1: Kết hợp bộ chọn CSS để tăng hiệu suất
    const combinedSelector = 'div[x-show="id === 0"].flex-1.hidden.lg\\:flex, div.text-center.p-4[style*="background-color: rgba(0, 0, 0, 0.05);"], ins.adsbygoogle.adsbygoogle-noablate';

    // Cải tiến 2: Sử dụng querySelectorAll và forEach để loại bỏ vòng lặp
    function removeElements() {
        document.querySelectorAll(combinedSelector).forEach(element => element.remove());
    }

    // Xóa tất cả các thẻ <script>
    function removeScripts() {
        document.querySelectorAll('script').forEach(script => script.remove());
    }

    // Xóa tất cả các thẻ <iframe>
    function removeIframes() {
        document.querySelectorAll('iframe').forEach(iframe => iframe.remove());
    }

    // Cải tiến 3: Sử dụng MutationObserver để xử lý cập nhật DOM động hiệu quả hơn
    const observer = new MutationObserver(() => {
        removeElements();
        removeScripts();
        removeIframes();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Chạy lần đầu để xóa các phần tử hiện có
    removeElements();
    removeScripts();
    removeIframes();
})();
