// ==UserScript==
// @name          背景圖片網址
// @namespace     k100466jerry
// @description	  背景圖片網址更新
// @author        k100466jerry
// @run-at        document-start
// @include       https://anime1.me/
// @include       https://anime1.me/*
// @include       https://myself-bbs.com/portal.php
// @include       https://myself-bbs.com/portal.php*
// @include       https://myself-bbs.com/thread
// @include       https://ani.gamer.com.tw/*
// @version       2025.08.24.2244
// @downloadURL https://update.greasyfork.org/scripts/434819/%E8%83%8C%E6%99%AF%E5%9C%96%E7%89%87%E7%B6%B2%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/434819/%E8%83%8C%E6%99%AF%E5%9C%96%E7%89%87%E7%B6%B2%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    //在下方自行增加圖片網址
    var all_pic = [
        "https://i.imgur.com/4lV9S1O.png","https://i.imgur.com/ISASQat.png","https://i.imgur.com/PK9ahcm.png","https://i.imgur.com/rgqvv0E.png","https://i.imgur.com/gIHkgFd.png",
        "https://i.imgur.com/WDBFgbu.png","https://i.imgur.com/nYdaT9z.png","https://i.imgur.com/BU1dS2R.png","https://i.imgur.com/cR5q0ny.png","https://i.imgur.com/SNG0E7d.png",
        "https://i.imgur.com/ZLfGoPN.png","https://i.imgur.com/m7VCRpo.png","https://i.imgur.com/tuu44gs.png","https://i.imgur.com/bkUs78D.png","https://i.imgur.com/RbCGj1f.png",
        "https://i.imgur.com/MN4cwot.png","https://i.imgur.com/EEq69bY.png","https://i.imgur.com/KdTwDXB.png","https://i.imgur.com/eQlFFYP.png","https://i.imgur.com/zxJqfAH.png"
    ];

    localStorage.setItem('背景圖片網址連結', JSON.stringify(all_pic));
})();