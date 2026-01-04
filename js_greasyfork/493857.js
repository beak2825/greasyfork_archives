// ==UserScript==
// @name         ニコニコ大百科　掲示板IDリスト（他のスクリプトの前提データ）
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  自分のIDリストをheadにscriptで追加（他のスクリプトで使用する）
// @author       _Hiiji
// @match        *://dic.nicovideo.jp/b/a/*
// @match        *://dic.nicovideo.jp/a/*
// @match        *://dic.nicovideo.jp/p/b/*
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=16&domain=dic.nicovideo.jp
// @run-at       document-body
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493857/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E3%80%80%E6%8E%B2%E7%A4%BA%E6%9D%BFID%E3%83%AA%E3%82%B9%E3%83%88%EF%BC%88%E4%BB%96%E3%81%AE%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%81%AE%E5%89%8D%E6%8F%90%E3%83%87%E3%83%BC%E3%82%BF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/493857/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E3%80%80%E6%8E%B2%E7%A4%BA%E6%9D%BFID%E3%83%AA%E3%82%B9%E3%83%88%EF%BC%88%E4%BB%96%E3%81%AE%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%81%AE%E5%89%8D%E6%8F%90%E3%83%87%E3%83%BC%E3%82%BF%EF%BC%89.meta.js
// ==/UserScript==

(function (document) {
    'use strict';
    const DataList = [
        //▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

        /*0～9*/
        /*A～Z*/
        /*あ*/
        /*か*/
        ["グニャラくん", "117440", "IEmEVa4TjM"], // 例：これは記事の名前・ID・その記事での「グニャラくん★」のID
        /*さ*/
        /*た*/
        /*な*/
        /*は*/
        /*ま*/
        /*や*/
        /*ら*/
        /*わ*/

        //▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
        // Tampermonkey_niconico_my_res_ID_list = [["","",""],["","",""],～～～];
        // ↓のは「掲示板　抽出ページ」では書き込まない
        // pageID = Tampermonkey_niconico_page_ID_seach();
        // [DataListName, DataListPageID, DataListResID] = Tampermonkey_niconico_my_res_ID_list_each_page(pageID);
        ["", "", ""]];
    const DataCount = DataList.length - 1;
    let content = "var Tampermonkey_niconico_my_res_ID_list=[";
    // 二次元配列で全て挿入
    for (let i = 0; i < DataCount; i++) {
        content += '["' + DataList[i][0] + '","' + DataList[i][1] + '","' + DataList[i][2] + '"]';
        if (i < DataCount - 1) { content += ','; }
    }
    content += '];';
    // console.log(content);
    // 「掲示板抽出ページ」にはIDが無いのでこの部分はいらない
    if (location.pathname !== "/b/a/") {
        const str1 = function () {/*ここからcontentに挿入*/
            var Tampermonkey_niconico_page_ID_seach = function () {
                const url_path = location.pathname;
                if (!url_path.indexOf("/a/"))/*記事ページ*/ {
                    return document.head.querySelector('meta[property="og:url"]').content.replace("https://dic.nicovideo.jp/id/", "");
                } else if (!url_path.indexOf("/p/b/"))/*書き込みページ*/ {
                    return url_path.replace("/p/b/", "");
                } else if (!url_path.indexOf("/b/a/"))/*掲示板ページ*/ {
                    return document.querySelector('div[id^="embed_res_form_"]').id.replace("embed_res_form_", "");
                };
                return "";
            };
            var Tampermonkey_niconico_my_res_ID_list_each_page = function (pageID) {
                const DataListCount = Tampermonkey_niconico_my_res_ID_list.length;
                for (let i = 0; i < DataListCount; i++) {
                    if (pageID === Tampermonkey_niconico_my_res_ID_list[i][1]) {
                        return [Tampermonkey_niconico_my_res_ID_list[i][0], Tampermonkey_niconico_my_res_ID_list[i][1], Tampermonkey_niconico_my_res_ID_list[i][2]];
                    }
                };
                return ["", "", ""];
            }
            /*ここまでcontentに挿入*/}.toString().split("\n").slice(1, -1).join("\n").replace(/ {4}|\n/g, "");
        // console.log(str1);
        content += str1;
        // console.log(content);
    }
    const element_script1 = document.createElement("script");
    element_script1.type = "text/javascript";
    element_script1.innerText = content;
    document.head.appendChild(element_script1);
})(document);
