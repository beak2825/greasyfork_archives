// ==UserScript==
// @name         AtCoderACPercentage
// @namespace    https://github.com/null-null-programming
// @version      0.4
// @description  自分と同じくらいのレートの人々の何％がその問題を解けているかを表示する。
// @author       null_null
// @license      MIT
// @include        https://atcoder.jp/contests/*/standings*
// @exclude        https://atcoder.jp/contests/*/standings/json
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/388000/AtCoderACPercentage.user.js
// @updateURL https://update.greasyfork.org/scripts/388000/AtCoderACPercentage.meta.js
// ==/UserScript==

(async function () {
    //参加者自身のRating
    const userRating = await getUserRating(userScreenName);

    //問題名のリスト
    const problemNames = standings.TaskInfo.map(task => task.TaskScreenName);
    //問題名の記号（AとかBとか）配列 <-これを作っておかないとF1 F2 などが来たときにバグる
    const Assignment = standings.TaskInfo.map(task => task.Assignment);

    let solvedPercentage;

    initView();
    updateData();
    updateView();

    //ビューのupdate監視
    new MutationObserver(updateView).observe(
        document.getElementById("standings-tbody"),
        { childList: true }
    );

    //リフレッシュボタンの監視(押されたとき/自動更新時に一瞬だけ無効化される)
    new MutationObserver(async mutationRecord => {
        const isDisabled = mutationRecord[0].target.classList.contains(
            "disabled"
        );
        if (isDisabled) {
            updateData();
            updateView();
        }
    })
    .observe(document.getElementById("refresh"), {
        attributes: true,
        attributeFilter: ["class"]
    });

    function updateData(){
        //コンテスト情報を辞書型に直す userScreenName->Data
        const contestResultData = {};
        //参加回数が15回以上のコンテスト参加者のuserScreenNameリスト
        let contestUserName = [];

        standings.StandingsData.forEach(res => {
            //辞書型に変換
            contestResultData[res.UserScreenName] = res;

            //コンテスト参加回数10回未満、自分自身、未提出者は除いてリストに入れる
            if (res.Competitions >= 10 && res.UserScreenName !== userScreenName && res.TotalResult.Count > 0)
                contestUserName.push(res.UserScreenName);
        });

        //TODO:評価関数の洗練
        //自身のレートとの絶対値の差が小さい順に並び替え。
        contestUserName.sort(function (x, y) {
            return Math.abs(userRating - contestResultData[x].Rating) - Math.abs(userRating - contestResultData[y].Rating);
        });

        //TODO:選抜者人数の見直し
        //選抜者人数の10パーセントを選抜者人数とする。
        const USER_NUM = contestUserName.length * 0.1;

        //自身のレートに近いUSER_NUM人の参加者を選抜
        contestUserName = contestUserName.slice(0, USER_NUM);

        //何人が解けたかを問題ごとに集計
        solvedPercentage = problemNames.map(problemName => {
            let sum = 0;

            //各ユーザーごとに集計
            contestUserName.forEach(userName => {
                if ((contestResultData[userName].TaskResults[problemName] || -1).Score > 0) sum++;
            });

            //小数第１位までパーセントを表示
            return Math.round(sum * 10 * 100 / USER_NUM) / 10;
        });
    }

    function initView(){
        //結果を表示するテーブルを作成する。
        //行を追加
        let table = document.getElementById('standings-tbody');
        let row = table.insertRow(-1);

        row.id = 'ac-percentage-row';

        //列を追加
        let cells = [];

        for (let i = 0; i < problemNames.length + 1; i++) {
            cells[i] = row.insertCell(i);

            if (i === 0) {
                //行の左端  題名を書き込む
                cells[i].innerText = 'AC Percentage';
                cells[i].style.color = '#00AA3E';
                cells[i].colSpan = '3';
            } else {
                cells[i].style.color = '#888888';
            }
            cells[i].style.fontSize = '80%';
        }
    }

    function updateView(){
        //結果を表示するテーブルを作成する。
        //行を取得
        let row = document.getElementById('ac-percentage-row');
        if (!row) initView();

        for (let i = 1; i < problemNames.length + 1; i++) {
            let cell = row.children[i];
            cell.innerText = Assignment[i - 1] + ':' + solvedPercentage[i - 1] + '%';
        }
    }
})();

//参加しているコンテスト名を取得する。
function getContestName() {
    let contestURL = location.href;
    let contestArray = contestURL.split('/');
    return contestArray[contestArray.length - 2];
}

async function getUserRating(userScreenName) {
    let parser = new DOMParser();
    let archiveDom = parser.parseFromString((await $.get('https://atcoder.jp/users/' + userScreenName)), "text/html");
    let userRating = archiveDom.querySelector("#main-container > div.row > div.col-sm-9 > table > tbody > tr:nth-child(2) > td > span");
    return Number(userRating.innerText);
}