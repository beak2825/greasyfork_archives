// ==UserScript==
// @name         AtCoderDarkTheme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AtCoderのダークテーマです
// @author       null_null
// @license      MIT
// @match        https://atcoder.jp/*
// @exclude      https://atcoder.jp/contests/*/standings/json
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/388076/AtCoderDarkTheme.user.js
// @updateURL https://update.greasyfork.org/scripts/388076/AtCoderDarkTheme.meta.js
// ==/UserScript==

(function () {

    update();

    //順位表ページ　特別な処理をする。
    if (document.URL.match("/standings")) {

        new MutationObserver(update).observe(
            document.getElementById("standings-tbody"), {
                childList: true,
                attributes:true
            }
        );

        //リフレッシュボタンの監視
        new MutationObserver(async mutationRecord => {
                const isDisabled = mutationRecord[0].target.classList.contains(
                    "disabled"
                );
                if (isDisabled) {
                    update();
                }
            })
            .observe(document.getElementById("refresh"), {
                attributes: true,
                attributeFilter: ["class"]
            });

    }

    if (document.URL.match("/results")) {

        new MutationObserver(update).observe(
            document.getElementById("vue-results"), {
                childList: true,
                attributes:true
            }
        );

    }
/////////////////////////////////////////////////////////////////
    //外部全体
    $("body").css({
        "background-color": "#111111",
    });

    //外部左右
    $("#main-div.float-container").css({
        "background-color": "#111111"
    });

    //外部フッター
    $(".footer").css({
        "background-color": "#111111"
    });

    //////////////////////////////////////////////////////
    //https://atcoder.jp

    //内部コンテナ
    $(".float-container>#main-container").css({
        "background-color": "#333333",
        "color": "#EFFFE9"
    });

    //タイトル枠
    $(".insert-participant-box").css({
        "background-color": "#333333",
        "color": "#EFFFE9"
    });

    //
    $(".cnvtb-fixed").css({
        "background-color": "#333333",
    });

    //パネル内部
    $(".panel-primary").css({
        "background-color": "#333333",
        "border-color": "#E71D36",
        "color": "#EFFFE9"
    });

    //パネルヘッダー
    $(".panel-primary>.panel-heading").css({
        "background-color": "#E71D36",
        "border-color": "#E71D36",
        "color": "#EFFFE9"
    });

    //パネル内部
    $(".panel").css({
        "background-color": "#333333",
        "color": "#EFFFE9",
    });

    //インフォメーションパネル　タイトル
    $(".panel-info>.panel-heading").css({
        "background-color": "#2f4f4f",
        "border-color": "#2f4f4f",
        "color": "#EFFFE9"
    });

    //インフォメーションパネル外枠
    $(".panel-info").css({
        "border-color": "#2f4f4f"
    });

    //コンテストパネル外部
    $(".post-footer").css({
        "background-color": "#222222",
        "border-color": "#222222",
        "color": "#EFFFE9"
    });


    //////////////////////////////////////////////////////////
    //https://atcoder.jp/contests/

    //過去のコンテスト検索
    $(".panel-default>.panel-heading").css({
        "background-color": "#333333",
        "color": "#EFFFE9",
        "border-color": "#EFFFE9"
    });

    //過去コンテストパネル　外枠
    $(".panel-default").css({
        "border-color": "#EFFFE9"

    });

    //提出バー
    $(".dropdown-menu").css({
        "background-color": "#333333"
    });

    //ボタン
    $(".btn-primary").css({
        "background-color": "#E71D36",
        "border-color": "#E71D36"
    });

    //全体　後光
    $(".float-container>#main-container ").css({
        "box-shadow": "0px 0px 10px 5px #666666"
    });


    //サンプル　背景
    $("pre").css({
        "background-color": "#333333",
        "color": "#EFFFE9",
    });

    //nav 外枠
    $(".nav-tabs>li.active>a").css({
        "border-color": "#EFFFE9"
    });

    //コンテスト時間　文字部分
    $("small.contest-duration").css({
        "color": "#EFFFE9"
    });

    //灰色文字　調整
    $(".grey").css({
        "color": "#EFFFE9"
    });

    //順位表　所属　文字
    $(".ranking-affiliation").css({
        "color": "#EFFFE9"
    });

    //テーブル　線
    $(".table>thead>tr>th").css({
        "border-bottom": "#EFFFE9"
    });
    //テーブル　奇数番目　黒色背景固定
    $(".table-condensed>tbody>tr>td").css({
        "background-color": "#333333"
    });

    //参加対象　Rated対象　ペナルティ
    $("#main-container > div.row > div:nth-child(2) > p").css({
        "color":"#EFFFE9"
    });

    //コピーライト
    $("#copyright").css({
        "color":"#EFFFE9"
    });

    //問題文　赤文字
    $("code").css({
        "color":"#ff7a7a"
    });
})();

function update() {
    //レートの色を鮮やかにする
   if(!document.URL.match("/results")){

    $(".user-red").css({
        "color":"#ff7a7a"
    });

    $(".user-orange").css({
        "color": "#ffbc7a"
    });

    $(".user-yellow").css({
        "color": "#ffff7a"
    });
    $(".user-blue ").css({
        "color": "#7a7aff"
    });

    $(".user-cyan").css({
        "color": "#7affff"
    });

    $(".user-green").css({
        "color": "#7aff7a"
    });

    $(".user-brown").css({
        "color": "#8b4513"
    });

    $(".user-gray").css({
        "color": "#eeeeee"
    });

    $(".user-unrated").css({
        "color": "000000"
    });

    $(".user-admin").css({
        "color": "#2f4f4f"
    });
   }

    $("a").css({
        "color": "#EFFFE9",
        "background-color": "transparent"
    });

    $(".pagination>.active>a").css({
        "border-color": "#EFFFE9"
    });

    //テーブルの奇数番目
    $(".table-striped>tbody>tr:nth-of-type(odd)").css({
        "background-color": "#323232",
    });

    //順位表　順位
    $(".standings-rank").css({
        "background-color": "#333333"
    });
    //順位表　ユーザーネーム
    $(".standings-username").css({
        "background-color": "#333333"
    });
    //順位表　点数
    $(".standings-result").css({
        "background-color": "#333333"
    });

    //順位表下部文字
    $(".standings-result p").css({
        "color": "#EFFFE9"
    });
    //順位表下部文字
    $(".standings-fa td p").css({
        "color": "#EFFFE9"
    });
    //順位表下部文字
    $(".standings-statistics td p").css({
        "color": "#EFFFE9"
    });

     //得点
    $(".standings-score").css({
        "color": "#7a7aff"
    });

    //AC文字
    $(".standings-ac").css({
        "color": "#7aff7a"
    });

    //提出ペナルティ
    $(".standings-wa").css({
        "color": "#ff7a7a"
    });

    //順位表　正解者数
    $("#standings-tbody > tr.standings-statistics").css({
        "background-color":"#333333"
    });

　　//順位表　最速正解者
    $("#standings-tbody > tr.standings-fa").css({
        "background-color":"#333333"
    });
}