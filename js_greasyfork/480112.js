// ==UserScript==
// @name         計算時數小工具
// @namespace    amltbXlfd3U=
// @version      0.9
// @description  計算累計時數
// @author       Jimmy
// @match        https://cy.iwerp.net/portal/page/new_home.xhtml
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480112/%E8%A8%88%E7%AE%97%E6%99%82%E6%95%B8%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/480112/%E8%A8%88%E7%AE%97%E6%99%82%E6%95%B8%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function main() {
        removeMachine();

        const tableContainer = document.querySelector('#formTemplate\\:attend_rec_datatable');

        if (tableContainer) {
            const panelContainer = document.querySelector('#formTemplate\\:attend_rec_panel_content');
            const container = document.createElement('div');
            container.setAttribute('id', 'formTemplate:result');
            container.style.paddingTop = '25px';
            container.style.textAlign = 'center';

            if (!document.querySelector('#formTemplate\\:result')) {
                panelContainer.appendChild(container);
            }

            const table = tableContainer.querySelector('table[role="grid"]')
            const tableObj = tableToObj(table);
            const signInTime = tableObj[0].簽到.match(/\b\d{2}:\d{2}\b/);

            const result = calculateWorkSchedule(signInTime);
            let message = result.message;

            if (result.lateMinutes > 0) {
                message += `<br>遲到時間: ${result.lateMinutes} 分鐘`;

                if (result.requiredLeave) {
                    message += `<br>應請假從 ${result.requiredLeave.start} 到 ${result.requiredLeave.end}`;
                } else {
                    message += "<br>無需請假";
                }
            }
            document.querySelector('#formTemplate\\:result').innerHTML = message;
        }
    }

    function tableToObj(table) {
        var rows = table.rows;
        var propCells = rows[0].cells;
        var propNames = [];
        var results = [];
        var obj, row, cells;

        for (var i = 0, iLen = propCells.length; i < iLen; i++) {
            propNames.push(propCells[i].textContent || propCells[i].innerText);
        }

        for (var j = 1, jLen = rows.length; j < jLen; j++) {
            cells = rows[j].cells;
            obj = {};

            for (var k = 0; k < iLen; k++) {
                obj[propNames[k]] = cells[k].textContent || cells[k].innerText;
            }
            results.push(obj)
        }
        return results;
    }

    function debounce(fn, delay) {
        var timeout = null;
        return function () {
            if (timeout) {
                return;
            } else {
                timeout = setTimeout(function () {
                    fn();
                    timeout = null;
                }, delay);
            }
        }
    }

    function calculateWorkSchedule(checkInTime) {
        const workSchedules = [
            { start: "08:00", end: "17:00", bufferEnd: "08:15" },
            { start: "08:30", end: "17:30", bufferEnd: "08:45" },
            { start: "09:00", end: "18:00", bufferEnd: "09:15" },
            { start: "09:30", end: "18:30", bufferEnd: "09:45" }
        ];

        const checkIn = new Date(`1970-01-01T${checkInTime}:00`);

        let schedule = workSchedules[3];

        for (const ws of workSchedules) {
            if (checkIn <= new Date(`1970-01-01T${ws.bufferEnd}:00`)) {
                schedule = ws;
                break;
            }
        }

        const startWorkTime = new Date(`1970-01-01T${schedule.start}:00`);
        const endWorkTime = new Date(`1970-01-01T${schedule.end}:00`);
        const bufferTime = new Date(startWorkTime.getTime() + 15 * 60000);

        let lateMinutes = 0;
        let leaveStart = null;
        let leaveEnd = null;

        if (checkIn > bufferTime) {
            const fixedStartWorkTime = new Date(`1970-01-01T09:30:00`);
            const fixedEndWorkTime = new Date(`1970-01-01T18:30:00`);
            const fixedBufferTime = new Date(fixedStartWorkTime.getTime() + 15 * 60000);

            lateMinutes = Math.ceil((checkIn - fixedStartWorkTime) / 60000);
            const leaveDuration = Math.max(60, Math.ceil(lateMinutes / 30) * 30); // 最少請假1小時，每30分鐘遞增
            leaveStart = fixedStartWorkTime;
            leaveEnd = new Date(fixedStartWorkTime.getTime() + leaveDuration * 60000);

            return {
                message: `您的下班時間是${fixedEndWorkTime.toTimeString().substr(0, 5)}`,
                lateMinutes: lateMinutes,
                requiredLeave: {
                    start: leaveStart.toTimeString().substr(0, 5),
                    end: leaveEnd.toTimeString().substr(0, 5)
                }
            };
        }

        return {
            message: `您的下班時間是${schedule.end}`,
            lateMinutes: lateMinutes,
            requiredLeave: null
        };
    }

    function removeMachine() {
        var cells = document.querySelectorAll('td');

        cells.forEach(function (cell) {
            var regex = /(\d{2}:\d{2})\((.*?)\)/;
            var match = regex.exec(cell.textContent);

            if (match !== null) {
                var time = match[1];
                var removedContent = match[2];
                cell.dataset.removedContent = removedContent;

                cell.textContent = time;

                cell.addEventListener('mouseover', function () {
                    cell.textContent = time + ' (' + removedContent + ')';
                });

                cell.addEventListener('mouseout', function () {
                    cell.textContent = time;
                });
            }
        });
    }

    main();
    var el = document.documentElement;
    el.addEventListener('DOMSubtreeModified', debounce(main, 2000));
})();