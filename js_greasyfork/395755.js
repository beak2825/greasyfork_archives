// ==UserScript==
// @name         AtCoder Problems Penalty Counter
// @namespace    iilj
// @version      2020.01.28.2
// @description  AtCoder Problems のテーブルページ上で問題ごとにコンテスト中のペナルティ数を表示します
// @author       iilj
// @supportURL   https://github.com/iilj/AtCoderProblemsExt/issues
// @match        https://kenkoooo.com/atcoder/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/395755/AtCoder%20Problems%20Penalty%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/395755/AtCoder%20Problems%20Penalty%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
span.appc-penalty {
    color: red;
    margin-left: .4rem;
    margin-right: .1rem;
}
`);

    /**
     * AtCoder コンテストの URL を返す．
     *
     * @param {string} contestId コンテスト ID
     * @returns {string} AtCoder コンテストの URL
     */
    const getContestUrl = (contestId) => `https://atcoder.jp/contests/${contestId}`;

    /**
     * AtCoder コンテストの問題 URL を返す．
     *
     * @param {string} contestId コンテスト ID
     * @param {string} problemId 問題 ID
     * @returns {string} AtCoder コンテストの問題 URL
     */
    const getProblemUrl = (contestId, problemId) => `${getContestUrl(contestId)}/tasks/${problemId}`;

    /**
     * url string to json object
     *
     * @date 2020-01-15
     * @param {string} uri 取得するリソースのURI
     * @returns {Promise<Object[]>} 配列
     */
    async function getJson(uri) {
        const response = await fetch(uri);
        /** @type {Object[]} */
        const obj = await response.json();
        return obj;
    }

    /**
     * get contestId->contest map and contestUrl->contestId map
     *
     * @date 2020-01-15
     * @returns {Promise<Object[]>} array [contestId->contest map, contestUrl->contestId map]
     */
    async function getContestsMap() {
        const contests = await getJson('https://kenkoooo.com/atcoder/resources/contests.json');
        const contestsMap = contests.reduce((hash, contest) => {
            hash[contest.id] = contest;
            return hash;
        }, {});
        const contestsUrl2Id = contests.reduce((hash, contest) => {
            hash[getContestUrl(contest.id)] = contest.id;
            return hash;
        }, {});
        return [contestsMap, contestsUrl2Id];
    }

    /**
     * return problemUrl->penalty map from userId string
     *
     * @date 2020-01-15
     * @param {string} userId
     * @returns {Promise<Object>} problemUrl->penalty map
     */
    async function getUserPenaltyMap(userId, contestsMap) {
        const userResults = await getJson(`https://kenkoooo.com/atcoder/atcoder-api/results?user=${userId}`);
        const userPenaltyMap = userResults.reduce((hash, submit) => {
            const key = getProblemUrl(submit.contest_id, submit.problem_id);
            const contest = contestsMap[submit.contest_id];
            if (!(key in hash)) {
                hash[key] = 0;
            }
            if (submit.epoch_second <= contest.start_epoch_second + contest.duration_second && submit.result != 'AC') {
                hash[key]++;
            }
            return hash;
        }, {});
        return userPenaltyMap;
    }

    /**
     * Table 表示ページで "Show Accepted" の変更検知に利用する MutationObserver
     *
     * @type {MutationObserver}
     */
    let tableObserver;

    /**
     * Table 表示ページで表のセルの色を塗り分ける．
     *
     * @date 2020-01-16
     * @param {string} userId
     */
    async function processTable(userId) {
        const [contestsMap, contestsUrl2Id] = await getContestsMap();
        const userPenaltyMap = await getUserPenaltyMap(userId, contestsMap);

        const tableChanged = () => {
            if (tableObserver) {
                tableObserver.disconnect();
            }
            document.querySelectorAll('span.appc-penalty').forEach(spanPenalty => {
                spanPenalty.innerText = '';
            });
            document.querySelectorAll('td.table-problem').forEach(td => {
                const lnk = td.querySelector('a[href]');
                if (lnk && lnk.href in userPenaltyMap && userPenaltyMap[lnk.href] > 0) {
                    const userPenalty = userPenaltyMap[lnk.href];
                    let divTimespan = td.querySelector('.table-problem-timespan');
                    if (!divTimespan) {
                        divTimespan = document.createElement("div");
                        divTimespan.classList.add('table-problem-timespan');
                        td.insertAdjacentElement('beforeend', divTimespan);
                    }
                    let spanPenalty = divTimespan.querySelector('span.appc-penalty');
                    if (!spanPenalty) {
                        spanPenalty = document.createElement("span");
                        spanPenalty.classList.add('appc-penalty');
                        divTimespan.insertAdjacentElement('beforeend', spanPenalty);
                    }
                    spanPenalty.innerText = `(${userPenalty})`;
                }
            });
            if (tableObserver) {
                document.querySelectorAll('.react-bs-container-body').forEach(div => {
                    tableObserver.observe(div, { childList: true, subtree: true });
                });
            }
        };

        tableObserver = new MutationObserver(mutations => tableChanged());
        tableChanged();
        document.querySelectorAll('.react-bs-container-body').forEach(div => {
            tableObserver.observe(div, { childList: true, subtree: true });
        });
    }

    /**
     * ページ URL が変化した際のルートイベントハンドラ．
     *
     * @date 2020-01-15
     */
    const hrefChanged = () => {
        if (tableObserver) {
            tableObserver.disconnect();
        }

        /** @type {RegExpMatchArray} */
        let result;
        if (result = location.href.match(/^https?:\/\/kenkoooo\.com\/atcoder\/#\/table\/([^/?#]+)/)) {
            const userId = result[1];
            processTable(userId);
        }
    };

    let href = location.href;
    const observer = new MutationObserver(mutations => {
        if (href === location.href) {
            return;
        }
        // href changed
        href = location.href;
        hrefChanged();
    });
    observer.observe(document, { childList: true, subtree: true });
    hrefChanged();
})();