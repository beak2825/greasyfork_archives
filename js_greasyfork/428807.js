// ==UserScript==
// @name         niconico 縦長表示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  縦長表示のとき、ニコニコのコメント一覧を動画の下に配置して動画サイズを画面幅に設定します
// @author       y_kahou
// @match        https://www.nicovideo.jp/watch/*
// @grant        none
// @noframes
// @require      https://greasyfork.org/scripts/419955-y-method/code/y_method.js?version=908174
// @downloadURL https://update.greasyfork.org/scripts/428807/niconico%20%E7%B8%A6%E9%95%B7%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/428807/niconico%20%E7%B8%A6%E9%95%B7%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==


addStyle('nico-vertical', `

@media screen and (orientation: landscape) {
   /* 横向きの場合のスタイル */
}

/* 縦向きの場合のスタイル */
@media screen and (orientation: portrait) {
    .WatchAppContainer-main {
        margin: 0 1vw 16px;
    }
    .MainContainer {
        display: flex;
        flex-direction: column;
    }
    .MainContainer-player {
        width: 95vw;
    }
    .InView.VideoContainer{
        width: 100%;
        height: calc(95vw / 16 * 9);
    }
    .MainContainer-playerPanel {
        position: relative;
        height: 400px;
        width: 95vw;
    }
    
}
`);
