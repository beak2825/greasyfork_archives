// ==UserScript==
// @name         bilibili纯净版-除视频外去除一切内容
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  给你纯净视频页面 排除视频页全部的外部干扰 避免学习时被外界打扰 b站沉浸式学习 bilibili沉浸式学习1.1版
// @author       Thedust
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license AGPL License
// @downloadURL https://update.greasyfork.org/scripts/458458/bilibili%E7%BA%AF%E5%87%80%E7%89%88-%E9%99%A4%E8%A7%86%E9%A2%91%E5%A4%96%E5%8E%BB%E9%99%A4%E4%B8%80%E5%88%87%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/458458/bilibili%E7%BA%AF%E5%87%80%E7%89%88-%E9%99%A4%E8%A7%86%E9%A2%91%E5%A4%96%E5%8E%BB%E9%99%A4%E4%B8%80%E5%88%87%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

     setTimeout(function(){
      //懒加载导致的广告内容需要1秒后才能去除
      var rr = document.getElementById("right-bottom-banner"); //广告
      rr.setAttribute('style','display:none');
      var guangGao =document.getElementsByClassName("vcd");//广告
      var lt = document.getElementById("live_recommand_report");//推广 直播

     // var reco_list = document.getElementById("reco_list");//推荐播放列
      var ll= document.getElementsByClassName("video-data-list")[0];//获取按键位置
     //有广告了再删除
     if(guangGao.length!=0){
      for(var i=0;i<guangGao.length;i++){
       guangGao[i].setAttribute('style','display:none');
      }
     }
     //有推广了再删除
     if(lt!=null){
      lt.setAttribute('style','display:none');
     }



    },2000)

   setTimeout(function(){
       var lll= document.getElementsByClassName("video-data-list")[0];//获取按键位置
       var reco_list = document.getElementById("reco_list");//推荐播放列
            //推荐视频列隐藏
      reco_list.setAttribute('style','display:none');
      var newNodeCenter = document.createElement("button");
     newNodeCenter.innerHTML = "显示推荐视频";
     newNodeCenter.style.color = "red";
     lll.appendChild(newNodeCenter);
     newNodeCenter.onclick=function(){
     if(newNodeCenter.innerHTML == "显示推荐视频"){
      reco_list.setAttribute('style','display:');
      newNodeCenter.innerHTML = "隐藏推荐视频";
     }else{
      reco_list.setAttribute('style','display:none');
      newNodeCenter.innerHTML = "显示推荐视频";
     }}

       //评论区去除
       var nr = document.createElement("button");
       var lPlayer = document.getElementsByClassName("left-container-under-player")[0];
       lPlayer.setAttribute('style','display:none');
       var lPlayerButton = document.createElement("button");
       lPlayerButton.innerHTML="显示评论区";
       lPlayerButton.style.color = "orange";
       lll.appendChild(lPlayerButton);
       lPlayerButton.onclick=function(){
           if( lPlayerButton.innerHTML=="显示评论区"){
           lPlayer.setAttribute('style','display:');
       lPlayerButton.innerHTML="隐藏评论区";
           }else{
            lPlayer.setAttribute('style','display:none');
       lPlayerButton.innerHTML="显示评论区";
           }
       }

       //顶部bar
       var biliMainHeader = document.getElementById("biliMainHeader");//顶部信息栏
        var biliMainHeaderButton = document.createElement("button");
       biliMainHeader.setAttribute('style','display:none');
       biliMainHeaderButton.innerHTML="显示顶部bar";
       biliMainHeaderButton.style.color = "blue";
       lll.appendChild(biliMainHeaderButton);
       biliMainHeaderButton.onclick=function(){
           if( biliMainHeaderButton.innerHTML=="显示顶部bar"){
           biliMainHeader.setAttribute('style','display:');
       biliMainHeaderButton.innerHTML="隐藏顶部bar";
           }else{
            biliMainHeader.setAttribute('style','display:none');
       biliMainHeaderButton.innerHTML="显示顶部bar";
           }
       }

       //侧边栏
var rightContainer = document.getElementsByClassName("right-container")[0];
       var rightContainerButton = document.createElement("button");
       rightContainerButton.innerHTML="隐藏侧边";
       rightContainerButton.style.color = "green";
       lll.appendChild(rightContainerButton);
       rightContainerButton.onclick=function(){
           if( rightContainerButton.innerHTML=="隐藏侧边"){
           rightContainer.setAttribute('style','display:none');
       rightContainerButton.innerHTML="显示侧边";
           }else{
            rightContainer.setAttribute('style','display:');
       rightContainerButton.innerHTML="隐藏侧边";
           }
       }

//手动广告去除
       lPlayer.setAttribute('style','display:none');
     nr.innerHTML = "手动去除广告";
        nr.style.color = "black";
       nr.style.display="block";
     lll.appendChild(nr);
       nr.onclick=function(){
       var rr = document.getElementById("right-bottom-banner"); //广告
       var videoAd = document.getElementsByClassName("video-card-ad-small")[0]; //广告

           videoAd.setAttribute('style','display:none');
           rr.setAttribute('style','display:none');
       }

       //背景颜色选择
       var p = document.createElement("p");
       p.innerHTML = "选择背景颜色:";
       lll.appendChild(p);
       var colors = document.createElement("input");
       colors.type="color";
       colors.id = 'colors';
       colors.value = '#ffffff';

       lll.appendChild(colors);
       var backg = document.getElementsByClassName("video-container-v1")[0];
       var colorss = document.getElementById("colors");
       backg.onclick=function(){
          backg.setAttribute('style','background-color:'+colorss.value);
       }


   },2100)





})();