// ==UserScript==
// @name         Libgen Filetype Display
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display all filetype information on Libgen
// @author       You
// @match        *://libgen.li/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/525383/Libgen%20Filetype%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/525383/Libgen%20Filetype%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hàm để thêm cột Filetype vào bảng
    function addFiletypeColumn() {
        const table = document.querySelector('#tablelibgen');
        if (!table) return;

        // Thêm tiêu đề cột mới sau cột "Author(s)"
        const headerRow = table.querySelector('thead tr');
        const filetypeHeader = document.createElement('th');
        filetypeHeader.textContent = 'Filetype';

        // Thêm cột "Filetype" sau cột "Author(s)" (cột thứ 4)
        headerRow.insertBefore(filetypeHeader, headerRow.children[4]);

        // Lặp qua từng hàng trong bảng và thêm cột Filetype
        table.querySelectorAll('tbody tr').forEach(row => {
            const idLink = row.querySelector('td:nth-child(3) a');
            if (!idLink) return;

            const id = idLink.href.match(/id=(\d+)/)?.[1];
            if (!id) return;

            const filetypeCell = document.createElement('td');
            filetypeCell.textContent = 'Loading...';

            // Thêm cột Filetype sau cột "Author(s)" (cột thứ 4)
            row.insertBefore(filetypeCell, row.children[4]);

            // Gửi yêu cầu để lấy thông tin filetype
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://libgen.li/edition.php?id=${id}`,
                onload: function(response) {
                    const filetypeText = parseFiletypeInfo(response.responseText);
                    filetypeCell.innerHTML = filetypeText || 'N/A';
                },
                onerror: function() {
                    filetypeCell.textContent = 'Error';
                }
            });
        });
    }

    // Hàm phân tích và tạo text từ filetype
    function parseFiletypeInfo(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const filetypeInfo = doc.querySelectorAll('td.valign-middle');

        const result = Array.from(filetypeInfo).map(info => {
            const sizeMatch = info.textContent.match(/Size:\s*(\w+)/);
            const extensionMatch = info.textContent.match(/Extension:\s*(\w+)/);
            const ocrMatch = info.textContent.match(/OCR:\s*(\w+)/);
            
            // Tìm link MD5 từ img trong td.valign-middle
            const imgLink = info.closest('tr').querySelector('td:first-child a');
            const md5Link = imgLink ? imgLink.getAttribute('href') : null;

            const size = sizeMatch ? sizeMatch[1] : 'N/A';
            let extension = extensionMatch ? extensionMatch[1] : 'N/A';
            const ocr = ocrMatch ? ocrMatch[1] : 'N/A';

            if (extension.toLowerCase().endsWith('libgen')) {
                extension = extension.toLowerCase().replace('libgen', '');
            }

            // Tạo link với thông tin filetype
            const linkText = `${size} MB ${extension}${ocr !== 'N/A' ? ' OCR' : ''}`;
            if (md5Link) {
                return `<a href="${md5Link}" target="_blank">${linkText}</a>`;
            }
            return linkText;
        });

        return result.join(', ');
    }

    // Chờ trang tải xong và thêm cột Filetype
    window.addEventListener('load', addFiletypeColumn);
})();