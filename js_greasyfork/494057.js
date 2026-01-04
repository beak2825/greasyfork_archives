// ==UserScript==
// @name         SolScan Address Notes
// @namespace    https://your.namespace.com
// @version      1.0
// @description  Add notes to specific addresses on SolScan pages and open Cielo Finance profile page
// @author       makima1901
// @match        https://solscan.io/account/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494057/SolScan%20Address%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/494057/SolScan%20Address%20Notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let counter = 0;

    const intervalId = setInterval(function() {
        // 获取地址
        const urlParts = window.location.pathname.split('/');
        const address = urlParts[urlParts.length - 1];

        // 找到地址元素
        const addressElement = document.querySelector('span.break-words');

        // 检查并添加备注span
        const noteSpan = checkAndAddNoteSpan(addressElement, address);

        // 添加编辑按钮
        const editButton = addEditButton(addressElement, address);

        if (noteSpan) {
            clearInterval(intervalId); // 如果存在备注，则停止执行
        }

        counter++;
        if (counter >= 10) {
            clearInterval(intervalId); // 当计数器达到10时停止执行
        }
    }, 500); // 每隔500毫秒执行一次

    // 添加编辑按钮
    function addEditButton(addressElement, address) {
        let btn = document.querySelector('.editNote')
        if (btn) return;
        const editButton = document.createElement('button');
        editButton.className = "editNote";
        editButton.innerHTML = 'Edit Note';
        editButton.style.position = 'relative';
        editButton.style.top = '-2px';
        editButton.style.left = '5px';
        editButton.style.cursor = 'pointer';
        editButton.style.background = '#007bff';
        editButton.style.color = '#fff';
        editButton.style.border = 'none';
        editButton.style.borderRadius = '5px';
        editButton.style.padding = '5px 10px';
        addressElement.style.position = 'relative';
        addressElement.appendChild(editButton);

        // 添加 Cielo Finance 按钮
        addCieloButton(address, editButton);

        // 点击编辑按钮
        editButton.addEventListener('click', function() {
            const note = prompt('Update note for this address:', GM_getValue(address) || '');
            if (note !== null) {
                GM_setValue(address, note.trim());
                checkAndAddNoteSpan(addressElement, address);
            }
        });

        return editButton;
    }

    // 检查并添加备注span
    function checkAndAddNoteSpan(addressElement, address) {
        const note = GM_getValue(address);
        if (note && note.trim() !== '') {
            let noteSpan = addressElement.querySelector('.note-span');
            if (!noteSpan) {
                noteSpan = document.createElement('span');
                noteSpan.className = 'note-span';
                addressElement.insertBefore(noteSpan, addressElement.firstChild);
            }
            noteSpan.textContent = `[${note}]`;
            noteSpan.style.color = '#ff8c00'; // 橙色
            return noteSpan;
        }
        return null;
    }

    // 添加 Cielo Finance 按钮
    function addCieloButton(address, editButton) {
        const cieloButton = document.createElement('button');
        cieloButton.innerHTML = 'Cielo Finance';
        cieloButton.style.position = 'absolute';
        cieloButton.style.top = '-30px';
        cieloButton.style.right = '-200px'; // 右边100px的位置
        cieloButton.style.cursor = 'pointer';
        cieloButton.style.background = '#28a745';
        cieloButton.style.color = '#fff';
        cieloButton.style.border = 'none';
        cieloButton.style.borderRadius = '5px';
        cieloButton.style.padding = '5px 10px';
        editButton.parentNode.appendChild(cieloButton);

        // 点击 Cielo Finance 按钮
        cieloButton.addEventListener('click', function() {
//            https://app.cielo.finance/profile/Go1qL3SgAzejm3qry4C93Wq7uT9MUg9EopWv4HVLgkFz?tab=tokenpnl&timeframe=30d
            window.open(`https://app.cielo.finance/profile/${address}?tab=tokenpnl&timeframe=30d`, '_blank');
        });
    }
})();
