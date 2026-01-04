// ==UserScript==
// @name         學生信息打印腳本 (完整版-學號清理版)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  在 https://shulin.twco.org.tw/ 網域下偵測學生編號和姓名,生成 QR 碼並製作可列印文件（單筆或多筆，帶 QR 碼驗證，左邊預留 2.5mm，支持複雜表格格式，學號清理）
// @match        https://shulin.twco.org.tw/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/498968/%E5%AD%B8%E7%94%9F%E4%BF%A1%E6%81%AF%E6%89%93%E5%8D%B0%E8%85%B3%E6%9C%AC%20%28%E5%AE%8C%E6%95%B4%E7%89%88-%E5%AD%B8%E8%99%9F%E6%B8%85%E7%90%86%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/498968/%E5%AD%B8%E7%94%9F%E4%BF%A1%E6%81%AF%E6%89%93%E5%8D%B0%E8%85%B3%E6%9C%AC%20%28%E5%AE%8C%E6%95%B4%E7%89%88-%E5%AD%B8%E8%99%9F%E6%B8%85%E7%90%86%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 創建按鈕容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '0';
    buttonContainer.style.left = '0';
    buttonContainer.style.width = '100%';
    buttonContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.padding = '5px';
    buttonContainer.style.textAlign = 'center';
    document.body.insertBefore(buttonContainer, document.body.firstChild);

    // 調整頁面內容，使其不被按鈕遮擋
    document.body.style.paddingTop = '40px';

    // 創建按鈕函數
    function createButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.margin = '0 5px';
        return button;
    }

    // 創建按鈕
    const singlePrintButton = createButton('單筆列印');
    const multiplePrintButton = createButton('多筆列印');
    const receiptSingleDetectButton = createButton('收據學號單筆偵測');
    const receiptMultipleDetectButton = createButton('收據學號多筆偵測');

    // 添加按鈕到容器
    buttonContainer.appendChild(singlePrintButton);
    buttonContainer.appendChild(multiplePrintButton);
    buttonContainer.appendChild(receiptSingleDetectButton);
    buttonContainer.appendChild(receiptMultipleDetectButton);

    // 清理學號的函數
    function cleanStudentId(id) {
        const match = id.match(/SL\d+/);
        return match ? match[0] : id;
    }

    // 獲取學生信息的函數（原版，加入學號清理）
    function getStudentInfos() {
        const studentInfos = [];
        const elements = document.body.getElementsByTagName('*');
        for (let element of elements) {
            if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
                const text = element.textContent.trim();
                if (/SL\d+/.test(text)) {
                    const studentId = cleanStudentId(text);
                    let sibling = element.nextSibling;
                    while (sibling) {
                        if (sibling.nodeType === 1) {
                            const name = sibling.textContent.trim();
                            if (/^[\u4e00-\u9fa5]{2,}$/.test(name)) {
                                studentInfos.push({ id: studentId, name: name });
                                break;
                            }
                        }
                        sibling = sibling.nextSibling;
                    }
                }
            }
        }
        return studentInfos;
    }

    // 獲取收據格式學生信息的函數（改進版，加入學號清理）
    function getReceiptStudentInfos() {
        const studentInfos = [];
        const elements = document.body.getElementsByTagName('*');
        const fullText = document.body.innerText;

        // 使用正則表達式匹配複雜表格格式
        const regex = /SL\d+\s+([\u4e00-\u9fa5]{2,})/g;
        let match;
        while ((match = regex.exec(fullText)) !== null) {
            const id = cleanStudentId(match[0].split(' ')[0]);
            const name = match[1].trim();
            studentInfos.push({ id, name });
        }

        // 如果沒有找到匹配，則使用原來的方法
        if (studentInfos.length === 0) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
                    const text = element.textContent.trim();
                    if (/SL\d+/.test(text)) {
                        const studentId = cleanStudentId(text);
                        let name = '';

                        if (i + 1 < elements.length) {
                            const nextElement = elements[i + 1];
                            if (nextElement.childNodes.length === 1 && nextElement.childNodes[0].nodeType === 3) {
                                const nextText = nextElement.textContent.trim();
                                if (/^[\u4e00-\u9fa5]{2,}$/.test(nextText)) {
                                    name = nextText;
                                }
                            }
                        }

                        if (name) {
                            studentInfos.push({ id: studentId, name: name });
                        }
                    } else {
                        const match = text.match(/(SL\d+)\s+([\u4e00-\u9fa5]{2,})$/);
                        if (match) {
                            studentInfos.push({ id: cleanStudentId(match[1]), name: match[2] });
                        }
                    }
                }
            }
        }

        return studentInfos;
    }

    // 生成打印內容的函數
    function generatePrintContent(studentInfos) {
        let printContent = '<html><head><title>學生信息</title>';
        printContent += '<style>';
        printContent += 'body { font-family: Arial, sans-serif; margin: 0; padding: 0; }';
        printContent += '.page { width: 3cm; height: 1.5cm; page-break-after: always; display: flex; align-items: center; justify-content: flex-start; padding-left: 2.5mm; box-sizing: border-box; }';
        printContent += '.student-info { display: flex; align-items: center; justify-content: flex-start; width: 2.75cm; height: 100%; box-sizing: border-box; }';
        printContent += '.qr-code { width: 1.1cm; height: 1.1cm; display: flex; align-items: center; justify-content: center; margin-right: 0.1cm; }';
        printContent += '.info { flex: 1; height: 1.1cm; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }';
        printContent += '.info p { margin: 0; padding: 0; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; width: 100%; }';
        printContent += '.info .student-id { font-size: 10pt; }';
        printContent += '.info .student-name { font-size: 12pt; --char-count: attr(data-char-count); font-size: calc(12pt * min(1, 4 / var(--char-count))); }';
        printContent += '.test-area { display: none; }';
        printContent += '@media print { ';
        printContent += '  @page { size: 3cm 1.5cm; margin: 0; }';
        printContent += '  body { margin: 0; padding: 0; }';
        printContent += '  .page { page-break-after: always; }';
        printContent += '  button, .test-area { display: none; }';
        printContent += '  html { transform: scale(0.95); transform-origin: top left; }';
        printContent += '}';
        printContent += '</style></head><body>';

        for (let info of studentInfos) {
            printContent += '<div class="page">';
            printContent += `<div class="student-info">`;
            printContent += `<div class="qr-code" id="qr-${info.id}"></div>`;
            printContent += `<div class="info"><p class="student-id">${info.id}</p><p class="student-name" data-char-count="${info.name.length}">${info.name}</p></div>`;
            printContent += `</div>`;
            printContent += '</div>';
        }

        // 添加測試區域（在打印時不顯示）
        printContent += '<div class="test-area">';
        printContent += '<h3>QR 碼測試區域</h3>';
        printContent += '<input type="file" id="qr-input" accept="image/*">';
        printContent += '<div id="qr-result"></div>';
        printContent += '</div>';

        printContent += '<button onclick="window.print()">列印</button>';
        printContent += '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>';
        printContent += '<script src="https://unpkg.com/qr-scanner/qr-scanner.umd.min.js"></script>';
        printContent += '<script>';
        printContent += 'function generateQRCodes() {';
        for (let info of studentInfos) {
            printContent += `
                try {
                    new QRCode(document.getElementById("qr-${info.id}"), {
                        text: "${info.id}",
                        width: 42,
                        height: 42,
                        correctLevel: QRCode.CorrectLevel.M
                    });
                    console.log("QR code generated successfully for ${info.id}");
                } catch (error) {
                    console.error("Error generating QR code for ${info.id}:", error);
                }
            `;
        }
        printContent += '}';
        printContent += 'window.onload = function() {';
        printContent += '  generateQRCodes();';
        printContent += '  setupQRTest();';
        printContent += '};';
        printContent += 'function setupQRTest() {';
        printContent += '  const qrInput = document.getElementById("qr-input");';
        printContent += '  const qrResult = document.getElementById("qr-result");';
        printContent += '  qrInput.addEventListener("change", function(e) {';
        printContent += '    const file = e.target.files[0];';
        printContent += '    if (file) {';
        printContent += '      QrScanner.scanImage(file)';
        printContent += '        .then(result => qrResult.textContent = "掃描結果: " + result)';
        printContent += '        .catch(error => qrResult.textContent = "掃描錯誤: " + error || "無法掃描");';
        printContent += '    }';
        printContent += '  });';
        printContent += '}';
        printContent += '</script></body></html>';

        return printContent;
    }

    // 打開打印窗口的函數
    function openPrintWindow(content) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(content);
        printWindow.document.close();
    }

    // 單筆列印按鈕的點擊事件
    singlePrintButton.addEventListener('click', function() {
        const studentInfos = getStudentInfos();
        if (studentInfos.length > 0) {
            const singleStudentInfo = [studentInfos[0]]; // 只取第一筆資料
            const printContent = generatePrintContent(singleStudentInfo);
            openPrintWindow(printContent);
        } else {
            alert('未找到學生信息');
        }
    });

    // 多筆列印按鈕的點擊事件
    multiplePrintButton.addEventListener('click', function() {
        const studentInfos = getStudentInfos();
        if (studentInfos.length > 0) {
            const printContent = generatePrintContent(studentInfos);
            openPrintWindow(printContent);
        } else {
            alert('未找到學生信息');
        }
    });

    // 收據學號單筆偵測按鈕的點擊事件
    receiptSingleDetectButton.addEventListener('click', function() {
        const studentInfos = getReceiptStudentInfos();
        if (studentInfos.length > 0) {
            const singleStudentInfo = [studentInfos[0]]; // 只取第一筆資料
            const printContent = generatePrintContent(singleStudentInfo);
            openPrintWindow(printContent);
        } else {
            alert('未找到收據格式的學生信息');
        }
    });

    // 收據學號多筆偵測按鈕的點擊事件
    receiptMultipleDetectButton.addEventListener('click', function() {
        const studentInfos = getReceiptStudentInfos();
        if (studentInfos.length > 0) {
            const printContent = generatePrintContent(studentInfos);
            openPrintWindow(printContent);
        } else {
            alert('未找到收據格式的學生信息');
        }
    });
})();