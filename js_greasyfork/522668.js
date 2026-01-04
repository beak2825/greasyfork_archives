// ==UserScript==
// @name         厦门大学课程表导出助手-ICS
// @version      2024-01-4
// @description  导出厦门大学课表为 ICS 文件
// @author       yangqian
// @match        https://jw.xmu.edu.cn/gsapp/sys/wdkbapp/*
// @grant        none
// @namespace https://greasyfork.org/users/1392448
// @downloadURL https://update.greasyfork.org/scripts/522668/%E5%8E%A6%E9%97%A8%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B-ICS.user.js
// @updateURL https://update.greasyfork.org/scripts/522668/%E5%8E%A6%E9%97%A8%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B-ICS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const START_DATE = '2025-02-17' //第一个周一

    const waitUntilElementPresent = (cssLocator, callback) => {
        const checkExist = setInterval(() => {
            if (document.querySelector(cssLocator)) {
                clearInterval(checkExist);
                callback();
                return;
            }
        }, 100);
    };

    waitUntilElementPresent(".arrage", () => {
        const tab = document.getElementById("xsXx").firstElementChild;
        const getButton = document.createElement('a');
        getButton.innerHTML = "获取ICS";
        getButton.classList.add("bh-btn-default", "bh-btn");
        tab.appendChild(getButton);
        getButton.addEventListener('click', main);
    });

    async function main() {
        const HEADERS = [
            "BEGIN:VCALENDAR",
            "METHOD:PUBLISH",
            "VERSION:2.0",
            "X-WR-CALNAME:课表",
            "X-WR-TIMEZONE:Asia/Shanghai",
            "CALSCALE:GREGORIAN",
            "BEGIN:VTIMEZONE",
            "TZID:Asia/Shanghai",
            "END:VTIMEZONE"
        ];

        const FOOTERS = ["END:VCALENDAR"];

        const timetable = [
            [8, 0],
            [10, 10],
            [14, 30],
            [16, 40],
            [19, 10]
        ];

        function getStartTime(jc) {
            const time = timetable[jc - 1];
            return `${time[0].toString().padStart(2, '0')}${time[1].toString().padStart(2, '0')}00`;
        }

        function getEndTime(jc) {
            const time = timetable[jc - 1].map((num, index) => num + [1, 40][index]);
            if (time[1] >= 60) {
                time[0] += 1;
                time[1] -= 60;
            }
            return `${time[0].toString().padStart(2, '0')}${time[1].toString().padStart(2, '0')}00`;
        }

        function getDates(day, week) {
            const startDate = new Date(START_DATE);
            startDate.setDate(startDate.getDate() + day + 7 * week);
            return `${startDate.getFullYear()}${(startDate.getMonth() + 1).toString().padStart(2, '0')}${startDate.getDate().toString().padStart(2, '0')}`;
        }

        function getDT(jc, day, week) {
            const date = getDates(day, week);
            const start = getStartTime(jc);
            const end = getEndTime(jc);
            return `DTSTART;TZID=Asia/Shanghai:${date}T${start}\nDTEND;TZID=Asia/Shanghai:${date}T${end}`;
        }

        const tds = document.getElementsByTagName("td");
        const classes = [];

        for (const td of tds) {
            if (td.textContent && td.getAttribute("jc") && td.getAttribute("jc") % 2 !== 0) {
                const weeksText = td.children[0].children[1].textContent.trim();
                const weeksMatch = weeksText.match(/(\d+)-(\d+)(单|双)?周/);
                console.log(weeksMatch);
                if (!weeksMatch) continue;

                const [_, startWeek, endWeek, weekType] = weeksMatch;
                let weekCount = endWeek - startWeek + 1;
                if (weekType === "单" || weekType === "双") {
                    weekCount = (endWeek - startWeek) / 2 + 1
                }
                const interval = weekType === "单" || weekType === "双" ? ";INTERVAL=2" : "";
                const jc = (parseInt(td.getAttribute("jc"), 10) + 1) / 2;
                const day = parseInt(td.getAttribute("xq"), 10) - 1;

                const event = [
                    "BEGIN:VEVENT",
                    `SUMMARY:${td.children[0].children[2].textContent.replace(/\(.*?\)/g, '')}`,
                    `DESCRIPTION:${td.children[0].children[3].textContent}`,
                    getDT(jc, day, startWeek - 1),
                    `LOCATION:${td.children[0].children[4].textContent.replace(/（.*?）/g, '')}`,
                    `RRULE:FREQ=WEEKLY;COUNT=${weekCount}${interval}`,
                    "END:VEVENT"
                ];

                classes.push(event.join('\n'));
            }
        }

        const textContent = [...HEADERS, ...classes, ...FOOTERS].join('\n');
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `schedule_${new Date().toISOString().slice(0, 10)}.ics`;
        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
})();
