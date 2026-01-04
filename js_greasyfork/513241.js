// ==UserScript==
// @name         华源上岗培训挂机学习脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  全自动挂机学习
// @author       Cylon
// @match        https://e-learning.zzfund.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513241/%E5%8D%8E%E6%BA%90%E4%B8%8A%E5%B2%97%E5%9F%B9%E8%AE%AD%E6%8C%82%E6%9C%BA%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/513241/%E5%8D%8E%E6%BA%90%E4%B8%8A%E5%B2%97%E5%9F%B9%E8%AE%AD%E6%8C%82%E6%9C%BA%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function jumpnext(){
        var next = document.querySelector('.title.headerborder.pr24').querySelector('button.yxtf-button.ml12.yxtf-button--default.is-plain.is-icon');
        next.click();
        try {
            var nextgroup = document.querySelector('.mt12.text-right');
            var pregroup = document.querySelector('.mt16.ph12').querySelector('span').textContent.substring(0, 30);
            if(nextgroup && pregroup !='您正在学习培训中的“课程包”任务，是否确认切换到培训的上一个' ){
                 var jumpnextgroup = nextgroup.querySelector('button.yxtf-button.yxtf-button--primary');
                jumpnextgroup.click();
                console.log('跳过组');
                console.log(jumpnextgroup);
            }
        }catch (error) {
    // 捕获并处理任何错误
    console.error('无需跳过组');
    }
    }
    function clickContinueLearningButton() {
        try {
        var button = document.querySelector('button.yxtf-button.yxtf-button--primary.yxtf-button--large');
        var dialogWrapper = button.parentElement.parentElement.parentElement.parentElement.parentElement;

        if (button&& dialogWrapper.style.display != 'none') {
            button.click();
            console.log('继续学习.');
        } else {
            //console.log('Button not found.');
        }
        }catch (error) {
    // 捕获并处理任何错误
    //console.log('未被暂停');
    }
    }
     function jumpexam() {
        try {
            var exam = document.querySelector('.yxtf-tooltip.ulcdsdk-ellipsis-2.ulcdsdk-coursetitle.ulcdsdk-break.item.ulcdsdk-coursetitle__active') ;
        if (exam.textContent.substring(0, 2) == "考试"){
            console.log('进入考试.');
            jumpnext();
            }
        }
        catch (error) {
    // 捕获并处理任何错误
    console.log('未找到考试');
    }
     }
    function learnedjump(){
       try{
           var learned = document.querySelector('.yxtf-tooltip.ulcdsdk-ellipsis-2.ulcdsdk-coursetitle.ulcdsdk-break.item.ulcdsdk-coursetitle__active');
           var nextElement = learned.parentElement.nextElementSibling;
           var pathElement = nextElement.querySelector('path');
           var fillColor = pathElement.getAttribute('fill');
           var now = new Date();
           if (learned.textContent.substring(0, 2) == "视频" && fillColor=="#52C41A"){
               console.log(learned.textContent);
               console.log(now);
            console.log('已观看，跳过');
            jumpnext();
            }
       }
        catch (error) {
    // 捕获并处理任何错误
    console.log('未观看',error);
    }
    }
    function cancle(){
        try{
            var learned = document.querySelector('.yxtf-tooltip.ulcdsdk-ellipsis-2.ulcdsdk-coursetitle.ulcdsdk-break.item.ulcdsdk-coursetitle__active');
            if (learned.textContent.substring(0, 2) == "视频"){
                var interupt = document.querySelector('.mt16.ph12').querySelector('span').textContent.substring(0, 7);
                if(interupt ="您正在学习培训"){
                   document.querySelector('.mt12.text-right').querySelector('button.yxtf-button.yxtf-button--default.is-plain').click();
                }
            }
            }catch (error) {
    //console.error('无需取消遮挡');
    }

    }

    // 每秒检查一次按钮是否存在
    setInterval(clickContinueLearningButton, 3000);
//    setInterval(checkolad, 3000);
    setInterval(jumpexam, 3000);
//    setInterval(playfinishjump, 3000);
    setInterval(learnedjump, 3000);
    setInterval(cancle, 10000);
})();