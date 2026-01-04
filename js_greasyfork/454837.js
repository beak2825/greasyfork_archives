// ==UserScript==
// @name         兰交大实验室学习助手
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动滚动并完成学习内容。
// @author       白白小草
// @match        http://webvpn.lzjtu.edu.cn/http/*/safe/client_pc/sd*
// @match        http://labmis.lzjtu.edu.cn/safe/client_pc/sd*
// @match        https://weread.qq.com/web/reader/*
// @match        https://labsafe.lzjtu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454837/%E5%85%B0%E4%BA%A4%E5%A4%A7%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454837/%E5%85%B0%E4%BA%A4%E5%A4%A7%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function learnNext(rows,learnedCount) {
        let currentRow = Array.from(rows).find(row => !row.classList.contains('已学习'));

        if (currentRow && learnedCount < 10) {
            const button = currentRow.getElementsByTagName('td')[3].getElementsByTagName('button')[0];
            button.click();

            const durationText = currentRow.getElementsByTagName('td')[2].innerText;
            const totalDuration = durationText.split('/')[1].trim();
            const [h, m, s] = totalDuration.split(':').map(Number);
            const totalSeconds = h * 3600 + m * 60 + s + 15;

            setTimeout(() => {
                currentRow.classList.add('已学习');
                learnedCount++;
                const returnButton = document.querySelector('button.ivu-btn-text');
                if (returnButton) {
                    returnButton.click();
                }
                setTimeout(() => {
                    startLearning(); 
                }, 1000); 
            }, totalSeconds * 1000);
        } else if (learnedCount >= 4) {
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    }

    function startLearning() {
        const tbody = document.getElementsByClassName('ivu-table-tbody')[0];

        if (tbody && tbody.getElementsByTagName('tr').length > 0) {
            const rows = tbody.getElementsByTagName('tr');
            let learnedCount = 0;

            learnNext(rows,learnedCount); 
        } else {
            setTimeout(startLearning, 1000);
        }
    }

    window.onload = function() {
        startLearning(); 
    };
})();
