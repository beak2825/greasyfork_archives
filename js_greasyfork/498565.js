// ==UserScript==
// @name         2024广东省教师继续教育信息管理平台公需课
// @namespace    http://tampermonkey.net/
// @version      2024-06-21
// @description  蹩脚的代码小子写的，不太认识前端语言，拼拼凑凑脚本小子，能跑起来的代码就是好代码
// @author       ZQH
// @match        https://jsxx.gdedu.gov.cn/*/study/*
// @match        https://jsxx.gdedu.gov.cn/study/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gdedu.gov.cn
// @grant        none
// @license      ZQH
// @downloadURL https://update.greasyfork.org/scripts/498565/2024%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/498565/2024%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取视频元素并关闭它的音量
    // 首次执行检查

    //reload();

    var Video = document.querySelector('video');
    Video.muted = true;//音量设置为0
    Video.play(); //播放视频
    var btn=document.querySelector('.mylayer-btn.type1'); //已完成视频弹框按钮


    if(btn){
        btn.click();//点击
    }
    else{
        Video.volume = 0;//音量设置为0
        Video.play(); //播放视频
    }
 // 设置定时器，每隔3分钟（3 * 60 * 1000毫秒）执行一次上述函数
    //setInterval(reload, 5* 60* 1000); //5分钟
    setInterval(checkAndPerformAction, 1 * 30 * 1000);

    // 定义一个函数，用于检查元素是否存在，并执行相应操作
function checkAndPerformAction() {
    // 检查元素是否存在
        //题目
    var topic=document.querySelector('.m-topic.m-topic01');
    var A=document.querySelector('[value="Choice0"]');
    var B=document.querySelector('[value="Choice1"]');
    var submit=document.querySelector('.btn.u-main-btn');
    if (topic) {
        //存在题目
            console.log('检测到题目弹窗，即将进行答题');
            A.click();//选A
        console.log('选A...');
            setTimeout(submit.click(), 5000);//提交
        console.log('提交.');
        if (topic) {
        //还存在题目
            console.log('检测到题目弹窗，即将进行答题');
            B.click();//选B
        console.log('选B...');
            setTimeout(submit.click(), 5000);//提交
        console.log('提交.');
    }
    } else {
        // 元素不存在，重新设置定时器
        console.log('题目不存在，再次检查...');
    }
    var layerbtn=document.querySelector('.mylayer-btn.type1');
    var ne=document.querySelector('.btn.next.crt');
    var a=document.querySelector('.mylayer-content.has-icon');
    if(a){
       console.log('已完成本活动');
       layerbtn.click();
       if(ne){
       ne.click();}
    }else{
    console.log('未完成本活动');
    }

    // 获取视频元素
const video = document.querySelector('video');

// 检查视频是否正在播放
if (video && !video.paused) {
  console.log('视频正在播放');
} else {
  console.log('视频未播放或已暂停');
   if(ne){
       ne.click();}
}
}
  function reload() {
    location.reload();

  }
})();