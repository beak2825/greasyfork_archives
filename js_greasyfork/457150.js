// ==UserScript==
// @name         AtCoderUnratedPerfDisplayer
// @namespace    https://new-textfile.github.io/
// @version      1.0.1
// @description  Unrated参加したRated Algoコンテストのパフォーマンス推定値を表示します。
// @author       new_textfile
// @match        https://atcoder.jp/users/*
// @exclude      https://atcoder.jp/users/*/history?*contestType=heuristic*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457150/AtCoderUnratedPerfDisplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/457150/AtCoderUnratedPerfDisplayer.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2022 new_textfile

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(async function() {
    'use strict';

    if(location.href.match(/https:\/\/atcoder.jp\/users\/.*\/history\/share\/.*/g) !== null){
        await displayperf_contest_result(); //コンテスト成績証ページについての処理を行う
    }
    else if(location.href.match(/https:\/\/atcoder.jp\/users\/.*\/history.*/g) !== null){
        await displayperf_competition_history(); //コンテスト成績表ページについての処理を行う
    }
    else{
        //ユーザーのプロフィールページを訪れた時点でパフォーマンスのfetchを行っておく
        let username = document.querySelector("a.username span").innerText;
        await fetch_userperfs(username);
    }

})();

async function fetch_userperfs(username, update_flag=false){
    let url = "https://new-textfile.github.io/AtCoderUnratedPerformances/userperfs/" + username + ".json";

    let fetched_data = JSON.parse(localStorage.getItem("atcoder_unrated_perf_displayer-" + username));
    let fetch_flag = false;

    if(fetched_data === null){ //localStorageに保存されていない場合
        fetch_flag = true;
    }
    else if(update_flag){ //前回のfetchから10分以上経っている場合
        let last_updated_date = new Date(fetched_data.last_update);
        let now_date = new Date();
        let minutes_diff = (now_date.getTime() - last_updated_date.getTime()) / (1000.0 * 60.0);
        fetch_flag = (minutes_diff >= 10.0);
    }

    if(fetch_flag){
        //Unratedコンテストのパフォーマンス推定値一覧をgithubから取得
        let userperfs_html = await fetch(url);
        if(!userperfs_html.ok) return; //fetchに失敗したら何もせず終了
        let userperfs = await (await fetch(url)).json();

        //fetchを行った時刻と取得したパフォーマンスをlocalStorageに保存する
        let savedata = {"last_update": new Date(), "userperfs": userperfs};
        localStorage.setItem("atcoder_unrated_perf_displayer-" + username, JSON.stringify(savedata));
    }

    return;
}

async function displayperf(userperfs){
    let rows_cnt = document.querySelectorAll("tr").length;
    let rating;

    for(let rownum = rows_cnt-1; rownum >= 1; rownum--){
        let contest = document.querySelectorAll("tr")[rownum].querySelectorAll("td");
        let contest_name = contest[1].querySelector("a").href.split("/")[4];
        let is_rated = (contest[5].getAttribute("data-search") == "[RATED]");

        if(is_rated){
            rating = contest[4].innerText;
            continue;
        }

        if(userperfs[contest_name] !== undefined) contest[3].innerText = userperfs[contest_name];

        // Unratedコンテストの新Ratingの列を埋めたい場合はコメントを外す
        // contest[4].innerText = rating;
    }
    return;
}

async function displayperf_competition_history(){
    if(document.querySelector("a.username span") === null) return;

    let username = document.querySelector("a.username span").innerText;

    //Unratedコンテストのパフォーマンス推定値一覧を取得
    await fetch_userperfs(username);
    let userperfs = JSON.parse(localStorage.getItem("atcoder_unrated_perf_displayer-" + username)).userperfs;

    //userperfsを参照して, コンテスト成績表のパフォーマンスの列を書き換える
    displayperf(userperfs);

    //パフォーマンス推定値一覧を更新
    await fetch_userperfs(username, true);
}

async function displayperf_contest_result(){
    if(document.querySelector("table a.username span") === null) return;

    let username = document.querySelector("table a.username span").innerText;
    let contest = document.querySelectorAll("table tr")[1].querySelector("a");
    let contest_name = contest.href.split("/")[4];

    //Unratedコンテストのパフォーマンス推定値一覧を取得
    await fetch_userperfs(username);
    let userperfs = JSON.parse(localStorage.getItem("atcoder_unrated_perf_displayer-" + username)).userperfs;

    if(userperfs[contest_name] !== undefined){
        //コンテスト成績証にパフォーマンスの行を追加
        add_perfrow(userperfs[contest_name]);

        //twitterの共有ボタンのツイートメッセージを変更
        change_tweetmsg(userperfs[contest_name]);
    }
}

function add_perfrow(perf){
    let lang = document.head.querySelectorAll("meta")[1].content;

    let innerHTML_str = "";
    innerHTML_str += "<th class=\"no-break\">";
    innerHTML_str += (lang == "ja" ? "パフォーマンス(推定)" : "Performance(Estimated)");
    innerHTML_str += "</th>\n<td><span class=\"user-" + perf2color(perf) +"\">" + perf + "</span></td>";

    document.querySelector("table").insertAdjacentHTML("beforeend", innerHTML_str);
}

function change_tweetmsg(perf){
    //言語設定(ja/en)
    let lang = document.head.querySelectorAll("meta")[1].content;

    //元のツイートメッセージ(の一部)
    let textlist = document.querySelector("div.a2a_kit").attributes[2].textContent.split("\n");

    let text = "";
    for(let rownum in textlist){
        text += textlist[rownum] + "\n";

        //元のツイートメッセージの1行目と2行目の間にパフォーマンスの行を追加
        if(rownum == 0){
            if(lang == "ja") text += "パフォーマンス(推定)：" + perf + "相当\n";
            else text += "Performance(Estimated): " + perf + "\n";
        }
    }

    document.querySelector("div.a2a_kit").setAttribute("data-a2a-title", text);
}

function perf2color(perf){
    let perf_num = Number(perf);
    let res = "";

    if(perf_num < 400) res = "gray";
    else if(perf_num < 800) res = "brown";
    else if(perf_num < 1200) res = "green";
    else if(perf_num < 1600) res = "cyan";
    else if(perf_num < 2000) res = "blue";
    else if(perf_num < 2400) res = "yellow";
    else if(perf_num < 2800) res = "orange";
    else res = "red";

    return res;
}