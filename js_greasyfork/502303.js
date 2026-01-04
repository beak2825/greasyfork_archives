// ==UserScript==
// @name         国家中小学智慧教育平台挂机刷课
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可以后台静音2倍速挂机刷课
// @author       You
// @match        https://basic.smartedu.cn/teacherTraining/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/502303/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E6%8C%82%E6%9C%BA%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/502303/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E6%8C%82%E6%9C%BA%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var videoList;
    var index;   //表示当前播放的视频是第几个

    let Duration=100   //表示记录多长时间的弹窗次数
    var popUpWindowNum=new Array(100)    //记录Duration秒内的弹窗次数，若过于频繁则降低视频倍速
    var Rate=2   //用于设置视频倍速


    function findIndex(){
        //判断当前视频下标
        for(var i=0;i<videoList.length;i++){
                    if(videoList[i].classList.contains('resource-item-active')){
                        return i;
                    }
                 }
    }

    //添加一个监控目录的定时器
    var monitor1=window.setInterval(function(){

        //当视频列表出现时
        if($('.resource-item').length!=0){
             //当视频有多级目录时，先点击所有目录，展开其中内容（因为是懒加载）
            if($('.fish-collapse-header').length!=0){
           $('.fish-collapse-header').each(function(){
               this.click();
           })
            }

            //当视频没有目录，只有视频时
             //直接获取视频队列
            videoList=$('.resource-item');
            console.log("******************")
            console.log(videoList);
            window.clearInterval(monitor1);
        }

    },1000)

    var video;
     window.setInterval(function(){

         //清除弹窗
         if($('.fish-modal-content').length!=0){
             console.log($('.fish-modal-content'))
              $('.fish-modal-content').find('button').click();

             //添加一个触发了弹窗的记录
             popUpWindowNum.unshift(1)
         }else{
             //添加一个没触发弹窗的记录
             popUpWindowNum.push(0)
         }

         //根据弹窗频率调整倍速
         //保持记录的是Duration秒内的数据
         while(popUpWindowNum.length>Duration){popUpWindowNum.pop()}
         var sum=0
         //统计Duration秒内的弹窗次数
         popUpWindowNum.forEach(function(value){
           if(value==1) sum=sum+1;
         })
         if(sum>popUpWindowNum*0.5){
             Rate=2;     //若弹窗率大于50%，则降低速率
         }else if(sum<popUpWindowNum.length*0.25){
             Rate=2;     //若弹窗率小于25%，则速率回到2倍速
         }



         if($('video')[0]!=undefined){
            video=$('video')[0];
           var wc = document.getElementsByClassName("resource-item resource-item-train resource-item-active")[0].getElementsByTagName("i")[0].getAttribute("title")
             //若视频结束了，则跳到下一个视频继续
             //if(video.ended==true||wc=='已学完'){
             if(wc=='已学完'){
                 //判断当前视频是第几个，播放（点击）下一个视频
                 for(var i=0;i<videoList.length;i++){

                        index=findIndex()+1;
                        videoList[index].click();

                 }
             }

             //获取视频的长度
             video.playbackRate=Rate
             video.autoplay=true;
             video.muted=true;
             if(video.paused){
                 video.play();
             }
             //让视频不能暂停，可以后台播放
             video.pause=function(){
                 console.log("别给我停");
             }

         }


     },1000)

})();