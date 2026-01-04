// ==UserScript==
// @name        dアニメストア スムーズプレイヤー
// @namespace   https://github.com/chimaha/dAnimeSmoothPlayer
// @match       https://animestore.docomo.ne.jp/animestore/sc_d_pc*
// @grant       none
// @version     1.4
// @author      chimaha
// @description dアニメストアのFirefox限定フリーズバグを擬似的に回避します
// @license     MIT license
// @compatible  firefox
// @icon        https://animestore.docomo.ne.jp/favicon.ico
// @supportURL  https://github.com/chimaha/dAnimeSmoothPlayer/issues
// @downloadURL https://update.greasyfork.org/scripts/471981/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%20%E3%82%B9%E3%83%A0%E3%83%BC%E3%82%BA%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/471981/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%20%E3%82%B9%E3%83%A0%E3%83%BC%E3%82%BA%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC.meta.js
// ==/UserScript==

/*! dアニメストア スムーズプレイヤー | MIT license | https://github.com/chimaha/dAnimeSmoothPlayer/blob/main/LICENSE */

const video = document.querySelector('video');
function freezeRemover(setTime) {
    const observer = new MutationObserver(() => {
        observer.disconnect();
        let time = video.currentTime;
        video.currentTime = time - 3;
        video.pause();
        setTimeout(() => {
            video.currentTime = time;
            video.play();
        }, setTime);
    });
    const config = { childList: true };
    observer.observe(document.querySelector("#time"), config);
}


// 動画を開いた時
freezeRemover(300);

// シークバーをクリックした時
const seekbar = document.querySelector('.seekArea');
seekbar.addEventListener("mouseup", () => {
    freezeRemover(400);
});

// シークバー下の30秒戻るボタンを押した時
const backButton = document.querySelector('.buttonArea > .back');
backButton.addEventListener("click", () => {
    freezeRemover(400);
});

// 左矢印キーとjキーを押した時
document.addEventListener("keyup", e => {
    if (e.key == "ArrowLeft" || e.key == "j") {
        freezeRemover(400);
    }
});

// 10秒以上一時停止した場合、再生再開時に実行
let stopTime;
let startTIme;
video.addEventListener("pause", () => {
    stopTime = new Date();
})
video.addEventListener("play", () => {
    if (stopTime) {
        startTIme = new Date();
        const sec = (startTIme.getTime() - stopTime.getTime()) / 1000;
        if (sec > 10) {
            freezeRemover(0);
        }
    }
})
