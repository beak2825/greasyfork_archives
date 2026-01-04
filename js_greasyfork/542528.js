// ==UserScript==
// @name         AppSheet Bill Formatter & Print (Mobile)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Tự động format hóa đơn, đánh số, inject CSS, thêm nút in cho AppSheet trên mobile
// @match        https://*.appsheet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542528/AppSheet%20Bill%20Formatter%20%20Print%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542528/AppSheet%20Bill%20Formatter%20%20Print%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS cho hóa đơn (có mobile responsive)
    function injectBillCss() {
        if (document.getElementById('bill-css-style')) return;
        const style = document.createElement('style');
        style.id = 'bill-css-style';
        style.textContent = `
          .CommonLongTextRichTextDisplay {
            width: 100% !important;
            font-family: monospace !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 10px !important;
            font-size: 12px !important;
            display: block !important;
          }
          @media print {
            .CommonLongTextRichTextDisplay {
              margin: 0 !important;
              padding: 0 !important;
            }
          }
          .CommonLongTextRichTextDisplay table,
          .CommonLongTextRichTextDisplay h1,
          .CommonLongTextRichTextDisplay h3,
          .CommonLongTextRichTextDisplay td,
          .CommonLongTextRichTextDisplay th,
          .CommonLongTextRichTextDisplay tr {
            margin: 0 !important;
            padding: 2px !important;
            border: none !important;
            border-collapse: collapse !important;
          }
          .CommonLongTextRichTextDisplay table {
            width: 100% !important;
            margin: 0 auto !important;
            table-layout: fixed !important;
          }
          .CommonLongTextRichTextDisplay table:first-of-type {
            margin-bottom: 4px !important;
            text-align: center !important;
            border: none !important;
          }
          .CommonLongTextRichTextDisplay table:first-of-type td {
            text-align: center !important;
            border: none !important;
          }
          .CommonLongTextRichTextDisplay table:first-of-type h1 {
            font-size: 20px !important;
            font-weight: 700 !important;
            letter-spacing: 1px !important;
            line-height: 1.2 !important;
            text-align: center !important;
          }
          .CommonLongTextRichTextDisplay table:first-of-type h3 {
            font-size: 11px !important;
            font-weight: normal !important;
            line-height: 1.2 !important;
            text-align: center !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(2) {
            margin: 4px 0 !important;
            border: none !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(2) td {
            border: none !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(2) td:first-child {
            width: 80px !important;
            font-weight: 700 !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) {
            margin: 15px 0 !important;
            border: 1px solid black !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) th,
          .CommonLongTextRichTextDisplay table:nth-of-type(3) td {
            border: 1px solid black !important;
            padding: 8px !important;
            text-align: center !important;
            font-weight: normal !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) tr td {
            font-weight: normal !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) td:nth-child(3) {
            text-align: left !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) td:first-child,
          .CommonLongTextRichTextDisplay table:nth-of-type(3) th:first-child {
            width: 50px !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) td:nth-child(2),
          .CommonLongTextRichTextDisplay table:nth-of-type(3) th:nth-child(2) {
            width: 120px !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) td:nth-child(4),
          .CommonLongTextRichTextDisplay table:nth-of-type(3) th:nth-child(4) {
            width: 80px !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) tr:last-child td {
            border: 1px solid #000 !important;
            font-weight: normal !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) tr:last-child td:first-child {
            text-align: center !important;
            padding-left: 8px !important;
            border-right: none !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) tr:last-child td:nth-child(5) {
            width: 100px !important;
            border: 1px solid #000 !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) tr:last-child td:nth-child(6) {
            border: 1px solid #000 !important;
            background: none !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) tr:last-child td:nth-child(2),
          .CommonLongTextRichTextDisplay table:nth-of-type(3) tr:last-child td:nth-child(3),
          .CommonLongTextRichTextDisplay table:nth-of-type(3) tr:last-child td:nth-child(4) {
            border: none !important;
            background: none !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(3) tr:last-child td:first-child[colspan=\"3\"] ~ td {
            display: none !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(4) {
            margin-top: 5px !important;
            page-break-inside: avoid !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(4) td {
            text-align: center !important;
            width: 25% !important;
            padding: 0 !important;
            vertical-align: top !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(4) strong {
            display: block !important;
            margin-bottom: 0px !important;
            font-weight: normal !important;
          }
          .CommonLongTextRichTextDisplay table:nth-of-type(4) p,
          .CommonLongTextRichTextDisplay table:nth-of-type(4) i {
            font-style: italic !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @media (max-width: 600px) {
            .CommonLongTextRichTextDisplay table {
              display: block !important;
              width: 100% !important;
              overflow-x: auto !important;
              box-sizing: border-box !important;
            }
            .CommonLongTextRichTextDisplay th,
            .CommonLongTextRichTextDisplay td {
              font-size: 11px !important;
              padding: 4px !important;
              word-break: break-word !important;
            }
          }
        `;
        document.head.appendChild(style);
    }

    // Đánh số thứ tự và xử lý dòng tổng cộng
    function numberRows() {
        const tableContainer = document.querySelector('.CommonLongTextRichTextDisplay');
        if (!tableContainer) return;
        const tables = tableContainer.getElementsByTagName('table');
        if (tables.length < 3) return;
        const productTable = tables[2];
        if (!productTable) return;
        const rows = productTable.rows;
        if (rows.length < 2) return;
        // Đánh số thứ tự từ 1
        let stt = 1;
        for (let i = 1; i < rows.length - 1; i++) {
            const row = rows[i];
            if (!row || !row.cells || row.cells.length < 2) continue;
            const sttCell = row.cells[0];
            const codeCell = row.cells[1];
            // Chỉ đánh số nếu có mã hàng
            if (codeCell && codeCell.textContent.trim() !== '') {
                sttCell.textContent = stt++;
                sttCell.style.textAlign = 'center';
            }
        }
        // Xử lý dòng tổng cộng
        const lastRow = rows[rows.length - 1];
        if (lastRow && lastRow.cells.length > 0) {
            const firstCell = lastRow.cells[0];
            if (firstCell.textContent.trim().toLowerCase().includes('tổng')) {
                firstCell.setAttribute('colspan', '4');
                firstCell.style.textAlign = 'left';
                firstCell.style.paddingLeft = '8px';
                firstCell.style.borderRight = 'none';
                lastRow.cells[1].style.display = 'none';
                lastRow.cells[2].style.display = 'none';
                lastRow.cells[3].style.display = 'none';
            }
        }
    }

    // Thêm nút in vào đầu action bar
    function addPrintButton() {
        var actionBar = document.querySelector('.SlideshowPage__action-bar');
        if (!actionBar || document.getElementById('bookmarklet-print-btn')) return;

        // Tạo nút in giống các action khác, chỉ icon, dùng đúng class
        var btn = document.createElement('span');
        btn.id = 'bookmarklet-print-btn';
        btn.className = 'ASTappable GenericActionButton CSSRolloutContainer OutsideReactRootRollout GenericActionButton--large-mode GenericActionButton--max-height ASTappable--pointer';
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('role', 'button');
        btn.setAttribute('title', 'In hóa đơn');
        btn.style = 'margin-left:10px;';

        // Sử dụng SVG icon giống action mặc định (nếu AppSheet dùng SVG)
        btn.innerHTML = `
          <div class="GenericActionButton__paddington" style="display:flex;align-items:center;justify-content:center;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="13" rx="2" fill="#1976d2"/>
              <rect x="6" y="3" width="12" height="4" rx="1" fill="#1976d2"/>
              <rect x="8" y="15" width="8" height="2" rx="1" fill="white"/>
              <rect x="8" y="11" width="8" height="2" rx="1" fill="white"/>
            </svg>
            <span class="sr-only">In hóa đơn</span>
          </div>
        `;

        // Hiệu ứng hover
        btn.onmouseover = function() { btn.querySelector('rect').setAttribute('fill', '#1251a3'); };
        btn.onmouseout = function() { btn.querySelector('rect').setAttribute('fill', '#1976d2'); };

        btn.onclick = function() {
            var el = document.querySelector('.CommonLongTextRichTextDisplay');
            if (!el) { alert('Không tìm thấy hóa đơn!'); return; }
            var clone = el.cloneNode(true);
            var w = window.open('', '', 'width=1122,height=793');
            w.document.write('<html><head><title>In hóa đơn</title><style>' + document.getElementById('bill-css-style').textContent + '</style></head><body>' + clone.outerHTML + '</body></html>');
            w.document.close();
            setTimeout(function () { w.print(); w.close(); }, 500);
        };

        var wrap = document.createElement('div');
        wrap.className = 'SlideshowPage__header-action';
        wrap.appendChild(btn);
        actionBar.insertBefore(wrap, actionBar.firstChild);
    }

    // Hàm khởi tạo
    function initAutoBillFormatter() {
        injectBillCss();
        setTimeout(() => {
            numberRows();
            addPrintButton();
        }, 500);
        // Theo dõi thay đổi DOM để tự động format lại khi cần
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                numberRows();
                addPrintButton();
            }, 100);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Khởi động khi trang load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoBillFormatter);
    } else {
        initAutoBillFormatter();
    }
})();