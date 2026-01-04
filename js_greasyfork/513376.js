// ==UserScript==
// @name         TEMU 批量打印物流单号
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  精准提取物流单号，生成条形码打印，隐藏 iframe 打印，无空白页
// @match        *://*.kuajingmaihuo.com/*
// @require      https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513376/TEMU%20%E6%89%B9%E9%87%8F%E6%89%93%E5%8D%B0%E7%89%A9%E6%B5%81%E5%8D%95%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/513376/TEMU%20%E6%89%B9%E9%87%8F%E6%89%93%E5%8D%B0%E7%89%A9%E6%B5%81%E5%8D%95%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const logisticsNumbers = new Set();

    /* ========== 提取数字部分 ========== */
    function extractNumbers(text) {
        // 提取所有数字
        const numbers = text.replace(/[^0-9]/g, '');
        return numbers || text; // 如果没有数字，返回原文本
    }

    /* ========== 创建/显示/隐藏按钮 ========== */
    function insertPrintButton() {
        const targetBtn = document.querySelector('button[data-tracking-id="l3iN2mOKj28lEbBM"]');
        let printBtn = document.querySelector('#tm-print-logistics-btn');

        if (targetBtn) {
            if (!printBtn) {
                printBtn = document.createElement('button');
                printBtn.id = 'tm-print-logistics-btn';
                printBtn.textContent = '批量打印物流单号';
                printBtn.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 25%;
                    width: 140px;
                    height: 30px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    z-index: 9999;
                    font-size: 14px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                `;
                printBtn.addEventListener('click', () => {
                    const numbers = Array.from(logisticsNumbers).filter(n => n && n.trim() !== "");
                    if (!numbers.length) {
                        alert('没有可打印的物流单号。');
                        return;
                    }

                    // 生成条形码 SVG
                    const barcodeElements = numbers.map(n => {
                        const numPart = extractNumbers(n);
                        // 创建临时 SVG 元素
                        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        try {
                            JsBarcode(svg, numPart, {
                                format: "CODE128",
                                width: 2.5,
                                height: 60,
                                displayValue: false,
                                margin: 0,
                                marginTop: 2,
                                marginBottom: 2
                            });
                            return `<div class="label">
                                <div class="barcode-wrapper">
                                    <div class="barcode-container">${svg.outerHTML}</div>
                                    <div class="tracking-number">${n}</div>
                                </div>
                            </div>`;
                        } catch (e) {
                            console.error('条形码生成失败:', n, e);
                            return `<div class="label"><div style="text-align:center;padding:10px;">${n}</div></div>`;
                        }
                    }).join('');

                    const html = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <style>
                                * { margin:0; padding:0; box-sizing:border-box; }
                                @page { size: 70mm 20mm; margin: 0; }
                                body { font-family: Arial,sans-serif; margin:0; padding:0; }
                                .label {
                                    width:70mm;
                                    height:20mm;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    page-break-after:always;
                                    box-sizing:border-box;
                                    overflow:hidden;
                                }
                                .barcode-wrapper {
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: space-evenly;
                                    width: 100%;
                                    height: 100%;
                                    padding: 1mm;
                                }
                                .barcode-container {
                                    width: 66mm;
                                    height: 10mm;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }
                                .tracking-number {
                                    font-size: 14px;
                                    font-weight: bold;
                                    text-align: center;
                                    height: 10mm;
                                    line-height: 10mm;
                                    width: 66mm;
                                }
                                .label svg {
                                    max-width: 100%;
                                    height: auto;
                                    max-height: 9mm;
                                }
                            </style>
                        </head>
                        <body>
                            ${barcodeElements}
                        </body>
                        </html>
                    `;

                    const iframe = document.createElement('iframe');
                    iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;right:0;bottom:0;';
                    document.body.appendChild(iframe);
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    doc.open(); doc.write(html); doc.close();

                    // 等待条形码渲染完成后打印
                    setTimeout(() => {
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                        iframe.contentWindow.onafterprint = () => {
                            document.body.removeChild(iframe);
                        };
                    }, 500);
                });
                document.body.appendChild(printBtn);
            } else {
                printBtn.style.display = 'block';
            }
        } else if (printBtn) {
            printBtn.style.display = 'none';
        }
    }

    /* ========== 复选框事件处理 ========== */
    function handleCheckboxChange(event) {
        const checkbox = event.target;
        if (checkbox.type !== 'checkbox') return;

        const row = checkbox.closest('tr.TB_tr_5-117-0.TB_whiteTr_5-117-0')
                || checkbox.closest('tr.TB_tr_5-117-0.TB_greyTr_5-117-0');
        if (!row) return;

        const divs = row.querySelectorAll('div');
        let labelDiv = null;
        divs.forEach(d => {
            if (d.textContent.trim() === '物流单号：') labelDiv = d;
        });
        if (!labelDiv) return;

        const a = labelDiv.nextElementSibling;
        if (!a) return;

        const span = a.querySelector('span');
        if (!span) return;

        const fullText = span.textContent.trim();

        if (checkbox.checked) logisticsNumbers.add(fullText);
        else logisticsNumbers.delete(fullText);
    }

    /* ========== 绑定复选框事件 ========== */
    function attachCheckboxListeners() {
        const checkboxes = document.querySelectorAll('tr.TB_tr_5-117-0 input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.removeEventListener('change', handleCheckboxChange);
            cb.addEventListener('change', handleCheckboxChange);
        });
    }

    /* ========== 页面变化监听 ========== */
    const observer = new MutationObserver(() => {
        attachCheckboxListeners();
        insertPrintButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 页面初始加载
    attachCheckboxListeners();
    insertPrintButton();

})();