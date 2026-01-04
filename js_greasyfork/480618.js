// ==UserScript==
// @name         atcoder-estimate-unrated-performances
// @version      1.0.0
// @description  AtCoder のコンテスト成績表ページで、unrated 参加時のパフォーマンスの予測値を表示します。
// @author       lemondo
// @namespace    https://github.com/akira-john
// @include      https://atcoder.jp/users/*/history*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @copyright    
// @license      MIT License; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/480618/atcoder-estimate-unrated-performances.user.js
// @updateURL https://update.greasyfork.org/scripts/480618/atcoder-estimate-unrated-performances.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

$(function () {
    'use strict';

    let userName = "";

    // -------------->8---------------------------->8--------------

    // 色づけモードには以下の数値を指定します
    // -        0 : なし
    // -        1 : 文字を色づけ
    // -        2 : 背景を色づけ
    // - それ以外 : デフォルト設定

    // パフォーマンス値の色づけモード
    const perfColorizeMode = 2;

    // レート値の色づけモード
    const rateColorizeMode = 2;

    // --------------8<----------------------------8<--------------

    // 読み込み元と整合性を取る
    // https://wiki.greasespot.net/Third-Party_Libraries
    this.$ = this.jQuery = jQuery.noConflict(true);

    // 文字に色付けする
    function colorizeCellFont(cell, value) {
        cell.text('');

        if (value >= 3200) { // 王冠をつける
            const floorValue = Math.floor(value / 400) * 400;
            cell.append('<img src="https://img.atcoder.jp/assets/icon/crown' + floorValue + '.gif"> ');
        }

        let colorClass = 'user-black'; // 黒
        /**/ if (value < 400) colorClass = 'user-gray';   // 灰
        else if (value < 800) colorClass = 'user-brown';  // 茶
        else if (value < 1200) colorClass = 'user-green';  // 緑
        else if (value < 1600) colorClass = 'user-cyan';   // 水
        else if (value < 2000) colorClass = 'user-blue';   // 青
        else if (value < 2400) colorClass = 'user-yellow'; // 黄
        else if (value < 2800) colorClass = 'user-orange'; // 橙
        else /*            */ colorClass = 'user-red';    // 赤

        cell.append('<span class="' + colorClass + '">' + value + '</span>');
    }

    // 背景に色付けする
    function colorizeCellBackGround(cell, value) {
        cell.text(value);

        if (value < 3200) {
            let colorCode = '#FFFFFF'; // 白
            /**/ if (value < 400) colorCode = '#D9D9D9'; // 灰
            else if (value < 800) colorCode = '#D9C5B2'; // 茶
            else if (value < 1200) colorCode = '#B2D9B2'; // 緑
            else if (value < 1600) colorCode = '#B2ECEC'; // 水
            else if (value < 2000) colorCode = '#B2B2FF'; // 青
            else if (value < 2400) colorCode = '#ECECB2'; // 黄
            else if (value < 2800) colorCode = '#FFD9B2'; // 橙
            else /*value < 3200*/ colorCode = '#FFB2B2'; // 赤

            cell.attr('style', 'background-color:' + colorCode + ';>');
        }
        else if (value < 3600) { // 銀
            cell.attr('style', 'background-image: linear-gradient(135deg, #E4E4E4, #EEEEEE, #E4E4E4, #CCCCCC, #C4C4C4);>');
        }
        else { // 金
            cell.attr('style', 'background-image: linear-gradient(135deg, #FFD325, #FDEBA6, #FFE065, #FFCC00, #F0BE00);>');
        }
    }

    function estimatePerformance(data, contestName) {
        let before = -1;
        let after = -1;
        let user_index = -1;
        for (const key in data) {
            if (data[key]["UserScreenName"] == userName) {
                user_index = key;
            }
            else if (data[key]["IsRated"] && user_index == -1) {
                before = key;
            }
            else if (data[key]["IsRated"] && user_index != -1 && after == -1) {
                after = key;
            }
        };
        if (after == -1) {
            return 0;
        }
        if (before == -1) {
            if (contestName.slice(0, 3) == "abc") {
                return 2400;
            } else if (contestName.slice(0, 3) == "arc") {
                return 3200;
            } else {
                return 4000;
            }
        }

        let diff = data[before]["Performance"] - data[after]["Performance"];
        return data[after]["Performance"] + diff * (user_index - after) / (before - after);
    }

    async function getPerformance(contestName, cell) {
        console.log(contestName);

        fetch("https://atcoder.jp/contests/" + contestName + "/results/json")
            .then((response) => {
                return response.json();
            })
            .then(jsonData => {
                console.log(jsonData);
                let value = Math.round(estimatePerformance(jsonData, contestName));
                colorizeCellBackGround(cell, value);
                // cell.text(value);
                return value;
            }
            )
    }

    // ボタンがクリックされたときの処理を定義する関数
    async function handleClick(contestName, cell) {
        console.log('ボタンがクリックされました！ ' + contestName);
        const value = await getPerformance(contestName, cell);
    }

    const btnSimple = {
        "font-weight": "bold",
        "padding": "0.25em 0.5em",
        "text-decoration": "none",
        "color": "#262637",
        "border": "solid 2px #DDDDDD",
        "border-radius": "3px",
        "transition": ".4s",
    }

    // セルをmodeで色づけ
    function colorizeCell(cell, contestName, mode) {
        let value = cell.text();

        // value が nan = unrated
        if (isNaN(value)) {
            cell.text("");
            const button = document.createElement('button');
            button.textContent = 'estimate perf'; // ボタンのテキストを設定
            // ボタンにクリックイベントを追加して関数を実行する
            button.addEventListener('click', () => { handleClick(contestName, cell) });
            Object.assign(button.style, btnSimple);
            cell[0].appendChild(button);
            return;
        };
    }
    const currentURL = window.location.href;
    userName = currentURL.match("https://atcoder.jp/users\/(.*)/history")[1];
    console.log(userName);

    function getContestName(cell) {
        // href属性の値を取得する
        const contestName = cell.querySelector('a').getAttribute('href').match("/contests\/(.*)")[1];;
        return contestName;
    }

    $('#history').find('tbody').find('tr').each(function (i, contestInfo) {
        const tds = $(contestInfo).find('td');
        const contestName = getContestName(tds[1]);
        colorizeCell($(tds[3]), contestName, perfColorizeMode);
        // colorizeCell($(tds[4]), contestName, rateColorizeMode);
    });
});