// ==UserScript==
// @name         YouTube Ad Skipper2
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Skip YouTube ads
// @author       You
// @match        https://www.youtube.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/478793/YouTube%20Ad%20Skipper2.user.js
// @updateURL https://update.greasyfork.org/scripts/478793/YouTube%20Ad%20Skipper2.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 対象のノードを選択または取得
var targetNode = null;
var movieNode = null;
var duration =null;
    function timeToSeconds(time) {
    var parts = time.split(':').map(Number);
    var seconds = 0;
    if (parts.length === 3) {
        seconds += parts[0] * 3600; // hours to seconds
        seconds += parts[1] * 60;   // minutes to seconds
        seconds += parts[2];        // seconds
    } else if (parts.length === 2) {
        seconds += parts[0] * 60;   // minutes to seconds
        seconds += parts[1];        // seconds
    }
    return seconds;
}


// オブザーバインスタンスを作成
var observer = new MutationObserver(function() {
    if (targetNode && targetNode.hasChildNodes()) {
        console.log("あった");
        duration = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-duration").textContent;

        movieNode.currentTime = timeToSeconds(duration);
        [...document.querySelector("#movie_player > div.video-ads.ytp-ad-module").getElementsByClassName('ytp-ad-skip-button-slot')].forEach(e => e.querySelector('button')?.click());
    } else {
        console.log("なかった");
    }
});

// オブザーバの設定
var config = { attributes: true, childList: true, subtree: true };

// 対象ノードとオブザーバの設定を渡す
var checkExist = setInterval(function() {
   targetNode = document.querySelector("#movie_player > div.video-ads.ytp-ad-module");
   movieNode = document.querySelector("#movie_player > div.html5-video-container > video");
   if (targetNode) {
      observer.observe(targetNode, config);
      clearInterval(checkExist);
   }
}, 100); // check every 100ms

})();
