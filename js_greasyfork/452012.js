// ==UserScript==
// @name         niconico to YouTube jumper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ニコニコ動画の再生画面に、その動画のタイトルでYouTube検索した結果へのリンクを表示するScript
// @match        https://www.nicovideo.jp/watch/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author       mel
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452012/niconico%20to%20YouTube%20jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/452012/niconico%20to%20YouTube%20jumper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 動画タイトルの取得
    let title = document.title
    let songTitle = title.substring(0, title.length - 9)

    // YouTube検索リンクの設定
    let url='https://www.youtube.com/results?search_query='+songTitle

    // 動画説明文のelementを取得
    let div = document.getElementsByClassName("VideoDescription-html")[0];

    let str="YouTubeリンク"

    // 動画説明文の一番上にリンクを追加
    div.insertAdjacentHTML('afterbegin', str.link(url)+"<br>");

})()