// ==UserScript==
// @name        TmBox 自動再生無効化
// @namespace   xyz.qpwakaba.tmbox.NoAutoStart
// @description TmBoxの自動再生を無効にする
// @include     https://tmbox.net/pl/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24256/TmBox%20%E8%87%AA%E5%8B%95%E5%86%8D%E7%94%9F%E7%84%A1%E5%8A%B9%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/24256/TmBox%20%E8%87%AA%E5%8B%95%E5%86%8D%E7%94%9F%E7%84%A1%E5%8A%B9%E5%8C%96.meta.js
// ==/UserScript==

var TARGET = document.getElementById('play-audio-tag');
TARGET.autoplay = false;
TARGET.addEventListener('loadedmetadata', function () {
    TARGET.pause();
});

