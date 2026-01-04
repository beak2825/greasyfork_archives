// ==UserScript==
// @name         Nico-Nico-URL-redirect
// @namespace    https://github.com/Edamamesukai
// @version      1.0.2
// @description  ニコニコのドメインのスマホ版表示を直します
// @author       Edamame_sukai
// @match        *://sp.nicovideo.jp/*
// @match        *://sp.seiga.nicovideo.jp/*
// @match        *://dic.nicovideo.jp/t/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460302/Nico-Nico-URL-redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/460302/Nico-Nico-URL-redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("niconico domain auto changer 実行します")
    // 動画プレイヤーがスマホ表示の場合、パソコン表示に直す
    if (location.href.match("sp.nicovideo.jp")) {
        location.href = location.href.replace("sp.nicovideo.jp", "nicovideo.jp");
    }
    // ニコニコ静画がスマホ表示の場合、パソコン表示に直す
    else if (location.href.match("sp.seiga.nicovideo.jp")) {
        location.href = location.href.replace("sp.seiga.nicovideo.jp", "seiga.nicovideo.jp").replace("/#!", "");
    }
    // ニコニコ大百科がスマホ表示の場合、パソコン表示に直す
    else if (location.href.match("dic.nicovideo.jp/t/a")) {
        location.href = location.href.replace("dic.nicovideo.jp/t/a", "dic.nicovideo.jp/a");
    }
})();