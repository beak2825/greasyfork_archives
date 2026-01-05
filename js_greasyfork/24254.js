// ==UserScript==
// @name        TmBox リピートの無効化
// @namespace   xyz.qpwakaba.tmbox.NoRepeart
// @include     https://tmbox.net/pl/*
// @version     1
// @grant       none
// @description TmBoxのリピート機能を無効化する
// @downloadURL https://update.greasyfork.org/scripts/24254/TmBox%20%E3%83%AA%E3%83%94%E3%83%BC%E3%83%88%E3%81%AE%E7%84%A1%E5%8A%B9%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/24254/TmBox%20%E3%83%AA%E3%83%94%E3%83%BC%E3%83%88%E3%81%AE%E7%84%A1%E5%8A%B9%E5%8C%96.meta.js
// ==/UserScript==

var TARGET = document.getElementById('play-audio-tag');
TARGET.addEventListener('ended', function() {TARGET.pause();});
$('.js-plus-repeart')[0].action = "";