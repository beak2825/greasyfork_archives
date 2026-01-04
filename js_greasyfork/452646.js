// ==UserScript==
// @name         禁止摸鱼
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  这位同学，你也不想打开的XXX被身后的领导看见吧
// @author       7nc

// @match        *://www.zhihu.com
// @match        *://www.youtube.com
// @match        *://www.gamersky.com/*
// @match        *://weibo.com/*
// @match        *://twitter.com/*
// @match        *://www.bilibili.com/*
// @match        *://www.mysmth.net/*
// @match        *://tieba.baidu.com/*
// @match        *://www.pornhub.com/*
// @match        *://bbs.nga.cn/*
// @match        *://www.3dmgame.com/*
// @match        *://store.epicgames.com/*
// @match        *://store.steampowered.com/*
// @match        *://www.douyin.com/*
// @match        *://www.xiaohongshu.com/*
// @match        *://xueqiu.com/*
// @match        *://www.taobao.com/*
// @match        *://www.jd.com/*

// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/452646/%E7%A6%81%E6%AD%A2%E6%91%B8%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/452646/%E7%A6%81%E6%AD%A2%E6%91%B8%E9%B1%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
     console.log("no play");
    // 上班时间，下班时间
    var WORK_ON=10;
    var WORK_OFF=19;

    var currentDate = new Date();
    var hour = currentDate.getHours();
    console.log(hour);
    // 下班期间，可以摸鱼
    if(hour<WORK_ON || hour >WORK_OFF){
       return;
    }

    // 上班时间，禁止摸鱼
     document.getElementsByTagName("body")[0].setAttribute("style","display:none");
     setTimeout(function(){
          alert("上班期间，禁止摸鱼")
     },100);

})();