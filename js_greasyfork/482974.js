// ==UserScript==
// @name              YouTube Ad any time Skipper 
// @namespace         http://tampermonkey.net/
// @version           1.1
// @description       いつでもyoutubeの広告スキップボタンを押すことができます。
// @description:zh-cn 您可以随时按下 Youtube 广告跳过按钮。
// @description:en    You can any time press the ad skip button on youtube.
// @author            You
// @match             https://www.youtube.com/*
// @grant             none
// @name:zh-CN        YouTube Ad any time Skipper 
// @name:en           YouTube Ad any time Skipper
// @run-at       document-end
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/482974/YouTube%20Ad%20any%20time%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/482974/YouTube%20Ad%20any%20time%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
var skipbutton = document.querySelector("#movie_player > div.html5-video-container > video");
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


function handleImgClick() {
        duration = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-duration").textContent;

    skipbutton.currentTime = timeToSeconds(duration);
    [...document.querySelector("#movie_player > div.video-ads.ytp-ad-module").getElementsByClassName('ytp-ad-skip-button-slot')].forEach(e => e.querySelector('button')?.click());
}

var classNames = ['ytp-ad-skip-ad-slot', 'ytp-ad-preview-slot','ytp-ad-preview-container'];

// setIntervalを作成します。
var intervalId = setInterval(function() {
    for (var i = 0; i < classNames.length; i++) {
        var skipAdSlot = document.querySelector("#movie_player > div.video-ads.ytp-ad-module").getElementsByClassName(classNames[i])[0];
        if (skipAdSlot) {
            var spanElement = skipAdSlot.getElementsByTagName('span')[0];
            spanElement.addEventListener('click', handleImgClick);
        }
    }
}, 1000); // 1秒ごとにチェックします。

// 必要に応じて、setIntervalを停止するためにclearInterval(intervalId)を呼び出すことができます。



})();