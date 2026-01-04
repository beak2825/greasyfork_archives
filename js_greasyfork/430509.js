// ==UserScript==
// @name         atcoder-wait-time-display
// @namespace    iilj
// @version      2021.8.2
// @description  AtCoder の提出待ち時間を表示します．
// @author       iilj
// @license      MIT
// @supportURL   https://github.com/iilj/atcoder-wait-time-display/issues
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430509/atcoder-wait-time-display.user.js
// @updateURL https://update.greasyfork.org/scripts/430509/atcoder-wait-time-display.meta.js
// ==/UserScript==
const pad = (num, length = 2) => `00${num}`.slice(-length);
const formatTime = (hours, minutes, seconds) => {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
const secondsToString = (diffWholeSecs) => {
    const diffSecs = diffWholeSecs % 60;
    const diffMinutes = Math.floor(diffWholeSecs / 60) % 60;
    const diffHours = Math.floor(diffWholeSecs / 3600) % 24;
    const diffDate = Math.floor(diffWholeSecs / (3600 * 24));
    if (diffDate > 0)
        return `${diffDate}日`;
    return formatTime(diffHours, diffMinutes, diffSecs);
};

var css = "div#js-awtd-timer {\n  position: fixed;\n  right: 10px;\n  bottom: 80px;\n  width: 160px;\n  height: 80px;\n  margin: 0;\n  padding: 20px 0;\n  background-image: url(\"//img.atcoder.jp/assets/contest/digitalclock.png\");\n  text-align: center;\n  line-height: 20px;\n  font-size: 15px;\n  cursor: pointer;\n  z-index: 50;\n}\ndiv#js-awtd-timer .js-awtd-timer-top {\n  color: inherit;\n}\ndiv#js-awtd-timer .js-awtd-timer-bottom {\n  color: #cc0000;\n}\n\np#fixed-server-timer {\n  box-sizing: border-box;\n}";

class Timer {
    constructor(lastSubmitTime, submitIntervalSecs) {
        this.lastSubmitTime = lastSubmitTime;
        this.submitIntervalSecs = submitIntervalSecs;
        GM_addStyle(css);
        this.element = document.createElement('div');
        this.element.id = Timer.ELEMENT_ID;
        this.element.title = `間隔：${this.submitIntervalSecs} 秒`;
        document.body.appendChild(this.element);
        this.top = document.createElement('div');
        this.top.classList.add('js-awtd-timer-top');
        this.element.appendChild(this.top);
        this.bottom = document.createElement('div');
        this.bottom.classList.add('js-awtd-timer-bottom');
        this.element.appendChild(this.bottom);
        this.prevSeconds = -1;
        this.intervalID = window.setInterval(() => {
            this.updateTime();
        }, 100);
        this.displayInterval = false;
        this.element.addEventListener('click', () => {
            this.displayInterval = !this.displayInterval;
            this.prevSeconds = -1;
            this.updateTime();
        });
    }
    updateTime() {
        const currentTime = moment();
        const seconds = currentTime.seconds();
        if (seconds === this.prevSeconds)
            return;
        if (this.displayInterval) {
            this.top.textContent = '提出間隔';
            this.bottom.textContent = `${this.submitIntervalSecs} 秒`;
        }
        else {
            if (this.lastSubmitTime !== null) {
                // 経過時間を表示
                const elapsedMilliseconds = currentTime.diff(this.lastSubmitTime);
                const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
                this.top.textContent = `経過：${secondsToString(elapsedSeconds)}`;
                const waitTime = Math.max(0, this.submitIntervalSecs - elapsedSeconds);
                this.bottom.textContent = `待ち：${secondsToString(waitTime)}`;
                // if (waitTime > 0) this.bottom.style.color = '#cc0000';
                // else this.bottom.style.color = 'inherit';
            }
            else {
                this.top.textContent = 'この問題は';
                this.bottom.textContent = '未提出です';
            }
        }
    }
}
Timer.ELEMENT_ID = 'js-awtd-timer';

const extractContestAndProblemSlugs = (url) => {
    // https://atcoder.jp/contests/*/tasks/*
    const urlMatchArray = /^https?:\/\/atcoder\.jp\/contests\/([^/]+)\/tasks\/([^/]+)/.exec(url);
    if (urlMatchArray === null) {
        throw new Error('url が不正です');
    }
    return [urlMatchArray[1], urlMatchArray[2]];
};

const getRecentSubmissions = async (contestSlug, taskSlug) => {
    const res = await fetch(`https://atcoder.jp/contests/${contestSlug}/submissions/me?f.Task=${taskSlug}`);
    const text = await res.text();
    const dom = new DOMParser().parseFromString(text, 'text/html');
    // console.log(dom);
    // 2021-05-29 16:15:34+0900
    const rows = dom.querySelectorAll('#main-container div.panel.panel-default.panel-submission > div.table-responsive > table > tbody > tr');
    const ret = [];
    rows.forEach((row) => {
        var _a;
        const problem = row.querySelector(`a[href^="/contests/${contestSlug}/tasks/${taskSlug}"]`);
        if (problem === null) {
            throw new Error('テーブルに提出先不明の行があります');
        }
        const time = row.querySelector('time.fixtime-second');
        if (time === null) {
            throw new Error('テーブルに提出時刻不明の行があります');
        }
        const [contestSlugTmp, taskSlugTmp] = extractContestAndProblemSlugs(problem.href);
        if (contestSlugTmp !== contestSlug || taskSlugTmp !== taskSlug) {
            throw new Error('異なる問題への提出記録が紛れています');
        }
        const submission = row.querySelector(`a[href^="/contests/${contestSlug}/submissions/"]`);
        if (submission === null) {
            throw new Error('テーブルに提出 ID 不明の行があります');
        }
        const statusLabel = row.querySelector('span.label');
        if (statusLabel === null) {
            throw new Error('提出ステータス不明の行があります');
        }
        const label = (_a = statusLabel.textContent) === null || _a === void 0 ? void 0 : _a.trim();
        if (label === undefined) {
            throw new Error('提出ステータスが空の行があります');
        }
        const submitTime = moment(time.innerText);
        ret.push([submission.href, label, submitTime]);
    });
    return ret;
};
const getSubmitIntervalSecs = async (contestSlug) => {
    var _a;
    const res = await fetch(`https://atcoder.jp/contests/${contestSlug}?lang=ja`);
    const text = await res.text();
    const dom = new DOMParser().parseFromString(text, 'text/html');
    // 例外的な処理
    if (contestSlug === 'wn2017_1') {
        return 3600;
    }
    else if (contestSlug === 'caddi2019') {
        return 300;
    }
    // AHC/HTTF/日本橋ハーフマラソン/Future 仕様の文字列を検索
    const candidates = dom.getElementsByTagName('strong');
    for (let i = 0; i < candidates.length; ++i) {
        const content = (_a = candidates[i].textContent) === null || _a === void 0 ? void 0 : _a.trim();
        if (content === undefined)
            continue;
        // 5分以上の間隔
        const matchArray = /^(\d+)(秒|分|時間)以上の間隔/.exec(content);
        if (matchArray === null)
            continue;
        if (matchArray[2] === '秒')
            return Number(matchArray[1]);
        if (matchArray[2] === '分')
            return Number(matchArray[1]) * 60;
        if (matchArray[2] === '時間')
            return Number(matchArray[1]) * 3600;
    }
    const statement = dom.getElementById('contest-statement');
    if (statement === null) {
        throw new Error('コンテスト説明文が見つかりませんでした');
    }
    const statementText = statement.textContent;
    if (statementText === null) {
        throw new Error('コンテスト説明文が空です');
    }
    // Asprova 仕様
    //   「提出間隔：プログラム提出後10分間は再提出できません。」
    //   「提出後1時間は再提出できません」
    // Hitachi Hokudai 仕様
    //   「提出直後の1時間は再提出することができません」
    //   「提出直後の1時間は、再提出することができません」
    // ヤマトコン仕様
    //   「提出後30分は再提出することはできません」
    {
        const matchArray = /提出[^\d]{1,5}(\d+)(秒|分|時間).{1,5}再提出/.exec(statementText);
        if (matchArray !== null) {
            if (matchArray[2] === '秒')
                return Number(matchArray[1]);
            if (matchArray[2] === '分')
                return Number(matchArray[1]) * 60;
            if (matchArray[2] === '時間')
                return Number(matchArray[1]) * 3600;
        }
    }
    // PAST 仕様
    //   「同じ問題に1分以内に再提出することはできません」
    {
        const matchArray = /(\d+)(秒|分|時間).{1,5}再提出.{0,10}できません/.exec(statementText);
        if (matchArray !== null) {
            if (matchArray[2] === '秒')
                return Number(matchArray[1]);
            if (matchArray[2] === '分')
                return Number(matchArray[1]) * 60;
            if (matchArray[2] === '時間')
                return Number(matchArray[1]) * 3600;
        }
    }
    // Chokudai Contest 仕様
    //   「CEの提出を除いて5分に1回しか提出できません」
    //   「前の提出から30秒以上開けての提出をお願いします」
    //   「前の提出から5分以上開けての提出をお願いします」
    // Introduction to Heuristics Contest 仕様
    //   「提出の間隔は5分以上空ける必要があります」
    {
        const matchArray = /提出[^\d]{1,5}(\d+)(秒|分|時間)以上(?:空け|開け)/.exec(statementText);
        // console.log(matchArray);
        if (matchArray !== null) {
            if (matchArray[2] === '秒')
                return Number(matchArray[1]);
            if (matchArray[2] === '分')
                return Number(matchArray[1]) * 60;
            if (matchArray[2] === '時間')
                return Number(matchArray[1]) * 3600;
        }
    }
    {
        const matchArray = /(\d+)(秒|分|時間)に1回.{1,5}提出/.exec(statementText);
        if (matchArray !== null) {
            if (matchArray[2] === '秒')
                return Number(matchArray[1]);
            if (matchArray[2] === '分')
                return Number(matchArray[1]) * 60;
            if (matchArray[2] === '時間')
                return Number(matchArray[1]) * 3600;
        }
    }
    // ゲノコン2021 仕様
    //   「提出時間の間隔は，8/28 21:00までは10分，8/28 21:00以降は2時間となります」
    {
        const matchArray = /提出[^\d]{1,5}間隔[^\d]+?(?:(\d+)\/(\d+) (\d\d):(\d\d)(まで|以降)は(\d+)(秒|分|時間)[，、,\s]?)+/.exec(statementText);
        // console.log(matchArray);
        if (matchArray !== null) {
            const re = /(\d+)\/(\d+) (\d+):(\d\d)(まで|以降)は(\d+)(秒|分|時間)/g;
            let matchArrayInner;
            const currentTime = moment();
            while ((matchArrayInner = re.exec(matchArray[0]))) {
                console.log(matchArrayInner);
                const momentInput = {
                    year: startTime.year(),
                    month: Number(matchArrayInner[1]) - 1,
                    days: Number(matchArrayInner[2]),
                    hours: Number(matchArrayInner[3]),
                    minutes: Number(matchArrayInner[4]),
                };
                const timeThreshold = moment(momentInput);
                if (matchArrayInner[5] === 'まで') {
                    if (currentTime.isBefore(timeThreshold)) {
                        if (matchArrayInner[7] === '秒')
                            return Number(matchArrayInner[6]);
                        if (matchArrayInner[7] === '分')
                            return Number(matchArrayInner[6]) * 60;
                        if (matchArrayInner[7] === '時間')
                            return Number(matchArrayInner[6]) * 3600;
                    }
                }
                else {
                    if (currentTime.isAfter(timeThreshold)) {
                        if (matchArrayInner[7] === '秒')
                            return Number(matchArrayInner[6]);
                        if (matchArrayInner[7] === '分')
                            return Number(matchArrayInner[6]) * 60;
                        if (matchArrayInner[7] === '時間')
                            return Number(matchArrayInner[6]) * 3600;
                    }
                }
            }
        }
    }
    {
        const matchArray = /提出[^\d]{1,5}間隔.+?(\d+)(秒|分|時間)/.exec(statementText);
        if (matchArray !== null) {
            if (matchArray[2] === '秒')
                return Number(matchArray[1]);
            if (matchArray[2] === '分')
                return Number(matchArray[1]) * 60;
            if (matchArray[2] === '時間')
                return Number(matchArray[1]) * 3600;
        }
    }
    return 5;
};

void (async () => {
    // 終了後のコンテストに対しては処理しない？
    //if (moment() >= endTime) return;
    const [contestSlug, taskSlug] = extractContestAndProblemSlugs(document.location.href);
    if (contestSlug !== contestScreenName) {
        throw new Error('url が不正です');
    }
    const submitIntervalSecs = await getSubmitIntervalSecs(contestSlug);
    const recentSubmissions = await getRecentSubmissions(contestSlug, taskSlug);
    const lastSubmitTime = recentSubmissions.reduce((prev, [, statusLabel, submitTime]) => {
        if (statusLabel === 'CE')
            return prev;
        if (prev === null || submitTime > prev)
            return submitTime;
        return prev;
    }, null);
    new Timer(lastSubmitTime, submitIntervalSecs);
})();
