// ==UserScript==
// @name         链工宝自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  链工宝自动播放脚本,可以帮助您自动看视频
// @author       You
// @match        https://*.lgb360.com/*
// @icon         https://www.google.com/s2/favicons?domain=lgb360.com
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/440999/%E9%93%BE%E5%B7%A5%E5%AE%9D%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/440999/%E9%93%BE%E5%B7%A5%E5%AE%9D%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('请主动点击');

    window.onload = function(){
        console.clear();
        //5秒后开始执行自动下一集程序目的是为了让用户有与页面主动交互的时间
        setInterval(resumePlay,1000*1)
         setTimeout(function(){
             console.log('自动程序开始');
             autoNext();
             setInterval(autoNext,1000*1)
         },3000)
    }
    //暂停播放后自动继续播放
    function resumePlay(){
        let warn=$('.videoWarning:visible');
        let warnText=$(warn).find('p').text();
        if(warnText){
               console.log(11);
             $(warn).find('button').trigger('click')

        }
    }
    function autoNext(){
    var dom=$('body #app .videoList ul li');
    $(dom).each((index,item)=>{

         let txt=$(item).find('.hours').text();
         txt=txt.replace('学时：','')
         let txtArr=txt.split('/')
         //console.log('aaaaa')
         if(txtArr[0]!=txtArr[1]){
            //未完成时间
            // console.log('bbbbbb')
             let keCheng=$(item).find('.transition-box')    //每一章节下的课程列表
             $(keCheng).each((key,el)=>{
                 let progress=$(el).find('.record span').text();
                 if(progress!='已观看100%'){
                     //未观看完成,点击观看
                     //console.log('ccccccc','未看完'+key);
                     if(!$(el).hasClass('active')){
                         $(el).find('.left-img').trigger('click');
                         console.log('点击下一集');
                     }else{
 //console.log('正在播放,不用点击')
                     }


                     return false;
                 }else{
                     //console.log('ccccccc','已看完');
                 }
                 //console.log('ccccccc',a);
             })
            // console.log('跳出循环')
             return false;
         }


    })
    }

    // Your code here...
})();