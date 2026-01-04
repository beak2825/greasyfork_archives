// ==UserScript==
// @name         AtCoder Problems Color Mod
// @namespace    iilj
// @version      2020.01.16.1
// @description  AtCoder Problems のユーザページ上で色の塗り方を細分化します
// @author       iilj
// @supportURL   https://github.com/iilj/AtCoderProblemsColorMod/issues
// @match        https://kenkoooo.com/atcoder/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/395228/AtCoder%20Problems%20Color%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/395228/AtCoder%20Problems%20Color%20Mod.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
td.apcm-intime {
    background-color: #9AD59E;
    position: relative;
}
td.apcm-intime-writer {
    background-color: #9CF;
}
td.apcm-intime-nonac {
    background-color: #F5CD98;
    position: relative;
}
div.apcm-timespan {
    position: absolute;
    right: 0;
    bottom: 0;
    color: #888;
    font-size: x-small;
}

/* style for list table */
.react-bs-table .table-striped tbody tr td, .react-bs-table thead th {
    font-size: small;
    padding: 0.3rem;
    line-height: 1.0;
    white-space: normal;
}
.react-bs-table .table-striped tbody tr.apcm-intime td {
    background-color: #9AD59E;
    border-color: #DDD;
}
.react-bs-table .table-striped tbody tr.apcm-intime-writer td {
    background-color: #9CF;
}
.react-bs-table .table-striped tbody tr.apcm-intime-nonac td {
    background-color: #F5CD98;
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
     * return problemUrl->submit map from userId string
     *
     * @date 2020-01-15
     * @param {string} userId
     * @returns {Promise<Object>} problemUrl->submit map
     */
    async function getUserResultsMap(userId) {
        const userResults = await getJson(`https://kenkoooo.com/atcoder/atcoder-api/results?user=${userId}`);
        const userResultsMap = userResults.reduce((hash, submit) => {
            const key = getProblemUrl(submit.contest_id, submit.problem_id);
            if (key in hash) {
                // ACなら，なるべく昔のACを保持する
                if (submit.result == 'AC') {
                    if (hash[key].result != 'AC') { // AC 済みではないなら，最新の結果で上書き
                        hash[key] = submit;
                    } else if (submit.epoch_second < hash[key].epoch_second) {// AC同士なら，なるべく昔のACを保持する
                        hash[key] = submit;
                    }
                } else {
                    if (hash[key].result != 'AC' && submit.epoch_second < hash[key].epoch_second) { // ペナ同士なら，なるべく昔の提出を保持する
                        hash[key] = submit;
                    }
                }
            } else {
                hash[key] = submit;
            }
            return hash;
        }, {});
        return userResultsMap;
    }

    /**
     * return contestId->[problemId] map
     *
     * @date 2020-01-15
     * @returns {Promise<Object>} contestId->[problemId] map
     */
    async function getContestProblemListMap() {
        const contestProblem = await getJson('https://kenkoooo.com/atcoder/resources/contest-problem.json');
        const contestProblemListsMap = contestProblem.reduce((hash, problem) => {
            if (problem.contest_id in hash) {
                hash[problem.contest_id].push(problem.problem_id);
            } else {
                hash[problem.contest_id] = [problem.problem_id];
            }
            return hash;
        }, {});
        return contestProblemListsMap;
    }

    /**
     * 時間（秒）を表す整数値を mm:ss の形にフォーマットする．
     *
     * @param {number} sec 時間（秒）を表す整数値
     * @returns {string} mm:ss の形にフォーマットされた文字列
     */
    const formatTimespan = sec => {
        let sign;
        if (sec >= 0) {
            sign = '';
        } else {
            sign = '-';
            sec *= -1;
        }
        return `${sign}${Math.floor(sec / 60)}:${('0' + (sec % 60)).slice(-2)}`;
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
        const userResultsMap = await getUserResultsMap(userId);
        const contestProblemListsMap = await getContestProblemListMap();

        const tableChanged = () => {
            if (tableObserver) {
                tableObserver.disconnect();
            }
            document.querySelectorAll('td.table-success, td.table-warning').forEach(td => {
                const lnk = td.querySelector('a[href]');
                if (lnk.href in userResultsMap) {
                    const userResult = userResultsMap[lnk.href];
                    const contest = contestsMap[userResult.contest_id];
                    if (userResult.epoch_second <= contest.start_epoch_second + contest.duration_second) {
                        td.classList.add(td.classList.contains('table-success') ? 'apcm-intime' : 'apcm-intime-nonac');
                        if (userResult.epoch_second < contest.start_epoch_second) {
                            td.classList.add('apcm-intime-writer');
                        }
                        const divTimespan = document.createElement("div");
                        divTimespan.innerText = formatTimespan(userResult.epoch_second - contest.start_epoch_second);
                        divTimespan.classList.add('apcm-timespan');
                        td.insertAdjacentElement('beforeend', divTimespan);
                    }
                } else if (lnk.href in contestsUrl2Id) {
                    const contestId = contestsUrl2Id[lnk.href];
                    const contest = contestsMap[contestId];
                    const contestProblemList = contestProblemListsMap[contestId];
                    if (contestProblemList.every(problemId => {
                        const key = getProblemUrl(contestId, problemId);
                        if (key in userResultsMap) {
                            const userResult = userResultsMap[key];
                            return (userResult.epoch_second <= contest.start_epoch_second + contest.duration_second);
                        }
                        return false;
                    })) {
                        td.classList.add('apcm-intime');
                        if (contestProblemList.every(problemId => {
                            const key = getProblemUrl(contestId, problemId);
                            const userResult = userResultsMap[key];
                            return (userResult.epoch_second < contest.start_epoch_second);
                        })) {
                            td.classList.add('apcm-intime-writer');
                        }
                    }
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
     * List 表示ページでページ移動の検知に利用する MutationObserver
     *
     * @type {MutationObserver}
     */
    let listObserver;

    /**
     * List 表示ページで表の行の色を塗り分ける．
     *
     * @date 2020-01-15
     * @param {string} userId ユーザID
     */
    async function processList(userId) {
        const [contestsMap, contestsUrl2Id] = await getContestsMap();
        const userResultsMap = await getUserResultsMap(userId);
        const contestProblemListsMap = await getContestProblemListMap();

        const tbl = document.querySelector('.react-bs-table');
        const tableChanged = () => {
            tbl.querySelectorAll('tr.table-success, tr.table-warning').forEach(tr => {
                const lnk = tr.querySelector('a[href]');
                if (lnk.href in userResultsMap) {
                    const userResult = userResultsMap[lnk.href];
                    const contest = contestsMap[userResult.contest_id];
                    if (userResult.epoch_second <= contest.start_epoch_second + contest.duration_second) {
                        tr.classList.add(tr.classList.contains('table-success') ? 'apcm-intime' : 'apcm-intime-nonac');
                        if (userResult.epoch_second < contest.start_epoch_second) {
                            tr.classList.add('apcm-intime-writer');
                        }
                    }
                }
            });
        };
        listObserver = new MutationObserver(mutations => tableChanged());
        tableChanged();
        listObserver.observe(tbl, { childList: true, subtree: true });
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
        if (listObserver) {
            listObserver.disconnect();
        }

        /** @type {RegExpMatchArray} */
        let result;
        if (result = location.href.match(/^https?:\/\/kenkoooo\.com\/atcoder\/#\/table\/([^/?#]+)/)) {
            const userId = result[1];
            processTable(userId);
        }
        else if (result = location.href.match(/^https?:\/\/kenkoooo\.com\/atcoder\/#\/list\/([^/?#]+)/)) {
            const userId = result[1];
            processList(userId);
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