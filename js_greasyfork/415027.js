// ==UserScript==
// @name         ジョブカン 工数未入力検出
// @namespace    https://greasyfork.org/users/5795
// @version      0.3
// @description  労働時間をつけたのに工数が0の場合に、工数入力ミスとしてハイライトする
// @author       ikeyan
// @match        https://ssl.jobcan.jp/employee/man-hour-manage
// @match        https://ssl.jobcan.jp/employee/man-hour-manage?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415027/%E3%82%B8%E3%83%A7%E3%83%96%E3%82%AB%E3%83%B3%20%E5%B7%A5%E6%95%B0%E6%9C%AA%E5%85%A5%E5%8A%9B%E6%A4%9C%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/415027/%E3%82%B8%E3%83%A7%E3%83%96%E3%82%AB%E3%83%B3%20%E5%B7%A5%E6%95%B0%E6%9C%AA%E5%85%A5%E5%8A%9B%E6%A4%9C%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = new CSSStyleSheet();
    style.replaceSync(`
    .jbc-table-danger th, .jbc-table-danger td {
        background-color: #FED0D0;
    }
    `);
    document.adoptedStyleSheets.push(style);

    for (const tr of document.querySelectorAll('#search-result>table>tbody>tr')) {
        const [, tdWorkTime, tdManHour, ] = tr.children;
        if (tdWorkTime.textContent.trim() !== '00:00' && tdManHour.textContent.trim() === '入力がありません') {
            tr.classList.add('jbc-table-danger');
        }
    }

    document.addEventListener('input', ev => {
        const workTime = document.querySelector('#hiddenTime').value;

        const {target} = ev;
        if (target.nodeName == 'INPUT' && target.name == 'minutes[]' && target.value == 'rem') {
            const man_hour_table = target.closest('.man-hour-table-edit');
            let manHourSum = 0;
            for (const minute of man_hour_table.querySelectorAll('[name="minutes[]"]')) {
                const value = minute.value;
                if (value.match(/^\d+(:\d+)?$/)) {
                    const [h, m] = ('00:' + value).split(':').slice(-2).map(Number);
                    manHourSum += h * 60 + m;
                }
            }
            const remainingTime = workTime - manHourSum;
            if (remainingTime >= 0) {
                target.value = `${Math.floor(remainingTime / 60)}:${remainingTime % 60}`;
            } else {
                target.value = `-${Math.floor(-remainingTime / 60)}:${-remainingTime % 60}`;
            }
        }
        if (target.nodeName == 'SELECT' && target.name == 'projects[]' && target.value !== '') {
            const tr = target.closest('tr');
            const tasks_input = tr.querySelector('[name="tasks[]"]');
            setTimeout(() => {
                if (tasks_input.value === '') {
                    const optionToSelect = [...tasks_input.options].find(option => option.textContent == 'Other');
                    if (optionToSelect) {
                        tasks_input.selectedIndex = optionToSelect.index;
                    }
                }
            }, 0);
        }
    });
})();