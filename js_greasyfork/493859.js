// ==UserScript==
// @name         ニコニコ大百科　掲示板IDリスト取得
// @namespace    https://greasyfork.org/ja/users/942894
// @version      20240807
// @description  掲示板書き込みプレビュー時のIDの隣に「掲示板IDリスト」に保存する用のデータをコピーするボタンを作る
// @author       _Hiiji
// @match        *://dic.nicovideo.jp/b/a/*/*
// @match        *://dic.nicovideo.jp/a/*
// @match        *://dic.nicovideo.jp/p/b/*
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=16&domain=dic.nicovideo.jp
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493859/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E3%80%80%E6%8E%B2%E7%A4%BA%E6%9D%BFID%E3%83%AA%E3%82%B9%E3%83%88%E5%8F%96%E5%BE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/493859/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E3%80%80%E6%8E%B2%E7%A4%BA%E6%9D%BFID%E3%83%AA%E3%82%B9%E3%83%88%E5%8F%96%E5%BE%97.meta.js
// ==/UserScript==

(function (document) {
    'use strict';
    const element_Create = function (node) {
        // すでにあったら戻る
        // if (node.parentNode.querySelector("a")) { return; }
        const element_a = document.createElement("a");
        if (pageID_match() && pageName_match()) {
            element_a.textContent = "　設定済み";
        } else if (pageID_match()) {
            element_a.textContent = "　設定済み（記事名変更有り）";
            element_a.addEventListener('click', function () { id_url_resid_copy(element_a) });
        } else {
            element_a.textContent = "　IDと記事名のセットをコピー";
            element_a.addEventListener('click', function () { id_url_resid_copy(element_a) });
        }
        element_a.href = "javascript:void(0)";

        node.parentNode.appendChild(element_a);
    }

    const id_url_resid_copy = function (node) {
        const clipboard_text = '        ["' + pageName + '", "' + pageID + '", "' + resID + '"],\n';
        // console.log(clipboard_text);
        text_copy(node, clipboard_text);
    }

    // クリップボードにコピー
    const text_copy = function (node, clipboard_text) {
        // 元のテキストを格納
        const original_text = node.textContent;
        //一時的に監視を停止
        navigator.clipboard.writeText(clipboard_text).then(
            () => {
                node.textContent = "　○コピー成功○";
                // 元のテキストに戻し 監視を再開
                setTimeout(function () { node.textContent = original_text; },
                    2000);
            },
            () => {
                node.textContent = "　○コピー失敗○";
                // 元のテキストに戻し 監視を再開
                setTimeout(function () { node.textContent = original_text; },
                    2000);
            }
        );
    }


    const pageName_match = function () { return (DataListName === pageName); }
    const pageID_match = function () { return (DataListPageID === pageID); }
    //console.log("1" === "1");

    const pageID = Tampermonkey_niconico_page_ID_seach();
    // 掲示板ページの「掲示板にレスをする」を新しいタブで開くようにする
    const targetNode = document.querySelector(".st-button_bbsRes");
    if (targetNode) {
        targetNode.setAttribute("type","button");
        targetNode.setAttribute("onclick","window.open('/p/b/"+pageID+"')");
        return;
    }

    // ここからhttps://dic.nicovideo.jp/p/b/****　のやつ
    const pageName = document.title.replace("の掲示板へ投稿 - ニコニコ大百科", "");
    let DataListName = "";
    let DataListPageID = "";
    let DataListResID = "";
    [DataListName, DataListPageID, DataListResID] = Tampermonkey_niconico_my_res_ID_list_each_page(pageID);
    const resID = document.querySelector("div.st-bbs_resInfo").innerText.split("ID: ")[1]; //　書き込みプレビュー中なら存在する

    let MyIdNode = null; // 「書き込みプレビュー」で出てくる自分のIDが書かれたノード

    if (!location.pathname.indexOf("/p/b/") && resID) {
        element_Create(MyIdNode);
    }

})(document);
