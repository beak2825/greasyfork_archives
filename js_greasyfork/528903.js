// ==UserScript==
// @name         Auto Download Video & Files (No Image)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Tạo nút download để tải toàn bộ video và file đính kèm trên trang.
// @author       
// @match        *://rphang.ing/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528903/Auto%20Download%20Video%20%20Files%20%28No%20Image%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528903/Auto%20Download%20Video%20%20Files%20%28No%20Image%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🟢 Tạo nút download nổi
    const downloadButton = document.createElement('button');
    downloadButton.textContent = '📥 Download All';
    Object.assign(downloadButton.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '10px 15px',
        backgroundColor: '#ff4d4d',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: '9999',
        fontSize: '14px'
    });

    document.body.appendChild(downloadButton);

    // 🟢 Hàm tải file (video, file đính kèm)
    function downloadFile(url, filename) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                const blob = response.response;
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
            },
            onerror: function(error) {
                console.error('Lỗi tải file:', filename, error);
            }
        });
    }

    // 🟢 Khi nhấn vào nút "Download All"
    downloadButton.onclick = function() {
        let files = [];

        // 🔹 Lấy danh sách video từ <video data-xf-init="video-init"> > <source>
        document.querySelectorAll('video[data-xf-init="video-init"] source[src]').forEach(source => {
            let url = source.getAttribute('src');
            if (url) {
                let filename = url.split('/').pop().split('?')[0];
                files.push({ url, filename });
            }
        });

        // 🔹 Lấy danh sách file đính kèm từ <li class="attachment"> > <div class="attachment-icon"> > <a href>
        document.querySelectorAll('li.attachment div.attachment-icon a[href]').forEach(a => {
            let url = a.getAttribute('href');
            if (url) {
                let filename = a.textContent.trim() || url.split('/').pop().split('?')[0];
                files.push({ url, filename });
            }
        });

        console.log('📥 Tìm thấy các file:', files);

        // 🟢 Tải tất cả file
        files.forEach(file => downloadFile(file.url, file.filename));
    };
})();