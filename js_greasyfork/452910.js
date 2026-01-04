// ==UserScript==
// @name         山东省执业药师继续教育
// @namespace    http://ce.jllpa.cn:9080
// @version      0.1
// @description  执业药师继续教育--屏蔽视频页弹窗，考试自动显示答案
// @author       星星课
// @match        http://www.sdlpa.org.cn/Learning/VideoH52/*?cId=*&wId=*
// @match        http://www.sdlpa.org.cn/Exam/SingleExam/*?cid=*
// @icon         	http://www.sdlpa.org.cn/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452910/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/452910/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    setInterval(() => {
        if(typeof  player!="undefined"){
            player.volume=0;
            if(player.currentTime<player.duration)if(player.paused==true)player.play();
            $('#bulletTime').val(9999999999);}
        var answer_tag=document.getElementById("answerDiv");
        if(answer_tag)answer_tag.setAttribute('style', '');
 
    },3e3);
 
 
})();