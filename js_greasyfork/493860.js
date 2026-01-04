// ==UserScript==
// @name         ニコニコ大百科　掲示板IDハイライト
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  自分の書き込みをハイライト
// @author       _Hiiji
// @match        *://dic.nicovideo.jp/b/a/*/*
// @match        *://dic.nicovideo.jp/a/*
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=16&domain=dic.nicovideo.jp
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493860/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E3%80%80%E6%8E%B2%E7%A4%BA%E6%9D%BFID%E3%83%8F%E3%82%A4%E3%83%A9%E3%82%A4%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/493860/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E3%80%80%E6%8E%B2%E7%A4%BA%E6%9D%BFID%E3%83%8F%E3%82%A4%E3%83%A9%E3%82%A4%E3%83%88.meta.js
// ==/UserScript==

(function (document) {
    'use strict';
    const HighLightingID = function (resID) {
        const ResList = document.querySelectorAll("dt.st-bbs_reshead")
        // console.log("レス" + ResList.length + "個");
        for (let i = 0; i < ResList.length; i++) {
            // console.log("レス" + i + "番目");
            // console.log(ResList[i].getAttribute('data-id_hash') + "：" + resID);
            if (ResList[i].getAttribute('data-id_hash') == resID) {
                // console.log("ハイライト" + i + "番目");
                // 自分のレスをハイライト
                ResList[i].setAttribute('style', 'background-color:#90ee90;');
                // 上下に自分のレスへのリンクを追加
                LinkCreate(ResList[i].getAttribute('data-res_no'), 0);
                LinkCreate(ResList[i].getAttribute('data-res_no'), 1);
            }
        }
    }

    const LinkCreate = function (No, flag) {
        const element_a = document.createElement("a");
        element_a.textContent = "「" + No + "」";
        element_a.href = "#" + No;
        document.querySelectorAll("div.st-pg_link-returnArticle")[flag].appendChild(element_a);
    }

    const pageName = document.title.replace("ニコニコ大百科: 「", "").split(/」について語るスレ|の掲示板へ投稿|とは \(/)[0];
    const pageID = Tampermonkey_niconico_page_ID_seach();
    let DataListName = "";
    let DataListPageID = "";
    let DataListResID = "";
    [DataListName, DataListPageID, DataListResID] = Tampermonkey_niconico_my_res_ID_list_each_page(pageID);

    const Data = ["1", "2", "3"];
    // console.log("名前：" + pageName);
    // console.log("ID：" + pageID);
    // console.log(Data);
    HighLightingID(DataListResID);
})(document);
