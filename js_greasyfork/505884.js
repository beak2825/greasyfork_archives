// ==UserScript==
// @name         Naver Works Calculator
// @namespace    http://tampermonkey.net/
// @version      0.0.17
// @description  Calculate total work remain time
// @author       K
// @match        *://*.worksmobile.com/my-space/work-statistics
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505884/Naver%20Works%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/505884/Naver%20Works%20Calculator.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    /* ===============================
     * constants
     * =============================== */
    const BASE_WORK_MINUTES = 480; // 8시간
    const HALF_DAY_OFF_MINUTES = [120, 240]; // 반차 / 반반차

    /* ===============================
     * utils
     * =============================== */
    const getWorkUrl = (userId, fromDate, toDate) =>
        `${location.origin}/my-space/work-statistics/list?fromDate=${fromDate}&toDate=${toDate}&empId=${userId}&chkWorkingDay=N&_=${Date.now()}`;

    const formatTime = (totalDiff) => {
        const sign = totalDiff < 0 ? '-' : '+';
        const hours = Math.floor(Math.abs(totalDiff) / 60);
        const minutes = Math.abs(totalDiff) % 60;
        return `${sign}${hours}시간 ${minutes}분`;
    };

    /* ===============================
     * data
     * =============================== */
    const parseWorkTimes = (data) =>
        data.data.list
            .filter(item =>
                item.sumWorkTime &&
                item.sumWorkTime !== '0000' &&
                item.checkYmd !== 'TOTAL'
            )
            .map(item => {
                const hours = parseInt(item.sumWorkTime.substring(0, 2), 10);
                const minutes = parseInt(item.sumWorkTime.substring(2, 4), 10);
                const totalMinutes = hours * 60 + minutes;

                return {
                    checkYmd: new Date(
                        item.checkYmd.replace(
                            /(\d{4})(\d{2})(\d{2})/,
                            '$1-$2-$3'
                        )
                    ),
                    sumWorkTime: totalMinutes,
                    diff: totalMinutes - BASE_WORK_MINUTES
                };
            });

    const calculateTotalRemainWork = (workTimes) =>
        workTimes.reduce((acc, item) => acc + item.diff, 0);

    /* ===============================
     * dom
     * =============================== */
    const findSearchRow = () =>
        document.querySelector('.search-wrap');

    const findFormRow = () =>
        document.querySelector('.form-group');

    const createTotalTimeBox = (withHalfDayOff, withoutHalfDayOff) => {
        const el = document.createElement('div');
        el.className = 'colwrap-item searchStand p-5';
        el.innerHTML = `
            총 추가 근로 시간 :
            반차 포함 ${formatTime(withHalfDayOff)} /
            반차 제외 ${formatTime(withoutHalfDayOff)}
        `;
        return el;
    };
    const formatMinutesToHM = (minutes) => {
        const sign = minutes < 0 ? '-' : '';
        const abs = Math.abs(minutes);
        const h = Math.floor(abs / 60);
        const m = abs % 60;
        return `T ${sign}${h}:${String(m).padStart(2, '0')}`;
    };

    const createDownloadButton = (workTimes) => {
        const button = document.createElement('button');
        button.className = 'btn btn-md flat';
        button.textContent = 'csv 다운로드';

        button.addEventListener('click', () => {
            const now = new Date();
            const yearMonth =
                  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            const csvHeader =
                  '날짜,총 근로 시간(분),차이(분),반차제외 근로시간(분),반차제외 차이(분)\n';

            let totalSumWorkTime = 0;
            let totalDiff = 0;
            let totalSumWorkTimeWithoutHalf = 0;
            let totalDiffWithoutHalf = 0;

            const csvBody = workTimes
            .map(item => {
                const date = item.checkYmd.toISOString().split('T')[0];

                totalSumWorkTime += item.sumWorkTime;
                totalDiff += item.diff;

                // 반차
                if (HALF_DAY_OFF_MINUTES.includes(item.sumWorkTime)) {
                    return `${date},${item.sumWorkTime},${item.diff},,`;
                }

                totalSumWorkTimeWithoutHalf += item.sumWorkTime;
                totalDiffWithoutHalf += item.diff;

                return `${date},${item.sumWorkTime},${item.diff},${item.sumWorkTime},${item.diff}`;
            })
            .join('\n');

            // ✅ 합산 (분)
            const footerMinutes =
                  `\n합계(분),${totalSumWorkTime},${totalDiff},` +
                  `${totalSumWorkTimeWithoutHalf},${totalDiffWithoutHalf}`;

            // ✅ 합산 (시간)
            const footerHours =
                  `\n합계(시간),` +
                  `${formatMinutesToHM(totalSumWorkTime)},` +
                  `${formatMinutesToHM(totalDiff)},` +
                  `${formatMinutesToHM(totalSumWorkTimeWithoutHalf)},` +
                  `${formatMinutesToHM(totalDiffWithoutHalf)}`;

            const csvContent =
                  '\uFEFF' + csvHeader + csvBody + footerMinutes + footerHours;

            const link = document.createElement('a');
            link.href = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
            link.download = `work_times_${yearMonth}.csv`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        return button;
    };



    const updateDOM = (workTimes, withHalfDayOff, withoutHalfDayOff) => {
        findSearchRow()?.appendChild(createDownloadButton(workTimes));
        findFormRow()?.appendChild(
            createTotalTimeBox(withHalfDayOff, withoutHalfDayOff)
        );
    };

    /* ===============================
     * main
     * =============================== */
    const getUserId = async () => {
        const html = await fetch(location.href).then(r => r.text());
        const match = html.match(/empId:\s*'([^']+)'/);
        return match?.[1];
    };

    const userId = await getUserId();
    if (!userId) return;

    const now = new Date();
    const fromDate =
        `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}01`;
    const toDate =
        `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}` +
        `${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}`;

    const workTimes = await fetch(getWorkUrl(userId, fromDate, toDate))
        .then(r => r.json())
        .then(parseWorkTimes)
        .catch(err => {
            console.error(err);
            return [];
        });

    const workTimesWithHalfDayOff = workTimes;

    const workTimesWithoutHalfDayOff = workTimes.filter(
        item => !HALF_DAY_OFF_MINUTES.includes(item.sumWorkTime)
    );

    const totalDiffWithHalfDayOff =
        calculateTotalRemainWork(workTimesWithHalfDayOff);

    const totalDiffWithoutHalfDayOff =
        calculateTotalRemainWork(workTimesWithoutHalfDayOff);

    console.log('Including half day off:', totalDiffWithHalfDayOff);
    console.log('Excluding half day off:', totalDiffWithoutHalfDayOff);

    updateDOM(
        workTimes,
        totalDiffWithHalfDayOff,
        totalDiffWithoutHalfDayOff
    );

})();
