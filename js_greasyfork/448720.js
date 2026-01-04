// ==UserScript==
// @name         链工宝挂机，自动切换视频
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  新手上路。链工宝自动播放视频。EDGE下2022.8亲测可用，激活后在顶部会出现‘开始挂机’，点击即可。完全模拟人工
// @author       yq
// @match        https://*.lgb360.com/*
// @icon         https://www.google.com/s2/favicons?domain=lgb360.com
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/448720/%E9%93%BE%E5%B7%A5%E5%AE%9D%E6%8C%82%E6%9C%BA%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/448720/%E9%93%BE%E5%B7%A5%E5%AE%9D%E6%8C%82%E6%9C%BA%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {


    'use strict';
    console.log('请主动点击');
    var isAlive=false //是否开始挂机
    var videoDir=[]//视频列表
    var intervalNum=30//间隔时间（秒）

    window.onload = function(){
        console.clear();
        videoDir=document.querySelectorAll('.transition-box')
        createEle();
    }
    //循环检查
    function checkVideo(aaa){
        //检测视频状态
        if(!resumePlay()){
            //如果已经播放完成
            NextVideo(aaa)
            console.log('检测结束')
        }
    }
    //创建控件
    function createEle(){
        var button = document.createElement("el-button"); //创建一个input对象（提示框按钮）
        button.id = "id001";
        button.textContent = "开始挂机";
        button.style.width = "60px";
        button.style.height = "20px";
        button.style.align = "center";
        button.style.color='red';
        //绑定按键点击功能
        button.onclick = function (){
            console.clear()
            console.log('点击了按键');
            isAlive=!isAlive
            if(isAlive){
                this.innerHTML='结束挂机'
                window.setTimeout(function(){ checkVideo(videoDir);},1000);
                var t2 = window.setInterval(function(){
                    if(isAlive){
                        checkVideo(videoDir)
                    }else{
                        alert('可以开始挂机了')
                        window.clearInterval(t2)
                    };
                },intervalNum*1000);
            }else{
                //alert('请等待'+intervalNum+'秒后或刷新，才可以重新开始挂机,否则会重复执行')
                alert('页面即将刷新')
                location.reload()
                //this.innerHTML='开始挂机'
            }
            return;
        };
        document.querySelector('.left-tabs').appendChild(button)
    }
    //查找下一个视频
    function NextVideo(ddd){
        for(var i=0;i<ddd.length;i++)
        {
            var t= ddd[i].querySelector('.record span')
            // console.log(t)
            if(t.innerHTML!='已观看100%')
            {
                console.log('正准备播放第'+(i+1)+'个视频'+ (new Date()))
                ddd[i].click()
                return true;
            }
        }
        isAlive=false;
        return false;
    }
    //检测视频状态，完成则切换下一个视频，暂停了继续播放
    function resumePlay(){
        console.log('正在检查视频状态')
        var state= document.querySelector('.transition-box.active').querySelector('.record span')
        var videoState= document.querySelector('video').paused
        var currentTime=document.querySelector('video').currentTime
        var duritime=document.querySelector('video').duration
        // console.log(state)
        if(state.innerHTML=='已观看100%')
        {
            console.log('播放完成1')
            return false
        }
        if(videoState){
            if(currentTime==duritime)
            {
                console.log('播放完成2')
                return false
            }
            else{
                console.log('视频暂停中……')
                var videoWarning=document.querySelectorAll('.videoWarning')
                for(var k=0;k<videoWarning.length;k++)
                {
                    videoWarning[k].style.display='none'
                }
                document.querySelector('video').play()
                return true
            }
        }
        return true
    }
})();