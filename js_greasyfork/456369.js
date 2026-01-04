// ==UserScript==
// @name         atcoder-virtual-remaining-time-display
// @namespace    https://github.com/ilplrr
// @version      1.0
// @description  バーチャルコンテストの残り時間を表示します。
// @author       ilplrr
// @license      MIT
// @match        https://atcoder.jp/contests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456369/atcoder-virtual-remaining-time-display.user.js
// @updateURL https://update.greasyfork.org/scripts/456369/atcoder-virtual-remaining-time-display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (getServerTime() < endTime) return;

    const createTimer = (data) => {
        if (!data.isVirtual) return;
        if (!(data.virtualStartTime && data.virtualEndTime)) return;

        const timer = document.createElement('div');
        timer.id = 'virtual-timer';
        timer.style = `
            position: fixed;
            right: 170px;
            bottom: 0px;
            width: 160px;
            height: 80px;
            margin: 0;
            padding: 20px 0;
            background-image: url("//img.atcoder.jp/assets/contest/digitalclock.png");
            text-align: center;
            line-height: 20px;
            font-size: 15px;
            cursor: pointer;
            z-index: 50;
        `;
        document.body.appendChild(timer);

        let intervalId = null;
        const update = () => {
            const serverTime = getServerTime();
            let s = '';
            if (serverTime.isAfter(data.virtualEndTime)) {
                s += 'バーチャル参加終了<br>'
                s += `<span style="color: #c00;">残り：${durationFormat(0)}</span>`;
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            } else if (serverTime.isAfter(data.virtualStartTime)) {
                s += 'バーチャル参加中<br>'
                s += `残り：${durationFormat(data.virtualEndTime.diff(serverTime))}`;
            } else {
                s += 'バーチャル参加まで<br>'
                s += `残り：${durationFormat(data.virtualStartTime.diff(serverTime))}`;
            }
            timer.innerHTML = s;
        };
        intervalId = setInterval(update, 100);
    };

    const virtualStandingURL = `${location.origin}/contests/${contestScreenName}/standings/virtual`;
    fetch(virtualStandingURL).then((response) => {
        return response.text();
    }).then((text) => {
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const data = {};
        doc.querySelectorAll('script').forEach((e) => {
            const s = e.innerHTML;
            const m = s.match(/(isVirtual|virtual(Start|End)Time)\s*=\s*[^\n]*/g);
            if (m) {
                m.forEach((s) => eval('data.' + s));
            }
        });
        createTimer(data);
    });
})();