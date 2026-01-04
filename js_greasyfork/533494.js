// ==UserScript==
// @name         Libgen OCR Checker
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  Automatically annotate OCR PDF files on Libgen and add covers on results
// @author       Bui Quoc Dung
// @match        https://libgen.*/*
// @exclude      https://libgen.*/index.php
// @exclude      https://libgen.*/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/533494/Libgen%20OCR%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/533494/Libgen%20OCR%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function ensureCoversOn() {
        const url = new URL(window.location.href);
        if (!url.searchParams.has('covers')) {
            url.searchParams.set('covers', 'on');
            window.location.replace(url.toString());
        }
    })();

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function checkOCRAndUpdate() {
        const table = document.querySelector('table.table.table-striped, table#tablelibgen');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');

        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length < 9) continue;

            const sizeCell = cells[7];
            const extCell = cells[8];
            const ext = extCell.textContent.trim().toLowerCase();

            if (ext !== 'pdf') continue;

            const link = sizeCell.querySelector('a');
            if (!link) continue;

            const href = link.getAttribute('href');
            if (!href.startsWith('/file.php')) continue;

            const fileUrl = location.origin + href;

            try {
                const hasOCR = await checkOCR(fileUrl);
                if (hasOCR) {
                    extCell.textContent = 'pdf OCR';
                }
            } catch (error) {
                console.error(`Lỗi khi kiểm tra OCR cho ${fileUrl}:`, error);
            }

            await delay(1000);
        }
    }

    function checkOCR(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const ocrElements = doc.querySelectorAll('strong');
                        let hasOCR = false;

                        ocrElements.forEach(el => {
                            if (el.textContent.trim() === 'OCR:') {
                                const nextSibling = el.nextSibling;
                                if (nextSibling && nextSibling.textContent.includes('Yes')) {
                                    hasOCR = true;
                                }
                                const parentText = el.parentElement.textContent;
                                if (parentText.includes('Yes')) {
                                    hasOCR = true;
                                }
                            }
                        });

                        resolve(hasOCR);
                    } else {
                        reject(new Error(`HTTP status: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    window.addEventListener('load', checkOCRAndUpdate);

    const observer = new MutationObserver(() => {
        if (document.querySelector('table.table.table-striped, table#tablelibgen')) {
            checkOCRAndUpdate();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
