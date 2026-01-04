// ==UserScript==
// @name           ピコカキコID表示
// @name:en        Pikokakiko ID Display
// @namespace      https://dic.nicovideo.jp/
// @version        0.31
// @description    ピコカキコのIDを画像に表示する
// @description:en Displays the ID of the pikokakiko on the image.
// @match          https://dic.nicovideo.jp/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/466221/%E3%83%94%E3%82%B3%E3%82%AB%E3%82%AD%E3%82%B3ID%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/466221/%E3%83%94%E3%82%B3%E3%82%AB%E3%82%AD%E3%82%B3ID%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 画像にIDを表示する関数
    function showID(img) {
        // IDを取得する
        let id = img.alt || img.onclick.toString().match(/\d+/)[0];
        // IDのリンクを作成する
        let link = document.createElement("a");
        link.href = "https://dic.nicovideo.jp/mml_id/" + id;
        link.target = "_blank";
        link.style.color = "red";
        link.style.fontSize = "10px";
        link.style.position = "absolute";
        link.style.left = "0";
        link.style.top = "0";
        link.style.zIndex = "9999";
        link.textContent = id;
        // 画像の親要素の親要素にリンクを追加する
        let grandparent = img.parentElement.parentElement;
        grandparent.style.position = "relative";
        grandparent.appendChild(link);
    }

    // ページ内のピコカキコ画像を取得する
    let images = document.querySelectorAll("img[src*='/img/pikoplayer.png'], img[data-src*='/img/pikoplayer.png']");
    // 画像にIDを表示する
    for (let img of images) {
        showID(img);
    }

})();