// ==UserScript==
// @name            AtCoder Difficulty Displayを自分用に変更したやつ
// @namespace       https://github.com/hotarunx
// @homepage        https://github.com/hotarunx/AtCoderDifficultyDisplay
// @supportURL      https://github.com/hotarunx/AtCoderDifficultyDisplay/issues
// @version         1.0.9
// @description     AtCoder Problemsの難易度を表示します。
// @description:en  display a difficulty of AtCoder Problems.
// @author          hotarunx
// @match           https://atcoder.jp/contests/*
// @exclude         https://atcoder.jp/contests/
// @grant           none
// @connect         https://kenkoooo.com/atcoder/resources/problem-models.json
// @connect         https://kenkoooo.com/atcoder/atcoder-api/results?user=*
// @license         MIT
//
// Copyright(c) 2020 hotarunx
// This software is released under the MIT License, see LICENSE or https://github.com/hotarunx/AtCoderMyExtensions/blob/master/LICENSE.
//
// @downloadURL https://update.greasyfork.org/scripts/454525/AtCoder%20Difficulty%20Display%E3%82%92%E8%87%AA%E5%88%86%E7%94%A8%E3%81%AB%E5%A4%89%E6%9B%B4%E3%81%97%E3%81%9F%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/454525/AtCoder%20Difficulty%20Display%E3%82%92%E8%87%AA%E5%88%86%E7%94%A8%E3%81%AB%E5%A4%89%E6%9B%B4%E3%81%97%E3%81%9F%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

// 現在時間、コンテスト開始時間、コンテスト終了時間（UNIX時間 + 時差）
const nowTime = Math.floor(Date.now() / 1000);
const contestStartTime = Math.floor(Date.parse(startTime._i) / 1000);
const contestEndTime = Math.floor(Date.parse(endTime._i) / 1000);

(async function () {
    // URLから問題ID(ex: abc170_a)を取得
    const path = location.pathname.split("/");
    const problemId = path[path.length - 1];
    const isABS = path[2] == "abs";

    // 問題のコンテストが開催中ならば全ての処理をスキップする。
    if (!isABS && !isContestOver(nowTime)) return;

    const diffURL = "https://kenkoooo.com/atcoder/resources/problem-models.json";
    const diffKey = "atcoderDifficultyDisplayEstimatedDifficulties";

    const submissionsURL = "https://kenkoooo.com/atcoder/atcoder-api/results?user=" + userScreenName;
    const submissionsKey = "atcoderDifficultyDisplayUserSubmissions";

    const estimatedDifficulties = await fetchAPIData(diffURL, diffKey, 1 * 60 * 60);
    // const userSubmissions = await fetchAPIData(submissionsURL, submissionsKey, 1 * 60 * 60);

    const problemFunctions = [];
    const problemListFunctions = [];

    if (path[path.length - 2] == "tasks") {
        const problemStatus = getElementOfProblemStatus();
        const problemTitle = document.getElementsByClassName("h2")[0];
        problemFunctions.push(() => changeProblemTitle(problemId, estimatedDifficulties, problemTitle, false));
        problemFunctions.push(() => addDifficultyText(problemId, estimatedDifficulties, problemStatus));
        addDifficultyShowButton(problemTitle, problemFunctions);

        // if (!isABS)
        // addIsSolvedText(problemId, userSubmissions, problemStatus);
    }

    const as = document.getElementsByTagName("a");
    for (const item of as) {
        const h = item.getAttribute("href");
        if (typeof (h) != "string") continue;
        const hpath = h.split("/");

        if (hpath[hpath.length - 2] == "tasks") {
            // itemが*/tasksページの表の一番左なら色付けしない
            if (item.parentElement.className === "text-center no-break") continue;

            const hProblemId = hpath[hpath.length - 1];
            problemListFunctions.push(() => changeProblemTitle(hProblemId, estimatedDifficulties, item, true));
        }
    }
    if (problemListFunctions.length != 0) {
      const problemListTitle = document.querySelector("#main-container > div.row > div:nth-child(2) > h2");
      addDifficultyShowButton(problemListTitle, problemListFunctions);
    }
})();

// コンテストが終了した？
function isContestOver(time) {
    // 緩衝時間(20分)
    const bufferTime = 20 * 60;

    // 現在時間 > コンテスト終了時間 + 緩衝時間？
    if (time > contestEndTime + bufferTime) return true;
    return false;
}

// APIサーバからデータを取得してlocalStorageに保存して返す
// 直前の取得から時間が経過していないならば保存したデータを返す
async function fetchAPIData(url, keyData, timeInterval) {
    const keyLastFetch = keyData + "lastFetchedAt";
    let jsondata = JSON.parse(localStorage.getItem(keyData));
    const fetchTime = parseInt(localStorage.getItem(keyLastFetch));

    // コンテストが終了していないならばデータ取得はしない
    if (!isContestOver(nowTime)) return jsondata;

    // 次のいずれかを満たすならば取得する
    // * データが保存されていない
    // * 直前の取得からtimeInterval経過した
    // * 直前の取得時にコンテストが終了していなかった

    let need2Fetch = false;
    if (isNaN(fetchTime)) need2Fetch = true;
    else if (nowTime >= timeInterval + fetchTime) need2Fetch = true;
    else if (!isContestOver(fetchTime)) need2Fetch = true;

    // データを取得する
    if (need2Fetch) {
        // alert(keyData + "is fetched.");
        jsondata = await (await (fetch(url))).json();
        removeUnusedValues(jsondata);
        localStorage.setItem(keyData, JSON.stringify(jsondata));
        localStorage.setItem(keyLastFetch, nowTime);
    }

    return jsondata;
}

function removeUnusedValues(jsondata) {
    const necessaryKeys = ["difficulty", "is_experimental", "epoch_second", "point", "result", "problem_id"];

    for (const item in jsondata) {
        for (const key in jsondata[item]) {
            if (!necessaryKeys.includes(key)) {
                delete jsondata[item][key];
            }
        }
    }
}

// Webページの問題ステータス（実行時間制限とメモリ制限が書かれた部分）のHTMLオブジェクトを取得
function getElementOfProblemStatus() {
    let element_status;

    const main_container = document.getElementById('main-container');
    const elements_p = main_container.getElementsByTagName("p");

    for (let i = 0; i < elements_p.length; i++) {
        const element = elements_p[i];
        if (element.textContent.match("メモリ制限:") || element.textContent.match("Memory Limit:")) {
            element_status = element;
            break;
        }
    }

    return element_status;
}

// レーティングに対応する色のカラーコード
function colorRating(rating) {
    if (rating < 400) return '#808080'; //          gray
    else if (rating < 800) return '#804000'; //     brown
    else if (rating < 1200) return '#008000'; //    green
    else if (rating < 1600) return '#00C0C0'; //    cyan
    else if (rating < 2000) return '#0000FF'; //    blue
    else if (rating < 2400) return '#C0C000'; //    yellow
    else if (rating < 2800) return '#FF8000'; //    orange
    return '#FF0000'; //                            red
}

// レートを表す難易度円(◒)を生成
function generateDifficultyCircle(rating, isSmall = true) {
    const size = (isSmall ? 12 : 36);
    const borderWidth = (isSmall ? 1 : 3);

    if (rating < 3200) {
        // 色と円がどのぐらい満ちているかを計算
        const color = colorRating(rating);
        const percentFull = (rating % 400) / 400 * 100;

        // ◒を生成
        return "<span style = 'display: inline-block; border-radius: 50%; border-style: solid;border-width: " + borderWidth + "px; margin-right: 5px; vertical-align: initial; height: " + size + "px; width: " + size + "px;border-color: " + color + "; background: linear-gradient(to top, " + color + " 0%, " + color + " " + percentFull + "%, rgba(0, 0, 0, 0) " + percentFull + "%, rgba(0, 0, 0, 0) 100%); '></span>";

    }
    // 金銀銅は例外処理
    else if (rating < 3600) {
        return '<span style="display: inline-block; border-radius: 50%; border-style: solid;border-width: ' + borderWidth + 'px; margin-right: 5px; vertical-align: initial; height: ' + size + 'px; width: ' + size + 'px; border-color: rgb(150, 92, 44); background: linear-gradient(to right, rgb(150, 92, 44), rgb(255, 218, 189), rgb(150, 92, 44));"></span>';

    } else if (rating < 4000) {
        return '<span style="display: inline-block; border-radius: 50%; border-style: solid;border-width: ' + borderWidth + 'px; margin-right: 5px; vertical-align: initial; height: ' + size + 'px; width: ' + size + 'px; border-color: rgb(128, 128, 128); background: linear-gradient(to right, rgb(128, 128, 128), white, rgb(128, 128, 128));"></span>';

    } else {
        return '<span style="display: inline-block; border-radius: 50%; border-style: solid;border-width: ' + borderWidth + 'px; margin-right: 5px; vertical-align: initial; height: ' + size + 'px; width: ' + size + 'px; border-color: rgb(255, 215, 0); background: linear-gradient(to right, rgb(255, 215, 0), white, rgb(255, 215, 0));"></span>';

    }
}

// 400未満のレーティングを補正
// 参考 https://qiita.com/anqooqie/items/92005e337a0d2569bdbd#性質4-初心者への慈悲
function correctLowerRating(rating) {
    if (rating >= 400) return rating;
    return 400 / Math.exp((400 - rating) / 400);
}

function changeProblemTitle(problemId, estimatedDifficulties, problemTitle, isSmall = true) {
    const problem = estimatedDifficulties[problemId];

    // 問題が存在しなければ終了
    if (problem == null) return;
    if (problem.difficulty != null) {
        const difficulty = correctLowerRating(problem.difficulty).toFixed();
        problemTitle.style.color = colorRating(difficulty);
        if (problem.is_experimental) problemTitle.insertAdjacentHTML("afterbegin", "🧪");
        problemTitle.insertAdjacentHTML("beforebegin", generateDifficultyCircle(difficulty, isSmall));
    }
    else {
        problemTitle.style.color = "#17a2b8";
        const unavailableCircle = "(?)";
        problemTitle.insertAdjacentHTML("afterbegin", unavailableCircle);
    }
}

// 推定難易度文字列を生成
function generateDifficultyText(difficulty, is_experimental) {
    // 推定難易度を補正して四捨五入
    difficulty = correctLowerRating(difficulty);
    difficulty = difficulty.toFixed();

    const textValue = "<span style='font-weight: bold; color: " + colorRating(difficulty) + ";'>" + difficulty + "</span>";
    // textDiff = "<a href='https://kenkoooo.com/atcoder/#/table/" + userScreenName + "'>Difficulty</a>";
    const textDiff = "Difficulty";

    return textDiff + ": " + textValue + (is_experimental ? " (🧪)" : "");
}

// 推定難易度表示を追加する
function addDifficultyText(problemId, estimatedDifficulties, problemStatus) {
    const problem = estimatedDifficulties[problemId];

    // 問題が存在しなければ終了
    if (problem == null) return;

    if (problem.difficulty != null) {
        // 難易度を表示する文字列を生成
        const text = generateDifficultyText(problem.difficulty, problem.is_experimental);
        problemStatus.insertAdjacentHTML('beforeend', " / " + text);
    } else
        problemStatus.insertAdjacentHTML('beforeend', " / Difficulty: <span style='font-weight: bold; color: #17a2b8;'>Unavailable</span>");
}

function displayDifficulty(functions) {
  functions.forEach(func => func());
  document.getElementById('displayButton').style.display = 'none';
}

function addDifficultyShowButton(placeToAdd, functions) {
  placeToAdd.insertAdjacentHTML("beforebegin", `<input id="displayButton" type="button" value="diff"/>`);
  document.getElementById('displayButton').onclick = () => displayDifficulty(functions);
}

// AC、コンテスト中AC、ペナルティ数、AC時間、最大得点、コンテスト中最大得点を計算
function searchSubmissionsResult(submissions) {
    const nonPenaltyJudge = ["AC", "CE", "IE", "WJ", "WR"];
    submissions.sort((a, b) => a.epoch_second - b.epoch_second);

    let accepted = false;
    let acceptedDuringContest = false;
    let penalties = 0;
    let acceptedTime = contestEndTime;
    let maxPoint = 0;
    let maxPointDuringContest = 0;

    for (const item of submissions) {
        const duringContest = contestStartTime <= item.epoch_second && item.epoch_second < contestEndTime;

        if (item.result == "AC") {
            accepted = true;
            if (duringContest) {
                acceptedDuringContest = true;
                acceptedTime = Math.min(item.epoch_second, acceptedTime);
            }
        }

        if (!accepted && duringContest && !nonPenaltyJudge.includes(item.result)) {
            penalties++;
        }

        maxPoint = Math.max(item.point, maxPoint);
        if (duringContest)
            maxPointDuringContest = Math.max(item.point, maxPointDuringContest);
    }

    return { accepted, acceptedDuringContest, penalties, acceptedTime, maxPoint, maxPointDuringContest };
}

function epochTime2HHMM(time) {
    return Math.floor(time / 60).toFixed() + ":" + (time % 60).toFixed().padStart(2, '0');
}

// ACしたか、AC時間、ペナルティ数を表示
function addIsSolvedText(problemId, userSubmissions, problemStatus) {
    const submissions = userSubmissions.filter(function (item, index) { if (item.problem_id == problemId) return true; });
    const submitted = submissions.length > 0;
    const { accepted, acceptedDuringContest, penalties, acceptedTime, maxPoint, maxPointDuringContest } = searchSubmissionsResult(submissions);

    let text = "Is Solved: ";
    if (acceptedDuringContest) text += "<span style='font-weight: bold; color: white; background: green; border-radius: 20%;'>✓</span>";
    else if (accepted) text += "<span style='font-weight: bold; color: green;'>✓</span>";
    else if (submitted) text += "<span style='font-weight: bold; color: orange;'>✘</span>";
    else text += "<span style='font-weight: bold; color: gray;'>✘</span>";

    if (acceptedDuringContest)
        text += " <span style='font-size: x-small; color: grey;'>" + epochTime2HHMM(acceptedTime - contestStartTime) + "</span> ";

    if (penalties > 0)
        text += " <span style='font-size: x-small; color: red;'>(" + penalties + ")</span> ";

    if (maxPoint >= 10000) {
        text += " <span style='font-size: x-small; color: orange;'>" + maxPoint + "</span> ";
        if (maxPointDuringContest != maxPoint)
            text += " <span style='font-size: x-small; color: orange;'>(" + maxPointDuringContest + ")</span> ";
    }

    problemStatus.insertAdjacentHTML('beforeend', " / " + text);
}
