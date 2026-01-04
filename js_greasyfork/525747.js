// ==UserScript==
// @name         New Incremental Script
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  新しい放置ゲームで使える便利スクリプトです。
// @author       yaakiyu
// @match        https://dem08656775.github.io/newincrementalgame/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525747/New%20Incremental%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/525747/New%20Incremental%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const instance = document.getElementById("app").__vue_app__._instance;
    const ctx = instance.ctx;
    const data = instance.data;

    // データコピーボタンの追加 (Original by ねちょ氏)
    function dataCopyButton(){
        // 最新のデータ反映のため、一度セーブしてからコピーする。
        ctx.save();
        navigator.clipboard.writeText(localStorage.getItem("playerStoredb"));
        console.log("データコピー完了");
        // ちゃんとコピーされたかの確認
        data.exported = "データコピー完了";
    };

    const bt = document.createElement("button");
    bt.type = "button";
    bt.id = "exportsave_clipboard";
    bt.onclick = dataCopyButton;
    bt.innerHTML = "データコピー";
    document.getElementById("exportsave").parentElement.lastElementChild.after(bt);

    // ペーストボタン
    function dataPasteButton(){
        navigator.clipboard.readText().then((input) => {
          if (window.confirm("データを貼り付けしますか？")){
            localStorage.setItem("playerStoredb",input);
            ctx.dataload();
            ctx.load(0);
          }
        })
    }

    const bt2 = document.createElement("button");
    bt2.type = "button";
    bt2.id = "importsave_clipboard";
    bt2.onclick = dataPasteButton;
    bt2.innerHTML = "データ貼り付け";
    document.getElementById("importsave").parentElement.lastElementChild.after(bt2);

    // 設定タブを開いた際に以前エクスポートしていた古いデータを削除
    const optionButton = document.getElementById("option");
    function removeSaveDataText(){
        data.exported = "";
    }
    optionButton.onclick = removeSaveDataText;

    // 獲得した里程にホバーしたときに内容を表示する
    const ritei = [
        "ポイントを0より大きくする", "ポイントを777より大きくする", "ポイントを7777777より大きくする", "ポイントを1e19より大きくする",
        "ポイントを1e36より大きくする", "ポイントを1e77より大きくする", "ポイントを1e81より大きくする", "ポイントを1e303より大きくする",
        "発生器1を1つ以上購入する", "発生器2を1つ以上購入する", "発生器3を1つ以上購入する", "発生器4を1つ以上購入する",
        "発生器5を1つ以上購入する", "発生器6を1つ以上購入する", "発生器7を1つ以上購入する", "発生器8を1つ以上購入する",
        "時間加速器1を1つ以上購入する", "時間加速器2を1つ以上購入する", "時間加速器3を1つ以上購入する", "時間加速器4を1つ以上購入する",
        "時間加速器5を1つ以上購入する", "時間加速器6を1つ以上購入する", "時間加速器7を1つ以上購入する", "時間加速器8を1つ以上購入する",
        "段位リセット回数を200より大きくする", "段位リセット回数を999より大きくする", "挑戦1を達成する", "挑戦2を達成する",
        "挑戦3を達成する", "挑戦4を達成する", "挑戦5を達成する", "挑戦6を達成する", "挑戦7を達成する", "挑戦8を達成する",
        "挑戦を32種類以上達成する", "挑戦を64種類以上達成する", "挑戦を96種類以上達成する", "挑戦を128種類以上達成する",
        "挑戦を160種類以上達成する", "挑戦を192種類以上達成する", "挑戦を224種類以上達成する", "挑戦を255種類以上達成する",
        "階位リセット回数を1より大きくする", "階位リセット回数を4より大きくする", "階位リセット回数を9より大きくする",
        "階位リセット回数を99より大きくする", "階位リセット回数を999より大きくする", "段位効力の累計購入回数を4以上にする",
        "段位効力の累計購入回数を108以上にする", "段位効力の累計購入回数を256以上にする", "段位効力の累計購入回数を1728以上にする",
        "段位効力の累計購入回数を12500以上にする", "100以上の輝きを所持する", "1000以上の輝きを所持する", "10000以上の輝きを所持する",
        "100000以上の輝きを所持する", "1000000以上の輝きを所持する", "10000000以上の輝きを所持する",
        "設定タブ内で、データ吐き出しを行う", "設定タブ内で、ツイート設定機能を2つ以上設定する", "裏発生器1を1つ以上購入する",
        "裏発生器2を1つ以上購入する", "裏発生器3を1つ以上購入する", "裏発生器4を1つ以上購入する", "裏発生器5を1つ以上購入する",
        "裏発生器6を1つ以上購入する", "裏発生器7を1つ以上購入する", "裏発生器8を1つ以上購入する", "階位挑戦を32種類以上達成する",
        "階位挑戦を64種類以上達成する", "階位挑戦を96種類以上達成する", "階位挑戦を128種類以上達成する",
        "階位挑戦を160種類以上達成する", "階位挑戦を192種類以上達成する", "階位挑戦を224種類以上達成する",
        "階位挑戦を255種類以上達成する", "10以上の煌きを所有する", "100以上の煌きを所有する", "1000以上の煌きを所有する",
        "10000以上の煌きを所有する", "裏ポイントを1以上にする", "裏ポイントを777以上にする", "裏ポイントを7777777以上にする",
        "裏ポイントを1e18以上にする", "裏ポイントを1e72以上にする", "銅片を1個以上にする", "銅片を210個以上にする",
        "銅片を1275個以上にする", "銀片を1個以上にする", "銀片を210個以上にする", "銀片を1275個以上にする",
        "金片を1個以上にする", "金片を210個以上にする", "金片を1275個以上にする", "白金片を1個以上にする", "白金片を210個以上にする",
        "白金片を1275個以上にする", "裏段位を1以上にする", "裏段位を1e3より大きくする", "裏段位を1e10より大きくする",
        // 有冠者以上で表示される里程
        "冠位リセット回数を1以上にする", "冠位リセット回数を5以上にする", "冠位リセット回数を20以上にする",
        "冠位リセット回数を100以上にする", "時間回帰力を1以上にする", "時間回帰力を3以上にする", "時間回帰力を6以上にする",
        "時間回帰力を10以上にする", "階位を1e8より大きくする", "階位を1e10より大きくする", "階位を1e12より大きくする",
        "天上発生器1を1つ以上購入する", "天上発生器2を1つ以上購入する", "天上発生器3を1つ以上購入する", "天上発生器4を1つ以上購入する",
        "天上発生器5を1つ以上購入する", "天上発生器6を1つ以上購入する", "天上発生器7を1つ以上購入する", "天上発生器8を1つ以上購入する",
        "紫鋼片を1個以上にする", "紫鋼片を210個以上にする", "紫鋼片を1275個以上にする", "銅像を10個以上にする", "銀像を10個以上にする",
        "金像を10個以上にする", "白金像を10個以上にする", "冠位を100以上にする", "冠位を10000以上にする", "冠位を1e8以上にする",
        "天上ポイントを1以上にする", "天上ポイントを1e9以上にする", "天上ポイントを1e18以上にする", "天上ポイントを1e36以上にする",
        "瞬きを10以上にする", "瞬きを100以上にする", "瞬きを1000以上にする", "瞬きを10000以上にする", "瞬きを100000以上にする",
        "瞬きを1000000以上にする", "朱鋼片を1個以上にする", "朱鋼片を210個以上にする", "朱鋼片を1275個以上にする",
        "蒼鋼片を1個以上にする", "蒼鋼片を210個以上にする", "蒼鋼片を1275個以上にする", "紫鋼像を10個以上にする",
        "朱鋼像を10個以上にする", "蒼鋼像を10個以上にする", "銅像を64個以上にする", "銀像を64個以上にする", "金像を64個以上にする",
        "白金像を64個以上にする", "紫鋼像を64個以上にする", "朱鋼像を64個以上にする", "蒼鋼像を64個以上にする"
    ];
    const table = document.getElementsByClassName("smalltrophy")[0].children[0];
    for (const tr of table.children) {
        for (const td of tr.children) {
            td.children[0].title = ritei[parseInt(td.children[0].innerHTML) - 1];
        }
    }

    // 現在表示中のタブのボタンを黒くする (未完成)
    // const tabs = document.getElementsByClassName("tabs")[0];
    // function newClicked(original) {
    //     function tabButtonClicked() {
    //         if (typeof original == 'function') {original();}
    //         for (const tab of tabs.children) {
    //             tab.children[0].classList.remove("selected"); // 一旦すべて白にする
    //         }
    //         tabs.getElementById(ctx.player.currenttab).children[0].classList.add("selected");
    //     }
    //     return tabButtonClicked
    // }
    // for (const tab of tabs.children) {
    //     tab.children[0].onclick = newClicked(tab.children[0].onclick);
    // }
})();
