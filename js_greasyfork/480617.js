// ==UserScript==
// @name         atcoder-vc-merger
// @version      1.0.1
// @description  AtCoder上のバーチャルコンテスト機能を使うとき、お気に入りユーザの本番参加時の情報をバーチャル順位表に併記します。
// @author       lemondo
// @namespace    https://github.com/akira-john
// @include      https://atcoder.jp/contests/*/standings/virtual
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @copyright    
// @license      MIT License; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/480617/atcoder-vc-merger.user.js
// @updateURL https://update.greasyfork.org/scripts/480617/atcoder-vc-merger.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

$(function () {
    let userName = "";
    let contestName = getContestName();
    let standingsInfo = {};
    let problemsNum = 7;
    let contestTime = 100;

    // 左上の分数表記からコンテスト時間を取得する（三桁分以上になる場合のことは考えていない（AHCとか））
    let element = document.getElementsByClassName("contest-duration")[0].textContent;
    contestTime = parseInt(element.split("分")[0].slice(-3));

    // 読み込み元と整合性を取る
    // https://wiki.greasespot.net/Third-Party_Libraries
    this.$ = this.jQuery = jQuery.noConflict(true);

    // 順位表情報を辞書にまとめる + 問題数もここで獲得
    async function getStandingsInfo() {
        console.log(contestName);

        fetch("https://atcoder.jp/contests/" + contestName + "/standings/json")
            .then((response) => {
                return response.json();
            })
            .then(jsonData => {
                for (const key in jsonData["StandingsData"]) {
                    standingsInfo[jsonData["StandingsData"][key]["UserScreenName"]] = jsonData["StandingsData"][key];
                }
                problemsNum = jsonData["TaskInfo"].length;
            }
            )
    }

    function getContestName() {
        const currentURL = window.location.href;
        return currentURL.match("https://atcoder.jp/contests\/(.*)/standings")[1];
    }

    function nano2string(nano) {
        let seconds = nano / 1e9;
        let minutes = Math.floor(seconds / 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }

    function makeScoreCell(taskResult) {
        // 新しい td 要素を作成
        const tableCell = document.createElement('td');
        tableCell.className = "standings-result";

        // 新しい p 要素を作成
        const paragraph = document.createElement('p');
        const timePa = document.createElement('p');
        timePa.textContent = nano2string(taskResult["Elapsed"]);

        // Score==0 -> 正解していないが、penalty もない
        if (taskResult["Score"] == 0) {
            const waSpan = document.createElement('span');
            waSpan.textContent = "(" + taskResult["Failure"] + ")";
            waSpan.className = "standings-wa";
            paragraph.appendChild(waSpan);
        } else {
            // 新しい span 要素を作成
            const scoreSpan = document.createElement('span');
            scoreSpan.textContent = Math.round(taskResult["Score"] / 100);
            scoreSpan.className = "standings-ac";
            // span 要素を p 要素に追加
            paragraph.appendChild(scoreSpan);
            if (taskResult["Penalty"] > 0) {
                const waSpan = document.createElement('span');
                waSpan.textContent = "(" + taskResult["Penalty"] + ")";
                waSpan.className = "standings-wa";
                paragraph.appendChild(waSpan);
            }
        }
        // p 要素を td 要素に追加
        tableCell.appendChild(paragraph);
        tableCell.appendChild(timePa);

        return tableCell;
    }

    function makeTotalResult(taskResult) {
        // 新しい td 要素を作成
        const tableCell = document.createElement('td');
        tableCell.className = "standings-result";

        // 新しい p 要素を作成
        const paragraph = document.createElement('p');
        const timePa = document.createElement('p');
        timePa.textContent = nano2string(taskResult["Elapsed"]);

        // 新しい span 要素を作成
        const scoreSpan = document.createElement('span');
        scoreSpan.textContent = Math.round(taskResult["Score"] / 100);
        scoreSpan.className = "standings-score";
        // span 要素を p 要素に追加
        paragraph.appendChild(scoreSpan);
        if (taskResult["Penalty"] > 0) {
            const waSpan = document.createElement('span');
            waSpan.textContent = "(" + taskResult["Penalty"] + ")";
            waSpan.className = "standings-wa";
            paragraph.appendChild(waSpan);
        }

        // p 要素を td 要素に追加
        tableCell.appendChild(paragraph);
        tableCell.appendChild(timePa);

        return tableCell;
    }

    function makeDummyCell() {
        // 新しい td 要素を作成
        const tableCell = document.createElement('td');
        const span = document.createElement('span');
        span.textContent = "-";
        tableCell.appendChild(span);
        return tableCell;
    }

    // "abc299_a" のような問題表記に対して、問題の index に変換する（"a" なら 0）
    function getTaskNum(key) {
        let suf = key.split("_")[1];
        if (suf.length == 1) {
            return suf.charCodeAt(0) - 97;
        } else {
            // ex の場合を想定
            return problemsNum - 1;
        }
    }

    function updateUserInfo(user, tds, userInfo, curTime) {
        // 空白 cell があるのでのぞく
        user.removeChild(tds[2]);

        user.replaceChild(makeDummyCell(), user.insertCell());
        let totalCell = makeScoreCell({});
        user.replaceChild(totalCell, user.insertCell());

        let taskArray = [];
        for (let idx = 0; idx < problemsNum; idx++) {
            taskArray.push(user.insertCell());
        }

        let taskResults = userInfo["TaskResults"];
        let totalScore = 0;
        let totalPenalty = 0;
        let maxTime = 0;
        for (let key in taskResults) {
            if (taskResults[key]["Elapsed"] > curTime) { continue; }
            totalScore += taskResults[key]["Score"];
            totalPenalty += taskResults[key]["Penalty"];
            if (taskResults[key]["Score"] > 0) {
                maxTime = Math.max(maxTime, taskResults[key]["Elapsed"])
            }
            user.replaceChild(makeScoreCell(taskResults[key]), taskArray[getTaskNum(key)]);
        }

        // 最後に得点 cell を更新する
        user.replaceChild(makeTotalResult({
            "Score": totalScore, "Penalty": totalPenalty, "Elapsed": maxTime + totalPenalty * 300 * 1e9
        }), totalCell);
        return (totalScore / 100) * 1e8 - (maxTime / 1e9 + totalPenalty * 300);
    }

    function compareTwoRows(a, b) {
        // 情報がない人は後ろへ
        if (a.getElementsByClassName("standings-result") == null) {
            return true;
        } else if (b.getElementsByClassName("standings-result") == null) {
            return false;
        }
        let aInfo = a.getElementsByClassName("standings-result")[0];
        let bInfo = b.getElementsByClassName("standings-result")[0];

        console.log(aInfo);
        const aScore = parseInt(aInfo.querySelector('span').textContent);
        const bScore = parseInt(bInfo.querySelector('span').textContent);
        if (aScore != bScore) {
            return aScore < bScore;
        } else {
            const aTime = (aInfo.getElementsByTagName('p')[1].textContent);
            const bTime = (bInfo.getElementsByTagName('p')[1].textContent);
            let aValue = parseInt(aTime.split(":")[0]) * 60 + parseInt(aTime.split(":")[1]);
            let bValue = parseInt(bTime.split(":")[0]) * 60 + parseInt(bTime.split(":")[1]);
            return aValue > bValue;
        }
    }

    // バーチャルコンテスト中の残り時刻表示から、経過時間を計算する
    function getTime() {
        if (document.getElementById("virtual-timer") == null) {
            return 60 * 60 * 60 * 1e90;
        }
        let curTime = document.getElementById("virtual-timer").textContent;
        let matches = curTime.match(/(\d{2}):(\d{2}):(\d{2})/);
        if (matches == null) {
            return 60 * 60 * 60 * 1e90;
        }
        let hour = parseInt(matches[1]);
        let minutes = parseInt(matches[2]);
        let seconds = parseInt(matches[3]);
        return (contestTime * 60 - (hour * 60 * 60 + minutes * 60 + seconds)) * 1e9;
    }

    function waitForElementToDisplay(selector, time, callback) {
        if (document.getElementById("standings-tbody") !== null) {
            callback();
        } else {
            setTimeout(function () {
                waitForElementToDisplay(selector, time, callback);
            }, time);
        }
    }

    function getScoreFromCell(a) {
        let aInfo = a.getElementsByClassName("standings-result")[0];
        const aScore = parseInt(aInfo.querySelector('span').textContent);
        const aTime = (aInfo.getElementsByTagName('p')[1].textContent);
        return aScore * 1e8 - (parseInt(aTime.split(":")[0]) * 60 + parseInt(aTime.split(":")[1]));
    }

    getStandingsInfo();

    // コードの生成が完了するのを待つ
    waitForElementToDisplay("standings-tbody", 1000, function () {
        // 順位表の要素を走査し、アップデートする
        // rows には [スコア, usrオブジェクト] が入る
        let rows = [];
        let table = document.getElementById("standings-tbody");
        let tmpArray = Array.from(table.getElementsByTagName("tr"));
        // 最後の二つは最速正解者等の情報欄なのでいったん取り除く
        let last_two = [];
        last_two.push(tmpArray.pop());
        last_two.push(tmpArray.pop());

        for (let user of tmpArray) {
            let tds = $(user).find('td');
            if (tds[1].querySelector('a') == null) {
                continue;
            }
            if (tds[0].textContent != "-") {
                // バーチャルコンテスト参加者
                if (user.getElementsByClassName("standings-result") != null) {
                    console.log(tds[1].querySelector('a').text);
                    rows.push([getScoreFromCell(user), user]);
                }
            }
            let userName = tds[1].querySelector('a').text;
            if (userName in standingsInfo) {
                // バーチャルコンテスト非参加者かつ本番参加者
                let score = updateUserInfo(user, tds, standingsInfo[userName], getTime());
                rows.push([score, user]);
            }
        };
        // });

        // waitForElementToDisplay("standings-tbody", 1000, function () {
        console.log("Sorting !");
        rows.sort((a, b) => {
            return a[0] < b[0];
        });

        table.innerHTML = ""; // テーブルをクリア

        rows.forEach(row => {
            console.log(row);
            table.appendChild(row[1]); // ソート済みの行を追加
        });
        table.appendChild(last_two.pop());
        table.appendChild(last_two.pop());
    });
});