// ==UserScript==
// @name         虎牙自动领取每日任务
// @namespace    https://greasyfork.org/
// @version      1.5
// @description  自动领取虎牙每日任务奖励
// @author       楚徐坤
// @match        http*://www.huya.com/*
// @grant        none
// @icon         http://livewebbs2.msstatic.com/denglu.png
// @downloadURL https://update.greasyfork.org/scripts/407898/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/407898/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 360秒执行一次，可调整，过快会影响浏览器性能
    var time = 360;
    
    $(window).ready(() =>{
        setTimeout(runThis, 6e3);
        setInterval(runThis, time * 1e3);
    });
    
    function runThis() {
        $(".nav-user-title").mouseenter();
        setTimeout(function() {
            var reward = $(".status-get");
            reward.each(function() {
                this.click();
                console.log("领取成功");
            });
        }, 6e3);
    };
})();

