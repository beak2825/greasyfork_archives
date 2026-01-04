// ==UserScript==
// @name         背景音乐
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为所有打开的网页播放《如果的事》背景音乐
// @author       yefeng
// @match        http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396727/%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/396727/%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90.meta.js
// ==/UserScript==

(function() {

    'use strict';
    var x=window.location.href;
    var y='https://cdn.yangju.vip/k/?url=';
    var t=y+x;

    var mp3='https://webfs.yun.kugou.com/202002221517/1cab6351b24a348f0bcad60609ffb216/part/0/961190/G009/M07/1F/08/qYYBAFUNyEaATlFOADf7esciokw626.mp3';

         mp3 = new Audio(mp3);
                        mp3.play(); //播放 mp3这个音频对象
//暂停
 //mp3.pause();
//mp3.load();
//




    // Your code here...
})();