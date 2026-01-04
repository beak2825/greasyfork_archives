// ==UserScript==
// @name         atcoder-tasks-page-colorize-during-contests
// @namespace    iilj
// @version      2021.8.0
// @description  atcoder-tasks-page-colorizer と同様の色付けを，コンテスト中にも行えるようにします．
// @author       iilj
// @license      MIT
// @supportURL   https://github.com/iilj/atcoder-tasks-page-colorize-during-contests/issues
// @match        https://atcoder.jp/contests/*/tasks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426049/atcoder-tasks-page-colorize-during-contests.user.js
// @updateURL https://update.greasyfork.org/scripts/426049/atcoder-tasks-page-colorize-during-contests.meta.js
// ==/UserScript==
const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    const obj = (await res.json());
    return obj;
};
const fetchContestStandings = async (contestSlug) => {
    const url = `https://atcoder.jp/contests/${contestSlug}/standings/json`;
    return await fetchJson(url);
};

const getCurrentScores = async (contestSlug) => {
    const problemId2Info = new Map();
    const res = await fetch(`https://atcoder.jp/contests/${contestSlug}/score`);
    const scoreHtml = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(scoreHtml, 'text/html');
    doc.querySelectorAll('#main-div tbody tr').forEach((tableRow) => {
        const anchor1 = tableRow.querySelector('td:nth-child(1) a');
        if (anchor1 === null)
            throw new Error('問題リンクが見つかりませんでした');
        const problemId = anchor1.href.split('/').pop();
        if (problemId === undefined)
            throw new Error('問題IDが見つかりませんでした');
        const td3 = tableRow.querySelector('td:nth-child(3)');
        if (td3 === null || td3.textContent === null)
            throw new Error('スコアが不明な行があります');
        const score = Number(td3.textContent);
        const td4 = tableRow.querySelector('td:nth-child(4)');
        if (td4 === null || td4.textContent === null)
            throw new Error('提出日時が不明な行があります');
        const datetimeString = td4.textContent;
        // console.log(problemId, score, datetimeString);
        problemId2Info.set(problemId, [score, datetimeString]);
    });
    return problemId2Info;
};

class TaskListManager {
    constructor(mainContainer, contestSlug) {
        this.mainContainer = mainContainer;
        this.contestSlug = contestSlug;
        // ヘッダ挿入
        const headInsertPt = mainContainer.querySelector('thead th:last-child');
        if (headInsertPt === null)
            throw new Error('ヘッダ挿入ポイントが見つかりませんでした');
        headInsertPt.insertAdjacentHTML('beforebegin', '<th width="10%" class="text-center">得点</th><th class="text-center">提出日時</th>');
        // 問題一覧テーブルから，行・セル・問題IDを取り出してリストに収める
        this.rows = [];
        const rowElementss = this.mainContainer.querySelectorAll('#main-div tbody tr');
        rowElementss.forEach((rowElement) => {
            const anchor2 = rowElement.querySelector('td:nth-child(2) a');
            if (anchor2 === null)
                throw new Error('問題リンクが見つかりませんでした');
            const problemId = anchor2.href.split('/').pop();
            if (problemId === undefined)
                throw new Error('問題IDが見つかりませんでした');
            const tdInsertPt = rowElement.querySelector('td:last-child');
            if (tdInsertPt === null)
                throw new Error('td が見つかりませんでした');
            const scoreCell = document.createElement('td');
            const datetimeCell = document.createElement('td');
            scoreCell.classList.add('text-center');
            datetimeCell.classList.add('text-center');
            tdInsertPt.insertAdjacentElement('beforebegin', scoreCell);
            tdInsertPt.insertAdjacentElement('beforebegin', datetimeCell);
            scoreCell.textContent = '-';
            datetimeCell.textContent = '-';
            this.rows.push([problemId, rowElement, scoreCell, datetimeCell]);
        });
    }
    /** 「自分の得点状況」ページの情報からテーブルを更新する */
    async updateByScorePage() {
        this.problemId2Info = await getCurrentScores(this.contestSlug);
        this.rows.forEach(([problemId, rowElement, scoreCell, datetimeCell]) => {
            if (this.problemId2Info === undefined)
                return;
            if (this.problemId2Info.has(problemId)) {
                const [score, datetimeString] = this.problemId2Info.get(problemId);
                scoreCell.textContent = `${score}`;
                datetimeCell.textContent = datetimeString;
                if (datetimeString !== '-') {
                    rowElement.classList.add(score > 0 ? 'success' : 'danger');
                }
            }
            else {
                throw new Error(`スコア情報がありません：${problemId}`);
            }
        });
    }
    /** 順位表情報からテーブルを更新する */
    async updateByStandings() {
        // 一部常設コンテストは順位表情報が提供されておらず 404 が返ってくる
        let standings;
        try {
            standings = await fetchContestStandings(this.contestSlug);
        }
        catch (_a) {
            console.warn('atcoder-tasks-page-colorize-during-contests: このコンテストは順位表が提供されていません');
            return;
        }
        const userStandingsEntry = standings.StandingsData.find((_standingsEntry) => _standingsEntry.UserScreenName == userScreenName);
        if (userStandingsEntry === undefined)
            return;
        this.rows.forEach(([problemId, rowElement, scoreCell, datetimeCell]) => {
            if (!(problemId in userStandingsEntry.TaskResults))
                return;
            const taskResultEntry = userStandingsEntry.TaskResults[problemId];
            const dt = startTime.clone().add(taskResultEntry.Elapsed / 1000000000, 's');
            // console.log(dt.format());
            if (this.problemId2Info === undefined)
                throw new Error('先に updateByScorePage() を呼んでください');
            const [score] = this.problemId2Info.get(problemId);
            const scoreFromStandings = taskResultEntry.Score / 100;
            if (scoreFromStandings >= score) {
                scoreCell.textContent = `${scoreFromStandings}`;
                datetimeCell.textContent = `${dt.format('YYYY/MM/DD HH:mm:ss')}`;
            }
            if (taskResultEntry.Status === 1) {
                if (rowElement.classList.contains('danger'))
                    rowElement.classList.remove('danger');
                rowElement.classList.add('success');
            }
            else {
                if (rowElement.classList.contains('success'))
                    rowElement.classList.remove('success');
                rowElement.classList.add('danger');
            }
        });
    }
}

void (async () => {
    // 終了後のコンテストに対する処理は以下のスクリプトに譲る：
    // https://greasyfork.org/ja/scripts/380404-atcoder-tasks-page-colorizer
    if (moment() >= endTime)
        return;
    const mainContainer = document.getElementById('main-container');
    if (mainContainer === null)
        throw new Error('コンテナが見つかりませんでした');
    const taskListManager = new TaskListManager(mainContainer, contestScreenName);
    await taskListManager.updateByScorePage();
    console.log('atcoder-tasks-page-colorize-during-contests: updateByScorePage() ended');
    await taskListManager.updateByStandings();
    console.log('atcoder-tasks-page-colorize-during-contests: updateByStandings() ended');
})();
