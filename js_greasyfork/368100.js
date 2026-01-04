// ==UserScript==
// @name         萌宝召集令
// @namespace    http://fangweijie.me/
// @version      0.2
// @description  try to take over the world!
// @author       fangweijie
// @match        *://wx.pg.com.cn/Public/app/135/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368100/%E8%90%8C%E5%AE%9D%E5%8F%AC%E9%9B%86%E4%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/368100/%E8%90%8C%E5%AE%9D%E5%8F%AC%E9%9B%86%E4%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function randomWord(randomFlag, min, max){
    var str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        let pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
    }
    let t = setTimeout(function () {
        window.location.href = "https://wx.pg.com.cn/Public/app/135/index.html?nid=MbT" + randomWord(false, 7) + "&state=1&mk=0";
    }, 5000);
})();