// ==UserScript==
// @name         ouc_query_enhance
// @namespace   http://www.haicj.com
// @version      0.1
// @description  增强 ouc 办证车辆查询的功能
// @author       You
// @match        http://www.haicj.com/ouc/xouc/dealer/hyfw_bzcx.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421110/ouc_query_enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/421110/ouc_query_enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
    把字符串的值发送到剪切板
    */
    const copyTextAreaValueToClipBoard = (text) => {
        const area = document.getElementById('result_area');
        area.value = text
        area.select();
        document.execCommand('Copy');
    }

    // 从 table 中提取车牌号码信息
    const queryLicensePlateFromTable = (table) => {
        const plates = [];
        for(let i=0; i < table.rows.length; i++){
            const row = table.rows[i];
            if (row.className && row.className != 'bb') { // bb is table header
                plates.push(row.childNodes[2].innerText);
            }
        }

        return plates;
    }

    const copyPlatesHandler = () => {
        const resultTable = document.querySelector('#bztable');
        const plates = queryLicensePlateFromTable( resultTable);
        // navigator.clipboard.writeText(str); // 只能在 https 中使用
        copyTextAreaValueToClipBoard(plates.join("\n"));
    }

    const addCopyBtn = () => {
        const copyBtn = document.createElement('button');
        const content = document.createTextNode("复制车牌号码到剪切板");
        copyBtn.appendChild(content);
        copyBtn.addEventListener('click', copyPlatesHandler);

        const tableCell = document.querySelector('.title > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(5)');
        tableCell.appendChild(copyBtn);
    }

    const addTextArea = () => {
        const area = document.createElement('textarea');
        document.body.append(area);
        area.setAttribute("id","result_area");
    }

    addCopyBtn();
    addTextArea();
})();