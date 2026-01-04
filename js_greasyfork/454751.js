// ==UserScript==
// @name         Simple Youtube Surround
// @name:ko    유튜브 서라운드
// @name:zh-CN    简单YouTube环境
// @namespace       https://github.com/KBluePurple/youtube-delay
// @supportURL      https://github.com/KBluePurple/youtube-delay/issues
// @version      0.2
// @description  Makes the youtube sound more surrounded ( It's better when you listen to music )
// @description:ko  조금 더 서라운드를 느낄 수 있도록 해줍니다. ( 노래를 들을 때 더 좋음 )
// @description:zh-CN 让您再感受一点环绕感。 （听歌的时候更好）
// @author       KBluePurple
// @match           https://www.youtube.com/*
// @match           https://music.youtube.com/*
// @match           https://m.youtube.com/*
// @match           https://www.youtube-nocookie.com/*
// @license MIT
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454751/Simple%20Youtube%20Surround.user.js
// @updateURL https://update.greasyfork.org/scripts/454751/Simple%20Youtube%20Surround.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const context = new AudioContext();
    const video = document.querySelector("#movie_player > div.html5-video-container > video");
    const source = context.createMediaElementSource(video);

    const splitter = context.createChannelSplitter(2);
    const merger = context.createChannelMerger(2);

    const leftDelay = context.createDelay();
    const rightDelay = context.createDelay();

    leftDelay.delayTime.value = 0;
    rightDelay.delayTime.value = 0.01;

    source.connect(splitter);

    splitter.connect(leftDelay, 0);
    splitter.connect(rightDelay, 1);

    leftDelay.connect(merger, 0, 0);
    rightDelay.connect(merger, 0, 1);

    merger.connect(context.destination);

})();
