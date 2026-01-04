// ==UserScript==
// @name         Batch Upload Visitor List
// @namespace    http://tampermonkey.net/
// @version      2.10
// @description  Create customized visitor forms based on user needs, with new Excel columns.
// @author
// @license      MIT
// @match        https://acs-rightcrowd-apac-prod.corp.amazon.com/RightCrowd
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/500161/Batch%20Upload%20Visitor%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/500161/Batch%20Upload%20Visitor%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 確保按鈕只創建一次
    if (window.customButtonCreated) {
        return;
    }
    window.customButtonCreated = true;

    // 創建按鈕容器
    var buttonContainer = $('<div id="custom-button-container">Create Forms</div>').css({
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '150px',
        height: '50px',
        'border-radius': '5px',
        background: '#4CAF50', // 使用綠色
        color: 'white',
        border: 'none',
        'font-size': '16px',
        'line-height': '50px',
        'text-align': 'center',
        'z-index': 10000,
        cursor: 'pointer'
    }).appendTo('body');

    // 創建透明遮罩
    var buttonOverlay = $('<div id="custom-button-overlay"></div>').css({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        'border-radius': '25px',
        cursor: 'pointer'
    }).appendTo(buttonContainer);

    // 創建彈出窗口
    var popup = $('<div id="custom-popup"></div>').css({
        position: 'fixed',
        top: '100px',
        right: '50px',
        width: '20%', // 調整寬度
        height: 'auto', // 自適應高度
        background: 'white',
        border: '2px solid #ccc', // 修改邊框顏色
        'border-radius': '10px',
        padding: '10px', // 調整內邊距
        'box-shadow': '0 0 10px rgba(0,0,0,0.1)', // 修改陰影顏色
        'z-index': 9999,
        display: 'none',
        'box-sizing': 'border-box',
        color: 'black'
    }).appendTo('body');

    // 關閉按鈕
    var closeButton = $('<button id="custom-close-button">&times;</button>').css({
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        width: '20px',
        height: '20px',
        'border-radius': '10px',
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        'font-size': '12px',
        cursor: 'pointer',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center'
    }).appendTo(popup);

    closeButton.on('click', function() {
        popup.hide();
        if (dateInput) {
            dateInput.remove(); // 隱藏日期輸入欄
        }
    });

    $(document).on('click', function(event) {
        if (!$(event.target).closest(popup).length && !$(event.target).closest(buttonContainer).length) {
            popup.hide();
            if (dateInput) {
                dateInput.remove(); // 隱藏日期輸入欄
            }
        }
    });

    var dateButton = $('<button id="custom-date-button">請選擇日期</button>').css({
        width: '100%', // 保持同寬
        padding: '10px',
        'margin-bottom': '10px',
        'background-color': '#eee', // 修改背景顏色
        'border': '1px solid #ccc', // 修改邊框顏色
        'font-size': '16px',
        'cursor': 'pointer',
        'box-sizing': 'border-box'
    }).appendTo(popup);

    var inputField = $('<textarea id="custom-input-field" placeholder="請輸入姓名"></textarea>').css({
        width: '100%', // 保持同寬
        height: '150px', // 調整高度
        padding: '10px',
        'margin-bottom': '10px',
        'font-size': '16px',
        'resize': 'none',
        'box-sizing': 'border-box'
    }).appendTo(popup);

    var outputButton = $('<button id="custom-output-button">輸出檔案</button>').css({
        width: '100%', // 保持同寬
        padding: '10px',
        'background-color': '#eee', // 修改背景顏色
        'border': '1px solid #ccc', // 修改邊框顏色
        'font-size': '16px',
        'cursor': 'pointer',
        'box-sizing': 'border-box'
    }).appendTo(popup);

    buttonContainer.on('click', function() {
        popup.toggle();
    });

    // 預設日期 (yyyy-mm-dd)
    var selectedDate = new Date().toISOString().slice(0, 10);
    var dateInput;

    // 日期按鈕邏輯
    dateButton.on('click', function() {
        if (!dateInput) {
            dateInput = $('<input id="custom-date-input" type="date" value="' + selectedDate + '">').css({
                position: 'absolute',
                top: (popup.offset().top - 23) + 'px', // 與彈出窗口頂部對齊
                left: (popup.offset().left - 225) + 'px', // 緊靠在彈出窗口左側
                'z-index': 10000
            }).appendTo('body').focus().on('change', function() {
                selectedDate = this.value;
                dateButton.text(selectedDate);
                dateInput.remove();
                dateInput = null;
            }).on('blur', function() {
                dateInput.remove();
                dateInput = null;
            });

            // 自動展開日曆
            if (dateInput[0].showPicker) {
                dateInput[0].showPicker();
            }
        }
    });

    // 監聽輸入框，動態更新「輸出檔案 (n人)」
    inputField.on('input', function() {
        var names = $(this).val().split('\n').filter(name => name.trim() !== '').length;
        if ($(this).val()) {
            $(this).attr('placeholder', '');
        } else {
            $(this).attr('placeholder', '請輸入姓名');
        }
        outputButton.text('輸出檔案' + (names > 0 ? ` (${names}人)` : ''));
    });

    // 將字串轉為 ArrayBuffer（XLSX官方範例）
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    // ==================== 重點：修改後的 Excel 生成部分 ==================== //
    outputButton.on('click', function() {
        var names = inputField.val().split('\n').map(name => name.trim()).filter(name => name !== '');
        if (names.length === 0) {
            alert("請輸入至少一個姓名");
            return;
        }

        // 1) 解析日期，去除前置零
        //    例如 "2025-03-04" => [2025, 3, 4] => "2025-3-4T09:00:00"
        var parts = selectedDate.split('-').map(Number); // [year, month, day]
        var startDate = parts[0] + '-' + parts[1] + '-' + parts[2] + 'T09:00:00';  // e.g. "2025-3-4T09:00:00"
        var endDate   = parts[0] + '-' + parts[1] + '-' + parts[2] + 'T17:00:00';  // e.g. "2025-3-4T17:00:00"

        // 2) 欄位設定：A~J，共 10 欄
        //    A: Visitor First Name
        //    B: Visitor Last Name
        //    C: Visitor Email
        //    D: Company
        //    E: Visitor Category
        //    F: Site Code
        //    G: Campus Building
        //    H: Visit Start Date
        //    I: Visit End Date
        //    J: Escort Login (ANT)
        var data = [[
            'Visitor First Name',   // A
            'Visitor Last Name',    // B
            'Visitor Email',        // C
            'Company',              // D
            'Visitor Category',     // E
            'Site Code',            // F
            'Campus Building',      // G
            'Visit Start Date',     // H
            'Visit End Date',       // I
            'Escort Login (ANT)'    // J
        ]];

        // 3) 逐列填入使用者輸入的「姓名」
        names.forEach(function(name) {
            data.push([
                name,                       // A
                'AGS SS Team',              // B
                'suzyhsu@amazon.com',       // C
                'Amazon',                   // D
                'Events / Tours / Training',// E
                'TPE14',                    // F (空白)
                '',                         // G
                startDate,                  // H
                endDate,                    // I
                'suzyhsu'                   // J
            ]);
        });

        // 4) 產生 Excel
        var ws = XLSX.utils.aoa_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
        var blob = new Blob([s2ab(wbout)], {type: "application/octet-stream"});
        var url = URL.createObjectURL(blob);

        // 5) 觸發下載
        var a = document.createElement("a");
        a.href = url;
        a.download = "output.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

})();
