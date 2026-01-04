// ==UserScript==
// @name         Knzk_singing
// @namespace    https://github.com/yuzulabo
// @version      1.1.5
// @description  おにいさんがうたいます
// @author       neziri_wasabi (yuzu_1203)
// @match        https://knzk.me/*
// @match        https://friends.nico/*
// @license       MIT License
// @downloadURL https://update.greasyfork.org/scripts/32612/Knzk_singing.user.js
// @updateURL https://update.greasyfork.org/scripts/32612/Knzk_singing.meta.js
// ==/UserScript==

(function() {
    var audio_src  = Array();
    //これを足すとバリエーションが増えるよ
    audio_src[0] = "https://s3.mqube.net/t/files/item/file/201708/20170803218835/adcd0456.wav";
    audio_src[1] = "https://s3.mqube.net/t/files/item/file/201708/20170804623468/766aac33.wav";

    var audio_rand = Math.floor(Math.random()*audio_src.length);
    var nav = document.getElementsByClassName('drawer__inner');

    var audio_elem = document.createElement('audio');
    audio_elem.src = audio_src[audio_rand];
    audio_elem.setAttribute('style', 'width: 100%;');
    audio_elem.setAttribute('controlslist', 'nodownload');
    audio_elem.setAttribute('controls', '1');
    audio_elem.setAttribute('autoplay', '1');
    audio_elem.setAttribute('loop', '1');

    window.onload = function () {
        nav[0].appendChild(audio_elem);
    };
})();
