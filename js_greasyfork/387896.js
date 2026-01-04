// ==UserScript==
// @name         AtcoderColorNEWS
// @description  お気に入りの人々の、色の変化を通知します。
// @namespace    https://github.com/null-null-programming
// @version      0.1
// @author       null_null
// @license      MIT
// @match        https://atcoder.jp/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387896/AtcoderColorNEWS.user.js
// @updateURL https://update.greasyfork.org/scripts/387896/AtcoderColorNEWS.meta.js
// ==/UserScript==

(async function () {
    //直近のコンテスト
    const latestContestScreenName = await getLatestContestScreenName();

    //既に通知したかどうかをlocalStorageで判定する。imformedFlagがtrueのときのみ通知する。
    if (imformedFlag(latestContestScreenName) === false) return;

    //お気に入りリストを取得
    let favList = JSON.parse(localStorage.fav);

    //レートを色に変換するリスト
    let color = ['灰', '茶', '緑', '水', '青', '黄', '橙', '赤', '自由'];

    //直近コンテストの結果一覧
    const latestContestResult = await getContestResultData(latestContestScreenName);

    //直近コンテストの結果一覧を辞書型に変換
    let contestResultDic = {};
    latestContestResult.forEach(res => contestResultDic[res.UserScreenName] = res);

    let string = ""; //通知用string
    //favlistのそれぞれの要素からstringを返すようにして、それをjoin
    string = favList.map(username => {
        //個人の結果
        const result = contestResultDic[username];

        //個人の結果がない場合だめ
        if (!result) return "";

        //Rateを取得し、色に変換する
        const preRate = getColorIndex(result.OldRating);
        const nowRate = getColorIndex(result.NewRating);

        //前の色よりも今の色のほうが高くない場合だめ
        if (preRate >= nowRate) return "";

        //繋げる文字列を返す
        return `${E(username)}さんのレートが${color[nowRate]}色に変わりました！\n`;
    }).join("");

    if (string.length > 0) {
        window.alert(string); //20秒後、またはクリックで消える
    }

    //localStorageに通知したコンテスト名を保存する。
    localStorage.setItem('keyContestName', latestContestScreenName);
})();

//通知済みかどうかを調べる
function imformedFlag(latestContestScreenName) {
    if (localStorage.getItem('keyContestName') !== latestContestScreenName) return true;
    return false;
}

//Rateを色に変換する
function getColorIndex(rate) {
    return Math.min(8, Math.floor(rate / 400));
}

//直近のコンテスト名を取得する。
async function getLatestContestScreenName() {
    let parser = new DOMParser();
    let archiveDom = parser.parseFromString((await $.get("https://atcoder.jp/contests/archive")), "text/html");
    let contestScreenName = archiveDom.querySelector("#main-container > div.row > div.col-lg-9.col-md-8 > div.panel.panel-default > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > a");
    contestScreenName = contestScreenName.toString().split('/').pop();
    return contestScreenName;
}

async function getContestResultData(contestScreenName) {
    return await $.ajax(`https://atcoder.jp/contests/${contestScreenName}/results/json`);
}