// ==UserScript==
// @name         Copy solved baekjoon problem
// @version      1.1
// @description  Copy the list of problems solved in baekjoon.
// @author       refracta
// @match        https://www.acmicpc.net/status*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acmicpc.net
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/467840
// @downloadURL https://update.greasyfork.org/scripts/488936/Copy%20solved%20baekjoon%20problem.user.js
// @updateURL https://update.greasyfork.org/scripts/488936/Copy%20solved%20baekjoon%20problem.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('button[type=submit]').insertAdjacentHTML('afterend', '<button type="submit" id="copy-button" class="btn btn-primary btn-sm margin-left-3 form-control">이력 복사</button>');
    document.querySelector('#copy-button').addEventListener('click', async function (e) {
        e.preventDefault();
        const trs = Array.from(document.querySelectorAll('#status-table tbody tr')).reverse();
        const info = [];
        for(const tr of trs) {
            const submitNumber = tr.querySelector('td:nth-child(1)').textContent;
            const user = tr.querySelector('td:nth-child(2)').textContent;
            const problemNumber = parseInt(tr.querySelector('td:nth-child(3) a').textContent);
            const tier = parseInt(tr.querySelector('td:nth-child(3) img').src.match(/(\d{1,2})\.svg/)[1]);
            const tierWeight = (Math.floor((tier - 1) / 5)) * 0.25;
            const tierKorean = ['브론즈', '실버', '골드', '플래티넘', '다이아', '루비'][Math.floor((tier - 1) / 5)];
            const time = new Date(parseInt(tr.querySelector('td:nth-child(9) a').dataset.timestamp) * 1000);
            const dateString = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, '0')}-${time.getDate().toString().padStart(2, '0')}`;
            if (!info.some(i => i.problemNumber === problemNumber) && tierWeight > 0) {
                info.push({submitNumber, user, problemNumber, tier, tierWeight, tierKorean, time, dateString});
            }
        }
        const result = info.map(i => `${i.user}\t${i.dateString}\t${i.tierKorean} (${i.problemNumber}번)\t${i.submitNumber}\t_\t${i.tierWeight}\tO`).join('\n');
        console.log(result);
        await window.navigator.clipboard.writeText(result);
        alert(`결과가 클립보드에 복사되었습니다.`);
    });
})();