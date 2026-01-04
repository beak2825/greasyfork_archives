// ==UserScript==
// @name      はてブ一覧ページで各コメントへのブクマ数を表示するやつ(HatebuCommentCounter)
// @name:en         HatebuCommentCounter
// @description はてブ一覧ページで、表示中のはてブと各コメントのブクマ数とそのリンクを表示して、大元のコメント自体を少しだけ赤く背景色を付けます。
// @description:en  A tool/script that displays the number of bookmarks for self-page and each comment on the Hatena Bookmark list page.
// @namespace    HatebuCommentCounter
// @version      2025-09-08
// @author       iHok
// @match        https://b.hatena.ne.jp/entry/s/*
// @icon         https://b.hatena.ne.jp/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      bookmark.hatenaapis.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539532/%E3%81%AF%E3%81%A6%E3%83%96%E4%B8%80%E8%A6%A7%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%A7%E5%90%84%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%B8%E3%81%AE%E3%83%96%E3%82%AF%E3%83%9E%E6%95%B0%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4%28HatebuCommentCounter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539532/%E3%81%AF%E3%81%A6%E3%83%96%E4%B8%80%E8%A6%A7%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%A7%E5%90%84%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%B8%E3%81%AE%E3%83%96%E3%82%AF%E3%83%9E%E6%95%B0%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4%28HatebuCommentCounter%29.meta.js
// ==/UserScript==

(()=> {
    'use strict';
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://bookmark.hatenaapis.com/count/entries?url="+location.href,
            headers: {
                "Content-Type": "application/json"
            },
            onload: (response) => {
                if(0<JSON.parse(response.responseText)[location.href]){
                        document.querySelector(".entry-info").style.background = "#FF000011";
                        document.querySelector(".entry-info-users").insertAdjacentHTML('beforeend', " <a href=\"//b.hatena.ne.jp/entry/" + location.href?.replace("https://", "s/") + "\" target=\"_blank\" >" + JSON.parse(response.responseText)[location.href] + "users(B!)</a>");
                }
            }
        });
})();

const intervalId = setInterval(() => {
    'use strict';
    if(document.querySelectorAll(".comment-list-collaplse-box:not(.is-hidden),.bookmarks-sort-panel .entry-comment-readmore:not(.is-hidden)")?.length<1 && document.querySelectorAll(".entry-comment-permalink [href^='/entry/'][href*='/comment/']:not(.commentCountChecked)")?.length<1){
      clearInterval(intervalId);
    }
    for (let i = 0,HatebuComments=document.querySelectorAll(".entry-comment-permalink [href^='/entry/'][href*='/comment/']:not(.commentCountChecked)"); i < HatebuComments.length / 50; i++) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://bookmark.hatenaapis.com/count/entries?url=" + Array.from(HatebuComments).slice(i * 50, i * 50 + 50).join('&url='),
            headers: {
                "Content-Type": "application/json"
            },
            onload: (response) => {
                for (let item in JSON.parse(response.responseText)) {
                    if (JSON.parse(response.responseText)[item]) {
                        document.querySelector(".entry-comment-permalink [href^='" + item.replace(location.origin, "") + "']:not(.commentCountChecked)").closest("[data-user-name]").style.background = "#FF000011"
                        document.querySelector(".entry-comment-permalink [href^='" + item.replace(location.origin, "") + "']:not(.commentCountChecked)").insertAdjacentHTML('afterend', " <a style=\"color: red;\" href=\"//b.hatena.ne.jp/entry/" + item?.replace("https://", "s/") + "\" target=\"_blank\" class=\"commentCountChecked\">" + JSON.parse(response.responseText)[item] + "users(B!)</a>")
                        document.querySelector(".entry-comment-permalink [href^='" + item.replace(location.origin, "") + "']:not(.commentCountChecked)").classList.add("commentCountChecked");
                    } else{
                        document.querySelector(".entry-comment-permalink [href^='" + item.replace(location.origin, "") + "']:not(.commentCountChecked)").classList.add("commentCountChecked");
                    }
                }
            }
        });
    }
},1000)//新着ページの追加読み込み対策のため、1秒単位でチェックするようにしています。もっと早くしたい場合は、左記の1000を調整してください。