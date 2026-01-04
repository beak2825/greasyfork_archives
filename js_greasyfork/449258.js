// ==UserScript==
// @name         Bilibili UP blocker B站网页屏蔽up主
// @namespace    https://github.com/LynnXie00
// @version      1.32
// @description  Customizable Bilibili UP blocker via userID
// @author       翎月上弦
// @license      GNU GPLv3
// @match        *search.bilibili.com/*
// @grant        GM_log
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/449258/Bilibili%20UP%20blocker%20B%E7%AB%99%E7%BD%91%E9%A1%B5%E5%B1%8F%E8%94%BDup%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/449258/Bilibili%20UP%20blocker%20B%E7%AB%99%E7%BD%91%E9%A1%B5%E5%B1%8F%E8%94%BDup%E4%B8%BB.meta.js
// ==/UserScript==


'use strict';

//请在blockList内以规范模式输入up主id,以下是例子
var blockList = [
    '路温1900','imeNome','生鱼忧患-_-','暴躁老王不在家','鸭梨表妹','牛蛙公主蔡亨源',
    '此间无双i','伤影zzz','易峥不是易蒸','我就是我祖国的小花朵','一颗珊瑚占星','山雨何处来',
    '三代路人2333号机','传播学刘阳','是相作菌','江郎才俊周公瑾','尾巴说','晚风来ShesWanfeng',
    '西红柿好吃麽','天气兔子来一只','支书小谈','剪视频的张蛋蛋','长安贩栗李素问','雅音面面','圆圆芽',
    '亚历山大巴拉斯','艾米丽的小号','厂妹来了','开心嘴炮','要点赞赞的阿笑','芸希的思考空间'
];

setInterval(function(){

    var InfoAuthorElements = document.querySelectorAll("span.bili-video-card__info--author");
    InfoAuthorElements.forEach(function (author){
        if (blockList.includes(author.textContent.trim())){
            author.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display='none'
        }

    })
    var UpNamesReccomend = document.querySelectorAll(".video-page-card-small .upname span.name");
    UpNamesReccomend.forEach(function (author){
        if (blockList.includes(author.textContent.trim())){
            author.parentNode.parentNode.parentNode.parentNode.parentNode.style.display='none'
        }

    })
    var UpdynName = document.querySelectorAll("span.dyn-orig-author__name");
    UpdynName.forEach(function (author){
        if (blockList.includes(author.textContent.trim())){
            author.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display='none'
        }

    })
    
},1000);

