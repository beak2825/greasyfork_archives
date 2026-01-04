// ==UserScript==
// @name         网课
// @namespace    Lazy007
// @version      0.1
// @description  华南师范大学 - 一师一优课，一课一名师评比活动的教学提升技巧【自动跳转，自动关闭视频弹框。注意：评论不会自动回答】
// @author       Lazy007
// @match        http://www.scnunet.com/ncts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420642/%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/420642/%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval( function () {
        let tip = document.getElementsByClassName('g-study-prompt')[0].firstElementChild.innerText;
        if (tip.indexOf("您已完成观看") !== -1 || tip.indexOf("评论") !== -1) { // 跳过评论
            goNext();
            return;
        }

        let arr_time = tip.match(/\d+/g);
        let totle_length = parseInt(arr_time[0]); // 获取总时间
        let current_time = parseInt(arr_time[1]); // 获取当前时间

        if (current_time >= totle_length){
            goNext();
            return;
        }

        let wrap = document.getElementsByClassName("mylayer-btn mylayer-btn3 type0"); // 暂停弹框
        wrap.length && wrap[0].click();

        let player = document.getElementsByClassName('fp-player');
        if (player.length) {
            player[0].firstElementChild.paused && player[0].firstElementChild.play();
        }

    }, 3000);
})();
