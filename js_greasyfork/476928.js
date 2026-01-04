// ==UserScript==
// @name         AtCoderVirtualTimer
// @namespace    ocha98-virtual-timer
// @version      0.2
// @description  バーチャルの開始までの時間、残り時間をコンテストと同じように表示します
// @author       Ocha98
// @match        https://atcoder.jp/contests/*
// @supportURL   https://github.com/ocha98/AtCoderVirtualTimer/issues
// @source       https://github.com/ocha98/AtCoderVirtualTimer
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476928/AtCoderVirtualTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/476928/AtCoderVirtualTimer.meta.js
// ==/UserScript==

class Timer {
    constructor(targetElementId, startDate, durationMinutes) {
        this.startDate = startDate;
        this.endDate = new Date(this.startDate.getTime() + durationMinutes * 60 * 1000);  // durationMinutesをミリ秒に変換してendDateを計算
        this.targetElement = document.getElementById(targetElementId);
        this.virtualTimer = this.createVirtualTimer();
        this.timeDelta = Cookies.getJSON("timeDelta");
        document.body.appendChild(this.virtualTimer);

        if(typeof this.timeDelta === 'undefined'){
            this.timeDelta = 0;
        }
    }

    now() {
        const date = new Date();
        date.setTime(date.getTime() + this.timeDelta);
        return date;
    }

    createVirtualTimer() {
        const p = document.createElement('p');
        p.classList.add("contest-timer")
        p.id = 'virtual-timer';
        p.style.position = 'fixed';
        p.style.right = '10px';
        p.style.bottom = '0';
        p.style.width = '160px';
        p.style.height = '80px';
        p.style.margin = '0';
        p.style.padding = '20px 0';
        p.style.backgroundImage = 'url("//img.atcoder.jp/assets/contest/digitalclock.png")';
        p.style.textAlign = 'center';
        p.style.lineHeight = '20px';
        p.style.fontSize = '15px';
        p.style.cursor = 'pointer';
        p.style.zIndex = '50';
        p.style.userSelect = 'none';
        p.style.display = 'none';  // 初めから非表示にする
        return p;
    }

    start() {
        if (this.intervalId) { return; }
        this.bindClickEvent();

        this.targetElement.style.display = 'none';
        this.virtualTimer.style.display = 'block';

        const updateDisplay = () => {
            const nowDate = this.now();
            if (this.startDate > nowDate) {
                // バーチャル開始前
                const formattedTimeDiff = this.formatTimeDifference(this.startDate, nowDate);
                this.virtualTimer.innerHTML = `開始まであと<br/>${formattedTimeDiff}`;
            } else if(nowDate < this.endDate) {
                // バーチャル中
                const formattedTimeDiff = this.formatTimeDifference(this.endDate, nowDate);
                this.virtualTimer.innerHTML = `残り時間<br/>${formattedTimeDiff}`;
            } else {
                // バーチャル終了後
                this.targetElement.innerHTML = "";
                this.stop();
                this.unbindClickEvent();  // イベント破棄
            }
        };

        updateDisplay();
        this.intervalId = setInterval(updateDisplay, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    formatTimeDifference(startDate, nowDate) {
        const diffInSeconds = (startDate - nowDate) / 1000;
        const days = Math.floor(diffInSeconds / 86400);
        const hours = Math.floor((diffInSeconds % 86400) / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = Math.floor(diffInSeconds % 60);

        if (days > 0) {
            return `${days}日と${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    unbindClickEvent() {
        // イベントを破棄するためのメソッド
        this.targetElement.removeEventListener('click', this.toggleDisplay);
        this.virtualTimer.removeEventListener('click', this.toggleDisplay);
        this.virtualTimer.style.display = 'none';
        this.targetElement.style.display = 'block';
    }

    bindClickEvent() {
        // バチャの時計ともとからある時計を切り替える
        this.toggleDisplay = (e) => {
            if (e.target === this.targetElement && this.targetElement.style.opacity == 1) {
                this.targetElement.style.display = 'none';
                this.virtualTimer.style.display = 'block';
            } else {
                this.virtualTimer.style.display = 'none';
                this.targetElement.style.display = 'block';
            }
        };
        this.targetElement.addEventListener('click', this.toggleDisplay);
        this.virtualTimer.addEventListener('click', this.toggleDisplay);
    }
}

async function getVirtualContestPage() {
    const contestName = window.location.pathname.split('/')[2];
    const virtualUrl = `https://atcoder.jp/contests/${contestName}/virtual`;

    const response = await fetch(virtualUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${virtualUrl}. response status: ${response.status} status text: ${response.statusText}`);
    }

    const pageContent = await response.text();

    const parser = new DOMParser();
    return parser.parseFromString(pageContent, "text/html");
}

// コンテスト時間を分で返す
function getContestDurationMinutes(dom) {
    const contestDurationElement = dom.querySelectorAll('small.contest-duration a');
    // YYYYMMDDTHHMM
    const strToDate = (str) => {
        return new Date(
            parseInt(str.substring(0, 4)), // year
            parseInt(str.substring(4, 6)) - 1, // month (0-indexed)
            parseInt(str.substring(6, 8)), // day
            parseInt(str.substring(9, 11)), // hour
            parseInt(str.substring(11, 13)) // minute
        );
    };
    const startMatch = contestDurationElement[0].href.match(/iso=(\d+T\d+)/);
    const endMatch = contestDurationElement[1].href.match(/iso=(\d+T\d+)/);

    const startStr = startMatch[1];
    const endStr = endMatch[1];

    const startDate = strToDate(startStr);
    const endDate = strToDate(endStr);

    const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60); // ミリ秒を分に変換

    return durationMinutes;
}

// バチャの開始時刻を取得
function getVirtualStartTime(dom) {
    const timeElement = dom.querySelector('#main-container time.fixtime-second');
    const timeText = timeElement.textContent.trim();
    return new Date(timeText);
}

async function main() {
    try {
        const dom = await getVirtualContestPage()
        const virtualStartDate = getVirtualStartTime(dom);
        const contestDurationMinutes = getContestDurationMinutes(dom);

        const timer = new Timer('fixed-server-timer', virtualStartDate, contestDurationMinutes);
        timer.start();
    } catch (error) {
        console.error(error);
    }
}

main();
