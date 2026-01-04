// ==UserScript==
// @name         Drawbridge 3.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Help to quicklt located alarm on Drawbridge
// @license      MIT
// @author       xiongwev
// @match        https://cw-dashboards.aka.amazon.com/cloudwatch/dashboardInternal?accountId=*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521188/Drawbridge%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/521188/Drawbridge%2030.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        @keyframes blink-animation {
            0% { opacity: 0.7; }
            50% { opacity: 0.3; }
            100% { opacity: 0.7; }
        }
        tr.awsui_row_wih1l_1v07r_356.red-row {
            position: relative;
        }
        tr.awsui_row_wih1l_1v07r_356.red-row::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #d82e1d;
            pointer-events: none;
            animation: blink-animation 2s infinite;
            z-index: 1;
        }
        tr.awsui_row_wih1l_1v07r_356.green-row {
            outline: 3px solid #3cff65 !important;
            outline-offset: -3px !important;
        }
        #highlightButton {
            position: fixed;
            left: 30%;
            top: 30px;
            transform: translateY(-50%);
            z-index: 9999;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 10px;
        }
        #highlightButton:hover {
               background-color: #45a049;
        }
    `);

    function highlightAlarmRows() {
        const rows = document.querySelectorAll('tr.awsui_row_wih1l_1v07r_356');
        rows.forEach(row => {

            const alarmHeader = row.querySelector('th.awsui_resizable-columns_c6tup_et2x0_1092');
            const alarmtext = alarmHeader.querySelector('div.awsui_body-cell-content_c6tup_et2x0_156');

            if (alarmtext && alarmtext.textContent.toLowerCase().includes('alarm')) {
                const valuethtd = row.querySelector('td.awsui_resizable-columns_c6tup_et2x0_1092');
                const valuediv = valuethtd.querySelector('div.awsui_body-cell-content_c6tup_et2x0_156');
                const value = valuediv.querySelector('div.table-cell');
                if (value && value.textContent.trim() === '1') {
                    row.classList.remove('green-row');
                    row.classList.add('red-row');
                }else if (value && value.textContent.trim() === '0') {
                    row.classList.remove('red-row');
                    row.classList.add('green-row');
                }
            }
        });
    }

    function addButton() {
        const button = document.createElement('button');
        button.id = 'highlightButton';
        button.textContent = 'Highlight Alarms';
        button.addEventListener('click', highlightAlarmRows);
        document.body.appendChild(button);
    }

    addButton()

})();