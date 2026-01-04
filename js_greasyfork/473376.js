// ==UserScript==
// @name         中研企课堂助手
// @namespace    https://greasyfork.org/zh-CN/scripts/473376-%E4%BA%91%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B
// @version     0.1.4.2
// @description 中研企课堂视频网站增强插件，解除不合理限制！
// @author       毛豆&魏勇
// @match        https://ent.toujianyun.com/lesson/*
// @icon         https://ent.toujianyun.com/assets/ico/favicon.ico?v=0.0.1
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473376/%E4%B8%AD%E7%A0%94%E4%BC%81%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473376/%E4%B8%AD%E7%A0%94%E4%BC%81%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function GetPositionNum(a,b){
       for(var i=0;a!=b[i];i++){}
       return i
    }
    function GoToNextPage(){
        var CurrentPageUrl = window.location.href // 获取当前视频课程URL网址
        var VideoList = document.querySelectorAll('a.catalogue-item.new-catalogue-item')//获取视频列表
        var CurrentPositionNum=GetPositionNum(CurrentPageUrl,VideoList)//获取当前页面视频在视频列表中的位置
        var VideoNum = VideoList.length //获取视频个数
        if(CurrentPositionNum+1>VideoNum-1){
            alert("本课程的全部视频已播放完毕")
            //window.location.href="https://ent.toujianyun.com/study?type=1" 
        }
        else{
            var NextPageUrl = VideoList[CurrentPositionNum+1].href//下一节视频课程URL地址
            window.location.href=NextPageUrl //跳转到下一节课程
        }
    }
    setInterval(function () {
        var current_video = document.getElementsByTagName('video')[0]
        current_video.play()
        if(Math.trunc(current_video.currentTime)==Math.trunc(current_video.duration)){
            GoToNextPage()
        }
    }, 1000)

})();