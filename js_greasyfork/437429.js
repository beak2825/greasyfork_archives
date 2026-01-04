// ==UserScript==
// @name          B站视频自动点赞
// @match        *://www.bilibili.com/video/*
// @version      20230924
// @description  需要等待页面加载完后，再留给一点时间去加载显示是否已经点赞
// @author       herock
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/287839
// @downloadURL https://update.greasyfork.org/scripts/437429/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/437429/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try{
        let sec = 20 // 单位是s， 停留多少s后进行点赞
        let str = '#arc_toolbar_report .video-like.video-toolbar-left-item'
        let strOn = str + '.on'
        function getEl(str) {
            return document.querySelectorAll(str)
        }
        let t2 = setInterval(function () {
            let El = getEl(str)
            let ElOn = getEl(strOn)
            if (ElOn.length !== 1) {
                El[0].click()
                clearInterval(t2)
            } else if (ElOn.length === 1) {
                clearInterval(t2)
            }
        }, sec * 1000)
        t2
    }catch(e){
    }

})();