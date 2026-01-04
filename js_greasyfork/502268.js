// ==UserScript==
// @name         ハーメルン　書いた感想 ページ更新
// @namespace    https://greasyfork.org/ja/users/942894
// @version      20240731
// @description  自分の書いた感想のリンク先を更新
// @author       _Hiiji
// @match        *://syosetu.org/?mode=wrote_review*
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=32&domain=syosetu.org
// @run-at       document-idle
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/502268/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%80%80%E6%9B%B8%E3%81%84%E3%81%9F%E6%84%9F%E6%83%B3%20%E3%83%9A%E3%83%BC%E3%82%B8%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/502268/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%80%80%E6%9B%B8%E3%81%84%E3%81%9F%E6%84%9F%E6%83%B3%20%E3%83%9A%E3%83%BC%E3%82%B8%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function (document) {
    'use strict';
    // 「感想ページ」に書いてある「○○話」を参照して「自分の書いた感想ページ」のリンクを更新する
    const Link_Review_Reload = function (i, volume, nid, rid) {
        // タイトルへのリンク変更（通信失敗した時用の仮置き）
        Section[i].querySelector("h3 > a").href += volume + ".html";

        const Load_url = "https://syosetu.org/?mode=review&nid=" + nid + "&rid=" + rid;
        const xhr = new XMLHttpRequest();
        let responce_text = "";
        xhr.responseType = "document";
        xhr.open("GET", Load_url, true);
        xhr.timeout = 10000;
        xhr.onload = () => {
            if(xhr.status >= 400 && xhr.status <= 599) {
                responce_text = xhr.status+"エラー";
            } else {
                responce_text = "更新";
                volume = xhr.responseXML.querySelector("div.section3 > h3 > a:nth-of-type(4)").innerText.replace("話", "");
            }
            // タイトルのリンク更新
            Section[i].querySelector("h3 > a").href = "https://syosetu.org/novel/" + nid + "/" + volume + ".html";
            // 感想ページの文言とリンク更新
            Section[i].querySelector("p > a").innerText = volume + "話感想欄("+responce_text+")"
            Section[i].querySelector("p > a").href = "https://syosetu.org/?mode=review&nid=" + nid + "&volume=" + volume;

        }
        xhr.onerror = () => { Section[i].querySelector("p > a").innerText += "(接続エラー)"; }
        xhr.onabort = () => { Section[i].querySelector("p > a").innerText += "(中断)"; }
        xhr.ontimeout = () => { Section[i].querySelector("p > a").innerText += "(タイムアウト)"; }
        xhr.send();
    }

    const Section = document.querySelectorAll("div.section3");
    let Link_Review = new Array(Section.length); // 「○話感想欄」のリンク
    let Link_Review_Add = new Array(Section.length); // 「追記」のリンク
    let volume = new Array(Section.length); // 小説のページ数
    let nid = new Array(Section.length); // 小説のID
    let rid = new Array(Section.length); // 感想のID

    // 各小説の感想のリンク先を更新する
    for (let i = 0; i < Section.length; i++) {
        Link_Review[i] = Section[i].querySelector("p > a").href;
        Link_Review_Add[i] = Section[i].querySelector("p > a:nth-of-type(2)").href;
        // Link_Page       = https://syosetu.org/novel/(nid)/
        // Link_Review     = https://syosetu.org/?mode=review&nid=(nid)&volume=(volume)
        // Link_Review_Add = https://syosetu.org/?mode=review_add&rid=(rid)&nid=(nid)
        volume[i] = Link_Review[i].split("&volume=")[1];
        nid[i] = Link_Review_Add[i].split("&nid=")[1];
        rid[i] = Link_Review_Add[i].split(/&rid=|&nid=/)[1];

        // 感想欄のリンクを更新
        Link_Review_Reload(i, volume[i], nid[i], rid[i]);
        // リンクを新しいタブで開くようにする
        for (const val of Section[i].querySelectorAll("a")) { val.setAttribute('target', '_blank'); }
    }
})(document);
